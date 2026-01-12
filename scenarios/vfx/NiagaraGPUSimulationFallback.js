window.SCENARIOS["NiagaraGPUSimulationFallback"] = {
  meta: {
    title: "Niagara GPU Particles Fall Back to CPU on Console",
    description:
      "Your Niagara particle system looks great on PC but becomes extremely slow or invisible when tested on consoles due to GPU simulation compatibility issues.",
    estimateHours: 1.5,
    difficulty: "Intermediate",
    category: "VFX",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "NiagaraGPUSimulationFallback",
      step: "setup",
    },
  ],
  fault: {
    description: "GPU particle simulation fails on target platform",
    visual_cue:
      "Particles are invisible or cause severe performance drops on console",
  },
  expected: {
    description:
      "Particles render correctly with appropriate performance on all platforms",
    validation_action: "verify_gpu_sim",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "NiagaraGPUSimulationFallback",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "vfx",
      title: "Initial Observation",
      image_path: "assets/generated/NiagaraGPUSimulationFallback/step-1.png",
      prompt:
        "<p>Your magic spell effect with 50,000 particles runs at 60fps on your development PC. On PlayStation 5, it drops to 15fps and on Nintendo Switch, the particles are completely invisible.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Check the <strong>Sim Target</strong> setting in the emitter to see if it's configured for GPU simulation and whether the target platform supports it.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. GPU simulation has platform-specific support. The Sim Target determines where particles are computed.",
          next: "step-2",
        },
        {
          text: "Reduce the particle count to 5,000 to improve console performance.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Reducing count helps performance but doesn't explain invisibility on Switch. Check settings first.",
          next: "step-1",
        },
        {
          text: "Update the console dev kit firmware to the latest version.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Firmware updates rarely fix particle rendering issues. This is a Niagara configuration problem.",
          next: "step-1",
        },
        {
          text: "Check if the particle material is using unsupported shading features.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Material issues can cause problems, but complete invisibility suggests simulation target issues.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "vfx",
      title: "Understanding Sim Target",
      image_path: "assets/generated/NiagaraGPUSimulationFallback/step-2.png",
      prompt:
        "<p>The emitter is set to <code>GPUCompute Sim</code>. What does this mean for cross-platform compatibility?</p><p><strong>What are the implications of GPU simulation?</strong></p>",
      choices: [
        {
          text: "GPU simulation runs on the graphics card and supports the highest particle counts, but some platforms have limited GPU compute support or require specific shader features.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Understanding GPU compute limitations per platform is essential for cross-platform VFX.",
          next: "step-3",
        },
        {
          text: "GPU simulation is identical to CPU simulation but faster on all platforms.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. GPU and CPU simulation have different capabilities and platform support. They're not interchangeable.",
          next: "step-2",
        },
        {
          text: "GPU simulation only works on PC and automatically converts to CPU on consoles.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Automatic conversion isn't always guaranteed. Some platforms may fail silently without proper fallback.",
          next: "step-2",
        },
        {
          text: "GPU simulation requires DirectX 12 and won't work on platforms using Vulkan.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. GPU compute works across APIs. The issue is platform-specific compute capabilities.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "vfx",
      title: "Nintendo Switch Limitations",
      image_path: "assets/generated/NiagaraGPUSimulationFallback/step-3.png",
      prompt:
        "<p>You discover Nintendo Switch has limited GPU compute support for particles. How do you handle this platform specifically?</p><p><strong>What is the correct approach for Switch?</strong></p>",
      choices: [
        {
          text: "Change the <code>Sim Target</code> to <code>CPU Sim</code> for the Nintendo Switch platform configuration, or create a platform-specific scalability setting.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. CPU simulation is the reliable choice for platforms with limited GPU compute support.",
          next: "step-4",
        },
        {
          text: "Disable the particle system entirely on Nintendo Switch.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Disabling removes visual features. CPU simulation lets you keep the effect with lower fidelity.",
          next: "step-3",
        },
        {
          text: "Use a sprite-based substitute effect instead of particles on Switch.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Substitutes require extra work. CPU particles often work well for moderate counts.",
          next: "step-3",
        },
        {
          text: "Request Nintendo to enable GPU compute in their next SDK update.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.0hrs. Platform capabilities are fixed. Work within existing constraints.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "vfx",
      title: "Setting Up Scalability",
      image_path: "assets/generated/NiagaraGPUSimulationFallback/step-4.png",
      prompt:
        "<p>Rather than hard-coding for Switch, you want a flexible scalability system. Where do you configure platform-specific Niagara settings?</p><p><strong>How do you set up scalability?</strong></p>",
      choices: [
        {
          text: "Use <strong>Niagara Scalability Settings</strong> in Project Settings to define quality levels that automatically switch Sim Target based on platform or hardware.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Scalability settings provide automatic adaptation across platforms without manual overrides.",
          next: "step-5",
        },
        {
          text: "Create separate Niagara assets for each platform (e.g., <code>NS_Spell_PC</code>, <code>NS_Spell_Switch</code>).",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Separate assets work but require maintenance for each change. Scalability is DRY.",
          next: "step-4",
        },
        {
          text: "Use Blueprint logic to spawn different particle systems based on platform.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Blueprint switching adds code complexity. Built-in scalability handles this automatically.",
          next: "step-4",
        },
        {
          text: "Add preprocessor defines to the Niagara source to conditionally compile for different platforms.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Niagara doesn't use traditional preprocessor defines. Use the scalability system.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "vfx",
      title: "Configuring Quality Levels",
      image_path: "assets/generated/NiagaraGPUSimulationFallback/step-5.png",
      prompt:
        "<p>In Niagara Scalability Settings, you see quality levels like Low, Medium, High, and Epic. How do you map these to platforms?</p><p><strong>How do you assign quality levels?</strong></p>",
      choices: [
        {
          text: "In <strong>Project Settings > Scalability</strong>, assign default quality levels per platform (e.g., Switch uses Low, PS5 uses High, PC uses Epic).",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Platform quality mappings let you tune effects once and have them adapt automatically.",
          next: "step-6",
        },
        {
          text: "Quality levels only apply when the user changes settings in-game; they can't be preset per platform.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Platforms have default quality levels. Users can override, but defaults matter.",
          next: "step-5",
        },
        {
          text: "Create custom quality levels named after each platform for clarity.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Platform-named levels add confusion. Standard levels with platform mappings are cleaner.",
          next: "step-5",
        },
        {
          text: "Manually call <code>SetNiagaraQualityLevel</code> on each particle spawn.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Manual calls per spawn are tedious. Global platform defaults are automatic.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "vfx",
      title: "Per-Emitter Scalability",
      image_path: "assets/generated/NiagaraGPUSimulationFallback/step-6.png",
      prompt:
        "<p>With global quality levels set, you need to configure your emitter to respond to them. Where do you set emitter-specific scalability behavior?</p><p><strong>Where is per-emitter scalability configured?</strong></p>",
      choices: [
        {
          text: "In the emitter's <strong>Properties</strong>, expand <code>Scalability</code> and configure spawn count multipliers, distance culling, and Sim Target overrides per quality level.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Per-emitter scalability lets each effect define its own quality behavior.",
          next: "step-7",
        },
        {
          text: "Emitters automatically adapt to quality levels without any configuration.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Emitters need scalability configuration. Automatic adaptation only uses sensible defaults.",
          next: "step-6",
        },
        {
          text: "Add a Scalability Module to the Emitter Update section.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Scalability is in emitter properties, not as a separate module.",
          next: "step-6",
        },
        {
          text: "Create a Data Interface that reads the current quality level and adjusts spawn rate.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Custom Data Interfaces are complex. Built-in scalability handles spawn rate multipliers.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "vfx",
      title: "Setting Spawn Count Multiplier",
      image_path: "assets/generated/NiagaraGPUSimulationFallback/step-7.png",
      prompt:
        "<p>You want 50,000 particles on Epic/PC, 20,000 on Medium/PS5, and 5,000 on Low/Switch. How do you configure this?</p><p><strong>How do you set spawn count per quality level?</strong></p>",
      choices: [
        {
          text: "In Scalability settings, set <code>Spawn Count Scale</code> to 1.0 for Epic, 0.4 for Medium, and 0.1 for Low quality levels.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Spawn Count Scale multiplies the base spawn rate, giving proportional reduction per quality level.",
          next: "step-8",
        },
        {
          text: "Create three different Spawn Rate modules and enable them conditionally.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Conditional modules add complexity. Spawn Count Scale is the standard approach.",
          next: "step-7",
        },
        {
          text: "Set the base spawn rate to 5,000 and add a Max Spawn Count parameter.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Max caps don't scale dynamically. Use Spawn Count Scale for proportional quality adaptation.",
          next: "step-7",
        },
        {
          text: "Use a curve that reduces spawn rate based on GPU utilization.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Runtime GPU monitoring is complex. Quality levels are predetermined and reliable.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "vfx",
      title: "Forcing CPU on Low Quality",
      image_path: "assets/generated/NiagaraGPUSimulationFallback/step-8.png",
      prompt:
        "<p>For the Low quality level (Switch), you also need to force CPU simulation. How do you configure this?</p><p><strong>How do you set Sim Target per quality level?</strong></p>",
      choices: [
        {
          text: "In the emitter's Scalability settings, enable <code>Override Sim Target</code> for the Low quality level and set it to <code>CPU Sim</code>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Sim Target override per quality level ensures appropriate simulation on each platform.",
          next: "step-9",
        },
        {
          text: "Set the base Sim Target to CPU so it works on all platforms.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. CPU base works everywhere but sacrifices GPU performance on capable platforms.",
          next: "step-8",
        },
        {
          text: "Create a CPU-only version of the emitter and inherit from it on Low quality.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Inheritance adds complexity. Sim Target override achieves the same result simply.",
          next: "step-8",
        },
        {
          text: "Use a Platform Check node in the System Script to dynamically switch simulation.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Script-based platform checks are fragile. Quality-based overrides are the designed solution.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "vfx",
      title: "Testing on Target Platforms",
      image_path: "assets/generated/NiagaraGPUSimulationFallback/step-9.png",
      prompt:
        "<p>Scalability is configured. How do you test the different quality levels without deploying to each console?</p><p><strong>How do you test scalability locally?</strong></p>",
      choices: [
        {
          text: "Use <code>sg.EffectsQuality X</code> console command (where X is 0-3) to simulate different scalability levels in PIE. Verify behavior at each level.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Console commands let you test all quality levels quickly on your development machine.",
          next: "step-10",
        },
        {
          text: "Deploy builds to each target platform and test on actual hardware.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.5hrs. Device testing is important but console commands speed up iteration on scalability logic.",
          next: "step-9",
        },
        {
          text: "Manually edit the emitter settings to simulate each quality level's configuration.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Manual editing is slow and error-prone. Console commands toggle quality dynamically.",
          next: "step-9",
        },
        {
          text: "Check the Output Log for quality level messages during startup.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Logs show current settings but don't let you test different levels. Use console commands.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "vfx",
      title: "Verifying CPU Fallback",
      image_path: "assets/generated/NiagaraGPUSimulationFallback/step-10.png",
      prompt:
        "<p>You set <code>sg.EffectsQuality 0</code> to simulate Low/Switch and the effect still looks reasonable with 5,000 CPU particles.</p><p><strong>What is the final validation step?</strong></p>",
      choices: [
        {
          text: "Use <code>stat Niagara</code> to confirm particles are running on CPU Sim and check that frame time impact is acceptable on target hardware's estimated performance.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. stat Niagara shows simulation type and performance. Validate before console deployment.",
          next: "step-11",
        },
        {
          text: "Compare screenshots between quality levels to ensure visual parity.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Visual comparison is useful but stat Niagara confirms the technical behavior change.",
          next: "step-10",
        },
        {
          text: "Check that the emitter properties show CPU Sim in the editor.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Editor may show base settings. stat Niagara confirms runtime behavior.",
          next: "step-10",
        },
        {
          text: "Verify the file size of the Niagara system decreased due to simpler simulation.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. File size doesn't change with Sim Target. It's a runtime behavior change.",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "vfx",
      title: "Adding Distance Culling",
      image_path: "assets/generated/NiagaraGPUSimulationFallback/step-11.png",
      prompt:
        "<p>To further optimize for low-end platforms, you want to cull the effect when the player is far away. Where is this configured?</p><p><strong>How do you add distance-based culling?</strong></p>",
      choices: [
        {
          text: "In the emitter's Scalability settings, configure <code>Visibility Cull Distance</code> to disable the emitter when it's beyond a certain distance from the camera.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Distance culling saves performance by not simulating effects that wouldn't be visible anyway.",
          next: "step-12",
        },
        {
          text: "Add a Distance Check module in Particle Update that kills particles far from camera.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Per-particle distance checks are expensive. Emitter-level culling is more efficient.",
          next: "step-11",
        },
        {
          text: "Enable <code>Cull Distance Volume</code> actors in the level to control particle visibility.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Cull volumes are for meshes. Niagara has built-in scalability distance settings.",
          next: "step-11",
        },
        {
          text: "Set the Niagara Component's render bounds to a smaller size to trigger earlier culling.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Bounds affect render culling, not simulation. Use Visibility Cull Distance for full culling.",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "vfx",
      title: "Final Verification",
      image_path: "assets/generated/NiagaraGPUSimulationFallback/step-12.png",
      prompt:
        "<p>All scalability settings are configured. What is the best way to verify the complete cross-platform solution?</p><p><strong>What is the final verification step?</strong></p>",
      choices: [
        {
          text: "Test the effect on actual target hardware (PS5 and Switch dev kits) to confirm both performance and visual quality meet expectations.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. Device testing is the definitive verification that scalability works correctly on each platform.",
          next: "conclusion",
        },
        {
          text: "Run the packaged game on PC with different quality presets to simulate consoles.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. PC simulation helps but real hardware has unique performance characteristics.",
          next: "step-12",
        },
        {
          text: "Review the scalability settings documentation to ensure all options are correct.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Documentation review is good practice but doesn't substitute for device testing.",
          next: "step-12",
        },
        {
          text: "Have QA team test on their machines with varying hardware specs.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. PC hardware variance helps but console-specific testing is essential.",
          next: "step-12",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/NiagaraGPUSimulationFallback/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've successfully configured cross-platform scalability for Niagara particle systems.</p><h4>Key Takeaways:</h4><ul><li><code>Sim Target</code> — GPU Compute for high-end, CPU Sim for limited platforms</li><li><strong>Niagara Scalability Settings</strong> — Project-wide configuration for quality levels</li><li><code>Spawn Count Scale</code> — Multiplier for reducing particle count per quality level</li><li><code>Override Sim Target</code> — Forces specific simulation type per quality level</li><li><code>sg.EffectsQuality X</code> — Console command to test scalability levels (0=Low, 3=Epic)</li><li><code>Visibility Cull Distance</code> — Distance-based emitter culling for optimization</li><li><strong>Device Testing</strong> — Essential for validating cross-platform behavior</li></ul>",
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
