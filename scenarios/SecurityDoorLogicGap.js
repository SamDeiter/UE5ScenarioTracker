window.SCENARIOS['SecurityDoorLogicGap'] = {
    "meta": {
        "title": "Security Door Fails to Open After Keycard Collection and Activation",
        "description": "The player character has collected three unique keycards (Card A, B, and C) which are correctly displayed in the HUD inventory. When the player stands on the designated activation pad, the associated Security Door (BP_SecurityDoor) remains locked and stationary. No error messages appear in the output log, but the door fails to execute its opening timeline, even though the necessary conditions *appear* to be met.",
        "estimateHours": 1.5,
        "category": "Blueprints & Logic"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "blueprintslogic",
            "title": "Step 1",
            "prompt": "<p>Verify the basic interaction: Open BP_ActivationPad and confirm that the 'On Component Begin Overlap' event is firing and successfully casting to BP_Player and then calling the 'AttemptOpen' function on the target BP_SecurityDoor instance.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify the basic interaction: Open BP_ActivationPad and confirm that the 'On Component Begin Overlap' event is firing and successfully casting to BP_Player and then calling the 'AttemptOpen' function on the target BP_SecurityDoor instance.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Checking the collision profiles of the keycards or the door to see if 'Generate Overlap Events' is disabled, assuming the collection detection itself is the failure point.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "blueprintslogic",
            "title": "Step 2",
            "prompt": "<p>Open BP_SecurityDoor and navigate to the 'AttemptOpen' function. Inspect the conditional logic (a large 'Branch' node) that precedes the 'PlayDoorMovement' execution.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open BP_SecurityDoor and navigate to the 'AttemptOpen' function. Inspect the conditional logic (a large 'Branch' node) that precedes the 'PlayDoorMovement' execution.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Adding print strings or breaking execution points only in BP_ActivationPad and concluding that the overlap logic is faulty because the door function is being called, but ignoring the failure *inside* the door logic.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "blueprintslogic",
            "title": "Step 3",
            "prompt": "<p>Identify that the 'AttemptOpen' function relies on three local Boolean variables (bHasCardA, bHasCardB, bHasCardC) chained through an 'AND' node, and these variables are not being set anywhere within this Blueprint.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Identify that the 'AttemptOpen' function relies on three local Boolean variables (bHasCardA, bHasCardB, bHasCardC) chained through an 'AND' node, and these variables are not being set anywhere within this Blueprint.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Attempting to cast to the BP_SecurityDoor from within the BP_ActivationPad using 'Get All Actors of Class' on every overlap event, instead of relying on a pre-set reference.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "blueprintslogic",
            "title": "Step 4",
            "prompt": "<p>Determine the source of the required data: Open BP_Player and examine the KeyCard collection logic (the 'CollectItem' interface call). Confirm that the player successfully tracks the card acquisition internally.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Determine the source of the required data: Open BP_Player and examine the KeyCard collection logic (the 'CollectItem' interface call). Confirm that the player successfully tracks the card acquisition internally.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Debugging the timeline itself (e.g., keyframes, curves) before verifying that the 'Play' node on the timeline is actually being reached by the execution flow.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "blueprintslogic",
            "title": "Step 5",
            "prompt": "<p>Identify that BP_Player must communicate the collected card state to the specific BP_SecurityDoor instance. Expose a public variable on BP_Player of type BP_SecurityDoor (named 'TargetDoorReference') and set its default value to the door instance in the level viewport.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Identify that BP_Player must communicate the collected card state to the specific BP_SecurityDoor instance. Expose a public variable on BP_Player of type BP_SecurityDoor (named 'TargetDoorReference') and set its default value to the door instance in the level viewport.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Checking the collision profiles of the keycards or the door to see if 'Generate Overlap Events' is disabled, assuming the collection detection itself is the failure point.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "blueprintslogic",
            "title": "Step 6",
            "prompt": "<p>Create a new Custom Event or Function in BP_SecurityDoor called 'UpdateCardStatus' that accepts a single input parameter (e.g., an Enum defining Card Type A, B, or C).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Create a new Custom Event or Function in BP_SecurityDoor called 'UpdateCardStatus' that accepts a single input parameter (e.g., an Enum defining Card Type A, B, or C).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Adding print strings or breaking execution points only in BP_ActivationPad and concluding that the overlap logic is faulty because the door function is being called, but ignoring the failure *inside* the door logic.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "blueprintslogic",
            "title": "Step 7",
            "prompt": "<p>Implement a 'Select' or 'Switch on Enum' node inside 'UpdateCardStatus' that sets the corresponding internal Boolean variable (bHasCardA, bHasCardB, or bHasCardC) to True based on the received Card Type.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Implement a 'Select' or 'Switch on Enum' node inside 'UpdateCardStatus' that sets the corresponding internal Boolean variable (bHasCardA, bHasCardB, or bHasCardC) to True based on the received Card Type.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Attempting to cast to the BP_SecurityDoor from within the BP_ActivationPad using 'Get All Actors of Class' on every overlap event, instead of relying on a pre-set reference.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "blueprintslogic",
            "title": "Step 8",
            "prompt": "<p>Return to BP_Player's card collection logic. Immediately after the successful card collection event, drag off the 'TargetDoorReference' variable and call the new 'UpdateCardStatus' function, passing the collected Card Type Enum as the input.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Return to BP_Player's card collection logic. Immediately after the successful card collection event, drag off the 'TargetDoorReference' variable and call the new 'UpdateCardStatus' function, passing the collected Card Type Enum as the input.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Debugging the timeline itself (e.g., keyframes, curves) before verifying that the 'Play' node on the timeline is actually being reached by the execution flow.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "blueprintslogic",
            "title": "Step 9",
            "prompt": "<p>Re-test the game (Collect cards, stand on pad). Observe that the logical precondition is now met, but the door still fails to move, indicating a flow issue *after* the successful condition check.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Re-test the game (Collect cards, stand on pad). Observe that the logical precondition is now met, but the door still fails to move, indicating a flow issue *after* the successful condition check.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Checking the collision profiles of the keycards or the door to see if 'Generate Overlap Events' is disabled, assuming the collection detection itself is the failure point.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "blueprintslogic",
            "title": "Step 10",
            "prompt": "<p>Return to BP_SecurityDoor and examine the 'PlayDoorMovement' function which is called when the keycard check passes.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Return to BP_SecurityDoor and examine the 'PlayDoorMovement' function which is called when the keycard check passes.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Adding print strings or breaking execution points only in BP_ActivationPad and concluding that the overlap logic is faulty because the door function is being called, but ignoring the failure *inside* the door logic.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "blueprintslogic",
            "title": "Step 11",
            "prompt": "<p>Locate a final 'Branch' node inside 'PlayDoorMovement' that checks a local Boolean variable, 'bDoorIsMoving', which is intended to prevent re-triggering the animation, but is incorrectly defaulting to True (or being checked without ever being set False).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate a final 'Branch' node inside 'PlayDoorMovement' that checks a local Boolean variable, 'bDoorIsMoving', which is intended to prevent re-triggering the animation, but is incorrectly defaulting to True (or being checked without ever being set False).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Attempting to cast to the BP_SecurityDoor from within the BP_ActivationPad using 'Get All Actors of Class' on every overlap event, instead of relying on a pre-set reference.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "blueprintslogic",
            "title": "Step 12",
            "prompt": "<p>Add a 'Set bDoorIsMoving' node immediately before the 'Play' input of the timeline, setting it to True, and ensure the 'Branch' logic is correctly checking if the door is *already* moving (i.e., 'Not bDoorIsMoving'). Alternatively, remove the unnecessary initial check preventing the timeline from starting if the state machine logic handles closing separately.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Add a 'Set bDoorIsMoving' node immediately before the 'Play' input of the timeline, setting it to True, and ensure the 'Branch' logic is correctly checking if the door is *already* moving (i.e., 'Not bDoorIsMoving'). Alternatively, remove the unnecessary initial check preventing the timeline from starting if the state machine logic handles closing separately.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Debugging the timeline itself (e.g., keyframes, curves) before verifying that the 'Play' node on the timeline is actually being reached by the execution flow.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
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
