# ChatGPT Prompt for UE5 Scenario Generation

## Copy this prompt to ChatGPT

```
You are creating a UE5 troubleshooting ASSESSMENT scenario for a testing tool.

CRITICAL RULES:
1. This is an ASSESSMENT, not a tutorial
2. ALL choices must advance to the next step (no loops, no dead ends)
3. Wrong answers incur time penalties but still progress forward
4. Wrong choices must be PLAUSIBLE - things a real developer might try
5. Use specific UE5 terminology (setting names, menu paths, console commands)

TOPIC: [PASTE YOUR TOPIC HERE - e.g. "Nanite mesh causing rendering artifacts"]

STRUCTURE:
- 3-5 decision points
- Each decision has 3-4 choices
- Each choice advances to the next step
- Time penalties: correct=0.5h, partial=1.0h, misguided=1.5h, wrong=2.0h

PLAUSIBLE WRONG ANSWER PATTERNS:
- Wrong but similar setting name
- Legacy UE4 approach
- Over-engineered solution
- Investigating unrelated system first
- Brute force (maxing values)
- Global fix instead of targeted
- Rebuilding everything

TEXT VARIATION:
Use different phrasings to avoid repetition:
- "You notice..." vs "The console shows..." vs "A colleague suggests..."
- "Check the..." vs "Examine..." vs "Investigate..."

OUTPUT FORMAT:
{
  "scenario_id": "snake_case_id",
  "meta": {
    "title": "5-10 word problem description",
    "description": "1-2 sentence context explaining the issue",
    "estimateHours": 0.75,
    "category": "Rendering"
  },
  "start": "step-1",
  "steps": {
    "step-1": {
      "skill": "rendering",
      "title": "Descriptive Action Title (no 'Step 1')",
      "prompt": "<p>Situation context...</p><strong>What do you do?</strong>",
      "choices": [
        {
          "text": "Specific correct action with exact setting name",
          "type": "correct",
          "feedback": "<p><strong>Optimal:</strong> Why this works...</p>",
          "next": "step-2"
        },
        {
          "text": "Plausible but wrong approach",
          "type": "wrong",
          "feedback": "<p><strong>Maximum Time:</strong> Why this fails...</p>",
          "next": "step-2"
        }
      ]
    },
    "step-2": {
      "skill": "rendering",
      "title": "Next Action",
      "prompt": "<p>Next situation...</p><strong>What now?</strong>",
      "choices": [...]
    },
    "conclusion": {
      "skill": "rendering",
      "title": "Scenario Complete",
      "prompt": "You have successfully resolved the issue. Summary of ideal path...",
      "choices": []
    }
  }
}

IMPORTANT:
- Return ONLY valid JSON (no markdown code fences)
- Every "next" must point to an existing step
- Use straight quotes, not smart quotes
- Escape special characters properly
```

---

## When you get the response

1. Copy the JSON output ChatGPT gives you
2. Paste it to me (Claude) and say "Convert this scenario"
3. I'll validate it and create the .js file for you

---

## Example Topics to Try

- "Lumen GI not affecting distant emissive meshes"
- "Physics constraint breaking when character dashes"
- "Material instance flickering after Nanite conversion"
- "Blueprint timer causing memory leak"
- "Sequencer animation not playing in packaged build"
- "World Partition cells streaming too late"
