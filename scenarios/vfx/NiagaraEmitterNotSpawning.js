window.SCENARIOS["NiagaraEmitterNotSpawning"] = {
  meta: {
    title: "Niagara Emitter Not Spawning Particles",
    description:
      "A Niagara particle system placed in the level shows no visible particles during Play in Editor, despite no errors in the Output Log.",
    estimateHours: 1.0,
    difficulty: "Beginner",
    category: "VFX",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "NiagaraEmitterNotSpawning",
      step: "setup",
    },
  ],
  fault: {
    description: "Niagara system exists but no particles render",
    visual_cue: "Empty space where particle effect should appear",
  },
  expected: {
    description: "Particles spawn and render correctly",
    validation_action: "verify_particles_visible",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "NiagaraEmitterNotSpawning",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "vfx",
      title: "Initial Observation",
      image_path: "assets/generated/NiagaraEmitterNotSpawning/step-1.png",
      prompt:
        "<p>You place a Niagara particle system in your level. When you press <strong>Play in Editor</strong>, no particles appear. The <strong>Output Log</strong> shows no errors.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Select the Niagara System in the viewport and check if <code>Auto Activate</code> is enabled in the <strong>Details Panel</strong>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The <code>Auto Activate</code> property determines if the system starts automatically. If disabled, particles won't spawn until activated via Blueprint.",
          next: "step-2",
        },
        {
          text: "Open the <strong>Material Editor</strong> and verify the particle material has correct blend mode settings.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Material issues can cause invisible particles, but checking activation state is the faster first step for a completely non-spawning system.",
          next: "step-1",
        },
        {
          text: "Check the <strong>World Settings</strong> for global particle system scalability overrides.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Scalability settings affect quality, not whether particles spawn at all. Start with the component's own activation settings.",
          next: "step-1",
        },
        {
          text: "Rebuild lighting to ensure particles receive proper illumination from the scene.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Lighting affects how particles look, not whether they spawn. This is unrelated to the core issue.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "vfx",
      title: "Checking Auto Activate",
      image_path: "assets/generated/NiagaraEmitterNotSpawning/step-2.png",
      prompt:
        "<p>You select the Niagara System component in the level. Where exactly do you find the <code>Auto Activate</code> setting?</p><p><strong>Where is this property located?</strong></p>",
      choices: [
        {
          text: "In the <strong>Details Panel</strong>, look under the <code>Activation</code> category for the <code>Auto Activate</code> checkbox.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The Activation category contains settings that control when the particle system starts.",
          next: "step-3",
        },
        {
          text: "Open the Niagara System asset and check the <strong>System Properties</strong> panel.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The asset has different settings. Per-instance Auto Activate is on the component in the level.",
          next: "step-2",
        },
        {
          text: "Right-click the component and select <strong>Properties</strong> from the context menu.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no Properties context menu. Use the Details Panel on the right side of the editor.",
          next: "step-2",
        },
        {
          text: "Check the <strong>World Outliner</strong> for activation state icons.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The outliner shows hierarchy, not component properties. Use the Details Panel.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "vfx",
      title: "Verifying Auto Activate Status",
      image_path: "assets/generated/NiagaraEmitterNotSpawning/step-3.png",
      prompt:
        "<p>You find that <code>Auto Activate</code> is already enabled. The system should be activating but still no particles appear.</p><p><strong>What do you check next?</strong></p>",
      choices: [
        {
          text: "Open the Niagara System asset in the <strong>Niagara Editor</strong> and check the <code>Emitter Properties</code> module for simulation settings.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. If the component is configured correctly, the issue may be inside the Niagara System asset itself.",
          next: "step-4",
        },
        {
          text: "Check if there's a Blueprint that's calling <code>Deactivate</code> on the particle system.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Script interference is possible, but check the asset configuration first before debugging Blueprints.",
          next: "step-3",
        },
        {
          text: "Increase the <code>Bounds Scale</code> to ensure particles aren't being culled immediately.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Bounds affect visibility at distance. If no particles spawn at all, it's not a culling issue.",
          next: "step-3",
        },
        {
          text: "Delete and re-add the Niagara component to reset any cached state.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Re-adding won't fix configuration issues. Check the asset contents first.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "vfx",
      title: "Opening the Niagara Editor",
      image_path: "assets/generated/NiagaraEmitterNotSpawning/step-4.png",
      prompt:
        "<p>You double-click the Niagara System asset to open it. The <strong>Niagara Editor</strong> opens showing emitters and modules.</p><p><strong>What should you examine first?</strong></p>",
      choices: [
        {
          text: "Select the emitter and check the <code>Emitter Properties</code> module to verify the <code>Sim Target</code> setting.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Sim Target controls whether particles simulate on CPU or GPU. Incompatible settings cause silent failure.",
          next: "step-5",
        },
        {
          text: "Look at the <code>Spawn Rate</code> module to see if particles are being spawned.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Spawn Rate is important but if Sim Target is incompatible, spawn rate doesn't matter.",
          next: "step-4",
        },
        {
          text: "Check the <code>Sprite Renderer</code> module for material assignment.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Material issues cause invisible (but spawning) particles. Check simulation compatibility first.",
          next: "step-4",
        },
        {
          text: "Review the <code>Particle Spawn</code> stack to see what initial properties are set.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Spawn properties affect behavior but not whether simulation runs. Check Emitter Properties.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "vfx",
      title: "Understanding Sim Target",
      image_path: "assets/generated/NiagaraEmitterNotSpawning/step-5.png",
      prompt:
        "<p>You find the <code>Sim Target</code> is set to <code>GPUCompute Sim</code>. What does this setting control?</p><p><strong>What is the significance of Sim Target?</strong></p>",
      choices: [
        {
          text: "It determines whether particles simulate on the GPU or CPU. GPU simulation requires specific project settings and hardware support.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. If GPU simulation is disabled in project settings or unsupported, GPU emitters won't work.",
          next: "step-6",
        },
        {
          text: "It controls the target platform the particle system is optimized for.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. It's about simulation location (CPU vs GPU), not platform targeting specifically.",
          next: "step-5",
        },
        {
          text: "It sets the maximum number of particles the system can simulate simultaneously.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Particle count is a separate setting. Sim Target is about where computation happens.",
          next: "step-5",
        },
        {
          text: "It determines whether the simulation runs in the editor or only at runtime.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Both CPU and GPU sim run in editor. The choice is about compute location, not editor vs runtime.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "vfx",
      title: "Checking Project Settings",
      image_path: "assets/generated/NiagaraEmitterNotSpawning/step-6.png",
      prompt:
        "<p>You need to verify if GPU simulation is enabled in the project. Where do you check this setting?</p><p><strong>Where are the Niagara GPU settings?</strong></p>",
      choices: [
        {
          text: "Open <strong>Project Settings</strong> > <strong>Engine</strong> > <strong>Rendering</strong> and look for Niagara GPU simulation settings.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The Rendering section contains GPU-related settings including Niagara compute options.",
          next: "step-7",
        },
        {
          text: "Check <strong>Project Settings</strong> > <strong>Plugins</strong> > <strong>Niagara</strong> for simulation mode.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Niagara plugin settings exist but GPU sim is in the Rendering category.",
          next: "step-6",
        },
        {
          text: "Look in <strong>Editor Preferences</strong> for Niagara performance settings.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Editor Preferences affect the editor UI. Project Settings control runtime behavior.",
          next: "step-6",
        },
        {
          text: "Check the Niagara System's <strong>System Properties</strong> for per-asset GPU control.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Per-asset settings exist but the global enable/disable is in Project Settings.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "vfx",
      title: "Identifying the Issue",
      image_path: "assets/generated/NiagaraEmitterNotSpawning/step-7.png",
      prompt:
        "<p>You discover that GPU particle simulation is disabled in Project Settings. Your emitter uses <code>GPUCompute Sim</code>.</p><p><strong>What is the best fix for this situation?</strong></p>",
      choices: [
        {
          text: "Change the emitter's <code>Sim Target</code> from <code>GPUCompute Sim</code> to <code>CPUSim</code> in the Emitter Properties module.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Switching to CPU simulation ensures compatibility without requiring project-wide changes.",
          next: "step-8",
        },
        {
          text: "Enable GPU simulation in Project Settings to support this emitter.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. This works but requires testing on all target platforms to ensure GPU support is available.",
          next: "step-8",
        },
        {
          text: "Create a new Niagara System from scratch using a CPU-based template.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Recreating is wasteful. Simply change the Sim Target on the existing emitter.",
          next: "step-7",
        },
        {
          text: "Add a fallback CPU emitter that activates when GPU isn't available.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Fallback systems are advanced. For now, just switch to CPU simulation.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "vfx",
      title: "Making the Change",
      image_path: "assets/generated/NiagaraEmitterNotSpawning/step-8.png",
      prompt:
        "<p>You change <code>Sim Target</code> to <code>CPUSim</code> in the Niagara Editor. What should you do before testing?</p><p><strong>What is the next step?</strong></p>",
      choices: [
        {
          text: "Click <strong>Apply</strong> and <strong>Save</strong> the Niagara System asset to persist the change.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.05hrs. Saving ensures the change is applied to all instances of this system in the level.",
          next: "step-9",
        },
        {
          text: "Compile the emitter using the <strong>Compile</strong> button in the toolbar.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. The system auto-compiles on change. Saving is the important step for persistence.",
          next: "step-8",
        },
        {
          text: "Close the Niagara Editor; changes are applied automatically.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Closing without saving may lose changes. Explicitly save the asset.",
          next: "step-8",
        },
        {
          text: "Restart the editor to fully reload the particle system.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Restart is unnecessary. Saving applies changes immediately.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "vfx",
      title: "Initial Test",
      image_path: "assets/generated/NiagaraEmitterNotSpawning/step-9.png",
      prompt:
        "<p>You've saved the Niagara System. How do you verify the particles now spawn correctly?</p><p><strong>What is the best test method?</strong></p>",
      choices: [
        {
          text: "Press <strong>Play in Editor</strong> and observe the particle system location to confirm particles are now visible.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. PIE is the quickest way to verify runtime particle behavior.",
          next: "step-10",
        },
        {
          text: "Use the <strong>Preview</strong> window in the Niagara Editor to see if particles appear.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The preview is useful but PIE tests the actual in-level component behavior.",
          next: "step-9",
        },
        {
          text: "Check the Content Browser thumbnail for an updated particle preview.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Thumbnails may not update immediately. Runtime testing is more reliable.",
          next: "step-9",
        },
        {
          text: "Package the project to test final runtime behavior.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.5hrs. Packaging for basic verification is excessive. Use PIE.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "vfx",
      title: "Final Verification",
      image_path: "assets/generated/NiagaraEmitterNotSpawning/step-10.png",
      prompt:
        "<p>Particles are now visible in PIE! How do you confirm the system is running efficiently and correctly?</p><p><strong>What additional verification should you perform?</strong></p>",
      choices: [
        {
          text: "Use the <code>stat Niagara</code> console command to see active emitter count and particle simulation statistics.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. stat Niagara provides quantitative data about active systems and particle counts.",
          next: "conclusion",
        },
        {
          text: "Visually compare the particle effect to the original design reference.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Visual comparison is good for art direction but doesn't verify technical health. Use stat commands.",
          next: "step-10",
        },
        {
          text: "Check <code>stat fps</code> to ensure particles don't cause performance issues.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. FPS is useful but stat Niagara gives more specific information about particle behavior.",
          next: "step-10",
        },
        {
          text: "Open the <strong>Session Frontend</strong> to view particle system profiling data.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Session Frontend is for detailed profiling. stat Niagara is quicker for basic verification.",
          next: "step-10",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/NiagaraEmitterNotSpawning/conclusion.png",
      prompt:
        "<p><strong>Well done!</strong></p><p>You've successfully diagnosed and fixed a Niagara particle system that wasn't spawning.</p><h4>Key Takeaways:</h4><ul><li><code>Auto Activate</code> — Must be enabled on the component for automatic spawning</li><li><code>Sim Target</code> — Must match project GPU/CPU simulation capabilities</li><li><code>CPUSim</code> — Compatible with all hardware; use for maximum compatibility</li><li><code>GPUCompute Sim</code> — Requires GPU particle support enabled in Project Settings</li><li><code>stat Niagara</code> — Console command to verify emitter activity at runtime</li><li><strong>Emitter Properties</strong> — Primary location for simulation configuration</li></ul>",
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
