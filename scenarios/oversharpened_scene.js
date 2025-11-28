window.SCENARIOS['oversharpened_scene'] = {
    meta: {
        title: "Rendering: Washed Out Scene & Sharpening Artifacts",
        description: "The scene lacks contrast (washed out) and has severe shimmering/ringing artifacts on edges. Investigates Post Process Volume exposure settings and default engine sharpening overrides.",
        estimateHours: 0.75
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'rendering',
            title: 'Step 1: The Washed Out Look',
            prompt: "<p>The entire scene appears dull, grey, and washed out. Bright emissive lights look flat. You suspect the <strong>Post Process Volume</strong> is the culprit.</p><strong>What is the most likely cause of this flattened dynamic range in the Exposure settings?</strong>",
            choices: [
                {
                    text: 'Action: The <strong>Min EV100</strong> and <strong>Max EV100</strong> are clamped to a very small range (e.g., both 6.0).',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. Clamping the exposure range prevents the camera from adapting to bright or dark areas, flattening the image.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: The <strong>Bloom</strong> intensity is set too high.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> High bloom causes glowing, not a washed-out, low-contrast look across the whole frame.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: The Directional Light intensity is too low.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Increasing light intensity won't fix the exposure clamping issue; the camera will just auto-expose down again (if not fully clamped) or remain grey.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: The <strong>Color Grading</strong> saturation is set to 0.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> This would make the scene black and white, not necessarily washed out/low contrast in terms of luminance.</p>",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'rendering',
            title: 'Step 2: The Shimmering Edges',
            prompt: "<p>You fixed the contrast, but now you notice high-contrast edges (like wires) have distracting <strong>ringing artifacts</strong> and shimmering. It looks like an aggressive filter is applied.</p><strong>Where would you find a global 'Sharpening' override that persists across levels?</strong>",
            choices: [
                {
                    text: 'Action: Project Settings -> Engine -> Rendering -> <strong>Default Postprocessing Settings</strong>.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. The 'Sharpening' value here applies globally if not overridden by a local volume. A value > 0.5 often causes ringing.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: Editor Preferences -> Viewport -> <strong>Realtime</strong>.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> This toggles realtime rendering, not image processing filters.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: The <strong>Anti-Aliasing</strong> method is set to FXAA.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> FXAA is blurry, not sharp. TAA/TSR are smoother. While related to edge quality, the specific 'ringing' is a sharpening artifact.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: The <strong>Screen Percentage</strong> is set to 200%.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Supersampling (200%) usually <em>reduces</em> artifacts, though it costs performance. It doesn't cause ringing.</p>",
                    next: 'conclusion'
                }
            ]
        }
    }
};
