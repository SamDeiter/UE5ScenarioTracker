window.SCENARIOS['DecalTextureAlphaMaskFailure'] = {
    "meta": {
        "title": "Deferred Decal Material Renders as Solid Opaque White Square",
        "description": "A newly implemented Deferred Decal material, intended to display a scorch mark using the texture's alpha channel for opacity masking, is failing. When the decal actor is placed on any surface, it renders as a completely solid, fully opaque, bright white square that obscures the underlying geometry texture, regardless of the Decal Material parameters set in the Material Instance. The visual result suggests the opacity mask is being ignored or treated as 1.0 everywhere.",
        "estimateHours": 1.45,
        "category": "Materials & Shaders",
        "tokens_used": 10718
    },
    "setup": [
        {
            "action": "set_ue_property",
            "scenario": "DecalTextureAlphaMaskFailure",
            "step": "step-0"
        }
    ],
    "fault": {
        "description": "Initial problem state for DecalTextureAlphaMaskFailure",
        "visual_cue": "Visual indicator of issue"
    },
    "expected": {
        "description": "Expected resolved state",
        "validation_action": "verify_fix"
    },
    "fix": [
        {
            "action": "set_ue_property",
            "scenario": "DecalTextureAlphaMaskFailure",
            "step": "final"
        }
    ],
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "materialsshaders",
            "image_path": "assets/generated/DecalTextureAlphaMaskFailure/step-1.png",
            "title": "Investigate Decal Actor Assignment",
            "prompt": "<p>A newly placed <strong>Decal Actor</strong> in the level renders as a solid, opaque white square, obscuring the underlying geometry.</p><p>How do you begin investigating this visual issue?</p>",
            "choices": [
                {
                    "text": "<p>Select the <strong>Decal Actor</strong> in the <strong>Level Outliner</strong> and verify its <strong>Decal Material</strong> slot in the <strong>Details</strong> panel.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. It's crucial to first confirm that the correct material instance is assigned to the decal actor, as a misassignment could lead to unexpected rendering.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Adjust the <strong>Decal Blend Mode</strong> property on the <strong>Decal Actor</strong> component.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.3hrs. The <strong>Decal Blend Mode</strong> on the actor controls how the decal projects onto geometry (e.g., DBuffer, Transparent), not how the material itself handles opacity. This is a material output issue.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Open <strong>MI_ScorchMark_Decal</strong> directly to inspect its parameters.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While you'll need to open the material instance, it's best practice to first confirm the decal actor itself is correctly referencing it. Skipping this could lead to investigating the wrong asset.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Run <code>stat gpu</code> in the console to check for rendering performance bottlenecks.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. The issue describes an incorrect visual output (solid white), not performance. GPU stats won't help diagnose material setup problems.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "materialsshaders",
            "image_path": "assets/generated/DecalTextureAlphaMaskFailure/step-2.png",
            "title": "Verify Material Instance Parameters",
            "prompt": "<p>You've confirmed the <strong>Decal Actor</strong> references <strong>MI_ScorchMark_Decal</strong>. The material preview in the <strong>Details</strong> panel still shows a solid opaque white square.</p><p>What's your next move to troubleshoot the material's appearance?</p>",
            "choices": [
                {
                    "text": "<p>Open <strong>MI_ScorchMark_Decal</strong> and verify its <strong>Base Color</strong> and <strong>Opacity Mask Texture</strong> parameters are pointing to <strong>T_ScorchMask_Alpha</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. After confirming the correct material instance, inspecting its texture assignments is the next logical step to ensure the correct assets are being used for color and opacity.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Replace the <strong>Base Color Texture</strong> parameter in the <strong>Material Instance</strong> with a completely different texture asset.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. This wastes time confirming parameter functionality when the core problem isn't necessarily the texture's content, but its handling of alpha. Focus on the relevant parameters.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>In the <strong>Material Instance</strong>, look for parameters that might directly control the blend mode.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. <strong>Material Instances</strong> typically expose parameters, but fundamental material settings like <strong>Blend Mode</strong> are usually controlled by the <strong>Parent Material</strong>. This is not the place to look for that.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Try changing the decal's projection depth via the <strong>Decal Actor's</strong> properties.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. Adjusting projection depth will not affect how the material's opacity mask is processed. This is an issue with the material's visual output, not its spatial projection.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "materialsshaders",
            "image_path": "assets/generated/DecalTextureAlphaMaskFailure/step-3.png",
            "title": "Access Parent Material",
            "prompt": "<p>The <strong>Material Instance's</strong> parameters for <strong>Base Color</strong> and <strong>Opacity Mask Texture</strong> correctly point to <strong>T_ScorchMask_Alpha</strong>. The preview within the <strong>Material Instance Editor</strong> still shows a solid white square.</p><p>How should you proceed?</p>",
            "choices": [
                {
                    "text": "<p>In the <strong>Material Instance Editor</strong>, locate and open the <strong>Parent Material</strong>, <strong>M_Base_Decal_Deferred</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Since the <strong>Material Instance</strong> parameters are correct, the issue likely resides in the parent material's setup, which dictates core material behavior like blending and domain.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Add a new scalar parameter for opacity to the <strong>Material Instance</strong> and try to adjust it.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.25hrs. Adding a new parameter and trying to force opacity is premature. The goal is to understand why the existing opacity mask isn't working, not to bypass it. This also requires modifying the parent material first.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Right-click the <strong>T_ScorchMask_Alpha</strong> texture thumbnail in the parameter view and choose 'Reimport'.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While reimporting can sometimes resolve texture issues, it's too early. First, verify the material's fundamental settings are correct before assuming a texture import problem.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Check the <strong>Material Instance's</strong> preview mesh to ensure it's not custom and problematic.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. The preview mesh (usually a sphere or plane) is rarely the cause of a solid white opaque material. Focus on the material's properties themselves.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "materialsshaders",
            "image_path": "assets/generated/DecalTextureAlphaMaskFailure/step-4.png",
            "title": "Verify Material Domain Setting",
            "prompt": "<p>You are now in the <strong>Parent Material</strong> editor. The material appears visually correct in its preview, but the solid white issue persists in the level.</p><p>What's the first setting you should verify in the <strong>Parent Material's Details</strong> panel?</p>",
            "choices": [
                {
                    "text": "<p>Verify that the <strong>Material Domain</strong> in the <strong>Details</strong> panel is set to <code>Deferred Decal</code>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. For a decal, the <strong>Material Domain</strong> <em>must</em> be <code>Deferred Decal</code>. Any other setting will result in incorrect rendering or no decal projection at all.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Examine the <strong>Material Graph</strong> for any complex nodes that might override opacity.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While you will need to check the graph, it's always best to verify the fundamental material settings (like <strong>Material Domain</strong> and <strong>Blend Mode</strong>) first, as these dictate how the material is rendered at a high level.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Look for parameters related to lighting models, like <code>Shading Model</code>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While <strong>Shading Model</strong> is important, it's less likely to cause a completely solid white, opaque decal than an incorrect <strong>Material Domain</strong> or <strong>Blend Mode</strong> for a decal.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Check the <strong>Material Output Log</strong> for compilation warnings.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The output log is useful for compile errors, but a material rendering incorrectly might still compile without warnings. Direct inspection of settings is more effective here.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "materialsshaders",
            "image_path": "assets/generated/DecalTextureAlphaMaskFailure/step-5.png",
            "title": "Confirm Blend Mode Setting",
            "prompt": "<p>You've confirmed the <strong>Material Domain</strong> is <code>Deferred Decal</code>. The decal is still rendering as a solid opaque white square.</p><p>Which other critical material setting should you verify in the <strong>Details</strong> panel?</p>",
            "choices": [
                {
                    "text": "<p>Confirm the <strong>Blend Mode</strong> is set to <code>Masked</code>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. For an opacity mask to function, the <strong>Blend Mode</strong> must be <code>Masked</code>. If it were <code>Opaque</code>, the alpha channel would be ignored entirely, leading to a solid appearance.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Change the <strong>Blend Mode</strong> from <code>Masked</code> to <code>Translucent</code>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.45hrs. Changing to <code>Translucent</code> without solving the underlying texture alpha issue will introduce incorrect lighting, sorting artifacts, and likely still won't display the desired mask. It's a different rendering path.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Check the <strong>Decal Blend Mode</strong> property in the <strong>Details</strong> panel of the <strong>Material Editor</strong>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. There is no 'Decal Blend Mode' property <em>within the Material Editor</em> for the material itself. This setting exists on the <strong>Decal Actor</strong> component, which controls projection, not material blending.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Adjust the <strong>Two Sided</strong> property.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The <strong>Two Sided</strong> property only affects if the backfaces of geometry are rendered; it has no impact on how the material's alpha channel is interpreted for opacity masking.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "materialsshaders",
            "image_path": "assets/generated/DecalTextureAlphaMaskFailure/step-6.png",
            "title": "Examine Opacity Mask Connection",
            "prompt": "<p>The <strong>Material Domain</strong> is <code>Deferred Decal</code> and <strong>Blend Mode</strong> is <code>Masked</code>. Still, the decal renders as a solid opaque white square. This suggests the mask itself might be ignored or misconnected.</p><p>How do you investigate the mask's behavior within the material?</p>",
            "choices": [
                {
                    "text": "<p>Examine the <strong>Material Graph</strong> to ensure the <strong>Opacity Mask</strong> input is correctly receiving the alpha output (A) from the <strong>Texture Sample Parameter</strong> used for <strong>T_ScorchMask_Alpha</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. With core settings correct, the next step is to visually confirm the data flow in the <strong>Material Graph</strong>, ensuring the alpha channel from the texture is indeed wired to the <strong>Opacity Mask</strong> input.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Add a <code>Multiply</code> node to the <strong>Opacity Mask</strong> input to try and manually adjust its intensity.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.25hrs. Adding nodes to 'force' a value is premature. First, verify the existing connections and data integrity. If the alpha data isn't even reaching the input correctly, multiplying it won't help.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Disconnect the <strong>Opacity Mask</strong> input entirely to see if it changes behavior.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. Disconnecting the input will make the material fully opaque by default, which is the current symptom. This won't help diagnose <em>why</em> it's currently opaque with the input connected.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Try changing the <strong>Base Color</strong> input to a solid color to rule out texture issues there.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The problem explicitly states a 'solid opaque white square' regardless of material parameters, indicating an opacity issue, not a base color value problem. Investigating base color is a diversion.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "materialsshaders",
            "image_path": "assets/generated/DecalTextureAlphaMaskFailure/step-7.png",
            "title": "Verify Opacity Mask Clip Value",
            "prompt": "<p>The <strong>Material Graph</strong> shows the <strong>Texture Sample's</strong> alpha output correctly connected to the <strong>Opacity Mask</strong> input. The solid white square persists.</p><p>With a <code>Masked</code> blend mode, what crucial related setting should you verify in the <strong>Material's Details</strong> panel?</p>",
            "choices": [
                {
                    "text": "<p>Confirm the <strong>Opacity Mask Clip Value</strong> is set to a reasonable non-zero value (e.g., <code>0.333</code>).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. For a <code>Masked</code> blend mode, the <strong>Opacity Mask Clip Value</strong> is crucial. If set to <code>0</code> or an extreme value, it can make the entire material opaque or fully transparent, regardless of the input alpha.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Adjust the <strong>Scalar Parameter</strong> controlling the texture tiling or offset.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. Tiling or offset parameters affect the texture's placement on the surface, but have no impact on how the alpha channel is interpreted by the <strong>Opacity Mask Clip Value</strong> or the blend mode.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Attempt to compile the material manually to catch any latent errors.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. The material is already compiled and rendering (albeit incorrectly). Manually compiling again is unlikely to reveal new information if there are no visible compilation errors.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Look for any hidden parameters related to decal depth or projection.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Material settings control appearance, not projection parameters like depth, which are typically found on the <strong>Decal Actor</strong> itself.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "materialsshaders",
            "image_path": "assets/generated/DecalTextureAlphaMaskFailure/step-8.png",
            "title": "Inspect Source Texture Asset",
            "prompt": "<p>The material setup (domain, blend mode, graph connections, clip value) appears logically sound, yet the decal remains a solid opaque white square, ignoring the alpha channel. This suggests the problem might not be in the material logic itself.</p><p>How do you investigate the source of the alpha data?</p>",
            "choices": [
                {
                    "text": "<p>Identify and open the actual texture asset <strong>T_ScorchMask_Alpha</strong> in the <strong>Content Browser</strong> by right-clicking its reference in the <strong>Material Graph</strong> and selecting 'Browse To Asset'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. If the material logic seems correct, the next logical step is to investigate the source data itself \u2013 the texture asset \u2013 to ensure its alpha channel is correctly configured and interpreted by the engine.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Try applying a different basic texture with known working alpha to the <strong>Opacity Mask</strong> input in the material.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While this would confirm the material's ability to use an alpha mask, it doesn't solve the problem for the specific <strong>T_ScorchMask_Alpha</strong> texture. The goal is to fix the existing asset.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Check the engine's <strong>Output Log</strong> for texture-related warnings during loading.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. The output log might have general warnings, but direct inspection of the texture asset's properties is a more targeted and efficient way to diagnose configuration issues.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Recreate the <strong>Material Instance</strong> from scratch to rule out corruption.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.20hrs. This is a drastic step and highly unlikely to solve the problem, especially if the material's parent settings are correct. It wastes significant time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "materialsshaders",
            "image_path": "assets/generated/DecalTextureAlphaMaskFailure/step-9.png",
            "title": "Verify Texture Alpha Presence",
            "prompt": "<p>You've opened <strong>T_ScorchMask_Alpha</strong> in the <strong>Texture Editor</strong>. The texture preview shows a white square, and toggling the alpha channel view still shows a solid white, not a mask.</p><p>What do you do next to confirm the texture's alpha channel data?</p>",
            "choices": [
                {
                    "text": "<p>Verify the texture is being sampled correctly by checking the <strong>Source Texture</strong> properties and confirming the alpha channel is present in the imported source file (usually visible in the <strong>Texture Editor's</strong> preview channels).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. Before adjusting settings, confirm the basic integrity: is the alpha channel actually <em>in</em> the source image, and is the engine reading it at all? The preview channels can help visualize this.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Change the <strong>Texture Group</strong> setting to a different category.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. <strong>Texture Group</strong> affects streaming, LODs, and memory usage. It has no bearing on whether the alpha channel data itself is correctly interpreted and used for masking.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Adjust the <strong>Texture's</strong> resolution via its settings in the <strong>Details</strong> panel.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Changing resolution affects clarity and size, not the fundamental presence or interpretation of the alpha channel data. This won't address an opacity issue.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Re-import the texture from a different file format (e.g., PNG to TGA) without checking settings.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.20hrs. Simply re-importing might not fix the issue if the problem lies in the texture's <em>engine-side settings</em> rather than the file format itself. Diagnosing first is better.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "materialsshaders",
            "image_path": "assets/generated/DecalTextureAlphaMaskFailure/step-10.png",
            "title": "Check Texture Compression Settings",
            "prompt": "<p>You've confirmed the alpha channel is present in the source file and visible in the <strong>Texture Editor's</strong> preview when manually toggling channels. Yet, the texture still appears opaque white, even in the preview, and the decal is not working.</p><p>Which texture setting commonly causes issues with alpha channel interpretation?</p>",
            "choices": [
                {
                    "text": "<p>In the <strong>Texture Editor Details</strong> panel, check the <strong>Compression Settings</strong> property. The current setting is likely <code>Default (DXT1/5)</code>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. If the alpha is present but not being <em>used</em> or <em>interpreted</em> correctly, <strong>Compression Settings</strong> are a prime suspect. <code>Default</code> compression often discards or poorly handles alpha for non-color data.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Adjust the <strong>LOD Bias</strong> property to force a higher quality mipmap.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. <strong>LOD Bias</strong> affects which mipmap level is used, but if the alpha data is fundamentally miscompressed, even the highest quality mip will be incorrect. This won't resolve the core issue.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Look for a <strong>Dither Alpha</strong> option in the texture settings.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. <strong>Dither Alpha</strong> is related to how alpha is displayed or rendered, but it doesn't control the underlying <em>storage</em> and <em>interpretation</em> of the alpha data itself. Compression is a more fundamental step.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Change the <strong>Power of Two Mode</strong> to ensure compatibility.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. <strong>Power of Two Mode</strong> ensures texture dimensions are powers of two, which is a legacy optimization. It has no direct impact on alpha channel interpretation or compression.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "materialsshaders",
            "image_path": "assets/generated/DecalTextureAlphaMaskFailure/step-11.png",
            "title": "Adjust Texture Compression",
            "prompt": "<p>The <strong>Compression Settings</strong> are indeed set to <code>Default (DXT1/5)</code>. This setting is known to sometimes optimize away alpha or not handle it linearly, especially for masks.</p><p>How do you ensure the alpha channel data is preserved accurately for masking?</p>",
            "choices": [
                {
                    "text": "<p>Change the <strong>Compression Settings</strong> from <code>Default</code> to <code>Masks (No SRGB)</code> or <code>UserInterface2D (BC7)</code> to ensure the alpha channel data is preserved accurately and linearly, as masked opacity relies on binary/linear data.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. <code>Masks (No SRGB)</code> is specifically designed for single-channel data masks, ensuring the alpha channel is preserved without color space conversions. <code>UserInterface2D (BC7)</code> is also a good option for high-quality alpha.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Try a different <strong>Compression Settings</strong> like <code>NormalMap</code>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. <code>NormalMap</code> compression is specifically tailored for tangent-space normal maps, which have entirely different data requirements and compression algorithms than a grayscale mask. This would lead to incorrect results.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Re-import the texture with different import settings for the alpha channel.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.12hrs. While import settings can be a factor, directly changing the engine's <strong>Compression Settings</strong> for the asset is the most immediate and targeted way to address how the engine <em>stores</em> and <em>interprets</em> the alpha channel after import.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Set <strong>Compression Settings</strong> to <code>VectorDisplacementMap</code>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. <code>VectorDisplacementMap</code> is for highly specific 3D displacement data. Applying it to a 2D opacity mask is fundamentally incorrect and will result in corrupted data.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "materialsshaders",
            "image_path": "assets/generated/DecalTextureAlphaMaskFailure/step-12.png",
            "title": "Disable sRGB for Data Texture",
            "prompt": "<p>You've updated the <strong>Compression Settings</strong>. The texture preview might still look odd or white, as another critical setting often works in tandem with compression for data textures and can cause similar white-out issues.</p><p>Considering this texture is a data mask, not a color texture, what is the next crucial setting to adjust?</p>",
            "choices": [
                {
                    "text": "<p>Crucially, locate the <code>sRGB</code> checkbox in the <strong>Texture Editor</strong>. Since this texture is being used purely as a data mask (not for color display), uncheck <code>sRGB</code>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. <code>sRGB</code> applies a gamma correction, intended for color textures. For a linear data mask (like opacity), having <code>sRGB</code> enabled will distort the alpha values, effectively making 0s become non-zero, resulting in an opaque look.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Enable <strong>Virtual Texture Streaming</strong> for this texture.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. <strong>Virtual Texture Streaming</strong> is a memory and performance optimization for large textures. It has no impact on the color space interpretation (<code>sRGB</code>) or compression of the texture data itself.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Look for an 'Invert Alpha' option in the texture settings.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While an inverted alpha could be a future step if the mask shows up correctly but is reversed, it won't fix the issue where the mask isn't being read <em>at all</em> due to <code>sRGB</code> or compression.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Adjust the <strong>Max Texture Size</strong> to force a re-render.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. <strong>Max Texture Size</strong> caps the texture resolution but does not affect how its color space (<code>sRGB</code>) or alpha channel are fundamentally processed. This is irrelevant to the current problem.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "materialsshaders",
            "image_path": "assets/generated/DecalTextureAlphaMaskFailure/step-13.png",
            "title": "Save Texture Asset Changes",
            "prompt": "<p>You've changed both the <strong>Compression Settings</strong> and unchecked <code>sRGB</code> for <strong>T_ScorchMask_Alpha</strong>. The texture preview in the <strong>Texture Editor</strong> may still not immediately update, or the decal in the level remains unchanged.</p><p>What final action is required for these texture changes to take effect throughout the engine?</p>",
            "choices": [
                {
                    "text": "<p>Save the changes to the texture asset (<strong>T_ScorchMask_Alpha</strong>). This forces a re-import and re-compression of the texture data.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. Changes to core texture properties like compression and sRGB often require the asset to be explicitly saved. This triggers the engine to reprocess and re-compress the texture with the new settings, propagating the fix.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Right-click the texture in the <strong>Content Browser</strong> and select 'Recompile Shaders'.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Shaders are compiled based on material graph changes. Texture asset changes primarily affect texture data processing, not shader compilation directly, though materials using the texture will likely recompile automatically when the texture is saved.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Refresh the <strong>Material Instance</strong> or <strong>Parent Material</strong> in their respective editors.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While materials often hot-reload, the fundamental texture data won't update in memory until the asset itself is saved and reprocessed. Refreshing the material editors without saving the texture is ineffective.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Restart the entire Unreal Editor to clear caches.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.20hrs. Restarting the editor is a last resort and usually unnecessary for asset changes. Saving the asset is the intended and faster way to apply changes.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "materialsshaders",
            "image_path": "assets/generated/DecalTextureAlphaMaskFailure/step-14.png",
            "title": "Verify Decal in Level",
            "prompt": "<p>After saving the texture asset, the preview in the <strong>Texture Editor</strong> now correctly displays the alpha channel, and the decal in the level viewport has visually updated.</p><p>What is your final step to confirm the fix?</p>",
            "choices": [
                {
                    "text": "<p>Return to the level viewport and verify the <strong>Decal Material</strong> now blends correctly, using the texture's alpha channel for opacity, resulting in a scorch mark instead of a white square.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. The final and most important step is to confirm the fix in the actual environment, ensuring the decal now functions as intended and the problem has been fully resolved.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Tweak the <strong>Opacity Mask Clip Value</strong> in the material for visual refinement.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While refining the clip value might be a subsequent step for artistic polish, the current goal is to verify the core problem (solid white square) is fixed, not to optimize its visual appearance yet.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Apply the fixed texture to other materials to confirm universal functionality.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While confirming universal functionality is good practice for shared assets, it goes beyond the scope of verifying <em>this specific scenario's</em> fix. Focus on the original problem first.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Delete and re-add the <strong>Decal Actor</strong> to the level.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The fix was on the material and texture assets, not the actor. Deleting and re-adding the actor is unnecessary and won't contribute to verifying the fix.</p>",
                    "next": "step-14"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "image_path": "assets/generated/DecalTextureAlphaMaskFailure/conclusion.png",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario. The Deferred Decal material now correctly uses the texture's alpha channel for opacity, rendering as a scorch mark instead of a solid white square.</p>",
            "choices": [{"text": "Complete Scenario", "type": "correct", "feedback": "", "next": "end"}]
        }
    }
};
