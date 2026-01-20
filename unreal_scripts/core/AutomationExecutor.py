import unreal
import json
import os
import sys

# Ensure the current directory is in sys.path for modular imports
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

import action_dispatcher
import CaptureService
import importlib

# Force reload for development iterations
importlib.reload(action_dispatcher)
importlib.reload(CaptureService)

def is_editor_ready():
    """
    Blocks or returns False if the editor is busy (loading, compile, etc).
    Essential for flaky-free automation.
    """
    if unreal.EditorLevelLibrary.is_level_loading_in_progress():
        unreal.log_warning("[AutomationExecutor] Editor not ready: Level loading in progress.")
        return False
    
    # Optional: Check for shader compilation via console command/query if possible
    # For now, we rely on level load status.
    
    return True

def run_recipe(json_payload):
    """
    Primary entry point for Remote Execution (JSON payload).
    Supports both direct dictionaries and stringified JSON.
    """
    if not is_editor_ready():
        unreal.log_error("[AutomationExecutor] Aborting recipe: Editor is NOT ready.")
        return

    unreal.log("[AutomationExecutor] run_recipe triggered via JSON payload.")
    
    actions = []
    scenario_id = "unknown"
    if isinstance(json_payload, str):
        try:
            data = json.loads(json_payload)
            actions = data.get("actions", [])
            scenario_id = data.get("scenario", "unknown")
        except Exception as e:
            unreal.log_error(f"[AutomationExecutor] Failed to parse JSON string: {str(e)}")
            return
    elif isinstance(json_payload, dict):
        actions = json_payload.get("actions", [])
        scenario_id = json_payload.get("scenario", "unknown")
    else:
        unreal.log_error(f"[AutomationExecutor] Unsupported payload type: {type(json_payload)}")
        return

    unreal.log(f"[TRACE] START Scenario: {scenario_id} ({len(actions)} actions)")

    # 1. Handle Direct Capture Requests
    # Payload format: { "type": "CAPTURE_REQUEST", "scenario": "...", "mode": "...", ... }
    # This is the ONLY entry point for captures.
    if isinstance(json_payload, dict) and json_payload.get("type") == "CAPTURE_REQUEST":
        CaptureService.handle_capture_request(json_payload)
        return
    elif isinstance(json_payload, str):
        try:
            data = json.loads(json_payload)
            if data.get("type") == "CAPTURE_REQUEST":
                CaptureService.handle_capture_request(data)
                return
        except: pass

    for index, action in enumerate(actions):
        unreal.log(f"[TRACE] [{scenario_id}] Action {index}: {action.get('type') or action.get('action')}")
        action_dispatcher.dispatch_action(action)
    
    unreal.log(f"[TRACE] END Scenario: {scenario_id}")

def execute_recipe(recipe_path: str):
    """
    Alternate entry point for loading recipes from a file path.
    Standardized per Senior Developer guide.
    """
    unreal.log(f"[AutomationExecutor] execute_recipe triggered for: {recipe_path}")
    
    if not os.path.exists(recipe_path):
        unreal.log_error(f"[AutomationExecutor] Recipe file not found: {recipe_path}")
        return

    try:
        with open(recipe_path, "r") as f:
            recipe = json.load(f)
        
        # Recipes might be step-specific or full scenario files
        # If it's a full scenario file (our current format), we might need more logic
        # but the standard guide implies a flat "actions" list.
        actions = recipe.get("actions", [])
        
        for action in actions:
            action_dispatcher.dispatch_action(action)
            
        unreal.log(f"[AutomationExecutor] Recipe execution complete for {recipe_path}.")
    except Exception as e:
        unreal.log_error(f"[AutomationExecutor] Error reading recipe file: {str(e)}")

# This allows calling from ActionRegistry.js via Remote Execution:
# import AutomationExecutor; AutomationExecutor.run_recipe({...})
