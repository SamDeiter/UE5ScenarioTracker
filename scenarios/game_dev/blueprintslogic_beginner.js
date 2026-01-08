window.SCENARIOS['DestroyActorStopsExecutionFlow'] = {
    meta: {
        expanded: true,
        title: "Pickup Despawns Prematurely",
        description: "A speed boost pickup destroys itself before applying the speed buff. Investigates Blueprint execution flow and DestroyActor behavior.",
        estimateHours: 1.5,
        category: "Blueprints"
    },
    start: "step-inv-1",
    steps: {
        'step-1': {
            skill: 'blueprints',
            title: 'The Symptom',
            prompt: "You created a 'Speed Boost' pickup. When the player walks over it, the pickup mesh vanishes (as intended), but the player's speed doesn't change at all. The overlap event seems to fire because the actor disappears, but the gameplay effect is missing. What do you check first?",
            choices: [
                {
                    text: "Debug the Blueprint Graph]",
                    type: 'correct',
                    feedback: "You open the Pickup Blueprint and look at the 'OnComponentBeginOverlap' event. You see a Sequence node splitting the execution flow. You decide to trace what happens when that event fires.",
                    next: 'step-2'
                },
                {
                    text: "Check Collision Settings]",
                    type: 'wrong',
                    feedback: "You check the collision presets. They are set to 'OverlapAllDynamic', and 'Generate Overlap Events' is true. Since the actor *is* disappearing, the overlap event is clearly firing. The issue is in the logic that follows.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'blueprints',
            title: 'Dead End: Collision',
            prompt: "Collision settings look fine. The event is triggering, otherwise the actor wouldn't be destroying itself. The problem is what happens *during* that event.",
            choices: [
                {
                    text: "Revert and Debug Graph]",
                    type: 'correct',
                    feedback: "You return to the Blueprint graph to see the order of operations.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'blueprints',
            title: 'Analyzing Flow',
            prompt: "You look at the Sequence node connected to the Overlap event. \n- **Then 0** connects to a `DestroyActor` node.\n- **Then 1** connects to a `Cast to Character` and `Set Max Walk Speed` node.\n\nWhat is the problem with this setup?",
            choices: [
                {
                    text: "Realize DestroyActor kills execution immediately]",
                    type: 'correct',
                    feedback: "Correct. When `DestroyActor` is called, the actor is marked for destruction. While Unreal *sometimes* finishes the current frame's logic, relying on code execution *after* a destroy call on the same actor is extremely risky and often fails because the actor context becomes invalid or the script execution is halted.",
                    next: 'step-3'
                },
                {
                    text: "Assume Sequence runs in parallel]",
                    type: 'misguided',
                    feedback: "You might think Sequence runs everything at the same time, but it's still sequential. Even so, if the actor is destroyed on Pin 0, it may not exist long enough to execute Pin 1 safely.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'blueprints',
            title: 'Dead End: Sequence Misunderstanding',
            prompt: "You try adding a 'Delay' node on Pin 1 to 'wait' for the destroy to finish, but the logic never runs. The actor is gone before the delay can even start.",
            choices: [
                {
                    text: "Because the actor is already dead]",
                    type: 'correct',
                    feedback: "Exactly. Once `DestroyActor` executes, this instance is effectively dead. You cannot run reliable logic on a dead actor.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'blueprints',
            title: 'The Fix',
            prompt: "You need to ensure the speed buff is applied *before* the actor removes itself from the world. How do you rewire the graph?",
            choices: [
                {
                    text: "Move SetMaxWalkSpeed to happen BEFORE DestroyActor]",
                    type: 'correct',
                    feedback: "You rearrange the nodes so the execution flows: `OnOverlap` -> `Cast to Character` -> `Set Max Walk Speed` -> `DestroyActor`. This guarantees the gameplay effect is applied while the pickup still exists.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'blueprints',
            title: 'Verification',
            prompt: "You've rewired the logic to apply the effect first, then destroy. How do you verify it works?",
            choices: [
                {
                    text: "PIE Test]",
                    type: 'correct',
                    feedback: "You play in editor. You run over the pickup. Your character speeds up immediately, AND the pickup vanishes. The logic now executes in the correct order.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'blueprints',
            title: 'Investigation: Initial Debugging with Print Strings',
            prompt: "The pickup disappears, but the speed buff isn't applied. You suspect the execution flow. What's the quickest way to confirm which parts of your Blueprint are actually running?",
            choices: [
                {
                    text: "Add 'Print String' nodes]",
                    type: 'correct',
                    feedback: "You add 'Print String' nodes: one before `DestroyActor`, one after `DestroyActor` (on the same sequence pin), and one before `Set Max Walk Speed`. You notice the string *after* `DestroyActor` never prints, nor does the one before `Set Max Walk Speed`. This strongly suggests the execution is halted.",
                    next: 'step-inv-2'
                },
                {
                    text: "Check project settings for gameplay effect registration]",
                    type: 'wrong',
                    feedback: "This is a global setting and unlikely to be the cause if the actor is disappearing. The problem is more localized to the pickup's logic. You need to debug the Blueprint directly.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-inv-2': {
            skill: 'blueprints',
            title: 'Investigation: Advanced Debugging with Blueprint Debugger',
            prompt: "The `Print String` nodes confirmed that the logic after `DestroyActor` isn't firing. To get a more precise view of the execution path and variable states, what's the next step?",
            choices: [
                {
                    text: "Use the Blueprint Debugger]",
                    type: 'correct',
                    feedback: "You set a breakpoint on the `OnComponentBeginOverlap` event and step through the execution. You observe the flow hitting `DestroyActor` on 'Then 0' of the Sequence node, and then the execution for that actor instance immediately terminates, never reaching 'Then 1'. This confirms `DestroyActor` is the culprit.",
                    next: 'step-2'
                },
                {
                    text: "Add more 'Print String' nodes with delays]",
                    type: 'misguided',
                    feedback: "While more print strings can help, the Blueprint Debugger offers a much more granular view of execution flow and variable states, which is crucial for understanding why a specific path isn't taken, especially when an actor is being destroyed.",
                    next: 'step-inv-2M'
                },
            ]
        },

        'step-inv-2M': {
            skill: 'blueprints',
            title: 'Dead End: Over-reliance on Print Strings',
            prompt: "You've added more print strings, but they still don't tell you *why* the execution stops. You need to see the actual flow and state changes.",
            choices: [
                {
                    text: "Use the Blueprint Debugger]",
                    type: 'correct',
                    feedback: "You realize the Blueprint Debugger is the right tool for this level of detail, allowing you to step through the code and observe variable states.",
                    next: 'step-2'
                },
            ]
        },

        'step-rh-1': {
            skill: 'gameplay_framework',
            title: 'Red Herring: Gameplay Effect Configuration',
            prompt: "You're still unsure if the problem is the application or the effect itself. You decide to check the 'SpeedBoost_GE' (Gameplay Effect) asset. What are you looking for?",
            choices: [
                {
                    text: "Verify Duration Policy and Modifiers]",
                    type: 'correct',
                    feedback: "You check the Gameplay Effect. It's set to 'Instant' and correctly applies a 'MaxWalkSpeed' modifier. The effect itself seems fine, which points back to the application logic within the pickup's Blueprint.",
                    next: 'step-inv-1'
                },
                {
                    text: "Try applying the effect directly via console command]",
                    type: 'wrong',
                    feedback: "While this would confirm the effect works, it doesn't help diagnose why the pickup isn't applying it. You need to debug the pickup's Blueprint to understand its execution flow.",
                    next: 'step-rh-1W'
                },
            ]
        },

        'step-rh-1W': {
            skill: 'gameplay_framework',
            title: 'Dead End: Bypassing the Problem',
            prompt: "Applying the effect via console confirms it works, but you still don't know why the pickup isn't doing it. You need to investigate the pickup's Blueprint logic.",
            choices: [
                {
                    text: "Return to Blueprint Debugging]",
                    type: 'correct',
                    feedback: "You realize you need to focus on the pickup's logic to find the root cause.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'testing',
            title: 'Verification: Standalone Game Test',
            prompt: "The fix works in PIE. To ensure it's robust and works in a deployed environment, what's the next logical test?",
            choices: [
                {
                    text: "Launch as Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the game as a Standalone Game. The pickup behaves as expected, applying the speed buff and then disappearing. This confirms the fix works outside of the editor's PIE context.",
                    next: 'step-ver-2'
                },
                {
                    text: "Check 'stat unit' for performance impact]",
                    type: 'wrong',
                    feedback: "While performance is always a consideration, changing the order of two simple nodes is unlikely to have a measurable impact. The primary goal here is functional verification in a more realistic environment.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'testing',
            title: 'Dead End: Premature Optimization',
            prompt: "Performance is important, but you haven't even fully verified the functionality yet. Focus on confirming the fix first.",
            choices: [
                {
                    text: "Launch as Standalone Game]",
                    type: 'correct',
                    feedback: "You prioritize functional testing to ensure the core issue is resolved.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'blueprints',
            title: 'Verification: Inspecting Character Speed Variable',
            prompt: "You've confirmed the visual and functional aspects. To be absolutely certain the speed value is correctly updated, how can you inspect the character's `MaxWalkSpeed` variable directly?",
            choices: [
                {
                    text: "Use the Blueprint Debugger or Console Commands]",
                    type: 'correct',
                    feedback: "You can either attach the Blueprint Debugger to your character and inspect its variables, or use console commands like `ce PlayerCharacter MaxWalkSpeed` (if exposed) to confirm the value changes after pickup. Both methods confirm the speed is correctly applied and persists.",
                    next: 'step-ver-1'
                },
            ]
        },
                }
            ]
        },
        








        'conclusion': {
            skill: 'blueprints',
            title: 'Conclusion',
            prompt: "Lesson: `DestroyActor` should almost always be the **last** thing an actor does. Any logic placed after a Destroy node (or on a later Sequence pin) is liable to fail because the actor context is being removed.",
            choices: []
        }
    }
};