"""
Fill missing choices to reach 4 per step and clean "Action:" labels
"""
import re
import random

# Generic filler choices to use if a step has < 4 choices
FILLER_CHOICES = [
    {
        "text": "Close the editor, delete the Intermediate folder, and regenerate project files.",
        "type": "wrong",
        "feedback": "You perform a full project regeneration. It takes 10 minutes to recompile shaders, but when the editor opens, the issue persists exactly as before. This was a workflow red herring.",
        "next": "%CURRENT_STEP%" 
    },
    {
        "text": "Increase the Engine Scalability Settings to Cinematic to see if it's a quality level issue.",
        "type": "misguided",
        "feedback": "You max out the scalability settings. While the frame rate drops, the specific bug you're tracking doesn't change behavior. It's a logic or configuration issue, not a scalability artifact.",
        "next": "%CURRENT_STEP%"
    },
    {
        "text": "Right-click the asset in the Content Browser and select 'Validate Assets'.",
        "type": "wrong",
        "feedback": "Asset validation passes with flying colors. The asset data itself is not corrupt; the problem lies in how it's being used or calculated.",
        "next": "%CURRENT_STEP%"
    },
    {
        "text": "Toggle the relevant plugin off and back on in the Plugins menu.",
        "type": "misguided",
        "feedback": "You restart the editor twice to toggle the plugin. The issue remains unchanged. The plugin was working fine; the configuration was just wrong.",
        "next": "%CURRENT_STEP%"
    }
]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Clean "Action:" labels
    # We do this globally first
    content = re.sub(r'text:\s*["\']Action:\s*(.*?)["\']', r'text: "\1"', content)
    
    # 2. Parse steps and fill missing choices
    # This is tricky with regex. We need to identify steps that need choices.
    
    # Let's find matches for: matches steps: { ... }
    # Then iterate keys.
    
    # We'll use a specific strategy:
    # Split by 'step-...' keys
    
    # Find all step keys
    step_keys = re.findall(r"'(step-[^']+)'\s*:", content)
    
    # We can't easily insert into the string without parsing.
    # Let's use the 'add_choices_to_step' logic from earlier helper scripts?
    
    # Or better, let's just use regex to find the choices array for each step, count items, and insert if needed.
    
    # We iterate through the file finding `choices: [` blocks
    # We need to map them to steps to know the return path (next: step-ID)
    
    # Regex to find step definition + choices block
    # Group 1: step ID
    # Group 2: content up to choices start
    # Group 3: choices content
    
    # This loop is complex. 
    # Let's simply loop through the content finding `choices: [` 
    # and inferring the step ID from the preceding text.
    
    pattern = re.compile(r"('step-[^']+'|'conclusion'):\s*\{.*?choices:\s*\[(.*?)\]", re.DOTALL)
    
    # We can't modify while iterating with regex finditer easily if we change size.
    # We will build a new content string.
    
    new_content = content
    
    # We work backwards so offsets don't break
    matches = list(pattern.finditer(content))
    for match in reversed(matches):
        step_id_raw = match.group(1).replace("'", "")
        choices_inner = match.group(2)
        
        # Count choices by finding objects `{ ... }`
        # Simple heuristic: count `text:` occurrences
        count = len(re.findall(r'text:\s*["\']', choices_inner))
        
        if count < 4:
            needed = 4 - count
            print(f"Step {step_id_raw} has {count} choices. Adding {needed}.")
            
            # Determine return verification step
            # If step is 'step-XX', we usually loop back to 'step-XXW' or just 'step-XX' for filler
            # For simplicity, generic filler loops back to the same step (retry)
            # OR creates a simple distraction loop.
            # But wait, our fillers have `next: "%CURRENT_STEP%"`.
            # If step is `step-1`, duplicate loop is `step-1W` usually.
            # If we don't know the W step, maybe just looping to itself?
            # Creating a loop back to the current step allows the user to try again immediately.
            
            # Use the loop-back logic:
            next_val = step_id_raw
            if 'W' not in step_id_raw and 'M' not in step_id_raw:
                 # If it's a main step, loop to itself or maybe we should find if a W exist?
                 # Safest is loop to itself for a generic 'retry' message.
                 pass
            
            added_choices = []
            
            # Pick unique fillers
            chosen_fillers = random.sample(FILLER_CHOICES, needed)
            
            for filler in chosen_fillers:
                # Format the filler
                choice_str = f"""
                {{
                    text: "{filler['text']}",
                    type: '{filler['type']}',
                    feedback: "{filler['feedback']}",
                    next: '{next_val}'
                }}"""
                added_choices.append(choice_str)
                
            # Insert into the string
            # We insert before the closing bracket of the choices array
            insertion = ",".join(added_choices)
            if choices_inner.strip():
                insertion = ",\n" + insertion
            
            # Splice
            start, end = match.span(2) # The inner content of []
            new_content = new_content[:end] + insertion + new_content[end:]
            
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print(f"✅ Processed {filepath}")

process_file('scenarios/lumen_gi.js')
process_file('scenarios/blueprintslogic_advanced.js')
