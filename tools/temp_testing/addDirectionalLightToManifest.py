#!/usr/bin/env python
"""
Properly add directional_light to manifest without breaking it
"""

with open('scenarios/00_manifest.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Check if directional_light is already there
if "'directional_light'" in content or '"directional_light"' in content:
    print("✓ directional_light already in manifest")
else:
    # Find "const MANIFEST = [" and add it right after
    if "const MANIFEST = [" in content:
        content = content.replace(
            "const MANIFEST = [",
            "const MANIFEST = [\n    'directional_light',"
        )
        
        with open('scenarios/00_manifest.js', 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("✓ Added 'directional_light' to manifest")
    else:
        print("✗ Could not find MANIFEST array in file")

print("Done!")
