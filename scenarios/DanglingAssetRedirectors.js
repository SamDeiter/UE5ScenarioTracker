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
            "title": "Initial Assessment",
            "prompt": "<p>You've noticed static meshes in your level displaying pink/black checkers. Additionally, a Level Blueprint sequence fails with a 'Failed to load object' warning in the Output Log. Assets were recently moved. What's your first diagnostic step?</p>",
            "choices": [
                {
                    "text": "<p>Examine the Output Log for the 'Failed to load object' warning.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. The Output Log is the primary place for runtime errors and will often pinpoint the problematic asset path.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Check Project Settings -> Packaging settings, assuming the issue is related to excluded content or the Asset Registry cache.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. While packaging issues can relate to asset loading, this specific 'Failed to load object' error during editor runtime points more directly to broken references within the project rather than packaging configuration. This path won't resolve the immediate problem.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Restart the Unreal Editor and your computer, hoping a fresh start will resolve any caching issues.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Restarting the editor is a common first troubleshooting step, but rarely fixes persistent asset reference issues caused by content reorganization. This won't address the underlying problem.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Navigate to the new 'Content/Environment/Shared' folder and try re-saving all assets within it.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.07hrs. Re-saving assets in their new location won't automatically fix external references that are still pointing to their old, non-existent paths. The engine needs a specific mechanism to update these references.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "assetManagement",
            "title": "Identifying the Root Cause",
            "prompt": "<p>You've opened the Output Log. You see a warning: 'Failed to load object '/Game/OldAssets/Textures/T_BrokenTexture.T_BrokenTexture''. What's your next step to understand how this asset is being referenced?</p>",
            "choices": [
                {
                    "text": "<p>Locate one of the affected Material Instances (displaying pink/black) in the Content Browser.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Since the missing texture likely causes the pink/black material, examining an affected Material Instance is the logical next step to trace its dependencies.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Manually open the Material Editor for the 'missing' material and try to drag-and-drop the texture from its new location.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. This is tedious and only addresses the specific material you're editing. It does not fix other materials or external Blueprint references, nor does it address the underlying redirector issue.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Search the Content Browser for 'T_BrokenTexture' to confirm its presence in the new 'Content/Environment/Shared' folder.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.03hrs. While confirming the asset's new location is useful, it doesn't immediately tell you *why* it's failing to load from the old path. You need to understand the references first.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Delete the 'OldAssets' folder immediately from the Content Browser, assuming it's causing conflicts.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. Deleting the old folder prematurely, especially without understanding redirectors, can make the problem worse and prevent the engine from properly resolving references. This is a critical mistake.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "editor",
            "title": "Investigating Material Dependencies",
            "prompt": "<p>You've found an affected Material Instance in the Content Browser. How do you confirm if its underlying texture assets are still pointing to the old folder structure?</p>",
            "choices": [
                {
                    "text": "<p>Right-click the Material Instance and select 'Reference Viewer'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. The Reference Viewer provides a visual representation of all incoming and outgoing dependencies, perfect for identifying incorrect texture paths.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Open the Material Instance Editor and check the texture sample nodes for path issues.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While you can see the texture path in the Material Instance Editor, the Reference Viewer gives a more comprehensive and clear view of *all* dependencies and helps confirm if it's linking to a broken path visually.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Right-click the Material Instance and select 'Find References in Blueprints'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.03hrs. This is useful for finding where the *Material Instance* itself is used, but not for diagnosing its *internal* texture dependencies. It won't show if the textures it uses are broken.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Examine the 'Details' panel of the Material Instance for any obvious error messages.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.02hrs. The 'Details' panel typically shows material parameters, not direct dependency errors for underlying textures. You need a tool designed for dependency analysis.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "assetManagement",
            "title": "Analyzing Reference Viewer",
            "prompt": "<p>You're in the Reference Viewer. You observe that the Material Instance's upstream Texture Sample nodes still link to '/Game/OldAssets/Textures/T_BrokenTexture'. What's the mechanism that Unreal Engine uses to handle moved assets, and how do you ensure it's visible?</p>",
            "choices": [
                {
                    "text": "<p>Open the Content Browser settings (gear icon) and ensure 'Show Redirectors' is checked.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Redirectors are placeholder assets left behind to guide references to new locations. Ensuring they are visible is crucial for fixing asset paths.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Go to Edit -> Editor Preferences -> Content Editors -> Asset Editor and look for 'Show Moved Asset Paths'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.03hrs. There isn't a specific 'Show Moved Asset Paths' setting in editor preferences that directly addresses this. The 'Show Redirectors' setting in the Content Browser is the correct option.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Search the Content Browser for 'Redirector' to see if any exist.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.02hrs. While you might find redirectors this way, you need to enable 'Show Redirectors' in the Content Browser settings for them to be generally visible and manageable, especially in their original folder locations.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Manually edit the paths in the 'Reference Viewer' directly to point to the new location.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The Reference Viewer is a diagnostic tool, not an editing tool for asset paths. Attempting to directly modify paths here is not possible and would be an incorrect workflow.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "editor",
            "title": "Locating Redirectors",
            "prompt": "<p>'Show Redirectors' is now enabled. Where should you navigate in the Content Browser to find the redirectors that need fixing?</p>",
            "choices": [
                {
                    "text": "<p>Navigate to the original folder location where the assets were moved from (e.g., 'Content/OldAssets/Textures').</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Redirectors are left in the *original* location to point to the new one. This is where they need to be found and fixed.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Navigate to the new folder location ('Content/Environment/Shared') where the assets now reside.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.02hrs. Redirectors are not created in the new location; they are remnants in the old location that point to the new. You won't find them there.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Search the entire Content folder for assets with a 'Redirector' tag.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.03hrs. While this might eventually locate them, it's less efficient than going directly to the known original path. It also doesn't ensure you're addressing only the relevant redirectors.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Go to the 'Developer' content folder as redirectors are often stored there temporarily.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.02hrs. Redirectors are stored precisely where the original asset resided, not in a generic 'Developer' folder. This path is incorrect.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "assetManagement",
            "title": "Identifying Redirector Assets",
            "prompt": "<p>You are in the original folder ('Content/OldAssets/Textures'). What visual cue indicates the presence of redirector assets?</p>",
            "choices": [
                {
                    "text": "<p>Observe the grey arrow icons on the asset thumbnails.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. Grey arrow icons are the distinctive visual indicator for redirector assets in the Content Browser.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Look for assets with a red 'X' icon, indicating broken links.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.01hrs. Red 'X' icons typically indicate completely missing or deleted assets, not redirectors which are active, albeit temporary, pointers.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Check the file size of assets; redirectors usually have a very small file size.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.01hrs. While true that redirectors are small, relying on file size for identification is less direct and visual than their dedicated icon.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Read the asset names; redirectors often have '_redirector' appended to their name.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.01hrs. While some systems might append names, Unreal Engine primarily uses the grey arrow icon for visual identification in the Content Browser.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "editor",
            "title": "Selecting Redirectors",
            "prompt": "<p>You see the grey arrow icons. What is the most efficient way to select all redirectors and other assets (if any) within this original folder to prepare for fixing?</p>",
            "choices": [
                {
                    "text": "<p>Select all assets within the original folder path using Ctrl+A (if the folder only contains redirectors or relevant assets).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Ctrl+A is the quickest way to select all items in a folder, ensuring no redirectors are missed.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Manually click each redirector asset one by one while holding Ctrl.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This is feasible for a few assets but becomes inefficient and prone to error if there are many redirectors. Ctrl+A is much faster.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Right-click the folder itself and look for a 'Select All Redirectors' option.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.02hrs. There isn't a direct 'Select All Redirectors' option by right-clicking the folder. You need to be inside the folder to select its contents.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Use the Content Browser's search bar to filter for redirector assets and then select them.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.04hrs. While filtering is possible, it adds extra steps. If you're in the correct folder, Ctrl+A is more direct for selecting all relevant items.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "assetManagement",
            "title": "Fixing Redirectors",
            "prompt": "<p>With all relevant assets and redirectors in the original folder selected, what is the specific command to update all references pointing to these redirectors?</p>",
            "choices": [
                {
                    "text": "<p>Right-click the selected assets and choose 'Fix Up Redirectors in Folder' from the context menu.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.08hrs. This is the precise command designed to update all incoming references to the new location pointed to by the redirectors.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Right-click and select 'Re-save Selected Assets'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Re-saving assets doesn't trigger the redirector fix-up process. It simply saves their current state, which won't resolve external references.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Drag the selected redirectors to the new 'Content/Environment/Shared' folder.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.03hrs. Moving redirectors is not the correct action. They need to be processed in their original location to fix references, and then deleted.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Use the 'Migrate' option on the selected redirectors.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.04hrs. The 'Migrate' option is for moving assets to another project, not for fixing references within the current project after an internal move.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "general",
            "title": "Confirming the Fix",
            "prompt": "<p>After choosing 'Fix Up Redirectors in Folder', a dialog box appears. What should you do?</p>",
            "choices": [
                {
                    "text": "<p>Confirm the dialog box to allow the engine to attempt to repoint all incoming references.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. Always confirm prompts when performing critical asset operations to ensure the engine proceeds with the intended action.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Cancel the dialog and try a different method, unsure if this is the right approach.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.01hrs. This is the correct method. Canceling will prevent the fix from being applied, leaving your references broken.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Back up your project before confirming, just in case something goes wrong.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While good practice for major changes, for redirector fixes, it's usually safe and quick enough to proceed. Taking a backup now would delay the fix unnecessarily, assuming you have version control.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Select 'Don't ask again' and confirm to speed up future operations.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.02hrs. It's generally not recommended to disable confirmation dialogs for asset management tasks, as they serve as an important safeguard against accidental operations.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "assetManagement",
            "title": "Verifying Redirector Removal",
            "prompt": "<p>You've confirmed the fix. How do you verify that the redirector assets (grey arrows) are now removed from the old folder location?</p>",
            "choices": [
                {
                    "text": "<p>Observe the Content Browser; the grey arrow icons should have disappeared from the old folder.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. After a successful 'Fix Up Redirectors', the redirector assets themselves are removed, leaving the folder empty if only redirectors were present.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Re-open the Reference Viewer for the Material Instance to see if the old paths are gone.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.03hrs. While this is a good verification step later, the immediate visual confirmation in the Content Browser for the redirectors themselves is quicker and directly confirms their removal.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Check the Output Log for confirmation messages about redirector cleanup.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.02hrs. The Output Log might show activity, but the visual confirmation in the Content Browser is the most direct way to verify their removal.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Disable 'Show Redirectors' in Content Browser settings and re-enable it to refresh the view.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.02hrs. While refreshing the view might be helpful in some cases, a successful fix-up should remove the redirectors directly, making this step generally unnecessary for verification.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "editor",
            "title": "Cleaning Up Old Folders",
            "prompt": "<p>The redirectors are gone, and the 'Content/OldAssets/Textures' folder now appears empty. What should you do with this folder?</p>",
            "choices": [
                {
                    "text": "<p>Delete the old folder to prevent future confusion and maintain a clean project structure.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. Once redirectors are fixed and the folder is truly empty, deleting it is good practice to keep the Content Browser tidy and avoid misleading empty folders.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Leave the empty folder as a historical record of asset movements.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.01hrs. Leaving empty folders clutters the Content Browser and can cause confusion. Version control should handle historical records, not empty folders.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Rename the folder to 'Content/OldAssets/Textures_DELETED' as a marker.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.02hrs. Renaming an empty folder isn't necessary and still contributes to clutter. Deletion is the clean solution.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Mark the folder as 'Exclude from package' in its right-click menu.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.02hrs. This is an option for asset folders containing content you don't want to ship, not for empty folders that should be deleted. It doesn't solve the clutter.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "assetManagement",
            "title": "Confirming Material Reference Fix",
            "prompt": "<p>You've cleaned up the old folders. How do you verify that the Material Instance now correctly references its textures from the new 'Content/Environment/Shared' path?</p>",
            "choices": [
                {
                    "text": "<p>Re-open the Reference Viewer for the affected Material Instance to confirm its upstream Texture Sample nodes now point to the correct path.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. The Reference Viewer is the most reliable tool to visually inspect and confirm that all dependencies have been successfully updated to the new asset locations.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Manually open the Material Editor for the Material Instance and check the texture sample nodes.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.03hrs. While this would show the direct texture path, the Reference Viewer offers a more immediate and comprehensive visual confirmation of all upstream dependencies.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Run the level (PIE) to see if the pink/black checkers are gone.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.02hrs. While this is the ultimate goal, it's better to confirm the internal references are fixed using the Reference Viewer first before jumping into PIE for visual verification, reducing potential debugging iterations.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Export the Material Instance and re-import it, hoping it refreshes its paths.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Exporting and re-importing is a destructive and generally unnecessary step that could lead to data loss or further complications. The engine's built-in tools are designed for this.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "editor",
            "title": "Visual Material Verification",
            "prompt": "<p>The Reference Viewer confirms the material now points to the correct paths. What's the next step to visually confirm the fix?</p>",
            "choices": [
                {
                    "text": "<p>Verify that all static meshes in the level that were previously pink/black now display their correct materials.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. A quick visual scan of the level is necessary to confirm the materials are now rendering correctly on all affected meshes.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Rebuild the lighting in the level, as material changes sometimes require it.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Rebuilding lighting is not directly related to material path resolution. It's for static lighting calculations. This is an unnecessary delay.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Check the 'Details' panel of an affected static mesh to ensure its material slot is still assigned correctly.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.02hrs. The material assignment itself wasn't the issue; the material *content* was broken due to missing textures. Visually checking the level is more direct.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Close and re-open the level to force a full refresh of all actors.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.02hrs. While this might force a refresh, simply looking at the level after fixing redirectors should immediately show the updated materials without needing to re-open.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "blueprint",
            "title": "Addressing Blueprint Dependencies",
            "prompt": "<p>The materials in the level are fixed. Now you need to address the Level Blueprint sequence that failed to spawn a Particle System Component. What's required to update the Level Blueprint's internal asset dependencies?</p>",
            "choices": [
                {
                    "text": "<p>Open the Level Blueprint, recompile it, and save the map to force the engine to refresh the Blueprint's internal asset dependencies.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Recompiling and saving the Level Blueprint, and subsequently the map, forces the engine to re-evaluate all asset references within it, ensuring they point to the newly fixed paths.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Delete the Particle System Component in the Level Blueprint and re-add it from scratch.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This is a destructive and unnecessary step. Recompiling and saving is usually sufficient to update references without recreating assets.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>In the Level Blueprint, right-click the 'Spawn Particle System' node and select 'Refresh Node'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.02hrs. While 'Refresh Node' can help with certain issues, it's generally not sufficient for updating deep asset path dependencies across an entire Blueprint. A full recompile is more robust.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Check the Project Settings -> Maps & Modes to see if the Level Blueprint reference is broken there.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.03hrs. Maps & Modes settings relate to which map/game mode loads, not internal asset references *within* a Level Blueprint. This won't help.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "blueprint",
            "title": "Saving the Level Blueprint",
            "prompt": "<p>You've recompiled the Level Blueprint. What's the final necessary step to ensure the changes are saved and recognized by the engine?</p>",
            "choices": [
                {
                    "text": "<p>Save the map (File -> Save Current Level) to persist the Level Blueprint's changes.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.04hrs. Changes to the Level Blueprint are saved as part of the level itself. Saving the map is essential to persist your compilation and updated dependencies.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Right-click the Level Blueprint asset in the Content Browser and select 'Save'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.02hrs. The Level Blueprint is not a standalone asset in the Content Browser. It's intrinsically linked to the map file. You save it by saving the map.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Perform a 'Save All' operation (File -> Save All) to ensure everything is saved.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.01hrs. While 'Save All' works, it's often overkill. Directly saving the current level is sufficient and more targeted.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Close the Level Blueprint editor window, as it usually prompts to save automatically.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.02hrs. Relying on prompts can be risky. Explicitly saving the map guarantees your changes are stored before proceeding.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "editor",
            "title": "Final Runtime Verification - PIE",
            "prompt": "<p>The Level Blueprint is recompiled and the map is saved. What's the final step to confirm everything is working as expected?</p>",
            "choices": [
                {
                    "text": "<p>Run the level (PIE - Play In Editor) and trigger the sequence that previously failed to verify the particle system now spawns correctly without logging errors.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Running PIE is the ultimate test. It verifies that all fixes have correctly updated runtime behavior and that no further 'Failed to load object' errors occur.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Export the level as an Fbx file and then re-import it to refresh all references.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Exporting and re-importing levels is an extremely destructive and unnecessary workflow for fixing asset references within a project. It would likely break more things than it fixes.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Perform a full project rebuild in Visual Studio, assuming it will re-index asset paths.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.10hrs. A C++ project rebuild is for code compilation, not for re-indexing asset paths within the Unreal Editor's asset registry. This is unrelated to the issue.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Check the 'Cooked Content' folder in your project directory to see if the assets are present.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.04hrs. Looking at cooked content is relevant for packaged builds, not for verifying editor runtime behavior. The current issue is within the editor and its asset registry.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "general",
            "title": "Verifying Particle System",
            "prompt": "<p>You've started PIE. What's the final action to confirm the Level Blueprint sequence is fully functional?</p>",
            "choices": [
                {
                    "text": "<p>Trigger the sequence that previously failed and verify the particle system now spawns correctly without logging errors.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. Triggering the specific sequence is the direct way to test if the particle system is now loading and spawning as intended, confirming the complete resolution of the issue.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Review the entire Output Log from the PIE session for any other unrelated warnings or errors.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.02hrs. While good practice for general debugging, the primary focus now is the specific particle system. Reviewing the entire log can come after confirming the main issue is resolved.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Check the 'World Outliner' to see if the particle system actor is present after the sequence attempts to spawn it.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.01hrs. Observing the particle effect visually is generally sufficient. Checking the World Outliner is a secondary confirmation if visual cues are unclear, but not the primary verification.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Attempt to manually place a new instance of the particle system in the level to ensure it functions.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.02hrs. Manually placing it only verifies the asset itself, not that the Level Blueprint sequence successfully spawns it. Testing the sequence directly is key.</p>",
                    "next": "step-17"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario. You effectively used redirector management to fix broken references caused by asset relocation, resolving both material display issues and Blueprint runtime failures.</p>",
            "choices": []
        }
    }
};
