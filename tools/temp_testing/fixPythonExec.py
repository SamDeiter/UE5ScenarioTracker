#!/usr/bin/env python
"""
Fix the Python execution command in generateScenarioAssets.js to use Python 3 syntax
"""

# Read the file
with open('tools/generateScenarioAssets.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the execfile line (Python 2) with exec(open()) (Python 3)
old_line = "const pythonCmd = `execfile('${pythonScript.replace(/\\\\/g, '\\\\\\\\')}')`;"
new_line = """const pythonCmd = `exec(open(r'${pythonScript.replace(/\\\\/g, '/')}').read())`; // Python 3 syntax"""

if old_line in content:
    content = content.replace(old_line, new_line)
    print("✓ Fixed Python execution command (execfile → exec/open)")
 else:
    print("⚠ execfile line not found, trying alternative fix...")
    # Alternative: look for the pattern and replace
    import re
    content = re.sub(
        r"const pythonCmd = `execfile\('.*?'\)`;",
        new_line,
        content
    )

# Write back
with open('tools/generateScenarioAssets.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Python script invocation fixed for Python 3")
