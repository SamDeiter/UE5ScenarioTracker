window.SCENARIOS['DataLayerStreamingOverride'] = {
    "meta": {
        "title": "Decorative Props Popping In Too Close in World Partition",
        "description": "We have recently completed placing a dense patch of static mesh actors (bushes and rocks) in a new wilderness area using a dedicated Data Layer. When testing in PIE, the surrounding landscape tiles and nearby structural meshes stream in correctly at about 500 meters. However, the newly placed bushes and rocks only become visible when the player is extremely close (approximately 10 meters away), causing obvious and jarring visual popping as the player approaches the area.",
        "estimateHours": 0.8,
        "category": "World Partition & Streaming"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "worldpartition",
            "title": "Step 1: Observe Popping Behavior",
            "prompt": "You are experiencing jarring visual popping: newly placed bushes and rocks appear only ~10m away. Other elements stream at 500m. What is your first logical action?",
            "choices": [
                {
                    "text": "<p>Select a subset of the problematic Static Mesh Actors (bushes/rocks) in the Level Viewport or Outliner.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Begin by isolating the specific assets causing the issue for targeted investigation.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Open the Static Mesh Editor for one of the bushes to inspect its LOD settings and check for 'Min Draw Distance'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. While LODs affect visibility, this issue is about *streaming*, not mesh detail. Checking individual asset properties is often a distraction from streaming issues.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Immediately increase the global 'Streaming Distance' in World Settings to force everything to load earlier.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.3hrs. This is a blunt instrument. It will affect all actors and can lead to unnecessary memory usage and performance hits. It doesn't address the root cause of *why* these specific props stream late.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Generate new HLOD meshes for the problematic foliage to ensure better performance at distance.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.25hrs. HLODs are for performance optimization at distance, not for fixing primary streaming visibility. Generating them won't solve an actor instance's 'pop-in' issue.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "worldpartition",
            "title": "Step 2: Examine Actor Details",
            "prompt": "You've selected a few problematic bushes. Where should you look next to understand their World Partition streaming behavior?",
            "choices": [
                {
                    "text": "<p>Examine the Details panel for the selected actors.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The Details panel provides instance-specific properties relevant to World Partition streaming.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Check the World Outliner for their exact position coordinates to ensure they are within the World Partition grid.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While position is important, the problem isn't about *if* they are in the grid, but *how* they are streaming. This won't reveal streaming properties.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Open the 'Content Browser' to find the Static Mesh asset and check its import settings.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. The issue is with the *actor instances* and how World Partition handles them, not the base mesh asset's import settings or LODs.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Go to Project Settings and search for World Partition streaming settings.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. Project Settings contain global engine configurations, but instance-specific or map-specific streaming overrides are found in the editor or World Settings.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "worldpartition",
            "title": "Step 3: Verify Spatial Loading",
            "prompt": "In the Details panel for selected actors, what is a key property to check regarding World Partition streaming?",
            "choices": [
                {
                    "text": "<p>Confirm that the 'Is Spatially Loaded' checkbox is enabled.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This ensures the actors are managed by the spatial grid streaming system, which is fundamental for World Partition.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Look for 'Actor Hidden In Game' to ensure they aren't accidentally hidden by default.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While a possible cause for invisibility, the symptom describes *popping in*, not perpetual hiddenness. This is unlikely to be the primary issue here.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Check the 'LOD Group' setting to see if it's set to a very aggressive LOD level.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. LODs affect visual detail based on distance, but not the actual streaming in/out of actors at the World Partition level.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Examine the 'Collision Presets' to ensure there are no unintended collision filters preventing rendering.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Collision settings are unrelated to visual streaming or pop-in issues.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "worldpartition",
            "title": "Step 4: Check Actor Loading Range",
            "prompt": "With 'Is Spatially Loaded' confirmed, are there any other instance-specific loading overrides to check on the selected actors?",
            "choices": [
                {
                    "text": "<p>Look for 'Loading Range' or similar properties that might override global streaming for these specific actors.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Individual actors can have their own loading ranges, though less common for foliage.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Adjust the 'Draw Distance' for the individual static mesh component within the actor's details.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. This property is usually a fallback for non-WP objects or specific visual culling, less directly tied to World Partition streaming behavior.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Change the 'Mobility' setting from Static to Movable to see if it affects streaming.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Mobility primarily impacts lighting and rendering performance, not World Partition streaming distance.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Examine 'Rendering' properties like 'Visible' or 'Hidden In Game' to ensure they are set correctly.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. These settings control basic visibility, not the distance-based streaming controlled by World Partition.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "worldpartition",
            "title": "Step 5: Identify Data Layer",
            "prompt": "If no individual actor overrides are found, what's the next critical piece of information from the Details panel related to streaming?",
            "choices": [
                {
                    "text": "<p>In the 'Data Layers' section, identify the specific Data Layer assigned to these assets (e.g., 'DL_GroundCover_Details').</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The Data Layer is the primary grouping mechanism for streaming properties in World Partition beyond individual actors.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Look at the 'Tags' section to see if any tags are preventing streaming.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Tags are for organization and custom logic, not typically for controlling World Partition streaming distances directly.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Change the 'Z-Order' of the selected actors to bring them visually forward.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Z-order relates to 2D UI elements or render priority in certain contexts, not 3D object streaming.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Verify the 'Component Tags' of the Static Mesh Component to ensure they are correctly configured.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Component tags are for internal component logic and typically irrelevant to World Partition streaming distances.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "worldpartition",
            "title": "Step 6: Initial Conclusion on Actors",
            "prompt": "You've checked actor properties and individual overrides. 'Is Spatially Loaded' is true, and a Data Layer is assigned. What's your conclusion?",
            "choices": [
                {
                    "text": "<p>The issue is likely with the Data Layer's configuration, not individual actor settings.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This logical deduction allows you to shift focus to the Data Layer settings.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>The problem must be with the base Static Mesh asset itself, perhaps its default LODs or bounds.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. While plausible, the consistency across many actors points away from a mesh asset issue and more towards a systemic streaming setting.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>It indicates a global World Partition grid setting is overriding everything, which needs to be adjusted.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While possible, Data Layers provide a more granular override, making it the next logical place to check before resorting to global settings.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>The issue might be due to a bug in the engine or project and requires restarting the editor.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Unlikely to be a bug without further evidence; engine configuration issues are more common.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "worldpartition",
            "title": "Step 7: Access World Settings",
            "prompt": "Having identified the Data Layer, you now need to examine its settings. Where do you go to access Data Layer configurations?",
            "choices": [
                {
                    "text": "<p>Open the main World Settings panel (Window -> World Settings).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. World Settings is the central hub for map-specific configurations, including World Partition and Data Layers.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Open Project Settings and navigate to the 'World Partition' section.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Project Settings contain global engine settings, but map-specific Data Layer configuration is in World Settings.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Right-click on the selected actors and look for 'Data Layer' options in the context menu.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While you can assign Data Layers this way, you cannot *configure* their properties from an actor's context menu.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Search for 'Data Layer Editor' in the search bar of the main editor window.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The Data Layers Editor is usually accessed via World Settings, not directly through a global search.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "worldpartition",
            "title": "Step 8: Find Data Layers Section",
            "prompt": "In the World Settings panel, where do you find the gateway to Data Layer configurations?",
            "choices": [
                {
                    "text": "<p>Locate the 'Data Layers' section within the World Settings panel.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This section in World Settings provides access to the dedicated Data Layers Editor.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Look under the 'World Partition' section for 'Streaming Settings'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. While related to World Partition, the Data Layers have their own dedicated section for management.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Search the World Settings panel for 'Streaming Distance' to find global overrides.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.3hrs. This might lead you to the global streaming distance, which is not the specific cause of this localized issue and would be an inefficient global change.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Check the 'Runtime Grid' section for density settings.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Runtime Grid settings define the overall grid structure, but individual Data Layer overrides are managed separately.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "worldpartition",
            "title": "Step 9: Open Data Layers Editor",
            "prompt": "Within the 'Data Layers' section of World Settings, how do you proceed to manage individual Data Layer properties?",
            "choices": [
                {
                    "text": "<p>Click the 'Edit Data Layers' button to launch the dedicated Data Layers Editor window.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This button opens the editor where you can view and modify individual Data Layer properties.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Click the 'Add Data Layer' button to create a new Data Layer for debugging.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Creating a new Data Layer is unnecessary; you need to investigate an existing one.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Right-click on one of the listed Data Layers in the World Settings panel and look for 'Properties'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The World Settings panel usually only lists Data Layers; detailed editing requires the dedicated editor.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Export the Data Layer list to a CSV file to inspect it externally.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Exporting is for data analysis, not direct configuration of runtime properties.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "worldpartition",
            "title": "Step 10: Data Layers Editor Open",
            "prompt": "The Data Layers Editor is now open. What's your next move to find the problematic Data Layer?",
            "choices": [
                {
                    "text": "<p>Locate the identified Data Layer (e.g., 'DL_GroundCover_Details') in the Data Layers Editor list.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. You need to find the specific Data Layer you identified earlier to inspect its properties.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Check the 'Filter' options in the Data Layers Editor to hide unrelated layers.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. While useful for large projects, it's an optimization, not the direct next step to find a known Data Layer.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Immediately look for a global 'Streaming Distance' setting within the Data Layers Editor.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.3hrs. There isn't a global 'Streaming Distance' in the Data Layers Editor. Such a setting would be in World Settings.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Right-click on any Data Layer and select 'Reload' to ensure all settings are current.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Not necessary unless you suspect data corruption or outdated information, which is not indicated by the symptoms.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "worldpartition",
            "title": "Step 11: View Data Layer Properties",
            "prompt": "You've located 'DL_GroundCover_Details' in the Data Layers Editor. How do you access its specific configuration properties?",
            "choices": [
                {
                    "text": "<p>Double-click the Data Layer entry or select it and view its properties panel within the Data Layers Editor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This action will display the detailed properties for the selected Data Layer.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Drag the Data Layer to a different group to see if it affects streaming.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Grouping is for organization, not for altering runtime streaming properties directly.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Click the 'Generate HLODs' button specifically for this Data Layer.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.25hrs. Generating HLODs is a performance optimization, not a fix for a streaming distance issue. It's a misdiagnosis of the problem's cause.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Export the Data Layer's settings to a file for external inspection.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Exporting is for analysis or backup, not for direct modification within the editor.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "worldpartition",
            "title": "Step 12: Inspect Runtime Properties",
            "prompt": "With the Data Layer's properties displayed, which section is most relevant to streaming behavior?",
            "choices": [
                {
                    "text": "<p>Inspect the Runtime Properties section of the Data Layer configuration.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. The Runtime Properties section holds settings that directly influence how the Data Layer is handled during gameplay, including streaming.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Check the 'Editor Properties' section for any visible/hidden flags.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Editor Properties primarily affect how the Data Layer behaves in the editor, not its runtime streaming.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Review the 'Parent Data Layers' to see if an inherited property is causing the issue.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While inheritance is possible, it's best to check the direct layer properties first before diving into complex inheritance chains.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Examine the 'Label' and 'Description' fields for clues.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. These are descriptive fields only and have no runtime impact on streaming.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "worldpartition",
            "title": "Step 13: Examine Runtime Settings",
            "prompt": "You are in the 'Runtime Properties' section. What specific property are you looking for that might control streaming distance?",
            "choices": [
                {
                    "text": "<p>Identify the 'Streaming Distance Override' property for this specific Data Layer.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This property directly controls the streaming distance for actors assigned to this Data Layer.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Look for 'Always Loaded' to see if it's unintentionally enabled, preventing streaming.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Always Loaded' would make the objects *always visible*, not cause pop-in at 10m. It's the opposite of the symptom.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Check 'Is Runtime Loadable' to ensure the Data Layer can actually be streamed.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. If 'Is Runtime Loadable' was false, the objects wouldn't stream *at all*. Since they appear at 10m, it must be loadable.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Adjust the 'HLOD Layer' assigned to the Data Layer.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.25hrs. HLOD Layers are for aggregated mesh rendering, not for controlling the primary streaming distance of individual actors.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "worldpartition",
            "title": "Step 14: Identify Streaming Distance Override",
            "prompt": "You've located the 'Streaming Distance Override' property. What do you need to do next to confirm the problem?",
            "choices": [
                {
                    "text": "<p>Confirm that the 'Streaming Distance Override' is set to an abnormally low value (e.g., 1000.0, representing 10 meters).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This is the direct confirmation of the root cause, matching the observed symptom.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Immediately set the 'Streaming Distance Override' to a very high value (e.g., 100000.0) to see if it fixes the issue.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. While this might fix the immediate symptom, it's a brute-force approach that could lead to performance issues due to over-streaming. Confirm the current value first.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Check the global 'Streaming Distance' in World Settings to see if it's conflicting with this override.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.3hrs. This Data Layer override *supersedes* the global setting, so checking the global setting now is less efficient than confirming the override itself.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Modify the 'Activation Range' of the Data Layer, assuming it affects streaming distance.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Activation Range' affects when the Data Layer becomes active, not necessarily its specific streaming distance for contained actors.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "worldpartition",
            "title": "Step 15: Confirm Incorrect Value",
            "prompt": "You've identified 'Streaming Distance Override' and see it's set to 1000.0 (10 meters). What is your definitive action?",
            "choices": [
                {
                    "text": "<p>Reset the 'Streaming Distance Override' property value back to 0.0.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.15hrs. Setting it to 0.0 tells World Partition to use the standard global streaming distance, which is the desired behavior.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Manually enter 50000.0 (500 meters) into the 'Streaming Distance Override' field.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. While this would achieve the desired distance, setting it to 0.0 is the cleaner, more maintainable solution as it defaults to the global grid settings.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Increase the 'LOD Bias' for the Data Layer to make meshes visible from further away.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. LOD Bias affects which LOD level is used at distance, not whether the entire actor instance streams in or out.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Set the 'Is Spatially Loaded' checkbox to false for the Data Layer to disable spatial loading.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This would prevent the actors from streaming *at all*, or make them always loaded if 'Always Loaded' is true, neither of which is the intended fix.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "worldpartition",
            "title": "Step 16: Understand Default Behavior",
            "prompt": "You've set 'Streaming Distance Override' to 0.0. What does this value signify for World Partition?",
            "choices": [
                {
                    "text": "<p>It tells the World Partition system to default back to the standard global streaming distance defined by the Runtime Grid settings.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Understanding this default behavior is crucial for proper World Partition management.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>It means the Data Layer will never stream and will always be loaded, regardless of distance.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This is incorrect. 0.0 is a special value signifying 'use default', not 'always load'.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>It disables streaming for this Data Layer, making all contained actors invisible.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This is also incorrect. Disabling streaming would require a different setting or unchecking 'Is Runtime Loadable'.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>It sets the streaming distance to exactly 0 meters, meaning actors will only appear when inside the player character.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While a distance of 0 is conceptually 'inside', for this specific property, 0.0 acts as a 'reset to default' flag.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "worldpartition",
            "title": "Step 17: Save Data Layer Changes",
            "prompt": "You've made the necessary change in the Data Layers Editor. What's the immediate next action to ensure your changes persist?",
            "choices": [
                {
                    "text": "<p>Save the changes in the Data Layers Editor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Saving within the Data Layers Editor commits the changes to the Data Layer asset.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Close the Data Layers Editor without saving, assuming changes are auto-saved.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Most Unreal editor changes require explicit saving to persist.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Rebuild the lighting for the level to ensure visual updates.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Lighting rebuilds are unrelated to World Partition streaming distances.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Generate new HLODs for the entire map to reflect the Data Layer change.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.25hrs. HLODs are not directly influenced by Data Layer streaming distances in this manner and are not required at this stage.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "worldpartition",
            "title": "Step 18: Save Main Map",
            "prompt": "You've saved the Data Layer. What else needs to be saved to ensure the level correctly uses the updated Data Layer configuration?",
            "choices": [
                {
                    "text": "<p>Save the main map (level) itself.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The map references the Data Layer, so saving the map ensures it uses the latest Data Layer asset configuration.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Export the World Partition grid data to a new file.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Exporting grid data is for analysis or migration, not for applying runtime changes.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Restart the Unreal Editor completely.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While sometimes a last resort, saving the map and testing in PIE is the direct and efficient next step.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Recompile all blueprints in the project.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Blueprint compilation is unrelated to World Partition streaming configuration.</p>",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "worldpartition",
            "title": "Step 19: Test in PIE",
            "prompt": "With all changes saved, how do you verify the fix for the streaming distance?",
            "choices": [
                {
                    "text": "<p>Test in PIE (Play In Editor) to confirm the bushes and rocks now stream in at the correct distance (500m).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. PIE is the best way to quickly test runtime streaming behavior in the editor.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Launch a standalone game build to test streaming in a packaged environment.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. A standalone build is a much longer process than PIE for initial verification.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Use 'stat streaming' console command in editor to check streaming statistics without playing.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While 'stat streaming' is useful for diagnostics, visually confirming in PIE is more direct for this specific problem.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Place a debug sphere actor to visualize the Data Layer's streaming bounds.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This could be done, but a direct PIE test is more conclusive for verifying the visual fix.</p>",
                    "next": "step-19"
                }
            ]
        },
        "step-20": {
            "skill": "complete",
            "title": "Step 20: Confirm Resolution",
            "prompt": "PIE testing shows bushes and rocks stream at 500m, matching other elements. What's your conclusion on the problem and solution?",
            "choices": [
                {
                    "text": "<p>The issue is resolved: the Data Layer's 'Streaming Distance Override' was incorrectly set.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.0hrs. Congratulations! You've successfully identified and resolved the issue.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>The fix is temporary; the streaming distance will likely revert after restarting the editor.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Since you saved both the Data Layer and the map, the changes are persistent.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>The landscape streaming now needs adjustment because it's too far.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The landscape was streaming correctly at 500m initially; no adjustment is needed there.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>The HLODs might still be configured incorrectly, causing future issues at very far distances.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While HLODs are part of a performance pipeline, they were not the cause of the *streaming* issue, and the problem is now resolved.</p>",
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
