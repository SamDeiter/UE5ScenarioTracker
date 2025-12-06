window.SCENARIOS['RedirectorAndBulkLoadConflict'] = {
    "meta": {
        "title": "Corrupted Texture Reference After Migration",
        "description": "A high-fidelity environmental prop (a large metallic statue) suddenly appears black and untextured in the level viewport, instead of its intended polished gold look. We recently moved the asset and it",
        "estimateHours": 1.35,
        "category": "Asset Management",
        "tokens_used": 10867
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "general",
            "title": "Step 1: Locate the Asset",
            "prompt": "<p>A high-fidelity metallic statue appears black and untextured in the level viewport. Its Material Instance preview also shows a dull grey reflection. What's your first action?</p>",
            "choices": [
                {
                    "text": "<p>Locate the specific Static Mesh of the statue in the Level viewport or Outliner.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Pinpointing the problematic asset is the essential first step.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Attempt to rebuild level lighting or reflection captures.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. The issue's description points to texture/material problems, not lighting, making this action irrelevant at this stage.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Check the project's Output Log for general texture loading errors.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While logs can be useful, directly identifying the asset is more focused than a broad log search.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Delete the statue from the level and re-add it from the Content Browser.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This is premature and doesn't address potential underlying asset reference problems that would persist.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "general",
            "title": "Step 2: Identify Material Instance",
            "prompt": "<p>You've located the statue's Static Mesh. How do you find the Material Instance applied to it?</p>",
            "choices": [
                {
                    "text": "<p>Select the Static Mesh and identify the assigned Material Instance (MI_Statue_Polished) in its Details panel.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. The Details panel for the mesh instance is where you find its assigned materials.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Check the World Settings panel for a list of materials used in the level.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. World Settings are for level-wide configurations, not for individual mesh material assignments.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Use the Content Browser to search for any material instances starting with 'MI_Statue'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While it might find it, directly checking the mesh's details is more precise to confirm the *assigned* material.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Try dragging various materials from the Content Browser onto the statue in the viewport.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This is trial-and-error and less efficient than inspecting the mesh's properties directly.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "general",
            "title": "Step 3: Open Material Instance Editor",
            "prompt": "<p>You've identified MI_Statue_Polished as the assigned Material Instance. What's your next step to investigate its internal state?</p>",
            "choices": [
                {
                    "text": "<p>Double-click MI_Statue_Polished in the Content Browser to open the Material Instance Editor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Opening the Material Instance Editor allows you to inspect its parameters and preview directly.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Create a brand new Material Instance and attempt to assign the texture.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.3hrs. The issue likely lies with the texture asset or its references, not just the Material Instance. This won't solve the core problem.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Right-click the MI_Statue_Polished and select 'Find References'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While useful later, at this stage, you need to understand the material's internal configuration, not its external dependencies.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Re-save the MI_Statue_Polished without making any changes.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.02hrs. Saving won't reveal any configuration issues; you need to inspect the editor itself.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "material",
            "title": "Step 4: Verify MI Texture Parameters",
            "prompt": "<p>Inside the Material Instance Editor, what's the first thing you should check regarding textures?</p>",
            "choices": [
                {
                    "text": "<p>Verify that all texture parameters (Normal Map, Base Color Texture, etc.) are pointing to valid assets by name.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Confirming that the MI *thinks* it has valid textures assigned is crucial for deeper diagnosis.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Change the Base Color Texture parameter to a default engine texture.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Prematurely changing parameters prevents diagnosing the original issue.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Adjust the scalar and vector parameters to see if they affect the visual.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Scalar and vector parameters control numeric properties, not the presence or absence of a texture itself.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Look for any missing texture warnings in the Output Log window.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While the log might have warnings, a direct visual check in the MI editor is more immediate.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "material",
            "title": "Step 5: Observe Material Instance Preview",
            "prompt": "<p>The MI texture parameters *appear* correct by name, but the statue is still black. What is the immediate visual symptom you observe in the Material Instance Editor?</p>",
            "choices": [
                {
                    "text": "<p>The visual preview in the Material Instance Editor is incorrect, showing a dull grey reflection instead of the intended gold.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This confirms the problem extends to the material preview itself, indicating a deeper texture loading issue.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>The Material Instance Editor crashes when you try to apply the material to the preview sphere.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While a crash indicates a severe problem, the scenario describes a dull grey reflection, not a crash.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>The preview sphere shows a checkerboard pattern, indicating a missing texture.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While a checkerboard is a common sign of a missing texture, the scenario specifies a 'dull grey reflection', which points to a different failure mode (e.g., texture reference failing to load, resulting in a black input).</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>The Base Color texture parameter appears red in the editor.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. If a parameter were truly broken or invalid, it might appear red. However, the prompt states it 'appears correct by name', implying no immediate visual error on the parameter itself.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "material",
            "title": "Step 6: Navigate to Parent Material",
            "prompt": "<p>The Material Instance parameters are correct by name, but the preview is still wrong. This suggests the issue is deeper. Where do you investigate next?</p>",
            "choices": [
                {
                    "text": "<p>Navigate to the Parent Material (M_Master_Metal) from within the Material Instance Editor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The Parent Material defines how textures are sampled and processed, making it the next logical place to investigate a loading failure.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Attempt to rebuild level lighting or reflection captures again.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. This is a repeated incorrect action; the problem is with asset referencing, not scene lighting.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Right-click the texture parameter in the MI and select 'Browse to Asset'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.02hrs. While you could browse, the core issue is likely how the Parent Material *uses* the texture, not just its location. Inspecting the Parent Material directly is more revealing.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Close and reopen the Material Instance Editor.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.02hrs. This might refresh the view but won't fix an underlying asset loading issue within the engine's reference system.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "material",
            "title": "Step 7: Examine Parent Material Texture Samples",
            "prompt": "<p>You're in the Parent Material (M_Master_Metal) editor. What specific nodes should you focus on to diagnose the texture loading issue?</p>",
            "choices": [
                {
                    "text": "<p>Examine the Texture Sample nodes that are failing to render, specifically focusing on the T_Statue_Normal texture input.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The Texture Sample nodes are where the material attempts to load and use texture assets, making them critical for diagnosis.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Check the material's 'Usage' flags in the Details panel.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Usage flags are important for shader compilation but are unlikely to cause a texture reference failure at this stage.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Review the material's blend mode and shading model settings.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. These settings affect how the material renders, but wouldn't cause a texture to fail to load entirely.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Look for any commented-out sections in the material graph.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.02hrs. Commented sections are inactive and thus irrelevant to a live rendering issue.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "material",
            "title": "Step 8: Confirm Texture Sample Node Error",
            "prompt": "<p>You're examining the T_Statue_Normal Texture Sample node in the Parent Material. What specific symptom do you observe?</p>",
            "choices": [
                {
                    "text": "<p>The Texture Sample node defaults to 'None' or produces an error, indicating the reference lookup is failing.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This visual cue in the Parent Material confirms that the engine cannot locate or load the texture asset, despite the MI's reference.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>The texture appears as a solid pink color on the node.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Pink usually indicates a shader compilation error or a texture format mismatch, not a complete reference failure.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>The Texture Sample node is connected to an incorrect input pin.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This would cause incorrect visuals but not a 'None' or error state on the texture node itself, assuming the asset is found.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>The node's preview displays a low-resolution version of the texture.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.02hrs. Low resolution indicates LOD issues or streaming, not a failure to find/load the base asset.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "asset management",
            "title": "Step 9: Infer Reference Lookup Failure",
            "prompt": "<p>The Texture Sample node for T_Statue_Normal shows 'None' or an error in the Parent Material, even though the Material Instance specifies it. What is the precise conclusion you draw from this?</p>",
            "choices": [
                {
                    "text": "<p>The engine's reference lookup for the texture asset is failing on asset load.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This confirms the problem isn't a simple misassignment, but a deeper issue with how the engine resolves the asset's path.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>The shader for M_Master_Metal is compiled incorrectly.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. If it were a shader compilation issue, you'd likely see clear error messages in the output log or a red node, not a 'None' texture.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>The Material Instance is incorrectly overriding the texture parameter.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The MI *is* specifying the texture by name; the problem is the engine failing to *find* it, not a misconfiguration within the MI itself.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>The texture asset itself is corrupted on disk and unreadable.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While possible, reference lookup failure often points to pathing issues first, especially after migration, before assuming corruption.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "asset management",
            "title": "Step 10: Search for the Texture Asset",
            "prompt": "<p>Knowing the texture reference lookup is failing after a folder migration, how do you begin investigating its path dependencies?</p>",
            "choices": [
                {
                    "text": "<p>Search the Content Browser for the texture asset T_Statue_Normal.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Locating the asset in the Content Browser is the first step before inspecting its references.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Delete the T_Statue_Normal texture and manually re-import it into the new folder.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.4hrs. This fails to address underlying redirectors, which will likely still exist and point other assets to the old path, causing the problem to reappear.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Manually navigate through folders in the Content Browser to find the texture.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Searching by name is much faster and more reliable than manual navigation, especially in large projects.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Check the texture asset's 'Dependencies' list in its Details panel.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The 'Dependencies' panel shows what an asset *uses*, not what *uses* the asset, and doesn't reveal redirector chains as effectively as the Reference Viewer.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "asset management",
            "title": "Step 11: Open Reference Viewer",
            "prompt": "<p>You've found T_Statue_Normal in the Content Browser. What tool should you use to check its dependency graph for obsolete paths?</p>",
            "choices": [
                {
                    "text": "<p>Right-click T_Statue_Normal and select 'Reference Viewer'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The Reference Viewer is the primary tool for diagnosing broken asset paths and redirectors after a folder move.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Right-click and select 'Asset Actions' -> 'Find in Explorer'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This opens the asset's location on disk but doesn't show its internal engine references or redirectors.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Open the texture and check the 'Path' property in its Details panel.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The Details panel will show its current *valid* path, but not the broken redirectors that other assets might still be pointing to.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Use the 'Audit Asset' tool from the Content Browser.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Asset Audit provides historical data, but the Reference Viewer is for live dependency inspection.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "asset management",
            "title": "Step 12: Inspect Redirector Chains",
            "prompt": "<p>You've opened the Reference Viewer for T_Statue_Normal. What specifically are you looking for to diagnose the migration issue?</p>",
            "choices": [
                {
                    "text": "<p>Inspect its dependency graph for redirector chains pointing back to the old, invalid directory structure.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Redirector chains are strong indicators of broken references after an asset move.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Check if the texture is referenced by any unused assets.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While good for cleanup, this doesn't directly address a broken *loading* reference for a currently used asset.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Look for assets that are excessively referencing the texture, indicating performance issues.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Performance is not the current problem; it's a failure to load the texture at all.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Verify the total memory footprint of the texture and its referencers.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Memory footprint is a performance concern, not a reference resolution issue.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "asset management",
            "title": "Step 13: Identify Redirector Folder",
            "prompt": "<p>The Reference Viewer clearly shows broken redirectors pointing back to an old folder. What's your next action before fixing them?</p>",
            "choices": [
                {
                    "text": "<p>Identify the specific folder in the Content Browser that still contains these broken redirectors (often the source folder prior to the move).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Pinpointing the source of the redirectors is necessary before you can execute the 'Fix Up Redirectors' command.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Ignore the redirectors, assuming they are just warnings and not the root cause.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. Redirectors are often the primary cause of broken references after asset moves. Ignoring them will prevent resolution.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Manually attempt to delete individual redirector assets displayed in the Reference Viewer.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This is inefficient and prone to error. Unreal has a built-in tool for fixing redirectors that is much safer and faster.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Immediately restart the Unreal Editor, hoping it will resolve the redirectors on startup.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While restarting can sometimes help with caching issues, it won't actively fix orphaned redirector files on disk.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "asset management",
            "title": "Step 14: Access Fix Up Redirectors",
            "prompt": "<p>You've identified the folder with broken redirectors. How do you access the command to fix them?</p>",
            "choices": [
                {
                    "text": "<p>In the Content Browser, right-click the identified folder.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The 'Fix Up Redirectors' command is accessed via the right-click context menu of the folder containing them.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Select 'Tools' -> 'Audit' -> 'Fix Redirectors' from the main menu.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. There isn't a direct menu item for fixing redirectors in this manner. It's a context-menu action.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Select the T_Statue_Normal texture itself and right-click to find the option.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Fix Up Redirectors' is a folder-level operation, not an asset-level one.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Type 'FixRedirectors' into the Console Command line.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While some commands exist, 'Fix Up Redirectors in Folder' is primarily an editor UI function.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "asset management",
            "title": "Step 15: Execute Fix Up Redirectors",
            "prompt": "<p>You've right-clicked the folder with broken redirectors. What context menu option do you select?</p>",
            "choices": [
                {
                    "text": "<p>Select 'Fix Up Redirectors in Folder' to resolve the obsolete reference paths.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. This is the standard and most reliable method to resolve redirectors, ensuring all references are updated to the correct paths.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Select 'Delete' to remove the old folder, assuming redirectors will also disappear.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This is dangerous and can lead to irreversible data loss or further broken references if assets are still within the folder or the redirectors aren't cleaned properly.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Select 'Migrate' to move the folder again.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Migrate' is for moving assets to *other projects*, not for fixing internal references within the current project.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Select 'Resave All' from the context menu.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Resave All' only saves current assets; it doesn't actively fix redirector files on disk.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "asset management",
            "title": "Step 16: Verify Redirector Fix",
            "prompt": "<p>You've run 'Fix Up Redirectors in Folder'. How do you confirm the redirectors are resolved?</p>",
            "choices": [
                {
                    "text": "<p>Verify the Reference Viewer for T_Statue_Normal again; the dependency chain should now look cleaner.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Checking the Reference Viewer is the direct way to confirm that redirectors have been successfully resolved.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Check the Content Browser for 'Fix Up Redirectors' confirmation pop-ups.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.02hrs. While there might be output, visual confirmation in the Reference Viewer is more reliable.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Restart the Unreal Editor and check if it still complains about redirectors.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This is an indirect and slower method of verification than the Reference Viewer.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Inspect the file system for orphaned `.uasset` files.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While eventually useful, the Reference Viewer is the engine's real-time view of asset relationships.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "general",
            "title": "Step 17: Confirm Remaining Issue",
            "prompt": "<p>The Reference Viewer is clean, but the statue still renders incorrectly in the level, and the MI preview is dull grey. What does this tell you?</p>",
            "choices": [
                {
                    "text": "<p>The redirectors were a problem, but not the only one; another issue is preventing texture loading.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This critical observation narrows down the problem to something inherent in the texture asset itself, rather than just its path.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>The redirectors were never the problem; the issue is still lighting-related.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. If the Reference Viewer is clean, the redirectors *were* fixed. Dismissing this progress is incorrect.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>The Material Instance (MI_Statue_Polished) itself is corrupted.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While possible, the symptoms point more to the texture failing to load *into* the material, rather than the MI being corrupt itself.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>The engine requires a full project re-cook after redirector fixes.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. A re-cook is usually for deployed builds; editor issues usually resolve without one.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "asset management",
            "title": "Step 18: Open Texture Editor",
            "prompt": "<p>Redirectors are clean, but the texture still won't load. This suggests an issue *with the texture asset itself*. What's your next move?</p>",
            "choices": [
                {
                    "text": "<p>Double-click the T_Statue_Normal texture asset itself to open the Texture Editor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Directly inspecting the texture asset's properties is the next logical step when reference paths are resolved but the asset still fails to load.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Delete the T_Statue_Normal texture and manually re-import it again.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.4hrs. This is a repeat of a previously wrong step and won't fix an internal setting within the texture asset if it's consistently applied upon import.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Attempt to open the texture in an external image editing application.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While it confirms image data integrity, it won't reveal engine-specific loading properties.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Check the Content Browser's 'Asset Audit' log for the texture.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The Asset Audit provides useful history, but direct examination of the texture's current settings in the editor is more efficient for immediate troubleshooting.</p>",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "general",
            "title": "Step 19: Locate Loading Settings",
            "prompt": "<p>You're in the Texture Editor for T_Statue_Normal. You need to find settings related to how the texture loads. Where do you look?</p>",
            "choices": [
                {
                    "text": "<p>In the Texture Editor's Details panel, search for the 'Loading' section.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The 'Loading' section specifically contains parameters that influence how a texture is streamed and loaded into memory.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Examine the 'Compression Settings' within the Details panel.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Incorrect compression settings usually cause visual artifacts or performance issues, not a complete failure to load the texture.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Look for rendering settings in the Texture Editor's 'View Options' dropdown.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. These options control *how you view* the texture in the editor, not *how the engine loads* it at runtime.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Inspect the 'LOD Group' settings in the Details panel.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. LOD settings affect texture quality at different distances, but generally wouldn't prevent the base texture from loading entirely.</p>",
                    "next": "step-19"
                }
            ]
        },
        "step-20": {
            "skill": "asset management",
            "title": "Step 20: Identify 'Force Bulk Load'",
            "prompt": "<p>In the 'Loading' section, you find a setting that, combined with past redirector issues, could cause loading problems. What is it, and what's its state?</p>",
            "choices": [
                {
                    "text": "<p>You observe that 'Force Bulk Load' is currently enabled.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. This setting, especially with previous reference issues, can prevent reliable path resolution during asset loading.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>You observe that 'Never Stream' is currently enabled.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While 'Never Stream' can increase memory usage, it typically doesn't cause a texture to fail loading entirely; it forces it into memory.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>You observe that 'Virtual Texture' is currently enabled.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. If incorrectly set for a non-virtual texture, it might cause issues, but 'Force Bulk Load' is a more direct loading-related problem.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>You observe that 'Has Alpha Channel' is unchecked when it should be checked.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This setting relates to how alpha data is handled, which would typically cause visual corruption or incorrect blending, not a complete failure to load the texture.</p>",
                    "next": "step-20"
                }
            ]
        },
        "step-21": {
            "skill": "asset management",
            "title": "Step 21: Disable 'Force Bulk Load'",
            "prompt": "<p>You've identified 'Force Bulk Load' as the culprit. What is the immediate corrective action?</p>",
            "choices": [
                {
                    "text": "<p>Uncheck the 'Force Bulk Load' checkbox.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Disabling this setting allows the engine to resolve texture paths more reliably, especially after folder migrations.</p>",
                    "next": "step-22"
                },
                {
                    "text": "<p>Change the 'Never Stream' setting to enabled.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This setting is unrelated to the 'Force Bulk Load' problem and would likely increase memory usage without solving the loading issue.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Set the texture's 'Max Texture Size' to a very low value, like 32.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This would severely degrade texture quality and is not related to the reference loading problem caused by 'Force Bulk Load'.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Right-click the texture in the Content Browser and select 'Recompile'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Directly changing the internal setting is the necessary action here, not a generic recompile command.</p>",
                    "next": "step-21"
                }
            ]
        },
        "step-22": {
            "skill": "general",
            "title": "Step 22: Save Texture Asset",
            "prompt": "<p>You've unchecked 'Force Bulk Load' for T_Statue_Normal. What's the critical next step to ensure this change takes effect?</p>",
            "choices": [
                {
                    "text": "<p>Save the modified T_Statue_Normal texture asset.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Any changes to asset properties must be saved to disk for them to take effect and be recognized by the engine.</p>",
                    "next": "step-23"
                },
                {
                    "text": "<p>Close the Texture Editor without saving, assuming changes are auto-applied.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Changes to asset properties in Unreal Engine are generally not auto-saved and will be lost if not explicitly saved.</p>",
                    "next": "step-22"
                },
                {
                    "text": "<p>Immediately close and reopen the Material Instance (MI_Statue_Polished).</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This action is premature. If the texture itself isn't saved, the Material Instance will still be trying to load the texture with the old, incorrect setting.</p>",
                    "next": "step-22"
                },
                {
                    "text": "<p>Run a full 'Save All' operation for the entire project.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While not incorrect, it's more efficient to save only the specific asset you've modified, as a full 'Save All' can be time-consuming.</p>",
                    "next": "step-22"
                }
            ]
        },
        "step-23": {
            "skill": "general",
            "title": "Step 23: Force Material Instance Reload",
            "prompt": "<p>The texture is saved with 'Force Bulk Load' disabled. What do you do to see if the fix worked in the material?</p>",
            "choices": [
                {
                    "text": "<p>Close and reopen the Material Instance (MI_Statue_Polished) to force the engine to reload its dependency structure.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Closing and reopening the Material Instance forces it to re-evaluate its dependencies, ensuring it picks up the newly saved texture settings.</p>",
                    "next": "step-24"
                },
                {
                    "text": "<p>Attempt to rebuild level lighting or reflection captures (again).</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. This is a repeated, irrelevant action. The issue is with asset loading, not lighting.</p>",
                    "next": "step-23"
                },
                {
                    "text": "<p>Restart the Unreal Editor entirely.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. While this would work, it's overkill and time-consuming. Simply reloading the affected asset is more efficient.</p>",
                    "next": "step-23"
                },
                {
                    "text": "<p>Recompile only the M_Master_Metal material.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Recompiling the material might not necessarily force a reload of the texture's *loading properties* if the material asset itself hasn't changed.</p>",
                    "next": "step-23"
                }
            ]
        },
        "step-24": {
            "skill": "general",
            "title": "Step 24: Verify Level Viewport",
            "prompt": "<p>You've reloaded the Material Instance. What's the immediate visual verification you should perform in the level?</p>",
            "choices": [
                {
                    "text": "<p>Verify that the statue now renders correctly with its polished gold look in the level viewport.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This confirms the fix has taken effect in the actual game world.</p>",
                    "next": "step-25"
                },
                {
                    "text": "<p>Delete all temporary files and caches from the Unreal Engine project directory.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This is an unnecessary and potentially disruptive action if the problem has already been resolved.</p>",
                    "next": "step-24"
                },
                {
                    "text": "<p>Open the Content Browser and search for 'missing texture' assets.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.02hrs. The most direct verification is visual inspection of the statue itself, not a broader search.</p>",
                    "next": "step-24"
                },
                {
                    "text": "<p>Test the project on a different machine to see if the issue reappears.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This is a deployment/testing step, not a verification of your immediate fix within the editor.</p>",
                    "next": "step-24"
                }
            ]
        },
        "step-25": {
            "skill": "general",
            "title": "Step 25: Verify MI Editor Preview",
            "prompt": "<p>The statue looks correct in the level viewport. What final verification step should you take regarding the Material Instance itself?</p>",
            "choices": [
                {
                    "text": "<p>Confirm that the texture preview in the Material Instance Editor is also accurate and shows the intended polished gold look.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This ensures the problem is fully resolved for both runtime and editor contexts.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Send a bug report to Epic Games about the asset migration process.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While sometimes necessary, reporting is premature if the issue has been resolved. The focus is on verifying your fix.</p>",
                    "next": "step-25"
                },
                {
                    "text": "<p>Perform a full 'Save All' operation for the entire project.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While a good general practice, it's not a *verification* step itself. The visual check is the verification.</p>",
                    "next": "step-25"
                },
                {
                    "text": "<p>Close the Unreal Editor and reopen it to ensure persistence.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While a restart can sometimes resolve caching, the explicit save in Step 22 should already guarantee persistence; this is an unnecessary double-check.</p>",
                    "next": "step-25"
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
