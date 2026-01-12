# Scenario Data Schema

Each scenario file in the `scenarios/` directory adds a new entry to the global `window.SCENARIOS` object.

## File Structure

```javascript
window.SCENARIOS['ScenarioId'] = {
  meta: { ... },
  setup: [...],      // Optional
  fault: { ... },    // Optional
  expected: { ... }, // Optional
  fix: [...],        // Optional
  start: "step-1",
  steps: { ... }
};
```

## Fields Description

### 1. Root Object Key

A unique PascalCase string ID for the scenario (e.g., `'AIBehaviorTreeBlackboardIssue'`). Should match the filename.

### 2. `meta` Object (Required)

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Display title of the ticket |
| `description` | String | Brief summary of the issue |
| `estimateHours` | Number | Expected time for ideal path (used for scoring) |
| `difficulty` | String | `"Beginner"`, `"Intermediate"`, or `"Advanced"` |
| `category` | String | Skill category: `"Lighting"`, `"Blueprints"`, `"Materials"`, `"Physics"`, `"Animation"`, `"VFX"`, `"Worldbuilding"`, etc. |

### 3. `setup` Array (Optional)

Actions to configure the scenario's initial state.

### 4. `fault` Object (Optional)

| Field | Type | Description |
|-------|------|-------------|
| `description` | String | What's broken |
| `visual_cue` | String | What the user visually observes |

### 5. `expected` Object (Optional)

| Field | Type | Description |
|-------|------|-------------|
| `description` | String | Desired behavior after fix |
| `validation_action` | String | How to verify success |

### 6. `fix` Array (Optional)

Actions to restore correct state (for automation).

### 7. `start` (String, Required)

The ID of the first step (usually `'step-1'`).

### 8. `steps` Object (Required)

Dictionary of step objects keyed by step ID.

#### Step Object

| Field | Type | Description |
|-------|------|-------------|
| `skill` | String | Skill being tested (e.g., `'blueprints'`, `'lighting'`) |
| `title` | String | Step title |
| `image_path` | String | Path to step image: `assets/generated/ScenarioId/step-1.png` |
| `prompt` | HTML String | Question/situation with `<p>`, `<code>`, `<strong>` |
| `choices` | Array | List of answer choices |

#### Choice Object

| Field | Type | Description |
|-------|------|-------------|
| `text` | HTML String | Button text |
| `type` | String | Answer quality (see below) |
| `feedback` | HTML String | Explanation shown after selection |
| `next` | String | Next step ID, `'conclusion'`, or same step to retry |

#### Choice Types

| Type | Description | Time Cost |
|------|-------------|-----------|
| `correct` | Best answer | +0.1h (Optimal) |
| `plausible` | Could work, not ideal | +0.1-0.15h |
| `obvious` | Common misconception | +0.15-0.2h |
| `subtle` | Plausible but wrong path | +0.1-0.2h |

### 9. `conclusion` Step (Required)

The final step summarizing what was learned.

```javascript
conclusion: {
  skill: "complete",
  title: "Scenario Complete",
  image_path: "assets/generated/ScenarioId/conclusion.png",
  prompt: "<p><strong>Well done!</strong></p><h4>Key Takeaways:</h4><ul>...</ul>",
  choices: [
    { text: "Complete Scenario", type: "correct", feedback: "", next: "end" }
  ]
}
```

## Image Path Convention

All images go in: `assets/generated/{ScenarioId}/`

- `step-1.png`, `step-2.png`, ... `step-N.png`
- `conclusion.png`

## Example

See `_TEMPLATE.js` for a complete working example.
