"""
SimpleCapture - Fully Automated Screenshot Capture for UE5
Uses tick callbacks to properly sequence async screenshots

Usage: import SimpleCapture; SimpleCapture.go()
"""

import unreal
import os
import time

OUTPUT_FOLDER = r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\assets\generated"

SCENARIOS = {
    "directional_light": [
        {"id": "step-0", "shadow_distance": 5000, "cascades": 4},
        {"id": "step-1", "shadow_distance": 5000, "cascades": 4},
        {"id": "step-inv-1", "shadow_distance": 5000, "cascades": 4},
        {"id": "step-2", "shadow_distance": 50000, "cascades": 4},
        {"id": "step-3", "shadow_distance": 50000, "cascades": 8},
        {"id": "step-ver-1", "shadow_distance": 50000, "cascades": 8},
        {"id": "conclusion", "shadow_distance": 50000, "cascades": 8},
    ]
}

# Global state for async capture
_capture_state = {
    "steps": [],
    "current": 0,
    "output_dir": "",
    "scenario": "",
    "in_progress": False,
    "wait_frames": 0
}


def go(scenario="directional_light"):
    """Start automated capture - uses tick callback for proper async handling"""
    if scenario not in SCENARIOS:
        unreal.log_error(f"Unknown scenario: {scenario}")
        return
    
    if _capture_state["in_progress"]:
        unreal.log_warning("Capture already in progress!")
        return
    
    output_dir = os.path.join(OUTPUT_FOLDER, scenario)
    os.makedirs(output_dir, exist_ok=True)
    
    _capture_state["steps"] = SCENARIOS[scenario].copy()
    _capture_state["current"] = 0
    _capture_state["output_dir"] = output_dir
    _capture_state["scenario"] = scenario
    _capture_state["in_progress"] = True
    _capture_state["wait_frames"] = 0
    
    unreal.log(f"\n{'='*50}")
    unreal.log(f"🚀 Starting automated capture: {scenario}")
    unreal.log(f"Output: {output_dir}")
    unreal.log(f"{'='*50}\n")
    
    # Register tick callback
    unreal.register_slate_post_tick_callback(_on_tick)
    unreal.log("Registered tick callback - capturing...")


def _on_tick(delta_time):
    """Called every frame - handles async screenshot sequencing"""
    global _capture_state
    
    if not _capture_state["in_progress"]:
        return
    
    # Wait some frames between operations
    if _capture_state["wait_frames"] > 0:
        _capture_state["wait_frames"] -= 1
        return
    
    steps = _capture_state["steps"]
    current = _capture_state["current"]
    
    if current >= len(steps):
        # All done!
        _capture_state["in_progress"] = False
        unreal.unregister_slate_post_tick_callback(_on_tick)
        unreal.log(f"\n{'='*50}")
        unreal.log(f"🎉 Done! Captured {len(steps)} screenshots")
        unreal.log(f"Location: {_capture_state['output_dir']}")
        unreal.log(f"{'='*50}\n")
        return
    
    step = steps[current]
    
    # Set up lighting
    _setup_lighting(step['shadow_distance'], step['cascades'])
    
    # Take screenshot
    filepath = os.path.join(_capture_state["output_dir"], f"{step['id']}.png")
    unreal.AutomationLibrary.take_high_res_screenshot(1920, 1080, filepath)
    
    unreal.log(f"[{current+1}/{len(steps)}] Captured: {step['id']}.png")
    
    # Move to next step, wait 60 frames (~1 second) for screenshot to save
    _capture_state["current"] += 1
    _capture_state["wait_frames"] = 60


def step(scenario, step_id):
    """Capture just one step"""
    if scenario not in SCENARIOS:
        unreal.log_error(f"Unknown scenario: {scenario}")
        return
    
    steps = {s['id']: s for s in SCENARIOS[scenario]}
    if step_id not in steps:
        unreal.log_error(f"Unknown step: {step_id}")
        return
    
    step_config = steps[step_id]
    output_dir = os.path.join(OUTPUT_FOLDER, scenario)
    os.makedirs(output_dir, exist_ok=True)
    
    _setup_lighting(step_config['shadow_distance'], step_config['cascades'])
    
    filepath = os.path.join(output_dir, f"{step_id}.png")
    unreal.AutomationLibrary.take_high_res_screenshot(1920, 1080, filepath)
    
    unreal.log(f"✓ Saved: {filepath}")


def _setup_lighting(shadow_distance, cascades):
    """Configure shadow settings"""
    unreal.SystemLibrary.execute_console_command(None, f"r.Shadow.DistanceScale {shadow_distance / 20000.0}")
    unreal.SystemLibrary.execute_console_command(None, f"r.Shadow.CSM.MaxCascades {cascades}")


def stop():
    """Stop capture in progress"""
    global _capture_state
    if _capture_state["in_progress"]:
        _capture_state["in_progress"] = False
        unreal.unregister_slate_post_tick_callback(_on_tick)
        unreal.log("Capture stopped.")


# === QUICK COMMANDS ===
# import SimpleCapture; SimpleCapture.go()           # Auto capture all
# import SimpleCapture; SimpleCapture.stop()         # Stop if needed
# import SimpleCapture; SimpleCapture.step('directional_light', 'step-0')  # One step
