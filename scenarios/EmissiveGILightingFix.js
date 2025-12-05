window.SCENARIOS['EmissiveGILightingFix'] = {
    "meta": {
        "title": "Missing Lumen Global Illumination from Emissive Materials",
        "description": "The scene contains several custom meshes textured with a powerful emissive material (acting as futuristic wall lights). While the materials themselves glow brightly when viewed directly, they cast absolutely no dynamic light or bounce light onto nearby static geometry, even though Lumen Global Illumination is enabled. If the primary Directional Light is disabled, the level becomes completely dark, proving the emissive sources are not being registered as light contributors. The intent is for the emissive material to provide soft, dynamic indirect lighting.",
        "estimateHours": 1.75,
        "category": "Lighting & Rendering"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "lightingrendering",
            "title": "Step 1",
            "prompt": "<p>Verify the project is using a compatible rendering method. Navigate to Project Settings > Rendering > Dynamic Global Illumination Method and confirm it is set to 'Lumen'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify the project is using a compatible rendering method. Navigate to Project Settings > Rendering > Dynamic Global Illumination Method and confirm it is set to 'Lumen'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Attempting to solve the issue by adjusting the Sky Light or Directional Light intensity, which are unrelated to the emissive material GI contribution.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "lightingrendering",
            "title": "Step 2",
            "prompt": "<p>Verify the project is using a compatible reflection method. Navigate to Project Settings > Rendering > Reflection Method and confirm it is set to 'Lumen'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify the project is using a compatible reflection method. Navigate to Project Settings > Rendering > Reflection Method and confirm it is set to 'Lumen'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Changing the material blend mode to 'Translucent' or 'Masked', which often disables the ability for the material to contribute to Lumen Global Illumination, compounding the original issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "lightingrendering",
            "title": "Step 3",
            "prompt": "<p>Open the material used for the lighting meshes (e.g., M_NeonStrip). Check that the 'Shading Model' in the Material Details panel is set to 'Default Lit'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the material used for the lighting meshes (e.g., M_NeonStrip). Check that the 'Shading Model' in the Material Details panel is set to 'Default Lit'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.08hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Placing a standard Point Light adjacent to the emissive object and setting its 'Visibility' to false in an attempt to fake the lighting effect, bypassing the necessary Emissive GI pipeline fix.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "lightingrendering",
            "title": "Step 4",
            "prompt": "<p>In the Material Details panel, under the 'Lighting' category, ensure the flag 'Use Emissive for Dynamic Area Lighting' is checked.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Material Details panel, under the 'Lighting' category, ensure the flag 'Use Emissive for Dynamic Area Lighting' is checked.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.08hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Attempting to manually build lighting (Build > Build Lighting Only), as Lumen is a dynamic GI system and baked lighting is irrelevant to this specific problem.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "lightingrendering",
            "title": "Step 5",
            "prompt": "<p>Verify the Emissive color intensity in the material graph is connected to the 'Emissive Color' output and is sufficiently high (e.g., multiplied by a Scalar Parameter with a value of 50.0 or more).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify the Emissive color intensity in the material graph is connected to the 'Emissive Color' output and is sufficiently high (e.g., multiplied by a Scalar Parameter with a value of 50.0 or more).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.07hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Attempting to solve the issue by adjusting the Sky Light or Directional Light intensity, which are unrelated to the emissive material GI contribution.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "lightingrendering",
            "title": "Step 6",
            "prompt": "<p>Select the Static Mesh Actor (SM_WallLight) in the level viewport. Check the Details panel for the 'Static Mesh' component.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select the Static Mesh Actor (SM_WallLight) in the level viewport. Check the Details panel for the 'Static Mesh' component.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.04hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Changing the material blend mode to 'Translucent' or 'Masked', which often disables the ability for the material to contribute to Lumen Global Illumination, compounding the original issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "lightingrendering",
            "title": "Step 7",
            "prompt": "<p>In the mesh component details, search for 'Lighting'. Ensure 'Cast Shadows' is checked for the mesh component, as Lumen GI often requires this for contribution, even if the shadow is soft or minor.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the mesh component details, search for 'Lighting'. Ensure 'Cast Shadows' is checked for the mesh component, as Lumen GI often requires this for contribution, even if the shadow is soft or minor.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.07hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Placing a standard Point Light adjacent to the emissive object and setting its 'Visibility' to false in an attempt to fake the lighting effect, bypassing the necessary Emissive GI pipeline fix.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "lightingrendering",
            "title": "Step 8",
            "prompt": "<p>Locate the Post Process Volume in the level (or add a new infinite one if missing).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate the Post Process Volume in the level (or add a new infinite one if missing).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Attempting to manually build lighting (Build > Build Lighting Only), as Lumen is a dynamic GI system and baked lighting is irrelevant to this specific problem.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "lightingrendering",
            "title": "Step 9",
            "prompt": "<p>In the Post Process Volume, enable the 'Global Illumination' category override.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Post Process Volume, enable the 'Global Illumination' category override.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Attempting to solve the issue by adjusting the Sky Light or Directional Light intensity, which are unrelated to the emissive material GI contribution.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "lightingrendering",
            "title": "Step 10",
            "prompt": "<p>Under Global Illumination, ensure 'Method' is explicitly set to 'Lumen'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Under Global Illumination, ensure 'Method' is explicitly set to 'Lumen'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Changing the material blend mode to 'Translucent' or 'Masked', which often disables the ability for the material to contribute to Lumen Global Illumination, compounding the original issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "lightingrendering",
            "title": "Step 11",
            "prompt": "<p>Under Global Illumination > Lumen, check the 'Emissive Light Contribution' slider and ensure it is set to 1.0 (or higher if the scene requires a boost).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Under Global Illumination > Lumen, check the 'Emissive Light Contribution' slider and ensure it is set to 1.0 (or higher if the scene requires a boost).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Placing a standard Point Light adjacent to the emissive object and setting its 'Visibility' to false in an attempt to fake the lighting effect, bypassing the necessary Emissive GI pipeline fix.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "lightingrendering",
            "title": "Step 12",
            "prompt": "<p>Under Global Illumination > Lumen, confirm 'Final Gather Quality' is set to a reasonable value (e.g., 2.0 or 3.0) for better light integration.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Under Global Illumination > Lumen, confirm 'Final Gather Quality' is set to a reasonable value (e.g., 2.0 or 3.0) for better light integration.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.06hrs. Correct approach.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Attempting to manually build lighting (Build > Build Lighting Only), as Lumen is a dynamic GI system and baked lighting is irrelevant to this specific problem.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "lightingrendering",
            "title": "Step 13",
            "prompt": "<p>Review the mesh UVs: open the Static Mesh Editor for SM_WallLight and ensure UV Channel 0 (used for lightmap/GI sampling) is appropriately unwrapped without overlapping regions.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Review the mesh UVs: open the Static Mesh Editor for SM_WallLight and ensure UV Channel 0 (used for lightmap/GI sampling) is appropriately unwrapped without overlapping regions.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Attempting to solve the issue by adjusting the Sky Light or Directional Light intensity, which are unrelated to the emissive material GI contribution.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "lightingrendering",
            "title": "Step 14",
            "prompt": "<p>Back in the level, adjust the 'Emissive Light Source: Scale' property on the mesh component. If the scale is 0, Lumen may ignore the source, so set it to 1.0 or higher.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Back in the level, adjust the 'Emissive Light Source: Scale' property on the mesh component. If the scale is 0, Lumen may ignore the source, so set it to 1.0 or higher.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Changing the material blend mode to 'Translucent' or 'Masked', which often disables the ability for the material to contribute to Lumen Global Illumination, compounding the original issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "lightingrendering",
            "title": "Step 15",
            "prompt": "<p>Search the Project Settings (Rendering) for the 'Lumen Global Illumination' section.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Search the Project Settings (Rendering) for the 'Lumen Global Illumination' section.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.04hrs. Correct approach.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Placing a standard Point Light adjacent to the emissive object and setting its 'Visibility' to false in an attempt to fake the lighting effect, bypassing the necessary Emissive GI pipeline fix.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "lightingrendering",
            "title": "Step 16",
            "prompt": "<p>Ensure the setting 'Hardware Ray Tracing' is set to 'Enabled' or 'Support Global Illumination and Reflections' if the project targets high-end PCs (to ensure maximum path support for emissive GI).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Ensure the setting 'Hardware Ray Tracing' is set to 'Enabled' or 'Support Global Illumination and Reflections' if the project targets high-end PCs (to ensure maximum path support for emissive GI).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.07hrs. Correct approach.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Attempting to manually build lighting (Build > Build Lighting Only), as Lumen is a dynamic GI system and baked lighting is irrelevant to this specific problem.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "lightingrendering",
            "title": "Step 17",
            "prompt": "<p>If using Software Ray Tracing, ensure the 'Software Ray Tracing Mode' is set to 'Global' for proper Scene Trace coverage.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>If using Software Ray Tracing, ensure the 'Software Ray Tracing Mode' is set to 'Global' for proper Scene Trace coverage.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.07hrs. Correct approach.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Attempting to solve the issue by adjusting the Sky Light or Directional Light intensity, which are unrelated to the emissive material GI contribution.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "lightingrendering",
            "title": "Step 18",
            "prompt": "<p>Open the console (~) and type 'r.Lumen.EmissiveRadiance 1' to ensure emissive contribution calculation is enabled at the engine level (it should be 1 by default, but verify).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the console (~) and type 'r.Lumen.EmissiveRadiance 1' to ensure emissive contribution calculation is enabled at the engine level (it should be 1 by default, but verify).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Changing the material blend mode to 'Translucent' or 'Masked', which often disables the ability for the material to contribute to Lumen Global Illumination, compounding the original issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "lightingrendering",
            "title": "Step 19",
            "prompt": "<p>Type 'r.Lumen.EmissiveLightSourceSurfaceCacheResolution 1' into the console to verify that the surface cache resolution is sufficient for the small light sources.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Type 'r.Lumen.EmissiveLightSourceSurfaceCacheResolution 1' into the console to verify that the surface cache resolution is sufficient for the small light sources.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Placing a standard Point Light adjacent to the emissive object and setting its 'Visibility' to false in an attempt to fake the lighting effect, bypassing the necessary Emissive GI pipeline fix.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-19"
                }
            ]
        },
        "step-20": {
            "skill": "lightingrendering",
            "title": "Step 20",
            "prompt": "<p>Check the Material Instance applied to the mesh to ensure no parameter (like Emissive Multiplier) was overridden and set back to zero accidentally in the instance.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Check the Material Instance applied to the mesh to ensure no parameter (like Emissive Multiplier) was overridden and set back to zero accidentally in the instance.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.08hrs. Correct approach.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Attempting to manually build lighting (Build > Build Lighting Only), as Lumen is a dynamic GI system and baked lighting is irrelevant to this specific problem.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-20"
                }
            ]
        },
        "step-21": {
            "skill": "lightingrendering",
            "title": "Step 21",
            "prompt": "<p>Hit 'Build' > 'Build Reflection Captures' to update indirect lighting cache, although Lumen is dynamic, sometimes this helps reset certain visualization aspects.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Hit 'Build' > 'Build Reflection Captures' to update indirect lighting cache, although Lumen is dynamic, sometimes this helps reset certain visualization aspects.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-22"
                },
                {
                    "text": "<p>Attempting to solve the issue by adjusting the Sky Light or Directional Light intensity, which are unrelated to the emissive material GI contribution.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-21"
                }
            ]
        },
        "step-22": {
            "skill": "lightingrendering",
            "title": "Step 22",
            "prompt": "<p>Save the level, close the editor, restart UE5, and reload the level to clear any potential transient rendering bugs.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Save the level, close the editor, restart UE5, and reload the level to clear any potential transient rendering bugs.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.08hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Changing the material blend mode to 'Translucent' or 'Masked', which often disables the ability for the material to contribute to Lumen Global Illumination, compounding the original issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-22"
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
