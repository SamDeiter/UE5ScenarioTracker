import re

# Check lumen_gi.js
print("="*80)
print("LUMEN_GI.JS ANALYSIS")
print("="*80)

with open('scenarios/lumen_gi.js', 'r', encoding='utf-8') as f:
    content = f.read()

action_labels = re.findall(r"text:\s*['\"]Action:\s*\[([^\]]+)\]['\"]", content)
print(f"\nAction labels found: {len(action_labels)}")
for label in action_labels[:10]:
    print(f"  - {label}")

# Count choices per step
for step_match in re.finditer(r"'(step-[^']+)':\s*{.*?choices:\s*\[(.*?)\]", content, re.DOTALL):
    step_id = step_match.group(1)
    choices_block = step_match.group(2)
    choice_count = len(re.findall(r'\{[^}]*text:', choices_block))
    if choice_count < 4:
        print(f"\n{step_id}: {choice_count} choices (needs {4-choice_count} more)")

print("\n" + "="*80)
print("BLUEPRINTSLOGIC_ADVANCED.JS ANALYSIS")
print("="*80)

with open('scenarios/blueprintslogic_advanced.js', 'r', encoding='utf-8') as f:
    content = f.read()

action_labels = re.findall(r"text:\s*['\"]Action:\s*\[([^\]]+)\]['\"]", content)
print(f"\nAction labels found: {len(action_labels)}")
for label in action_labels[:10]:
    print(f"  - {label}")

# Count choices per step
for step_match in re.finditer(r"'(step-[^']+)':\s*{.*?choices:\s*\[(.*?)\]", content, re.DOTALL):
    step_id = step_match.group(1)
    choices_block = step_match.group(2)
    choice_count = len(re.findall(r'\{[^}]*text:', choices_block))
    if choice_count < 4:
        print(f"\n{step_id}: {choice_count} choices (needs {4-choice_count} more)")
