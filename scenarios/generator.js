window.SCENARIOS['GeneratorCrash'] = {
    meta: {
        title: "Generator Loop Crash",
        description: "Spawning 1000 actors freezes game. Investigates Time Slicing vs. Loops.",
        estimateHours: 1.0
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'blueprints',
            title: 'Step 1: The Symptom',
            prompt: "You have a 'Generator' Blueprint designed to spawn 1000 items (like coins or debris) when a button is pressed. However, the moment you press the button, the game freezes for several seconds or crashes entirely. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You look at the Blueprint logic and see a simple 'For Loop' running from 1 to 1000, spawning an actor in every single iteration. Doing this all in one frame (synchronously) is overwhelming the game thread.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You try reducing the mesh complexity of the spawned item, thinking it's a rendering bottleneck. But the freeze happens even with empty actors. It's a logic/CPU spike, not a GPU issue.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'blueprints',
            title: 'Dead End: Wrong Guess',
            prompt: "Optimizing the mesh didn't stop the freeze. The engine is still choking on the sheer number of spawn calls happening in a single frame.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You revert the mesh changes and focus on *how* the spawning is being executed in the Blueprint.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'blueprints',
            title: 'Step 2: Investigation',
            prompt: "You examine the 'For Loop' node. It's trying to execute 1000 SpawnActor calls within a single tick. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You confirm that the loop is blocking the game thread until it finishes all 1000 spawns. This causes a massive frame spike (freeze) or a crash if the loop takes too long (Infinite Loop detection might even trigger).",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try increasing the 'Maximum Loop Iteration Count' in Project Settings. This might stop the crash, but it won't stop the freeze—you're still doing too much work in one frame.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'blueprints',
            title: 'Dead End: Misguided',
            prompt: "Increasing the loop limit just allows the game to freeze for *longer* without crashing. It doesn't solve the performance spike.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you need to spread the work out over time instead of doing it all at once.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'blueprints',
            title: 'Step 3: The Fix',
            prompt: "You know the cause: spawning everything in one frame is too heavy. How do you fix it?",
            choices: [
                {
                    text: "Action: [Use a Timer or Time Slicing.]",
                    type: 'correct',
                    feedback: "You replace the 'For Loop' with a Timer (e.g., 'Set Timer by Event') that loops rapidly but spawns only a few items per call, or you build a custom loop that spawns a batch (e.g., 10 items) and then waits for the next frame (Delay 0) to continue. This 'Time Slicing' approach keeps the frame rate smooth while still spawning all 1000 items.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'blueprints',
            title: 'Step 4: Verification',
            prompt: "You implement the timer/batching logic. How do you verify the fix?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, you press the button. The items spawn in a rapid stream rather than appearing instantly, but the game remains perfectly responsive with no freeze. The heavy workload has been successfully distributed.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'blueprints',
            title: 'Conclusion',
            prompt: "Lesson: Avoid heavy 'For Loops' (like spawning hundreds of actors) on the game thread in a single frame. Use **Timers** or **Time Slicing** (batching work across multiple frames) to distribute the load and prevent game freezes.",
            choices: []
        }
    }
};