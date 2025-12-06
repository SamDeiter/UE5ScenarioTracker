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
        self.api_key = api_key
        genai.configure(api_key=api_key)
        
        # Dynamically fetch available models
        valid_model = self._find_first_valid_model()
        if valid_model:
            print(f"✨ Using model: {valid_model}")
            self.model = genai.GenerativeModel(valid_model)
        else:
            print("⚠️ Could not find specific model, defaulting to gemini-pro")
            self.model = genai.GenerativeModel('gemini-pro')
        
        # Load templates
        if templates_path is None:
            templates_path = Path(__file__).parent.parent / 'templates' / 'scenario_templates.json'
        
        with open(templates_path, 'r', encoding='utf-8') as f:
            self.templates = json.load(f)
        
        self.token_count = 0

    def _find_first_valid_model(self):
        """Fetch list of models and return the first one that supports generateContent"""
        import requests
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models?key={self.api_key}"
            resp = requests.get(url, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                for m in data.get('models', []):
                    if "generateContent" in m.get('supportedGenerationMethods', []):
                         return m['name'].replace('models/', '')
        except Exception as e:
            print(f"⚠️ Warning fetching models: {e}")
        return None
        
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
        
        prompt = f"""Convert this UE5 debugging scenario to a BRANCHING debugging assessment.

SCENARIO:
Title: {raw_scenario['scenario']['title']}
Problem: {raw_scenario['scenario']['problem_description']}
Category: {category}
Estimated Hours: {raw_scenario['scenario']['estimated_hours']}

CORRECT STEPS ({len(raw_scenario['scenario']['correct_solution_steps'])} steps):
{self._format_steps(raw_scenario['scenario']['correct_solution_steps'])}

WRONG STEPS ({len(raw_scenario['scenario']['common_wrong_steps'])} steps):
{self._format_wrong_steps(raw_scenario['scenario']['common_wrong_steps'])}

CRITICAL RULES - UE5 TOOLS ONLY:
✅ Console commands: stat unit, stat gpu, stat game, r.*, showflag.*
✅ Editor tools: Details panel, Profiler, World Settings, Buffer Visualization
✅ Visual debug: wireframe, collision view, reflection view
❌ NO external apps: Task Manager, RenderDoc, PIX, Nsight, Visual Studio Profiler

DEBUGGING PROGRESSION (Broad → Specific):
1. Foundation diagnostics first (stat unit to identify bottleneck)
2. Then narrow down (stat gpu if GPU-bound)
3. Then specific tools (GPU Profiler for exact pass)
Wrong choices that skip steps create DETOURS

TASK:
Create branching JSON outline with OPTIMAL PATH (25-40 steps) + DETOURS:
{{
  "scenario_id": "{raw_scenario['scenario']['scenario_id']}",
  "estimate_hours": {raw_scenario['scenario']['estimated_hours']},
  "optimal_path": [
    {{
      "step_id": "step-1",
      "action": "<brief action>",
      "time_cost": <hours>,
      "has_detours": true/false
    }},
    {{
      "step_id": "step-2",
      "action": "<next action>",
      "time_cost": <hours>,
      "has_detours": false
    }}
  ],
  "detours": {{
    "step-1": [
      {{
        "detour_id": "step-1W",
        "trigger": "wrong",
        "reason": "<why this creates detour>",
        "steps": ["step-1W"],
        "converges_to": "step-3",
        "total_penalty": <hours>
      }}
    ]
  }}
}}

CRITICAL - STEP ID FORMAT:
- Main path: "step-1", "step-2", "step-3" etc. (NEVER "s1", "s2")
- Detours: "step-1W", "step-2W" etc. for wrong choice detours  
- Use EXACT format: "step-{{number}}" or "step-{{number}}W"
- The "steps" array in detours must contain STEP IDs (e.g. ["step-1W"]), NOT action text!

RULES:
- Optimal path: 25-40 steps that sum to estimate_hours
- Break down complex steps into 2-3 substeps
- Add detours when logical progression violated (e.g., GPU Profiler before stat unit)
- NOT every step needs detours (add strategically ~40-50% of steps)
- Detours are 1-2 steps long, then converge back
- Keep actions brief (will expand later)
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
        
        # Extract ALL step IDs that need details (optimal + detours)
        all_step_ids = [step['step_id'] for step in outline.get('optimal_path', [])]
        for detour_list in outline.get('detours', {}).values():
            for detour in detour_list:
                all_step_ids.extend(detour.get('steps', []))
        
        step_list_str = ", ".join(all_step_ids)
        
        prompt = f"""Expand this BRANCHING scenario outline into full DEBUGGING ASSESSMENT content.

OUTLINE:
{json.dumps(outline, indent=2)}

ORIGINAL PROBLEM:
{raw_scenario['scenario']['problem_description']}

CRITICAL: Generate content for ALL {len(all_step_ids)} steps including detours:
{step_list_str}

CRITICAL: Use EXACT step_id values from the outline above. DO NOT invent new step IDs!
- For each step in optimal_path, use its "step_id" field exactly
- For each step in detours.steps arrays, use those exact step IDs
- Example: If outline has "step-1W-light-1", use that EXACT ID, not "step-1W1_action"

CRITICAL: THIS IS AN ASSESSMENT, NOT A TUTORIAL
- Prompts show SYMPTOMS only (what you see, error messages, visual bugs)
- Prompts DON'T teach or explain solutions
- Prompts DON'T telegraph the answer
- User must apply UE5 knowledge to choose correct action

UE5 TOOLS ONLY:
✅ Console: stat unit, stat gpu, r.*, showflag.*, show collision
✅ Editor: Details panel, Profiler, Buffer Visualization, World Settings
✅ Views: wireframe, reflection buffer, collision view
❌ NO: Task Manager, RenderDoc, PIX, Nsight, external profilers

TASK:
For each step in optimal_path AND each detour step, generate:
1. Prompt: Describe WHAT you see/experience (symptoms), ask "What do you do next?"
2. ONE correct choice (detailed, specific UE5 actions)
3. THREE wrong choices with varying wrongness:
   - Choice 1: Obviously wrong (completely different system) OR "Works but bad" (causes memory leaks, performance issues)
   - Choice 2: Plausible but wrong property/setting
   - Choice 3: SUBTLY wrong (almost correct but critical small mistake)
4. Feedback for each:
   - Correct: "Optimal Time: +Xhrs. [Why this is right approach]"
   - Wrong: "Extended Time: +Xhrs. [What happened / consequence]"

Return JSON:
{{
  "steps": [
    {{
      "step_id": "step-1",
      "prompt": "<symptoms only>",
      "correct_text": "<detailed UE5 action>",
      "correct_feedback": "<feedback>",
      "wrong_choices": [
        {{"text": "<wrong 1>", "feedback": "<consequence>", "type": "obvious"}},
        {{"text": "<wrong 2>", "feedback": "<consequence>", "type": "plausible"}},
        {{"text": "<wrong 3>", "feedback": "<consequence>", "type": "subtle"}}
      ]
    }}
  ]
}}

RULES:
- Prompts: <150 chars, describe situation not solution
- Actions: Specific (exact menu paths, console commands, property names)
- Each wrong answer = DIFFERENT mistake type
- "Works but bad" = fixes issue but creates new problem
- Keep concise for file size
- Return ONLY valid JSON, no markdown

JSON:"""

        response = self.model.generate_content(prompt)
        self.log_tokens(prompt, response.text)
        
        details = self._extract_json(response.text)
        return details
    
    def validate_and_cleanup_details(self, outline, details):
        """
        Validate that details contains all step IDs from outline.
        Fix any mismatches by creating missing steps or mapping incorrect IDs.
        """
        print("\n🔧 Validating and cleaning up step IDs...")
        
        # Extract expected step IDs from outline
        expected_ids = set()
        for step in outline.get('optimal_path', []):
            expected_ids.add(step['step_id'])
        for detour_list in outline.get('detours', {}).values():
            for detour in detour_list:
                expected_ids.update(detour.get('steps', []))
        
        # Extract actual step IDs from details
        actual_ids = {step['step_id'] for step in details.get('steps', [])}
        
        # Find missing and extra IDs
        missing_ids = expected_ids - actual_ids
        extra_ids = actual_ids - expected_ids
        
        if missing_ids:
            print(f"⚠️  Missing {len(missing_ids)} step IDs: {', '.join(sorted(missing_ids)[:5])}")
            
            # Create placeholder content for missing steps
            for step_id in missing_ids:
                details['steps'].append({
                    'step_id': step_id,
                    'prompt': f"You took a detour. Recognize the issue and return to the proper workflow.",
                    'correct_text': "Return to the optimal debugging path",
                    'correct_feedback': "Optimal Time: +0.02hrs. You're back on track.",
                    'wrong_choices': [
                        {
                            'text': "Continue down the wrong path",
                            'feedback': "Extended Time: +0.1hrs. This makes the problem worse.",
                            'type': 'wrong'
                        }
                    ]
                })
            print(f"✅ Added {len(missing_ids)} placeholder steps for missing IDs")
        
        if extra_ids:
            print(f"⚠️  Found {len(extra_ids)} unexpected step IDs (will be ignored during merge)")
        
        if not missing_ids and not extra_ids:
            print("✅ All step IDs match perfectly!")
        
        return details
    
    def merge_outline_and_details(self, outline, details, raw_scenario):
        """Merge Pass 1 (branching outline) and Pass 2 (details) into final scenario structure"""
        scenario = {
            "meta": {
                "title": raw_scenario['scenario']['title'],
                "description": raw_scenario['scenario']['problem_description'],
                "estimateHours": raw_scenario['scenario']['estimated_hours'],
                "category": raw_scenario['scenario']['focus_area'],
                "tokens_used": self.token_count
            },
            "start": "step-1",
            "steps": {}
        }
        
        # Create a map of step_id → detail for easy lookup
        details_map = {step['step_id']: step for step in details['steps']}
        
        # Build optimal path steps
        for i, outline_step in enumerate(outline.get('optimal_path', []), 1):
            step_id = outline_step['step_id']
            detail_step = details_map.get(step_id, {})
            
            # Determine next step for correct choice
            if i < len(outline['optimal_path']):
                next_optimal = outline['optimal_path'][i]['step_id']
            else:
                next_optimal = "conclusion"
            
            # Build choices: 1 correct + 3 wrong
            choices = [
                {
                    "text": f"<p>{detail_step.get('correct_text', 'Missing')}</p>",
                    "type": "correct",
                    "feedback": f"<p>{detail_step.get('correct_feedback', '')}</p>",
                    "next": next_optimal
                }
            ]
            
            # Add wrong choices - determine their next steps based on detours
            step_detours = outline.get('detours', {}).get(step_id, [])
            wrong_choices = detail_step.get('wrong_choices', [])
            
            for idx, wrong_choice in enumerate(wrong_choices[:3]):  # Max 3 wrong
                # If there's a detour for this wrong choice, use it
                if idx < len(step_detours):
                    detour = step_detours[idx]
                    next_step = detour['detour_id'] if detour.get('steps') else detour.get('converges_to', next_optimal)
                else:
                    # No detour defined, loop back to same step
                    next_step = step_id
                
                choice_type = wrong_choice.get('type', 'wrong')
                choices.append({
                    "text": f"<p>{wrong_choice['text']}</p>",
                    "type": choice_type,
                    "feedback": f"<p>{wrong_choice['feedback']}</p>",
                    "next": next_step
                })
            
            scenario['steps'][step_id] = {
                "skill": self._map_category_to_skill(raw_scenario['scenario']['focus_area']),
                "title": f"Step {i}",
                "prompt": f"<p>{detail_step.get('prompt', '')}</p><p><strong>What do you do next?</strong></p>",
                "choices": choices
            }
        
        # Build detour steps
        for parent_step_id, detour_list in outline.get('detours', {}).items():
            for detour in detour_list:
                for detour_step_id in detour.get('steps', []):
                    # Get details for this detour step
                    detour_detail = details_map.get(detour_step_id, {})
                    
                    # Detour steps typically have fewer choices (2-3)
                    choices = [
                        {
                            "text": f"<p>{detour_detail.get('correct_text', 'Recognize the issue and return to proper workflow')}</p>",
                            "type": "correct",
                            "feedback": f"<p>{detour_detail.get('correct_feedback', 'You\'re back on track.')}</p>",
                            "next": detour.get('converges_to', 'step-1')
                        }
                    ]
                    
                    # Add wrong choices for detours (usually 1-2)
                    for wrong in detour_detail.get('wrong_choices', [])[:2]:
                        choices.append({
                            "text": f"<p>{wrong['text']}</p>",
                            "type": wrong.get('type', 'wrong'),
                            "feedback": f"<p>{wrong['feedback']}</p>",
                            "next": detour_step_id  # Stay in detour
                        })
                    
                    scenario['steps'][detour_step_id] = {
                        "skill": self._map_category_to_skill(raw_scenario['scenario']['focus_area']),
                        "title": detour_step_id.replace('-', ' ').title(),
                        "prompt": f"<p>{detour_detail.get('prompt', 'You took a detour.')}</p><p><strong>What do you do next?</strong></p>",
                        "choices": choices
                    }
        
        # Add conclusion
        scenario['steps']['conclusion'] = {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario.</p>",
            "choices": []
        }
        
        return scenario
    
    def generate_full_scenario(self, raw_scenario, single_pass=True):
        """
        Generate complete scenario.
        If single_pass=True (default), uses ONE API call for faster generation.
        If single_pass=False, uses legacy two-pass system.
        Returns: Final scenario dict ready for .js conversion
        """
        print(f"\n🚀 Generating scenario: {raw_scenario['scenario']['title']}")
        print("=" * 80)
        
        if single_pass:
            return self._generate_single_pass(raw_scenario)
        else:
            return self._generate_two_pass(raw_scenario)
    
    def _generate_single_pass(self, raw_scenario):
        """
        SINGLE PASS: Generate complete scenario in one API call.
        Faster and more reliable than two-pass.
        """
        print("\n📝 SINGLE PASS: Generating complete scenario...")
        category = raw_scenario['scenario']['focus_area']
        
        prompt = f"""Convert this UE5 debugging scenario into a COMPLETE branching assessment.

SCENARIO:
Title: {raw_scenario['scenario']['title']}
Problem: {raw_scenario['scenario']['problem_description']}
Category: {category}
Estimated Hours: {raw_scenario['scenario']['estimated_hours']}

CORRECT STEPS ({len(raw_scenario['scenario']['correct_solution_steps'])} steps):
{self._format_steps(raw_scenario['scenario']['correct_solution_steps'])}

WRONG STEPS ({len(raw_scenario['scenario']['common_wrong_steps'])} steps):
{self._format_wrong_steps(raw_scenario['scenario']['common_wrong_steps'])}

CRITICAL RULES:
✅ Console: stat unit, stat gpu, r.*, showflag.*
✅ Editor: Details panel, Profiler, World Settings
❌ NO external apps: Task Manager, RenderDoc, PIX

THIS IS AN ASSESSMENT - prompts show SYMPTOMS only, not solutions!

Generate COMPLETE JSON scenario with 20-30 steps:
{{
  "meta": {{
    "title": "{raw_scenario['scenario']['title']}",
    "description": "{raw_scenario['scenario']['problem_description'][:200]}",
    "estimateHours": {raw_scenario['scenario']['estimated_hours']},
    "category": "{category}"
  }},
  "start": "step-1",
  "steps": {{
    "step-1": {{
      "skill": "{self._map_category_to_skill(category)}",
      "title": "Step 1",
      "prompt": "<p>Symptoms description here.</p><p><strong>What do you do next?</strong></p>",
      "choices": [
        {{"text": "<p>Correct action</p>", "type": "correct", "feedback": "<p>Optimal Time: +Xhrs. Why correct.</p>", "next": "step-2"}},
        {{"text": "<p>Wrong action 1</p>", "type": "obvious", "feedback": "<p>Extended Time: +Xhrs. Consequence.</p>", "next": "step-1"}},
        {{"text": "<p>Wrong action 2</p>", "type": "plausible", "feedback": "<p>Extended Time: +Xhrs. Consequence.</p>", "next": "step-1"}},
        {{"text": "<p>Wrong action 3</p>", "type": "subtle", "feedback": "<p>Extended Time: +Xhrs. Consequence.</p>", "next": "step-1"}}
      ]
    }},
    "conclusion": {{
      "skill": "complete",
      "title": "Scenario Complete",
      "prompt": "<p>Congratulations! You have successfully completed this debugging scenario.</p>",
      "choices": []
    }}
  }}
}}

RULES:
- 20-30 main steps, each "next" points to next step or "conclusion"
- 4 choices per step: 1 correct + 3 wrong (obvious, plausible, subtle)
- Wrong choices loop back to same step or add small detour
- Prompts: symptoms only, <150 chars
- Return ONLY valid JSON, no markdown

JSON:"""

        response = self.model.generate_content(prompt)
        self.log_tokens(prompt, response.text)
        
        scenario = self._extract_json(response.text)
        
        # Add tokens_used to meta if not already present
        if 'meta' not in scenario:
            scenario['meta'] = {}
        scenario['meta']['tokens_used'] = self.token_count
        
        # Validate and save checkpoint
        checkpoint = Path(__file__).parent.parent.parent / 'temp' / f"{raw_scenario['scenario']['scenario_id']}_complete.json"
        checkpoint.parent.mkdir(exist_ok=True)
        with open(checkpoint, 'w', encoding='utf-8') as f:
            json.dump(scenario, f, indent=2)
        print(f"💾 Checkpoint saved: {checkpoint}")
        
        step_count = len(scenario.get('steps', {})) - 1  # Exclude conclusion
        print(f"✅ Generated {step_count} steps + conclusion")
        
        return scenario
    
    def _generate_two_pass(self, raw_scenario):
        """
        LEGACY: Two-pass generation (outline first, then details).
        Kept for compatibility but single_pass is preferred.
        """
        # Pass 1: Outline
        print("\n📝 PASS 1: Generating outline...")
        outline_checkpoint = Path(__file__).parent.parent.parent / 'temp' / f"{raw_scenario['scenario']['scenario_id']}_outline.json"
        outline_checkpoint.parent.mkdir(exist_ok=True)
        
        outline = self.generate_scenario_outline(raw_scenario)
        optimal_count = len(outline.get('optimal_path', []))
        detour_count = sum(len(d.get('steps', [])) for detours in outline.get('detours', {}).values() for d in detours)
        print(f"✅ Generated {optimal_count} optimal steps + {detour_count} detour steps")
        
        # Save checkpoint
        with open(outline_checkpoint, 'w', encoding='utf-8') as f:
            json.dump(outline, f, indent=2)
        print(f"💾 Checkpoint saved: {outline_checkpoint}")
        
        # Pass 2: Details
        print("\n📝 PASS 2: Expanding details...")
        details_checkpoint = Path(__file__).parent.parent.parent / 'temp' / f"{raw_scenario['scenario']['scenario_id']}_details.json"
        
        details = self.expand_scenario_details(outline, raw_scenario)
        print(f"✅ Expanded {len(details['steps'])} steps")
        
        # Save checkpoint
        with open(details_checkpoint, 'w', encoding='utf-8') as f:
            json.dump(details, f, indent=2)
        print(f"💾 Checkpoint saved: {details_checkpoint}")
        
        # Cleanup: Validate and fix step ID mismatches
        details = self.validate_and_cleanup_details(outline, details)
        
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
        
        # Check file size
        file_size_kb = len(js_content.encode('utf-8')) / 1024
        if file_size_kb > 100:
            print(f"⚠️  WARNING: File size is {file_size_kb:.1f}KB (target: <100KB)")
            print(f"   Consider using more template references or reducing text length")
        else:
            print(f"✅ File size: {file_size_kb:.1f}KB (under 100KB target)")
        
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
    from env_loader import get_gemini_key
    
    # Get API key securely from .env file or environment
    try:
        api_key = get_gemini_key()
        print(f"✅ API key loaded: {api_key[:8]}...")
    except ValueError as e:
        print(f"❌ Error: {e}")
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
