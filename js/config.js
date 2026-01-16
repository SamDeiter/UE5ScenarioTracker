/**
 * UE5 Scenario Tracker - Application Configuration
 *
 * This module provides centralized configuration for the application.
 * Sensitive values like passwords should be set via environment variables
 * or server-side configuration in production.
 */

window.APP_CONFIG = {
  // Debug mode password - In production, this should be set server-side
  // or disabled entirely. Default is secure placeholder.
  DEBUG_PASSWORD: "CHANGEME",

  // Timer settings
  TOTAL_TEST_TIME_SECONDS: 30 * 60, // 30 minutes
  LOW_TIME_WARNING_SECONDS: 5 * 60, // 5 minutes warning

  // Scoring
  PASS_THRESHOLD: 0.8, // 80% to pass

  // Time costs per choice type (in hours)
  TIME_COSTS: {
    correct: 0.5,
    partial: 1.0,
    misguided: 1.5,
    wrong: 2.0,
  },

  // Feature flags
  FEATURES: {
    enableDebugMode: true,
    enableScormTracking: true,
    showTimerByDefault: true,
  },

  // Time budget thresholds for color coding
  TIME_BUDGET_THRESHOLDS: {
    excellent: 1.2, // <= 120% of budget = green
    acceptable: 1.4, // <= 140% of budget = yellow
    // > 140% = red
  },

  // UE5 Connection settings
  UE5_CONNECTION: {
    retryDelayMs: 30000, // 30 seconds before retrying
    timeoutMs: 500, // 500ms timeout for faster failure
  },
};

// Allow environment override (for local development)
// In production, this could be replaced with server-side values
if (typeof process !== "undefined" && process.env) {
  if (process.env.DEBUG_PASSWORD) {
    window.APP_CONFIG.DEBUG_PASSWORD = process.env.DEBUG_PASSWORD;
  }
}

console.log("[Config] Application configuration loaded");

// Handle URL parameter for direct scenario launch
(function () {
  const params = new URLSearchParams(window.location.search);
  const scenarioId = params.get("scenario");

  if (scenarioId) {
    console.log(`[Config] Auto-start scenario requested: ${scenarioId}`);
    window.APP_CONFIG.AUTO_START_SCENARIO = scenarioId;

    // Wait for DOM and scenarios to load, then auto-start
    window.addEventListener("load", function () {
      setTimeout(function () {
        const scenario = window.SCENARIOS?.[scenarioId];
        if (scenario && window.ScenarioEngine) {
          console.log(`[Config] Auto-starting scenario: ${scenarioId}`);

          // Hide backlog and show game view
          const backlogView = document.getElementById("backlog-view");
          const gameView = document.getElementById("game-view");
          if (backlogView) backlogView.classList.add("hidden");
          if (gameView) gameView.classList.remove("hidden");

          // Start the scenario
          window.ScenarioEngine.load(scenarioId, scenario);

          // Render first step if StepRenderer exists
          if (window.StepRenderer) {
            const step = window.ScenarioEngine.getCurrentStep();
            if (step) {
              const container = document.getElementById("step-container");
              if (container) window.StepRenderer.render(step, container);
            }
          }
        } else {
          console.warn(`[Config] Scenario not found: ${scenarioId}`);
        }
      }, 500); // Give time for scripts to initialize
    });
  }
})();
