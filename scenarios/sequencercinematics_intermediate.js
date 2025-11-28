
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['MaterialParameterAndAnimJitter'] = {
    meta: {
        title: "Desynchronized Material Effects and Animation Jitter in Cinematic Sequence",
        description: "A complex cinematic sequence, 'Pickup_Cinematic', is exhibiting two major flaws. First, a crucial glowing prop (SM_Relic) loses its emissive intensity abruptly just as the character starts the pickup motion, then returns to full intensity after the camera cuts. The desired effect is a slow, smooth fade over 4 seconds during the pickup. Second, the character's right hand slightly clips through the SM_Relic during the final moments of the grab animation, suggesting a subtle transform offset issue.",
        difficulty: "medium",
        category: "Sequencer & Cinematics",
        estimate: 1.5
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "A complex cinematic sequence, 'Pickup_Cinematic', is exhibiting two major flaws. First, a crucial glowing prop (SM_Relic) loses its emissive intensity abruptly just as the character starts the pickup motion, then returns to full intensity after the camera cuts. The desired effect is a slow, smooth fade over 4 seconds during the pickup. Second, the character's right hand slightly clips through the SM_Relic during the final moments of the grab animation, suggesting a subtle transform offset issue.",
        "choices": [
            {
                "text": "In the Sequencer timeline, select the track corresponding to the static mesh 'SM_Relic' (the glowing prop).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Save the 'Pickup_Cinematic' Level Sequence asset.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Set a keyframe on the Control Rig track for the adjusted hand position at Frame 180.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Expand the newly created Control Rig track and select the bone controlling the right hand (e.g., 'hand_r_bone' or similar relevant control).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Add flanking keyframes (e.g., at Frame 160 and Frame 200) where the hand transform is reset to 0.0 relative offset, ensuring a smooth blend into and out of the correction.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Locate and open the Level Sequence asset named 'Pickup_Cinematic' in the Content Browser.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Delete the entire superfluous 'Transform' track on the SKM_Hero actor, relying solely on the underlying animation clip for movement.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "In the animation editor (Persona), trying to edit the base 'Anim_Pickup_Relic' animation asset to fix the clipping, thus permanently altering the source data.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.3
            },
            {
                "text": "Review the entire sequence playback, checking both the 'Glow_Intensity' fade timing and the hand/relic interaction at the point of pickup.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Select 'Add Control Rig Track' from the context menu to introduce a layer for fine-tuning bone positions without modifying the base animation asset.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Scrub the timeline to the end of the required fade (Frame 200, 4 seconds later) and key the 'Glow_Intensity' parameter to 0.0 to achieve the smooth 4-second fade.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Checking the collision settings of the Skeletal Mesh and the Static Mesh, attempting to use physics/collision response to fix a visual/transform issue.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.2
            },
            {
                "text": "Observe the keyframes for 'Glow_Intensity'. Note the unexpected keyframe at Frame 30, which abruptly sets the value to 0.0, causing the instant fade-out.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Using the Sequencer transform controls for the 'hand_r_bone' control, adjust the position slightly along the local X or Z axis (e.g., +1.5 units) to pull the hand away from the relic.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Delete the erroneous 'Glow_Intensity' keyframe located at Frame 30 to prevent the premature fade.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "If deleting the Transform track introduces new errors, undo the deletion and instead, right-click the 'Anim_Pickup_Relic' animation clip itself.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Scrub to the exact frame where the clipping occurs (around Frame 180).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Scrub the timeline to the start of the required fade (Frame 80) and ensure the Glow_Intensity is keyed to its maximum value (e.g., 5.0).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Opening the SM_Relic Material Blueprint and attempting to debug the Glow Intensity logic within the Material Editor, assuming the material itself is flawed.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.4
            },
            {
                "text": "Select the track for the Skeletal Mesh Actor (SKM_Hero) and examine the tracks for any conflicting data, focusing on the Transform track.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Expand the Material Parameter section under the SM_Relic track, specifically targeting the parameter named 'Glow_Intensity'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Save the current level to ensure the changes to the possessed actors are retained.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Identify that the existing 'Transform' track, added on top of the 'Anim_Pickup_Relic' animation, is causing a subtle additive offset resulting in the clipping.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            }
        ]
    }
}
};
