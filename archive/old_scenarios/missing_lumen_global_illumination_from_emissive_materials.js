window.SCENARIOS['missing_lumen_global_illumination_from_emissive_materials'] = {
    meta: {
        title: "Missing Lumen Global Illumination from Emissive Materials",
        description: "The scene contains several custom meshes textured with a powerful emissive material (acting as futuristic wall lights). While the materials themselves glow brightly when viewed directly, they cast absolutely no dynamic light or bounce light onto nearby static geometry, even though Lumen Global Illumination is enabled. If the primary Directional Light is disabled, the level becomes completely dark, proving the emissive sources are not being registered as light contributors. The intent is for the emissive materials to contribute to the scene's global illumination.",
        estimateHours: 1.75,
        category: "Lighting & Rendering"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'lighting',
            title: 'Project-Wide Lumen Configuration',
            prompt: "<p>You've identified that emissive materials are not contributing to global illumination in your UE5 scene, despite Lumen being enabled. Before diving into specific assets, it's crucial to ensure the project's core rendering and reflection settings are correctly configured for Lumen.</p><strong>What's your first diagnostic step?</strong>",
            choices: [
                {
                    text: "Verify the project's rendering and reflection methods in Project Settings > Rendering are set to 'Lumen Global Illumination' and 'Lumen Reflections' respectively.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> Correctly identifying that Lumen requires specific rendering and reflection methods to be active project-wide is a critical first step. This ensures the engine is even attempting to process Lumen GI.</p>",
                    next: 'step-2'
                },
                {
                    text: "Attempting to solve the issue by adjusting the Sky Light or Directional Light intensity and color.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> Adjusting existing lights won't enable emissive materials to contribute to GI if the core Lumen setup is incorrect. This is a misdirection and won't resolve the root cause.</p>",
                    next: 'step-2'
                },
                {
                    text: "Placing a standard Point Light adjacent to the emissive object and setting its 'Intensity' to match the emissive glow.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> This is a workaround, not a solution. It bypasses the problem of emissive GI entirely and doesn't address why the emissive material itself isn't contributing.</p>",
                    next: 'step-2'
                },
                {
                    text: "Changing the material blend mode of the emissive material to 'Translucent' or 'Masked'.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> While blend modes are material properties, changing them arbitrarily can often disable GI contributions or introduce other rendering issues. This is not the correct initial diagnostic for emissive GI.</p>",
                    next: 'step-2'
                },
            ]
        },
        'step-2': {
            skill: 'materials',
            title: 'Material-Specific Lumen Contribution Settings',
            prompt: "<p>You've confirmed Lumen is correctly enabled in Project Settings. The next logical step is to examine the emissive material itself.</p><strong>What specific material properties are essential for an emissive material to contribute to Lumen Global Illumination?</strong>",
            choices: [
                {
                    text: "Open the emissive material (e.g., M_NeonStrip) and verify its 'Shading Model' is compatible (e.g., 'Default Lit' or 'Unlit' with specific settings), and crucially, ensure 'Use Emissive for Dynamic Global Illumination' is enabled in the Material Details panel under the 'Lighting' category.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> The Shading Model and the 'Use Emissive for Dynamic Global Illumination' flag are direct controls for how a material interacts with Lumen. This is a key configuration point for emissive GI.</p>",
                    next: 'step-3'
                },
                {
                    text: "Attempting to manually build lighting (Build > Build Lighting Only) to force the emissive light to bake.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> Lumen is a real-time GI solution and does not rely on baked lighting. Attempting to build lighting is irrelevant and a waste of time in this context.</p>",
                    next: 'step-3'
                },
                {
                    text: "Adjusting the 'Roughness' or 'Metallic' values in the material to make it appear brighter.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> Roughness and Metallic affect reflections and surface properties, not the emissive contribution to global illumination. While they impact how light interacts with the surface, they don't enable the emissive light source itself.</p>",
                    next: 'step-3'
                },
                {
                    text: "Increasing the 'Base Color' intensity in the material graph to make the material brighter.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> Base Color defines the diffuse color of a surface. While increasing it might make the material appear brighter when lit, it does not control the emissive light output that contributes to GI. The 'Emissive Color' output is what matters for self-illumination.</p>",
                    next: 'step-3'
                },
            ]
        },
        'step-3': {
            skill: 'level_design',
            title: 'Final Checks: Emissive Output and Mesh GI Contribution',
            prompt: "<p>You've ensured the project and material settings are configured for Lumen emissive GI. However, the issue persists.</p><strong>What are the final critical checks within the material graph and on the mesh actor itself that could prevent emissive light from contributing?</strong>",
            choices: [
                {
                    text: "Verify the Emissive color intensity in the material graph is correctly connected to the 'Emissive Color' output, ensuring sufficient brightness. Additionally, select the Static Mesh Actor in the level and confirm 'Affects Global Illumination' is enabled in its Details panel.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> A disconnected or insufficient emissive output in the material graph means no light is generated. Similarly, if the mesh actor itself is set not to affect GI, it will be ignored by Lumen. These are the final pieces of the puzzle.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Adding a Post Process Volume to the scene and adjusting its 'Global Illumination' settings.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> While Post Process Volumes can tweak the <em>appearance</em> of GI, they don't enable or disable the <em>source</em> of GI. This is a refinement step, not a diagnostic one for a missing contribution.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Changing the mesh's 'Mobility' setting from 'Static' to 'Movable' or 'Stationary'.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> While mobility can impact how objects interact with lighting, 'Static' meshes can still contribute to Lumen GI. Changing mobility unnecessarily can introduce performance overhead or other rendering artifacts without addressing the core issue.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Re-importing the static mesh asset, assuming a corruption during import.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> Re-importing the mesh is an extreme measure and unlikely to resolve a configuration issue related to Lumen or material properties. It's a last resort for asset corruption, not a first for lighting problems.</p>",
                    next: 'conclusion'
                },
            ]
        },
        'conclusion': {
            skill: 'lighting',
            title: 'Scenario Complete',
            prompt: "By systematically checking project settings, material properties, material graph connections, and individual mesh actor settings, you've successfully identified and resolved the issue. The emissive materials now correctly contribute to Lumen Global Illumination, illuminating the scene as intended.",
            choices: [
            ]
        },
    }
};
