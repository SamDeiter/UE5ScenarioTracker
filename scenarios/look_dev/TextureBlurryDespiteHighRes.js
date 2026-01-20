window.SCENARIOS["TextureBlurryDespiteHighRes"] = {
  meta: {
    title: "High Resolution Texture Appears Blurry in Game",
    description:
      "A 4K texture looks crisp in the Content Browser but appears noticeably blurry when applied to a mesh in the level, even at close distances.",
    estimateHours: 1.0,
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
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. UV stretching causes different artifacts. Uniform blurriness suggests resolution capping.",
          next: "step-1",
        },
        {
          text: "Increase the camera's <code>Field of View</code> to get closer to the texture for better visual inspection.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. FOV changes perspective, not texture resolution. The blur is visible at all distances.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "materials",
      title: "Locating Texture Settings",
      image_path: "assets/generated/TextureBlurryDespiteHighRes/step-2.png",
      prompt:
        "<p>You double-click the texture in the Content Browser. The Texture Editor opens. Where do you find the resolution-related settings?</p><p><strong>Which panel contains these settings?</strong></p>",
      choices: [
        {
          text: "Look in the <strong>Details Panel</strong> on the right side, under the <code>Compression</code> and <code>Level of Detail</code> categories.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.05hrs. The Details Panel contains all texture properties including resolution caps and LOD settings.",
          next: "step-3",
        },
        {
          text: "Check the <strong>Viewport</strong> options menu at the top left of the texture preview.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Viewport options control preview display, not texture properties. Use the Details Panel.",
          next: "step-2",
        },
        {
          text: "Open <strong>Window</strong> > <strong>Texture Properties</strong> to access resolution settings.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no separate Texture Properties window. Settings are in the Details Panel.",
          next: "step-2",
        },
        {
          text: "Right-click the texture preview and select <strong>Properties</strong> from the context menu.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Context menu doesn't show properties. The Details Panel is always visible on the right.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "materials",
      title: "Identifying Maximum Texture Size",
      image_path: "assets/generated/TextureBlurryDespiteHighRes/step-3.png",
      prompt:
        "<p>In the Details Panel, you find <code>Maximum Texture Size</code> is set to <code>1024</code>. The source is 4096×4096.</p><p><strong>What does this setting do?</strong></p>",
      choices: [
        {
          text: "It caps the maximum resolution the texture can use at runtime, regardless of the imported source resolution.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. This explains your 4K texture appearing blurry—it's being downsampled to 1024 at runtime.",
          next: "step-4",
        },
        {
          text: "It sets the display resolution for the Content Browser thumbnail only.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Thumbnail resolution is separate. Maximum Texture Size affects runtime rendering.",
          next: "step-3",
        },
        {
          text: "It controls the resolution when the texture is exported back to an image file.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Export settings are handled separately. This setting affects runtime quality.",
          next: "step-3",
        },
        {
          text: "It specifies the target resolution for automatic mipmap generation.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Mipmaps generate from the source regardless. This setting caps the highest mip used at runtime.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "materials",
      title: "Correcting Maximum Texture Size",
      image_path: "assets/generated/TextureBlurryDespiteHighRes/step-4.png",
      prompt:
        "<p>You need to fix the <code>Maximum Texture Size</code> setting. What value should you use to allow full resolution?</p><p><strong>What is the correct value?</strong></p>",
      choices: [
        {
          text: "Set it to <code>0</code>, which means 'no limit' and allows the texture to use its full imported resolution.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.05hrs. A value of 0 removes the resolution cap, letting the engine use the highest available quality.",
          next: "step-5",
        },
        {
          text: "Set it to <code>4096</code> to exactly match the source file resolution.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. This works but is unnecessarily specific. Using 0 is more flexible for future updates.",
          next: "step-5",
        },
        {
          text: "Set it to <code>-1</code> to indicate unlimited resolution.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The value -1 isn't valid for this field. Use 0 for 'no limit'.",
          next: "step-4",
        },
        {
          text: "Delete the property to revert to the engine's global default setting.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. You can't delete properties. Set the value to 0 to remove the cap.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "materials",
      title: "Checking LOD Bias",
      image_path: "assets/generated/TextureBlurryDespiteHighRes/step-5.png",
      prompt:
        "<p>After setting <code>Maximum Texture Size</code> to <code>0</code>, the texture is sharper but still not perfectly crisp. You notice <code>LOD Bias</code> is set to <code>2</code>.</p><p><strong>What does LOD Bias control?</strong></p>",
      choices: [
        {
          text: "LOD Bias adds extra mipmap levels, forcing the engine to use a lower-resolution mip than it normally would. A value of 2 skips 2 mip levels.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Higher LOD Bias means blurrier textures. Set to 0 for maximum sharpness on hero assets.",
          next: "step-6",
        },
        {
          text: "LOD Bias controls how quickly the texture transitions between quality levels at different distances.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. That's mipmap transition distance. LOD Bias shifts which mipmap is selected at all distances.",
          next: "step-5",
        },
        {
          text: "LOD Bias affects mesh LOD selection, not texture quality.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Texture LOD Bias is separate from mesh LODs. It specifically affects texture mipmap selection.",
          next: "step-5",
        },
        {
          text: "LOD Bias controls anisotropic filtering strength for the texture.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Anisotropic filtering has its own setting. LOD Bias shifts baseline mipmap level.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "materials",
      title: "Correcting LOD Bias",
      image_path: "assets/generated/TextureBlurryDespiteHighRes/step-6.png",
      prompt:
        "<p>You need to adjust <code>LOD Bias</code> for maximum quality. What should you set it to for a hero asset that needs to look crisp?</p><p><strong>What is the optimal value?</strong></p>",
      choices: [
        {
          text: "Set <code>LOD Bias</code> to <code>0</code> to use the highest available mipmap for the viewing distance, with no quality reduction.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. LOD Bias of 0 gives the sharpest result. Use this for important hero assets.",
          next: "step-7",
        },
        {
          text: "Set <code>LOD Bias</code> to <code>-1</code> to force an even higher quality mipmap than normal.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Negative values can sharpen further but may cause aliasing. 0 is the balanced choice.",
          next: "step-6",
        },
        {
          text: "Set <code>LOD Bias</code> to <code>1</code> as a compromise between quality and performance.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. For hero assets, quality is priority. Use 0 for maximum sharpness.",
          next: "step-6",
        },
        {
          text: "Leave <code>LOD Bias</code> at <code>2</code> and increase texture resolution instead by re-importing at 8K.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Re-importing at higher resolution is wasteful when LOD Bias is artificially reducing quality.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "materials",
      title: "Understanding Texture Streaming",
      image_path: "assets/generated/TextureBlurryDespiteHighRes/step-7.png",
      prompt:
        "<p>With settings corrected, you want to understand how Unreal manages texture resolution at runtime. The texture might still load at lower resolution initially.</p><p><strong>Why might the texture be blurry temporarily?</strong></p>",
      choices: [
        {
          text: "Unreal uses <strong>texture streaming</strong> to load textures progressively. Lower mips load first for performance, then higher mips stream in when the texture is visible.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Streaming can cause temporary blur. The full resolution loads after a moment when you approach the asset.",
          next: "step-8",
        },
        {
          text: "The GPU needs time to decompress texture data from the compressed format.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Decompression is very fast. Streaming is the actual cause of progressive loading.",
          next: "step-7",
        },
        {
          text: "Shader compilation delays cause textures to render at placeholder quality initially.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Shader compilation affects materials, not texture resolution. Streaming manages texture quality.",
          next: "step-7",
        },
        {
          text: "The editor prioritizes viewport performance over texture quality during level loading.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The issue is streaming behavior, not editor prioritization. Streaming affects both editor and runtime.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "materials",
      title: "Using TexRes View Mode",
      image_path: "assets/generated/TextureBlurryDespiteHighRes/step-8.png",
      prompt:
        "<p>You want to verify the texture is actually rendering at full resolution. There's a special view mode for this.</p><p><strong>How do you check the active texture resolution?</strong></p>",
      choices: [
        {
          text: "Switch to <strong>View Mode</strong> > <strong>Optimization Viewmodes</strong> > <code>TexRes</code> (Texture Resolution) to see color-coded resolution info on meshes.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. TexRes shows actual streaming resolution with color coding — green means optimal, red means undersized.",
          next: "step-9",
        },
        {
          text: "Open the <strong>Statistics</strong> window and find the texture in the memory list.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Statistics show memory totals but not per-mesh resolution visualization. Use TexRes for that.",
          next: "step-8",
        },
        {
          text: "Enable <strong>Show</strong> > <strong>Texture Streaming</strong> overlay in the viewport.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no separate streaming overlay. TexRes is the correct view mode for resolution info.",
          next: "step-8",
        },
        {
          text: "Right-click the texture and select <strong>Show Usage</strong> to see how it's being rendered.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Show Usage shows which assets reference this texture, not resolution. Use the TexRes view mode.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "materials",
      title: "Interpreting TexRes Colors",
      image_path: "assets/generated/TextureBlurryDespiteHighRes/step-9.png",
      prompt:
        "<p>In <code>TexRes</code> mode, your hero asset shows <strong>green</strong>. Some background assets show <strong>red</strong>.</p><p><strong>What do these colors indicate?</strong></p>",
      choices: [
        {
          text: "Green means the texture resolution matches or exceeds what's needed. Red means the texture is undersized — more texels are needed for the screen space it covers.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Your hero asset is now rendering optimally. Red assets may need higher resolution or better UVs.",
          next: "step-10",
        },
        {
          text: "Green means streaming is complete. Red means the texture is still loading higher mip levels.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Those are related but not exact. The colors indicate resolution adequacy, not just streaming status.",
          next: "step-9",
        },
        {
          text: "Green means the texture is compressed efficiently. Red means it's using too much memory.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. TexRes shows resolution adequacy, not memory efficiency. Use Statistics for memory data.",
          next: "step-9",
        },
        {
          text: "Green means the LOD Bias is 0. Red means LOD Bias is positive.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. LOD Bias affects resolution but TexRes colors show whether the result is adequate, not the setting itself.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "materials",
      title: "Final Verification",
      image_path: "assets/generated/TextureBlurryDespiteHighRes/step-10.png",
      prompt:
        "<p>Your texture now shows green in TexRes mode and looks crisp in the viewport. How do you confirm this quality will persist in builds?</p><p><strong>What is the final verification step?</strong></p>",
      choices: [
        {
          text: "Save the texture asset to ensure the settings persist, then test in <strong>Play in Editor</strong> (PIE) to verify runtime quality matches editor quality.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Saving persists the settings. PIE verifies the texture renders correctly at runtime.",
          next: "conclusion",
        },
        {
          text: "Package a development build to test in the exact runtime environment.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Packaging is thorough but time-consuming. PIE is sufficient for texture quality verification.",
          next: "step-10",
        },
        {
          text: "Check the texture's <strong>Derived Data Cache</strong> to ensure the high-res version is cached.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. DDC caching is automatic. Visual verification in PIE is more practical.",
          next: "step-10",
        },
        {
          text: "Export the texture to verify it saved at the correct resolution.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Export resolution is separate from runtime settings. Test in PIE instead.",
          next: "step-10",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/TextureBlurryDespiteHighRes/conclusion.png",
      prompt:
        "<p><strong>Well done!</strong></p><p>You've resolved the blurry texture issue and understand the key texture resolution controls.</p><h4>Key Takeaways:</h4><ul><li><code>Maximum Texture Size</code> — Set to 0 for no resolution cap</li><li><code>LOD Bias</code> — Higher values force lower mipmaps; use 0 for hero assets</li><li><strong>Texture Streaming</strong> — Loads progressively, may cause temporary blur</li><li><code>TexRes</code> view mode — Color-coded visualization of texture resolution adequacy</li><li><strong>Green = Optimal</strong> — Texture meets screen-space requirements</li><li><strong>Red = Undersized</strong> — Texture needs higher resolution or better UVs</li></ul>",
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
