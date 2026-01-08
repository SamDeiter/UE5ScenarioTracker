"""
bp_capture_bridge.py
Blueprint-callable entry points for the Capture System.
These functions are designed to be invoked from "Execute Python Script" nodes in Blueprints/EUWs.
"""
import unreal
import json

# Import the core CaptureService
try:
    from CaptureService import CaptureService, handle_capture_request
except ImportError:
    # Fallback for direct execution context
    import sys
    import os
    script_dir = os.path.dirname(os.path.abspath(__file__))
    if script_dir not in sys.path:
        sys.path.insert(0, script_dir)
    from CaptureService import CaptureService, handle_capture_request


def get_capture_readiness():
    """
    Returns a JSON string indicating editor readiness for capture.
    Call from Blueprint: Execute Python Script -> "import bp_capture_bridge; bp_capture_bridge.get_capture_readiness()"
    
    Returns:
        str: JSON string like {"ready": true, "reason": "Ready"} or {"ready": false, "reason": "Level loading"}
    """
    ready, reason = CaptureService.is_ready()
    result = {"ready": ready, "reason": reason}
    unreal.log(f"[BP_Bridge] Readiness Check: {result}")
    return json.dumps(result)


def trigger_capture(scenario_id="BP_Manual", mode="FULL", dry_run=False):
    """
    Triggers a capture from Blueprint.
    Call from Blueprint: Execute Python Script -> "import bp_capture_bridge; bp_capture_bridge.trigger_capture('MyScenario', 'VIEWPORT')"
    
    Args:
        scenario_id (str): Identifier for the capture (used in file naming and logs).
        mode (str): "EDITOR_UI", "VIEWPORT", or "FULL".
        dry_run (bool): If True, logs the request but does not capture.
    
    Returns:
        str: JSON string with success status and message.
    """
    payload = {
        "scenarioId": scenario_id,
        "recipeId": "BP_Trigger",
        "mode": mode,
        "dryRun": dry_run
    }
    
    unreal.log(f"[BP_Bridge] Capture Request: {payload}")
    
    success = handle_capture_request(payload)
    
    result = {
        "success": success,
        "message": f"Capture {'simulated (dry run)' if dry_run else 'executed'}" if success else "Capture failed - check Output Log"
    }
    return json.dumps(result)


def get_capture_modes():
    """
    Returns the list of available capture modes for populating a ComboBox in the EUW.
    
    Returns:
        str: JSON array of mode strings.
    """
    modes = ["EDITOR_UI", "VIEWPORT", "FULL"]
    return json.dumps(modes)


# --- Direct Test Runners (for Output Log validation) ---
if __name__ == "__main__":
    print("--- BP Capture Bridge Self-Test ---")
    print(f"Readiness: {get_capture_readiness()}")
    print(f"Modes: {get_capture_modes()}")
    print(f"Dry Run Capture: {trigger_capture('SelfTest', 'FULL', True)}")
