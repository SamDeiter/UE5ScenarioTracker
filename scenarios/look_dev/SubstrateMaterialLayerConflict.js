window.SCENARIOS["SubstrateMaterialLayerConflict"] = {
  meta: {
    title: "Substrate Material Layers Produce Unexpected Blending Artifacts",
    description:
      "A complex Substrate material using multiple Slab BSDFs produces visual banding and incorrect color bleeding at layer boundaries, despite each layer looking correct in isolation.",
    estimateHours: 2.0,
    difficulty: "Advanced",
    category: "Materials",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "SubstrateMaterialLayerConflict",
      step: "setup",
    },
  ],
  fault: {
    description: "Substrate layers blend incorrectly causing visual artifacts",
    visual_cue: "Banding and color bleeding at material layer boundaries",
  },
  expected: {
    description:
      "Smooth, physically-accurate blending between Substrate layers",
    validation_action: "verify_substrate_blending",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "SubstrateMaterialLayerConflict",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "materials",
      title: "Initial Observation",
      image_path: "assets/generated/SubstrateMaterialLayerConflict/step-1.png",
      prompt:
        "<p>You've created a car paint material using <strong>Substrate</strong> with multiple <code>Slab BSDF</code> nodes: a base metallic layer, a pearlescent mid-layer, and a clear coat top layer. Visual banding appears where layers transition.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Open the <strong>Material Editor</strong> and check how the Slab BSDFs are connected—verify you're using <code>Substrate Vertical Layering</code> instead of simple addition.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Substrate requires specific layering nodes for physically-correct blending. Incorrect connections cause artifacts.",
          next: "step-2",
        },
        {
          text: "Reduce the number of Slab BSDF layers to two to simplify the material and isolate the issue.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Simplification helps debug but doesn't identify the root cause. Check layer connections first.",
          next: "step-1",
        },
        {
          text: "Increase the material's <code>Quality Level</code> in the <strong>Details Panel</strong> to use higher precision calculations.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Quality levels affect shader complexity, not layer blending logic. The issue is node topology.",
          next: "step-1",
        },
        {
          text: "Check <strong>Project Settings</strong> > <strong>Rendering</strong> to verify Substrate is enabled for the project.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. If the material compiled, Substrate is enabled. The issue is material graph configuration.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "materials",
      title: "Examining Layer Connections",
      image_path: "assets/generated/SubstrateMaterialLayerConflict/step-2.png",
      prompt:
        "<p>You examine the material graph and find the three Slab BSDFs are connected via <code>Add</code> nodes instead of <code>Substrate Vertical Layering</code>. You need to fix the topology.</p><p><strong>What is the correct layering structure for a multi-layer car paint?</strong></p>",
      choices: [
        {
          text: "Connect layers using <code>Substrate Vertical Layering</code> nodes, with the base metal as <code>Bottom</code>, pearlescent as middle, and clear coat as <code>Top</code>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. Vertical Layering physically simulates light passing through each layer from top to bottom, like real coatings.",
          next: "step-3",
        },
        {
          text: "Use <code>Substrate Horizontal Blend</code> nodes to mix the layers based on a blend mask texture.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Horizontal blend is for spatially-varying materials (like dirt on paint), not stacked coatings. Use vertical for layers.",
          next: "step-2",
        },
        {
          text: "Feed all three Slabs directly into a <code>Substrate Material Output</code> node with multiple inputs.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. The Material Output only accepts one Substrate input. Layers must be combined before the output.",
          next: "step-2",
        },
        {
          text: "Use <code>Lerp</code> nodes with a Fresnel term to blend layers based on view angle.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Lerp is a mathematical blend, not physically-based layering. Substrate nodes handle light transport correctly.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "materials",
      title: "Configuring the Base Layer",
      image_path: "assets/generated/SubstrateMaterialLayerConflict/step-3.png",
      prompt:
        "<p>You've restructured using <code>Substrate Vertical Layering</code>. Now you need to configure each layer's properties. Starting with the base metallic layer.</p><p><strong>What are the correct Slab BSDF settings for an opaque metallic base?</strong></p>",
      choices: [
        {
          text: "Set <code>Diffuse Albedo</code> to the metal color, <code>F0</code> to high reflectance, <code>Roughness</code> as desired, and leave <code>Mean Free Path</code> at default for opaque.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Metallic bases have high F0 (specular), colored diffuse albedo, and don't need subsurface settings.",
          next: "step-4",
        },
        {
          text: "Set <code>Mean Free Path</code> to a small value to simulate metal's opacity and block light from passing through.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Mean Free Path controls subsurface scattering distance. For metals, default (infinite/opaque) is simpler.",
          next: "step-3",
        },
        {
          text: "Enable <code>Use Legacy Shading</code> on the Slab to match traditional metallic workflow behavior.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. There's no legacy shading toggle on Slab BSDFs. Substrate uses its own physically-based model.",
          next: "step-3",
        },
        {
          text: "Set <code>F0</code> to 0 for metals since metallics use <code>Diffuse Albedo</code> for all reflection color.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Metals actually have high F0 (close to 1.0). F0 controls Fresnel reflectance intensity.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "materials",
      title: "Configuring the Pearlescent Layer",
      image_path: "assets/generated/SubstrateMaterialLayerConflict/step-4.png",
      prompt:
        "<p>The base layer is set. Now you configure the pearlescent mid-layer, which should show color shift based on viewing angle.</p><p><strong>How do you achieve the iridescent color shift effect in a Substrate Slab?</strong></p>",
      choices: [
        {
          text: "Use the <code>Thin Film</code> parameters on the Slab BSDF, setting <code>Thin Film Thickness</code> to values typically between 200-800nm for visible spectrum interference.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Thin Film simulates interference patterns in microscopic coatings, creating realistic iridescence.",
          next: "step-5",
        },
        {
          text: "Create a custom <code>Fresnel</code> node that outputs different colors at different view angles and feed it into <code>Diffuse Albedo</code>.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Custom Fresnel can fake the effect but isn't physically accurate. Thin Film parameters are purpose-built for this.",
          next: "step-4",
        },
        {
          text: "Set the <code>Anisotropy</code> parameter to create directional reflections that change color.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Anisotropy affects reflection shape (stretched highlights), not color shift. Use Thin Film for iridescence.",
          next: "step-4",
        },
        {
          text: "Animate the <code>Diffuse Albedo</code> color using a <code>Time</code> node to simulate color shifting.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Time-based animation creates flickering, not view-dependent color shift. Thin Film is the correct approach.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "materials",
      title: "Configuring the Clear Coat Layer",
      image_path: "assets/generated/SubstrateMaterialLayerConflict/step-5.png",
      prompt:
        "<p>The pearlescent layer now shifts color beautifully. Finally, you need to configure the clear coat top layer for a glossy finish.</p><p><strong>What are the correct Slab BSDF settings for a transparent clear coat?</strong></p>",
      choices: [
        {
          text: "Set <code>Diffuse Albedo</code> to black/transparent, <code>F0</code> to typical dielectric (~0.04), very low <code>Roughness</code>, and enable <code>SSS</code> with a small <code>Mean Free Path</code>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Clear coat is a transparent dielectric with glossy specular. SSS allows light to pass through to lower layers.",
          next: "step-6",
        },
        {
          text: "Use the same settings as the base layer but with reduced <code>Roughness</code> for a shinier appearance.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Similar settings could look okay but wouldn't correctly simulate light transmission through the coating.",
          next: "step-5",
        },
        {
          text: "Set <code>Opacity</code> to 0.5 on the material to make the top layer semi-transparent.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Material Opacity affects the entire material's alpha, not layer-specific transmission. Use Slab's SSS properties.",
          next: "step-5",
        },
        {
          text: "Connect a <code>Refraction</code> node to the clear coat Slab to simulate light bending through the layer.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Substrate handles refraction internally based on IOR. Additional refraction nodes aren't needed.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "materials",
      title: "Adjusting Layer Weights",
      image_path: "assets/generated/SubstrateMaterialLayerConflict/step-6.png",
      prompt:
        "<p>The layered structure is complete, but the pearlescent effect is too subtle. You need to adjust how light distributes between layers.</p><p><strong>How do you increase the pearlescent layer's visual contribution?</strong></p>",
      choices: [
        {
          text: "Adjust the <code>Coverage</code> parameter on the <code>Substrate Vertical Layering</code> node connecting the pearlescent layer to control its blend weight.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Coverage controls what percentage of light interacts with that layer versus passing through.",
          next: "step-7",
        },
        {
          text: "Increase the <code>Emissive</code> output of the pearlescent Slab to make it more visible.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Emissive adds self-illumination, which isn't physically accurate for a paint layer. Coverage is the correct control.",
          next: "step-6",
        },
        {
          text: "Reduce the clear coat's opacity to reveal more of the pearlescent layer underneath.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Clear coat should remain fully covering. Adjust the pearlescent layer's coverage, not the clear coat.",
          next: "step-6",
        },
        {
          text: "Move the pearlescent layer above the clear coat in the layering stack.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Clear coat must be on top for physical accuracy. Reordering breaks the simulation's realism.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "materials",
      title: "Debugging Remaining Banding",
      image_path: "assets/generated/SubstrateMaterialLayerConflict/step-7.png",
      prompt:
        "<p>Most artifacts are resolved, but you still see subtle banding in dark areas of the reflection. This suggests a precision or sampling issue.</p><p><strong>What setting can reduce banding in Substrate materials?</strong></p>",
      choices: [
        {
          text: "Enable <code>High Quality Reflections</code> in the material and increase <code>Substrate Slab Preintegration LUT Size</code> in <strong>Project Settings</strong>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Larger LUT sizes provide more precision for complex BSDFs, reducing quantization artifacts.",
          next: "step-8",
        },
        {
          text: "Add dithering to the final output using a <code>Dither</code> node connected to opacity.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Dithering can hide banding but doesn't fix the source. LUT quality provides a cleaner solution.",
          next: "step-7",
        },
        {
          text: "Reduce the contrast between layers by averaging their <code>F0</code> values.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Changing material properties to hide rendering issues compromises art direction. Fix rendering settings instead.",
          next: "step-7",
        },
        {
          text: "Switch the material's <code>Blend Mode</code> from <code>Opaque</code> to <code>Translucent</code> for better layer handling.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Translucent materials have different rendering costs and behaviors. Substrate layering works best with Opaque.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "materials",
      title: "Performance Optimization",
      image_path: "assets/generated/SubstrateMaterialLayerConflict/step-8.png",
      prompt:
        "<p>The material looks perfect but has high shader complexity. You need to optimize for production use.</p><p><strong>What is the best approach to optimize a complex Substrate material?</strong></p>",
      choices: [
        {
          text: "Create a simpler <code>LOD Material</code> with fewer layers for distant views and assign it to the mesh's material LOD slots.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. Material LODs reduce complexity at distance where fine details aren't visible, preserving visual quality up close.",
          next: "step-9",
        },
        {
          text: "Use <code>Material Quality Level</code> switches to automatically simplify the material on lower-end hardware.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Quality switches help but require maintaining complexity in the single material. LODs are cleaner separation.",
          next: "step-9",
        },
        {
          text: "Reduce texture resolutions used in the material to lower GPU memory bandwidth.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Texture resolution affects memory, not shader complexity. Simplify the layer structure for shader optimization.",
          next: "step-8",
        },
        {
          text: "Enable <code>Fully Rough</code> on all layers except the clear coat to skip specular calculations.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Fully Rough removes all specularity, destroying the reflective paint appearance. Use LODs instead.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "materials",
      title: "Testing Across Lighting Conditions",
      image_path: "assets/generated/SubstrateMaterialLayerConflict/step-9.png",
      prompt:
        "<p>Before finalizing, you need to verify the material looks correct under various lighting conditions.</p><p><strong>What testing approach ensures material robustness?</strong></p>",
      choices: [
        {
          text: "Test the material in multiple lighting scenarios: outdoor sun, overcast, indoor studio, and night with artificial lights, checking each layer's contribution.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. Materials must look correct under game's actual lighting conditions. Testing extremes reveals hidden issues.",
          next: "step-10",
        },
        {
          text: "Use the <strong>Material Editor</strong> preview with HDR environment map rotation to simulate different lighting.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Preview testing is quick but doesn't match actual game lighting scenarios. In-level testing is more accurate.",
          next: "step-9",
        },
        {
          text: "Review the material in <code>Unlit</code> view mode to see base colors without lighting influence.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Unlit shows albedo but not how lights interact with the layered BSDF structure. Test under actual lighting.",
          next: "step-9",
        },
        {
          text: "Check <code>stat material</code> to verify shader instructions are within budget.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Stats verify performance, not visual correctness. Lighting tests are for appearance validation.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "materials",
      title: "Final Verification",
      image_path: "assets/generated/SubstrateMaterialLayerConflict/step-10.png",
      prompt:
        "<p>The material passes all lighting tests. As a final step, how do you verify the Substrate layers are blending correctly from a technical standpoint?</p><p><strong>What is the most comprehensive technical verification?</strong></p>",
      choices: [
        {
          text: "Use <code>Buffer Visualization</code> > <code>Substrate</code> modes to inspect individual layer contributions and verify correct BSDF blending in the G-Buffer.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Buffer visualization shows exactly how Substrate encodes layer data, confirming correct internal representation.",
          next: "conclusion",
        },
        {
          text: "Compare rendered output against a reference render from a path-traced offline renderer.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Reference comparison is valuable for art validation but overkill for technical blending verification.",
          next: "step-10",
        },
        {
          text: "Check the <strong>Shader Complexity</strong> view to ensure no unexpected complexity from layer interactions.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Complexity views show cost, not correctness. Buffer visualization confirms blending is correct.",
          next: "step-10",
        },
        {
          text: "Export the material as a <code>.uasset</code> and inspect it with a hex editor for layer encoding.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.5hrs. Asset inspection is for debugging corruption, not material blending. Use in-engine visualization tools.",
          next: "step-10",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/SubstrateMaterialLayerConflict/conclusion.png",
      prompt:
        "<p><strong>Outstanding work!</strong></p><p>You've mastered complex Substrate material layering.</p><h4>Key Takeaways:</h4><ul><li><code>Substrate Vertical Layering</code> — Required for physically-correct layer stacking</li><li><code>Thin Film</code> — Creates realistic iridescence on pearlescent layers</li><li><code>Coverage</code> — Controls each layer's light interaction weight</li><li><code>Slab Preintegration LUT Size</code> — Reduces banding in complex BSDFs</li><li><strong>Material LODs</strong> — Optimize complex materials at distance</li><li><strong>Buffer Visualization</strong> — Verify Substrate layer encoding</li></ul>",
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
