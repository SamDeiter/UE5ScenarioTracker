import sys

# Read the file
with open(r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\experimental\WindowsPrintScreen.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add manual structure definitions at the top, after imports
structures_code = '''
# Manual structure definitions for stripped-down ctypes in Unreal
class BITMAPINFOHEADER(ctypes.Structure):
    _fields_ = [
        ('biSize', ctypes.c_uint32),
        ('biWidth', ctypes.c_int32),
        ('biHeight', ctypes.c_int32),
        ('biPlanes', ctypes.c_uint16),
        ('biBitCount', ctypes.c_uint16),
        ('biCompression', ctypes.c_uint32),
        ('biSizeImage', ctypes.c_uint32),
        ('biXPelsPerMeter', ctypes.c_int32),
        ('biYPelsPerMeter', ctypes.c_int32),
        ('biClrUsed', ctypes.c_uint32),
        ('biClrImportant', ctypes.c_uint32),
    ]

'''

# Find where to insert (after "from ctypes import wintypes")
insert_pos = content.find('from ctypes import wintypes') + len('from ctypes import wintypes')
# Find the next newline
insert_pos = content.find('\n', insert_pos) + 1

# Insert the structures
new_content = content[:insert_pos] + '\n' + structures_code + content[insert_pos:]

# Replace all references to wintypes.BITMAPINFOHEADER with just BITMAPINFOHEADER
new_content = new_content.replace('wintypes.BITMAPINFOHEADER', 'BITMAPINFOHEADER')

# Write back
with open(r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\experimental\WindowsPrintScreen.py', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Added manual BITMAPINFOHEADER definition")
print("Replaced wintypes references with direct structure")
