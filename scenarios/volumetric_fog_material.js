window.SCENARIOS['InvisibleFogParticles'] = {
    meta: {
        title: "Particles Invisible in Fog",
        description: "Effects disappear in fog. Investigates \"Apply Volumetric Translucent Shadow\" and fog-compatible translucency.",
        estimateHours: 6.0,
        difficulty: "Advanced",
        category: "Materials"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'materials',
            title: 'Step 1: The Symptom',
            prompt: "You have a particle effect (like sparks, magic, or muzzle flash) that looks fine in clear air, but as soon as it's inside dense volumetric fog it basically disappears. The fog renders, but the translucent particles don't seem to interact with it at all. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You enable volumetric and translucency view modes and watch the particles fire inside the fog. The fog volume clearly renders, but your translucent particles don't cast or receive any volumetric shadowing--they're effectively ignored by the fog lighting. That points to a material/shadowing setting rather than a Niagara or spawn issue.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You try increasing particle brightness and changing the fog density, but the effect still all but vanishes inside the fog. Cranking the color only makes it look blown out when there is no fog, so this clearly isn't just a color/intensity problem.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'materials',
            title: 'Dead End: Wrong Guess',
            prompt: "Your tweaks to brightness and fog density didn't fix the core issue. The particles are still barely visible once they enter the volumetric fog volume.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You revert the extreme intensity and density changes and refocus on the particle material settings--specifically how it interacts with volumetric fog and shadows.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'materials',
            title: 'Step 2: Investigation',
            prompt: "You open the particle's material instance and base material to check how translucency and fog interaction are configured. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover the material is Translucent but does not have any volumetric fog options enabled: \"Apply Volumetric Translucent Shadow\" is turned off and the material isn't writing proper information into the volumetric fog pass. As a result, the particles don't contribute to or receive volumetric shadows, so they effectively vanish once surrounded by dense fog.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You consider switching the material to Masked or Opaque to \"force\" it to show up, but that would ruin the soft particle look and still wouldn't address how proper translucent shadows should be applied in fog.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'materials',
            title: 'Dead End: Misguided',
            prompt: "That idea didn't work because changing blend mode just trades one problem for another. The real goal is to keep the particle translucent but have it participate in volumetric fog lighting correctly.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the correct fix is to enable the material's volumetric translucent shadow option so the particles properly interact with the fog volume instead of trying to fake it with different blend modes.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'materials',
            title: 'Step 3: The Fix',
            prompt: "You now know the material isn't contributing to volumetric fog, which is why the particle effect disappears in it. How do you fix it?",
            choices: [
                {
                    text: "Action: [Enable \"Apply Volumetric Translucent Shadow\".]",
                    type: 'correct',
                    feedback: "In the particle's base material, you enable \"Apply Volumetric Translucent Shadow\" in the material details so the translucent particles write into and receive from the volumetric fog's lighting/shadowing. After recompiling the material (and updating any instances), the effect is now correctly evaluated inside the fog volume.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'materials',
            title: 'Step 4: Verification',
            prompt: "With the material updated, you need to verify that the particle effect is now visible and properly lit inside the fog. How do you check it in PIE?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, you trigger the particle system inside dense volumetric fog. The effect now remains clearly visible, with light from the particles interacting with the fog and soft volumetric shadows around them. The particles no longer vanish in the fog, confirming that enabling \"Apply Volumetric Translucent Shadow\" solved the issue.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'materials',
            title: 'Conclusion',
            prompt: "Lesson: If a translucent particle effect disappears or looks wrong inside volumetric fog, check the material's fog/shadow settings. Enabling \"Apply Volumetric Translucent Shadow\" (and ensuring the material writes into the volumetric pass) lets particles interact correctly with volumetric fog instead of being ignored by it.",
            choices: []
        }
    }
};