#!/usr/bin/env python3
"""
Validates and converts scenario JSON to .js file
Run this after getting JSON from ChatGPT
"""
import json
import sys
import os

def validate_scenario(data):
    """Validate the scenario structure"""
    errors = []
    
    # Check required top-level keys
    if 'scenario_id' not in data:
        errors.append("Missing 'scenario_id'")
    if 'meta' not in data:
        errors.append("Missing 'meta'")
    if 'start' not in data:
        errors.append("Missing 'start'")
    if 'steps' not in data:
        errors.append("Missing 'steps'")
    
    if errors:
        return False, errors
    
    # Check all 'next' references are valid
    step_ids = set(data['steps'].keys())
    for step_id, step in data['steps'].items():
        for choice in step.get('choices', []):
            next_step = choice.get('next')
            if next_step and next_step not in step_ids:
                errors.append(f"Step '{step_id}' has invalid next: '{next_step}'")
    
    return len(errors) == 0, errors

def json_to_js(data):
    """Convert JSON to JavaScript format"""
    scenario_id = data['scenario_id']
    
    # Start building the JS
    js = f"window.SCENARIOS['{scenario_id}'] = {{\n"
    
    # Meta
    meta = data['meta']
    js += "    meta: {\n"
    js += f"        title: \"{meta['title']}\",\n"
    js += f"        description: \"{meta.get('description', '')}\",\n"
    js += f"        estimateHours: {meta.get('estimateHours', 1.0)},\n"
    js += f"        category: \"{meta.get('category', 'General')}\"\n"
    js += "    },\n"
    
    # Start
    js += f"    start: \"{data['start']}\",\n"
    
    # Steps
    js += "    steps: {\n"
    for step_id, step in data['steps'].items():
        js += f"        '{step_id}': {{\n"
        js += f"            skill: '{step.get('skill', 'general')}',\n"
        js += f"            title: '{step.get('title', 'Untitled')}',\n"
        
        # Escape the prompt properly
        prompt = step.get('prompt', '').replace('\\', '\\\\').replace('"', '\\"')
        js += f"            prompt: \"{prompt}\",\n"
        
        # Choices
        js += "            choices: [\n"
        for choice in step.get('choices', []):
            js += "                {\n"
            js += f"                    text: \"{choice.get('text', '')}\",\n"
            js += f"                    type: '{choice.get('type', 'wrong')}',\n"
            feedback = choice.get('feedback', '').replace('\\', '\\\\').replace('"', '\\"')
            js += f"                    feedback: \"{feedback}\",\n"
            js += f"                    next: '{choice.get('next', 'conclusion')}'\n"
            js += "                },\n"
        js += "            ]\n"
        js += "        },\n"
    
    js += "    }\n"
    js += "};\n"
    
    return js

def main():
    print("Paste your JSON from ChatGPT (end with Ctrl+D on Unix or Ctrl+Z on Windows):")
    print("-" * 50)
    
    try:
        # Read from stdin
        json_text = sys.stdin.read().strip()
        
        # Remove markdown fences if present
        json_text = json_text.replace('```json', '').replace('```', '').strip()
        
        # Parse JSON
        data = json.loads(json_text)
        
        # Validate
        valid, errors = validate_scenario(data)
        if not valid:
            print("\n❌ Validation errors:")
            for error in errors:
                print(f"  - {error}")
            return
        
        print("\n✅ Validation passed!")
        
        # Convert to JS
        js_code = json_to_js(data)
        
        # Write to file
        scenario_id = data['scenario_id']
        output_path = f"../../scenarios/{scenario_id}.js"
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(js_code)
        
        print(f"\n✅ Created: {output_path}")
        print("\nNext steps:")
        print("1. Refresh browser (Ctrl+F5)")
        print("2. Check the scenario in the backlog")
        
    except json.JSONDecodeError as e:
        print(f"\n❌ Invalid JSON: {e}")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == '__main__':
    main()
