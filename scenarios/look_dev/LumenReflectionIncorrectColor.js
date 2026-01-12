window.SCENARIOS["LumenReflectionIncorrectColor"] = {
  meta: {
    title: "Lumen Reflections Show Incorrect Color on Metallic Surfaces",
    description:
      "Metallic objects reflect the wrong colors in their environment. A chrome sphere should reflect the red wall behind it, but instead shows a grayish reflection.",
    estimateHours: 1.5,
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
          text: "Check the red wall mesh and verify its material has sufficient <code>Base Color</code> intensity and that lighting flags allow Lumen to capture it.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Lumen traces rely on surface properties and mesh lighting settings. Dark materials or disabled flags prevent color contribution.",
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
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Higher roughness blurs reflections, not color accuracy. The issue is what Lumen captures, not how the surface reflects.",
          next: "step-1",
        },
        {
          text: "Rebuild lighting to refresh Lumen's global illumination cache.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Lumen is fully dynamic and doesn't use lightmaps. Rebuilding has no effect on Lumen reflections.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "lighting",
      title: "Understanding Lumen's Scene Representation",
      image_path: "assets/generated/LumenReflectionIncorrectColor/step-2.png",
      prompt:
        "<p>Before diving into settings, you need to understand how Lumen works. How does Lumen generate reflections?</p><p><strong>What is Lumen's approach to reflections?</strong></p>",
      choices: [
        {
          text: "Lumen uses a simplified scene representation called <strong>Surface Cache</strong>, then performs ray marching against this structure to calculate reflections.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Understanding the Surface Cache helps you diagnose why certain objects don't appear correctly in reflections.",
          next: "step-3",
        },
        {
          text: "Lumen pre-computes reflections during level load and stores them in a texture atlas.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. That's Reflection Captures' approach. Lumen is fully dynamic and calculates reflections each frame.",
          next: "step-2",
        },
        {
          text: "Lumen uses traditional ray tracing hardware to sample the full-resolution scene.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Hardware ray tracing is an option but software ray marching against the Surface Cache is Lumen's default mode.",
          next: "step-2",
        },
        {
          text: "Lumen copies screen-space pixels to create reflections, similar to SSR.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. SSR uses screen-space data only. Lumen can reflect off-screen objects via its 3D scene representation.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "lighting",
      title: "Checking Material Base Color",
      image_path: "assets/generated/LumenReflectionIncorrectColor/step-3.png",
      prompt:
        "<p>You check the red wall's material. The <code>Base Color</code> is a saturated red (RGB: 1.0, 0.1, 0.1), which should be visible to Lumen.</p><p><strong>The material looks correct. What else could prevent Lumen from capturing this surface?</strong></p>",
      choices: [
        {
          text: "Check if the wall mesh has <code>Affect Indirect Lighting</code> enabled in its <strong>Details Panel</strong> > <strong>Lighting</strong> category.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. This flag controls whether the mesh contributes to indirect lighting calculations, including Lumen's Surface Cache.",
          next: "step-4",
        },
        {
          text: "Enable <code>Two Sided</code> on the wall's material to ensure both faces emit light for Lumen.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Two-sided helps if viewing the backface, but standard walls face the camera. Check lighting flags first.",
          next: "step-3",
        },
        {
          text: "Add a <strong>Rect Light</strong> colored red behind the wall to boost its color contribution.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Additional lights can help but don't fix why Lumen isn't capturing the wall's color. Check mesh settings.",
          next: "step-3",
        },
        {
          text: "Convert the wall to a <strong>Nanite</strong> mesh to improve Lumen compatibility.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Nanite affects geometry rendering, not Lumen's lighting capture. Standard meshes work fine with Lumen.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "lighting",
      title: "Finding the Affect Indirect Lighting Flag",
      image_path: "assets/generated/LumenReflectionIncorrectColor/step-4.png",
      prompt:
        "<p>You select the wall mesh in the level. Where exactly do you find the <code>Affect Indirect Lighting</code> setting?</p><p><strong>How do you access this setting?</strong></p>",
      choices: [
        {
          text: "In the <strong>Details Panel</strong>, expand the <code>Lighting</code> category and look for <code>Affect Indirect Lighting</code> checkbox.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The Lighting category contains all per-mesh lighting behavior settings.",
          next: "step-5",
        },
        {
          text: "Open the mesh asset in the Static Mesh Editor and check its <strong>Lighting</strong> properties.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Some settings exist on the asset, but per-instance lighting flags are on the Actor in the level.",
          next: "step-4",
        },
        {
          text: "Check the material's <strong>Material</strong> category for Lumen-specific overrides.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Materials don't have indirect lighting toggles. This is a mesh/actor setting.",
          next: "step-4",
        },
        {
          text: "Look in <strong>World Settings</strong> for global indirect lighting toggles.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. World Settings has global GI options but not per-mesh controls. Check the mesh's Details Panel.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "lighting",
      title: "Enabling Indirect Lighting",
      image_path: "assets/generated/LumenReflectionIncorrectColor/step-5.png",
      prompt:
        "<p>You find <code>Affect Indirect Lighting</code> is disabled on the wall mesh. You enable it. What happens next?</p><p><strong>What should you expect?</strong></p>",
      choices: [
        {
          text: "Lumen will update its Surface Cache to include this mesh. Reflections should start showing the wall's color within a few frames.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Lumen dynamically updates as scene changes occur. No manual rebuild is needed.",
          next: "step-6",
        },
        {
          text: "You need to rebuild lighting for the change to take effect.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Lumen is fully dynamic. Changes apply immediately without rebuilding.",
          next: "step-5",
        },
        {
          text: "The change only affects runtime; you need to enter PIE to see the result.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Lumen updates in the editor viewport too. You can see results immediately.",
          next: "step-5",
        },
        {
          text: "You must save and restart the editor for Lumen to detect the new mesh.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. No restart needed. Lumen monitors scene changes continuously.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "lighting",
      title: "Checking Results",
      image_path: "assets/generated/LumenReflectionIncorrectColor/step-6.png",
      prompt:
        "<p>After enabling the flag, reflections improve — the chrome sphere now shows some red. However, the color still looks slightly washed out compared to the vibrant wall.</p><p><strong>What additional setting could improve color accuracy?</strong></p>",
      choices: [
        {
          text: "In <strong>Project Settings</strong> > <strong>Rendering</strong> > <strong>Lumen Global Illumination</strong>, increase <code>Final Gather Quality</code> to improve GI sampling accuracy.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Final Gather Quality affects how accurately Lumen samples indirect lighting. Higher values capture more color detail.",
          next: "step-7",
        },
        {
          text: "Increase the <code>Indirect Lighting Intensity</code> in the <strong>Post Process Volume</strong> to boost indirect bounce brightness.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. This amplifies existing GI but can over-expose other areas. Quality settings preserve accuracy better.",
          next: "step-6",
        },
        {
          text: "Switch the wall material's <code>Shading Model</code> from <code>Default Lit</code> to <code>Unlit</code> for maximum color emission.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Unlit materials don't interact with scene lighting at all, making them invisible to Lumen's indirect calculations.",
          next: "step-6",
        },
        {
          text: "Add an <code>Emissive</code> term to the wall material multiplied by the base color.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Emissive adds light emission but can cause unrealistic bloom on surfaces that shouldn't glow.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "lighting",
      title: "Locating Lumen Quality Settings",
      image_path: "assets/generated/LumenReflectionIncorrectColor/step-7.png",
      prompt:
        "<p>You need to find the Lumen quality settings in Project Settings. Where exactly are they located?</p><p><strong>What is the correct path?</strong></p>",
      choices: [
        {
          text: "Navigate to <strong>Project Settings</strong> > <strong>Engine</strong> > <strong>Rendering</strong>, then scroll to the <code>Global Illumination</code> section for Lumen settings.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Lumen GI settings are in the Rendering category alongside other graphics options.",
          next: "step-8",
        },
        {
          text: "Open <strong>Window</strong> > <strong>Lumen Settings</strong> for a dedicated Lumen configuration panel.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no separate Lumen Settings window. Settings are in Project Settings > Rendering.",
          next: "step-7",
        },
        {
          text: "Check the <strong>Post Process Volume</strong> for scene-specific Lumen overrides.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. PPV has some Lumen settings but Final Gather Quality is a project-level setting in Rendering.",
          next: "step-7",
        },
        {
          text: "Look in <strong>World Settings</strong> > <strong>Lightmass</strong> for the Lumen configuration.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Lightmass is the static lighting system. Lumen has its own section in Rendering settings.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "lighting",
      title: "Adjusting Final Gather Quality",
      image_path: "assets/generated/LumenReflectionIncorrectColor/step-8.png",
      prompt:
        "<p>You find the Lumen settings. <code>Final Gather Quality</code> is at the default value of <code>1.0</code>. What value should you try?</p><p><strong>What is a reasonable quality increase?</strong></p>",
      choices: [
        {
          text: "Try <code>2.0</code> first to double the sampling quality, then evaluate if further increases are needed based on visual results and performance.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Incremental increases let you find the sweet spot between quality and performance.",
          next: "step-9",
        },
        {
          text: "Set it to the maximum value of <code>8.0</code> to get the best possible quality.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Maximum isn't always necessary and has performance cost. Start with smaller increases.",
          next: "step-8",
        },
        {
          text: "Use <code>0.5</code> to improve performance while maintaining acceptable quality.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Reducing quality makes the washed-out color worse, not better.",
          next: "step-8",
        },
        {
          text: "Set it to exactly <code>4.0</code> as recommended for production quality.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no single 'production' value. It depends on your scene and target platform.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "lighting",
      title: "Performance Considerations",
      image_path: "assets/generated/LumenReflectionIncorrectColor/step-9.png",
      prompt:
        "<p>After increasing Final Gather Quality, reflections look great but you notice a small performance drop. How do you manage this for different platforms?</p><p><strong>What is the best approach?</strong></p>",
      choices: [
        {
          text: "Use <strong>Scalability Settings</strong> to define different Lumen quality levels per platform, keeping high settings for PC and lower for consoles.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Scalability CVars allow per-platform optimization while maintaining the best quality on capable hardware.",
          next: "step-10",
        },
        {
          text: "Revert to default quality and rely on <strong>Reflection Captures</strong> to supplement Lumen in this area.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Hybrid approaches work but lose dynamic benefits. Scalability is more flexible.",
          next: "step-9",
        },
        {
          text: "Reduce the resolution of all textures in the scene to free up GPU budget for Lumen.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Texture and Lumen budgets are largely separate. Use dedicated Lumen scalability.",
          next: "step-9",
        },
        {
          text: "Disable Lumen entirely on lower-end platforms and use Screen Space Reflections only.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. SSR is a fallback option, but scaled Lumen often looks better than no Lumen at all.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "lighting",
      title: "Using Lumen Scene View Mode",
      image_path: "assets/generated/LumenReflectionIncorrectColor/step-10.png",
      prompt:
        "<p>You want to debug Lumen's scene representation directly. There's a view mode specifically for this.</p><p><strong>How do you visualize what Lumen sees?</strong></p>",
      choices: [
        {
          text: "Switch to <strong>View Mode</strong> > <strong>Lumen</strong> > <code>Lumen Scene</code> to see the simplified Surface Cache representation Lumen uses for ray marching.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Lumen Scene shows exactly what surfaces contribute to Lumen's calculations, making issues obvious.",
          next: "step-11",
        },
        {
          text: "Enable <strong>Show</strong> > <strong>Visualize</strong> > <strong>GI Probes</strong> to see Lumen's sample points.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Probe visualization exists but Lumen Scene directly shows the Surface Cache representation.",
          next: "step-10",
        },
        {
          text: "Use <code>stat Lumen</code> console command to see a text readout of Lumen's state.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Stat commands show performance metrics, not visual debugging. Use the Lumen Scene view mode.",
          next: "step-10",
        },
        {
          text: "Enable <strong>Reflections</strong> view mode to see only the reflection contribution.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The Reflections buffer shows the final result, not Lumen's internal representation.",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "lighting",
      title: "Interpreting Lumen Scene View",
      image_path: "assets/generated/LumenReflectionIncorrectColor/step-11.png",
      prompt:
        "<p>In <code>Lumen Scene</code> view, the red wall now appears with its proper color, confirming it's in the Surface Cache. Some other meshes appear gray.</p><p><strong>What does gray typically indicate in this view?</strong></p>",
      choices: [
        {
          text: "Gray surfaces have <code>Affect Indirect Lighting</code> disabled or their materials don't contribute color to the Surface Cache.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. You can use this view to identify other meshes that might need their lighting flags enabled.",
          next: "step-12",
        },
        {
          text: "Gray indicates the mesh is too far from the camera to be included in the current Lumen update.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Distance affects detail level but nearby gray objects indicate missing flags or materials.",
          next: "step-11",
        },
        {
          text: "Gray means the mesh uses Nanite, which has a different representation.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Nanite meshes can contribute color. Gray indicates lighting settings, not mesh type.",
          next: "step-11",
        },
        {
          text: "Gray surfaces are placeholders that haven't finished loading into the Surface Cache.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Loading manifests differently. Persistent gray indicates the mesh isn't contributing.",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "lighting",
      title: "Final Verification",
      image_path: "assets/generated/LumenReflectionIncorrectColor/step-12.png",
      prompt:
        "<p>The chrome sphere now accurately reflects the red wall. How do you verify this works correctly at runtime?</p><p><strong>What is the final verification step?</strong></p>",
      choices: [
        {
          text: "Press <strong>Play in Editor</strong> and move around the chrome sphere, confirming reflections update dynamically as the view angle changes and that the red color remains accurate.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Runtime testing confirms Lumen's dynamic behavior works correctly from all angles.",
          next: "conclusion",
        },
        {
          text: "Compare before/after screenshots to document the improvement.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Screenshots are good for documentation but don't test dynamic behavior. Test in PIE.",
          next: "step-12",
        },
        {
          text: "Check <code>stat gpu</code> to ensure Lumen performance is acceptable.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Performance monitoring is separate from visual correctness verification. Test visuals first.",
          next: "step-12",
        },
        {
          text: "Package a build to test on target hardware.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Packaging is for final validation. PIE testing is sufficient for verifying the fix.",
          next: "step-12",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/LumenReflectionIncorrectColor/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've resolved the Lumen reflection color issue and understand how Lumen's Surface Cache works.</p><h4>Key Takeaways:</h4><ul><li><code>Affect Indirect Lighting</code> — Required for meshes to contribute to Lumen GI and reflections</li><li><strong>Surface Cache</strong> — Lumen's simplified scene representation for ray marching</li><li><code>Final Gather Quality</code> — Controls sampling accuracy for indirect lighting color</li><li><code>Lumen Scene</code> view mode — Visualizes what Lumen captures for ray marching</li><li><strong>Scalability Settings</strong> — Balance quality per platform without code changes</li><li><strong>Dynamic Updates</strong> — Lumen reacts to scene changes without rebuilding</li></ul>",
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
