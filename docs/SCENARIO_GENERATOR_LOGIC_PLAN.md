# Scenario Generator Logic Plan

## 🎮 Core Concept: JIRA Ticket Debugging Simulation

**Vision**: Simulate a real workplace scenario where you receive a JIRA ticket about a bug/issue in Unreal Engine and must debug it. All choices (right or wrong) move the story forward, creating a branching narrative with consequences - just like real debugging.

### Game Flow

```
JIRA Ticket Received
    ↓
Investigate Issue → Make Choice → See Consequence → Next Step
    ↓
(Optimal Choice) → Efficient path → Fix found quickly
(Wrong Choice) → Detour/complication → Extra steps to recover → Eventually converge back
```

**Key Principle**: Wrong choices don't "fail" - they create realistic debugging detours where you have to deal with consequences, try other approaches, or fix new problems you created.

## Structure Requirements

### 1. Scenario Start

- Presented as a JIRA ticket with:
  - Title
  - Description of the problem
  - Steps to reproduce (if applicable)
  - Expected vs actual behavior
  - Any relevant systems involved

### 2. Branching Narrative Structure

- **Total 40-60 steps** across all possible branches
- **Optimal path**: 15-20 steps (if all correct choices are made)
- **Wrong choice paths**: Lead to detours that add 2-10 extra steps each
- **All paths must eventually**: Either reach a resolution OR reach a dead-end "made it worse" ending

### 3. Choice Design (4 options per step)

Each step presents a situation and 4 possible actions:

#### Choice 1: Optimal Action

- Most efficient next step
- Shortest path to resolution
- Low time cost (0.03-0.08 hrs)
- **Next**: Advances to optimal path step

#### Choice 2: "Works But Creates Problems"

- Fixes immediate issue BUT causes side effects
- Examples:
  - "Set all actors to Always Loaded" (fixes streaming but tanks performance)
  - "Disable Nanite globally" (fixes flicker but loses performance gains)
  - "Increase all texture pools to max" (fixes pop-in but causes memory issues)
- **Next**: Advances to "dealing with consequences" branch (3-5 extra steps to fix new problems)
- Time cost: 0.1-0.3 hrs

#### Choice 3: Plausible But Wrong

- Targets wrong property/system
- Seems logical but doesn't address root cause
- **Next**: Advances to "investigating why it didn't work" branch (2-4 extra steps)
- Time cost: 0.15-0.25 hrs

#### Choice 4: Obviously Wrong

- Completely different system
- Easy to eliminate for experts
- **Next**: Advances to "realized mistake" branch (1-2 steps to recognize error)
- Time cost: 0.2-0.4 hrs

### 4. Branch Convergence Strategy

Wrong choice branches should eventually:

- **Converge back** to main path (after paying time penalty + extra steps)
- **Reach alternative solution** (different but valid fix)
- **Dead-end** at "Issue Escalated" or "Made it Worse" (rare, only for catastrophic choices)

Example Flow:

```
Step 5: Check actor properties
  ├─ Correct → Step 6 (check ray tracing)
  ├─ Wrong A → Step 5a (tried wrong thing) → Step 5b (realize mistake) → Step 6
  ├─ Wrong B → Step 5c (created new problem) → Step 5d (fix that) → Step 5e (back on track) → Step 6
  └─ Wrong C → Step 5f (big detour) → Step 5g → Step 5h → Step 6
```

## Generator Prompt Design

### Pass 1: Outline with Branching

Generate structure like:

```json
{
  "total_steps": 45,
  "optimal_path_length": 18,
  "branches": [
    {
      "step_num": 1,
      "situation": "You've received the JIRA ticket...",
      "choices": [
        {"type": "correct", "leads_to": 2, "time": 0.05},
        {"type": "works_but_bad", "leads_to": "1a", "time": 0.2, "creates_problem": "performance"},
        {"type": "plausible_wrong", "leads_to": "1b", "time": 0.15},
        {"type": "obvious_wrong", "leads_to": "1c", "time": 0.3}
      ]
    },
    {
      "step_num": "1a",
      "is_detour": true,
      "situation": "The issue is fixed but FPS dropped to 15...",
      "converges_to": 3
    }
  ]
}
```

### Pass 2: Expand Details

For each step, generate:

- **Situation description**: What's happening now, what you see
- **Prompt**: "What do you do next?"
- **4 choice texts**: Specific, detailed actions
- **4 feedback texts**:
  - Correct: "Optimal Time: +Xhrs. [Why this is right]"
  - Wrong: "Extended Time: +Xhrs. [What happened, what you now see/need to deal with]"

## Questions for User

Before implementing, please confirm:

### Q1: Detour Length

How many extra steps should wrong choices add?

- Light detour (obviously wrong): 1-2 steps?
- Medium detour (plausible wrong): 2-4 steps?
- Heavy detour (works but bad): 3-6 steps?

### Q2: Dead Ends

Should some choices lead to "fail" states (escalate ticket, made it worse)?
Or should ALL paths eventually reach some resolution?

### Q3: Step Granularity

Example step: "Check the actor's ray tracing visibility"

**Option A (Granular)**:

1. Select the actor
2. Open Details panel
3. Expand Rendering section
4. Locate 'Visible in Ray Tracing' checkbox
5. Verify it's checked

**Option B (Moderate)**:

1. Select the actor and open Details
2. Navigate to Rendering > Ray Tracing Visibility
3. Verify checkbox state

Which level?

### Q4: Score/Feedback

At the end, should users see:

- Total time taken
- Optimal time possible
- Efficiency %
- Path they took (with branches highlighted)?

## Next Steps

1. Get answers to Q1-Q4
2. Update generator prompts with branching logic
3. Update merge function to handle branch convergence
4. Test with first scenario
