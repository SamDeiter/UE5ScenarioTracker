window.SCENARIOS['EditorFreezeLoop'] = {
    meta: {
        expanded: true,
        title: "Editor Freeze on Loop",
        description: "While Loop crashes editor. Investigates infinite loop conditions.",
        estimateHours: 1.5,
        difficulty: "Beginner",
        category: "Blueprints"
    },
    start: "step-0",
    steps: {
        'step-1': {
            skill: 'blueprints',
            title: 'The Symptom',
            prompt: "Every time you run the Blueprint, the editor hangs or outright crashes as soon as a While Loop executes. Infinite loop is your prime suspect. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You add debug prints before and after the While Loop and enable Blueprint debugging. The \"before\" print fires, but the \"after\" print never appears. The execution pin is clearly getting stuck in the While Loop, which strongly suggests the loop condition never becomes false.",
                    next: 'step-inv-1'
                },
                {
                    text: "Wrong Guess]",
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
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the pointless performance tweaks and go back to inspecting the While Loop itself--its condition and what changes inside the loop body.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-2': {
            skill: 'blueprints',
            title: 'Investigation',
            prompt: "You open the Blueprint and look closely at the While Loop node: its condition pin, and any variables modified inside the loop. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the loop condition depends on a variable that never changes inside the loop body. The While Loop starts with the condition true and nothing ever decrements, increments, or flips that value, so the condition never becomes false. The loop spins forever--an infinite loop that freezes the editor.",
                    next: 'step-3'
                },
                {
                    text: "Misguided Attempt]",
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
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the only real fix is to change the loop logic: add an increment/decrement or a proper break condition so the loop can actually terminate.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'blueprints',
            title: 'The Fix',
            prompt: "You know the cause: the While Loop's condition never changes, so it runs forever. How do you fix it?",
            choices: [
                {
                    text: "Add break condition or incrementer.]",
                    type: 'correct',
                    feedback: "You introduce a loop counter (or update the variable used in the condition) inside the loop body, ensuring that each iteration moves the condition closer to false. You also add a safety branch to break out if something goes wrong. After updating the logic, the While Loop now has a guaranteed exit.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'blueprints',
            title: 'Verification',
            prompt: "With the new increment/decrement or break logic added, you need to confirm the loop no longer freezes the editor. How do you verify the fix?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "You run the Blueprint again in PIE. This time, the While Loop executes, your debug prints before and after both fire, and the editor stays responsive. The loop finishes in a few iterations instead of locking up, confirming the fix worked.",
                    next: 'step-0'
                }
            ]
        },
        'step-0': {
            skill: 'blueprints',
            title: 'Initial Observation',
            prompt: "The editor freezes, but is it always when this specific Blueprint runs? Or is it a more general editor instability?",
            choices: [
                {
                    text: "Confirm it's tied to the Blueprint]",
                    type: 'correct',
                    feedback: "You've confirmed that the freeze consistently occurs only when this particular Blueprint's logic is executed. This points to a bug within the Blueprint itself, not a general editor problem.",
                    next: 'step-0'
                },
                {
                    text: "Suspect general editor instability]",
                    type: 'wrong',
                    feedback: "You spent time checking your system resources, updating drivers, and reinstalling the engine, but the freeze only happens when you execute that specific Blueprint. It's not a general editor issue.",
                    next: 'step-0W'
                },
            ]
        },

        'step-0W': {
            skill: 'blueprints',
            title: 'Dead End: General Instability',
            prompt: "You went down the wrong path, treating the freeze like a general editor problem instead of a specific Blueprint bug. The editor still hard-locks whenever the While Loop executes in your Blueprint.",
            choices: [
                {
                    text: "Re-focus on the Blueprint]",
                    type: 'correct',
                    feedback: "You undo the pointless system checks and go back to inspecting the Blueprint itself, realizing the problem is localized.",
                    next: 'step-0'
                },
            ]
        },

        'step-inv-1': {
            skill: 'blueprints',
            title: 'Isolate the Problem',
            prompt: "You've confirmed the freeze is tied to the Blueprint. Before diving into the debugger, how can you quickly narrow down the exact node causing the issue?",
            choices: [
                {
                    text: "Temporarily disable the While Loop and use Print Strings before and after it]",
                    type: 'correct',
                    feedback: "You temporarily bypass the While Loop and the Blueprint runs without freezing. Re-enabling it causes the freeze again. You add 'Print String' nodes immediately before and after the While Loop. The 'before' print fires, but the 'after' print never appears, confirming the While Loop is indeed where execution gets stuck.",
                    next: 'step-inv-2'
                },
                {
                    text: "Check engine version and plugin compatibility]",
                    type: 'misguided',
                    feedback: "You spent time checking your engine version, verifying plugin compatibility, and even trying a different project, but the issue persists only with *this specific Blueprint's While Loop*. It's not an external factor.",
                    next: 'step-red-herring'
                },
            ]
        },

        'step-inv-2': {
            skill: 'blueprints',
            title: 'Blueprint Debugger Deep Dive',
            prompt: "You've isolated the While Loop as the culprit. Now, to understand *why* it's looping infinitely, what's the most effective way to observe its execution and variable states in real-time?",
            choices: [
                {
                    text: "Set breakpoints on the While Loop and its condition, and add watch values for relevant variables]",
                    type: 'correct',
                    feedback: "You set a breakpoint on the While Loop node and its condition pin. When the Blueprint executes, the debugger pauses at the loop. You add the loop's condition variable to the Watch window and step through the loop. You observe that the condition variable's value never changes, keeping the condition perpetually true.",
                    next: 'step-inv-1'
                },
                {
                    text: "Just keep adding more Print Strings inside the loop]",
                    type: 'wrong',
                    feedback: "While Print Strings are useful, adding too many inside an infinite loop can make the editor even more unresponsive or crash faster due to excessive log output. It's also hard to see variable changes over time with just prints.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'blueprints',
            title: 'Dead End: Print String Overload',
            prompt: "You went down the wrong path, trying to debug an infinite loop with excessive Print Strings, which only exacerbated the freeze or crash. You need a more controlled way to inspect variable states.",
            choices: [
                {
                    text: "Switch to the Blueprint Debugger]",
                    type: 'correct',
                    feedback: "You realize the Blueprint Debugger with breakpoints and watch values is the appropriate tool for this level of inspection.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-red-herring': {
            skill: 'blueprints',
            title: 'Dead End: External Factors',
            prompt: "You went down the wrong path, checking external factors like engine version or plugin compatibility. The problem is clearly localized to the Blueprint's logic.",
            choices: [
                {
                    text: "Re-focus on the Blueprint's internal logic]",
                    type: 'correct',
                    feedback: "You realize the issue is within the Blueprint itself and return to more direct debugging methods.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'blueprints',
            title: 'Standalone Game Verification',
            prompt: "The fix works in PIE, but sometimes issues only appear in a packaged or standalone build due to different execution environments or optimizations. How do you verify the fix holds up outside the editor?",
            choices: [
                {
                    text: "Launch the game in Standalone Game mode]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone Game mode. The Blueprint executes, the loop completes, and the game runs smoothly without any freezes or hitches. This confirms the fix is robust across different execution contexts.",
                    next: 'step-ver-2'
                },
                {
                    text: "Assume PIE is enough and move on]",
                    type: 'wrong',
                    feedback: "You assumed PIE was enough, but a user reports the game still freezes when they launch it. Some editor-specific optimizations or debug features might have masked the issue in PIE. Always test in standalone!",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'blueprints',
            title: 'Dead End: PIE-Only Fix',
            prompt: "You went down the wrong path, assuming a PIE fix was sufficient. The game still freezes in standalone mode, indicating the fix wasn't robust enough for a real game environment.",
            choices: [
                {
                    text: "Re-evaluate the fix and test in Standalone Game mode]",
                    type: 'correct',
                    feedback: "You realize the importance of standalone testing and re-evaluate your loop logic, ensuring it's truly robust for all environments.",
                    next: 'step-3'
                },
            ]
        },

        'step-ver-2': {
            skill: 'blueprints',
            title: 'Performance Check',
            prompt: "The loop no longer freezes, but is it efficient? An infinite loop fixed by a very slow condition check or excessive iterations could still cause performance hitches. How do you check its runtime cost?",
            choices: [
                {
                    text: "Use 'stat unit' and 'stat game' console commands to monitor frame time and game thread usage]",
                    type: 'correct',
                    feedback: "You open the console and type 'stat unit' and 'stat game'. You observe the frame time and game thread usage before, during, and after the loop executes. The numbers remain stable, indicating the loop completes quickly and efficiently without causing any performance spikes.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'blueprints',
            title: 'Blueprint Debugger',
            prompt: "The debug prints confirm the loop is entered but never exited. To see exactly what is happening inside and inspect variable values in real-time, you need to use the Blueprint Debugger. How do you proceed?",
            choices: [
                {
                    text: "Set Breakpoint & Step Through]",
                    type: 'correct',
                    feedback: "You set a breakpoint on the While Loop node, start PIE, and step through the loop. You observe the loop condition variable in the Watch window, and it never changes its value, confirming it's stuck true. The execution pin repeatedly hits the same node.",
                    next: 'step-inv-2'
                },
                {
                    text: "Add more print strings]",
                    type: 'wrong',
                    feedback: "While print strings are useful for basic flow, they don't allow you to inspect variable values *during* execution or step through the logic interactively. You need a more powerful, interactive debugging tool.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'blueprints',
            title: 'Dead End: More Print Strings',
            prompt: "Adding more print strings didn't help you understand *why* the condition isn't changing. The editor still freezes, and you can't inspect the state of variables in real-time. You need a more granular approach.",
            choices: [
                {
                    text: "Use Blueprint Debugger]",
                    type: 'correct',
                    feedback: "You realize the Blueprint Debugger is the right tool for this job, allowing you to step through and watch variables as the loop executes.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'blueprints',
            title: 'Call Stack Analysis',
            prompt: "The Blueprint Debugger confirms the loop condition variable is stuck. If the debugger itself is struggling or you want to confirm the game thread is truly locked by this specific loop, what's another advanced debugging technique?",
            choices: [
                {
                    text: "Analyze the Call Stack]",
                    type: 'correct',
                    feedback: "You open the Call Stack window in the Blueprint Debugger (or even the Visual Studio debugger if it crashed) and see a deep stack trace repeatedly calling the same Blueprint function containing the While Loop. This confirms the game thread is indeed stuck in that specific loop, consuming all CPU cycles.",
                    next: 'step-rh-1'
                },
                {
                    text: "Restart Editor]",
                    type: 'wrong',
                    feedback: "Restarting the editor might clear temporary issues, but it won't fix the underlying logic bug. The infinite loop will just happen again as soon as the Blueprint executes.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'blueprints',
            title: 'Dead End: Restart Editor',
            prompt: "Restarting the editor didn't fix the logic. The infinite loop persists, and you still need to understand *why* it's happening. You need to use debugging tools to get to the root cause.",
            choices: [
                {
                    text: "Re-examine debugging tools]",
                    type: 'correct',
                    feedback: "You go back to using the Blueprint Debugger and Call Stack to pinpoint the exact cause of the infinite loop.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'blueprints',
            title: 'Red Herring: Changing Loop Type',
            prompt: "You've confirmed the While Loop is the culprit. You think maybe a different loop type would be better. You consider replacing the While Loop with a For Each Loop or a standard For Loop. Is this a good approach?",
            choices: [
                {
                    text: "Replace with For Each Loop]",
                    type: 'wrong',
                    feedback: "You replace the While Loop with a For Each Loop, but realize it requires an array input, which you don't have or isn't appropriate for your logic. Even if you forced it, it wouldn't fix the underlying issue of the termination condition not being met.",
                    next: 'step-rh-1W'
                },
                {
                    text: "Replace with For Loop]",
                    type: 'wrong',
                    feedback: "You replace the While Loop with a For Loop, but then you have to define a fixed number of iterations. This might prevent a freeze, but it doesn't solve the original problem of the loop's intended logic not terminating correctly based on its condition. It's a workaround, not a fix, and might lead to incorrect behavior.",
                    next: 'step-rh-1W'
                },
                {
                    text: "Realize loop type isn't the issue]",
                    type: 'correct',
                    feedback: "You realize that simply changing the loop type won't fix the core problem: the *condition* for termination isn't being met. Whether it's a While, For, or For Each, if the logic inside doesn't move towards an exit condition, it will either loop infinitely (While) or execute an incorrect number of times (For/ForEach).",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-rh-1W': {
            skill: 'blueprints',
            title: 'Dead End: Wrong Loop Type',
            prompt: "Replacing the loop type didn't solve the problem. The core issue is still that the loop's termination condition isn't being met, regardless of the loop construct. You've either introduced new errors or just masked the original problem.",
            choices: [
                {
                    text: "Focus on the termination condition]",
                    type: 'correct',
                    feedback: "You understand that the type of loop is secondary to ensuring its termination condition is properly handled. You need to go back and analyze the original While Loop's condition and what affects it.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'blueprints',
            title: 'Standalone Game Verification',
            prompt: "The fix works in PIE, but sometimes PIE can mask issues that appear in a packaged or standalone build. How do you perform a more robust verification?",
            choices: [
                {
                    text: "Launch Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone mode (File > Launch Game > Standalone Game). The game loads, the Blueprint executes, and the loop completes without freezing. This confirms the fix holds up outside of the editor's PIE environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Rebuild Project]",
                    type: 'wrong',
                    feedback: "While rebuilding the project is good practice, it's not a direct verification of the runtime behavior of the loop in a different environment. You need to *run* the game outside of PIE.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'blueprints',
            title: 'Dead End: Rebuild Only',
            prompt: "Rebuilding the project is good, but it doesn't tell you if the loop behaves correctly in a standalone game. You need to actually run the game in a more production-like environment.",
            choices: [
                {
                    text: "Launch Standalone Game]",
                    type: 'correct',
                    feedback: "You realize you need to actually run the game in Standalone mode to verify the fix in a more robust environment.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'blueprints',
            title: 'Performance Profiling',
            prompt: "The loop no longer freezes, but an inefficient loop could still cause performance hitches. How do you ensure the fixed loop isn't causing a performance bottleneck?",
            choices: [
                {
                    text: "Use Stat Commands (e.g., stat unit, stat game)]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat game` in the console while the loop is executing. You observe that the game thread time remains stable and doesn't spike excessively during the loop's execution, indicating it's now terminating quickly and efficiently without hogging CPU resources.",
                    next: 'step-ver-1'
                },
                {
                    text: "Check Task Manager]",
                    type: 'wrong',
                    feedback: "While Task Manager can show overall CPU usage, it's too coarse-grained to pinpoint specific in-game performance bottlenecks caused by a Blueprint loop. You need in-engine profiling tools.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'blueprints',
            title: 'Dead End: Task Manager',
            prompt: "Task Manager is too general. You need to see *in-engine* performance metrics to confirm the loop isn't causing a hitch.",
            choices: [
                {
                    text: "Use Stat Commands]",
                    type: 'correct',
                    feedback: "You realize that Unreal Engine's built-in `stat` commands are essential for detailed performance analysis.",
                    next: 'step-ver-1'
                },
            ]
        },
                },
                {
                    text: "Just assume it's fine since it doesn't freeze]",
                    type: 'wrong',
                    feedback: "You assumed it was fine, but playtesters report micro-stutters or frame drops whenever the loop executes. A 'fixed' infinite loop can still be a performance bottleneck if it runs too many iterations or performs expensive operations.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'blueprints',
            title: 'Dead End: Performance Blindness',
            prompt: "You went down the wrong path, neglecting to verify the performance of your fixed loop. It no longer freezes, but it's causing noticeable frame drops, indicating it's still inefficient.",
            choices: [
                {
                    text: "Use 'stat unit' and 'stat game' to profile the loop]",
                    type: 'correct',
                    feedback: "You realize that a non-freezing loop isn't necessarily an optimized one and proceed to profile its performance to ensure it's not a bottleneck.",
                    next: 'step-ver-2'
                },
            ]
        },

        
        'step-inv-1': {
            skill: 'blueprints',
            title: 'Blueprint Debugger',
            prompt: "The debug prints confirm the loop is entered but never exited. To see exactly what is happening inside and inspect variable values in real-time, you need to use the Blueprint Debugger. How do you proceed?",
            choices: [
                {
                    text: "Set Breakpoint & Step Through]",
                    type: 'correct',
                    feedback: "You set a breakpoint on the While Loop node, start PIE, and step through the loop. You observe the loop condition variable in the Watch window, and it never changes its value, confirming it's stuck true. The execution pin repeatedly hits the same node.",
                    next: 'step-inv-2'
                },
                {
                    text: "Add more print strings]",
                    type: 'wrong',
                    feedback: "While print strings are useful for basic flow, they don't allow you to inspect variable values *during* execution or step through the logic interactively. You need a more powerful, interactive debugging tool.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'blueprints',
            title: 'Dead End: More Print Strings',
            prompt: "Adding more print strings didn't help you understand *why* the condition isn't changing. The editor still freezes, and you can't inspect the state of variables in real-time. You need a more granular approach.",
            choices: [
                {
                    text: "Use Blueprint Debugger]",
                    type: 'correct',
                    feedback: "You realize the Blueprint Debugger is the right tool for this job, allowing you to step through and watch variables as the loop executes.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'blueprints',
            title: 'Call Stack Analysis',
            prompt: "The Blueprint Debugger confirms the loop condition variable is stuck. If the debugger itself is struggling or you want to confirm the game thread is truly locked by this specific loop, what's another advanced debugging technique?",
            choices: [
                {
                    text: "Analyze the Call Stack]",
                    type: 'correct',
                    feedback: "You open the Call Stack window in the Blueprint Debugger (or even the Visual Studio debugger if it crashed) and see a deep stack trace repeatedly calling the same Blueprint function containing the While Loop. This confirms the game thread is indeed stuck in that specific loop, consuming all CPU cycles.",
                    next: 'step-rh-1'
                },
                {
                    text: "Restart Editor]",
                    type: 'wrong',
                    feedback: "Restarting the editor might clear temporary issues, but it won't fix the underlying logic bug. The infinite loop will just happen again as soon as the Blueprint executes.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'blueprints',
            title: 'Dead End: Restart Editor',
            prompt: "Restarting the editor didn't fix the logic. The infinite loop persists, and you still need to understand *why* it's happening. You need to use debugging tools to get to the root cause.",
            choices: [
                {
                    text: "Re-examine debugging tools]",
                    type: 'correct',
                    feedback: "You go back to using the Blueprint Debugger and Call Stack to pinpoint the exact cause of the infinite loop.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'blueprints',
            title: 'Red Herring: Changing Loop Type',
            prompt: "You've confirmed the While Loop is the culprit. You think maybe a different loop type would be better. You consider replacing the While Loop with a For Each Loop or a standard For Loop. Is this a good approach?",
            choices: [
                {
                    text: "Replace with For Each Loop]",
                    type: 'wrong',
                    feedback: "You replace the While Loop with a For Each Loop, but realize it requires an array input, which you don't have or isn't appropriate for your logic. Even if you forced it, it wouldn't fix the underlying issue of the termination condition not being met.",
                    next: 'step-rh-1W'
                },
                {
                    text: "Replace with For Loop]",
                    type: 'wrong',
                    feedback: "You replace the While Loop with a For Loop, but then you have to define a fixed number of iterations. This might prevent a freeze, but it doesn't solve the original problem of the loop's intended logic not terminating correctly based on its condition. It's a workaround, not a fix, and might lead to incorrect behavior.",
                    next: 'step-rh-1W'
                },
                {
                    text: "Realize loop type isn't the issue]",
                    type: 'correct',
                    feedback: "You realize that simply changing the loop type won't fix the core problem: the *condition* for termination isn't being met. Whether it's a While, For, or For Each, if the logic inside doesn't move towards an exit condition, it will either loop infinitely (While) or execute an incorrect number of times (For/ForEach).",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-rh-1W': {
            skill: 'blueprints',
            title: 'Dead End: Wrong Loop Type',
            prompt: "Replacing the loop type didn't solve the problem. The core issue is still that the loop's termination condition isn't being met, regardless of the loop construct. You've either introduced new errors or just masked the original problem.",
            choices: [
                {
                    text: "Focus on the termination condition]",
                    type: 'correct',
                    feedback: "You understand that the type of loop is secondary to ensuring its termination condition is properly handled. You need to go back and analyze the original While Loop's condition and what affects it.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'blueprints',
            title: 'Standalone Game Verification',
            prompt: "The fix works in PIE, but sometimes PIE can mask issues that appear in a packaged or standalone build. How do you perform a more robust verification?",
            choices: [
                {
                    text: "Launch Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone mode (File > Launch Game > Standalone Game). The game loads, the Blueprint executes, and the loop completes without freezing. This confirms the fix holds up outside of the editor's PIE environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Rebuild Project]",
                    type: 'wrong',
                    feedback: "While rebuilding the project is good practice, it's not a direct verification of the runtime behavior of the loop in a different environment. You need to *run* the game outside of PIE.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'blueprints',
            title: 'Dead End: Rebuild Only',
            prompt: "Rebuilding the project is good, but it doesn't tell you if the loop behaves correctly in a standalone game. You need to actually run the game in a more production-like environment.",
            choices: [
                {
                    text: "Launch Standalone Game]",
                    type: 'correct',
                    feedback: "You realize you need to actually run the game in Standalone mode to verify the fix in a more robust environment.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'blueprints',
            title: 'Performance Profiling',
            prompt: "The loop no longer freezes, but an inefficient loop could still cause performance hitches. How do you ensure the fixed loop isn't causing a performance bottleneck?",
            choices: [
                {
                    text: "Use Stat Commands (e.g., stat unit, stat game)]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat game` in the console while the loop is executing. You observe that the game thread time remains stable and doesn't spike excessively during the loop's execution, indicating it's now terminating quickly and efficiently without hogging CPU resources.",
                    next: 'step-ver-1'
                },
                {
                    text: "Check Task Manager]",
                    type: 'wrong',
                    feedback: "While Task Manager can show overall CPU usage, it's too coarse-grained to pinpoint specific in-game performance bottlenecks caused by a Blueprint loop. You need in-engine profiling tools.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'blueprints',
            title: 'Dead End: Task Manager',
            prompt: "Task Manager is too general. You need to see *in-engine* performance metrics to confirm the loop isn't causing a hitch.",
            choices: [
                {
                    text: "Use Stat Commands]",
                    type: 'correct',
                    feedback: "You realize that Unreal Engine's built-in `stat` commands are essential for detailed performance analysis.",
                    next: 'step-ver-1'
                },
            ]
        },
                }
            ]
        },
        
        'step-0': {
            skill: 'blueprints',
            title: 'Initial Observation',
            prompt: "The editor freezes, but is it always when this specific Blueprint runs? Or is it a more general editor instability?",
            choices: [
                {
                    text: "Confirm it's tied to the Blueprint]",
                    type: 'correct',
                    feedback: "You've confirmed that the freeze consistently occurs only when this particular Blueprint's logic is executed. This points to a bug within the Blueprint itself, not a general editor problem.",
                    next: 'step-0'
                },
                {
                    text: "Suspect general editor instability]",
                    type: 'wrong',
                    feedback: "You spent time checking your system resources, updating drivers, and reinstalling the engine, but the freeze only happens when you execute that specific Blueprint. It's not a general editor issue.",
                    next: 'step-0W'
                },
            ]
        },

        'step-0W': {
            skill: 'blueprints',
            title: 'Dead End: General Instability',
            prompt: "You went down the wrong path, treating the freeze like a general editor problem instead of a specific Blueprint bug. The editor still hard-locks whenever the While Loop executes in your Blueprint.",
            choices: [
                {
                    text: "Re-focus on the Blueprint]",
                    type: 'correct',
                    feedback: "You undo the pointless system checks and go back to inspecting the Blueprint itself, realizing the problem is localized.",
                    next: 'step-0'
                },
            ]
        },

        'step-inv-1': {
            skill: 'blueprints',
            title: 'Isolate the Problem',
            prompt: "You've confirmed the freeze is tied to the Blueprint. Before diving into the debugger, how can you quickly narrow down the exact node causing the issue?",
            choices: [
                {
                    text: "Temporarily disable the While Loop and use Print Strings before and after it]",
                    type: 'correct',
                    feedback: "You temporarily bypass the While Loop and the Blueprint runs without freezing. Re-enabling it causes the freeze again. You add 'Print String' nodes immediately before and after the While Loop. The 'before' print fires, but the 'after' print never appears, confirming the While Loop is indeed where execution gets stuck.",
                    next: 'step-inv-2'
                },
                {
                    text: "Check engine version and plugin compatibility]",
                    type: 'misguided',
                    feedback: "You spent time checking your engine version, verifying plugin compatibility, and even trying a different project, but the issue persists only with *this specific Blueprint's While Loop*. It's not an external factor.",
                    next: 'step-red-herring'
                },
            ]
        },

        'step-inv-2': {
            skill: 'blueprints',
            title: 'Blueprint Debugger Deep Dive',
            prompt: "You've isolated the While Loop as the culprit. Now, to understand *why* it's looping infinitely, what's the most effective way to observe its execution and variable states in real-time?",
            choices: [
                {
                    text: "Set breakpoints on the While Loop and its condition, and add watch values for relevant variables]",
                    type: 'correct',
                    feedback: "You set a breakpoint on the While Loop node and its condition pin. When the Blueprint executes, the debugger pauses at the loop. You add the loop's condition variable to the Watch window and step through the loop. You observe that the condition variable's value never changes, keeping the condition perpetually true.",
                    next: 'step-inv-1'
                },
                {
                    text: "Just keep adding more Print Strings inside the loop]",
                    type: 'wrong',
                    feedback: "While Print Strings are useful, adding too many inside an infinite loop can make the editor even more unresponsive or crash faster due to excessive log output. It's also hard to see variable changes over time with just prints.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'blueprints',
            title: 'Dead End: Print String Overload',
            prompt: "You went down the wrong path, trying to debug an infinite loop with excessive Print Strings, which only exacerbated the freeze or crash. You need a more controlled way to inspect variable states.",
            choices: [
                {
                    text: "Switch to the Blueprint Debugger]",
                    type: 'correct',
                    feedback: "You realize the Blueprint Debugger with breakpoints and watch values is the appropriate tool for this level of inspection.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-red-herring': {
            skill: 'blueprints',
            title: 'Dead End: External Factors',
            prompt: "You went down the wrong path, checking external factors like engine version or plugin compatibility. The problem is clearly localized to the Blueprint's logic.",
            choices: [
                {
                    text: "Re-focus on the Blueprint's internal logic]",
                    type: 'correct',
                    feedback: "You realize the issue is within the Blueprint itself and return to more direct debugging methods.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'blueprints',
            title: 'Standalone Game Verification',
            prompt: "The fix works in PIE, but sometimes issues only appear in a packaged or standalone build due to different execution environments or optimizations. How do you verify the fix holds up outside the editor?",
            choices: [
                {
                    text: "Launch the game in Standalone Game mode]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone Game mode. The Blueprint executes, the loop completes, and the game runs smoothly without any freezes or hitches. This confirms the fix is robust across different execution contexts.",
                    next: 'step-ver-2'
                },
                {
                    text: "Assume PIE is enough and move on]",
                    type: 'wrong',
                    feedback: "You assumed PIE was enough, but a user reports the game still freezes when they launch it. Some editor-specific optimizations or debug features might have masked the issue in PIE. Always test in standalone!",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'blueprints',
            title: 'Dead End: PIE-Only Fix',
            prompt: "You went down the wrong path, assuming a PIE fix was sufficient. The game still freezes in standalone mode, indicating the fix wasn't robust enough for a real game environment.",
            choices: [
                {
                    text: "Re-evaluate the fix and test in Standalone Game mode]",
                    type: 'correct',
                    feedback: "You realize the importance of standalone testing and re-evaluate your loop logic, ensuring it's truly robust for all environments.",
                    next: 'step-3'
                },
            ]
        },

        'step-ver-2': {
            skill: 'blueprints',
            title: 'Performance Check',
            prompt: "The loop no longer freezes, but is it efficient? An infinite loop fixed by a very slow condition check or excessive iterations could still cause performance hitches. How do you check its runtime cost?",
            choices: [
                {
                    text: "Use 'stat unit' and 'stat game' console commands to monitor frame time and game thread usage]",
                    type: 'correct',
                    feedback: "You open the console and type 'stat unit' and 'stat game'. You observe the frame time and game thread usage before, during, and after the loop executes. The numbers remain stable, indicating the loop completes quickly and efficiently without causing any performance spikes.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'blueprints',
            title: 'Blueprint Debugger',
            prompt: "The debug prints confirm the loop is entered but never exited. To see exactly what is happening inside and inspect variable values in real-time, you need to use the Blueprint Debugger. How do you proceed?",
            choices: [
                {
                    text: "Set Breakpoint & Step Through]",
                    type: 'correct',
                    feedback: "You set a breakpoint on the While Loop node, start PIE, and step through the loop. You observe the loop condition variable in the Watch window, and it never changes its value, confirming it's stuck true. The execution pin repeatedly hits the same node.",
                    next: 'step-inv-2'
                },
                {
                    text: "Add more print strings]",
                    type: 'wrong',
                    feedback: "While print strings are useful for basic flow, they don't allow you to inspect variable values *during* execution or step through the logic interactively. You need a more powerful, interactive debugging tool.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'blueprints',
            title: 'Dead End: More Print Strings',
            prompt: "Adding more print strings didn't help you understand *why* the condition isn't changing. The editor still freezes, and you can't inspect the state of variables in real-time. You need a more granular approach.",
            choices: [
                {
                    text: "Use Blueprint Debugger]",
                    type: 'correct',
                    feedback: "You realize the Blueprint Debugger is the right tool for this job, allowing you to step through and watch variables as the loop executes.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'blueprints',
            title: 'Call Stack Analysis',
            prompt: "The Blueprint Debugger confirms the loop condition variable is stuck. If the debugger itself is struggling or you want to confirm the game thread is truly locked by this specific loop, what's another advanced debugging technique?",
            choices: [
                {
                    text: "Analyze the Call Stack]",
                    type: 'correct',
                    feedback: "You open the Call Stack window in the Blueprint Debugger (or even the Visual Studio debugger if it crashed) and see a deep stack trace repeatedly calling the same Blueprint function containing the While Loop. This confirms the game thread is indeed stuck in that specific loop, consuming all CPU cycles.",
                    next: 'step-rh-1'
                },
                {
                    text: "Restart Editor]",
                    type: 'wrong',
                    feedback: "Restarting the editor might clear temporary issues, but it won't fix the underlying logic bug. The infinite loop will just happen again as soon as the Blueprint executes.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'blueprints',
            title: 'Dead End: Restart Editor',
            prompt: "Restarting the editor didn't fix the logic. The infinite loop persists, and you still need to understand *why* it's happening. You need to use debugging tools to get to the root cause.",
            choices: [
                {
                    text: "Re-examine debugging tools]",
                    type: 'correct',
                    feedback: "You go back to using the Blueprint Debugger and Call Stack to pinpoint the exact cause of the infinite loop.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'blueprints',
            title: 'Red Herring: Changing Loop Type',
            prompt: "You've confirmed the While Loop is the culprit. You think maybe a different loop type would be better. You consider replacing the While Loop with a For Each Loop or a standard For Loop. Is this a good approach?",
            choices: [
                {
                    text: "Replace with For Each Loop]",
                    type: 'wrong',
                    feedback: "You replace the While Loop with a For Each Loop, but realize it requires an array input, which you don't have or isn't appropriate for your logic. Even if you forced it, it wouldn't fix the underlying issue of the termination condition not being met.",
                    next: 'step-rh-1W'
                },
                {
                    text: "Replace with For Loop]",
                    type: 'wrong',
                    feedback: "You replace the While Loop with a For Loop, but then you have to define a fixed number of iterations. This might prevent a freeze, but it doesn't solve the original problem of the loop's intended logic not terminating correctly based on its condition. It's a workaround, not a fix, and might lead to incorrect behavior.",
                    next: 'step-rh-1W'
                },
                {
                    text: "Realize loop type isn't the issue]",
                    type: 'correct',
                    feedback: "You realize that simply changing the loop type won't fix the core problem: the *condition* for termination isn't being met. Whether it's a While, For, or For Each, if the logic inside doesn't move towards an exit condition, it will either loop infinitely (While) or execute an incorrect number of times (For/ForEach).",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-rh-1W': {
            skill: 'blueprints',
            title: 'Dead End: Wrong Loop Type',
            prompt: "Replacing the loop type didn't solve the problem. The core issue is still that the loop's termination condition isn't being met, regardless of the loop construct. You've either introduced new errors or just masked the original problem.",
            choices: [
                {
                    text: "Focus on the termination condition]",
                    type: 'correct',
                    feedback: "You understand that the type of loop is secondary to ensuring its termination condition is properly handled. You need to go back and analyze the original While Loop's condition and what affects it.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'blueprints',
            title: 'Standalone Game Verification',
            prompt: "The fix works in PIE, but sometimes PIE can mask issues that appear in a packaged or standalone build. How do you perform a more robust verification?",
            choices: [
                {
                    text: "Launch Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone mode (File > Launch Game > Standalone Game). The game loads, the Blueprint executes, and the loop completes without freezing. This confirms the fix holds up outside of the editor's PIE environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Rebuild Project]",
                    type: 'wrong',
                    feedback: "While rebuilding the project is good practice, it's not a direct verification of the runtime behavior of the loop in a different environment. You need to *run* the game outside of PIE.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'blueprints',
            title: 'Dead End: Rebuild Only',
            prompt: "Rebuilding the project is good, but it doesn't tell you if the loop behaves correctly in a standalone game. You need to actually run the game in a more production-like environment.",
            choices: [
                {
                    text: "Launch Standalone Game]",
                    type: 'correct',
                    feedback: "You realize you need to actually run the game in Standalone mode to verify the fix in a more robust environment.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'blueprints',
            title: 'Performance Profiling',
            prompt: "The loop no longer freezes, but an inefficient loop could still cause performance hitches. How do you ensure the fixed loop isn't causing a performance bottleneck?",
            choices: [
                {
                    text: "Use Stat Commands (e.g., stat unit, stat game)]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat game` in the console while the loop is executing. You observe that the game thread time remains stable and doesn't spike excessively during the loop's execution, indicating it's now terminating quickly and efficiently without hogging CPU resources.",
                    next: 'step-ver-1'
                },
                {
                    text: "Check Task Manager]",
                    type: 'wrong',
                    feedback: "While Task Manager can show overall CPU usage, it's too coarse-grained to pinpoint specific in-game performance bottlenecks caused by a Blueprint loop. You need in-engine profiling tools.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'blueprints',
            title: 'Dead End: Task Manager',
            prompt: "Task Manager is too general. You need to see *in-engine* performance metrics to confirm the loop isn't causing a hitch.",
            choices: [
                {
                    text: "Use Stat Commands]",
                    type: 'correct',
                    feedback: "You realize that Unreal Engine's built-in `stat` commands are essential for detailed performance analysis.",
                    next: 'step-ver-1'
                },
            ]
        },
                },
                {
                    text: "Just assume it's fine since it doesn't freeze]",
                    type: 'wrong',
                    feedback: "You assumed it was fine, but playtesters report micro-stutters or frame drops whenever the loop executes. A 'fixed' infinite loop can still be a performance bottleneck if it runs too many iterations or performs expensive operations.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'blueprints',
            title: 'Dead End: Performance Blindness',
            prompt: "You went down the wrong path, neglecting to verify the performance of your fixed loop. It no longer freezes, but it's causing noticeable frame drops, indicating it's still inefficient.",
            choices: [
                {
                    text: "Use 'stat unit' and 'stat game' to profile the loop]",
                    type: 'correct',
                    feedback: "You realize that a non-freezing loop isn't necessarily an optimized one and proceed to profile its performance to ensure it's not a bottleneck.",
                    next: 'step-ver-2'
                },
            ]
        },

        
        'step-inv-1': {
            skill: 'blueprints',
            title: 'Blueprint Debugger',
            prompt: "The debug prints confirm the loop is entered but never exited. To see exactly what is happening inside and inspect variable values in real-time, you need to use the Blueprint Debugger. How do you proceed?",
            choices: [
                {
                    text: "Set Breakpoint & Step Through]",
                    type: 'correct',
                    feedback: "You set a breakpoint on the While Loop node, start PIE, and step through the loop. You observe the loop condition variable in the Watch window, and it never changes its value, confirming it's stuck true. The execution pin repeatedly hits the same node.",
                    next: 'step-inv-2'
                },
                {
                    text: "Add more print strings]",
                    type: 'wrong',
                    feedback: "While print strings are useful for basic flow, they don't allow you to inspect variable values *during* execution or step through the logic interactively. You need a more powerful, interactive debugging tool.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'blueprints',
            title: 'Dead End: More Print Strings',
            prompt: "Adding more print strings didn't help you understand *why* the condition isn't changing. The editor still freezes, and you can't inspect the state of variables in real-time. You need a more granular approach.",
            choices: [
                {
                    text: "Use Blueprint Debugger]",
                    type: 'correct',
                    feedback: "You realize the Blueprint Debugger is the right tool for this job, allowing you to step through and watch variables as the loop executes.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'blueprints',
            title: 'Call Stack Analysis',
            prompt: "The Blueprint Debugger confirms the loop condition variable is stuck. If the debugger itself is struggling or you want to confirm the game thread is truly locked by this specific loop, what's another advanced debugging technique?",
            choices: [
                {
                    text: "Analyze the Call Stack]",
                    type: 'correct',
                    feedback: "You open the Call Stack window in the Blueprint Debugger (or even the Visual Studio debugger if it crashed) and see a deep stack trace repeatedly calling the same Blueprint function containing the While Loop. This confirms the game thread is indeed stuck in that specific loop, consuming all CPU cycles.",
                    next: 'step-rh-1'
                },
                {
                    text: "Restart Editor]",
                    type: 'wrong',
                    feedback: "Restarting the editor might clear temporary issues, but it won't fix the underlying logic bug. The infinite loop will just happen again as soon as the Blueprint executes.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'blueprints',
            title: 'Dead End: Restart Editor',
            prompt: "Restarting the editor didn't fix the logic. The infinite loop persists, and you still need to understand *why* it's happening. You need to use debugging tools to get to the root cause.",
            choices: [
                {
                    text: "Re-examine debugging tools]",
                    type: 'correct',
                    feedback: "You go back to using the Blueprint Debugger and Call Stack to pinpoint the exact cause of the infinite loop.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'blueprints',
            title: 'Red Herring: Changing Loop Type',
            prompt: "You've confirmed the While Loop is the culprit. You think maybe a different loop type would be better. You consider replacing the While Loop with a For Each Loop or a standard For Loop. Is this a good approach?",
            choices: [
                {
                    text: "Replace with For Each Loop]",
                    type: 'wrong',
                    feedback: "You replace the While Loop with a For Each Loop, but realize it requires an array input, which you don't have or isn't appropriate for your logic. Even if you forced it, it wouldn't fix the underlying issue of the termination condition not being met.",
                    next: 'step-rh-1W'
                },
                {
                    text: "Replace with For Loop]",
                    type: 'wrong',
                    feedback: "You replace the While Loop with a For Loop, but then you have to define a fixed number of iterations. This might prevent a freeze, but it doesn't solve the original problem of the loop's intended logic not terminating correctly based on its condition. It's a workaround, not a fix, and might lead to incorrect behavior.",
                    next: 'step-rh-1W'
                },
                {
                    text: "Realize loop type isn't the issue]",
                    type: 'correct',
                    feedback: "You realize that simply changing the loop type won't fix the core problem: the *condition* for termination isn't being met. Whether it's a While, For, or For Each, if the logic inside doesn't move towards an exit condition, it will either loop infinitely (While) or execute an incorrect number of times (For/ForEach).",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-rh-1W': {
            skill: 'blueprints',
            title: 'Dead End: Wrong Loop Type',
            prompt: "Replacing the loop type didn't solve the problem. The core issue is still that the loop's termination condition isn't being met, regardless of the loop construct. You've either introduced new errors or just masked the original problem.",
            choices: [
                {
                    text: "Focus on the termination condition]",
                    type: 'correct',
                    feedback: "You understand that the type of loop is secondary to ensuring its termination condition is properly handled. You need to go back and analyze the original While Loop's condition and what affects it.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'blueprints',
            title: 'Standalone Game Verification',
            prompt: "The fix works in PIE, but sometimes PIE can mask issues that appear in a packaged or standalone build. How do you perform a more robust verification?",
            choices: [
                {
                    text: "Launch Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone mode (File > Launch Game > Standalone Game). The game loads, the Blueprint executes, and the loop completes without freezing. This confirms the fix holds up outside of the editor's PIE environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Rebuild Project]",
                    type: 'wrong',
                    feedback: "While rebuilding the project is good practice, it's not a direct verification of the runtime behavior of the loop in a different environment. You need to *run* the game outside of PIE.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'blueprints',
            title: 'Dead End: Rebuild Only',
            prompt: "Rebuilding the project is good, but it doesn't tell you if the loop behaves correctly in a standalone game. You need to actually run the game in a more production-like environment.",
            choices: [
                {
                    text: "Launch Standalone Game]",
                    type: 'correct',
                    feedback: "You realize you need to actually run the game in Standalone mode to verify the fix in a more robust environment.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'blueprints',
            title: 'Performance Profiling',
            prompt: "The loop no longer freezes, but an inefficient loop could still cause performance hitches. How do you ensure the fixed loop isn't causing a performance bottleneck?",
            choices: [
                {
                    text: "Use Stat Commands (e.g., stat unit, stat game)]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat game` in the console while the loop is executing. You observe that the game thread time remains stable and doesn't spike excessively during the loop's execution, indicating it's now terminating quickly and efficiently without hogging CPU resources.",
                    next: 'step-ver-1'
                },
                {
                    text: "Check Task Manager]",
                    type: 'wrong',
                    feedback: "While Task Manager can show overall CPU usage, it's too coarse-grained to pinpoint specific in-game performance bottlenecks caused by a Blueprint loop. You need in-engine profiling tools.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'blueprints',
            title: 'Dead End: Task Manager',
            prompt: "Task Manager is too general. You need to see *in-engine* performance metrics to confirm the loop isn't causing a hitch.",
            choices: [
                {
                    text: "Use Stat Commands]",
                    type: 'correct',
                    feedback: "You realize that Unreal Engine's built-in `stat` commands are essential for detailed performance analysis.",
                    next: 'step-ver-1'
                },
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