window.SCENARIOS['PlayerLockedAfterCinematic'] = {
    meta: {
        expanded: true,
        title: "Input Locked After Cinematic",
        description: "Player stuck after cutscene. Investigates Camera Cut track and OnFinished events.",
        estimateHours: 3.5,
        category: "Cinematics"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'sequencer',
            title: 'The Symptom',
            prompt: "A cinematic finishes, but the player is stuck: input stays disabled and the camera never returns to the gameplay view. The game looks frozen on the last shot of the sequence. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You turn on logging and Sequencer debug, then replay the cinematic. You see the Level Sequence playing through to the end, but the \"On Finished\" logic never seems to fire and the active camera never switches back to the player. This points to an issue with the Level Sequence Player events or the Camera Cut track restoring state.",
                    next: 'step-inv-1'
                },
                {
                    text: "Wrong Guess]",
                    type: 'wrong',
                    feedback: "You start tweaking the character's input settings and rechecking the Player Controller, but nothing changes--the camera is still stuck on the cinematic shot and input stays locked. Clearly the problem is tied to the sequence ending, not the base character blueprint.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'sequencer',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path, assuming the problem was in the character or controller setup. Those changes didn't restore camera control after the cinematic.",
            choices: [
                {
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the unnecessary character/controller tweaks and refocus on the Level Sequence itself--specifically what happens when it stops and how the camera is being driven.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-2': {
            skill: 'sequencer',
            title: 'Investigation',
            prompt: "You open the Level Sequence and inspect the Camera Cut track and the Blueprint logic that starts the cinematic. You want to see what happens when the sequence finishes. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the Camera Cut track is driving the view for the entire cinematic, but \"Restore State\" isn't enabled on that track, so the camera isn't being handed back automatically. On top of that, the Level Sequence Player's OnFinished/OnStop event either isn't bound at all or doesn't call \"Set View Target with Blend\" back to the player's camera and re-enable input. In short, nothing tells the game to return control to the player when the sequence ends.",
                    next: 'step-3'
                },
                {
                    text: "Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You consider extending the cinematic with extra empty frames or adding a second sequence to \"unstick\" the player, but that doesn't address the core issue: the camera cut and OnFinished logic never restore the player view or input.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'sequencer',
            title: 'Dead End: Misguided',
            prompt: "That workaround didn't help because the game still doesn't have any explicit instruction to give control back to the player once the cinematic ends.",
            choices: [
                {
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must either let Sequencer restore the previous camera state automatically via the Camera Cut track or explicitly set the player camera and input in the Level Sequence Player's OnFinished/OnStop event.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'sequencer',
            title: 'The Fix',
            prompt: "You know the camera remains bound to the cinematic and the OnFinished event isn't handing control back to the player. How do you fix it?",
            choices: [
                {
                    text: "Ensure Camera Cut 'Restore State' is on or manually set View Target.]",
                    type: 'correct',
                    feedback: "In the Level Sequence, you enable \"Restore State\" on the Camera Cut track so that when the cinematic ends, Sequencer restores the previous gameplay camera automatically. In Blueprint, you also hook into the Level Sequence Player's OnFinished/OnStop event and call \"Set View Target with Blend\" on the Player Controller, targeting the player's camera and re-enabling player input. With these changes, the game cleanly returns control to the player after the sequence.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'sequencer',
            title: 'Verification',
            prompt: "You test the cinematic again in PIE: it should play fully, then hand camera and input back to the player. How do you verify the fix?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, the cinematic runs, the camera follows the scripted shots, and when the sequence finishes, the view smoothly blends back to the player's camera. Input is re-enabled and you can move the character again. The player is no longer stuck, confirming that the Camera Cut \"Restore State\" / View Target fix worked.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'sequencer',
            title: 'Step 1a: Deeper Debugging - View Modes & Console',
            prompt: "The logs confirm the sequence plays, but the camera and input are stuck. Before diving into the sequence asset, what specific debug views or console commands can give you more insight into the active camera, input state, and sequencer's internal workings?",
            choices: [
                {
                    text: "Use `ShowFlag.Sequencer 1`, `ShowFlag.Game 0`, `debug camera`, `displayall PlayerController`]",
                    type: 'correct',
                    feedback: "You enable Sequencer debug flags, switch to `debug camera` to see if the player camera is even active, and use `displayall PlayerController` to inspect its properties. You notice `bBlockInput` is true and `bAutoManageActiveCameraTarget` is false, and the active camera target is still the cinematic camera. This confirms the Player Controller is indeed locked and not managing the camera, and the cinematic camera is still the active view.",
                    next: 'step-inv-2'
                },
                {
                    text: "Check `stat fps` and `stat unit`]",
                    type: 'wrong',
                    feedback: "While performance is always good to monitor, `stat fps` and `stat unit` don't directly tell you why input is blocked or the camera is stuck. The game isn't necessarily performing poorly, it's just not transitioning correctly. This is a red herring for the immediate problem.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-inv-2': {
            skill: 'blueprint',
            title: 'Step 1b: Player Controller & Camera Manager Inspection',
            prompt: "You've confirmed the Player Controller is blocking input and the cinematic camera is still active. Now, how do you investigate *why* the Player Controller isn't taking back control, and if there are any conflicting camera managers or sequence players?",
            choices: [
                {
                    text: "Inspect Player Controller Blueprint, check `GetPlayerCameraManager`]",
                    type: 'correct',
                    feedback: "You open the Player Controller Blueprint and search for any `Disable Input` or `Set View Target` nodes. You also use `GetPlayerCameraManager` to see what camera is currently active and if its `bAlwaysFollowPlayer` is set. You find no explicit `Enable Input` call after the cinematic, and the `PlayerCameraManager` is still pointing to the cinematic camera, or its `bAlwaysFollowPlayer` is overridden.",
                    next: 'step-inv-3'
                },
                {
                    text: "Re-import the cinematic sequence]",
                    type: 'misguided',
                    feedback: "Re-importing the sequence is unlikely to fix a logic issue with camera and input hand-off. The problem isn't with the sequence asset itself, but how it interacts with the game state upon completion.",
                    next: 'step-inv-2M'
                },
            ]
        },

        'step-inv-2M': {
            skill: 'sequencer',
            title: 'Dead End: Re-importing Sequence',
            prompt: "Re-importing the sequence didn't help. The issue isn't with the asset's integrity, but with the logic governing its interaction with the Player Controller and Camera Manager at the end of playback.",
            choices: [
                {
                    text: "Focus on Player Controller and Camera Manager logic]",
                    type: 'correct',
                    feedback: "You realize the problem lies in the game's logic for restoring player control, not the sequence asset itself. You need to investigate the Player Controller and Camera Manager's state after the cinematic.",
                    next: 'step-inv-3'
                },
            ]
        },

        'step-inv-3': {
            skill: 'sequencer',
            title: 'Step 1c: Sequencer Player Events & Camera Cut Track',
            prompt: "You've narrowed it down to the Player Controller not regaining control and the camera manager being stuck. Now, you need to look at the Level Sequence Player itself and its interaction with the Camera Cut track. What specific settings and events are crucial here?",
            choices: [
                {
                    text: "Check Level Sequence Player's `OnFinished` / `OnStop` events and Camera Cut track's `Restore State`]",
                    type: 'correct',
                    feedback: "You open the Blueprint that plays the Level Sequence and inspect the `Level Sequence Player` variable. You check if its `OnFinished` or `OnStop` events are bound and, if so, what logic they execute. Crucially, you also open the Level Sequence itself and select the `Camera Cut` track, checking if its `Restore State` property is enabled. You find that either the events aren't bound, or the bound logic doesn't `Set View Target with Blend` back to the player and `Enable Input`, and the `Camera Cut` track's `Restore State` is disabled.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'optimization',
            title: 'Dead End: Misdiagnosing Performance',
            prompt: "You spent time checking `stat fps` and `stat unit`, but the game's performance seems fine. The issue isn't a hitch or a loading stall; it's a clear failure to transition control. What's your next move to get back on track?",
            choices: [
                {
                    text: "Re-focus on camera and input control logic]",
                    type: 'correct',
                    feedback: "You realize that while performance is important, it's not the root cause here. The problem is a specific logic failure in handing control back to the player. You need to investigate the Player Controller's state and camera management more directly.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-ver-1': {
            skill: 'testing',
            title: 'Step 4a: Standalone Game Verification',
            prompt: "PIE testing is good, but sometimes issues only appear in a more 'cooked' environment. How do you verify the fix in a more robust, near-shipping environment?",
            choices: [
                {
                    text: "Launch in Standalone Game mode]",
                    type: 'correct',
                    feedback: "You launch the game in 'Standalone Game' mode. The cinematic plays, and just like in PIE, the camera smoothly blends back to the player, and input is fully restored. This confirms the fix holds up outside of the editor's immediate context.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'optimization',
            title: 'Step 4b: Performance and Edge Case Check',
            prompt: "The core issue is fixed, but it's good practice to ensure no new performance regressions or unexpected behaviors were introduced. What final checks do you perform?",
            choices: [
                {
                    text: "Check `stat unit` and `stat game` during transition, try skipping cinematic]",
                    type: 'correct',
                    feedback: "You replay the cinematic, monitoring `stat unit` and `stat game` during the transition to ensure there are no unexpected hitches or frame drops. You also test any 'skip cinematic' functionality to ensure it correctly aborts the sequence and restores player control without issues. Everything looks clean, confirming a robust fix.",
                    next: 'step-ver-1'
                },
            ]
        },

        
        'step-inv-1': {
            skill: 'sequencer, debugging',
            title: 'Deeper Debugging - Console Commands',
            prompt: "The logs confirm the sequence finishes, but the camera and input are still stuck. What specific console commands or debug tools can you use to get more insight into Sequencer's state and camera control?",
            choices: [
                {
                    text: "Use `sequencer.Debug 1`, `a.Sequencer.DebugCameraCut 1`, and `showdebug playercontroller`]",
                    type: 'correct',
                    feedback: "Enabling these debug commands reveals that the Camera Cut track is indeed active until the very end, and then no explicit command to switch view targets is issued. `showdebug playercontroller` confirms the Player Controller's input mode is still set to UI Only or Game and UI, and its view target is still the cinematic camera.",
                    next: 'step-inv-2'
                },
                {
                    text: "Try `stat fps` and `stat unit`]",
                    type: 'wrong',
                    feedback: "While useful for performance, `stat fps` and `stat unit` don't provide direct insight into why the camera or input is stuck. You need more specific debugging for Sequencer and camera control.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'debugging',
            title: 'Dead End: Irrelevant Stats',
            prompt: "You checked general performance stats, but they didn't explain the stuck camera or input. You need to focus on camera and input specific debugging.",
            choices: [
                {
                    text: "Re-evaluate and use targeted debug commands]",
                    type: 'correct',
                    feedback: "You realize the need for specific Sequencer and Player Controller debug commands to pinpoint the issue.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'blueprint, debugging',
            title: 'Player Controller and Input State',
            prompt: "The debug commands hint at the Player Controller's state. How do you directly inspect the Player Controller's current view target and input mode after the cinematic ends?",
            choices: [
                {
                    text: "Use Blueprint Debugger to inspect Player Controller instance, or console commands like `dumpplayercontroller`]",
                    type: 'correct',
                    feedback: "Using the Blueprint Debugger, you confirm that the Player Controller's `ViewTarget` is still set to the cinematic camera or a null reference, and its `InputMode` is `UIOnly` or `GameAndUI` with `bShowMouseCursor` potentially true, preventing gameplay input.",
                    next: 'step-inv-3'
                },
                {
                    text: "Check the Game Mode settings for input defaults]",
                    type: 'wrong',
                    feedback: "While Game Mode sets defaults, the problem is a *change* that isn't being reverted. Checking defaults won't show why the current state is stuck.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'blueprint',
            title: 'Dead End: Game Mode Defaults',
            prompt: "Checking Game Mode defaults won't reveal why the *current* Player Controller state is stuck after the cinematic. You need to inspect the live state.",
            choices: [
                {
                    text: "Focus on live Player Controller state]",
                    type: 'correct',
                    feedback: "You realize the problem is dynamic state not being reset, not a static default.",
                    next: 'step-inv-3'
                },
            ]
        },

        'step-inv-3': {
            skill: 'ui, input',
            title: 'Red Herring - UI Input Mode',
            prompt: "Given the input is locked, you suspect a UI element might be holding the input mode. What's a common mistake that can cause this after a cinematic?",
            choices: [
                {
                    text: "A UI widget was added to viewport with `SetInputMode_UIOnly` or `GameAndUI` and never removed or reset input mode.]",
                    type: 'correct',
                    feedback: "You check the Blueprint logic that starts the cinematic and find that a UI widget is indeed added, and `SetInputMode_UIOnly` is called, but there's no corresponding `RemoveFromParent` or `SetInputMode_GameOnly` call when the cinematic finishes. This is a strong candidate for the input lock, but the camera issue remains separate.",
                    next: 'step-inv-1'
                },
                {
                    text: "The player character's movement component is disabled.]",
                    type: 'wrong',
                    feedback: "While disabling movement would prevent character movement, it wouldn't explain the camera being stuck on a cinematic shot or the general input lock (e.g., mouse cursor showing). The problem is higher level.",
                    next: 'step-inv-3W'
                },
            ]
        },

        'step-inv-3W': {
            skill: 'character',
            title: 'Dead End: Character Movement',
            prompt: "Disabling character movement wouldn't explain the camera being stuck or the general input lock. The issue is likely with the Player Controller's view target or input mode.",
            choices: [
                {
                    text: "Re-focus on Player Controller and cinematic logic]",
                    type: 'correct',
                    feedback: "You realize the problem is more fundamental than just character movement.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'testing',
            title: 'Verification - Standalone Game',
            prompt: "PIE is good for quick iteration, but sometimes issues only manifest in a more 'cooked' environment. How do you verify the fix in a more robust testing scenario?",
            choices: [
                {
                    text: "Launch the game in Standalone Game mode and test the cinematic.]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone Game mode. The cinematic plays perfectly, and the transition back to gameplay is smooth, with full player control restored. This confirms the fix holds up outside of the PIE environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Build a full shipping package and test it.]",
                    type: 'wrong',
                    feedback: "While a shipping build is the ultimate test, it's too time-consuming for an intermediate verification step. Standalone Game mode offers a good balance of fidelity and iteration speed.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'testing',
            title: 'Dead End: Overkill Testing',
            prompt: "Building a full shipping package is too slow for this stage of verification. You need a quicker, yet more robust, test than PIE.",
            choices: [
                {
                    text: "Choose a faster, more representative test environment]",
                    type: 'correct',
                    feedback: "You realize Standalone Game mode is the ideal balance for this verification.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'optimization, debugging',
            title: 'Verification - Performance Check',
            prompt: "The cinematic now works, but it's good practice to ensure there are no lingering performance issues or unexpected resource usage after the sequence. What do you check?",
            choices: [
                {
                    text: "Use `stat unit`, `stat game`, and `stat rhi` before, during, and after the cinematic.]",
                    type: 'correct',
                    feedback: "You monitor performance stats. You observe a temporary spike during the cinematic (expected due to rendering complexity), but after it finishes and control returns to the player, the `Game Thread`, `Draw Thread`, and `GPU` times return to normal, stable gameplay values. This confirms the cinematic system isn't leaving any unnecessary overhead.",
                    next: 'step-ver-1'
                },
                {
                    text: "Check the size of the Level Sequence asset on disk.]",
                    type: 'wrong',
                    feedback: "Asset size on disk doesn't directly correlate to runtime performance issues after the sequence has finished playing. You need to monitor live performance metrics.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'optimization',
            title: 'Dead End: Irrelevant Metric',
            prompt: "Asset size doesn't tell you about runtime performance. You need to monitor live performance metrics.",
            choices: [
                {
                    text: "Focus on runtime performance stats]",
                    type: 'correct',
                    feedback: "You realize the importance of live performance monitoring.",
                    next: 'step-ver-1'
                },
            ]
        },
                }
            ]
        },
        
        'step-inv-1': {
            skill: 'sequencer',
            title: 'Step 1a: Deeper Debugging - View Modes & Console',
            prompt: "The logs confirm the sequence plays, but the camera and input are stuck. Before diving into the sequence asset, what specific debug views or console commands can give you more insight into the active camera, input state, and sequencer's internal workings?",
            choices: [
                {
                    text: "Use `ShowFlag.Sequencer 1`, `ShowFlag.Game 0`, `debug camera`, `displayall PlayerController`]",
                    type: 'correct',
                    feedback: "You enable Sequencer debug flags, switch to `debug camera` to see if the player camera is even active, and use `displayall PlayerController` to inspect its properties. You notice `bBlockInput` is true and `bAutoManageActiveCameraTarget` is false, and the active camera target is still the cinematic camera. This confirms the Player Controller is indeed locked and not managing the camera, and the cinematic camera is still the active view.",
                    next: 'step-inv-2'
                },
                {
                    text: "Check `stat fps` and `stat unit`]",
                    type: 'wrong',
                    feedback: "While performance is always good to monitor, `stat fps` and `stat unit` don't directly tell you why input is blocked or the camera is stuck. The game isn't necessarily performing poorly, it's just not transitioning correctly. This is a red herring for the immediate problem.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-inv-2': {
            skill: 'blueprint',
            title: 'Step 1b: Player Controller & Camera Manager Inspection',
            prompt: "You've confirmed the Player Controller is blocking input and the cinematic camera is still active. Now, how do you investigate *why* the Player Controller isn't taking back control, and if there are any conflicting camera managers or sequence players?",
            choices: [
                {
                    text: "Inspect Player Controller Blueprint, check `GetPlayerCameraManager`]",
                    type: 'correct',
                    feedback: "You open the Player Controller Blueprint and search for any `Disable Input` or `Set View Target` nodes. You also use `GetPlayerCameraManager` to see what camera is currently active and if its `bAlwaysFollowPlayer` is set. You find no explicit `Enable Input` call after the cinematic, and the `PlayerCameraManager` is still pointing to the cinematic camera, or its `bAlwaysFollowPlayer` is overridden.",
                    next: 'step-inv-3'
                },
                {
                    text: "Re-import the cinematic sequence]",
                    type: 'misguided',
                    feedback: "Re-importing the sequence is unlikely to fix a logic issue with camera and input hand-off. The problem isn't with the sequence asset itself, but how it interacts with the game state upon completion.",
                    next: 'step-inv-2M'
                },
            ]
        },

        'step-inv-2M': {
            skill: 'sequencer',
            title: 'Dead End: Re-importing Sequence',
            prompt: "Re-importing the sequence didn't help. The issue isn't with the asset's integrity, but with the logic governing its interaction with the Player Controller and Camera Manager at the end of playback.",
            choices: [
                {
                    text: "Focus on Player Controller and Camera Manager logic]",
                    type: 'correct',
                    feedback: "You realize the problem lies in the game's logic for restoring player control, not the sequence asset itself. You need to investigate the Player Controller and Camera Manager's state after the cinematic.",
                    next: 'step-inv-3'
                },
            ]
        },

        'step-inv-3': {
            skill: 'sequencer',
            title: 'Step 1c: Sequencer Player Events & Camera Cut Track',
            prompt: "You've narrowed it down to the Player Controller not regaining control and the camera manager being stuck. Now, you need to look at the Level Sequence Player itself and its interaction with the Camera Cut track. What specific settings and events are crucial here?",
            choices: [
                {
                    text: "Check Level Sequence Player's `OnFinished` / `OnStop` events and Camera Cut track's `Restore State`]",
                    type: 'correct',
                    feedback: "You open the Blueprint that plays the Level Sequence and inspect the `Level Sequence Player` variable. You check if its `OnFinished` or `OnStop` events are bound and, if so, what logic they execute. Crucially, you also open the Level Sequence itself and select the `Camera Cut` track, checking if its `Restore State` property is enabled. You find that either the events aren't bound, or the bound logic doesn't `Set View Target with Blend` back to the player and `Enable Input`, and the `Camera Cut` track's `Restore State` is disabled.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'optimization',
            title: 'Dead End: Misdiagnosing Performance',
            prompt: "You spent time checking `stat fps` and `stat unit`, but the game's performance seems fine. The issue isn't a hitch or a loading stall; it's a clear failure to transition control. What's your next move to get back on track?",
            choices: [
                {
                    text: "Re-focus on camera and input control logic]",
                    type: 'correct',
                    feedback: "You realize that while performance is important, it's not the root cause here. The problem is a specific logic failure in handing control back to the player. You need to investigate the Player Controller's state and camera management more directly.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-ver-1': {
            skill: 'testing',
            title: 'Step 4a: Standalone Game Verification',
            prompt: "PIE testing is good, but sometimes issues only appear in a more 'cooked' environment. How do you verify the fix in a more robust, near-shipping environment?",
            choices: [
                {
                    text: "Launch in Standalone Game mode]",
                    type: 'correct',
                    feedback: "You launch the game in 'Standalone Game' mode. The cinematic plays, and just like in PIE, the camera smoothly blends back to the player, and input is fully restored. This confirms the fix holds up outside of the editor's immediate context.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'optimization',
            title: 'Step 4b: Performance and Edge Case Check',
            prompt: "The core issue is fixed, but it's good practice to ensure no new performance regressions or unexpected behaviors were introduced. What final checks do you perform?",
            choices: [
                {
                    text: "Check `stat unit` and `stat game` during transition, try skipping cinematic]",
                    type: 'correct',
                    feedback: "You replay the cinematic, monitoring `stat unit` and `stat game` during the transition to ensure there are no unexpected hitches or frame drops. You also test any 'skip cinematic' functionality to ensure it correctly aborts the sequence and restores player control without issues. Everything looks clean, confirming a robust fix.",
                    next: 'step-ver-1'
                },
            ]
        },

        
        'step-inv-1': {
            skill: 'sequencer, debugging',
            title: 'Deeper Debugging - Console Commands',
            prompt: "The logs confirm the sequence finishes, but the camera and input are still stuck. What specific console commands or debug tools can you use to get more insight into Sequencer's state and camera control?",
            choices: [
                {
                    text: "Use `sequencer.Debug 1`, `a.Sequencer.DebugCameraCut 1`, and `showdebug playercontroller`]",
                    type: 'correct',
                    feedback: "Enabling these debug commands reveals that the Camera Cut track is indeed active until the very end, and then no explicit command to switch view targets is issued. `showdebug playercontroller` confirms the Player Controller's input mode is still set to UI Only or Game and UI, and its view target is still the cinematic camera.",
                    next: 'step-inv-2'
                },
                {
                    text: "Try `stat fps` and `stat unit`]",
                    type: 'wrong',
                    feedback: "While useful for performance, `stat fps` and `stat unit` don't provide direct insight into why the camera or input is stuck. You need more specific debugging for Sequencer and camera control.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'debugging',
            title: 'Dead End: Irrelevant Stats',
            prompt: "You checked general performance stats, but they didn't explain the stuck camera or input. You need to focus on camera and input specific debugging.",
            choices: [
                {
                    text: "Re-evaluate and use targeted debug commands]",
                    type: 'correct',
                    feedback: "You realize the need for specific Sequencer and Player Controller debug commands to pinpoint the issue.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'blueprint, debugging',
            title: 'Player Controller and Input State',
            prompt: "The debug commands hint at the Player Controller's state. How do you directly inspect the Player Controller's current view target and input mode after the cinematic ends?",
            choices: [
                {
                    text: "Use Blueprint Debugger to inspect Player Controller instance, or console commands like `dumpplayercontroller`]",
                    type: 'correct',
                    feedback: "Using the Blueprint Debugger, you confirm that the Player Controller's `ViewTarget` is still set to the cinematic camera or a null reference, and its `InputMode` is `UIOnly` or `GameAndUI` with `bShowMouseCursor` potentially true, preventing gameplay input.",
                    next: 'step-inv-3'
                },
                {
                    text: "Check the Game Mode settings for input defaults]",
                    type: 'wrong',
                    feedback: "While Game Mode sets defaults, the problem is a *change* that isn't being reverted. Checking defaults won't show why the current state is stuck.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'blueprint',
            title: 'Dead End: Game Mode Defaults',
            prompt: "Checking Game Mode defaults won't reveal why the *current* Player Controller state is stuck after the cinematic. You need to inspect the live state.",
            choices: [
                {
                    text: "Focus on live Player Controller state]",
                    type: 'correct',
                    feedback: "You realize the problem is dynamic state not being reset, not a static default.",
                    next: 'step-inv-3'
                },
            ]
        },

        'step-inv-3': {
            skill: 'ui, input',
            title: 'Red Herring - UI Input Mode',
            prompt: "Given the input is locked, you suspect a UI element might be holding the input mode. What's a common mistake that can cause this after a cinematic?",
            choices: [
                {
                    text: "A UI widget was added to viewport with `SetInputMode_UIOnly` or `GameAndUI` and never removed or reset input mode.]",
                    type: 'correct',
                    feedback: "You check the Blueprint logic that starts the cinematic and find that a UI widget is indeed added, and `SetInputMode_UIOnly` is called, but there's no corresponding `RemoveFromParent` or `SetInputMode_GameOnly` call when the cinematic finishes. This is a strong candidate for the input lock, but the camera issue remains separate.",
                    next: 'step-inv-1'
                },
                {
                    text: "The player character's movement component is disabled.]",
                    type: 'wrong',
                    feedback: "While disabling movement would prevent character movement, it wouldn't explain the camera being stuck on a cinematic shot or the general input lock (e.g., mouse cursor showing). The problem is higher level.",
                    next: 'step-inv-3W'
                },
            ]
        },

        'step-inv-3W': {
            skill: 'character',
            title: 'Dead End: Character Movement',
            prompt: "Disabling character movement wouldn't explain the camera being stuck or the general input lock. The issue is likely with the Player Controller's view target or input mode.",
            choices: [
                {
                    text: "Re-focus on Player Controller and cinematic logic]",
                    type: 'correct',
                    feedback: "You realize the problem is more fundamental than just character movement.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'testing',
            title: 'Verification - Standalone Game',
            prompt: "PIE is good for quick iteration, but sometimes issues only manifest in a more 'cooked' environment. How do you verify the fix in a more robust testing scenario?",
            choices: [
                {
                    text: "Launch the game in Standalone Game mode and test the cinematic.]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone Game mode. The cinematic plays perfectly, and the transition back to gameplay is smooth, with full player control restored. This confirms the fix holds up outside of the PIE environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Build a full shipping package and test it.]",
                    type: 'wrong',
                    feedback: "While a shipping build is the ultimate test, it's too time-consuming for an intermediate verification step. Standalone Game mode offers a good balance of fidelity and iteration speed.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'testing',
            title: 'Dead End: Overkill Testing',
            prompt: "Building a full shipping package is too slow for this stage of verification. You need a quicker, yet more robust, test than PIE.",
            choices: [
                {
                    text: "Choose a faster, more representative test environment]",
                    type: 'correct',
                    feedback: "You realize Standalone Game mode is the ideal balance for this verification.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'optimization, debugging',
            title: 'Verification - Performance Check',
            prompt: "The cinematic now works, but it's good practice to ensure there are no lingering performance issues or unexpected resource usage after the sequence. What do you check?",
            choices: [
                {
                    text: "Use `stat unit`, `stat game`, and `stat rhi` before, during, and after the cinematic.]",
                    type: 'correct',
                    feedback: "You monitor performance stats. You observe a temporary spike during the cinematic (expected due to rendering complexity), but after it finishes and control returns to the player, the `Game Thread`, `Draw Thread`, and `GPU` times return to normal, stable gameplay values. This confirms the cinematic system isn't leaving any unnecessary overhead.",
                    next: 'step-ver-1'
                },
                {
                    text: "Check the size of the Level Sequence asset on disk.]",
                    type: 'wrong',
                    feedback: "Asset size on disk doesn't directly correlate to runtime performance issues after the sequence has finished playing. You need to monitor live performance metrics.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'optimization',
            title: 'Dead End: Irrelevant Metric',
            prompt: "Asset size doesn't tell you about runtime performance. You need to monitor live performance metrics.",
            choices: [
                {
                    text: "Focus on runtime performance stats]",
                    type: 'correct',
                    feedback: "You realize the importance of live performance monitoring.",
                    next: 'step-ver-1'
                },
            ]
        },

        'conclusion': {
            skill: 'sequencer',
            title: 'Conclusion',
            prompt: "Lesson: If a player is stuck after a cinematic, verify that the Level Sequence correctly hands control back. Enable \"Restore State\" on the Camera Cut track or, in the Level Sequence Player's OnFinished/OnStop event, explicitly call \"Set View Target with Blend\" back to the player camera and re-enable input so gameplay can resume.",
            choices: []
        }
    }
};