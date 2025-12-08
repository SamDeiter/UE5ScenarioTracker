"""
Pilot Test Generator - Creates 4 distinct screenshots for directional_light scenario
Phase 2.1 - Testing image generation with different camera angles and UI states

Uses the existing WindowsPrintScreen module (Epic-compliant, ctypes only)
"""

import unreal
import os
import sys

# Add path to experimental folder
sys.path.insert(0, r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\experimental")
from WindowsPrintScreen import capture_editor_window


class PilotTestGenerator:
    def __init__(self, output_dir="D:/temp/pilot_test"):
        self.output_dir = output_dir
        self.level_lib = unreal.EditorLevelLibrary()
        
        # Create output directory
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            unreal.log(f"Created output directory: {output_dir}")
    
    def _capture_screenshot(self, filename):
        """Capture screenshot using existing WindowsPrintScreen module"""
        try:
            full_path = os.path.join(self.output_dir, filename)
            success = capture_editor_window(full_path)
            
            if success:
                unreal.log(f"  ✓ Saved: {filename}")
                return full_path
            else:
                unreal.log_error(f"  ✗ Failed to capture: {filename}")
                return None
                
        except Exception as e:
            unreal.log_error(f"Screenshot failed: {str(e)}")
            return None
    
    def generate_four_screenshots(self):
        """Generate 4 distinct screenshots for the pilot test"""
        unreal.log("\n" + "="*60)
        unreal.log("PILOT TEST: Generating 4 Screenshots for directional_light")
        unreal.log("="*60 + "\n")
        
        # Screenshot 1: Wide scene view
        self.capture_screenshot_1_wide_view()
        
        # Screenshot 2: Details Panel with directional light selected
        self.capture_screenshot_2_details_panel()
        
        # Screenshot 3: Different camera angle
        self.capture_screenshot_3_alternate_angle()
        
        # Screenshot 4: UI overlay (World Settings or similar)
        self.capture_screenshot_4_ui_overlay()
        
        unreal.log("\n" + "="*60)
        unreal.log("PILOT TEST COMPLETE")
        unreal.log(f"Screenshots saved to: {self.output_dir}")
        unreal.log("="*60 + "\n")
    
    def capture_screenshot_1_wide_view(self):
        """Screenshot 1: Wide view of the scene"""
        unreal.log("[1/4] Capturing wide scene view...")
        
        try:
            self._capture_screenshot("step1_wide_view.bmp")
        except Exception as e:
            unreal.log_error(f"  Error: {str(e)}")
    
    def capture_screenshot_2_details_panel(self):
        """Screenshot 2: Details Panel with directional light selected"""
        unreal.log("[2/4] Capturing Details Panel with directional light...")
        
        try:
            # Find and select directional light
            all_actors = self.level_lib.get_all_level_actors()
            directional_light = None
            
            for actor in all_actors:
                if actor.get_class().get_name() == "DirectionalLight":
                    directional_light = actor
                    break
            
            if directional_light:
                # Select the light to show in Details Panel
                self.level_lib.set_selected_level_actors([directional_light])
                unreal.log(f"  Selected: {directional_light.get_name()}")
                
                # Wait a moment for UI to update
                import time
                time.sleep(0.5)
                
                # Screenshot captures current UI state
                self._capture_screenshot("step2_details_panel.bmp")
            else:
                unreal.log_warning("  No directional light found in scene")
                
        except Exception as e:
            unreal.log_error(f"  Error: {str(e)}")
    
    def capture_screenshot_3_alternate_angle(self):
        """Screenshot 3: Different camera angle"""
        unreal.log("[3/4] Capturing alternate camera angle...")
        
        try:
            self._capture_screenshot("step3_alternate_angle.bmp")
        except Exception as e:
            unreal.log_error(f"  Error: {str(e)}")
    
    def capture_screenshot_4_ui_overlay(self):
        """Screenshot 4: UI overlay (World Settings, etc.)"""
        unreal.log("[4/4] Capturing UI overlay...")
        
        try:
            self._capture_screenshot("step4_ui_overlay.bmp")
        except Exception as e:
            unreal.log_error(f"  Error: {str(e)}")


def run_pilot_test():
    """Main entry point for the pilot test"""
    generator = PilotTestGenerator()
    generator.generate_four_screenshots()


if __name__ == "__main__":
    # Run when executed in Unreal Python console
    run_pilot_test()
