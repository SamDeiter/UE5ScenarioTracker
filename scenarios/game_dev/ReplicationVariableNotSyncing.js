window.SCENARIOS["ReplicationVariableNotSyncing"] = {
  meta: {
    title: "Replicated Variable Not Syncing to Clients in Multiplayer",
    description:
      "A health variable marked as replicated shows correct values on the server but always displays the wrong value on client machines, causing gameplay desync.",
    estimateHours: 1.5,
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
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. If other features work in multiplayer, network mode is correct. The issue is variable-specific.",
          next: "step-1",
        },
        {
          text: "Increase the <code>Net Update Frequency</code> on the character to force faster syncing.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Update frequency affects how often replication happens, not whether a variable replicates at all.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "blueprints",
      title: "Checking Replication Settings",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-2.png",
      prompt:
        "<p>The <code>Health</code> variable is set to <code>Replicated</code>. However, you notice the value is being modified on both server and client when damage occurs.</p><p><strong>What is the likely cause of the desync?</strong></p>",
      choices: [
        {
          text: "Health is being modified on the client, which overwrites the replicated value from the server. Only the server should modify replicated variables.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Clients should never directly modify replicated variables—it creates conflicts with server authority.",
          next: "step-3",
        },
        {
          text: "The variable needs <code>RepNotify</code> instead of <code>Replicated</code> to trigger client-side updates.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. RepNotify adds a callback but doesn't solve the core issue of client-side modification.",
          next: "step-2",
        },
        {
          text: "The <code>Net Priority</code> setting is too low, causing health updates to be deprioritized.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Priority affects which updates send first when bandwidth is limited, not correctness of values.",
          next: "step-2",
        },
        {
          text: "The Replication Condition should be set to <code>Initial Only</code> for performance.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Initial Only would make the problem worse—health needs continuous replication as it changes.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "blueprints",
      title: "Implementing Server Authority",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-3.png",
      prompt:
        "<p>You need to ensure only the server modifies the <code>Health</code> variable. How do you implement proper server-authoritative health modification?</p><p><strong>What is the correct approach?</strong></p>",
      choices: [
        {
          text: "Wrap health modification logic in a <code>Switch Has Authority</code> node and only execute on the <code>Authority</code> branch (server).",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Authority checks ensure only the server (which has authority over the actor) modifies the variable.",
          next: "step-4",
        },
        {
          text: "Use a <code>Run on Server</code> custom event for all health changes, called from any machine.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Server RPCs work but Switch Has Authority is simpler for authoritative logic already running on the server.",
          next: "step-4",
        },
        {
          text: "Check <code>Is Locally Controlled</code> before modifying health to ensure the local player owns the character.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Local control determines input authority, not which machine should modify replicated gameplay data.",
          next: "step-3",
        },
        {
          text: "Set the variable's <code>Replication Condition</code> to <code>Owner Only</code> to restrict who can change it.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Replication Conditions affect who receives updates, not who can modify the variable.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "blueprints",
      title: "Adding RepNotify for UI Updates",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-4.png",
      prompt:
        "<p>Health now only changes on the server. However, the client's health bar UI doesn't update when the replicated value arrives. How do you trigger UI updates on clients?</p><p><strong>What is the proper implementation?</strong></p>",
      choices: [
        {
          text: "Change the variable from <code>Replicated</code> to <code>RepNotify</code> and implement the <code>OnRep_Health</code> function to update the UI widget.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. RepNotify creates a callback function that fires on clients when the replicated value changes, perfect for UI updates.",
          next: "step-5",
        },
        {
          text: "Bind the health bar widget directly to the Health variable using property binding.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Property binding polls the value each frame, which works but is less efficient than event-driven RepNotify.",
          next: "step-4",
        },
        {
          text: "Create a separate <code>Multicast</code> RPC that broadcasts health changes to all clients.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Multicast duplicates the work replication already does. RepNotify is built for this exact purpose.",
          next: "step-4",
        },
        {
          text: "Call the UI update function on <code>Tick</code> to constantly poll the health value.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Tick-based polling is wasteful. Event-driven updates via RepNotify are more efficient.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "blueprints",
      title: "Handling Edge Cases",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-5.png",
      prompt:
        "<p>RepNotify works for runtime changes. However, clients joining mid-game don't see the correct initial health because OnRep only fires on changes.</p><p><strong>How do you handle late-joining clients?</strong></p>",
      choices: [
        {
          text: "In the character's <code>BeginPlay</code>, check <code>Is Locally Controlled</code> and call the UI update logic directly to initialize with the current replicated value.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. BeginPlay runs after replication initializes the variable, allowing you to set up UI with the correct value.",
          next: "step-6",
        },
        {
          text: "Force OnRep to fire on spawn by setting the variable's <code>Initial Replication</code> flag.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Initial replication ensures the value arrives, but OnRep may not fire if the value matches defaults.",
          next: "step-5",
        },
        {
          text: "Store health in a <code>Game State</code> variable that's always available to all clients.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Per-player health belongs on the character, not Game State. BeginPlay initialization is cleaner.",
          next: "step-5",
        },
        {
          text: "Have the server send a dedicated RPC to each client when they join with current health values.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Manual RPCs for initial state are unnecessary—replication handles this. Just initialize UI in BeginPlay.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "blueprints",
      title: "Verification",
      image_path: "assets/generated/ReplicationVariableNotSyncing/step-6.png",
      prompt:
        "<p>You've implemented server authority, RepNotify, and BeginPlay initialization. How do you thoroughly verify replication works?</p><p><strong>What is the most comprehensive test?</strong></p>",
      choices: [
        {
          text: "Use <strong>Play</strong> with <code>Number of Players: 3</code> as a <code>Listen Server</code>, damage players on different machines, and verify all clients show correct health including late joiners.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. Multi-client testing with simulated joins verifies replication, RepNotify, and late-join handling all work correctly.",
          next: "conclusion",
        },
        {
          text: "Test with 2 players and check that damage applied on the server shows on the client.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Basic testing is a start, but doesn't verify late-join scenarios or multiple simultaneous clients.",
          next: "step-6",
        },
        {
          text: "Use <code>stat net</code> to verify replication packets are being sent for the Health variable.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Network stats show traffic but not correctness of values. Gameplay verification is more reliable.",
          next: "step-6",
        },
        {
          text: "Review the <strong>Blueprint Debugger</strong> while playing to trace variable value changes.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Blueprint debugger helps with logic flow, but multi-client value verification requires actual networked testing.",
          next: "step-6",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/ReplicationVariableNotSyncing/conclusion.png",
      prompt:
        "<p><strong>Outstanding work!</strong></p><p>You've resolved the multiplayer replication synchronization issue.</p><h4>Key Takeaways:</h4><ul><li><code>Switch Has Authority</code> — Ensures only the server modifies replicated variables</li><li><code>RepNotify</code> — Fires callback on clients when replicated value changes</li><li><strong>Server Authority</strong> — Clients should never directly modify replicated gameplay variables</li><li><code>BeginPlay</code> — Use to initialize UI with replicated values for late-joining clients</li></ul>",
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
