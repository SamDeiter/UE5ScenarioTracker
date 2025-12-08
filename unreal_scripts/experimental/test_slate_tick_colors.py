"""
Test Light Colors with Proper Frame Timing

Uses unreal.register_slate_post_tick_callback() to wait for the 
viewport to actually render before taking screenshots.
"""

import unreal
import os
import sys

# Add path
sys.path.insert(0, 'c:/Users/Sam Deiter/Documents/GitHub/UE5ScenarioTracker/unreal_scripts/core')
sys.path.insert(0, 'c:/Users/Sam Deiter/Documents/GitHub/UE5ScenarioTracker/unreal_scripts/experimental')

from WindowsPrintScreen import capture_editor_window

# Configuration
OUTPUT_DIR = 'c:/Users/Sam Deiter/Documents/GitHub/UE5ScenarioTracker/Content/Scenarios/test_light_colors/images'
LIGHT_COLORS = [
    ('step-1', unreal.LinearColor(1.0, 0.0, 0.0), 'RED'),
    ('step-2', unreal.LinearColor(0.0, 1.0, 0.0), 'GREEN'),
    ('step-3', unreal.LinearColor(0.0, 0.0, 1.0), 'BLUE'),
]

# State machine
class LightColorTest:
    def __init__(self):
        self.current_step = 0
        self.frames_to_wait = 0
        self.callback_handle = None
        self.light_component = None
        
    def find_directional_light(self):
        """Find the first directional light in the scene"""
        actors = unreal.EditorLevelLibrary.get_all_level_actors()
        for actor in actors:
            if actor.get_class().get_name() == 'DirectionalLight':
                self.light_component = actor.get_component_by_class(unreal.DirectionalLightComponent)
                return True
        return False
    
    def start(self):
        """Start the test sequence"""
        if not self.find_directional_light():
            unreal.log_error("No DirectionalLight found in scene!")
            return
            
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        unreal.log("Starting Light Color Test with Slate Tick Callback...")
        
        # Register our tick callback
        self.callback_handle = unreal.register_slate_post_tick_callback(self.tick)
        
        # Start first color
        self.set_next_color()
    
    def set_next_color(self):
        """Set the next light color and wait for rendering"""
        if self.current_step >= len(LIGHT_COLORS):
            self.finish()
            return
            
        step_id, color, name = LIGHT_COLORS[self.current_step]
        
        # Set the light color
        self.light_component.set_light_color(color)
        self.light_component.modify()
        
        # Invalidate viewports to trigger re-render
        unreal.EditorLevelLibrary.editor_invalidate_viewports()
        
        unreal.log(f"Set light to {name}, waiting for render...")
        
        # Wait 10 frames for viewport to render
        self.frames_to_wait = 10
    
    def tick(self, delta_time):
        """Called every frame by Slate"""
        if self.frames_to_wait > 0:
            self.frames_to_wait -= 1
            return  # Still waiting
        
        if self.current_step < len(LIGHT_COLORS):
            # Take screenshot
            step_id, color, name = LIGHT_COLORS[self.current_step]
            output_path = os.path.join(OUTPUT_DIR, f"{step_id}.png")
            
            success = capture_editor_window(output_path)
            
            if success:
                unreal.log(f"✓ Captured {name} light: {output_path}")
            else:
                unreal.log_error(f"✗ Failed to capture {name}")
            
            # Move to next step
            self.current_step += 1
            self.set_next_color()
    
    def finish(self):
        """Clean up and finish"""
        if self.callback_handle:
            unreal.unregister_slate_post_tick_callback(self.callback_handle)
            self.callback_handle = None
        
        unreal.log("=" * 50)
        unreal.log("Light Color Test Complete!")
        unreal.log(f"Check images at: {OUTPUT_DIR}")
        unreal.log("=" * 50)

# Run the test
test = LightColorTest()
test.start()
