window.SCENARIOS["CascadeToNiagaraMigration"] = {
  meta: {
    title: "Legacy Cascade Effect Not Converting to Niagara",
    description:
      "You're migrating a project from UE4 to UE5 and need to convert Cascade particle systems to Niagara. The built-in converter produces a Niagara system that doesn't match the original visual effect.",
    estimateHours: 1.0,
    difficulty: "Beginner",
    category: "VFX",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "CascadeToNiagaraMigration",
      step: "setup",
    },
  ],
  fault: {
    description:
      "Converted Niagara system looks different from original Cascade effect",
    visual_cue:
      "Particles have wrong color, size, or spawn rate after conversion",
  },
  expected: {
    description: "Niagara system matches the original Cascade effect visually",
    validation_action: "verify_visual_match",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "CascadeToNiagaraMigration",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "vfx",
      title: "Initial Observation",
      image_path: "assets/generated/CascadeToNiagaraMigration/step-1.png",
      prompt:
        "<p>You have a fire effect from UE4 that needs to be converted to Niagara for UE5. After using the built-in Cascade to Niagara converter, the flames appear much smaller and the wrong color.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Compare the <strong>Spawn Rate</strong> and <strong>Initial Size</strong> parameters between the original Cascade emitter and the converted Niagara emitter.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. These core parameters often don't convert exactly and are the most common cause of visual differences.",
          next: "step-2",
        },
        {
          text: "Delete the converted system and recreate the effect from scratch in Niagara.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.5hrs. Recreation works but understanding the conversion helps with future migrations.",
          next: "step-1",
        },
        {
          text: "Check if the original Cascade system is using deprecated features no longer supported.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Some features are deprecated, but visual differences usually stem from parameter mapping issues.",
          next: "step-1",
        },
        {
          text: "Update the project settings to enable legacy particle support.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Legacy support keeps Cascade working but doesn't fix the converted Niagara system.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "vfx",
      title: "Understanding the Converter",
      image_path: "assets/generated/CascadeToNiagaraMigration/step-2.png",
      prompt:
        "<p>You notice the Spawn Rate in Niagara is much lower than the original. How does the Cascade to Niagara converter work?</p><p><strong>What does the converter do?</strong></p>",
      choices: [
        {
          text: "The converter creates equivalent Niagara modules but may not perfectly translate dynamic curves, distributions, or certain parameter types.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Understanding the converter's limitations helps you know what to manually adjust.",
          next: "step-3",
        },
        {
          text: "The converter creates a pixel-perfect copy that should match exactly without any manual adjustments.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The converter is approximate, not exact. Manual tweaking is expected.",
          next: "step-2",
        },
        {
          text: "The converter only works with GPU particles and ignores CPU particle settings.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The converter handles both types but may produce different simulation results.",
          next: "step-2",
        },
        {
          text: "The converter preserves all existing Cascade references so the effect runs unchanged.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The converter creates a new Niagara asset; it doesn't keep Cascade running.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "vfx",
      title: "Fixing Spawn Rate",
      image_path: "assets/generated/CascadeToNiagaraMigration/step-3.png",
      prompt:
        "<p>The original Cascade used a <code>Rate</code> distribution that spawned 50-100 particles per second. The converted Niagara shows a constant 25.</p><p><strong>How do you fix the spawn rate?</strong></p>",
      choices: [
        {
          text: "In the <strong>Spawn Rate</strong> module, change the spawn rate to match the original 50-100 range, using a <code>Uniform Float</code> distribution if randomization is needed.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Matching the original spawn distribution is essential for visual fidelity.",
          next: "step-4",
        },
        {
          text: "Add multiple Spawn Rate modules to create variation in the spawn count.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Multiple modules add complexity. A single module with distribution handles randomization.",
          next: "step-3",
        },
        {
          text: "Increase the <code>Pre Cull Scale</code> to compensate for the lower spawn rate.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Pre Cull Scale affects culling, not spawn rate. Adjust spawn rate directly.",
          next: "step-3",
        },
        {
          text: "Enable <code>Burst Spawn</code> to create the missing particles in batches.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Burst spawning is different from continuous rate. Match the original behavior type.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "vfx",
      title: "Fixing Particle Size",
      image_path: "assets/generated/CascadeToNiagaraMigration/step-4.png",
      prompt:
        "<p>With spawn rate corrected, particles are still too small. The original had particles ranging from 10-30 units.</p><p><strong>Where do you adjust particle size in Niagara?</strong></p>",
      choices: [
        {
          text: "Open the <strong>Initialize Particle</strong> module and adjust the <code>Sprite Size</code> or <code>Mesh Scale</code> parameter to match the 10-30 unit range.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Initialize Particle contains the initial size settings for sprites and meshes.",
          next: "step-5",
        },
        {
          text: "Scale the entire Niagara Component in the Details Panel.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Component scaling affects everything uniformly. Individual particle size should be set in the emitter.",
          next: "step-4",
        },
        {
          text: "Add a <code>Scale Sprite Size by Speed</code> module to increase sizes dynamically.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Speed-based scaling is conditional logic. Fix the base size first in Initialize Particle.",
          next: "step-4",
        },
        {
          text: "Modify the sprite material's tiling settings to make particles appear larger.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Material tiling affects texture, not particle size. Use Initialize Particle settings.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "vfx",
      title: "Fixing Color",
      image_path: "assets/generated/CascadeToNiagaraMigration/step-5.png",
      prompt:
        "<p>Size is correct now, but the color is orange instead of the original blue-white flame. Where do you adjust particle color?</p><p><strong>How do you fix the color?</strong></p>",
      choices: [
        {
          text: "In the <strong>Initialize Particle</strong> module, set the <code>Color</code> parameter to the correct blue-white values, or add a <code>Color</code> module to the Particle Update section for animated colors.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Initial color is set in Initialize Particle; animated colors use Particle Update modules.",
          next: "step-6",
        },
        {
          text: "Change the sprite material to one with the correct color baked in.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Material color works but loses flexibility. Particle color is more versatile.",
          next: "step-5",
        },
        {
          text: "Add a Post Process Volume with color grading to shift the effect's appearance.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Post processing affects the whole scene. Fix the particle color directly.",
          next: "step-5",
        },
        {
          text: "Enable HDR on the emitter to allow brighter whites in the flame.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. HDR affects brightness, not hue. Set the correct RGB values first.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "vfx",
      title: "Matching Lifetime",
      image_path: "assets/generated/CascadeToNiagaraMigration/step-6.png",
      prompt:
        "<p>Colors match now. The particles seem to disappear too quickly compared to the original effect.</p><p><strong>What controls particle lifetime in Niagara?</strong></p>",
      choices: [
        {
          text: "In the <strong>Initialize Particle</strong> module, adjust the <code>Lifetime</code> parameter to match the original Cascade lifetime distribution.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Lifetime is set during particle initialization and determines how long each particle exists.",
          next: "step-7",
        },
        {
          text: "Increase the emitter's <code>Duration</code> setting in System Properties.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Duration controls how long the emitter spawns, not individual particle lifetime.",
          next: "step-6",
        },
        {
          text: "Add a <code>Kill Particles</code> module with a later trigger time.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Kill Particles forces early death. You want longer life via Initialize Particle.",
          next: "step-6",
        },
        {
          text: "Slow down the <code>Delta Time</code> multiplier in Emitter Properties.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Slowing time affects all behavior, not just lifetime. Set lifetime directly.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "vfx",
      title: "Checking Velocity",
      image_path: "assets/generated/CascadeToNiagaraMigration/step-7.png",
      prompt:
        "<p>Particles live long enough now, but they're moving in the wrong direction. The original flames rose upward; these spread horizontally.</p><p><strong>How do you fix particle velocity?</strong></p>",
      choices: [
        {
          text: "In the <strong>Initialize Particle</strong> module, check the <code>Velocity</code> parameter and ensure the Z component is positive for upward motion.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Initial velocity direction determines where particles travel. Set the correct axis values.",
          next: "step-8",
        },
        {
          text: "Rotate the Niagara Component to point upward instead of adjusting velocity.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Rotating works but makes setup dependent on placement. Fix velocity for reusable effects.",
          next: "step-7",
        },
        {
          text: "Add a <code>Gravity Force</code> module with negative gravity to make particles rise.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Gravity can help but doesn't replace correct initial velocity. Fix the source first.",
          next: "step-7",
        },
        {
          text: "Change the coordinate space from <code>World</code> to <code>Local</code>.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Coordinate space affects orientation but won't fix incorrect velocity direction values.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "vfx",
      title: "Adding Fade Out",
      image_path: "assets/generated/CascadeToNiagaraMigration/step-8.png",
      prompt:
        "<p>The effect is close now, but particles pop out of existence instead of fading like the original.</p><p><strong>How do you add a fade-out effect?</strong></p>",
      choices: [
        {
          text: "Add a <code>Scale Color</code> or <code>Color</code> module to Particle Update that lerps alpha to 0 over the particle's normalized lifetime.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Animating alpha over lifetime creates smooth fade-out behavior.",
          next: "step-9",
        },
        {
          text: "Enable <code>Soft Particles</code> in the sprite renderer settings.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Soft particles fade near surfaces, not over lifetime. Use color/alpha animation.",
          next: "step-8",
        },
        {
          text: "Reduce the particle's <code>Size by Speed</code> so they shrink before dying.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Size changes are visible but not the same as alpha fade. Animate color alpha for proper fade.",
          next: "step-8",
        },
        {
          text: "Add a low-opacity overlay particle layer to mask the sharp cutoff.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Extra layers add complexity. A simple alpha animation in one emitter is cleaner.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "vfx",
      title: "Performance Check",
      image_path: "assets/generated/CascadeToNiagaraMigration/step-9.png",
      prompt:
        "<p>The effect looks correct now. Before finalizing, you want to ensure the Niagara version performs as well as the original.</p><p><strong>How do you check Niagara performance?</strong></p>",
      choices: [
        {
          text: "Use <code>stat Niagara</code> in the console to view particle counts, simulation times, and identify any performance bottlenecks.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. stat Niagara shows real-time performance metrics for all active Niagara systems.",
          next: "step-10",
        },
        {
          text: "Compare file sizes between the Cascade and Niagara assets in the Content Browser.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. File size doesn't indicate runtime performance. Use stat commands.",
          next: "step-9",
        },
        {
          text: "Check the GPU profiler for frame time impact from the particle system.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. GPU profiler helps but stat Niagara is more specific to particle performance.",
          next: "step-9",
        },
        {
          text: "Spawn multiple instances and visually check for framerate drops.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Visual checking is imprecise. stat Niagara gives exact numbers.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "vfx",
      title: "Final Verification",
      image_path: "assets/generated/CascadeToNiagaraMigration/step-10.png",
      prompt:
        "<p>Performance looks good. How do you verify the final conversion is complete?</p><p><strong>What is the best verification approach?</strong></p>",
      choices: [
        {
          text: "Place both the original Cascade effect and the Niagara version side by side in a test level, then compare visually at runtime.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Side-by-side comparison is the definitive way to verify visual parity.",
          next: "conclusion",
        },
        {
          text: "Delete the original Cascade system and only use the Niagara version going forward.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Keep the original as reference until you've verified the conversion.",
          next: "step-10",
        },
        {
          text: "Check that all module names in Niagara match the original Cascade module names.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Module names differ between systems. Visual comparison is the true test.",
          next: "step-10",
        },
        {
          text: "Export screenshots of both effects and compare them in an image editor.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Screenshots capture one frame. Continuous runtime comparison is more thorough.",
          next: "step-10",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/CascadeToNiagaraMigration/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've successfully converted a Cascade particle system to Niagara and matched the original visual effect.</p><h4>Key Takeaways:</h4><ul><li><strong>Cascade to Niagara Converter</strong> — Provides a starting point but requires manual adjustment</li><li><code>Initialize Particle</code> — Contains spawn rate, size, color, lifetime, and velocity settings</li><li><code>Particle Update</code> — Used for animated behaviors like color/alpha fade over lifetime</li><li><code>stat Niagara</code> — Console command for monitoring Niagara performance</li><li><strong>Side-by-side Comparison</strong> — The definitive verification method for conversion fidelity</li></ul>",
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
