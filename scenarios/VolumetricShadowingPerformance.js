window.SCENARIOS['VolumetricShadowingPerformance'] = {
    "meta": {
        "title": "Translucent Mesh Material Fails Dynamic Self-Shadowing & Causes Severe Overdraw",
        "description": "A large, translucent mesh (representing a cloud or nebula volume) is placed in the level. It uses World Position Offset (WPO) to simulate internal movement. The problem presents in two ways: 1) The mesh component is set to 'Cast Dynamic Shadows', but it does not receive dynamic self-shadowing or external shadows correctly from nearby movable lights, resulting in a flat, unlit appearance. 2) When viewing the scene in the 'Shader Complexity' view mode, this single mesh renders as bright red/pink, causing a significant frame rate drop (upwards of 15ms) whenever it is on screen, indicating extreme overdraw/expensive calculation.",
        "estimateHours": 3,
        "category": "Materials & Shaders"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "materialsshaders",
            "title": "Step 1",
            "prompt": "<p>Use the console command 'stat GPU' to confirm that the GPU time spikes significantly when the problematic mesh is visible, validating that the issue is performance related to draw call complexity.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Use the console command 'stat GPU' to confirm that the GPU time spikes significantly when the problematic mesh is visible, validating that the issue is performance related to draw call complexity.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Increasing the Light Source Radius or Light Source Angle to try and soften the missing shadows, incorrectly assuming the light definition is too sharp.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "materialsshaders",
            "title": "Step 2",
            "prompt": "<p>Switch the viewport to 'Shader Complexity' view mode and visually confirm the material renders in the highest complexity colors (bright pink/red).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Switch the viewport to 'Shader Complexity' view mode and visually confirm the material renders in the highest complexity colors (bright pink/red).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Trying to solve the performance issue by disabling Ray Tracing in the Project Settings or Post Process Volume, which treats the symptom (slowness) but not the cause (expensive shader iteration and overdraw).</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "materialsshaders",
            "title": "Step 3",
            "prompt": "<p>Locate the specific Static Mesh Actor in the Outliner and identify the applied Material Instance (e.g., MI_Volumetric_Cloud).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate the specific Static Mesh Actor in the Outliner and identify the applied Material Instance (e.g., MI_Volumetric_Cloud).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Checking the mesh component's collision settings or trace channels, incorrectly assuming the shadow failure is due to a misconfigured trace setting.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "materialsshaders",
            "title": "Step 4",
            "prompt": "<p>Open the Material Instance and trace it back to the Parent Material (M_Volumetric_Base) to begin analysis of the shader graph.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Material Instance and trace it back to the Parent Material (M_Volumetric_Base) to begin analysis of the shader graph.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Enabling 'Volumetric Translucent Shadows' in Project Settings without realizing that the custom material, due to WPO usage, requires a transition to Masked blend mode for reliable dynamic shadowing.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "materialsshaders",
            "title": "Step 5",
            "prompt": "<p>In M_Volumetric_Base, identify the custom Material Function (MF_Noise_Iterator) used to generate the complex volumetric look and WPO, noting that this function is called multiple times.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In M_Volumetric_Base, identify the custom Material Function (MF_Noise_Iterator) used to generate the complex volumetric look and WPO, noting that this function is called multiple times.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Increasing the Light Source Radius or Light Source Angle to try and soften the missing shadows, incorrectly assuming the light definition is too sharp.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "materialsshaders",
            "title": "Step 6",
            "prompt": "<p>Analyze the Material Function (MF_Noise_Iterator) and determine that it contains an expensive custom loop structure whose iteration count is controlled by a scalar parameter ('Iteration_Count').</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Analyze the Material Function (MF_Noise_Iterator) and determine that it contains an expensive custom loop structure whose iteration count is controlled by a scalar parameter ('Iteration_Count').</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.3hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Trying to solve the performance issue by disabling Ray Tracing in the Project Settings or Post Process Volume, which treats the symptom (slowness) but not the cause (expensive shader iteration and overdraw).</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "materialsshaders",
            "title": "Step 7",
            "prompt": "<p>Return to the Material Instance (MI_Volumetric_Cloud) and check the exposed parameter 'Iteration_Count', noting it is set to an excessively high value (e.g., 64 or 128).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Return to the Material Instance (MI_Volumetric_Cloud) and check the exposed parameter 'Iteration_Count', noting it is set to an excessively high value (e.g., 64 or 128).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Checking the mesh component's collision settings or trace channels, incorrectly assuming the shadow failure is due to a misconfigured trace setting.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "materialsshaders",
            "title": "Step 8",
            "prompt": "<p>Reduce the 'Iteration_Count' parameter in the Material Instance to a reasonable real-time value (e.g., 16 or 20) to solve the initial performance spike caused by excessive shader instructions.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Reduce the 'Iteration_Count' parameter in the Material Instance to a reasonable real-time value (e.g., 16 or 20) to solve the initial performance spike caused by excessive shader instructions.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Enabling 'Volumetric Translucent Shadows' in Project Settings without realizing that the custom material, due to WPO usage, requires a transition to Masked blend mode for reliable dynamic shadowing.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "materialsshaders",
            "title": "Step 9",
            "prompt": "<p>Return to M_Volumetric_Base. Since the material uses Translucent Blend Mode and WPO, enable the 'Output Velocity' flag in the Material Details under the Translucency section for proper motion vector generation.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Return to M_Volumetric_Base. Since the material uses Translucent Blend Mode and WPO, enable the 'Output Velocity' flag in the Material Details under the Translucency section for proper motion vector generation.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Increasing the Light Source Radius or Light Source Angle to try and soften the missing shadows, incorrectly assuming the light definition is too sharp.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "materialsshaders",
            "title": "Step 10",
            "prompt": "<p>To address the shadowing failure related to WPO, navigate to the Material Details panel (M_Volumetric_Base), General section, and check the box labeled 'Apply World Position Offset in Ray Tracing'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>To address the shadowing failure related to WPO, navigate to the Material Details panel (M_Volumetric_Base), General section, and check the box labeled 'Apply World Position Offset in Ray Tracing'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Trying to solve the performance issue by disabling Ray Tracing in the Project Settings or Post Process Volume, which treats the symptom (slowness) but not the cause (expensive shader iteration and overdraw).</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "materialsshaders",
            "title": "Step 11",
            "prompt": "<p>To fundamentally fix the overdraw and enable robust shadowing for the complex shape, change the Material's Blend Mode from 'Translucent' to 'Masked' (or Opaque if complexity allows).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>To fundamentally fix the overdraw and enable robust shadowing for the complex shape, change the Material's Blend Mode from 'Translucent' to 'Masked' (or Opaque if complexity allows).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Checking the mesh component's collision settings or trace channels, incorrectly assuming the shadow failure is due to a misconfigured trace setting.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "materialsshaders",
            "title": "Step 12",
            "prompt": "<p>Because the material is now Masked, we must replicate the soft fading edges. In the Material Graph, reroute the Opacity logic (which was previously connected to the Translucent Opacity input) through the 'DitherTemporalAA' node.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Because the material is now Masked, we must replicate the soft fading edges. In the Material Graph, reroute the Opacity logic (which was previously connected to the Translucent Opacity input) through the 'DitherTemporalAA' node.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.25hrs. Correct approach.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Enabling 'Volumetric Translucent Shadows' in Project Settings without realizing that the custom material, due to WPO usage, requires a transition to Masked blend mode for reliable dynamic shadowing.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "materialsshaders",
            "title": "Step 13",
            "prompt": "<p>Connect the output of the 'DitherTemporalAA' node to the 'Opacity Mask' input of the main material node, replacing the old Opacity connection.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Connect the output of the 'DitherTemporalAA' node to the 'Opacity Mask' input of the main material node, replacing the old Opacity connection.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Increasing the Light Source Radius or Light Source Angle to try and soften the missing shadows, incorrectly assuming the light definition is too sharp.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "materialsshaders",
            "title": "Step 14",
            "prompt": "<p>In the Material Details panel, locate the 'Masked' section and ensure 'Use Dithered Opacity' is checked (this setting is crucial when using DitherTemporalAA with Masked Blend Mode).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Material Details panel, locate the 'Masked' section and ensure 'Use Dithered Opacity' is checked (this setting is crucial when using DitherTemporalAA with Masked Blend Mode).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Trying to solve the performance issue by disabling Ray Tracing in the Project Settings or Post Process Volume, which treats the symptom (slowness) but not the cause (expensive shader iteration and overdraw).</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "materialsshaders",
            "title": "Step 15",
            "prompt": "<p>Use the 'Pixel Depth Offset' input (available on Opaque/Masked materials) to slightly offset the depth buffer based on the density calculation, improving shadowing quality near edges and blending the WPO changes more smoothly.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Use the 'Pixel Depth Offset' input (available on Opaque/Masked materials) to slightly offset the depth buffer based on the density calculation, improving shadowing quality near edges and blending the WPO changes more smoothly.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Checking the mesh component's collision settings or trace channels, incorrectly assuming the shadow failure is due to a misconfigured trace setting.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "materialsshaders",
            "title": "Step 16",
            "prompt": "<p>Recompile the material and verify in the 'Lit' view mode that dynamic self-shadowing is now correctly applied to the mesh.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Recompile the material and verify in the 'Lit' view mode that dynamic self-shadowing is now correctly applied to the mesh.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Enabling 'Volumetric Translucent Shadows' in Project Settings without realizing that the custom material, due to WPO usage, requires a transition to Masked blend mode for reliable dynamic shadowing.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "materialsshaders",
            "title": "Step 17",
            "prompt": "<p>Return to the 'Shader Complexity' view mode and confirm the shader is now rendering in green/yellow, signifying a massively reduced instruction count and fixing the performance hit.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Return to the 'Shader Complexity' view mode and confirm the shader is now rendering in green/yellow, signifying a massively reduced instruction count and fixing the performance hit.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Increasing the Light Source Radius or Light Source Angle to try and soften the missing shadows, incorrectly assuming the light definition is too sharp.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-17"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario.</p>",
            "choices": []
        }
    }
};
