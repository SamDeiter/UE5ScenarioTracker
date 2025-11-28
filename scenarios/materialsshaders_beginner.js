
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['BlackMaterialDueToEmissiveMiswiring'] = {
    meta: {
        title: "Lit Material Renders Pure Black in Scene",
        description: "A newly created master material (M_Master_Rock) intended for a PBR static mesh rock appears completely black in the main level viewport, regardless of how intense the surrounding lighting (Point Lights, Sky Light, Directional Light) is. The rock object is correctly set to 'Movable' and 'Cast Shadows'. When viewing the material preview sphere inside the Material Editor, the material looks perfectly correct, reflecting light and displaying texture detail, and the Shading Model is confirmed to be 'Default Lit'.",
        difficulty: "medium",
        category: "Materials & Shaders",
        estimate: 0.7
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "A newly created master material (M_Master_Rock) intended for a PBR static mesh rock appears completely black in the main level viewport, regardless of how intense the surrounding lighting (Point Lights, Sky Light, Directional Light) is. The rock object is correctly set to 'Movable' and 'Cast Shadows'. When viewing the material preview sphere inside the Material Editor, the material looks perfectly correct, reflecting light and displaying texture detail, and the Shading Model is confirmed to be 'Default Lit'.",
        "choices": [
            {
                "text": "Trace the wire outputting the calculated color from this PBR network.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.06
            },
            {
                "text": "Understand that since the PBR calculation is driving Emissive Color, and Emissive Color is only visible when the Base Color is non-zero, the material is likely calculating a zero Base Color, resulting in a black output in the scene (even if the Emissive is non-zero, it is being masked out by the lack of Base Color in a Lit shader, or the Emissive output itself is not bright enough to overcome the scene darkness).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Observe that the 'Base Color' input is currently disconnected (or driven by a constant zero).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.04
            },
            {
                "text": "Verify that the 'Emissive Color' input is now correctly disconnected (or driven by a constant black/zero if necessary).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            },
            {
                "text": "Examine the final output connection nodes leading into the Material's Main Attributes output node.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.02
            },
            {
                "text": "Return to the Level Editor and confirm the static mesh now renders correctly with proper lighting interaction and color.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.09
            },
            {
                "text": "Identify the primary PBR network (texture samplers combined with color/scalar parameters) intended to define the visual color.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.04
            },
            {
                "text": "Double-click the Material Instance (MI_Rock_A) and use the 'Go to Parent Material' button to open M_Master_Rock.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Click 'Apply' and 'Save' the M_Master_Rock material and wait for compilation to complete.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Checking the Mesh Component's 'Hidden in Game' or 'Visible' flags in the Details panel.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.05
            },
            {
                "text": "Changing the material Blend Mode from 'Opaque' to 'Masked' or 'Translucent'.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.1
            },
            {
                "text": "Select the black Static Mesh Actor in the Level Editor to verify the assigned material instance (MI_Rock_A).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.01
            },
            {
                "text": "Reconnect the exact same PBR network output to the 'Base Color' input instead.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.06
            },
            {
                "text": "Adding extra light sources or increasing the intensity of existing scene lights unnecessarily.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.15
            },
            {
                "text": "Disconnect the PBR network wire from the 'Emissive Color' input.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.04
            },
            {
                "text": "Inspect the Material Details panel (left side) to confirm the Shading Model is indeed 'Default Lit' and the Blend Mode is 'Opaque'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            },
            {
                "text": "Verify the Roughness, Metallic, and Normal inputs are still connected correctly to ensure PBR calculations remain intact.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            },
            {
                "text": "Applying a brand new, default material to the mesh to 'confirm the mesh isn't broken', wasting time on replacing the material setup.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.1
            },
            {
                "text": "Observe that this PBR network is incorrectly connected to the 'Emissive Color' input of the main material node.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.04
            }
        ]
    }
}
};
