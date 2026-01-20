import os
import re

scenarios_dir = 'scenarios'
results = []

for category in ['game_dev', 'look_dev', 'vfx', 'worldbuilding', 'tech_art']:
    cat_path = os.path.join(scenarios_dir, category)
    if not os.path.isdir(cat_path):
        continue
    for filename in sorted(os.listdir(cat_path)):
        if not filename.endswith('.js'):
            continue
        filepath = os.path.join(cat_path, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Count step-N patterns
        steps = re.findall(r'["\']step-(\d+)["\']:', content)
        step_count = len(set(steps))
        
        # Check for conclusion
        has_conclusion = 'conclusion:' in content or '"conclusion":' in content
        if has_conclusion:
            step_count += 1
        
        results.append((category, filename.replace('.js',''), step_count))

print(f"{'Category':<15} {'Scenario':<45} {'Steps':>5}")
print('-' * 70)
for cat, name, steps in results:
    status = 'OK' if steps >= 10 else 'LOW'
    print(f"{cat:<15} {name:<45} {steps:>5} {status}")
print('-' * 70)
print(f"Total scenarios: {len(results)}")
