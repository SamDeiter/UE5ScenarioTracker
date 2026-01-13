window.SCENARIOS["BlendSpaceFootSliding"] = {
  meta: {
    title: "Blend Space Causes Foot Sliding at All Speeds",
    description:
      "Your character's locomotion blend space causes visible foot sliding regardless of movement speed. Feet appear to skate across the ground instead of planting.",
    estimateHours: 1.25,
    difficulty: "Intermediate",
    category: "Tech Art",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "BlendSpaceFootSliding",
      step: "setup",
    },
  ],
  fault: {
    description: "Blend space produces foot sliding at all speeds",
    visual_cue: "Character feet slide on ground during walk/run transitions",
  },
  expected: {
    description:
      "Feet plant firmly on ground with no visible sliding at any speed",
    validation_action: "verify_foot_sync",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "BlendSpaceFootSliding",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "tech_art",
      title: "Initial Observation",
      image_path: "assets/generated/BlendSpaceFootSliding/step-1.png",
      prompt:
        "<p>Your character uses a 1D Blend Space for locomotion with Walk, Run, and Sprint animations. At every speed, feet appear to slide across the ground rather than planting firmly.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Check if the individual animations have correct <strong>root motion</strong> or <strong>distance matching</strong>, and verify the Blend Space sample points match the intended movement speeds.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Animation-to-speed mismatch is the primary cause of foot sliding.",
          next: "step-2",
        },
        {
          text: "Increase character movement speed to match the animations.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Speed adjustment might help but understanding the mismatch is essential.",
          next: "step-1",
        },
        {
          text: "Add foot IK to lock feet to the ground.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. IK fixes terrain alignment but doesn't address blend space speed mismatch.",
          next: "step-1",
        },
        {
          text: "Replace the Blend Space with hard animation transitions.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Hard transitions lose smooth blending. Fix the blend space configuration.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "tech_art",
      title: "Understanding Root Motion",
      image_path: "assets/generated/BlendSpaceFootSliding/step-2.png",
      prompt:
        "<p>The animations use Root Motion. What is the relationship between root motion and blend spaces?</p><p><strong>How does root motion work with blend spaces?</strong></p>",
      choices: [
        {
          text: "Root motion drives character movement from animation data. In blend spaces, root velocities are also blended, so sample points must have animations with matching intended speeds.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Blended root motion combines sample velocities. Mismatched speeds cause sliding.",
          next: "step-3",
        },
        {
          text: "Root motion is ignored when using blend spaces.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Root motion is respected and blended. It's not ignored.",
          next: "step-2",
        },
        {
          text: "Blend spaces override root motion with the Speed parameter.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The Speed parameter selects samples but doesn't override root motion data.",
          next: "step-2",
        },
        {
          text: "Only the highest-weight animation's root motion is used.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. All contributing animations' root motion is blended by weight.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "tech_art",
      title: "Checking Animation Speeds",
      image_path: "assets/generated/BlendSpaceFootSliding/step-3.png",
      prompt:
        "<p>You need to find the actual root motion speed of each animation. Where do you see this information?</p><p><strong>How do you find animation root motion speed?</strong></p>",
      choices: [
        {
          text: "Open each animation asset, enable root motion preview, and check the <code>Root Motion</code> details panel which shows velocity in units per second.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Animation asset shows exact root motion velocity for accurate blend space setup.",
          next: "step-4",
        },
        {
          text: "The animation name usually contains the intended speed.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Naming conventions help but actual data is more accurate. Check the asset.",
          next: "step-3",
        },
        {
          text: "Calculate from animation length and total distance traveled.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Manual calculation works but the editor shows velocity directly.",
          next: "step-3",
        },
        {
          text: "Root motion speed is always 100 units per second normalized.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no normalization. Each animation has its authored velocity.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "tech_art",
      title: "Aligning Sample Points",
      image_path: "assets/generated/BlendSpaceFootSliding/step-4.png",
      prompt:
        "<p>Walk animation moves at 150 cm/s, Run at 400 cm/s, Sprint at 600 cm/s. Your blend space has samples at 0, 100, and 200. What's wrong?</p><p><strong>What's the blend space configuration error?</strong></p>",
      choices: [
        {
          text: "The blend space <strong>sample positions</strong> don't match the animations' root motion speeds. Set Walk at 150, Run at 400, Sprint at 600 to match actual velocities.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Sample positions should equal the animation's root motion velocity for 1:1 matching.",
          next: "step-5",
        },
        {
          text: "The sample values are correct; the animations need re-exporting.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Animations are correct; the blend space sample positions need adjustment.",
          next: "step-4",
        },
        {
          text: "Blend space values are normalized 0-200 and can't be changed.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Blend space axis ranges are fully configurable. Set to match velocities.",
          next: "step-4",
        },
        {
          text: "Move samples closer together to reduce blending range.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Closer samples doesn't fix the speed mismatch. Match to root motion values.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "tech_art",
      title: "Updating Blend Space",
      image_path: "assets/generated/BlendSpaceFootSliding/step-5.png",
      prompt:
        "<p>You update sample positions to match root motion speeds. But the character blueprint still passes 0-200 as the Speed input. What needs to change?</p><p><strong>What else needs updating?</strong></p>",
      choices: [
        {
          text: "Update the <strong>Animation Blueprint</strong> to pass the character's actual velocity (from Character Movement) as the Blend Space input parameter.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. ABP must pass real velocity to match the corrected blend space positions.",
          next: "step-6",
        },
        {
          text: "Create a variable that maps old 0-200 range to new 150-600 range.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Remapping adds complexity. Just use actual velocity directly.",
          next: "step-5",
        },
        {
          text: "The blend space automatically reads character velocity.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Blend spaces need explicit parameter input from the ABP.",
          next: "step-5",
        },
        {
          text: "Scale the character's movement speed to match the old parameter range.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Scaling gameplay to match animation is backwards. Pass true velocity.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "tech_art",
      title: "Getting Character Velocity",
      image_path: "assets/generated/BlendSpaceFootSliding/step-6.png",
      prompt:
        "<p>How do you get the character's actual velocity in the Animation Blueprint?</p><p><strong>How do you access velocity in ABP?</strong></p>",
      choices: [
        {
          text: "Use <code>TryGetPawnOwner</code>, cast to your character class, then get <code>GetVelocity</code> and calculate its length for speed magnitude.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Character velocity length gives the scalar speed value for the blend parameter.",
          next: "step-7",
        },
        {
          text: "Read the Speed variable from the Character Movement Component.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. CMC doesn't expose Speed directly. Calculate from GetVelocity.",
          next: "step-6",
        },
        {
          text: "Use the built-in Speed variable in Animation Blueprints.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no built-in Speed. You must calculate it from pawn velocity.",
          next: "step-6",
        },
        {
          text: "Access the GroundSpeed parameter in the ABP event graph.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. GroundSpeed isn't automatic. Calculate velocity length yourself.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "tech_art",
      title: "Checking Interpolation",
      image_path: "assets/generated/BlendSpaceFootSliding/step-7.png",
      prompt:
        "<p>Speeds are matched but there's still slight sliding during acceleration/deceleration. What causes this?</p><p><strong>Why does sliding occur during speed changes?</strong></p>",
      choices: [
        {
          text: "Character <strong>acceleration</strong> changes velocity faster than animation blending can follow. Add <code>Target Weight Interpolation Speed</code> tuning in the blend space or use velocity prediction.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Blend interpolation rate must match character acceleration for seamless transitions.",
          next: "step-8",
        },
        {
          text: "Acceleration animations are missing from the blend space.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Acceleration-specific animations can help but interpolation tuning is simpler.",
          next: "step-7",
        },
        {
          text: "The ABP update rate is too slow to track velocity changes.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. ABP updates every frame. It's blend interpolation speed that needs tuning.",
          next: "step-7",
        },
        {
          text: "Root motion doesn't support velocity changes.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Root motion handles velocity changes. Tune blend interpolation.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "tech_art",
      title: "Target Weight Interpolation",
      image_path: "assets/generated/BlendSpaceFootSliding/step-8.png",
      prompt:
        "<p>Where do you configure blend space interpolation speed?</p><p><strong>Where is interpolation configured?</strong></p>",
      choices: [
        {
          text: "In the <strong>Blend Space asset</strong>, set the <code>Target Weight Interpolation Speed Per Sec</code> property to control how fast the blend position tracks the input parameter.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Higher interpolation speeds track velocity changes more closely.",
          next: "step-9",
        },
        {
          text: "Configure interpolation in the Animation Blueprint's state machine.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. State machine handles transitions between states. Blend space has internal interpolation.",
          next: "step-8",
        },
        {
          text: "Use a smooth damp node on the velocity input in ABP.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Input smoothing can help but blend space has built-in interpolation.",
          next: "step-8",
        },
        {
          text: "Set interpolation in Project Settings > Animation.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Interpolation is per-blend space, not global in project settings.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "tech_art",
      title: "Distance Matching",
      image_path: "assets/generated/BlendSpaceFootSliding/step-9.png",
      prompt:
        "<p>For more precise foot planting, what advanced technique prevents sliding during starts and stops?</p><p><strong>What technique prevents sliding at speed extremes?</strong></p>",
      choices: [
        {
          text: "Use <strong>Distance Matching</strong> and <strong>Stride Warping</strong> in the Animation Blueprint to dynamically adjust animation playback rate and stride length based on actual movement.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Distance matching and stride warping are purpose-built solutions for foot sliding.",
          next: "step-10",
        },
        {
          text: "Add more animation samples for start and stop motions.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. More samples help coverage but distance matching provides real-time precision.",
          next: "step-9",
        },
        {
          text: "Lock foot positions during speed transitions.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Locking without adjustment looks unnatural. Use distance matching.",
          next: "step-9",
        },
        {
          text: "Use curve-driven playback rate scaling.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Manual curves are less adaptive. Distance matching is more robust.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "tech_art",
      title: "Stride Warping Setup",
      image_path: "assets/generated/BlendSpaceFootSliding/step-10.png",
      prompt:
        "<p>How do you enable Stride Warping for your character?</p><p><strong>How do you set up Stride Warping?</strong></p>",
      choices: [
        {
          text: "Add the <code>Stride Warping</code> node in your Animation Blueprint's Anim Graph, configure it with the character's current velocity, and set up the appropriate foot bone targets.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Stride Warping node adjusts step length dynamically to match movement speed.",
          next: "step-11",
        },
        {
          text: "Enable Stride Warping in the Blend Space properties.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Stride Warping is an ABP node, not a blend space setting.",
          next: "step-10",
        },
        {
          text: "Import animations with stride warping data baked in.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Warping is applied at runtime in UE5, not baked into animation files.",
          next: "step-10",
        },
        {
          text: "Stride Warping is only available with Motion Matching.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Stride Warping works with blend spaces too, not just Motion Matching.",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "tech_art",
      title: "Testing Speed Ranges",
      image_path: "assets/generated/BlendSpaceFootSliding/step-11.png",
      prompt:
        "<p>What testing should you perform to verify foot sliding is fixed across all speeds?</p><p><strong>How do you verify no sliding?</strong></p>",
      choices: [
        {
          text: "Test the character at <strong>each sample point speed</strong> (150, 400, 600) and <strong>between samples</strong>, plus during <strong>acceleration and deceleration</strong> to verify feet plant correctly throughout.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Comprehensive speed testing validates the fix across all locomotion states.",
          next: "step-12",
        },
        {
          text: "Verify the blend space preview shows correct blending.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Preview helps but runtime testing with actual movement is essential.",
          next: "step-11",
        },
        {
          text: "Check that root motion values match in the animation assets.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Asset verification is good but doesn't confirm runtime behavior.",
          next: "step-11",
        },
        {
          text: "Test at maximum speed only since that shows sliding most clearly.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. All speeds and transitions need testing. Sliding can occur anywhere.",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "tech_art",
      title: "Final Verification",
      image_path: "assets/generated/BlendSpaceFootSliding/step-12.png",
      prompt:
        "<p>What is the final check to confirm the locomotion system is working correctly?</p><p><strong>What confirms complete fix?</strong></p>",
      choices: [
        {
          text: "Place a ground texture with visible grid lines and walk the character across it at various speeds, observing that feet stay fixed on grid intersections during contact phases.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Grid texture makes foot sliding immediately visible and easy to verify.",
          next: "conclusion",
        },
        {
          text: "Record gameplay footage and review in slow motion.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Recording works but grid texture testing is faster for iteration.",
          next: "step-12",
        },
        {
          text: "Compare to other characters in the same project.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Comparison helps but may not catch issues if others have similar problems.",
          next: "step-12",
        },
        {
          text: "Check that velocity values in the ABP match character movement.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Values matching is good but visual foot contact is the true test.",
          next: "step-12",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/BlendSpaceFootSliding/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've fixed the Blend Space locomotion to eliminate foot sliding.</p><h4>Key Takeaways:</h4><ul><li><strong>Root Motion Velocity</strong> — Check each animation's actual speed in the asset</li><li><code>Sample Positions</code> — Must match animation root motion velocities</li><li><strong>ABP Velocity Input</strong> — Pass actual character velocity, not arbitrary values</li><li><code>Target Weight Interpolation Speed</code> — Tune to match character acceleration</li><li><strong>Distance Matching</strong> — Adjusts playback for starts/stops</li><li><strong>Stride Warping</strong> — Dynamically adjusts step length to match speed</li><li><strong>Grid Texture Test</strong> — Visual verification of foot planting</li></ul>",
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
