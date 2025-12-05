
import glob
import re
import os

def fix_file(fpath):
    print(f"Processing {fpath}...")
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    fixed_lines = []
    
    # 1. Fix Quotes Line-by-Line
    for line in lines:
        # Target lines like: text: "Search for "LogStreaming" errors]"
        if 'text:' in line and '"' in line:
            # Find the first quote (start of value) and last quote (end of value)
            first_q = line.find('"')
            last_q = line.rfind('"')
            
            # Ensure we have a valid range and they are distinct
            if first_q != -1 and last_q != -1 and first_q < last_q:
                # Extract inner content
                inner = line[first_q+1 : last_q]
                
                # If inner content has quotes, replace them with single quotes
                if '"' in inner:
                    fixed_inner = inner.replace('"', "'")
                    # Reconstruct line
                    line = line[:first_q+1] + fixed_inner + line[last_q:]
        
        fixed_lines.append(line)
    
    content = '\n'.join(fixed_lines)

    # 2. Fix Specific Syntax Errors (Manual Patches)
    if 'world_partition.js' in fpath:
        # Fix the empty 'next:' property that causes the break
        content = content.replace("next:\n", "next: 'step-inv-1',\n")

    # 3. Truncate Duplicates based on 'conclusion' block
    # Regex for definition: 'conclusion'\s*:\s*\{
    # We look for the START of the conclusion block.
    # If there are multiple, we assume duplication and cut after the first one closes.
    
    conclusion_matches = list(re.finditer(r"'conclusion'\s*:\s*\{", content))
    
    if len(conclusion_matches) > 1:
        print(f"  -> Detected {len(conclusion_matches)} conclusion blocks. Truncating duplicates.")
        
        # We want to keep the FIRST scenario definition.
        # Find the end of the file relative to the first conclusion.
        # Scenarios end with "};" or inside "steps: { ... }"
        # Safe bet: Find the first "};" that appears AFTER the conclusion start.
        
        start_idx = conclusion_matches[0].start()
        end_idx = content.find('};', start_idx)
        
        if end_idx != -1:
            # Keep up to };
            content = content[:end_idx+2]
            print("  -> Truncated file.")
            
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)

# Main Execution
base_dir = r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\scenarios"
files = glob.glob(os.path.join(base_dir, "*.js"))

for f in files:
    try:
        fix_file(f)
    except Exception as e:
        print(f"Error fixing {f}: {e}")
