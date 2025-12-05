window.SCENARIOS['AssetMissingInPackagedBuild'] = {
    meta: {
        title: "Asset Missing in Packaged Build",
        description: "A Blueprint works in editor but fails to load a mesh in packaged build. Investigates Soft Object References and cooking settings.",
        estimateHours: 1.5
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'asset_management',
            title: 'Step 1: The Symptom',
            prompt: "In the editor, BP_PropContainer correctly loads and shows its mesh at runtime. In a packaged build, the Blueprint still spawns, but the mesh is completely missing (invisible). What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You check the output log in the packaged build and see warnings that a mesh failed to load from a Soft Object Reference path. This tells you the Blueprint is trying to load something that isn't actually present in the cooked content.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
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
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the unnecessary changes and refocus on how the Blueprint is actually loading the mesh and whether the asset is being cooked at all.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'asset_management',
            title: 'Step 2: Investigation',
            prompt: "You inspect BP_PropContainer to see how it loads its mesh and why it might be missing only in packaged builds. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the mesh is loaded via a Soft Object Reference (or async load) at runtime, and nothing in the project hard-references that mesh. The asset also lives in a folder that is not marked to always cook, so the cooker strips it out of the packaged build.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
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
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must ensure the directory containing the Soft-referenced meshes is explicitly included in cooking, so the assets actually exist in the packaged content.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'asset_management',
            title: 'Step 3: The Fix',
            prompt: "You now know the mesh is only ever referenced through a Soft Object Reference, so it's not being cooked. How do you fix it so BP_PropContainer can load the mesh in a packaged build?",
            choices: [
                {
                    text: "Action: [Add directory to \"Additional Asset Directories to Cook\".]",
                    type: 'correct',
                    feedback: "You open Project Settings > Packaging and add the directory containing the dynamically loaded meshes to \"Additional Asset Directories to Cook\". Now the cooker includes those assets in the packaged build, and the Soft Object Reference can successfully load them at runtime.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'asset_management',
            title: 'Step 4: Verification',
            prompt: "You build and run a new packaged build after changing the packaging settings. How do you verify the fix?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "You test both in PIE and in a fresh packaged build. BP_PropContainer now correctly loads and displays its mesh at runtime in the packaged game, confirming that adding the directory to \"Additional Asset Directories to Cook\" solved the problem.",
                    next: 'conclusion'
                }
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