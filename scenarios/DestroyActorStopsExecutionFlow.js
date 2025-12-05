window.SCENARIOS['DestroyActorStopsExecutionFlow'] = {
    "meta": {
        "title": "Pickup Despawns Prematurely, Preventing Buff Application",
        "description": "A PowerUp pickup (BP_SpeedBoost) is designed to grant the player a temporary speed increase upon overlap and then destroy itself. When testing, the player overlaps the item, and the item immediately vanishes. However, the player's movement speed never changes. Debugging shows the initial 'On Component Begin Overlap' event fires successfully, and the character reference is valid right before the logic path splits, but the 'Set Max Walk Speed' node is never reached or executed.",
        "estimateHours": 0.75,
        "category": "Blueprints & Logic"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "blueprintslogic",
            "title": "Step 1",
            "prompt": "<p>Enter the BP_SpeedBoost Blueprint and navigate to the Event Graph, focusing on the 'On Component Begin Overlap' node logic.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Enter the BP_SpeedBoost Blueprint and navigate to the Event Graph, focusing on the 'On Component Begin Overlap' node logic.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Checking the Character Blueprint's 'Max Walk Speed' default value, believing the buff isn't high enough.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "blueprintslogic",
            "title": "Step 2",
            "prompt": "<p>Trace the execution flow starting from the successful 'Cast To Player Character' node.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Trace the execution flow starting from the successful 'Cast To Player Character' node.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Replacing the 'Destroy Actor' node with a 'Set Actor Hidden In Game' node and attempting to debug why the blueprint still isn't flowing correctly afterward.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "blueprintslogic",
            "title": "Step 3",
            "prompt": "<p>Identify that the execution pin immediately connects to a 'Sequence' node.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Identify that the execution pin immediately connects to a 'Sequence' node.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Adding excessive 'Print String' nodes throughout the logic path without correctly identifying that the execution flow is physically severed by the synchronous destruction call.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "blueprintslogic",
            "title": "Step 4",
            "prompt": "<p>Observe that 'Sequence Pin 0' connects directly to the 'Destroy Actor' node.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Observe that 'Sequence Pin 0' connects directly to the 'Destroy Actor' node.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Checking the Character Blueprint's 'Max Walk Speed' default value, believing the buff isn't high enough.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "blueprintslogic",
            "title": "Step 5",
            "prompt": "<p>Observe that 'Sequence Pin 1' connects to the remainder of the logic, including 'Set Max Walk Speed' and any subsequent flow.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Observe that 'Sequence Pin 1' connects to the remainder of the logic, including 'Set Max Walk Speed' and any subsequent flow.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.04hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Replacing the 'Destroy Actor' node with a 'Set Actor Hidden In Game' node and attempting to debug why the blueprint still isn't flowing correctly afterward.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "blueprintslogic",
            "title": "Step 6",
            "prompt": "<p>Understand and articulate the problem: When 'Destroy Actor' executes, it immediately terminates the execution context of the owning blueprint, preventing any subsequent nodes in the flow (even those running on separate Sequence pins) from executing, thus failing to set the speed.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Understand and articulate the problem: When 'Destroy Actor' executes, it immediately terminates the execution context of the owning blueprint, preventing any subsequent nodes in the flow (even those running on separate Sequence pins) from executing, thus failing to set the speed.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Adding excessive 'Print String' nodes throughout the logic path without correctly identifying that the execution flow is physically severed by the synchronous destruction call.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "blueprintslogic",
            "title": "Step 7",
            "prompt": "<p>Remove the existing 'Sequence' node from the execution path.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Remove the existing 'Sequence' node from the execution path.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.02hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Checking the Character Blueprint's 'Max Walk Speed' default value, believing the buff isn't high enough.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "blueprintslogic",
            "title": "Step 8",
            "prompt": "<p>Rewire the execution flow: Connect the successful 'Cast To Player Character' output directly to the first node of the buff application logic (e.g., 'Set Max Walk Speed').</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Rewire the execution flow: Connect the successful 'Cast To Player Character' output directly to the first node of the buff application logic (e.g., 'Set Max Walk Speed').</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.06hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Replacing the 'Destroy Actor' node with a 'Set Actor Hidden In Game' node and attempting to debug why the blueprint still isn't flowing correctly afterward.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "blueprintslogic",
            "title": "Step 9",
            "prompt": "<p>Ensure the 'Set Max Walk Speed' node uses the Player Character reference acquired from the successful cast.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Ensure the 'Set Max Walk Speed' node uses the Player Character reference acquired from the successful cast.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Adding excessive 'Print String' nodes throughout the logic path without correctly identifying that the execution flow is physically severed by the synchronous destruction call.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "blueprintslogic",
            "title": "Step 10",
            "prompt": "<p>Connect the execution output pin of the 'Set Max Walk Speed' node to the start of any 'Buff Duration Management' logic (e.g., a 'Delay' node or 'Timeline').</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Connect the execution output pin of the 'Set Max Walk Speed' node to the start of any 'Buff Duration Management' logic (e.g., a 'Delay' node or 'Timeline').</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.06hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Checking the Character Blueprint's 'Max Walk Speed' default value, believing the buff isn't high enough.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "blueprintslogic",
            "title": "Step 11",
            "prompt": "<p>Connect the final execution output pin of the Buff Duration logic (or the last node that modifies the character) to the 'Destroy Actor' node.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Connect the final execution output pin of the Buff Duration logic (or the last node that modifies the character) to the 'Destroy Actor' node.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.07hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Replacing the 'Destroy Actor' node with a 'Set Actor Hidden In Game' node and attempting to debug why the blueprint still isn't flowing correctly afterward.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "blueprintslogic",
            "title": "Step 12",
            "prompt": "<p>Verify the new flow: Cast -> Apply Buff -> Manage Duration -> Destroy Actor.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify the new flow: Cast -> Apply Buff -> Manage Duration -> Destroy Actor.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Adding excessive 'Print String' nodes throughout the logic path without correctly identifying that the execution flow is physically severed by the synchronous destruction call.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "blueprintslogic",
            "title": "Step 13",
            "prompt": "<p>Compile the BP_SpeedBoost Blueprint.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Compile the BP_SpeedBoost Blueprint.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Checking the Character Blueprint's 'Max Walk Speed' default value, believing the buff isn't high enough.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "blueprintslogic",
            "title": "Step 14",
            "prompt": "<p>Save the Blueprint and return to the Level Editor.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Save the Blueprint and return to the Level Editor.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.04hrs. Correct approach.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Replacing the 'Destroy Actor' node with a 'Set Actor Hidden In Game' node and attempting to debug why the blueprint still isn't flowing correctly afterward.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "blueprintslogic",
            "title": "Step 15",
            "prompt": "<p>Run the PIE session and test the overlap, confirming the player receives the speed buff *before* the item successfully despawns.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Run the PIE session and test the overlap, confirming the player receives the speed buff *before* the item successfully despawns.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.07hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Adding excessive 'Print String' nodes throughout the logic path without correctly identifying that the execution flow is physically severed by the synchronous destruction call.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-15"
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
