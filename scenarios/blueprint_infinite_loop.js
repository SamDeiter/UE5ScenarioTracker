window.SCENARIOS['blueprint_infinite_loop'] = {
    meta: {
        title: "Blueprint: Editor Freeze & Infinite Loop",
        description: "The editor hangs or crashes with an 'Infinite Loop Detected' error when running a specific Blueprint logic. Investigates flow control and loop termination.",
        estimateHours: 1.5
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'blueprint',
            title: 'Step 1: The Frozen Editor',
            prompt: "<p>You press Play, and the editor instantly freezes. After a few seconds, it crashes or breaks with a message: <strong>Infinite Loop Detected</strong> in <code>BP_EnemySpawner</code>.</p><strong>What is the most common cause of an infinite loop in a 'While Loop' node?</strong>",
            choices: [
                {
                    text: 'Action: The loop condition never becomes <strong>False</strong> inside the loop body.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. If the condition logic doesn't change during the loop body execution, it will run forever (or until the engine kills it).</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: The loop body is too complex.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Complexity doesn't cause infinite loops; logic flow does.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: Using a <strong>For Loop</strong> instead of a While Loop.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> For Loops are safer, but that doesn't explain <em>why</em> the While Loop failed.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: The blueprint is ticking too fast.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Tick rate affects performance, but an infinite loop happens in a single frame.</p>",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'blueprint',
            title: 'Step 2: Safe Iteration',
            prompt: "<p>You need to spawn enemies until a location is found, but you want to prevent the crash if it fails 1000 times.</p><strong>What is the best practice to prevent a While Loop from hanging the engine?</strong>",
            choices: [
                {
                    text: 'Action: Add a <strong>Counter</strong> variable that increments each loop, and AND the loop condition with <code>Counter < MaxLimit</code>.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. This 'safety break' ensures that even if the logic fails, the loop will terminate after N attempts.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: Increase the <strong>Maximum Loop Iteration Count</strong> in Project Settings.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> This just delays the crash; it doesn't fix the broken logic.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: Put a <strong>Delay</strong> node inside the loop body.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> You cannot put a Delay inside a standard function or macro loop (except in the Event Graph with specific setups), and it changes the behavior to asynchronous.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: Use a <strong>Do N</strong> node.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Do N executes N times total, not necessarily in a loop structure. A manual counter is more robust for While loops.</p>",
                    next: 'conclusion'
                }
            ]
        }
    }
};
