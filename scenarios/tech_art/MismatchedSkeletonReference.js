window.SCENARIOS['MismatchedSkeletonReference'] = {
    "meta": {
        "title": "Silent Anim Notify Failure Due to Orphaned Skeleton Asset Reference",
        "description": "The player character's attack animations play correctly in the level viewport, but the associated particle effects and sound effects (triggered by Anim Notifies) never execute in PIE (Play In Editor). However, when opening the attack animation asset directly and viewing it in the Animation Editor viewport, the Anim Notifies fire perfectly, generating the expected effects. This indicates the notify logic is sound, but its execution is blocked in the game environment, possibly due to a reference mismatch following a recent asset migration.",
        "estimateHours": 3,
        "category": "Asset Management",
        "tokens_used": 10446
    },
    "setup": [
        {
            "action": "set_ue_property",
            "scenario": "MismatchedSkeletonReference",
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
            "scenario": "MismatchedSkeletonReference",
            "step": "final"
        }
    ],
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "general",
            "title": "Investigating Anim Notify Failure",
            "prompt": "The player character's attack animations play correctly in PIE, but associated particle and sound Anim Notifies never execute. They work when viewed in the Animation Editor. What's your first diagnostic step?",
            "choices": [
                {
                    "text": "<p>Open the specific animation sequence (e.g., 'Anim_Attack_01') and verify that Anim Notifies are placed correctly and linked to the Animation Blueprint.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.2hrs. This is a crucial first step to confirm the basic setup of the notifies themselves.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Check Project Settings for global sound or FX volume levels, assuming the issue is a system-wide suppression.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.3hrs. The problem states notifies work in the Animation Editor, indicating project settings are unlikely to be the primary cause.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Attempt to recreate all Anim Notifies from scratch in the Animation Sequence, assuming the notify assets themselves are corrupted.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.5hrs. This is premature. You should first diagnose why existing notifies aren't firing rather than assuming corruption.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Check the collision profiles on the character mesh, assuming a physics interaction is preventing the notify from firing.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.4hrs. Anim Notifies are typically triggered by animation timeline events, not directly by collision profiles. This is an unrelated area.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "animation_blueprint",
            "title": "Verifying Anim Notify Logic",
            "prompt": "You've verified the Anim Notifies are correctly placed on the animation timeline and linked. What's the next step to confirm their logic in the Animation Blueprint?",
            "choices": [
                {
                    "text": "<p>In the Animation Blueprint (ABP), confirm the implementation logic for the Anim Notify event (e.g., 'Event_PlayImpactFX') and set a Breakpoint on this event.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.2hrs. Setting a breakpoint is the most effective way to see if the event is even being called at runtime.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Add 'Print String' nodes to the Anim Notify event in the ABP to confirm its execution via the Output Log.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While this can work, a breakpoint is generally more immediate and doesn't require compiling/re-running for each log entry.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Check the character's 'Anim Instance' class in its Blueprint to ensure it's not overridden.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. While important, you're currently focused on the Anim Notify event itself, not the overall Anim Instance setup.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Restart Unreal Editor, believing the Animation Editor's functionality might be cached incorrectly in PIE.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Restarting should be a last resort, not an initial diagnostic step, as it obscures the actual problem.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "debugging",
            "title": "Runtime Execution Check",
            "prompt": "You've set a breakpoint on the Anim Notify event in the Animation Blueprint. How do you now confirm if the event is being fired in PIE?",
            "choices": [
                {
                    "text": "<p>Run PIE and perform the attack. Observe that the Breakpoint in the Animation Blueprint is never hit, confirming the event is not firing at runtime.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.3hrs. This confirms that the problem is not within the Anim Notify event's logic, but rather that the event itself isn't being triggered.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Check the character's 'stat anim' console command for errors related to Anim Notifies.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. 'stat anim' provides performance stats; it won't explicitly tell you if a specific blueprint event is failing to fire.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Attempt to trigger the Anim Notify event manually from the Character Blueprint's Event Graph during PIE.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.3hrs. This might test the event logic, but it bypasses the core problem of why the animation isn't triggering the event naturally.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Remove the breakpoint and rely solely on whether the particle and sound effects appear in PIE.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Removing the breakpoint defeats its purpose and makes debugging harder without direct confirmation of event execution.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "blueprint_component",
            "title": "Character Animation Setup",
            "prompt": "The breakpoint was NOT hit, meaning the Anim BP event isn't triggered. The animation plays. What component in the Player Character Blueprint is responsible for playing animations and assigning the Anim Class?",
            "choices": [
                {
                    "text": "<p>Locate the Skeletal Mesh Component within the Player Character Blueprint. Verify that the Mesh is assigned and the 'Anim Class' is correctly set to the target Animation Blueprint.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. This component is the bridge between the character's visual representation and its animation logic.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Check the 'Animation Mode' property on the Skeletal Mesh Component, ensuring it's set to 'Use Animation Blueprint'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While relevant, verifying the 'Anim Class' itself is more direct for the problem at hand.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Examine the 'Tags' property of the Player Character Blueprint, looking for any animation-related tags.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Tags are generally for classification and filtering, not for direct animation system setup.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Verify the character's 'Movement Component' to ensure it's not interfering with animation playback.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. The movement component controls movement, but the animation itself is playing, so it's unlikely to be the cause of the notify issue.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "asset_details",
            "title": "Skeletal Mesh Skeleton Reference",
            "prompt": "You've confirmed the Skeletal Mesh Component and its 'Anim Class' are correctly set. Now, what specific asset does the Skeletal Mesh itself (e.g., 'SKM_Hero') reference for its bone structure?",
            "choices": [
                {
                    "text": "<p>Open the Skeletal Mesh asset itself (e.g., 'SKM_Hero') and observe which Skeleton asset it is currently associated with in the Asset Details panel.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.2hrs. This reveals the foundational skeleton used by the mesh, which is critical for animation compatibility.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Check the 'Physics Asset' associated with the Skeletal Mesh, thinking it might be a mismatch.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. The Physics Asset defines collision and ragdoll, not the core skeletal structure for animation.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Look for any 'Post Process Anim Blueprint' settings on the Skeletal Mesh asset, assuming a secondary ABP is interfering.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. This is an advanced feature and less likely to cause a complete notify failure if the primary ABP is loaded.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Re-import the 'SKM_Hero' Skeletal Mesh, thinking it might have become corrupted.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.5hrs. Re-importing is a destructive and time-consuming step before proper diagnosis.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "asset_details",
            "title": "Animation Blueprint Skeleton Reference",
            "prompt": "You've identified the Skeletal Mesh ('SKM_Hero') references 'SK_Hero_A'. Now, what about the Animation Blueprint ('ABP_Hero') that is supposed to drive its animations?",
            "choices": [
                {
                    "text": "<p>Open the Animation Blueprint ('ABP_Hero') and check the 'Skeleton' asset displayed in the Asset Details pane of the Animation Blueprint editor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.4hrs. This is the critical comparison point. If this differs from the Skeletal Mesh's skeleton, you've found your mismatch.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Examine the 'Preview Mesh' setting within the Animation Blueprint, ensuring it's set to 'SKM_Hero'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. The 'Preview Mesh' is for editor visualization only; it doesn't dictate the skeleton used by the ABP at runtime.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Check the 'Target Rigs' settings in the Animation Blueprint's Asset Details, assuming a rigging mismatch.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. Target Rigs are for retargeting, not the fundamental skeleton association of the ABP itself.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Recompile the Animation Blueprint, hoping it resolves any internal inconsistencies with its skeleton.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Recompiling won't magically change a fundamental asset reference.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "problem_identification",
            "title": "Identifying the Mismatch",
            "prompt": "You've discovered the Skeletal Mesh ('SKM_Hero') uses 'SK_Hero_A', but the Animation Blueprint ('ABP_Hero') uses 'SK_Hero_B'. What does this critical difference indicate?",
            "choices": [
                {
                    "text": "<p>Realize that the Skeletal Mesh component is compiled against 'SK_Hero_A', but the Anim BP is compiled against 'SK_Hero_B', leading to a runtime mismatch where notifies cannot execute.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.2hrs. This is the core problem! The animation system cannot correctly map the Anim Notifies from an ABP built on a different skeleton.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Assume the 'SK_Hero_A' skeletal mesh is corrupt and needs re-importing, as it's the one currently used.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.5hrs. The mesh itself is likely fine; the problem is its *relationship* with the ABP's skeleton.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Believe it's a minor warning that can be ignored for Anim Notifies, as long as the animation plays.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.3hrs. This is a critical mismatch, not a minor warning. It fundamentally breaks the animation event pipeline.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Conclude the Animation Blueprint simply needs its 'Preview Mesh' updated to 'SKM_Hero' to resolve the conflict.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. The 'Preview Mesh' is cosmetic. The fundamental skeleton reference is the issue.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "content_browser",
            "title": "Locating the Incorrect Skeleton",
            "prompt": "You've identified the orphaned skeleton reference ('SK_Hero_B') in the Animation Blueprint. What's your first action in the Content Browser to begin correcting this?",
            "choices": [
                {
                    "text": "<p>Navigate to the location of the currently referenced, but incorrect, Skeleton asset ('SK_Hero_B') in the Content Browser.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. You need to find the asset to manipulate its references.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Immediately delete 'SK_Hero_B' from the Content Browser, assuming it's entirely obsolete.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.5hrs. Deleting an asset without checking its references can lead to severe data corruption and crashes.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Open the 'SK_Hero_B' asset itself, looking for properties to change that might link it to 'SK_Hero_A'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. Skeleton assets don't have properties to re-link them to other skeletons in this manner. You need to manage references.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Try to manually re-assign the skeleton in the ABP's Asset Details directly, thinking it's a dropdown option.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. While an ABP does have a skeleton slot, directly re-assigning it manually can be complex and might not propagate changes to all dependent assets.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "content_browser_tools",
            "title": "Assessing Reference Impact",
            "prompt": "You've found 'SK_Hero_B' in the Content Browser. Before making changes, how can you confirm which assets are still referencing this incorrect skeleton?",
            "choices": [
                {
                    "text": "<p>Right-click the 'SK_Hero_B' asset and select 'Reference Viewer' to confirm that only the Animation Blueprint and possibly a few related animations are referencing this incorrect skeleton.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.3hrs. The Reference Viewer is essential for understanding asset dependencies and planning safe modifications.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Run an 'Audit Assets' check from the Tools menu for 'SK_Hero_B', to get a detailed report.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.3hrs. 'Audit Assets' is more for deep, complex checks. The 'Reference Viewer' is faster and more direct for this specific task.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Drag 'SK_Hero_A' onto 'SK_Hero_B' in the Content Browser, expecting a 'replace' prompt.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. This action doesn't initiate a reference replacement process; it might just try to move or copy the asset.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Check the 'Size Map' of 'SK_Hero_B' to understand its memory footprint.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. The Size Map is for memory optimization, not for checking which assets link to it.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "asset_management",
            "title": "Replacing References",
            "prompt": "Reference Viewer confirms 'SK_Hero_B' is only referenced by the ABP and possibly related animations. What is the most efficient way to redirect all those references to 'SK_Hero_A'?",
            "choices": [
                {
                    "text": "<p>Right-click the incorrect Skeleton asset ('SK_Hero_B') and select 'Replace References'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. 'Replace References' is the dedicated tool for safely updating asset dependencies across the project.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Manually re-assign the skeleton for every animation asset and Blueprint listed in the Reference Viewer.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +1.0hrs. This is extremely inefficient and prone to errors, especially with many assets.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Try to re-parent the 'SK_Hero_B' skeleton to 'SK_Hero_A' using the Retarget Manager.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.3hrs. Retargeting is for animation data, not for changing the underlying skeleton reference of an asset.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Attempt to merge 'SK_Hero_B' into 'SK_Hero_A' using a migration tool.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.5hrs. Merging skeletons is a complex, often destructive operation. 'Replace References' is designed for this specific scenario.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "asset_management_dialog",
            "title": "Confirming Replacement Target",
            "prompt": "The 'Replace References' dialog is open. What's the next step to complete the operation?",
            "choices": [
                {
                    "text": "<p>In the 'Replace References' dialog, select the correct, currently used Skeleton asset ('SK_Hero_A') as the replacement target and confirm the operation.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.2hrs. This tells Unreal which asset should replace the old, incorrect reference.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Close the dialog, assuming the problem is already solved because you initiated the 'Replace References' command.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. The dialog requires you to specify the replacement target; closing it prematurely will cancel the operation.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Select the 'SKM_Hero' Skeletal Mesh as the replacement target instead of 'SK_Hero_A'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.3hrs. You need to replace a *skeleton* reference with another *skeleton* asset, not a skeletal mesh.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Search for all assets referencing 'SK_Hero_B' in the dialog and manually deselect them, then proceed.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. Deselecting them would prevent the references from being updated, defeating the purpose.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "asset_details",
            "title": "Verifying ABP Update",
            "prompt": "The 'Replace References' operation is complete. How do you confirm that the Animation Blueprint ('ABP_Hero') now correctly points to 'SK_Hero_A'?",
            "choices": [
                {
                    "text": "<p>Open the Animation Blueprint ('ABP_Hero') again. Check the Asset Details panel to confirm the Skeleton reference has been successfully updated to 'SK_Hero_A'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Direct verification in the ABP's Asset Details is crucial to ensure the change took effect.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Trust the system and proceed directly to PIE without explicitly verifying the ABP's reference.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. Skipping verification can lead to confusion if the fix wasn't complete or successful.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Check the 'Preview Mesh' property of the ABP, confirming it's still 'SKM_Hero'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. The 'Preview Mesh' is visual, while the underlying 'Skeleton' reference is what truly matters for compatibility.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Look for any warnings or errors related to 'SK_Hero_B' in the Output Log after the operation.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. While good practice, direct confirmation in the ABP is more immediate and targeted.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "blueprint_compilation",
            "title": "Recompile and Save",
            "prompt": "The Animation Blueprint's skeleton reference is now correct. What is a critical step to ensure these changes are applied and persistent for runtime?",
            "choices": [
                {
                    "text": "<p>Recompile and save the Animation Blueprint ('ABP_Hero').</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Blueprint changes, especially fundamental ones like skeleton references, require recompilation and saving to take effect.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Perform a 'Save Current Level' operation, as this should save all active assets.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. 'Save Current Level' saves the map, not necessarily all modified content assets like Blueprints.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Migrate the Anim BP to a new folder and then back, to force a refresh.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.5hrs. This is an overly aggressive and unnecessary step; simple recompile/save is sufficient.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Right-click the ABP in the Content Browser and select 'Validate Asset'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. 'Validate Asset' checks for errors but doesn't compile or save changes.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "testing",
            "title": "Initial Test in PIE",
            "prompt": "The Animation Blueprint is recompiled and saved with the correct skeleton reference. It's time to check if the issue is resolved.",
            "choices": [
                {
                    "text": "<p>Attempt running PIE to verify the Anim Notifies are now firing (the visual/sound effects should now appear).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. This is the direct test to confirm the fix for the core problem.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Set a new breakpoint in the Anim Notify event in the ABP and re-run PIE for precise debugging.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While not wrong, a visual/auditory check is faster for initial confirmation, then breakpoints if needed.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Close and reopen the entire project, just to ensure all caches are cleared.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. Unnecessary if a recompile/save was done correctly; it wastes time.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Check 'stat anim' in the console to monitor animation performance after the changes.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. Performance is not the immediate concern; verifying the notify execution is.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "asset_management",
            "title": "Persistent Issue (Redirectors)",
            "prompt": "Despite replacing references and recompiling, the issue *still* persists. This suggests lingering problems. What common issue often arises after asset migrations or reference changes?",
            "choices": [
                {
                    "text": "<p>If the issue persists, navigate to the content folder containing the orphaned Skeleton ('SK_Hero_B') and any affected animations/Blueprints.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Lingering issues often point to corrupted redirectors, which are tied to asset folders.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Revert your changes using source control (if available), assuming the problem worsened.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.5hrs. Reverting means losing progress on the correct fix. There's likely a deeper underlying issue to address.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Attempt to migrate the character mesh or Anim BP back into the project, believing the assets are missing data.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +1.0hrs. This is an overly drastic step and doesn't address potential redirector issues, which are common after migrations.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Check the source control history of 'SK_Hero_B' for recent changes.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. While informative, it doesn't directly solve the runtime reference problem.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "content_browser_tools",
            "title": "Fixing Redirectors",
            "prompt": "You are in the content folder where the orphaned skeleton ('SK_Hero_B') used to reside. What Content Browser tool can clean up old, broken asset links?",
            "choices": [
                {
                    "text": "<p>Right-click on the folder in the Content Browser and select 'Fix Up Redirectors in Folder' to clean up any remaining corrupted redirector files.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.3hrs. Redirectors are placeholders for moved/renamed assets; if they become corrupted, they can block correct asset loading.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Manually search and replace all text occurrences of 'SK_Hero_B' in blueprint files via an external text editor.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +1.0hrs. Directly editing UAsset files or their associated blueprints externally is extremely risky and can corrupt assets.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Delete the 'Intermediate' and 'Saved' folders from the project directory, then regenerate project files.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.5hrs. This is a general cleanup step and might resolve some issues, but 'Fix Up Redirectors' is more targeted and safer for this specific problem.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Run 'Validate All Assets' from the Tools menu for the entire project to check for any new errors.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.4hrs. Validation checks for errors but won't actively fix redirectors.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "asset_management",
            "title": "Deleting Obsolete Asset",
            "prompt": "Redirectors in the folder have been fixed. The orphaned skeleton ('SK_Hero_B') should now truly be unreferenced. What's the final step for this specific obsolete asset?",
            "choices": [
                {
                    "text": "<p>After fixing redirectors, manually delete the now-unreferenced or obsolete Skeleton asset ('SK_Hero_B') to prevent future confusion and reference issues.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Deleting unreferenced assets keeps the project clean and prevents accidental re-referencing of old data.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Keep 'SK_Hero_B' in the project, thinking it might be needed later for a different character.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This reintroduces the risk of accidental re-referencing and bloats project size with unused assets.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Move 'SK_Hero_B' to a 'Deprecated' folder instead of deleting it permanently.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While better than keeping it in active folders, full deletion after confirming no references is ideal for true cleanup.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Rename 'SK_Hero_B' to 'SK_Hero_B_OLD' to avoid future conflicts without deleting it.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. Renaming is better than nothing, but full deletion is preferred for unreferenced, obsolete assets.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "project_management",
            "title": "Saving All Changes",
            "prompt": "You've replaced references, fixed redirectors, and deleted the obsolete skeleton. What's the comprehensive action to ensure all these changes are saved and committed to the project?",
            "choices": [
                {
                    "text": "<p>Perform a 'Save All' operation across the project to commit the reference changes and redirector cleanup.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. 'Save All' ensures every modified asset and configuration is written to disk, preventing data loss.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Exit UE5 without saving, assuming changes are automatically saved by the editor.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.3hrs. Unreal Engine does not auto-save all changes comprehensively, especially after critical asset operations. This would lose your work.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Only save the current level, as that's where the character is present.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Saving only the level might miss saving changes to Blueprints or other content assets.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Create a new dummy asset to trigger a 'Save All' prompt when closing the editor.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. This is an indirect way to achieve a save, but performing a direct 'Save All' is more explicit and efficient.</p>",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "testing",
            "title": "Final Confirmation",
            "prompt": "All changes are saved. What's the very last step to confirm the issue is fully and reliably resolved?",
            "choices": [
                {
                    "text": "<p>Run a final PIE session to confirm that all Anim Notifies for the character are now executing reliably.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. A final test is essential to ensure confidence in the solution.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Assume the problem is solved and move on to the next development task.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.5hrs. Skipping the final verification is risky; issues can sometimes reappear or manifest in subtle ways.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Check the Output Log for any 'Fix Up Redirectors' success messages.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While good, this only confirms the redirector fix, not the full functionality of the Anim Notifies.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Re-import the original Skeletal Mesh 'SKM_Hero' just to be absolutely sure everything is fresh.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.5hrs. This is an unnecessary and potentially disruptive step after the problem has been systematically addressed.</p>",
                    "next": "step-19"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario. The silent Anim Notify failure was resolved by identifying and correcting an orphaned skeleton asset reference, followed by cleaning up redirectors and ensuring all assets were correctly saved.</p>",
            "choices": [{"text": "Complete Scenario", "type": "correct", "feedback": "", "next": "end"}]
        }
    }
};
