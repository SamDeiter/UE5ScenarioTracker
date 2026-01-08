window.SCENARIOS['GeneratorCrash'] = {
    meta: {
        expanded: true,
        title: "Generator Loop Crash",
        description: "Spawning 1000 actors freezes game. Investigates Time Slicing vs. Loops.",
        estimateHours: 1.0,
        difficulty: "Beginner",
        category: "Procedural"
    },
    start: "step-inv-1",
    steps: {
        'step-1': {
            skill: 'blueprints',
            title: 'The Symptom',
            image_path: 'assets/generated/generator/step-1.png',
            prompt: "You have a 'Generator' Blueprint designed to spawn 1000 items (like coins or debris) when a button is pressed. However, the moment you press the button, the game freezes for several seconds or crashes entirely. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You look at the Blueprint logic and see a simple 'For Loop' running from 1 to 1000, spawning an actor in every single iteration. Doing this all in one frame (synchronously) is overwhelming the game thread.",
                    next: 'step-2'
                },
                {
                    text: "Wrong Guess]",
                    type: 'wrong',
                    feedback: "You try reducing the mesh complexity of the spawned item, thinking it's a rendering bottleneck. But the freeze happens even with empty actors. It's a logic/CPU spike, not a GPU issue.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'blueprints',
            title: 'Dead End: Wrong Guess',
            image_path: 'assets/generated/generator/step-1W.png',
            prompt: "Optimizing the mesh didn't stop the freeze. The engine is still choking on the sheer number of spawn calls happening in a single frame.",
            choices: [
                {
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You revert the mesh changes and focus on *how* the spawning is being executed in the Blueprint.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'blueprints',
            title: 'Investigation',
            image_path: 'assets/generated/generator/step-2.png',
            prompt: "You examine the 'For Loop' node. It's trying to execute 1000 SpawnActor calls within a single tick. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You confirm that the loop is blocking the game thread until it finishes all 1000 spawns. This causes a massive frame spike (freeze) or a crash if the loop takes too long (Infinite Loop detection might even trigger).",
                    next: 'step-rh-1'
                },
                {
                    text: "Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try increasing the 'Maximum Loop Iteration Count' in Project Settings. This might stop the crash, but it won't stop the freeze--you're still doing too much work in one frame.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'blueprints',
            title: 'Dead End: Misguided',
            image_path: 'assets/generated/generator/step-2M.png',
            prompt: "Increasing the loop limit just allows the game to freeze for *longer* without crashing. It doesn't solve the performance spike.",
            choices: [
                {
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you need to spread the work out over time instead of doing it all at once.",
                    next: 'step-rh-1'
                }
            ]
        },
        'step-3': {
            skill: 'blueprints',
            title: 'The Fix',
            image_path: 'assets/generated/generator/step-3.png',
            prompt: "You know the cause: spawning everything in one frame is too heavy. How do you fix it?",
            choices: [
                {
                    text: "Use a Timer or Time Slicing.]",
                    type: 'correct',
                    feedback: "You replace the 'For Loop' with a Timer (e.g., 'Set Timer by Event') that loops rapidly but spawns only a few items per call, or you build a custom loop that spawns a batch (e.g., 10 items) and then waits for the next frame (Delay 0) to continue. This 'Time Slicing' approach keeps the frame rate smooth while still spawning all 1000 items.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'blueprints',
            title: 'Verification',
            image_path: 'assets/generated/generator/step-4.png',
            prompt: "You implement the timer/batching logic. How do you verify the fix?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, you press the button. The items spawn in a rapid stream rather than appearing instantly, but the game remains perfectly responsive with no freeze. The heavy workload has been successfully distributed.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'profiling',
            title: 'Investigation: Initial Performance Check',
            image_path: 'assets/generated/generator/step-inv-1.png',
            prompt: "The game freezes when you press the button. What's the first performance tool you reach for to quickly understand *where* the bottleneck is (CPU vs. GPU, Game Thread vs. Render Thread)?",
            choices: [
                {
                    text: "Use `stat unit` or `stat game` console commands.]",
                    type: 'correct',
                    feedback: "You open the console and type `stat unit`. You observe that the 'Game' thread time spikes dramatically (e.g., from 8ms to 500ms+), while 'Draw' and 'GPU' times remain relatively low. This immediately confirms the bottleneck is on the CPU's game thread, not rendering or GPU.",
                    next: 'step-inv-1'
                },
                {
                    text: "Check GPU memory usage.]",
                    type: 'wrong',
                    feedback: "You check GPU memory, but it's not maxed out. The `stat unit` command would have shown low GPU times, indicating this isn't a rendering bottleneck. The freeze is happening before rendering can even become an issue.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-inv-2': {
            skill: 'profiling',
            title: 'Investigation: Pinpointing the Culprit',
            image_path: 'assets/generated/generator/step-inv-2.png',
            prompt: "You've confirmed the game thread is the issue. Now you need to pinpoint the exact Blueprint node or function causing this massive spike. What's your next step for deeper analysis?",
            choices: [
                {
                    text: "Use Unreal Insights or the Blueprint Debugger.]",
                    type: 'correct',
                    feedback: "You launch Unreal Insights and capture a session. The trace clearly shows a massive spike in `UWorld::SpawnActor` calls originating from your 'Generator' Blueprint's 'For Loop'. Alternatively, using the Blueprint Debugger with breakpoints would show the execution pointer spending an inordinate amount of time inside that loop, confirming it's blocking the game thread.",
                    next: 'step-inv-1'
                },
                {
                    text: "Guess and comment out random Blueprint nodes.]",
                    type: 'wrong',
                    feedback: "Blindly commenting out nodes is inefficient and can introduce new bugs. Profiling tools are designed to give you precise information about performance bottlenecks.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'blueprints',
            title: 'Red Herring: Misunderstanding Asynchronous Operations',
            image_path: 'assets/generated/generator/step-rh-1.png',
            prompt: "You've identified the 'For Loop' and `SpawnActor` as the problem. You recall hearing about asynchronous operations in UE5. You decide to try using `SpawnActorDeferred` or `LoadAssetAsync` thinking it will solve the synchronous execution. What happens?",
            choices: [
                {
                    text: "Implement `SpawnActorDeferred` or `LoadAssetAsync`.]",
                    type: 'misguided',
                    feedback: "While `SpawnActorDeferred` allows you to configure the actor before its construction script runs, the *actual spawning* (adding to world, running construction script) still happens synchronously on the game thread when `FinishSpawningActor` is called. `LoadAssetAsync` helps with asset loading, but the *spawning logic itself* is still synchronous. Neither directly solves the problem of too many operations in one frame.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1M': {
            skill: 'blueprints',
            title: 'Dead End: Red Herring',
            image_path: 'assets/generated/generator/step-rh-1.png',
            prompt: "Your attempt with `SpawnActorDeferred` or `LoadAssetAsync` didn't fix the freeze. The game still chokes when the `FinishSpawningActor` or the subsequent `SpawnActor` calls happen rapidly.",
            choices: [
                {
                    text: "Realize the core issue is *when* the work is done, not just *how* the asset is loaded or configured.]",
                    type: 'correct',
                    feedback: "You understand that even with deferred spawning or async loading, the fundamental problem is executing 1000 `SpawnActor` operations (or their equivalents) within a single game tick. The work needs to be spread out over multiple frames.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'profiling',
            title: 'Verification: Quantitative Performance Check',
            image_path: 'assets/generated/generator/step-ver-1.png',
            prompt: "You've implemented the time-slicing fix. Beyond just observing the game, how can you quantitatively prove the game thread bottleneck is gone and the frame rate is stable?",
            choices: [
                {
                    text: "Re-run `stat unit` or `stat game` console commands.]",
                    type: 'correct',
                    feedback: "You re-run `stat unit`. You observe that the 'Game' thread time now remains consistently low (e.g., 8-16ms) even while the items are spawning in batches. There are no more massive spikes, confirming the workload is successfully distributed across frames and the game thread is no longer blocked.",
                    next: 'step-ver-1'
                },
                {
                    text: "Just assume it's fixed because it 'feels' smoother.]",
                    type: 'wrong',
                    feedback: "While subjective feeling is a good initial indicator, quantitative data from profiling tools is essential for confirming performance fixes and preventing regressions. Always verify with metrics.",
                    next: 'step-ver-1'
                },
            ]
        },

        'step-ver-2': {
            skill: 'deployment',
            title: 'Verification: Standalone Game Test',
            image_path: 'assets/generated/generator/step-ver-2.png',
            prompt: "You've verified the fix in PIE and with `stat unit`. What's one final, crucial test to ensure the fix holds up in a deployed environment, outside of the editor's overhead?",
            choices: [
                {
                    text: "Launch the game in a Standalone Game build.]",
                    type: 'correct',
                    feedback: "Running the game as a Standalone Game confirms the smooth performance outside of the editor's overhead. The time-sliced spawning works perfectly, demonstrating a robust solution for deployment and ensuring no editor-specific quirks were masking remaining issues.",
                    next: 'step-ver-1'
                },
                {
                    text: "Only test in PIE, it's good enough.]",
                    type: 'wrong',
                    feedback: "PIE (Play In Editor) can sometimes mask performance issues or behave differently than a standalone build due to editor overhead and specific settings. Always test in a standalone build for final verification.",
                    next: 'step-ver-1'
                },
            ]
        },
                }
            ]
        },
        
        'step-inv-1': {
            skill: 'profiling',
            title: 'Investigation: Initial Performance Check',
            prompt: "The game freezes when you press the button. What's the first performance tool you reach for to quickly understand *where* the bottleneck is (CPU vs. GPU, Game Thread vs. Render Thread)?",
            choices: [
                {
                    text: "Use `stat unit` or `stat game` console commands.]",
                    type: 'correct',
                    feedback: "You open the console and type `stat unit`. You observe that the 'Game' thread time spikes dramatically (e.g., from 8ms to 500ms+), while 'Draw' and 'GPU' times remain relatively low. This immediately confirms the bottleneck is on the CPU's game thread, not rendering or GPU.",
                    next: 'step-inv-1'
                },
                {
                    text: "Check GPU memory usage.]",
                    type: 'wrong',
                    feedback: "You check GPU memory, but it's not maxed out. The `stat unit` command would have shown low GPU times, indicating this isn't a rendering bottleneck. The freeze is happening before rendering can even become an issue.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-inv-2': {
            skill: 'profiling',
            title: 'Investigation: Pinpointing the Culprit',
            prompt: "You've confirmed the game thread is the issue. Now you need to pinpoint the exact Blueprint node or function causing this massive spike. What's your next step for deeper analysis?",
            choices: [
                {
                    text: "Use Unreal Insights or the Blueprint Debugger.]",
                    type: 'correct',
                    feedback: "You launch Unreal Insights and capture a session. The trace clearly shows a massive spike in `UWorld::SpawnActor` calls originating from your 'Generator' Blueprint's 'For Loop'. Alternatively, using the Blueprint Debugger with breakpoints would show the execution pointer spending an inordinate amount of time inside that loop, confirming it's blocking the game thread.",
                    next: 'step-inv-1'
                },
                {
                    text: "Guess and comment out random Blueprint nodes.]",
                    type: 'wrong',
                    feedback: "Blindly commenting out nodes is inefficient and can introduce new bugs. Profiling tools are designed to give you precise information about performance bottlenecks.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'blueprints',
            title: 'Red Herring: Misunderstanding Asynchronous Operations',
            prompt: "You've identified the 'For Loop' and `SpawnActor` as the problem. You recall hearing about asynchronous operations in UE5. You decide to try using `SpawnActorDeferred` or `LoadAssetAsync` thinking it will solve the synchronous execution. What happens?",
            choices: [
                {
                    text: "Implement `SpawnActorDeferred` or `LoadAssetAsync`.]",
                    type: 'misguided',
                    feedback: "While `SpawnActorDeferred` allows you to configure the actor before its construction script runs, the *actual spawning* (adding to world, running construction script) still happens synchronously on the game thread when `FinishSpawningActor` is called. `LoadAssetAsync` helps with asset loading, but the *spawning logic itself* is still synchronous. Neither directly solves the problem of too many operations in one frame.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1M': {
            skill: 'blueprints',
            title: 'Dead End: Red Herring',
            prompt: "Your attempt with `SpawnActorDeferred` or `LoadAssetAsync` didn't fix the freeze. The game still chokes when the `FinishSpawningActor` or the subsequent `SpawnActor` calls happen rapidly.",
            choices: [
                {
                    text: "Realize the core issue is *when* the work is done, not just *how* the asset is loaded or configured.]",
                    type: 'correct',
                    feedback: "You understand that even with deferred spawning or async loading, the fundamental problem is executing 1000 `SpawnActor` operations (or their equivalents) within a single game tick. The work needs to be spread out over multiple frames.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'profiling',
            title: 'Verification: Quantitative Performance Check',
            prompt: "You've implemented the time-slicing fix. Beyond just observing the game, how can you quantitatively prove the game thread bottleneck is gone and the frame rate is stable?",
            choices: [
                {
                    text: "Re-run `stat unit` or `stat game` console commands.]",
                    type: 'correct',
                    feedback: "You re-run `stat unit`. You observe that the 'Game' thread time now remains consistently low (e.g., 8-16ms) even while the items are spawning in batches. There are no more massive spikes, confirming the workload is successfully distributed across frames and the game thread is no longer blocked.",
                    next: 'step-ver-1'
                },
                {
                    text: "Just assume it's fixed because it 'feels' smoother.]",
                    type: 'wrong',
                    feedback: "While subjective feeling is a good initial indicator, quantitative data from profiling tools is essential for confirming performance fixes and preventing regressions. Always verify with metrics.",
                    next: 'step-ver-1'
                },
            ]
        },

        'step-ver-2': {
            skill: 'deployment',
            title: 'Verification: Standalone Game Test',
            prompt: "You've verified the fix in PIE and with `stat unit`. What's one final, crucial test to ensure the fix holds up in a deployed environment, outside of the editor's overhead?",
            choices: [
                {
                    text: "Launch the game in a Standalone Game build.]",
                    type: 'correct',
                    feedback: "Running the game as a Standalone Game confirms the smooth performance outside of the editor's overhead. The time-sliced spawning works perfectly, demonstrating a robust solution for deployment and ensuring no editor-specific quirks were masking remaining issues.",
                    next: 'step-ver-1'
                },
                {
                    text: "Only test in PIE, it's good enough.]",
                    type: 'wrong',
                    feedback: "PIE (Play In Editor) can sometimes mask performance issues or behave differently than a standalone build due to editor overhead and specific settings. Always test in a standalone build for final verification.",
                    next: 'step-ver-1'
                },
            ]
        },

        'conclusion': {
            skill: 'blueprints',
            title: 'Conclusion',
            image_path: 'assets/generated/generator/conclusion.png',
            prompt: "Lesson: Avoid heavy 'For Loops' (like spawning hundreds of actors) on the game thread in a single frame. Use **Timers** or **Time Slicing** (batching work across multiple frames) to distribute the load and prevent game freezes.",
            choices: []
        }
    }
};