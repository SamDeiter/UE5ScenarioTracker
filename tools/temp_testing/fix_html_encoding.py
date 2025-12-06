"""
Fix HTML rendering in scenario files by ensuring proper character encoding.
"""
import os
import re
import json

# Directory containing scenario files
SCENARIOS_DIR = r"c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\scenarios"

def fix_html_in_string(text):
    """
    Replace Unicode escape sequences with their actual HTML characters.
    """
    # Replace \\u003c with <
    # Replace \\u003e with >
    text = text.replace(r'\u003c', '<')
    text = text.replace(r'\u003e', '>')
    return text

def process_file(filepath):
    """
    Read a JavaScript scenario file and fix HTML encoding.
    """
    print(f"Processing: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if the file contains escaped HTML
    if r'\u003c' not in content:
        print(f"  No escaped HTML found, skipping")
        return False
    
    # Fix the Unicode escapes
    fixed_content = fix_html_in_string(content)
    
    # Write it back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    
    print(f"  Fixed HTML encoding")
    return True

def main():
    """
    Process all .js files in the scenarios directory.
    """
    files_fixed = 0
    
    for filename in os.listdir(SCENARIOS_DIR):
        if filename.endswith('.js'):
            filepath = os.path.join(SCENARIOS_DIR, filename)
            if process_file(filepath):
                files_fixed += 1
    
    print(f"\nTotal files fixed: {files_fixed}")

if __name__ == "__main__":
    main()
