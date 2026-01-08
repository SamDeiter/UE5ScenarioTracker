/**
 * ScenarioEngine.js
 * Central execution engine for the UE5 Scenario Tracker.
 * Manages the lifecycle of a scenario and routes actions to the Registry.
 */

window.ScenarioEngine = {
  _currentScenario: null,
  _currentStepId: null,
  _state: {},

  /**
   * Initialize and load a scenario
   * @param {string} id - Scenario ID
   * @param {Object} definition - Standardized scenario data
   */
  async load(id, definition) {
    // 1. Validate
    const report = Validator.validateScenario(id, definition);
    if (!report.valid) {
      Validator.reportErrors(id, report.errors);
      return null;
    }

    console.log(`[ScenarioEngine] Loading Scenario: ${id}`);
    this._currentScenario = { id, ...definition };
    this._currentStepId = definition.start || "step-0";
    this._state = {
      startTime: Date.now(),
      loggedTime: 0,
      completed: false,
      choices: {},
    };

    // 2. Run Setup Actions
    await this._executeActionList(definition.setup);

    return this.getCurrentStep();
  },

  /**
   * Select a choice and progress the scenario
   * @param {number} choiceIndex - Index of choice in the current step
   */
  async makeChoice(choiceIndex) {
    const step = this.getCurrentStep();

    // Safeguard: If no scenario or step is loaded, return a valid navigation object
    if (!step) {
      console.warn(
        "[ScenarioEngine] No current step loaded, returning fallback"
      );
      return { type: "step", step: { id: null } };
    }

    const choice = step.choices ? step.choices[choiceIndex] : null;

    if (!choice) {
      console.warn(`[ScenarioEngine] Invalid choice index: ${choiceIndex}`);
      return { type: "step", step: step };
    }

    // 1. Record choice
    this._state.choices[this._currentStepId] = choiceIndex;

    // 2. Execute choice-specific actions if any
    if (choice.actions) {
      await this._executeActionList(choice.actions);
    }

    // 3. Navigate
    const nextId = choice.next;
    if (nextId === "end") {
      this._state.completed = true;
      return { type: "complete", state: this._state };
    }

    this._currentStepId = nextId;
    const nextStep = this.getCurrentStep();

    // 4. Run onEnter actions
    if (nextStep.onEnter) {
      await this._executeActionList(nextStep.onEnter);
    }

    return { type: "step", step: nextStep };
  },

  getCurrentStep() {
    if (!this._currentScenario) return null;
    const step = this._currentScenario.steps[this._currentStepId];
    if (!step) return null;
    // Include the step ID in the returned object for navigation
    return { ...step, id: this._currentStepId };
  },

  async _executeActionList(actions) {
    if (!actions || !Array.isArray(actions)) return;
    for (const action of actions) {
      await ActionRegistry.execute(action);
    }
  },
};
