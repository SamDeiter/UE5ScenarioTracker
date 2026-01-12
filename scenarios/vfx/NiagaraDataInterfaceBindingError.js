window.SCENARIOS["NiagaraDataInterfaceBindingError"] = {
  meta: {
    title: "Niagara Data Interface Binding Error Causing System Crash",
    description:
      "A complex Niagara system with custom Data Interfaces crashes the editor when spawning, with cryptic errors about binding failures in the Output Log.",
    estimateHours: 2.0,
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
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. GPU debugging won't help—this is a CPU-side binding error before GPU simulation starts.",
          next: "step-1",
        },
        {
          text: "Reinstall the engine to fix potentially corrupted Niagara plugin files.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +2.0hrs. Engine reinstallation is extreme. This is a configuration issue in your Niagara system.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "vfx",
      title: "Understanding Data Interfaces",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-2.png",
      prompt:
        "<p>Before investigating further, you need to understand how Niagara Data Interfaces work. What is the purpose of a Data Interface?</p><p><strong>What do Data Interfaces provide?</strong></p>",
      choices: [
        {
          text: "Data Interfaces provide Niagara systems with access to external data sources like meshes, textures, audio, physics, and gameplay objects at runtime.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Understanding that DIs bridge Niagara to external systems helps debug binding issues.",
          next: "step-3",
        },
        {
          text: "Data Interfaces define how particles render, controlling shaders and material bindings.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Renderers handle visuals. Data Interfaces provide data access, not rendering.",
          next: "step-2",
        },
        {
          text: "Data Interfaces allow multiple Niagara systems to communicate and share particle data.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Some DIs do enable system communication, but that's one use case. DIs generally provide external data access.",
          next: "step-2",
        },
        {
          text: "Data Interfaces control the execution order of modules within an emitter.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Module execution order is determined by stack position. DIs provide data, not execution control.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "vfx",
      title: "Opening User Parameters",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-3.png",
      prompt:
        "<p>You open the Niagara System in the Niagara Editor. Where do you find the User Parameters section?</p><p><strong>How do you access User Parameters?</strong></p>",
      choices: [
        {
          text: "In the <strong>Parameters Panel</strong> on the left side, expand the <code>User</code> category to see all exposed parameters.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The Parameters Panel organizes variables by scope, with User parameters being externally accessible.",
          next: "step-4",
        },
        {
          text: "Select the System node in the graph and check the <strong>Details Panel</strong> for User options.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The system node shows some properties but User Parameters are in the dedicated Parameters Panel.",
          next: "step-3",
        },
        {
          text: "Open <strong>Window</strong> > <strong>User Parameters</strong> to access a dedicated configuration panel.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no separate User Parameters window. Use the Parameters Panel on the left.",
          next: "step-3",
        },
        {
          text: "Right-click the emitter in the timeline and select <strong>Expose Parameters</strong>.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Exposing creates new parameters. You need to view existing ones in the Parameters Panel.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "vfx",
      title: "Examining User Parameters",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-4.png",
      prompt:
        "<p>You find the User Parameters section. There's a parameter named <code>SkeletalMeshComponent</code> but it's typed as <code>Object</code> instead of <code>Skeletal Mesh Interface</code>.</p><p><strong>Why is this a problem?</strong></p>",
      choices: [
        {
          text: "Data Interface parameters must be created with the specific DI type (like <code>Skeletal Mesh</code>) so the binding system knows how to connect them to consuming modules.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Type information is essential for DI binding. Generic Object type lacks the required interface contract.",
          next: "step-5",
        },
        {
          text: "The Object type uses more memory than specific DI types, causing performance issues.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Memory isn't the issue. Type mismatch causes binding failures, not performance problems.",
          next: "step-4",
        },
        {
          text: "Object parameters can only be set from C++, not Blueprint, limiting accessibility.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Both Object and DI parameters can be set from Blueprint. The issue is type compatibility.",
          next: "step-4",
        },
        {
          text: "Object types don't support the GPU simulation that Skeletal Mesh DI requires.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. GPU/CPU sim is separate from parameter types. The issue is binding interface compatibility.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "vfx",
      title: "Correcting the Parameter Type",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-5.png",
      prompt:
        "<p>You need to fix the parameter type. What is the correct procedure?</p><p><strong>How do you fix the parameter type?</strong></p>",
      choices: [
        {
          text: "Delete the existing parameter, then use the <strong>+</strong> button to add a new parameter of type <code>Data Interface</code> > <code>Skeletal Mesh</code>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Parameter types cannot be changed after creation. Delete and recreate with the correct DI type.",
          next: "step-6",
        },
        {
          text: "Right-click the parameter and select <strong>Change Type</strong> > <strong>Skeletal Mesh Interface</strong>.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Parameter types are immutable. There's no Change Type option. Delete and recreate.",
          next: "step-5",
        },
        {
          text: "Cast the Object to Skeletal Mesh Interface using a conversion module in the emitter stack.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Niagara doesn't support runtime type casting for Data Interfaces. Correct typing at creation is required.",
          next: "step-5",
        },
        {
          text: "Modify the parameter in the HLSL code generated by the Niagara compiler.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.5hrs. Manual HLSL modification is not supported and would be overwritten. Use the visual editor.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "vfx",
      title: "Creating the Correct Parameter",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-6.png",
      prompt:
        "<p>You click the <strong>+</strong> button to add a new User Parameter. The type dropdown appears with many categories.</p><p><strong>What is the correct path to create a Skeletal Mesh Data Interface parameter?</strong></p>",
      choices: [
        {
          text: "Navigate to <code>Data Interface</code> > <code>Skeletal Mesh</code> in the type dropdown.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Data Interface types are grouped under their own category. Skeletal Mesh is one of the available DI types.",
          next: "step-7",
        },
        {
          text: "Choose <code>Object</code> > <code>Skeletal Mesh Component</code> from the type list.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. This creates an Object reference, not a Data Interface. Use the Data Interface category.",
          next: "step-6",
        },
        {
          text: "Select <code>Struct</code> > <code>Skeletal Mesh Data</code> to create a struct container.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Structs hold data differently than Data Interfaces. Use the DI category.",
          next: "step-6",
        },
        {
          text: "Pick <code>Asset</code> > <code>Skeletal Mesh</code> to reference a mesh asset.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Asset references are for static assets. Runtime component binding requires Data Interface.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "vfx",
      title: "Rebinding the Data Interface",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-7.png",
      prompt:
        "<p>You've created the correctly typed parameter named <code>SkeletalMeshDI</code>. Now you need to connect it to the modules that use it.</p><p><strong>Where do you configure the binding?</strong></p>",
      choices: [
        {
          text: "Select the <strong>Skeletal Mesh Location</strong> module, and in its properties, set the <code>Skeletal Mesh Interface</code> input to link to your User Parameter via the binding dropdown.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Each module that consumes a DI has a binding dropdown to connect it to the appropriate source.",
          next: "step-8",
        },
        {
          text: "Use a <strong>Set Parameter</strong> module at the start of the emitter to assign the DI.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Set Parameter works for numeric values, but DI bindings use the dedicated binding system.",
          next: "step-7",
        },
        {
          text: "Drag a wire from the User Parameter to the module's input pin in the graph view.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Niagara modules don't use visual wire connections for DI binding. Use the binding dropdown.",
          next: "step-7",
        },
        {
          text: "Create a <strong>Custom Module</strong> that reads the User Parameter and outputs to a namespace.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. DIs cannot be stored as namespace attributes. Direct binding is required.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "vfx",
      title: "Using the Binding Dropdown",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-8.png",
      prompt:
        "<p>You select the Skeletal Mesh Location module. In its properties, you see the <code>Skeletal Mesh Interface</code> input with a dropdown.</p><p><strong>What options appear in the binding dropdown?</strong></p>",
      choices: [
        {
          text: "Options include <code>User.SkeletalMeshDI</code> (your new parameter), any inline DI defined in the module, and <code>None</code> (unbound).",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The dropdown shows all compatible Data Interface sources available in the current scope.",
          next: "step-9",
        },
        {
          text: "Only the default inline Data Interface with options to edit its properties.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. User Parameters appear in the dropdown alongside inline DIs. Select your User parameter.",
          next: "step-8",
        },
        {
          text: "A list of all Skeletal Mesh Components currently in the level.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Level components aren't shown. The dropdown shows Niagara internal bindings. Runtime component is set externally.",
          next: "step-8",
        },
        {
          text: "Only bone names from the currently selected mesh for direct sampling.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Bone names are separate properties. The binding dropdown connects to the DI source.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "vfx",
      title: "Verifying Module Configuration",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-9.png",
      prompt:
        "<p>You select <code>User.SkeletalMeshDI</code> in the binding dropdown. The module now shows it's bound to the User Parameter. What should you check next?</p><p><strong>What else needs verification in the Niagara System?</strong></p>",
      choices: [
        {
          text: "Check if any other modules in the emitter also use the Skeletal Mesh DI and update their bindings to use the same User Parameter.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Multiple modules might reference the skeletal mesh. All must bind to the same User Parameter for consistency.",
          next: "step-10",
        },
        {
          text: "Compile the Niagara System to verify there are no remaining binding errors.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Compilation happens automatically. Checking for other consumers first ensures you fix all bindings.",
          next: "step-9",
        },
        {
          text: "Test the system in the Niagara preview window to see if particles spawn.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Preview won't work yet—the User Parameter needs runtime binding from Blueprint. Check for other modules first.",
          next: "step-9",
        },
        {
          text: "Save the Niagara System and test in PIE immediately.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. PIE will still crash—you haven't set up the Blueprint binding yet. Complete Niagara config first.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "vfx",
      title: "Setting Up Blueprint Binding",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-10.png",
      prompt:
        "<p>The Niagara system is now correctly configured. You need to ensure the spawning Blueprint provides the skeletal mesh data at runtime.</p><p><strong>How do you pass the Skeletal Mesh Component to the Niagara System?</strong></p>",
      choices: [
        {
          text: "After spawning the Niagara Component, use <code>Set Niagara Variable (Object)</code> with the parameter name <code>SkeletalMeshDI</code> and a reference to the <strong>Skeletal Mesh Component</strong>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. The Set Niagara Variable node family allows runtime binding of User Parameters to component references.",
          next: "step-11",
        },
        {
          text: "Set the User Parameter default value in the Niagara asset to reference the mesh by path.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. DI parameters for components need runtime references, not asset paths.",
          next: "step-10",
        },
        {
          text: "Add the Niagara Component as a child of the Skeletal Mesh Component with <code>Auto-Bind</code> enabled.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Auto-binding works for simple cases but explicit parameter setting is more reliable.",
          next: "step-10",
        },
        {
          text: "Use <code>Attach Actor To Component</code> to physically attach the Niagara actor to the mesh.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Physical attachment affects transforms, not DI binding. Use Set Niagara Variable.",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "vfx",
      title: "Finding the Correct Node",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-11.png",
      prompt:
        "<p>In your Blueprint, you need to find the Set Niagara Variable node. What do you search for?</p><p><strong>What is the exact node name?</strong></p>",
      choices: [
        {
          text: "Search for <code>Set Niagara Variable (Object)</code> in the Blueprint context menu or the action palette.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Data Interface parameters use the Object variant of Set Niagara Variable.",
          next: "step-12",
        },
        {
          text: "Look for <code>Set Niagara Data Interface</code> as a dedicated node for DI binding.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no separate DI node. Use Set Niagara Variable (Object) for DI parameters.",
          next: "step-11",
        },
        {
          text: "Use <code>Set Parameter On Niagara</code> from the Niagara Component reference.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The node is called Set Niagara Variable, not Set Parameter. Search for that name.",
          next: "step-11",
        },
        {
          text: "Call <code>Bind Data Interface</code> directly on the Niagara Component.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no Bind Data Interface node in Blueprint. Use Set Niagara Variable (Object).",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "vfx",
      title: "Configuring the Node",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-12.png",
      prompt:
        "<p>You've added <code>Set Niagara Variable (Object)</code>. What inputs does this node require?</p><p><strong>What do you connect to the node?</strong></p>",
      choices: [
        {
          text: "Target: the spawned <strong>Niagara Component</strong>. Variable Name: <code>SkeletalMeshDI</code> (matching your User Parameter). Object: reference to the <strong>Skeletal Mesh Component</strong>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. All three inputs are required: which Niagara component, which parameter name, and what value to set.",
          next: "step-13",
        },
        {
          text: "Only the Niagara Component reference and the Skeletal Mesh Component reference.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. You also need the Variable Name string to identify which User Parameter to set.",
          next: "step-12",
        },
        {
          text: "The Skeletal Mesh asset and the bone name to sample from.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. You bind a Component, not an asset or bone name. Component reference is the Object input.",
          next: "step-12",
        },
        {
          text: "Just the Variable Name string; the component auto-detects the binding source.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Auto-detection doesn't work for DI binding. You must explicitly provide the component reference.",
          next: "step-12",
        },
      ],
    },
    "step-13": {
      skill: "vfx",
      title: "Handling Edge Cases",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-13.png",
      prompt:
        "<p>Your system now works. But you want to prevent future crashes if the binding target becomes invalid (e.g., mesh destroyed mid-playback).</p><p><strong>What safeguard should you implement?</strong></p>",
      choices: [
        {
          text: "In the emitter's <strong>Skeletal Mesh Location</strong> module, enable <code>Graceful Fallback</code> behavior like <code>Use Origin</code> for when the binding is invalid.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Many DI modules have fallback options that prevent crashes when the bound source becomes invalid.",
          next: "step-14",
        },
        {
          text: "Add an <code>Is Valid</code> check in Blueprint before spawning the Niagara system.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Pre-spawn validation helps but doesn't protect against mid-playback invalidation.",
          next: "step-13",
        },
        {
          text: "Set the Niagara Component's <code>Pool Method</code> to <code>Manual Release</code> for lifecycle control.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Pooling affects component reuse, not DI binding validity.",
          next: "step-13",
        },
        {
          text: "Wrap the spawn call in a Blueprint macro with error handling.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Blueprint doesn't have exception handling. Use Niagara's built-in fallback systems.",
          next: "step-13",
        },
      ],
    },
    "step-14": {
      skill: "vfx",
      title: "Testing the System",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-14.png",
      prompt:
        "<p>You've configured fallback behaviors. How do you verify the DI binding chain works correctly?</p><p><strong>What is the best verification approach?</strong></p>",
      choices: [
        {
          text: "Use <code>stat Niagara</code> and the <strong>Niagara Debugger</strong> to verify DI bindings are active and show correct data sources.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. The Niagara Debugger shows active bindings and their status in real-time.",
          next: "step-15",
        },
        {
          text: "Visually confirm particles spawn on the correct bones during PIE.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Visual verification is useful but doesn't confirm binding validity or fallback behavior.",
          next: "step-14",
        },
        {
          text: "Check the Output Log for DI-related warnings during playback.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Logs help but the Niagara Debugger provides more detailed DI binding status.",
          next: "step-14",
        },
        {
          text: "Profile the system with Unreal Insights to ensure DI binding doesn't cause performance issues.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Insights is for performance. Binding correctness needs the Niagara Debugger.",
          next: "step-14",
        },
      ],
    },
    "step-15": {
      skill: "vfx",
      title: "Final Verification",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/step-15.png",
      prompt:
        "<p>The Niagara Debugger shows the DI binding is active. What edge case should you test to ensure robustness?</p><p><strong>What final test validates the fallback behavior?</strong></p>",
      choices: [
        {
          text: "Deliberately destroy the Skeletal Mesh Actor mid-playback and verify particles gracefully fall back to the origin instead of crashing.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Testing the failure case ensures your fallback configuration actually protects against crashes.",
          next: "conclusion",
        },
        {
          text: "Test spawning multiple Niagara systems on different skeletal meshes simultaneously.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Multi-system testing is good for performance but doesn't test the fallback behavior.",
          next: "step-15",
        },
        {
          text: "Run the system for an extended period to check for memory leaks.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Memory testing is separate from binding fallback verification.",
          next: "step-15",
        },
        {
          text: "Package the project and test on different hardware configurations.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.4hrs. Hardware testing is for final QA. Editor testing is sufficient for DI validation.",
          next: "step-15",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/NiagaraDataInterfaceBindingError/conclusion.png",
      prompt:
        "<p><strong>Outstanding work!</strong></p><p>You've resolved a complex Niagara Data Interface binding issue and implemented robust fallback protection.</p><h4>Key Takeaways:</h4><ul><li><strong>User Parameters</strong> — Must be created with the specific Data Interface type (not generic Object)</li><li><strong>Binding Dropdown</strong> — Each consuming module has its own binding configuration connecting to User Parameters</li><li><code>Set Niagara Variable (Object)</code> — Runtime BP method to bind DI parameters to component references</li><li><strong>Variable Name Match</strong> — The parameter name string must exactly match the User Parameter name</li><li><code>Graceful Fallback</code> — Protects against mid-playback binding invalidation</li><li><strong>Niagara Debugger</strong> — Best tool for verifying active DI bindings and their status</li></ul>",
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
