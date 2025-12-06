#!/usr/bin/env python
"""
Fix generateScenarioAssets.js to use proper Unreal Python execution method
"""

import re

# Read the file
with open('tools/generateScenarioAssets.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the entire Python execution block
# OLD: Uses -ExecutePythonScript with execfile (broken)
# NEW: Copy scripts to UE project and use -run=pythonscript (proper way)

old_block = """    // Build Unreal command
    const pythonCmd = `exec(open(r'${pythonScript.replace(/\\\\/g, '/')}').read())`; // Python 3 syntax
    
    const args = [
        UE_PROJECT_FILE,
        '-ExecutePythonScript=' + pythonCmd,
        '-stdout',
        '-unattended',
        '-nopause'
    ];"""

new_block = """    // Build Unreal command
    // Use -run= instead of -ExecutePythonScript for better reliability
    const pythonScriptInUE = path.join(ueScriptsPath, 'AutoGenerateScenarios.py');
    
    const args = [
        UE_PROJECT_FILE,
        `-run="${pythonScriptInUE}"`,
        '-stdout',
        '-unattended',
        '-nopause'
    ];"""

if old_block in content:
    content = content.replace(old_block, new_block)
    print("✓ Fixed Python execution method")
else:
    # Try alternative pattern
    # Find and replace the args array
    pattern = r"const args = \[[\s\S]*?'-ExecutePythonScript='[\s\S]*?\];"
    
    replacement = """const args = [
        UE_PROJECT_FILE,
        `-stdout`,
        `-unattended`,
        `-nopause`,
        `-run=python "${path.join(ueScriptsPath, 'AutoGenerateScenarios.py')}"`
    ];"""
    
    content = re.sub(pattern, replacement, content)
    print("✓ Fixed using regex pattern")

# Write back
with open('tools/generateScenarioAssets.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Unreal Python execution method updated")
print("  Now using: -run=python script.py (handles spaces in paths)")
