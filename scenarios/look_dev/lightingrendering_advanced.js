window.SCENARIOS['LumenLightLeaking'] = {
    meta: {
        expanded: true,
        title: "Lumen Light Leaking in Dark Room",
        description: "Light leaks through corners of a dark room using Lumen. Investigates geometry thickness and Lumen tracing limitations.",
        estimateHours: 3.5,
        category: "Lighting"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'lighting',
            title: 'The Symptom',
            prompt: "You have a dark interior room lit only by a small amount of bounce light, but bright outdoor light is clearly leaking through the walls and corners when using Lumen. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You switch to Lumen visualization and lighting view modes and notice that the indirect lighting rays seem to pass straight through the walls instead of being blocked. This suggests a problem with the way the room geometry is constructed.",
                    next: 'step-inv-1'
                },
                {
                    text: "Wrong Guess]",
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
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the unnecessary post-process changes and focus back on how the room geometry is built for Lumen.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-2': {
            skill: 'lighting',
            title: 'Investigation',
            prompt: "You inspect the level more closely to understand why Lumen is letting light through what should be solid walls. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the room is built from single-sided planes with no thickness at all. The walls, ceiling, and floor are paper-thin, so Lumen's tracing has trouble treating them as solid blockers, causing light to bleed through the edges and corners.",
                    next: 'step-3'
                },
                {
                    text: "Misguided Attempt]",
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
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize that no amount of Lumen quality tuning will fix fundamentally bad room geometry. You need to give Lumen proper thick walls to block light.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'lighting',
            title: 'The Fix',
            prompt: "You now know the issue is single-sided, paper-thin walls that Lumen can't reliably treat as solid occluders. How do you fix it?",
            choices: [
                {
                    text: "Use thick geometry (walls with depth) instead of planes.]",
                    type: 'correct',
                    feedback: "You replace the paper-thin planes with proper meshes that have thickness--boxes or walls with real depth--so the room becomes an enclosed volume. With solid geometry, Lumen's traces are correctly blocked and the light leaking is dramatically reduced or eliminated.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'lighting',
            title: 'Verification',
            prompt: "After rebuilding the room with thick walls, you test the scene again in PIE and fly around the interior. What do you observe?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, the dark room now holds its darkness properly: outdoor light no longer bleeds through the corners, and Lumen's indirect lighting behaves as expected with the thicker wall geometry.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'lighting',
            title: 'Deep Dive: Lumen Scene View',
            prompt: "You've confirmed light leaking in Lumen visualization. To understand how Lumen 'sees' your geometry and identify potential issues with wall thickness, which specific Lumen view mode is most helpful?",
            choices: [
                {
                    text: "Switch to 'Lumen Scene' view mode]",
                    type: 'correct',
                    feedback: "In 'Lumen Scene' view mode, you clearly see that Lumen's representation of your walls is extremely thin or even missing in places, especially at corners. This confirms that Lumen doesn't have solid, thick geometry to trace against, leading to the leaks.",
                    next: 'step-inv-2'
                },
                {
                    text: "Switch to 'Lumen Global Illumination' view mode]",
                    type: 'wrong',
                    feedback: "While 'Lumen Global Illumination' shows the final GI, it doesn't directly reveal how Lumen perceives the scene's geometry. You need a view mode that shows Lumen's internal representation of the environment.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'lighting',
            title: 'Dead End: Wrong Lumen View',
            prompt: "You used 'Lumen Global Illumination' view mode, but it didn't clearly show the geometry problem. You need to see how Lumen is actually tracing against the scene's physical structure.",
            choices: [
                {
                    text: "Revert and try 'Lumen Scene' view mode]",
                    type: 'correct',
                    feedback: "You switch to 'Lumen Scene' view mode and immediately see the problem: Lumen's representation of your walls is extremely thin or missing, especially at corners, confirming the geometry issue.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'lighting',
            title: 'Advanced Debug: Lumen Console Commands',
            prompt: "The 'Lumen Scene' view mode confirmed the geometry issue. To get even more granular detail on Lumen's tracing behavior and potential issues at the problematic corners, what console commands could you use to visualize the tracing process?",
            choices: [
                {
                    text: "Use `r.Lumen.Visualize 1` and `r.Lumen.ScreenProbeGather.Debug 1`]",
                    type: 'correct',
                    feedback: "Activating `r.Lumen.Visualize 1` allows you to cycle through various Lumen debug views, including 'Lumen Scene' and 'Lumen Traces'. With `r.Lumen.ScreenProbeGather.Debug 1`, you can visualize the screen probes and their tracing, often highlighting where rays are failing to hit solid surfaces or are passing through thin geometry, further confirming the lack of proper occlusion.",
                    next: 'step-red-herring'
                },
                {
                    text: "Use `stat gpu` and `stat unit`]",
                    type: 'wrong',
                    feedback: "While `stat gpu` and `stat unit` are crucial for performance monitoring, they don't directly help visualize Lumen's internal tracing or how it perceives geometry. You need Lumen-specific debug commands.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'lighting',
            title: 'Dead End: Wrong Debug Commands',
            prompt: "You used general performance stats, but they didn't help visualize Lumen's tracing. You need commands that specifically show how Lumen is interacting with your scene's geometry.",
            choices: [
                {
                    text: "Revert and use Lumen-specific debug commands]",
                    type: 'correct',
                    feedback: "You realize the need for Lumen-specific commands and use `r.Lumen.Visualize 1` and `r.Lumen.ScreenProbeGather.Debug 1` to get a clear picture of the tracing failures.",
                    next: 'step-red-herring'
                },
            ]
        },

        'step-red-herring': {
            skill: 'materials',
            title: 'Red Herring: Material Properties',
            prompt: "You've seen Lumen's tracing issues, but before concluding it's purely geometry, you wonder if the wall material itself could be contributing. What material properties might you check?",
            choices: [
                {
                    text: "Check if the wall material is 'Two Sided' or has unusual opacity/translucency settings.]",
                    type: 'wrong',
                    feedback: "You check the wall material. While 'Two Sided' can affect rendering, it doesn't inherently make Lumen treat a single-sided plane as thick geometry. The material is opaque, so opacity isn't the issue. You realize this isn't the root cause; Lumen traces against the mesh's physical form, not just material flags.",
                    next: 'step-red-herringW'
                },
                {
                    text: "Realize material properties are unlikely to solve a fundamental geometry tracing issue.]",
                    type: 'correct',
                    feedback: "You correctly deduce that while materials are important, they won't magically give thickness to a paper-thin wall for Lumen's tracing. The problem is structural, not material-based.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-red-herringW': {
            skill: 'materials',
            title: 'Dead End: Material Misdirection',
            prompt: "You spent time checking material properties, but the light leaking persists. You realize that Lumen traces against geometry, not just material flags. The problem is still likely with the physical structure of the walls.",
            choices: [
                {
                    text: "Re-focus on the geometry itself.]",
                    type: 'correct',
                    feedback: "You shift your attention back to the actual mesh construction, understanding that Lumen needs solid, thick geometry to trace against effectively.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'deployment',
            title: 'Verification: Standalone Game Test',
            prompt: "The PIE test looks good. However, PIE can sometimes behave differently than a packaged game. To ensure the fix holds up in a more realistic runtime environment, what's your next verification step?",
            choices: [
                {
                    text: "Launch the game in 'Standalone Game' mode.]",
                    type: 'correct',
                    feedback: "You launch the project in 'Standalone Game' mode. This provides a more accurate representation of how the game will perform and render when packaged, without the overhead of the editor. The light leaking remains fixed, confirming the solution is robust.",
                    next: 'step-ver-2'
                },
                {
                    text: "Immediately package the game for a full build.]",
                    type: 'wrong',
                    feedback: "Packaging a full build is time-consuming. It's better to verify in 'Standalone Game' mode first, which is quicker and still provides a more accurate test than PIE before committing to a full package.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'deployment',
            title: 'Dead End: Premature Packaging',
            prompt: "You jumped straight to packaging, which took a while. Now you have to wait for the build to finish just to test a single fix. There's a quicker, more efficient way to test a near-final build.",
            choices: [
                {
                    text: "Realize 'Standalone Game' mode is the better intermediate test.]",
                    type: 'correct',
                    feedback: "You realize that 'Standalone Game' mode would have been a much faster and equally effective way to verify the fix before committing to a full package.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'optimization',
            title: 'Verification: Performance Check',
            prompt: "The light leaking is fixed, and it holds up in Standalone Game mode. However, adding thicker geometry might have performance implications. What console commands would you use to check the performance impact of your changes, specifically related to Lumen and overall frame rate?",
            choices: [
                {
                    text: "Use `stat unit` and `stat gpu` to check overall performance, and `stat lumen` for Lumen-specific metrics.]",
                    type: 'correct',
                    feedback: "You use `stat unit` to monitor CPU and GPU frame times, `stat gpu` for detailed GPU breakdown, and `stat lumen` to see Lumen's specific cost. You confirm that while there might be a slight increase in geometry processing, the overall performance remains acceptable, and Lumen's tracing cost is within expected bounds for the improved visual quality.",
                    next: 'conclusion'
                },
                {
                    text: "Only check `stat fps`.]",
                    type: 'wrong',
                    feedback: "While `stat fps` gives you the frame rate, it doesn't provide the detailed breakdown needed to understand *why* performance might have changed or to pinpoint Lumen's specific contribution. You need more granular data.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'optimization',
            title: 'Dead End: Insufficient Performance Data',
            prompt: "You only checked `stat fps`, which showed a decent frame rate, but you don't have enough information to confirm if your changes had any negative performance impact or if Lumen is now costing more than it should. You need more detailed stats.",
            choices: [
                {
                    text: "Use `stat unit`, `stat gpu`, and `stat lumen` for a comprehensive performance check.]",
                    type: 'correct',
                    feedback: "You use the correct commands to get a full picture of CPU, GPU, and Lumen performance, confirming the fix didn't introduce unacceptable overhead.",
                    next: 'conclusion'
                },
            ]
        },
                }
            ]
        },
        
        'step-inv-1': {
            skill: 'lighting',
            title: 'Deep Dive: Lumen Scene View',
            prompt: "You've confirmed light leaking in Lumen visualization. To understand how Lumen 'sees' your geometry and identify potential issues with wall thickness, which specific Lumen view mode is most helpful?",
            choices: [
                {
                    text: "Switch to 'Lumen Scene' view mode]",
                    type: 'correct',
                    feedback: "In 'Lumen Scene' view mode, you clearly see that Lumen's representation of your walls is extremely thin or even missing in places, especially at corners. This confirms that Lumen doesn't have solid, thick geometry to trace against, leading to the leaks.",
                    next: 'step-inv-2'
                },
                {
                    text: "Switch to 'Lumen Global Illumination' view mode]",
                    type: 'wrong',
                    feedback: "While 'Lumen Global Illumination' shows the final GI, it doesn't directly reveal how Lumen perceives the scene's geometry. You need a view mode that shows Lumen's internal representation of the environment.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'lighting',
            title: 'Dead End: Wrong Lumen View',
            prompt: "You used 'Lumen Global Illumination' view mode, but it didn't clearly show the geometry problem. You need to see how Lumen is actually tracing against the scene's physical structure.",
            choices: [
                {
                    text: "Revert and try 'Lumen Scene' view mode]",
                    type: 'correct',
                    feedback: "You switch to 'Lumen Scene' view mode and immediately see the problem: Lumen's representation of your walls is extremely thin or missing, especially at corners, confirming the geometry issue.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'lighting',
            title: 'Advanced Debug: Lumen Console Commands',
            prompt: "The 'Lumen Scene' view mode confirmed the geometry issue. To get even more granular detail on Lumen's tracing behavior and potential issues at the problematic corners, what console commands could you use to visualize the tracing process?",
            choices: [
                {
                    text: "Use `r.Lumen.Visualize 1` and `r.Lumen.ScreenProbeGather.Debug 1`]",
                    type: 'correct',
                    feedback: "Activating `r.Lumen.Visualize 1` allows you to cycle through various Lumen debug views, including 'Lumen Scene' and 'Lumen Traces'. With `r.Lumen.ScreenProbeGather.Debug 1`, you can visualize the screen probes and their tracing, often highlighting where rays are failing to hit solid surfaces or are passing through thin geometry, further confirming the lack of proper occlusion.",
                    next: 'step-red-herring'
                },
                {
                    text: "Use `stat gpu` and `stat unit`]",
                    type: 'wrong',
                    feedback: "While `stat gpu` and `stat unit` are crucial for performance monitoring, they don't directly help visualize Lumen's internal tracing or how it perceives geometry. You need Lumen-specific debug commands.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'lighting',
            title: 'Dead End: Wrong Debug Commands',
            prompt: "You used general performance stats, but they didn't help visualize Lumen's tracing. You need commands that specifically show how Lumen is interacting with your scene's geometry.",
            choices: [
                {
                    text: "Revert and use Lumen-specific debug commands]",
                    type: 'correct',
                    feedback: "You realize the need for Lumen-specific commands and use `r.Lumen.Visualize 1` and `r.Lumen.ScreenProbeGather.Debug 1` to get a clear picture of the tracing failures.",
                    next: 'step-red-herring'
                },
            ]
        },

        'step-red-herring': {
            skill: 'materials',
            title: 'Red Herring: Material Properties',
            prompt: "You've seen Lumen's tracing issues, but before concluding it's purely geometry, you wonder if the wall material itself could be contributing. What material properties might you check?",
            choices: [
                {
                    text: "Check if the wall material is 'Two Sided' or has unusual opacity/translucency settings.]",
                    type: 'wrong',
                    feedback: "You check the wall material. While 'Two Sided' can affect rendering, it doesn't inherently make Lumen treat a single-sided plane as thick geometry. The material is opaque, so opacity isn't the issue. You realize this isn't the root cause; Lumen traces against the mesh's physical form, not just material flags.",
                    next: 'step-red-herringW'
                },
                {
                    text: "Realize material properties are unlikely to solve a fundamental geometry tracing issue.]",
                    type: 'correct',
                    feedback: "You correctly deduce that while materials are important, they won't magically give thickness to a paper-thin wall for Lumen's tracing. The problem is structural, not material-based.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-red-herringW': {
            skill: 'materials',
            title: 'Dead End: Material Misdirection',
            prompt: "You spent time checking material properties, but the light leaking persists. You realize that Lumen traces against geometry, not just material flags. The problem is still likely with the physical structure of the walls.",
            choices: [
                {
                    text: "Re-focus on the geometry itself.]",
                    type: 'correct',
                    feedback: "You shift your attention back to the actual mesh construction, understanding that Lumen needs solid, thick geometry to trace against effectively.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'deployment',
            title: 'Verification: Standalone Game Test',
            prompt: "The PIE test looks good. However, PIE can sometimes behave differently than a packaged game. To ensure the fix holds up in a more realistic runtime environment, what's your next verification step?",
            choices: [
                {
                    text: "Launch the game in 'Standalone Game' mode.]",
                    type: 'correct',
                    feedback: "You launch the project in 'Standalone Game' mode. This provides a more accurate representation of how the game will perform and render when packaged, without the overhead of the editor. The light leaking remains fixed, confirming the solution is robust.",
                    next: 'step-ver-2'
                },
                {
                    text: "Immediately package the game for a full build.]",
                    type: 'wrong',
                    feedback: "Packaging a full build is time-consuming. It's better to verify in 'Standalone Game' mode first, which is quicker and still provides a more accurate test than PIE before committing to a full package.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'deployment',
            title: 'Dead End: Premature Packaging',
            prompt: "You jumped straight to packaging, which took a while. Now you have to wait for the build to finish just to test a single fix. There's a quicker, more efficient way to test a near-final build.",
            choices: [
                {
                    text: "Realize 'Standalone Game' mode is the better intermediate test.]",
                    type: 'correct',
                    feedback: "You realize that 'Standalone Game' mode would have been a much faster and equally effective way to verify the fix before committing to a full package.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'optimization',
            title: 'Verification: Performance Check',
            prompt: "The light leaking is fixed, and it holds up in Standalone Game mode. However, adding thicker geometry might have performance implications. What console commands would you use to check the performance impact of your changes, specifically related to Lumen and overall frame rate?",
            choices: [
                {
                    text: "Use `stat unit` and `stat gpu` to check overall performance, and `stat lumen` for Lumen-specific metrics.]",
                    type: 'correct',
                    feedback: "You use `stat unit` to monitor CPU and GPU frame times, `stat gpu` for detailed GPU breakdown, and `stat lumen` to see Lumen's specific cost. You confirm that while there might be a slight increase in geometry processing, the overall performance remains acceptable, and Lumen's tracing cost is within expected bounds for the improved visual quality.",
                    next: 'conclusion'
                },
                {
                    text: "Only check `stat fps`.]",
                    type: 'wrong',
                    feedback: "While `stat fps` gives you the frame rate, it doesn't provide the detailed breakdown needed to understand *why* performance might have changed or to pinpoint Lumen's specific contribution. You need more granular data.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'optimization',
            title: 'Dead End: Insufficient Performance Data',
            prompt: "You only checked `stat fps`, which showed a decent frame rate, but you don't have enough information to confirm if your changes had any negative performance impact or if Lumen is now costing more than it should. You need more detailed stats.",
            choices: [
                {
                    text: "Use `stat unit`, `stat gpu`, and `stat lumen` for a comprehensive performance check.]",
                    type: 'correct',
                    feedback: "You use the correct commands to get a full picture of CPU, GPU, and Lumen performance, confirming the fix didn't introduce unacceptable overhead.",
                    next: 'conclusion'
                },
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