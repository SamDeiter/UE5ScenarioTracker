window.SCENARIOS["LumenReflectionIncorrectColor"] = {
  meta: {
    title: "Lumen Reflections Show Incorrect Color on Metallic Surfaces",
    description:
      "Metallic objects reflect the wrong colors in their environment. A chrome sphere should reflect the red wall behind it, but instead shows a grayish reflection.",
    estimateHours: 1.0,
    difficulty: "Intermediate",
    category: "Lighting",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "LumenReflectionIncorrectColor",
      step: "setup",
    },
  ],
  fault: {
    description: "Lumen reflections display wrong colors on metallic surfaces",
    visual_cue: "Chrome objects show gray/incorrect reflections",
  },
  expected: {
    description:
      "Reflections accurately represent surrounding environment colors",
    validation_action: "verify_lumen_reflections",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "LumenReflectionIncorrectColor",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "lighting",
      title: "Initial Observation",
      image_path: "assets/generated/LumenReflectionIncorrectColor/step-1.png",
      prompt:
        "<p>A chrome sphere in your scene should reflect a bright red wall directly behind it. Instead, the reflection appears grayish-brown. Lumen is enabled in <strong>Project Settings</strong>.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Check the red wall mesh and verify its material has <code>Emissive</code> contribution or sufficient <code>Base Color</code> intensity for Lumen to capture.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Lumen traces rely on surface emission and base color. Dark or low-saturation materials don't bounce color effectively.",
          next: "step-2",
        },
        {
          text: "Add a <strong>Sphere Reflection Capture</strong> near the chrome object to supplement Lumen's reflections.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Reflection captures blend with Lumen but mask the root issue. Fix the Lumen capture first for accurate global reflections.",
          next: "step-1",
        },
        {
          text: "Increase the chrome material's <code>Roughness</code> to make reflections more visible.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Higher roughness blurs reflections, not color accuracy. The issue is what Lumen captures, not how the surface reflects.",
          next: "step-1",
        },
        {
          text: "Rebuild lighting to refresh Lumen's global illumination cache.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Lumen is fully dynamic and doesn't use lightmaps. Rebuilding has no effect on Lumen reflections.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "lighting",
      title: "Checking the Source Material",
      image_path: "assets/generated/LumenReflectionIncorrectColor/step-2.png",
      prompt:
        "<p>You check the red wall's material. The <code>Base Color</code> is a saturated red (RGB: 1.0, 0.1, 0.1), which should be visible to Lumen. The wall still doesn't contribute to reflections properly.</p><p><strong>What else could prevent Lumen from capturing this surface?</strong></p>",
      choices: [
        {
          text: "Check if the wall mesh has <code>Visible in Ray Tracing</code> and <code>Affect Indirect Lighting</code> enabled in its <strong>Details Panel</strong> > <strong>Lighting</strong> settings.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. These flags control whether the mesh participates in Lumen's ray marching and indirect bounces.",
          next: "step-3",
        },
        {
          text: "Enable <code>Two Sided</code> on the wall's material to ensure both faces emit light for Lumen.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Two-sided helps if viewing the backface, but standard walls face the camera. Check lighting flags first.",
          next: "step-2",
        },
        {
          text: "Add a <strong>Rect Light</strong> behind the wall to boost red light contribution.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Additional lights can help but don't fix why Lumen isn't capturing the wall's color. Check mesh settings.",
          next: "step-2",
        },
        {
          text: "Convert the wall to a <strong>Nanite</strong> mesh to improve Lumen compatibility.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Nanite affects geometry rendering, not Lumen's lighting capture. Standard meshes work fine with Lumen.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "lighting",
      title: "Enabling Lumen Visibility",
      image_path: "assets/generated/LumenReflectionIncorrectColor/step-3.png",
      prompt:
        "<p>You find <code>Affect Indirect Lighting</code> is disabled on the wall mesh. After enabling it, reflections improve but still look slightly washed out compared to the vibrant wall color.</p><p><strong>What additional setting could improve color accuracy?</strong></p>",
      choices: [
        {
          text: "In <strong>Project Settings</strong> > <strong>Rendering</strong> > <strong>Lumen</strong>, increase <code>Final Gather Quality</code> to improve GI sampling accuracy.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Final Gather Quality affects how accurately Lumen samples indirect lighting. Higher values capture more color detail.",
          next: "step-4",
        },
        {
          text: "Increase the <code>Indirect Lighting Intensity</code> in the <strong>Post Process Volume</strong> to boost indirect bounce brightness.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. This amplifies existing GI but can over-expose other areas. Quality settings preserve accuracy better than intensity boosts.",
          next: "step-4",
        },
        {
          text: "Switch the wall material's <code>Shading Model</code> from <code>Default Lit</code> to <code>Unlit</code> for maximum color emission.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Unlit materials don't interact with scene lighting at all, making them invisible to Lumen's indirect bounce calculations.",
          next: "step-3",
        },
        {
          text: "Add an <code>Emissive</code> term to the wall material multiplied by the base color.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Emissive adds light emission but can cause unrealistic bloom on surfaces that shouldn't glow, like painted walls.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "lighting",
      title: "Post Process Considerations",
      image_path: "assets/generated/LumenReflectionIncorrectColor/step-4.png",
      prompt:
        "<p>Reflections now accurately show the red wall. However, you notice performance has dropped slightly from the quality increase.</p><p><strong>What is the best approach to balance quality and performance for this scene?</strong></p>",
      choices: [
        {
          text: "Use <code>Lumen Scene Detail</code> scalability settings to adjust quality based on target platform, leaving high settings for PC and lower for consoles.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Scalability CVars allow per-platform optimization while maintaining the best quality on capable hardware.",
          next: "step-5",
        },
        {
          text: "Revert <code>Final Gather Quality</code> to default and rely on <strong>Reflection Captures</strong> for accurate reflections in this area.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Hybrid approaches work, but lose the dynamic benefits of pure Lumen. Scalability is more flexible.",
          next: "step-5",
        },
        {
          text: "Reduce the resolution of all textures in the scene to free up GPU budget for Lumen.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Texture resolution and Lumen quality are separate budgets. Scalability settings target Lumen specifically.",
          next: "step-4",
        },
        {
          text: "Disable Lumen entirely and use only <strong>Screen Space Reflections</strong> for better performance.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. SSR can't capture off-screen objects. Lumen with appropriate settings provides better quality reflections.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "lighting",
      title: "Verification",
      image_path: "assets/generated/LumenReflectionIncorrectColor/step-5.png",
      prompt:
        "<p>You've configured Lumen settings and enabled proper mesh lighting flags. How do you verify reflections are now correct?</p><p><strong>What is the best verification approach?</strong></p>",
      choices: [
        {
          text: "Use the <code>Lumen Scene</code> view mode to visualize what Lumen 'sees' and confirm the red wall contributes to the scene representation.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Lumen Scene shows the simplified scene representation used for ray marching, confirming surfaces are properly captured.",
          next: "conclusion",
        },
        {
          text: "Compare the chrome sphere's reflection against a reference photo of a real chrome object in a similar environment.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Reference comparison is good for art direction but doesn't debug technical issues. Use Lumen Scene for verification.",
          next: "step-5",
        },
        {
          text: "Check <code>stat gpu</code> to ensure Lumen isn't using excessive rendering time.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. GPU stats show performance, not reflection accuracy. Visual debugging modes are more relevant.",
          next: "step-5",
        },
        {
          text: "Toggle Lumen off and on to see if reflections change, confirming Lumen is the active system.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. You already know Lumen is active. The question is whether it's capturing surfaces correctly.",
          next: "step-5",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/LumenReflectionIncorrectColor/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've resolved the Lumen reflection color issue.</p><h4>Key Takeaways:</h4><ul><li><code>Affect Indirect Lighting</code> — Required for meshes to contribute to Lumen GI and reflections</li><li><code>Final Gather Quality</code> — Controls sampling accuracy for indirect lighting</li><li><code>Lumen Scene</code> view mode — Visualizes what Lumen captures for ray marching</li><li><strong>Scalability Settings</strong> — Balance quality per platform without code changes</li></ul>",
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
