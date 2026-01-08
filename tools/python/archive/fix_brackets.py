"""
Fix scenario files - remove stray brackets and duplicate step definitions.
"""

import os
import re

SCENARIOS_DIR = r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\scenarios'

def fix_scenario_file(filepath):
    """Fix stray brackets in choice text."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Remove stray ] at end of text strings before closing quote
    # Pattern: ]" followed by comma
    content = content.replace(']",', '",')
    content = content.replace(']."]', '."')
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    print("Fixing scenario files...")
    fixed_count = 0
    
    for filename in os.listdir(SCENARIOS_DIR):
        if filename.endswith('.js') and not filename.endswith('.bak'):
            filepath = os.path.join(SCENARIOS_DIR, filename)
            if fix_scenario_file(filepath):
                print(f"  Fixed: {filename}")
                fixed_count += 1
    
    print(f"\nFixed {fixed_count} files")

if __name__ == "__main__":
    main()
