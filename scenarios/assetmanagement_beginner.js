
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['DanglingAssetRedirectors'] = {
    meta: {
        title: "Broken References After Folder Restructure",
        description: "A recent reorganization of project files moved critical textures and associated material instances from 'Content/OldAssets/Textures' to 'Content/Environment/Shared'. After the move, several static meshes in the level now display the default missing material (pink/black checkers). Furthermore, a vital sequence triggered by the Level Blueprint fails to execute, throwing a log warning about 'Failed to load object' when trying to spawn a specific Particle System Component that relies on one of the moved texture assets. The assets appear correctly in the new folder location, but the old references are somehow still active and corrupting runtime behavior.",
        difficulty: "medium",
        category: "Asset Management",
        estimate: 0.75
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "A recent reorganization of project files moved critical textures and associated material instances from 'Content/OldAssets/Textures' to 'Content/Environment/Shared'. After the move, several static meshes in the level now display the default missing material (pink/black checkers). Furthermore, a vital sequence triggered by the Level Blueprint fails to execute, throwing a log warning about 'Failed to load object' when trying to spawn a specific Particle System Component that relies on one of the moved texture assets. The assets appear correctly in the new folder location, but the old references are somehow still active and corrupting runtime behavior.",
        "choices": [
            {
                "text": "Examine the Output Log for the 'Failed to load object' warning to identify the specific asset path that is failing to load (it will likely still reference the old folder structure).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Confirm the dialog box to allow the engine to attempt to repoint all incoming references to the new asset location.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.01
            },
            {
                "text": "Open the Level Blueprint, recompile it, and save the map to force the engine to refresh the Blueprint's internal asset dependencies.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.07
            },
            {
                "text": "Right-click the selected assets and choose 'Fix Up Redirectors in Folder' from the context menu.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Right-click the Material Instance and select 'Reference Viewer' to visually inspect the dependency graph and confirm that upstream assets (like textures) are still linked to the old, now non-existent, folder structure.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Select all assets within the original folder path, including the redirectors (Ctrl+A if the folder only contains redirectors).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            },
            {
                "text": "Manually opening the broken Materials in the Material Editor and attempting to drag-and-drop the textures into the graph again, which is tedious and does not fix external Blueprint references.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.2
            },
            {
                "text": "Checking Project Settings -> Packaging settings, assuming the issue is related to excluded content or the Asset Registry cache.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.15
            },
            {
                "text": "Verify that the redirector assets (grey arrows) are now removed from the old folder location.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.02
            },
            {
                "text": "Trying to delete the old empty folders immediately without first enabling 'Show Redirectors' and running the 'Fix Up Redirectors in Folder' command.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.1
            },
            {
                "text": "Run the level (PIE) and trigger the sequence that previously failed to verify the particle system now spawns correctly without logging errors.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Locate one of the affected Material Instances (the ones currently displaying pink/black) in the Content Browser.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.02
            },
            {
                "text": "Open the Content Browser settings menu (gear icon in the corner) and ensure the 'Show Redirectors' option is checked.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            },
            {
                "text": "Verify that all static meshes in the level that were previously pink/black now display their correct materials.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            },
            {
                "text": "Re-open the Reference Viewer for the affected Material Instance to confirm that its upstream Texture Sample nodes now correctly point to the 'Content/Environment/Shared' path.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.04
            },
            {
                "text": "Navigate the Content Browser to the original folder location (e.g., 'Content/OldAssets/Textures').",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.02
            },
            {
                "text": "Observe the grey arrow icons, which represent the asset redirectors left behind after the folder move.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.01
            },
            {
                "text": "If the old folder is now truly empty, delete it to prevent future confusion.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.02
            }
        ]
    }
}
};
