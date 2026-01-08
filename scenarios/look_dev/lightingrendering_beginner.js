window.SCENARIOS['BlackMetallicObject'] = {
    meta: {
        expanded: true,
        title: "Metallic Asset Appears Pitch Black in Dynamic Scene",
        description: "A highly reflective metallic statue appears pitch black despite dynamic lighting. Investigates reflection environments, Lumen settings, and material properties.",
        estimateHours: 1.5,
        category: "Lighting"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'lighting',
            title: 'Initial Observation',
            prompt: "You have placed a highly detailed metallic statue in your level. There is a strong directional light and a skylight, and the floor looks correctly lit. However, the statue itself appears completely pitch black, as if it has no material at all. What do you check first?",
            choices: [
                {
                    text: "Check Output Log or View Modes]",
                    type: 'correct',
                    feedback: "You check the Output Log for shader errors--none found. You switch to 'Lighting Only' mode, and the statue is still black. You switch to 'Reflections' view mode and notice the entire area around the statue is black/empty. This suggests the issue is related to how the object is reflecting its environment.",
                    next: 'step-2'
                },
                {
                    text: "Increase Light Intensity]",
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
                    text: "Revert and check View Modes]",
                    type: 'correct',
                    feedback: "You revert the light intensity changes and decide to investigate the material and the scene's reflection data.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'lighting',
            title: 'Material Inspection',
            prompt: "You open the statue's material instance. You see it has a Metallic value of 1.0 and a Roughness of 0.1 (very shiny). What does this imply for the lighting?",
            choices: [
                {
                    text: "Realize it needs reflections to be visible]",
                    type: 'correct',
                    feedback: "Correct. A fully metallic object (Metallic=1.0) derives almost all of its visible color from reflected light. If the scene has no reflection data (no captures, no Lumen, no skybox contribution), the object reflects 'nothing', which renders as black.",
                    next: 'step-3'
                },
                {
                    text: "Change Material to Unlit]",
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
                    text: "Revert to Lit material]",
                    type: 'correct',
                    feedback: "You switch the material back to Default Lit. The statue returns to being pitch black. You need to fix the environment, not break the material.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'lighting',
            title: 'Checking Reflection Captures',
            prompt: "You've confirmed the material is correct (Metallic). Now you look at the scene. You check the World Outliner for any 'SphereReflectionCapture' or 'BoxReflectionCapture' actors. What do you find?",
            choices: [
                {
                    text: "Check World Outliner for SphereReflectionCapture]",
                    type: 'correct',
                    feedback: "You search the Outliner and find ZERO reflection capture actors. Since Lumen is also disabled in this project (or not supported by your current settings), the engine has no way to calculate reflections. The metal is reflecting a black void.",
                    next: 'step-4'
                },
                {
                    text: "Add a Skylight]",
                    type: 'partial',
                    feedback: "You add a Skylight. This adds a tiny bit of ambient fill, but without reflection captures to map that sky onto the surface, the highly polished metal still looks wrong and mostly dark. You need localized reflection data.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'lighting',
            title: 'The Fix - Adding Reflections',
            prompt: "The scene lacks reflection data. How do you provide the metallic statue with something to reflect?",
            choices: [
                {
                    text: "Place a Sphere Reflection Capture and Build Reflection Captures]",
                    type: 'correct',
                    feedback: "You drag a Sphere Reflection Capture into the scene, surrounding the statue. You click 'Build Reflection Captures'. Suddenly, the statue 'pops' into existence, reflecting the surrounding room and sky. It looks like real chrome now.",
                    next: 'step-5'
                },
                {
                    text: "Enable Lumen in Project Settings]",
                    type: 'correct',
                    feedback: "Alternative Fix: You go to Project Settings > Rendering and enable Lumen for Global Illumination and Reflections. After a shader compile, the statue lights up with accurate, real-time reflections of the environment. This also solves the problem.",
                    next: 'step-5'
                }
            ]
        },
        'step-5': {
            skill: 'lighting',
            title: 'Verification',
            prompt: "The statue now looks like shiny metal instead of a black void. How do you verify the fix is robust?",
            choices: [
                {
                    text: "Play in Editor (PIE)]",
                    type: 'correct',
                    feedback: "You jump into the game. The statue continues to look correct. If you used a Reflection Capture, the reflections are static but stable. If you used Lumen, they update dynamically as you move. The asset is fixed.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'lighting',
            title: 'Deeper Reflection Diagnostics',
            prompt: "You've confirmed the material is metallic and the 'Reflections' view mode shows black. What other diagnostic tools can you use to confirm the lack of reflection data, especially regarding real-time reflection systems?",
            choices: [
                {
                    text: "Use console commands like `showflag.reflections` and `r.Lumen.Reflections`]",
                    type: 'correct',
                    feedback: "You open the console. `showflag.reflections` shows no change, indicating no reflection data is being rendered. `r.Lumen.Reflections` returns '0' or indicates Lumen is disabled, confirming that the engine isn't generating real-time reflections for this scene.",
                    next: 'step-inv-2'
                },
                {
                    text: "Check 'Shader Complexity' view mode]",
                    type: 'wrong',
                    feedback: "You switch to 'Shader Complexity' view mode. This mode helps identify expensive materials but doesn't provide information about the presence or absence of reflection data. The statue still appears black in this context.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'lighting',
            title: 'Dead End: Shader Complexity',
            prompt: "Shader Complexity didn't help. You need to focus on tools that specifically diagnose reflection issues.",
            choices: [
                {
                    text: "Revert and use console commands]",
                    type: 'correct',
                    feedback: "You revert your view mode and decide to use console commands to get direct feedback on reflection systems.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'lighting',
            title: 'Project Settings for Reflection Systems',
            prompt: "The console commands suggest reflection systems like Lumen might be inactive. Where would you check to ensure these global rendering features are enabled for your project?",
            choices: [
                {
                    text: "Go to Project Settings > Rendering and check Lumen/Ray Tracing settings]",
                    type: 'correct',
                    feedback: "You navigate to Project Settings > Rendering. Under the 'Global Illumination' and 'Reflections' sections, you find that 'Lumen Global Illumination' and 'Lumen Reflections' are indeed disabled. This is a primary reason for the lack of dynamic reflections.",
                    next: 'step-red-1'
                },
                {
                    text: "Check the Post Process Volume settings]",
                    type: 'misguided',
                    feedback: "You check the Post Process Volume. While a PPV can override or fine-tune Lumen settings, it's crucial to first ensure Lumen is enabled at the project level. If it's disabled globally, the PPV won't activate it.",
                    next: 'step-inv-2M'
                },
            ]
        },

        'step-inv-2M': {
            skill: 'lighting',
            title: 'Dead End: Post Process Volume (Premature)',
            prompt: "Checking the Post Process Volume before Project Settings was premature. You need to confirm the global settings first.",
            choices: [
                {
                    text: "Go to Project Settings > Rendering]",
                    type: 'correct',
                    feedback: "You realize the global settings are more fundamental and proceed to Project Settings.",
                    next: 'step-red-1'
                },
            ]
        },

        'step-red-1': {
            skill: 'material',
            title: 'Red Herring: Faking Reflections with a Cubemap',
            prompt: "Frustrated by the lack of reflections, you consider a quick hack: importing a static cubemap texture and plugging it directly into the material's Emissive or Base Color to simulate reflections.",
            choices: [
                {
                    text: "Realize this is a hack and won't provide accurate PBR reflections]",
                    type: 'correct',
                    feedback: "You pause and realize that plugging a static cubemap directly into the material would bake a non-dynamic, non-PBR reflection onto the object. It would look fake and wouldn't react to the scene's lighting or camera movement. This isn't a proper solution for a metallic material.",
                    next: 'step-3'
                },
                {
                    text: "Plug a static cubemap into the material's Base Color]",
                    type: 'wrong',
                    feedback: "You plug a static cubemap into the Base Color. The statue now displays the cubemap as a texture, looking like a flat, textured box, not a reflective metallic object. This completely breaks the PBR material.",
                    next: 'step-red-1W'
                },
            ]
        },

        'step-red-1W': {
            skill: 'material',
            title: 'Dead End: Faked Reflections',
            prompt: "Your attempt to fake reflections made the statue look worse and completely broke its PBR properties. You need a proper solution for reflections.",
            choices: [
                {
                    text: "Revert material changes and focus on environment reflections]",
                    type: 'correct',
                    feedback: "You revert the material changes, understanding that the issue lies with the environment's reflection data, not the material itself.",
                    next: 'step-3'
                },
            ]
        },

        'step-ver-1': {
            skill: 'testing',
            title: 'Standalone Game Verification',
            prompt: "The statue now looks correct in the editor and in Play In Editor (PIE). To ensure the fix is robust for a deployed game, what's the next crucial testing step?",
            choices: [
                {
                    text: "Launch the game in Standalone Game mode]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone Game mode. The statue renders perfectly, with accurate reflections. This confirms the fix is stable outside of the editor's PIE environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Package the game and test on another machine]",
                    type: 'misguided',
                    feedback: "While packaging is a final verification step, launching in Standalone Game mode is a quicker way to catch potential deployment-related issues without the overhead of a full package. It's a good intermediate step.",
                    next: 'step-ver-1M'
                },
            ]
        },

        'step-ver-1M': {
            skill: 'testing',
            title: 'Dead End: Premature Packaging',
            prompt: "Packaging the game is a big step. It's better to verify in Standalone Game mode first for quicker iteration.",
            choices: [
                {
                    text: "Launch in Standalone Game mode]",
                    type: 'correct',
                    feedback: "You decide to test in Standalone Game mode first for a faster verification cycle.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'performance',
            title: 'Performance Impact Assessment',
            prompt: "You've successfully fixed the visual issue. However, enabling Lumen or adding reflection captures can have a performance cost. How do you assess the impact of your solution on the game's performance?",
            choices: [
                {
                    text: "Use console commands like `stat unit` and `stat gpu`]",
                    type: 'correct',
                    feedback: "You open the console and type `stat unit` to check overall frame time, and `stat gpu` for a detailed breakdown of GPU costs. You observe the impact of Lumen/Reflection Captures on rendering time and confirm that the performance remains within acceptable limits for your project.",
                    next: 'conclusion-perf'
                },
                {
                    text: "Assume it's fine since it looks good]",
                    type: 'wrong',
                    feedback: "Assuming performance is acceptable without verification is risky. Visual quality doesn't always correlate with optimal performance, especially with demanding rendering features.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'performance',
            title: 'Dead End: Ignoring Performance',
            prompt: "Ignoring performance can lead to major issues later. You need to verify the impact.",
            choices: [
                {
                    text: "Use console commands to check performance]",
                    type: 'correct',
                    feedback: "You decide to use the appropriate console commands to assess the performance impact of your changes.",
                    next: 'conclusion-perf'
                },
            ]
        },

        'conclusion-perf': {
            skill: 'performance',
            title: 'Conclusion: Performance Considered',
            prompt: "You've not only fixed the visual bug but also verified its performance impact. This completes the debugging workflow.",
            choices: [
            ]
        },
                }
            ]
        },
        










        'conclusion-perf': {
            skill: 'performance',
            title: 'Conclusion: Performance Considered',
            prompt: "You've not only fixed the visual bug but also verified its performance impact. This completes the debugging workflow.",
            choices: [
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