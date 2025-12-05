window.SCENARIOS['CinematicHandClipping'] = {
    meta: {
        title: "Hand Clips Through Prop",
        description: "Animation compression causes clipping. Investigates Control Rig additive layers in Sequencer.",
        estimateHours: 1.5
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'sequencer',
            title: 'Step 1: The Symptom',
            prompt: "During a pickup shot in your cinematic, the character's hand slides through the prop instead of landing cleanly on it. The placement looks imprecise right at the moment of contact. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You scrub the sequence frame by frame in Sequencer and enable animation debug overlays. You see that the base animation is close, but the fingers and wrist miss the prop by just a few centimeters and clip through it. It's clearly a posing / alignment issue, not a missing attach or visibility problem.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
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
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You revert the prop offsets and refocus on the character animation in Sequencer--specifically the hand and attach timing.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'sequencer',
            title: 'Step 2: Investigation',
            prompt: "You inspect the animation track and the prop attachment in Sequencer. The timing is right, but the hand bone is just slightly off-target during the grab. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You determine that animation compression has smoothed out the precise finger movements, or the original mocap data just doesn't perfectly align with this specific prop. The animation itself is 'correct' but needs a non-destructive adjustment on top to fit the scene perfectly.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
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
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize that Sequencer's Control Rig integration allows for additive adjustments on top of existing animation tracks.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'sequencer',
            title: 'Step 3: The Fix',
            prompt: "You need to fix the hand clipping without replacing the base animation. How do you do this?",
            choices: [
                {
                    text: "Action: [Use Control Rig to add additive offset.]",
                    type: 'correct',
                    feedback: "You right-click the skeletal mesh track in Sequencer and select 'Bake to Control Rig' or simply add a Control Rig track with 'Additive' enabled. You then keyframe the hand control to offset the position slightly during the grab frames, ensuring a clean contact with the prop. The base animation still plays, but your additive layer fixes the clipping.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'sequencer',
            title: 'Step 4: Verification',
            prompt: "You scrub through the timeline and play the cinematic in PIE. How do you verify the fix?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, the character reaches out and grabs the prop with perfect alignment. The fingers no longer clip through the object, and the rest of the animation remains untouched. The additive Control Rig adjustment solved the specific spacing issue.",
                    next: 'conclusion'
                }
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