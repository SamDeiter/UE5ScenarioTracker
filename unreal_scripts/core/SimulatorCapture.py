"""
SimulatorCapture - Captures FULL EDITOR screenshots for Training Simulator
Outputs: simulator/screenshots/{scenario}/{step}.png

Usage in UE5 Python console:
    import SimulatorCapture; SimulatorCapture.go()

This script captures the ENTIRE Unreal Editor window (including Outliner,
Details panel, viewport) - not just the viewport - because the training
simulator uses screenshot overlays with HTML positioned on top.
"""

import unreal
import os
import time
import subprocess

# Output paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUTPUT_FOLDER = os.path.join(BASE_DIR, "simulator", "screenshots")

# Scenario configurations
# Each step defines the property values to set before capturing
SCENARIOS = {
    "directional_light": {
        "actor": "DirectionalLight",
        "steps": [
            # Step 1: Broken state (shadows cut off at 50m)
            {
                "id": "step-1",
                "shadow_distance": 5000,
                "cascades": 4,
                "note": "Shadows cut off at 50m"
            },
            # Step 2: Extended but blocky (distance increased, cascades same)
            {
                "id": "step-2",
                "shadow_distance": 50000,
                "cascades": 4,
                "note": "Shadows extended but blocky"
            },
            # Step 3: Fixed (distance + cascades increased)
            {
                "id": "step-3",
                "shadow_distance": 50000,
                "cascades": 8,
                "note": "Quality shadows to 500m"
            },
            # Conclusion
            {
                "id": "conclusion",
                "shadow_distance": 50000,
                "cascades": 8,
                "note": "Final state"
            },
        ]
    }
}

# Capture state
_state = {
    "steps": [],
    "current": 0,
    "output_dir": "",
    "scenario": "",
    "actor": None,
    "in_progress": False,
    "wait_frames": 0,
    "tick_handle": None
}


def go(scenario="directional_light"):
    """Start automated full-editor capture sequence"""
    global _state
    
    if scenario not in SCENARIOS:
        unreal.log_error(f"[SimulatorCapture] Unknown scenario: {scenario}")
        return
    
    if _state["in_progress"]:
        unreal.log_warning("[SimulatorCapture] Already in progress!")
        return
    
    config = SCENARIOS[scenario]
    output_dir = os.path.join(OUTPUT_FOLDER, scenario)
    os.makedirs(output_dir, exist_ok=True)
    
    # Find the target actor
    actor = _find_actor(config["actor"])
    if not actor:
        unreal.log_error(f"[SimulatorCapture] Actor not found: {config['actor']}")
        return
    
    # Select the actor so Details panel shows its properties
    unreal.EditorLevelLibrary.set_selected_level_actors([actor])
    
    _state["steps"] = config["steps"].copy()
    _state["current"] = 0
    _state["output_dir"] = output_dir
    _state["scenario"] = scenario
    _state["actor"] = actor
    _state["in_progress"] = True
    _state["wait_frames"] = 60  # Wait 1 sec for selection to register
    
    unreal.log(f"\n{'='*60}")
    unreal.log(f"📸 SimulatorCapture: Starting {scenario}")
    unreal.log(f"   Output: {output_dir}")
    unreal.log(f"   Steps: {len(_state['steps'])}")
    unreal.log(f"{'='*60}\n")
    
    _state["tick_handle"] = unreal.register_slate_post_tick_callback(_on_tick)


def _on_tick(delta_time):
    """Frame callback - sequences async captures"""
    global _state
    
    if not _state["in_progress"]:
        return
    
    # Wait between operations
    if _state["wait_frames"] > 0:
        _state["wait_frames"] -= 1
        return
    
    # Check if done
    if _state["current"] >= len(_state["steps"]):
        _state["in_progress"] = False
        if _state["tick_handle"]:
            unreal.unregister_slate_post_tick_callback(_state["tick_handle"])
            _state["tick_handle"] = None
        unreal.log(f"\n{'='*60}")
        unreal.log(f"✅ SimulatorCapture Complete!")
        unreal.log(f"   Saved {len(_state['steps'])} screenshots to:")
        unreal.log(f"   {_state['output_dir']}")
        unreal.log(f"{'='*60}\n")
        return
    
    step = _state["steps"][_state["current"]]
    
    # Configure lighting for this step
    _apply_step_values(step)
    
    # Wait a few frames for viewport to update
    unreal.SystemLibrary.execute_console_command(None, "RedrawAllViewports")
    
    # Capture full editor window
    filepath = os.path.join(_state["output_dir"], f"{step['id']}.png")
    _capture_editor_window(filepath)
    
    unreal.log(f"   [{_state['current']+1}/{len(_state['steps'])}] {step['id']}.png - {step.get('note', '')}")
    
    _state["current"] += 1
    _state["wait_frames"] = 90  # Wait 1.5 sec for screenshot to save


def _find_actor(actor_name):
    """Find actor in level by label"""
    actors = unreal.EditorLevelLibrary.get_all_level_actors()
    for actor in actors:
        if actor.get_actor_label() == actor_name:
            return actor
        # Also check class name
        if actor_name in actor.get_class().get_name():
            return actor
    return None


def _apply_step_values(step):
    """Apply property values for this step by setting actor component properties"""
    actor = _state["actor"]
    
    if not actor:
        unreal.log_warning("[SimulatorCapture] No actor to apply values to")
        return
    
    # Get the light component from the DirectionalLight actor
    light_component = actor.get_component_by_class(unreal.DirectionalLightComponent)
    
    if not light_component:
        unreal.log_warning("[SimulatorCapture] No DirectionalLightComponent found")
        return
    
    try:
        # Set Dynamic Shadow Distance (Movable Light)
        if "shadow_distance" in step:
            light_component.set_editor_property("dynamic_shadow_distance_movable_light", float(step["shadow_distance"]))
            unreal.log(f"      → Set shadow distance: {step['shadow_distance']}")
        
        # Set Num Dynamic Shadow Cascades
        if "cascades" in step:
            light_component.set_editor_property("dynamic_shadow_cascades", int(step["cascades"]))
            unreal.log(f"      → Set cascades: {step['cascades']}")
            
    except Exception as e:
        unreal.log_error(f"[SimulatorCapture] Failed to set properties: {e}")


def _capture_editor_window(filepath):
    """Capture the full Unreal Editor window using Windows API"""
    # PowerShell script for window capture
    ps_script = f'''
Add-Type -AssemblyName System.Windows.Forms
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Drawing;
using System.Drawing.Imaging;
using System.Text;
using System.Threading;
public class EditorCapture {{
    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);
    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);
    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);
    [DllImport("user32.dll")]
    public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {{ public int Left, Top, Right, Bottom; }}
    private static IntPtr hwnd = IntPtr.Zero;
    private static bool Callback(IntPtr h, IntPtr l) {{
        if (!IsWindowVisible(h)) return true;
        StringBuilder sb = new StringBuilder(256);
        GetWindowText(h, sb, 256);
        string t = sb.ToString();
        if (t.Contains("Unreal Editor") && !t.Contains("Blueprint") && !t.Contains("Widget")) {{
            hwnd = h;
            return false;
        }}
        return true;
    }}
    public static void Capture(string path) {{
        hwnd = IntPtr.Zero;
        EnumWindows(Callback, IntPtr.Zero);
        if (hwnd == IntPtr.Zero) {{ Console.WriteLine("ERROR: Window not found"); return; }}
        SetForegroundWindow(hwnd);
        Thread.Sleep(50);
        RECT r;
        GetWindowRect(hwnd, out r);
        int w = r.Right - r.Left;
        int h = r.Bottom - r.Top;
        using (Bitmap b = new Bitmap(w, h)) {{
            using (Graphics g = Graphics.FromImage(b)) {{
                g.CopyFromScreen(r.Left, r.Top, 0, 0, new Size(w, h));
            }}
            b.Save(path, ImageFormat.Png);
        }}
    }}
}}
"@ -ReferencedAssemblies System.Drawing
[EditorCapture]::Capture("{filepath.replace(chr(92), '/')}")
'''
    
    try:
        startupinfo = subprocess.STARTUPINFO()
        startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        startupinfo.wShowWindow = 0  # SW_HIDE
        
        result = subprocess.run(
            ["powershell", "-ExecutionPolicy", "Bypass", "-Command", ps_script],
            capture_output=True, text=True, timeout=10,
            startupinfo=startupinfo
        )
        if result.returncode != 0:
            unreal.log_error(f"[SimulatorCapture] Error: {result.stderr}")
    except Exception as e:
        unreal.log_error(f"[SimulatorCapture] Capture failed: {e}")


def stop():
    """Stop capture in progress"""
    global _state
    if _state["in_progress"]:
        _state["in_progress"] = False
        if _state["tick_handle"]:
            unreal.unregister_slate_post_tick_callback(_state["tick_handle"])
            _state["tick_handle"] = None
        unreal.log("[SimulatorCapture] Stopped.")


def single(scenario, step_id):
    """Capture a single step"""
    if scenario not in SCENARIOS:
        unreal.log_error(f"Unknown scenario: {scenario}")
        return
    
    config = SCENARIOS[scenario]
    steps_dict = {s["id"]: s for s in config["steps"]}
    
    if step_id not in steps_dict:
        unreal.log_error(f"Unknown step: {step_id}")
        return
    
    step = steps_dict[step_id]
    actor = _find_actor(config["actor"])
    if actor:
        unreal.EditorLevelLibrary.set_selected_level_actors([actor])
    
    _apply_step_values(step)
    unreal.SystemLibrary.execute_console_command(None, "RedrawAllViewports")
    
    output_dir = os.path.join(OUTPUT_FOLDER, scenario)
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, f"{step_id}.png")
    
    # Brief delay then capture
    import time
    time.sleep(0.5)
    _capture_editor_window(filepath)
    
    unreal.log(f"✅ Captured: {filepath}")


# === USAGE ===
# import SimulatorCapture; SimulatorCapture.go()                      # Capture all steps
# import SimulatorCapture; SimulatorCapture.single('directional_light', 'step-1')  # One step
# import SimulatorCapture; SimulatorCapture.stop()                    # Stop if needed
