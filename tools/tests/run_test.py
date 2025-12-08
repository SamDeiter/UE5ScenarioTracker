import sys
import time
import importlib

# Add path
sys.path.append('C:/Users/sam.deiter/Documents/Unreal Projects/UEScenarioFactory/Content/Python')

# Force reload of modules to clear cache
if 'SceneBuilder' in sys.modules:
    importlib.reload(sys.modules['SceneBuilder'])
if 'AutoGenerateScenarios' in sys.modules:
    importlib.reload(sys.modules['AutoGenerateScenarios'])

from AutoGenerateScenarios import generate_scenario_assets

spec_file = "C:/Users/sam.deiter/Documents/Unreal Projects/UEScenarioFactory/directional_light_spec.json"
output_path = "C:/Users/sam.deiter/Documents/Unreal Projects/UEScenarioFactory/Content/Scenarios"

generate_scenario_assets(spec_file, output_path)
