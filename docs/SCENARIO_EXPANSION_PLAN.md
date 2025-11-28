# Scenario Expansion Plan

## Executive Summary

**Analysis Date:** 2025-11-27  
**Total Scenarios:** 35  
**Scenarios Needing Expansion:** 31 (88.6%)  
**Target:** All scenarios should have 10+ steps

## Problem Identified

Most scenarios currently have only **1 step with many choices** that all lead directly to "conclusion". This creates a "choose-all-that-apply" quiz format rather than a **sequential debugging journey** where each choice leads to the next step in the investigation.

### Current Structure (INCORRECT)
```
Step 1: [20 choices] → All lead to "conclusion"
```

### Target Structure (CORRECT - like golem.js)
```
Step 1: [4 choices] → Step 2, Step 1-Wrong, Step 1-Misguided, Step 3
Step 2: [4 choices] → Step 3, Step 2-Wrong, etc.
Step 3: [4 choices] → Step 4, etc.
...
Step 10: [4 choices] → Conclusion
```

## Scenarios Requiring Expansion

### Priority 1: Single-Step Scenarios (1 step each)

These need the most work - they need to be completely restructured into 10+ sequential steps:

1. **assetmanagement_advanced.js** - 1 step → needs 9+ more
2. **assetmanagement_beginner.js** - 1 step → needs 9+ more  
3. **assetmanagement_intermediate.js** - 1 step → needs 9+ more
4. **blueprintslogic_advanced.js** - 1 step → needs 9+ more
5. **blueprintslogic_beginner.js** - 1 step → needs 9+ more
6. **blueprintslogic_intermediate.js** - 1 step → needs 9+ more
7. **lightingrendering_advanced.js** - 1 step → needs 9+ more
8. **lightingrendering_beginner.js** - 1 step → needs 9+ more
9. **lightingrendering_intermediate.js** - 1 step → needs 9+ more
10. **materialsshaders_advanced.js** - 1 step → needs 9+ more
11. **materialsshaders_beginner.js** - 1 step → needs 9+ more
12. **materialsshaders_intermediate.js** - 1 step → needs 9+ more
13. **physicscollisions_advanced.js** - 1 step → needs 9+ more
14. **physicscollisions_beginner.js** - 1 step → needs 9+ more
15. **physicscollisions_intermediate.js** - 1 step → needs 9+ more
16. **sequencercinematics_advanced.js** - 1 step → needs 9+ more
17. **sequencercinematics_beginner.js** - 1 step → needs 9+ more
18. **sequencercinematics_intermediate.js** - 1 step → needs 9+ more
19. **worldpartition_advanced.js** - 1 step → needs 9+ more
20. **worldpartition_beginner.js** - 1 step → needs 9+ more
21. **worldpartition_intermediate.js** - 1 step → needs 9+ more

### Priority 2: Very Short Scenarios (2-3 steps)

These have some structure but need significant expansion:

22. **audio_concurrency.js** - 2 steps → needs 8 more
23. **blueprint_infinite_loop.js** - 2 steps → needs 8 more
24. **oversharpened_scene.js** - 2 steps → needs 8 more
25. **lumen_gi.js** - 3 steps → needs 7 more
26. **nanite_wpo.js** - 3 steps → needs 7 more
27. **volumetric_fog_banding.js** - 3 steps → needs 7 more
28. **volumetric_fog_material.js** - 3 steps → needs 7 more

### Priority 3: Short Scenarios (4-5 steps)

These need moderate expansion:

29. **lumen_mesh_distance.js** - 4 steps → needs 6 more
30. **generator.js** - 5 steps → needs 5 more
31. **terminal.js** - 5 steps → needs 5 more

## Expansion Strategy

### Step 1: Understand the Debugging Journey

For each scenario, map out a realistic 10-15 step debugging process:

1. **Initial Symptom** - What the user first observes
2. **First Investigation** - Where to look first
3. **Dead Ends** - Wrong paths that waste time (misguided/wrong choices)
4. **Deeper Discovery** - Finding the root cause
5. **Attempted Fix** - First fix attempt
6. **Validation** - Testing the fix
7. **Edge Cases** - Discovering related issues
8. **Optimization** - Making it production-ready
9. **Final Validation** - Comprehensive testing
10. **Conclusion** - Issue resolved

### Step 2: Create Branching Paths

Each step should have 3-4 choices:
- **1 Correct** (optimal path, low time cost 0.5h) → Next main step
- **1 Partial** (works but suboptimal, medium time cost 1.0h) → Next step with tech debt
- **1 Misguided** (plausible but wrong, high time cost 1.5h) → Dead-end step, then back to main path
- **1 Wrong** (completely incorrect, max time cost 2.0h) → Dead-end step, then back to main path

### Step 3: Example Expansion Template

Here's how to expand `assetmanagement_beginner.js` from 1 step to 10+ steps:

**Current:** Single step with 17 choices all leading to conclusion

**Proposed Structure:**

```
Step 1: Initial Discovery
- Observe pink/black checkers on meshes
- Check Output Log for errors
- Choices lead to Step 2, Step 1-Wrong, etc.

Step 2: Understanding Redirectors
- Learn about asset redirectors
- Enable "Show Redirectors" in Content Browser
- Choices lead to Step 3, Step 2-Misguided, etc.

Step 3: Locating the Problem
- Navigate to old folder location
- Identify grey arrow redirector icons
- Choices lead to Step 4, etc.

Step 4: Attempting Manual Fix (Misguided Path)
- Try manually re-linking materials (wrong approach)
- Realize this doesn't fix Blueprint references
- Choices lead to Step 5, etc.

Step 5: Using Fix Up Redirectors
- Right-click and select "Fix Up Redirectors in Folder"
- Understand what this command does
- Choices lead to Step 6, etc.

Step 6: Verifying Material Fixes
- Check if materials now display correctly
- Use Reference Viewer to confirm paths
- Choices lead to Step 7, etc.

Step 7: Blueprint Reference Issues
- Level Blueprint still fails
- Recompile Blueprint to refresh dependencies
- Choices lead to Step 8, etc.

Step 8: Testing the Fix
- Run PIE and trigger the sequence
- Verify particle system spawns correctly
- Choices lead to Step 9, etc.

Step 9: Cleanup
- Delete old empty folders
- Remove redirector assets
- Choices lead to Step 10, etc.

Step 10: Final Validation
- Comprehensive testing
- Document the fix for the team
- Choices lead to Conclusion
```

## Implementation Plan

### Phase 1: Expand 2-3 Example Scenarios
Pick 3 diverse scenarios and fully expand them as templates:
1. `assetmanagement_beginner.js` (Asset Management)
2. `audio_concurrency.js` (already has 2 steps, expand to 10)
3. `lightingrendering_beginner.js` (Lighting/Rendering)

### Phase 2: Expand Remaining Single-Step Scenarios
Use the templates from Phase 1 to guide expansion of all 1-step scenarios.

### Phase 3: Expand Short Scenarios (2-5 steps)
Add missing steps to scenarios that already have some structure.

### Phase 4: Quality Assurance
- Test all expanded scenarios in the application
- Ensure time estimates are realistic
- Verify all paths lead to appropriate next steps
- Check for typos and consistency

## Best Practices for Expansion

1. **Realistic Debugging Flow** - Each step should represent a real action a developer would take
2. **Educational Value** - Teach best practices through the "correct" path
3. **Common Mistakes** - Include realistic wrong/misguided paths that developers actually take
4. **Time Costs** - Reflect realistic time spent on each approach
5. **Feedback Quality** - Provide clear, educational feedback for each choice
6. **Skill Variety** - Cover multiple related skills throughout the scenario
7. **Progressive Difficulty** - Start simple, get more complex
8. **Dead-End Recovery** - Wrong paths should eventually guide back to the main path
9. **Tech Debt Awareness** - Partial solutions should acknowledge their limitations
10. **Conclusion Satisfaction** - The final step should feel like a complete resolution

## Success Metrics

- ✅ All scenarios have 10+ steps
- ✅ Average scenario length: 12-15 steps
- ✅ Each step has 3-4 meaningful choices
- ✅ Clear progression from symptom → investigation → fix → validation
- ✅ Educational feedback for all choice types
- ✅ Realistic time estimates (total scenario time matches estimateHours)

## Next Steps

1. Review this plan and approve the expansion strategy
2. Select 3 scenarios for Phase 1 template creation
3. Create detailed expansion outlines for those 3 scenarios
4. Implement and test the expansions
5. Use learnings to expand remaining scenarios
