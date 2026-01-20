"""
Fix null next values in scenario files.
Replaces "next": null with "next": "<current-step-id>"
"""

import re
import sys
from pathlib import Path

def fix_null_next_values(filepath):
    """Fix null next values in a scenario file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Count nulls before
    nulls_before = content.count('"next": null')
    
    if nulls_before == 0:
        return 0
    
    # Find all step definitions
    step_pattern = r'"(step-[^"]+)":\s*\{'
    
    # Process each step
    result_lines = []
    current_step = None
    
    for line in content.split('\n'):
        # Check if this line starts a new step
        step_match = re.search(r'"(step-[^"]+)":\s*\{', line)
        if step_match:
            current_step = step_match.group(1)
        
        # Check if line has null next
        if '"next": null' in line and current_step:
            line = line.replace('"next": null', f'"next": "{current_step}"')
        
        result_lines.append(line)
    
    result = '\n'.join(result_lines)
    
    # Count nulls after
    nulls_after = result.count('"next": null')
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(result)
    
    return nulls_before - nulls_after


def main():
    scenarios_dir = Path('scenarios')
    total_fixed = 0
    
    for filepath in scenarios_dir.glob('**/*.js'):
        fixed = fix_null_next_values(filepath)
        if fixed > 0:
            print(f"Fixed {fixed} null next values in {filepath.name}")
            total_fixed += fixed
    
    if total_fixed == 0:
        print("No null next values found!")
    else:
        print(f"\nTotal: Fixed {total_fixed} null next values")


if __name__ == '__main__':
    main()
