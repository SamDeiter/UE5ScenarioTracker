window.SCENARIOS["InputActionNotResponding"] = {
  meta: {
    title: "Input Action Not Responding in Enhanced Input System",
    description:
      "A player presses the jump key but nothing happens in-game. The Enhanced Input System is configured but the action never fires.",
    estimateHours: 1.0,
    difficulty: "Beginner",
    category: "Blueprints",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "InputActionNotResponding",
      step: "setup",
    },
  ],
  fault: {
    description: "Input action configured but never triggers",
    visual_cue: "Player presses key with no response",
  },
  expected: {
    description: "Input action fires and executes bound functionality",
    validation_action: "verify_input_action",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "InputActionNotResponding",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "blueprints",
      title: "Initial Observation",
      image_path: "assets/generated/InputActionNotResponding/step-1.png",
      prompt:
        "<p>Your player character has a <strong>Jump</strong> action configured in the Enhanced Input System. When you press the spacebar in PIE, nothing happens. No errors appear in the <strong>Output Log</strong>.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Check if the <strong>Input Mapping Context</strong> is added to the player controller using <code>Add Mapping Context</code> node in Blueprint.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Enhanced Input requires the Mapping Context to be explicitly added at runtime. Without it, actions won't trigger.",
          next: "step-2",
        },
        {
          text: "Verify the <strong>Input Action</strong> asset has the correct <code>Value Type</code> set to <code>Digital (Bool)</code>.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Value type matters for how data is read, but won't prevent firing entirely. Check context binding first.",
          next: "step-1",
        },
        {
          text: "Open <strong>Project Settings</strong> > <strong>Input</strong> and verify the legacy input bindings are correct.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Legacy input and Enhanced Input are separate systems. If using Enhanced Input, check its configuration instead.",
          next: "step-1",
        },
        {
          text: "Rebuild the player Blueprint to ensure input components initialize properly.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Recompiling won't fix configuration issues. The problem is Mapping Context not being applied.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "blueprints",
      title: "Locating the Mapping Context Setup",
      image_path: "assets/generated/InputActionNotResponding/step-2.png",
      prompt:
        "<p>You need to find where the <strong>Input Mapping Context</strong> should be added. Which Blueprint is responsible for this setup?</p><p><strong>Where should you look first?</strong></p>",
      choices: [
        {
          text: "Open the <strong>Player Controller</strong> Blueprint and check the <code>BeginPlay</code> event for Enhanced Input setup.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Player Controllers typically handle input setup at BeginPlay when the local player is ready.",
          next: "step-3",
        },
        {
          text: "Check the <strong>Character</strong> Blueprint's <code>BeginPlay</code> event for input initialization.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Characters can setup input, but the Player Controller is the standard location for input management.",
          next: "step-2",
        },
        {
          text: "Look in the <strong>Game Mode</strong> Blueprint for player input configuration.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Game Mode handles rules and spawning, not per-player input setup. Check the Player Controller.",
          next: "step-2",
        },
        {
          text: "Search for <code>Add Mapping Context</code> across all project Blueprints using <strong>Find in Blueprints</strong>.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. A broad search can find it, but checking the expected location first is more efficient.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "blueprints",
      title: "Examining BeginPlay",
      image_path: "assets/generated/InputActionNotResponding/step-3.png",
      prompt:
        "<p>You open the Player Controller's <code>BeginPlay</code> event and find no <code>Add Mapping Context</code> node present. The Enhanced Input Subsystem has never been accessed.</p><p><strong>What is the correct way to access the Enhanced Input Subsystem?</strong></p>",
      choices: [
        {
          text: "Use <code>Get Enhanced Input Local Player Subsystem</code> node, which automatically gets the subsystem for the local player.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. This node provides the correct subsystem reference for the local player's input management.",
          next: "step-4",
        },
        {
          text: "Use <code>Get Subsystem</code> with <code>Enhanced Input Component</code> as the class.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Enhanced Input Component is different from the subsystem. Use the specific subsystem getter.",
          next: "step-3",
        },
        {
          text: "Cast the <strong>Player Controller</strong> to access an <code>Input Subsystem</code> component.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. The subsystem isn't a component on the controller. Use the dedicated subsystem getter node.",
          next: "step-3",
        },
        {
          text: "Access <code>UGameplayStatics::GetPlayerController</code> and call <code>GetInputSubsystem</code>.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. This approach is overly complex. Blueprint provides a direct subsystem getter node.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "blueprints",
      title: "Adding the Mapping Context",
      image_path: "assets/generated/InputActionNotResponding/step-4.png",
      prompt:
        "<p>You have the subsystem reference. Now you need to call <code>Add Mapping Context</code>. What parameters does this node require?</p><p><strong>What should you provide to the node?</strong></p>",
      choices: [
        {
          text: "Provide your <strong>Input Mapping Context</strong> asset reference and set <code>Priority</code> to <code>0</code> for standard gameplay.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Priority 0 is standard for primary gameplay input. Higher priorities override lower ones for conflicting actions.",
          next: "step-5",
        },
        {
          text: "Only provide the <strong>Input Mapping Context</strong> asset and leave priority at its default.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Default priority works, but explicitly setting 0 shows intent and prevents future confusion.",
          next: "step-5",
        },
        {
          text: "Provide the <strong>Input Action</strong> asset instead of the Mapping Context.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Add Mapping Context requires an IMC, not an IA. Actions are referenced within the context.",
          next: "step-4",
        },
        {
          text: "Set Priority to <code>100</code> to ensure this context always takes precedence.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. High priority should be reserved for menus or special states. Use 0 for standard gameplay.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "blueprints",
      title: "Verifying the Input Action Asset",
      image_path: "assets/generated/InputActionNotResponding/step-5.png",
      prompt:
        "<p>The Mapping Context is now added. Before testing, you want to verify the <strong>Input Action</strong> asset is configured correctly for a jump action.</p><p><strong>What should you check in the Input Action asset?</strong></p>",
      choices: [
        {
          text: "Verify the <code>Value Type</code> is set to <code>Digital (bool)</code> since jump is a simple press action, not an axis.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Digital bool is correct for button presses. Axis types are for continuous values like movement.",
          next: "step-6",
        },
        {
          text: "Check that <code>Consume Input</code> is enabled to prevent the action from propagating.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Consume Input defaults correctly. Value Type is more critical for action behavior.",
          next: "step-5",
        },
        {
          text: "Ensure the action has a <code>Description</code> filled in for documentation purposes.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Description is optional metadata. Focus on functional settings like Value Type.",
          next: "step-5",
        },
        {
          text: "Set the <code>Triggers</code> array to include a <code>Pressed</code> trigger explicitly.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Triggers modify when actions fire but aren't required. Default behavior fires on press.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "blueprints",
      title: "Checking the Mapping Context Bindings",
      image_path: "assets/generated/InputActionNotResponding/step-6.png",
      prompt:
        "<p>The Input Action looks correct. Now you need to verify the <strong>Input Mapping Context</strong> properly maps the spacebar to the Jump action.</p><p><strong>What should you verify in the IMC?</strong></p>",
      choices: [
        {
          text: "Open the IMC and confirm there's a mapping entry with <code>IA_Jump</code> action bound to the <code>Spacebar</code> key.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The IMC defines which keys trigger which actions. Missing or wrong mappings prevent input.",
          next: "step-7",
        },
        {
          text: "Check if the IMC has <code>Apply After Parent</code> enabled for inheritance.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Inheritance matters for child contexts. Focus on verifying the actual key mapping first.",
          next: "step-6",
        },
        {
          text: "Verify the IMC is marked as <code>Default</code> in Project Settings.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no default IMC setting. Contexts are added programmatically.",
          next: "step-6",
        },
        {
          text: "Check if any <code>Modifiers</code> are applied that might affect the spacebar input.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Modifiers transform input values. Check the basic mapping exists first.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "blueprints",
      title: "Binding the Action to Functionality",
      image_path: "assets/generated/InputActionNotResponding/step-7.png",
      prompt:
        "<p>The mapping exists and the context is added. Now you need to bind the action to actual jump functionality in the Character Blueprint.</p><p><strong>What is the correct node to use?</strong></p>",
      choices: [
        {
          text: "Use an <code>Enhanced Action Events</code> node with your <code>IA_Jump</code> action to receive <code>Started</code>, <code>Triggered</code>, and <code>Completed</code> events.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Enhanced Action Events provide granular callbacks. Use 'Triggered' for the actual jump execution.",
          next: "step-8",
        },
        {
          text: "Use the legacy <code>InputAction Jump</code> event node for backwards compatibility.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Legacy input events don't work with Enhanced Input actions. Use the Enhanced-specific nodes.",
          next: "step-7",
        },
        {
          text: "Create a <code>Custom Event</code> and manually call it from the Player Controller when input is detected.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Manual event calling bypasses the Enhanced Input event system. Use Enhanced Action Events.",
          next: "step-7",
        },
        {
          text: "Poll <code>Get Action Value</code> in the Tick event and check if the bool is true.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Polling works but is inefficient. Event-driven input is the proper Enhanced Input approach.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "blueprints",
      title: "Implementing Jump Logic",
      image_path: "assets/generated/InputActionNotResponding/step-8.png",
      prompt:
        "<p>You've added the Enhanced Action Events node with <code>IA_Jump</code>. Which trigger type should execute the <code>Jump</code> function?</p><p><strong>What is the correct connection?</strong></p>",
      choices: [
        {
          text: "Connect the <code>Triggered</code> execution pin to the <code>Jump</code> function call on the Character Movement Component.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. 'Triggered' fires when the action state is active. For instant actions like jump, this is ideal.",
          next: "step-9",
        },
        {
          text: "Connect the <code>Started</code> execution pin to call Jump when the key is first pressed.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. 'Started' also works for instant actions, but 'Triggered' is the standard convention.",
          next: "step-9",
        },
        {
          text: "Connect the <code>Completed</code> execution pin to jump when the key is released.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. 'Completed' fires on key release, which would delay the jump unnaturally.",
          next: "step-8",
        },
        {
          text: "Use all three pins to call Jump for maximum responsiveness.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Calling jump multiple times per press can cause issues. Use only one appropriate trigger.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "blueprints",
      title: "Testing the Input",
      image_path: "assets/generated/InputActionNotResponding/step-9.png",
      prompt:
        "<p>The setup is complete. You press <strong>Play in Editor</strong> and the spacebar. The jump works! But you want to add debug output to confirm the flow.</p><p><strong>Where should you add a Print String for debugging?</strong></p>",
      choices: [
        {
          text: "Add <code>Print String</code> right after the <code>Triggered</code> pin, before the Jump call, to log when input is received.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.05hrs. Logging before the action confirms input reception, helping isolate future issues.",
          next: "step-10",
        },
        {
          text: "Add <code>Print String</code> in the Player Controller's <code>BeginPlay</code> to confirm context is added.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Context logging is useful for setup verification, but action-level logging is more relevant.",
          next: "step-9",
        },
        {
          text: "Add <code>Print String</code> inside the Character Movement Component's internal code.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. You can't modify engine components. Debug at the Blueprint level.",
          next: "step-9",
        },
        {
          text: "Enable <code>Verbose</code> logging in Project Settings for Enhanced Input.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Verbose logging produces excessive output. Targeted Print Strings are more useful.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "blueprints",
      title: "Final Verification",
      image_path: "assets/generated/InputActionNotResponding/step-10.png",
      prompt:
        "<p>The jump works and logs correctly. As a final check, how do you verify this will work correctly in a packaged build?</p><p><strong>What is the best final verification?</strong></p>",
      choices: [
        {
          text: "Test in a <strong>Standalone Game</strong> (Alt+P) which simulates packaged behavior without full packaging.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Standalone runs separate from the editor, closely matching packaged behavior without the wait.",
          next: "conclusion",
        },
        {
          text: "Remove the <code>Print String</code> nodes before packaging to avoid log spam.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Good practice for release, but not a verification step. Test in Standalone first.",
          next: "step-10",
        },
        {
          text: "Package the game and test on the target platform immediately.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Packaging takes significant time. Standalone testing catches most issues faster.",
          next: "step-10",
        },
        {
          text: "Check the <strong>Session Frontend</strong> for any Enhanced Input warnings.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Session Frontend shows profiling data. For input verification, actual testing is better.",
          next: "step-10",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/InputActionNotResponding/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've resolved the Enhanced Input System issue and understand the complete setup flow.</p><h4>Key Takeaways:</h4><ul><li><code>Add Mapping Context</code> — Must be called at runtime via the Enhanced Input Subsystem</li><li><strong>Enhanced Input Local Player Subsystem</strong> — Provides the interface for managing input contexts</li><li><code>Input Mapping Context</code> — Defines which keys/buttons trigger which Input Actions</li><li><code>Enhanced Action Events</code> — Event-driven nodes that fire on Started/Triggered/Completed</li><li><strong>Priority</strong> — Determines which context wins when actions conflict (0 = standard gameplay)</li></ul>",
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
