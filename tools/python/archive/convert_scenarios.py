
import json
import os
import re

def to_camel_case(text):
    s = text.replace("-", " ").replace("_", " ")
    s = s.split()
    if len(text) == 0:
        return text
    return s[0] + ''.join(i.capitalize() for i in s[1:])

def to_snake_case(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

def convert_file(filename, output_name, key_name):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Failed to read {filename}: {e}")
        return

    # Build JS structure
    scenario = {
        "meta": {
            "title": data.get("title", "Unknown Title"),
            "description": data.get("problem_description", ""),
            "estimateHours": data.get("estimated_hours", 1.0),
            "difficulty": "Intermediate",
            "category": data.get("focus_area", "General")
        },
        "start": "step-1",
        "steps": {}
    }

    correct_steps = data.get("correct_solution_steps", [])
    wrong_steps_pool = data.get("common_wrong_steps", [])

    total_steps = len(correct_steps)
    
    for i, step in enumerate(correct_steps):
        step_key = f"step-{i+1}"
        next_key = f"step-{i+2}" if i < total_steps - 1 else "conclusion"
        
        # Prepare choices
        choices = []
        
        # Correct choice
        choices.append({
            "text": "Perform Action: " + step.get("step_description", "Do the step."),
            "type": "correct",
            "feedback": "Correct! You completed this step.",
            "next": next_key
        })
        
        # Add a distractor if available (cycling through wrong steps)
        if wrong_steps_pool:
            wrong = wrong_steps_pool[i % len(wrong_steps_pool)]
            choices.append({
                "text": "Attempt: " + wrong.get("step_description", "Do something else."),
                "type": "wrong",
                "feedback": "Incorrect. " + str(wrong.get("time_penalty", 0)) + " hrs lost.",
                "next": step_key # Loop back
            })
        
        scenario["steps"][step_key] = {
            "skill": key_name.split('_')[0], # Approximation
            "title": f"Step {i+1}",
            "prompt": f"<p>{step.get('step_description')}</p><p><strong>What do you do next?</strong></p>",
            "choices": choices
        }

    # Conclusion
    scenario["steps"]["conclusion"] = {
        "skill": key_name.split('_')[0],
        "title": "Scenario Complete",
        "prompt": "<p>You have successfully resolved the issue!</p>",
        "choices": []
    }

    # Output JS
    js_content = f"window.SCENARIOS['{key_name}'] = {json.dumps(scenario, indent=4)};"
    
    with open(output_name, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"Converted {filename} -> {output_name}")

if __name__ == "__main__":
    convert_file("../../scenarios/LumenGIMeshDistanceFailure.js.bak", "../../scenarios/lumen_gi_failure.js", "lumen_gi_failure")
    convert_file("../../scenarios/NaniteWPOShadingCacheFailure.js.bak", "../../scenarios/nanite_wpo_failure.js", "nanite_wpo_failure")
