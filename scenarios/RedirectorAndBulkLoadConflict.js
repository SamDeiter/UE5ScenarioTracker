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
            "skill": "general",
            "title": "Step 1",
            "prompt": "<p>A large metallic statue appears black in the level, untextured. Its Material Instance preview shows a dull grey reflection. What's your first move?</p>",
            "choices": [
                {
                    "text": "<p>Inspect the statue in the level viewport, focusing on its visual state.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Understanding the immediate visual symptom is crucial before diving into asset details.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Attempt to rebuild all lighting in the level.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. This issue is specific to a single asset's texture, not general lighting. Rebuilding lighting is time-consuming and irrelevant here.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Check the global Post Process Volume settings for rendering issues.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While Post Process affects visuals, a single asset appearing black usually points to asset-specific problems, not global rendering tweaks.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Run 'stat unit' in the console to check frame rates and performance.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Performance stats are useful, but they won't directly tell you why a texture isn't loading. Focus on visual diagnostics first.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "general",
            "title": "Step 2",
            "prompt": "<p>The statue is clearly visible but black. How do you confirm its basic setup?</p>",
            "choices": [
                {
                    "text": "<p>In the Details panel, confirm the object's visibility and primary Material assignment to 'MI_Statue_Polished'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. It's essential to verify the mesh is correctly assigned and visible.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Check for potential collision meshes or blocking volumes obscuring the statue's render.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. If the statue is 'black' and not 'invisible', it's highly unlikely to be an occlusion issue. This is a texture/material problem.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Inspect the statue's LOD (Level of Detail) settings for a missing lower-res material.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. While possible for LODs to have different materials, the issue affects the primary view, suggesting a base material problem.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Try moving the statue to a different location in the level to see if the issue persists.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Location is irrelevant to an asset's material reference issue.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "general",
            "title": "Step 3",
            "prompt": "<p>You've confirmed the 'MI_Statue_Polished' material is assigned. What's the next logical step to investigate the material itself?</p>",
            "choices": [
                {
                    "text": "<p>Locate the statue's Static Mesh asset in the Content Browser directly from the level viewport (e.g., using 'Browse To Asset').</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This is the quickest way to get to the source asset and its materials.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Use the 'Replace Referenced Actors' feature to swap the statue with another mesh.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This is an extreme measure and doesn't help diagnose the current asset's problem.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Run a console command like 'showflag.Material=0' to toggle material rendering.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This would hide all materials, not help diagnose a specific asset's material issue.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Export the Static Mesh to a 3D application to check for UV issues.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. If the material instance preview is incorrect, it's more likely a material/texture issue than UVs on the mesh itself.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "general",
            "title": "Step 4",
            "prompt": "<p>You've located the Static Mesh. How do you access the material for closer inspection?</p>",
            "choices": [
                {
                    "text": "<p>From the Static Mesh Editor or Details panel, identify and open the assigned Material Instance (MI_Statue_Polished).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Accessing the Material Instance is the direct path to investigate the material's parameters.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Attempt to create a new material and assign it to the mesh temporarily.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This bypasses diagnosis of the existing material, making it harder to find the root cause.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Check the mesh's 'Build Settings' for any material-related flags.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Build settings are mostly for mesh properties like normals and collision, not material references.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Look for missing or corrupted mesh data in the Static Mesh Editor.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. The symptom points to a material/texture problem, not the mesh's geometry itself.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "materials",
            "title": "Step 5",
            "prompt": "<p>You've identified 'MI_Statue_Polished'. What's the immediate next step to open and check it?</p>",
            "choices": [
                {
                    "text": "<p>Double-click MI_Statue_Polished in the Content Browser or Details panel to open the Material Instance Editor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Opening the Material Instance Editor is essential for parameter inspection.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Create a brand new Material Instance and attempt to assign the texture.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.3hrs. The problem is with the underlying texture reference, not the MI itself. A new MI won't resolve it and wastes time.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Right-click the MI and choose 'Find References' to see where it's used.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While useful later, your immediate goal is to inspect the MI's parameters, not its usage.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Try to re-assign the existing 'MI_Statue_Polished' to the statue.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. It's already assigned; re-assigning it won't fix an internal reference issue.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "materials",
            "title": "Step 6",
            "prompt": "<p>Inside the Material Instance Editor, the preview sphere is dull grey. What should you examine?</p>",
            "choices": [
                {
                    "text": "<p>Verify all scalar and vector parameters are correct, and texture parameters (e.g., Normal Map, Base Color Texture) point to valid assets by name. Note the incorrect preview.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Confirming MI parameters and observing the preview confirms the MI itself *looks* correct but isn't rendering properly.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Adjust the base color scalar parameter to see if the preview updates.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. If base texture inputs are failing, a scalar adjustment won't resolve the core problem or reveal its cause.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Check the MI's 'Usage' flags to ensure it's compatible with Static Meshes.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Usage flags are typically set on the Parent Material and would result in compilation errors if incorrect, which isn't the primary symptom here.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Look for any 'Parameter Group' errors in the MI details panel.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Parameter group errors are rare and not indicated by the current symptoms.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "materials",
            "title": "Step 7",
            "prompt": "<p>The MI's parameters seem correct, but the preview is visually wrong. Where should you look next for deeper issues?</p>",
            "choices": [
                {
                    "text": "<p>Navigate to the Parent Material (M_Master_Metal) from the Material Instance Editor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. The Parent Material defines the actual texture sampling logic, which is the next logical step.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Re-assign the 'MI_Statue_Polished' to the statue's Static Mesh.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This won't fix an issue within the material's definition itself.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Try force-refreshing the Material Instance preview with a console command.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. If the underlying data is bad, a refresh won't fix it; you need to investigate the source.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Check the MI's 'Stats' window for shader complexity information.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Shader complexity is a performance metric, not directly related to texture loading failures.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "materials",
            "title": "Step 8",
            "prompt": "<p>You are now in the Parent Material (M_Master_Metal) editor. What's your focus?</p>",
            "choices": [
                {
                    "text": "<p>Examine the Texture Sample nodes that are failing to render, specifically the T_Statue_Normal texture input.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. The Parent Material's Texture Sample nodes are where the textures are referenced and processed.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Check the material's 'Blend Mode' and 'Shading Model' settings.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While important, these typically affect how the material *renders*, not whether its base textures *load* at all.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Look for any disconnected nodes in the material graph.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Disconnected nodes are usually compilation errors, which aren't the primary symptom here.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Add a 'Constant3Vector' node to override the base color output.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This bypasses the problem instead of diagnosing why the texture isn't loading.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "materials",
            "title": "Step 9",
            "prompt": "<p>Examining the 'T_Statue_Normal' Texture Sample node in the Parent Material, what specific symptom indicates a reference issue?</p>",
            "choices": [
                {
                    "text": "<p>Confirm that the Texture Sample node defaults to 'None' or produces an error, indicating the texture asset reference lookup is failing on asset load.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This confirms the engine cannot resolve the path to the texture despite the MI parameter pointing to it by name.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Try to manually re-assign the 'T_Statue_Normal' texture to the sample node from within the material graph.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. If the reference is broken, re-assigning it within the material won't fix the underlying asset path issue.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Check the UV channel used by the Texture Sample node.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While incorrect UVs can cause issues, the 'None' or error state suggests a loading failure, not a coordinate issue.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Change the 'Sampler Type' property of the Texture Sample node.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Sampler type is for how the texture is sampled, not whether it can be found at all.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "assetManagement",
            "title": "Step 10",
            "prompt": "<p>The Parent Material shows the texture reference failing. This points to an issue with the texture asset itself or its path. What's the next step?</p>",
            "choices": [
                {
                    "text": "<p>Open the Content Browser and search for the specific texture asset, T_Statue_Normal.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Finding the texture asset is crucial to investigate its properties and references.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Attempt to rebuild the texture streaming data for the level.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. This is a broad optimization step and unlikely to fix a broken asset reference after a migration.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Check the Unreal Engine output log for texture loading errors.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While useful for general errors, directly investigating the asset is more efficient when the specific asset is known.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Try restarting the Unreal Editor to clear potential cache issues.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While it sometimes works for minor glitches, it's inefficient for a known asset reference problem.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "assetManagement",
            "title": "Step 11",
            "prompt": "<p>You've located 'T_Statue_Normal' in the Content Browser. Given the migration, what tool should you use to check its path integrity?</p>",
            "choices": [
                {
                    "text": "<p>Right-click the T_Statue_Normal asset and select 'Reference Viewer' to inspect its dependency graph.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.15hrs. The Reference Viewer is critical for identifying broken redirectors after a migration.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Delete the texture asset and manually re-import it from its source file.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.4hrs. This fails to address existing redirectors, which will continue to point other assets to the old, invalid path, causing more problems.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Open the texture asset itself to check its internal properties.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While you will do this later, the priority after a move is checking external references via the Reference Viewer.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Duplicate the texture and try using the duplicated version.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. Duplication can sometimes fix reference issues, but it's a workaround that doesn't resolve the root cause of redirectors.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "assetManagement",
            "title": "Step 12",
            "prompt": "<p>In the Reference Viewer, you see complex redirector chains. What's your immediate action?</p>",
            "choices": [
                {
                    "text": "<p>Inspect the dependency graph to identify any redirector chains pointing back to the old, invalid directory structure.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Identifying the specific problematic redirectors is key to resolving the issue.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Check the texture's resolution and file size in the Details panel.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Resolution and file size are irrelevant to broken asset paths and redirectors.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Attempt to manually drag and drop the texture into the 'Texture' slot of the Reference Viewer.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The Reference Viewer is for visualization, not direct manipulation of asset references.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Close the Reference Viewer, assuming it's a visual glitch.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Ignoring visible redirectors is a mistake, as they are the direct cause of reference issues after moves.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "assetManagement",
            "title": "Step 13",
            "prompt": "<p>You've identified the folder containing the broken redirectors in the Content Browser. What's the recommended fix?</p>",
            "choices": [
                {
                    "text": "<p>In the Content Browser, right-click the identified folder and select 'Fix Up Redirectors in Folder'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.15hrs. This is the official and most reliable way to resolve redirectors after asset moves.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Manually move the texture to a different folder and then back.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This will likely create *more* redirectors or not resolve the existing ones properly.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Delete the redirector files manually from the Content Browser.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. Directly deleting redirectors without 'Fix Up' can break references completely and potentially corrupt assets.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Open each redirector file individually and manually re-point its target.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.3hrs. This is extremely time-consuming and prone to error, especially with many redirectors.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "assetManagement",
            "title": "Step 14",
            "prompt": "<p>Redirectors have been fixed. What's the next step to confirm progress and identify remaining issues?</p>",
            "choices": [
                {
                    "text": "<p>Re-open the Reference Viewer for T_Statue_Normal to verify the dependency chain is cleaner, but confirm the statue still renders incorrectly in the level.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Verifying the redirector fix is important, and recognizing the problem isn't fully solved directs you to the next root cause.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Assume the problem is solved and proceed with other tasks.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. It's crucial to always verify fixes. Incorrect assumption leads to wasted time later.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Recompile all shaders in the project.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. While sometimes necessary, it's a broad step and unlikely to fix a specific texture loading issue after redirectors are handled.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Check the texture's 'Compression Settings' in its Details panel.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Compression affects quality/memory, not whether the texture loads at all in this specific context.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "textureManagement",
            "title": "Step 15",
            "prompt": "<p>Redirectors are clean, but the statue is still black. This indicates an issue with the texture asset itself. What's your next diagnostic step?</p>",
            "choices": [
                {
                    "text": "<p>Double-click the T_Statue_Normal texture asset itself to open the Texture Editor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Now that references are clean, it's time to inspect the texture's internal properties.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Restart the Unreal Editor.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While it can resolve minor editor glitches, it's not a diagnostic step for a persistent asset issue.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Try moving the statue asset and its material to a different sub-folder.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. This might reintroduce redirector issues or simply move the problem without solving it.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Review the Content Browser filters for hidden assets.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The texture is already found; filtering won't help with its internal properties.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "textureManagement",
            "title": "Step 16",
            "prompt": "<p>Inside the Texture Editor, where should you look for settings that might prevent reliable loading after a move?</p>",
            "choices": [
                {
                    "text": "<p>In the Details panel, search for the 'Loading' section.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The 'Loading' section contains critical settings for how textures are loaded into memory.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Check the texture's 'Source Path' to ensure it points to the correct source file.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The source path is for re-importing, not for how the engine *loads* the uasset itself after migration.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Adjust the 'SRGB' setting under the 'Compression' section.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. SRGB affects color space interpretation, not whether the texture loads or is applied.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Inspect the 'Resolution' and 'Size' parameters.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. These are properties of the texture, not settings that govern its loading behavior after a move.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "textureManagement",
            "title": "Step 17",
            "prompt": "<p>Within the 'Loading' section, which specific setting is known to cause issues with asset path resolution, especially after migrations and with redirectors?</p>",
            "choices": [
                {
                    "text": "<p>Observe that the setting 'Force Bulk Load' is currently enabled.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.15hrs. 'Force Bulk Load' can interfere with streaming and path resolution logic when combined with complex asset moves.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Check the 'Never Stream' checkbox status.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Never Stream' would load the texture fully, not typically cause it to fail loading entirely after a move.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Inspect the 'Global Force Resident' setting.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This is an advanced streaming setting not directly related to initial asset path resolution.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Change the texture's 'Compression Settings' to 'UserInterface2D (RGBA)'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Compression is about memory and quality, not the loading mechanism or pathing.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "textureManagement",
            "title": "Step 18",
            "prompt": "<p>'Force Bulk Load' is enabled. What should you do to fix this?</p>",
            "choices": [
                {
                    "text": "<p>Uncheck the 'Force Bulk Load' checkbox.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Disabling this allows the texture to use standard streaming, which is more robust for resolving paths.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Adjust the texture's 'LOD Bias' to a different value.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. LOD Bias controls which mip map is used, not whether the texture asset itself loads correctly.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Change the 'Streaming Distance Multiplier' to a higher value.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This affects when texture mips stream in/out, not the initial loading failure.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Attempt to regenerate texture mip maps from the texture editor toolbar.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Regenerating mips won't fix a core loading flag issue.</p>",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "textureManagement",
            "title": "Step 19",
            "prompt": "<p>You've unchecked 'Force Bulk Load'. What's the critical next step to apply this change?</p>",
            "choices": [
                {
                    "text": "<p>Save the modified T_Statue_Normal texture asset.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Saving the asset writes the changes to disk, making them persistent.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Close the Texture Editor without saving.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Changes made in the editor must be saved to take effect, otherwise they are lost.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Duplicate the texture asset to create a new version with the setting.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Duplicating is unnecessary and creates redundant assets; saving the original is the correct approach.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Immediately close the Material Instance and check the level.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. You still need to save the texture asset for the change to be loaded by dependent assets.</p>",
                    "next": "step-19"
                }
            ]
        },
        "step-20": {
            "skill": "general",
            "title": "Step 20",
            "prompt": "<p>The texture asset is saved with 'Force Bulk Load' disabled. How do you ensure the changes are picked up by the relevant assets?</p>",
            "choices": [
                {
                    "text": "<p>Close and reopen the Material Instance (MI_Statue_Polished) to force the engine to reload its dependency structure.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Reopening the MI forces it to re-evaluate its texture references with the updated asset properties.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Attempt to rebuild level reflection captures.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. Reflection captures are for lighting reflections, not the base texture loading. This is an irrelevant time sink.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Run a 'Build Data' command from the 'Build' menu.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. Build Data is for scene-wide compiled data (lighting, navigation), not for refreshing individual asset references.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Migrate the statue asset and its material to a completely new project.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.5hrs. This is an extreme and unnecessary step that avoids solving the problem in the current project.</p>",
                    "next": "step-20"
                }
            ]
        },
        "step-21": {
            "skill": "complete",
            "title": "Step 21",
            "prompt": "<p>You've reopened the Material Instance. What's the final verification step?</p>",
            "choices": [
                {
                    "text": "<p>Verify that the statue now renders correctly in the level viewport and that the texture preview in the Material Instance Editor is accurate.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Final verification confirms the resolution of the entire problem.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Check 'stat gpu' in the console for rendering performance improvements.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While good practice, confirming the visual fix is paramount, not performance at this stage.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Close the editor and re-open the project entirely to be absolutely sure.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Reopening the MI should be sufficient; a full project restart is usually only needed for very deep engine-level caches.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Modify another texture's loading setting to see if it causes similar issues.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.15hrs. This is not a verification step; it's creating new potential problems instead of confirming the current fix.</p>",
                    "next": "step-21"
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
