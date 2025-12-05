window.SCENARIOS['EditorFreezeLoop'] = {
    meta: {
        title: "Editor Freeze on Loop",
        description: "While Loop crashes editor. Investigates infinite loop conditions.",
        estimateHours: 1.5
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'blueprints',
            title: 'Step 1: The Symptom',
            prompt: "Every time you run the Blueprint, the editor hangs or outright crashes as soon as a While Loop executes. Infinite loop is your prime suspect. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You add debug prints before and after the While Loop and enable Blueprint debugging. The \"before\" print fires, but the \"after\" print never appears. The execution pin is clearly getting stuck in the While Loop, which strongly suggests the loop condition never becomes false.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You try lowering graphics settings and closing background apps, but the editor still freezes the instant the While Loop runs. This has nothing to do with performance or GPU load--the logic is locking the game thread.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'blueprints',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path, treating the freeze like a performance problem instead of a logic bug. The editor still hard-locks whenever the While Loop executes.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the pointless performance tweaks and go back to inspecting the While Loop itself--its condition and what changes inside the loop body.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'blueprints',
            title: 'Step 2: Investigation',
            prompt: "You open the Blueprint and look closely at the While Loop node: its condition pin, and any variables modified inside the loop. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the loop condition depends on a variable that never changes inside the loop body. The While Loop starts with the condition true and nothing ever decrements, increments, or flips that value, so the condition never becomes false. The loop spins forever--an infinite loop that freezes the editor.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You consider adding delays or moving the loop to another Blueprint, but neither idea fixes the fact that the condition itself never changes. You'd just be moving a bad loop around instead of correcting its logic.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'blueprints',
            title: 'Dead End: Misguided',
            prompt: "Those ideas didn't work because the loop condition is still stuck true forever. As long as nothing inside the loop moves the condition toward false, the While Loop will always hang the game thread.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the only real fix is to change the loop logic: add an increment/decrement or a proper break condition so the loop can actually terminate.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'blueprints',
            title: 'Step 3: The Fix',
            prompt: "You know the cause: the While Loop's condition never changes, so it runs forever. How do you fix it?",
            choices: [
                {
                    text: "Action: [Add break condition or incrementer.]",
                    type: 'correct',
                    feedback: "You introduce a loop counter (or update the variable used in the condition) inside the loop body, ensuring that each iteration moves the condition closer to false. You also add a safety branch to break out if something goes wrong. After updating the logic, the While Loop now has a guaranteed exit.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'blueprints',
            title: 'Step 4: Verification',
            prompt: "With the new increment/decrement or break logic added, you need to confirm the loop no longer freezes the editor. How do you verify the fix?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "You run the Blueprint again in PIE. This time, the While Loop executes, your debug prints before and after both fire, and the editor stays responsive. The loop finishes in a few iterations instead of locking up, confirming the fix worked.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'blueprints',
            title: 'Conclusion',
            prompt: "Lesson: If a While Loop freezes the editor, check whether its condition ever changes. Always add a counter, state change, or explicit Break node inside the loop body so the condition can become false and the loop can terminate. Never rely on a While Loop that doesn't move toward an exit.",
            choices: []
        }
    }
};