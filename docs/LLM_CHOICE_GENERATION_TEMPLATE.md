# LLM Prompt Template for Generating Scenario Choices

## Context
You are helping to create debugging scenario choices for a UE5 (Unreal Engine 5) training application. Each scenario step needs **at least 4 choices** representing different debugging approaches a developer might take.

## Choice Types & Time Costs
- `'correct'`: The best/optimal solution (0.5h time cost)
- `'partial'`: Works but not optimal, or only partially solves the problem (1.0h time cost)
- `'misguided'`: Plausible but wrong direction, common misconception (1.5h time cost)
- `'wrong'`: Clearly incorrect approach, wastes significant time (2.0h time cost)

## Format Requirements
Each choice must have:
```javascript
{
    text: "Clean description of the action (NO labels like 'Action:' or '[Wrong Guess]')",
    type: 'correct|partial|misguided|wrong',
    feedback: "Explanation of what happens and why (2-3 sentences, narrative tone)",
    next: 'step-X' // or 'conclusion'
}
```

## Narrative Tone
- Write as if simulating a real debugging session
- Include interactions with other developers when appropriate
- Use specific UE5 terminology and realistic scenarios
- Feedback should explain WHY the choice leads to the outcome

---

## EXAMPLE STEP TO EXPAND

**Step ID:** step-2
**Title:** Investigating the Issue
**Skill:** lighting
**Prompt:**
```
You notice that Global Illumination looks too dark in certain areas of your level. The scene uses Lumen for GI. What do you investigate first?
```

**Existing Choices (3):**
```javascript
{
    text: "Check the Lumen Scene Detail settings in Project Settings",
    type: 'correct',
    feedback: "You open Project Settings and find that Lumen Scene Detail is set to Low. This explains the dark areas. Increasing it to Medium resolves the issue efficiently.",
    next: 'conclusion'
},
{
    text: "Increase the number of point lights in the scene",
    type: 'misguided',
    feedback: "You add more point lights, but the GI darkness persists. Your colleague mentions that Lumen GI quality isn't affected by adding more lights - it's a global setting issue.",
    next: 'step-2M'
},
{
    text: "Rebuild lighting (even though you're using Lumen)",
    type: 'wrong',
    feedback: "You spend 30 minutes rebuilding lighting, but Lumen is dynamic and doesn't use baked lightmaps. Your tech lead reminds you that Lumen doesn't require light builds.",
    next: 'step-2W'
}
```

**TASK:** Add 1 more choice to reach 4 total. Suggest a `'partial'` type choice.

**Your Generated Choice:**
```javascript
{
    text: "Adjust the Exposure settings in the Post Process Volume",
    type: 'partial',
    feedback: "You increase the exposure which brightens the scene, but it's a band-aid solution that affects the entire level uniformly. The GI quality issue remains, and now some areas are overexposed. You'll need to find the root cause.",
    next: 'step-2'
}
```

---

## STEPS NEEDING CHOICES

Below are the actual steps that need additional choices. For each step, I'll provide:
1. The step context (title, prompt, existing choices)
2. How many choices are needed
3. What types would be most appropriate

---

### lumen_gi.js - step-1W
**Current Choices:** 2
**Needs:** 2 more choices
**Title:** Dead End: Brightness Tweaks
**Skill:** lighting

**Prompt:**
```
[Extract from file - this is a dead-end step after making a wrong choice]
```

**Existing Choices:**
```
[Extract existing choices from the file]
```

**Generate:** 2 new choices that represent further struggling before finding a way back to the main path. At least one should eventually lead back to a productive step.

---

### lumen_gi.js - step-1M
**Current Choices:** 1
**Needs:** 3 more choices
**Title:** Misguided Path: [Extract title]
**Skill:** lighting

**Prompt:**
```
[Extract from file]
```

**Existing Choices:**
```
[Extract existing choices]
```

**Generate:** 3 new choices showing different ways to struggle before finding the correct path.

---

## INSTRUCTIONS FOR LLM

1. **Read the step context carefully** - understand what the developer is trying to debug
2. **Consider common UE5 mistakes** - what would a struggling developer actually try?
3. **Maintain narrative consistency** - choices should feel like realistic debugging attempts
4. **Vary the types** - don't make all choices the same type
5. **Write clean choice text** - NO labels like "Action:" or "[Wrong Guess]"
6. **Provide helpful feedback** - explain why the choice leads to its outcome
7. **Use specific UE5 terms** - Lumen, Nanite, World Partition, etc.

## OUTPUT FORMAT

For each step, provide the new choices in this format:

```javascript
// NEW CHOICE 1
{
    text: "Your action description here",
    type: 'correct|partial|misguided|wrong',
    feedback: "Explanation of what happens and why this leads to the next step.",
    next: 'step-X'
},

// NEW CHOICE 2
{
    text: "Your action description here",
    type: 'correct|partial|misguided|wrong',
    feedback: "Explanation of what happens and why this leads to the next step.",
    next: 'step-X'
}
```

---

## STEPS TO PROCESS

I will provide you with the specific steps from `lumen_gi.js` and `blueprintslogic_advanced.js` that need additional choices. For each step, I'll extract:
- Step ID
- Title
- Prompt
- Existing choices
- Number of new choices needed

You will generate the new choices following the format and guidelines above.
