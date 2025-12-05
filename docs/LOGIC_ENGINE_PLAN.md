# Logic Engine - Scenario Generator Plan

## Goal

Create high-quality UE5 troubleshooting **assessment scenarios**. This is a TESTING tool, not a learning tool.

---

## Workflow (No API Calls)

1. **You** generate scenario JSON in another LLM using the prompt template below
2. **You** paste the JSON to me (Claude/Gemini)
3. **I** validate, fix any issues, and create the .js file
4. **I** update index.html to include the new scenario

---

## Key Design Principles

### 1. Assessment Flow (NOT Tutorial)

- **All answers move forward** - No dead ends, no "try again" loops
- Wrong answers incur time penalties but still advance
- This tests decision-making, not just memory

### 2. Plausible Wrong Answers

Wrong choices must be:

- **Believable** - Something a real dev might try
- **Not obviously wrong** - No joke answers
- Examples: Using a legacy approach, adjusting the wrong (but similar) setting, over-engineering

### 3. Text Reuse Strategies

For long scenarios, vary content using:

- **Different phrasings** - "You notice..." vs "The console shows..." vs "A colleague suggests..."
- **Wrong answer archetypes** (reusable patterns - see below)

---

## Schema

```javascript
window.SCENARIOS['scenario_id'] = {
    meta: {
        title: "Short Problem Description",        // 5-10 words
        description: "Detailed context...",        // 1-2 sentences
        estimateHours: 0.75,                       // Ideal completion time
        category: "Lighting"                       // Short category name
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'lighting',
            title: 'Diagnosing the Issue',
            prompt: "<p>Context...</p><strong>What do you do first?</strong>",
            choices: [
                {
                    text: "Correct approach",
                    type: 'correct',          // +0.5 hrs
                    feedback: "<p><strong>Optimal:</strong> Explanation...</p>",
                    next: 'step-2'
                },
                {
                    text: "Plausible wrong approach",
                    type: 'wrong',            // +2.0 hrs
                    feedback: "<p><strong>Maximum Time:</strong> Why this fails...</p>",
                    next: 'step-2'            // STILL advances (assessment)
                }
            ]
        },
        'conclusion': {
            skill: 'lighting',
            title: 'Scenario Complete',
            prompt: "Summary of the ideal path...",
            choices: []
        }
    }
};
```

---

## Time Penalties

| Choice Type | Time Cost | Description |
|-------------|-----------|-------------|
| `correct` | +0.5 hrs | Optimal path |
| `partial` | +1.0 hrs | Acceptable but not ideal |
| `misguided` | +1.5 hrs | Wrong direction, recoverable |
| `wrong` | +2.0 hrs | Significant mistake |

---

## Wrong Answer Archetypes (Reusable)

1. **Legacy Approach**: "Use the UE4 method of [X] instead"
2. **Wrong Setting**: "Adjust [similar-sounding setting]"
3. **Over-Engineering**: "Create a custom system to handle this"
4. **Unrelated Investigation**: "Check the [other system] first"
5. **Brute Force**: "Increase [value] to maximum"
6. **Global Fix**: "Change Project Settings instead of per-actor"
7. **Nuclear Option**: "Rebuild all assets / Restart editor"

---

## Debug Menu Access

The debug navigation (Prev/Next/Skip) is hidden by default.

**To access:**

1. Press **Ctrl + Shift + Delete**
2. Enter password: **IloveUnreal**
3. Debug dropdown appears with navigation buttons

---

## Prompt Template for LLM Generation

```
You are creating a UE5 troubleshooting ASSESSMENT scenario.

RULES:
1. ALL choices advance to the next step (no dead ends)
2. Wrong answers must be PLAUSIBLE - things a developer might realistically try
3. Use these time penalties: correct=0.5h, partial=1.0h, misguided=1.5h, wrong=2.0h
4. 3-5 decision points with 3-4 choices each
5. Use specific UE5 terminology (setting names, menu paths)

Topic: [YOUR TOPIC HERE]

Output valid JSON matching this structure:
{
  "scenario_id": "snake_case_id",
  "meta": { "title": "...", "description": "...", "estimateHours": 0.75, "category": "..." },
  "start": "step-1",
  "steps": {
    "step-1": { "skill": "...", "title": "...", "prompt": "...", "choices": [...] },
    "conclusion": { "skill": "...", "title": "Scenario Complete", "prompt": "...", "choices": [] }
  }
}
```

---

## Next Steps

1. [x] Debug menu already added to index.html
2. [x] Debug navigation code added to game.js
3. [ ] You generate a test scenario using the prompt template
4. [ ] I validate and convert to .js file
5. [ ] Test in browser
