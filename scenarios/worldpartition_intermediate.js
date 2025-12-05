window.SCENARIOS['LandmarkUnloading'] = {
    meta: {
        title: "Landmark Unloading During Mission",
        description: "Important mesh unloads. Investigates \"Is Spatially Loaded\" and Data Layer activation.",
        estimateHours: 1.5,
        category: "World"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'world_partition',
            title: 'Step 1: The Symptom',
            prompt: "A large Clock Tower landmark disappears when the player moves about 50 meters away, even though it's critical for the mission and should stay visible from much farther. Actor unloads by distance. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You enable World Partition debug visualization and watch the runtime cells while moving around the level. You see the Clock Tower's cell unload as soon as you cross the 50m threshold, confirming that World Partition streaming--rather than LODs or culling--is causing the landmark to vanish.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
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
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You roll back the unnecessary LOD/cull changes and refocus on the actor's World Partition settings--how and when the landmark is streamed by the grid.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'world_partition',
            title: 'Step 2: Investigation',
            prompt: "You select the Clock Tower actor and inspect its World Partition, Data Layer, and spatial loading properties. You want to understand why it unloads so aggressively. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the Clock Tower is marked as \"Is Spatially Loaded\" and lives in a normal World Partition grid cell with the default streaming distance. As soon as the player moves beyond that grid range, the cell (and thus the Clock Tower) is unloaded. It isn't assigned to any special mission Data Layer that would keep it active, so the landmark is treated like any other distant prop and disappears.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
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
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the fix is to opt the Clock Tower out of normal grid-based streaming--either by disabling \"Is Spatially Loaded\" so it always stays loaded, or by assigning it to a Data Layer that mission logic keeps activated during relevant gameplay.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'world_partition',
            title: 'Step 3: The Fix',
            prompt: "You know the cause: the Clock Tower is being unloaded by the standard World Partition grid distance. How do you fix it so the landmark stays visible for the mission?",
            choices: [
                {
                    text: "Action: [Disable \"Is Spatially Loaded\" or use Data Layer.]",
                    type: 'correct',
                    feedback: "In the actor's World Partition settings, you either disable \"Is Spatially Loaded\" so the Clock Tower is always loaded regardless of distance, or you assign it to a dedicated mission Data Layer. Your mission Blueprint then keeps that Data Layer Activated while the mission is active. With either approach, the landmark is no longer governed solely by the grid's distance rules and remains present when the player moves away.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'world_partition',
            title: 'Step 4: Verification',
            prompt: "You need to verify that the Clock Tower now stays visible throughout the mission, even when the player moves more than 50m away. How do you confirm the fix?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, you start the mission and move around the level, backing far away from the landmark. The Clock Tower remains loaded and visible at long distances, and World Partition debug shows its cell or Data Layer staying active for the duration of the mission. Validated--the landmark no longer unloads mid-mission.",
                    next: 'conclusion'
                }
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