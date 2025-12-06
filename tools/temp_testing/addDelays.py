#!/usr/bin/env python
"""
Add proper delays to AutoGenerateScenarios.py so Unreal waits for screenshots
"""

import re

with open('unreal_scripts/AutoGenerateScenarios.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add a longer delay after screenshot capture
# Find the section where screenshots are captured and add delays

# Replace the short time.sleep(1.0) with longer delays
content = content.replace('time.sleep(1.0)', 'time.sleep(3.0)')
content = content.replace('time.sleep(0.5)', 'time.sleep(2.0)')

# Add a final delay before exit
if "unreal.log(f'✓ {step_id} complete')" in content:
    content = content.replace(
        "unreal.log(f'✓ {step_id} complete')",
        "unreal.log(f'✓ {step_id} complete')\n    time.sleep(2.0)  # Wait for files to finish saving"
    )

# Add delay at end of generate_scenario_assets function
if 'unreal.log("╚" + "=" * 68 + "╝")' in content:
    content = content.replace(
        'unreal.log("╚" + "=" * 68 + "╝")',
        'unreal.log("╚" + "=" * 68 + "╝")\n    unreal.log("Waiting 5 seconds for all files to finish saving...")\n    time.sleep(5.0)'
    )

with open('unreal_scripts/AutoGenerateScenarios.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Added delays to AutoGenerateScenarios.py")
print("  - 2-3 second delays after each operation")
print("  - 5 second final delay before Unreal exits")
print("  This should give screenshots time to save to disk")
