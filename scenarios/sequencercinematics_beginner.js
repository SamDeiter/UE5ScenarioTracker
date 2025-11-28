
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['SequencerLightRestoreStateIssue'] = {
    meta: {
        title: "Cinematic Light Fails to Persist After Sequence Stops",
        description: "When testing the short cinematic sequence, the camera cuts and character animation play correctly. However, a tracked Spotlight, which has its intensity and color keyframed to be red at the end of the sequence, immediately turns off and reverts to its initial intensity (or disappears) the moment the sequence finishes playing. The light should remain red and on, illuminating the scene after the cinematic concludes. The actor itself is persistent in the level.",
        difficulty: "medium",
        category: "Sequencer & Cinematics",
        estimate: 0.75
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "When testing the short cinematic sequence, the camera cuts and character animation play correctly. However, a tracked Spotlight, which has its intensity and color keyframed to be red at the end of the sequence, immediately turns off and reverts to its initial intensity (or disappears) the moment the sequence finishes playing. The light should remain red and on, illuminating the scene after the cinematic concludes. The actor itself is persistent in the level.",
        "choices": [
            {
                "text": "Scrub the timeline to the final frame of the sequence and verify that the keyframes for Intensity and Light Color are correctly set (Intensity > 0, Color = Red) and that the keyframes are present on the final frame.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Click the 'Save All' button in the main Unreal Editor toolbar to ensure both the Level Sequence asset and the current Level are saved.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.02
            },
            {
                "text": "Return to the level viewport and trigger the cinematic playback (e.g., using PIE mode or walking into the trigger volume).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.08
            },
            {
                "text": "Double-click the Level Sequence Asset within the Level Sequence Actor's Details panel or Content Browser to open the Sequencer editor.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            },
            {
                "text": "Checking the mobility settings (e.g., ensuring the light is Movable) on the Light Actor in the Level Details panel, assuming a lighting bake or static issue is causing the behavior.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.15
            },
            {
                "text": "Locate the 'Binding' section within the Sequencer Details panel for the selected light actor.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Trying to use a Level Blueprint to manually set the light color and intensity to red immediately after the 'On Finished' output of the cinematic trigger node.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.3
            },
            {
                "text": "Locate the Level Sequence Actor associated with the cinematic in the Outliner (or Content Browser if dynamically played).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            },
            {
                "text": "Uncheck the 'Restore State' option. This instructs Sequencer to leave the actor's properties at the state defined by the final keyframe.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.08
            },
            {
                "text": "Verify that the light is now red and remains on with the keyframed intensity after the sequence successfully finishes and the playback cursor stops.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Expand the 'Binding' section settings to expose advanced cinematic options.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            },
            {
                "text": "Attempting to change the 'When Finished' option on the main Level Sequence Actor in the level to 'Keep State' or 'Keep Last Frame', believing this affects Possessable Actor properties rather than just the sequence playback cursor.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.25
            },
            {
                "text": "Confirm that the light actor is listed as a 'Possessable' (green icon) since it is an existing actor in the level and should maintain its state.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.04
            },
            {
                "text": "In the Sequencer editor, identify the specific track binding for the problematic persistent light actor (e.g., 'Spotlight_Environment_01').",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.04
            },
            {
                "text": "With the light binding track selected, locate the 'Details' panel specific to the Sequencer editor (this panel often needs to be explicitly enabled via the Window menu within Sequencer).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Close the Sequencer editor window.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.02
            },
            {
                "text": "Find the boolean property labeled 'Restore State' or 'Restore State/Keep State'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Observe that the 'Restore State' checkbox is currently enabled (checked). This setting automatically reverts the actor's properties to their pre-sequence values upon completion or stopping.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            }
        ]
    }
}
};
