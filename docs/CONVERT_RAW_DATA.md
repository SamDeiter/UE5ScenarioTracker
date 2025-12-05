# Convert raw_data.json Scenario to Assessment Format

## Paste this to ChatGPT

```
You are converting a detailed UE5 troubleshooting scenario into a branching ASSESSMENT format.

CRITICAL RULES:
1. This is an ASSESSMENT TOOL, not a tutorial
2. Create 3-5 DECISION POINTS (not 15 linear steps)
3. Each decision has 3-4 CHOICES
4. ALL choices advance to next step (no dead ends)
5. Wrong choices must be PLAUSIBLE - things a real dev might try
6. Make it feel like a video game troubleshooting quest

CONVERSION STRATEGY:
- Group 2-4 linear steps into ONE decision point
- Use "correct_solution_steps" for correct choices
- Use "common_wrong_steps" to generate wrong choices
- Add plausible variations for remaining choices

SOURCE DATA:
[PASTE ONE SCENARIO FROM raw_data.json HERE]

OUTPUT FORMAT:
{
  "scenario_id": "use the original scenario_id",
  "meta": {
    "title": "use the original title",
    "description": "use problem_description",
    "estimateHours": "use estimated_hours",
    "category": "Lighting & Rendering" (keep original focus_area)
  },
  "start": "step-1",
  "steps": {
    "step-1": {
      "skill": "lighting",
      "title": "Diagnosing the Issue",
      "prompt": "<p>Context from problem_description...</p><strong>What do you investigate first?</strong>",
      "choices": [
        {
          "text": "Check [specific setting from correct steps 1-3]",
          "type": "correct",
          "feedback": "<p><strong>Optimal:</strong> This quickly identifies...</p>",
          "next": "step-2"
        },
        {
          "text": "Try [wrong approach from common_wrong_steps]",
          "type": "wrong",
          "feedback": "<p><strong>Maximum Time:</strong> This wastes time because...</p>",
          "next": "step-2"
        },
        {
          "text": "Verify [related but secondary setting]",
          "type": "misguided",
          "feedback": "<p><strong>Extended Time:</strong> Not the root cause but...</p>",
          "next": "step-2"
        }
      ]
    },
    "step-2": {
      "skill": "lighting",
      "title": "Applying the Fix",
      "prompt": "<p>You've identified the issue...</p><strong>How do you fix it?</strong>",
      "choices": [...]
    },
    "conclusion": {
      "skill": "lighting",
      "title": "Scenario Complete",
      "prompt": "You successfully resolved the issue. The metallic object now reflects correctly.",
      "choices": []
    }
  }
}

GUIDELINES:
- Combine steps logically (e.g., "select object" + "check setting" = one decision)
- Make wrong choices sound reasonable (not silly)
- Keep 3-5 decision points total (don't create 15 steps)
- Use specific UE5 terminology from the source
- All choices advance forward (assessment, not tutorial)

Return ONLY valid JSON (no markdown fences).
```

---

## How to Use

1. Open `raw_data.json`
2. Copy ONE full scenario object (from `{` to `}`)
3. Paste above prompt to ChatGPT
4. Replace `[PASTE ONE SCENARIO...]` with your copied scenario
5. Get the converted JSON
6. Run `python tools/python/convert_scenario.py` and paste it
7. Test in browser

## Example - Copy this from raw_data.json

```json
{
  "key": "LightingRendering_Beginner",
  "scenario": {
    "scenario_id": "BlackMetallicObject",
    "title": "Metallic Asset Appears Pitch Black in Dynamic Scene",
    "problem_description": "A highly reflective metallic statue...",
    "estimated_hours": 0.73,
    "focus_area": "Lighting & Rendering",
    "correct_solution_steps": [...],
    "common_wrong_steps": [...]
  }
}
```

Then paste the whole thing into the ChatGPT prompt.
