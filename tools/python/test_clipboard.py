from PIL import ImageGrab, Image
import sys

print("Checking clipboard...")
try:
    img = ImageGrab.grabclipboard()
    if img is None:
        print("Clipboard is empty or does not contain an image.")
    elif isinstance(img, Image.Image):
        print(f"Image found! Size: {img.size}")
    elif isinstance(img, list):
        print(f"File list found: {img}")
    else:
        print(f"Unknown clipboard content type: {type(img)}")
except Exception as e:
    print(f"Error: {e}")
