window.SCENARIOS['WPOShadowDetachment'] = {
    meta: {
        title: "Shadow Detached from WPO Mesh",
        description: "Shadow stays put while mesh moves with wind. Investigates Shadow Pass Switch and WPO shadows.",
        estimateHours: 1.5
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'materials',
            title: 'Step 1: The Symptom',
            prompt: "Your foliage or mesh is animated using World Position Offset for wind, but its shadow stays in the original position or appears detached and floating away from the object. The lit mesh and its shadow no longer line up. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You switch to lighting and shadow visualization view modes and notice that the mesh's WPO animation is visible in the base pass, but the shadow map still looks like the undeformed, original mesh. This strongly suggests the shadow pass isn't respecting the WPO displacement.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You try adjusting light intensity and changing the sun angle, but the shadow still appears detached and doesn't follow the animated mesh. Clearly this isn't just a simple lighting strength or angle problem.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'materials',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path, assuming the issue was just light settings or directional angle. Even after tweaking those, the shadow remains offset from the moving mesh.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the unnecessary light tweaks and refocus on the material itself, especially how World Position Offset is handled in different rendering passes.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'materials',
            title: 'Step 2: Investigation',
            prompt: "You open the material used for the wind-animated mesh and inspect how World Position Offset is wired. You want to understand why the lit mesh moves but the shadow does not. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover the material uses World Position Offset to drive wind animation, but there is no logic to handle WPO differently in the shadow pass. The shadow map is still generated from the original, undisplaced mesh position, so the lighting pass and shadow pass disagree on where the object actually is.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try cranking up cascaded shadow resolution and tweaking distance / contact shadows, but the shadow still sits in the wrong place. The problem isn't quality or range--it's that the shadow pass isn't using the displaced vertices.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'materials',
            title: 'Dead End: Misguided',
            prompt: "Those shadow quality tweaks didn't work because the underlying mismatch remains: the base pass uses displaced vertices from WPO, while the shadow map still assumes the original static mesh position.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must explicitly tell the material what to do in the shadow pass--either applying appropriate WPO there via a Shadow Pass Switch node or compensating with light shadow bias--rather than just increasing shadow quality.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'materials',
            title: 'Step 3: The Fix',
            prompt: "You now know the cause: the World Position Offset isn't being handled correctly for the shadow pass, so the shadow is cast from the original mesh instead of the displaced one. How do you fix it?",
            choices: [
                {
                    text: "Action: [Enable \"Shadow Pass Switch\" or correct shadow bias.]",
                    type: 'correct',
                    feedback: "In the material, you use a Shadow Pass Switch to control how WPO is applied for shadow casting, ensuring that the shadow pass uses a version of the displacement that matches the visible animation (or a simplified variant that still lines up). Where needed, you also refine the light's Shadow Bias settings to avoid minor detachment artifacts. After recompiling the material, the mesh and its shadow move together with the wind instead of separating.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'materials',
            title: 'Step 4: Verification',
            prompt: "You re-run the scene in PIE and watch the wind-animated meshes and their shadows over time. How do you verify that the issue is resolved?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, as the wind animates the foliage or mesh via World Position Offset, the shadow now deforms or shifts appropriately with it rather than staying behind or floating away. The silhouette and shadow stay aligned from multiple camera angles, confirming that the Shadow Pass Switch / shadow bias fix worked.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'materials',
            title: 'Conclusion',
            prompt: "Lesson: When using World Position Offset for animation (like wind), remember that shadows are generated in a separate pass. Use a Shadow Pass Switch node in the material (and refine shadow bias on the light if needed) so the shadow pass accounts for WPO and the mesh's shadow doesn't detach or drift away from the visible geometry.",
            choices: []
        }
    }
};