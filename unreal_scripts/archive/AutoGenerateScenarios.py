"""
Main automation script for Unreal Engine scenario generation

This script orchestrates the full scene setup, screenshot capture, and export process.
"""

import unreal
import json
import sys
import os
import time
import importlib

# Ensure we can import from the current directory (core)
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Also add experimental for WindowsPrintScreen
experimental_dir = os.path.join(os.path.dirname(current_dir), "experimental")
if experimental_dir not in sys.path:
    sys.path.append(experimental_dir)

# Force reload to avoid stale code in Unreal
import SceneBuilder
importlib.reload(SceneBuilder)
from SceneBuilder import SceneBuilder

import WindowsPrintScreen
importlib.reload(WindowsPrintScreen)
from WindowsPrintScreen import capture_editor_window

import SceneExporter
importlib.reload(SceneExporter)
from SceneExporter import SceneExporter


def generate_scenario_step(scene_spec, scenario_id, step_id, output_base_path, prompt):
    """
    Generate assets for a single scenario step
    
    Args:
        scene_spec (dict): Scene specification from sceneSetup
        scenario_id (str): Scenario identifier
        step_id (str): Step identifier  
        output_base_path (str): Base output directory
        prompt (str): Prompt text for this step
        
    Returns:
        dict: Complete step data including image path and scene data
    """
    unreal.log("=" * 70)
    unreal.log(f"Generating: {scenario_id} / {step_id}")
    unreal.log("=" * 70)
    
    # Initialize utilities
    scene_builder = SceneBuilder()
    exporter = SceneExporter()
    
    # Setup scene
    scene_builder.setup_scene(scene_spec)
    
    # Create output directories
    output_dir = os.path.join(output_base_path, scenario_id)
    images_dir = os.path.join(output_dir, "images")
    os.makedirs(images_dir, exist_ok=True)
    
    # Capture screenshot using Windows API (Epic-compliant)
    screenshot_path = os.path.join(images_dir, f"{step_id}.png")
    
    # CRITICAL: Wait for viewport to fully render before capture
    import time
    
    # Force multiple viewport refreshes to ensure camera position updates
    unreal.EditorLevelLibrary.editor_invalidate_viewports()
    time.sleep(1.0)
    unreal.EditorLevelLibrary.editor_invalidate_viewports()
    time.sleep(1.0)
    
    # Execute console command to force redraw
    unreal.SystemLibrary.execute_console_command(None, "RedrawAllViewports")
    time.sleep(3.0)  # Give viewport time to fully render
    
    unreal.log(f"Taking screenshot after 5 second wait...")
    success = capture_editor_window(screenshot_path)
    
    if not success:
        unreal.log_warning(f"Screenshot capture failed for {step_id}")
    
    # Calculate relative image path for web app
    image_rel_path = f"{scenario_id}/images/{step_id}.png"
    
    # Export JSON
    full_path, scene_data = exporter.export_scene(output_dir, step_id, image_rel_path)
    
    return {
        "step_id": step_id,
        "prompt": prompt,
        "image_path": image_rel_path,
        "scene_data": scene_data
    }


def generate_scenario_assets(spec_file_path, output_base_path):
    """
    Main entry point - generate all assets for a scenario
    
    Args:
        spec_file_path (str): Path to JSON file with scene specifications
        output_base_path (str): Base path for Content/Scenarios folder
    """
    unreal.log("=" * 70)
    unreal.log("Scenario Asset Generation")
    unreal.log("=" * 70)
    unreal.log("")
    
    # Load scene specifications
    with open(spec_file_path, 'r') as f:
        spec_data = json.load(f)
    
    scenario_id = spec_data['scenarioId']
    steps = spec_data['steps']
    
    unreal.log(f"Scenario: {scenario_id}")
    unreal.log(f"Steps: {len(steps)}")
    unreal.log("")
    
    all_steps_data = []
    
    # Process each step
    for i, step in enumerate(steps, 1):
        step_id = step['stepId']
        scene_setup = step['sceneSetup']
        prompt = step.get('prompt', '')
        
        unreal.log(f"[{i}/{len(steps)}] Processing {step_id}...")
        
        try:
            step_result = generate_scenario_step(
                scene_setup,
                scenario_id,
                step_id,
                output_base_path,
                prompt
            )
            all_steps_data.append(step_result)
        except Exception as e:
            unreal.log_error(f"Failed to generate {step_id}: {e}")
            import traceback
            unreal.log_error(traceback.format_exc())
            continue
        
        # Cleanup between steps
        import gc
        gc.collect()
        unreal.SystemLibrary.execute_console_command(None, "obj gc")

    # Write final combined scenario JS
    final_scenario_data = {
        "scenario_id": scenario_id,
        "steps": all_steps_data
    }
    
    output_dir = os.path.join(output_base_path, scenario_id)
    final_js_path = os.path.join(output_dir, f"{scenario_id}.js")
    
    js_content = f"""window.SCENARIOS = window.SCENARIOS || {{}};
window.SCENARIOS['{scenario_id}'] = {json.dumps(final_scenario_data, indent=2)};
"""
    
    with open(final_js_path, 'w') as f:
        f.write(js_content)
        
    unreal.log(f"Final scenario exported to: {final_js_path}")
    
    unreal.log("=" * 70)
    unreal.log("Generation Complete!")
    unreal.log("=" * 70)
    unreal.log(f"Output: {os.path.join(output_base_path, scenario_id)}")


# Entry point when run as script
if __name__ == '__main__':
    if len(sys.argv) >= 3:
        spec_file = sys.argv[1]
        output_path = sys.argv[2]
    else:
        spec_file = "D:/temp/directional_light_spec.json"
        output_path = unreal.Paths.project_content_dir() + "Scenarios"
    
    generate_scenario_assets(spec_file, output_path)
