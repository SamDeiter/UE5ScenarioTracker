window.SCENARIOS['volumetric_fog_banding'] = {
    meta: {
        title: "Lighting: Severe Volumetric Fog Banding",
        description: "Volumetric fog shows severe vertical banding and light leakage. Requires tuning Voxel Quality, History Weight, and Shadow Injection settings.",
        estimateHours: 3.0
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'lighting',
            title: 'Step 1: The Pixelated Fog',
            prompt: "<p>Your scene has <strong>Volumetric Fog</strong> enabled, but it looks terrible. There are distinct vertical bands (stripes) and light leaks through walls. You've confirmed the Directional Light is Movable.</p><strong>What is the primary setting to increase the resolution of the volumetric voxel grid?</strong>",
            choices: [
                {
                    text: 'Action: Increase <strong>Volumetric Scattering Sample Count</strong> (Voxel Quality) in the Exponential Height Fog component.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. Increasing this (e.g., from 128 to 256) directly improves the grid resolution, reducing blocky artifacts.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: Increase the <strong>Fog Density</strong>.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Making the fog thicker just makes the artifacts more visible.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: Enable <strong>Contact Shadows</strong> on the light.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Contact shadows are screen-space and don't affect the volumetric voxel grid resolution.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: Increase the <strong>Lightmap Resolution</strong> of the floor.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Volumetric fog is dynamic; lightmaps are irrelevant here.</p>",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'rendering',
            title: 'Step 2: Temporal Stability',
            prompt: "<p>The resolution is better, but the fog still flickers and bands when the camera moves.</p><strong>Which setting improves the temporal stability of the fog simulation?</strong>",
            choices: [
                {
                    text: 'Action: Increase the <strong>History Weight</strong> in the Volumetric Fog settings (e.g., to 0.9).',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. A higher history weight relies more on previous frames, smoothing out jitter and noise over time.</p>",
                    next: 'step-3'
                },
                {
                    text: 'Action: Switch Anti-Aliasing to <strong>FXAA</strong>.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> FXAA is a spatial post-process and does not help with volumetric temporal accumulation.</p>",
                    next: 'step-3'
                },
                {
                    text: 'Action: Decrease the <strong>View Distance</strong> of the fog.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> This concentrates the voxels, which might help resolution, but doesn't fix the temporal flickering.</p>",
                    next: 'step-3'
                },
                {
                    text: 'Action: Turn off <strong>Motion Blur</strong>.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Motion blur is a separate post-process effect.</p>",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'console',
            title: 'Step 3: Advanced Shadow Injection',
            prompt: "<p>There is still some light leaking through solid walls into the fog.</p><strong>Which console command forces high-quality shadow injection into the fog grid?</strong>",
            choices: [
                {
                    text: 'Action: <code>r.VolumetricFog.InjectShadowsInFogGrid 1</code>',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. This forces the engine to sample shadows more accurately for the volumetric grid, preventing leaks.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: <code>r.ShadowQuality 5</code>',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Improves general shadows, but doesn't specifically target the volumetric injection pass.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: <code>stat fps</code>',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> This just shows the frame rate.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: <code>r.Lumen.Reflections.Allow 0</code>',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Lumen reflections are unrelated to volumetric fog shadows.</p>",
                    next: 'conclusion'
                }
            ]
        }
    }
};
