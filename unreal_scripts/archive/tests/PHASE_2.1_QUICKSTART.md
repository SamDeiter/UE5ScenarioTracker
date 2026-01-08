# Phase 2.1 Quick Start Guide

## 🎯 Objective

Verify that Unreal Engine 5.6 Python API supports the automation we need before building the full pipeline.

## 📋 Prerequisites

- ✅ UE5.6 Project: `D:\UE5_Projects\UEScenarioFactory`
- ✅ Python Plugin enabled in Unreal Engine
- ✅ At least one Directional Light in your scene

## 🚀 Step-by-Step Instructions

### Step 1: Open Your UE5 Project

1. Launch Unreal Engine 5.6
2. Open project: `D:\UE5_Projects\UEScenarioFactory`
3. Load level: `Content\ScenarioLevels` (or any level with a directional light)

### Step 2: Enable Python Plugin (if not already enabled)

1. Go to **Edit → Plugins**
2. Search for "Python"
3. Enable **Python Script Plugin**
4. Restart Unreal Engine if prompted

### Step 3: Run Feasibility Test

1. Open **Output Log**: Window → Developer Tools → Output Log
2. Switch to **Python** tab in Output Log (or type `py` in the console)
3. Copy and paste this code:

```python
import sys
sys.path.append(r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\tests")
import test_ui_automation
results = test_ui_automation.run_feasibility_test()
```

4. Press **Enter** to execute

### Step 4: Review Results

You should see output like:

```
============================================================
UI AUTOMATION FEASIBILITY TESTS - Phase 2.1
============================================================

[TEST 1] Window Control
[TEST 2] Details Panel Control
[TEST 3] Material Editor Control
[TEST 4] Animation Blueprint Control
[TEST 5] Screenshot Capabilities

============================================================
RECOMMENDATION:
✓ Full automation appears FEASIBLE
============================================================
```

### Step 5: Run Pilot Test (Generate 4 Screenshots)

If the feasibility test looks good, run the pilot test:

```python
import sys
sys.path.append(r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\tests")
import pilot_test_generator
pilot_test_generator.run_pilot_test()
```

This will generate 4 screenshots at: `D:\temp\pilot_test\`

## 📊 What to Check

After running both tests, check:

1. **Feasibility Results**: Are we getting mostly SUCCESS or PARTIAL?
2. **Screenshots**: Do the 4 images exist at `D:\temp\pilot_test\`?
3. **Image Quality**: Are the screenshots showing different views/states?

## ✅ Success Criteria

- [ ] Feasibility test completes without major errors
- [ ] At least 3 of 5 tests show SUCCESS or PARTIAL
- [ ] 4 distinct screenshots are generated
- [ ] Screenshots show meaningful differences (camera angles, UI states, or settings)

## 🔄 Next Steps

### If Tests Pass

→ Update `docs/NEXT_STEPS.md` to mark Phase 2.1 as COMPLETE
→ Move to Phase 2.2: Build full automation pipeline

### If Tests Fail

→ Document which specific features are NOT available
→ Design hybrid approach (manual + automated)
→ Consider alternative screenshot workflow

## 🐛 Troubleshooting

**"No module named 'unreal'"**
→ You must run this code INSIDE Unreal Editor, not in a regular terminal

**"PythonScriptPlugin not enabled"**
→ Follow Step 2 above to enable the plugin

**"No directional light found"**
→ Add a Directional Light to your scene: Place Actors → Lights → Directional Light

**Import errors**
→ Double-check the path in `sys.path.append()` matches your actual GitHub repo location

## 📝 Document Your Findings

After running the tests, please note:

1. Which tests succeeded/failed?
2. Can we control the Details Panel?
3. Can we open Material Editor programmatically?
4. Any limitations or workarounds needed?

Share these findings so we can design the best automation approach!
