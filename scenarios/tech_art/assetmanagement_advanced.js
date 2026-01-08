window.SCENARIOS['AnimNotifiesNotFiring'] = {
    meta: {
        title: "Anim Notifies Not Firing in PIE",
        description: "Attack animation plays but effects (Notifies) are missing in PIE. Investigates Montage vs Sequence playback and Notify Trigger Modes.",
        estimateHours: 3.5,
        category: "Assets"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'asset_management',
            title: 'The Symptom',
            prompt: "Your attack animation plays in-game, but the Particle and Sound effects that you see in the animation asset preview never appear in PIE. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You enable animation debugging / notify visualization and log output. In the Animation Preview the notifies clearly fire, but in PIE you see no notify debug messages at all when the attack plays--suggesting the notifies aren't being triggered in-game.",
                    next: 'step-2'
                },
                {
                    text: "Wrong Guess]",
                    type: 'wrong',
                    feedback: "You spend time tweaking Niagara and audio settings, but the effects still never trigger in PIE. The attack animation plays, so this is probably not a simple VFX/audio setup issue.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'asset_management',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the VFX/audio rabbit hole--recompiling systems, swapping sounds--but nothing changed. The animation plays, yet no notifies fire in PIE.",
            choices: [
                {
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You roll back the unnecessary changes and refocus on how and when the animation notifies are actually evaluated in the attack animation.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'asset_management',
            title: 'Investigation',
            prompt: "You open the attack animation asset and inspect the notify track and how the animation is played in the Animation Blueprint. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You discover that the notifies are configured as \"Montage Only\" (or their Notify Trigger Mode is set for a montage slot), but in-game the attack is being played as a raw sequence in the AnimGraph. Because it isn't running through the montage system or the expected slot, those notifies never fire during PIE.",
                    next: 'step-3'
                },
                {
                    text: "Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try re-adding the notifies, duplicating the animation, or reimporting the FX assets. The notifies still don't fire in PIE because the way the animation is played (sequence vs montage / slot) and the Notify Trigger Mode are still mismatched.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'asset_management',
            title: 'Dead End: Misguided',
            prompt: "That didn't work because the issue isn't missing assets--it's when and how the notifies are evaluated. If the animation is played as a sequence but the notifies are set up for montage-only triggering, they will never fire.",
            choices: [
                {
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must either adjust the Notify Trigger Mode to match how the animation is played, or switch to playing the attack via an Animation Montage that uses the correct notify-bearing slot.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'asset_management',
            title: 'The Fix',
            prompt: "You now know the notifies are configured for the wrong context (Montage Only vs Sequence, or an incompatible Notify Trigger Mode). How do you fix it?",
            choices: [
                {
                    text: "Check Notify Trigger Mode or use Montage.]",
                    type: 'correct',
                    feedback: "You update the setup: either you switch the attack to play through an Animation Montage using the correct slot, or you change the Anim Notify Trigger Mode so notifies fire for the way the animation is actually played (sequence vs montage). After saving the animation and Animation Blueprint, the notifies are now eligible to trigger in PIE.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'asset_management',
            title: 'Verification',
            prompt: "You re-run the game in PIE and trigger the attack again with your updated notify configuration. What happens now?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, when the attack animation plays, the Anim Notifies now fire as expected: the Particle Effect spawns and the Sound cue plays at the correct frames. Your debug output also shows the notify events triggering, confirming that the fix worked.",
                    next: 'step-1R_replication_check'
                }
            ]
        },
        'step-1R_replication_check': {
            skill: 'multiplayer_replication',
            title: 'Step 1R: Red Herring - Replication Check',
            prompt: "In a multiplayer game, sometimes effects only trigger on the server or client due to replication issues. Could this be the case for your Anim Notifies?",
            choices: [
                {
                    text: "Test in a multiplayer PIE session, observing both server and client views.]",
                    type: 'correct',
                    feedback: "You test in a multiplayer PIE session. The notifies still fail to fire on both server and client, indicating the problem is not replication-related but a fundamental issue with the notify triggering mechanism itself, regardless of network authority.",
                    next: 'step-1a_debug_anim'
                },
                {
                    text: "Add IsLocallyControlled checks to the Anim Notify Blueprint]",
                    type: 'wrong',
                    feedback: "While IsLocallyControlled is useful for client-side effects, the notifies aren't even *triggering* yet. Adding checks won't solve the underlying problem of them not firing at all.",
                    next: 'step-1R_replication_check_W'
                },
            ]
        },

        'step-1R_replication_check_W': {
            skill: 'multiplayer_replication',
            title: 'Dead End: Premature Replication Logic',
            prompt: "You're trying to control *who* sees the notify, but the notify isn't firing for *anyone*. The problem is more fundamental.",
            choices: [
                {
                    text: "Re-focus on why the notifies aren't triggering at all.]",
                    type: 'correct',
                    feedback: "You realize the core issue is the trigger mechanism, not network visibility.",
                    next: 'step-1a_debug_anim'
                },
            ]
        },

        'step-1a_debug_anim': {
            skill: 'debugging',
            title: 'Step 1a: Deep Dive with Animation Debugger',
            prompt: "You've confirmed no notifies fire in PIE. To get more granular detail on animation playback and notify evaluation, what advanced debugging tools can you use?",
            choices: [
                {
                    text: "Use `ShowDebug Animation` console command or Animation Debugger tool]",
                    type: 'correct',
                    feedback: "You activate `ShowDebug Animation` or open the Animation Debugger. While the animation state and blend weights appear correct, the 'Active Notifies' or 'Notify Events' section remains empty when the attack plays, confirming the engine isn't even *attempting* to trigger them.",
                    next: 'step-1b_check_anim_bp'
                },
                {
                    text: "Check collision settings on the character mesh]",
                    type: 'wrong',
                    feedback: "Collision settings are unrelated to Anim Notifies firing. This is a playback/triggering issue, not a physical interaction problem.",
                    next: 'step-1a_debug_anim_W'
                },
            ]
        },

        'step-1a_debug_anim_W': {
            skill: 'debugging',
            title: 'Dead End: Unrelated Check',
            prompt: "You're still looking in the wrong place. The problem is about *when* and *if* notifies are triggered, not physical interactions.",
            choices: [
                {
                    text: "Re-evaluate and use animation debugging tools]",
                    type: 'correct',
                    feedback: "You roll back the unnecessary changes and refocus on how and when the animation notifies are actually evaluated in the attack animation.",
                    next: 'step-1b_check_anim_bp'
                },
            ]
        },

        'step-1b_check_anim_bp': {
            skill: 'animation_blueprint',
            title: 'Step 1b: Verify Animation Playback Method',
            prompt: "The Animation Debugger confirms no notifies are triggering. Now, you need to investigate *how* the attack animation is being played within your Character's Animation Blueprint. Where do you look?",
            choices: [
                {
                    text: "Examine the AnimGraph's State Machine and Event Graph for animation playback nodes.]",
                    type: 'correct',
                    feedback: "You trace the animation's playback path. You find the attack animation is being played directly as a raw `Play Animation` node within a State Machine state, or via a `Play Sequence` node in the Event Graph, *not* through a `Play Montage` node or a specific montage slot.",
                    next: 'step-2'
                },
                {
                    text: "Re-import the animation asset with different settings]",
                    type: 'wrong',
                    feedback: "Re-importing the asset is unlikely to fix a playback logic issue. The asset itself works in the preview; the problem is how it's used in-game.",
                    next: 'step-1b_check_anim_bp_W'
                },
            ]
        },

        'step-1b_check_anim_bp_W': {
            skill: 'animation_blueprint',
            title: 'Dead End: Asset Re-import',
            prompt: "The issue isn't with the asset's import settings, but with the logic controlling its playback. You need to understand how the AnimBP is handling the animation.",
            choices: [
                {
                    text: "Focus on the AnimBP's playback logic]",
                    type: 'correct',
                    feedback: "You return to inspecting the AnimGraph and Event Graph to understand the animation's execution path.",
                    next: 'step-2'
                },
            ]
        },

        'step-4a_standalone_test': {
            skill: 'testing_deployment',
            title: 'Step 4a: Verify in Standalone Game',
            prompt: "The notifies are working correctly in PIE. To ensure the fix is robust and not subject to PIE-specific quirks, what's the next logical step for verification?",
            choices: [
                {
                    text: "Launch the game in 'Standalone Game' mode and test the attack.]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone mode. The attack animation plays, and the Anim Notifies fire perfectly, confirming the fix works outside of the Play In Editor environment.",
                    next: 'step-4b_performance_check'
                },
                {
                    text: "Immediately commit changes to version control without further testing]",
                    type: 'wrong',
                    feedback: "Committing without thorough testing, especially in a more production-like environment, can lead to regressions. Always verify beyond PIE.",
                    next: 'step-4a_standalone_test_W'
                },
            ]
        },

        'step-4a_standalone_test_W': {
            skill: 'testing_deployment',
            title: 'Dead End: Insufficient Testing',
            prompt: "Relying solely on PIE for verification can be risky. Some issues only manifest in a standalone build. What's a safer approach?",
            choices: [
                {
                    text: "Perform a standalone game test.]",
                    type: 'correct',
                    feedback: "You decide to test in a Standalone Game to ensure full compatibility.",
                    next: 'step-4b_performance_check'
                },
            ]
        },

        'step-4b_performance_check': {
            skill: 'performance_optimization',
            title: 'Step 4b: Performance and Resource Check',
            prompt: "With the notifies now firing correctly, it's good practice to ensure your fix hasn't introduced any unexpected performance overhead. What console commands or tools can help you monitor this?",
            choices: [
                {
                    text: "Use `stat anim` and `stat unit` console commands to monitor animation and game thread performance.]",
                    type: 'correct',
                    feedback: "You enable `stat anim` and `stat unit`. You observe that the notify triggering and associated effects (particles, sounds) have a negligible impact on animation update times or overall game thread performance, confirming an efficient solution.",
                    next: 'conclusion'
                },
                {
                    text: "Start optimizing other unrelated parts of the game]",
                    type: 'wrong',
                    feedback: "While optimization is good, it's important to first confirm the impact of *your* recent changes. Focus on the immediate area of the fix.",
                    next: 'step-4b_performance_check_W'
                },
            ]
        },

        'step-4b_performance_check_W': {
            skill: 'performance_optimization',
            title: 'Dead End: Misplaced Optimization',
            prompt: "Before optimizing broadly, you need to specifically check the performance impact of the changes you just made. How do you do that?",
            choices: [
                {
                    text: "Use `stat` commands to profile animation and overall performance.]",
                    type: 'correct',
                    feedback: "You decide to use profiling tools to specifically assess the impact of the notify fix.",
                    next: 'conclusion'
                },
            ]
        },

        'conclusion': {
            skill: 'asset_management',
            title: 'Conclusion',
            prompt: '<p>You successfully diagnosed and fixed the issue! By correctly configuring the Anim Notify Trigger Mode (or using a Montage) and verifying it wasn't a replication issue, the effects now play correctly.</p><strong>Scenario Complete.</strong>',
            choices: []
        },

        'step-1R_replication_check': {
            skill: 'multiplayer_replication',
            title: 'Step 1R: Red Herring - Replication Check',
            prompt: "In a multiplayer game, sometimes effects only trigger on the server or client due to replication issues. Could this be the case for your Anim Notifies?",
            choices: [
                {
                    text: "Test in a multiplayer PIE session, observing both server and client views.]",
                    type: 'correct',
                    feedback: "You test in a multiplayer PIE session. The notifies still fail to fire on both server and client, indicating the problem is not replication-related but a fundamental issue with the notify triggering mechanism itself, regardless of network authority.",
                    next: 'step-1a_debug_anim'
                },
                {
                    text: "Add IsLocallyControlled checks to the Anim Notify Blueprint]",
                    type: 'wrong',
                    feedback: "While IsLocallyControlled is useful for client-side effects, the notifies aren't even *triggering* yet. Adding checks won't solve the underlying problem of them not firing at all.",
                    next: 'step-1R_replication_check_W'
                },
            ]
        },

        'step-1R_replication_check_W': {
            skill: 'multiplayer_replication',
            title: 'Dead End: Premature Replication Logic',
            prompt: "You're trying to control *who* sees the notify, but the notify isn't firing for *anyone*. The problem is more fundamental.",
            choices: [
                {
                    text: "Re-focus on why the notifies aren't triggering at all.]",
                    type: 'correct',
                    feedback: "You realize the core issue is the trigger mechanism, not network visibility.",
                    next: 'step-1a_debug_anim'
                },
            ]
        },

        'step-1a_debug_anim': {
            skill: 'debugging',
            title: 'Step 1a: Deep Dive with Animation Debugger',
            prompt: "You've confirmed no notifies fire in PIE. To get more granular detail on animation playback and notify evaluation, what advanced debugging tools can you use?",
            choices: [
                {
                    text: "Use `ShowDebug Animation` console command or Animation Debugger tool]",
                    type: 'correct',
                    feedback: "You activate `ShowDebug Animation` or open the Animation Debugger. While the animation state and blend weights appear correct, the 'Active Notifies' or 'Notify Events' section remains empty when the attack plays, confirming the engine isn't even *attempting* to trigger them.",
                    next: 'step-1b_check_anim_bp'
                },
                {
                    text: "Check collision settings on the character mesh]",
                    type: 'wrong',
                    feedback: "Collision settings are unrelated to Anim Notifies firing. This is a playback/triggering issue, not a physical interaction problem.",
                    next: 'step-1a_debug_anim_W'
                },
            ]
        },

        'step-1a_debug_anim_W': {
            skill: 'debugging',
            title: 'Dead End: Unrelated Check',
            prompt: "You're still looking in the wrong place. The problem is about *when* and *if* notifies are triggered, not physical interactions.",
            choices: [
                {
                    text: "Re-evaluate and use animation debugging tools]",
                    type: 'correct',
                    feedback: "You roll back the unnecessary changes and refocus on how and when the animation notifies are actually evaluated in the attack animation.",
                    next: 'step-1b_check_anim_bp'
                },
            ]
        },

        'step-1b_check_anim_bp': {
            skill: 'animation_blueprint',
            title: 'Step 1b: Verify Animation Playback Method',
            prompt: "The Animation Debugger confirms no notifies are triggering. Now, you need to investigate *how* the attack animation is being played within your Character's Animation Blueprint. Where do you look?",
            choices: [
                {
                    text: "Examine the AnimGraph's State Machine and Event Graph for animation playback nodes.]",
                    type: 'correct',
                    feedback: "You trace the animation's playback path. You find the attack animation is being played directly as a raw `Play Animation` node within a State Machine state, or via a `Play Sequence` node in the Event Graph, *not* through a `Play Montage` node or a specific montage slot.",
                    next: 'step-2'
                },
                {
                    text: "Re-import the animation asset with different settings]",
                    type: 'wrong',
                    feedback: "Re-importing the asset is unlikely to fix a playback logic issue. The asset itself works in the preview; the problem is how it's used in-game.",
                    next: 'step-1b_check_anim_bp_W'
                },
            ]
        },

        'step-1b_check_anim_bp_W': {
            skill: 'animation_blueprint',
            title: 'Dead End: Asset Re-import',
            prompt: "The issue isn't with the asset's import settings, but with the logic controlling its playback. You need to understand how the AnimBP is handling the animation.",
            choices: [
                {
                    text: "Focus on the AnimBP's playback logic]",
                    type: 'correct',
                    feedback: "You return to inspecting the AnimGraph and Event Graph to understand the animation's execution path.",
                    next: 'step-2'
                },
            ]
        },

        'step-4a_standalone_test': {
            skill: 'testing_deployment',
            title: 'Step 4a: Verify in Standalone Game',
            prompt: "The notifies are working correctly in PIE. To ensure the fix is robust and not subject to PIE-specific quirks, what's the next logical step for verification?",
            choices: [
                {
                    text: "Launch the game in 'Standalone Game' mode and test the attack.]",
                    type: 'correct',
                    feedback: "You launch the game in Standalone mode. The attack animation plays, and the Anim Notifies fire perfectly, confirming the fix works outside of the Play In Editor environment.",
                    next: 'step-4b_performance_check'
                },
                {
                    text: "Immediately commit changes to version control without further testing]",
                    type: 'wrong',
                    feedback: "Committing without thorough testing, especially in a more production-like environment, can lead to regressions. Always verify beyond PIE.",
                    next: 'step-4a_standalone_test_W'
                },
            ]
        },

        'step-4a_standalone_test_W': {
            skill: 'testing_deployment',
            title: 'Dead End: Insufficient Testing',
            prompt: "Relying solely on PIE for verification can be risky. Some issues only manifest in a standalone build. What's a safer approach?",
            choices: [
                {
                    text: "Perform a standalone game test.]",
                    type: 'correct',
                    feedback: "You decide to test in a Standalone Game to ensure full compatibility.",
                    next: 'step-4b_performance_check'
                },
            ]
        },

        'step-4b_performance_check': {
            skill: 'performance_optimization',
            title: 'Step 4b: Performance and Resource Check',
            prompt: "With the notifies now firing correctly, it's good practice to ensure your fix hasn't introduced any unexpected performance overhead. What console commands or tools can help you monitor this?",
            choices: [
                {
                    text: "Use `stat anim` and `stat unit` console commands to monitor animation and game thread performance.]",
                    type: 'correct',
                    feedback: "You enable `stat anim` and `stat unit`. You observe that the notify triggering and associated effects (particles, sounds) have a negligible impact on animation update times or overall game thread performance, confirming an efficient solution.",
                    next: 'conclusion'
                },
                {
                    text: "Start optimizing other unrelated parts of the game]",
                    type: 'wrong',
                    feedback: "While optimization is good, it's important to first confirm the impact of *your* recent changes. Focus on the immediate area of the fix.",
                    next: 'step-4b_performance_check_W'
                },
            ]
        },

        'step-4b_performance_check_W': {
            skill: 'performance_optimization',
            title: 'Dead End: Misplaced Optimization',
            prompt: "Before optimizing broadly, you need to specifically check the performance impact of the changes you just made. How do you do that?",
            choices: [
                {
                    text: "Use `stat` commands to profile animation and overall performance.]",
                    type: 'correct',
                    feedback: "You decide to use profiling tools to specifically assess the impact of the notify fix.",
                    next: 'conclusion'
                },
            ]
        },

        'conclusion': {
            skill: 'asset_management',
            title: 'Conclusion',
            prompt: "Lesson: If Anim Notifies work in the animation preview but not in PIE, verify how the animation is played and how the notifies are configured. Ensure the Notify Trigger Mode matches your playback (sequence vs montage), or play the attack via a Montage when using montage-specific notifies and slots.",
            choices: []
        }
    }
};