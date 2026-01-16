/**
 * ScenarioManager.js
 * Handles scenario selection, completion, and conclusion rendering.
 */

window.ScenarioManager = {
  /**
   * Finish a completed scenario
   * @param {string} scenarioId - The scenario ID
   * @param {object} options - Configuration and callbacks
   */
  finishScenario(scenarioId, options = {}) {
    const {
      scenarioState,
      interruptedSteps,
      onComplete,
      saveState,
      renderConclusion,
    } = options;

    console.log("[ScenarioManager] Finishing scenario:", scenarioId);

    // Mark as completed
    const state = scenarioState?.[scenarioId];
    if (state) {
      state.completed = true;
    }

    // Clear from interrupted steps
    if (interruptedSteps?.[scenarioId]) {
      delete interruptedSteps[scenarioId];
    }

    // Save state
    if (saveState) saveState();

    // Check if all complete
    const allComplete = scenarioState
      ? Object.values(scenarioState).every((s) => s.completed)
      : false;

    // Get scenario details for the celebration modal
    const scenario = window.SCENARIOS?.[scenarioId];
    const scenarioTitle = scenario?.meta?.title || scenarioId;
    const estimatedTime = scenario?.meta?.estimateHours || 0;
    const timeSpent = state?.loggedTime || 0;

    // Show celebration modal (if CompletionModal is available)
    if (window.CompletionModal && !allComplete) {
      window.CompletionModal.show({
        scenarioId,
        scenarioTitle,
        timeSpent,
        estimatedTime,
        onContinue: () => {
          if (renderConclusion) {
            renderConclusion();
          }
        },
      });
    } else if (allComplete && onComplete) {
      onComplete();
    } else if (renderConclusion) {
      renderConclusion();
    }
  },

  /**
   * Render the conclusion screen for a completed scenario
   * @param {string} scenarioId - The scenario ID
   * @param {object} options - Configuration
   */
  renderConclusion(scenarioId, options = {}) {
    const scenario = window.SCENARIOS?.[scenarioId];
    if (!scenario) return;

    const { container, scenarioState, onSelectNext, onViewResults } = options;

    if (!container) return;

    const state = scenarioState?.[scenarioId] || {};
    const conclusion = scenario.steps?.conclusion;

    // Calculate scores
    const { idealTotalTime } = ScoringManager?.calculateIdealTime() || {
      idealTotalTime: 0,
    };
    const scenarioIdealTime =
      ScoringManager?.getScenarioIdealTime(scenarioId) || 0;
    const timeCost = state.loggedTime || 0;
    const efficiency =
      timeCost > 0 ? (scenarioIdealTime / timeCost) * 100 : 100;
    const passThresholdPercent =
      (window.APP_CONFIG?.PASS_THRESHOLD || 0.8) * 100;
    const passed = efficiency >= passThresholdPercent;

    // Get remaining incomplete scenarios
    const incompleteScenarios = Object.entries(window.SCENARIOS || {})
      .filter(([id]) => !scenarioState?.[id]?.completed)
      .map(([id, s]) => ({
        id,
        title: s.meta?.title || s.title || id,
      }));

    const allComplete = incompleteScenarios.length === 0;

    // Build Next Steps HTML
    let nextStepsHtml = "";
    if (!allComplete) {
      nextStepsHtml = `
        <div class="mt-6 border-t border-gray-700 pt-4">
          <h4 class="text-lg font-bold text-gray-200 mb-3">Continue Assessment</h4>
          <div class="space-y-2">
            ${incompleteScenarios
              .slice(0, 3)
              .map(
                (s) => `
              <button class="next-scenario-btn w-full text-left bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-lg p-3 transition-colors" data-scenario-id="${s.id}">
                <span class="text-gray-200">${s.title}</span>
                <span class="text-xs text-gray-500 block">Not Started</span>
              </button>
            `
              )
              .join("")}
          </div>
        </div>
      `;
    }

    const conclusionHtml = `
      <div class="text-center py-6">
        <div class="text-5xl mb-4">${passed ? "✅" : "⚠️"}</div>
        <h3 class="text-2xl font-bold ${
          passed ? "text-green-400" : "text-yellow-400"
        } mb-2">
          ${passed ? "Ticket Resolved!" : "Ticket Completed"}
        </h3>
        <p class="text-gray-300 mb-4">
          ${
            conclusion?.text ||
            "You have completed this troubleshooting scenario."
          }
        </p>
        
        <div class="bg-gray-800/50 rounded-lg p-4 mb-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-400">Time for this ticket:</span>
            <span class="font-bold text-gray-200">${timeCost.toFixed(
              1
            )} hrs</span>
          </div>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-400">Optimal time:</span>
            <span class="font-bold text-gray-200">${scenarioIdealTime.toFixed(
              1
            )} hrs</span>
          </div>
          <div class="flex justify-between text-lg border-t border-gray-700 pt-2 mt-2">
            <span class="font-bold text-gray-200">Efficiency:</span>
            <span class="font-bold ${
              passed ? "text-green-400" : "text-yellow-400"
            }">
              ${Math.round(efficiency)}%
            </span>
          </div>
        </div>

        ${
          allComplete
            ? `
          <button id="view-final-results-btn" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            View Final Results
          </button>
        `
            : nextStepsHtml
        }
      </div>
    `;

    container.innerHTML = conclusionHtml;

    // Attach event handlers
    if (allComplete && onViewResults) {
      container
        .querySelector("#view-final-results-btn")
        ?.addEventListener("click", onViewResults);
    } else if (onSelectNext) {
      container.querySelectorAll(".next-scenario-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const nextId = btn.dataset.scenarioId;
          onSelectNext(nextId);
        });
      });
    }
  },

  /**
   * Render the single ticket completion screen
   * @param {string} scenarioId - The scenario ID
   * @param {object} options - Configuration
   */
  renderSingleConclusion(scenarioId, options = {}) {
    const scenario = window.SCENARIOS?.[scenarioId];
    if (!scenario) return;

    const { container, state, onClose } = options;
    if (!container) return;

    const estimateHours = scenario.meta?.estimateHours || 2;
    const loggedHours = state?.loggedTime || 0;

    const timeColorClass = ScoringManager.getTimeColorClass(
      loggedHours,
      estimateHours
    );

    // Calculate overrun/underrun
    const timeDifference = loggedHours - estimateHours;
    const diffColorClass =
      timeDifference > 0 ? "text-red-400" : "text-green-400";
    const diffLabel = timeDifference > 0 ? "Over" : "Under";
    const diffValue = Math.abs(timeDifference);

    let summaryMessage;
    if (loggedHours <= estimateHours) {
      summaryMessage =
        "Excellent outcome! The solution was found well within the estimated time.";
    } else if (loggedHours <= estimateHours * 1.5) {
      summaryMessage =
        "Solid work. The solution was delivered, requiring a moderate but acceptable amount of time.";
    } else {
      summaryMessage =
        "Ticket resolved. The issue was complex, resulting in a higher time log than originally estimated.";
    }

    const conclusionHtml = `
      <div class="text-center p-8">
        <h3 class="text-3xl font-bold ${timeColorClass} mb-6">Ticket Resolved</h3>
        <p class="text-lg text-gray-300 mb-8">${summaryMessage}</p>

        <div class="max-w-md mx-auto bg-neutral-700/50 p-6 rounded-lg">
          <h4 class="text-xl font-semibold text-gray-100 mb-4">Ticket Time Breakdown (Step Cost)</h4>
          <div class="space-y-3 text-left">
            <div class="flex justify-between text-gray-300">
              <span>Logged Fix Time:</span>
              <span class="font-bold">${loggedHours.toFixed(1)} hrs</span>
            </div>
            <div class="flex justify-between text-gray-300">
              <span>Original Estimate:</span>
              <span class="font-bold text-green-400">${estimateHours.toFixed(
                1
              )} hrs</span>
            </div>
            <div class="flex justify-between text-lg text-white border-t border-gray-500 pt-3 mt-3">
              <span class="font-bold">${diffLabel} Budget By:</span>
              <span class="font-bold ${diffColorClass}">${diffValue.toFixed(
      1
    )} hrs</span>
            </div>
          </div>
        </div>

        <button id="close-scenario-btn" class="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-200">
          Back to Backlog
        </button>
      </div>
    `;

    container.innerHTML = conclusionHtml;

    // Attach close button handler
    const closeBtn = document.getElementById("close-scenario-btn");
    if (closeBtn && onClose) {
      closeBtn.addEventListener("click", onClose);
    }
  },
};

console.log("[ScenarioManager] Module loaded");
