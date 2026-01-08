/**
 * Scenario Template Factory
 * Provides helper functions to reduce boilerplate in scenario definitions.
 * Include this file BEFORE other scenario files in index.html.
 */

window.ScenarioFactory = {
  /**
   * Creates standardized validation fields for a scenario.
   * @param {string} scenarioId - The scenario's unique identifier
   * @param {string} faultDesc - Description of the initial problem
   * @param {string} expectedDesc - Description of the expected resolved state
   * @returns {Object} Object containing setup, fault, expected, and fix arrays
   */
  createValidationFields: function (scenarioId, faultDesc, expectedDesc) {
    return {
      setup: [
        {
          action: "set_ue_property",
          scenario: scenarioId,
          step: "step-0",
        },
      ],
      fault: {
        description: faultDesc,
        visual_cue: "Visual indicator of issue",
      },
      expected: {
        description: expectedDesc,
        validation_action: "verify_fix",
      },
      fix: [
        {
          action: "set_ue_property",
          scenario: scenarioId,
          step: "final",
        },
      ],
    };
  },

  /**
   * Creates a standardized conclusion step.
   * @param {string} skill - The primary skill being assessed
   * @param {string} imagePath - Path to the conclusion image
   * @param {string} summary - Brief summary of what was accomplished
   * @param {Array<string>} takeaways - Array of key takeaways
   * @returns {Object} A fully-formed conclusion step object
   */
  createConclusion: function (skill, imagePath, summary, takeaways) {
    const takeawaysList = takeaways.map((t) => `<li>${t}</li>`).join("");
    return {
      skill: skill,
      image_path: imagePath,
      title: "Scenario Complete",
      prompt: `<p><strong>Well done!</strong></p><p>${summary}</p><h4>Key Takeaways:</h4><ul>${takeawaysList}</ul>`,
      choices: [
        {
          text: "Complete Scenario",
          type: "correct",
          feedback: "",
          next: "end",
        },
      ],
    };
  },

  /**
   * Creates a standardized choice with balanced text length.
   * @param {string} text - Short action text (10-50 chars recommended)
   * @param {string} type - 'correct', 'wrong', or 'misguided'
   * @param {string} feedback - Detailed feedback shown after selection
   * @param {string} next - Next step ID
   * @returns {Object} A choice object
   */
  createChoice: function (text, type, feedback, next) {
    return { text, type, feedback, next };
  },

  /**
   * Creates a dead-end recovery step with single choice.
   * @param {string} stepId - The step ID (e.g., 'step-1W')
   * @param {string} skill - Skill being assessed
   * @param {string} title - Step title
   * @param {string} prompt - What went wrong
   * @param {string} recoveryText - Text for recovery choice
   * @param {string} feedback - Feedback on how to recover
   * @param {string} nextStep - Step to continue to
   * @returns {Object} A step object
   */
  createDeadEnd: function (
    stepId,
    skill,
    title,
    prompt,
    recoveryText,
    feedback,
    nextStep
  ) {
    return {
      [stepId]: {
        skill: skill,
        title: title,
        prompt: prompt,
        choices: [
          {
            text: recoveryText,
            type: "correct",
            feedback: feedback,
            next: nextStep,
          },
        ],
      },
    };
  },
};

console.log("[ScenarioFactory] Template helpers loaded.");
