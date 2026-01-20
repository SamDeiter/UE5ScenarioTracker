"""
Analyze scenario lengths (step counts)
"""
import glob
import re

print(f"{'SCENARIO':<40} | {'STEPS':<10} | {'BRANCHES?'}")
print("-" * 65)

stats = []

for filepath in glob.glob('scenarios/*.js'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Count keys starting with 'step-'
    # We look for lines like 'step-1': {
    steps = re.findall(r"'(step-[^']+)'\s*:", content)
    unique_steps = len(set(steps))
    
    # Check for branches (W/M steps)
    branches = any('W' in s or 'M' in s for s in steps)
    branch_mark = "YES" if branches else "NO"
    
    filename = filepath.split('\\')[-1]
    stats.append((filename, unique_steps, branch_mark))

# Sort by length
stats.sort(key=lambda x: x[1])

for s in stats:
    print(f"{s[0]:<40} | {s[1]:<10} | {s[2]}")
