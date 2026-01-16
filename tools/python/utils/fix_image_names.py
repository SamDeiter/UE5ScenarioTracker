import os
import re

# Script to standardize image naming: stepX.jpg -> step-X.jpg
assets_dir = 'assets/generated'

renamed_count = 0
for scenario_dir in os.listdir(assets_dir):
    scenario_path = os.path.join(assets_dir, scenario_dir)
    if not os.path.isdir(scenario_path):
        continue
    
    for filename in os.listdir(scenario_path):
        # Match patterns like step1.jpg, step10.jpg (without hyphen)
        match = re.match(r'^step(\d+)\.(jpg|png)$', filename)
        if match:
            step_num = match.group(1)
            ext = match.group(2)
            new_name = f'step-{step_num}.{ext}'
            old_path = os.path.join(scenario_path, filename)
            new_path = os.path.join(scenario_path, new_name)
            
            if not os.path.exists(new_path):
                os.rename(old_path, new_path)
                print(f'Renamed: {scenario_dir}/{filename} -> {new_name}')
                renamed_count += 1
            else:
                print(f'Skipped (already exists): {new_name}')

print(f'\n=== SUMMARY ===')
print(f'Total files renamed: {renamed_count}')
