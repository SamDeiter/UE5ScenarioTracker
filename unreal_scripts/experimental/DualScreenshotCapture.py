"""
Dual Screenshot Capture for Unreal Engine
Captures both clean viewport scenes and full editor UI
"""

import unreal
import os
import time


class DualScreenshotCapture:
    """Captures both viewport-only and full UI screenshots"""
    
    def __init__(self):
        self.automation_lib = unreal.AutomationLibrary()
        
    def capture_both(self, output_dir, filename, resolution=(1280, 720)):
        """
        Capture both viewport and UI screenshots
        
        Args:
            output_dir (str): Directory to save screenshots
            filename (str): Base filename (without extension)
            resolution (tuple): Resolution for viewport screenshot
            
        Returns:
            dict: Paths to both screenshots
        """
        os.makedirs(output_dir, exist_ok=True)
        
        paths = {}
        
        # 1. Capture clean viewport scene
        viewport_path = self._capture_viewport(output_dir, f"{filename}_scene", resolution)
        paths['viewport'] = viewport_path
        
        # Small delay between captures
        time.sleep(1.0)
        
        # 2. Capture full editor UI
        ui_path = self._capture_ui(output_dir, f"{filename}_ui")
        paths['ui'] = ui_path
        
        return paths
    
    def _capture_viewport(self, output_dir, filename, resolution):
        """Capture clean viewport using HighResShot"""
        full_path = os.path.join(output_dir, f"{filename}.png")
        
        unreal.log(f"Capturing viewport: {full_path}")
        
        # Hide UI elements
        self._hide_ui_elements()
        
        # Set resolution
        unreal.SystemLibrary.execute_console_command(
            None,
            f"r.SetRes {resolution[0]}x{resolution[1]}"
        )
        
        time.sleep(1.0)
        
        # Execute HighResShot
        screenshot_cmd = f"HighResShot {resolution[0]}x{resolution[1]}"
        unreal.log(f"Executing: {screenshot_cmd}")
        unreal.SystemLibrary.execute_console_command(None, screenshot_cmd)
        
        # Wait for screenshot to appear in temp folder
        project_dir = unreal.SystemLibrary.get_project_directory()
        temp_path = os.path.join(project_dir, "Saved", "Screenshots", "WindowsEditor")
        
        # Wait up to 45 seconds (HighResShot is VERY async)
        max_wait = 45
        wait_interval = 1.0
        elapsed = 0
        found_file = None
        
        unreal.log(f"Waiting for screenshot in: {temp_path}")
        
        while elapsed < max_wait:
            if os.path.exists(temp_path):
                png_files = [f for f in os.listdir(temp_path) if f.endswith('.png')]
                if png_files:
                    # Get most recently modified
                    png_files_full = [os.path.join(temp_path, f) for f in png_files]
                    png_files_full.sort(key=os.path.getmtime, reverse=True)
                    found_file = png_files_full[0]
                    
                    # Verify file size is non-zero and stable
                    time.sleep(0.5)
                    if os.path.exists(found_file) and os.path.getsize(found_file) > 0:
                        break
            
            time.sleep(wait_interval)
            elapsed += wait_interval
            
            if elapsed % 5 == 0:
                unreal.log(f"  Waiting... {int(elapsed)}s elapsed")
        
        if found_file and os.path.exists(found_file):
            # Move to target location
            import shutil
            shutil.move(found_file, full_path)
            unreal.log(f"✓ Viewport screenshot saved: {full_path}")
            return full_path
        else:
            unreal.log_warning(f"✗ Viewport screenshot timed out: {full_path}")
            return None
    
    def _capture_ui(self, output_dir, filename):
        """Capture full editor UI using Windows screenshot"""
        full_path = os.path.join(output_dir, f"{filename}.png")
        
        unreal.log(f"Capturing UI: {full_path}")
        
        try:
            # Use PIL and pyautogui for Windows screenshot
            import pyautogui
            from PIL import ImageGrab
            
            # Find Unreal Editor window
            import pygetwindow as gw
            
            # Get Unreal Editor window
            windows = gw.getWindowsWithTitle("Unreal Editor")
            
            if windows:
                win = windows[0]
                
                # Bring window to front
                win.activate()
                time.sleep(0.5)
                
                # Capture window region
                screenshot = ImageGrab.grab(bbox=(
                    win.left,
                    win.top,
                    win.right,
                    win.bottom
                ))
                
                screenshot.save(full_path)
                unreal.log(f"✓ UI screenshot saved: {full_path}")
                return full_path
            else:
                unreal.log_warning("Could not find Unreal Editor window")
                return None
                
        except ImportError as e:
            unreal.log_error(f"Missing required Python packages for UI capture: {e}")
            unreal.log_error("Install: pip install pyautogui pillow pygetwindow")
            return None
        except Exception as e:
            unreal.log_error(f"UI capture failed: {e}")
            return None
    
    def _hide_ui_elements(self):
        """Hide UI elements for clean viewport screenshots"""
        commands = [
            "showflag.hud 0",
            "showflag.selection 0",
            "showflag.grid 0",
            "showflag.bounds 0",
            "showflag.visualizelightculling 0",
        ]
        
        for cmd in commands:
            unreal.SystemLibrary.execute_console_command(None, cmd)
