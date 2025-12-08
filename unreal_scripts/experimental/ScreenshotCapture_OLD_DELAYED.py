"""
Screenshot Capture using HighResShot with unique filenames
Simple, reliable, uses incrementing counter to prevent overwrites
"""

import unreal
import os
import time


class ScreenshotCapture:
    """Captures high-resolution screenshots from Unreal Engine"""
    
    # Class-level counter to ensure unique filenames
    screenshot_counter = 0
    
    def __init__(self):
        pass
        
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
        
        # Small wait for UI to hide
        time.sleep(0.5)
        
        # Increment counter for unique temp filename
        ScreenshotCapture.screenshot_counter += 1
        temp_name = f"ScenarioShot{ScreenshotCapture.screenshot_counter:04d}"
        
        # Execute HighResShot with unique numbered filename
        resolution_str = f"{resolution[0]}x{resolution[1]}"
        cmd = f"HighResShot {resolution_str} filename={temp_name}"
        
        unreal.log(f"Executing: {cmd}")
        unreal.SystemLibrary.execute_console_command(None, cmd)
        
        # Wait for screenshot to appear
        project_dir = unreal.SystemLibrary.get_project_directory()
        temp_path = os.path.join(project_dir, "Saved", "Screenshots", "WindowsEditor")
        expected_file = os.path.join(temp_path, f"{temp_name}.png")
        
        unreal.log(f"Waiting for: {expected_file}")
        
        max_wait = 45
        wait_interval = 0.5
        elapsed = 0
        
        while elapsed < max_wait:
            if os.path.exists(expected_file):
                # Verify file is complete (size > 0 and stable)
                size1 = os.path.getsize(expected_file)
                if size1 > 0:
                    time.sleep(0.5)
                    size2 = os.path.getsize(expected_file)
                    if size1 == size2:
                        # File is stable, copy to destination
                        import shutil
                        shutil.copy2(expected_file, full_path)
                        os.remove(expected_file)  # Clean up temp file
                        unreal.log(f"✓ Screenshot saved: {full_path}")
                        return full_path
            
            time.sleep(wait_interval)
            elapsed += wait_interval
            
            # Progress logging
            if elapsed > 0 and int(elapsed) % 10 == 0:
                unreal.log(f"  Still waiting... {int(elapsed)}s")
        
        unreal.log_warning(f"✗ Screenshot timed out: {full_path}")
        return None
    
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
