window.SCENARIOS["smoke_test"] = {
  id: "smoke_test",
  category: "System",
  meta: {
    title: "Golden Path Smoke Test",
    category: "System",
    description:
      "A minimal end-to-end test to verify the Scenario -> Recipe -> Python pipeline.",
    estimateHours: 0.1,
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "smoke_test",
      step: "setup-step",
    },
  ],
  fault: {
    description: "System is uninitialized.",
    visual_cue: "Empty scene",
  },
  expected: {
    description: "Actor is spawned, property is set, viewport is focused.",
    validation_action: "verify_smoke_success",
  },
  fix: [],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "system",
      title: "Verifying Pipeline",
      prompt:
        "<p>The system is attempting to spawn a Test Cube and focus it. Did it work?</p>",
      onEnter: [
        {
          action: "set_ue_property",
          scenario: "smoke_test",
          step: "step-1",
        },
      ],
      choices: [
        {
          text: "Yes, I see the cube!",
          type: "correct",
          feedback: "Golden Path verified.",
          next: "conclusion",
        },
        {
          text: "No, check logs.",
          type: "subtle",
          feedback: "Check UE5 Output Log for [AutomationExecutor] errors.",
          next: "step-1",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Smoke Test Complete",
      prompt: "<p>The full pipeline is operational.</p>",
      choices: [
        {
          text: "Finish",
          type: "correct",
          next: "end",
        },
      ],
    },
  },
};
