window.SCENARIOS['FogBandingArtifacts'] = {
    meta: {
        expanded: true,
        title: "Volumetric Fog Banding",
        description: "Fog looks sliced. Investigates GridPixelSize and View Distance.",
        estimateHours: 3.0,
        difficulty: "Intermediate",
        category: "Volumetrics"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'rendering',
            title: 'The Symptom',
            prompt: "Your volumetric fog doesn't look smooth--it appears as distinct \"slices\" or bands in the distance, almost like horizontal layers stacked on top of each other. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You switch to fog and volumetric visualization view modes and inspect console variables. You notice the Volumetric Fog View Distance is set very high for the current quality, and the 3D grid resolution looks stretched, which hints that the fog grid is too coarse over that long range.",
                    next: 'step-1R'
                },
                {
                    text: "Wrong Guess]",
                    type: 'wrong',
                    feedback: "You start tweaking fog color and density in the Exponential Height Fog and post-process, but the hard bands and slices remain clearly visible. The issue is not simply the color or amount of fog.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'rendering',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path, assuming the banding came from bad fog color or density curves. Those changes didn't remove the visible layers in the volumetric fog.",
            choices: [
                {
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You revert the unnecessary color/density tweaks and refocus on how the volumetric fog grid is allocated--its view distance and resolution settings.",
                    next: 'step-1R'
                }
            ]
        },
        'step-2': {
            skill: 'rendering',
            title: 'Investigation',
            prompt: "You dig into the volumetric fog console variables and project settings to understand why the fog volume is breaking into visible layers. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the Volumetric Fog View Distance is pushed very far, while r.VolumetricFog.GridPixelSize is still set for a relatively low-res grid. With that long view distance on a coarse grid, each depth slice becomes large enough to be visible, causing the distinct banding in the fog.",
                    next: 'step-2A'
                },
                {
                    text: "Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try increasing volumetric fog intensity and adding more lights, but the bands just become more obvious. Brightening the fog doesn't change the underlying grid resolution or view distance mismatch.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'rendering',
            title: 'Dead End: Misguided',
            prompt: "That didn't work because you're still using the same coarse volumetric grid over a huge view distance. The renderer is forced to slice the fog into big steps, which show up as visible layers.",
            choices: [
                {
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must either reduce the effective volumetric fog view distance or adjust r.VolumetricFog.GridPixelSize so the grid resolution and view distance are better matched and the banding disappears.",
                    next: 'step-2A'
                }
            ]
        },
        'step-3': {
            skill: 'rendering',
            title: 'The Fix',
            prompt: "You know the cause: the volumetric fog grid is stretched too far, so the fog slices become visible. How do you fix it?",
            choices: [
                {
                    text: "Adjust r.VolumetricFog.GridPixelSize.]",
                    type: 'correct',
                    feedback: "You tune the volumetric settings: either increase r.VolumetricFog.GridPixelSize to use fewer, larger pixels and bring the view distance back into a comfortable range, or reduce the Volumetric Fog View Distance so the existing grid resolution isn't overextended. After balancing these settings, the fog volume is distributed more evenly and the obvious bands disappear.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'rendering',
            title: 'Verification',
            prompt: "With the volumetric fog grid and view distance adjusted, you need to confirm that the banding is gone. How do you verify this in PIE?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, you look out across long vistas and up into the sky through the fog. The harsh slices are gone; the fog now appears as a smooth, continuous volume with subtle gradients instead of visible bands. The visual artifacts have been resolved, confirming that adjusting r.VolumetricFog.GridPixelSize and/or view distance fixed the issue.",
                    next: 'step-1R'
                }
            ]
        },
        'step-1R': {
            skill: 'rendering',
            title: 'Red Herring: Adjusting Fog Density Curves',
            prompt: "You realize the banding is depth-related, but you try to mask it by aggressively tweaking the density falloff curve in the Exponential Height Fog component, hoping to make the distant fog less noticeable. What is the outcome?",
            choices: [
                {
                    text: "Observe the result]",
                    type: 'wrong',
                    feedback: "While the overall look changes, the underlying grid structure remains the same. The hard, visible slices persist in the distance, proving that density curves cannot fix a fundamental resolution mismatch.",
                    next: 'step-1R'
                },
            ]
        },

        'step-2A': {
            skill: 'rendering',
            title: 'Deep Dive: Visualizing the Grid',
            prompt: "You are certain the grid is the issue. What specific console command allows you to visualize the actual 3D grid allocation and confirm the size of the depth slices causing the banding?",
            choices: [
                {
                    text: "Execute r.VolumetricFog.VisualizeGrid 1]",
                    type: 'correct',
                    feedback: "Executing `r.VolumetricFog.VisualizeGrid 1` immediately shows the grid structure. You confirm that the depth slices are extremely large and sparse, especially in the distance, visually matching the banding artifacts you see in the scene.",
                    next: 'step-2B'
                },
            ]
        },

        'step-2B': {
            skill: 'performance',
            title: 'Analyzing Grid Allocation Performance',
            prompt: "You know the grid is stretched. Before fixing it, you check performance using `stat gpu`. What is the typical performance signature of a volumetric fog setup where the view distance is too high for the grid resolution?",
            choices: [
                {
                    text: "Check GPU stats]",
                    type: 'correct',
                    feedback: "The GPU time for volumetric fog is often low (because the grid is coarse), but the engine struggles with inconsistent sampling and integration across the vast, stretched volume, sometimes leading to hitching or unstable frame times when the camera moves, confirming the current settings are inefficiently allocating resources.",
                    next: 'step-2A'
                },
            ]
        },

        'step-4A': {
            skill: 'testing',
            title: 'Verification: Standalone Build Test',
            prompt: "The fix looks perfect in PIE. However, rendering artifacts sometimes behave differently outside the editor environment due to different culling or optimization settings. What is the next crucial verification step?",
            choices: [
                {
                    text: "Run a Standalone Game build]",
                    type: 'correct',
                    feedback: "You run a standalone build. The banding remains resolved, confirming the fix is robust. This step is vital because editor overhead or specific PIE settings can sometimes mask or exaggerate rendering issues.",
                    next: 'step-4B'
                },
            ]
        },

        'step-4B': {
            skill: 'performance',
            title: 'Verification: Performance Regression Check',
            prompt: "You fixed the banding by increasing the grid resolution (or reducing view distance). This change impacts performance. What is the final check to ensure the fix didn't introduce a new, unacceptable performance bottleneck?",
            choices: [
                {
                    text: "Enable stat unit and stat gpu]",
                    type: 'correct',
                    feedback: "You confirm that while the GPU time for volumetric fog might have slightly increased due to the finer grid, the overall frame rate remains acceptable and stable. You verify that the cost is justified by the visual quality improvement.",
                    next: 'step-4A'
                },
            ]
        },
                }
            ]
        },
        





        'conclusion': {
            skill: 'rendering',
            title: 'Conclusion',
            prompt: "Lesson: If volumetric fog shows visible \"slices\" or bands, don't just tweak color and density. Check the Volumetric Fog View Distance and r.VolumetricFog.GridPixelSize. Bringing the view distance down or adjusting the grid pixel size so the 3D fog grid isn't stretched too far will eliminate banding and restore smooth fog.",
            choices: []
        }
    }
};