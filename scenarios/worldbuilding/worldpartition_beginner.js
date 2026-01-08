window.SCENARIOS['FoliagePoppingInTooClose'] = {
    meta: {
        expanded: true,
        title: "Foliage Popping In Too Close",
        description: "Actors load at 10m. Investigates Data Layers and Loading Range.",
        estimateHours: 1.5,
        category: "World"
    },
    start: "step-A",
    steps: {
        'step-1': {
            skill: 'world_partition',
            title: 'The Symptom',
            prompt: "Newly placed bushes and rocks only appear when the player is about 10 meters away. The loading range feels way too short and ruins the illusion of a dense world. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You enable World Partition / runtime cell debug and use the Data Layer and HLOD visualization tools. You notice that these foliage actors only stream in when the nearby cell loads and that their loading radius is much smaller than the rest of the environment, hinting at a World Partition / loading range setup issue.",
                    next: 'step-B'
                },
                {
                    text: "Wrong Guess]",
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
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the unnecessary LOD/material tweaks and refocus on how these actors are streamed by World Partition--Data Layers, spatial loading, and loading ranges.",
                    next: 'step-B'
                }
            ]
        },
        'step-2': {
            skill: 'world_partition',
            title: 'Investigation',
            prompt: "You select several of the problem bushes and rocks in the level and inspect their World Partition and Data Layer settings. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You see that the actors are marked as Spatially Loaded and belong to a Data Layer / HLOD setup with a very small Loading Range. Their grid placement means the cells containing them only stream in when the player is extremely close, so the foliage pops in at around 10 meters instead of much farther out.",
                    next: 'step-3'
                },
                {
                    text: "Misguided Attempt]",
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
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the correct fix is to adjust the actors' spatial loading and loading range in the World Partition details instead of trying to hack around it with level duplicates or disabled HLODs.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'world_partition',
            title: 'The Fix',
            prompt: "You now know the cause: the foliage actors are in a World Partition setup with a loading range that's too small. How do you fix it?",
            choices: [
                {
                    text: "Adjust Loading Range or Grid Placement.]",
                    type: 'correct',
                    feedback: "In the actor and World Partition settings, you verify that \"Is Spatially Loaded\" is set correctly, then adjust the Grid Placement or increase the Loading Range for the relevant Data Layer / HLOD settings so the cells containing the bushes and rocks stream in from farther away. After saving, the foliage should begin loading at a more appropriate distance.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'world_partition',
            title: 'Verification',
            prompt: "You need to confirm that bushes and rocks now appear at a reasonable distance instead of popping in at 10 meters. How do you verify the fix?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, you approach the area again from multiple angles. This time, the bushes and rocks are already visible well before you reach them, and the World Partition debug view shows their cells loading at the new, larger range. The distracting close-range pop-in is gone.",
                    next: 'step-A'
                }
            ]
        },
        'step-A': {
            skill: 'world_partition',
            title: 'Step A: Confirming Streaming Metrics',
            prompt: "Before diving into the editor settings, you want quantitative proof that the streaming distance is indeed the issue. Which console command provides the most relevant data about World Partition cell loading distances and status?",
            choices: [
                {
                    text: "Use stat worldpartition]",
                    type: 'correct',
                    feedback: "You run `stat worldpartition` and confirm that the problematic cells are indeed only loading when the player distance is less than 1500 units (15 meters), confirming the loading range is set too low for these specific cells.",
                    next: 'step-A'
                },
                {
                    text: "Use stat unit]",
                    type: 'wrong',
                    feedback: "`stat unit` shows performance metrics (FPS, draw calls) but doesn't provide specific data on *why* cells are loading late. You need a more targeted command.",
                    next: 'step-A'
                },
            ]
        },

        'step-B': {
            skill: 'world_partition',
            title: 'Step B: Inspecting Data Layer Asset Configuration',
            prompt: "The debug view showed the foliage belongs to a specific Data Layer (e.g., 'DL_Foliage_Small'). You suspect the loading range is inherited from this asset. Where do you check the actual streaming configuration for this specific Data Layer Asset?",
            choices: [
                {
                    text: "Open the Data Layer Asset and check Streaming Settings]",
                    type: 'correct',
                    feedback: "You open the Data Layer Asset and find that the 'Loading Range' property is explicitly set to 1500 units, overriding the default World Partition settings. This is the direct cause of the close pop-in.",
                    next: 'step-B'
                },
                {
                    text: "Try disabling HLOD generation for the foliage actors]",
                    type: 'misguided',
                    feedback: "Disabling HLOD generation might slightly change performance, but it doesn't address the fundamental issue of the underlying World Partition cell streaming distance, which is controlled by the Data Layer configuration.",
                    next: 'step-RH'
                },
            ]
        },

        'step-RH': {
            skill: 'world_partition',
            title: 'Dead End: Red Herring - HLOD Misdirection',
            prompt: "Disabling HLODs didn't fix the pop-in distance. The actors still only appear when you are 10m away. You realize the issue is not *what* is loading, but *when* the cell containing them is loading.",
            choices: [
                {
                    text: "Re-examine Data Layer Streaming Settings]",
                    type: 'correct',
                    feedback: "You return to inspecting the Data Layer Asset, realizing that the Loading Range property is the key setting that needs adjustment.",
                    next: 'step-B'
                },
            ]
        },

        'step-V1': {
            skill: 'testing',
            title: 'Step V1: Standalone Game Verification',
            prompt: "You confirmed the fix in PIE, but World Partition behavior can sometimes differ in cooked builds. How do you ensure the increased loading range is correctly applied in a production environment?",
            choices: [
                {
                    text: "Launch the Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the standalone game and confirm that the foliage loads correctly at the new, farther distance. This verifies that the Data Layer Asset changes were correctly saved and packaged.",
                    next: 'step-V2'
                },
            ]
        },

        'step-V2': {
            skill: 'optimization',
            title: 'Step V2: Checking Performance Overhead',
            prompt: "Increasing the loading range means more actors are loaded and potentially rendered simultaneously. You must verify that this change hasn't introduced a massive performance regression.",
            choices: [
                {
                    text: "Use stat unit and stat streaming]",
                    type: 'correct',
                    feedback: "You run `stat unit` and confirm that the frame rate remains stable. You also run `stat streaming` to ensure the increased loading range hasn't caused excessive memory usage or streaming stalls. The performance impact is acceptable.",
                    next: 'conclusion'
                },
            ]
        },
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