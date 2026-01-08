# Quick Start: Generate Screenshots in Unreal

## Step 1: Copy Files

```powershell
# Copy spec file to Unreal project
Copy-Item "directional_light_spec.json" "D:\UE5_Projects\UEScenarioFactory\"

# Copy Python scripts (if not already there)
Copy-Item "unreal_scripts\*" "D:\UEScenarioFactory\Content\Python\" -Recurse
```

## Step 2: Open Unreal Editor

1. Open `D:\UE5_Projects\UEScenarioFactory\UEScenarioFactory.uproject`
2. **IMPORTANT**: Do NOT use headless mode - screenshots require the UI!

## Step 3: Run Automation

**In Unreal Editor**:

1. Go to: **Tools → Execute Python Script** (or Ctrl+Shift+P)
2. Paste this code:

```python
import sys
sys.path.append('D:/UE5_Projects/UEScenarioFactory/Content/Python')

from AutoGenerateScenarios import generate_scenario_assets

spec_file = "D:/UE5_Projects/UEScenarioFactory/directional_light_spec.json"
output_path = "C:/Users/Sam Deiter/Documents/GitHub/UE5ScenarioTracker/assets/generated"

generate_scenario_assets(spec_file, output_path)
```

3. Click **Execute**

## Step 4: Wait for Completion

The script will:

- Process 4 steps (step-1, step-2, step-3, conclusion)
- Create landscapes, lights, and camera positions
- Capture 1920x1080 PNG screenshots
- Save to `assets/generated/`

**Total time**: ~2-3 minutes (with all the wait times for screenshot completion)

## Step 5: Verify Output

Check that these files exist:

```
assets/generated/
  ├── step1.png
  ├── step2.png
  ├── step3.png
  └── conclusion.png
```

## Step 6: Test in Web App

1. Refresh <http://localhost:8000>
2. Click "Abrupt Shadow Disappearance in Distant View"
3. Verify screenshots display correctly

## Troubleshooting

- **"Module not found"**: Check Python scripts are in `Content/Python/`
- **Black screenshots**: Increase wait times further or check lighting
- **Unreal closes**: Make sure you're running in Editor, not headless mode
