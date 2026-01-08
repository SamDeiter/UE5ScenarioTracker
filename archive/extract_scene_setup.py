#!/usr/bin/env python
"""
Extract sceneSetup data from directional_light.js and create JSON spec for Unreal automation
"""

import json
import re
from pathlib import Path

def extract_scene_setup_from_js(js_file_path):
    """Extract sceneSetup objects from JavaScript scenario file"""
    
    with open(js_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all step definitions with sceneSetup
    # Pattern matches: 'step-X': { ... sceneSetup: { ... } ... }
    step_pattern = r"'(step-\d+|conclusion)':\s*{[^}]*?sceneSetup:\s*({[\s\S]*?})\s*,"
    
    steps_data = []
    
    for match in re.finditer(step_pattern, content):
        step_id = match.group(1)
        scene_setup_str = match.group(2)
        
        # Convert JavaScript object to JSON
        # Replace Python True/False with JSON true/false
        scene_setup_str = scene_setup_str.replace('True', 'true').replace('False', 'false')
        
        try:
            # Parse the scene setup JSON
            scene_setup = json.loads(scene_setup_str)
            
            steps_data.append({
                'stepId': step_id,
                'sceneSetup': scene_setup
            })
            
            print(f"✓ Extracted {step_id}")
            
        except json.JSONDecodeError as e:
            print(f"✗ Failed to parse {step_id}: {e}")
            continue
    
    return steps_data


def create_unreal_spec(scenario_id, steps_data, output_path):
    """Create JSON spec file for Unreal automation"""
    
    spec = {
        'scenarioId': scenario_id,
        'steps': steps_data
    }
    
    output_file = Path(output_path) / f'{scenario_id}_spec.json'
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(spec, f, indent=2)
    
    print(f"\n✅ Created: {output_file}")
    print(f"   Scenario: {scenario_id}")
    print(f"   Steps: {len(steps_data)}")
    
    return output_file


if __name__ == '__main__':
    # Paths
    project_root = Path(__file__).parent.parent  # Go up from tools/ to project root
    scenario_file = project_root / 'scenarios' / 'directional_light.js'
    output_dir = project_root
    
    print("=" * 60)
    print("Extracting sceneSetup from directional_light.js")
    print("=" * 60)
    print()
    
    # Extract scene setups
    steps = extract_scene_setup_from_js(scenario_file)
    
    if not steps:
        print("\n❌ No scene setups found!")
        exit(1)
    
    # Create Unreal spec
    spec_file = create_unreal_spec('directional_light', steps, output_dir)
    
    print(f"\n📋 Next steps:")
    print(f"1. Copy {spec_file.name} to Unreal project")
    print(f"2. Open D:\\UE5_Projects\\UEScenarioFactory in Unreal Editor")
    print(f"3. Run Python script from Unreal")
