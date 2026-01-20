window.SCENARIOS['decorative_props_popping_in_too_close_in_world_partition'] = {
    meta: {
        title: "Decorative Props Popping In Too Close in World Partition",
        description: "We have recently completed placing a dense patch of static mesh actors (bushes and rocks) in a new wilderness area using a dedicated Data Layer. When testing in PIE, the surrounding landscape tiles and nearby structural meshes stream in correctly at about 500 meters. However, the newly placed bushes and rocks only become visible when the player is extremely close (approximately 10 meters away), causing obvious and jarring visual popping as the player approaches the area.",
        estimateHours: 0.8,
        category: "World Partition & Streaming"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'world',
            title: 'Identify the Problematic Assets and Their Configuration',
            prompt: "<p>You're experiencing jarring visual popping with newly placed bushes and rocks in a World Partition map. They only become visible at ~10 meters, while other assets stream in at ~500 meters. Your first step is to investigate the specific assets causing the issue.</p><strong>What do you do?</strong>",
            choices: [
                {
                    text: "Select a subset of the problematic Static Mesh Actors (bushes/rocks) in the Level Viewport, then examine their Details panel to confirm 'Is Spatially Loaded' is checked and identify their assigned Data Layer.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> This correctly identifies the specific assets, confirms they are intended for spatial loading, and points to their Data Layer, which is crucial for World Partition streaming settings.</p>",
                    next: 'step-2'
                },
                {
                    text: "Modify the 'HLOD Layer' or generate new Hierarchical Level of Detail meshes for the bushes and rocks.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> While HLODs are related to performance and visual quality at distance, they primarily manage mesh complexity, not the fundamental streaming distance of the base actors. This won't address the popping issue directly.</p>",
                    next: 'step-2'
                },
                {
                    text: "Check the individual Static Mesh Asset properties (e.g., LOD settings, collision) of the bush and rock meshes in the Content Browser.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> The issue is with <em>streaming</em> the actors in the world, not the properties of the static mesh assets themselves. While LODs are important, the problem description points to a streaming distance discrepancy, not an LOD setup issue.</p>",
                    next: 'step-2'
                },
                {
                    text: "Increase the global 'Streaming Distance' setting within the World Partition map settings immediately.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> This is a global setting and might affect all assets, potentially masking the specific issue with the decorative props or causing unintended performance impacts. It's better to investigate the specific assets first.</p>",
                    next: 'step-2'
                },
            ]
        },
        'step-2': {
            skill: 'world',
            title: 'Accessing World Partition Data Layer Configuration',
            prompt: "<p>You've identified that the problematic bushes and rocks are assigned to a specific Data Layer (e.g., 'DL_GroundCover_Details') and 'Is Spatially Loaded' is enabled. The next step is to investigate the streaming settings for this Data Layer.</p><strong>How do you proceed?</strong>",
            choices: [
                {
                    text: "Open the main World Settings panel (Window -> World Settings), locate the 'Data Layers' section, and click the 'Edit Data Layers' button to open the Data Layers Editor.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> This is the correct path to access and modify the streaming properties of individual Data Layers within World Partition.</p>",
                    next: 'step-3'
                },
                {
                    text: "Right-click on the problematic actors in the Level Viewport and look for streaming options in their context menu.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> While some actor-specific settings exist, the primary streaming control for Data Layers is not found directly on individual actors. This would be a dead end.</p>",
                    next: 'step-3'
                },
                {
                    text: "Search for 'Streaming Distance' in the Project Settings (Edit -> Project Settings).",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> Project Settings contain many engine-wide configurations, but specific World Partition Data Layer streaming distances are managed within the World Settings and Data Layers Editor, not Project Settings.</p>",
                    next: 'step-3'
                },
                {
                    text: "Attempt to rebuild World Partition data by going to Build -> Build World Partition.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> Rebuilding World Partition data is for regenerating spatial hashes and streaming grids, not for configuring the streaming distances of Data Layers. This won't resolve the issue.</p>",
                    next: 'step-3'
                },
            ]
        },
        'step-3': {
            skill: 'world',
            title: 'Configuring the Data Layer\'s Streaming Distance',
            prompt: "<p>You are now in the Data Layers Editor and have located the identified Data Layer (e.g., 'DL_GroundCover_Details'). You need to adjust its streaming behavior to match the desired 500-meter visibility.</p><strong>What specific action do you take within the Data Layers Editor?</strong>",
            choices: [
                {
                    text: "Select the 'DL_GroundCover_Details' Data Layer in the Data Layers Editor and modify its 'Streaming Distance' property to a suitable value (e.g., 50000 cm).",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> This is the direct solution. The 'Streaming Distance' property on the Data Layer itself controls how far away actors assigned to that layer will stream in, overriding the default or global settings for those specific assets.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Change the 'Is Loaded in Editor' checkbox for the 'DL_GroundCover_Details' Data Layer.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> 'Is Loaded in Editor' controls whether the Data Layer's contents are loaded when the editor starts, not their runtime streaming distance during PIE or gameplay.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Adjust the 'Visibility' property of the 'DL_GroundCover_Details' Data Layer.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> The 'Visibility' property typically controls whether the layer's contents are visible in the editor viewport, not their runtime streaming distance.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Delete the 'DL_GroundCover_Details' Data Layer and recreate it, hoping default settings will fix the issue.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> Deleting and recreating the Data Layer would likely lose any existing configurations and require re-assigning all actors, which is an extreme and unnecessary measure. It's unlikely to solve the underlying streaming distance problem.</p>",
                    next: 'conclusion'
                },
            ]
        },
        'conclusion': {
            skill: 'world',
            title: 'Scenario Complete',
            prompt: "By correctly identifying the problematic assets' Data Layer and adjusting its 'Streaming Distance' in the Data Layers Editor, you have resolved the visual popping issue. The bushes and rocks now stream in at the desired 500-meter range, providing a smooth visual experience.",
            choices: [
            ]
        },
    }
};
