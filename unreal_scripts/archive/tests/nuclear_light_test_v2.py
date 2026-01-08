"""
NUCLEAR OPTION V2: Spawn New Light Test (Fixed Color)

1. Deletes ANY existing DirectionalLight
2. Spawns a BRAND NEW DirectionalLight
3. Forces it to Red/Green/Blue using dedicated setter methods
4. Captures screenshots
"""

import sys
import json
import os
import unreal
import importlib
import WindowsPrintScreen

class NuclearScreenshotTest:
    def __init__(self):
        self.steps = ["step-1", "step-2", "step-3"]
        self.step_index = 0
        self.frame_count = 0
        self.wait_frames = 20
        self.json_dir = r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\scenarios\directional_light"
        self.output_dir = os.path.join(self.json_dir, "images")
        self.processing_state = "SETUP"
        self.is_busy = False # Guard against re-entrancy
        
        # Ensure output directory exists
        os.makedirs(self.output_dir, exist_ok=True)
        
        print("\n" + "="*70)
        print("STARTING NUCLEAR LIGHT TEST V2")
        print("="*70)
        
        # Register callback
        self.handle = unreal.register_slate_post_tick_callback(self.tick)

    def tick(self, delta_time):
        
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
                print(f"[{step_id}] Setting up scene...")
                self.setup_fresh_light(step_id)
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
                
                success = WindowsPrintScreen.capture_editor_window(output_path)
                if success:
                    print(f"[{step_id}] Saved to {output_path}")
                
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

    def setup_fresh_light(self, step_id):
        # 0. READ JSON
        json_path = os.path.join(self.json_dir, f"{step_id}.json")
        with open(json_path, 'r') as f:
            scene_spec = json.load(f)
            
        light_spec = None
        for light in scene_spec.get('lighting', []):
            if light.get('type') == 'DirectionalLight':
                light_spec = light
                break
        
        if not light_spec:
            print(f"  ⚠ No DirectionalLight found in {step_id}.json")
            return

        # 1. DELETE EXISTING LIGHTS
        actors = unreal.EditorLevelLibrary.get_all_level_actors()
        for actor in actors:
            if actor.get_class().get_name() == 'DirectionalLight':
                unreal.EditorLevelLibrary.destroy_actor(actor)
        
        # 2. SPAWN NEW LIGHT
        # Use location from JSON or default
        location = unreal.Vector(0, 0, 500)
        
        # Use rotation from JSON or hardcoded nice angle
        # JSON has rotation: [pitch, yaw, roll]
        
        # User confirmed this rotation works well for showing shadows:
        # (Pitch=-68.980816,Yaw=-82.240678,Roll=170.357306)
        rotation = unreal.Rotator(-68.98, -82.24, 170.36)
        
        # We use the same rotation for ALL steps to ensure we strictly compare Shadow Distance
        # (Instead of changing angles which adds confusion)

        light_actor = unreal.EditorLevelLibrary.spawn_actor_from_class(
            unreal.DirectionalLight,
            location,
            rotation
        )
        light_actor.set_actor_label(f"FreshLight_{step_id}")
        
        # 3. FORCE MOVABLE
        light_actor.root_component.set_editor_property("mobility", unreal.ComponentMobility.MOVABLE)
        
        # 4. SET PROPERTIES
        comp = light_actor.light_component
        
        # Color from JSON
        color = unreal.LinearColor(1.0, 1.0, 1.0, 1.0)
        if 'color' in light_spec:
            c = light_spec['color']
            color = unreal.LinearColor(c[0], c[1], c[2], 1.0)
        
        comp.set_light_color(color)
        comp.set_intensity(light_spec.get('intensity', 3.0))
        
        # Shadow properties
        if 'dynamicShadowDistance' in light_spec:
            val = float(light_spec['dynamicShadowDistance'])
            comp.set_editor_property("dynamic_shadow_distance_movable_light", val)
            print(f"  ✓ Set Shadow Dist: {val}")
            
        if 'numDynamicShadowCascades' in light_spec:
            val = int(light_spec['numDynamicShadowCascades'])
            comp.set_editor_property("dynamic_shadow_cascades", val)
            print(f"  ✓ Set Cascades: {val}")
            
        print(f"  ✓ Processed {step_id}")

    def finish(self):
        print("Test Complete!")
        unreal.unregister_slate_post_tick_callback(self.handle)

# Start
try:
    test = NuclearScreenshotTest()
except Exception as e:
    print(f"Failed to start: {e}")
