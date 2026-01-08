window.SCENARIOS['MultiplayerDoorNotOpening'] = {
    meta: {
        expanded: true,
        title: "Door Not Opening for Clients",
        description: "Door opens for server but not clients. Investigates Replication, RepNotify, and Server RPCs.",
        estimateHours: 1.5,
        category: "Blueprints"
    },
    start: "step-0",
    steps: {
        'step-1': {
            skill: 'blueprints',
            title: 'The Symptom',
            prompt: "The door opens when the server walks into the trigger, but clients see nothing. Door logic is probably not replicating. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You enable network view modes / logs and see the door only changes state on the server. Clients never see the variable change.",
                    next: 'step-inv-1'
                },
                {
                    text: "Wrong Guess]",
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
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You roll back the bad changes and go back to investigating replication.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-2': {
            skill: 'blueprints',
            title: 'Investigation',
            prompt: "You inspect the Blueprint. The door's Open/Close logic runs from a trigger overlap, but clients don't see it. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You find the issue: the IsOpen (DoorState) variable isn't replicated, and the overlap event is not using a Run on Server RPC. The door only updates on the server.",
                    next: 'step-3'
                },
                {
                    text: "Misguided Attempt]",
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
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the door needs an authoritative replicated state instead of client-only animation and return to the real fix.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'blueprints',
            title: 'The Fix',
            prompt: "You know the cause: the door state isn't replicated and the trigger isn't calling the server. How do you fix it?",
            choices: [
                {
                    text: "Use RepNotify variable for door state.]",
                    type: 'correct',
                    feedback: "You set IsOpen to Replicated (RepNotify), move the door movement into OnRep_IsOpen, and call a Run on Server event from the trigger to toggle IsOpen. Now all clients see the door open and close correctly.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'blueprints',
            title: 'Verification',
            prompt: "You verify the fix in a multiplayer PIE session: server and client both enter the trigger and observe the door. What happens?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE with multiple players, both server and clients see the door open and close in sync when IsOpen changes via the server RPC. The replication flow works as intended.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'blueprints',
            title: 'Initial Network Debugging',
            prompt: "The door isn't opening for clients. Before diving into the Blueprint, let's confirm the network state. What's the first thing you'd check in-editor to see if the door actor itself is replicating or if any network events are happening?",
            choices: [
                {
                    text: "Use 'ShowDebug Net' or 'Net Load on Client' view modes]",
                    type: 'correct',
                    feedback: "You enable 'ShowDebug Net' and observe the door actor. On the client, you notice the door actor's replication status, but no variable changes are being reported, or perhaps the actor isn't even considered relevant for replication to the client in some cases. This confirms a network issue.",
                    next: 'step-inv-2'
                },
                {
                    text: "Check collision settings]",
                    type: 'wrong',
                    feedback: "While collision is important, the door works for the server, indicating collision isn't the primary network issue here. Focus on replication.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'blueprints',
            title: 'Dead End: Non-Network Focus',
            prompt: "You're still chasing non-network issues. Remember, the core problem is clients don't see the door open, but the server does. This points to replication.",
            choices: [
                {
                    text: "Re-focus on network debugging]",
                    type: 'correct',
                    feedback: "You realize the need to use network-specific debugging tools.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'blueprints',
            title: 'Variable Replication Status',
            prompt: "You've confirmed the actor is present on the client, but its state isn't updating. The door's open/close state is likely controlled by a variable (e.g., 'IsOpen'). How do you check if this specific variable is set to replicate and if its value is actually changing on the client?",
            choices: [
                {
                    text: "Use 'Net Property' view mode or 'obj dump' console command]",
                    type: 'correct',
                    feedback: "You use the 'Net Property' view mode in PIE (or 'obj dump' in console) and inspect the door's 'IsOpen' variable. You confirm it's either not marked for replication, or if it is, its value isn't changing on the client when the server opens the door. This is a strong indicator of the problem.",
                    next: 'step-inv-3'
                },
                {
                    text: "Add print strings to the door animation]",
                    type: 'wrong',
                    feedback: "Print strings will only show local execution. You need to see the *replicated* state, not just local animation calls.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'blueprints',
            title: 'Dead End: Local Debugging',
            prompt: "Print strings are useful, but they don't tell you about the network state. You need to see if the variable itself is replicating, not just if a local event is firing.",
            choices: [
                {
                    text: "Return to network property inspection]",
                    type: 'correct',
                    feedback: "You go back to checking the variable's replication status.",
                    next: 'step-inv-3'
                },
            ]
        },

        'step-inv-3': {
            skill: 'blueprints',
            title: 'RPC Call Investigation',
            prompt: "You know the 'IsOpen' variable isn't replicating correctly or isn't being set on the server in a way that triggers replication. The door's logic starts from an 'OnComponentBeginOverlap' event. What's the next logical step to ensure the server is correctly processing this event and initiating the state change?",
            choices: [
                {
                    text: "Check if the overlap event calls a 'Run on Server' RPC]",
                    type: 'correct',
                    feedback: "You inspect the Blueprint and find that the 'OnComponentBeginOverlap' event directly sets 'IsOpen' without first calling a 'Run on Server' RPC. This means only the server's local 'IsOpen' variable is changed, and clients never see it. This is the core issue.",
                    next: 'step-inv-1'
                },
                {
                    text: "Try to make the overlap event directly call a 'Multicast' RPC]",
                    type: 'misguided',
                    feedback: "You attempt to call a Multicast RPC directly from the client's overlap event. While Multicast RPCs execute on all clients, they must be called from the server to be authoritative. This approach won't work reliably and can lead to desyncs if a client tries to open the door.",
                    next: 'step-red-herring-1'
                },
            ]
        },

        'step-red-herring-1': {
            skill: 'blueprints',
            title: 'Red Herring: Client-Driven Multicast',
            prompt: "You tried to use a Multicast RPC directly from the client's overlap event. Why is this problematic, and what's the correct approach for client-initiated actions that need to affect all players?",
            choices: [
                {
                    text: "Realize Multicast must be called from Server]",
                    type: 'correct',
                    feedback: "You correctly identify that Multicast RPCs must be called from the server to ensure authority and consistency. A client should always request the server to perform an action (via a 'Run on Server' RPC), and then the server can update replicated variables or call Multicast RPCs if necessary.",
                    next: 'step-inv-1'
                },
                {
                    text: "Add more Multicast calls]",
                    type: 'wrong',
                    feedback: "Adding more client-driven Multicast calls will only exacerbate the problem, leading to more desynchronization and potential exploits. You need server authority.",
                    next: 'step-red-herring-1W'
                },
            ]
        },

        'step-red-herring-1W': {
            skill: 'blueprints',
            title: 'Dead End: Doubling Down on Wrong',
            prompt: "You're still trying to force client-driven Multicast. This is fundamentally insecure and unreliable in a multiplayer environment. The server must be the authority.",
            choices: [
                {
                    text: "Revert and understand server authority]",
                    type: 'correct',
                    feedback: "You revert your changes and commit to understanding the server-client model for RPCs and replication.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'blueprints',
            title: 'Verification - Standalone Game Test',
            prompt: "The door works in PIE. To ensure the fix holds up in a deployed environment, what's the next crucial verification step, especially for network features?",
            choices: [
                {
                    text: "Launch as Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the game as a 'Standalone Game' (or packaged build) with multiple instances. You confirm that the door opens and closes correctly and in sync for all players, just as it did in PIE. This catches potential PIE-specific behaviors.",
                    next: 'step-ver-2'
                },
                {
                    text: "Only test with one client]",
                    type: 'wrong',
                    feedback: "Testing with only one client might miss edge cases or replication issues that only manifest with multiple players or different network conditions.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'blueprints',
            title: 'Dead End: Incomplete Test',
            prompt: "Testing with only one client isn't sufficient for multiplayer features. You need to simulate a real multiplayer environment.",
            choices: [
                {
                    text: "Test with multiple standalone clients]",
                    type: 'correct',
                    feedback: "You launch multiple standalone clients to properly verify the multiplayer functionality.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'blueprints',
            title: 'Verification - Late Join & Stress Test',
            prompt: "The door works for players who start together. What about players who join an ongoing game, or if the door is rapidly opened and closed? What additional tests would you perform?",
            choices: [
                {
                    text: "Test late joining and rapid interaction]",
                    type: 'correct',
                    feedback: "You test by having a client join a game where the door is already open/closed, ensuring the 'OnRep_IsOpen' fires correctly for the new client. You also rapidly open and close the door with multiple players to ensure no desyncs or performance issues arise, potentially using 'stat net' to monitor bandwidth.",
                    next: 'step-ver-1'
                },
                {
                    text: "Refactor the door animation]",
                    type: 'wrong',
                    feedback: "Refactoring the animation is a visual improvement, not a network verification step. The goal is to confirm the replication logic is robust.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'blueprints',
            title: 'Dead End: Premature Optimization',
            prompt: "You're focusing on non-critical improvements before fully verifying the core network functionality. Complete the verification first.",
            choices: [
                {
                    text: "Return to network verification]",
                    type: 'correct',
                    feedback: "You refocus on ensuring the network logic is robust under various conditions.",
                    next: 'step-ver-1'
                },
            ]
        },

        
        'step-0': {
            skill: 'blueprints',
            title: 'Initial Network Visualization',
            prompt: "Before diving into the Blueprint, you want to visually confirm the network state. What's the quickest way to see if the door actor itself is replicating or if its properties are changing on clients?",
            choices: [
                {
                    text: "Enable Replication Info View Mode]",
                    type: 'correct',
                    feedback: "You enable 'Show -> Advanced -> Networking -> Replication Info' and see the door actor has a 'Net Role: Authority' on the server, but 'Net Role: Simulated Proxy' on clients. Crucially, you notice no 'Replicated Properties' changing on the client's view when the server opens the door.",
                    next: 'step-0'
                },
                {
                    text: "Check collision settings]",
                    type: 'wrong',
                    feedback: "While collision is important, this is a network issue. Checking collision won't show you replication status.",
                    next: 'step-0W'
                },
            ]
        },

        'step-0W': {
            skill: 'blueprints',
            title: 'Dead End: Wrong Visualization',
            prompt: "You're still not seeing the network state. You need to focus on network debugging tools.",
            choices: [
                {
                    text: "Revert and try network view modes]",
                    type: 'correct',
                    feedback: "You refocus on network visualization.",
                    next: 'step-0'
                },
            ]
        },

        'step-1.5': {
            skill: 'blueprints',
            title: 'Deeper Replication Property Inspection',
            prompt: "You've confirmed the door actor is present on clients as a simulated proxy, but its state isn't updating. You suspect a specific variable isn't replicating. How can you inspect the replicated properties of the door actor at runtime?",
            choices: [
                {
                    text: "Use `net.RepGraph.PrintRepLayout` or `obj dump` console commands]",
                    type: 'correct',
                    feedback: "You use `net.RepGraph.PrintRepLayout <DoorActorName>` and `obj dump <DoorActorName>` in the console. You confirm that your `IsOpen` boolean variable is NOT listed as a replicated property, or if it is, it's not marked as `RepNotify`.",
                    next: 'step-2'
                },
                {
                    text: "Check the door's material settings]",
                    type: 'wrong',
                    feedback: "Material settings are purely visual and local. This won't tell you anything about network replication.",
                    next: 'step-1.5W'
                },
            ]
        },

        'step-1.5W': {
            skill: 'blueprints',
            title: 'Dead End: Irrelevant Inspection',
            prompt: "You're still not getting to the root of the network problem. You need to inspect the *network properties* of the actor.",
            choices: [
                {
                    text: "Re-evaluate and use network console commands]",
                    type: 'correct',
                    feedback: "You refocus on network property inspection.",
                    next: 'step-2'
                },
            ]
        },

        'step-2RH': {
            skill: 'blueprints',
            title: 'Dead End: Multicast RPC Misuse (Red Herring)',
            prompt: "Instead of a RepNotify variable, you decide to try a 'Multicast' RPC to play the door animation directly. It works for clients present at the time, but new clients joining later see the door in its initial state (closed), and packet loss can cause desyncs. Why is this not the correct approach for persistent state?",
            choices: [
                {
                    text: "Realize Multicast RPCs are for transient events, not persistent state]",
                    type: 'correct',
                    feedback: "You understand that Multicast RPCs are fire-and-forget. For a persistent state like 'door open/closed', a replicated variable is needed to ensure all clients, including late joiners, have the correct state.",
                    next: 'step-3'
                },
            ]
        },

        'step-5': {
            skill: 'blueprints',
            title: 'Verification - Dedicated Server & Late Join',
            prompt: "The PIE test was successful. To ensure robustness, you deploy to a dedicated server and test with multiple clients, including one that joins *after* the door has been opened by another player. What do you observe?",
            choices: [
                {
                    text: "Test with dedicated server and late join]",
                    type: 'correct',
                    feedback: "When a client joins the game after the door has already been opened, they correctly see the door in its open state immediately upon connecting. This confirms the RepNotify variable properly synchronizes state for late joiners.",
                    next: 'step-6'
                },
                {
                    text: "Only test with listen server]",
                    type: 'wrong',
                    feedback: "A listen server (PIE) doesn't fully simulate a dedicated server environment, especially for late join scenarios. You need a more robust test.",
                    next: 'step-5W'
                },
            ]
        },

        'step-5W': {
            skill: 'blueprints',
            title: 'Dead End: Incomplete Verification',
            prompt: "Your verification isn't thorough enough. A listen server doesn't cover all edge cases, especially late-joining clients. You need to test with a dedicated server.",
            choices: [
                {
                    text: "Re-test with dedicated server and late join]",
                    type: 'correct',
                    feedback: "You set up a dedicated server for a more complete test.",
                    next: 'step-6'
                },
            ]
        },

        'step-6': {
            skill: 'blueprints',
            title: 'Verification - Network Performance Check',
            prompt: "The door is working correctly. Now, you want to ensure the replication isn't causing unnecessary network overhead. What console command can you use to monitor network traffic related to replication?",
            choices: [
                {
                    text: "Use `stat net` or `stat net replication`]",
                    type: 'correct',
                    feedback: "You use `stat net` and `stat net replication` in the console. You observe that the `IsOpen` variable only replicates when its value changes, and the network traffic is minimal, confirming efficient replication.",
                    next: 'conclusion'
                },
                {
                    text: "Profile CPU usage with `stat unit`]",
                    type: 'wrong',
                    feedback: "While `stat unit` is useful for CPU/GPU performance, it doesn't directly show network replication overhead. You need network-specific stats.",
                    next: 'step-6W'
                },
            ]
        },

        'step-6W': {
            skill: 'blueprints',
            title: 'Dead End: Wrong Performance Metric',
            prompt: "You're looking at the wrong performance metric. You need to check network statistics, not general CPU/GPU usage.",
            choices: [
                {
                    text: "Re-evaluate and use network stat commands]",
                    type: 'correct',
                    feedback: "You refocus on network performance monitoring.",
                    next: 'conclusion'
                },
            ]
        },
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