#!/usr/bin/env python
"""
Temporarily comment out most scenarios in manifest to make testing easier
Keep only: directional_light, golem, dash, inventory
"""

with open('scenarios/00_manifest.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
keep_scenarios = ['directional_light', 'golem', 'dash', 'inventory']
in_manifest_array = False

for line in lines:
    # Detect we're in the manifest array
    if 'const MANIFEST = [' in line:
        in_manifest_array = True
        new_lines.append(line)
        continue
    
    if in_manifest_array and '];' in line:
        in_manifest_array = False
        new_lines.append(line)
        continue
    
    # If we're in the manifest, comment out lines not in keep list
    if in_manifest_array:
        should_keep = any(scenario in line for scenario in keep_scenarios)
        if should_keep:
            # Make sure it's not commented
            new_lines.append(line.replace('//', '').lstrip())
        else:
            # Comment it out if not already
            if not line.strip().startswith('//'):
                new_lines.append('    // ' + line.lstrip())
            else:
                new_lines.append(line)
    else:
        new_lines.append(line)

with open('scenarios/00_manifest.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("✓ Manifest updated")
print(f"  Showing only: {', '.join(keep_scenarios)}")
print("  (All others commented out for testing)")
