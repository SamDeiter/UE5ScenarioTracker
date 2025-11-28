
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['BlackMetallicObject'] = {
    meta: {
        title: "Metallic Asset Appears Pitch Black in Dynamic Scene",
        description: "A highly reflective metallic statue has been placed into the level. Despite the level being well-lit using a dynamic directional light and having Lumen enabled, the statue appears uniformly pitch black in the viewport and in PIE. Other nearby non-metallic objects reflect light and shadows correctly. The material instance applied to the statue has Metallic set to 1.0 and Roughness set to 0.1. The object is clearly not receiving any environmental reflections or indirect light.",
        difficulty: "medium",
        category: "Lighting & Rendering",
        estimate: 0.73
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "A highly reflective metallic statue has been placed into the level. Despite the level being well-lit using a dynamic directional light and having Lumen enabled, the statue appears uniformly pitch black in the viewport and in PIE. Other nearby non-metallic objects reflect light and shadows correctly. The material instance applied to the statue has Metallic set to 1.0 and Roughness set to 0.1. The object is clearly not receiving any environmental reflections or indirect light.",
        "choices": [
            {
                "text": "If checking the Ray Tracing visibility property solved the issue, instruct the user to hit 'Save All' and verify the statue is now correctly reflecting the scene.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            },
            {
                "text": "Deleting the directional light and replacing it, or modifying its intensity to extreme values, mistakenly assuming the issue is primary lighting source intensity rather than reflection setup.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.2
            },
            {
                "text": "Check the Sky Light actor in the scene. Ensure its 'Source Type' is set to 'SLS Captured Scene' and confirm its 'Intensity' is a visible value (e.g., 1.0).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "In the Editor Viewport, switch the view mode to 'Buffer Visualization -> World Reflection' to visually confirm if the object is receiving any reflection data from the Sky Light or Lumen.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.06
            },
            {
                "text": "In the Post Process Volume settings, search for 'Lumen' and confirm that both 'Global Illumination' and 'Reflections' settings are explicitly set to 'Lumen' or 'Final Gather', and that the intensity values are not zero.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Final verification: Ensure the Static Mesh Component's 'Hidden In Game' property is not checked, and the statue renders correctly in the Play In Editor mode.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.06
            },
            {
                "text": "If the issue persists, open Project Settings (Edit -> Project Settings) and navigate to the 'Rendering' section to globally confirm 'Global Illumination Method' is set to 'Lumen' and 'Reflection Method' is set to 'Lumen'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.07
            },
            {
                "text": "Expand the 'Rendering' category in the Details panel and verify 'Visible' and 'Cast Shadows' are checked.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.04
            },
            {
                "text": "Attempting to change the Material's roughness parameter to 1.0 (matte) to confirm light interaction, thus removing the metallic visual requirement for reflections, which misdiagnoses the problem.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.15
            },
            {
                "text": "Select the problematic black metallic Static Mesh Actor in the viewport or World Outliner.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            },
            {
                "text": "Select the Post Process Volume in the scene and ensure the 'Unbound' property is checked, or that the statue is within the volume's bounds.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.04
            },
            {
                "text": "In the Details panel for the Static Mesh Component, verify the 'Mobility' setting is set to 'Movable' to ensure full compatibility with dynamic systems like Lumen and runtime reflections.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Check the 'Rendering' property 'Affects Global Illumination' and ensure it is enabled, allowing the object to interact with GI systems.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.04
            },
            {
                "text": "Return to the problematic Static Mesh Actor and specifically review the 'Visible in Ray Tracing' setting one last time. If it was disabled, re-enable it.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            },
            {
                "text": "If a dedicated Reflection Capture actor is present near the statue (despite using Lumen), check its influence bounds to ensure the statue is fully contained within it.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Verify the material applied to the mesh component's slot 0. Confirm the Material Instance has Metallic=1.0 and Roughness is a low value (e.g., 0.1), ruling out material setup as the primary cause.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Locate the specific toggle 'Visible in Ray Tracing' (usually found near the bottom of the Rendering section) and confirm it is checked. If unchecked, metallic/reflective objects often appear black when using hardware ray tracing or high-quality Lumen reflections.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.08
            },
            {
                "text": "Manually placing multiple Sphere Reflection Capture actors across the scene and running 'Build Reflection Captures,' assuming Lumen is disabled or misconfigured, wasting time on legacy techniques.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.1
            }
        ]
    }
}
};
