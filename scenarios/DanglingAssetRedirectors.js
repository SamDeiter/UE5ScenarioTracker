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
            "skill": "general",
            "title": "Identify Initial Clues",
            "prompt": "<p>Static meshes display pink/black checkers, and a Level Blueprint sequence fails, logging 'Failed to load object' for a particle system. What is your first action?</p>",
            "choices": [
                {
                    "text": "<p>Examine the Output Log for 'Failed to load object' warnings to identify the specific asset path.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The Output Log provides direct clues to asset loading failures and problematic paths, making it an excellent starting point.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Check Project Settings -> Packaging settings, assuming the issue is related to excluded content or the Asset Registry cache.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. While packaging settings are relevant for builds, this problem points to live editor references being broken, not content exclusion. This diverts focus from the core issue.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Immediately open one of the pink/black materials in the Material Editor to manually re-link its textures.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This is a premature fix for a symptom, not the root cause. Without understanding the scope of broken references, this could be very inefficient.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Restart the Unreal Editor, hoping it will automatically re-index assets and fix references.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While sometimes helpful for minor cache issues, this problem requires a specific asset management fix and is unlikely to resolve itself with a restart.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "editor",
            "title": "Locate Affected Material",
            "prompt": "<p>The Output Log indicates a 'Failed to load object' for a texture. This points to a material issue. How do you investigate the material?</p>",
            "choices": [
                {
                    "text": "<p>Locate one of the affected Material Instances (the pink/black ones) in the Content Browser.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Identifying an affected material instance is the next logical step to trace its dependencies and understand where the chain of broken references begins.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Manually open the broken Materials in the Material Editor and attempt to drag-and-drop the textures into the graph again.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. This is highly tedious, addresses only one material at a time, and does not fix the underlying issue of redirectors or external Blueprint references.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Delete the static meshes that are displaying pink/black materials and replace them with new ones.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This is a destructive action that doesn't solve the core problem of broken asset references and would result in significant rework.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Run 'Fix Up Redirectors in Folder' on the new 'Content/Environment/Shared' folder immediately.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This command is typically run on the *old* folder containing redirectors, not the new one where the assets now reside. This would be ineffective and premature.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "editor",
            "title": "Inspect Material Dependencies",
            "prompt": "<p>You have an affected Material Instance selected in the Content Browser. How can you confirm its texture dependencies are indeed broken?</p>",
            "choices": [
                {
                    "text": "<p>Right-click the Material Instance and select 'Reference Viewer' to visually inspect the dependency graph.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The Reference Viewer is the most effective tool for visualizing asset dependencies and confirming if upstream assets (like textures) are linked to old, non-existent folder structures.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Open the Material Instance editor and check its parameters for any obvious errors.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.03hrs. While the Material Instance editor is useful for parameter adjustments, it doesn't clearly display the *path* of the base texture asset itself, which is the current problem.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Try to apply a different, known-good material to the static mesh in the level to see if that renders correctly.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.02hrs. This is a diagnostic step for the mesh, not for identifying the specific reference issue within the problematic material itself.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Check the 'References' tab in the Details panel of the Material Instance.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.03hrs. The Details panel can show some references, but the Reference Viewer provides a more comprehensive, visual, and intuitive dependency graph for path issues.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "editor",
            "title": "Enable Redirector Visibility",
            "prompt": "<p>The Reference Viewer confirms upstream textures are still linked to an old, non-existent folder. What's the next step to address these stale references?</p>",
            "choices": [
                {
                    "text": "<p>Open the Content Browser settings menu (gear icon in the corner) and ensure 'Show Redirectors' is checked.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Enabling 'Show Redirectors' is a critical step to make the placeholder assets visible that manage old references after an asset move.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Restart the Unreal Editor, as Reference Viewer data might be cached incorrectly.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.03hrs. The Reference Viewer correctly identified the issue. Restarting won't enable redirector visibility if the setting isn't explicitly checked.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Search the Content Browser for the missing texture by its name to locate its new path.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.02hrs. While you know the new path, the current goal is to fix the *old* references, not just re-find the new asset. This doesn't resolve the redirector issue.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Manually recreate the old folder structure so the references have a path to follow.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This would create empty folders and not actually link assets correctly, leading to further confusion and no actual fix.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "editor",
            "title": "Navigate to Old Location",
            "prompt": "<p>'Show Redirectors' is now enabled. You need to find where the broken references are actively being maintained. Where do you navigate in the Content Browser?</p>",
            "choices": [
                {
                    "text": "<p>Navigate the Content Browser to the original folder location (e.g., 'Content/OldAssets/Textures').</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. You must go to the *old* location where the assets once resided, as this is where redirectors are left behind.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Navigate to the new folder location ('Content/Environment/Shared') to inspect the moved assets.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.02hrs. The assets are confirmed to be in the new location. The problem is the old references, which are handled by redirectors in the old location.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Check the 'Recently Opened' tab in the Content Browser for the missing assets.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.01hrs. This tab shows recently accessed assets, not necessarily the specific location of broken references or redirectors.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Perform a global 'Search' in the Content Browser for 'redirector'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.03hrs. While you might find redirectors this way, it's more efficient and targeted to navigate directly to the known old folder path.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "editor",
            "title": "Identify Redirectors",
            "prompt": "<p>You are in the original folder location with 'Show Redirectors' enabled. What visual clues should you be looking for?</p>",
            "choices": [
                {
                    "text": "<p>Observe the grey arrow icons, which represent the asset redirectors left behind after the folder move.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. These grey arrow icons are the specific visual indicators of redirector assets that need to be addressed.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Delete the old empty folders immediately without first enabling 'Show Redirectors' and running the 'Fix Up Redirectors in Folder' command.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. CRITICAL WRONG STEP. Deleting the folders prematurely will remove the redirectors without updating existing references, leading to permanent broken links.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Look for the actual texture assets, assuming they might have somehow reappeared in the old folder.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.02hrs. The textures were moved; they will not spontaneously reappear in the old folder unless explicitly duplicated.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Check the folder's properties for any 'moved' flags or indicators.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.02hrs. Unreal Engine does not expose direct 'moved' flags on folders; redirectors are the mechanism for handling moved assets.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "editor",
            "title": "Select Redirectors",
            "prompt": "<p>You see the grey arrow icons (redirectors) in the old folder. What is your next action to prepare for fixing them?</p>",
            "choices": [
                {
                    "text": "<p>Select all assets within the original folder path, including the redirectors (Ctrl+A if the folder only contains redirectors).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Selecting the redirectors is the necessary precursor to executing the 'Fix Up Redirectors in Folder' command.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Right-click on the folder background and look for a 'Fix' option.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.02hrs. While a 'Fix Redirectors' option can sometimes appear on the folder background, selecting the specific assets first is a more direct and universally applicable method.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Manually drag each redirector icon to the new 'Content/Environment/Shared' folder.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This is an incorrect and ineffective way to fix redirectors; they are not files to be physically dragged and dropped in this manner.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Delete the redirectors one by one to clear the old folder.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This would delete the redirectors without fixing the incoming references, causing permanent broken links and worsening the problem.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "editor",
            "title": "Execute Redirector Fix",
            "prompt": "<p>The redirectors in the old folder are now selected. Which action will effectively resolve these broken references?</p>",
            "choices": [
                {
                    "text": "<p>Right-click the selected assets and choose 'Fix Up Redirectors in Folder' from the context menu.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. This command is specifically designed to repoint all references that were pointing to the redirectors to their new, actual asset locations.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Use the 'Migrate' option on the selected redirectors to move them to the new folder.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Migrate' is used for transferring assets between different projects, not for fixing redirectors within the same project. This would be a misuse of the tool.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Try renaming the redirectors to match the new asset names.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.03hrs. Redirectors are special placeholder assets; simply renaming them will not fix the underlying reference paths in other assets.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Export the redirectors and then re-import them into the new folder.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Exporting/importing redirectors is not a standard or effective workflow for resolving internal project references.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "editor",
            "title": "Confirm Fix",
            "prompt": "<p>After choosing 'Fix Up Redirectors in Folder', a confirmation dialog appears. What is your response?</p>",
            "choices": [
                {
                    "text": "<p>Confirm the dialog box to allow the engine to attempt to repoint all incoming references to the new asset location.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. Confirmation is necessary for the engine to proceed with the redirector fix, which will update all affected references.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Cancel the dialog, as you're unsure if this is the correct action.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.02hrs. Canceling at this stage prevents the crucial fix from being applied, leaving the references broken.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Spend time reviewing each individual reference listed in the dialog box carefully before proceeding.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While thorough, for a folder-level fix-up, trusting the engine to handle the repointing for a large number of references is standard and efficient.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Take a screenshot of the dialog for documentation before confirming.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.01hrs. Documentation is good practice, but taking a screenshot at this moment doesn't actively contribute to solving the problem and adds a small delay.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "editor",
            "title": "Verify Redirector Removal",
            "prompt": "<p>The 'Fix Up Redirectors' command has been executed and confirmed. How do you verify its success in the Content Browser?</p>",
            "choices": [
                {
                    "text": "<p>Verify that the redirector assets (grey arrows) are now removed from the old folder location.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. The successful removal of redirectors from the old location is the primary visual confirmation that references have been repointed.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Restart the editor to ensure all internal caches are updated and reflect the fix.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.03hrs. While a restart can sometimes help, the Content Browser should reflect the change immediately after a 'Fix Up Redirectors' operation.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Check the Output Log for a confirmation message that redirectors were fixed.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.01hrs. While the log might contain relevant messages, visual confirmation in the Content Browser for redirector removal is more direct and specific to this step.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Navigate to the new folder location and confirm the assets are still there.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.02hrs. This step confirms the assets' presence in the new location, but the current task is to verify the *removal* of redirectors from the old location.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "editor",
            "title": "Clean Up Old Folder",
            "prompt": "<p>The old folder ('Content/OldAssets/Textures') is now empty of redirectors and other assets. What is the best practice for this now-obsolete folder?</p>",
            "choices": [
                {
                    "text": "<p>If the old folder is now truly empty, delete it to prevent future confusion.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Deleting empty, obsolete folders is a good project organization practice, reducing clutter and preventing confusion.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Leave the empty folder, as it causes no harm and might be needed later.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.01hrs. Empty folders can clutter the Content Browser, making navigation and asset management more difficult in the long run.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Move the empty folder to a 'Deprecated' subfolder within the Content directory.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.02hrs. While sometimes done for deprecated assets, a truly empty folder that served its purpose can simply be deleted to keep the project clean.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Create a new dummy asset in the folder to indicate it was once used.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.01hrs. This serves no practical purpose and adds unnecessary files to the project.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "editor",
            "title": "Final Material Verification",
            "prompt": "<p>Redirectors have been fixed, and the old folder is cleaned up. How do you definitively confirm that the materials are now correctly linked to their textures?</p>",
            "choices": [
                {
                    "text": "<p>Re-open the Reference Viewer for the affected Material Instance to confirm that its upstream Texture Sample nodes now correctly point to the 'Content/Environment/Shared' path.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.04hrs. Re-checking the Reference Viewer provides definitive, visual proof that the material's dependencies are correctly resolved to the new asset location.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Assume the materials are fixed and proceed to check the Level Blueprint.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.03hrs. Verification is crucial in debugging; never assume a fix without explicit confirmation.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Manually open each affected Material and Material Instance in their editors to visually check texture assignments.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This is a very time-consuming method for verification. The Reference Viewer offers a much quicker and more comprehensive way to check paths.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Run a 'Validate Assets' command from the Content Browser's context menu.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.03hrs. While 'Validate Assets' can be useful, it might not provide as clear and direct path information as the Reference Viewer for this specific problem.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "editor",
            "title": "In-Level Visual Check",
            "prompt": "<p>The Reference Viewer confirms the material's texture paths are now correct. What is the next visual confirmation you should perform directly in the level?</p>",
            "choices": [
                {
                    "text": "<p>Verify that all static meshes in the level that were previously pink/black now display their correct materials.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. This is the direct visual confirmation that the material assignment issue is fully resolved within the level itself.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Rebuild the level's lighting and geometry, just in case that affects material rendering.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Rebuilding lighting is primarily for lighting issues, not for resolving broken material references, and is a time-consuming step.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Check the 'Material Slot' assignments on the static meshes in the Details panel.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.02hrs. The material slots themselves should already be correctly assigned; the problem was with the material *asset* having a broken internal reference.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Apply a completely new, known-good material to one of the affected meshes to see if it renders correctly.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.02hrs. This primarily confirms the mesh itself isn't corrupt, but doesn't verify the fix for the *original* materials that were the problem.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "blueprint",
            "title": "Address Blueprint References",
            "prompt": "<p>All static meshes in the level now display correct materials. The last remaining issue is the Level Blueprint sequence failing. What's required to update the Blueprint's references?</p>",
            "choices": [
                {
                    "text": "<p>Open the Level Blueprint, recompile it, and save the map to force the engine to refresh the Blueprint's internal asset dependencies.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.07hrs. Blueprints can cache asset references. A recompile and save are often necessary to force them to pick up corrected asset paths and resolve internal errors.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Delete the Particle System Component node from the Level Blueprint and recreate it.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This is a destructive and often unnecessary action; a simple recompile and save should be sufficient to update references.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Check the Project Settings -> Maps & Modes to ensure the correct Level Blueprint is loaded.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.02hrs. This isn't related to internal asset references within an already loaded and active Level Blueprint.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Modify a small, unrelated detail in the Level Blueprint, then undo it, hoping it triggers a recompile.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.03hrs. While this might indirectly trigger a recompile, explicitly compiling and saving is a clearer, more reliable, and direct approach.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "general",
            "title": "Final Runtime Verification",
            "prompt": "<p>The Level Blueprint has been recompiled and saved, and all assets appear linked correctly. What is the final step to confirm everything is resolved at runtime?</p>",
            "choices": [
                {
                    "text": "<p>Run the level (PIE) and trigger the sequence that previously failed to verify the particle system now spawns correctly without logging errors.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Running in Play In Editor (PIE) provides the definitive live runtime test for the particle system's functionality and confirms the complete resolution of all issues.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Close and reopen the entire Unreal Editor one last time to ensure all changes are fully propagated.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.02hrs. At this stage, PIE is the most direct and efficient test. Closing and reopening the editor is largely unnecessary for this final verification.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Generate a standalone build of the project to check if the particle system works outside the editor.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. Packaging a full build is a time-consuming process and is generally overkill for a verification that can be performed efficiently in PIE.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Use console commands like 'stat particles' to check if the particle system is present in the scene.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.02hrs. 'stat particles' provides performance information for active particles, but doesn't confirm if the *sequence* successfully spawned the particle system without errors, which is the core test here.</p>",
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
