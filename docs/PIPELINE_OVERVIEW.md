# UE5 Scenario Tracker - Complete Pipeline

## Overview

This tool has **3 main parts** that work together:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  1. GENERATE    │───▶│  2. SETUP       │───▶│  3. CAPTURE     │
│  Scenarios      │    │  Scenes in UE5  │    │  Screenshots    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                     │                       │
         ▼                     ▼                       ▼
   scenarios/*.js        UE5 Level Setup        assets/generated/
   (questions,           (actors, lights,       (PNG images for
    choices, steps)       camera positions)      web quiz)
```

---

## Part 1: GENERATE Scenarios

**Purpose:** Create the quiz content - questions, steps, choices, and scene specifications.

### Methods

1. **ChatGPT/AI Generation** - Use prompt from `docs/CHATGPT_PROMPT.md`
2. **Manual Creation** - Write scenario JS files directly
3. **Generator GUI** - Run `StartGeneratorGUI.bat`

### Output

- `scenarios/{scenario_name}.js` - Contains:
  - `meta` - Title, description, category, estimated time
  - `steps` - Each quiz step with:
    - `prompt` - The question text
    - `choices` - Answer options
    - `sceneSetup` - What UE5 should look like for this step

### Example Structure

```javascript
window.SCENARIOS['my_scenario'] = {
    meta: { title: "...", category: "Lighting" },
    steps: {
        'step-1': {
            prompt: "What causes this issue?",
            choices: [...],
            sceneSetup: {
                actors: [...],
                lighting: [...],
                camera: { location: [...], rotation: [...] }
            }
        }
    }
}
```

---

## Part 2: SETUP Scenes in UE5

**Purpose:** Configure UE5 to visually show what the scenario describes.

### Current Approach

The `sceneSetup` in each step describes what the scene should look like:

- **Actors** - What objects exist (landscape, cubes, etc.)
- **Lighting** - Light types, positions, settings
- **Camera** - Where to view from

### Challenge

Some visual differences (like shadow distance changes) are **hard to show** without:

- Actual objects casting shadows at different distances
- Proper scene composition to demonstrate the problem

### Scripts

| Script | Purpose |
|--------|---------|
| `SceneBuilder.py` | Spawns/configures actors from specs |
| `CameraOnlyCapture.py` | Just positions camera (doesn't modify scene) |

### Recommendation

For complex scenarios, **manually set up a base scene** in UE5 first, then use automation for camera positioning only.

---

## Part 3: CAPTURE Screenshots

**Purpose:** Take screenshots from UE5 for each scenario step.

### Methods

| Method | Pros | Cons |
|--------|------|------|
| `WindowsPrintScreen.py` | Captures full window with UI | Requires window focus |
| `HighResShot` command | Native UE, high quality | Hides UI |
| Manual (F9) | Full control | Tedious for many screenshots |

### Current Script

`CameraOnlyCapture.py` uses:

1. `pilot_level_actor()` - Position camera
2. `WindowsPrintScreen` - Capture full window with UI

### Output

Screenshots go to the scenario's `images/` folder for use in the web quiz.

---

## Complete Workflow

### Step 1: Create Scenario Content

```
1. Use ChatGPT with docs/CHATGPT_PROMPT.md
2. Convert JSON to JS: python tools/python/convert_scenario.py
3. Result: scenarios/my_scenario.js
```

### Step 2: Prepare UE5 Scene

```
1. Open UE5 project (D:\UE5_Projects\UEScenarioFactory)
2. Set up base scene manually:
   - Add landscape/ground
   - Add shadow-casting objects at various distances
   - Set up lighting
3. Save as reusable level
```

### Step 3: Generate Screenshots

```python
# In UE5 Python console:
import CameraOnlyCapture
CameraOnlyCapture.run_captures('D:/path/to/output')
```

### Step 4: Copy to Web App

```powershell
Copy-Item "D:\UE5_Projects\...\images\*" "C:\...\UE5ScenarioTracker\assets\generated\"
```

### Step 5: Test in Browser

```
http://localhost:8000
```

---

## File Locations

| What | Where |
|------|-------|
| Scenario definitions | `scenarios/*.js` |
| Web app | `index.html`, `game.js` |
| UE5 Python scripts | `unreal_scripts/core/` |
| Generated images | `assets/generated/` |
| Documentation | `docs/` |

---

## Current Status: Pilot Test

We're testing with **one scenario** (`directional_light`) to validate the pipeline before scaling to all scenarios.

### What Works

- ✅ Web app loads and runs scenarios
- ✅ WindowsPrintScreen captures full window
- ✅ pilot_level_actor positions camera

### What Needs Work

- ⚠️ Scene setup automation (SceneBuilder clears lights)
- ⚠️ Camera rotation issues (being debugged)
- ⚠️ Visual differences between steps (need proper scene objects)

---

## Next Steps

1. **Test camera positioning** with pilot_level_actor
2. **Document base scene requirements** for each scenario type
3. **Create reusable UE5 levels** for common scenarios (Lighting, Physics, etc.)
4. **Scale up** once pilot test passes
