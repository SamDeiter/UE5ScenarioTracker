"""
Scenario Validation Script v2
Accurately validates scenario files against expected schema.

Required structure:
- meta: { title, category, estimateHours }
- setup: [] (array)
- fault: {} (object)
- fix: [] (array)
- steps: { stepId: { title, prompt, choices: [{ text, type, next }] } }
- start: "step-1" (or similar)
"""

import re
import os
from pathlib import Path

def parse_scenario_file(filepath):
    """Parse a JavaScript scenario file to extract scenario data."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all scenario definitions
    scenario_pattern = r"window\.SCENARIOS\['([^']+)'\]\s*=\s*\{"
    scenarios = {}
    
    for match in re.finditer(scenario_pattern, content):
        scenario_id = match.group(1)
        start_pos = match.end() - 1  # Position of opening brace
        
        # Find the matching closing brace
        brace_count = 1
        pos = start_pos + 1
        while pos < len(content) and brace_count > 0:
            if content[pos] == '{':
                brace_count += 1
            elif content[pos] == '}':
                brace_count -= 1
            pos += 1
        
        scenario_text = content[start_pos:pos]
        scenarios[scenario_id] = {
            'raw': scenario_text,
            'issues': []
        }
    
    return scenarios


def check_scenario_structure(scenario_id, scenario_text):
    """Check if a scenario has the required structure."""
    issues = []
    
    # Check for meta (with both quote styles)
    if not re.search(r'["\']meta["\']:\s*\{', scenario_text):
        issues.append("Missing 'meta' object")
    else:
        if not re.search(r'["\']title["\']\s*:', scenario_text):
            issues.append("meta missing 'title'")
        if not re.search(r'["\']category["\']\s*:', scenario_text):
            issues.append("meta missing 'category'")
        if not re.search(r'["\']estimateHours["\']\s*:', scenario_text):
            issues.append("meta missing 'estimateHours'")
    
    # Check for setup array
    if not re.search(r'["\']setup["\']\s*:\s*\[', scenario_text):
        issues.append("Missing 'setup' array")
    
    # Check for fault object
    if not re.search(r'["\']fault["\']\s*:\s*\{', scenario_text):
        issues.append("Missing 'fault' object")
    
    # Check for fix array
    if not re.search(r'["\']fix["\']\s*:\s*\[', scenario_text):
        issues.append("Missing 'fix' array")
    
    # Check for start
    if not re.search(r'["\']start["\']\s*:\s*["\']', scenario_text):
        issues.append("Missing 'start' property")
    
    # Check for steps
    if not re.search(r'["\']steps["\']\s*:\s*\{', scenario_text):
        issues.append("Missing 'steps' object")
    
    # Check for conclusion step
    if not re.search(r'["\']conclusion["\']\s*:\s*\{', scenario_text):
        issues.append("Missing 'conclusion' step")
    
    # Check for null next values
    null_nexts = len(re.findall(r'["\']next["\']\s*:\s*null', scenario_text))
    if null_nexts > 0:
        issues.append(f"{null_nexts} choices with 'next: null'")
    
    # Check choice structure
    choice_blocks = re.findall(r'\{\s*["\']text["\']\s*:', scenario_text)
    if len(choice_blocks) == 0:
        issues.append("No valid choice blocks found")
    
    return issues


def main():
    scenarios_dir = Path('scenarios')
    
    print("=" * 70)
    print("SCENARIO STRUCTURE VALIDATION v2")
    print("=" * 70)
    
    all_issues = {}
    total_scenarios = 0
    scenarios_with_issues = 0
    
    for filepath in sorted(scenarios_dir.glob('**/*.js')):
        scenarios = parse_scenario_file(filepath)
        
        for scenario_id, data in scenarios.items():
            total_scenarios += 1
            issues = check_scenario_structure(scenario_id, data['raw'])
            
            if issues:
                scenarios_with_issues += 1
                all_issues[f"{filepath.name}:{scenario_id}"] = issues
    
    if not all_issues:
        print(f"\n✓ All {total_scenarios} scenarios have valid structure!")
        return
    
    # Group by issue type
    issue_counts = {}
    for scenario, issues in all_issues.items():
        for issue in issues:
            issue_counts[issue] = issue_counts.get(issue, 0) + 1
    
    print(f"\nTotal Scenarios: {total_scenarios}")
    print(f"With Issues: {scenarios_with_issues}")
    print(f"\n--- Issue Summary ---")
    for issue, count in sorted(issue_counts.items(), key=lambda x: -x[1]):
        print(f"  {count:3d}x  {issue}")
    
    print(f"\n--- Scenarios with Issues ({len(all_issues)}) ---")
    for scenario, issues in sorted(all_issues.items()):
        print(f"\n{scenario}:")
        for issue in issues:
            print(f"  - {issue}")


if __name__ == '__main__':
    main()
