window.SCENARIOS['DistantCityNotLoading'] = {
    meta: {
        title: "Distant City Not Loading",
        description: "City invisible until teleport. Investigates HLOD generation for World Partition.",
        estimateHours: 1.5
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'world_partition',
            title: 'Step 1: The Symptom',
            prompt: "When you drive toward a distant city, nothing is visible on the horizon--buildings suddenly pop in only when you're already close, but if you teleport into the city it all loads fine. There's no distant representation of the city at all. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You enable World Partition / HLOD visualization and streaming debug. As you drive toward the city, you see that no distant HLOD cells are ever rendered; only when you're within normal streaming distance do the individual city actors load. This tells you the city has no valid far-distance HLOD representation.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You play with fog, LOD bias, and scalability settings, but the city still stays completely invisible until you're close or teleport there. Visual quality settings weren't the issue.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'world_partition',
            title: 'Dead End: Wrong Guess',
            prompt: "You chased atmospheric fog, LOD, and scalability tweaks, but the city's still gone until you're right on top of it. Clearly this isn't just a render-quality problem.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You roll back the unnecessary visual tweaks and refocus on World Partition streaming and HLOD settings for the distant city.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'world_partition',
            title: 'Step 2: Investigation',
            prompt: "You open the World Partition level and inspect the HLOD layers and the actors that make up the distant city. You want to know why nothing shows up at long range. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the city's actors are assigned to HLOD layers, but no HLODs have actually been generated for those cells--or the city meshes aren't included in any valid HLOD layer at all. Beyond the normal streaming distance, there is literally no proxy mesh to represent the city, so it simply disappears until you're close enough for the individual actors to stream in.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You consider cranking up the global World Partition streaming distance so the full city always streams in, but that would be expensive and still doesn't address the missing far-distance representation HLODs are meant to provide.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'world_partition',
            title: 'Dead End: Misguided',
            prompt: "Increasing streaming distances or forcing more cells to stay loaded would brute-force the issue and hurt performance, but the core problem remains: there's no baked low-poly proxy for the city at long range.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the proper fix is to generate HLODs for the World Partition level so the city has a dedicated distant proxy instead of trying to keep all detailed actors loaded.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'world_partition',
            title: 'Step 3: The Fix',
            prompt: "You now know the distant city has no HLOD proxies, so it vanishes beyond normal streaming distance. How do you fix it?",
            choices: [
                {
                    text: "Action: [Generate HLODs for the level.]",
                    type: 'correct',
                    feedback: "In the World Partition tools, you configure appropriate HLOD layers for the city, then build/generate HLODs for the level. This creates low-poly proxy meshes that represent the city at long distances. Once the build is done, the World Partition streaming can show the HLODs far away and swap to full-detail actors as you get closer.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'world_partition',
            title: 'Step 4: Verification',
            prompt: "With HLODs generated, you need to confirm that the city is now visible as you drive toward it, not just when you teleport. How do you verify the fix?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, you drive toward the city again. This time, a distant low-poly silhouette of the city is visible on the horizon long before you arrive. As you approach, the HLOD proxies seamlessly transition to the full-detail city actors. The city no longer pops in only when you're close, confirming the HLOD fix worked.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'world_partition',
            title: 'Conclusion',
            prompt: "Lesson: If a distant city or large area only appears when you're close or after teleporting, check HLOD generation. For World Partition levels, make sure those regions have HLOD layers and that proxies are built so the city has a low-poly representation at long range, instead of disappearing beyond normal streaming distance.",
            choices: []
        }
    }
};