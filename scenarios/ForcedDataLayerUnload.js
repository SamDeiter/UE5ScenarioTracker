window.SCENARIOS['ForcedDataLayerUnload'] = {
    "meta": {
        "title": "Gameplay-Critical Landmark Streams Out Prematurely",
        "description": "We have a large, highly visible Clock Tower asset (a Static Mesh Actor placed in the world) that is essential for gameplay navigation and contains a required mission trigger volume at its base. The tower is assigned to the 'DL_KeyLandmarks' Data Layer. When the player moves approximately 50 meters away from the base, the entire Clock Tower and the associated mission trigger volume abruptly unload (stream out), which should not happen because a nearby, pre-placed trigger Blueprint (BP_MissionZone_A) is supposed to keep this entire area loaded until the mission is complete. The goal is to ensure the Clock Tower remains loaded while the player is within the influence of BP_MissionZone_A, regardless of distance to the default World Partition grid boundary.",
        "estimateHours": 1.15,
        "category": "World Partition & Streaming",
        "tokens_used": 9212
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "worldpartition",
            "title": "Step 1: Validate Issue",
            "prompt": "The Clock Tower streams out prematurely despite a nearby mission zone. What's your first action to confirm this behavior?",
            "choices": [
                {
                    "text": "Perform a Play-In-Editor (PIE) session and observe the unloading.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. Confirming the issue in PIE is the essential first step to accurately diagnose the problem.",
                    "next": "step-2"
                },
                {
                    "text": "Open World Settings and check World Partition Streaming Distance.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.2hrs. Adjusting global settings before confirming the specific issue or inspecting actor properties is premature and can lead to unintended side effects. Re-evaluate.",
                    "next": "step-1"
                },
                {
                    "text": "Check `stat unit` in PIE to monitor performance.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. While `stat unit` is useful, the immediate goal is to confirm the streaming behavior, not diagnose performance yet. Re-evaluate.",
                    "next": "step-1"
                },
                {
                    "text": "Manually set the Clock Tower Actor's 'Is Spatially Loaded' property to unchecked (Always Loaded).",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.3hrs. This forces the asset to stay loaded, but bypasses the intended mission control structure and doesn't resolve the underlying issue. Investigate the consequences of this bypass.",
                    "next": "wrong-B-detour-1"
                }
            ]
        },
        "wrong-B-detour-1": {
            "skill": "worldpartition",
            "title": "Detour: Bypassing Mission Control",
            "prompt": "You've forced the Clock Tower to 'Always Loaded'. This prevents streaming out, but what's a significant drawback of this approach for a gameplay-critical asset?",
            "choices": [
                {
                    "text": "It bypasses mission control logic, loads it regardless of relevance, potentially wasting resources and impacting performance.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.0hrs. Correct. This is a temporary workaround, not a solution that respects the design intent. You need to fix the intended system.",
                    "next": "wrong-B-detour-2"
                },
                {
                    "text": "It will break the navigation mesh around the tower.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. Forcing an actor to be 'Always Loaded' doesn't directly corrupt navmesh. This is an incorrect assumption. Re-evaluate.",
                    "next": "wrong-B-detour-1"
                },
                {
                    "text": "It might cause visual glitches or lighting artifacts.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. While possible in rare cases, the primary concern with 'Always Loaded' is resource management and design intent, not direct visual corruption. Re-evaluate.",
                    "next": "wrong-B-detour-1"
                },
                {
                    "text": "It will prevent other Data Layers from loading correctly.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.1hrs. Forcing one actor to 'Always Loaded' doesn't inherently prevent other Data Layers from loading, but it might lead to unexpected interactions or inefficiencies. Re-evaluate.",
                    "next": "wrong-B-detour-1"
                }
            ]
        },
        "wrong-B-detour-2": {
            "skill": "worldpartition",
            "title": "Detour: Reverting Suboptimal Changes",
            "prompt": "You understand the consequence of bypassing the intended system. What action should you take now to properly investigate the issue within the established World Partition framework?",
            "choices": [
                {
                    "text": "Revert the 'Is Spatially Loaded' setting to checked, and restart the diagnosis from the beginning.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. Reverting the change is crucial to diagnose the *actual* problem with the streaming source. Restarting from step 1 ensures a thorough and correct approach.",
                    "next": "step-1"
                },
                {
                    "text": "Search for other 'Always Loaded' settings in Project Settings.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. Chasing more 'Always Loaded' settings is doubling down on a suboptimal solution. Re-evaluate.",
                    "next": "wrong-B-detour-2"
                },
                {
                    "text": "Try to find a way to dynamically set 'Always Loaded' via Blueprint.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. This would still be a workaround, not a fix for the intended streaming source. Re-evaluate.",
                    "next": "wrong-B-detour-2"
                },
                {
                    "text": "Leave it as 'Always Loaded' for now and investigate the mission Blueprint later.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.1hrs. Leaving a suboptimal change in place can mask the true problem or introduce new ones. Revert and diagnose properly. Re-evaluate.",
                    "next": "wrong-B-detour-2"
                }
            ]
        },
        "step-2": {
            "skill": "worldpartition",
            "title": "Step 2: Inspect Clock Tower Actor",
            "prompt": "You've confirmed the Clock Tower streams out in PIE. What's the next logical step to investigate its streaming properties?",
            "choices": [
                {
                    "text": "Open the World Outliner and select the Clock Tower Static Mesh Actor.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. Selecting the actor is necessary to inspect its individual properties in the Details panel.",
                    "next": "step-3"
                },
                {
                    "text": "Open Project Settings and navigate to World Partition settings.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. While relevant, starting with global settings is too broad. Focus on the specific actor first. Re-evaluate.",
                    "next": "step-2"
                },
                {
                    "text": "Right-click the Clock Tower in the viewport and check 'Data Layer' options.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. The Details panel is the primary place for actor properties, not a context menu. Re-evaluate.",
                    "next": "step-2"
                },
                {
                    "text": "Search for 'Clock Tower' in the Content Browser to check the asset properties.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. You need to inspect the *actor instance* in the world, not the content asset. Re-evaluate.",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "worldpartition",
            "title": "Step 3: Verify Data Layer Assignment",
            "prompt": "With the Clock Tower selected in the World Outliner, where do you verify its Data Layer assignment?",
            "choices": [
                {
                    "text": "In the Details panel, under the 'World Partition' section.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. This is the correct location to find the actor's Data Layer assignment.",
                    "next": "step-4"
                },
                {
                    "text": "Check the 'Actor Tags' section in the Details panel.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Actor Tags are generic metadata, not for Data Layer assignments. Re-evaluate.",
                    "next": "step-3"
                },
                {
                    "text": "Open the Level Blueprint and search for references to the Clock Tower.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. Data Layers are actor properties, not typically managed in the Level Blueprint. Re-evaluate.",
                    "next": "step-3"
                },
                {
                    "text": "Open the Data Layers Panel (Window -> Data Layers) to find the Clock Tower entry.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. The Data Layers panel shows the layers themselves, not which specific actors are assigned to them directly. Re-evaluate.",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "worldpartition",
            "title": "Step 4: Check 'Is Spatially Loaded' Property",
            "prompt": "You've confirmed the Clock Tower is assigned to 'DL_KeyLandmarks'. What Actor property should you check next to understand its spatial loading behavior?",
            "choices": [
                {
                    "text": "Ensure the 'Is Spatially Loaded' property is checked in the Details panel.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. This property confirms the actor relies on the World Partition system or Data Layers for streaming, which is the intended behavior.",
                    "next": "step-5"
                },
                {
                    "text": "Change the Actor's 'Mobility' setting (Static, Stationary, Movable).",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Mobility relates to rendering and physics, not spatial streaming. Re-evaluate.",
                    "next": "step-4"
                },
                {
                    "text": "Uncheck 'Is Spatially Loaded' to make the Actor 'Always Loaded'.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.3hrs. This is a workaround that bypasses the intended system, similar to a previous error. Investigate the consequences of this bypass.",
                    "next": "wrong-B-detour-1"
                },
                {
                    "text": "Check the Data Layer asset properties in the Content Browser.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.1hrs. You're inspecting the actor's behavior, not the Data Layer definition itself at this point. Re-evaluate.",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "worldpartition",
            "title": "Step 5: Confirm Data Layer Runtime State",
            "prompt": "The Clock Tower is assigned to 'DL_KeyLandmarks' and 'Is Spatially Loaded' is checked. What's the next logical step regarding the 'DL_KeyLandmarks' Data Layer itself?",
            "choices": [
                {
                    "text": "Open the Data Layers Panel and confirm 'DL_KeyLandmarks' 'Runtime State' is 'Unloaded'.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. The default runtime state should be 'Unloaded' for streaming to work as intended via a streaming source.",
                    "next": "step-6"
                },
                {
                    "text": "Rename the 'DL_KeyLandmarks' Data Layer to 'DL_ClockTower'.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Renaming is irrelevant to the streaming issue and could break other references. Re-evaluate.",
                    "next": "step-5"
                },
                {
                    "text": "Set 'DL_KeyLandmarks' 'Runtime State' to 'Loaded' directly in the Data Layers Panel.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.2hrs. This would force the Data Layer to be loaded, but bypasses the specific mission control logic. Investigate the consequences of this bypass.",
                    "next": "wrong-C-detour-1"
                },
                {
                    "text": "Check the Data Layer asset properties (e.g., 'Initial State') in the Content Browser.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. While useful for initial setup, the 'Runtime State' in the panel shows the current operational state, which is more relevant. Re-evaluate.",
                    "next": "step-5"
                }
            ]
        },
        "wrong-C-detour-1": {
            "skill": "worldpartition",
            "title": "Detour: Circumventing Mission Logic",
            "prompt": "You've manually forced the Data Layer to 'Loaded' or tried creating a new Blueprint to load it. The tower *now* stays loaded, but 'BP_MissionZone_A' is designed to manage this. What's the core problem?",
            "choices": [
                {
                    "text": "This circumvents the existing 'BP_MissionZone_A' and its World Partition Streaming Source component, making the intended mission-driven loading logic obsolete.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.0hrs. Correct. You are bypassing the intended system. The goal is to make the existing system work. Move to the next step to revert this.",
                    "next": "wrong-C-detour-2"
                },
                {
                    "text": "It will conflict with other Data Layers in the map.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. While possible, the primary issue is overriding the specific 'BP_MissionZone_A' logic, not general conflicts. Re-evaluate.",
                    "next": "wrong-C-detour-1"
                },
                {
                    "text": "It makes the debugging process more complex.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. True, but the root problem is bypassing the design, not just complexity. Re-evaluate.",
                    "next": "wrong-C-detour-1"
                },
                {
                    "text": "It will use too much CPU during runtime.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.1hrs. Performance impact is a concern, but the core issue is breaking the design intent for how the mission zone loads areas. Re-evaluate.",
                    "next": "wrong-C-detour-1"
                }
            ]
        },
        "wrong-C-detour-2": {
            "skill": "worldpartition",
            "title": "Detour: Refocusing on the Streaming Source",
            "prompt": "You understand that bypassing 'BP_MissionZone_A' is not the intended solution. How should you proceed to properly diagnose why 'BP_MissionZone_A' isn't working as expected?",
            "choices": [
                {
                    "text": "Undo the manual Data Layer change or discard the new Blueprint, and investigate 'BP_MissionZone_A' directly.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. Reverting the workaround is crucial. Now, you can properly investigate the intended streaming source.",
                    "next": "step-6"
                },
                {
                    "text": "Look for other manual Data Layer loading options in World Settings.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. Continue investigating workarounds is counterproductive. Re-evaluate.",
                    "next": "wrong-C-detour-2"
                },
                {
                    "text": "Ask a designer why 'BP_MissionZone_A' was placed there.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. While communication is good, you are a debugger; your job is to investigate the technical implementation first. Re-evaluate.",
                    "next": "wrong-C-detour-2"
                },
                {
                    "text": "Reload the level to ensure all changes are reset.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. While a good general practice, directly undoing the change and focusing on the target is more efficient. Re-evaluate.",
                    "next": "wrong-C-detour-2"
                }
            ]
        },
        "step-6": {
            "skill": "worldpartition",
            "title": "Step 6: Locate Streaming Blueprint",
            "prompt": "You've verified the Clock Tower and its Data Layer settings are consistent with streaming. The problem states 'BP_MissionZone_A' *should* keep it loaded. What now?",
            "choices": [
                {
                    "text": "Locate 'BP_MissionZone_A' in the World Outliner.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. Now that you've checked the Clock Tower, the next logical step is to inspect the designated streaming source.",
                    "next": "step-7"
                },
                {
                    "text": "Search for 'World Partition Streaming Source' component type in the Content Browser.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. You need to inspect the *instance* of 'BP_MissionZone_A' in the world, not generic component assets. Re-evaluate.",
                    "next": "step-6"
                },
                {
                    "text": "Check 'World Settings' for World Partition options and increase streaming distance.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.5hrs. Increasing global streaming distance is a broad, performance-intensive change that may not address the specific issue. Investigate the consequences of this change.",
                    "next": "wrong-A-detour-1"
                },
                {
                    "text": "Create a new Blueprint to manually load the 'DL_KeyLandmarks' Data Layer on Begin Play.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.4hrs. This bypasses the existing 'BP_MissionZone_A', which is designed for this purpose. Investigate the consequences of this bypass.",
                    "next": "wrong-C-detour-1"
                }
            ]
        },
        "wrong-A-detour-1": {
            "skill": "worldpartition",
            "title": "Detour: Unnecessary Global Streaming",
            "prompt": "You increased the global World Partition Streaming Distance. You notice more distant areas are loaded, but the Clock Tower *still* streams out at 50m. What's the primary issue with this blanket approach?",
            "choices": [
                {
                    "text": "This significantly increases memory usage and negatively impacts performance across the entire map, without addressing the specific mission zone problem.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.0hrs. Correct. Global streaming distance is a blunt instrument for a precise problem. You need to revert this and focus.",
                    "next": "wrong-A-detour-2"
                },
                {
                    "text": "It will cause collision issues with distant objects.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. Increased streaming distance doesn't directly cause collision issues, though it could expose existing ones. Re-evaluate.",
                    "next": "wrong-A-detour-1"
                },
                {
                    "text": "It makes the editor viewport slower.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. While true, the performance impact on *runtime* is the more critical concern. Re-evaluate.",
                    "next": "wrong-A-detour-1"
                },
                {
                    "text": "It doesn't affect Data Layers, only spatial grids.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.1hrs. Streaming distance *does* affect all spatially loaded actors, including those on Data Layers, but it's not the *specific* solution for a designated streaming source. Re-evaluate.",
                    "next": "wrong-A-detour-1"
                }
            ]
        },
        "wrong-A-detour-2": {
            "skill": "worldpartition",
            "title": "Detour: Reverting Global Changes",
            "prompt": "You recognize the performance impact of increasing global streaming distance. What should you do to revert this suboptimal change and return to investigating the intended streaming source?",
            "choices": [
                {
                    "text": "Revert the global streaming distance parameter to its default value and refocus on 'BP_MissionZone_A'.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. Reverting incorrect global changes is important. Now you can focus on the specific problem.",
                    "next": "step-6"
                },
                {
                    "text": "Restart the Unreal Editor to ensure the setting is fully reset.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. While sometimes necessary, restarting is often overkill for a simple setting change. Revert the setting directly. Re-evaluate.",
                    "next": "wrong-A-detour-2"
                },
                {
                    "text": "Use console commands like `r.streaming.poolsize` to optimize memory.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. Optimizing memory is a different task; the immediate goal is to fix the streaming behavior, not mitigate the fallout of a bad setting. Re-evaluate.",
                    "next": "wrong-A-detour-2"
                },
                {
                    "text": "Check profiler tools (`stat gpu`, `stat unit`) to measure the exact impact.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. While good for measurement, the priority is to revert the clearly incorrect change, not just measure its damage. Re-evaluate.",
                    "next": "wrong-A-detour-2"
                }
            ]
        },
        "step-7": {
            "skill": "worldpartition",
            "title": "Step 7: Open Blueprint Editor",
            "prompt": "You've located 'BP_MissionZone_A'. How do you inspect its internal streaming configuration?",
            "choices": [
                {
                    "text": "Double-click 'BP_MissionZone_A' in the World Outliner to open its Blueprint Editor.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. Opening the Blueprint Editor is necessary to access its components and logic.",
                    "next": "step-8"
                },
                {
                    "text": "Check its Transformation properties in the Details panel.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Transformation (location, rotation, scale) is not relevant to streaming logic. Re-evaluate.",
                    "next": "step-7"
                },
                {
                    "text": "Right-click 'BP_MissionZone_A' and select 'Edit Actor'.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. 'Edit Actor' opens a limited details view, not the full Blueprint Editor needed for component inspection. Re-evaluate.",
                    "next": "step-7"
                },
                {
                    "text": "Open the Level Blueprint to see if it references 'BP_MissionZone_A'.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.1hrs. While possible, inspecting the Blueprint itself is more direct for its own streaming configuration. Re-evaluate.",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "worldpartition",
            "title": "Step 8: Select Streaming Source Component",
            "prompt": "Inside 'BP_MissionZone_A' Blueprint Editor, you need to find the component responsible for streaming. Which component is that?",
            "choices": [
                {
                    "text": "In the Components tab, select the 'World Partition Streaming Source' component.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. This is the dedicated component for World Partition streaming behavior.",
                    "next": "step-9"
                },
                {
                    "text": "Select the 'Box Collision' component in the Components tab.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. The Box Collision is typically for gameplay triggers, not streaming activation. Re-evaluate.",
                    "next": "step-8"
                },
                {
                    "text": "Check the Event Graph for 'Activate Data Layer' nodes.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.2hrs. While a Data Layer *could* be activated via Blueprint logic, the existence of a 'World Partition Streaming Source' component implies a declarative approach. Investigate the implications of this assumption.",
                    "next": "wrong-C-detour-3"
                },
                {
                    "text": "Check the Construction Script for streaming logic.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. Construction scripts are typically for editor-time setup, not runtime streaming. Re-evaluate.",
                    "next": "step-8"
                }
            ]
        },
        "wrong-C-detour-3": {
            "skill": "worldpartition",
            "title": "Detour: Focusing on Component-Based Streaming",
            "prompt": "You checked the Event Graph of 'BP_MissionZone_A' and found no explicit 'Activate Data Layer' nodes. This suggests the Blueprint is designed to use a component for streaming. What should you focus on within the Blueprint now?",
            "choices": [
                {
                    "text": "Return to the Components tab and look for the 'World Partition Streaming Source' component.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.0hrs. Correct. When a dedicated streaming component exists, it's the primary place for configuration, not the Event Graph.",
                    "next": "step-9"
                },
                {
                    "text": "Add an 'Activate Data Layer' node to the Event Graph to force it to load.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. Adding custom logic when a dedicated component exists is counter-productive to finding the intended solution. Re-evaluate.",
                    "next": "wrong-C-detour-3"
                },
                {
                    "text": "Investigate the parent class of 'BP_MissionZone_A' for streaming logic.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. While sometimes relevant, focusing on the specific Blueprint's components is more direct. Re-evaluate.",
                    "next": "wrong-C-detour-3"
                },
                {
                    "text": "Check the Blueprint Interface for streaming functions.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. Less likely for basic streaming configuration, which is usually component-based. Re-evaluate.",
                    "next": "wrong-C-detour-3"
                }
            ]
        },
        "step-9": {
            "skill": "worldpartition",
            "title": "Step 9: Examine Streaming Source Details",
            "prompt": "You've selected the 'World Partition Streaming Source' component. Where do you find its specific streaming configuration?",
            "choices": [
                {
                    "text": "Examine the Details panel under the 'Streaming Source' category.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.15hrs. The Details panel is where component-specific properties are configured.",
                    "next": "step-10"
                },
                {
                    "text": "Check the Blueprint Class Settings for the component.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Class settings are for the Blueprint as a whole, not individual component instances. Re-evaluate.",
                    "next": "step-9"
                },
                {
                    "text": "Search for 'streaming' in the Blueprint Editor menu bar.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. Menu items rarely expose specific component properties. Re-evaluate.",
                    "next": "step-9"
                },
                {
                    "text": "Look at the 'Data Layer' property on the root component of the Blueprint.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. The 'World Partition Streaming Source' component has its own relevant properties. Re-evaluate.",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "worldpartition",
            "title": "Step 10: Verify Target Behavior",
            "prompt": "In the 'Streaming Source' details, what property should you verify to ensure the area stays loaded when this source is active?",
            "choices": [
                {
                    "text": "Verify that the 'Target Behavior' property is correctly set to 'Always Loaded'.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. 'Always Loaded' ensures the area remains loaded within the source's influence.",
                    "next": "step-11"
                },
                {
                    "text": "Adjust the 'Streaming Priority' value.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Priority is for conflict resolution, not ensuring persistent loading. Re-evaluate.",
                    "next": "step-10"
                },
                {
                    "text": "Change the 'Streaming Grid Bounds Source' property.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. While important, it defines the bounds, not the *behavior* when the source is active. Re-evaluate.",
                    "next": "step-10"
                },
                {
                    "text": "Look for an 'Is Spatially Loaded' property on the component.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. 'Is Spatially Loaded' is an Actor property, not a Streaming Source component property. Re-evaluate.",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "worldpartition",
            "title": "Step 11: Check Data Layers Array",
            "prompt": "The 'Target Behavior' is correct. What's the *most likely* next property to check regarding the Clock Tower's Data Layer?",
            "choices": [
                {
                    "text": "Check the 'Data Layers' array property and notice if 'DL_KeyLandmarks' is missing or empty.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.15hrs. This is the critical step! The streaming source needs to explicitly list the Data Layers it influences.",
                    "next": "step-12"
                },
                {
                    "text": "Look for a 'Radius' property for the streaming zone.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. While a streaming source has bounds, its interaction with Data Layers is through the 'Data Layers' array. Re-evaluate.",
                    "next": "step-11"
                },
                {
                    "text": "Verify the 'Bounds Source' property for the component.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. The bounds define the *area*, but not *what* is loaded within that area via Data Layers. Re-evaluate.",
                    "next": "step-11"
                },
                {
                    "text": "Check the 'Streaming State' property on the component.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. This is a runtime debug property, not a configuration setting. Re-evaluate.",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "worldpartition",
            "title": "Step 12: Add Missing Data Layer",
            "prompt": "The 'DL_KeyLandmarks' Data Layer is missing from the Streaming Source's 'Data Layers' array. How do you correct this?",
            "choices": [
                {
                    "text": "Add a new element to the 'Data Layers' array and select the 'DL_KeyLandmarks' asset.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.15hrs. This correctly associates the streaming source with the relevant Data Layer.",
                    "next": "step-13"
                },
                {
                    "text": "Delete the 'World Partition Streaming Source' component and add a new one.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. This is a destructive and unnecessary action. Re-evaluate.",
                    "next": "step-12"
                },
                {
                    "text": "Open the 'DL_KeyLandmarks' Data Layer asset and modify its properties.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. The Data Layer asset defines the layer, but the streaming source needs to reference it. Re-evaluate.",
                    "next": "step-12"
                },
                {
                    "text": "Try to drag and drop the Clock Tower actor directly into the 'Data Layers' array.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. The array expects Data Layer assets, not actor instances. Re-evaluate.",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "worldpartition",
            "title": "Step 13: Compile and Save Blueprint",
            "prompt": "You've added 'DL_KeyLandmarks' to the array. What's crucial to make these changes take effect?",
            "choices": [
                {
                    "text": "Compile and Save the 'BP_MissionZone_A' Blueprint.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. Compiling and saving the Blueprint is essential for changes to be applied in the game.",
                    "next": "step-14"
                },
                {
                    "text": "Close the Blueprint Editor without saving.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. Closing without saving will discard your changes. Re-evaluate.",
                    "next": "step-13"
                },
                {
                    "text": "Open the main level and save the level.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. While saving the level is good practice, Blueprint changes need to be saved within the Blueprint Editor. Re-evaluate.",
                    "next": "step-13"
                },
                {
                    "text": "Restart the Unreal Editor.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.1hrs. Restarting the editor is often unnecessary for Blueprint changes. Re-evaluate.",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "worldpartition",
            "title": "Step 14: Confirm Fix",
            "prompt": "The Blueprint is compiled and saved. How do you confirm the fix?",
            "choices": [
                {
                    "text": "Run a new PIE session to confirm the Clock Tower remains streamed in and visible.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. A PIE session is the most direct way to validate the fix in a simulated gameplay environment.",
                    "next": "conclusion"
                },
                {
                    "text": "Check the Output Log for 'Data Layer Loaded' messages.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. While log messages can provide details, visual confirmation in PIE is the primary goal here. Re-evaluate.",
                    "next": "step-14"
                },
                {
                    "text": "Reload the level from scratch in the editor.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. Reloading the editor might be an option, but PIE is faster and directly tests runtime behavior. Re-evaluate.",
                    "next": "step-14"
                },
                {
                    "text": "Check the 'World Partition Grid' visualization in the editor.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. This visualization helps understand grid boundaries, but doesn't confirm the specific streaming source's influence in runtime. Re-evaluate.",
                    "next": "step-14"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "Congratulations! You have successfully completed this debugging scenario. The Clock Tower now remains loaded correctly while the player is within the influence of BP_MissionZone_A, ensuring critical gameplay elements are always visible.",
            "choices": []
        }
    }
};
