"""
Scenario Style Audit Script
Checks all scenarios for formatting consistency and outputs compliance report.
"""

import os
import re
import json
from pathlib import Path


def extract_scenarios_from_js(content):
    """Extract scenario data from JS file content."""
    # Find the scenario object assignment
    match = re.search(r'window\.SCENARIOS\[[\'"]([^\'"]+)[\'"]\]\s*=\s*(\{[\s\S]*\});?\s*$', content, re.MULTILINE)
    if not match:
        return None, None
    
    scenario_id = match.group(1)
    # Can't safely parse JS as JSON, so we'll use regex to extract choices
    return scenario_id, content


def check_choice_formatting(choice_text):
    """Check if a choice has proper formatting."""
    issues = []
    
    # Check for code tags (commands, settings)
    command_patterns = [r'\bstat\s+\w+', r'\br\.\w+', r'\.ini\b', r'console\s+command']
    has_command_pattern = any(re.search(p, choice_text, re.IGNORECASE) for p in command_patterns)
    has_code_tag = '<code>' in choice_text
    
    if has_command_pattern and not has_code_tag:
        issues.append('MISSING_CODE_TAG')
    
    # Check for strong tags (UI elements)
    ui_patterns = [r'\bDetails\s+Panel', r'\bProject\s+Settings', r'\bWorld\s+Settings', 
                   r'\bMaterial\s+Editor', r'\bBlueprint\s+Editor', r"Light's\b"]
    has_ui_pattern = any(re.search(p, choice_text, re.IGNORECASE) for p in ui_patterns)
    has_strong_tag = '<strong>' in choice_text
    
    if has_ui_pattern and not has_strong_tag:
        issues.append('MISSING_STRONG_TAG')
    
    # Check word count (too vague if under 5 words)
    # Strip HTML tags for word count
    plain_text = re.sub(r'<[^>]+>', '', choice_text)
    word_count = len(plain_text.split())
    
    if word_count < 5:
        issues.append(f'TOO_SHORT ({word_count} words)')
    
    # Check for giveaway words
    giveaway_words = ['properly', 'correctly', 'correct approach', 'best practice', 'recommended']
    for gw in giveaway_words:
        if gw.lower() in choice_text.lower():
            issues.append(f'GIVEAWAY_WORD: {gw}')
    
    return issues, word_count, has_code_tag, has_strong_tag


def audit_scenario_file(filepath):
    """Audit a single scenario file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    scenario_id, _ = extract_scenarios_from_js(content)
    if not scenario_id:
        return None
    
    # Extract all choice texts
    choice_pattern = r'"text"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"'
    choices = re.findall(choice_pattern, content)
    
    # Decode escape sequences
    choices = [c.encode().decode('unicode_escape') for c in choices]
    
    results = {
        'id': scenario_id,
        'file': str(filepath),
        'total_choices': len(choices),
        'issues': [],
        'has_code_tags': 0,
        'has_strong_tags': 0,
        'avg_word_count': 0,
        'min_word_count': 999,
        'max_word_count': 0,
    }
    
    word_counts = []
    
    for i, choice in enumerate(choices):
        issues, wc, has_code, has_strong = check_choice_formatting(choice)
        word_counts.append(wc)
        
        if has_code:
            results['has_code_tags'] += 1
        if has_strong:
            results['has_strong_tags'] += 1
        
        for issue in issues:
            results['issues'].append(f'Choice {i}: {issue}')
    
    if word_counts:
        results['avg_word_count'] = sum(word_counts) / len(word_counts)
        results['min_word_count'] = min(word_counts)
        results['max_word_count'] = max(word_counts)
    
    return results


def calculate_score(results):
    """Calculate a compliance score 0-100."""
    if results['total_choices'] == 0:
        return 0
    
    score = 100
    
    # Deduct for issues
    issue_penalty = len(results['issues']) * 5
    score -= min(issue_penalty, 50)
    
    # Bonus for formatting usage
    code_ratio = results['has_code_tags'] / results['total_choices']
    strong_ratio = results['has_strong_tags'] / results['total_choices']
    
    if code_ratio < 0.2:
        score -= 20
    if strong_ratio < 0.2:
        score -= 20
    
    # Bonus for good word counts
    if results['avg_word_count'] >= 8:
        score += 10
    
    return max(0, min(100, score))


def main():
    scenarios_dir = Path(__file__).parent.parent.parent / 'scenarios'
    
    all_results = []
    
    # Skip template files
    skip_patterns = ['_TEMPLATE', '00_', 'generator']
    
    for js_file in scenarios_dir.rglob('*.js'):
        if any(skip in js_file.name for skip in skip_patterns):
            continue
        
        result = audit_scenario_file(js_file)
        if result:
            result['score'] = calculate_score(result)
            all_results.append(result)
    
    # Sort by score
    all_results.sort(key=lambda x: x['score'])
    
    # Output report
    print("=" * 80)
    print("SCENARIO STYLE AUDIT REPORT")
    print("=" * 80)
    print()
    
    # Summary
    total = len(all_results)
    good = len([r for r in all_results if r['score'] >= 70])
    medium = len([r for r in all_results if 40 <= r['score'] < 70])
    poor = len([r for r in all_results if r['score'] < 40])
    
    print(f"Total scenarios: {total}")
    print(f"  ✓ Good (70+):     {good}")
    print(f"  ~ Medium (40-69): {medium}")
    print(f"  ✗ Poor (<40):     {poor}")
    print()
    
    # Detailed list
    print("-" * 80)
    print("POOR QUALITY (Recommend DROP):")
    print("-" * 80)
    for r in all_results:
        if r['score'] < 40:
            print(f"  [{r['score']:3d}] {r['id']}")
            print(f"         File: {Path(r['file']).name}")
            print(f"         Issues: {len(r['issues'])}, Code tags: {r['has_code_tags']}/{r['total_choices']}")
    
    print()
    print("-" * 80)
    print("MEDIUM QUALITY (Needs fixes):")
    print("-" * 80)
    for r in all_results:
        if 40 <= r['score'] < 70:
            print(f"  [{r['score']:3d}] {r['id']}")
    
    print()
    print("-" * 80)
    print("GOOD QUALITY (Keep):")
    print("-" * 80)
    for r in all_results:
        if r['score'] >= 70:
            print(f"  [{r['score']:3d}] {r['id']}")
    
    # Output list of files to drop
    drop_files = [r['file'] for r in all_results if r['score'] < 40]
    print()
    print("=" * 80)
    print(f"FILES TO DROP ({len(drop_files)}):")
    print("=" * 80)
    for f in drop_files:
        print(f"  {f}")


if __name__ == '__main__':
    main()
