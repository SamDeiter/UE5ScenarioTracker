# Scenario Data Schema

Each scenario file in the `scenarios/` directory (e.g., `golem.js`) adds a new entry to the global `window.SCENARIOS` object.

## File Structure

```javascript
window.SCENARIOS['unique_scenario_id'] = {
  meta: { ... },
  start: "step-id",
  steps: { ... }
};
```

## Fields Description

### 1. Root Object
*   **Key**: A unique string ID for the scenario (e.g., `'golem'`, `'terminal'`). This must match the filename for consistency.

### 2. `meta` Object
Contains high-level information about the scenario (ticket).
*   `title` (String): The display title of the ticket.
*   `description` (String): A brief summary of the issue.
*   `estimateHours` (Number): The "estimated" time to fix this issue. Used for scoring.

### 3. `start` (String)
*   The ID of the first step to load (usually `'step-1'`).

### 4. `steps` Object
A dictionary where keys are step IDs (e.g., `'step-1'`, `'step-2'`) and values are step objects.

#### Step Object Structure
*   `skill` (String): The category of skill being tested (e.g., `'lighting'`, `'cpp'`, `'perf'`).
*   `title` (String): The title of the specific step.
*   `prompt` (HTML String): The question or situation description. Can contain HTML tags like `<p>`, `<code>`, `<strong>`.
*   `choices` (Array of Objects): A list of possible answers.

#### Choice Object Structure
*   `text` (HTML String): The text displayed on the button.
*   `type` (String): Determines the score/time cost.
    *   `'correct'`: Best answer. Low time cost (0.5h).
    *   `'partial'`: Okay answer, but not optimal. Medium time cost (1.0h).
    *   `'misguided'`: Plausible but incorrect path. High time cost (1.5h).
    *   `'wrong'`: Completely incorrect. Max time cost (2.0h).
*   `feedback` (HTML String): The explanation shown after clicking.
*   `next` (String): The ID of the next step to load (e.g., `'step-2'`), or `'conclusion'` to finish the scenario.

## Example Template

```javascript
window.SCENARIOS['my_new_scenario'] = {
  meta: {
    title: "My New Scenario Title",
    description: "Brief description of the problem.",
    estimateHours: 2.0
  },
  start: "step-1",
  steps: {
    'step-1': {
      skill: 'debugging',
      title: 'Step 1: The Beginning',
      prompt: "<p>What is the first thing you check?</p>",
      choices: [
        {
          text: 'Check the logs',
          type: 'correct',
          feedback: "<p><strong>Correct:</strong> Logs are the best place to start.</p>",
          next: 'step-2'
        },
        {
          text: 'Guess randomly',
          type: 'wrong',
          feedback: "<p><strong>Wrong:</strong> Never guess.</p>",
          next: 'step-2'
        }
      ]
    },
    'step-2': {
      skill: 'debugging',
      title: 'Step 2: The Fix',
      prompt: "<p>You found the error. How do you fix it?</p>",
      choices: [
        {
          text: 'Apply the patch',
          type: 'correct',
          feedback: "<p><strong>Correct:</strong> Fixed!</p>",
          next: 'conclusion'
        }
      ]
    }
  }
};
```
