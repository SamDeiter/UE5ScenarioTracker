window.SCENARIOS["InputActionNotResponding"] = {
  meta: {
    title: "Input Action Not Responding in Enhanced Input System",
    description:
      "A player presses the jump key but nothing happens in-game. The Enhanced Input System is configured but the action never fires.",
    estimateHours: 0.5,
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
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Legacy input and Enhanced Input are separate systems. If using Enhanced Input, check its configuration instead.",
          next: "step-1",
        },
        {
          text: "Rebuild the player Blueprint to ensure input components initialize properly.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Recompiling won't fix configuration issues. The problem is Mapping Context not being applied.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "blueprints",
      title: "Fixing the Mapping Context",
      image_path: "assets/generated/InputActionNotResponding/step-2.png",
      prompt:
        "<p>You check the player controller's <code>BeginPlay</code> event and find no <code>Add Mapping Context</code> node. You need to add it properly.</p><p><strong>What is the correct implementation?</strong></p>",
      choices: [
        {
          text: "Get the <strong>Enhanced Input Local Player Subsystem</strong>, then call <code>Add Mapping Context</code> with your IMC asset and priority <code>0</code>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The subsystem manages input contexts. Priority 0 is standard for primary gameplay inputs.",
          next: "step-3",
        },
        {
          text: "Call <code>Add Mapping Context</code> directly on the <strong>Player Controller</strong> component.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Player Controller doesn't have this function directly. You must access the Enhanced Input Subsystem.",
          next: "step-2",
        },
        {
          text: "Set the <code>Default Mapping Context</code> property in the <strong>Player Controller</strong> class defaults.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. There's no Default Mapping Context property on controllers. Contexts must be added via the subsystem.",
          next: "step-2",
        },
        {
          text: "Add the Mapping Context in the <strong>Game Mode</strong> Blueprint instead of the player controller.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Mapping Contexts are player-specific and should be added via the player's Enhanced Input Subsystem.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "blueprints",
      title: "Binding the Action",
      image_path: "assets/generated/InputActionNotResponding/step-3.png",
      prompt:
        "<p>The Mapping Context is now added. You need to bind the action to functionality. Where do you implement the response to the input action?</p><p><strong>What is the best approach?</strong></p>",
      choices: [
        {
          text: "In the character Blueprint, use the <code>Enhanced Action Events</code> node with your Input Action asset to trigger jump logic.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Enhanced Action Events provide Started, Triggered, and Completed callbacks for precise input handling.",
          next: "step-4",
        },
        {
          text: "Use the legacy <code>InputAction Jump</code> event node in the character Blueprint.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Legacy input nodes don't work with Enhanced Input actions. Use Enhanced Action Events instead.",
          next: "step-3",
        },
        {
          text: "Create a custom event and call it from the <strong>Input Mapping Context</strong> asset directly.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Mapping Contexts define bindings, not logic execution. Actions fire events that Blueprints respond to.",
          next: "step-3",
        },
        {
          text: "Poll the input action value every tick using <code>Get Action Value</code> in the character's <code>Tick</code> event.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Polling works but is inefficient. Event-driven input with Enhanced Action Events is the proper approach.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "blueprints",
      title: "Verification",
      image_path: "assets/generated/InputActionNotResponding/step-4.png",
      prompt:
        "<p>You've added the Mapping Context and bound the action event. How do you verify everything works correctly?</p><p><strong>What is the best verification approach?</strong></p>",
      choices: [
        {
          text: "Press <strong>Play in Editor</strong>, press the spacebar, and confirm the character jumps. Add a <code>Print String</code> node to confirm the event fires.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.05hrs. Visual confirmation plus debug output ensures both the input and the response logic are working.",
          next: "conclusion",
        },
        {
          text: "Check the <strong>Input Debugger</strong> window to see if the action is registered.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. The Input Debugger shows registration, but testing the actual functionality in PIE is more complete.",
          next: "step-4",
        },
        {
          text: "Review the <strong>Output Log</strong> for any Enhanced Input system messages.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Enhanced Input doesn't log action fires by default. Active testing is required.",
          next: "step-4",
        },
        {
          text: "Package the game and test on a separate machine to rule out editor-specific issues.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Packaging is excessive for basic input verification. PIE testing is sufficient.",
          next: "step-4",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/InputActionNotResponding/conclusion.png",
      prompt:
        "<p><strong>Great job!</strong></p><p>You've resolved the Enhanced Input System issue.</p><h4>Key Takeaways:</h4><ul><li><code>Add Mapping Context</code> — Must be called at runtime to enable input actions</li><li><strong>Enhanced Input Local Player Subsystem</strong> — Manages input contexts per player</li><li><code>Enhanced Action Events</code> — Event-driven response to input actions</li><li><strong>Priority</strong> — Determines which context takes precedence when actions conflict</li></ul>",
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
