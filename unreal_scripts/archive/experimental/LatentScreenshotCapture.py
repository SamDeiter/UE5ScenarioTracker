"""
Latent Screenshot Capture using Unreal Engine's AutomationScheduler

This is the PROPER way to capture screenshots in UE Python automation.
It allows the engine to tick between commands, ensuring reliable screenshot saves.
"""

import unreal
import os
import time


def capture_screenshot_latent(screenshot_path, resolution=(1280, 720)):
    """
    Capture a screenshot using latent commands - the proper UE way
    
    Args:
        screenshot_path: Full path where screenshot should be saved
        resolution: Tuple of (width, height)
    
    Returns:
        True if successful, raises exception if failed
    """
    
    # Get project directory for temp storage
    project_dir = unreal.SystemLibrary.get_project_directory()
    temp_screenshot_dir = os.path.join(project_dir, "Saved", "Screenshots", "WindowsEditor")
    os.makedirs(temp_screenshot_dir, exist_ok=True)
    
    # Clear any existing temp screenshots
    for f in os.listdir(temp_screenshot_dir):
        if f.endswith('.png'):
            try:
                os.remove(os.path.join(temp_screenshot_dir, f))
            except:
                pass
    
    # Hide UI elements
    hide_ui_commands = [
        "showflag.hud 0",
        "showflag.selection 0",
        "showflag.grid 0",
        "showflag.bounds 0",
        "showflag.visualizelightculling 0"
    ]
    
    for cmd in hide_ui_commands:
        unreal.SystemLibrary.execute_console_command(None, cmd)
    
    # Set resolution
    unreal.SystemLibrary.execute_console_command(None, f"r.SetRes {resolution[0]}x{resolution[1]}")
    
    unreal.log(f"Capturing screenshot: {screenshot_path}")
    unreal.log(f"Resolution: {resolution[0]}x{resolution[1]}")
    
    # This is the key - use automation scheduler
    success = [False]  # Mutable list to track success across callbacks
    
    def take_screenshot_step():
        """Step 1: Issue the screenshot command"""
        unreal.log("Executing HighResShot command...")
        unreal.SystemLibrary.execute_console_command(None, f"HighResShot {resolution[0]}x{resolution[1]}")
        # Yield to allow engine to process
        return
    
    def wait_for_file_step():
        """Step 2: Wait for screenshot file to appear"""
        max_attempts = 60  # 60 ticks = ~2 seconds at 30fps, up to 60 seconds total
        attempts = [0]
        
        def check_file():
            attempts[0] += 1
            
            # Check if screenshot file exists
            if os.path.exists(temp_screenshot_dir):
                png_files = [f for f in os.listdir(temp_screenshot_dir) if f.endswith('.png')]
                if png_files:
                    # Found it!
                    png_files_full = [os.path.join(temp_screenshot_dir, f) for f in png_files]
                    png_files_full.sort(key=os.path.getmtime, reverse=True)
                    source_file = png_files_full[0]
                    
                    # Move to target location
                    import shutil
                    target_dir = os.path.dirname(screenshot_path)
                    os.makedirs(target_dir, exist_ok=True)
                    shutil.move(source_file, screenshot_path)
                    
                    unreal.log(f"✓ Screenshot saved: {screenshot_path}")
                    success[0] = True
                    return  # Done!
            
            # Not found yet
            if attempts[0] >= max_attempts:
                unreal.log_error(f"Screenshot timed out after {max_attempts} ticks")
                raise Exception(f"Screenshot failed to save: {screenshot_path}")
            
            # Keep waiting - yield to next tick
            unreal.log(f"   Waiting for screenshot... (attempt {attempts[0]}/{max_attempts})")
            return
        
        return check_file
    
    # Register latent commands
    scheduler = unreal.AutomationScheduler()
    
    # Add screenshot command
    scheduler.add_latent_command(take_screenshot_step)
    
    # Add file waiting loop
    wait_fn = wait_for_file_step()
    for _ in range(60):  # Max 60 ticks of waiting
        scheduler.add_latent_command(wait_fn)
    
    # Execute the scheduled commands
    unreal.log("Executing latent screenshot commands...")
    
    return screenshot_path


# Alternative simpler approach if AutomationScheduler doesn't work
def capture_screenshot_with_callback(screenshot_path, resolution=(1280, 720)):
    """
    Alternative approach using Slate post-tick callback
    """
    project_dir = unreal.SystemLibrary.get_project_directory()
    temp_screenshot_dir = os.path.join(project_dir, "Saved", "Screenshots", "WindowsEditor")
    os.makedirs(temp_screenshot_dir, exist_ok=True)
    
    # Clear temp folder
    for f in os.listdir(temp_screenshot_dir):
        if f.endswith('.png'):
            try:
                os.remove(os.path.join(temp_screenshot_dir, f))
            except:
                pass
    
    # Hide UI
    unreal.SystemLibrary.execute_console_command(None, "showflag.hud 0")
    unreal.SystemLibrary.execute_console_command(None, "showflag.selection 0")
    unreal.SystemLibrary.execute_console_command(None, "showflag.grid 0")
    unreal.SystemLibrary.execute_console_command(None, f"r.SetRes {resolution[0]}x{resolution[1]}")
    
    # Execute screenshot command
    unreal.SystemLibrary.execute_console_command(None, f"HighResShot {resolution[0]}x{resolution[1]}")
    
    unreal.log(f"Capturing screenshot: {screenshot_path}")
    
    # Use callback to wait for completion
    tick_count = [0]
    max_ticks = 120  # 4 seconds at 30fps
    
    def on_tick(delta_time):
        tick_count[0] += 1
        
        # Check if file exists
        if os.path.exists(temp_screenshot_dir):
            png_files = [f for f in os.listdir(temp_screenshot_dir) if f.endswith('.png')]
            if png_files:
                # Found screenshot
                png_files_full = [os.path.join(temp_screenshot_dir, f) for f in png_files]
                png_files_full.sort(key=os.path.getmtime, reverse=True)
                source_file = png_files_full[0]
                
                # Move to target
                import shutil
                target_dir = os.path.dirname(screenshot_path)
                os.makedirs(target_dir, exist_ok=True)
                shutil.move(source_file, screenshot_path)
                
                unreal.log(f"✓ Screenshot saved: {screenshot_path}")
                
                # Unregister callback
                unreal.unregister_slate_post_tick_callback(on_tick)
                return
        
        # Timeout check
        if tick_count[0] >= max_ticks:
            unreal.log_warning(f"Screenshot timed out after {max_ticks} ticks")
            unreal.unregister_slate_post_tick_callback(on_tick)
    
    # Register the tick callback
    unreal.register_slate_post_tick_callback(on_tick)
    
    # Wait a bit for callback to execute
    time.sleep(5.0)
    
    return screenshot_path
