"""
ue5_init.py
Run this script ONCE at editor startup to add the custom scripts directory to Python's path.

Usage (from UE5 Output Log or Project Settings):
1. Go to Edit > Project Settings > Plugins > Python
2. Add this file to "Startup Scripts" to run automatically on editor load.

OR run manually:
  py "C:/Users/Sam Deiter/Documents/GitHub/UE5ScenarioTracker/unreal_scripts/core/ue5_init.py"
"""
import sys
import os
import unreal

# --- Configuration ---
# Update this path if your project moves
SCRIPTS_DIR = r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\core"

def init_python_paths():
    """Adds the custom scripts directory to sys.path if not already present."""
    if SCRIPTS_DIR not in sys.path:
        sys.path.insert(0, SCRIPTS_DIR)
        unreal.log(f"[UE5_Init] Added to sys.path: {SCRIPTS_DIR}")
    else:
        unreal.log(f"[UE5_Init] Path already exists: {SCRIPTS_DIR}")
    
    # Force reload modules to pick up any changes
    import importlib
    
    # Clear cached modules first
    modules_to_reload = ['CaptureService', 'bp_capture_bridge', 'ue_actions', 'action_dispatcher']
    for mod_name in modules_to_reload:
        if mod_name in sys.modules:
            del sys.modules[mod_name]
            unreal.log(f"[UE5_Init] Cleared cached module: {mod_name}")
    
    # Now import fresh
    try:
        import CaptureService
        import bp_capture_bridge
        import ue_actions
        unreal.log("[UE5_Init] ✅ All capture modules loaded successfully!")
    except ImportError as e:
        unreal.log_error(f"[UE5_Init] ❌ Failed to import module: {e}")

# Run on import
init_python_paths()
