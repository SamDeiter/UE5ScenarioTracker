import os
import re

SCENARIO_DIR = os.path.join(os.getcwd(), 'scenarios')

def fix_quote_mismatch(line):
    # Fix: prompt:"..."', -> prompt:"...",
    # Regex checks for: key:"(content)"',
    # We want to change the ending ', to ",
    pattern = r'(\w+\s*:\s*")((?:[^"\\]|\\.)*)("\s*,)' # Matches correctly quoted
    
    # Matching the BROKEN one: key:"(content)',
    # Note: content cannot contain unescaped " usually, but here it ends with '
    # We look for key followed by " ... ',
    
    # Heuristic: If line contains `:"` and ends with `',` (ignoring whitespace)
    if re.search(r'\w+\s*:\s*"', line):
        if re.search(r"',\s*$", line) or re.search(r"',\s*choices", line):
            # It starts with " and ends with ' -> Replace the LAST ' with "
            # carefully.
            # safe replace: find the last occurrence of ' before the comma or end
            line = re.sub(r"',(\s*)$", '",\\1', line)
            line = re.sub(r"',(\s*choices)", '",\\1', line)
            line = re.sub(r"',(\s*next)", '",\\1', line)
            # Handle specific dash.js case: ...</strong>',choices:
            line = line.replace("</strong>',choices:", "</strong>\",choices:")
            
            print(f"  Fixed mismatched quotes.")
    return line

def fix_unescaped_single_quotes(line):
    # Fix: title: '...Lumen's...',
    # We search for fields wrapped in single quotes that contain single quotes inside.
    
    # Function to replace unescaped ' inside a matched string
    def replace_internal_quotes(match):
        prefix = match.group(1) # key: '
        content = match.group(2)
        suffix = match.group(3) # ', or '
        
        # Escape single quotes in content
        # We assume existing escaped quotes \' are fine. We target ' that are NOT \'.
        # But wait, python regex replace is tricky.
        
        # Split by \' to preserve existing escapes?
        # Simpler: replace all ' with \' then replace \\' with \' (if checks out)
        # OR: replace (?<!\\)' with \'
        
        fixed_content = re.sub(r"(?<!\\)'", r"\\'", content)
        
        if content != fixed_content:
            print(f"  Fixed unescaped single quote in: {content[:20]}...")
            return f"{prefix}{fixed_content}{suffix}"
        return match.group(0)

    # Regex covers: key: 'content', OR key: 'content' (at end of line/object)
    # We exclude cases where content contains legitimate closing quote... which is hard.
    # But usually these are simple keys like title, prompt, feedback.
    
    # We'll rely on the field structure: key:\s*'...'(,|})
    # Warning: greedy matching might eat the closing quote if we are not careful.
    # But invalid strings allow ' inside.
    
    # We assume the Value DOES NOT contain `',` or `'} ` or `'next` sequence usually, 
    # except at the very end.
    # Actually, in minified files this is dangerous.
    # But these files are somewhat formatted (keys have spaces).
    
    # Specific fix for title: '...'
    line = re.sub(r"(title\s*:\s*')(.+?)(',\s*)", replace_internal_quotes, line)
    
    # Specific fix for error in lumen_gi.js: 'Visualizing Lumen's Geometry Representation'
    # The regex above will match "Visualizing Lumen" as content, and leave "s Geometry..." remaining?
    # No, .+? is non-greedy. It will stop at the first '.
    # So "Visualizing Lumen" matches. "s Geometry..." is left over.
    # This implies the regex logic above won't catch it because the regex engine sees a valid string 'Visualizing Lumen' followed by garbage.
    
    # Logic pivot: Find lines that look like valid JS but have garbage after the "end" quote?
    # Or simplified: specific word replacements known to fail?
    # "Lumen's", "It's", "Player's", "World's"
    
    known_bad_words = ["Lumen's", "It's", "player's", "isn't", "don't", "can't", "won't", "shouldn't", "haven't", "world's", "character's", "artist's", "Lead's"]
    
    for word in known_bad_words:
        # If we see key: '...word...'
        # We check if the word is unescaped
        if f"'{word}" in line or f" {word}" in line:
            # We blindly escape ONLY if we are sure we are inside a single-quoted string.
            # This is hard.
            pass

    # Alternative: Look for syntax error patterns: '...'(text)...',
    # Try to locate the LAST ' before the comma.
    
    # Let's try a robust specific fix for known failing files first.
    if "Lumen's" in line and "title:" in line:
        line = line.replace("Lumen's", "Lumen\\'s")
        print("  Fixed Lumen's")
        
    if "It's" in line and ("prompt:" in line or "feedback:" in line):
        # Only escape if inside single quotes. How do we know?
        # Heuristic: if line has 'It's' and starts with key:'
        pass
        
    # Re-implement general quote escaper that is greedy-ish?
    # Finds valid start: key: '
    # Finds valid end:   ',
    # Escapes everything in between.
    
    # Regex: (key\s*:\s*')(.+?)('(?:\s*,|\s*}))
    # Be careful of nested structures? No, strings are leaf nodes.
    # Only if the string itself contains "'," is it dangerous.
    
    def aggressive_escape(match):
        p, c, s = match.group(1), match.group(2), match.group(3)
        if "'" in c and "\\'" not in c: # naive check
             fixed = c.replace("'", "\\'")
             return f"{p}{fixed}{s}"
        return match.group(0)

    # Note: .+? is non-greedy. It will stop at the FIRST '.
    # So `title: 'It's broken',`
    # Match: `title: 'It'` -> c="It". s=" broken'," (NO MATCH for s)
    # The regex won't match if the ' is in the middle and followed by text.
    
    # We need to match the WHOLE line part.
    # Assuming one key-value per line or at least distinct.
    
    # Fix 1: Title field specifically (often short, on one line)
    # If we see `title: '...` and `',` at the end of the logical segment.
    
    if "title:" in line and line.count("'") > 2:
        # Likely unescaped quote.
        # title: 'Visualizing Lumen's Geometry Representation',
        # parts: [padding, title: , Visualizing Lumen, s Geometry Representation, , ]
        parts = line.split("'")
        # heuristic: join middle parts with \'
        # But we must preserve the first and last '
        # We simply replace all internal ' with \'
        # Find index of first ' after "title:"
        start_idx = line.find("'")
        # Find index of last '
        end_idx = line.rfind("'")
        
        if start_idx != -1 and end_idx != -1 and start_idx < end_idx:
            content = line[start_idx+1:end_idx]
            if "'" in content:
                # Escape them
                fixed_content = content.replace("'", "\\'")
                line = line[:start_idx+1] + fixed_content + line[end_idx:]
                print("  Fixed unescaped quotes in title.")

    return line

def process_file(filepath):
    print(f"Processing {os.path.basename(filepath)}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    new_lines = []
    
    # Special Handler for assetmanagement_intermediate.js duplication
    # We look for the SECOND occurrence of 'step-inv-1' and chop everything before it to merge?
    # Or deleting the DUPLICATE part.
    # The view_file output showed 'conclusion' (line 292) followed quickly by 'step-inv-1' (line 297).
    # Lines 1-295 seemed to be the "original" half-broken set?
    # Or maybe 297+ is the copy?
    # In 'assetmanagement_intermediate.js', duplicate keys overwrite.
    # But syntactically:
    # 292: 'conclusion'
    # 293: }
    # 294: ]
    # 295: },
    # 296:
    # 297: 'step-inv-1': ...
    #
    # Wait, 'conclusion' has no value (colon + obj). It's a Syntax Error.
    # And the braces `}]` at 293-294 close the `choices` array of the PREVIOUS item (step-rh-4)?
    # No, step-rh-4 choice ends.
    #
    # It seems the file has a botched merge.
    # I will attempt to detect the "RESET" point where it restarts keys that were already seen.
    
    seen_keys = set()
    is_asset_mgmt = 'assetmanagement_intermediate.js' in filepath
    cut_start = -1
    
    for i, line in enumerate(lines):
        # General Fixes
        line = fix_quote_mismatch(line)
        line = fix_unescaped_single_quotes(line)
        
        # Specific fix for assetmanagement duplication
        if is_asset_mgmt:
            # Check for key definition
            m = re.match(r"\s*'([\w-]+)':\s*\{", line)
            if m:
                key = m.group(1)
                if key in seen_keys:
                    print(f"  Found duplicate key reset at line {i+1}: {key}")
                    # This implies valid overwrite?
                    # But the 'conclusion' syntax error just before it suggests a bad cut.
                    # We should probably KEEP the second version and deleting the first?
                    # Or keep the first and delete seconds?
                    # Usually the later one is the "intended" append, but if the file is just duplicated...
                    pass
                seen_keys.add(key)
        
        new_lines.append(line)

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

def main():
    if not os.path.exists(SCENARIO_DIR):
        print("Scenario directory not found.")
        return

    for filename in os.listdir(SCENARIO_DIR):
        if filename.endswith(".js"):
            # if filename in ['dash.js', 'lumen_gi.js', 'assetmanagement_intermediate.js']: # process ALL
            process_file(os.path.join(SCENARIO_DIR, filename))

if __name__ == "__main__":
    main()
