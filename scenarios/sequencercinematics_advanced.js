window.SCENARIOS['PlayerLockedAfterCinematic'] = {
    meta: {
        title: "Input Locked After Cinematic",
        description: "Player stuck after cutscene. Investigates Camera Cut track and OnFinished events.",
        estimateHours: 3.5,
        category: "Cinematics"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'sequencer',
            title: 'Step 1: The Symptom',
            prompt: "A cinematic finishes, but the player is stuck: input stays disabled and the camera never returns to the gameplay view. The game looks frozen on the last shot of the sequence. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You turn on logging and Sequencer debug, then replay the cinematic. You see the Level Sequence playing through to the end, but the \"On Finished\" logic never seems to fire and the active camera never switches back to the player. This points to an issue with the Level Sequence Player events or the Camera Cut track restoring state.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You start tweaking the character's input settings and rechecking the Player Controller, but nothing changes--the camera is still stuck on the cinematic shot and input stays locked. Clearly the problem is tied to the sequence ending, not the base character blueprint.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'sequencer',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path, assuming the problem was in the character or controller setup. Those changes didn't restore camera control after the cinematic.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the unnecessary character/controller tweaks and refocus on the Level Sequence itself--specifically what happens when it stops and how the camera is being driven.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'sequencer',
            title: 'Step 2: Investigation',
            prompt: "You open the Level Sequence and inspect the Camera Cut track and the Blueprint logic that starts the cinematic. You want to see what happens when the sequence finishes. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the Camera Cut track is driving the view for the entire cinematic, but \"Restore State\" isn't enabled on that track, so the camera isn't being handed back automatically. On top of that, the Level Sequence Player's OnFinished/OnStop event either isn't bound at all or doesn't call \"Set View Target with Blend\" back to the player's camera and re-enable input. In short, nothing tells the game to return control to the player when the sequence ends.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You consider extending the cinematic with extra empty frames or adding a second sequence to \"unstick\" the player, but that doesn't address the core issue: the camera cut and OnFinished logic never restore the player view or input.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'sequencer',
            title: 'Dead End: Misguided',
            prompt: "That workaround didn't help because the game still doesn't have any explicit instruction to give control back to the player once the cinematic ends.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must either let Sequencer restore the previous camera state automatically via the Camera Cut track or explicitly set the player camera and input in the Level Sequence Player's OnFinished/OnStop event.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'sequencer',
            title: 'Step 3: The Fix',
            prompt: "You know the camera remains bound to the cinematic and the OnFinished event isn't handing control back to the player. How do you fix it?",
            choices: [
                {
                    text: "Action: [Ensure Camera Cut \"Restore State\" is on or manually set View Target.]",
                    type: 'correct',
                    feedback: "In the Level Sequence, you enable \"Restore State\" on the Camera Cut track so that when the cinematic ends, Sequencer restores the previous gameplay camera automatically. In Blueprint, you also hook into the Level Sequence Player's OnFinished/OnStop event and call \"Set View Target with Blend\" on the Player Controller, targeting the player's camera and re-enabling player input. With these changes, the game cleanly returns control to the player after the sequence.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'sequencer',
            title: 'Step 4: Verification',
            prompt: "You test the cinematic again in PIE: it should play fully, then hand camera and input back to the player. How do you verify the fix?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, the cinematic runs, the camera follows the scripted shots, and when the sequence finishes, the view smoothly blends back to the player's camera. Input is re-enabled and you can move the character again. The player is no longer stuck, confirming that the Camera Cut \"Restore State\" / View Target fix worked.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'sequencer',
            title: 'Conclusion',
            prompt: "Lesson: If a player is stuck after a cinematic, verify that the Level Sequence correctly hands control back. Enable \"Restore State\" on the Camera Cut track or, in the Level Sequence Player's OnFinished/OnStop event, explicitly call \"Set View Target with Blend\" back to the player camera and re-enable input so gameplay can resume.",
            choices: []
        }
    }
};