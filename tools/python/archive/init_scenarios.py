import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add initialization of window.SCENARIOS before loading scenario files
pattern = r'(<!-- SCENARIO_SCRIPTS_START -->)'
replacement = r'''<script>
        // Initialize SCENARIOS object before loading scenario files
        window.SCENARIOS = window.SCENARIOS || {};
    </script>
    \1'''

content = re.sub(pattern, replacement, content, count=1)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Successfully added window.SCENARIOS initialization to index.html")
