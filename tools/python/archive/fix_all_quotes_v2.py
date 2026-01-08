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
    
    lines = content.split('\n')
    new_lines = []
    
    for line_num, line in enumerate(lines, 1):
        new_line = []
        i = 0
        in_single_quote = False
        in_double_quote = False
        quote_start = -1
        
        while i < len(line):
            char = line[i]
            
            # Handle escape sequences
            if char == '\\' and i + 1 < len(line):
                new_line.append(line[i:i+2])
                i += 2
                continue
            
            # Track double quotes (for feedback: "..." strings)
            if char == '"' and not in_single_quote:
                if not in_double_quote:
                    in_double_quote = True
                    quote_start = i
                    new_line.append(char)
                    i += 1
                    continue
                else:
                    # Could be end of string or embedded quote
                    # Check if this looks like end of property value
                    next_char = line[i + 1] if i + 1 < len(line) else ''
                    
                    if next_char in ',}\n\r':
                        # End of string
                        in_double_quote = False
                        new_line.append(char)
                        i += 1
                        continue
                    elif next_char == ' ' and i + 2 < len(line) and line[i+2] in ',}':
                        # End of string with trailing space
                        in_double_quote = False
                        new_line.append(char)
                        i += 1
                        continue
                    else:
                        # This is an embedded quote - escape it
                        new_line.append('\\"')
                        file_fixes += 1
                        i += 1
                        continue
            
            # Track single quotes (for text: '...' and title: '...' strings) 
            if char == "'" and not in_double_quote:
                if not in_single_quote:
                    in_single_quote = True
                    quote_start = i
                    new_line.append(char)
                    i += 1
                    continue
                else:
                    # Could be end of string or apostrophe
                    next_char = line[i + 1] if i + 1 < len(line) else ''
                    prev_char = new_line[-1] if new_line else ''
                    
                    if next_char in ',}\n\r]':
                        # End of string
                        in_single_quote = False
                        new_line.append(char)
                        i += 1
                        continue
                    elif next_char == ' ' and i + 2 < len(line) and line[i+2] in ',}]':
                        # End with trailing space
                        in_single_quote = False
                        new_line.append(char)
                        i += 1
                        continue
                    elif prev_char.isalpha() and next_char.isalpha():
                        # Contraction like don't, it's, etc.
                        new_line.append("\\'")
                        file_fixes += 1
                        i += 1
                        continue
                    elif prev_char.isalpha() and next_char == 's' and (i + 2 >= len(line) or not line[i + 2].isalnum()):
                        # Possessive like player's
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
        print(f"✅ Fixed {file_fixes} quote issues in {os.path.basename(filepath)}")

print(f"\n{'='*50}")
print(f"Total quotes escaped: {total_fixed}")
print(f"Files modified: {len(files_modified)}")

if total_fixed == 0:
    print("\nNo more unescaped quotes found.")
