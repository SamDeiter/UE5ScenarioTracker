"""
Audit script to find scenario steps with fewer than 4 choices.
"""
import re
from pathlib import Path
from collections import defaultdict

def count_choices_in_step(step_text):
    """Count number of choice blocks in a step."""
    # Count occurrences of choice objects
    choice_pattern = r'\{\s*["\']?text["\']?\s*:'
    matches = re.findall(choice_pattern, step_text)
    return len(matches)

def analyze_scenario_file(filepath):
    """Analyze a scenario file for choice counts."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    results = []
    
    # Find all step definitions
    step_pattern = r'["\']?(step-[^"\']+|conclusion)["\']?\s*:\s*\{'
    
    for match in re.finditer(step_pattern, content):
        step_id = match.group(1)
        start_pos = match.end() - 1
        
        # Find matching brace
        brace_count = 1
        pos = start_pos + 1
        while pos < len(content) and brace_count > 0:
            if content[pos] == '{':
                brace_count += 1
            elif content[pos] == '}':
                brace_count -= 1
            pos += 1
        
        step_text = content[start_pos:pos]
        choice_count = count_choices_in_step(step_text)
        
        # Skip conclusion steps (they only need 1 "Complete" button)
        if step_id == 'conclusion':
            continue
            
        results.append({
            'step_id': step_id,
            'choice_count': choice_count
        })
    
    return results


def main():
    scenarios_dir = Path('scenarios')
    
    print("=" * 70)
    print("SCENARIO 4-CHOICE AUDIT")
    print("=" * 70)
    
    issues = defaultdict(list)
    total_steps = 0
    steps_with_issues = 0
    
    for filepath in sorted(scenarios_dir.glob('**/*.js')):
        results = analyze_scenario_file(filepath)
        
        for step in results:
            total_steps += 1
            if step['choice_count'] < 4 and step['choice_count'] > 0:
                steps_with_issues += 1
                issues[filepath.name].append({
                    'step': step['step_id'],
                    'count': step['choice_count'],
                    'needed': 4 - step['choice_count']
                })
    
    if not issues:
        print(f"\n✓ All {total_steps} steps have 4+ choices!")
        return
    
    # Summary by file
    print(f"\nTotal Steps: {total_steps}")
    print(f"Steps with < 4 choices: {steps_with_issues}")
    
    # Group by choice count
    by_count = defaultdict(int)
    for file_issues in issues.values():
        for issue in file_issues:
            by_count[issue['count']] += 1
    
    print("\n--- By Choice Count ---")
    for count in sorted(by_count.keys()):
        print(f"  {count} choices: {by_count[count]} steps")
    
    print(f"\n--- Files with Issues ({len(issues)}) ---")
    for filename in sorted(issues.keys()):
        file_issues = issues[filename]
        print(f"\n{filename}: ({len(file_issues)} steps)")
        for issue in file_issues:
            print(f"  - {issue['step']}: {issue['count']} choices (need +{issue['needed']})")


if __name__ == '__main__':
    main()
