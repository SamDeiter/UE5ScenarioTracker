# Unreal Screenshot Generation Guide

## Current Status

✅ Found complete Unreal automation system in `unreal_scripts/`
✅ Scene setup data already exists in `scenarios/directional_light.js`

## Prerequisites Check

### 1. Verify Required Scripts Exist

Check if these exist in `unreal_scripts/`:

- [ ] `SceneBuilder.py` - Sets up scene from sceneSetup JSON
- [ ] `SceneExporter.py` - Exports scene specifications
- [ ] `ScreenshotCapture.py` ✅ (confirmed)
- [ ] `AutoGenerateScenarios.py` ✅ (confirmed)

### 2. Unreal Engine Project Setup

Need to confirm:

- [ ] Path to `.uproject` file
- [ ] `ScenarioCapture_Level` level exists
- [ ] Python plugin enabled in UE5

## Next Steps

### Step 1: Create Extraction Script

Create Python script to extract sceneSetup data from `directional_light.js` and generate JSON spec file for Unreal.

### Step 2: Generate JSON Spec

Run extraction to create `directional_light_spec.json` with format:

```json
{
  "scenarioId": "directional_light",
  "steps": [
    {"stepId": "step-1", "sceneSetup": {...}},
    {"stepId": "step-2", "sceneSetup": {...}}
    ...
  ]
}
```

### Step 3: Run Unreal Automation

Execute from Unreal Engine Python console or via command line.

## Questions for User

1. Which Unreal project should we use?
2. Do the SceneBuilder.py and SceneExporter.py files exist?
3. Is ScenarioCapture_Level already created?
