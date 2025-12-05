window.SCENARIOS['LumenLightLeaking'] = {
    meta: {
        title: "Lumen Light Leaking in Dark Room",
        description: "Light leaks through corners of a dark room using Lumen. Investigates geometry thickness and Lumen tracing limitations.",
        estimateHours: 3.5
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'lighting',
            title: 'Step 1: The Symptom',
            prompt: "You have a dark interior room lit only by a small amount of bounce light, but bright outdoor light is clearly leaking through the walls and corners when using Lumen. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You switch to Lumen visualization and lighting view modes and notice that the indirect lighting rays seem to pass straight through the walls instead of being blocked. This suggests a problem with the way the room geometry is constructed.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You tweak post-process settings and exposure, but the light leaking is still there. The problem clearly isn't just tone mapping or camera settings.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'lighting',
            title: 'Dead End: Wrong Guess',
            prompt: "You chased post-process and exposure settings, but nothing fixed the obvious light leaking. You realize this is likely a geometric or Lumen tracing issue instead.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the unnecessary post-process changes and focus back on how the room geometry is built for Lumen.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'lighting',
            title: 'Step 2: Investigation',
            prompt: "You inspect the level more closely to understand why Lumen is letting light through what should be solid walls. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the room is built from single-sided planes with no thickness at all. The walls, ceiling, and floor are paper-thin, so Lumen's tracing has trouble treating them as solid blockers, causing light to bleed through the edges and corners.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try cranking up Lumen quality settings and tweaking indirect lighting controls, but the leaks remain. The underlying geometry problem hasn't been addressed.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'lighting',
            title: 'Dead End: Misguided',
            prompt: "Your Lumen quality tweaks didn't fix the leaking because the real problem is that Lumen doesn't have solid geometry to trace against. Thin, single-sided planes are still being treated unreliably.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize that no amount of Lumen quality tuning will fix fundamentally bad room geometry. You need to give Lumen proper thick walls to block light.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'lighting',
            title: 'Step 3: The Fix',
            prompt: "You now know the issue is single-sided, paper-thin walls that Lumen can't reliably treat as solid occluders. How do you fix it?",
            choices: [
                {
                    text: "Action: [Use thick geometry (walls with depth) instead of planes.]",
                    type: 'correct',
                    feedback: "You replace the paper-thin planes with proper meshes that have thickness--boxes or walls with real depth--so the room becomes an enclosed volume. With solid geometry, Lumen's traces are correctly blocked and the light leaking is dramatically reduced or eliminated.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'lighting',
            title: 'Step 4: Verification',
            prompt: "After rebuilding the room with thick walls, you test the scene again in PIE and fly around the interior. What do you observe?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, the dark room now holds its darkness properly: outdoor light no longer bleeds through the corners, and Lumen's indirect lighting behaves as expected with the thicker wall geometry.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'lighting',
            title: 'Conclusion',
            prompt: "Lesson: When using Lumen, avoid paper-thin single-sided planes for walls. Build rooms with thick geometry (walls with real depth) so Lumen has proper volumes to trace against and can reliably block light, preventing light leaking in enclosed spaces.",
            choices: []
        }
    }
};