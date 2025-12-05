"""
UE5 Scenario Generator with Gemini API
Token-efficient two-pass generation system
"""

import json
import os
import re
import google.generativeai as genai
from pathlib import Path

class ScenarioGenerator:
    def __init__(self, api_key, templates_path=None):
        """Initialize the generator with Gemini API"""
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Load templates
        if templates_path is None:
            templates_path = Path(__file__).parent.parent / 'templates' / 'scenario_templates.json'
        
        with open(templates_path, 'r', encoding='utf-8') as f:
            self.templates = json.load(f)
        
        self.token_count = 0
        
    def log_tokens(self, prompt, response):
        """Track token usage"""
        # Rough estimation: ~4 chars per token
        input_tokens = len(prompt) // 4
        output_tokens = len(response) // 4
        self.token_count += input_tokens + output_tokens
        print(f"📊 Tokens used: ~{input_tokens + output_tokens} (Total: ~{self.token_count})")
        return input_tokens + output_tokens
    
    def generate_scenario_outline(self, raw_scenario):
        """
        PASS 1: Generate decision tree outline (lightweight)
        Input: Raw scenario data from raw_data.json
        Output: Step-by-step outline without detailed prompts
        """
        category = raw_scenario['scenario']['focus_area']
        
        # Get relevant wrong answer templates
        category_key = self._map_category_to_template(category)
        wrong_templates = self.templates['wrong_answers'].get(category_key, [])
        
        prompt = f"""Convert this UE5 debugging scenario to a step-by-step assessment outline.

SCENARIO:
Title: {raw_scenario['scenario']['title']}
Problem: {raw_scenario['scenario']['problem_description']}
Category: {category}

CORRECT STEPS ({len(raw_scenario['scenario']['correct_solution_steps'])} steps):
{self._format_steps(raw_scenario['scenario']['correct_solution_steps'])}

WRONG STEPS ({len(raw_scenario['scenario']['common_wrong_steps'])} steps):
{self._format_wrong_steps(raw_scenario['scenario']['common_wrong_steps'])}

TASK:
Create a JSON outline with this structure:
{{
  "scenario_id": "{raw_scenario['scenario']['scenario_id']}",
  "total_steps": <number>,
  "steps": [
    {{
      "step_num": 1,
      "correct_action": "<brief action>",
      "time_cost": <hours>,
      "wrong_action": "<brief wrong action>",
      "time_penalty": <hours>
    }}
  ]
}}

RULES:
- Each step needs ONE correct choice and ONE wrong choice
- Use these wrong answer types when relevant: {', '.join(wrong_templates[:3])}
- Keep actions brief (will expand later)
- Match time costs from source data
- Return ONLY valid JSON, no markdown

JSON:"""

        response = self.model.generate_content(prompt)
        self.log_tokens(prompt, response.text)
        
        # Extract JSON from response
        outline = self._extract_json(response.text)
        return outline
    
    def expand_scenario_details(self, outline, raw_scenario):
        """
        PASS 2: Expand outline into full scenario with prompts/feedback
        Input: Outline from Pass 1 + raw scenario
        Output: Complete scenario ready for conversion to .js
        """
        category = raw_scenario['scenario']['focus_area']
        
        prompt = f"""Expand this scenario outline into full assessment content.

OUTLINE:
{json.dumps(outline, indent=2)}

ORIGINAL PROBLEM:
{raw_scenario['scenario']['problem_description']}

TASK:
For each step, generate:
1. A clear prompt asking "What do you do next?" after describing the situation
2. Correct choice text (detailed, specific UI navigation)
3. Wrong choice text (plausible mistake)
4. Feedback for correct: "Optimal Time Logged: Xhrs. Correct approach."
5. Feedback for wrong: "Extended Time Logged: +Xhrs. This approach wastes time."

Return JSON:
{{
  "steps": [
    {{
      "step_num": 1,
      "prompt": "<situation description>",
      "correct_text": "<detailed correct action>",
      "correct_feedback": "<feedback>",
      "wrong_text": "<detailed wrong action>",
      "wrong_feedback": "<feedback>"
    }}
  ]
}}

RULES:
- Prompts should describe current state, not repeat the action
- Actions should be specific (exact menu paths, property names)
- Wrong answers should be realistic mistakes developers make
- Keep HTML formatting minimal (<p>, <strong> only)
- Return ONLY valid JSON

JSON:"""

        response = self.model.generate_content(prompt)
        self.log_tokens(prompt, response.text)
        
        details = self._extract_json(response.text)
        return details
    
    def merge_outline_and_details(self, outline, details, raw_scenario):
        """Merge Pass 1 and Pass 2 into final scenario structure"""
        scenario = {
            "meta": {
                "title": raw_scenario['scenario']['title'],
                "description": raw_scenario['scenario']['problem_description'],
                "estimateHours": raw_scenario['scenario']['estimated_hours'],
                "category": raw_scenario['scenario']['focus_area']
            },
            "start": "step-1",
            "steps": {}
        }
        
        # Build steps
        for i, (outline_step, detail_step) in enumerate(zip(outline['steps'], details['steps']), 1):
            step_key = f"step-{i}"
            
            scenario['steps'][step_key] = {
                "skill": self._map_category_to_skill(raw_scenario['scenario']['focus_area']),
                "title": f"Step {i}",
                "prompt": f"<p>{detail_step['prompt']}</p><p><strong>What do you do next?</strong></p>",
                "choices": [
                    {
                        "text": f"<p>{detail_step['correct_text']}</p>",
                        "type": "correct",
                        "feedback": f"<p>{detail_step['correct_feedback']}</p>",
                        "next": f"step-{i+1}" if i < len(outline['steps']) else "conclusion"
                    },
                    {
                        "text": f"<p>{detail_step['wrong_text']}</p>",
                        "type": "wrong",
                        "feedback": f"<p>{detail_step['wrong_feedback']}</p>",
                        "next": step_key  # Loop back to same step
                    }
                ]
            }
        
        # Add conclusion
        scenario['steps']['conclusion'] = {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario.</p>",
            "choices": []
        }
        
        return scenario
    
    def generate_full_scenario(self, raw_scenario):
        """
        Complete two-pass generation
        Returns: Final scenario dict ready for .js conversion
        """
        print(f"\n🚀 Generating scenario: {raw_scenario['scenario']['title']}")
        print("=" * 80)
        
        # Pass 1: Outline
        print("\n📝 PASS 1: Generating outline...")
        outline = self.generate_scenario_outline(raw_scenario)
        print(f"✅ Generated {len(outline['steps'])} steps")
        
        # Pass 2: Details
        print("\n📝 PASS 2: Expanding details...")
        details = self.expand_scenario_details(outline, raw_scenario)
        print(f"✅ Expanded {len(details['steps'])} steps")
        
        # Merge
        print("\n🔧 Merging outline and details...")
        scenario = self.merge_outline_and_details(outline, details, raw_scenario)
        print(f"✅ Final scenario has {len(scenario['steps']) - 1} steps + conclusion")
        
        return scenario
    
    def validate_scenario(self, scenario):
        """Validate scenario structure before saving"""
        errors = []
        
        # Check required fields
        if 'meta' not in scenario:
            errors.append("Missing 'meta' section")
        if 'start' not in scenario:
            errors.append("Missing 'start' field")
        if 'steps' not in scenario:
            errors.append("Missing 'steps' section")
        
        # Check step flow
        if scenario.get('start') not in scenario.get('steps', {}):
            errors.append(f"Start step '{scenario['start']}' not found in steps")
        
        # Check each step
        for step_key, step in scenario.get('steps', {}).items():
            if step_key == 'conclusion':
                continue
                
            if 'choices' not in step or len(step['choices']) < 2:
                errors.append(f"Step {step_key} needs at least 2 choices")
            
            # Check next references
            for choice in step.get('choices', []):
                next_step = choice.get('next')
                if next_step and next_step not in scenario['steps']:
                    errors.append(f"Step {step_key} references non-existent step: {next_step}")
        
        if errors:
            print("❌ VALIDATION ERRORS:")
            for error in errors:
                print(f"  - {error}")
            return False
        
        print("✅ Validation passed")
        return True
    
    def save_scenario_js(self, scenario, output_path):
        """Convert scenario dict to .js file format"""
        scenario_id = output_path.stem
        
        js_content = f"window.SCENARIOS['{scenario_id}'] = {json.dumps(scenario, indent=4)};\n"
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"💾 Saved to: {output_path}")
    
    # Helper methods
    
    def _map_category_to_template(self, category):
        """Map scenario category to template category"""
        mapping = {
            'Lighting & Rendering': 'lighting',
            'Blueprints & Logic': 'blueprints',
            'Materials & Shaders': 'materials',
            'World Partition & Streaming': 'world_partition',
            'Physics & Collisions': 'physics',
            'Performance & Optimization': 'performance'
        }
        return mapping.get(category, 'lighting')
    
    def _map_category_to_skill(self, category):
        """Map category to skill tag"""
        mapping = {
            'Lighting & Rendering': 'lightingrendering',
            'Blueprints & Logic': 'blueprintslogic',
            'Materials & Shaders': 'materialsshaders',
            'World Partition & Streaming': 'worldpartition',
            'Physics & Collisions': 'physicscollisions',
            'Performance & Optimization': 'performance'
        }
        return mapping.get(category, 'general')
    
    def _format_steps(self, steps):
        """Format correct steps for prompt"""
        return '\n'.join([f"{i+1}. {step['step_description']} (Time: {step['time_cost']}hrs)" 
                         for i, step in enumerate(steps)])
    
    def _format_wrong_steps(self, steps):
        """Format wrong steps for prompt"""
        return '\n'.join([f"- {step['step_description']} (Penalty: {step['time_penalty']}hrs)" 
                         for step in steps])
    
    def _extract_json(self, text):
        """Extract JSON from markdown code blocks or raw text"""
        # Try to find JSON in code blocks
        json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            # Try to find raw JSON
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
            else:
                raise ValueError("No JSON found in response")
        
        return json.loads(json_str)


def main():
    """Example usage"""
    import sys
    
    # Get API key from environment or argument
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key and len(sys.argv) > 1:
        api_key = sys.argv[1]
    
    if not api_key:
        print("❌ Error: GEMINI_API_KEY environment variable not set")
        print("Usage: python scenario_generator.py [API_KEY]")
        return
    
    # Initialize generator
    generator = ScenarioGenerator(api_key)
    
    # Load raw data
    raw_data_path = Path(__file__).parent.parent.parent / 'raw_data.json'
    with open(raw_data_path, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    
    # Generate first scenario as test
    if raw_data:
        raw_scenario = raw_data[0]
        scenario = generator.generate_full_scenario(raw_scenario)
        
        # Validate
        if generator.validate_scenario(scenario):
            # Save
            output_path = Path(__file__).parent.parent.parent / 'scenarios' / f"{raw_scenario['scenario']['scenario_id']}.js"
            generator.save_scenario_js(scenario, output_path)
            
            print(f"\n✨ SUCCESS! Total tokens used: ~{generator.token_count}")
        else:
            print("\n❌ Scenario failed validation")


if __name__ == '__main__':
    main()
