window.SCENARIOS['BlackMaterialDueToEmissiveMiswiring'] = {
    "meta": {
        "title": "Lit Material Renders Pure Black in Scene",
        "description": "A newly created master material (M_Master_Rock) intended for a PBR static mesh rock appears completely black in the main level viewport, regardless of how intense the surrounding lighting (Point Lights, Sky Light, Directional Light) is. The rock object is correctly set to 'Movable' and 'Cast Shadows'. When viewing the material preview sphere inside the Material Editor, the material looks perfectly correct, reflecting light and displaying texture detail, and the Shading Model is confirmed to be 'Default Lit'.",
        "estimateHours": 0.7,
        "category": "Materials & Shaders"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "materialsshaders",
            "title": "Step 1",
            "prompt": "<p>Select the black Static Mesh Actor in the Level Editor to verify the assigned material instance (MI_Rock_A).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select the black Static Mesh Actor in the Level Editor to verify the assigned material instance (MI_Rock_A).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.01hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Checking the Mesh Component's 'Hidden in Game' or 'Visible' flags in the Details panel.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.05hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "materialsshaders",
            "title": "Step 2",
            "prompt": "<p>Double-click the Material Instance (MI_Rock_A) and use the 'Go to Parent Material' button to open M_Master_Rock.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Double-click the Material Instance (MI_Rock_A) and use the 'Go to Parent Material' button to open M_Master_Rock.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Changing the material Blend Mode from 'Opaque' to 'Masked' or 'Translucent'.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "materialsshaders",
            "title": "Step 3",
            "prompt": "<p>Inspect the Material Details panel (left side) to confirm the Shading Model is indeed 'Default Lit' and the Blend Mode is 'Opaque'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Inspect the Material Details panel (left side) to confirm the Shading Model is indeed 'Default Lit' and the Blend Mode is 'Opaque'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Adding extra light sources or increasing the intensity of existing scene lights unnecessarily.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "materialsshaders",
            "title": "Step 4",
            "prompt": "<p>Examine the final output connection nodes leading into the Material's Main Attributes output node.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Examine the final output connection nodes leading into the Material's Main Attributes output node.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.02hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Applying a brand new, default material to the mesh to 'confirm the mesh isn't broken', wasting time on replacing the material setup.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "materialsshaders",
            "title": "Step 5",
            "prompt": "<p>Identify the primary PBR network (texture samplers combined with color/scalar parameters) intended to define the visual color.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Identify the primary PBR network (texture samplers combined with color/scalar parameters) intended to define the visual color.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.04hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Checking the Mesh Component's 'Hidden in Game' or 'Visible' flags in the Details panel.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.05hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "materialsshaders",
            "title": "Step 6",
            "prompt": "<p>Trace the wire outputting the calculated color from this PBR network.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Trace the wire outputting the calculated color from this PBR network.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.06hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Changing the material Blend Mode from 'Opaque' to 'Masked' or 'Translucent'.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "materialsshaders",
            "title": "Step 7",
            "prompt": "<p>Observe that this PBR network is incorrectly connected to the 'Emissive Color' input of the main material node.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Observe that this PBR network is incorrectly connected to the 'Emissive Color' input of the main material node.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.04hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Adding extra light sources or increasing the intensity of existing scene lights unnecessarily.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "materialsshaders",
            "title": "Step 8",
            "prompt": "<p>Observe that the 'Base Color' input is currently disconnected (or driven by a constant zero).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Observe that the 'Base Color' input is currently disconnected (or driven by a constant zero).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.04hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Applying a brand new, default material to the mesh to 'confirm the mesh isn't broken', wasting time on replacing the material setup.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "materialsshaders",
            "title": "Step 9",
            "prompt": "<p>Understand that since the PBR calculation is driving Emissive Color, and Emissive Color is only visible when the Base Color is non-zero, the material is likely calculating a zero Base Color, resulting in a black output in the scene (even if the Emissive is non-zero, it is being masked out by the lack of Base Color in a Lit shader, or the Emissive output itself is not bright enough to overcome the scene darkness).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Understand that since the PBR calculation is driving Emissive Color, and Emissive Color is only visible when the Base Color is non-zero, the material is likely calculating a zero Base Color, resulting in a black output in the scene (even if the Emissive is non-zero, it is being masked out by the lack of Base Color in a Lit shader, or the Emissive output itself is not bright enough to overcome the scene darkness).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Checking the Mesh Component's 'Hidden in Game' or 'Visible' flags in the Details panel.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.05hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "materialsshaders",
            "title": "Step 10",
            "prompt": "<p>Disconnect the PBR network wire from the 'Emissive Color' input.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Disconnect the PBR network wire from the 'Emissive Color' input.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.04hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Changing the material Blend Mode from 'Opaque' to 'Masked' or 'Translucent'.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "materialsshaders",
            "title": "Step 11",
            "prompt": "<p>Reconnect the exact same PBR network output to the 'Base Color' input instead.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Reconnect the exact same PBR network output to the 'Base Color' input instead.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.06hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Adding extra light sources or increasing the intensity of existing scene lights unnecessarily.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "materialsshaders",
            "title": "Step 12",
            "prompt": "<p>Verify that the 'Emissive Color' input is now correctly disconnected (or driven by a constant black/zero if necessary).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify that the 'Emissive Color' input is now correctly disconnected (or driven by a constant black/zero if necessary).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Applying a brand new, default material to the mesh to 'confirm the mesh isn't broken', wasting time on replacing the material setup.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "materialsshaders",
            "title": "Step 13",
            "prompt": "<p>Verify the Roughness, Metallic, and Normal inputs are still connected correctly to ensure PBR calculations remain intact.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify the Roughness, Metallic, and Normal inputs are still connected correctly to ensure PBR calculations remain intact.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Checking the Mesh Component's 'Hidden in Game' or 'Visible' flags in the Details panel.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.05hrs. This approach wastes time.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "materialsshaders",
            "title": "Step 14",
            "prompt": "<p>Click 'Apply' and 'Save' the M_Master_Rock material and wait for compilation to complete.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Click 'Apply' and 'Save' the M_Master_Rock material and wait for compilation to complete.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Changing the material Blend Mode from 'Opaque' to 'Masked' or 'Translucent'.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "materialsshaders",
            "title": "Step 15",
            "prompt": "<p>Return to the Level Editor and confirm the static mesh now renders correctly with proper lighting interaction and color.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Return to the Level Editor and confirm the static mesh now renders correctly with proper lighting interaction and color.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.09hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Adding extra light sources or increasing the intensity of existing scene lights unnecessarily.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-15"
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
