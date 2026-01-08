window.SCENARIOS['NoCollisionOnRock'] = {
    meta: {
        expanded: true,
        title: "Player Walks Through Rock",
        description: "Character clips through mesh. Investigates Collision Presets and Simplified Collision.",
        estimateHours: 1.5,
        category: "Physics"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'physics',
            title: 'The Symptom',
            prompt: "The player character can walk straight through what looks like a solid rock mesh. Missing collision on the mesh is the prime suspect. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You enable collision view modes (e.g., Player Collision) and immediately see that the rock has no visible collision hull at all. The character capsule doesn't register any hit and just passes through empty space where the rock should block it.",
                    next: 'step-1-rh'
                },
                {
                    text: "Wrong Guess]",
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
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You roll back the unnecessary movement/nav changes and refocus on the rock mesh itself--specifically its collision setup.",
                    next: 'step-1-rh'
                }
            ]
        },
        'step-2': {
            skill: 'physics',
            title: 'Investigation',
            prompt: "You open the rock asset in the Static Mesh Editor to inspect its collision setup. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "In the Static Mesh Editor you see that the rock has \"No Collision\" selected or no simplified collision primitives at all. The Collision Presets for placed instances are set so nothing blocks the player. In short: the mesh is purely visual, with no collision geometry to stop the character capsule.",
                    next: 'step-3'
                },
                {
                    text: "Misguided Attempt]",
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
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the correct approach is to give the rock a proper simplified collision mesh and ensure its Collision Presets are set to block the player.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'physics',
            title: 'The Fix',
            prompt: "You now know the cause: the rock mesh has no usable collision. How do you fix it?",
            choices: [
                {
                    text: "Add Simplified Collision in Static Mesh Editor.]",
                    type: 'correct',
                    feedback: "In the Static Mesh Editor, you use the Collision menu to add simplified collision (such as an Auto Convex hull, 10DOP, or a Sphere/Box that tightly fits the rock). You then set the mesh's Collision Presets to BlockAll or Default so the player capsule collides with it. After saving the mesh, instances of the rock now have proper blocking collision.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'physics',
            title: 'Verification',
            prompt: "With the collision added and presets updated, you need to verify that the rock now blocks the player correctly. How do you confirm the fix?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "You run the level in PIE and walk the player character into the rock. This time, the capsule stops against the simplified collision hull and can no longer pass through. Collision view modes also show a solid blocking shape around the rock, confirming the fix worked.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'physics',
            title: 'Advanced Collision Visualization',
            prompt: "You've confirmed no visible collision in basic view modes. To get a more detailed look at what the engine *thinks* is there, what console commands can you use to visualize collision types?",
            choices: [
                {
                    text: "Use `Show Collision` or `PXVIS Collision` console commands.]",
                    type: 'correct',
                    feedback: "You use `Show Collision` or `PXVIS Collision` and confirm that even with these advanced debug views, the rock mesh still shows no collision geometry. This reinforces the idea that the asset itself lacks collision.",
                    next: 'step-inv-2'
                },
                {
                    text: "Use `Stat Physics` to check performance.]",
                    type: 'wrong',
                    feedback: "`Stat Physics` is useful for performance profiling, but it won't directly show you the collision geometry. You need a visualization command.",
                    next: 'step-1-rh'
                },
            ]
        },

        'step-inv-2': {
            skill: 'editor',
            title: 'Inspecting the Placed Actor's Details',
            prompt: "Before diving into the asset itself, you select the rock actor in the level. What specific properties in its Details panel should you check to ensure no overrides are preventing collision?",
            choices: [
                {
                    text: "Check 'Collision Presets', 'Generate Overlap Events', 'Simulation Generates Hit Events', and 'Collision Enabled'.]",
                    type: 'correct',
                    feedback: "You inspect the Details panel and find that the 'Collision Presets' are set to 'NoCollision' or 'OverlapAll', or 'Collision Enabled' is set to 'No Collision'. This confirms the actor's instance settings are preventing interaction, likely inheriting from an asset with no collision.",
                    next: 'step-1-rh'
                },
                {
                    text: "Check 'Mobility', 'Cast Shadows', and 'LOD settings'.]",
                    type: 'wrong',
                    feedback: "These settings relate to rendering, performance, and movement, not directly to how the mesh interacts physically with other objects. You need to focus on collision-specific properties.",
                    next: 'step-1-rh'
                },
            ]
        },

        'step-1-rh': {
            skill: 'character',
            title: 'Dead End: Character Collision Misdirection',
            prompt: "You've hit a dead end in your investigation of the rock. You briefly wonder if the *character's* collision is somehow misconfigured, allowing it to pass through. What might you mistakenly check on the character?",
            choices: [
                {
                    text: "Adjust the Character Movement Component's collision settings or the Capsule Component's collision response.]",
                    type: 'correct',
                    feedback: "While character collision settings are crucial for many interactions, changing them won't magically give the rock collision. The fundamental problem is with the rock mesh itself. You need to go back and investigate the rock.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'deployment',
            title: 'Standalone Game Verification',
            prompt: "While PIE is good for quick checks, sometimes issues only manifest in a cooked build or standalone game due to different engine configurations. How do you perform a more robust verification?",
            choices: [
                {
                    text: "Launch the game in Standalone Game mode or create a cooked build and test.]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone Game mode and confirm that the rock still correctly blocks the player. This verifies the fix holds up in a more production-like environment, ruling out editor-specific quirks.",
                    next: 'step-ver-2'
                },
                {
                    text: "Run a performance profile using `stat unit`.]",
                    type: 'wrong',
                    feedback: "`stat unit` is useful for overall performance, but it's not the primary way to verify collision functionality itself. You need to test the actual interaction.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'performance',
            title: 'Physics Debug & Performance Check',
            prompt: "The collision is working, but you want to ensure it's not overly complex or causing unexpected physics overhead. What console commands can help you monitor the physics system and its impact?",
            choices: [
                {
                    text: "Use `stat physics` and `pxvis collision` to inspect physics thread load and collision complexity.]",
                    type: 'correct',
                    feedback: "You use `stat physics` to monitor the CPU time spent on physics and `pxvis collision` to visualize the actual simplified collision used by the physics engine. This confirms the collision is efficient and not adding unnecessary overhead.",
                    next: 'step-inv-1'
                }
            ]
        },





        



                },
                {
                    text: "Check `stat fps` for overall frame rate.]",
                    type: 'wrong',
                    feedback: "`stat fps` gives you the frame rate, but `stat physics` is much more specific for diagnosing physics-related performance issues. You want to pinpoint the physics cost.",
                    next: 'step-inv-1'
                }
            ]
        },





        



                },
            ]
        },

        





        



                }
            ]
        },
        









        



                },
                {
                    text: "Check `stat fps` for overall frame rate.]",
                    type: 'wrong',
                    feedback: "`stat fps` gives you the frame rate, but `stat physics` is much more specific for diagnosing physics-related performance issues. You want to pinpoint the physics cost.",
                    next: 'step-inv-1'
                }
            ]
        },





        



                },
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