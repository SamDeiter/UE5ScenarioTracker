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
                },
                {
                    text: "Spend time rearranging nodes and adding reroute nodes so the Blueprint graph looks cleaner.",
                    type: 'wrong',
                    feedback: "<p>You tidy up the graph and it's definitely easier on the eyes, but nothing changes at runtime. The dispatcher still sometimes fails to fire because you haven't touched initialization or binding order at all.</p>",
                    next: 'step-1W'
                },
                {
                    text: "Group related nodes into comment boxes and rename them, assuming this will reveal the bug.",
                    type: 'misguided',
                    feedback: "<p>You improve organization with comments and clearer labels, which helps future readability but doesn't fix the underlying logic. The race condition remains, and events are still occasionally missed.</p>",
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
                },
                {
                    text: "Create a second dispatcher and broadcast from both, hoping one of them will always catch the event.",
                    type: 'wrong',
                    feedback: "<p>You duplicate the dispatcher and wire up extra broadcasts. The graph becomes more confusing and you still see intermittent failures. You've increased complexity without fixing the real timing issue.</p>",
                    next: 'step-1M'
                },
                {
                    text: "Move the existing dispatcher into a different Blueprint class without changing when it's bound.",
                    type: 'misguided',
                    feedback: "<p>You relocate the dispatcher to another class, thinking architecture is the problem. At runtime the behavior is unchanged: the event sometimes fires before anything has bound to it. The core issue is still the binding timing.</p>",
                    next: 'step-1M'
                },
                {
                    text: "Add detailed log messages around both the bind and broadcast calls to see which happens first.",
                    type: 'partial',
                    feedback: "<p>You sprinkle Print Strings or logging nodes around the dispatcher calls and run the game. The logs clearly show the broadcast occasionally happening before the bind. You now have solid evidence that this is an initialization order problem.</p>",
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
                },
                {
                    text: "Map out a simple timeline of when the dispatcher is bound versus when it is broadcast during startup.",
                    type: 'correct',
                    feedback: "<p>You sketch or mentally trace the startup order and realize the broadcast can fire while the listener is still uninitialized. This confirms the failure is a race condition tied to initialization. You're now ready to explore how to fix the ordering.</p>",
                    next: 'step-2W'
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
                },
                {
                    text: "Insert a Delay node before broadcasting, hoping it gives listeners time to bind.",
                    type: 'misguided',
                    feedback: "<p>You add a Delay and it appears to work in some cases, but fails in others depending on frame rate and load. The fix feels fragile and you know you're just papering over a timing issue with a magic number.</p>",
                    next: 'step-2W'
                },
                {
                    text: "Increase the Delay duration further until the issue rarely reproduces.",
                    type: 'wrong',
                    feedback: "<p>You keep increasing the Delay until the bug seems to disappear, but now your game feels sluggish and you've introduced unnecessary latency. The underlying problem is still there, only harder to spot.</p>",
                    next: 'step-2W'
                },
                {
                    text: "Bind the listener in an earlier, guaranteed initialization phase instead of relying on a Delay.",
                    type: 'partial',
                    feedback: "<p>You move the binding to an earlier point in the lifecycle so it's ready before the broadcast. This behaves much more consistently and removes the need for arbitrary delays, pushing you toward a proper initialization order fix.</p>",
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
                },
                {
                    text: "Choose an authoritative class, such as GameMode or a central manager, to own the dispatcher binding.",
                    type: 'correct',
                    feedback: "<p>You move the binding into a class that's guaranteed to exist early and consistently, like GameMode. The dispatcher now has a reliable place to set up, which greatly reduces the chance of missing events due to order-of-creation quirks.</p>",
                    next: 'step-4'
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
                },
                {
                    text: "Wrap the dispatcher broadcast in an IsValid check on the listener and do nothing if it isn't valid.",
                    type: 'misguided',
                    feedback: "<p>You add an IsValid guard to avoid errors, but when the listener isn't ready the event is just dropped silently. The bug becomes harder to notice, and players simply don't get the expected behavior.</p>",
                    next: 'step-3W'
                },
                {
                    text: "Add an IsValid check around the listener and reattempt the broadcast every Tick until it succeeds.",
                    type: 'wrong',
                    feedback: "<p>You build a Tick-based retry loop gated by IsValid, which quickly becomes noisy and inefficient. It may eventually work, but you've created a messy workaround instead of fixing the setup timing.</p>",
                    next: 'step-3W'
                },
                {
                    text: "Log a warning whenever the listener is invalid, but otherwise leave the logic unchanged.",
                    type: 'partial',
                    feedback: "<p>You at least get visibility when the listener isn't ready, but you still lose those early events. The logs confirm the problem without actually resolving it, nudging you back toward addressing initialization order.</p>",
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
                },
                {
                    text: "Use Tick to constantly check if the listener exists, binding to the dispatcher the moment it becomes valid.",
                    type: 'misguided',
                    feedback: "<p>You wire up Tick to poll for a valid listener and bind when it appears. It works, but you've added per-frame overhead and made the binding logic harder to follow. It's a workaround, not a clean solution.</p>",
                    next: 'step-3M'
                },
                {
                    text: "Keep the Tick loop but add a Delay inside it to reduce how often it checks for the listener.",
                    type: 'wrong',
                    feedback: "<p>You try to throttle the Tick-based polling with a Delay, making the flow even more convoluted. Now timing depends on both the frame loop and arbitrary delays, increasing the risk of missed or late bindings.</p>",
                    next: 'step-3M'
                },
                {
                    text: "Refactor the binding into GameMode's BeginPlay so it happens once in a predictable place.",
                    type: 'partial',
                    feedback: "<p>You move away from Tick and into GameMode's BeginPlay, which fires once and early. The dispatcher binding now has a deterministic location, greatly simplifying the logic and bringing you closer to the intended fix.</p>",
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
                },
                {
                    text: "Compile the Blueprint changes, then run the game to ensure the dispatcher now always has a bound listener before broadcast.",
                    type: 'correct',
                    feedback: "<p>You compile, launch the game, and repeatedly trigger the event. The dispatcher now fires reliably with a listener always in place. This confirms your initialization order changes are working as intended.</p>",
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
                },
                {
                    text: "Rely on local variables or temporary references to hold the widget instead of a UPROPERTY field.",
                    type: 'misguided',
                    feedback: "<p>You stash the widget in a local variable, which works briefly, but it's not tracked for garbage collection. After a few frames, the widget can still be destroyed, leading to intermittent null references.</p>",
                    next: 'step-4W'
                },
                {
                    text: "Disable garbage collection for the widget Blueprint class in the hope it will never be destroyed.",
                    type: 'wrong',
                    feedback: "<p>You try to fight the engine's memory management instead of working with it. This approach is brittle and can lead to leaks or undefined behavior. The underlying issue is still that no owning UPROPERTY is holding a reference.</p>",
                    next: 'step-4W'
                },
                {
                    text: "Store the widget in a member variable on the owning HUD or PlayerController Blueprint.",
                    type: 'partial',
                    feedback: "<p>You add a member variable and assign the widget to it, effectively giving GC a strong reference to track. The widget now persists correctly, and you understand why an owning reference is necessary for UI elements.</p>",
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
                },
                {
                    text: "Play through the scenario multiple times and confirm the dispatcher-driven UI updates consistently.",
                    type: 'correct',
                    feedback: "<p>You run several test passes, triggering the dispatcher under different conditions. The UI responds correctly every time, indicating that the binding, lifetime, and logic are all behaving as expected.</p>",
                    next: 'step-6'
                },
                {
                    text: "Run a single quick test and assume everything is fine after the first successful attempt.",
                    type: 'partial',
                    feedback: "<p>The first run looks good, but you haven't proven the fix across different flows or edge cases. It could still fail under load or in unusual sequences. You know you should add more thorough verification.</p>",
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
                },
                {
                    text: "Rely solely on visual feedback from the UI without adding any logging or instrumentation.",
                    type: 'misguided',
                    feedback: "<p>You watch the UI during play but have no logs to tell you what the dispatcher is doing behind the scenes. When something feels off, you have little data to go on, making it hard to reproduce or diagnose subtle timing issues.</p>",
                    next: 'step-5W'
                },
                {
                    text: "Assume QA will catch any remaining ordering issues and move on to a different task.",
                    type: 'wrong',
                    feedback: "<p>You hand the build off and hope for the best. When QA reports intermittent missing UI updates, you're back at square one and have to re-open the Blueprint to add the diagnostics you skipped earlier.</p>",
                    next: 'step-5W'
                },
                {
                    text: "Add Print Strings that show when the listener binds and when the dispatcher broadcasts, including timestamps.",
                    type: 'partial',
                    feedback: "<p>You finally add detailed logging that shows the exact sequence of binds and broadcasts. This gives you clear evidence that the execution order is correct now, or pinpoints any remaining gaps, letting you move forward with confidence.</p>",
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
                },
                {
                    text: "Stress-test edge cases like rapid item pickups, level transitions, and player respawns.",
                    type: 'correct',
                    feedback: "<p>You hammer on the system with edge cases and confirm the dispatcher remains reliable. Even under rapid interactions and transitions, the events fire and the UI updates as expected. The fix holds up under pressure.</p>",
                    next: 'step-7'
                },
                {
                    text: "Assume that if it works in the main happy path, edge cases will be fine too.",
                    type: 'partial',
                    feedback: "<p>You only check the straightforward flow, which looks good, but you haven't proven robustness. Any unusual player behavior or timing could still reveal issues, so you're leaving risk on the table.</p>",
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
                },
                {
                    text: "Log a QA bug that the dispatcher is 'sometimes unreliable' without attaching reproduction steps.",
                    type: 'wrong',
                    feedback: "<p>You file a vague bug and move on, pushing the problem onto QA. Without solid repro steps or technical notes, the issue bounces back to you later, wasting more time.</p>",
                    next: 'step-6W'
                },
                {
                    text: "Ask QA for detailed repro cases, then actively test and instrument those scenarios yourself.",
                    type: 'partial',
                    feedback: "<p>You collaborate with QA, gathering specific sequences where events might be missed. Running those with your instrumentation either confirms the fix or exposes remaining gaps, making your testing much more targeted.</p>",
                    next: 'step-7'
                },
                {
                    text: "Ignore the QA report because you can't reproduce the issue locally.",
                    type: 'misguided',
                    feedback: "<p>You dismiss the bug since it doesn't show up on your machine. This leaves a lurking issue in the build and undermines trust between engineering and QA until it inevitably resurfaces.</p>",
                    next: 'step-6W'
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
                },
                {
                    text: "Write a brief internal doc explaining the dispatcher race condition, the fix, and recommended patterns.",
                    type: 'correct',
                    feedback: "<p>You capture the root cause, the reasoning behind your fix, and best practices for initialization order. Future team members can avoid repeating the same mistake, and your own notes will help you months from now.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Add a short comment above the binding node describing why it must run early in the lifecycle.",
                    type: 'partial',
                    feedback: "<p>You at least leave an inline comment warning others not to move the binding without understanding the timing. It's lightweight but helpful. A more complete write-up would be ideal, but this still reduces the chance of regressions.</p>",
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