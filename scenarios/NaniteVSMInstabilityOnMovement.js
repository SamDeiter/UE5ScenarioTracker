window.SCENARIOS['NaniteVSMInstabilityOnMovement'] = {
    "meta": {
        "title": "Dynamic Nanite Geometry Flickering and Blocky VSM Shadows on Rapid Camera Movement",
        "description": "In a highly detailed, large interior environment using Lumen Global Illumination, two distinct rendering artifacts occur specifically when the camera is moved quickly:\r\n1. The Nanite-enabled tiled floor material exhibits severe flickering (patches of pure white or black) when viewed from intermediate distances.\r\n2. The high-poly Nanite geometric wall molding casts extremely blocky, low-resolution shadows that jump and update visibly as the camera speeds up. The blockiness persists even at high-end scalability settings. Both issues disappear when the camera is completely static.",
        "estimateHours": 3,
        "category": "Lighting & Rendering"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "lightingrendering",
            "title": "Step 1",
            "prompt": "<p>Use the console command 'stat virtualshadowmap' to confirm VSM is active and check the 'Page Pool Used' metric. If utilization is very high (near 100%), insufficient VSM resources are likely the cause of the blocky shadows.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Use the console command 'stat virtualshadowmap' to confirm VSM is active and check the 'Page Pool Used' metric. If utilization is very high (near 100%), insufficient VSM resources are likely the cause of the blocky shadows.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Disabling Nanite on the meshes to test if the issue persists, which avoids solving the core stability issues inherent to Nanite/VSM interaction.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "lightingrendering",
            "title": "Step 2",
            "prompt": "<p>In Project Settings > Rendering > Virtual Shadow Maps, increase the 'VSM Page Table Size' setting from the default (likely 4096) to 8192 or 16384 to reserve more memory for shadow mapping detail, addressing the blocky shadow issue directly.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In Project Settings > Rendering > Virtual Shadow Maps, increase the 'VSM Page Table Size' setting from the default (likely 4096) to 8192 or 16384 to reserve more memory for shadow mapping detail, addressing the blocky shadow issue directly.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.3hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Adjusting the engine scalability settings (View Distance, Shadow Quality) instead of debugging the specific resource limits of Virtual Shadow Maps (VSM Page Table Size).</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.35hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "lightingrendering",
            "title": "Step 3",
            "prompt": "<p>Use the console command 'r.VSM.PageTableSize 16384' or 'r.VSM.PageTableSize 8192' to apply the change immediately and test if the shadows resolve their blocky appearance when moving the camera.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Use the console command 'r.VSM.PageTableSize 16384' or 'r.VSM.PageTableSize 8192' to apply the change immediately and test if the shadows resolve their blocky appearance when moving the camera.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.4hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Attempting to fix the shadow blockiness by adjusting the Directional Light's 'Shadow Bias' or 'Slope Scale,' which are properties for standard shadow maps and are not the root cause of VSM resource exhaustion.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "lightingrendering",
            "title": "Step 4",
            "prompt": "<p>Open the problematic floor Static Mesh asset in the Static Mesh Editor. Verify that Nanite is enabled, and examine the 'Nanite Settings' to ensure the 'Fallback Relative Error' is not excessively high, which could cause aggressive detail culling leading to depth buffer instability (flickering).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the problematic floor Static Mesh asset in the Static Mesh Editor. Verify that Nanite is enabled, and examine the 'Nanite Settings' to ensure the 'Fallback Relative Error' is not excessively high, which could cause aggressive detail culling leading to depth buffer instability (flickering).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.3hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Modifying Texture Pool Size in Project Settings, assuming it's a standard texture streaming issue, when the instability is specifically related to Nanite's depth buffer interaction with VSM and Lumen.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "lightingrendering",
            "title": "Step 5",
            "prompt": "<p>Check the Material assigned to the flickering floor mesh. Ensure the Blend Mode is set to 'Opaque.' Nanite meshes using 'Masked' can cause depth sorting issues or instability with VSM/Lumen when viewed dynamically.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Check the Material assigned to the flickering floor mesh. Ensure the Blend Mode is set to 'Opaque.' Nanite meshes using 'Masked' can cause depth sorting issues or instability with VSM/Lumen when viewed dynamically.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Disabling Nanite on the meshes to test if the issue persists, which avoids solving the core stability issues inherent to Nanite/VSM interaction.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "lightingrendering",
            "title": "Step 6",
            "prompt": "<p>Examine the Material Function used within the floor material (if applicable). Look for temporal effects, World Position Offset logic, or complicated opacity masks that might be destabilizing the depth buffer calculation during camera motion.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Examine the Material Function used within the floor material (if applicable). Look for temporal effects, World Position Offset logic, or complicated opacity masks that might be destabilizing the depth buffer calculation during camera motion.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.3hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Adjusting the engine scalability settings (View Distance, Shadow Quality) instead of debugging the specific resource limits of Virtual Shadow Maps (VSM Page Table Size).</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.35hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "lightingrendering",
            "title": "Step 7",
            "prompt": "<p>Verify the high-resolution textures used by the floor material. Ensure the 'Virtual Texture Streaming' checkbox is enabled on the textures if the project is heavily utilizing Virtual Textures (which is recommended for Nanite) to avoid streaming bottlenecks.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify the high-resolution textures used by the floor material. Ensure the 'Virtual Texture Streaming' checkbox is enabled on the textures if the project is heavily utilizing Virtual Textures (which is recommended for Nanite) to avoid streaming bottlenecks.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Attempting to fix the shadow blockiness by adjusting the Directional Light's 'Shadow Bias' or 'Slope Scale,' which are properties for standard shadow maps and are not the root cause of VSM resource exhaustion.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "lightingrendering",
            "title": "Step 8",
            "prompt": "<p>In the World Settings or the main Post Process Volume, navigate to Rendering Features > Global Illumination. Verify that the 'Max Trace Distance' for Lumen is sufficient for the scale of the environment.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the World Settings or the main Post Process Volume, navigate to Rendering Features > Global Illumination. Verify that the 'Max Trace Distance' for Lumen is sufficient for the scale of the environment.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Modifying Texture Pool Size in Project Settings, assuming it's a standard texture streaming issue, when the instability is specifically related to Nanite's depth buffer interaction with VSM and Lumen.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "lightingrendering",
            "title": "Step 9",
            "prompt": "<p>Use the 'Nanite Overview' visualization mode (Show > Visualize > Nanite Overview) while moving the camera rapidly to observe how Nanite cluster density changes on the floor mesh, looking for dramatic and erratic switching that coincides with the flickering.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Use the 'Nanite Overview' visualization mode (Show > Visualize > Nanite Overview) while moving the camera rapidly to observe how Nanite cluster density changes on the floor mesh, looking for dramatic and erratic switching that coincides with the flickering.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Disabling Nanite on the meshes to test if the issue persists, which avoids solving the core stability issues inherent to Nanite/VSM interaction.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "lightingrendering",
            "title": "Step 10",
            "prompt": "<p>Increase the console variable 'r.Nanite.MaxPixelsPerEdge' slightly (e.g., from 4.0 to 6.0) to force Nanite to render slightly smaller clusters at distance, improving overall detail stability for the GI and shadow systems.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Increase the console variable 'r.Nanite.MaxPixelsPerEdge' slightly (e.g., from 4.0 to 6.0) to force Nanite to render slightly smaller clusters at distance, improving overall detail stability for the GI and shadow systems.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Adjusting the engine scalability settings (View Distance, Shadow Quality) instead of debugging the specific resource limits of Virtual Shadow Maps (VSM Page Table Size).</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.35hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "lightingrendering",
            "title": "Step 11",
            "prompt": "<p>In Project Settings > Rendering > Nanite, ensure 'Streaming Cache Size GB' is appropriate for the complexity of the scene. Increasing this slightly can reduce streaming latency during fast movement, helping texture stability.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In Project Settings > Rendering > Nanite, ensure 'Streaming Cache Size GB' is appropriate for the complexity of the scene. Increasing this slightly can reduce streaming latency during fast movement, helping texture stability.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Attempting to fix the shadow blockiness by adjusting the Directional Light's 'Shadow Bias' or 'Slope Scale,' which are properties for standard shadow maps and are not the root cause of VSM resource exhaustion.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "lightingrendering",
            "title": "Step 12",
            "prompt": "<p>Check the console variable 'r.Lumen.Temporal.MaxFramesToAccumulate' (default is 16). If this value is too high, rapid camera motion might expose temporal artifacts more severely. Test lowering it slightly (e.g., to 12) if the flickering persists after addressing VSM and Nanite settings.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Check the console variable 'r.Lumen.Temporal.MaxFramesToAccumulate' (default is 16). If this value is too high, rapid camera motion might expose temporal artifacts more severely. Test lowering it slightly (e.g., to 12) if the flickering persists after addressing VSM and Nanite settings.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Modifying Texture Pool Size in Project Settings, assuming it's a standard texture streaming issue, when the instability is specifically related to Nanite's depth buffer interaction with VSM and Lumen.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-12"
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
