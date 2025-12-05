import os
import re
import glob

js_files = glob.glob('scenarios/*.js')

total_fixed = 0
files_fixed = []

for filepath in js_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Find single-quoted strings and escape any unescaped apostrophes inside them
    # Pattern: 'text' where text contains unescaped single quotes
    
    def fix_single_quoted_string(match):
        full_match = match.group(0)
        # This is a single-quoted string - we need to escape any ' inside it
        # The pattern captures: opening ' + content + closing '
        
        # Extract content between quotes (excluding the outer quotes)
        inner = full_match[1:-1]
        
        # Escape any unescaped single quotes (but not already escaped ones)
        # Replace ' with \' but NOT \\' (already escaped)
        fixed_inner = ''
        i = 0
        while i < len(inner):
            if inner[i] == '\\' and i + 1 < len(inner):
                # Already an escape sequence, keep it
                fixed_inner += inner[i:i+2]
                i += 2
            elif inner[i] == "'":
                # Unescaped single quote - escape it
                fixed_inner += "\\'"
                i += 1
            else:
                fixed_inner += inner[i]
                i += 1
        
        return "'" + fixed_inner + "'"
    
    # This is tricky because we need to match single-quoted strings that may contain apostrophes
    # Let's use a simpler approach: find patterns like text: 'something something's something'
    
    # Actually, let's just find common contractions and escape them when inside single quotes
    contractions = [
        "what's", "it's", "that's", "there's", "here's", "where's", "who's", 
        "don't", "doesn't", "didn't", "won't", "wouldn't", "couldn't", "shouldn't",
        "can't", "aren't", "isn't", "wasn't", "weren't", "haven't", "hasn't",
        "you're", "we're", "they're", "I'm", "he's", "she's",
        "you've", "we've", "they've", "I've",
        "you'll", "we'll", "they'll", "I'll", "he'll", "she'll",
        "let's", "player's", "mesh's", "engine's", "actor's", "object's",
        "asset's", "game's", "world's", "level's", "character's",
    ]
    
    fixes_in_file = 0
    
    # Find all single-quoted strings
    # Pattern to match text: '...' or text:'...' patterns  
    pattern = r"(text:\s*'|feedback:\s*\"|prompt:\s*\"|title:\s*')"
    
    # Actually let's be more targeted - look for lines with text: ' that contain unescaped apostrophes
    lines = content.split('\n')
    new_lines = []
    
    for line in lines:
        if "text: '" in line or "text:'" in line:
            # Find the single-quoted string
            # Replace common contractions with escaped versions
            new_line = line
            for contraction in contractions:
                if contraction in new_line:
                    # Check if it's inside a single-quoted string by looking at context
                    # Simple heuristic: if text: ' precedes it, escape the apostrophe
                    escaped = contraction.replace("'", "\\'")
                    if contraction in new_line and "text: '" in new_line:
                        new_line = new_line.replace(contraction, escaped)
                        fixes_in_file += 1
            new_lines.append(new_line)
        else:
            new_lines.append(line)
    
    new_content = '\n'.join(new_lines)
    
    if new_content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        files_fixed.append(f"{os.path.basename(filepath)} ({fixes_in_file} fixes)")
        print(f"✅ Fixed {fixes_in_file} apostrophes in {filepath}")
        total_fixed += fixes_in_file

print(f"\n{'='*50}")
print(f"Total apostrophes escaped: {total_fixed}")
print(f"Files modified: {len(files_fixed)}")
