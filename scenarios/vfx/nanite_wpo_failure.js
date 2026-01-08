window.SCENARIOS['nanite_wpo_failure'] = {
    "meta": {
        "title": "Distant Static Mesh Turns Pitch Black Due to Nanite WPO Misconfiguration",
        "description": "In a detailed cathedral scene using Lumen, a large, ornate marble statue (a Nanite mesh) appears perfectly lit and shaded when the player is close (within 10 meters). However, as soon as the player moves further away, the statue instantly loses all high-frequency shading detail, becoming uniformly black and reflecting light incorrectly, despite being exposed to direct spotlights and the Skylight. This artifact only affects this specific statue asset, while surrounding assets render normally.",
        "estimateHours": 1.62,
        "difficulty": "Intermediate",
        "category": "Lighting & Rendering"
    },
    "setup": [
        {
            "action": "set_ue_property",
            "scenario": "nanite_wpo_failure",
            "step": "step-0"
        }
    ],
    "fault": {
        "description": "Initial problem state",
        "visual_cue": "Visual indicator"
    },
    "expected": {
        "description": "Expected resolved state",
        "validation_action": "verify_fix"
    },
    "fix": [
        {
            "action": "set_ue_property",
            "scenario": "nanite_wpo_failure",
            "step": "final"
        }
    ],
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "nanite",
            "title": "Step 1",
            "prompt": "<p>Use the level search filter to isolate and select the problematic statue Actor in the Outliner.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Use the level search filter to isolate and select the problematic statue Actor in the Outliner.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-2"
                },
                {
                    "text": "Attempt: Adjusting the Skylight intensity or disabling the Post Process Volume, assuming the issue is overall exposure or lighting brightness.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.25 hrs lost.",
                    "next": "step-1"
                },
                {
                    "text": "Increase the Skylight's Source Cubemap resolution.",
                    "type": "plausible",
                    "feedback": "Cubemap resolution affects reflections, not distance shading artifacts. +0.2 hrs.",
                    "next": "step-1"
                },
                {
                    "text": "Check if the mesh has a custom depth stencil mask applied.",
                    "type": "subtle",
                    "feedback": "Depth stencil affects rendering passes, not Nanite/Lumen GI. +0.1 hrs.",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "nanite",
            "title": "Step 2",
            "prompt": "<p>Verify the Actor's lighting settings on the Static Mesh Component (e.g., Mobility is Static or Stationary, and 'Affect Global Illumination' is enabled).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Verify the Actor's lighting settings on the Static Mesh Component (e.g., Mobility is Static or Stationary, and 'Affect Global Illumination' is enabled).",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-3"
                },
                {
                    "text": "Attempt: Toggling Lumen settings (like Final Gather Quality) in Project Settings, as the issue is localized to one asset, not a global GI failure.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.3 hrs lost.",
                    "next": "step-2"
                },
                {
                    "text": "Increase the Skylight's Source Cubemap resolution.",
                    "type": "plausible",
                    "feedback": "Cubemap resolution affects reflections, not distance shading artifacts. +0.2 hrs.",
                    "next": "step-2"
                },
                {
                    "text": "Check if the mesh has a custom depth stencil mask applied.",
                    "type": "subtle",
                    "feedback": "Depth stencil affects rendering passes, not Nanite/Lumen GI. +0.1 hrs.",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "nanite",
            "title": "Step 3",
            "prompt": "<p>Switch the viewport rendering mode to 'Visualize -> Lumen Global Illumination' and observe that the statue is black in the distance view, confirming a Lumen/Nanite shading cache failure related to the asset's geometry.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Switch the viewport rendering mode to 'Visualize -> Lumen Global Illumination' and observe that the statue is black in the distance view, confirming a Lumen/Nanite shading cache failure related to the asset's geometry.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-4"
                },
                {
                    "text": "Attempt: Disabling Nanite on the Static Mesh Asset entirely (which fixes the symptom but avoids the necessary WPO/Nanite interaction fix).",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.15 hrs lost.",
                    "next": "step-3"
                },
                {
                    "text": "Verify the mesh isn't marked as hidden in game.",
                    "type": "plausible",
                    "feedback": "The mesh is visible - the issue is shading, not visibility. +0.15 hrs.",
                    "next": "step-3"
                },
                {
                    "text": "Check the ray tracing quality settings in Project Settings.",
                    "type": "subtle",
                    "feedback": "Ray tracing is separate from Lumen software GI. +0.12 hrs.",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "nanite",
            "title": "Step 4",
            "prompt": "<p>Switch to the 'Visualize -> Nanite' view mode (e.g., Clusters) to confirm the asset is indeed Nanite enabled, which is necessary context for the bug.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Switch to the 'Visualize -> Nanite' view mode (e.g., Clusters) to confirm the asset is indeed Nanite enabled, which is necessary context for the bug.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-5"
                },
                {
                    "text": "Attempt: Attempting to manually build lighting, assuming it is a traditional lightmap issue, ignoring that Lumen is active.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.1 hrs lost.",
                    "next": "step-4"
                },
                {
                    "text": "Check the ray tracing quality settings in Project Settings.",
                    "type": "subtle",
                    "feedback": "Ray tracing is separate from Lumen software GI. +0.12 hrs.",
                    "next": "step-4"
                },
                {
                    "text": "Check the mesh's LOD settings and force a specific LOD level.",
                    "type": "plausible",
                    "feedback": "LOD settings don't affect Nanite meshes in the same way. +0.2 hrs.",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "nanite",
            "title": "Step 5",
            "prompt": "<p>Identify the Master Material applied to the statue by checking the Static Mesh Component details or the Static Mesh Asset itself.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Identify the Master Material applied to the statue by checking the Static Mesh Component details or the Static Mesh Asset itself.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-6"
                },
                {
                    "text": "Attempt: Adjusting the Skylight intensity or disabling the Post Process Volume, assuming the issue is overall exposure or lighting brightness.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.25 hrs lost.",
                    "next": "step-5"
                },
                {
                    "text": "Rebuild the Lumen scene cache from the Build menu.",
                    "type": "subtle",
                    "feedback": "Lumen scene data is dynamic and doesn't require manual rebuilding. +0.15 hrs.",
                    "next": "step-5"
                },
                {
                    "text": "Increase the Skylight's Source Cubemap resolution.",
                    "type": "plausible",
                    "feedback": "Cubemap resolution affects reflections, not distance shading artifacts. +0.2 hrs.",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "nanite",
            "title": "Step 6",
            "prompt": "<p>Open the Master Material of the statue to inspect its properties.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Open the Master Material of the statue to inspect its properties.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-7"
                },
                {
                    "text": "Attempt: Toggling Lumen settings (like Final Gather Quality) in Project Settings, as the issue is localized to one asset, not a global GI failure.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.3 hrs lost.",
                    "next": "step-6"
                },
                {
                    "text": "Increase the Skylight's Source Cubemap resolution.",
                    "type": "plausible",
                    "feedback": "Cubemap resolution affects reflections, not distance shading artifacts. +0.2 hrs.",
                    "next": "step-6"
                },
                {
                    "text": "Check if the mesh has a custom depth stencil mask applied.",
                    "type": "subtle",
                    "feedback": "Depth stencil affects rendering passes, not Nanite/Lumen GI. +0.1 hrs.",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "nanite",
            "title": "Step 7",
            "prompt": "<p>In the Material Details panel, under the Usage category, verify that the checkbox 'Uses World Position Offset' is checked, confirming WPO is active.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: In the Material Details panel, under the Usage category, verify that the checkbox 'Uses World Position Offset' is checked, confirming WPO is active.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-8"
                },
                {
                    "text": "Attempt: Disabling Nanite on the Static Mesh Asset entirely (which fixes the symptom but avoids the necessary WPO/Nanite interaction fix).",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.15 hrs lost.",
                    "next": "step-7"
                },
                {
                    "text": "Rebuild the Lumen scene cache from the Build menu.",
                    "type": "subtle",
                    "feedback": "Lumen scene data is dynamic and doesn't require manual rebuilding. +0.15 hrs.",
                    "next": "step-7"
                },
                {
                    "text": "Increase the Skylight's Source Cubemap resolution.",
                    "type": "plausible",
                    "feedback": "Cubemap resolution affects reflections, not distance shading artifacts. +0.2 hrs.",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "nanite",
            "title": "Step 8",
            "prompt": "<p>Analyze the World Position Offset output node logic in the Material Graph to ensure the WPO magnitude is reasonable and not outputting NaN (Not a Number) or extremely large values that could corrupt the bounding box or Nanite data. (Requires careful review of scalar parameters).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Analyze the World Position Offset output node logic in the Material Graph to ensure the WPO magnitude is reasonable and not outputting NaN (Not a Number) or extremely large values that could corrupt the bounding box or Nanite data. (Requires careful review of scalar parameters).",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-9"
                },
                {
                    "text": "Attempt: Attempting to manually build lighting, assuming it is a traditional lightmap issue, ignoring that Lumen is active.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.1 hrs lost.",
                    "next": "step-8"
                },
                {
                    "text": "Check the ray tracing quality settings in Project Settings.",
                    "type": "subtle",
                    "feedback": "Ray tracing is separate from Lumen software GI. +0.12 hrs.",
                    "next": "step-8"
                },
                {
                    "text": "Check the mesh's LOD settings and force a specific LOD level.",
                    "type": "plausible",
                    "feedback": "LOD settings don't affect Nanite meshes in the same way. +0.2 hrs.",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "nanite",
            "title": "Step 9",
            "prompt": "<p>Close the Material Editor and open the problematic Static Mesh Asset (the statue mesh) by double-clicking it in the Content Browser.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Close the Material Editor and open the problematic Static Mesh Asset (the statue mesh) by double-clicking it in the Content Browser.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-10"
                },
                {
                    "text": "Attempt: Adjusting the Skylight intensity or disabling the Post Process Volume, assuming the issue is overall exposure or lighting brightness.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.25 hrs lost.",
                    "next": "step-9"
                },
                {
                    "text": "Rebuild the Lumen scene cache from the Build menu.",
                    "type": "subtle",
                    "feedback": "Lumen scene data is dynamic and doesn't require manual rebuilding. +0.15 hrs.",
                    "next": "step-9"
                },
                {
                    "text": "Increase the Skylight's Source Cubemap resolution.",
                    "type": "plausible",
                    "feedback": "Cubemap resolution affects reflections, not distance shading artifacts. +0.2 hrs.",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "nanite",
            "title": "Step 10",
            "prompt": "<p>In the Static Mesh Editor's Details panel, locate the 'Nanite Settings' group.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: In the Static Mesh Editor's Details panel, locate the 'Nanite Settings' group.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-11"
                },
                {
                    "text": "Attempt: Toggling Lumen settings (like Final Gather Quality) in Project Settings, as the issue is localized to one asset, not a global GI failure.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.3 hrs lost.",
                    "next": "step-10"
                },
                {
                    "text": "Increase the Skylight's Source Cubemap resolution.",
                    "type": "plausible",
                    "feedback": "Cubemap resolution affects reflections, not distance shading artifacts. +0.2 hrs.",
                    "next": "step-10"
                },
                {
                    "text": "Check if the mesh has a custom depth stencil mask applied.",
                    "type": "subtle",
                    "feedback": "Depth stencil affects rendering passes, not Nanite/Lumen GI. +0.1 hrs.",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "nanite",
            "title": "Step 11",
            "prompt": "<p>Note the 'Fallback Relative Error' value and confirm it is reasonable (e.g., 5.0), eliminating LOD/proxy mesh quality as the primary cause.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Note the 'Fallback Relative Error' value and confirm it is reasonable (e.g., 5.0), eliminating LOD/proxy mesh quality as the primary cause.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-12"
                },
                {
                    "text": "Attempt: Disabling Nanite on the Static Mesh Asset entirely (which fixes the symptom but avoids the necessary WPO/Nanite interaction fix).",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.15 hrs lost.",
                    "next": "step-11"
                },
                {
                    "text": "Check if the mesh has a custom depth stencil mask applied.",
                    "type": "subtle",
                    "feedback": "Depth stencil affects rendering passes, not Nanite/Lumen GI. +0.1 hrs.",
                    "next": "step-11"
                },
                {
                    "text": "Verify the mesh isn't marked as hidden in game.",
                    "type": "plausible",
                    "feedback": "The mesh is visible - the issue is shading, not visibility. +0.15 hrs.",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "nanite",
            "title": "Step 12",
            "prompt": "<p>Scroll down to the 'World Position Offset Settings' within the Nanite Settings group.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Scroll down to the 'World Position Offset Settings' within the Nanite Settings group.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-13"
                },
                {
                    "text": "Attempt: Attempting to manually build lighting, assuming it is a traditional lightmap issue, ignoring that Lumen is active.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.1 hrs lost.",
                    "next": "step-12"
                },
                {
                    "text": "Increase the Skylight's Source Cubemap resolution.",
                    "type": "plausible",
                    "feedback": "Cubemap resolution affects reflections, not distance shading artifacts. +0.2 hrs.",
                    "next": "step-12"
                },
                {
                    "text": "Check if the mesh has a custom depth stencil mask applied.",
                    "type": "subtle",
                    "feedback": "Depth stencil affects rendering passes, not Nanite/Lumen GI. +0.1 hrs.",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "nanite",
            "title": "Step 13",
            "prompt": "<p>Change the critical 'WPO Evaluation Mode' property from 'Disabled' (or 'Manual') to 'Enabled' (or 'Auto'), which forces Nanite to correctly evaluate WPO when generating its proxy representation for Lumen and distant views.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Change the critical 'WPO Evaluation Mode' property from 'Disabled' (or 'Manual') to 'Enabled' (or 'Auto'), which forces Nanite to correctly evaluate WPO when generating its proxy representation for Lumen and distant views.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-14"
                },
                {
                    "text": "Attempt: Adjusting the Skylight intensity or disabling the Post Process Volume, assuming the issue is overall exposure or lighting brightness.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.25 hrs lost.",
                    "next": "step-13"
                },
                {
                    "text": "Rebuild the Lumen scene cache from the Build menu.",
                    "type": "subtle",
                    "feedback": "Lumen scene data is dynamic and doesn't require manual rebuilding. +0.15 hrs.",
                    "next": "step-13"
                },
                {
                    "text": "Increase the Skylight's Source Cubemap resolution.",
                    "type": "plausible",
                    "feedback": "Cubemap resolution affects reflections, not distance shading artifacts. +0.2 hrs.",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "nanite",
            "title": "Step 14",
            "prompt": "<p>Apply Changes and Save the Static Mesh Asset to force Nanite data regeneration.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Apply Changes and Save the Static Mesh Asset to force Nanite data regeneration.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-15"
                },
                {
                    "text": "Attempt: Toggling Lumen settings (like Final Gather Quality) in Project Settings, as the issue is localized to one asset, not a global GI failure.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.3 hrs lost.",
                    "next": "step-14"
                },
                {
                    "text": "Check if the mesh has a custom depth stencil mask applied.",
                    "type": "subtle",
                    "feedback": "Depth stencil affects rendering passes, not Nanite/Lumen GI. +0.1 hrs.",
                    "next": "step-14"
                },
                {
                    "text": "Verify the mesh isn't marked as hidden in game.",
                    "type": "plausible",
                    "feedback": "The mesh is visible - the issue is shading, not visibility. +0.15 hrs.",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "nanite",
            "title": "Step 15",
            "prompt": "<p>Close the Static Mesh Editor and return to the Level Editor.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Close the Static Mesh Editor and return to the Level Editor.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-16"
                },
                {
                    "text": "Attempt: Disabling Nanite on the Static Mesh Asset entirely (which fixes the symptom but avoids the necessary WPO/Nanite interaction fix).",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.15 hrs lost.",
                    "next": "step-15"
                },
                {
                    "text": "Check the mesh's LOD settings and force a specific LOD level.",
                    "type": "plausible",
                    "feedback": "LOD settings don't affect Nanite meshes in the same way. +0.2 hrs.",
                    "next": "step-15"
                },
                {
                    "text": "Rebuild the Lumen scene cache from the Build menu.",
                    "type": "subtle",
                    "feedback": "Lumen scene data is dynamic and doesn't require manual rebuilding. +0.15 hrs.",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "nanite",
            "title": "Step 16",
            "prompt": "<p>If the issue persists, locate the specific Static Mesh Component on the Actor in the scene again.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: If the issue persists, locate the specific Static Mesh Component on the Actor in the scene again.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-17"
                },
                {
                    "text": "Attempt: Attempting to manually build lighting, assuming it is a traditional lightmap issue, ignoring that Lumen is active.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.1 hrs lost.",
                    "next": "step-16"
                },
                {
                    "text": "Check the mesh's LOD settings and force a specific LOD level.",
                    "type": "plausible",
                    "feedback": "LOD settings don't affect Nanite meshes in the same way. +0.2 hrs.",
                    "next": "step-16"
                },
                {
                    "text": "Rebuild the Lumen scene cache from the Build menu.",
                    "type": "subtle",
                    "feedback": "Lumen scene data is dynamic and doesn't require manual rebuilding. +0.15 hrs.",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "nanite",
            "title": "Step 17",
            "prompt": "<p>Check the component's 'Rendering' category for 'Support Global Illumination' and ensure it is enabled, confirming component level GI support is active.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Check the component's 'Rendering' category for 'Support Global Illumination' and ensure it is enabled, confirming component level GI support is active.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "step-18"
                },
                {
                    "text": "Attempt: Adjusting the Skylight intensity or disabling the Post Process Volume, assuming the issue is overall exposure or lighting brightness.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.25 hrs lost.",
                    "next": "step-17"
                },
                {
                    "text": "Verify the mesh isn't marked as hidden in game.",
                    "type": "plausible",
                    "feedback": "The mesh is visible - the issue is shading, not visibility. +0.15 hrs.",
                    "next": "step-17"
                },
                {
                    "text": "Check the ray tracing quality settings in Project Settings.",
                    "type": "subtle",
                    "feedback": "Ray tracing is separate from Lumen software GI. +0.12 hrs.",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "nanite",
            "title": "Step 18",
            "prompt": "<p>Verify that moving away and back to the statue now preserves correct lighting, shading, and Lumen GI contribution across all distances.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "Perform Action: Verify that moving away and back to the statue now preserves correct lighting, shading, and Lumen GI contribution across all distances.",
                    "type": "correct",
                    "feedback": "Correct! You completed this step.",
                    "next": "conclusion"
                },
                {
                    "text": "Attempt: Toggling Lumen settings (like Final Gather Quality) in Project Settings, as the issue is localized to one asset, not a global GI failure.",
                    "type": "wrong",
                    "feedback": "Incorrect. 0.3 hrs lost.",
                    "next": "step-18"
                },
                {
                    "text": "Increase the Skylight's Source Cubemap resolution.",
                    "type": "plausible",
                    "feedback": "Cubemap resolution affects reflections, not distance shading artifacts. +0.2 hrs.",
                    "next": "step-18"
                },
                {
                    "text": "Check if the mesh has a custom depth stencil mask applied.",
                    "type": "subtle",
                    "feedback": "Depth stencil affects rendering passes, not Nanite/Lumen GI. +0.1 hrs.",
                    "next": "step-18"
                }
            ]
        },
        "conclusion": {
            "skill": "nanite",
            "title": "Scenario Complete",
            "prompt": "<p>You have successfully resolved the issue!</p>",
            "choices": [{"text": "Complete Scenario", "type": "correct", "feedback": "", "next": "end"}]
        }
    }
};