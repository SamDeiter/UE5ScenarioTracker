window.SCENARIOS['EmissiveGILightingFix'] = {
    "meta": {
        "title": "Missing Lumen Global Illumination from Emissive Materials",
        "description": "The scene contains several custom meshes textured with a powerful emissive material (acting as futuristic wall lights). While the materials themselves glow brightly when viewed directly, they cast absolutely no dynamic light or bounce light onto nearby static geometry, even though Lumen Global Illumination is enabled. If the primary Directional Light is disabled, the level becomes completely dark, proving the emissive sources are not being registered as light contributors. The intent is for the emissive material to provide soft, dynamic indirect lighting.",
        "estimateHours": 1.75,
        "category": "Lighting & Rendering"
    },
    "setup": [
        {
            "action": "set_ue_property",
            "scenario": "EmissiveGILightingFix",
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
            "scenario": "EmissiveGILightingFix",
            "step": "final"
        }
    ],
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "lightingrendering",
            "title": "Initial Assessment",
            "prompt": "<p>You have emissive materials glowing but not contributing to global illumination, even with Lumen enabled. What's the first thing to check in Project Settings?</p>",
            "choices": [
                {
                    "text": "<p>Verify Dynamic Global Illumination Method is set to 'Lumen' in Project Settings > Rendering.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Essential to confirm Lumen GI is the active method. Without this, no emissive GI will be calculated.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Attempt to manually build lighting for the level.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Lumen is a dynamic GI system; building lighting is irrelevant and wasteful for this problem.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Adjust the primary Directional Light intensity in the level.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.3hrs. This won't affect emissive material GI contribution, only the direct lighting from the sun.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Change the level's sky dome mesh or material.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. The sky dome affects sky lighting, not emissive GI directly. This is an unrelated visual adjustment.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "lightingrendering",
            "title": "Project Settings Check",
            "prompt": "<p>You've confirmed Lumen GI is active. What's another critical Lumen-related setting to verify in Project Settings > Rendering?</p>",
            "choices": [
                {
                    "text": "<p>Verify Reflection Method is set to 'Lumen' in Project Settings > Rendering.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Lumen GI often relies on the Lumen reflection pipeline for accurate bounced light interactions.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Increase the 'Exposure Compensation' in Project Settings > Rendering.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This would brighten the entire scene, but not solve the underlying issue of missing emissive GI.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Set the default 'Translucency Lighting Mode' to 'Surface Forward Shading'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. This setting affects translucent materials, not the emissive GI of opaque materials.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Disable 'Volumetric Fog' to see if it's interfering.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.08hrs. While fog can obscure light, disabling it won't resolve a lack of GI contribution from emissive sources.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "lightingrendering",
            "title": "Material Properties",
            "prompt": "<p>Project settings are good. Next, open the emissive material (e.g., M_NeonStrip). What's a fundamental material property to check first?</p>",
            "choices": [
                {
                    "text": "<p>Check that the 'Shading Model' in the Material Details panel is set to 'Default Lit'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.08hrs. Only 'Default Lit' (or other lit models) can properly interact with lighting and GI systems like Lumen.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Change the material's 'Blend Mode' to 'Translucent'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.25hrs. Changing to Translucent or Masked often disables emissive GI contribution, making the problem worse.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Increase the 'Roughness' value in the material.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Roughness affects reflections and specular highlights, not the core emissive GI contribution.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Adjust the material's 'Normal' map intensity.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.07hrs. Normal maps affect surface detail and lighting direction, but not the emissive light contribution itself.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "lightingrendering",
            "title": "Material Emissive Settings",
            "prompt": "<p>The shading model is 'Default Lit'. What specific flag within the material properties enables emissive materials to act as light sources for Lumen?</p>",
            "choices": [
                {
                    "text": "<p>In Material Details > Lighting, ensure 'Use Emissive for Dynamic Area Lighting' is checked.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.08hrs. This crucial flag explicitly tells Lumen to consider the material's emissive output as a GI source.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Set the 'Two Sided' flag in the Material Details panel.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Two Sided' renders both sides of a mesh but doesn't enable emissive GI.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Increase the 'Opacity Mask Clip Value' for the material.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.07hrs. This only applies to masked materials and doesn't influence emissive GI contribution.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Change the 'Blend Mode' to 'Additive' for brighter glow.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.25hrs. Additive blend mode can prevent emissive GI or cause unexpected rendering issues for lit materials.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "lightingrendering",
            "title": "Material Emissive Intensity",
            "prompt": "<p>The 'Use Emissive for Dynamic Area Lighting' flag is checked. Now, within the material graph, what ensures the emissive light is strong enough to contribute meaningfully?</p>",
            "choices": [
                {
                    "text": "<p>Verify the Emissive color intensity in the material graph is sufficiently high and connected to 'Emissive Color' output.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.07hrs. An emissive value that is too low will result in negligible or invisible GI contribution.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Connect a 'Fresnel' node to the Emissive Color.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Fresnel affects the edge glow based on view angle, not the overall GI contribution.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Multiply the Base Color by a high constant value.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.08hrs. The Base Color output is for diffuse color, not emissive light contribution.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Ensure the texture sampler for the emissive material uses 'Linear Grayscale' mode.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.06hrs. While texture sampler settings are important, this specific mode doesn't directly control emissive GI intensity.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "lightingrendering",
            "title": "Mesh Component Properties",
            "prompt": "<p>Material settings are correct. Next, select the actual Static Mesh Actor in the level. What component do you need to check?</p>",
            "choices": [
                {
                    "text": "<p>Select the Static Mesh Actor (SM_WallLight) and check the 'Static Mesh' component in the Details panel.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.04hrs. The component itself has properties that affect how it interacts with lighting systems.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Look for a 'Lightmass Importance Volume' in the level.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.07hrs. Lightmass Importance Volumes are for baked lighting, not Lumen's dynamic GI.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Inspect the 'World Outliner' to see if the mesh is hidden.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. If the mesh were hidden, it wouldn't glow directly either, so this isn't the primary problem.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Check the mesh's 'Mobility' setting to ensure it's 'Movable'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.06hrs. While mobility is important, even static meshes can contribute to Lumen GI with correct settings.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "lightingrendering",
            "title": "Mesh Shadow Settings",
            "prompt": "<p>You're in the mesh component details. What critical 'Lighting' property might prevent emissive GI, even for soft contributions?</p>",
            "choices": [
                {
                    "text": "<p>Ensure 'Cast Shadows' is checked for the mesh component.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.07hrs. Lumen often requires meshes to cast shadows (even if soft) to properly register them as GI contributors.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Adjust the 'Shadow Bias' for the mesh component.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Shadow bias affects shadow quality and accuracy, but not the decision to cast shadows for GI.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Change the mesh's 'Lightmap Resolution'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. Lightmap resolution is for baked lighting, not Lumen GI.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Set 'Receive Decals' to false for the mesh.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.04hrs. Decal reception is unrelated to light contribution.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "lightingrendering",
            "title": "Post Process Volume",
            "prompt": "<p>Mesh settings checked. Now, locate the Post Process Volume in your level. If none exists, you might need to add one.</p>",
            "choices": [
                {
                    "text": "<p>Locate the Post Process Volume in the level (or add a new infinite one if missing).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Post Process Volumes are crucial for overriding and configuring rendering features like Lumen GI.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Change the 'World Settings' > 'Lightmass' settings.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Lightmass settings are for baked lighting, not Lumen.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Search for 'Atmospheric Fog' in the World Outliner.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.07hrs. Atmospheric fog is an environmental effect, not directly related to GI configuration.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Look for 'Reflection Capture' actors in the level.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.06hrs. Reflection captures are for static reflections, not dynamic Lumen GI. Lumen handles reflections dynamically.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "lightingrendering",
            "title": "Post Process GI Override",
            "prompt": "<p>You have a Post Process Volume. What's the first step to ensure its GI settings are active and not default?</p>",
            "choices": [
                {
                    "text": "<p>In the Post Process Volume, enable the 'Global Illumination' category override.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Overriding the category allows you to customize Lumen GI settings for the volume's bounds.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Enable 'Screen Space Reflections' in the Post Process Volume.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Screen Space Reflections are a different, less accurate reflection method and unrelated to Lumen GI.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Increase the 'Exposure' setting in the Post Process Volume.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Exposure brightens or darkens the image, but doesn't add missing light sources.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Adjust the 'White Balance' temperature.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.03hrs. White balance affects color temperature, not light contribution.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "lightingrendering",
            "title": "Post Process GI Method",
            "prompt": "<p>With the GI category overridden, what's the next setting to explicitly confirm for Lumen GI within the Post Process Volume?</p>",
            "choices": [
                {
                    "text": "<p>Under Global Illumination, ensure 'Method' is explicitly set to 'Lumen'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. This ensures the volume is using Lumen for GI, not another method like Screen Space GI or none.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Set the 'Ambient Occlusion Method' to 'SSAO'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.07hrs. Ambient Occlusion is a separate effect for contact shadows, not global illumination.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Increase 'Bloom Intensity' in the Post Process Volume.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Bloom enhances the glow of bright areas but won't generate missing indirect light.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Change the 'Film Tone Mapper Type' to 'ACES'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.04hrs. Tone mapping affects the final look, not the calculation of emissive GI.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "lightingrendering",
            "title": "Post Process Emissive Contribution",
            "prompt": "<p>Lumen GI is active in the Post Process Volume. What specific Lumen GI setting directly controls the strength of emissive light contribution?</p>",
            "choices": [
                {
                    "text": "<p>Under Global Illumination > Lumen, check the 'Emissive Light Contribution' slider and ensure it is set to 1.0 (or higher).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. This slider is a direct multiplier for emissive light's impact on Lumen GI; if it's 0, there will be no contribution.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Set 'Ray Tracing Global Illumination' method to 'Brute Force'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This setting is for hardware ray tracing GI, which Lumen can use, but 'Emissive Light Contribution' is more direct for emissives.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Increase the 'Exposure Bias' for the scene.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Exposure only adjusts the overall brightness of the image, not the specific emissive GI contribution.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Lower the 'Reflections' > 'Max Roughness' value.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.06hrs. This affects how rough surfaces reflect light, not how emissive materials contribute to GI.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "lightingrendering",
            "title": "Post Process Final Gather Quality",
            "prompt": "<p>Emissive Light Contribution is enabled. To ensure smooth and integrated light, what quality setting should be checked?</p>",
            "choices": [
                {
                    "text": "<p>Under Global Illumination > Lumen, confirm 'Final Gather Quality' is set to a reasonable value (e.g., 2.0 or 3.0).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.06hrs. Higher Final Gather Quality values result in better light integration and less splotchiness from GI.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Increase the 'Screen Percentage' in the Post Process Volume.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Screen percentage scales rendering resolution, affecting overall clarity, not GI quality specifically.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Set 'Anti-Aliasing Method' to 'TSAA'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.07hrs. Anti-aliasing smooths jagged edges, which is unrelated to GI light integration.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Adjust the 'Film Saturation' parameter.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.03hrs. Film saturation affects color vibrancy, not the quality of light bounces.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "lightingrendering",
            "title": "Mesh UVs",
            "prompt": "<p>Post Process settings are configured. Let's revisit the mesh itself. Why might its UVs be relevant for Lumen GI, even though Lumen doesn't use lightmaps?</p>",
            "choices": [
                {
                    "text": "<p>Review the mesh UVs: open the Static Mesh Editor and ensure UV Channel 0 is appropriately unwrapped without overlapping regions.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.15hrs. Lumen uses UV0 for surface cache sampling, and poor UVs can lead to incorrect or missing GI contribution from emissive surfaces.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Change the mesh's 'Collision Complexity' to 'Use Complex As Simple'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Collision settings are for physics interactions, entirely unrelated to rendering GI.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Re-import the mesh with 'Generate Missing Collision' enabled.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Re-importing for collision issues is not relevant to Lumen GI problems, which are rendering-focused.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Ensure 'Tangents' are recomputed during mesh import settings.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.07hrs. Tangents are crucial for normal mapping but don't directly control emissive GI contribution from UVs.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "lightingrendering",
            "title": "Mesh Emissive Scale",
            "prompt": "<p>UVs are good. Back in the level, on the mesh component, there's a specific 'Emissive Light Source' property that can prevent Lumen from registering it. What is it?</p>",
            "choices": [
                {
                    "text": "<p>Adjust the 'Emissive Light Source: Scale' property on the mesh component. If scale is 0, set to 1.0 or higher.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. If this scale is 0, Lumen effectively ignores the emissive surface as a light source. It needs to be sufficiently high.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Set the mesh 'Mobility' to 'Static' and rebuild the scene.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Lumen handles dynamic GI; changing mobility won't fix a zero scale issue and building static lighting is irrelevant.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Disable 'Visible in Ray Tracing' for the mesh component.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.07hrs. Disabling visibility in ray tracing would prevent it from being seen by Lumen's ray tracing, making the problem worse.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Change the mesh's 'Lightmap Coordinate Index' to 1.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This setting is for baked lightmaps and doesn't apply to Lumen's dynamic GI.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "lightingrendering",
            "title": "Project Ray Tracing Settings",
            "prompt": "<p>Mesh properties set. Now, search Project Settings again, specifically for 'Lumen Global Illumination'. What ray tracing option might affect emissive GI?</p>",
            "choices": [
                {
                    "text": "<p>Ensure 'Hardware Ray Tracing' is set to 'Enabled' or 'Support Global Illumination and Reflections'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.04hrs. Hardware Ray Tracing enhances Lumen's accuracy and coverage, especially for complex lighting scenarios including emissives.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Disable 'Volumetric Cloud' support in Project Settings.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Volumetric clouds are an environmental feature, unrelated to internal GI calculation.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Enable 'Virtual Texture Support' for the project.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.08hrs. Virtual textures are for handling large textures, not directly impacting emissive GI functionality.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Increase the 'Max FPS' limit in Project Settings.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.03hrs. FPS limits affect performance, not rendering features like Lumen GI.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "lightingrendering",
            "title": "Hardware Ray Tracing",
            "prompt": "<p>You've found the Lumen Global Illumination settings. What's the specific 'Hardware Ray Tracing' configuration you need to verify for robust Lumen GI?</p>",
            "choices": [
                {
                    "text": "<p>Ensure 'Hardware Ray Tracing' is set to 'Enabled' or 'Support Global Illumination and Reflections'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.07hrs. This ensures the project can leverage hardware RT for Lumen, which is critical for maximum path support and accuracy with emissive GI.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Set 'Use Hardware Ray Tracing When Available' to 'False'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This would disable hardware ray tracing, potentially reducing Lumen's quality and accuracy for emissive GI.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Enable 'Virtual Shadow Maps' in Project Settings.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.08hrs. Virtual Shadow Maps are for improving direct light shadows, not emissive GI itself.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Increase the 'Lumen Scene View Distance'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.06hrs. This affects the distance Lumen traces, which is important, but the hardware RT setting is more fundamental.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "lightingrendering",
            "title": "Software Ray Tracing Mode",
            "prompt": "<p>If you're relying on Software Ray Tracing (or as a fallback), what 'Software Ray Tracing Mode' is necessary for proper scene coverage and emissive GI?</p>",
            "choices": [
                {
                    "text": "<p>If using Software Ray Tracing, ensure the 'Software Ray Tracing Mode' is set to 'Global'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.07hrs. 'Global' mode ensures Lumen's software ray tracing covers the entire scene effectively, allowing emissive light to propagate.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Set 'Software Ray Tracing Mode' to 'Detail'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Detail' mode is less comprehensive and might miss larger-scale GI contributions from emissives.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Disable 'Nanite Support' for the project.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Nanite is a mesh virtualization system; disabling it is irrelevant to Lumen's ray tracing mode.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Adjust the 'Max LOD Level' for static meshes in Project Settings.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.06hrs. LOD settings affect mesh detail at distance, not the fundamental ray tracing mode for GI.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "lightingrendering",
            "title": "Console Variable: Emissive Radiance",
            "prompt": "<p>With Project Settings configured, let's check some console variables. What command ensures emissive contribution calculation is enabled at the engine level?</p>",
            "choices": [
                {
                    "text": "<p>Open the console (~) and type 'r.Lumen.EmissiveRadiance 1'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This console variable explicitly enables or disables the calculation of emissive light radiance for Lumen. It should be 1 by default, but verification is key.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Type 'stat unit' to check frame rates.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.03hrs. 'stat unit' checks performance, not rendering feature states.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Type 'showflag.LumenScene 0' to disable Lumen visualization.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This would disable a Lumen visualization, making debugging harder, not solving the emissive GI issue.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Use 'r.ScreenPercentage 50' to reduce rendering resolution.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.04hrs. This command affects rendering resolution for performance, not a specific Lumen GI feature.</p>",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "lightingrendering",
            "title": "Console Variable: Surface Cache Resolution",
            "prompt": "<p>Emissive Radiance is enabled. For smaller emissive sources, what console command can help ensure Lumen's surface cache captures their detail effectively?</p>",
            "choices": [
                {
                    "text": "<p>Type 'r.Lumen.EmissiveLightSourceSurfaceCacheResolution 1' into the console.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This ensures the surface cache has sufficient resolution to properly sample and propagate light from small emissive sources.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Type 'r.ForceLOD 0' to force highest mesh detail.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Forcing LODs affects mesh detail, not the specific emissive surface cache resolution for Lumen.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Type 'r.Shadow.DistanceScale 0.5' to reduce shadow distance.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.07hrs. This affects shadow rendering distance, which is unrelated to emissive GI surface cache.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Type 'r.PostProcessAAQuality 4' to improve anti-aliasing.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.04hrs. Anti-aliasing quality is a post-processing effect, not related to Lumen's internal surface cache for emissives.</p>",
                    "next": "step-19"
                }
            ]
        },
        "step-20": {
            "skill": "lightingrendering",
            "title": "Material Instance Check",
            "prompt": "<p>You've checked engine-level console variables. What final material-related check should be made at the asset level to ensure no overrides are causing issues?</p>",
            "choices": [
                {
                    "text": "<p>Check the Material Instance applied to the mesh to ensure no parameter (like Emissive Multiplier) was overridden and set back to zero.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.08hrs. Material instances can easily override parent material settings, potentially neutralizing the emissive output.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Recompile all shaders in the project.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. While sometimes necessary after major changes, it's a brute-force approach and unlikely to fix an instance parameter override.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Adjust the 'Color Grading Global Saturation' in the Post Process Volume.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Color grading affects the final image look, not the underlying light contribution from emissive materials.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Place a standard Point Light near the emissive object and hide it.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. This fakes the lighting effect, bypassing the emissive GI pipeline fix, and is not a solution.</p>",
                    "next": "step-20"
                }
            ]
        },
        "step-21": {
            "skill": "lightingrendering",
            "title": "Update Reflections",
            "prompt": "<p>Material instances are good. Although Lumen is dynamic, sometimes certain cached aspects can get stale. What's a common 'build' step that might help, even for dynamic systems?</p>",
            "choices": [
                {
                    "text": "<p>Hit 'Build' > 'Build Reflection Captures' to update indirect lighting cache.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. While Lumen is dynamic, sometimes refreshing reflection captures can help align certain rendering aspects or clear visualization glitches.</p>",
                    "next": "step-22"
                },
                {
                    "text": "<p>Attempt to manually build lighting ('Build Lighting Only').</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Lumen is dynamic GI; baked lighting builds are irrelevant and won't fix dynamic emissive GI.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Build the entire project to an executable.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. Building the project to an executable is an extreme step for a debugging issue and won't resolve an in-editor rendering problem.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Change the 'Editor Sky Sphere' actor's material.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This is a visual change to the editor's background, not related to the actual level's lighting cache.</p>",
                    "next": "step-21"
                }
            ]
        },
        "step-22": {
            "skill": "lightingrendering",
            "title": "Final Reset",
            "prompt": "<p>You've tried all logical steps. What's the final, often overlooked, troubleshooting step for persistent rendering issues?</p>",
            "choices": [
                {
                    "text": "<p>Save the level, close the editor, restart UE5, and reload the level to clear any potential transient rendering bugs.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.08hrs. A clean restart can resolve many transient rendering issues or corrupted editor states that might persist across saves.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Delete the 'Saved' and 'Intermediate' folders of the project.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. While sometimes necessary for severe corruption, this is a drastic step and often not needed for a simple rendering refresh. It can also lead to longer reload times.</p>",
                    "next": "step-22"
                },
                {
                    "text": "<p>Reinstall Unreal Engine 5 completely.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +2.0hrs. Reinstalling is a last resort and disproportionate to most debugging issues, especially for a specific rendering feature.</p>",
                    "next": "step-22"
                },
                {
                    "text": "<p>Open a new, empty level and copy over your problematic assets.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.15hrs. While useful for isolating issues, restarting the editor is usually quicker and often achieves the same 'clean state' for rendering.</p>",
                    "next": "step-22"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario.</p>",
            "choices": [{"text": "Complete Scenario", "type": "correct", "feedback": "", "next": "end"}]
        }
    }
};
