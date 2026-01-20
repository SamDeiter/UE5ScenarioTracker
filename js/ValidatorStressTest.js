/**
 * ValidatorStressTest.js
 * Intentionally broken scenarios to prove the Validator "fails loudly".
 */
const INVALID_SCENARIOS = {
  missing_step_ref: {
    id: "missing_step_ref",
    meta: { title: "Broken: Missing Step Ref" },
    start: "step-1",
    steps: {
      "step-1": {
        choices: [{ text: "Go to non-existent", next: "step-999" }],
      },
    },
  },
  duplicate_step_ids: {
    id: "duplicate_step_ids",
    meta: { title: "Broken: Duplicate IDs" },
    start: "step-1",
    steps: {
      "step-1": { title: "One" },
      "step-1": { title: "Duplicate" }, // JS will just overwrite, but Validator should check schema keys
    },
  },
  invalid_action: {
    id: "invalid_action",
    meta: { title: "Broken: Invalid Action" },
    start: "step-1",
    steps: {
      "step-1": {
        onEnter: [{ action: "NON_EXISTENT_ACTION" }],
      },
    },
  },
  missing_params: {
    id: "missing_params",
    meta: { title: "Broken: Missing Params" },
    start: "step-1",
    steps: {
      "step-1": {
        onEnter: [{ action: "set_ue_property" }], // Missing scenario/step
      },
    },
  },
};

function runValidatorTorture() {
  console.group("Validator Torture Test");
  for (const [id, scenario] of Object.entries(INVALID_SCENARIOS)) {
    console.log(`Testing: ${id}`);
    const result = Validator.validateScenario(id, scenario);
    if (result.valid) {
      console.error(`❌ FAILED: Validator allowed invalid scenario: ${id}`);
    } else {
      console.log(
        `✅ PASSED: Validator caught errors in ${id}:`,
        result.errors
      );
    }
  }
  console.groupEnd();
}

// Auto-run if in test mode
if (window.location.search.includes("test=true")) {
  setTimeout(runValidatorTorture, 1000);
}
