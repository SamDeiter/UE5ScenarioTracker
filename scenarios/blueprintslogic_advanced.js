window.SCENARIOS['EventDispatcherRaceCondition'] = {
    meta: {
        title: "Event Dispatcher Race Condition (Advanced)",
        description: "A gameplay event dispatcher fires but the bound event never triggers. Investigates initialization order, object lifetime, garbage collection, and proper event binding patterns in Blueprint systems.",
        estimateHours: 4.0,
        difficulty: "Advanced",
        category: "Blueprints"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'blueprints',
            title: 'Step 1: The Bug Report',
            prompt: "<p><strong>The Gameplay Programmer sends you a message:</strong> \"Hey, I'm trying to use an Event Dispatcher to notify the HUD when the player picks up an item, but the HUD event never fires. I've triple-checked the binding code and it looks correct. Can you take a look?\"</p><p>You open their Blueprint and see they're binding to the dispatcher in the HUD widget's <code>Event Construct</code>, and the Item actor broadcasts the dispatcher in its <code>BeginPlay</code>.</p><strong>What's your first debugging step?</strong>",
            choices: [
                {
                    text: "Action: Add <strong>Print String</strong> nodes around both the <strong>Bind Event</strong> and <strong>Call Dispatcher</strong> to log the execution order.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> The logs reveal the problem: The Item's <code>BeginPlay</code> (which broadcasts the dispatcher) runs at 0.02 seconds, but the HUD widget's <code>Event Construct</code> (which binds to it) doesn't run until 0.15 seconds. The dispatcher fires before anyone is listening!</p>",
                    next: 'step-2'
                },
                {
                    text: "Action: Immediately start rewiring the dispatcher connections and renaming the event.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> You spend 30 minutes reorganizing the Blueprint graph, but the bound event still never fires. The connections look perfect--the problem must be elsewhere.</p>",
                    next: 'step-1W'
                },
                {
                    text: "Action: Check if the dispatcher variable is set to <strong>Instance Editable</strong>.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> The dispatcher is properly configured, but that doesn't explain why the event isn't firing. You need to investigate the timing.</p>",
                    next: 'step-2'
                },
                {
                    text: "Action: Create a completely new Event Dispatcher from scratch.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> You recreate everything, but the new dispatcher has the exact same problem. It's not about the dispatcher itself.</p>",
                    next: 'step-1M'
                }
            ]
        },

        'step-1W': {
            skill: 'blueprints',
            title: 'Dead End: Graph Reorganization',
            prompt: "<p><strong>You show the Gameplay Programmer your reorganized graph:</strong> \"I cleaned up all the connections, but it's still not working.\"</p><p>They respond: \"Yeah, the graph looks fine. I think it's a timing issue--maybe the dispatcher is firing before the HUD is ready?\"</p><strong>What should you investigate?</strong>",
            choices: [
                {
                    text: "Action: Add logging to track when the binding and broadcasting happen.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You add Print Strings with timestamps and discover the timing mismatch.</p>",
                    next: 'step-2'
                },
                {
                    text: "Action: Keep reorganizing the graph in different ways.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> More reorganization doesn't help. You're avoiding the real investigation.</p>",
                    next: 'step-1W'
                }
            ]
        },

        'step-1M': {
            skill: 'blueprints',
            title: 'Dead End: New Dispatcher',
            prompt: "<p><strong>The Gameplay Programmer is confused:</strong> \"Wait, you created a brand new dispatcher and it still doesn't work? That's weird. Maybe it's not the dispatcher itself--maybe it's how we're using it?\"</p><strong>What should you check?</strong>",
            choices: [
                {
                    text: "Action: Investigate the initialization order and timing of the binding vs. broadcasting.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You focus on when things happen, not just how they're wired.</p>",
                    next: 'step-2'
                }
            ]
        },

        'step-2': {
            skill: 'blueprints',
            title: 'Step 2: Understanding the Race Condition',
            prompt: "<p><strong>You explain your findings to the Gameplay Programmer:</strong> \"The Item broadcasts the dispatcher at 0.02 seconds in BeginPlay, but the HUD widget doesn't bind until 0.15 seconds in Event Construct. The event fires before anyone is listening--it's a race condition.\"</p><p>They ask: \"So how do we fix it? Should we delay the broadcast?\"</p><strong>What's your recommendation?</strong>",
            choices: [
                {
                    text: "Action: Explain that adding a delay is a fragile workaround. The proper fix is to ensure the binding happens <strong>before</strong> the first broadcast.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You explain that delays are unreliable (what if the HUD takes longer to load on slower hardware?). The binding should happen in a guaranteed-early location.</p>",
                    next: 'step-3'
                },
                {
                    text: "Action: Add a 0.2 second delay before the dispatcher broadcast.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Fragile Fix):</strong> This works in your test, but the Tech Lead points out: \"What if the HUD takes 0.3 seconds to load on console? This is a time bomb.\"</p>",
                    next: 'step-2W'
                },
                {
                    text: "Action: Move the binding from <code>Event Construct</code> to <code>Event Pre Construct</code>.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> This helps a bit, but Pre Construct still runs after BeginPlay in many cases. You need a more reliable solution.</p>",
                    next: 'step-3'
                }
            ]
        },

        'step-2W': {
            skill: 'blueprints',
            title: 'Dead End: Delay Workaround',
            prompt: "<p><strong>The Tech Lead reviews your code:</strong> \"A hardcoded delay? That's not going to work reliably across different hardware. What if we need to support lower-end machines where widget construction takes longer?\"</p><p>They're right--you need a proper architectural solution.</p><strong>What's the better approach?</strong>",
            choices: [
                {
                    text: "Action: Ensure the binding happens in a guaranteed-early initialization point, before any broadcasts can occur.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You commit to finding a proper initialization order solution.</p>",
                    next: 'step-3'
                }
            ]
        },

        'step-3': {
            skill: 'blueprints',
            title: 'Step 3: Finding the Right Binding Location',
            prompt: "<p><strong>You discuss architecture with the Tech Lead:</strong> \"Where should we bind to the dispatcher to guarantee it happens before any Item can broadcast?\"</p><p>They suggest: \"What about the GameMode or PlayerController? Those are created very early in the level initialization.\"</p><strong>What do you decide?</strong>",
            choices: [
                {
                    text: "Action: Move the binding to the <strong>GameMode's BeginPlay</strong>, which runs before any actors spawn.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> The GameMode is perfect--it's created first and persists for the entire level. You move the binding logic there.</p>",
                    next: 'step-4'
                },
                {
                    text: "Action: Keep it in the HUD widget but add a <code>IsValid</code> check before broadcasting.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> The IsValid check doesn't solve the timing problem--the broadcast still happens before the binding.</p>",
                    next: 'step-3W'
                },
                {
                    text: "Action: Create a custom <strong>Event Tick</strong> loop that checks if the HUD is ready before broadcasting.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> This is overly complex and wasteful (Tick every frame?). There's a cleaner architectural solution.</p>",
                    next: 'step-3M'
                }
            ]
        },

        'step-3W': {
            skill: 'blueprints',
            title: 'Dead End: IsValid Check',
            prompt: "<p><strong>The Gameplay Programmer tests your change:</strong> \"The IsValid check prevents crashes, but the event still doesn't fire. The timing issue is still there.\"</p><strong>What's the real solution?</strong>",
            choices: [
                {
                    text: "Action: Move the binding to an earlier initialization point like GameMode.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You address the root cause: initialization order.</p>",
                    next: 'step-4'
                }
            ]
        },

        'step-3M': {
            skill: 'blueprints',
            title: 'Dead End: Tick Loop',
            prompt: "<p><strong>The Tech Lead sees your Tick implementation:</strong> \"Why are you checking this every frame? That's incredibly wasteful. Just bind it once in the right place during initialization.\"</p><strong>What's the proper approach?</strong>",
            choices: [
                {
                    text: "Action: Remove the Tick loop and bind in GameMode's BeginPlay.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You implement the clean, efficient solution.</p>",
                    next: 'step-4'
                }
            ]
        },

        'step-4': {
            skill: 'blueprints',
            title: 'Step 4: Implementing the Fix',
            prompt: "<p><strong>You're ready to implement:</strong> You move the <code>Bind Event to Dispatcher</code> logic from the HUD widget's Event Construct to the GameMode's BeginPlay.</p><p>But now you realize: the HUD widget doesn't exist yet in GameMode's BeginPlay!</p><strong>How do you handle this?</strong>",
            choices: [
                {
                    text: "Action: Create the HUD widget in GameMode's BeginPlay, <strong>store it as a variable</strong>, then bind to the dispatcher.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You create the HUD widget, store it in a UPROPERTY variable (so it doesn't get garbage collected), and then bind its event to the dispatcher. Perfect!</p>",
                    next: 'step-5'
                },
                {
                    text: "Action: Create the widget but don't store it in a variable.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Garbage Collection):</strong> The widget gets garbage collected immediately because there's no reference to it. The binding fails.</p>",
                    next: 'step-4W'
                },
                {
                    text: "Action: Use <code>Get Player Controller</code> and cast to get the HUD from there.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> This works, but it's more fragile. Storing the widget directly in GameMode is cleaner and more explicit.</p>",
                    next: 'step-5'
                }
            ]
        },

        'step-4W': {
            skill: 'blueprints',
            title: 'Dead End: Garbage Collection',
            prompt: "<p><strong>The Gameplay Programmer is confused:</strong> \"I created the widget and bound to it, but the event still doesn't fire. What's happening?\"</p><p>You check the logs and see: <code>Warning: Attempted to bind to a garbage collected object</code>.</p><strong>What went wrong?</strong>",
            choices: [
                {
                    text: "Action: Store the widget in a <strong>UPROPERTY variable</strong> to prevent garbage collection.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You explain that without a stored reference, the widget is immediately garbage collected. You add a variable to hold it.</p>",
                    next: 'step-5'
                }
            ]
        },

        'step-5': {
            skill: 'blueprints',
            title: 'Step 5: Testing the Fix',
            prompt: "<p><strong>You've implemented the fix:</strong> The HUD widget is created and stored in GameMode's BeginPlay, and the dispatcher binding happens immediately after.</p><p>Time to test!</p><strong>How do you verify it works?</strong>",
            choices: [
                {
                    text: "Action: Add <strong>Print Strings</strong> to log: 1) Widget creation, 2) Binding, 3) Dispatcher broadcast, and verify the order in PIE.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> The logs show: Widget created (0.01s) → Binding complete (0.01s) → Item BeginPlay broadcasts dispatcher (0.02s) → HUD event fires (0.02s). Perfect sequence!</p>",
                    next: 'step-6'
                },
                {
                    text: "Action: Just run PIE and assume it works if you don't see errors.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Without logging, you can't confirm the timing is correct. Always verify with explicit logging.</p>",
                    next: 'step-5W'
                }
            ]
        },

        'step-5W': {
            skill: 'blueprints',
            title: 'Dead End: No Verification',
            prompt: "<p><strong>The Tech Lead asks:</strong> \"Did you verify the initialization order with logging? I want to see proof that the binding happens before the broadcast.\"</p><strong>What should you do?</strong>",
            choices: [
                {
                    text: "Action: Add Print Strings to log the execution order and timestamps.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You add proper logging and verify the sequence.</p>",
                    next: 'step-6'
                }
            ]
        },

        'step-6': {
            skill: 'blueprints',
            title: 'Step 6: Edge Case Testing',
            prompt: "<p><strong>The Gameplay Programmer is happy:</strong> \"It works! But what if the player picks up multiple items quickly? Will the dispatcher handle that?\"</p><p>Good question--you need to test rapid-fire events.</p><strong>How do you test this?</strong>",
            choices: [
                {
                    text: "Action: Spawn multiple items in quick succession and verify each broadcast triggers the HUD event.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You spawn 10 items with 0.1 second delays. All 10 dispatcher broadcasts successfully trigger the HUD event. The binding is stable!</p>",
                    next: 'step-7'
                },
                {
                    text: "Action: Skip edge case testing and ship it.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Later, QA reports that picking up items rapidly causes the HUD to miss updates. You should have tested this.</p>",
                    next: 'step-6W'
                }
            ]
        },

        'step-6W': {
            skill: 'blueprints',
            title: 'Dead End: QA Bug Report',
            prompt: "<p><strong>QA files a bug:</strong> \"When picking up items rapidly, the HUD sometimes doesn't update. Repro rate: 30%.\"</p><p>You should have tested edge cases earlier.</p><strong>What do you do now?</strong>",
            choices: [
                {
                    text: "Action: Test rapid item pickups and investigate any missed events.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You test and find the issue (if any), or confirm it works correctly.</p>",
                    next: 'step-7'
                }
            ]
        },

        'step-7': {
            skill: 'blueprints',
            title: 'Step 7: Documentation',
            prompt: "<p><strong>The Tech Lead suggests:</strong> \"This was a tricky bug. Can you document the solution so other programmers don't make the same mistake?\"</p><strong>What should you document?</strong>",
            choices: [
                {
                    text: "Action: Write a code comment explaining: 1) Why binding happens in GameMode, 2) Why the widget must be stored in a variable, 3) The initialization order requirement.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You add clear comments in the GameMode Blueprint explaining the pattern and the reasoning. Future developers will thank you!</p>",
                    next: 'conclusion'
                },
                {
                    text: "Action: Skip documentation--the code is self-explanatory.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> The code works, but without comments, the next developer might not understand why it's structured this way and could break it.</p>",
                    next: 'conclusion'
                }
            ]
        },

        'conclusion': {
            skill: 'blueprints',
            title: 'Conclusion',
            prompt: "<p><strong>Lessons Learned:</strong></p><ul><li><strong>Event Dispatchers depend on initialization order:</strong> The binding must happen before the first broadcast, or the event will be missed.</li><li><strong>Use persistent objects for binding:</strong> Bind from GameMode, PlayerController, or other guaranteed-early objects, not from widgets that may not exist yet.</li><li><strong>Store widget references:</strong> Widgets must be stored in UPROPERTY variables to prevent garbage collection.</li><li><strong>Always log and verify:</strong> Use Print Strings to confirm the execution order during debugging.</li><li><strong>Test edge cases:</strong> Rapid-fire events can reveal timing issues that single tests miss.</li><li><strong>Document tricky patterns:</strong> Help future developers understand why the code is structured a certain way.</li></ul><p><strong>The Gameplay Programmer thanks you:</strong> \"Thanks for the help! I learned a lot about Blueprint initialization order from this.\"</p>",
            choices: []
        }
    }
};