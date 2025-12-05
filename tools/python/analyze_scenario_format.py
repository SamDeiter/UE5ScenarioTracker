import os
import re
import glob

js_files = glob.glob('scenarios/*.js')

scenarios_to_fix = []

for filepath in js_files:
    filename = os.path.basename(filepath)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all choice text with "Action:" labels
    action_labels = re.findall(r"text:\s*['\"]Action:\s*\[([^\]]+)\]['\"]", content)
    
    # Count steps and their choice counts
    steps = re.findall(r"'(step-[^']+)':\s*{[^}]*choices:\s*\[", content)
    
    step_choice_counts = {}
    for step_match in re.finditer(r"'(step-[^']+)':\s*{.*?choices:\s*\[(.*?)\]", content, re.DOTALL):
        step_id = step_match.group(1)
        choices_block = step_match.group(2)
        # Count number of choice objects
        choice_count = len(re.findall(r'\{[^}]*text:', choices_block))
        step_choice_counts[step_id] = choice_count
    
    steps_with_few_choices = {k: v for k, v in step_choice_counts.items() if v < 4}
    
    if action_labels or steps_with_few_choices:
        scenarios_to_fix.append({
            'file': filename,
            'action_labels': len(action_labels),
            'steps_with_few_choices': len(steps_with_few_choices),
            'total_steps': len(step_choice_counts),
            'details': steps_with_few_choices
        })

print("=" * 80)
print("SCENARIOS NEEDING REFACTORING")
print("=" * 80)
print()

for scenario in sorted(scenarios_to_fix, key=lambda x: x['action_labels'], reverse=True):
    print(f"📄 {scenario['file']}")
    print(f"   - Action labels to remove: {scenario['action_labels']}")
    print(f"   - Steps with <4 choices: {scenario['steps_with_few_choices']} / {scenario['total_steps']}")
    if scenario['details']:
        print(f"   - Details: {scenario['details']}")
    print()

print(f"\n{'='*80}")
print(f"Total scenarios needing work: {len(scenarios_to_fix)}")
print(f"{'='*80}")
