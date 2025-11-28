import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the script loading section and add markers
pattern = r'(\s*<script src="localization\.js"></script>\s*<!-- Load Scenario Data FIRST \(using defer\) -->)'
replacement = r'''\1
    <!-- SCENARIO_SCRIPTS_START -->
    <script src="scenarios/00_manifest.js" defer></script>
    <!-- SCENARIO_SCRIPTS_END -->'''

content = re.sub(pattern, replacement, content, count=1)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully added scenario script markers to index.html")
