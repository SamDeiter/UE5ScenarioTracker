window.SCENARIOS['BlackMaterialDueToEmissiveMiswiring'] = {
    "meta": {
        "title": "Lit Material Renders Pure Black in Scene",
        "description": "A newly created master material (M_Master_Rock) intended for a PBR static mesh rock appears completely black in the main level viewport, regardless of how intense the surrounding lighting (Point Light",
        "estimateHours": 0.7,
        "category": "Materials & Shaders",
        "tokens_used": 9833
    },
    "setup": [
        {
            "action": "set_ue_property",
            "scenario": "BlackMaterialDueToEmissiveMiswiring",
            "step": "step-0"
        }
    ],
    "fault": {
        "description": "Initial problem state",
        "visual_cue": "Visual indicator"
    },
    "expected": {
        "description": "Expected resolved state",
        "validation_action": "verify_fix"
    },
    "fix": [
        {
            "action": "set_ue_property",
            "scenario": "BlackMaterialDueToEmissiveMiswiring",
            "step": "final"
        }
    ],
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "materialsshaders",
            "title": "Observe Pure Black Material",
            "imagePath": "/scenarios/BlackMaterialDueToEmissiveMiswiring/step1.png",
            "sceneSpecPath": "/sceneSpecs/BlackMaterialDueToEmissiveMiswiring/step1.json",
            "scenarioId": "BlackMaterialDueToEmissiveMiswiring",
            "stepId": "step-1",
            "prompt": "<p>A newly placed <strong>Static Mesh Actor</strong> with <strong>M_Master_Rock</strong> appears completely black in the <strong>Level Editor</strong>. Surrounding lighting is intense. How do you begin investigating this visual issue?</p>",
            "choices": [
                {
                    "text": "<p>Select the black <strong>Static Mesh Actor</strong> in the viewport.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.01hrs. Selecting the actor is the first logical step to examine its properties and ensure it's the correct object.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Add more <strong>Point Lights</strong> or increase <strong>Sky Light</strong> intensity.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. The scenario states lighting is already 'intense', suggesting adding more lights is unlikely to solve a purely black material issue and wastes time.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Check the <strong>World Outliner</strong> for hidden actors.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.04hrs. While 'Hidden in Game' can cause visibility issues, the actor is *visible* but black, making this less relevant than checking the actor's properties directly.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Open the <strong>Static Mesh Editor</strong> to check mesh properties.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.06hrs. The problem description implies a material issue, not a mesh one, so diving into the mesh editor is a premature step.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "materialsshaders",
            "title": "Examine Static Mesh Actor Details",
            "imagePath": "/scenarios/BlackMaterialDueToEmissiveMiswiring/step2.png",
            "sceneSpecPath": "/sceneSpecs/BlackMaterialDueToEmissiveMiswiring/step2.json",
            "scenarioId": "BlackMaterialDueToEmissiveMiswiring",
            "stepId": "step-2",
            "prompt": "<p>The <strong>Static Mesh Actor</strong> is selected. You see its <strong>Details</strong> panel. What is the first relevant property to confirm regarding its material?</p>",
            "choices": [
                {
                    "text": "<p>Verify the assigned <strong>Material Instance</strong>, which is <strong>MI_Rock_A</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.01hrs. Confirming the correct material is applied is crucial before investigating the material itself.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Check the <code>Cast Shadows</code> property.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While important, <code>Cast Shadows</code> affects shadows, not the material's fundamental color or lit appearance.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Look for the <code>Visible</code> flag in the <strong>Details</strong> panel.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The object is visible, just black. This check is for hidden objects, not improperly rendered ones.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Confirm the <code>Mobility</code> is set to 'Movable'.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. Mobility settings affect lighting calculations but usually result in incorrect lighting or dark areas, not a pure black material in a well-lit scene.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "materialsshaders",
            "title": "Open Material Instance",
            "imagePath": "/scenarios/BlackMaterialDueToEmissiveMiswiring/step3.png",
            "sceneSpecPath": "/sceneSpecs/BlackMaterialDueToEmissiveMiswiring/step3.json",
            "scenarioId": "BlackMaterial DueToEmissiveMiswiring",
            "stepId": "step-3",
            "prompt": "<p>The <strong>Details</strong> panel confirms <strong>MI_Rock_A</strong> is assigned. The <strong>Material Editor</strong> preview for <strong>M_Master_Rock</strong> looks correct. What is your immediate next step to inspect the material setup?</p>",
            "choices": [
                {
                    "text": "<p>Double-click the <strong>Material Instance (MI_Rock_A)</strong> to open its editor.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.01hrs. This is the correct way to begin inspecting the material's properties and tracing back to its parent.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Apply a brand new, default material to the mesh to 'confirm the mesh isn't broken'.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. This is a destructive and time-wasting step that removes the current material setup without diagnosing the actual problem.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Open <strong>M_Master_Rock</strong> directly from the <strong>Content Browser</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.02hrs. While possible, opening the instance first and then navigating to the parent ensures you are looking at the exact material chain used by the actor.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Check the <strong>Static Mesh Component's</strong> <code>Hidden in Game</code> flag.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Similar to checking 'Visible', the object is clearly rendered, just incorrectly, so this setting isn't the cause.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "materialsshaders",
            "title": "Go to Parent Master Material",
            "prompt": "<p>You are now in the <strong>Material Instance Editor</strong> for <strong>MI_Rock_A</strong>. To thoroughly inspect the material's logic, what's your next action?</p>",
            "choices": [
                {
                    "text": "<p>Use the 'Go to Parent <strong>Material</strong>' button to open <strong>M_Master_Rock</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.04hrs. Debugging a material instance often requires inspecting its parent material, especially for core rendering properties.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Start adjusting exposed parameters in the <strong>Material Instance</strong>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The issue likely lies in the master material's core setup, not exposed parameters which appear correct in the preview.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Check the <strong>Material Instance's</strong> <code>Shading Model</code>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. The shading model is a property of the master material, not typically overridden in an instance. Checking the parent is more direct.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Recompile the <strong>Material Instance</strong>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.04hrs. Recompiling an instance won't fix underlying logic errors in its parent material; it just processes current parameters.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "materialsshaders",
            "title": "Validate Material Shading Properties",
            "prompt": "<p>Inside <strong>M_Master_Rock</strong>, you need to confirm its fundamental rendering properties for lit surfaces. How should you proceed?</p>",
            "choices": [
                {
                    "text": "<p>Inspect the <strong>Material Details</strong> panel to confirm <code>Shading Model</code> is 'Default Lit' and <code>Blend Mode</code> is 'Opaque'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.03hrs. These are critical settings for any lit, solid material and must be verified first.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Change the material <code>Blend Mode</code> from 'Opaque' to 'Masked'.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. Changing the blend mode incorrectly can introduce new visual issues and is not a diagnostic step for a black, lit material.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Check the <code>Two Sided</code> property.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While relevant for mesh rendering, this wouldn't typically cause an entire material to render as pure black on a solid object.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Look at the <strong>Shader Stats</strong> panel for compilation warnings.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.04hrs. While warnings can be informative, they are often about performance or minor issues, not direct rendering problems like a completely black material.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "materialsshaders",
            "title": "Review Main Output Connections",
            "prompt": "<p>The <strong>Material Details</strong> panel confirms 'Default Lit' and 'Opaque'. Now, focus on how the material defines its final appearance. Which approach do you choose?</p>",
            "choices": [
                {
                    "text": "<p>Examine the final output connections leading into the main <strong>Material Output</strong> node.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.02hrs. The <strong>Material Output</strong> node is where all the material's properties converge, making it the most critical point to inspect for incorrect connections.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Immediately start adding a new <strong>Base Color</strong> texture.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. This is a premature modification without understanding the existing graph and could overwrite desired functionality.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Check the <strong>Material Preview</strong> window settings.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The preview sphere is rendering correctly, indicating the issue is likely not with the preview settings, but with how the material interacts with scene lighting.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Debug individual texture samplers using the 'Start Previewing Node' feature.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.06hrs. While useful for individual nodes, the problem seems to be at a higher level of integration, making the final output node more pertinent.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "materialsshaders",
            "title": "Locate Visual Color Network",
            "prompt": "<p>You are examining the connections to the <strong>Material Output</strong> node. There are multiple networks of nodes. How do you identify the network responsible for the material's visual color?</p>",
            "choices": [
                {
                    "text": "<p>Identify the primary PBR network of texture samplers and parameters defining visual color.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.04hrs. This network is the intended source for the material's color information and needs to be traced.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Focus on any metallic or roughness texture samplers.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Metallic and Roughness define surface properties, not the base visual color, so they are not the primary target for a black color issue.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Look for any constant vector 3 nodes.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. While a constant could define color, the scenario specifies a PBR material, implying a more complex texture-based network.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Find the 'Vertex Color' node, assuming it's driving color.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.04hrs. Vertex color can influence appearance but is often used for blending or subtle effects, not typically the primary PBR color for a master rock material.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "materialsshaders",
            "title": "Trace PBR Color Output",
            "prompt": "<p>You've identified the main PBR network intended for the material's visual color. What's your next move to understand its behavior?</p>",
            "choices": [
                {
                    "text": "<p>Trace the wire outputting the calculated color from this PBR network.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.06hrs. Tracing the output is essential to discover where the PBR color information is actually being sent within the material graph.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Start creating a new connection to <code>Base Color</code> immediately.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Making changes without fully understanding the current setup could break other parts of the material or hide the root cause.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Disconnect the PBR network to see if the material becomes white.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. While a diagnostic step, tracing the wire directly provides more information about the existing connection before making changes.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Check the texture samplers within the PBR network.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Individual sampler details are less important than where their *combined output* is flowing, which is the immediate issue.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "materialsshaders",
            "title": "Note Incorrect Emissive Link",
            "prompt": "<p>Tracing the wire from the PBR network, what do you observe about its connection to the <strong>Material Output</strong> node?</p>",
            "choices": [
                {
                    "text": "<p>It is incorrectly connected to the <code>Emissive Color</code> input.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.04hrs. This is the critical incorrect connection that needs to be identified.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>It is connected to the <code>Normal</code> input.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Connecting color data to <code>Normal</code> would result in extreme surface distortion, not a pure black material.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>It is connected to the <code>Roughness</code> input.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. Connecting color to <code>Roughness</code> would lead to unusual shininess/dullness, but typically not a pure black appearance.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>It appears disconnected.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.06hrs. If it were disconnected, the material might default to a gray or white, not pure black if other attributes are also disconnected.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "materialsshaders",
            "title": "Verify Base Color Input State",
            "prompt": "<p>With the PBR color network connected to <code>Emissive Color</code>, what is the state of the <code>Base Color</code> input on the main <strong>Material Output</strong> node?</p>",
            "choices": [
                {
                    "text": "<p>The <code>Base Color</code> input is disconnected or driven by a constant zero.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.04hrs. This observation, combined with the incorrect Emissive connection, explains why the material appears black in the scene.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>It is correctly connected to another PBR network.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.09hrs. If <code>Base Color</code> were correctly connected and producing non-zero values, the material wouldn't be pure black.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>It is connected to the <code>Metallic</code> input.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. This would lead to incorrect metallic properties, not a pure black <code>Base Color</code>.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>It is connected to a very dark, non-zero constant.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While a very dark constant might be hard to distinguish from black, a truly disconnected or zero <code>Base Color</code> is the more direct cause for the pure black output.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "materialsshaders",
            "title": "Disconnect Emissive Color",
            "prompt": "<p>Given the PBR color network is connected to <code>Emissive Color</code>, and <code>Base Color</code> is disconnected (or zero), what's the immediate action to rectify the color output?</p>",
            "choices": [
                {
                    "text": "<p>Disconnect the PBR network wire from the <code>Emissive Color</code> input.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.04hrs. This is the first step in correcting the misrouting of the material's primary color information.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Immediately connect the PBR network to <code>Base Color</code> without disconnecting.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Attempting to connect a wire to an already connected input might not work or create unexpected results; disconnection is the explicit action.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Add a 'Multiply' node between the PBR network and <code>Emissive Color</code>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.06hrs. This would further complicate an already incorrect setup; the goal is to correct the input, not modify the existing, wrong connection.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Add a 'Constant3Vector' node to <code>Base Color</code> with a value of (1,1,1).</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While this might make the object visible, it bypasses the intended PBR network for <code>Base Color</code> and isn't the true fix.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "materialsshaders",
            "title": "Link PBR to Base Color",
            "prompt": "<p>The PBR network is now disconnected from <code>Emissive Color</code>. Where should this network be reconnected for proper PBR lighting interaction?</p>",
            "choices": [
                {
                    "text": "<p>Reconnect the exact same PBR network output to the <code>Base Color</code> input.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.06hrs. Routing the PBR network to <code>Base Color</code> is fundamental for a lit, physically-based material to display its color correctly.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Connect it to the <code>Ambient Occlusion</code> input.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.09hrs. <code>Ambient Occlusion</code> defines self-shadowing, not the primary color. Connecting the PBR network here would lead to very strange rendering.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Connect it to the <code>Subsurface Color</code> input.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. <code>Subsurface Color</code> is for materials like skin or wax, requiring a specific shading model and not typically used for a rock's primary color.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Connect a simple constant white value to <code>Base Color</code> instead.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. This would make the material white but discard the detailed PBR textures intended for the rock, failing to fully resolve the problem.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "materialsshaders",
            "title": "Confirm Emissive Is Unconnected",
            "prompt": "<p>The PBR network is now correctly routed to <code>Base Color</code>. What should be verified regarding the <code>Emissive Color</code> input?</p>",
            "choices": [
                {
                    "text": "<p>Verify that the <code>Emissive Color</code> input is now correctly disconnected or driven by a constant black/zero.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.03hrs. It's important to ensure no unintended emissive glow remains after correcting the <code>Base Color</code> connection.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Connect a 'Constant3Vector' node with a high value to <code>Emissive Color</code>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. This would purposefully make the material emit light, which is not the goal for a standard PBR rock and could reintroduce unwanted behavior.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Leave it connected to a disconnected wire.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While harmless, explicitly setting it to black or fully disconnecting ensures clarity and prevents potential issues if the wire accidentally connects elsewhere.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Add an 'Add' node to combine <code>Base Color</code> and <code>Emissive Color</code>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. This would create emissive properties, which is not what the PBR material is designed for, and overcomplicates the graph.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "materialsshaders",
            "title": "Check PBR Attribute Connections",
            "prompt": "<p>With <code>Base Color</code> corrected, what other essential <strong>Material Output</strong> connections should be quickly verified to ensure proper PBR calculations remain intact?</p>",
            "choices": [
                {
                    "text": "<p>Verify the <code>Roughness</code>, <code>Metallic</code>, and <code>Normal</code> inputs are still connected correctly.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.03hrs. These inputs are crucial for the material's PBR appearance and lighting interaction, and should be confirmed undisturbed.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Check the <code>Opacity Mask</code> input.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. <code>Opacity Mask</code> is for masked blend modes and is irrelevant for an opaque material.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Re-check the <code>Shading Model</code> in the <strong>Material Details</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The <code>Shading Model</code> was already confirmed as 'Default Lit' earlier; it's unlikely to have changed unexpectedly.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Add a 'Power' node to modify the <code>Roughness</code>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.06hrs. This is a modification, not a verification, and could introduce new visual issues.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "materialsshaders",
            "title": "Finalize Material Changes",
            "prompt": "<p>All connections in <strong>M_Master_Rock</strong> now appear correct for a lit PBR material. What's the final action to propagate these changes and see them in the level?</p>",
            "choices": [
                {
                    "text": "<p>Click <code>Apply</code> and <code>Save</code> the <strong>M_Master_Rock</strong> material and wait for compilation.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. Both 'Apply' (to compile and propagate changes) and 'Save' (to make them permanent) are essential for seeing the fix in the editor and ensuring it persists.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Close the <strong>Material Editor</strong> without saving.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.20hrs. This would discard all your changes, requiring you to repeat the entire debugging process.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Click only <code>Save</code>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. 'Save' makes changes permanent but 'Apply' is specifically for initiating the compilation and pushing changes to the engine runtime.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Click <code>Compile</code> only.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While 'Apply' internally compiles, clicking a separate 'Compile' button might not save your work, and 'Apply' is the standard method for live updates.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "materialsshaders",
            "title": "Return to Level",
            "prompt": "<p>The material has compiled and saved. Where should you go next to check the results of your fix?</p>",
            "choices": [
                {
                    "text": "<p>Return to the <strong>Level Editor</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.09hrs. The <strong>Level Editor</strong> is where the issue was observed, so it's the place to confirm the fix directly on the actor.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Check the <strong>Material Preview</strong> sphere again.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The preview sphere never had the issue, so checking it again won't confirm the fix in the scene.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Open the <strong>Static Mesh Editor</strong> for the rock.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.04hrs. The mesh itself wasn't the problem, and its editor won't show the material's interaction with scene lighting.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Re-open <strong>MI_Rock_A</strong> to see if it updated.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. The instance itself doesn't directly show the rendering in the level; the level viewport is the ultimate test.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "materialsshaders",
            "title": "Confirm Material Renders Correctly",
            "prompt": "<p>In the <strong>Level Editor</strong>, what specific visual confirmation are you looking for to verify the issue is resolved?</p>",
            "choices": [
                {
                    "text": "<p>Confirm the <strong>Static Mesh</strong> now renders correctly with proper lighting interaction and color.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.01hrs. This is the final verification that the material appears as intended and correctly responds to the scene's lighting.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Check if the rock's <code>Mobility</code> setting has changed.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. <code>Mobility</code> changes were not part of the fix and are unlikely to have occurred spontaneously.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Increase the intensity of scene lights to be sure.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. This is an unnecessary step. If the material renders correctly, increasing light intensity should only make it brighter, not confirm the fix itself.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Select the rock again and check its assigned <strong>Material Instance</strong>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. While a quick check, the most important confirmation is the visual appearance in the level, not just the assignment.</p>",
                    "next": "step-17"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario. The rock material now renders correctly in the scene.</p>",
            "choices": [{"text": "Complete Scenario", "type": "correct", "feedback": "", "next": "end"}]
        }
    }
};
