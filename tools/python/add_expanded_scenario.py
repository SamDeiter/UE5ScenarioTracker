#!/usr/bin/env python3
"""
Add audio_concurrency_EXPANDED.js to index.html
"""

from pathlib import Path

index_file = Path(__file__).parent.parent.parent / "index.html"

# Read the file
with open(index_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the line with audio_concurrency.js and add the expanded version after it
new_lines = []
for line in lines:
    new_lines.append(line)
    if 'audio_concurrency.js' in line and 'EXPANDED' not in line:
        # Add the expanded version right after
        indent = '    '
        new_lines.append(f'{indent}<script src="scenarios/audio_concurrency_EXPANDED.js" defer></script>\r\n')

# Write back
with open(index_file, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("✅ Added audio_concurrency_EXPANDED.js to index.html")
