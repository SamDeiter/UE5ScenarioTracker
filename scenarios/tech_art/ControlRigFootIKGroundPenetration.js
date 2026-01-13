window.SCENARIOS["ControlRigFootIKGroundPenetration"] = {
  meta: {
    title: "Control Rig Foot IK Feet Penetrate Through Ground",
    description:
      "Your character's Control Rig foot IK setup causes feet to clip through the ground on uneven terrain, instead of planting correctly on slopes and steps.",
    estimateHours: 1.0,
    difficulty: "Beginner",
    category: "Tech Art",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "ControlRigFootIKGroundPenetration",
      step: "setup",
    },
  ],
  fault: {
    description: "Foot IK causes ground penetration instead of proper planting",
    visual_cue: "Character feet sink into slopes and steps during locomotion",
  },
  expected: {
    description:
      "Feet plant correctly on all terrain surfaces without clipping",
    validation_action: "verify_foot_ik",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "ControlRigFootIKGroundPenetration",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "tech_art",
      title: "Initial Observation",
      image_path:
        "assets/generated/ControlRigFootIKGroundPenetration/step-1.png",
      prompt:
        "<p>Your character walks on a sloped surface and the feet clearly clip through the ground mesh. The foot IK is enabled but seems to push feet too far down.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Enable the <strong>Control Rig debug drawing</strong> to visualize the IK targets and verify where the ground trace is detecting the surface.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Debug visualization shows exactly where IK targets are being placed relative to detected surfaces.",
          next: "step-2",
        },
        {
          text: "Increase the character capsule radius to prevent ground clipping.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Capsule affects collision, not visual foot placement. Debug the IK first.",
          next: "step-1",
        },
        {
          text: "Raise the entire character mesh higher above ground.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Raising creates floating appearance. Fix the IK targeting instead.",
          next: "step-1",
        },
        {
          text: "Check if the animation has incorrect foot bone positions.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Animation provides base pose; IK overrides it. Check IK directly.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "tech_art",
      title: "Understanding Foot IK Flow",
      image_path:
        "assets/generated/ControlRigFootIKGroundPenetration/step-2.png",
      prompt:
        "<p>Debug shows the IK effector is being placed exactly at the ground trace hit location. Why does placing the effector at ground level cause penetration?</p><p><strong>Why does ground-level placement cause clipping?</strong></p>",
      choices: [
        {
          text: "The <strong>IK effector</strong> targets the ankle/foot bone, not the sole of the foot. Without a <code>Foot Offset</code> value, the bone goes to ground level while the mesh extends below.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Bone position differs from foot mesh bottom. Offset compensates for this.",
          next: "step-3",
        },
        {
          text: "Ground traces are detecting the wrong collision layer.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Collision layer affects detection, but the offset is the geometric issue.",
          next: "step-2",
        },
        {
          text: "The skeleton has incorrect bone roll causing offset.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Bone roll affects rotation, not vertical position. Add foot offset.",
          next: "step-2",
        },
        {
          text: "IK is using local space instead of world space.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Space affects orientation but the core issue is foot height offset.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "tech_art",
      title: "Adding Foot Offset",
      image_path:
        "assets/generated/ControlRigFootIKGroundPenetration/step-3.png",
      prompt:
        "<p>You need to offset the IK target above the detected ground by the foot height. Where do you configure this?</p><p><strong>How do you add foot offset?</strong></p>",
      choices: [
        {
          text: "In the Control Rig graph, add a <code>Vector Addition</code> node after the ground trace result that adds the foot bone's height offset (Z) before passing to the IK effector.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Adding vertical offset raises the IK target to account for foot mesh height.",
          next: "step-4",
        },
        {
          text: "Set a global offset in the Animation Blueprint's IK node.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Global offset exists but per-foot adjustment in Control Rig is more precise.",
          next: "step-3",
        },
        {
          text: "Modify the skeleton to raise the foot bone position.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Skeleton modification affects all animations. Use Control Rig offset.",
          next: "step-3",
        },
        {
          text: "Enable 'Auto Foot Offset' in the Control Rig settings.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. No such setting exists. Calculate and apply offset manually.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "tech_art",
      title: "Calculating Offset Value",
      image_path:
        "assets/generated/ControlRigFootIKGroundPenetration/step-4.png",
      prompt:
        "<p>What determines the correct foot offset value for your character?</p><p><strong>How do you determine the offset value?</strong></p>",
      choices: [
        {
          text: "Measure the vertical distance from the foot bone to the bottom of the foot mesh in the character's T-pose or bind pose using the Skeleton Editor.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The offset equals the distance from bone to mesh sole in reference pose.",
          next: "step-5",
        },
        {
          text: "Use a standard value like 10 units for all characters.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Characters vary in size. Measure your specific character's foot bone height.",
          next: "step-4",
        },
        {
          text: "Set offset equal to the capsule's half-height.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Capsule half-height is unrelated to foot bone position.",
          next: "step-4",
        },
        {
          text: "Guess and adjust until it looks right in-game.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Trial and error works but measuring is faster and more accurate.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "tech_art",
      title: "Pelvis Adjustment",
      image_path:
        "assets/generated/ControlRigFootIKGroundPenetration/step-5.png",
      prompt:
        "<p>Foot offset is applied but on steep slopes, the legs appear stretched. What additional adjustment is needed?</p><p><strong>What fixes stretched legs on slopes?</strong></p>",
      choices: [
        {
          text: "The <strong>pelvis/hips</strong> must be adjusted vertically when one foot is significantly higher than the other to maintain natural leg bend.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Pelvis offset prevents leg hyper-extension on uneven terrain.",
          next: "step-6",
        },
        {
          text: "Shorten the foot offset value to prevent over-reaching.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Shorter offset causes penetration. Pelvis adjustment is the solution.",
          next: "step-5",
        },
        {
          text: "Enable IK leg length limiting in the solver.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Length limiting prevents stretching but pelvis shift is more natural.",
          next: "step-5",
        },
        {
          text: "Reduce the slope angle where IK is applied.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Angle limiting hides the issue. Pelvis adjustment handles all angles.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "tech_art",
      title: "Pelvis Offset Logic",
      image_path:
        "assets/generated/ControlRigFootIKGroundPenetration/step-6.png",
      prompt:
        "<p>How do you calculate the pelvis offset based on foot IK adjustments?</p><p><strong>How is pelvis offset calculated?</strong></p>",
      choices: [
        {
          text: "Calculate the <strong>lowest foot offset</strong> from both feet's IK adjustments, then lower the pelvis by that amount to keep the lower leg from over-extending.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Using the lowest foot ensures both legs can reach their targets naturally.",
          next: "step-7",
        },
        {
          text: "Average both feet's offsets to find the pelvis adjustment.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Averaging can cause one leg to stretch. Use the lowest foot.",
          next: "step-6",
        },
        {
          text: "Set pelvis offset to a fixed percentage of foot offset.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Fixed percentage doesn't adapt to varying terrain. Calculate dynamically.",
          next: "step-6",
        },
        {
          text: "Only adjust pelvis when both feet are on slopes.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Single-foot scenarios like stairs also need pelvis adjustment.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "tech_art",
      title: "Ground Trace Configuration",
      image_path:
        "assets/generated/ControlRigFootIKGroundPenetration/step-7.png",
      prompt:
        "<p>The IK works on most surfaces but feet float above thin meshes like grates. What's the ground trace issue?</p><p><strong>Why do thin meshes cause floating?</strong></p>",
      choices: [
        {
          text: "Thin geometry may be missed by traces that use specific <strong>collision channels</strong>. Ensure the trace's collision profile includes all walkable surfaces.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Collision channel configuration determines what geometry the trace detects.",
          next: "step-8",
        },
        {
          text: "Thin meshes don't have collision and can't be traced.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Thin meshes can have collision. Check if the trace queries them.",
          next: "step-7",
        },
        {
          text: "Increase the trace radius to detect thin surfaces.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Radius affects capsule traces differently. Collision channel is the key.",
          next: "step-7",
        },
        {
          text: "Thin meshes need special IK handling that you must code.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Standard traces work if collision is configured correctly.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "tech_art",
      title: "Interpolation and Smoothing",
      image_path:
        "assets/generated/ControlRigFootIKGroundPenetration/step-8.png",
      prompt:
        "<p>Feet now plant correctly but snap abruptly between positions when terrain changes. How do you smooth this?</p><p><strong>How do you smooth IK transitions?</strong></p>",
      choices: [
        {
          text: "Add <code>Interpolation</code> or <code>Spring</code> nodes in the Control Rig to smoothly blend between IK target positions over time.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Interpolation creates smooth transitions between foot plant positions.",
          next: "step-9",
        },
        {
          text: "Increase the animation blend time in the Animation Blueprint.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Animation blend is separate from IK. Use Control Rig interpolation.",
          next: "step-8",
        },
        {
          text: "Reduce the ground trace frequency to fewer times per second.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Lower frequency causes delayed response. Interpolation smooths properly.",
          next: "step-8",
        },
        {
          text: "Enable motion blur to hide the snapping visually.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Motion blur is a workaround. Proper interpolation fixes the root cause.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "tech_art",
      title: "Weight Shifting",
      image_path:
        "assets/generated/ControlRigFootIKGroundPenetration/step-9.png",
      prompt:
        "<p>IK works during walking, but during idle, both feet plant stiffly. How do you add natural weight shifting?</p><p><strong>How do you add idle weight shifting?</strong></p>",
      choices: [
        {
          text: "Blend IK influence based on <strong>animation phase</strong>—reduce IK weight when a foot is supposed to be in the air, and full IK when planted based on foot lock curves.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Animation-driven IK weight creates natural motion that follows the animation intent.",
          next: "step-10",
        },
        {
          text: "Add a second idle animation with pre-baked weight shift.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Pre-baked animations don't adapt to terrain. Use dynamic IK weight.",
          next: "step-9",
        },
        {
          text: "Randomize pelvis position during idle.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Random pelvis movement is unnatural. Use animation-driven phases.",
          next: "step-9",
        },
        {
          text: "Completely disable IK during idle animations.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Disabling causes feet to float on slopes during idle. Use weighted IK.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "tech_art",
      title: "Final Verification",
      image_path:
        "assets/generated/ControlRigFootIKGroundPenetration/step-10.png",
      prompt:
        "<p>All settings are configured. What is the best verification for foot IK?</p><p><strong>How do you verify foot IK?</strong></p>",
      choices: [
        {
          text: "Test the character walking across varied terrain (slopes, stairs, uneven surfaces) in PIE, checking for both ground penetration and floating at different speeds and during idle.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Comprehensive terrain testing validates IK across all scenarios.",
          next: "conclusion",
        },
        {
          text: "Verify the Control Rig graph has no errors.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Error-free graph is good but doesn't verify runtime behavior.",
          next: "step-10",
        },
        {
          text: "Check that foot bones are in correct positions in the Skeleton Editor.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Skeleton editor shows bind pose, not runtime IK. Test in PIE.",
          next: "step-10",
        },
        {
          text: "Compare to reference video of the original animation.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Original animation doesn't have IK. Test the actual IK behavior.",
          next: "step-10",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/ControlRigFootIKGroundPenetration/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've fixed the Control Rig foot IK to properly plant feet on terrain.</p><h4>Key Takeaways:</h4><ul><li><strong>Debug Drawing</strong> — Visualizes IK targets for troubleshooting</li><li><code>Foot Offset</code> — Compensates for distance from foot bone to mesh sole</li><li><strong>Pelvis Adjustment</strong> — Prevents leg over-extension on slopes</li><li><strong>Collision Channels</strong> — Ensure traces detect all walkable surfaces</li><li><code>Interpolation/Spring</code> — Smooths transitions between IK positions</li><li><strong>Animation Phase</strong> — Controls IK weight based on foot contact state</li></ul>",
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
