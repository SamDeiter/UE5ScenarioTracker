"""
Semi-automated screenshot generation with manual F9 capture

This script sets up each scene step, then pauses for the user to:
1. Press F9 to capture screenshot
2. Press Enter in the Python console to continue

This ensures reliable screenshot capture while minimizing manual work.
"""

import unreal
import time
import os

# Import our modules
import sys
sys.path.append('C:/Users/sam.deiter/Documents/Unreal Projects/UEScenarioFactory/Content/Python')

from SceneBuilder import SceneBuilder
from SceneExporter import SceneExporter

def manual_screenshot_workflow(spec_file_path, output_base_path):
    """
    Semi-automated workflow with manual F9 screenshots
    """
    import json
    
    unreal.log("╔" + "=" * 68 + "╗")
    unreal.log("║" + " " * 15 + "Semi-Automated Screenshot Workflow" + " " * 18 + "║")
    unreal.log("╚" + "=" * 68 + "╝")
    
    # Load scene specifications
    with open(spec_file_path, 'r') as f:
        spec_data = json.load(f)
    
    scenario_id = spec_data['scenarioId']
    steps = spec_data['steps']
    
    unreal.log(f"Scenario: {scenario_id}")
    unreal.log(f"Steps: {len(steps)}")
    unreal.log("")
    
    # Get UE's default screenshot location
    project_dir = unreal.SystemLibrary.get_project_directory()
    default_screenshot_path = os.path.join(project_dir, "Saved", "Screenshots", "Windows")
    os.makedirs(default_screenshot_path, exist_ok=True)
    
    # Clear any existing screenshots
    if os.path.exists(default_screenshot_path):
        for f in os.listdir(default_screenshot_path):
            if f.endswith('.png'):
                os.remove(os.path.join(default_screenshot_path, f))
    
    # Process each step
    for i, step in enumerate(steps, 1):
        step_id = step['stepId']
        scene_setup = step['sceneSetup']
        
        unreal.log("")
        unreal.log("=" * 70)
        unreal.log(f"[{i}/{len(steps)}] {step_id}")
        unreal.log("=" * 70)
        
        # Setup scene
        scene_builder = SceneBuilder()
        scene_builder.setup_scene(scene_setup)
        
        unreal.log("✓ Scene setup complete!")
        unreal.log("")
        unreal.log("█" * 70)
        unreal.log("█  ACTION REQUIRED:")
        unreal.log("█  1. Press F9 to capture screenshot")
        unreal.log("█  2. Press Enter in Python Output Log to continue...")
        unreal.log("█" * 70)
        
        # Wait for user input
        input("Press Enter after you've captured the screenshot with F9...")
        
        # Find the most recent PNG in default location
        time.sleep(0.5)  # Small delay for file system
        
        if os.path.exists(default_screenshot_path):
            png_files = [f for f in os.listdir(default_screenshot_path) if f.endswith('.png')]
            if png_files:
                png_files_full = [os.path.join(default_screenshot_path, f) for f in png_files]
                png_files_full.sort(key=os.path.getmtime, reverse=True)
                latest_screenshot = png_files_full[0]
                
                # Move to target location
                output_dir = os.path.join(output_base_path, scenario_id)
                os.makedirs(output_dir, exist_ok=True)
                
                # Determine filename based on step
                if step_id == 'conclusion':
                    target_filename = 'conclusion.png'
                else:
                    # Extract step number from "step-1", "step-2", etc.
                    step_num = step_id.split('-')[1]
                    target_filename = f"step{step_num}.png"
                
                target_path = os.path.join(output_dir, target_filename)
                
                import shutil
                shutil.move(latest_screenshot, target_path)
                unreal.log(f"✓ Screenshot saved: {target_path}")
                
                # Export scene JSON
                exporter = SceneExporter()
                json_filename = step_id
                exporter.export_scene(output_dir, json_filename)
            else:
                unreal.log_warning(f"No screenshot found! Did you press F9?")
        else:
            unreal.log_error(f"Screenshot folder doesn't exist: {default_screenshot_path}")
    
    unreal.log("")
    unreal.log("╔" + "=" * 68 + "╗")
    unreal.log("║" + " " * 20 + "All Steps Complete!" + " " * 27 + "║")
    unreal.log("╚" + "=" * 68 + "╝")
    unreal.log(f"Output: {os.path.join(output_base_path, scenario_id)}")

# Example usage:
if __name__ == "__main__":
    spec_file = "C:/Users/sam.deiter/Documents/Unreal Projects/UEScenarioFactory/directional_light_spec.json"
    output_path = "C:/Users/sam.deiter/Documents/Unreal Projects/UEScenarioFactory/Content/Scenarios"
    
    manual_screenshot_workflow(spec_file, output_path)
