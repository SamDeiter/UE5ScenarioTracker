import sys

# Read the WindowsPrintScreen file
with open(r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\experimental\WindowsPrintScreen.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the window title
content = content.replace(
    'def capture_window(self, output_path, window_title="Unreal Editor"):',
    'def capture_window(self, output_path, window_title="UEScenarioFactory - Unreal Editor"):'
)

# Write back
with open(r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\experimental\WindowsPrintScreen.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated WindowsPrintScreen.py window title to: UEScenarioFactory - Unreal Editor")
