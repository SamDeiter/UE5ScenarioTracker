import re

files_to_check = [
    'scenarios/assetmanagement_beginner.js',
    'scenarios/lumen_gi.js',
    'scenarios/blueprintslogic_advanced.js'
]

for filepath in files_to_check:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    steps = re.findall(r"'step-[^']+'\s*:\s*\{", content)
    step_names = [s.split("'")[1] for s in steps]
    
    print(f"\n{filepath}:")
    print(f"  Total steps: {len(steps)}")
    print(f"  Step names: {', '.join(step_names[:10])}")
    if len(step_names) > 10:
        print(f"  ... and {len(step_names) - 10} more")
