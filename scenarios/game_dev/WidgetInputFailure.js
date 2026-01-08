window.SCENARIOS["WidgetInputFailure"] = {
  meta: {
    title: "Widget Not Receiving Input",
    description:
      "A terminal interaction widget (UMG) appears on screen but doesn't respond to keyboard input or mouse clicks. The player can still move the character while the widget is visible. Input appears trapped in Game mode instead of routing to the UI.",
    estimateHours: 1.5,
    category: "UI",
    difficulty: "Intermediate",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "WidgetInputFailure",
      step: "step-0",
    },
  ],
  fault: {
    description:
      "Widget visible but unresponsive because Input Mode is Game Only.",
    visual_cue: "Widget on screen, character still moves, UI ignores clicks",
  },
  expected: {
    description: "Widget receives input after setting Input Mode Game and UI.",
    validation_action: "verify_input_mode",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "WidgetInputFailure",
      step: "step-3",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "ui",
      image_path: "assets/generated/WidgetInputFailure/step-1.png",
      title: "Diagnose Widget Input Failure",
      prompt:
        "<p>The terminal widget is visible on screen, but clicking buttons and typing has no effect. The character continues to move while the widget is displayed. How do you investigate this input routing issue?</p>",
      choices: [
        {
          text: "<p>Use <code>ShowDebug Input</code> console command to visualize current input mode and focus state.</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.1hrs. The debug overlay shows Input Mode is 'Game Only' and no widget has keyboard focus. This confirms input is routed to the game, not the UI.</p>",
          next: "step-2",
        },
        {
          text: "<p>Reparent the widget to a different container and adjust visibility settings.</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.3hrs. Reparenting and visibility tweaks don't affect input routing. The widget is clearly visible, so visibility isn't the issue.</p>",
          next: "step-1",
        },
        {
          text: "<p>Check if the widget's Z-Order is high enough in the viewport stack.</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.15hrs. Z-Order affects rendering priority, not input routing. Since the widget is visible, this isn't the primary issue.</p>",
          next: "step-1",
        },
        {
          text: "<p>Inspect the widget's Hit Test Invisible flag in the Designer.</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. Hit Test settings matter, but if the entire widget ignores input, the Player Controller's Input Mode is more likely the root cause.</p>",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "ui",
      image_path: "assets/generated/WidgetInputFailure/step-2.png",
      title: "Locate Input Mode Configuration",
      prompt:
        "<p>Debug overlay confirms Input Mode is 'Game Only'. You need to find where the widget is created and check if the Input Mode is being set. Where do you look?</p>",
      choices: [
        {
          text: "<p>Open the Blueprint that creates the widget and search for <code>Set Input Mode</code> nodes.</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.15hrs. You find the Create Widget and Add to Viewport nodes, but there's no Set Input Mode node after them. The controller stays in Game Only mode.</p>",
          next: "step-3",
        },
        {
          text: "<p>Check Project Settings for global UI input configuration.</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.25hrs. Project settings control defaults, but runtime input mode is set per-controller in Blueprint. This won't solve the immediate issue.</p>",
          next: "step-2",
        },
        {
          text: "<p>Inspect the Player Controller's default Input Mode property in its Blueprint.</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. The default mode is Game Only, which is correct for normal gameplay. The issue is not switching modes when the widget is shown.</p>",
          next: "step-2",
        },
        {
          text: "<p>Review the UMG widget's Focus settings in the Widget Designer.</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.12hrs. Focus settings matter, but the widget needs Game and UI mode enabled before it can receive focus at all.</p>",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "ui",
      image_path: "assets/generated/WidgetInputFailure/step-3.png",
      title: "Apply the Fix",
      prompt:
        "<p>The Blueprint creates the widget but never switches Input Mode. What's the correct fix to allow the widget to receive input while optionally allowing game input?</p>",
      choices: [
        {
          text: "<p>Add <code>Set Input Mode Game and UI</code> after adding the widget to viewport, passing the widget as the focus target.</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.2hrs. This is the correct fix. The node switches input routing to allow both game and UI input, and the widget parameter gives it keyboard focus.</p>",
          next: "step-4",
        },
        {
          text: "<p>Use <code>Set Input Mode UI Only</code> to force all input to the widget.</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. This works but blocks game input entirely. Use Game and UI if you want both, or UI Only for modal dialogs.</p>",
          next: "step-4",
        },
        {
          text: "<p>Enable 'Is Focusable' on the widget and call <code>Set Keyboard Focus</code> directly.</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.15hrs. Focus is important, but without changing Input Mode, the controller still routes input to the game first.</p>",
          next: "step-3",
        },
        {
          text: "<p>Create a custom input component to manually forward keystrokes to the widget.</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.5hrs. This is an overcomplicated workaround. UE5 has built-in Input Mode switching for exactly this purpose.</p>",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "ui",
      image_path: "assets/generated/WidgetInputFailure/step-4.png",
      title: "Verify the Fix",
      prompt:
        "<p>You've added Set Input Mode Game and UI after creating the widget. How do you verify the fix works correctly?</p>",
      choices: [
        {
          text: "<p>Play in Editor, trigger the widget, and confirm you can click buttons and type in text fields.</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.1hrs. In PIE, the terminal widget now responds to input - buttons click, text fields accept typing, and the mouse cursor appears over the widget.</p>",
          next: "conclusion",
        },
        {
          text: "<p>Use <code>ShowDebug Input</code> again to check the new Input Mode state.</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.05hrs. Good verification, but directly testing interaction is more practical. Debug shows 'Game and UI' mode is active.</p>",
          next: "conclusion",
        },
        {
          text: "<p>Inspect the widget's Focus state in the Hierarchy during PIE using Widget Reflector.</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. Widget Reflector confirms the terminal has keyboard focus, but direct interaction testing is simpler.</p>",
          next: "conclusion",
        },
        {
          text: "<p>Package the game and test on the target platform.</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.4hrs. Packaging is overkill for this verification. PIE is sufficient to confirm input routing works correctly.</p>",
          next: "step-4",
        },
      ],
    },
    conclusion: {
      skill: "ui",
      image_path: "assets/generated/WidgetInputFailure/conclusion.png",
      title: "Scenario Complete",
      prompt:
        "<p><strong>Lesson:</strong> When a UMG widget doesn't receive input, check the Player Controller's Input Mode. Use <code>Set Input Mode Game and UI</code> to allow both game and widget interaction, or <code>Set Input Mode UI Only</code> for modal interfaces. Always pass the widget as the focus target.</p>",
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
