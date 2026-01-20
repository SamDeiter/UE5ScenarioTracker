window.SCENARIOS["PCGGraphNotGenerating"] = {
  meta: {
    title: "PCG Graph Not Generating Anything in Level",
    description:
      "Your Procedural Content Generation (PCG) graph is set up but doesn't produce any output when executed. The level shows no generated content despite the graph appearing valid.",
    estimateHours: 1.0,
    difficulty: "Beginner",
    category: "Worldbuilding",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "PCGGraphNotGenerating",
      step: "setup",
    },
  ],
  fault: {
    description: "PCG graph executes but produces no visible output",
    visual_cue: "Empty terrain after PCG execution, no foliage or props placed",
  },
  expected: {
    description: "PCG graph generates expected content in the level",
    validation_action: "verify_pcg_output",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "PCGGraphNotGenerating",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "worldbuilding",
      title: "Initial Observation",
      image_path: "assets/generated/PCGGraphNotGenerating/step-1.png",
      prompt:
        "<p>You've created a PCG graph to scatter rocks on your landscape. When you place a PCG Volume in the level and assign the graph, nothing appears after execution.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Check if the <strong>PCG Component</strong> has <code>Generate on Load</code> enabled and verify the graph executed by opening the <strong>PCG Debug Window</strong>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Debug window shows execution status and any errors preventing output.",
          next: "step-2",
        },
        {
          text: "Increase the volume size to cover more area.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Size can help but won't fix if graph isn't executing. Check debug first.",
          next: "step-1",
        },
        {
          text: "Check if the meshes are loaded in memory.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Mesh loading matters but graph execution should be verified first.",
          next: "step-1",
        },
        {
          text: "Restart the editor to refresh PCG systems.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Restart rarely fixes configuration issues. Use the debug window.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "worldbuilding",
      title: "Opening PCG Debug",
      image_path: "assets/generated/PCGGraphNotGenerating/step-2.png",
      prompt:
        "<p>How do you access the PCG Debug Window to see execution details?</p><p><strong>Where is the PCG Debug Window?</strong></p>",
      choices: [
        {
          text: "Open <strong>Window</strong> > <strong>PCG</strong> > <strong>PCG Graph Debugger</strong>, or select the PCG component and check the Details panel for execution status and logs.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The debugger shows node execution, data flow, and any errors.",
          next: "step-3",
        },
        {
          text: "Right-click the PCG Volume and select 'Debug Mode'.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. No right-click option. Use the Window menu or Details panel.",
          next: "step-2",
        },
        {
          text: "Enable console variable r.PCG.Debug to show debug info.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Console variables exist but the visual debugger is more useful.",
          next: "step-2",
        },
        {
          text: "Check the Output Log for PCG messages.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Output Log shows errors but the dedicated debugger is more informative.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "worldbuilding",
      title: "Graph Execution",
      image_path: "assets/generated/PCGGraphNotGenerating/step-3.png",
      prompt:
        "<p>The debugger shows the graph hasn't executed yet. What triggers PCG graph execution?</p><p><strong>What triggers graph execution?</strong></p>",
      choices: [
        {
          text: "Enable <code>Generate on Load</code> on the PCG Component, or manually trigger execution by clicking <code>Generate</code> in the Details panel or using the <code>Generate</code> Blueprint node.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. PCG requires explicit execution trigger—it's not automatic by default.",
          next: "step-4",
        },
        {
          text: "PCG executes automatically when you place the volume.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Automatic execution must be enabled. Check Generate on Load setting.",
          next: "step-3",
        },
        {
          text: "Save the level to trigger PCG execution.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Saving doesn't trigger execution. Enable Generate on Load or trigger manually.",
          next: "step-3",
        },
        {
          text: "PCG only executes at runtime, not in editor.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. PCG can execute in editor with proper settings. Enable generation.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "worldbuilding",
      title: "Checking Input Data",
      image_path: "assets/generated/PCGGraphNotGenerating/step-4.png",
      prompt:
        "<p>You click Generate and the graph runs, but output is still empty. The debugger shows 0 points generated. What creates the initial points?</p><p><strong>What generates input points?</strong></p>",
      choices: [
        {
          text: "Check that you have a <strong>Surface Sampler</strong> or <strong>Point Generator</strong> node connected to provide input data. Without source points, nothing is placed.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. PCG graphs need input sources. Surface Sampler creates points on geometry.",
          next: "step-5",
        },
        {
          text: "The PCG Volume automatically provides points within its bounds.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Volume defines bounds but you need a sampler node to create points.",
          next: "step-4",
        },
        {
          text: "Points come from the mesh you're trying to spawn.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Meshes are output, not input. Add a sampler node for input points.",
          next: "step-4",
        },
        {
          text: "Enable 'Auto Generate Points' in the graph settings.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. No such setting. Explicitly add a Surface Sampler node.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "worldbuilding",
      title: "Surface Sampler Setup",
      image_path: "assets/generated/PCGGraphNotGenerating/step-5.png",
      prompt:
        "<p>You add a Surface Sampler but it still produces 0 points. What does Surface Sampler need to work?</p><p><strong>What does Surface Sampler require?</strong></p>",
      choices: [
        {
          text: "Surface Sampler needs a surface to sample. Ensure a <strong>Landscape</strong> or <strong>Static Mesh</strong> exists within the PCG Volume bounds that the sampler can detect.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Surface Sampler samples existing geometry. Empty volumes produce no points.",
          next: "step-6",
        },
        {
          text: "Surface Sampler creates points in empty space.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Surface Sampler needs surfaces. Use Volume Sampler for empty space.",
          next: "step-5",
        },
        {
          text: "Connect a Ground Height input to the sampler.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. No Ground Height input exists. Ensure geometry is in the volume.",
          next: "step-5",
        },
        {
          text: "Set the sampler's Z range to match terrain height.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Z range helps but won't work without actual surfaces to sample.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "worldbuilding",
      title: "Verifying Points",
      image_path: "assets/generated/PCGGraphNotGenerating/step-6.png",
      prompt:
        "<p>The volume is over landscape but still no points. How do you verify the sampler is detecting the landscape?</p><p><strong>How do you debug sampler output?</strong></p>",
      choices: [
        {
          text: "In the PCG Graph, right-click the Surface Sampler node and select <code>Debug</code> to visualize its output points as debug spheres in the viewport.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Debug visualization shows exactly what each node produces.",
          next: "step-7",
        },
        {
          text: "Add a Print node after the sampler to log point count.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Print logging helps but visual debug is faster for spatial data.",
          next: "step-6",
        },
        {
          text: "Check the sampler's output pin tooltip for count.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Tooltip may show info but debug visualization is more comprehensive.",
          next: "step-6",
        },
        {
          text: "The debugger panel shows sampler output automatically.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Debugger shows status but per-node debug provides visual output.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "worldbuilding",
      title: "Actor Filter Settings",
      image_path: "assets/generated/PCGGraphNotGenerating/step-7.png",
      prompt:
        "<p>Debug shows the sampler isn't finding the Landscape. The Surface Sampler has filter settings. What might be filtering out the landscape?</p><p><strong>What filter setting affects landscape detection?</strong></p>",
      choices: [
        {
          text: "Check the <code>Actor Filter</code> and <code>Actor Tags</code> settings. By default, it may only sample actors with specific tags or classes that the Landscape doesn't have.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Actor filters can exclude landscape. Adjust or remove filters.",
          next: "step-8",
        },
        {
          text: "Landscape is always included by default.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Filters can exclude any actor type. Check the filter settings.",
          next: "step-7",
        },
        {
          text: "Enable 'Include Landscape' in Project Settings.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. No such project setting. Configure the sampler's actor filter.",
          next: "step-7",
        },
        {
          text: "The landscape needs a specific component for PCG sampling.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Landscapes work by default. Check the sampler's filter config.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "worldbuilding",
      title: "Points to Meshes",
      image_path: "assets/generated/PCGGraphNotGenerating/step-8.png",
      prompt:
        "<p>After fixing filters, debug shows points on the landscape (green spheres). But still no rocks appear. What converts points to mesh instances?</p><p><strong>What spawns meshes from points?</strong></p>",
      choices: [
        {
          text: "Add a <strong>Static Mesh Spawner</strong> node after the Surface Sampler, and assign the rock mesh asset in the spawner's settings.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Points are data; the spawner node creates visual instances from them.",
          next: "step-9",
        },
        {
          text: "Points automatically spawn the mesh assigned to the PCG Component.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no component-level mesh. Use a Mesh Spawner node.",
          next: "step-8",
        },
        {
          text: "Set the output mesh in the graph's Output node.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Output node exports data but Mesh Spawner creates instances.",
          next: "step-8",
        },
        {
          text: "Connect points directly to a Mesh asset reference.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Asset references need a spawner node to create instances.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "worldbuilding",
      title: "Mesh Assignment",
      image_path: "assets/generated/PCGGraphNotGenerating/step-9.png",
      prompt:
        "<p>You added a Static Mesh Spawner but it shows 'No Mesh Assigned'. Where do you set the mesh?</p><p><strong>How do you assign the mesh?</strong></p>",
      choices: [
        {
          text: "Select the Static Mesh Spawner node and in the Details panel, add an entry to the <code>Meshes</code> array with your rock Static Mesh asset.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Meshes array can contain multiple meshes for random variation.",
          next: "step-10",
        },
        {
          text: "Drag the mesh from Content Browser onto the node.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Drag-drop may work in some cases but Details panel is reliable.",
          next: "step-9",
        },
        {
          text: "Create a variable in the graph and connect it to the spawner.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Variables work for parameterization but direct assignment is simpler.",
          next: "step-9",
        },
        {
          text: "Right-click the node and select 'Set Mesh'.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. No such context menu. Use the Details panel Meshes array.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "worldbuilding",
      title: "Final Verification",
      image_path: "assets/generated/PCGGraphNotGenerating/step-10.png",
      prompt:
        "<p>Rocks are now appearing on the landscape. What is the best way to verify the complete PCG setup?</p><p><strong>What confirms proper PCG operation?</strong></p>",
      choices: [
        {
          text: "Click <code>Generate</code> again to refresh, then verify rocks appear within the PCG Volume bounds with appropriate density and distribution. Check that regeneration produces consistent or appropriately random results.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Multiple generations confirm the graph works reliably.",
          next: "conclusion",
        },
        {
          text: "Count the exact number of meshes spawned.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Count helps but visual verification of distribution is more important.",
          next: "step-10",
        },
        {
          text: "Check the graph nodes all show green status.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Node status helps but doesn't confirm visual output quality.",
          next: "step-10",
        },
        {
          text: "Save the level to persist the generated content.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Saving is important but verify generation works first.",
          next: "step-10",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/PCGGraphNotGenerating/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've fixed your PCG graph and generated content in the level.</p><h4>Key Takeaways:</h4><ul><li><code>Generate on Load</code> — Enables automatic execution; otherwise use manual Generate</li><li><strong>PCG Debugger</strong> — Shows execution status, data flow, and errors</li><li><strong>Surface Sampler</strong> — Creates points on existing geometry like Landscapes</li><li><code>Actor Filter</code> — Can exclude certain actor types from sampling</li><li><strong>Debug Visualization</strong> — Right-click nodes to show output as debug spheres</li><li><strong>Static Mesh Spawner</strong> — Converts points to mesh instances</li><li><code>Meshes Array</code> — Assign meshes in Details panel for spawning</li></ul>",
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
