window.SCENARIOS['InvisibleFogParticles'] = {
    meta: {
        expanded: true,
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
            title: 'The Symptom',
            prompt: "You have a particle effect (like sparks, magic, or muzzle flash) that looks fine in clear air, but as soon as it's inside dense volumetric fog it basically disappears. The fog renders, but the translucent particles don't seem to interact with it at all. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You enable volumetric and translucency view modes and watch the particles fire inside the fog. The fog volume clearly renders, but your translucent particles don't cast or receive any volumetric shadowing--they're effectively ignored by the fog lighting. That points to a material/shadowing setting rather than a Niagara or spawn issue.",
                    next: 'step-A'
                },
                {
                    text: "Wrong Guess]",
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
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You revert the extreme intensity and density changes and refocus on the particle material settings--specifically how it interacts with volumetric fog and shadows.",
                    next: 'step-A'
                }
            ]
        },
        'step-2': {
            skill: 'materials',
            title: 'Investigation',
            prompt: "You open the particle's material instance and base material to check how translucency and fog interaction are configured. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover the material is Translucent but does not have any volumetric fog options enabled: \"Apply Volumetric Translucent Shadow\" is turned off and the material isn't writing proper information into the volumetric fog pass. As a result, the particles don't contribute to or receive volumetric shadows, so they effectively vanish once surrounded by dense fog.",
                    next: 'step-C'
                },
                {
                    text: "Misguided Attempt]",
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
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the correct fix is to enable the material's volumetric translucent shadow option so the particles properly interact with the fog volume instead of trying to fake it with different blend modes.",
                    next: 'step-C'
                }
            ]
        },
        'step-3': {
            skill: 'materials',
            title: 'The Fix',
            prompt: "You now know the material isn't contributing to volumetric fog, which is why the particle effect disappears in it. How do you fix it?",
            choices: [
                {
                    text: "Enable 'Apply Volumetric Translucent Shadow'.]",
                    type: 'correct',
                    feedback: "In the particle's base material, you enable \"Apply Volumetric Translucent Shadow\" in the material details so the translucent particles write into and receive from the volumetric fog's lighting/shadowing. After recompiling the material (and updating any instances), the effect is now correctly evaluated inside the fog volume.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'materials',
            title: 'Verification',
            prompt: "With the material updated, you need to verify that the particle effect is now visible and properly lit inside the fog. How do you check it in PIE?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, you trigger the particle system inside dense volumetric fog. The effect now remains clearly visible, with light from the particles interacting with the fog and soft volumetric shadows around them. The particles no longer vanish in the fog, confirming that enabling \"Apply Volumetric Translucent Shadow\" solved the issue.",
                    next: 'step-A'
                }
            ]
        },
        'step-A': {
            skill: 'rendering',
            title: 'Isolating the Volumetric Effect',
            prompt: "You confirmed the particles are failing to interact with the volumetric fog lighting. To definitively isolate the issue to the fog interaction, you use a console command to temporarily disable the feature. Which command is most appropriate?",
            choices: [
                {
                    text: "r.VolumetricFog 0]",
                    type: 'correct',
                    feedback: "Disabling volumetric fog confirms that the particles render perfectly fine when the fog volume is removed. This strongly indicates the problem lies in how the particle material interacts with the volumetric lighting pass, not a general translucency or spawning issue.",
                    next: 'step-B'
                },
                {
                    text: "r.TranslucencyLightingVolume 0]",
                    type: 'wrong',
                    feedback: "This command relates to standard translucency lighting volumes, not the specific volumetric fog system. The particles remain invisible in the dense fog.",
                    next: 'step-A'
                },
            ]
        },

        'step-B': {
            skill: 'rendering',
            title: 'Analyzing Volumetric Contribution',
            prompt: "You know the fog is the culprit. Before checking the material settings, you want to visualize what the engine sees. Which specific view mode or visualization helps you confirm that the particles are failing to write data into the volumetric fog pass?",
            choices: [
                {
                    text: "View Mode: Volumetric Fog]",
                    type: 'correct',
                    feedback: "Switching to the Volumetric Fog view mode shows the density and lighting contribution of the fog volume. When the particles fire, they show no visible contribution or shadowing effect within this visualization, confirming they are being ignored by the volumetric pass. Time to check the material.",
                    next: 'step-A'
                },
                {
                    text: "View Mode: Shader Complexity]",
                    type: 'wrong',
                    feedback: "Shader Complexity is useful for performance optimization but doesn't show the actual volumetric contribution or lack thereof.",
                    next: 'step-B'
                },
            ]
        },

        'step-C': {
            skill: 'niagara',
            title: 'Red Herring - Niagara Depth Settings',
            prompt: "You've identified the material as the likely source, but before applying the fix, you check a common particle pitfall: depth interaction. You notice the Niagara system uses 'Depth Buffer' interaction modules. You try disabling the module, thinking it might be interfering with the fog depth calculation.",
            choices: [
                {
                    text: "Disable Depth Buffer Module]",
                    type: 'wrong',
                    feedback: "Disabling the depth buffer module might introduce sorting artifacts (particles clipping through geometry) but does not address the core issue of the material failing to interact with the volumetric lighting pass. The particles still vanish in the fog.",
                    next: 'step-C_W'
                },
            ]
        },

        'step-C_W': {
            skill: 'materials',
            title: 'Dead End: Niagara Tweak',
            prompt: "The Niagara depth module wasn't the issue. You must return to the material settings to find the flag that enables volumetric interaction.",
            choices: [
                {
                    text: "Proceed to Material Fix]",
                    type: 'correct',
                    feedback: "You realize the fix must be in the material details panel, specifically related to volumetric shadowing.",
                    next: 'step-C'
                },
            ]
        },

        'step-D': {
            skill: 'optimization',
            title: 'Performance Impact Assessment',
            prompt: "The visual bug is fixed, but enabling 'Apply Volumetric Translucent Shadow' can be performance-intensive. How do you verify that the fix hasn't introduced unacceptable frame rate drops?",
            choices: [
                {
                    text: "Use stat unit and stat gpu]",
                    type: 'correct',
                    feedback: "You run `stat unit` and `stat gpu` while the particle system is active inside the fog. You observe a measurable increase in GPU time under the 'Volumetric Fog' category, but the overall frame rate remains acceptable, confirming the fix is viable for performance.",
                    next: 'step-E'
                },
                {
                    text: "Check the Material Instruction Count]",
                    type: 'wrong',
                    feedback: "While instruction count is important, the performance hit from volumetric translucent shadows is primarily due to the rendering cost of the volumetric pass itself, not just the shader complexity. You need to check runtime GPU metrics.",
                    next: 'step-D'
                },
            ]
        },

        'step-E': {
            skill: 'testing',
            title: 'Standalone Build Confirmation',
            prompt: "Rendering issues sometimes manifest differently in PIE versus a packaged build. What is the final step to ensure this fix is robust and ready for production?",
            choices: [
                {
                    text: "Test in Standalone Game or Packaged Build]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone mode and confirm the particles render correctly within the fog, ensuring that the fix holds up under production-like conditions and scalability settings are not overriding the material flag.",
                    next: 'step-D'
                },
                {
                    text: "Run a GPU Trace in PIE]",
                    type: 'wrong',
                    feedback: "A GPU trace is useful for deep optimization but doesn't replace the necessity of testing the final behavior in a standalone environment.",
                    next: 'step-E'
                },
            ]
        },
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