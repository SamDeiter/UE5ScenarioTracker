window.SCENARIOS['DestroyActorStopsExecutionFlow'] = {
    "meta": {
        "title": "Pickup Despawns Prematurely, Preventing Buff Application",
        "description": "A PowerUp pickup (BP_SpeedBoost) is designed to grant the player a temporary speed increase upon overlap and then destroy itself. When testing, the player overlaps the item, and the item immediately vanishes. However, the player's movement speed never changes. Debugging shows the initial 'On Component Begin Overlap' event fires successfully, and the character reference is valid right before the logic path splits, but the 'Set Max Walk Speed' node is never reached or executed.",
        "estimateHours": 0.75,
        "category": "Blueprints & Logic",
        "tokens_used": 11436
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "blueprintslogic",
            "title": "Step 1: Investigate Blueprint",
            "prompt": "The BP_SpeedBoost item despawns on overlap, but the speed buff isn't applied. 'On Component Begin Overlap' fires, and the character reference is valid. 'Set Max Walk Speed' isn't reached. What's the first step to investigate?",
            "choices": [
                {
                    "text": "Enter the BP_SpeedBoost Blueprint and navigate to the Event Graph, focusing on the 'On Component Begin Overlap' node logic.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.03hrs. Starting directly at the relevant event in the pickup's blueprint is the most efficient initial approach.",
                    "next": "step-2"
                },
                {
                    "text": "Check the Character Blueprint's 'Max Walk Speed' default value, believing the buff isn't high enough.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.15hrs. The problem states the 'Set Max Walk Speed' node is *never reached*, so adjusting the target value won't solve the execution issue.",
                    "next": "step-1"
                },
                {
                    "text": "Add excessive 'Print String' nodes throughout the Character Blueprint to track speed changes.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. While 'Print String' can be useful, the current issue is specific to the *pickup* blueprint and its execution flow, not necessarily the character's state.",
                    "next": "step-1"
                },
                {
                    "text": "Immediately replace the 'On Component Begin Overlap' with an 'Event Tick' node to ensure constant execution.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.08hrs. This would drastically change the intended behavior, leading to continuous buff application, and bypass the overlap event entirely, masking the original problem.",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "blueprintslogic",
            "title": "Step 2: Trace Execution Flow",
            "prompt": "Inside the BP_SpeedBoost Event Graph, with the 'On Component Begin Overlap' node visible, what's your next move to pinpoint why 'Set Max Walk Speed' isn't executing?",
            "choices": [
                {
                    "text": "Trace the execution flow starting from the successful 'Cast To Player Character' node, observing where its output pin leads.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. The problem description confirms the cast is successful, so tracing from there is the logical next step to see where execution goes next.",
                    "next": "step-3"
                },
                {
                    "text": "Verify the 'Collision Presets' of the pickup's mesh to ensure it's set to 'OverlapAll'.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. The problem explicitly states 'On Component Begin Overlap' fires successfully, indicating collision settings are likely correct.",
                    "next": "step-2"
                },
                {
                    "text": "Examine the 'Event BeginPlay' node in BP_SpeedBoost to see if any initial setup is interfering.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.04hrs. The issue occurs on overlap, not at the start of the game, so 'Event BeginPlay' is unlikely to be the direct cause.",
                    "next": "step-2"
                },
                {
                    "text": "Add a 'Print String' immediately after 'Set Max Walk Speed' to confirm if it fires.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.06hrs. The problem states 'Set Max Walk Speed' is never reached, so adding a print string *after* it won't yield new information about *why* it's not reached.",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "blueprintslogic",
            "title": "Step 3: Identify Node After Cast",
            "prompt": "Following the execution pin from 'Cast To Player Character' (which is successful), what type of node do you observe it immediately connects to?",
            "choices": [
                {
                    "text": "Identify that the execution pin immediately connects to a 'Sequence' node.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.03hrs. Recognizing the 'Sequence' node is key to understanding the potential for split and ordered execution paths.",
                    "next": "step-4"
                },
                {
                    "text": "Identify that it connects to a 'Branch' node checking a boolean condition.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.03hrs. A 'Branch' node would have a condition, which isn't described in the initial problem or visible in the flow you're tracing.",
                    "next": "step-3"
                },
                {
                    "text": "Identify that it connects directly to the 'Set Max Walk Speed' node.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.04hrs. If it connected directly, the 'Set Max Walk Speed' node should be firing, which contradicts the problem description.",
                    "next": "step-3"
                },
                {
                    "text": "Identify that it connects to a 'For Each Loop' node.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. A 'For Each Loop' would imply iterating over an array, which is not relevant to handling a single player character reference here.",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "blueprintslogic",
            "title": "Step 4: Trace Sequence Pin 0",
            "prompt": "You've identified a 'Sequence' node immediately after the successful 'Cast To Player Character'. What is connected to 'Sequence Pin 0'?",
            "choices": [
                {
                    "text": "Observe that 'Sequence Pin 0' connects directly to the 'Destroy Actor' node.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. This is a critical observation, as the 'Destroy Actor' node is directly linked to the premature despawn.",
                    "next": "step-5"
                },
                {
                    "text": "Observe that 'Sequence Pin 0' connects to the 'Set Max Walk Speed' node.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.04hrs. If this were the case, the buff should be applied. Re-examine the connections in your Blueprint.",
                    "next": "step-4"
                },
                {
                    "text": "Observe that 'Sequence Pin 0' connects to a 'Delay' node.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.05hrs. A 'Delay' node wouldn't explain the immediate despawn unless it's set to 0 seconds, which is unlikely for a buff duration.",
                    "next": "step-4"
                },
                {
                    "text": "Observe that 'Sequence Pin 0' is not connected to anything.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.03hrs. If it were unconnected, the 'Destroy Actor' node would need to be connected elsewhere or wouldn't fire, contradicting the despawn symptom.",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "blueprintslogic",
            "title": "Step 5: Trace Sequence Pin 1",
            "prompt": "Knowing 'Sequence Pin 0' leads to 'Destroy Actor', where does 'Sequence Pin 1' of the 'Sequence' node lead?",
            "choices": [
                {
                    "text": "Observe that 'Sequence Pin 1' connects to the remainder of the logic, including 'Set Max Walk Speed' and any subsequent flow.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.04hrs. This confirms the intended buff logic is indeed on the second path of the sequence.",
                    "next": "step-6"
                },
                {
                    "text": "Observe that 'Sequence Pin 1' is also connected to 'Destroy Actor'.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.03hrs. If both pins led to 'Destroy Actor', there would be no path for the buff logic at all. Re-examine the Blueprint's connections.",
                    "next": "step-5"
                },
                {
                    "text": "Observe that 'Sequence Pin 1' is unconnected.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.04hrs. If unconnected, the buff logic would never be initiated from the sequence, but the nodes might still exist in the graph.",
                    "next": "step-5"
                },
                {
                    "text": "Observe that 'Sequence Pin 1' connects to a 'Print String' node only.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. While a Print String might be present, the problem states 'Set Max Walk Speed' is never reached, implying more intended logic than just a simple print.",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "blueprintslogic",
            "title": "Step 6: Identify Problematic Node",
            "prompt": "You've traced the sequence: Pin 0 to 'Destroy Actor', Pin 1 to 'Set Max Walk Speed'. Given the symptoms (immediate despawn, no buff), which node is the most likely culprit for the issue?",
            "choices": [
                {
                    "text": "Identify the 'Destroy Actor' node placed on 'Sequence Pin 0' as the problematic element.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. Its position in the sequence, firing before the buff logic, is highly suspicious and aligns with the observed symptoms.",
                    "next": "step-7"
                },
                {
                    "text": "Identify the 'Sequence' node itself as inherently flawed for this use case.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. 'Sequence' nodes are valid for executing multiple paths; the issue is *how* it's being used here, not the node itself.",
                    "next": "step-6"
                },
                {
                    "text": "Identify the 'Set Max Walk Speed' node as being misconfigured or having an incorrect target value.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.08hrs. The problem states 'Set Max Walk Speed' is *never reached*, so its configuration isn't the primary problem at this stage.",
                    "next": "step-6"
                },
                {
                    "text": "Identify the 'On Component Begin Overlap' node as failing to properly trigger.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.06hrs. The problem explicitly states 'On Component Begin Overlap' fires successfully, so this is not the issue.",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "blueprintslogic",
            "title": "Step 7: Understand 'Destroy Actor' Behavior",
            "prompt": "What is the typical behavior of the 'Destroy Actor' node when it executes within a Blueprint's event graph?",
            "choices": [
                {
                    "text": "Understand the synchronous nature of 'Destroy Actor': upon execution, it immediately terminates the blueprint's execution context.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. This is crucial knowledge. When 'Destroy Actor' fires, the blueprint instance ceases to exist, stopping all its active logic.",
                    "next": "step-8"
                },
                {
                    "text": "Believe 'Destroy Actor' only makes the actor invisible, and blueprint logic continues in the background.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.1hrs. This is incorrect. 'Destroy Actor' removes the actor from the world and stops its script execution.",
                    "next": "step-7"
                },
                {
                    "text": "Assume 'Destroy Actor' puts the actor into a 'pending kill' state, allowing current logic to finish before destruction.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.08hrs. While some systems queue destruction, 'Destroy Actor' in Blueprints is largely synchronous and halts further execution for that specific instance.",
                    "next": "step-7"
                },
                {
                    "text": "Assume the 'Sequence' node allows both pins to complete independently, even if one destroys the actor.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.07hrs. This is a common misconception. A 'Sequence' node executes pins sequentially. If an early pin destroys the actor, later pins *within that blueprint instance* will not run.",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "blueprintslogic",
            "title": "Step 8: Articulate the Problem",
            "prompt": "Now that you understand the sequence flow and 'Destroy Actor' behavior, clearly state *why* the 'Set Max Walk Speed' node isn't reached.",
            "choices": [
                {
                    "text": "Articulate the immediate consequence: When 'Destroy Actor' executes on Sequence Pin 0, it terminates the execution context of the owning blueprint, preventing any subsequent nodes (even on Pin 1) from executing.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.1hrs. This is the precise problem statement. The blueprint is destroyed before it can apply the buff, because the sequence executes its pins in order.",
                    "next": "step-9"
                },
                {
                    "text": "Conclude that the 'Sequence' node is executing both pins simultaneously, causing a race condition where Destroy Actor always wins.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.08hrs. 'Sequence' nodes execute pins in order, not simultaneously. While it's a 'race' in outcome, the root cause is synchronous destruction, not simultaneous execution.",
                    "next": "step-8"
                },
                {
                    "text": "Conclude that 'Set Max Walk Speed' is not firing because the character reference is somehow becoming invalid between the Cast and the Set node.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.07hrs. The problem states the character reference is valid right before the split. Re-evaluate the core issue based on the 'Destroy Actor' placement.",
                    "next": "step-8"
                },
                {
                    "text": "Conclude that the overlap event is firing twice, causing a bug that interrupts the flow.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.06hrs. While double-firing can happen, it's not the primary explanation for the consistent 'no buff' behavior when 'Destroy Actor' is firing so early.",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "blueprintslogic",
            "title": "Step 9: Confirm Unreached Node",
            "prompt": "You've confirmed the 'Destroy Actor' is cutting off the buff logic. What's the primary action to resolve the execution flow issue?",
            "choices": [
                {
                    "text": "Determine that the 'Destroy Actor' node needs to be moved to execute *after* the buff application and duration management.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. For the buff to be applied, the destruction of the pickup must occur *last* in the logic flow.",
                    "next": "step-10"
                },
                {
                    "text": "Remove the 'Sequence' node entirely and try to reconnect everything in a single linear path.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. While removing the sequence is part of the solution, the *core* determination is about the order of 'Destroy Actor'.",
                    "next": "step-9"
                },
                {
                    "text": "Encapsulate the 'Set Max Walk Speed' logic within a custom event and call it from the Sequence Pin 1.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.08hrs. This wouldn't change the fundamental issue of the blueprint being destroyed *before* the sequence can even call the custom event from Pin 1.",
                    "next": "step-9"
                },
                {
                    "text": "Add another 'Sequence' node before the current one, with Pin 0 for buff and Pin 1 for destroy.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.07hrs. This would just recreate the same problem if 'Destroy Actor' is placed on an early pin of *any* sequence.",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "blueprintslogic",
            "title": "Step 10: Remove Sequence Node",
            "prompt": "To restructure the flow and ensure 'Destroy Actor' fires last, what's the first physical modification you should make to the existing nodes?",
            "choices": [
                {
                    "text": "Remove the existing 'Sequence' node from the execution path by deleting it and disconnecting its pins.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.02hrs. The 'Sequence' node, in its current configuration, is detrimental to the desired execution order. Removing it allows for a linear, controlled flow.",
                    "next": "step-11"
                },
                {
                    "text": "Immediately move the 'Destroy Actor' node to the very end of the graph, leaving its old connections.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Moving a node without disconnecting it first can create messy wires or compiler errors. It's better to clean up first.",
                    "next": "step-10"
                },
                {
                    "text": "Add a new 'Custom Event' node and move all buff logic into it.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.06hrs. While good for organization, this doesn't resolve the immediate problem of the 'Destroy Actor' severing the flow.",
                    "next": "step-10"
                },
                {
                    "text": "Add a 'Do N' node to prevent the overlap from firing multiple times.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.04hrs. This would prevent re-triggering, but doesn't address the primary issue of the 'Destroy Actor' node interrupting the *first* execution.",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "blueprintslogic",
            "title": "Step 11: Disconnect Destroy Actor",
            "prompt": "After removing the 'Sequence' node, what should you do with the 'Destroy Actor' node that was previously connected to Sequence Pin 0?",
            "choices": [
                {
                    "text": "Disconnect the 'Destroy Actor' node from its current position and set it aside for later reconnection.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.03hrs. It needs to be reconnected at the very end of the logic flow, so isolating it for now is correct.",
                    "next": "step-12"
                },
                {
                    "text": "Delete the 'Destroy Actor' node, as it's causing the problem.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. The pickup is designed to destroy itself. Deleting it would break that intended functionality.",
                    "next": "step-11"
                },
                {
                    "text": "Connect the 'Destroy Actor' node directly to 'On Component Begin Overlap' to ensure it fires reliably.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.06hrs. This would bring you back to the original problem, as it would still fire before any buff logic could execute.",
                    "next": "step-11"
                },
                {
                    "text": "Wrap the 'Destroy Actor' node in a 'Custom Event' to control its execution more precisely.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.07hrs. While a Custom Event can be useful, it doesn't solve the core issue of *when* the destruction happens relative to other logic.",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "blueprintslogic",
            "title": "Step 12: Disconnect Buff Logic Start",
            "prompt": "With the 'Sequence' node removed, what should you do with the 'Set Max Walk Speed' node and its associated buff logic that was on Sequence Pin 1?",
            "choices": [
                {
                    "text": "Disconnect the 'Set Max Walk Speed' node from its current position, preparing it to be rewired.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.03hrs. It needs to be reconnected directly after the successful cast, so isolating it is necessary.",
                    "next": "step-13"
                },
                {
                    "text": "Delete the 'Set Max Walk Speed' node and all buff logic, as it wasn't working anyway.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. The goal is to make the buff work, not remove it. The logic itself might be correct, just executed at the wrong time.",
                    "next": "step-12"
                },
                {
                    "text": "Connect the 'Set Max Walk Speed' node directly to 'Event BeginPlay'.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.06hrs. This would apply the buff at game start, not on overlap, and to an unspecified player if not handled carefully.",
                    "next": "step-12"
                },
                {
                    "text": "Wrap the 'Set Max Walk Speed' node in a 'Function' for better modularity.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.07hrs. Good practice for modularity, but doesn't directly solve the execution flow problem here.",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "blueprintslogic",
            "title": "Step 13: Rewire Apply Buff",
            "prompt": "Now that you've isolated the key nodes, how do you correctly initiate the buff application logic?",
            "choices": [
                {
                    "text": "Rewire the execution flow: Connect the successful 'Cast To Player Character' output directly to the 'Set Max Walk Speed' node (for buff application).",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.06hrs. This ensures the buff logic fires immediately after a valid player character is found and before anything else, like destruction.",
                    "next": "step-14"
                },
                {
                    "text": "Connect the 'Set Max Walk Speed' node directly to 'On Component End Overlap'.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. This would apply the buff when the player *leaves* the pickup, which isn't the intended behavior.",
                    "next": "step-13"
                },
                {
                    "text": "Connect the 'Set Max Walk Speed' node to a 'Gate' node to control its entry.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.07hrs. A 'Gate' node isn't necessary here, as the direct connection provides the desired immediate execution without complex conditions.",
                    "next": "step-13"
                },
                {
                    "text": "Connect the 'Set Max Walk Speed' to a 'Custom Event' and then call that event.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.08hrs. While functional, it adds an unnecessary layer of indirection for this simple, direct flow.",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "blueprintslogic",
            "title": "Step 14: Verify Player Character Ref",
            "prompt": "You've connected 'Cast To Player Character' to 'Set Max Walk Speed'. What's an important detail to ensure for the 'Set Max Walk Speed' node?",
            "choices": [
                {
                    "text": "Ensure the 'Set Max Walk Speed' node uses the Player Character reference acquired from the successful cast (the 'As Player Character' output).",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. This ensures the speed is applied to the specific player who overlapped the pickup, avoiding issues in multiplayer or with multiple characters.",
                    "next": "step-15"
                },
                {
                    "text": "Make sure the 'Set Max Walk Speed' node has 'Is Local Player Controller' checked.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.04hrs. 'Set Max Walk Speed' targets a Character (Pawn), not a Player Controller. The reference from the cast is sufficient.",
                    "next": "step-14"
                },
                {
                    "text": "Set the 'New Max Walk Speed' value to a very high number to confirm the buff works.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.06hrs. While testing values is good, the primary focus is ensuring the *correct target* is being modified before worrying about the exact value.",
                    "next": "step-14"
                },
                {
                    "text": "Add an 'IsValid' check after the 'As Player Character' pin to prevent errors.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.07hrs. The problem states the 'Cast To Player Character' is successful and the reference is valid *right before the logic split*. While 'IsValid' is good practice, it's redundant here and not the most critical next step.",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "blueprintslogic",
            "title": "Step 15: Connect to Buff Duration",
            "prompt": "The player's speed buff is now applied. What's the next logical step to ensure the buff is temporary as intended?",
            "choices": [
                {
                    "text": "Connect the execution output pin of the 'Set Max Walk Speed' node to a 'Delay' node (for buff duration management).",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.04hrs. A 'Delay' node is a common and simple way to manage temporary effects in Blueprints, holding execution for a set time.",
                    "next": "step-16"
                },
                {
                    "text": "Immediately connect the 'Set Max Walk Speed' node to a second 'Set Max Walk Speed' node to reset the speed.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. This would reset the speed instantly, making the buff imperceptible. A delay is needed to allow the buff to be active.",
                    "next": "step-15"
                },
                {
                    "text": "Connect the 'Set Max Walk Speed' node to a 'Timeline' node to control the speed over time.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.06hrs. A 'Timeline' is a valid option for more complex, interpolated buffs, but a simple 'Delay' is sufficient for a fixed duration and easier to implement for this scenario.",
                    "next": "step-15"
                },
                {
                    "text": "Connect the 'Set Max Walk Speed' node to a 'Do Once' node.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. A 'Do Once' would prevent re-triggering, but doesn't manage the *duration* of the buff or its eventual reset.",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "blueprintslogic",
            "title": "Step 16: Set Delay Duration",
            "prompt": "You've added a 'Delay' node for buff duration. What is an important next step for this node?",
            "choices": [
                {
                    "text": "Determine and set the appropriate duration for the 'Delay' node based on the desired buff length.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.03hrs. The 'Delay' node's 'Duration' input defines how long the buff will last before the next part of the logic executes.",
                    "next": "step-17"
                },
                {
                    "text": "Connect the 'Delay' node's 'Completed' output back to 'On Component Begin Overlap'.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. This would create an infinite loop and unintended re-triggering.",
                    "next": "step-16"
                },
                {
                    "text": "Add a 'Branch' node after the 'Delay' to check if the player is still overlapping.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.06hrs. While an interesting thought, the buff should simply expire after its duration. The pickup will be destroyed shortly, so continued overlap isn't relevant to the buff's internal timer.",
                    "next": "step-16"
                },
                {
                    "text": "Ensure the 'Delay' node has its 'Is Latent' property unchecked.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.04hrs. 'Delay' nodes are inherently latent, and this property is not usually user-configurable or relevant to its basic function.",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "blueprintslogic",
            "title": "Step 17: Connect Reset Speed",
            "prompt": "After the delay for the buff duration, what logic is needed to revert the player's speed to its original state?",
            "choices": [
                {
                    "text": "Connect the 'On Completed' output of the 'Delay' node to a new 'Set Max Walk Speed' node to reset the player's speed to default.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.06hrs. This ensures the player's speed returns to normal after the buff expires, completing the temporary effect.",
                    "next": "step-18"
                },
                {
                    "text": "Connect the 'On Completed' output of the 'Delay' node directly to the 'Destroy Actor' node.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. This would destroy the actor, but the player's speed would remain permanently buffed, which isn't the intended temporary effect.",
                    "next": "step-17"
                },
                {
                    "text": "Add a 'Do Once' node after the 'Delay' to ensure the reset only happens once.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.04hrs. The 'Delay' node's 'On Completed' will only fire once after its duration, so a 'Do Once' is redundant here.",
                    "next": "step-17"
                },
                {
                    "text": "Connect the 'On Completed' output to a 'Print String' to confirm the delay finished.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.03hrs. While useful for debugging, this doesn't implement the necessary game logic for resetting the speed.",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "blueprintslogic",
            "title": "Step 18: Configure Reset Speed",
            "prompt": "You've added the second 'Set Max Walk Speed' node for resetting speed. What's crucial for its proper configuration?",
            "choices": [
                {
                    "text": "Ensure the new 'Set Max Walk Speed' node uses the Player Character reference (from the initial cast) and sets the original default speed.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. It's vital to target the correct player and restore their speed to the intended baseline for a true temporary buff.",
                    "next": "step-19"
                },
                {
                    "text": "Set the 'New Max Walk Speed' to 0 to stop the player entirely after the buff.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. This would halt the player, which is not the intention of a temporary speed buff; it should revert to normal movement.",
                    "next": "step-18"
                },
                {
                    "text": "Hardcode a new speed value that is slightly lower than the initial default speed.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.06hrs. This would leave the player with a permanent slight speed reduction, which is unintended. It should revert to the *original* default.",
                    "next": "step-18"
                },
                {
                    "text": "Connect the 'Target' pin of the 'Set Max Walk Speed' to 'Get Player Character' directly.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.07hrs. While 'Get Player Character' works for a single-player game, using the already established and valid reference from the initial cast is more efficient and robust.",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "blueprintslogic",
            "title": "Step 19: Connect Destroy Actor",
            "prompt": "With the buff applied and reset logic in place, when should the pickup finally destroy itself?",
            "choices": [
                {
                    "text": "Connect the final execution output pin of the speed reset node to the 'Destroy Actor' node.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.07hrs. This ensures the pickup is destroyed only after all its intended effects (buff application, duration, and speed reset) have completed.",
                    "next": "step-20"
                },
                {
                    "text": "Connect 'Destroy Actor' to 'Event Begin Play' to ensure it's removed from the start.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. This would remove the pickup immediately at game start, making it unusable for the player.",
                    "next": "step-19"
                },
                {
                    "text": "Connect 'Destroy Actor' to the 'On Component End Overlap' event.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.08hrs. This would destroy the actor as soon as the player steps off it, potentially cutting off the buff duration or reset logic if it's not timed perfectly with the buff's end.",
                    "next": "step-19"
                },
                {
                    "text": "Add a separate 'Delay' before 'Destroy Actor' to give it a moment after reset.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.06hrs. This is unnecessary. The destruction can happen immediately after the speed reset, as all intended logic for the player is complete.",
                    "next": "step-19"
                }
            ]
        },
        "step-20": {
            "skill": "blueprintslogic",
            "title": "Step 20: Verify New Flow",
            "prompt": "You've rewired the blueprint. Take a moment to mentally (or visually) review the entire execution path. What should the correct sequence of events now be?",
            "choices": [
                {
                    "text": "Verify the new flow: Cast -> Apply Buff -> Delay -> Reset Speed -> Destroy Actor.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.05hrs. This correct sequence ensures the buff is applied, lasts for its duration, the speed is reset, and then the pickup is removed.",
                    "next": "step-21"
                },
                {
                    "text": "Verify the new flow: Delay -> Apply Buff -> Reset Speed -> Cast -> Destroy Actor.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. This order is incorrect. The buff must be applied *after* casting to the player, and the delay comes after the buff.",
                    "next": "step-20"
                },
                {
                    "text": "Verify the new flow: Cast -> Destroy Actor -> Apply Buff -> Delay -> Reset Speed.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.08hrs. This is essentially the original problematic flow, where 'Destroy Actor' would cut off all subsequent logic.",
                    "next": "step-20"
                },
                {
                    "text": "Verify the new flow: Apply Buff -> Cast -> Delay -> Destroy Actor -> Reset Speed.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.07hrs. 'Cast' must happen before 'Apply Buff', and 'Destroy Actor' should be the last step, after speed is reset.",
                    "next": "step-20"
                }
            ]
        },
        "step-21": {
            "skill": "blueprintslogic",
            "title": "Step 21: Compile Blueprint",
            "prompt": "The Blueprint logic is complete. What is the necessary next step before testing?",
            "choices": [
                {
                    "text": "Compile the BP_SpeedBoost Blueprint.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.03hrs. Compiling applies your changes and checks for basic errors, making the new logic active.",
                    "next": "step-22"
                },
                {
                    "text": "Close the Blueprint editor immediately and return to the level.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.03hrs. Changes are not applied without compiling and saving first. Closing would discard your work.",
                    "next": "step-21"
                },
                {
                    "text": "Validate all referenced assets within the Blueprint's 'Asset References' tab.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.04hrs. While 'Validate Assets' is a tool, it's not a standard step after every logic change and isn't required for compilation.",
                    "next": "step-21"
                },
                {
                    "text": "Restart the Unreal Engine editor to ensure changes are picked up.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.05hrs. Restarting the editor is generally not necessary for Blueprint changes; compiling and saving are sufficient.",
                    "next": "step-21"
                }
            ]
        },
        "step-22": {
            "skill": "editor",
            "title": "Step 22: Save Blueprint",
            "prompt": "You've compiled the Blueprint. What should you do next to ensure your changes persist?",
            "choices": [
                {
                    "text": "Save the Blueprint and return to the Level Editor.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.04hrs. Saving prevents losing your work, and returning to the editor prepares for testing in the game environment.",
                    "next": "step-23"
                },
                {
                    "text": "Revert the Blueprint to its last saved state, just in case.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. Reverting would undo all your hard work. You should only revert if you intend to discard changes.",
                    "next": "step-22"
                },
                {
                    "text": "Export the Blueprint as a text file for backup.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.06hrs. While backups are good, saving the asset within the editor is the standard and necessary step.",
                    "next": "step-22"
                },
                {
                    "text": "Push the changes to source control without testing.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.07hrs. Always test your changes locally before committing them to source control, to avoid breaking the team's build.",
                    "next": "step-22"
                }
            ]
        },
        "step-23": {
            "skill": "testing",
            "title": "Step 23: Test in PIE",
            "prompt": "The Blueprint is compiled and saved. What is the final step to confirm the fix?",
            "choices": [
                {
                    "text": "Run the PIE session and test the overlap, confirming the player receives the speed buff *before* the item successfully despawns.",
                    "type": "correct",
                    "feedback": "Optimal Time: +0.07hrs. This crucial step validates the entire fix end-to-end, ensuring the intended behavior is now achieved.",
                    "next": "conclusion"
                },
                {
                    "text": "Check the project settings for any global speed multipliers that might be interfering.",
                    "type": "obvious",
                    "feedback": "Extended Time: +0.05hrs. The problem was an execution flow issue within the pickup blueprint, not a global setting. This would be a wasted diversion.",
                    "next": "step-23"
                },
                {
                    "text": "Open the output log and search for 'SpeedBoost' messages.",
                    "type": "plausible",
                    "feedback": "Extended Time: +0.04hrs. While logs are useful, a direct functional test in the game world is needed to confirm the intended visual and gameplay behavior.",
                    "next": "step-23"
                },
                {
                    "text": "Deploy the project to a mobile device for a final test.",
                    "type": "subtle",
                    "feedback": "Extended Time: +0.08hrs. This is premature and overly complex. Basic functionality should always be confirmed in PIE (Play In Editor) first, which is much faster.",
                    "next": "step-23"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "Congratulations! You have successfully completed this debugging scenario. The BP_SpeedBoost now correctly applies the temporary speed buff before destroying itself, functioning as intended.",
            "choices": []
        }
    }
};
