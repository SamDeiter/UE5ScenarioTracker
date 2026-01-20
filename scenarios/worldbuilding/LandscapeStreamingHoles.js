window.SCENARIOS["LandscapeStreamingHoles"] = {
  meta: {
    title: "Landscape Shows Holes During World Partition Streaming",
    description:
      "When traveling through your open world, the Landscape terrain shows gaps or holes at cell boundaries during streaming transitions.",
    estimateHours: 1.25,
    difficulty: "Intermediate",
    category: "Worldbuilding",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "LandscapeStreamingHoles",
      step: "setup",
    },
  ],
  fault: {
    description:
      "Landscape terrain has visible gaps at World Partition cell boundaries",
    visual_cue:
      "Player can see through terrain or fall through during streaming",
  },
  expected: {
    description: "Landscape streams seamlessly without visible holes or gaps",
    validation_action: "verify_landscape_streaming",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "LandscapeStreamingHoles",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "worldbuilding",
      title: "Initial Observation",
      image_path: "assets/generated/LandscapeStreamingHoles/step-1.png",
      prompt:
        "<p>While testing your open world, you notice that when moving quickly, visible holes appear in the terrain at certain boundaries. Sometimes you can see underground caves through the terrain surface.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Enable World Partition debug visualization with <code>wp.Runtime.ToggleDrawRuntimeCellsDetails</code> to see cell boundaries and streaming states during movement.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Visualization reveals whether the holes align with cell boundaries and streaming timing.",
          next: "step-2",
        },
        {
          text: "Increase the Landscape resolution to add more geometry.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Resolution affects detail but not streaming holes. Check cell boundaries first.",
          next: "step-1",
        },
        {
          text: "Rebuild the Landscape collision to fix physics holes.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Collision rebuilding addresses physics, but visual holes suggest streaming issues.",
          next: "step-1",
        },
        {
          text: "Check if the Landscape material is fully loaded.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Material loading affects appearance but not geometry holes. It's a streaming issue.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "worldbuilding",
      title: "Understanding Landscape Partitioning",
      image_path: "assets/generated/LandscapeStreamingHoles/step-2.png",
      prompt:
        "<p>The debug view shows the holes appear exactly at streaming cell boundaries. How does World Partition handle Landscapes?</p><p><strong>How are Landscapes partitioned?</strong></p>",
      choices: [
        {
          text: "World Partition splits the Landscape into <strong>Landscape Streaming Proxies</strong>, one per cell. If a proxy doesn't load in time, that section of terrain is missing.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Landscape proxies stream with cells. Mismatched timing causes gaps.",
          next: "step-3",
        },
        {
          text: "Landscapes are never partitioned; they always load as one complete mesh.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Large landscapes are partitioned for streaming. That's why holes can appear.",
          next: "step-2",
        },
        {
          text: "Landscapes use a separate streaming system unrelated to World Partition.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Landscapes integrate with World Partition via streaming proxies.",
          next: "step-2",
        },
        {
          text: "Only foliage is streamed on Landscapes; terrain geometry is always loaded.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Both terrain and foliage can stream. Holes are terrain streaming issues.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "worldbuilding",
      title: "Checking Loading Range",
      image_path: "assets/generated/LandscapeStreamingHoles/step-3.png",
      prompt:
        "<p>Landscape streaming proxies are loading too late. What setting controls when they begin loading?</p><p><strong>What determines Landscape streaming distance?</strong></p>",
      choices: [
        {
          text: "Check the <strong>World Partition Runtime Settings</strong> and increase the <code>Loading Range</code> for Landscape-containing cells to start loading earlier.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Larger loading range makes proxies load before the player reaches the boundary.",
          next: "step-4",
        },
        {
          text: "Increase the overall world cell size to reduce the number of boundaries.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Larger cells reduce boundaries but don't fix loading timing. Increase loading range.",
          next: "step-3",
        },
        {
          text: "Set Landscape LOD to a higher value for faster loading.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. LOD affects visual quality, not streaming priority. Adjust loading range.",
          next: "step-3",
        },
        {
          text: "Enable async loading in Project Settings.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Async loading is typically already enabled. Loading range determines distance.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "worldbuilding",
      title: "Landscape Proxy Priority",
      image_path: "assets/generated/LandscapeStreamingHoles/step-4.png",
      prompt:
        "<p>Loading range is increased but holes still appear briefly. The landscape proxy loads after other content. How do you prioritize landscape loading?</p><p><strong>How do you ensure terrain loads first?</strong></p>",
      choices: [
        {
          text: "Use <strong>Data Layers</strong> to place Landscape actors in a high-priority layer with a larger loading range than other content.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Data Layers let you configure different streaming distances for landscape vs props.",
          next: "step-5",
        },
        {
          text: "Enable 'Always Loaded' on all Landscape actors.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Always loaded works but defeats streaming benefits. Use Data Layers for priority.",
          next: "step-4",
        },
        {
          text: "Move Landscape actors to load first in the World Outliner hierarchy.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Outliner order doesn't affect streaming priority. Use Data Layers.",
          next: "step-4",
        },
        {
          text: "Reduce the poly count on other actors so Landscape loads faster.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Other actors don't block Landscape. Priority is controlled by Data Layers.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "worldbuilding",
      title: "Creating a Landscape Data Layer",
      image_path: "assets/generated/LandscapeStreamingHoles/step-5.png",
      prompt:
        "<p>You want to create a Data Layer for Landscape actors. Where do you configure this?</p><p><strong>How do you create a Data Layer?</strong></p>",
      choices: [
        {
          text: "Open <strong>World Settings</strong>, go to <code>World Partition</code> section, and create a new <code>Data Layer</code> with custom streaming settings for Landscape priority.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Data Layers in World Settings define streaming groups with independent ranges.",
          next: "step-6",
        },
        {
          text: "Create a Data Layer asset in the Content Browser.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Data Layer assets exist but must be configured in World Settings for your level.",
          next: "step-5",
        },
        {
          text: "Right-click the Landscape actor and select 'Create Data Layer'.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. No such right-click option. Configure Data Layers in World Settings.",
          next: "step-5",
        },
        {
          text: "Data Layers are set up in Project Settings globally.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Data Layers are per-level in World Settings, not global.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "worldbuilding",
      title: "Assigning Landscape to Data Layer",
      image_path: "assets/generated/LandscapeStreamingHoles/step-6.png",
      prompt:
        "<p>You've created a 'Landscape' Data Layer with extended loading range. How do you assign Landscape actors to it?</p><p><strong>How do you assign actors to Data Layers?</strong></p>",
      choices: [
        {
          text: "Select the Landscape actor(s), open the Details panel, and set the <code>Data Layers</code> property to include your 'Landscape' Data Layer.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Each actor's Data Layer property controls which streaming group it belongs to.",
          next: "step-7",
        },
        {
          text: "Drag Landscape actors into a folder named 'Landscape' in the Outliner.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Outliner folders don't affect streaming. Set the Data Layer property.",
          next: "step-6",
        },
        {
          text: "Edit the Data Layer to specify which actor types it includes.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Data Layers don't filter by type. Assign per-actor in Details panel.",
          next: "step-6",
        },
        {
          text: "Use Actor Tags to mark Landscape actors for the layer.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Actor Tags don't affect Data Layer assignment. Use the Data Layers property.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "worldbuilding",
      title: "Configuring Layer Loading Range",
      image_path: "assets/generated/LandscapeStreamingHoles/step-7.png",
      prompt:
        "<p>The Landscape is assigned to the Data Layer. What loading range should you set for terrain to load well ahead of the player?</p><p><strong>What is an appropriate loading range?</strong></p>",
      choices: [
        {
          text: "Set the Landscape Data Layer's loading range to be <strong>larger</strong> than the regular cell loading range, typically 1.5-2x the standard range to ensure terrain is ready before arrival.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Extended range for Landscape ensures terrain loads before the player can see the boundary.",
          next: "step-8",
        },
        {
          text: "Match the loading range to the player's maximum movement speed multiplied by load time.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Speed-based calculation helps but simple 1.5-2x multiplier is more practical.",
          next: "step-7",
        },
        {
          text: "Set loading range to the entire world size so terrain is always loaded.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Entire-world loading defeats streaming benefits. Use reasonable extended range.",
          next: "step-7",
        },
        {
          text: "Keep the same range as other content; streaming order will prioritize Landscape.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Same range may still cause holes. Extended range ensures earlier loading.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "worldbuilding",
      title: "Landscape Collision Streaming",
      image_path: "assets/generated/LandscapeStreamingHoles/step-8.png",
      prompt:
        "<p>Visual holes are fixed but sometimes the player falls through the terrain before it fully loads. What's causing this?</p><p><strong>Why can players fall through loaded terrain?</strong></p>",
      choices: [
        {
          text: "The Landscape <strong>collision</strong> may load separately from the visual mesh. Ensure collision streaming priority matches or exceeds visual streaming.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Collision and visual components can have different streaming timing.",
          next: "step-9",
        },
        {
          text: "The terrain needs collision rebuilding after streaming.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Collision rebuilds happen at edit time. It's a streaming timing issue.",
          next: "step-8",
        },
        {
          text: "Character capsule is too small to register Landscape collision.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Capsule size is valid but works fine when collision is loaded. It's timing.",
          next: "step-8",
        },
        {
          text: "Landscape material needs physics material assignment.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Physics material affects friction, not collision availability during streaming.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "worldbuilding",
      title: "Player Safe Zone",
      image_path: "assets/generated/LandscapeStreamingHoles/step-9.png",
      prompt:
        "<p>Even with priority loading, there's still a small window where collision isn't ready. What gameplay safety can you add?</p><p><strong>How do you prevent falling through during edge cases?</strong></p>",
      choices: [
        {
          text: "Configure a <strong>World Partition Streaming Source</strong> volume or use player-based streaming with sufficient loading range to ensure the area around the player is always collision-ready.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Streaming sources centered on the player ensure immediate area is always loaded.",
          next: "step-10",
        },
        {
          text: "Add invisible collision planes under the entire world as a fallback.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Collision planes work but are a workaround. Proper streaming configuration is cleaner.",
          next: "step-9",
        },
        {
          text: "Slow down the player's maximum speed so loading can keep up.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Speed limits affect gameplay. Streaming configuration should handle fast movement.",
          next: "step-9",
        },
        {
          text: "Teleport the player back up if they fall below terrain level.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Recovery teleport is a last resort. Prevent the fall with proper streaming.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "worldbuilding",
      title: "Testing Fast Travel",
      image_path: "assets/generated/LandscapeStreamingHoles/step-10.png",
      prompt:
        "<p>What about fast travel or teleportation? How do you handle instant position changes?</p><p><strong>How do you handle teleportation scenarios?</strong></p>",
      choices: [
        {
          text: "Before teleporting the player, use <code>FlushLevelStreaming</code> or wait for the destination area to finish loading via streaming callbacks.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Blocking on streaming completion before teleport ensures terrain is ready.",
          next: "step-11",
        },
        {
          text: "Disable World Partition during teleportation animations.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Disabling streaming is complex. Wait for loading completion instead.",
          next: "step-10",
        },
        {
          text: "Teleport the player very high above ground so terrain loads while falling.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Falling gives time but is a workaround. Proper loading wait is better UX.",
          next: "step-10",
        },
        {
          text: "Pre-load the entire world when the player opens the map screen.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Full world load defeats streaming benefits. Wait for specific destination.",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "worldbuilding",
      title: "Debug Verification",
      image_path: "assets/generated/LandscapeStreamingHoles/step-11.png",
      prompt:
        "<p>You've configured all streaming settings. How do you verify the complete solution works?</p><p><strong>What is the best verification approach?</strong></p>",
      choices: [
        {
          text: "Test by flying/driving across the entire world at maximum speed while monitoring with <code>wp.Runtime.ToggleDrawRuntimeCellsDetails</code> to confirm no visible gaps appear.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Traversal testing at high speed is the ultimate validation for streaming seams.",
          next: "step-12",
        },
        {
          text: "Check that Data Layer properties are correctly set in the Details panel.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Property verification is good but runtime testing confirms behavior.",
          next: "step-11",
        },
        {
          text: "Review the World Settings to ensure all configuration is saved.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Settings review is useful but doesn't test actual streaming behavior.",
          next: "step-11",
        },
        {
          text: "Build the game and test on target hardware only.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Packaged testing is important but PIE testing catches most issues faster.",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "worldbuilding",
      title: "Final Optimization",
      image_path: "assets/generated/LandscapeStreamingHoles/step-12.png",
      prompt:
        "<p>Testing shows no visible holes. What's a final optimization consideration for Landscape streaming?</p><p><strong>What optimization should you verify?</strong></p>",
      choices: [
        {
          text: "Check that the extended Landscape loading range isn't causing memory pressure. Balance loading distance with available memory using <code>stat memory</code>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Extended ranges load more content. Verify memory stays within budget.",
          next: "conclusion",
        },
        {
          text: "Reduce Landscape texture resolution to improve streaming speed.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Texture resolution affects quality. Loading range is the streaming factor.",
          next: "step-12",
        },
        {
          text: "Enable streaming priority in the texture settings.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Texture streaming is separate from World Partition. Check memory usage.",
          next: "step-12",
        },
        {
          text: "Disable all non-essential actors to prioritize Landscape.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Disabling content isn't necessary. Data Layers provide proper prioritization.",
          next: "step-12",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/LandscapeStreamingHoles/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've resolved Landscape streaming holes in your World Partition level.</p><h4>Key Takeaways:</h4><ul><li><strong>Landscape Streaming Proxies</strong> — Terrain is split per cell for streaming</li><li><code>Loading Range</code> — Extended range ensures earlier loading</li><li><strong>Data Layers</strong> — Separate priority streaming for Landscape actors</li><li><strong>Collision Streaming</strong> — Ensure collision loads with or before visuals</li><li><code>FlushLevelStreaming</code> — Block on loading completion before teleportation</li><li><code>stat memory</code> — Monitor memory impact of extended loading ranges</li></ul>",
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
