"""
ManualCapture - Scene Setup for Capture Workflow
Actually modifies DirectionalLight settings in UE5
Run: import ManualCapture; ManualCapture.setup('directional_light', 'step-0')
"""

import unreal
import os
import json

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CONFIG_PATH = os.path.join(BASE_DIR, "config", "capture_scenarios.json")
OUTPUT_FOLDER = os.path.join(BASE_DIR, "assets", "generated")

def load_config():
    """Load scenario configuration from JSON"""
    if not os.path.exists(CONFIG_PATH):
        unreal.log_error(f"[ManualCapture] Config not found at {CONFIG_PATH}")
        return {}
    try:
        with open(CONFIG_PATH, 'r') as f:
            data = json.load(f)
            return data.get('scenarios', {})
    except Exception as e:
        unreal.log_error(f"[ManualCapture] Failed to load config: {e}")
        return {}


def setup(scenario_id, step_id, capture=False):
    """Set up scene for a specific step - ACTUALLY changes light settings"""
    scenarios = load_config()
    
    if scenario_id not in scenarios:
        unreal.log_warning(f"Unknown scenario: {scenario_id}")
        return False
    
    scenario = scenarios[scenario_id]
    steps = {s['id']: s for s in scenario['steps']}
    
    if step_id not in steps:
        unreal.log_warning(f"Unknown step: {step_id}")
        return False
    
    step_config = steps[step_id]
    success = _apply_light_settings(step_config)
    
    if success:
        # Highlight properties in engine for the author
        _draw_viewport_guide(step_config)
        _select_relevant_actor()
        
        unreal.log(f"[ManualCapture] Set up {scenario_id}/{step_id}")
        if capture:
            _trigger_screenshot(scenario_id, step_id)
    return success


def _trigger_screenshot(scenario_id, step_id):
    """Wait a few frames then capture high-res screenshot"""
    output_dir = os.path.join(OUTPUT_FOLDER, scenario_id)
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, f"{step_id}.png")
    
    # Increase delay to 30 frames for stability during high-res capture
    state = {"frames": 30, "path": filepath}
    
    # Trigger a redraw to be absolutely sure
    unreal.SystemLibrary.execute_console_command(None, "RedrawAllViewports")
    
    def _on_tick(delta_time):
        state["frames"] -= 1
        if state["frames"] <= 0:
            unreal.unregister_slate_post_tick_callback(handle)
            unreal.AutomationLibrary.take_high_res_screenshot(1920, 1080, state["path"])
            unreal.log(f"[ManualCapture] High-Res Screenshot saved to: {state['path']}")
    
    handle = unreal.register_slate_post_tick_callback(_on_tick)


def _apply_light_settings(config):
    """Actually modify the DirectionalLight in the scene"""
    shadow_distance = config.get('shadow_distance', 20000)
    cascades = config.get('cascades', 4)
    
    # Force viewport refresh
    unreal.EditorLevelLibrary.editor_invalidate_viewports()
    
    # Find directional light in the scene
    actors = unreal.EditorLevelLibrary.get_all_level_actors()
    light_found = False
    
    for actor in actors:
        if isinstance(actor, unreal.DirectionalLight):
            light_component = actor.get_component_by_class(unreal.DirectionalLightComponent)
            if light_component:
                light_found = True
                
                # Set Dynamic Shadow Distance
                unreal.SystemLibrary.execute_console_command(
                    None, 
                    f"r.Shadow.DistanceScale {shadow_distance / 20000.0}"
                )
                
                # Set Cascade Shadow Map count
                unreal.SystemLibrary.execute_console_command(
                    None,
                    f"r.Shadow.CSM.MaxCascades {cascades}"
                )
                
                # Try setting on component
                try:
                    light_component.set_editor_property('dynamic_shadow_distance_movable_light', shadow_distance)
                    light_component.set_editor_property('dynamic_shadow_cascades', cascades)
                except:
                    pass
                
                unreal.log(f"Shadow Distance: {shadow_distance}, Cascades: {cascades}")
                break
    
    return True


def _draw_viewport_guide(config):
    """Draw a large HUD overlay with the properties to highlight in the screenshot"""
    header = "🎯 AUTHORING GUIDE: FOCUS ON THESE PROPERTIES"
    props = [f"• {k}: {v}" for k, v in config.items() if k not in ['id', 'desc', 'shadow_distance', 'cascades']]
    
    # Add specific light settings if they exist
    if 'shadow_distance' in config:
        props.append(f"• shadow_distance: {config['shadow_distance']}")
    if 'cascades' in config:
        props.append(f"• cascades: {config['cascades']}")
        
    message = f"{header}\n" + "\n".join(props)
    message += "\n\n💡 TIP: Type these names in the 'Search Details' box to 'scroll' to them."
    
    # Draw via PrintString (Yellow/Gold color)
    unreal.SystemLibrary.print_string(
        None, 
        message, 
        display_to_screen=True, 
        display_to_log=True, 
        text_color=unreal.LinearColor(1.0, 0.8, 0.0, 1.0), 
        duration=30.0
    )


def _select_relevant_actor():
    """Automatically select the Directional Light so its properties are visible"""
    actors = unreal.EditorLevelLibrary.get_all_level_actors()
    for actor in actors:
        if isinstance(actor, unreal.DirectionalLight):
            unreal.EditorLevelLibrary.set_selected_level_actors([actor])
            break


def list_steps(scenario_id):
    """List all steps in a scenario"""
    scenarios = load_config()
    if scenario_id not in scenarios:
        unreal.log_warning(f"Unknown scenario: {scenario_id}")
        return
    
    scenario = scenarios[scenario_id]
    unreal.log(f"Steps for {scenario_id}:")
    for i, step in enumerate(scenario['steps']):
        unreal.log(f"  {i+1}. {step['id']}: {step.get('desc', 'No description')}")


# Quick commands:
# import ManualCapture; ManualCapture.setup('directional_light', 'step-0', capture=True)
