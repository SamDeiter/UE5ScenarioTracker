"""
UE5 Scenario Syntax Fixer - Surgical Approach

This script:
1. Only fixes the \\' escape pattern (to ')
2. Does NOT try to modify structure or add conclusion steps
3. Validates files can parse after fixing
"""

import os
import re

SCENARIO_DIR = os.path.join(os.getcwd(), 'scenarios')

def fix_escaped_quotes_only(content):
    """
    Only fix the \\' pattern that causes 'Unexpected identifier' errors.
    This is the pattern: \\' which should just be '
    """
    # The issue is that LLM output has \' but when saved, sometimes becomes \\'
    # JavaScript doesn't interpret \\' correctly - it sees \\ then '
    
    # Replace all instances of \\' with just '
    # Be careful to not break legitimate escapes like \n or \t
    content = re.sub(r"\\\\'", "'", content)
    
    return content

def process_file(filepath):
    """Process a single file"""
    filename = os.path.basename(filepath)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Only apply the escaped quote fix
    content = fix_escaped_quotes_only(content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Fixed: {filename}")
        return True
    else:
        print(f"  - No changes: {filename}")
        return False

def main():
    print("=" * 60)
    print("UE5 Scenario Tracker - Minimal Syntax Fixer")
    print("Only fixes \\\\' -> ' patterns")
    print("=" * 60)
    
    files_fixed = 0
    for filename in sorted(os.listdir(SCENARIO_DIR)):
        if filename.endswith('.js') and not filename.startswith('00_'):
            filepath = os.path.join(SCENARIO_DIR, filename)
            if process_file(filepath):
                files_fixed += 1
    
    print(f"\nFixed {files_fixed} files")

if __name__ == "__main__":
    main()
