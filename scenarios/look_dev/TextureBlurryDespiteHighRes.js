window.SCENARIOS["TextureBlurryDespiteHighRes"] = {
  meta: {
    title: "High Resolution Texture Appears Blurry in Game",
    description:
      "A 4K texture looks crisp in the Content Browser but appears noticeably blurry when applied to a mesh in the level, even at close distances.",
    estimateHours: 0.75,
    difficulty: "Beginner",
    category: "Materials",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "TextureBlurryDespiteHighRes",
      step: "setup",
    },
  ],
  fault: {
    description: "High-res texture renders blurry despite correct source",
    visual_cue: "Texture lacks sharpness compared to source file",
  },
  expected: {
    description: "Texture renders at full resolution with correct detail",
    validation_action: "verify_texture_quality",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "TextureBlurryDespiteHighRes",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "materials",
      title: "Initial Observation",
      image_path: "assets/generated/TextureBlurryDespiteHighRes/step-1.png",
      prompt:
        "<p>You imported a 4096×4096 texture for a hero asset. In the <strong>Content Browser</strong> thumbnail it looks sharp, but on the mesh in the level it appears blurry, almost like a lower resolution.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Double-click the texture to open it and check the <code>Maximum Texture Size</code> and <code>LOD Bias</code> settings in the <strong>Details Panel</strong>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. These settings can cap the effective resolution below the source file resolution.",
          next: "step-2",
        },
        {
          text: "Verify the source file is actually 4K by checking the original image in an external viewer.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The Content Browser shows full resolution, so the source is correct. Check import settings instead.",
          next: "step-1",
        },
        {
          text: "Check the mesh's UV layout to ensure textures aren't stretched across too large an area.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. UV stretching causes different artifacts. Uniform blurriness suggests resolution capping.",
          next: "step-1",
        },
        {
          text: "Increase the camera's <code>Field of View</code> to get closer to the texture for better visual inspection.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. FOV changes perspective, not texture resolution. The blur is at all distances.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "materials",
      title: "Checking Texture Settings",
      image_path: "assets/generated/TextureBlurryDespiteHighRes/step-2.png",
      prompt:
        "<p>You open the texture and see <code>Maximum Texture Size</code> is set to <code>1024</code> instead of <code>0</code> (no limit). This caps the runtime resolution.</p><p><strong>What should you set this value to for full resolution?</strong></p>",
      choices: [
        {
          text: "Set <code>Maximum Texture Size</code> to <code>0</code> to allow the texture to use its full imported resolution at runtime.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.05hrs. A value of 0 means 'no limit,' allowing the engine to use the full texture resolution based on streaming.",
          next: "step-3",
        },
        {
          text: "Set <code>Maximum Texture Size</code> to <code>4096</code> to match the source file exactly.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. This works but is more restrictive than necessary. 0 automatically uses the highest available.",
          next: "step-3",
        },
        {
          text: "Set <code>Maximum Texture Size</code> to <code>8192</code> to ensure headroom for future upgrades.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Setting above source resolution has no effect. 0 is the correct 'unlimited' value.",
          next: "step-2",
        },
        {
          text: "Delete and re-import the texture with the <code>Full Resolution</code> import option.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Re-importing is unnecessary. Simply adjust the existing texture's settings.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "materials",
      title: "Checking LOD Bias",
      image_path: "assets/generated/TextureBlurryDespiteHighRes/step-3.png",
      prompt:
        "<p>After setting <code>Maximum Texture Size</code> to <code>0</code>, the texture is sharper but still not as crisp as expected up close. You notice <code>LOD Bias</code> is set to <code>2</code>.</p><p><strong>What does LOD Bias control and what should it be?</strong></p>",
      choices: [
        {
          text: "<code>LOD Bias</code> adds mipmap levels, reducing sharpness. Set it to <code>0</code> for the crispest possible texture at the cost of potential aliasing.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. LOD Bias forces the engine to use a lower mipmap, trading sharpness for memory. 0 gives maximum quality.",
          next: "step-4",
        },
        {
          text: "<code>LOD Bias</code> controls mesh LOD transitions. Set it to <code>-1</code> for higher quality meshes.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Texture LOD Bias is separate from mesh LODs. It specifically affects texture mipmap selection.",
          next: "step-3",
        },
        {
          text: "<code>LOD Bias</code> is a performance optimization that should always stay at the engine default.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. For hero assets, quality may be more important than default optimization. Adjust per-asset.",
          next: "step-3",
        },
        {
          text: "<code>LOD Bias</code> controls anisotropic filtering levels. Increase it for better quality.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Anisotropic filtering is a separate setting. LOD Bias specifically affects mipmap level selection.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "materials",
      title: "Verification",
      image_path: "assets/generated/TextureBlurryDespiteHighRes/step-4.png",
      prompt:
        "<p>You've set <code>Maximum Texture Size</code> to <code>0</code> and <code>LOD Bias</code> to <code>0</code>. How do you verify the texture now renders at full quality?</p><p><strong>What is the best verification approach?</strong></p>",
      choices: [
        {
          text: "Use the <code>TexRes</code> view mode to see the actual texture resolution being used on the mesh in the viewport.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. TexRes visualizes actual streaming resolution, confirming your settings take effect.",
          next: "conclusion",
        },
        {
          text: "Compare the in-game texture visually against the source file in a split-screen view.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Visual comparison works but is subjective. TexRes gives quantitative resolution data.",
          next: "step-4",
        },
        {
          text: "Check the <strong>Statistics</strong> window for texture memory usage.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Memory stats show total usage, not per-texture resolution. Use TexRes for specific assets.",
          next: "step-4",
        },
        {
          text: "Package the game and take screenshots of the texture for analysis.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Packaging is excessive. Editor view modes provide immediate quality verification.",
          next: "step-4",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/TextureBlurryDespiteHighRes/conclusion.png",
      prompt:
        "<p><strong>Well done!</strong></p><p>You've resolved the blurry texture issue.</p><h4>Key Takeaways:</h4><ul><li><code>Maximum Texture Size</code> — Set to 0 for no resolution cap</li><li><code>LOD Bias</code> — Higher values force lower mipmaps; use 0 for hero assets</li><li><code>TexRes</code> view mode — Shows actual streaming resolution on meshes</li><li><strong>Per-Asset Settings</strong> — Override defaults for important hero textures</li></ul>",
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
