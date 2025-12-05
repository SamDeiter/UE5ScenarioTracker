"""
Fix duplicate correct choices in scenarios
"""
import re

def fix_duplicates(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple state machine to parse steps
    # Note: This is a regex-based approach which is fragile but should work for these specific files
    # if they are well-formatted. A proper JS parser would be better but this is Python.
    
    # Actually, let's just use the fact that we know the structure.
    # We want to find steps that have multiple `type: 'correct'`
    
    # Let's iterate through the file and perform a more manual parse/replace
    
    new_lines = []
    lines = content.split('\n')
    
    in_steps = False
    current_step = None
    step_choices_buffer = []
    in_choice = False
    choice_lines = []
    
    # We will buffer a whole step, process its choices, then write it out
    
    # Better approach: Read the whole file. Use regex to find "steps: {" ... "}" block.
    # Then inside that, find each step object.
    # Then inside each step, find choices array.
    
    # Since the file might be large and complex, let's try a targeted regex replacement for just the choices block of each step.
    
    # Regex to find a step definition
    step_pattern = re.compile(r"('step-[^']+'|'conclusion'):\s*\{", re.DOTALL)
    
    # This is getting complicated to do safely with regex. 
    # Let's read the file, identify the line ranges for each step, and then process the choices text within satisfied ranges.
    
    # ALGORITHM:
    # 1. Read file
    # 2. Extract content of `choices: [...]` blocks.
    # 3. For each block:
    #    a. Parse the objects manually (find `{ type: ... }`)
    #    b. Count 'correct' types.
    #    c. If > 1, identify which to keep.
    #       - Keep the one appearing LAST (usually the new LLM one) OR
    #       - Keep the one WITHOUT "Action:" prefix
    #    d. Reconstruct the choices block string.
    # 4. Replace in original content.
    
    changes_made = 0
    
    # Regex to find choices arrays: choices: [ ... ]
    # We use disjoint matching
    
    # Find all choices blocks
    # We assume choices: [ ... ] structure
    
    # Helper to find matching bracket
    def find_matching_bracket(s, start_idx):
        depth = 0
        for i in range(start_idx, len(s)):
            if s[i] == '[': depth += 1
            elif s[i] == ']':
                depth -= 1
                if depth == 0: return i
        return -1

    search_start = 0
    output_content = content
    
    # We need to do this carefully. we will act on `output_content` but indices will shift.
    # So we should probably construct a new string from pieces.
    
    final_output = ""
    last_idx = 0
    
    # Find `choices: [`
    while True:
        match = re.search(r'choices:\s*\[', content[last_idx:])
        if not match:
            final_output += content[last_idx:]
            break
            
        start_choices = last_idx + match.end() - 1 # pointing to '['
        end_choices = find_matching_bracket(content, start_choices)
        
        if end_choices == -1:
            # Error parsing, just copy everything
            final_output += content[last_idx:]
            break
            
        # Extract the choices block content (inside [])
        choices_inner = content[start_choices+1:end_choices]
        
        # Now parse individual choice objects inside this block
        # They are roughly `{ ... }, { ... }`
        
        # Crude splitter: split by "},"
        # This is dangerous if "}," appears in string. 
        # But our format is consistent: `},` followed by newline/space
        
        # Let's use a standard pattern for our specific formatting
        # Our choices look like:
        # {
        #    text: "...",
        #    type: '...',
        #    feedback: "...",
        #    next: '...'
        # }
        
        choice_objs = []
        
        # Split by `{` that starts a choice
        # This is also hard.
        
        # Let's try simple text processing lines
        lines_in_block = choices_inner.split('\n')
        
        # Reconstruct objects
        current_obj_lines = []
        parsed_choices = []
        
        brace_depth = 0
        current_obj_start = -1
        
        for i, char in enumerate(choices_inner):
            if char == '{':
                if brace_depth == 0:
                    current_obj_start = i
                brace_depth += 1
            elif char == '}':
                brace_depth -= 1
                if brace_depth == 0 and current_obj_start != -1:
                    # Found a complete object
                    obj_str = choices_inner[current_obj_start:i+1]
                    parsed_choices.append(obj_str)
                    current_obj_start = -1

        # Now check logical types
        correct_indices = []
        for idx, choice_str in enumerate(parsed_choices):
            if "type: 'correct'" in choice_str or 'type: "correct"' in choice_str:
                correct_indices.append(idx)
        
        if len(correct_indices) > 1:
            print(f"Found {len(correct_indices)} correct choices in block at char {start_choices}")
            
            # Logic to keep the best one
            # We prefer:
            # 1. No "Action:" prefix
            # 2. Longer length (usually more descriptive)
            
            best_idx = -1
            max_score = -1
            
            for idx in correct_indices:
                c_str = parsed_choices[idx]
                
                # Extract text
                text_match = re.search(r'text:\s*["\'](.*?)["\']', c_str)
                text_val = text_match.group(1) if text_match else ""
                
                score = 0
                if "Action:" not in text_val:
                    score += 1000
                score += len(text_val)
                
                if score > max_score:
                    max_score = score
                    best_idx = idx
            
            # Filter out the other correct choices
            choices_to_keep = []
            for idx, c_str in enumerate(parsed_choices):
                if idx in correct_indices and idx != best_idx:
                    print(f"  Dropping duplicate correct choice: {c_str[:50]}...")
                    continue
                
                # Also cleaning "Action:" from the text while we are here?
                # The user asked for it before.
                
                # Let's stick to deduping for now to be safe.
                choices_to_keep.append(c_str)
                
            parsed_choices = choices_to_keep
            changes_made += 1
            
        # Reconstruct the inner block
        new_inner = "\n" + ",\n".join(parsed_choices) + "\n            "
        
        # Append to output
        # Prefix part
        prefix_len = start_choices - last_idx + 1 # include '['
        final_output += content[last_idx:last_idx + match.start()] + "choices: [" + new_inner
        
        last_idx = end_choices # Move past the original block
        
    final_output += content[last_idx:] # Rest of file
    
    if changes_made > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(final_output)
        print(f"✅ Fixed {changes_made} duplicate sets in {filepath}")
    else:
        print(f"No duplicates found in {filepath}")

fix_duplicates('scenarios/lumen_gi.js')
fix_duplicates('scenarios/blueprintslogic_advanced.js')
