window.SCENARIOS['DecalTextureAlphaMaskFailure'] = {
    "meta": {
        "title": "Deferred Decal Material Renders as Solid Opaque White Square",
        "description": "A newly implemented Deferred Decal material, intended to display a scorch mark using the texture's alpha channel for opacity masking, is failing. When the decal actor is placed on any surface, it renders as a completely solid, fully opaque, bright white square that obscures the underlying geometry texture, regardless of the Decal Material parameters set in the Material Instance. The visual result suggests the opacity mask is being ignored or treated as 1.0 everywhere.",
        "estimateHours": 1.45,
        "category": "Materials & Shaders"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "materialsshaders",
            "title": "Initial Actor Configuration Check",
            "prompt": "A newly implemented Deferred Decal material is rendering as a solid opaque white square, ignoring its opacity mask. What's the very first thing to check?",
            "choices": [
                {
                    "text": "Select the Decal Actor in the level and verify the 'Decal Material' slot is correctly assigned to the Material Instance (MI_ScorchMark_Decal).",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. It's crucial to confirm the decal actor is using the intended material instance before diving deeper into material settings.",
                    "next": "step-2"
                },
                {
                    "text": "Change the 'Decal Blend Mode' property on the Decal Actor component itself to 'DBM_Translucent'.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.3hrs. This property controls the projection method (e.g., AlphaComposite, Translucent, Stain), not the material's output blending based on an opacity mask. It won't solve the issue of the material rendering as a solid white square and can introduce other issues.",
                    "next": "step-1"
                },
                {
                    "text": "Examine the Project Settings for any global decal rendering overrides.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. While global settings can affect rendering, it's less likely to cause a specific material to render as solid white and opaque. Start by checking the individual actor and its assigned assets.",
                    "next": "step-1"
                },
                {
                    "text": "Restart the Unreal Editor to clear any potential rendering glitches.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. While sometimes helpful for transient issues, this is a systematic material problem. It's better to methodically debug the asset configuration.",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "materialsshaders",
            "title": "Accessing the Material Instance",
            "prompt": "The Decal Material slot is correctly assigned to MI_ScorchMark_Decal. What do you do next?",
            "choices": [
                {
                    "text": "Open the Material Instance (MI_ScorchMark_Decal) from the Content Browser or Details panel.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. The next logical step is to inspect the Material Instance itself, as it's the primary interface for modifying the material's appearance in the level.",
                    "next": "step-3"
                },
                {
                    "text": "Open the Parent Material (M_Base_Decal_Deferred) directly.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. While you will eventually check the parent material, it's better to confirm the Material Instance's parameters first, as they are specific to this decal's setup.",
                    "next": "step-2"
                },
                {
                    "text": "Check the Decal Component's 'Fade Screen Size' property.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. Fade Screen Size controls when the decal fades out based on screen coverage, not its core rendering behavior or opacity masking.",
                    "next": "step-2"
                },
                {
                    "text": "Delete the Decal Actor and place a new one to see if it fixes the issue.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. This issue is with the material asset, not the actor itself. Deleting and replacing it will yield the same result and is a wasted effort.",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "materialsshaders",
            "title": "Verifying Material Instance Base Color Parameter",
            "prompt": "You're now in MI_ScorchMark_Decal. Which parameter should you verify first?",
            "choices": [
                {
                    "text": "Verify that the 'Base Color Texture' parameter is correctly pointing to T_ScorchMask_Alpha.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. It's good practice to ensure all expected texture parameters are correctly assigned, starting with the base color as it determines the visual output.",
                    "next": "step-4"
                },
                {
                    "text": "Adjust the 'Scalar Parameter' for overall decal intensity.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. While you might have an intensity parameter, the core problem is a solid white opaque square, which points to a texture or masking issue, not intensity.",
                    "next": "step-3"
                },
                {
                    "text": "Replace the Base Color texture parameter with a completely different texture asset.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.15hrs. This wastes time confirming the parameter system works, rather than focusing on the actual problem of the alpha mask being ignored. The issue is with opacity, not necessarily the base color texture itself.",
                    "next": "step-3"
                },
                {
                    "text": "Check the material instance's 'Physical Material' setting.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. Physical materials are used for physics interactions and sound, not directly for visual rendering of alpha masks.",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "materialsshaders",
            "title": "Verifying Material Instance Opacity Mask Parameter",
            "prompt": "The Base Color Texture parameter is correct. What's the next material instance parameter to check, given the problem description?",
            "choices": [
                {
                    "text": "Verify that the 'Opacity Mask Texture' parameter is correctly pointing to T_ScorchMask_Alpha.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. This is critical as the problem explicitly states the opacity mask is being ignored. Ensuring the correct texture is assigned here is a direct diagnostic step.",
                    "next": "step-5"
                },
                {
                    "text": "Try changing the 'Decal Blend Mode' directly in the Material Instance.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. Decal Blend Mode is a property of the *material's parent settings*, not typically exposed as a changeable parameter in the Material Instance. This suggests a misunderstanding of material architecture.",
                    "next": "step-4"
                },
                {
                    "text": "Adjust the 'Texture Coordinate' scaling parameters in the Material Instance.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. Texture coordinate scaling affects how the texture repeats or stretches, but won't fix a problem where the alpha channel itself is ignored.",
                    "next": "step-4"
                },
                {
                    "text": "Apply a different base color texture to see if the problem shifts.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. While you already checked base color, changing it *again* to a different texture is redundant when the problem is clearly with the opacity mask.",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "materialsshaders",
            "title": "Accessing the Parent Material",
            "prompt": "Both Base Color and Opacity Mask Texture parameters in MI_ScorchMark_Decal are correctly assigned to T_ScorchMask_Alpha. What's your next step?",
            "choices": [
                {
                    "text": "In the Material Instance, locate and open the Parent Material (M_Base_Decal_Deferred).",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. Since the instance parameters are correct, the problem likely lies within the parent material's core setup, which dictates the fundamental behavior.",
                    "next": "step-6"
                },
                {
                    "text": "Try adjusting the 'Opacity Mask Clip Value' in the Material Instance.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. While this value is important, it's a property of the parent material and needs to be checked there first. Changing it in the instance won't help if the parent isn't configured for masked blending.",
                    "next": "step-5"
                },
                {
                    "text": "Create a new material from scratch to see if the problem persists with a fresh setup.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.2hrs. This is a time-consuming step that avoids diagnosing the root cause of the current material's failure. It's better to methodically fix the existing assets.",
                    "next": "step-5"
                },
                {
                    "text": "Add a new scalar parameter for 'Opacity' in the Material Instance and try to adjust it.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.1hrs. A scalar parameter for opacity would only work if the parent material was set up to receive it, and it's not directly related to why the existing opacity mask is being ignored.",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "materialsshaders",
            "title": "Verifying Parent Material Domain",
            "prompt": "You're now in M_Base_Decal_Deferred. What's the first fundamental property to check for a deferred decal?",
            "choices": [
                {
                    "text": "Verify the 'Material Domain' is set to 'Deferred Decal'.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. The Material Domain is fundamental. If it's not 'Deferred Decal', the material won't render as a decal at all, or will render incorrectly.",
                    "next": "step-7"
                },
                {
                    "text": "Immediately check the 'Blend Mode' property.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. While Blend Mode is critical, Material Domain is an even higher-level setting that dictates how the material interacts with the rendering pipeline as a whole.",
                    "next": "step-6"
                },
                {
                    "text": "Look for the Base Color input in the material graph.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. The base color is not the primary issue; the problem is with the opacity mask being ignored. Start with fundamental material properties.",
                    "next": "step-6"
                },
                {
                    "text": "Run a 'stat gpu' command in the console to check GPU performance.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. Performance stats are not relevant to a material rendering incorrectly as a solid white square. This is a configuration issue.",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "materialsshaders",
            "title": "Confirming Parent Material Blend Mode",
            "prompt": "Material Domain is confirmed as 'Deferred Decal'. Which material setting is crucial for alpha-based opacity masking to function?",
            "choices": [
                {
                    "text": "Verify the 'Blend Mode' is set to 'Masked'.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. For a material to use an opacity mask (binary transparency based on an alpha channel), its Blend Mode *must* be set to 'Masked'. If it were Translucent, the color might be affected, but the problem states it is solid white and opaque, indicating the mask is ignored.",
                    "next": "step-8"
                },
                {
                    "text": "Change the Base Material Blend Mode from 'Masked' to 'Translucent'.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.45hrs. Changing to 'Translucent' without solving the texture alpha issue would introduce incorrect lighting and sorting artifacts, and is not the correct approach for binary opacity masking. It also won't solve the solid white problem.",
                    "next": "step-7"
                },
                {
                    "text": "Set 'Shading Model' to 'Unlit'.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.1hrs. Shading Model affects how light interacts with the material, not primarily how its opacity mask is interpreted for binary transparency.",
                    "next": "step-7"
                },
                {
                    "text": "Enable 'Two Sided' to ensure the decal renders on both sides of geometry.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. 'Two Sided' is irrelevant to the decal rendering as a solid opaque white square. It only affects rendering from reverse normals.",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "materialsshaders",
            "title": "Examining Material Graph for Opacity Mask Logic",
            "prompt": "Blend Mode is 'Masked'. What should you now examine in the material graph regarding the opacity mask?",
            "choices": [
                {
                    "text": "Examine the Material Graph to ensure the Texture Sample Parameter for T_ScorchMask_Alpha is present and connected to the Opacity Mask input.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. It's vital to confirm that the material's Opacity Mask input is receiving *any* data from the intended texture, and that the texture sample node is correctly set up.",
                    "next": "step-9"
                },
                {
                    "text": "Plug a 'Constant' value of 0.5 directly into the Opacity Mask input to test transparency.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.25hrs. Trying to force transparency using a constant value into the opacity mask input, rather than checking the input texture asset configuration, bypasses the problem rather than diagnosing it. It will make the decal semi-transparent, but it won't fix the underlying issue with the texture's alpha channel.",
                    "next": "step-8"
                },
                {
                    "text": "Add a 'Multiply' node before the Base Color input to brighten the decal.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. The base color is not the primary issue, and brightening it won't resolve the opacity mask problem.",
                    "next": "step-8"
                },
                {
                    "text": "Check if the material is compiling correctly by looking for errors in the output log.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. If the material were failing to compile, it would likely render as a default gray checkerboard or black, not a solid white square. The issue is logical, not syntax-related.",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "materialsshaders",
            "title": "Confirming Opacity Mask Channel Connection",
            "prompt": "The Texture Sample for T_ScorchMask_Alpha is connected to the Opacity Mask input. What specific output channel from the texture sample should be connected?",
            "choices": [
                {
                    "text": "Confirm the Opacity Mask input is correctly receiving the alpha output (A) from the Texture Sample Parameter.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. It's crucial that the *alpha* channel, not RGB, is driving the Opacity Mask. Accidentally connecting the Red or RGB channel would result in incorrect or fully opaque behavior if the texture is mostly white.",
                    "next": "step-10"
                },
                {
                    "text": "Connect the Red channel of the texture sample to the Opacity Mask input.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. Connecting the Red channel (or any RGB channel) will cause incorrect behavior as it will use color data, not alpha, for transparency. This would likely perpetuate the solid white issue.",
                    "next": "step-9"
                },
                {
                    "text": "Add a 'Power' node to modify the opacity values from the texture.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. While you can modify mask values, this is an advanced adjustment. The first step is to ensure the correct raw data is being fed into the mask.",
                    "next": "step-9"
                },
                {
                    "text": "Disconnect and reconnect the texture sample node to 'refresh' the connection.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. This is a troubleshooting step for a potential editor glitch, but unlikely to fix a logical connection error. The visual connection in the graph is what matters.",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "materialsshaders",
            "title": "Checking Opacity Mask Clip Value in Parent Material",
            "prompt": "The Opacity Mask input is correctly connected to the alpha output. What additional material setting is critical for 'Masked' blend mode to correctly interpret the texture data?",
            "choices": [
                {
                    "text": "Confirm the 'Opacity Mask Clip Value' is set to a reasonable non-zero value (e.g., 0.333), as this is required for Masked blend mode.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. The Opacity Mask Clip Value defines the threshold for masked materials. If it's 0 (or too low/high), it can cause unexpected results, including potentially ignoring valid mask data (treating everything as opaque if 0 or too low).",
                    "next": "step-11"
                },
                {
                    "text": "Add a 'Clamp' node to the Opacity Mask input to ensure values are between 0 and 1.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. While clamping is good practice, the engine usually handles this. The primary issue is not out-of-range values from the texture, but how the texture data itself is being processed and clipped.",
                    "next": "step-10"
                },
                {
                    "text": "Disable 'Cast Shadows' on the material to see if it's related to shadow rendering.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Casting shadows is unrelated to the material itself rendering as a solid white square. This is a material property problem.",
                    "next": "step-10"
                },
                {
                    "text": "Verify the 'Usage' flags for the material, like 'Used With Skeletal Meshes'.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. Material usage flags affect where the material can be applied, not how its internal logic processes opacity for a decal. This is a deferred decal, so those specific flags are unlikely to be relevant.",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "materialsshaders",
            "title": "Identifying the Root Cause Component",
            "prompt": "All material graph logic and properties (domain, blend mode, clip value, texture connections) appear sound. What's the next logical component to investigate?",
            "choices": [
                {
                    "text": "Since the material graph logic appears sound, identify the actual texture asset (T_ScorchMask_Alpha) that is being sampled.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. If the material setup is correct, the problem almost certainly lies with the source data\u2014the texture asset itself. It's the only remaining piece of the puzzle that could be causing the alpha to be ignored.",
                    "next": "step-12"
                },
                {
                    "text": "Create a completely new material and re-implement the decal logic from scratch.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.3hrs. This is a very time-consuming approach. Given that the material graph appears correct, recreating it is unlikely to solve the problem and avoids diagnosing the root cause.",
                    "next": "step-11"
                },
                {
                    "text": "Check the Decal Actor's scale and rotation in the level.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. Scale and rotation affect the projection of the decal, but not its material's opacity. It would still be a white square, just scaled/rotated.",
                    "next": "step-11"
                },
                {
                    "text": "Replace the texture sample in the material with a 'Texture Object Parameter' and try to assign the texture again.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. While this might confirm parameter functionality, it's an unnecessary step if the current Texture Sample Parameter is already correctly pointing to the texture. The issue isn't the *connection*, but how the *texture itself* is processed.",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "textureeditor",
            "title": "Opening the Texture Asset",
            "prompt": "The texture asset T_ScorchMask_Alpha has been identified. What's the immediate next step?",
            "choices": [
                {
                    "text": "Open the T_ScorchMask_Alpha asset in the Texture Editor.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. To inspect and modify the texture's properties, it must be opened in its dedicated editor.",
                    "next": "step-13"
                },
                {
                    "text": "Right-click the texture and select 'Reimport'.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. Reimporting without changing settings won't help. You need to inspect the texture's properties *before* reimporting to diagnose the issue.",
                    "next": "step-12"
                },
                {
                    "text": "Drag the texture directly into the level viewport to see how it renders on its own.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Dragging it into the level will create a material/mesh that won't necessarily replicate the decal's behavior, and won't allow you to inspect its internal properties.",
                    "next": "step-12"
                },
                {
                    "text": "Check the texture's file path on disk using the Content Browser's 'Show in Explorer' option.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. The file path is irrelevant to how Unreal processes the texture asset's internal alpha channel data.",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "textureeditor",
            "title": "Verifying Source Texture Properties",
            "prompt": "You've opened T_ScorchMask_Alpha in the Texture Editor. What's the first thing to verify about its alpha channel?",
            "choices": [
                {
                    "text": "Verify the 'Source Texture' properties and confirm that the alpha channel is present in the imported source file.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. Before diving into compression or sRGB, confirm that the alpha channel *actually exists* in the source image and was correctly detected during import.",
                    "next": "step-14"
                },
                {
                    "text": "Immediately change the 'Compression Settings' to 'Masks (No SRGB)'.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. While this is part of the solution, it's better to verify the alpha channel exists first. Changing settings without confirming source data presence can lead to misdiagnosis.",
                    "next": "step-13"
                },
                {
                    "text": "Modify the 'Resolution' of the texture to a higher value.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. Texture resolution affects detail, not whether its alpha channel is correctly processed for opacity. This is irrelevant to the problem.",
                    "next": "step-13"
                },
                {
                    "text": "Check the 'Filter' property (e.g., Bilinear, Trilinear, Anisotropic).",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. Filtering affects how the texture is sampled at different distances, not whether its alpha channel is active for masked opacity.",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "textureeditor",
            "title": "Observing Texture Editor Preview Channels",
            "prompt": "Source Texture properties confirm alpha channel presence. How can you visually inspect the alpha channel within the Texture Editor?",
            "choices": [
                {
                    "text": "Confirm the alpha channel is visible and appears as expected in the Texture Editor preview channels (e.g., by selecting the 'Alpha' channel view).",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. The preview channels allow direct visual inspection of individual channels (Red, Green, Blue, Alpha). This confirms if the engine is correctly interpreting the alpha data it has.",
                    "next": "step-15"
                },
                {
                    "text": "Use an external image editor to view the alpha channel.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.15hrs. The Unreal Texture Editor provides the tools to inspect channels. Using an external app is unnecessary and wastes time, violating a critical rule for this assessment.",
                    "next": "step-14"
                },
                {
                    "text": "Check the 'Mipmap' generation settings.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. Mipmaps are scaled-down versions for distance rendering. While they rely on the source, checking their generation settings won't tell you if the alpha channel is being correctly processed for the material's current issue.",
                    "next": "step-14"
                },
                {
                    "text": "Apply a 'Texture Curve' to modify the alpha values dynamically.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. Applying a curve is a modification, not a diagnostic step. You need to understand why it's not working *before* trying to change its values.",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "textureeditor",
            "title": "Inspecting Compression Settings for Alpha Data",
            "prompt": "Alpha channel is present and visible in the preview. What texture property often dictates how accurately alpha channel data is preserved?",
            "choices": [
                {
                    "text": "In the Texture Editor Details panel, check the 'Compression Settings' property. The current setting is likely 'Default (DXT1/5)'.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. Compression settings determine how texture data, including alpha, is stored. Incorrect settings often lead to alpha channel degradation or outright removal, causing issues like yours.",
                    "next": "step-16"
                },
                {
                    "text": "Adjust the 'LOD Bias' to force a higher-quality mip.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. LOD Bias affects mipmap selection, which impacts visual quality at distance, but doesn't solve a fundamental issue with the alpha channel's data interpretation.",
                    "next": "step-15"
                },
                {
                    "text": "Change the 'Addressing X' and 'Addressing Y' to 'Wrap'.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Addressing modes (Wrap, Clamp, Mirror) affect how the texture behaves when UVs go outside the 0-1 range. This is irrelevant to the alpha mask being ignored.",
                    "next": "step-15"
                },
                {
                    "text": "Export the texture to an external application to verify its alpha channel there.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.2hrs. While possible, the Texture Editor itself provides adequate tools to verify the alpha channel. This external step adds unnecessary time and complexity, violating a critical rule.",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "textureeditor",
            "title": "Correcting Compression Settings for Alpha Mask",
            "prompt": "Compression Settings are 'Default (DXT1/5)'. What's the appropriate setting for an alpha mask texture?",
            "choices": [
                {
                    "text": "Change the 'Compression Settings' from 'Default' to 'Masks (No SRGB)' or 'UserInterface2D (BC7)' to ensure the alpha channel data is preserved accurately and linearly.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.15hrs. 'Default' compression (DXT1/5) can aggressively compress or even discard alpha, or store it non-linearly. 'Masks (No SRGB)' is specifically designed for binary alpha masks, ensuring accurate and linear data. BC7 is also a good, higher-quality alternative.",
                    "next": "step-17"
                },
                {
                    "text": "Set 'Compression Settings' to 'VectorDisplacementmap (RGBA8)'.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. This setting is for vector displacement maps and is inappropriate for a simple alpha mask, potentially causing incorrect data interpretation.",
                    "next": "step-16"
                },
                {
                    "text": "Increase the 'Max Texture Size' to ensure full resolution.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. Max Texture Size dictates the highest mipmap resolution. While it affects quality, it doesn't address how the alpha channel data itself is being compressed or interpreted for masking.",
                    "next": "step-16"
                },
                {
                    "text": "Try 'Grayscale (R8)' as the compression setting.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. While 'Grayscale' might preserve a single channel, it's not ideal for a texture intended to have an alpha, and 'Masks (No SRGB)' is more appropriate and robust for preserving specific alpha data.",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "textureeditor",
            "title": "Locating the sRGB Checkbox",
            "prompt": "Compression Settings are now appropriate. There's another critical texture setting for data masks that affects gamma. Where is it located?",
            "choices": [
                {
                    "text": "Locate the 'sRGB' checkbox in the Texture Editor Details panel.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. The 'sRGB' setting is crucial for data textures like masks, as it determines if gamma correction is applied, which can distort linear data.",
                    "next": "step-18"
                },
                {
                    "text": "Look for a 'Gamma Correction' slider in the 'Advanced' section.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. While related to gamma, directly setting Gamma via a slider might override other important settings or not fully achieve the 'linear' data desired. 'sRGB' checkbox is the standard control.",
                    "next": "step-17"
                },
                {
                    "text": "Check the 'Virtual Texture Streaming' settings.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Virtual Texture Streaming is a performance optimization for very large textures, unrelated to the interpretation of an alpha mask.",
                    "next": "step-17"
                },
                {
                    "text": "Search for 'sRGB' in the Project Settings.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. While global sRGB settings exist, the per-texture 'sRGB' checkbox is the direct control for an individual texture asset.",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "textureeditor",
            "title": "Disabling sRGB for Mask Data",
            "prompt": "You've located the 'sRGB' checkbox. What action should you take for this data mask texture?",
            "choices": [
                {
                    "text": "Uncheck 'sRGB' since this texture is being used purely as a data mask (not for color display), ensuring linear data interpretation.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. sRGB applies a gamma correction, which is necessary for color textures but distorts linear data for masks. Unchecking it ensures the alpha values are interpreted directly (0-1).",
                    "next": "step-19"
                },
                {
                    "text": "Keep 'sRGB' checked to maintain visual fidelity for the decal.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.15hrs. Keeping sRGB checked will apply gamma correction, distorting the linear alpha values and preventing the opacity mask from working correctly, which is precisely the problem you're trying to solve.",
                    "next": "step-18"
                },
                {
                    "text": "Adjust the 'Post Process Material' setting for the texture.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. Post-process materials are for applying effects *to* the texture, not for fundamental data interpretation like sRGB.",
                    "next": "step-18"
                },
                {
                    "text": "Change the texture's 'LOD Group' to 'UI'.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. LOD Groups define default settings for textures, but manually unchecking sRGB is the direct and specific fix for this scenario.",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "textureeditor",
            "title": "Saving Texture Asset Changes",
            "prompt": "You've changed the Compression Settings and unchecked sRGB. What's the next essential step to apply these changes?",
            "choices": [
                {
                    "text": "Save the changes to the texture asset (T_ScorchMask_Alpha). This forces a re-import and re-compression of the texture data.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. The changes made in the Texture Editor will only take effect after saving the asset. This crucial step triggers the internal re-processing of the texture with the new settings.",
                    "next": "step-20"
                },
                {
                    "text": "Recompile the Parent Material (M_Base_Decal_Deferred).",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. While a material recompile can be helpful, the underlying texture data needs to be saved and reprocessed first. The material itself isn't the problem, the texture it's sampling is.",
                    "next": "step-19"
                },
                {
                    "text": "Close the Texture Editor without saving to see if the changes are implicitly applied.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Closing without saving will discard your changes, and the problem will persist. Always save asset modifications!",
                    "next": "step-19"
                },
                {
                    "text": "Run 'Fixup Redirectors in Folder' on the content browser folder.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. Redirectors are for asset renames/moves. This is unrelated to the texture's internal data configuration.",
                    "next": "step-19"
                }
            ]
        },
        "step-20": {
            "skill": "levelviewport",
            "title": "Returning to the Level",
            "prompt": "The texture asset has been saved and reprocessed. What is the immediate next action to observe the result?",
            "choices": [
                {
                    "text": "Return to the level viewport.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. After making and saving changes to an asset, returning to the context where it's used (the level viewport) is necessary to observe if the fix was successful.",
                    "next": "step-21"
                },
                {
                    "text": "Clear the Derived Data Cache to ensure all cached data is fresh.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. While a DDC clear can sometimes help with persistent issues, saving the texture asset directly forces a re-import and re-compression, making a DDC clear less immediately necessary in this specific scenario.",
                    "next": "step-20"
                },
                {
                    "text": "Create a new Decal Actor to see if the problem only affected the original one.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. This issue was with the texture asset itself, which is shared. Creating a new actor would yield the same result and is an unnecessary step.",
                    "next": "step-20"
                },
                {
                    "text": "Adjust the global post-processing volume's 'Scene Color' settings.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. Post-processing affects the final image, but it won't fix a material that's fundamentally ignoring its alpha channel for blending.",
                    "next": "step-20"
                }
            ]
        },
        "step-21": {
            "skill": "levelviewport",
            "title": "Final Verification of Decal Rendering",
            "prompt": "You are back in the level viewport. What is the final action?",
            "choices": [
                {
                    "text": "Verify the Decal Material now blends correctly, using the texture's alpha channel for opacity, resulting in a scorch mark instead of a white square.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. The final step is to visually confirm in the level viewport that the decal now renders as intended, using its alpha channel for transparency.",
                    "next": "conclusion"
                },
                {
                    "text": "Save the current level.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. Saving the level is good practice, but it's not the primary action for *verifying* the fix. The visual check is paramount.",
                    "next": "step-21"
                },
                {
                    "text": "Check the material's 'Shader Complexity' view mode.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. Shader complexity is for performance optimization, not for confirming correct alpha blending. It won't tell you if the decal is visually correct.",
                    "next": "step-21"
                },
                {
                    "text": "Apply a different post-process effect to highlight the decal.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Applying post-process effects is unrelated to verifying if the decal's material is now correctly using its alpha channel.",
                    "next": "step-21"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "Congratulations! You have successfully completed this debugging scenario. The decal now renders correctly, showing a scorch mark instead of a white square, confirming the texture's compression settings and sRGB property were the root cause.",
            "choices": []
        }
    }
};
