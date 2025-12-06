// UE5 Scenario Tracker - Main Game Logic
// Wrapped in namespace to prevent global scope pollution
window.SCORM_Tracker = (function () {
    'use strict';

    // Wait for the DOM to be fully loaded before running the game logic
    document.addEventListener('DOMContentLoaded', () => {

        /* ==========================================================================
           == CONFIGURATION & CONSTANTS
           ========================================================================== */
        const CONFIG = {
            TOTAL_TEST_TIME_SECONDS: 30 * 60, // 30 minutes
            LOW_TIME_WARNING_SECONDS: 5 * 60, // 5 minutes
            PASS_THRESHOLD: 0.80, // 80% efficiency
            DEBUG_PASSWORD: 'IloveUnreal',
            TIME_COSTS: {
                correct: 0.5,
                partial: 1.0,
                misguided: 1.5,
                wrong: 2.0,
            }
        };

        /* ==========================================================================
           == STORAGE MANAGER - Centralized localStorage operations
           ========================================================================== */
        const StorageManager = {
            KEYS: {
                STATE: 'ue5ScenarioState',
                TIMER: 'ue5ScenarioTimer',
                INTERRUPTED: 'ue5InterruptedSteps',
                ACTIVE_SCENARIO: 'ue5ActiveScenario',
                ACTIVE_STEP: 'ue5ActiveStep',
                SCENARIO_ORDER: 'ue5ScenarioOrder'
            },

            /**
             * Check if localStorage has available quota
             * @returns {boolean} True if storage is available
             */
            checkQuota() {
                try {
                    const testKey = '__storage_quota_test__';
                    localStorage.setItem(testKey, 'test');
                    localStorage.removeItem(testKey);
                    return true;
                } catch (e) {
                    if (e.name === 'QuotaExceededError') {
                        console.error('localStorage quota exceeded');
                        return false;
                    }
                    throw e;
                }
            },

            save(key, value) {
                // Check quota before attempting save
                if (!this.checkQuota()) {
                    console.warn('Storage quota full - attempting cleanup...');
                    // Try to clear old data except important keys
                    const importantKeys = [this.KEYS.STATE, this.KEYS.TIMER];
                    Object.values(this.KEYS).forEach(k => {
                        if (!importantKeys.includes(k)) {
                            this.remove(k);
                        }
                    });

                    // Retry quota check
                    if (!this.checkQuota()) {
                        console.error('Failed to free storage space');
                        return;
                    }
                }

                try {
                    const dataString = typeof value === 'string' ? value : JSON.stringify(value);
                    localStorage.setItem(key, dataString);
                } catch (e) {
                    console.error(`Failed to save ${key}:`, e);
                }
            },

            load(key, defaultValue = null) {
                try {
                    const item = localStorage.getItem(key);
                    if (item === null) return defaultValue;

                    // Try to parse as JSON, if it fails return the string
                    try {
                        return JSON.parse(item);
                    } catch {
                        return item;
                    }
                } catch (e) {
                    console.error(`Failed to load ${key}:`, e);
                    return defaultValue;
                }
            },

            remove(key) {
                try {
                    localStorage.removeItem(key);
                } catch (e) {
                    console.error(`Failed to remove ${key}:`, e);
                }
            },

            clearAll() {
                Object.values(this.KEYS).forEach(key => this.remove(key));
            }
        };



        let debugAccessState = {
            passwordModalVisible: false // Tracks if the password input is currently shown
        };

        // --- DOM ELEMENT CACHE (Populated by cacheDOMElements) ---
        let backlogList, ticketViewColumn, ticketPlaceholder,
            ticketContent, ticketTitle, ticketDescription, ticketStepContent,
            countdownTimer, jiraBoard, timesUpScreen, debugDropdown;

        let timerContainer; // Parent container for the countdown timer

        /* ==========================================================================
           == CORE GAME STATE
           ========================================================================== */
        let scenarioState = {}; // Stores progress, time logged, and choices for each scenario (Ticket)
        let currentScenarioId = null; // Key of the scenario currently displayed (e.g., 'golem')
        let currentStepId = null; // Key of the current question step within the scenario
        let interruptedSteps = {}; // Stores the last active step for non-completed scenarios
        let isDebugMode = false; // Flag for debug visualization/controls
        let mainTimerInterval = null; // ID for the setInterval used for the 30-minute countdown

        let timeRemaining = CONFIG.TOTAL_TEST_TIME_SECONDS; // Remaining time on the countdown timer
        let sessionScenarioOrder = []; // Randomized order of scenarios for this session

        /* ==========================================================================
           == UTILITY FUNCTIONS
           ========================================================================== */
        // --- ENCODING UTILITIES (Restored for Test Key Generation) ---
        /**
         * Encodes a string to a Unicode-safe Base64 string.
         * @param {string} str - The string to encode.
         * @returns {string} The Base64 encoded string.
         */
        function base64EncodeUnicode(str) {
            const utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                function (match, p1) {
                    return String.fromCharCode('0x' + p1);
                });
            return btoa(utf8Bytes);
        }

        // --- TIMER & TIME UTILITIES ---

        /**
         * Converts total seconds into MM:SS format for display.
         * @param {number} totalSeconds - Total seconds remaining.
         * @returns {string} Formatted time string (MM:SS).
         */
        function formatTime(totalSeconds) {
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = Math.floor(totalSeconds % 60);
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        /**
         * Calculates the time cost in hours based on the choice type.
         * @param {string} type - 'correct', 'partial', 'misguided', 'wrong'.
         * @returns {number} Time cost in hours.
         */
        function getTimeCostForChoice(type) {
            return CONFIG.TIME_COSTS[type] || 0;
        }

        /* ==========================================================================
           == TIMER LOGIC
           ========================================================================== */

        /**
         * Debounce helper - delays function execution until after wait time
         * @param {Function} func - Function to debounce
         * @param {number} wait - Milliseconds to wait
         * @returns {Function} Debounced function
         */
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func(...args), wait);
            };
        }

        /**
         * Save timer state to localStorage AND SCORM (debounced)
         * This prevents high-frequency writes and data loss
         */
        const saveTimerDebounced = debounce((time) => {
            // Primary save to localStorage
            StorageManager.save(StorageManager.KEYS.TIMER, time.toString());

            // Backup to SCORM suspend_data if available
            if (typeof window.reportScoreAndGUIDToLMS12 === 'function') {
                try {
                    // Get SCORM API
                    const api = (function getAPI() {
                        let w = window;
                        for (let i = 0; i < 20; i++) {
                            if (w.API) return w.API;
                            if (w.parent && w.parent !== w) w = w.parent;
                            else break;
                        }
                        return w.opener ? getAPI.call(w.opener) : null;
                    })();

                    if (api && api.LMSSetValue) {
                        const backupState = {
                            timer: time,
                            scenarios: scenarioState,
                            timestamp: Date.now()
                        };
                        // SCORM 1.2 has 4KB limit
                        const stateStr = JSON.stringify(backupState).substring(0, 4000);
                        api.LMSSetValue('cmi.suspend_data', stateStr);
                    }
                } catch (e) {
                    console.warn('SCORM backup failed:', e);
                }
            }
        }, 3000);  // Save every 3 seconds instead of every 1 second

        /**
         * Updates the main timer display, applies visual cues, and handles expiry.
         */
        function updateMainTimerDisplay() {
            // 1. Update Display
            countdownTimer.textContent = formatTime(timeRemaining);

            // 2. Update Color/Pulse based on time left
            countdownTimer.classList.remove('pulse-red', 'text-cyan-300', 'text-yellow-400', 'text-orange-400', 'text-green-500', 'text-red-500');

            if (timeRemaining <= 60 && timeRemaining > 0) {
                // CRITICAL: Less than 1 minute (Red + Pulse)
                countdownTimer.classList.add('text-red-500', 'pulse-red');
            } else if (timeRemaining <= CONFIG.LOW_TIME_WARNING_SECONDS && timeRemaining > 0) {
                // WARNING: Less than 5 minutes (Yellow)
                countdownTimer.classList.add('text-yellow-400');
            } else if (timeRemaining > 0) {
                // NORMAL: Blue
                countdownTimer.classList.add('text-cyan-300');
            }

            // 3. Time's Up Check
            if (timeRemaining <= 0) {
                endGameByTime();
                return;
            }

            // 4. Decrement
            timeRemaining--;

            // 5. Save remaining time (debounced - every 3s instead of every 1s)
            saveTimerDebounced(timeRemaining);
        }

        /**
         * Starts the main 30-minute countdown timer.
         */
        function startMainTimer(isInitialStart = false) {
            // Load time state
            if (isInitialStart) {
                timeRemaining = CONFIG.TOTAL_TEST_TIME_SECONDS;
                StorageManager.remove(StorageManager.KEYS.TIMER);
            } else {
                const savedTime = StorageManager.load(StorageManager.KEYS.TIMER);
                if (savedTime !== null) {
                    timeRemaining = parseInt(savedTime, 10);
                } else {
                    timeRemaining = CONFIG.TOTAL_TEST_TIME_SECONDS;
                }
            }

            // CRITICAL FIX: Ensure timer container is visible if time is > 0
            if (timerContainer && timeRemaining > 0) {
                timerContainer.classList.remove('hidden');
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
                const allComplete = Object.values(scenarioState).every(state => state.completed);
                if (!allComplete) {
                    mainTimerInterval = setInterval(updateMainTimerDisplay, 1000);
                }
            }
        }

        /* ==========================================================================
           == DEBUG & ADMIN FUNCTIONS
           ========================================================================== */
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
                debugDropdown.classList.toggle('hidden', !isDebugMode);
            }

            // Update internal logic based on new mode
            if (isDebugMode) {
                pauseMainTimer();
                // Allow copying/inspection in debug mode
                document.body.classList.remove('unselectable');
            } else {
                resumeMainTimer();
                // Re-enable security when exiting debug mode
                document.body.classList.add('unselectable');
            }

            // Update the visual status of the hidden toggle (for consistency)
            const debugToggle = document.getElementById('debug-toggle');
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

            Cancel
                        </button >
                    </div >
                </div >
            </div >
                `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('password-modal');
        const input = document.getElementById('password-input');

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
                input.value = '';
                input.placeholder = 'Incorrect Password!';
                input.classList.add('ring-2', 'ring-red-500');
                setTimeout(() => {
                    input.classList.remove('ring-2', 'ring-red-500');
                }, 1000);
            }
        };

        document.getElementById('submit-password').addEventListener('click', checkPassword);
        document.getElementById('cancel-password').addEventListener('click', cleanup);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                checkPassword();
            } else if (e.key === 'Escape') {
                cleanup();
            }
        });
    }

    /* ==========================================================================
       == INITIALIZATION & DOM SETUP
       == CORE INITIALIZATION
       ========================================================================== */
    /**
    * The primary entry point for setting up the game state.
    */
    function initializeApp() {

        // Safety check: Ensure SCENARIOS object exists
        if (!window.SCENARIOS || Object.keys(window.SCENARIOS).length === 0) {
            console.error('No scenarios loaded! Waiting for scenario files...');
            setTimeout(initializeApp, 100); // Retry after 100ms
            return;
        }

        // 1. --- AGGRESSIVE STATE CHECK AND RESET (Fixes infinite modal loop) ---
        const savedStateJSON = StorageManager.load(StorageManager.KEYS.STATE);
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
            allCompleteOnLoad = Object.values(initialScenarioState).every(s => s.completed);
        }

        // CRITICAL FIX: If completed, clear the state immediately so the next load starts clean.
        let showCompletionModal = false;
        if (allCompleteOnLoad) {
            // We set a flag to show the modal *this time*
            showCompletionModal = true;

            // Then, we clear the data immediately so the next load gets a clean start.
            StorageManager.remove(StorageManager.KEYS.STATE); // Clears the completion status
            StorageManager.remove(StorageManager.KEYS.INTERRUPTED);
            StorageManager.remove(StorageManager.KEYS.ACTIVE_SCENARIO);
            StorageManager.remove(StorageManager.KEYS.ACTIVE_STEP);
            StorageManager.remove(StorageManager.KEYS.TIMER);
        }
        // --- END AGGRESSIVE STATE CHECK ---

        // 2. Load data from local storage (this loads a default clean state if the state was just cleared above)
        // --- SCENARIO RANDOMIZATION LOGIC ---
        // Filter scenarios to only include those in the MANIFEST
        const manifestKeys = (window.MANIFEST && Array.isArray(window.MANIFEST)) ? window.MANIFEST : Object.keys(window.SCENARIOS);
        const allKeys = manifestKeys.filter(id => window.SCENARIOS[id]);
        let storedOrder = JSON.parse(StorageManager.load(StorageManager.KEYS.SCENARIO_ORDER) || '[]');

        // Filter stored order to remove deleted scenarios
        storedOrder = storedOrder.filter(id => allKeys.includes(id));

        // Find new scenarios not in stored order
        const newScenarios = allKeys.filter(id => !storedOrder.includes(id));

        // Shuffle new scenarios
        for (let i = newScenarios.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newScenarios[i], newScenarios[j]] = [newScenarios[j], newScenarios[i]];
        }

        // Combine: Keep stored order first (to maintain consistency on refresh), then add new ones
        sessionScenarioOrder = [...storedOrder, ...newScenarios];

        // If it was empty (first run or reset), shuffle the whole thing
        if (storedOrder.length === 0) {
            for (let i = sessionScenarioOrder.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [sessionScenarioOrder[i], sessionScenarioOrder[j]] = [sessionScenarioOrder[j], sessionScenarioOrder[i]];
            }
        }

        // Save the order
        StorageManager.save(StorageManager.KEYS.SCENARIO_ORDER, sessionScenarioOrder);

        loadScenarioState();
        loadInterruptedSteps();

        // 3. Check for crash recovery / active scenario
        const activeScenarioId = StorageManager.load(StorageManager.KEYS.ACTIVE_SCENARIO);
        const activeStepId = StorageManager.load(StorageManager.KEYS.ACTIVE_STEP);

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
                timerContainer.classList.add('hidden');
            }
            toggleDebugMode(true); // Ensure debug mode is off
            stopTimerOnComplete();

            // Use the initial state's data (which still holds the score) to show the final modal
            let totalLoggedTime = Object.values(initialScenarioState).reduce((acc, s) => acc + s.loggedTime, 0);

            showAssessmentModal('complete', totalLoggedTime, initialScenarioState);
        }

        // 8. Initialize debug UI state (Dropdown is always hidden on start)
        if (debugDropdown) {
            debugDropdown.classList.add('hidden');
        }
    }

    /**
     * Finds and assigns all necessary DOM elements to global variables.
     */
    function cacheDOMElements() {
        backlogList = document.getElementById('backlog-list');
        ticketViewColumn = document.getElementById('ticket-view-column');
        ticketPlaceholder = document.getElementById('ticket-placeholder');
        ticketContent = document.getElementById('ticket-content');
        ticketTitle = document.getElementById('ticket-title');
        ticketDescription = document.getElementById('ticket-description');
        ticketStepContent = document.getElementById('ticket-step-content');
        countdownTimer = document.getElementById('countdown-timer');
        jiraBoard = document.getElementById('jira-board');
        timesUpScreen = document.getElementById('times-up-screen');
        debugDropdown = document.getElementById('debug-dropdown');

        // Cache the timer's parent div for visibility control
        timerContainer = countdownTimer ? countdownTimer.parentElement : null;
    }

    /**
     * Checks if the test is currently running (i.e., not fully completed).
     * @returns {boolean} True if the assessment is not yet fully complete.
     */
    function isTestRunning() {
        const allComplete = Object.values(scenarioState).every(state => state.completed);
        return !allComplete;
    }

    /**
     * Toggles the debug mode state and updates the UI.
     * @param {boolean} forceState - Optional boolean to force a specific state.
     */
    function toggleDebugMode(forceState = null) {
        console.log(`🔧 toggleDebugMode called with forceState: `, forceState);
        console.log(`🔧 isDebugMode BEFORE toggle: `, isDebugMode);

        if (forceState !== null) {
            isDebugMode = forceState;
        } else {
            isDebugMode = !isDebugMode;
        }

        console.log(`🔧 isDebugMode AFTER toggle: `, isDebugMode);

        const debugControls = document.getElementById('debug-controls-container');
        const debugToggle = document.getElementById('debug-toggle');

        if (isDebugMode) {
            if (debugControls) debugControls.classList.remove('hidden');
            if (debugToggle) debugToggle.checked = true;
            if (debugDropdown) debugDropdown.classList.remove('hidden');
            document.body.classList.add('debug-active');
            console.log('✅ Debug mode ENABLED');
        } else {
            // Keep the container visible if we want, or hide it. 
            // The user requested "debug mode active again", implying the toggle itself should be visible.
            // But usually, the toggle is hidden until the key combo.
            // However, since I unhidden it in index.html, let's just manage the dropdown and state.
            if (debugToggle) debugToggle.checked = false;
            if (debugDropdown) debugDropdown.classList.add('hidden');
            document.body.classList.remove('debug-active');
            console.log('❌ Debug mode DISABLED');
        }

        // Re-render backlog to show/hide debug info if any
        renderBacklog();
    }

    /**
     * Shows the password modal for admin access.
     */
    function showPasswordModal() {
        // Simple prompt for now to avoid complex modal HTML insertion if not needed
        const password = prompt("Enter Admin Password:", "");
        if (password === "ue5admin") { // Simple hardcoded password for now
            toggleDebugMode(true);
            alert("Debug Mode Enabled");
        } else if (password !== null) {
            alert("Incorrect Password");
        }
    }

    /**
     * Attaches all primary event listeners.
     */
    function attachEventListeners() {
        const hardResetBtn = document.getElementById('hard-reset-btn');
        if (!hardResetBtn) console.error('❌ Hard Reset button element NOT found in DOM!');

        // --- ADMIN ACCESS (CTRL + SHIFT + DELETE + Password Gate) ---
        document.addEventListener('keydown', (e) => {
            // Check for the combination: CTRL + SHIFT + DELETE (KeyCode 46 is Delete on most systems)
            if (e.ctrlKey && e.shiftKey && (e.key === 'Delete' || e.keyCode === 46)) {
                e.preventDefault();
                // If Debug Mode is already on, the combination turns it off without a password
                if (isDebugMode) {
                    toggleDebugMode(true); // Force Disable
                } else if (!debugAccessState.passwordModalVisible) {
                    showPasswordModal();
                }
            }
        });



        // Debug: Toggle Checkbox Handler
        const debugToggle = document.getElementById('debug-toggle');
        if (debugToggle) {
            debugToggle.addEventListener('change', (e) => {
                // Toggle based on checkbox state
                toggleDebugMode(e.target.checked);
            });
        }

        // Debug: Hard Reset button handler (Wipes all local storage)
        if (hardResetBtn) {
            console.log("✅ Hard Reset button found. Attaching listener.");
            hardResetBtn.addEventListener('click', () => {
                console.log("🔘 Hard Reset button clicked!");

                // Create custom confirmation modal
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
                modal.innerHTML = `
                < div class="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-md border-2 border-red-600" >
                        <h3 class="text-2xl font-bold text-red-400 mb-4">⚠️ WARNING</h3>
                        <p class="text-gray-200 mb-6">This will clear ALL progress, including:</p>
                        <ul class="text-gray-300 mb-6 list-disc list-inside space-y-1">
                            <li>All completed scenarios</li>
                            <li>Timer data</li>
                            <li>Saved progress</li>
                            <li>Session order</li>
                        </ul>
                        <p class="text-yellow-400 font-semibold mb-6">Are you absolutely sure?</p>
                        <div class="flex gap-4">
                            <button id="confirm-reset" class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg">
                                Yes, Reset Everything
                            </button>
                            <button id="cancel-reset" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg">
                                Cancel
                            </button>
                        </div>
                    </div >
                `;

                document.body.appendChild(modal);

                // Handle confirmation
                document.getElementById('confirm-reset').addEventListener('click', () => {
                    console.log("✅ Hard reset confirmed!");
                    StorageManager.remove(StorageManager.KEYS.TIMER);
                    StorageManager.remove(StorageManager.KEYS.STATE);
                    StorageManager.remove(StorageManager.KEYS.INTERRUPTED);
                    StorageManager.remove(StorageManager.KEYS.ACTIVE_SCENARIO);
                    StorageManager.remove(StorageManager.KEYS.ACTIVE_STEP);
                    localStorage.removeItem('ue5ScenarioOrder');
                    location.reload();
                });

                // Handle cancellation
                document.getElementById('cancel-reset').addEventListener('click', () => {
                    console.log("❌ Hard reset cancelled");
                    document.body.removeChild(modal);
                });
            });

        // --- DEBUG NAVIGATION BUTTONS ---
        const debugPrevStep = document.getElementById('debug-prev-step');
        const debugNextStep = document.getElementById('debug-next-step');
        const debugSkipToEnd = document.getElementById('debug-skip-to-end');

        if (debugPrevStep) {
            debugPrevStep.addEventListener('click', () => debugNavigateStep('prev'));
        }
        if (debugNextStep) {
            debugNextStep.addEventListener('click', () => debugNavigateStep('next'));
        }
        if (debugSkipToEnd) {
            debugSkipToEnd.addEventListener('click', () => debugNavigateStep('end'));
        }        }
    }

    /**
     * Calculates the total ideal time based on the scenarios the user has actually attempted.
     * Uses meta.estimateHours if available, or falls back to step count.
     * @param {object} [stateToUse=scenarioState] - The state to filter by.
     * @returns {{totalSteps: number, idealTotalTime: number}} The calculated totals.
     */
    
    /**
     * Debug function to navigate between steps in the current scenario.
     * @param {string} direction - 'prev', 'next', or 'end'
     */
    function debugNavigateStep(direction) {
        if (!currentScenarioId) {
            console.warn("No scenario selected");
            return;
        }
        const scenario = window.SCENARIOS[currentScenarioId];
        if (!scenario || !scenario.steps) {
            console.warn("Invalid scenario");
            return;
        }
        const stepKeys = Object.keys(scenario.steps);
        const currentIndex = stepKeys.indexOf(currentStepId);
        let newStepId = currentStepId;

        if (direction === 'prev' && currentIndex > 0) {
            newStepId = stepKeys[currentIndex - 1];
        } else if (direction === 'next' && currentIndex < stepKeys.length - 1) {
            newStepId = stepKeys[currentIndex + 1];
        } else if (direction === 'end') {
            newStepId = scenario.steps['conclusion'] ? 'conclusion' : stepKeys[stepKeys.length - 1];
        }

        if (newStepId !== currentStepId) {
            currentStepId = newStepId;
            renderStep(currentScenarioId, currentStepId);
            updateDebugStepDisplay();
            console.log('🔧 Debug navigated to:', currentStepId);
        }
    }

    function updateDebugStepDisplay() {
        const el = document.getElementById('debug-current-step');
        if (el) {
            el.textContent = (currentScenarioId && currentStepId) ? currentStepId : 'None';
        }
    }

function calculateTotalIdealTime(stateToUse = scenarioState) {
        let totalSteps = 0;
        let idealTotalTime = 0;

        Object.keys(stateToUse).forEach(scenarioId => {
            const state = stateToUse[scenarioId];
            const scenario = window.SCENARIOS[scenarioId];

            // Only include scenarios that have been started (loggedTime > 0) or completed
            if (scenario && (state.loggedTime > 0 || state.completed)) {

                // Use the manual estimate if available (Source of Truth)
                if (scenario.meta && scenario.meta.estimateHours) {
                    idealTotalTime += scenario.meta.estimateHours;
                } else if (scenario.steps) {
                    // Fallback: Estimate based on step count (excluding dead ends if possible, but we count all here for safety)
                    const count = Object.keys(scenario.steps).length;
                    idealTotalTime += count * 0.5;
                }

                if (scenario.steps) {
                    totalSteps += Object.keys(scenario.steps).length;
                }
            }
        });

        return {
            totalSteps: totalSteps,
            idealTotalTime: idealTotalTime
        };
    }

    /**
     * Serializes scenario choices into a compact, stable Base64 JSON string.
     * This creates a reproducible key for verifying a user's test results.
     * @param {object} [stateToSerialize=scenarioState] - The state to serialize.
     * @returns {string} The Base64 encoded test key.
     */
    function generateTestKey(stateToSerialize = scenarioState) {
        const compactData = {};

        Object.keys(stateToSerialize).forEach(scenarioId => {
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


    /* ==========================================================================
       == STATE MANAGEMENT (SAVE/LOAD)
       ========================================================================== */
    /**
     * Loads game state from localStorage, ensuring cleanup of old penalty/corrupted keys.
     */
    function loadScenarioState() {
        console.log("Loading scenario state...");

        if (!window.SCENARIOS || Object.keys(window.SCENARIOS).length === 0) {
            console.warn("Cannot load state: SCENARIOS not loaded yet.");
            return;
        }

        let savedStateJSON = null;
        try {
            savedStateJSON = StorageManager.load(StorageManager.KEYS.STATE);
        } catch (e) {
            console.error("localStorage access failed:", e);
            return;
        }

        let savedState = {};

        if (savedStateJSON) {
            try {
                savedState = JSON.parse(savedStateJSON);
                console.log("Found saved state:", savedState);
            } catch (e) {
                console.error("Failed to parse saved state, resetting.", e);
                savedState = {};
            }
        } else {
            console.log("No saved state found.");
        }

        const newScenarioState = {};

        Object.keys(window.SCENARIOS).forEach(scenarioId => {
            const defaultState = {
                completed: false,
                loggedTime: 0,
                choicesMade: {}
            };

            newScenarioState[scenarioId] = {
                ...defaultState,
                ...(savedState[scenarioId] || {})
            };

            // Recalculate logged time based on choicesMade to ensure consistency 
            let recalculateTime = 0;
            if (newScenarioState[scenarioId].choicesMade) {
                const scenario = window.SCENARIOS[scenarioId];
                if (scenario) {
                    Object.keys(newScenarioState[scenarioId].choicesMade).forEach(stepId => {
                        const originalIndex = newScenarioState[scenarioId].choicesMade[stepId];
                        // Safety check for valid step and choice index
                        if (scenario.steps[stepId] &&
                            scenario.steps[stepId].choices &&
                            scenario.steps[stepId].choices.length > originalIndex) {

                            const choiceType = scenario.steps[stepId].choices[originalIndex].type;
                            recalculateTime += getTimeCostForChoice(choiceType);
                        } else {
                            console.warn(`Invalid choice index or missing step for ${ scenarioId } step ${ stepId } `);
                        }
                    });
                }
            }
            newScenarioState[scenarioId].loggedTime = recalculateTime;
        });

        scenarioState = newScenarioState;
        console.log("State loaded successfully:", scenarioState);

        // Only save back if we actually loaded something valid, to avoid wiping on error
        // But we need to save to initialize defaults if nothing was there.
        saveScenarioState();
    }

    /**
     * Saves the current game state to localStorage.
     */
    function saveScenarioState() {
        try {
            StorageManager.save(StorageManager.KEYS.STATE, scenarioState);
            // console.log("State saved."); // Uncomment for verbose logging
        } catch (e) {
            console.error("Failed to save state to localStorage:", e);
        }
    }

    /**
     * Resets all scenario progress to default values. (Currently unused, but kept for potential future admin features).
     */
    function resetAllScenarioState() {
        scenarioState = {};
        Object.keys(window.SCENARIOS).forEach(scenarioId => {
            scenarioState[scenarioId] = {
                completed: false,
                loggedTime: 0,
                choicesMade: {}
            };
        });
        interruptedSteps = {};
        saveScenarioState();
    }

    /**
     * Loads the interrupted steps map from localStorage.
     */
    function loadInterruptedSteps() {
        const savedInterruptedJSON = StorageManager.load(StorageManager.KEYS.INTERRUPTED);
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
            StorageManager.save(StorageManager.KEYS.ACTIVE_SCENARIO, currentScenarioId);
            StorageManager.save(StorageManager.KEYS.ACTIVE_STEP, currentStepId);
        } else {
            StorageManager.remove(StorageManager.KEYS.ACTIVE_SCENARIO);
            StorageManager.remove(StorageManager.KEYS.ACTIVE_STEP);
        }

        StorageManager.save(StorageManager.KEYS.INTERRUPTED, interruptedSteps);
    }

    /* ==========================================================================
       == UI RENDERING LOGIC
       ========================================================================== */
    /**
       ========================================================================== */
    /**
     * Determines the color class for time logged vs. estimate.
     * @param {number} logged - Logged hours.
     * @param {number} estimate - Estimated hours.
     * @returns {string} Tailwind CSS class for color.
     */
    function getLoggedTimeColorClass(logged, estimate) {
        if (logged <= estimate) {
            return 'text-green-400';
        }

        const overBudgetRatio = logged / estimate;

        if (overBudgetRatio <= 1.20) {
            return 'text-yellow-400';
        } else if (overBudgetRatio <= 1.40) {
            return 'text-orange-400';
        } else {
            return 'text-red-400';
        }
    }

    /**
     * Renders the list of tickets in the backlog (left column).
     * It reads from `scenarioState` to apply correct styling for completed/in-progress tickets.
     */
    /**
     * Updates the progress tracker in the header with current completion stats.
     */
    function updateProgressTracker() {
        const progressIndicator = document.getElementById('progress-indicator');
        const progressCompleted = document.getElementById('progress-completed');
        const progressTotal = document.getElementById('progress-total');
        const progressEfficiency = document.getElementById('progress-efficiency');

        if (!progressIndicator) return;

        // Calculate stats
        const totalScenarios = Object.keys(scenarioState).length;
        const completedScenarios = Object.values(scenarioState).filter(s => s.completed).length;

        // Calculate efficiency (ideal time / actual time)
        const totalLoggedTime = Object.values(scenarioState).reduce((acc, s) => acc + s.loggedTime, 0);
        const { idealTotalTime } = calculateTotalIdealTime();
        const efficiencyScore = totalLoggedTime > 0 ? (idealTotalTime / totalLoggedTime) : 0;
        const efficiencyPercent = Math.round(efficiencyScore * 100);

        // Update UI
        progressCompleted.textContent = completedScenarios;
        progressTotal.textContent = totalScenarios;
        progressEfficiency.textContent = efficiencyPercent + '%';

        // Update progress bar width
        const progressBar = document.getElementById('progress-bar');
        const progressPercent = totalScenarios > 0 ? (completedScenarios / totalScenarios) * 100 : 0;
        if (progressBar) {
            progressBar.style.width = progressPercent + '%';

            // Color code the progress bar
            if (progressPercent >= 75) {
                progressBar.className = 'h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500';
            } else if (progressPercent >= 50) {
                progressBar.className = 'h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500';
            } else if (progressPercent >= 25) {
                progressBar.className = 'h-full bg-gradient-to-r from-yellow-500 to-orange-400 transition-all duration-500';
            } else {
                progressBar.className = 'h-full bg-gradient-to-r from-red-500 to-pink-400 transition-all duration-500';
            }
        }

        // Color code efficiency
        progressEfficiency.className = 'text-lg font-bold';
        if (efficiencyPercent >= 80) {
            progressEfficiency.classList.add('text-green-400');
        } else if (efficiencyPercent >= 60) {
            progressEfficiency.classList.add('text-yellow-400');
        } else {
            progressEfficiency.classList.add('text-red-400');
        }

        // Show the indicator if there's any progress
        if (completedScenarios > 0 || totalLoggedTime > 0) {
            progressIndicator.classList.remove('hidden');
        }
    }

    /**
     * Renders the list of tickets in the backlog (left column).
     * It reads from `scenarioState` to apply correct styling for completed/in-progress tickets.
     */
    function renderBacklog() {
        backlogList.innerHTML = '';

        // Use the randomized session order instead of default object keys
        const scenarioKeys = sessionScenarioOrder && sessionScenarioOrder.length > 0
            ? sessionScenarioOrder
            : Object.keys(window.SCENARIOS);

        const validScenarios = scenarioKeys
            .map(id => ({ id, data: window.SCENARIOS[id] }))
            .filter(item =>
                item.data &&
                item.data.meta &&
                item.data.meta.title &&
                typeof item.data.meta.estimateHours !== 'undefined'
            );

        validScenarios.forEach(item => {
            const scenarioId = item.id;
            const scenario = item.data;
            const state = scenarioState[scenarioId];

            const meta = scenario.meta;
            const title = meta.title;
            const description = meta.description ? meta.description.substring(0, 70) + '...' : "No description available.";

            let estimate = parseFloat(meta.estimateHours);
            if (isNaN(estimate)) {
                estimate = 0;
            }

            const card = document.createElement('div');
            const isActive = currentScenarioId === scenarioId && !state.completed;

            card.className = `p - 4 rounded - lg border - l - 4 cursor - pointer transition - all duration - 200 mb - 3 ${
                state.completed
                    ? 'bg-gray-800/50 border-green-600 opacity-60'
                    : isActive
                        ? 'active-ticket bg-ue-medium border-orange-500 shadow-lg ring-1 ring-orange-500/30'
                        : 'bg-ue-dark hover:bg-ue-lighter border-transparent hover:border-gray-600'
            } `;
            card.dataset.scenarioId = scenarioId;

            let statusSpan;
            let loggedTimeDisplay = '';
            const logged = state.loggedTime;
            const loggedColorClass = getLoggedTimeColorClass(logged, estimate);


            // Helper for safe translation
            const safeT = (key) => typeof window.t === 'function' ? window.t(key) : key;

            if (state.completed) {
                statusSpan = `< span class="text-xs font-semibold text-green-400" > ${ safeT('status.completed') }</span > `;
                loggedTimeDisplay = `
                < div class="text-sm text-gray-300" >
                    ${ safeT('label.logged') } <span class="font-bold ${loggedColorClass}">${logged.toFixed(1)} hrs</span> /
                        ${ safeT('label.est') } <span class="font-bold text-green-400">${estimate.toFixed(1)} hrs</span>
                    </div >
                `;
            } else {
                const savedStepId = interruptedSteps[scenarioId];

                if (savedStepId && savedStepId !== scenario.start) {
                    statusSpan = `< span class="text-xs font-semibold text-yellow-400" > ${ safeT('status.in_progress') }</span > `;
                    loggedTimeDisplay = `
                < div class="text-sm text-gray-400" >
                    ${ safeT('label.logged') } <span class="font-bold ${loggedColorClass}">${logged.toFixed(1)} hrs</span> /
                        ${ safeT('label.est') } <span class="font-bold text-green-400">${estimate.toFixed(1)} hrs</span>
                        </div >
                `;
                } else {
                    statusSpan = `< span class="text-xs font-semibold text-gray-400" > ${ safeT('status.not_started') }</span > `;
                    loggedTimeDisplay = `
                < div class="text-sm text-gray-400" >
                    ${ safeT('label.est_time') } <span class="font-bold text-green-400">${estimate.toFixed(1)} hrs</span>
                        </div >
                `;
                }
            }

            // --- CATEGORY LOGIC ---
            const SCENARIO_CATEGORIES = {
                'audio_concurrency': 'Audio',
                'blueprint_infinite_loop': 'Blueprint',
                'dash': 'Gameplay',
                'directional_light': 'Lighting',
                'generator': 'Tools',
                'golem': 'Gameplay',
                'inventory': 'UI',
                'lumen_gi': 'Rendering',
                'lumen_mesh_distance': 'Rendering',
                'nanite_wpo': 'Rendering',
                'oversharpened_scene': 'Post Process',
                'terminal': 'Core',
                'volumetric_fog_banding': 'Rendering',
                'volumetric_fog_material': 'Rendering',
                'world_partition': 'World Building'
            };

            const rawCategory = meta.category || SCENARIO_CATEGORIES[scenarioId] || 'General';
            // Use raw category name (truncated if too long)
            const categoryLabel = rawCategory.length > 18 ? rawCategory.substring(0, 15) + '...' : rawCategory;

            // Unique color for each category
            const categoryColors = {
                'AI': 'bg-purple-900/50 text-purple-200 border-purple-700',
                'Assets': 'bg-green-900/50 text-green-200 border-green-700',
                'Audio': 'bg-orange-900/50 text-orange-200 border-orange-700',
                'Blueprints': 'bg-indigo-900/50 text-indigo-200 border-indigo-700',
                'Cinematics': 'bg-pink-900/50 text-pink-200 border-pink-700',
                'Core': 'bg-red-900/50 text-red-200 border-red-700',
                'Gameplay': 'bg-cyan-900/50 text-cyan-200 border-cyan-700',
                'Lighting': 'bg-purple-900/50 text-purple-200 border-purple-700',
                'Materials': 'bg-emerald-900/50 text-emerald-200 border-emerald-700',
                'Nanite': 'bg-violet-900/50 text-violet-200 border-violet-700',
                'Performance': 'bg-amber-900/50 text-amber-200 border-amber-700',
                'Physics': 'bg-teal-900/50 text-teal-200 border-teal-700',
                'PostProcess': 'bg-fuchsia-900/50 text-fuchsia-200 border-fuchsia-700',
                'Procedural': 'bg-lime-900/50 text-lime-200 border-lime-700',
                'Rendering': 'bg-sky-900/50 text-sky-200 border-sky-700',
                'Tools': 'bg-yellow-900/50 text-yellow-200 border-yellow-700',
                'UI': 'bg-rose-900/50 text-rose-200 border-rose-700',
                'Volumetrics': 'bg-slate-700/50 text-slate-200 border-slate-600',
                'World': 'bg-orange-800/50 text-orange-200 border-orange-600'
            };

            let categoryColorClass = categoryColors[rawCategory] || 'bg-gray-700 text-gray-300 border-gray-600';

            const difficultyKey = estimate > 5 ? 'difficulty.long' : estimate > 2 ? 'difficulty.med' : 'difficulty.short';
            const difficultyLabel = safeT(difficultyKey);

            const html = `
                < div class="flex justify-between items-start mb-1" >
                    <span class="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${categoryColorClass}">${categoryLabel}</span>
                    <span class="text-xs font-mono px-2 py-0.5 rounded ${estimate > 5 ? 'bg-red-900 text-red-200' : estimate > 2 ? 'bg-yellow-900 text-yellow-200' : 'bg-green-900 text-green-200'}">
                        ${difficultyLabel}
                    </span>
                </div >
                <h4 class="font-bold ${state.completed ? 'text-gray-400 line-through' : 'text-gray-100'} mb-1">${title}</h4>
                <p class="text-xs text-gray-400 mb-2 line-clamp-2">${description}</p>
                
                <div class="pt-2 border-t border-gray-700 flex justify-between items-center">
                    ${statusSpan}
                    ${loggedTimeDisplay}
                </div>
            `;


            card.innerHTML = html;

            if (!state.completed) {
                card.addEventListener('click', () => selectScenario(scenarioId));
            }

            backlogList.appendChild(card);
        });

        // Update the progress tracker after rendering
        updateProgressTracker();
    }

    /**
     * Renders a specific step (prompt and choices) of a scenario.
     * @param {string} scenarioId - The ID of the scenario.
     * @param {string} stepId - The ID of the step to render.
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

        // 3. Shuffle choices 
        const shuffledChoices = [...step.choices].sort(() => Math.random() - 0.5);

        // 4. Determine Step Number for display
        const stepKeys = Object.keys(scenario.steps);
        const stepIndex = stepKeys.indexOf(stepId);
        const stepNumber = stepIndex !== -1 ? stepIndex + 1 : 1;
        const totalSteps = stepKeys.length;

        // Conditionally generate the step count prefix (visible only in debug mode)
        const stepCountPrefix = isDebugMode
            ? `Step ${ stepNumber } / ${totalSteps}: `
            : '';

            // 5. Build the Step Prompt and Choices
            let imageHtml = '';
            if (step.image && step.image.url) {
                imageHtml = `
                <div class="mb-4">
                    <img src="${step.image.url}" alt="${step.image.alt || 'Step Illustration'}" class="w-full rounded-lg border border-gray-700 shadow-md">
                </div>
            `;
            }

            const stepHtml = `
            <div id="ticket-step-prompt" class="mb-6">
                <h5 class="text-xl font-bold text-gray-200 mb-4">${stepCountPrefix}${step.title}</h5>
                ${imageHtml}
                <div class="prose prose-sm prose-invert text-gray-300">${step.prompt}</div>
            </div>
            <div id="ticket-step-choices" class="space-y-3"></div>
        `;

            ticketStepContent.innerHTML = stepHtml;

            const choicesContainer = ticketStepContent.querySelector('#ticket-step-choices');

            // 6. Create Choice Buttons
            // Map original index to shuffled button for time tracking stability
            shuffledChoices.forEach((choice) => {
                const timeCost = getTimeCostForChoice(choice.type);
                const isCorrect = choice.type === 'correct';

                const btn = document.createElement('button');

                // Determine button styling (Debug Mode only shows hint colors)
                let debugClass = '';
                if (isDebugMode) {
                    if (isCorrect) {
                        debugClass = 'border-green-600 debug-correct';
                    } else if (choice.type === 'partial') {
                        debugClass = 'border-yellow-600';
                    } else if (choice.type === 'misguided') {
                        debugClass = 'border-orange-600';
                    } else {
                        debugClass = 'border-red-600';
                    }
                } else {
                    debugClass = 'border-gray-600 hover:border-neutral-500';
                }

                // Apply unselectable class to choices
                // Apply unselectable class to choices
                btn.className = `block w-full text-left p-4 rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-500 unselectable text-sm md:text-base relative overflow-hidden ${debugClass} ${isDebugMode ? '' : 'bg-ue-darkest border-ue-border-dark text-gray-300 hover:bg-ue-dark hover:border-neutral-500 hover:text-white hover:shadow-ue-neutral-glow hover:-translate-y-0.5 active:translate-y-0 active:bg-neutral-900/20'
                    }`;

                // Force inline styles for debug mode to ensure visibility
                if (isDebugMode && isCorrect) {
                    console.log('🟢 DEBUG MODE: Applying GREEN styles to correct answer');
                    btn.style.setProperty('background-color', 'var(--ue-success-bg)', 'important');
                    btn.style.setProperty('border-color', 'var(--ue-success)', 'important');
                    btn.style.setProperty('border-width', '3px', 'important');
                    btn.style.setProperty('box-shadow', '0 0 15px 4px var(--ue-success-shadow)', 'important');
                } else if (isDebugMode) {
                    console.log('⚫ DEBUG MODE: Applying dark background to non-correct answer');
                    btn.style.setProperty('background-color', 'var(--ue-bg-dark)', 'important');
                } else {
                    console.log('❌ Debug mode is OFF - no special styling');
                }

                btn.innerHTML = `<span class="font-bold">${choice.text}</span>`;

                // Attach minimal data to dataset
                btn.dataset.choiceNext = choice.next;
                btn.dataset.choiceTimeCost = timeCost;

                // CRITICAL: Store the original index from the SCENARIOS array for stable score tracking
                // We need to find the original index in the unshuffled array
                const originalIndexInChoices = step.choices.indexOf(choice);
                if (originalIndexInChoices !== -1) {
                    btn.dataset.originalIndex = originalIndexInChoices;
                }
                btn.addEventListener('click', () => handleChoice(btn));
                choicesContainer.appendChild(btn);
            });
        }

        /**
         * Called when a user clicks an answer choice.
         * It logs the time cost, saves state, and advances to the next step or concludes the scenario.
         * @param {HTMLElement} choiceButton - The clicked button element.
         */
        function handleChoice(choiceButton) {
            const { choiceNext, choiceTimeCost, originalIndex } = choiceButton.dataset;
            const timeCost = parseFloat(choiceTimeCost);
            const index = parseInt(originalIndex, 10);

            // 1. Log the time cost (updates global state)
            const state = scenarioState[currentScenarioId];
            state.loggedTime += timeCost;

            // 2. Record the original index of the choice made
            state.choicesMade[currentStepId] = index;

            saveScenarioState();

            // 3. Check for scenario conclusion
            if (choiceNext === 'conclusion') {
                finishScenario();
            } else {
                // 4. Move to the next step immediately 
                currentStepId = choiceNext;
                renderStep(currentScenarioId, currentStepId);
            }
        }

        /**
         * Called when a user clicks a scenario card from the backlog.
         * It displays the ticket view and renders the correct starting step.
         * @param {string} scenarioId - The ID of the scenario selected.
         * @param {string|null} startStepId - Optional ID for the step to start at.
         */

        function selectScenario(scenarioId, startStepId = null) {

            // Save previous ticket's progress before switching
            if (currentScenarioId && currentStepId && currentScenarioId !== scenarioId) {
                interruptedSteps[currentScenarioId] = currentStepId;
                StorageManager.remove(StorageManager.KEYS.ACTIVE_SCENARIO);
                StorageManager.remove(StorageManager.KEYS.ACTIVE_STEP);
                saveCurrentTicketState();
            }

            const scenario = window.SCENARIOS[scenarioId];

            // Safety check: If scenario doesn't exist, bail out
            if (!scenario) {
                console.error(`Scenario '${scenarioId}' not found in SCENARIOS object.`);
                return;
            }

            currentScenarioId = scenarioId;

            // Determine starting step: 1. Passed in ID, 2. Interrupted map, 3. Scenario start
            const nextStepId = startStepId
                || interruptedSteps[scenarioId]
                || scenario.start;

            // Update ticket header
            ticketTitle.textContent = scenario.meta.title;
            ticketDescription.textContent = scenario.meta.description;

            // Show ticket content, hide placeholder
            ticketPlaceholder.classList.add('hidden');
            ticketContent.classList.remove('hidden');

            // Check if we are resuming or starting fresh
            const isResuming = interruptedSteps[scenarioId] && interruptedSteps[scenarioId] !== scenario.start;
            const buttonText = isResuming ? "Resume Ticket" : "Start Ticket";

            // Render the "Start Ticket" view instead of the first step immediately
            // Fix: Handle different property names for estimate (estimate vs estimateHours)
            const estimateVal = scenario.meta.estimate || scenario.meta.estimateHours || 0;
            const difficultyVal = scenario.meta.difficulty || 'Medium';

            // Difficulty Color Logic
            let diffColor = 'text-yellow-400';
            if (difficultyVal.toLowerCase() === 'hard') diffColor = 'text-red-400';
            if (difficultyVal.toLowerCase() === 'easy') diffColor = 'text-green-400';

            ticketStepContent.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full p-8 text-center">
                <div class="mb-6 p-6 bg-ue-panel border border-gray-700 rounded-lg max-w-2xl w-full text-left shadow-lg">
                    <h4 class="text-xl font-bold text-gray-100 mb-3">Ticket Details</h4>
                    <p class="text-base text-gray-300 mb-6 leading-relaxed border-b border-gray-700 pb-4">${scenario.meta.description}</p>
                    
                    <div class="grid grid-cols-2 gap-6 text-sm">
                        <div>
                            <span class="block text-gray-500 text-xs uppercase tracking-wider mb-1">Category</span>
                            <span class="text-ue-accent font-semibold text-base">${scenario.meta.category || 'General'}</span>
                        </div>
                        <div>
                            <span class="block text-gray-500 text-xs uppercase tracking-wider mb-1">Est. Time Cost</span>
                            <span class="text-gray-200 font-mono text-base">${estimateVal} hrs</span>
                        </div>
                         <div>
                            <span class="block text-gray-500 text-xs uppercase tracking-wider mb-1">Difficulty</span>
                            <span class="${diffColor} font-bold uppercase text-sm border border-gray-600 px-2 py-0.5 rounded inline-block bg-gray-800">${difficultyVal}</span>
                        </div>
                         <div>
                            <span class="block text-gray-500 text-xs uppercase tracking-wider mb-1">Status</span>
                            <span class="text-gray-400 font-medium">${isResuming ? 'In Progress' : 'Not Started'}</span>
                        </div>
                    </div>
                </div>

                <button id="start-ticket-btn" class="bg-ue-accent hover:bg-orange-600 text-white font-bold py-3 px-10 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 text-lg">
                    ${buttonText}
                </button>
            </div>
        `;

            // Attach listener to the start button
            document.getElementById('start-ticket-btn').addEventListener('click', () => {
                currentStepId = nextStepId;
                renderStep(scenarioId, currentStepId);
                saveCurrentTicketState();
            });

            // Refresh the backlog to highlight the selected ticket
            renderBacklog();
        }

        /**
         * Called when the user completes the final step of a scenario.
         * Marks the scenario as complete and checks if the entire assessment is finished.
         */
        function finishScenario() {
            // Mark as completed
            const state = scenarioState[currentScenarioId];
            state.completed = true;

            // Clear its step from the interrupted map since it's done
            if (interruptedSteps[currentScenarioId]) {
                delete interruptedSteps[currentScenarioId];
            }

            saveScenarioState();
            saveCurrentTicketState();
            renderBacklog();

            // Check if all scenarios are done (triggers final modal)
            const allComplete = Object.values(scenarioState).every(s => s.completed);

            if (allComplete) {
                let totalLoggedTime = Object.values(scenarioState).reduce((acc, s) => acc + s.loggedTime, 0);
                stopTimerOnComplete();
                // Pass the calculated time to the modal
                showAssessmentModal('complete', totalLoggedTime);
            } else {
                // Show the individual ticket conclusion inline
                pauseMainTimer();
                renderSingleTicketConclusion();
            }
        }

        /**
         * Renders the final summary screen for a completed scenario directly into the ticket panel.
         * This provides immediate feedback after finishing one ticket.
         */
        function renderSingleTicketConclusion() {

            const state = scenarioState[currentScenarioId];
            const scenario = window.SCENARIOS[currentScenarioId];
            const estimateHours = scenario.meta.estimateHours;
            const loggedHours = state.loggedTime;

            const timeColorClass = getLoggedTimeColorClass(loggedHours, estimateHours);

            // Calculate overrun/underrun
            const timeDifference = (loggedHours - estimateHours);
            const diffColorClass = timeDifference > 0 ? 'text-red-400' : 'text-green-400';
            const diffLabel = timeDifference > 0 ? 'Over' : 'Under';
            const diffValue = Math.abs(timeDifference);

            let summaryMessage;
            if (loggedHours <= estimateHours) {
                summaryMessage = "Excellent outcome! The solution was found well within the estimated time.";
            } else if (loggedHours <= estimateHours * 1.5) {
                summaryMessage = "Solid work. The solution was delivered, requiring a moderate but acceptable amount of time.";
            } else {
                summaryMessage = "Ticket resolved. The issue was complex, resulting in a higher time log than originally estimated.";
            }

            const buttonText = "Back to Backlog";
            const buttonId = "close-scenario-btn";

            const conclusionHtml = `
            <div class="text-center p-8">
                <h3 class="text-3xl font-bold ${timeColorClass} mb-6">Ticket Resolved</h3>
                <p class="text-lg text-gray-300 mb-8">${summaryMessage}</p>

                <div class="max-w-md mx-auto bg-gray-700/50 p-6 rounded-lg">
                    <h4 class="text-xl font-semibold text-gray-100 mb-4">Ticket Time Breakdown (Step Cost)</h4>
                    <div class="space-y-3 text-left">
                        <div class="flex justify-between text-gray-300">
                            <span>Logged Fix Time:</span>
                            <span class="font-bold">${loggedHours.toFixed(1)} hrs</span>
                        </div>
                        <div class="flex justify-between text-gray-300">
                            <span>Original Estimate:</span>
                            <span class="font-bold text-green-400">${estimateHours.toFixed(1)} hrs</span>
                        </div>
                        <div class="flex justify-between text-lg text-white border-t border-gray-500 pt-3 mt-3">
                            <span class="font-bold">${diffLabel} Budget By:</span>
                            <span class="font-bold ${diffColorClass}">${diffValue.toFixed(1)} hrs</span>
                        </div>
                    </div>
                </div>

                <button id="${buttonId}" class="mt-8 bg-neutral-600 hover:bg-neutral-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-200">
                    ${buttonText}
                </button>
            </div>
        `;

            ticketStepContent.innerHTML = conclusionHtml;

            // Add event listener to the close button
            document.getElementById(buttonId).addEventListener('click', () => {
                // Reset UI to placeholder state
                ticketContent.classList.add('hidden');
                ticketPlaceholder.classList.remove('hidden');

                currentScenarioId = null;
                currentStepId = null;

                saveCurrentTicketState();

                renderBacklog();

                // Resume the timer now that the user is selecting the next task
                resumeMainTimer();
            });
        }

        /* ==========================================================================
           == FINAL ASSESSMENT & COMPLETION LOGIC
           ========================================================================== */
        /**
         * Stops the game when the timer runs out. 
         */
        function endGameByTime() {
            clearInterval(mainTimerInterval);
            StorageManager.remove(StorageManager.KEYS.TIMER);

            if (timerContainer) {
                timerContainer.classList.add('hidden');
            }

            countdownTimer.classList.remove('pulse-red', 'text-cyan-300', 'text-yellow-400');
            countdownTimer.classList.add('text-orange-400');
            countdownTimer.textContent = "00:00";

            // Show "Time's Up" modal
            showAssessmentModal('timeout');
        }

        /**
         * Stops the timer when all scenarios are completed.
         */
        function stopTimerOnComplete() {
            clearInterval(mainTimerInterval);
            StorageManager.remove(StorageManager.KEYS.TIMER);

            // HIDE THE TIMER DISPLAY ENTIRELY
            if (timerContainer) {
                timerContainer.classList.add('hidden');
            }

            // Ensure no low-time colors here
            countdownTimer.classList.remove('pulse-red', 'text-cyan-300', 'text-yellow-400', 'text-orange-400');
            countdownTimer.classList.add('text-green-500');
            countdownTimer.textContent = "Complete!";
        }

        /**
         * Assessment modal rendering function (ONLY for final, global status).
         * This is shown when the timer runs out or all tickets are completed.
         * @param {string} status - 'timeout' or 'complete'.
         * @param {number|null} [totalLoggedTime=null] - Total simulated time in hours.
         * @param {object} [stateToUse=scenarioState] - The state object to use for generating the key.
         */
        function showAssessmentModal(status, totalLoggedTime = null, stateToUse = scenarioState) {
            pauseMainTimer(); // Ensure timer stops when the modal appears

            let mainTitle, subText, mainTitleColor;
            let finalStatsHtml = '';
            let buttonHtml = '';

            // Determine completion based on the state that was passed in
            const allScenariosComplete = Object.values(stateToUse).every(s => s.completed);

            if (status === 'timeout') {
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
                    // If the time is null (e.g., loaded from a cleared state), recalculate from the passed state
                    totalLoggedTime = Object.values(stateToUse).reduce((acc, s) => acc + s.loggedTime, 0);
                }

                // Note: calculateTotalIdealTime correctly uses the global SCENARIOS data
                const { idealTotalTime } = calculateTotalIdealTime(stateToUse);
                const efficiencyScore = totalLoggedTime > 0 ? (idealTotalTime / totalLoggedTime) : 0;
                const finalEfficiencyPercent = Math.round(efficiencyScore * 100);
                const passed = efficiencyScore >= CONFIG.PASS_THRESHOLD;

                // 2. Generate Test Key (Using the state that was passed in)
                const testKey = generateTestKey(stateToUse);

                // --- SCORM / LMS REPORTING ---
                // Reports the efficiency score and the unique test key (GUID) to the LMS (or listener).
                if (typeof window.reportScoreAndGUIDToLMS12 === 'function') {
                    console.log("📡 Reporting Score & GUID to LMS...");
                    window.reportScoreAndGUIDToLMS12(finalEfficiencyPercent, testKey, 100, CONFIG.PASS_THRESHOLD * 100);
                }

                mainTitle = passed ? "Assessment Passed" : "Assessment Completed";
                mainTitleColor = passed ? "text-green-500" : "text-yellow-500";
                subText = passed
                    ? "Congratulations! Your results are logged based on efficient problem-solving."
                    : "You completed all tickets. Review the details below.";

                // 4. Assemble Final Stats HTML (Reproducible Key added back)
                finalStatsHtml = `
                <div class="mt-4 border-t border-gray-600 pt-4">
                    <h4 class="text-xl font-bold ${mainTitleColor} mb-3">Final Time Report</h4>
                    <div class="space-y-2 text-left max-w-sm mx-auto">
                        <div class="flex justify-between text-sm text-gray-200">
                            <span>Total Optimal Time (0.5h/step):</span>
                            <span class="font-bold">${idealTotalTime.toFixed(1)} hrs</span>
                        </div>
                         <div class="flex justify-between text-sm text-gray-200">
                            <span>Total Simulated Time (Choice Cost):</span>
                            <span class="font-bold text-sm">${totalLoggedTime.toFixed(1)} hrs</span>
                        </div>
                        <div class="flex justify-between text-lg text-white border-t border-gray-500 pt-3">
                            <span class="font-bold">Efficiency Score:</span>
                            <span class="font-bold ${mainTitleColor}">${finalEfficiencyPercent}%</span>
                        </div>
                        <p class="text-xs text-gray-400 text-center">(Pass Threshold: ${CONFIG.PASS_THRESHOLD * 100}%)</p>
                    </div>
                </div>
                
                <div class="mt-4 border-t border-gray-600 pt-4">
                    <h4 class="text-xl font-bold text-gray-100 mb-3">Reproducible Test Key</h4>
                    <p class="text-sm text-gray-400 mb-2">Copy this key to recreate this exact test path and results.</p>
                    
                    <div class="flex justify-center">
                        <span id="test-key-display" class="font-mono text-xs md:text-sm bg-gray-700/70 p-3 rounded-lg break-all max-w-full inline-block text-yellow-300">
                            ${testKey}
                        </span>
                    </div>
                    
                    <button id="copy-key-btn" class="mt-3 bg-neutral-600 hover:bg-neutral-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-200">
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
            jiraBoard.classList.add('hidden');
            timesUpScreen.classList.remove('hidden');

            // Attach Copy button listener
            if (allScenariosComplete || totalLoggedTime !== null) {
                const copyButton = document.getElementById('copy-key-btn');
                const keyDisplay = document.getElementById('test-key-display');

                if (copyButton && keyDisplay) {
                    copyButton.addEventListener('click', () => {
                        const keyToCopy = keyDisplay.textContent;

                        // Use document.execCommand('copy') for better compatibility in iframe environments
                        const tempInput = document.createElement('textarea');
                        tempInput.value = keyToCopy;
                        document.body.appendChild(tempInput);
                        tempInput.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempInput);

                        copyButton.textContent = 'Copied!';
                        setTimeout(() => {
                            copyButton.textContent = 'Copy Key';
                        }, 2000);
                    });
                }
            }
        }


        // --- APPLICATION ENTRY POINT ---
        cacheDOMElements();
        attachEventListeners();
        initializeApp();

        // --- EVENT LISTENERS ---

        // Listen for language changes to re-render dynamic content
        document.addEventListener('languageChanged', (e) => {
            // Re-render backlog to update translations
            renderBacklog();
        });

    });

    // Public API - expose only what LMS/external code needs
    return {
        // Currently no public methods needed
        // All interaction happens through DOM and SCORM callbacks
    };
})();

