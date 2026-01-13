window.SCENARIOS["PhysicsAssetRagdollExplosion"] = {
  meta: {
    title: "Physics Asset Causes Ragdoll to Explode on Activation",
    description:
      "When activating ragdoll physics on your character, the body explodes violently outward instead of collapsing naturally. Bodies separate dramatically upon death.",
    estimateHours: 1.25,
    difficulty: "Intermediate",
    category: "Tech Art",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "PhysicsAssetRagdollExplosion",
      step: "setup",
    },
  ],
  fault: {
    description: "Ragdoll explodes instead of natural collapse",
    visual_cue:
      "Character body parts fly apart violently when physics is activated",
  },
  expected: {
    description:
      "Ragdoll smoothly transitions from animation to physics simulation",
    validation_action: "verify_ragdoll",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "PhysicsAssetRagdollExplosion",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "tech_art",
      title: "Initial Observation",
      image_path: "assets/generated/PhysicsAssetRagdollExplosion/step-1.png",
      prompt:
        "<p>When your character dies and ragdoll is activated, the body parts explode outward violently before settling. The initial frame shows extreme velocities.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Open the <strong>Physics Asset</strong> and check for <code>overlapping physics bodies</code> that may be interpenetrating and pushing apart on simulation start.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Overlapping bodies create immediate separation forces causing explosion.",
          next: "step-2",
        },
        {
          text: "Reduce the global physics simulation time step.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Time step affects accuracy but interpenetration causes immediate explosion.",
          next: "step-1",
        },
        {
          text: "Add more mass to the body parts to resist explosive forces.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Mass affects behavior but overlapping bodies still separate. Fix overlap first.",
          next: "step-1",
        },
        {
          text: "Disable physics on all body parts except the root.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Partial physics loses ragdoll behavior. Diagnose the collision issue.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "tech_art",
      title: "Understanding Body Overlap",
      image_path: "assets/generated/PhysicsAssetRagdollExplosion/step-2.png",
      prompt:
        "<p>In the Physics Asset editor, how do you visualize body collisions and detect overlaps?</p><p><strong>How do you see overlapping bodies?</strong></p>",
      choices: [
        {
          text: "Enable <code>Collision</code> visualization in the Physics Asset toolbar. Overlapping bodies show in red/orange, properly separated bodies in green.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Collision visualization makes overlaps immediately visible.",
          next: "step-3",
        },
        {
          text: "Play the simulation and observe which parts explode first.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Simulation shows effects but visualization prevents trial and error.",
          next: "step-2",
        },
        {
          text: "Check each body's collision settings in the Details panel.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Details shows settings but visualization shows spatial overlap.",
          next: "step-2",
        },
        {
          text: "Bodies outline in red when selected if overlapping.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Selection color doesn't indicate overlap. Use Collision visualization.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "tech_art",
      title: "Fixing Body Overlap",
      image_path: "assets/generated/PhysicsAssetRagdollExplosion/step-3.png",
      prompt:
        "<p>Visualization shows upper arm and torso bodies are overlapping. How do you fix this?</p><p><strong>How do you resolve body overlap?</strong></p>",
      choices: [
        {
          text: "Select the overlapping bodies and <strong>resize or reposition</strong> them to create small gaps. Use the transform tools to adjust body shape, size, and position relative to bones.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Adjusting body size and position eliminates interpenetration.",
          next: "step-4",
        },
        {
          text: "Delete one of the overlapping bodies.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Deleting loses that body's physics contribution. Resize instead.",
          next: "step-3",
        },
        {
          text: "Set the bodies to ignore collision with each other.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Ignoring collision lets bodies penetrate unnaturally. Proper sizing is better.",
          next: "step-3",
        },
        {
          text: "Increase the bone length in the skeleton.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Skeleton modification affects all animations. Adjust physics bodies instead.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "tech_art",
      title: "Body Type Selection",
      image_path: "assets/generated/PhysicsAssetRagdollExplosion/step-4.png",
      prompt:
        "<p>The default body shapes are spheres that don't fit the mesh well. What body types provide better fitting?</p><p><strong>What body shapes reduce overlap?</strong></p>",
      choices: [
        {
          text: "Use <code>Capsule</code> bodies for limbs (arms, legs, spine) and <code>Convex</code> or <code>Sphere</code> for joints. Capsules match cylindrical limb shapes better than spheres.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Appropriate body shapes fit the mesh geometry with less overlap.",
          next: "step-5",
        },
        {
          text: "Use mesh collision for exact body fitting.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Mesh collision is expensive and complex. Primitive shapes are preferred for ragdoll.",
          next: "step-4",
        },
        {
          text: "Only use spheres as they're fastest for simulation.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Spheres are fast but poor fit causes overlap. Use appropriate shapes.",
          next: "step-4",
        },
        {
          text: "Box bodies provide the most stable physics.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Boxes work for some cases but capsules better match limb geometry.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "tech_art",
      title: "Constraint Configuration",
      image_path: "assets/generated/PhysicsAssetRagdollExplosion/step-5.png",
      prompt:
        "<p>Body overlap is fixed but limbs still swing wildly with unnatural rotation. What controls joint behavior?</p><p><strong>What limits joint movement?</strong></p>",
      choices: [
        {
          text: "Configure <strong>Constraints</strong> between bodies. Set <code>Angular Limits</code> (Swing1, Swing2, Twist) to restrict rotation to anatomically reasonable ranges.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Proper constraints prevent unnatural poses while allowing natural movement.",
          next: "step-6",
        },
        {
          text: "Increase body mass to reduce wild swinging.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Mass affects momentum but doesn't limit rotation. Use constraints.",
          next: "step-5",
        },
        {
          text: "Add angular damping to slow rotation speed.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Damping slows motion but constraints define limits. Use both appropriately.",
          next: "step-5",
        },
        {
          text: "Lock all joint rotations to prevent movement.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Locking creates rigid body instead of ragdoll. Set reasonable limits.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "tech_art",
      title: "Setting Angular Limits",
      image_path: "assets/generated/PhysicsAssetRagdollExplosion/step-6.png",
      prompt:
        "<p>How do you set reasonable angular limits for a shoulder joint?</p><p><strong>What are appropriate shoulder limits?</strong></p>",
      choices: [
        {
          text: "Set <code>Swing1</code> and <code>Swing2</code> limits to approximately <strong>90-120 degrees</strong> for full arm movement, and <code>Twist</code> to about <strong>60-90 degrees</strong> for forearm rotation.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Anatomical limits prevent unnatural poses while allowing full motion range.",
          next: "step-7",
        },
        {
          text: "Set all limits to 180 degrees for maximum flexibility.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. 180 degrees allows unnatural hyperextension. Use anatomical limits.",
          next: "step-6",
        },
        {
          text: "Use 45 degrees for all joints as a conservative setting.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. 45 degrees is too restrictive for shoulders. Different joints need different limits.",
          next: "step-6",
        },
        {
          text: "Copy limits from a reference Physics Asset template.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Templates help but understanding values lets you tune for your character.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "tech_art",
      title: "Simulation Testing",
      image_path: "assets/generated/PhysicsAssetRagdollExplosion/step-7.png",
      prompt:
        "<p>How do you test the ragdoll behavior in the Physics Asset editor?</p><p><strong>How do you preview ragdoll?</strong></p>",
      choices: [
        {
          text: "Click <code>Simulate</code> in the Physics Asset toolbar to drop the character and observe how it collapses. Use the <code>Poke</code> tool to interact with bodies during simulation.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. In-editor simulation allows quick iteration without playing the game.",
          next: "step-8",
        },
        {
          text: "You must play the game to test ragdoll behavior.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. In-game testing is final but editor simulation is faster for iteration.",
          next: "step-7",
        },
        {
          text: "Preview constraint limits by rotating bones manually.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Manual rotation helps for limits but simulation tests full behavior.",
          next: "step-7",
        },
        {
          text: "Export to a physics testing tool and import results.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. External tools add workflow. Built-in simulation is sufficient.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "tech_art",
      title: "Damping Settings",
      image_path: "assets/generated/PhysicsAssetRagdollExplosion/step-8.png",
      prompt:
        "<p>The ragdoll collapses but continues bouncing and jittering for too long. How do you make it settle faster?</p><p><strong>How do you reduce settling time?</strong></p>",
      choices: [
        {
          text: "Increase <code>Linear Damping</code> and <code>Angular Damping</code> on physics bodies. Higher damping values absorb energy faster, causing quicker settling.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Damping dissipates energy. Balance responsiveness vs settling speed.",
          next: "step-9",
        },
        {
          text: "Increase gravity to push the body down faster.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Higher gravity affects fall speed but doesn't reduce bouncing. Use damping.",
          next: "step-8",
        },
        {
          text: "Reduce the physics simulation frequency.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Lower frequency reduces accuracy and can cause instability. Use damping.",
          next: "step-8",
        },
        {
          text: "Add a timer to deactivate physics after a few seconds.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Timer deactivation works but proper damping is more natural.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "tech_art",
      title: "Blend Physics",
      image_path: "assets/generated/PhysicsAssetRagdollExplosion/step-9.png",
      prompt:
        "<p>The transition from animation to ragdoll is jarring. How do you create a smoother transition?</p><p><strong>How do you blend to ragdoll?</strong></p>",
      choices: [
        {
          text: "Use <code>Physical Animation Component</code> or <code>Blend Physics</code> node to gradually blend from animation to physics simulation over a short duration.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Blending creates a smooth transition instead of instant switch.",
          next: "step-10",
        },
        {
          text: "Play a death animation before activating ragdoll.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Death animation is good but blend physics is needed for smooth handoff.",
          next: "step-9",
        },
        {
          text: "Reduce ragdoll body velocities to zero before activation.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Zero velocity loses motion continuity. Blend physics preserves momentum.",
          next: "step-9",
        },
        {
          text: "Instant transition is standard; viewers won't notice.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Instant transitions are jarring. Blending improves quality significantly.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "tech_art",
      title: "Initial Velocity",
      image_path: "assets/generated/PhysicsAssetRagdollExplosion/step-10.png",
      prompt:
        "<p>When the character is hit and ragdolls, they should be pushed in the hit direction. How do you apply initial impulse?</p><p><strong>How do you add hit reaction?</strong></p>",
      choices: [
        {
          text: "On ragdoll activation, call <code>AddImpulse</code> or <code>AddForce</code> on the hit body (or root body) with a vector in the hit direction scaled by desired strength.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Initial impulse creates realistic hit reactions that carry through the ragdoll.",
          next: "step-11",
        },
        {
          text: "Configure hit reaction in the Physics Asset.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Physics Asset defines bodies. Impulse is applied at runtime via code.",
          next: "step-10",
        },
        {
          text: "Use the animation's root motion to push the body.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Animation ends when ragdoll starts. Apply impulse at activation.",
          next: "step-10",
        },
        {
          text: "Hit reactions require separate animation sequences.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Animation hit reactions are different. Physics impulse is for ragdoll.",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "tech_art",
      title: "Sleep Threshold",
      image_path: "assets/generated/PhysicsAssetRagdollExplosion/step-11.png",
      prompt:
        "<p>Bodies continue simulating even when nearly still, wasting performance. How do you make them stop?</p><p><strong>How do you stop idle simulation?</strong></p>",
      choices: [
        {
          text: "Configure <code>Sleep Threshold</code> values on bodies. When velocity falls below thresholds, bodies enter sleep state and stop simulating until disturbed.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Sleep thresholds save performance on settled ragdolls.",
          next: "step-12",
        },
        {
          text: "Disable physics on bodies after a timer expires.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Timers work but sleep is automatic and reactivates if disturbed.",
          next: "step-11",
        },
        {
          text: "Reduce physics tick rate for idle bodies.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Variable tick rate is complex. Sleep is the standard solution.",
          next: "step-11",
        },
        {
          text: "Delete the ragdoll after it stops moving.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Deletion removes the body entirely. Sleep preserves it efficiently.",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "tech_art",
      title: "Final Verification",
      image_path: "assets/generated/PhysicsAssetRagdollExplosion/step-12.png",
      prompt:
        "<p>What is the final verification for the ragdoll system?</p><p><strong>What confirms ragdoll works correctly?</strong></p>",
      choices: [
        {
          text: "Test ragdoll activation from <strong>multiple animation states</strong> (running, jumping, hit) on <strong>varied terrain</strong> (flat, slopes, stairs) to verify natural collapse in all scenarios.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Comprehensive testing catches edge cases across gameplay situations.",
          next: "conclusion",
        },
        {
          text: "Verify all constraint limits are within anatomical ranges.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Limit verification is good but gameplay testing is the final check.",
          next: "step-12",
        },
        {
          text: "Check that simulation time stays under performance budget.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Performance is important but visual quality testing comes first.",
          next: "step-12",
        },
        {
          text: "Compare to a reference video of real ragdoll physics.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Reference helps goals but test your actual implementation.",
          next: "step-12",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/PhysicsAssetRagdollExplosion/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've fixed the Physics Asset to produce natural ragdoll behavior.</p><h4>Key Takeaways:</h4><ul><li><strong>Body Overlap</strong> — Interpenetrating bodies cause explosion on activation</li><li><code>Collision Visualization</code> — Shows overlapping bodies in Physics Asset editor</li><li><strong>Body Shapes</strong> — Use capsules for limbs, spheres for joints</li><li><code>Angular Limits</code> — Constrain joints to anatomical ranges (Swing1, Swing2, Twist)</li><li><code>Damping</code> — Linear and angular damping for faster settling</li><li><strong>Blend Physics</strong> — Smooth transition from animation to physics</li><li><code>AddImpulse</code> — Apply hit direction force for realistic reactions</li><li><code>Sleep Threshold</code> — Stops simulation on settled bodies for performance</li></ul>",
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
