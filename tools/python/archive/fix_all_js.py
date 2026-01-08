import os
import re
import glob

js_files = glob.glob('scenarios/*.js')

total_fixed = 0
files_modified = []

for filepath in js_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    file_fixes = 0
    
    # Pattern to find any property: 'value' pattern where value may contain apostrophes
    # We need to find single-quoted strings and escape apostrophes inside them
    
    # Split into lines for easier processing
    lines = content.split('\n')
    new_lines = []
    
    for line_num, line in enumerate(lines, 1):
        original_line = line
        
        # Check if line contains property: ' pattern (title:, text:, skill:, type:, next:, etc.)
        # Pattern: match property_name: 'content'
        
        # Find all single-quoted strings in the line
        # We'll use a state machine approach
        new_line = []
        i = 0
        in_single_quote = False
        in_double_quote = False
        
        while i < len(line):
            char = line[i]
            
            if char == '\\' and i + 1 < len(line):
                # Escape sequence - keep as-is
                new_line.append(line[i:i+2])
                i += 2
                continue
            
            if char == '"' and not in_single_quote:
                in_double_quote = not in_double_quote
                new_line.append(char)
                i += 1
                continue
            
            if char == "'" and not in_double_quote:
                if not in_single_quote:
                    # Starting a single-quoted string
                    in_single_quote = True
                    new_line.append(char)
                    i += 1
                    continue
                else:
                    # Could be end of string or apostrophe
                    # Look at context - if surrounded by letters, it's an apostrophe
                    prev_char = new_line[-1] if new_line else ''
                    next_char = line[i + 1] if i + 1 < len(line) else ''
                    
                    # Check if this looks like end of string
                    # End patterns: ', or '] or '} or at end of meaningful content
                    if next_char in ',}]\n\r':
                        # This is end of string
                        in_single_quote = False
                        new_line.append(char)
                        i += 1
                        continue
                    elif next_char == ' ' and i + 2 < len(line) and line[i + 2] in ',}]':
                        # '  , pattern - end of string with trailing space
                        in_single_quote = False
                        new_line.append(char)
                        i += 1
                        continue
                    elif prev_char.isalpha() and next_char.isalpha():
                        # Letter'Letter - this is an apostrophe (contraction)
                        new_line.append("\\'")
                        file_fixes += 1
                        i += 1
                        continue
                    elif prev_char.isalpha() and next_char == 's' and (i + 2 >= len(line) or not line[i + 2].isalpha()):
                        # Possessive: word's 
                        new_line.append("\\'")
                        file_fixes += 1
                        i += 1
                        continue
                    else:
                        # Assume end of string
                        in_single_quote = False
                        new_line.append(char)
                        i += 1
                        continue
            
            new_line.append(char)
            i += 1
        
        new_lines.append(''.join(new_line))
    
    new_content = '\n'.join(new_lines)
    
    if new_content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        files_modified.append(os.path.basename(filepath))
        total_fixed += file_fixes
        print(f"✅ Fixed {file_fixes} apostrophes in {os.path.basename(filepath)}")

print(f"\n{'='*50}")
print(f"Total apostrophes escaped: {total_fixed}")
print(f"Files modified: {len(files_modified)}")

if total_fixed == 0:
    print("\nNo more unescaped apostrophes found in single-quoted strings.")
