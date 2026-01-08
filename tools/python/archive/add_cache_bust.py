import re

# Read the HTML file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add cache-busting parameter to all scenario script tags
# Find all scenario script tags and add ?v=timestamp
import time
version = int(time.time())

# Replace scenario script tags to add version parameter
content = re.sub(
    r'<script src="(scenarios/[^"]+\.js)"',
    f'<script src="\\1?v={version}"',
    content
)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Added cache-busting parameter v={version} to all scenario scripts")
