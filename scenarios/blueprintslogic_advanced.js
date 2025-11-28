
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['VaultSequenceLockup'] = {
    meta: {
        title: "Asynchronous Sequence Failure in Vault Opening System",
        description: "When the player interacts with the Security Console (BP_Console), the vault opening sequence initiates. Audible feedback confirms the system is running (lights flash, countdown SFX begins), and the 8.0-second countdown is internally triggered. However, once the timer expires, the heavy vault door (BP_VaultDoor) remains completely shut, and the final 'Open Door' function (including animation and final SFX) never executes. The Output Log shows no runtime errors related to the failure, indicating a logic or reference breakdown across multiple actors (BP_Console, BP_SecuritySystem, BP_PowerRelay, and BP_VaultDoor).",
        difficulty: "medium",
        category: "Blueprints & Logic",
        estimate: 3.1
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "When the player interacts with the Security Console (BP_Console), the vault opening sequence initiates. Audible feedback confirms the system is running (lights flash, countdown SFX begins), and the 8.0-second countdown is internally triggered. However, once the timer expires, the heavy vault door (BP_VaultDoor) remains completely shut, and the final 'Open Door' function (including animation and final SFX) never executes. The Output Log shows no runtime errors related to the failure, indicating a logic or reference breakdown across multiple actors (BP_Console, BP_SecuritySystem, BP_PowerRelay, and BP_VaultDoor).",
        "choices": [
            {
                "text": "Adjusting the animation playback speed or blend settings within the BP_VaultDoor's timeline, assuming the animation is hanging up physically.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.75
            },
            {
                "text": "Modify the ED_SequenceStart Event Dispatcher in BP_SecuritySystem to include a new input parameter: an Object Reference of type BP_VaultDoor.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Change the Delay node in BP_PowerRelay to a reliable time that visually leads the opening (e.g., 5.0 seconds).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "In BP_SecuritySystem, update the ED_SequenceStart call site, feeding the explicit reference of the Target Vault Door (obtained via a reliable Get Actor Of Class or stored variable) into the new input pin.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "In BP_PowerRelay's binding node for ED_SequenceStart, receive the BP_VaultDoor reference from the execution payload.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "In BP_VaultDoor, confirm the binding to ED_SequenceStart is active. Trace the execution flow initiated by the binding, confirming that a Timer is successfully set for the function `HandleOpening` at an interval of 8.0 seconds.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Adjust the Delay in BP_PowerRelay from 10.0 seconds to 7.5 seconds to attempt to beat the door timer.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Trace back the initialization of `TargetVault` in BP_PowerRelay. Confirm it relies on an unreliable `Get All Actors of Class (BP_VaultDoor)` node executed during `BeginPlay`.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Inspect BP_PowerRelay (the security authorization actor) and confirm it is also bound to ED_SequenceStart.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Deleting and recreating the Timer node in BP_VaultDoor, assuming the timer handle is corrupt, without investigating the logical failure branch.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.5
            },
            {
                "text": "Identify the second root cause: The reference must be explicitly passed at runtime, not cached using an unreliable method.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Place Print String nodes after the interaction event in BP_Console and BP_SecuritySystem to confirm that the sequence successfully starts and the Event Dispatcher (ED_SequenceStart) is called.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Focusing only on the 8.0s vs 10.0s timing mismatch and failing to diagnose the underlying null reference causing the Interface message failure.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 1.5
            },
            {
                "text": "Final Test: Run the system to confirm that the explicit reference ensures reliable communication, and the fixed timing ensures authorization is granted before the door attempts to open.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Analyze the granting logic in BP_PowerRelay triggered by the dispatcher. Note the presence of a Delay node (set to 10.0 seconds) immediately preceding the Interface Message (BPI_GrantAccess) execution.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Debug the target reference used by BP_PowerRelay to send BPI_GrantAccess (the variable `TargetVault`). Confirm the variable is NULL or an invalid reference when the BPI call attempts to execute after the delay.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.3
            },
            {
                "text": "Update BP_PowerRelay's logic: Replace the usage of the unreliable `TargetVault` variable with the newly received reference pin when calling BPI_GrantAccess.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Set a Breakpoint inside BP_VaultDoor's `HandleOpening` function and observe execution. Confirm the flow fails at the initial Branch node checking the Boolean variable `bSecurityFlagReady` (which is currently False).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.3
            },
            {
                "text": "Test the system. Observe that the problem persists, or the Interface Message fails to execute its target, indicating an issue beyond simple timing.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Trying to fix the race condition by changing the door's opening function to use an Event Tick or looping function instead of a single Timer execution.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 1
            },
            {
                "text": "Identify the logic that sets `bSecurityFlagReady` to True. Trace it to the Custom Event `ReceiveSecurityGrant`, which is called externally via the BPI_GrantAccess Blueprint Interface.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Identify the first root cause: a timing race condition. The door attempts to open at 8.0 seconds, but the authorization is delayed until 10.0 seconds, leading to premature failure in the door logic.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.4
            }
        ]
    }
}
};
