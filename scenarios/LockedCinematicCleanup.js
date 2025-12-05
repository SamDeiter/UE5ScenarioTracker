window.SCENARIOS['LockedCinematicCleanup'] = {
    "meta": {
        "title": "Cinematic Sequence Plays, Locks Input, but Fails Final Camera Cut",
        "description": "A critical introductory cinematic, triggered via a collision box in the Level Blueprint, begins playing correctly (actor movement and initial camera work fine). However, just before the final intended camera shot (Shot 05), the viewport goes dark or sticks to the static camera from the previous shot. Crucially, when the sequence finishes, the Player Character remains input-locked, requiring a manual console command or map reload to regain control. The 'On Finished' event in the Level Blueprint never seems to execute, even though the sequence clearly ran for its full duration or aborted silently. Previewing the Level Sequence asset independently works perfectly, showing Shot 05 and restoring control.",
        "estimateHours": 3,
        "category": "Sequencer & Cinematics"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "sequencercinematics",
            "title": "Step 1",
            "prompt": "<p>Enable debug visualization to confirm the Player Controller's input state (e.g., using 'DisplayDebug PlayerController' in the console) and verify that input is indeed locked, confirming the sequence cleanup failed to execute.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Enable debug visualization to confirm the Player Controller's input state (e.g., using 'DisplayDebug PlayerController' in the console) and verify that input is indeed locked, confirming the sequence cleanup failed to execute.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Spending extensive time checking the Player Controller Blueprint or Game Mode settings, assuming input is being blocked globally rather than locally by the Sequencer system.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.75hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "sequencercinematics",
            "title": "Step 2",
            "prompt": "<p>Locate and examine the Level Blueprint logic responsible for triggering the cinematic (e.g., the Overlap event for the trigger volume) to ensure the 'Play' node for the Level Sequence Asset (LS_Hero_Intro) is correctly connected.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate and examine the Level Blueprint logic responsible for triggering the cinematic (e.g., the Overlap event for the trigger volume) to ensure the 'Play' node for the Level Sequence Asset (LS_Hero_Intro) is correctly connected.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Attempting to troubleshoot the camera black screen issue by rebuilding lighting or reflections, assuming a rendering failure rather than a binding failure.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "sequencercinematics",
            "title": "Step 3",
            "prompt": "<p>Inspect the 'On Finished' event delegate connected to the Level Sequence Player node in the Level Blueprint. Confirm that the logic intended to restore player input (e.g., 'Enable Input') is present and connected.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Inspect the 'On Finished' event delegate connected to the Level Sequence Player node in the Level Blueprint. Confirm that the logic intended to restore player input (e.g., 'Enable Input') is present and connected.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Manually adjusting the frame alignment on the Camera Cut track, believing the cut is happening mid-frame and causing the stutter/hang.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "sequencercinematics",
            "title": "Step 4",
            "prompt": "<p>Open the Level Sequence Asset (LS_Hero_Intro) and check its Master Track settings. Specifically, review the 'When Finished' setting. Note that it is currently set to 'Keep State'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Level Sequence Asset (LS_Hero_Intro) and check its Master Track settings. Specifically, review the 'When Finished' setting. Note that it is currently set to 'Keep State'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Debugging the Level Blueprint by adding multiple print strings without first verifying if the sequence is successfully executing all its internal possess/spawn logic.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.6hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "sequencercinematics",
            "title": "Step 5",
            "prompt": "<p>Temporarily change the Level Sequence 'When Finished' setting from 'Keep State' to 'Restore State' to see if it fixes the input lock issue, indicating a failure in the Level Blueprint cleanup path.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Temporarily change the Level Sequence 'When Finished' setting from 'Keep State' to 'Restore State' to see if it fixes the input lock issue, indicating a failure in the Level Blueprint cleanup path.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Spending extensive time checking the Player Controller Blueprint or Game Mode settings, assuming input is being blocked globally rather than locally by the Sequencer system.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.75hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "sequencercinematics",
            "title": "Step 6",
            "prompt": "<p>Analyze the Camera Cut Track, focusing on the transition into Shot 05. Note the starting frame of Shot 05 (e.g., Frame 500).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Analyze the Camera Cut Track, focusing on the transition into Shot 05. Note the starting frame of Shot 05 (e.g., Frame 500).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.25hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Attempting to troubleshoot the camera black screen issue by rebuilding lighting or reflections, assuming a rendering failure rather than a binding failure.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "sequencercinematics",
            "title": "Step 7",
            "prompt": "<p>Inspect the binding for the Cinematic Camera Actor used in Shot 05. Find the track where the camera is possessed or spawned.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Inspect the binding for the Cinematic Camera Actor used in Shot 05. Find the track where the camera is possessed or spawned.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.3hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Manually adjusting the frame alignment on the Camera Cut track, believing the cut is happening mid-frame and causing the stutter/hang.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "sequencercinematics",
            "title": "Step 8",
            "prompt": "<p>Identify that the camera binding for Shot 05 references a specific Level-placed Static Camera Actor named 'FinalShotCam_A' which is set as a 'Possessable' binding.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Identify that the camera binding for Shot 05 references a specific Level-placed Static Camera Actor named 'FinalShotCam_A' which is set as a 'Possessable' binding.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.3hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Debugging the Level Blueprint by adding multiple print strings without first verifying if the sequence is successfully executing all its internal possess/spawn logic.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.6hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "sequencercinematics",
            "title": "Step 9",
            "prompt": "<p>Examine the World Outliner and verify the existence and state of 'FinalShotCam_A'. Determine that this actor was previously deleted from the level but the sequence binding was never updated, causing an unhandled null reference when the sequence attempts to possess it.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Examine the World Outliner and verify the existence and state of 'FinalShotCam_A'. Determine that this actor was previously deleted from the level but the sequence binding was never updated, causing an unhandled null reference when the sequence attempts to possess it.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.4hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Spending extensive time checking the Player Controller Blueprint or Game Mode settings, assuming input is being blocked globally rather than locally by the Sequencer system.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.75hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "sequencercinematics",
            "title": "Step 10",
            "prompt": "<p>Replace the broken Possessable binding for 'FinalShotCam_A' by adding a new, valid 'Spawnable' Cinematic Camera Actor to the track at the beginning of Shot 05.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Replace the broken Possessable binding for 'FinalShotCam_A' by adding a new, valid 'Spawnable' Cinematic Camera Actor to the track at the beginning of Shot 05.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.3hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Attempting to troubleshoot the camera black screen issue by rebuilding lighting or reflections, assuming a rendering failure rather than a binding failure.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "sequencercinematics",
            "title": "Step 11",
            "prompt": "<p>If step 5 was temporary, revert the Level Sequence 'When Finished' setting back to 'Keep State' and confirm the 'On Finished' delegate in the Level Blueprint now executes correctly because the sequence no longer aborts due to the invalid reference.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>If step 5 was temporary, revert the Level Sequence 'When Finished' setting back to 'Keep State' and confirm the 'On Finished' delegate in the Level Blueprint now executes correctly because the sequence no longer aborts due to the invalid reference.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Manually adjusting the frame alignment on the Camera Cut track, believing the cut is happening mid-frame and causing the stutter/hang.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "sequencercinematics",
            "title": "Step 12",
            "prompt": "<p>Test the level sequence playback in editor to confirm the camera cuts correctly to Shot 05 and that player input is properly restored via the Level Blueprint's 'On Finished' logic.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Test the level sequence playback in editor to confirm the camera cuts correctly to Shot 05 and that player input is properly restored via the Level Blueprint's 'On Finished' logic.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.4hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Debugging the Level Blueprint by adding multiple print strings without first verifying if the sequence is successfully executing all its internal possess/spawn logic.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.6hrs. This approach wastes time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario.</p>",
            "choices": []
        }
    }
};
