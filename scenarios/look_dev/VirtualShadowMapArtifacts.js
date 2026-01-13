window.SCENARIOS["VirtualShadowMapArtifacts"] = {
  meta: {
    title: "Virtual Shadow Maps Causing Shadow Artifacts on Characters",
    description:
      "Characters and animated objects show flickering shadow artifacts, shadow detachment, or missing shadows when using Virtual Shadow Maps (VSM) in Lumen-lit scenes.",
    estimateHours: 1.25,
    difficulty: "Intermediate",
    category: "Look Dev",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "VirtualShadowMapArtifacts",
      step: "setup",
    },
  ],
  fault: {
    description: "Virtual Shadow Maps produce artifacts on skinned meshes",
    visual_cue:
      "Character shadows flicker, detach from feet, or show noise patterns",
  },
  expected: {
    description: "Clean, stable shadows on all characters and animated objects",
    validation_action: "verify_vsm_quality",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "VirtualShadowMapArtifacts",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "look_dev",
      title: "Initial Observation",
      image_path: "assets/generated/VirtualShadowMapArtifacts/step-1.png",
      prompt:
        "<p>Your character's shadow flickers rapidly and sometimes appears detached from their feet, especially during movement. Static meshes cast clean shadows.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Use <code>r.Shadow.Virtual.Visualize 1</code> to enable VSM debug visualization and identify which pages are causing artifacts.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. VSM visualization reveals page allocation issues and cache behavior on problem areas.",
          next: "step-2",
        },
        {
          text: "Disable Virtual Shadow Maps and switch to traditional shadow maps.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Switching may fix symptoms but loses VSM benefits. Diagnose the specific issue first.",
          next: "step-1",
        },
        {
          text: "Increase the light's shadow resolution setting.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. VSM resolution is controlled by page pool size, not per-light settings. Check VSM config.",
          next: "step-1",
        },
        {
          text: "Check if the character's skeleton has invalid bone transforms.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Skeleton issues would affect the mesh visual, not just shadows. Focus on VSM settings.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "look_dev",
      title: "Understanding VSM Architecture",
      image_path: "assets/generated/VirtualShadowMapArtifacts/step-2.png",
      prompt:
        "<p>The visualization shows many small red/yellow pages around the character. What does this indicate about Virtual Shadow Maps?</p><p><strong>What do colored pages represent?</strong></p>",
      choices: [
        {
          text: "Red/yellow pages indicate high churn—pages being frequently invalidated and re-rendered. Skinned meshes invalidate pages every frame due to animation, causing cache pressure.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Understanding page invalidation helps tune VSM for animated content.",
          next: "step-3",
        },
        {
          text: "Red pages are errors that need to be fixed in the character mesh.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Colors show cache behavior, not errors. High churn is expected for animated meshes.",
          next: "step-2",
        },
        {
          text: "Yellow pages are low resolution and need more shadow map texels.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Color indicates invalidation frequency, not resolution. Focus on cache pressure.",
          next: "step-2",
        },
        {
          text: "Red pages indicate the character is outside the shadow distance.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Distance culling would hide shadows entirely. This is page churn from animation.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "look_dev",
      title: "Increasing Page Pool Size",
      image_path: "assets/generated/VirtualShadowMapArtifacts/step-3.png",
      prompt:
        "<p>Page churn suggests the page pool is undersized for your animated content. How do you increase the VSM page pool?</p><p><strong>What setting controls page pool size?</strong></p>",
      choices: [
        {
          text: "Increase <code>r.Shadow.Virtual.MaxPhysicalPages</code> in Project Settings or via console to allocate more pages for shadow caching.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. More physical pages reduce eviction frequency and improve stability for animated shadows.",
          next: "step-4",
        },
        {
          text: "Increase the Directional Light's <code>Dynamic Shadow Distance</code>.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Shadow distance affects range, not page pool size. Adjust MaxPhysicalPages.",
          next: "step-3",
        },
        {
          text: "Enable <code>High Resolution Shadows</code> in the Post Process Volume.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. PPV doesn't control VSM pool. Use the r.Shadow.Virtual console commands.",
          next: "step-3",
        },
        {
          text: "Reduce the number of shadow-casting lights in the scene.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Fewer lights reduces total demand but doesn't fix per-character artifacts. Increase pool.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "look_dev",
      title: "Adjusting Page Resolution",
      image_path: "assets/generated/VirtualShadowMapArtifacts/step-4.png",
      prompt:
        "<p>More pages helped but shadows still show edge noise. What controls the resolution of individual shadow pages?</p><p><strong>What setting affects page resolution?</strong></p>",
      choices: [
        {
          text: "Adjust <code>r.Shadow.Virtual.ResolutionLodBiasLocal</code> to control LOD bias for local (point/spot) lights, or <code>...Directional</code> for directional lights.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. LOD bias affects page resolution. Lower values increase quality at GPU cost.",
          next: "step-5",
        },
        {
          text: "Change the texture resolution in the light's Details panel.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. VSM doesn't use per-light resolution settings. Use r.Shadow.Virtual commands.",
          next: "step-4",
        },
        {
          text: "Increase screen percentage in the project's rendering settings.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Screen percentage affects render resolution, not shadow maps. Use VSM LOD bias.",
          next: "step-4",
        },
        {
          text: "Set the character material to use higher LOD bias.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Material LOD affects mesh detail, not shadows. Configure VSM resolution directly.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "look_dev",
      title: "Shadow Bias Settings",
      image_path: "assets/generated/VirtualShadowMapArtifacts/step-5.png",
      prompt:
        "<p>Resolution improved, but shadows show self-shadowing artifacts (shadow acne) on the character's face. What causes this?</p><p><strong>What causes shadow acne?</strong></p>",
      choices: [
        {
          text: "Shadow acne occurs when the depth bias is too low, causing surfaces to shadow themselves. Increase <code>r.Shadow.Virtual.MarkCoarsePagesDirectional</code> or per-light shadow bias.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Proper bias prevents self-shadowing while maintaining contact shadows.",
          next: "step-6",
        },
        {
          text: "The character mesh has inverted normals that need to be fixed.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Inverted normals affect shading but shadow acne is a bias issue.",
          next: "step-5",
        },
        {
          text: "The character's material has opacity issues causing shadow errors.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Opacity affects shadow casting but acne is from insufficient depth bias.",
          next: "step-5",
        },
        {
          text: "Reduce the light intensity to prevent over-bright self-shadows.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Light intensity doesn't affect shadow acne. Adjust shadow bias.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "look_dev",
      title: "Contact Shadow Tuning",
      image_path: "assets/generated/VirtualShadowMapArtifacts/step-6.png",
      prompt:
        "<p>Bias adjustment removed acne but now feet appear to float above the ground. How do you restore ground contact shadows?</p><p><strong>How do you improve contact shadows?</strong></p>",
      choices: [
        {
          text: "Enable <code>Contact Shadows</code> on the light and adjust <code>Contact Shadow Length</code> to add screen-space contact detail that VSM may miss.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Contact shadows supplement VSM for small-scale shadow contact that bias removes.",
          next: "step-7",
        },
        {
          text: "Move the character mesh vertices closer to the ground plane.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Mesh modification doesn't fix shadow rendering. Enable contact shadows.",
          next: "step-6",
        },
        {
          text: "Reduce the shadow bias back to previous levels.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Lower bias reintroduces acne. Use contact shadows for small detail.",
          next: "step-6",
        },
        {
          text: "Add a decal under the character to simulate contact shadow.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Decals are manual workarounds. Contact shadows are the proper solution.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "look_dev",
      title: "Skeletal Mesh Shadow Settings",
      image_path: "assets/generated/VirtualShadowMapArtifacts/step-7.png",
      prompt:
        "<p>Contact shadows improved grounding. The character still has artifacts during fast animations. What skeletal mesh settings affect shadow quality?</p><p><strong>What mesh settings affect animated shadows?</strong></p>",
      choices: [
        {
          text: "Check the <code>Shadow Physics Asset</code> and <code>Capsule Shadows</code> settings. For VSM, ensure <code>Cast Dynamic Shadow</code> uses proper bounds.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Shadow physics assets and bounds affect how VSM tracks animated geometry.",
          next: "step-8",
        },
        {
          text: "Increase the skeleton's update rate to match animation framerate.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Update rate affects gameplay, not shadow rendering quality.",
          next: "step-7",
        },
        {
          text: "Enable motion blur to hide shadow artifacts during fast movement.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Motion blur masks but doesn't fix. Address the shadow bounds issue.",
          next: "step-7",
        },
        {
          text: "Reduce animation blend times to minimize deformation.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Blend times affect transitions, not shadow calculation. Check shadow settings.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "look_dev",
      title: "Bounds Scale",
      image_path: "assets/generated/VirtualShadowMapArtifacts/step-8.png",
      prompt:
        "<p>The mesh bounds are too tight during extreme poses, causing shadow clipping. How do you expand the bounds?</p><p><strong>How do you fix tight bounds?</strong></p>",
      choices: [
        {
          text: "Increase <code>Bounds Scale</code> in the Skeletal Mesh component's Details panel to ensure the bounding box covers all animation extremes.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Larger bounds ensure shadows are calculated for the full animation range.",
          next: "step-9",
        },
        {
          text: "Re-import the mesh with a larger bounding box from the DCC tool.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Re-import works but Bounds Scale is faster for runtime adjustment.",
          next: "step-8",
        },
        {
          text: "Add invisible collision around the character to expand bounds.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Collision doesn't affect render bounds. Use the Bounds Scale property.",
          next: "step-8",
        },
        {
          text: "Set the component's mobility to Static to lock bounds.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Static mobility prevents animation. Keep Movable and adjust Bounds Scale.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "look_dev",
      title: "Far Cascade Settings",
      image_path: "assets/generated/VirtualShadowMapArtifacts/step-9.png",
      prompt:
        "<p>Close-up shadows are good now. Characters far from the camera show low-quality, blocky shadows. What controls distant shadow quality?</p><p><strong>What affects far shadow quality?</strong></p>",
      choices: [
        {
          text: "VSM uses clipmaps for distant geometry. Adjust <code>r.Shadow.Virtual.Clipmap.FirstLevel</code> and <code>...LastLevel</code> to control far cascade quality.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Clipmap levels determine resolution at distance. More levels improve far shadows.",
          next: "step-10",
        },
        {
          text: "Increase the camera's far clip plane distance.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Far clip affects visibility, not shadow quality. Adjust clipmap levels.",
          next: "step-9",
        },
        {
          text: "Enable cascade shadow maps in addition to VSM.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Mixing shadow systems is complex. Tune VSM clipmaps instead.",
          next: "step-9",
        },
        {
          text: "Use LOD on characters to reduce shadow complexity at distance.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. LOD reduces mesh detail but doesn't improve shadow resolution. Use clipmaps.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "look_dev",
      title: "Two-Sided Shadow Foliage Issue",
      image_path: "assets/generated/VirtualShadowMapArtifacts/step-10.png",
      prompt:
        "<p>Characters near foliage show shadow bleeding through leaves. How do you handle two-sided geometry in VSM?</p><p><strong>What causes foliage shadow issues?</strong></p>",
      choices: [
        {
          text: "Enable <code>Shadow Two Sided</code> on foliage materials and adjust per-material shadow bias to prevent light leaking through thin geometry.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Two-sided shadows and proper bias handle thin geometry shadow casting.",
          next: "step-11",
        },
        {
          text: "Increase foliage mesh density to fill shadow gaps.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Density increase is expensive. Two-sided shadow is the proper fix.",
          next: "step-10",
        },
        {
          text: "Disable shadows on all foliage to avoid conflicts.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Disabling removes important environmental shadows. Enable two-sided.",
          next: "step-10",
        },
        {
          text: "Convert foliage to static lighting only.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Static lighting loses dynamic response. Fix the dynamic shadow settings.",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "look_dev",
      title: "Performance Validation",
      image_path: "assets/generated/VirtualShadowMapArtifacts/step-11.png",
      prompt:
        "<p>Shadows look great. How do you verify the VSM performance impact of your changes?</p><p><strong>How do you monitor VSM performance?</strong></p>",
      choices: [
        {
          text: "Use <code>stat ShadowRendering</code> to see VSM page allocations, cache hits, and GPU time spent on shadow rendering.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. stat ShadowRendering shows real-time VSM metrics for optimization.",
          next: "step-12",
        },
        {
          text: "Check the frame time in the editor's FPS counter.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. FPS shows total performance but not shadow-specific breakdown. Use stat.",
          next: "step-11",
        },
        {
          text: "Count the number of shadow-casting lights in the scene.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Light count doesn't show actual performance. Use stat ShadowRendering.",
          next: "step-11",
        },
        {
          text: "Profile on target hardware only, as editor stats are inaccurate.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Target profiling is important but editor stat gives quick feedback.",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "look_dev",
      title: "Final Verification",
      image_path: "assets/generated/VirtualShadowMapArtifacts/step-12.png",
      prompt:
        "<p>Performance is acceptable. What is the final verification that VSM is working correctly for all characters?</p><p><strong>What confirms complete VSM fix?</strong></p>",
      choices: [
        {
          text: "Test multiple characters performing various animations in different lighting conditions to confirm consistent, artifact-free shadows across all scenarios.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Comprehensive animation testing validates the fix across use cases.",
          next: "conclusion",
        },
        {
          text: "Verify the console variables are saved in the project's DefaultEngine.ini.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Config saving is important but visual testing confirms behavior.",
          next: "step-12",
        },
        {
          text: "Check that all materials have consistent shadow settings.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Material consistency helps but gameplay testing is the ultimate validation.",
          next: "step-12",
        },
        {
          text: "Review the VSM documentation for recommended settings.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Documentation is helpful but practical testing confirms your specific scene works.",
          next: "step-12",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/VirtualShadowMapArtifacts/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've resolved Virtual Shadow Map artifacts on animated characters.</p><h4>Key Takeaways:</h4><ul><li><code>r.Shadow.Virtual.Visualize 1</code> — Debug visualization for page behavior</li><li><code>r.Shadow.Virtual.MaxPhysicalPages</code> — Controls page pool size</li><li><code>r.Shadow.Virtual.ResolutionLodBiasLocal/Directional</code> — Controls page resolution</li><li><strong>Contact Shadows</strong> — Supplements VSM for small-scale contact detail</li><li><code>Bounds Scale</code> — Ensures animation extremes are included in shadow calculation</li><li><strong>Clipmap Levels</strong> — Controls distant shadow quality</li><li><code>stat ShadowRendering</code> — Performance monitoring for VSM</li></ul>",
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
