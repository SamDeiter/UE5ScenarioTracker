window.SCENARIOS['PhysicsCrateFallsThroughFloor'] = {
    meta: {
        expanded: true,
        title: "Physics Crate Falls Through Floor",
        description: "Simulating actor falls through ground. Investigates Complex vs Simple collision requirements for physics.",
        estimateHours: 1.5,
        category: "Physics"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'physics',
            title: 'The Symptom',
            prompt: "You placed a crate in your level and enabled 'Simulate Physics' so it can be kicked around. However, when you press Play, the crate immediately falls straight through the floor and into the void. Your character can walk on the floor just fine. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You switch to 'Player Collision' view mode. You see the floor is solid. Then you switch to 'Simple Collision' view mode, and the floor mesh disappears entirely! This is a huge clue.",
                    next: 'step-2'
                },
                {
                    text: "Increase Mass of Crate]",
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
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You revert the physics settings and look at the collision geometry itself.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'physics',
            title: 'Investigation',
            prompt: "Your character (using a Capsule Component) walks on the floor fine, but the physics crate falls through. Why the difference?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You realize that Character movement often traces against 'Complex' collision (the visible mesh triangles) by default. However, simulating physics bodies (Rigid Bodies) require 'Simple' collision primitives (Box, Sphere, Convex Hull) to collide efficiently. The floor mesh has no Simple Collision generated.",
                    next: 'step-3'
                },
                {
                    text: "Enable CCD (Continuous Collision Detection)]",
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
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the floor mesh is missing the specific type of collision data needed for physics simulation.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'physics',
            title: 'The Fix',
            prompt: "The floor mesh lacks Simple Collision. How do you fix it?",
            choices: [
                {
                    text: "Add Simple Collision to the Floor Mesh]",
                    type: 'correct',
                    feedback: "You open the Static Mesh Editor for the floor. You go to the 'Collision' menu and select 'Add Box Simplified Collision' (or Auto Convex). A green outline appears. You save the mesh.",
                    next: 'step-4'
                },
                {
                    text: "Set Collision Complexity to 'Use Complex as Simple']",
                    type: 'correct',
                    feedback: "Alternative: In the Static Mesh settings, you change 'Collision Complexity' to 'Use Complex Collision As Simple'. This forces the physics engine to use the trimesh. It works, but is more expensive than a simple box.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'physics',
            title: 'Verification',
            prompt: "You've added collision data to the floor. How do you verify?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "You press Play. The crate lands with a thud and sits perfectly on the floor. You can kick it around, and it collides correctly. Success!",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'physics',
            title: 'Crate Collision Check',
            prompt: "You've identified the floor's simple collision is missing via view modes. But what about the crate itself? Is it set up to collide correctly, or could its settings be contributing to the issue?",
            choices: [
                {
                    text: "Inspect Crate's Static Mesh Collision Settings]",
                    type: 'correct',
                    feedback: "You open the crate's Static Mesh Editor. You see it has a simple box collision generated and its 'Collision Complexity' is set to 'Project Default' (which typically means 'Use Simple Collision'). The crate itself seems fine.",
                    next: 'step-inv-2'
                },
                {
                    text: "Set Crate's Collision Complexity to 'Use Complex as Simple']",
                    type: 'misguided',
                    feedback: "You try to force the crate to use its complex mesh for collision. While this might work, it's generally inefficient for physics objects and doesn't address the *floor's* lack of simple collision. The crate still falls through.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'physics',
            title: 'Dead End: Crate Complex Collision',
            prompt: "Setting the crate to use complex collision didn't solve the problem. The floor is still the primary suspect. What's another way to visualize the *actual* physics collision data in the world, beyond just editor view modes?",
            choices: [
                {
                    text: "Revert Crate Settings and Use Console Command]",
                    type: 'correct',
                    feedback: "You revert the crate's collision settings. You recall a powerful console command for physics debugging that shows exactly what the physics engine sees.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'physics',
            title: 'Physics Debug Visualization',
            prompt: "You've checked the view modes and the crate's settings. Now, let's use a more direct physics visualization tool. What console command can show you exactly what the physics engine 'sees' for collision shapes?",
            choices: [
                {
                    text: "Execute Console Command: `pxvis collision`]",
                    type: 'correct',
                    feedback: "You open the console and type `pxvis collision`. Now, when you press Play, you see green wireframes for all simple collision bodies. The crate has one, but the floor is completely devoid of any green wireframe, confirming it has no simple collision for the physics engine to interact with.",
                    next: 'step-2'
                },
                {
                    text: "Execute Console Command: `show collision`]",
                    type: 'wrong',
                    feedback: "`show collision` is useful for general collision visualization, but `pxvis collision` is specifically for PhysX/Chaos collision shapes, which is what rigid bodies use. You still don't see the physics-specific collision.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'physics',
            title: 'Dead End: Wrong Console Command',
            prompt: "The `show collision` command didn't give you the specific physics visualization you needed. What's the correct command to see the physics engine's collision shapes?",
            choices: [
                {
                    text: "Recall `pxvis collision`]",
                    type: 'correct',
                    feedback: "You remember the `pxvis collision` command is the one for visualizing physics engine collision shapes.",
                    next: 'step-2'
                },
            ]
        },

        'step-ver-1': {
            skill: 'physics',
            title: 'Standalone Game Verification',
            prompt: "The crate now works perfectly in Play In Editor (PIE). Is it guaranteed to work the same way in a packaged or standalone game? What's the next logical step for thorough verification?",
            choices: [
                {
                    text: "Launch as Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the game in 'Standalone Game' mode. The crate still lands perfectly and behaves as expected. This confirms the fix isn't just a PIE quirk and will hold up in a deployed build.",
                    next: 'step-ver-2'
                },
                {
                    text: "Assume it's fine and move on]",
                    type: 'wrong',
                    feedback: "It's always good practice to verify in a standalone build, as PIE can sometimes behave slightly differently due to editor overhead or specific settings. Skipping this step can lead to surprises later.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'physics',
            title: 'Dead End: No Standalone Test',
            prompt: "You skipped the standalone test. While it might be fine, it's a missed opportunity for thorough verification. What's another important aspect to check after implementing a physics fix, especially if you used 'Use Complex as Simple' for the floor?",
            choices: [
                {
                    text: "Check Performance Impact]",
                    type: 'correct',
                    feedback: "You decide to check the performance impact of your collision solution, which is crucial for optimization.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'physics',
            title: 'Performance Impact Analysis',
            prompt: "You've fixed the collision and verified it in standalone mode. Now, especially if you chose 'Use Complex Collision As Simple' for the floor (which can be expensive), what's a good way to check the performance impact of your physics solution?",
            choices: [
                {
                    text: "Use `stat physics` console command]",
                    type: 'correct',
                    feedback: "You open the console and type `stat physics`. You observe the 'Physics Time' and 'Collision Query' metrics. If you used 'Use Complex as Simple' on a very detailed mesh, you might see a noticeable increase in physics cost compared to a simple box collision. This helps you make informed decisions about collision complexity versus performance.",
                    next: 'conclusion'
                },
                {
                    text: "Use `stat fps`]",
                    type: 'misguided',
                    feedback: "`stat fps` gives you overall frame rate, but `stat physics` provides a more granular breakdown of physics-specific performance, which is crucial here to pinpoint any overhead from your collision changes.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'physics',
            title: 'Dead End: General FPS Stat',
            prompt: "`stat fps` is too general for detailed physics performance analysis. What's the specific stat command for physics performance metrics?",
            choices: [
                {
                    text: "Recall `stat physics`]",
                    type: 'correct',
                    feedback: "You remember `stat physics` is the command to get detailed physics performance metrics, including collision query times.",
                    next: 'conclusion'
                },
            ]
        },
                }
            ]
        },
        
        'step-inv-1': {
            skill: 'physics',
            title: 'Crate Collision Check',
            prompt: "You've identified the floor's simple collision is missing via view modes. But what about the crate itself? Is it set up to collide correctly, or could its settings be contributing to the issue?",
            choices: [
                {
                    text: "Inspect Crate's Static Mesh Collision Settings]",
                    type: 'correct',
                    feedback: "You open the crate's Static Mesh Editor. You see it has a simple box collision generated and its 'Collision Complexity' is set to 'Project Default' (which typically means 'Use Simple Collision'). The crate itself seems fine.",
                    next: 'step-inv-2'
                },
                {
                    text: "Set Crate's Collision Complexity to 'Use Complex as Simple']",
                    type: 'misguided',
                    feedback: "You try to force the crate to use its complex mesh for collision. While this might work, it's generally inefficient for physics objects and doesn't address the *floor's* lack of simple collision. The crate still falls through.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'physics',
            title: 'Dead End: Crate Complex Collision',
            prompt: "Setting the crate to use complex collision didn't solve the problem. The floor is still the primary suspect. What's another way to visualize the *actual* physics collision data in the world, beyond just editor view modes?",
            choices: [
                {
                    text: "Revert Crate Settings and Use Console Command]",
                    type: 'correct',
                    feedback: "You revert the crate's collision settings. You recall a powerful console command for physics debugging that shows exactly what the physics engine sees.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'physics',
            title: 'Physics Debug Visualization',
            prompt: "You've checked the view modes and the crate's settings. Now, let's use a more direct physics visualization tool. What console command can show you exactly what the physics engine 'sees' for collision shapes?",
            choices: [
                {
                    text: "Execute Console Command: `pxvis collision`]",
                    type: 'correct',
                    feedback: "You open the console and type `pxvis collision`. Now, when you press Play, you see green wireframes for all simple collision bodies. The crate has one, but the floor is completely devoid of any green wireframe, confirming it has no simple collision for the physics engine to interact with.",
                    next: 'step-2'
                },
                {
                    text: "Execute Console Command: `show collision`]",
                    type: 'wrong',
                    feedback: "`show collision` is useful for general collision visualization, but `pxvis collision` is specifically for PhysX/Chaos collision shapes, which is what rigid bodies use. You still don't see the physics-specific collision.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'physics',
            title: 'Dead End: Wrong Console Command',
            prompt: "The `show collision` command didn't give you the specific physics visualization you needed. What's the correct command to see the physics engine's collision shapes?",
            choices: [
                {
                    text: "Recall `pxvis collision`]",
                    type: 'correct',
                    feedback: "You remember the `pxvis collision` command is the one for visualizing physics engine collision shapes.",
                    next: 'step-2'
                },
            ]
        },

        'step-ver-1': {
            skill: 'physics',
            title: 'Standalone Game Verification',
            prompt: "The crate now works perfectly in Play In Editor (PIE). Is it guaranteed to work the same way in a packaged or standalone game? What's the next logical step for thorough verification?",
            choices: [
                {
                    text: "Launch as Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the game in 'Standalone Game' mode. The crate still lands perfectly and behaves as expected. This confirms the fix isn't just a PIE quirk and will hold up in a deployed build.",
                    next: 'step-ver-2'
                },
                {
                    text: "Assume it's fine and move on]",
                    type: 'wrong',
                    feedback: "It's always good practice to verify in a standalone build, as PIE can sometimes behave slightly differently due to editor overhead or specific settings. Skipping this step can lead to surprises later.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'physics',
            title: 'Dead End: No Standalone Test',
            prompt: "You skipped the standalone test. While it might be fine, it's a missed opportunity for thorough verification. What's another important aspect to check after implementing a physics fix, especially if you used 'Use Complex as Simple' for the floor?",
            choices: [
                {
                    text: "Check Performance Impact]",
                    type: 'correct',
                    feedback: "You decide to check the performance impact of your collision solution, which is crucial for optimization.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'physics',
            title: 'Performance Impact Analysis',
            prompt: "You've fixed the collision and verified it in standalone mode. Now, especially if you chose 'Use Complex Collision As Simple' for the floor (which can be expensive), what's a good way to check the performance impact of your physics solution?",
            choices: [
                {
                    text: "Use `stat physics` console command]",
                    type: 'correct',
                    feedback: "You open the console and type `stat physics`. You observe the 'Physics Time' and 'Collision Query' metrics. If you used 'Use Complex as Simple' on a very detailed mesh, you might see a noticeable increase in physics cost compared to a simple box collision. This helps you make informed decisions about collision complexity versus performance.",
                    next: 'conclusion'
                },
                {
                    text: "Use `stat fps`]",
                    type: 'misguided',
                    feedback: "`stat fps` gives you overall frame rate, but `stat physics` provides a more granular breakdown of physics-specific performance, which is crucial here to pinpoint any overhead from your collision changes.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'physics',
            title: 'Dead End: General FPS Stat',
            prompt: "`stat fps` is too general for detailed physics performance analysis. What's the specific stat command for physics performance metrics?",
            choices: [
                {
                    text: "Recall `stat physics`]",
                    type: 'correct',
                    feedback: "You remember `stat physics` is the command to get detailed physics performance metrics, including collision query times.",
                    next: 'conclusion'
                },
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