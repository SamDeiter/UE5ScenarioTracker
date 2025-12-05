window.SCENARIOS['lumen_gi_failure'] = {
    "meta": {
        "title": "Lumen GI Loss of Contribution from Distant Emissive Mesh",
        "description": "A futuristic environment features a large, highly emissive sci-fi panel that uses a complex material. When the player stands very close to the panel, it correctly casts soft, vibrant global illumination (GI) onto nearby surfaces. However, as the player moves back 50 meters or more, the GI contribution from this panel completely vanishes, making the overall scene significantly darker. The panel itself still appears bright due to its direct emissive color, but it behaves as if it's not contributing any light bounces or ambient influence to the rest of the environment or reflections. The scene is configured to use Lumen for Global Illumination.",
        "estimateHours": 3.25,
        "difficulty": "Intermediate",
        "category": "Lighting & Rendering"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "lumen",
            "title": "Step 1",
            "prompt": "<p>Open the Level Viewport and activate the 'Lumen Scene' visualization mode (Show > Visualize > Lumen Scene) to diagnose how the mesh is represented for GI calculations.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Open the Level Viewport and activate the 'Lumen Scene' visualization mode (Show > Visualize > Lumen Scene) to diagnose how the mesh is represented for GI calculations.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-2"
                },
                {
                    "text": "Attempt: Attempting to solve the issue by drastically increasing the overall Post Process Volume Exposure compensation (e.g., 'Min/Max Brightness') instead of fixing the source light contribution.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.75 hrs lost.",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "lumen",
            "title": "Step 2",
            "prompt": "<p>Observe the representation of the large emissive panel in the Lumen Scene visualization; note that its distance field representation might be too sparse or completely missing when viewed from a distance.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Observe the representation of the large emissive panel in the Lumen Scene visualization; note that its distance field representation might be too sparse or completely missing when viewed from a distance.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-3"
                },
                {
                    "text": "Attempt: Adding point lights or spot lights near the emissive panel to fake GI, which defeats the purpose of accurate Lumen contribution.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.5 hrs lost.",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "lumen",
            "title": "Step 3",
            "prompt": "<p>Select the static mesh actor using the problematic emissive material in the Outliner.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Select the static mesh actor using the problematic emissive material in the Outliner.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-4"
                },
                {
                    "text": "Attempt: Checking the Directional Light and Sky Light intensities, mistakenly believing the overall ambient light level is the cause.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.25 hrs lost.",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "lumen",
            "title": "Step 4",
            "prompt": "<p>In the Details panel for the mesh component, navigate to the Lighting section and verify that 'Affect Global Illumination' is checked.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: In the Details panel for the mesh component, navigate to the Lighting section and verify that 'Affect Global Illumination' is checked.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-5"
                },
                {
                    "text": "Attempt: Toggling 'Generate Mesh Distance Fields' in Project Settings without realizing this requires a full editor restart and is typically a project-level setting that shouldn't be touched during routine debugging.",
                    "type": "wrong",
                    "feedback": "Incorrect. 1 hrs lost.",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "lumen",
            "title": "Step 5",
            "prompt": "<p>Open the associated Parent Material asset used on the panel.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Open the associated Parent Material asset used on the panel.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-6"
                },
                {
                    "text": "Attempt: Attempting to solve the issue by drastically increasing the overall Post Process Volume Exposure compensation (e.g., 'Min/Max Brightness') instead of fixing the source light contribution.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.75 hrs lost.",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "lumen",
            "title": "Step 6",
            "prompt": "<p>In the Material Details panel (not the graph), locate the 'Usage' section and ensure the specific flag 'Use Emissive for Global Illumination' is checked. This flag is crucial for complex materials to contribute GI correctly.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: In the Material Details panel (not the graph), locate the 'Usage' section and ensure the specific flag 'Use Emissive for Global Illumination' is checked. This flag is crucial for complex materials to contribute GI correctly.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-7"
                },
                {
                    "text": "Attempt: Adding point lights or spot lights near the emissive panel to fake GI, which defeats the purpose of accurate Lumen contribution.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.5 hrs lost.",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "lumen",
            "title": "Step 7",
            "prompt": "<p>Verify the emissive output in the Material graph. Ensure the final Emissive Color node output is clamped to a reasonable range (e.g., using a Clamp node) to prevent numerical instability, which can confuse Lumen's surface cache generation.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Verify the emissive output in the Material graph. Ensure the final Emissive Color node output is clamped to a reasonable range (e.g., using a Clamp node) to prevent numerical instability, which can confuse Lumen's surface cache generation.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-8"
                },
                {
                    "text": "Attempt: Checking the Directional Light and Sky Light intensities, mistakenly believing the overall ambient light level is the cause.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.25 hrs lost.",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "lumen",
            "title": "Step 8",
            "prompt": "<p>Apply and save the updated Material, and return to the level view.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Apply and save the updated Material, and return to the level view.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-9"
                },
                {
                    "text": "Attempt: Toggling 'Generate Mesh Distance Fields' in Project Settings without realizing this requires a full editor restart and is typically a project-level setting that shouldn't be touched during routine debugging.",
                    "type": "wrong",
                    "feedback": "Incorrect. 1 hrs lost.",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "lumen",
            "title": "Step 9",
            "prompt": "<p>Re-examine the mesh details panel in the level, looking for the 'Static Mesh Settings' subsection under the Mesh component.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Re-examine the mesh details panel in the level, looking for the 'Static Mesh Settings' subsection under the Mesh component.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-10"
                },
                {
                    "text": "Attempt: Attempting to solve the issue by drastically increasing the overall Post Process Volume Exposure compensation (e.g., 'Min/Max Brightness') instead of fixing the source light contribution.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.75 hrs lost.",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "lumen",
            "title": "Step 10",
            "prompt": "<p>Increase the 'Emissive Light Source Contribution' multiplier on the static mesh component from 1.0 to 5.0 to ensure the contribution isn't just capped too low by default.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Increase the 'Emissive Light Source Contribution' multiplier on the static mesh component from 1.0 to 5.0 to ensure the contribution isn't just capped too low by default.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-11"
                },
                {
                    "text": "Attempt: Adding point lights or spot lights near the emissive panel to fake GI, which defeats the purpose of accurate Lumen contribution.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.5 hrs lost.",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "lumen",
            "title": "Step 11",
            "prompt": "<p>Locate the 'Distance Field Resolution Scale' property on the static mesh component and slightly increase it (e.g., from 1.0 to 1.5) to ensure a more detailed distance field representation for better Lumen scene coverage.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Locate the 'Distance Field Resolution Scale' property on the static mesh component and slightly increase it (e.g., from 1.0 to 1.5) to ensure a more detailed distance field representation for better Lumen scene coverage.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-12"
                },
                {
                    "text": "Attempt: Checking the Directional Light and Sky Light intensities, mistakenly believing the overall ambient light level is the cause.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.25 hrs lost.",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "lumen",
            "title": "Step 12",
            "prompt": "<p>If the mesh uses Nanite, check the Nanite settings on the mesh asset itself and verify that 'Preserve Area' is enabled, which helps preserve the mesh's surface details for GI calculation.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: If the mesh uses Nanite, check the Nanite settings on the mesh asset itself and verify that 'Preserve Area' is enabled, which helps preserve the mesh's surface details for GI calculation.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-13"
                },
                {
                    "text": "Attempt: Toggling 'Generate Mesh Distance Fields' in Project Settings without realizing this requires a full editor restart and is typically a project-level setting that shouldn't be touched during routine debugging.",
                    "type": "wrong",
                    "feedback": "Incorrect. 1 hrs lost.",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "lumen",
            "title": "Step 13",
            "prompt": "<p>Open Project Settings (Edit > Project Settings) under Rendering > Global Illumination.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Open Project Settings (Edit > Project Settings) under Rendering > Global Illumination.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-14"
                },
                {
                    "text": "Attempt: Attempting to solve the issue by drastically increasing the overall Post Process Volume Exposure compensation (e.g., 'Min/Max Brightness') instead of fixing the source light contribution.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.75 hrs lost.",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "lumen",
            "title": "Step 14",
            "prompt": "<p>Locate the Lumen settings block and find the 'Lumen Scene View Distance' property.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Locate the Lumen settings block and find the 'Lumen Scene View Distance' property.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-15"
                },
                {
                    "text": "Attempt: Adding point lights or spot lights near the emissive panel to fake GI, which defeats the purpose of accurate Lumen contribution.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.5 hrs lost.",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "lumen",
            "title": "Step 15",
            "prompt": "<p>Increase the 'Lumen Scene View Distance' (default usually 5000) to a much higher value, such as 25000 units, to ensure the distant large emissive source is always included in the calculation boundary.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Increase the 'Lumen Scene View Distance' (default usually 5000) to a much higher value, such as 25000 units, to ensure the distant large emissive source is always included in the calculation boundary.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-16"
                },
                {
                    "text": "Attempt: Checking the Directional Light and Sky Light intensities, mistakenly believing the overall ambient light level is the cause.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.25 hrs lost.",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "lumen",
            "title": "Step 16",
            "prompt": "<p>Find the main Post Process Volume affecting the scene.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Find the main Post Process Volume affecting the scene.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-17"
                },
                {
                    "text": "Attempt: Toggling 'Generate Mesh Distance Fields' in Project Settings without realizing this requires a full editor restart and is typically a project-level setting that shouldn't be touched during routine debugging.",
                    "type": "wrong",
                    "feedback": "Incorrect. 1 hrs lost.",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "lumen",
            "title": "Step 17",
            "prompt": "<p>Under the Global Illumination category in the Post Process Volume, check the 'Final Gather Quality' setting and increase it from 1.0 to 2.0 to ensure higher fidelity light bouncing from complex surfaces.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Under the Global Illumination category in the Post Process Volume, check the 'Final Gather Quality' setting and increase it from 1.0 to 2.0 to ensure higher fidelity light bouncing from complex surfaces.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-18"
                },
                {
                    "text": "Attempt: Attempting to solve the issue by drastically increasing the overall Post Process Volume Exposure compensation (e.g., 'Min/Max Brightness') instead of fixing the source light contribution.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.75 hrs lost.",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "lumen",
            "title": "Step 18",
            "prompt": "<p>Verify the GI method: If the project supports Hardware Ray Tracing, ensure the GI Method in Project Settings is explicitly set to 'Lumen (Hardware Ray Tracing)' for better large-scale GI accuracy and performance compared to Software Ray Tracing.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Verify the GI method: If the project supports Hardware Ray Tracing, ensure the GI Method in Project Settings is explicitly set to 'Lumen (Hardware Ray Tracing)' for better large-scale GI accuracy and performance compared to Software Ray Tracing.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "conclusion"
                },
                {
                    "text": "Attempt: Adding point lights or spot lights near the emissive panel to fake GI, which defeats the purpose of accurate Lumen contribution.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.5 hrs lost.",
                    "next": "step-18"
                }
            ]
        },
        "conclusion": {
            "skill": "lumen",
            "title": "Scenario Complete",
            "prompt": "<p>You have successfully resolved the issue!</p>",
            "choices": []
        }
    }
};