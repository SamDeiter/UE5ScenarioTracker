"""
QUICK TEST - Fallback Screenshot Method

This tests the simple "shot" command approach
"""

import sys
import os

script_dir = r"c:\Users\sam.deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts"
if script_dir not in sys.path:
    sys.path.insert(0, script_dir)

import unreal
from FallbackScreenshot import FallbackScreenshot

print("=" * 70)
print("TESTING FALLBACK SCREENSHOT (Unreal's 'shot' command)")
print("=" * 70)

screenshot = FallbackScreenshot()
output_dir = os.path.join(unreal.Paths.project_content_dir(), "Test")

result = screenshot.capture(output_dir, "fallback_test")

print(f"\nResult: {result}")
print(f"Check if file exists: {os.path.exists(result)}")

print("=" * 70)
