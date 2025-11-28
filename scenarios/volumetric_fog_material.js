window.SCENARIOS['volumetric_fog_material'] = {
    meta: {
        title: "Rendering: Dithered Material Black in Fog",
        description: "A dithered opaque material renders completely black in volumetric fog. Requires enabling 'Output Depth Pass' and 'Affects Volumetric Fog' in the material.",
        estimateHours: 1.2
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'materials',
            title: 'Step 1: The Black Hologram',
            prompt: "<p>You have a holographic barrier using an <strong>Opaque</strong> material with <strong>Dithered Opacity Mask</strong>. It looks great normally, but as soon as you turn on Volumetric Fog, the mesh turns pitch black and casts a solid shadow block into the fog.</p><strong>What is the root cause of this 'blackout' behavior in opaque dithered materials?</strong>",
            choices: [
                {
                    text: 'Action: The material is not writing to the depth buffer correctly for the volumetric pass.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. Volumetric fog needs accurate depth info to know where the object is. Without it, it assumes a solid block.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: The Emissive intensity is too low.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Increasing emissive just makes a bright black hole. It doesn't fix the fog interaction.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: The mesh normals are inverted.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Inverted normals would make it invisible or inside-out, not a black void in fog.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: The fog color is set to black.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> If the fog was black, everything would be black, not just this one object.</p>",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'materials',
            title: 'Step 2: The Depth Pass Fix',
            prompt: "<p>You've identified it's a depth issue. You open the Material Editor.</p><strong>Which specific checkbox in the Material Details panel must be enabled to fix this for dithered opaque materials?</strong>",
            choices: [
                {
                    text: 'Action: Enable <strong>Output Depth Pass</strong> in the Translucency/Advanced section.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. This forces the material to write its dithered depth to the buffer, allowing the fog to respect the semi-transparency pattern.</p>",
                    next: 'step-3'
                },
                {
                    text: 'Action: Change Blend Mode to <strong>Translucent</strong>.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> This changes the entire rendering pipeline and might break the dithered look or cause sorting issues.</p>",
                    next: 'step-3'
                },
                {
                    text: 'Action: Enable <strong>Two-Sided</strong>.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Good for thin objects, but doesn't fix the depth write issue.</p>",
                    next: 'step-3'
                },
                {
                    text: 'Action: Disable <strong>Cast Shadows</strong>.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> This removes the shadow, but the object itself might still render incorrectly in the fog.</p>",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'rendering',
            title: 'Step 3: Fog Contribution',
            prompt: "<p>The depth is fixed, but the object still looks a bit disconnected from the fog.</p><strong>What other flag should be checked in the Material Details to ensure it interacts properly with the fog simulation?</strong>",
            choices: [
                {
                    text: 'Action: Check <strong>Affects Volumetric Fog</strong> in the Material settings.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. This explicitly tells the renderer that this material should participate in the volumetric fog density injection.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: Enable <strong>Used with Beam Data</strong>.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> This is for particle beams.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: Set <strong>Translucency Lighting Mode</strong> to Volumetric Directional.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Only applies if you switched to Translucent blend mode, which we didn't.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: Increase <strong>Opacity Mask Clip Value</strong>.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Changes the dither threshold, but not the fog interaction logic.</p>",
                    next: 'conclusion'
                }
            ]
        }
    }
};
