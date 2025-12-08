# Phase 2.1 - UI Automation Feasibility Test

**Project Location**: `D:\UE5_Projects\UEScenarioFactory\Content\ScenarioLevels`  
**Unreal Engine**: 5.6

## What This Test Does

This test verifies if the Unreal Python API can:

1. ✅ Open/close specific editor windows
2. ✅ Control the Details Panel (expand properties, make settings visible)
3. ✅ Manipulate Material Editor nodes
4. ✅ Control Animation Blueprint editor
5. ✅ Take screenshots of different UI states

## How to Run

### Option 1: Run from Unreal Python Console (Recommended)

1. Open your UE5.6 project at `D:\UE5_Projects\UEScenarioFactory`
2. Open the **Python console** (Tools → Execute Python Script)
3. Copy and paste this:

```python
import sys
sys.path.append(r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\tests")
import test_ui_automation
test_ui_automation.run_feasibility_test()
```

### Option 2: Using Output Log

1. Open your UE5.6 project
2. Open **Output Log** (Window → Developer Tools → Output Log)
3. Type `py` and press Enter to start Python mode
4. Paste the same code as Option 1

## Expected Output

The test will print results like:

```
============================================================
UI AUTOMATION FEASIBILITY TESTS - Phase 2.1
============================================================

[TEST 1] Window Control
✓ Level Editor Subsystem accessible
...

============================================================
FEASIBILITY TEST SUMMARY
============================================================

✓ Window Control: SUCCESS
⚠ Details Panel: PARTIAL
...

RECOMMENDATION:
✓ Full automation appears FEASIBLE - proceed with implementation
============================================================
```

## What the Results Mean

- **SUCCESS** (✓): Fully supported, ready to use
- **PARTIAL** (⚠): Partially supported, may need workarounds
- **FAILED** (✗): Not supported by Python API
- **UNKNOWN** (?): Needs more investigation

## Next Steps Based on Results

### If FEASIBLE (3+ SUCCESS)

→ Proceed to Phase 2.2 - Build full automation pipeline

### If PARTIAL (mixed results)

→ Design hybrid approach (automated + manual steps)

### If NOT FEASIBLE

→ Use manual screenshot workflow with Unreal project template

## Important Notes

- Make sure you have at least 1 actor in your level for the Details Panel test
- The test will create a screenshot at `D:/temp/test_screenshot.png` 
  - This cant happen it should be the UE5 project folder
- This is a READ-ONLY test - it won't modify your project

## Troubleshooting

**Error: "No module named 'unreal'"**

- You're running this outside of UE5. Must run IN the Unreal Editor.

**Error: "PythonScriptPlugin not enabled"**

- Enable the Python Plugin: Edit → Plugins → Search "Python" → Enable → Restart

**Import errors**

- Make sure the path in `sys.path.append()` matches your actual file location
