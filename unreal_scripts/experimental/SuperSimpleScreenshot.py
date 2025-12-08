"""
Super Simple Screenshot - Just use PIL/Pillow

No Windows API, no Unreal commands, just pure Python screenshot
"""

import unreal
import os


class SuperSimpleScreenshot:
    """Dead simple screenshot using PIL"""
    
    def capture(self, output_path, filename, resolution=None):
        """
        Capture screenshot using PIL
        
        Args:
            output_path (str): Directory to save screenshot
            filename (str): Base filename (without extension)
            resolution (tuple): Ignored
            
        Returns:
            str: Full path to captured screenshot
        """
        os.makedirs(output_path, exist_ok=True)
        
        full_path = os.path.join(output_path, f"{filename}.png")
        
        unreal.log(f"📸 Capturing screenshot with PIL: {filename}")
        
        try:
            # Try using PIL/Pillow which should be available in Unreal's Python
            from PIL import ImageGrab
            
            # Capture the entire screen
            screenshot = ImageGrab.grab()
            
            # Save it
            screenshot.save(full_path, 'PNG')
            
            unreal.log(f"✓ Screenshot saved: {full_path}")
            return full_path
            
        except ImportError:
            unreal.log_error("PIL/Pillow not available. Trying PyWin32...")
            
            # Fallback to Win32 if PIL not available
            try:
                import win32gui
                import win32ui
                import win32con
                from ctypes import windll
                
                # Get screen dimensions
                user32 = windll.user32
                w = user32.GetSystemMetrics(0)
                h = user32.GetSystemMetrics(1)
                
                # Get screen DC and create compatible DC
                hdesktop = win32gui.GetDesktopWindow()
                hwndDC = win32gui.GetWindowDC(hdesktop)
                mfcDC = win32ui.CreateDCFromHandle(hwndDC)
                saveDC = mfcDC.CreateCompatibleDC()
                
                # Create bitmap
                saveBitMap = win32ui.CreateBitmap()
                saveBitMap.CreateCompatibleBitmap(mfcDC, w, h)
                saveDC.SelectObject(saveBitMap)
                
                # Copy screen to bitmap
                saveDC.BitBlt((0, 0), (w, h), mfcDC, (0, 0), win32con.SRCCOPY)
                
                # Save as BMP
                bmp_path = full_path.replace('.png', '.bmp')
                saveBitMap.SaveBitmapFile(saveDC, bmp_path)
                
                # Cleanup
                saveDC.DeleteDC()
                mfcDC.DeleteDC()
                win32gui.ReleaseDC(hdesktop, hwndDC)
                win32gui.DeleteObject(saveBitMap.GetHandle())
                
                unreal.log(f"✓ Screenshot saved as BMP: {bmp_path}")
                return bmp_path
                
            except Exception as e:
                unreal.log_error(f"Screenshot failed: {e}")
                return full_path
    
    def hide_ui(self):
        """Hide UI elements"""
        unreal.SystemLibrary.execute_console_command(None, "showflag.game 1")
    
    def show_ui(self):
        """Restore UI elements"""
        unreal.SystemLibrary.execute_console_command(None, "showflag.game 0")
