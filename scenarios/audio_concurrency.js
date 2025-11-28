window.SCENARIOS['audio_concurrency'] = {
    meta: {
        title: "Audio: Sound Effects Cutting Out",
        description: "Gunshot sounds are cutting out when rapid-firing, or other sounds are disappearing during intense combat. Investigates Sound Concurrency and Priority settings.",
        estimateHours: 1.0
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'audio',
            title: 'Step 1: The Silent Gunshots',
            prompt: "<p>During a playtest, you notice that when the player fires their weapon rapidly, some of the gunshot sounds fail to play, or they cut off other important sounds like enemy footsteps. You suspect a <strong>Concurrency</strong> limit is being hit.</p><strong>Where is the primary place to define how many instances of a sound can play at once?</strong>",
            choices: [
                {
                    text: 'Action: Create or assign a <strong>Sound Concurrency</strong> asset to the Sound Cue or MetaSound.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. A Concurrency asset allows you to set a 'Max Count' and a 'Resolution Rule' (e.g., Stop Oldest) to manage the voice count cleanly.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: Increase the <strong>Volume Multiplier</strong> on the sound.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Volume has nothing to do with the voice limit count.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: Change the Sound Class to <strong>Master</strong>.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> While Sound Classes handle mixing, they don't strictly enforce instance limits like Concurrency settings do.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: Use a <strong>Delay</strong> node in the Blueprint before playing the sound.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> This is a hacky gameplay workaround, not a proper audio system fix.</p>",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'audio',
            title: 'Step 2: Priority Management',
            prompt: "<p>You've set a limit, but now the gunshots are cutting off <em>enemy footsteps</em>, which is bad for gameplay awareness.</p><strong>How do you ensure the footsteps take precedence over the gunshots if the voice limit is reached?</strong>",
            choices: [
                {
                    text: 'Action: Assign a higher <strong>Priority</strong> value (e.g., 1.0) to the Footsteps sound and a lower one (e.g., 0.5) to the Gunshots.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. The audio engine will prioritize keeping high-priority sounds alive when the channel limit is reached.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: Make the footsteps louder.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Loudness != Priority in the voice manager.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: Set the Gunshot Concurrency Resolution Rule to <strong>Stop Oldest</strong>.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> This helps the gunshots manage <em>themselves</em>, but doesn't strictly protect the footsteps unless they are in a separate concurrency group.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: Enable <strong>Virtualization</strong> on the footsteps.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Virtualization (Play when Silent) is useful, but Priority is the direct control for what stays audible.</p>",
                    next: 'conclusion'
                }
            ]
        }
    }
};
