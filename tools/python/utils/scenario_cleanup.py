"""
Scenario Deduplication Script
Identifies and removes duplicate step definitions from scenario files.

Run with: python scenario_cleanup.py
"""

import re
import os
from pathlib import Path

def analyze_scenario_file(filepath):
    """Analyze a scenario file for duplicate step keys."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all step key definitions (e.g., 'step-1': {)
    step_pattern = r"'(step-[^']+)':\s*\{"
    matches = re.findall(step_pattern, content)
    
    # Count occurrences
    step_counts = {}
    for step in matches:
        step_counts[step] = step_counts.get(step, 0) + 1
    
    # Find duplicates
    duplicates = {k: v for k, v in step_counts.items() if v > 1}
    
    return {
        'total_steps': len(matches),
        'unique_steps': len(step_counts),
        'duplicates': duplicates
    }


def deduplicate_scenario_file(filepath, dry_run=True):
    """
    Remove duplicate step definitions from a scenario file.
    Keeps only the FIRST occurrence of each step key.
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    content = ''.join(lines)
    
    # Find all step blocks with their positions
    step_pattern = r"(\s+'step-[^']+':)\s*\{"
    
    seen_steps = set()
    duplicates_found = []
    
    # Parse the file to find step blocks and their ranges
    blocks_to_remove = []
    
    # Use a state machine approach to find step blocks
    i = 0
    while i < len(lines):
        line = lines[i]
        # Check if this line starts a step definition
        match = re.match(r"(\s+)'(step-[^']+)':\s*\{\s*$", line)
        if match:
            indent = match.group(1)
            step_key = match.group(2)
            
            if step_key in seen_steps:
                # Find the end of this block
                block_start = i
                brace_count = 1
                j = i + 1
                
                while j < len(lines) and brace_count > 0:
                    brace_count += lines[j].count('{')
                    brace_count -= lines[j].count('}')
                    j += 1
                
                block_end = j
                blocks_to_remove.append((block_start, block_end, step_key))
                duplicates_found.append(step_key)
            else:
                seen_steps.add(step_key)
        i += 1
    
    if not blocks_to_remove:
        print(f"  No duplicates found in {filepath}")
        return 0
    
    print(f"  Found {len(blocks_to_remove)} duplicate blocks to remove")
    
    if dry_run:
        print("  [DRY RUN] Would remove these duplicates:")
        for start, end, key in blocks_to_remove[:10]:
            print(f"    - {key} (lines {start+1}-{end})")
        if len(blocks_to_remove) > 10:
            print(f"    ... and {len(blocks_to_remove) - 10} more")
        return len(blocks_to_remove)
    
    # Actually remove the blocks (in reverse order to preserve line numbers)
    blocks_to_remove.reverse()
    for start, end, key in blocks_to_remove:
        del lines[start:end]
    
    # Write the cleaned file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print(f"  Removed {len(blocks_to_remove)} duplicate blocks")
    return len(blocks_to_remove)


def main():
    scenarios_dir = Path('scenarios')
    
    print("=" * 60)
    print("SCENARIO DEDUPLICATION ANALYSIS")
    print("=" * 60)
    
    # Find all scenario files
    scenario_files = list(scenarios_dir.glob('**/*.js'))
    
    files_with_issues = []
    
    for filepath in sorted(scenario_files):
        analysis = analyze_scenario_file(filepath)
        
        if analysis['duplicates']:
            print(f"\n{filepath}")
            print(f"  Total steps: {analysis['total_steps']}")
            print(f"  Unique steps: {analysis['unique_steps']}")
            print(f"  Duplicates: {len(analysis['duplicates'])} keys duplicated")
            
            # Show top duplicates
            sorted_dups = sorted(analysis['duplicates'].items(), key=lambda x: -x[1])
            for key, count in sorted_dups[:5]:
                print(f"    - {key}: {count}x")
            
            files_with_issues.append(filepath)
    
    if not files_with_issues:
        print("\nNo duplicate steps found in any scenario files!")
        return
    
    print("\n" + "=" * 60)
    print(f"FOUND {len(files_with_issues)} FILES WITH DUPLICATES")
    print("=" * 60)
    
    # Ask for confirmation
    response = input("\nRun deduplication? (yes/no/dry-run): ").strip().lower()
    
    if response == 'dry-run':
        print("\n--- DRY RUN ---")
        for filepath in files_with_issues:
            print(f"\nProcessing: {filepath}")
            deduplicate_scenario_file(filepath, dry_run=True)
    elif response == 'yes':
        print("\n--- RUNNING DEDUPLICATION ---")
        total_removed = 0
        for filepath in files_with_issues:
            print(f"\nProcessing: {filepath}")
            removed = deduplicate_scenario_file(filepath, dry_run=False)
            total_removed += removed
        print(f"\n✓ Removed {total_removed} duplicate blocks total")
    else:
        print("Aborted.")


if __name__ == '__main__':
    main()
