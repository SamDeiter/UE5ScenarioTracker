window.SCENARIOS["directional_light"] = {
  id: "directional_light",
  category: "Lighting",
  meta: {
    title: "Abrupt Shadow Disappearance in Distant View",
    category: "Lighting",
    description:
      "Outdoor shadows cut off abruptly at 50 meters. Extend shadows to 500 meters while maintaining quality.",
    estimateHours: 1.5,
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "directional_light",
      step: "step-0",
    },
  ],
  fault: {
    description: "Shadows disappear at 50m due to default CSM distance scale.",
    visual_cue: "Flat distance rendering",
  },
  expected: {
    description: "Shadows extend to 500m with 8 cascades for high resolution.",
    validation_action: "verify_csm_settings",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "directional_light",
      step: "step-3",
    },
  ],
  start: "step-0",
  steps: {
    "step-0": {
      image_path: "step-0.png",
      skill: "lighting",
      title: "Initial Observation",
      prompt:
        "<p>You're working on an outdoor level and notice that shadows from the sun disappear abruptly at around 50 meters from the camera.</p><p>The environment looks flat and unrealistic in the distance.</p><strong>What's your first step to diagnose this?</strong>",
      choices: [
        {
          text: "Select the DirectionalLight and check its shadow settings",
          type: "correct",
          feedback:
            "<p>Good thinking. The DirectionalLight controls sun shadows. Let's see what settings might be limiting the shadow distance.</p>",
          next: "step-1",
        },
        {
          text: "Check the Post Process Volume settings",
          type: "misguided",
          feedback:
            "<p>You spent 15 minutes digging through Post Process settings but couldn't find anything related to shadow distance. The Volume handles color grading and effects, not shadow rendering. Maybe the wrong actor is selected?</p>",
          next: "step-0",
        },
        {
          text: "Rebuild lighting",
          type: "wrong",
          feedback:
            "<p>The lighting build completed after 10 minutes... but the shadows still cut off at the same distance. This approach doesn't seem to be working for this type of issue.</p>",
          next: "step-0",
        },
        {
          text: "Increase the Shadow Bias on the light",
          type: "subtle",
          feedback:
            "<p>Shadow Bias controls the offset to prevent self-shadowing artifacts, not the maximum rendering distance. The shadows still disappear at 50 meters.</p>",
          next: "step-0",
        },
      ],
    },
    "step-0W": {
      image_path: "step-0.png",
      skill: "lighting",
      title: "Dead End: Rebuild Lighting",
      prompt:
        "<p>Rebuilding lighting finished, but the shadow cutoff is still there. This is because Movable lights use dynamic shadows, not baked shadows.</p><strong>What should you check instead?</strong>",
      choices: [
        {
          text: "Inspect the DirectionalLight's Details panel",
          type: "correct",
          feedback:
            "<p>Right—dynamic shadow settings are on the light itself.</p>",
          next: "step-1",
        },
        {
          text: "Try rebuilding lighting with higher quality settings",
          type: "wrong",
          feedback:
            "<p>Higher quality baked lighting won't help—Movable lights don't use baked shadows at all. The shadow settings are on the light actor.</p>",
          next: "step-0W",
        },
        {
          text: "Check the Post Process Volume exposure settings",
          type: "misguided",
          feedback:
            "<p>Post Process handles color grading and exposure, not shadow rendering distance. The shadow cutoff is controlled by the light itself.</p>",
          next: "step-0W",
        },
        {
          text: "Convert the light to Stationary mobility",
          type: "subtle",
          feedback:
            "<p>Changing mobility would switch to a different shadow system entirely. For a Movable light, you need to adjust its specific shadow distance settings.</p>",
          next: "step-0W",
        },
      ],
    },
    "step-1": {
      image_path: "step-1.png",
      skill: "lighting",
      title: "Diagnosing the Shadow Cutoff",
      prompt:
        "<p>You've selected the DirectionalLight and opened the Details panel. Under Cascaded Shadow Maps, you see several settings.</p><strong>Which setting controls how far dynamic shadows are rendered?</strong>",
      choices: [
        {
          text: "Dynamic Shadow Distance Movable Light",
          type: "correct",
          feedback:
            "<p>Exactly! This value (in cm) determines the maximum distance from the camera where shadows are rendered. The default is often too short for large outdoor scenes.</p>",
          next: "step-inv-1",
          onEnter: [
            {
              action: "set_ue_property",
              scenario: "directional_light",
              step: "step-1",
            },
          ],
        },
        {
          text: "Shadow Distance Fadeout Fraction",
          type: "misguided",
          feedback:
            "<p>You adjusted the Fadeout Fraction and tested it, but the shadow cutoff distance didn't change. This setting only affects the transition, not the maximum range.</p>",
          next: "step-1",
        },
        {
          text: "Cascade Distribution Exponent",
          type: "wrong",
          feedback:
            "<p>You experimented with various Exponent values but the shadows still disappear at the same point. The distribution changed, but not the distance itself.</p>",
          next: "step-1",
        },
        {
          text: "Light Source Soft Angle",
          type: "subtle",
          feedback:
            "<p>The Soft Angle controls penumbra softness for PCSS shadows. After adjusting it, the shadow edges look different but they still cut off at the same distance.</p>",
          next: "step-1",
        },
      ],
    },
    "step-inv-1": {
      image_path: "step-1.png",
      skill: "lighting",
      title: "Understanding the Current Value",
      prompt:
        "<p>You see 'Dynamic Shadow Distance Movable Light' is set to 5000 (50 meters).</p><p>Your level extends to about 500 meters in the distance.</p><strong>What value should you set?</strong>",
      choices: [
        {
          text: "Set it to 50000 (500m)",
          type: "correct",
          feedback:
            "<p>Good math! The value is in centimeters. 500 meters = 50,000 cm. Let's apply this and see what happens.</p>",
          next: "step-2",
        },
        {
          text: "Set it to 500",
          type: "wrong",
          feedback:
            "<p>Remember, UE5 uses centimeters. 500 would only be 5 meters! For 500 meters, you need to multiply by 100.</p>",
          next: "step-inv-1",
        },
        {
          text: "Set it to 500000 (5km)",
          type: "misguided",
          feedback:
            "<p>The shadows now extend incredibly far, but the frame rate dropped significantly. Your artist is complaining about performance. Maybe a more precise value would work better.</p>",
          next: "step-inv-1",
        },
        {
          text: "Set it to 10000 (100m)",
          type: "subtle",
          feedback:
            "<p>The shadows now extend to 100m instead of 50m, but your level extends to 500m. The distant areas still have no shadows. You need a larger value.</p>",
          next: "step-inv-1",
        },
      ],
    },
    "step-2": {
      image_path: "step-2.png",
      skill: "lighting",
      title: "New Problem: Blocky Shadows",
      prompt:
        "<p>Shadows now extend to 500m... but there's a new problem. The distant shadows look pixelated and blocky.</p><p>The same shadow map resolution is being stretched across 10x the distance.</p><strong>How do you fix the shadow quality at distance?</strong>",
      choices: [
        {
          text: "Increase 'Num Dynamic Shadow Cascades' from 4 to 8",
          type: "correct",
          feedback:
            "<p>Perfect! More cascades means each one covers less distance, so resolution stays higher throughout. You understand how Cascaded Shadow Maps work.</p>",
          next: "step-3",
          onEnter: [
            {
              action: "set_ue_property",
              scenario: "directional_light",
              step: "step-2",
            },
          ],
        },
        {
          text: "Increase shadow map resolution globally via r.Shadow.MaxCSMResolution",
          type: "misguided",
          feedback:
            "<p>You found the CVar and increased it to 4096, but now the entire level has performance issues from the higher resolution shadows everywhere. There might be a more targeted approach.</p>",
          next: "step-2",
        },
        {
          text: "Increase the Light Source Angle",
          type: "wrong",
          feedback:
            "<p>Light Source Angle controls shadow edge softness (penumbra), not resolution. The pixelation you're seeing is from stretched shadow maps, not soft edges.</p>",
          next: "step-2W",
        },
        {
          text: "Decrease the Cascade Distribution Exponent",
          type: "subtle",
          feedback:
            "<p>Lowering the exponent redistributes shadow resolution toward distant cascades, but with only 4 cascades the difference is minimal. More cascades would help more.</p>",
          next: "step-2",
        },
      ],
    },
    "step-2W": {
      image_path: "step-2.png",
      skill: "lighting",
      title: "Dead End: Light Source Angle",
      prompt:
        "<p>You increased the Light Source Angle, but the shadows are now *both* blocky AND blurry. That's definitely not what we want.</p><strong>What controls shadow map resolution distribution?</strong>",
      choices: [
        {
          text: "Number of shadow cascades",
          type: "correct",
          feedback:
            "<p>Right! Cascades divide the shadow distance into slices, each with its own shadow map. More cascades = better quality distribution.</p>",
          next: "step-3",
        },
        {
          text: "Shadow map resolution in Project Settings",
          type: "misguided",
          feedback:
            "<p>Global shadow resolution affects all shadows and would impact performance everywhere. Cascades let you distribute quality more efficiently over distance.</p>",
          next: "step-2W",
        },
        {
          text: "Light Source Soft Angle",
          type: "wrong",
          feedback:
            "<p>You already tried adjusting the angle settings. The problem is resolution distribution, not edge softness. Think about how CSM divides its shadow budget.</p>",
          next: "step-2W",
        },
        {
          text: "Shadow Filter Sharpen setting",
          type: "subtle",
          feedback:
            "<p>Sharpening can help with soft edges but won't fix the fundamental resolution problem of stretching shadows over 500 meters with only 4 cascades.</p>",
          next: "step-2W",
        },
      ],
    },
    "step-3": {
      image_path: "step-3.png",
      skill: "lighting",
      title: "Verifying the Fix",
      prompt:
        "<p>The shadows look great in the viewport—extended to 500m with good quality throughout.</p><strong>What's the final step before calling this fixed?</strong>",
      choices: [
        {
          text: "Play in Editor (PIE) and verify shadows work at runtime",
          type: "correct",
          feedback:
            "<p>Good habit! The viewport can behave differently than the actual game. Scalability settings, game modes, or console overrides might affect runtime shadows. Always test in PIE.</p>",
          next: "step-ver-1",
          onEnter: [
            {
              action: "set_ue_property",
              scenario: "directional_light",
              step: "step-3",
            },
          ],
        },
        {
          text: "Build Lighting",
          type: "wrong",
          feedback:
            "<p>This is still a Movable light—building lighting won't affect dynamic shadows. You need to test the *runtime* behavior, not baked lighting.</p>",
          next: "step-3",
        },
        {
          text: "Save the level and close the editor",
          type: "subtle",
          feedback:
            "<p>Saving is always good practice, but you haven't actually verified that the shadows work correctly at runtime. What if scalability settings override your changes in-game?</p>",
          next: "step-3",
        },
        {
          text: "Document the settings in Confluence",
          type: "misguided",
          feedback:
            "<p>Documentation is important, but you should verify the fix works at runtime first. What if scalability settings override your changes for some players?</p>",
          next: "step-3",
        },
      ],
    },
    "step-ver-1": {
      image_path: "step-3.png",
      skill: "lighting",
      title: "Runtime Verification",
      prompt:
        "<p>You hit Play and fly to the distant areas of your level. The shadows render correctly at 500m!</p><p>But you want to make sure no scalability settings will override your changes for players with lower settings.</p><strong>How do you check this?</strong>",
      choices: [
        {
          text: "Run 'r.Shadow.DistanceScale' in the console to check the current multiplier",
          type: "correct",
          feedback:
            "<p>Nice! This console variable scales shadow distance. If it's less than 1.0, some players' shadows will cut off sooner. Good to document this for QA.</p>",
          next: "conclusion",
        },
        {
          text: "Check the Scalability settings in Project Settings",
          type: "misguided",
          feedback:
            "<p>You reviewed the Scalability settings and they look fine, but when testing on a team member's machine with 'Low' graphics, the shadows still cut off early. There must be a runtime override somewhere...</p>",
          next: "step-ver-1",
        },
        {
          text: "Check if Virtual Shadow Maps are enabled",
          type: "subtle",
          feedback:
            "<p>Virtual Shadow Maps is a UE5 feature, but this level is using traditional Cascaded Shadow Maps. The console variable approach is more direct for checking CSM behavior.</p>",
          next: "step-ver-1",
        },
        {
          text: "Toggle Raytraced Shadows on and off",
          type: "wrong",
          feedback:
            "<p>Raytraced shadows are a different shadow technique. The current setup uses CSM for dynamic shadows, so toggling raytrace won't help diagnose the scalability issue.</p>",
          next: "step-ver-1",
        },
      ],
    },
    conclusion: {
      image_path: "conclusion.png",
      skill: "lighting",
      title: "Scenario Complete",
      prompt:
        "<p><strong>Well done!</strong></p><p>You've successfully diagnosed and fixed the shadow cutoff issue, extending dynamic shadows from 50m to 500m while maintaining quality.</p><h4>Key Takeaways:</h4><ul><li><strong>Dynamic Shadow Distance Movable Light</strong> — Controls max shadow render distance (in cm)</li><li><strong>Num Dynamic Shadow Cascades</strong> — More cascades = better quality over distance</li><li><strong>Always verify in PIE</strong> — Editor preview ≠ runtime behavior</li><li><strong>r.Shadow.DistanceScale</strong> — Check for scalability overrides</li></ul>",
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
