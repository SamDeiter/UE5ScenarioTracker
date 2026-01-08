# Scenario Generation Workflow - Quick Start

## Setup Complete ✅

Your UE5 Scenario Tracker is ready with:

- Debug menu (always visible with Prev/Next/Skip buttons)
- Working assessment app (all answers advance, no dead ends)
- ChatGPT prompt template for generating scenarios

---

## Generate New Scenarios (3 Steps)

### Step 1: Generate in ChatGPT

1. Open ChatGPT (GPT-4 recommended)
2. Copy the entire prompt from [`docs/CHATGPT_PROMPT.md`](file:///c:/Users/Sam%20Deiter/Documents/GitHub/UE5ScenarioTracker/docs/CHATGPT_PROMPT.md)
3. Replace `[PASTE YOUR TOPIC HERE]` with your scenario idea
4. Send to ChatGPT
5. Copy the JSON response

**Example topics:**

- "Lumen GI not affecting distant emissive meshes"
- "Physics constraint breaking when character dashes"  
- "Blueprint timer causing memory leak"

### Step 2: Convert to .js File

1. Open terminal in project root
2. Run: `python tools/python/convert_scenario.py`
3. Paste the ChatGPT JSON
4. Press Ctrl+Z then Enter (Windows)
5. Script creates the `.js` file in `scenarios/`

### Step 3: Test

1. Refresh browser (Ctrl+F5)
2. New scenario appears in Sprint Backlog
3. Click to test it
4. Use debug navigation (Prev/Next/Skip) to verify flow

---

## Current State

**App:** <http://localhost:8080/> (working)
**Debug Menu:** Always visible (top right)
**Git:** All changes committed and pushed

---

## Assessment Logic Rules

✅ All answers advance to next step (no loops)
✅ Time penalties: correct=0.5h, wrong=2.0h
✅ Wrong answers are plausible, not silly
✅ Specific UE5 terminology (setting names, console commands)

---

## Need Help?

- **Prompt Template:** `docs/CHATGPT_PROMPT.md`
- **Conversion Script:** `tools/python/convert_scenario.py`
- **Example:** View `scenarios/directional_light.js` for reference
