
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['SecurityDoorLogicGap'] = {
    meta: {
        title: "Security Door Fails to Open After Keycard Collection and Activation",
        description: "The player character has collected three unique keycards (Card A, B, and C) which are correctly displayed in the HUD inventory. When the player stands on the designated activation pad, the associated Security Door (BP_SecurityDoor) remains locked and stationary. No error messages appear in the output log, but the door fails to execute its opening timeline, even though the necessary conditions *appear* to be met.",
        difficulty: "medium",
        category: "Blueprints & Logic",
        estimate: 1.5
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "The player character has collected three unique keycards (Card A, B, and C) which are correctly displayed in the HUD inventory. When the player stands on the designated activation pad, the associated Security Door (BP_SecurityDoor) remains locked and stationary. No error messages appear in the output log, but the door fails to execute its opening timeline, even though the necessary conditions *appear* to be met.",
        "choices": [
            {
                "text": "Determine the source of the required data: Open BP_Player and examine the KeyCard collection logic (the 'CollectItem' interface call). Confirm that the player successfully tracks the card acquisition internally.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Re-test the game (Collect cards, stand on pad). Observe that the logical precondition is now met, but the door still fails to move, indicating a flow issue *after* the successful condition check.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Checking the collision profiles of the keycards or the door to see if 'Generate Overlap Events' is disabled, assuming the collection detection itself is the failure point.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.25
            },
            {
                "text": "Adding print strings or breaking execution points only in BP_ActivationPad and concluding that the overlap logic is faulty because the door function is being called, but ignoring the failure *inside* the door logic.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.3
            },
            {
                "text": "Create a new Custom Event or Function in BP_SecurityDoor called 'UpdateCardStatus' that accepts a single input parameter (e.g., an Enum defining Card Type A, B, or C).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Open BP_SecurityDoor and navigate to the 'AttemptOpen' function. Inspect the conditional logic (a large 'Branch' node) that precedes the 'PlayDoorMovement' execution.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Identify that the 'AttemptOpen' function relies on three local Boolean variables (bHasCardA, bHasCardB, bHasCardC) chained through an 'AND' node, and these variables are not being set anywhere within this Blueprint.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Locate a final 'Branch' node inside 'PlayDoorMovement' that checks a local Boolean variable, 'bDoorIsMoving', which is intended to prevent re-triggering the animation, but is incorrectly defaulting to True (or being checked without ever being set False).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Return to BP_Player's card collection logic. Immediately after the successful card collection event, drag off the 'TargetDoorReference' variable and call the new 'UpdateCardStatus' function, passing the collected Card Type Enum as the input.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Debugging the timeline itself (e.g., keyframes, curves) before verifying that the 'Play' node on the timeline is actually being reached by the execution flow.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.2
            },
            {
                "text": "Add a 'Set bDoorIsMoving' node immediately before the 'Play' input of the timeline, setting it to True, and ensure the 'Branch' logic is correctly checking if the door is *already* moving (i.e., 'Not bDoorIsMoving'). Alternatively, remove the unnecessary initial check preventing the timeline from starting if the state machine logic handles closing separately.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Verify the basic interaction: Open BP_ActivationPad and confirm that the 'On Component Begin Overlap' event is firing and successfully casting to BP_Player and then calling the 'AttemptOpen' function on the target BP_SecurityDoor instance.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Implement a 'Select' or 'Switch on Enum' node inside 'UpdateCardStatus' that sets the corresponding internal Boolean variable (bHasCardA, bHasCardB, or bHasCardC) to True based on the received Card Type.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Return to BP_SecurityDoor and examine the 'PlayDoorMovement' function which is called when the keycard check passes.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Identify that BP_Player must communicate the collected card state to the specific BP_SecurityDoor instance. Expose a public variable on BP_Player of type BP_SecurityDoor (named 'TargetDoorReference') and set its default value to the door instance in the level viewport.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Attempting to cast to the BP_SecurityDoor from within the BP_ActivationPad using 'Get All Actors of Class' on every overlap event, instead of relying on a pre-set reference.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.15
            }
        ]
    }
}
};
