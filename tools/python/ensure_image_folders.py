"""
Ensure Image Folders Script
Creates image folders for all remaining scenarios.
"""

import os
import re
from pathlib import Path


def main():
    scenarios_dir = Path('scenarios')
    assets_dir = Path('assets/generated')
    
    skip_patterns = ['_TEMPLATE', '00_', 'generator']
    
    for js_file in scenarios_dir.rglob('*.js'):
        if any(skip in js_file.name for skip in skip_patterns):
            continue
        
        with open(js_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract scenario ID
        match = re.search(r"window\.SCENARIOS\[[\'\"]([^\'\"]+)[\'\"]\]", content)
        if not match:
            continue
        
        scenario_id = match.group(1)
        image_dir = assets_dir / scenario_id
        
        if not image_dir.exists():
            image_dir.mkdir(parents=True)
            print(f'Created: {image_dir}')
        else:
            file_count = len(list(image_dir.glob('*.png')))
            print(f'Exists:  {image_dir} ({file_count} images)')


if __name__ == '__main__':
    main()
