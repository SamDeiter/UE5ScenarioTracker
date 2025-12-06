window.SCENARIOS['DataLayerStreamingOverride'] = {
    "meta": {
        "title": "Decorative Props Popping In Too Close in World Partition",
        "description": "We have recently completed placing a dense patch of static mesh actors (bushes and rocks) in a new wilderness area using a dedicated Data Layer. When testing in PIE, the surrounding landscape tiles and nearby structural meshes stream in correctly at about 500 meters. However, the newly placed bushes and rocks only become visible when the player is extremely close (approximately 10 meters away), causing obvious and jarring visual popping as the player approaches the area.",
        "estimateHours": 0.8,
        "category": "World Partition & Streaming",
        "tokens_used": 9810
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "worldpartition",
            "title": "Step 1: Initial Problem Observation",
            "prompt": "You've observed decorative props (bushes and rocks) popping in too close during PIE. What is the *first* practical step to begin debugging this issue within the Unreal Editor?",
            "choices": [
                {
                    "text": "<p>Enter Play In Editor (PIE) mode to visually confirm the problem and note specific locations or affected assets.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. It's crucial to first-hand observe and confirm the exact symptoms in the runtime environment.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Open the Output Log (Window -> Developer Tools -> Output Log) to check for streaming errors.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While logs can be useful, visual confirmation in PIE should precede diving into logs for this type of issue.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Run console commands like <code>stat unit</code> or <code>stat streaming</code> to check for performance bottlenecks.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Performance stats are good later, but first, confirm the visual symptom and its exact nature.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Immediately try rebuilding all Hierarchical Level of Detail (HLODs) for the wilderness area.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.25hrs. Modifying HLODs is a common response to LOD issues, but this is a streaming distance problem, not necessarily an HLOD generation problem. This diverts focus from the real cause.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "worldpartition",
            "title": "Step 2: Selecting Problematic Actors",
            "prompt": "You've confirmed the visual popping in PIE. Your next step is to investigate the properties of the problematic assets. How do you efficiently target and select these specific assets in the editor?",
            "choices": [
                {
                    "text": "<p>Select a subset of the problematic Static Mesh Actors (bushes/rocks) in the Level Viewport or the Outliner.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.04hrs. Focusing on a representative subset of problematic actors is efficient for debugging.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Select the entire landscape actor and examine its properties.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. The issue is with the props, not the landscape. Examining the landscape's properties directly won't reveal the prop's streaming issue.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Filter the Outliner for all \"Static Mesh Actors\" and inspect properties in bulk.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While comprehensive, this might show too many unrelated actors and be less focused than selecting a specific subset.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Use the selection brush to grab a large area, including non-problematic actors.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Similar to bulk selection, it's less efficient than targeting specific problematic assets.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "worldpartition",
            "title": "Step 3: Verify World Partition Management",
            "prompt": "With a few problematic actors selected, you need to verify they are intended to be streamed by World Partition. What key property in the Details panel indicates this?",
            "choices": [
                {
                    "text": "<p>Examine the 'Is Spatially Loaded' checkbox in the 'World Partition' section of the Details panel.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This checkbox explicitly tells World Partition whether to manage an actor's streaming based on spatial location.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Check the 'Mobility' setting (Static/Stationary/Movable) under the 'Transform' section.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Mobility primarily affects rendering and lighting, not World Partition streaming behavior.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Look for 'LOD Settings' under the 'Static Mesh' component section.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. Checking individual Static Mesh Asset properties (like LOD settings) instead of focusing on actor instance streaming parameters is a common misstep for this specific issue.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Inspect the 'Initial State' property within the 'World Partition' section.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Initial State' controls if an actor starts loaded or unloaded, but not how it responds to spatial streaming distance.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "worldpartition",
            "title": "Step 4: Identify Data Layer Assignment",
            "prompt": "'Is Spatially Loaded' is enabled, confirming these actors are managed by World Partition. To understand their specific streaming behavior, what *grouping mechanism* should you investigate next?",
            "choices": [
                {
                    "text": "<p>In the 'Data Layers' section of the Details panel, identify the specific Data Layer assigned to these assets (e.g., 'DL_GroundCover_Details').</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Data Layers are a primary way to group actors and control their streaming behavior, including overrides.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Look for a 'Streaming Grid Override' property on the actor itself.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While World Partition uses grids, direct 'Streaming Grid Override' properties on individual actors are not the standard method for this type of broad adjustment.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Check the actor's 'HLOD Layer' assignment.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.25hrs. Modifying the 'HLOD Layer' or generating new HLOD meshes is a common misdirection, assuming the issue is related to mesh reduction/LOD settings.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Examine the actor's 'Tags' to see if any custom streaming tags are applied.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While tags can be used for custom logic, Data Layers are the built-in and more direct mechanism for streaming groups.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "worldpartition",
            "title": "Step 5: Accessing Global World Settings",
            "prompt": "You've identified the Data Layer, e.g., 'DL_GroundCover_Details'. Your next step is to access its *global configuration*. Where in the Unreal Editor do you find global settings related to the World and its partitions?",
            "choices": [
                {
                    "text": "<p>Open the main World Settings panel (Window -> World Settings).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. World Settings is the central place for configuring world-level properties, including World Partition and Data Layers.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Search for \"Data Layers\" in the Project Settings (Edit -> Project Settings).</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Project Settings define engine-wide behaviors, but specific world-instance configurations like Data Layers are in World Settings.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Use the 'Data Layers' tab in the Outliner, which displays a list of Data Layers.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The Outliner's Data Layers tab shows what's in the world but doesn't allow editing their global properties.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Attempt to right-click on the Data Layer in the Outliner and find a 'Properties' option.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This action won't yield the global configuration panel you need.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "worldpartition",
            "title": "Step 6: Locating Data Layers Section in World Settings",
            "prompt": "With the World Settings panel open, you need to navigate to the section specifically for Data Layer management. Where is this located?",
            "choices": [
                {
                    "text": "<p>Locate the 'Data Layers' section within the World Settings panel.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. The 'Data Layers' section is where World Partition's Data Layer settings are managed.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Go to the 'World Partition Setup' section.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While related to World Partition, the specific Data Layer tools are in their own dedicated section.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Check the 'Level Streaming' or 'Always Loaded Cells' sections.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. These sections relate to streaming but not the master configuration of Data Layers themselves.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Use the search bar within World Settings to find \"Data Layers.\"</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While functional, direct navigation is more efficient when you know the section's location.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "worldpartition",
            "title": "Step 7: Launching Data Layers Editor",
            "prompt": "You've found the 'Data Layers' section in World Settings. What is the precise action you take to open the dedicated editor for managing and configuring Data Layers?",
            "choices": [
                {
                    "text": "<p>Click the 'Edit Data Layers' button to launch the dedicated Data Layers Editor window.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. The 'Edit Data Layers' button is the gateway to the detailed Data Layers Editor.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Click the 'Build Data Layers' button.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Build Data Layers' is for processing changes, not for opening the editor to configure them.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Attempt to modify Data Layer properties directly within the World Settings table (no direct editing).</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. World Settings provides an overview, but not direct editing for Data Layer properties; a dedicated editor is needed.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Click 'Refresh Data Layers' to update the list.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Refreshing only updates the display, it doesn't open the editor for configuration.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "worldpartition",
            "title": "Step 8: Locating Specific Data Layer in Editor",
            "prompt": "The Data Layers Editor window is now open. Your goal is to inspect the specific configuration of 'DL_GroundCover_Details'. How do you find it in this editor?",
            "choices": [
                {
                    "text": "<p>In the Data Layers Editor, locate the identified Data Layer (e.g., 'DL_GroundCover_Details') within the list.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Navigating to the specific Data Layer in the editor's list is the next logical step.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Create a new Data Layer to see if the problem affects default settings.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Creating a new Data Layer is a diagnostic detour; focus on the problematic one first.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Unload all other Data Layers to isolate the problem.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Unloading Data Layers affects runtime, not their configuration properties.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Check the 'Always Loaded' property for the 'Default Data Layer'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While the default layer is important, the problem is with the specific 'DL_GroundCover_Details'.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "worldpartition",
            "title": "Step 9: Selecting the Data Layer in Editor",
            "prompt": "You've located 'DL_GroundCover_Details' in the Data Layers Editor. Now, how do you select it to prepare for viewing its properties?",
            "choices": [
                {
                    "text": "<p>Click on the 'DL_GroundCover_Details' entry in the Data Layers Editor list to select it.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Selecting the Data Layer is a necessary preliminary step before accessing its details.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Right-click the Data Layer and select 'Set as Primary'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Setting as primary affects new actor assignment, not viewing properties.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Drag the Data Layer into the World Partition viewer window.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This action provides a visual representation but doesn't open the property panel.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Export the Data Layer to a text file to read its properties.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Exporting is for external use, not direct in-editor inspection.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "worldpartition",
            "title": "Step 10: Viewing Data Layer Properties",
            "prompt": "You've selected 'DL_GroundCover_Details'. How do you now open its individual property panel to view and modify its specific settings?",
            "choices": [
                {
                    "text": "<p>Double-click the Data Layer entry or ensure it's selected and view its properties panel within the Data Layers Editor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Double-clicking or selecting and viewing the dedicated properties panel is the correct way to access its settings.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Right-click the Data Layer and choose 'Delete Selected'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Deleting the Data Layer would compound the problem, not solve it.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Try to edit properties directly in the list view (no direct editing available).</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The list view is for selection and overview, not direct property editing.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Search for the Data Layer in the Content Browser and open it.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Data Layers are not typically assets in the Content Browser like Blueprints or Static Meshes.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "worldpartition",
            "title": "Step 11: Inspecting Runtime Properties",
            "prompt": "The properties panel for 'DL_GroundCover_Details' is open. Which section within these properties specifically governs how this Data Layer's contents are streamed at runtime by World Partition?",
            "choices": [
                {
                    "text": "<p>Inspect the 'Runtime Properties' section of the Data Layer configuration.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. 'Runtime Properties' are directly responsible for how the Data Layer behaves during gameplay, including streaming.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Review the 'Editor Properties' section (e.g., color, visibility in editor).</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Editor properties only affect how the Data Layer is displayed and managed in the editor, not its runtime behavior.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Check the 'General' section for basic information like name and description.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. General properties are informational and don't control runtime streaming.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Look for a 'Debug' or 'Logging' section within the properties.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Debug sections are for diagnostics, not configuration of streaming distances.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "worldpartition",
            "title": "Step 12: Identifying Streaming Distance Override",
            "prompt": "Inside 'Runtime Properties', you're looking for a setting that could override the global World Partition streaming distance for its contained actors. What is this property called?",
            "choices": [
                {
                    "text": "<p>Identify the 'Streaming Distance Override' property for this specific Data Layer.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. 'Streaming Distance Override' directly controls if and how a Data Layer alters the default streaming distance.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Look for 'Min Streaming Distance' or 'Max Streaming Distance' as separate properties.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. These specific properties don't exist in the Data Layer runtime properties for this purpose.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Check the 'Is Loaded By Default' checkbox.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Is Loaded By Default' controls initial load state, not the dynamic streaming distance.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Examine 'Is Resolvable' or 'Always Loaded' options.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. These are related to Data Layer interaction and loading but not a specific distance override.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "worldpartition",
            "title": "Step 13: Confirming Problematic Override Value",
            "prompt": "You've found 'Streaming Distance Override'. Based on the observed problem (popping at 10m), what value do you expect to see configured here, and what value would indicate the default behavior (500m)?",
            "choices": [
                {
                    "text": "<p>Confirm that the 'Streaming Distance Override' is set to an abnormally low value (e.g., 1000.0, representing 10 meters, instead of using the global grid distance).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. A low override value directly explains the short streaming distance, overriding the desired global setting.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>The value is already 0.0, so the issue must be with the global World Partition Streaming Distance. You proceed to modify the global streaming distance.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.3hrs. Increasing the global 'Streaming Distance' setting within the World Partition map configuration unnecessarily loads all other distant actors sooner, which is inefficient and not the targeted fix for the Data Layer specific issue. This indicates you need to re-evaluate the Data Layer properties.</p>",
                    "next": "step-14_wrong_global_streaming"
                },
                {
                    "text": "<p>The value is very high, suggesting actors are loaded too early, so you need to decrease it.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. A very high value would cause *earlier* streaming, which contradicts the symptom of popping in too close.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Confirm that 'Is Spatially Loaded' is also checked here (this is an actor property, not a Data Layer property).</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Is Spatially Loaded' is an actor property, not a setting configurable on the Data Layer itself.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14_wrong_global_streaming": {
            "skill": "worldpartition",
            "title": "Step 14: Global Streaming Distance Detour",
            "prompt": "You've chosen to investigate the global World Partition Streaming Distance, believing the Data Layer override isn't the problem. You open World Settings, locate the global streaming distance property, and increase it significantly. What is the consequence of this action?",
            "choices": [
                {
                    "text": "<p>This action causes *all* distant actors, not just the problematic ones, to load sooner, leading to increased memory usage and potentially degrading performance globally. This is an inefficient and untargeted solution, indicating the root cause still lies elsewhere, likely in the Data Layer properties you just checked. You should return to inspecting the Data Layer.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.0hrs. Recognizing the inefficiency of a global change steers you back to the targeted Data Layer investigation. The previous penalty for the wrong choice still applies.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>All actors now stream in correctly, solving the problem efficiently with minimal side effects.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. This is incorrect. A global increase is rarely efficient or targeted for specific actor groups and comes with performance costs.</p>",
                    "next": "step-14_wrong_global_streaming"
                },
                {
                    "text": "<p>It has no noticeable effect on the popping, indicating the issue is not related to streaming distance at all.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While it might not *fix* the specific problem if the Data Layer override is still active, it *would* have a global effect, making this assessment wrong.</p>",
                    "next": "step-14_wrong_global_streaming"
                },
                {
                    "text": "<p>It causes a crash due to excessive memory allocation.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. While possible in extreme cases, a crash is not the primary or guaranteed consequence of simply increasing streaming distance.</p>",
                    "next": "step-14_wrong_global_streaming"
                }
            ]
        },
        "step-15": {
            "skill": "worldpartition",
            "title": "Step 15: Resetting Streaming Distance Override",
            "prompt": "You've correctly identified that 'Streaming Distance Override' is set to an abnormally low value (e.g., 1000.0). What is the specific corrective action you must take to make these bushes and rocks stream in at the default global World Partition distance (500m)?",
            "choices": [
                {
                    "text": "<p>Reset the 'Streaming Distance Override' property value back to 0.0. This tells the World Partition system to default back to the standard global streaming distance defined by the Runtime Grid settings.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.15hrs. Setting the override to 0.0 explicitly tells World Partition to use the global streaming distance, resolving the conflict.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Increase the 'Streaming Distance Override' to a very high value like 50000.0 to force them to load earlier.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While this would load them earlier, it's not the ideal solution. It's better to default to the global setting unless specific behavior is required.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Disable the 'Is Loaded By Default' property for this Data Layer.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This would make them start unloaded, but wouldn't fix the spatial streaming distance once they *do* load.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Create a new Data Layer with default settings and reassign all problematic actors to it.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. This is a workaround, but it's more work than simply correcting the existing Data Layer's override.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "worldpartition",
            "title": "Step 16: Saving Data Layer Changes",
            "prompt": "The 'Streaming Distance Override' for 'DL_GroundCover_Details' is now correctly set to 0.0. What is the essential next step within the Data Layers Editor to ensure this change is saved and applied?",
            "choices": [
                {
                    "text": "<p>Save the changes in the Data Layers Editor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Saving changes in the Data Layers Editor commits the modifications to the project.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Close the Data Layers Editor, assuming changes are automatically saved.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Always explicitly save changes in editors to prevent losing your work.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Click 'Rebuild Data Layers' to process the change.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Rebuild' processes data, but 'Save' is for persisting the configuration changes.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Export the Data Layer configuration to a file.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Exporting is for backup or sharing, not for applying changes to the current project.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "worldpartition",
            "title": "Step 17: Saving the Main Map",
            "prompt": "The Data Layers Editor changes are saved. What is the immediate next step *outside* of the Data Layers Editor to prepare for testing?",
            "choices": [
                {
                    "text": "<p>Save the main map (Level).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.025hrs. Saving the main map ensures all world-related changes, including Data Layer associations, are persisted.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Immediately launch PIE without saving the map.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Unsaved changes might not be reflected in PIE, leading to confusion or loss of work.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Restart the Unreal Editor to ensure all settings are reloaded.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While sometimes necessary, restarting is often overkill for simple property changes if the map is saved correctly.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Validate the project files.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Validating project files is a maintenance task, not a step in applying configuration changes.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "worldpartition",
            "title": "Step 18: Testing the Fix in PIE",
            "prompt": "The map is saved. What is the crucial verification step to confirm that the bushes and rocks now stream in at the correct distance (500m)?",
            "choices": [
                {
                    "text": "<p>Test in PIE mode, navigating to the problematic wilderness area.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.025hrs. Testing in PIE is the direct way to observe and confirm the visual outcome of your changes.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Launch a standalone game build to test performance.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. A standalone build is for more rigorous testing, but PIE is sufficient for initial visual confirmation of streaming.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Re-check the 'Streaming Distance Override' in the Data Layers Editor to ensure it's still 0.0.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While good for double-checking, direct visual confirmation in PIE is the ultimate test of the fix.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Re-generate Hierarchical Level of Detail (HLOD) meshes for the area.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.25hrs. This is another misdirection to HLODs, which are not the root cause of this specific streaming distance problem.</p>",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "worldpartition",
            "title": "Step 19: Confirming Successful Streaming",
            "prompt": "You've tested in PIE, navigated to the problematic area, and observed that the bushes and rocks now stream in correctly at about 500m, without jarring popping. What's the final action for this debugging scenario?",
            "choices": [
                {
                    "text": "<p>Confirm the successful resolution and conclude the scenario.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The problem is resolved, and the solution verified.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Adjust other World Partition settings to optimize streaming further, even though the main problem is solved.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While optimization is good, the current scenario focuses on solving a specific problem. Unnecessary tweaking can introduce new issues.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Document the fix in a separate text file or a bug tracking system.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Documentation is a good practice, but not the final *technical* step of solving this specific debugging scenario.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Inform the team that all HLODs need to be regenerated to prevent future issues.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.25hrs. This reinforces a mistaken belief about HLODs being the cause or a necessary part of this fix.</p>",
                    "next": "step-19"
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
