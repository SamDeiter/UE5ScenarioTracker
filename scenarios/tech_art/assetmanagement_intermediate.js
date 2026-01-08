window.SCENARIOS['AssetMissingInPackagedBuild'] = {
    meta: {
        expanded: true,
        title: "Asset Missing in Packaged Build",
        description: "A Blueprint works in editor but fails to load a mesh in packaged build. Investigates Soft Object References and cooking settings.",
        estimateHours: 1.5,
        category: "Assets"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'asset_management',
            title: 'The Symptom',
            prompt: "In the editor, BP_PropContainer correctly loads and shows its mesh at runtime. In a packaged build, the Blueprint still spawns, but the mesh is completely missing (invisible). What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You check the output log in the packaged build and see warnings that a mesh failed to load from a Soft Object Reference path. This tells you the Blueprint is trying to load something that isn't actually present in the cooked content.",
                    next: 'step-inv-1'
                },
                {
                    text: "Wrong Guess]",
                    type: 'wrong',
                    feedback: "You double-check collision, materials, and visibility settings, but everything looks fine. The mesh still doesn't appear in the packaged build, so it's probably not a simple rendering or visibility issue.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'asset_management',
            title: 'Dead End: Wrong Guess',
            prompt: "You spent time tweaking materials, LODs, and visibility flags, but nothing fixed the missing mesh in the packaged build. Clearly this isn't just a rendering flag problem.",
            choices: [
                {
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the unnecessary changes and refocus on how the Blueprint is actually loading the mesh and whether the asset is being cooked at all.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-2': {
            skill: 'asset_management',
            title: 'Investigation',
            prompt: "You inspect BP_PropContainer to see how it loads its mesh and why it might be missing only in packaged builds. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the mesh is loaded via a Soft Object Reference (or async load) at runtime, and nothing in the project hard-references that mesh. The asset also lives in a folder that is not marked to always cook, so the cooker strips it out of the packaged build.",
                    next: 'step-3'
                },
                {
                    text: "Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try replacing the mesh at runtime with another Soft Object Reference, or you rebuild the Blueprint, but the packaged build still can't find the asset. The underlying problem--assets not being cooked--remains.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'asset_management',
            title: 'Dead End: Misguided',
            prompt: "Your changes didn't help because the real issue is that the asset never gets cooked into the build. If it isn't cooked, no amount of Blueprint logic will make it appear at runtime.",
            choices: [
                {
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must ensure the directory containing the Soft-referenced meshes is explicitly included in cooking, so the assets actually exist in the packaged content.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'asset_management',
            title: 'The Fix',
            prompt: "You now know the mesh is only ever referenced through a Soft Object Reference, so it's not being cooked. How do you fix it so BP_PropContainer can load the mesh in a packaged build?",
            choices: [
                {
                    text: "Add directory to 'Additional Asset Directories to Cook'.]",
                    type: 'correct',
                    feedback: "You open Project Settings > Packaging and add the directory containing the dynamically loaded meshes to \"Additional Asset Directories to Cook\". Now the cooker includes those assets in the packaged build, and the Soft Object Reference can successfully load them at runtime.",
                    next: 'step-ver-1'
                }
            ]
        },
        'step-4': {
            skill: 'asset_management',
            title: 'Verification',
            prompt: "You build and run a new packaged build after changing the packaging settings. How do you verify the fix?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "You test both in PIE and in a fresh packaged build. BP_PropContainer now correctly loads and displays its mesh at runtime in the packaged game, confirming that adding the directory to \"Additional Asset Directories to Cook\" solved the problem.",
                    next: 'step-inv-1'
                }
            ]
        },

        'step-inv-1': {
            skill: 'debugging',
            title: 'Investigation: Visual Diagnostics',
            prompt: "Before diving into logs, you want to confirm the Actor's state in the packaged build. Is the Actor destroyed, or is it just invisible?",
            choices: [
                {
                    text: "Console: toggledebugcamera / show collision]",
                    type: 'correct',
                    feedback: "You detach the camera and inspect the location. You see the Actor's collision capsule and debug text, but the Static Mesh Component is empty. The Actor exists, but the mesh failed to load.",
                    next: 'step-inv-2'
                },
                {
                    text: "Console: stat unit]",
                    type: 'wrong',
                    feedback: "Stat unit shows you performance metrics (Game, Draw, GPU), but it doesn't tell you why a specific mesh is missing.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-inv-2': {
            skill: 'log_analysis',
            title: 'Investigation: Log Forensics',
            prompt: "The Actor exists, but the mesh is null. You check the packaged build logs (Saved/Logs/ProjectName.log). What specific error are you looking for?",
            choices: [
                {
                    text: "Search for 'LogStreaming' errors]",
                    type: 'correct',
                    feedback: "You find: 'LogStreaming: Error: Couldn't find file for package /Game/Assets/Props/MyMesh'. This confirms the engine cannot find the asset file on disk in the packaged build.",
                    next: 'step-inv-1'
                },
                {
                    text: "Search for 'Blueprint Runtime Error']",
                    type: 'wrong',
                    feedback: "You suspect a logic error, but there are no 'Accessed None' errors. The logic ran, it just failed to retrieve data.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'blueprint_logic',
            title: 'Red Herring: Logic Timing',
            prompt: "You suspect the Async Load Asset node is firing before the GameInstance is fully initialized, causing the load to fail silently. You try adding a Delay node before the load.",
            choices: [
                {
                    text: "Add Delay and Re-package]",
                    type: 'wrong',
                    feedback: "You waste time packaging again. The mesh is still missing. A timing issue would usually result in a pending handle, but the log explicitly stated 'File not found'.",
                    next: 'step-inv-2'
                },
                {
                    text: "Re-read the logs]",
                    type: 'correct',
                    feedback: "You realize timing isn't the issue. The file is physically missing from the package.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-ver-1': {
            skill: 'packaging',
            title: 'Verification: PAK Inspection',
            prompt: "You've added the directory to 'Additional Asset Directories to Cook'. Before launching the game, you want to verify the asset physically exists in the .pak file to save time.",
            choices: [
                {
                    text: "Use UnrealPak.exe -List]",
                    type: 'correct',
                    feedback: "You run the command line tool on the generated .pak file. You grep the output list and confirm that 'Game/Content/Props/MyMesh.uasset' is now present in the archive.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'debugging',
            title: 'Verification: Runtime Confirmation',
            prompt: "The asset is in the PAK. Now you run the packaged executable with the '-Log' argument to watch the load in real-time.",
            choices: [
                {
                    text: "Observe Log Output]",
                    type: 'correct',
                    feedback: "You see 'LogStreaming: Display: Async Loading... Success'. The mesh appears instantly in the game window.",
                    next: 'step-ver-1'
                },
            ]
        },


        'step-inv-3_editor_check': {
            skill: 'asset_management',
            title: 'Editor Investigation: Asset References',
            prompt: "The logs confirm the file is missing from the packaged build. Back in the editor, you need to understand how 'MyMesh' is referenced. How do you check if any other asset *hard-references* 'MyMesh'?",
            choices: [
                {
                    text: "Use the Reference Viewer or Audit Asset tool on 'MyMesh'.",
                    type: 'correct',
                    feedback: "You open the Reference Viewer for 'MyMesh' and confirm that no other assets directly hard-reference it. This strongly suggests it's being stripped by the cooker.",
                    next: 'step-inv-4_editor_check_softref'
                },
                {
                    text: "Search for 'MyMesh' in the Content Browser.",
                    type: 'wrong',
                    feedback: "Searching in the Content Browser shows you where the asset is located, but it doesn't tell you *what references it* or if those references are strong enough to force cooking. This doesn't help diagnose the cooking issue.",
                    next: 'step-rh-2_content_browser'
                },
            ]
        },

        'step-rh-2_content_browser': {
            skill: 'asset_management',
            title: 'Red Herring: Content Browser Search',
            prompt: "You've spent time searching the Content Browser, but it only confirms the asset's location, not its reference chain. This doesn't provide insight into why it's not being cooked.",
            choices: [
                {
                    text: "Realize the limitation and use proper reference tools.",
                    type: 'correct',
                    feedback: "You understand that the Content Browser search is insufficient for dependency analysis and decide to use the dedicated reference tools.",
                    next: 'step-inv-3_editor_check'
                },
            ]
        },

        'step-inv-4_editor_check_softref': {
            skill: 'blueprint_logic',
            title: 'Editor Investigation: Blueprint Logic',
            prompt: "The Reference Viewer shows no hard references to 'MyMesh'. Now, you need to confirm 'BP_PropContainer' is indeed loading it via a Soft Object Reference. How do you verify this within the Blueprint?",
            choices: [
                {
                    text: "Open 'BP_PropContainer' and inspect its construction script or event graph for 'Load Asset' nodes (e.g., 'Async Load Asset').",
                    type: 'correct',
                    feedback: "You find an 'Async Load Asset' node in the Blueprint's Event Graph, confirming that the mesh is loaded dynamically at runtime using a Soft Object Reference. This explains why the cooker might be ignoring it.",
                    next: 'step-inv-5_cooker_settings'
                },
                {
                    text: "Check the Static Mesh Component in 'BP_PropContainer''s details panel.",
                    type: 'wrong',
                    feedback: "The Static Mesh Component in the Blueprint's details panel will likely be empty or set to a placeholder mesh. This only shows its default state, not how the Blueprint attempts to load a different mesh at runtime.",
                    next: 'step-rh-3_component_check'
                },
            ]
        },

        'step-rh-3_component_check': {
            skill: 'blueprint_logic',
            title: 'Red Herring: Component Default State',
            prompt: "Checking the component's default value didn't reveal the runtime loading logic. You need to look at the Blueprint's actual script.",
            choices: [
                {
                    text: "Realize the component's default isn't the runtime logic.",
                    type: 'correct',
                    feedback: "You understand that runtime loading logic is found in the Blueprint's graph, not just its component defaults.",
                    next: 'step-inv-4_editor_check_softref'
                },
            ]
        },

        'step-inv-5_cooker_settings': {
            skill: 'packaging',
            title: 'Cooker Investigation: Project Settings',
            prompt: "You've confirmed 'MyMesh' is only soft-referenced by 'BP_PropContainer'. This means the cooker won't automatically include it. Where do you check the project's packaging settings to ensure this asset's directory is explicitly included in the build?",
            choices: [
                {
                    text: "Project Settings > Packaging > 'Additional Asset Directories to Cook'.",
                    type: 'correct',
                    feedback: "You navigate to the Packaging section in Project Settings and identify 'Additional Asset Directories to Cook' as the place to explicitly tell the cooker to include specific folders.",
                    next: 'step-2'
                },
                {
                    text: "Project Settings > Asset Registry > 'Primary Asset Types to Scan'.",
                    type: 'wrong',
                    feedback: "While Primary Assets can be used for explicit cooking and management, simply scanning for them doesn't guarantee they'll be cooked if not explicitly referenced or added to a cook list. This is a more complex system than needed for a simple directory inclusion.",
                    next: 'step-rh-4_primary_asset'
                },
            ]
        },

        'step-rh-4_primary_asset': {
            skill: 'packaging',
            title: 'Red Herring: Primary Asset Configuration',
            prompt: "You've explored Primary Asset settings, but this system is typically for more advanced asset management and explicit loading rules, not for ensuring a simple directory of assets is cooked when only soft-referenced.",
            choices: [
                {
                    text: "Understand the difference and look for direct directory inclusion.",
                    type: 'correct',
                    feedback: "You realize that for this specific problem, a simpler, direct approach to cooking asset directories is available.",
                    next: 'step-inv-5_cooker_settings'
                },
            ]
        },

        'conclusion': {
            skill: 'asset_management',
            title: 'Conclusion',
            prompt: "Lesson: When loading meshes (or other assets) via Soft Object References or async loads, make sure those assets are cooked. If nothing hard-references them, add their folders to Project Settings > Packaging > \"Additional Asset Directories to Cook\" so they're present in packaged builds.",
            choices: []
        }
    }
};