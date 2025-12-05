"""
UE5 Scenario Tracker - HTML/Scenario Sync Script

Syncs the index.html file to only include scenario files that actually exist
in the scenarios/ folder. Removes references to missing files.
"""

import os
import re
import time

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '..', '..'))
INDEX_HTML_PATH = os.path.join(PROJECT_ROOT, 'index.html')
SCENARIOS_DIR = os.path.join(PROJECT_ROOT, 'scenarios')

def get_existing_scenarios():
    """Get list of scenario .js files that exist (excluding manifest and backups)."""
    scenarios = []
    for filename in os.listdir(SCENARIOS_DIR):
        if filename.endswith('.js') and not filename.endswith('.bak') and filename != '00_manifest.js':
            scenarios.append(filename.replace('.js', ''))
    return sorted(scenarios)

def generate_script_tags(scenarios, version_string):
    """Generate script tags for all existing scenarios."""
    tags = []
    # Always include manifest first
    tags.append(f'    <script src="scenarios/00_manifest.js?v={version_string}" defer></script>')
    
    for scenario in scenarios:
        tags.append(f'    <script src="scenarios/{scenario}.js?v={version_string}" defer></script>')
    
    return '\n'.join(tags)

def update_index_html():
    """Update index.html to only include existing scenario files."""
    print("=" * 60)
    print("UE5 Scenario Tracker - HTML/Scenario Sync")
    print("=" * 60)
    
    # Get existing scenarios
    scenarios = get_existing_scenarios()
    print(f"\n✓ Found {len(scenarios)} scenario files in {SCENARIOS_DIR}")
    for s in scenarios:
        print(f"  - {s}.js")
    
    # Read current index.html
    print(f"\nReading: {INDEX_HTML_PATH}")
    with open(INDEX_HTML_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Generate version string (current timestamp)
    version_string = str(int(time.time()))
    
    # Find the scenario script block - looking for pattern between SCENARIOS initialization and game.js
    # Pattern: from 'window.SCENARIOS = window.SCENARIOS || {};' to game.js script
    pattern = r'(<script>window\.SCENARIOS = window\.SCENARIOS \|\| \{\};</script>\s*\n)(.*?)(\s*<!-- Load Game Logic)'
    
    match = re.search(pattern, content, re.DOTALL)
    
    if not match:
        print("❌ Could not find scenario script block in index.html")
        return False
    
    # Generate new script tags
    new_script_tags = generate_script_tags(scenarios, version_string)
    
    # Replace the old script block
    new_content = content[:match.start(2)] + new_script_tags + '\n' + content[match.end(2):]
    
    # Write updated file
    with open(INDEX_HTML_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"\n✅ Updated index.html with {len(scenarios)} scenario references")
    print(f"   Version string: {version_string}")
    return True

def main():
    success = update_index_html()
    if not success:
        exit(1)

if __name__ == "__main__":
    main()
