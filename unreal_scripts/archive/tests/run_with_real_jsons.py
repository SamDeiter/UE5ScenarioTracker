"""
Script to run in Unreal Engine Python console to generate screenshots
using the actual step JSON files with shadow properties.
"""

import sys
import json
import os
import unreal
import importlib

# Add paths to scripts
sys.path.insert(0, r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\core")
sys.path.insert(0, r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\experimental")

# Force reload to pick up changes
if 'SceneBuilder' in sys.modules:
    importlib.reload(sys.modules['SceneBuilder'])
if 'WindowsPrintScreen' in sys.modules:
    importlib.reload(sys.modules['WindowsPrintScreen'])

from SceneBuilder import SceneBuilder
import WindowsPrintScreen

# Paths
json_dir = r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\scenarios\directional_light"
output_dir = os.path.join(json_dir, "images")

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

# Steps to process
steps = ["step-1", "step-2", "step-3"]

scene_builder = SceneBuilder()

# Helper function to count actors by type
def count_actors_by_type():
    actors = unreal.EditorLevelLibrary.get_all_level_actors()
    type_counts = {}
    for actor in actors:
        try:
            class_name = actor.get_class().get_name()
            type_counts[class_name] = type_counts.get(class_name, 0) + 1
        except:
            pass
    return type_counts

for step_id in steps:
    print(f"\n{'='*70}")
    print(f"Processing {step_id}...")
    print(f"{'='*70}")
    
    # Show actor count BEFORE cleanup
    print("\nActors BEFORE cleanup:")
    before_counts = count_actors_by_type()
    for actor_type, count in sorted(before_counts.items()):
        if count > 1 or "Light" in actor_type:
            print(f"  {actor_type}: {count}")
    
    # Load the JSON file
    json_path = os.path.join(json_dir, f"{step_id}.json")
    
    with open(json_path, 'r') as f:
        scene_spec = json.load(f)
    
    # DEBUG: Print lighting properties
    print(f"\n📋 DEBUG: Properties for {step_id}:")
    for light in scene_spec.get('lighting', []):
        print(f"  Light type: {light.get('type')}")
        print(f"  Properties found in JSON:")
        for key in ['intensity', 'color', 'lightColor', 'dynamicShadowDistance', 'numDynamicShadowCascades']:
            if key in light:
                print(f"    - {key}: {light[key]}")
    
    # Set up the scene (this calls clear_level internally)
    scene_builder.setup_scene(scene_spec)
    
    # Show actor count AFTER setup
    print("\nActors AFTER setup:")
    after_counts = count_actors_by_type()
    for actor_type, count in sorted(after_counts.items()):
        if "Light" in actor_type or "Landscape" in actor_type:
            print(f"  {actor_type}: {count}")
    
    # Wait for rendering to settle
    import time
    time.sleep(2)
    
    # Capture screenshot
    output_path = os.path.join(output_dir, f"{step_id}.bmp")
    success = WindowsPrintScreen.capture_editor_window(output_path)
    
    if success:
        print(f"✓ Screenshot saved: {output_path}")
    else:
        print(f"✗ Failed to capture screenshot for {step_id}")

print("\n" + "="*70)
print("Screenshot generation complete!")
print(f"Output directory: {output_dir}")
print("="*70)
