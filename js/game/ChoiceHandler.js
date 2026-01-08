/**
 * ChoiceHandler.js
 * Handles choice button parsing, UI state management, and navigation logic.
 */

window.ChoiceHandler = {
  // Processing state
  _isProcessing: false,

  /**
   * Check if currently processing a choice
   */
  isProcessing() {
    return this._isProcessing;
  },

  /**
   * Set processing state and update UI
   * @param {boolean} processing - Whether processing is active
   */
  setProcessing(processing) {
    this._isProcessing = processing;
    const allButtons = document.querySelectorAll(".choice-button");
    allButtons.forEach((btn) => {
      btn.disabled = processing;
      if (processing) {
        btn.classList.add("processing");
      } else {
        btn.classList.remove("processing");
      }
    });
  },

  /**
   * Parse choice data from button dataset
   * @param {HTMLElement} choiceButton - The clicked button element
   * @param {Object} step - The current step data
   * @returns {Object} Parsed choice data
   */
  parseChoice(choiceButton, step) {
    const {
      choiceNext,
      choiceTimeCost,
      originalIndex,
      choiceFeedback,
      choiceType,
    } = choiceButton.dataset;

    const timeCost = parseFloat(choiceTimeCost);
    const index = parseInt(originalIndex, 10);

    // Handle filler choices (index=-1) vs original choices
    let choice;
    if (index === -1 || index < 0) {
      // Filler choice - construct from dataset
      choice = {
        text:
          choiceButton.querySelector(".choice-text")?.textContent?.trim() || "",
        type: choiceType || "wrong",
        feedback: choiceFeedback
          ? decodeURIComponent(choiceFeedback)
          : "<p>This approach won't help here. Try a different option.</p>",
        next: choiceNext,
        isFiller: true,
      };
      console.log("[ChoiceHandler] Parsed filler choice:", choice.type);
    } else {
      choice = { ...step.choices[index], isFiller: false };
    }

    return {
      choice,
      timeCost,
      index,
      choiceNext,
      isCorrect: choice && choice.type === "correct",
    };
  },

  /**
   * Determine navigation action based on choice result
   * @param {Object} params - Navigation parameters
   * @returns {Object} Navigation action { type: 'finish' | 'navigate' | 'stay', stepId }
   */
  getNavigationAction(params) {
    const { result, isCorrect, choice, currentStepId, choiceNext } = params;

    if (result.type === "complete") {
      return { type: "finish" };
    }

    const nextStepId = result.step?.id || choiceNext;

    if (isCorrect && choice?.feedback) {
      return { type: "navigate-with-feedback", stepId: nextStepId };
    }

    if (!isCorrect && choice?.feedback) {
      // If staying on same step, just show feedback
      if (nextStepId === currentStepId) {
        return { type: "stay-with-feedback" };
      }
      return { type: "navigate-with-feedback", stepId: nextStepId };
    }

    // No feedback - navigate immediately
    return { type: "navigate", stepId: nextStepId };
  },
};

console.log("[ChoiceHandler] Module loaded");
