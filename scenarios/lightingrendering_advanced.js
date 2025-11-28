window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['NaniteVSMInstabilityOnMovement'] = {
    meta: {
        title: "Dynamic Nanite Geometry Flickering and Blocky VSM Shadows on Rapid Camera Movement",
        description: "In a highly detailed, large interior environment using Lumen Global Illumination, two distinct rendering artifacts occur specifically when the camera is moved quickly: 1. The Nanite-enabled tiled floor material exhibits severe flickering (patches of pure white or black) when viewed from intermediate distances. 2. The high-poly Nanite geometric wall molding casts extremely blocky, low-resolution shadows that jump and update visibly as the camera speeds up. The blockiness persists even at high-end scalability settings. Both issues disappear when the camera is completely static.",
        difficulty: "medium",
        category: "Lighting & Rendering",
        estimate: 3
    },
    start: "step_1",
    steps: {
        "step_1": {
            "prompt": "In a highly detailed, large interior environment using Lumen Global Illumination, two distinct rendering artifacts occur specifically when the camera is moved quickly:\r\n1. The Nanite-enabled tiled floor material exhibits severe flickering (patches of pure white or black) when viewed from intermediate distances.\r\n2. The high-poly Nanite geometric wall molding casts extremely blocky, low-resolution shadows that jump and update visibly as the camera speeds up. The blockiness persists even at high-end scalability settings. Both issues disappear when the camera is completely static.",
            "choices": [
                {
                    "text": "Open the problematic floor Static Mesh asset in the Static Mesh Editor. Verify that Nanite is enabled, and examine the 'Nanite Settings' to ensure the 'Fallback Relative Error' is not excessively high, which could cause aggressive detail culling leading to depth buffer instability (flickering).",
                    "next": "conclusion",
                    "type": "correct",
                    "time_cost": 0.3
                },
                {
                    "text": "In Project Settings > Rendering > Nanite, ensure 'Streaming Cache Size GB' is appropriate for the complexity of the scene. Increasing this slightly can reduce streaming latency during fast movement, helping texture stability.",
                    "next": "conclusion",
                    "type": "correct",
                    "time_cost": 0.2
                },
                {
                    "text": "Use the 'Nanite Overview' visualization mode (Show > Visualize > Nanite Overview) while moving the camera rapidly to observe how Nanite cluster density changes on the floor mesh, looking for dramatic and erratic switching that coincides with the flickering.",
                    "next": "conclusion",
                    "type": "correct",
                    "time_cost": 0.2
                },
                {
                    "text": "Increase the console variable 'r.Nanite.MaxPixelsPerEdge' slightly (e.g., from 4.0 to 6.0) to force Nanite to render slightly smaller clusters at distance, improving overall detail stability for the GI and shadow systems.",
                    "next": "conclusion",
                    "type": "correct",
                    "time_cost": 0.2
                },
                {
                    "text": "Use the console command 'r.VSM.PageTableSize 16384' or 'r.VSM.PageTableSize 8192' to apply the change immediately and test if the shadows resolve their blocky appearance when moving the camera.",
                    "next": "conclusion",
                    "type": "correct",
                    "time_cost": 0.4
                },
                {
                    "text": "In the World Settings or the main Post Process Volume, navigate to Rendering Features > Global Illumination. Verify that the 'Max Trace Distance' for Lumen is sufficient for the scale of the environment.",
                    "next": "conclusion",
                    "type": "correct",
                    "time_cost": 0.1
                },
                {
                    "text": "Modifying Texture Pool Size in Project Settings, assuming it's a standard texture streaming issue, when the instability is specifically related to Nanite's depth buffer interaction with VSM and Lumen.",
                    "next": "step_1",
                    "type": "misguided",
                    "time_cost": 0.25
                },
                {
                    "text": "Disabling Nanite on the meshes to test if the issue persists, which avoids solving the core stability issues inherent to Nanite/VSM interaction.",
                    "next": "step_1",
                    "type": "misguided",
                    "time_cost": 0.5
                },
                {
                    "text": "Check the console variable 'r.Lumen.Temporal.MaxFramesToAccumulate' (default is 16). If this value is too high, rapid camera motion might expose temporal artifacts more severely. Test lowering it slightly (e.g., to 12) if the flickering persists after addressing VSM and Nanite settings.",
                    "next": "conclusion",
                    "type": "correct",
                    "time_cost": 0.2
                },
                {
                    "text": "Use the console command 'stat virtualshadowmap' to confirm VSM is active and check the 'Page Pool Used' metric. If utilization is very high (near 100%), insufficient VSM resources are likely the cause of the blocky shadows.",
                    "next": "conclusion",
                    "type": "correct",
                    "time_cost": 0.2
                },
                {
                    "text": "Attempting to fix the shadow blockiness by adjusting the Directional Light's 'Shadow Bias' or 'Slope Scale,' which are properties for standard shadow maps and are not the root cause of VSM resource exhaustion.",
                    "next": "step_1",
                    "type": "misguided",
                    "time_cost": 0.4
                },
                {
                    "text": "Adjusting the engine scalability settings (View Distance, Shadow Quality) instead of debugging the specific resource limits of Virtual Shadow Maps (VSM Page Table Size).",
                    "next": "step_1",
                    "type": "misguided",
                    "time_cost": 0.35
                },
                {
                    "text": "Check the Material assigned to the flickering floor mesh. Ensure the Blend Mode is set to 'Opaque.' Nanite meshes using 'Masked' can cause depth sorting issues or instability with VSM/Lumen when viewed dynamically.",
                    "next": "conclusion",
                    "type": "correct",
                    "time_cost": 0.2
                },
                {
                    "text": "Examine the Material Function used within the floor material (if applicable). Look for temporal effects, World Position Offset logic, or complicated opacity masks that might be destabilizing the depth buffer calculation during camera motion.",
                    "next": "conclusion",
                    "type": "correct",
                    "time_cost": 0.3
                },
                {
                    "text": "In Project Settings > Rendering > Virtual Shadow Maps, increase the 'VSM Page Table Size' setting from the default (likely 4096) to 8192 or 16384 to reserve more memory for shadow mapping detail, addressing the blocky shadow issue directly.",
                    "next": "conclusion",
                    "type": "correct",
                    "time_cost": 0.3
                },
                {
                    "text": "Verify the high-resolution textures used by the floor material. Ensure the 'Virtual Texture Streaming' checkbox is enabled on the textures if the project is heavily utilizing Virtual Textures (which is recommended for Nanite) to avoid streaming bottlenecks.",
                    "next": "conclusion",
                    "type": "correct",
                    "time_cost": 0.1
                }
            ]
        }
    }
};
