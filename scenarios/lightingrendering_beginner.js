window.SCENARIOS['BlackMetallicObject'] = {
    meta: {
        title: "Metallic Asset Appears Pitch Black in Dynamic Scene",
        description: "A highly reflective metallic statue appears pitch black despite dynamic lighting. Investigates reflection environments, Lumen settings, and material properties.",
        estimateHours: 1.5,
        category: "Lighting"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'lighting',
            title: 'Step 1: Initial Observation',
            prompt: "You have placed a highly detailed metallic statue in your level. There is a strong directional light and a skylight, and the floor looks correctly lit. However, the statue itself appears completely pitch black, as if it has no material at all. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Output Log or View Modes]",
                    type: 'correct',
                    feedback: "You check the Output Log for shader errors--none found. You switch to 'Lighting Only' mode, and the statue is still black. You switch to 'Reflections' view mode and notice the entire area around the statue is black/empty. This suggests the issue is related to how the object is reflecting its environment.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Increase Light Intensity]",
                    type: 'wrong',
                    feedback: "You crank up the Directional Light intensity to 50,000 lux. The floor becomes blindingly white, but the metallic statue remains pitch black. Increasing direct light brightness doesn't help if the material relies entirely on reflections that don't exist.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'lighting',
            title: 'Dead End: Lighting Intensity',
            prompt: "Blasting the scene with light didn't fix the black statue; it just ruined the exposure for everything else. The issue isn't a lack of photons, but how the material is handling them.",
            choices: [
                {
                    text: "Action: [Revert and check View Modes]",
                    type: 'correct',
                    feedback: "You revert the light intensity changes and decide to investigate the material and the scene's reflection data.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'lighting',
            title: 'Step 2: Material Inspection',
            prompt: "You open the statue's material instance. You see it has a Metallic value of 1.0 and a Roughness of 0.1 (very shiny). What does this imply for the lighting?",
            choices: [
                {
                    text: "Action: [Realize it needs reflections to be visible]",
                    type: 'correct',
                    feedback: "Correct. A fully metallic object (Metallic=1.0) derives almost all of its visible color from reflected light. If the scene has no reflection data (no captures, no Lumen, no skybox contribution), the object reflects 'nothing', which renders as black.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Change Material to Unlit]",
                    type: 'misguided',
                    feedback: "You switch the Shading Model to Unlit and plug the Base Color into Emissive. The statue is now visible, but it looks like a flat, glowing cartoon sticker. This fixes the visibility but completely destroys the realistic PBR look you need.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'lighting',
            title: 'Dead End: Changing Material',
            prompt: "Making the material Unlit made it visible, but it looks terrible and doesn't react to light anymore. This is not a valid fix for a PBR asset.",
            choices: [
                {
                    text: "Action: [Revert to Lit material]",
                    type: 'correct',
                    feedback: "You switch the material back to Default Lit. The statue returns to being pitch black. You need to fix the environment, not break the material.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'lighting',
            title: 'Step 3: Checking Reflection Captures',
            prompt: "You've confirmed the material is correct (Metallic). Now you look at the scene. You check the World Outliner for any 'SphereReflectionCapture' or 'BoxReflectionCapture' actors. What do you find?",
            choices: [
                {
                    text: "Action: [Check World Outliner for SphereReflectionCapture]",
                    type: 'correct',
                    feedback: "You search the Outliner and find ZERO reflection capture actors. Since Lumen is also disabled in this project (or not supported by your current settings), the engine has no way to calculate reflections. The metal is reflecting a black void.",
                    next: 'step-4'
                },
                {
                    text: "Action: [Add a Skylight]",
                    type: 'partial',
                    feedback: "You add a Skylight. This adds a tiny bit of ambient fill, but without reflection captures to map that sky onto the surface, the highly polished metal still looks wrong and mostly dark. You need localized reflection data.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'lighting',
            title: 'Step 4: The Fix - Adding Reflections',
            prompt: "The scene lacks reflection data. How do you provide the metallic statue with something to reflect?",
            choices: [
                {
                    text: "Action: [Place a Sphere Reflection Capture and Build Reflection Captures]",
                    type: 'correct',
                    feedback: "You drag a Sphere Reflection Capture into the scene, surrounding the statue. You click 'Build Reflection Captures'. Suddenly, the statue 'pops' into existence, reflecting the surrounding room and sky. It looks like real chrome now.",
                    next: 'step-5'
                },
                {
                    text: "Action: [Enable Lumen in Project Settings]",
                    type: 'correct',
                    feedback: "Alternative Fix: You go to Project Settings > Rendering and enable Lumen for Global Illumination and Reflections. After a shader compile, the statue lights up with accurate, real-time reflections of the environment. This also solves the problem.",
                    next: 'step-5'
                }
            ]
        },
        'step-5': {
            skill: 'lighting',
            title: 'Step 5: Verification',
            prompt: "The statue now looks like shiny metal instead of a black void. How do you verify the fix is robust?",
            choices: [
                {
                    text: "Action: [Play in Editor (PIE)]",
                    type: 'correct',
                    feedback: "You jump into the game. The statue continues to look correct. If you used a Reflection Capture, the reflections are static but stable. If you used Lumen, they update dynamically as you move. The asset is fixed.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'lighting',
            title: 'Conclusion',
            prompt: "Lesson: Metallic materials (Metallic=1.0) rely entirely on reflections for their appearance. If an object renders pitch black, check your Reflection Captures or Lumen settings. The engine needs reflection data to know what the metal should look like.",
            choices: []
        }
    }
};