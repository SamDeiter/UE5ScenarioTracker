/**
 * Scenario Builder Framework
 * Minimizes boilerplate by providing helper functions for common patterns.
 */

const ScenarioBuilder = {
  /**
   * Create a choice with correct answer
   */
  correct(text, feedback, next) {
    return { text, type: "correct", feedback: `<p>${feedback}</p>`, next };
  },

  /**
   * Create a misguided choice (loops back with probing question)
   */
  misguided(text, feedback, loopTo) {
    return {
      text,
      type: "misguided",
      feedback: `<p>${feedback}</p>`,
      next: loopTo,
    };
  },

  /**
   * Create a wrong choice (loops back with guidance)
   */
  wrong(text, feedback, loopTo) {
    return {
      text,
      type: "wrong",
      feedback: `<p>${feedback}</p>`,
      next: loopTo,
    };
  },

  /**
   * Create a step
   */
  step(id, { title, skill, image, prompt, choices }) {
    return {
      [id]: {
        image_path: image ? `${id}.png` : undefined,
        skill: skill || "general",
        title,
        prompt: `<p>${prompt.context}</p><strong>${prompt.question}</strong>`,
        choices,
      },
    };
  },

  /**
   * Create conclusion step with key takeaways
   */
  conclusion({ image, skill, summary, takeaways }) {
    const takeawayHtml = takeaways
      .map((t) => `<li><strong>${t.term}</strong> — ${t.description}</li>`)
      .join("");

    return {
      conclusion: {
        image_path: image ? "conclusion.png" : undefined,
        skill: skill || "general",
        title: "Scenario Complete",
        prompt:
          `<p><strong>Well done!</strong></p>` +
          `<p>${summary}</p>` +
          `<h4>Key Takeaways:</h4><ul>${takeawayHtml}</ul>`,
        choices: [
          {
            text: "Complete Scenario",
            type: "correct",
            feedback: "",
            next: "end",
          },
        ],
      },
    };
  },

  /**
   * Build complete scenario from config
   */
  build(config) {
    const steps = {};
    config.steps.forEach((stepConfig) => {
      Object.assign(steps, stepConfig);
    });
    Object.assign(steps, config.conclusion);

    return {
      meta: config.meta,
      start: config.start || "step-1",
      steps,
    };
  },
};

// Export for use in scenario files
window.ScenarioBuilder = ScenarioBuilder;
