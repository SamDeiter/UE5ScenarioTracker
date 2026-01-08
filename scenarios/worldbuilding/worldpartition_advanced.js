window.SCENARIOS['DistantCityNotLoading'] = {
    meta: {
        expanded: true,
        title: "Distant City Not Loading",
        description: "City invisible until teleport. Investigates HLOD generation for World Partition.",
        estimateHours: 4.0,
        category: "World"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'world_partition',
            title: 'The Symptom',
            prompt: "When you drive toward a distant city, nothing is visible on the horizon--buildings suddenly pop in only when you're already close, but if you teleport into the city it all loads fine. There's no distant representation of the city at all. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You enable World Partition / HLOD visualization and streaming debug. As you drive toward the city, you see that no distant HLOD cells are ever rendered; only when you're within normal streaming distance do the individual city actors load. This tells you the city has no valid far-distance HLOD representation.",
                    next: 'step-rh-1'
                },
                {
                    text: "Wrong Guess]",
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
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You roll back the unnecessary visual tweaks and refocus on World Partition streaming and HLOD settings for the distant city.",
                    next: 'step-rh-1'
                }
            ]
        },
        'step-2': {
            skill: 'world_partition',
            title: 'Investigation',
            prompt: "You open the World Partition level and inspect the HLOD layers and the actors that make up the distant city. You want to know why nothing shows up at long range. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the city's actors are assigned to HLOD layers, but no HLODs have actually been generated for those cells--or the city meshes aren't included in any valid HLOD layer at all. Beyond the normal streaming distance, there is literally no proxy mesh to represent the city, so it simply disappears until you're close enough for the individual actors to stream in.",
                    next: 'step-3'
                },
                {
                    text: "Misguided Attempt]",
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
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the proper fix is to generate HLODs for the World Partition level so the city has a dedicated distant proxy instead of trying to keep all detailed actors loaded.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'world_partition',
            title: 'The Fix',
            prompt: "You now know the distant city has no HLOD proxies, so it vanishes beyond normal streaming distance. How do you fix it?",
            choices: [
                {
                    text: "Generate HLODs for the level.]",
                    type: 'correct',
                    feedback: "In the World Partition tools, you configure appropriate HLOD layers for the city, then build/generate HLODs for the level. This creates low-poly proxy meshes that represent the city at long distances. Once the build is done, the World Partition streaming can show the HLODs far away and swap to full-detail actors as you get closer.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'world_partition',
            title: 'Verification',
            prompt: "With HLODs generated, you need to confirm that the city is now visible as you drive toward it, not just when you teleport. How do you verify the fix?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, you drive toward the city again. This time, a distant low-poly silhouette of the city is visible on the horizon long before you arrive. As you approach, the HLOD proxies seamlessly transition to the full-detail city actors. The city no longer pops in only when you're close, confirming the HLOD fix worked.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'world_partition',
            title: 'Console Confirmation of Missing HLODs',
            prompt: "You confirmed visually that distant HLOD cells are not loading. To confirm the system status and ensure the engine is even attempting to stream them, what console command provides targeted HLOD streaming statistics?",
            choices: [
                {
                    text: "Use r.WorldPartition.HLOD.ShowStats 1]",
                    type: 'correct',
                    feedback: "This command confirms that the engine is requesting HLODs for the distant cells, but the 'Loaded' count remains zero, indicating the assets are missing or invalid. This confirms the issue is asset generation, not just visualization.",
                    next: 'step-inv-2'
                },
                {
                    text: "Use stat streaming]",
                    type: 'wrong',
                    feedback: "While useful, 'stat streaming' focuses on texture and general asset streaming, not specifically the HLOD proxy meshes required for distant visibility.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'world_partition',
            title: 'Inspecting Actor HLOD Assignment',
            prompt: "Since the HLOD assets are confirmed missing, you need to check if the city actors were correctly configured to be included in the HLOD generation process. You select several key city meshes in the World Partition editor. What property are you primarily looking for in the Details panel?",
            choices: [
                {
                    text: "Details Panel: HLOD Layer setting",
                    type: 'correct',
                    feedback: "You confirm that many critical city actors are either set to 'None' or assigned to an HLOD Layer that is configured to skip generation (e.g., a layer only meant for foliage). This confirms the generation process failed because the inputs were ignored, leading directly to the root cause identification.",
                    next: 'step-rh-1'
                },
                {
                    text: "Details Panel: Distance Field Resolution",
                    type: 'misguided',
                    feedback: "You check the Distance Field settings, thinking this might affect distant representation, but Distance Fields are primarily used for lighting/shadowing (like Lumen or AO), not for generating the visible proxy meshes needed for HLOD streaming.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'rendering',
            title: 'Dead End: Chasing Distance Fields',
            prompt: "You spent time adjusting Mesh Distance Field settings. While this might improve distant shadows or lighting, it has no effect on the actual visibility of the city's geometry at long range. What is the fundamental difference between Distance Fields and HLODs in this context?",
            choices: [
                {
                    text: "Realize Distance Fields are lighting/shadow proxies, HLODs are visible geometry proxies.",
                    type: 'correct',
                    feedback: "You correctly pivot back. HLODs create simplified, visible geometry meshes for streaming, whereas Distance Fields are volumetric representations used by lighting systems. The city needs a visible mesh proxy.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'deployment',
            title: 'Standalone Build Test',
            prompt: "PIE tests are often unreliable for streaming issues compared to a packaged build, especially concerning cooked assets like HLODs. To ensure the generated HLOD assets are correctly cooked, packaged, and streamed in a real scenario, what is the next critical verification step?",
            choices: [
                {
                    text: "Package the project and run a Standalone build]",
                    type: 'correct',
                    feedback: "You package the project. Running the standalone executable confirms that the HLODs stream correctly outside of the editor environment, validating the cooking process successfully included the new proxy meshes.",
                    next: 'step-ver-2'
                },
                {
                    text: "Check the Content Browser for the HLOD assets]",
                    type: 'wrong',
                    feedback: "While you can see the assets, checking the Content Browser doesn't verify that the engine correctly streams them during runtime in a packaged environment.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'optimization',
            title: 'Performance Check',
            prompt: "Generating HLODs fixes visibility, but poorly configured HLODs (too high poly count, too many draw calls) can hurt performance. How do you verify that the newly generated distant city representation is performant and hasn't introduced a new bottleneck?",
            choices: [
                {
                    text: "Use stat unit and stat streaming in the standalone build]",
                    type: 'correct',
                    feedback: "You run `stat unit` and confirm that the GPU/Draw thread times remain stable when looking at the distant city. You also use `stat streaming` to ensure the HLOD assets are loaded efficiently without causing excessive memory spikes, confirming the fix is optimized.",
                    next: 'conclusion'
                },
                {
                    text: "Run the CPU profiler for 30 seconds]",
                    type: 'wrong',
                    feedback: "While profiling is good, using `stat unit` and streaming stats provides immediate, real-time feedback on the cost of the newly loaded geometry and streaming budget, which is more targeted for this specific fix.",
                    next: 'conclusion'
                },
            ]
        },
                }
            ]
        },
        
        'step-inv-1': {
            skill: 'world_partition',
            title: 'Console Confirmation of Missing HLODs',
            prompt: "You confirmed visually that distant HLOD cells are not loading. To confirm the system status and ensure the engine is even attempting to stream them, what console command provides targeted HLOD streaming statistics?",
            choices: [
                {
                    text: "Use r.WorldPartition.HLOD.ShowStats 1]",
                    type: 'correct',
                    feedback: "This command confirms that the engine is requesting HLODs for the distant cells, but the 'Loaded' count remains zero, indicating the assets are missing or invalid. This confirms the issue is asset generation, not just visualization.",
                    next: 'step-inv-2'
                },
                {
                    text: "Use stat streaming]",
                    type: 'wrong',
                    feedback: "While useful, 'stat streaming' focuses on texture and general asset streaming, not specifically the HLOD proxy meshes required for distant visibility.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'world_partition',
            title: 'Inspecting Actor HLOD Assignment',
            prompt: "Since the HLOD assets are confirmed missing, you need to check if the city actors were correctly configured to be included in the HLOD generation process. You select several key city meshes in the World Partition editor. What property are you primarily looking for in the Details panel?",
            choices: [
                {
                    text: "Details Panel: HLOD Layer setting",
                    type: 'correct',
                    feedback: "You confirm that many critical city actors are either set to 'None' or assigned to an HLOD Layer that is configured to skip generation (e.g., a layer only meant for foliage). This confirms the generation process failed because the inputs were ignored, leading directly to the root cause identification.",
                    next: 'step-rh-1'
                },
                {
                    text: "Details Panel: Distance Field Resolution",
                    type: 'misguided',
                    feedback: "You check the Distance Field settings, thinking this might affect distant representation, but Distance Fields are primarily used for lighting/shadowing (like Lumen or AO), not for generating the visible proxy meshes needed for HLOD streaming.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'rendering',
            title: 'Dead End: Chasing Distance Fields',
            prompt: "You spent time adjusting Mesh Distance Field settings. While this might improve distant shadows or lighting, it has no effect on the actual visibility of the city's geometry at long range. What is the fundamental difference between Distance Fields and HLODs in this context?",
            choices: [
                {
                    text: "Realize Distance Fields are lighting/shadow proxies, HLODs are visible geometry proxies.",
                    type: 'correct',
                    feedback: "You correctly pivot back. HLODs create simplified, visible geometry meshes for streaming, whereas Distance Fields are volumetric representations used by lighting systems. The city needs a visible mesh proxy.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'deployment',
            title: 'Standalone Build Test',
            prompt: "PIE tests are often unreliable for streaming issues compared to a packaged build, especially concerning cooked assets like HLODs. To ensure the generated HLOD assets are correctly cooked, packaged, and streamed in a real scenario, what is the next critical verification step?",
            choices: [
                {
                    text: "Package the project and run a Standalone build]",
                    type: 'correct',
                    feedback: "You package the project. Running the standalone executable confirms that the HLODs stream correctly outside of the editor environment, validating the cooking process successfully included the new proxy meshes.",
                    next: 'step-ver-2'
                },
                {
                    text: "Check the Content Browser for the HLOD assets]",
                    type: 'wrong',
                    feedback: "While you can see the assets, checking the Content Browser doesn't verify that the engine correctly streams them during runtime in a packaged environment.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'optimization',
            title: 'Performance Check',
            prompt: "Generating HLODs fixes visibility, but poorly configured HLODs (too high poly count, too many draw calls) can hurt performance. How do you verify that the newly generated distant city representation is performant and hasn't introduced a new bottleneck?",
            choices: [
                {
                    text: "Use stat unit and stat streaming in the standalone build]",
                    type: 'correct',
                    feedback: "You run `stat unit` and confirm that the GPU/Draw thread times remain stable when looking at the distant city. You also use `stat streaming` to ensure the HLOD assets are loaded efficiently without causing excessive memory spikes, confirming the fix is optimized.",
                    next: 'conclusion'
                },
                {
                    text: "Run the CPU profiler for 30 seconds]",
                    type: 'wrong',
                    feedback: "While profiling is good, using `stat unit` and streaming stats provides immediate, real-time feedback on the cost of the newly loaded geometry and streaming budget, which is more targeted for this specific fix.",
                    next: 'conclusion'
                },
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