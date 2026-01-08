import ctypes
from ctypes import wintypes

def find_unreal_windows():
    """Find all windows with 'Unreal' in the title"""
    windows = []
    
    def enum_callback(hwnd, lParam):
        length = ctypes.windll.user32.GetWindowTextLengthW(hwnd)
        if length > 0:
            buff = ctypes.create_unicode_buffer(length + 1)
            ctypes.windll.user32.GetWindowTextW(hwnd, buff, length + 1)
            if 'Unreal' in buff.value or 'UE5' in buff.value:
                windows.append(buff.value)
        return True
    
    EnumWindowsProc = ctypes.WINFUNCTYPE(ctypes.c_bool, ctypes.POINTER(ctypes.c_int), ctypes.POINTER(ctypes.c_int))
    ctypes.windll.user32.EnumWindows(EnumWindowsProc(enum_callback), 0)
    
    return windows

if __name__ == "__main__":
    wins = find_unreal_windows()
    print("Found Unreal windows:")
    for w in wins:
        print(f"  - {w}")
