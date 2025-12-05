"""
Fix ALL problematic categories to single-word format
"""

import glob
import re

# Comprehensive mapping
category_mapping = {
    'AI/Gameplay': 'AI',
    'Procedural Generation': 'Procedural',
    'UI/UX': 'UI'
}

files_fixed = []

for filepath in glob.glob('scenarios/*.js'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Fix each problematic category
    for old_cat, new_cat in category_mapping.items():
        pattern = f'category: "{old_cat}"'
        replacement = f'category: "{new_cat}"'
        if pattern in content:
            content = content.replace(pattern, replacement)
            print(f"✅ {filepath}: '{old_cat}' → '{new_cat}'")
            files_fixed.append(filepath)
    
    # Write back if changed
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print(f"\n✅ Fixed {len(set(files_fixed))} file(s)")
print("\nNew category keys to add to localization:")
for new_cat in set(category_mapping.values()):
    key = 'category.' + new_cat.lower()
    print(f"  '{key}': '{new_cat}',")
