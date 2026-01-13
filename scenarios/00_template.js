/**
 * Scenario Template Factory
 * Provides helper functions for creating standardized scenarios
 */

window.ScenarioTemplate = window.ScenarioTemplate || {
  /**
   * Creates a standardized step object
   */
  createStep(config) {
    return {
      skill: config.skill || "general",
      title: config.title || "Step",
      image_path: config.image_path || "",
      prompt: config.prompt || "",
      choices: config.choices || [],
    };
  },

  /**
   * Creates a standardized choice object
   */
  createChoice(config) {
    return {
      text: config.text || "",
      type: config.type || "plausible",
      feedback: config.feedback || "",
      next: config.next || "",
    };
  },

  /**
   * Creates a standardized scenario structure
   */
  createScenario(config) {
    return {
      meta: {
        title: config.title || "Untitled Scenario",
        description: config.description || "",
        estimateHours: config.estimateHours || 1,
        difficulty: config.difficulty || "Intermediate",
        category: config.category || "general",
      },
      setup: config.setup || [],
      fault: config.fault || { description: "", visual_cue: "" },
      expected: config.expected || { description: "", validation_action: "" },
      fix: config.fix || [],
      start: config.start || "step-1",
      steps: config.steps || {},
    };
  },
};

console.log("[ScenarioTemplate] Template factory loaded");
