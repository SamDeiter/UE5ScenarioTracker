#!/usr/bin/env python
"""
Clean manifest - show ONLY directional_light for testing
"""

with open('scenarios/00_manifest.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
in_manifest = False

for line in lines:
    if 'const MANIFEST = [' in line:
        # Start fresh manifest with only directional_light
        new_lines.append(line)
        new_lines.append("    'directional_light',\n")
        in_manifest = True
        continue
    
    if in_manifest and '];' in line:
        # End of manifest
        new_lines.append(line)
        in_manifest = False
        continue
    
    # Skip all other manifest entries
    if in_manifest:
        continue
    
    # Keep everything else (header comments, etc.)
    new_lines.append(line)

with open('scenarios/00_manifest.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("✓ Manifest cleaned - showing ONLY directional_light")
print("  All other scenarios hidden for testing")
