window.SCENARIOS['MismatchedSkeletonReference'] = {
    "meta": {
        "title": "Silent Anim Notify Failure Due to Orphaned Skeleton Asset Reference",
        "description": "The player character's attack animations play correctly in the level viewport, but the associated particle effects and sound effects (triggered by Anim Notifies) never execute in PIE (Play In Editor). However, when opening the attack animation asset directly and viewing it in the Animation Editor viewport, the Anim Notifies fire perfectly, generating the expected effects. This indicates the notify logic is sound, but its execution is blocked in the game environment, possibly due to a reference mismatch following a recent asset migration.",
        "estimateHours": 3,
        "category": "Asset Management"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "asset_management",
            "title": "Step 1",
            "prompt": "<p>Open the specific animation sequence (e.g., 'Anim_Attack_01') and verify that the Anim Notifies are placed correctly on the timeline and that they are correctly linked to a corresponding function or event in the Animation Blueprint (ABP).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the specific animation sequence (e.g., 'Anim_Attack_01') and verify that the Anim Notifies are placed correctly on the timeline and that they are correctly linked to a corresponding function or event in the Animation Blueprint (ABP).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Trying to recreate the Anim Notifies from scratch in the Animation Sequence, assuming the notify asset itself is corrupted.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "asset_management",
            "title": "Step 2",
            "prompt": "<p>In the Animation Blueprint (ABP), confirm the implementation logic for the Anim Notify event (e.g., 'Event_PlayImpactFX') is present and uses standard nodes (e.g., 'Spawn Emitter at Location'). Set a Breakpoint on this event in the ABP.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Animation Blueprint (ABP), confirm the implementation logic for the Anim Notify event (e.g., 'Event_PlayImpactFX') is present and uses standard nodes (e.g., 'Spawn Emitter at Location'). Set a Breakpoint on this event in the ABP.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Checking Project Settings for Sound or FX volumes, assuming the issue is global audio/rendering suppression.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "asset_management",
            "title": "Step 3",
            "prompt": "<p>Run PIE and perform the attack. Observe that the Breakpoint in the Animation Blueprint is never hit, confirming that the Anim Notify event is not being fired at runtime, even though the animation is playing.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Run PIE and perform the attack. Observe that the Breakpoint in the Animation Blueprint is never hit, confirming that the Anim Notify event is not being fired at runtime, even though the animation is playing.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.3hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Attempting to migrate the character mesh or Anim BP back into the project, believing the assets are missing data, rather than having incorrect references.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +1hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "asset_management",
            "title": "Step 4",
            "prompt": "<p>Locate the Skeletal Mesh Component within the Player Character Blueprint. Verify that the Mesh is assigned and the 'Anim Class' is correctly set to the target Animation Blueprint.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate the Skeletal Mesh Component within the Player Character Blueprint. Verify that the Mesh is assigned and the 'Anim Class' is correctly set to the target Animation Blueprint.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Checking the collision profiles on the character mesh, assuming a physics interaction is preventing the notify from firing.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "asset_management",
            "title": "Step 5",
            "prompt": "<p>Open the Skeletal Mesh asset itself (e.g., 'SKM_Hero') and observe which Skeleton asset it is currently associated with in the Asset Details panel (e.g., 'SK_Hero_A').</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Skeletal Mesh asset itself (e.g., 'SKM_Hero') and observe which Skeleton asset it is currently associated with in the Asset Details panel (e.g., 'SK_Hero_A').</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Trying to recreate the Anim Notifies from scratch in the Animation Sequence, assuming the notify asset itself is corrupted.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "asset_management",
            "title": "Step 6",
            "prompt": "<p>Open the Animation Blueprint (ABP_Hero) and check the 'Skeleton' asset displayed in the Asset Details pane of the Animation Blueprint editor. Identify that it is referencing a different, older, or orphaned Skeleton asset (e.g., 'SK_Hero_B').</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Animation Blueprint (ABP_Hero) and check the 'Skeleton' asset displayed in the Asset Details pane of the Animation Blueprint editor. Identify that it is referencing a different, older, or orphaned Skeleton asset (e.g., 'SK_Hero_B').</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.4hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Checking Project Settings for Sound or FX volumes, assuming the issue is global audio/rendering suppression.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "asset_management",
            "title": "Step 7",
            "prompt": "<p>Realize that the Skeletal Mesh component is compiled against 'SK_Hero_A', but the Anim BP is compiled against 'SK_Hero_B', leading to a runtime mismatch where the Notify logic, though correctly present, cannot execute.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Realize that the Skeletal Mesh component is compiled against 'SK_Hero_A', but the Anim BP is compiled against 'SK_Hero_B', leading to a runtime mismatch where the Notify logic, though correctly present, cannot execute.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Attempting to migrate the character mesh or Anim BP back into the project, believing the assets are missing data, rather than having incorrect references.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +1hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "asset_management",
            "title": "Step 8",
            "prompt": "<p>Navigate to the location of the currently referenced, but incorrect, Skeleton asset ('SK_Hero_B') in the Content Browser.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Navigate to the location of the currently referenced, but incorrect, Skeleton asset ('SK_Hero_B') in the Content Browser.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Checking the collision profiles on the character mesh, assuming a physics interaction is preventing the notify from firing.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "asset_management",
            "title": "Step 9",
            "prompt": "<p>Right-click the 'SK_Hero_B' asset and select 'Reference Viewer' to confirm that only the Animation Blueprint and possibly a few related animations are referencing this incorrect skeleton.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Right-click the 'SK_Hero_B' asset and select 'Reference Viewer' to confirm that only the Animation Blueprint and possibly a few related animations are referencing this incorrect skeleton.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.3hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Trying to recreate the Anim Notifies from scratch in the Animation Sequence, assuming the notify asset itself is corrupted.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "asset_management",
            "title": "Step 10",
            "prompt": "<p>Right-click the incorrect Skeleton asset ('SK_Hero_B') and select 'Replace References'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Right-click the incorrect Skeleton asset ('SK_Hero_B') and select 'Replace References'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Checking Project Settings for Sound or FX volumes, assuming the issue is global audio/rendering suppression.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "asset_management",
            "title": "Step 11",
            "prompt": "<p>In the 'Replace References' dialog, select the correct, currently used Skeleton asset ('SK_Hero_A') as the replacement target and confirm the operation.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the 'Replace References' dialog, select the correct, currently used Skeleton asset ('SK_Hero_A') as the replacement target and confirm the operation.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Attempting to migrate the character mesh or Anim BP back into the project, believing the assets are missing data, rather than having incorrect references.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +1hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "asset_management",
            "title": "Step 12",
            "prompt": "<p>Open the Animation Blueprint ('ABP_Hero') again. Check the Asset Details panel to confirm the Skeleton reference has been successfully updated to 'SK_Hero_A'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Animation Blueprint ('ABP_Hero') again. Check the Asset Details panel to confirm the Skeleton reference has been successfully updated to 'SK_Hero_A'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Checking the collision profiles on the character mesh, assuming a physics interaction is preventing the notify from firing.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "asset_management",
            "title": "Step 13",
            "prompt": "<p>Recompile and save the Animation Blueprint ('ABP_Hero').</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Recompile and save the Animation Blueprint ('ABP_Hero').</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Trying to recreate the Anim Notifies from scratch in the Animation Sequence, assuming the notify asset itself is corrupted.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "asset_management",
            "title": "Step 14",
            "prompt": "<p>Attempt running PIE to verify the Anim Notifies are now firing (the visual/sound effects should now appear).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Attempt running PIE to verify the Anim Notifies are now firing (the visual/sound effects should now appear).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Checking Project Settings for Sound or FX volumes, assuming the issue is global audio/rendering suppression.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "asset_management",
            "title": "Step 15",
            "prompt": "<p>If the issue persists, navigate to the content folder containing the orphaned Skeleton ('SK_Hero_B') and any affected animations/Blueprints.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>If the issue persists, navigate to the content folder containing the orphaned Skeleton ('SK_Hero_B') and any affected animations/Blueprints.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Attempting to migrate the character mesh or Anim BP back into the project, believing the assets are missing data, rather than having incorrect references.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +1hrs. This approach wastes time.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "asset_management",
            "title": "Step 16",
            "prompt": "<p>Right-click on the folder in the Content Browser and select 'Fix Up Redirectors in Folder' to clean up any remaining corrupted redirector files that might be pointing to the obsolete asset ID.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Right-click on the folder in the Content Browser and select 'Fix Up Redirectors in Folder' to clean up any remaining corrupted redirector files that might be pointing to the obsolete asset ID.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.3hrs. Correct approach.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Checking the collision profiles on the character mesh, assuming a physics interaction is preventing the notify from firing.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "asset_management",
            "title": "Step 17",
            "prompt": "<p>After fixing redirectors, manually delete the now-unreferenced or obsolete Skeleton asset ('SK_Hero_B') to prevent future confusion and reference issues.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>After fixing redirectors, manually delete the now-unreferenced or obsolete Skeleton asset ('SK_Hero_B') to prevent future confusion and reference issues.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Trying to recreate the Anim Notifies from scratch in the Animation Sequence, assuming the notify asset itself is corrupted.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "asset_management",
            "title": "Step 18",
            "prompt": "<p>Perform a 'Save All' operation across the project to commit the reference changes and redirector cleanup.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Perform a 'Save All' operation across the project to commit the reference changes and redirector cleanup.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Checking Project Settings for Sound or FX volumes, assuming the issue is global audio/rendering suppression.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "asset_management",
            "title": "Step 19",
            "prompt": "<p>Run a final PIE session to confirm that all Anim Notifies for the character are now executing reliably.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Run a final PIE session to confirm that all Anim Notifies for the character are now executing reliably.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Attempting to migrate the character mesh or Anim BP back into the project, believing the assets are missing data, rather than having incorrect references.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +1hrs. This approach wastes time.</p>",
                    "next": "step-19"
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
