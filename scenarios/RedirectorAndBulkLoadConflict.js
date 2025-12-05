window.SCENARIOS['RedirectorAndBulkLoadConflict'] = {
    "meta": {
        "title": "Corrupted Texture Reference After Migration",
        "description": "A high-fidelity environmental prop (a large metallic statue) suddenly appears black and untextured in the level viewport, instead of its intended polished gold look. We recently moved the asset and its associated textures to a new folder structure. Opening the Material Instance reveals that all scalar and vector parameters are correct, and the material asset appears to be assigned, but the visual preview in the Material Instance Editor is also incorrect, showing a dull grey reflection suggesting the base texture inputs are failing to load.",
        "estimateHours": 1.35,
        "category": "Asset Management"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "asset_management",
            "title": "Step 1",
            "prompt": "<p>Locate the statue Static Mesh in the Level and identify the assigned Material Instance (MI_Statue_Polished).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate the statue Static Mesh in the Level and identify the assigned Material Instance (MI_Statue_Polished).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Deleting and manually re-importing the texture, failing to realize the redirectors still exist and are pointing other assets to the old path.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "asset_management",
            "title": "Step 2",
            "prompt": "<p>Double-click MI_Statue_Polished to open the Material Instance Editor and verify that all texture parameters (Normal Map, Base Color Texture) are pointing to valid assets by name, but the preview sphere is visually incorrect.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Double-click MI_Statue_Polished to open the Material Instance Editor and verify that all texture parameters (Normal Map, Base Color Texture) are pointing to valid assets by name, but the preview sphere is visually incorrect.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Attempting to rebuild level lighting or reflection captures, assuming the issue is lighting-related rather than asset-reference related.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "asset_management",
            "title": "Step 3",
            "prompt": "<p>Navigate to the Parent Material (M_Master_Metal) from the Material Instance Editor and examine the Texture Sample nodes that are failing to render, specifically the T_Statue_Normal texture input.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Navigate to the Parent Material (M_Master_Metal) from the Material Instance Editor and examine the Texture Sample nodes that are failing to render, specifically the T_Statue_Normal texture input.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Creating a brand new Material Instance and attempting to assign the texture, which will fail because the reference issue is on the texture asset itself, not the material instance.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "asset_management",
            "title": "Step 4",
            "prompt": "<p>Confirm that while the Material Instance specifies the texture, the Parent Material editor shows the Texture Sample node defaulting to 'None' or producing an error, indicating the reference lookup is failing on asset load.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Confirm that while the Material Instance specifies the texture, the Parent Material editor shows the Texture Sample node defaulting to 'None' or producing an error, indicating the reference lookup is failing on asset load.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Deleting and manually re-importing the texture, failing to realize the redirectors still exist and are pointing other assets to the old path.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "asset_management",
            "title": "Step 5",
            "prompt": "<p>Search the Content Browser for the texture T_Statue_Normal, right-click the asset, and select 'Reference Viewer' to inspect its dependency graph and check for redirector chains pointing back to the old, invalid directory structure.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Search the Content Browser for the texture T_Statue_Normal, right-click the asset, and select 'Reference Viewer' to inspect its dependency graph and check for redirector chains pointing back to the old, invalid directory structure.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Attempting to rebuild level lighting or reflection captures, assuming the issue is lighting-related rather than asset-reference related.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "asset_management",
            "title": "Step 6",
            "prompt": "<p>Identify the folder that still contains the broken redirectors (often the source folder prior to the move).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Identify the folder that still contains the broken redirectors (often the source folder prior to the move).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Creating a brand new Material Instance and attempting to assign the texture, which will fail because the reference issue is on the texture asset itself, not the material instance.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "asset_management",
            "title": "Step 7",
            "prompt": "<p>In the Content Browser, right-click the folder identified in the previous step and select 'Fix Up Redirectors in Folder' to resolve the obsolete reference paths.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Content Browser, right-click the folder identified in the previous step and select 'Fix Up Redirectors in Folder' to resolve the obsolete reference paths.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Deleting and manually re-importing the texture, failing to realize the redirectors still exist and are pointing other assets to the old path.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "asset_management",
            "title": "Step 8",
            "prompt": "<p>Verify the Reference Viewer again. The dependency chain should look cleaner, but the statue still renders incorrectly (this confirms the redirectors were a problem, but not the only one).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify the Reference Viewer again. The dependency chain should look cleaner, but the statue still renders incorrectly (this confirms the redirectors were a problem, but not the only one).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Attempting to rebuild level lighting or reflection captures, assuming the issue is lighting-related rather than asset-reference related.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "asset_management",
            "title": "Step 9",
            "prompt": "<p>Double-click the T_Statue_Normal texture asset itself to open the Texture Editor.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Double-click the T_Statue_Normal texture asset itself to open the Texture Editor.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Creating a brand new Material Instance and attempting to assign the texture, which will fail because the reference issue is on the texture asset itself, not the material instance.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "asset_management",
            "title": "Step 10",
            "prompt": "<p>In the Texture Editor Details panel, search for the 'Loading' section.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Texture Editor Details panel, search for the 'Loading' section.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Deleting and manually re-importing the texture, failing to realize the redirectors still exist and are pointing other assets to the old path.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "asset_management",
            "title": "Step 11",
            "prompt": "<p>Observe that the setting 'Force Bulk Load' is currently enabled (This setting, combined with a messy redirector, prevents reliable path resolution at editor load time).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Observe that the setting 'Force Bulk Load' is currently enabled (This setting, combined with a messy redirector, prevents reliable path resolution at editor load time).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Attempting to rebuild level lighting or reflection captures, assuming the issue is lighting-related rather than asset-reference related.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "asset_management",
            "title": "Step 12",
            "prompt": "<p>Uncheck the 'Force Bulk Load' checkbox.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Uncheck the 'Force Bulk Load' checkbox.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Creating a brand new Material Instance and attempting to assign the texture, which will fail because the reference issue is on the texture asset itself, not the material instance.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "asset_management",
            "title": "Step 13",
            "prompt": "<p>Save the modified T_Statue_Normal texture asset.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Save the modified T_Statue_Normal texture asset.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Deleting and manually re-importing the texture, failing to realize the redirectors still exist and are pointing other assets to the old path.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "asset_management",
            "title": "Step 14",
            "prompt": "<p>Close and reopen the Material Instance (MI_Statue_Polished) to force the engine to reload the dependency structure with the fixed loading setting.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Close and reopen the Material Instance (MI_Statue_Polished) to force the engine to reload the dependency structure with the fixed loading setting.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Attempting to rebuild level lighting or reflection captures, assuming the issue is lighting-related rather than asset-reference related.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "asset_management",
            "title": "Step 15",
            "prompt": "<p>Verify that the statue now renders correctly in the level viewport and that the texture preview in the Material Instance Editor is accurate.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify that the statue now renders correctly in the level viewport and that the texture preview in the Material Instance Editor is accurate.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Creating a brand new Material Instance and attempting to assign the texture, which will fail because the reference issue is on the texture asset itself, not the material instance.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
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
