window.SCENARIOS['SequencerLightReverts'] = {
    meta: {
        title: "Light Reverts After Cinematic",
        description: "Keyframed light resets after sequence. Investigates \"Restore State\" vs \"Keep State\".",
        estimateHours: 1.5
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'sequencer',
            title: 'Step 1: The Symptom',
            prompt: "A spotlight is keyframed in Sequencer to fade to bright RED at the end of a cinematic, but as soon as the sequence finishes, the light snaps back to its original white color. Property resets on sequence end. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You scrub the Sequencer timeline and watch the light in the viewport: during the shot, the color correctly animates to RED. The moment playback stops, the light's color instantly returns to white. This tells you the track is applying during the sequence but something is explicitly restoring the pre-sequence state when it ends.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You try duplicating the keys and even keyframe the light directly in the level, but the color still snaps back to white when the cinematic finishes. Clearly the keys are working during playback, so the problem isn't missing keyframes.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'sequencer',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path, assuming the issue was bad keyframes or a broken light actor. The animation clearly plays correctly; it's only after the sequence ends that the property reverts.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the extra keyframe clutter and refocus on Sequencer's playback settings--specifically what Sequencer does to bound properties when the section finishes.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'sequencer',
            title: 'Step 2: Investigation',
            prompt: "You open the Level Sequence, select the light's color track section, and inspect its properties to understand why the light state is being reverted after playback. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "In the section's Properties, you see that \"When Finished\" is set to the default \"Restore State\". That setting tells Sequencer to push the animated value during playback and then restore the original value (white) as soon as the sequence stops. That's exactly why the spotlight won't stay RED at the end of the cinematic.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You consider adding another hidden sequence or a Blueprint to reapply the RED color after the cinematic, but that's just a hack. It would fight against Sequencer still restoring the original value on its own.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'sequencer',
            title: 'Dead End: Misguided',
            prompt: "That didn't work because Sequencer is still configured to restore the light's original color when the sequence ends. Any external attempts to force the color RED will be overwritten unless you change that behavior.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the correct approach is to change the track's \"When Finished\" behavior in Sequencer so it keeps the final value from the cinematic instead of restoring the pre-cinematic state.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'sequencer',
            title: 'Step 3: The Fix',
            prompt: "You now know the cause: the spotlight's color track is set to \"Restore State\" at the end of the sequence. How do you fix it so the light stays RED after the cinematic?",
            choices: [
                {
                    text: "Action: [Set \"When Finished\" to \"Keep State\".]",
                    type: 'correct',
                    feedback: "In Sequencer, you right-click the light color track section, open Properties, and change the \"When Finished\" option from \"Restore State\" to \"Keep State\". This tells Sequencer to leave the light at its final keyed value (RED) when the cinematic ends instead of snapping back to the original white color.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'sequencer',
            title: 'Step 4: Verification',
            prompt: "You re-run the cinematic in PIE and watch the spotlight's behavior before, during, and after the sequence. How do you verify the fix?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, the spotlight starts white, animates to RED as the sequence plays, and after the cinematic finishes, it remains RED in the level. The property no longer snaps back, confirming that setting \"When Finished\" to \"Keep State\" solved the problem.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'sequencer',
            title: 'Conclusion',
            prompt: "Lesson: When a property animated in Sequencer reverts after playback, check the track section's \"When Finished\" setting. Use \"Keep State\" instead of the default \"Restore State\" whenever you want the final cinematic value--like a light turning RED--to persist after the sequence ends.",
            choices: []
        }
    }
};