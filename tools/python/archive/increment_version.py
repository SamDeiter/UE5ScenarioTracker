"""Auto-incrementing build number system"""

import json
from pathlib import Path

version_file = Path('../generator_ui/version.json')

# Initialize or load version
if version_file.exists():
    with open(version_file, 'r') as f:
        version_data = json.load(f)
    version_data['build'] += 1
else:
    version_data = {
        'major': 1,
        'minor': 0,
        'build': 1
    }

# Save updated version
with open(version_file, 'w') as f:
    json.dump(version_data, f, indent=2)

version_string = f"v{version_data['major']}.{version_data['minor']}.{version_data['build']}"
print(f"Updated to {version_string}")

# Update index.html with version
with open('../generator_ui/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add version to header if not already there
if 'app-version' not in html:
    html = html.replace(
        '<h1>🎮 UE5 Scenario Generator</h1>',
        f'<h1>🎮 UE5 Scenario Generator <span class="app-version" id="app-version">{version_string}</span></h1>'
    )
else:
    # Update existing version
    import re
    html = re.sub(
        r'<span class="app-version"[^>]*>.*?</span>',
        f'<span class="app-version" id="app-version">{version_string}</span>',
        html
    )

with open('../generator_ui/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Added version {version_string} to UI")
