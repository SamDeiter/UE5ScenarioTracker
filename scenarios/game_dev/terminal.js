window.SCENARIOS['WidgetInputFailure'] = {
    meta: {
        expanded: true,
        title: "Widget Not Receiving Input",
        description: "Terminal UI ignores clicks. Investigates Input Mode Game and UI.",
        estimateHours: 1.5,
        difficulty: "Intermediate",
        category: "UI"
    },
    start: "step-A1",
    steps: {
        'step-1': {
            skill: 'ui',
            title: 'The Symptom',
            prompt: "When you bring up a terminal interaction widget (UMG) in-game, you can still move the character around, but the widget doesn't react to keyboard input or clicks. Input feels trapped in pure Game mode instead of going to the UI. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You enable input debugging and add prints around where the widget is created. You see the widget is added to the viewport, but the Player Controller never switches input mode and the widget is not given keyboard focus. Input is still going only to the game, not the UI.",
                    next: 'step-RH1'
                },
                {
                    text: "Wrong Guess]",
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
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You revert the unnecessary changes and refocus on how input is routed through the Player Controller--specifically the current Input Mode and focus settings. Back on track.",
                    next: 'step-RH1'
                }
            ]
        },
        'step-2': {
            skill: 'ui',
            title: 'Investigation',
            prompt: "You inspect the Blueprint where the terminal widget is created and look at how input is configured on the Player Controller. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You find that after creating and adding the terminal widget to the viewport, the Player Controller never calls Set Input Mode Game and UI (or UI Only), and the widget isn't marked Focusable or explicitly given keyboard focus. Input remains in pure Game mode, so all keys go to character movement instead of the terminal widget.",
                    next: 'step-3'
                },
                {
                    text: "Misguided Attempt]",
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
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the fix is to switch the controller to Set Input Mode Game and UI (or UI Only for a full terminal lock) and ensure the terminal widget is focusable and actually receives focus. Back to the fix.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'ui',
            title: 'The Fix',
            prompt: "You know the cause: input is stuck in Game Only and the widget never gets focus. How do you fix it?",
            choices: [
                {
                    text: "Set Input Mode Game and UI.]",
                    type: 'correct',
                    feedback: "In the Player Controller (or the interaction Blueprint), you call Set Input Mode Game and UI after creating the terminal widget, passing the widget as the In Widget To Focus and disabling mouse lock if needed. You also enable the widget's Focusable flag so it can actually receive keyboard input. You apply the fix and run the game again--the terminal now has focus and can capture input while the widget is open. It works!",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'ui',
            title: 'Verification',
            prompt: "With the new input mode and focus settings in place, you need to verify that the terminal widget now receives input correctly. How do you test it in PIE?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, you interact with the terminal to bring up the widget. Character movement stops responding, and your keys and mouse clicks now go to the widget: you can type in fields, press buttons, and navigate UI controls normally. When you close the widget and switch input mode back to Game Only, player controls resume. Validated.",
                    next: 'step-A1'
                }
            ]
        },
        'step-A1': {
            skill: 'console',
            title: 'Initial Input Visualization',
            prompt: "Before diving into Blueprints, you want a real-time view of where input is being consumed. What console command helps visualize input routing and focus targets?",
            choices: [
                {
                    text: "Execute ShowDebug Input]",
                    type: 'correct',
                    feedback: "Executing `ShowDebug Input` confirms that the Player Controller is successfully receiving input events, but the 'Input Mode' is listed as 'Game Only', and the UMG widget is not listed as having keyboard focus. This confirms the routing issue.",
                    next: 'step-A1'
                },
                {
                    text: "Execute Stat Input]",
                    type: 'wrong',
                    feedback: "`Stat Input` shows performance metrics related to input processing, but it doesn't visualize the routing or focus state. This doesn't help diagnose why the widget is ignored.",
                    next: 'step-A1W'
                },
            ]
        },

        'step-A1W': {
            skill: 'console',
            title: 'Dead End: Wrong Console Command',
            prompt: "You used the wrong console command. You need a tool that shows input consumption and focus targets, not just performance metrics.",
            choices: [
                {
                    text: "Revert and use ShowDebug Input]",
                    type: 'correct',
                    feedback: "You revert and use the correct diagnostic tool to confirm the input routing issue.",
                    next: 'step-A1'
                },
            ]
        },

        'step-RH1': {
            skill: 'ui',
            title: 'Red Herring: Z-Order and Visibility',
            prompt: "You suspect the widget might be visually obscured or its Z-Order is too low, preventing mouse clicks from registering, even though the input mode is the primary suspect. You check the widget's Z-Order when added to the viewport.",
            choices: [
                {
                    text: "Confirm Z-Order is high (e.g., 10)]",
                    type: 'correct',
                    feedback: "You confirm the Z-Order is high, ruling out rendering order or visual occlusion as the cause of the input failure. The problem remains the Player Controller's input routing configuration.",
                    next: 'step-RH1'
                },
                {
                    text: "Try setting Visibility to Self Hit Test Invisible]",
                    type: 'wrong',
                    feedback: "Setting the widget to 'Self Hit Test Invisible' means it will ignore input entirely. This makes the problem worse!",
                    next: 'step-RH1W'
                },
            ]
        },

        'step-RH1W': {
            skill: 'ui',
            title: 'Dead End: Making it Worse',
            prompt: "You accidentally told the widget to ignore input. You must revert this change and focus on the Player Controller settings.",
            choices: [
                {
                    text: "Revert and refocus on input mode]",
                    type: 'correct',
                    feedback: "You revert the visibility change and return to investigating the Player Controller's input mode and focus settings.",
                    next: 'step-RH1'
                },
            ]
        },

        'step-V1': {
            skill: 'testing',
            title: 'Verification: Standalone Game Test',
            prompt: "PIE testing is complete, but sometimes input handling differs slightly in packaged or standalone builds, especially regarding mouse capture. How do you perform the final verification to ensure robustness?",
            choices: [
                {
                    text: "Launch the game in Standalone Mode]",
                    type: 'correct',
                    feedback: "The terminal works perfectly in Standalone mode, confirming the fix is robust across different execution environments and that the mouse cursor is correctly captured by the UI.",
                    next: 'step-V2'
                },
            ]
        },

        'step-V2': {
            skill: 'optimization',
            title: 'Verification: Performance Overhead Check',
            prompt: "Switching input modes, showing the mouse cursor, and capturing focus can sometimes introduce minor hitches or performance overhead. What console command do you use to quickly check the frame time and game thread performance during the input mode switch?",
            choices: [
                {
                    text: "Use the console command stat unit]",
                    type: 'correct',
                    feedback: "You observe the frame time before, during, and after the switch. The switch is instantaneous and causes no noticeable spike in Game or Draw time. Final validation complete.",
                    next: 'conclusion'
                },
            ]
        },
                }
            ]
        },
        
        'step-A1': {
            skill: 'console',
            title: 'Initial Input Visualization',
            prompt: "Before diving into Blueprints, you want a real-time view of where input is being consumed. What console command helps visualize input routing and focus targets?",
            choices: [
                {
                    text: "Execute ShowDebug Input]",
                    type: 'correct',
                    feedback: "Executing `ShowDebug Input` confirms that the Player Controller is successfully receiving input events, but the 'Input Mode' is listed as 'Game Only', and the UMG widget is not listed as having keyboard focus. This confirms the routing issue.",
                    next: 'step-A1'
                },
                {
                    text: "Execute Stat Input]",
                    type: 'wrong',
                    feedback: "`Stat Input` shows performance metrics related to input processing, but it doesn't visualize the routing or focus state. This doesn't help diagnose why the widget is ignored.",
                    next: 'step-A1W'
                },
            ]
        },

        'step-A1W': {
            skill: 'console',
            title: 'Dead End: Wrong Console Command',
            prompt: "You used the wrong console command. You need a tool that shows input consumption and focus targets, not just performance metrics.",
            choices: [
                {
                    text: "Revert and use ShowDebug Input]",
                    type: 'correct',
                    feedback: "You revert and use the correct diagnostic tool to confirm the input routing issue.",
                    next: 'step-A1'
                },
            ]
        },

        'step-RH1': {
            skill: 'ui',
            title: 'Red Herring: Z-Order and Visibility',
            prompt: "You suspect the widget might be visually obscured or its Z-Order is too low, preventing mouse clicks from registering, even though the input mode is the primary suspect. You check the widget's Z-Order when added to the viewport.",
            choices: [
                {
                    text: "Confirm Z-Order is high (e.g., 10)]",
                    type: 'correct',
                    feedback: "You confirm the Z-Order is high, ruling out rendering order or visual occlusion as the cause of the input failure. The problem remains the Player Controller's input routing configuration.",
                    next: 'step-RH1'
                },
                {
                    text: "Try setting Visibility to Self Hit Test Invisible]",
                    type: 'wrong',
                    feedback: "Setting the widget to 'Self Hit Test Invisible' means it will ignore input entirely. This makes the problem worse!",
                    next: 'step-RH1W'
                },
            ]
        },

        'step-RH1W': {
            skill: 'ui',
            title: 'Dead End: Making it Worse',
            prompt: "You accidentally told the widget to ignore input. You must revert this change and focus on the Player Controller settings.",
            choices: [
                {
                    text: "Revert and refocus on input mode]",
                    type: 'correct',
                    feedback: "You revert the visibility change and return to investigating the Player Controller's input mode and focus settings.",
                    next: 'step-RH1'
                },
            ]
        },

        'step-V1': {
            skill: 'testing',
            title: 'Verification: Standalone Game Test',
            prompt: "PIE testing is complete, but sometimes input handling differs slightly in packaged or standalone builds, especially regarding mouse capture. How do you perform the final verification to ensure robustness?",
            choices: [
                {
                    text: "Launch the game in Standalone Mode]",
                    type: 'correct',
                    feedback: "The terminal works perfectly in Standalone mode, confirming the fix is robust across different execution environments and that the mouse cursor is correctly captured by the UI.",
                    next: 'step-V2'
                },
            ]
        },

        'step-V2': {
            skill: 'optimization',
            title: 'Verification: Performance Overhead Check',
            prompt: "Switching input modes, showing the mouse cursor, and capturing focus can sometimes introduce minor hitches or performance overhead. What console command do you use to quickly check the frame time and game thread performance during the input mode switch?",
            choices: [
                {
                    text: "Use the console command stat unit]",
                    type: 'correct',
                    feedback: "You observe the frame time before, during, and after the switch. The switch is instantaneous and causes no noticeable spike in Game or Draw time. Final validation complete.",
                    next: 'conclusion'
                },
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