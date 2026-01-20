/**
 * Debug Navigation Module
 * Provides debug step navigation controls for testing scenarios
 */

const DebugNavigation = (function () {
  // Private state
  let _getCurrentState = null;
  let _renderStep = null;

  /**
   * Initialize the debug navigation with required callbacks
   * @param {Object} options
   * @param {Function} options.getState - Function returning { currentScenarioId, currentStepId }
   * @param {Function} options.setState - Function to update currentStepId
   * @param {Function} options.renderStep - Function to render a step
   */
  function init(options) {
    _getCurrentState = options.getState;
    _renderStep = options.renderStep;

    // Attach event listeners
    document
      .getElementById("debug-prev-step")
      ?.addEventListener("click", () => navigate("prev"));
    document
      .getElementById("debug-next-step")
      ?.addEventListener("click", () => navigate("next"));
    document
      .getElementById("debug-skip-to-end")
      ?.addEventListener("click", () => navigate("end"));
  }

  /**
   * Navigate to a different step in debug mode
   * @param {string} dir - Direction: 'prev', 'next', or 'end'
   */
  function navigate(dir) {
    if (!_getCurrentState) return;

    const state = _getCurrentState();
    const { currentScenarioId, currentStepId } = state;

    if (!currentScenarioId) return;

    const scenario = window.SCENARIOS[currentScenarioId];
    if (!scenario?.steps) return;

    const keys = Object.keys(scenario.steps);
    const idx = keys.indexOf(currentStepId);
    let newStep = currentStepId;

    if (dir === "prev" && idx > 0) {
      newStep = keys[idx - 1];
    }
    if (dir === "next" && idx < keys.length - 1) {
      newStep = keys[idx + 1];
    }
    if (dir === "end") {
      newStep = scenario.steps["conclusion"]
        ? "conclusion"
        : keys[keys.length - 1];
    }

    if (newStep !== currentStepId && _renderStep) {
      _renderStep(currentScenarioId, newStep);

      // Update debug display
      const el = document.getElementById("debug-current-step");
      if (el) el.textContent = newStep;

      console.log("[DebugNav] Navigated to:", newStep);
    }
  }

  // Public API
  return {
    init,
    navigate,
  };
})();

// Export for use in other modules
window.DebugNavigation = DebugNavigation;
console.log("[DebugNavigation] Module loaded");
