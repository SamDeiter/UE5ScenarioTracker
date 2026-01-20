import os
import re
import glob

js_files = glob.glob('scenarios/*.js')

# Find all unique skill values
skills = {}

for filepath in js_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all skill: values
    skill_matches = re.findall(r"skill:\s*'([^']+)'", content)
    
    for skill in skill_matches:
        if skill not in skills:
            skills[skill] = []
        skills[skill].append(os.path.basename(filepath))

print("Current Skill Tags Used:\n")
for skill, files in sorted(skills.items()):
    print(f"{skill}: {len(files)} scenarios")
    if skill == 'general' or len(files) < 3:
        print(f"  Files: {', '.join(files[:5])}")
    print()
