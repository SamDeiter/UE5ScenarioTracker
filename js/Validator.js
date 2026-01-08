/**
 * Validator.js
 * Enforces structural correctness of scenario objects.
 * Prevents silent failures by providing loud and early error reporting.
 */

window.Validator = {
  /**
   * Validates a scenario object against the canonical shape
   * @param {string} id - Scenario unique ID
   * @param {Object} scenario - The scenario data object
   * @returns {Object} - { valid: boolean, errors: string[] }
   */
  validateScenario(id, scenario) {
    const errors = [];

    // 1. Basic Metadata
    if (!scenario.meta) {
      errors.push(`Scenario "${id}" is missing "meta" object.`);
    } else {
      if (!scenario.meta.title)
        errors.push(`Scenario "${id}" meta is missing "title".`);
      if (!scenario.meta.category)
        errors.push(`Scenario "${id}" meta is missing "category".`);
      if (typeof scenario.meta.estimateHours !== "number")
        errors.push(`Scenario "${id}" meta "estimateHours" must be a number.`);
    }

    // 2. Lifecycle Phases (optional - many older scenarios don't have these)
    // These are only used for UE5 Remote Control integration, not core gameplay
    // if (!scenario.setup)
    //   errors.push(`Scenario "${id}" is missing "setup" array.`);
    // if (!scenario.fault)
    //   errors.push(
    //     `Scenario "${id}" is missing "fault" object (initial problem).`
    //   );
    // if (!scenario.fix)
    //   errors.push(
    //     `Scenario "${id}" is missing "fix" array (expected solution actions).`
    //   );

    // 3. Steps Validation
    if (!scenario.steps || typeof scenario.steps !== "object") {
      errors.push(`Scenario "${id}" is missing "steps" map.`);
    } else {
      const stepIds = Object.keys(scenario.steps);
      Object.entries(scenario.steps).forEach(([stepId, step]) => {
        this._validateStep(id, stepId, step, errors, stepIds);
      });
    }

    return {
      valid: errors.length === 0,
      errors: errors,
    };
  },

  _validateStep(scenarioId, stepId, step, errors, stepIds) {
    if (!step.title) errors.push(`[${scenarioId}:${stepId}] Missing "title".`);
    if (!step.prompt)
      errors.push(`[${scenarioId}:${stepId}] Missing "prompt".`);
    if (!Array.isArray(step.choices) || step.choices.length === 0) {
      errors.push(`[${scenarioId}:${stepId}] Must have at least one choice.`);
    } else {
      step.choices.forEach((choice, idx) => {
        if (!choice.text)
          errors.push(
            `[${scenarioId}:${stepId}] Choice ${idx} missing "text".`
          );
        if (!choice.type)
          errors.push(
            `[${scenarioId}:${stepId}] Choice ${idx} missing "type".`
          );
        if (!choice.next) {
          errors.push(
            `[${scenarioId}:${stepId}] Choice ${idx} missing "next".`
          );
        } else if (
          choice.next !== "end" &&
          choice.next !== "conclusion" &&
          !stepIds.includes(choice.next)
        ) {
          errors.push(
            `[${scenarioId}:${stepId}] Choice ${idx} points to non-existent step: "${choice.next}".`
          );
        }
      });
    }

    // Validate Actions if present
    if (step.onEnter) {
      step.onEnter.forEach((action) => {
        const err = ActionRegistry.validate(action);
        if (err) errors.push(`[${scenarioId}:${stepId} onEnter] ${err}`);
      });
    }
  },

  /**
   * Fail loudly on validation errors
   */
  reportErrors(id, errors) {
    const msg = `❌ SCENARIO VALIDATION FAILED: ${id}\n\n` + errors.join("\n");
    console.error(msg);

    // Show in UI if possible
    const board = document.getElementById("jira-board");
    if (board) {
      const errDiv = document.createElement("div");
      errDiv.className =
        "bg-red-900/50 border border-red-500 p-4 m-4 rounded text-red-200 font-mono text-xs whitespace-pre";
      errDiv.innerText = msg;
      board.prepend(errDiv);
    }
  },
};
