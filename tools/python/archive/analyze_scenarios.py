#!/usr/bin/env python3
"""
Scenario Analysis Script - Python Version
Analyzes all scenario files and provides detailed reports on step counts,
identifies scenarios needing expansion, and provides statistics.
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Tuple

SCENARIOS_DIR = Path(__file__).parent.parent.parent / "scenarios"

def analyze_scenario_file(filepath: Path) -> Dict:
    """Analyze a single scenario file and extract metadata."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract metadata using regex
    title_match = re.search(r'title:\s*["\']([^"\']+)["\']', content)
    estimate_match = re.search(r'estimateHours?:\s*([\d.]+)', content)
    desc_match = re.search(r'description:\s*["\']([^"\']+)["\']', content)
    
    title = title_match.group(1) if title_match else 'Unknown'
    estimate = float(estimate_match.group(1)) if estimate_match else 0.0
    description = desc_match.group(1) if desc_match else 'No description'
    
    # Count steps (matches 'step-1', 'step_1', etc.)
    step_matches = re.findall(r'["\']step[-_]\d+["\']\s*:', content)
    step_count = len(step_matches)
    
    # Count choices
    choices_matches = re.findall(r'choices:\s*\[', content)
    choices_count = len(choices_matches)
    avg_choices = round(choices_count / step_count, 1) if step_count > 0 else 0
    
    # Extract skills
    skill_matches = re.findall(r'skill:\s*["\']([^"\']+)["\']', content)
    skills = list(set(skill_matches))
    
    return {
        'file': filepath.name,
        'title': title,
        'description': description,
        'step_count': step_count,
        'estimate': estimate,
        'avg_choices': avg_choices,
        'skills': ', '.join(skills) if skills else 'None',
        'status': 'SHORT' if step_count < 10 else 'OK'
    }

def print_separator(char='=', length=120):
    """Print a separator line."""
    print(char * length)

def print_header(text: str):
    """Print a formatted header."""
    print_separator()
    print(text.center(120))
    print_separator()
    print()

def main():
    """Main analysis function."""
    if not SCENARIOS_DIR.exists():
        print(f"Error: Directory '{SCENARIOS_DIR}' not found.")
        return
    
    # Get all .js files except manifest
    scenario_files = [
        f for f in SCENARIOS_DIR.glob('*.js')
        if f.name != '00_manifest.js'
    ]
    
    print_header("DETAILED SCENARIO ANALYSIS REPORT")
    
    # Analyze all scenarios
    scenarios = []
    for filepath in scenario_files:
        try:
            scenario_data = analyze_scenario_file(filepath)
            scenarios.append(scenario_data)
        except Exception as e:
            print(f"Warning: Failed to analyze {filepath.name}: {e}")
    
    # Sort by step count
    scenarios.sort(key=lambda x: x['step_count'])
    
    # Print summary table
    print("SUMMARY TABLE (Sorted by Step Count)")
    print_separator('-')
    print(f"{'FILE':<45} | {'STEPS':<6} | {'EST':<6} | {'AVG CHOICES':<12} | {'STATUS'}")
    print_separator('-')
    
    for scenario in scenarios:
        print(f"{scenario['file']:<45} | {scenario['step_count']:<6} | "
              f"{scenario['estimate']:<6.1f} | {scenario['avg_choices']:<12} | "
              f"{scenario['status']}")
    
    print_separator('-')
    print()
    
    # Identify short scenarios
    short_scenarios = [s for s in scenarios if s['step_count'] < 10]
    
    if short_scenarios:
        print_header("⚠️  SHORT SCENARIOS REQUIRING EXPANSION (< 10 STEPS)")
        
        for idx, scenario in enumerate(short_scenarios, 1):
            print(f"{idx}. {scenario['file']}")
            print(f"   Title: {scenario['title']}")
            desc_preview = scenario['description'][:80]
            if len(scenario['description']) > 80:
                desc_preview += '...'
            print(f"   Description: {desc_preview}")
            print(f"   Current Steps: {scenario['step_count']}")
            print(f"   Estimated Hours: {scenario['estimate']}")
            print(f"   Skills Covered: {scenario['skills']}")
            print(f"   Expansion Needed: {10 - scenario['step_count']} more steps")
            print()
        
        print(f"\nTotal scenarios needing expansion: {len(short_scenarios)}")
        avg_short_steps = sum(s['step_count'] for s in short_scenarios) / len(short_scenarios)
        print(f"Average steps in short scenarios: {avg_short_steps:.1f}")
    else:
        print("\n✅ All scenarios have 10 or more steps.\n")
    
    # Overall statistics
    print_header("OVERALL STATISTICS")
    
    total_scenarios = len(scenarios)
    total_steps = sum(s['step_count'] for s in scenarios)
    total_time = sum(s['estimate'] for s in scenarios)
    avg_steps = total_steps / total_scenarios if total_scenarios > 0 else 0
    avg_time = total_time / total_scenarios if total_scenarios > 0 else 0
    scenarios_ok = total_scenarios - len(short_scenarios)
    percent_ok = (scenarios_ok / total_scenarios * 100) if total_scenarios > 0 else 0
    
    print(f"Total Scenarios: {total_scenarios}")
    print(f"Total Steps: {total_steps}")
    print(f"Total Estimated Hours: {total_time:.1f}")
    print(f"Average Steps per Scenario: {avg_steps:.1f}")
    print(f"Average Hours per Scenario: {avg_time:.1f}")
    print(f"Scenarios Meeting 10+ Step Goal: {scenarios_ok} ({percent_ok:.1f}%)")
    print_separator()
    print()
    
    # Breakdown by step count
    print("BREAKDOWN BY STEP COUNT:")
    print_separator('-')
    step_count_groups = {}
    for scenario in scenarios:
        count = scenario['step_count']
        if count not in step_count_groups:
            step_count_groups[count] = []
        step_count_groups[count].append(scenario['file'])
    
    for count in sorted(step_count_groups.keys()):
        files = step_count_groups[count]
        print(f"{count} step{'s' if count != 1 else ''}: {len(files)} scenario{'s' if len(files) != 1 else ''}")
        for f in files[:5]:  # Show first 5
            print(f"  - {f}")
        if len(files) > 5:
            print(f"  ... and {len(files) - 5} more")
    print()

if __name__ == '__main__':
    main()
