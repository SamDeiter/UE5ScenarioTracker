"""
Quick 10-second test for auto-trigger
"""
import time
import pyautogui
import pygetwindow as gw

print("Starting in 10 seconds... Switch to Antigravity IDE!")
for i in range(10, 0, -1):
    print(f"  {i}...")
    time.sleep(1)

# Find window with Gemini in title (the IDE)
windows = gw.getAllWindows()
for w in windows:
    if 'Gemini' in w.title or 'Antigravity' in w.title:
        print(f"Found window: {w.title}")
        w.activate()
        time.sleep(0.5)
        break

# Type message
message = "This is an automated test message - the script works!"
pyautogui.typewrite(message, interval=0.02)
time.sleep(0.2)
pyautogui.press('enter')
print("Message sent!")
