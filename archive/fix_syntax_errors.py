"""
Fix JavaScript Syntax Errors in Scenario Files

This script fixes two main issues:
1. Escaped single quotes (\\') that break JavaScript parsing
2. Bare 'conclusion' strings that aren't valid key-value pairs
"""

import os
import re

SCENARIO_DIR = os.path.join(os.getcwd(), 'scenarios')

def fix_escaped_quotes(content):
    """
    Fix escaped single quotes that break JavaScript syntax.
    Patterns like: 'step-1\\': {skill:\\'input\\'
    Should become: 'step-1': {skill:'input'
    """
    # Replace \\' with ' (escaped single quotes)
    # Be careful: we want \' -> ' but not \\' unchanged
    # The pattern in the files shows literal backslash before quote
    
    # Fix patterns like: 'step-1\': -> 'step-1':
    content = re.sub(r"\\+'", "'", content)
    
    return content


def fix_bare_conclusion(content):
    """
    Fix bare 'conclusion' strings that appear without proper object syntax.
    These appear as standalone strings in the steps object.
    
    Pattern to remove:
        'conclusion'
                },
    
    Or patterns where 'conclusion' appears mid-object without a colon.
    """
    # Remove lines that are just 'conclusion' followed by whitespace and },
    # This is a corrupted pattern that breaks parsing
    
    # Pattern: 'conclusion' on its own line (not followed by :)
    content = re.sub(r"^\s*'conclusion'\s*$\n", "", content, flags=re.MULTILINE)
    
    # Also fix cases where 'conclusion' appears inline without being a key
    # E.g., next: 'conclusion' is VALID, but 'conclusion' alone is NOT
    
    return content


def fix_duplicate_step_blocks(content):
    """
    Some files have duplicate step definitions that cause issues.
    We keep the first occurrence and remove duplicates.
    """
    # Find all step key definitions
    step_pattern = re.compile(r"'([^']+)':\s*\{[^}]*skill:")
    
    seen_steps = set()
    lines = content.split('\n')
    new_lines = []
    skip_until_next_step = False
    
    for line in lines:
        match = step_pattern.search(line)
        if match:
            step_name = match.group(1)
            if step_name in seen_steps and step_name != 'conclusion':
                # This is a duplicate - start skipping
                skip_until_next_step = True
                print(f"  Skipping duplicate step: {step_name}")
                continue
            seen_steps.add(step_name)
            skip_until_next_step = False
        
        if not skip_until_next_step:
            new_lines.append(line)
    
    return '\n'.join(new_lines)


def process_file(filepath):
    """Process a single scenario file."""
    filename = os.path.basename(filepath)
    print(f"Processing {filename}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Apply fixes in order
    content = fix_escaped_quotes(content)
    content = fix_bare_conclusion(content)
    
    if content != original:
        print(f"  Applied fixes to {filename}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
    else:
        print(f"  No changes needed for {filename}")


def main():
    if not os.path.exists(SCENARIO_DIR):
        print(f"Scenario directory not found: {SCENARIO_DIR}")
        return
    
    print(f"Scanning {SCENARIO_DIR}...")
    
    fixed_count = 0
    for filename in sorted(os.listdir(SCENARIO_DIR)):
        if filename.endswith('.js'):
            filepath = os.path.join(SCENARIO_DIR, filename)
            process_file(filepath)
            fixed_count += 1
    
    print(f"\nProcessed {fixed_count} files.")


if __name__ == "__main__":
    main()
