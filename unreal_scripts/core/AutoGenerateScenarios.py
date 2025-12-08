"""
Main automation script for Unreal Engine scenario generation

This script orchestrates the full scene setup, screenshot capture, and export process.
"""

import unreal
import json
import sys
import os
import time

# Import our modules
from SceneBuilder import SceneBuilder
from SuperSimpleScreenshot import SuperSimpleScreenshot  # Fast PrintScreen approach
from SceneExporter import SceneExporter


def generate_scenario_step(scene_spec, scenario_id, step_id, output_base_path):
    """
    Generate assets for a single scenario step
    
    Args:
        scene_spec (dict): Scene specification from sceneSetup
        scenario_id (str): Scenario identifier
        step_id (str): Step identifier  
        output_base_path (str): Base output directory
    """
    unreal.log("=" * 70)
    unreal.log(f"Generating: {scenario_id} / {step_id}")
    unreal.log("=" * 70)
    
    # Initialize utilities
    scene_builder = SceneBuilder()
    screenshot = SuperSimpleScreenshot()
    exporter = SceneExporter()
    
    # Setup scene
    scene_builder.setup_scene(scene_spec)
    
    # Create output directory
    output_dir = os.path.join(output_base_path, scenario_id)
    os.makedirs(output_dir, exist_ok=True)
    
    # Capture screenshot (use 'capture' method, not 'capture_screenshot')
    screenshot.capture(output_dir, step_id, resolution=(1280, 720))
    
    # Export JSON (export_scene expects output_path and filename separately)
    exporter.export_scene(output_dir, step_id)


def generate_scenario_assets(spec_file_path, output_base_path):
    """
    Main entry point - generate all assets for a scenario
    
    Args:
        spec_file_path (str): Path to JSON file with scene specifications
        output_base_path (str): Base path for Content/Scenarios folder
    """
    unreal.log("╔" + "=" * 68 + "╗")
    unreal.log("║" + " " * 15 + "Scenario Asset Generation" + " " * 28 + "║")
    unreal.log("╚" + "=" * 68 + "╝")
    unreal.log("")
    
    # Load scene specifications
    with open(spec_file_path, 'r') as f:
        spec_data = json.load(f)
    
    scenario_id = spec_data['scenarioId']
    steps = spec_data['steps']
    
    unreal.log(f"Scenario: {scenario_id}")
    unreal.log(f"Steps: {len(steps)}")
    unreal.log("")
    
    # Process each step
    for i, step in enumerate(steps, 1):
        step_id = step['stepId']
        scene_setup = step['sceneSetup']
        
        unreal.log(f"[{i}/{len(steps)}] Processing {step_id}...")
        
        try:
            generate_scenario_step(
                scene_setup,
                scenario_id,
                step_id,
                output_base_path
            )
        except Exception as e:
            unreal.log_error(f"Failed to generate {step_id}: {e}")
            continue
        
        # Cleanup between steps to prevent memory/resource issues
        import gc
        gc.collect()  # Python garbage collection
        unreal.SystemLibrary.execute_console_command(None, "obj gc")  # UE garbage collection
    
    # Clean up temp screenshots after ALL steps complete
    try:
        project_dir = unreal.SystemLibrary.get_project_directory()
        temp_screenshot_path = os.path.join(project_dir, "Saved", "Screenshots", "WindowsEditor")
        if os.path.exists(temp_screenshot_path):
            for f in os.listdir(temp_screenshot_path):
                if f.endswith('.png'):
                    file_path = os.path.join(temp_screenshot_path, f)
                    os.remove(file_path)
                    unreal.log(f"Cleaned up temp file: {f}")
    except Exception as cleanup_error:
        unreal.log_warning(f"Cleanup warning: {cleanup_error}")
    
    unreal.log("╔" + "=" * 68 + "╗")
    unreal.log("║" + " " * 20 + "Generation Complete!" + " " * 26 + "║")
    unreal.log("╚" + "=" * 68 + "╝")
    unreal.log(f"Output: {os.path.join(output_base_path, scenario_id)}")


# Entry point when run as script
if __name__ == '__main__':
    # Get arguments from command line or use defaults
    if len(sys.argv) >= 3:
        spec_file = sys.argv[1]
        output_path = sys.argv[2]
    else:
        # Default paths for testing
        spec_file = "D:/temp/directional_light_spec.json"
        output_path = unreal.Paths.project_content_dir() + "Scenarios"
    
    generate_scenario_assets(spec_file, output_path)
