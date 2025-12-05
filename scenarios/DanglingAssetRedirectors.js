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
            "title": "Step 1: Initial Assessment",
            "prompt": "<p>Static meshes are pink/black. A Level Blueprint sequence fails with 'Failed to load object' warnings. What's your first step?</p>",
            "choices": [
                {
                    "text": "<p>Examine the Output Log for 'Failed to load object' warnings.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The Output Log is the primary source for runtime errors and asset loading failures.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Manually open one of the broken Materials in the Material Editor to see if textures are missing.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. While you'd see missing textures, this is a reactive approach and won't identify the root cause or systemic issues like references from Blueprints.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Check Project Settings &rarr; Packaging settings, assuming the issue is related to excluded content.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.15hrs. Packaging settings are unlikely to affect editor-time asset loading, especially for assets that are visibly present in the Content Browser.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Restart the Unreal Engine 5 editor and re-open the project.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. While sometimes helpful for transient issues, this is a speculative action that rarely fixes fundamental asset reference problems.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "editor",
            "title": "Step 2: Output Log Review",
            "prompt": "<p>The Output Log is open. What are you specifically looking for?</p>",
            "choices": [
                {
                    "text": "<p>Identify the 'Failed to load object' warnings to pinpoint specific asset paths.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. These warnings directly indicate which assets cannot be found and often reveal the incorrect (old) paths they're still referenced by.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Search for shader compilation errors (e.g., 'Shader compilation failed').</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Shader errors might cause visual issues, but the 'Failed to load object' warnings are more specific to the core problem of missing references.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Look for 'LogDDC' warnings related to the Derived Data Cache.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. DDC issues can cause slowdowns or temporary visual glitches, but not usually persistent 'Failed to load object' errors for source assets.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Filter the log for general 'Error' messages and ignore warnings.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. You risk missing crucial information, as 'Failed to load object' is often a warning that still indicates a critical issue.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "asset_management",
            "title": "Step 3: Locate Affected Asset",
            "prompt": "<p>You've identified a failing texture path from the Output Log. How do you investigate one of the affected materials in the editor?</p>",
            "choices": [
                {
                    "text": "<p>Locate one of the affected Material Instances (the ones displaying pink/black) in the Content Browser.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Starting from a directly affected asset is the most efficient way to trace the issue.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Open the problematic Particle System asset identified in the Level Blueprint error.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While the Particle System is affected, its material/texture dependencies are the deeper root. Start with the material.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Search for the missing texture file by name directly in the Content Browser.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The texture likely exists in the new location, but the *reference* is broken. Searching by name won't directly show the broken reference.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Re-import the texture file into the Content Browser, overwriting the existing one.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This might replace the asset but won't fix existing references that still point to the old (now non-existent) path.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "asset_management",
            "title": "Step 4: Use Reference Viewer",
            "prompt": "<p>You have an affected Material Instance. How can you efficiently see what assets it depends on, and if those dependencies are pointing to old paths?</p>",
            "choices": [
                {
                    "text": "<p>Right-click the Material Instance and select 'Reference Viewer'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The Reference Viewer is crucial for visualizing an asset's dependencies and identifying incorrect paths.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Open the Material Instance in the Material Editor and check the texture sample nodes.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. This is tedious for many materials and doesn't give a clear overview of the reference chain or show *why* the path is broken.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Check the Details panel of the Material Instance for its parent material or associated textures.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The Details panel shows immediate properties but not the full dependency graph or explicit paths for broken references.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Try to drag the Material Instance to a new folder to see if it fixes the references.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Moving an asset is not a diagnostic step and won't fix upstream references to its dependencies.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "asset_management",
            "title": "Step 5: Interpret Reference Viewer",
            "prompt": "<p>Reference Viewer shows upstream texture assets still pointing to the 'Content/OldAssets/Textures' path. What does this clearly indicate?</p>",
            "choices": [
                {
                    "text": "<p>The engine's internal references are still pointing to the old, non-existent locations, despite the actual assets being moved.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. This confirms the core problem: the engine's asset database hasn't fully updated its references.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>The texture files themselves were accidentally deleted from disk during the reorganization.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While possible, the scenario states assets appear correctly in the new folder. The issue is references, not file deletion.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>The material itself is corrupted and needs to be manually rebuilt or re-imported.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. The material isn't corrupted; its *references* are outdated. Rebuilding would be a lot of unnecessary work.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>The project needs to be migrated to a new blank project to fix all references.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.5hrs. This is an extreme and often unnecessary step, especially for a known reference issue.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "asset_management",
            "title": "Step 6: Recognizing the Redirector Problem",
            "prompt": "<p>Given the asset move and broken references, what Unreal Engine mechanism is designed to handle references to moved files, and is likely causing this issue?</p>",
            "choices": [
                {
                    "text": "<p>Unreal Engine creates 'redirector' assets in old locations to manage incoming references to moved files.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. Redirectors are precisely what handles asset moves and often cause issues if not 'fixed up'.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>The Asset Registry automatically updates all references, so this shouldn't be happening.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The Asset Registry *tries* to, but redirectors are a fallback that needs manual intervention to fully resolve.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>The DDC (Derived Data Cache) is corrupted and needs to be cleared.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. DDC issues affect derived data, not source asset references.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>The project's source control system (e.g., Git, Perforce) needs to sync a previous version.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. While source control is important, this isn't a sync issue; it's an internal UE reference issue after a move.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "editor",
            "title": "Step 7: Enable Show Redirectors",
            "prompt": "<p>You suspect redirectors are present. How do you make them visible in the Content Browser to confirm?</p>",
            "choices": [
                {
                    "text": "<p>Open the Content Browser settings menu (gear icon) and ensure 'Show Redirectors' is checked.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. This setting makes the hidden redirector assets visible, allowing you to interact with them.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Go to Project Settings &rarr; Content &rarr; Asset Management to find redirector options.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. The 'Asset Management' section in Project Settings has various options, but not the 'Show Redirectors' toggle which is a Content Browser view setting.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Use the console command 'ShowRedirectors true' in the output log.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. There is no such console command for Content Browser settings; it's a UI option.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Delete the 'Intermediate' and 'Saved' folders from the project directory.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This is a destructive action that won't make redirectors visible or directly fix references.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "editor",
            "title": "Step 8: Navigate to Old Folder",
            "prompt": "<p>With 'Show Redirectors' enabled, where should you navigate in the Content Browser to find the problematic redirectors?</p>",
            "choices": [
                {
                    "text": "<p>Navigate to the original folder location (e.g., 'Content/OldAssets/Textures').</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Redirectors are left behind in the *original* location of the moved assets.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Navigate to the new folder location ('Content/Environment/Shared') where the assets now reside.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The actual assets are there, but the redirectors that point *to* them are in the old location.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Search for 'redirector' in the Content Browser search bar.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While this might show some, navigating directly to the known old path is more targeted and efficient.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Look for a 'Broken Redirectors' tab or panel in the editor.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. No such dedicated UI panel exists for managing redirectors; they are treated as regular assets for this purpose.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "editor",
            "title": "Step 9: Observe Redirectors",
            "prompt": "<p>You're in 'Content/OldAssets/Textures' with 'Show Redirectors' enabled. What visual cue confirms the presence of redirectors?</p>",
            "choices": [
                {
                    "text": "<p>Observe the grey arrow icons on the asset thumbnails.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. These distinctive grey arrows visually represent redirector assets.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Look for missing texture icons (pink/black checkers) on the thumbnails.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Missing texture icons indicate a broken material, but redirectors are distinct assets with their own specific icon.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Check for a warning message on the folder itself indicating orphaned assets.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The Content Browser doesn't typically display such warnings directly on folders for redirectors.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>The assets appear as generic 'Unknown' type icons.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Unknown icons typically signify corrupted or unreadable assets, not standard redirectors.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "asset_management",
            "title": "Step 10: Select Redirectors",
            "prompt": "<p>You've located the redirectors in the old folder. What's the next step to prepare for fixing them?</p>",
            "choices": [
                {
                    "text": "<p>Select all assets within the original folder path, including the redirectors.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. To fix all references pointing to this old folder, you must select all redirectors within it.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Select only the folders that *contain* redirectors, not the redirector assets themselves.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The 'Fix Up Redirectors in Folder' command operates on selected *assets* (which can include folders with the option to fix recursively), but for explicit redirectors, selecting them is key.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Try to drag and drop the redirectors to the new folder location.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Redirectors are meant to be 'fixed up', not moved like regular assets. This action is ineffective.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Immediately delete the redirectors without running a fix-up command.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. Deleting redirectors without fixing references is detrimental; it leaves references broken with no redirection fallback. This is the 'Wrong Step 3' penalty scenario.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "asset_management",
            "title": "Step 11: Execute 'Fix Up Redirectors'",
            "prompt": "<p>With the redirectors selected, what is the specific command to repoint all incoming references to their new target?</p>",
            "choices": [
                {
                    "text": "<p>Right-click the selected assets and choose 'Fix Up Redirectors in Folder' from the context menu.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. This is the canonical command to update all external references to point directly to the moved assets.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Right-click and choose 'Migrate' to move them again.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Migrate' is for moving assets to *another project*, not for fixing internal references within the current project.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Go to Tools &rarr; Audit &rarr; Find Broken References, then attempt to repair.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While useful for general auditing, 'Fix Up Redirectors' is the direct and most effective solution for this specific problem.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Manually edit the .uasset files in a text editor to change the asset paths.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.5hrs. Modifying .uasset files outside the editor is extremely dangerous, can corrupt assets, and is an external app violation.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "editor",
            "title": "Step 12: Confirm Dialog",
            "prompt": "<p>A confirmation dialog appears, asking to allow the engine to attempt to repoint all incoming references. What do you do?</p>",
            "choices": [
                {
                    "text": "<p>Confirm the dialog to allow the engine to proceed with repointing references.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. This is a critical confirmation for a necessary process.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Cancel the dialog, thinking it might be a destructive operation.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Canceling prevents the fix from being applied, leaving the references broken.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Take a full project backup before proceeding with the confirmation.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While backing up is good practice, it unnecessarily delays a known safe operation and isn't the *next* immediate action.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Click 'No' and search for an alternative method to fix the references.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This is the primary and most robust method. Searching for alternatives would be a waste of time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "editor",
            "title": "Step 13: Verify Redirectors Removed",
            "prompt": "<p>The 'Fix Up Redirectors' command has run and you confirmed it. How do you verify its immediate success in the old folder?</p>",
            "choices": [
                {
                    "text": "<p>Verify that the redirector assets (grey arrows) are now removed from the old folder location.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Successful fix-up means the redirectors are no longer needed and are automatically deleted by the engine.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Check the Content Browser's Output Log for explicit 'Redirectors Fixed' success messages.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While log messages might exist, visual confirmation in the Content Browser is faster and more direct.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Restart the editor to ensure the redirector icons disappear.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The Content Browser usually refreshes immediately after a fix-up; restarting is generally not necessary here.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Immediately delete the old folder without checking for removed redirectors.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Deleting the folder prematurely without verifying could mean references are still broken. This aligns with 'Wrong Step 3'.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "asset_management",
            "title": "Step 14: Delete Empty Old Folder",
            "prompt": "<p>The old folder, 'Content/OldAssets/Textures', is now truly empty after fixing redirectors. What's the best practice?</p>",
            "choices": [
                {
                    "text": "<p>Delete the old empty folder to prevent future confusion and maintain a clean project structure.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. An empty, obsolete folder serves no purpose and can lead to confusion later.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Leave the empty folder, as it does no harm and might be needed later.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While not directly harmful, leaving empty, obsolete folders clutters the Content Browser and makes project navigation less clear.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Rename the folder to 'Content/Deleted_OldAssets' for historical record.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This still clutters the Content Browser. Source control is the appropriate place for historical records.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Move the empty folder to a 'Trash' folder within the project structure.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This is unnecessary and maintains clutter. True deletion is preferred if the folder is truly obsolete.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "asset_management",
            "title": "Step 15: Re-check Material Instance References",
            "prompt": "<p>Redirectors are fixed and the old folder is gone. How do you confirm the Material Instances are now correctly linked?</p>",
            "choices": [
                {
                    "text": "<p>Re-open the Reference Viewer for the affected Material Instance to confirm its upstream Texture Sample nodes now point to the correct path.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.04hrs. Re-checking the Reference Viewer provides definitive proof that the internal paths have been updated.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Check the Material Editor to see if the textures visually reappear in the material graph.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While textures might reappear, the Reference Viewer explicitly shows the underlying paths, which is more robust for confirmation.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Compile all shaders in the project to force a refresh of material references.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. Compiling shaders is about render pipelines, not directly about fixing asset reference paths. It's often unnecessary here.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Manually drag-and-drop the textures into the material graphs again (Wrong Step 1).</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. This is redundant work. The 'Fix Up Redirectors' command should have fixed these connections automatically.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "editor",
            "title": "Step 16: Verify Static Meshes in Level",
            "prompt": "<p>Reference Viewer confirms correct paths for materials. What's the next visual verification step in your level?</p>",
            "choices": [
                {
                    "text": "<p>Verify that all static meshes in the level that were previously pink/black now display their correct materials.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. This is the direct visual confirmation that the material issues in the level have been resolved.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Rebuild lighting for the entire level to ensure materials render correctly.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Lighting rebuild is for baked lighting, not for resolving material assignment issues; it's an unnecessary delay.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Check the Asset Auditor for any remaining broken references across the project.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While a good general check, the most immediate verification is visual confirmation in the level itself.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Restart the engine one more time, hoping it will fully refresh all visuals.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. The visual update should happen instantly after reference fixes; restarting is not needed and causes delay.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "blueprint",
            "title": "Step 17: Address Level Blueprint",
            "prompt": "<p>Static meshes now display correctly. What's the immediate action to address the Level Blueprint's failed sequence?</p>",
            "choices": [
                {
                    "text": "<p>Open the Level Blueprint to inspect the sequence that spawns the Particle System Component.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. The Level Blueprint needs to be opened to allow the engine to detect and prompt for dependency refresh.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Delete and re-create the Particle System Component in the Level Blueprint.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This is a drastic, manual, and often unnecessary step, especially if the core material references are fixed.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Check the Particle System asset itself for errors in its content browser details.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The issue is likely the Blueprint's *reference* to the Particle System, not an intrinsic error within the Particle System itself at this point.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Migrate the Level Blueprint to a new project to ensure clean references.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. This is an extreme and unwarranted action; local fixes are almost always possible.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "blueprint",
            "title": "Step 18: Recompile and Save Level Blueprint",
            "prompt": "<p>The Level Blueprint is open. What steps are required to refresh its asset dependencies and ensure changes are saved?</p>",
            "choices": [
                {
                    "text": "<p>Recompile the Level Blueprint, then save the map to force the engine to refresh the Blueprint's internal asset dependencies.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.04hrs. Recompiling forces the Blueprint to re-evaluate its asset references, and saving the map commits these changes.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Save the map only, assuming recompilation happens automatically when opening the Blueprint.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While the Blueprint might partially refresh, an explicit recompile ensures all dependencies are fully updated.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Validate the Blueprint asset in the Content Browser, then close it.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Validation checks for structural errors but doesn't necessarily force a re-evaluation of external asset paths.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Clear the Blueprint's cache from the editor tools menu.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. There isn't a dedicated 'Blueprint cache clear' option; recompiling handles refresh.</p>",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "general",
            "title": "Step 19: Final Verification (Play In Editor)",
            "prompt": "<p>Blueprint recompiled and map saved. What's the final verification step to ensure the Particle System now spawns correctly without logging errors?</p>",
            "choices": [
                {
                    "text": "<p>Run the level (PIE) and trigger the sequence that previously failed to verify the particle system spawns correctly.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Running PIE and triggering the sequence is the ultimate test for runtime functionality.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Package the project and test the packaged build for final verification.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.5hrs. Packaging is a much longer process than PIE and is not necessary for initial verification of an editor-time fix.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Use console command 'stat game' to check for performance issues after the fix.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While useful for performance, 'stat game' does not directly verify asset loading success.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Perform a 'Check Out' of the entire project from source control.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Source control operations are irrelevant to validating a runtime fix in PIE.</p>",
                    "next": "step-19"
                }
            ]
        },
        "step-20": {
            "skill": "editor",
            "title": "Step 20: Final Log Check",
            "prompt": "<p>The sequence triggered in PIE, and the Particle System appears to be spawning correctly. What final check should you perform to ensure the problem is fully resolved?</p>",
            "choices": [
                {
                    "text": "<p>Review the Output Log for any remaining 'Failed to load object' warnings or new errors related to the sequence.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. A final check of the Output Log confirms no lingering issues or new problems have emerged.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Open the Profiler to ensure the particle system is not causing performance spikes.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Performance profiling is a separate concern from asset loading and reference resolution.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Check World Settings for any relevant level-specific overrides that might interfere.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. World Settings are unlikely to be the cause of 'Failed to load object' warnings at this stage.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Reboot your computer to clear any cached data.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Rebooting is an extreme measure not required for this type of editor-based asset fix.</p>",
                    "next": "step-20"
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
