import os
import re
import glob

js_files = glob.glob('scenarios/*.js')

total_fixed = 0
files_fixed = []

def fix_single_quoted_strings(content):
    """
    Find all single-quoted strings and escape unescaped apostrophes within them.
    Handles: text: 'some text with apostrophe's in it'
    """
    fixed = 0
    result = []
    i = 0
    
    while i < len(content):
        # Look for patterns like: text: ' or similar property assignments with single quotes
        # We need to find single-quoted string literals
        
        if content[i] == "'" and i > 0:
            # Check if this might be the start of a single-quoted string
            # Look back to see if we're after a colon or opening bracket
            j = i - 1
            while j >= 0 and content[j] in ' \t':
                j -= 1
            
            if j >= 0 and content[j] in ':,([{':
                # This looks like the start of a string literal
                # Find the matching end quote
                string_start = i
                i += 1
                string_content = ""
                
                while i < len(content):
                    if content[i] == '\\' and i + 1 < len(content):
                        # Escape sequence - keep both characters
                        string_content += content[i:i+2]
                        i += 2
                    elif content[i] == "'":
                        # Check if this is the end of the string or an apostrophe
                        # Look ahead to see if the next non-whitespace is a valid continuation
                        k = i + 1
                        while k < len(content) and content[k] in ' \t':
                            k += 1
                        
                        if k < len(content) and content[k] in ',}]\n\r':
                            # This is the end of the string
                            break
                        else:
                            # This might be an apostrophe in the middle of text
                            # Check the surrounding context
                            # If previous char is a letter and next char is a letter, it's an apostrophe
                            if (len(string_content) > 0 and string_content[-1].isalpha() and 
                                i + 1 < len(content) and content[i + 1].isalpha()):
                                # This is an apostrophe - escape it
                                string_content += "\\'"
                                fixed += 1
                                i += 1
                            else:
                                # Assume end of string
                                break
                    else:
                        string_content += content[i]
                        i += 1
                
                result.append("'" + string_content + "'")
                if i < len(content):
                    i += 1  # Skip the closing quote
                continue
        
        result.append(content[i])
        i += 1
    
    return ''.join(result), fixed


def simple_fix(content):
    """
    Simpler approach: Find common patterns and fix them
    """
    # Common words with apostrophes that appear in single-quoted strings
    patterns_to_fix = [
        # Contractions
        (r"(text:\s*'[^']*)\bdon't\b", r"\1don\\'t"),
        (r"(text:\s*'[^']*)\bdoesn't\b", r"\1doesn\\'t"),
        (r"(text:\s*'[^']*)\bwon't\b", r"\1won\\'t"),
        (r"(text:\s*'[^']*)\bcan't\b", r"\1can\\'t"),
        (r"(text:\s*'[^']*)\bwouldn't\b", r"\1wouldn\\'t"),
        (r"(text:\s*'[^']*)\bcouldn't\b", r"\1couldn\\'t"),
        (r"(text:\s*'[^']*)\bshouldn't\b", r"\1shouldn\\'t"),
        (r"(text:\s*'[^']*)\bisn't\b", r"\1isn\\'t"),
        (r"(text:\s*'[^']*)\baren't\b", r"\1aren\\'t"),
        (r"(text:\s*'[^']*)\bwasn't\b", r"\1wasn\\'t"),
        (r"(text:\s*'[^']*)\bweren't\b", r"\1weren\\'t"),
        (r"(text:\s*'[^']*)\bhaven't\b", r"\1haven\\'t"),
        (r"(text:\s*'[^']*)\bhasn't\b", r"\1hasn\\'t"),
        (r"(text:\s*'[^']*)\bdidn't\b", r"\1didn\\'t"),
        (r"(text:\s*'[^']*)\bit's\b", r"\1it\\'s"),
        (r"(text:\s*'[^']*)\bthat's\b", r"\1that\\'s"),
        (r"(text:\s*'[^']*)\bwhat's\b", r"\1what\\'s"),
        (r"(text:\s*'[^']*)\bthere's\b", r"\1there\\'s"),
        (r"(text:\s*'[^']*)\bhere's\b", r"\1here\\'s"),
        (r"(text:\s*'[^']*)\bwhere's\b", r"\1where\\'s"),
        (r"(text:\s*'[^']*)\bwho's\b", r"\1who\\'s"),
        (r"(text:\s*'[^']*)\blet's\b", r"\1let\\'s"),
        (r"(text:\s*'[^']*)\byou're\b", r"\1you\\'re"),
        (r"(text:\s*'[^']*)\bwe're\b", r"\1we\\'re"),
        (r"(text:\s*'[^']*)\bthey're\b", r"\1they\\'re"),
        (r"(text:\s*'[^']*)\bI'm\b", r"\1I\\'m"),
        (r"(text:\s*'[^']*)\bhe's\b", r"\1he\\'s"),
        (r"(text:\s*'[^']*)\bshe's\b", r"\1she\\'s"),
        # Possessives
        (r"(text:\s*'[^']*)\bplayer's\b", r"\1player\\'s"),
        (r"(text:\s*'[^']*)\bactor's\b", r"\1actor\\'s"),
        (r"(text:\s*'[^']*)\bmesh's\b", r"\1mesh\\'s"),
        (r"(text:\s*'[^']*)\basset's\b", r"\1asset\\'s"),
        (r"(text:\s*'[^']*)\bengine's\b", r"\1engine\\'s"),
        (r"(text:\s*'[^']*)\bgame's\b", r"\1game\\'s"),
        (r"(text:\s*'[^']*)\bworld's\b", r"\1world\\'s"),
        (r"(text:\s*'[^']*)\blevel's\b", r"\1level\\'s"),
        (r"(text:\s*'[^']*)\blight's\b", r"\1light\\'s"),
        (r"(text:\s*'[^']*)\bcharacter's\b", r"\1character\\'s"),
        (r"(text:\s*'[^']*)\bobject's\b", r"\1object\\'s"),
        (r"(text:\s*'[^']*)\bspawner's\b", r"\1spawner\\'s"),
    ]
    
    fixed = 0
    for pattern, replacement in patterns_to_fix:
        new_content, count = re.subn(pattern, replacement, content, flags=re.IGNORECASE)
        if count > 0:
            content = new_content
            fixed += count
    
    return content, fixed


# Better approach: directly fix the known problem by converting single-quoted 
# text strings to use escaped apostrophes
for filepath in js_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Simple approach: find text: '...' patterns and escape apostrophes inside
    lines = content.split('\n')
    new_lines = []
    file_fixes = 0
    
    for line_num, line in enumerate(lines, 1):
        # Check if this line has text: ' pattern
        if re.search(r"text:\s*'", line):
            # Find all unescaped apostrophes in the text value
            # Split on text: '
            match = re.match(r"(.*text:\s*')(.*)('\s*,?\s*)$", line)
            if match:
                prefix = match.group(1)
                text_content = match.group(2)
                suffix = match.group(3)
                
                # Escape any unescaped apostrophes in text_content
                # But don't double-escape already escaped ones
                new_text = ""
                i = 0
                while i < len(text_content):
                    if text_content[i] == '\\' and i + 1 < len(text_content):
                        new_text += text_content[i:i+2]
                        i += 2
                    elif text_content[i] == "'":
                        new_text += "\\'"
                        file_fixes += 1
                        i += 1
                    else:
                        new_text += text_content[i]
                        i += 1
                
                line = prefix + new_text + suffix
        
        new_lines.append(line)
    
    new_content = '\n'.join(new_lines)
    
    if new_content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        files_fixed.append(os.path.basename(filepath))
        total_fixed += file_fixes
        print(f"✅ Fixed {file_fixes} apostrophes in {os.path.basename(filepath)}")

print(f"\n{'='*50}")
print(f"Total apostrophes escaped: {total_fixed}")
print(f"Files modified: {len(files_fixed)}")

if total_fixed == 0:
    print("\nNo more apostrophes to fix in text: '...' patterns.")
