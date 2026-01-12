window.SCENARIOS["NiagaraEmitterNotSpawning"] = {
  meta: {
    title: "Niagara Emitter Not Spawning Particles",
    description:
      "A Niagara particle system placed in the level shows no visible particles during Play in Editor, despite no errors in the Output Log.",
    estimateHours: 0.75,
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
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Scalability settings affect quality, not whether particles spawn at all. Start with the component's own activation settings.",
          next: "step-1",
        },
        {
          text: "Rebuild lighting to ensure particles receive proper illumination from the scene.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Lighting affects how particles look, not whether they spawn. This is unrelated to the core issue.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "vfx",
      title: "Investigating Spawn Settings",
      image_path: "assets/generated/NiagaraEmitterNotSpawning/step-2.png",
      prompt:
        "<p>You confirm <code>Auto Activate</code> is enabled, but particles still don't appear. You open the Niagara System asset in the <strong>Niagara Editor</strong>.</p><p><strong>What do you check next?</strong></p>",
      choices: [
        {
          text: "Examine the <strong>Emitter Properties</strong> module and verify <code>Sim Target</code> is set to <code>CPUSim</code> or <code>GPUSim</code> appropriately.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. If <code>Sim Target</code> is set to GPU but the project doesn't support GPU particles, or vice versa, particles won't simulate.",
          next: "step-3",
        },
        {
          text: "Add a new <strong>Spawn Rate</strong> module to increase the number of particles per second.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Adding spawn modules might help, but first verify the existing simulation target is compatible with your project settings.",
          next: "step-2",
        },
        {
          text: "Check the <strong>Renderer</strong> module's <code>Material</code> slot for a valid material assignment.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Material assignment is important, but wouldn't cause zero particles if the system was working. Check simulation settings first.",
          next: "step-2",
        },
        {
          text: "Increase the <code>Fixed Bounds</code> size in <strong>System Properties</strong> to ensure particles aren't culled.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Bounds affect culling at distance, not complete failure to spawn. This is not the root cause.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "vfx",
      title: "Root Cause Identified",
      image_path: "assets/generated/NiagaraEmitterNotSpawning/step-3.png",
      prompt:
        "<p>You discover the <code>Sim Target</code> is set to <code>GPUSim</code>, but examining <strong>Project Settings</strong> > <strong>Niagara</strong> shows GPU simulation is disabled for this project.</p><p><strong>How do you resolve this?</strong></p>",
      choices: [
        {
          text: "Change the emitter's <code>Sim Target</code> to <code>CPUSim</code> in the <strong>Emitter Properties</strong> module.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Switching to CPU simulation ensures the particles can run on any hardware configuration without requiring GPU compute support.",
          next: "step-4",
        },
        {
          text: "Enable <code>Allow GPU Particles</code> in <strong>Project Settings</strong> > <strong>Rendering</strong> > <strong>Niagara</strong>.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. This would also work, but requires a project-wide change and potential testing on lower-end hardware. Changing the emitter is safer.",
          next: "step-4",
        },
        {
          text: "Convert the Niagara System to a legacy <strong>Cascade</strong> particle system instead.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Cascade is deprecated. The correct fix is to adjust the simulation target, not downgrade your particle system.",
          next: "step-3",
        },
        {
          text: "Set <code>Scalability Mode</code> to <code>Self</code> to bypass project-level restrictions.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Scalability mode affects LOD behavior, not the fundamental simulation target compatibility.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "vfx",
      title: "Verification",
      image_path: "assets/generated/NiagaraEmitterNotSpawning/step-4.png",
      prompt:
        "<p>You changed the <code>Sim Target</code> to <code>CPUSim</code> and saved the asset.</p><p><strong>How do you verify the fix works correctly?</strong></p>",
      choices: [
        {
          text: "Press <strong>Play in Editor</strong> and confirm particles are now visible, then use <code>stat Niagara</code> to verify active emitter count.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Visual confirmation plus the <code>stat Niagara</code> command provides quantitative proof that the emitter is now simulating correctly.",
          next: "conclusion",
        },
        {
          text: "Check the <strong>Content Browser</strong> thumbnail to see if particles appear in the preview.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Thumbnail preview can indicate success, but runtime testing in PIE is the definitive verification method.",
          next: "step-4",
        },
        {
          text: "Open the <strong>Niagara Debugger</strong> panel and look for error messages.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The debugger is useful for complex issues, but simple PIE testing is faster for verifying this fix.",
          next: "step-4",
        },
        {
          text: "Package the project and test on target hardware to ensure compatibility.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.5hrs. Packaging for every small fix is excessive. PIE testing is sufficient for this verification.",
          next: "step-4",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/NiagaraEmitterNotSpawning/conclusion.png",
      prompt:
        "<p><strong>Well done!</strong></p><p>You've successfully diagnosed and fixed a Niagara particle system that wasn't spawning.</p><h4>Key Takeaways:</h4><ul><li><code>Auto Activate</code> — Must be enabled for automatic particle spawning</li><li><code>Sim Target</code> — Must match project GPU/CPU simulation capabilities</li><li><code>stat Niagara</code> — Use to verify emitter activity at runtime</li><li><strong>Emitter Properties</strong> — Primary location for simulation configuration</li></ul>",
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
