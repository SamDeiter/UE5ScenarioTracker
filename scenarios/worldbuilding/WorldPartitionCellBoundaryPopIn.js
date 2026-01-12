window.SCENARIOS["WorldPartitionCellBoundaryPopIn"] = {
  meta: {
    title: "Visible Pop-In at World Partition Cell Boundaries",
    description:
      "Players report noticeable 'pop-in' of foliage and props as they move through the open world, with objects appearing suddenly at consistent distances rather than fading in smoothly.",
    estimateHours: 1.25,
    difficulty: "Intermediate",
    category: "Worldbuilding",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "WorldPartitionCellBoundaryPopIn",
      step: "setup",
    },
  ],
  fault: {
    description: "Harsh streaming pop-in visible at cell boundaries",
    visual_cue: "Objects suddenly appearing as player moves through world",
  },
  expected: {
    description: "Smooth streaming with imperceptible content transitions",
    validation_action: "verify_smooth_streaming",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "WorldPartitionCellBoundaryPopIn",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "worldbuilding",
      title: "Initial Observation",
      image_path: "assets/generated/WorldPartitionCellBoundaryPopIn/step-1.png",
      prompt:
        "<p>During playtesting, you notice foliage and props 'pop in' harshly as you traverse the map. The pop-in occurs at consistent distances, suggesting it's related to streaming cell boundaries.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Enable <code>wp.Runtime.ToggleDrawRuntimeCellsDetails</code> to visualize cell boundaries and loading distances while moving through the world.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. This debug visualization shows exactly where cells load and unload, helping correlate pop-in with streaming boundaries.",
          next: "step-2",
        },
        {
          text: "Check <strong>Project Settings</strong> > <strong>Streaming</strong> for global level streaming distance settings.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Global streaming settings exist, but World Partition uses its own grid-based system. Visualize WP cells first.",
          next: "step-1",
        },
        {
          text: "Reduce the <strong>LOD Distance Scale</strong> on foliage actors to make them visible from further away.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. LOD affects detail levels of already-visible objects, not the streaming distance where they first appear.",
          next: "step-1",
        },
        {
          text: "Enable <strong>Preload Distance</strong> on all Static Mesh Components in the level.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. There's no <code>Preload Distance</code> on Static Mesh Components. World Partition grid settings control streaming distances.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "worldbuilding",
      title: "Analyzing Grid Configuration",
      image_path: "assets/generated/WorldPartitionCellBoundaryPopIn/step-2.png",
      prompt:
        "<p>The visualization confirms pop-in occurs exactly at cell boundaries. You need to adjust the streaming buffer distance to load cells earlier.</p><p><strong>Where do you configure the loading distance for World Partition cells?</strong></p>",
      choices: [
        {
          text: "Open <strong>World Settings</strong> > <strong>World Partition</strong> > <strong>Runtime Settings</strong> and adjust the <code>Loading Range</code> for the runtime grid.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. The Runtime Grid's <code>Loading Range</code> determines how far ahead of the player cells begin streaming in.",
          next: "step-3",
        },
        {
          text: "Edit each actor's <code>Net Cull Distance</code> property in the <strong>Details Panel</strong>.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Net Cull Distance affects multiplayer relevancy, not World Partition cell streaming distances.",
          next: "step-2",
        },
        {
          text: "Modify the <code>Cell Size</code> in <strong>World Partition Setup</strong> to create larger cells.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Changing cell size requires regenerating the entire partition. Adjusting loading range is the correct, non-destructive approach.",
          next: "step-2",
        },
        {
          text: "Add <strong>Level Streaming Volumes</strong> at cell boundaries to pre-trigger loading.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Level Streaming Volumes are for sub-levels, not World Partition. Use the built-in loading range settings.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "worldbuilding",
      title: "Optimizing Loading Range",
      image_path: "assets/generated/WorldPartitionCellBoundaryPopIn/step-3.png",
      prompt:
        "<p>You've located the <code>Loading Range</code> setting. It's currently set to the default value. You want to increase it to load cells earlier, but you're concerned about memory impact.</p><p><strong>What is the best approach to balance streaming smoothness with memory usage?</strong></p>",
      choices: [
        {
          text: "Increase <code>Loading Range</code> incrementally while monitoring memory usage with <code>stat memory</code> to find the optimal balance.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. Iterative testing with profiling ensures you improve pop-in without exceeding memory budgets on target platforms.",
          next: "step-4",
        },
        {
          text: "Set <code>Loading Range</code> to the maximum possible value to ensure cells always load well ahead of the player.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Maximum range eliminates pop-in but may cause memory issues on consoles or low-end PCs. Balance is important.",
          next: "step-3",
        },
        {
          text: "Keep the default <code>Loading Range</code> but enable <code>Async Loading</code> for smoother streaming.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. World Partition already uses async loading. The issue is when cells start loading, not how they load.",
          next: "step-3",
        },
        {
          text: "Reduce the level's total content density to lower memory requirements before increasing range.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.5hrs. Content reduction is drastic. Optimize streaming settings first before cutting visual quality.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "worldbuilding",
      title: "Implementing HLOD for Distance",
      image_path: "assets/generated/WorldPartitionCellBoundaryPopIn/step-4.png",
      prompt:
        "<p>Increasing <code>Loading Range</code> helps, but you still see some pop-in for distant objects. You want to implement smooth visual continuity for far-away content.</p><p><strong>What feature should you configure for distant content representation?</strong></p>",
      choices: [
        {
          text: "Configure <strong>HLOD</strong> (Hierarchical Level of Detail) to provide simplified representations of content before full cells load.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. HLOD provides visual continuity at distance by showing simplified proxy meshes before the actual high-detail content streams in.",
          next: "step-5",
        },
        {
          text: "Enable <strong>Distance Field</strong> representations for all static meshes in the level.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Distance Fields affect shadows and AO, not content streaming. HLOD specifically addresses distant content visibility.",
          next: "step-4",
        },
        {
          text: "Add <strong>Impostors</strong> manually for each major landmark in the world.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Manual impostors are time-consuming. HLOD automatically generates optimized distant representations.",
          next: "step-4",
        },
        {
          text: "Increase the <strong>View Distance Scale</strong> in Scalability Settings to maximum.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. View Distance Scale affects culling, not representation. Unloaded cells have nothing to render regardless of view distance.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "worldbuilding",
      title: "Verification",
      image_path: "assets/generated/WorldPartitionCellBoundaryPopIn/step-5.png",
      prompt:
        "<p>You've configured HLOD and increased the loading range. How do you verify the streaming experience is now smooth?</p><p><strong>What is the most thorough verification approach?</strong></p>",
      choices: [
        {
          text: "Use <strong>Standalone Game</strong> on target hardware specs and traverse the entire map while observing transitions between HLOD and full-detail cells.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.25hrs. Testing on representative hardware ensures the streaming configuration works within actual memory and loading constraints.",
          next: "conclusion",
        },
        {
          text: "Run the built-in <strong>World Partition</strong> validation tool from the editor menu.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Validation tools check configuration correctness, but visual play-testing is needed to verify the player experience.",
          next: "step-5",
        },
        {
          text: "Check the <strong>HLOD</strong> preview in the World Partition editor window.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Editor preview shows HLOD setup, not the runtime transition experience. Play-test for proper verification.",
          next: "step-5",
        },
        {
          text: "Review <code>stat streaming</code> output to confirm all cells are marked as loaded.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Stats show current state, not the quality of visual transitions. Perceptual testing is required.",
          next: "step-5",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/WorldPartitionCellBoundaryPopIn/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've resolved the World Partition pop-in issue.</p><h4>Key Takeaways:</h4><ul><li><code>wp.Runtime.ToggleDrawRuntimeCellsDetails</code> — Visualize cell boundaries and loading states</li><li><code>Loading Range</code> — Controls how far ahead cells begin streaming</li><li><strong>HLOD</strong> — Provides visual continuity for distant content before full cells load</li><li><code>stat memory</code> — Monitor memory impact when increasing streaming distances</li></ul>",
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
