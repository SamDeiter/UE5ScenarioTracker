window.SCENARIOS['dynamic_nanite_geometry_flickering_and_blocky_vsm_shadows_on_rapid_camera_movement'] = {
    meta: {
        title: "Dynamic Nanite Geometry Flickering and Blocky VSM Shadows on Rapid Camera Movement",
        description: "In a highly detailed, large interior environment using Lumen Global Illumination, two distinct rendering artifacts occur specifically when the camera is moved quickly: 1. The Nanite-enabled tiled floor material exhibits severe flickering (patches of pure white or black) when viewed from intermediate distances. 2. The high-poly Nanite geometric wall molding casts extremely blocky, low-resolution shadows that jump and update visibly as the camera speeds up. The blockiness persists even at high-e",
        estimateHours: 3,
        category: "Lighting & Rendering"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'lighting',
            title: 'Diagnosing Virtual Shadow Map Performance',
            prompt: "<p>You're experiencing blocky, low-resolution shadows from Nanite geometry that jump and update visibly during rapid camera movement. This behavior is highly indicative of Virtual Shadow Maps (VSM) struggling to keep up or being misconfigured. Before making changes, you need to understand the current VSM state.</p><strong>What is your first diagnostic step?</strong>",
            choices: [
                {
                    text: "Use the console command 'stat virtualshadowmap' to confirm VSM is active and check the 'Page Pool Usage' and 'Page Pool Size' metrics.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> This command provides crucial real-time data on VSM performance, including how much memory is being used and allocated. It's the most direct way to confirm if VSM is the bottleneck.</p>",
                    next: 'step-2'
                },
                {
                    text: "Attempt to fix the shadow blockiness by adjusting the Directional Light's 'Shadow Resolution Scale' or 'Shadow Bias' settings.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> While these settings affect traditional shadow maps, they are largely irrelevant for Virtual Shadow Maps, especially for blockiness related to dynamic updates. This would be a time-consuming dead end.</p>",
                    next: 'step-2'
                },
                {
                    text: "Modify the Texture Pool Size in Project Settings, assuming it's a standard texture streaming issue causing low-resolution shadows.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> Virtual Shadow Maps manage their own page pool and are distinct from the general texture streaming pool. Adjusting the texture pool size will not resolve VSM-specific blockiness and could negatively impact other textures.</p>",
                    next: 'step-2'
                },
                {
                    text: "Adjust the engine scalability settings (e.g., View Distance, Shadow Quality) to see if a lower quality preset resolves the issue.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> While scalability settings can impact VSM, this is a blunt instrument. It doesn't diagnose the root cause and might hide the problem rather than solve it efficiently, potentially sacrificing overall quality unnecessarily.</p>",
                    next: 'step-2'
                },
            ]
        },
        'step-2': {
            skill: 'rendering',
            title: 'Configuring Virtual Shadow Map Resources',
            prompt: "<p>Based on your <code>stat virtualshadowmap</code> findings, you've observed that the 'Page Pool Usage' is consistently high or near its limit, indicating that VSM is running out of memory to store high-resolution shadow pages, especially during rapid camera movement. This leads to the blocky, low-resolution shadows.</p><strong>How do you increase the resources available to Virtual Shadow Maps?</strong>",
            choices: [
                {
                    text: "In Project Settings > Rendering > Virtual Shadow Maps, increase the 'VSM Page Table Size' setting from its default (e.g., 4096) to a higher value like 8192 or 16384.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> Increasing the VSM Page Table Size directly allocates more memory for VSM pages, allowing for higher resolution and more stable shadows, especially during dynamic camera movement. This is the primary setting for VSM quality vs. memory.</p>",
                    next: 'step-3'
                },
                {
                    text: "Use the console command 'r.VSM.PageTableSize 16384' or 'r.VSM.PageTableSize 8192' to apply the change immediately for testing purposes.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> This console command achieves the same result as changing the Project Setting but allows for quicker iteration and testing without restarting the editor. It's excellent for immediate validation.</p>",
                    next: 'step-3'
                },
                {
                    text: "Disabling Nanite on the problematic wall molding meshes to see if the shadow issue persists without Nanite.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> While this might remove the immediate symptom, it defeats the purpose of using Nanite for high-detail geometry and doesn't solve the underlying VSM resource allocation problem. It's a workaround, not a solution.</p>",
                    next: 'step-3'
                },
                {
                    text: "Adjusting the engine scalability settings (View Distance, Shadow Quality) instead of specific VSM settings.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> Relying on general scalability settings is less precise than directly configuring VSM. While 'Shadow Quality' might indirectly affect VSM, it's not the targeted solution for page pool exhaustion and could have broader, unintended performance impacts.</p>",
                    next: 'step-3'
                },
            ]
        },
        'step-3': {
            skill: 'material',
            title: 'Resolving Nanite Geometry Flickering and Material Issues',
            prompt: "<p>With the Virtual Shadow Map issues addressed, your focus shifts to the Nanite-enabled tiled floor material, which exhibits severe flickering (patches of pure white or black) when viewed from intermediate distances during rapid camera movement. This often points to issues with Nanite's interaction with materials or specific rendering features.</p><strong>What is the most appropriate next step to diagnose and resolve the flickering floor?</strong>",
            choices: [
                {
                    text: "Open the problematic floor Static Mesh asset in the Static Mesh Editor. Verify that Nanite is enabled and check its 'Fallback Relative Error' and 'Preserve Area' settings.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> Ensuring Nanite is correctly configured on the mesh itself is fundamental. Incorrect fallback settings or issues with area preservation can lead to visual artifacts like flickering, especially at varying distances.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Check the Material assigned to the flickering floor mesh. Ensure the Blend Mode is set to 'Opaque.' If it's using 'Masked' or 'Translucent,' investigate if it's compatible with Nanite's current limitations.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> Nanite has specific limitations with certain material blend modes and complex pixel shaders. Opaque materials are generally the most compatible. Incorrect blend modes can cause severe rendering artifacts like flickering.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Examine the Material Function used within the floor material (if applicable). Look for temporal effects, custom depth writes, or complex shader logic that might conflict with Nanite's rendering pipeline.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> Complex material functions, especially those involving temporal effects, custom depth, or non-standard rendering passes, can often conflict with Nanite's simplified rendering of geometry, leading to flickering or incorrect visuals.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Disabling Nanite on the flickering floor meshes to test if the issue persists, which avoids solving the problem for Nanite-enabled geometry.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> While this would confirm Nanite is involved, it's a diagnostic step that bypasses the core problem rather than solving it. The goal is to make Nanite work correctly, not to disable it.</p>",
                    next: 'conclusion'
                },
            ]
        },
        'conclusion': {
            skill: 'rendering',
            title: 'Scenario Complete',
            prompt: "<p>By systematically diagnosing and adjusting Virtual Shadow Map page table sizes and then meticulously checking Nanite mesh settings, material blend modes, and complex material functions, you have successfully resolved both the blocky VSM shadows and the flickering Nanite geometry. The environment now renders correctly during rapid camera movement, leveraging Nanite's detail without visual artifacts.</p>",
            choices: [
            ]
        },
    }
};
