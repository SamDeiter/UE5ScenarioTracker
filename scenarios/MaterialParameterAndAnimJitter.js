window.SCENARIOS['MaterialParameterAndAnimJitter'] = {
    "meta": {
        "title": "Desynchronized Material Effects and Animation Jitter in Cinematic Sequence",
        "description": "A complex cinematic sequence, 'Pickup_Cinematic', is exhibiting two major flaws. First, a crucial glowing prop (SM_Relic) loses its emissive intensity abruptly just as the character starts the pickup motion, then returns to full intensity after the camera cuts. The desired effect is a slow, smooth fade over 4 seconds during the pickup. Second, the character's right hand slightly clips through the SM_Relic during the final moments of the grab animation, suggesting a subtle transform offset issue.",
        "estimateHours": 1.5,
        "category": "Sequencer & Cinematics"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "sequencercinematics",
            "title": "Step 1",
            "prompt": "<p>Locate and open the Level Sequence asset named 'Pickup_Cinematic' in the Content Browser.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate and open the Level Sequence asset named 'Pickup_Cinematic' in the Content Browser.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Opening the SM_Relic Material Blueprint and attempting to debug the Glow Intensity logic within the Material Editor, assuming the material itself is flawed.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "sequencercinematics",
            "title": "Step 2",
            "prompt": "<p>In the Sequencer timeline, select the track corresponding to the static mesh 'SM_Relic' (the glowing prop).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Sequencer timeline, select the track corresponding to the static mesh 'SM_Relic' (the glowing prop).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>In the animation editor (Persona), trying to edit the base 'Anim_Pickup_Relic' animation asset to fix the clipping, thus permanently altering the source data.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "sequencercinematics",
            "title": "Step 3",
            "prompt": "<p>Expand the Material Parameter section under the SM_Relic track, specifically targeting the parameter named 'Glow_Intensity'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Expand the Material Parameter section under the SM_Relic track, specifically targeting the parameter named 'Glow_Intensity'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Checking the collision settings of the Skeletal Mesh and the Static Mesh, attempting to use physics/collision response to fix a visual/transform issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "sequencercinematics",
            "title": "Step 4",
            "prompt": "<p>Observe the keyframes for 'Glow_Intensity'. Note the unexpected keyframe at Frame 30, which abruptly sets the value to 0.0, causing the instant fade-out.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Observe the keyframes for 'Glow_Intensity'. Note the unexpected keyframe at Frame 30, which abruptly sets the value to 0.0, causing the instant fade-out.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Opening the SM_Relic Material Blueprint and attempting to debug the Glow Intensity logic within the Material Editor, assuming the material itself is flawed.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "sequencercinematics",
            "title": "Step 5",
            "prompt": "<p>Delete the erroneous 'Glow_Intensity' keyframe located at Frame 30 to prevent the premature fade.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Delete the erroneous 'Glow_Intensity' keyframe located at Frame 30 to prevent the premature fade.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>In the animation editor (Persona), trying to edit the base 'Anim_Pickup_Relic' animation asset to fix the clipping, thus permanently altering the source data.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "sequencercinematics",
            "title": "Step 6",
            "prompt": "<p>Scrub the timeline to the start of the required fade (Frame 80) and ensure the Glow_Intensity is keyed to its maximum value (e.g., 5.0).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Scrub the timeline to the start of the required fade (Frame 80) and ensure the Glow_Intensity is keyed to its maximum value (e.g., 5.0).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Checking the collision settings of the Skeletal Mesh and the Static Mesh, attempting to use physics/collision response to fix a visual/transform issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "sequencercinematics",
            "title": "Step 7",
            "prompt": "<p>Scrub the timeline to the end of the required fade (Frame 200, 4 seconds later) and key the 'Glow_Intensity' parameter to 0.0 to achieve the smooth 4-second fade.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Scrub the timeline to the end of the required fade (Frame 200, 4 seconds later) and key the 'Glow_Intensity' parameter to 0.0 to achieve the smooth 4-second fade.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Opening the SM_Relic Material Blueprint and attempting to debug the Glow Intensity logic within the Material Editor, assuming the material itself is flawed.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "sequencercinematics",
            "title": "Step 8",
            "prompt": "<p>Select the track for the Skeletal Mesh Actor (SKM_Hero) and examine the tracks for any conflicting data, focusing on the Transform track.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select the track for the Skeletal Mesh Actor (SKM_Hero) and examine the tracks for any conflicting data, focusing on the Transform track.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>In the animation editor (Persona), trying to edit the base 'Anim_Pickup_Relic' animation asset to fix the clipping, thus permanently altering the source data.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "sequencercinematics",
            "title": "Step 9",
            "prompt": "<p>Identify that the existing 'Transform' track, added on top of the 'Anim_Pickup_Relic' animation, is causing a subtle additive offset resulting in the clipping.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Identify that the existing 'Transform' track, added on top of the 'Anim_Pickup_Relic' animation, is causing a subtle additive offset resulting in the clipping.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Checking the collision settings of the Skeletal Mesh and the Static Mesh, attempting to use physics/collision response to fix a visual/transform issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "sequencercinematics",
            "title": "Step 10",
            "prompt": "<p>Delete the entire superfluous 'Transform' track on the SKM_Hero actor, relying solely on the underlying animation clip for movement.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Delete the entire superfluous 'Transform' track on the SKM_Hero actor, relying solely on the underlying animation clip for movement.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Opening the SM_Relic Material Blueprint and attempting to debug the Glow Intensity logic within the Material Editor, assuming the material itself is flawed.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "sequencercinematics",
            "title": "Step 11",
            "prompt": "<p>If deleting the Transform track introduces new errors, undo the deletion and instead, right-click the 'Anim_Pickup_Relic' animation clip itself.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>If deleting the Transform track introduces new errors, undo the deletion and instead, right-click the 'Anim_Pickup_Relic' animation clip itself.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>In the animation editor (Persona), trying to edit the base 'Anim_Pickup_Relic' animation asset to fix the clipping, thus permanently altering the source data.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "sequencercinematics",
            "title": "Step 12",
            "prompt": "<p>Select 'Add Control Rig Track' from the context menu to introduce a layer for fine-tuning bone positions without modifying the base animation asset.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select 'Add Control Rig Track' from the context menu to introduce a layer for fine-tuning bone positions without modifying the base animation asset.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Checking the collision settings of the Skeletal Mesh and the Static Mesh, attempting to use physics/collision response to fix a visual/transform issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "sequencercinematics",
            "title": "Step 13",
            "prompt": "<p>Expand the newly created Control Rig track and select the bone controlling the right hand (e.g., 'hand_r_bone' or similar relevant control).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Expand the newly created Control Rig track and select the bone controlling the right hand (e.g., 'hand_r_bone' or similar relevant control).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Opening the SM_Relic Material Blueprint and attempting to debug the Glow Intensity logic within the Material Editor, assuming the material itself is flawed.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "sequencercinematics",
            "title": "Step 14",
            "prompt": "<p>Scrub to the exact frame where the clipping occurs (around Frame 180).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Scrub to the exact frame where the clipping occurs (around Frame 180).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>In the animation editor (Persona), trying to edit the base 'Anim_Pickup_Relic' animation asset to fix the clipping, thus permanently altering the source data.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "sequencercinematics",
            "title": "Step 15",
            "prompt": "<p>Using the Sequencer transform controls for the 'hand_r_bone' control, adjust the position slightly along the local X or Z axis (e.g., +1.5 units) to pull the hand away from the relic.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Using the Sequencer transform controls for the 'hand_r_bone' control, adjust the position slightly along the local X or Z axis (e.g., +1.5 units) to pull the hand away from the relic.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Checking the collision settings of the Skeletal Mesh and the Static Mesh, attempting to use physics/collision response to fix a visual/transform issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "sequencercinematics",
            "title": "Step 16",
            "prompt": "<p>Set a keyframe on the Control Rig track for the adjusted hand position at Frame 180.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Set a keyframe on the Control Rig track for the adjusted hand position at Frame 180.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Opening the SM_Relic Material Blueprint and attempting to debug the Glow Intensity logic within the Material Editor, assuming the material itself is flawed.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "sequencercinematics",
            "title": "Step 17",
            "prompt": "<p>Add flanking keyframes (e.g., at Frame 160 and Frame 200) where the hand transform is reset to 0.0 relative offset, ensuring a smooth blend into and out of the correction.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Add flanking keyframes (e.g., at Frame 160 and Frame 200) where the hand transform is reset to 0.0 relative offset, ensuring a smooth blend into and out of the correction.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>In the animation editor (Persona), trying to edit the base 'Anim_Pickup_Relic' animation asset to fix the clipping, thus permanently altering the source data.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "sequencercinematics",
            "title": "Step 18",
            "prompt": "<p>Review the entire sequence playback, checking both the 'Glow_Intensity' fade timing and the hand/relic interaction at the point of pickup.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Review the entire sequence playback, checking both the 'Glow_Intensity' fade timing and the hand/relic interaction at the point of pickup.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Checking the collision settings of the Skeletal Mesh and the Static Mesh, attempting to use physics/collision response to fix a visual/transform issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "sequencercinematics",
            "title": "Step 19",
            "prompt": "<p>Save the 'Pickup_Cinematic' Level Sequence asset.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Save the 'Pickup_Cinematic' Level Sequence asset.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Opening the SM_Relic Material Blueprint and attempting to debug the Glow Intensity logic within the Material Editor, assuming the material itself is flawed.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-19"
                }
            ]
        },
        "step-20": {
            "skill": "sequencercinematics",
            "title": "Step 20",
            "prompt": "<p>Save the current level to ensure the changes to the possessed actors are retained.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Save the current level to ensure the changes to the possessed actors are retained.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>In the animation editor (Persona), trying to edit the base 'Anim_Pickup_Relic' animation asset to fix the clipping, thus permanently altering the source data.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-20"
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
