window.SCENARIOS['LightmapShadowBleeding'] = {
    meta: {
        title: "Lightmap Shadow Bleeding",
        description: "Static mesh has splotchy shadows despite high resolution. Investigates UV Channel overlaps and Lightmap Coordinate Index.",
        estimateHours: 1.5
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'lighting',
            title: 'Step 1: The Symptom',
            prompt: "After building lighting, a static mesh shows ugly, splotchy / bleeding shadows even though its Lightmap Resolution is very high (e.g. 1024). What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You switch to Lightmap Density and Lighting Only view modes and notice that despite the high resolution, the baked shadows look smeared in specific areas of the mesh. This points to a UV/lightmap problem rather than just resolution.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You try cranking the Lightmap Resolution even higher and rebake, but the shadows are still blotchy. Clearly the issue isn’t just not having enough lightmap texels.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'lighting',
            title: 'Dead End: Wrong Guess',
            prompt: "You chased resolution and build settings, but the shadows are still blotchy and bleeding. Increasing Lightmap Resolution didn’t actually solve the artifact.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the unnecessary resolution changes and focus on the mesh’s lightmap setup instead, where UV issues are far more likely.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'lighting',
            title: 'Step 2: Investigation',
            prompt: "You open the static mesh in the Static Mesh Editor and inspect the Lightmap UVs and settings. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the UVs in Channel 1 (the intended lightmap channel) have overlapping islands and/or the Lightmap Coordinate Index is incorrectly set to 0, which is the texture UV channel. As a result, the baked shadows are fighting over the same texels and bleeding across faces.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try adjusting indirect lighting settings and changing light types, but the artifacts remain. The real issue lies in the mesh’s lightmap UVs and the coordinate index, not the light actors themselves.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'lighting',
            title: 'Dead End: Misguided',
            prompt: "Those lighting tweaks didn’t work because the shadow data is still being baked into bad UVs. As long as the lightmap channel has overlaps or the wrong index, you’ll keep getting splotchy results.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must fix the lightmap UVs themselves and ensure the Lightmap Coordinate Index points to a non-overlapping channel (typically UV Channel 1).",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'lighting',
            title: 'Step 3: The Fix',
            prompt: "You now know the cause: overlapping UVs on the lightmap channel or the Lightmap Coordinate Index using the wrong channel. How do you fix it?",
            choices: [
                {
                    text: "Action: [Fix UV Channel 1 overlaps or Lightmap Coordinate Index.]",
                    type: 'correct',
                    feedback: "In the Static Mesh Editor, you inspect UV Channel 1 and either regenerate or rebuild unique, non-overlapping lightmap UVs. You then set the Lightmap Coordinate Index to 1 so the mesh uses that clean channel for baking. After saving the mesh and rebuilding lighting, the shadows are no longer splotchy.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'lighting',
            title: 'Step 4: Verification',
            prompt: "You rebake lighting and view the mesh in the level and in PIE. How do you verify the fix?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In both the level viewport and PIE, the static mesh now has clean, stable baked shadows. The previous blotchy and bleeding areas are gone, confirming that correct, non-overlapping UVs on Channel 1 and the proper Lightmap Coordinate Index fixed the issue.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'lighting',
            title: 'Conclusion',
            prompt: "Lesson: High Lightmap Resolution alone won’t fix bad bakes. For clean baked shadows, ensure your static meshes have unique, non-overlapping lightmap UVs (typically on UV Channel 1) and that the Lightmap Coordinate Index points to that channel instead of the texture UVs.",
            choices: []
        }
    }
};