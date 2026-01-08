window.SCENARIOS['DanglingAssetRedirectors'] = {
    "meta": {
        "title": "Broken References After Folder Restructure",
        "description": "A recent reorganization of project files moved critical textures and associated material instances from 'Content/OldAssets/Textures' to 'Content/Environment/Shared'. After the move, several static meshes in the level now display the default missing material (pink/black checkers). Furthermore, a vital sequence triggered by the Level Blueprint fails to execute, throwing a log warning about 'Failed to load object' when trying to spawn a specific Particle System Component that relies on one of the moved texture assets. The assets appear correctly in the new folder location, but the old references are somehow still active and corrupting runtime behavior.",
        "estimateHours": 0.75,
        "category": "Asset Management",
        "tokens_used": 10287
    },
    "setup": [
        {
            "action": "set_ue_property",
            "scenario": "DanglingAssetRedirectors",
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
            "scenario": "DanglingAssetRedirectors",
            "step": "final"
        }
    ],
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "general",
            "title": "Initial Observation & Log Check",
            "prompt": "<p>Several static meshes in the level display missing materials (pink/black checkers). A vital Level Blueprint sequence fails, logging 'Failed to load object' for a Particle System Component. Assets appear correct in their new folder.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Examine the Output Log for the 'Failed to load object' warning to identify the specific asset path that is failing to load.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The Output Log is the primary source for runtime errors like failed object loads.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Open the project settings and navigate to the 'Packaging' section, checking for excluded content or issues with the Asset Registry.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. This issue is not related to packaging or the Asset Registry cache. Focus on active references.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Immediately try to locate the particle system in the Content Browser and re-assign its textures.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. This is a premature action without fully understanding the root cause or tracing the specific broken reference.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Right-click on a pink/black mesh in the viewport and select 'Find in Content Browser' to manually re-assign the material.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. This is a tedious approach that only addresses the visual symptom for one asset and won't fix underlying references or Blueprint issues.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "content-browser",
            "title": "Identify Affected Asset",
            "prompt": "<p>The Output Log identifies <code>/Game/OldAssets/Textures/T_MyTexture.T_MyTexture</code> as a failed object. What's your next move to trace the issue?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate one of the affected Material Instances (the ones currently displaying pink/black) in the Content Browser.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Material Instances directly consume textures and are a good starting point to trace upstream references.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Navigate directly to the <code>Content/Environment/Shared</code> folder to verify the <code>T_MyTexture</code> asset is present there.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. The scenario states assets appear correctly in the new folder. This step confirms nothing new about the broken references.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Open the <code>T_MyTexture</code> asset in the Texture Editor to check its properties.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The texture itself is likely valid; the problem is how other assets are *referencing* it.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Examine the properties of the static meshes displaying pink/black in the Details panel to see which material is assigned.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While it confirms the material assignment, it doesn't help trace *why* the material is broken.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "content-browser",
            "title": "Inspect Dependencies with Reference Viewer",
            "prompt": "<p>You've found an affected Material Instance in the Content Browser. How do you confirm its dependencies are pointing to the wrong locations?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Right-click the Material Instance and select 'Reference Viewer' to visually inspect the dependency graph.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The Reference Viewer is the most effective tool to see all incoming and outgoing references for an asset.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Manually open the Material Instance in the Material Editor and look for broken texture links.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. This is tedious, error-prone, and only shows direct texture references, not wider external Blueprint references.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Attempt to compile the Material Instance by clicking the 'Apply' button in its editor, hoping it refreshes.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Compiling a material won't fix incorrect asset paths or redirectors; it only processes the material's internal logic.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Check the 'Details' panel of the Material Instance for any 'Missing Reference' warnings.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The Details panel might show some properties, but it won't give a comprehensive view of the dependency graph like the Reference Viewer.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "content-browser",
            "title": "Enable Redirector Visibility",
            "prompt": "<p>The Reference Viewer confirms the Material Instance links to textures in the old folder (<code>/Game/OldAssets/Textures</code>). How do you find and fix these lingering old references?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Content Browser settings menu (gear icon in the corner) and ensure the 'Show Redirectors' option is checked.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Redirectors are crucial for resolving moved asset references, and they must be visible to be fixed.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Attempt to delete the <code>Content/OldAssets/Textures</code> folder directly from the Content Browser.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Deleting the folder prematurely will prevent redirectors from being fixed, potentially breaking more references permanently.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Restart the Unreal Engine editor, assuming it will refresh asset paths.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While restarting can clear some caches, it won't automatically resolve persistent redirector issues from moved assets.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Use the 'Fix Up Redirectors' command on the <em>new</em> <code>Content/Environment/Shared</code> folder.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Redirectors are left behind in the *old* folder, not created in the new one. The command needs to be run on the old location.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "content-browser",
            "title": "Navigate to Old Folder",
            "prompt": "<p>'Show Redirectors' is now enabled. Where do you go in the Content Browser to find the problem assets?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Navigate the Content Browser to the original folder location (<code>Content/OldAssets/Textures</code>).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. This is where the redirectors are located, awaiting a fix-up.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Search for <code>T_MyTexture</code> directly in the Content Browser search bar, filtering by \"Redirectors\".</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While you could find individual redirectors, fixing them in bulk via the folder is more efficient and thorough.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Navigate to the root 'Content' folder and manually browse all subfolders for redirectors.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. You already know the problematic path; manually browsing the entire content folder is inefficient.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Check the 'Developer Tools' menu for a 'Redirector Management' option.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. There isn't a dedicated 'Redirector Management' menu entry; the 'Fix Up Redirectors' command is contextual.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "content-browser",
            "title": "Observe Redirectors",
            "prompt": "<p>You are in <code>Content/OldAssets/Textures</code>. What visual cue confirms the presence of redirectors?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Observe the grey arrow icons, which represent the asset redirectors left behind after the folder move.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. Grey arrow icons are the distinct visual indicator for redirector assets in the Content Browser.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Look for red 'X' icons or other error indicators on the asset thumbnails.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Red 'X' icons usually indicate a missing file or a critical loading error, not a redirector.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Check the file size of the assets in the folder; if they are very small, they might be redirectors.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While redirectors are small, relying on file size is an indirect and less reliable method than the visual icon.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Right-click on an asset and check its 'Reference Viewer' again.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This step is for viewing *incoming* references to an asset, not for identifying an asset *as* a redirector itself.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "content-browser",
            "title": "Select Redirectors for Fix",
            "prompt": "<p>You've identified the redirectors in the old folder. How do you select them for correction?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select all assets within the original folder path, including the redirectors.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Selecting all ensures all redirectors in that folder are processed by the fix-up command.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Delete all non-redirector assets in the folder first, then select the redirectors.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This is an unnecessary and potentially destructive step if the folder still contained legitimate assets.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Hold Ctrl and individually select each grey arrow icon.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This is less efficient than a bulk select if there are many redirectors. 'Select all' works best for folders expected to contain only redirectors.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Drag the redirector assets from the old folder to the new <code>Content/Environment/Shared</code> folder.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. This would attempt to 'move' the redirectors, not fix the references they represent. It could lead to more issues.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "content-browser",
            "title": "Execute Fix Up Redirectors",
            "prompt": "<p>With the redirectors selected, what specific command updates all incoming references?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Right-click the selected assets and choose 'Fix Up Redirectors in Folder' from the context menu.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. This command is specifically designed to re-point all references that lead to the redirectors to their new, correct locations.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Go to 'File > Save All' to force a re-save of all assets.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Save All' saves current asset states but does not execute the logic to resolve redirectors and update their references.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Choose 'Migrate' from the context menu to move them again.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Migrate' is for moving assets between projects, not for fixing references within the current project after an internal move.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Select 'Validate Assets' from the context menu to check for errors.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Validate Assets' checks for issues but does not perform any automatic fixes for redirectors.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "general",
            "title": "Confirm Fix Up Dialog",
            "prompt": "<p>A dialog box appears asking for confirmation to fix up redirectors.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Confirm the dialog box to allow the engine to attempt to repoint all incoming references to the new asset location.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. Confirmation is necessary for the engine to proceed with the redirector fix-up.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Cancel the dialog, unsure of the consequences.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Canceling the dialog prevents the fix from being applied, leaving the references broken.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Attempt to find an 'Undo' button in case something goes wrong.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This specific action does not have an 'Undo' function in the traditional sense; a backup is needed for critical changes.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Close the dialog box without confirming, assuming it will apply automatically.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Closing without confirmation is the same as canceling; the changes will not be applied.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "content-browser",
            "title": "Verify Redirector Removal",
            "prompt": "<p>After 'Fix Up Redirectors' completes, what should you immediately check in the Content Browser?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify that the redirector assets (grey arrows) are now removed from the old folder location.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. This visual check confirms that the 'Fix Up Redirectors' command successfully performed its task.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Immediately run PIE to see if the meshes are fixed.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This is premature. Further verification and cleanup steps are needed before a full runtime test.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Check the new <code>Content/Environment/Shared</code> folder to see if the actual assets are still there.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The actual assets were never moved from this location; this check confirms nothing new about the fix.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Re-open the 'Reference Viewer' for the Material Instance to confirm its links.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While a good later step, the immediate verification should be that the redirectors themselves are gone from the old location.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "content-browser",
            "title": "Clean Up Empty Folder",
            "prompt": "<p>The <code>Content/OldAssets/Textures</code> folder is now empty of redirectors. What is the best practice for this empty folder?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Delete the old folder to prevent future confusion and maintain project hygiene.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Empty folders add clutter and can lead to confusion. Deleting them is good practice once confident they're no longer needed.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Leave the empty folder, as it causes no harm.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While not immediately harmful, leaving empty folders contributes to project clutter and makes asset management harder.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Mark the folder as 'Exclude from packaging' in its properties.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This is unnecessary for an already empty folder and doesn't address the clutter in the Content Browser.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Rename the folder to <code>Content/OldAssets/Textures_DELETED</code>.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While it indicates intent, actual deletion is cleaner if the folder is truly empty and no longer needed.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "content-browser",
            "title": "Re-verify Material Instance References",
            "prompt": "<p>The old folder has been cleaned up. How do you reconfirm the affected Material Instance links to the new textures?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Re-open the Reference Viewer for the affected Material Instance to confirm that its upstream Texture Sample nodes now correctly point to the <code>Content/Environment/Shared</code> path.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.04hrs. The Reference Viewer provides definitive proof that the underlying asset paths for the Material Instance have been updated.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Open the Material Instance in the Material Editor and manually check each texture sample node.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This is still a tedious approach. The Reference Viewer is faster and ensures all dependencies are checked, not just those visible in the editor.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Re-import the problematic textures into the new folder location.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The textures were already correctly moved. Re-importing them is unnecessary and won't fix existing references.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Check the Content Browser's 'Audit Assets' tool for any remaining broken references.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The 'Audit Assets' tool can be useful, but for a known specific asset, the Reference Viewer is more direct for confirmation.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "editor",
            "title": "Visual Material Verification",
            "prompt": "<p>The Material Instance's references are verified. What's the visual confirmation step in the level?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify that all static meshes in the level that were previously pink/black now display their correct materials.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. This confirms that the material fix has propagated to the geometry using it in the level.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Reload the entire level from scratch to force a refresh.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Reloading the level is generally unnecessary as material changes should be reflected immediately after the fix.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Re-apply the materials to the static meshes in the level manually.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. This is tedious and unnecessary, as fixing the material itself should automatically update all meshes using it.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Open a fresh new level and check if the materials appear correctly there.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This is irrelevant to the current level's issues and doesn't confirm the fix in the affected scene.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "blueprint",
            "title": "Address Level Blueprint",
            "prompt": "<p>Static meshes display correctly. The Level Blueprint sequence is still failing. What's the next step to address this?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Level Blueprint to inspect its nodes and events related to the failed sequence.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. The Level Blueprint is where the sequence logic resides, so inspecting it is the direct next step.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Try restarting the engine again to clear any Level Blueprint caches.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Restarting the engine is generally a last resort and won't fix logic or refresh specific asset references within a Blueprint.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>In the Content Browser, right-click on the Level Blueprint asset and choose 'Find References'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While 'Find References' is useful, opening the blueprint itself gives a direct view of its internal logic and references.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Check the 'World Settings' panel for any level-specific asset overrides.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. World Settings are unlikely to be the cause of a 'Failed to load object' warning originating from a Blueprint's attempt to spawn a component.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "blueprint",
            "title": "Recompile Level Blueprint",
            "prompt": "<p>You've opened the Level Blueprint. What action is needed to ensure it properly registers the fixed asset paths for the Particle System Component?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Recompile the Level Blueprint.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Recompiling forces the Blueprint to re-evaluate its asset references and internal logic, picking up the corrected paths.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Delete and recreate the particle system spawn node in the Level Blueprint.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This is a destructive and unnecessary step. Recompiling should be sufficient if the underlying asset is fixed.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Close the Level Blueprint and reopen it.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Closing and reopening doesn't guarantee a full recompile; the 'Compile' button must be explicitly used.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Search the Level Blueprint for any 'Failed to load object' warnings directly within the graph.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Runtime load errors primarily appear in the Output Log, not necessarily as visual warnings directly in the Blueprint graph.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "editor",
            "title": "Save Level Blueprint Changes",
            "prompt": "<p>The Level Blueprint has been recompiled. What is a crucial final step for these changes to persist within the level?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Save the map (File -> Save Current Level).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Saving the map ensures all changes to the Level Blueprint and its associated assets are permanently stored.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Save the Level Blueprint asset only.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While the Level Blueprint is an asset, its state within the map context often requires the map itself to be saved.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Attempt to 'Cook Content' for the entire project.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Cooking content is part of the packaging process and is not relevant for ensuring editor-time changes are saved.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Close the editor and reopen it.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Closing without explicitly saving might lead to loss of recent changes, requiring the fix to be redone.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "editor",
            "title": "Run Play In Editor (PIE)",
            "prompt": "<p>The Level Blueprint is compiled and map saved. How do you test the complete fix for the Particle System Component?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Run the level in Play In Editor (PIE).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. PIE is the fastest and most direct way to test runtime behavior within the editor.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Launch the game in a standalone build.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Launching a standalone build is too slow for quick iteration and testing during a debugging session.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Simulate the level without playing.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Simulation might not trigger the full Level Blueprint sequence or accurately represent actual gameplay conditions.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Use the 'High Res Screenshot' tool.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This tool is for visual captures, completely unrelated to testing runtime functionality or a particle system spawn.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "editor",
            "title": "Trigger Sequence In PIE",
            "prompt": "<p>The level is running in PIE. What action is required to verify the particle system fix?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Trigger the specific sequence in the level that previously failed to spawn the particle system.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. Directly triggering the problematic sequence is essential to confirm its proper execution and asset loading.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Walk around the level aimlessly, hoping the sequence triggers itself.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This is an inefficient and unreliable way to test a specific, known sequence. You need to actively trigger it.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Open the console and use a debug command to force the particle system to spawn.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While possible, this bypasses the Level Blueprint's intended trigger, so it wouldn't verify the sequence fix.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Check the Content Browser while in PIE to see if the particle system asset is loaded.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This confirms the asset is in memory but not necessarily that it spawns correctly through the sequence.</p>",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "general",
            "title": "Final Verification",
            "prompt": "<p>The sequence has been triggered. How do you confirm the particle system now spawns correctly and without errors?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Observe the spawned particle system visually and check the Output Log for any remaining 'Failed to load object' warnings.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Visual confirmation combined with log verification covers both the expected behavior and the absence of errors.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Assume it's fixed because the meshes are now correct.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. The particle system issue is distinct from the material issue. Never assume; always verify directly.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Check the console for 'stat particle' commands.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. 'stat particle' provides performance information, not confirmation of successful asset loading or spawning logic.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Stop PIE and immediately open the Level Blueprint again to see if any new errors appeared.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Runtime errors would appear in the Output Log during PIE, not typically as new errors in the Blueprint graph after stopping.</p>",
                    "next": "step-19"
                }
            ]
        },
        "step-20": {
            "skill": "general",
            "title": "Scenario Complete",
            "prompt": "<p>All issues appear resolved and verified. Is there any final general action for good measure?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Clear the Output Log to prepare for future debugging, ensuring a clean slate.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. Clearing the log is good practice to remove irrelevant old messages and focus on new ones during future debugging.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Re-organize all assets in the project.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This is an excessive and unrelated action to the immediate debugging task. Stick to the problem at hand.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Close Unreal Engine and reboot the computer.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. This is an unnecessary and time-consuming action if all issues are confirmed as resolved within the editor.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Delete the Particle System asset from the <code>Content/Environment/Shared</code> folder.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. This would reintroduce the problem! The asset is now correctly referenced and functional.</p>",
                    "next": "step-20"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario.</p>",
            "choices": [{"text": "Complete Scenario", "type": "correct", "feedback": "", "next": "end"}]
        }
    }
};
