#!/usr/bin/env python
"""
Fix the Unreal Engine path in generateScenarioAssets.js
"""

import re

# Read the file
with open('tools/generateScenarioAssets.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the UE_EDITOR_CMD line
old_line = "const UE_EDITOR_CMD = path.join(UE_PROJECT_PATH, '..', '..', 'Engine', 'Binaries', 'Win64', 'UnrealEditor-Cmd.exe');"
new_line = "const UE_EDITOR_CMD = process.env.UE_EDITOR_PATH || 'D:\\\\Fortnite\\\\UE_5.6\\\\Engine\\\\Binaries\\\\Win64\\\\UnrealEditor-Cmd.exe';"

content = content.replace(old_line, new_line)

# Write back
with open('tools/generateScenarioAssets.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Fixed Unreal Engine path")
print("  Now using: D:\\Fortnite\\UE_5.6\\Engine\\Binaries\\Win64\\UnrealEditor-Cmd.exe")
