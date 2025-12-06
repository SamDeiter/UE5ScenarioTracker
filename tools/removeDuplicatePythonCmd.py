#!/usr/bin/env python
"""
Fix generateScenarioAssets.js - remove duplicate pythonCmd using Python
"""

# Read the file
with open('tools/generateScenarioAssets.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and remove the old pythonCmd line (line 59)
# It contains: const pythonCmd = `execfile('
new_lines = []
skip_next = False

for i, line in enumerate(lines):
    # Skip the old pythonCmd line and its blank line after
    if "const pythonCmd = `execfile('" in line:
        print(f"Removing line {i+1}: {line.strip()}")
        skip_next = True
        continue
    
    # Also remove the blank line that follows
    if skip_next and line.strip() == '':
        skip_next = False
        continue
    
    new_lines.append(line)

# Write back
with open('tools/generateScenarioAssets.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("\n✓ Fixed duplicate pythonCmd declaration")
print("  Removed old execfile line")
print("  Kept new import method with function call")
