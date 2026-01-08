window.SCENARIOS['DestroyActorStopsExecutionFlow'] = {
    "meta": {
        "title": "Pickup Despawns Prematurely, Preventing Buff Application",
        "description": "PowerUp despawns on overlap, but player speed buff isn't applied. 'Set Max Walk Speed' never reached.",
        "estimateHours": 0.75,
        "category": "Blueprints & Logic",
        "tokens_used": 12892
    },
    "setup": [
        {
            "action": "set_ue_property",
            "scenario": "DestroyActorStopsExecutionFlow",
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
            "scenario": "DestroyActorStopsExecutionFlow",
            "step": "final"
        }
    ],
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "blueprintslogic",
            "title": "Reproduce the Reported Issue",
            "prompt": "<p><strong>BP_SpeedBoost</strong> despawns, player speed unchanged. Overlap fires. How do you investigate?</p>",
            "choices": [
                {
                    "text": "<p>Start a <strong>Play In Editor (PIE)</strong> session and attempt to reproduce the described behavior.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.02hrs. Reproducing the bug in a controlled environment is the crucial first step to confirm its existence and observe its exact symptoms.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Open the <strong>Character Blueprint</strong> and check the default <code>Max Walk Speed</code> value.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While checking character settings might be relevant for <em>buff strength</em>, the report states the buff is <em>never applied</em>, making this a premature investigation into the wrong aspect of the problem.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Review the entire project's <strong>Project Settings</strong> for any global physics or overlap settings.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. This is too broad. The issue is specific to a single Blueprint's interaction, not a global project misconfiguration.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Immediately add multiple <strong>Print String</strong> nodes in the <strong>BP_SpeedBoost</strong> to trace execution.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While <strong>Print String</strong> is a useful debugging tool, it's generally better to first observe the high-level behavior directly in PIE before diving into code. You might not know where to place them effectively yet.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "blueprintslogic",
            "title": "Observe Player Movement Speed",
            "prompt": "<p>After overlapping <strong>BP_SpeedBoost</strong> in <strong>PIE</strong>, it despawns. What do you observe about player speed?</p>",
            "choices": [
                {
                    "text": "<p>The player's movement speed does not change from its original value.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.01hrs. This confirms the core symptom: the buff isn't applied.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>The player's movement speed increases briefly, then immediately returns to normal.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. This would indicate the buff *is* applied, but its duration is zero or extremely short, which contradicts the report that it's never applied.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>The player's movement speed decreases, suggesting a negative buff was applied.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. This is an incorrect observation, as the bug report specifically states a speed *increase* is intended.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>The player's movement speed increases, but the <strong>BP_SpeedBoost</strong> doesn't despawn.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. This contradicts part of the initial bug report, which clearly stated the item despawns immediately.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "blueprintslogic",
            "title": "Confirm Pickup Despawn Behavior",
            "prompt": "<p>Player speed unchanged. <strong>BP_SpeedBoost</strong> despawns on overlap. What's its despawn timing?</p>",
            "choices": [
                {
                    "text": "<p>The <strong>BP_SpeedBoost</strong> despawns immediately upon overlap, as reported.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.01hrs. This confirms the other half of the core symptom and the timing issue.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>The <strong>BP_SpeedBoost</strong> remains in the world after overlap, not despawning.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. This contradicts the initial bug report. Carefully re-observe the behavior.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>The <strong>BP_SpeedBoost</strong> despawns only after a noticeable delay.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. This is incorrect. The report states it despawns immediately, and your observation should confirm this.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>The <strong>BP_SpeedBoost</strong> reappears shortly after despawning.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. This is not part of the reported bug or observed behavior. Focus on the direct symptoms.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "blueprintslogic",
            "title": "Locate Relevant Blueprint",
            "prompt": "<p>Symptoms: despawns immediately, no buff. Issue in <strong>BP_SpeedBoost</strong>. How do you examine its logic?</p>",
            "choices": [
                {
                    "text": "<p>Locate the <strong>BP_SpeedBoost</strong> asset in the <strong>Content Browser</strong> and open it.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.02hrs. Directly accessing the affected Blueprint is the next logical step to understand its internal logic.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Check the <strong>World Outliner</strong> for a <strong>BP_SpeedBoost</strong> instance and examine its <strong>Details</strong> panel.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While inspecting an instance can reveal overridden properties, the problem is with the Blueprint's fundamental logic, which requires opening the Blueprint asset itself.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Add more <strong>BP_SpeedBoost</strong> pickups to the level to see if it's an instance-specific problem.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The issue is described as a general bug, not an instance-specific one. Adding more won't help diagnose the logic.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Use the <strong>Console</strong> command <code>obj list class=Blueprint</code> to list all Blueprints.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While this command lists Blueprints, it's an indirect and inefficient way to find a specific known Blueprint you can easily search for in the <strong>Content Browser</strong>.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "blueprintslogic",
            "title": "Navigate to Event Graph",
            "prompt": "<p>You've opened <strong>BP_SpeedBoost</strong>. Where do you find the interaction logic for an overlap event?</p>",
            "choices": [
                {
                    "text": "<p>Open the <strong>Event Graph</strong>, as this is where execution logic for events like overlap resides.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.03hrs. The <strong>Event Graph</strong> is the correct place to find the 'On Component Begin Overlap' logic.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Check the <strong>Components</strong> panel to verify the collision settings of the root component.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While collision settings are important, the bug report confirms the 'On Component Begin Overlap' event *fires*, meaning collision itself is likely set up correctly. The problem is what happens *after* the event.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Review the <strong>Construction Script</strong> to ensure proper initialization of variables.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The <strong>Construction Script</strong> runs only in the editor or on spawn, not typically for runtime interaction logic that's failing after overlap.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Examine the <strong>Macros</strong> and <strong>Functions</strong> graph for any custom buff application logic.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While custom logic might be encapsulated in functions, the entry point for the overlap event will still be in the <strong>Event Graph</strong>. It's best to start there.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "blueprintslogic",
            "title": "Locate Overlap Event",
            "prompt": "<p>In <strong>BP_SpeedBoost Event Graph</strong>. Which node starts the problematic overlap logic?</p>",
            "choices": [
                {
                    "text": "<p>Locate the <strong>On Component Begin Overlap</strong> node, as the issue occurs upon overlap.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.02hrs. This is the correct entry point for the interaction logic.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Search for the <strong>Event Tick</strong> node, as speed changes often happen every frame.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While <strong>Event Tick</strong> can manage ongoing effects, the *initial* application of the buff is tied to the overlap event, not a continuous tick.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Find any <strong>Custom Events</strong> that might be responsible for despawning.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While custom events might be used, the primary trigger is the overlap, making 'On Component Begin Overlap' the most direct starting point.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Look for the <strong>Begin Play</strong> node to ensure initial setup is correct.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. <strong>Begin Play</strong> handles initial setup, but the problem occurs during interaction after the actor has already spawned and begun play.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "blueprintslogic",
            "title": "Trace Cast to Player Character",
            "prompt": "<p>Found <strong>On Component Begin Overlap</strong>. 'Cast To Player Character' succeeds. How to trace execution?</p>",
            "choices": [
                {
                    "text": "<p>Trace the execution wire connected to the 'Cast To Player Character' node's 'Cast Successful' output pin.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Following the successful cast ensures you are examining the logic path relevant to the player receiving the buff.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Trace the execution wire connected to the 'Cast To Player Character' node's 'Cast Failed' output pin.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The report states the cast *succeeds*, so tracing the 'Cast Failed' path is irrelevant to the current problem.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Check the collision settings on the character's <strong>Capsule Component</strong>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The 'On Component Begin Overlap' event *is* firing and the cast *is* successful, indicating collision setup is not the problem.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Add a <strong>Print String</strong> node directly after the 'Cast To Player Character'.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The bug report already states the character reference is valid. While debugging, it's good to trust reported intermediate states unless you have reason to doubt them. Focus on the *flow* now.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "blueprintslogic",
            "title": "Identify Initial Logic Split",
            "prompt": "<p>Tracing from successful 'Cast To Player Character'. What is the immediate next node?</p>",
            "choices": [
                {
                    "text": "<p>Identify that the execution pin connects immediately to a <strong>Sequence</strong> node.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.03hrs. The <strong>Sequence</strong> node is critical to understanding the current logic flow problem.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Observe that it connects directly to the <strong>Set Max Walk Speed</strong> node.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. This would be the ideal scenario, but it's not what's currently implemented, according to the problem description.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Note that it connects to a <strong>Branch</strong> node checking a boolean variable.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. A <strong>Branch</strong> node evaluates a condition. While possible, the problem description implies a more direct flow issue related to execution order, not conditional logic.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>See that it connects to a <strong>Delay</strong> node.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. A <strong>Delay</strong> node is often used for buff duration, but not typically as the immediate first node after a cast for applying the buff itself.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "blueprintslogic",
            "title": "Examine Sequence Pin 0 Output",
            "prompt": "<p>A <strong>Sequence</strong> node follows the cast. What node is connected to <strong>Sequence Pin 0</strong>?</p>",
            "choices": [
                {
                    "text": "<p>Observe that <strong>Sequence Pin 0</strong> connects directly to the <strong>Destroy Actor</strong> node.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. This is a crucial observation for identifying the root cause of the problem.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Note that <strong>Sequence Pin 0</strong> connects to the <strong>Set Max Walk Speed</strong> node.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. If this were the case, the buff *would* apply. Re-examine the connections carefully.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Identify that <strong>Sequence Pin 0</strong> is not connected to anything.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. An unconnected pin usually means incomplete logic. Re-examine the graph visually.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>It connects to a <strong>Print String</strong> node for debugging.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While often used for debugging, this is unlikely to be the primary intended logic path for despawning. Focus on core functionality.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "blueprintslogic",
            "title": "Examine Sequence Pin 1 Output",
            "prompt": "<p><strong>Sequence Pin 0</strong> leads to <strong>Destroy Actor</strong>. What does <strong>Sequence Pin 1</strong> connect to?</p>",
            "choices": [
                {
                    "text": "<p>Observe that <strong>Sequence Pin 1</strong> connects to the remainder of the logic, including <strong>Set Max Walk Speed</strong> and any subsequent flow.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.04hrs. This confirms that the buff application logic is intended to run via this pin.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Note that <strong>Sequence Pin 1</strong> is also connected to the <strong>Destroy Actor</strong> node.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. If both pins led to <strong>Destroy Actor</strong>, there would be no buff logic. Re-examine the graph.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Identify that <strong>Sequence Pin 1</strong> is not connected to anything.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. An unconnected pin for critical buff logic would be a clear oversight. Re-examine the visual flow.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>It connects to a separate <strong>On End Overlap</strong> event.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The <strong>Sequence</strong> node processes pins sequentially *from the same input event*. Connecting to a different event wouldn't make sense here.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "blueprintslogic",
            "title": "Articulate the Problem",
            "prompt": "<p>Pin 0 to <strong>Destroy Actor</strong>, Pin 1 to buff logic. What prevents the buff from applying?</p>",
            "choices": [
                {
                    "text": "<p>The <strong>Destroy Actor</strong> node, when executed, immediately terminates the Blueprint's execution context.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. This is the correct understanding. <strong>Destroy Actor</strong> is a synchronous operation that invalidates the Blueprint instance, halting all further execution within it.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>The <strong>Sequence</strong> node only allows one pin to execute per event, ignoring <strong>Sequence Pin 1</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. This is incorrect. A <strong>Sequence</strong> node executes all its pins in order. The problem is not that Pin 1 is ignored, but that the Blueprint is destroyed before Pin 1 has a chance to execute.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>The <strong>Destroy Actor</strong> node has a hidden 'reset speed' function built-in.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. This is speculative and incorrect. <strong>Destroy Actor</strong> simply removes the actor; it doesn't manipulate player properties.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>The buff application logic on <strong>Sequence Pin 1</strong> is missing a 'Target' input for <strong>Set Max Walk Speed</strong>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While a missing target would prevent the buff, the more immediate problem is that the entire logic on Pin 1 is never reached due to the actor's destruction.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "blueprintslogic",
            "title": "Prepare for Blueprint Modification",
            "prompt": "<p>The <strong>Sequence</strong> node causes early <strong>Destroy Actor</strong>. How do you start correcting this?</p>",
            "choices": [
                {
                    "text": "<p>Remove the existing <strong>Sequence</strong> node from the execution path.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.02hrs. Removing the incorrectly placed <strong>Sequence</strong> node is the first step to re-ordering the logic flow.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Try dragging the execution wires on the <strong>Sequence</strong> node to change their order.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While you can re-order pins, the fundamental problem is that <strong>Destroy Actor</strong> should not be on any pin that executes *before* the buff is applied. Removing the <strong>Sequence</strong> is a cleaner solution here.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Replace the <strong>Destroy Actor</strong> node with a <strong>Set Actor Hidden In Game</strong> node.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. This is a common wrong turn. While it stops the actor from being destroyed, it doesn't address the *order of operations* and adds an unnecessary intermediate step to hiding the actor instead of proper destruction.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Add another <strong>Sequence</strong> node to re-route the logic more complexly.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. Adding more complexity to a faulty structure is generally not the solution. Simplicity and correct ordering are key.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "blueprintslogic",
            "title": "Rewire Buff Application Start",
            "prompt": "<p>You've removed the <strong>Sequence</strong> node. How do you rewire to ensure buff application runs first?</p>",
            "choices": [
                {
                    "text": "<p>Connect the successful 'Cast To Player Character' output directly to the first node of the buff application logic (e.g., <strong>Set Max Walk Speed</strong>).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.06hrs. This ensures the buff logic is the immediate next step after confirming the player character.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Connect the successful 'Cast To Player Character' output to <strong>Destroy Actor</strong>, then its output to buff logic.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. This would still result in the actor being destroyed before the buff is applied, as <strong>Destroy Actor</strong> has no execution output pin to continue logic within the same blueprint instance.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Connect the <strong>On Component Begin Overlap</strong> directly to the <strong>Set Max Walk Speed</strong>, bypassing the cast.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Bypassing the cast would mean the buff could be applied to non-player actors, or potentially fail if the 'Other Actor' isn't a character, leading to new bugs.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Add a new <strong>Delay</strong> node right after the cast, then connect to the buff logic.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While a delay might be used for buff duration, it's not needed *before* applying the buff itself. It just adds an unnecessary pause.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "blueprintslogic",
            "title": "Verify Target Reference for Buff",
            "prompt": "<p>Connected 'Cast To Player Character' to <strong>Set Max Walk Speed</strong>. Which input must you verify?</p>",
            "choices": [
                {
                    "text": "<p>Ensure the <strong>Set Max Walk Speed</strong> node uses the <strong>Player Character</strong> reference from the cast as its 'Target'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Passing the correct target reference ensures the buff is applied to the player character, not to the pickup itself or a default target.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Verify the 'New Walk Speed' input value is sufficiently high.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While the speed value is important, the immediate task is to ensure the node is targeting the correct actor. The value itself is a later fine-tuning step.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Check if the 'Player Character' reference is also connected to a <strong>Print String</strong>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. This is unnecessary debugging now that the execution flow is being corrected. The core problem is not about verifying the reference's existence.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Confirm the <strong>Set Max Walk Speed</strong> node is set to 'Local' rather than 'World' speed.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. <strong>Max Walk Speed</strong> is inherently a character-local property. This concept doesn't apply to it in the same way as, for example, 'Add Impulse' or 'Set Location'.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "blueprintslogic",
            "title": "Connect Buff Duration Logic",
            "prompt": "<p><strong>Set Max Walk Speed</strong> targeted. How to manage buff duration before pickup despawns?</p>",
            "choices": [
                {
                    "text": "<p>Connect the execution output pin of <strong>Set Max Walk Speed</strong> to the start of any <strong>Buff Duration Management</strong> logic.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.06hrs. This places the buff duration logic immediately after the buff application, ensuring the buff is active for the intended period.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Connect the execution output directly to <strong>Destroy Actor</strong>, assuming duration is handled elsewhere.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. If duration isn't handled here, the buff would be permanent or immediately removed. The pickup's destruction shouldn't be the *only* end to the buff.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Add a new <strong>Branch</strong> node to decide if a buff duration is needed.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The scenario clearly states the buff is temporary, so duration management is a definite requirement, not a conditional one.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Disconnect <strong>Set Max Walk Speed</strong> and move it to a separate custom event.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While custom events can organize logic, moving the core application out of the primary flow at this stage would disrupt current debugging efforts.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "blueprintslogic",
            "title": "Review Buff Duration Implementation",
            "prompt": "<p>Connected to <strong>Buff Duration Management</strong>. What's commonly used for a temporary buff reversion?</p>",
            "choices": [
                {
                    "text": "<p>A <strong>Delay</strong> node followed by logic to revert the speed, or a <strong>Timeline</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.03hrs. Both <strong>Delay</strong> and <strong>Timeline</strong> are common and effective methods for managing temporary effects over time in Blueprints.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>A <strong>DoOnce</strong> node to prevent the buff from being applied multiple times.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. A <strong>DoOnce</strong> prevents re-entry, but doesn't manage duration or revert the buff after a set time.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>An <strong>Event Tick</strong> constantly checking the buff's elapsed time.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While functional, using <strong>Event Tick</strong> for simple delays is often less efficient and harder to manage than a dedicated <strong>Delay</strong> or <strong>Timeline</strong> node.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>A custom C++ function that handles all buff timing.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While C++ is powerful, the scenario specifies Blueprints. Sticking to Blueprint solutions is the immediate goal.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "blueprintslogic",
            "title": "Implement Buff Reversion (if not using Timeline for full cycle)",
            "prompt": "<p>Using a <strong>Delay</strong> for duration. What should follow the <strong>Delay</strong> to revert the buff?</p>",
            "choices": [
                {
                    "text": "<p>A second <strong>Set Max Walk Speed</strong> node, connected to revert the player's speed to its original value.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. After the delay, the speed should be set back to normal to make the buff truly temporary.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Another <strong>Delay</strong> node for additional buff stages.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. This would extend the buff duration or add another stage, but wouldn't revert the initial buff, making it effectively permanent.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>A <strong>Print String</strong> node to announce the buff has ended.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While useful for debugging, this doesn't implement the core functionality of reverting the buff.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>A <strong>Destroy Actor</strong> node for the player character.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. This would destroy the player, which is definitely not the intended behavior for a speed buff!</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "blueprintslogic",
            "title": "Connect Pickup Destruction",
            "prompt": "<p>Buff applied, duration managed. What's the final step for the <strong>BP_SpeedBoost</strong> pickup?</p>",
            "choices": [
                {
                    "text": "<p>Connect the final execution output pin of the Buff Duration logic to the <strong>Destroy Actor</strong> node.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.07hrs. This ensures the pickup is removed from the world only after all its intended effects have been applied and managed.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Connect the <strong>Destroy Actor</strong> node back to the <strong>On Component Begin Overlap</strong> event for a loop.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. This would create an infinite loop that would likely crash the editor or result in unexpected behavior.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Add another <strong>Delay</strong> before the <strong>Destroy Actor</strong> node for aesthetic purposes.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While cosmetic delays are possible, the core logic requires destruction *after* buff management, not an arbitrary additional delay.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Disconnect the <strong>Destroy Actor</strong> node entirely, as it seems problematic.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The pickup *is* intended to despawn. Removing <strong>Destroy Actor</strong> would prevent proper cleanup, leading to other issues.</p>",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "blueprintslogic",
            "title": "Review Final Execution Flow",
            "prompt": "<p>Logic rewired. What's the correct conceptual order after overlap for <strong>BP_SpeedBoost</strong>?</p>",
            "choices": [
                {
                    "text": "<p><strong>Cast</strong> -> <strong>Apply Buff</strong> -> <strong>Manage Duration</strong> -> <strong>Destroy Actor</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. This is the correct, sequential flow that addresses all requirements: target validation, buff application, duration management, and then cleanup.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p><strong>Apply Buff</strong> -> <strong>Destroy Actor</strong> -> <strong>Manage Duration</strong> -> <strong>Cast</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. This order is completely nonsensical; you need to cast first, then the buff cannot be applied after destruction, and duration management requires an active buff.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p><strong>Destroy Actor</strong> -> <strong>Cast</strong> -> <strong>Apply Buff</strong> -> <strong>Manage Duration</strong>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. This is the original faulty logic, where destruction occurs first, preventing any subsequent steps from running within the Blueprint.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p><strong>Cast</strong> -> <strong>Destroy Actor</strong> -> <strong>Apply Buff</strong> -> <strong>Manage Duration</strong>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. This still has <strong>Destroy Actor</strong> executing prematurely, immediately after the cast, which would prevent the buff application and duration management.</p>",
                    "next": "step-19"
                }
            ]
        },
        "step-20": {
            "skill": "blueprintslogic",
            "title": "Compile the Blueprint",
            "prompt": "<p>Rewired <strong>BP_SpeedBoost</strong> logic. What's the next step to activate these changes?</p>",
            "choices": [
                {
                    "text": "<p><strong>Compile</strong> the <strong>BP_SpeedBoost</strong> Blueprint to apply the changes.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.03hrs. Compiling a Blueprint is essential for the engine to recognize and use the modified logic.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Run a <strong>PIE</strong> session immediately to test the changes.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Running PIE before compiling would mean the engine is still using the old, uncompiled version of the Blueprint, and your changes would not be present.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Close the Blueprint Editor and reopen it.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Closing and reopening might refresh the editor view, but it does not compile the Blueprint's logic.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Delete old <strong>BP_SpeedBoost</strong> instances from the level and re-add them.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. This is unnecessary. Instances in the level will update automatically once the Blueprint asset is compiled.</p>",
                    "next": "step-20"
                }
            ]
        },
        "step-21": {
            "skill": "blueprintslogic",
            "title": "Save the Blueprint Changes",
            "prompt": "<p>Blueprint compiled. What's next to permanently store these changes?</p>",
            "choices": [
                {
                    "text": "<p><strong>Save</strong> the <strong>BP_SpeedBoost</strong> Blueprint asset.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.04hrs. Saving the Blueprint ensures that your compiled changes are persisted to disk and won't be lost if the editor closes.</p>",
                    "next": "step-22"
                },
                {
                    "text": "<p><strong>Compile</strong> it again to be absolutely sure.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.02hrs. While harmless, compiling again immediately after a successful compile is redundant if no further changes have been made.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Generate <strong>Blueprint Nativization</strong> data for performance.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. Blueprint nativization is a packaging optimization, not a step for saving working changes during development.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Export the Blueprint to a text file as a backup.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While backups are good practice, the primary method for saving changes within UE5 is the 'Save' button. Exporting is not the standard workflow for persisting active edits.</p>",
                    "next": "step-21"
                }
            ]
        },
        "step-22": {
            "skill": "blueprintslogic",
            "title": "Return to Level Editor",
            "prompt": "<p><strong>BP_SpeedBoost</strong> compiled and saved. Where do you go next to test the fix?</p>",
            "choices": [
                {
                    "text": "<p>Return to the <strong>Level Editor</strong> (viewport) to prepare for testing.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.02hrs. The <strong>Level Editor</strong> is where you initiate <strong>Play In Editor</strong> sessions to test gameplay.</p>",
                    "next": "step-23"
                },
                {
                    "text": "<p>Open the <strong>Project Settings</strong> to verify input mappings.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Input mappings are unlikely to be related to this fix, as the bug was about the internal logic of the pickup, not player controls.</p>",
                    "next": "step-22"
                },
                {
                    "text": "<p>Open the <strong>Output Log</strong> to check for new warnings.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While checking logs is good practice, it's not the immediate next step after making changes and saving; testing in-game is the priority.</p>",
                    "next": "step-22"
                },
                {
                    "text": "<p>Start a new editor window to avoid potential conflicts.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. This is unnecessary. Editor conflicts are generally not an issue when dealing with single Blueprint modifications and proper saving.</p>",
                    "next": "step-22"
                }
            ]
        },
        "step-23": {
            "skill": "blueprintslogic",
            "title": "Perform Final Test in PIE",
            "prompt": "<p>Back in <strong>Level Editor</strong>. What's the final step to confirm the fix?</p>",
            "choices": [
                {
                    "text": "<p>Run a <strong>Play In Editor (PIE)</strong> session and test the overlap, confirming the player receives the speed buff *before* the item despawns.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.07hrs. This is the crucial final validation step to ensure the buff is applied correctly and the pickup despawns at the appropriate time.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Use the <strong>Console</strong> command <code>stat game</code> to check the game's performance metrics.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While performance is important, it's not the primary check for *functional correctness* of the buff application logic.</p>",
                    "next": "step-23"
                },
                {
                    "text": "<p>Re-examine the <strong>BP_SpeedBoost</strong> Blueprint to look for any overlooked details.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. You've already made and saved the changes. The next step is to test them, not to second-guess the blueprint without new information.</p>",
                    "next": "step-23"
                },
                {
                    "text": "<p>Create a dedicated <strong>Unit Test</strong> Blueprint to programmatically verify the speed change.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While automated testing is valuable, for a quick bug fix, a direct manual test in PIE is faster and sufficient to confirm the fix.</p>",
                    "next": "step-23"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario. The <strong>BP_SpeedBoost</strong> now correctly applies the speed buff before despawning, providing the intended player experience.</p>",
            "choices": [{"text": "Complete Scenario", "type": "correct", "feedback": "", "next": "end"}]
        }
    }
};
