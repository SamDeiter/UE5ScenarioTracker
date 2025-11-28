
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['DecalTextureAlphaMaskFailure'] = {
    meta: {
        title: "Deferred Decal Material Renders as Solid Opaque White Square",
        description: "A newly implemented Deferred Decal material, intended to display a scorch mark using the texture's alpha channel for opacity masking, is failing. When the decal actor is placed on any surface, it renders as a completely solid, fully opaque, bright white square that obscures the underlying geometry texture, regardless of the Decal Material parameters set in the Material Instance. The visual result suggests the opacity mask is being ignored or treated as 1.0 everywhere.",
        difficulty: "medium",
        category: "Materials & Shaders",
        estimate: 1.45
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "A newly implemented Deferred Decal material, intended to display a scorch mark using the texture's alpha channel for opacity masking, is failing. When the decal actor is placed on any surface, it renders as a completely solid, fully opaque, bright white square that obscures the underlying geometry texture, regardless of the Decal Material parameters set in the Material Instance. The visual result suggests the opacity mask is being ignored or treated as 1.0 everywhere.",
        "choices": [
            {
                "text": "Verify the texture is being sampled correctly by checking the 'Source Texture' properties and confirming that the alpha channel is present in the imported source file (usually visible in the Texture Editor preview channels).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "In the Parent Material, verify the 'Blend Mode' is set to 'Masked'. (If it were Translucent, the color would be affected, but the problem states it is solid white and opaque).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Trying to force transparency using a constant value plugged into the opacity mask input in the material graph, rather than checking the input texture asset configuration.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.25
            },
            {
                "text": "In the Material Instance, locate and open the Parent Material (M_Base_Decal_Deferred).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Select the Decal Actor in the level and verify the 'Decal Material' slot is correctly assigned to the Material Instance (MI_ScorchMark_Decal).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Return to the level viewport and verify the Decal Material now blends correctly, using the texture's alpha channel for opacity, resulting in a scorch mark instead of a white square.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Changing the Base Material Blend Mode from 'Masked' to 'Translucent' without solving the texture alpha issue, which introduces incorrect lighting and sorting artifacts.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.45
            },
            {
                "text": "In the Parent Material, verify the 'Material Domain' is set to 'Deferred Decal'. (This should be correct, but must be checked).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Since the material graph logic appears sound, identify and open the actual texture asset (T_ScorchMask_Alpha) in the Texture Editor.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Open the Material Instance (MI_ScorchMark_Decal) and verify that the Base Color and Opacity Mask Texture parameters are correctly pointing to T_ScorchMask_Alpha.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Crucially, locate the 'sRGB' checkbox in the Texture Editor. Since this texture is being used purely as a data mask (not for color display), uncheck 'sRGB'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Change the 'Compression Settings' from 'Default' to 'Masks (No SRGB)' or 'UserInterface2D (BC7)' to ensure the alpha channel data is preserved accurately and linearly, as masked opacity relies on binary/linear data.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "In the Texture Editor Details panel, check the 'Compression Settings' property. The current setting is likely 'Default (DXT1/5)'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Changing the 'Decal Blend Mode' property on the Decal Actor component itself (this controls projection method, not material output blending).",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.3
            },
            {
                "text": "Examine the Material Graph to ensure the Opacity Mask input is correctly receiving the alpha output (A) from the Texture Sample Parameter used for the T_ScorchMask_Alpha texture.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Replacing the base color texture parameter in the Material Instance with a completely different texture asset, wasting time confirming the parameter system works.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.15
            },
            {
                "text": "Confirm the 'Opacity Mask Clip Value' is set to a reasonable non-zero value (e.g., 0.333), as this is required for Masked blend mode.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Save the changes to the texture asset (T_ScorchMask_Alpha). This forces a re-import and re-compression of the texture data.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            }
        ]
    }
}
};
