
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['WorldPartitionDeepDive'] = {
    meta: {
        title: "Distant City Fails to Stream In Along Main Road",
        description: "We are using World Partition for a vast desert environment. A large, complex city model cluster (packaged inside a BP_DesertCity Actor) is located several kilometers from the player start. When the player drives down the main highway directly toward the city, the city mesh and collision never appear, resulting in the player driving through empty landscape, even when they reach the standard streaming distance. However, if the player uses the console (e.g., 'teleport 5000 5000 100') to appear suddenly near the city, it streams in correctly within seconds. The issue only occurs when physically traveling the intended path toward the location.",
        difficulty: "medium",
        category: "World Partition & Streaming",
        estimate: 3.2
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "We are using World Partition for a vast desert environment. A large, complex city model cluster (packaged inside a BP_DesertCity Actor) is located several kilometers from the player start. When the player drives down the main highway directly toward the city, the city mesh and collision never appear, resulting in the player driving through empty landscape, even when they reach the standard streaming distance. However, if the player uses the console (e.g., 'teleport 5000 5000 100') to appear suddenly near the city, it streams in correctly within seconds. The issue only occurs when physically traveling the intended path toward the location.",
        "choices": [
            {
                "text": "Identify the configuration error: the volume is currently set to activate 'DL_Roads_High' instead of 'DL_City_Assets'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Open the Data Layer Panel (Window > World Partition > Data Layers) and inspect the properties of the 'DL_Triggers' layer.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Remove or bypass the 'Set Is Spatially Loaded' node in the Construction Script entirely, allowing the spatial loading status defined in the Details Panel to control streaming.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Test the level again. Observe that the failure still occurs, indicating the streaming source volume itself is not active/loaded.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Increase the global 'Streaming Distance' for all content in World Settings to an excessively large value (e.g., 500,000 units), which unnecessarily burdens memory and CPU.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 1
            },
            {
                "text": "Open the Player Character Blueprint ('BP_CustomExplorer') used for the test drive.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.4
            },
            {
                "text": "Rebuild all navigation and lighting, assuming a data corruption issue when the problem is fundamentally related to actor/volume configuration.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.4
            },
            {
                "text": "Test the level again. The city still fails to stream reliably along the path, suggesting an issue with the City BP itself overriding spatial loading.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Examine the 'World Streaming Source Volume' actor's Data Layer activation settings in the Details panel, specifically checking the 'Data Layers to Activate' property.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.3
            },
            {
                "text": "Attempt to manually migrate the 'BP_DesertCity' to a non-World Partition Level Instance or entirely different sublevel, ignoring the core World Partition methodology.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.75
            },
            {
                "text": "Select the Root Component (e.g., Capsule Component) and check the 'World Partition' section of the Details Panel.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.3
            },
            {
                "text": "Locate an erroneous node chain in the Construction Script that is using 'Set Is Spatially Loaded' and setting it to 'False', overriding the actor's editor property, likely due to a forgotten initial setup or debugging step.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.3
            },
            {
                "text": "Locate the dedicated streaming mechanism placed along the road intended to preload the city, which is identified as a 'World Streaming Source Volume' actor.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Determine the Data Layer that the 'World Streaming Source Volume' actor belongs to, noted as 'DL_Triggers'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Identify the Data Layer associated with the 'BP_DesertCity' actor, noted as 'DL_City_Assets', to ensure targeted streaming is possible.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Change the Loading Policy property for 'DL_Triggers' from 'On Demand' (which is preventing it from loading early enough) to 'Runtime' to ensure the trigger volume is active when the player approaches.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Verify the 'BP_DesertCity' actor's position in the World Partition view (Window > World Partition > World Partition) and confirm it is assigned to the correct cell and marked for spatial loading (green bounding box).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Modify the 'Data Layers to Activate' list on the Streaming Volume to include 'DL_City_Assets'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Check and modify the 'Always Loaded' status of the main Persistent Level or the Data Layer cells in the World Partition minimap without understanding the source of the trigger failure.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.5
            },
            {
                "text": "Test the level again. Notice a significant improvement, but occasional lag in streaming suggests the player isn't optimally marked as a streaming source.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Open the 'BP_DesertCity' Blueprint and navigate to the Construction Script.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.3
            },
            {
                "text": "Enable the checkbox labeled 'Is Streaming Source' on the Root Component of the Player Character to ensure the player reliably generates streaming requests as they move through the world.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            }
        ]
    }
}
};
