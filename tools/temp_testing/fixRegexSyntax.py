#!/usr/bin/env python
"""
Fix regex in generateScenarioAssets.js - the replace uses wrong regex syntax
"""

# Read the file
with open('tools/generateScenarioAssets.js', 'r', encoding='utf-8') as f:
    content = f.read()

# The issue is /\/ which is invalid regex
# Should use /\\\\/g to match backslash globally
# Fix the line that has the python command construction

# Replace the broken regex patterns
content = content.replace(
    ".replace(/\\/g, '\\\\\\\\')",
    ".replace(/\\\\/g, '\\\\\\\\')"
)

# Write back
with open('tools/generateScenarioAssets.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Fixed JavaScript regex syntax")
print("  Changed /\\/g to /\\\\/g (proper backslash escaping)")
