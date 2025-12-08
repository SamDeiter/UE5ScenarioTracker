"""
Windows Print Screen Capture - License-Safe (Standard Library Only)
Uses Windows API via ctypes - no external dependencies required
"""

import unreal
import os
import time
import ctypes
from ctypes import wintypes
import struct
import zlib


# Manual structure definitions for stripped-down ctypes in Unreal
class BITMAPINFOHEADER(ctypes.Structure):
    _fields_ = [
        ('biSize', ctypes.c_uint32),
        ('biWidth', ctypes.c_int32),
        ('biHeight', ctypes.c_int32),
        ('biPlanes', ctypes.c_uint16),
        ('biBitCount', ctypes.c_uint16),
        ('biCompression', ctypes.c_uint32),
        ('biSizeImage', ctypes.c_uint32),
        ('biXPelsPerMeter', ctypes.c_int32),
        ('biYPelsPerMeter', ctypes.c_int32),
        ('biClrUsed', ctypes.c_uint32),
        ('biClrImportant', ctypes.c_uint32),
    ]


class WindowsPrintScreen:
    """Capture screenshots using Windows API - no external packages needed"""
    
    def __init__(self):
        # Load Windows DLLs
        self.user32 = ctypes.windll.user32
        self.gdi32 = ctypes.windll.gdi32
        self.dwmapi = ctypes.windll.dwmapi
        
    def capture_window(self, output_path, window_title="UEScenarioFactory - Unreal Editor"):
        """
        Capture full window using Windows API with proper DWM flush
        
        Args:
            output_path (str): Full path to save PNG file
            window_title (str): Window title to find
            
        Returns:
            bool: Success status
        """
        unreal.log(f"Capturing window: {window_title}")
        
        try:
            unreal.log(f"Window dimensions: {width}x{height}")
            
            # Get window DC (not client DC - we want the full window)
            hwndDC = self.user32.GetDC(hwnd)
            
            # Create compatible DC and bitmap
            mfcDC = self.gdi32.CreateCompatibleDC(hwndDC)
            saveBitMap = self.gdi32.CreateCompatibleBitmap(hwndDC, width, height)
            
            # Select bitmap into DC
            old_obj = self.gdi32.SelectObject(mfcDC, saveBitMap)
            
            # Use PrintWindow with rendered content flag
            PW_RENDERFULLCONTENT = 0x00000002
            result = self.user32.PrintWindow(hwnd, mfcDC, PW_RENDERFULLCONTENT)
            
            if not result:
                unreal.log_warning("PrintWindow failed, trying BitBlt fallback")
                # Fallback to BitBlt with source copy
                self.gdi32.BitBlt(mfcDC, 0, 0, width, height, hwndDC, 0, 0, 0x00CC0020)
            
            # Get bitmap bits for PNG encoding
            bitmap_data = self._get_bitmap_bits(saveBitMap, width, height)
            
            # Save as PNG
            self._save_png(bitmap_data, width, height, output_path)
            
            # Cleanup
            self.gdi32.SelectObject(mfcDC, old_obj)
            self.gdi32.DeleteObject(saveBitMap)
            self.gdi32.DeleteDC(mfcDC)
            self.user32.ReleaseDC(hwnd, hwndDC)
            
            unreal.log(f"✓ Screenshot saved: {output_path}")
            return True
            
        except Exception as e:
            unreal.log_error(f"Screenshot failed: {e}")
            import traceback
            unreal.log_error(traceback.format_exc())
            return False
    
    def _get_bitmap_bits(self, hBitmap, width, height):
        """Extract raw bitmap data from HBITMAP"""
        
        bi = BITMAPINFOHEADER()
        bi.biSize = ctypes.sizeof(BITMAPINFOHEADER)
        bi.biWidth = width
        bi.biHeight = height
        bi.biPlanes = 1
        bi.biBitCount = 32
        bi.biCompression = 0  # BI_RGB
        bi.biSizeImage = 0
        bi.biXPelsPerMeter = 0
        bi.biYPelsPerMeter = 0
        bi.biClrUsed = 0
        bi.biClrImportant = 0
        
        dwBmpSize = ((width * bi.biBitCount + 31) // 32) * 4 * height
        
        # Allocate memory for bitmap bits
        lpbitmap = ctypes.create_string_buffer(dwBmpSize)
        
        # Get bits
        hDC = self.user32.GetDC(None)
        self.gdi32.GetDIBits(hDC, hBitmap, 0, height, lpbitmap, ctypes.byref(bi), 0)
        self.user32.ReleaseDC(None, hDC)
        
        return lpbitmap.raw
    
    def _save_png(self, bitmap_data, width, height, filepath):
        """
        Save bitmap data as PNG using Python standard library only
        Uses struct for binary packing and zlib for compression
        """
        
        # Convert BGRA to RGBA and flip vertically (BMP is bottom-up)
        rgba_data = bytearray()
        bytes_per_row = width * 4
        
        for y in range(height - 1, -1, -1):  # Flip vertically
            # PNG scanlines must start with filter type byte (0 = no filter)
            rgba_data.append(0)
            
            row_start = y * bytes_per_row
            for x in range(width):
                pixel_start = row_start + (x * 4)
                b = bitmap_data[pixel_start]
                g = bitmap_data[pixel_start + 1]
                r = bitmap_data[pixel_start + 2]
                a = bitmap_data[pixel_start + 3]
                
                # Append RGBA
                rgba_data.extend([r, g, b, a])
        
        # PNG signature
        png_signature = b'\x89PNG\r\n\x1a\n'
        
        # IHDR chunk
        ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
        ihdr_chunk = self._make_png_chunk(b'IHDR', ihdr_data)
        
        # IDAT chunk (compressed image data)
        compressed_data = zlib.compress(bytes(rgba_data), 9)
        idat_chunk = self._make_png_chunk(b'IDAT', compressed_data)
        
        # IEND chunk
        iend_chunk = self._make_png_chunk(b'IEND', b'')
        
        # Write PNG file
        with open(filepath, 'wb') as f:
            f.write(png_signature)
            f.write(ihdr_chunk)
            f.write(idat_chunk)
            f.write(iend_chunk)
    
    def _make_png_chunk(self, chunk_type, data):
        """Create a PNG chunk with length, type, data, and CRC"""
        chunk_data = chunk_type + data
        crc = zlib.crc32(chunk_data) & 0xffffffff
        return struct.pack('>I', len(data)) + chunk_data + struct.pack('>I', crc)


# Simple function for easy use
def capture_editor_window(output_path):
    """
    Capture Unreal Editor window - simple interface
    
    Args:
        output_path (str): Full path to save screenshot (PNG format)
        
    Returns:
        bool: Success status
    """
    capturer = WindowsPrintScreen()
    return capturer.capture_window(output_path)
