#!/usr/bin/env python
"""
Create Unreal spec file for directional_light scenario using existing scene setup data
"""

import json
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent / 'temp_testing'))

# Import the scene setups from the existing script
from addSceneSetupDirectionalLight import SCENE_SETUPS

def create_unreal_spec(scenario_id, scene_setups, output_path):
    """Create JSON spec file for Unreal automation"""
    
    steps_data = []
    for step_id, scene_setup in scene_setups.items():
        steps_data.append({
            'stepId': step_id,
            'sceneSetup': scene_setup
        })
    
    spec = {
        'scenarioId': scenario_id,
        'steps': steps_data
    }
    
    output_file = Path(output_path) / f'{scenario_id}_spec.json'
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(spec, f, indent=2)
    
    return output_file

if __name__ == '__main__':
    output_dir = Path(__file__).parent.parent
    
    print("=" * 60)
    print("Creating Unreal spec file for directional_light")
    print("=" * 60)
    print()
    
    spec_file = create_unreal_spec('directional_light', SCENE_SETUPS, output_dir)
    
    print(f"✅ Created: {spec_file.name}")
    print(f"   Steps: {len(SCENE_SETUPS)}")
    print(f"   Location: {spec_file}")
    print()
    print("📋 Next steps:")
    print(f"1. Copy {spec_file.name} to D:\\UE5_Projects\\UEScenarioFactory")
    print(f"2. Open UEScenarioFactory.uproject in Unreal Editor")
    print(f"3. Run: Python → Execute Python Script → AutoGenerateScenarios.py")
