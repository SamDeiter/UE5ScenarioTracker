import os

# Files with errors
error_files = [
    'scenarios/assetmanagement_beginner.js',
    'scenarios/audio_concurrency.js',
    'scenarios/lumen_mesh_distance.js',
    'scenarios/nanite_wpo.js',
    'scenarios/world_partition.js'
]

# Character replacements
replacements = {
    '\u2018': "'",  # left single quote
    '\u2019': "'",  # right single quote
    '\u201C': '"',  # left double quote
    '\u201D': '"',  # right double quote
    '\u2013': '-',  # en dash
    '\u2014': '--', # em dash
    '\u2026': '...', # ellipsis
}

total_fixed = 0

for filepath in error_files:
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    fixed_content = content
    file_fixes = 0
    
    for bad_char, replacement in replacements.items():
        count = fixed_content.count(bad_char)
        if count > 0:
            fixed_content = fixed_content.replace(bad_char, replacement)
            file_fixes += count
            total_fixed += count
    
    if file_fixes > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print(f"✅ Fixed {file_fixes} characters in {filepath}")
    else:
        print(f"✓ No issues found in {filepath}")

print(f"\n🎉 Total characters fixed: {total_fixed}")
