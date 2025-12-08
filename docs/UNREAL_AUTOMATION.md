# Unreal Engine Screenshot Generation - Step-by-Step Guide

## ✅ Completed

- [x] Created `directional_light_spec.json` with 4 step configurations
- [x] Verified all Unreal automation scripts exist (`SceneBuilder.py`, `ScreenshotCapture.py`, etc.)
- [x] Confirmed Unreal project path: `D:\UE5_Projects\UEScenarioFactory`

## Files Created

### 1. directional_light_spec.json (479 lines)

Located at: `C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\directional_light_spec.json`

Contains 4 steps:

- **step-1**: Shadow cutoff problem (shadows cut at ~50m)
- **step-2**: Extended shadows but pixelated (500m but blocky)
- **step-3**: Clean extended shadows (500m with 8 cascades)
- **conclusion**: Final beauty shot (elevated camera angle)

Each step includes:

- DirectionalLight configuration (position, intensity, color, shadow settings)
- Landscape actor (127x127 terrain)
- Sky Sphere and Sky Light
- Camera position and FOV
- Post-process settings
- UI configuration (viewport only, no grid)

## Next Steps: Run in Unreal Engine

### Step 1: Copy Files to Unreal Project

```powershell
# Copy the spec file
Copy-Item "C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\directional_light_spec.json" "D:\UE5_Projects\UEScenarioFactory\directional_light_spec.json"

# Copy Unreal scripts (if not already there)
Copy-Item "C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\*" "D:\UE5_Projects\UEScenarioFactory\Content\Python\" -Recurse
```

### Step 2: Open Unreal Editor

1. Open `D:\UE5_Projects\UEScenarioFactory\UEScenarioFactory.up roject`
2. Wait for project to load
3. Ensure Python Editor Script Plugin is enabled

### Step 3: Create Output Directory

Create folder for screenshots:
`D:\UE5_Projects\UEScenarioFactory\Content\Scenarios\directional_light\`

### Step 4: Run Automation Script

**Option A: From Unreal Python Console**

1. Open: Tools → Execute Python Script
2. Paste this code:

```python
import sys
sys.path.append('D:/UE5_Projects/UEScenarioFactory/Content/Python')

from AutoGenerateScenarios import generate_scenario_assets

spec_file = "D:/UE5_Projects/UEScenarioFactory/directional_light_spec.json"
output_path = "D:/UE5_Projects/UEScenarioFactory/Content/Scenarios"

generate_scenario_assets(spec_file, output_path)
```

**Option B: From Command Line** (Advanced)

```powershell
"C:\Program Files\Epic Games\UE_5.X\Engine\Binaries\Win64\UnrealEditor-Cmd.exe" `
  "D:\UE5_Projects\UEScenarioFactory\UEScenarioFactory.uproject" `
  -ExecutePythonScript="path/to/run_automation.py"
```

### Step 5: Monitor Progress

Watch the Output Log in Unreal for:

- "Generating: directional_light / step-1"
- Screenshot capture confirmations
- "✓ step-1 complete"
- Repeat for all 4 steps

### Step 6: Verify Output

Check that these files were created:

```
D:\UE5_Projects\UEScenarioFactory\Content\Scenarios\directional_light\
  ├── step1.png
  ├── step2.png
  ├── step3.png
  └── conclusion.png
```

### Step 7: Copy Screenshots Back

```powershell
# Create output directory if needed
New-Item -ItemType Directory -Force "C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\assets\generated"

# Copy screenshots
Copy-Item "D:\UE5_Projects\UEScenarioFactory\Content\Scenarios\directional_light\*.png" `
          "C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\assets\generated\"

# Rename to match expected filenames
Rename-Item "assets\generated\step1.png" "directional_light_step-1.png"
Rename-Item "assets\generated\step2.png" "directional_light_step-2.png"
Rename-Item "assets\generated\step3.png" "directional_light_step-3.png"
Rename-Item "assets\generated\conclusion.png" "directional_light_conclusion.png"
```

### Step 8: Test in Web App

1. Ensure server is running: `python -m http.server 8000`
2. Open <http://localhost:8000>
3. Click "Abrupt Shadow Disappearance in Distant View"
4. Verify all 4 screenshots display correctly

## Troubleshooting

### Issue: "Level not found: ScenarioCapture_Level"

**Solution**: Create the level in Unreal or update spec file with existing level name

### Issue: "Module 'SceneBuilder' not found"

**Solution**: Verify Python scripts are in `Content/Python/` directory

### Issue: Screenshots are black/empty

**Solution**:

- Increase wait time in script (currently 3 seconds)
- Manually verify scene builds correctly
- Check lighting settings

### Issue: Wrong camera angle

**Solution**:

- Verify camera coordinates in spec file
- Check FOV setting (should be 90)
- Ensure camera is not inside geometry

## Expected Results

Each screenshot should show:

- **step-1**: Outdoor scene, shadows visible near camera, cutting off abruptly ~50m
- **step-2**: Same scene, shadows now extend far but appear pixelated/blocky
- **step-3**: Clean shadows extending full 500m, high quality
- **conclusion**: Wide angle beauty shot from elevated position

Resolution: 1920x1080
Format: PNG
Location: `assets/generated/directional_light_*.png`
