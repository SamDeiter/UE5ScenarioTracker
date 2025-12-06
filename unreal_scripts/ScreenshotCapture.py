"""
Screenshot Capture for Unreal Engine Scenario Automation

Handles high-quality screenshot capture for scenario steps.
"""

import unreal
import os
import time


class ScreenshotCapture:
    """Captures high-resolution screenshots from Unreal Engine"""
    
    def __init__(self):
        self.automation_lib = unreal.AutomationLibrary()
        
    def capture(self, output_path, filename, resolution=(1920, 1080)):
        """
        Capture a high-resolution screenshot
        
        Args:
            output_path (str): Directory to save screenshot
            filename (str): Base filename (without extension)
            resolution (tuple): (width, height) in pixels
            
        Returns:
            str: Full path to captured screenshot
        """
        # Ensure output directory exists
        os.makedirs(output_path, exist_ok=True)
        
        full_path = os.path.join(output_path, f"{filename}.png")
        
        unreal.log(f"Capturing screenshot: {full_path}")
        unreal.log(f"Resolution: {resolution[0]}x{resolution[1]}")
        
        # Disable UI overlays
        self._hide_ui_elements()
        
        # Set resolution
        unreal.SystemLibrary.execute_console_command(
            None,
            f"r.SetRes {resolution[0]}x{resolution[1]}"
        )
        
        # Wait for frame to stabilize (increased from 0.5s)
        time.sleep(2.0)
        
        # Capture high-res screenshot
        self.automation_lib.take_high_res_screenshot(
            resolution[0],
            resolution[1],
            full_path
        )
        
        # Wait for screenshot to complete (increased from 1.0s)
        time.sleep(5.0)
        
        unreal.log(f"Screenshot saved: {full_path}")
        
        return full_path
    
    def _hide_ui_elements(self):
        """Hide UI elements for clean screenshots"""
        commands = [
            "showflag.hud 0",
            "showflag.selection 0",
            "showflag.grid 0",
            "showflag.bounds 0",
            "showflag.visualizelightculling 0",
        ]
        
        for cmd in commands:
            unreal.SystemLibrary.execute_console_command(None, cmd)
    
    def capture_multiple(self, output_path, base_filename, count=1, resolution=(1920, 1080)):
        """
        Capture multiple screenshots (e.g., for different angles)
        
        Args:
            output_path (str): Directory to save screenshots
            base_filename (str): Base filename pattern
            count (int): Number of screenshots to capture
            resolution (tuple): Resolution for each capture
            
        Returns:
            list: Paths to all captured screenshots
        """
        paths = []
        
        for i in range(count):
            filename = f"{base_filename}_{i+1}" if count > 1 else base_filename
            path = self.capture(output_path, filename, resolution)
            paths.append(path)
            
            # Small delay between captures
            if i < count - 1:
                time.sleep(0.2)
        
        return paths
