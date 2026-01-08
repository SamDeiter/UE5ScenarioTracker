/**
 * State Management Module
 * Handles game state persistence and recovery for UE5 Scenario Tracker
 */

const StateManager = (function () {
  // Private state
  let scenarioState = {};
  let interruptedSteps = {};
  let currentScenarioId = null;
  let currentStepId = null;

  // Storage keys
  const STORAGE_KEYS = {
    STATE: "ue5ScenarioState",
    TIMER: "ue5ScenarioTimer",
    ACTIVE_SCENARIO: "ue5ActiveScenario",
    ACTIVE_STEP: "ue5ActiveStep",
    INTERRUPTED: "ue5InterruptedSteps",
  };

  /**
   * Safely parse JSON with error handling
   */
  function safeJSONParse(json, fallback = {}) {
    if (!json) return fallback;
    try {
      return JSON.parse(json);
    } catch (e) {
      console.error("[StateManager] JSON parse error:", e);
      return fallback;
    }
  }

  /**
   * Calculate time cost based on choice type
   */
  function getTimeCost(type) {
    const costs = window.APP_CONFIG?.TIME_COSTS || {
      correct: 0.5,
      partial: 1.0,
      misguided: 1.5,
      wrong: 2.0,
    };
    return costs[type] || 0;
  }

  /**
   * Load scenario state from localStorage
   */
  function loadState() {
    const savedJSON = localStorage.getItem(STORAGE_KEYS.STATE);
    const savedState = safeJSONParse(savedJSON, {});

    const newState = {};
    const scenarios = window.SCENARIOS || {};

    Object.keys(scenarios).forEach((scenarioId) => {
      const defaultState = {
        completed: false,
        loggedTime: 0,
        choicesMade: {},
      };

      newState[scenarioId] = {
        ...defaultState,
        ...(savedState[scenarioId] || {}),
      };

      // Recalculate logged time for consistency
      let recalculatedTime = 0;
      const scenario = scenarios[scenarioId];
      const choices = newState[scenarioId].choicesMade || {};

      if (scenario && scenario.steps) {
        Object.keys(choices).forEach((stepId) => {
          const choiceIndex = choices[stepId];
          const step = scenario.steps[stepId];
          if (step && step.choices && step.choices[choiceIndex]) {
            recalculatedTime += getTimeCost(step.choices[choiceIndex].type);
          }
        });
      }

      newState[scenarioId].loggedTime = recalculatedTime;
    });

    scenarioState = newState;
    saveState();

    console.log(
      "[StateManager] State loaded for",
      Object.keys(scenarioState).length,
      "scenarios"
    );
    return scenarioState;
  }

  /**
   * Save current state to localStorage
   */
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEYS.STATE, JSON.stringify(scenarioState));
    } catch (e) {
      console.error("[StateManager] Failed to save state:", e);
    }
  }

  /**
   * Reset all scenario progress
   */
  function resetAll() {
    scenarioState = {};
    const scenarios = window.SCENARIOS || {};

    Object.keys(scenarios).forEach((scenarioId) => {
      scenarioState[scenarioId] = {
        completed: false,
        loggedTime: 0,
        choicesMade: {},
      };
    });

    interruptedSteps = {};
    currentScenarioId = null;
    currentStepId = null;

    // Clear all storage
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });

    saveState();
    console.log("[StateManager] All state reset");
  }

  /**
   * Load interrupted steps from localStorage
   */
  function loadInterruptedSteps() {
    const savedJSON = localStorage.getItem(STORAGE_KEYS.INTERRUPTED);
    interruptedSteps = safeJSONParse(savedJSON, {});
    return interruptedSteps;
  }

  /**
   * Save current active ticket state
   */
  function saveActiveTicket() {
    if (currentScenarioId && currentStepId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SCENARIO, currentScenarioId);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_STEP, currentStepId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SCENARIO);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_STEP);
    }

    try {
      localStorage.setItem(
        STORAGE_KEYS.INTERRUPTED,
        JSON.stringify(interruptedSteps)
      );
    } catch (e) {
      console.error("[StateManager] Failed to save interrupted steps:", e);
    }
  }

  /**
   * Get saved active scenario info
   */
  function getActiveScenario() {
    return {
      scenarioId: localStorage.getItem(STORAGE_KEYS.ACTIVE_SCENARIO),
      stepId: localStorage.getItem(STORAGE_KEYS.ACTIVE_STEP),
    };
  }

  /**
   * Set current scenario
   */
  function setCurrentScenario(scenarioId, stepId) {
    currentScenarioId = scenarioId;
    currentStepId = stepId;

    if (scenarioId && stepId) {
      interruptedSteps[scenarioId] = stepId;
    }

    saveActiveTicket();
  }

  /**
   * Get scenario state by ID
   */
  function getScenarioState(scenarioId) {
    return scenarioState[scenarioId] || null;
  }

  /**
   * Update scenario state
   */
  function updateScenarioState(scenarioId, updates) {
    if (scenarioState[scenarioId]) {
      scenarioState[scenarioId] = {
        ...scenarioState[scenarioId],
        ...updates,
      };
      saveState();
    }
  }

  /**
   * Record a choice made
   */
  function recordChoice(scenarioId, stepId, choiceIndex, timeCost) {
    if (scenarioState[scenarioId]) {
      scenarioState[scenarioId].choicesMade[stepId] = choiceIndex;
      scenarioState[scenarioId].loggedTime += timeCost;
      saveState();
    }
  }

  /**
   * Mark scenario as complete
   */
  function completeScenario(scenarioId) {
    if (scenarioState[scenarioId]) {
      scenarioState[scenarioId].completed = true;
      delete interruptedSteps[scenarioId];
      saveState();
      saveActiveTicket();
    }
  }

  /**
   * Check if all scenarios are complete
   */
  function areAllComplete() {
    return Object.values(scenarioState).every((s) => s.completed);
  }

  /**
   * Get total logged time across all scenarios
   */
  function getTotalLoggedTime() {
    return Object.values(scenarioState).reduce(
      (acc, s) => acc + (s.loggedTime || 0),
      0
    );
  }

  /**
   * Get all state (for serialization)
   */
  function getAllState() {
    return { ...scenarioState };
  }

  /**
   * Get current scenario info
   */
  function getCurrentScenario() {
    return {
      scenarioId: currentScenarioId,
      stepId: currentStepId,
    };
  }

  /**
   * Clear current scenario
   */
  function clearCurrentScenario() {
    currentScenarioId = null;
    currentStepId = null;
    saveActiveTicket();
  }

  /**
   * Get interrupted step for a scenario
   */
  function getInterruptedStep(scenarioId) {
    return interruptedSteps[scenarioId] || null;
  }

  // Public API
  return {
    loadState,
    saveState,
    resetAll,
    loadInterruptedSteps,
    saveActiveTicket,
    getActiveScenario,
    setCurrentScenario,
    getCurrentScenario,
    clearCurrentScenario,
    getScenarioState,
    updateScenarioState,
    recordChoice,
    completeScenario,
    areAllComplete,
    getTotalLoggedTime,
    getAllState,
    getInterruptedStep,
    getTimeCost,
    STORAGE_KEYS,
  };
})();

// Export for use in other modules
window.StateManager = StateManager;
