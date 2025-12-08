"""
Minimal Test Script - Run this directly in Unreal's Python console
This is a self-contained script that doesn't rely on imports from other files.
"""

import unreal
import json
import os
import ctypes
from ctypes import wintypes


# ============ INLINE BITMAPINFOHEADER ============
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


# ============ SCREENSHOT CAPTURE ============
def capture_window_screenshot(output_path, window_title=None):
    """Capture screenshot using Windows API"""
    user32 = ctypes.windll.user32
    gdi32 = ctypes.windll.gdi32
    
    # Find Unreal Editor window
    if window_title is None:
        # Try common Unreal window titles
        titles = ["UEScenarioFactory - Unreal Editor", "Unreal Editor", "UE5"]
        hwnd = None
        for title in titles:
            hwnd = user32.FindWindowW(None, title)
            if hwnd:
                unreal.log(f"Found window: {title}")
                break
        if not hwnd:
            unreal.log_warning("Could not find Unreal Editor window")
            return False
    else:
        hwnd = user32.FindWindowW(None, window_title)
    
    if not hwnd:
        return False
    
    # Get window dimensions
    rect = wintypes.RECT()
    user32.GetWindowRect(hwnd, ctypes.byref(rect))
    width = rect.right - rect.left
    height = rect.bottom - rect.top
    
    # Capture
    hwndDC = user32.GetWindowDC(hwnd)
    mfcDC = gdi32.CreateCompatibleDC(hwndDC)
    saveBitMap = gdi32.CreateCompatibleBitmap(hwndDC, width, height)
    gdi32.SelectObject(mfcDC, saveBitMap)
    gdi32.BitBlt(mfcDC, 0, 0, width, height, hwndDC, 0, 0, 0x00CC0020)
    
    # Save as BMP
    bi = BITMAPINFOHEADER()
    bi.biSize = ctypes.sizeof(BITMAPINFOHEADER)
    bi.biWidth = width
    bi.biHeight = height
    bi.biPlanes = 1
    bi.biBitCount = 32
    bi.biCompression = 0
    
    dwBmpSize = ((width * 32 + 31) // 32) * 4 * height
    lpbitmap = ctypes.create_string_buffer(dwBmpSize)
    
    hDC = user32.GetDC(None)
    gdi32.GetDIBits(hDC, saveBitMap, 0, height, lpbitmap, ctypes.byref(bi), 0)
    
    with open(output_path, 'wb') as f:
        f.write(b'BM')
        file_size = 54 + dwBmpSize
        f.write(file_size.to_bytes(4, 'little'))
        f.write(b'\x00\x00\x00\x00')
        f.write((54).to_bytes(4, 'little'))
        f.write(bi)
        f.write(lpbitmap.raw)
    
    # Cleanup
    user32.ReleaseDC(None, hDC)
    gdi32.DeleteObject(saveBitMap)
    gdi32.DeleteDC(mfcDC)
    user32.ReleaseDC(hwnd, hwndDC)
    
    unreal.log(f"Screenshot saved: {output_path}")
    return True


# ============ SCENE BUILDER (INLINE) ============
def clear_level():
    """Remove non-persistent actors"""
    unreal.log("Clearing level...")
    persistent_classes = [
        'LevelBounds', 'WorldSettings', 'DefaultPhysicsVolume',
        'WorldDataLayers', 'Landscape', 'SM_SkySphere', 'SkyAtmosphere',
        'ExponentialHeightFog', 'VolumetricCloud', 'Floor', 'PlayerStart'
    ]
    
    actors = unreal.EditorLevelLibrary.get_all_level_actors()
    for actor in actors:
        try:
            class_name = actor.get_class().get_name()
            if class_name not in persistent_classes:
                unreal.EditorLevelLibrary.destroy_actor(actor)
        except:
            pass
    unreal.log("Level cleared")


def spawn_directional_light(location, rotation, intensity=10.0):
    """Spawn a directional light"""
    loc = unreal.Vector(*location)
    rot = unreal.Rotator(*rotation)
    
    actor = unreal.EditorLevelLibrary.spawn_actor_from_class(
        unreal.DirectionalLight, loc, rot
    )
    
    light_comp = actor.get_component_by_class(unreal.DirectionalLightComponent)
    if light_comp:
        light_comp.set_intensity(intensity)
    
    return actor


def spawn_cube(location, scale=1.0):
    """Spawn a cube"""
    loc = unreal.Vector(*location)
    rot = unreal.Rotator(0, 0, 0)
    
    actor = unreal.EditorLevelLibrary.spawn_actor_from_class(
        unreal.StaticMeshActor, loc, rot
    )
    
    mesh = unreal.load_asset("/Engine/BasicShapes/Cube")
    if mesh:
        actor.static_mesh_component.set_static_mesh(mesh)
        actor.static_mesh_component.set_world_scale3d(unreal.Vector(scale, scale, scale))
    
    return actor


# ============ MAIN TEST ============
def run_test():
    """Run minimal test"""
    repo_path = r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker"
    output_dir = os.path.join(repo_path, "scenarios", "directional_light", "images")
    os.makedirs(output_dir, exist_ok=True)
    
    unreal.log("=" * 60)
    unreal.log("MINIMAL TEST - Step 1")
    unreal.log("=" * 60)
    
    # Clear and setup scene
    clear_level()
    spawn_directional_light([0, 0, 500], [0, -45, 0], 10.0)
    spawn_cube([0, 0, 100], 1.0)
    
    # Wait for scene to update
    unreal.EditorLevelLibrary.editor_invalidate_viewports()
    
    # Capture screenshot
    screenshot_path = os.path.join(output_dir, "step_1.bmp")
    success = capture_window_screenshot(screenshot_path)
    
    if success:
        unreal.log("TEST PASSED - Screenshot captured!")
    else:
        unreal.log_error("TEST FAILED - Screenshot not captured")
    
    # Create minimal JS file for web app
    js_path = os.path.join(repo_path, "scenarios", "directional_light", "directional_light.js")
    js_content = """window.SCENARIOS = window.SCENARIOS || {};
window.SCENARIOS['directional_light'] = {
    "scenario_id": "directional_light",
    "meta": {
        "title": "Directional Light Test",
        "description": "Test scenario for directional lighting",
        "estimateHours": 0.5
    },
    "start": "step_1",
    "steps": {
        "step_1": {
            "title": "Test Step",
            "prompt": "This is a test step.",
            "image_path": "directional_light/images/step_1.bmp",
            "choices": [
                {"text": "Option A", "type": "correct", "feedback": "Correct!", "next": null}
            ]
        }
    }
};
"""
    with open(js_path, 'w') as f:
        f.write(js_content)
    
    unreal.log(f"JS file created: {js_path}")
    unreal.log("=" * 60)
    unreal.log("TEST COMPLETE")
    unreal.log("=" * 60)


# Run test
run_test()
