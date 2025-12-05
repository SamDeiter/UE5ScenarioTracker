window.SCENARIOS['TranslucencySortingIssue'] = {
    meta: {
        title: "Glass Sorting Incorrectly",
        description: "Objects behind glass disappear. Investigates Translucency Sort Priority and Blend Modes.",
        estimateHours: 1.5,
        category: "Materials"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'materials',
            title: 'Step 1: The Symptom',
            prompt: "Your glass material is set to Translucent, and in-game some objects behind it either disappear, pop in and out, or appear in front of the glass when they clearly should be behind. Translucent sorting looks wrong. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You switch to buffer visualization and translucency view modes and confirm the glass is a standard Translucent material. You can see that different translucent objects fight for draw order depending on camera angle, which points to a translucency sorting / priority issue rather than a bad mesh or texture.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You try reimporting meshes and tweaking collision, but nothing changes--the glass still causes objects behind it to vanish or appear in front. This clearly isn't a simple mesh or collision problem.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'materials',
            title: 'Dead End: Wrong Guess',
            prompt: "You chased mesh and collision issues, but the visual glitch only happens with translucent materials and depends on camera angle.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the unnecessary mesh changes and refocus on how Unreal sorts translucent materials and what options exist to control that order.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'materials',
            title: 'Step 2: Investigation',
            prompt: "You open the glass material and actor details to see how translucency is configured and how the engine is sorting it relative to other objects. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You confirm the material uses the Translucent blend mode with default settings and no special sorting overrides. The affected meshes all share similar bounds and distance from the camera, so the engine's default translucency sorting order is ambiguous. Because Translucent blend mode has inherent sorting limitations, the glass occasionally draws in the wrong order with other geometry behind it.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try changing roughness, refraction, and color, but the popping and incorrect overlap still happen. These parameters don't change how the renderer sorts translucent primitives.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'materials',
            title: 'Dead End: Misguided',
            prompt: "Those shading tweaks didn't help because the problem isn't how the glass looks, it's when and where it's drawn relative to other translucent objects.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must adjust the translucency sorting controls--such as Translucency Sort Priority or Render After DOF--or switch to a more appropriate translucency model for thin glass.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'materials',
            title: 'Step 3: The Fix',
            prompt: "You now know the issue is the default sorting of Translucent materials. How do you fix the glass so objects behind it render in the correct order?",
            choices: [
                {
                    text: "Action: [Enable \"Render After DOF\" or adjust Sort Priority.]",
                    type: 'correct',
                    feedback: "In the material and mesh details, you enable \"Render After DOF\" so the glass is drawn at a more appropriate stage, and you raise the Translucency Sort Priority on the window meshes so they consistently render in front of background objects but behind foreground ones. Where suitable, you also switch the shading model to Thin Translucent for better glass behavior. After recompiling, the sorting issues are gone from normal gameplay views.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'materials',
            title: 'Step 4: Verification',
            prompt: "You test the scene again in PIE, moving the camera around and looking through the glass at various objects behind it. How do you verify the fix?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, objects behind the glass now render consistently in the correct order as you move the camera. They no longer disappear or pop in front of the glass, confirming that adjusting Render After DOF / Translucency Sort Priority (and using Thin Translucent where appropriate) fixed the sorting problem.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'materials',
            title: 'Conclusion',
            prompt: "Lesson: Translucent materials have inherent sorting limitations. When glass appears to draw in the wrong order, use tools like Translucency Sort Priority, Render After DOF, and (where appropriate) the Thin Translucent shading model to control how and when it's rendered so objects behind it display correctly.",
            choices: []
        }
    }
};