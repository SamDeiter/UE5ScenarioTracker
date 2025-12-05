window.SCENARIOS['DecalTextureAlphaMaskFailure'] = {
    "meta": {
        "title": "Deferred Decal Material Renders as Solid Opaque White Square",
        "description": "A newly implemented Deferred Decal material, intended to display a scorch mark using the texture's alpha channel for opacity masking, is failing. When the decal actor is placed on any surface, it renders as a completely solid, fully opaque, bright white square that obscures the underlying geometry texture, regardless of the Decal Material parameters set in the Material Instance. The visual result suggests the opacity mask is being ignored or treated as 1.0 everywhere.",
        "estimateHours": 1.45,
        "category": "Materials & Shaders"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "materialsshaders",
            "title": "Step 1",
            "prompt": "<p>Select the Decal Actor in the level and verify the 'Decal Material' slot is correctly assigned to the Material Instance (MI_ScorchMark_Decal).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select the Decal Actor in the level and verify the 'Decal Material' slot is correctly assigned to the Material Instance (MI_ScorchMark_Decal).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Changing the 'Decal Blend Mode' property on the Decal Actor component itself (this controls projection method, not material output blending).</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "materialsshaders",
            "title": "Step 2",
            "prompt": "<p>Open the Material Instance (MI_ScorchMark_Decal) and verify that the Base Color and Opacity Mask Texture parameters are correctly pointing to T_ScorchMask_Alpha.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Material Instance (MI_ScorchMark_Decal) and verify that the Base Color and Opacity Mask Texture parameters are correctly pointing to T_ScorchMask_Alpha.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Changing the Base Material Blend Mode from 'Masked' to 'Translucent' without solving the texture alpha issue, which introduces incorrect lighting and sorting artifacts.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.45hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "materialsshaders",
            "title": "Step 3",
            "prompt": "<p>In the Material Instance, locate and open the Parent Material (M_Base_Decal_Deferred).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Material Instance, locate and open the Parent Material (M_Base_Decal_Deferred).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Trying to force transparency using a constant value plugged into the opacity mask input in the material graph, rather than checking the input texture asset configuration.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "materialsshaders",
            "title": "Step 4",
            "prompt": "<p>In the Parent Material, verify the 'Material Domain' is set to 'Deferred Decal'. (This should be correct, but must be checked).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Parent Material, verify the 'Material Domain' is set to 'Deferred Decal'. (This should be correct, but must be checked).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Replacing the base color texture parameter in the Material Instance with a completely different texture asset, wasting time confirming the parameter system works.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "materialsshaders",
            "title": "Step 5",
            "prompt": "<p>In the Parent Material, verify the 'Blend Mode' is set to 'Masked'. (If it were Translucent, the color would be affected, but the problem states it is solid white and opaque).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Parent Material, verify the 'Blend Mode' is set to 'Masked'. (If it were Translucent, the color would be affected, but the problem states it is solid white and opaque).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Changing the 'Decal Blend Mode' property on the Decal Actor component itself (this controls projection method, not material output blending).</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "materialsshaders",
            "title": "Step 6",
            "prompt": "<p>Examine the Material Graph to ensure the Opacity Mask input is correctly receiving the alpha output (A) from the Texture Sample Parameter used for the T_ScorchMask_Alpha texture.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Examine the Material Graph to ensure the Opacity Mask input is correctly receiving the alpha output (A) from the Texture Sample Parameter used for the T_ScorchMask_Alpha texture.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Changing the Base Material Blend Mode from 'Masked' to 'Translucent' without solving the texture alpha issue, which introduces incorrect lighting and sorting artifacts.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.45hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "materialsshaders",
            "title": "Step 7",
            "prompt": "<p>Confirm the 'Opacity Mask Clip Value' is set to a reasonable non-zero value (e.g., 0.333), as this is required for Masked blend mode.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Confirm the 'Opacity Mask Clip Value' is set to a reasonable non-zero value (e.g., 0.333), as this is required for Masked blend mode.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Trying to force transparency using a constant value plugged into the opacity mask input in the material graph, rather than checking the input texture asset configuration.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "materialsshaders",
            "title": "Step 8",
            "prompt": "<p>Since the material graph logic appears sound, identify and open the actual texture asset (T_ScorchMask_Alpha) in the Texture Editor.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Since the material graph logic appears sound, identify and open the actual texture asset (T_ScorchMask_Alpha) in the Texture Editor.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Replacing the base color texture parameter in the Material Instance with a completely different texture asset, wasting time confirming the parameter system works.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "materialsshaders",
            "title": "Step 9",
            "prompt": "<p>Verify the texture is being sampled correctly by checking the 'Source Texture' properties and confirming that the alpha channel is present in the imported source file (usually visible in the Texture Editor preview channels).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify the texture is being sampled correctly by checking the 'Source Texture' properties and confirming that the alpha channel is present in the imported source file (usually visible in the Texture Editor preview channels).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Changing the 'Decal Blend Mode' property on the Decal Actor component itself (this controls projection method, not material output blending).</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "materialsshaders",
            "title": "Step 10",
            "prompt": "<p>In the Texture Editor Details panel, check the 'Compression Settings' property. The current setting is likely 'Default (DXT1/5)'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Texture Editor Details panel, check the 'Compression Settings' property. The current setting is likely 'Default (DXT1/5)'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Changing the Base Material Blend Mode from 'Masked' to 'Translucent' without solving the texture alpha issue, which introduces incorrect lighting and sorting artifacts.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.45hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "materialsshaders",
            "title": "Step 11",
            "prompt": "<p>Change the 'Compression Settings' from 'Default' to 'Masks (No SRGB)' or 'UserInterface2D (BC7)' to ensure the alpha channel data is preserved accurately and linearly, as masked opacity relies on binary/linear data.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Change the 'Compression Settings' from 'Default' to 'Masks (No SRGB)' or 'UserInterface2D (BC7)' to ensure the alpha channel data is preserved accurately and linearly, as masked opacity relies on binary/linear data.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Trying to force transparency using a constant value plugged into the opacity mask input in the material graph, rather than checking the input texture asset configuration.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "materialsshaders",
            "title": "Step 12",
            "prompt": "<p>Crucially, locate the 'sRGB' checkbox in the Texture Editor. Since this texture is being used purely as a data mask (not for color display), uncheck 'sRGB'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Crucially, locate the 'sRGB' checkbox in the Texture Editor. Since this texture is being used purely as a data mask (not for color display), uncheck 'sRGB'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Replacing the base color texture parameter in the Material Instance with a completely different texture asset, wasting time confirming the parameter system works.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "materialsshaders",
            "title": "Step 13",
            "prompt": "<p>Save the changes to the texture asset (T_ScorchMask_Alpha). This forces a re-import and re-compression of the texture data.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Save the changes to the texture asset (T_ScorchMask_Alpha). This forces a re-import and re-compression of the texture data.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Changing the 'Decal Blend Mode' property on the Decal Actor component itself (this controls projection method, not material output blending).</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "materialsshaders",
            "title": "Step 14",
            "prompt": "<p>Return to the level viewport and verify the Decal Material now blends correctly, using the texture's alpha channel for opacity, resulting in a scorch mark instead of a white square.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Return to the level viewport and verify the Decal Material now blends correctly, using the texture's alpha channel for opacity, resulting in a scorch mark instead of a white square.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Changing the Base Material Blend Mode from 'Masked' to 'Translucent' without solving the texture alpha issue, which introduces incorrect lighting and sorting artifacts.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.45hrs. This approach wastes time.</p>",
                    "next": "step-14"
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
