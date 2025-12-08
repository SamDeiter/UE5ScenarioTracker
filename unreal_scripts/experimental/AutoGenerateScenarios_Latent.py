"""
Proper Latent Automation for UE Screenshot Generation

This version uses Unreal's AutomationScheduler to properly handle
asynchronous screenshot capture, allowing the engine to tick between operations.
"""

import unreal
import json
import os
import time

from SceneBuilder import SceneBuilder
from SceneExporter import SceneExporter


class LatentScreenshotWorkflow:
    """Workflow that properly handles latent commands for screenshot automation"""
    
    def __init__(self, spec_file_path, output_base_path):
        self.spec_file_path = spec_file_path
        self.output_base_path = output_base_path
        self.current_step_index = 0
        self.steps = []
        self.scenario_id = ""
        
    def start(self):
        """Start the latent workflow"""
        unreal.log("╔" + "=" * 68 + "╗")
        unreal.log("║" + " " * 12 + "Latent Scenario Asset Generation" + " " * 21 + "║")
        unreal.log("╚" + "=" * 68 + "╝")
        
        # Load spec
        with open(self.spec_file_path, 'r') as f:
            spec_data = json.load(f)
        
        self.scenario_id = spec_data['scenarioId']
        self.steps = spec_data['steps']
        
        unreal.log(f"Scenario: {self.scenario_id}")
        unreal.log(f"Steps: {len(self.steps)}")
        unreal.log("")
        
        # Start processing first step
        self.process_next_step()
    
    def process_next_step(self):
        """Process the next step in the workflow"""
        if self.current_step_index >= len(self.steps):
            self.complete()
            return
        
        step = self.steps[self.current_step_index]
        step_id = step['stepId']
        scene_setup = step['sceneSetup']
        
        unreal.log(f"[{self.current_step_index + 1}/{len(self.steps)}] Processing {step_id}...")
        unreal.log("=" * 70)
        
        # Setup scene
        scene_builder = SceneBuilder()
        scene_builder.setup_scene(scene_setup)
        
        # Wait for lighting with countdown
        self.wait_for_lighting_with_tick_callback(step_id, scene_setup)
    
    def wait_for_lighting_with_tick_callback(self, step_id, scene_setup):
        """Wait for lighting to compile using tick callback"""
        wait_frames = 600  # 20 seconds at 30fps
        frame_count = [0]
        
        def on_tick(delta_time):
            frame_count[0] += 1
            
            # Log progress every 150 frames (5 seconds)
            if frame_count[0] % 150 == 0:
                remaining_sec = (wait_frames - frame_count[0]) / 30
                unreal.log(f"   Lighting compilation: {remaining_sec:.0f}s remaining...")
            
            if frame_count[0] >= wait_frames:
                # Done waiting, unregister and capture screenshot
                unreal.unregister_slate_post_tick_callback(on_tick)
                unreal.log("✓ Lighting ready!")
                self.capture_screenshot_for_step(step_id, scene_setup)
        
        unreal.log(f"⏳ Waiting 20s for lighting/shaders to compile...")
        unreal.register_slate_post_tick_callback(on_tick)
    
    def capture_screenshot_for_step(self, step_id, scene_setup):
        """Capture screenshot using tick callback"""
        # Get output paths
        screenshot_dir = os.path.join(self.output_base_path, self.scenario_id)
        os.makedirs(screenshot_dir, exist_ok=True)
        
        # Determine filename
        if step_id == 'conclusion':
            filename = 'conclusion.png'
        else:
            step_num = step_id.split('-')[1]
            filename = f"step{step_num}.png"
        
        screenshot_path = os.path.join(screenshot_dir, filename)
        
        # Setup screenshot
        project_dir = unreal.SystemLibrary.get_project_directory()
        temp_dir = os.path.join(project_dir, "Saved", "Screenshots", "WindowsEditor")
        os.makedirs(temp_dir, exist_ok=True)
        
        # Clear temp folder
        for f in os.listdir(temp_dir):
            if f.endswith('.png'):
                try:
                    os.remove(os.path.join(temp_dir, f))
                except:
                    pass
        
        # Hide UI and set resolution
        unreal.SystemLibrary.execute_console_command(None, "showflag.hud 0")
        unreal.SystemLibrary.execute_console_command(None, "showflag.selection 0")
        unreal.SystemLibrary.execute_console_command(None, "showflag.grid 0")
        unreal.SystemLibrary.execute_console_command(None, "r.SetRes 1280x720")
        
        unreal.log(f"Capturing screenshot: {filename}")
        
        # Execute screenshot command
        unreal.SystemLibrary.execute_console_command(None, "HighResShot 1280x720")
        
        # Wait for file with tick callback
        tick_count = [0]
        max_ticks = 300  # 10 seconds at 30fps
        
        def on_screenshot_tick(delta_time):
            tick_count[0] += 1
            
            # Check for file
            if os.path.exists(temp_dir):
                png_files = [f for f in os.listdir(temp_dir) if f.endswith('.png')]
                if png_files:
                    # Found it!
                    import shutil
                    png_files_full = [os.path.join(temp_dir, f) for f in png_files]
                    png_files_full.sort(key=os.path.getmtime, reverse=True)
                    source_file = png_files_full[0]
                    
                    shutil.move(source_file, screenshot_path)
                    unreal.log(f"✓ Screenshot saved: {screenshot_path}")
                    
                    # Unregister callback
                    unreal.unregister_slate_post_tick_callback(on_screenshot_tick)
                    
                    # Export scene JSON
                    self.export_scene_for_step(step_id)
                    return
            
            # Timeout
            if tick_count[0] >= max_ticks:
                unreal.log_warning(f"Screenshot timed out: {filename}")
                unreal.unregister_slate_post_tick_callback(on_screenshot_tick)
                self.export_scene_for_step(step_id)
        
        unreal.register_slate_post_tick_callback(on_screenshot_tick)
    
    def export_scene_for_step(self, step_id):
        """Export scene JSON and move to next step"""
        # Export scene
        exporter = SceneExporter()
        output_dir = os.path.join(self.output_base_path, self.scenario_id)
        
        if step_id == 'conclusion':
            json_filename = 'conclusion'
        else:
            step_num = step_id.split('-')[1]
            json_filename = f"step{step_num}"
        
        exporter.export_scene(output_dir, json_filename)
        
        unreal.log(f"✓ {step_id} complete")
        unreal.log("")
        
        # Cleanup
        import gc
        gc.collect()
        unreal.SystemLibrary.execute_console_command(None, "obj gc")
        
        # Move to next step
        self.current_step_index += 1
        self.process_next_step()
    
    def complete(self):
        """All steps complete"""
        unreal.log("╔" + "=" * 68 + "╗")
        unreal.log("║" + " " * 20 + "Generation Complete!" + " " * 26 + "║")
        unreal.log("╚" + "=" * 68 + "╝")
        unreal.log(f"Output: {os.path.join(self.output_base_path, self.scenario_id)}")


def generate_scenario_assets_latent(spec_file_path, output_base_path):
    """
    Main entry point for latent screenshot generation
    
    This uses Slate tick callbacks to properly handle async operations
    """
    workflow = LatentScreenshotWorkflow(spec_file_path, output_base_path)
    workflow.start()


# Example usage
if __name__ == '__main__':
    spec_file = "C:/Users/sam.deiter/Documents/Unreal Projects/UEScenarioFactory/directional_light_spec.json"
    output_path = "C:/Users/sam.deiter/Documents/Unreal Projects/UEScenarioFactory/Content/Scenarios"
    
    generate_scenario_assets_latent(spec_file, output_path)
