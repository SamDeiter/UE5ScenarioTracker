window.SCENARIOS['RedirectorAndBulkLoadConflict'] = {
    "meta": {
        "title": "Corrupted Texture Reference After Migration",
        "description": "A high-fidelity environmental prop (a large metallic statue) suddenly appears black and untextured in the level viewport, instead of its intended polished gold look. We recently moved the asset and its associated textures to a new folder structure. Opening the Material Instance reveals that all scalar and vector parameters are correct, and the material asset appears to be assigned, but the visual preview in the Material Instance Editor is also incorrect, showing a dull grey reflection suggesting the base texture inputs are failing to load.",
        "estimateHours": 1.35,
        "category": "Asset Management",
        "tokens_used": 10502
    },
    "setup": [
        {
            "action": "set_ue_property",
            "scenario": "RedirectorAndBulkLoadConflict",
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
            "scenario": "RedirectorAndBulkLoadConflict",
            "step": "final"
        }
    ],
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "general",
            "title": "Observe Untextured Statue",
            "prompt": "<p>A large metallic statue appears black and untextured in the <strong>level viewport</strong>. Its <strong>Material Instance</strong> preview also shows a dull grey reflection. How do you investigate this?</p>",
            "choices": [
                {
                    "text": "<p>Locate the statue's <strong>Static Mesh</strong> in the <strong>Level Outliner</strong> and identify its assigned <strong>Material Instance</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Starting with the direct object in the scene is the most logical first step to understand its assigned properties and trace the issue.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Attempt to rebuild <strong>level lighting</strong> and <strong>reflection captures</strong>, assuming it's a rendering issue.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.2hrs. The issue manifests as missing textures, not incorrect lighting or reflections. Rebuilding lighting is time-consuming and won't fix a missing asset reference.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Check the <strong>Project Settings</strong> under 'Rendering' for any texture streaming errors.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While texture streaming can cause issues, the immediate symptom points to a specific asset's material. Global settings are unlikely to be the first point of failure for one isolated object after a folder move.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Inspect the <strong>Content Browser</strong> for the <strong>T_Statue_Normal</strong> texture directly, without checking the statue first.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While the texture is the eventual culprit, it's better to confirm which material the statue uses first. You might be investigating the wrong texture if the material assignment itself was the problem (which it isn't, but you don't know that yet).</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "asset_management",
            "title": "Verify Material Instance Parameters",
            "prompt": "<p>You've identified <strong>MI_Statue_Polished</strong> as the assigned <strong>Material Instance</strong>. Its preview sphere also appears dull and grey. What's your next move?</p>",
            "choices": [
                {
                    "text": "<p>Double-click <strong>MI_Statue_Polished</strong> to open the <strong>Material Instance Editor</strong> and verify texture parameters.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. Opening the <strong>Material Instance</strong> is essential to confirm its settings and see how it references its parent and textures. This is a critical next step after identifying the material.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Create a brand new <strong>Material Instance</strong> and try to assign the textures directly.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.3hrs. Creating a new <strong>Material Instance</strong> is premature and will not resolve underlying reference issues if the problem lies with the texture asset itself or its parent material. This can waste significant time if the root cause isn't addressed.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Right-click the <strong>MI_Statue_Polished</strong> asset in the <strong>Content Browser</strong> and choose 'Find References'.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. While useful, 'Find References' shows where the MI is used, not *what* it uses or if its internal references are valid. Opening the editor is more direct for parameter inspection.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Check the <strong>MI_Statue_Polished</strong> properties in the <strong>Details panel</strong> of the <strong>Content Browser</strong>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The <strong>Details panel</strong> in the <strong>Content Browser</strong> offers limited information. The <strong>Material Instance Editor</strong> is specifically designed for detailed parameter inspection.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "material_editor",
            "title": "Examine Parent Material Inputs",
            "prompt": "<p>In the <strong>Material Instance Editor</strong>, all texture parameters (e.g., Normal Map, Base Color Texture) appear to be pointing to valid assets by name, but the preview sphere is still incorrect. How should you proceed?</p>",
            "choices": [
                {
                    "text": "<p>Navigate to the <strong>Parent Material (M_Master_Metal)</strong> from the <strong>Material Instance Editor</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. Since the <strong>Material Instance</strong> itself looks correct, the next logical step is to investigate its parent, which defines how the textures are used and where the actual texture sample nodes reside.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Right-click on the problematic texture parameter in the <strong>Material Instance Editor</strong> and choose 'Browse To Asset'.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. While 'Browse To Asset' is useful, the problem might not be with the texture *asset* itself initially, but how the <strong>Parent Material</strong> handles the reference or its internal settings. Checking the parent material is more holistic.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Change a scalar parameter value to see if the preview updates.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Changing scalar values won't fix a problem with texture *references* failing to load, as the base inputs are already incorrect. It's a distraction from the core issue.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Close the <strong>Material Instance Editor</strong> and reopen it to refresh.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. Reopening might refresh simple UI glitches, but for a deeper asset reference issue originating higher up the material hierarchy, it's unlikely to resolve the problem at this stage.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "material_editor",
            "title": "Identify Failing Texture Sample Node",
            "prompt": "<p>You are now in the <strong>Parent Material (M_Master_Metal)</strong>. What do you observe about the <strong>Texture Sample</strong> nodes?</p>",
            "choices": [
                {
                    "text": "<p>Observe that the <strong>Texture Sample</strong> node for <strong>T_Statue_Normal</strong> is defaulting to 'None' or showing an error.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. This is a critical observation. It confirms that the engine is failing to resolve the texture reference at the <strong>Parent Material</strong> level, despite the <strong>Material Instance</strong>'s explicit assignment, pointing to an issue with the texture asset itself or its path.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Check the <strong>Material Domain</strong> to ensure it's set to 'Surface'.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The <strong>Material Domain</strong> rarely changes unexpectedly, and if it were incorrect, the entire material would likely be broken, not just a specific texture input failing to load.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Attempt to manually re-assign <strong>T_Statue_Normal</strong> to the <strong>Texture Sample</strong> node in the <strong>Parent Material</strong>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While this might temporarily 'fix' it, it doesn't address *why* the reference broke and could lead to issues with other assets referencing the same texture. It's better to understand the root cause before attempting a manual fix that doesn't solve the core problem.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Inspect the output pins of the <strong>Texture Sample</strong> nodes for visual errors.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. If the input texture itself is 'None' or erroring, the output pins will naturally be empty or also erroring. The issue is at the input source, not how the material processes it.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "asset_management",
            "title": "Inspect Texture References",
            "prompt": "<p>The <strong>Texture Sample</strong> node for <strong>T_Statue_Normal</strong> in the <strong>Parent Material</strong> is showing 'None', indicating a reference lookup failure. How do you investigate this texture's dependencies?</p>",
            "choices": [
                {
                    "text": "<p>Search the <strong>Content Browser</strong> for <strong>T_Statue_Normal</strong>, right-click, and select 'Reference Viewer'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. The <strong>Reference Viewer</strong> is the definitive tool for understanding asset dependencies and identifying broken redirectors, which are very common after asset moves and can cause reference lookup failures.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Delete the <strong>T_Statue_Normal</strong> texture and manually re-import it into the correct folder.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.4hrs. Deleting and re-importing without fixing redirectors means other assets might still point to the old, invalid path. This can exacerbate the problem rather than solve it.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Open the <strong>T_Statue_Normal</strong> texture in the <strong>Texture Editor</strong> to check its properties.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While you will eventually do this, the immediate problem is *how* other assets reference it, not its internal properties yet. The <strong>Reference Viewer</strong> is more appropriate for diagnosing dependency and path issues after a move.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Run a full project content audit from the 'Tools' menu.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. A full project audit is too broad for a specific texture issue. The <strong>Reference Viewer</strong> provides a focused and efficient view of dependencies for that particular asset.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "asset_management",
            "title": "Identify Broken Redirectors",
            "prompt": "<p>The <strong>Reference Viewer</strong> for <strong>T_Statue_Normal</strong> shows a complex graph, with some nodes indicating redirector chains pointing back to an old, invalid directory structure. Which approach do you choose?</p>",
            "choices": [
                {
                    "text": "<p>Identify the specific folder(s) in the <strong>Reference Viewer</strong> that still contain these broken redirectors (often the source folder prior to the move).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. Pinpointing the exact folders with obsolete redirectors is crucial for a targeted and effective cleanup operation.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Manually delete all redirector assets found in the old folder structure.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Manually deleting redirectors without using 'Fix Up Redirectors in Folder' can leave references completely broken instead of resolving them to the new path, causing more widespread issues.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Try moving the <strong>T_Statue_Normal</strong> texture back to its original location temporarily.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.12hrs. This undoes the migration and doesn't solve the problem of having a clean folder structure. It's a workaround, not a permanent fix, and would likely reintroduce the issue later.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Re-save all assets that currently reference <strong>T_Statue_Normal</strong>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.1hrs. Re-saving dependent assets won't fix the underlying redirector problem. The assets would still be trying to resolve through the broken path, perpetuating the issue.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "asset_management",
            "title": "Fix Redirectors in Folder",
            "prompt": "<p>You've identified the folder(s) that contain broken redirectors. What action do you take to resolve them?</p>",
            "choices": [
                {
                    "text": "<p>In the <strong>Content Browser</strong>, right-click the identified folder(s) and select 'Fix Up Redirectors in Folder'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. This command safely resolves obsolete reference paths, updating all assets that point to the redirectors to the correct new location. It's the standard and safest method.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Drag the <strong>T_Statue_Normal</strong> texture out of its current folder and back into it to force an update.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. This action might create new redirectors or confusion and will not 'fix' existing broken ones pointing to the asset from *other* locations. It's an ineffective and potentially harmful action.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Use the 'Migrate' tool on the <strong>T_Statue_Normal</strong> texture again.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. 'Migrate' is for moving assets to *other* projects or locations, not for fixing references within the current project after a move. It would essentially repeat the initial action that caused the problem.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Manually edit the <strong>.uasset</strong> file for the texture to update its path.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.2hrs. Directly editing <strong>.uasset</strong> files outside the editor is risky, unsupported, and highly prone to corruption. The 'Fix Up Redirectors' tool handles this safely and is the correct approach.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "asset_management",
            "title": "Verify Redirector Fix",
            "prompt": "<p>After running 'Fix Up Redirectors in Folder', the <strong>Reference Viewer</strong> graph for <strong>T_Statue_Normal</strong> looks cleaner, but the statue still renders incorrectly. How do you proceed?</p>",
            "choices": [
                {
                    "text": "<p>Verify the <strong>Reference Viewer</strong> again to confirm the redirectors are truly resolved, acknowledging the issue persists.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. It's important to confirm the redirector fix was successful, even if it wasn't the complete solution, before moving on to other potential causes. This confirms a partial success.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Assume the redirector fix was ineffective and revert the texture move.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Reverting is a drastic step and would undo progress. The problem persisting indicates an additional, separate issue, not that the redirector fix was completely useless.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Reopen the <strong>Material Instance</strong> to see if it refreshed its texture input.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. While refreshing the MI is a good idea, the current issue likely lies deeper than a simple editor refresh can fix, given that the redirectors were only part of the problem. A deeper investigation into the texture asset itself is warranted.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Check the <strong>Output Log</strong> for new errors related to asset loading.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The <strong>Output Log</strong> is useful, but at this point, the symptom points to an issue with the texture asset itself rather than a general engine error. A more direct investigation of the texture asset is needed.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "asset_editor",
            "title": "Open Texture Asset Editor",
            "prompt": "<p>The redirectors are fixed, but the <strong>T_Statue_Normal</strong> texture still isn't loading correctly in the <strong>Parent Material</strong>. What's your next move?</p>",
            "choices": [
                {
                    "text": "<p>Double-click the <strong>T_Statue_Normal</strong> texture asset in the <strong>Content Browser</strong> to open the <strong>Texture Editor</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. Since redirectors are resolved, the problem likely resides within the texture asset's own settings or internal loading behavior, necessitating opening its dedicated editor.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Attempt to manually re-assign the texture within the <strong>Material Instance Editor</strong>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Re-assigning won't fix an underlying loading issue within the texture asset itself, it would just assign the same problematic reference again without addressing the root cause.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Right-click the texture in the <strong>Content Browser</strong> and choose 'Validate Assets'.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. 'Validate Assets' primarily checks for basic data integrity and dependency issues, which the <strong>Reference Viewer</strong> already largely covered. It's unlikely to reveal specific internal loading flags or subtle asset corruption.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Open the <strong>T_Statue_Normal</strong> in an external image editor to check for corruption.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. The prompt specifies 'NO external apps'. The issue is within UE5's handling of the texture, not its raw image data, as the texture *appears* to be there by name. Using external tools is outside the scope of this assessment.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "asset_editor",
            "title": "Locate Texture Loading Settings",
            "prompt": "<p>You are in the <strong>Texture Editor</strong> for <strong>T_Statue_Normal</strong>. Where do you look for settings that might affect how the texture is loaded by the engine?</p>",
            "choices": [
                {
                    "text": "<p>In the <strong>Details panel</strong>, search for the 'Loading' section.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. The 'Loading' section specifically contains parameters that govern how the texture data is handled by the engine at runtime and editor load time, making it the most relevant place for this type of issue.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Check the 'Compression Settings' section for any unusual compression types.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While compression settings are important, they usually affect visual quality or memory footprint, not whether the texture *loads* at all, especially when other textures use the same settings without issue.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Look for 'Texture Group' settings in the <strong>Details panel</strong>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. 'Texture Group' affects texture streaming and resolution LODs, not the fundamental ability of the texture to be referenced and loaded as an input to a material.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Examine the 'Source Art' section for the original file path.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. The 'Source Art' path is used for re-importing the texture from its original source file. It won't reveal or address internal engine loading flags that might be preventing display.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "asset_editor",
            "title": "Observe Force Bulk Load Setting",
            "prompt": "<p>In the 'Loading' section of the <strong>Texture Editor</strong> <strong>Details panel</strong>, what do you observe about the <code>Force Bulk Load</code> setting?</p>",
            "choices": [
                {
                    "text": "<p>Observe that the <code>Force Bulk Load</code> checkbox is currently enabled.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. This specific setting, especially in combination with a history of redirectors and asset moves, can prevent reliable path resolution at editor load time, as the engine attempts to load it aggressively without proper dependency resolution.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Observe that <code>Never Stream</code> is enabled.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. <code>Never Stream</code> can increase memory usage by preventing the texture from being unloaded, but generally doesn't prevent a texture from loading entirely or cause it to appear as 'None' in a material.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Observe that the texture resolution is set too high.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. High resolution might cause performance issues or a warning, but it doesn't prevent the texture from loading as a black or 'None' input in a material.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Observe that the 'Sampler Type' is set incorrectly.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. An incorrect 'Sampler Type' might cause material compilation errors or visual artifacts (e.g., if a normal map is sampled as a color), but not typically a complete failure to load the texture into the <strong>Texture Sample</strong> node itself.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "asset_editor",
            "title": "Disable Force Bulk Load",
            "prompt": "<p>You've identified that <code>Force Bulk Load</code> is enabled, which can interfere with reliable texture path resolution. What action do you take?</p>",
            "choices": [
                {
                    "text": "<p>Uncheck the <code>Force Bulk Load</code> checkbox.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Disabling this setting allows the engine to resolve texture dependencies more gracefully, especially after asset moves and redirector fixes have been performed, resolving the conflict.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Enable <code>Never Stream</code> instead.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. Enabling <code>Never Stream</code> addresses a different concern (texture streaming behavior) and would not fix a broken loading path caused by <code>Force Bulk Load</code>.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Change the 'Max Texture Size' to a lower value.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Adjusting texture size helps with memory optimization and streaming, but doesn't resolve a loading flag issue like <code>Force Bulk Load</code> that prevents the texture from appearing at all.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Close the <strong>Texture Editor</strong> without making changes, assuming it's not the issue.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Dismissing a potentially problematic setting without testing the change would be a missed opportunity to fix the issue, forcing you to re-evaluate or try other, less direct solutions.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "asset_editor",
            "title": "Save Modified Texture Asset",
            "prompt": "<p>You have unchecked the <code>Force Bulk Load</code> checkbox. What's your next move?</p>",
            "choices": [
                {
                    "text": "<p>Save the modified <strong>T_Statue_Normal</strong> texture asset.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Saving the asset is crucial to persist the changes made in the <strong>Texture Editor</strong>. Without saving, the change would be lost.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Exit the <strong>Texture Editor</strong> without saving, assuming the change applies immediately.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. Changes made in asset editors are not permanent until explicitly saved. Exiting without saving would discard your fix, meaning you'd have to re-do this step.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Right-click the texture in the <strong>Content Browser</strong> and select 'Reimport'.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. 'Reimport' fetches the original source file from disk. It would reset the editor-specific settings you just changed (like <code>Force Bulk Load</code>) back to their defaults, undoing your work.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Run 'Fix Up Redirectors in Folder' again, just in case.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Redirectors were already fixed earlier in the process. Running it again is redundant at this stage and won't help with the texture's internal loading flag, wasting valuable time.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "editor_workflow",
            "title": "Force Material Instance Reload",
            "prompt": "<p>The <strong>T_Statue_Normal</strong> texture asset is saved. The statue, however, still appears black. How should you proceed to force the engine to recognize the change?</p>",
            "choices": [
                {
                    "text": "<p>Close and reopen the <strong>Material Instance (MI_Statue_Polished)</strong> to force a reload of its dependency structure.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. Closing and reopening the dependent asset (the <strong>Material Instance</strong>) is often necessary for the engine to fully refresh its internal references and apply updated asset properties after an underlying dependency has changed.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Restart the entire <strong>Unreal Engine 5</strong> editor.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.3hrs. Restarting the editor is a heavy-handed approach and unnecessary for a single asset refresh. It wastes a lot of time compared to just reopening the specific asset that relies on the modified texture.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Compile the <strong>Parent Material (M_Master_Metal)</strong> again.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While compiling the parent material can refresh its state, reopening the <strong>Material Instance</strong> (which directly uses the problematic texture via its parameters) is more direct for ensuring its dependencies are re-evaluated and changes are propagated.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Move the statue <strong>Static Mesh</strong> in the level to force a visual update.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. Moving objects might trigger a scene refresh, but it won't necessarily force a re-evaluation of the <strong>Material Instance's</strong> underlying texture references at a deeper engine level. This is generally insufficient for asset-level changes.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "verification",
            "title": "Verify Resolved Texture",
            "prompt": "<p>After closing and reopening the <strong>Material Instance</strong>, what is your final verification?</p>",
            "choices": [
                {
                    "text": "<p>Verify that the statue now renders correctly in the <strong>level viewport</strong> and the texture preview in the <strong>Material Instance Editor</strong> is accurate.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. Confirming both the in-level visual (the primary symptom) and the <strong>Material Instance</strong> preview ensures the issue is fully resolved and the material dependencies are correctly loaded.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Assume it's fixed and move on to the next task.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.01hrs. Never assume! Always verify your fixes, especially in debugging scenarios, to prevent recurrence or hidden issues later on.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Check the texture memory usage in the <strong>Profiler</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While useful for optimization, checking memory isn't the primary verification for a visual texture loading issue being resolved. Visual confirmation is the direct proof of the fix.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Review the <strong>Output Log</strong> for any new warnings.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. While good practice to check for new errors, the direct visual confirmation in the viewport and editor is the most critical and immediate verification for this specific problem.</p>",
                    "next": "step-15"
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
