/**
 * Scoring Module
 * Handles score calculations, time costs, and assessment logic
 */

const ScoringManager = (function () {
  // Default time costs per choice type (in hours)
  const DEFAULT_COSTS = {
    correct: 0.5,
    partial: 1.0,
    misguided: 1.5,
    wrong: 2.0,
  };

  /**
   * Get time cost for a choice type
   * @param {string} type - Choice type ('correct', 'partial', 'misguided', 'wrong')
   * @returns {number} Time cost in hours
   */
  function getTimeCost(type) {
    const costs = window.APP_CONFIG?.TIME_COSTS || DEFAULT_COSTS;
    return costs[type] || 0;
  }

  /**
   * Calculate ideal time for all scenarios
   * @param {Object} scenarios - The SCENARIOS object
   * @returns {Object} { totalSteps, idealTotalTime }
   */
  function calculateIdealTime(scenarios = window.SCENARIOS) {
    let totalSteps = 0;

    Object.values(scenarios || {}).forEach((scenario) => {
      if (scenario.steps) {
        totalSteps += Object.keys(scenario.steps).length;
      }
    });

    return {
      totalSteps,
      idealTotalTime: totalSteps * 0.5, // 0.5 hours per step
    };
  }

  /**
   * Determine color class based on logged vs estimate time
   * @param {number} logged - Logged hours
   * @param {number} estimate - Estimated hours
   * @returns {string} Tailwind color class
   */
  function getTimeColorClass(logged, estimate) {
    if (logged <= estimate) {
      return "text-green-400";
    }

    const overBudgetRatio = logged / estimate;

    if (overBudgetRatio <= 1.2) {
      return "text-yellow-400";
    } else if (overBudgetRatio <= 1.4) {
      return "text-orange-400";
    } else {
      return "text-red-400";
    }
  }

  /**
   * Calculate efficiency score
   * @param {number} idealTime - Ideal completion time
   * @param {number} actualTime - Actual logged time
   * @returns {number} Efficiency as decimal (0-1+)
   */
  function calculateEfficiency(idealTime, actualTime) {
    if (actualTime === 0) return 1;
    return idealTime / actualTime;
  }

  /**
   * Determine pass/fail status
   * @param {number} efficiency - Efficiency score
   * @returns {boolean} True if passed
   */
  function isPassing(efficiency) {
    const threshold = window.APP_CONFIG?.PASS_THRESHOLD || 0.8;
    return efficiency >= threshold;
  }

  /**
   * Generate test key from scenario state
   * @param {Object} state - The scenario state object
   * @returns {string} Base64 encoded test key
   */
  function generateTestKey(state) {
    const compactData = {};

    Object.keys(state).forEach((scenarioId) => {
      const scenarioState = state[scenarioId];
      if (
        scenarioState.choicesMade &&
        Object.keys(scenarioState.choicesMade).length > 0
      ) {
        compactData[scenarioId] = scenarioState.choicesMade;
      }
    });

    if (Object.keys(compactData).length === 0) {
      return "No Choices Recorded";
    }

    try {
      const jsonString = JSON.stringify(compactData);
      // Unicode-safe Base64 encoding
      const utf8Bytes = encodeURIComponent(jsonString).replace(
        /%([0-9A-F]{2})/g,
        (match, p1) => String.fromCharCode("0x" + p1)
      );
      return btoa(utf8Bytes);
    } catch (e) {
      console.error("[ScoringManager] Failed to generate test key:", e);
      return "ERROR_SERIALIZING_CHOICES";
    }
  }

  /**
   * Format time in hours to display string
   * @param {number} hours - Time in hours
   * @returns {string} Formatted string
   */
  function formatHours(hours) {
    if (hours === 1) return "1 hr";
    return `${hours.toFixed(1)} hrs`;
  }

  // Public API
  return {
    getTimeCost,
    calculateIdealTime,
    getTimeColorClass,
    calculateEfficiency,
    isPassing,
    generateTestKey,
    formatHours,
  };
})();

// Export for use in other modules
window.ScoringManager = ScoringManager;
