# EUW_CaptureController User Guide

This document provides step-by-step instructions for the **Editor Utility Widget (EUW)** that controls captures in Unreal Engine 5.

> [!IMPORTANT]
> This is a **No C++** implementation. All logic is Python invoked via Blueprint's `Execute Console Command` node.

---

## Quick Start

### 1. Initialize Python Path

Before using the EUW, run this **once** in the Output Log:

```
py exec(open(r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\core\ue5_init.py").read())
```

You should see: `[UE5_Init] ✅ All capture modules loaded successfully!`

> [!TIP]
> For permanent setup, add the script to **Edit > Project Settings > Plugins > Python > Startup Scripts**.

### 2. Run the EUW

Right-click `EUW_CaptureController` in the Content Browser → **Run Editor Utility Widget**

### 3. Capture

1. Enter a **Scenario ID** (e.g., `TestCapture`)
2. Select a **Mode**:
   - **VIEWPORT** - 3D viewport only
   - **EDITOR_UI** - Full editor window with panels
   - **FULL** - Same as VIEWPORT
3. Click **Capture**

Screenshots save to: `assets/generated/<ScenarioID>/`

---

## Capture Modes

| Mode | What's Captured | Use Case |
|------|----------------|----------|
| **VIEWPORT** | 3D viewport screenshot | In-game scenes |
| **EDITOR_UI** | Full Level Editor window | Tutorial screenshots showing panels |
| **FULL** | Same as VIEWPORT | Default option |

---

## Blueprint Setup (Reference)

The working Blueprint configuration uses **Execute Console Command** with **Format Text**:

### Capture Button

```
On Clicked (Capture)
    ↓
Format Text
  Format: "py import bp_capture_bridge; bp_capture_bridge.trigger_capture('{0}', '{1}', False)"
  {0} ← TextBox Get Text (ScenarioID)
  {1} ← ComboBox Get Selected Option (Mode)
    ↓
Execute Console Command (Command ← Format Text Result)
    ↓
Print String ("Capture Requested - Check Output Log")
```

### Dry Run Button

```
On Clicked (DryRun)
    ↓
Format Text
  Format: "py import bp_capture_bridge; bp_capture_bridge.trigger_capture('{0}', '{1}', True)"
  {0} ← TextBox Get Text
  {1} ← ComboBox Get Selected Option
    ↓
Execute Console Command (Command ← Format Text Result)
    ↓
Print String ("Dry Run Complete")
```

> [!WARNING]
> The **Format Text Result** MUST be connected via wire to **Execute Console Command**. Do NOT type the format string directly into Execute Console Command - it won't substitute the values.

---

## Troubleshooting

### "ModuleNotFoundError: No module named 'bp_capture_bridge'"

Run the init script:

```
py exec(open(r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts\core\ue5_init.py").read())
```

### Values show as `{0}` and `{1}` instead of actual values

The Format Text Result isn't wired to Execute Console Command. Connect the wire, don't type the template.

### EDITOR_UI captures wrong window (Blueprint editor instead of Level Editor)

Run the init script to reload the modules - the updated code targets the main Level Editor window by title.

### Command works in Output Log but not from Blueprint

Check the Output Log for the `Cmd:` line. It should start with `py` (with space). If missing, add `py` to the start of your Format Text format string.

---

## Testing Commands (Output Log)

```python
# Check readiness
py import bp_capture_bridge; print(bp_capture_bridge.get_capture_readiness())

# Dry run capture
py import bp_capture_bridge; bp_capture_bridge.trigger_capture('TestScenario', 'EDITOR_UI', True)

# Actual capture
py import bp_capture_bridge; bp_capture_bridge.trigger_capture('TestScenario', 'EDITOR_UI', False)

# List available modes
py import bp_capture_bridge; print(bp_capture_bridge.get_capture_modes())
```

---

## File Locations

| File | Purpose |
|------|---------|
| `unreal_scripts/core/ue5_init.py` | Path setup, module loading |
| `unreal_scripts/core/CaptureService.py` | Core capture logic |
| `unreal_scripts/core/bp_capture_bridge.py` | Blueprint-callable functions |
| `assets/generated/<ScenarioID>/` | Output screenshots |
