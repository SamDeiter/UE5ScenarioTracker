/**
 * AssessmentModal.js
 * Handles end-game modal rendering for timeout and completion states.
 */

window.AssessmentModal = {
  /**
   * Shows the final assessment modal
   * @param {string} status - 'timeout' or 'complete'
   * @param {number|null} totalLoggedTime - Total simulated time in hours
   * @param {object} stateToUse - State object for generating the key
   * @param {object} options - Additional options (elements, callbacks)
   */
  show(status, totalLoggedTime = null, stateToUse = null, options = {}) {
    const state = stateToUse || window.GameState?.scenarioState || {};
    const config = window.APP_CONFIG || {};
    const PASS_THRESHOLD =
      options.passThreshold || config.PASS_THRESHOLD || 0.8;

    // Pause timer if callback provided
    if (options.pauseTimer) {
      options.pauseTimer();
    }

    let mainTitle, subText, mainTitleColor;
    let finalStatsHtml = "";
    let buttonHtml = "";

    // Determine completion based on state
    const allScenariosComplete = Object.values(state).every((s) => s.completed);

    if (status === "timeout") {
      mainTitle = "Time's Up!";
      subText = "The assessment period has ended. Assessment incomplete.";
      mainTitleColor = "text-orange-400";
      buttonHtml = `<p class="text-sm text-gray-400 mt-4">This assessment is incomplete.</p>`;
    } else if (allScenariosComplete || totalLoggedTime !== null) {
      // Calculate final scores
      if (totalLoggedTime === null) {
        totalLoggedTime = Object.values(state).reduce(
          (acc, s) => acc + (s.loggedTime || 0),
          0
        );
      }

      const { idealTotalTime } = ScoringManager.calculateIdealTime();
      const efficiencyScore =
        totalLoggedTime > 0 ? idealTotalTime / totalLoggedTime : 0;
      const finalEfficiencyPercent = Math.round(efficiencyScore * 100);
      const passed = efficiencyScore >= PASS_THRESHOLD;

      // Generate Test Key
      const testKey = ScoringManager.generateTestKey(state);

      // Report to SCORM/LMS
      if (typeof window.reportScoreAndGUIDToLMS12 === "function") {
        const scormSuccess = window.reportScoreAndGUIDToLMS12(
          finalEfficiencyPercent,
          testKey,
          100,
          PASS_THRESHOLD * 100
        );
        console.log("SCORM data sent:", scormSuccess ? "Success" : "Failed");
      } else {
        console.warn("SCORM helper not loaded - test data not sent to LMS");
      }

      mainTitle = passed ? "Assessment Passed" : "Assessment Completed";
      mainTitleColor = passed ? "text-green-500" : "text-yellow-500";
      subText = passed
        ? "Congratulations! Your results have been submitted to the LMS."
        : "You completed all tickets. Your results have been submitted.";

      finalStatsHtml = `
        <div class="mt-4 border-t border-neutral-600 pt-4">
          <h4 class="text-xl font-bold ${mainTitleColor} mb-3">Final Time Report</h4>
          <div class="space-y-2 text-left max-w-sm mx-auto">
            <div class="flex justify-between text-sm text-gray-200">
              <span>Total Optimal Time (0.5h/step):</span>
              <span class="font-bold">${idealTotalTime.toFixed(1)} hrs</span>
            </div>
            <div class="flex justify-between text-sm text-gray-200">
              <span>Total Simulated Time (Choice Cost):</span>
              <span class="font-bold text-sm">${totalLoggedTime.toFixed(
                1
              )} hrs</span>
            </div>
            <div class="flex justify-between text-lg text-white border-t border-gray-500 pt-3">
              <span class="font-bold">Efficiency Score:</span>
              <span class="font-bold ${mainTitleColor}">${finalEfficiencyPercent}%</span>
            </div>
            <p class="text-xs text-gray-400 text-center">(Pass Threshold: ${
              PASS_THRESHOLD * 100
            }%)</p>
          </div>
        </div>
        
        <div class="mt-4 border-t border-neutral-600 pt-4">
          <h4 class="text-xl font-bold text-gray-100 mb-3">Reproducible Test Key</h4>
          <p class="text-sm text-gray-400 mb-2">Copy this key to recreate this exact test path and results.</p>
          
          <div class="flex justify-center">
            <span id="test-key-display" class="font-mono text-xs md:text-sm bg-neutral-700/70 p-3 rounded-lg break-all max-w-full inline-block text-yellow-300">
              ${testKey}
            </span>
          </div>
          
          <button id="copy-key-btn" class="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-200">
            Copy Key
          </button>
        </div>
      `;

      buttonHtml = `<p class="text-sm text-gray-400 mt-4">This assessment is complete.</p>`;
    }

    // Render Modal
    const modalContentHtml = `
      <div id="final-modal-content" class="bg-gray-800 p-6 rounded-xl shadow-2xl text-center max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-3xl font-extrabold ${mainTitleColor} mb-2">${mainTitle}</h2>
        <p class="text-base text-gray-300 mb-2">${subText}</p>
        ${finalStatsHtml}
        ${buttonHtml}
      </div>
    `;

    // Get container elements
    const timesUpScreen =
      options.timesUpScreen || document.getElementById("times-up-screen");
    const jiraBoard =
      options.jiraBoard || document.getElementById("jira-board");

    if (timesUpScreen) {
      timesUpScreen.innerHTML = modalContentHtml;
      timesUpScreen.classList.remove("hidden");
    }
    if (jiraBoard) {
      jiraBoard.classList.add("hidden");
    }

    // Attach Copy button listener
    if (allScenariosComplete || totalLoggedTime !== null) {
      this._attachCopyHandler();
    }
  },

  /**
   * Attach copy button event handler
   */
  _attachCopyHandler() {
    const copyButton = document.getElementById("copy-key-btn");
    const keyDisplay = document.getElementById("test-key-display");

    if (copyButton && keyDisplay) {
      copyButton.addEventListener("click", () => {
        const keyToCopy = keyDisplay.textContent.trim();

        // Use execCommand for iframe compatibility
        const tempInput = document.createElement("textarea");
        tempInput.value = keyToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

        copyButton.textContent = "Copied!";
        setTimeout(() => {
          copyButton.textContent = "Copy Key";
        }, 2000);
      });
    }
  },
};

console.log("[AssessmentModal] Module loaded");
