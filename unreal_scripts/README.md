# Unreal Engine Automation Scripts

Python scripts for automated scene setup, screenshot capture, and asset generation in Unreal Engine.

Implements best practices from the **AI Agent Integration Framework** (see `Help.md`).

## Directory Structure

```text
unreal_scripts/
├── core/                    # Production-ready modules
│   ├── AgentUtils.py        # Core utilities for AI agent patterns
│   ├── SceneBuilder.py      # Sets up UE scenes from JSON specs
│   ├── SceneExporter.py     # Exports scene state to JSON
│   ├── SceneInspector.py    # Scene analysis and introspection
│   └── AutoGenerateScenarios.py  # Main orchestration script
├── experimental/            # Work-in-progress and test scripts
└── tests/                   # Test and validation scripts
```

## Core Modules

### AgentUtils.py

Central utilities implementing Help.md best practices:

| Class | Purpose | Help.md Section |
|-------|---------|-----------------|
| `EditorSubsystems` | Modern UE5 subsystem access | 2.2 Short-Term Memory |
| `AssetInspector` | Query Asset Registry without loading | 2.1 Long-Term Memory |
| `APIIntrospector` | Dynamic API discovery & validation | 1.2 Reflection System |
| `SpatialSensor` | Raycasting for placement | 2.3 Geometrical Perception |
| `AsyncTaskRunner` | Time-sliced operations | 1.3 Threading |
| `ErrorRecovery` | Log parsing & error handling | 2.4 Feedback Mechanisms |
| `HISMOptimizer` | Batch mesh instancing | 4.2 HISM Pattern |

**Example Usage:**

```python
from AgentUtils import EditorSubsystems, AssetInspector

# Use modern subsystem
actors = EditorSubsystems.get_all_actors()

# Check asset exists before loading
if AssetInspector.asset_exists("/Game/Materials/M_Example"):
    material = unreal.load_asset("/Game/Materials/M_Example")
```

### SceneInspector.py

Scene analysis and verification:

```python
from SceneInspector import SceneInspector

inspector = SceneInspector()

# Capture scene state
snapshot = inspector.get_scene_snapshot()

# Verify against specification
result = inspector.verify_scene_against_spec(expected_spec)
if not result['valid']:
    for error in result['errors']:
        print(error)

# Generate human-readable report
inspector.generate_report("scene_report.txt")
```

## Installation

1. Copy these scripts to `D:\UE5_Projects\UEScenarioFactory\Content\Python\`
2. Enable Python plugin in UE5 project (`Config/DefaultEngine.ini`):

   ```ini
   [Plugins]
   PythonScriptPlugin=True
   ```

3. Restart Unreal Engine

## Usage

### From Node.js (Automated)

```bash
# From UE5ScenarioTracker project
node tools/generateScenarioAssets.js directional_light
```

### From Unreal Editor (Manual)

```python
# In Unreal Python console
import AutoGenerateScenarios
AutoGenerateScenarios.generate_scenario_assets(
    "D:/temp/directional_light_spec.json",
    "D:/UE5_Projects/UEScenarioFactory/Content/Scenarios"
)
```

### Time-Sliced Operations (Non-Blocking)

Use `AsyncTaskRunner` for long operations that shouldn't freeze the editor:

```python
from AgentUtils import AsyncTaskRunner

def my_task():
    for i in range(100):
        # Do work...
        yield  # Return control to editor

runner = AsyncTaskRunner()
runner.run_async(my_task(), on_complete=lambda: print("Done!"))
```

## Scene Specification Format

Scene specs are extracted from scenario `.js` files:

```javascript
sceneSetup: {
    level: "ScenarioCapture_Level",
    actors: [
        {
            id: "directional_light",
            type: "DirectionalLight",
            transform: { location: [0, 0, 500], rotation: [-45, 0, 0] },
            intensity: 3.0
        }
    ],
    camera: {
        location: [0, -800, 200],
        rotation: [-10, 0, 0]
    }
}
```

### Internal Capture (Automated)

The `ManualCapture.py` script now supports internal high-resolution capture:

```python
import ManualCapture
# Set up scene AND take a 1080p screenshot after 10 frames
ManualCapture.setup('directional_light', 'step-0', capture=True)
```

## Output

Generated assets are saved to:

- Screenshots: `Content/Scenarios/{scenarioId}/step*.png`
- Scene Specs: `Content/Scenarios/{scenarioId}/step*.json`

## Best Practices (from Help.md)

1. **Use Modern Subsystems** over legacy `EditorLevelLibrary`
2. **Query Asset Registry** before loading to avoid RAM exhaustion
3. **Time-Slice Long Operations** with `register_slate_post_tick_callback`
4. **Validate Assets** before use with `AssetInspector.asset_exists()`
5. **Use HISM** for batching identical static meshes
6. **Monitor Logs** for error recovery opportunities
