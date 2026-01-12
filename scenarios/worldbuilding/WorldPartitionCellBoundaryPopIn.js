window.SCENARIOS["WorldPartitionCellBoundaryPopIn"] = {
  meta: {
    title: "Visible Pop-In at World Partition Cell Boundaries",
    description:
      "Players report noticeable 'pop-in' of foliage and props as they move through the open world, with objects appearing suddenly at consistent distances rather than fading in smoothly.",
    estimateHours: 1.5,
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
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. LOD affects detail levels of already-visible objects, not the streaming distance where they first appear.",
          next: "step-1",
        },
        {
          text: "Enable <strong>Preload Distance</strong> on all Static Mesh Components in the level.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. There's no <code>Preload Distance</code> on Static Mesh Components. World Partition grid settings control streaming.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "worldbuilding",
      title: "Understanding the Visualization",
      image_path: "assets/generated/WorldPartitionCellBoundaryPopIn/step-2.png",
      prompt:
        "<p>You enable the debug command and see colored boxes representing cells. Some are green, others red. What do these colors indicate?</p><p><strong>What do the debug colors represent?</strong></p>",
      choices: [
        {
          text: "Green cells are currently loaded and active. Red cells are unloaded. The boundary where color changes is where streaming transitions occur.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Color-coded visualization makes streaming boundaries immediately clear, showing where pop-in happens.",
          next: "step-3",
        },
        {
          text: "Green indicates cells with HLOD active, red indicates cells using full-detail meshes.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. HLOD has separate visualization. The basic cell view shows loaded vs unloaded status.",
          next: "step-2",
        },
        {
          text: "Colors indicate memory usage per cell — green is low memory, red is high.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Memory visualization is different. Basic cell colors show loading state.",
          next: "step-2",
        },
        {
          text: "Green means the cell is within view frustum, red means it's culled.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Frustum culling is separate. Cell colors show streaming state, not visibility culling.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "worldbuilding",
      title: "Locating Streaming Settings",
      image_path: "assets/generated/WorldPartitionCellBoundaryPopIn/step-3.png",
      prompt:
        "<p>The visualization confirms pop-in occurs exactly at cell boundaries. You need to adjust when cells start loading.</p><p><strong>Where do you configure the loading distance for World Partition cells?</strong></p>",
      choices: [
        {
          text: "Open <strong>World Settings</strong> > <strong>World Partition</strong> > <strong>Runtime Settings</strong> and adjust the <code>Loading Range</code> for the runtime grid.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. The Runtime Grid's <code>Loading Range</code> determines how far ahead of the player cells begin streaming in.",
          next: "step-4",
        },
        {
          text: "Edit each actor's <code>Net Cull Distance</code> property in the <strong>Details Panel</strong>.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Net Cull Distance affects multiplayer relevancy, not World Partition cell streaming.",
          next: "step-3",
        },
        {
          text: "Modify the <code>Cell Size</code> in <strong>World Partition Setup</strong> to create larger cells.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Changing cell size requires regenerating the partition. Adjusting loading range is non-destructive.",
          next: "step-3",
        },
        {
          text: "Add <strong>Level Streaming Volumes</strong> at cell boundaries to pre-trigger loading.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Level Streaming Volumes are for sub-levels, not World Partition.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "worldbuilding",
      title: "Understanding Loading Range",
      image_path: "assets/generated/WorldPartitionCellBoundaryPopIn/step-4.png",
      prompt:
        "<p>You find the <code>Loading Range</code> setting. What does this value control exactly?</p><p><strong>How does Loading Range work?</strong></p>",
      choices: [
        {
          text: "It defines the distance from the streaming source (player) at which cells begin loading. Larger values load cells earlier, before the player reaches them.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Loading Range creates a buffer zone where cells pre-load before becoming visible.",
          next: "step-5",
        },
        {
          text: "It specifies the maximum number of cells that can be loaded simultaneously.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Cell count limits exist separately. Loading Range is about distance, not quantity.",
          next: "step-4",
        },
        {
          text: "It controls how long cells remain loaded after the player leaves the area.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Unload behavior has different settings. Loading Range affects when cells start loading.",
          next: "step-4",
        },
        {
          text: "It defines the priority order for loading cells when multiple are pending.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Priority is based on distance automatically. Loading Range defines the trigger distance.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "worldbuilding",
      title: "Balancing Performance",
      image_path: "assets/generated/WorldPartitionCellBoundaryPopIn/step-5.png",
      prompt:
        "<p>You want to increase the Loading Range but are concerned about memory impact. What is the best approach?</p><p><strong>How do you balance streaming smoothness with memory usage?</strong></p>",
      choices: [
        {
          text: "Increase <code>Loading Range</code> incrementally while monitoring memory usage with <code>stat memory</code> to find the optimal balance for your target platforms.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. Iterative testing with profiling ensures you improve pop-in without exceeding memory budgets.",
          next: "step-6",
        },
        {
          text: "Set <code>Loading Range</code> to maximum to ensure cells always load well ahead of the player.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Maximum range eliminates pop-in but may cause memory issues on consoles. Balance is needed.",
          next: "step-5",
        },
        {
          text: "Keep the default range but enable async loading for smoother streaming.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. World Partition already uses async loading. The issue is when cells start loading.",
          next: "step-5",
        },
        {
          text: "Reduce content density before increasing range to stay within budget.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.5hrs. Content reduction is drastic. Optimize settings first before cutting quality.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "worldbuilding",
      title: "Introducing HLOD",
      image_path: "assets/generated/WorldPartitionCellBoundaryPopIn/step-6.png",
      prompt:
        "<p>Increasing Loading Range helps but you still see pop-in for distant content. What feature provides visual continuity for far-away objects?</p><p><strong>What should you configure for distant content?</strong></p>",
      choices: [
        {
          text: "Configure <strong>HLOD</strong> (Hierarchical Level of Detail) to provide simplified representations of content before full cells load.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. HLOD provides visual continuity by showing simplified proxy meshes at distance.",
          next: "step-7",
        },
        {
          text: "Enable <strong>Distance Field</strong> representations for all static meshes.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Distance Fields affect shadows and AO, not content streaming visibility.",
          next: "step-6",
        },
        {
          text: "Add <strong>Impostors</strong> manually for each major landmark in the world.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Manual impostors are time-consuming. HLOD auto-generates distant representations.",
          next: "step-6",
        },
        {
          text: "Increase the <strong>View Distance Scale</strong> in Scalability Settings.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. View Distance Scale affects culling, not representation. Unloaded cells have nothing to render.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "worldbuilding",
      title: "Understanding HLOD",
      image_path: "assets/generated/WorldPartitionCellBoundaryPopIn/step-7.png",
      prompt:
        "<p>How does HLOD help with World Partition streaming pop-in specifically?</p><p><strong>What is HLOD's role in streaming?</strong></p>",
      choices: [
        {
          text: "HLOD renders simplified proxy meshes for cells that are beyond the loading range, providing visual presence before the actual content streams in.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. HLOD acts as a visual placeholder that transitions smoothly to full detail as you approach.",
          next: "step-8",
        },
        {
          text: "HLOD reduces the memory footprint of loaded cells, allowing more cells to be loaded simultaneously.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Memory reduction is a benefit, but HLOD's main role is visual continuity at distance.",
          next: "step-7",
        },
        {
          text: "HLOD pre-loads cell content in a compressed format that expands when the player approaches.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. HLOD uses separate proxy meshes, not compressed originals. Full content loads separately.",
          next: "step-7",
        },
        {
          text: "HLOD replaces detailed content entirely at distance to improve rendering performance.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. HLOD supplements, not replaces. It shows when cells are unloaded; full content takes over when loaded.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "worldbuilding",
      title: "Configuring HLOD",
      image_path: "assets/generated/WorldPartitionCellBoundaryPopIn/step-8.png",
      prompt:
        "<p>Where do you configure HLOD settings for World Partition?</p><p><strong>How do you set up HLOD?</strong></p>",
      choices: [
        {
          text: "Open <strong>World Settings</strong> > <strong>World Partition</strong> and configure the <code>HLOD Setup</code> section, then build HLODs using the World Partition window.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. HLOD configuration is part of World Partition settings. Building generates the proxy meshes.",
          next: "step-9",
        },
        {
          text: "Use the <strong>HLOD Outliner</strong> panel to manually create HLOD clusters for each region.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. HLOD Outliner is for legacy HLOD. World Partition has integrated HLOD setup.",
          next: "step-8",
        },
        {
          text: "Set per-actor HLOD settings in each Static Mesh Actor's Details Panel.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Per-actor overrides exist but main setup is at the World Partition level.",
          next: "step-8",
        },
        {
          text: "Create HLOD Blueprint actors and place them manually at strategic viewing positions.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. No manual placement needed. World Partition generates HLOD automatically.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "worldbuilding",
      title: "Building HLODs",
      image_path: "assets/generated/WorldPartitionCellBoundaryPopIn/step-9.png",
      prompt:
        "<p>You've configured HLOD settings. Now you need to generate the HLOD meshes. How do you build them?</p><p><strong>What is the build process?</strong></p>",
      choices: [
        {
          text: "In the <strong>World Partition</strong> editor window, use the <code>Build</code> menu to generate HLODs for all cells or selected regions.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The World Partition window provides HLOD build options for the entire world or specific areas.",
          next: "step-10",
        },
        {
          text: "HLODs generate automatically when you save the level; no manual build is needed.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. HLOD generation is manual to give control over when the potentially long build process runs.",
          next: "step-9",
        },
        {
          text: "Run <code>wp.BuildHLOD</code> from the console to trigger generation.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Console commands can help but the primary interface is the World Partition window.",
          next: "step-9",
        },
        {
          text: "Export the level, run an external HLOD generator tool, then re-import.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. No external tools needed. Unreal has built-in HLOD generation.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "worldbuilding",
      title: "Testing the Solution",
      image_path:
        "assets/generated/WorldPartitionCellBoundaryPopIn/step-10.png",
      prompt:
        "<p>You've built HLODs and increased the Loading Range. How do you test that streaming is now smooth?</p><p><strong>What is the best test approach?</strong></p>",
      choices: [
        {
          text: "Launch <strong>Standalone Game</strong> on target hardware specs and traverse the entire map, observing transitions between HLOD and full-detail cells.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. Testing on representative hardware ensures the configuration works within actual memory and loading constraints.",
          next: "step-11",
        },
        {
          text: "Use PIE and check the Output Log for streaming warnings.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. PIE is convenient but Standalone better represents target platform behavior.",
          next: "step-10",
        },
        {
          text: "Check the HLOD preview in the World Partition editor window.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Editor preview shows setup, not the runtime transition experience.",
          next: "step-10",
        },
        {
          text: "Review <code>stat streaming</code> output to confirm all systems are working.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Stats show status, not the quality of visual transitions. Play-testing is required.",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "worldbuilding",
      title: "Verifying HLOD Transitions",
      image_path:
        "assets/generated/WorldPartitionCellBoundaryPopIn/step-11.png",
      prompt:
        "<p>During testing, you want to verify HLOD to full-detail transitions are smooth. What should you look for?</p><p><strong>What indicates a successful configuration?</strong></p>",
      choices: [
        {
          text: "Distant landmarks should be visible (via HLOD) and seamlessly transform to full-detail as you approach, with no visible 'pop' when switching.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Smooth HLOD transitions feel like continuous detail increase rather than sudden appearance.",
          next: "step-12",
        },
        {
          text: "Memory usage should remain constant regardless of player position in the world.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Memory will fluctuate as cells load/unload. Focus on visual smoothness, not memory flatness.",
          next: "step-11",
        },
        {
          text: "The Niagara particle effects should maintain consistent positions during transitions.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Particle systems are separate from HLOD. Focus on static mesh visual continuity.",
          next: "step-11",
        },
        {
          text: "Loading indicators should never appear on screen during gameplay.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Loading indicators are a separate UX consideration. Smooth visual transitions are the primary goal.",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "worldbuilding",
      title: "Platform Testing",
      image_path:
        "assets/generated/WorldPartitionCellBoundaryPopIn/step-12.png",
      prompt:
        "<p>The streaming looks smooth on your development machine. What final verification ensures it works on all target platforms?</p><p><strong>What is the critical final test?</strong></p>",
      choices: [
        {
          text: "Test on minimum-spec hardware for each target platform, especially checking memory-constrained consoles where streaming budgets are tighter.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. Minimum-spec testing catches streaming issues that only appear when memory and I/O are constrained.",
          next: "conclusion",
        },
        {
          text: "Enable the <code>Memory Limit Warning</code> in Project Settings and run on your high-spec PC.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Warnings help but actual low-spec hardware reveals real-world performance.",
          next: "step-12",
        },
        {
          text: "Run the built-in World Partition validation tool to check configuration.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Validation checks configuration, not runtime performance on target hardware.",
          next: "step-12",
        },
        {
          text: "Use scalability presets to simulate console performance on PC.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Scalability affects rendering quality, not streaming behavior. Real hardware testing is essential.",
          next: "step-12",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/WorldPartitionCellBoundaryPopIn/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've resolved the World Partition pop-in issue and created smooth streaming transitions.</p><h4>Key Takeaways:</h4><ul><li><code>wp.Runtime.ToggleDrawRuntimeCellsDetails</code> — Visualize cell boundaries and loading states</li><li><code>Loading Range</code> — Controls how far ahead cells begin streaming; increase to reduce pop-in</li><li><strong>HLOD</strong> — Provides visual continuity for distant content before full cells load</li><li><strong>World Partition Window</strong> — Build HLODs using the Build menu</li><li><code>stat memory</code> — Monitor memory impact when increasing streaming distances</li><li><strong>Min-Spec Testing</strong> — Essential for validating streaming on memory-constrained platforms</li></ul>",
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
