window.SCENARIOS["ReplicationVariableNotSyncing"] = {
  meta: {
    title: "Replicated Variable Not Syncing to Clients in Multiplayer",
    description:
      "A health variable marked as replicated shows correct values on the server but always displays the wrong value on client machines, causing gameplay desync.",
    estimateHours: 2.0,
    difficulty: "Advanced",
    category: "Blueprints",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "ReplicationVariableNotSyncing",
      step: "setup",
    },
  ],
  fault: {
    description:
      "Replicated variable shows different values on server vs clients",
    visual_cue: "Health bar shows wrong value on client machines",
  },
  expected: {
    description: "Variable syncs correctly across all connected clients",
    validation_action: "verify_replication",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "ReplicationVariableNotSyncing",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "blueprints",
      title: "Initial Observation",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-1.png",
      prompt:
        "<p>Your multiplayer game has a <code>Health</code> variable on the character. When a player takes damage, their health updates correctly on the server, but clients see the old value until they reconnect.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Check the variable's <strong>Replication</strong> settings in the Blueprint and verify <code>Replicated</code> or <code>RepNotify</code> is enabled.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Variables must be explicitly marked for replication. Default variables don't sync across the network.",
          next: "step-2",
        },
        {
          text: "Verify the character Blueprint has <code>Replicates</code> enabled in the <strong>Class Defaults</strong>.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Actor replication is necessary but not sufficient. Individual variables also need replication settings.",
          next: "step-1",
        },
        {
          text: "Check the <strong>Network Mode</strong> in <strong>Play</strong> settings to ensure clients are properly connected.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. If other features work in multiplayer, network mode is correct. The issue is variable-specific.",
          next: "step-1",
        },
        {
          text: "Increase the <code>Net Update Frequency</code> on the character to force faster syncing.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Update frequency affects how often replication happens, not whether a variable replicates at all.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "blueprints",
      title: "Verifying Variable Replication Flag",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-2.png",
      prompt:
        "<p>You open the character Blueprint and find the <code>Health</code> variable. It shows <code>Replicated</code> in the Details Panel. What should you check next?</p><p><strong>What could still cause the desync?</strong></p>",
      choices: [
        {
          text: "Examine where <code>Health</code> is being modified — if it's changed on clients as well as the server, that would cause conflicts.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Client-side modification of replicated variables creates race conditions with server authority.",
          next: "step-3",
        },
        {
          text: "Check if the <code>Replication Condition</code> is set correctly for continuous updates.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Conditions affect when updates send but default settings work for most cases. Check modification authority first.",
          next: "step-2",
        },
        {
          text: "Verify the Actor's <code>Net Role</code> is correctly set to <code>Authority</code> on the server.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Net Role is managed automatically by the engine. Focus on where the variable is being modified.",
          next: "step-2",
        },
        {
          text: "Enable <strong>Net Load on Client</strong> in the Actor's settings to ensure it spawns on clients.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. If the character is visible on clients, spawning works. The issue is value synchronization.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "blueprints",
      title: "Tracing Modification Points",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-3.png",
      prompt:
        "<p>You right-click the <code>Health</code> variable and select <strong>Find References</strong>. You find several <code>Set Health</code> nodes. How do you identify problematic ones?</p><p><strong>What indicates a bad modification?</strong></p>",
      choices: [
        {
          text: "Look for <code>Set Health</code> nodes that execute without an <code>Authority</code> or <code>Is Server</code> check, meaning they run on all machines.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Unguarded Set nodes execute on every machine, overwriting replicated values with local calculations.",
          next: "step-4",
        },
        {
          text: "Check if any <code>Set Health</code> nodes are inside a <code>Multicast</code> event.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Multicast events run on all clients, which would be wrong for authoritative variables, but check all Set nodes first.",
          next: "step-3",
        },
        {
          text: "Verify that <code>Set Health</code> is called after <code>BeginPlay</code> has finished.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Timing can matter, but the core issue is which machines are executing the Set node.",
          next: "step-3",
        },
        {
          text: "Count how many times <code>Set Health</code> is called per frame using a debug counter.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Call frequency isn't the issue. Focus on which network role is making the modification.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "blueprints",
      title: "Identifying the Problematic Code",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-4.png",
      prompt:
        "<p>You find a <code>Set Health</code> node in the <code>TakeDamage</code> event that runs on all machines. It subtracts damage and sets the new health value.</p><p><strong>Why is this causing desync?</strong></p>",
      choices: [
        {
          text: "The client calculates and sets its own Health value locally, which gets overwritten by (or conflicts with) the server's authoritative value, causing flickering or wrong displays.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Both machines modify the variable, creating a race condition where the client's local value fights the replicated one.",
          next: "step-5",
        },
        {
          text: "The <code>TakeDamage</code> event isn't marked as <code>Reliable</code>, so some calls are being dropped.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Reliability affects RPC delivery, but the problem is both machines independently modifying the same variable.",
          next: "step-4",
        },
        {
          text: "The damage calculation uses floating point math that produces slightly different results on each machine.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Float precision can cause issues, but the main problem is dual modification, not calculation differences.",
          next: "step-4",
        },
        {
          text: "The event is triggering twice — once from local input and once from replication.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Double triggering would cause extra damage, not wrong values. The issue is authority, not call count.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "blueprints",
      title: "Implementing Authority Check",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-5.png",
      prompt:
        "<p>You need to ensure only the server modifies <code>Health</code>. What is the correct way to implement this in Blueprint?</p><p><strong>What node should you use?</strong></p>",
      choices: [
        {
          text: "Add a <code>Switch Has Authority</code> node before the <code>Set Health</code> and only connect the <code>Authority</code> execution pin to the modification logic.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Switch Has Authority separates server (Authority) from client (Remote) execution paths cleanly.",
          next: "step-6",
        },
        {
          text: "Use <code>Is Server</code> node and branch based on the boolean result.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Is Server works but Switch Has Authority is more explicit about network role separation.",
          next: "step-6",
        },
        {
          text: "Check <code>Is Locally Controlled</code> to see if this is the owning player's character.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Local control is about input authority, not gameplay data authority. Servers should control health.",
          next: "step-5",
        },
        {
          text: "Wrap the logic in a <code>Run on Server</code> custom event instead.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Server RPCs work for remote requests, but if the event already runs on the server, an authority check is simpler.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "blueprints",
      title: "Handling Damage Requests from Clients",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-6.png",
      prompt:
        "<p>Now only the server modifies Health. But what if a client needs to request damage be applied (e.g., from a client-side hit detection)?</p><p><strong>How should clients communicate damage to the server?</strong></p>",
      choices: [
        {
          text: "Create a <code>Server RPC</code> (Run on Server) function that clients call to request damage, which the server validates and applies.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Server RPCs let clients request actions while the server maintains authority over the actual data change.",
          next: "step-7",
        },
        {
          text: "Use a <code>Multicast RPC</code> to broadcast damage to all machines simultaneously.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Multicast runs on all clients including the server, still causing dual modification. Use Server RPC.",
          next: "step-6",
        },
        {
          text: "Have the client set a <code>Pending Damage</code> replicated variable that the server reads and applies.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. This inverts authority — clients shouldn't write to replicated variables either. Use Server RPC.",
          next: "step-6",
        },
        {
          text: "Let the client apply damage locally and trust the server will eventually sync the correct value.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Trusting eventual consistency causes visible desync. Server RPCs provide immediate, authoritative handling.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "blueprints",
      title: "Server RPC Validation",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-7.png",
      prompt:
        "<p>You've created a <code>Server_ApplyDamage</code> RPC. The server receives damage requests from clients. What's important about processing these requests?</p><p><strong>What should the server do before applying damage?</strong></p>",
      choices: [
        {
          text: "Validate the damage request for cheating — check if the damage amount is reasonable, the source is valid, and the target can be damaged.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Server validation prevents clients from sending malicious damage values. Never trust client data unconditionally.",
          next: "step-8",
        },
        {
          text: "Apply the damage immediately to ensure responsiveness for the requesting client.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Immediate application without validation is a security risk. Always validate client requests.",
          next: "step-7",
        },
        {
          text: "Log the damage request for debugging purposes before processing.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Logging is useful but not the critical step. Validation is essential for multiplayer security.",
          next: "step-7",
        },
        {
          text: "Queue the damage request to be processed on the next tick to batch multiple hits.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Batching can help performance but validation is the priority. Process and validate each request.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "blueprints",
      title: "Adding RepNotify for UI",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-8.png",
      prompt:
        "<p>Health now only changes on the server and replicates to clients. However, the client's health bar UI doesn't update when the value arrives.</p><p><strong>How do you trigger UI updates on clients?</strong></p>",
      choices: [
        {
          text: "Change the variable from <code>Replicated</code> to <code>RepNotify</code> and implement <code>OnRep_Health</code> to update the UI widget.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. RepNotify creates a callback that fires on clients when the value changes, triggering UI refresh.",
          next: "step-9",
        },
        {
          text: "Bind the health bar progress directly to the Health variable using widget property binding.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Property binding polls every frame, which works but is less efficient than event-driven RepNotify.",
          next: "step-8",
        },
        {
          text: "Send a separate <code>Multicast RPC</code> to tell all clients to update their UI when health changes.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Multicast duplicates what replication already provides. RepNotify is the built-in solution.",
          next: "step-8",
        },
        {
          text: "Check health value in the UI widget's <code>Tick</code> event and update if it differs from the displayed value.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Tick-based polling works but is wasteful. RepNotify provides efficient event-driven updates.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "blueprints",
      title: "Implementing OnRep_Health",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-9.png",
      prompt:
        "<p>You've set the variable to <code>RepNotify</code>. UE5 generates an <code>OnRep_Health</code> function stub. What should you implement inside it?</p><p><strong>What logic belongs in the OnRep function?</strong></p>",
      choices: [
        {
          text: "Call a function that updates the health bar widget's displayed value and plays any damage/heal feedback effects.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. OnRep should handle client-side presentation — UI updates and visual/audio feedback.",
          next: "step-10",
        },
        {
          text: "Recalculate secondary values like <code>HealthPercent</code> based on the new Health value.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Derived values can be calculated, but the primary purpose is presentation updates like UI.",
          next: "step-9",
        },
        {
          text: "Apply gameplay logic like checking if the player should die when health reaches zero.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Death logic should run on the server (in the Set logic), not in the client callback.",
          next: "step-9",
        },
        {
          text: "Log the old and new values for debugging replication timing issues.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Logging is fine for debugging but not the primary implementation. Focus on UI updates.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "blueprints",
      title: "Handling Late-Joining Clients",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-10.png",
      prompt:
        "<p>RepNotify works for runtime changes. However, clients joining mid-game don't see correct initial health because <code>OnRep</code> only fires on value <em>changes</em>.</p><p><strong>How do you handle late-joiners?</strong></p>",
      choices: [
        {
          text: "In the character's <code>BeginPlay</code>, manually call the same UI update function to initialize the display with the current replicated <code>Health</code> value.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. BeginPlay runs after initial replication, so the value is available. Initialize UI there for joining clients.",
          next: "step-11",
        },
        {
          text: "Set an <code>Always Replicate</code> flag to force OnRep to fire even when the value matches default.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no always-replicate flag. BeginPlay initialization is the standard approach.",
          next: "step-10",
        },
        {
          text: "Have the server send a dedicated RPC with all current variable values when a client joins.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Manual state RPCs duplicate what replication provides. Just initialize in BeginPlay.",
          next: "step-10",
        },
        {
          text: "Force Health to a temporary value then set it back to trigger OnRep artificially.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Hacky value toggling is unreliable. Proper BeginPlay initialization is cleaner.",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "blueprints",
      title: "Testing Local Prediction",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-11.png",
      prompt:
        "<p>The system works, but players complain of visible latency — they see their own health update delayed. How can you provide responsive feedback for the local player?</p><p><strong>What pattern improves perceived responsiveness?</strong></p>",
      choices: [
        {
          text: "Implement <strong>client-side prediction</strong>: show local estimated health immediately, then correct when the server's authoritative value arrives via replication.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. Prediction shows immediate feedback. When the server value arrives, it corrects any difference smoothly.",
          next: "step-12",
        },
        {
          text: "Decrease the character's <code>Net Update Frequency</code> to make updates arrive faster.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Lower frequency means <em>slower</em> updates. And frequency affects bandwidth, not latency.",
          next: "step-11",
        },
        {
          text: "Apply damage on the client immediately and let replication fix any discrepancies later.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. This is prediction, but without structured correction. Proper prediction handles server corrections gracefully.",
          next: "step-11",
        },
        {
          text: "Use a <code>Reliable</code> RPC to ensure damage notifications arrive without packet loss.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Reliability prevents packet loss but doesn't reduce latency. Prediction addresses perceived delay.",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "blueprints",
      title: "Implementing Prediction",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-12.png",
      prompt:
        "<p>You decide to add prediction for the local player. How do you implement this without breaking server authority?</p><p><strong>What is the correct implementation?</strong></p>",
      choices: [
        {
          text: "Create a separate <code>PredictedHealth</code> local variable for UI display. Update it immediately on damage, then sync it with the replicated <code>Health</code> in <code>OnRep_Health</code>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. A local prediction variable provides immediate feedback while OnRep corrects it to match server truth.",
          next: "step-13",
        },
        {
          text: "Update the replicated <code>Health</code> directly on the client for immediate visual feedback.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Modifying replicated variables on clients is exactly the bug we fixed. Use a separate local variable.",
          next: "step-12",
        },
        {
          text: "Delay the UI update slightly so the server value has time to arrive before displaying.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Adding delay makes responsiveness <em>worse</em>. Prediction is about showing results before server confirms.",
          next: "step-12",
        },
        {
          text: "Only predict damage for the locally controlled player and trust server for other characters.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. This is correct scope, but you still need the separate variable approach. Continue with that method.",
          next: "step-13",
        },
      ],
    },
    "step-13": {
      skill: "blueprints",
      title: "Handling Prediction Mismatch",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-13.png",
      prompt:
        "<p>Sometimes the predicted value differs from the server value (e.g., client thought damage was 10, server says it was 15 due to an armor buff). How do you handle this?</p><p><strong>What should happen in OnRep when there's a mismatch?</strong></p>",
      choices: [
        {
          text: "In <code>OnRep_Health</code>, set <code>PredictedHealth</code> equal to the replicated <code>Health</code> value, correcting any prediction errors. Optionally smooth the transition visually.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. OnRep provides the authoritative value. Overwriting prediction ensures clients converge to server truth.",
          next: "step-14",
        },
        {
          text: "Ignore small differences (within 5%) and only correct large discrepancies to avoid visual jitter.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Thresholds can reduce jitter, but always eventually correct to server truth. Small errors compound over time.",
          next: "step-13",
        },
        {
          text: "Log the mismatch as an error since prediction should always match the server.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Mismatches are normal due to different information. They're not errors, just predictions being corrected.",
          next: "step-13",
        },
        {
          text: "Request the server resend the health value if there's a mismatch to ensure synchronization.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. OnRep already has the authoritative value. No resend is needed — just apply it.",
          next: "step-13",
        },
      ],
    },
    "step-14": {
      skill: "blueprints",
      title: "Testing Multi-Client Scenarios",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-14.png",
      prompt:
        "<p>The implementation is complete. How do you thoroughly test the replication system before shipping?</p><p><strong>What test scenarios should you run?</strong></p>",
      choices: [
        {
          text: "Test with 3+ players as a <strong>Listen Server</strong>: verify damage on all characters syncs correctly, late-joining clients see correct health, and prediction feels responsive for the local player.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. Multi-client testing covers server authority, replication, late-join, and prediction in realistic conditions.",
          next: "step-15",
        },
        {
          text: "Test with 2 players to verify basic replication works between server and one client.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Two-player testing is a start but doesn't catch edge cases with multiple clients or late joins.",
          next: "step-14",
        },
        {
          text: "Run automated Blueprint unit tests on the damage functions.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Unit tests verify logic but can't test actual network replication. Manual multiplayer testing is required.",
          next: "step-14",
        },
        {
          text: "Use <code>stat net</code> to verify replication packets are being sent for the Health variable.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Network stats show traffic exists but not value correctness. Gameplay verification is needed.",
          next: "step-14",
        },
      ],
    },
    "step-15": {
      skill: "blueprints",
      title: "Final Verification",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-15.png",
      prompt:
        "<p>All local tests pass. What's the final verification step before considering the replication system complete?</p><p><strong>What else should you test?</strong></p>",
      choices: [
        {
          text: "Test over an actual network (or simulate latency with <code>Net PktLag</code>) to verify the system handles real-world conditions including packet delay and loss.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Network simulation reveals issues hidden by LAN speeds. PktLag and PktLoss test resilience.",
          next: "conclusion",
        },
        {
          text: "Review the code one more time for any remaining client-side modifications.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Code review is valuable but network condition testing reveals runtime issues code review can't.",
          next: "step-15",
        },
        {
          text: "Package the game and test on separate physical machines.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Physical separation works but the Lag console command is faster for simulating network conditions.",
          next: "step-15",
        },
        {
          text: "Document the replication architecture for other team members.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Documentation is important but comes after verification. Test network conditions first.",
          next: "step-15",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/ReplicationVariableNotSyncing/conclusion.png",
      prompt:
        "<p><strong>Outstanding work!</strong></p><p>You've resolved the multiplayer replication synchronization issue and implemented a robust, predictive health system.</p><h4>Key Takeaways:</h4><ul><li><strong>Server Authority</strong> — Only the server should modify replicated gameplay variables</li><li><code>Switch Has Authority</code> — Separates server (Authority) and client (Remote) execution</li><li><code>Server RPC</code> — Allows clients to request actions that the server validates and executes</li><li><code>RepNotify</code> — Fires callback on clients when replicated value changes, perfect for UI updates</li><li><code>BeginPlay</code> — Initialize UI with replicated values for late-joining clients</li><li><strong>Client Prediction</strong> — Use a local variable for immediate feedback, corrected by OnRep</li><li><code>Net PktLag</code> — Console command to simulate network latency for testing</li></ul>",
      choices: [
        {
          text: "Complete Scenario",
          type: "correct",
          feedback: "",
          next: "end",
        },
      ],
    },
  },
};
