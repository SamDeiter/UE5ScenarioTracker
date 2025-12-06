#!/usr/bin/env python
"""
Completely rewrite the problematic section of generateScenarioAssets.js
"""

# Read the entire file
with open('tools/generateScenarioAssets.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the section that needs to be replaced (around lines 58-64)
# We'll replace from "// Build Unreal command" to just before "const args = ["

new_section = [
    "    // Build Python command that imports module and calls function\n",
    "    const tempSpecPath = specPath;  // Use the exported spec path\n",
    "    const unrealOutputPath = path.join(UE_PROJECT_PATH, 'Content', 'Scenarios');\n",
    "    \n",
    "    // Build Python import command - avoid backslash issues by using forward slashes\n",
    "    const pyPath = ueScriptsPath.replace(/\\\\/g, '/');\n",
    "    const pySpec = tempSpecPath.replace(/\\\\/g, '/');\n",
    "    const pyOut = unrealOutputPath.replace(/\\\\/g, '/');\n",
    "    \n",
    "    const pythonCmd = `import sys; sys.path.append(r'${pyPath}'); import AutoGenerateScenarios; AutoGenerateScenarios.generate_scenario_assets(r'${pySpec}', r'${pyOut}')`;\n",
    "    \n"
]

# Find where to insert
new_lines = []
skip_until_args = False

for i, line in enumerate(lines):
    if "// Build Unreal command" in line or "// Build Python command" in line:
        # Start replacing
        skip_until_args = True
        new_lines.extend(new_section)
        continue
    
    if skip_until_args:
        if "const args = [" in line:
            # Stop skipping, add this line
            skip_until_args = False
            new_lines.append(line)
        # Skip all lines in between
        continue
    
    new_lines.append(line)

# Write back
with open('tools/generateScenarioAssets.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("✓ Rewrote Python command section")
print("  Using forward slashes to avoid regex issues")
print("  Calling: AutoGenerateScenarios.generate_scenario_assets()")
