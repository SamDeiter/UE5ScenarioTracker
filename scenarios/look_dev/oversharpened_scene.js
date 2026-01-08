window.SCENARIOS['GrainySharpening'] = {
    meta: {
        expanded: true,
        title: "Scene Looks Grainy/Sharpened",
        description: "Visuals are harsh. Investigates r.Tonemapper.Sharpen console variable.",
        estimateHours: 1.5,
        difficulty: "Beginner",
        category: "PostProcess"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'rendering',
            title: 'The Symptom',
            prompt: "The whole game looks grainy and overly crispy, like a sharpen filter has been cranked too high. Fine details shimmer and edges look harsh. Over-sharpened visuals. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You open the console and inspect post-process settings, then use buffer visualization to confirm the base image is fine. You spot that r.Tonemapper.Sharpen is set to a very high value (above 1.0), which explains the harsh, grainy sharpening across the whole scene.",
                    next: 'step-inv-1'
                },
                {
                    text: "Wrong Guess]",
                    type: 'wrong',
                    feedback: "You spend time reimporting textures and tweaking their compression, but nothing changes--the scene still looks razor-sharp and noisy. The problem clearly isn't in the textures themselves.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'rendering',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path, blaming texture import and compression settings. Rebuilding and reimporting didn't soften the image at all.",
            choices: [
                {
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the unnecessary texture tweaks and go back to the root cause: a post-process or console variable that's sharpening the final image too aggressively.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-2': {
            skill: 'rendering',
            title: 'Investigation',
            prompt: "You investigate the project's post-processing pipeline and console variables to find what's over-sharpening the image. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You find that r.Tonemapper.Sharpen is set globally to a very high value in a config file or via startup console commands. This pushes an aggressive sharpening pass on top of the tonemapped image, making the whole scene look grainy and harsh.",
                    next: 'step-3'
                },
                {
                    text: "Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try lowering overall contrast and disabling film grain in the post-process volume, but the crunchy edge halos remain. Those tweaks don't change the dedicated sharpen pass driven by r.Tonemapper.Sharpen.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'rendering',
            title: 'Dead End: Misguided',
            prompt: "Those post-process changes didn't fix the crunchy look because the sharpening is still being applied after tonemapping via the console variable.",
            choices: [
                {
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must directly reduce or reset r.Tonemapper.Sharpen instead of trying to hide its effect with other post-process tweaks.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'rendering',
            title: 'The Fix',
            prompt: "You know the cause: r.Tonemapper.Sharpen is set too high. How do you fix it?",
            choices: [
                {
                    text: "Reduce r.Tonemapper.Sharpen.]",
                    type: 'correct',
                    feedback: "You set r.Tonemapper.Sharpen to a saner value between 0 and 1 (or even 0 to disable it) in the console and then commit the change in DefaultEngine.ini or your startup config. The harsh ringing and grainy oversharpening disappear, leaving a cleaner, more natural image.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'rendering',
            title: 'Verification',
            prompt: "You need to verify that reducing r.Tonemapper.Sharpen actually fixed the grainy, over-sharpened look. How do you check it in PIE?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, the scene now looks much smoother and more filmic. Fine details no longer shimmer, edges aren't haloed, and the overall image looks less noisy. Comparing before/after captures confirms that lowering r.Tonemapper.Sharpen resolved the over-sharpened visuals.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'rendering',
            title: 'Initial Post-Process Scan',
            prompt: "The grainy, over-sharpened look points to a post-processing issue. Before digging into specific console variables, where do you first check for global or volume-specific settings that might be causing this?",
            choices: [
                {
                    text: "Inspect PostProcessVolume settings and Project Settings -> Rendering]",
                    type: 'correct',
                    feedback: "You open a PostProcessVolume and check its 'Sharpen' or 'Unreal Engine 4 Compatibility' settings, as well as 'Project Settings > Rendering > Post Processing' for any global overrides. While you don't find an obvious 'Sharpen' slider cranked up, you confirm post-processing is active and the issue is not from a simple volume setting.",
                    next: 'step-inv-2'
                },
                {
                    text: "Adjust Anti-Aliasing Method and Quality]",
                    type: 'wrong',
                    feedback: "You try switching between TAA, MSAA, or FXAA, and tweaking their quality settings. While this might affect edge smoothness, it doesn't resolve the underlying *grainy sharpening* effect, which is distinct from typical AA artifacts.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'rendering',
            title: 'Dead End: Anti-Aliasing Misdirection',
            prompt: "Changing Anti-Aliasing settings didn't fix the problem. The image still looks overly sharp and noisy. Why was this a dead end?",
            choices: [
                {
                    text: "Realize AA is for edge smoothing, not post-tonemap sharpening]",
                    type: 'correct',
                    feedback: "You realize that Anti-Aliasing primarily deals with jagged edges *before* the final tonemapping and post-process sharpening pass. The issue is a global sharpening effect applied *after* AA has done its job.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'rendering',
            title: 'Visualizing the Post-Process Chain',
            prompt: "You suspect a post-process effect. How can you visually confirm that the base image (before post-processing) is clean, and the sharpening is indeed applied later in the pipeline?",
            choices: [
                {
                    text: "Use Buffer Visualization Modes (e.g., Scene Color, PostProcessInput0)]",
                    type: 'correct',
                    feedback: "You switch to 'Buffer Visualization > Scene Color' and 'PostProcessInput0'. You observe that 'Scene Color' looks clean and unsharpened, but 'PostProcessInput0' (the input to the tonemapper) already shows signs of the harsh sharpening, indicating it's happening early in the post-process chain, likely within the tonemapper itself.",
                    next: 'step-inv-3'
                },
                {
                    text: "Disable all PostProcessVolumes temporarily]",
                    type: 'misguided',
                    feedback: "You try disabling all PostProcessVolumes in the scene. While this might remove *some* effects, if the sharpening is driven by a global console variable or Project Settings, it will persist, making this a less precise diagnostic.",
                    next: 'step-inv-2M'
                },
            ]
        },

        'step-inv-2M': {
            skill: 'rendering',
            title: 'Dead End: Incomplete Post-Process Disabling',
            prompt: "Disabling PostProcessVolumes didn't fully resolve the issue. The sharpening persists. What does this tell you?",
            choices: [
                {
                    text: "Realize it's a global setting or console variable]",
                    type: 'correct',
                    feedback: "You realize that the sharpening must be coming from a global setting, likely a console variable, rather than a specific PostProcessVolume. You need a more direct way to query these settings.",
                    next: 'step-inv-3'
                },
            ]
        },

        'step-inv-3': {
            skill: 'rendering',
            title: 'Querying Console Variables',
            prompt: "Buffer visualization points to an early post-process sharpening effect. You need to find the specific console variable responsible. What's the most direct way to query relevant console variables related to tonemapping or sharpening?",
            choices: [
                {
                    text: "Use `DumpConsoleVariables` or `r.Tonemapper.Sharpen ?` in the console]",
                    type: 'correct',
                    feedback: "You open the console and type `r.Tonemapper.Sharpen ?`. The console output confirms that `r.Tonemapper.Sharpen` is indeed set to a value significantly higher than its default (e.g., 2.0 or 3.0), which is the direct cause of the over-sharpening.",
                    next: 'step-inv-1'
                },
                {
                    text: "Search through all material functions for sharpening nodes]",
                    type: 'wrong',
                    feedback: "You spend time searching through material functions. While some materials might have custom sharpening, a global, grainy sharpening effect across the *entire scene* is almost certainly a post-process effect, not individual materials.",
                    next: 'step-inv-3W'
                },
            ]
        },

        'step-inv-3W': {
            skill: 'rendering',
            title: 'Dead End: Material Hunt',
            prompt: "Searching materials for sharpening nodes was a time sink. The problem is clearly global. What should you have done instead?",
            choices: [
                {
                    text: "Focus on global post-process console variables]",
                    type: 'correct',
                    feedback: "You realize that a global visual issue like this is best diagnosed by checking global rendering settings and console variables, especially those related to post-processing and tonemapping.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'rendering',
            title: 'Standalone Game Verification',
            prompt: "You've confirmed the fix in PIE. However, PIE can sometimes behave differently from a shipping build. What's the next crucial step to ensure the change is correctly applied and stable in a more production-representative environment?",
            choices: [
                {
                    text: "Launch the game in Standalone mode or a packaged build]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone mode (or a small packaged build if feasible). The visual quality remains consistent with your PIE findings: the grainy sharpening is gone, and the image is clean. This confirms the fix persists outside the editor environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Ask another developer to visually inspect in their editor]",
                    type: 'misguided',
                    feedback: "While a second pair of eyes is always good, relying solely on another editor instance doesn't fully validate the fix in a standalone or packaged game context, where config files and startup commands might be interpreted differently.",
                    next: 'step-ver-1M'
                },
            ]
        },

        'step-ver-1M': {
            skill: 'rendering',
            title: 'Dead End: Incomplete Verification',
            prompt: "Getting another developer to check in their editor is helpful, but it doesn't fully confirm the fix for a deployed game. What's the missing piece of the verification process?",
            choices: [
                {
                    text: "Test in a standalone or packaged build]",
                    type: 'correct',
                    feedback: "You realize that the ultimate test for a rendering fix is in a standalone or packaged build, which most closely mimics the end-user experience and ensures all configuration changes are correctly applied.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'rendering',
            title: 'Performance and Stability Check',
            prompt: "The visual fix is confirmed in Standalone mode. What final checks should you perform to ensure the change hasn't introduced any unexpected performance regressions or new visual artifacts in other parts of the game?",
            choices: [
                {
                    text: "Monitor `stat unit` and `stat gpu`, and visually inspect various scenes]",
                    type: 'correct',
                    feedback: "You use `stat unit` and `stat gpu` to ensure the frame rate and GPU timings are stable and haven't regressed. You also navigate through different levels and lighting scenarios to confirm no new visual glitches or artifacts have appeared, ensuring the fix is robust and localized.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'rendering',
            title: 'Initial Post-Process Scan',
            prompt: "The grainy, over-sharpened look points to a post-processing issue. Before digging into specific console variables, where do you first check for global or volume-specific settings that might be causing this?",
            choices: [
                {
                    text: "Inspect PostProcessVolume settings and Project Settings -> Rendering]",
                    type: 'correct',
                    feedback: "You open a PostProcessVolume and check its 'Sharpen' or 'Unreal Engine 4 Compatibility' settings, as well as 'Project Settings > Rendering > Post Processing' for any global overrides. While you don't find an obvious 'Sharpen' slider cranked up, you confirm post-processing is active and the issue is not from a simple volume setting.",
                    next: 'step-inv-2'
                },
                {
                    text: "Adjust Anti-Aliasing Method and Quality]",
                    type: 'wrong',
                    feedback: "You try switching between TAA, MSAA, or FXAA, and tweaking their quality settings. While this might affect edge smoothness, it doesn't resolve the underlying *grainy sharpening* effect, which is distinct from typical AA artifacts.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'rendering',
            title: 'Dead End: Anti-Aliasing Misdirection',
            prompt: "Changing Anti-Aliasing settings didn't fix the problem. The image still looks overly sharp and noisy. Why was this a dead end?",
            choices: [
                {
                    text: "Realize AA is for edge smoothing, not post-tonemap sharpening]",
                    type: 'correct',
                    feedback: "You realize that Anti-Aliasing primarily deals with jagged edges *before* the final tonemapping and post-process sharpening pass. The issue is a global sharpening effect applied *after* AA has done its job.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'rendering',
            title: 'Visualizing the Post-Process Chain',
            prompt: "You suspect a post-process effect. How can you visually confirm that the base image (before post-processing) is clean, and the sharpening is indeed applied later in the pipeline?",
            choices: [
                {
                    text: "Use Buffer Visualization Modes (e.g., Scene Color, PostProcessInput0)]",
                    type: 'correct',
                    feedback: "You switch to 'Buffer Visualization > Scene Color' and 'PostProcessInput0'. You observe that 'Scene Color' looks clean and unsharpened, but 'PostProcessInput0' (the input to the tonemapper) already shows signs of the harsh sharpening, indicating it's happening early in the post-process chain, likely within the tonemapper itself.",
                    next: 'step-inv-3'
                },
                {
                    text: "Disable all PostProcessVolumes temporarily]",
                    type: 'misguided',
                    feedback: "You try disabling all PostProcessVolumes in the scene. While this might remove *some* effects, if the sharpening is driven by a global console variable or Project Settings, it will persist, making this a less precise diagnostic.",
                    next: 'step-inv-2M'
                },
            ]
        },

        'step-inv-2M': {
            skill: 'rendering',
            title: 'Dead End: Incomplete Post-Process Disabling',
            prompt: "Disabling PostProcessVolumes didn't fully resolve the issue. The sharpening persists. What does this tell you?",
            choices: [
                {
                    text: "Realize it's a global setting or console variable]",
                    type: 'correct',
                    feedback: "You realize that the sharpening must be coming from a global setting, likely a console variable, rather than a specific PostProcessVolume. You need a more direct way to query these settings.",
                    next: 'step-inv-3'
                },
            ]
        },

        'step-inv-3': {
            skill: 'rendering',
            title: 'Querying Console Variables',
            prompt: "Buffer visualization points to an early post-process sharpening effect. You need to find the specific console variable responsible. What's the most direct way to query relevant console variables related to tonemapping or sharpening?",
            choices: [
                {
                    text: "Use `DumpConsoleVariables` or `r.Tonemapper.Sharpen ?` in the console]",
                    type: 'correct',
                    feedback: "You open the console and type `r.Tonemapper.Sharpen ?`. The console output confirms that `r.Tonemapper.Sharpen` is indeed set to a value significantly higher than its default (e.g., 2.0 or 3.0), which is the direct cause of the over-sharpening.",
                    next: 'step-inv-1'
                },
                {
                    text: "Search through all material functions for sharpening nodes]",
                    type: 'wrong',
                    feedback: "You spend time searching through material functions. While some materials might have custom sharpening, a global, grainy sharpening effect across the *entire scene* is almost certainly a post-process effect, not individual materials.",
                    next: 'step-inv-3W'
                },
            ]
        },

        'step-inv-3W': {
            skill: 'rendering',
            title: 'Dead End: Material Hunt',
            prompt: "Searching materials for sharpening nodes was a time sink. The problem is clearly global. What should you have done instead?",
            choices: [
                {
                    text: "Focus on global post-process console variables]",
                    type: 'correct',
                    feedback: "You realize that a global visual issue like this is best diagnosed by checking global rendering settings and console variables, especially those related to post-processing and tonemapping.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'rendering',
            title: 'Standalone Game Verification',
            prompt: "You've confirmed the fix in PIE. However, PIE can sometimes behave differently from a shipping build. What's the next crucial step to ensure the change is correctly applied and stable in a more production-representative environment?",
            choices: [
                {
                    text: "Launch the game in Standalone mode or a packaged build]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone mode (or a small packaged build if feasible). The visual quality remains consistent with your PIE findings: the grainy sharpening is gone, and the image is clean. This confirms the fix persists outside the editor environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Ask another developer to visually inspect in their editor]",
                    type: 'misguided',
                    feedback: "While a second pair of eyes is always good, relying solely on another editor instance doesn't fully validate the fix in a standalone or packaged game context, where config files and startup commands might be interpreted differently.",
                    next: 'step-ver-1M'
                },
            ]
        },

        'step-ver-1M': {
            skill: 'rendering',
            title: 'Dead End: Incomplete Verification',
            prompt: "Getting another developer to check in their editor is helpful, but it doesn't fully confirm the fix for a deployed game. What's the missing piece of the verification process?",
            choices: [
                {
                    text: "Test in a standalone or packaged build]",
                    type: 'correct',
                    feedback: "You realize that the ultimate test for a rendering fix is in a standalone or packaged build, which most closely mimics the end-user experience and ensures all configuration changes are correctly applied.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'rendering',
            title: 'Performance and Stability Check',
            prompt: "The visual fix is confirmed in Standalone mode. What final checks should you perform to ensure the change hasn't introduced any unexpected performance regressions or new visual artifacts in other parts of the game?",
            choices: [
                {
                    text: "Monitor `stat unit` and `stat gpu`, and visually inspect various scenes]",
                    type: 'correct',
                    feedback: "You use `stat unit` and `stat gpu` to ensure the frame rate and GPU timings are stable and haven't regressed. You also navigate through different levels and lighting scenarios to confirm no new visual glitches or artifacts have appeared, ensuring the fix is robust and localized.",
                    next: 'step-ver-1'
                },
                {
                    text: "Revert the change and re-apply it to confirm reproducibility]",
                    type: 'misguided',
                    feedback: "While confirming reproducibility is good practice for complex bugs, for a straightforward CVAR change, the primary concern after fixing is ensuring no negative side effects. Reverting and re-applying is less critical than checking performance and broader scene stability.",
                    next: 'step-ver-2M'
                },
            ]
        },

        'step-ver-2M': {
            skill: 'rendering',
            title: 'Dead End: Over-Verification',
            prompt: "Reverting and re-applying the fix is useful for some bugs, but for a simple CVAR change, it's not the most critical final verification step. What should you prioritize instead?",
            choices: [
                {
                    text: "Focus on performance and broader scene stability]",
                    type: 'correct',
                    feedback: "You realize that after a fix, the priority is to ensure the game's overall health: performance, stability, and the absence of new visual bugs across the entire project.",
                    next: 'step-ver-1'
                },
            ]
        },
                },
                {
                    text: "Revert the change and re-apply it to confirm reproducibility]",
                    type: 'misguided',
                    feedback: "While confirming reproducibility is good practice for complex bugs, for a straightforward CVAR change, the primary concern after fixing is ensuring no negative side effects. Reverting and re-applying is less critical than checking performance and broader scene stability.",
                    next: 'step-ver-2M'
                },
            ]
        },

        'step-ver-2M': {
            skill: 'rendering',
            title: 'Dead End: Over-Verification',
            prompt: "Reverting and re-applying the fix is useful for some bugs, but for a simple CVAR change, it's not the most critical final verification step. What should you prioritize instead?",
            choices: [
                {
                    text: "Focus on performance and broader scene stability]",
                    type: 'correct',
                    feedback: "You realize that after a fix, the priority is to ensure the game's overall health: performance, stability, and the absence of new visual bugs across the entire project.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'rendering',
            title: 'Initial Post-Process Scan',
            prompt: "The grainy, over-sharpened look points to a post-processing issue. Before digging into specific console variables, where do you first check for global or volume-specific settings that might be causing this?",
            choices: [
                {
                    text: "Inspect PostProcessVolume settings and Project Settings -> Rendering]",
                    type: 'correct',
                    feedback: "You open a PostProcessVolume and check its 'Sharpen' or 'Unreal Engine 4 Compatibility' settings, as well as 'Project Settings > Rendering > Post Processing' for any global overrides. While you don't find an obvious 'Sharpen' slider cranked up, you confirm post-processing is active and the issue is not from a simple volume setting.",
                    next: 'step-inv-2'
                },
                {
                    text: "Adjust Anti-Aliasing Method and Quality]",
                    type: 'wrong',
                    feedback: "You try switching between TAA, MSAA, or FXAA, and tweaking their quality settings. While this might affect edge smoothness, it doesn't resolve the underlying *grainy sharpening* effect, which is distinct from typical AA artifacts.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'rendering',
            title: 'Dead End: Anti-Aliasing Misdirection',
            prompt: "Changing Anti-Aliasing settings didn't fix the problem. The image still looks overly sharp and noisy. Why was this a dead end?",
            choices: [
                {
                    text: "Realize AA is for edge smoothing, not post-tonemap sharpening]",
                    type: 'correct',
                    feedback: "You realize that Anti-Aliasing primarily deals with jagged edges *before* the final tonemapping and post-process sharpening pass. The issue is a global sharpening effect applied *after* AA has done its job.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'rendering',
            title: 'Visualizing the Post-Process Chain',
            prompt: "You suspect a post-process effect. How can you visually confirm that the base image (before post-processing) is clean, and the sharpening is indeed applied later in the pipeline?",
            choices: [
                {
                    text: "Use Buffer Visualization Modes (e.g., Scene Color, PostProcessInput0)]",
                    type: 'correct',
                    feedback: "You switch to 'Buffer Visualization > Scene Color' and 'PostProcessInput0'. You observe that 'Scene Color' looks clean and unsharpened, but 'PostProcessInput0' (the input to the tonemapper) already shows signs of the harsh sharpening, indicating it's happening early in the post-process chain, likely within the tonemapper itself.",
                    next: 'step-inv-3'
                },
                {
                    text: "Disable all PostProcessVolumes temporarily]",
                    type: 'misguided',
                    feedback: "You try disabling all PostProcessVolumes in the scene. While this might remove *some* effects, if the sharpening is driven by a global console variable or Project Settings, it will persist, making this a less precise diagnostic.",
                    next: 'step-inv-2M'
                },
            ]
        },

        'step-inv-2M': {
            skill: 'rendering',
            title: 'Dead End: Incomplete Post-Process Disabling',
            prompt: "Disabling PostProcessVolumes didn't fully resolve the issue. The sharpening persists. What does this tell you?",
            choices: [
                {
                    text: "Realize it's a global setting or console variable]",
                    type: 'correct',
                    feedback: "You realize that the sharpening must be coming from a global setting, likely a console variable, rather than a specific PostProcessVolume. You need a more direct way to query these settings.",
                    next: 'step-inv-3'
                },
            ]
        },

        'step-inv-3': {
            skill: 'rendering',
            title: 'Querying Console Variables',
            prompt: "Buffer visualization points to an early post-process sharpening effect. You need to find the specific console variable responsible. What's the most direct way to query relevant console variables related to tonemapping or sharpening?",
            choices: [
                {
                    text: "Use `DumpConsoleVariables` or `r.Tonemapper.Sharpen ?` in the console]",
                    type: 'correct',
                    feedback: "You open the console and type `r.Tonemapper.Sharpen ?`. The console output confirms that `r.Tonemapper.Sharpen` is indeed set to a value significantly higher than its default (e.g., 2.0 or 3.0), which is the direct cause of the over-sharpening.",
                    next: 'step-inv-1'
                },
                {
                    text: "Search through all material functions for sharpening nodes]",
                    type: 'wrong',
                    feedback: "You spend time searching through material functions. While some materials might have custom sharpening, a global, grainy sharpening effect across the *entire scene* is almost certainly a post-process effect, not individual materials.",
                    next: 'step-inv-3W'
                },
            ]
        },

        'step-inv-3W': {
            skill: 'rendering',
            title: 'Dead End: Material Hunt',
            prompt: "Searching materials for sharpening nodes was a time sink. The problem is clearly global. What should you have done instead?",
            choices: [
                {
                    text: "Focus on global post-process console variables]",
                    type: 'correct',
                    feedback: "You realize that a global visual issue like this is best diagnosed by checking global rendering settings and console variables, especially those related to post-processing and tonemapping.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'rendering',
            title: 'Standalone Game Verification',
            prompt: "You've confirmed the fix in PIE. However, PIE can sometimes behave differently from a shipping build. What's the next crucial step to ensure the change is correctly applied and stable in a more production-representative environment?",
            choices: [
                {
                    text: "Launch the game in Standalone mode or a packaged build]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone mode (or a small packaged build if feasible). The visual quality remains consistent with your PIE findings: the grainy sharpening is gone, and the image is clean. This confirms the fix persists outside the editor environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Ask another developer to visually inspect in their editor]",
                    type: 'misguided',
                    feedback: "While a second pair of eyes is always good, relying solely on another editor instance doesn't fully validate the fix in a standalone or packaged game context, where config files and startup commands might be interpreted differently.",
                    next: 'step-ver-1M'
                },
            ]
        },

        'step-ver-1M': {
            skill: 'rendering',
            title: 'Dead End: Incomplete Verification',
            prompt: "Getting another developer to check in their editor is helpful, but it doesn't fully confirm the fix for a deployed game. What's the missing piece of the verification process?",
            choices: [
                {
                    text: "Test in a standalone or packaged build]",
                    type: 'correct',
                    feedback: "You realize that the ultimate test for a rendering fix is in a standalone or packaged build, which most closely mimics the end-user experience and ensures all configuration changes are correctly applied.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'rendering',
            title: 'Performance and Stability Check',
            prompt: "The visual fix is confirmed in Standalone mode. What final checks should you perform to ensure the change hasn't introduced any unexpected performance regressions or new visual artifacts in other parts of the game?",
            choices: [
                {
                    text: "Monitor `stat unit` and `stat gpu`, and visually inspect various scenes]",
                    type: 'correct',
                    feedback: "You use `stat unit` and `stat gpu` to ensure the frame rate and GPU timings are stable and haven't regressed. You also navigate through different levels and lighting scenarios to confirm no new visual glitches or artifacts have appeared, ensuring the fix is robust and localized.",
                    next: 'step-ver-1'
                },
                {
                    text: "Revert the change and re-apply it to confirm reproducibility]",
                    type: 'misguided',
                    feedback: "While confirming reproducibility is good practice for complex bugs, for a straightforward CVAR change, the primary concern after fixing is ensuring no negative side effects. Reverting and re-applying is less critical than checking performance and broader scene stability.",
                    next: 'step-ver-2M'
                },
            ]
        },

        'step-ver-2M': {
            skill: 'rendering',
            title: 'Dead End: Over-Verification',
            prompt: "Reverting and re-applying the fix is useful for some bugs, but for a simple CVAR change, it's not the most critical final verification step. What should you prioritize instead?",
            choices: [
                {
                    text: "Focus on performance and broader scene stability]",
                    type: 'correct',
                    feedback: "You realize that after a fix, the priority is to ensure the game's overall health: performance, stability, and the absence of new visual bugs across the entire project.",
                    next: 'step-ver-1'
                },
            ]
        },
                },
            ]
        },

        
        'step-inv-1': {
            skill: 'rendering',
            title: 'Initial Post-Process Scan',
            prompt: "The grainy, over-sharpened look points to a post-processing issue. Before digging into specific console variables, where do you first check for global or volume-specific settings that might be causing this?",
            choices: [
                {
                    text: "Inspect PostProcessVolume settings and Project Settings -> Rendering]",
                    type: 'correct',
                    feedback: "You open a PostProcessVolume and check its 'Sharpen' or 'Unreal Engine 4 Compatibility' settings, as well as 'Project Settings > Rendering > Post Processing' for any global overrides. While you don't find an obvious 'Sharpen' slider cranked up, you confirm post-processing is active and the issue is not from a simple volume setting.",
                    next: 'step-inv-2'
                },
                {
                    text: "Adjust Anti-Aliasing Method and Quality]",
                    type: 'wrong',
                    feedback: "You try switching between TAA, MSAA, or FXAA, and tweaking their quality settings. While this might affect edge smoothness, it doesn't resolve the underlying *grainy sharpening* effect, which is distinct from typical AA artifacts.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'rendering',
            title: 'Dead End: Anti-Aliasing Misdirection',
            prompt: "Changing Anti-Aliasing settings didn't fix the problem. The image still looks overly sharp and noisy. Why was this a dead end?",
            choices: [
                {
                    text: "Realize AA is for edge smoothing, not post-tonemap sharpening]",
                    type: 'correct',
                    feedback: "You realize that Anti-Aliasing primarily deals with jagged edges *before* the final tonemapping and post-process sharpening pass. The issue is a global sharpening effect applied *after* AA has done its job.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'rendering',
            title: 'Visualizing the Post-Process Chain',
            prompt: "You suspect a post-process effect. How can you visually confirm that the base image (before post-processing) is clean, and the sharpening is indeed applied later in the pipeline?",
            choices: [
                {
                    text: "Use Buffer Visualization Modes (e.g., Scene Color, PostProcessInput0)]",
                    type: 'correct',
                    feedback: "You switch to 'Buffer Visualization > Scene Color' and 'PostProcessInput0'. You observe that 'Scene Color' looks clean and unsharpened, but 'PostProcessInput0' (the input to the tonemapper) already shows signs of the harsh sharpening, indicating it's happening early in the post-process chain, likely within the tonemapper itself.",
                    next: 'step-inv-3'
                },
                {
                    text: "Disable all PostProcessVolumes temporarily]",
                    type: 'misguided',
                    feedback: "You try disabling all PostProcessVolumes in the scene. While this might remove *some* effects, if the sharpening is driven by a global console variable or Project Settings, it will persist, making this a less precise diagnostic.",
                    next: 'step-inv-2M'
                },
            ]
        },

        'step-inv-2M': {
            skill: 'rendering',
            title: 'Dead End: Incomplete Post-Process Disabling',
            prompt: "Disabling PostProcessVolumes didn't fully resolve the issue. The sharpening persists. What does this tell you?",
            choices: [
                {
                    text: "Realize it's a global setting or console variable]",
                    type: 'correct',
                    feedback: "You realize that the sharpening must be coming from a global setting, likely a console variable, rather than a specific PostProcessVolume. You need a more direct way to query these settings.",
                    next: 'step-inv-3'
                },
            ]
        },

        'step-inv-3': {
            skill: 'rendering',
            title: 'Querying Console Variables',
            prompt: "Buffer visualization points to an early post-process sharpening effect. You need to find the specific console variable responsible. What's the most direct way to query relevant console variables related to tonemapping or sharpening?",
            choices: [
                {
                    text: "Use `DumpConsoleVariables` or `r.Tonemapper.Sharpen ?` in the console]",
                    type: 'correct',
                    feedback: "You open the console and type `r.Tonemapper.Sharpen ?`. The console output confirms that `r.Tonemapper.Sharpen` is indeed set to a value significantly higher than its default (e.g., 2.0 or 3.0), which is the direct cause of the over-sharpening.",
                    next: 'step-inv-1'
                },
                {
                    text: "Search through all material functions for sharpening nodes]",
                    type: 'wrong',
                    feedback: "You spend time searching through material functions. While some materials might have custom sharpening, a global, grainy sharpening effect across the *entire scene* is almost certainly a post-process effect, not individual materials.",
                    next: 'step-inv-3W'
                },
            ]
        },

        'step-inv-3W': {
            skill: 'rendering',
            title: 'Dead End: Material Hunt',
            prompt: "Searching materials for sharpening nodes was a time sink. The problem is clearly global. What should you have done instead?",
            choices: [
                {
                    text: "Focus on global post-process console variables]",
                    type: 'correct',
                    feedback: "You realize that a global visual issue like this is best diagnosed by checking global rendering settings and console variables, especially those related to post-processing and tonemapping.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'rendering',
            title: 'Standalone Game Verification',
            prompt: "You've confirmed the fix in PIE. However, PIE can sometimes behave differently from a shipping build. What's the next crucial step to ensure the change is correctly applied and stable in a more production-representative environment?",
            choices: [
                {
                    text: "Launch the game in Standalone mode or a packaged build]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone mode (or a small packaged build if feasible). The visual quality remains consistent with your PIE findings: the grainy sharpening is gone, and the image is clean. This confirms the fix persists outside the editor environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Ask another developer to visually inspect in their editor]",
                    type: 'misguided',
                    feedback: "While a second pair of eyes is always good, relying solely on another editor instance doesn't fully validate the fix in a standalone or packaged game context, where config files and startup commands might be interpreted differently.",
                    next: 'step-ver-1M'
                },
            ]
        },

        'step-ver-1M': {
            skill: 'rendering',
            title: 'Dead End: Incomplete Verification',
            prompt: "Getting another developer to check in their editor is helpful, but it doesn't fully confirm the fix for a deployed game. What's the missing piece of the verification process?",
            choices: [
                {
                    text: "Test in a standalone or packaged build]",
                    type: 'correct',
                    feedback: "You realize that the ultimate test for a rendering fix is in a standalone or packaged build, which most closely mimics the end-user experience and ensures all configuration changes are correctly applied.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'rendering',
            title: 'Performance and Stability Check',
            prompt: "The visual fix is confirmed in Standalone mode. What final checks should you perform to ensure the change hasn't introduced any unexpected performance regressions or new visual artifacts in other parts of the game?",
            choices: [
                {
                    text: "Monitor `stat unit` and `stat gpu`, and visually inspect various scenes]",
                    type: 'correct',
                    feedback: "You use `stat unit` and `stat gpu` to ensure the frame rate and GPU timings are stable and haven't regressed. You also navigate through different levels and lighting scenarios to confirm no new visual glitches or artifacts have appeared, ensuring the fix is robust and localized.",
                    next: 'step-ver-1'
                },
                {
                    text: "Revert the change and re-apply it to confirm reproducibility]",
                    type: 'misguided',
                    feedback: "While confirming reproducibility is good practice for complex bugs, for a straightforward CVAR change, the primary concern after fixing is ensuring no negative side effects. Reverting and re-applying is less critical than checking performance and broader scene stability.",
                    next: 'step-ver-2M'
                },
            ]
        },

        'step-ver-2M': {
            skill: 'rendering',
            title: 'Dead End: Over-Verification',
            prompt: "Reverting and re-applying the fix is useful for some bugs, but for a simple CVAR change, it's not the most critical final verification step. What should you prioritize instead?",
            choices: [
                {
                    text: "Focus on performance and broader scene stability]",
                    type: 'correct',
                    feedback: "You realize that after a fix, the priority is to ensure the game's overall health: performance, stability, and the absence of new visual bugs across the entire project.",
                    next: 'step-ver-1'
                },
            ]
        },
                }
            ]
        },
        
        'step-inv-1': {
            skill: 'rendering',
            title: 'Initial Post-Process Scan',
            prompt: "The grainy, over-sharpened look points to a post-processing issue. Before digging into specific console variables, where do you first check for global or volume-specific settings that might be causing this?",
            choices: [
                {
                    text: "Inspect PostProcessVolume settings and Project Settings -> Rendering]",
                    type: 'correct',
                    feedback: "You open a PostProcessVolume and check its 'Sharpen' or 'Unreal Engine 4 Compatibility' settings, as well as 'Project Settings > Rendering > Post Processing' for any global overrides. While you don't find an obvious 'Sharpen' slider cranked up, you confirm post-processing is active and the issue is not from a simple volume setting.",
                    next: 'step-inv-2'
                },
                {
                    text: "Adjust Anti-Aliasing Method and Quality]",
                    type: 'wrong',
                    feedback: "You try switching between TAA, MSAA, or FXAA, and tweaking their quality settings. While this might affect edge smoothness, it doesn't resolve the underlying *grainy sharpening* effect, which is distinct from typical AA artifacts.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'rendering',
            title: 'Dead End: Anti-Aliasing Misdirection',
            prompt: "Changing Anti-Aliasing settings didn't fix the problem. The image still looks overly sharp and noisy. Why was this a dead end?",
            choices: [
                {
                    text: "Realize AA is for edge smoothing, not post-tonemap sharpening]",
                    type: 'correct',
                    feedback: "You realize that Anti-Aliasing primarily deals with jagged edges *before* the final tonemapping and post-process sharpening pass. The issue is a global sharpening effect applied *after* AA has done its job.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'rendering',
            title: 'Visualizing the Post-Process Chain',
            prompt: "You suspect a post-process effect. How can you visually confirm that the base image (before post-processing) is clean, and the sharpening is indeed applied later in the pipeline?",
            choices: [
                {
                    text: "Use Buffer Visualization Modes (e.g., Scene Color, PostProcessInput0)]",
                    type: 'correct',
                    feedback: "You switch to 'Buffer Visualization > Scene Color' and 'PostProcessInput0'. You observe that 'Scene Color' looks clean and unsharpened, but 'PostProcessInput0' (the input to the tonemapper) already shows signs of the harsh sharpening, indicating it's happening early in the post-process chain, likely within the tonemapper itself.",
                    next: 'step-inv-3'
                },
                {
                    text: "Disable all PostProcessVolumes temporarily]",
                    type: 'misguided',
                    feedback: "You try disabling all PostProcessVolumes in the scene. While this might remove *some* effects, if the sharpening is driven by a global console variable or Project Settings, it will persist, making this a less precise diagnostic.",
                    next: 'step-inv-2M'
                },
            ]
        },

        'step-inv-2M': {
            skill: 'rendering',
            title: 'Dead End: Incomplete Post-Process Disabling',
            prompt: "Disabling PostProcessVolumes didn't fully resolve the issue. The sharpening persists. What does this tell you?",
            choices: [
                {
                    text: "Realize it's a global setting or console variable]",
                    type: 'correct',
                    feedback: "You realize that the sharpening must be coming from a global setting, likely a console variable, rather than a specific PostProcessVolume. You need a more direct way to query these settings.",
                    next: 'step-inv-3'
                },
            ]
        },

        'step-inv-3': {
            skill: 'rendering',
            title: 'Querying Console Variables',
            prompt: "Buffer visualization points to an early post-process sharpening effect. You need to find the specific console variable responsible. What's the most direct way to query relevant console variables related to tonemapping or sharpening?",
            choices: [
                {
                    text: "Use `DumpConsoleVariables` or `r.Tonemapper.Sharpen ?` in the console]",
                    type: 'correct',
                    feedback: "You open the console and type `r.Tonemapper.Sharpen ?`. The console output confirms that `r.Tonemapper.Sharpen` is indeed set to a value significantly higher than its default (e.g., 2.0 or 3.0), which is the direct cause of the over-sharpening.",
                    next: 'step-inv-1'
                },
                {
                    text: "Search through all material functions for sharpening nodes]",
                    type: 'wrong',
                    feedback: "You spend time searching through material functions. While some materials might have custom sharpening, a global, grainy sharpening effect across the *entire scene* is almost certainly a post-process effect, not individual materials.",
                    next: 'step-inv-3W'
                },
            ]
        },

        'step-inv-3W': {
            skill: 'rendering',
            title: 'Dead End: Material Hunt',
            prompt: "Searching materials for sharpening nodes was a time sink. The problem is clearly global. What should you have done instead?",
            choices: [
                {
                    text: "Focus on global post-process console variables]",
                    type: 'correct',
                    feedback: "You realize that a global visual issue like this is best diagnosed by checking global rendering settings and console variables, especially those related to post-processing and tonemapping.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'rendering',
            title: 'Standalone Game Verification',
            prompt: "You've confirmed the fix in PIE. However, PIE can sometimes behave differently from a shipping build. What's the next crucial step to ensure the change is correctly applied and stable in a more production-representative environment?",
            choices: [
                {
                    text: "Launch the game in Standalone mode or a packaged build]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone mode (or a small packaged build if feasible). The visual quality remains consistent with your PIE findings: the grainy sharpening is gone, and the image is clean. This confirms the fix persists outside the editor environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Ask another developer to visually inspect in their editor]",
                    type: 'misguided',
                    feedback: "While a second pair of eyes is always good, relying solely on another editor instance doesn't fully validate the fix in a standalone or packaged game context, where config files and startup commands might be interpreted differently.",
                    next: 'step-ver-1M'
                },
            ]
        },

        'step-ver-1M': {
            skill: 'rendering',
            title: 'Dead End: Incomplete Verification',
            prompt: "Getting another developer to check in their editor is helpful, but it doesn't fully confirm the fix for a deployed game. What's the missing piece of the verification process?",
            choices: [
                {
                    text: "Test in a standalone or packaged build]",
                    type: 'correct',
                    feedback: "You realize that the ultimate test for a rendering fix is in a standalone or packaged build, which most closely mimics the end-user experience and ensures all configuration changes are correctly applied.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'rendering',
            title: 'Performance and Stability Check',
            prompt: "The visual fix is confirmed in Standalone mode. What final checks should you perform to ensure the change hasn't introduced any unexpected performance regressions or new visual artifacts in other parts of the game?",
            choices: [
                {
                    text: "Monitor `stat unit` and `stat gpu`, and visually inspect various scenes]",
                    type: 'correct',
                    feedback: "You use `stat unit` and `stat gpu` to ensure the frame rate and GPU timings are stable and haven't regressed. You also navigate through different levels and lighting scenarios to confirm no new visual glitches or artifacts have appeared, ensuring the fix is robust and localized.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'rendering',
            title: 'Initial Post-Process Scan',
            prompt: "The grainy, over-sharpened look points to a post-processing issue. Before digging into specific console variables, where do you first check for global or volume-specific settings that might be causing this?",
            choices: [
                {
                    text: "Inspect PostProcessVolume settings and Project Settings -> Rendering]",
                    type: 'correct',
                    feedback: "You open a PostProcessVolume and check its 'Sharpen' or 'Unreal Engine 4 Compatibility' settings, as well as 'Project Settings > Rendering > Post Processing' for any global overrides. While you don't find an obvious 'Sharpen' slider cranked up, you confirm post-processing is active and the issue is not from a simple volume setting.",
                    next: 'step-inv-2'
                },
                {
                    text: "Adjust Anti-Aliasing Method and Quality]",
                    type: 'wrong',
                    feedback: "You try switching between TAA, MSAA, or FXAA, and tweaking their quality settings. While this might affect edge smoothness, it doesn't resolve the underlying *grainy sharpening* effect, which is distinct from typical AA artifacts.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'rendering',
            title: 'Dead End: Anti-Aliasing Misdirection',
            prompt: "Changing Anti-Aliasing settings didn't fix the problem. The image still looks overly sharp and noisy. Why was this a dead end?",
            choices: [
                {
                    text: "Realize AA is for edge smoothing, not post-tonemap sharpening]",
                    type: 'correct',
                    feedback: "You realize that Anti-Aliasing primarily deals with jagged edges *before* the final tonemapping and post-process sharpening pass. The issue is a global sharpening effect applied *after* AA has done its job.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'rendering',
            title: 'Visualizing the Post-Process Chain',
            prompt: "You suspect a post-process effect. How can you visually confirm that the base image (before post-processing) is clean, and the sharpening is indeed applied later in the pipeline?",
            choices: [
                {
                    text: "Use Buffer Visualization Modes (e.g., Scene Color, PostProcessInput0)]",
                    type: 'correct',
                    feedback: "You switch to 'Buffer Visualization > Scene Color' and 'PostProcessInput0'. You observe that 'Scene Color' looks clean and unsharpened, but 'PostProcessInput0' (the input to the tonemapper) already shows signs of the harsh sharpening, indicating it's happening early in the post-process chain, likely within the tonemapper itself.",
                    next: 'step-inv-3'
                },
                {
                    text: "Disable all PostProcessVolumes temporarily]",
                    type: 'misguided',
                    feedback: "You try disabling all PostProcessVolumes in the scene. While this might remove *some* effects, if the sharpening is driven by a global console variable or Project Settings, it will persist, making this a less precise diagnostic.",
                    next: 'step-inv-2M'
                },
            ]
        },

        'step-inv-2M': {
            skill: 'rendering',
            title: 'Dead End: Incomplete Post-Process Disabling',
            prompt: "Disabling PostProcessVolumes didn't fully resolve the issue. The sharpening persists. What does this tell you?",
            choices: [
                {
                    text: "Realize it's a global setting or console variable]",
                    type: 'correct',
                    feedback: "You realize that the sharpening must be coming from a global setting, likely a console variable, rather than a specific PostProcessVolume. You need a more direct way to query these settings.",
                    next: 'step-inv-3'
                },
            ]
        },

        'step-inv-3': {
            skill: 'rendering',
            title: 'Querying Console Variables',
            prompt: "Buffer visualization points to an early post-process sharpening effect. You need to find the specific console variable responsible. What's the most direct way to query relevant console variables related to tonemapping or sharpening?",
            choices: [
                {
                    text: "Use `DumpConsoleVariables` or `r.Tonemapper.Sharpen ?` in the console]",
                    type: 'correct',
                    feedback: "You open the console and type `r.Tonemapper.Sharpen ?`. The console output confirms that `r.Tonemapper.Sharpen` is indeed set to a value significantly higher than its default (e.g., 2.0 or 3.0), which is the direct cause of the over-sharpening.",
                    next: 'step-inv-1'
                },
                {
                    text: "Search through all material functions for sharpening nodes]",
                    type: 'wrong',
                    feedback: "You spend time searching through material functions. While some materials might have custom sharpening, a global, grainy sharpening effect across the *entire scene* is almost certainly a post-process effect, not individual materials.",
                    next: 'step-inv-3W'
                },
            ]
        },

        'step-inv-3W': {
            skill: 'rendering',
            title: 'Dead End: Material Hunt',
            prompt: "Searching materials for sharpening nodes was a time sink. The problem is clearly global. What should you have done instead?",
            choices: [
                {
                    text: "Focus on global post-process console variables]",
                    type: 'correct',
                    feedback: "You realize that a global visual issue like this is best diagnosed by checking global rendering settings and console variables, especially those related to post-processing and tonemapping.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'rendering',
            title: 'Standalone Game Verification',
            prompt: "You've confirmed the fix in PIE. However, PIE can sometimes behave differently from a shipping build. What's the next crucial step to ensure the change is correctly applied and stable in a more production-representative environment?",
            choices: [
                {
                    text: "Launch the game in Standalone mode or a packaged build]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone mode (or a small packaged build if feasible). The visual quality remains consistent with your PIE findings: the grainy sharpening is gone, and the image is clean. This confirms the fix persists outside the editor environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Ask another developer to visually inspect in their editor]",
                    type: 'misguided',
                    feedback: "While a second pair of eyes is always good, relying solely on another editor instance doesn't fully validate the fix in a standalone or packaged game context, where config files and startup commands might be interpreted differently.",
                    next: 'step-ver-1M'
                },
            ]
        },

        'step-ver-1M': {
            skill: 'rendering',
            title: 'Dead End: Incomplete Verification',
            prompt: "Getting another developer to check in their editor is helpful, but it doesn't fully confirm the fix for a deployed game. What's the missing piece of the verification process?",
            choices: [
                {
                    text: "Test in a standalone or packaged build]",
                    type: 'correct',
                    feedback: "You realize that the ultimate test for a rendering fix is in a standalone or packaged build, which most closely mimics the end-user experience and ensures all configuration changes are correctly applied.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'rendering',
            title: 'Performance and Stability Check',
            prompt: "The visual fix is confirmed in Standalone mode. What final checks should you perform to ensure the change hasn't introduced any unexpected performance regressions or new visual artifacts in other parts of the game?",
            choices: [
                {
                    text: "Monitor `stat unit` and `stat gpu`, and visually inspect various scenes]",
                    type: 'correct',
                    feedback: "You use `stat unit` and `stat gpu` to ensure the frame rate and GPU timings are stable and haven't regressed. You also navigate through different levels and lighting scenarios to confirm no new visual glitches or artifacts have appeared, ensuring the fix is robust and localized.",
                    next: 'step-ver-1'
                },
                {
                    text: "Revert the change and re-apply it to confirm reproducibility]",
                    type: 'misguided',
                    feedback: "While confirming reproducibility is good practice for complex bugs, for a straightforward CVAR change, the primary concern after fixing is ensuring no negative side effects. Reverting and re-applying is less critical than checking performance and broader scene stability.",
                    next: 'step-ver-2M'
                },
            ]
        },

        'step-ver-2M': {
            skill: 'rendering',
            title: 'Dead End: Over-Verification',
            prompt: "Reverting and re-applying the fix is useful for some bugs, but for a simple CVAR change, it's not the most critical final verification step. What should you prioritize instead?",
            choices: [
                {
                    text: "Focus on performance and broader scene stability]",
                    type: 'correct',
                    feedback: "You realize that after a fix, the priority is to ensure the game's overall health: performance, stability, and the absence of new visual bugs across the entire project.",
                    next: 'step-ver-1'
                },
            ]
        },
                },
                {
                    text: "Revert the change and re-apply it to confirm reproducibility]",
                    type: 'misguided',
                    feedback: "While confirming reproducibility is good practice for complex bugs, for a straightforward CVAR change, the primary concern after fixing is ensuring no negative side effects. Reverting and re-applying is less critical than checking performance and broader scene stability.",
                    next: 'step-ver-2M'
                },
            ]
        },

        'step-ver-2M': {
            skill: 'rendering',
            title: 'Dead End: Over-Verification',
            prompt: "Reverting and re-applying the fix is useful for some bugs, but for a simple CVAR change, it's not the most critical final verification step. What should you prioritize instead?",
            choices: [
                {
                    text: "Focus on performance and broader scene stability]",
                    type: 'correct',
                    feedback: "You realize that after a fix, the priority is to ensure the game's overall health: performance, stability, and the absence of new visual bugs across the entire project.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'rendering',
            title: 'Initial Post-Process Scan',
            prompt: "The grainy, over-sharpened look points to a post-processing issue. Before digging into specific console variables, where do you first check for global or volume-specific settings that might be causing this?",
            choices: [
                {
                    text: "Inspect PostProcessVolume settings and Project Settings -> Rendering]",
                    type: 'correct',
                    feedback: "You open a PostProcessVolume and check its 'Sharpen' or 'Unreal Engine 4 Compatibility' settings, as well as 'Project Settings > Rendering > Post Processing' for any global overrides. While you don't find an obvious 'Sharpen' slider cranked up, you confirm post-processing is active and the issue is not from a simple volume setting.",
                    next: 'step-inv-2'
                },
                {
                    text: "Adjust Anti-Aliasing Method and Quality]",
                    type: 'wrong',
                    feedback: "You try switching between TAA, MSAA, or FXAA, and tweaking their quality settings. While this might affect edge smoothness, it doesn't resolve the underlying *grainy sharpening* effect, which is distinct from typical AA artifacts.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'rendering',
            title: 'Dead End: Anti-Aliasing Misdirection',
            prompt: "Changing Anti-Aliasing settings didn't fix the problem. The image still looks overly sharp and noisy. Why was this a dead end?",
            choices: [
                {
                    text: "Realize AA is for edge smoothing, not post-tonemap sharpening]",
                    type: 'correct',
                    feedback: "You realize that Anti-Aliasing primarily deals with jagged edges *before* the final tonemapping and post-process sharpening pass. The issue is a global sharpening effect applied *after* AA has done its job.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'rendering',
            title: 'Visualizing the Post-Process Chain',
            prompt: "You suspect a post-process effect. How can you visually confirm that the base image (before post-processing) is clean, and the sharpening is indeed applied later in the pipeline?",
            choices: [
                {
                    text: "Use Buffer Visualization Modes (e.g., Scene Color, PostProcessInput0)]",
                    type: 'correct',
                    feedback: "You switch to 'Buffer Visualization > Scene Color' and 'PostProcessInput0'. You observe that 'Scene Color' looks clean and unsharpened, but 'PostProcessInput0' (the input to the tonemapper) already shows signs of the harsh sharpening, indicating it's happening early in the post-process chain, likely within the tonemapper itself.",
                    next: 'step-inv-3'
                },
                {
                    text: "Disable all PostProcessVolumes temporarily]",
                    type: 'misguided',
                    feedback: "You try disabling all PostProcessVolumes in the scene. While this might remove *some* effects, if the sharpening is driven by a global console variable or Project Settings, it will persist, making this a less precise diagnostic.",
                    next: 'step-inv-2M'
                },
            ]
        },

        'step-inv-2M': {
            skill: 'rendering',
            title: 'Dead End: Incomplete Post-Process Disabling',
            prompt: "Disabling PostProcessVolumes didn't fully resolve the issue. The sharpening persists. What does this tell you?",
            choices: [
                {
                    text: "Realize it's a global setting or console variable]",
                    type: 'correct',
                    feedback: "You realize that the sharpening must be coming from a global setting, likely a console variable, rather than a specific PostProcessVolume. You need a more direct way to query these settings.",
                    next: 'step-inv-3'
                },
            ]
        },

        'step-inv-3': {
            skill: 'rendering',
            title: 'Querying Console Variables',
            prompt: "Buffer visualization points to an early post-process sharpening effect. You need to find the specific console variable responsible. What's the most direct way to query relevant console variables related to tonemapping or sharpening?",
            choices: [
                {
                    text: "Use `DumpConsoleVariables` or `r.Tonemapper.Sharpen ?` in the console]",
                    type: 'correct',
                    feedback: "You open the console and type `r.Tonemapper.Sharpen ?`. The console output confirms that `r.Tonemapper.Sharpen` is indeed set to a value significantly higher than its default (e.g., 2.0 or 3.0), which is the direct cause of the over-sharpening.",
                    next: 'step-inv-1'
                },
                {
                    text: "Search through all material functions for sharpening nodes]",
                    type: 'wrong',
                    feedback: "You spend time searching through material functions. While some materials might have custom sharpening, a global, grainy sharpening effect across the *entire scene* is almost certainly a post-process effect, not individual materials.",
                    next: 'step-inv-3W'
                },
            ]
        },

        'step-inv-3W': {
            skill: 'rendering',
            title: 'Dead End: Material Hunt',
            prompt: "Searching materials for sharpening nodes was a time sink. The problem is clearly global. What should you have done instead?",
            choices: [
                {
                    text: "Focus on global post-process console variables]",
                    type: 'correct',
                    feedback: "You realize that a global visual issue like this is best diagnosed by checking global rendering settings and console variables, especially those related to post-processing and tonemapping.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'rendering',
            title: 'Standalone Game Verification',
            prompt: "You've confirmed the fix in PIE. However, PIE can sometimes behave differently from a shipping build. What's the next crucial step to ensure the change is correctly applied and stable in a more production-representative environment?",
            choices: [
                {
                    text: "Launch the game in Standalone mode or a packaged build]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone mode (or a small packaged build if feasible). The visual quality remains consistent with your PIE findings: the grainy sharpening is gone, and the image is clean. This confirms the fix persists outside the editor environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Ask another developer to visually inspect in their editor]",
                    type: 'misguided',
                    feedback: "While a second pair of eyes is always good, relying solely on another editor instance doesn't fully validate the fix in a standalone or packaged game context, where config files and startup commands might be interpreted differently.",
                    next: 'step-ver-1M'
                },
            ]
        },

        'step-ver-1M': {
            skill: 'rendering',
            title: 'Dead End: Incomplete Verification',
            prompt: "Getting another developer to check in their editor is helpful, but it doesn't fully confirm the fix for a deployed game. What's the missing piece of the verification process?",
            choices: [
                {
                    text: "Test in a standalone or packaged build]",
                    type: 'correct',
                    feedback: "You realize that the ultimate test for a rendering fix is in a standalone or packaged build, which most closely mimics the end-user experience and ensures all configuration changes are correctly applied.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'rendering',
            title: 'Performance and Stability Check',
            prompt: "The visual fix is confirmed in Standalone mode. What final checks should you perform to ensure the change hasn't introduced any unexpected performance regressions or new visual artifacts in other parts of the game?",
            choices: [
                {
                    text: "Monitor `stat unit` and `stat gpu`, and visually inspect various scenes]",
                    type: 'correct',
                    feedback: "You use `stat unit` and `stat gpu` to ensure the frame rate and GPU timings are stable and haven't regressed. You also navigate through different levels and lighting scenarios to confirm no new visual glitches or artifacts have appeared, ensuring the fix is robust and localized.",
                    next: 'step-ver-1'
                },
                {
                    text: "Revert the change and re-apply it to confirm reproducibility]",
                    type: 'misguided',
                    feedback: "While confirming reproducibility is good practice for complex bugs, for a straightforward CVAR change, the primary concern after fixing is ensuring no negative side effects. Reverting and re-applying is less critical than checking performance and broader scene stability.",
                    next: 'step-ver-2M'
                },
            ]
        },

        'step-ver-2M': {
            skill: 'rendering',
            title: 'Dead End: Over-Verification',
            prompt: "Reverting and re-applying the fix is useful for some bugs, but for a simple CVAR change, it's not the most critical final verification step. What should you prioritize instead?",
            choices: [
                {
                    text: "Focus on performance and broader scene stability]",
                    type: 'correct',
                    feedback: "You realize that after a fix, the priority is to ensure the game's overall health: performance, stability, and the absence of new visual bugs across the entire project.",
                    next: 'step-ver-1'
                },
            ]
        },
                },
            ]
        },

        
        'step-inv-1': {
            skill: 'rendering',
            title: 'Initial Post-Process Scan',
            prompt: "The grainy, over-sharpened look points to a post-processing issue. Before digging into specific console variables, where do you first check for global or volume-specific settings that might be causing this?",
            choices: [
                {
                    text: "Inspect PostProcessVolume settings and Project Settings -> Rendering]",
                    type: 'correct',
                    feedback: "You open a PostProcessVolume and check its 'Sharpen' or 'Unreal Engine 4 Compatibility' settings, as well as 'Project Settings > Rendering > Post Processing' for any global overrides. While you don't find an obvious 'Sharpen' slider cranked up, you confirm post-processing is active and the issue is not from a simple volume setting.",
                    next: 'step-inv-2'
                },
                {
                    text: "Adjust Anti-Aliasing Method and Quality]",
                    type: 'wrong',
                    feedback: "You try switching between TAA, MSAA, or FXAA, and tweaking their quality settings. While this might affect edge smoothness, it doesn't resolve the underlying *grainy sharpening* effect, which is distinct from typical AA artifacts.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'rendering',
            title: 'Dead End: Anti-Aliasing Misdirection',
            prompt: "Changing Anti-Aliasing settings didn't fix the problem. The image still looks overly sharp and noisy. Why was this a dead end?",
            choices: [
                {
                    text: "Realize AA is for edge smoothing, not post-tonemap sharpening]",
                    type: 'correct',
                    feedback: "You realize that Anti-Aliasing primarily deals with jagged edges *before* the final tonemapping and post-process sharpening pass. The issue is a global sharpening effect applied *after* AA has done its job.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'rendering',
            title: 'Visualizing the Post-Process Chain',
            prompt: "You suspect a post-process effect. How can you visually confirm that the base image (before post-processing) is clean, and the sharpening is indeed applied later in the pipeline?",
            choices: [
                {
                    text: "Use Buffer Visualization Modes (e.g., Scene Color, PostProcessInput0)]",
                    type: 'correct',
                    feedback: "You switch to 'Buffer Visualization > Scene Color' and 'PostProcessInput0'. You observe that 'Scene Color' looks clean and unsharpened, but 'PostProcessInput0' (the input to the tonemapper) already shows signs of the harsh sharpening, indicating it's happening early in the post-process chain, likely within the tonemapper itself.",
                    next: 'step-inv-3'
                },
                {
                    text: "Disable all PostProcessVolumes temporarily]",
                    type: 'misguided',
                    feedback: "You try disabling all PostProcessVolumes in the scene. While this might remove *some* effects, if the sharpening is driven by a global console variable or Project Settings, it will persist, making this a less precise diagnostic.",
                    next: 'step-inv-2M'
                },
            ]
        },

        'step-inv-2M': {
            skill: 'rendering',
            title: 'Dead End: Incomplete Post-Process Disabling',
            prompt: "Disabling PostProcessVolumes didn't fully resolve the issue. The sharpening persists. What does this tell you?",
            choices: [
                {
                    text: "Realize it's a global setting or console variable]",
                    type: 'correct',
                    feedback: "You realize that the sharpening must be coming from a global setting, likely a console variable, rather than a specific PostProcessVolume. You need a more direct way to query these settings.",
                    next: 'step-inv-3'
                },
            ]
        },

        'step-inv-3': {
            skill: 'rendering',
            title: 'Querying Console Variables',
            prompt: "Buffer visualization points to an early post-process sharpening effect. You need to find the specific console variable responsible. What's the most direct way to query relevant console variables related to tonemapping or sharpening?",
            choices: [
                {
                    text: "Use `DumpConsoleVariables` or `r.Tonemapper.Sharpen ?` in the console]",
                    type: 'correct',
                    feedback: "You open the console and type `r.Tonemapper.Sharpen ?`. The console output confirms that `r.Tonemapper.Sharpen` is indeed set to a value significantly higher than its default (e.g., 2.0 or 3.0), which is the direct cause of the over-sharpening.",
                    next: 'step-inv-1'
                },
                {
                    text: "Search through all material functions for sharpening nodes]",
                    type: 'wrong',
                    feedback: "You spend time searching through material functions. While some materials might have custom sharpening, a global, grainy sharpening effect across the *entire scene* is almost certainly a post-process effect, not individual materials.",
                    next: 'step-inv-3W'
                },
            ]
        },

        'step-inv-3W': {
            skill: 'rendering',
            title: 'Dead End: Material Hunt',
            prompt: "Searching materials for sharpening nodes was a time sink. The problem is clearly global. What should you have done instead?",
            choices: [
                {
                    text: "Focus on global post-process console variables]",
                    type: 'correct',
                    feedback: "You realize that a global visual issue like this is best diagnosed by checking global rendering settings and console variables, especially those related to post-processing and tonemapping.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'rendering',
            title: 'Standalone Game Verification',
            prompt: "You've confirmed the fix in PIE. However, PIE can sometimes behave differently from a shipping build. What's the next crucial step to ensure the change is correctly applied and stable in a more production-representative environment?",
            choices: [
                {
                    text: "Launch the game in Standalone mode or a packaged build]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone mode (or a small packaged build if feasible). The visual quality remains consistent with your PIE findings: the grainy sharpening is gone, and the image is clean. This confirms the fix persists outside the editor environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Ask another developer to visually inspect in their editor]",
                    type: 'misguided',
                    feedback: "While a second pair of eyes is always good, relying solely on another editor instance doesn't fully validate the fix in a standalone or packaged game context, where config files and startup commands might be interpreted differently.",
                    next: 'step-ver-1M'
                },
            ]
        },

        'step-ver-1M': {
            skill: 'rendering',
            title: 'Dead End: Incomplete Verification',
            prompt: "Getting another developer to check in their editor is helpful, but it doesn't fully confirm the fix for a deployed game. What's the missing piece of the verification process?",
            choices: [
                {
                    text: "Test in a standalone or packaged build]",
                    type: 'correct',
                    feedback: "You realize that the ultimate test for a rendering fix is in a standalone or packaged build, which most closely mimics the end-user experience and ensures all configuration changes are correctly applied.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'rendering',
            title: 'Performance and Stability Check',
            prompt: "The visual fix is confirmed in Standalone mode. What final checks should you perform to ensure the change hasn't introduced any unexpected performance regressions or new visual artifacts in other parts of the game?",
            choices: [
                {
                    text: "Monitor `stat unit` and `stat gpu`, and visually inspect various scenes]",
                    type: 'correct',
                    feedback: "You use `stat unit` and `stat gpu` to ensure the frame rate and GPU timings are stable and haven't regressed. You also navigate through different levels and lighting scenarios to confirm no new visual glitches or artifacts have appeared, ensuring the fix is robust and localized.",
                    next: 'step-ver-1'
                },
                {
                    text: "Revert the change and re-apply it to confirm reproducibility]",
                    type: 'misguided',
                    feedback: "While confirming reproducibility is good practice for complex bugs, for a straightforward CVAR change, the primary concern after fixing is ensuring no negative side effects. Reverting and re-applying is less critical than checking performance and broader scene stability.",
                    next: 'step-ver-2M'
                },
            ]
        },

        'step-ver-2M': {
            skill: 'rendering',
            title: 'Dead End: Over-Verification',
            prompt: "Reverting and re-applying the fix is useful for some bugs, but for a simple CVAR change, it's not the most critical final verification step. What should you prioritize instead?",
            choices: [
                {
                    text: "Focus on performance and broader scene stability]",
                    type: 'correct',
                    feedback: "You realize that after a fix, the priority is to ensure the game's overall health: performance, stability, and the absence of new visual bugs across the entire project.",
                    next: 'step-ver-1'
                },
            ]
        },

        'conclusion': {
            skill: 'rendering',
            title: 'Conclusion',
            prompt: "Lesson: If your scene looks grainy and over-sharpened, check r.Tonemapper.Sharpen. Keeping this value in the 0-1 range (or disabling it) prevents harsh post-process sharpening and preserves a clean, stable final image.",
            choices: []
        }
    }
};