"""
Fix category names to be single words without slashes
"""

import glob
import re

# Mapping of incorrect categories to correct ones
category_fixes = {
    'UI/Systems': 'UI',
    'Blueprints/Logic': 'Blueprints',
    'Asset Management': 'Assets',
    'Physics/Collisions': 'Physics',
    'World Partition': 'World',
    'Post Process': 'PostProcess',
    'Post-Process': 'PostProcess'
}

files = glob.glob('scenarios/*.js')
fixed_count = 0

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Fix each category
    for old_cat, new_cat in category_fixes.items():
        if f'category: "{old_cat}"' in content:
            content = content.replace(f'category: "{old_cat}"', f'category: "{new_cat}"')
            print(f"✅ Fixed {filepath}: '{old_cat}' → '{new_cat}'")
            fixed_count += 1
    
    # Write back if changed
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print(f"\n✅ Fixed {fixed_count} category names")
print("\nNote: You'll need to add these new categories to localization.js:")
for new_cat in set(category_fixes.values()):
    key = 'category.' + new_cat.lower()
    print(f"  '{key}': '{new_cat}',")
