# Scenario Refactoring Checklist

This document lists all steps in `lumen_gi.js` and `blueprintslogic_advanced.js` that need additional choices to reach the minimum of 4 choices per step.

## Guidelines for Adding Choices

Each step should have **at least 4 choices** with these types:
- `'correct'`: Best answer (0.5h time cost)
- `'partial'`: Okay but not optimal (1.0h time cost)
- `'misguided'`: Plausible but wrong direction (1.5h time cost)
- `'wrong'`: Completely incorrect (2.0h time cost)

**Important:** Choice text should be clean action descriptions without labels like "Action: [...]"

---

## lumen_gi.js - Needs ~30 new choices

### step-1W (2 choices, needs 2 more)
Current choices: 2
Add: 2 more plausible but wrong debugging attempts

### step-1M (1 choice, needs 3 more)
Current choices: 1
Add: 3 more choices showing different ways to struggle before finding correct path

### step-2 (3 choices, needs 1 more)
Current choices: 3
Add: 1 more choice (suggest: misguided or wrong)

### step-2W (1 choice, needs 3 more)
Current choices: 1
Add: 3 more choices

### step-3 (2 choices, needs 2 more)
Current choices: 2
Add: 2 more choices

### step-3W (1 choice, needs 3 more)
Current choices: 1
Add: 3 more choices

### step-4 (3 choices, needs 1 more)
Current choices: 3
Add: 1 more choice

### step-4M (1 choice, needs 3 more)
Current choices: 1
Add: 3 more choices

### step-5 (2 choices, needs 2 more)
Current choices: 2
Add: 2 more choices

### step-5W (1 choice, needs 3 more)
Current choices: 1
Add: 3 more choices

### step-6 (2 choices, needs 2 more)
Current choices: 2
Add: 2 more choices

### step-6M (1 choice, needs 3 more)
Current choices: 1
Add: 3 more choices

### step-7 (2 choices, needs 2 more)
Current choices: 2
Add: 2 more choices

### step-8 (2 choices, needs 2 more)
Current choices: 2
Add: 2 more choices

### step-8W (1 choice, needs 3 more)
Current choices: 1
Add: 3 more choices

### step-9 (2 choices, needs 2 more)
Current choices: 2
Add: 2 more choices

---

## blueprintslogic_advanced.js - Needs ~28 new choices

### step-1W (2 choices, needs 2 more)
Current choices: 2
Add: 2 more choices

### step-1M (1 choice, needs 3 more)
Current choices: 1
Add: 3 more choices

### step-2 (3 choices, needs 1 more)
Current choices: 3
Add: 1 more choice

### step-2W (1 choice, needs 3 more)
Current choices: 1
Add: 3 more choices

### step-3 (3 choices, needs 1 more)
Current choices: 3
Add: 1 more choice

### step-3W (1 choice, needs 3 more)
Current choices: 1
Add: 3 more choices

### step-3M (1 choice, needs 3 more)
Current choices: 1
Add: 3 more choices

### step-4 (3 choices, needs 1 more)
Current choices: 3
Add: 1 more choice

### step-4W (1 choice, needs 3 more)
Current choices: 1
Add: 3 more choices

### step-5 (2 choices, needs 2 more)
Current choices: 2
Add: 2 more choices

### step-5W (1 choice, needs 3 more)
Current choices: 1
Add: 3 more choices

### step-6 (2 choices, needs 2 more)
Current choices: 2
Add: 2 more choices

### step-6W (1 choice, needs 3 more)
Current choices: 1
Add: 3 more choices

### step-7 (2 choices, needs 2 more)
Current choices: 2
Add: 2 more choices

---

## Summary

**Total new choices needed:** ~58
- lumen_gi.js: ~30 new choices across 16 steps
- blueprintslogic_advanced.js: ~28 new choices across 14 steps

**Pattern:** Dead-end steps (step-XW, step-XM) typically have only 1-2 choices and need the most work.

**Recommendation:** Focus on main path steps first (step-1, step-2, etc.) as they're more commonly encountered by users.
