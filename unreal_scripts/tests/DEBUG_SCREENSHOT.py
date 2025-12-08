"""
DEBUG SCRIPT - Diagnose screenshot issues
Paste this into Unreal's Python Console
"""

import sys
import os
import ctypes

script_dir = r"c:\Users\sam.deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts"
if script_dir not in sys.path:
    sys.path.insert(0, script_dir)

import unreal

print("=" * 70)
print("SCREENSHOT DEBUG")
print("=" * 70)

# Test 1: Check if we can find Unreal window
print("\n[Test 1] Finding Unreal Editor window...")
user32 = ctypes.windll.user32

# Try different variations of window title
titles_to_try = [
    "Unreal Editor",
    "UnrealEditor",
]

# Get all windows and check titles
def enum_windows_callback(hwnd, results):
    if user32.IsWindowVisible(hwnd):
        length = user32.GetWindowTextLengthW(hwnd)
        if length > 0:
            buff = ctypes.create_unicode_buffer(length + 1)
            user32.GetWindowTextW(hwnd, buff, length + 1)
            results.append((hwnd, buff.value))
    return True

# Collect all window titles
EnumWindowsProc = ctypes.WINFUNCTYPE(ctypes.c_bool, ctypes.c_void_p, ctypes.py_object)
callback = EnumWindowsProc(enum_windows_callback)
windows = []
user32.EnumWindows(callback, windows)

print(f"Found {len(windows)} visible windows")
print("\nUnreal-related windows:")
for hwnd, title in windows:
    if "unreal" in title.lower():
        print(f"  - {title} (hwnd: {hwnd})")

# Test 2: Try capturing with detected title
print("\n[Test 2] Attempting screenshot capture...")
from WindowsPrintScreen import WindowsPrintScreen

capturer = WindowsPrintScreen()
test_output = os.path.join(unreal.Paths.project_content_dir(), "Test", "debug_test.bmp")
os.makedirs(os.path.dirname(test_output), exist_ok=True)

# Try each title variation
for title in titles_to_try:
    print(f"\nTrying window title: '{title}'")
    result = capturer.capture_window(test_output, window_title=title)
    print(f"  Result: {result}")
    if result:
        print(f"  ✓ SUCCESS! Screenshot saved to: {test_output}")
        break
else:
    print("\n✗ FAILED - Could not capture with any title variation")
    print("\nPlease check:")
    print("1. Is Unreal Editor the active window?")
    print("2. What is the exact window title shown above?")

print("\n" + "=" * 70)
