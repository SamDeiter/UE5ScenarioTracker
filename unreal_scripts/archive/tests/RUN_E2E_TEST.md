# End-to-End Test - Screenshot Automation Pipeline

**Goal**: Test the full automation workflow: Scene Setup → Screenshot → Export

---

## Prerequisites

1. ✅ Unreal Engine 5 is open with `UEScenarioFactory` project
2. ✅ `WindowsPrintScreen.py` is updated and working
3. ✅ `AutoGenerateScenarios.py` is updated with new imports

---

## Test Steps

### 1. Open Unreal Python Console

Press **`** (backtick key) or go to **Tools → Execute Python Command**

### 2. Run Test Automation

Copy and paste this into the UE Python console:

```python
import sys
sys.path.insert(0, r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\core")

# Import the automation script
from AutoGenerateScenarios import generate_scenario_assets

# Run with test spec
spec_file = r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\tests\directional_light_test_spec.json"
output_path = r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\scenarios"

generate_scenario_assets(spec_file, output_path)
```

### 3. Expected Output

You should see in the console:

```
╔====================================================================╗
║               Scenario Asset Generation                           ║
╚====================================================================╝

Scenario: directional_light
Steps: 3

[1/3] Processing step_1...
...
[2/3] Processing step_2...
...
[3/3] Processing step_3...
...
╔====================================================================╗
║                    Generation Complete!                           ║
╚====================================================================╝
Output: C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\scenarios\directional_light
```

### 4. Verify Generated Files

Check that these files/folders exist:

```
scenarios/
└── directional_light/
    ├── images/
    │   ├── step_1.bmp  ✅
    │   ├── step_2.bmp  ✅
    │   └── step_3.bmp  ✅
    ├── step_1.json
    ├── step_2.json
    └── step_3.json
```

### 5. Verify Screenshots

1. Navigate to `scenarios/directional_light/images/`
2. Open each BMP file in Windows Photo Viewer
3. Verify images show:
   - Full Unreal Editor window
   - Scene with DirectionalLight and cube
   - Details Panel visible
   - UI elements captured

---

## Success Criteria

- [x] Script runs without errors
- [x] 3 BMP files created in `images/` folder
- [x] 3 JSON files created for each step
- [x] BMPs are readable and show full UI
- [x] File size ~3-4 MB per BMP

---

## Troubleshooting

**If you see "module not found" errors:**

- Restart Unreal Editor to clear Python cache
- Re-run the import commands

**If screenshots are corrupt/unreadable:**

- Check `WindowsPrintScreen.py` for proper BMP header encoding
- Verify window title matches "UEScenarioFactory - Unreal Editor"

**If no files created:**

- Check output path exists and has write permissions
- Look for error messages in console

---

## Next Steps After Success

Once this test passes:

1. Update web app to load images (game.js)
2. Test full scenario with all steps
3. Scale to other scenarios

---

**Ready to test!** 🚀
