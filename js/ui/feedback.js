/**
 * Feedback Module
 * Handles displaying feedback for user choices
 */

const FeedbackManager = (function () {
  // Feedback type configurations
  const FEEDBACK_CONFIG = {
    correct: {
      icon: "✓",
      title: "Correct!",
      cssClass: "correct",
      color: "text-green-400",
    },
    partial: {
      icon: "⚡",
      title: "Partially Correct",
      cssClass: "partial",
      color: "text-yellow-400",
    },
    misguided: {
      icon: "↩",
      title: "Consider This...",
      cssClass: "incorrect",
      color: "text-orange-400",
    },
    wrong: {
      icon: "✗",
      title: "Not Quite Right",
      cssClass: "incorrect",
      color: "text-red-400",
    },
  };

  /**
   * Show inline feedback for a choice
   * @param {Object} options - Feedback options
   * @param {Object} options.choice - The choice object
   * @param {HTMLElement} options.container - Container to insert feedback into
   * @param {Function} options.onContinue - Callback when user continues
   */
  function showChoiceFeedback(options) {
    const { choice, container, onContinue } = options;

    if (!container || !choice) return;

    const config = FEEDBACK_CONFIG[choice.type] || FEEDBACK_CONFIG.wrong;
    const isCorrect = choice.type === "correct";

    // Create feedback HTML
    const feedbackHtml = `
      <div class="feedback-banner ${
        config.cssClass
      } animate-slideIn flex items-center gap-4">
        <span class="feedback-icon flex-shrink-0">${config.icon}</span>
        <div class="feedback-content flex-grow">
          <div class="feedback-title ${config.color}">${config.title}</div>
          <p class="feedback-text">${
            choice.feedback || "No feedback available."
          }</p>
        </div>
        ${
          !isCorrect
            ? `<button id="feedback-continue-btn" 
                class="ml-auto flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 text-sm">
              Try Again
            </button>`
            : ""
        }
      </div>
    `;

    // Insert at top of container
    const feedbackDiv = document.createElement("div");
    feedbackDiv.id = "choice-feedback";
    feedbackDiv.innerHTML = feedbackHtml;

    // Remove existing feedback if any
    const existingFeedback = container.querySelector("#choice-feedback");
    if (existingFeedback) {
      existingFeedback.remove();
    }

    container.insertBefore(feedbackDiv, container.firstChild);

    // Handle continue button for incorrect answers
    if (!isCorrect) {
      const continueBtn = document.getElementById("feedback-continue-btn");
      if (continueBtn && onContinue) {
        continueBtn.addEventListener("click", () => {
          feedbackDiv.remove();
          onContinue();
        });
      }
    } else if (onContinue) {
      // For correct answers, auto-continue after delay
      setTimeout(() => {
        feedbackDiv.remove();
        onContinue();
      }, 1500);
    }
  }

  /**
   * Clear any displayed feedback
   * @param {HTMLElement} container - Container to clear feedback from
   */
  function clearFeedback(container) {
    if (!container) return;
    const feedback = container.querySelector("#choice-feedback");
    if (feedback) {
      feedback.remove();
    }
  }

  /**
   * Get feedback configuration for a choice type
   * @param {string} type - Choice type
   * @returns {Object} Feedback config
   */
  function getFeedbackConfig(type) {
    return FEEDBACK_CONFIG[type] || FEEDBACK_CONFIG.wrong;
  }

  // Public API
  return {
    showChoiceFeedback,
    clearFeedback,
    getFeedbackConfig,
  };
})();

// Export for use in other modules
window.FeedbackManager = FeedbackManager;
