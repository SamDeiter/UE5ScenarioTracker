window.SCENARIOS['metallic_asset_pitch_black_dynamic_scene'] = {
    meta: {
        title: "Metallic Asset Appears Pitch Black in Dynamic Scene",
        description: "A highly reflective metallic statue appears uniformly pitch black in a well-lit dynamic scene with Lumen enabled, despite other objects reflecting light correctly. The material has Metallic=1.0 and Roughness=0.1. The object is not receiving environmental reflections or indirect light.",
        estimateHours: 0.73,
        category: "Lighting & Rendering"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'lighting',
            title: 'Initial Object and Material Verification',
            prompt: "<p>You've identified a highly reflective metallic statue that appears pitch black in your UE5 level, even though the scene is well-lit with a dynamic directional light and Lumen is enabled. Other non-metallic objects reflect light correctly. The statue's material instance has Metallic set to 1.0 and Roughness to 0.1.</p><strong>What is your first step to diagnose this issue?</strong>",
            choices: [
                {
                    text: "Select the problematic metallic Static Mesh Actor in the viewport or World Outliner, then verify its assigned material instance has Metallic set to 1.0 and Roughness to 0.1.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> This is the correct starting point. Confirming the object is selected and its material properties are as expected ensures you're looking at the right asset and its basic setup is correct before diving deeper.</p>",
                    next: 'step-2'
                },
                {
                    text: "Attempt to change the Material's roughness parameter to 1.0 (matte) to confirm if the issue is related to specularity.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> While changing roughness might reveal *something*, it deviates from the intended metallic look and doesn't directly address why the object is pitch black. The goal is to make the metallic object work, not to change its fundamental appearance to diagnose.</p>",
                    next: 'step-2'
                },
                {
                    text: "Manually place multiple Sphere Reflection Capture actors across the scene and rebuild reflections to provide environmental reflections.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> Lumen is enabled in the scene, which provides real-time global illumination and reflections, making Sphere Reflection Captures largely redundant for dynamic objects. This approach is unlikely to solve the issue and wastes time.</p>",
                    next: 'step-2'
                },
            ]
        },
        'step-2': {
            skill: 'lighting',
            title: 'Checking Component Mobility and Basic Visibility Settings',
            prompt: "<p>You've confirmed the metallic statue is selected and its material properties (Metallic=1.0, Roughness=0.1) are correct. The object still appears pitch black. Now, you need to investigate the object's component-specific rendering settings.</p><strong>What do you check next in the Details panel for the Static Mesh Component?</strong>",
            choices: [
                {
                    text: "Verify the 'Mobility' setting is set to 'Movable' and ensure 'Visible' and 'Cast Shadows' are checked within the 'Rendering' category.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> Setting 'Mobility' to 'Movable' is crucial for dynamic lighting and Lumen interaction. Ensuring 'Visible' and 'Cast Shadows' are enabled confirms the object is intended to be rendered and interact with light sources. Static or Stationary mobility can sometimes limit dynamic lighting features for certain objects.</p>",
                    next: 'step-3'
                },
                {
                    text: "Delete the directional light and replace it with a new one, or modify its intensity to extreme values to force illumination.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> The context states the level is well-lit and other non-metallic objects reflect light correctly, indicating the directional light itself is likely not the problem. Replacing it or drastically changing its intensity is a broad, disruptive step that ignores the specific object's settings.</p>",
                    next: 'step-3'
                },
                {
                    text: "Check the Project Settings for Ray Tracing and Lumen to ensure they are globally enabled and configured correctly.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> While important for the project, the context explicitly states 'Lumen enabled' and 'Other nearby non-metallic objects reflect light and shadows correctly.' This suggests the global settings are fine, and the issue is specific to this one object, making this a less efficient diagnostic step.</p>",
                    next: 'step-3'
                },
            ]
        },
        'step-3': {
            skill: 'lighting',
            title: 'Advanced Illumination and Ray Tracing Properties',
            prompt: "<p>You've confirmed the object's material, mobility, and basic visibility settings are correct. The metallic statue remains pitch black, indicating it's still not receiving proper indirect light or reflections, especially given Lumen is active.</p><strong>What are the final critical rendering properties to check for this specific object?</strong>",
            choices: [
                {
                    text: "In the 'Rendering' category, ensure 'Affects Global Illumination' is enabled, and locate 'Visible in Ray Tracing' (if applicable) and ensure it is also enabled.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> These are the key settings for an object to properly interact with advanced lighting systems like Lumen and Ray Tracing. 'Affects Global Illumination' is vital for receiving indirect light, and 'Visible in Ray Tracing' ensures it's considered by ray-traced reflections and GI, which Lumen often leverages.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Adjust the Post Process Volume's Exposure settings to brighten the scene globally, hoping it will reveal the statue.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> Adjusting global exposure would affect the entire scene, not just the problematic object. If the object is truly receiving no light, increasing exposure will only make the rest of the scene overexposed without solving the underlying issue for the statue.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Rebuild the lighting for the level, even though dynamic lighting is in use and Lumen is enabled.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> Rebuilding lighting is primarily for static lighting scenarios (Lightmass). With dynamic lighting and Lumen, lighting is calculated in real-time. Rebuilding lighting is unnecessary and won't resolve an issue related to an object's specific rendering properties in a dynamic setup.</p>",
                    next: 'conclusion'
                },
            ]
        },
        'conclusion': {
            skill: 'lighting',
            title: 'Scenario Complete',
            prompt: "<p>By ensuring the metallic statue's 'Mobility' was set to 'Movable', 'Affects Global Illumination' was enabled, and 'Visible in Ray Tracing' was active, the object now correctly receives indirect lighting and reflections from the dynamic scene and Lumen. The statue is no longer pitch black and reflects its environment as intended.</p>",
            choices: [
            ]
        },
    }
};
