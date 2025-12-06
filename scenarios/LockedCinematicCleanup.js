window.SCENARIOS['LockedCinematicCleanup'] = {
    "meta": {
        "title": "Cinematic Sequence Plays, Locks Input, but Fails Final Camera Cut",
        "description": "A critical introductory cinematic, triggered via a collision box in the Level Blueprint, begins playing correctly (actor movement and initial camera work fine). However, just before the final intended camera shot (Shot 05), the viewport goes dark or sticks to the static camera from the previous shot. Crucially, when the sequence finishes, the Player Character remains input-locked, requiring a manual console command or map reload to regain control. The 'On Finished' event in the Level Blueprint never seems to execute, even though the sequence clearly ran for its full duration or aborted silently. Previewing the Level Sequence asset independently works perfectly, showing Shot 05 and restoring control.",
        "estimateHours": 3,
        "category": "Sequencer & Cinematics",
        "tokens_used": 10753
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "general",
            "title": "Step 1: Confirm Input Lock",
            "prompt": "The cinematic plays, but after it should end, the player remains input-locked. The camera is stuck or the screen is dark. What is your immediate next diagnostic step to confirm the player's input state?",
            "choices": [
                {
                    "text": "Enable debug visualization for the Player Controller (e.g., 'DisplayDebug PlayerController' in console) to verify input is indeed locked.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. This quickly confirms the symptom and suggests the sequence cleanup failed.",
                    "next": "step-2"
                },
                {
                    "text": "Restart the Unreal Engine 5 editor to see if it's a transient bug.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. Restarting the editor is rarely the first debugging step for a reproducible bug and provides no diagnostic information.",
                    "next": "step-1"
                },
                {
                    "text": "Spend extensive time checking the Player Controller Blueprint or Game Mode settings, assuming input is being blocked globally.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.75hrs. While input is blocked, this symptom usually points to the local sequence system failing cleanup, not a global input block.",
                    "next": "step-1"
                },
                {
                    "text": "Rebuild the project's C++ code and Blueprints.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.2hrs. This is unlikely to solve a runtime logic error with a Level Sequence and provides no diagnostic insight into the current problem.",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "general",
            "title": "Step 2: Investigate Level Blueprint Trigger",
            "prompt": "You've confirmed input is locked, suggesting the 'On Finished' event in the Level Blueprint might not be firing. Where do you begin investigating the cinematic's trigger and cleanup logic?",
            "choices": [
                {
                    "text": "Examine the Level Blueprint logic responsible for triggering the cinematic (e.g., the Overlap event for the trigger volume) to ensure the 'Play' node is correctly connected.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.2hrs. Starting at the cinematic's entry point in the Level Blueprint is logical to understand its flow.",
                    "next": "step-3"
                },
                {
                    "text": "Check the Project Settings for any global input overrides or sequencer settings.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.2hrs. Project settings are too broad for a specific input lock related to a cinematic and unlikely to provide direct answers.",
                    "next": "step-2"
                },
                {
                    "text": "Inspect the Player Character Blueprint for any input disabling nodes or logic.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.3hrs. While the Player Character handles input, the issue appears specific to the cinematic's completion, making the Level Blueprint a more direct suspect.",
                    "next": "step-2"
                },
                {
                    "text": "Search the entire Level Blueprint for any 'Disable Input' nodes, regardless of context.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.25hrs. While a relevant node, searching blindly without context is less efficient than following the cinematic's known execution path.",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "general",
            "title": "Step 3: Verify Play Node Connection",
            "prompt": "You are in the Level Blueprint, at the collision event that triggers the cinematic. What's the immediate focus to ensure the cinematic is being initiated correctly?",
            "choices": [
                {
                    "text": "Confirm the 'Play' node for the Level Sequence Asset (LS_Hero_Intro) is present and correctly connected from the trigger's output.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. Ensuring the cinematic actually starts is fundamental, even if the primary issue is post-playback.",
                    "next": "step-4"
                },
                {
                    "text": "Add multiple print strings to various parts of the Level Blueprint to see which nodes execute.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.6hrs. While print strings are useful, adding them randomly without first verifying the critical path makes debugging inefficient.",
                    "next": "step-3"
                },
                {
                    "text": "Check the collision settings on the trigger volume again for any misconfigurations.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.15hrs. The cinematic plays, so the trigger volume's collision is likely working. This diverts from the core issue.",
                    "next": "step-3"
                },
                {
                    "text": "Search for an 'On Begin Play' event, assuming the cinematic might be starting incorrectly from the level load.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.1hrs. The cinematic is triggered by a collision, so 'On Begin Play' is not the relevant starting point here.",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "general",
            "title": "Step 4: Inspect 'On Finished' Delegate",
            "prompt": "The cinematic plays, so the 'Play' node seems fine. The key problem is the player remaining input-locked and the 'On Finished' event not firing. What's your next logical point of inspection in the Level Blueprint?",
            "choices": [
                {
                    "text": "Inspect the 'On Finished' event delegate connected to the Level Sequence Player node in the Level Blueprint.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.15hrs. This is the designated point for sequence cleanup logic, making it critical for the input lock issue.",
                    "next": "step-5"
                },
                {
                    "text": "Add a 'Delay' node after the 'Play' node in the Level Blueprint.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. Adding a delay won't resolve a failure in the 'On Finished' event or address the input lock.",
                    "next": "step-4"
                },
                {
                    "text": "Delete and re-add the 'Play' node for the cinematic in the Level Blueprint.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.15hrs. The 'Play' node functions, so recreating it is unlikely to help with the 'On Finished' issue.",
                    "next": "step-4"
                },
                {
                    "text": "Look for a 'Stop Sequence' node connected somewhere else in the Level Blueprint.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.1hrs. While a 'Stop Sequence' node exists, it wouldn't prevent the 'On Finished' event from being called if the sequence genuinely finished.",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "general",
            "title": "Step 5: Verify Input Restoration Logic",
            "prompt": "You've navigated to the 'On Finished' event delegate. What specific logic are you looking for to ensure player input is restored, and what needs to be confirmed about its connection?",
            "choices": [
                {
                    "text": "Verify that input restoration logic (e.g., an 'Enable Input' node) is present and correctly connected to the Player Controller.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. This confirms the Level Blueprint has the intended cleanup logic in place.",
                    "next": "step-6"
                },
                {
                    "text": "Recompile the Level Blueprint without making any changes.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Recompiling without changes won't fix a logical error or a missed connection.",
                    "next": "step-5"
                },
                {
                    "text": "Add another 'Play' node in sequence after the existing 'Play' node.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. This would trigger another cinematic or restart the current one, not restore input after the first one.",
                    "next": "step-5"
                },
                {
                    "text": "Change the Player Controller reference in the 'Enable Input' node to 'Get Player Character'.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.15hrs. Input is handled by the Player Controller, not directly the Player Character. This would break input restoration.",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "general",
            "title": "Step 6: Investigate Level Sequence Asset",
            "prompt": "The Level Blueprint's 'On Finished' event *appears* correct, but it's not firing. This strongly indicates the issue lies within the Level Sequence asset itself, causing it to never properly 'finish'. What's your next step?",
            "choices": [
                {
                    "text": "Open the Level Sequence Asset (LS_Hero_Intro) to inspect its internal settings and tracks.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.2hrs. The sequence asset itself is the most likely place to find why it's not completing gracefully.",
                    "next": "step-7"
                },
                {
                    "text": "Delete and re-add the Level Sequence Player node in the Level Blueprint.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.15hrs. If the problem is internal to the asset, recreating its player node won't help.",
                    "next": "step-6"
                },
                {
                    "text": "Check the 'Auto Play' setting on the Level Sequence Actor placed in the level.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. The sequence is already playing via the Level Blueprint; 'Auto Play' isn't the relevant setting for the 'On Finished' event.",
                    "next": "step-6"
                },
                {
                    "text": "Recreate the entire trigger collision box and its associated Level Blueprint logic.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.2hrs. This is an unnecessary and time-consuming step since the trigger is successfully initiating the sequence.",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "general",
            "title": "Step 7: Locate Master Track Settings",
            "prompt": "You are now inside the Level Sequence Asset (LS_Hero_Intro). You need to find a setting that dictates how the sequence behaves upon its conclusion. Where do you look for this high-level sequence behavior?",
            "choices": [
                {
                    "text": "Examine the Master Track settings within the Level Sequence Asset.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. The Master Track holds global settings for the sequence's playback and completion.",
                    "next": "step-8"
                },
                {
                    "text": "Review the individual actor tracks for specific end settings on each character.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. While individual tracks have settings, the 'On Finished' issue is global to the sequence, pointing to a master setting.",
                    "next": "step-7"
                },
                {
                    "text": "Check the properties of the Level Sequence Actor in the main editor viewport.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.15hrs. The Level Sequence Actor has some properties, but the 'When Finished' setting is internal to the asset itself.",
                    "next": "step-7"
                },
                {
                    "text": "Look at the animation track settings for the main character in the sequence.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.1hrs. Animation track settings only affect the character's animation, not the overall sequence's completion behavior.",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "general",
            "title": "Step 8: Review 'When Finished' Setting",
            "prompt": "You're in the Master Track settings. What specific property often dictates what happens when a sequence concludes, and could influence whether the Level Blueprint's 'On Finished' event is triggered?",
            "choices": [
                {
                    "text": "Review the 'When Finished' setting of the Master Track.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. This setting directly controls the sequence's post-playback behavior and is crucial for cleanup.",
                    "next": "step-9"
                },
                {
                    "text": "Look for an 'Auto Restore Input' checkbox within the Master Track settings.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. No such explicit setting exists. You're looking for a more general completion behavior setting.",
                    "next": "step-8"
                },
                {
                    "text": "Adjust the sequence's overall duration or playback rate.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.15hrs. These settings affect *how* the sequence plays, not *what happens after* it finishes.",
                    "next": "step-8"
                },
                {
                    "text": "Change the 'Loop' setting in the Master Track.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.1hrs. While related to playback, 'Loop' determines if it repeats, not its final state upon completion.",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "general",
            "title": "Step 9: Note 'Keep State' Setting",
            "prompt": "You've located the 'When Finished' setting in the Master Track. What is its current value, and what does this imply about the sequence's final behavior?",
            "choices": [
                {
                    "text": "Note that it is currently set to 'Keep State', meaning the sequence attempts to maintain the final state of its actors, which can prevent proper cleanup if a critical error occurs.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. Recognizing 'Keep State' is crucial. If the sequence aborts silently, 'Keep State' will leave actors in an undefined or broken state.",
                    "next": "step-10"
                },
                {
                    "text": "It's set to 'Restore State', meaning it should already be restoring player input and other states.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. This contradicts the observed behavior of input being locked, so it's an incorrect assumption.",
                    "next": "step-9"
                },
                {
                    "text": "It's set to 'Continue Playing', which indicates the sequence never actually ends.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.15hrs. 'Continue Playing' is not a standard 'When Finished' option for typical Level Sequences.",
                    "next": "step-9"
                },
                {
                    "text": "It's set to 'Bake Animation', which is unrelated to the playback behavior.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.1hrs. 'Bake Animation' is an export option, not a runtime 'When Finished' setting.",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "general",
            "title": "Step 10: Temporary 'Restore State' Test",
            "prompt": "Given that 'When Finished' is set to 'Keep State' and the 'On Finished' event isn't firing, what's a quick, temporary test to see if this setting directly contributes to the input lock issue?",
            "choices": [
                {
                    "text": "Temporarily change the Level Sequence 'When Finished' setting from 'Keep State' to 'Restore State' and retest the cinematic.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.2hrs. This test will determine if the sequence's 'Keep State' behavior is preventing proper termination and cleanup.",
                    "next": "step-11"
                },
                {
                    "text": "Delete the 'On Finished' event in the Level Blueprint, assuming it's somehow causing the problem.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. Deleting the cleanup logic will definitely not restore input.",
                    "next": "step-10"
                },
                {
                    "text": "Add a 'Stop Sequence' node at the very end of the Level Blueprint logic, just in case.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.15hrs. If the sequence never truly 'finishes', a separate 'Stop Sequence' node might not be reached or effective.",
                    "next": "step-10"
                },
                {
                    "text": "Force the Level Sequence to manually finish using a console command after a fixed duration.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.2hrs. While possible for debugging, manually finishing doesn't identify the root cause of why it's not finishing automatically.",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "general",
            "title": "Step 11: Confirm Input Restoration",
            "prompt": "You've changed 'When Finished' to 'Restore State' and retested. What do you observe regarding player input after the cinematic now plays through?",
            "choices": [
                {
                    "text": "Player input is now restored, indicating that the original 'Keep State' combined with an internal sequence error was preventing the Level Blueprint's 'On Finished' from executing.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. This confirms the sequence's completion behavior was indeed the issue, but it's a symptom, not the root cause of why it wasn't finishing properly.",
                    "next": "step-12"
                },
                {
                    "text": "Input is still locked, so the 'When Finished' setting is not the cause of the input problem.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.15hrs. This contradicts the expected behavior. You might have made a mistake in changing the setting or retesting.",
                    "next": "step-11"
                },
                {
                    "text": "The entire sequence no longer plays at all.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.15hrs. Changing 'When Finished' should not prevent the sequence from playing. This indicates another error.",
                    "next": "step-11"
                },
                {
                    "text": "The camera cut issue is resolved, but input is still locked.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.2hrs. While a partial fix, this indicates the 'Restore State' didn't fully resolve the input problem, suggesting multiple issues or an incomplete fix.",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "general",
            "title": "Step 12: Analyze Camera Cut Track",
            "prompt": "The input lock is temporarily resolved, but the camera still fails at Shot 05 (either a dark screen or stuck on the previous shot's camera). Where in the Level Sequence asset do you investigate this visual issue?",
            "choices": [
                {
                    "text": "Analyze the Camera Cut Track within the Level Sequence, specifically focusing on the transition into Shot 05.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.25hrs. The Camera Cut Track directly controls camera switching and is the primary place to diagnose camera cut failures.",
                    "next": "step-13"
                },
                {
                    "text": "Attempt to troubleshoot the camera black screen issue by rebuilding lighting or reflections.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.4hrs. A camera cut failure is almost never a rendering issue; rebuilding lighting is a significant detour.",
                    "next": "step-12"
                },
                {
                    "text": "Check the post-process volume settings in the level, assuming it's applying a black tint.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.2hrs. While post-processing can affect visuals, a camera cut failure is typically a logic problem, not a visual effect.",
                    "next": "step-12"
                },
                {
                    "text": "Adjust the global exposure settings in World Settings.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.15hrs. Exposure might make a dark screen brighter but won't fix the underlying camera cut issue.",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "general",
            "title": "Step 13: Note Shot 05 Start Frame",
            "prompt": "You're on the Camera Cut Track, focusing on Shot 05. What specific information do you need about Shot 05's timing to understand its behavior?",
            "choices": [
                {
                    "text": "Note the starting frame of Shot 05 to understand its precise timing and ensure it aligns correctly.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. Understanding the exact start time is important for investigating what happens at that moment.",
                    "next": "step-14"
                },
                {
                    "text": "Manually adjust the frame alignment on the Camera Cut track, believing the cut is happening mid-frame and causing the stutter/hang.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.5hrs. Adjusting alignment without knowing the root cause is speculative and could introduce new timing issues.",
                    "next": "step-13"
                },
                {
                    "text": "Delete Shot 04 and Shot 05 to recreate them from scratch.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.25hrs. Recreating tracks is a last resort. Diagnosis should come first.",
                    "next": "step-13"
                },
                {
                    "text": "Change the blend type between Shot 04 and Shot 05.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.15hrs. A different blend type won't fix a complete failure to cut; it only changes the transition style.",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "general",
            "title": "Step 14: Inspect Camera Binding",
            "prompt": "The Camera Cut Track indicates Shot 05 should play, but it's failing. The issue must be with the camera itself that Shot 05 is trying to use. How do you find which camera is linked to Shot 05?",
            "choices": [
                {
                    "text": "Inspect the binding for the Cinematic Camera Actor used in Shot 05, finding the track where the camera is either possessed or spawned.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.3hrs. This leads directly to the specific camera actor that the failing shot is trying to utilize.",
                    "next": "step-15"
                },
                {
                    "text": "Add a new Cinematic Camera Actor to the level and try to replace the existing one via a dropdown.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.15hrs. You first need to identify the problematic camera, not just add a new one.",
                    "next": "step-14"
                },
                {
                    "text": "Re-import the entire Level Sequence asset.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.2hrs. Re-importing is unlikely to fix a binding issue for a missing actor.",
                    "next": "step-14"
                },
                {
                    "text": "Check the properties of the Director Track in the sequence.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.1hrs. While the Director Track orchestrates, the specific camera binding is found on its own dedicated track.",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "general",
            "title": "Step 15: Identify Binding Type and Name",
            "prompt": "You've located the camera binding for Shot 05. What crucial details about this binding must you identify to diagnose its failure?",
            "choices": [
                {
                    "text": "Identify that the camera binding references a specific Level-placed Static Camera Actor named 'FinalShotCam_A', and that it's set as a 'Possessable' binding.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.3hrs. Knowing the name of the actor and that it's a 'Possessable' binding is key to understanding how the sequence interacts with it.",
                    "next": "step-16"
                },
                {
                    "text": "Note the camera's focal length and aperture settings.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. These settings relate to visual properties, not the ability to cut to or possess the camera.",
                    "next": "step-15"
                },
                {
                    "text": "Adjust the camera's transform values (location/rotation) within the sequence.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.15hrs. Adjusting transforms assumes the camera is present and possessable, which isn't the current problem.",
                    "next": "step-15"
                },
                {
                    "text": "Change the camera's viewport settings within the Level Sequence editor.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.1hrs. Viewport settings affect how you see the camera in the editor, not its runtime behavior.",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "general",
            "title": "Step 16: Verify Camera Existence in World Outliner",
            "prompt": "The sequence is trying to *possess* 'FinalShotCam_A'. What's the critical next step to verify the existence and validity of this specific camera actor in the level?",
            "choices": [
                {
                    "text": "Examine the World Outliner and verify the existence and state of 'FinalShotCam_A'.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.4hrs. Since it's a 'Possessable' binding, the actor must exist in the level. The World Outliner is the authoritative source for this.",
                    "next": "step-17"
                },
                {
                    "text": "Right-click the camera binding in the sequence and try to force a rebind to a new camera.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.15hrs. While a potential fix, you first need to confirm *why* the current binding is broken.",
                    "next": "step-16"
                },
                {
                    "text": "Create a brand new Level Sequence just for Shot 05 to see if it works in isolation.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.25hrs. This is an indirect approach; checking the existing actor's validity is more direct.",
                    "next": "step-16"
                },
                {
                    "text": "Export and then re-import the camera track from the Level Sequence.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.2hrs. This is unlikely to fix an issue where the bound actor itself is missing.",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "general",
            "title": "Step 17: Diagnose Missing Camera",
            "prompt": "You've checked the World Outliner for 'FinalShotCam_A'. What did you discover about this camera actor?",
            "choices": [
                {
                    "text": "You determine that 'FinalShotCam_A' was previously deleted from the level, but the sequence binding was never updated, causing a null reference.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. This is the root cause of the camera cut failure: the sequence is trying to possess a non-existent actor.",
                    "next": "step-18"
                },
                {
                    "text": "The camera is present, but its visibility in the editor is toggled off.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.15hrs. Editor visibility does not affect runtime possession.",
                    "next": "step-17"
                },
                {
                    "text": "The camera is present, but it's set to 'Hidden In Game' in its actor properties.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.2hrs. Being hidden in-game would hide the camera's render, but the possession itself might still occur (leading to a dark screen, but not an input lock).",
                    "next": "step-17"
                },
                {
                    "text": "The camera is present, but it's parented incorrectly to another actor.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.15hrs. Incorrect parenting might affect its position, but not its fundamental ability to be possessed by the sequence.",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "general",
            "title": "Step 18: Fix Camera Binding",
            "prompt": "You've identified the root cause: a deleted 'Possessable' camera ('FinalShotCam_A'). How do you correctly resolve this broken binding issue within the Level Sequence?",
            "choices": [
                {
                    "text": "Replace the broken Possessable binding for 'FinalShotCam_A' by adding a new, valid 'Spawnable' Cinematic Camera Actor to the track at the beginning of Shot 05.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.3hrs. Using a 'Spawnable' camera is robust as it ensures the camera exists and is managed by the sequence itself.",
                    "next": "step-19"
                },
                {
                    "text": "Re-add a static camera actor to the level with the *exact same name* ('FinalShotCam_A').",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.15hrs. While this might fix the binding, relying on a specific name for a level-placed asset is prone to future errors. 'Spawnable' is preferred.",
                    "next": "step-18"
                },
                {
                    "text": "Convert the existing broken 'Possessable' binding to a 'Spawnable' binding directly without selecting a new camera.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.2hrs. You cannot convert a broken binding to a spawnable one without specifying *what* to spawn.",
                    "next": "step-18"
                },
                {
                    "text": "Remove the camera cut to Shot 05 entirely from the Camera Cut Track.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.15hrs. This avoids the problem but doesn't solve it, and removes a critical part of the cinematic.",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "general",
            "title": "Step 19: Revert 'When Finished' Setting",
            "prompt": "The camera binding issue is now fixed. You previously set the Level Sequence's 'When Finished' setting to 'Restore State' as a temporary diagnostic. What should you do with that setting now that the root cause is addressed?",
            "choices": [
                {
                    "text": "Revert the Level Sequence 'When Finished' setting back to its original value of 'Keep State'.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.2hrs. Now that the sequence no longer aborts, 'Keep State' can function as intended, and the Level Blueprint's 'On Finished' can handle specific cleanup.",
                    "next": "step-20"
                },
                {
                    "text": "Leave 'When Finished' set to 'Restore State' since it helped fix the input problem.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.15hrs. While it temporarily helped, the correct workflow is to have 'Keep State' and rely on the Level Blueprint for controlled cleanup.",
                    "next": "step-19"
                },
                {
                    "text": "Delete the Master Track from the sequence altogether.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.15hrs. Deleting the Master Track would severely break the sequence's functionality.",
                    "next": "step-19"
                },
                {
                    "text": "Add an explicit 'Stop Sequence' node at the very end of the sequence's timeline.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.1hrs. While this would stop it, the 'When Finished' setting is designed to handle this behavior more gracefully.",
                    "next": "step-19"
                }
            ]
        },
        "step-20": {
            "skill": "general",
            "title": "Step 20: Confirm Level BP Cleanup Execution",
            "prompt": "With the camera binding fixed and 'When Finished' reverted to 'Keep State', what do you need to verify about the Level Blueprint's 'On Finished' event logic?",
            "choices": [
                {
                    "text": "Test the cinematic again and confirm that the 'On Finished' delegate in the Level Blueprint now executes correctly, properly restoring player input.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. The sequence should now complete without errors, allowing the Level Blueprint's cleanup logic to run as intended.",
                    "next": "step-21"
                },
                {
                    "text": "Add a 'Print String' at the very beginning of the Level Blueprint execution to confirm it initializes.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. The 'On Finished' event is at the *end* of the cinematic process, not the beginning of the level.",
                    "next": "step-20"
                },
                {
                    "text": "Add a new 'Delay' node after the 'Play' node, just in case.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. A delay won't help confirm the execution of the 'On Finished' event; it only postpones the sequence playback.",
                    "next": "step-20"
                },
                {
                    "text": "Connect the 'On Finished' event directly to a 'Restart Level' node.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.15hrs. This would bypass the intended input restoration and forcefully restart the level, which is not the desired outcome.",
                    "next": "step-20"
                }
            ]
        },
        "step-21": {
            "skill": "general",
            "title": "Step 21: Final Full Playback Test",
            "prompt": "All identified issues should now be resolved: the camera binding is fixed, and the Level Blueprint's 'On Finished' event should execute correctly. What is your final, comprehensive verification step?",
            "choices": [
                {
                    "text": "Conduct a full level playback test in the editor to confirm the camera cuts correctly to Shot 05, and that player input is properly restored via the Level Blueprint's 'On Finished' logic.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.4hrs. A complete test ensures all parts of the cinematic and its cleanup are functioning as expected.",
                    "next": "conclusion"
                },
                {
                    "text": "Only test the camera cut for Shot 05 in isolation within the Level Sequence editor.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.15hrs. An isolated test doesn't confirm the end-to-end flow, especially the Level Blueprint's 'On Finished' event.",
                    "next": "step-21"
                },
                {
                    "text": "Verify that console commands are still available to the player.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.1hrs. While part of general input, it's not the primary focus of player control restoration.",
                    "next": "step-21"
                },
                {
                    "text": "Push the changes to source control without a final in-editor test.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.3hrs. Always perform a thorough final test before committing changes, especially after significant debugging.",
                    "next": "step-21"
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
