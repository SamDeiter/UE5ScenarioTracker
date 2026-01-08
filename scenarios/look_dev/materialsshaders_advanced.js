window.SCENARIOS['WPOShadowDetachment'] = {
    meta: {
        expanded: true,
        title: "Shadow Detached from WPO Mesh",
        description: "Shadow stays put while mesh moves with wind. Investigates Shadow Pass Switch and WPO shadows.",
        estimateHours: 4.0,
        category: "Materials"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'materials',
            title: 'The Symptom',
            prompt: "Your foliage or mesh is animated using World Position Offset for wind, but its shadow stays in the original position or appears detached and floating away from the object. The lit mesh and its shadow no longer line up. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You switch to lighting and shadow visualization view modes and notice that the mesh's WPO animation is visible in the base pass, but the shadow map still looks like the undeformed, original mesh. This strongly suggests the shadow pass isn't respecting the WPO displacement.",
                    next: 'step-inv-1'
                },
                {
                    text: "Wrong Guess]",
                    type: 'wrong',
                    feedback: "You try adjusting light intensity and changing the sun angle, but the shadow still appears detached and doesn't follow the animated mesh. Clearly this isn't just a simple lighting strength or angle problem.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'materials',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path, assuming the issue was just light settings or directional angle. Even after tweaking those, the shadow remains offset from the moving mesh.",
            choices: [
                {
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the unnecessary light tweaks and refocus on the material itself, especially how World Position Offset is handled in different rendering passes.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-2': {
            skill: 'materials',
            title: 'Investigation',
            prompt: "You open the material used for the wind-animated mesh and inspect how World Position Offset is wired. You want to understand why the lit mesh moves but the shadow does not. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover the material uses World Position Offset to drive wind animation, but there is no logic to handle WPO differently in the shadow pass. The shadow map is still generated from the original, undisplaced mesh position, so the lighting pass and shadow pass disagree on where the object actually is.",
                    next: 'step-3'
                },
                {
                    text: "Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try cranking up cascaded shadow resolution and tweaking distance / contact shadows, but the shadow still sits in the wrong place. The problem isn't quality or range--it's that the shadow pass isn't using the displaced vertices.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'materials',
            title: 'Dead End: Misguided',
            prompt: "Those shadow quality tweaks didn't work because the underlying mismatch remains: the base pass uses displaced vertices from WPO, while the shadow map still assumes the original static mesh position.",
            choices: [
                {
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must explicitly tell the material what to do in the shadow pass--either applying appropriate WPO there via a Shadow Pass Switch node or compensating with light shadow bias--rather than just increasing shadow quality.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'materials',
            title: 'The Fix',
            prompt: "You now know the cause: the World Position Offset isn't being handled correctly for the shadow pass, so the shadow is cast from the original mesh instead of the displaced one. How do you fix it?",
            choices: [
                {
                    text: "Enable 'Shadow Pass Switch' or correct shadow bias.]",
                    type: 'correct',
                    feedback: "In the material, you use a Shadow Pass Switch to control how WPO is applied for shadow casting, ensuring that the shadow pass uses a version of the displacement that matches the visible animation (or a simplified variant that still lines up). Where needed, you also refine the light's Shadow Bias settings to avoid minor detachment artifacts. After recompiling the material, the mesh and its shadow move together with the wind instead of separating.",
                    next: 'step-ver-B'
                }
            ]
        },
        'step-4': {
            skill: 'materials',
            title: 'Verification',
            prompt: "You re-run the scene in PIE and watch the wind-animated meshes and their shadows over time. How do you verify that the issue is resolved?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, as the wind animates the foliage or mesh via World Position Offset, the shadow now deforms or shifts appropriately with it rather than staying behind or floating away. The silhouette and shadow stay aligned from multiple camera angles, confirming that the Shadow Pass Switch / shadow bias fix worked.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'materials',
            title: 'Shadow Pass Inspection',
            prompt: "You've confirmed the base pass shows WPO, but the shadow doesn't. Now, let's directly inspect the shadow pass. What view modes or console commands help visualize how shadows are being generated?",
            choices: [
                {
                    text: "Use ShowFlag.VisualizeShadows / Shadow Frustums]",
                    type: 'correct',
                    feedback: "You activate 'ShowFlag.VisualizeShadows' and 'ShowFlag.ShadowFrustums' in the viewport. This clearly shows that the shadow map itself is being generated from the static, undeformed mesh, even as the visible mesh animates. The shadow frustums also appear to be calculated based on the static mesh.",
                    next: 'step-inv-2'
                },
                {
                    text: "Check Mesh Collision Complexity]",
                    type: 'wrong',
                    feedback: "You inspect the mesh's collision settings, thinking it might influence shadow generation. However, collision complexity primarily affects physics interactions and ray casts, not the visual shadow map generation from WPO-animated geometry. This is a red herring.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-inv-2': {
            skill: 'materials',
            title: 'Material Pass Debugging',
            prompt: "You've seen the shadow pass isn't reflecting WPO. Before diving into the material graph, are there any other visualization tools or console commands that can give clues about how the material is behaving in different rendering passes, specifically regarding WPO?",
            choices: [
                {
                    text: "Use Buffer Visualization -> World Position, or Shader Complexity]",
                    type: 'correct',
                    feedback: "You switch to 'Buffer Visualization -> World Position' and observe the animated mesh's world position accurately reflecting the WPO. Then, you check 'Shader Complexity' to ensure no unexpected shader branches or high instruction counts are present, confirming the base pass is processing WPO as expected, further isolating the issue to the shadow pass.",
                    next: 'step-inv-1'
                },
                {
                    text: "Adjust Post Process Volume settings]",
                    type: 'wrong',
                    feedback: "You try tweaking post-process settings like Ambient Occlusion or Screen Space Reflections, thinking they might influence shadow appearance. However, these effects are applied *after* shadow generation and don't address the fundamental mismatch between the mesh's WPO and its shadow's position. This is a misdirection.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-rh-1': {
            skill: 'materials',
            title: 'Dead End: Mesh Bounds Misconception',
            prompt: "You suspected the mesh's bounding box or collision might be misaligned, causing the shadow to be cast incorrectly. You've adjusted the mesh's bounds scale or rebuilt collision, but the shadow detachment persists. Why was this a red herring?",
            choices: [
                {
                    text: "Realize bounds/collision don't affect WPO shadow casting]",
                    type: 'correct',
                    feedback: "You realize that while mesh bounds are important for culling and LODs, and collision for physics, they don't directly dictate how World Position Offset is applied to vertices for shadow map generation. The problem lies deeper in the material's rendering passes.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'materials',
            title: 'Dead End: Post Process Misdirection',
            prompt: "You tried tweaking post-process settings like Ambient Occlusion or Screen Space Reflections, thinking they might influence shadow appearance. However, the core issue of the shadow detaching from the WPO-animated mesh remains. Why was this a misdirection?",
            choices: [
                {
                    text: "Understand post-process effects are applied *after* shadow generation]",
                    type: 'correct',
                    feedback: "You correctly identify that post-process effects operate on the final rendered image or G-buffer data, long after shadow maps have been generated. They cannot correct a fundamental mismatch in vertex positions between the base pass and the shadow pass. You need to focus on the material itself.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'materials',
            title: 'Standalone Verification',
            prompt: "The fix appears to work in PIE. To be absolutely sure, how would you verify this in a more production-like environment, ruling out editor-specific behaviors?",
            choices: [
                {
                    text: "Launch in Standalone Game or Packaged Build]",
                    type: 'correct',
                    feedback: "You launch the project in 'Standalone Game' mode or create a small packaged build. This ensures that the fix holds up outside of the editor's specific rendering pipeline and confirms it's robust for deployment. The shadows remain correctly attached and animated.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'materials',
            title: 'Performance & Robustness Check',
            prompt: "The shadow now follows the WPO mesh. What final checks should you perform to ensure the solution is robust and doesn't introduce new problems, especially regarding performance?",
            choices: [
                {
                    text: "Monitor 'stat unit' and 'stat gpu' for overhead, test on different hardware/platforms]",
                    type: 'correct',
                    feedback: "You enable 'stat unit' and 'stat gpu' to monitor frame time and GPU performance. You ensure that applying WPO in the shadow pass doesn't introduce significant overhead. You also consider testing on different hardware or target platforms to confirm the solution's robustness and performance consistency.",
                    next: 'step-ver-1'
                },
            ]
        },

        

        'step-inv-A': {
            skill: 'materials',
            title: 'Shadow Pass Inspection',
            prompt: "You've confirmed the base pass shows WPO, but the shadow doesn't. Now, let's directly inspect the shadow pass. What view modes or console commands help visualize how shadows are being generated?",
            choices: [
                {
                    text: "Use ShowFlag.VisualizeShadows / Shadow Frustums]",
                    type: 'correct',
                    feedback: "You activate 'ShowFlag.VisualizeShadows' and 'ShowFlag.ShadowFrustums' in the viewport. This clearly shows that the shadow map itself is being generated from the static, undeformed mesh, even as the visible mesh animates. The shadow frustums also appear to be calculated based on the static mesh.",
                    next: 'step-inv-A'
                },
                {
                    text: "Check Mesh Collision Complexity]",
                    type: 'wrong',
                    feedback: "You inspect the mesh's collision settings, thinking it might influence shadow generation. However, collision complexity primarily affects physics interactions and ray casts, not the visual shadow map generation from WPO-animated geometry. This is a red herring.",
                    next: 'step-rh-A'
                },
            ]
        },

        'step-inv-B': {
            skill: 'materials',
            title: 'Material Pass Debugging',
            prompt: "You've seen the shadow pass isn't reflecting WPO. Before diving into the material graph, are there any other visualization tools or console commands that can give clues about how the material is behaving in different rendering passes, specifically regarding WPO?",
            choices: [
                {
                    text: "Use Buffer Visualization -> World Position, or Shader Complexity]",
                    type: 'correct',
                    feedback: "You switch to 'Buffer Visualization -> World Position' and observe the animated mesh's world position accurately reflecting the WPO. Then, you check 'Shader Complexity' to ensure no unexpected shader branches or high instruction counts are present, confirming the base pass is processing WPO as expected, further isolating the issue to the shadow pass.",
                    next: 'step-inv-B'
                },
                {
                    text: "Adjust Post Process Volume settings]",
                    type: 'wrong',
                    feedback: "You try tweaking post-process settings like Ambient Occlusion or Screen Space Reflections, thinking they might influence shadow appearance. However, these effects are applied *after* shadow generation and don't address the fundamental mismatch between the mesh's WPO and its shadow's position. This is a misdirection.",
                    next: 'step-rh-B'
                },
            ]
        },

        'step-rh-A': {
            skill: 'materials',
            title: 'Dead End: Mesh Bounds Misconception',
            prompt: "You suspected the mesh's bounding box or collision might be misaligned, causing the shadow to be cast incorrectly. You've adjusted the mesh's bounds scale or rebuilt collision, but the shadow detachment persists. Why was this a red herring?",
            choices: [
                {
                    text: "Realize bounds/collision don't affect WPO shadow casting]",
                    type: 'correct',
                    feedback: "You realize that while mesh bounds are important for culling and LODs, and collision for physics, they don't directly dictate how World Position Offset is applied to vertices for shadow map generation. The problem lies deeper in the material's rendering passes.",
                    next: 'step-inv-A'
                },
            ]
        },

        'step-rh-B': {
            skill: 'materials',
            title: 'Dead End: Post Process Misdirection',
            prompt: "You tried tweaking post-process settings like Ambient Occlusion or Screen Space Reflections, thinking they might influence shadow appearance. However, the core issue of the shadow detaching from the WPO-animated mesh remains. Why was this a misdirection?",
            choices: [
                {
                    text: "Understand post-process effects are applied *after* shadow generation]",
                    type: 'correct',
                    feedback: "You correctly identify that post-process effects operate on the final rendered image or G-buffer data, long after shadow maps have been generated. They cannot correct a fundamental mismatch in vertex positions between the base pass and the shadow pass. You need to focus on the material itself.",
                    next: 'step-inv-B'
                },
            ]
        },


        'step-ver-A': {
            skill: 'materials',
            title: 'Standalone Verification',
            prompt: "The fix appears to work in PIE. To be absolutely sure, how would you verify this in a more production-like environment, ruling out editor-specific behaviors?",
            choices: [
                {
                    text: "Launch in Standalone Game or Packaged Build]",
                    type: 'correct',
                    feedback: "You launch the project in 'Standalone Game' mode or create a small packaged build. This ensures that the fix holds up outside of the editor's specific rendering pipeline and confirms it's robust for deployment. The shadows remain correctly attached and animated.",
                    next: 'step-ver-A'
                },
            ]
        },

        'step-ver-B': {
            skill: 'materials',
            title: 'Performance & Robustness Check',
            prompt: "The shadow now follows the WPO mesh. What final checks should you perform to ensure the solution is robust and doesn't introduce new problems, especially regarding performance?",
            choices: [
                {
                    text: "Monitor 'stat unit' and 'stat gpu' for overhead, test on different hardware/platforms]",
                    type: 'correct',
                    feedback: "You enable 'stat unit' and 'stat gpu' to monitor frame time and GPU performance. You ensure that applying WPO in the shadow pass doesn't introduce significant overhead. You also consider testing on different hardware or target platforms to confirm the solution's robustness and performance consistency.",
                    next: 'step-ver-B'
                },
            ]
        },

                }
            ]
        },
        






        









        'conclusion': {
            skill: 'materials',
            title: 'Conclusion',
            prompt: "Lesson: When using World Position Offset for animation (like wind), remember that shadows are generated in a separate pass. Use a Shadow Pass Switch node in the material (and refine shadow bias on the light if needed) so the shadow pass accounts for WPO and the mesh's shadow doesn't detach or drift away from the visible geometry.",
            choices: []
        }
    }
};