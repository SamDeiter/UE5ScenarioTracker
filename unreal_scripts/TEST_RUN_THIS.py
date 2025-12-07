"""
QUICK TEST SCRIPT - Paste this into Unreal's Python Console

This uses the working PIL-based screenshot system (2MB PNG files, instant capture)
"""

import sys
import os

# Add the unreal_scripts directory to Python path
script_dir = r"c:\Users\sam.deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts"
if script_dir not in sys.path:
    sys.path.insert(0, script_dir)

# Now import and run the automation
import AutoGenerateScenarios

# Use your spec file
spec_file = r"c:\Users\sam.deiter\Documents\GitHub\UE5ScenarioTracker\directional_light_spec.json"

# Output to UE project (adjust this path if needed)
import unreal
output_path = unreal.Paths.project_content_dir() + "Scenarios"

print("=" * 70)
print("TESTING NEW WINDOWS PRINT SCREEN SCREENSHOT SYSTEM")
print("=" * 70)
print(f"Spec file: {spec_file}")
print(f"Output: {output_path}")
print("=" * 70)

# Run it!
AutoGenerateScenarios.generate_scenario_assets(spec_file, output_path)
