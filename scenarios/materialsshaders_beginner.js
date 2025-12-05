window.SCENARIOS['TextureStretching'] = {
    meta: {
        title: "Texture Stretching on Mesh",
        description: "Material looks distorted. Investigates UV scaling and Texture Coordinate nodes.",
        estimateHours: 1.5
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'materials',
            title: 'Step 1: The Symptom',
            prompt: "The material on your mesh looks stretched and distorted, even though the source texture is a clean square image. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You switch to different view modes and inspect the mesh in the viewport. The texture appears fine on a simple test cube, but on this specific mesh it's clearly stretched in certain directions. That strongly suggests a UV or tiling issue rather than a broken texture asset.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You tweak compression settings and reimport the texture, but nothing changes on the mesh. The distortion is still there, so the problem isn't with the texture file itself.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'materials',
            title: 'Dead End: Wrong Guess',
            prompt: "You chased texture import settings and compression options, but the material is still stretched on the mesh. Clearly the issue lies elsewhere.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You revert the unnecessary texture changes and refocus on the mesh's UVs and how the material is sampling them.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'materials',
            title: 'Step 2: Investigation',
            prompt: "You inspect the material graph and the mesh's UVs to understand why the texture is distorted. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the material plugs the texture sample's UVs directly from the default coordinates, with no control over tiling, and the mesh's UV islands are unevenly scaled. In some cases there isn't even a Texture Coordinate node exposed for adjustment. The UV map itself is stretched, so the square texture is being warped across the surface.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try changing the material to Unlit or adjusting roughness and normal strength, but the texture still looks warped. Those tweaks don't fix underlying UV or tiling problems.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'materials',
            title: 'Dead End: Misguided',
            prompt: "Those shading and lighting adjustments didn't help because the distortion comes from how the texture is mapped, not how it's lit.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must fix the UV layout or give the material explicit control over tiling via a Texture Coordinate node instead of just adjusting lighting.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'materials',
            title: 'Step 3: The Fix',
            prompt: "You now know the texture stretching is caused by bad UV scaling or missing tiling control in the material. How do you fix it?",
            choices: [
                {
                    text: "Action: [Add TexCoord node or fix Mesh UVs.]",
                    type: 'correct',
                    feedback: "In the Material Editor, you add a TextureCoordinate (TexCoord) node and plug it into the texture sample's UVs, adjusting UTiling/VTiling until the pattern looks even. If the UVs themselves are distorted, you go back to your DCC tool (or use Generate UVs) to create a clean, evenly scaled UV map. After applying the changes, the texture finally appears correctly proportioned on the mesh.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'materials',
            title: 'Step 4: Verification',
            prompt: "You apply the updated material and, if needed, the fixed UVs, then view the mesh in the level and in PIE. How do you verify the fix?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In the viewport and PIE, the texture now tiles cleanly across the mesh with no stretching or warping. The square details remain square, confirming that the TexCoord setup and/or UV fix solved the problem.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'materials',
            title: 'Conclusion',
            prompt: "Lesson: If a square texture looks stretched on a mesh, inspect the UVs and material UV input. Use a TextureCoordinate node with proper tiling, and ensure the mesh has a clean, correctly scaled UV map so the material can display without distortion.",
            choices: []
        }
    }
};