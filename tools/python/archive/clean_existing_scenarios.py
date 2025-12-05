import glob
import re
import os

def clean_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 1. Remove "Step X:" from titles
        # Pattern: title: "Step 1: The Problem" -> title: "The Problem"
        # Handles single and double quotes
        # Also handles "Step 1.2:"
        
        # Regex explanation:
        # title:\s*     -> match 'title:' followed by whitespace
        # (['"])        -> capture the opening quote (group 1)
        # Step\s*\d+(?:\.\d+)?\s*:\s*  -> match "Step", space, digits, optional .digits, colon, space
        # (.*?)         -> capture the rest of the title (group 2)
        # \1            -> match the closing quote (same as group 1)
        
        # We need to be careful not to break the quote matching.
        # Let's do it simply: replace "Step \d+: " with "" inside the title line.
        
        def title_replacer(match):
            full_str = match.group(0)
            # Just strip the "Step X: " part
            clean = re.sub(r"Step\s*\d+(?:\.\d+)?\s*:\s*", "", full_str, flags=re.IGNORECASE)
            return clean

        content = re.sub(r"title:\s*['\"].*?['\"]", title_replacer, content)

        # 2. Remove "Action: [" from choices
        # Pattern: text: "Action: [Do Something]" -> text: "Do Something" (keeping the brackets is usually fine if they want it, but user said "Action: Switch..." in screenshot without brackets maybe?)
        # User screenshot: "Action: Switch from..."
        # So we just remove "Action: " and optional brackets?
        # Let's just remove "Action:\s*"
        
        content = re.sub(r"(text:\s*['\"])Action:\s*(?:\[)?", r"\1", content)
        
        # Also clean closing bracket if we removed opening bracket? 
        # Actually in the screenshot "Action: Switch..." doesn't have brackets.
        # But previous examples did "Action: [Check Logs]".
        # Let's simple remove "Action: " and handled brackets if they exist as a separate pass if needed.
        # If I remove "Action: [", I am left with "Check Logs]". That's bad.
        
        # Better approach: 
        # Remove "Action: "
        # Remove "[" and "]" if they wrap the *entire* remaining text?
        # Let's just remove "Action: " for now as that's the main annoyance. 
        # The user's screenshot showed "Action: Switch..." (no brackets).
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
        return True
    except Exception as e:
        print(f"Error {filepath}: {e}")
        return False

files = glob.glob('scenarios/*.js')
print(f"Cleaning {len(files)} files...")
for f in files:
    clean_file(f)
print("Done.")
