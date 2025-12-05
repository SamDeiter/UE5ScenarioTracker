window.SCENARIOS['PhysicsCrateFallsThroughFloor'] = {
    meta: {
        title: "Physics Crate Falls Through Floor",
        description: "Simulating actor falls through ground. Investigates Complex vs Simple collision requirements for physics.",
        estimateHours: 1.5,
        category: "Physics"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'physics',
            title: 'Step 1: The Symptom',
            prompt: "You placed a crate in your level and enabled 'Simulate Physics' so it can be kicked around. However, when you press Play, the crate immediately falls straight through the floor and into the void. Your character can walk on the floor just fine. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You switch to 'Player Collision' view mode. You see the floor is solid. Then you switch to 'Simple Collision' view mode, and the floor mesh disappears entirely! This is a huge clue.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Increase Mass of Crate]",
                    type: 'wrong',
                    feedback: "You increase the mass to 1000kg. It falls through the floor even faster. Mass doesn't affect whether collision is detected, only how it resolves.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'physics',
            title: 'Dead End: Mass/Friction',
            prompt: "Changing physical properties like mass or friction didn't help. The engine isn't detecting a hit at all.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You revert the physics settings and look at the collision geometry itself.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'physics',
            title: 'Step 2: Investigation',
            prompt: "Your character (using a Capsule Component) walks on the floor fine, but the physics crate falls through. Why the difference?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You realize that Character movement often traces against 'Complex' collision (the visible mesh triangles) by default. However, simulating physics bodies (Rigid Bodies) require 'Simple' collision primitives (Box, Sphere, Convex Hull) to collide efficiently. The floor mesh has no Simple Collision generated.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Enable CCD (Continuous Collision Detection)]",
                    type: 'misguided',
                    feedback: "CCD helps with fast-moving objects missing thin walls, but this crate is falling from a standstill. It's not tunneling due to speed; it's tunneling because there's 'nothing' there to hit.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'physics',
            title: 'Dead End: CCD',
            prompt: "CCD didn't stop the fall. The physics engine still sees the floor as non-existent for this rigid body.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the floor mesh is missing the specific type of collision data needed for physics simulation.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'physics',
            title: 'Step 3: The Fix',
            prompt: "The floor mesh lacks Simple Collision. How do you fix it?",
            choices: [
                {
                    text: "Action: [Add Simple Collision to the Floor Mesh]",
                    type: 'correct',
                    feedback: "You open the Static Mesh Editor for the floor. You go to the 'Collision' menu and select 'Add Box Simplified Collision' (or Auto Convex). A green outline appears. You save the mesh.",
                    next: 'step-4'
                },
                {
                    text: "Action: [Set Collision Complexity to 'Use Complex as Simple']",
                    type: 'correct',
                    feedback: "Alternative: In the Static Mesh settings, you change 'Collision Complexity' to 'Use Complex Collision As Simple'. This forces the physics engine to use the trimesh. It works, but is more expensive than a simple box.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'physics',
            title: 'Step 4: Verification',
            prompt: "You've added collision data to the floor. How do you verify?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "You press Play. The crate lands with a thud and sits perfectly on the floor. You can kick it around, and it collides correctly. Success!",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'physics',
            title: 'Conclusion',
            prompt: "Lesson: Simulating Physics requires **Simple Collision** by default. If a physics object falls through a mesh that you can walk on, check if that mesh has Simple Collision primitives generated or enable 'Use Complex as Simple'.",
            choices: []
        }
    }
};