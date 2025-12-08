#!/usr/bin/env python
"""
Add directional_light to the manifest
"""

with open('scenarios/00_manifest.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the MANIFEST array and add directional_light at the top
new_lines = []
added = False

for line in lines:
    if 'const MANIFEST = [' in line and not added:
        new_lines.append(line)
        new_lines.append("    'directional_light',\n")
        added = True
        print("✓ Added 'directional_light' to manifest")
    else:
        new_lines.append(line)

with open('scenarios/00_manifest.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("✓ Manifest updated - directional_light is now visible in app")
