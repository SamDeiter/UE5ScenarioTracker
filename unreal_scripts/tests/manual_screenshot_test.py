"""
ROBUST: Manual Screenshot Generation Script (Non-Blocking)

This script uses Unreal's tick callback to ensure the editor renders a frame
between applying settings and taking a screenshot.
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

class ManualScreenshotTest:
    def __init__(self):
        self.steps = ["step-1", "step-2", "step-3"]
        self.step_index = 0
        self.frame_count = 0
        self.wait_frames = 10  # Wait 10 frames between actions
        self.json_dir = r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\scenarios\directional_light"
        self.output_dir = os.path.join(self.json_dir, "images")
        self.processing_state = "SETUP" # SETUP, WAIT, CAPTURE
        self.is_busy = False # Guard against re-entrancy
        
        # Ensure output directory exists
        os.makedirs(self.output_dir, exist_ok=True)
        
        print("\n" + "="*70)
        print("STARTING ROBUST SCREENSHOT TEST")
        print("="*70)
        
        # Register callback
        self.handle = unreal.register_slate_post_tick_callback(self.tick)

    def tick(self, delta_time):
        
        # Prevent re-entry if we're already doing something heavy (like capturing)
        if self.is_busy:
            return

        self.is_busy = True
        
        try:
            if self.step_index >= len(self.steps):
                self.finish()
                self.is_busy = False
                return

            step_id = self.steps[self.step_index]
            
            if self.processing_state == "SETUP":
                print(f"[{step_id}] Applying properties...")
                self.apply_properties(step_id)
                # Force redraw
                unreal.EditorLevelLibrary.editor_invalidate_viewports()
                self.processing_state = "WAIT"
                self.frame_count = 0
                
            elif self.processing_state == "WAIT":
                self.frame_count += 1
                if self.frame_count >= self.wait_frames:
                    self.processing_state = "CAPTURE"
                    
            elif self.processing_state == "CAPTURE":
                print(f"[{step_id}] Capturing screenshot...")
                output_path = os.path.join(self.output_dir, f"{step_id}.bmp")
                
                # Use WindowsPrintScreen
                success = WindowsPrintScreen.capture_editor_window(output_path)
                
                if success:
                    print(f"[{step_id}] Saved to {output_path}")
                else:
                    print(f"[{step_id}] ⚠ Capture failed, moving to next step anyway.")
                
                # Move to next step
                self.step_index += 1
                self.processing_state = "SETUP"
                
        except Exception as e:
            print(f"Error in tick: {e}")
            import traceback
            traceback.print_exc()
            self.finish()
        finally:
            self.is_busy = False

    def apply_properties(self, step_id):
        try:
            # Load the JSON file
            json_path = os.path.join(self.json_dir, f"{step_id}.json")
            with open(json_path, 'r') as f:
                scene_spec = json.load(f)
                
            print(f"  Loaded {step_id}.json")
            
            # Find existing DirectionalLight in level
            actors = unreal.EditorLevelLibrary.get_all_level_actors()
            for actor in actors:
                if actor.get_class().get_name() == 'DirectionalLight':
                    light_component = actor.get_component_by_class(unreal.DirectionalLightComponent)
                    
                    # Force Movable
                    if actor.root_component.mobility != unreal.ComponentMobility.MOVABLE:
                        print(f"  Light was not Movable. Forcing to Movable.")
                        actor.root_component.set_editor_property("mobility", unreal.ComponentMobility.MOVABLE)
                    
                    light_spec = None
                    for light in scene_spec.get('lighting', []):
                        if light.get('type') == 'DirectionalLight':
                            light_spec = light
                            break
                    
                    if light_spec:
                        # Apply Color (for debugging)
                        if 'color' in light_spec:
                            try:
                                rgba = unreal.LinearColor(
                                    light_spec['color'][0],
                                    light_spec['color'][1],
                                    light_spec['color'][2],
                                    1.0
                                )
                                light_component.set_editor_property('light_color', rgba)
                                print(f"  Set color: {light_spec['color']}")
                            except Exception as e:
                                print(f"  Error setting color: {e}")

                        # Apply shadow properties
                        if 'dynamicShadowDistance' in light_spec:
                            try:
                                val = light_spec['dynamicShadowDistance']
                                light_component.set_editor_property('dynamic_shadow_distance_movable_light', val)
                                print(f"  Set dynamicShadowDistance: {val}")
                            except Exception as e:
                                print(f"  Error setting dynamicShadowDistance: {e}")
                        
                        if 'numDynamicShadowCascades' in light_spec:
                            try:
                                val = light_spec['numDynamicShadowCascades']
                                light_component.set_editor_property('dynamic_shadow_cascades', val)
                                print(f"  Set numDynamicShadowCascades: {val}")
                            except Exception as e:
                                print(f"  Error setting numDynamicShadowCascades: {e}")
                    break
        except Exception as e:
            print(f"Error in apply_properties: {e}")

    def finish(self):
        print("Test Complete!")
        unreal.unregister_slate_post_tick_callback(self.handle)

# Create instance to start test
try:
    test = ManualScreenshotTest()
except Exception as e:
    print(f"Failed to start test: {e}")
