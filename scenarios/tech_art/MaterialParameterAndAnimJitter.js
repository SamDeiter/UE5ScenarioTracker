window.SCENARIOS['MaterialParameterAndAnimJitter'] = {
    "meta": {
        "title": "Desynchronized Material Effects and Animation Jitter in Cinematic Sequence",
        "description": "A complex cinematic sequence, 'Pickup_Cinematic', is exhibiting two major flaws. First, a crucial glowing prop (SM_Relic) loses its emissive intensity abruptly just as the character starts the pickup motion, then returns to full intensity after the camera cuts. The desired effect is a slow, smooth fade over 4 seconds during the pickup. Second, the character's right hand slightly clips through the SM_Relic during the final moments of the grab animation, suggesting a subtle transform offset issue.",
        "estimateHours": 1.5,
        "category": "Sequencer & Cinematics",
        "tokens_used": 10505
    },
    "setup": [
        {
            "action": "set_ue_property",
            "scenario": "MaterialParameterAndAnimJitter",
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
            "scenario": "MaterialParameterAndAnimJitter",
            "step": "final"
        }
    ],
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "general",
            "title": "Diagnosis: Desynchronized Material & Animation Jitter",
            "prompt": "<p>A cinematic sequence, 'Pickup_Cinematic', shows two flaws: a glowing prop abruptly fades and a character's hand clips the prop. What's your first step?</p>",
            "choices": [
                {
                    "text": "<p>Locate and open the 'Pickup_Cinematic' Level Sequence asset in the Content Browser.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Starting by opening the Level Sequence asset is the correct and most direct way to investigate cinematic issues.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Start the game in Play In Editor (PIE) to observe the issue in real-time.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Observing in PIE doesn't allow direct editing; the problem is in the sequence asset, which needs to be opened in the editor.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Open the Level Blueprint to check for cinematic related logic.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. Level Blueprint is for level-specific scripting, not directly for debugging keyframe and animation issues within a Level Sequence asset.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Open the current level and locate the cinematic in the World Outliner.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While in the right environment, directly opening the Sequence asset from the Content Browser is more efficient than navigating via the World Outliner.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "sequencer",
            "title": "Investigating Emissive Fade Issue",
            "prompt": "<p>You've opened 'Pickup_Cinematic'. The SM_Relic glow fades abruptly. How do you begin investigating its emissive parameter in Sequencer?</p>",
            "choices": [
                {
                    "text": "<p>In the Sequencer timeline, select the track corresponding to the static mesh 'SM_Relic'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Selecting the actor's track in Sequencer is the correct way to access its properties and parameters.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Select the camera cut track to check for transitions that might affect the prop.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Camera cuts dictate viewport changes, not material parameters of an individual prop.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Search for 'Glow_Intensity' in the Details panel of the Sequencer while no track is selected.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. Material parameters are tied to specific actor tracks and components; they are not globally accessible in the Sequencer's Details panel without a selection.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Select the character's skeletal mesh track, assuming its animation might influence the prop's glow.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Incorrectly focuses on the character; the glow issue is specific to the SM_Relic itself.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "sequencer",
            "title": "Locating Glow Parameter Track",
            "prompt": "<p>You've selected the 'SM_Relic' track. Where do you look for the 'Glow_Intensity' parameter to understand its behavior?</p>",
            "choices": [
                {
                    "text": "<p>Expand the Material Parameter section under the SM_Relic track, specifically targeting the parameter named 'Glow_Intensity'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Material Parameters are precisely where you control emissive properties in Sequencer.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Open the SM_Relic Material Blueprint and attempt to debug the Glow Intensity logic within the Material Editor, assuming the material itself is flawed.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.4hrs. The problem is keyframes in Sequencer, not the material's underlying logic. This is a common misdiagnosis that wastes significant time.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Check the 'Transform' track for SM_Relic, thinking it might affect emissive intensity.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. The Transform track controls position, rotation, and scale, not material parameters like emissive intensity.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Look for a 'Visibility' or 'Fade' track instead, assuming the prop is being hidden.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. While visually similar, the problem explicitly states emissive intensity, pointing to a material parameter, not visibility.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "sequencer",
            "title": "Diagnosing Abrupt Glow Fade",
            "prompt": "<p>You've located the 'Glow_Intensity' parameter track. What's the next step to diagnose the abrupt fade-out at the start of the pickup motion?</p>",
            "choices": [
                {
                    "text": "<p>Observe the keyframes for 'Glow_Intensity'. Note the unexpected keyframe at Frame 30, which abruptly sets the value to 0.0.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.15hrs. Identifying the specific problematic keyframe is crucial for understanding and fixing the abrupt fade.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Adjust the default 'Glow_Intensity' value in the Details panel.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Adjusting the default value won't override existing keyframes in Sequencer and won't fix the timing issue.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Scrub the timeline to the very end to see the final glow state.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While part of a full review, the immediate problem occurs at Frame 30; focus debugging efforts there first.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Check the animation curves for 'Glow_Intensity' without pinpointing specific keyframes.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Less precise; the problematic keyframe needs direct identification for deletion or modification.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "sequencer",
            "title": "Correcting Premature Fade-out",
            "prompt": "<p>You've found an erroneous keyframe at Frame 30 setting 'Glow_Intensity' to 0.0. How do you correct this premature fade-out?</p>",
            "choices": [
                {
                    "text": "<p>Delete the erroneous 'Glow_Intensity' keyframe located at Frame 30 to prevent the premature fade.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Removing the unwanted keyframe is the most direct way to eliminate the abrupt fade-out.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Add a new keyframe at Frame 31 with a value of 5.0 to counteract the fade.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This creates another abrupt change, not the desired smooth fade. It's fighting the problem instead of removing it.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Change the value of the keyframe at Frame 30 to 5.0 (its maximum intensity).</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. This would keep the glow at maximum intensity at Frame 30, which might interfere with the *intended* later fade, but doesn't remove the unwanted keyframe interaction.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Drag the keyframe from Frame 30 to a later point in the timeline.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This would simply move the abrupt fade-out to a new location, not resolve the issue of an unwanted abruptness.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "sequencer",
            "title": "Setting Fade Start Point",
            "prompt": "<p>The erroneous keyframe is gone. Now, set up the desired smooth 4-second fade. Where should the fade *begin* according to the desired effect (Frame 80)?</p>",
            "choices": [
                {
                    "text": "<p>Scrub the timeline to the start of the required fade (Frame 80) and ensure the Glow_Intensity is keyed to its maximum value (e.g., 5.0).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Establishing the starting point at full intensity is crucial for the subsequent fade-out.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Set the global 'Glow_Intensity' value in the Material Editor to 5.0.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This bypasses Sequencer control entirely and affects the material universally, not just within the cinematic.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Enable auto-keying and scrub the timeline, hoping to record changes.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Risky; auto-keying can generate unintended keyframes or miss precise timing, especially when setting specific points.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Key the 'Glow_Intensity' at Frame 80 to 0.0, assuming it's the fade-out start.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This would immediately fade out at Frame 80, rather than starting at full intensity to begin the fade.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "sequencer",
            "title": "Setting Fade End Point",
            "prompt": "<p>You've set the start of the fade at Frame 80. The desired effect is a slow, smooth fade over 4 seconds. Where should the fade *end* and what value should be keyed?</p>",
            "choices": [
                {
                    "text": "<p>Scrub the timeline to the end of the required fade (Frame 200, 4 seconds later) and key the 'Glow_Intensity' parameter to 0.0.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Setting the end keyframe with the desired value completes the smooth, timed fade.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Add a 'Pulse' effect track to the SM_Relic to simulate fading.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This is an incorrect approach for a simple material parameter fade; it would overcomplicate the effect.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Key the 'Glow_Intensity' to 0.0 at Frame 120 (1 second later).</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. This would create a 1-second fade, not the desired 4-second fade. Careful with timing calculations!</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Apply an easing curve to the existing Frame 80 keyframe without adding a new keyframe.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. An easing curve needs at least two keyframes to apply a gradual change across a range; this step is about setting the end keyframe.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "sequencer",
            "title": "Investigating Hand Clipping Issue",
            "prompt": "<p>The glow fade should now be correct. Next, address the character's right hand slightly clipping through the SM_Relic. What's your first investigative step in Sequencer?</p>",
            "choices": [
                {
                    "text": "<p>Select the track for the Skeletal Mesh Actor (SKM_Hero) and examine the tracks for any conflicting data, focusing on the Transform track.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.15hrs. The character's transform is the most likely culprit for clipping issues in a cinematic.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Check the collision settings of the Skeletal Mesh and the Static Mesh, attempting to use physics/collision response to fix the issue.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. This is a visual/transform issue during animation, not a physics collision problem that requires modifying collision settings.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Open the character's Animation Blueprint to look for blend space issues.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. The issue is more likely a Sequencer override or a subtle blend issue within the sequence, not in the base AnimBP logic.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Examine the SM_Relic's transform track for unexpected movement.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. While good to check, the clipping is described as the *hand* going through the relic, pointing to the character's transform as the primary suspect.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "sequencer",
            "title": "Identifying Transform Track Conflict",
            "prompt": "<p>You're examining the SKM_Hero track. What specific conflict might be causing the subtle hand clipping with the SM_Relic?</p>",
            "choices": [
                {
                    "text": "<p>Identify that an existing 'Transform' track, added on top of the 'Anim_Pickup_Relic' animation, is causing a subtle additive offset.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Overriding Transform tracks are a common source of unexpected offsets in Sequencer.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Assume the entire 'Anim_Pickup_Relic' animation asset is fundamentally broken.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This is too broad an assumption. Always look for Sequencer overrides before blaming the source asset.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Look for a 'Post Process Anim Blueprint' track being applied.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. While possible, a simple additive transform track is a more common and direct cause for this type of issue.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Check the 'Visibility' track for the hand bone to see if it's flickering.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Visibility issues are unrelated to clipping, which is a spatial (transform) problem.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "sequencer",
            "title": "Removing Conflicting Transform Track",
            "prompt": "<p>You've identified a superfluous 'Transform' track on the SKM_Hero actor causing an additive offset and likely contributing to the clipping. What's your next action?</p>",
            "choices": [
                {
                    "text": "<p>Delete the entire superfluous 'Transform' track on the SKM_Hero actor, relying solely on the underlying animation clip for movement.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Removing the conflicting override is often the cleanest solution when the base animation should dictate movement.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Bake the animation track to a new asset to incorporate the offsets.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Baking would permanently incorporate the *bad* offset into a new asset, not fix it. It's not a corrective action.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Disable the 'Transform' track instead of deleting it.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While it stops the immediate effect, the track is still present, cluttering the Sequencer and potentially leading to accidental re-enabling.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Delete only the keyframes within the 'Transform' track.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The track itself would remain, which can be confusing or lead to accidental new keys being added later. Deleting the entire track is cleaner.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "sequencer",
            "title": "Preparing for Fine-tuning with Control Rig",
            "prompt": "<p>You've removed the superfluous 'Transform' track. However, reviewing shows the hand still slightly clips. You need non-destructive fine-tuning of the base animation. How do you add a layer of control for this?</p>",
            "choices": [
                {
                    "text": "<p>Right-click the 'Anim_Pickup_Relic' animation clip itself in the Sequencer timeline.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. This is the entry point for adding advanced animation controls like a Control Rig to an existing animation clip.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>In the animation editor (Persona), try to edit the base 'Anim_Pickup_Relic' animation asset to fix the clipping.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.3hrs. Modifying the source animation asset is destructive and highly discouraged for sequence-specific fixes. Use non-destructive methods.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Right-click on the 'SKM_Hero' actor in the World Outliner and look for animation options.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. Less direct; you need to interact with the specific *animation clip* within Sequencer to add a Control Rig.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Add a new 'Transform' track to the SKM_Hero actor again, and try to keyframe corrections.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. This would reintroduce the issue of overriding the base animation with potentially conflicting transforms; a Control Rig offers more precise, additive control.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "sequencer",
            "title": "Adding Control Rig Track",
            "prompt": "<p>You've right-clicked the 'Anim_Pickup_Relic' animation clip. What option do you choose to gain fine-grained control over individual bones for corrective adjustments?</p>",
            "choices": [
                {
                    "text": "<p>Select 'Add Control Rig Track' from the context menu to introduce a layer for fine-tuning bone positions without modifying the base animation asset.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The Control Rig is the ideal tool for non-destructive, additive bone manipulation within Sequencer.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Select 'Add Additive Animation' track to add a corrective animation.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. An additive animation track is for blending entire animations, not for precise, individual bone adjustments for clipping.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Select 'Add Animation Data Track' to add more animation clips.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. This is for blending additional animation clips, not for creating a layer of bone-level control.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Select 'Add Master Pose Component' track.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This is for sharing skeletal mesh poses, not for direct, keyed bone manipulation in this context.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "sequencer",
            "title": "Selecting Hand Control in Control Rig",
            "prompt": "<p>A 'Control Rig Track' has been added. You need to adjust the right hand. How do you find and select the control relevant to the right hand?</p>",
            "choices": [
                {
                    "text": "<p>Expand the newly created Control Rig track and select the bone controlling the right hand (e.g., 'hand_r_bone' or similar relevant control).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Expanding the track reveals the individual controls (bones) available for manipulation.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Try to manually select the right hand directly in the viewport.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. While possible for actors, for specific bones within a Control Rig in Sequencer, you need to select the control in the timeline.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Search for 'hand_r_bone' in the Content Browser to open its asset.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. The bone control is part of the Sequencer track and its runtime Control Rig, not a separate asset to open.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Select the 'root' bone control, expecting child bones to follow.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Adjusting the root bone would affect the entire character's pose, not just the specific hand experiencing clipping.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "sequencer",
            "title": "Pinpointing Clipping Frame",
            "prompt": "<p>You've selected the right hand control. What's the next logical step to make the precise adjustment for the clipping issue?</p>",
            "choices": [
                {
                    "text": "<p>Scrub to the exact frame where the clipping occurs (around Frame 180).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Pinpointing the exact frame ensures that your correction is applied precisely where needed.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Start playing the sequence from the beginning to observe the clipping.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. While useful for general review, it's less precise for fixing an issue at a specific frame than scrubbing.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Go to the first frame of the animation to prepare for a general correction.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. The clipping occurs towards the end of the grab animation; focusing on the beginning is inefficient for this specific issue.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Make adjustments immediately without scrubbing to the exact frame.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Lack of precision might lead to an ineffective fix or require rework later.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "sequencer",
            "title": "Adjusting Hand Position",
            "prompt": "<p>You're at Frame 180 with the 'hand_r_bone' control selected. How do you fix the clipping issue?</p>",
            "choices": [
                {
                    "text": "<p>Using the Sequencer transform controls for the 'hand_r_bone' control, adjust the position slightly along the local X or Z axis (e.g., +1.5 units) to pull the hand away from the relic.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Direct positional adjustment using the control rig is the most effective way to correct clipping without distorting the hand.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Apply a scale transform to the hand bone.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Scaling the bone will distort the hand geometry and is not the appropriate method to solve a positional clipping issue.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Adjust the rotation of the hand bone.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. While rotation can indirectly affect position, direct positional adjustment is usually more precise and controllable for clipping.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Adjust the transform of the entire SKM_Hero actor.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. This is too broad an adjustment; it would affect the entire character's pose relative to the relic, not just the specific hand that is clipping.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "sequencer",
            "title": "Keyframing Hand Adjustment",
            "prompt": "<p>You've made the positional adjustment to the 'hand_r_bone' at Frame 180. What must you do to save this specific correction within the sequence?</p>",
            "choices": [
                {
                    "text": "<p>Set a keyframe on the Control Rig track for the adjusted hand position at Frame 180.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Setting a keyframe is essential to record and persist the specific transform adjustment at that point in time.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Save the Control Rig asset in the Content Browser.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Control Rig changes made directly in Sequencer are specific to that sequence and aren't saved as a standalone asset in the Content Browser.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Assume auto-keying is active and the change is automatically recorded.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Relying solely on auto-keying without verification is risky, and it might not be enabled or configured precisely for this type of adjustment.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Make adjustments, then immediately scrub away from Frame 180.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The adjustment won't be saved if a keyframe isn't explicitly set, leading to lost work.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "sequencer",
            "title": "Creating Smooth Blends for Correction",
            "prompt": "<p>You've keyed the correction at Frame 180. To ensure a smooth transition into and out of this correction, what additional keyframes are needed?</p>",
            "choices": [
                {
                    "text": "<p>Add flanking keyframes (e.g., at Frame 160 and Frame 200) where the hand transform is reset to 0.0 relative offset, ensuring a smooth blend.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Flanking keyframes are vital for controlling the start and end of the correction, creating a natural blend.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Delete the Control Rig track entirely, assuming the single keyframe is enough.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Deleting the track will remove the correction you just made, as it holds the keyframes.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Apply a constant offset to the hand bone throughout the entire Control Rig track.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. A constant offset would fix clipping at Frame 180 but potentially cause new issues elsewhere or prevent a natural animation flow throughout the sequence.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Only add one flanking keyframe (e.g., at Frame 160) for the blend.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. You need both an 'in' and 'out' keyframe (flanking both sides) to ensure a smooth blend into and out of the correction, not just one.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "verification",
            "title": "Reviewing All Changes",
            "prompt": "<p>Both the glow intensity and hand clipping issues have been addressed. What's the essential final step to verify all changes?</p>",
            "choices": [
                {
                    "text": "<p>Review the entire sequence playback, checking both the 'Glow_Intensity' fade timing and the hand/relic interaction at the point of pickup.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Comprehensive verification ensures that all issues are resolved and no new problems were introduced.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Only review the glow intensity, assuming the hand fix worked as intended.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Incomplete verification is risky. Both issues need checking, as well as the overall sequence flow.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Open the character's skeletal mesh in Persona to verify the animation.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. The fixes (especially Control Rig adjustments) are specific to Sequencer and won't be visible when viewing the raw animation in Persona.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Play the sequence in a small loop around Frame 180 only, focusing on the hand.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While useful for the hand, a full review of the entire sequence is necessary to confirm the glow fade timing and ensure no other issues arose.</p>",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "saving",
            "title": "Saving Level Sequence Asset",
            "prompt": "<p>You've reviewed the sequence and confirmed the fixes. What should be saved first to preserve your work within the cinematic asset?</p>",
            "choices": [
                {
                    "text": "<p>Save the 'Pickup_Cinematic' Level Sequence asset.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Saving the Level Sequence asset itself is crucial to store all the changes made within that cinematic asset.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Export the sequence as an FBX file.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Exporting as FBX is for external use or archival, not for saving active changes within the Unreal Editor.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Try to cook content directly.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Cooking content is for packaging a game, not for saving ongoing editor changes. It's premature and not the correct save action.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Only save the character's Skeletal Mesh asset.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Changes were made to the sequence *referencing* the skeletal mesh and prop, not directly to their base assets, so saving those assets specifically isn't the primary action.</p>",
                    "next": "step-19"
                }
            ]
        },
        "step-20": {
            "skill": "saving",
            "title": "Saving Current Level",
            "prompt": "<p>The Level Sequence asset is saved. What's the final crucial save operation to ensure all changes, especially those to possessed actors and their references in the level, are retained?</p>",
            "choices": [
                {
                    "text": "<p>Save the current level to ensure the changes to the possessed actors are retained.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Saving the level ensures that all references to the cinematic, and any changes to level-placed actors controlled by it, are persistently stored.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Quit the editor immediately, assuming all is saved.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This will result in losing any unsaved changes to the level, which is critical for persistence.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Revert the level to the last saved version to be safe.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Reverting would undo all your hard work and is the opposite of saving your current changes.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Only save the 'SM_Relic' asset if it was referenced directly.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While individual assets may need saving if modified, saving the *level* is essential to preserve the state and references of all actors within that level.</p>",
                    "next": "step-20"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario, resolving both the material fade and animation clipping issues. Your total estimated time spent is 1.5 hours.</p>",
            "choices": [{"text": "Complete Scenario", "type": "correct", "feedback": "", "next": "end"}]
        }
    }
};
