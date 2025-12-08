"""
Pilot Test Generator - Creates 4 distinct screenshots for directional_light scenario
Phase 2.1 - Testing image generation with different camera angles and UI states

This script will generate 4 screenshots showing:
1. Wide shot of the scene with Details Panel showing directional light properties
2. Close-up of the light actor with specific settings expanded
3. Material Editor view (if applicable)
4. Lighting visualizer or another relevant UI state
"""

import unreal
import os

class PilotTestGenerator:
    def __init__(self, output_dir="D:/temp/pilot_test"):
        self.output_dir = output_dir
        self.automation_lib = unreal.AutomationLibrary()
        self.level_lib = unreal.EditorLevelLibrary()
        
        # Create output directory
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            print(f"Created output directory: {output_dir}")
    
    def generate_four_screenshots(self):
        """Generate 4 distinct screenshots for the pilot test"""
        print("\n" + "="*60)
        print("PILOT TEST: Generating 4 Screenshots for directional_light")
        print("="*60 + "\n")
        
        # Screenshot 1: Wide scene view
        self.capture_screenshot_1_wide_view()
        
        # Screenshot 2: Details Panel with directional light selected
        self.capture_screenshot_2_details_panel()
        
        # Screenshot 3: Different camera angle
        self.capture_screenshot_3_alternate_angle()
        
        # Screenshot 4: UI overlay (World Settings or similar)
        self.capture_screenshot_4_ui_overlay()
        
        print("\n" + "="*60)
        print("PILOT TEST COMPLETE")
        print(f"Screenshots saved to: {self.output_dir}")
        print("="*60 + "\n")
    
    def capture_screenshot_1_wide_view(self):
        """Screenshot 1: Wide view of the scene"""
        print("[1/4] Capturing wide scene view...")
        
        try:
            # Set camera to wide angle
            # (This would need actual camera positioning logic)
            
            output_path = os.path.join(self.output_dir, "step1_wide_view.png")
            self.automation_lib.take_high_res_screenshot(1920, 1080, output_path)
            print(f"  ✓ Saved: step1_wide_view.png")
            
        except Exception as e:
            print(f"  ✗ Error: {str(e)}")
    
    def capture_screenshot_2_details_panel(self):
        """Screenshot 2: Details Panel with directional light selected"""
        print("[2/4] Capturing Details Panel with directional light...")
        
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
                print(f"  → Selected: {directional_light.get_name()}")
                
                # Give UI time to update
                unreal.SystemLibrary.delay(unreal.EditorLevelLibrary, 0.5)
                
                output_path = os.path.join(self.output_dir, "step2_details_panel.png")
                self.automation_lib.take_high_res_screenshot(1920, 1080, output_path)
                print(f"  ✓ Saved: step2_details_panel.png")
            else:
                print("  ⚠ No directional light found in scene")
                
        except Exception as e:
            print(f"  ✗ Error: {str(e)}")
    
    def capture_screenshot_3_alternate_angle(self):
        """Screenshot 3: Different camera angle"""
        print("[3/4] Capturing alternate camera angle...")
        
        try:
            # This would set a different camera position
            # For now, just take another screenshot
            
            output_path = os.path.join(self.output_dir, "step3_alternate_angle.png")
            self.automation_lib.take_high_res_screenshot(1920, 1080, output_path)
            print(f"  ✓ Saved: step3_alternate_angle.png")
            
        except Exception as e:
            print(f"  ✗ Error: {str(e)}")
    
    def capture_screenshot_4_ui_overlay(self):
        """Screenshot 4: UI overlay (World Settings, etc.)"""
        print("[4/4] Capturing UI overlay...")
        
        try:
            # This would open a specific UI panel
            # For now, just take another screenshot
            
            output_path = os.path.join(self.output_dir, "step4_ui_overlay.png")
            self.automation_lib.take_high_res_screenshot(1920, 1080, output_path)
            print(f"  ✓ Saved: step4_ui_overlay.png")
            
        except Exception as e:
            print(f"  ✗ Error: {str(e)}")


def run_pilot_test():
    """Main entry point for the pilot test"""
    generator = PilotTestGenerator()
    generator.generate_four_screenshots()


if __name__ == "__main__":
    # Run when executed in Unreal Python console
    run_pilot_test()
