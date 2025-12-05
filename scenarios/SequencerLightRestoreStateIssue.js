window.SCENARIOS['SequencerLightRestoreStateIssue'] = {
    "meta": {
        "title": "Cinematic Light Fails to Persist After Sequence Stops",
        "description": "When testing the short cinematic sequence, the camera cuts and character animation play correctly. However, a tracked Spotlight, which has its intensity and color keyframed to be red at the end of the sequence, immediately turns off and reverts to its initial intensity (or disappears) the moment the sequence finishes playing. The light should remain red and on, illuminating the scene after the cinematic concludes. The actor itself is persistent in the level.",
        "estimateHours": 0.75,
        "category": "Sequencer & Cinematics"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "sequencercinematics",
            "title": "Step 1",
            "prompt": "<p>Locate the Level Sequence Actor associated with the cinematic in the Outliner (or Content Browser if dynamically played).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate the Level Sequence Actor associated with the cinematic in the Outliner (or Content Browser if dynamically played).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Attempting to change the 'When Finished' option on the main Level Sequence Actor in the level to 'Keep State' or 'Keep Last Frame', believing this affects Possessable Actor properties rather than just the sequence playback cursor.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "sequencercinematics",
            "title": "Step 2",
            "prompt": "<p>Double-click the Level Sequence Asset within the Level Sequence Actor's Details panel or Content Browser to open the Sequencer editor.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Double-click the Level Sequence Asset within the Level Sequence Actor's Details panel or Content Browser to open the Sequencer editor.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Checking the mobility settings (e.g., ensuring the light is Movable) on the Light Actor in the Level Details panel, assuming a lighting bake or static issue is causing the behavior.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "sequencercinematics",
            "title": "Step 3",
            "prompt": "<p>In the Sequencer editor, identify the specific track binding for the problematic persistent light actor (e.g., 'Spotlight_Environment_01').</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Sequencer editor, identify the specific track binding for the problematic persistent light actor (e.g., 'Spotlight_Environment_01').</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.04hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Trying to use a Level Blueprint to manually set the light color and intensity to red immediately after the 'On Finished' output of the cinematic trigger node.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "sequencercinematics",
            "title": "Step 4",
            "prompt": "<p>Scrub the timeline to the final frame of the sequence and verify that the keyframes for Intensity and Light Color are correctly set (Intensity > 0, Color = Red) and that the keyframes are present on the final frame.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Scrub the timeline to the final frame of the sequence and verify that the keyframes for Intensity and Light Color are correctly set (Intensity > 0, Color = Red) and that the keyframes are present on the final frame.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Attempting to change the 'When Finished' option on the main Level Sequence Actor in the level to 'Keep State' or 'Keep Last Frame', believing this affects Possessable Actor properties rather than just the sequence playback cursor.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "sequencercinematics",
            "title": "Step 5",
            "prompt": "<p>Confirm that the light actor is listed as a 'Possessable' (green icon) since it is an existing actor in the level and should maintain its state.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Confirm that the light actor is listed as a 'Possessable' (green icon) since it is an existing actor in the level and should maintain its state.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.04hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Checking the mobility settings (e.g., ensuring the light is Movable) on the Light Actor in the Level Details panel, assuming a lighting bake or static issue is causing the behavior.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "sequencercinematics",
            "title": "Step 6",
            "prompt": "<p>With the light binding track selected, locate the 'Details' panel specific to the Sequencer editor (this panel often needs to be explicitly enabled via the Window menu within Sequencer).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>With the light binding track selected, locate the 'Details' panel specific to the Sequencer editor (this panel often needs to be explicitly enabled via the Window menu within Sequencer).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Trying to use a Level Blueprint to manually set the light color and intensity to red immediately after the 'On Finished' output of the cinematic trigger node.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "sequencercinematics",
            "title": "Step 7",
            "prompt": "<p>Locate the 'Binding' section within the Sequencer Details panel for the selected light actor.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate the 'Binding' section within the Sequencer Details panel for the selected light actor.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Attempting to change the 'When Finished' option on the main Level Sequence Actor in the level to 'Keep State' or 'Keep Last Frame', believing this affects Possessable Actor properties rather than just the sequence playback cursor.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "sequencercinematics",
            "title": "Step 8",
            "prompt": "<p>Expand the 'Binding' section settings to expose advanced cinematic options.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Expand the 'Binding' section settings to expose advanced cinematic options.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Checking the mobility settings (e.g., ensuring the light is Movable) on the Light Actor in the Level Details panel, assuming a lighting bake or static issue is causing the behavior.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "sequencercinematics",
            "title": "Step 9",
            "prompt": "<p>Find the boolean property labeled 'Restore State' or 'Restore State/Keep State'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Find the boolean property labeled 'Restore State' or 'Restore State/Keep State'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Trying to use a Level Blueprint to manually set the light color and intensity to red immediately after the 'On Finished' output of the cinematic trigger node.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "sequencercinematics",
            "title": "Step 10",
            "prompt": "<p>Observe that the 'Restore State' checkbox is currently enabled (checked). This setting automatically reverts the actor's properties to their pre-sequence values upon completion or stopping.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Observe that the 'Restore State' checkbox is currently enabled (checked). This setting automatically reverts the actor's properties to their pre-sequence values upon completion or stopping.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Attempting to change the 'When Finished' option on the main Level Sequence Actor in the level to 'Keep State' or 'Keep Last Frame', believing this affects Possessable Actor properties rather than just the sequence playback cursor.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "sequencercinematics",
            "title": "Step 11",
            "prompt": "<p>Uncheck the 'Restore State' option. This instructs Sequencer to leave the actor's properties at the state defined by the final keyframe.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Uncheck the 'Restore State' option. This instructs Sequencer to leave the actor's properties at the state defined by the final keyframe.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.08hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Checking the mobility settings (e.g., ensuring the light is Movable) on the Light Actor in the Level Details panel, assuming a lighting bake or static issue is causing the behavior.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "sequencercinematics",
            "title": "Step 12",
            "prompt": "<p>Click the 'Save All' button in the main Unreal Editor toolbar to ensure both the Level Sequence asset and the current Level are saved.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Click the 'Save All' button in the main Unreal Editor toolbar to ensure both the Level Sequence asset and the current Level are saved.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.02hrs. Correct approach.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Trying to use a Level Blueprint to manually set the light color and intensity to red immediately after the 'On Finished' output of the cinematic trigger node.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "sequencercinematics",
            "title": "Step 13",
            "prompt": "<p>Close the Sequencer editor window.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Close the Sequencer editor window.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.02hrs. Correct approach.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Attempting to change the 'When Finished' option on the main Level Sequence Actor in the level to 'Keep State' or 'Keep Last Frame', believing this affects Possessable Actor properties rather than just the sequence playback cursor.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "sequencercinematics",
            "title": "Step 14",
            "prompt": "<p>Return to the level viewport and trigger the cinematic playback (e.g., using PIE mode or walking into the trigger volume).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Return to the level viewport and trigger the cinematic playback (e.g., using PIE mode or walking into the trigger volume).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.08hrs. Correct approach.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Checking the mobility settings (e.g., ensuring the light is Movable) on the Light Actor in the Level Details panel, assuming a lighting bake or static issue is causing the behavior.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "sequencercinematics",
            "title": "Step 15",
            "prompt": "<p>Verify that the light is now red and remains on with the keyframed intensity after the sequence successfully finishes and the playback cursor stops.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify that the light is now red and remains on with the keyframed intensity after the sequence successfully finishes and the playback cursor stops.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Trying to use a Level Blueprint to manually set the light color and intensity to red immediately after the 'On Finished' output of the cinematic trigger node.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-15"
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
