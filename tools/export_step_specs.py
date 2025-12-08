"""
Extract per-step sceneSetup from JavaScript scenario files and export as JSON spec files.

This script parses scenario .js files to extract individual step configurations
and creates JSON files that the Unreal automation can use to generate unique screenshots.

Usage:
    python tools/export_step_specs.py scenarios/directional_light.js
"""

import json
import re
import sys
import os
from pathlib import Path


def parse_js_scenario(js_file_path):
    """
    Parse a JavaScript scenario file and extract step configurations.
    
    Args:
        js_file_path: Path to the .js scenario file
        
    Returns:
        dict: Parsed scenario data including scenario ID and steps
    """
    with open(js_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract scenario ID from window.SCENARIOS['id'] = {...}
    scenario_id_match = re.search(r"window\.SCENARIOS\['(\w+)'\]\s*=", content)
    if not scenario_id_match:
        raise ValueError(f"Could not find scenario ID in {js_file_path}")
    
    scenario_id = scenario_id_match.group(1)
    
    # Find the steps object
    steps_match = re.search(r'steps:\s*{(.*?)}\s*};', content, re.DOTALL)
    if not steps_match:
        raise ValueError(f"Could not find steps object in {js_file_path}")
    
    steps_content = steps_match.group(1)
    
    # Extract individual steps using regex
    # This is a simplified parser - for production you'd use a proper JS parser
    step_pattern = r"'([\w-]+)':\s*{(.*?)(?=(?:'[\w-]+':\s*{|$))"
    step_matches = re.finditer(step_pattern, steps_content, re.DOTALL)
    
    steps = {}
    for match in step_matches:
        step_id = match.group(1)
        step_content = match.group(2)
        
        # Extract sceneSetup
        scene_setup_match = re.search(r'sceneSetup:\s*({.*?}),', step_content, re.DOTALL)
        if not scene_setup_match:
            print(f"Warning: No sceneSetup found for {step_id}, skipping")
            continue
            
        scene_setup_str = scene_setup_match.group(1)
        
        # Convert JavaScript object notation to JSON
        # Replace single quotes with double quotes (simplified)
        scene_setup_str = scene_setup_str.replace("'", '"')
        
        # Extract prompt
        prompt_match = re.search(r'prompt:\s*["\'](.+?)["\'],', step_content, re.DOTALL)
        prompt = prompt_match.group(1) if prompt_match else ""
        
        try:
            scene_setup = json.loads(scene_setup_str)
            steps[step_id] = {
                'stepId': step_id,
                'prompt': prompt,
                'sceneSetup': scene_setup
            }
        except json.JSONDecodeError as e:
            print(f"Warning: Could not parse sceneSetup for {step_id}: {e}")
            continue
    
    return {
        'scenarioId': scenario_id,
        'steps': steps
    }


def export_step_specs(scenario_data, output_dir):
    """
    Export individual step specification JSON files.
    
    Args:
        scenario_data: Parsed scenario data
        output_dir: Directory to write JSON files
    """
    scenario_id = scenario_data['scenarioId']
    steps = scenario_data['steps']
    
    # Create output directory if it doesn't exist
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    print(f"Exporting {len(steps)} steps for scenario '{scenario_id}'...")
    
    for step_id, step_data in steps.items():
        # Create spec file for Unreal automation
        spec = {
            'scenarioId': scenario_id,
            'steps': [step_data]  # Automation expects array of steps
        }
        
        output_file = output_path / f"{step_id}_spec.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(spec, f, indent=2)
        
        print(f"  ✓ {output_file}")
    
    print(f"\nSuccess! Exported {len(steps)} step specifications to {output_dir}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python export_step_specs.py <scenario.js>")
        print("Example: python tools/export_step_specs.py scenarios/directional_light.js")
        sys.exit(1)
    
    js_file = sys.argv[1]
    
    if not os.path.exists(js_file):
        print(f"Error: File not found: {js_file}")
        sys.exit(1)
    
    # Determine output directory (same as scenario file location)
    scenario_dir = os.path.dirname(js_file)
    scenario_name = os.path.basename(js_file).replace('.js', '')
    output_dir = os.path.join(scenario_dir, scenario_name)
    
    try:
        scenario_data = parse_js_scenario(js_file)
        export_step_specs(scenario_data, output_dir)
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
