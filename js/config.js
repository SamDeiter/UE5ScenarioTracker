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
};

// Allow environment override (for local development)
// In production, this could be replaced with server-side values
if (typeof process !== "undefined" && process.env) {
  if (process.env.DEBUG_PASSWORD) {
    window.APP_CONFIG.DEBUG_PASSWORD = process.env.DEBUG_PASSWORD;
  }
}

console.log("[Config] Application configuration loaded");
