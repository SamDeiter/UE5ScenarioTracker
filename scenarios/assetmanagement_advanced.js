window.SCENARIOS['AnimNotifiesNotFiring'] = {
    meta: {
        title: "Anim Notifies Not Firing in PIE",
        description: "Attack animation plays but effects (Notifies) are missing in PIE. Investigates Montage vs Sequence playback and Notify Trigger Modes.",
        estimateHours: 3.5,
        category: "Assets"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'asset_management',
            title: 'Step 1: The Symptom',
            prompt: "Your attack animation plays in-game, but the Particle and Sound effects that you see in the animation asset preview never appear in PIE. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You enable animation debugging / notify visualization and log output. In the Animation Preview the notifies clearly fire, but in PIE you see no notify debug messages at all when the attack plays--suggesting the notifies aren't being triggered in-game.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You spend time tweaking Niagara and audio settings, but the effects still never trigger in PIE. The attack animation plays, so this is probably not a simple VFX/audio setup issue.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'asset_management',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the VFX/audio rabbit hole--recompiling systems, swapping sounds--but nothing changed. The animation plays, yet no notifies fire in PIE.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You roll back the unnecessary changes and refocus on how and when the animation notifies are actually evaluated in the attack animation.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'asset_management',
            title: 'Step 2: Investigation',
            prompt: "You open the attack animation asset and inspect the notify track and how the animation is played in the Animation Blueprint. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the notifies are configured as \"Montage Only\" (or their Notify Trigger Mode is set for a montage slot), but in-game the attack is being played as a raw sequence in the AnimGraph. Because it isn't running through the montage system or the expected slot, those notifies never fire during PIE.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try re-adding the notifies, duplicating the animation, or reimporting the FX assets. The notifies still don't fire in PIE because the way the animation is played (sequence vs montage / slot) and the Notify Trigger Mode are still mismatched.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'asset_management',
            title: 'Dead End: Misguided',
            prompt: "That didn't work because the issue isn't missing assets--it's when and how the notifies are evaluated. If the animation is played as a sequence but the notifies are set up for montage-only triggering, they will never fire.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must either adjust the Notify Trigger Mode to match how the animation is played, or switch to playing the attack via an Animation Montage that uses the correct notify-bearing slot.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'asset_management',
            title: 'Step 3: The Fix',
            prompt: "You now know the notifies are configured for the wrong context (Montage Only vs Sequence, or an incompatible Notify Trigger Mode). How do you fix it?",
            choices: [
                {
                    text: "Action: [Check Notify Trigger Mode or use Montage.]",
                    type: 'correct',
                    feedback: "You update the setup: either you switch the attack to play through an Animation Montage using the correct slot, or you change the Anim Notify Trigger Mode so notifies fire for the way the animation is actually played (sequence vs montage). After saving the animation and Animation Blueprint, the notifies are now eligible to trigger in PIE.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'asset_management',
            title: 'Step 4: Verification',
            prompt: "You re-run the game in PIE and trigger the attack again with your updated notify configuration. What happens now?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, when the attack animation plays, the Anim Notifies now fire as expected: the Particle Effect spawns and the Sound cue plays at the correct frames. Your debug output also shows the notify events triggering, confirming that the fix worked.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'asset_management',
            title: 'Conclusion',
            prompt: "Lesson: If Anim Notifies work in the animation preview but not in PIE, verify how the animation is played and how the notifies are configured. Ensure the Notify Trigger Mode matches your playback (sequence vs montage), or play the attack via a Montage when using montage-specific notifies and slots.",
            choices: []
        }
    }
};