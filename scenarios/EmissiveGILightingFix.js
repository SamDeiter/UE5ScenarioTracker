window.SCENARIOS['EmissiveGILightingFix'] = {
    "meta": {
        "title": "Missing Lumen Global Illumination from Emissive Materials",
        "description": "The scene contains several custom meshes textured with a powerful emissive material (acting as futuristic wall lights). While the materials themselves glow brightly when viewed directly, they cast absolutely no dynamic light or bounce light onto nearby static geometry, even though Lumen Global Illumination is enabled. If the primary Directional Light is disabled, the level becomes completely dark, proving the emissive sources are not being registered as light contributors. The intent is for the emissive material to provide soft, dynamic indirect lighting.",
        "estimateHours": 1.75,
        "category": "Lighting & Rendering"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "lightingrendering",
            "title": "Step 1",
            "prompt": "<p>The scene's emissive wall lights glow, but cast no dynamic bounce light. You suspect a high-level configuration issue. What's your first move?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open Project Settings (Edit > Project Settings).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Good call. Project Settings is the right place to begin verifying core rendering configurations.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Open the Material Editor for M_NeonStrip to check its properties.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.10hrs. While material properties are crucial, it's inefficient to dive into specific assets before verifying project-wide settings. You might fix a material property, only to find Lumen itself isn't enabled.</p>",
                    "next": "step-1W-A"
                },
                {
                    "text": "<p>Press F11 to launch the profiler and look for GPU bottlenecks.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. The problem is a lack of GI, not necessarily a performance issue yet. Profiling now would be premature and wouldn't directly point to the configuration problem.</p>",
                    "next": "step-1W-B"
                },
                {
                    "text": "<p>Open World Settings and check for 'Global Illumination' options there.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.07hrs. World Settings does have some GI options, but the fundamental Lumen method and setup are primarily in Project Settings. You'd likely be redirected here anyway.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "lightingrendering",
            "title": "Step 2",
            "prompt": "<p>In Project Settings, you need to find the global illumination method. Where do you navigate to?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Navigate to the 'Rendering' category on the left sidebar.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. Correct. The 'Rendering' section houses most global lighting and rendering pipeline settings.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Search for 'Global Illumination' directly in the search bar.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.03hrs. While this can work, it's often better to navigate to the category first for context and to see related settings you might otherwise miss.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Navigate to the 'Engine' category, then 'General Settings'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The 'Engine' category contains core engine settings, but rendering options are specifically within the 'Rendering' category.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Go to 'Platforms' and check 'Windows' settings for DirectX versions.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.10hrs. This is unrelated to how emissive materials contribute to global illumination and concerns platform-specific rendering APIs.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "lightingrendering",
            "title": "Step 3",
            "prompt": "<p>You are in Project Settings > Rendering. What's the first critical setting to confirm for Lumen GI?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Under 'Dynamic Global Illumination', confirm 'Dynamic Global Illumination Method' is set to 'Lumen'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Essential. If Lumen isn't enabled here, no other Lumen-specific settings will matter.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Confirm 'Ray Tracing' is enabled under 'Hardware Ray Tracing'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.08hrs. While Ray Tracing can enhance Lumen, Lumen can function with Software Ray Tracing. This is not the primary check for *enabling* Lumen GI.</p>",
                    "next": "step-3W-A"
                },
                {
                    "text": "<p>Set 'Default Post Process Volume' to an infinite volume.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.12hrs. This is a level-specific setting for post-processing effects, not the global GI method configuration in Project Settings.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Ensure 'Generate Mesh Distance Fields' is enabled.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.07hrs. Mesh Distance Fields are required for Lumen, but checking the GI method itself is a more direct first step for enabling Lumen.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "lightingrendering",
            "title": "Step 4",
            "prompt": "<p>Still in Project Settings > Rendering, what's the next key setting related to Lumen and reflections you should verify?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Under 'Reflections', confirm 'Reflection Method' is set to 'Lumen'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Correct. Lumen handles both GI and reflections, so ensuring it's the active method for reflections is important for a unified lighting solution.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Change 'Ray Tracing' to 'Enabled' under 'Hardware Ray Tracing' if it's not already.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.15hrs. This is redundant if 'Dynamic Global Illumination Method' and 'Reflection Method' are already set to Lumen and Hardware Ray Tracing is configured for Lumen. You're diving into an optimization before confirming the base setup.</p>",
                    "next": "step-4W-A"
                },
                {
                    "text": "<p>Under 'Optimizations', disable 'Use Precomputed Visibility'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.20hrs. Precomputed Visibility is for performance optimization of baked lighting, not related to Lumen's dynamic GI and reflections.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Increase 'Max Lumen Reflections Bounces' to 3.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.10hrs. This is a quality setting, not an enabling setting. If reflections aren't working at all, adjusting bounces won't help.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "lightingrendering",
            "title": "Step 5",
            "prompt": "<p>You've confirmed Lumen is set up project-wide. Now you need to check the emissive material itself. What's your next action?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate and open the emissive material instance (e.g., M_NeonStrip) in the Content Browser.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Good. With project settings verified, the material is the next logical place to investigate the emissive properties.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Select the Static Mesh Actor (SM_WallLight) in the level viewport and open its details panel.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.08hrs. While the mesh is important, the material defines its emissive properties. You need to inspect the material first.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Add a Sphere Reflection Capture near the emissive object.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Sphere Reflection Captures are for baked reflections, not dynamic Lumen reflections or global illumination contribution from emissive sources.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Use the 'Go to Material' option on the mesh in the level.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This works but assumes you've already found the mesh in the level. Directly finding the material in the Content Browser is often more direct if you know its name.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "lightingrendering",
            "title": "Step 6",
            "prompt": "<p>The emissive material M_NeonStrip is open. What's the first property you should check to ensure it supports standard lighting and GI?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Material Details panel (left side), check the 'Shading Model' property.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Correct. The Shading Model dictates how a material interacts with light, including GI contribution.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Check the 'Blend Mode' property in the Material Details panel.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.07hrs. Blend Mode is important for transparency, but Shading Model is more fundamental for how light interacts with the surface itself.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Inspect the texture sampler nodes in the material graph for correct UVs.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.12hrs. Incorrect UVs can cause visual artifacts, but they don't prevent the material from contributing to GI altogether. This is too specific too early.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Look for a custom 'Emissive GI' node in the material graph.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Lumen's emissive GI is generally controlled by standard properties, not a specific custom node. Searching for one is a misdirection.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "lightingrendering",
            "title": "Step 7",
            "prompt": "<p>You're checking the Shading Model. What specific setting is required for emissive GI contribution with Lumen?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Confirm 'Shading Model' is set to 'Default Lit'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Crucial. Only 'Default Lit' (or certain custom lit models) fully supports Lumen GI and emissive contribution.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Change 'Shading Model' to 'Unlit'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.20hrs. 'Unlit' materials do not interact with lighting and will never contribute to GI, directly exacerbating the problem. This is a common mistake.</p>",
                    "next": "step-7W-A"
                },
                {
                    "text": "<p>Ensure 'Shading Model' is set to 'Clear Coat'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.10hrs. While 'Clear Coat' is a lit model, 'Default Lit' is the standard and most compatible for general emissive GI. Clear Coat adds complexity not needed here.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Verify 'Shading Model' is 'Two Sided Lit'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Two Sided Lit' is a variation of Default Lit. While it might work, 'Default Lit' is the fundamental requirement. This is not the primary check.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "lightingrendering",
            "title": "Step 8",
            "prompt": "<p>The Shading Model is correct. What's the next material property category to check for emissive GI configuration?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Material Details panel, navigate to the 'Lighting' category.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Correct. The 'Lighting' category specifically contains settings for how the material interacts with various lighting systems.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Search for 'GI' in the Material Details search bar.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This might find some settings, but navigating to the 'Lighting' category gives you a better overview of related options.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Look in the 'Usage' category for relevant checkboxes.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.08hrs. The 'Usage' category is for how the material can be used (e.g., as a UI material), not for its lighting contribution properties.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Open the material graph and check for a 'Lightmass Emissive' node.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. 'Lightmass Emissive' is for baked static lighting and irrelevant to Lumen's dynamic GI system.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "lightingrendering",
            "title": "Step 9",
            "prompt": "<p>Under the 'Lighting' category in the material, what specific checkbox must be enabled for emissive materials to contribute to dynamic GI?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Ensure 'Use Emissive for Dynamic Area Lighting' is checked.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This is a critical setting for Lumen. Without it, the emissive component will not be considered a light source for dynamic GI.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Enable 'Cast Ray Traced Shadows' for the material.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.10hrs. Materials themselves don't cast shadows; mesh components do. This setting is irrelevant here.</p>",
                    "next": "step-9W-A"
                },
                {
                    "text": "<p>Check 'Two Sided' to ensure light can pass through both sides.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.07hrs. 'Two Sided' affects how light interacts with the material's normals, not whether it contributes to GI.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Increase 'Diffuse Boost' under 'Reflectance'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.08hrs. 'Diffuse Boost' relates to light scattering, not specifically enabling emissive contribution to GI.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "lightingrendering",
            "title": "Step 10",
            "prompt": "<p>You've enabled the emissive contribution flag. Now, visually inspect the material graph. What should you verify regarding the emissive output?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify the Emissive color intensity in the material graph, specifically how it's connected to the 'Emissive Color' output.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.04hrs. Correct. Even with the flag enabled, the actual emissive strength and connection in the graph are vital for visible GI.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Check the roughness map for black values, assuming it's too rough.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.10hrs. Roughness affects reflections and specularity, not the primary emissive GI contribution. This is a misdirection.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Ensure the 'Base Color' output is connected to a texture.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.07hrs. Base Color defines the surface color, not its emissive properties. This is irrelevant to the problem.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Check for 'World Position Offset' nodes, assuming geometry issues.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.08hrs. World Position Offset affects vertex position, not directly how emissive light contributes to GI.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "lightingrendering",
            "title": "Step 11",
            "prompt": "<p>You're checking the emissive color output. What's the final detail to confirm for effective GI contribution?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Confirm the emissive output is sufficiently high (e.g., connected to a multiplier node with a value > 50) and directly wired to 'Emissive Color'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Absolutely. An emissive value too low won't produce noticeable GI, even if everything else is correctly configured.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Add a 'Scalar Parameter' for Emissive Strength and set its default to 1.0.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.10hrs. Setting it to 1.0 is often too low for effective GI. The issue is insufficient intensity, not the parameter type.</p>",
                    "next": "step-11W-A"
                },
                {
                    "text": "<p>Disconnect any 'Normal Map' nodes to see if that improves GI.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Normal maps define surface detail and are unrelated to the emissive light output. Disconnecting them would likely worsen visual quality.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Connect a 'Constant3Vector' of pure white (1,1,1) directly to 'Emissive Color'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.08hrs. This would provide an emissive color but likely still not enough intensity for noticeable GI. You need a multiplier.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "lightingrendering",
            "title": "Step 12",
            "prompt": "<p>The material itself seems configured correctly. Now, shift your focus to the object in the level. What's the next step?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select the Static Mesh Actor (SM_WallLight) in the level viewport.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Correct. Now that the material is good, checking the mesh's properties in the level is the next logical step.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Open the Static Mesh Editor for SM_WallLight.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.07hrs. The Static Mesh Editor is for mesh properties like UVs or collision. While relevant later, you should first check component properties directly in the level's Details panel.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Right-click on the emissive material in the Content Browser and select 'Find References'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.10hrs. Finding references won't help diagnose why the *selected actor* isn't casting GI. You need to interact with the actor in the level.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Adjust the Sky Light intensity in the World Outliner.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The Sky Light affects ambient GI, not directly the contribution from emissive meshes. This is an unrelated adjustment.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "lightingrendering",
            "title": "Step 13",
            "prompt": "<p>You've selected SM_WallLight in the viewport. Where in the Details panel should you look for relevant lighting properties for the mesh component?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Details panel, select the 'Static Mesh' component (if it's not already selected).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Correct. Most actor-specific lighting properties are found on its components, not the actor root itself.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Search for 'Lighting' in the 'Actor' section of the Details panel.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While some lighting settings are actor-wide, component-specific settings are often more granular and critical. This might miss important options.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Open the Blueprints menu to inspect the actor's custom logic.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.10hrs. This issue is about fundamental rendering properties, not Blueprint logic. Looking in Blueprints is a misdirection.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Check the 'Transform' section for scaling issues.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.07hrs. Transform settings deal with position, rotation, and scale, which might affect GI visually but not its fundamental contribution enablement.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "lightingrendering",
            "title": "Step 14",
            "prompt": "<p>With the Static Mesh component selected, what common lighting property should you check to ensure it's not preventing GI contribution?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Search for 'Lighting' in the Details panel and ensure 'Cast Shadows' is checked for the component.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.07hrs. Lumen GI often relies on proper shadow casting for accurate light bouncing. Disabling shadows can prevent it from contributing effectively.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Disable 'Affect Dynamic Indirect Lighting' to isolate the issue.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. This would directly disable the effect you're trying to achieve, making the problem worse.</p>",
                    "next": "step-14W-A"
                },
                {
                    "text": "<p>Increase 'Bounds Scale' for the static mesh component.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.10hrs. Bounds Scale affects the collision and rendering bounds, not the direct light contribution properties.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Check 'Affects World' to ensure the component is visible in the scene.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. If 'Affects World' was unchecked, you wouldn't see the glowing mesh either. This is unlikely to be the specific GI issue.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "lightingrendering",
            "title": "Step 15",
            "prompt": "<p>Actor and material settings seem fine. Now you need to check the Post Process Volume for global GI overrides. Where do you find it?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate the Post Process Volume in the level (World Outliner or add a new infinite one).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Correct. Post Process Volumes are where global rendering overrides, including GI, are typically configured for a given area or the entire scene.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Open the 'Level Blueprint' to check if GI settings are being overridden by script.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.10hrs. While possible, checking the actual PPV properties is a more direct and common troubleshooting step than looking for Blueprint overrides.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Go to 'Project Settings' and search for 'Post Process Volume Defaults'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Default PPV settings are less likely to be the issue than an active PPV in the level with incorrect overrides.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Search for 'Global Illumination' in the World Settings panel.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.08hrs. World Settings has some basic GI, but detailed Lumen overrides are primarily found in Post Process Volumes.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "lightingrendering",
            "title": "Step 16",
            "prompt": "<p>You've selected the Post Process Volume. What's the immediate step to enable its GI settings?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Details panel, enable the 'Global Illumination' category override (by checking the main box next to its name).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Correct. PPVs only apply settings that have their override checkboxes enabled. This makes sure the GI section is active.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Immediately set 'Method' to 'Lumen' without enabling the category override.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While you'd do this next, without enabling the category override, your change might not take effect, leading to confusion.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Increase 'Exposure Compensation' to brighten the scene.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.10hrs. Exposure only adjusts the camera's response to light, not the actual light contribution from emissives. This would just make a dark scene brighter, not solve the GI issue.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Look for 'Light Propagation Volume' settings in the PPV.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.08hrs. Light Propagation Volume is an older, deprecated GI method and is not related to Lumen.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "lightingrendering",
            "title": "Step 17",
            "prompt": "<p>With Global Illumination overridden in the PPV, what specific setting must be configured for Lumen?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Under the 'Global Illumination' category, ensure 'Method' is explicitly set to 'Lumen'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Essential. This explicitly tells the Post Process Volume to use Lumen for Global Illumination, overriding any default or other settings.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Set 'Ray Tracing' method to 'Enabled' under the 'Ray Tracing' category.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.10hrs. While related, this is a separate category for general ray tracing. The 'Global Illumination' method needs to be Lumen specifically.</p>",
                    "next": "step-17W-A"
                },
                {
                    "text": "<p>Disable the 'Auto Exposure' setting.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Auto Exposure controls camera brightness, not the GI system itself. Disabling it won't solve the lack of emissive GI.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Increase 'GI Diffuse Boost' to a high value.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.07hrs. This is a multiplier for diffuse GI, but if Lumen isn't the active method, this setting will have no effect or an unintended one.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "lightingrendering",
            "title": "Step 18",
            "prompt": "<p>Lumen is set as the GI method in the PPV. Now, you need to find Lumen-specific parameters to adjust emissive contribution. Where do you look?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Expand the 'Lumen' sub-category under 'Global Illumination' in the PPV Details panel.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Correct. Lumen has its own dedicated set of parameters within the GI section of the Post Process Volume.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Search for 'Emissive' in the overall PPV search bar.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This might work, but expanding the category gives better context and shows related parameters you might want to adjust later.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Look in the 'Screen Space Global Illumination' category.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.08hrs. Screen Space GI is a different and less robust GI method than Lumen. Adjusting its settings won't impact Lumen.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Open the 'Lumen Overview' viewport mode to visualize Lumen probes.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.12hrs. While useful for debugging, you need to adjust settings first, not just visualize them. This is a diagnostic step, not a configuration one.</p>",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "lightingrendering",
            "title": "Step 19",
            "prompt": "<p>Under Lumen in the PPV, what specific slider controls how much emissive materials contribute light?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Check 'Emissive Light Contribution' slider and set to 1.0 or higher.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.08hrs. Crucial. This slider directly controls the strength of emissive light injected into the Lumen GI system. A value of 0 would mean no contribution.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Increase 'Lumen Scene Lighting: Intensity' to boost overall Lumen light.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. While this generally boosts Lumen, 'Emissive Light Contribution' is the direct control for emissive sources. This could mask the specific issue.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Adjust 'Reflections: Max Roughness' to allow more blurry reflections.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.20hrs. This parameter affects reflection quality and roughness, not the emissive light contribution to GI. It's an unrelated setting.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Set 'Lumen Scene Lighting: Final Gather Quality' to a very low value (e.g., 0.1).</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.12hrs. This would decrease the quality of the GI, making it harder to discern if emissive lights are contributing at all. You need to enable contribution first.</p>",
                    "next": "step-19"
                }
            ]
        },
        "step-20": {
            "skill": "lightingrendering",
            "title": "Step 20",
            "prompt": "<p>You've set Emissive Light Contribution. What's another Lumen quality setting in the PPV that impacts the visual quality of indirect lighting and could make emissive GI more apparent?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Confirm 'Final Gather Quality' is set to a reasonable value (e.g., 2.0-3.0).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.06hrs. Good. Final Gather Quality improves the fidelity of indirect light bounces, making emissive GI more noticeable and accurate.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Enable 'Screen Traces' for reflections.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.12hrs. Screen Traces are for reflections, not direct GI quality from Lumen. This wouldn't impact the emissive GI contribution itself.</p>",
                    "next": "step-20W-A"
                },
                {
                    "text": "<p>Set 'Lumen Scene Lighting: Max Trace Distance' to a very low value.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.18hrs. This would limit how far Lumen traces light, potentially making emissive GI less visible, especially for larger scenes.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Increase 'Diffuse Bounces' to 10 for more accurate indirect lighting.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.09hrs. While higher bounces improve quality, if the base GI isn't showing, simply increasing bounces won't fix it and could be very performance-heavy.</p>",
                    "next": "step-20"
                }
            ]
        },
        "step-21": {
            "skill": "lightingrendering",
            "title": "Step 21",
            "prompt": "<p>Post-process settings are configured. You suspect the static mesh geometry itself might be problematic for Lumen. What's the next step?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Static Mesh Editor for SM_WallLight (double-click the asset in Content Browser or from actor details).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Correct. The Static Mesh Editor allows inspection of the mesh's geometric properties, including UVs, which are crucial for lighting.</p>",
                    "next": "step-22"
                },
                {
                    "text": "<p>Rebuild all lighting via 'Build > Build Lighting Only'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.10hrs. Lumen is a dynamic GI system and does not rely on baked static lighting. This action is irrelevant and wastes time.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Export the mesh to a 3D modeling software to check its normals.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.20hrs. While external software is valid for complex issues, Unreal's Static Mesh Editor can usually show normal issues. This is an overreaction and too time-consuming.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Check the 'Collision Complexity' in the mesh's details panel.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.08hrs. Collision settings are for physics, not directly related to how emissive materials interact with GI.</p>",
                    "next": "step-21"
                }
            ]
        },
        "step-22": {
            "skill": "lightingrendering",
            "title": "Step 22",
            "prompt": "<p>Inside the Static Mesh Editor, what specific mesh property related to lighting should you inspect for common Lumen issues?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Inspect UV Channel 0 for appropriate unwrapping without overlaps, especially on the emissive parts.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.10hrs. Correct. Lumen relies on UV0 for some of its computations (like surface cache generation). Overlapping or poorly unwrapped UVs can cause artifacts or incorrect GI contribution.</p>",
                    "next": "step-23"
                },
                {
                    "text": "<p>Check UV Channel 1 for the lightmap UVs.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. UV Channel 1 (or higher) is typically used for static lightmaps, which are not relevant for Lumen's dynamic GI system.</p>",
                    "next": "step-22"
                },
                {
                    "text": "<p>Verify the 'Min LOD' setting is 0.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.12hrs. LODs affect mesh detail at distance, but shouldn't prevent GI contribution from the base mesh at close range.</p>",
                    "next": "step-22"
                },
                {
                    "text": "<p>Increase 'Screen Size' for the static mesh to improve rendering quality.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.07hrs. Screen size relates to streaming and LODs, not the fundamental UV layout required for GI.</p>",
                    "next": "step-22"
                }
            ]
        },
        "step-23": {
            "skill": "lightingrendering",
            "title": "Step 23",
            "prompt": "<p>You've checked the mesh UVs and they seem acceptable. You need to re-select the mesh in the level to check runtime properties. What's your action?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select SM_WallLight component in the level viewport again.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Correct. You need to ensure the correct component is selected to inspect its runtime properties in the Details panel.</p>",
                    "next": "step-24"
                },
                {
                    "text": "<p>Go to 'Window > Details' to open a new Details panel.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While technically correct if the panel was closed, the more direct action is simply selecting the object if the panel is already open.</p>",
                    "next": "step-23"
                },
                {
                    "text": "<p>Open the console and type 'obj list SM_WallLight' to check its properties.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.10hrs. Console commands are usually for runtime debugging or specific variables, not for easily viewing general actor/component properties.</p>",
                    "next": "step-23"
                },
                {
                    "text": "<p>Save the Static Mesh asset and close the editor.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. You need to continue debugging in the editor. Saving and closing now would halt progress.</p>",
                    "next": "step-23"
                }
            ]
        },
        "step-24": {
            "skill": "lightingrendering",
            "title": "Step 24",
            "prompt": "<p>With SM_WallLight selected in the level, what component-specific Lumen setting might be overriding the material's emissive strength?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Details panel, under 'Lumen', adjust 'Emissive Light Source: Scale' property to 1.0 or higher.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.07hrs. This per-component setting acts as an additional multiplier for emissive light, crucial if the material's output isn't strong enough or needs local boosting.</p>",
                    "next": "step-25"
                },
                {
                    "text": "<p>Change 'Can Character Step Up On' to 'No'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. This is a collision property for character movement, completely unrelated to emissive light contribution.</p>",
                    "next": "step-24W-A"
                },
                {
                    "text": "<p>Set 'Dynamic Shadow Distance' to a higher value.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.10hrs. This affects shadow quality and distance, not the emissive light's strength or its contribution to GI.</p>",
                    "next": "step-24"
                },
                {
                    "text": "<p>Set 'Emissive Light Source: Max Range' to a very low value.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This would limit the range of emissive light, potentially making the GI less noticeable, the opposite of the desired effect.</p>",
                    "next": "step-24"
                }
            ]
        },
        "step-25": {
            "skill": "lightingrendering",
            "title": "Step 25",
            "prompt": "<p>Most editor settings are checked. You now suspect a deeper rendering pipeline configuration. Where do you go to confirm Lumen's ray tracing method?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Search Project Settings (Rendering category) for 'Lumen Global Illumination'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.04hrs. Correct. Project Settings contains global Lumen configuration, including how it uses ray tracing.</p>",
                    "next": "step-26"
                },
                {
                    "text": "<p>Open the Engine.ini file in a text editor to check for Lumen variables.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Directly editing config files is risky and should be a last resort. Most settings are exposed in Project Settings.</p>",
                    "next": "step-25"
                },
                {
                    "text": "<p>Check the Post Process Volume for a 'Ray Tracing' category.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.10hrs. While PPVs have ray tracing *overrides*, the core enabling/disabling of the method is in Project Settings.</p>",
                    "next": "step-25"
                },
                {
                    "text": "<p>Search Project Settings for 'Ray Tracing' instead of 'Lumen Global Illumination'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.08hrs. While 'Ray Tracing' is related, searching for 'Lumen Global Illumination' will bring up more specific and relevant Lumen settings.</p>",
                    "next": "step-25"
                }
            ]
        },
        "step-26": {
            "skill": "lightingrendering",
            "title": "Step 26",
            "prompt": "<p>You're in Project Settings > Rendering, looking at 'Lumen Global Illumination' settings. What's the primary hardware ray tracing setting to verify for optimal Lumen performance and quality?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Under 'Lumen Global Illumination', ensure 'Hardware Ray Tracing' is 'Enabled' or 'Support GI and Reflections'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.07hrs. Correct. Hardware Ray Tracing greatly enhances Lumen's accuracy and performance. If it's disabled, Lumen defaults to a software fallback which might have limitations.</p>",
                    "next": "step-27"
                },
                {
                    "text": "<p>Disable 'Generate Mesh Distance Fields' to see if it fixes the issue.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Mesh Distance Fields are a core requirement for Lumen, especially for software ray tracing fallback. Disabling them would break Lumen.</p>",
                    "next": "step-26"
                },
                {
                    "text": "<p>Set 'Hardware Ray Tracing' to 'Disabled' to force software tracing.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.12hrs. If hardware is available, disabling it would reduce quality and might introduce new issues or simply confirm software tracing works, but not solve the emissive GI problem.</p>",
                    "next": "step-26"
                },
                {
                    "text": "<p>Check 'Support Ray Tracing' under 'Ray Tracing' category, not specific to Lumen.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.10hrs. While 'Support Ray Tracing' is a global toggle, the 'Lumen Global Illumination' section has the more specific setting for Lumen's usage of it.</p>",
                    "next": "step-26"
                }
            ]
        },
        "step-27": {
            "skill": "lightingrendering",
            "title": "Step 27",
            "prompt": "<p>If Hardware Ray Tracing is NOT enabled (or your hardware doesn't support it), what crucial software ray tracing setting in Project Settings needs verification for Lumen GI?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>If using Software Ray Tracing, ensure 'Software Ray Tracing Mode' is 'Global'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.07hrs. Important. 'Global' mode ensures Lumen can trace against all meshes, which is vital for comprehensive GI. Other modes might limit coverage.</p>",
                    "next": "step-28"
                },
                {
                    "text": "<p>Set 'Software Ray Tracing Mode' to 'Detail' for higher fidelity.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.12hrs. 'Detail' mode might be more performant but can miss GI contributions from larger or more distant objects, counteracting your goal.</p>",
                    "next": "step-27"
                },
                {
                    "text": "<p>Enable 'Ray Traced Shadows' in the Directional Light settings.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. This is a setting for direct light shadows, not the software ray tracing mode for Lumen GI.</p>",
                    "next": "step-27"
                },
                {
                    "text": "<p>Increase 'Software Ray Tracing Max Distance' to a very high value.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.10hrs. While a higher value might be needed, 'Global' mode is the first and most critical setting to confirm for broad coverage before adjusting distances.</p>",
                    "next": "step-27"
                }
            ]
        },
        "step-28": {
            "skill": "lightingrendering",
            "title": "Step 28",
            "prompt": "<p>You've checked most editor settings. You suspect a console variable might be overriding Lumen's emissive behavior. How do you check this?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the console by pressing the tilde (~) key.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. Correct. The console is the primary interface for checking and setting engine console variables at runtime.</p>",
                    "next": "step-29"
                },
                {
                    "text": "<p>Open the Output Log window to check for rendering errors.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While the Output Log is useful for errors, it doesn't allow you to query or modify console variables directly.</p>",
                    "next": "step-28W-A"
                },
                {
                    "text": "<p>Go to 'Project Settings' and search for 'Console Variables'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.10hrs. Project settings might show some persistent console variables, but for live querying and setting, the in-editor console is faster and more immediate.</p>",
                    "next": "step-28"
                },
                {
                    "text": "<p>Open the Windows Command Prompt and type 'UE5 console'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.20hrs. This is an external system unrelated to the in-editor Unreal Engine console.</p>",
                    "next": "step-28"
                }
            ]
        },
        "step-29": {
            "skill": "lightingrendering",
            "title": "Step 29",
            "prompt": "<p>The console is open. What command checks if Lumen is considering emissive materials as light sources?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Type 'r.Lumen.EmissiveRadiance 1' (or 'r.Lumen.EmissiveRadiance ?') to verify it's enabled.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.04hrs. This console variable directly controls whether Lumen processes emissive materials for GI. It should be 1.</p>",
                    "next": "step-30"
                },
                {
                    "text": "<p>Type 'show LumenScene' to visualize Lumen's internal representation.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.08hrs. While useful for visualization, this doesn't directly tell you if emissive *contribution* is enabled via a CVar. You need to check the CVar itself first.</p>",
                    "next": "step-29"
                },
                {
                    "text": "<p>Type 'stat gpu' to check graphics card performance.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.12hrs. Performance stats are irrelevant to checking a specific Lumen emissive GI CVar. This is a diagnostic for a different problem.</p>",
                    "next": "step-29"
                },
                {
                    "text": "<p>Type 'r.Lumen.Reflections.Emissive 1' to enable emissive reflections.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.06hrs. This CVar is for emissive *reflections*, not the primary emissive *radiance* for GI. It's related but not the core GI setting.</p>",
                    "next": "step-29"
                }
            ]
        },
        "step-30": {
            "skill": "lightingrendering",
            "title": "Step 30",
            "prompt": "<p>You've confirmed 'r.Lumen.EmissiveRadiance' is enabled. What console command verifies if the emissive light source surface cache is enabled and sufficient?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Type 'r.Lumen.EmissiveLightSourceSurfaceCacheResolution 1' (or '?') and ensure it's not 0.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This CVar controls the resolution of the surface cache used for emissive lights, which directly impacts their visibility and quality in Lumen.</p>",
                    "next": "step-31"
                },
                {
                    "text": "<p>Type 'r.Lumen.GI.EmissiveLightMultiplier 1' to boost emissive GI.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.10hrs. While this sounds correct, the actual CVar is `r.Lumen.EmissiveRadiance`, and other multipliers are in PPV or material. This is an incorrect CVar name.</p>",
                    "next": "step-30"
                },
                {
                    "text": "<p>Type 'showflag.Lumen 0' to disable Lumen and see the difference.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Disabling Lumen won't help diagnose why emissive GI isn't working *within* Lumen; you need to investigate Lumen's internal settings.</p>",
                    "next": "step-30"
                },
                {
                    "text": "<p>Type 'r.Lumen.HardwareRayTracing 1' to force hardware ray tracing.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.08hrs. This is for hardware ray tracing, not the emissive surface cache. You already checked hardware ray tracing in Project Settings.</p>",
                    "next": "step-30"
                }
            ]
        },
        "step-31": {
            "skill": "lightingrendering",
            "title": "Step 31",
            "prompt": "<p>After all these checks, you still see no emissive GI. It's possible a Material Instance is overriding a critical setting. What do you check next?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Check the Material Instance (if one is applied) used on the mesh, ensuring no relevant emissive parameters are overridden to zero or disabled.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.08hrs. Correct. Material Instances can override parent material properties, potentially nullifying all your previous base material checks. This is a common oversight.</p>",
                    "next": "step-32"
                },
                {
                    "text": "<p>Delete and re-apply the material to the mesh.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. While this might reset some properties, it won't tell you *what* was wrong. Understanding the override is key.</p>",
                    "next": "step-31W-A"
                },
                {
                    "text": "<p>Change the material's 'Subsurface Profile' to another one.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.20hrs. Subsurface scattering is for translucent effects on skin/wax, entirely unrelated to general emissive GI contribution.</p>",
                    "next": "step-31"
                },
                {
                    "text": "<p>Quickly scan Material Instance parameters without specific focus on emissive multipliers or color overrides.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.10hrs. A generic scan might miss the specific parameter (like an Emissive Multiplier) that was accidentally set back to zero, leading to a missed diagnosis.</p>",
                    "next": "step-31"
                }
            ]
        },
        "step-32": {
            "skill": "lightingrendering",
            "title": "Step 32",
            "prompt": "<p>You've checked every configuration you can think of. Sometimes, engine caches can be stale. What build action specifically pertains to dynamic lighting systems like Lumen?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Hit 'Build' > 'Build Reflection Captures'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. While Lumen is dynamic, refreshing reflection captures can sometimes resolve indirect lighting anomalies by ensuring environment probes are up to date.</p>",
                    "next": "step-33"
                },
                {
                    "text": "<p>Hit 'Build' > 'Build Lighting Only'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Lumen is a dynamic GI system and does not use static baked lighting. Building lighting is irrelevant and wastes time.</p>",
                    "next": "step-32W-A"
                },
                {
                    "text": "<p>Hit 'Build' > 'Build All'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.10hrs. 'Build All' includes building static lighting, which is unnecessary for Lumen and adds wasted time to the process.</p>",
                    "next": "step-32"
                },
                {
                    "text": "<p>Hit 'Build' > 'Build Paths'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.08hrs. 'Build Paths' is for navigation meshes, entirely unrelated to rendering and GI.</p>",
                    "next": "step-32"
                }
            ]
        },
        "step-33": {
            "skill": "lightingrendering",
            "title": "Step 33",
            "prompt": "<p>Still no success. Sometimes a full restart can clear lingering issues. What's your immediate step before restarting?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Save the level and close the editor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.04hrs. Always save before a full restart to ensure all changes are preserved. Closing the editor is necessary for a clean restart.</p>",
                    "next": "step-34"
                },
                {
                    "text": "<p>Force close the editor via Task Manager.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.10hrs. Force-closing can lead to data loss or corrupt assets. Always save and exit gracefully.</p>",
                    "next": "step-33"
                },
                {
                    "text": "<p>Save the project but keep the editor open, then open a new level.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.08hrs. Opening a new level doesn't provide a full editor restart, which is often needed to clear deep-seated caching issues.</p>",
                    "next": "step-33"
                },
                {
                    "text": "<p>Save the current level only, without saving all modified assets.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.06hrs. You risk losing changes to materials, meshes, or other assets modified during debugging. Always save everything.</p>",
                    "next": "step-33"
                }
            ]
        },
        "step-34": {
            "skill": "lightingrendering",
            "title": "Step 34",
            "prompt": "<p>The editor is closed. What's the final attempt to resolve the issue if all previous steps failed?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Restart UE5 from the Epic Games Launcher and reload the level.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.04hrs. A full editor restart can often clear cached data, reload engine modules, and resolve persistent rendering issues that aren't immediately apparent.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Reinstall Unreal Engine 5 completely.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +5.00hrs. Reinstalling the engine is an extreme measure and almost never necessary for a configuration issue. This would be a massive time sink.</p>",
                    "next": "step-34"
                },
                {
                    "text": "<p>Open the Project in an older version of Unreal Engine.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +1.00hrs. Downgrading an engine version is complex and can introduce compatibility issues, leading to more problems than it solves.</p>",
                    "next": "step-34"
                },
                {
                    "text": "<p>Try rebuilding the engine from source code.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +3.00hrs. Rebuilding from source is only for very advanced, specific engine-level debugging, not for a common emissive GI issue.</p>",
                    "next": "step-34"
                }
            ]
        },
        "step-1W-A": {
            "skill": "lightingrendering",
            "title": "Step 1W A",
            "prompt": "<p>You believe performance is the issue, despite the problem being a lack of GI. You've just typed 'stat unit' into the console. What do you do next, even though it's a detour from the core GI problem?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Go to Edit > Project Settings to begin checking high-level rendering configurations.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Realizing that `stat unit` isn't directly addressing the GI contribution issue, you pivot back to verifying fundamental engine settings for Lumen.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Open a GPU debugging tool like RenderDoc to analyze rendering passes.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.20hrs. This is an external tool and a deeper diagnostic step than necessary at this stage for a configuration problem, incurring significant time overhead.</p>",
                    "next": "step-1W-A"
                },
                {
                    "text": "<p>Lower global scalability settings (Engine Scalability) to 'Low'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. While this might improve performance, it doesn't diagnose *why* emissive GI isn't working, potentially obscuring the actual root cause.</p>",
                    "next": "step-1W-A"
                }
            ]
        },
        "step-1W-B": {
            "skill": "lightingrendering",
            "title": "Step 1W B",
            "prompt": "<p>You're trying to debug emissive GI but immediately jumped to checking 'Use Emissive for Dynamic Area Lighting' in the material. What's the more efficient next step to verify foundational settings?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open Project Settings (Edit > Project Settings) to check global rendering configurations.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.10hrs. You've identified that jumping to a material flag without checking core engine settings is inefficient. Returning to Project Settings is the correct, foundational step.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Continue adjusting other material properties, like 'Blend Mode' or 'Shading Model'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.25hrs. You're still in the weeds of material properties, making an assumption that the material is the sole problem, without verifying Lumen is even enabled project-wide.</p>",
                    "next": "step-1W-B"
                },
                {
                    "text": "<p>Restart the Unreal Editor hoping it will 'magically' fix the issue.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.30hrs. Restarting without a clear diagnostic path is a blind guess and wastes significant time if the underlying configuration is wrong.</p>",
                    "next": "step-1W-B"
                }
            ]
        },
        "step-3W-A": {
            "skill": "lightingrendering",
            "title": "Step 3W A",
            "prompt": "<p>Lumen GI is missing, but you're trying to compensate by adjusting primary lights (Sky Light/Directional Light). You just increased the Sky Light intensity. What is the correct next step to address the *emissive* GI problem?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the emissive material (e.g., M_NeonStrip) to check its properties.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.30hrs. You've recognized that adjusting primary lights is a workaround, not a fix for emissive GI. Returning to material properties is the right next step for the actual problem.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Add more Sky Light or Directional Light actors to flood the scene with light.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.50hrs. This severely exacerbates the issue by attempting to compensate with primary lights, completely ignoring the emissive contribution problem and wasting valuable time.</p>",
                    "next": "step-3W-A"
                },
                {
                    "text": "<p>Adjust the 'Indirect Lighting Intensity' on the Directional Light.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.40hrs. This only affects the indirect lighting contribution of the *directional light* itself, not the emissive materials you're trying to fix.</p>",
                    "next": "step-3W-A"
                }
            ]
        },
        "step-4W-A": {
            "skill": "lightingrendering",
            "title": "Step 4W A",
            "prompt": "<p>You're attempting to debug emissive GI by using console commands (e.g., r.Lumen.EmissiveRadiance) without checking editor settings first. What's the more efficient next step?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the emissive material (e.g., M_NeonStrip) to check its properties.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.10hrs. You've realized that console commands are a lower-level diagnostic. It's better to verify higher-level editor settings like material and mesh properties first.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Continue trying different console commands like 'r.Lumen.MaxTraceDistance' or 'r.Lumen.Reflections'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.30hrs. Randomly trying console commands without understanding the core editor configurations is a massive time sink and unlikely to hit the specific problem. This is chasing red herrings.</p>",
                    "next": "step-4W-A"
                },
                {
                    "text": "<p>Check the 'World Settings' for any general Lumen overrides.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.20hrs. While World Settings has some GI options, material and mesh settings are typically more direct for emissive contribution and should be checked before wider world settings.</p>",
                    "next": "step-4W-A"
                }
            ]
        },
        "step-7W-A": {
            "skill": "lightingrendering",
            "title": "Step 7W A",
            "prompt": "<p>To 'fix' the material, you've just changed its blend mode to 'Translucent'. This made the issue worse. What's the correct next step to address the *emissive GI* problem?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In Material Details, navigate to the 'Lighting' category.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.25hrs. You've identified that changing the blend mode broke emissive GI. You now need to revert that (or ensure it's `Opaque`) and proceed to checking the correct lighting properties.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Change the material 'Blend Mode' to 'Masked' instead of 'Translucent'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.40hrs. 'Masked' materials also have limitations for Lumen GI. You're still focusing on blend modes instead of the core GI settings, prolonging the issue.</p>",
                    "next": "step-7W-A"
                },
                {
                    "text": "<p>Add a Lightmass Portal to the scene near the emissive object.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.50hrs. Lightmass Portals are for baked static lighting and have no relevance to Lumen's dynamic GI. This is a completely irrelevant action.</p>",
                    "next": "step-7W-A"
                }
            ]
        },
        "step-9W-A": {
            "skill": "lightingrendering",
            "title": "Step 9W A",
            "prompt": "<p>You're debugging the emissive material, but you've checked the Material Instance for overrides *before* verifying the base material properties. What's the more efficient next step to address the *emissive GI* problem?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify the Emissive color intensity in the base material graph.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. You've realized that base material properties should be checked first, as Material Instances inherit from them. Now you're returning to that logical flow.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Keep checking different parameters in the Material Instance, assuming the override is the issue.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. You're wasting time on the Material Instance when the fundamental issue might be in the parent material's setup, which the instance inherits.</p>",
                    "next": "step-9W-A"
                },
                {
                    "text": "<p>Right-click the Material Instance and choose 'Convert to Material'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.20hrs. This is an extreme and unnecessary step. Material Instances are designed for efficiency; converting it won't diagnose the problem and can create asset management issues.</p>",
                    "next": "step-9W-A"
                }
            ]
        },
        "step-11W-A": {
            "skill": "lightingrendering",
            "title": "Step 11W A",
            "prompt": "<p>You're frustrated with the emissive material and are now attempting to adjust unrelated material properties like 'Two Sided'. What's the correct next step to address the *emissive GI* problem?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select the Static Mesh Actor (SM_WallLight) in the level viewport.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.08hrs. You've identified that extraneous material properties won't solve the core GI problem. Shifting focus to the mesh in the level is the next logical step.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Increase 'Metallic' or 'Specular' values in the material.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.20hrs. These properties affect reflections and how direct light interacts with the surface, not the emissive light's contribution to GI. This is an irrelevant change.</p>",
                    "next": "step-11W-A"
                },
                {
                    "text": "<p>Try connecting a different texture to the 'Emissive Color' input.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. If the material output isn't strong enough or the flag isn't set, changing the texture won't fix the underlying problem of GI contribution.</p>",
                    "next": "step-11W-A"
                }
            ]
        },
        "step-14W-A": {
            "skill": "lightingrendering",
            "title": "Step 14W A",
            "prompt": "<p>You're trying to improve GI by increasing the 'Light Map Resolution' of the Static Mesh. This is irrelevant for Lumen. What's the correct next step to address the *emissive GI* problem?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate the Post Process Volume in the level (or add a new infinite one).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.10hrs. You've realized that Light Map Resolution is for baked lighting and irrelevant to Lumen. Shifting focus to the Post Process Volume for global GI settings is the correct next step.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Adjust the 'Indirect Lighting Bounce Count' in the World Settings.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.25hrs. This setting is more for baked lighting or older GI solutions. For Lumen, the relevant settings are in the Post Process Volume.</p>",
                    "next": "step-14W-A"
                },
                {
                    "text": "<p>Rebuild 'Lightmass' data for the level.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.30hrs. Lightmass is for static baked lighting, which Lumen does not use. This is a completely irrelevant action and wastes significant time.</p>",
                    "next": "step-14W-A"
                }
            ]
        },
        "step-17W-A": {
            "skill": "lightingrendering",
            "title": "Step 17W A",
            "prompt": "<p>You're faking emissive lighting by placing a hidden Point Light near the object. This bypasses Lumen. What's the correct next step to address the *emissive GI* problem via Lumen?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Under Global Illumination > Lumen in PPV, expand the sub-category.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.20hrs. You've identified that faking light isn't a solution. You're now correctly going to the Lumen-specific settings within the Post Process Volume to ensure proper emissive contribution.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Place more hidden point lights and adjust their intensity to mimic emissive bounce.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.40hrs. This continues to bypass Lumen, doesn't solve the root problem, and adds unnecessary performance overhead and complexity to the scene. This is a 'works but bad' scenario.</p>",
                    "next": "step-17W-A"
                },
                {
                    "text": "<p>Adjust the 'Volumetric Lightmap' settings in World Settings.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.35hrs. Volumetric Lightmaps are primarily for baked lighting contribution, not dynamic emissive GI with Lumen. This is an incorrect area to investigate.</p>",
                    "next": "step-17W-A"
                }
            ]
        },
        "step-20W-A": {
            "skill": "lightingrendering",
            "title": "Step 20W A",
            "prompt": "<p>You're blindly increasing other Lumen quality settings in the Post Process Volume, like 'Max Trace Distance'. This might hurt performance without fixing the core issue. What's the correct next step to address the *emissive GI* problem?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Static Mesh Editor for SM_WallLight to inspect mesh properties.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.12hrs. You've realized that increasing quality settings won't solve a fundamental configuration issue. Shifting focus to the mesh's properties (UVs, etc.) is the correct next step.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Increase 'Screen Traces' quality to 'High'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.25hrs. Screen Traces are primarily for reflections and not directly related to the base quality of Lumen's GI, adding performance cost without solving the issue.</p>",
                    "next": "step-20W-A"
                },
                {
                    "text": "<p>Set Lumen's 'Hardware Ray Tracing' to 'Disabled' to see if software works better.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.30hrs. Arbitrarily disabling hardware features is a step backward, not a diagnostic for why emissive GI isn't contributing. This adds more variables.</p>",
                    "next": "step-20W-A"
                }
            ]
        },
        "step-24W-A": {
            "skill": "lightingrendering",
            "title": "Step 24W A",
            "prompt": "<p>You're trying to solve the problem by modifying 'Lighting Channels' on the mesh component. This might introduce new issues. What's the correct next step to address the *emissive GI* problem?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Search Project Settings (Rendering) for 'Lumen Global Illumination'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.10hrs. You've realized that modifying lighting channels prematurely can be problematic. Returning to Project Settings to verify global Lumen configuration, specifically ray tracing, is the more logical next step.</p>",
                    "next": "step-25"
                },
                {
                    "text": "<p>Set 'Lighting Channels' to only Channel 2 for the emissive mesh.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.25hrs. This would isolate the light to only Channel 2, potentially making it *not* interact with other elements configured for default channels. This isn't a fix, it's a segmentation.</p>",
                    "next": "step-24W-A"
                },
                {
                    "text": "<p>Delete the mesh and replace it with a new one from the Content Browser.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.30hrs. Replacing the mesh without understanding the root cause is a blind guess and wastes time if the new mesh still inherits the same material or global settings issues.</p>",
                    "next": "step-24W-A"
                }
            ]
        },
        "step-28W-A": {
            "skill": "lightingrendering",
            "title": "Step 28W A",
            "prompt": "<p>You're in the console, but you've typed 'stat gpu' instead of checking Lumen-specific CVars. What's the correct next step to address the *emissive GI* problem?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Type 'r.Lumen.EmissiveRadiance 1' (or '?') to verify if it's enabled.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. You've correctly pivoted from general performance diagnostics to checking a specific Lumen emissive GI console variable, which is more targeted.</p>",
                    "next": "step-29"
                },
                {
                    "text": "<p>Type 'showflag.AmbientOcclusion 0' to disable AO.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Ambient Occlusion is a separate rendering effect from Global Illumination. Disabling it won't resolve the emissive GI contribution issue.</p>",
                    "next": "step-28W-A"
                },
                {
                    "text": "<p>Type 'r.ForceLOD 0' to ensure all meshes are at their highest detail.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.10hrs. LODs affect mesh geometry detail, not directly the emissive GI contribution enablement. This is a performance/detail setting, not a functional one for GI.</p>",
                    "next": "step-28W-A"
                }
            ]
        },
        "step-31W-A": {
            "skill": "lightingrendering",
            "title": "Step 31W A",
            "prompt": "<p>You're checking the Material Instance, but quickly scanning parameters without specific focus on emissive multipliers. This might lead to a missed diagnosis. What's the more effective next step?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Carefully inspect Material Instance parameters, focusing on any 'Emissive Color' or 'Emissive Intensity' overrides.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. You've correctly identified that a focused inspection of emissive-related parameters in the Material Instance is needed, rather than a generic scan.</p>",
                    "next": "step-32"
                },
                {
                    "text": "<p>Check Material Instance for 'Two Sided' or 'Opacity Mask Clip Value' overrides.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.10hrs. These parameters are generally unrelated to emissive GI contribution. Focusing on them is a misdirection.</p>",
                    "next": "step-31W-A"
                },
                {
                    "text": "<p>Revert the Material Instance to its parent material.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. While this might clear overrides, it's destructive and prevents you from identifying *which* override was the problem, hindering future debugging.</p>",
                    "next": "step-31W-A"
                }
            ]
        },
        "step-32W-A": {
            "skill": "lightingrendering",
            "title": "Step 32W A",
            "prompt": "<p>You're attempting to manually build lighting ('Build Lighting Only'). This is irrelevant for Lumen. What's the correct next step?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Hit 'Build' > 'Build Reflection Captures'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.15hrs. You've correctly identified that building static lighting is irrelevant for Lumen and pivoted to the correct build action (Reflection Captures) that might help with dynamic lighting.</p>",
                    "next": "step-33"
                },
                {
                    "text": "<p>Rebuild 'Navigation Mesh' to ensure AI paths are correct.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.30hrs. Navigation mesh building is for AI, completely unrelated to rendering or global illumination. This is a severe misdirection.</p>",
                    "next": "step-32W-A"
                },
                {
                    "text": "<p>Use the 'Clean' option under 'Build' to clear all cached data.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.25hrs. While cleaning can sometimes help, it's a broad action. 'Build Reflection Captures' is more targeted to lighting systems without clearing everything.</p>",
                    "next": "step-32W-A"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario.</p>",
            "choices": []
        }
    }
};
