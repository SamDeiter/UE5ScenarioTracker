window.SCENARIOS['MultiplayerDoorNotOpening'] = {
    meta: {
        title: "Door Not Opening for Clients",
        description: "Door opens for server but not clients. Investigates Replication, RepNotify, and Server RPCs.",
        estimateHours: 1.5,
        category: "Blueprints"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'blueprints',
            title: 'Step 1: The Symptom',
            prompt: "The door opens when the server walks into the trigger, but clients see nothing. Door logic is probably not replicating. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You enable network view modes / logs and see the door only changes state on the server. Clients never see the variable change.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "That didn't help. The door still only opens for the server, and clients see no change.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'blueprints',
            title: 'Dead End: Wrong Guess',
            prompt: "You chased a non-network issue (like collision or mesh setup) and it didn't fix the problem. You realize this is a replication issue and need to refocus.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You roll back the bad changes and go back to investigating replication.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'blueprints',
            title: 'Step 2: Investigation',
            prompt: "You inspect the Blueprint. The door's Open/Close logic runs from a trigger overlap, but clients don't see it. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You find the issue: the IsOpen (DoorState) variable isn't replicated, and the overlap event is not using a Run on Server RPC. The door only updates on the server.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try to force the animation on the client only, but it still desyncs from the server and doesn't fix the real replication problem.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'blueprints',
            title: 'Dead End: Misguided',
            prompt: "That didn't work because you're only changing visuals locally. Without a replicated state, the server and clients disagree on whether the door is open.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the door needs an authoritative replicated state instead of client-only animation and return to the real fix.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'blueprints',
            title: 'Step 3: The Fix',
            prompt: "You know the cause: the door state isn't replicated and the trigger isn't calling the server. How do you fix it?",
            choices: [
                {
                    text: "Action: [Use RepNotify variable for door state.]",
                    type: 'correct',
                    feedback: "You set IsOpen to Replicated (RepNotify), move the door movement into OnRep_IsOpen, and call a Run on Server event from the trigger to toggle IsOpen. Now all clients see the door open and close correctly.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'blueprints',
            title: 'Step 4: Verification',
            prompt: "You verify the fix in a multiplayer PIE session: server and client both enter the trigger and observe the door. What happens?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE with multiple players, both server and clients see the door open and close in sync when IsOpen changes via the server RPC. The replication flow works as intended.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'blueprints',
            title: 'Conclusion',
            prompt: "Lesson: For multiplayer doors, drive the door visuals from a RepNotify variable (IsOpen) and change that variable only via a Run on Server event so all clients stay in sync.",
            choices: []
        }
    }
};