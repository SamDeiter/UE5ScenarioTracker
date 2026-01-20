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

// Action: set_ue_property
// Uses the Remote Control API to execute a recipe via AutomationExecutor.py
// Performance: Uses 500ms timeout + 30s cache to avoid blocking UI when UE5 is offline

// Connection state cache
let ue5ConnectionFailed = false;
let ue5FailedAt = 0;
const ue5Config = window.APP_CONFIG?.UE5_CONNECTION || {};
const UE5_RETRY_DELAY = ue5Config.retryDelayMs || 30000; // 30 seconds before retrying failed connection
const UE5_TIMEOUT_MS = ue5Config.timeoutMs || 500; // 500ms timeout for faster failure

ActionRegistry.register("set_ue_property", {
  validate(params) {
    if (!params.scenario) return "set_ue_property requires 'scenario'";
    if (!params.step) return "set_ue_property requires 'step'";
    return null;
  },
  async execute(params) {
    // Skip if we know UE5 is offline (cache for 30s)
    if (ue5ConnectionFailed && Date.now() - ue5FailedAt < UE5_RETRY_DELAY) {
      console.log(
        "[ActionRegistry] Skipping UE5 action - connection cached as offline"
      );
      return;
    }

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

    // 4. Create abort controller with 500ms timeout for fast failure
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), UE5_TIMEOUT_MS);

    try {
      const response = await fetch("http://localhost:30010/remote/execution", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: cmd }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) throw new Error(`UE5 HTTP Error: ${response.status}`);

      // Reset failure state on success
      ue5ConnectionFailed = false;
      console.log(`[ActionRegistry] UE5 recipe executed for ${params.step}`);
    } catch (err) {
      clearTimeout(timeout);

      // Cache the failure to skip future attempts for 30s
      ue5ConnectionFailed = true;
      ue5FailedAt = Date.now();

      console.warn(
        "[ActionRegistry] UE5 Connection failed. Action ignored.",
        err.name === "AbortError" ? "(timeout)" : err
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
