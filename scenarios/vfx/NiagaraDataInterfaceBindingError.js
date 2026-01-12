window.SCENARIOS["NiagaraDataInterfaceBindingError"] = {
  meta: {
    title: "Niagara Data Interface Binding Error Causing System Crash",
    description:
      "A complex Niagara system with custom Data Interfaces crashes the editor when spawning, with cryptic errors about binding failures in the Output Log.",
    estimateHours: 1.5,
    difficulty: "Advanced",
    category: "VFX",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "NiagaraDataInterfaceBindingError",
      step: "setup",
    },
  ],
  fault: {
    description:
      "Niagara system crashes editor on spawn with DI binding errors",
    visual_cue: "Editor crash or freeze when particle system attempts to spawn",
  },
  expected: {
    description:
      "System spawns without errors and Data Interface provides correct data",
    validation_action: "verify_di_binding",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "NiagaraDataInterfaceBindingError",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "vfx",
      title: "Analyzing the Crash",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-1.png",
      prompt:
        "<p>Your Niagara system uses a <strong>Skeletal Mesh Data Interface</strong> to spawn particles along bones. When the system spawns at runtime, the editor crashes. The <strong>Output Log</strong> shows: <code>Error: Failed to bind DI parameter 'SkeletalMesh' - Source not found</code>.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Open the <strong>Niagara System</strong> and verify the <code>User Parameters</code> section has a correctly typed Skeletal Mesh parameter exposed.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. Data Interface bindings require properly exposed user parameters that match the expected type. Missing or mistyped parameters cause binding failures.",
          next: "step-2",
        },
        {
          text: "Check if the <strong>Skeletal Mesh Component</strong> on the spawning actor has a valid mesh assigned.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. A valid mesh is necessary, but the error specifically mentions parameter binding, suggesting the Niagara system configuration is the issue.",
          next: "step-1",
        },
        {
          text: "Enable <code>GPU Debugging</code> in <strong>Project Settings</strong> to get more detailed crash information.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. GPU debugging won't help—this is a CPU-side binding error that occurs before GPU simulation starts.",
          next: "step-1",
        },
        {
          text: "Reinstall the engine to fix potentially corrupted Niagara plugin files.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +2.0hrs. Engine reinstallation is extreme and unnecessary. This is a configuration issue in your Niagara system.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "vfx",
      title: "Examining User Parameters",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-2.png",
      prompt:
        "<p>You open the Niagara System and check <strong>User Parameters</strong>. You see a parameter named <code>SkeletalMeshComponent</code> but it's typed as <code>Object</code> instead of <code>Skeletal Mesh Interface</code>.</p><p><strong>What is the correct fix?</strong></p>",
      choices: [
        {
          text: "Delete the parameter and recreate it with type <code>Data Interface</code> > <code>Skeletal Mesh</code> from the <strong>User Parameters</strong> dropdown.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Data Interface parameters must be created with the specific DI type, not generic Object. The binding system uses type information for validation.",
          next: "step-3",
        },
        {
          text: "Cast the <code>Object</code> parameter to <code>Skeletal Mesh Interface</code> using a conversion module in the emitter.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Niagara doesn't support runtime type casting for Data Interfaces. The parameter must be correctly typed at creation.",
          next: "step-2",
        },
        {
          text: "Change the <strong>Skeletal Mesh Data Interface</strong> module to accept <code>Object</code> type inputs.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Built-in Data Interface modules have fixed input types. You cannot change them to accept generic Objects.",
          next: "step-2",
        },
        {
          text: "Set the parameter's <code>Scope</code> to <code>System</code> instead of <code>Emitter</code> to ensure proper binding.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Scope affects where the parameter is accessible, not type binding. The type mismatch is the core issue.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "vfx",
      title: "Rebinding the Data Interface",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-3.png",
      prompt:
        "<p>You've recreated the parameter with the correct type. Now you need to rebind it in the emitter modules that use it.</p><p><strong>Where do you configure the binding?</strong></p>",
      choices: [
        {
          text: "In the <strong>Skeletal Mesh Location</strong> module, set the <code>Skeletal Mesh Interface</code> input to link to your new User Parameter via the binding dropdown.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Each module that uses a Data Interface has a binding dropdown to connect it to the appropriate User Parameter or inline DI.",
          next: "step-4",
        },
        {
          text: "Use the <strong>Set Parameter</strong> module at the start of the emitter to assign the DI to modules downstream.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Set Parameter works for numeric values, but Data Interface bindings use the dedicated binding system in each module.",
          next: "step-3",
        },
        {
          text: "Create a <strong>Custom Module</strong> that reads the User Parameter and outputs it to a Namespace Attribute.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Data Interfaces cannot be stored as namespace attributes. They must be bound directly in each consuming module.",
          next: "step-3",
        },
        {
          text: "Export the system to <strong>HLSL</strong> and manually wire the DI binding in shader code.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +1.0hrs. Manual HLSL editing for DI bindings is unnecessary and error-prone. Use the visual binding system.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "vfx",
      title: "Setting Up the Spawner",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-4.png",
      prompt:
        "<p>The Niagara system is now correctly configured. You need to ensure the spawning Blueprint provides the required skeletal mesh data.</p><p><strong>How do you pass the Skeletal Mesh Component to the Niagara System at spawn time?</strong></p>",
      choices: [
        {
          text: "After spawning the Niagara Component, use <code>Set Niagara Variable (Object)</code> with the parameter name and a reference to the <strong>Skeletal Mesh Component</strong>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. The <code>Set Niagara Variable</code> node family allows runtime binding of User Parameters to specific component references.",
          next: "step-5",
        },
        {
          text: "Add a <strong>Niagara Component</strong> as a child of the <strong>Skeletal Mesh Component</strong> and enable <code>Auto-Bind Parent</code>.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Auto-binding can work for simple cases but explicit parameter setting is more reliable and debuggable.",
          next: "step-4",
        },
        {
          text: "Set the User Parameter default value in the Niagara asset to reference the skeletal mesh by path.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Data Interface parameters for components need runtime references, not asset paths. Path-based binding won't work.",
          next: "step-4",
        },
        {
          text: "Use <code>Attach Actor To Component</code> to physically attach the Niagara actor to the skeletal mesh.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Physical attachment affects transform inheritance, not Data Interface binding. Particles would move with the mesh but still crash without proper DI setup.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "vfx",
      title: "Handling Edge Cases",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-5.png",
      prompt:
        "<p>Your system now works, but you want to prevent future crashes if the binding target becomes invalid (e.g., mesh destroyed mid-playback).</p><p><strong>What safeguard should you implement?</strong></p>",
      choices: [
        {
          text: "In the emitter's <strong>Skeletal Mesh Location</strong> module, enable <code>Graceful Fallback</code> and set a fallback behavior like <code>Use Origin</code>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Many DI modules have fallback options that prevent crashes when the bound source becomes invalid during runtime.",
          next: "step-6",
        },
        {
          text: "Add a <code>Is Valid</code> check in Blueprint before spawning the Niagara system.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Pre-spawn validation helps, but doesn't protect against mid-playback invalidation. Fallback behaviors are more comprehensive.",
          next: "step-5",
        },
        {
          text: "Wrap the entire Niagara spawn call in a <code>Try/Catch</code> block to gracefully handle exceptions.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Blueprint doesn't have Try/Catch. Even in C++, Niagara DI crashes aren't exception-safe. Use built-in fallback systems.",
          next: "step-5",
        },
        {
          text: "Set the Niagara Component's <code>Pool Method</code> to <code>Manual Release</code> to control lifecycle.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Pooling affects component reuse, not DI binding validity. Fallback behaviors are the correct protection mechanism.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "vfx",
      title: "Verification",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-6.png",
      prompt:
        "<p>You've configured fallback behaviors. How do you verify the entire Data Interface binding chain works correctly?</p><p><strong>What is the most comprehensive test?</strong></p>",
      choices: [
        {
          text: "Use <code>stat Niagara</code> and the <strong>Niagara Debugger</strong> to verify DI bindings are active, then test edge cases by destroying the mesh mid-playback.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. The Niagara Debugger shows active bindings, and deliberately testing edge cases ensures your fallbacks work correctly.",
          next: "conclusion",
        },
        {
          text: "Check that particles spawn on the correct bones by visual inspection during PIE.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Visual verification is useful but doesn't test binding validity or fallback behavior under stress conditions.",
          next: "step-6",
        },
        {
          text: "Review the <strong>Output Log</strong> for any remaining DI-related warnings during playback.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Logs help, but active debugging tools like the Niagara Debugger provide more detailed DI binding status.",
          next: "step-6",
        },
        {
          text: "Profile the system with <strong>Unreal Insights</strong> to ensure DI binding doesn't cause performance issues.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Insights is for performance analysis. Binding correctness verification requires the Niagara Debugger.",
          next: "step-6",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/conclusion.png",
      prompt:
        "<p><strong>Outstanding work!</strong></p><p>You've resolved a complex Niagara Data Interface binding issue.</p><h4>Key Takeaways:</h4><ul><li><strong>User Parameters</strong> — Must be created with the specific Data Interface type</li><li><code>Binding Dropdown</code> — Each consuming module has its own binding configuration</li><li><code>Set Niagara Variable</code> — Runtime method to bind DI parameters to component references</li><li><code>Graceful Fallback</code> — Protects against mid-playback binding invalidation</li><li><strong>Niagara Debugger</strong> — Best tool for verifying active DI bindings</li></ul>",
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
