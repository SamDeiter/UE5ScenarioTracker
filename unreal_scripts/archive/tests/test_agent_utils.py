"""
Test Script for AgentUtils and SceneInspector

Run this in Unreal Engine Python console to verify the new utilities work correctly.

Usage in Unreal:
    exec(open('c:/Users/Sam Deiter/Documents/GitHub/UE5ScenarioTracker/unreal_scripts/tests/test_agent_utils.py').read())
"""

import unreal
import sys
import os

# Add paths
SCRIPT_DIR = 'c:/Users/Sam Deiter/Documents/GitHub/UE5ScenarioTracker/unreal_scripts'
sys.path.insert(0, os.path.join(SCRIPT_DIR, 'core'))

# Track test results
results = []

def log_test(name, passed, details=""):
    """Log a test result"""
    status = "✓ PASS" if passed else "✗ FAIL"
    results.append((name, passed))
    unreal.log(f"{status}: {name}")
    if details:
        unreal.log(f"       {details}")


def run_tests():
    """Run all tests"""
    unreal.log("=" * 60)
    unreal.log("AGENT UTILITIES TEST SUITE")
    unreal.log("=" * 60)
    unreal.log("")
    
    # =========================================================================
    # Test 1: Import AgentUtils
    # =========================================================================
    try:
        import importlib
        import AgentUtils
        importlib.reload(AgentUtils)  # Force reload to get latest changes
        from AgentUtils import (
            EditorSubsystems, 
            AssetInspector, 
            APIIntrospector,
            SpatialSensor,
            AsyncTaskRunner,
            ErrorRecovery,
            HISMOptimizer
        )
        log_test("Import AgentUtils", True)
    except Exception as e:
        log_test("Import AgentUtils", False, str(e))
        return  # Can't continue without imports
    
    # =========================================================================
    # Test 2: Import SceneInspector
    # =========================================================================
    try:
        from SceneInspector import SceneInspector, inspect_scene, verify_light_color
        log_test("Import SceneInspector", True)
    except Exception as e:
        log_test("Import SceneInspector", False, str(e))
    
    # =========================================================================
    # Test 3: EditorSubsystems - Get Actor Subsystem
    # =========================================================================
    try:
        actor_subsystem = EditorSubsystems.get_actor_subsystem()
        passed = actor_subsystem is not None
        log_test("EditorSubsystems.get_actor_subsystem()", passed, 
                 f"Type: {type(actor_subsystem)}" if passed else "Returned None")
    except Exception as e:
        log_test("EditorSubsystems.get_actor_subsystem()", False, str(e))
    
    # =========================================================================
    # Test 4: EditorSubsystems - Get All Actors
    # =========================================================================
    try:
        actors = EditorSubsystems.get_all_actors()
        # Unreal returns Array type, not Python list - check if it's iterable with length
        actor_count = len(actors)
        passed = actor_count > 0
        log_test("EditorSubsystems.get_all_actors()", passed, 
                 f"Found {actor_count} actors")
    except Exception as e:
        log_test("EditorSubsystems.get_all_actors()", False, str(e))
    
    # =========================================================================
    # Test 5: EditorSubsystems - Get Viewport Camera
    # =========================================================================
    try:
        location, rotation = EditorSubsystems.get_viewport_camera_info()
        passed = isinstance(location, unreal.Vector)
        log_test("EditorSubsystems.get_viewport_camera_info()", passed,
                 f"Location: ({location.x:.1f}, {location.y:.1f}, {location.z:.1f})")
    except Exception as e:
        log_test("EditorSubsystems.get_viewport_camera_info()", False, str(e))
    
    # =========================================================================
    # Test 6: AssetInspector - Get Registry
    # =========================================================================
    try:
        registry = AssetInspector.get_registry()
        passed = registry is not None
        log_test("AssetInspector.get_registry()", passed)
    except Exception as e:
        log_test("AssetInspector.get_registry()", False, str(e))
    
    # =========================================================================
    # Test 7: AssetInspector - Asset Exists (Engine asset)
    # =========================================================================
    try:
        # Test with a known engine asset
        exists = AssetInspector.asset_exists("/Engine/BasicShapes/Cube")
        log_test("AssetInspector.asset_exists()", exists, 
                 "Checked /Engine/BasicShapes/Cube")
    except Exception as e:
        log_test("AssetInspector.asset_exists()", False, str(e))
    
    # =========================================================================
    # Test 8: APIIntrospector - Has Method
    # =========================================================================
    try:
        test_actor = actors[0] if actors else None
        if test_actor:
            has_method = APIIntrospector.has_method(test_actor, 'get_actor_location')
            log_test("APIIntrospector.has_method()", has_method,
                     "Checked for 'get_actor_location'")
        else:
            log_test("APIIntrospector.has_method()", False, "No actors to test")
    except Exception as e:
        log_test("APIIntrospector.has_method()", False, str(e))
    
    # =========================================================================
    # Test 9: APIIntrospector - Get Actor Components
    # =========================================================================
    try:
        if actors:
            components = APIIntrospector.get_actor_components(actors[0])
            passed = isinstance(components, list)
            log_test("APIIntrospector.get_actor_components()", passed,
                     f"Found {len(components)} components")
        else:
            log_test("APIIntrospector.get_actor_components()", False, "No actors")
    except Exception as e:
        log_test("APIIntrospector.get_actor_components()", False, str(e))
    
    # =========================================================================
    # Test 10: ErrorRecovery - Parse Error
    # =========================================================================
    try:
        test_log = "LogUObjectGlobals: Warning: Failed to find object '/Game/Missing/Asset'"
        error = ErrorRecovery.parse_error(test_log)
        passed = error is not None and error['type'] == 'asset_not_found'
        log_test("ErrorRecovery.parse_error()", passed,
                 f"Parsed type: {error['type'] if error else 'None'}")
    except Exception as e:
        log_test("ErrorRecovery.parse_error()", False, str(e))
    
    # =========================================================================
    # Test 11: SceneInspector - Get Snapshot
    # =========================================================================
    try:
        inspector = SceneInspector()
        snapshot = inspector.get_scene_snapshot()
        passed = 'actors' in snapshot and 'lights' in snapshot
        log_test("SceneInspector.get_scene_snapshot()", passed,
                 f"Captured {len(snapshot.get('actors', []))} actors, {len(snapshot.get('lights', []))} lights")
    except Exception as e:
        log_test("SceneInspector.get_scene_snapshot()", False, str(e))
    
    # =========================================================================
    # Test 12: SceneInspector - Get Light Summary
    # =========================================================================
    try:
        lights = inspector.get_light_summary()
        passed = isinstance(lights, list)
        log_test("SceneInspector.get_light_summary()", passed,
                 f"Found {len(lights)} lights")
    except Exception as e:
        log_test("SceneInspector.get_light_summary()", False, str(e))
    
    # =========================================================================
    # Test 13: SceneInspector - Find Actors By Class
    # =========================================================================
    try:
        dir_lights = inspector.find_actors_by_class('DirectionalLight')
        passed = isinstance(dir_lights, list)
        log_test("SceneInspector.find_actors_by_class()", passed,
                 f"Found {len(dir_lights)} DirectionalLights")
    except Exception as e:
        log_test("SceneInspector.find_actors_by_class()", False, str(e))
    
    # =========================================================================
    # Summary
    # =========================================================================
    unreal.log("")
    unreal.log("=" * 60)
    passed_count = sum(1 for _, p in results if p)
    total_count = len(results)
    unreal.log(f"RESULTS: {passed_count}/{total_count} tests passed")
    
    if passed_count == total_count:
        unreal.log("✓ All tests passed!")
    else:
        unreal.log("✗ Some tests failed - check details above")
    unreal.log("=" * 60)
    
    return passed_count == total_count


# Run tests
if __name__ == '__main__':
    run_tests()
else:
    # When exec'd, run automatically
    run_tests()
