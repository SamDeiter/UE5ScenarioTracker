// --- IMAGE MODAL FUNCTIONS now in js/ui/image-modal.js ---

// Wait for the DOM to be fully loaded before running the game logic
document.addEventListener("DOMContentLoaded", () => {
  // --- GLOBAL CONFIGURATION (from js/config.js) ---
  const config = window.APP_CONFIG || {};
  const TOTAL_TEST_TIME_SECONDS = config.TOTAL_TEST_TIME_SECONDS || 30 * 60;
  const LOW_TIME_WARNING_SECONDS = config.LOW_TIME_WARNING_SECONDS || 5 * 60;
  const PASS_THRESHOLD = config.PASS_THRESHOLD || 0.8;
  const DEBUG_PASSWORD = config.DEBUG_PASSWORD || "DISABLED";

  // --- DEBUG ACCESS STATE ---
  let debugAccessState = {
    passwordModalVisible: false, // Tracks if the password input is currently shown
  };

  // --- DOM ELEMENT CACHE (Declared as 'let' for later assignment) ---
  // Auditing/Key loading elements removed.
  let headerControls,
    backlogList,
    ticketViewColumn,
    ticketPlaceholder,
    ticketContent,
    ticketTitle,
    ticketDescription,
    ticketStepContent,
    debugToggle,
    countdownTimer,
    jiraBoard,
    timesUpScreen,
    restartTimerBtn,
    debugDropdown;

  let timerContainer; // Parent container for the countdown timer

  // --- CORE GAME STATE ---
  let scenarioState = {}; // Stores progress, time logged, and choices for each scenario (Ticket)
  let currentScenarioId = null; // Key of the scenario currently displayed (e.g., 'golem')
  let currentStepId = null; // Key of the current question step within the scenario
  let interruptedSteps = {}; // Stores the last active step for non-completed scenarios
  let isDebugMode = false; // Flag for debug visualization/controls
  let isProcessingChoice = false; // Flag to prevent rapid clicking race conditions
  let mainTimerInterval = null; // ID for the setInterval used for the 30-minute countdown
  let shuffledChoicesCache = {}; // Stores shuffled choice order per scenario+step so it doesn't reshuffle on retry
  let currentCategoryFilter = "all"; // Current category filter selection

  let timeRemaining = TOTAL_TEST_TIME_SECONDS; // Remaining time on the countdown timer

  // --- TIMER LOGIC ---

  /**
   * Updates the main timer display, applies visual cues (pulse-red), and handles expiry.
   */
  function updateMainTimerDisplay() {
    // 1. Update Display
    countdownTimer.textContent = TimerManager.formatTime(timeRemaining);

    // 2. Update Color/Pulse based on time left
    countdownTimer.classList.remove(
      "pulse-red",
      "text-neutral-200",
      "text-yellow-400",
      "text-orange-400",
      "text-green-500"
    );
    if (timeRemaining <= LOW_TIME_WARNING_SECONDS && timeRemaining > 0) {
      countdownTimer.classList.add("text-yellow-400", "pulse-red");
    } else if (timeRemaining > 0) {
      countdownTimer.classList.add("text-neutral-200");
    }

    // 3. Time's Up Check
    if (timeRemaining <= 0) {
      endGameByTime();
      return;
    }

    // 4. Decrement
    timeRemaining--;

    // 5. Save remaining time to Local Storage
    localStorage.setItem("ue5ScenarioTimer", timeRemaining.toString());
  }

  /**
   * Starts the main 30-minute countdown timer.
   * Loads time from storage or resets to default.
   */
  function startMainTimer(isInitialStart = false) {
    // Load time state
    if (isInitialStart) {
      timeRemaining = TOTAL_TEST_TIME_SECONDS;
      localStorage.removeItem("ue5ScenarioTimer");
    } else {
      const savedTime = localStorage.getItem("ue5ScenarioTimer");
      if (savedTime !== null) {
        timeRemaining = parseInt(savedTime, 10);
      } else {
        timeRemaining = TOTAL_TEST_TIME_SECONDS;
      }
    }

    // CRITICAL FIX: Ensure timer container is visible if time is > 0
    if (timerContainer && timeRemaining > 0) {
      timerContainer.classList.remove("hidden");
    }

    if (mainTimerInterval) clearInterval(mainTimerInterval);

    if (timeRemaining > 0) {
      updateMainTimerDisplay(); // Initial display update
      mainTimerInterval = setInterval(updateMainTimerDisplay, 1000); // Start the 1-second interval
    } else {
      endGameByTime(); // Time already ran out
    }
  }

  /**
   * Pauses the countdown timer without clearing state.
   */
  function pauseMainTimer() {
    if (mainTimerInterval) {
      clearInterval(mainTimerInterval);
      mainTimerInterval = null;
    }
  }

  /**
   * Resumes the countdown timer only if the assessment is incomplete.
   */
  function resumeMainTimer() {
    if (!mainTimerInterval) {
      const allComplete = Object.values(scenarioState).every(
        (state) => state.completed
      );
      if (!allComplete) {
        mainTimerInterval = setInterval(updateMainTimerDisplay, 1000);
      }
    }
  }

  // --- CORE GAME INITIALIZATION ---

  /**
   * Toggles the Debug Mode state and updates the UI visibility.
   */
  function toggleDebugMode(forceDisable = false) {
    if (forceDisable) {
      isDebugMode = false;
    } else {
      isDebugMode = !isDebugMode;
    }

    // Manually toggle UI state
    if (debugDropdown) {
      debugDropdown.classList.toggle("hidden", !isDebugMode);
    }

    // Update internal logic based on new mode
    if (isDebugMode) {
      pauseMainTimer();
    } else {
      resumeMainTimer();
    }

    // Update the visual status of the hidden toggle (for consistency)
    if (debugToggle) {
      debugToggle.checked = isDebugMode;
    }

    // Re-render current step to show/hide hints if a ticket is open
    if (currentScenarioId && currentStepId) {
      renderStep(currentScenarioId, currentStepId);
    }
  }

  /**

   * Shows the password input modal (delegated to DebugManager)
   */
  function showPasswordModal() {
    DebugManager.showPasswordModal(toggleDebugMode);
  }

  /**
   * The primary entry point for setting up the game state.
   */
  function initializeApp() {
    console.log("Initializing UE5 Scenario Tracker...");

    // --- NEW: Global Scenario Validation ---
    Object.entries(window.SCENARIOS).forEach(([id, scenario]) => {
      const report = Validator.validateScenario(id, scenario);
      if (!report.valid) {
        Validator.reportErrors(id, report.errors);
      }
    });

    // 1. --- AGGRESSIVE STATE CHECK AND RESET (Fixes infinite modal loop) ---
    const savedStateJSON = localStorage.getItem("ue5ScenarioState");
    let initialScenarioState = {};
    let allCompleteOnLoad = false;

    if (savedStateJSON) {
      try {
        initialScenarioState = JSON.parse(savedStateJSON);
      } catch (e) {
        console.error("Initial load failed, resetting saved state.");
      }
    }

    // Determine completion state based on potentially loaded data
    if (Object.keys(initialScenarioState).length > 0) {
      allCompleteOnLoad = Object.values(initialScenarioState).every(
        (s) => s.completed
      );
    }

    // CRITICAL FIX: If completed, clear the state immediately so the next load starts clean.
    let showCompletionModal = false;
    if (allCompleteOnLoad) {
      // We set a flag to show the modal *this time*
      showCompletionModal = true;

      // Then, we clear the data immediately so the next load gets a clean start.
      localStorage.removeItem("ue5ScenarioState"); // Clears the completion status
      localStorage.removeItem("ue5InterruptedSteps");
      localStorage.removeItem("ue5ActiveScenario");
      localStorage.removeItem("ue5ActiveStep");
      localStorage.removeItem("ue5ScenarioTimer");
    }
    // --- END AGGRESSIVE STATE CHECK ---

    // 2. Load data from local storage (this loads a default clean state if the state was just cleared above)
    loadScenarioState();
    loadInterruptedSteps();

    // 3. Check for crash recovery / active scenario
    const activeScenarioId = localStorage.getItem("ue5ActiveScenario");
    const activeStepId = localStorage.getItem("ue5ActiveStep");

    // 4. Start the timer (handles loading saved time or 30:00)
    startMainTimer();

    // 5. Render the backlog
    renderBacklog();

    // 6. Recover the active ticket view if the state was saved
    if (activeScenarioId && activeStepId) {
      selectScenario(activeScenarioId, activeStepId);
    }

    // 7. If completed on load, stop the timer and show the final modal immediately.
    if (showCompletionModal) {
      if (timerContainer) {
        timerContainer.classList.add("hidden");
      }
      toggleDebugMode(true); // Ensure debug mode is off
      stopTimerOnComplete();

      // Use the initial state's data (which still holds the score) to show the final modal
      let totalLoggedTime = Object.values(initialScenarioState).reduce(
        (acc, s) => acc + s.loggedTime,
        0
      );

      showAssessmentModal("complete", totalLoggedTime, initialScenarioState);
    }

    // 8. Initialize debug UI state (Dropdown is always hidden on start)
    if (debugDropdown) {
      debugDropdown.classList.add("hidden");
    }
  }

  // --- CORE INITIALIZATION HELPERS ---

  /**
   * Finds and assigns all necessary DOM elements to global variables.
   */
  function cacheDOMElements() {
    headerControls = document.getElementById("header-controls");
    backlogList = document.getElementById("backlog-list");
    ticketViewColumn = document.getElementById("ticket-view-column");
    ticketPlaceholder = document.getElementById("ticket-placeholder");
    ticketContent = document.getElementById("ticket-content");
    ticketTitle = document.getElementById("ticket-title");
    ticketDescription = document.getElementById("ticket-description");
    ticketStepContent = document.getElementById("ticket-step-content");
    debugToggle = document.getElementById("debug-toggle");
    countdownTimer = document.getElementById("countdown-timer");
    jiraBoard = document.getElementById("jira-board");
    timesUpScreen = document.getElementById("times-up-screen");
    restartTimerBtn = document.getElementById("restart-timer-btn");
    debugDropdown = document.getElementById("debug-dropdown");
    // Note: Key audit elements removed here.

    // Cache the timer's parent div for visibility control
    timerContainer = countdownTimer ? countdownTimer.parentElement : null;
  }

  /**
   * Checks if the test is currently running (i.e., not fully completed).
   */
  function isTestRunning() {
    const allComplete = Object.values(scenarioState).every(
      (state) => state.completed
    );
    return !allComplete;
  }

  /**
   * Attaches all primary event listeners.
   */
  function attachEventListeners() {
    // --- DEBUG TOGGLE (No Password Required) ---
    // Debug checkbox now controls debug mode directly
    if (debugToggle) {
      debugToggle.addEventListener("change", () => {
        toggleDebugMode();
      });
    }

    // --- HARD RESET (Clear Cache & Restart) ---
    const hardResetBtn = document.getElementById("hard-reset-btn");
    if (hardResetBtn) {
      hardResetBtn.addEventListener("click", () => {
        // Clear all app-related localStorage keys
        localStorage.removeItem("ue5ScenarioState");
        localStorage.removeItem("ue5ScenarioTimer");
        localStorage.removeItem("ue5ActiveScenario");
        localStorage.removeItem("ue5ActiveStep");
        localStorage.removeItem("ue5InterruptedSteps");

        // Reload the page to restart fresh
        window.location.reload();
      });
    }

    // --- CATEGORY FILTER DROPDOWN ---
    const categoryFilter = document.getElementById("category-filter");
    if (categoryFilter) {
      categoryFilter.addEventListener("change", (e) => {
        currentCategoryFilter = e.target.value;
        renderBacklog();
      });
    }
  }

  // generateTestKey and calculateIdealTime are now provided by ScoringManager module

  // --- STATE MANAGEMENT ---

  /**
   * Loads game state from localStorage, ensuring cleanup of old penalty/corrupted keys.
   */
  function loadScenarioState() {
    const savedStateJSON = localStorage.getItem("ue5ScenarioState");
    let savedState = {};

    if (savedStateJSON) {
      try {
        savedState = JSON.parse(savedStateJSON);
      } catch (e) {
        console.error("Failed to parse saved state, resetting.", e);
        savedState = {};
      }
    }

    const newScenarioState = {};

    Object.keys(window.SCENARIOS).forEach((scenarioId) => {
      const defaultState = {
        completed: false,
        loggedTime: 0,
        choicesMade: {},
      };

      newScenarioState[scenarioId] = {
        ...defaultState,
        ...(savedState[scenarioId] || {}),
      };

      // Recalculate logged time based on choicesMade to ensure consistency
      let recalculateTime = 0;
      if (newScenarioState[scenarioId].choicesMade) {
        const scenario = window.SCENARIOS[scenarioId];
        if (scenario) {
          Object.keys(newScenarioState[scenarioId].choicesMade).forEach(
            (stepId) => {
              const originalIndex =
                newScenarioState[scenarioId].choicesMade[stepId];
              // Skip filler choices (originalIndex = -1) and invalid indices
              if (
                originalIndex >= 0 &&
                scenario.steps[stepId] &&
                scenario.steps[stepId].choices &&
                scenario.steps[stepId].choices.length > originalIndex
              ) {
                recalculateTime += ScoringManager.getTimeCost(
                  scenario.steps[stepId].choices[originalIndex].type
                );
              }
            }
          );
        }
      }
      newScenarioState[scenarioId].loggedTime = recalculateTime;
    });

    scenarioState = newScenarioState;
    saveScenarioState();
  }

  /**
   * Saves the current game state to localStorage.
   */
  function saveScenarioState() {
    localStorage.setItem("ue5ScenarioState", JSON.stringify(scenarioState));
  }

  /**
   * Resets all scenario progress to default values.
   */
  function resetAllScenarioState() {
    scenarioState = {};
    Object.keys(window.SCENARIOS).forEach((scenarioId) => {
      scenarioState[scenarioId] = {
        completed: false,
        loggedTime: 0,
        choicesMade: {},
      };
    });
    interruptedSteps = {};
    saveScenarioState();
  }

  /**
   * Loads the interrupted steps map from localStorage.
   */
  function loadInterruptedSteps() {
    const savedInterruptedJSON = localStorage.getItem("ue5InterruptedSteps");
    if (savedInterruptedJSON) {
      try {
        interruptedSteps = JSON.parse(savedInterruptedJSON);
      } catch (e) {
        console.error("Failed to parse interrupted steps state, resetting.", e);
        interruptedSteps = {};
      }
    }
  }

  /**
   * Saves the currently active ticket state and the multi-ticket progress map.
   */
  function saveCurrentTicketState() {
    if (currentScenarioId && currentStepId) {
      localStorage.setItem("ue5ActiveScenario", currentScenarioId);
      localStorage.setItem("ue5ActiveStep", currentStepId);
    } else {
      localStorage.removeItem("ue5ActiveScenario");
      localStorage.removeItem("ue5ActiveStep");
    }

    localStorage.setItem(
      "ue5InterruptedSteps",
      JSON.stringify(interruptedSteps)
    );
  }

  // --- UI RENDERING & FLOW ---
  // getTimeColorClass is now provided by ScoringManager module

  /**
   * Renders the list of tickets in the backlog (left column) - Assessment Module Style.
   */
  function renderBacklog() {
    BacklogRenderer.render({
      container: backlogList,
      scenarioState: scenarioState,
      interruptedSteps: interruptedSteps,
      currentScenarioId: currentScenarioId,
      currentCategoryFilter: currentCategoryFilter,
      onSelectScenario: selectScenario,
    });
  }

  /**
   * Renders a specific step (prompt and choices) of a scenario - Professional Evaluation Style.
   */
  function renderStep(scenarioId, stepId) {
    const scenario = window.SCENARIOS[scenarioId];
    const step = scenario?.steps?.[stepId];

    if (!step) {
      console.error(`Step "${stepId}" not found in scenario "${scenarioId}"`);
      return;
    }

    // 1. Update the active ticket references
    currentScenarioId = scenarioId;
    currentStepId = stepId;

    // Save the progress of the currently active ticket in the interrupted map
    interruptedSteps[currentScenarioId] = currentStepId;
    saveCurrentTicketState();

    // 2. Resume timer if not in debug mode
    if (!isDebugMode) {
      resumeMainTimer();
    }

    // 3. Delegate UI rendering to StepRenderer module
    StepRenderer.render(scenarioId, stepId, {
      container: ticketStepContent,
      isDebugMode: isDebugMode,
      shuffledChoicesCache: shuffledChoicesCache,
      onChoiceClick: handleChoice,
      onRenderComplete: renderBacklog,
    });
  }

  /**
   * Called when a user clicks an answer choice.
   * Delegates parsing and navigation to ChoiceHandler module.
   */
  async function handleChoice(choiceButton) {
    // Prevent rapid clicking - use ChoiceHandler state
    if (ChoiceHandler.isProcessing()) {
      console.log("[Game] Choice already processing, ignoring click");
      return;
    }
    ChoiceHandler.setProcessing(true);

    // Get current step data
    const scenarioData = window.SCENARIOS[currentScenarioId];
    const step = scenarioData.steps[currentStepId];

    // Parse choice using ChoiceHandler
    const { choice, timeCost, index, choiceNext, isCorrect } =
      ChoiceHandler.parseChoice(choiceButton, step);

    // Update scenario state
    const state = scenarioState[currentScenarioId];
    state.loggedTime += timeCost;
    state.choicesMade[currentStepId] = index;
    saveScenarioState();

    // Process via Scenario Engine
    try {
      const result = await ScenarioEngine.makeChoice(index);
      console.log("[Game] Choice processed:", result);

      // Get navigation action from ChoiceHandler
      const action = ChoiceHandler.getNavigationAction({
        result,
        isCorrect,
        choice,
        currentStepId,
        choiceNext,
      });

      // Execute navigation action
      switch (action.type) {
        case "finish":
          finishScenario();
          return;
        case "navigate-with-feedback":
          showChoiceFeedback(choice, () => {
            if (action.stepId !== currentStepId) {
              currentStepId = action.stepId;
              renderStep(currentScenarioId, currentStepId);
            }
          });
          break;
        case "stay-with-feedback":
          showChoiceFeedback(choice, () => {
            console.log("[Game] Staying on current step, feedback displayed.");
          });
          break;
        case "navigate":
        default:
          currentStepId = action.stepId;
          renderStep(currentScenarioId, currentStepId);
          break;
      }
    } catch (err) {
      console.error("[Game] Failed to process choice via Engine:", err);
    } finally {
      // Re-enable clicking after processing
      setTimeout(() => ChoiceHandler.setProcessing(false), 100);
    }
  }

  /**
   * Shows inline feedback for choices (delegated to FeedbackManager with navigation logic).
   * @param {Object} choice - The choice object containing feedback text and type.
   * @param {Function} callback - Function to call after feedback is shown.
   */
  function showChoiceFeedback(choice, callback) {
    const stepContent = document.getElementById("ticket-step-content");

    // Determine if this leads to a new step
    const targetStep = choice.next;
    const willNavigate = targetStep !== currentStepId;

    // Use FeedbackManager to show feedback
    FeedbackManager.showChoiceFeedback({
      choice: choice,
      container: stepContent,
      onContinue:
        callback && willNavigate
          ? () => {
              console.log("[Game] Feedback will auto-navigate in 1.5s...");
              setTimeout(callback, 1500);
            }
          : callback,
    });
  }

  /**
   * Called when a user clicks a scenario card from the backlog.
   */
  async function selectScenario(scenarioId, startStepId = null) {
    const scenario = window.SCENARIOS[scenarioId];
    if (!scenario) return;

    // Save previous ticket's progress
    if (
      currentScenarioId &&
      currentStepId &&
      currentScenarioId !== scenarioId
    ) {
      interruptedSteps[currentScenarioId] = currentStepId;
      saveCurrentTicketState();
    }

    // --- NEW: Load via Scenario Engine ---
    try {
      const initialStep = await ScenarioEngine.load(scenarioId, scenario);
      if (!initialStep) return; // Validation failed
    } catch (err) {
      console.error("[Game] Failed to load scenario:", err);
      return;
    }

    // Determine starting step
    currentScenarioId = scenarioId;
    currentStepId =
      startStepId || interruptedSteps[scenarioId] || scenario.start;

    // Update ticket header
    ticketTitle.textContent = scenario.meta.title || scenario.title;
    ticketDescription.textContent =
      (scenario.meta && scenario.meta.description) ||
      scenario.description ||
      "";

    // Show ticket content, hide placeholder
    ticketPlaceholder.classList.add("hidden");
    ticketContent.classList.remove("hidden");

    // Render the chosen step
    renderStep(scenarioId, currentStepId);

    // Auto-scroll to scenario content on mobile (when layout stacks vertically)
    // Use setTimeout to ensure DOM has fully updated after render
    if (window.innerWidth < 768) {
      setTimeout(() => {
        ticketContent.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }

    // Notify Capture UI for metadata sync
    window.dispatchEvent(
      new CustomEvent("scenario:step", {
        detail: { scenarioId, stepId: currentStepId },
      })
    );
  }

  /**
   * Called when the user completes the final step of a scenario.
   */
  function finishScenario() {
    console.log("[Game] finishScenario called for:", currentScenarioId);

    // Mark as completed
    const state = scenarioState[currentScenarioId];
    if (state) {
      state.completed = true;
      console.log("[Game] State marked as completed.");
    }

    // Clear its step from the interrupted map since it's done
    if (interruptedSteps[currentScenarioId]) {
      delete interruptedSteps[currentScenarioId];
    }

    saveScenarioState();
    saveCurrentTicketState();
    renderBacklog();

    // Check if all scenarios are done (triggers final modal)
    const allComplete = Object.values(scenarioState).every((s) => s.completed);
    console.log("[Game] All scenarios complete check:", allComplete);

    if (allComplete) {
      console.log("[Game] Triggering final assessment modal.");
      let totalLoggedTime = Object.values(scenarioState).reduce(
        (acc, s) => acc + s.loggedTime,
        0
      );
      stopTimerOnComplete();
      showAssessmentModal("complete", totalLoggedTime);
    } else {
      console.log("[Game] Rendering single ticket conclusion.");
      // Show the individual ticket conclusion inline
      pauseMainTimer();
      renderSingleTicketConclusion();
    }
  }

  /**
   * Renders the final summary screen for a completed scenario directly into the ticket panel.
   */
  function renderSingleTicketConclusion() {
    const state = scenarioState[currentScenarioId];
    const scenario = window.SCENARIOS[currentScenarioId];
    const estimateHours = scenario.meta.estimateHours;
    const loggedHours = state.loggedTime;

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

    const buttonText = "Back to Backlog";
    const buttonId = "close-scenario-btn";

    const conclusionHtml = `
            <div class="text-center p-8">
                <h3 class="text-3xl font-bold ${timeColorClass} mb-6">Ticket Resolved</h3>
                <p class="text-lg text-gray-300 mb-8">${summaryMessage}</p>

                <div class="max-w-md mx-auto bg-neutral-700/50 p-6 rounded-lg">
                    <h4 class="text-xl font-semibold text-gray-100 mb-4">Ticket Time Breakdown (Step Cost)</h4>
                    <div class="space-y-3 text-left">
                        <div class="flex justify-between text-gray-300">
                            <span>Logged Fix Time:</span>
                            <span class="font-bold">${loggedHours.toFixed(
                              1
                            )} hrs</span>
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

                <button id="${buttonId}" class="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-200">
                    ${buttonText}
                </button>
            </div>
        `;

    ticketStepContent.innerHTML = conclusionHtml;

    // Add event listener to the close button
    document.getElementById(buttonId).addEventListener("click", () => {
      // Reset UI to placeholder state
      ticketContent.classList.add("hidden");
      ticketPlaceholder.classList.remove("hidden");

      currentScenarioId = null;
      currentStepId = null;

      saveCurrentTicketState();

      renderBacklog();

      // Resume the timer now that the user is selecting the next task
      resumeMainTimer();
    });
  }

  /**
   * Stops the game when the timer runs out.
   */
  function endGameByTime() {
    clearInterval(mainTimerInterval);
    localStorage.removeItem("ue5ScenarioTimer");

    if (timerContainer) {
      timerContainer.classList.add("hidden");
    }

    countdownTimer.classList.remove(
      "pulse-red",
      "text-neutral-200",
      "text-yellow-400"
    );
    countdownTimer.classList.add("text-orange-400");
    countdownTimer.textContent = "00:00";

    // Show "Time's Up" modal
    showAssessmentModal("timeout");
  }

  /**
   * Stops the timer when all scenarios are completed.
   */
  function stopTimerOnComplete() {
    clearInterval(mainTimerInterval);
    localStorage.removeItem("ue5ScenarioTimer");

    // HIDE THE TIMER DISPLAY ENTIRELY
    if (timerContainer) {
      timerContainer.classList.add("hidden");
    }

    // Ensure no low-time colors here
    countdownTimer.classList.remove(
      "pulse-red",
      "text-neutral-200",
      "text-yellow-400",
      "text-orange-400"
    );
    countdownTimer.classList.add("text-green-500");
    countdownTimer.textContent = "Complete!";
  }

  /**
   * Assessment modal rendering function (ONLY for final, global status).
   * Delegated to AssessmentModal module.
   * @param {string} status - 'timeout' or 'complete'.
   * @param {number|null} [totalLoggedTime=null] - Total simulated time in hours.
   * @param {object} [stateToUse=scenarioState] - The state object to use for generating the key.
   */
  function showAssessmentModal(
    status,
    totalLoggedTime = null,
    stateToUse = scenarioState
  ) {
    AssessmentModal.show(status, totalLoggedTime, stateToUse, {
      pauseTimer: pauseMainTimer,
      timesUpScreen: timesUpScreen,
      jiraBoard: jiraBoard,
      passThreshold: PASS_THRESHOLD,
    });
  }

  // --- UI STATE TESTING HELPER (now using TestUtils module) ---
  window.testUIState = function () {
    return TestUtils.runUIChecks({
      currentScenarioId,
      scenarioState,
    });
  };

  // --- Entry Point ---
  cacheDOMElements();
  attachEventListeners();
  initializeApp();

  // --- DEBUG NAVIGATION (delegated to DebugNavigation module) ---
  if (window.DebugNavigation) {
    DebugNavigation.init({
      getState: () => ({
        currentScenarioId,
        currentStepId,
      }),
      renderStep: (scenarioId, stepId) => {
        currentStepId = stepId;
        renderStep(scenarioId, stepId);
      },
    });
  }
});
