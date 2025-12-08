# Unreal Engine Automation Scripts

Python scripts for automated scene setup, screenshot capture, and asset generation in Unreal Engine.

## Files

- **`SceneBuilder.py`** - Sets up UE scenes from JSON specifications
- **`ScreenshotCapture.py`** - Captures high-resolution screenshots
- **`SceneExporter.py`** - Exports scene state to JSON
- **`AutoGenerateScenarios.py`** - Main orchestration script

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

## Supported Actor Types

- **Lights**: DirectionalLight, PointLight, SkyLight
- **Meshes**: StaticMeshActor
- **Environment**: Landscape
- **Blueprints**: Any BP_ prefixed class

## Output

Generated assets are saved to:

- Screenshots: `Content/Scenarios/{scenarioId}/step*.png`
- Scene Specs: `Content/Scenarios/{scenarioId}/step*.json`
