window.SCENARIOS['LockedCinematicCleanup'] = {
    "meta": {
        "title": "Cinematic Sequence Plays, Locks Input, but Fails Final Camera Cut",
        "description": "A critical introductory cinematic, triggered via a collision box in the Level Blueprint, begins playing correctly (actor movement and initial camera work fine). However, just before the final intended camera shot (Shot 05), the viewport goes dark or sticks to the static camera from the previous shot. Crucially, when the sequence finishes, the Player Character remains input-locked, requiring a manual console command or map reload to regain control. The 'On Finished' event in the Level Blueprint never seems to execute, even though the sequence clearly ran for its full duration or aborted silently. Previewing the Level Sequence asset independently works perfectly, showing Shot 05 and restoring control.",
        "estimateHours": 3,
        "category": "Sequencer & Cinematics",
        "tokens_used": 8487
    },
    "setup": [
        {
            "action": "set_ue_property",
            "scenario": "LockedCinematicCleanup",
            "step": "step-0"
        }
    ],
    "fault": {
        "description": "Initial problem state",
        "visual_cue": "Visual indicator"
    },
    "expected": {
        "description": "Expected resolved state",
        "validation_action": "verify_fix"
    },
    "fix": [
        {
            "action": "set_ue_property",
            "scenario": "LockedCinematicCleanup",
            "step": "final"
        }
    ],
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "general",
            "title": "Confirm Player Input State",
            "prompt": "<p>Cinematic ends, <strong>Player Character</strong> is input-locked and unresponsive. How do you investigate the input state?</p>",
            "choices": [
                {
                    "text": "<p>Use the console command <code>DisplayDebug PlayerController</code> to confirm the input state.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. This quickly confirms if input is being processed or blocked at the controller level, narrowing down the scope of the problem.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Restart UE5, hoping it's a temporary glitch.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Restarting doesn't diagnose the problem; it merely resets the state, potentially masking the root cause.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Spend extensive time checking the <strong>Player Controller Blueprint</strong> or <strong>Game Mode</strong> settings, assuming global input blockage.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.75hrs. While input is blocked, this scenario points to a local system (Sequencer) issue rather than a global configuration problem, making these checks premature and time-consuming.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Add <code>Print String</code> nodes in the <strong>Player Controller</strong> to see if input events are firing.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.2hrs. This might confirm input isn't firing, but <code>DisplayDebug PlayerController</code> provides a more comprehensive, immediate overview of the controller's input state without modifying blueprints.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "blueprint",
            "title": "Examine Level Blueprint Trigger Logic",
            "prompt": "<p>Input is locked. Cinematic triggered by <strong>Collision Box</strong> in <strong>Level Blueprint</strong>. What's your next move?</p>",
            "choices": [
                {
                    "text": "<p>Open the <strong>Level Blueprint</strong> and inspect the <strong>Overlap</strong> event for the <strong>Collision Box</strong> and the connected <code>Play</code> node for the <strong>Level Sequence Player</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.2hrs. Verifying the trigger and initial play logic ensures the sequence starts as expected, ruling out immediate Level Blueprint errors.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Delete and re-add the <strong>Collision Box</strong>, then reconnect the trigger events.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.2hrs. This is a destructive and unnecessary step. There's no indication the collision box itself is the issue.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Check the <strong>Sequence Asset</strong> properties for any 'auto-lock input' settings.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.3hrs. While the sequence <em>does</em> lock input, the initial problem description indicates the 'On Finished' event isn't firing, suggesting the issue is more likely in the Level Blueprint's cleanup path, not the sequence's initial behavior.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Recompile the <strong>Level Blueprint</strong> to ensure no stale logic exists.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.1hrs. While good practice, there's no specific error indicating a compilation issue, and it doesn't directly help diagnose the faulty logic path.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "blueprint",
            "title": "Inspect 'On Finished' Event Delegate",
            "prompt": "<p><strong>Level Blueprint</strong> trigger to <code>Play</code> node is correct. Input remains locked. How should you proceed?</p>",
            "choices": [
                {
                    "text": "<p>Examine the <code>On Finished</code> event delegate of the <strong>Level Sequence Player</strong> node in the <strong>Level Blueprint</strong> to confirm input restoration logic.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. The problem states the 'On Finished' event doesn't seem to execute, and input is locked. This is the most direct place to check the input restoration logic.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Add a new <code>Set Input Mode UIOnly</code> node after the <code>Play</code> node to force UI input.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.2hrs. This would bypass the intended game input and is a workaround, not a solution to the 'On Finished' event not firing.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Manually adjust the frame alignment on the <strong>Camera Cut Track</strong>, believing the cut is happening mid-frame and causing the stutter/hang.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.5hrs. This is focused on the camera issue, not the input lock or 'On Finished' event, which are primary symptoms.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Add <code>Print String</code> nodes before and after the <code>Play</code> node to confirm execution flow.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While useful for execution flow, the specific problem statement highlights the *On Finished* event, which is what needs direct verification.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "sequencer",
            "title": "Check Sequence 'When Finished' Setting",
            "prompt": "<p><code>On Finished</code> in <strong>Level Blueprint</strong> has input restore logic, but isn't firing. What action do you take?</p>",
            "choices": [
                {
                    "text": "<p>Open the <strong>Level Sequence Asset</strong> (LS_Hero_Intro) and inspect its <strong>Master Track</strong> settings, specifically the <code>When Finished</code> property.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.2hrs. This setting dictates the sequence's behavior upon completion, which directly impacts whether the 'On Finished' event in the Level Blueprint is triggered.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Recreate the <strong>Level Sequence Asset</strong> entirely.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.5hrs. This is a drastic measure and likely unnecessary, as the sequence plays perfectly in isolation.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Debug the <strong>Level Blueprint</strong> by adding multiple <code>Print String</code> nodes without first verifying if the sequence is successfully executing all its internal possess/spawn logic.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.6hrs. This approach adds complexity to the Level Blueprint without first investigating the sequence's internal completion state, which is a more direct cause for the 'On Finished' not firing.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Check the <strong>Camera Cut Track</strong> for any overlapping shots.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While the camera cut is an issue, the primary problem (input lock, 'On Finished' not firing) indicates a fundamental sequence completion issue, not just a visual one.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "sequencer",
            "title": "Test 'Restore State' for Cleanup",
            "prompt": "<p><strong>Level Sequence</strong> <code>When Finished</code> is <code>Keep State</code>. This could cause input lock. Which approach tests this?</p>",
            "choices": [
                {
                    "text": "<p>Temporarily change the <strong>Level Sequence</strong>'s <code>When Finished</code> setting from <code>Keep State</code> to <code>Restore State</code> and re-test playback.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.2hrs. This change forces the sequence to clean up its state and *should* trigger the 'On Finished' event if the sequence reaches its natural end. If it restores input, it points to a sequence abortion preventing cleanup.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Change <code>When Finished</code> to <code>Hide</code>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. This setting hides actors but doesn't necessarily address input or event execution, and isn't a diagnostic step for this problem.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Add a <code>Delay</code> node in the <strong>Level Blueprint</strong> before calling <code>Enable Input</code>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.25hrs. This addresses the *symptom* of locked input but doesn't fix the root cause of the 'On Finished' event not firing due to the sequence aborting.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Look for an explicit <code>Stop Sequence</code> node in the <strong>Level Blueprint</strong>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. The problem implies the sequence runs for its *full duration* or aborts silently, not that it's being prematurely stopped by an explicit node.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "sequencer",
            "title": "Analyze Camera Cut Track for Shot 05",
            "prompt": "<p>Shot 05 fails, <code>On Finished</code> not firing, sequence aborting. How do you investigate the failure point?</p>",
            "choices": [
                {
                    "text": "<p>Analyze the <strong>Camera Cut Track</strong> within the <strong>Level Sequence Asset</strong>, focusing on the transition into Shot 05 and its starting frame.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.25hrs. The specific failure at Shot 05's transition is a critical clue. This track determines which camera is active, making it the prime suspect for the visual issue and potential abortion point.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Rebuild lighting and reflections, assuming a rendering failure.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.4hrs. This is an incorrect assumption. The issue is likely a functional problem with the camera cut itself, not a rendering bug.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Check the <strong>Animation Tracks</strong> for the <strong>Player Character</strong> for any conflicting animations.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.3hrs. The problem states actor movement is fine *initially*, and the issue manifests at the final camera cut, making character animation an unlikely culprit for the abortion.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Examine the <strong>World Settings</strong> to ensure <code>Default View Target</code> is correctly set.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.1hrs. While relevant for initial view, the sequence should override this. It's not the point of failure for a specific camera cut *within* a playing sequence.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "sequencer",
            "title": "Inspect Camera Binding for Shot 05",
            "prompt": "<p>Shot 05 start frame identified. Viewport dark/stuck before it. What's your next move?</p>",
            "choices": [
                {
                    "text": "<p>Inspect the binding for the <strong>Cinematic Camera Actor</strong> used in Shot 05 on its corresponding track in the <strong>Level Sequence</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.3hrs. The Camera Cut Track references a camera; investigating that camera's binding is the direct next step to understand why it's failing to become active.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Add a new <strong>Cinematic Camera</strong> to the level and drag it into the sequence.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.2hrs. This is premature. You need to understand *why* the existing setup failed before attempting a fix.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Adjust the <strong>Camera Cut Track</strong>'s blend time into Shot 05.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.25hrs. While blend times can cause visual glitches, they are unlikely to cause a complete dark screen or sequence abortion.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Check the <strong>Level Blueprint</strong> for any other camera override logic.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. The sequence is designed to take control. Conflicting Level Blueprint logic is less likely than an issue *within* the sequence itself at this specific camera cut.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "sequencer",
            "title": "Identify Camera Actor Binding Type",
            "prompt": "<p>Shot 05 <strong>Cinematic Camera</strong> uses a <code>Possessable</code> binding to a <strong>Level Actor</strong>. How do you investigate this?</p>",
            "choices": [
                {
                    "text": "<p>Note the name of the referenced <strong>Level-placed Static Camera Actor</strong> (e.g., 'FinalShotCam_A') and prepare to verify its existence.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.3hrs. Identifying the specific actor being referenced is crucial for the next verification step. This type of binding is a common point of failure if the referenced actor is removed.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Change the binding type from <code>Possessable</code> to <code>Spawnable</code> without further investigation.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.25hrs. This is attempting a fix without understanding the root cause. You don't know yet if the camera is missing or just misconfigured.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Check the <strong>Camera Actor</strong>'s properties for <code>Auto Activate</code>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.2hrs. The sequence should handle activation. The issue is the binding type and the referenced actor, not its auto-activation settings.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Re-link the existing <code>Possessable</code> binding, assuming a broken reference.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While re-linking can fix simple reference breaks, it's more effective to *verify* the underlying actor's existence first.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "editor",
            "title": "Verify Existence of Referenced Camera Actor",
            "prompt": "<p><strong>Level Sequence</strong> attempts to possess 'FinalShotCam_A' for Shot 05. What action confirms its status?</p>",
            "choices": [
                {
                    "text": "<p>Examine the <strong>World Outliner</strong> and search for 'FinalShotCam_A' to verify its existence and state. Confirm it was deleted from the level.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.4hrs. This directly confirms the presence or absence of the actor the sequence is trying to possess. A deleted actor causing a null reference is a common reason for sequence abortion.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Create a new <strong>Static Camera Actor</strong> in the scene and name it 'FinalShotCam_A'.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.3hrs. This might seem like a quick fix, but it's a blind repair without understanding if the original camera had specific settings or placement.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Check the <strong>Output Log</strong> for specific errors related to camera possession.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.25hrs. While good for error checking, directly verifying the actor's existence in the <strong>World Outliner</strong> is a faster and more direct confirmation for a missing reference.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Verify the <strong>Level Sequence</strong> permissions to possess level actors.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Permissions are rarely the issue for a standard possessable binding. A missing actor is a more fundamental problem.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "sequencer",
            "title": "Replace Broken Camera Binding",
            "prompt": "<p>'FinalShotCam_A' <code>Possessable</code> binding is deleted. How do you resolve the binding and restore the camera?</p>",
            "choices": [
                {
                    "text": "<p>Replace the broken <code>Possessable</code> binding for 'FinalShotCam_A' by adding a new, valid <code>Spawnable</code> <strong>Cinematic Camera Actor</strong> to the track at the beginning of Shot 05.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.3hrs. Using a 'Spawnable' camera is generally more robust for sequences, as it manages the camera's lifecycle. This directly fixes the null reference.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Ignore the camera issue and focus on the input lock.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.4hrs. The camera issue is causing the sequence to abort, which in turn prevents the input lock from being resolved. Fixing the camera is paramount.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Drag a <strong>Static Camera Actor</strong> from the <strong>Content Browser</strong> into the sequence and bind it as <code>Possessable</code>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.25hrs. While this might work, using a <code>Spawnable Cinematic Camera</code> is generally preferred for sequences, as it's self-contained and less prone to external level changes.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Manually recreate 'FinalShotCam_A' in the level and then re-link the existing <code>Possessable</code> binding.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.2hrs. This works but requires manual level cleanup later. A 'Spawnable' camera is a more robust, self-managing solution within the sequence itself.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "sequencer",
            "title": "Revert 'When Finished' and Verify 'On Finished'",
            "prompt": "<p>Camera fixed. <code>When Finished</code> is <code>Restore State</code>. How do you ensure <strong>Level Blueprint</strong> <code>On Finished</code> works as intended?</p>",
            "choices": [
                {
                    "text": "<p>Revert the <strong>Level Sequence</strong>'s <code>When Finished</code> setting back to its original <code>Keep State</code> and confirm the <strong>Level Blueprint</strong>'s <code>On Finished</code> delegate now executes correctly.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.2hrs. With the sequence no longer aborting due to the missing camera, the 'On Finished' event should now trigger as the sequence completes, even with 'Keep State' (which means it completed naturally).</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Leave the <code>When Finished</code> setting at <code>Restore State</code>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While this might restore input, it's not the original intended behavior and could have unintended side effects for other sequence elements. It prevents verifying the original cleanup logic.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Add more <code>Print String</code> nodes to the <strong>Level Blueprint</strong> to confirm execution flow.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While generally useful, at this stage, the problem should be resolved, and a simple test of the original logic is sufficient.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Recompile the <strong>Level Blueprint</strong> again to be safe.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.1hrs. Compilation is generally automatic or prompted when needed. It's not a direct diagnostic step for this specific problem.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "testing",
            "title": "Final Testing and Confirmation",
            "prompt": "<p>Camera fixed, <code>On Finished</code> executes, input restored. What final action confirms resolution?</p>",
            "choices": [
                {
                    "text": "<p>Test the level sequence playback in editor (PIE or Standalone) to confirm the camera cuts correctly to Shot 05 and that player input is properly restored.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.4hrs. A final comprehensive test confirms all aspects of the fix, from camera behavior to input restoration.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Close UE5 and assume everything is fixed.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.3hrs. Never assume. Always verify with a thorough test.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Check the <strong>Output Log</strong> for any lingering warnings.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.2hrs. While good practice, this is secondary to a direct functional test of the cinematic itself.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Show the problem to a colleague to get their sign-off.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.25hrs. While collaboration is valuable, it's best to confirm your own fix before seeking external validation.</p>",
                    "next": "step-12"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario.</p>",
            "choices": [{"text": "Complete Scenario", "type": "correct", "feedback": "", "next": "end"}]
        }
    }
};
