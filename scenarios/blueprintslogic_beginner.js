
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['DestroyActorStopsExecutionFlow'] = {
    meta: {
        title: "Pickup Despawns Prematurely, Preventing Buff Application",
        description: "A PowerUp pickup (BP_SpeedBoost) is designed to grant the player a temporary speed increase upon overlap and then destroy itself. When testing, the player overlaps the item, and the item immediately vanishes. However, the player's movement speed never changes. Debugging shows the initial 'On Component Begin Overlap' event fires successfully, and the character reference is valid right before the logic path splits, but the 'Set Max Walk Speed' node is never reached or executed.",
        difficulty: "medium",
        category: "Blueprints & Logic",
        estimate: 0.75
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "A PowerUp pickup (BP_SpeedBoost) is designed to grant the player a temporary speed increase upon overlap and then destroy itself. When testing, the player overlaps the item, and the item immediately vanishes. However, the player's movement speed never changes. Debugging shows the initial 'On Component Begin Overlap' event fires successfully, and the character reference is valid right before the logic path splits, but the 'Set Max Walk Speed' node is never reached or executed.",
        "choices": [
            {
                "text": "Connect the execution output pin of the 'Set Max Walk Speed' node to the start of any 'Buff Duration Management' logic (e.g., a 'Delay' node or 'Timeline').",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.06
            },
            {
                "text": "Replacing the 'Destroy Actor' node with a 'Set Actor Hidden In Game' node and attempting to debug why the blueprint still isn't flowing correctly afterward.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.1
            },
            {
                "text": "Connect the final execution output pin of the Buff Duration logic (or the last node that modifies the character) to the 'Destroy Actor' node.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.07
            },
            {
                "text": "Verify the new flow: Cast -> Apply Buff -> Manage Duration -> Destroy Actor.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Adding excessive 'Print String' nodes throughout the logic path without correctly identifying that the execution flow is physically severed by the synchronous destruction call.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.15
            },
            {
                "text": "Identify that the execution pin immediately connects to a 'Sequence' node.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            },
            {
                "text": "Save the Blueprint and return to the Level Editor.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.04
            },
            {
                "text": "Observe that 'Sequence Pin 1' connects to the remainder of the logic, including 'Set Max Walk Speed' and any subsequent flow.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.04
            },
            {
                "text": "Compile the BP_SpeedBoost Blueprint.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            },
            {
                "text": "Enter the BP_SpeedBoost Blueprint and navigate to the Event Graph, focusing on the 'On Component Begin Overlap' node logic.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            },
            {
                "text": "Trace the execution flow starting from the successful 'Cast To Player Character' node.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Observe that 'Sequence Pin 0' connects directly to the 'Destroy Actor' node.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Run the PIE session and test the overlap, confirming the player receives the speed buff *before* the item successfully despawns.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.07
            },
            {
                "text": "Rewire the execution flow: Connect the successful 'Cast To Player Character' output directly to the first node of the buff application logic (e.g., 'Set Max Walk Speed').",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.06
            },
            {
                "text": "Ensure the 'Set Max Walk Speed' node uses the Player Character reference acquired from the successful cast.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Understand and articulate the problem: When 'Destroy Actor' executes, it immediately terminates the execution context of the owning blueprint, preventing any subsequent nodes in the flow (even those running on separate Sequence pins) from executing, thus failing to set the speed.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Remove the existing 'Sequence' node from the execution path.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.02
            },
            {
                "text": "Checking the Character Blueprint's 'Max Walk Speed' default value, believing the buff isn't high enough.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.15
            }
        ]
    }
}
};
