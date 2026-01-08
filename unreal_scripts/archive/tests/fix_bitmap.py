import sys

# Read the file
with open(r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\experimental\WindowsPrintScreen.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Remove lines 83-84 (the BITMAP lines we don't need)
# Line numbers are 1-indexed in the view, but 0-indexed in the list
# So line 83 is index 82, line 84 is index 83
new_lines = lines[:82] + lines[84:]  # Skip lines 83-84

# Write back
with open(r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\experimental\WindowsPrintScreen.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Removed unnecessary BITMAP lines (83-84)")
print("The width/height parameters are sufficient")
