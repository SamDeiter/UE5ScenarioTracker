import os
import glob

# Find all JS files in scenarios folder
js_files = glob.glob('scenarios/*.js')

# Character replacements - these curly/smart quotes break JavaScript
replacements = {
    '\u2018': "'",   # left single curly quote → straight single quote
    '\u2019': "'",   # right single curly quote (apostrophe) → straight single quote
    '\u201C': '"',   # left double curly quote → straight double quote
    '\u201D': '"',   # right double curly quote → straight double quote
    '\u2013': '-',   # en dash → hyphen
    '\u2014': '--',  # em dash → double hyphen
    '\u2026': '...', # ellipsis → three dots
}

total_fixed = 0
files_fixed = []

for filepath in js_files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Error reading {filepath}: {e}")
        continue
    
    fixed_content = content
    file_fixes = 0
    
    for bad_char, replacement in replacements.items():
        count = fixed_content.count(bad_char)
        if count > 0:
            fixed_content = fixed_content.replace(bad_char, replacement)
            file_fixes += count
            total_fixed += count
            print(f"  Found {count}x {repr(bad_char)} in {os.path.basename(filepath)}")
    
    if file_fixes > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        files_fixed.append(f"{os.path.basename(filepath)} ({file_fixes} fixes)")
        print(f"✅ Fixed {file_fixes} characters in {filepath}")

print(f"\n{'='*50}")
print(f"Total characters fixed: {total_fixed}")
print(f"Files modified: {len(files_fixed)}")
for f in files_fixed:
    print(f"  - {f}")
