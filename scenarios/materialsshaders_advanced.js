
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['VolumetricShadowingPerformance'] = {
    meta: {
        title: "Translucent Mesh Material Fails Dynamic Self-Shadowing & Causes Severe Overdraw",
        description: "A large, translucent mesh (representing a cloud or nebula volume) is placed in the level. It uses World Position Offset (WPO) to simulate internal movement. The problem presents in two ways: 1) The mesh component is set to 'Cast Dynamic Shadows', but it does not receive dynamic self-shadowing or external shadows correctly from nearby movable lights, resulting in a flat, unlit appearance. 2) When viewing the scene in the 'Shader Complexity' view mode, this single mesh renders as bright red/pink, causing a significant frame rate drop (upwards of 15ms) whenever it is on screen, indicating extreme overdraw/expensive calculation.",
        difficulty: "medium",
        category: "Materials & Shaders",
        estimate: 3
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "A large, translucent mesh (representing a cloud or nebula volume) is placed in the level. It uses World Position Offset (WPO) to simulate internal movement. The problem presents in two ways: 1) The mesh component is set to 'Cast Dynamic Shadows', but it does not receive dynamic self-shadowing or external shadows correctly from nearby movable lights, resulting in a flat, unlit appearance. 2) When viewing the scene in the 'Shader Complexity' view mode, this single mesh renders as bright red/pink, causing a significant frame rate drop (upwards of 15ms) whenever it is on screen, indicating extreme overdraw/expensive calculation.",
        "choices": [
            {
                "text": "To fundamentally fix the overdraw and enable robust shadowing for the complex shape, change the Material's Blend Mode from 'Translucent' to 'Masked' (or Opaque if complexity allows).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Connect the output of the 'DitherTemporalAA' node to the 'Opacity Mask' input of the main material node, replacing the old Opacity connection.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Trying to solve the performance issue by disabling Ray Tracing in the Project Settings or Post Process Volume, which treats the symptom (slowness) but not the cause (expensive shader iteration and overdraw).",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.5
            },
            {
                "text": "Enabling 'Volumetric Translucent Shadows' in Project Settings without realizing that the custom material, due to WPO usage, requires a transition to Masked blend mode for reliable dynamic shadowing.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.4
            },
            {
                "text": "Because the material is now Masked, we must replicate the soft fading edges. In the Material Graph, reroute the Opacity logic (which was previously connected to the Translucent Opacity input) through the 'DitherTemporalAA' node.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.25
            },
            {
                "text": "Increasing the Light Source Radius or Light Source Angle to try and soften the missing shadows, incorrectly assuming the light definition is too sharp.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.3
            },
            {
                "text": "Recompile the material and verify in the 'Lit' view mode that dynamic self-shadowing is now correctly applied to the mesh.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Switch the viewport to 'Shader Complexity' view mode and visually confirm the material renders in the highest complexity colors (bright pink/red).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Return to M_Volumetric_Base. Since the material uses Translucent Blend Mode and WPO, enable the 'Output Velocity' flag in the Material Details under the Translucency section for proper motion vector generation.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Locate the specific Static Mesh Actor in the Outliner and identify the applied Material Instance (e.g., MI_Volumetric_Cloud).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Checking the mesh component's collision settings or trace channels, incorrectly assuming the shadow failure is due to a misconfigured trace setting.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.2
            },
            {
                "text": "In the Material Details panel, locate the 'Masked' section and ensure 'Use Dithered Opacity' is checked (this setting is crucial when using DitherTemporalAA with Masked Blend Mode).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Reduce the 'Iteration_Count' parameter in the Material Instance to a reasonable real-time value (e.g., 16 or 20) to solve the initial performance spike caused by excessive shader instructions.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Analyze the Material Function (MF_Noise_Iterator) and determine that it contains an expensive custom loop structure whose iteration count is controlled by a scalar parameter ('Iteration_Count').",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.3
            },
            {
                "text": "In M_Volumetric_Base, identify the custom Material Function (MF_Noise_Iterator) used to generate the complex volumetric look and WPO, noting that this function is called multiple times.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Return to the 'Shader Complexity' view mode and confirm the shader is now rendering in green/yellow, signifying a massively reduced instruction count and fixing the performance hit.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Use the console command 'stat GPU' to confirm that the GPU time spikes significantly when the problematic mesh is visible, validating that the issue is performance related to draw call complexity.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "To address the shadowing failure related to WPO, navigate to the Material Details panel (M_Volumetric_Base), General section, and check the box labeled 'Apply World Position Offset in Ray Tracing'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Use the 'Pixel Depth Offset' input (available on Opaque/Masked materials) to slightly offset the depth buffer based on the density calculation, improving shadowing quality near edges and blending the WPO changes more smoothly.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Return to the Material Instance (MI_Volumetric_Cloud) and check the exposed parameter 'Iteration_Count', noting it is set to an excessively high value (e.g., 64 or 128).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Open the Material Instance and trace it back to the Parent Material (M_Volumetric_Base) to begin analysis of the shader graph.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            }
        ]
    }
}
};
