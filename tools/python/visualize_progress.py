#!/usr/bin/env python3
"""
Generate a visual report of scenario expansion progress.
"""

import os
from pathlib import Path
import re

SCENARIOS_DIR = Path(__file__).parent.parent.parent / "scenarios"

def count_steps(filepath: Path) -> int:
    """Count steps in a scenario file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    step_matches = re.findall(r'["\']step[-_]\d+["\']\s*:', content)
    return len(step_matches)

def create_bar(count: int, max_count: int = 25, target: int = 10) -> str:
    """Create a visual bar representation."""
    bar_length = 50
    filled = int((count / max_count) * bar_length)
    target_pos = int((target / max_count) * bar_length)
    
    bar = ''
    for i in range(bar_length):
        if i < filled:
            if count >= target:
                bar += '█'  # Green (complete)
            else:
                bar += '▓'  # Yellow (in progress)
        elif i == target_pos:
            bar += '|'  # Target marker
        else:
            bar += '░'  # Empty
    
    return bar

def main():
    """Generate visual report."""
    scenario_files = [
        f for f in SCENARIOS_DIR.glob('*.js')
        if f.name != '00_manifest.js'
    ]
    
    scenarios = []
    for filepath in scenario_files:
        try:
            step_count = count_steps(filepath)
            scenarios.append((filepath.name, step_count))
        except Exception as e:
            print(f"Warning: Failed to analyze {filepath.name}: {e}")
    
    # Sort by step count
    scenarios.sort(key=lambda x: x[1])
    
    print("\n" + "="*100)
    print("SCENARIO EXPANSION PROGRESS VISUALIZATION".center(100))
    print("="*100 + "\n")
    print(f"{'Scenario':<45} {'Steps':<6} {'Progress Bar (Target: 10 steps)'}")
    print("-"*100)
    
    total_steps = 0
    target_met = 0
    
    for name, count in scenarios:
        bar = create_bar(count, max_count=25, target=10)
        status = "✅" if count >= 10 else "⚠️ "
        print(f"{name:<45} {count:<6} {bar} {status}")
        total_steps += count
        if count >= 10:
            target_met += 1
    
    print("-"*100)
    print(f"\nTotal Scenarios: {len(scenarios)}")
    print(f"Scenarios Meeting Target (10+ steps): {target_met}/{len(scenarios)} ({target_met/len(scenarios)*100:.1f}%)")
    print(f"Average Steps: {total_steps/len(scenarios):.1f}")
    print(f"\nLegend: █ = Complete (10+ steps) | ▓ = Needs expansion | ░ = Empty | | = Target (10 steps)")
    print("="*100 + "\n")

if __name__ == '__main__':
    main()
