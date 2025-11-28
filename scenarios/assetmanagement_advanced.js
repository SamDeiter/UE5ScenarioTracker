
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['MismatchedSkeletonReference'] = {
    meta: {
        title: "Silent Anim Notify Failure Due to Orphaned Skeleton Asset Reference",
        description: "The player character's attack animations play correctly in the level viewport, but the associated particle effects and sound effects (triggered by Anim Notifies) never execute in PIE (Play In Editor). However, when opening the attack animation asset directly and viewing it in the Animation Editor viewport, the Anim Notifies fire perfectly, generating the expected effects. This indicates the notify logic is sound, but its execution is blocked in the game environment, possibly due to a reference mismatch following a recent asset migration.",
        difficulty: "medium",
        category: "Asset Management",
        estimate: 3
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "The player character's attack animations play correctly in the level viewport, but the associated particle effects and sound effects (triggered by Anim Notifies) never execute in PIE (Play In Editor). However, when opening the attack animation asset directly and viewing it in the Animation Editor viewport, the Anim Notifies fire perfectly, generating the expected effects. This indicates the notify logic is sound, but its execution is blocked in the game environment, possibly due to a reference mismatch following a recent asset migration.",
        "choices": [
            {
                "text": "If the issue persists, navigate to the content folder containing the orphaned Skeleton ('SK_Hero_B') and any affected animations/Blueprints.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Right-click the incorrect Skeleton asset ('SK_Hero_B') and select 'Replace References'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Perform a 'Save All' operation across the project to commit the reference changes and redirector cleanup.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Attempting to migrate the character mesh or Anim BP back into the project, believing the assets are missing data, rather than having incorrect references.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 1
            },
            {
                "text": "After fixing redirectors, manually delete the now-unreferenced or obsolete Skeleton asset ('SK_Hero_B') to prevent future confusion and reference issues.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Locate the Skeletal Mesh Component within the Player Character Blueprint. Verify that the Mesh is assigned and the 'Anim Class' is correctly set to the target Animation Blueprint.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "In the Animation Blueprint (ABP), confirm the implementation logic for the Anim Notify event (e.g., 'Event_PlayImpactFX') is present and uses standard nodes (e.g., 'Spawn Emitter at Location'). Set a Breakpoint on this event in the ABP.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "In the 'Replace References' dialog, select the correct, currently used Skeleton asset ('SK_Hero_A') as the replacement target and confirm the operation.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Checking the collision profiles on the character mesh, assuming a physics interaction is preventing the notify from firing.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.4
            },
            {
                "text": "Checking Project Settings for Sound or FX volumes, assuming the issue is global audio/rendering suppression.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.3
            },
            {
                "text": "Open the specific animation sequence (e.g., 'Anim_Attack_01') and verify that the Anim Notifies are placed correctly on the timeline and that they are correctly linked to a corresponding function or event in the Animation Blueprint (ABP).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Recompile and save the Animation Blueprint ('ABP_Hero').",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Trying to recreate the Anim Notifies from scratch in the Animation Sequence, assuming the notify asset itself is corrupted.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.5
            },
            {
                "text": "Run PIE and perform the attack. Observe that the Breakpoint in the Animation Blueprint is never hit, confirming that the Anim Notify event is not being fired at runtime, even though the animation is playing.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.3
            },
            {
                "text": "Right-click the 'SK_Hero_B' asset and select 'Reference Viewer' to confirm that only the Animation Blueprint and possibly a few related animations are referencing this incorrect skeleton.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.3
            },
            {
                "text": "Right-click on the folder in the Content Browser and select 'Fix Up Redirectors in Folder' to clean up any remaining corrupted redirector files that might be pointing to the obsolete asset ID.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.3
            },
            {
                "text": "Realize that the Skeletal Mesh component is compiled against 'SK_Hero_A', but the Anim BP is compiled against 'SK_Hero_B', leading to a runtime mismatch where the Notify logic, though correctly present, cannot execute.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Open the Animation Blueprint (ABP_Hero) and check the 'Skeleton' asset displayed in the Asset Details pane of the Animation Blueprint editor. Identify that it is referencing a different, older, or orphaned Skeleton asset (e.g., 'SK_Hero_B').",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.4
            },
            {
                "text": "Attempt running PIE to verify the Anim Notifies are now firing (the visual/sound effects should now appear).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Run a final PIE session to confirm that all Anim Notifies for the character are now executing reliably.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Open the Animation Blueprint ('ABP_Hero') again. Check the Asset Details panel to confirm the Skeleton reference has been successfully updated to 'SK_Hero_A'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Open the Skeletal Mesh asset itself (e.g., 'SKM_Hero') and observe which Skeleton asset it is currently associated with in the Asset Details panel (e.g., 'SK_Hero_A').",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Navigate to the location of the currently referenced, but incorrect, Skeleton asset ('SK_Hero_B') in the Content Browser.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            }
        ]
    }
}
};
