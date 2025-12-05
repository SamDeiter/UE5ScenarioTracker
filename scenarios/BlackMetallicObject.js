window.SCENARIOS['BlackMetallicObject'] = {
    "meta": {
        "title": "Metallic Asset Appears Pitch Black in Dynamic Scene",
        "description": "A highly reflective metallic statue has been placed into the level. Despite the level being well-lit using a dynamic directional light and having Lumen enabled, the statue appears uniformly pitch black in the viewport and in PIE. Other nearby non-metallic objects reflect light and shadows correctly. The material instance applied to the statue has Metallic set to 1.0 and Roughness set to 0.1. The object is clearly not receiving any environmental reflections or indirect light.",
        "estimateHours": 0.73,
        "category": "Lighting & Rendering"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "lightingrendering",
            "title": "Step 1",
            "prompt": "<p>Select the problematic black metallic Static Mesh Actor in the viewport or World Outliner.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select the problematic black metallic Static Mesh Actor in the viewport or World Outliner.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Attempting to change the Material's roughness parameter to 1.0 (matte) to confirm light interaction, thus removing the metallic visual requirement for reflections, which misdiagnoses the problem.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "lightingrendering",
            "title": "Step 2",
            "prompt": "<p>Verify the material applied to the mesh component's slot 0. Confirm the Material Instance has Metallic=1.0 and Roughness is a low value (e.g., 0.1), ruling out material setup as the primary cause.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify the material applied to the mesh component's slot 0. Confirm the Material Instance has Metallic=1.0 and Roughness is a low value (e.g., 0.1), ruling out material setup as the primary cause.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Manually placing multiple Sphere Reflection Capture actors across the scene and running 'Build Reflection Captures,' assuming Lumen is disabled or misconfigured, wasting time on legacy techniques.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "lightingrendering",
            "title": "Step 3",
            "prompt": "<p>In the Details panel for the Static Mesh Component, verify the 'Mobility' setting is set to 'Movable' to ensure full compatibility with dynamic systems like Lumen and runtime reflections.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Details panel for the Static Mesh Component, verify the 'Mobility' setting is set to 'Movable' to ensure full compatibility with dynamic systems like Lumen and runtime reflections.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Deleting the directional light and replacing it, or modifying its intensity to extreme values, mistakenly assuming the issue is primary lighting source intensity rather than reflection setup.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "lightingrendering",
            "title": "Step 4",
            "prompt": "<p>Expand the 'Rendering' category in the Details panel and verify 'Visible' and 'Cast Shadows' are checked.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Expand the 'Rendering' category in the Details panel and verify 'Visible' and 'Cast Shadows' are checked.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.04hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Attempting to change the Material's roughness parameter to 1.0 (matte) to confirm light interaction, thus removing the metallic visual requirement for reflections, which misdiagnoses the problem.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "lightingrendering",
            "title": "Step 5",
            "prompt": "<p>Check the 'Rendering' property 'Affects Global Illumination' and ensure it is enabled, allowing the object to interact with GI systems.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Check the 'Rendering' property 'Affects Global Illumination' and ensure it is enabled, allowing the object to interact with GI systems.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.04hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Manually placing multiple Sphere Reflection Capture actors across the scene and running 'Build Reflection Captures,' assuming Lumen is disabled or misconfigured, wasting time on legacy techniques.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "lightingrendering",
            "title": "Step 6",
            "prompt": "<p>Locate the specific toggle 'Visible in Ray Tracing' (usually found near the bottom of the Rendering section) and confirm it is checked. If unchecked, metallic/reflective objects often appear black when using hardware ray tracing or high-quality Lumen reflections.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate the specific toggle 'Visible in Ray Tracing' (usually found near the bottom of the Rendering section) and confirm it is checked. If unchecked, metallic/reflective objects often appear black when using hardware ray tracing or high-quality Lumen reflections.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.08hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Deleting the directional light and replacing it, or modifying its intensity to extreme values, mistakenly assuming the issue is primary lighting source intensity rather than reflection setup.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "lightingrendering",
            "title": "Step 7",
            "prompt": "<p>If checking the Ray Tracing visibility property solved the issue, instruct the user to hit 'Save All' and verify the statue is now correctly reflecting the scene.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>If checking the Ray Tracing visibility property solved the issue, instruct the user to hit 'Save All' and verify the statue is now correctly reflecting the scene.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Attempting to change the Material's roughness parameter to 1.0 (matte) to confirm light interaction, thus removing the metallic visual requirement for reflections, which misdiagnoses the problem.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "lightingrendering",
            "title": "Step 8",
            "prompt": "<p>If the issue persists, open Project Settings (Edit -> Project Settings) and navigate to the 'Rendering' section to globally confirm 'Global Illumination Method' is set to 'Lumen' and 'Reflection Method' is set to 'Lumen'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>If the issue persists, open Project Settings (Edit -> Project Settings) and navigate to the 'Rendering' section to globally confirm 'Global Illumination Method' is set to 'Lumen' and 'Reflection Method' is set to 'Lumen'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.07hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Manually placing multiple Sphere Reflection Capture actors across the scene and running 'Build Reflection Captures,' assuming Lumen is disabled or misconfigured, wasting time on legacy techniques.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "lightingrendering",
            "title": "Step 9",
            "prompt": "<p>Check the Sky Light actor in the scene. Ensure its 'Source Type' is set to 'SLS Captured Scene' and confirm its 'Intensity' is a visible value (e.g., 1.0).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Check the Sky Light actor in the scene. Ensure its 'Source Type' is set to 'SLS Captured Scene' and confirm its 'Intensity' is a visible value (e.g., 1.0).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Deleting the directional light and replacing it, or modifying its intensity to extreme values, mistakenly assuming the issue is primary lighting source intensity rather than reflection setup.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "lightingrendering",
            "title": "Step 10",
            "prompt": "<p>In the Editor Viewport, switch the view mode to 'Buffer Visualization -> World Reflection' to visually confirm if the object is receiving any reflection data from the Sky Light or Lumen.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Editor Viewport, switch the view mode to 'Buffer Visualization -> World Reflection' to visually confirm if the object is receiving any reflection data from the Sky Light or Lumen.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.06hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Attempting to change the Material's roughness parameter to 1.0 (matte) to confirm light interaction, thus removing the metallic visual requirement for reflections, which misdiagnoses the problem.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "lightingrendering",
            "title": "Step 11",
            "prompt": "<p>If a dedicated Reflection Capture actor is present near the statue (despite using Lumen), check its influence bounds to ensure the statue is fully contained within it.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>If a dedicated Reflection Capture actor is present near the statue (despite using Lumen), check its influence bounds to ensure the statue is fully contained within it.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Manually placing multiple Sphere Reflection Capture actors across the scene and running 'Build Reflection Captures,' assuming Lumen is disabled or misconfigured, wasting time on legacy techniques.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "lightingrendering",
            "title": "Step 12",
            "prompt": "<p>Select the Post Process Volume in the scene and ensure the 'Unbound' property is checked, or that the statue is within the volume's bounds.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select the Post Process Volume in the scene and ensure the 'Unbound' property is checked, or that the statue is within the volume's bounds.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.04hrs. Correct approach.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Deleting the directional light and replacing it, or modifying its intensity to extreme values, mistakenly assuming the issue is primary lighting source intensity rather than reflection setup.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "lightingrendering",
            "title": "Step 13",
            "prompt": "<p>In the Post Process Volume settings, search for 'Lumen' and confirm that both 'Global Illumination' and 'Reflections' settings are explicitly set to 'Lumen' or 'Final Gather', and that the intensity values are not zero.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Post Process Volume settings, search for 'Lumen' and confirm that both 'Global Illumination' and 'Reflections' settings are explicitly set to 'Lumen' or 'Final Gather', and that the intensity values are not zero.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Attempting to change the Material's roughness parameter to 1.0 (matte) to confirm light interaction, thus removing the metallic visual requirement for reflections, which misdiagnoses the problem.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "lightingrendering",
            "title": "Step 14",
            "prompt": "<p>Return to the problematic Static Mesh Actor and specifically review the 'Visible in Ray Tracing' setting one last time. If it was disabled, re-enable it.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Return to the problematic Static Mesh Actor and specifically review the 'Visible in Ray Tracing' setting one last time. If it was disabled, re-enable it.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Manually placing multiple Sphere Reflection Capture actors across the scene and running 'Build Reflection Captures,' assuming Lumen is disabled or misconfigured, wasting time on legacy techniques.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "lightingrendering",
            "title": "Step 15",
            "prompt": "<p>Final verification: Ensure the Static Mesh Component's 'Hidden In Game' property is not checked, and the statue renders correctly in the Play In Editor mode.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Final verification: Ensure the Static Mesh Component's 'Hidden In Game' property is not checked, and the statue renders correctly in the Play In Editor mode.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.06hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Deleting the directional light and replacing it, or modifying its intensity to extreme values, mistakenly assuming the issue is primary lighting source intensity rather than reflection setup.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
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
