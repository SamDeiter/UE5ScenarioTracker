# Scenario Expansion Prompt Template

**Copy everything below this line and paste it into your LLM (ChatGPT/Claude/Gemini).**
**Then, paste the specific scenario content you want to expand at the very bottom.**

---

**Role:** You are an expert Unreal Engine 5 Technical Artist and Educator. You specialize in teaching debugging workflows.

**Task:** I will provide you with a JavaScript file containing a "Scenario" for a training application. Currently, this scenario is just a single step (a quiz question). Your job is to **expand this single step into a 10-15 step interactive debugging simulation.**

**The Goal:**
Transform the content from a "Choose the right answer" quiz into a "Sherlock Holmes style" investigation. The user should not just guess the answer; they must:
1.  **Observe symptoms** (What is happening?).
2.  **Investigate** (Check logs, view modes, blueprints, settings).
3.  **Formulate a hypothesis**.
4.  **Attempt fixes** (some might be wrong!).
5.  **Verify the solution**.

**Requirements:**
1.  **Structure:** The output must be a valid JavaScript object following the specific schema below.
2.  **Step Count:** Create between **10 and 15 steps**.
3.  **Branching:**
    *   **Main Path:** The optimal debugging workflow (Correct choices).
    *   **Dead Ends:** Wrong or Misguided choices should lead to a unique "dead end" step that explains *why* that approach failed, then guides them back to the main path.
    *   **Source Control:** Occasionally include a "Revert via Source Control" option as a nuclear recovery step if the user messes up badly.
4.  **Choice Types:**
    *   `correct`: The optimal next step (Time cost: ~0.5h).
    *   `partial`: Works but is hacky or suboptimal (Time cost: ~1.0h).
    *   `misguided`: Plausible but incorrect investigation path (Time cost: ~1.5h).
    *   `wrong`: Completely incorrect or dangerous (Time cost: ~2.0h).
5.  **Tone:** Professional, encouraging, but realistic about consequences (e.g., "You deleted the asset and now the project crashes").

**Output Format (JavaScript):**
```javascript
window.SCENARIOS['scenario_id_here'] = {
    meta: {
        title: "Category: Descriptive Title",
        description: "Brief summary of the problem and what skills are tested.",
        estimateHours: 3.0 // Sum of optimal path time
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'category_name', // e.g., 'lighting', 'blueprints'
            title: 'Step 1: Initial Symptom',
            prompt: "<p>Description of what the user sees.</p><strong>What is your first move?</strong>",
            choices: [
                {
                    text: 'Action: Check the Output Log.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> The log shows a specific warning...</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: Randomly change settings.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> This wasted time and broke more things.</p>",
                    next: 'step-1W' // Dead end step
                }
            ]
        },
        'step-1W': {
             // Dead end step example
            skill: 'category_name',
            title: 'Random Changes Failed',
            prompt: "<p>Changing settings randomly didn't help. Now the lighting is broken too.</p><strong>How do you recover?</strong>",
            choices: [
                {
                    text: 'Action: Revert changes and check the logs.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Back on track.</p>",
                    next: 'step-2' // Back to main path
                }
            ]
        },
        // ... continue for 10+ steps ending in 'conclusion'
        'conclusion': {
            skill: 'category_name',
            title: 'Conclusion: Problem Solved',
            prompt: "<p>Summary of what was fixed and the lessons learned.</p><strong>Scenario Complete.</strong>",
            choices: []
        }
    }
};
```

---

**INPUT DATA:**

**Scenario Context (Use this to guide the story):**
*   **Problem:** [DESCRIBE PROBLEM HERE]
*   **Root Cause:** [DESCRIBE ROOT CAUSE HERE]
*   **Correct Fix:** [DESCRIBE FIX HERE]

**Original File Content:**
[PASTE FILE CONTENT HERE]
