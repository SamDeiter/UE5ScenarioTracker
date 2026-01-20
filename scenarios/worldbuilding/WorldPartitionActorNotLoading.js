window.SCENARIOS["WorldPartitionActorNotLoading"] = {
  meta: {
    title: "Actor Not Loading in World Partition Streamed Cell",
    description:
      "A key gameplay actor placed in a World Partition level never appears at runtime, even when the player is standing in the cell where it should exist.",
    estimateHours: 1.0,
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
          text: "Select the actor and check the <strong>Details Panel</strong> for its <code>Is Spatially Loaded</code> and <code>Data Layers</code> settings.",
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
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Missing asset errors would show in the editor too. The actor is visible in editor, so assets are valid.",
          next: "step-1",
        },
        {
          text: "Rebuild the <strong>HLOD</strong> for the region to ensure the actor is included in distance representations.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. HLOD affects distant representation, not whether an actor loads at close range.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "worldbuilding",
      title: "Locating World Partition Settings",
      image_path: "assets/generated/WorldPartitionActorNotLoading/step-2.png",
      prompt:
        "<p>You select the Treasure Chest actor. Where in the Details Panel do you find the World Partition settings?</p><p><strong>Which category contains these settings?</strong></p>",
      choices: [
        {
          text: "Expand the <code>World Partition</code> category in the Details Panel to find streaming-related settings.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.05hrs. World Partition settings are grouped under their own category for easy access.",
          next: "step-3",
        },
        {
          text: "Look under the <code>Actor</code> category for general loading settings.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Actor has general settings but WP-specific streaming is in the World Partition category.",
          next: "step-2",
        },
        {
          text: "Check the <code>Rendering</code> category for visibility and loading options.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Rendering affects how things display, not streaming. Use World Partition category.",
          next: "step-2",
        },
        {
          text: "Use the search box and type <code>streaming</code> to find relevant settings.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Searching works, but knowing the category helps you find related settings faster.",
          next: "step-3",
        },
      ],
    },
    "step-3": {
      skill: "worldbuilding",
      title: "Understanding Is Spatially Loaded",
      image_path: "assets/generated/WorldPartitionActorNotLoading/step-3.png",
      prompt:
        "<p>You find <code>Is Spatially Loaded</code> is set to <code>False</code>. What does this setting control?</p><p><strong>What does Is Spatially Loaded mean?</strong></p>",
      choices: [
        {
          text: "When <code>True</code>, the actor streams in/out based on its grid cell position relative to the streaming source (player). When <code>False</code>, it only loads via Data Layers or always-loaded rules.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Spatial loading ties the actor to the World Partition grid. Without it, other mechanisms must load the actor.",
          next: "step-4",
        },
        {
          text: "It controls whether the actor uses spatial audio for 3D sound positioning.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Spatial audio is unrelated. This setting controls World Partition streaming behavior.",
          next: "step-3",
        },
        {
          text: "It determines if the actor's collision is enabled based on distance from the player.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Collision distance is separate. This setting controls whether the actor loads at all based on position.",
          next: "step-3",
        },
        {
          text: "It enables spatial queries like line traces to detect this actor from a distance.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Spatial queries work on loaded actors. This setting controls the loading itself.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "worldbuilding",
      title: "Enabling Spatial Loading",
      image_path: "assets/generated/WorldPartitionActorNotLoading/step-4.png",
      prompt:
        "<p>You need to enable spatial loading for this actor. What should you set <code>Is Spatially Loaded</code> to?</p><p><strong>What is the correct value?</strong></p>",
      choices: [
        {
          text: "Set <code>Is Spatially Loaded</code> to <code>True</code> so the actor streams based on its grid cell position.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.05hrs. Enabling spatial loading connects the actor to the World Partition grid system.",
          next: "step-5",
        },
        {
          text: "Keep it <code>False</code> but add the actor to an always-loaded Data Layer.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. This works but wastes memory by loading the chest everywhere. Spatial loading is more efficient.",
          next: "step-4",
        },
        {
          text: "Set it to <code>Auto</code> to let the engine decide based on actor type.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no Auto option. It's a boolean: True or False.",
          next: "step-4",
        },
        {
          text: "Leave it <code>False</code> and use Blueprint to manually load the actor.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Blueprint loading is complex and unnecessary. Spatial loading handles this automatically.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "worldbuilding",
      title: "Checking Data Layers",
      image_path: "assets/generated/WorldPartitionActorNotLoading/step-5.png",
      prompt:
        "<p>After enabling <code>Is Spatially Loaded</code>, you notice the actor also has a <code>Data Layer</code> assigned called <code>SecretContent</code>.</p><p><strong>How do Data Layers interact with spatial loading?</strong></p>",
      choices: [
        {
          text: "Even with spatial loading enabled, actors on inactive Data Layers won't load. The Data Layer must be active for the actor to stream.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Data Layers act as an additional filter. Both the layer must be active AND spatial criteria must be met.",
          next: "step-6",
        },
        {
          text: "Data Layers override spatial loading entirely, so the actor always loads when the layer is active.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Data Layers and spatial loading work together, not as overrides. Both conditions apply.",
          next: "step-5",
        },
        {
          text: "Data Layers only affect HLOD generation, not runtime streaming behavior.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Data Layers control runtime loading. HLOD is a separate system.",
          next: "step-5",
        },
        {
          text: "Data Layers group actors visually in the editor but don't affect runtime loading.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Data Layers are specifically for controlling what content loads at runtime.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "worldbuilding",
      title: "Resolving Data Layer Issue",
      image_path: "assets/generated/WorldPartitionActorNotLoading/step-6.png",
      prompt:
        "<p>The <code>SecretContent</code> Data Layer is not activated by default. How should you resolve this?</p><p><strong>What is the best solution?</strong></p>",
      choices: [
        {
          text: "Remove the actor from the <code>SecretContent</code> Data Layer by clearing the Data Layer assignment in the Details Panel.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. If the content isn't actually 'secret', removing the layer assignment lets it load normally.",
          next: "step-7",
        },
        {
          text: "Set the <code>SecretContent</code> layer's <code>Initial State</code> to <code>Activated</code> in World Settings.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. This works if all 'secret' content should always load. Consider if that's the intended behavior.",
          next: "step-7",
        },
        {
          text: "Delete the <code>SecretContent</code> Data Layer from the project entirely.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Deleting is destructive and may affect other actors. Simply remove this actor's assignment.",
          next: "step-6",
        },
        {
          text: "Add Blueprint logic to activate the layer when the player approaches.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Blueprint activation is valid for truly secret content, but overkill for a regular treasure chest.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "worldbuilding",
      title: "Understanding Runtime Grids",
      image_path: "assets/generated/WorldPartitionActorNotLoading/step-7.png",
      prompt:
        "<p>With settings corrected, you want to understand how World Partition decides when to load actors. What determines loading distance?</p><p><strong>What controls streaming distance?</strong></p>",
      choices: [
        {
          text: "The <code>Runtime Grid</code> assigned to the actor defines cell size and loading ranges. Actors load when their cell comes within range of a streaming source.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Runtime Grids are configurable to have different streaming distances for different content types.",
          next: "step-8",
        },
        {
          text: "The actor's <code>Net Cull Distance</code> property controls when it streams in and out.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Net Cull Distance is for network replication, not World Partition streaming.",
          next: "step-7",
        },
        {
          text: "The player's camera Far Clip Plane determines which actors are loaded.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Rendering clip planes don't affect World Partition loading. Runtime Grids control streaming.",
          next: "step-7",
        },
        {
          text: "A fixed engine value that cannot be changed by developers.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Loading distance is fully configurable via Runtime Grid settings.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "worldbuilding",
      title: "Saving Changes",
      image_path: "assets/generated/WorldPartitionActorNotLoading/step-8.png",
      prompt:
        "<p>You've configured the actor correctly. What should you do before testing?</p><p><strong>What is the next step?</strong></p>",
      choices: [
        {
          text: "Save all modified actors and the level to ensure changes persist. World Partition stores actor data externally, so saving is important.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.05hrs. World Partition uses external actor files. Saving ensures your configuration changes are written.",
          next: "step-9",
        },
        {
          text: "Rebuild the World Partition minimap to reflect the new actor configuration.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Minimap is for navigation visualization. Saving your changes is the priority.",
          next: "step-8",
        },
        {
          text: "Compile all Blueprints to ensure the actor class changes are applied.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. You changed actor instance settings, not Blueprint code. Save is sufficient.",
          next: "step-8",
        },
        {
          text: "Restart the editor to clear any cached streaming data.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. No restart needed. Saving and testing in PIE is sufficient.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "worldbuilding",
      title: "Testing in PIE",
      image_path: "assets/generated/WorldPartitionActorNotLoading/step-9.png",
      prompt:
        "<p>You've saved the level. How do you verify the actor now loads correctly at runtime?</p><p><strong>What is the best verification method?</strong></p>",
      choices: [
        {
          text: "Press <strong>Play in Editor</strong>, navigate to the actor's location, and confirm the Treasure Chest appears when you approach its cell.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. PIE accurately simulates World Partition streaming. Visual confirmation is the fastest verification.",
          next: "step-10",
        },
        {
          text: "Check the World Partition editor window to see if the actor's cell is marked as loaded.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The editor window shows design-time layout, not runtime status. Test in PIE.",
          next: "step-9",
        },
        {
          text: "Open the Output Log and search for streaming-related messages.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Runtime streaming doesn't log by default. Visual testing is more reliable.",
          next: "step-9",
        },
        {
          text: "Package the game and test on a fresh installation.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.4hrs. Packaging is excessive. PIE accurately represents World Partition behavior.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "worldbuilding",
      title: "Debug Visualization",
      image_path: "assets/generated/WorldPartitionActorNotLoading/step-10.png",
      prompt:
        "<p>The actor now appears! You want to use debug visualization to understand cell loading better. What console command helps?</p><p><strong>What is the debug command?</strong></p>",
      choices: [
        {
          text: "Use <code>wp.Runtime.ToggleDrawRuntimeCellsDetails</code> in the console to visualize which cells are currently loaded and their streaming state.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. This command shows cell boundaries and loading status, helping you understand streaming behavior.",
          next: "conclusion",
        },
        {
          text: "Enable <code>Show</code> > <strong>Streaming</strong> in the viewport options.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no Streaming show flag. Use the wp.Runtime console commands.",
          next: "step-10",
        },
        {
          text: "Use <code>stat streaming</code> to see streaming statistics in the viewport.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. stat streaming shows general stats. The wp.Runtime commands show WP-specific cell details.",
          next: "step-10",
        },
        {
          text: "Add a <strong>World Partition Debug</strong> actor to the level for visualization.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. No debug actor is needed. Console commands provide runtime visualization.",
          next: "step-10",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/WorldPartitionActorNotLoading/conclusion.png",
      prompt:
        "<p><strong>Great job!</strong></p><p>You've resolved the World Partition streaming issue and understand the key configuration settings.</p><h4>Key Takeaways:</h4><ul><li><code>Is Spatially Loaded</code> — Must be <code>True</code> for actors to stream with their grid cell</li><li><code>Data Layers</code> — Control content groups; inactive layers prevent loading even with spatial loading enabled</li><li><strong>Runtime Grids</strong> — Define cell size and streaming distances for different content types</li><li><code>wp.Runtime.ToggleDrawRuntimeCellsDetails</code> — Debug command to visualize cell streaming</li><li><strong>Save All</strong> — World Partition uses external actor files, so saving is essential</li><li><strong>Details Panel</strong> — Primary location for actor-specific WP configuration</li></ul>",
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
