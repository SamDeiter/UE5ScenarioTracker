import unreal

def spawn_actor(action):
    """
    Spawns an actor of a given class at a location and rotation.
    """
    actor_class_path = action.get("class") or action.get("target_actor_class")
    if not actor_class_path:
        unreal.log_warning("[ue_actions] SPAWN_ACTOR: No class path provided.")
        return None

    # Resolve class
    actor_class = unreal.load_object(None, actor_class_path)
    if not actor_class:
        unreal.log_error(f"[ue_actions] SPAWN_ACTOR: Could not load class {actor_class_path}")
        return None

    location = unreal.Vector(*action.get("location", [0, 0, 0]))
    rotation = unreal.Rotator(*action.get("rotation", [0, 0, 0]))

    # Idempotency check: If an actor with this name already exists, return it.
    if "name" in action:
        actors = unreal.EditorLevelLibrary.get_all_level_actors()
        for a in actors:
            if a.get_actor_label() == action["name"]:
                unreal.log(f"[ue_actions] SPAWN_ACTOR: Actor '{action['name']}' already exists. Skipping spawn.")
                return a

    actor = unreal.EditorLevelLibrary.spawn_actor_from_class(
        actor_class,
        location,
        rotation
    )

    if actor and "name" in action:
        actor.set_actor_label(action["name"])
    
    unreal.log(f"[ue_actions] Spawned actor: {actor.get_actor_label() if actor else 'Failed'}")
    return actor

def set_property(action):
    """
    Standardized property setter using Reflection.
    """
    # Find target
    target = None
    actor_class_name = action.get("target_actor_class")
    
    # 1. Try finding by class in level if no specific instance is selected
    if actor_class_name:
        actors = unreal.EditorLevelLibrary.get_all_level_actors()
        for a in actors:
            if a.get_class().get_name() == actor_class_name or a.get_name().startswith(actor_class_name):
                target = a
                break
    
    # 2. Fallback to selection if target still None
    if not target:
        selected = unreal.EditorUtilityLibrary.get_selected_level_actors()
        if selected:
            target = selected[0]

    if not target:
        unreal.log_warning(f"[ue_actions] SET_PROPERTY: No target found for {action}")
        return

    # Handle component targeting
    component_name = action.get("component")
    if component_name:
        for comp in target.get_components_by_class(unreal.ActorComponent):
            if comp.get_name() == component_name or comp.get_class().get_name() == component_name:
                target = comp
                break
    
    prop = action.get("property")
    value = action.get("value")

    if prop is None or value is None:
        unreal.log_warning(f"[ue_actions] SET_PROPERTY: Missing property or value in {action}")
        return

    try:
        unreal.log(f"[ue_actions] Setting {target.get_name()}.{prop} = {value}")
        target.set_editor_property(prop, value)
    except Exception as e:
        unreal.log_error(f"[ue_actions] Failed to set property {prop}: {str(e)}")

def set_collision(action):
    """
    Configures collision response for a specific channel.
    """
    actors = unreal.EditorLevelLibrary.get_selected_level_actors()
    if not actors:
        unreal.log_warning("[ue_actions] SET_COLLISION: No actors selected.")
        return

    actor = actors[0]
    component = actor.get_component_by_class(unreal.PrimitiveComponent)
    if not component:
        unreal.log_warning(f"[ue_actions] SET_COLLISION: Actor {actor.get_name()} has no PrimitiveComponent.")
        return

    channel_str = action.get("channel", "ECC_Visibility")
    response_str = action.get("response", "ECR_Block")

    # Handle shortened strings (e.g., "Visibility" -> "ECC_Visibility")
    if not channel_str.startswith("ECC_"): channel_str = f"ECC_{channel_str}"
    if not response_str.startswith("ECR_"): response_str = f"ECR_{response_str}"

    try:
        channel = getattr(unreal.CollisionChannel, channel_str)
        response = getattr(unreal.CollisionResponse, response_str)
        component.set_collision_response_to_channel(channel, response)
        unreal.log(f"[ue_actions] Set collision on {actor.get_name()}: {channel_str} = {response_str}")
    except Exception as e:
        unreal.log_error(f"[ue_actions] SET_COLLISION failed: {str(e)}")

def frame_viewport(action):
    """
    Restores viewport camera to a saved bookmark position (0-9).
    
    Action schema:
    {
        "type": "FRAME_VIEWPORT",
        "bookmark": 1  // Number 0-9, recalls Ctrl+1 through Ctrl+0 saved positions
    }
    
    To save a bookmark in UE5:
    - Position camera where you want it
    - Press Ctrl+1 through Ctrl+0 to save to that slot
    """
    bookmark = action.get("bookmark", 0)
    
    if not isinstance(bookmark, int) or bookmark < 0 or bookmark > 9:
        unreal.log_warning(f"[ue_actions] FRAME_VIEWPORT: Invalid bookmark {bookmark}. Use 0-9.")
        return
    
    # Console command to recall camera bookmark
    cmd = f"CAMERA Bookmark {bookmark}"
    unreal.SystemLibrary.execute_console_command(None, cmd)
    unreal.log(f"[ue_actions] Restored camera to bookmark {bookmark}.")

def reset_editor_state(action):
    """
    Deterministic reset of the editor world.
    Deletes temporary actors and clears selection.
    """
    unreal.log("[ue_actions] Performing Deterministic Reset.")
    
    # 1. Delete spawned actors (heuristic: name tags or specific classes)
    actors = unreal.EditorLevelLibrary.get_all_level_actors()
    for a in actors:
        label = a.get_actor_label()
        if "SmokeTest" in label or "ScenarioTemp" in label:
            unreal.EditorLevelLibrary.destroy_actor(a)

    # 2. Clear selections
    unreal.EditorLevelLibrary.select_nothing()
    
    # 3. Reset viewport
    unreal.EditorLevelLibrary.set_level_viewport_camera_info(
        unreal.Vector(0, 0, 500),
        unreal.Rotator(0, -90, 0)
    )
    unreal.log("[ue_actions] Reset viewport and selections.")

def get_readiness(action):
    """
    Queries editor readiness for capture/execution.
    """
    import CaptureService
    ready, reason = CaptureService.CaptureService.is_ready()
    return {"ready": ready, "reason": reason}

def capture(action):
    """
    Triggers a capture via CaptureService.
    
    Action schema:
    {
        "type": "CAPTURE",
        "scenario_id": "directional_light",
        "step_id": "step-1",
        "mode": "VIEWPORT" | "EDITOR_UI" | "FULL",
        "dry_run": false
    }
    """
    import CaptureService
    
    scenario_id = action.get("scenario_id", "unknown")
    step_id = action.get("step_id", "unnamed")
    mode = action.get("mode", "VIEWPORT")
    dry_run = action.get("dry_run", False)
    
    unreal.log(f"[ue_actions] CAPTURE: scenario={scenario_id}, step={step_id}, mode={mode}")
    
    success, result = CaptureService.CaptureService.capture(
        scenario_id=scenario_id,
        recipe_id=step_id,
        mode=mode,
        dry_run=dry_run
    )
    
    if success:
        unreal.log(f"[ue_actions] CAPTURE complete: {result}")
    else:
        unreal.log_error(f"[ue_actions] CAPTURE failed: {result}")
    
    return {"success": success, "result": result}

def highlight_property(action):
    """
    Highlights a property in the Details panel by using the search functionality.
    
    Action schema:
    {
        "type": "HIGHLIGHT_PROPERTY",
        "property": "DynamicShadowDistanceMovableLight",
        "clear_after_ms": 0  // Optional: ms to wait before clearing search (0 = don't clear)
    }
    
    This uses keyboard simulation to:
    1. Focus the Details panel search (Ctrl+F)
    2. Type the property name to filter/highlight it
    """
    import subprocess
    import time
    
    property_name = action.get("property", "")
    clear_after_ms = action.get("clear_after_ms", 0)
    
    if not property_name:
        unreal.log_warning("[ue_actions] HIGHLIGHT_PROPERTY: No property name specified.")
        return
    
    unreal.log(f"[ue_actions] HIGHLIGHT_PROPERTY: Searching for '{property_name}'")
    
    # PowerShell script to send keystrokes
    # First Ctrl+F to open search, then type the property name
    ps_script = f'''
Add-Type -AssemblyName System.Windows.Forms
# Small delay to ensure Details panel is ready
Start-Sleep -Milliseconds 100
# Send Ctrl+F to open search in Details panel
[System.Windows.Forms.SendKeys]::SendWait("^f")
Start-Sleep -Milliseconds 200
# Clear any existing search text
[System.Windows.Forms.SendKeys]::SendWait("^a")
Start-Sleep -Milliseconds 50
# Type the property name
[System.Windows.Forms.SendKeys]::SendWait("{property_name}")
'''
    
    try:
        # Hide the PowerShell window
        startupinfo = subprocess.STARTUPINFO()
        startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        startupinfo.wShowWindow = 0  # SW_HIDE
        
        result = subprocess.run(
            ["powershell", "-ExecutionPolicy", "Bypass", "-Command", ps_script],
            capture_output=True, text=True, timeout=10,
            startupinfo=startupinfo
        )
        
        if result.returncode != 0:
            unreal.log_error(f"[ue_actions] HIGHLIGHT_PROPERTY failed: {result.stderr}")
            return
        
        unreal.log(f"[ue_actions] HIGHLIGHT_PROPERTY: Search activated for '{property_name}'")
        
        # Wait before clearing if requested
        if clear_after_ms > 0:
            time.sleep(clear_after_ms / 1000.0)
            # Clear the search by pressing Escape
            clear_script = '[System.Windows.Forms.SendKeys]::SendWait("{ESC}")'
            subprocess.run(
                ["powershell", "-ExecutionPolicy", "Bypass", "-Command", clear_script],
                capture_output=True, timeout=5,
                startupinfo=startupinfo
            )
            
    except Exception as e:
        unreal.log_error(f"[ue_actions] HIGHLIGHT_PROPERTY error: {e}")
