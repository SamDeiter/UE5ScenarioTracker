window.SCENARIOS['BlackMetallicObject'] = {
    "meta": {
        "title": "Metallic Asset Appears Pitch Black in Dynamic Scene",
        "description": "A highly reflective metallic statue has been placed into the level. Despite the level being well-lit using a dynamic directional light and having Lumen enabled, the statue appears uniformly pitch black in the viewport and in PIE. Other nearby non-metallic objects reflect light and shadows correctly. The material instance applied to the statue has Metallic set to 1.0 and Roughness set to 0.1. The object is clearly not receiving any environmental reflections or indirect light.",
        "estimateHours": 0.73,
        "category": "Lighting & Rendering",
        "tokens_used": 11923
    },
    "setup": [
        {
            "action": "set_ue_property",
            "scenario": "BlackMetallicObject",
            "step": "step-0"
        }
    ],
    "fault": {
        "description": "Initial problem state",
        "visual_cue": "Visual indicator"
    },
    "expected": {
        "description": "Expected resolved state",
        "validation_action": "verify_fix"
    },
    "fix": [
        {
            "action": "set_ue_property",
            "scenario": "BlackMetallicObject",
            "step": "final"
        }
    ],
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "lightingrendering",
            "title": "Examine Problematic Object",
            "prompt": "<p>A <strong>metallic statue</strong> appears uniformly pitch black. Nearby non-metallic objects reflect light correctly. How do you investigate this specific object?</p>",
            "choices": [
                {
                    "text": "<p>Select the problematic black <strong>Static Mesh Actor</strong> in the <strong>World Outliner</strong> or viewport.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.03hrs. Starting by selecting the affected actor allows immediate inspection of its properties.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Run <code>stat gpu</code> in the console to check for rendering bottlenecks.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While performance might be an issue, a pitch-black object usually indicates a configuration problem, not just a performance bottleneck. This isn't the most direct first step.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Delete the <strong>directional light</strong> and replace it with a new one to refresh lighting.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.20hrs. The scenario states the level is 'well-lit' and other objects render correctly, so the primary directional light is likely not the issue. This is a drastic, misplaced action.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Manually place a <strong>Sphere Reflection Capture</strong> actor near the statue and rebuild captures.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. The scenario states 'Lumen enabled'. Relying on legacy <strong>Reflection Capture</strong> actors for a Lumen scene is often unnecessary and misdiagnoses the dynamic reflection system.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "lightingrendering",
            "title": "Verify Material Instance Settings",
            "prompt": "<p>The <strong>Static Mesh Actor</strong> is selected. The material appears black. How do you rule out basic material setup as the cause?</p>",
            "choices": [
                {
                    "text": "<p>Verify the applied <strong>Material Instance</strong> has <code>Metallic=1.0</code> and <code>Roughness</code> at a low value (e.g., <code>0.1</code>).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Confirming the material properties match the expected reflective setup is crucial before moving to other potential causes.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Attempt to change the <strong>Material's</strong> roughness parameter to <code>1.0</code> (matte) to confirm light interaction.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Changing roughness to <code>1.0</code> would make the material matte, removing the highly reflective characteristic central to the problem. This misdiagnoses the issue as a lack of basic light interaction rather than reflection failure.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Check the base <strong>Material</strong> for a connected <strong>Emissive Color</strong> input.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. While emissive might influence appearance, the problem states 'highly reflective metallic' and 'not receiving environmental reflections', pointing away from base emissive issues. It's a less direct diagnostic.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Replace the <strong>Material Instance</strong> with a basic unlit color to see if the object appears.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. This is an overly broad diagnostic that doesn't target the 'reflective' aspect of the problem. It confirms the object is rendering but doesn't help with reflection setup.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "lightingrendering",
            "title": "Confirm Component Mobility",
            "prompt": "<p>Material settings are confirmed as correct. The <strong>statue</strong> is still uniformly black. What <strong>Static Mesh Component</strong> setting should you check next for dynamic lighting compatibility?</p>",
            "choices": [
                {
                    "text": "<p>In the <strong>Details</strong> panel, verify the 'Mobility' setting is set to <code>Movable</code>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. <code>Movable</code> mobility is essential for objects to fully interact with dynamic systems like Lumen and runtime reflections.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Set 'Mobility' to <code>Static</code> to maximize performance for non-moving objects.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.12hrs. Setting mobility to <code>Static</code> would prevent the object from receiving full dynamic lighting and reflections, worsening the problem if Lumen is intended. This contradicts the requirement for dynamic interaction.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Adjust the 'LOD Group' to <code>None</code> to ensure the highest detail mesh is always rendered.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.06hrs. LOD settings affect mesh detail, not fundamental lighting or reflection reception. This is irrelevant to the black appearance issue.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Change 'Collision Presets' to <code>NoCollision</code> to ensure it doesn't interfere with lighting.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.09hrs. Collision settings are for physics interactions, not rendering or lighting. Changing this would have no effect on the visual problem.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "lightingrendering",
            "title": "Check Visibility and Shadows",
            "prompt": "<p>The <strong>statue's</strong> 'Mobility' is <code>Movable</code>, yet it's still pitch black. What rendering properties might prevent it from being lit?</p>",
            "choices": [
                {
                    "text": "<p>Expand the 'Rendering' category in the <strong>Details</strong> panel and verify 'Visible' and 'Cast Shadows' are checked.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.04hrs. Basic visibility and shadow casting are fundamental. If 'Visible' is unchecked, the object wouldn't render at all; if 'Cast Shadows' is unchecked, it might imply other rendering issues.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Uncheck 'Receives Decals' and 'Receives Global Illumination'.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Unchecking 'Receives Global Illumination' would actively prevent the object from receiving indirect light, which is the opposite of what's needed for a reflective object in a Lumen scene.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Enable 'Distance Field Tracing' for more accurate shadow representation.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. Distance field tracing is related to shadow quality and GI, but the immediate problem is a completely black object. Enabling this wouldn't address the primary lack of light interaction.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Adjust the 'Bounds Scale' to a much larger value to ensure it's detected by rendering systems.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.09hrs. While bounds can sometimes cause culling issues, a completely black object usually points to a lighting/reflection setup problem, not incorrect bounding box detection for rendering systems.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "lightingrendering",
            "title": "Confirm Global Illumination Interaction",
            "prompt": "<p>Visibility and shadow casting are confirmed. The <strong>statue</strong> remains pitch black. What rendering property ensures it interacts with global illumination systems?</p>",
            "choices": [
                {
                    "text": "<p>Check the 'Rendering' property 'Affects Global Illumination' and ensure it is enabled.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.04hrs. This setting is crucial for the object to participate in and receive indirect lighting from GI systems like Lumen.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Disable 'Affects Global Illumination' to simplify rendering and isolate the problem.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Disabling this setting would directly prevent the object from receiving indirect light, worsening the 'pitch black' problem if Lumen is intended. This is counterproductive.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Enable 'Generate Mesh Distance Fields' for the <strong>Static Mesh</strong> asset.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.06hrs. While Mesh Distance Fields are used by Lumen, enabling this at the asset level might not immediately solve the actor's rendering issue if 'Affects Global Illumination' is disabled at the component level.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Increase the 'Lightmap Resolution' for the <strong>Static Mesh Component</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.09hrs. Lightmap resolution is for static baked lighting. The scenario uses a 'dynamic directional light' and 'Lumen enabled', making lightmaps less relevant for the primary issue of lacking dynamic reflections/GI.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "lightingrendering",
            "title": "Inspect Ray Tracing Visibility",
            "prompt": "<p>The <strong>statue</strong> has 'Affects Global Illumination' enabled, but the highly reflective surface is still pitch black. What specialized visibility setting is critical for advanced reflections?</p>",
            "choices": [
                {
                    "text": "<p>Locate 'Visible in Ray Tracing' (in the 'Rendering' section) and confirm it is checked.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.08hrs. For Lumen's higher quality reflections (which rely on ray tracing), this setting is crucial. If unchecked, metallic objects often appear black.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Check the 'Ray Tracing' section in <strong>Project Settings</strong> and enable all features.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.09hrs. This is too broad. The problem is specific to *this object* not reflecting, not necessarily all ray tracing features being off globally. Focusing on the object's specific setting is more direct.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Disable 'Cast Ray Traced Shadows' to improve performance.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. This setting affects shadows, not the visibility of the object in reflections itself. Disabling it wouldn't solve the black appearance.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Set 'Translucency Type' to <code>Surface ForwardShading</code> to ensure proper rendering.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.12hrs. The object is a solid metallic statue, not a translucent material. This setting is irrelevant to the problem.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "lightingrendering",
            "title": "Assess Object Rendering State",
            "prompt": "<p>You've checked 'Visible in Ray Tracing'. The <strong>statue</strong> is *still* uniformly pitch black in the viewport. What do you infer?</p>",
            "choices": [
                {
                    "text": "<p>The issue persists, indicating further investigation into global Lumen and reflection settings is required.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.03hrs. If a critical per-object setting didn't fix it, the problem is likely at a higher, scene-wide or project-wide level.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>The material's <strong>Base Color</strong> input must be disconnected or set to black.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. The scenario explicitly states the 'Material Instance has Metallic set to 1.0 and Roughness set to 0.1', implying base color is fine. Rechecking this after deeper diagnostics is inefficient.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>The <strong>Static Mesh Asset</strong> might be corrupted and needs re-importing.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While possible, a corrupted mesh would often exhibit other issues (missing geometry, strange normals) rather than just being uniformly black while other scene elements render correctly. This is a very last resort.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>The <strong>Material Instance</strong> needs to be recompiled to apply changes.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. Material instances typically apply changes immediately without recompilation unless the parent material's graph was modified. This isn't the likely cause for a persistent issue.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "lightingrendering",
            "title": "Verify Project GI Method",
            "prompt": "<p>Per-object settings are correct, but the statue still lacks reflections. What project-wide setting should you check to ensure Lumen is the active Global Illumination method?</p>",
            "choices": [
                {
                    "text": "<p>Open <strong>Project Settings</strong> and navigate to 'Rendering', then confirm 'Global Illumination Method' is set to <code>Lumen</code>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.07hrs. This global setting is fundamental to ensuring Lumen is active for Global Illumination across the project.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Change 'Global Illumination Method' to <code>None</code> to confirm Lumen isn't causing interference.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.12hrs. Setting the GI method to <code>None</code> would remove all indirect lighting, almost guaranteeing the object remains black and directly contradicting the scenario's use of Lumen.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Check the <strong>World Settings</strong> panel for 'Force No Precomputed Lighting'.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.09hrs. While important for fully dynamic scenes, the primary setting for activating Lumen as the GI method is in <strong>Project Settings</strong>. This is a secondary, less direct check.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Run <code>r.Lumen.Visualize 1</code> in the console to debug Lumen's internal workings.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. Debugging Lumen visualization is useful *after* confirming Lumen is enabled globally. Jumping to visualization when the enabling setting itself might be wrong is premature.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "lightingrendering",
            "title": "Verify Project Reflection Method",
            "prompt": "<p><strong>Project Settings</strong> confirm 'Global Illumination Method' is <code>Lumen</code>. What related project-wide setting should be checked to ensure Lumen handles reflections?</p>",
            "choices": [
                {
                    "text": "<p>In <strong>Project Settings</strong>, navigate to 'Rendering' and confirm 'Reflection Method' is set to <code>Lumen</code>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Lumen provides both GI and reflections. Ensuring both methods are set to Lumen globally is vital for dynamic reflections.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Change 'Reflection Method' to <code>Screen Space Reflections</code> to see if any reflections appear.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While this might show *some* reflections, it's a step back from the full Lumen solution and won't solve the underlying problem if Lumen isn't configured correctly. It misdirects from using the intended Lumen system.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Modify 'Max Frames to Render' in the 'General Settings' section.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. This setting is unrelated to rendering quality or method; it controls editor behavior or movie capture, not reflection technology.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Adjust the 'Anti-Aliasing Method' in <strong>Project Settings</strong> to <code>TSR</code>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. Anti-aliasing affects image smoothness, not the presence or absence of reflections. It's not relevant to a pitch-black reflective object.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "lightingrendering",
            "title": "Check Sky Light Source Type",
            "prompt": "<p>Project-wide Lumen settings are enabled for both GI and reflections. The <strong>statue</strong> is still black. What is crucial for the <strong>Sky Light</strong> to contribute environmental reflections to Lumen?</p>",
            "choices": [
                {
                    "text": "<p>Select the <strong>Sky Light</strong> actor in the scene and ensure its 'Source Type' is set to <code>SLS Captured Scene</code>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. For Lumen to correctly capture and propagate environmental light, the Sky Light needs to capture the scene, not use a specified cube map.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Change the <strong>Sky Light's</strong> 'Source Type' to <code>SLS Specified Cubemap</code> and assign a custom cubemap.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While a cubemap would provide reflections, <code>SLS Captured Scene</code> is typically preferred for dynamic Lumen scenes to ensure real-time environmental reflections. Switching to a static cubemap might not reflect the actual scene.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Increase the <strong>Sky Light's</strong> 'Lightmass Bounce Number' significantly.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Lightmass settings are for baked lighting, which is largely irrelevant in a fully dynamic Lumen scene. This will not fix the issue.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Disable 'Cast Shadows' on the <strong>Sky Light</strong> to ensure it always illuminates.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. Disabling shadows on a Sky Light might slightly brighten indirect areas but won't solve the core problem of a completely black reflective surface that isn't receiving any reflections or GI.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "lightingrendering",
            "title": "Check Sky Light Intensity",
            "prompt": "<p>The <strong>Sky Light's</strong> 'Source Type' is <code>SLS Captured Scene</code>. What other <strong>Sky Light</strong> property needs verifying for proper scene contribution?</p>",
            "choices": [
                {
                    "text": "<p>Confirm the <strong>Sky Light's</strong> 'Intensity' is a visible value (e.g., <code>1.0</code>).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. A Sky Light with zero intensity, even if configured correctly, would contribute no light or reflections to the scene, leaving objects dark.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Set the <strong>Sky Light's</strong> 'Volumetric Scattering Intensity' to a high value.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.06hrs. Volumetric scattering primarily affects fog/clouds. While it contributes to atmospheric effects, it's not the primary control for overall sky light intensity or object reflections.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Set 'Cubemap Resolution' to the highest possible value for better quality.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.09hrs. This would improve the *quality* of the captured cubemap, but if the intensity is zero, increasing resolution won't make anything visible. It's premature optimization.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Disable the <strong>Sky Light</strong> entirely to isolate the problem to the <strong>Directional Light</strong>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. The Sky Light is crucial for environmental reflections and indirect light. Disabling it would remove a vital component for highly reflective metallic objects.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "lightingrendering",
            "title": "Visualize World Reflections",
            "prompt": "<p>The <strong>Sky Light</strong> is correctly configured and has positive intensity. Still no visible reflections. How can you visually confirm if any reflection data is reaching the object?</p>",
            "choices": [
                {
                    "text": "<p>In the <strong>Editor Viewport</strong>, switch the view mode to 'Buffer Visualization -> World Reflection'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.06hrs. This buffer visualization mode allows you to see exactly what reflection data (or lack thereof) is being rendered on surfaces, which is critical for debugging reflection issues.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Use <code>showflag.Reflections 0</code> in the console to toggle reflections off and on.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Toggling reflections only confirms if the system is *active*, not what data is being rendered on the object itself. Buffer visualization is more granular.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Enable 'Show Collision' in the <strong>Editor Viewport</strong> to see if the mesh is actually present.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The object is clearly visible as pitch black, so collision visualization is irrelevant to its rendering state or reflections.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Open the 'Shader Complexity' view mode to check material performance.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.09hrs. Shader complexity is for performance optimization, not for diagnosing a complete absence of reflection data. It wouldn't help understand why the object is black.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "lightingrendering",
            "title": "Review Reflection Capture Actors",
            "prompt": "<p><strong>Buffer Visualization -> World Reflection</strong> shows no reflection data on the statue. If <strong>Reflection Capture</strong> actors are still in the scene, what should be checked?</p>",
            "choices": [
                {
                    "text": "<p>If a dedicated <strong>Reflection Capture</strong> actor is present near the statue, check its influence bounds to ensure the statue is fully contained.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Although Lumen reduces the reliance on these, old captures can still interfere or be used as a fallback. Ensuring proper bounds (or removal if truly Lumen-only) is a good check.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Manually place multiple <strong>Sphere Reflection Capture</strong> actors across the scene and run 'Build Reflection Captures'.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. The scenario explicitly states 'Lumen enabled'. Spending time manually placing legacy <strong>Reflection Capture</strong> actors and building them is wasteful and assumes Lumen is disabled or misconfigured when it should be the primary reflection system.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Increase the 'Capture Distance' property on the <strong>Reflection Capture</strong> actor.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. While increasing capture distance might extend influence, the key issue is ensuring the object is *within* the capture's bounds. Simply increasing distance without verifying bounds isn't as direct.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Set the <strong>Reflection Capture's</strong> 'Mobility' to <code>Movable</code> to ensure dynamic updates.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. <strong>Reflection Capture</strong> actors are typically static and baked. Their mobility isn't relevant for their core function and changing it wouldn't solve a bounds issue.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "lightingrendering",
            "title": "Inspect Post Process Volume Bounds",
            "prompt": "<p>Reflection Captures are either correctly set or irrelevant. Still no reflections. What is critical about the <strong>Post Process Volume</strong> for global rendering effects?</p>",
            "choices": [
                {
                    "text": "<p>Select the <strong>Post Process Volume</strong> in the scene and ensure the 'Unbound' property is checked, or that the statue is within the volume's bounds.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.04hrs. Post Process Volumes control many rendering features, including Lumen. If the volume is bound and the object is outside it, the object won't receive those effects.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Disable all post-processing effects within the <strong>Post Process Volume</strong> to simplify rendering.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. Disabling post-processing would likely turn off Lumen's GI and reflections, worsening the problem. This is counterproductive.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Increase the 'Blend Weight' property on the <strong>Post Process Volume</strong> to <code>1.0</code>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.06hrs. While a blend weight of <code>1.0</code> is ideal, the primary issue is whether the volume is *affecting* the area at all (via 'Unbound' or bounds), not just its intensity. If it's not affecting the area, blend weight is moot.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Change the <strong>Post Process Volume's</strong> 'Priority' to a higher number.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. Priority is only relevant when multiple overlapping volumes exist. If there's only one or if it's not affecting the area at all, priority won't solve the issue.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "lightingrendering",
            "title": "Confirm Post Process Global Illumination",
            "prompt": "<p>The <strong>Post Process Volume</strong> is affecting the scene. What specific <strong>Post Process Volume</strong> setting must be checked to ensure Lumen's Global Illumination is active?</p>",
            "choices": [
                {
                    "text": "<p>In the <strong>Post Process Volume</strong> settings, search for 'Lumen' and confirm 'Global Illumination' is explicitly set to <code>Lumen</code> or <code>Final Gather</code>, with non-zero intensity.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Even if Lumen is enabled in Project Settings, the Post Process Volume can override or disable it locally. This is a critical check.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Set the <strong>Post Process Volume's</strong> 'Exposure Compensation' to a high value.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Exposure compensation brightens the scene globally, but it won't *create* reflections or solve the underlying problem of Lumen's GI not being active. It would just make a black object slightly less black, not reflective.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Disable 'Ambient Occlusion' in the <strong>Post Process Volume</strong>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. Ambient Occlusion is a separate effect. Disabling it won't activate Lumen's Global Illumination if it's already off. It's irrelevant to the core problem.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Adjust the <strong>Post Process Volume's</strong> 'Bloom Intensity'.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.06hrs. Bloom affects bright areas and glow, not fundamental GI or reflections on a metallic surface. This won't resolve the pitch-black issue.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "lightingrendering",
            "title": "Confirm Post Process Reflections",
            "prompt": "<p>The <strong>Post Process Volume's</strong> 'Global Illumination' for Lumen is confirmed. What specific <strong>Post Process Volume</strong> setting must be checked for Lumen's reflections?</p>",
            "choices": [
                {
                    "text": "<p>In the <strong>Post Process Volume</strong> settings, search for 'Lumen' and confirm 'Reflections' is explicitly set to <code>Lumen</code> or <code>Final Gather</code>, with non-zero intensity.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Just like GI, the Post Process Volume can override or disable Lumen reflections. This explicit check ensures Lumen is active for reflection rendering.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Change 'Reflections Type' to <code>Screen Space</code> to enable basic reflections.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. Switching to Screen Space Reflections would abandon the superior Lumen reflections and might not even work correctly if the underlying Lumen setup is flawed. It's not the goal to replace Lumen.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Increase 'Reflection Quality' in the 'Screen Space Reflections' section.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. This setting only applies if 'Screen Space Reflections' is active. If Lumen is intended for reflections, this parameter is irrelevant.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Disable 'Lens Flares' in the <strong>Post Process Volume</strong>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.06hrs. Lens flares are a visual effect for bright lights, completely unrelated to reflection systems or a pitch-black object.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "lightingrendering",
            "title": "Final Ray Tracing Visibility Check",
            "prompt": "<p>All project, sky light, and post-process settings for Lumen GI and Reflections are confirmed. The statue *still* looks black. What object-specific setting should be reviewed one last time, in case it was toggled or overlooked?</p>",
            "choices": [
                {
                    "text": "<p>Return to the problematic <strong>Static Mesh Actor</strong> and specifically review the 'Visible in Ray Tracing' setting one last time.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.03hrs. Sometimes, settings can be accidentally changed or the initial check might have been superficial. Reconfirming this critical setting is a good final per-object verification.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Modify the 'Min Render Distance' on the <strong>Static Mesh Component</strong>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. 'Min Render Distance' is for culling objects that are too close. If the object is pitch black, it's rendering but not being lit; this setting won't help.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Enable 'Show Collision' to confirm the mesh is physically present.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The object is visually present (as black), so collision is irrelevant to its rendering and reflection issue.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Try changing the statue's <strong>Material Instance</strong> to a completely different, simpler material to test rendering.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. This step was largely ruled out early on by confirming the material instance. Reverting to this now is inefficient after checking global systems, as the issue is clearly system-level.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "lightingrendering",
            "title": "Verify In-Game Visibility",
            "prompt": "<p>After all checks, the <strong>statue</strong> *still* appears black in the editor and in PIE. What final visibility check ensures it's rendering correctly during gameplay?</p>",
            "choices": [
                {
                    "text": "<p>Final verification: Ensure the <strong>Static Mesh Component's</strong> 'Hidden In Game' property is not checked.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.06hrs. While less likely to cause a black object in the editor, 'Hidden In Game' would certainly prevent it from appearing in PIE. This is a crucial final check for consistent behavior.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Enable 'Wireframe' view mode to confirm the mesh geometry.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Wireframe mode shows geometry, but not lighting or reflections. The object is visible as black, so geometry is confirmed.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Increase the 'Draw Distance' for the <strong>Static Mesh Component</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.07hrs. Draw distance affects culling for objects far away. The statue is presumably close and visible (as black), so this won't help.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Open the <strong>Content Browser</strong> and re-import the <strong>Static Mesh Asset</strong> from disk.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. This is a very drastic step that assumes asset corruption, which is highly unlikely given the scenario's symptoms. It's a last resort after all rendering and lighting settings are exhausted.</p>",
                    "next": "step-18"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario. The metallic statue is now correctly reflecting the scene with Lumen enabled.</p>",
            "choices": [{"text": "Complete Scenario", "type": "correct", "feedback": "", "next": "end"}]
        }
    }
};
