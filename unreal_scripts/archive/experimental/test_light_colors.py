"""
Test script to demonstrate directional light color changes
This will set the light rotation and cycle through red, green, and blue colors
"""

import unreal
import sys
import os
import time

# Add paths for screenshot capture
experimental_dir = "c:/Users/Sam Deiter/Documents/GitHub/UE5ScenarioTracker/unreal_scripts/experimental"
if experimental_dir not in sys.path:
    sys.path.append(experimental_dir)

import importlib
import WindowsPrintScreen
importlib.reload(WindowsPrintScreen)

def test_light_colors():
    """Test directional light with different colors"""
    
    # Find the directional light in the scene
    all_actors = unreal.EditorLevelLibrary.get_all_level_actors()
    directional_light = None
    
    for actor in all_actors:
        if actor.get_class().get_name() == 'DirectionalLight':
            directional_light = actor
            break
    
    if not directional_light:
        unreal.log_error("No DirectionalLight found in scene!")
        return
    
    unreal.log(f"Found DirectionalLight: {directional_light.get_name()}")
    
    # Set the rotation
    rotation = unreal.Rotator(pitch=-19.835486, yaw=123.850138, roll=-180.0)
    directional_light.set_actor_rotation(rotation, False)
    unreal.log(f"Set rotation to: {rotation}")
    
    # Get the light component
    light_component = directional_light.get_component_by_class(unreal.DirectionalLightComponent)
    
    if not light_component:
        unreal.log_error("Could not get DirectionalLightComponent!")
        return
    
    # Define test colors
    colors = {
        'red': unreal.LinearColor(1.0, 0.0, 0.0, 1.0),
        'green': unreal.LinearColor(0.0, 1.0, 0.0, 1.0),
        'blue': unreal.LinearColor(0.0, 0.0, 1.0, 1.0)
    }
    
    # Test each color
    output_dir = "C:/temp/light_test"
    os.makedirs(output_dir, exist_ok=True)
    
    for color_name, color_value in colors.items():
        unreal.log(f"Setting light color to: {color_name}")
        
        # Set the light color
        light_component.set_light_color(color_value)
        
        # Force property change notification
        light_component.modify()
        light_component.mark_render_state_dirty()
        
        # Multiple viewport refresh methods to ensure update
        unreal.SystemLibrary.execute_console_command(None, "r.Invalidate")
        time.sleep(0.2)
        
        # Force viewport redraw
        unreal.SystemLibrary.execute_console_command(None, "RedrawViewports")
        time.sleep(0.2)
        
        # Force lighting rebuild (may help with some lighting changes)
        unreal.SystemLibrary.execute_console_command(None, "BuildLighting")
        time.sleep(0.5)
        
        # Capture screenshot
        screenshot_path = os.path.join(output_dir, f"light_{color_name}.png")
        success = WindowsPrintScreen.capture_editor_window(screenshot_path)
        
        if success:
            unreal.log(f"✓ Captured {color_name} screenshot: {screenshot_path}")
        else:
            unreal.log_warning(f"✗ Failed to capture {color_name} screenshot")
    
    unreal.log("=" * 60)
    unreal.log("Test complete! Check screenshots at: C:/temp/light_test")
    unreal.log("=" * 60)

# Run the test
if __name__ == '__main__':
    test_light_colors()
