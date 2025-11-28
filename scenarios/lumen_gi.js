window.SCENARIOS['lumen_gi'] = {
    meta: {
        title: "Lighting: Local Point Light Not Contributing to Global Illumination",
        description: "A Movable Point Light inside a Nanite structure fails to bounce light or illuminate the chamber via Lumen, despite high intensity. Focuses on Light component settings and Nanite Distance Field configuration.",
        estimateHours: 1.5
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'lighting',
            title: 'Step 1: The Isolated Light',
            prompt: "<p>You have placed a <strong>Movable Point Light</strong> inside a dark chamber of a Nanite ruin. The light source itself is visible, but it casts no bounce light—the room remains pitch black outside the direct radius. You have already verified the Intensity is high (8000+ lumens).</p><strong>What specific property on the Light Component determines if it injects energy into the Lumen GI solution?</strong>",
            choices: [
                {
                    text: 'Action: Check the <strong>Affect Global Illumination</strong> checkbox in the Light\'s Advanced settings.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. By default, or on migrated assets, this flag might be disabled. Without it, the light is ignored by the Lumen solver.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: Switch the light Mobility to <strong>Stationary</strong> and build lighting.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Lumen works best with Movable lights. Stationary lights require baking, which defeats the purpose of using real-time GI for this dynamic setup.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: Increase the <strong>Attenuation Radius</strong> significantly.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> This might make the direct light reach further, but it doesn't fix the underlying issue of missing GI bounce.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: Adjust the <strong>Exposure Compensation</strong> in the Post Process Volume.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> This changes the camera sensitivity globally, washing out the exterior, rather than fixing the local light contribution.</p>",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'rendering',
            title: 'Step 2: The Occluded Geometry',
            prompt: "<p>You enabled 'Affect Global Illumination', but the room is still unexpectedly dark. The mesh is a complex imported <strong>Nanite</strong> asset.</p><strong>What specific Static Mesh setting is often disabled on complex imports to save memory, preventing Lumen from calculating GI inside the mesh?</strong>",
            choices: [
                {
                    text: 'Action: Enable <strong>Affect Distance Field Lighting</strong> in the Static Mesh Editor settings.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. Lumen relies on Mesh Distance Fields (software ray tracing) to calculate surface cache coverage. If this is off, the mesh effectively doesn't exist for Lumen GI.</p>",
                    next: 'step-3'
                },
                {
                    text: 'Action: Disable <strong>Nanite</strong> on the mesh to force it to use standard geometry.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> This is a massive performance regression. Nanite should work with Lumen; disabling it is a workaround, not a fix.</p>",
                    next: 'step-3'
                },
                {
                    text: 'Action: Increase the <strong>Lightmap Resolution</strong> on the mesh.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Lightmaps are for baked static lighting. They have zero effect on fully dynamic Lumen GI.</p>",
                    next: 'step-3'
                },
                {
                    text: 'Action: Enable <strong>Two-Sided</strong> on the mesh material.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> This affects how the material renders, but if the Distance Field isn't generated (the root cause), the GI will still fail.</p>",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'debug',
            title: 'Step 3: Visual Verification',
            prompt: "<p>You've configured the light and the mesh. Now you want to visually confirm that the mesh is properly represented in the Lumen cache.</p><strong>Which View Mode allows you to inspect the simplified geometry representation used by Lumen?</strong>",
            choices: [
                {
                    text: 'Action: View Mode -> Visualize -> <strong>Lumen Scene</strong>.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> This view shows exactly what Lumen 'sees'—the surface cache and distance field representation. It's the ultimate truth for debugging GI coverage.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: View Mode -> <strong>Lighting Only</strong>.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> This shows the result of the lighting, but not the underlying data structure (the cache) causing the issue.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: View Mode -> Optimization -> <strong>Light Complexity</strong>.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> This shows shader cost, not GI validity.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: View Mode -> <strong>Path Tracing</strong>.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Path Tracing uses a completely different ray-tracing backend. It might look correct while Lumen is still broken.</p>",
                    next: 'conclusion'
                }
            ]
        }
    }
};
