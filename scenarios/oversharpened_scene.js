window.SCENARIOS['GrainySharpening'] = {
    meta: {
        title: "Scene Looks Grainy/Sharpened",
        description: "Visuals are harsh. Investigates r.Tonemapper.Sharpen console variable.",
        estimateHours: 1.5
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'rendering',
            title: 'Step 1: The Symptom',
            prompt: "The whole game looks grainy and overly crispy, like a sharpen filter has been cranked too high. Fine details shimmer and edges look harsh. Over-sharpened visuals. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You open the console and inspect post-process settings, then use buffer visualization to confirm the base image is fine. You spot that r.Tonemapper.Sharpen is set to a very high value (above 1.0), which explains the harsh, grainy sharpening across the whole scene.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You spend time reimporting textures and tweaking their compression, but nothing changes—the scene still looks razor-sharp and noisy. The problem clearly isn’t in the textures themselves.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'rendering',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path, blaming texture import and compression settings. Rebuilding and reimporting didn’t soften the image at all.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the unnecessary texture tweaks and go back to the root cause: a post-process or console variable that’s sharpening the final image too aggressively.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'rendering',
            title: 'Step 2: Investigation',
            prompt: "You investigate the project’s post-processing pipeline and console variables to find what’s over-sharpening the image. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You find that r.Tonemapper.Sharpen is set globally to a very high value in a config file or via startup console commands. This pushes an aggressive sharpening pass on top of the tonemapped image, making the whole scene look grainy and harsh.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try lowering overall contrast and disabling film grain in the post-process volume, but the crunchy edge halos remain. Those tweaks don’t change the dedicated sharpen pass driven by r.Tonemapper.Sharpen.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'rendering',
            title: 'Dead End: Misguided',
            prompt: "Those post-process changes didn’t fix the crunchy look because the sharpening is still being applied after tonemapping via the console variable.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must directly reduce or reset r.Tonemapper.Sharpen instead of trying to hide its effect with other post-process tweaks.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'rendering',
            title: 'Step 3: The Fix',
            prompt: "You know the cause: r.Tonemapper.Sharpen is set too high. How do you fix it?",
            choices: [
                {
                    text: "Action: [Reduce r.Tonemapper.Sharpen.]",
                    type: 'correct',
                    feedback: "You set r.Tonemapper.Sharpen to a saner value between 0 and 1 (or even 0 to disable it) in the console and then commit the change in DefaultEngine.ini or your startup config. The harsh ringing and grainy oversharpening disappear, leaving a cleaner, more natural image.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'rendering',
            title: 'Step 4: Verification',
            prompt: "You need to verify that reducing r.Tonemapper.Sharpen actually fixed the grainy, over-sharpened look. How do you check it in PIE?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, the scene now looks much smoother and more filmic. Fine details no longer shimmer, edges aren’t haloed, and the overall image looks less noisy. Comparing before/after captures confirms that lowering r.Tonemapper.Sharpen resolved the over-sharpened visuals.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'rendering',
            title: 'Conclusion',
            prompt: "Lesson: If your scene looks grainy and over-sharpened, check r.Tonemapper.Sharpen. Keeping this value in the 0–1 range (or disabling it) prevents harsh post-process sharpening and preserves a clean, stable final image.",
            choices: []
        }
    }
};