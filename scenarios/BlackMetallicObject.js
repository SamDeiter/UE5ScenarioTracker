window.SCENARIOS['BlackMetallicObject'] = {
    "meta": {
        "title": "Metallic Asset Appears Pitch Black in Dynamic Scene",
        "description": "A highly reflective metallic statue has been placed into the level. Despite the level being well-lit using a dynamic directional light and having Lumen enabled, the statue appears uniformly pitch black in the viewport and in PIE. Other nearby non-metallic objects reflect light and shadows correctly. The material instance applied to the statue has Metallic set to 1.0 and Roughness set to 0.1. The object is clearly not receiving any environmental reflections or indirect light.",
        "estimateHours": 0.73,
        "category": "Lighting & Rendering"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "lightingrendering",
            "title": "Investigate Black Metallic Statue",
            "prompt": "A metallic statue is pitch black in a well-lit Lumen scene. Other objects are fine. Material settings (Metallic 1.0, Roughness 0.1) are correct. What's your immediate next action?",
            "choices": [
                {
                    "text": "Select the problematic Static Mesh Actor in the viewport or World Outliner.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.03hrs. Always start by selecting the problematic asset to access its properties and relevant settings.",
                    "next": "step-2"
                },
                {
                    "text": "Open the Project Settings and navigate directly to the Rendering section to check Lumen settings.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. While Project Settings are important, it's generally best to check the object itself first. The issue might be specific to the actor, not a global setting.",
                    "next": "step-1"
                },
                {
                    "text": "Attempt to change the Material's roughness parameter to 1.0 (matte) to confirm light interaction.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.15hrs. This misdiagnoses the problem by removing the metallic visual requirement for reflections, which is key to the symptom. It won't help diagnose the reflection issue.",
                    "next": "step-1"
                },
                {
                    "text": "Delete the directional light and replace it, or modify its intensity to extreme values.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.2hrs. This mistakenly assumes the issue is primary lighting source intensity. Other objects are lit correctly, suggesting the main light source is not the problem.",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "lightingrendering",
            "title": "Verify Material Properties",
            "prompt": "You've selected the problematic metallic statue. What material property should you inspect first on its Static Mesh Component to rule out basic material misconfiguration?",
            "choices": [
                {
                    "text": "Verify the material applied to the mesh component's slot 0. Confirm Metallic=1.0 and Roughness is a low value (e.g., 0.1).",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. This confirms the material setup matches the expected metallic and reflective properties.",
                    "next": "step-3"
                },
                {
                    "text": "Inspect the Static Mesh asset itself in the Content Browser for any corrupted data.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.04hrs. While asset corruption can occur, it's less likely to selectively affect reflections while basic lighting works. Focus on the actor's component properties first.",
                    "next": "step-2"
                },
                {
                    "text": "Check the collision presets of the Static Mesh Component.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.03hrs. Collision settings affect physics interaction, not directly how light is rendered or reflected.",
                    "next": "step-2"
                },
                {
                    "text": "Adjust the UVs for the material slot in the Static Mesh Editor.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Incorrect UVs might cause texture distortion, but not a uniform black appearance for reflections when the material values are correct.",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "lightingrendering",
            "title": "Check Object Mobility",
            "prompt": "The material instance's Metallic and Roughness values are confirmed correct. Given the level uses dynamic lighting with Lumen, what object setting is crucial for full compatibility with these dynamic systems?",
            "choices": [
                {
                    "text": "In the Details panel for the Static Mesh Component, verify the 'Mobility' setting is set to 'Movable'.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. Static or Stationary objects have limitations with Lumen and dynamic reflections; Movable is required for full interaction.",
                    "next": "step-4"
                },
                {
                    "text": "Check the 'Lightmass Settings' for precomputed visibility.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.03hrs. Lightmass settings are for static lighting, which is not the primary system here with Lumen.",
                    "next": "step-3"
                },
                {
                    "text": "Modify the 'Bounds Scale' property.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.02hrs. Bounds scale primarily affects culling and visibility calculations at a distance, not reflection rendering for a clearly visible object.",
                    "next": "step-3"
                },
                {
                    "text": "Adjust the 'Shadow Bias' for the object.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.04hrs. Shadow bias affects shadow accuracy, but the object is black due to *missing* reflections, not incorrect shadows.",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "lightingrendering",
            "title": "Verify Basic Visibility Flags",
            "prompt": "Mobility is confirmed 'Movable'. What fundamental rendering properties should you check next in the 'Rendering' category of the Details panel to ensure the object is rendering correctly?",
            "choices": [
                {
                    "text": "Expand the 'Rendering' category and verify 'Visible' and 'Cast Shadows' are checked.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.04hrs. These are fundamental properties for any object to appear and interact with scene lighting.",
                    "next": "step-5"
                },
                {
                    "text": "Toggle 'Generate Overlap Events'.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.02hrs. Overlap events are for gameplay interaction, not rendering visibility.",
                    "next": "step-4"
                },
                {
                    "text": "Change the 'Render CustomDepth Pass' setting.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.03hrs. Custom Depth is used for post-process effects, not primary rendering visibility.",
                    "next": "step-4"
                },
                {
                    "text": "Adjust the 'Lightmap Resolution' for the Static Mesh Component.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.04hrs. Lightmap resolution is for baked static lighting, which is not the primary issue here with dynamic Lumen.",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "lightingrendering",
            "title": "Check Global Illumination Interaction",
            "prompt": "Basic visibility and shadow casting are enabled. For the object to correctly receive and contribute to Lumen's Global Illumination, what specific rendering property must be active?",
            "choices": [
                {
                    "text": "Check the 'Rendering' property 'Affects Global Illumination' and ensure it is enabled.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.04hrs. This property allows the object to interact with and receive light from GI systems like Lumen.",
                    "next": "step-6"
                },
                {
                    "text": "Adjust the 'Indirect Lighting Intensity' property.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.03hrs. While this affects indirect lighting, 'Affects Global Illumination' must be enabled first for it to have any effect.",
                    "next": "step-5"
                },
                {
                    "text": "Check the material slot assignments for any conflicts.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.02hrs. Material slot issues usually lead to incorrect textures or missing materials, not a uniform black reflection problem.",
                    "next": "step-5"
                },
                {
                    "text": "Change the 'Volumetric Lightmap' resolution setting.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.04hrs. Volumetric Lightmaps are for pre-computed volumetric lighting, not relevant for dynamic Lumen reflections.",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "lightingrendering",
            "title": "Inspect Ray Tracing Visibility",
            "prompt": "'Affects Global Illumination' is enabled. For highly reflective metallic objects to appear correctly with Lumen's high-quality reflections (which often use ray tracing), what advanced visibility setting is crucial?",
            "choices": [
                {
                    "text": "Locate 'Visible in Ray Tracing' (usually found near the bottom of the Rendering section) and confirm it is checked.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.08hrs. If unchecked, metallic/reflective objects often appear black when using hardware ray tracing or high-quality Lumen reflections.",
                    "next": "step-7"
                },
                {
                    "text": "Change the 'Custom Depth Stencil Value' for the object.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.03hrs. Custom Depth is for rendering special effects, not fundamental reflection visibility.",
                    "next": "step-6"
                },
                {
                    "text": "Adjust the 'Translucency Sort Priority'.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.04hrs. This affects the rendering order of transparent objects, not the reflectivity of opaque metallic ones.",
                    "next": "step-6"
                },
                {
                    "text": "Toggle 'Receives Decals' on the component.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Decal interaction has no direct bearing on the object receiving environmental reflections.",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "lightingrendering",
            "title": "Check Lumen Global State",
            "prompt": "'Visible in Ray Tracing' was enabled (or confirmed already enabled), but the statue remains pitch black. Before diving into global project settings, how can you quickly verify if Lumen's Global Illumination and Reflections are actually active in the scene viewport?",
            "choices": [
                {
                    "text": "Open the console and use `showflag.LumenGI 1` and `showflag.LumenReflections 1` to ensure these features are toggled on.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.03hrs. These console commands are quick ways to check if Lumen features are globally enabled for the viewport.",
                    "next": "step-8"
                },
                {
                    "text": "Use the `stat unit` console command to check frame timings.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.03hrs. `stat unit` provides general performance metrics but doesn't specifically confirm Lumen's active rendering flags.",
                    "next": "step-7"
                },
                {
                    "text": "Manually place multiple Sphere Reflection Capture actors across the scene and run 'Build Reflection Captures'.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. This assumes Lumen is disabled or misconfigured and wastes time on legacy techniques, which is explicitly not the focus of this dynamic Lumen scene.",
                    "next": "step-7"
                },
                {
                    "text": "Restart the UE5 editor immediately.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. While restarting can fix glitches, it's a brute-force approach. It's better to methodically check settings first.",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "lightingrendering",
            "title": "Verify Project Lumen Settings",
            "prompt": "The `showflag` console commands confirm LumenGI and LumenReflections are enabled. If the statue is still black, you need to check the global project configuration for Lumen. Where should you look?",
            "choices": [
                {
                    "text": "Open Project Settings (Edit -> Project Settings) and navigate to the 'Rendering' section to globally confirm 'Global Illumination Method' is 'Lumen' and 'Reflection Method' is 'Lumen'.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.07hrs. These are the master switches for Lumen in your project.",
                    "next": "step-9"
                },
                {
                    "text": "Check the 'Forward Shading' option in Project Settings -> Rendering.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.03hrs. Forward Shading is a different rendering path; Lumen typically works with deferred rendering.",
                    "next": "step-8"
                },
                {
                    "text": "Adjust the 'Tiled Deferred Shading' setting.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.02hrs. Tiled deferred shading is an optimization, not the core method for global illumination or reflections.",
                    "next": "step-8"
                },
                {
                    "text": "Change the default 'Anti-Aliasing Method' in Project Settings.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.04hrs. Anti-aliasing affects edge smoothness, not the fundamental presence of reflections.",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "lightingrendering",
            "title": "Inspect Sky Light Configuration",
            "prompt": "Global Lumen settings are confirmed in Project Settings. What critical environmental light source heavily influences indirect lighting and reflections with Lumen, and its configuration should be checked next?",
            "choices": [
                {
                    "text": "Check the Sky Light actor in the scene. Ensure its 'Source Type' is set to 'SLS Captured Scene' and confirm its 'Intensity' is a visible value (e.g., 1.0).",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. The Sky Light provides environmental light and reflections; if misconfigured, Lumen won't have a scene to reflect.",
                    "next": "step-10"
                },
                {
                    "text": "Modify the 'Lightmass Settings' for the Directional Light.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.03hrs. Lightmass settings are for static lighting, which is not the primary system used here.",
                    "next": "step-9"
                },
                {
                    "text": "Add a Point Light actor near the statue to see if it helps.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.04hrs. This might add direct illumination but won't solve the lack of environmental reflections or indirect light from Lumen.",
                    "next": "step-9"
                },
                {
                    "text": "Check the 'Exponential Height Fog' density and color.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Fog affects atmospheric scattering, not the direct reflection of scene elements.",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "lightingrendering",
            "title": "Visualize World Reflections",
            "prompt": "The Sky Light is properly configured as 'SLS Captured Scene' with adequate intensity. How can you visually inspect if reflection data from the Sky Light or Lumen is actually reaching the object in the editor viewport?",
            "choices": [
                {
                    "text": "In the Editor Viewport, switch the view mode to 'Buffer Visualization -> World Reflection' to visually confirm if the object is receiving any reflection data.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.06hrs. The 'World Reflection' buffer shows the raw reflection data being applied to surfaces, which is critical for diagnosing this issue.",
                    "next": "step-11"
                },
                {
                    "text": "Switch to 'Buffer Visualization -> Base Color'.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.03hrs. Base Color shows the material's albedo, which is not relevant to whether it's receiving reflections.",
                    "next": "step-10"
                },
                {
                    "text": "Switch to 'Buffer Visualization -> Ambient Occlusion'.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.02hrs. Ambient Occlusion shows shadowing from nearby geometry, not global environmental reflections.",
                    "next": "step-10"
                },
                {
                    "text": "Switch to 'Buffer Visualization -> Lit (Lumen)'.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.04hrs. This shows the final lit result. While useful, 'World Reflection' provides the specific diagnostic information needed here.",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "lightingrendering",
            "title": "Check Legacy Reflection Captures (if any)",
            "prompt": "The 'World Reflection' buffer shows little to no reflection data on the statue. While Lumen is the primary reflection system, are there any legacy Reflection Capture actors in the scene that might be incorrectly configured or interfering?",
            "choices": [
                {
                    "text": "If a dedicated Reflection Capture actor is present near the statue, check its influence bounds to ensure the statue is fully contained within it.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. Although Lumen is enabled, legacy Reflection Captures can sometimes interfere or provide fallback, so their proper configuration should be verified.",
                    "next": "step-12"
                },
                {
                    "text": "Manually placing multiple Sphere Reflection Capture actors across the scene and running 'Build Reflection Captures'.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. This assumes Lumen is disabled or misconfigured, wasting time on legacy techniques, which is explicitly not the focus of this dynamic Lumen scene.",
                    "next": "step-11"
                },
                {
                    "text": "Delete all Reflection Capture actors from the scene.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.04hrs. While removing potential interference, it's better to check their configuration first to understand if they are the problem.",
                    "next": "step-11"
                },
                {
                    "text": "Temporarily disable Lumen to see if legacy reflections kick in.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.06hrs. This is a more drastic troubleshooting step. Checking existing capture bounds is less disruptive.",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "lightingrendering",
            "title": "Inspect Post Process Volume Bounds",
            "prompt": "Reflection Capture actors have been checked or are not an issue. What common scene volume often controls global rendering features like Lumen and its extent or unbound state must be verified to affect the statue?",
            "choices": [
                {
                    "text": "Select the Post Process Volume in the scene and ensure the 'Unbound' property is checked, or that the statue is within the volume's bounds.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.04hrs. Post Process Volumes control many rendering effects, and if the object isn't within its bounds (or it's not unbound), those effects won't apply.",
                    "next": "step-13"
                },
                {
                    "text": "Check the 'World Settings' for global illumination overrides.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.03hrs. World Settings contain some global overrides, but the Post Process Volume is typically where most rendering feature configurations reside.",
                    "next": "step-12"
                },
                {
                    "text": "Inspect the Level Blueprint for any scripts affecting rendering.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. While possible, it's a less common cause for a global rendering feature issue than a misconfigured volume.",
                    "next": "step-12"
                },
                {
                    "text": "Check the 'Lightmass Importance Volume' boundaries.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.04hrs. The Lightmass Importance Volume is for static lighting calculation, not dynamic Lumen reflections.",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "lightingrendering",
            "title": "Verify Post Process Volume Lumen Settings",
            "prompt": "The Post Process Volume bounds are correct. Now, what specific Lumen-related settings *within* the Post Process Volume are crucial for ensuring Global Illumination and Reflections are active and correctly configured?",
            "choices": [
                {
                    "text": "In the Post Process Volume settings, search for 'Lumen' and confirm that both 'Global Illumination' and 'Reflections' settings are explicitly set to 'Lumen' or 'Final Gather', and that the intensity values are not zero.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. The Post Process Volume provides fine-grained control over Lumen's behavior and intensity, overriding project defaults if specified.",
                    "next": "step-14"
                },
                {
                    "text": "Adjust the 'Bloom' intensity and threshold.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.03hrs. Bloom affects bright areas but is unrelated to the base reflection functionality of Lumen.",
                    "next": "step-13"
                },
                {
                    "text": "Change the 'Exposure' compensation.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.02hrs. Exposure adjusts overall scene brightness, but won't make missing reflections appear.",
                    "next": "step-13"
                },
                {
                    "text": "Modify 'Screen Space Reflection' quality settings.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.04hrs. While reflections, SSR is a separate, less comprehensive system than Lumen and not the primary focus here.",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "lightingrendering",
            "title": "Lumen Scene Visualization",
            "prompt": "All Post Process Volume Lumen settings appear correct. The statue is still black. There might be an issue with how Lumen is constructing its internal scene representation for the object. How can you investigate this?",
            "choices": [
                {
                    "text": "Use the console command `r.Lumen.Visualize 2` to view the Lumen Scene/Surface Cache, looking for the statue's representation.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.04hrs. This visualization shows how Lumen perceives and caches the geometry, which is crucial for diagnosing why it might not be reflecting.",
                    "next": "step-15"
                },
                {
                    "text": "Toggle 'Show Only Selected' on the problematic actor to isolate it.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.02hrs. This is useful for inspection but won't provide diagnostic information about Lumen's internal state.",
                    "next": "step-14"
                },
                {
                    "text": "Change editor quality settings (e.g., 'Engine Scalability Settings').",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.03hrs. While scalability can affect Lumen quality, it's unlikely to cause a completely black object if all other settings are correct.",
                    "next": "step-14"
                },
                {
                    "text": "Use the console command `r.RayTracing.ForceAllMeshes 1`.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Forcing all meshes for ray tracing can have performance implications and might not reveal why Lumen isn't reflecting the specific object.",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "lightingrendering",
            "title": "Re-check Ray Tracing Visibility (Final)",
            "prompt": "Lumen scene visualizations show the statue is present in Lumen's internal representation, but still no reflections. After checking many global and local settings, it's wise to revisit a critical object-specific setting that often gets accidentally toggled or reset.",
            "choices": [
                {
                    "text": "Return to the problematic Static Mesh Actor and specifically review the 'Visible in Ray Tracing' setting one last time. If it was disabled, re-enable it.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.03hrs. This setting is so critical for Lumen reflections that a double-check is warranted, as it could have been inadvertently changed.",
                    "next": "step-16"
                },
                {
                    "text": "Check the 'Can Character Step On' property for the component.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.02hrs. This is a gameplay-related collision setting, completely irrelevant to rendering reflections.",
                    "next": "step-15"
                },
                {
                    "text": "Modify the 'Collision Presets' for the object.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.03hrs. Collision settings are not related to rendering reflections or global illumination.",
                    "next": "step-15"
                },
                {
                    "text": "Adjust 'Translucency Sort Priority' again.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.04hrs. Already checked in a previous step, and it's for transparent objects, not opaque metallic ones.",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "lightingrendering",
            "title": "Directional Light Ray Traced Shadows",
            "prompt": "All statue-specific, global, and Post Process Volume Lumen settings appear correct. The statue is still black. What specific setting on the *Directional Light* could be preventing its shadows from interacting correctly with Lumen's ray tracing, impacting reflection quality?",
            "choices": [
                {
                    "text": "Ensure 'Cast Ray Traced Shadows' is enabled on the Directional Light actor in the scene.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. For high-quality Lumen reflections and GI, the Directional Light's contribution via ray-traced shadows is crucial for accurate scene representation.",
                    "next": "step-17"
                },
                {
                    "text": "Adjust the Directional Light's 'Source Angle'.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.03hrs. Source angle affects shadow softness but not the fundamental casting of ray-traced shadows for Lumen.",
                    "next": "step-16"
                },
                {
                    "text": "Change the Directional Light's 'Lightmass Settings'.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.02hrs. Lightmass settings are for static lighting, which is not the primary issue here.",
                    "next": "step-16"
                },
                {
                    "text": "Toggle 'Cascaded Shadow Maps' on the Directional Light.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.04hrs. CSMs are a different shadow technique; ray-traced shadows are specific to Lumen's high-quality interaction.",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "lightingrendering",
            "title": "Review Active Rendering Flags",
            "prompt": "'Cast Ray Traced Shadows' is enabled on the Directional Light. The statue is still black. How can you get a comprehensive overview of *all* rendering features and flags currently active in the viewport, which might reveal an unexpected conflict?",
            "choices": [
                {
                    "text": "Use the console command `showflag.All` to display a list of all active rendering flags and their states.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.03hrs. `showflag.All` provides a thorough list, helping to identify any unintended rendering feature toggles.",
                    "next": "step-18"
                },
                {
                    "text": "Use the console command `stat fps`.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.02hrs. `stat fps` only shows frame rate, not detailed rendering feature states.",
                    "next": "step-17"
                },
                {
                    "text": "Use the console command `stat scene`.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.03hrs. `stat scene` provides scene element counts, but not a detailed list of rendering feature flags.",
                    "next": "step-17"
                },
                {
                    "text": "Use the console command `stat memory`.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.04hrs. `stat memory` is for memory usage, which is not directly related to active rendering features.",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "lightingrendering",
            "title": "Analyze GPU Performance",
            "prompt": "`showflag.All` has been reviewed, and no obvious conflicting flags were found. To further diagnose if Lumen is encountering performance limitations or errors that prevent reflections, what console command provides detailed GPU frame timing information?",
            "choices": [
                {
                    "text": "Use the console command `stat gpu` and inspect the Lumen and Ray Tracing sections for any unusually high timings or errors.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.04hrs. `stat gpu` provides in-depth information about what the GPU is spending time on, including Lumen and ray tracing passes, which can highlight issues.",
                    "next": "step-19"
                },
                {
                    "text": "Use the console command `stat cpu`.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.02hrs. `stat cpu` focuses on CPU performance, whereas rendering and Lumen are primarily GPU-bound.",
                    "next": "step-18"
                },
                {
                    "text": "Use the console command `stat scene rendering`.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.03hrs. `stat scene rendering` provides high-level rendering stats but `stat gpu` offers more granular detail for Lumen components.",
                    "next": "step-18"
                },
                {
                    "text": "Use the console command `stat lightmass`.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.04hrs. `stat lightmass` is for static lighting, not dynamic Lumen rendering.",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "lightingrendering",
            "title": "Disable Conflicting Reflection Features",
            "prompt": "`stat gpu` doesn't immediately show a clear bottleneck or error specific to the statue's reflections. To rule out any subtle conflicts with other reflection systems, what global rendering features could you temporarily disable?",
            "choices": [
                {
                    "text": "Disable 'Screen Space Reflections' in Project Settings or the Post Process Volume, or use `r.SSR.Quality 0` in the console.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.04hrs. Sometimes, screen-space reflections can conflict or override Lumen's reflections in unexpected ways, so disabling them can help isolate the issue.",
                    "next": "step-20"
                },
                {
                    "text": "Adjust 'Ambient Occlusion' intensity.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.03hrs. Ambient Occlusion adds subtle shadowing but is not a reflection system that would conflict with Lumen in this manner.",
                    "next": "step-19"
                },
                {
                    "text": "Change the global 'Screen Percentage' in the Post Process Volume.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.02hrs. Screen percentage affects overall render resolution, not the underlying reflection system itself.",
                    "next": "step-19"
                },
                {
                    "text": "Disable 'Temporal Super Resolution' (TSR).",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. TSR is an upscaling and anti-aliasing technique, not a reflection system that would cause an object to appear black.",
                    "next": "step-19"
                }
            ]
        },
        "step-20": {
            "skill": "lightingrendering",
            "title": "Final Basic Visibility Check (PIE)",
            "prompt": "You've systematically checked object settings, global settings, lighting, environment, post-processing, diagnostic commands, and conflicting features. The statue renders in the editor but is reported as black in PIE. What very basic object visibility property might be preventing it from rendering correctly specifically in game?",
            "choices": [
                {
                    "text": "Verify the Static Mesh Component's 'Hidden In Game' property is not checked.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.06hrs. An object can be visible in the editor but explicitly hidden in PIE. This is a common oversight.",
                    "next": "step-21"
                },
                {
                    "text": "Check 'Is Root Component Mobility Static'.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.03hrs. This setting relates to how mobility is inherited, but 'Mobility' itself was already confirmed.",
                    "next": "step-20"
                },
                {
                    "text": "Verify 'Use Full Precision UVs'.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.02hrs. UV precision affects texture mapping detail, not overall visibility or reflection behavior.",
                    "next": "step-20"
                },
                {
                    "text": "Disable 'Distance Field Lighting' on the object.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.04hrs. Distance Field Lighting is an indirect lighting technique, not related to the primary visibility in PIE.",
                    "next": "step-20"
                }
            ]
        },
        "step-21": {
            "skill": "lightingrendering",
            "title": "Material Instance Deep Dive",
            "prompt": "The 'Hidden In Game' property is not checked, and all previous settings appear correct. Yet, the statue remains stubbornly black. Let's perform a final, deep sanity check on the material instance itself to ensure no runtime overrides or compilation issues.",
            "choices": [
                {
                    "text": "Open the material instance and the parent material (if any) in the Material Editor. Check 'Stats' or 'Asset Details' to verify the compiled material properties and any override flags.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. This ensures the material is compiling as expected and no subtle flags or overrides are preventing proper rendering.",
                    "next": "step-22"
                },
                {
                    "text": "Change the parent material to a very basic unlit material to see if it renders.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.04hrs. This might show *something*, but changing the parent material is a destructive test and less diagnostic than checking the current material's compiled state.",
                    "next": "step-21"
                },
                {
                    "text": "Update the Unreal Engine version.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.10hrs. Updating the engine is a major undertaking for debugging a single asset and should only be considered after exhausting all other options.",
                    "next": "step-21"
                },
                {
                    "text": "Delete the material instance and re-create it from scratch.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.06hrs. This is a last resort to rule out corruption, but checking the existing material's compiled state is more efficient.",
                    "next": "step-21"
                }
            ]
        },
        "step-22": {
            "skill": "lightingrendering",
            "title": "Restart Editor as Final Troubleshooting",
            "prompt": "All settings, from object-specific to global, including material verification, seem correct. There are no obvious conflicts or errors. However, the problem persists. What common troubleshooting step often resolves subtle engine glitches, cached rendering issues, or state corruption?",
            "choices": [
                {
                    "text": "Hit 'Save All' and restart the UE5 editor.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.10hrs. A fresh editor session can often clear up cached rendering data or resolve transient bugs that aren't immediately obvious from settings.",
                    "next": "step-23"
                },
                {
                    "text": "Rebuild lighting for the entire level.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. Rebuilding lighting is for static lighting; Lumen is dynamic and doesn't require a bake, so this is unlikely to resolve the issue.",
                    "next": "step-22"
                },
                {
                    "text": "Re-import the static mesh asset from its source file.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.06hrs. This is for mesh corruption issues. While possible, all previous checks point to rendering settings, not mesh integrity.",
                    "next": "step-22"
                },
                {
                    "text": "Run 'Fix Up Redirectors in Content Browser'.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.04hrs. Redirectors are for asset references. This would not resolve a rendering issue like a black metallic object.",
                    "next": "step-22"
                }
            ]
        },
        "step-23": {
            "skill": "lightingrendering",
            "title": "Final Verification",
            "prompt": "After restarting the editor and reopening the project, what is the final step to confirm the issue is completely resolved and the metallic statue is now correctly reflecting the scene in gameplay?",
            "choices": [
                {
                    "text": "Enter Play In Editor (PIE) mode and observe the statue's appearance.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.03hrs. PIE mode is the most accurate representation of how the game will run and is crucial for final verification of rendering issues.",
                    "next": "conclusion"
                },
                {
                    "text": "Take a screenshot of the viewport.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.02hrs. A screenshot only captures the editor view; the problem was reported specifically in PIE.",
                    "next": "step-23"
                },
                {
                    "text": "Check the asset metrics again in the Content Browser.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.03hrs. Asset metrics are about the mesh data, not its runtime rendering in the game.",
                    "next": "step-23"
                },
                {
                    "text": "Share the issue on a developer forum.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. If the issue is now resolved, sharing it on a forum is unnecessary. This would be a step if debugging failed.",
                    "next": "step-23"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "Congratulations! You have successfully completed this debugging scenario. The metallic statue now correctly reflects the dynamic scene in Unreal Engine 5.",
            "choices": []
        }
    }
};
