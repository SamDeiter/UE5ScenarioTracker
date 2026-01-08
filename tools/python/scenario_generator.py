#!/usr/bin/env python3
"""
UE5 Scenario Generator - Token-Efficient Gemini-Powered Tool
Converts raw_data.json scenarios to branching assessment format
"""
import json
import os
import sys
import time
import requests
from pathlib import Path

# Paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
TEMPLATES_PATH = SCRIPT_DIR / "templates" / "scenario_templates.json"
RAW_DATA_PATH = PROJECT_ROOT / "raw_data.json"
SCENARIOS_PATH = PROJECT_ROOT / "scenarios"

# Load templates
def load_templates():
    if TEMPLATES_PATH.exists():
        with open(TEMPLATES_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

TEMPLATES = load_templates()


def build_conversion_prompt(raw_scenario: dict) -> str:
    """Build a token-efficient prompt for Gemini"""
    
    # Extract key info from raw_data.json format
    scenario = raw_scenario.get('scenario', raw_scenario)
    title = scenario.get('title', 'Unknown')
    description = scenario.get('problem_description', '')
    category = scenario.get('focus_area', 'General')
    estimate = scenario.get('estimated_hours', 1.0)
    correct_steps = scenario.get('correct_solution_steps', [])
    wrong_steps = scenario.get('common_wrong_steps', [])
    
    # Get relevant wrong answer templates
    category_key = category.lower().replace(' & ', '_').replace(' ', '_')
    wrong_templates = TEMPLATES.get('wrong_answers', {}).get(category_key, 
                      TEMPLATES.get('wrong_answers', {}).get('performance', []))[:3]
    
    # Build concise prompt
    prompt = f"""Convert this UE5 bug to a 3-5 step ASSESSMENT scenario.

BUG: {title}
CONTEXT: {description[:500]}
CATEGORY: {category}
ESTIMATE: {estimate}h

CORRECT STEPS (group into 3-5 decisions):
{json.dumps([s['step_description'][:100] for s in correct_steps[:6]], indent=2)}

WRONG APPROACHES (use as wrong choices):
{json.dumps([s['step_description'][:80] for s in wrong_steps], indent=2)}

EXTRA WRONG PATTERNS:
{json.dumps(wrong_templates, indent=2)}

RULES:
1. ALL choices advance (no dead ends)
2. 3-5 decision points total
3. Each decision has 3-4 choices
4. Wrong choices must be plausible

OUTPUT FORMAT (JSON only, no markdown):
{{
  "scenario_id": "snake_case_from_title",
  "meta": {{"title": "...", "description": "...", "estimateHours": {estimate}, "category": "{category}"}},
  "start": "step-1",
  "steps": {{
    "step-1": {{
      "skill": "{category_key.split('_')[0]}",
      "title": "Descriptive Title",
      "prompt": "<p>Context...</p><strong>What do you do?</strong>",
      "choices": [
        {{"text": "...", "type": "correct", "feedback": "<p><strong>Optimal:</strong>...</p>", "next": "step-2"}},
        {{"text": "...", "type": "wrong", "feedback": "<p><strong>Maximum Time:</strong>...</p>", "next": "step-2"}}
      ]
    }},
    "conclusion": {{"skill": "...", "title": "Scenario Complete", "prompt": "Success summary", "choices": []}}
  }}
}}"""
    
    return prompt


def call_gemini(api_key: str, prompt: str, model: str = "gemini-1.5-flash") -> dict:
    """Call Gemini API and return parsed JSON"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.3,
            "response_mime_type": "application/json"
        }
    }
    
    try:
        print(f"  Calling Gemini ({model})...")
        resp = requests.post(url, headers=headers, json=data, timeout=60)
        resp.raise_for_status()
        
        result = resp.json()
        text = result['candidates'][0]['content']['parts'][0]['text']
        
        # Clean up any markdown fences
        text = text.replace('```json', '').replace('```', '').strip()
        
        # Count tokens (approximate)
        input_tokens = result.get('usageMetadata', {}).get('promptTokenCount', 0)
        output_tokens = result.get('usageMetadata', {}).get('candidatesTokenCount', 0)
        print(f"  Tokens used: {input_tokens} in / {output_tokens} out = {input_tokens + output_tokens} total")
        
        return json.loads(text)
        
    except requests.exceptions.RequestException as e:
        print(f"  API Error: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"  JSON Parse Error: {e}")
        print(f"  Raw text: {text[:200]}...")
        return None


def validate_scenario(data: dict) -> tuple[bool, list]:
    """Validate scenario structure"""
    errors = []
    
    # Required keys
    for key in ['scenario_id', 'meta', 'start', 'steps']:
        if key not in data:
            errors.append(f"Missing '{key}'")
    
    if errors:
        return False, errors
    
    # Check step references
    step_ids = set(data['steps'].keys())
    for step_id, step in data['steps'].items():
        for choice in step.get('choices', []):
            next_step = choice.get('next')
            if next_step and next_step not in step_ids:
                errors.append(f"Step '{step_id}' references invalid next: '{next_step}'")
    
    # Check conclusion exists
    if 'conclusion' not in step_ids:
        errors.append("Missing 'conclusion' step")
    
    return len(errors) == 0, errors


def scenario_to_js(data: dict) -> str:
    """Convert scenario dict to JavaScript"""
    scenario_id = data['scenario_id']
    
    js = f"window.SCENARIOS['{scenario_id}'] = {{\n"
    
    # Meta
    meta = data['meta']
    js += "    meta: {\n"
    js += f'        title: "{meta["title"]}",\n'
    js += f'        description: "{meta.get("description", "")}",\n'
    js += f'        estimateHours: {meta.get("estimateHours", 1.0)},\n'
    js += f'        category: "{meta.get("category", "General")}"\n'
    js += "    },\n"
    
    # Start
    js += f'    start: "{data["start"]}",\n'
    
    # Steps
    js += "    steps: {\n"
    for step_id, step in data['steps'].items():
        js += f"        '{step_id}': {{\n"
        js += f"            skill: '{step.get('skill', 'general')}',\n"
        
        title = step.get('title', 'Untitled').replace("'", "\\'")
        js += f"            title: '{title}',\n"
        
        prompt = step.get('prompt', '').replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
        js += f'            prompt: "{prompt}",\n'
        
        js += "            choices: [\n"
        for choice in step.get('choices', []):
            text = choice.get('text', '').replace('"', '\\"')
            feedback = choice.get('feedback', '').replace('"', '\\"')
            js += "                {\n"
            js += f'                    text: "{text}",\n'
            js += f"                    type: '{choice.get('type', 'wrong')}',\n"
            js += f'                    feedback: "{feedback}",\n'
            js += f"                    next: '{choice.get('next', 'conclusion')}'\n"
            js += "                },\n"
        js += "            ]\n"
        js += "        },\n"
    
    js += "    }\n"
    js += "};\n"
    
    return js


def generate_scenario(api_key: str, raw_scenario: dict, save: bool = True) -> dict:
    """Generate a single scenario from raw_data.json entry"""
    
    scenario = raw_scenario.get('scenario', raw_scenario)
    title = scenario.get('title', 'Unknown')
    print(f"\nProcessing: {title}")
    
    # Build prompt
    prompt = build_conversion_prompt(raw_scenario)
    
    # Call Gemini
    result = call_gemini(api_key, prompt)
    
    if not result:
        print("  ❌ Generation failed")
        return None
    
    # Validate
    valid, errors = validate_scenario(result)
    if not valid:
        print(f"  ❌ Validation failed:")
        for err in errors:
            print(f"     - {err}")
        return None
    
    print("  ✅ Validation passed")
    
    # Save
    if save:
        scenario_id = result['scenario_id']
        output_path = SCENARIOS_PATH / f"{scenario_id}.js"
        
        js_code = scenario_to_js(result)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(js_code)
        
        print(f"  ✅ Saved: {output_path.name}")
    
    return result


def batch_generate(api_key: str, count: int = 5, category_filter: str = None):
    """Generate multiple scenarios from raw_data.json"""
    
    if not RAW_DATA_PATH.exists():
        print(f"Error: raw_data.json not found at {RAW_DATA_PATH}")
        return
    
    with open(RAW_DATA_PATH, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    
    print(f"Loaded {len(raw_data)} scenarios from raw_data.json")
    
    # Filter by category if specified
    if category_filter:
        raw_data = [s for s in raw_data 
                    if category_filter.lower() in s.get('scenario', {}).get('focus_area', '').lower()]
        print(f"Filtered to {len(raw_data)} scenarios in '{category_filter}'")
    
    # Limit count
    raw_data = raw_data[:count]
    
    print(f"\nGenerating {len(raw_data)} scenarios...")
    print("=" * 50)
    
    success = 0
    failed = 0
    total_tokens = 0
    
    for raw_scenario in raw_data:
        result = generate_scenario(api_key, raw_scenario)
        if result:
            success += 1
        else:
            failed += 1
        
        # Rate limiting
        time.sleep(1)
    
    print("\n" + "=" * 50)
    print(f"Complete! Success: {success}, Failed: {failed}")


def main():
    """CLI entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate UE5 assessment scenarios')
    parser.add_argument('--key', '-k', help='Gemini API key')
    parser.add_argument('--count', '-n', type=int, default=3, help='Number of scenarios to generate')
    parser.add_argument('--category', '-c', help='Filter by category (e.g., "Lighting")')
    parser.add_argument('--single', '-s', type=int, help='Generate single scenario by index')
    
    args = parser.parse_args()
    
    api_key = args.key or os.environ.get('GEMINI_API_KEY')
    
    if not api_key:
        print("Error: Provide API key via --key or GEMINI_API_KEY environment variable")
        sys.exit(1)
    
    if args.single is not None:
        with open(RAW_DATA_PATH, 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
        if args.single < len(raw_data):
            generate_scenario(api_key, raw_data[args.single])
        else:
            print(f"Error: Index {args.single} out of range (max {len(raw_data)-1})")
    else:
        batch_generate(api_key, args.count, args.category)


if __name__ == '__main__':
    main()
