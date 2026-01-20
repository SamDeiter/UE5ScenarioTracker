import unreal
import ue_actions

ACTION_MAP = {
    "SPAWN_ACTOR": ue_actions.spawn_actor,
    "SET_PROPERTY": ue_actions.set_property,
    "SET_COLLISION": ue_actions.set_collision,
    "FRAME_VIEWPORT": ue_actions.frame_viewport,
    "RESET_EDITOR_STATE": ue_actions.reset_editor_state,
    "GET_READINESS": ue_actions.get_readiness,
    "CAPTURE": ue_actions.capture,
    "HIGHLIGHT_PROPERTY": ue_actions.highlight_property,
}

def dispatch_action(action: dict):
    """
    Routes an action dictionary to the appropriate handler.
    """
    action_type = action.get("type") or action.get("action")

    if not action_type:
        unreal.log_warning(f"[ActionDispatcher] Action missing type: {action}")
        return

    if action_type not in ACTION_MAP:
        unreal.log_error(f"[ActionDispatcher] Unknown action type: {action_type}")
        return

    handler = ACTION_MAP[action_type]
    try:
        handler(action)
    except Exception as e:
        unreal.log_error(f"[ActionDispatcher] Error executing {action_type}: {str(e)}")
