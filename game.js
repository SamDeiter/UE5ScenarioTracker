// --- IMAGE MODAL FUNCTIONS (Global scope for onclick handlers) ---
function openImageModal(imageSrc) {
  let modal = document.getElementById("image-modal-overlay");
  if (!modal) {
    // Create modal if it doesn't exist
    modal = document.createElement("div");
    modal.id = "image-modal-overlay";
    modal.className = "image-modal-overlay";
    modal.innerHTML = `
      <span class="image-modal-close" onclick="closeImageModal()">&times;</span>
      <img src="" alt="Expanded view" />
    `;
    modal.onclick = (e) => {
      if (e.target === modal) closeImageModal();
    };
    document.body.appendChild(modal);
  }
  modal.querySelector("img").src = imageSrc;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeImageModal() {
  const modal = document.getElementById("image-modal-overlay");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeImageModal();
});

// Wait for the DOM to be fully loaded before running the game logic
document.addEventListener("DOMContentLoaded", () => {
  // --- GLOBAL CONFIGURATION ---
  const TOTAL_TEST_TIME_SECONDS = 30 * 60; // Total 30 minutes for the assessment countdown timer
  const LOW_TIME_WARNING_SECONDS = 5 * 60; // Time remaining threshold to trigger pulsing red timer
  const PASS_THRESHOLD = 0.8; // Pass if (Ideal Time / Logged Time) >= 80%
  const DEBUG_PASSWORD = "IloveUnreal"; // Secret password to enable Debug Mode

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
  let mainTimerInterval = null; // ID for the setInterval used for the 30-minute countdown
  let shuffledChoicesCache = {}; // Stores shuffled choice order per scenario+step so it doesn't reshuffle on retry
  let currentCategoryFilter = "all"; // Current category filter selection

  let timeRemaining = TOTAL_TEST_TIME_SECONDS; // Remaining time on the countdown timer

  // --- ENCODING UTILITIES (Restored for Test Key Generation) ---
  /**
   * Encodes a string to a Unicode-safe Base64 string.
   */
  function base64EncodeUnicode(str) {
    const utf8Bytes = encodeURIComponent(str).replace(
      /%([0-9A-F]{2})/g,
      function (match, p1) {
        return String.fromCharCode("0x" + p1);
      }
    );
    return btoa(utf8Bytes);
  }

  // --- TIMER & TIME UTILITIES ---

  /**
   * Converts total seconds into MM:SS format for display.
   */
  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }

  /**
   * Calculates the time cost in hours based on the choice type.
   * @param {string} type - 'correct', 'partial', 'misguided', 'wrong'.
   * @returns {number} Time cost in hours.
   */
  function getTimeCostForChoice(type) {
    switch (type) {
      case "correct":
        return 0.5; // Optimal
      case "partial":
        return 1.0; // Standard
      case "misguided":
        return 1.5; // Extended
      case "wrong":
        return 2.0; // Maximum
      default:
        return 0;
    }
  }

  // --- TIMER LOGIC ---

  /**
   * Updates the main timer display, applies visual cues (pulse-red), and handles expiry.
   */
  function updateMainTimerDisplay() {
    // 1. Update Display
    countdownTimer.textContent = formatTime(timeRemaining);

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
   * Shows the password input modal when the secret key combination is pressed.
   */
  function showPasswordModal() {
    if (debugAccessState.passwordModalVisible) return;
    debugAccessState.passwordModalVisible = true;

    const modalHtml = `
            <div id="password-modal" class="fixed inset-0 bg-gray-900 bg-opacity-75 z-[999] flex items-center justify-center">
                <div class="bg-gray-800 p-8 rounded-xl shadow-2xl text-center max-w-sm w-full">
                    <h3 class="text-xl font-bold text-neutral-100 mb-4">Administrator Access Required</h3>
                    <p class="text-gray-300 mb-6">Enter the password to enable Debug Mode:</p>
                    <input type="password" id="password-input" placeholder="Password..." 
                           class="w-full p-3 rounded-lg bg-neutral-700 border border-neutral-600 text-yellow-300 focus:ring-emerald-500 focus:border-emerald-500 text-center mb-4">
                    <div class="flex justify-around space-x-3">
                        <button id="submit-password" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all duration-200">
                            Enable
                        </button>
                        <button id="cancel-password" class="flex-1 bg-neutral-600 hover:bg-neutral-700 text-white font-semibold py-2 rounded-lg transition-all duration-200">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);

    const modal = document.getElementById("password-modal");
    const input = document.getElementById("password-input");

    input.focus();

    const cleanup = () => {
      modal.remove();
      debugAccessState.passwordModalVisible = false;
    };

    const checkPassword = () => {
      if (input.value === DEBUG_PASSWORD) {
        toggleDebugMode(); // Enable Debug Mode
        cleanup();
      } else {
        input.value = "";
        input.placeholder = "Incorrect Password!";
        input.classList.add("ring-2", "ring-red-500");
        setTimeout(() => {
          input.classList.remove("ring-2", "ring-red-500");
        }, 1000);
      }
    };

    document
      .getElementById("submit-password")
      .addEventListener("click", checkPassword);
    document
      .getElementById("cancel-password")
      .addEventListener("click", cleanup);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        checkPassword();
      } else if (e.key === "Escape") {
        cleanup();
      }
    });
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

  /**
   * Calculates the total ideal time (0.5 hours per step) across all scenarios.
   */
  function calculateTotalIdealTime() {
    let totalSteps = 0;

    Object.values(window.SCENARIOS).forEach((scenario) => {
      if (scenario.steps) {
        // Only count steps marked as core tasks if needed, but for simplicity, counting all steps now
        totalSteps += Object.keys(scenario.steps).length;
      }
    });
    return {
      totalSteps: totalSteps,
      idealTotalTime: totalSteps * 0.5,
    };
  }

  /**
   * Serializes all scenario choices into a compact, stable Base64 JSON string.
   * RESTORED FOR TRACKING PURPOSES.
   */
  function generateTestKey(stateToSerialize = scenarioState) {
    const compactData = {};

    Object.keys(stateToSerialize).forEach((scenarioId) => {
      const state = stateToSerialize[scenarioId];
      if (Object.keys(state.choicesMade).length > 0) {
        // choicesMade contains the original (unshuffled) index, ensuring stability.
        compactData[scenarioId] = state.choicesMade;
      }
    });

    if (Object.keys(compactData).length === 0) {
      return "No Choices Recorded";
    }

    try {
      const jsonString = JSON.stringify(compactData);
      return base64EncodeUnicode(jsonString);
    } catch (e) {
      console.error("Failed to generate test key:", e);
      return "ERROR_SERIALIZING_CHOICES";
    }
  }

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
              if (
                scenario.steps[stepId] &&
                scenario.steps[stepId].choices.length > originalIndex
              ) {
                recalculateTime += getTimeCostForChoice(
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

  /**
   * Determines the color class for time logged vs. estimate.
   */
  function getLoggedTimeColorClass(logged, estimate) {
    if (logged <= estimate) {
      return "text-green-400";
    }

    const overBudgetRatio = logged / estimate;

    if (overBudgetRatio <= 1.2) {
      return "text-yellow-400";
    } else if (overBudgetRatio <= 1.4) {
      return "text-orange-400";
    } else {
      return "text-red-400";
    }
  }

  /**
   * Renders the list of tickets in the backlog (left column) - Assessment Module Style.
   */
  function renderBacklog() {
    backlogList.innerHTML = "";

    const scenarioKeys = Object.keys(window.SCENARIOS);

    const validScenarios = scenarioKeys
      .map((id) => ({ id, data: window.SCENARIOS[id] }))
      .filter(
        (item) =>
          item.data &&
          item.data.meta &&
          item.data.meta.title &&
          typeof item.data.meta.estimateHours !== "undefined"
      );

    // Apply category filter
    const filteredScenarios = validScenarios.filter((item) => {
      if (currentCategoryFilter === "all") return true;

      // Get category from meta and normalize it
      const meta = item.data.meta;
      let rawCategory = (meta.category || "").toLowerCase();

      // Normalize: replace non-alphanumeric with single underscore, trim underscores
      let category = rawCategory
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

      // Map old category names to new learning area filter values
      const categoryMap = {
        // Lighting & Rendering variations
        lighting_rendering: "look_dev",
        lighting: "look_dev",
        rendering: "look_dev",
        // Materials & Shaders variations
        materials_shaders: "look_dev",
        materials: "look_dev",
        shaders: "look_dev",
        // Physics & Collisions variations
        physics_collisions: "game_dev",
        physics: "game_dev",
        collisions: "game_dev",
        // Blueprints & Logic variations
        blueprints_logic: "game_dev",
        blueprints: "game_dev",
        logic: "game_dev",
        // Sequencer & Cinematics variations
        sequencer_cinematics: "vfx",
        sequencer: "vfx",
        cinematics: "vfx",
        // Asset Management variations
        asset_management: "tech_art",
        assets: "tech_art",
        // World Partition & Streaming variations
        world_partition_streaming: "worldbuilding",
        world_partition: "worldbuilding",
        streaming: "worldbuilding",
        // UI variations
        ui: "game_dev",
        user_interface: "game_dev",
        // Direct matches for new categories
        worldbuilding: "worldbuilding",
        game_dev: "game_dev",
        look_dev: "look_dev",
        tech_art: "tech_art",
        vfx: "vfx",
      };

      const mappedCategory = categoryMap[category] || category;
      return mappedCategory === currentCategoryFilter;
    });

    // Update overall progress display if it exists
    const completedCount = filteredScenarios.filter(
      (item) => scenarioState[item.id]?.completed
    ).length;
    const progressText = document.getElementById("progress-text");
    const progressBar = document.getElementById("progress-bar");
    if (progressText) {
      const filterLabel =
        currentCategoryFilter === "all"
          ? ""
          : ` (${currentCategoryFilter.replace("_", " ")})`;
      progressText.textContent = `${completedCount} of ${filteredScenarios.length} modules complete${filterLabel}`;
    }
    if (progressBar) {
      const percentage =
        filteredScenarios.length > 0
          ? (completedCount / filteredScenarios.length) * 100
          : 0;
      progressBar.style.width = `${percentage}%`;
    }

    filteredScenarios.forEach((item, index) => {
      const scenarioId = item.id;
      const scenario = item.data;
      const state = scenarioState[scenarioId];

      const meta = scenario.meta;
      const title = meta.title;
      const category = (meta.category || "General").toLowerCase();
      const questionCount = scenario.steps
        ? Object.keys(scenario.steps).filter((k) => k !== "conclusion").length
        : 0;

      let estimate = parseFloat(meta.estimateHours);
      if (isNaN(estimate)) estimate = 0;

      const card = document.createElement("div");
      const isActive = currentScenarioId === scenarioId && !state.completed;

      // Build class list for scenario card
      let cardClasses = "scenario-card mb-3";
      if (state.completed) cardClasses += " completed";
      if (isActive) cardClasses += " active";

      card.className = cardClasses;
      card.dataset.scenarioId = scenarioId;

      // Status pill HTML
      let statusPillHtml;
      const logged = state.loggedTime;

      if (state.completed) {
        statusPillHtml = `<span class="status-pill completed">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Completed
                </span>`;
      } else {
        const savedStepId = interruptedSteps[scenarioId];
        if (savedStepId && savedStepId !== scenario.start) {
          statusPillHtml = `<span class="status-pill in-progress">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        In Progress
                    </span>`;
        } else {
          statusPillHtml = `<span class="status-pill not-started">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                        Not Started
                    </span>`;
        }
      }

      // Metrics row
      let metricsHtml = "";
      if (state.completed) {
        const loggedColorClass = getLoggedTimeColorClass(logged, estimate);
        metricsHtml = `
                    <div class="flex justify-between text-xs mt-2">
                        <span class="text-gray-500">Time Logged</span>
                        <span class="${loggedColorClass} font-semibold">${logged.toFixed(
          1
        )} hrs</span>
                    </div>
                `;
      } else if (logged > 0) {
        metricsHtml = `
                    <div class="flex justify-between text-xs mt-2">
                        <span class="text-gray-500">Progress</span>
                        <span class="text-yellow-400 font-semibold">${logged.toFixed(
                          1
                        )} hrs logged</span>
                    </div>
                `;
      }

      const html = `
                <div class="flex items-start justify-between mb-2">
                    <span class="category-badge ${category}">${category}</span>
                </div>
                <h4 class="font-bold text-sm ${
                  state.completed
                    ? "text-gray-500 line-through"
                    : "text-gray-100"
                } mb-1">
                    Module ${index + 1}: ${title}
                </h4>
                <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50">
                    ${statusPillHtml}
                    <span class="text-xs text-gray-500">${estimate.toFixed(
                      1
                    )} hrs est.</span>
                </div>
                ${metricsHtml}
            `;

      card.innerHTML = html;

      if (!state.completed) {
        card.addEventListener("click", () => selectScenario(scenarioId));
      }

      backlogList.appendChild(card);
    });
  }

  /**
   * Renders a specific step (prompt and choices) of a scenario - Professional Evaluation Style.
   */
  function renderStep(scenarioId, stepId) {
    const scenario = window.SCENARIOS[scenarioId];
    const step = scenario.steps[stepId];

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

    // 3. Get or create shuffled choices (only shuffle once per step)
    const cacheKey = `${scenarioId}_${stepId}`;
    if (!shuffledChoicesCache[cacheKey]) {
      shuffledChoicesCache[cacheKey] = [...step.choices].sort(
        () => Math.random() - 0.5
      );
    }
    const shuffledChoices = shuffledChoicesCache[cacheKey];

    // 4. Determine Step Number for display
    const stepKeys = Object.keys(scenario.steps).filter(
      (k) => k !== "conclusion"
    );
    const stepIndex = stepKeys.indexOf(stepId);
    const stepNumber = stepIndex !== -1 ? stepIndex + 1 : 1;
    const totalSteps = stepKeys.length;

    // 5. Build step progress dots (HIDDEN per user request)
    let progressDotsHtml = '<div class="step-progress-container hidden">';
    stepKeys.forEach((key, idx) => {
      let dotClass = "step-dot";
      if (idx < stepIndex) dotClass += " completed";
      else if (idx === stepIndex) dotClass += " current";
      progressDotsHtml += `<div class="${dotClass}"></div>`;
    });
    progressDotsHtml += `<span class="ml-3 text-xs text-gray-500">Question ${stepNumber} of ${totalSteps}</span></div>`;

    // 6. Build screenshot HTML if image_path exists
    let screenshotHtml = "";
    if (step.image_path) {
      let imageSrc = step.image_path;
      if (!imageSrc.startsWith("assets/")) {
        // Look in scenario-specific folder: assets/generated/scenario_id/image.png
        imageSrc = `assets/generated/${scenarioId}/${imageSrc}`;
      }
      screenshotHtml = `
                <div class="screenshot-area mb-6" onclick="openImageModal('${imageSrc}')">
                    <img 
                        src="${imageSrc}" 
                        alt="${
                          scenario.meta ? scenario.meta.title : scenario.title
                        }" 
                        class="w-full rounded-lg border border-gray-700"
                        onerror="this.src='assets/generated/${scenarioId}/viewport.png'; this.onerror=function(){ this.src='assets/generated/directional_light/viewport.png'; this.onerror=null; };"
                    />
                </div>
            `;
    }

    // 7. Build the Step Prompt and Choices with assessment styling
    // Layout: Two-column (Prompt | Image) -> Choices below
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

    ticketStepContent.innerHTML = stepHtml;

    const choicesContainer = ticketStepContent.querySelector(
      "#ticket-step-choices"
    );
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

    // 8. Create Choice Buttons with letter prefixes
    shuffledChoices.forEach((choice, shuffledIndex) => {
      const timeCost = getTimeCostForChoice(choice.type);
      const letter = letters[shuffledIndex] || String(shuffledIndex + 1);

      const btn = document.createElement("button");

      // Determine button styling based on debug mode
      let extraClasses = "";
      let debugLabelHtml = "";

      if (isDebugMode) {
        if (choice.type === "correct") {
          extraClasses = "debug-correct";
        } else if (choice.type === "partial") {
          extraClasses = "debug-partial";
        } else if (choice.type === "misguided") {
          extraClasses = "debug-wrong";
        } else {
          extraClasses = "debug-wrong";
        }

        const typeLabels = {
          correct: "OPTIMAL",
          partial: "ACCEPTABLE",
          misguided: "SUBOPTIMAL",
          wrong: "INCORRECT",
        };
        debugLabelHtml = `
                    <div class="text-xs mt-2 pt-2 border-t border-gray-700/50">
                        <span class="font-semibold uppercase tracking-wider ${
                          choice.type === "correct"
                            ? "text-green-400"
                            : choice.type === "partial"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }">${typeLabels[choice.type] || "INCORRECT"}</span>
                        <span class="text-gray-500 ml-2">+${timeCost.toFixed(
                          1
                        )} hrs</span>
                    </div>
                `;
      }

      btn.className = `choice-button ${extraClasses}`;

      btn.innerHTML = `
                <span class="choice-letter">${letter}</span>
                <div class="choice-text">
                    ${choice.text}
                    ${debugLabelHtml}
                </div>
            `;

      // Attach data
      btn.dataset.choiceNext = choice.next;
      btn.dataset.choiceTimeCost = timeCost;

      const originalIndexInChoices = step.choices.indexOf(choice);
      btn.dataset.originalIndex =
        originalIndexInChoices !== -1 ? originalIndexInChoices : -1;

      btn.addEventListener("click", () => handleChoice(btn));
      choicesContainer.appendChild(btn);
    });

    renderBacklog();
  }

  /**
   * Marks the current scenario as complete and returns to the backlog.
   */
  function finishScenario() {
    if (!currentScenarioId) return;

    console.log("[Game] Finishing scenario:", currentScenarioId);

    // Mark as completed
    if (scenarioState[currentScenarioId]) {
      scenarioState[currentScenarioId].completed = true;
    }

    // Clear any interrupted step for this scenario
    delete interruptedSteps[currentScenarioId];

    // Save state
    saveScenarioState();
    saveCurrentTicketState();

    // Clear current scenario
    currentScenarioId = null;
    currentStepId = null;

    // Return to backlog
    renderBacklog();

    // Show the backlog column
    const ticketStep = document.getElementById("ticket-step");
    if (ticketStep) {
      ticketStep.innerHTML = `
        <div class="flex items-center justify-center h-full text-gray-500">
          <p>Select a module from the left to begin.</p>
        </div>
      `;
    }
  }

  /**
   * Called when a user clicks an answer choice.
   */
  /**
   * Called when a user clicks an answer choice.
   */
  async function handleChoice(choiceButton) {
    const { choiceNext, choiceTimeCost, originalIndex } = choiceButton.dataset;
    const timeCost = parseFloat(choiceTimeCost);
    const index = parseInt(originalIndex, 10);

    // Get the choice data to access feedback
    const scenarioData = window.SCENARIOS[currentScenarioId];
    const step = scenarioData.steps[currentStepId];
    const choice = step.choices[index];
    const isCorrect = choice && choice.type === "correct";

    // 1. Log the time cost (updates global state)
    const state = scenarioState[currentScenarioId];
    state.loggedTime += timeCost;

    // 2. Record the original index of the choice made
    state.choicesMade[currentStepId] = index;

    saveScenarioState();

    // --- NEW: Process via Scenario Engine ---
    try {
      const result = await ScenarioEngine.makeChoice(index);
      console.log("[Game] Choice processed:", result);

      if (result.type === "complete") {
        console.log("[Game] Scenario transition to finish...");
        finishScenario();
        return;
      }

      // 3. Handle Navigation and Feedback
      if (isCorrect && choice && choice.feedback) {
        console.log("[Game] Showing feedback for correct choice");
        // Correct answer - show positive feedback first, then navigate
        showChoiceFeedback(choice, () => {
          currentStepId = result.step.id || choiceNext;
          renderStep(currentScenarioId, currentStepId);
        });
      } else if (!isCorrect && choice && choice.feedback) {
        console.log("[Game] Showing feedback for suboptimal choice");
        // Wrong answer - show feedback first, then navigate
        showChoiceFeedback(choice, () => {
          // If we are staying on the same step, don't re-render everything (which clears feedback)
          if (result.step.id === currentStepId) {
            console.log("[Game] Staying on current step, feedback displayed.");
          } else {
            currentStepId = result.step.id || choiceNext;
            renderStep(currentScenarioId, currentStepId);
          }
        });
      } else {
        // Move immediately (no feedback to show)
        currentStepId = result.step.id || choiceNext;
        renderStep(currentScenarioId, currentStepId);
      }
    } catch (err) {
      console.error("[Game] Failed to process choice via Engine:", err);
    }
  }

  /**
   * Shows inline feedback for incorrect choices in a professional manner.
   * @param {Object} choice - The choice object containing feedback text and type.
   * @param {Function} callback - Function to call after feedback is shown.
   */
  function showChoiceFeedback(choice, callback) {
    // Determine feedback styling based on choice type - professional color scheme
    let borderColor = "border-red-500";
    let bgColor = "bg-red-900/10";
    let textColor = "text-red-300";
    let severity = "Consider this...";
    let icon = "ⓘ";

    if (choice.type === "correct") {
      borderColor = "border-green-500";
      bgColor = "bg-green-900/20";
      textColor = "text-green-300";
      severity = "Correct!";
      icon = "✓";
    } else if (choice.type === "partial" || choice.type === "plausible") {
      borderColor = "border-yellow-500";
      bgColor = "bg-yellow-900/10";
      textColor = "text-yellow-300";
      severity = "Almost there...";
    } else if (choice.type === "misguided" || choice.type === "subtle") {
      borderColor = "border-orange-500";
      bgColor = "bg-orange-900/10";
      textColor = "text-orange-300";
      severity = "Think about it...";
    }

    // Create inline feedback banner - professional and subtle
    const feedbackBanner = document.createElement("div");
    feedbackBanner.id = "inline-feedback-banner";
    feedbackBanner.className = `${bgColor} ${borderColor} border-l-4 p-4 mb-6 rounded-r-lg animate-slideIn`;
    feedbackBanner.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="${textColor} text-lg">${icon}</div>
                <div class="flex-1">
                    <div class="${textColor} font-semibold text-sm mb-1">${severity}</div>
                    <div class="text-gray-300 text-sm leading-relaxed prose prose-sm prose-invert">
                        ${
                          choice.feedback ||
                          "This approach may not be optimal. Please reconsider."
                        }
                    </div>
                </div>
                <button class="text-gray-400 hover:text-gray-200 transition-colors" onclick="this.parentElement.parentElement.remove()">
                    ×
                </button>
            </div>
        `;

    // Insert banner at the top of step content (before prompt)
    const stepContent = document.getElementById("ticket-step-content");
    if (stepContent && stepContent.firstChild) {
      stepContent.insertBefore(feedbackBanner, stepContent.firstChild);

      // Scroll banner into view smoothly
      feedbackBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });

      // Auto-dismiss after 5 seconds for better UX
      setTimeout(() => {
        if (feedbackBanner.parentElement) {
          feedbackBanner.style.opacity = "0";
          feedbackBanner.style.transition = "opacity 0.5s";
          setTimeout(() => feedbackBanner.remove(), 500);
        }
      }, 5000);
    }

    // Call callback - delayed if it leads to a new step
    if (callback) {
      const scenarioData = window.SCENARIOS[currentScenarioId];
      const step = scenarioData.steps[currentStepId];
      const targetStep = choice.next;

      if (targetStep !== currentStepId) {
        // If it leads to a new step, give them time to read it
        console.log("[Game] Feedback will auto-navigate in 1.5s...");
        setTimeout(callback, 1500);
      } else {
        // If it stays on the same step, just run the callback (which might do nothing per my update above)
        callback();
      }
    }
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

    const timeColorClass = getLoggedTimeColorClass(loggedHours, estimateHours);

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
   * @param {string} status - 'timeout' or 'complete'.
   * @param {number|null} [totalLoggedTime=null] - Total simulated time in hours.
   * @param {object} [stateToUse=scenarioState] - The state object to use for generating the key.
   */
  function showAssessmentModal(
    status,
    totalLoggedTime = null,
    stateToUse = scenarioState
  ) {
    pauseMainTimer(); // Ensure timer stops when the modal appears

    let mainTitle, subText, mainTitleColor;
    let finalStatsHtml = "";
    let buttonHtml = "";

    // Determine completion based on the state that was passed in
    const allScenariosComplete = Object.values(stateToUse).every(
      (s) => s.completed
    );

    if (status === "timeout") {
      // TIME'S UP status
      mainTitle = "Time's Up!";
      subText = "The assessment period has ended. Assessment incomplete.";
      mainTitleColor = "text-orange-400";

      buttonHtml = `
                <p class="text-sm text-gray-400 mt-4">This assessment is incomplete.</p>
            `;
    } else if (allScenariosComplete || totalLoggedTime !== null) {
      // ASSESSMENT COMPLETE status

      // 1. Calculate final scores
      if (totalLoggedTime === null) {
        // Should not happen if called correctly, but falls back to current live state if time is null
        totalLoggedTime = Object.values(stateToUse).reduce(
          (acc, s) => acc + s.loggedTime,
          0
        );
      }

      // Note: calculateTotalIdealTime correctly uses the global SCENARIOS data
      const { idealTotalTime } = calculateTotalIdealTime();
      const efficiencyScore =
        totalLoggedTime > 0 ? idealTotalTime / totalLoggedTime : 0;
      const finalEfficiencyPercent = Math.round(efficiencyScore * 100);
      const passed = efficiencyScore >= PASS_THRESHOLD;

      // 2. Generate Test Key (Using the state that was passed in)

      const testKey = generateTestKey(stateToUse);

      // 3. Report to SCORM/LMS (silently - user doesn't see this)

      if (typeof window.reportScoreAndGUIDToLMS12 === "function") {
        const scormSuccess = window.reportScoreAndGUIDToLMS12(
          finalEfficiencyPercent, // Score as percentage

          testKey, // Test key (GUID)

          100, // Max score

          PASS_THRESHOLD * 100 // Pass threshold
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

      // 4. Assemble Final Stats HTML (Reproducible Key added back)
      finalStatsHtml = `
                <div class="mt-4 border-t border-neutral-600 pt-4">
                    <h4 class="text-xl font-bold ${mainTitleColor} mb-3">Final Time Report</h4>
                    <div class="space-y-2 text-left max-w-sm mx-auto">
                        <div class="flex justify-between text-sm text-gray-200">
                            <span>Total Optimal Time (0.5h/step):</span>
                            <span class="font-bold">${idealTotalTime.toFixed(
                              1
                            )} hrs</span>
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

      buttonHtml = `
                <p class="text-sm text-gray-400 mt-4">This assessment is complete.</p>
            `;
    }

    // --- Render Modal ---
    const modalContentHtml = `
            <div id="final-modal-content" class="bg-gray-800 p-6 rounded-xl shadow-2xl text-center max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h2 class="text-3xl font-extrabold ${mainTitleColor} mb-2">${mainTitle}</h2>
                <p class="text-base text-gray-300 mb-2">${subText}</p>
                
                ${finalStatsHtml}

                ${buttonHtml}
            </div>
        `;

    timesUpScreen.innerHTML = modalContentHtml;
    jiraBoard.classList.add("hidden");
    timesUpScreen.classList.remove("hidden");

    // Attach Copy button listener
    if (allScenariosComplete || totalLoggedTime !== null) {
      const copyButton = document.getElementById("copy-key-btn");
      const keyDisplay = document.getElementById("test-key-display");

      if (copyButton && keyDisplay) {
        copyButton.addEventListener("click", () => {
          const keyToCopy = keyDisplay.textContent;

          // Use document.execCommand('copy') for better compatibility in iframe environments
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
    }
  }

  // --- UI STATE TESTING HELPER ---
  /**
   * Tests that the UI state is consistent with the game state.
   * Call this from the browser console: testUIState()
   * @returns {boolean} True if all checks pass.
   */
  window.testUIState = function () {
    let passed = true;
    console.log("🧪 Running UI State Tests...");

    // Test 1: Active scenario highlighting
    if (currentScenarioId) {
      const activeCard = document.querySelector(
        `[data-scenario-id="${currentScenarioId}"]`
      );
      if (!activeCard) {
        console.error("❌ TEST FAILED: Active scenario card not found in DOM");
        passed = false;
      } else if (!activeCard.classList.contains("active")) {
        console.error(
          '❌ TEST FAILED: Active scenario card does not have "active" class'
        );
        passed = false;
      } else {
        console.log("✅ Active scenario card is correctly highlighted");
      }
    } else {
      console.log("ℹ️ No active scenario - skipping highlight test");
    }

    // Test 2: Placeholder vs Content visibility
    const placeholder = document.getElementById("ticket-placeholder");
    const content = document.getElementById("ticket-content");
    if (currentScenarioId) {
      if (placeholder && !placeholder.classList.contains("hidden")) {
        console.error(
          "❌ TEST FAILED: Placeholder is visible when scenario is active"
        );
        passed = false;
      }
      if (content && content.classList.contains("hidden")) {
        console.error(
          "❌ TEST FAILED: Content is hidden when scenario is active"
        );
        passed = false;
      }
      if (
        placeholder?.classList.contains("hidden") &&
        !content?.classList.contains("hidden")
      ) {
        console.log(
          "✅ View visibility is correct (content shown, placeholder hidden)"
        );
      }
    } else {
      if (placeholder && placeholder.classList.contains("hidden")) {
        console.error(
          "❌ TEST FAILED: Placeholder is hidden when no scenario is active"
        );
        passed = false;
      }
      if (content && !content.classList.contains("hidden")) {
        console.error(
          "❌ TEST FAILED: Content is visible when no scenario is active"
        );
        passed = false;
      }
      if (
        !placeholder?.classList.contains("hidden") &&
        content?.classList.contains("hidden")
      ) {
        console.log(
          "✅ View visibility is correct (placeholder shown, content hidden)"
        );
      }
    }

    // Test 3: Scenario state consistency
    const scenarioCount = Object.keys(window.SCENARIOS || {}).length;
    const stateCount = Object.keys(scenarioState || {}).length;
    if (scenarioCount !== stateCount) {
      console.warn(
        `⚠️ WARNING: Scenario count (${scenarioCount}) does not match state count (${stateCount})`
      );
    } else {
      console.log(
        `✅ Scenario state count matches (${scenarioCount} scenarios)`
      );
    }

    console.log(passed ? "🎉 All UI tests passed!" : "❌ Some UI tests failed");
    return passed;
  };

  // --- Entry Point ---
  cacheDOMElements();
  attachEventListeners();
  initializeApp();

  // --- DEBUG NAVIGATION ---
  document
    .getElementById("debug-prev-step")
    ?.addEventListener("click", () => debugNav("prev"));
  document
    .getElementById("debug-next-step")
    ?.addEventListener("click", () => debugNav("next"));
  document
    .getElementById("debug-skip-to-end")
    ?.addEventListener("click", () => debugNav("end"));

  function debugNav(dir) {
    if (!currentScenarioId) return;
    const scenario = window.SCENARIOS[currentScenarioId];
    if (!scenario?.steps) return;
    const keys = Object.keys(scenario.steps);
    const idx = keys.indexOf(currentStepId);
    let newStep = currentStepId;
    if (dir === "prev" && idx > 0) newStep = keys[idx - 1];
    if (dir === "next" && idx < keys.length - 1) newStep = keys[idx + 1];
    if (dir === "end")
      newStep = scenario.steps["conclusion"]
        ? "conclusion"
        : keys[keys.length - 1];
    if (newStep !== currentStepId) {
      currentStepId = newStep;
      renderStep(currentScenarioId, currentStepId);
      const el = document.getElementById("debug-current-step");
      if (el) el.textContent = currentStepId;
      console.log("Debug nav:", currentStepId);
    }
  }
});
