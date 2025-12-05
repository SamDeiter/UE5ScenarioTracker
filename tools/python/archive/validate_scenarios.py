"""
Scenario Structure Validation Script

Validates all scenario files to ensure they meet quality standards:
- All scenarios have 10+ steps
- All 'next' references point to valid steps
- No orphaned steps (unreachable from start)
- All steps have 3-4 choices
- All choices have feedback text
- All choice types are valid
"""

import os
import re
import json
from pathlib import Path

# Valid choice types
VALID_CHOICE_TYPES = {'correct', 'partial', 'wrong', 'misguided'}

def extract_scenario_data(file_path):
    """Extract scenario data from a JavaScript file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract scenario ID
    scenario_id_match = re.search(r"window\.SCENARIOS\['([^']+)'\]", content)
    if not scenario_id_match:
        return None
    
    scenario_id = scenario_id_match.group(1)
    
    # Extract start step
    start_match = re.search(r'start:\s*["\']([^"\']+)["\']', content)
    start_step = start_match.group(1) if start_match else None
    
    # Extract all step IDs
    step_pattern = r"'([^']+)':\s*\{"
    steps = re.findall(step_pattern, content)
    
    # Extract step details
    step_data = {}
    for step_id in steps:
        # Find the step block
        step_block_pattern = rf"'{step_id}':\s*\{{([^}}]*(?:\{{[^}}]*\}}[^}}]*)*)\}}"
        step_match = re.search(step_block_pattern, content, re.DOTALL)
        
        if step_match:
            step_content = step_match.group(1)
            
            # Count choices
            choice_count = step_content.count('text:')
            
            # Extract next references
            next_refs = re.findall(r"next:\s*['\"]([^'\"]+)['\"]", step_content)
            
            # Extract choice types
            choice_types = re.findall(r"type:\s*['\"]([^'\"]+)['\"]", step_content)
            
            # Check for feedback
            has_feedback = 'feedback:' in step_content
            
            step_data[step_id] = {
                'choice_count': choice_count,
                'next_refs': next_refs,
                'choice_types': choice_types,
                'has_feedback': has_feedback
            }
    
    return {
        'id': scenario_id,
        'file': os.path.basename(file_path),
        'start': start_step,
        'steps': step_data
    }

def validate_scenario(scenario_data):
    """Validate a single scenario and return list of issues."""
    issues = []
    
    if not scenario_data:
        return ['Failed to parse scenario file']
    
    steps = scenario_data['steps']
    start = scenario_data['start']
    
    # Check step count
    step_count = len(steps)
    if step_count < 10:
        issues.append(f"Only {step_count} steps (need 10+)")
    
    # Check start step exists
    if start and start not in steps:
        issues.append(f"Start step '{start}' not found in steps")
    
    # Check for orphaned steps
    reachable = set()
    if start:
        to_visit = [start]
        while to_visit:
            current = to_visit.pop()
            if current in reachable or current not in steps:
                continue
            reachable.add(current)
            for next_ref in steps[current]['next_refs']:
                if next_ref != 'conclusion':
                    to_visit.append(next_ref)
    
    orphaned = set(steps.keys()) - reachable
    if orphaned:
        issues.append(f"Orphaned steps: {', '.join(sorted(orphaned))}")
    
    # Check each step
    for step_id, step_info in steps.items():
        # Check choice count
        if step_info['choice_count'] < 3 or step_info['choice_count'] > 4:
            issues.append(f"Step '{step_id}' has {step_info['choice_count']} choices (should be 3-4)")
        
        # Check next references
        for next_ref in step_info['next_refs']:
            if next_ref != 'conclusion' and next_ref not in steps:
                issues.append(f"Step '{step_id}' references non-existent step '{next_ref}'")
        
        # Check choice types
        for choice_type in step_info['choice_types']:
            if choice_type not in VALID_CHOICE_TYPES:
                issues.append(f"Step '{step_id}' has invalid choice type '{choice_type}'")
        
        # Check feedback
        if not step_info['has_feedback']:
            issues.append(f"Step '{step_id}' missing feedback")
    
    return issues

def main():
    """Main validation function."""
    # Find scenarios directory
    script_dir = Path(__file__).parent
    scenarios_dir = script_dir.parent.parent / 'scenarios'
    
    if not scenarios_dir.exists():
        print(f"❌ Scenarios directory not found: {scenarios_dir}")
        return
    
    # Get all scenario files
    scenario_files = sorted(scenarios_dir.glob('*.js'))
    scenario_files = [f for f in scenario_files if f.name not in ['00_manifest.js']]
    
    print(f"\n{'='*80}")
    print(f"SCENARIO VALIDATION REPORT")
    print(f"{'='*80}\n")
    print(f"Validating {len(scenario_files)} scenarios...\n")
    
    # Track statistics
    total_scenarios = 0
    scenarios_with_10_plus = 0
    scenarios_with_issues = 0
    all_issues = []
    
    # Validate each scenario
    for scenario_file in scenario_files:
        total_scenarios += 1
        scenario_data = extract_scenario_data(scenario_file)
        
        if not scenario_data:
            print(f"❌ {scenario_file.name}: Failed to parse")
            scenarios_with_issues += 1
            continue
        
        issues = validate_scenario(scenario_data)
        step_count = len(scenario_data['steps'])
        
        if step_count >= 10:
            scenarios_with_10_plus += 1
        
        if issues:
            scenarios_with_issues += 1
            print(f"⚠️  {scenario_file.name} ({step_count} steps):")
            for issue in issues:
                print(f"    - {issue}")
                all_issues.append(f"{scenario_file.name}: {issue}")
            print()
        else:
            print(f"✓ {scenario_file.name} ({step_count} steps)")
    
    # Print summary
    print(f"\n{'='*80}")
    print(f"SUMMARY")
    print(f"{'='*80}\n")
    print(f"Total scenarios: {total_scenarios}")
    print(f"Scenarios with 10+ steps: {scenarios_with_10_plus} ({scenarios_with_10_plus/total_scenarios*100:.1f}%)")
    print(f"Scenarios with issues: {scenarios_with_issues} ({scenarios_with_issues/total_scenarios*100:.1f}%)")
    print(f"Total issues found: {len(all_issues)}")
    
    if scenarios_with_issues == 0:
        print(f"\n✅ All scenarios passed validation!")
    else:
        print(f"\n⚠️  {scenarios_with_issues} scenarios need attention")
    
    print()

if __name__ == '__main__':
    main()
