"""
Scenario Expansion Helper Script

Provides utilities for expanding scenarios:
- Analyze existing scenario structure
- Generate step templates
- Perform file edits using Python
"""

import os
import re
from pathlib import Path

def read_scenario(file_path):
    """Read a scenario file and return its content."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def write_scenario(file_path, content):
    """Write content to a scenario file."""
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def analyze_scenario(file_path):
    """Analyze a scenario file and print its structure."""
    content = read_scenario(file_path)
    
    # Extract scenario ID
    scenario_id_match = re.search(r"window\.SCENARIOS\['([^']+)'\]", content)
    scenario_id = scenario_id_match.group(1) if scenario_id_match else "Unknown"
    
    # Extract title
    title_match = re.search(r'title:\s*["\']([^"\']+)["\']', content)
    title = title_match.group(1) if title_match else "Unknown"
    
    # Extract start step
    start_match = re.search(r'start:\s*["\']([^"\']+)["\']', content)
    start_step = start_match.group(1) if start_match else "Unknown"
    
    # Extract all step IDs
    step_pattern = r"'([^']+)':\s*\{"
    steps = re.findall(step_pattern, content)
    
    # Count choices in each step
    step_details = {}
    for step_id in steps:
        # Find choices in this step
        step_block_pattern = rf"'{step_id}':\s*\{{([^}}]*(?:\{{[^}}]*\}}[^}}]*)*)\}}"
        step_match = re.search(step_block_pattern, content, re.DOTALL)
        
        if step_match:
            step_content = step_match.group(1)
            choice_count = step_content.count('text:')
            next_refs = re.findall(r"next:\s*['\"]([^'\"]+)['\"]", step_content)
            step_details[step_id] = {
                'choices': choice_count,
                'next': next_refs
            }
    
    # Print analysis
    print(f"\n{'='*80}")
    print(f"SCENARIO ANALYSIS: {os.path.basename(file_path)}")
    print(f"{'='*80}\n")
    print(f"ID: {scenario_id}")
    print(f"Title: {title}")
    print(f"Start: {start_step}")
    print(f"Total Steps: {len(steps)}")
    print(f"\nStep Details:")
    print(f"{'-'*80}")
    
    for step_id, details in step_details.items():
        print(f"  {step_id}:")
        print(f"    Choices: {details['choices']}")
        print(f"    Next: {', '.join(details['next'])}")
    
    print(f"\n{'='*80}\n")
    
    return {
        'id': scenario_id,
        'title': title,
        'start': start_step,
        'steps': step_details
    }

def generate_step_template(step_id, step_number, skill='audio'):
    """Generate a template for a new step."""
    template = f"""        '{step_id}': {{
            skill: '{skill}',
            title: 'Step {step_number}: [Title Here]',
            prompt: "<p>[Situation description]</p><strong>[Question?]</strong>",
            choices: [
                {{
                    text: 'Action: [Correct approach]',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> [Explanation]</p>",
                    next: 'step-{step_number + 1}'
                }},
                {{
                    text: 'Action: [Partial approach]',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> [Explanation]</p>",
                    next: 'step-{step_number + 1}'
                }},
                {{
                    text: 'Action: [Misguided approach]',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> [Explanation]</p>",
                    next: 'step-{step_id}M'
                }},
                {{
                    text: 'Action: [Wrong approach]',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> [Explanation]</p>",
                    next: 'step-{step_id}W'
                }}
            ]
        }}"""
    return template

def generate_dead_end_template(step_id, return_step, skill='audio'):
    """Generate a template for a dead-end step."""
    template = f"""        '{step_id}': {{
            skill: '{skill}',
            title: '[Dead-End Title]',
            prompt: "<p>[Consequence of wrong choice]</p><strong>[Recovery question?]</strong>",
            choices: [
                {{
                    text: 'Action: [Correct recovery approach]',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> [Back on track explanation]</p>",
                    next: '{return_step}'
                }}
            ]
        }}"""
    return template

def print_expansion_guide(current_steps, target_steps=10):
    """Print a guide for expanding a scenario."""
    steps_needed = target_steps - current_steps
    
    print(f"\n{'='*80}")
    print(f"EXPANSION GUIDE")
    print(f"{'='*80}\n")
    print(f"Current steps: {current_steps}")
    print(f"Target steps: {target_steps}")
    print(f"Steps to add: {steps_needed}")
    print(f"\nRecommended structure:")
    print(f"  - Main path steps: {target_steps}")
    print(f"  - Dead-end steps: 3-5 (for wrong/misguided choices)")
    print(f"  - Total new steps to create: {steps_needed + 4}")
    print(f"\nSuggested debugging journey:")
    print(f"  1. Initial Discovery/Symptom")
    print(f"  2. First Investigation")
    print(f"  3. Understanding the System")
    print(f"  4. Locating the Problem")
    print(f"  5. First Attempted Fix (may be dead-end)")
    print(f"  6. Proper Fix")
    print(f"  7. Testing the Fix")
    print(f"  8. Edge Cases/Related Issues")
    print(f"  9. Optimization/Cleanup")
    print(f"  10. Final Validation")
    print(f"\n{'='*80}\n")

def main():
    """Main function for interactive use."""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python scenario_helper.py <scenario_file>")
        print("Example: python scenario_helper.py ../../scenarios/assetmanagement_beginner.js")
        return
    
    file_path = sys.argv[1]
    
    if not os.path.exists(file_path):
        print(f"Error: File not found: {file_path}")
        return
    
    # Analyze the scenario
    analysis = analyze_scenario(file_path)
    
    # Print expansion guide
    print_expansion_guide(len(analysis['steps']))
    
    # Generate example templates
    print("Example Step Template:")
    print(generate_step_template('step-2', 2, 'audio'))
    print("\nExample Dead-End Template:")
    print(generate_dead_end_template('step-2W', 'step-3', 'audio'))

if __name__ == '__main__':
    main()
