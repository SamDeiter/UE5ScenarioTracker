window.SCENARIOS["lumen_gi_failure"] = {
  id: "lumen_gi_failure",
  category: "Lighting & Rendering",
  meta: {
    title: "Lumen GI Loss from Distant Emissive Display",
    category: "Lighting & Rendering",
    description:
      "An industrial corridor features a large holographic display panel mounted on the wall. When close, it casts beautiful cyan GI onto nearby surfaces. But from a distance (50m+), the GI contribution vanishes. The display remains bright, but surrounding walls go dark.",
    estimateHours: 2.5,
    difficulty: "Intermediate",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "lumen_gi_failure",
      step: "setup",
    },
  ],
  fault: {
    description:
      "GI contribution from emissive display vanishes at a distance.",
    visual_cue: "Scene darkens as player moves back from display",
  },
  expected: {
    description: "Stable GI contribution even at extreme distances.",
    validation_action: "verify_lumen_contribution",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "lumen_gi_failure",
      step: "conclusion",
    },
  ],
  start: "step-0",
  steps: {
    "step-0": {
      image_path: "step-0.png",
      skill: "lumen",
      title: "Initial Observation",
      prompt:
        "<p>You're 50 meters from a large holographic display panel mounted on the industrial corridor wall. The display itself is glowing bright cyan, but the walls and floor near you are dark with no GI bounce.</p><p>When you move closer, the cyan light bounces beautifully onto nearby surfaces.</p><strong>What is the most likely cause of this distance-based GI loss?</strong>",
      choices: [
        {
          text: "Lumen Scene View Distance is set too low",
          type: "correct",
          feedback:
            "<p>You identified the core issue immediately. The engine isn't calculating GI beyond a certain distance.</p>",
          next: "step-1",
        },
        {
          text: "The emissive material intensity is too weak",
          type: "misguided",
          feedback:
            "<p>You spent 20 minutes cranking up the emissive intensity to extreme values... but the GI still cuts off at the same distance. The brightness isn't the issue.</p>",
          next: "step-0",
        },
        {
          text: "Lumen is disabled in the Post Process Volume",
          type: "wrong",
          feedback:
            "<p>You checked the PPV settings - Lumen is enabled. If it were disabled, the GI wouldn't work at ANY distance.</p>",
          next: "step-0",
        },
        {
          text: "The mesh is too small to contribute significant GI",
          type: "wrong",
          feedback:
            "<p>You measured the display - it's 10 meters wide. Size isn't the problem when it works fine up close.</p>",
          next: "step-0",
        },
      ],
    },
    "step-1": {
      image_path: "lumen-scene-viz.png",
      skill: "lumen",
      title: "Diagnosing the Mesh Contribution",
      prompt:
        "<p>You've enabled the Lumen Scene visualization (Show > Visualize > Lumen Scene). The holographic display panel is properly represented in the distance field with an orange selection highlight.</p><strong>Before adjusting Project Settings, what mesh-level property should you verify is enabled?</strong>",
      choices: [
        {
          text: "Affect Global Illumination (in the Lighting section)",
          type: "correct",
          feedback:
            "<p>Good - you confirmed the mesh is set to contribute to GI. It was already enabled, so the issue is elsewhere.</p>",
          next: "step-2",
        },
        {
          text: "Cast Shadows",
          type: "misguided",
          feedback:
            "<p>You toggled Cast Shadows on and off... but that controls shadow casting, not emissive GI contribution.</p>",
          next: "step-1",
        },
        {
          text: "Generate Overlap Events",
          type: "wrong",
          feedback:
            "<p>That's a collision setting, completely unrelated to lighting. Back to the Details panel...</p>",
          next: "step-1",
        },
        {
          text: "Use as Occluder",
          type: "wrong",
          feedback:
            "<p>That's for occlusion culling optimization, not lighting contribution. Try a lighting-related property.</p>",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      image_path: "step2-emissive.png",
      skill: "lumen",
      title: "Boosting Mesh GI Contribution",
      prompt:
        "<p>The mesh has 'Affect GI' enabled, but the contribution still drops at distance. You notice 'Emissive Light Source Contribution' is at default 1.0.</p><strong>What value should you set to force stronger Lumen contribution?</strong>",
      choices: [
        {
          text: "Increase it to 5.0",
          type: "correct",
          feedback:
            "<p>Good choice. This strengthens the mesh's contribution to the Lumen scene.</p>",
          next: "step-3",
        },
        {
          text: "Set it to 0.5 for performance",
          type: "wrong",
          feedback:
            "<p>You LOWERED it? That made the GI even weaker at distance. Wrong direction entirely.</p>",
          next: "step-2",
        },
        {
          text: "Leave it at default and check elsewhere",
          type: "misguided",
          feedback:
            "<p>You moved on without adjusting it... but the mesh contribution really does need a boost for large emissive surfaces.</p>",
          next: "step-3",
        },
        {
          text: "Set it to 50.0 for maximum effect",
          type: "misguided",
          feedback:
            "<p>That's way too high - it's causing bloom artifacts and unrealistic lighting. 5.0 is a more reasonable boost.</p>",
          next: "step-3",
        },
      ],
    },
    "step-3": {
      image_path: "ppv-step.png",
      skill: "lumen",
      title: "Post Process Volume Settings",
      prompt:
        "<p>The mesh contribution is now stronger, but GI still vanishes beyond 50 meters. You select the Post Process Volume and expand the Lumen Global Illumination section.</p><strong>Which setting controls the maximum distance for Lumen GI calculations?</strong>",
      choices: [
        {
          text: "Lumen Scene View Distance",
          type: "correct",
          feedback:
            "<p>Exactly right. This is the calculation boundary - anything beyond this distance won't receive Lumen GI.</p>",
          next: "step-4",
        },
        {
          text: "Lumen Reflection Quality",
          type: "misguided",
          feedback:
            "<p>You adjusted Reflection Quality for 10 minutes... but that only affects reflection sharpness, not GI distance.</p>",
          next: "step-3",
        },
        {
          text: "Final Gather Quality",
          type: "wrong",
          feedback:
            "<p>Final Gather Quality affects bounce quality, not the maximum calculation distance. The GI still cuts off.</p>",
          next: "step-3",
        },
        {
          text: "Ray Lighting Mode",
          type: "wrong",
          feedback:
            "<p>That controls the lighting evaluation method, not the distance at which GI is calculated.</p>",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      image_path: "step4-viewdist.png",
      skill: "lumen",
      title: "Setting the View Distance",
      prompt:
        "<p>You found 'Lumen Scene View Distance' - it's currently set to the default 10,000 units. Your viewing distance is 50+ meters (5,000+ cm).</p><strong>What value should you set?</strong>",
      choices: [
        {
          text: "25,000 units (covers 250m viewing distance)",
          type: "correct",
          feedback:
            "<p>Stable GI achieved! The emissive panel now contributes to Lumen even at extreme distances.</p>",
          next: "conclusion",
        },
        {
          text: "100,000 units (maximum coverage)",
          type: "misguided",
          feedback:
            "<p>Setting it that high tanked your framerate to 15 FPS. Lumen calculations became too expensive. Try a more reasonable value.</p>",
          next: "step-4",
        },
        {
          text: "Leave it at 10,000 (should be enough)",
          type: "wrong",
          feedback:
            "<p>10,000 units = 100 meters. But you're past that range when viewing from 50m away from an emissive that needs to affect surfaces behind you. Increase it.</p>",
          next: "step-4",
        },
        {
          text: "Set it to 5,000 units (half the default)",
          type: "wrong",
          feedback:
            "<p>Reducing the view distance made the problem WORSE. Now GI cuts off even closer. You need to increase it.</p>",
          next: "step-4",
        },
      ],
    },
    conclusion: {
      image_path: "conclusion.png",
      skill: "complete",
      title: "Scenario Complete",
      prompt:
        "<p><strong>Well done!</strong></p><p>You've successfully diagnosed and fixed the distance-based Lumen GI loss.</p><h4>Key Takeaways:</h4><ul><li><strong>Lumen Scene View Distance</strong> — The max calculation boundary for all GI</li><li><strong>Emissive Light Source Contribution</strong> — Boost this for large emissive surfaces</li><li><strong>Affect Global Illumination</strong> — Must be enabled on the mesh</li><li><strong>Lumen Scene visualization</strong> — Use this to debug distance field representation</li></ul>",
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
