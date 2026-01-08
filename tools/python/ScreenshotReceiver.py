"""
Screenshot Receiver - Runs OUTSIDE of Unreal
Monitors clipboard for screenshots, saves them with proper names

Usage:
1. Run this script in a terminal: python ScreenshotReceiver.py
2. In UE5, run the scene setup script
3. When prompted, press PrintScreen
4. This app catches it and saves it
"""

import os
import sys
import time
from datetime import datetime

try:
    from PIL import ImageGrab, Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False
    print("PIL not found. Install with: pip install Pillow")

# Configuration
OUTPUT_DIR = r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\assets\generated"
CURRENT_STEP = None
LAST_CLIP = None


def get_clipboard_image():
    """Get image from clipboard if available"""
    if not HAS_PIL:
        return None
    try:
        img = ImageGrab.grabclipboard()
        if isinstance(img, Image.Image):
            return img
    except:
        pass
    return None


def save_screenshot(img, step_name):
    """Save screenshot with proper name"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filename = f"{step_name}.png"
    filepath = os.path.join(OUTPUT_DIR, filename)
    img.save(filepath, "PNG")
    print(f"✓ Saved: {filepath}")
    return filepath


def set_step(step_name):
    """Call this to set the current step name"""
    global CURRENT_STEP
    CURRENT_STEP = step_name
    print(f"\n>>> Ready for: {step_name}")
    print("    Press PrintScreen in UE5 when ready...")


def check_and_save():
    """Check clipboard and save if new image"""
    global LAST_CLIP
    
    img = get_clipboard_image()
    if img is None:
        return False
    
    # Check if this is a new image (compare size as simple check)
    img_id = (img.size, img.mode)
    if img_id == LAST_CLIP:
        return False
    
    LAST_CLIP = img_id
    
    if CURRENT_STEP:
        save_screenshot(img, CURRENT_STEP)
        return True
    else:
        print("Warning: No step name set. Use set_step('step-1') first.")
        return False


def monitor_loop():
    """Continuous monitoring loop"""
    print("=" * 50)
    print("Screenshot Receiver - Monitoring clipboard")
    print("=" * 50)
    print(f"Output: {OUTPUT_DIR}")
    print("")
    print("Commands:")
    print("  set_step('step-1')  - Set current step name")
    print("  Then press PrintScreen in UE5")
    print("")
    
    while True:
        check_and_save()
        time.sleep(0.5)


# Interactive mode
if __name__ == '__main__':
    if not HAS_PIL:
        print("ERROR: Pillow required. Run: pip install Pillow")
        sys.exit(1)
    
    # Simple interactive mode
    print("=" * 50)
    print("Screenshot Receiver")
    print("=" * 50)
    print("")
    print("Steps:")
    steps = ['step-1', 'step-2', 'step-3', 'conclusion']
    
    for step in steps:
        input(f"\nSetup '{step}' in UE5, then press Enter here...")
        set_step(step)
        
        # Wait for clipboard to change
        print("Press PrintScreen in UE5...")
        while not check_and_save():
            time.sleep(0.3)
        
        print(f"✓ {step} captured!")
    
    print("\n" + "=" * 50)
    print("All steps captured!")
    print(f"Files saved to: {OUTPUT_DIR}")
