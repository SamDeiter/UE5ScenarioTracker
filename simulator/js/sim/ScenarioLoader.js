/**
 * ScenarioLoader.js - Load and Manage Test Scenarios
 *
 * Handles loading scenario definitions from JSON or embedded data,
 * configuring the simulator state, and validating student attempts.
 *
 * Usage:
 *   import { ScenarioLoader } from './sim/ScenarioLoader.js';
 *
 *   const loader = new ScenarioLoader();
 *
 *   // Load a scenario
 *   await loader.load('shadow_cutoff_fix');
 *
 *   // Validate student's current state
 *   const result = loader.validate();
 */

class ScenarioLoader {
  constructor(options = {}) {
    this.currentScenario = null;
    this.basePath = options.basePath || "scenarios/";
    this.onLoad = options.onLoad || (() => {});
    this.onValidate = options.onValidate || (() => {});

    // Built-in scenarios (can also load from JSON)
    this.scenarios = {
      directional_light: {
        id: "directional_light",
        name: "Fix Directional Light Shadows",
        description:
          "The shadows are cutting off before reaching distant objects. Adjust the shadow settings to fix this issue.",
        initialActor: "DirectionalLight",
        objectives: [
          {
            description: "Increase Dynamic Shadow Distance",
            actor: "DirectionalLight",
            property: "Dynamic Shadow Distance MovableLight",
            expectedValue: 20000,
            comparison: "gte", // greater than or equal
            points: 50,
          },
          {
            description: "Set Mobility to Stationary",
            actor: "DirectionalLight",
            property: "Mobility",
            expectedValue: "Stationary",
            comparison: "eq",
            points: 50,
          },
        ],
        hints: [
          "Look in the Cascaded Shadow Maps category",
          "The Dynamic Shadow Distance controls how far shadows render",
          "Try increasing the value to 20000 or higher",
        ],
        passingScore: 70,
        timeLimit: null, // No time limit
      },

      light_intensity: {
        id: "light_intensity",
        name: "Adjust Light Intensity",
        description:
          "The scene is too dark. Increase the directional light intensity.",
        initialActor: "DirectionalLight",
        objectives: [
          {
            description: "Increase Light Intensity",
            actor: "DirectionalLight",
            property: "Intensity",
            expectedValue: 10,
            comparison: "gte",
            points: 100,
          },
        ],
        hints: [
          "Find the Intensity property in the Light category",
          "The default intensity is often too low for outdoor scenes",
        ],
        passingScore: 100,
        timeLimit: 120, // 2 minutes
      },

      skylight_setup: {
        id: "skylight_setup",
        name: "Configure Sky Light",
        description:
          "Set up the sky light to properly illuminate the scene with ambient lighting.",
        initialActor: "SkyLight",
        objectives: [
          {
            description: "Enable Cast Shadows",
            actor: "SkyLight",
            property: "Cast Shadows",
            expectedValue: true,
            comparison: "eq",
            points: 50,
          },
          {
            description: "Set Source Type to Captured",
            actor: "SkyLight",
            property: "Source Type",
            expectedValue: "SLS_Captured Scene",
            comparison: "eq",
            points: 50,
          },
        ],
        hints: [
          "Sky Lights capture the environment for ambient lighting",
          "Enable shadows for more realistic global illumination",
        ],
        passingScore: 80,
        timeLimit: null,
      },
    };
  }

  /**
   * Load a scenario by ID
   */
  async load(scenarioId) {
    // Check built-in scenarios first
    let scenario = this.scenarios[scenarioId];

    // Try to load from JSON if not found
    if (!scenario) {
      try {
        const response = await fetch(this.basePath + scenarioId + ".json");
        if (response.ok) {
          scenario = await response.json();
        }
      } catch (e) {
        console.warn(
          "[ScenarioLoader] Could not load scenario:",
          scenarioId,
          e
        );
      }
    }

    if (!scenario) {
      console.error("[ScenarioLoader] Scenario not found:", scenarioId);
      return null;
    }

    this.currentScenario = scenario;

    // Configure simulator state
    if (typeof SimState !== "undefined" && scenario.initialActor) {
      SimState.selectActor(scenario.initialActor);
    }

    // Emit event
    if (typeof EventBus !== "undefined") {
      EventBus.emit("scenario:loaded", { scenario });
    }

    this.onLoad(scenario);

    return scenario;
  }

  /**
   * Get current scenario
   */
  getCurrent() {
    return this.currentScenario;
  }

  /**
   * Get list of available scenarios
   */
  getAvailableScenarios() {
    return Object.keys(this.scenarios).map((id) => ({
      id,
      name: this.scenarios[id].name,
      description: this.scenarios[id].description,
    }));
  }

  /**
   * Validate current state against scenario objectives
   */
  validate() {
    if (!this.currentScenario) {
      console.warn("[ScenarioLoader] No scenario loaded");
      return { passed: false, score: 0, results: [] };
    }

    const results = [];
    let totalPoints = 0;
    let earnedPoints = 0;

    for (const objective of this.currentScenario.objectives) {
      totalPoints += objective.points;

      // Get actual value from SimState
      let actualValue = null;
      if (typeof SimState !== "undefined") {
        actualValue = SimState.getProperty(objective.actor, objective.property);
      }

      // Compare values
      const passed = this._compare(
        actualValue,
        objective.expectedValue,
        objective.comparison
      );

      if (passed) {
        earnedPoints += objective.points;
      }

      results.push({
        description: objective.description,
        property: objective.property,
        expected: objective.expectedValue,
        actual: actualValue,
        passed: passed,
        points: passed ? objective.points : 0,
      });
    }

    const score =
      totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= (this.currentScenario.passingScore || 70);

    const validation = {
      passed,
      score,
      earnedPoints,
      totalPoints,
      passingScore: this.currentScenario.passingScore,
      results,
    };

    // Emit event
    if (typeof EventBus !== "undefined") {
      EventBus.emit("scenario:validated", validation);
    }

    this.onValidate(validation);

    return validation;
  }

  /**
   * Compare actual vs expected value
   */
  _compare(actual, expected, comparison) {
    switch (comparison) {
      case "eq":
        return actual === expected;
      case "neq":
        return actual !== expected;
      case "gt":
        return actual > expected;
      case "gte":
        return actual >= expected;
      case "lt":
        return actual < expected;
      case "lte":
        return actual <= expected;
      case "contains":
        return String(actual).includes(String(expected));
      default:
        return actual === expected;
    }
  }

  /**
   * Get hint for current scenario
   */
  getHint(hintIndex = 0) {
    if (!this.currentScenario || !this.currentScenario.hints) {
      return null;
    }

    const index = Math.min(hintIndex, this.currentScenario.hints.length - 1);
    return this.currentScenario.hints[index];
  }

  /**
   * Register a custom scenario
   */
  registerScenario(scenario) {
    this.scenarios[scenario.id] = scenario;
  }

  /**
   * Reset current scenario state
   */
  reset() {
    if (this.currentScenario && typeof SimState !== "undefined") {
      // Re-select initial actor
      if (this.currentScenario.initialActor) {
        SimState.selectActor(this.currentScenario.initialActor);
      }

      // Reset property values to defaults
      if (typeof ActorRegistry !== "undefined") {
        const actors = SimState.getActors();
        for (const [actorName, actor] of Object.entries(actors)) {
          const defaults = ActorRegistry.getDefaults(actor.type);
          for (const [prop, value] of Object.entries(defaults)) {
            SimState.setProperty(actorName, prop, value);
          }
        }
      }
    }

    if (typeof EventBus !== "undefined") {
      EventBus.emit("scenario:reset", { scenario: this.currentScenario });
    }
  }
}

// Export
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ScenarioLoader };
}
if (typeof window !== "undefined") {
  window.ScenarioLoader = ScenarioLoader;
}
