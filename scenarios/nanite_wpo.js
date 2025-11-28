window.SCENARIOS['nanite_wpo'] = {
    meta: {
        title: "Nanite Mesh Turns Black in Distance",
        description: "A Nanite statue with World Position Offset (WPO) turns black when viewed from 10m away.",
        estimateHours: 1.62
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'rendering',
            title: 'Identifying the Artifact',
            prompt: "<p>The statue looks fine close up but turns black at a distance. You suspect a conflict between Nanite and the Material's WPO.</p><strong>How do you confirm WPO is the cause?</strong>",
            choices: [
                {
                    text: "Check the Material Usage flags for 'Uses World Position Offset'.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Confirming WPO is active is the first step.</p>",
                    next: 'step-2'
                },
                {
                    text: "Disable Nanite on the mesh.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> This fixes the visual bug but defeats the purpose of using Nanite.</p>",
                    next: 'step-2'
                },
                {
                    text: "Adjust Skylight Intensity.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Lighting intensity won't fix a black shading artifact caused by geometry cache failure.</p>",
                    next: 'step-1'
                }
            ]
        },
        'step-2': {
            skill: 'rendering',
            title: 'Fixing Nanite WPO Evaluation',
            prompt: "<p>WPO is used. Nanite simplifies meshes at a distance, and by default, it might ignore WPO, causing the proxy mesh to mismatch the material.</p><strong>What setting in the Static Mesh Editor fixes this?</strong>",
            choices: [
                {
                    text: "Nanite Settings > World Position Offset > WPO Evaluation Mode: Enabled/Auto",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> This forces Nanite to evaluate the WPO logic when generating the proxy mesh.</p>",
                    next: 'step-3'
                },
                {
                    text: "LOD Settings > Percent Triangles",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Nanite doesn't use traditional LOD percentages.</p>",
                    next: 'step-2'
                },
                {
                    text: "Material > Tessellation Multiplier",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> Nanite doesn't use tessellation in the traditional sense.</p>",
                    next: 'step-2'
                }
            ]
        },
        'step-3': {
            skill: 'rendering',
            title: 'Verifying GI Support',
            prompt: "<p>The shape is correct now, but we want to ensure it contributes to lighting.</p><strong>What Component setting ensures the Nanite mesh affects Lumen?</strong>",
            choices: [
                {
                    text: "Rendering > Support Global Illumination",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Essential for the mesh to bounce light.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Lighting > Cast Static Shadow",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> We are using Lumen (dynamic), not static lightmaps.</p>",
                    next: 'conclusion'
                }
            ]
        }
    }
};
