window.SCENARIOS['WidgetInputFailure'] = {
    meta: {
        title: "Widget Not Receiving Input",
        description: "Terminal UI ignores clicks. Investigates Input Mode Game and UI.",
        estimateHours: 1.5,
        difficulty: "Intermediate"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'ui',
            title: 'Step 1: The Symptom',
            prompt: "When you bring up a terminal interaction widget (UMG) in-game, you can still move the character around, but the widget doesn't react to keyboard input or clicks. Input feels trapped in pure Game mode instead of going to the UI. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You enable input debugging and add prints around where the widget is created. You see the widget is added to the viewport, but the Player Controller never switches input mode and the widget is not given keyboard focus. Input is still going only to the game, not the UI.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You try reparenting the widget and changing some visibility settings, but nothing changes--the terminal UI still ignores your keystrokes and clicks while the character keeps responding. That didn't help.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'ui',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path, assuming it was a widget hierarchy or visibility problem. The widget is clearly on screen, but it still doesn't receive any input.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You revert the unnecessary changes and refocus on how input is routed through the Player Controller--specifically the current Input Mode and focus settings. Back on track.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'ui',
            title: 'Step 2: Investigation',
            prompt: "You inspect the Blueprint where the terminal widget is created and look at how input is configured on the Player Controller. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You find that after creating and adding the terminal widget to the viewport, the Player Controller never calls Set Input Mode Game and UI (or UI Only), and the widget isn't marked Focusable or explicitly given keyboard focus. Input remains in pure Game mode, so all keys go to character movement instead of the terminal widget.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You consider adding extra input actions inside the widget's graph, but since the controller is still in Game Only mode and the widget has no focus, those actions never fire. Plausible, but wrong.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'ui',
            title: 'Dead End: Misguided',
            prompt: "That didn't work because the core problem is that the Player Controller is still routing input to the game world, not the widget. Without the correct Input Mode and focus, the UI will keep being ignored.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the fix is to switch the controller to Set Input Mode Game and UI (or UI Only for a full terminal lock) and ensure the terminal widget is focusable and actually receives focus. Back to the fix.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'ui',
            title: 'Step 3: The Fix',
            prompt: "You know the cause: input is stuck in Game Only and the widget never gets focus. How do you fix it?",
            choices: [
                {
                    text: "Action: [Set Input Mode Game and UI.]",
                    type: 'correct',
                    feedback: "In the Player Controller (or the interaction Blueprint), you call Set Input Mode Game and UI after creating the terminal widget, passing the widget as the In Widget To Focus and disabling mouse lock if needed. You also enable the widget's Focusable flag so it can actually receive keyboard input. You apply the fix and run the game again--the terminal now has focus and can capture input while the widget is open. It works!",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'ui',
            title: 'Step 4: Verification',
            prompt: "With the new input mode and focus settings in place, you need to verify that the terminal widget now receives input correctly. How do you test it in PIE?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, you interact with the terminal to bring up the widget. Character movement stops responding, and your keys and mouse clicks now go to the widget: you can type in fields, press buttons, and navigate UI controls normally. When you close the widget and switch input mode back to Game Only, player controls resume. Validated.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'ui',
            title: 'Conclusion',
            prompt: "Lesson: If a terminal or UI widget doesn't receive input, check the Player Controller's Input Mode and focus. Use Set Input Mode Game and UI (or UI Only) and make the widget Focusable so it can grab keyboard/mouse focus while open, then restore Game Only input when you're done.",
            choices: []
        }
    }
};