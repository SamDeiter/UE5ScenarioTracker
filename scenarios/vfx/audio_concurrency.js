window.SCENARIOS['audio_concurrency'] = {
    meta: {
        title: "Audio: Sound Effects Cutting Out",
        description: "Gunshot sounds are cutting out when rapid-firing, or other sounds are disappearing during intense combat. Investigates Sound Concurrency and Priority settings through a complete debugging journey.",
        estimateHours: 3.5,
        difficulty: "Intermediate",
        category: "Audio"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'audio',
            title: 'Identifying the Problem',
            prompt: "<p>During a playtest, QA reports that gunshot sounds are inconsistently playing during rapid fire. Sometimes you hear every shot, sometimes only every other shot. The audio lead asks you to investigate.</p><strong>What's your first step to understand the scope of the problem?</strong>",
            choices: [
                {
                    text: 'Open the <strong>Output Log</strong> and filter for audio warnings while reproducing the issue in PIE.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> The Output Log often shows voice channel exhaustion warnings that directly point to concurrency issues.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Immediately increase the volume of the gunshot sound.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Volume has nothing to do with sounds failing to play. You need to understand the root cause first.</p>",
                    next: 'step-1W'
                },
                {
                    text: 'Check the Sound Cue asset to see if it has any obvious errors.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> This is a reasonable check, but without understanding the specific failure mode, you might miss the concurrency issue.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Ask QA to file a bug report with more details.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> You already have enough info to start investigating. Asking for more details delays the fix unnecessarily.</p>",
                    next: 'step-1M'
                }
            ]
        },

        'step-1W': {
            skill: 'audio',
            title: 'Volume Adjustment Failed',
            prompt: "<p>You increased the gunshot volume to maximum. The sounds that DO play are now painfully loud, but shots are still randomly missing. The audio lead is frustrated.</p><strong>What should you do now?</strong>",
            choices: [
                {
                    text: 'Revert the volume change and check the Output Log for audio system warnings.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Back on track. The log will reveal the true issue.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Try adjusting the pitch instead of volume.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> You're still treating the symptom, not the cause. This won't help.</p>",
                    next: 'step-2'
                }
            ]
        },

        'step-1M': {
            skill: 'audio',
            title: 'Waiting for QA',
            prompt: "<p>QA responds that they've already provided all the relevant info: rapid fire causes missing sounds. You've wasted time waiting for a response you didn't need.</p><strong>What's your next move?</strong>",
            choices: [
                {
                    text: 'Reproduce the issue yourself in PIE and check the Output Log.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You should have done this from the start, but at least you're investigating now.</p>",
                    next: 'step-2'
                }
            ]
        },

        'step-2': {
            skill: 'audio',
            title: 'Understanding Voice Limits',
            prompt: "<p>The Output Log shows: <code>Warning: Voice pool exhausted. Consider increasing voice count or using Sound Concurrency settings.</code></p><strong>What does this warning mean?</strong>",
            choices: [
                {
                    text: 'Research Sound Concurrency in the UE5 documentation to understand how the audio engine manages simultaneous sounds.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Understanding the system before making changes is the professional approach. Concurrency limits prevent audio channel exhaustion.</p>",
                    next: 'step-3'
                },
                {
                    text: 'Immediately increase the global voice count in Project Settings > Audio.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> This is a sledgehammer approach that wastes memory and CPU. Per-sound concurrency is more efficient.</p>",
                    next: 'step-2M'
                },
                {
                    text: 'Ignore the warning and assume it's a false positive.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> The engine is explicitly telling you what's wrong. Ignoring it wastes everyone's time.</p>",
                    next: 'step-3'
                },
                {
                    text: 'Check if the gunshot Sound Cue has a Concurrency asset assigned.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Good instinct, but understanding what Concurrency does first will help you configure it correctly.</p>",
                    next: 'step-3'
                }
            ]
        },

        'step-2M': {
            skill: 'audio',
            title: 'Global Voice Count Increased',
            prompt: "<p>You increased the global voice count from 32 to 128. The gunshots now play more consistently, but the audio lead notices frame rate drops during intense combat. The profiler shows audio processing is now a bottleneck.</p><strong>What's the problem with your approach?</strong>",
            choices: [
                {
                    text: 'Revert the global change and instead use per-sound Concurrency settings to limit only the gunshot sounds.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. Concurrency settings let you control specific sounds without wasting resources on unnecessary voices.</p>",
                    next: 'step-3'
                },
                {
                    text: 'Keep the high voice count and optimize other systems instead.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> You're creating a performance problem to fix an audio problem. This is backwards.</p>",
                    next: 'step-3'
                }
            ]
        },

        'step-3': {
            skill: 'audio',
            title: 'Creating a Concurrency Asset',
            prompt: "<p>You understand that Sound Concurrency assets let you limit how many instances of a specific sound can play simultaneously. You need to create one for the gunshot sound.</p><strong>Where do you create a Sound Concurrency asset?</strong>",
            choices: [
                {
                    text: 'Right-click in the Content Browser > Audio > Sound Concurrency.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. This creates a new Concurrency asset you can configure and assign to your Sound Cue.</p>",
                    next: 'step-4'
                },
                {
                    text: 'Look for a Concurrency setting inside the Sound Cue editor.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> The Sound Cue references a Concurrency asset, but you need to create the asset first in the Content Browser.</p>",
                    next: 'step-4'
                },
                {
                    text: 'Try to find it in Project Settings > Audio.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Project Settings has global audio settings, but Concurrency assets are created per-sound in the Content Browser.</p>",
                    next: 'step-3M'
                },
                {
                    text: 'Assume UE5 creates them automatically.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Concurrency assets must be manually created and assigned. The engine doesn't auto-generate them.</p>",
                    next: 'step-4'
                }
            ]
        },

        'step-3M': {
            skill: 'audio',
            title: 'Project Settings Dead End',
            prompt: "<p>You spent time exploring Project Settings > Audio. You found global settings like voice count and quality, but nothing about per-sound concurrency. You realize this is the wrong place.</p><strong>Where should you actually create the Concurrency asset?</strong>",
            choices: [
                {
                    text: 'Right-click in the Content Browser > Audio > Sound Concurrency.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Finally found it. Concurrency assets are created in the Content Browser like other assets.</p>",
                    next: 'step-4'
                }
            ]
        },

        'step-4': {
            skill: 'audio',
            title: 'Configuring Concurrency Settings',
            prompt: "<p>You've created a Sound Concurrency asset called <code>SC_Gunshot</code>. Now you need to configure it. The asset has several settings: Max Count, Resolution Rule, and Volume Scale.</p><strong>What should you set the Max Count to for a rapid-fire weapon?</strong>",
            choices: [
                {
                    text: 'Set Max Count to <strong>3-5</strong> to allow a few overlapping shots without overwhelming the audio mix.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Perfect. 3-5 concurrent gunshots creates a realistic rapid-fire effect without audio channel exhaustion.</p>",
                    next: 'step-5'
                },
                {
                    text: 'Set Max Count to <strong>1</strong> to ensure only one gunshot plays at a time.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> This prevents the issue but makes rapid fire sound unrealistic and choppy. A slightly higher count is better.</p>",
                    next: 'step-5'
                },
                {
                    text: 'Set Max Count to <strong>50</strong> to ensure no sounds are ever cut off.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> This defeats the purpose of concurrency limiting. You'll recreate the original voice exhaustion problem.</p>",
                    next: 'step-4M'
                },
                {
                    text: 'Leave Max Count at the default <strong>unlimited</strong>.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Unlimited concurrency is the same as having no concurrency asset at all. This won't fix anything.</p>",
                    next: 'step-5'
                }
            ]
        },

        'step-4M': {
            skill: 'audio',
            title: 'Max Count Too High',
            prompt: "<p>You set Max Count to 50. During testing, the original problem returns - sounds still cut out during rapid fire because you're still exhausting the voice pool.</p><strong>What's a more reasonable Max Count?</strong>",
            choices: [
                {
                    text: 'Reduce Max Count to 3-5 concurrent instances.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Much better. This balances realism with resource management.</p>",
                    next: 'step-5'
                }
            ]
        },

        'step-5': {
            skill: 'audio',
            title: 'Resolution Rules',
            prompt: "<p>With Max Count set to 4, you need to decide what happens when a 5th gunshot tries to play. The <strong>Resolution Rule</strong> determines this behavior.</p><strong>Which Resolution Rule is best for gunshots?</strong>",
            choices: [
                {
                    text: 'Set Resolution Rule to <strong>Stop Oldest</strong> to cut off the oldest gunshot and play the new one.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Perfect. Stop Oldest ensures the most recent shots are always heard, which feels most responsive to player input.</p>",
                    next: 'step-6'
                },
                {
                    text: 'Set Resolution Rule to <strong>Prevent New</strong> to block new gunshots when the limit is reached.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> This works but makes the gun feel unresponsive when firing rapidly. Stop Oldest is more player-friendly.</p>",
                    next: 'step-6'
                },
                {
                    text: 'Set Resolution Rule to <strong>Stop Quietest</strong> to preserve louder sounds.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> For gunshots that are all the same volume, this behaves unpredictably. Stop Oldest is more deterministic.</p>",
                    next: 'step-5M'
                },
                {
                    text: 'Set Resolution Rule to <strong>Stop Farthest</strong> based on distance from listener.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> All gunshots come from the player's weapon at the same location. Distance-based rules don't apply here.</p>",
                    next: 'step-6'
                }
            ]
        },

        'step-5M': {
            skill: 'audio',
            title: 'Stop Quietest Confusion',
            prompt: "<p>You set the rule to Stop Quietest. During testing, the behavior seems random - sometimes new shots play, sometimes they don't. You realize all gunshots have the same base volume, so 'quietest' is arbitrary.</p><strong>What's a better rule?</strong>",
            choices: [
                {
                    text: 'Change to Stop Oldest for predictable, responsive behavior.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Much better. Chronological ordering makes sense for player-triggered sounds.</p>",
                    next: 'step-6'
                }
            ]
        },

        'step-6': {
            skill: 'audio',
            title: 'Assigning the Concurrency Asset',
            prompt: "<p>You've configured <code>SC_Gunshot</code> with Max Count: 4 and Resolution Rule: Stop Oldest. Now you need to assign it to the gunshot Sound Cue.</p><strong>How do you assign the Concurrency asset?</strong>",
            choices: [
                {
                    text: 'Open the gunshot <strong>Sound Cue</strong>, find the <strong>Sound Concurrency</strong> property, and select <code>SC_Gunshot</code>.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. The Sound Cue has a Concurrency dropdown where you assign your asset.</p>",
                    next: 'step-7'
                },
                {
                    text: 'Drag and drop the Concurrency asset onto the Sound Cue in the Content Browser.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> This doesn't work. You need to open the Sound Cue and use the property panel.</p>",
                    next: 'step-7'
                },
                {
                    text: 'Reference the Concurrency asset in the Blueprint that plays the sound.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Concurrency is a property of the sound asset itself, not the Blueprint logic that plays it.</p>",
                    next: 'step-6M'
                },
                {
                    text: 'Assume it auto-assigns based on naming convention.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> UE5 doesn't auto-assign assets. You must manually set the reference.</p>",
                    next: 'step-7'
                }
            ]
        },

        'step-6M': {
            skill: 'audio',
            title: 'Blueprint Assignment Attempt',
            prompt: "<p>You tried to pass the Concurrency asset as a parameter in the <code>Play Sound</code> Blueprint node, but there's no such input pin. Concurrency is a property of the Sound Cue itself.</p><strong>Where should you actually assign it?</strong>",
            choices: [
                {
                    text: 'Open the Sound Cue editor and set the Concurrency property there.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. Sound Cue properties are set in the asset editor, not at runtime.</p>",
                    next: 'step-7'
                }
            ]
        },

        'step-7': {
            skill: 'audio',
            title: 'Testing the Fix',
            prompt: "<p>You've assigned <code>SC_Gunshot</code> to the gunshot Sound Cue. Time to test! You enter PIE and rapidly fire the weapon.</p><strong>What should you observe?</strong>",
            choices: [
                {
                    text: 'Listen carefully - you should hear up to 4 overlapping gunshots, and the Output Log should show no more voice exhaustion warnings.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Perfect! The concurrency limit is working. Gunshots play consistently without overwhelming the audio system.</p>",
                    next: 'step-8'
                },
                {
                    text: 'Check if ALL sounds are now working perfectly.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Good instinct, but you should verify the specific fix first before checking for other issues.</p>",
                    next: 'step-8'
                },
                {
                    text: 'Immediately mark the bug as fixed without testing.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Always test your fixes! You might have misconfigured something.</p>",
                    next: 'step-8'
                },
                {
                    text: 'Test only in the editor, not in a packaged build.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> PIE testing is fine for this issue, but you should note that audio behavior can differ in packaged builds.</p>",
                    next: 'step-8'
                }
            ]
        },

        'step-8': {
            skill: 'audio',
            title: 'New Problem - Footsteps Disappearing',
            prompt: "<p>The gunshots work great! But now QA reports a new issue: during intense combat, <strong>enemy footsteps</strong> are cutting out, making it hard to hear enemies approaching. The gunshots are drowning out the footsteps.</p><strong>What's the problem?</strong>",
            choices: [
                {
                    text: 'The gunshots and footsteps are competing for the same voice channels. You need to use <strong>Priority</strong> to ensure footsteps are preserved.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Exactly. Priority determines which sounds survive when the global voice limit is reached.</p>",
                    next: 'step-9'
                },
                {
                    text: 'Increase the volume of the footsteps so they're louder than gunshots.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Volume doesn't affect which sounds the audio engine chooses to play. You need Priority settings.</p>",
                    next: 'step-8W'
                },
                {
                    text: 'Create a separate Concurrency asset for footsteps.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> This helps manage footsteps internally, but doesn't solve the cross-sound priority issue. You need Priority values.</p>",
                    next: 'step-9'
                },
                {
                    text: 'Reduce the gunshot Max Count to 2 to free up more voices.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> This might help but degrades the gunshot quality. Priority is the proper solution.</p>",
                    next: 'step-8M'
                }
            ]
        },

        'step-8W': {
            skill: 'audio',
            title: 'Volume Increase Failed',
            prompt: "<p>You increased footstep volume to maximum. Now when footsteps DO play, they're painfully loud and unrealistic. But they still cut out during combat. Volume is not the solution.</p><strong>What should you do?</strong>",
            choices: [
                {
                    text: 'Revert the volume and instead use Priority settings to protect footsteps.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. Priority is the proper way to manage sound importance.</p>",
                    next: 'step-9'
                }
            ]
        },

        'step-8M': {
            skill: 'audio',
            title: 'Reduced Gunshot Quality',
            prompt: "<p>You reduced gunshot Max Count to 2. Footsteps play more often now, but rapid fire sounds terrible - very choppy and unrealistic. The gameplay team is unhappy.</p><strong>What's a better solution?</strong>",
            choices: [
                {
                    text: 'Restore gunshot Max Count to 4 and instead use Priority to protect footsteps.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. Priority lets you have both quality gunshots AND protected footsteps.</p>",
                    next: 'step-9'
                }
            ]
        },

        'step-9': {
            skill: 'audio',
            title: 'Setting Sound Priority',
            prompt: "<p>You understand that Priority values (0.0 to 1.0) determine which sounds survive when the global voice limit is reached. Higher priority = more important.</p><strong>How should you set priorities for gunshots vs footsteps?</strong>",
            choices: [
                {
                    text: 'Set Footsteps to <strong>Priority 1.0</strong> (critical for gameplay) and Gunshots to <strong>Priority 0.5</strong> (less critical).',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Perfect! Footsteps will now be preserved even during intense gunfire. Gameplay-critical audio should always have higher priority.</p>",
                    next: 'step-10'
                },
                {
                    text: 'Set both to Priority 1.0 so both are protected.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> If both have the same priority, the engine can't differentiate. You need a hierarchy.</p>",
                    next: 'step-10'
                },
                {
                    text: 'Set Gunshots to Priority 1.0 and Footsteps to Priority 0.5.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> This is backwards! Footsteps are more important for gameplay awareness than gunshots.</p>",
                    next: 'step-9W'
                },
                {
                    text: 'Set both to Priority 0.0 to let the engine decide automatically.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Priority 0.0 means 'least important'. The engine will cut these first. You need to explicitly set priorities.</p>",
                    next: 'step-9M'
                }
            ]
        },

        'step-9W': {
            skill: 'audio',
            title: 'Backwards Priority',
            prompt: "<p>You set gunshots to high priority and footsteps to low priority. Testing shows footsteps STILL cut out during combat. You realize you got it backwards - footsteps should be higher priority!</p><strong>What's the correct priority hierarchy?</strong>",
            choices: [
                {
                    text: 'Swap them - Footsteps Priority 1.0, Gunshots Priority 0.5.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Now it's correct. Gameplay-critical sounds get higher priority.</p>",
                    next: 'step-10'
                }
            ]
        },

        'step-9M': {
            skill: 'audio',
            title: 'Zero Priority Mistake',
            prompt: "<p>You set both sounds to Priority 0.0. During testing, BOTH sounds cut out frequently. Priority 0.0 means 'cut these first', so the engine is aggressively culling them.</p><strong>What should you do?</strong>",
            choices: [
                {
                    text: 'Set meaningful priorities - Footsteps 1.0, Gunshots 0.5.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. Use the full priority range to create a clear hierarchy.</p>",
                    next: 'step-10'
                }
            ]
        },

        'step-10': {
            skill: 'audio',
            title: 'Final Validation',
            prompt: "<p>You've set up Concurrency (Max Count: 4, Stop Oldest) for gunshots and Priority (Footsteps: 1.0, Gunshots: 0.5). Time for comprehensive testing.</p><strong>What should you test?</strong>",
            choices: [
                {
                    text: 'Test rapid fire, verify footsteps are audible during combat, check the Output Log for warnings, and have QA validate the fix.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Excellent! Comprehensive testing confirms: gunshots play smoothly (up to 4 concurrent), footsteps are always audible, and no voice exhaustion warnings. Bug fixed!</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Test only the gunshots and assume footsteps are fine.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> You should test both aspects of the fix. Footsteps were part of the problem.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Mark the bug as fixed without testing.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Always test your fixes! You might have misconfigured something.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Only test in the editor, not in a packaged build.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> PIE testing is sufficient for this fix, but ideally you'd also test in a packaged build to catch any cook-time issues.</p>",
                    next: 'conclusion'
                }
            ]
        }
    }
};
