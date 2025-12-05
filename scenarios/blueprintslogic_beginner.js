window.SCENARIOS['DestroyActorStopsExecutionFlow'] = {
    meta: {
        title: "Pickup Despawns Prematurely",
        description: "A speed boost pickup destroys itself before applying the speed buff. Investigates Blueprint execution flow and DestroyActor behavior.",
        estimateHours: 1.5,
        category: "Blueprints"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'blueprints',
            title: 'Step 1: The Symptom',
            prompt: "You created a 'Speed Boost' pickup. When the player walks over it, the pickup mesh vanishes (as intended), but the player's speed doesn't change at all. The overlap event seems to fire because the actor disappears, but the gameplay effect is missing. What do you check first?",
            choices: [
                {
                    text: "Action: [Debug the Blueprint Graph]",
                    type: 'correct',
                    feedback: "You open the Pickup Blueprint and look at the 'OnComponentBeginOverlap' event. You see a Sequence node splitting the execution flow. You decide to trace what happens when that event fires.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Check Collision Settings]",
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
                    text: "Action: [Revert and Debug Graph]",
                    type: 'correct',
                    feedback: "You return to the Blueprint graph to see the order of operations.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'blueprints',
            title: 'Step 2: Analyzing Flow',
            prompt: "You look at the Sequence node connected to the Overlap event. \n- **Then 0** connects to a `DestroyActor` node.\n- **Then 1** connects to a `Cast to Character` and `Set Max Walk Speed` node.\n\nWhat is the problem with this setup?",
            choices: [
                {
                    text: "Action: [Realize DestroyActor kills execution immediately]",
                    type: 'correct',
                    feedback: "Correct. When `DestroyActor` is called, the actor is marked for destruction. While Unreal *sometimes* finishes the current frame's logic, relying on code execution *after* a destroy call on the same actor is extremely risky and often fails because the actor context becomes invalid or the script execution is halted.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Assume Sequence runs in parallel]",
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
                    text: "Action: [Because the actor is already dead]",
                    type: 'correct',
                    feedback: "Exactly. Once `DestroyActor` executes, this instance is effectively dead. You cannot run reliable logic on a dead actor.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'blueprints',
            title: 'Step 3: The Fix',
            prompt: "You need to ensure the speed buff is applied *before* the actor removes itself from the world. How do you rewire the graph?",
            choices: [
                {
                    text: "Action: [Move SetMaxWalkSpeed to happen BEFORE DestroyActor]",
                    type: 'correct',
                    feedback: "You rearrange the nodes so the execution flows: `OnOverlap` -> `Cast to Character` -> `Set Max Walk Speed` -> `DestroyActor`. This guarantees the gameplay effect is applied while the pickup still exists.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'blueprints',
            title: 'Step 4: Verification',
            prompt: "You've rewired the logic to apply the effect first, then destroy. How do you verify it works?",
            choices: [
                {
                    text: "Action: [PIE Test]",
                    type: 'correct',
                    feedback: "You play in editor. You run over the pickup. Your character speeds up immediately, AND the pickup vanishes. The logic now executes in the correct order.",
                    next: 'conclusion'
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