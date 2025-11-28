window.SCENARIOS['lumen_mesh_distance'] = {
    meta: {
        title: "Lumen GI Loss on Distant Emissive Mesh",
        description: "A large emissive panel stops contributing Global Illumination when the player moves 50m away.",
        estimateHours: 3.25
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'rendering',
            title: 'Visualizing the Failure',
            prompt: "<p>The emissive panel is bright, but the surrounding room gets dark when you move away. You suspect Lumen isn't seeing the mesh.</p><strong>Which view mode confirms this?</strong>",
            choices: [
                {
                    text: "Visualize > Lumen > Lumen Scene",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> This view shows exactly what Lumen 'sees'. You notice the mesh disappears from this view at distance.</p>",
                    next: 'step-2'
                },
                {
                    text: "Visualize > Mesh Distance Fields",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Lumen relies on MDFs, so this is useful, but the Lumen Scene is the definitive check.</p>",
                    next: 'step-2'
                },
                {
                    text: "Lit > Detail Lighting",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> This shows the result of lighting, not the underlying data structure causing the failure.</p>",
                    next: 'step-1'
                }
            ]
        },
        'step-2': {
            skill: 'material',
            title: 'Enabling Emissive GI',
            prompt: "<p>You confirm the mesh is missing from the Lumen Scene. You check the Material.</p><strong>What flag must be enabled for a material to contribute emissive light to Lumen?</strong>",
            choices: [
                {
                    text: "Usage > Use Emissive for Global Illumination",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> This flag is required for complex emissive materials to inject light into the Lumen scene.</p>",
                    next: 'step-3'
                },
                {
                    text: "Translucency > Allow Custom Depth Writes",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Unrelated to GI.</p>",
                    next: 'step-2'
                },
                {
                    text: "Shading Model > Unlit",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> The shading model is already correct; the issue is the usage flag.</p>",
                    next: 'step-2'
                }
            ]
        },
        'step-3': {
            skill: 'rendering',
            title: 'Improving Distance Representation',
            prompt: "<p>The material is fixed, but the mesh still disappears too early. You need to improve its representation in the Distance Field.</p><strong>What setting on the Static Mesh Component helps?</strong>",
            choices: [
                {
                    text: "Increase 'Distance Field Resolution Scale' to 1.5",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Higher resolution ensures the mesh isn't culled from the Distance Field generation too early.</p>",
                    next: 'step-4'
                },
                {
                    text: "Increase 'Bounds Scale'",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> This prevents frustum culling but doesn't improve the Distance Field quality.</p>",
                    next: 'step-3'
                }
            ]
        },
        'step-4': {
            skill: 'rendering',
            title: 'Global Distance Settings',
            prompt: "<p>It's better, but for a huge object, we need it to be visible from very far away.</p><strong>What Project Setting controls the max distance for Lumen Scene updates?</strong>",
            choices: [
                {
                    text: "Lumen Scene View Distance",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Increasing this (e.g., to 25000) ensures large distant objects remain in the Lumen cache.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Generate Mesh Distance Fields",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> This is already on; toggling it requires a restart and wastes time.</p>",
                    next: 'conclusion'
                }
            ]
        }
    }
};
