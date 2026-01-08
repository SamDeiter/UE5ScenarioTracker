"""
NUCLEAR OPTION: Spawn New Light Test & Log EVERYTHING

1. Deletes ANY existing DirectionalLight (to remove confusion)
2. Spawns a BRAND NEW DirectionalLight
3. Forces it to Red/Green/Blue per step
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
        self.wait_frames = 20  # Wait longer (20 frames)
        self.json_dir = r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\scenarios\directional_light"
        self.output_dir = os.path.join(self.json_dir, "images")
        self.processing_state = "SETUP"
        self.current_light = None
        
        # Ensure output directory exists
        os.makedirs(self.output_dir, exist_ok=True)
        
        print("\n" + "="*70)
        print("STARTING NUCLEAR LIGHT TEST")
        print("="*70)
        
        # Register callback
        self.handle = unreal.register_slate_post_tick_callback(self.tick)

    def tick(self, delta_time):
        
        try:
            if self.step_index >= len(self.steps):
                self.finish()
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
            self.finish()

    def setup_fresh_light(self, step_id):
        # 1. DELETE EXISTING LIGHTS
        actors = unreal.EditorLevelLibrary.get_all_level_actors()
        for actor in actors:
            if actor.get_class().get_name() == 'DirectionalLight':
                print(f"  - Deleting existing light: {actor.get_actor_label()}")
                unreal.EditorLevelLibrary.destroy_actor(actor)
        
        # 2. SPAWN NEW LIGHT
        print(f"  + Spawning NEW DirectionalLight...")
        light_actor = unreal.EditorLevelLibrary.spawn_actor_from_class(
            unreal.DirectionalLight,
            unreal.Vector(0, 0, 500),
            unreal.Rotator(-45, 45, 0)
        )
        light_actor.set_actor_label(f"FreshLight_{step_id}")
        
        # 3. FORCE MOVABLE
        light_actor.root_component.set_editor_property("mobility", unreal.ComponentMobility.MOVABLE)
        
        # 4. SET PROPERTIES
        comp = light_actor.light_component
        
        # Hardcoded colors for debugging
        if step_id == "step-1":
            color = unreal.LinearColor(1.0, 0.0, 0.0, 1.0) # RED
            shadow_dist = 500.0
        elif step_id == "step-2":
            color = unreal.LinearColor(0.0, 1.0, 0.0, 1.0) # GREEN
            shadow_dist = 3000.0
        else:
            color = unreal.LinearColor(0.0, 0.0, 1.0, 1.0) # BLUE
            shadow_dist = 50000.0
            
        comp.set_editor_property("light_color", color)
        comp.set_editor_property("dynamic_shadow_distance_movable_light", shadow_dist)
        comp.set_editor_property("intensity", 5.0) # Make it bright!
        
        print(f"  ✓ Set Color: {color}")
        print(f"  ✓ Set Shadow Dist: {shadow_dist}")

    def finish(self):
        print("Test Complete!")
        unreal.unregister_slate_post_tick_callback(self.handle)

# Start
try:
    test = NuclearScreenshotTest()
except Exception as e:
    print(f"Failed to start: {e}")
