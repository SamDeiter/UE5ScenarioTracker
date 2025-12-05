window.SCENARIOS['DanglingAssetRedirectors'] = {
    "meta": {
        "title": "Broken References After Folder Restructure",
        "description": "A recent reorganization of project files moved critical textures and associated material instances from 'Content/OldAssets/Textures' to 'Content/Environment/Shared'. After the move, several static meshes in the level now display the default missing material (pink/black checkers). Furthermore, a vital sequence triggered by the Level Blueprint fails to execute, throwing a log warning about 'Failed to load object' when trying to spawn a specific Particle System Component that relies on one of the moved texture assets. The assets appear correctly in the new folder location, but the old references are somehow still active and corrupting runtime behavior.",
        "estimateHours": 0.75,
        "category": "Asset Management"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "asset_management",
            "title": "Step 1",
            "prompt": "<p>Examine the Output Log for the 'Failed to load object' warning to identify the specific asset path that is failing to load (it will likely still reference the old folder structure).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Examine the Output Log for the 'Failed to load object' warning to identify the specific asset path that is failing to load (it will likely still reference the old folder structure).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Manually opening the broken Materials in the Material Editor and attempting to drag-and-drop the textures into the graph again, which is tedious and does not fix external Blueprint references.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "asset_management",
            "title": "Step 2",
            "prompt": "<p>Locate one of the affected Material Instances (the ones currently displaying pink/black) in the Content Browser.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate one of the affected Material Instances (the ones currently displaying pink/black) in the Content Browser.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.02hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Checking Project Settings -> Packaging settings, assuming the issue is related to excluded content or the Asset Registry cache.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "asset_management",
            "title": "Step 3",
            "prompt": "<p>Right-click the Material Instance and select 'Reference Viewer' to visually inspect the dependency graph and confirm that upstream assets (like textures) are still linked to the old, now non-existent, folder structure.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Right-click the Material Instance and select 'Reference Viewer' to visually inspect the dependency graph and confirm that upstream assets (like textures) are still linked to the old, now non-existent, folder structure.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Trying to delete the old empty folders immediately without first enabling 'Show Redirectors' and running the 'Fix Up Redirectors in Folder' command.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "asset_management",
            "title": "Step 4",
            "prompt": "<p>Open the Content Browser settings menu (gear icon in the corner) and ensure the 'Show Redirectors' option is checked.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Content Browser settings menu (gear icon in the corner) and ensure the 'Show Redirectors' option is checked.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Manually opening the broken Materials in the Material Editor and attempting to drag-and-drop the textures into the graph again, which is tedious and does not fix external Blueprint references.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "asset_management",
            "title": "Step 5",
            "prompt": "<p>Navigate the Content Browser to the original folder location (e.g., 'Content/OldAssets/Textures').</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Navigate the Content Browser to the original folder location (e.g., 'Content/OldAssets/Textures').</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.02hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Checking Project Settings -> Packaging settings, assuming the issue is related to excluded content or the Asset Registry cache.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "asset_management",
            "title": "Step 6",
            "prompt": "<p>Observe the grey arrow icons, which represent the asset redirectors left behind after the folder move.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Observe the grey arrow icons, which represent the asset redirectors left behind after the folder move.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.01hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Trying to delete the old empty folders immediately without first enabling 'Show Redirectors' and running the 'Fix Up Redirectors in Folder' command.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "asset_management",
            "title": "Step 7",
            "prompt": "<p>Select all assets within the original folder path, including the redirectors (Ctrl+A if the folder only contains redirectors).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select all assets within the original folder path, including the redirectors (Ctrl+A if the folder only contains redirectors).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Manually opening the broken Materials in the Material Editor and attempting to drag-and-drop the textures into the graph again, which is tedious and does not fix external Blueprint references.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "asset_management",
            "title": "Step 8",
            "prompt": "<p>Right-click the selected assets and choose 'Fix Up Redirectors in Folder' from the context menu.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Right-click the selected assets and choose 'Fix Up Redirectors in Folder' from the context menu.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Checking Project Settings -> Packaging settings, assuming the issue is related to excluded content or the Asset Registry cache.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "asset_management",
            "title": "Step 9",
            "prompt": "<p>Confirm the dialog box to allow the engine to attempt to repoint all incoming references to the new asset location.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Confirm the dialog box to allow the engine to attempt to repoint all incoming references to the new asset location.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.01hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Trying to delete the old empty folders immediately without first enabling 'Show Redirectors' and running the 'Fix Up Redirectors in Folder' command.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "asset_management",
            "title": "Step 10",
            "prompt": "<p>Verify that the redirector assets (grey arrows) are now removed from the old folder location.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify that the redirector assets (grey arrows) are now removed from the old folder location.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.02hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Manually opening the broken Materials in the Material Editor and attempting to drag-and-drop the textures into the graph again, which is tedious and does not fix external Blueprint references.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "asset_management",
            "title": "Step 11",
            "prompt": "<p>If the old folder is now truly empty, delete it to prevent future confusion.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>If the old folder is now truly empty, delete it to prevent future confusion.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.02hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Checking Project Settings -> Packaging settings, assuming the issue is related to excluded content or the Asset Registry cache.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "asset_management",
            "title": "Step 12",
            "prompt": "<p>Re-open the Reference Viewer for the affected Material Instance to confirm that its upstream Texture Sample nodes now correctly point to the 'Content/Environment/Shared' path.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Re-open the Reference Viewer for the affected Material Instance to confirm that its upstream Texture Sample nodes now correctly point to the 'Content/Environment/Shared' path.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.04hrs. Correct approach.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Trying to delete the old empty folders immediately without first enabling 'Show Redirectors' and running the 'Fix Up Redirectors in Folder' command.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "asset_management",
            "title": "Step 13",
            "prompt": "<p>Verify that all static meshes in the level that were previously pink/black now display their correct materials.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify that all static meshes in the level that were previously pink/black now display their correct materials.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Manually opening the broken Materials in the Material Editor and attempting to drag-and-drop the textures into the graph again, which is tedious and does not fix external Blueprint references.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "asset_management",
            "title": "Step 14",
            "prompt": "<p>Open the Level Blueprint, recompile it, and save the map to force the engine to refresh the Blueprint's internal asset dependencies.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Level Blueprint, recompile it, and save the map to force the engine to refresh the Blueprint's internal asset dependencies.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.07hrs. Correct approach.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Checking Project Settings -> Packaging settings, assuming the issue is related to excluded content or the Asset Registry cache.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "asset_management",
            "title": "Step 15",
            "prompt": "<p>Run the level (PIE) and trigger the sequence that previously failed to verify the particle system now spawns correctly without logging errors.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Run the level (PIE) and trigger the sequence that previously failed to verify the particle system now spawns correctly without logging errors.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Trying to delete the old empty folders immediately without first enabling 'Show Redirectors' and running the 'Fix Up Redirectors in Folder' command.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
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
