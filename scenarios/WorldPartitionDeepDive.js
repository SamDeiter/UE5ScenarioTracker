window.SCENARIOS['WorldPartitionDeepDive'] = {
    "meta": {
        "title": "Distant City Fails to Stream In Along Main Road",
        "description": "We are using World Partition for a vast desert environment. A large, complex city model cluster (packaged inside a BP_DesertCity Actor) is located several kilometers from the player start. When the player drives down the main highway directly toward the city, the city mesh and collision never appear, resulting in the player driving through empty landscape, even when they reach the standard streaming distance. However, if the player uses the console (e.g., 'teleport 5000 5000 100') to appear suddenly near the city, it streams in correctly within seconds. The issue only occurs when physically traveling the intended path toward the location.",
        "estimateHours": 3.2,
        "category": "World Partition & Streaming"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "world_partitionstreaming",
            "title": "Step 1",
            "prompt": "<p>Verify the 'BP_DesertCity' actor's position in the World Partition view (Window > World Partition > World Partition) and confirm it is assigned to the correct cell and marked for spatial loading (green bounding box).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify the 'BP_DesertCity' actor's position in the World Partition view (Window > World Partition > World Partition) and confirm it is assigned to the correct cell and marked for spatial loading (green bounding box).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Increase the global 'Streaming Distance' for all content in World Settings to an excessively large value (e.g., 500,000 units), which unnecessarily burdens memory and CPU.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +1hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "world_partitionstreaming",
            "title": "Step 2",
            "prompt": "<p>Identify the Data Layer associated with the 'BP_DesertCity' actor, noted as 'DL_City_Assets', to ensure targeted streaming is possible.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Identify the Data Layer associated with the 'BP_DesertCity' actor, noted as 'DL_City_Assets', to ensure targeted streaming is possible.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Attempt to manually migrate the 'BP_DesertCity' to a non-World Partition Level Instance or entirely different sublevel, ignoring the core World Partition methodology.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.75hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "world_partitionstreaming",
            "title": "Step 3",
            "prompt": "<p>Locate the dedicated streaming mechanism placed along the road intended to preload the city, which is identified as a 'World Streaming Source Volume' actor.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate the dedicated streaming mechanism placed along the road intended to preload the city, which is identified as a 'World Streaming Source Volume' actor.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Check and modify the 'Always Loaded' status of the main Persistent Level or the Data Layer cells in the World Partition minimap without understanding the source of the trigger failure.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "world_partitionstreaming",
            "title": "Step 4",
            "prompt": "<p>Examine the 'World Streaming Source Volume' actor's Data Layer activation settings in the Details panel, specifically checking the 'Data Layers to Activate' property.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Examine the 'World Streaming Source Volume' actor's Data Layer activation settings in the Details panel, specifically checking the 'Data Layers to Activate' property.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.3hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Rebuild all navigation and lighting, assuming a data corruption issue when the problem is fundamentally related to actor/volume configuration.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "world_partitionstreaming",
            "title": "Step 5",
            "prompt": "<p>Identify the configuration error: the volume is currently set to activate 'DL_Roads_High' instead of 'DL_City_Assets'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Identify the configuration error: the volume is currently set to activate 'DL_Roads_High' instead of 'DL_City_Assets'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Increase the global 'Streaming Distance' for all content in World Settings to an excessively large value (e.g., 500,000 units), which unnecessarily burdens memory and CPU.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +1hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "world_partitionstreaming",
            "title": "Step 6",
            "prompt": "<p>Modify the 'Data Layers to Activate' list on the Streaming Volume to include 'DL_City_Assets'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Modify the 'Data Layers to Activate' list on the Streaming Volume to include 'DL_City_Assets'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Attempt to manually migrate the 'BP_DesertCity' to a non-World Partition Level Instance or entirely different sublevel, ignoring the core World Partition methodology.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.75hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "world_partitionstreaming",
            "title": "Step 7",
            "prompt": "<p>Test the level again. Observe that the failure still occurs, indicating the streaming source volume itself is not active/loaded.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Test the level again. Observe that the failure still occurs, indicating the streaming source volume itself is not active/loaded.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Check and modify the 'Always Loaded' status of the main Persistent Level or the Data Layer cells in the World Partition minimap without understanding the source of the trigger failure.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "world_partitionstreaming",
            "title": "Step 8",
            "prompt": "<p>Determine the Data Layer that the 'World Streaming Source Volume' actor belongs to, noted as 'DL_Triggers'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Determine the Data Layer that the 'World Streaming Source Volume' actor belongs to, noted as 'DL_Triggers'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Rebuild all navigation and lighting, assuming a data corruption issue when the problem is fundamentally related to actor/volume configuration.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "world_partitionstreaming",
            "title": "Step 9",
            "prompt": "<p>Open the Data Layer Panel (Window > World Partition > Data Layers) and inspect the properties of the 'DL_Triggers' layer.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Data Layer Panel (Window > World Partition > Data Layers) and inspect the properties of the 'DL_Triggers' layer.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Increase the global 'Streaming Distance' for all content in World Settings to an excessively large value (e.g., 500,000 units), which unnecessarily burdens memory and CPU.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +1hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "world_partitionstreaming",
            "title": "Step 10",
            "prompt": "<p>Change the Loading Policy property for 'DL_Triggers' from 'On Demand' (which is preventing it from loading early enough) to 'Runtime' to ensure the trigger volume is active when the player approaches.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Change the Loading Policy property for 'DL_Triggers' from 'On Demand' (which is preventing it from loading early enough) to 'Runtime' to ensure the trigger volume is active when the player approaches.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Attempt to manually migrate the 'BP_DesertCity' to a non-World Partition Level Instance or entirely different sublevel, ignoring the core World Partition methodology.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.75hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "world_partitionstreaming",
            "title": "Step 11",
            "prompt": "<p>Test the level again. The city still fails to stream reliably along the path, suggesting an issue with the City BP itself overriding spatial loading.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Test the level again. The city still fails to stream reliably along the path, suggesting an issue with the City BP itself overriding spatial loading.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Check and modify the 'Always Loaded' status of the main Persistent Level or the Data Layer cells in the World Partition minimap without understanding the source of the trigger failure.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "world_partitionstreaming",
            "title": "Step 12",
            "prompt": "<p>Open the 'BP_DesertCity' Blueprint and navigate to the Construction Script.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the 'BP_DesertCity' Blueprint and navigate to the Construction Script.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.3hrs. Correct approach.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Rebuild all navigation and lighting, assuming a data corruption issue when the problem is fundamentally related to actor/volume configuration.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "world_partitionstreaming",
            "title": "Step 13",
            "prompt": "<p>Locate an erroneous node chain in the Construction Script that is using 'Set Is Spatially Loaded' and setting it to 'False', overriding the actor's editor property, likely due to a forgotten initial setup or debugging step.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate an erroneous node chain in the Construction Script that is using 'Set Is Spatially Loaded' and setting it to 'False', overriding the actor's editor property, likely due to a forgotten initial setup or debugging step.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.3hrs. Correct approach.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Increase the global 'Streaming Distance' for all content in World Settings to an excessively large value (e.g., 500,000 units), which unnecessarily burdens memory and CPU.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +1hrs. This approach wastes time.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "world_partitionstreaming",
            "title": "Step 14",
            "prompt": "<p>Remove or bypass the 'Set Is Spatially Loaded' node in the Construction Script entirely, allowing the spatial loading status defined in the Details Panel to control streaming.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Remove or bypass the 'Set Is Spatially Loaded' node in the Construction Script entirely, allowing the spatial loading status defined in the Details Panel to control streaming.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Attempt to manually migrate the 'BP_DesertCity' to a non-World Partition Level Instance or entirely different sublevel, ignoring the core World Partition methodology.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.75hrs. This approach wastes time.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "world_partitionstreaming",
            "title": "Step 15",
            "prompt": "<p>Test the level again. Notice a significant improvement, but occasional lag in streaming suggests the player isn't optimally marked as a streaming source.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Test the level again. Notice a significant improvement, but occasional lag in streaming suggests the player isn't optimally marked as a streaming source.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Check and modify the 'Always Loaded' status of the main Persistent Level or the Data Layer cells in the World Partition minimap without understanding the source of the trigger failure.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "world_partitionstreaming",
            "title": "Step 16",
            "prompt": "<p>Open the Player Character Blueprint ('BP_CustomExplorer') used for the test drive.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Player Character Blueprint ('BP_CustomExplorer') used for the test drive.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.4hrs. Correct approach.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Rebuild all navigation and lighting, assuming a data corruption issue when the problem is fundamentally related to actor/volume configuration.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "world_partitionstreaming",
            "title": "Step 17",
            "prompt": "<p>Select the Root Component (e.g., Capsule Component) and check the 'World Partition' section of the Details Panel.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select the Root Component (e.g., Capsule Component) and check the 'World Partition' section of the Details Panel.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.3hrs. Correct approach.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Increase the global 'Streaming Distance' for all content in World Settings to an excessively large value (e.g., 500,000 units), which unnecessarily burdens memory and CPU.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +1hrs. This approach wastes time.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "world_partitionstreaming",
            "title": "Step 18",
            "prompt": "<p>Enable the checkbox labeled 'Is Streaming Source' on the Root Component of the Player Character to ensure the player reliably generates streaming requests as they move through the world.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Enable the checkbox labeled 'Is Streaming Source' on the Root Component of the Player Character to ensure the player reliably generates streaming requests as they move through the world.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Attempt to manually migrate the 'BP_DesertCity' to a non-World Partition Level Instance or entirely different sublevel, ignoring the core World Partition methodology.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.75hrs. This approach wastes time.</p>",
                    "next": "step-18"
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
