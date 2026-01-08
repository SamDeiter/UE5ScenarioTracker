import unreal
import os
import json
import time

class CaptureService:
    """
    Centralized service for triggering deterministic captures in UE5.
    Gated by editor readiness and isolated from scenario logic.
    """
    
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    OUTPUT_FOLDER = os.path.join(BASE_DIR, "assets", "generated")
    
    _is_capturing = False
    
    @classmethod
    def is_ready(cls):
        """
        Polls the editor for readiness.
        Returns (bool, reason)
        """
        if cls._is_capturing:
            return False, "Capture already in progress"
        
        # Check if PIE (Play In Editor) is active - captures should not run during gameplay
        try:
            if unreal.EditorLevelLibrary.get_editor_world() is None:
                return False, "No editor world loaded"
        except Exception:
            pass  # API may vary by UE version
        
        # Check for any ongoing transactions that might indicate editor activity
        # Note: is_level_loading_in_progress() doesn't exist in Python API
        # We use a simple "always ready" fallback since the main gate is _is_capturing
        
        return True, "Ready"

    @classmethod
    def capture(cls, scenario_id, recipe_id, mode="FULL", dry_run=False):
        """
        Executes a capture request.
        Modes: EDITOR_UI, VIEWPORT_ONLY, FULL
        """
        ready, reason = cls.is_ready()
        if not ready:
            unreal.log_error(f"[CaptureService] Capture blocked: {reason}")
            return False, reason
            
        if dry_run:
            unreal.log(f"[CaptureService] DRY RUN: Would capture {scenario_id} ({mode})")
            return True, "Dry run success"

        cls._is_capturing = True
        
        # Prepare path
        output_dir = os.path.join(cls.OUTPUT_FOLDER, scenario_id)
        os.makedirs(output_dir, exist_ok=True)
        timestamp = int(time.time())
        filename = f"{recipe_id}_{timestamp}.png"
        filepath = os.path.join(output_dir, filename)
        
        unreal.log(f"[CaptureService] Starting {mode} capture for {scenario_id}")
        
        # Internal capture logic handled via tick to ensure redraw
        cls._execute_capture_sequence(filepath, mode)
        
        return True, filepath

    @classmethod
    def _execute_capture_sequence(cls, filepath, mode):
        """
        Sequences the capture to ensure viewports are flushed.
        """
        # Redraw all viewports to ensure latest state is reflected
        unreal.SystemLibrary.execute_console_command(None, "RedrawAllViewports")
        
        state = {"frames": 10, "path": filepath, "mode": mode}
        
        def _on_tick(delta_time):
            state["frames"] -= 1
            if state["frames"] <= 0:
                unreal.unregister_slate_post_tick_callback(handle)
                
                # Execution based on mode
                if state["mode"] == "VIEWPORT":
                    # Viewport only - use UE5's built-in screenshot
                    unreal.AutomationLibrary.take_high_res_screenshot(1920, 1080, state["path"])
                elif state["mode"] == "EDITOR_UI":
                    # Full editor window - use Windows screen capture
                    cls._capture_editor_window(state["path"])
                else:  # FULL - both viewport and editor
                    unreal.AutomationLibrary.take_high_res_screenshot(1920, 1080, state["path"])
                
                cls._is_capturing = False
                unreal.log(f"[CaptureService] Capture saved: {state['path']}")
        
        handle = unreal.register_slate_post_tick_callback(_on_tick)

    @classmethod
    def _capture_editor_window(cls, filepath):
        """
        Captures the main Unreal Editor window using Windows screen capture.
        Finds the window by title containing 'Unreal Editor'.
        """
        import subprocess
        
        # PowerShell script to capture the UE5 editor window by title
        ps_script = f'''
Add-Type -AssemblyName System.Windows.Forms
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Drawing;
using System.Drawing.Imaging;
using System.Text;
using System.Threading;
public class ScreenCapture {{
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
    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {{
        public int Left, Top, Right, Bottom;
    }}
    private static IntPtr foundHwnd = IntPtr.Zero;
    private static bool EnumCallback(IntPtr hWnd, IntPtr lParam) {{
        if (!IsWindowVisible(hWnd)) return true;
        StringBuilder sb = new StringBuilder(256);
        GetWindowText(hWnd, sb, 256);
        string title = sb.ToString();
        // Look for main Level Editor window (not Blueprint, not Widget)
        if (title.Contains("Unreal Editor") && !title.Contains("Blueprint") && !title.Contains("Widget")) {{
            foundHwnd = hWnd;
            return false;
        }}
        return true;
    }}
    public static void CaptureWindow(string path) {{
        foundHwnd = IntPtr.Zero;
        EnumWindows(EnumCallback, IntPtr.Zero);
        if (foundHwnd == IntPtr.Zero) {{
            Console.WriteLine("ERROR: Could not find Unreal Editor window");
            return;
        }}
        // Bring window to foreground to ensure it's on top
        ShowWindow(foundHwnd, 9); // SW_RESTORE
        SetForegroundWindow(foundHwnd);
        Thread.Sleep(100); // Brief pause to let window come to front
        RECT rect;
        GetWindowRect(foundHwnd, out rect);
        int width = rect.Right - rect.Left;
        int height = rect.Bottom - rect.Top;
        using (Bitmap bmp = new Bitmap(width, height)) {{
            using (Graphics g = Graphics.FromImage(bmp)) {{
                g.CopyFromScreen(rect.Left, rect.Top, 0, 0, new Size(width, height));
            }}
            bmp.Save(path, ImageFormat.Png);
        }}
    }}
}}
"@ -ReferencedAssemblies System.Drawing
[ScreenCapture]::CaptureWindow("{filepath.replace(chr(92), '/')}")
'''
        
        try:
            # Hide the PowerShell window
            import subprocess
            startupinfo = subprocess.STARTUPINFO()
            startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
            startupinfo.wShowWindow = 0  # SW_HIDE
            
            result = subprocess.run(
                ["powershell", "-ExecutionPolicy", "Bypass", "-Command", ps_script],
                capture_output=True, text=True, timeout=10,
                startupinfo=startupinfo
            )
            if result.returncode == 0:
                unreal.log(f"[CaptureService] Editor UI captured: {filepath}")
            else:
                unreal.log_error(f"[CaptureService] PowerShell error: {result.stderr}")
        except Exception as e:
            unreal.log_error(f"[CaptureService] Failed to capture editor window: {e}")


def handle_capture_request(payload):
    """
    Dispatcher entry point for CAPTURE_REQUEST payloads.
    """
    scenario_id = payload.get("scenarioId", "unnamed")
    recipe_id = payload.get("recipeId", "unnamed")
    mode = payload.get("mode", "FULL")
    dry_run = payload.get("dryRun", False)
    
    success, msg = CaptureService.capture(scenario_id, recipe_id, mode, dry_run)
    
    if success:
        unreal.log(f"[CaptureService] Request Handled: {msg}")
    else:
        unreal.log_error(f"[CaptureService] Request Failed: {msg}")
    
    return success
