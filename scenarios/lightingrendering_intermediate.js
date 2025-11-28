
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['EmissiveGILightingFix'] = {
    meta: {
        title: "Missing Lumen Global Illumination from Emissive Materials",
        description: "The scene contains several custom meshes textured with a powerful emissive material (acting as futuristic wall lights). While the materials themselves glow brightly when viewed directly, they cast absolutely no dynamic light or bounce light onto nearby static geometry, even though Lumen Global Illumination is enabled. If the primary Directional Light is disabled, the level becomes completely dark, proving the emissive sources are not being registered as light contributors. The intent is for the emissive material to provide soft, dynamic indirect lighting.",
        difficulty: "medium",
        category: "Lighting & Rendering",
        estimate: 1.75
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "The scene contains several custom meshes textured with a powerful emissive material (acting as futuristic wall lights). While the materials themselves glow brightly when viewed directly, they cast absolutely no dynamic light or bounce light onto nearby static geometry, even though Lumen Global Illumination is enabled. If the primary Directional Light is disabled, the level becomes completely dark, proving the emissive sources are not being registered as light contributors. The intent is for the emissive material to provide soft, dynamic indirect lighting.",
        "choices": [
            {
                "text": "Attempting to manually build lighting (Build > Build Lighting Only), as Lumen is a dynamic GI system and baked lighting is irrelevant to this specific problem.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.15
            },
            {
                "text": "Search the Project Settings (Rendering) for the 'Lumen Global Illumination' section.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.04
            },
            {
                "text": "Attempting to solve the issue by adjusting the Sky Light or Directional Light intensity, which are unrelated to the emissive material GI contribution.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.3
            },
            {
                "text": "Ensure the setting 'Hardware Ray Tracing' is set to 'Enabled' or 'Support Global Illumination and Reflections' if the project targets high-end PCs (to ensure maximum path support for emissive GI).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.07
            },
            {
                "text": "Type 'r.Lumen.EmissiveLightSourceSurfaceCacheResolution 1' into the console to verify that the surface cache resolution is sufficient for the small light sources.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Verify the project is using a compatible reflection method. Navigate to Project Settings > Rendering > Reflection Method and confirm it is set to 'Lumen'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Review the mesh UVs: open the Static Mesh Editor for SM_WallLight and ensure UV Channel 0 (used for lightmap/GI sampling) is appropriately unwrapped without overlapping regions.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "In the Material Details panel, under the 'Lighting' category, ensure the flag 'Use Emissive for Dynamic Area Lighting' is checked.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.08
            },
            {
                "text": "Save the level, close the editor, restart UE5, and reload the level to clear any potential transient rendering bugs.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.08
            },
            {
                "text": "Select the Static Mesh Actor (SM_WallLight) in the level viewport. Check the Details panel for the 'Static Mesh' component.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.04
            },
            {
                "text": "In the Post Process Volume, enable the 'Global Illumination' category override.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            },
            {
                "text": "Under Global Illumination, ensure 'Method' is explicitly set to 'Lumen'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            },
            {
                "text": "Locate the Post Process Volume in the level (or add a new infinite one if missing).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Open the console (~) and type 'r.Lumen.EmissiveRadiance 1' to ensure emissive contribution calculation is enabled at the engine level (it should be 1 by default, but verify).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Hit 'Build' > 'Build Reflection Captures' to update indirect lighting cache, although Lumen is dynamic, sometimes this helps reset certain visualization aspects.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Open the material used for the lighting meshes (e.g., M_NeonStrip). Check that the 'Shading Model' in the Material Details panel is set to 'Default Lit'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.08
            },
            {
                "text": "Check the Material Instance applied to the mesh to ensure no parameter (like Emissive Multiplier) was overridden and set back to zero accidentally in the instance.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.08
            },
            {
                "text": "Placing a standard Point Light adjacent to the emissive object and setting its 'Visibility' to false in an attempt to fake the lighting effect, bypassing the necessary Emissive GI pipeline fix.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.2
            },
            {
                "text": "Changing the material blend mode to 'Translucent' or 'Masked', which often disables the ability for the material to contribute to Lumen Global Illumination, compounding the original issue.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.25
            },
            {
                "text": "Under Global Illumination > Lumen, check the 'Emissive Light Contribution' slider and ensure it is set to 1.0 (or higher if the scene requires a boost).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Verify the project is using a compatible rendering method. Navigate to Project Settings > Rendering > Dynamic Global Illumination Method and confirm it is set to 'Lumen'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "In the mesh component details, search for 'Lighting'. Ensure 'Cast Shadows' is checked for the mesh component, as Lumen GI often requires this for contribution, even if the shadow is soft or minor.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.07
            },
            {
                "text": "Under Global Illumination > Lumen, confirm 'Final Gather Quality' is set to a reasonable value (e.g., 2.0 or 3.0) for better light integration.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.06
            },
            {
                "text": "If using Software Ray Tracing, ensure the 'Software Ray Tracing Mode' is set to 'Global' for proper Scene Trace coverage.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.07
            },
            {
                "text": "Back in the level, adjust the 'Emissive Light Source: Scale' property on the mesh component. If the scale is 0, Lumen may ignore the source, so set it to 1.0 or higher.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Verify the Emissive color intensity in the material graph is connected to the 'Emissive Color' output and is sufficiently high (e.g., multiplied by a Scalar Parameter with a value of 50.0 or more).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.07
            }
        ]
    }
}
};
