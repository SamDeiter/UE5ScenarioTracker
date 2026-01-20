window.SCENARIOS["NiagaraRibbonTrailGaps"] = {
  meta: {
    title: "Niagara Ribbon Trail Has Gaps During Fast Movement",
    description:
      "A ribbon trail effect for a sword slash or projectile shows visible gaps and discontinuities when the source object moves quickly.",
    estimateHours: 1.5,
    difficulty: "Advanced",
    category: "VFX",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "NiagaraRibbonTrailGaps",
      step: "setup",
    },
  ],
  fault: {
    description: "Ribbon trail has visible gaps during fast movement",
    visual_cue: "Sword slash effect shows broken, discontinuous trail segments",
  },
  expected: {
    description: "Ribbon trail renders as a smooth, continuous surface",
    validation_action: "verify_ribbon_smoothness",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "NiagaraRibbonTrailGaps",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "vfx",
      title: "Initial Observation",
      image_path: "assets/generated/NiagaraRibbonTrailGaps/step-1.png",
      prompt:
        "<p>Your sword slash ribbon effect looks smooth when the player swings slowly, but during a fast attack animation, the trail shows visible gaps between ribbon segments.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Check the <code>Spawn Rate</code> of the ribbon emitter to see if particles are being spawned frequently enough to keep up with the movement speed.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Spawn rate directly determines ribbon density. Low rates cause gaps during fast movement.",
          next: "step-2",
        },
        {
          text: "Increase the ribbon width to cover the gaps visually.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Width increase may hide gaps but doesn't fix the underlying spawn rate issue.",
          next: "step-1",
        },
        {
          text: "Check the animation speed to see if it's faster than expected.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Animation speed is correct by design. The effect must adapt to the intended motion.",
          next: "step-1",
        },
        {
          text: "Enable motion blur on the ribbon material.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Motion blur is a post-process effect. The ribbon geometry itself needs to be continuous.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "vfx",
      title: "Understanding Ribbon Topology",
      image_path: "assets/generated/NiagaraRibbonTrailGaps/step-2.png",
      prompt:
        "<p>The spawn rate is 60 particles per second. The sword tip moves up to 2000 units per frame during fast swings. How does ribbon topology work?</p><p><strong>What determines ribbon connectivity?</strong></p>",
      choices: [
        {
          text: "Each spawned particle becomes a vertex in the ribbon mesh. Consecutive particles connect to form quads. Large distances between particles cause stretched or broken segments.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Understanding ribbon topology explains why low spawn rates cause problems at high speeds.",
          next: "step-3",
        },
        {
          text: "Ribbons are pre-generated meshes that stretch to follow the emitter path.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Ribbons are dynamically generated from particle positions, not pre-made meshes.",
          next: "step-2",
        },
        {
          text: "Ribbons automatically interpolate between particles regardless of distance.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Automatic interpolation exists but has limits. Extreme distances still cause issues.",
          next: "step-2",
        },
        {
          text: "Ribbon connectivity is determined by the material's UV settings.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. UVs affect texture mapping, not geometric connectivity. Topology comes from particles.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "vfx",
      title: "Increasing Spawn Rate",
      image_path: "assets/generated/NiagaraRibbonTrailGaps/step-3.png",
      prompt:
        "<p>You calculate that at 2000 units per frame at 60fps, particles spawn 33 units apart. For a smooth trail, you need particles every 5-10 units. What spawn rate do you need?</p><p><strong>What is the appropriate spawn rate?</strong></p>",
      choices: [
        {
          text: "Increase spawn rate to 300-600 particles per second to achieve 5-10 unit spacing at maximum movement speed.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Higher spawn rates create denser ribbon geometry that remains smooth at high velocities.",
          next: "step-4",
        },
        {
          text: "Set spawn rate to match framerate exactly (60 per second).",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Frame-matched spawning doesn't account for movement distance per frame.",
          next: "step-3",
        },
        {
          text: "Use a Spawn Burst at animation start instead of continuous spawn.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Bursts create particles all at once, not along the motion path. Continuous spawning is needed.",
          next: "step-3",
        },
        {
          text: "Set spawn rate based on particle lifetime divided by trail length.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. This formula doesn't account for movement speed, which is the key variable.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "vfx",
      title: "Particle Lifetime Consideration",
      image_path: "assets/generated/NiagaraRibbonTrailGaps/step-4.png",
      prompt:
        "<p>With a spawn rate of 400/sec, you now have lots of particles. The trail is very long because each particle lives for 2 seconds.</p><p><strong>How do you control trail length?</strong></p>",
      choices: [
        {
          text: "Reduce <code>Particle Lifetime</code> to control trail length. Shorter lifetimes create shorter trails regardless of spawn rate.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Lifetime controls how long particles exist, directly affecting trail length.",
          next: "step-5",
        },
        {
          text: "Reduce spawn rate back to 60 to have fewer ribbon segments.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Reducing spawn rate reintroduces gaps. Control length with lifetime, not spawn rate.",
          next: "step-4",
        },
        {
          text: "Add a Kill Particles module that removes particles after a certain distance traveled.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Distance-based killing works but lifetime is simpler for trail length control.",
          next: "step-4",
        },
        {
          text: "Enable ribbon length clamping in the Ribbon Renderer settings.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no ribbon length clamp. Control comes from particle lifetime.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "vfx",
      title: "Enabling Ribbon Tessellation",
      image_path: "assets/generated/NiagaraRibbonTrailGaps/step-5.png",
      prompt:
        "<p>The ribbon is smoother but still has some angular segments at high speeds. You want smoother curves between particles.</p><p><strong>How do you smooth ribbon curves?</strong></p>",
      choices: [
        {
          text: "Enable <code>Tessellation</code> in the <strong>Ribbon Renderer</strong> and configure subdivision count. This adds geometry between particles for smoother curves.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Tessellation subdivides ribbon segments, creating smoother curvature between spawn points.",
          next: "step-6",
        },
        {
          text: "Add a Curl Noise force to randomize particle positions and hide angular segments.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Noise adds randomness, not smoothness. Tessellation geometrically smooths the ribbon.",
          next: "step-5",
        },
        {
          text: "Use a smoother animation curve on the sword swing.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Animation smoothness doesn't affect ribbon tessellation. Enable ribbon tessellation.",
          next: "step-5",
        },
        {
          text: "Apply a blur post-process material to the ribbon.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Post-process blur is a visual filter. The ribbon geometry needs tessellation.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "vfx",
      title: "Configuring Tessellation",
      image_path: "assets/generated/NiagaraRibbonTrailGaps/step-6.png",
      prompt:
        "<p>You've enabled tessellation. What setting controls how smooth the curves become?</p><p><strong>What tessellation setting affects smoothness?</strong></p>",
      choices: [
        {
          text: "Set <code>Tessellation Factor</code> to a higher value (e.g., 4-8) to add more subdivision between ribbon vertices, creating smoother curves.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Higher tessellation factors subdivide segments more, trading GPU cost for smoothness.",
          next: "step-7",
        },
        {
          text: "Enable <code>Adaptive Tessellation</code> to automatically determine subdivision.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Adaptive tessellation exists but manual factor gives you direct control for predictable results.",
          next: "step-6",
        },
        {
          text: "Set tessellation mode to <code>Displacement</code> for smoother surfaces.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Displacement tessellation is for height maps. Ribbon tessellation uses curve subdivision.",
          next: "step-6",
        },
        {
          text: "Increase the ribbon's UV tile count to fake smoothness.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. UV tiling affects texture, not geometry smoothness. Use tessellation factor.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "vfx",
      title: "Handling Ribbon Facing",
      image_path: "assets/generated/NiagaraRibbonTrailGaps/step-7.png",
      prompt:
        "<p>The ribbon is smooth now but disappears when viewed edge-on during certain camera angles. What's happening?</p><p><strong>Why does the ribbon disappear from some angles?</strong></p>",
      choices: [
        {
          text: "The default ribbon <code>Facing Mode</code> is set to <code>Face Camera</code>, causing the ribbon to be edge-on from certain angles. Change to <code>Custom</code> or <code>Screen</code> facing.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Facing mode determines ribbon orientation. Custom facing prevents edge-on visibility issues.",
          next: "step-8",
        },
        {
          text: "Enable two-sided rendering in the material to show both sides of the ribbon.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Two-sided helps with backface visibility but doesn't fix edge-on orientation.",
          next: "step-7",
        },
        {
          text: "Increase ribbon width so it's never thin enough to disappear.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Width increase partially helps but doesn't fix the facing orientation issue.",
          next: "step-7",
        },
        {
          text: "Disable frustum culling on the Niagara component.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Frustum culling is for out-of-view objects. The ribbon is visible but oriented edge-on.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "vfx",
      title: "Custom Facing Vector",
      image_path: "assets/generated/NiagaraRibbonTrailGaps/step-8.png",
      prompt:
        "<p>You set Facing Mode to Custom. How do you define the facing direction for a sword slash that should always be visible from gameplay camera angles?</p><p><strong>How do you set custom facing?</strong></p>",
      choices: [
        {
          text: "Bind the <code>Ribbon Facing Vector</code> attribute to a direction perpendicular to the swing plane (e.g., camera forward or a fixed world axis).",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Custom facing vector lets you orient ribbons for optimal visibility in your specific use case.",
          next: "step-9",
        },
        {
          text: "Set facing to the velocity direction of the sword tip.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Velocity direction changes throughout the swing. A stable reference axis is better.",
          next: "step-8",
        },
        {
          text: "Use the particle's normal attribute as the facing direction.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Particle normals aren't automatically set for ribbons. Define facing explicitly.",
          next: "step-8",
        },
        {
          text: "Enable <code>Auto Facing</code> which calculates the best orientation automatically.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no Auto Facing option. You must specify Custom facing vector binding.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "vfx",
      title: "Ribbon Width Over Life",
      image_path: "assets/generated/NiagaraRibbonTrailGaps/step-9.png",
      prompt:
        "<p>The ribbon is continuous and visible. Now you want the trail to taper off, getting thinner as it ages.</p><p><strong>How do you create a tapered ribbon trail?</strong></p>",
      choices: [
        {
          text: "Bind <code>Ribbon Width</code> to a curve over <code>Normalized Age</code> that starts at full width and decreases to zero.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Width animated over normalized age creates the classic tapered trail effect.",
          next: "step-10",
        },
        {
          text: "Scale particle size down over lifetime; ribbon width will follow automatically.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Particle size and ribbon width are separate attributes. Bind ribbon width directly.",
          next: "step-9",
        },
        {
          text: "Use a gradient alpha in the material to fake the tapering effect.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Alpha gradient fades visibility but doesn't change actual ribbon geometry width.",
          next: "step-9",
        },
        {
          text: "Enable ribbon soft edge in the renderer to gradually fade edges.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Soft edges affect edge blending, not width tapering. Use width curve.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "vfx",
      title: "Sub-Frame Interpolation",
      image_path: "assets/generated/NiagaraRibbonTrailGaps/step-10.png",
      prompt:
        "<p>At extremely high animation speeds (+120fps animations on 60fps game), gaps still appear. What advanced technique fills sub-frame gaps?</p><p><strong>How do you handle sub-frame interpolation?</strong></p>",
      choices: [
        {
          text: "Enable <code>Spawn Per Frame</code> with <code>Interpolated Spawning</code> in the Spawn module to create particles at interpolated positions between frames.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Interpolated spawning fills gaps by spawning at sub-frame positions along the motion path.",
          next: "step-11",
        },
        {
          text: "Increase spawn rate to 1000+ particles per second.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Higher rates help but have limits. Interpolated spawning is more efficient.",
          next: "step-10",
        },
        {
          text: "Lock the animation to the game's framerate to prevent discrepancy.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Frame-locked animations are inflexible. Interpolated spawning handles variable framerates.",
          next: "step-10",
        },
        {
          text: "Add a time dilation module to slow particle updates.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Time dilation affects overall speed, not interpolation. Use interpolated spawning.",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "vfx",
      title: "Performance Optimization",
      image_path: "assets/generated/NiagaraRibbonTrailGaps/step-11.png",
      prompt:
        "<p>The ribbon looks great but spawning 400 particles/sec with tessellation is expensive. How do you optimize for performance?</p><p><strong>What optimization reduces cost without sacrificing quality?</strong></p>",
      choices: [
        {
          text: "Use <code>Ribbon Link Order</code> to ensure particles connect properly, then reduce spawn rate while increasing tessellation to maintain smoothness.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Proper link order with higher tessellation lets you spawn fewer particles while keeping smooth curves.",
          next: "step-12",
        },
        {
          text: "Disable tessellation entirely to reduce GPU load.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Removing tessellation reintroduces angular segments. Balance spawn rate and tessellation.",
          next: "step-11",
        },
        {
          text: "Convert the ribbon to a static mesh for better batching.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Static meshes can't animate dynamically like ribbons. Keep as Niagara ribbon.",
          next: "step-11",
        },
        {
          text: "Reduce ribbon width to lower overdraw.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Width affects overdraw but particle count and tessellation are the main costs.",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "vfx",
      title: "Link Order Configuration",
      image_path: "assets/generated/NiagaraRibbonTrailGaps/step-12.png",
      prompt:
        "<p>You want to configure proper link order. What does Ribbon Link Order control?</p><p><strong>What does Link Order determine?</strong></p>",
      choices: [
        {
          text: "<code>Ribbon Link Order</code> determines how particles connect to form the ribbon. <code>Age</code> links particles by spawn time, ensuring oldest-to-newest connectivity for trails.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Age-based linking ensures correct sequential connectivity for motion trails.",
          next: "step-13",
        },
        {
          text: "Link Order controls rendering priority between overlapping ribbons.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. That's draw order, not link order. Link order controls particle-to-particle connectivity.",
          next: "step-12",
        },
        {
          text: "Link Order sets which emitter spawns ribbon particles first.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Link order is per-particle within an emitter, not emitter execution order.",
          next: "step-12",
        },
        {
          text: "Link Order configures parent-child relationships between particles.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Ribbons don't have parent-child hierarchies. All particles are sequential.",
          next: "step-12",
        },
      ],
    },
    "step-13": {
      skill: "vfx",
      title: "Ribbon ID for Multiple Ribbons",
      image_path: "assets/generated/NiagaraRibbonTrailGaps/step-13.png",
      prompt:
        "<p>You want to add trails from both ends of the sword blade. How do you create multiple separate ribbons from one emitter?</p><p><strong>How do you spawn multiple ribbon trails?</strong></p>",
      choices: [
        {
          text: "Assign different <code>Ribbon ID</code> values to particles that should belong to separate ribbons. Use a parameter to distinguish blade tip vs. blade base particles.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Ribbon ID separates particles into distinct ribbon strips within the same emitter.",
          next: "step-14",
        },
        {
          text: "Create two separate emitters, one for each ribbon trail.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Separate emitters work but Ribbon ID is cleaner for related trails from one source.",
          next: "step-13",
        },
        {
          text: "Use two ribbon renderer modules in the same emitter.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Multiple renderers draw all particles twice. Ribbon ID separates them logically.",
          next: "step-13",
        },
        {
          text: "Set different ribbon widths and the renderer will auto-separate them.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Width doesn't affect connectivity. Ribbon ID explicitly separates trail groups.",
          next: "step-13",
        },
      ],
    },
    "step-14": {
      skill: "vfx",
      title: "Material Setup for Ribbons",
      image_path: "assets/generated/NiagaraRibbonTrailGaps/step-14.png",
      prompt:
        "<p>The ribbon geometry is perfect. Now you want the material to flow along the trail for an energy slash effect.</p><p><strong>What UV setup enables flowing textures on ribbons?</strong></p>",
      choices: [
        {
          text: "Enable <code>UV0</code> in the Ribbon Renderer with <code>Distribution</code> mode. Use <code>Particle Attribute Reader</code> for the age-based U coordinate to scroll textures along the ribbon.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Age-distributed UVs let you animate textures flowing from newest to oldest particles.",
          next: "step-15",
        },
        {
          text: "Use world position offset in the material to animate texture flow.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. WPO affects geometry, not texture flow. UV distribution handles texture animation.",
          next: "step-14",
        },
        {
          text: "Animate the material's texture coordinate node over time.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Material-based animation is uniform. UV distribution adapts to ribbon shape and age.",
          next: "step-14",
        },
        {
          text: "Set the ribbon to use the same UVs as the sword mesh.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Ribbons generate their own UVs. They can't inherit from other meshes.",
          next: "step-14",
        },
      ],
    },
    "step-15": {
      skill: "vfx",
      title: "Final Verification",
      image_path: "assets/generated/NiagaraRibbonTrailGaps/step-15.png",
      prompt:
        "<p>All settings are configured. What is the final validation for the ribbon trail effect?</p><p><strong>How do you verify the complete ribbon setup?</strong></p>",
      choices: [
        {
          text: "Test the sword slash at various animation speeds and camera angles to confirm the ribbon remains smooth, visible, and properly tapered in all gameplay conditions.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Comprehensive testing across speeds and angles validates all the fixes work together.",
          next: "conclusion",
        },
        {
          text: "Check that the particle count matches the expected spawn rate.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Particle count is one metric but visual testing is the true validation.",
          next: "step-15",
        },
        {
          text: "Compare the ribbon's vertex count before and after tessellation.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Vertex count confirms tessellation but doesn't validate gameplay appearance.",
          next: "step-15",
        },
        {
          text: "Review the Output Log for any Niagara warnings or errors.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Logs show errors but don't confirm visual quality. Test in gameplay.",
          next: "step-15",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/NiagaraRibbonTrailGaps/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've fixed ribbon trail gaps during fast movement and created a professional sword slash effect.</p><h4>Key Takeaways:</h4><ul><li><strong>Spawn Rate</strong> — Higher rates prevent gaps during fast movement</li><li><code>Particle Lifetime</code> — Controls ribbon trail length</li><li><code>Tessellation</code> — Subdivides segments for smoother curves</li><li><code>Facing Mode</code> — Custom facing prevents edge-on visibility issues</li><li><code>Width Over Age</code> — Creates tapered trail effect</li><li><code>Interpolated Spawning</code> — Fills sub-frame gaps at extreme speeds</li><li><code>Ribbon ID</code> — Separates multiple ribbons in one emitter</li><li><code>UV Distribution</code> — Enables flowing textures along the ribbon</li></ul>",
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
