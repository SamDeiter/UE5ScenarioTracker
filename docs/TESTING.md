# Quick Start: Testing the Automation Pipeline

## Prerequisites

1. **UEScenarioFactory Project**
   - Location: `D:\UE5_Projects\UEScenarioFactory` (or set `UESCENARIO_FACTORY` env var)
   - UE version: 5.6 (or 5.5+)

2. **Python Plugin Enabled**
   - Edit `UEScenarioFactory/Config/DefaultEngine.ini`
   - Add under `[Plugins]`:

     ```ini
     PythonScriptPlugin=True
     ```

3. **Basic Landscape**
   - Create a simple landscape in `UEScenarioFactory`
   - Save as default level or `ScenarioCapture_Level`

## Test Run: directional_light Scenario

### Step 1: Export Scene Specs

```bash
cd C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker
node tools/exportSceneSpecs.js directional_light
```

**Expected output:**

```
============================================================
Extracting scene specs: directional_light
============================================================

Found 5 steps
  ✓ step-1: Diagnosing the Shadow Cutoff
  ✓ step-2: Fixing Low Resolution Shadows
  ✓ step-3: Final Verification
  ✓ conclusion: Scenario Complete

✅ Scene specs exported:
   D:\temp\directional_light_spec.json
   Steps: 4
```

### Step 2: Generate Assets in Unreal

```bash
node tools/generateScenarioAssets.js directional_light
```

This will:

1. Copy Python scripts to UEScenarioFactory
2. Launch Unreal Editor (headless)
3. Run AutoGenerateScenarios.py
4. Generate 4 screenshots + JSON specs
5. Exit Unreal

**Expected duration:** 2-5 minutes

**Output location:**

- `D:\UE5_Projects\UEScenarioFactory\Content\Scenarios\directional_light\`
  - `step1.png` (shadow cutoff visible)
  - `step2.png` (extended but pixelated)
  - `step3.png` (clean shadows)
  - `conclusion.png` (final beauty shot)
  - `step1.json`, `step2.json`, etc. (scene specs)

### Step 3: Import to UE5ScenarioTracker

```bash
node tools/importScenarioAssets.js
```

**Expected output:**

```
Copying: directional_light/step1.png → public/scenarios/directional_light/step1.png
Copying: directional_light/step2.png → public/scenarios/directional_light/step2.png
...
✅ Import complete
   Files: 8
   Scenarios: 1
```

### Step 4: Verify in Browser

1. Start dev server: `npm start` (or your local server)
2. Open: `http://localhost:8080`
3. Navigate to directional_light scenario
4. Check that screenshots appear in each step

## Troubleshooting

#### "UEScenarioFactory project not found"

- Set environment variable: `$env:UESCENARIO_FACTORY="D:\your\path"`
- Or edit `tools/generateScenarioAssets.js` line 10

#### "Landscape not found"  

- Create a basic landscape in UE before running
- Or modify scenes_spec to not require landscape

#### Python errors in Unreal

- Check `UEScenarioFactory/Saved/Logs/` for Python traceback
- Verify Python plugin is enabled

#### Unreal hangs/crashes

- Check Task Manager - may need to kill UnrealEditor-Cmd.exe
- Try running with Unreal Editor open (not -Cmd) for debugging

## Next Steps

Once pilot scenario works:

1. Capture UI templates (Phase 3)
2. Test with more scenarios
3. Build validation UI
4. Create one-command master workflow
