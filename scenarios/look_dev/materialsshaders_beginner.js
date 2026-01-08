window.SCENARIOS['TextureStretching'] = {
    meta: {
        expanded: true,
        title: "Texture Stretching on Mesh",
        description: "Material looks distorted. Investigates UV scaling and Texture Coordinate nodes.",
        estimateHours: 1.5,
        category: "Materials"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'materials',
            title: 'The Symptom',
            prompt: "The material on your mesh looks stretched and distorted, even though the source texture is a clean square image. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You switch to different view modes and inspect the mesh in the viewport. The texture appears fine on a simple test cube, but on this specific mesh it's clearly stretched in certain directions. That strongly suggests a UV or tiling issue rather than a broken texture asset.",
                    next: 'step-red-herring-1'
                },
                {
                    text: "Wrong Guess]",
                    type: 'wrong',
                    feedback: "You tweak compression settings and reimport the texture, but nothing changes on the mesh. The distortion is still there, so the problem isn't with the texture file itself.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'materials',
            title: 'Dead End: Wrong Guess',
            prompt: "You chased texture import settings and compression options, but the material is still stretched on the mesh. Clearly the issue lies elsewhere.",
            choices: [
                {
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You revert the unnecessary texture changes and refocus on the mesh's UVs and how the material is sampling them.",
                    next: 'step-red-herring-1'
                }
            ]
        },
        'step-2': {
            skill: 'materials',
            title: 'Investigation',
            prompt: "You inspect the material graph and the mesh's UVs to understand why the texture is distorted. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the material plugs the texture sample's UVs directly from the default coordinates, with no control over tiling, and the mesh's UV islands are unevenly scaled. In some cases there isn't even a Texture Coordinate node exposed for adjustment. The UV map itself is stretched, so the square texture is being warped across the surface.",
                    next: 'step-inv-1'
                },
                {
                    text: "Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try changing the material to Unlit or adjusting roughness and normal strength, but the texture still looks warped. Those tweaks don't fix underlying UV or tiling problems.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'materials',
            title: 'Dead End: Misguided',
            prompt: "Those shading and lighting adjustments didn't help because the distortion comes from how the texture is mapped, not how it's lit.",
            choices: [
                {
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must fix the UV layout or give the material explicit control over tiling via a Texture Coordinate node instead of just adjusting lighting.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-3': {
            skill: 'materials',
            title: 'The Fix',
            prompt: "You now know the texture stretching is caused by bad UV scaling or missing tiling control in the material. How do you fix it?",
            choices: [
                {
                    text: "Add TexCoord node or fix Mesh UVs.]",
                    type: 'correct',
                    feedback: "In the Material Editor, you add a TextureCoordinate (TexCoord) node and plug it into the texture sample's UVs, adjusting UTiling/VTiling until the pattern looks even. If the UVs themselves are distorted, you go back to your DCC tool (or use Generate UVs) to create a clean, evenly scaled UV map. After applying the changes, the texture finally appears correctly proportioned on the mesh.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'materials',
            title: 'Verification',
            prompt: "You apply the updated material and, if needed, the fixed UVs, then view the mesh in the level and in PIE. How do you verify the fix?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In the viewport and PIE, the texture now tiles cleanly across the mesh with no stretching or warping. The square details remain square, confirming that the TexCoord setup and/or UV fix solved the problem.",
                    next: 'step-red-herring-1'
                }
            ]
        },
        'step-red-herring-1': {
            skill: 'materials',
            title: 'Red Herring: Texture Asset Properties',
            prompt: "You've identified the issue is related to UVs or tiling. Before making changes, you decide to try one more thing related to the texture asset itself, just to be absolutely sure.",
            choices: [
                {
                    text: "Action: [Re-evaluate texture import settings]",
                    type: 'correct',
                    feedback: "You check the texture's import settings, specifically 'Texture Group' and 'Mip Gen Settings'. While these can affect visual quality, they don't directly cause stretching due to UV mapping. You confirm they are set correctly but realize this isn't the root cause.",
                    next: 'step-inv-1'
                },
                {
                    text: "Action: [Change texture compression to 'UserInterface2D']",
                    type: 'wrong',
                    feedback: "Changing compression to 'UserInterface2D' is meant for UI elements and will likely degrade quality for a 3D mesh texture, without addressing the stretching. This is a dead end.",
                    next: 'step-red-herring-1W'
                },
            ]
        },

        'step-red-herring-1W': {
            skill: 'materials',
            title: 'Dead End: Wrong Texture Settings',
            prompt: "Adjusting texture compression or other non-UV related import settings didn't help. The problem is still how the texture is mapped.",
            choices: [
                {
                    text: "Action: [Revert and refocus]",
                    type: 'correct',
                    feedback: "You revert the unnecessary texture changes and refocus on the mesh's UVs and how the material is sampling them.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-inv-1': {
            skill: 'materials',
            title: 'Investigation: Visualize Mesh UVs',
            prompt: "Before diving into the material graph, how can you quickly visualize the mesh's UVs to confirm if they are the source of the stretching?",
            choices: [
                {
                    text: "Action: [Apply UV Checker Material / Visualize UVs]",
                    type: 'correct',
                    feedback: "You apply a simple UV checker material or use the 'Visualize UVs' option in the Static Mesh Editor. This immediately shows the checker pattern stretched on the problematic areas, confirming the UVs are indeed distorted or scaled unevenly.",
                    next: 'step-inv-2'
                },
                {
                    text: "Action: [Check texture resolution]",
                    type: 'wrong',
                    feedback: "Checking texture resolution won't tell you anything about how the UVs are laid out on the mesh. The texture itself might be fine, but its mapping is the issue.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'materials',
            title: 'Dead End: Irrelevant Check',
            prompt: "Checking texture resolution was a dead end. The problem is with the mapping, not the texture itself.",
            choices: [
                {
                    text: "Action: [Re-evaluate investigation]",
                    type: 'correct',
                    feedback: "You realize you need to focus on how the texture is applied to the mesh, specifically its UV coordinates.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'materials',
            title: 'Investigation: Material UV Logic',
            prompt: "You've confirmed the mesh's UVs are stretched. Now, how do you determine if the material itself is contributing to the problem (e.g., incorrect tiling values, wrong UV channel) or if it's purely a mesh UV issue?",
            choices: [
                {
                    text: "Action: [Inspect Material Instance / Debug TexCoord]",
                    type: 'correct',
                    feedback: "You open the Material Instance and look for exposed parameters related to UV tiling or offset. If none are exposed, you might temporarily add a 'TextureCoordinate' node in the base material and expose its 'UTiling' and 'VTiling' as parameters to test different scales directly on the mesh. This helps isolate if the material's UV logic is at fault or if the base UVs are the sole problem.",
                    next: 'step-inv-3'
                },
                {
                    text: "Action: [Rebuild lighting]",
                    type: 'wrong',
                    feedback: "Rebuilding lighting has no impact on how textures are mapped to UVs. This is a rendering issue, not a lighting one.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'materials',
            title: 'Dead End: Lighting vs. UVs',
            prompt: "Rebuilding lighting won't fix texture stretching. The issue is with how the texture is mapped, not how it's illuminated.",
            choices: [
                {
                    text: "Action: [Focus on UVs]",
                    type: 'correct',
                    feedback: "You realize you must focus on the material's UV inputs and the mesh's UV channels.",
                    next: 'step-inv-3'
                },
            ]
        },

        'step-inv-3': {
            skill: 'materials',
            title: 'Investigation: Confirm UV Channel Usage',
            prompt: "You've narrowed it down to either the mesh's UVs or the material's UV logic. Is there a quick way to see which UV channel the material is using, or to force a different channel for testing?",
            choices: [
                {
                    text: "Action: [Use 'Show UV' in Material Editor / Static Mesh Editor]",
                    type: 'correct',
                    feedback: "In the Material Editor, you can use the 'Show UV' option to visualize the UVs for a specific texture sample. In the Static Mesh Editor, you can cycle through UV channels to see if another channel has a better layout. This helps confirm which UV channel is being used and if an alternative exists, leading you directly to the fix.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'materials',
            title: 'Verification: Performance Check',
            prompt: "The texture now looks correct. How do you ensure your fix hasn't introduced any unexpected performance overhead or resource issues?",
            choices: [
                {
                    text: "Action: [Use 'Stat Unit' and 'Stat RHI']",
                    type: 'correct',
                    feedback: "You enable 'Stat Unit' and 'Stat RHI' in the console to monitor frame time, draw calls, and texture memory usage. You confirm that the material's complexity and texture memory remain within acceptable limits, and the fix hasn't negatively impacted performance.",
                    next: 'step-ver-2'
                },
                {
                    text: "Action: [Check material compilation time]",
                    type: 'wrong',
                    feedback: "While material compilation time is relevant during development, it doesn't reflect runtime performance or resource usage after the material is compiled and applied.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'materials',
            title: 'Dead End: Irrelevant Performance Metric',
            prompt: "Material compilation time is not a runtime performance metric. You need to check actual in-game performance.",
            choices: [
                {
                    text: "Action: [Check runtime stats]",
                    type: 'correct',
                    feedback: "You realize you need to use runtime console commands to check performance.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'materials',
            title: 'Verification: Robustness Test',
            prompt: "The texture looks good in the editor and PIE. What's one final check to ensure the fix holds up in a more isolated or deployed environment?",
            choices: [
                {
                    text: "Action: [Launch Standalone Game / Test on different platforms]",
                    type: 'correct',
                    feedback: "You launch the game in 'Standalone Game' mode and, if applicable, test on target platforms (e.g., console, mobile). This verifies that the texture displays correctly outside of the editor's viewport, confirming the fix is robust and not editor-specific.",
                    next: 'step-red-herring-1'
                }
            ]
        },



















        'step-ver-2W': {
            skill: 'materials',
            title: 'Dead End: Unnecessary Mesh Operation',
            prompt: "The mesh itself wasn't the problem, so re-exporting and re-importing it is not a valid verification step.",
            choices: [
                {
                    text: "Action: [Focus on deployment verification]",
                    type: 'correct',
                    feedback: "You realize the final check should be about how the game runs in a deployed or standalone environment.",
                    next: 'step-ver-1'
                },
            ]
        },
                },
                {
                    text: "Action: [Export mesh to FBX and reimport]",
                    type: 'wrong',
                    feedback: "Exporting and reimporting the mesh is an unnecessary step at this point, as the issue was resolved by UV or material adjustments, not a corrupted mesh asset.",
                    next: 'step-ver-2W'
                },
            ]
        },











                },
            ]
        },

        










                },
                {
                    text: "Action: [Export mesh to FBX and reimport]",
                    type: 'wrong',
                    feedback: "Exporting and reimporting the mesh is an unnecessary step at this point, as the issue was resolved by UV or material adjustments, not a corrupted mesh asset.",
                    next: 'step-ver-2W'
                },
            ]
        },




















                },
                {
                    text: "Action: [Export mesh to FBX and reimport]",
                    type: 'wrong',
                    feedback: "Exporting and reimporting the mesh is an unnecessary step at this point, as the issue was resolved by UV or material adjustments, not a corrupted mesh asset.",
                    next: 'step-ver-2W'
                },
            ]
        },











                },
            ]
        },

        










                },
            ]
        },

        



















                },
                {
                    text: "Action: [Export mesh to FBX and reimport]",
                    type: 'wrong',
                    feedback: "Exporting and reimporting the mesh is an unnecessary step at this point, as the issue was resolved by UV or material adjustments, not a corrupted mesh asset.",
                    next: 'step-ver-2W'
                },
            ]
        },











                },
            ]
        },

        










                }
            ]
        },
        




























                },
                {
                    text: "Action: [Export mesh to FBX and reimport]",
                    type: 'wrong',
                    feedback: "Exporting and reimporting the mesh is an unnecessary step at this point, as the issue was resolved by UV or material adjustments, not a corrupted mesh asset.",
                    next: 'step-ver-2W'
                },
            ]
        },











                },
            ]
        },

        










                },
                {
                    text: "Action: [Export mesh to FBX and reimport]",
                    type: 'wrong',
                    feedback: "Exporting and reimporting the mesh is an unnecessary step at this point, as the issue was resolved by UV or material adjustments, not a corrupted mesh asset.",
                    next: 'step-ver-2W'
                },
            ]
        },




















                },
                {
                    text: "Action: [Export mesh to FBX and reimport]",
                    type: 'wrong',
                    feedback: "Exporting and reimporting the mesh is an unnecessary step at this point, as the issue was resolved by UV or material adjustments, not a corrupted mesh asset.",
                    next: 'step-ver-2W'
                },
            ]
        },











                },
            ]
        },

        










                },
            ]
        },

        



















                },
                {
                    text: "Action: [Export mesh to FBX and reimport]",
                    type: 'wrong',
                    feedback: "Exporting and reimporting the mesh is an unnecessary step at this point, as the issue was resolved by UV or material adjustments, not a corrupted mesh asset.",
                    next: 'step-ver-2W'
                },
            ]
        },











                },
            ]
        },

        











        'conclusion': {
            skill: 'materials',
            title: 'Conclusion',
            prompt: "Lesson: If a square texture looks stretched on a mesh, inspect the UVs and material UV input. Use a TextureCoordinate node with proper tiling, and ensure the mesh has a clean, correctly scaled UV map so the material can display without distortion.",
            choices: []
        }
    }
};