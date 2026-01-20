import os
import re
import json

scenarios_dir = r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\scenarios'
assets_dir = r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\assets\generated'

missing_images = []
found_count = 0

# Walk through all JS files in scenarios
for root, dirs, files in os.walk(scenarios_dir):
    for file in files:
        if file.endswith('.js') and not file.startswith('00_'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Find all image_path entries
            pattern = r'image_path:\s*["\']([^"\']+)["\']'
            matches = re.findall(pattern, content)
            
            for img_path in matches:
                # Convert relative path to absolute
                full_path = os.path.join(r'c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker', img_path.replace('/', '\\'))
                
                if os.path.exists(full_path):
                    found_count += 1
                else:
                    scenario_name = file.replace('.js', '')
                    missing_images.append({
                        'scenario': scenario_name,
                        'image_path': img_path,
                        'file': filepath
                    })

print(f"\n=== IMAGE AUDIT REPORT ===")
print(f"Total images found: {found_count}")
print(f"Total images missing: {len(missing_images)}")

if missing_images:
    print(f"\n--- Missing Images by Scenario ---")
    # Group by scenario
    by_scenario = {}
    for m in missing_images:
        if m['scenario'] not in by_scenario:
            by_scenario[m['scenario']] = []
        by_scenario[m['scenario']].append(m['image_path'])
    
    for scenario, images in sorted(by_scenario.items()):
        print(f"\n{scenario}: {len(images)} missing")
        for img in images[:5]:  # Show first 5
            print(f"  - {img}")
        if len(images) > 5:
            print(f"  ... and {len(images) - 5} more")
