window.SCENARIOS['MeshBlackAtDistance'] = {
    meta: {
        expanded: true,
        title: "Mesh Black at Distance (Lumen)",
        description: "Mesh turns black. Investigates Max Distance Field Replacement.",
        estimateHours: 3.0,
        difficulty: "Intermediate",
        category: "Lighting"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'lighting',
            title: 'The Symptom',
            prompt: "A mesh lit by Lumen looks fine up close, but when you back away it suddenly goes very dark or completely black, as if Lumen stopped lighting it at distance. Mesh looks like it's culled from the Lumen scene. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You switch to Lumen and Mesh Distance Field visualization view modes. Up close, the mesh shows up in the distance field representation, but once you move far enough away, its distance field proxy disappears and Lumen stops treating it as a valid surface for GI/Reflections. That's a strong clue that the mesh is being culled from the Lumen scene at distance.",
                    next: 'new-inv-1'
                },
                {
                    text: "Wrong Guess]",
                    type: 'wrong',
                    feedback: "You tweak the material and light intensity, but the mesh still turns black when you move away. The problem clearly isn't the material or light brightness--it's how Lumen is handling the mesh at distance.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'lighting',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path, assuming the issue was the material or light setup. Even after those tweaks, the mesh still loses Lumen lighting when you're far away.",
            choices: [
                {
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You roll back the unnecessary material/light changes and refocus on Lumen and Mesh Distance Field settings--specifically how and when the mesh is represented in the Lumen scene.",
                    next: 'new-inv-1'
                }
            ]
        },
        'step-2': {
            skill: 'lighting',
            title: 'Investigation',
            prompt: "You open the mesh and project settings to investigate how Lumen is handling its distance field representation and max distance. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You find that the mesh is using a very low Distance Field Resolution or is affected by a Max Distance Field / replacement setting that culls or simplifies it beyond a certain range. Once you move past that max distance, the mesh effectively drops out of the Lumen distance field scene, so Lumen can no longer calculate proper GI and reflections for it--hence it turns black at distance.",
                    next: 'step-3'
                },
                {
                    text: "Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try adding extra lights or boosting skylight intensity to \"fill in\" the darkness, but at range the mesh still looks unlit because Lumen isn't seeing it in the distance field at all. You're lighting empty space, not fixing the culling issue.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'lighting',
            title: 'Dead End: Misguided',
            prompt: "That didn't work because the underlying problem remains: beyond a certain distance, the mesh is no longer represented in the Lumen distance field scene, so no amount of extra light will make it receive proper GI.",
            choices: [
                {
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must adjust the mesh's distance field settings or Lumen's view distance so the mesh stays represented in the distance field at the ranges you care about.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'lighting',
            title: 'The Fix',
            prompt: "You know the cause: the mesh is culled or overly simplified in the distance field at range, so Lumen stops lighting it. How do you fix it?",
            choices: [
                {
                    text: "Adjust Distance Field Resolution or View Distance.]",
                    type: 'correct',
                    feedback: "You increase the mesh's Distance Field Resolution Scale (or adjust its max distance / replacement settings) so it keeps a valid distance field representation at the needed viewing ranges. If necessary, you also tweak global distance field or Lumen view-distance settings so the mesh isn't culled too aggressively. After rebuilding distance fields, the mesh now remains in the Lumen scene at distance and no longer turns black.",
                    next: 'new-ver-1'
                }
            ]
        },
        'step-4': {
            skill: 'lighting',
            title: 'Verification',
            prompt: "With the distance field and view distance settings adjusted, you need to confirm that the mesh now stays properly lit by Lumen at range. How do you verify the fix?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, you walk or fly the camera toward and away from the mesh. It now stays consistently lit by Lumen even at long distances instead of snapping to black when you back off. Distance field and Lumen visualization show the mesh's proxy remaining present, confirming that adjusting the distance field resolution/view distance solved the issue.",
                    next: 'new-inv-1'
                }
            ]
        },
                        'new-inv-1': {
                    skill: 'lighting',
                    title: 'Step 1.1: Initial Lumen Debug Views',
                    prompt: "You've confirmed the mesh turns black at distance. Before diving into specific settings, what Lumen debug view modes can help you understand *why* Lumen isn't lighting it?",
                    choices: [
                        {
                            text: "Action: [Switch to Lumen Scene and Lumen Global Distance Field view modes]",
                            type: 'correct',
                            feedback: "In 'Lumen Scene' view, you observe the mesh disappearing from the Lumen representation at distance. In 'Lumen Global Distance Field' view, you see its distance field proxy also vanishing or becoming extremely coarse. This confirms Lumen is indeed culling or simplifying the mesh out of its scene.",
                            next: 'new-inv-1'
                        },
                        {
                            text: "Action: [Check Lightmap Density view mode]",
                            type: 'wrong',
                            feedback: "Lightmap Density is irrelevant for Lumen, which uses software ray tracing on distance fields. This view mode won't give you any insights into why Lumen isn't lighting the mesh.",
                            next: 'new-inv-1W'
                        },
                    ]
                },

                'new-inv-1W': {
                    skill: 'lighting',
                    title: 'Dead End: Irrelevant View Mode',
                    prompt: "You checked an irrelevant view mode. The problem is with Lumen's interaction with the mesh at distance, not static lightmaps.",
                    choices: [
                        {
                            text: "Action: [Re-evaluate Lumen-specific debug options]",
                            type: 'correct',
                            feedback: "You refocus on Lumen's own diagnostic tools to understand its scene representation.",
                            next: 'new-inv-1'
                        },
                    ]
                },

                'new-inv-2': {
                    skill: 'lighting',
                    title: 'Step 1.2: Deeper Distance Field Investigation',
                    prompt: "The Lumen debug views confirm the mesh is dropping out of the Lumen scene. What console commands or specific visualization modes can give you more granular information about *why* it's being culled, specifically related to distance fields?",
                    choices: [
                        {
                            text: "Action: [Use `r.Lumen.Visualize 1` and `ShowFlag.MeshDistanceFields 1`]",
                            type: 'correct',
                            feedback: "Using `r.Lumen.Visualize 1` and cycling through its modes (especially 'Scene' and 'Global Distance Field') reinforces the observation. More importantly, `ShowFlag.MeshDistanceFields 1` directly shows the individual mesh's distance field representation. You clearly see the mesh's distance field proxy disappearing or becoming a single voxel at the problematic distance, confirming it's a distance field culling issue.",
                            next: 'new-inv-1'
                        },
                        {
                            text: "Action: [Adjust Post Process Volume Lumen settings randomly]",
                            type: 'wrong',
                            feedback: "Randomly tweaking settings without understanding the root cause is inefficient and likely to make things worse. You need to gather more diagnostic information first.",
                            next: 'new-inv-2W'
                        },
                    ]
                },

                'new-inv-2W': {
                    skill: 'lighting',
                    title: 'Dead End: Blind Tweaking',
                    prompt: "Blindly adjusting settings is not a debugging strategy. You need to use diagnostic tools to pinpoint the problem before attempting a fix.",
                    choices: [
                        {
                            text: "Action: [Return to diagnostic tools]",
                            type: 'correct',
                            feedback: "You revert any random changes and focus on using specific console commands and view modes to understand the distance field behavior.",
                            next: 'new-inv-1'
                        },
                    ]
                },

                'new-red-herring': {
                    skill: 'lighting',
                    title: 'Step 1.3: Red Herring - LODs and Traditional Culling',
                    prompt: "Given the mesh disappears at distance, a common thought is that it's related to traditional Level of Detail (LODs) or general rendering culling settings. You decide to investigate these first.",
                    choices: [
                        {
                            text: "Action: [Check Mesh LODs and Actor Culling Distance settings]",
                            type: 'misguided',
                            feedback: "You check the mesh's LOD settings and the actor's 'Desired Max Draw Distance' or 'Cull Distance Volume' settings. You find that the mesh's LODs are set up correctly, and it's not being culled by traditional draw distance. The mesh itself is still *rendered* by the engine, but it's *Lumen's lighting* that disappears. This confirms it's not a general rendering culling issue, but specifically how Lumen interacts with the mesh's distance field representation.",
                            next: 'new-inv-1'
                        },
                        {
                            text: "Action: [Immediately jump to Lumen Distance Field settings]",
                            type: 'correct',
                            feedback: "You correctly identify that since Lumen debug views pointed to distance fields, traditional LODs are a red herring. You proceed directly to investigate Lumen's specific distance field settings.",
                            next: 'new-inv-1'
                        },
                    ]
                },

                'new-ver-1': {
                    skill: 'lighting',
                    title: 'Step 4.1: Verification in Standalone Game',
                    prompt: "While PIE is useful, it's crucial to verify the fix in a more production-like environment. How would you confirm the fix outside of the editor?",
                    choices: [
                        {
                            text: "Action: [Launch the game in Standalone mode]",
                            type: 'correct',
                            feedback: "You launch the project in Standalone Game mode. Navigating to the problematic area, you observe that the mesh now retains its Lumen lighting at all intended distances, just as it did in PIE. This confirms the fix holds up in a more realistic runtime environment.",
                            next: 'new-ver-1'
                        },
                        {
                            text: "Action: [Rebuild all lighting and restart editor]",
                            type: 'wrong',
                            feedback: "Rebuilding lighting is not relevant for Lumen's real-time GI, and restarting the editor won't verify the fix in a standalone context. You need to test the actual game build.",
                            next: 'new-ver-1W'
                        },
                    ]
                },

                'new-ver-1W': {
                    skill: 'lighting',
                    title: 'Dead End: Incorrect Verification Method',
                    prompt: "You used an incorrect method for verifying the fix in a production-like environment. Lumen doesn't use static lightmaps, and restarting the editor doesn't simulate a standalone game.",
                    choices: [
                        {
                            text: "Action: [Choose the correct standalone verification method]",
                            type: 'correct',
                            feedback: "You realize the importance of testing in a standalone game to ensure the fix is robust for deployment.",
                            next: 'new-ver-1'
                        },
                    ]
                },

                'new-ver-2': {
                    skill: 'lighting',
                    title: 'Step 4.2: Performance Impact Assessment',
                    prompt: "Increasing distance field resolution or view distance can impact performance. What steps would you take to ensure your fix hasn't introduced an unacceptable performance regression?",
                    choices: [
                        {
                            text: "Action: [Use `stat unit` and `stat gpu` console commands]",
                            type: 'correct',
                            feedback: "You use `stat unit` and `stat gpu` (or the GPU Visualizer) to monitor frame rates and GPU timings before and after the change. You specifically look for increases in 'Lumen Scene' or 'Global Distance Field' rendering costs. You confirm that while there might be a slight increase, it remains within acceptable performance budgets for your project, indicating the fix is viable.",
                            next: 'new-ver-1'
                        },
                        {
                            text: "Action: [Just assume it's fine if it looks good]",
                            type: 'wrong',
                            feedback: "Assuming performance is fine without verification is a critical mistake. Visual quality doesn't always correlate with performance, especially with complex systems like Lumen.",
                            next: 'new-ver-2W'
                        },
                    ]
                },

                'new-ver-2W': {
                    skill: 'lighting',
                    title: 'Dead End: Neglecting Performance',
                    prompt: "Ignoring performance impact is a common pitfall. A visually correct fix that tanks frame rates is not a viable solution for a game.",
                    choices: [
                        {
                            text: "Action: [Prioritize performance verification]",
                            type: 'correct',
                            feedback: "You understand that performance is paramount and proceed to use the appropriate tools to measure the impact of your changes.",
                            next: 'new-ver-1'
                        },
                    ]
                },


                'step-inv-1': {
                    skill: 'lighting',
                    title: 'Step 1.1: Deeper Lumen Scene Analysis',
                    prompt: "The basic view modes confirmed the distance field proxy disappears. Now, let's use more specific Lumen visualization tools to confirm the mesh's presence (or absence) in the Lumen scene itself at distance.",
                    choices: [
                        {
                            text: "Action: [Use `r.Lumen.Visualize 1` and `r.Lumen.Visualize 2`]",
                            type: 'correct',
                            feedback: "You use `r.Lumen.Visualize 1` (Lumen Scene) and `r.Lumen.Visualize 2` (Surface Cache). Up close, the mesh is clearly represented. As you back away, it vanishes from both visualizations, confirming Lumen is no longer tracking it for GI/reflections. This strongly points to a distance field culling issue.",
                            next: 'step-inv-2'
                        },
                        {
                            text: "Action: [Adjust Post Process Volume settings]",
                            type: 'wrong',
                            feedback: "You tweak global Lumen settings in the Post Process Volume, but the mesh still disappears from the Lumen scene at distance. The problem isn't the *quality* of Lumen, but whether the mesh is *present* in the scene at all.",
                            next: 'step-inv-1W'
                        },
                    ]
                },

                'step-inv-1W': {
                    skill: 'lighting',
                    title: 'Dead End: Global Lumen Settings',
                    prompt: "Adjusting global Lumen settings didn't help because the mesh isn't even being considered by Lumen at distance. You need to investigate why it's disappearing from the Lumen scene.",
                    choices: [
                        {
                            text: "Action: [Revert and focus on mesh representation]",
                            type: 'correct',
                            feedback: "You revert the Post Process Volume changes and realize you need to investigate the mesh's individual representation in the Lumen scene, not global Lumen quality.",
                            next: 'step-inv-2'
                        },
                    ]
                },

                'step-inv-2': {
                    skill: 'lighting',
                    title: 'Step 1.2: Inspecting Mesh Instance Properties',
                    prompt: "Before diving into the mesh asset itself, let's check the specific instance of the mesh in your level. What properties might be overriding or influencing its distance field generation or visibility at range?",
                    choices: [
                        {
                            text: "Action: [Check 'Details' panel for 'Generate Mesh Distance Field' and 'Distance Field Resolution Scale']",
                            type: 'correct',
                            feedback: "You select the mesh instance in the level and inspect its 'Details' panel. You confirm 'Generate Mesh Distance Field' is enabled, but notice the 'Distance Field Resolution Scale' might be set too low, or there's a 'Max Draw Distance' that could be interfering. You also check 'Bounds Scale' which can affect the distance field generation.",
                            next: 'step-red-herring'
                        },
                        {
                            text: "Action: [Change the mesh's material to an unlit one]",
                            type: 'wrong',
                            feedback: "Changing the material to unlit confirms the mesh itself is still rendering, but it doesn't solve the problem of Lumen *lighting* it. The issue is still about its representation in the Lumen scene, not its base material properties.",
                            next: 'step-inv-2W'
                        },
                    ]
                },

                'step-inv-2W': {
                    skill: 'lighting',
                    title: 'Dead End: Material Misdirection',
                    prompt: "The material isn't the issue; the mesh is still physically present. The problem is specifically with how Lumen perceives and lights it at distance. You need to focus on distance field generation and culling.",
                    choices: [
                        {
                            text: "Action: [Re-evaluate mesh instance properties]",
                            type: 'correct',
                            feedback: "You refocus on the mesh's instance properties, specifically those related to distance field generation and culling, realizing the material is a red herring.",
                            next: 'step-red-herring'
                        },
                    ]
                },

                'step-red-herring': {
                    skill: 'lighting',
                    title: 'Red Herring: LODs and General Culling',
                    prompt: "Given the mesh disappears at distance, you might suspect it's related to Level of Detail (LOD) settings or general culling. You decide to investigate these first.",
                    choices: [
                        {
                            text: "Action: [Adjust mesh LOD settings and 'Min/Max Draw Distance']",
                            type: 'misguided',
                            feedback: "You adjust the mesh's LOD settings, ensuring it has LODs at distance, and even increase its 'Min/Max Draw Distance' in the details panel. While this prevents the mesh from disappearing *visually* from the camera, Lumen still treats it as black at distance. This confirms the issue isn't general rendering culling, but specifically Lumen's interaction with the mesh's distance field representation.",
                            next: 'step-red-herring-M'
                        },
                    ]
                },

                'step-red-herring-M': {
                    skill: 'lighting',
                    title: 'Dead End: LODs and Culling (Misguided)',
                    prompt: "You've confirmed that adjusting LODs and general draw distances doesn't solve the Lumen lighting issue. The mesh is still visually present, but Lumen isn't lighting it. This means the problem is specific to Lumen's scene representation, not general rendering culling.",
                    choices: [
                        {
                            text: "Action: [Re-focus on Lumen's distance field representation]",
                            type: 'correct',
                            feedback: "You realize that while LODs and draw distances are important, they don't address Lumen's specific requirement for a valid distance field. You need to go back to investigating how the mesh is represented in the Lumen distance field scene.",
                            next: 'step-2'
                        },
                    ]
                },

                'step-ver-1': {
                    skill: 'lighting',
                    title: 'Step 4.1: Verification - Standalone Game Test',
                    prompt: "You've verified the fix in PIE. To ensure the changes hold up in a more realistic environment and catch any editor-only quirks, how would you perform a final verification?",
                    choices: [
                        {
                            text: "Action: [Launch Standalone Game and test]",
                            type: 'correct',
                            feedback: "You launch the project as a Standalone Game. Navigating the camera around the mesh confirms it remains consistently lit by Lumen at all intended distances, just as it did in PIE. This provides a higher degree of confidence in the fix.",
                            next: 'step-ver-2'
                        },
                    ]
                },

                'step-ver-2': {
                    skill: 'lighting',
                    title: 'Step 4.2: Verification - Performance Impact',
                    prompt: "While the mesh is now correctly lit, increasing distance field resolution or view distances can have a performance impact. How do you check if your fix introduced any significant performance regressions?",
                    choices: [
                        {
                            text: "Action: [Use `stat gpu` and `stat lumen` console commands]",
                            type: 'correct',
                            feedback: "You use `stat gpu` and `stat lumen` in PIE and/or Standalone Game. You monitor the frame rate and specific Lumen-related costs (like 'Lumen Scene' or 'Distance Fields') to ensure the increased resolution or view distance hasn't caused an unacceptable performance hit. If it has, you might need to find a balance between visual quality and performance, perhaps by using a custom distance field for the mesh or optimizing other scene elements.",
                            next: 'conclusion'
                        },
                    ]
                },


        'conclusion': {
            skill: 'lighting',
            title: 'Scenario Complete',
            prompt: 'Congratulations! You resolved the issue. The mesh remains visible at distance.',
            choices: []
        }
    }
};
