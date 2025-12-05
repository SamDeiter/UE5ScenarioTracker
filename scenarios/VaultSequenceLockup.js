window.SCENARIOS['VaultSequenceLockup'] = {
    "meta": {
        "title": "Asynchronous Sequence Failure in Vault Opening System",
        "description": "When the player interacts with the Security Console (BP_Console), the vault opening sequence initiates. Audible feedback confirms the system is running (lights flash, countdown SFX begins), and the 8.0-second countdown is internally triggered. However, once the timer expires, the heavy vault door (BP_VaultDoor) remains completely shut, and the final 'Open Door' function (including animation and final SFX) never executes. The Output Log shows no runtime errors related to the failure, indicating a logic or reference breakdown across multiple actors (BP_Console, BP_SecuritySystem, BP_PowerRelay, and BP_VaultDoor).",
        "estimateHours": 3.1,
        "category": "Blueprints & Logic"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "blueprintslogic",
            "title": "Step 1",
            "prompt": "<p>Place Print String nodes after the interaction event in BP_Console and BP_SecuritySystem to confirm that the sequence successfully starts and the Event Dispatcher (ED_SequenceStart) is called.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Place Print String nodes after the interaction event in BP_Console and BP_SecuritySystem to confirm that the sequence successfully starts and the Event Dispatcher (ED_SequenceStart) is called.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Adjusting the animation playback speed or blend settings within the BP_VaultDoor's timeline, assuming the animation is hanging up physically.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.75hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "blueprintslogic",
            "title": "Step 2",
            "prompt": "<p>In BP_VaultDoor, confirm the binding to ED_SequenceStart is active. Trace the execution flow initiated by the binding, confirming that a Timer is successfully set for the function `HandleOpening` at an interval of 8.0 seconds.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In BP_VaultDoor, confirm the binding to ED_SequenceStart is active. Trace the execution flow initiated by the binding, confirming that a Timer is successfully set for the function `HandleOpening` at an interval of 8.0 seconds.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Deleting and recreating the Timer node in BP_VaultDoor, assuming the timer handle is corrupt, without investigating the logical failure branch.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "blueprintslogic",
            "title": "Step 3",
            "prompt": "<p>Set a Breakpoint inside BP_VaultDoor's `HandleOpening` function and observe execution. Confirm the flow fails at the initial Branch node checking the Boolean variable `bSecurityFlagReady` (which is currently False).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Set a Breakpoint inside BP_VaultDoor's `HandleOpening` function and observe execution. Confirm the flow fails at the initial Branch node checking the Boolean variable `bSecurityFlagReady` (which is currently False).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.3hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Trying to fix the race condition by changing the door's opening function to use an Event Tick or looping function instead of a single Timer execution.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +1hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "blueprintslogic",
            "title": "Step 4",
            "prompt": "<p>Identify the logic that sets `bSecurityFlagReady` to True. Trace it to the Custom Event `ReceiveSecurityGrant`, which is called externally via the BPI_GrantAccess Blueprint Interface.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Identify the logic that sets `bSecurityFlagReady` to True. Trace it to the Custom Event `ReceiveSecurityGrant`, which is called externally via the BPI_GrantAccess Blueprint Interface.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Focusing only on the 8.0s vs 10.0s timing mismatch and failing to diagnose the underlying null reference causing the Interface message failure.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +1.5hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "blueprintslogic",
            "title": "Step 5",
            "prompt": "<p>Inspect BP_PowerRelay (the security authorization actor) and confirm it is also bound to ED_SequenceStart.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Inspect BP_PowerRelay (the security authorization actor) and confirm it is also bound to ED_SequenceStart.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Adjusting the animation playback speed or blend settings within the BP_VaultDoor's timeline, assuming the animation is hanging up physically.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.75hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "blueprintslogic",
            "title": "Step 6",
            "prompt": "<p>Analyze the granting logic in BP_PowerRelay triggered by the dispatcher. Note the presence of a Delay node (set to 10.0 seconds) immediately preceding the Interface Message (BPI_GrantAccess) execution.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Analyze the granting logic in BP_PowerRelay triggered by the dispatcher. Note the presence of a Delay node (set to 10.0 seconds) immediately preceding the Interface Message (BPI_GrantAccess) execution.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Deleting and recreating the Timer node in BP_VaultDoor, assuming the timer handle is corrupt, without investigating the logical failure branch.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "blueprintslogic",
            "title": "Step 7",
            "prompt": "<p>Identify the first root cause: a timing race condition. The door attempts to open at 8.0 seconds, but the authorization is delayed until 10.0 seconds, leading to premature failure in the door logic.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Identify the first root cause: a timing race condition. The door attempts to open at 8.0 seconds, but the authorization is delayed until 10.0 seconds, leading to premature failure in the door logic.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.4hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Trying to fix the race condition by changing the door's opening function to use an Event Tick or looping function instead of a single Timer execution.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +1hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "blueprintslogic",
            "title": "Step 8",
            "prompt": "<p>Adjust the Delay in BP_PowerRelay from 10.0 seconds to 7.5 seconds to attempt to beat the door timer.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Adjust the Delay in BP_PowerRelay from 10.0 seconds to 7.5 seconds to attempt to beat the door timer.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Focusing only on the 8.0s vs 10.0s timing mismatch and failing to diagnose the underlying null reference causing the Interface message failure.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +1.5hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "blueprintslogic",
            "title": "Step 9",
            "prompt": "<p>Test the system. Observe that the problem persists, or the Interface Message fails to execute its target, indicating an issue beyond simple timing.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Test the system. Observe that the problem persists, or the Interface Message fails to execute its target, indicating an issue beyond simple timing.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Adjusting the animation playback speed or blend settings within the BP_VaultDoor's timeline, assuming the animation is hanging up physically.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.75hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "blueprintslogic",
            "title": "Step 10",
            "prompt": "<p>Debug the target reference used by BP_PowerRelay to send BPI_GrantAccess (the variable `TargetVault`). Confirm the variable is NULL or an invalid reference when the BPI call attempts to execute after the delay.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Debug the target reference used by BP_PowerRelay to send BPI_GrantAccess (the variable `TargetVault`). Confirm the variable is NULL or an invalid reference when the BPI call attempts to execute after the delay.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.3hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Deleting and recreating the Timer node in BP_VaultDoor, assuming the timer handle is corrupt, without investigating the logical failure branch.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "blueprintslogic",
            "title": "Step 11",
            "prompt": "<p>Trace back the initialization of `TargetVault` in BP_PowerRelay. Confirm it relies on an unreliable `Get All Actors of Class (BP_VaultDoor)` node executed during `BeginPlay`.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Trace back the initialization of `TargetVault` in BP_PowerRelay. Confirm it relies on an unreliable `Get All Actors of Class (BP_VaultDoor)` node executed during `BeginPlay`.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Trying to fix the race condition by changing the door's opening function to use an Event Tick or looping function instead of a single Timer execution.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +1hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "blueprintslogic",
            "title": "Step 12",
            "prompt": "<p>Identify the second root cause: The reference must be explicitly passed at runtime, not cached using an unreliable method.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Identify the second root cause: The reference must be explicitly passed at runtime, not cached using an unreliable method.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Focusing only on the 8.0s vs 10.0s timing mismatch and failing to diagnose the underlying null reference causing the Interface message failure.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +1.5hrs. This approach wastes time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "blueprintslogic",
            "title": "Step 13",
            "prompt": "<p>Modify the ED_SequenceStart Event Dispatcher in BP_SecuritySystem to include a new input parameter: an Object Reference of type BP_VaultDoor.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Modify the ED_SequenceStart Event Dispatcher in BP_SecuritySystem to include a new input parameter: an Object Reference of type BP_VaultDoor.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Adjusting the animation playback speed or blend settings within the BP_VaultDoor's timeline, assuming the animation is hanging up physically.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.75hrs. This approach wastes time.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "blueprintslogic",
            "title": "Step 14",
            "prompt": "<p>In BP_SecuritySystem, update the ED_SequenceStart call site, feeding the explicit reference of the Target Vault Door (obtained via a reliable Get Actor Of Class or stored variable) into the new input pin.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In BP_SecuritySystem, update the ED_SequenceStart call site, feeding the explicit reference of the Target Vault Door (obtained via a reliable Get Actor Of Class or stored variable) into the new input pin.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Deleting and recreating the Timer node in BP_VaultDoor, assuming the timer handle is corrupt, without investigating the logical failure branch.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "blueprintslogic",
            "title": "Step 15",
            "prompt": "<p>In BP_PowerRelay's binding node for ED_SequenceStart, receive the BP_VaultDoor reference from the execution payload.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In BP_PowerRelay's binding node for ED_SequenceStart, receive the BP_VaultDoor reference from the execution payload.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Trying to fix the race condition by changing the door's opening function to use an Event Tick or looping function instead of a single Timer execution.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +1hrs. This approach wastes time.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "blueprintslogic",
            "title": "Step 16",
            "prompt": "<p>Update BP_PowerRelay's logic: Replace the usage of the unreliable `TargetVault` variable with the newly received reference pin when calling BPI_GrantAccess.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Update BP_PowerRelay's logic: Replace the usage of the unreliable `TargetVault` variable with the newly received reference pin when calling BPI_GrantAccess.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Focusing only on the 8.0s vs 10.0s timing mismatch and failing to diagnose the underlying null reference causing the Interface message failure.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +1.5hrs. This approach wastes time.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "blueprintslogic",
            "title": "Step 17",
            "prompt": "<p>Change the Delay node in BP_PowerRelay to a reliable time that visually leads the opening (e.g., 5.0 seconds).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Change the Delay node in BP_PowerRelay to a reliable time that visually leads the opening (e.g., 5.0 seconds).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Adjusting the animation playback speed or blend settings within the BP_VaultDoor's timeline, assuming the animation is hanging up physically.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.75hrs. This approach wastes time.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "blueprintslogic",
            "title": "Step 18",
            "prompt": "<p>Final Test: Run the system to confirm that the explicit reference ensures reliable communication, and the fixed timing ensures authorization is granted before the door attempts to open.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Final Test: Run the system to confirm that the explicit reference ensures reliable communication, and the fixed timing ensures authorization is granted before the door attempts to open.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Deleting and recreating the Timer node in BP_VaultDoor, assuming the timer handle is corrupt, without investigating the logical failure branch.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-18"
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
