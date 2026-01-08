"""
UE5 UI Automation Feasibility Test
Phase 2.1 - CRITICAL VALIDATION

This script tests whether the Unreal Python API allows us to:
1. Open/close specific Editor windows
2. Control the Details Panel (expand properties, scroll to settings)
3. Manipulate Material Editor and Animation Blueprint nodes
4. Take screenshots of different UI states

Expected: This will help determine if full automation is feasible.
"""

import unreal

class UIAutomationTest:
    def __init__(self):
        self.editor_util = unreal.EditorUtilityLibrary()
        self.editor_asset_lib = unreal.EditorAssetLibrary()
        self.asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
        
    def run_all_tests(self):
        """Run all UI automation feasibility tests"""
        print("\n" + "="*60)
        print("UI AUTOMATION FEASIBILITY TESTS - Phase 2.1")
        print("="*60 + "\n")
        
        results = {
            "window_control": self.test_window_control(),
            "details_panel": self.test_details_panel_control(),
            "material_editor": self.test_material_editor_control(),
            "animation_blueprint": self.test_animation_blueprint_control(),
            "screenshot_capabilities": self.test_screenshot_capabilities()
        }
        
        self.print_results(results)
        return results
    
    def test_window_control(self):
        """Test 1: Can we open/close specific editor windows?"""
        print("\n[TEST 1] Window Control")
        print("-" * 40)
        
        try:
            # Attempt to open various windows
            # Note: This is experimental - we need to check UE Python API docs
            
            # Try to get level editor subsystem
            level_editor_subsystem = unreal.get_editor_subsystem(unreal.LevelEditorSubsystem)
            
            print("✓ Level Editor Subsystem accessible")
            
            # Check what methods are available
            available_methods = [method for method in dir(level_editor_subsystem) if not method.startswith('_')]
            print(f"  Available methods: {len(available_methods)}")
            print(f"  Sample methods: {available_methods[:5]}")
            
            return {
                "status": "PARTIAL",
                "notes": "Can access level editor subsystem, but specific window control needs investigation",
                "methods_found": available_methods
            }
            
        except Exception as e:
            print(f"✗ Error: {str(e)}")
            return {"status": "FAILED", "error": str(e)}
    
    def test_details_panel_control(self):
        """Test 2: Can we control the Details Panel?"""
        print("\n[TEST 2] Details Panel Control")
        print("-" * 40)
        
        try:
            # Try to select an actor and check if we can access its properties
            actors = unreal.EditorLevelLibrary.get_all_level_actors()
            
            if len(actors) > 0:
                test_actor = actors[0]
                unreal.EditorLevelLibrary.set_selected_level_actors([test_actor])
                print(f"✓ Selected actor: {test_actor.get_name()}")
                
                # Check if we can get properties
                properties = test_actor.get_editor_property('root_component')
                print(f"✓ Can access actor properties")
                
                return {
                    "status": "PARTIAL",
                    "notes": "Can select actors and access properties, but expanding specific UI sections unclear",
                    "test_actor": test_actor.get_name()
                }
            else:
                return {
                    "status": "INCONCLUSIVE",
                    "notes": "No actors in level to test with"
                }
                
        except Exception as e:
            print(f"✗ Error: {str(e)}")
            return {"status": "FAILED", "error": str(e)}
    
    def test_material_editor_control(self):
        """Test 3: Can we control the Material Editor?"""
        print("\n[TEST 3] Material Editor Control")
        print("-" * 40)
        
        try:
            # Check if we can access material editing subsystem
            material_subsystem = unreal.get_editor_subsystem(unreal.MaterialEditingLibrary)
            
            if material_subsystem:
                print("✓ Material Editing Library accessible")
                
                # Check available methods
                available_methods = [method for method in dir(material_subsystem) if not method.startswith('_')]
                print(f"  Available methods: {len(available_methods)}")
                
                # See if we can programmatically work with materials
                # This would be tested with an actual material asset
                
                return {
                    "status": "PARTIAL",
                    "notes": "Material editing library exists, but opening editor window and selecting nodes unclear",
                    "methods_found": available_methods
                }
            else:
                return {
                    "status": "UNKNOWN",
                    "notes": "Material editing subsystem not found"
                }
                
        except Exception as e:
            print(f"✗ Error: {str(e)}")
            return {"status": "FAILED", "error": str(e)}
    
    def test_animation_blueprint_control(self):
        """Test 4: Can we control the Animation Blueprint editor?"""
        print("\n[TEST 4] Animation Blueprint Control")
        print("-" * 40)
        
        try:
            # Check if we can access animation blueprint editing
            # This is likely more limited than material editing
            
            print("⚠ Animation Blueprint API investigation needed")
            
            return {
                "status": "UNKNOWN",
                "notes": "Animation Blueprint editor control needs research - likely very limited or unavailable"
            }
            
        except Exception as e:
            print(f"✗ Error: {str(e)}")
            return {"status": "FAILED", "error": str(e)}
    
    def test_screenshot_capabilities(self):
        """Test 5: Can we take screenshots of different UI states?"""
        print("\n[TEST 5] Screenshot Capabilities")
        print("-" * 40)
        
        try:
            # Try to take a viewport screenshot
            screenshot_util = unreal.AutomationLibrary()
            
            # Check if we can capture screenshots
            print("✓ Automation library accessible")
            
            # Test taking a screenshot
            output_path = "D:/temp/test_screenshot.png"
            screenshot_util.take_high_res_screenshot(1920, 1080, output_path)
            print(f"✓ Screenshot saved to: {output_path}")
            
            return {
                "status": "SUCCESS",
                "notes": "Can capture viewport screenshots",
                "output_path": output_path
            }
            
        except Exception as e:
            print(f"✗ Error: {str(e)}")
            return {"status": "FAILED", "error": str(e)}
    
    def print_results(self, results):
        """Print summary of all test results"""
        print("\n" + "="*60)
        print("FEASIBILITY TEST SUMMARY")
        print("="*60)
        
        for test_name, result in results.items():
            status = result.get("status", "UNKNOWN")
            status_icon = {
                "SUCCESS": "✓",
                "PARTIAL": "⚠",
                "FAILED": "✗",
                "UNKNOWN": "?",
                "INCONCLUSIVE": "?"
            }.get(status, "?")
            
            print(f"\n{status_icon} {test_name.replace('_', ' ').title()}: {status}")
            if "notes" in result:
                print(f"  → {result['notes']}")
            if "error" in result:
                print(f"  → Error: {result['error']}")
        
        print("\n" + "="*60)
        print("RECOMMENDATION:")
        
        # Determine overall feasibility
        success_count = sum(1 for r in results.values() if r.get("status") == "SUCCESS")
        partial_count = sum(1 for r in results.values() if r.get("status") == "PARTIAL")
        
        if success_count >= 3:
            print("✓ Full automation appears FEASIBLE - proceed with implementation")
        elif success_count + partial_count >= 3:
            print("⚠ Partial automation POSSIBLE - may need hybrid approach")
        else:
            print("✗ Full automation NOT FEASIBLE - manual approach may be needed")
        
        print("="*60 + "\n")


def run_feasibility_test():
    """Main entry point for the feasibility test"""
    tester = UIAutomationTest()
    return tester.run_all_tests()


if __name__ == "__main__":
    # Run when executed in Unreal Python console
    run_feasibility_test()
