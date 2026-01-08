/**
 * GameState.js
 * Centralized state management for the UE5 Scenario Tracker game.
 * All modules share state through this singleton.
 */

window.GameState = {
  // --- Configuration ---
  config: window.APP_CONFIG || {},
  TOTAL_TEST_TIME_SECONDS:
    window.APP_CONFIG?.TOTAL_TEST_TIME_SECONDS || 30 * 60,
  LOW_TIME_WARNING_SECONDS:
    window.APP_CONFIG?.LOW_TIME_WARNING_SECONDS || 5 * 60,

  // --- Core State ---
  scenarioState: {},
  currentScenarioId: null,
  currentStepId: null,
  interruptedSteps: {},

  // --- UI State ---
  isDebugMode: false,
  isProcessingChoice: false,
  currentCategoryFilter: "all",

  // --- Timer State ---
  timeRemaining: 30 * 60,
  mainTimerInterval: null,

  // --- Caches ---
  shuffledChoicesCache: {},

  // --- DOM Element References ---
  elements: {
    ticketPanelContainer: null,
    ticketStepContent: null,
    backlogList: null,
    mainTimerDisplay: null,
    startButton: null,
    resetButton: null,
    debugPanel: null,
    debugToggle: null,
    tabNavigationContainer: null,
  },

  // --- State Mutation Methods ---

  /**
   * Set the current active scenario and step
   */
  setCurrentScenario(scenarioId, stepId) {
    this.currentScenarioId = scenarioId;
    this.currentStepId = stepId;

    if (scenarioId && stepId) {
      this.interruptedSteps[scenarioId] = stepId;
    }
  },

  /**
   * Clear the current scenario selection
   */
  clearCurrentScenario() {
    this.currentScenarioId = null;
    this.currentStepId = null;
  },

  /**
   * Get scenario state for a specific scenario
   */
  getScenarioState(scenarioId) {
    return this.scenarioState[scenarioId] || null;
  },

  /**
   * Update scenario state
   */
  updateScenarioState(scenarioId, updates) {
    if (this.scenarioState[scenarioId]) {
      this.scenarioState[scenarioId] = {
        ...this.scenarioState[scenarioId],
        ...updates,
      };
    }
  },

  /**
   * Check if all scenarios are complete
   */
  areAllComplete() {
    return Object.values(this.scenarioState).every((s) => s.completed);
  },

  /**
   * Get total logged time across all scenarios
   */
  getTotalLoggedTime() {
    return Object.values(this.scenarioState).reduce(
      (acc, s) => acc + (s.loggedTime || 0),
      0
    );
  },

  /**
   * Reset all state to initial values
   */
  resetAll() {
    this.scenarioState = {};
    this.currentScenarioId = null;
    this.currentStepId = null;
    this.interruptedSteps = {};
    this.shuffledChoicesCache = {};
    this.timeRemaining = this.TOTAL_TEST_TIME_SECONDS;

    // Re-initialize scenario states
    Object.keys(window.SCENARIOS || {}).forEach((id) => {
      this.scenarioState[id] = {
        completed: false,
        loggedTime: 0,
        choicesMade: {},
      };
    });
  },

  /**
   * Cache DOM element references
   */
  cacheElements() {
    this.elements = {
      ticketPanelContainer: document.getElementById("ticket-panel-container"),
      ticketStepContent: document.getElementById("ticket-step-content"),
      backlogList: document.getElementById("backlog-list"),
      mainTimerDisplay: document.getElementById("main-timer-display"),
      startButton: document.getElementById("start-button"),
      resetButton: document.getElementById("reset-button"),
      debugPanel: document.getElementById("debug-panel"),
      debugToggle: document.getElementById("debug-toggle"),
      tabNavigationContainer: document.getElementById(
        "tab-navigation-container"
      ),
    };
  },
};

console.log("[GameState] Module loaded");
