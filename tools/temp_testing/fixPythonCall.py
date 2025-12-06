#!/usr/bin/env python
"""
Fix generateScenarioAssets.js to properly call Python function with arguments
"""

import re

# Read the file
with open('tools/generateScenarioAssets.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the args construction and replace it
# We need to build a proper Python command that imports and calls the function

new_code = """    // Build Python command that properly calls the function with arguments
    const tempSpecPath = path.join(process.env.TEMP || 'D:\\\\temp', `${scenarioId}_spec.json`);
    const unrealOutputPath = path.join(UE_PROJECT_PATH, 'Content', 'Scenarios');
    
    // Escape paths for Python (use raw strings)
    const pythonCmd = `import sys; sys.path.append(r'${ueScriptsPath.replace(/\\\\/g, '\\\\\\\\')}'); import AutoGenerateScenarios; AutoGenerateScenarios.generate_scenario_assets(r'${tempSpecPath.replace(/\\\\/g, '\\\\\\\\')}', r'${unrealOutputPath.replace(/\\\\/g, '\\\\\\\\')}')`;
    
    const args = [
        UE_PROJECT_FILE,
        `-ExecutePythonScript=${pythonCmd}`,
        '-stdout',
        '-unattended',
        '-nopause'
    ];
    
    console.log(`\\nUnreal Editor: ${UE_EDITOR_CMD}`);
    console.log(`Project: ${UE_PROJECT_FILE}`);
    console.log(`Python Command: ${pythonCmd}\\n`);"""

# Find and replace the args construction block
pattern = r"// Build.*?Python Command:.*?\n"
replacement = new_code + "\n    "

if re.search(pattern, content, re.DOTALL):
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
else:
    # Fallback: find just the args array
    pattern2 = r"const args = \[[\s\S]*?\];\s*console\.log"
    if re.search(pattern2, content):
        # Extract just before console.log
        new_args_only = """    const tempSpecPath = path.join(process.env.TEMP || 'D:\\\\temp', `${scenarioId}_spec.json`);
    const unrealOutputPath = path.join(UE_PROJECT_PATH, 'Content', 'Scenarios');
    
    const pythonCmd = `import sys; sys.path.append(r'${ueScriptsPath.replace(/\\\\/g, '\\\\\\\\')}'); import AutoGenerateScenarios; AutoGenerateScenarios.generate_scenario_assets(r'${tempSpecPath.replace(/\\\\/g, '\\\\\\\\')}', r'${unrealOutputPath.replace(/\\\\/g, '\\\\\\\\')}')`;
    
    const args = [
        UE_PROJECT_FILE,
        `-ExecutePythonScript=${pythonCmd}`,
        '-stdout',
        '-unattended',
        '-nopause'
    ];
    
    console.log"""
        
        content = re.sub(pattern2, new_args_only, content)

# Write back
with open('tools/generateScenarioAssets.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Fixed Python function call with proper arguments")
print("  Now calling: AutoGenerateScenarios.generate_scenario_assets(spec_path, output_path)")
