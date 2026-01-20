/**
 * Modal Manager Module
 * Handles modal dialogs including assessment results
 */

const ModalManager = (function () {
  /**
   * Show the assessment result modal
   * @param {Object} options - Modal options
   * @param {string} options.status - 'timeout' or 'complete'
   * @param {number} options.totalLoggedTime - Total logged time in hours
   * @param {Object} options.state - Scenario state object
   * @param {Function} options.onRestart - Callback for restart action
   */
  function showAssessmentModal(options) {
    const { status, totalLoggedTime = 0, state = {}, onRestart } = options;

    const timesUpScreen = document.getElementById("times-up-screen");
    if (!timesUpScreen) {
      console.error("[ModalManager] times-up-screen element not found");
      return;
    }

    // Calculate metrics
    const completedCount = Object.values(state).filter(
      (s) => s.completed
    ).length;
    const totalCount = Object.keys(state).length;
    const idealTime = ScoringManager.calculateIdealTime();
    const efficiency = ScoringManager.calculateEfficiency(
      idealTime.idealTotalTime,
      totalLoggedTime
    );
    const passed = ScoringManager.isPassing(efficiency);
    const testKey = ScoringManager.generateTestKey(state);

    // Determine status text and styling
    const isComplete = status === "complete";
    const statusTitle = isComplete ? "Assessment Complete" : "Time Expired";
    const statusIcon = isComplete ? "✓" : "⏱️";
    const scoreClass = passed ? "passed" : "failed";
    const scorePercent = Math.round(efficiency * 100);

    const modalContent = `
      <div class="result-card max-w-lg w-full animate-fadeIn">
        <div class="text-6xl mb-4">${statusIcon}</div>
        <h2 class="text-2xl font-bold text-neutral-100 mb-2">${statusTitle}</h2>
        
        <div class="score-display ${scoreClass}">${scorePercent}%</div>
        <div class="score-label mb-6">${
          passed ? "PASSED" : "NEEDS IMPROVEMENT"
        }</div>
        
        <div class="bg-neutral-800 rounded-lg p-4 mb-6">
          <div class="metric-row">
            <span class="metric-label">Modules Completed</span>
            <span class="metric-value">${completedCount} / ${totalCount}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Time Logged</span>
            <span class="metric-value">${ScoringManager.formatHours(
              totalLoggedTime
            )}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Ideal Time</span>
            <span class="metric-value">${ScoringManager.formatHours(
              idealTime.idealTotalTime
            )}</span>
          </div>
          <div class="metric-row">
            <span class="metric-label">Efficiency</span>
            <span class="metric-value ${ScoringManager.getTimeColorClass(
              totalLoggedTime,
              idealTime.idealTotalTime
            )}">${scorePercent}%</span>
          </div>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm text-gray-400 mb-2">Assessment Key (for records)</label>
          <div class="bg-neutral-900 p-3 rounded font-mono text-xs text-gray-300 break-all max-h-24 overflow-y-auto">
            ${testKey}
          </div>
        </div>
        
        <button id="modal-restart-btn" 
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200">
          Start New Assessment
        </button>
      </div>
    `;

    timesUpScreen.innerHTML = modalContent;
    timesUpScreen.classList.remove("hidden");

    // Attach restart handler
    const restartBtn = document.getElementById("modal-restart-btn");
    if (restartBtn && onRestart) {
      restartBtn.addEventListener("click", () => {
        timesUpScreen.classList.add("hidden");
        onRestart();
      });
    }
  }

  /**
   * Hide the assessment modal
   */
  function hideAssessmentModal() {
    const timesUpScreen = document.getElementById("times-up-screen");
    if (timesUpScreen) {
      timesUpScreen.classList.add("hidden");
    }
  }

  /**
   * Show a generic confirmation modal
   * @param {Object} options - Modal options
   * @returns {Promise<boolean>} User's choice
   */
  function showConfirmModal(options) {
    const {
      title,
      message,
      confirmText = "Confirm",
      cancelText = "Cancel",
    } = options;

    return new Promise((resolve) => {
      const modalHtml = `
        <div id="confirm-modal" class="fixed inset-0 bg-gray-900 bg-opacity-75 z-[999] flex items-center justify-center">
          <div class="bg-gray-800 p-8 rounded-xl shadow-2xl text-center max-w-sm w-full">
            <h3 class="text-xl font-bold text-neutral-100 mb-4">${title}</h3>
            <p class="text-gray-300 mb-6">${message}</p>
            <div class="flex justify-around space-x-3">
              <button id="confirm-yes" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
                ${confirmText}
              </button>
              <button id="confirm-no" class="flex-1 bg-neutral-600 hover:bg-neutral-700 text-white font-semibold py-2 rounded-lg">
                ${cancelText}
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", modalHtml);

      const modal = document.getElementById("confirm-modal");

      const cleanup = (result) => {
        modal.remove();
        resolve(result);
      };

      document
        .getElementById("confirm-yes")
        .addEventListener("click", () => cleanup(true));
      document
        .getElementById("confirm-no")
        .addEventListener("click", () => cleanup(false));
    });
  }

  // Public API
  return {
    showAssessmentModal,
    hideAssessmentModal,
    showConfirmModal,
  };
})();

// Export for use in other modules
window.ModalManager = ModalManager;
