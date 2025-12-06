#!/usr/bin/env python
"""
Final fix for generateScenarioAssets.js - use proper UE5 Python import method
"""

import re

# Read the file
with open('tools/generateScenarioAssets.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the args block with proper Python execution
# We'll use import instead of execfile since scripts are copied to Content/Python

old_pattern = r"const args = \[[\s\S]*?\];(?=\s*console\.log)"

new_args = """const args = [
        UE_PROJECT_FILE,
        '-ExecutePythonScript=import sys; sys.path.append(r\\'D:/UE5_Projects/UEScenarioFactory/Content/Python\\'); import AutoGenerateScenarios; AutoGenerateScenarios.generate_scenario_assets(r\\'C:/Users/SAMDEI~1/AppData/Local/Temp/directional_light_spec.json\\', r\\'D:/UE5_Projects/UEScenarioFactory/Content/Scenarios\\')',
        '-stdout',
        '-unattended',
        '-nopause'
    ];"""

content = re.sub(old_pattern, new_args, content)

# Write back
with open('tools/generateScenarioAssets.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Fixed Python execution to use import method")
print("  Using: import AutoGenerateScenarios (avoids path issues)")
