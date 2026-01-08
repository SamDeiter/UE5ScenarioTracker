/**
 * ActionRegistry.js
 * Centralizes all executable side-effects for scenarios.
 * This ensures scenarios remain data-driven and don't execute logic directly.
 */

window.ActionRegistry = {
  _actions: {},

  /**
   * Register a new action handler
   * @param {string} key - Unique action identifier
   * @param {Object} handler - Handler definition with validate and execute methods
   */
  register(key, handler) {
    if (this._actions[key]) {
      console.warn(
        `[ActionRegistry] Action "${key}" is already registered. Overwriting.`
      );
    }
    this._actions[key] = handler;
  },

  /**
   * Validate an action step
   * @param {Object} step - The action object from scenario data
   * @returns {string|null} - Error message or null if valid
   */
  validate(step) {
    if (!step.action) return "Missing 'action' key in step.";
    const handler = this._actions[step.action];
    if (!handler) return `Unknown action: "${step.action}"`;
    if (handler.validate) return handler.validate(step);
    return null;
  },

  /**
   * Execute an action
   * @param {Object} step - The action object from scenario data
   * @returns {Promise<void>}
   */
  async execute(step) {
    const handler = this._actions[step.action];
    if (!handler) {
      throw new Error(
        `[ActionRegistry] Cannot execute unknown action: ${step.action}`
      );
    }
    console.log(`[ActionRegistry] Executing: ${step.action}`, step);
    return await handler.execute(step);
  },
};

// --- CORE ACTION HANDLERS ---

// Action: set_ue_property
// Uses the Remote Control API to execute a recipe via AutomationExecutor.py
ActionRegistry.register("set_ue_property", {
  validate(params) {
    if (!params.scenario) return "set_ue_property requires 'scenario'";
    if (!params.step) return "set_ue_property requires 'step'";
    return null;
  },
  async execute(params) {
    // 1. Ensure recipe is loaded
    await RecipeRegistry.loadRecipe(params.scenario);

    // 2. Get actions for this step
    const actions = RecipeRegistry.getActions(params.scenario, params.step);
    if (actions.length === 0) {
      console.warn(
        `[ActionRegistry] No recipe actions found for ${params.scenario}/${params.step}`
      );
      return;
    }

    // 3. Prepare Python payload
    const payload = JSON.stringify({ actions: actions });
    const cmd = `import AutomationExecutor; import importlib; importlib.reload(AutomationExecutor); AutomationExecutor.run_recipe(${payload})`;

    try {
      const response = await fetch("http://localhost:30010/remote/execution", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: cmd }),
      });
      if (!response.ok) throw new Error(`UE5 HTTP Error: ${response.status}`);
      console.log(`[ActionRegistry] UE5 recipe executed for ${params.step}`);
    } catch (err) {
      console.warn(
        "[ActionRegistry] UE5 Connection failed. Action ignored.",
        err
      );
    }
  },
});

// Action: show_feedback
// Triggers a UI notification or feedback message
ActionRegistry.register("show_feedback", {
  execute(params) {
    console.info(`[Feedback] ${params.message}`);
    // Integration with game UI would happen here or via event
  },
});
