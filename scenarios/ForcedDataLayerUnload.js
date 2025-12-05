window.SCENARIOS['ForcedDataLayerUnload'] = {
    "meta": {
        "title": "Gameplay-Critical Landmark Streams Out Prematurely",
        "description": "We have a large, highly visible Clock Tower asset (a Static Mesh Actor placed in the world) that is essential for gameplay navigation and contains a required mission trigger volume at its base. The tower is assigned to the 'DL_KeyLandmarks' Data Layer. When the player moves approximately 50 meters away from the base, the entire Clock Tower and the associated mission trigger volume abruptly unload (stream out), which should not happen because a nearby, pre-placed trigger Blueprint (BP_MissionZone_A) is supposed to keep this entire area loaded until the mission is complete. The goal is to ensure the Clock Tower remains loaded while the player is within the influence of BP_MissionZone_A, regardless of distance to the default World Partition grid boundary.",
        "estimateHours": 1.15,
        "category": "World Partition & Streaming"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "world_partitionstreaming",
            "title": "Step 1",
            "prompt": "<p>Validate the issue by performing a Play-In-Editor (PIE) session and observing the abrupt unloading of the Clock Tower asset when moving slightly away from its base.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Validate the issue by performing a Play-In-Editor (PIE) session and observing the abrupt unloading of the Clock Tower asset when moving slightly away from its base.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Increase the global World Partition Streaming Distance parameter in World Settings or Project Settings, unnecessarily loading far too much of the map and negatively impacting performance.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "world_partitionstreaming",
            "title": "Step 2",
            "prompt": "<p>Open the World Outliner and select the Clock Tower Static Mesh Actor to inspect its properties.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the World Outliner and select the Clock Tower Static Mesh Actor to inspect its properties.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Manually set the Clock Tower Actor's 'Is Spatially Loaded' property to unchecked, forcing it to be 'Always Loaded' regardless of Data Layer or Streaming Source, which violates the intended mission control structure.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "world_partitionstreaming",
            "title": "Step 3",
            "prompt": "<p>Verify in the Details panel, under the 'World Partition' section, that the Actor is assigned to the 'DL_KeyLandmarks' Data Layer.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify in the Details panel, under the 'World Partition' section, that the Actor is assigned to the 'DL_KeyLandmarks' Data Layer.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Attempting to create a new Blueprint to manually load the Data Layer via an 'Activate Data Layer' node on Begin Play, overlooking the existing, configured World Partition Streaming Source component.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "world_partitionstreaming",
            "title": "Step 4",
            "prompt": "<p>Ensure the Actor's 'Is Spatially Loaded' property is checked, confirming it relies on the Data Layer or streaming grid (it should not be set to 'Always Loaded').</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Ensure the Actor's 'Is Spatially Loaded' property is checked, confirming it relies on the Data Layer or streaming grid (it should not be set to 'Always Loaded').</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Increase the global World Partition Streaming Distance parameter in World Settings or Project Settings, unnecessarily loading far too much of the map and negatively impacting performance.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "world_partitionstreaming",
            "title": "Step 5",
            "prompt": "<p>Open the Data Layers Panel (Window -> Data Layers) and confirm the 'DL_KeyLandmarks' Data Layer's 'Runtime State' is set to 'Unloaded' (default behavior for runtime streaming).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Data Layers Panel (Window -> Data Layers) and confirm the 'DL_KeyLandmarks' Data Layer's 'Runtime State' is set to 'Unloaded' (default behavior for runtime streaming).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Manually set the Clock Tower Actor's 'Is Spatially Loaded' property to unchecked, forcing it to be 'Always Loaded' regardless of Data Layer or Streaming Source, which violates the intended mission control structure.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "world_partitionstreaming",
            "title": "Step 6",
            "prompt": "<p>Locate the dedicated streaming Blueprint responsible for the area, named 'BP_MissionZone_A', in the World Outliner.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate the dedicated streaming Blueprint responsible for the area, named 'BP_MissionZone_A', in the World Outliner.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Attempting to create a new Blueprint to manually load the Data Layer via an 'Activate Data Layer' node on Begin Play, overlooking the existing, configured World Partition Streaming Source component.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "world_partitionstreaming",
            "title": "Step 7",
            "prompt": "<p>Double-click 'BP_MissionZone_A' to open its Blueprint Editor.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Double-click 'BP_MissionZone_A' to open its Blueprint Editor.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Increase the global World Partition Streaming Distance parameter in World Settings or Project Settings, unnecessarily loading far too much of the map and negatively impacting performance.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "world_partitionstreaming",
            "title": "Step 8",
            "prompt": "<p>In the Components tab of the Blueprint Editor, select the 'World Partition Streaming Source' component.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Components tab of the Blueprint Editor, select the 'World Partition Streaming Source' component.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Manually set the Clock Tower Actor's 'Is Spatially Loaded' property to unchecked, forcing it to be 'Always Loaded' regardless of Data Layer or Streaming Source, which violates the intended mission control structure.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "world_partitionstreaming",
            "title": "Step 9",
            "prompt": "<p>Examine the Streaming Source component's Details panel under the 'Streaming Source' category.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Examine the Streaming Source component's Details panel under the 'Streaming Source' category.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Attempting to create a new Blueprint to manually load the Data Layer via an 'Activate Data Layer' node on Begin Play, overlooking the existing, configured World Partition Streaming Source component.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "world_partitionstreaming",
            "title": "Step 10",
            "prompt": "<p>Verify that the 'Target Behavior' property is correctly set to 'Always Loaded' (meaning the area should be loaded when the source is active).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify that the 'Target Behavior' property is correctly set to 'Always Loaded' (meaning the area should be loaded when the source is active).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Increase the global World Partition Streaming Distance parameter in World Settings or Project Settings, unnecessarily loading far too much of the map and negatively impacting performance.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "world_partitionstreaming",
            "title": "Step 11",
            "prompt": "<p>Check the 'Data Layers' array property within the Streaming Source details, noticing that 'DL_KeyLandmarks' is either missing or empty.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Check the 'Data Layers' array property within the Streaming Source details, noticing that 'DL_KeyLandmarks' is either missing or empty.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Manually set the Clock Tower Actor's 'Is Spatially Loaded' property to unchecked, forcing it to be 'Always Loaded' regardless of Data Layer or Streaming Source, which violates the intended mission control structure.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "world_partitionstreaming",
            "title": "Step 12",
            "prompt": "<p>Add a new element to the 'Data Layers' array and select the 'DL_KeyLandmarks' Data Layer asset reference from the dropdown list.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Add a new element to the 'Data Layers' array and select the 'DL_KeyLandmarks' Data Layer asset reference from the dropdown list.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Attempting to create a new Blueprint to manually load the Data Layer via an 'Activate Data Layer' node on Begin Play, overlooking the existing, configured World Partition Streaming Source component.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "world_partitionstreaming",
            "title": "Step 13",
            "prompt": "<p>Compile and Save the 'BP_MissionZone_A' Blueprint.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Compile and Save the 'BP_MissionZone_A' Blueprint.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Increase the global World Partition Streaming Distance parameter in World Settings or Project Settings, unnecessarily loading far too much of the map and negatively impacting performance.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "world_partitionstreaming",
            "title": "Step 14",
            "prompt": "<p>Exit the Blueprint Editor and run a new PIE session to confirm that the Clock Tower now remains streamed in and visible while the player is within the trigger zone of 'BP_MissionZone_A'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Exit the Blueprint Editor and run a new PIE session to confirm that the Clock Tower now remains streamed in and visible while the player is within the trigger zone of 'BP_MissionZone_A'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Manually set the Clock Tower Actor's 'Is Spatially Loaded' property to unchecked, forcing it to be 'Always Loaded' regardless of Data Layer or Streaming Source, which violates the intended mission control structure.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-14"
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
