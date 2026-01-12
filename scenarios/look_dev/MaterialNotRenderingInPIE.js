window.SCENARIOS["MaterialNotRenderingInPIE"] = {
  meta: {
    title: "Material Displays Correctly in Editor but Not in PIE",
    description:
      "A material looks perfect in the Material Editor preview and viewport, but turns completely black or displays incorrectly when playing in editor.",
    estimateHours: 0.5,
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
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Lighting affects shading but not complete material failure. The issue is material configuration.",
          next: "step-1",
        },
        {
          text: "Check if the texture assets referenced by the material are missing.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Missing textures would show in the editor too. The material works in editor, so assets are present.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "materials",
      title: "Checking Usage Flags",
      image_path: "assets/generated/MaterialNotRenderingInPIE/step-2.png",
      prompt:
        "<p>You open the material and check the <strong>Usage</strong> category. You see the material is on a Skeletal Mesh, but <code>Used with Skeletal Mesh</code> is not checked.</p><p><strong>What is the correct fix?</strong></p>",
      choices: [
        {
          text: "Enable <code>Used with Skeletal Mesh</code> in the material's <strong>Usage</strong> flags and save the material asset.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.05hrs. Enabling the correct usage flag allows the shader to compile variants for that mesh type.",
          next: "step-3",
        },
        {
          text: "Enable <code>Automatically Set Usage in Editor</code> to let the engine detect required usages.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Auto-set works in editor but may not cover all runtime cases. Explicit flags are more reliable.",
          next: "step-3",
        },
        {
          text: "Convert the character to use a <strong>Static Mesh</strong> instead to avoid the usage requirement.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Changing mesh type for a usage flag is backwards. Simply enable the correct flag.",
          next: "step-2",
        },
        {
          text: "Create a <strong>Material Instance</strong> with inherited usage flags from a base material.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Material Instances inherit usage flags from their parent—you still need to fix the parent.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "materials",
      title: "Understanding Shader Compilation",
      image_path: "assets/generated/MaterialNotRenderingInPIE/step-3.png",
      prompt:
        "<p>The material now works on your skeletal mesh. You want to understand why usage flags are necessary.</p><p><strong>Why does Unreal require explicit usage flags for materials?</strong></p>",
      choices: [
        {
          text: "Each usage flag triggers compilation of additional shader permutations. Unnecessary flags increase shader compilation time and memory usage.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.05hrs. Understanding shader permutations helps you balance workflow convenience against build performance.",
          next: "step-4",
        },
        {
          text: "Usage flags are a legacy system from UE4 that will be removed in future versions.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Usage flags remain essential in UE5 for shader optimization. They're not deprecated.",
          next: "step-3",
        },
        {
          text: "Usage flags control which LOD levels the material is applied to on different mesh types.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. LODs are handled separately. Usage flags control shader permutation compilation.",
          next: "step-3",
        },
        {
          text: "The flags determine which rendering pass the material uses during runtime.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Rendering passes are determined by blend mode and shading model, not usage flags.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "materials",
      title: "Verification",
      image_path: "assets/generated/MaterialNotRenderingInPIE/step-4.png",
      prompt:
        "<p>You've enabled the <code>Used with Skeletal Mesh</code> flag. How do you verify the material now works correctly at runtime?</p><p><strong>What is the best verification approach?</strong></p>",
      choices: [
        {
          text: "Press <strong>Play in Editor</strong> and visually confirm the material renders correctly on the skeletal mesh during gameplay.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.05hrs. Direct visual verification in PIE confirms the shader compiled correctly for the mesh type.",
          next: "conclusion",
        },
        {
          text: "Check the <strong>Shader Complexity</strong> view mode to ensure the material compiles without errors.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Shader Complexity shows instruction count, not compilation success. PIE testing is definitive.",
          next: "step-4",
        },
        {
          text: "Review the <strong>Derived Data Cache</strong> to verify shader variants were generated.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. DDC inspection is complex and unnecessary. Visual testing is faster and more reliable.",
          next: "step-4",
        },
        {
          text: "Package the project and test the final build to rule out editor-specific issues.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Packaging is excessive. PIE accurately simulates runtime rendering.",
          next: "step-4",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/MaterialNotRenderingInPIE/conclusion.png",
      prompt:
        "<p><strong>Great job!</strong></p><p>You've resolved the material rendering issue.</p><h4>Key Takeaways:</h4><ul><li><code>Usage Flags</code> — Control which mesh types can use a material at runtime</li><li><strong>Shader Permutations</strong> — Each flag adds compilation variants</li><li><code>Used with Skeletal Mesh</code> — Required for characters and animated meshes</li><li><strong>Automatically Set Usage in Editor</strong> — Convenience setting for development</li></ul>",
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
