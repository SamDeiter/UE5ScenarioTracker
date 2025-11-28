
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['DataLayerStreamingOverride'] = {
    meta: {
        title: "Decorative Props Popping In Too Close in World Partition",
        description: "We have recently completed placing a dense patch of static mesh actors (bushes and rocks) in a new wilderness area using a dedicated Data Layer. When testing in PIE, the surrounding landscape tiles and nearby structural meshes stream in correctly at about 500 meters. However, the newly placed bushes and rocks only become visible when the player is extremely close (approximately 10 meters away), causing obvious and jarring visual popping as the player approaches the area.",
        difficulty: "medium",
        category: "World Partition & Streaming",
        estimate: 0.8
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "We have recently completed placing a dense patch of static mesh actors (bushes and rocks) in a new wilderness area using a dedicated Data Layer. When testing in PIE, the surrounding landscape tiles and nearby structural meshes stream in correctly at about 500 meters. However, the newly placed bushes and rocks only become visible when the player is extremely close (approximately 10 meters away), causing obvious and jarring visual popping as the player approaches the area.",
        "choices": [
            {
                "text": "Checking the individual Static Mesh Asset properties (e.g., LOD settings, collision complexity) instead of focusing on the actor instance streaming parameters.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.15
            },
            {
                "text": "In the Data Layers Editor, locate the identified Data Layer (e.g., 'DL_GroundCover_Details').",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Identify the 'Streaming Distance Override' property for this specific Data Layer.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Examine the Details panel for the selected actors and confirm that the 'Is Spatially Loaded' checkbox is enabled, indicating they should be managed by the spatial grid streaming system.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Double-click the Data Layer entry or select it and view its properties panel within the Data Layers Editor.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Inspect the Runtime Properties section of the Data Layer configuration.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Save the changes in the Data Layers Editor, save the main map, and test in PIE to confirm the bushes and rocks now stream in at the correct distance (500m).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Increasing the global 'Streaming Distance' setting within the World Partition map configuration, which unnecessarily loads all other distant actors sooner.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.3
            },
            {
                "text": "Locate the 'Data Layers' section within the World Settings panel and click the 'Edit Data Layers' button to launch the dedicated Data Layers Editor window.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Modifying the 'HLOD Layer' or generating new Hierarchical Level of Detail meshes, assuming the issue is related to mesh reduction/LOD settings.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.25
            },
            {
                "text": "In the Data Layers section of the Details panel, identify the specific Data Layer assigned to these assets (e.g., 'DL_GroundCover_Details').",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Select a subset of the problematic Static Mesh Actors (bushes/rocks) in the Level Viewport or the Outliner.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Open the main World Settings panel (Window -> World Settings) to access the World Partition configuration.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Confirm that the 'Streaming Distance Override' is set to an abnormally low value (e.g., 1000.0, representing 10 meters, instead of using the global grid distance).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Reset the 'Streaming Distance Override' property value back to 0.0. This tells the World Partition system to default back to the standard global streaming distance defined by the Runtime Grid settings.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            }
        ]
    }
}
};
