"""
Scenario Cleanup Script
Deletes poor-quality scenarios and their associated images.
"""

import os
import re
import shutil
from pathlib import Path


def extract_scenario_id(content):
    """Extract scenario ID from JS content."""
    match = re.search(r"window\.SCENARIOS\[[\'\"]([^\'\"]+)[\'\"]\]", content)
    return match.group(1) if match else None


def check_choice_formatting(choice_text):
    """Check if a choice has proper formatting."""
    issues = []
    
    # Check for code tags
    command_patterns = [r'\bstat\s+\w+', r'\br\.\w+', r'\.ini\b']
    has_command = any(re.search(p, choice_text, re.IGNORECASE) for p in command_patterns)
    has_code_tag = '<code>' in choice_text
    
    if has_command and not has_code_tag:
        issues.append('MISSING_CODE_TAG')
    
    # Check word count
    plain_text = re.sub(r'<[^>]+>', '', choice_text)
    if len(plain_text.split()) < 5:
        issues.append('TOO_SHORT')
    
    return issues, has_code_tag, '<strong>' in choice_text


def calculate_score(filepath):
    """Calculate quality score for a scenario file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    scenario_id = extract_scenario_id(content)
    if not scenario_id:
        return None, 0
    
    # Extract choices
    choice_pattern = r'"text"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"'
    choices = re.findall(choice_pattern, content)
    
    if not choices:
        return scenario_id, 0
    
    issues_count = 0
    code_tags = 0
    strong_tags = 0
    
    for c in choices:
        try:
            decoded = c.encode().decode('unicode_escape')
        except:
            decoded = c
        iss, has_code, has_strong = check_choice_formatting(decoded)
        issues_count += len(iss)
        if has_code:
            code_tags += 1
        if has_strong:
            strong_tags += 1
    
    # Calculate score
    score = 100
    score -= min(issues_count * 5, 50)
    
    total = len(choices)
    if code_tags / total < 0.2:
        score -= 20
    if strong_tags / total < 0.2:
        score -= 20
    
    return scenario_id, max(0, score)


def main():
    scenarios_dir = Path('scenarios')
    assets_dir = Path('assets/generated')
    
    skip_patterns = ['_TEMPLATE', '00_', 'generator']
    
    poor_scenarios = []
    keep_scenarios = []
    
    # Audit all scenarios
    for js_file in scenarios_dir.rglob('*.js'):
        if any(skip in js_file.name for skip in skip_patterns):
            continue
        
        scenario_id, score = calculate_score(js_file)
        if scenario_id:
            if score < 40:
                poor_scenarios.append((js_file, scenario_id, score))
            else:
                keep_scenarios.append((js_file, scenario_id, score))
    
    print("=" * 60)
    print("SCENARIOS TO DELETE:")
    print("=" * 60)
    
    deleted_files = []
    deleted_image_dirs = []
    
    for js_file, scenario_id, score in poor_scenarios:
        print(f"  [{score:3d}] {scenario_id}")
        
        # Delete JS file
        js_file.unlink()
        deleted_files.append(str(js_file))
        
        # Delete associated image folder
        image_dir = assets_dir / scenario_id
        if image_dir.exists():
            shutil.rmtree(image_dir)
            deleted_image_dirs.append(str(image_dir))
    
    print()
    print("=" * 60)
    print("SCENARIOS KEPT:")
    print("=" * 60)
    for js_file, scenario_id, score in keep_scenarios:
        print(f"  [{score:3d}] {scenario_id}")
    
    print()
    print("=" * 60)
    print("SUMMARY:")
    print("=" * 60)
    print(f"  Deleted {len(deleted_files)} scenario files")
    print(f"  Deleted {len(deleted_image_dirs)} image directories")
    print(f"  Kept {len(keep_scenarios)} scenarios")
    
    # Output files for index.html update
    print()
    print("Remaining scenario files to keep in index.html:")
    for js_file, _, _ in keep_scenarios:
        rel_path = str(js_file).replace('\\', '/')
        print(f'    <script src="{rel_path}" defer></script>')


if __name__ == '__main__':
    main()
