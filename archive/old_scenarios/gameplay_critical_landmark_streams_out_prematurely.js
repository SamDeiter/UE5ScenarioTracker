window.SCENARIOS['gameplay_critical_landmark_streams_out_prematurely'] = {
    meta: {
        title: "Gameplay-Critical Landmark Streams Out Prematurely",
        description: "A large, highly visible Clock Tower asset, essential for gameplay navigation and containing a required mission trigger, streams out prematurely when the player moves approximately 50 meters away. The tower is assigned to the 'DL_KeyLandmarks' Data Layer, and a nearby trigger Blueprint (BP_MissionZone_A) should prevent this.",
        estimateHours: 1.15,
        category: "World Partition & Streaming"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'world',
            title: 'Validate the Bug and Initial Observations',
            prompt: "<p>You've received a bug report stating that the Clock Tower, a critical gameplay landmark, streams out prematurely. Before diving into specific settings, what is your first step to confirm the issue and gather initial observations?</p><strong>What do you do?</strong>",
            choices: [
                {
                    text: "Perform a Play-In-Editor (PIE) session and observe the Clock Tower's streaming behavior when moving away from its base.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> This is the essential first step to confirm the bug's reproduction, observe the exact distance at which it occurs, and verify the impact on gameplay. This provides concrete evidence before troubleshooting.</p>",
                    next: 'step-2'
                },
                {
                    text: "Increase the global World Partition Streaming Distance parameter in World Settings to a very high value.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> While this might mask the symptom, it's a broad, project-wide change that doesn't address the root cause of why this specific asset streams out prematurely. It's a workaround, not a fix, and could negatively impact performance across the entire level.</p>",
                    next: 'step-2'
                },
                {
                    text: "Check the Clock Tower's collision settings to ensure it's not being culled by collision volumes.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> Collision settings primarily affect physics interactions and visibility culling based on camera frustum, not spatial loading/unloading via World Partition. This is an irrelevant avenue for investigating a streaming issue.</p>",
                    next: 'step-2'
                },
                {
                    text: "Immediately open the Clock Tower's Static Mesh asset in the Content Browser to check its import settings.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> The issue is about the <em>actor's</em> placement and streaming behavior in the world, not the static mesh asset itself. Checking import settings is premature and unlikely to reveal the cause of a World Partition streaming problem.</p>",
                    next: 'step-2'
                },
            ]
        },
        'step-2': {
            skill: 'world',
            title: 'Inspect Clock Tower Actor Properties',
            prompt: "<p>You've confirmed the Clock Tower streams out prematurely at approximately 50 meters. Now, focus on the Clock Tower Static Mesh Actor itself within the world. What's your next investigative step to check its World Partition configuration?</p><strong>What do you do?</strong>",
            choices: [
                {
                    text: "Select the Clock Tower Actor in the World Outliner and inspect its 'World Partition' section in the Details panel, specifically checking its 'Data Layer' assignment and the 'Is Spatially Loaded' property.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> This directly targets the actor's World Partition configuration, which dictates its streaming behavior. Ensuring it's correctly assigned to 'DL_KeyLandmarks' and that 'Is Spatially Loaded' is checked are crucial first checks for an actor in a World Partitioned level.</p>",
                    next: 'step-3'
                },
                {
                    text: "Manually set the Clock Tower Actor's 'Is Spatially Loaded' property to unchecked in the Details panel.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> Unchecking 'Is Spatially Loaded' would prevent the actor from streaming out based on spatial proximity, but it would also prevent it from streaming <em>in</em> correctly via World Partition, potentially making the problem worse or introducing new issues. This is an incorrect modification without understanding the root cause.</p>",
                    next: 'step-3'
                },
                {
                    text: "Attempt to create a new Blueprint to manually load the Data Layer via an 'Activate Data Layer' node.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> While manual Data Layer activation is possible, the bug description implies an existing <code>BP_MissionZone_A</code> should be handling this. Creating a new Blueprint is redundant and bypasses investigating the intended streaming mechanism.</p>",
                    next: 'step-3'
                },
                {
                    text: "Adjust the Clock Tower's Level of Detail (LOD) settings to prevent it from disappearing at a distance.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> LOD settings control mesh complexity at different distances, not whether the entire actor streams out of existence from memory. The problem is complete unloading, not just a change in visual fidelity or rendering culling.</p>",
                    next: 'step-3'
                },
            ]
        },
        'step-3': {
            skill: 'world',
            title: 'Investigate Data Layer and Streaming Blueprint',
            prompt: "<p>You've verified the Clock Tower Actor is correctly assigned to 'DL_KeyLandmarks' and 'Is Spatially Loaded' is checked. The issue persists, meaning the actor's individual settings appear correct. What's the next logical step to investigate the Data Layer itself and the dedicated streaming Blueprint responsible for this area?</p><strong>What do you do?</strong>",
            choices: [
                {
                    text: "Open the Data Layers Panel (Window -> Data Layers) to confirm the 'DL_KeyLandmarks' Data Layer's 'Runtime State' is 'Activated', then locate and open 'BP_MissionZone_A' in the Content Browser to inspect its logic.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> This addresses the two remaining critical components: the Data Layer's active state, which directly impacts streaming, and the dedicated Blueprint (<code>BP_MissionZone_A</code>) that is explicitly mentioned as responsible for managing the loading of this specific area and its associated Data Layer. The problem likely lies in one of these.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Rebuild all lighting in the level, as lighting issues can sometimes cause unexpected visibility problems.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> Lighting rebuilds affect illumination and shadows, not the spatial loading and unloading of actors via World Partition. This is an irrelevant and time-consuming action for this type of bug.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Migrate the Clock Tower Actor to a new, empty level to see if the issue persists there.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> This is a drastic troubleshooting step that isolates the actor but doesn't help diagnose the problem within the current World Partition setup, Data Layer configuration, or the existing streaming Blueprint. It's too time-consuming and doesn't leverage the existing context.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Increase the Clock Tower's 'Min Draw Distance' property to a very high value in the Details panel.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> 'Min Draw Distance' controls when an object <em>starts</em> to render, not when it streams out of memory via World Partition. This property is for rendering culling, not spatial loading, and would not prevent the entire actor from unloading.</p>",
                    next: 'conclusion'
                },
            ]
        },
        'conclusion': {
            skill: 'world',
            title: 'Scenario Complete',
            prompt: "<p>By systematically validating the bug, inspecting the actor's World Partition settings, and then investigating the associated Data Layer and streaming Blueprint, you've successfully identified the areas where the streaming issue is likely occurring. The next step would be to correct the 'Runtime State' of the Data Layer or the logic within 'BP_MissionZone_A'.</p>",
            choices: [
            ]
        },
    }
};
