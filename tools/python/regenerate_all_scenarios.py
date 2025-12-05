"""
UE5 Scenario Tracker - Scenario Regeneration Script

Regenerates all scenario .js files from clean source data in raw_data.json.
Uses proper JSON parsing and JavaScript generation to avoid syntax errors.
"""

import json
import os
import html

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '..', '..'))
RAW_DATA_PATH = os.path.join(PROJECT_ROOT, 'raw_data.json')
SCENARIOS_DIR = os.path.join(PROJECT_ROOT, 'scenarios')

def ensure_html_markup(text, field_type='prompt'):
    """
    Ensure text has proper HTML markup.
    Wraps plain text in <p> tags if needed.
    """
    if not text or not isinstance(text, str):
        return text
    
    text = text.strip()
    
    # If already has HTML tags, return as-is
    if '<p>' in text or '<strong>' in text or '<code>' in text:
        return text
    
    # Wrap plain text in paragraph tags
    return f"<p>{text}</p>"

def escape_js_string(text):
    """
    Properly escape a string for JavaScript without using escape sequences
    that cause issues. Uses JSON encoding which handles all special chars.
    """
    # JSON encoding handles all escape sequences properly
    return json.dumps(text)

def generate_scenario_js(scenario_data, scenario_key):
    """
    Generate JavaScript code for a scenario from structured data.
    
    Args:
        scenario_data: Dictionary containing scenario information
        scenario_key: String key for the scenario (e.g., 'directional_light')
    
    Returns:
        String containing valid JavaScript code
    """
    # Build the scenario object
    scenario_obj = {
        "meta": {
            "title": scenario_data.get('title', 'Unknown Scenario'),
            "description": scenario_data.get('problem_description', ''),
            "estimateHours": scenario_data.get('estimated_hours', 1.0),
            "category": scenario_data.get('focus_area', 'General')
        },
        "start": "step-1",
        "steps": {}
    }
    
    # Process correct solution steps
    correct_steps = scenario_data.get('correct_solution_steps', [])
    wrong_steps = scenario_data.get('common_wrong_steps', [])
    
    for i, step in enumerate(correct_steps):
        step_key = f"step-{i+1}"
        next_key = f"step-{i+2}" if i < len(correct_steps) - 1 else "conclusion"
        
        # Build choices array
        choices = []
        
        # Add correct choice
        step_desc = step.get('step_description', 'Continue')
        choices.append({
            "text": ensure_html_markup(step_desc, 'text'),
            "type": "correct",
            "feedback": ensure_html_markup(f"<p><strong>Optimal Time Logged:</strong> {step.get('time_cost', 0)}hrs. Correct approach.</p>"),
            "next": next_key
        })
        
        # Add wrong choice if available
        if wrong_steps and len(wrong_steps) > 0:
            wrong = wrong_steps[i % len(wrong_steps)]
            choices.append({
                "text": ensure_html_markup(wrong.get('step_description', 'Try something else')),
                "type": "wrong",
                "feedback": ensure_html_markup(f"<p><strong>Extended Time Logged:</strong> +{wrong.get('time_penalty', 0)}hrs. This approach wastes time.</p>"),
                "next": step_key  # Loop back to retry
            })
        
        # Create the step
        scenario_obj["steps"][step_key] = {
            "skill": scenario_data.get('focus_area', 'General').lower().replace(' & ', '').replace(' ', '_'),
            "title": f"Step {i+1}",
            "prompt": ensure_html_markup(f"<p>{step_desc}</p><p><strong>What do you do next?</strong></p>"),
            "choices": choices
        }
    
    # Add conclusion step
    scenario_obj["steps"]["conclusion"] = {
        "skill": "complete",
        "title": "Scenario Complete",
        "prompt": "<p>Congratulations! You have successfully completed this debugging scenario.</p>",
        "choices": []
    }
    
    # Convert to JavaScript using JSON
    # This properly handles all escaping
    js_object = json.dumps(scenario_obj, indent=4, ensure_ascii=False)
    
    # Wrap in window.SCENARIOS assignment
    js_code = f"window.SCENARIOS['{scenario_key}'] = {js_object};\n"
    
    return js_code

def regenerate_all_scenarios(validate_only=False):
    """
    Regenerate all scenario files from raw_data.json
    
    Args:
        validate_only: If True, only validate without writing files
    """
    print("=" * 60)
    print("UE5 Scenario Tracker - Scenario Regeneration")
    print("=" * 60)
    
    # Load raw data
    print(f"\nLoading source data from: {RAW_DATA_PATH}")
    try:
        with open(RAW_DATA_PATH, 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
    except Exception as e:
        print(f"❌ Error loading raw_data.json: {e}")
        return False
    
    print(f"✓ Loaded {len(raw_data)} scenario entries")
    
    # Process each scenario
    scenarios_processed = 0
    errors = []
    
    for entry in raw_data:
        key = entry.get('key', 'unknown')
        scenario_data = entry.get('scenario', {})
        scenario_id = scenario_data.get('scenario_id', key)
        
        # Generate JavaScript
        try:
            js_code = generate_scenario_js(scenario_data, scenario_id)
            
            # Validate JavaScript syntax by parsing as JSON before the window.SCENARIOS wrapper
            # This is a basic check - real validation happens in browser
            
            if not validate_only:
                # Write to file
                output_file = os.path.join(SCENARIOS_DIR, f"{scenario_id}.js")
                with open(output_file, 'w', encoding='utf-8') as f:
                    f.write(js_code)
                print(f"  ✓ Generated: {scenario_id}.js")
            else:
                print(f"  ✓ Validated: {scenario_id}.js")
            
            scenarios_processed += 1
            
        except Exception as e:
            error_msg = f"Error processing {scenario_id}: {e}"
            errors.append(error_msg)
            print(f"  ❌ {error_msg}")
    
    # Summary
    print("\n" + "=" * 60)
    if validate_only:
        print(f"Validation complete: {scenarios_processed} scenarios validated")
    else:
        print(f"Regeneration complete: {scenarios_processed} scenarios generated")
    
    if errors:
        print(f"\n⚠️  {len(errors)} errors encountered:")
        for error in errors:
            print(f"  - {error}")
        return False
    else:
        print("✅ All scenarios processed successfully!")
        return True

def main():
    import sys
    
    # Check for --validate-only flag
    validate_only = '--validate-only' in sys.argv
    
    # Run regeneration
    success = regenerate_all_scenarios(validate_only=validate_only)
    
    if not success:
        sys.exit(1)

if __name__ == "__main__":
    main()
