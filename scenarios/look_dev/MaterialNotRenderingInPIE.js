window.SCENARIOS["MaterialNotRenderingInPIE"] = {
  meta: {
    title: "Material Displays Correctly in Editor but Not in PIE",
    description:
      "A material looks perfect in the Material Editor preview and viewport, but turns completely black or displays incorrectly when playing in editor.",
    estimateHours: 1.0,
    difficulty: "Beginner",
    category: "Materials",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "MaterialNotRenderingInPIE",
      step: "setup",
    },
  ],
  fault: {
    description: "Material renders in editor but fails in PIE",
    visual_cue: "Object turns black or displays wrong material at runtime",
  },
  expected: {
    description: "Material renders consistently in editor and at runtime",
    validation_action: "verify_material_runtime",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "MaterialNotRenderingInPIE",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "materials",
      title: "Initial Observation",
      image_path: "assets/generated/MaterialNotRenderingInPIE/step-1.png",
      prompt:
        "<p>Your custom material looks correct in the <strong>Material Editor</strong> preview sphere and on meshes in the viewport. When you press <strong>Play in Editor</strong>, the object turns completely black.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Check the material's <code>Usage</code> flags in the <strong>Details Panel</strong> to ensure it's enabled for the mesh type you're using.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Usage flags determine which mesh types can use the material. Missing flags cause runtime failures.",
          next: "step-2",
        },
        {
          text: "Verify the mesh has a valid <code>UV Channel 0</code> for texture mapping.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. UV issues cause texture stretching, not complete blackness. Check Usage flags first.",
          next: "step-1",
        },
        {
          text: "Rebuild lighting to ensure the material receives proper light information.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Lighting affects shading but not complete material failure. The issue is material configuration.",
          next: "step-1",
        },
        {
          text: "Check if the texture assets referenced by the material are missing.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Missing textures would show in the editor too. The material works in editor, so assets are present.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "materials",
      title: "Locating Usage Flags",
      image_path: "assets/generated/MaterialNotRenderingInPIE/step-2.png",
      prompt:
        "<p>You need to find the <strong>Usage</strong> flags in the material. Where exactly are they located in the Material Editor?</p><p><strong>How do you access the Usage settings?</strong></p>",
      choices: [
        {
          text: "Click on an empty area of the material graph to deselect all nodes, then look in the <strong>Details Panel</strong> under the <code>Usage</code> category.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.05hrs. Deselecting nodes shows the material's root properties including Usage flags.",
          next: "step-3",
        },
        {
          text: "Right-click the Material output node and select <strong>Usage Settings</strong> from the context menu.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no context menu option for Usage. Check the Details Panel with nothing selected.",
          next: "step-2",
        },
        {
          text: "Open <strong>Window</strong> > <strong>Material Usage</strong> to see a dedicated usage panel.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no separate Usage window. Usage is in the Details Panel when the material root is selected.",
          next: "step-2",
        },
        {
          text: "Select the main material output node and check its <strong>Output</strong> properties.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The output node shows output pins, not usage. Deselect everything to see material root properties.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "materials",
      title: "Identifying the Missing Flag",
      image_path: "assets/generated/MaterialNotRenderingInPIE/step-3.png",
      prompt:
        "<p>You find the <strong>Usage</strong> category in the Details Panel. You see the material is applied to a Skeletal Mesh, but <code>Used with Skeletal Mesh</code> is not checked.</p><p><strong>What does this flag control?</strong></p>",
      choices: [
        {
          text: "This flag tells the engine to compile shader permutations that support skeletal mesh vertex animation and skinning.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Skeletal meshes require special shader variants for bone transforms. Missing flags mean no compatible shader.",
          next: "step-4",
        },
        {
          text: "The flag controls whether the material's textures are streamed in when applied to skeletal meshes.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Texture streaming is handled separately. Usage flags control shader compilation, not streaming.",
          next: "step-3",
        },
        {
          text: "It determines which LOD levels the material can be applied to on skeletal meshes.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. LOD assignment is handled by the mesh, not material usage flags.",
          next: "step-3",
        },
        {
          text: "The flag enables material instancing features specific to character rendering.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Material instancing works the same regardless of mesh type. Usage is about shader permutations.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "materials",
      title: "Enabling the Flag",
      image_path: "assets/generated/MaterialNotRenderingInPIE/step-4.png",
      prompt:
        "<p>You need to enable <code>Used with Skeletal Mesh</code>. What happens after you check this box?</p><p><strong>What should you expect?</strong></p>",
      choices: [
        {
          text: "The material will recompile, creating new shader permutations for skeletal mesh rendering. A brief shader compile popup may appear.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Enabling usage flags triggers shader recompilation. This is normal and expected.",
          next: "step-5",
        },
        {
          text: "The material will automatically apply to all skeletal meshes in the level.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Usage flags don't auto-apply materials. They enable compilation for mesh types you manually assign.",
          next: "step-4",
        },
        {
          text: "A warning dialog will appear asking to confirm the mesh type change.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. There's no confirmation dialog. The flag simply enables that compilation path.",
          next: "step-4",
        },
        {
          text: "The material preview will switch from a sphere to a skeletal mesh preview.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Preview shape is changed manually via the preview settings, not automatically by usage flags.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "materials",
      title: "Saving the Material",
      image_path: "assets/generated/MaterialNotRenderingInPIE/step-5.png",
      prompt:
        "<p>You've enabled the usage flag. The material shows unsaved changes (asterisk in the tab). What should you do next?</p><p><strong>What is the correct action?</strong></p>",
      choices: [
        {
          text: "Save the material asset (<code>Ctrl+S</code>) to ensure the new shader permutations are stored for runtime use.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.05hrs. Saving the material persists the compiled shaders so they load correctly at runtime.",
          next: "step-6",
        },
        {
          text: "Press <strong>Apply</strong> in the Material Editor toolbar to compile without saving.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Apply compiles for editor preview but saving is still needed for packaged builds and persistence.",
          next: "step-5",
        },
        {
          text: "Close the Material Editor; changes will auto-save when you close the project.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Auto-save on close is unreliable. Explicitly save to ensure changes persist.",
          next: "step-5",
        },
        {
          text: "Test in PIE first to confirm the fix works before saving.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Testing is good, but the shader needs to be compiled first. Save triggers the necessary recompilation.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "materials",
      title: "Initial Test",
      image_path: "assets/generated/MaterialNotRenderingInPIE/step-6.png",
      prompt:
        "<p>You've saved the material. How do you quickly verify the fix works before extensive testing?</p><p><strong>What is the fastest verification method?</strong></p>",
      choices: [
        {
          text: "Press <strong>Play in Editor</strong> (PIE) and observe the skeletal mesh to confirm the material now renders correctly.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. PIE is the fastest way to verify runtime material rendering works as expected.",
          next: "step-7",
        },
        {
          text: "Check the <strong>Output Log</strong> for any material compilation warnings.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The log shows errors but visual confirmation in PIE is more definitive for rendering issues.",
          next: "step-6",
        },
        {
          text: "Switch to <strong>Simulate</strong> mode to test without fully entering gameplay.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Simulate works but PIE is more complete for testing runtime behavior.",
          next: "step-6",
        },
        {
          text: "Package the project to test the final build environment.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Packaging is time-consuming and unnecessary for initial verification. PIE is sufficient.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "materials",
      title: "Understanding Shader Permutations",
      image_path: "assets/generated/MaterialNotRenderingInPIE/step-7.png",
      prompt:
        "<p>The material now works! You want to understand why usage flags exist. A teammate asks why you can't just enable all flags by default.</p><p><strong>What is the correct answer?</strong></p>",
      choices: [
        {
          text: "Each enabled usage flag compiles additional shader variants, increasing compile time, memory usage, and package size. Only enable what you need.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Shader permutation explosion is a real concern. Usage flags optimize by limiting unnecessary variants.",
          next: "step-8",
        },
        {
          text: "All flags enabled would cause conflicts between different mesh rendering paths at runtime.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no conflict—the engine selects the right permutation. The cost is compilation, not conflicts.",
          next: "step-7",
        },
        {
          text: "Usage flags are deprecated; the engine is moving to automatic detection in future versions.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Usage flags remain essential for shader optimization in UE5. They're not deprecated.",
          next: "step-7",
        },
        {
          text: "Enabling unnecessary flags can cause visual artifacts on unsupported mesh types.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Extra flags don't cause artifacts. The concern is performance and memory overhead.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "materials",
      title: "Checking Other Common Flags",
      image_path: "assets/generated/MaterialNotRenderingInPIE/step-8.png",
      prompt:
        "<p>You want to future-proof your material. Besides <code>Used with Skeletal Mesh</code>, what other usage flags might you need for a character material?</p><p><strong>Which additional flag is commonly needed?</strong></p>",
      choices: [
        {
          text: "Consider <code>Used with Morph Targets</code> if your character uses facial expressions or blend shapes.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Morph targets require special shader variants. Enable this if your character has blend shape animations.",
          next: "step-9",
        },
        {
          text: "Enable <code>Used with Static Lighting</code> for characters that stand in pre-baked light areas.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Static lighting with skeletal meshes is uncommon. Dynamic lighting is standard for characters.",
          next: "step-8",
        },
        {
          text: "Add <code>Used with Spline Meshes</code> for when the character is placed on procedural paths.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Characters aren't typically rendered as spline meshes. Focus on skeletal and morph target flags.",
          next: "step-8",
        },
        {
          text: "Enable <code>Used with Instanced Static Meshes</code> for crowd systems.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. ISM is for static mesh instancing, not skeletal characters. Skeletal mesh instancing is different.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "materials",
      title: "Auto Usage Detection",
      image_path: "assets/generated/MaterialNotRenderingInPIE/step-9.png",
      prompt:
        "<p>You notice a checkbox called <code>Automatically Set Usage in Editor</code>. Should you enable this?</p><p><strong>What is the trade-off of this setting?</strong></p>",
      choices: [
        {
          text: "It's convenient for development—the engine enables flags as you apply the material to different mesh types—but can cause unexpected shader recompiles during production.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Auto-detection is helpful while iterating but explicit flags give more control for final builds.",
          next: "step-10",
        },
        {
          text: "Enabling it will disable all current usage flags and rely entirely on runtime detection.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. It doesn't clear existing flags; it just auto-adds new ones when you apply the material.",
          next: "step-9",
        },
        {
          text: "Auto-detection only works in the editor and will fail in packaged builds.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Auto-set flags persist after being set. The issue is unexpected recompiles, not package failures.",
          next: "step-9",
        },
        {
          text: "This setting is incompatible with material instances and should never be used.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. It works with instances fine. It's a workflow preference, not a compatibility issue.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "materials",
      title: "Final Verification",
      image_path: "assets/generated/MaterialNotRenderingInPIE/step-10.png",
      prompt:
        "<p>With usage flags properly configured, how do you verify the material works correctly across all scenarios?</p><p><strong>What is the best final verification?</strong></p>",
      choices: [
        {
          text: "Test the material in PIE on all skeleton meshes that use it, including any that have morph targets or cloth simulation enabled.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Testing all use cases ensures no additional flags are missing before shipping.",
          next: "conclusion",
        },
        {
          text: "Review the material's compiled shader count in the Stats panel.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Shader count shows compilation, but visual testing confirms actual runtime behavior.",
          next: "step-10",
        },
        {
          text: "Check that the <strong>Shader Complexity</strong> view mode shows the material rendering.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Shader Complexity shows instruction count, not usage flag correctness. PIE testing is definitive.",
          next: "step-10",
        },
        {
          text: "Package a development build to test in the final runtime environment.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. PIE accurately represents runtime rendering. Packaging is for final validation, not debugging.",
          next: "step-10",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/MaterialNotRenderingInPIE/conclusion.png",
      prompt:
        "<p><strong>Great job!</strong></p><p>You've resolved the material rendering issue and understand the importance of usage flags.</p><h4>Key Takeaways:</h4><ul><li><code>Usage Flags</code> — Control which mesh types can use a material at runtime</li><li><strong>Shader Permutations</strong> — Each flag compiles additional shader variants</li><li><code>Used with Skeletal Mesh</code> — Required for characters and animated meshes</li><li><code>Used with Morph Targets</code> — Needed for blend shape animations</li><li><code>Automatically Set Usage in Editor</code> — Convenient for development but can cause unexpected recompiles</li><li><strong>Save After Changes</strong> — Always save materials after enabling new usage flags</li></ul>",
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
