"""
Fallback Screenshot using Unreal's basic screenshot command

This uses the simple "shot" command instead of HighResShot - much more reliable!
"""

import unreal
import os
import time


class FallbackScreenshot:
    """Fallback screenshot using Unreal's basic screenshot command"""
    
    def capture(self, output_path, filename, resolution=None):
        """
        Capture a simple viewport screenshot
        
        Args:
            output_path (str): Directory to save screenshot
            filename (str): Base filename (without extension)
            resolution (tuple): Ignored - uses viewport size
            
        Returns:
            str: Full path to captured screenshot
        """
        os.makedirs(output_path, exist_ok=True)
        
        unreal.log(f"📸 Capturing screenshot: {filename}")
        
        # Get UE's screenshot directory
        project_dir = unreal.SystemLibrary.get_project_directory()
        screenshot_dir = os.path.join(project_dir, "Saved", "Screenshots", "Windows")
        os.makedirs(screenshot_dir, exist_ok=True)
        
        # Clear old screenshots
        for f in os.listdir(screenshot_dir):
            if f.endswith('.png'):
                try:
                    os.remove(os.path.join(screenshot_dir, f))
                except:
                    pass
        
        # Take screenshot using basic "shot" command
        # This is way more reliable than HighResShot
        unreal.SystemLibrary.execute_console_command(None, "shot")
        
        # Wait a moment for file to be written
        time.sleep(1.0)
        
        # Find the screenshot file
        target_path = os.path.join(output_path, f"{filename}.png")
        
        if os.path.exists(screenshot_dir):
            png_files = [f for f in os.listdir(screenshot_dir) if f.endswith('.png')]
            if png_files:
                # Get the most recent one
                png_files_full = [os.path.join(screenshot_dir, f) for f in png_files]
                latest = max(png_files_full, key=os.path.getmtime)
                
                # Move to target location
                import shutil
                shutil.move(latest, target_path)
                
                unreal.log(f"✓ Screenshot saved: {target_path}")
                return target_path
        
        unreal.log_warning(f"✗ Screenshot failed: {target_path}")
        return target_path
    
    def hide_ui(self):
        """Hide UI elements for clean screenshots"""
        unreal.SystemLibrary.execute_console_command(None, "showflag.game 1")
    
    def show_ui(self):
        """Restore UI elements"""
        unreal.SystemLibrary.execute_console_command(None, "showflag.game 0")
