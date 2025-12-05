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
            "skill": "world_partitionstreaming",
            "title": "Step 1",
            "prompt": "<p>Select a subset of the problematic Static Mesh Actors (bushes/rocks) in the Level Viewport or the Outliner.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select a subset of the problematic Static Mesh Actors (bushes/rocks) in the Level Viewport or the Outliner.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Modifying the 'HLOD Layer' or generating new Hierarchical Level of Detail meshes, assuming the issue is related to mesh reduction/LOD settings.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "world_partitionstreaming",
            "title": "Step 2",
            "prompt": "<p>Examine the Details panel for the selected actors and confirm that the 'Is Spatially Loaded' checkbox is enabled, indicating they should be managed by the spatial grid streaming system.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Examine the Details panel for the selected actors and confirm that the 'Is Spatially Loaded' checkbox is enabled, indicating they should be managed by the spatial grid streaming system.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Checking the individual Static Mesh Asset properties (e.g., LOD settings, collision complexity) instead of focusing on the actor instance streaming parameters.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "world_partitionstreaming",
            "title": "Step 3",
            "prompt": "<p>In the Data Layers section of the Details panel, identify the specific Data Layer assigned to these assets (e.g., 'DL_GroundCover_Details').</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Data Layers section of the Details panel, identify the specific Data Layer assigned to these assets (e.g., 'DL_GroundCover_Details').</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Increasing the global 'Streaming Distance' setting within the World Partition map configuration, which unnecessarily loads all other distant actors sooner.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "world_partitionstreaming",
            "title": "Step 4",
            "prompt": "<p>Open the main World Settings panel (Window -> World Settings) to access the World Partition configuration.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the main World Settings panel (Window -> World Settings) to access the World Partition configuration.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Modifying the 'HLOD Layer' or generating new Hierarchical Level of Detail meshes, assuming the issue is related to mesh reduction/LOD settings.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "world_partitionstreaming",
            "title": "Step 5",
            "prompt": "<p>Locate the 'Data Layers' section within the World Settings panel and click the 'Edit Data Layers' button to launch the dedicated Data Layers Editor window.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate the 'Data Layers' section within the World Settings panel and click the 'Edit Data Layers' button to launch the dedicated Data Layers Editor window.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Checking the individual Static Mesh Asset properties (e.g., LOD settings, collision complexity) instead of focusing on the actor instance streaming parameters.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "world_partitionstreaming",
            "title": "Step 6",
            "prompt": "<p>In the Data Layers Editor, locate the identified Data Layer (e.g., 'DL_GroundCover_Details').</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Data Layers Editor, locate the identified Data Layer (e.g., 'DL_GroundCover_Details').</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Increasing the global 'Streaming Distance' setting within the World Partition map configuration, which unnecessarily loads all other distant actors sooner.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "world_partitionstreaming",
            "title": "Step 7",
            "prompt": "<p>Double-click the Data Layer entry or select it and view its properties panel within the Data Layers Editor.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Double-click the Data Layer entry or select it and view its properties panel within the Data Layers Editor.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Modifying the 'HLOD Layer' or generating new Hierarchical Level of Detail meshes, assuming the issue is related to mesh reduction/LOD settings.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "world_partitionstreaming",
            "title": "Step 8",
            "prompt": "<p>Inspect the Runtime Properties section of the Data Layer configuration.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Inspect the Runtime Properties section of the Data Layer configuration.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Checking the individual Static Mesh Asset properties (e.g., LOD settings, collision complexity) instead of focusing on the actor instance streaming parameters.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "world_partitionstreaming",
            "title": "Step 9",
            "prompt": "<p>Identify the 'Streaming Distance Override' property for this specific Data Layer.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Identify the 'Streaming Distance Override' property for this specific Data Layer.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Increasing the global 'Streaming Distance' setting within the World Partition map configuration, which unnecessarily loads all other distant actors sooner.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "world_partitionstreaming",
            "title": "Step 10",
            "prompt": "<p>Confirm that the 'Streaming Distance Override' is set to an abnormally low value (e.g., 1000.0, representing 10 meters, instead of using the global grid distance).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Confirm that the 'Streaming Distance Override' is set to an abnormally low value (e.g., 1000.0, representing 10 meters, instead of using the global grid distance).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Modifying the 'HLOD Layer' or generating new Hierarchical Level of Detail meshes, assuming the issue is related to mesh reduction/LOD settings.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "world_partitionstreaming",
            "title": "Step 11",
            "prompt": "<p>Reset the 'Streaming Distance Override' property value back to 0.0. This tells the World Partition system to default back to the standard global streaming distance defined by the Runtime Grid settings.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Reset the 'Streaming Distance Override' property value back to 0.0. This tells the World Partition system to default back to the standard global streaming distance defined by the Runtime Grid settings.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Checking the individual Static Mesh Asset properties (e.g., LOD settings, collision complexity) instead of focusing on the actor instance streaming parameters.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "world_partitionstreaming",
            "title": "Step 12",
            "prompt": "<p>Save the changes in the Data Layers Editor, save the main map, and test in PIE to confirm the bushes and rocks now stream in at the correct distance (500m).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Save the changes in the Data Layers Editor, save the main map, and test in PIE to confirm the bushes and rocks now stream in at the correct distance (500m).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Increasing the global 'Streaming Distance' setting within the World Partition map configuration, which unnecessarily loads all other distant actors sooner.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-12"
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
