window.SCENARIOS['LightmapShadowBleeding'] = {
    meta: {
        expanded: true,
        title: "Lightmap Shadow Bleeding",
        description: "Static mesh has splotchy shadows despite high resolution. Investigates UV Channel overlaps and Lightmap Coordinate Index.",
        estimateHours: 1.5,
        category: "Lighting"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'lighting',
            title: 'The Symptom',
            prompt: "After building lighting, a static mesh shows ugly, splotchy / bleeding shadows even though its Lightmap Resolution is very high (e.g. 1024). What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You switch to Lightmap Density and Lighting Only view modes and notice that despite the high resolution, the baked shadows look smeared in specific areas of the mesh. This points to a UV/lightmap problem rather than just resolution.",
                    next: 'step-inv-1'
                },
                {
                    text: "Wrong Guess]",
                    type: 'wrong',
                    feedback: "You try cranking the Lightmap Resolution even higher and rebake, but the shadows are still blotchy. Clearly the issue isn't just not having enough lightmap texels.",
                    next: 'step-rh-1'
                }
            ]
        },
        'step-1W': {
            skill: 'lighting',
            title: 'Dead End: Wrong Guess',
            prompt: "You chased resolution and build settings, but the shadows are still blotchy and bleeding. Increasing Lightmap Resolution didn't actually solve the artifact.",
            choices: [
                {
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the unnecessary resolution changes and focus on the mesh's lightmap setup instead, where UV issues are far more likely.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-2': {
            skill: 'lighting',
            title: 'Investigation',
            prompt: "You open the static mesh in the Static Mesh Editor and inspect the Lightmap UVs and settings. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the UVs in Channel 1 (the intended lightmap channel) have overlapping islands and/or the Lightmap Coordinate Index is incorrectly set to 0, which is the texture UV channel. As a result, the baked shadows are fighting over the same texels and bleeding across faces.",
                    next: 'step-3'
                },
                {
                    text: "Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try adjusting indirect lighting settings and changing light types, but the artifacts remain. The real issue lies in the mesh's lightmap UVs and the coordinate index, not the light actors themselves.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'lighting',
            title: 'Dead End: Misguided',
            prompt: "Those lighting tweaks didn't work because the shadow data is still being baked into bad UVs. As long as the lightmap channel has overlaps or the wrong index, you'll keep getting splotchy results.",
            choices: [
                {
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must fix the lightmap UVs themselves and ensure the Lightmap Coordinate Index points to a non-overlapping channel (typically UV Channel 1).",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'lighting',
            title: 'The Fix',
            prompt: "You now know the cause: overlapping UVs on the lightmap channel or the Lightmap Coordinate Index using the wrong channel. How do you fix it?",
            choices: [
                {
                    text: "Fix UV Channel 1 overlaps or Lightmap Coordinate Index.]",
                    type: 'correct',
                    feedback: "In the Static Mesh Editor, you inspect UV Channel 1 and either regenerate or rebuild unique, non-overlapping lightmap UVs. You then set the Lightmap Coordinate Index to 1 so the mesh uses that clean channel for baking. After saving the mesh and rebuilding lighting, the shadows are no longer splotchy.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'lighting',
            title: 'Verification',
            prompt: "You rebake lighting and view the mesh in the level and in PIE. How do you verify the fix?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In both the level viewport and PIE, the static mesh now has clean, stable baked shadows. The previous blotchy and bleeding areas are gone, confirming that correct, non-overlapping UVs on Channel 1 and the proper Lightmap Coordinate Index fixed the issue.",
                    next: 'step-rh-1'
                }
            ]
        },
        'step-rh-1': {
            skill: 'lighting',
            title: 'Red Herring: Tweaking Lightmass Settings',
            prompt: "You suspect the issue might be related to global lighting quality. What do you try next?",
            choices: [
                {
                    text: "Increase Lightmass Indirect Lighting Quality/Bounces]",
                    type: 'wrong',
                    feedback: "You increase the indirect lighting quality and bounces in World Settings, rebuild lighting, but the splotchy shadows persist. This indicates the problem isn't about the *quality* of the indirect light calculation, but how the lightmap data is being stored on the mesh itself.",
                    next: 'step-rh-1R'
                },
            ]
        },

        'step-rh-1R': {
            skill: 'lighting',
            title: 'Dead End: Lightmass Settings',
            prompt: "Adjusting global Lightmass settings didn't resolve the localized shadow bleeding. You need to focus on the mesh's specific lightmap setup.",
            choices: [
                {
                    text: "Revert Lightmass changes and inspect mesh UVs]",
                    type: 'correct',
                    feedback: "You revert the Lightmass settings and decide to investigate the static mesh's UVs and lightmap configuration, which is a more likely culprit for localized shadow artifacts.",
                    next: 'step-rh-1R'
                },
            ]
        },

        'step-inv-1': {
            skill: 'lighting',
            title: 'Inspecting Lightmap UVs',
            prompt: "The symptoms strongly suggest a lightmap UV issue. You open the static mesh in the Static Mesh Editor. How do you visually confirm the state of its lightmap UVs?",
            choices: [
                {
                    text: "Visualize UV Channel 1 and check for overlaps]",
                    type: 'correct',
                    feedback: "In the Static Mesh Editor, you navigate to the 'UV' dropdown and select 'UV Channel 1'. You immediately notice that the UV islands are overlapping or are very tightly packed without sufficient padding, confirming the source of the bleeding. You also check the 'Lightmap Coordinate Index' in the Details panel.",
                    next: 'step-inv-1W'
                },
                {
                    text: "Check material UVs (UV Channel 0)]",
                    type: 'wrong',
                    feedback: "You check UV Channel 0, which is typically used for texture mapping. While it's good to know your texture UVs are clean, lightmap issues usually stem from problems in the *lightmap-specific* UV channel (often UV Channel 1). You need to look at the correct channel.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'lighting',
            title: 'Dead End: Wrong UV Channel',
            prompt: "You're looking at the texture UVs, not the lightmap UVs. The problem is still there. Where should you be looking?",
            choices: [
                {
                    text: "Focus on UV Channel 1]",
                    type: 'correct',
                    feedback: "You switch to UV Channel 1 in the Static Mesh Editor, and the overlapping UV islands become apparent. This is the channel used for lightmaps, and its issues are directly causing the shadow bleeding.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-2': {
            skill: 'lighting',
            title: 'Console Command Diagnostics',
            prompt: "You've visually confirmed the UV issues. Are there any console commands that can provide more detailed information or visualization about lightmap data in the viewport?",
            choices: [
                {
                    text: "Use `showflag.lightmaps` or `stat lightmap`]",
                    type: 'correct',
                    feedback: "You use `showflag.lightmaps 1` to ensure lightmaps are rendered, and `stat lightmap` to display real-time statistics about lightmap memory usage and streaming. While these don't directly show UV overlaps, they confirm lightmaps are being processed and can sometimes hint at issues if memory usage is unexpectedly high for a simple mesh, further solidifying the lightmap problem.",
                    next: 'step-inv-1'
                },
                {
                    text: "Use `stat unit`]",
                    type: 'wrong',
                    feedback: "While `stat unit` is useful for general performance, it doesn't provide specific insights into lightmap data or quality. You need commands that are directly related to lighting and lightmaps.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'lighting',
            title: 'Dead End: Irrelevant Console Command',
            prompt: "You're looking at general performance stats, not lightmap specifics. What command would be more relevant?",
            choices: [
                {
                    text: "Try `showflag.lightmaps` or `stat lightmap`]",
                    type: 'correct',
                    feedback: "You correctly identify `showflag.lightmaps` and `stat lightmap` as more relevant commands for lightmap diagnostics, confirming lightmap processing.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'lighting',
            title: 'Deeper Verification - Lightmap Density',
            prompt: "Beyond just visual inspection in PIE, how can you quantitatively verify that the lightmap density and quality are now correct and consistent across the mesh?",
            choices: [
                {
                    text: "Re-check Lightmap Density View Mode]",
                    type: 'correct',
                    feedback: "You switch back to the 'Lightmap Density' view mode. The mesh now displays a consistent, appropriate color (e.g., green) indicating healthy lightmap texel density across all surfaces, without the previous red/orange hotspots or inconsistent splotches. This confirms the UVs are now properly utilized.",
                    next: 'step-ver-1M'
                },
                {
                    text: "Check GPU stats]",
                    type: 'misguided',
                    feedback: "While performance is always important, checking `stat gpu` won't directly tell you if the *lightmap quality* is fixed. The issue was visual fidelity of baked shadows, not necessarily a performance bottleneck related to lightmap rendering. Focus on visual and density checks.",
                    next: 'step-ver-1M'
                },
            ]
        },

        'step-ver-1M': {
            skill: 'lighting',
            title: 'Dead End: Irrelevant Stats',
            prompt: "GPU stats are useful for performance, but not for confirming lightmap quality. You need to verify the visual integrity of the lightmaps.",
            choices: [
                {
                    text: "Return to Lightmap Density View Mode]",
                    type: 'correct',
                    feedback: "You return to the 'Lightmap Density' view mode, which is the most direct way to assess the distribution and consistency of lightmap texels on your mesh.",
                    next: 'step-ver-1M'
                },
            ]
        },

        'step-ver-2': {
            skill: 'lighting',
            title: 'Final Verification - Standalone Build',
            prompt: "The fix looks good in the editor and PIE. What's the ultimate test to ensure the fix holds up in a deployed environment?",
            choices: [
                {
                    text: "Launch a Standalone Game build]",
                    type: 'correct',
                    feedback: "You launch the project as a Standalone Game. In the packaged environment, the mesh's shadows remain clean and stable, confirming the fix is robust and not just an editor-specific artifact. This is crucial for shipping quality.",
                    next: 'step-ver-1'
                },
                {
                    text: "Re-import the mesh]",
                    type: 'wrong',
                    feedback: "Re-importing the mesh would only be necessary if the source asset itself was changed. Since you fixed the UVs within the Static Mesh Editor and rebuilt lighting, re-importing isn't a verification step and could potentially undo your changes if not handled carefully.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'lighting',
            title: 'Dead End: Unnecessary Re-import',
            prompt: "Re-importing isn't a verification step for this kind of fix. You need to test the actual runtime behavior.",
            choices: [
                {
                    text: "Launch a Standalone Game build]",
                    type: 'correct',
                    feedback: "You launch a Standalone Game build to confirm the fix in a deployed environment, which is the most reliable way to verify the solution.",
                    next: 'step-ver-1'
                },
            ]
        },
                }
            ]
        },
        
        'step-rh-1': {
            skill: 'lighting',
            title: 'Red Herring: Tweaking Lightmass Settings',
            prompt: "You suspect the issue might be related to global lighting quality. What do you try next?",
            choices: [
                {
                    text: "Increase Lightmass Indirect Lighting Quality/Bounces]",
                    type: 'wrong',
                    feedback: "You increase the indirect lighting quality and bounces in World Settings, rebuild lighting, but the splotchy shadows persist. This indicates the problem isn't about the *quality* of the indirect light calculation, but how the lightmap data is being stored on the mesh itself.",
                    next: 'step-rh-1R'
                },
            ]
        },

        'step-rh-1R': {
            skill: 'lighting',
            title: 'Dead End: Lightmass Settings',
            prompt: "Adjusting global Lightmass settings didn't resolve the localized shadow bleeding. You need to focus on the mesh's specific lightmap setup.",
            choices: [
                {
                    text: "Revert Lightmass changes and inspect mesh UVs]",
                    type: 'correct',
                    feedback: "You revert the Lightmass settings and decide to investigate the static mesh's UVs and lightmap configuration, which is a more likely culprit for localized shadow artifacts.",
                    next: 'step-rh-1R'
                },
            ]
        },

        'step-inv-1': {
            skill: 'lighting',
            title: 'Inspecting Lightmap UVs',
            prompt: "The symptoms strongly suggest a lightmap UV issue. You open the static mesh in the Static Mesh Editor. How do you visually confirm the state of its lightmap UVs?",
            choices: [
                {
                    text: "Visualize UV Channel 1 and check for overlaps]",
                    type: 'correct',
                    feedback: "In the Static Mesh Editor, you navigate to the 'UV' dropdown and select 'UV Channel 1'. You immediately notice that the UV islands are overlapping or are very tightly packed without sufficient padding, confirming the source of the bleeding. You also check the 'Lightmap Coordinate Index' in the Details panel.",
                    next: 'step-inv-1W'
                },
                {
                    text: "Check material UVs (UV Channel 0)]",
                    type: 'wrong',
                    feedback: "You check UV Channel 0, which is typically used for texture mapping. While it's good to know your texture UVs are clean, lightmap issues usually stem from problems in the *lightmap-specific* UV channel (often UV Channel 1). You need to look at the correct channel.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'lighting',
            title: 'Dead End: Wrong UV Channel',
            prompt: "You're looking at the texture UVs, not the lightmap UVs. The problem is still there. Where should you be looking?",
            choices: [
                {
                    text: "Focus on UV Channel 1]",
                    type: 'correct',
                    feedback: "You switch to UV Channel 1 in the Static Mesh Editor, and the overlapping UV islands become apparent. This is the channel used for lightmaps, and its issues are directly causing the shadow bleeding.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-2': {
            skill: 'lighting',
            title: 'Console Command Diagnostics',
            prompt: "You've visually confirmed the UV issues. Are there any console commands that can provide more detailed information or visualization about lightmap data in the viewport?",
            choices: [
                {
                    text: "Use `showflag.lightmaps` or `stat lightmap`]",
                    type: 'correct',
                    feedback: "You use `showflag.lightmaps 1` to ensure lightmaps are rendered, and `stat lightmap` to display real-time statistics about lightmap memory usage and streaming. While these don't directly show UV overlaps, they confirm lightmaps are being processed and can sometimes hint at issues if memory usage is unexpectedly high for a simple mesh, further solidifying the lightmap problem.",
                    next: 'step-inv-1'
                },
                {
                    text: "Use `stat unit`]",
                    type: 'wrong',
                    feedback: "While `stat unit` is useful for general performance, it doesn't provide specific insights into lightmap data or quality. You need commands that are directly related to lighting and lightmaps.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'lighting',
            title: 'Dead End: Irrelevant Console Command',
            prompt: "You're looking at general performance stats, not lightmap specifics. What command would be more relevant?",
            choices: [
                {
                    text: "Try `showflag.lightmaps` or `stat lightmap`]",
                    type: 'correct',
                    feedback: "You correctly identify `showflag.lightmaps` and `stat lightmap` as more relevant commands for lightmap diagnostics, confirming lightmap processing.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'lighting',
            title: 'Deeper Verification - Lightmap Density',
            prompt: "Beyond just visual inspection in PIE, how can you quantitatively verify that the lightmap density and quality are now correct and consistent across the mesh?",
            choices: [
                {
                    text: "Re-check Lightmap Density View Mode]",
                    type: 'correct',
                    feedback: "You switch back to the 'Lightmap Density' view mode. The mesh now displays a consistent, appropriate color (e.g., green) indicating healthy lightmap texel density across all surfaces, without the previous red/orange hotspots or inconsistent splotches. This confirms the UVs are now properly utilized.",
                    next: 'step-ver-1M'
                },
                {
                    text: "Check GPU stats]",
                    type: 'misguided',
                    feedback: "While performance is always important, checking `stat gpu` won't directly tell you if the *lightmap quality* is fixed. The issue was visual fidelity of baked shadows, not necessarily a performance bottleneck related to lightmap rendering. Focus on visual and density checks.",
                    next: 'step-ver-1M'
                },
            ]
        },

        'step-ver-1M': {
            skill: 'lighting',
            title: 'Dead End: Irrelevant Stats',
            prompt: "GPU stats are useful for performance, but not for confirming lightmap quality. You need to verify the visual integrity of the lightmaps.",
            choices: [
                {
                    text: "Return to Lightmap Density View Mode]",
                    type: 'correct',
                    feedback: "You return to the 'Lightmap Density' view mode, which is the most direct way to assess the distribution and consistency of lightmap texels on your mesh.",
                    next: 'step-ver-1M'
                },
            ]
        },

        'step-ver-2': {
            skill: 'lighting',
            title: 'Final Verification - Standalone Build',
            prompt: "The fix looks good in the editor and PIE. What's the ultimate test to ensure the fix holds up in a deployed environment?",
            choices: [
                {
                    text: "Launch a Standalone Game build]",
                    type: 'correct',
                    feedback: "You launch the project as a Standalone Game. In the packaged environment, the mesh's shadows remain clean and stable, confirming the fix is robust and not just an editor-specific artifact. This is crucial for shipping quality.",
                    next: 'step-ver-1'
                },
                {
                    text: "Re-import the mesh]",
                    type: 'wrong',
                    feedback: "Re-importing the mesh would only be necessary if the source asset itself was changed. Since you fixed the UVs within the Static Mesh Editor and rebuilt lighting, re-importing isn't a verification step and could potentially undo your changes if not handled carefully.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'lighting',
            title: 'Dead End: Unnecessary Re-import',
            prompt: "Re-importing isn't a verification step for this kind of fix. You need to test the actual runtime behavior.",
            choices: [
                {
                    text: "Launch a Standalone Game build]",
                    type: 'correct',
                    feedback: "You launch a Standalone Game build to confirm the fix in a deployed environment, which is the most reliable way to verify the solution.",
                    next: 'step-ver-1'
                },
            ]
        },

        'conclusion': {
            skill: 'lighting',
            title: 'Conclusion',
            prompt: "Lesson: High Lightmap Resolution alone won't fix bad bakes. For clean baked shadows, ensure your static meshes have unique, non-overlapping lightmap UVs (typically on UV Channel 1) and that the Lightmap Coordinate Index points to that channel instead of the texture UVs.",
            choices: []
        }
    }
};