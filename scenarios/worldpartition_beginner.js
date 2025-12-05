window.SCENARIOS['FoliagePoppingInTooClose'] = {
    meta: {
        title: "Foliage Popping In Too Close",
        description: "Actors load at 10m. Investigates Data Layers and Loading Range.",
        estimateHours: 1.5
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'world_partition',
            title: 'Step 1: The Symptom',
            prompt: "Newly placed bushes and rocks only appear when the player is about 10 meters away. The loading range feels way too short and ruins the illusion of a dense world. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You enable World Partition / runtime cell debug and use the Data Layer and HLOD visualization tools. You notice that these foliage actors only stream in when the nearby cell loads and that their loading radius is much smaller than the rest of the environment, hinting at a World Partition / loading range setup issue.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You try changing LOD settings and material complexity on the meshes, but the pop-in distance doesn't change at all. Clearly this isn't just an LOD or performance problem.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'world_partition',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path, assuming the issue was mesh LODs or materials. The bushes and rocks still appear only when you're very close.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the unnecessary LOD/material tweaks and refocus on how these actors are streamed by World Partition--Data Layers, spatial loading, and loading ranges.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'world_partition',
            title: 'Step 2: Investigation',
            prompt: "You select several of the problem bushes and rocks in the level and inspect their World Partition and Data Layer settings. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You see that the actors are marked as Spatially Loaded and belong to a Data Layer / HLOD setup with a very small Loading Range. Their grid placement means the cells containing them only stream in when the player is extremely close, so the foliage pops in at around 10 meters instead of much farther out.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try duplicating the meshes into another level or turning off HLODs entirely, but that either breaks other streaming behavior or doesn't reliably fix the pop-in distance. You still haven't addressed the actual loading range configuration.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'world_partition',
            title: 'Dead End: Misguided',
            prompt: "Those changes didn't work because the underlying World Partition settings for spatial loading and loading range are still forcing the foliage to stream in too late.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the correct fix is to adjust the actors' spatial loading and loading range in the World Partition details instead of trying to hack around it with level duplicates or disabled HLODs.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'world_partition',
            title: 'Step 3: The Fix',
            prompt: "You now know the cause: the foliage actors are in a World Partition setup with a loading range that's too small. How do you fix it?",
            choices: [
                {
                    text: "Action: [Adjust Loading Range or Grid Placement.]",
                    type: 'correct',
                    feedback: "In the actor and World Partition settings, you verify that \"Is Spatially Loaded\" is set correctly, then adjust the Grid Placement or increase the Loading Range for the relevant Data Layer / HLOD settings so the cells containing the bushes and rocks stream in from farther away. After saving, the foliage should begin loading at a more appropriate distance.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'world_partition',
            title: 'Step 4: Verification',
            prompt: "You need to confirm that bushes and rocks now appear at a reasonable distance instead of popping in at 10 meters. How do you verify the fix?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, you approach the area again from multiple angles. This time, the bushes and rocks are already visible well before you reach them, and the World Partition debug view shows their cells loading at the new, larger range. The distracting close-range pop-in is gone.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'world_partition',
            title: 'Conclusion',
            prompt: "Lesson: If foliage or props only pop in very close to the player in a World Partition level, inspect their Data Layer and spatial loading settings. Make sure \"Is Spatially Loaded\" and Grid Placement are configured correctly, and increase the Loading Range so the relevant cells stream in at a reasonable distance.",
            choices: []
        }
    }
};