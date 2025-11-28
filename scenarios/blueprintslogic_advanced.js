window.SCENARIOS['EventDispatcherRaceCondition'] = {
    meta: {
        title: "Event Dispatcher Not Firing",
        description: "Bound event never fires. Investigates initialization order (Race Condition) and binding lifecycle.",
        estimateHours: 1.5
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'blueprints',
            title: 'Step 1: The Symptom',
            prompt: "An Event Dispatcher is bound in BeginPlay, but when the other actor calls the dispatcher, your bound event never fires. You suspect the binding might be happening too late or the listener is gone. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You add Print Strings / logging around the dispatcher Bind and Broadcast calls and use Blueprint debugging. The logs show the dispatcher is broadcast very early, before the listener’s BeginPlay ever runs—and in some cases, the listener object isn’t even valid yet.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You spend time rewiring the dispatcher pins and renaming events, but the bound event still never fires. The problem clearly isn’t just a bad connection or typo in the event name.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'blueprints',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path, assuming the dispatcher graph itself was wired incorrectly. After undoing the cosmetic changes, you realize the issue is more about when and where the binding happens.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You revert the unnecessary changes and refocus on the initialization order and object lifetimes for both the broadcaster and the listener.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'blueprints',
            title: 'Step 2: Investigation',
            prompt: "You step through PIE with Blueprint debugging and watch the broadcaster and listener actors. You want to understand why the dispatcher broadcast never hits the bound event. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You see that the actor calling the dispatcher broadcasts during its BeginPlay or even Construction Script, but the listener binds to the dispatcher later—sometimes after the broadcast already happened, sometimes after the listener widget has been removed from parent and destroyed. In another case, the binding object isn’t stored as a variable at all, so it’s garbage collected. In short: the event binding happens too late or the listener doesn’t exist anymore when the dispatcher fires.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try duplicating the dispatcher, creating a second bound event, or moving logic into a different custom event. None of this changes the fact that the dispatcher is firing before anything is actually bound—or that the widget you’re binding from has already been destroyed.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'blueprints',
            title: 'Dead End: Misguided',
            prompt: "That didn’t work because you never fixed the timing or lifetime issues. If the dispatcher fires before binding, or the bound object is garbage collected / removed from parent, no amount of extra events will make it trigger.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize that the dispatcher must be bound while the listener is guaranteed to exist, and that the listener must be stored in a valid reference (not a temporary) so it isn’t garbage collected before the dispatcher fires.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'blueprints',
            title: 'Step 3: The Fix',
            prompt: "You know the cause: the listener binds too late (race condition) or gets destroyed/GC’d before the dispatcher fires. How do you fix it?",
            choices: [
                {
                    text: "Action: [Bind in GameMode or ensure correct init order.]",
                    type: 'correct',
                    feedback: "You move the binding to a central, always-present authority such as the GameMode, a persistent manager, or an actor you know is initialized first. You ensure the listener is created and stored in a UPROPERTY / variable before the dispatcher can broadcast, and you avoid binding from transient widgets that are removed and destroyed. With the initialization order fixed and a stable reference to the listener, the dispatcher now has a valid target when it fires.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'blueprints',
            title: 'Step 4: Verification',
            prompt: "You re-run the level in PIE and log the sequence: listener creation, binding, and dispatcher broadcast. How do you confirm the issue is resolved?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, the logs now show the listener being created and bound before the first dispatcher broadcast. When the broadcaster fires the dispatcher, your bound event triggers reliably—no more missing calls due to race conditions or destroyed listeners.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'blueprints',
            title: 'Conclusion',
            prompt: "Lesson: Event Dispatchers depend on correct initialization order and object lifetime. Bind from actors that are guaranteed to exist (e.g., GameMode, persistent managers), make sure listeners are created and stored before broadcasts occur, and avoid binding from transient widgets that may be removed and destroyed before the dispatcher fires.",
            choices: []
        }
    }
};