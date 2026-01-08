/**
 * StepRenderer.js
 * Handles rendering of scenario steps (questions, choices) and choice processing.
 */

window.StepRenderer = {
  /**
   * Render a specific step of a scenario
   * @param {string} scenarioId - The scenario ID
   * @param {string} stepId - The step ID to render
   * @param {object} options - Configuration and callbacks
   */
  render(scenarioId, stepId, options = {}) {
    const scenario = window.SCENARIOS[scenarioId];
    const step = scenario?.steps?.[stepId];

    if (!step) {
      console.error(
        `[StepRenderer] Step "${stepId}" not found in scenario "${scenarioId}"`
      );
      return;
    }

    const {
      container,
      isDebugMode = false,
      shuffledChoicesCache = {},
      onChoiceClick,
      onRenderComplete,
    } = options;

    if (!container) {
      console.error("[StepRenderer] No container provided");
      return;
    }

    // Get or create shuffled choices
    const cacheKey = `${scenarioId}_${stepId}`;
    if (!shuffledChoicesCache[cacheKey]) {
      const skill = step.skill || "general";
      const enhancedChoices = window.ChoiceEnhancer
        ? ChoiceEnhancer.padChoices(step.choices, skill, stepId)
        : step.choices;

      shuffledChoicesCache[cacheKey] = [...enhancedChoices].sort(
        () => Math.random() - 0.5
      );
    }
    const shuffledChoices = shuffledChoicesCache[cacheKey];

    // Build screenshot HTML
    let screenshotHtml = "";
    if (step.image_path) {
      let imageSrc = step.image_path;
      if (!imageSrc.startsWith("assets/")) {
        imageSrc = `assets/generated/${scenarioId}/${imageSrc}`;
      }
      screenshotHtml = `
        <div class="screenshot-area mb-6" onclick="openImageModal('${imageSrc}')">
          <img 
            src="${imageSrc}" 
            alt="${scenario.meta?.title || scenario.title}" 
            class="w-full rounded-lg border border-gray-700"
            onerror="this.src='assets/generated/${scenarioId}/viewport.png'; this.onerror=function(){ this.src='assets/generated/directional_light/viewport.png'; this.onerror=null; };"
          />
        </div>
      `;
    }

    // Build main HTML
    const stepHtml = `
      <div class="scenario-content-grid">
        <div class="question-prompt">
          <span class="prompt-label">Scenario</span>
          <div class="prompt-text">${step.prompt}</div>
        </div>
        ${
          screenshotHtml
            ? `<div class="scenario-image-container">${screenshotHtml}</div>`
            : ""
        }
      </div>
      <div class="choices-header">
        <span>Select your response:</span>
      </div>
      <div id="ticket-step-choices" class="choices-container"></div>
    `;

    container.innerHTML = stepHtml;

    // Render choice buttons
    const choicesContainer = container.querySelector("#ticket-step-choices");
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

    shuffledChoices.forEach((choice, shuffledIndex) => {
      const timeCost = ScoringManager.getTimeCost(choice.type);
      const letter = letters[shuffledIndex] || String(shuffledIndex + 1);

      const btn = document.createElement("button");
      let extraClasses = "";
      let debugLabelHtml = "";

      if (isDebugMode) {
        extraClasses = this._getDebugClass(choice.type);
        debugLabelHtml = this._getDebugLabel(choice.type, timeCost);
      }

      btn.className = `choice-button ${extraClasses}`;
      btn.innerHTML = `
        <span class="choice-letter">${letter}</span>
        <div class="choice-text">
          ${choice.text}
          ${debugLabelHtml}
        </div>
      `;

      btn.dataset.choiceNext = choice.next;
      btn.dataset.choiceTimeCost = timeCost;
      btn.dataset.choiceType = choice.type || "wrong";

      // Store feedback for filler choices (encode to handle HTML)
      if (choice.feedback) {
        btn.dataset.choiceFeedback = encodeURIComponent(choice.feedback);
      }

      const originalIndex = step.choices.indexOf(choice);
      btn.dataset.originalIndex = originalIndex !== -1 ? originalIndex : -1;

      if (onChoiceClick) {
        btn.addEventListener("click", () => onChoiceClick(btn));
      }

      choicesContainer.appendChild(btn);
    });

    if (onRenderComplete) {
      onRenderComplete();
    }
  },

  /**
   * Get debug CSS class for choice type
   */
  _getDebugClass(type) {
    switch (type) {
      case "correct":
        return "debug-correct";
      case "partial":
        return "debug-partial";
      case "misguided":
      case "wrong":
      default:
        return "debug-wrong";
    }
  },

  /**
   * Get debug label HTML for choice
   */
  _getDebugLabel(type, timeCost) {
    const typeLabels = {
      correct: "OPTIMAL",
      partial: "ACCEPTABLE",
      misguided: "SUBOPTIMAL",
      wrong: "INCORRECT",
    };

    const colorClass =
      type === "correct"
        ? "text-green-400"
        : type === "partial"
        ? "text-yellow-400"
        : "text-red-400";

    return `
      <div class="text-xs mt-2 pt-2 border-t border-gray-700/50">
        <span class="font-semibold uppercase tracking-wider ${colorClass}">
          ${typeLabels[type] || "INCORRECT"}
        </span>
        <span class="text-gray-500 ml-2">+${timeCost.toFixed(1)} hrs</span>
      </div>
    `;
  },

  /**
   * Disable all choice buttons during processing
   */
  disableChoices() {
    document.querySelectorAll(".choice-button").forEach((btn) => {
      btn.disabled = true;
      btn.classList.add("processing");
    });
  },

  /**
   * Re-enable all choice buttons after processing
   */
  enableChoices() {
    document.querySelectorAll(".choice-button").forEach((btn) => {
      btn.disabled = false;
      btn.classList.remove("processing");
    });
  },
};

console.log("[StepRenderer] Module loaded");
