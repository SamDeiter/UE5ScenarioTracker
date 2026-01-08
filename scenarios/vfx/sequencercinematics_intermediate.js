window.SCENARIOS['CinematicHandClipping'] = {
    meta: {
        expanded: true,
        title: "Hand Clips Through Prop",
        description: "Animation compression causes clipping. Investigates Control Rig additive layers in Sequencer.",
        estimateHours: 1.5,
        category: "Cinematics"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'sequencer',
            title: 'The Symptom',
            prompt: "During a pickup shot in your cinematic, the character's hand slides through the prop instead of landing cleanly on it. The placement looks imprecise right at the moment of contact. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You scrub the sequence frame by frame in Sequencer and enable animation debug overlays. You see that the base animation is close, but the fingers and wrist miss the prop by just a few centimeters and clip through it. It's clearly a posing / alignment issue, not a missing attach or visibility problem.",
                    next: 'step-2'
                },
                {
                    text: "Wrong Guess]",
                    type: 'wrong',
                    feedback: "You try nudging the prop in the level and tweaking its collision, but the hand still visibly clips during the pickup. Moving the prop just breaks other shots, so this clearly isn't the right fix.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'sequencer',
            title: 'Dead End: Wrong Guess',
            prompt: "Adjusting the prop's transform didn't solve the clipping and started to hurt continuity in other angles. You realize the problem is with the character's pose during the grab, not the prop itself.",
            choices: [
                {
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You revert the prop offsets and refocus on the character animation in Sequencer--specifically the hand and attach timing.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'sequencer',
            title: 'Investigation',
            prompt: "You inspect the animation track and the prop attachment in Sequencer. The timing is right, but the hand bone is just slightly off-target during the grab. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You determine that animation compression has smoothed out the precise finger movements, or the original mocap data just doesn't perfectly align with this specific prop. The animation itself is 'correct' but needs a non-destructive adjustment on top to fit the scene perfectly.",
                    next: 'step-2A'
                },
                {
                    text: "Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try re-recording the entire sequence or moving the prop's pivot, but that's overkill and creates new problems. You just need a local adjustment for these specific frames.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'sequencer',
            title: 'Dead End: Misguided',
            prompt: "Re-doing the whole animation or changing global transforms is too destructive. You need a way to tweak the hand position *only* during the grab without breaking the rest of the shot.",
            choices: [
                {
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize that Sequencer's Control Rig integration allows for additive adjustments on top of existing animation tracks.",
                    next: 'step-2A'
                }
            ]
        },
        'step-3': {
            skill: 'sequencer',
            title: 'The Fix',
            prompt: "You need to fix the hand clipping without replacing the base animation. How do you do this?",
            choices: [
                {
                    text: "Use Control Rig to add additive offset.]",
                    type: 'correct',
                    feedback: "You right-click the skeletal mesh track in Sequencer and select 'Bake to Control Rig' or simply add a Control Rig track with 'Additive' enabled. You then keyframe the hand control to offset the position slightly during the grab frames, ensuring a clean contact with the prop. The base animation still plays, but your additive layer fixes the clipping.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'sequencer',
            title: 'Verification',
            prompt: "You scrub through the timeline and play the cinematic in PIE. How do you verify the fix?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, the character reaches out and grabs the prop with perfect alignment. The fingers no longer clip through the object, and the rest of the animation remains untouched. The additive Control Rig adjustment solved the specific spacing issue.",
                    next: 'step-2a'
                }
            ]
        },
        'step-2a': {
            skill: 'sequencer',
            title: 'Step 2a: Precise Bone Transform Analysis',
            prompt: "You've confirmed the hand bone is slightly off. To understand the exact misalignment, you need to inspect the bone's transform values directly. How do you do this in Sequencer?",
            choices: [
                {
                    text: "Inspect Hand Bone Transform in Sequencer]",
                    type: 'correct',
                    feedback: "You select the character's skeletal mesh track in Sequencer, expand it to find the specific hand bone (e.g., 'hand_r'), and inspect its transform curves. You notice small, consistent offsets in position (X, Y, Z) during the grab frames, confirming it's a precise positional error rather than a rotation or scale issue.",
                    next: 'step-2b'
                },
                {
                    text: "Try to adjust the bone in Persona]",
                    type: 'wrong',
                    feedback: "Adjusting the bone directly in Persona would modify the base animation asset, which is destructive and would affect all instances of that animation. You need a non-destructive, shot-specific fix.",
                    next: 'step-2aW'
                },
            ]
        },

        'step-2aW': {
            skill: 'sequencer',
            title: 'Dead End: Persona Adjustment',
            prompt: "Modifying the base animation asset in Persona is too broad and destructive for a shot-specific issue. You need to inspect the current state in Sequencer.",
            choices: [
                {
                    text: "Revert and inspect in Sequencer]",
                    type: 'correct',
                    feedback: "You revert any changes in Persona and return to Sequencer to inspect the hand bone's transform curves directly.",
                    next: 'step-2b'
                },
            ]
        },

        'step-2b': {
            skill: 'animation',
            title: 'Step 2b: Animation Compression Investigation',
            prompt: "The scenario description mentioned animation compression as a potential cause. How would you investigate if compression is contributing to the subtle misalignment?",
            choices: [
                {
                    text: "Check Animation Asset Compression Settings]",
                    type: 'correct',
                    feedback: "You open the base animation asset in Persona and navigate to its compression settings. You temporarily set the 'Compression Algorithm' to 'AC_None' or reduce the 'Max Error' for the relevant bones. After re-saving and re-evaluating in Sequencer, you observe a slight improvement, confirming compression was indeed a factor, but not the sole cause, and disabling it entirely is too costly for runtime.",
                    next: 'step-2c_redherring'
                },
                {
                    text: "Adjust Physics Asset Collision]",
                    type: 'wrong',
                    feedback: "While physics assets define collision, they primarily affect dynamic interactions and ragdolls, not the precise posing of a static grab animation. This won't help with the subtle positional error.",
                    next: 'step-2bW'
                },
            ]
        },

        'step-2bW': {
            skill: 'animation',
            title: 'Dead End: Physics Asset',
            prompt: "Adjusting the Physics Asset won't solve a precise animation posing issue. You need to focus on the animation data itself.",
            choices: [
                {
                    text: "Re-focus on animation settings]",
                    type: 'correct',
                    feedback: "You realize the problem is with the animation data's precision, not its collision representation, and return to investigating animation compression settings.",
                    next: 'step-2c_redherring'
                },
            ]
        },

        'step-2c_redherring': {
            skill: 'animation_blueprint',
            title: 'Red Herring: AnimBP Override Attempt',
            prompt: "You consider if an Animation Blueprint might be overriding the hand's position. How would you check this, and is it the right approach for a cinematic shot?",
            choices: [
                {
                    text: "Check AnimBP for 'Transform (Modify) Bone' nodes]",
                    type: 'misguided',
                    feedback: "You open the character's Animation Blueprint and look for 'Transform (Modify) Bone' nodes or other IK setups affecting the hand. While you might find some, you realize that adding a new node here would be a global change affecting all instances of this AnimBP, which is not ideal for a specific cinematic shot. Sequencer offers a more targeted solution.",
                    next: 'step-2A'
                },
                {
                    text: "Realize AnimBP is not the best approach for Sequencer]",
                    type: 'correct',
                    feedback: "You correctly identify that while AnimBPs can modify bone transforms, making a global change for a specific cinematic shot is inefficient and prone to breaking other animations. Sequencer's Control Rig integration is designed for precise, shot-specific adjustments.",
                    next: 'step-2A'
                },
            ]
        },

        'step-4a': {
            skill: 'optimization',
            title: 'Step 4a: Performance and Regression Check',
            prompt: "The clipping is fixed, but you need to ensure your solution hasn't introduced any performance hitches or unintended side effects in other parts of the cinematic. What's your next verification step?",
            choices: [
                {
                    text: "Monitor Performance with Stat Commands]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat anim` in PIE while playing the sequence. You observe that the added Control Rig layer has a negligible impact on performance, confirming it's an efficient solution. You also scrub through other shots in the sequence to ensure no other animations were inadvertently affected.",
                    next: 'step-4b'
                },
                {
                    text: "Re-export the entire animation]",
                    type: 'wrong',
                    feedback: "Re-exporting the entire animation would be a destructive and time-consuming process, negating the benefit of the non-destructive Control Rig fix. This is not a verification step.",
                    next: 'step-4aW'
                },
            ]
        },

        'step-4aW': {
            skill: 'optimization',
            title: 'Dead End: Re-exporting Animation',
            prompt: "Re-exporting the animation is not a verification step and undoes the non-destructive nature of your fix. You need to verify the *current* solution's impact.",
            choices: [
                {
                    text: "Focus on performance and side effects]",
                    type: 'correct',
                    feedback: "You refocus on verifying the performance and ensuring no regressions were introduced by the Control Rig adjustment.",
                    next: 'step-4b'
                },
            ]
        },

        'step-4b': {
            skill: 'sequencer',
            title: 'Step 4b: Final Visual Scrutiny',
            prompt: "You've confirmed the fix and checked performance. For final sign-off, you want to be absolutely certain the hand-prop interaction looks perfect from all angles and speeds. What's your final visual check?",
            choices: [
                {
                    text: "Render Preview and Review from Multiple Angles]",
                    type: 'correct',
                    feedback: "You render out a high-quality preview of the shot, then review it frame-by-frame and from various camera angles (including extreme close-ups and wide shots). You also play the sequence in slow-motion within Sequencer to catch any subtle remaining jitters or misalignments. The hand contact remains clean and natural throughout.",
                    next: 'step-2A'
                }
            ]
        },
        'step-2A': {
            skill: 'sequencer',
            title: 'Step 2A: Deeper Animation Inspection',
            prompt: "The base animation seems off. To confirm if it's compression or raw data inaccuracy, what specific debug views do you enable in Sequencer?",
            choices: [
                {
                    text: "Enable 'Show > Animation > Bones' and 'Show > Animation > Raw Animation']",
                    type: 'correct',
                    feedback: "You observe that the 'Raw Animation' shows the hand closer to the prop, but the 'Bones' (which reflect compressed data) are slightly offset, confirming compression as a contributing factor. You also notice the raw data itself isn't perfectly aligned, indicating a need for fine-tuning.",
                    next: 'step-2A'
                },
                {
                    text: "Try 'Show > Collision' or 'Show > Physics Assets']",
                    type: 'wrong',
                    feedback: "While useful, these views are for collision and physics, not directly for animation bone data. You need to inspect the animation itself to understand the bone transforms.",
                    next: 'step-2A'
                },
            ]
        },

        'step-2B': {
            skill: 'level_editor',
            title: 'Step 2B: Collision & Physics Check',
            prompt: "Before applying an animation fix, it's crucial to ensure the prop's collision is correctly set up. How do you quickly verify this in the viewport?",
            choices: [
                {
                    text: "Enable 'Show > Collision' or use console command 'pxvis collision']",
                    type: 'correct',
                    feedback: "You confirm the prop has a simple, correctly shaped collision mesh that the hand *should* interact with. This rules out a fundamental collision setup issue, reinforcing that the problem is animation-related and requires a posing adjustment.",
                    next: 'step-2A'
                },
                {
                    text: "Adjust the prop's physics asset settings]",
                    type: 'wrong',
                    feedback: "Adjusting physics assets is for dynamic simulations, not static collision checks for animation. You need to visualize the collision geometry itself to confirm its shape and placement.",
                    next: 'step-2A'
                },
            ]
        },

        'step-2R': {
            skill: 'animation',
            title: 'Dead End: Re-importing Animation',
            prompt: "You suspect animation compression is the culprit. What's a common, but often overkill or destructive, approach to try and fix this specific issue?",
            choices: [
                {
                    text: "Re-import the animation asset with different compression settings]",
                    type: 'correct',
                    feedback: "You try re-importing the animation with 'None' or 'Per-Bone' compression. While it might slightly improve accuracy, it's a time-consuming process, increases file size, and doesn't guarantee a perfect per-shot fix. You realize a non-destructive, additive approach is better for specific cinematic adjustments.",
                    next: 'step-2A'
                },
            ]
        },

        'step-4A': {
            skill: 'packaging',
            title: 'Step 4A: Standalone Game Test',
            prompt: "The fix looks good in PIE. What's the next critical step to ensure it holds up in a real game environment, accounting for potential editor-only discrepancies?",
            choices: [
                {
                    text: "Launch the game in Standalone Game mode or a packaged build]",
                    type: 'correct',
                    feedback: "You run the cinematic in a standalone game instance. The hand interaction remains perfectly aligned, confirming the Control Rig adjustment is correctly applied and baked, and not just an editor-only artifact. This verifies the fix in a more realistic runtime scenario.",
                    next: 'step-4A'
                },
                {
                    text: "Share the sequence with a colleague for review]",
                    type: 'wrong',
                    feedback: "While peer review is good, it doesn't replace technical verification in a game-like environment. You need to confirm the fix works outside of the editor's specific context.",
                    next: 'step-4A'
                },
            ]
        },

        'step-4B': {
            skill: 'optimization',
            title: 'Step 4B: Performance Impact Check',
            prompt: "Additive Control Rig layers add computation. How do you quickly check if your fix has introduced any noticeable performance overhead, especially on animation or game thread time?",
            choices: [
                {
                    text: "Use console commands like 'stat unit' or 'stat anim']",
                    type: 'correct',
                    feedback: "You enable 'stat unit' and 'stat anim' during playback. You observe minimal to no increase in animation or game thread time, confirming the additive layer is lightweight and efficient for this specific adjustment without impacting performance.",
                    next: 'step-4A'
                },
                {
                    text: "Profile the entire game for several minutes using Unreal Insights]",
                    type: 'wrong',
                    feedback: "Unreal Insights is powerful but overkill for a quick check on a specific animation adjustment. 'stat unit' or 'stat anim' provide immediate, relevant feedback for this scenario without deep profiling.",
                    next: 'step-4A'
                },
            ]
        },

        
        'step-2a': {
            skill: 'sequencer',
            title: 'Step 2a: Precise Bone Transform Analysis',
            prompt: "You've confirmed the hand bone is slightly off. To understand the exact misalignment, you need to inspect the bone's transform values directly. How do you do this in Sequencer?",
            choices: [
                {
                    text: "Inspect Hand Bone Transform in Sequencer]",
                    type: 'correct',
                    feedback: "You select the character's skeletal mesh track in Sequencer, expand it to find the specific hand bone (e.g., 'hand_r'), and inspect its transform curves. You notice small, consistent offsets in position (X, Y, Z) during the grab frames, confirming it's a precise positional error rather than a rotation or scale issue.",
                    next: 'step-2b'
                },
                {
                    text: "Try to adjust the bone in Persona]",
                    type: 'wrong',
                    feedback: "Adjusting the bone directly in Persona would modify the base animation asset, which is destructive and would affect all instances of that animation. You need a non-destructive, shot-specific fix.",
                    next: 'step-2aW'
                },
            ]
        },

        'step-2aW': {
            skill: 'sequencer',
            title: 'Dead End: Persona Adjustment',
            prompt: "Modifying the base animation asset in Persona is too broad and destructive for a shot-specific issue. You need to inspect the current state in Sequencer.",
            choices: [
                {
                    text: "Revert and inspect in Sequencer]",
                    type: 'correct',
                    feedback: "You revert any changes in Persona and return to Sequencer to inspect the hand bone's transform curves directly.",
                    next: 'step-2b'
                },
            ]
        },

        'step-2b': {
            skill: 'animation',
            title: 'Step 2b: Animation Compression Investigation',
            prompt: "The scenario description mentioned animation compression as a potential cause. How would you investigate if compression is contributing to the subtle misalignment?",
            choices: [
                {
                    text: "Check Animation Asset Compression Settings]",
                    type: 'correct',
                    feedback: "You open the base animation asset in Persona and navigate to its compression settings. You temporarily set the 'Compression Algorithm' to 'AC_None' or reduce the 'Max Error' for the relevant bones. After re-saving and re-evaluating in Sequencer, you observe a slight improvement, confirming compression was indeed a factor, but not the sole cause, and disabling it entirely is too costly for runtime.",
                    next: 'step-2c_redherring'
                },
                {
                    text: "Adjust Physics Asset Collision]",
                    type: 'wrong',
                    feedback: "While physics assets define collision, they primarily affect dynamic interactions and ragdolls, not the precise posing of a static grab animation. This won't help with the subtle positional error.",
                    next: 'step-2bW'
                },
            ]
        },

        'step-2bW': {
            skill: 'animation',
            title: 'Dead End: Physics Asset',
            prompt: "Adjusting the Physics Asset won't solve a precise animation posing issue. You need to focus on the animation data itself.",
            choices: [
                {
                    text: "Re-focus on animation settings]",
                    type: 'correct',
                    feedback: "You realize the problem is with the animation data's precision, not its collision representation, and return to investigating animation compression settings.",
                    next: 'step-2c_redherring'
                },
            ]
        },

        'step-2c_redherring': {
            skill: 'animation_blueprint',
            title: 'Red Herring: AnimBP Override Attempt',
            prompt: "You consider if an Animation Blueprint might be overriding the hand's position. How would you check this, and is it the right approach for a cinematic shot?",
            choices: [
                {
                    text: "Check AnimBP for 'Transform (Modify) Bone' nodes]",
                    type: 'misguided',
                    feedback: "You open the character's Animation Blueprint and look for 'Transform (Modify) Bone' nodes or other IK setups affecting the hand. While you might find some, you realize that adding a new node here would be a global change affecting all instances of this AnimBP, which is not ideal for a specific cinematic shot. Sequencer offers a more targeted solution.",
                    next: 'step-3'
                },
                {
                    text: "Realize AnimBP is not the best approach for Sequencer]",
                    type: 'correct',
                    feedback: "You correctly identify that while AnimBPs can modify bone transforms, making a global change for a specific cinematic shot is inefficient and prone to breaking other animations. Sequencer's Control Rig integration is designed for precise, shot-specific adjustments.",
                    next: 'step-3'
                },
            ]
        },

        'step-4a': {
            skill: 'optimization',
            title: 'Step 4a: Performance and Regression Check',
            prompt: "The clipping is fixed, but you need to ensure your solution hasn't introduced any performance hitches or unintended side effects in other parts of the cinematic. What's your next verification step?",
            choices: [
                {
                    text: "Monitor Performance with Stat Commands]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat anim` in PIE while playing the sequence. You observe that the added Control Rig layer has a negligible impact on performance, confirming it's an efficient solution. You also scrub through other shots in the sequence to ensure no other animations were inadvertently affected.",
                    next: 'step-4b'
                },
                {
                    text: "Re-export the entire animation]",
                    type: 'wrong',
                    feedback: "Re-exporting the entire animation would be a destructive and time-consuming process, negating the benefit of the non-destructive Control Rig fix. This is not a verification step.",
                    next: 'step-4aW'
                },
            ]
        },

        'step-4aW': {
            skill: 'optimization',
            title: 'Dead End: Re-exporting Animation',
            prompt: "Re-exporting the animation is not a verification step and undoes the non-destructive nature of your fix. You need to verify the *current* solution's impact.",
            choices: [
                {
                    text: "Focus on performance and side effects]",
                    type: 'correct',
                    feedback: "You refocus on verifying the performance and ensuring no regressions were introduced by the Control Rig adjustment.",
                    next: 'step-4b'
                },
            ]
        },

        'step-4b': {
            skill: 'sequencer',
            title: 'Step 4b: Final Visual Scrutiny',
            prompt: "You've confirmed the fix and checked performance. For final sign-off, you want to be absolutely certain the hand-prop interaction looks perfect from all angles and speeds. What's your final visual check?",
            choices: [
                {
                    text: "Render Preview and Review from Multiple Angles]",
                    type: 'correct',
                    feedback: "You render out a high-quality preview of the shot, then review it frame-by-frame and from various camera angles (including extreme close-ups and wide shots). You also play the sequence in slow-motion within Sequencer to catch any subtle remaining jitters or misalignments. The hand contact remains clean and natural throughout.",
                    next: 'conclusion'
                },
                {
                    text: "Delete the Control Rig track]",
                    type: 'wrong',
                    feedback: "Deleting the Control Rig track would undo your fix! This is the opposite of verification.",
                    next: 'step-4bW'
                },
            ]
        },

        'step-4bW': {
            skill: 'sequencer',
            title: 'Dead End: Deleting the Fix',
            prompt: "Deleting the Control Rig track would remove your solution. You need to verify the *effectiveness* of the fix, not remove it.",
            choices: [
                {
                    text: "Re-focus on thorough visual inspection]",
                    type: 'correct',
                    feedback: "You refocus on a thorough visual inspection from all angles and speeds to ensure the fix is robust.",
                    next: 'step-4b'
                },
            ]
        },
                },
                {
                    text: "Delete the Control Rig track]",
                    type: 'wrong',
                    feedback: "Deleting the Control Rig track would undo your fix! This is the opposite of verification.",
                    next: 'step-4bW'
                },
            ]
        },

        'step-4bW': {
            skill: 'sequencer',
            title: 'Dead End: Deleting the Fix',
            prompt: "Deleting the Control Rig track would remove your solution. You need to verify the *effectiveness* of the fix, not remove it.",
            choices: [
                {
                    text: "Re-focus on thorough visual inspection]",
                    type: 'correct',
                    feedback: "You refocus on a thorough visual inspection from all angles and speeds to ensure the fix is robust.",
                    next: 'step-2A'
                }
            ]
        },
        'step-2A': {
            skill: 'sequencer',
            title: 'Step 2A: Deeper Animation Inspection',
            prompt: "The base animation seems off. To confirm if it's compression or raw data inaccuracy, what specific debug views do you enable in Sequencer?",
            choices: [
                {
                    text: "Enable 'Show > Animation > Bones' and 'Show > Animation > Raw Animation']",
                    type: 'correct',
                    feedback: "You observe that the 'Raw Animation' shows the hand closer to the prop, but the 'Bones' (which reflect compressed data) are slightly offset, confirming compression as a contributing factor. You also notice the raw data itself isn't perfectly aligned, indicating a need for fine-tuning.",
                    next: 'step-2A'
                },
                {
                    text: "Try 'Show > Collision' or 'Show > Physics Assets']",
                    type: 'wrong',
                    feedback: "While useful, these views are for collision and physics, not directly for animation bone data. You need to inspect the animation itself to understand the bone transforms.",
                    next: 'step-2A'
                },
            ]
        },

        'step-2B': {
            skill: 'level_editor',
            title: 'Step 2B: Collision & Physics Check',
            prompt: "Before applying an animation fix, it's crucial to ensure the prop's collision is correctly set up. How do you quickly verify this in the viewport?",
            choices: [
                {
                    text: "Enable 'Show > Collision' or use console command 'pxvis collision']",
                    type: 'correct',
                    feedback: "You confirm the prop has a simple, correctly shaped collision mesh that the hand *should* interact with. This rules out a fundamental collision setup issue, reinforcing that the problem is animation-related and requires a posing adjustment.",
                    next: 'step-2A'
                },
                {
                    text: "Adjust the prop's physics asset settings]",
                    type: 'wrong',
                    feedback: "Adjusting physics assets is for dynamic simulations, not static collision checks for animation. You need to visualize the collision geometry itself to confirm its shape and placement.",
                    next: 'step-2A'
                },
            ]
        },

        'step-2R': {
            skill: 'animation',
            title: 'Dead End: Re-importing Animation',
            prompt: "You suspect animation compression is the culprit. What's a common, but often overkill or destructive, approach to try and fix this specific issue?",
            choices: [
                {
                    text: "Re-import the animation asset with different compression settings]",
                    type: 'correct',
                    feedback: "You try re-importing the animation with 'None' or 'Per-Bone' compression. While it might slightly improve accuracy, it's a time-consuming process, increases file size, and doesn't guarantee a perfect per-shot fix. You realize a non-destructive, additive approach is better for specific cinematic adjustments.",
                    next: 'step-2A'
                },
            ]
        },

        'step-4A': {
            skill: 'packaging',
            title: 'Step 4A: Standalone Game Test',
            prompt: "The fix looks good in PIE. What's the next critical step to ensure it holds up in a real game environment, accounting for potential editor-only discrepancies?",
            choices: [
                {
                    text: "Launch the game in Standalone Game mode or a packaged build]",
                    type: 'correct',
                    feedback: "You run the cinematic in a standalone game instance. The hand interaction remains perfectly aligned, confirming the Control Rig adjustment is correctly applied and baked, and not just an editor-only artifact. This verifies the fix in a more realistic runtime scenario.",
                    next: 'step-4A'
                },
                {
                    text: "Share the sequence with a colleague for review]",
                    type: 'wrong',
                    feedback: "While peer review is good, it doesn't replace technical verification in a game-like environment. You need to confirm the fix works outside of the editor's specific context.",
                    next: 'step-4A'
                },
            ]
        },

        'step-4B': {
            skill: 'optimization',
            title: 'Step 4B: Performance Impact Check',
            prompt: "Additive Control Rig layers add computation. How do you quickly check if your fix has introduced any noticeable performance overhead, especially on animation or game thread time?",
            choices: [
                {
                    text: "Use console commands like 'stat unit' or 'stat anim']",
                    type: 'correct',
                    feedback: "You enable 'stat unit' and 'stat anim' during playback. You observe minimal to no increase in animation or game thread time, confirming the additive layer is lightweight and efficient for this specific adjustment without impacting performance.",
                    next: 'step-4A'
                },
                {
                    text: "Profile the entire game for several minutes using Unreal Insights]",
                    type: 'wrong',
                    feedback: "Unreal Insights is powerful but overkill for a quick check on a specific animation adjustment. 'stat unit' or 'stat anim' provide immediate, relevant feedback for this scenario without deep profiling.",
                    next: 'step-4A'
                },
            ]
        },

        
        'step-2a': {
            skill: 'sequencer',
            title: 'Step 2a: Precise Bone Transform Analysis',
            prompt: "You've confirmed the hand bone is slightly off. To understand the exact misalignment, you need to inspect the bone's transform values directly. How do you do this in Sequencer?",
            choices: [
                {
                    text: "Inspect Hand Bone Transform in Sequencer]",
                    type: 'correct',
                    feedback: "You select the character's skeletal mesh track in Sequencer, expand it to find the specific hand bone (e.g., 'hand_r'), and inspect its transform curves. You notice small, consistent offsets in position (X, Y, Z) during the grab frames, confirming it's a precise positional error rather than a rotation or scale issue.",
                    next: 'step-2b'
                },
                {
                    text: "Try to adjust the bone in Persona]",
                    type: 'wrong',
                    feedback: "Adjusting the bone directly in Persona would modify the base animation asset, which is destructive and would affect all instances of that animation. You need a non-destructive, shot-specific fix.",
                    next: 'step-2aW'
                },
            ]
        },

        'step-2aW': {
            skill: 'sequencer',
            title: 'Dead End: Persona Adjustment',
            prompt: "Modifying the base animation asset in Persona is too broad and destructive for a shot-specific issue. You need to inspect the current state in Sequencer.",
            choices: [
                {
                    text: "Revert and inspect in Sequencer]",
                    type: 'correct',
                    feedback: "You revert any changes in Persona and return to Sequencer to inspect the hand bone's transform curves directly.",
                    next: 'step-2b'
                },
            ]
        },

        'step-2b': {
            skill: 'animation',
            title: 'Step 2b: Animation Compression Investigation',
            prompt: "The scenario description mentioned animation compression as a potential cause. How would you investigate if compression is contributing to the subtle misalignment?",
            choices: [
                {
                    text: "Check Animation Asset Compression Settings]",
                    type: 'correct',
                    feedback: "You open the base animation asset in Persona and navigate to its compression settings. You temporarily set the 'Compression Algorithm' to 'AC_None' or reduce the 'Max Error' for the relevant bones. After re-saving and re-evaluating in Sequencer, you observe a slight improvement, confirming compression was indeed a factor, but not the sole cause, and disabling it entirely is too costly for runtime.",
                    next: 'step-2c_redherring'
                },
                {
                    text: "Adjust Physics Asset Collision]",
                    type: 'wrong',
                    feedback: "While physics assets define collision, they primarily affect dynamic interactions and ragdolls, not the precise posing of a static grab animation. This won't help with the subtle positional error.",
                    next: 'step-2bW'
                },
            ]
        },

        'step-2bW': {
            skill: 'animation',
            title: 'Dead End: Physics Asset',
            prompt: "Adjusting the Physics Asset won't solve a precise animation posing issue. You need to focus on the animation data itself.",
            choices: [
                {
                    text: "Re-focus on animation settings]",
                    type: 'correct',
                    feedback: "You realize the problem is with the animation data's precision, not its collision representation, and return to investigating animation compression settings.",
                    next: 'step-2c_redherring'
                },
            ]
        },

        'step-2c_redherring': {
            skill: 'animation_blueprint',
            title: 'Red Herring: AnimBP Override Attempt',
            prompt: "You consider if an Animation Blueprint might be overriding the hand's position. How would you check this, and is it the right approach for a cinematic shot?",
            choices: [
                {
                    text: "Check AnimBP for 'Transform (Modify) Bone' nodes]",
                    type: 'misguided',
                    feedback: "You open the character's Animation Blueprint and look for 'Transform (Modify) Bone' nodes or other IK setups affecting the hand. While you might find some, you realize that adding a new node here would be a global change affecting all instances of this AnimBP, which is not ideal for a specific cinematic shot. Sequencer offers a more targeted solution.",
                    next: 'step-3'
                },
                {
                    text: "Realize AnimBP is not the best approach for Sequencer]",
                    type: 'correct',
                    feedback: "You correctly identify that while AnimBPs can modify bone transforms, making a global change for a specific cinematic shot is inefficient and prone to breaking other animations. Sequencer's Control Rig integration is designed for precise, shot-specific adjustments.",
                    next: 'step-3'
                },
            ]
        },

        'step-4a': {
            skill: 'optimization',
            title: 'Step 4a: Performance and Regression Check',
            prompt: "The clipping is fixed, but you need to ensure your solution hasn't introduced any performance hitches or unintended side effects in other parts of the cinematic. What's your next verification step?",
            choices: [
                {
                    text: "Monitor Performance with Stat Commands]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat anim` in PIE while playing the sequence. You observe that the added Control Rig layer has a negligible impact on performance, confirming it's an efficient solution. You also scrub through other shots in the sequence to ensure no other animations were inadvertently affected.",
                    next: 'step-4b'
                },
                {
                    text: "Re-export the entire animation]",
                    type: 'wrong',
                    feedback: "Re-exporting the entire animation would be a destructive and time-consuming process, negating the benefit of the non-destructive Control Rig fix. This is not a verification step.",
                    next: 'step-4aW'
                },
            ]
        },

        'step-4aW': {
            skill: 'optimization',
            title: 'Dead End: Re-exporting Animation',
            prompt: "Re-exporting the animation is not a verification step and undoes the non-destructive nature of your fix. You need to verify the *current* solution's impact.",
            choices: [
                {
                    text: "Focus on performance and side effects]",
                    type: 'correct',
                    feedback: "You refocus on verifying the performance and ensuring no regressions were introduced by the Control Rig adjustment.",
                    next: 'step-4b'
                },
            ]
        },

        'step-4b': {
            skill: 'sequencer',
            title: 'Step 4b: Final Visual Scrutiny',
            prompt: "You've confirmed the fix and checked performance. For final sign-off, you want to be absolutely certain the hand-prop interaction looks perfect from all angles and speeds. What's your final visual check?",
            choices: [
                {
                    text: "Render Preview and Review from Multiple Angles]",
                    type: 'correct',
                    feedback: "You render out a high-quality preview of the shot, then review it frame-by-frame and from various camera angles (including extreme close-ups and wide shots). You also play the sequence in slow-motion within Sequencer to catch any subtle remaining jitters or misalignments. The hand contact remains clean and natural throughout.",
                    next: 'conclusion'
                },
                {
                    text: "Delete the Control Rig track]",
                    type: 'wrong',
                    feedback: "Deleting the Control Rig track would undo your fix! This is the opposite of verification.",
                    next: 'step-4bW'
                },
            ]
        },

        'step-4bW': {
            skill: 'sequencer',
            title: 'Dead End: Deleting the Fix',
            prompt: "Deleting the Control Rig track would remove your solution. You need to verify the *effectiveness* of the fix, not remove it.",
            choices: [
                {
                    text: "Re-focus on thorough visual inspection]",
                    type: 'correct',
                    feedback: "You refocus on a thorough visual inspection from all angles and speeds to ensure the fix is robust.",
                    next: 'step-4b'
                },
            ]
        },
                },
            ]
        },

        
        'step-2A': {
            skill: 'sequencer',
            title: 'Step 2A: Deeper Animation Inspection',
            prompt: "The base animation seems off. To confirm if it's compression or raw data inaccuracy, what specific debug views do you enable in Sequencer?",
            choices: [
                {
                    text: "Enable 'Show > Animation > Bones' and 'Show > Animation > Raw Animation']",
                    type: 'correct',
                    feedback: "You observe that the 'Raw Animation' shows the hand closer to the prop, but the 'Bones' (which reflect compressed data) are slightly offset, confirming compression as a contributing factor. You also notice the raw data itself isn't perfectly aligned, indicating a need for fine-tuning.",
                    next: 'step-2A'
                },
                {
                    text: "Try 'Show > Collision' or 'Show > Physics Assets']",
                    type: 'wrong',
                    feedback: "While useful, these views are for collision and physics, not directly for animation bone data. You need to inspect the animation itself to understand the bone transforms.",
                    next: 'step-2A'
                },
            ]
        },

        'step-2B': {
            skill: 'level_editor',
            title: 'Step 2B: Collision & Physics Check',
            prompt: "Before applying an animation fix, it's crucial to ensure the prop's collision is correctly set up. How do you quickly verify this in the viewport?",
            choices: [
                {
                    text: "Enable 'Show > Collision' or use console command 'pxvis collision']",
                    type: 'correct',
                    feedback: "You confirm the prop has a simple, correctly shaped collision mesh that the hand *should* interact with. This rules out a fundamental collision setup issue, reinforcing that the problem is animation-related and requires a posing adjustment.",
                    next: 'step-2A'
                },
                {
                    text: "Adjust the prop's physics asset settings]",
                    type: 'wrong',
                    feedback: "Adjusting physics assets is for dynamic simulations, not static collision checks for animation. You need to visualize the collision geometry itself to confirm its shape and placement.",
                    next: 'step-2A'
                },
            ]
        },

        'step-2R': {
            skill: 'animation',
            title: 'Dead End: Re-importing Animation',
            prompt: "You suspect animation compression is the culprit. What's a common, but often overkill or destructive, approach to try and fix this specific issue?",
            choices: [
                {
                    text: "Re-import the animation asset with different compression settings]",
                    type: 'correct',
                    feedback: "You try re-importing the animation with 'None' or 'Per-Bone' compression. While it might slightly improve accuracy, it's a time-consuming process, increases file size, and doesn't guarantee a perfect per-shot fix. You realize a non-destructive, additive approach is better for specific cinematic adjustments.",
                    next: 'step-2A'
                },
            ]
        },

        'step-4A': {
            skill: 'packaging',
            title: 'Step 4A: Standalone Game Test',
            prompt: "The fix looks good in PIE. What's the next critical step to ensure it holds up in a real game environment, accounting for potential editor-only discrepancies?",
            choices: [
                {
                    text: "Launch the game in Standalone Game mode or a packaged build]",
                    type: 'correct',
                    feedback: "You run the cinematic in a standalone game instance. The hand interaction remains perfectly aligned, confirming the Control Rig adjustment is correctly applied and baked, and not just an editor-only artifact. This verifies the fix in a more realistic runtime scenario.",
                    next: 'step-4A'
                },
                {
                    text: "Share the sequence with a colleague for review]",
                    type: 'wrong',
                    feedback: "While peer review is good, it doesn't replace technical verification in a game-like environment. You need to confirm the fix works outside of the editor's specific context.",
                    next: 'step-4A'
                },
            ]
        },

        'step-4B': {
            skill: 'optimization',
            title: 'Step 4B: Performance Impact Check',
            prompt: "Additive Control Rig layers add computation. How do you quickly check if your fix has introduced any noticeable performance overhead, especially on animation or game thread time?",
            choices: [
                {
                    text: "Use console commands like 'stat unit' or 'stat anim']",
                    type: 'correct',
                    feedback: "You enable 'stat unit' and 'stat anim' during playback. You observe minimal to no increase in animation or game thread time, confirming the additive layer is lightweight and efficient for this specific adjustment without impacting performance.",
                    next: 'step-4A'
                },
                {
                    text: "Profile the entire game for several minutes using Unreal Insights]",
                    type: 'wrong',
                    feedback: "Unreal Insights is powerful but overkill for a quick check on a specific animation adjustment. 'stat unit' or 'stat anim' provide immediate, relevant feedback for this scenario without deep profiling.",
                    next: 'step-4A'
                },
            ]
        },

        
        'step-2a': {
            skill: 'sequencer',
            title: 'Step 2a: Precise Bone Transform Analysis',
            prompt: "You've confirmed the hand bone is slightly off. To understand the exact misalignment, you need to inspect the bone's transform values directly. How do you do this in Sequencer?",
            choices: [
                {
                    text: "Inspect Hand Bone Transform in Sequencer]",
                    type: 'correct',
                    feedback: "You select the character's skeletal mesh track in Sequencer, expand it to find the specific hand bone (e.g., 'hand_r'), and inspect its transform curves. You notice small, consistent offsets in position (X, Y, Z) during the grab frames, confirming it's a precise positional error rather than a rotation or scale issue.",
                    next: 'step-2b'
                },
                {
                    text: "Try to adjust the bone in Persona]",
                    type: 'wrong',
                    feedback: "Adjusting the bone directly in Persona would modify the base animation asset, which is destructive and would affect all instances of that animation. You need a non-destructive, shot-specific fix.",
                    next: 'step-2aW'
                },
            ]
        },

        'step-2aW': {
            skill: 'sequencer',
            title: 'Dead End: Persona Adjustment',
            prompt: "Modifying the base animation asset in Persona is too broad and destructive for a shot-specific issue. You need to inspect the current state in Sequencer.",
            choices: [
                {
                    text: "Revert and inspect in Sequencer]",
                    type: 'correct',
                    feedback: "You revert any changes in Persona and return to Sequencer to inspect the hand bone's transform curves directly.",
                    next: 'step-2b'
                },
            ]
        },

        'step-2b': {
            skill: 'animation',
            title: 'Step 2b: Animation Compression Investigation',
            prompt: "The scenario description mentioned animation compression as a potential cause. How would you investigate if compression is contributing to the subtle misalignment?",
            choices: [
                {
                    text: "Check Animation Asset Compression Settings]",
                    type: 'correct',
                    feedback: "You open the base animation asset in Persona and navigate to its compression settings. You temporarily set the 'Compression Algorithm' to 'AC_None' or reduce the 'Max Error' for the relevant bones. After re-saving and re-evaluating in Sequencer, you observe a slight improvement, confirming compression was indeed a factor, but not the sole cause, and disabling it entirely is too costly for runtime.",
                    next: 'step-2c_redherring'
                },
                {
                    text: "Adjust Physics Asset Collision]",
                    type: 'wrong',
                    feedback: "While physics assets define collision, they primarily affect dynamic interactions and ragdolls, not the precise posing of a static grab animation. This won't help with the subtle positional error.",
                    next: 'step-2bW'
                },
            ]
        },

        'step-2bW': {
            skill: 'animation',
            title: 'Dead End: Physics Asset',
            prompt: "Adjusting the Physics Asset won't solve a precise animation posing issue. You need to focus on the animation data itself.",
            choices: [
                {
                    text: "Re-focus on animation settings]",
                    type: 'correct',
                    feedback: "You realize the problem is with the animation data's precision, not its collision representation, and return to investigating animation compression settings.",
                    next: 'step-2c_redherring'
                },
            ]
        },

        'step-2c_redherring': {
            skill: 'animation_blueprint',
            title: 'Red Herring: AnimBP Override Attempt',
            prompt: "You consider if an Animation Blueprint might be overriding the hand's position. How would you check this, and is it the right approach for a cinematic shot?",
            choices: [
                {
                    text: "Check AnimBP for 'Transform (Modify) Bone' nodes]",
                    type: 'misguided',
                    feedback: "You open the character's Animation Blueprint and look for 'Transform (Modify) Bone' nodes or other IK setups affecting the hand. While you might find some, you realize that adding a new node here would be a global change affecting all instances of this AnimBP, which is not ideal for a specific cinematic shot. Sequencer offers a more targeted solution.",
                    next: 'step-3'
                },
                {
                    text: "Realize AnimBP is not the best approach for Sequencer]",
                    type: 'correct',
                    feedback: "You correctly identify that while AnimBPs can modify bone transforms, making a global change for a specific cinematic shot is inefficient and prone to breaking other animations. Sequencer's Control Rig integration is designed for precise, shot-specific adjustments.",
                    next: 'step-3'
                },
            ]
        },

        'step-4a': {
            skill: 'optimization',
            title: 'Step 4a: Performance and Regression Check',
            prompt: "The clipping is fixed, but you need to ensure your solution hasn't introduced any performance hitches or unintended side effects in other parts of the cinematic. What's your next verification step?",
            choices: [
                {
                    text: "Monitor Performance with Stat Commands]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat anim` in PIE while playing the sequence. You observe that the added Control Rig layer has a negligible impact on performance, confirming it's an efficient solution. You also scrub through other shots in the sequence to ensure no other animations were inadvertently affected.",
                    next: 'step-4b'
                },
                {
                    text: "Re-export the entire animation]",
                    type: 'wrong',
                    feedback: "Re-exporting the entire animation would be a destructive and time-consuming process, negating the benefit of the non-destructive Control Rig fix. This is not a verification step.",
                    next: 'step-4aW'
                },
            ]
        },

        'step-4aW': {
            skill: 'optimization',
            title: 'Dead End: Re-exporting Animation',
            prompt: "Re-exporting the animation is not a verification step and undoes the non-destructive nature of your fix. You need to verify the *current* solution's impact.",
            choices: [
                {
                    text: "Focus on performance and side effects]",
                    type: 'correct',
                    feedback: "You refocus on verifying the performance and ensuring no regressions were introduced by the Control Rig adjustment.",
                    next: 'step-4b'
                },
            ]
        },

        'step-4b': {
            skill: 'sequencer',
            title: 'Step 4b: Final Visual Scrutiny',
            prompt: "You've confirmed the fix and checked performance. For final sign-off, you want to be absolutely certain the hand-prop interaction looks perfect from all angles and speeds. What's your final visual check?",
            choices: [
                {
                    text: "Render Preview and Review from Multiple Angles]",
                    type: 'correct',
                    feedback: "You render out a high-quality preview of the shot, then review it frame-by-frame and from various camera angles (including extreme close-ups and wide shots). You also play the sequence in slow-motion within Sequencer to catch any subtle remaining jitters or misalignments. The hand contact remains clean and natural throughout.",
                    next: 'conclusion'
                },
                {
                    text: "Delete the Control Rig track]",
                    type: 'wrong',
                    feedback: "Deleting the Control Rig track would undo your fix! This is the opposite of verification.",
                    next: 'step-4bW'
                },
            ]
        },

        'step-4bW': {
            skill: 'sequencer',
            title: 'Dead End: Deleting the Fix',
            prompt: "Deleting the Control Rig track would remove your solution. You need to verify the *effectiveness* of the fix, not remove it.",
            choices: [
                {
                    text: "Re-focus on thorough visual inspection]",
                    type: 'correct',
                    feedback: "You refocus on a thorough visual inspection from all angles and speeds to ensure the fix is robust.",
                    next: 'step-4b'
                },
            ]
        },
                }
            ]
        },
        
        'step-2a': {
            skill: 'sequencer',
            title: 'Step 2a: Precise Bone Transform Analysis',
            prompt: "You've confirmed the hand bone is slightly off. To understand the exact misalignment, you need to inspect the bone's transform values directly. How do you do this in Sequencer?",
            choices: [
                {
                    text: "Inspect Hand Bone Transform in Sequencer]",
                    type: 'correct',
                    feedback: "You select the character's skeletal mesh track in Sequencer, expand it to find the specific hand bone (e.g., 'hand_r'), and inspect its transform curves. You notice small, consistent offsets in position (X, Y, Z) during the grab frames, confirming it's a precise positional error rather than a rotation or scale issue.",
                    next: 'step-2b'
                },
                {
                    text: "Try to adjust the bone in Persona]",
                    type: 'wrong',
                    feedback: "Adjusting the bone directly in Persona would modify the base animation asset, which is destructive and would affect all instances of that animation. You need a non-destructive, shot-specific fix.",
                    next: 'step-2aW'
                },
            ]
        },

        'step-2aW': {
            skill: 'sequencer',
            title: 'Dead End: Persona Adjustment',
            prompt: "Modifying the base animation asset in Persona is too broad and destructive for a shot-specific issue. You need to inspect the current state in Sequencer.",
            choices: [
                {
                    text: "Revert and inspect in Sequencer]",
                    type: 'correct',
                    feedback: "You revert any changes in Persona and return to Sequencer to inspect the hand bone's transform curves directly.",
                    next: 'step-2b'
                },
            ]
        },

        'step-2b': {
            skill: 'animation',
            title: 'Step 2b: Animation Compression Investigation',
            prompt: "The scenario description mentioned animation compression as a potential cause. How would you investigate if compression is contributing to the subtle misalignment?",
            choices: [
                {
                    text: "Check Animation Asset Compression Settings]",
                    type: 'correct',
                    feedback: "You open the base animation asset in Persona and navigate to its compression settings. You temporarily set the 'Compression Algorithm' to 'AC_None' or reduce the 'Max Error' for the relevant bones. After re-saving and re-evaluating in Sequencer, you observe a slight improvement, confirming compression was indeed a factor, but not the sole cause, and disabling it entirely is too costly for runtime.",
                    next: 'step-2c_redherring'
                },
                {
                    text: "Adjust Physics Asset Collision]",
                    type: 'wrong',
                    feedback: "While physics assets define collision, they primarily affect dynamic interactions and ragdolls, not the precise posing of a static grab animation. This won't help with the subtle positional error.",
                    next: 'step-2bW'
                },
            ]
        },

        'step-2bW': {
            skill: 'animation',
            title: 'Dead End: Physics Asset',
            prompt: "Adjusting the Physics Asset won't solve a precise animation posing issue. You need to focus on the animation data itself.",
            choices: [
                {
                    text: "Re-focus on animation settings]",
                    type: 'correct',
                    feedback: "You realize the problem is with the animation data's precision, not its collision representation, and return to investigating animation compression settings.",
                    next: 'step-2c_redherring'
                },
            ]
        },

        'step-2c_redherring': {
            skill: 'animation_blueprint',
            title: 'Red Herring: AnimBP Override Attempt',
            prompt: "You consider if an Animation Blueprint might be overriding the hand's position. How would you check this, and is it the right approach for a cinematic shot?",
            choices: [
                {
                    text: "Check AnimBP for 'Transform (Modify) Bone' nodes]",
                    type: 'misguided',
                    feedback: "You open the character's Animation Blueprint and look for 'Transform (Modify) Bone' nodes or other IK setups affecting the hand. While you might find some, you realize that adding a new node here would be a global change affecting all instances of this AnimBP, which is not ideal for a specific cinematic shot. Sequencer offers a more targeted solution.",
                    next: 'step-2A'
                },
                {
                    text: "Realize AnimBP is not the best approach for Sequencer]",
                    type: 'correct',
                    feedback: "You correctly identify that while AnimBPs can modify bone transforms, making a global change for a specific cinematic shot is inefficient and prone to breaking other animations. Sequencer's Control Rig integration is designed for precise, shot-specific adjustments.",
                    next: 'step-2A'
                },
            ]
        },

        'step-4a': {
            skill: 'optimization',
            title: 'Step 4a: Performance and Regression Check',
            prompt: "The clipping is fixed, but you need to ensure your solution hasn't introduced any performance hitches or unintended side effects in other parts of the cinematic. What's your next verification step?",
            choices: [
                {
                    text: "Monitor Performance with Stat Commands]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat anim` in PIE while playing the sequence. You observe that the added Control Rig layer has a negligible impact on performance, confirming it's an efficient solution. You also scrub through other shots in the sequence to ensure no other animations were inadvertently affected.",
                    next: 'step-4b'
                },
                {
                    text: "Re-export the entire animation]",
                    type: 'wrong',
                    feedback: "Re-exporting the entire animation would be a destructive and time-consuming process, negating the benefit of the non-destructive Control Rig fix. This is not a verification step.",
                    next: 'step-4aW'
                },
            ]
        },

        'step-4aW': {
            skill: 'optimization',
            title: 'Dead End: Re-exporting Animation',
            prompt: "Re-exporting the animation is not a verification step and undoes the non-destructive nature of your fix. You need to verify the *current* solution's impact.",
            choices: [
                {
                    text: "Focus on performance and side effects]",
                    type: 'correct',
                    feedback: "You refocus on verifying the performance and ensuring no regressions were introduced by the Control Rig adjustment.",
                    next: 'step-4b'
                },
            ]
        },

        'step-4b': {
            skill: 'sequencer',
            title: 'Step 4b: Final Visual Scrutiny',
            prompt: "You've confirmed the fix and checked performance. For final sign-off, you want to be absolutely certain the hand-prop interaction looks perfect from all angles and speeds. What's your final visual check?",
            choices: [
                {
                    text: "Render Preview and Review from Multiple Angles]",
                    type: 'correct',
                    feedback: "You render out a high-quality preview of the shot, then review it frame-by-frame and from various camera angles (including extreme close-ups and wide shots). You also play the sequence in slow-motion within Sequencer to catch any subtle remaining jitters or misalignments. The hand contact remains clean and natural throughout.",
                    next: 'step-2A'
                }
            ]
        },
        'step-2A': {
            skill: 'sequencer',
            title: 'Step 2A: Deeper Animation Inspection',
            prompt: "The base animation seems off. To confirm if it's compression or raw data inaccuracy, what specific debug views do you enable in Sequencer?",
            choices: [
                {
                    text: "Enable 'Show > Animation > Bones' and 'Show > Animation > Raw Animation']",
                    type: 'correct',
                    feedback: "You observe that the 'Raw Animation' shows the hand closer to the prop, but the 'Bones' (which reflect compressed data) are slightly offset, confirming compression as a contributing factor. You also notice the raw data itself isn't perfectly aligned, indicating a need for fine-tuning.",
                    next: 'step-2A'
                },
                {
                    text: "Try 'Show > Collision' or 'Show > Physics Assets']",
                    type: 'wrong',
                    feedback: "While useful, these views are for collision and physics, not directly for animation bone data. You need to inspect the animation itself to understand the bone transforms.",
                    next: 'step-2A'
                },
            ]
        },

        'step-2B': {
            skill: 'level_editor',
            title: 'Step 2B: Collision & Physics Check',
            prompt: "Before applying an animation fix, it's crucial to ensure the prop's collision is correctly set up. How do you quickly verify this in the viewport?",
            choices: [
                {
                    text: "Enable 'Show > Collision' or use console command 'pxvis collision']",
                    type: 'correct',
                    feedback: "You confirm the prop has a simple, correctly shaped collision mesh that the hand *should* interact with. This rules out a fundamental collision setup issue, reinforcing that the problem is animation-related and requires a posing adjustment.",
                    next: 'step-2A'
                },
                {
                    text: "Adjust the prop's physics asset settings]",
                    type: 'wrong',
                    feedback: "Adjusting physics assets is for dynamic simulations, not static collision checks for animation. You need to visualize the collision geometry itself to confirm its shape and placement.",
                    next: 'step-2A'
                },
            ]
        },

        'step-2R': {
            skill: 'animation',
            title: 'Dead End: Re-importing Animation',
            prompt: "You suspect animation compression is the culprit. What's a common, but often overkill or destructive, approach to try and fix this specific issue?",
            choices: [
                {
                    text: "Re-import the animation asset with different compression settings]",
                    type: 'correct',
                    feedback: "You try re-importing the animation with 'None' or 'Per-Bone' compression. While it might slightly improve accuracy, it's a time-consuming process, increases file size, and doesn't guarantee a perfect per-shot fix. You realize a non-destructive, additive approach is better for specific cinematic adjustments.",
                    next: 'step-2A'
                },
            ]
        },

        'step-4A': {
            skill: 'packaging',
            title: 'Step 4A: Standalone Game Test',
            prompt: "The fix looks good in PIE. What's the next critical step to ensure it holds up in a real game environment, accounting for potential editor-only discrepancies?",
            choices: [
                {
                    text: "Launch the game in Standalone Game mode or a packaged build]",
                    type: 'correct',
                    feedback: "You run the cinematic in a standalone game instance. The hand interaction remains perfectly aligned, confirming the Control Rig adjustment is correctly applied and baked, and not just an editor-only artifact. This verifies the fix in a more realistic runtime scenario.",
                    next: 'step-4A'
                },
                {
                    text: "Share the sequence with a colleague for review]",
                    type: 'wrong',
                    feedback: "While peer review is good, it doesn't replace technical verification in a game-like environment. You need to confirm the fix works outside of the editor's specific context.",
                    next: 'step-4A'
                },
            ]
        },

        'step-4B': {
            skill: 'optimization',
            title: 'Step 4B: Performance Impact Check',
            prompt: "Additive Control Rig layers add computation. How do you quickly check if your fix has introduced any noticeable performance overhead, especially on animation or game thread time?",
            choices: [
                {
                    text: "Use console commands like 'stat unit' or 'stat anim']",
                    type: 'correct',
                    feedback: "You enable 'stat unit' and 'stat anim' during playback. You observe minimal to no increase in animation or game thread time, confirming the additive layer is lightweight and efficient for this specific adjustment without impacting performance.",
                    next: 'step-4A'
                },
                {
                    text: "Profile the entire game for several minutes using Unreal Insights]",
                    type: 'wrong',
                    feedback: "Unreal Insights is powerful but overkill for a quick check on a specific animation adjustment. 'stat unit' or 'stat anim' provide immediate, relevant feedback for this scenario without deep profiling.",
                    next: 'step-4A'
                },
            ]
        },

        
        'step-2a': {
            skill: 'sequencer',
            title: 'Step 2a: Precise Bone Transform Analysis',
            prompt: "You've confirmed the hand bone is slightly off. To understand the exact misalignment, you need to inspect the bone's transform values directly. How do you do this in Sequencer?",
            choices: [
                {
                    text: "Inspect Hand Bone Transform in Sequencer]",
                    type: 'correct',
                    feedback: "You select the character's skeletal mesh track in Sequencer, expand it to find the specific hand bone (e.g., 'hand_r'), and inspect its transform curves. You notice small, consistent offsets in position (X, Y, Z) during the grab frames, confirming it's a precise positional error rather than a rotation or scale issue.",
                    next: 'step-2b'
                },
                {
                    text: "Try to adjust the bone in Persona]",
                    type: 'wrong',
                    feedback: "Adjusting the bone directly in Persona would modify the base animation asset, which is destructive and would affect all instances of that animation. You need a non-destructive, shot-specific fix.",
                    next: 'step-2aW'
                },
            ]
        },

        'step-2aW': {
            skill: 'sequencer',
            title: 'Dead End: Persona Adjustment',
            prompt: "Modifying the base animation asset in Persona is too broad and destructive for a shot-specific issue. You need to inspect the current state in Sequencer.",
            choices: [
                {
                    text: "Revert and inspect in Sequencer]",
                    type: 'correct',
                    feedback: "You revert any changes in Persona and return to Sequencer to inspect the hand bone's transform curves directly.",
                    next: 'step-2b'
                },
            ]
        },

        'step-2b': {
            skill: 'animation',
            title: 'Step 2b: Animation Compression Investigation',
            prompt: "The scenario description mentioned animation compression as a potential cause. How would you investigate if compression is contributing to the subtle misalignment?",
            choices: [
                {
                    text: "Check Animation Asset Compression Settings]",
                    type: 'correct',
                    feedback: "You open the base animation asset in Persona and navigate to its compression settings. You temporarily set the 'Compression Algorithm' to 'AC_None' or reduce the 'Max Error' for the relevant bones. After re-saving and re-evaluating in Sequencer, you observe a slight improvement, confirming compression was indeed a factor, but not the sole cause, and disabling it entirely is too costly for runtime.",
                    next: 'step-2c_redherring'
                },
                {
                    text: "Adjust Physics Asset Collision]",
                    type: 'wrong',
                    feedback: "While physics assets define collision, they primarily affect dynamic interactions and ragdolls, not the precise posing of a static grab animation. This won't help with the subtle positional error.",
                    next: 'step-2bW'
                },
            ]
        },

        'step-2bW': {
            skill: 'animation',
            title: 'Dead End: Physics Asset',
            prompt: "Adjusting the Physics Asset won't solve a precise animation posing issue. You need to focus on the animation data itself.",
            choices: [
                {
                    text: "Re-focus on animation settings]",
                    type: 'correct',
                    feedback: "You realize the problem is with the animation data's precision, not its collision representation, and return to investigating animation compression settings.",
                    next: 'step-2c_redherring'
                },
            ]
        },

        'step-2c_redherring': {
            skill: 'animation_blueprint',
            title: 'Red Herring: AnimBP Override Attempt',
            prompt: "You consider if an Animation Blueprint might be overriding the hand's position. How would you check this, and is it the right approach for a cinematic shot?",
            choices: [
                {
                    text: "Check AnimBP for 'Transform (Modify) Bone' nodes]",
                    type: 'misguided',
                    feedback: "You open the character's Animation Blueprint and look for 'Transform (Modify) Bone' nodes or other IK setups affecting the hand. While you might find some, you realize that adding a new node here would be a global change affecting all instances of this AnimBP, which is not ideal for a specific cinematic shot. Sequencer offers a more targeted solution.",
                    next: 'step-3'
                },
                {
                    text: "Realize AnimBP is not the best approach for Sequencer]",
                    type: 'correct',
                    feedback: "You correctly identify that while AnimBPs can modify bone transforms, making a global change for a specific cinematic shot is inefficient and prone to breaking other animations. Sequencer's Control Rig integration is designed for precise, shot-specific adjustments.",
                    next: 'step-3'
                },
            ]
        },

        'step-4a': {
            skill: 'optimization',
            title: 'Step 4a: Performance and Regression Check',
            prompt: "The clipping is fixed, but you need to ensure your solution hasn't introduced any performance hitches or unintended side effects in other parts of the cinematic. What's your next verification step?",
            choices: [
                {
                    text: "Monitor Performance with Stat Commands]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat anim` in PIE while playing the sequence. You observe that the added Control Rig layer has a negligible impact on performance, confirming it's an efficient solution. You also scrub through other shots in the sequence to ensure no other animations were inadvertently affected.",
                    next: 'step-4b'
                },
                {
                    text: "Re-export the entire animation]",
                    type: 'wrong',
                    feedback: "Re-exporting the entire animation would be a destructive and time-consuming process, negating the benefit of the non-destructive Control Rig fix. This is not a verification step.",
                    next: 'step-4aW'
                },
            ]
        },

        'step-4aW': {
            skill: 'optimization',
            title: 'Dead End: Re-exporting Animation',
            prompt: "Re-exporting the animation is not a verification step and undoes the non-destructive nature of your fix. You need to verify the *current* solution's impact.",
            choices: [
                {
                    text: "Focus on performance and side effects]",
                    type: 'correct',
                    feedback: "You refocus on verifying the performance and ensuring no regressions were introduced by the Control Rig adjustment.",
                    next: 'step-4b'
                },
            ]
        },

        'step-4b': {
            skill: 'sequencer',
            title: 'Step 4b: Final Visual Scrutiny',
            prompt: "You've confirmed the fix and checked performance. For final sign-off, you want to be absolutely certain the hand-prop interaction looks perfect from all angles and speeds. What's your final visual check?",
            choices: [
                {
                    text: "Render Preview and Review from Multiple Angles]",
                    type: 'correct',
                    feedback: "You render out a high-quality preview of the shot, then review it frame-by-frame and from various camera angles (including extreme close-ups and wide shots). You also play the sequence in slow-motion within Sequencer to catch any subtle remaining jitters or misalignments. The hand contact remains clean and natural throughout.",
                    next: 'conclusion'
                },
                {
                    text: "Delete the Control Rig track]",
                    type: 'wrong',
                    feedback: "Deleting the Control Rig track would undo your fix! This is the opposite of verification.",
                    next: 'step-4bW'
                },
            ]
        },

        'step-4bW': {
            skill: 'sequencer',
            title: 'Dead End: Deleting the Fix',
            prompt: "Deleting the Control Rig track would remove your solution. You need to verify the *effectiveness* of the fix, not remove it.",
            choices: [
                {
                    text: "Re-focus on thorough visual inspection]",
                    type: 'correct',
                    feedback: "You refocus on a thorough visual inspection from all angles and speeds to ensure the fix is robust.",
                    next: 'step-4b'
                },
            ]
        },
                },
                {
                    text: "Delete the Control Rig track]",
                    type: 'wrong',
                    feedback: "Deleting the Control Rig track would undo your fix! This is the opposite of verification.",
                    next: 'step-4bW'
                },
            ]
        },

        'step-4bW': {
            skill: 'sequencer',
            title: 'Dead End: Deleting the Fix',
            prompt: "Deleting the Control Rig track would remove your solution. You need to verify the *effectiveness* of the fix, not remove it.",
            choices: [
                {
                    text: "Re-focus on thorough visual inspection]",
                    type: 'correct',
                    feedback: "You refocus on a thorough visual inspection from all angles and speeds to ensure the fix is robust.",
                    next: 'step-2A'
                }
            ]
        },
        'step-2A': {
            skill: 'sequencer',
            title: 'Step 2A: Deeper Animation Inspection',
            prompt: "The base animation seems off. To confirm if it's compression or raw data inaccuracy, what specific debug views do you enable in Sequencer?",
            choices: [
                {
                    text: "Enable 'Show > Animation > Bones' and 'Show > Animation > Raw Animation']",
                    type: 'correct',
                    feedback: "You observe that the 'Raw Animation' shows the hand closer to the prop, but the 'Bones' (which reflect compressed data) are slightly offset, confirming compression as a contributing factor. You also notice the raw data itself isn't perfectly aligned, indicating a need for fine-tuning.",
                    next: 'step-2A'
                },
                {
                    text: "Try 'Show > Collision' or 'Show > Physics Assets']",
                    type: 'wrong',
                    feedback: "While useful, these views are for collision and physics, not directly for animation bone data. You need to inspect the animation itself to understand the bone transforms.",
                    next: 'step-2A'
                },
            ]
        },

        'step-2B': {
            skill: 'level_editor',
            title: 'Step 2B: Collision & Physics Check',
            prompt: "Before applying an animation fix, it's crucial to ensure the prop's collision is correctly set up. How do you quickly verify this in the viewport?",
            choices: [
                {
                    text: "Enable 'Show > Collision' or use console command 'pxvis collision']",
                    type: 'correct',
                    feedback: "You confirm the prop has a simple, correctly shaped collision mesh that the hand *should* interact with. This rules out a fundamental collision setup issue, reinforcing that the problem is animation-related and requires a posing adjustment.",
                    next: 'step-2A'
                },
                {
                    text: "Adjust the prop's physics asset settings]",
                    type: 'wrong',
                    feedback: "Adjusting physics assets is for dynamic simulations, not static collision checks for animation. You need to visualize the collision geometry itself to confirm its shape and placement.",
                    next: 'step-2A'
                },
            ]
        },

        'step-2R': {
            skill: 'animation',
            title: 'Dead End: Re-importing Animation',
            prompt: "You suspect animation compression is the culprit. What's a common, but often overkill or destructive, approach to try and fix this specific issue?",
            choices: [
                {
                    text: "Re-import the animation asset with different compression settings]",
                    type: 'correct',
                    feedback: "You try re-importing the animation with 'None' or 'Per-Bone' compression. While it might slightly improve accuracy, it's a time-consuming process, increases file size, and doesn't guarantee a perfect per-shot fix. You realize a non-destructive, additive approach is better for specific cinematic adjustments.",
                    next: 'step-2A'
                },
            ]
        },

        'step-4A': {
            skill: 'packaging',
            title: 'Step 4A: Standalone Game Test',
            prompt: "The fix looks good in PIE. What's the next critical step to ensure it holds up in a real game environment, accounting for potential editor-only discrepancies?",
            choices: [
                {
                    text: "Launch the game in Standalone Game mode or a packaged build]",
                    type: 'correct',
                    feedback: "You run the cinematic in a standalone game instance. The hand interaction remains perfectly aligned, confirming the Control Rig adjustment is correctly applied and baked, and not just an editor-only artifact. This verifies the fix in a more realistic runtime scenario.",
                    next: 'step-4A'
                },
                {
                    text: "Share the sequence with a colleague for review]",
                    type: 'wrong',
                    feedback: "While peer review is good, it doesn't replace technical verification in a game-like environment. You need to confirm the fix works outside of the editor's specific context.",
                    next: 'step-4A'
                },
            ]
        },

        'step-4B': {
            skill: 'optimization',
            title: 'Step 4B: Performance Impact Check',
            prompt: "Additive Control Rig layers add computation. How do you quickly check if your fix has introduced any noticeable performance overhead, especially on animation or game thread time?",
            choices: [
                {
                    text: "Use console commands like 'stat unit' or 'stat anim']",
                    type: 'correct',
                    feedback: "You enable 'stat unit' and 'stat anim' during playback. You observe minimal to no increase in animation or game thread time, confirming the additive layer is lightweight and efficient for this specific adjustment without impacting performance.",
                    next: 'step-4A'
                },
                {
                    text: "Profile the entire game for several minutes using Unreal Insights]",
                    type: 'wrong',
                    feedback: "Unreal Insights is powerful but overkill for a quick check on a specific animation adjustment. 'stat unit' or 'stat anim' provide immediate, relevant feedback for this scenario without deep profiling.",
                    next: 'step-4A'
                },
            ]
        },

        
        'step-2a': {
            skill: 'sequencer',
            title: 'Step 2a: Precise Bone Transform Analysis',
            prompt: "You've confirmed the hand bone is slightly off. To understand the exact misalignment, you need to inspect the bone's transform values directly. How do you do this in Sequencer?",
            choices: [
                {
                    text: "Inspect Hand Bone Transform in Sequencer]",
                    type: 'correct',
                    feedback: "You select the character's skeletal mesh track in Sequencer, expand it to find the specific hand bone (e.g., 'hand_r'), and inspect its transform curves. You notice small, consistent offsets in position (X, Y, Z) during the grab frames, confirming it's a precise positional error rather than a rotation or scale issue.",
                    next: 'step-2b'
                },
                {
                    text: "Try to adjust the bone in Persona]",
                    type: 'wrong',
                    feedback: "Adjusting the bone directly in Persona would modify the base animation asset, which is destructive and would affect all instances of that animation. You need a non-destructive, shot-specific fix.",
                    next: 'step-2aW'
                },
            ]
        },

        'step-2aW': {
            skill: 'sequencer',
            title: 'Dead End: Persona Adjustment',
            prompt: "Modifying the base animation asset in Persona is too broad and destructive for a shot-specific issue. You need to inspect the current state in Sequencer.",
            choices: [
                {
                    text: "Revert and inspect in Sequencer]",
                    type: 'correct',
                    feedback: "You revert any changes in Persona and return to Sequencer to inspect the hand bone's transform curves directly.",
                    next: 'step-2b'
                },
            ]
        },

        'step-2b': {
            skill: 'animation',
            title: 'Step 2b: Animation Compression Investigation',
            prompt: "The scenario description mentioned animation compression as a potential cause. How would you investigate if compression is contributing to the subtle misalignment?",
            choices: [
                {
                    text: "Check Animation Asset Compression Settings]",
                    type: 'correct',
                    feedback: "You open the base animation asset in Persona and navigate to its compression settings. You temporarily set the 'Compression Algorithm' to 'AC_None' or reduce the 'Max Error' for the relevant bones. After re-saving and re-evaluating in Sequencer, you observe a slight improvement, confirming compression was indeed a factor, but not the sole cause, and disabling it entirely is too costly for runtime.",
                    next: 'step-2c_redherring'
                },
                {
                    text: "Adjust Physics Asset Collision]",
                    type: 'wrong',
                    feedback: "While physics assets define collision, they primarily affect dynamic interactions and ragdolls, not the precise posing of a static grab animation. This won't help with the subtle positional error.",
                    next: 'step-2bW'
                },
            ]
        },

        'step-2bW': {
            skill: 'animation',
            title: 'Dead End: Physics Asset',
            prompt: "Adjusting the Physics Asset won't solve a precise animation posing issue. You need to focus on the animation data itself.",
            choices: [
                {
                    text: "Re-focus on animation settings]",
                    type: 'correct',
                    feedback: "You realize the problem is with the animation data's precision, not its collision representation, and return to investigating animation compression settings.",
                    next: 'step-2c_redherring'
                },
            ]
        },

        'step-2c_redherring': {
            skill: 'animation_blueprint',
            title: 'Red Herring: AnimBP Override Attempt',
            prompt: "You consider if an Animation Blueprint might be overriding the hand's position. How would you check this, and is it the right approach for a cinematic shot?",
            choices: [
                {
                    text: "Check AnimBP for 'Transform (Modify) Bone' nodes]",
                    type: 'misguided',
                    feedback: "You open the character's Animation Blueprint and look for 'Transform (Modify) Bone' nodes or other IK setups affecting the hand. While you might find some, you realize that adding a new node here would be a global change affecting all instances of this AnimBP, which is not ideal for a specific cinematic shot. Sequencer offers a more targeted solution.",
                    next: 'step-3'
                },
                {
                    text: "Realize AnimBP is not the best approach for Sequencer]",
                    type: 'correct',
                    feedback: "You correctly identify that while AnimBPs can modify bone transforms, making a global change for a specific cinematic shot is inefficient and prone to breaking other animations. Sequencer's Control Rig integration is designed for precise, shot-specific adjustments.",
                    next: 'step-3'
                },
            ]
        },

        'step-4a': {
            skill: 'optimization',
            title: 'Step 4a: Performance and Regression Check',
            prompt: "The clipping is fixed, but you need to ensure your solution hasn't introduced any performance hitches or unintended side effects in other parts of the cinematic. What's your next verification step?",
            choices: [
                {
                    text: "Monitor Performance with Stat Commands]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat anim` in PIE while playing the sequence. You observe that the added Control Rig layer has a negligible impact on performance, confirming it's an efficient solution. You also scrub through other shots in the sequence to ensure no other animations were inadvertently affected.",
                    next: 'step-4b'
                },
                {
                    text: "Re-export the entire animation]",
                    type: 'wrong',
                    feedback: "Re-exporting the entire animation would be a destructive and time-consuming process, negating the benefit of the non-destructive Control Rig fix. This is not a verification step.",
                    next: 'step-4aW'
                },
            ]
        },

        'step-4aW': {
            skill: 'optimization',
            title: 'Dead End: Re-exporting Animation',
            prompt: "Re-exporting the animation is not a verification step and undoes the non-destructive nature of your fix. You need to verify the *current* solution's impact.",
            choices: [
                {
                    text: "Focus on performance and side effects]",
                    type: 'correct',
                    feedback: "You refocus on verifying the performance and ensuring no regressions were introduced by the Control Rig adjustment.",
                    next: 'step-4b'
                },
            ]
        },

        'step-4b': {
            skill: 'sequencer',
            title: 'Step 4b: Final Visual Scrutiny',
            prompt: "You've confirmed the fix and checked performance. For final sign-off, you want to be absolutely certain the hand-prop interaction looks perfect from all angles and speeds. What's your final visual check?",
            choices: [
                {
                    text: "Render Preview and Review from Multiple Angles]",
                    type: 'correct',
                    feedback: "You render out a high-quality preview of the shot, then review it frame-by-frame and from various camera angles (including extreme close-ups and wide shots). You also play the sequence in slow-motion within Sequencer to catch any subtle remaining jitters or misalignments. The hand contact remains clean and natural throughout.",
                    next: 'conclusion'
                },
                {
                    text: "Delete the Control Rig track]",
                    type: 'wrong',
                    feedback: "Deleting the Control Rig track would undo your fix! This is the opposite of verification.",
                    next: 'step-4bW'
                },
            ]
        },

        'step-4bW': {
            skill: 'sequencer',
            title: 'Dead End: Deleting the Fix',
            prompt: "Deleting the Control Rig track would remove your solution. You need to verify the *effectiveness* of the fix, not remove it.",
            choices: [
                {
                    text: "Re-focus on thorough visual inspection]",
                    type: 'correct',
                    feedback: "You refocus on a thorough visual inspection from all angles and speeds to ensure the fix is robust.",
                    next: 'step-4b'
                },
            ]
        },
                },
            ]
        },

        
        'step-2A': {
            skill: 'sequencer',
            title: 'Step 2A: Deeper Animation Inspection',
            prompt: "The base animation seems off. To confirm if it's compression or raw data inaccuracy, what specific debug views do you enable in Sequencer?",
            choices: [
                {
                    text: "Enable 'Show > Animation > Bones' and 'Show > Animation > Raw Animation']",
                    type: 'correct',
                    feedback: "You observe that the 'Raw Animation' shows the hand closer to the prop, but the 'Bones' (which reflect compressed data) are slightly offset, confirming compression as a contributing factor. You also notice the raw data itself isn't perfectly aligned, indicating a need for fine-tuning.",
                    next: 'step-2A'
                },
                {
                    text: "Try 'Show > Collision' or 'Show > Physics Assets']",
                    type: 'wrong',
                    feedback: "While useful, these views are for collision and physics, not directly for animation bone data. You need to inspect the animation itself to understand the bone transforms.",
                    next: 'step-2A'
                },
            ]
        },

        'step-2B': {
            skill: 'level_editor',
            title: 'Step 2B: Collision & Physics Check',
            prompt: "Before applying an animation fix, it's crucial to ensure the prop's collision is correctly set up. How do you quickly verify this in the viewport?",
            choices: [
                {
                    text: "Enable 'Show > Collision' or use console command 'pxvis collision']",
                    type: 'correct',
                    feedback: "You confirm the prop has a simple, correctly shaped collision mesh that the hand *should* interact with. This rules out a fundamental collision setup issue, reinforcing that the problem is animation-related and requires a posing adjustment.",
                    next: 'step-2A'
                },
                {
                    text: "Adjust the prop's physics asset settings]",
                    type: 'wrong',
                    feedback: "Adjusting physics assets is for dynamic simulations, not static collision checks for animation. You need to visualize the collision geometry itself to confirm its shape and placement.",
                    next: 'step-2A'
                },
            ]
        },

        'step-2R': {
            skill: 'animation',
            title: 'Dead End: Re-importing Animation',
            prompt: "You suspect animation compression is the culprit. What's a common, but often overkill or destructive, approach to try and fix this specific issue?",
            choices: [
                {
                    text: "Re-import the animation asset with different compression settings]",
                    type: 'correct',
                    feedback: "You try re-importing the animation with 'None' or 'Per-Bone' compression. While it might slightly improve accuracy, it's a time-consuming process, increases file size, and doesn't guarantee a perfect per-shot fix. You realize a non-destructive, additive approach is better for specific cinematic adjustments.",
                    next: 'step-2A'
                },
            ]
        },

        'step-4A': {
            skill: 'packaging',
            title: 'Step 4A: Standalone Game Test',
            prompt: "The fix looks good in PIE. What's the next critical step to ensure it holds up in a real game environment, accounting for potential editor-only discrepancies?",
            choices: [
                {
                    text: "Launch the game in Standalone Game mode or a packaged build]",
                    type: 'correct',
                    feedback: "You run the cinematic in a standalone game instance. The hand interaction remains perfectly aligned, confirming the Control Rig adjustment is correctly applied and baked, and not just an editor-only artifact. This verifies the fix in a more realistic runtime scenario.",
                    next: 'step-4A'
                },
                {
                    text: "Share the sequence with a colleague for review]",
                    type: 'wrong',
                    feedback: "While peer review is good, it doesn't replace technical verification in a game-like environment. You need to confirm the fix works outside of the editor's specific context.",
                    next: 'step-4A'
                },
            ]
        },

        'step-4B': {
            skill: 'optimization',
            title: 'Step 4B: Performance Impact Check',
            prompt: "Additive Control Rig layers add computation. How do you quickly check if your fix has introduced any noticeable performance overhead, especially on animation or game thread time?",
            choices: [
                {
                    text: "Use console commands like 'stat unit' or 'stat anim']",
                    type: 'correct',
                    feedback: "You enable 'stat unit' and 'stat anim' during playback. You observe minimal to no increase in animation or game thread time, confirming the additive layer is lightweight and efficient for this specific adjustment without impacting performance.",
                    next: 'step-4A'
                },
                {
                    text: "Profile the entire game for several minutes using Unreal Insights]",
                    type: 'wrong',
                    feedback: "Unreal Insights is powerful but overkill for a quick check on a specific animation adjustment. 'stat unit' or 'stat anim' provide immediate, relevant feedback for this scenario without deep profiling.",
                    next: 'step-4A'
                },
            ]
        },

        
        'step-2a': {
            skill: 'sequencer',
            title: 'Step 2a: Precise Bone Transform Analysis',
            prompt: "You've confirmed the hand bone is slightly off. To understand the exact misalignment, you need to inspect the bone's transform values directly. How do you do this in Sequencer?",
            choices: [
                {
                    text: "Inspect Hand Bone Transform in Sequencer]",
                    type: 'correct',
                    feedback: "You select the character's skeletal mesh track in Sequencer, expand it to find the specific hand bone (e.g., 'hand_r'), and inspect its transform curves. You notice small, consistent offsets in position (X, Y, Z) during the grab frames, confirming it's a precise positional error rather than a rotation or scale issue.",
                    next: 'step-2b'
                },
                {
                    text: "Try to adjust the bone in Persona]",
                    type: 'wrong',
                    feedback: "Adjusting the bone directly in Persona would modify the base animation asset, which is destructive and would affect all instances of that animation. You need a non-destructive, shot-specific fix.",
                    next: 'step-2aW'
                },
            ]
        },

        'step-2aW': {
            skill: 'sequencer',
            title: 'Dead End: Persona Adjustment',
            prompt: "Modifying the base animation asset in Persona is too broad and destructive for a shot-specific issue. You need to inspect the current state in Sequencer.",
            choices: [
                {
                    text: "Revert and inspect in Sequencer]",
                    type: 'correct',
                    feedback: "You revert any changes in Persona and return to Sequencer to inspect the hand bone's transform curves directly.",
                    next: 'step-2b'
                },
            ]
        },

        'step-2b': {
            skill: 'animation',
            title: 'Step 2b: Animation Compression Investigation',
            prompt: "The scenario description mentioned animation compression as a potential cause. How would you investigate if compression is contributing to the subtle misalignment?",
            choices: [
                {
                    text: "Check Animation Asset Compression Settings]",
                    type: 'correct',
                    feedback: "You open the base animation asset in Persona and navigate to its compression settings. You temporarily set the 'Compression Algorithm' to 'AC_None' or reduce the 'Max Error' for the relevant bones. After re-saving and re-evaluating in Sequencer, you observe a slight improvement, confirming compression was indeed a factor, but not the sole cause, and disabling it entirely is too costly for runtime.",
                    next: 'step-2c_redherring'
                },
                {
                    text: "Adjust Physics Asset Collision]",
                    type: 'wrong',
                    feedback: "While physics assets define collision, they primarily affect dynamic interactions and ragdolls, not the precise posing of a static grab animation. This won't help with the subtle positional error.",
                    next: 'step-2bW'
                },
            ]
        },

        'step-2bW': {
            skill: 'animation',
            title: 'Dead End: Physics Asset',
            prompt: "Adjusting the Physics Asset won't solve a precise animation posing issue. You need to focus on the animation data itself.",
            choices: [
                {
                    text: "Re-focus on animation settings]",
                    type: 'correct',
                    feedback: "You realize the problem is with the animation data's precision, not its collision representation, and return to investigating animation compression settings.",
                    next: 'step-2c_redherring'
                },
            ]
        },

        'step-2c_redherring': {
            skill: 'animation_blueprint',
            title: 'Red Herring: AnimBP Override Attempt',
            prompt: "You consider if an Animation Blueprint might be overriding the hand's position. How would you check this, and is it the right approach for a cinematic shot?",
            choices: [
                {
                    text: "Check AnimBP for 'Transform (Modify) Bone' nodes]",
                    type: 'misguided',
                    feedback: "You open the character's Animation Blueprint and look for 'Transform (Modify) Bone' nodes or other IK setups affecting the hand. While you might find some, you realize that adding a new node here would be a global change affecting all instances of this AnimBP, which is not ideal for a specific cinematic shot. Sequencer offers a more targeted solution.",
                    next: 'step-3'
                },
                {
                    text: "Realize AnimBP is not the best approach for Sequencer]",
                    type: 'correct',
                    feedback: "You correctly identify that while AnimBPs can modify bone transforms, making a global change for a specific cinematic shot is inefficient and prone to breaking other animations. Sequencer's Control Rig integration is designed for precise, shot-specific adjustments.",
                    next: 'step-3'
                },
            ]
        },

        'step-4a': {
            skill: 'optimization',
            title: 'Step 4a: Performance and Regression Check',
            prompt: "The clipping is fixed, but you need to ensure your solution hasn't introduced any performance hitches or unintended side effects in other parts of the cinematic. What's your next verification step?",
            choices: [
                {
                    text: "Monitor Performance with Stat Commands]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat anim` in PIE while playing the sequence. You observe that the added Control Rig layer has a negligible impact on performance, confirming it's an efficient solution. You also scrub through other shots in the sequence to ensure no other animations were inadvertently affected.",
                    next: 'step-4b'
                },
                {
                    text: "Re-export the entire animation]",
                    type: 'wrong',
                    feedback: "Re-exporting the entire animation would be a destructive and time-consuming process, negating the benefit of the non-destructive Control Rig fix. This is not a verification step.",
                    next: 'step-4aW'
                },
            ]
        },

        'step-4aW': {
            skill: 'optimization',
            title: 'Dead End: Re-exporting Animation',
            prompt: "Re-exporting the animation is not a verification step and undoes the non-destructive nature of your fix. You need to verify the *current* solution's impact.",
            choices: [
                {
                    text: "Focus on performance and side effects]",
                    type: 'correct',
                    feedback: "You refocus on verifying the performance and ensuring no regressions were introduced by the Control Rig adjustment.",
                    next: 'step-4b'
                },
            ]
        },

        'step-4b': {
            skill: 'sequencer',
            title: 'Step 4b: Final Visual Scrutiny',
            prompt: "You've confirmed the fix and checked performance. For final sign-off, you want to be absolutely certain the hand-prop interaction looks perfect from all angles and speeds. What's your final visual check?",
            choices: [
                {
                    text: "Render Preview and Review from Multiple Angles]",
                    type: 'correct',
                    feedback: "You render out a high-quality preview of the shot, then review it frame-by-frame and from various camera angles (including extreme close-ups and wide shots). You also play the sequence in slow-motion within Sequencer to catch any subtle remaining jitters or misalignments. The hand contact remains clean and natural throughout.",
                    next: 'conclusion'
                },
                {
                    text: "Delete the Control Rig track]",
                    type: 'wrong',
                    feedback: "Deleting the Control Rig track would undo your fix! This is the opposite of verification.",
                    next: 'step-4bW'
                },
            ]
        },

        'step-4bW': {
            skill: 'sequencer',
            title: 'Dead End: Deleting the Fix',
            prompt: "Deleting the Control Rig track would remove your solution. You need to verify the *effectiveness* of the fix, not remove it.",
            choices: [
                {
                    text: "Re-focus on thorough visual inspection]",
                    type: 'correct',
                    feedback: "You refocus on a thorough visual inspection from all angles and speeds to ensure the fix is robust.",
                    next: 'step-4b'
                },
            ]
        },

        'conclusion': {
            skill: 'sequencer',
            title: 'Conclusion',
            prompt: "Lesson: For precise interactions like grabbing props, base animations often need tweaking. Use Control Rig in Sequencer (specifically additive layers) to make non-destructive, per-shot adjustments to bone positions without having to re-export or modify the original animation asset.",
            choices: []
        }
    }
};