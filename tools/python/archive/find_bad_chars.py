import os
import re

# Files with errors from the console
error_files = [
    'scenarios/assetmanagement_beginner.js',
    'scenarios/audio_concurrency.js',
    'scenarios/lumen_mesh_distance.js',
    'scenarios/nanite_wpo.js',
    'scenarios/world_partition.js'
]

for filepath in error_files:
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
    
    print(f"\n{'='*60}")
    print(f"Checking: {filepath}")
    print('='*60)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Look for smart quotes and special characters
    bad_chars = {
        '\u2018': "'",  # left single quote
        '\u2019': "'",  # right single quote
        '\u201C': '"',  # left double quote
        '\u201D': '"',  # right double quote
        '\u2013': '-',  # en dash
        '\u2014': '--', # em dash
        '\u2026': '...', # ellipsis
    }
    
    found_issues = False
    for line_num, line in enumerate(lines, 1):
        for bad_char, replacement in bad_chars.items():
            if bad_char in line:
                print(f"Line {line_num}: Found {repr(bad_char)} → suggest {repr(replacement)}")
                print(f"  Preview: {line.strip()[:80]}")
                found_issues = True
    
    if not found_issues:
        print("No special characters found in this file.")
