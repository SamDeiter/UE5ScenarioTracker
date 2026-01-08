window.SCENARIOS['LandmarkUnloading'] = {
    meta: {
        expanded: true,
        title: "Landmark Unloading During Mission",
        description: "Important mesh unloads. Investigates \"Is Spatially Loaded\" and Data Layer activation.",
        estimateHours: 1.5,
        category: "World"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'world_partition',
            title: 'The Symptom',
            prompt: "A large Clock Tower landmark disappears when the player moves about 50 meters away, even though it's critical for the mission and should stay visible from much farther. Actor unloads by distance. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You enable World Partition debug visualization and watch the runtime cells while moving around the level. You see the Clock Tower's cell unload as soon as you cross the 50m threshold, confirming that World Partition streaming--rather than LODs or culling--is causing the landmark to vanish.",
                    next: 'step-1A'
                },
                {
                    text: "Wrong Guess]",
                    type: 'wrong',
                    feedback: "You try disabling distance culling and adjusting LOD screensize on the mesh, but the Clock Tower still completely unloads beyond ~50m. That didn't help because the issue isn't LODs--it's the actor being streamed out entirely.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'world_partition',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path tweaking LODs and cull distances, but the Clock Tower still unloads once you're far enough away. Those settings only affect how it's rendered, not whether it's streamed in at all.",
            choices: [
                {
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You roll back the unnecessary LOD/cull changes and refocus on the actor's World Partition settings--how and when the landmark is streamed by the grid.",
                    next: 'step-1A'
                }
            ]
        },
        'step-2': {
            skill: 'world_partition',
            title: 'Investigation',
            prompt: "You select the Clock Tower actor and inspect its World Partition, Data Layer, and spatial loading properties. You want to understand why it unloads so aggressively. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the Clock Tower is marked as \"Is Spatially Loaded\" and lives in a normal World Partition grid cell with the default streaming distance. As soon as the player moves beyond that grid range, the cell (and thus the Clock Tower) is unloaded. It isn't assigned to any special mission Data Layer that would keep it active, so the landmark is treated like any other distant prop and disappears.",
                    next: 'step-2R'
                },
                {
                    text: "Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You consider duplicating the Clock Tower into a second level or increasing global streaming distances, but that would be heavy-handed and could hurt performance across the whole map. Plausible, but wrong--you still haven't addressed why this specific landmark unloads.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'world_partition',
            title: 'Dead End: Misguided',
            prompt: "That didn't work because you're still relying on the default grid to stream the landmark. As long as the Clock Tower is just another spatially loaded actor, the grid distance rules will keep unloading it when the player moves away.",
            choices: [
                {
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the fix is to opt the Clock Tower out of normal grid-based streaming--either by disabling \"Is Spatially Loaded\" so it always stays loaded, or by assigning it to a Data Layer that mission logic keeps activated during relevant gameplay.",
                    next: 'step-2R'
                }
            ]
        },
        'step-3': {
            skill: 'world_partition',
            title: 'The Fix',
            prompt: "You know the cause: the Clock Tower is being unloaded by the standard World Partition grid distance. How do you fix it so the landmark stays visible for the mission?",
            choices: [
                {
                    text: "Disable 'Is Spatially Loaded' or use Data Layer.]",
                    type: 'correct',
                    feedback: "In the actor's World Partition settings, you either disable \"Is Spatially Loaded\" so the Clock Tower is always loaded regardless of distance, or you assign it to a dedicated mission Data Layer. Your mission Blueprint then keeps that Data Layer Activated while the mission is active. With either approach, the landmark is no longer governed solely by the grid's distance rules and remains present when the player moves away.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'world_partition',
            title: 'Verification',
            prompt: "You need to verify that the Clock Tower now stays visible throughout the mission, even when the player moves more than 50m away. How do you confirm the fix?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, you start the mission and move around the level, backing far away from the landmark. The Clock Tower remains loaded and visible at long distances, and World Partition debug shows its cell or Data Layer staying active for the duration of the mission. Validated--the landmark no longer unloads mid-mission.",
                    next: 'step-1A'
                }
            ]
        },
        'step-1A': {
            skill: 'console_commands',
            title: 'Step 1A: Check Streaming Metrics',
            prompt: "You confirmed the actor is streaming out. Before changing the actor, you want to verify the current streaming distance settings being applied to the cell containing the Clock Tower. Which console command helps confirm the active streaming range and cell status?",
            choices: [
                {
                    text: "Use r.WorldPartition.Streaming.Debug]",
                    type: 'correct',
                    feedback: "You use the debug command and confirm that the effective streaming distance for the Clock Tower's cell is indeed the default, short range (e.g., 100m/200m), which is insufficient for a critical landmark. This confirms the grid rules are the problem.",
                    next: 'step-1B'
                },
                {
                    text: "Use stat unit]",
                    type: 'wrong',
                    feedback: "This command shows frame time and performance metrics, not the active streaming distance or cell status. You need a World Partition specific command.",
                    next: 'step-1A'
                },
            ]
        },

        'step-1B': {
            skill: 'data_layers',
            title: 'Step 1B: Data Layer Activation Status',
            prompt: "The Clock Tower is assigned to the 'Mission_A_Landmarks' Data Layer. You suspect this layer might be inactive, forcing the actor to rely solely on spatial loading. How do you check the current runtime status of this specific Data Layer?",
            choices: [
                {
                    text: "Use Data Layer Debugger/Console Command]",
                    type: 'correct',
                    feedback: "You use the Data Layer Debugger panel or the console command `wp.DataLayer.List` and confirm that 'Mission_A_Landmarks' is currently *inactive* by default, meaning the actor is relying solely on spatial loading, which is why it unloads.",
                    next: 'step-1A'
                },
                {
                    text: "Check the actor's 'Is Spatially Loaded' flag]",
                    type: 'wrong',
                    feedback: "You already know the actor is spatially loaded. You need to check the Data Layer status itself, as that is the intended mechanism for overriding spatial loading.",
                    next: 'step-1B'
                },
            ]
        },

        'step-2R': {
            skill: 'world_partition',
            title: 'Step 2R: Red Herring: Global Streaming Distance Tweak',
            prompt: "You know the default streaming distance is too short. Instead of fixing the specific actor, you decide to increase the global streaming distance for all cells in the World Settings to 500 meters. What is the immediate consequence of this heavy-handed change?",
            choices: [
                {
                    text: "Observe massive performance hit]",
                    type: 'correct',
                    feedback: "The Clock Tower now stays loaded, but so do hundreds of other distant, non-critical props and actors across the map. Your memory usage and streaming budget spike significantly, confirming this is an inefficient, global solution that negatively impacts overall game performance.",
                    next: 'step-2R'
                },
                {
                    text: "The Clock Tower still unloads]",
                    type: 'wrong',
                    feedback: "Incorrect. Increasing the global distance *would* keep the Clock Tower loaded, but the performance cost is the real issue you must address.",
                    next: 'step-2R'
                },
            ]
        },

        'step-4A': {
            skill: 'performance',
            title: 'Step 4A: Verification: Performance Check',
            prompt: "The Clock Tower now stays loaded via the Data Layer fix. You must ensure this targeted fix didn't introduce unnecessary overhead. What metrics do you check to confirm efficiency?",
            choices: [
                {
                    text: "Check Streaming Stats and Memory]",
                    type: 'correct',
                    feedback: "You use `stat streaming` and `stat unit` while moving through the level. You confirm that only the Clock Tower's cell/Data Layer remains active at distance, and the overall memory footprint and streaming time remain stable, validating the targeted approach.",
                    next: 'step-4B'
                },
                {
                    text: "Check the actor's LODs again]",
                    type: 'wrong',
                    feedback: "The issue was streaming, not rendering. Checking LODs is irrelevant to the performance impact of keeping the actor loaded.",
                    next: 'step-4A'
                },
            ]
        },

        'step-4B': {
            skill: 'packaging',
            title: 'Step 4B: Verification: Standalone Build',
            prompt: "The fix works perfectly in PIE and the performance is acceptable. What is the final, crucial step to ensure the Data Layer activation logic functions correctly in the final product?",
            choices: [
                {
                    text: "Package and Test Standalone Build]",
                    type: 'correct',
                    feedback: "You create a packaged build and run the mission. Testing in a standalone environment confirms that the mission Blueprint correctly activates the Data Layer and keeps the Clock Tower loaded, ruling out editor-specific streaming behavior.",
                    next: 'conclusion'
                },
                {
                    text: "Run a Load Test in the Editor]",
                    type: 'wrong',
                    feedback: "While useful, editor load tests don't perfectly replicate the runtime environment of a packaged game, especially regarding streaming and Data Layer initialization.",
                    next: 'step-4B'
                },
            ]
        },
                }
            ]
        },
        
        'step-1A': {
            skill: 'console_commands',
            title: 'Step 1A: Check Streaming Metrics',
            prompt: "You confirmed the actor is streaming out. Before changing the actor, you want to verify the current streaming distance settings being applied to the cell containing the Clock Tower. Which console command helps confirm the active streaming range and cell status?",
            choices: [
                {
                    text: "Use r.WorldPartition.Streaming.Debug]",
                    type: 'correct',
                    feedback: "You use the debug command and confirm that the effective streaming distance for the Clock Tower's cell is indeed the default, short range (e.g., 100m/200m), which is insufficient for a critical landmark. This confirms the grid rules are the problem.",
                    next: 'step-1B'
                },
                {
                    text: "Use stat unit]",
                    type: 'wrong',
                    feedback: "This command shows frame time and performance metrics, not the active streaming distance or cell status. You need a World Partition specific command.",
                    next: 'step-1A'
                },
            ]
        },

        'step-1B': {
            skill: 'data_layers',
            title: 'Step 1B: Data Layer Activation Status',
            prompt: "The Clock Tower is assigned to the 'Mission_A_Landmarks' Data Layer. You suspect this layer might be inactive, forcing the actor to rely solely on spatial loading. How do you check the current runtime status of this specific Data Layer?",
            choices: [
                {
                    text: "Use Data Layer Debugger/Console Command]",
                    type: 'correct',
                    feedback: "You use the Data Layer Debugger panel or the console command `wp.DataLayer.List` and confirm that 'Mission_A_Landmarks' is currently *inactive* by default, meaning the actor is relying solely on spatial loading, which is why it unloads.",
                    next: 'step-1A'
                },
                {
                    text: "Check the actor's 'Is Spatially Loaded' flag]",
                    type: 'wrong',
                    feedback: "You already know the actor is spatially loaded. You need to check the Data Layer status itself, as that is the intended mechanism for overriding spatial loading.",
                    next: 'step-1B'
                },
            ]
        },

        'step-2R': {
            skill: 'world_partition',
            title: 'Step 2R: Red Herring: Global Streaming Distance Tweak',
            prompt: "You know the default streaming distance is too short. Instead of fixing the specific actor, you decide to increase the global streaming distance for all cells in the World Settings to 500 meters. What is the immediate consequence of this heavy-handed change?",
            choices: [
                {
                    text: "Observe massive performance hit]",
                    type: 'correct',
                    feedback: "The Clock Tower now stays loaded, but so do hundreds of other distant, non-critical props and actors across the map. Your memory usage and streaming budget spike significantly, confirming this is an inefficient, global solution that negatively impacts overall game performance.",
                    next: 'step-2R'
                },
                {
                    text: "The Clock Tower still unloads]",
                    type: 'wrong',
                    feedback: "Incorrect. Increasing the global distance *would* keep the Clock Tower loaded, but the performance cost is the real issue you must address.",
                    next: 'step-2R'
                },
            ]
        },

        'step-4A': {
            skill: 'performance',
            title: 'Step 4A: Verification: Performance Check',
            prompt: "The Clock Tower now stays loaded via the Data Layer fix. You must ensure this targeted fix didn't introduce unnecessary overhead. What metrics do you check to confirm efficiency?",
            choices: [
                {
                    text: "Check Streaming Stats and Memory]",
                    type: 'correct',
                    feedback: "You use `stat streaming` and `stat unit` while moving through the level. You confirm that only the Clock Tower's cell/Data Layer remains active at distance, and the overall memory footprint and streaming time remain stable, validating the targeted approach.",
                    next: 'step-4B'
                },
                {
                    text: "Check the actor's LODs again]",
                    type: 'wrong',
                    feedback: "The issue was streaming, not rendering. Checking LODs is irrelevant to the performance impact of keeping the actor loaded.",
                    next: 'step-4A'
                },
            ]
        },

        'step-4B': {
            skill: 'packaging',
            title: 'Step 4B: Verification: Standalone Build',
            prompt: "The fix works perfectly in PIE and the performance is acceptable. What is the final, crucial step to ensure the Data Layer activation logic functions correctly in the final product?",
            choices: [
                {
                    text: "Package and Test Standalone Build]",
                    type: 'correct',
                    feedback: "You create a packaged build and run the mission. Testing in a standalone environment confirms that the mission Blueprint correctly activates the Data Layer and keeps the Clock Tower loaded, ruling out editor-specific streaming behavior.",
                    next: 'conclusion'
                },
                {
                    text: "Run a Load Test in the Editor]",
                    type: 'wrong',
                    feedback: "While useful, editor load tests don't perfectly replicate the runtime environment of a packaged game, especially regarding streaming and Data Layer initialization.",
                    next: 'step-4B'
                },
            ]
        },

        'conclusion': {
            skill: 'world_partition',
            title: 'Conclusion',
            prompt: "Lesson: If an important landmark unloads based on grid distance, don't just crank up global streaming. Either disable \"Is Spatially Loaded\" so it always stays loaded, or place it on a mission-specific Data Layer that stays Activated while needed. This keeps key landmarks visible without breaking overall streaming performance.",
            choices: []
        }
    }
};