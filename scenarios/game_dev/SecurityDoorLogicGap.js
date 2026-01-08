window.SCENARIOS['SecurityDoorLogicGap'] = {
    "meta": {
        "title": "Security Door Fails to Open After Keycard Collection and Activation",
        "description": "The player character has collected three unique keycards (Card A, B, and C) which are correctly displayed in the HUD inventory. When the player stands on the designated activation pad, the associated Security Door (BP_SecurityDoor) remains locked and stationary. No error messages appear in the output log, but the door fails to execute its opening timeline, even though the necessary conditions appear to be met.",
        "estimateHours": 1.5,
        "category": "Blueprints & Logic",
        "tokens_used": 9109
    },
    "setup": [
        {
            "action": "set_ue_property",
            "scenario": "SecurityDoorLogicGap",
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
            "scenario": "SecurityDoorLogicGap",
            "step": "final"
        }
    ],
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "blueprintslogic",
            "title": "Verify Pad Overlap",
            "prompt": "<p>Player stands on the <strong>Activation Pad</strong>, but the <strong>Security Door</strong> remains closed. No errors appear in the <strong>Output Log</strong>. How do you investigate the pad's interaction?</p>",
            "choices": [
                {
                    "text": "<p>Open <strong>BP_ActivationPad</strong> and confirm the <strong>On Component Begin Overlap</strong> event is firing.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. It's crucial to confirm the initial interaction trigger. Using <code>Print String</code> or breakpoints here is an effective first step.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Check the <strong>Static Mesh</strong> of the keycards for their <strong>Collision Presets</strong>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.25hrs. The keycards are for collection, not directly involved in the pad-door interaction. This is irrelevant at this stage.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>In <strong>BP_ActivationPad</strong>, ensure <strong>Generate Overlap Events</strong> is enabled on the pad's collision component.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While important, the prompt implies the <em>event</em> might not be firing <em>after</em> successful overlap, not that overlap itself is failing at a fundamental collision level. A more direct check of the event flow is needed first.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Add a <code>Print String</code> node in <strong>BP_SecurityDoor</strong>'s <code>AttemptOpen</code> function to see if it's called.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.3hrs. This assumes the pad is successfully calling the door. You need to verify the pad's own event first to isolate the issue.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "blueprintslogic",
            "title": "Inspect Door Conditional Logic",
            "prompt": "<p>The <strong>On Component Begin Overlap</strong> event in <strong>BP_ActivationPad</strong> fires and successfully calls <code>AttemptOpen</code> on <strong>BP_SecurityDoor</strong>. The door still doesn't open. What's your next move?</p>",
            "choices": [
                {
                    "text": "<p>Open <strong>BP_SecurityDoor</strong> and examine the <code>AttemptOpen</code> function for conditional logic.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Since the function is called, the next logical step is to see what prevents it from proceeding inside the door's own logic.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Use <code>stat fps</code> in the console to check for performance bottlenecks.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Performance checks are irrelevant when the core functionality isn't executing at all.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Check the <strong>Collision Presets</strong> of the <strong>BP_SecurityDoor</strong> to ensure it's not blocking movement.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.25hrs. The door isn't moving at all, so collision isn't the primary issue. This is a premature check related to the door's physical properties before verifying its internal logic.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>In <strong>BP_SecurityDoor</strong>, directly call the <strong>Timeline Play</strong> node in <code>AttemptOpen</code> to bypass logic.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. Bypassing logic is not a debugging step; it masks the real problem rather than identifying it.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "blueprintslogic",
            "title": "Identify Unset Variables",
            "prompt": "<p>Inside <code>AttemptOpen</code>, a <strong>Branch</strong> node relies on three <strong>Boolean</strong> variables (<code>bHasCardA</code>, <code>bHasCardB</code>, <code>bHasCardC</code>) which are always <code>False</code>. How do you investigate their source?</p>",
            "choices": [
                {
                    "text": "<p>Determine where these <strong>Boolean</strong> variables are intended to be set and the source of this data.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. The immediate issue is that the conditions are false. You need to find out why and where they <em>should</em> be true.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Create new <strong>Boolean</strong> variables directly in <strong>BP_SecurityDoor</strong> and set them to <code>True</code> by default.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Hardcoding values bypasses the game's logic entirely and doesn't solve the communication problem.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Add <code>Print String</code> nodes after each <strong>AND</strong> gate input in <code>AttemptOpen</code> to confirm the values.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. You already know the values are false. Printing them again doesn't tell you <em>why</em> they are false or where they <em>should</em> be set.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Search all <strong>Blueprints</strong> for references to <code>bHasCardA</code> to see if any other <strong>Blueprint</strong> sets it.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While technically a path, the scenario implies player collects cards. A targeted approach based on game flow (player collecting cards) is more efficient than a broad search.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "blueprintslogic",
            "title": "Determine Player Data Source",
            "prompt": "<p>The <strong>BP_Player</strong> handles keycard collection and successfully tracks card acquisition internally. However, <strong>BP_SecurityDoor</strong> is not receiving this information. What is the fundamental communication issue?</p>",
            "choices": [
                {
                    "text": "<p>Identify that <strong>BP_Player</strong> must communicate the collected card state to the specific <strong>BP_SecurityDoor</strong> instance.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. The player knows about the cards, the door needs to know. A communication channel is missing.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Move the card collection logic directly into the <strong>BP_SecurityDoor</strong>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.2hrs. This breaks encapsulation. Card collection is a player responsibility, not the door's.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Add an <code>Event Dispatcher</code> to <strong>BP_Player</strong> for card collection and bind it in <strong>BP_SecurityDoor</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While possible, a more direct reference and function call is often simpler for a single, specific interaction, and avoids potential binding issues if not set up correctly.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>In <strong>BP_Player</strong>, use <code>Get All Actors Of Class (BP_SecurityDoor)</code> on every card collection to update its status.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While it would get a reference, <code>Get All Actors Of Class</code> is an expensive operation and should not be used repeatedly or on sensitive events like collection.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "blueprintslogic",
            "title": "Expose Target Door Reference",
            "prompt": "<p><strong>BP_Player</strong> needs a direct, reliable reference to the specific <strong>BP_SecurityDoor</strong> instance in the level. How do you establish this connection efficiently?</p>",
            "choices": [
                {
                    "text": "<p>Expose a public variable on <strong>BP_Player</strong> of type <strong>BP_SecurityDoor</strong> (e.g., <code>TargetDoorReference</code>) and set it in the <strong>Level Editor</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. A direct, public reference set in the editor is the most robust and performant way for a specific actor to interact with another known actor.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Remove the <code>AttemptOpen</code> function from <strong>BP_SecurityDoor</strong> and put the logic directly in <strong>BP_Player</strong>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.25hrs. This destroys the door's autonomy and violates good programming practices by making the player solely responsible for door behavior.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>In <strong>BP_Player</strong>, use a <code>Line Trace by Channel</code> from the player to hit the door and get a reference.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.2hrs. This is overly complex and fragile for a static, known target. A direct reference is far more reliable and efficient.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Create a <strong>Blueprint Interface</strong> for <strong>BP_SecurityDoor</strong> to pass card data to, then implement it on <strong>BP_Player</strong>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. This is backwards. The door needs to <em>receive</em> information <em>from</em> the player; the player would implement an interface <em>to provide</em> information, or the door would implement one <em>to receive</em> it. For a single door, a direct reference is simpler.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "blueprintslogic",
            "title": "Create UpdateCardStatus Function",
            "prompt": "<p><strong>BP_Player</strong> now has a reference to the door. The <strong>BP_SecurityDoor</strong> needs a dedicated way to receive updates about which specific keycard has been collected. How do you enable this?</p>",
            "choices": [
                {
                    "text": "<p>Create a new <strong>Custom Event</strong> or <strong>Function</strong> in <strong>BP_SecurityDoor</strong> (e.g., <code>UpdateCardStatus</code>) that accepts a <strong>Card Type Enum</strong> as input.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. A dedicated function/event is the proper way for other Blueprints to send specific instructions to the door.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Directly access and set the <code>bHasCardA</code>, <code>bHasCardB</code>, <code>bHasCardC</code> variables from <strong>BP_Player</strong>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While technically possible if the variables are public, it's poor encapsulation. The door should manage its own internal state via its own functions.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>In <strong>BP_SecurityDoor</strong>, create a new <code>Event Dispatcher</code> that <strong>BP_Player</strong> can call.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. Incorrect usage. The door needs to <em>receive</em> an event/function call, not <em>dispatch</em> one for the player to call it.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Create three separate functions in <strong>BP_SecurityDoor</strong>: <code>SetCardA</code>, <code>SetCardB</code>, <code>SetCardC</code>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. This would work, but using a single function with an <strong>Enum</strong> input is more scalable and cleaner, especially if more card types are added later.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "blueprintslogic",
            "title": "Implement Switch on Enum",
            "prompt": "<p>The <code>UpdateCardStatus</code> in <strong>BP_SecurityDoor</strong> needs to update the correct internal <strong>Boolean</strong> (<code>bHasCardA</code>, <code>bHasCardB</code>, or <code>bHasCardC</code>) based on the received <strong>Card Type Enum</strong> input. How do you implement this logic efficiently?</p>",
            "choices": [
                {
                    "text": "<p>Implement a <strong>Select</strong> or <strong>Switch on Enum</strong> node inside <code>UpdateCardStatus</code> to set the corresponding <strong>Boolean</strong> variable to <code>True</code>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. A <strong>Switch on Enum</strong> node is the ideal way to handle multiple distinct actions based on an Enum input, providing clear and concise logic.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Create three separate <strong>Branch</strong> nodes in <code>UpdateCardStatus</code>, checking the <strong>Enum</strong> input against each card type.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While functional, <strong>Branch</strong> nodes are less elegant and more cumbersome than a <strong>Switch on Enum</strong> for multiple discrete values.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Use <code>Print String</code> nodes in <code>UpdateCardStatus</code> to confirm the <strong>Enum</strong> value is being received correctly.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. This is a verification step, not the implementation of the logic to set the booleans. You need to build the core logic first.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Add a <strong>Sequence</strong> node to set all three <strong>Boolean</strong> variables to <code>True</code> whenever <code>UpdateCardStatus</code> is called.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.2hrs. This is incorrect logic. It would set all cards to <code>True</code> after collecting only one, breaking the prerequisite system.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "blueprintslogic",
            "title": "Call UpdateCardStatus from Player",
            "prompt": "<p>The <strong>BP_SecurityDoor</strong> can now receive card updates. You need to ensure <strong>BP_Player</strong> sends these updates immediately after a successful card collection. Which action do you take?</p>",
            "choices": [
                {
                    "text": "<p>Return to <strong>BP_Player</strong>'s card collection logic and, after successful collection, call the door's <code>UpdateCardStatus</code>, passing the collected <strong>Card Type Enum</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.2hrs. This correctly links the player's collection event to the door's update mechanism, completing the communication chain.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Add a <code>Delay</code> node before calling <code>UpdateCardStatus</code> in <strong>BP_Player</strong> to ensure the door is ready.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. An unnecessary delay introduces latency and is not required for a direct function call once the reference is valid.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>In <strong>BP_Player</strong>, broadcast an <code>Event Dispatcher</code> after collecting a card, then bind it in <strong>BP_SecurityDoor</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While a valid communication method, using the existing <code>TargetDoorReference</code> and a direct function call is more straightforward for a specific, known interaction.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Call <code>UpdateCardStatus</code> on the door from <strong>BP_ActivationPad</strong>'s overlap event after checking player cards.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.25hrs. This is the wrong place. Card status should be updated <em>when the card is collected</em>, not when the player stands on the pad. The pad's role is to <em>attempt</em> opening based on current status.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "blueprintslogic",
            "title": "Re-test and Observe",
            "prompt": "<p>You've implemented the card collection and status update logic. Now, re-test the game by collecting all cards and standing on the <strong>Activation Pad</strong>. What do you observe?</p>",
            "choices": [
                {
                    "text": "<p>The logical precondition is met (card booleans are true), but the door still fails to move, indicating a flow issue <em>after</em> the successful condition check.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. It's crucial to re-test after implementing a fix to verify the expected outcome and identify any new or remaining issues.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>The door now opens perfectly, problem solved.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.5hrs. Premature conclusion. The scenario explicitly states there's a <em>second</em> issue after the card logic is fixed.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>The game crashes immediately upon collecting the first card.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Unlikely given the previous debugging steps. A crash would have appeared earlier if the communication setup was fundamentally flawed.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>The door partially opens and then closes immediately.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While possible, the scenario indicates a complete failure to <em>execute</em> the opening timeline, not an aborted or reversed one.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "blueprintslogic",
            "title": "Examine PlayDoorMovement",
            "prompt": "<p>The <strong>Branch</strong> node for card requirements in <strong>BP_SecurityDoor</strong>'s <code>AttemptOpen</code> now evaluates to <code>True</code>, but the door remains stationary. How should you proceed?</p>",
            "choices": [
                {
                    "text": "<p>Return to <strong>BP_SecurityDoor</strong> and examine the <code>PlayDoorMovement</code> function/event, which is called when the keycard check passes.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. The card logic is resolved, so the issue must lie in the subsequent execution flow leading to the door's movement.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Delete the <code>AttemptOpen</code> function and put the entire door logic directly on the <strong>Event Tick</strong>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.25hrs. This is a drastic, inefficient, and incorrect solution that ignores event-driven programming.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>In <strong>BP_SecurityDoor</strong>, add a <code>Print String</code> node right after the successful card check <strong>Branch</strong> to confirm execution reaches this point.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While good for confirmation, the prompt already implies it reaches this point (the <code>AttemptOpen</code> function is called, and the branch is now true). You need to investigate the function that <em>should</em> be causing movement.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Check the <strong>Timeline</strong> within <strong>BP_SecurityDoor</strong> to ensure its duration and keyframes are correct.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.2hrs. Debugging the <strong>Timeline</strong> itself is premature. First, verify that the <strong>Timeline</strong>'s <code>Play</code> node is actually being reached by the execution flow.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "blueprintslogic",
            "title": "Locate bDoorIsMoving Branch",
            "prompt": "<p>Inside <strong>BP_SecurityDoor</strong>'s <code>PlayDoorMovement</code>, you observe a <strong>Branch</strong> node immediately preceding the <strong>Timeline Play</strong> node. It checks a <strong>Boolean</strong> variable, <code>bDoorIsMoving</code>, which is currently preventing the timeline from starting. What action do you take?</p>",
            "choices": [
                {
                    "text": "<p>Locate the <strong>Branch</strong> node checking <code>bDoorIsMoving</code> and identify its default value or how it's being set elsewhere.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. Understanding the state of this variable is key to fixing the execution flow blocking the <strong>Timeline</strong>.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Delete the <strong>Branch</strong> node that checks <code>bDoorIsMoving</code> to force the timeline to play.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.25hrs. Removing crucial logic intended to prevent re-triggering would cause new issues, like the door trying to open indefinitely.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Add a <code>Print String</code> showing the value of <code>bDoorIsMoving</code> right before the <strong>Branch</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While helpful for confirmation, the prompt already indicates it's blocking. You need to investigate <em>why</em> it's blocking and how to correct its state/logic, not just confirm its current value.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>In <code>PlayDoorMovement</code>, connect the execution directly to the <strong>Timeline Play</strong> node, bypassing the <code>bDoorIsMoving</code> check.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. Similar to deleting the node, this circumvents the intended logic and doesn't address the underlying state management issue.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "blueprintslogic",
            "title": "Fix bDoorIsMoving Logic",
            "prompt": "<p>The <code>bDoorIsMoving</code> variable is incorrectly preventing the <strong>Timeline</strong> from playing in <strong>BP_SecurityDoor</strong>'s <code>PlayDoorMovement</code>. It appears to be defaulting to <code>True</code>, or the <strong>Branch</strong> logic is inverted. How do you correctly fix this?</p>",
            "choices": [
                {
                    "text": "<p>Add a <code>Set bDoorIsMoving</code> node immediately before the <strong>Timeline Play</strong> input, setting it to <code>True</code>, and ensure the <strong>Branch</strong> logic is correctly checking <code>!bDoorIsMoving</code> (Is Not Moving).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. The <code>bDoorIsMoving</code> variable should be <code>False</code> initially, set to <code>True</code> when movement starts, and <code>False</code> again when movement finishes (e.g., on <strong>Timeline Finished</strong>). The <strong>Branch</strong> should only proceed if <code>bDoorIsMoving</code> is <code>False</code>.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Set <code>bDoorIsMoving</code> to <code>False</code> permanently in the <strong>Details Panel</strong>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.2hrs. This would allow the door to be re-triggered constantly, even while already in motion, which is not the intended behavior.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Remove the <code>bDoorIsMoving</code> variable entirely, as it's causing issues.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.25hrs. This variable serves a purpose (preventing re-triggering). Removing it would lead to unintended behavior, such as timelines overlapping or getting stuck.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Add a <code>Set bDoorIsMoving</code> node immediately <em>after</em> the <strong>Timeline Play</strong>, setting it to <code>True</code>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. This is too late. The <strong>Branch</strong> checks the variable <em>before</em> the <strong>Timeline Play</strong>. If <code>bDoorIsMoving</code> is <code>True</code> when it shouldn't be, moving the <code>Set</code> node will not fix the initial blocking condition.</p>",
                    "next": "step-12"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario.</p>",
            "choices": [{"text": "Complete Scenario", "type": "correct", "feedback": "", "next": "end"}]
        }
    }
};
