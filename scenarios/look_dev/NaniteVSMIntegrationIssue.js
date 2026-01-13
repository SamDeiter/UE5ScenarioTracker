window.SCENARIOS["NaniteVSMIntegrationIssue"] = {
  meta: {
    title: "Nanite Meshes Not Casting Shadows in Lumen Scenes",
    description:
      "Your Nanite-enabled architectural meshes appear correctly but don't cast shadows when using Lumen Global Illumination with Virtual Shadow Maps.",
    estimateHours: 1.5,
    difficulty: "Advanced",
    category: "Look Dev",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "NaniteVSMIntegrationIssue",
      step: "setup",
    },
  ],
  fault: {
    description: "Nanite meshes don't cast shadows with VSM",
    visual_cue:
      "Detailed architectural models appear flat without shadow definition",
  },
  expected: {
    description:
      "Nanite meshes cast proper shadows through Virtual Shadow Maps",
    validation_action: "verify_nanite_shadows",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "NaniteVSMIntegrationIssue",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "look_dev",
      title: "Initial Observation",
      image_path: "assets/generated/NaniteVSMIntegrationIssue/step-1.png",
      prompt:
        "<p>Your detailed building meshes using Nanite look geometrically correct, but appear flat and lack shadow definition. Traditional static meshes in the same scene cast shadows normally.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Check the Static Mesh asset's <code>Cast Shadow</code> setting and verify the mesh is actually using Nanite via the Nanite visualization mode.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Confirming Nanite is active and shadow casting is enabled is the first check.",
          next: "step-2",
        },
        {
          text: "Disable Nanite on the meshes to see if traditional shadows appear.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Disabling tests the theory but loses Nanite benefits. Diagnose the issue first.",
          next: "step-1",
        },
        {
          text: "Increase the light intensity to make shadows more visible.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Light intensity affects brightness, not shadow casting ability. Check mesh settings.",
          next: "step-1",
        },
        {
          text: "Verify Lumen is enabled in Project Settings.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Lumen affects GI, not shadow casting. Check mesh shadow settings.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "look_dev",
      title: "Verifying Nanite Status",
      image_path: "assets/generated/NaniteVSMIntegrationIssue/step-2.png",
      prompt:
        "<p>You use <code>View Mode > Nanite Visualization</code> and the meshes show as Nanite-enabled (green). Cast Shadow is enabled. What else could prevent shadows?</p><p><strong>What other settings affect Nanite shadow casting?</strong></p>",
      choices: [
        {
          text: "Check if <code>Virtual Shadow Maps</code> are enabled in Project Settings and if the Nanite proxy mesh is configured for shadow casting.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. VSM must be enabled for Nanite shadow casting. Nanite uses VSM exclusively.",
          next: "step-3",
        },
        {
          text: "Check the material's Cast Shadow property.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Material shadows affect transmission, but the mesh setting controls shadow casting.",
          next: "step-2",
        },
        {
          text: "Verify the light's shadow settings are set to Ray Traced Shadows.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Ray traced shadows are separate from VSM. Nanite uses VSM, not ray tracing.",
          next: "step-2",
        },
        {
          text: "Check if the mesh mobility is set to Movable instead of Static.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Nanite works with both mobilities for shadows. Check VSM configuration.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "look_dev",
      title: "Understanding Nanite and VSM",
      image_path: "assets/generated/NaniteVSMIntegrationIssue/step-3.png",
      prompt:
        "<p>VSM is enabled. Why do Nanite meshes require Virtual Shadow Maps specifically?</p><p><strong>What is the Nanite-VSM relationship?</strong></p>",
      choices: [
        {
          text: "Nanite's virtualized geometry doesn't work with traditional shadow mapping techniques. VSM's virtualized pages match Nanite's streaming architecture for efficient shadow rendering.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Understanding the architectural relationship helps troubleshoot integration issues.",
          next: "step-4",
        },
        {
          text: "Nanite is too detailed for traditional shadow maps to handle.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Detail level matters, but it's the virtualization architecture that requires VSM.",
          next: "step-3",
        },
        {
          text: "VSM is just the newest shadow technology, not specifically required for Nanite.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. VSM is architecturally required for Nanite, not just a preference.",
          next: "step-3",
        },
        {
          text: "Nanite meshes disable all other shadow methods automatically.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. It's not about disabling but about VSM being the only compatible method.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "look_dev",
      title: "Checking Fallback Mesh",
      image_path: "assets/generated/NaniteVSMIntegrationIssue/step-4.png",
      prompt:
        "<p>You check Project Settings and VSM is enabled, but shadows still don't appear. What mesh setting specifically controls Nanite shadow casting?</p><p><strong>What mesh property affects Nanite shadows?</strong></p>",
      choices: [
        {
          text: "Check the Static Mesh asset's <code>Nanite Settings > Fallback Relative Error</code> and ensure a fallback mesh exists for shadow rendering.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Fallback mesh is used for certain shadow operations. Missing fallback can cause issues.",
          next: "step-5",
        },
        {
          text: "Enable 'Use Nanite for Shadow Rendering' in the mesh settings.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no such toggle; Nanite shadows work through VSM automatically if configured.",
          next: "step-4",
        },
        {
          text: "Reduce the mesh triangle count to be within shadow limits.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Nanite handles any triangle count. Check fallback mesh configuration.",
          next: "step-4",
        },
        {
          text: "Set the mesh's shadow resolution scale higher.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. VSM manages resolution automatically. Check the fallback mesh.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "look_dev",
      title: "Regenerating Fallback",
      image_path: "assets/generated/NaniteVSMIntegrationIssue/step-5.png",
      prompt:
        "<p>The fallback mesh is missing or corrupted. How do you regenerate it?</p><p><strong>How do you fix the fallback mesh?</strong></p>",
      choices: [
        {
          text: "Open the Static Mesh asset, go to <code>Nanite Settings</code>, and click <code>Rebuild Nanite</code> with appropriate fallback settings to regenerate all Nanite data.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Rebuild Nanite regenerates both the virtualized geometry and fallback mesh.",
          next: "step-6",
        },
        {
          text: "Re-import the mesh from the source FBX file.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Re-import works but Rebuild Nanite is faster for this specific issue.",
          next: "step-5",
        },
        {
          text: "Delete and recreate the Static Mesh asset.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Deletion loses settings. Rebuild Nanite fixes the mesh in place.",
          next: "step-5",
        },
        {
          text: "Manually assign a LOD as the fallback mesh.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Fallback is auto-generated from Nanite settings, not LOD assignment.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "look_dev",
      title: "Light Shadow Setting",
      image_path: "assets/generated/NaniteVSMIntegrationIssue/step-6.png",
      prompt:
        "<p>Fallback is regenerated but shadows still don't appear from the Directional Light. What light setting could block Nanite shadow casting?</p><p><strong>What light setting affects Nanite shadows?</strong></p>",
      choices: [
        {
          text: "Check if <code>Cast Shadows</code> is enabled on the Directional Light and that it's not set to use <code>Ray Traced Shadows</code> which bypasses VSM.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Ray traced shadows use a different path. VSM requires the default shadow method.",
          next: "step-7",
        },
        {
          text: "Increase the Directional Light's shadow cascade count.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Cascades apply to traditional SM not VSM. Check the shadow type setting.",
          next: "step-6",
        },
        {
          text: "Set the light's mobility to Stationary for better shadows.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Light mobility affects GI baking, not VSM shadow casting.",
          next: "step-6",
        },
        {
          text: "Enable 'Affect Dynamic Indirect Lighting' on the light.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. That affects GI bounce, not direct shadow casting. Check shadow type.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "look_dev",
      title: "Checking Shadow Distance",
      image_path: "assets/generated/NaniteVSMIntegrationIssue/step-7.png",
      prompt:
        "<p>Light is set correctly. The meshes are very far from the camera start point. Why might distance affect shadow visibility?</p><p><strong>How does distance affect VSM?</strong></p>",
      choices: [
        {
          text: "VSM has a configured shadow distance. Objects beyond this range don't receive shadow calculations. Check <code>r.Shadow.DistanceScale</code> or the light's <code>Dynamic Shadow Distance</code>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Shadow distance culling saves performance but can hide distant shadows.",
          next: "step-8",
        },
        {
          text: "Nanite meshes are automatically culled at distance.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Nanite has visibility ranges but shadow distance is separate.",
          next: "step-7",
        },
        {
          text: "The camera's far clip plane is cutting off shadow rendering.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Clip plane affects view, not shadow calculation. Check shadow distance.",
          next: "step-7",
        },
        {
          text: "Move the meshes closer to the camera to fix the issue.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Moving disrupts level design. Increase shadow distance instead.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "look_dev",
      title: "Per-Component Shadow Settings",
      image_path: "assets/generated/NaniteVSMIntegrationIssue/step-8.png",
      prompt:
        "<p>Shadow distance is sufficient. The mesh is placed via Blueprint. Where else could shadow casting be disabled?</p><p><strong>What per-instance settings affect shadows?</strong></p>",
      choices: [
        {
          text: "Check the <strong>Static Mesh Component</strong> in the Blueprint. The component has its own <code>Cast Shadow</code> toggle that overrides the asset setting.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Component-level settings override asset defaults. Verify both are enabled.",
          next: "step-9",
        },
        {
          text: "Blueprint actors can't cast Nanite shadows; use level-placed meshes.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Blueprints work fine with Nanite. Check component shadow settings.",
          next: "step-8",
        },
        {
          text: "Add a 'Enable Nanite Shadows' function call to the Blueprint.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. No such function exists. Check the mesh component's shadow property.",
          next: "step-8",
        },
        {
          text: "Recompile the Blueprint to refresh shadow settings.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Recompile doesn't fix settings. Actually check and enable Cast Shadow.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "look_dev",
      title: "Material Issues",
      image_path: "assets/generated/NaniteVSMIntegrationIssue/step-9.png",
      prompt:
        "<p>Component Cast Shadow was off; enabling it helps some meshes. Others with translucent or masked materials still don't cast shadows. Why?</p><p><strong>Why do some materials not cast Nanite shadows?</strong></p>",
      choices: [
        {
          text: "Nanite currently requires <strong>Opaque</strong> materials for standard shadow casting. Masked and translucent materials need special handling via <code>Enable Shadow Material</code> or may not support Nanite fully.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Material blend mode affects Nanite compatibility and shadow casting capability.",
          next: "step-10",
        },
        {
          text: "Increase the shadow opacity in the material settings.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no shadow opacity. The blend mode determines compatibility.",
          next: "step-9",
        },
        {
          text: "Masked materials always cast shadows; it's another setting.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Masked has specific Nanite limitations. Check blend mode compatibility.",
          next: "step-9",
        },
        {
          text: "Convert all materials to Opaque for Nanite compatibility.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Opaque loses needed effects. Use appropriate shadow handling per material.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "look_dev",
      title: "Enabling Masked Shadows",
      image_path: "assets/generated/NaniteVSMIntegrationIssue/step-10.png",
      prompt:
        "<p>Some meshes need masked materials for cutout foliage on buildings. How do you enable shadows for Nanite with masked materials?</p><p><strong>How do masked materials work with Nanite shadows?</strong></p>",
      choices: [
        {
          text: "Enable <code>Evaluate World Position Offset</code> in the Nanite settings and ensure the material's opacity mask is properly connected to the Masked output.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. WPO evaluation and proper mask connection enable Nanite masked shadow support.",
          next: "step-11",
        },
        {
          text: "Disable Nanite on meshes using masked materials.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Disabling loses Nanite benefits. Configure the material correctly instead.",
          next: "step-10",
        },
        {
          text: "Create a separate shadow-only opaque version of each mesh.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Duplicate meshes are complex to maintain. Use proper Nanite masked support.",
          next: "step-10",
        },
        {
          text: "Use a custom shadow material override.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Shadow material overrides exist but aren't needed for standard masked materials.",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "look_dev",
      title: "World Position Offset Impact",
      image_path: "assets/generated/NaniteVSMIntegrationIssue/step-11.png",
      prompt:
        "<p>Some buildings have animated flags using World Position Offset. The flags cast shadows but the shadows don't animate. Why?</p><p><strong>Why don't WPO shadows animate?</strong></p>",
      choices: [
        {
          text: "By default, VSM caches shadow pages. Animated WPO requires enabling <code>Evaluate WPO in Shadows</code> on the mesh or globally invalidating pages for animated geometry.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. WPO shadow evaluation must be explicitly enabled due to performance cost.",
          next: "step-12",
        },
        {
          text: "WPO doesn't affect shadows; only mesh transforms do.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. WPO can affect shadows when properly configured. Enable WPO shadow evaluation.",
          next: "step-11",
        },
        {
          text: "Increase the shadow update rate in VSM settings.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Update rate controls cache, but WPO needs explicit evaluation enable.",
          next: "step-11",
        },
        {
          text: "Convert flag animation to skeletal mesh for shadow support.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Conversion is complex. WPO shadows can work with proper settings.",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "look_dev",
      title: "Instance Culling",
      image_path: "assets/generated/NaniteVSMIntegrationIssue/step-12.png",
      prompt:
        "<p>You have instanced meshes (placed via Foliage or manually). Some instances cast shadows while others don't. What causes inconsistent instance shadows?</p><p><strong>Why are some instances not casting shadows?</strong></p>",
      choices: [
        {
          text: "Check if <code>Cull Distance</code> is set on the Instanced Static Mesh component. Instances beyond cull distance don't cast shadows even if visible via Nanite streaming.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Cull distance affects rendering and shadow casting independently.",
          next: "step-13",
        },
        {
          text: "Instanced meshes don't support per-instance shadow casting.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Instances support shadows fully. Check cull distance configuration.",
          next: "step-12",
        },
        {
          text: "Random seeds in the foliage tool affect shadow casting.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Random seeds affect placement/scale, not shadows. Check cull distance.",
          next: "step-12",
        },
        {
          text: "Increase VSM page count to handle more instances.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Page count affects quality, not whether instances cast shadows. Check cull distance.",
          next: "step-12",
        },
      ],
    },
    "step-13": {
      skill: "look_dev",
      title: "Performance Optimization",
      image_path: "assets/generated/NaniteVSMIntegrationIssue/step-13.png",
      prompt:
        "<p>All shadows are working. The scene has many Nanite meshes and performance dropped. How do you optimize Nanite VSM performance?</p><p><strong>What optimizes Nanite shadow performance?</strong></p>",
      choices: [
        {
          text: "Use <code>r.Shadow.Virtual.Cache.StaticSeparate 1</code> to cache static Nanite shadows, reducing re-rendering for non-moving geometry.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Static separation caches unchanging geometry shadows for significant savings.",
          next: "step-14",
        },
        {
          text: "Reduce Nanite triangle count across all meshes.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Nanite handles any triangle count efficiently. Focus on caching settings.",
          next: "step-13",
        },
        {
          text: "Disable shadows on less important meshes.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Disabling reduces visual quality. Caching is the better optimization.",
          next: "step-13",
        },
        {
          text: "Lower the overall quality settings in Project Settings.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Global quality affects everything. Target shadow caching specifically.",
          next: "step-13",
        },
      ],
    },
    "step-14": {
      skill: "look_dev",
      title: "Debug Verification",
      image_path: "assets/generated/NaniteVSMIntegrationIssue/step-14.png",
      prompt:
        "<p>How do you verify all Nanite meshes in the scene are correctly configured for shadow casting?</p><p><strong>What is the verification approach?</strong></p>",
      choices: [
        {
          text: "Use a combination of <code>Nanite Visualization</code> mode and <code>r.Shadow.Virtual.Visualize 1</code> to confirm meshes are Nanite-enabled AND casting shadows through VSM pages.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Both visualizations together confirm the complete Nanite-VSM integration.",
          next: "step-15",
        },
        {
          text: "Count the number of Nanite-enabled meshes in the outliner.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Counting doesn't verify shadow casting. Use visualization modes.",
          next: "step-14",
        },
        {
          text: "Check the Output Log for Nanite shadow warnings.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Logs help but visual verification is more comprehensive.",
          next: "step-14",
        },
        {
          text: "Review each mesh's Details panel individually.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Individual review is slow for large scenes. Use visualization modes.",
          next: "step-14",
        },
      ],
    },
    "step-15": {
      skill: "look_dev",
      title: "Final Validation",
      image_path: "assets/generated/NaniteVSMIntegrationIssue/step-15.png",
      prompt:
        "<p>What is the final validation that Nanite and VSM are working correctly together?</p><p><strong>What confirms complete integration?</strong></p>",
      choices: [
        {
          text: "Fly through the entire level observing shadow quality at various distances and verify <code>stat ShadowRendering</code> shows healthy Nanite GPU times without spikes.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Level traversal with performance monitoring validates visual quality and efficiency.",
          next: "conclusion",
        },
        {
          text: "Package the game and test on target hardware.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Packaging is important but editor testing catches most issues faster.",
          next: "step-15",
        },
        {
          text: "Compare file sizes of Nanite meshes before and after fix.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. File size doesn't indicate shadow functionality. Use runtime testing.",
          next: "step-15",
        },
        {
          text: "Review all console variables are saved to config files.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Config saving is important but visual verification confirms behavior.",
          next: "step-15",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/NaniteVSMIntegrationIssue/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've resolved Nanite mesh shadow casting issues with Virtual Shadow Maps.</p><h4>Key Takeaways:</h4><ul><li><strong>Nanite requires VSM</strong> — Virtual Shadow Maps are architecturally required for Nanite shadows</li><li><code>Rebuild Nanite</code> — Regenerates fallback mesh needed for some shadow operations</li><li><strong>Component Cast Shadow</strong> — Per-instance toggle overrides asset settings</li><li><strong>Material Blend Mode</strong> — Opaque works best; masked needs WPO evaluation enabled</li><li><code>Evaluate WPO in Shadows</code> — Required for animated material shadows</li><li><code>Cull Distance</code> — Affects shadow casting for instanced meshes</li><li><code>r.Shadow.Virtual.Cache.StaticSeparate</code> — Optimizes static Nanite shadows</li></ul>",
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
