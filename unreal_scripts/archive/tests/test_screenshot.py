"""
Quick Screenshot Test

Tests the WindowsPrintScreen capture functionality.

Usage in Unreal:
    exec(open('c:/Users/Sam Deiter/Documents/GitHub/UE5ScenarioTracker/unreal_scripts/tests/test_screenshot.py').read())
"""

import unreal
import sys
import os

# Add paths
SCRIPT_DIR = 'c:/Users/Sam Deiter/Documents/GitHub/UE5ScenarioTracker/unreal_scripts'
sys.path.insert(0, os.path.join(SCRIPT_DIR, 'core'))
sys.path.insert(0, os.path.join(SCRIPT_DIR, 'experimental'))

# Force reload
import importlib
import WindowsPrintScreen
importlib.reload(WindowsPrintScreen)
from WindowsPrintScreen import capture_editor_window

# Output path
OUTPUT_DIR = 'c:/Users/Sam Deiter/Documents/GitHub/UE5ScenarioTracker/Content/Scenarios/test_screenshots'
os.makedirs(OUTPUT_DIR, exist_ok=True)

def test_screenshot():
    """Take a single test screenshot"""
    unreal.log("=" * 60)
    unreal.log("SCREENSHOT TEST")
    unreal.log("=" * 60)
    
    # Invalidate viewports first - use subsystem to avoid deprecation warning
    try:
        subsystem = unreal.get_editor_subsystem(unreal.LevelEditorSubsystem)
        if subsystem:
            subsystem.editor_invalidate_viewports()
        else:
            unreal.EditorLevelLibrary.editor_invalidate_viewports()
    except:
        unreal.EditorLevelLibrary.editor_invalidate_viewports()
    
    # Take screenshot
    output_path = os.path.join(OUTPUT_DIR, 'test_capture.png')
    
    unreal.log(f"Capturing to: {output_path}")
    
    success = capture_editor_window(output_path)
    
    if success:
        unreal.log(f"✓ Screenshot captured successfully!")
        unreal.log(f"  File: {output_path}")
        
        # Check file exists and size
        if os.path.exists(output_path):
            size = os.path.getsize(output_path)
            unreal.log(f"  Size: {size / 1024:.1f} KB")
        else:
            unreal.log_warning("  File not found after capture!")
    else:
        unreal.log_error("✗ Screenshot capture FAILED")
    
    unreal.log("=" * 60)
    return success

# Run
test_screenshot()
