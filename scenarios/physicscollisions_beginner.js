window.SCENARIOS['NoCollisionOnRock'] = {
    meta: {
        title: "Player Walks Through Rock",
        description: "Character clips through mesh. Investigates Collision Presets and Simplified Collision.",
        estimateHours: 1.5,
        category: "Physics"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'physics',
            title: 'Step 1: The Symptom',
            prompt: "The player character can walk straight through what looks like a solid rock mesh. Missing collision on the mesh is the prime suspect. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You enable collision view modes (e.g., Player Collision) and immediately see that the rock has no visible collision hull at all. The character capsule doesn't register any hit and just passes through empty space where the rock should block it.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You tweak the character movement settings and navmesh, but nothing changes--your character still walks through the rock like it isn't there. The issue clearly isn't with the character, it's with the rock's collision.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'physics',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path, assuming the problem was character movement or navigation. Those changes didn't stop the player from ghosting through the rock.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You roll back the unnecessary movement/nav changes and refocus on the rock mesh itself--specifically its collision setup.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'physics',
            title: 'Step 2: Investigation',
            prompt: "You open the rock asset in the Static Mesh Editor to inspect its collision setup. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "In the Static Mesh Editor you see that the rock has \"No Collision\" selected or no simplified collision primitives at all. The Collision Presets for placed instances are set so nothing blocks the player. In short: the mesh is purely visual, with no collision geometry to stop the character capsule.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You consider adding complex collision as simple or turning on CCD for the character, but that won't fix the fact that the rock currently has no proper simplified collision to interact with.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'physics',
            title: 'Dead End: Misguided',
            prompt: "Those ideas didn't resolve the core problem because the engine still has no simple collision shape to test against for this rock.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the correct approach is to give the rock a proper simplified collision mesh and ensure its Collision Presets are set to block the player.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'physics',
            title: 'Step 3: The Fix',
            prompt: "You now know the cause: the rock mesh has no usable collision. How do you fix it?",
            choices: [
                {
                    text: "Action: [Add Simplified Collision in Static Mesh Editor.]",
                    type: 'correct',
                    feedback: "In the Static Mesh Editor, you use the Collision menu to add simplified collision (such as an Auto Convex hull, 10DOP, or a Sphere/Box that tightly fits the rock). You then set the mesh's Collision Presets to BlockAll or Default so the player capsule collides with it. After saving the mesh, instances of the rock now have proper blocking collision.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'physics',
            title: 'Step 4: Verification',
            prompt: "With the collision added and presets updated, you need to verify that the rock now blocks the player correctly. How do you confirm the fix?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "You run the level in PIE and walk the player character into the rock. This time, the capsule stops against the simplified collision hull and can no longer pass through. Collision view modes also show a solid blocking shape around the rock, confirming the fix worked.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'physics',
            title: 'Conclusion',
            prompt: "Lesson: If a player walks through a solid-looking mesh, check its collision. Use the Static Mesh Editor to add simplified collision (e.g., 10DOP, sphere, or convex hull) and ensure Collision Presets are set to BlockAll or Default so the mesh actually interacts with the character.",
            choices: []
        }
    }
};