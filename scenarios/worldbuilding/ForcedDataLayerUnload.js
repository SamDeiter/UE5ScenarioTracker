window.SCENARIOS['ForcedDataLayerUnload'] = {
    "meta": {
        "title": "Gameplay-Critical Landmark Streams Out Prematurely",
        "description": "We have a large, highly visible Clock Tower asset (a Static Mesh Actor placed in the world) that is essential for gameplay navigation and contains a required mission trigger volume at its base. The tower is assigned to the 'DL_KeyLandmarks' Data Layer. When the player moves approximately 50 meters away from the base, the entire Clock Tower and the associated mission trigger volume abruptly unload (stream out), which should not happen because a nearby, pre-placed trigger Blueprint (BP_MissionZone_A) is supposed to keep this entire area loaded until the mission is complete. The goal is to ensure the Clock Tower remains loaded while the player is within the influence of BP_MissionZone_A, regardless of distance to the default World Partition grid boundary.",
        "estimateHours": 1.15,
        "category": "World Partition & Streaming",
        "tokens_used": 10019
    },
    "setup": [
        {
            "action": "set_ue_property",
            "scenario": "ForcedDataLayerUnload",
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
            "scenario": "ForcedDataLayerUnload",
            "step": "final"
        }
    ],
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "worldpartition",
            "title": "Confirm Unloading Behavior",
            "prompt": "<p>The <strong>Clock Tower</strong> and its mission trigger disappear when moving ~50m away from its base. A nearby <strong>BP_MissionZone_A</strong> should prevent this.</p><p>How do you investigate this?</p>",
            "choices": [
                {
                    "text": "<p>Run a <strong>Play-In-Editor (PIE)</strong> session to observe and confirm the abrupt unloading behavior.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Validating the observed issue in PIE is the first crucial step to ensure the problem is reproducible and understood in the runtime environment.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Open <strong>Task Manager</strong> to check system CPU and RAM usage.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While performance can be a factor, this scenario is about incorrect streaming logic, not necessarily system resource exhaustion. Also, using external apps like Task Manager is restricted by the critical rules.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Increase the global <strong>World Partition Streaming Distance</strong> parameter in <strong>World Settings</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.50hrs. This is a common but incorrect approach. Increasing the global streaming distance would unnecessarily load large parts of the map, negatively impacting performance across the entire game, and bypasses the specific mission-controlled loading mechanism. This would mask the real issue rather than solve it efficiently.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Check <strong>Project Settings</strong> for any global streaming overrides.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While global settings can influence streaming, the first step should be to confirm the specific actor's behavior in PIE. Direct actor properties and local streaming volumes often take precedence or are the intended control points for specific gameplay elements.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "worldpartition",
            "title": "Select Clock Tower Actor",
            "prompt": "<p>You have confirmed the <strong>Clock Tower</strong> abruptly unloads during <strong>PIE</strong>. You need to inspect the <strong>Actor</strong> itself to understand its configuration.</p><p>What's your next move?</p>",
            "choices": [
                {
                    "text": "<p>Open the <strong>World Outliner</strong> and select the <strong>Clock Tower Static Mesh Actor</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. To inspect an Actor's properties, you must first select it in the editor. The World Outliner is the primary tool for locating and selecting Actors in the level.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Try moving the <strong>Clock Tower</strong> to a different location in the level.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Moving the actor without understanding its streaming properties will likely not resolve the issue and could introduce new problems with its placement or gameplay relevance.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Open the <strong>Data Layers Panel</strong> to see currently active <strong>Data Layers</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While Data Layers are relevant, it's too early. First, you need to understand how the Clock Tower Actor *itself* is configured in relation to Data Layers and World Partition.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Open the <strong>Content Browser</strong> and inspect the <strong>Static Mesh</strong> asset itself.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</b> +0.08hrs. Inspecting the raw Static Mesh asset would show its geometry and material properties, but not its World Partition streaming settings, which are properties of the Actor *instance* placed in the world.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "worldpartition",
            "title": "Verify Data Layer Assignment",
            "prompt": "<p>With the <strong>Clock Tower Static Mesh Actor</strong> selected, you need to understand how it's integrated with <strong>World Partition</strong> streaming.</p><p>How should you proceed?</p>",
            "choices": [
                {
                    "text": "<p>Verify in the <strong>Details</strong> panel, under the <strong>World Partition</strong> section, that the <strong>Actor</strong> is assigned to the 'DL_KeyLandmarks' <strong>Data Layer</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Confirming the correct Data Layer assignment is essential, as the problem statement explicitly mentions the Clock Tower should be part of 'DL_KeyLandmarks'.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Check the <strong>Material</strong> assigned to the <strong>Clock Tower</strong> to see if it has any rendering issues.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. The issue is abrupt unloading, not rendering artifacts while loaded. Material settings are irrelevant to streaming behavior.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Look for any attached <strong>Blueprint</strong> components that might control loading.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While Blueprints can control loading, the primary streaming mechanism for a Static Mesh Actor itself in World Partition is directly through its Actor properties and Data Layer assignment.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>In the <strong>Details</strong> panel, check the <strong>Visibility</strong> property.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. The actor is disappearing from the world, which is different from its visibility property being toggled while remaining loaded. The problem is streaming, not mere visibility.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "worldpartition",
            "title": "Check Spatial Loading Property",
            "prompt": "<p>The <strong>Clock Tower</strong> is assigned to 'DL_KeyLandmarks'. Now you need to confirm how it's instructed to load relative to the world.</p><p>What action do you take?</p>",
            "choices": [
                {
                    "text": "<p>Verify that the <strong>Actor's</strong> 'Is Spatially Loaded' property is checked in the <strong>World Partition</strong> section of the <strong>Details</strong> panel.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Ensuring 'Is Spatially Loaded' is checked confirms the actor relies on World Partition for streaming, either through its grid cells or associated Data Layers, aligning with the intent of mission control.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Manually set the <strong>Clock Tower Actor's</strong> 'Is Spatially Loaded' property to unchecked.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.30hrs. Unchecking 'Is Spatially Loaded' would force the actor to be 'Always Loaded'. While this would 'solve' the immediate problem of unloading, it explicitly violates the intended mission control structure and efficient streaming, making it a bad practice. This is considered a 'wrong step' as per the scenario rules.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Check the <strong>World Partition Grid Settings</strong> in <strong>World Settings</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. Grid settings are global, but individual actor settings ('Is Spatially Loaded') determine if an actor uses grid streaming at all. It's best to check the actor's specific setting first.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Look for an 'Always Loaded' flag in the <strong>Actor</strong> properties.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. The 'Always Loaded' state is achieved by *unchecking* 'Is Spatially Loaded'. Looking for an explicit 'Always Loaded' flag might cause confusion.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "worldpartition",
            "title": "Examine Data Layer Runtime State",
            "prompt": "<p>The <strong>Clock Tower Actor</strong> is correctly spatially loaded and assigned to 'DL_KeyLandmarks'. Now inspect the default runtime state of that <strong>Data Layer</strong> itself.</p><p>Which approach do you choose?</p>",
            "choices": [
                {
                    "text": "<p>Open the <strong>Data Layers Panel</strong> (Window -> Data Layers) and confirm 'DL_KeyLandmarks' <strong>Runtime State</strong> is set to 'Unloaded'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. By default, Data Layers are 'Unloaded' at runtime, relying on explicit activation (e.g., from a Streaming Source) to become loaded. Confirming this ensures it's not inadvertently loaded globally.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Use console command <code>r.ShowDataLayers</code> to visualize <strong>Data Layers</strong>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While useful for debugging visualization, this command doesn't directly show the *runtime state* of a Data Layer as configured in the editor. It shows what's currently loaded/unloaded in the viewport.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Attempt to create a new <strong>Blueprint</strong> to manually load the <strong>Data Layer</strong> via an 'Activate Data Layer' node on <strong>Begin Play</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.40hrs. This is explicitly a 'wrong step'. The problem statement indicates an *existing* Blueprint ('BP_MissionZone_A') is supposed to manage this. Creating a new manual loading Blueprint would bypass the intended system and waste significant time.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>In the <strong>Data Layers Panel</strong>, try to manually set 'DL_KeyLandmarks' to 'Loaded'.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Manually setting the runtime state in the editor is for testing, not a persistent fix. The goal is to ensure the *streaming Blueprint* manages its loading correctly, not to force it on globally.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "worldpartition",
            "title": "Locate Streaming Blueprint",
            "prompt": "<p>The <strong>Data Layer</strong> is set to 'Unloaded' by default, as expected. The problem likely lies with how the dedicated streaming <strong>Blueprint</strong> interacts with it.</p><p>What's your next move?</p>",
            "choices": [
                {
                    "text": "<p>Locate the dedicated streaming <strong>Blueprint</strong>, 'BP_MissionZone_A', in the <strong>World Outliner</strong> and select it.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.10hrs. The problem states 'BP_MissionZone_A' is responsible for keeping the area loaded. The next logical step is to inspect this Blueprint's configuration.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Run a '<strong>stat unit</strong>' command in the console to check performance metrics.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While 'stat unit' is a valid console command for debugging performance, it's not relevant at this stage. The issue is specific streaming behavior, not general performance.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Create a new <strong>World Partition Streaming Source</strong> actor in the level.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. Creating a new actor would be redundant and likely conflict with the existing 'BP_MissionZone_A'. The goal is to fix the existing setup, not replace it.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Check the <strong>World Settings</strong> for global streaming sources.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While World Settings can have global streaming configurations, the problem specifically points to 'BP_MissionZone_A' as the intended local control, so that's the priority.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "blueprint",
            "title": "Open Blueprint Editor",
            "prompt": "<p>You have selected 'BP_MissionZone_A' in the <strong>World Outliner</strong>. To inspect its streaming logic and components, you need to open it.</p><p>How do you proceed?</p>",
            "choices": [
                {
                    "text": "<p>Double-click 'BP_MissionZone_A' to open its <strong>Blueprint Editor</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Opening the Blueprint Editor allows you to access and modify the Blueprint's components, event graph, and other properties relevant to its behavior.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Drag 'BP_MissionZone_A' to a new location in the level to see if it affects streaming.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Moving the Blueprint in the level won't reveal its internal streaming configuration and could interfere with mission design.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Check the <strong>Details</strong> panel for basic transform properties of 'BP_MissionZone_A'.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While useful for quick adjustments, the Details panel for an Actor instance in the world doesn't expose the internal component structure and logic of the Blueprint asset itself.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Open the <strong>Content Browser</strong> and locate the 'BP_MissionZone_A' asset.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While locating it in the Content Browser is technically finding the asset, the fastest way to open the editor for an already selected Actor is a direct double-click or right-click context menu.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "blueprint",
            "title": "Select Streaming Source Component",
            "prompt": "<p>The <strong>Blueprint Editor</strong> for 'BP_MissionZone_A' is open. You need to find the specific component responsible for managing <strong>World Partition</strong> streaming.</p><p>What action do you take?</p>",
            "choices": [
                {
                    "text": "<p>In the <strong>Components</strong> tab, select the '<strong>World Partition Streaming Source</strong>' component.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. The 'World Partition Streaming Source' component is the dedicated component for defining streaming influence within a Blueprint.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Go to the <strong>Event Graph</strong> to check for any loading logic.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While Blueprints can contain event graph logic for streaming, the primary configuration for a streaming source component is in its details panel. You should check the component's properties first.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Check the <strong>Details</strong> panel of the root component for streaming settings.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. The root component might have some general actor settings, but the specific streaming source configuration belongs to the dedicated 'World Partition Streaming Source' component.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Look for a <strong>Box Collision</strong> component to see the trigger bounds.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. The Box Collision component might define the *area of influence* for the streaming source, but the streaming *logic and configuration* are on the 'World Partition Streaming Source' component itself.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "worldpartition",
            "title": "Examine Streaming Source Details",
            "prompt": "<p>The '<strong>World Partition Streaming Source</strong>' component is selected. Its settings determine how it influences streaming in the world.</p><p>How do you investigate this?</p>",
            "choices": [
                {
                    "text": "<p>Examine the <strong>Details</strong> panel of the '<strong>World Partition Streaming Source</strong>' component, specifically the '<strong>Streaming Source</strong>' category.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. This category contains all the critical properties for configuring how the streaming source interacts with World Partition, including its target behavior and affected Data Layers.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Adjust the <strong>Collision Presets</strong> for the '<strong>World Partition Streaming Source</strong>' component.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Collision presets affect how the component interacts with physics and other collision channels, not its streaming behavior for World Partition.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Check the <strong>World Partition</strong> section of the <strong>Blueprint's</strong> main <strong>Details</strong> panel.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. This would show the Blueprint Actor's overall World Partition settings, but not the specific properties of the 'World Partition Streaming Source' *component* within it.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Look for a '<strong>Streaming Priority</strong>' setting.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While streaming priority can be a setting, it's not the first or most critical property to check when an area is failing to load at all. The basic configuration needs to be correct first.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "worldpartition",
            "title": "Verify Target Behavior",
            "prompt": "<p>You are inspecting the '<strong>Streaming Source</strong>' properties in the <strong>Details</strong> panel. You need to confirm its intended loading behavior.</p><p>What's your next move?</p>",
            "choices": [
                {
                    "text": "<p>Verify that the '<strong>Target Behavior</strong>' property is set to 'Always Loaded'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. This property determines whether the streaming source keeps actors 'Always Loaded' within its influence or 'Loaded Until Unloaded', which is crucial for the mission's requirement.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Change the '<strong>Shape</strong>' property of the streaming source.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. The shape (e.g., box, sphere) defines the bounds of the streaming influence, but doesn't control *what* happens within those bounds. The current issue is about loading behavior, not spatial extent.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Adjust the '<strong>Loading Range</strong>' property to a larger value.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While increasing range might seem helpful, it's irrelevant if the Data Layer isn't even targeted by the streaming source. It would also increase the loaded area unnecessarily.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Check the '<strong>Is Enabled</strong>' property of the component.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. If 'Is Enabled' were unchecked, the source wouldn't work at all. Assuming the Blueprint is active, the first check should be for its specific behavior, not its active state.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "worldpartition",
            "title": "Inspect Data Layers Array",
            "prompt": "<p>The '<strong>Target Behavior</strong>' for the <strong>Streaming Source</strong> is correctly set to 'Always Loaded'. However, the <strong>Clock Tower</strong> still unloads.</p><p>How should you proceed?</p>",
            "choices": [
                {
                    "text": "<p>Check the '<strong>Data Layers</strong>' array property within the <strong>Streaming Source</strong> details, noticing that 'DL_KeyLandmarks' is either missing or empty.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. This is the critical missing link. If the 'DL_KeyLandmarks' Data Layer is not explicitly listed in the Streaming Source's 'Data Layers' array, the source will not influence its loading, even if its 'Target Behavior' is 'Always Loaded'.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Close the <strong>Blueprint Editor</strong> and restart <strong>UE5</strong>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Restarting the editor is a last resort, not a diagnostic step. The problem clearly lies within the Blueprint's configuration.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Add a new <strong>World Partition Streaming Source</strong> component to the <strong>Blueprint</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. There is no need to add a new component; the existing one needs to be configured correctly. Adding more components would complicate the setup.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Check the '<strong>Streaming Grid Cells</strong>' property.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While Streaming Grid Cells are part of World Partition, the problem explicitly states the Clock Tower is assigned to a *Data Layer*, and the Blueprint should manage that Data Layer. Focusing on grid cells directly would be a misdirection from the Data Layer issue.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "worldpartition",
            "title": "Add Missing Data Layer",
            "prompt": "<p>The '<strong>Data Layers</strong>' array in the <strong>Streaming Source</strong> is missing 'DL_KeyLandmarks'. This is the likely cause of the issue.</p><p>What action do you take?</p>",
            "choices": [
                {
                    "text": "<p>Add a new element to the '<strong>Data Layers</strong>' array and select the 'DL_KeyLandmarks' <strong>Data Layer</strong> asset reference from the dropdown list.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. By adding 'DL_KeyLandmarks' to the array, you explicitly tell the 'World Partition Streaming Source' component that it should manage the loading state of actors assigned to this Data Layer when it is active.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Delete the '<strong>World Partition Streaming Source</strong>' component.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Deleting the component would remove the intended streaming control for the area, worsening the problem.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Manually type the name 'DL_KeyLandmarks' into a text field somewhere else in the <strong>Details</strong> panel.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While it might seem like a way to link them, directly typing a name into an arbitrary text field won't establish the necessary asset reference. You must use the array and the provided dropdown for proper linking.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Add the <strong>Clock Tower Actor</strong> directly to a new array property.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Streaming sources target Data Layers, which then influence actors assigned to those Data Layers. They don't directly manage individual actors by name, especially not through a non-existent array property.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "blueprint",
            "title": "Compile and Save Blueprint",
            "prompt": "<p>You have added 'DL_KeyLandmarks' to the '<strong>Data Layers</strong>' array of the <strong>Streaming Source</strong> component. The <strong>Blueprint</strong> needs to be updated to apply these changes.</p><p>What action do you take?</p>",
            "choices": [
                {
                    "text": "<p><strong>Compile</strong> and <strong>Save</strong> the 'BP_MissionZone_A' <strong>Blueprint</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Compiling applies the C++ changes to the Blueprint, and saving persists those changes to the asset. Both are necessary for the changes to take effect in the editor and runtime.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Launch the standalone game directly from the engine.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Launching a standalone game without first compiling and saving the Blueprint would mean the changes you just made would not be present in the build.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Run another <strong>PIE</strong> session without compiling or saving.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. Running PIE without compiling and saving means the changes you made to the Blueprint asset will not be reflected, and the problem will persist.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Only <strong>Compile</strong> the <strong>Blueprint</strong>, forgetting to <strong>Save</strong>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Compiling updates the Blueprint's code in memory for the current session, but if you don't save, those changes will be lost when you close the editor or the Blueprint asset is reloaded. It's crucial to do both.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "worldpartition",
            "title": "Verify Solution in PIE",
            "prompt": "<p>The <strong>Blueprint</strong> is compiled and saved. You need to confirm the fix and ensure the <strong>Clock Tower</strong> now streams correctly.</p><p>What's your next move?</p>",
            "choices": [
                {
                    "text": "<p>Exit the <strong>Blueprint Editor</strong> and run a new <strong>PIE</strong> session to confirm the <strong>Clock Tower</strong> now remains streamed in and visible while the player is within the influence of 'BP_MissionZone_A'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.10hrs. The final step is always to verify the fix in the runtime environment. A successful PIE session confirms that the Clock Tower now streams in as intended, solving the problem.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Delete the <strong>Clock Tower Actor</strong> and re-place it in the level.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Deleting and replacing the actor is unnecessary and could reset other unrelated properties, introducing new issues. The fix was in the Blueprint.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Check the <strong>World Outliner</strong> for any lingering issues without running <strong>PIE</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. The World Outliner shows editor-time state. To confirm runtime streaming behavior, a PIE session is absolutely necessary.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Only restart the <strong>UE5 Editor</strong> without running a <strong>PIE</strong> session.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Restarting the editor ensures all assets are reloaded, but it doesn't simulate the gameplay runtime conditions required to verify streaming behavior. PIE is essential.</p>",
                    "next": "step-14"
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
