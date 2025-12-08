#!/usr/bin/env python
"""
Properly clean manifest - comment out all scenarios EXCEPT directional_light
"""

with open('scenarios/00_manifest.js', 'r', encoding='utf-8') as f:
    content = f.read()

#Replace the entire MANIFEST array content
# Find the start and end of the array
import re

# Pattern to find the MANIFEST array
pattern = r'(const MANIFEST = \[)([\s\S]*?)(\];)'

def replace_manifest(match):
    start = match.group(1)
    end = match.group(3)
    # New manifest with only directional_light
    new_content = "\n    'directional_light',\n"
    return start + new_content + end

content = re.sub(pattern, replace_manifest, content)

with open('scenarios/00_manifest.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Manifest updated - now shows ONLY directional_light")
