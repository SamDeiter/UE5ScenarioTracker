
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['RedirectorAndBulkLoadConflict'] = {
    meta: {
        title: "Corrupted Texture Reference After Migration",
        description: "A high-fidelity environmental prop (a large metallic statue) suddenly appears black and untextured in the level viewport, instead of its intended polished gold look. We recently moved the asset and its associated textures to a new folder structure. Opening the Material Instance reveals that all scalar and vector parameters are correct, and the material asset appears to be assigned, but the visual preview in the Material Instance Editor is also incorrect, showing a dull grey reflection suggesting the base texture inputs are failing to load.",
        difficulty: "medium",
        category: "Asset Management",
        estimate: 1.35
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "A high-fidelity environmental prop (a large metallic statue) suddenly appears black and untextured in the level viewport, instead of its intended polished gold look. We recently moved the asset and its associated textures to a new folder structure. Opening the Material Instance reveals that all scalar and vector parameters are correct, and the material asset appears to be assigned, but the visual preview in the Material Instance Editor is also incorrect, showing a dull grey reflection suggesting the base texture inputs are failing to load.",
        "choices": [
            {
                "text": "Close and reopen the Material Instance (MI_Statue_Polished) to force the engine to reload the dependency structure with the fixed loading setting.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "In the Content Browser, right-click the folder identified in the previous step and select 'Fix Up Redirectors in Folder' to resolve the obsolete reference paths.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Observe that the setting 'Force Bulk Load' is currently enabled (This setting, combined with a messy redirector, prevents reliable path resolution at editor load time).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Verify that the statue now renders correctly in the level viewport and that the texture preview in the Material Instance Editor is accurate.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Verify the Reference Viewer again. The dependency chain should look cleaner, but the statue still renders incorrectly (this confirms the redirectors were a problem, but not the only one).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Double-click the T_Statue_Normal texture asset itself to open the Texture Editor.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Creating a brand new Material Instance and attempting to assign the texture, which will fail because the reference issue is on the texture asset itself, not the material instance.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.3
            },
            {
                "text": "Uncheck the 'Force Bulk Load' checkbox.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Confirm that while the Material Instance specifies the texture, the Parent Material editor shows the Texture Sample node defaulting to 'None' or producing an error, indicating the reference lookup is failing on asset load.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Navigate to the Parent Material (M_Master_Metal) from the Material Instance Editor and examine the Texture Sample nodes that are failing to render, specifically the T_Statue_Normal texture input.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Locate the statue Static Mesh in the Level and identify the assigned Material Instance (MI_Statue_Polished).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Search the Content Browser for the texture T_Statue_Normal, right-click the asset, and select 'Reference Viewer' to inspect its dependency graph and check for redirector chains pointing back to the old, invalid directory structure.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Attempting to rebuild level lighting or reflection captures, assuming the issue is lighting-related rather than asset-reference related.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.2
            },
            {
                "text": "Identify the folder that still contains the broken redirectors (often the source folder prior to the move).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Save the modified T_Statue_Normal texture asset.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Deleting and manually re-importing the texture, failing to realize the redirectors still exist and are pointing other assets to the old path.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.4
            },
            {
                "text": "In the Texture Editor Details panel, search for the 'Loading' section.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Double-click MI_Statue_Polished to open the Material Instance Editor and verify that all texture parameters (Normal Map, Base Color Texture) are pointing to valid assets by name, but the preview sphere is visually incorrect.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            }
        ]
    }
}
};
