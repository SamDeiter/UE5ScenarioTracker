window.SCENARIOS["HLODNotGenerating"] = {
  meta: {
    title: "HLOD Meshes Not Generating for World Partition Level",
    description:
      "You've set up HLOD layers for your open world level but the generated HLOD meshes don't appear in the build, leaving distant areas empty instead of showing simplified geometry.",
    estimateHours: 1.0,
    difficulty: "Beginner",
    category: "Worldbuilding",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "HLODNotGenerating",
      step: "setup",
    },
  ],
  fault: {
    description: "HLOD meshes fail to generate for World Partition cells",
    visual_cue: "Distant areas pop in suddenly instead of showing HLOD proxies",
  },
  expected: {
    description:
      "HLOD meshes display smoothly at distance before full-detail actors load",
    validation_action: "verify_hlod_generation",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "HLODNotGenerating",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "worldbuilding",
      title: "Initial Observation",
      image_path: "assets/generated/HLODNotGenerating/step-1.png",
      prompt:
        "<p>When flying over your open world, distant areas are completely empty until you get close, then suddenly pop in. You expected HLOD simplified meshes to show at distance.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Open <strong>World Partition</strong> settings and verify that HLOD layers are properly configured and enabled for the level.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. HLOD configuration in World Partition settings is the foundation for HLOD generation.",
          next: "step-2",
        },
        {
          text: "Increase the <code>Loading Range</code> so actors load from further away.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Loading range affects when full actors load, not HLOD. Check HLOD configuration first.",
          next: "step-1",
        },
        {
          text: "Enable <code>Distance Culling</code> on all static meshes to prevent pop-in.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Distance culling hides objects, it doesn't create HLOD proxies. Configure HLOD.",
          next: "step-1",
        },
        {
          text: "Check if actors have <code>Is Spatially Loaded</code> enabled.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Spatial loading affects streaming, not HLOD generation. Check HLOD settings.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "worldbuilding",
      title: "Understanding HLOD Setup",
      image_path: "assets/generated/HLODNotGenerating/step-2.png",
      prompt:
        "<p>You find World Partition is enabled but there's no HLOD Setup Asset assigned. What does the HLOD Setup control?</p><p><strong>What does HLOD Setup configure?</strong></p>",
      choices: [
        {
          text: "The <strong>HLOD Setup</strong> defines HLOD layers (tiers), generation settings, and which actors participate in HLOD. Without it, no HLODs are generated.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. HLOD Setup is required for the system to know how to generate hierarchical LODs.",
          next: "step-3",
        },
        {
          text: "HLOD Setup only controls the visual quality of the generated proxy meshes.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Quality is one aspect, but Setup defines the entire HLOD pipeline and layer structure.",
          next: "step-2",
        },
        {
          text: "HLOD Setup specifies which hardware platforms receive HLOD support.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Platform targeting is elsewhere. HLOD Setup defines layers and generation rules.",
          next: "step-2",
        },
        {
          text: "HLOD is generated automatically without any setup asset.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. HLOD requires explicit configuration via an HLOD Setup asset.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "worldbuilding",
      title: "Creating HLOD Setup",
      image_path: "assets/generated/HLODNotGenerating/step-3.png",
      prompt:
        "<p>You need to create an HLOD Setup Asset. Where do you create it?</p><p><strong>How do you create an HLOD Setup?</strong></p>",
      choices: [
        {
          text: "Right-click in the <strong>Content Browser</strong>, select <code>World Partition</code> > <code>HLOD Setup</code> to create a new HLOD Setup asset.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. HLOD Setup assets are created from the Content Browser and assigned to the World Partition.",
          next: "step-4",
        },
        {
          text: "HLOD Setup is created automatically when you enable World Partition.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. World Partition doesn't auto-create HLOD Setup. You must create it manually.",
          next: "step-3",
        },
        {
          text: "Use the HLOD Outliner to generate a default setup.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The HLOD Outliner views existing HLODs. Create the Setup asset from Content Browser.",
          next: "step-3",
        },
        {
          text: "Import an HLOD Setup from the World Partition template project.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Templates may help but creating your own setup gives you proper control.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "worldbuilding",
      title: "Configuring HLOD Layers",
      image_path: "assets/generated/HLODNotGenerating/step-4.png",
      prompt:
        "<p>You've created an HLOD Setup. Now you need to define HLOD layers. What do layers represent?</p><p><strong>What are HLOD layers?</strong></p>",
      choices: [
        {
          text: "HLOD layers are distance-based tiers. Layer 0 is closest, showing more detail. Higher layers are for greater distances with more aggressive simplification.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Layers create a hierarchy of detail levels at increasing distances.",
          next: "step-5",
        },
        {
          text: "HLOD layers separate different types of content (foliage, buildings, props) for independent streaming.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Content types can have different HLOD rules, but layers are distance-based tiers.",
          next: "step-4",
        },
        {
          text: "HLOD layers control the rendering order of proxy meshes.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Render order is determined by the renderer. Layers define LOD distance hierarchy.",
          next: "step-4",
        },
        {
          text: "HLOD layers are the same as World Partition Data Layers.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Data Layers control streaming groups. HLOD layers are separate LOD distance tiers.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "worldbuilding",
      title: "Setting Layer Distances",
      image_path: "assets/generated/HLODNotGenerating/step-5.png",
      prompt:
        "<p>You add Layer 0 with default settings. What key parameter determines when this HLOD layer becomes visible?</p><p><strong>What controls HLOD layer visibility distance?</strong></p>",
      choices: [
        {
          text: "Set the <code>Cell Size</code> and <code>Loading Range</code> for the layer. The loading range determines at what distance this HLOD tier replaces the previous tier or the full-detail actors.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Cell Size groups actors, and Loading Range controls the switch distance.",
          next: "step-6",
        },
        {
          text: "Set a minimum screen-size percentage that triggers the HLOD swap.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Screen size affects individual LOD levels, but HLOD layers use distance-based loading range.",
          next: "step-5",
        },
        {
          text: "Configure the camera far clip plane to match the HLOD distance.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Far clip plane cuts off all rendering. HLOD loading range controls proxy visibility.",
          next: "step-5",
        },
        {
          text: "Enable distance-based visibility in each static mesh's LOD settings.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Per-mesh LOD is different from HLOD layer configuration. Set layer loading range.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "worldbuilding",
      title: "Assigning HLOD Setup to Level",
      image_path: "assets/generated/HLODNotGenerating/step-6.png",
      prompt:
        "<p>Your HLOD Setup has one layer configured. How do you assign it to your World Partition level?</p><p><strong>Where do you assign the HLOD Setup?</strong></p>",
      choices: [
        {
          text: "In <strong>World Settings</strong>, under the <code>World Partition</code> section, assign your HLOD Setup asset to the <code>HLOD Layer Setup</code> property.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. World Settings is where you link the HLOD Setup to your specific level.",
          next: "step-7",
        },
        {
          text: "Drop the HLOD Setup asset into the level viewport.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. HLOD Setup isn't placed as an actor. Assign it in World Settings.",
          next: "step-6",
        },
        {
          text: "Right-click the level in Content Browser and select 'Apply HLOD Setup'.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no right-click option. Assign via World Settings in the level.",
          next: "step-6",
        },
        {
          text: "Add the HLOD Setup to the World Partition Runtime Hash.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Runtime Hash is for streaming grids. HLOD Setup goes in World Settings.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "worldbuilding",
      title: "Generating HLODs",
      image_path: "assets/generated/HLODNotGenerating/step-7.png",
      prompt:
        "<p>HLOD Setup is assigned. HLODs still don't exist because they haven't been built yet. How do you generate them?</p><p><strong>How do you build HLOD assets?</strong></p>",
      choices: [
        {
          text: "Open <strong>Window</strong> > <strong>World Partition</strong> > <strong>HLOD Outliner</strong>, then click <code>Build HLODs</code> to generate proxy meshes for all cells.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. The HLOD Outliner provides tools to build and manage HLOD content.",
          next: "step-8",
        },
        {
          text: "HLODs generate automatically when you save the level.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. HLOD generation is an explicit build step, not automatic on save.",
          next: "step-7",
        },
        {
          text: "Use Build > Build Lighting to also generate HLODs.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Lighting build is separate. HLODs are built from the HLOD Outliner.",
          next: "step-7",
        },
        {
          text: "Run the HLOD build from command line only during packaging.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Command line builds work but the HLOD Outliner gives you editor-time building.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "worldbuilding",
      title: "Actor HLOD Participation",
      image_path: "assets/generated/HLODNotGenerating/step-8.png",
      prompt:
        "<p>After building, some cells have HLODs but others are empty. Certain actors aren't being included.</p><p><strong>What controls whether an actor participates in HLOD?</strong></p>",
      choices: [
        {
          text: "Check the actor's <code>HLOD</code> settings in the Details panel. The <code>Include in HLOD</code> property must be enabled for the actor to be merged into HLOD proxies.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Each actor can opt in or out of HLOD generation via its Details panel.",
          next: "step-9",
        },
        {
          text: "Only Static Mesh Actors participate in HLOD; other types are excluded.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Various actor types can participate. Check the Include in HLOD property.",
          next: "step-8",
        },
        {
          text: "Actors must be added to a specific HLOD layer manually in the Outliner.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Layer assignment is automatic based on cell location. Per-actor Include flag controls participation.",
          next: "step-8",
        },
        {
          text: "Actors with complex materials are automatically excluded from HLOD.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Material complexity doesn't auto-exclude. Check the Include in HLOD setting.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "worldbuilding",
      title: "Rebuilding After Changes",
      image_path: "assets/generated/HLODNotGenerating/step-9.png",
      prompt:
        "<p>You enabled 'Include in HLOD' on the missing actors. What do you need to do for the changes to take effect?</p><p><strong>What step is required after changing HLOD settings?</strong></p>",
      choices: [
        {
          text: "Rebuild HLODs for the affected cells using the <strong>HLOD Outliner</strong>. You can rebuild individual cells or all cells at once.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. HLOD changes require a rebuild. The Outliner lets you rebuild selectively or completely.",
          next: "step-10",
        },
        {
          text: "Changes take effect automatically on the next Play In Editor session.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. PIE uses existing HLOD builds. You must explicitly rebuild.",
          next: "step-9",
        },
        {
          text: "Save the level to trigger automatic HLOD regeneration.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Saving doesn't trigger HLOD builds. Use the HLOD Outliner rebuild.",
          next: "step-9",
        },
        {
          text: "Restart the editor to pick up the new actor settings.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Restart doesn't rebuild HLODs. Use the HLOD Outliner.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "worldbuilding",
      title: "Final Verification",
      image_path: "assets/generated/HLODNotGenerating/step-10.png",
      prompt:
        "<p>HLODs are rebuilt. How do you verify they're working correctly at runtime?</p><p><strong>How do you test HLOD functionality?</strong></p>",
      choices: [
        {
          text: "Use <code>wp.Runtime.ToggleDrawRuntimeCellsDetails</code> console command in PIE to visualize which HLOD cells are loaded and at what streaming state.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The debug visualization shows HLOD cell states and confirms proper streaming.",
          next: "conclusion",
        },
        {
          text: "Fly to maximum distance and check if geometry is visible.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Visual inspection helps but debug commands give precise cell state information.",
          next: "step-10",
        },
        {
          text: "Check the Content Browser for generated HLOD mesh assets.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Generated assets confirm builds but runtime testing verifies streaming works.",
          next: "step-10",
        },
        {
          text: "Review the Output Log for HLOD loading messages.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Logs show technical info but visual debug commands are more actionable.",
          next: "step-10",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/HLODNotGenerating/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've successfully configured and generated HLOD for your World Partition level.</p><h4>Key Takeaways:</h4><ul><li><strong>HLOD Setup Asset</strong> — Required configuration defining layers and rules</li><li><code>HLOD Layers</code> — Distance-based hierarchy of simplified representations</li><li><code>Cell Size</code> and <code>Loading Range</code> — Control HLOD cell scope and visibility distance</li><li><code>Include in HLOD</code> — Per-actor property controlling HLOD participation</li><li><strong>HLOD Outliner</strong> — Tool for building and managing HLOD content</li><li><code>wp.Runtime.ToggleDrawRuntimeCellsDetails</code> — Debug visualization for HLOD streaming</li></ul>",
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
