window.SCENARIOS["WorldPartitionActorNotLoading"] = {
  meta: {
    title: "Actor Not Loading in World Partition Streamed Cell",
    description:
      "A key gameplay actor placed in a World Partition level never appears at runtime, even when the player is standing in the cell where it should exist.",
    estimateHours: 0.75,
    difficulty: "Beginner",
    category: "Worldbuilding",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "WorldPartitionActorNotLoading",
      step: "setup",
    },
  ],
  fault: {
    description: "Actor exists in editor but never loads at runtime",
    visual_cue: "Missing actor where it should appear in the world",
  },
  expected: {
    description: "Actor loads when its cell becomes active",
    validation_action: "verify_actor_loaded",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "WorldPartitionActorNotLoading",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "worldbuilding",
      title: "Initial Observation",
      image_path: "assets/generated/WorldPartitionActorNotLoading/step-1.png",
      prompt:
        "<p>You have a <strong>Treasure Chest</strong> actor placed in your World Partition level. In the editor, it appears correctly. At runtime, even when standing exactly where the chest should be, it never loads.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Select the actor and check the <strong>Details Panel</strong> for its <code>Data Layers</code> and <code>Is Spatially Loaded</code> settings.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. World Partition streaming depends on these settings. If spatial loading is disabled or the actor is on an inactive Data Layer, it won't load.",
          next: "step-2",
        },
        {
          text: "Open <strong>World Settings</strong> and verify World Partition is enabled for the level.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. World Partition must be enabled, but if other actors load correctly, the issue is actor-specific configuration.",
          next: "step-1",
        },
        {
          text: "Check the <strong>Output Log</strong> for errors about missing asset references on the chest.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Missing asset errors would show in the editor too. The actor is visible in editor, so assets are valid.",
          next: "step-1",
        },
        {
          text: "Rebuild the <strong>HLOD</strong> for the region to ensure the actor is included in distance representations.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. HLOD affects distant representation, not whether an actor loads at close range. Streaming settings are the issue.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "worldbuilding",
      title: "Examining Actor Settings",
      image_path: "assets/generated/WorldPartitionActorNotLoading/step-2.png",
      prompt:
        "<p>You check the <strong>Details Panel</strong> and find <code>Is Spatially Loaded</code> is set to <code>False</code>. This means the actor won't stream with its grid cell.</p><p><strong>What is the correct setting for a gameplay actor that should stream normally?</strong></p>",
      choices: [
        {
          text: "Set <code>Is Spatially Loaded</code> to <code>True</code> so the actor streams based on its grid cell position.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.05hrs. Enabling spatial loading allows the World Partition system to stream the actor when its cell becomes active.",
          next: "step-3",
        },
        {
          text: "Keep <code>Is Spatially Loaded</code> as <code>False</code> but add the actor to an always-loaded Data Layer.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. This would work but means the chest loads everywhere, wasting memory. Spatial loading is appropriate for localized gameplay objects.",
          next: "step-3",
        },
        {
          text: "Enable <code>Force Loading</code> in the actor's <strong>World Partition</strong> settings category.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no <code>Force Loading</code> property. Use <code>Is Spatially Loaded</code> for standard streaming behavior.",
          next: "step-2",
        },
        {
          text: "Convert the actor to a <strong>Runtime Grid</strong> actor type for guaranteed loading.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Runtime Grid affects which partition grid handles the actor, not whether it streams. <code>Is Spatially Loaded</code> is the key setting.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "worldbuilding",
      title: "Understanding Data Layers",
      image_path: "assets/generated/WorldPartitionActorNotLoading/step-3.png",
      prompt:
        "<p>After enabling <code>Is Spatially Loaded</code>, you also notice the actor has a <code>Data Layer</code> assigned called <code>SecretContent</code>. This Data Layer is configured but not activated by default.</p><p><strong>What should you do?</strong></p>",
      choices: [
        {
          text: "Remove the actor from the <code>SecretContent</code> Data Layer, or ensure the Data Layer is activated at the appropriate time via Blueprint.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Data Layers control content groups. Actors on inactive layers won't load even with spatial loading enabled.",
          next: "step-4",
        },
        {
          text: "Set the <code>SecretContent</code> Data Layer's <code>Initial State</code> to <code>Activated</code> in <strong>World Settings</strong>.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. This works if the content should always be visible. If it's truly 'secret', you'd want Blueprint activation instead.",
          next: "step-4",
        },
        {
          text: "Delete the <code>SecretContent</code> Data Layer entirely to simplify the streaming setup.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Deleting Data Layers is destructive. Simply removing the actor from the layer or activating it is cleaner.",
          next: "step-3",
        },
        {
          text: "Create a <strong>Level Streaming Volume</strong> that overlaps the actor's position.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Level Streaming Volumes are for sub-levels, not World Partition actors. Data Layers control WP content groups.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "worldbuilding",
      title: "Verification",
      image_path: "assets/generated/WorldPartitionActorNotLoading/step-4.png",
      prompt:
        "<p>You've removed the Data Layer assignment and enabled <code>Is Spatially Loaded</code>. How do you verify the actor now loads correctly?</p><p><strong>What is the best verification approach?</strong></p>",
      choices: [
        {
          text: "Press <strong>Play in Editor</strong>, navigate to the actor's location, and use <code>wp.Runtime.ToggleDrawRuntimeCellsDetails</code> to visualize cell loading.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The WP debug visualization confirms which cells are loaded and shows the actor streaming in as you approach.",
          next: "conclusion",
        },
        {
          text: "Check the <strong>World Partition</strong> editor window to see if the actor's cell is marked as loaded.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The editor window shows design-time configuration, not runtime streaming status. Use console commands in PIE.",
          next: "step-4",
        },
        {
          text: "Open the <strong>Output Log</strong> and search for streaming-related log messages.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Runtime streaming doesn't log by default. Visual verification or debug commands are more reliable.",
          next: "step-4",
        },
        {
          text: "Package the game and test on a fresh installation to ensure no editor caching issues.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.4hrs. Packaging is excessive for this verification. PIE accurately simulates World Partition streaming.",
          next: "step-4",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/WorldPartitionActorNotLoading/conclusion.png",
      prompt:
        "<p><strong>Great job!</strong></p><p>You've resolved the World Partition streaming issue.</p><h4>Key Takeaways:</h4><ul><li><code>Is Spatially Loaded</code> — Must be <code>True</code> for actors to stream with their grid cell</li><li><code>Data Layers</code> — Control content groups; inactive layers prevent loading</li><li><code>wp.Runtime.ToggleDrawRuntimeCellsDetails</code> — Debug command to visualize cell streaming</li><li><strong>Details Panel</strong> — Primary location for actor-specific WP configuration</li></ul>",
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
