import ctypes
from ctypes import wintypes

print("Available in wintypes:")
attrs = [attr for attr in dir(wintypes) if not attr.startswith('_')]
for attr in sorted(attrs):
    print(f"  - {attr}")

# Check if BITMAP exists
if hasattr(wintypes, 'BITMAP'):
    print("\n✓ BITMAP is available")
else:
    print("\n✗ BITMAP is NOT available - needs manual definition")
