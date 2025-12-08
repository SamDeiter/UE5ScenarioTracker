"""
Simple Screenshot Capture using Windows Print Screen

Instant, reliable screenshots using Windows API - no waiting for Unreal!
"""

import unreal
import os
from WindowsPrintScreen import WindowsPrintScreen


class SimpleScreenshot:
    """Simple screenshot capture using Windows Print Screen API"""
    
    def __init__(self):
        self.capturer = WindowsPrintScreen()
    
    def capture(self, output_path, filename, resolution=None):
        """
        Capture a screenshot using Windows Print Screen
        
        Args:
            output_path (str): Directory to save screenshot
            filename (str): Base filename (without extension)
            resolution (tuple): Ignored - captures full window
            
        Returns:
            str: Full path to captured screenshot
        """
        os.makedirs(output_path, exist_ok=True)
        
        # Will save as BMP but that's fine for testing
        full_path = os.path.join(output_path, f"{filename}.bmp")
        
        unreal.log(f"📸 Capturing screenshot with Windows PrintScreen: {filename}")
        
        # Use Windows API to capture - instant!
        success = self.capturer.capture_window(full_path, window_title="Unreal Editor")
        
        if success:
            unreal.log(f"✓ Screenshot saved: {full_path}")
        else:
            unreal.log_warning(f"✗ Screenshot failed: {full_path}")
        
        return full_path
    
    def hide_ui(self):
        """Hide UI elements for clean screenshots"""
        unreal.SystemLibrary.execute_console_command(None, "showflag.game 1")
    
    def show_ui(self):
        """Restore UI elements"""
        unreal.SystemLibrary.execute_console_command(None, "showflag.game 0")
