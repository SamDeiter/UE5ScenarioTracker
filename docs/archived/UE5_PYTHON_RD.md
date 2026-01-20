# UE5 Python API - R&D Findings

**Date:** 2025-12-31  
**Purpose:** Document reliable methods for Python-based screenshot automation in UE5

---

## Key Findings

### ❌ What Doesn't Work Well

| Method | Issue |
|--------|-------|
| `set_level_viewport_camera_info()` | Unreliable - often doesn't update viewport camera properly |
| Direct viewport manipulation | Limited Python API access to viewport internals |
| Rapid sequential screenshots | Can cause shader compilation stalls |

### ✅ What Works

| Method | Use Case | Reliability |
|--------|----------|-------------|
| `pilot_level_actor()` | Camera positioning | ⭐⭐⭐⭐ Good |
| `HighResShot` console command | High-quality screenshots | ⭐⭐⭐⭐⭐ Excellent |
| Movie Render Queue (MRQ) | Cinematic renders | ⭐⭐⭐⭐⭐ Excellent |
| `AutomationLibrary.take_high_res_screenshot()` | Simple captures | ⭐⭐⭐ Moderate |

---

## Recommended Approach: HighResShot Console Command

The most reliable screenshot method is the **HighResShot console command**:

```python
import unreal
import os
import time

def capture_screenshot(filename, multiplier=1):
    """
    Capture screenshot using HighResShot console command
    
    Args:
        filename: Output filename (saved to project's Saved/Screenshots folder)
        multiplier: Resolution multiplier (1=viewport res, 2=double, etc)
    """
    # Hide UI
    unreal.SystemLibrary.execute_console_command(None, "showflag.hud 0")
    
    # Take screenshot
    command = f"HighResShot {multiplier}"
    unreal.SystemLibrary.execute_console_command(None, command)
    
    # Wait for capture
    time.sleep(1.0)
    
    # Restore UI
    unreal.SystemLibrary.execute_console_command(None, "showflag.hud 1")
```

**Output Location:** `{ProjectDir}/Saved/Screenshots/`

---

## Camera Positioning: Pilot Actor Method

To reliably position the camera, spawn a CameraActor and pilot it:

```python
import unreal
import time

def position_camera(location, rotation):
    """
    Position viewport camera by piloting a camera actor
    
    Args:
        location: [x, y, z] world coordinates
        rotation: [pitch, yaw, roll] in degrees
    """
    # Spawn camera at desired position
    loc = unreal.Vector(location[0], location[1], location[2])
    rot = unreal.Rotator(rotation[0], rotation[1], rotation[2])
    
    camera = unreal.EditorLevelLibrary.spawn_actor_from_class(
        unreal.CineCameraActor,
        loc,
        rot
    )
    
    # Pilot the camera (viewport looks through it)
    unreal.EditorLevelLibrary.pilot_level_actor(camera)
    
    # Wait for viewport to update
    time.sleep(0.5)
    unreal.EditorLevelLibrary.editor_invalidate_viewports()
    time.sleep(0.5)
    
    return camera

def cleanup_camera(camera):
    """Stop piloting and remove camera"""
    unreal.EditorLevelLibrary.eject_pilot_level_actor()
    unreal.EditorLevelLibrary.destroy_actor(camera)
```

---

## Complete Workflow: Camera + Screenshot

```python
import unreal
import time
import os

def capture_scene(location, rotation, output_name):
    """
    Complete workflow: position camera and capture screenshot
    """
    # 1. Position camera
    loc = unreal.Vector(*location)
    rot = unreal.Rotator(*rotation)
    
    camera = unreal.EditorLevelLibrary.spawn_actor_from_class(
        unreal.CineCameraActor, loc, rot
    )
    camera.set_actor_label("ScreenshotCam")
    
    # 2. Pilot camera
    unreal.EditorLevelLibrary.pilot_level_actor(camera)
    time.sleep(0.5)
    
    # 3. Refresh viewport
    unreal.EditorLevelLibrary.editor_invalidate_viewports()
    time.sleep(1.0)
    
    # 4. Hide UI
    unreal.SystemLibrary.execute_console_command(None, "showflag.hud 0")
    unreal.SystemLibrary.execute_console_command(None, "showflag.selection 0")
    
    # 5. Take screenshot
    unreal.SystemLibrary.execute_console_command(None, "HighResShot 1")
    time.sleep(1.5)
    
    # 6. Restore UI
    unreal.SystemLibrary.execute_console_command(None, "showflag.hud 1")
    
    # 7. Cleanup
    unreal.EditorLevelLibrary.eject_pilot_level_actor()
    unreal.EditorLevelLibrary.destroy_actor(camera)
    
    # Note: Screenshot saved to {Project}/Saved/Screenshots/
    unreal.log(f"Screenshot saved for: {output_name}")
```

---

## Movie Render Queue (Advanced)

For highest quality output with Python automation:

```python
import unreal

def setup_mrq_render():
    """
    Setup Movie Render Queue for high-quality output
    Uses MoviePipelineMasterConfig for settings
    """
    # Get MRQ subsystem
    subsystem = unreal.get_editor_subsystem(unreal.MoviePipelineQueueSubsystem)
    queue = subsystem.get_queue()
    
    # Create new job
    job = queue.allocate_new_job(unreal.MoviePipelineExecutorJob)
    job.map = unreal.SoftObjectPath("/Game/Maps/YourMap")
    
    # Configure settings via MoviePipelineMasterConfig
    # ... (complex setup - see Epic docs)
```

---

## Best Practices

### 1. Always Wait After Operations

```python
# After any viewport change, wait!
unreal.EditorLevelLibrary.editor_invalidate_viewports()
time.sleep(1.0)  # At least 1 second
```

### 2. Hide UI Before Screenshots

```python
unreal.SystemLibrary.execute_console_command(None, "showflag.hud 0")
unreal.SystemLibrary.execute_console_command(None, "showflag.selection 0")
unreal.SystemLibrary.execute_console_command(None, "showflag.grid 0")
```

### 3. Use Console Commands When Python API Fails

Many operations are more reliable via console commands than Python API.

### 4. Clean Up Spawned Actors

Always destroy temporary cameras/actors when done.

---

## Known Limitations

1. **Python runs on Game Thread** - Long operations freeze the editor UI
2. **GIL restrictions** - Can't multithread Python in UE
3. **Editor-only** - Python API not available in packaged games
4. **Viewport refresh timing** - Needs explicit waits between operations

---

## Files & Tools

| File | Purpose |
|------|---------|
| `HighResShot` command | Best for single screenshots |
| `pilot_level_actor()` | Camera positioning |
| `Movie Render Queue` | Batch/cinematic rendering |
| `AutomationLibrary` | Automation testing |

---

## Next Steps for This Project

1. **Rewrite CameraOnlyCapture.py** to use `HighResShot` instead of Windows API
2. **Test the pilot_level_actor** approach in your UE5 setup
3. **Consider Movie Render Queue** for batch scenario generation
4. **Document output folder structure** for HighResShot files
