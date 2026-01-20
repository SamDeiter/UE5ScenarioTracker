import sys

# Read the file
with open(r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\tests\pilot_test_generator.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the window title
content = content.replace(
    'hwnd = user32.FindWindowW(None, "Unreal Editor")',
    'hwnd = user32.FindWindowW(None, "UEScenarioFactory - Unreal Editor")'
)

# Write back
with open(r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\tests\pilot_test_generator.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated window title to: UEScenarioFactory - Unreal Editor")
