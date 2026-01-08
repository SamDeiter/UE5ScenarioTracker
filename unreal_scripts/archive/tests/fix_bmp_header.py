import sys

# Read the file
with open(r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\experimental\WindowsPrintScreen.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the double-escaped null bytes - this is what's corrupting the BMP!
content = content.replace(
    "f.write(b'\\\\x00\\\\x00\\\\x00\\\\x00')",
    "f.write(b'\\x00\\x00\\x00\\x00')"
)

# Write back
with open(r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\experimental\WindowsPrintScreen.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed BMP header - removed double-escaped null bytes")
print("This was preventing the BMP files from being readable!")
