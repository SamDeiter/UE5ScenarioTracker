window.SCENARIOS['FogBandingArtifacts'] = {
    meta: {
        title: "Volumetric Fog Banding",
        description: "Fog looks sliced. Investigates GridPixelSize and View Distance.",
        estimateHours: 1.5
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'rendering',
            title: 'Step 1: The Symptom',
            prompt: "Your volumetric fog doesn't look smooth--it appears as distinct \"slices\" or bands in the distance, almost like horizontal layers stacked on top of each other. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You switch to fog and volumetric visualization view modes and inspect console variables. You notice the Volumetric Fog View Distance is set very high for the current quality, and the 3D grid resolution looks stretched, which hints that the fog grid is too coarse over that long range.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
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
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You revert the unnecessary color/density tweaks and refocus on how the volumetric fog grid is allocated--its view distance and resolution settings.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'rendering',
            title: 'Step 2: Investigation',
            prompt: "You dig into the volumetric fog console variables and project settings to understand why the fog volume is breaking into visible layers. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the Volumetric Fog View Distance is pushed very far, while r.VolumetricFog.GridPixelSize is still set for a relatively low-res grid. With that long view distance on a coarse grid, each depth slice becomes large enough to be visible, causing the distinct banding in the fog.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
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
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must either reduce the effective volumetric fog view distance or adjust r.VolumetricFog.GridPixelSize so the grid resolution and view distance are better matched and the banding disappears.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'rendering',
            title: 'Step 3: The Fix',
            prompt: "You know the cause: the volumetric fog grid is stretched too far, so the fog slices become visible. How do you fix it?",
            choices: [
                {
                    text: "Action: [Adjust r.VolumetricFog.GridPixelSize.]",
                    type: 'correct',
                    feedback: "You tune the volumetric settings: either increase r.VolumetricFog.GridPixelSize to use fewer, larger pixels and bring the view distance back into a comfortable range, or reduce the Volumetric Fog View Distance so the existing grid resolution isn't overextended. After balancing these settings, the fog volume is distributed more evenly and the obvious bands disappear.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'rendering',
            title: 'Step 4: Verification',
            prompt: "With the volumetric fog grid and view distance adjusted, you need to confirm that the banding is gone. How do you verify this in PIE?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, you look out across long vistas and up into the sky through the fog. The harsh slices are gone; the fog now appears as a smooth, continuous volume with subtle gradients instead of visible bands. The visual artifacts have been resolved, confirming that adjusting r.VolumetricFog.GridPixelSize and/or view distance fixed the issue.",
                    next: 'conclusion'
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