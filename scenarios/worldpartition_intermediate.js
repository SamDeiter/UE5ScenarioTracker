
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['ForcedDataLayerUnload'] = {
    meta: {
        title: "Gameplay-Critical Landmark Streams Out Prematurely",
        description: "We have a large, highly visible Clock Tower asset (a Static Mesh Actor placed in the world) that is essential for gameplay navigation and contains a required mission trigger volume at its base. The tower is assigned to the 'DL_KeyLandmarks' Data Layer. When the player moves approximately 50 meters away from the base, the entire Clock Tower and the associated mission trigger volume abruptly unload (stream out), which should not happen because a nearby, pre-placed trigger Blueprint (BP_MissionZone_A) is supposed to keep this entire area loaded until the mission is complete. The goal is to ensure the Clock Tower remains loaded while the player is within the influence of BP_MissionZone_A, regardless of distance to the default World Partition grid boundary.",
        difficulty: "medium",
        category: "World Partition & Streaming",
        estimate: 1.15
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "We have a large, highly visible Clock Tower asset (a Static Mesh Actor placed in the world) that is essential for gameplay navigation and contains a required mission trigger volume at its base. The tower is assigned to the 'DL_KeyLandmarks' Data Layer. When the player moves approximately 50 meters away from the base, the entire Clock Tower and the associated mission trigger volume abruptly unload (stream out), which should not happen because a nearby, pre-placed trigger Blueprint (BP_MissionZone_A) is supposed to keep this entire area loaded until the mission is complete. The goal is to ensure the Clock Tower remains loaded while the player is within the influence of BP_MissionZone_A, regardless of distance to the default World Partition grid boundary.",
        "choices": [
            {
                "text": "Compile and Save the 'BP_MissionZone_A' Blueprint.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Attempting to create a new Blueprint to manually load the Data Layer via an 'Activate Data Layer' node on Begin Play, overlooking the existing, configured World Partition Streaming Source component.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.4
            },
            {
                "text": "Ensure the Actor's 'Is Spatially Loaded' property is checked, confirming it relies on the Data Layer or streaming grid (it should not be set to 'Always Loaded').",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Open the World Outliner and select the Clock Tower Static Mesh Actor to inspect its properties.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Examine the Streaming Source component's Details panel under the 'Streaming Source' category.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Add a new element to the 'Data Layers' array and select the 'DL_KeyLandmarks' Data Layer asset reference from the dropdown list.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Validate the issue by performing a Play-In-Editor (PIE) session and observing the abrupt unloading of the Clock Tower asset when moving slightly away from its base.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Double-click 'BP_MissionZone_A' to open its Blueprint Editor.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "In the Components tab of the Blueprint Editor, select the 'World Partition Streaming Source' component.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Check the 'Data Layers' array property within the Streaming Source details, noticing that 'DL_KeyLandmarks' is either missing or empty.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Open the Data Layers Panel (Window -> Data Layers) and confirm the 'DL_KeyLandmarks' Data Layer's 'Runtime State' is set to 'Unloaded' (default behavior for runtime streaming).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Locate the dedicated streaming Blueprint responsible for the area, named 'BP_MissionZone_A', in the World Outliner.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Manually set the Clock Tower Actor's 'Is Spatially Loaded' property to unchecked, forcing it to be 'Always Loaded' regardless of Data Layer or Streaming Source, which violates the intended mission control structure.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.3
            },
            {
                "text": "Verify in the Details panel, under the 'World Partition' section, that the Actor is assigned to the 'DL_KeyLandmarks' Data Layer.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Verify that the 'Target Behavior' property is correctly set to 'Always Loaded' (meaning the area should be loaded when the source is active).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Exit the Blueprint Editor and run a new PIE session to confirm that the Clock Tower now remains streamed in and visible while the player is within the trigger zone of 'BP_MissionZone_A'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Increase the global World Partition Streaming Distance parameter in World Settings or Project Settings, unnecessarily loading far too much of the map and negatively impacting performance.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.5
            }
        ]
    }
}
};
