"""
Test the super simple PIL screenshot
"""

import sys
import os

script_dir = r"c:\Users\sam.deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts"
if script_dir not in sys.path:
    sys.path.insert(0, script_dir)

import unreal
from SuperSimpleScreenshot import SuperSimpleScreenshot

print("=" * 70)
print("TESTING SUPER SIMPLE SCREENSHOT (PIL)")
print("=" * 70)

screenshot = SuperSimpleScreenshot()
output_dir = os.path.join(unreal.Paths.project_content_dir(), "Test")

result = screenshot.capture(output_dir, "pil_test")

print(f"\nResult: {result}")
print(f"File exists: {os.path.exists(result)}")

if os.path.exists(result):
    print(f"File size: {os.path.getsize(result)} bytes")
    print("✓ SUCCESS!")
else:
    print("✗ FAILED!")

print("=" * 70)
