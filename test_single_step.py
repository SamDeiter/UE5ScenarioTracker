import sys
import time
import importlib
import traceback

sys.path.append('C:/Users/sam.deiter/Documents/Unreal Projects/UEScenarioFactory/Content/Python')

# Force reload
if 'SceneBuilder' in sys.modules:
    importlib.reload(sys.modules['SceneBuilder'])
if 'ScreenshotCapture' in sys.modules:
    importlib.reload(sys.modules['ScreenshotCapture'])
if 'AutoGenerateScenarios' in sys.modules:
    importlib.reload(sys.modules['AutoGenerateScenarios'])

import unreal

# Test just the first step with detailed error output
from SceneBuilder import SceneBuilder
from ScreenshotCapture import ScreenshotCapture

# Load spec
import json
with open("C:/Users/sam.deiter/Documents/Unreal Projects/UEScenarioFactory/directional_light_spec.json", 'r') as f:
    spec_data = json.load(f)

step = spec_data['steps'][0]  # Just step-1
scene_setup = step['sceneSetup']

unreal.log("Testing single step generation...")

try:
    # Setup scene
    builder = SceneBuilder()
    builder.setup_scene(scene_setup)
    
    unreal.log("Scene setup complete, waiting 5 seconds...")
    time.sleep(5.0)
    
    # Capture screenshot
    screenshot = ScreenshotCapture()
    output_dir = "C:/Users/sam.deiter/Documents/Unreal Projects/UEScenarioFactory/Content/Scenarios/directional_light"
    screenshot.capture(output_dir, "test_step1", resolution=(1920, 1080))
    
    unreal.log("SUCCESS! Screenshot captured")
    
except Exception as e:
    unreal.log_error(f"FAILED: {e}")
    unreal.log_error(traceback.format_exc())
