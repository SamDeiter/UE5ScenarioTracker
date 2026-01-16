window.SCENARIOS['pickup_despawns_prematurely_preventing_buff_application'] = {
    meta: {
        title: "Pickup Despawns Prematurely, Preventing Buff Application",
        description: "A PowerUp pickup (BP_SpeedBoost) is designed to grant the player a temporary speed increase upon overlap and then destroy itself. When testing, the player overlaps the item, and the item immediately vanishes. However, the player's movement speed never changes. Debugging shows the initial 'On Component Begin Overlap' event fires successfully, and the character reference is valid right before the logic path splits, but the 'Set Max Walk Speed' node is never reached or executed.",
        estimateHours: 0.75,
        category: "Blueprints & Logic"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'blueprints',
            title: 'Initial Investigation of the PowerUp Blueprint',
            prompt: "<p>You've identified that the <code>BP_SpeedBoost</code> pickup is vanishing immediately upon overlap, but the player isn't receiving the speed buff. Debugging confirms the <code>On Component Begin Overlap</code> event fires, and the character reference is valid. The <code>Set Max Walk Speed</code> node is never reached.</p><strong>What is your first step to diagnose this issue?</strong>",
            choices: [
                {
                    text: "Enter the <code>BP_SpeedBoost</code> Blueprint and navigate to the Event Graph, specifically focusing on the <code>On Component Begin Overlap</code> event.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> This is the correct starting point. Since the overlap event is confirmed to fire, examining its direct execution path within the pickup's blueprint is crucial.</p>",
                    next: 'step-2'
                },
                {
                    text: "Check the Player Character Blueprint's 'Max Walk Speed' default value, believing the buff might be applied but immediately overwritten.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> While checking character defaults can sometimes be useful, the problem states the 'Set Max Walk Speed' node is <em>never reached or executed</em>. This indicates a problem in the pickup's logic flow, not the character's default values or an overwrite.</p>",
                    next: 'step-2'
                },
                {
                    text: "Add excessive 'Print String' nodes throughout the entire logic path of the Player Character Blueprint to see if any other events are interfering.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> The issue is localized to the pickup's inability to apply the buff, not general interference in the player character. Adding excessive print strings without a focused approach is inefficient and will likely obscure the actual problem.</p>",
                    next: 'step-2'
                },
                {
                    text: "Verify the collision settings on the <code>BP_SpeedBoost</code>'s root component to ensure it's correctly generating overlap events.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> The problem description explicitly states that the 'On Component Begin Overlap' event <em>fires successfully</em>. Therefore, the collision settings are not the root cause of the buff not being applied, although they are important for the initial overlap.</p>",
                    next: 'step-2'
                },
            ]
        },
        'step-2': {
            skill: 'blueprints',
            title: 'Tracing the Execution Flow After Overlap',
            prompt: "<p>You're in the <code>BP_SpeedBoost</code> Event Graph, looking at the <code>On Component Begin Overlap</code> event. You know the <code>Cast To Player Character</code> node successfully executes, and the character reference is valid. The problem is that the <code>Set Max Walk Speed</code> node is never reached.</p><strong>What is your next logical step to pinpoint why the speed buff logic isn't executing?</strong>",
            choices: [
                {
                    text: "Trace the execution flow directly from the successful <code>Cast To Player Character</code> node, observing where its execution pin leads and identifying any subsequent control flow nodes.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> This is the most direct and efficient way to find the point of failure. By following the execution pins, you can see exactly where the logic diverges or terminates before reaching the <code>Set Max Walk Speed</code> node.</p>",
                    next: 'step-3'
                },
                {
                    text: "Immediately replace the <code>Destroy Actor</code> node with a <code>Set Actor Hidden In Game</code> node and a short delay, hoping this prevents premature despawn.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> While this might prevent the visual despawn, it's a speculative fix that doesn't address <em>why</em> the buff isn't applied. You're changing the behavior without understanding the root cause, which could introduce new issues or mask the original problem.</p>",
                    next: 'step-3'
                },
                {
                    text: "Check if the Player Character Blueprint has a specific 'speed boost active' boolean variable that might be preventing the speed change.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> The problem states the <code>Set Max Walk Speed</code> node is <em>never reached</em>. This implies a problem in the execution flow <em>before</em> any variables on the character would be checked or modified by the pickup. Focusing on character variables at this stage is a distraction.</p>",
                    next: 'step-3'
                },
                {
                    text: "Verify the input value for the <code>Set Max Walk Speed</code> node, assuming it might be set to an incorrect or zero value.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> The issue is that the node is <em>never reached or executed</em>, not that it's executing with a wrong value. Checking its input value before confirming execution is premature and won't reveal why the execution path is being interrupted.</p>",
                    next: 'step-3'
                },
            ]
        },
        'step-3': {
            skill: 'blueprints',
            title: 'Analyzing the Control Flow Node',
            prompt: "<p>You've traced the execution flow from the <code>Cast To Player Character</code> node and observed that its execution pin immediately connects to a <code>Sequence</code> node. You also see that the <code>Destroy Actor</code> node and the <code>Set Max Walk Speed</code> node are both connected to this <code>Sequence</code> node.</p><strong>What do you observe about the connections to the <code>Sequence</code> node that explains the problem?</strong>",
            choices: [
                {
                    text: "<code>Sequence Pin 0</code> connects directly to the <code>Destroy Actor</code> node, while <code>Sequence Pin 1</code> connects to the remainder of the logic, including the <code>Set Max Walk Speed</code> node.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> This is the critical observation. The <code>Sequence</code> node executes its pins in order, from 0 upwards. If <code>Destroy Actor</code> is on Pin 0, it will execute first, terminating the blueprint's execution before Pin 1 (and the speed buff logic) has a chance to run.</p>",
                    next: 'step-4'
                },
                {
                    text: "Both the <code>Destroy Actor</code> node and the <code>Set Max Walk Speed</code> node are connected to <code>Sequence Pin 0</code>, causing a conflict.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> While a conflict on a single pin would be problematic, a <code>Sequence</code> node typically allows only one connection per pin. Re-examine the connections carefully; they are likely split across different pins.</p>",
                    next: 'step-4'
                },
                {
                    text: "The <code>Sequence</code> node is missing a 'Then' pin, indicating it's not properly configured to execute multiple actions.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> A <code>Sequence</code> node inherently has multiple 'Then' pins (Pin 0, Pin 1, etc.) for executing actions in order. If it were missing, it would be a different type of node or a corrupted one, which isn't indicated by the problem description.</p>",
                    next: 'step-4'
                },
                {
                    text: "The <code>Set Max Walk Speed</code> node is connected to the <code>Sequence</code> node via a 'Delay' node, causing it to fire too late.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> While a delay could cause a timing issue, the problem states the node is <em>never reached or executed</em>, not just delayed. There's no mention of a 'Delay' node in the correct steps, indicating this is not the immediate cause.</p>",
                    next: 'step-4'
                },
            ]
        },
        'step-4': {
            skill: 'blueprints',
            title: 'Articulating the Root Cause and Solution',
            prompt: "<p>You've identified that the <code>Sequence</code> node has <code>Destroy Actor</code> connected to <code>Pin 0</code> and the <code>Set Max Walk Speed</code> logic connected to <code>Pin 1</code>.</p><strong>Based on this observation, what is the fundamental problem preventing the buff from being applied, and what is the implied solution?</strong>",
            choices: [
                {
                    text: "The <code>Destroy Actor</code> node executes first (on Pin 0), immediately terminating the blueprint's execution and preventing <code>Pin 1</code> (which contains the <code>Set Max Walk Speed</code> logic) from ever running. The solution is to reorder the pins so the buff application occurs before destruction.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal:</strong> You've correctly identified the core issue. When <code>Destroy Actor</code> executes, it cleans up and removes the actor from the world, halting any further execution within that actor's blueprint. By ensuring the buff application logic runs on Pin 0 and the destruction on Pin 1 (or later), the player will receive the buff before the pickup vanishes.</p>",
                    next: 'conclusion'
                },
                {
                    text: "The <code>Sequence</code> node is designed to execute all its pins simultaneously, but a bug is causing <code>Pin 0</code> to block <code>Pin 1</code>. The solution is to replace the <code>Sequence</code> node with a series of individual execution pins.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> <code>Sequence</code> nodes execute their pins <em>sequentially</em>, not simultaneously. There isn't a bug causing a block; it's the intended behavior of <code>Destroy Actor</code> to terminate the actor's script. Replacing the node is unnecessary; simply reordering the pins is the correct fix.</p>",
                    next: 'conclusion'
                },
                {
                    text: "The <code>Cast To Player Character</code> node is failing intermittently, even though debugging showed it was valid. The solution is to add a 'IsValid' check after the cast.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> The problem description explicitly states the 'Cast To Player Character' event fires successfully and the character reference is valid. This conclusion contradicts the given information and misidentifies the point of failure.</p>",
                    next: 'conclusion'
                },
                {
                    text: "The <code>Set Max Walk Speed</code> node requires a 'Target' input that is not being correctly provided from the <code>Cast To Player Character</code> node, despite the reference being valid.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time:</strong> If the 'Set Max Walk Speed' node were reached, and its 'Target' was invalid, you would likely see an error or a null reference. The issue is that the node is <em>never reached</em>, meaning the execution flow is interrupted <em>before</em> it can even attempt to use the 'Target' input.</p>",
                    next: 'conclusion'
                },
            ]
        },
        'conclusion': {
            skill: 'blueprints',
            title: 'Scenario Complete',
            prompt: "<p>You have successfully identified the root cause of the bug: the <code>Destroy Actor</code> node was executing on <code>Sequence Pin 0</code>, prematurely terminating the blueprint's execution before the <code>Set Max Walk Speed</code> node on <code>Pin 1</code> could be reached. The correct solution is to reorder the execution pins of the <code>Sequence</code> node, ensuring the speed buff is applied before the pickup is destroyed.</p>",
            choices: [
            ]
        },
    }
};
