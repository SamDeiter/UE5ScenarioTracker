#!/usr/bin/env python
"""
Add sceneSetup fields to directional_light scenario

This script adds the sceneSetup configuration to each step in the
directional_light.js scenario file for Unreal automation.
"""

import re
import json

# Scene setup configurations for each step
SCENE_SETUPS = {
    'step-1': {
        "level": "ScenarioCapture_Level",
        "actors": [
            {
                "id": "directional_light",
                "type": "DirectionalLight",
                "transform": {
                    "location": [0, 0, 500],
                    "rotation": [-45, 0, 0],
                    "scale": [1, 1, 1]
                },
                "intensity": 3.0,
                "lightColor": [1.0, 0.95, 0.9],
                "selected": True
            },
            {
                "id": "landscape",
                "type": "Landscape",
                "material": "/Game/ScenarioAssets/Materials/M_Grass_Simple",
                "transform": {
                    "location": [0, 0, 0],
                    "rotation": [0, 0, 0],
                    "scale": [100, 100, 100]
                },
                "terrainSize": [127, 127]
            },
            {
                "id": "sky_sphere",
                "type": "BP_Sky_Sphere",
                "transform": {
                    "location": [0, 0, 0],
                    "rotation": [0, 0, 0],
                    "scale": [1, 1, 1]
                }
            }
        ],
        "lighting": [
            {
                "type": "SkyLight",
                "intensity": 1.0,
                "color": [0.8, 0.9, 1.0]
            }
        ],
        "camera": {
            "location": [0, -800, 200],
            "rotation": [-10, 0, 0],
            "fov": 90
        },
        "postProcess": {
            "exposureCompensation": 0,
            "autoExposure": True
        },
        "ui": {
            "hideUI": True,
            "showGrid": False,
            "showOutliner": False
        },
        "uiTemplate": "viewport_only",
        "notes": "Show shadow cutoff at ~50m distance. Shadows should be visible close to camera but disappear abruptly."
    },
    
    'step-2': {
        "level": "ScenarioCapture_Level",
        "actors": [
            {
                "id": "directional_light",
                "type": "DirectionalLight",
                "transform": {
                    "location": [0, 0, 500],
                    "rotation": [-45, 0, 0],
                    "scale": [1, 1, 1]
                },
                "intensity": 3.0,
                "lightColor": [1.0, 0.95, 0.9],
                "dynamicShadowDistance": 50000,
                "selected": False
            },
            {
                "id": "landscape",
                "type": "Landscape",
                "material": "/Game/ScenarioAssets/Materials/M_Grass_Simple",
                "transform": {
                    "location": [0, 0, 0],
                    "rotation": [0, 0, 0],
                    "scale": [100, 100, 100]
                },
                "terrainSize": [127, 127]
            },
            {
                "id": "sky_sphere",
                "type": "BP_Sky_Sphere",
                "transform": {
                    "location": [0, 0, 0],
                    "rotation": [0, 0, 0],
                    "scale": [1, 1, 1]
                }
            }
        ],
        "lighting": [
            {
                "type": "SkyLight",
                "intensity": 1.0,
                "color": [0.8, 0.9, 1.0]
            }
        ],
        "camera": {
            "location": [0, -800, 200],
            "rotation": [-10, 0, 0],
            "fov": 90
        },
        "postProcess": {
            "exposureCompensation": 0,
            "autoExposure": True
        },
        "ui": {
            "hideUI": True,
            "showGrid": False
        },
        "uiTemplate": "viewport_only",
        "notes": "Shadows extended to 500m but appearing pixelated/blocky in distance. Need to show low resolution artifacts."
    },
    
    'step-3': {
        "level": "ScenarioCapture_Level",
        "actors": [
            {
                "id": "directional_light",
                "type": "DirectionalLight",
                "transform": {
                    "location": [0, 0, 500],
                    "rotation": [-45, 0, 0],
                    "scale": [1, 1, 1]
                },
                "intensity": 3.0,
                "lightColor": [1.0, 0.95, 0.9],
                "dynamicShadowDistance": 50000,
                "numDynamicShadowCascades": 8,
                "selected": False
            },
            {
                "id": "landscape",
                "type": "Landscape",
                "material": "/Game/ScenarioAssets/Materials/M_Grass_Simple",
                "transform": {
                    "location": [0, 0, 0],
                    "rotation": [0, 0, 0],
                    "scale": [100, 100, 100]
                },
                "terrainSize": [127, 127]
            },
            {
                "id": "sky_sphere",
                "type": "BP_Sky_Sphere",
                "transform": {
                    "location": [0, 0, 0],
                    "rotation": [0, 0, 0],
                    "scale": [1, 1, 1]
                }
            }
        ],
        "lighting": [
            {
                "type": "SkyLight",
                "intensity": 1.0,
                "color": [0.8, 0.9, 1.0]
            }
        ],
        "camera": {
            "location": [0, -800, 200],
            "rotation": [-10, 0, 0],
            "fov": 90
        },
        "postProcess": {
            "exposureCompensation": 0,
            "autoExposure": True
        },
        "ui": {
            "hideUI": True,
            "showGrid": False,
            "showPIEButton": True
        },
        "uiTemplate": "viewport_only",
        "notes": "Shadows clean and extended to full 500m. Quality maintained throughout range."
    },
    
    'conclusion': {
        "level": "ScenarioCapture_Level",
        "actors": [
            {
                "id": "directional_light",
                "type": "DirectionalLight",
                "transform": {
                    "location": [0, 0, 500],
                    "rotation": [-45, 0, 0],
                    "scale": [1, 1, 1]
                },
                "intensity": 3.0,
                "lightColor": [1.0, 0.95, 0.9],
                "dynamicShadowDistance": 50000,
                "numDynamicShadowCascades": 8
            },
            {
                "id": "landscape",
                "type": "Landscape",
                "material": "/Game/ScenarioAssets/Materials/M_Grass_Simple",
                "transform": {
                    "location": [0, 0, 0],
                    "rotation": [0, 0, 0],
                    "scale": [100, 100, 100]
                },
                "terrainSize": [127, 127]
            },
            {
                "id": "sky_sphere",
                "type": "BP_Sky_Sphere",
                "transform": {
                    "location": [0, 0, 0],
                    "rotation": [0, 0, 0],
                    "scale": [1, 1, 1]
                }
            }
        ],
        "lighting": [
            {
                "type": "SkyLight",
                "intensity": 1.0,
                "color": [0.8, 0.9, 1.0]
            }
        ],
        "camera": {
            "location": [200, -1000, 300],
            "rotation": [-15, 10, 0],
            "fov": 90
        },
        "postProcess": {
            "exposureCompensation": 0.5,
            "autoExposure": True
        },
        "ui": {
            "hideUI": True,
            "showGrid": False
        },
        "uiTemplate": "viewport_only",
        "notes": "Final beauty shot showing full 500m shadow range. Wide angle, elevated camera."
    }
}


def add_scene_setup_to_file(file_path):
    """Add sceneSetup to directional_light.js scenario"""
    
    print(f"Reading {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Track modifications
    modifications = 0
    
    # For each step, add sceneSetup after the title
    for step_id, scene_setup in SCENE_SETUPS.items():
        # Find the step definition
        step_pattern = rf"('{step_id}':\s*{{[^}}]*?title:\s*'[^']*',)"
        
        match = re.search(step_pattern, content, re.DOTALL)
        if match:
            # Create sceneSetup JSON string (pretty-printed)
            scene_setup_json = json.dumps(scene_setup, indent=12)
            
            # Add sceneSetup field right after title
            replacement = match.group(1) + f"\n            sceneSetup: {scene_setup_json},"
            
            content = content.replace(match.group(1), replacement)
            modifications += 1
            print(f"  ✓ Added sceneSetup to {step_id}")
        else:
            print(f"  ✗ Could not find {step_id}")
    
    # Write modified content back
    print(f"\nWriting modified file...")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Successfully modified {modifications} steps")
    return modifications


if __name__ == '__main__':
    import sys
    from pathlib import Path
    
    # Default to directional_light.js
    project_root = Path(__file__).parent.parent
    scenario_file = project_root / 'scenarios' / 'directional_light.js'
    
    if not scenario_file.exists():
        print(f"❌ Error: {scenario_file} not found")
        sys.exit(1)
    
    print("=" * 60)
    print("Adding sceneSetup to directional_light scenario")
    print("=" * 60)
    
    count = add_scene_setup_to_file(scenario_file)
    
    if count > 0:
        print(f"\n✅ Success! Added sceneSetup to {count} steps")
        print(f"📁 Modified: {scenario_file}")
    else:
        print("\n❌ No modifications made")
        sys.exit(1)
