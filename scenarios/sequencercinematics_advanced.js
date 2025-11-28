
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['LockedCinematicCleanup'] = {
    meta: {
        title: "Cinematic Sequence Plays, Locks Input, but Fails Final Camera Cut",
        description: "A critical introductory cinematic, triggered via a collision box in the Level Blueprint, begins playing correctly (actor movement and initial camera work fine). However, just before the final intended camera shot (Shot 05), the viewport goes dark or sticks to the static camera from the previous shot. Crucially, when the sequence finishes, the Player Character remains input-locked, requiring a manual console command or map reload to regain control. The 'On Finished' event in the Level Blueprint never seems to execute, even though the sequence clearly ran for its full duration or aborted silently. Previewing the Level Sequence asset independently works perfectly, showing Shot 05 and restoring control.",
        difficulty: "medium",
        category: "Sequencer & Cinematics",
        estimate: 3
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "A critical introductory cinematic, triggered via a collision box in the Level Blueprint, begins playing correctly (actor movement and initial camera work fine). However, just before the final intended camera shot (Shot 05), the viewport goes dark or sticks to the static camera from the previous shot. Crucially, when the sequence finishes, the Player Character remains input-locked, requiring a manual console command or map reload to regain control. The 'On Finished' event in the Level Blueprint never seems to execute, even though the sequence clearly ran for its full duration or aborted silently. Previewing the Level Sequence asset independently works perfectly, showing Shot 05 and restoring control.",
        "choices": [
            {
                "text": "Test the level sequence playback in editor to confirm the camera cuts correctly to Shot 05 and that player input is properly restored via the Level Blueprint's 'On Finished' logic.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.4
            },
            {
                "text": "Replace the broken Possessable binding for 'FinalShotCam_A' by adding a new, valid 'Spawnable' Cinematic Camera Actor to the track at the beginning of Shot 05.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.3
            },
            {
                "text": "Inspect the 'On Finished' event delegate connected to the Level Sequence Player node in the Level Blueprint. Confirm that the logic intended to restore player input (e.g., 'Enable Input') is present and connected.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Debugging the Level Blueprint by adding multiple print strings without first verifying if the sequence is successfully executing all its internal possess/spawn logic.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.6
            },
            {
                "text": "Open the Level Sequence Asset (LS_Hero_Intro) and check its Master Track settings. Specifically, review the 'When Finished' setting. Note that it is currently set to 'Keep State'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Identify that the camera binding for Shot 05 references a specific Level-placed Static Camera Actor named 'FinalShotCam_A' which is set as a 'Possessable' binding.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.3
            },
            {
                "text": "Inspect the binding for the Cinematic Camera Actor used in Shot 05. Find the track where the camera is possessed or spawned.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.3
            },
            {
                "text": "Enable debug visualization to confirm the Player Controller's input state (e.g., using 'DisplayDebug PlayerController' in the console) and verify that input is indeed locked, confirming the sequence cleanup failed to execute.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Locate and examine the Level Blueprint logic responsible for triggering the cinematic (e.g., the Overlap event for the trigger volume) to ensure the 'Play' node for the Level Sequence Asset (LS_Hero_Intro) is correctly connected.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "If step 5 was temporary, revert the Level Sequence 'When Finished' setting back to 'Keep State' and confirm the 'On Finished' delegate in the Level Blueprint now executes correctly because the sequence no longer aborts due to the invalid reference.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Analyze the Camera Cut Track, focusing on the transition into Shot 05. Note the starting frame of Shot 05 (e.g., Frame 500).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.25
            },
            {
                "text": "Attempting to troubleshoot the camera black screen issue by rebuilding lighting or reflections, assuming a rendering failure rather than a binding failure.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.4
            },
            {
                "text": "Manually adjusting the frame alignment on the Camera Cut track, believing the cut is happening mid-frame and causing the stutter/hang.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.5
            },
            {
                "text": "Spending extensive time checking the Player Controller Blueprint or Game Mode settings, assuming input is being blocked globally rather than locally by the Sequencer system.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.75
            },
            {
                "text": "Temporarily change the Level Sequence 'When Finished' setting from 'Keep State' to 'Restore State' to see if it fixes the input lock issue, indicating a failure in the Level Blueprint cleanup path.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Examine the World Outliner and verify the existence and state of 'FinalShotCam_A'. Determine that this actor was previously deleted from the level but the sequence binding was never updated, causing an unhandled null reference when the sequence attempts to possess it.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.4
            }
        ]
    }
}
};
