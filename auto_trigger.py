"""
Auto-trigger script for Antigravity IDE (Hardened Version)
Waits until the specified time, then sends a message to continue image generation.
Includes monitor wake, sleep prevention, retries, and logging.
"""

import time
from datetime import datetime
import pyautogui
import pygetwindow as gw
import ctypes
import sys

# Windows API constants for preventing sleep
ES_CONTINUOUS = 0x80000000
ES_SYSTEM_REQUIRED = 0x00000001
ES_DISPLAY_REQUIRED = 0x00000002

# Configuration
TARGET_TIME = "19:54"  # 7:54 PM - Quota reset time
MESSAGE = "Continue generating scenario images. Run check_images.py to see remaining, then generate images for incomplete scenarios. Copy them to assets/generated, optimize to JPG, and commit."
MAX_RETRIES = 3
LOG_FILE = "auto_trigger.log"

def log(msg):
    """Log to console and file"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    line = f"[{timestamp}] {msg}"
    print(line)
    with open(LOG_FILE, 'a') as f:
        f.write(line + '\n')

def prevent_sleep():
    """Prevent Windows from sleeping while script runs"""
    ctypes.windll.kernel32.SetThreadExecutionState(
        ES_CONTINUOUS | ES_SYSTEM_REQUIRED | ES_DISPLAY_REQUIRED
    )
    log("[System] Sleep prevention enabled")

def allow_sleep():
    """Re-enable normal sleep behavior"""
    ctypes.windll.kernel32.SetThreadExecutionState(ES_CONTINUOUS)
    log("[System] Sleep prevention disabled")

def wake_monitor():
    """Wake the monitor by moving the mouse"""
    try:
        x, y = pyautogui.position()
        pyautogui.moveTo(x + 10, y + 10)
        time.sleep(0.2)
        pyautogui.moveTo(x, y)
        # Also press a harmless key to ensure wake
        pyautogui.press('shift')
        time.sleep(1)
        log("[System] Monitor wake signal sent")
    except Exception as e:
        log(f"[Warning] Wake monitor failed: {e}")

def wait_until(target_time_str):
    """Wait until the target time (HH:MM format)"""
    while True:
        now = datetime.now()
        target = datetime.strptime(target_time_str, "%H:%M").replace(
            year=now.year, month=now.month, day=now.day
        )
        
        if now >= target:
            log("Target time reached!")
            return
        
        remaining = (target - now).total_seconds()
        log(f"Waiting... {int(remaining // 60)}m {int(remaining % 60)}s remaining")
        time.sleep(30)  # Check every 30 seconds

def find_ide_window():
    """Find the Antigravity IDE window using multiple search patterns"""
    search_patterns = ['Gemini', 'Antigravity', 'UE5ScenarioTracker', 'Code']
    
    all_windows = gw.getAllWindows()
    
    for pattern in search_patterns:
        for win in all_windows:
            if pattern.lower() in win.title.lower() and win.title.strip():
                log(f"Found window matching '{pattern}': {win.title[:50]}...")
                return win
    
    # Log all windows for debugging
    log("Available windows:")
    for win in all_windows[:20]:  # First 20
        if win.title.strip():
            log(f"  - {win.title[:60]}")
    
    return None

def focus_window_with_retry(max_attempts=3):
    """Try to focus the IDE window with retries"""
    for attempt in range(max_attempts):
        log(f"Focus attempt {attempt + 1}/{max_attempts}")
        
        win = find_ide_window()
        if win:
            try:
                # Try to activate the window
                if win.isMinimized:
                    win.restore()
                    time.sleep(0.5)
                
                win.activate()
                time.sleep(0.5)
                
                # Verify it's in focus
                if win.isActive:
                    log(f"Successfully focused: {win.title[:40]}...")
                    return True
                else:
                    log("Window not active after activate() call, clicking on it...")
                    # Try clicking on the window
                    pyautogui.click(win.left + 100, win.top + 100)
                    time.sleep(0.3)
                    return True
                    
            except Exception as e:
                log(f"Focus error: {e}")
        else:
            log("IDE window not found")
        
        time.sleep(1)
    
    return False

def send_message_with_retry(message, max_attempts=3):
    """Send the message with retries"""
    for attempt in range(max_attempts):
        log(f"Send attempt {attempt + 1}/{max_attempts}")
        
        try:
            time.sleep(0.5)
            
            # Click to ensure focus on input field (use Tab to move to input if needed)
            pyautogui.hotkey('ctrl', 'shift', 'i')  # Common shortcut for input focus
            time.sleep(0.3)
            
            # Type the message
            pyautogui.typewrite(message, interval=0.02)
            time.sleep(0.3)
            
            # Press Enter to send
            pyautogui.press('enter')
            
            log(f"Message sent successfully!")
            return True
            
        except Exception as e:
            log(f"Send error: {e}")
            time.sleep(1)
    
    return False

def main():
    log("=" * 60)
    log("Antigravity Auto-Trigger Script (Hardened)")
    log("=" * 60)
    log(f"Target time: {TARGET_TIME}")
    log(f"Max retries: {MAX_RETRIES}")
    log(f"Log file: {LOG_FILE}")
    log("")
    log("IMPORTANT: Keep the Antigravity IDE window open!")
    log("Sleep prevention is ENABLED - your PC won't sleep.")
    log("=" * 60)
    
    # Prevent system sleep while waiting
    prevent_sleep()
    
    try:
        # Wait for target time
        wait_until(TARGET_TIME)
        
        # Wake the monitor first
        wake_monitor()
        time.sleep(2)
        
        # Focus the IDE window with retries
        if focus_window_with_retry(MAX_RETRIES):
            time.sleep(1)
            
            # Send the message with retries
            if send_message_with_retry(MESSAGE, MAX_RETRIES):
                log("\n✅ SUCCESS! Message sent to Antigravity.")
            else:
                log("\n❌ FAILED to send message after all retries.")
                log("Please send the message manually: " + MESSAGE)
        else:
            log("\n❌ FAILED to focus IDE window after all retries.")
            log("Please send the message manually: " + MESSAGE)
            
    except KeyboardInterrupt:
        log("\nScript interrupted by user.")
    except Exception as e:
        log(f"\nUnexpected error: {e}")
    finally:
        # Re-enable sleep
        allow_sleep()
        log("Script finished.")

if __name__ == "__main__":
    main()
