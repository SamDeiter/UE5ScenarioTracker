/**
 * Test Utilities Module
 * Contains debugging and testing helper functions
 */

const TestUtils = (function () {
  /**
   * Tests that the UI state is consistent with the game state.
   * Call this from the browser console: TestUtils.runUIChecks()
   * @param {Object} options - Test options
   * @param {string|null} options.currentScenarioId - Current active scenario
   * @param {Object} options.scenarioState - Current scenario state
   * @returns {boolean} True if all checks pass.
   */
  function runUIChecks(options = {}) {
    const { currentScenarioId, scenarioState } = options;
    let passed = true;
    console.log("🧪 Running UI State Tests...");

    // Test 1: Active scenario highlighting
    if (currentScenarioId) {
      const activeCard = document.querySelector(
        `[data-scenario-id="${currentScenarioId}"]`
      );
      if (!activeCard) {
        console.error("❌ TEST FAILED: Active scenario card not found in DOM");
        passed = false;
      } else if (!activeCard.classList.contains("active")) {
        console.error(
          '❌ TEST FAILED: Active scenario card does not have "active" class'
        );
        passed = false;
      } else {
        console.log("✅ Active scenario card is correctly highlighted");
      }
    } else {
      console.log("ℹ️ No active scenario - skipping highlight test");
    }

    // Test 2: Placeholder vs Content visibility
    const placeholder = document.getElementById("ticket-placeholder");
    const content = document.getElementById("ticket-content");
    if (currentScenarioId) {
      if (placeholder && !placeholder.classList.contains("hidden")) {
        console.error(
          "❌ TEST FAILED: Placeholder is visible when scenario is active"
        );
        passed = false;
      }
      if (content && content.classList.contains("hidden")) {
        console.error(
          "❌ TEST FAILED: Content is hidden when scenario is active"
        );
        passed = false;
      }
      if (
        placeholder?.classList.contains("hidden") &&
        !content?.classList.contains("hidden")
      ) {
        console.log(
          "✅ View visibility is correct (content shown, placeholder hidden)"
        );
      }
    } else {
      if (placeholder && placeholder.classList.contains("hidden")) {
        console.error(
          "❌ TEST FAILED: Placeholder is hidden when no scenario is active"
        );
        passed = false;
      }
      if (content && !content.classList.contains("hidden")) {
        console.error(
          "❌ TEST FAILED: Content is visible when no scenario is active"
        );
        passed = false;
      }
      if (
        !placeholder?.classList.contains("hidden") &&
        content?.classList.contains("hidden")
      ) {
        console.log(
          "✅ View visibility is correct (placeholder shown, content hidden)"
        );
      }
    }

    // Test 3: Scenario state consistency
    const scenarioCount = Object.keys(window.SCENARIOS || {}).length;
    const stateCount = Object.keys(scenarioState || {}).length;
    if (scenarioCount !== stateCount) {
      console.warn(
        `⚠️ WARNING: Scenario count (${scenarioCount}) does not match state count (${stateCount})`
      );
    } else {
      console.log(
        `✅ Scenario state count matches (${scenarioCount} scenarios)`
      );
    }

    console.log(passed ? "🎉 All UI tests passed!" : "❌ Some UI tests failed");
    return passed;
  }

  /**
   * Log current game state to console
   */
  function logGameState(state) {
    console.group("🎮 Current Game State");
    console.log("Scenarios:", Object.keys(state || {}).length);
    console.log(
      "Completed:",
      Object.values(state || {}).filter((s) => s.completed).length
    );
    console.log(
      "Total Time Logged:",
      Object.values(state || {})
        .reduce((acc, s) => acc + (s.loggedTime || 0), 0)
        .toFixed(1),
      "hrs"
    );
    console.groupEnd();
  }

  // Public API
  return {
    runUIChecks,
    logGameState,
  };
})();

// Export for use in other modules
window.TestUtils = TestUtils;
