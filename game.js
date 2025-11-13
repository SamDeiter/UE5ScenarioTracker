// Wait for the DOM to be fully loaded before running the game logic
document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION ---
    // MODIFIED: Reverting to original time limit constants
    const TOTAL_TEST_TIME_SECONDS = 30 * 60; // 30 minutes
    const LOW_TIME_WARNING_SECONDS = 5 * 60; // 5 minutes
    const REAL_TIME_PENALTY_RATE = 1.0 / 100; // Adds +1.0 logged hours for every 100 real seconds spent
    const PASS_THRESHOLD = 0.80; // Pass if (Ideal Time / Logged Time) >= 80%

    // --- DOM Elements ---
    let headerControls, backlogList, ticketViewColumn, ticketPlaceholder, 
        ticketContent, ticketTitle, ticketDescription, ticketStepContent,
        debugToggle, restartBtn, countdownTimer, jiraBoard, timesUpScreen,
        restartTimerBtn;

    // --- Game State ---
    let scenarioState = {}; // Stores progress for each scenario
    let currentScenarioId = null; // The key of the currently active scenario (e.g., 'golem')
    let currentStepId = null; // The key of the current step in the active scenario
    let interruptedSteps = {}; // NEW: Stores the last step for *every* open scenario
    let isDebugMode = false;
    let mainTimerInterval = null; // Holds the interval for the 30-min countdown
    
    // MODIFIED: Reverting to the countdown state variable
    let timeRemaining = TOTAL_TEST_TIME_SECONDS; 

    let scenarioStartTime = 0; // Timestamp for when a scenario was started
    let lastStepTimeCost = 0; // Stores the time cost of the most recent choice
    
	// --- TIMER & TIME UTILITIES ---
    
    /**
     * Converts seconds into MM:SS format.
     */
    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    /**
     * Calculates the time cost for a choice type.
     * @param {string} type - 'correct', 'partial', 'misguided', 'wrong'.
     * @returns {number} Time cost in hours.
     */
    function getTimeCostForChoice(type) {
        switch (type) {
            case 'correct':
                return 0.5; // Optimal
            case 'partial':
                return 1.0; // Standard
            case 'misguided':
                return 1.5; // Extended
            case 'wrong':
                return 2.0; // Maximum
            default:
                return 0;
        }
    }

    // --- TIMER LOGIC (RESTORED COUNTDOWN) ---
    
    /**
     * Updates the main timer display and checks for time expiry.
     */
    function updateMainTimerDisplay() {
        // 1. Update Display
        countdownTimer.textContent = formatTime(timeRemaining);
        
        // 2. Update Color/Pulse based on time left (Restored Logic)
        countdownTimer.classList.remove('pulse-red', 'text-blue-300', 'text-yellow-400', 'text-orange-400', 'text-green-500');
        if (timeRemaining <= LOW_TIME_WARNING_SECONDS && timeRemaining > 0) {
            countdownTimer.classList.add('text-yellow-400', 'pulse-red');
        } else if (timeRemaining > 0) {
            countdownTimer.classList.add('text-blue-300');
        }

        // 3. Time's Up Check
        if (timeRemaining <= 0) {
            endGameByTime();
            return;
        }

        // 4. Decrement
        timeRemaining--;
        
        // 5. Save to Local Storage (Restored Key)
        localStorage.setItem('ue5ScenarioTimer', timeRemaining.toString());
        // Clean up the old 'elapsed' key just in case, on the first tick after load
        localStorage.removeItem('ue5ScenarioTimerElapsed'); 
    }

    /**
     * Starts the main 30-minute countdown timer.
     * @param {boolean} isInitialStart - True if starting from scratch (clears saved state).
     */
    function startMainTimer(isInitialStart = false) {
        // Load or reset the timer state
        if (isInitialStart) {
            // MODIFIED: Reset to full time and clear the countdown key
            timeRemaining = TOTAL_TEST_TIME_SECONDS;
            localStorage.removeItem('ue5ScenarioTimer');
        } else {
            // MODIFIED: Load the timeRemaining value
            const savedTime = localStorage.getItem('ue5ScenarioTimer');
            if (savedTime !== null) {
                timeRemaining = parseInt(savedTime, 10);
            } else {
                timeRemaining = TOTAL_TEST_TIME_SECONDS;
            }
        }
        
        // Start the interval if it's not already running
        if (mainTimerInterval) clearInterval(mainTimerInterval);
        
        // Only start if time is left
        if (timeRemaining > 0) {
             updateMainTimerDisplay(); // Initial display update
             mainTimerInterval = setInterval(updateMainTimerDisplay, 1000);
        } else {
             endGameByTime(); // Time already ran out on load
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
     * Resumes the countdown timer.
     */
    function resumeMainTimer() {
        if (!mainTimerInterval) {
            // Only resume if the assessment isn't fully completed
            const allComplete = Object.values(scenarioState).every(state => state.completed);
            if (!allComplete) {
                mainTimerInterval = setInterval(updateMainTimerDisplay, 1000);
            }
        }
    }

    // --- CORE GAME INITIALIZATION ---

    /**
     * The primary entry point for setting up the game state.
     */
    function initializeApp() {
        // 1. Load data from local storage
        loadScenarioState();
        loadInterruptedSteps();
        
        // 2. Check for crash recovery / active scenario
        const activeScenarioId = localStorage.getItem('ue5ActiveScenario');
        const activeStepId = localStorage.getItem('ue5ActiveStep');
        
        // 3. Start the timer (loads saved time or starts at 30:00)
        startMainTimer();

        // 4. Render the backlog
        renderBacklog();
        
        // 5. Recover the active ticket view if the state was saved
        if (activeScenarioId && activeStepId) {
             // Pass the saved step ID for a smooth recovery
             selectScenario(activeScenarioId, activeStepId);
        }
    }
    // ... (rest of the file remains the same)
	
    // --- CORE INITIALIZATION HELPERS (Defined first for reliable access) ---
    
    /**
     * Finds and assigns all necessary DOM elements to global variables.
     * This is called once the DOM is loaded.
     */
    function cacheDOMElements() {
        headerControls = document.getElementById('header-controls');
        backlogList = document.getElementById('backlog-list');
        ticketViewColumn = document.getElementById('ticket-view-column');
        ticketPlaceholder = document.getElementById('ticket-placeholder');
        ticketContent = document.getElementById('ticket-content');
        ticketTitle = document.getElementById('ticket-title');
        ticketDescription = document.getElementById('ticket-description');
        ticketStepContent = document.getElementById('ticket-step-content');
        debugToggle = document.getElementById('debug-toggle');
        restartBtn = document.getElementById('restart-btn');
        countdownTimer = document.getElementById('countdown-timer');
        jiraBoard = document.getElementById('jira-board');
        timesUpScreen = document.getElementById('times-up-screen');
        restartTimerBtn = document.getElementById('restart-timer-btn');
    }
    
    /**
     * Attaches all initial event listeners.
     */
    function attachEventListeners() {
        // Toggle debug mode
        debugToggle.addEventListener('change', (e) => {
            isDebugMode = e.target.checked;
            
            // --- NEW LOGIC: Pause/Resume Countdown Timer ---
            if (isDebugMode) {
                pauseMainTimer();
            } else {
                // Resume timer only if the assessment is not yet complete
                const allComplete = Object.values(scenarioState).every(state => state.completed);
                if (!allComplete) {
                    resumeMainTimer();
                }
            }
            // -------------------------------------
            
            // If a scenario is active, re-render the current step to show/hide hints
            if (currentScenarioId && currentStepId) {
                // When toggling, we want to reset the time cost display so it doesn't show feedback
                lastStepTimeCost = 0;
                renderStep(currentScenarioId, currentStepId);
            }
        });

        // Restart all scenarios (hard reset of state + timer)
        restartBtn.addEventListener('click', () => {
            // NOTE: Using a custom modal/message box is better than confirm(), 
            // but for simple logic we keep this check.
            if (!confirm("Are you sure you want to reset all scenario progress?")) return;

            if (mainTimerInterval) clearInterval(mainTimerInterval);
            resetAllScenarioState();
            renderBacklog();

            // Reset ticket pane to placeholder state
            ticketContent.classList.add('hidden');
            ticketPlaceholder.classList.remove('hidden');
            currentScenarioId = null;
            currentStepId = null;
            lastStepTimeCost = 0; // Reset last step cost
            
            // Clear active ticket state
            saveCurrentTicketState();

            // Restart main timer cleanly (starts at 30:00 again)
            startMainTimer(true);
        });

        // Restart button on the "Time's Up" screen (Modal)
        // Note: Listener is attached dynamically in showAssessmentModal
        window.addEventListener('beforeunload', saveCurrentTicketState);
    }
    
    // --- UTILITY & STATE DEPENDENCIES ---
    
    /**
     * Calculates the total number of optimal steps (1.0 hour each) across all scenarios.
     * @returns {{totalSteps: number, idealTotalTime: number}}
     */
    function calculateTotalIdealTime() {
        let totalSteps = 0;
        // Since each 'correct' choice costs 0.5 hour, the ideal time is (total steps * 0.5).
        Object.values(window.SCENARIOS).forEach(scenario => {
            if (scenario.steps) {
                totalSteps += Object.keys(scenario.steps).length;
            }
        });
        return {
            totalSteps: totalSteps,
            idealTotalTime: totalSteps * 0.5 
        };
    }

    // --- STATE MANAGEMENT ---

    /**
     * Loads game state from localStorage.
     */
    function loadScenarioState() {
        const savedStateJSON = localStorage.getItem('ue5ScenarioState');
        let savedState = {};

        // Try to parse the saved state, but reset if it's corrupt
        if (savedStateJSON) {
            try {
                savedState = JSON.parse(savedStateJSON);
            } catch (e) {
                console.error("Failed to parse saved state, resetting.", e);
                savedState = {}; 
            }
        }

        const newScenarioState = {};
        
        // Iterate over the master list of scenarios from questions.js
        Object.keys(window.SCENARIOS).forEach(scenarioId => {
            // Define the default, "perfect" state for a scenario
            const defaultState = {
                completed: false,
                loggedTime: 0,
                realTimePenalty: 0
            };

            // Merge the saved data (if any) onto the default.
            newScenarioState[scenarioId] = {
                ...defaultState,
                // Ensure we merge only if the scenario state exists
                ...(savedState[scenarioId] || {})
            };
        });
        
        scenarioState = newScenarioState;

        // Save the validated/merged state back to localStorage
        saveScenarioState();
    }

    /**
     * Saves the current game state to localStorage.
     */
    function saveScenarioState() {
        localStorage.setItem('ue5ScenarioState', JSON.stringify(scenarioState));
    }

    /**
     * Resets all progress, ensuring all new entries have 0 time.
     */
    function resetAllScenarioState() {
        scenarioState = {};
        Object.keys(window.SCENARIOS).forEach(scenarioId => {
            scenarioState[scenarioId] = {
                completed: false,
                loggedTime: 0,
                realTimePenalty: 0
            };
        });
        interruptedSteps = {}; // Also clear interrupted steps on full reset
        saveScenarioState();
    }

    /**
     * Loads the multi-ticket progress map upon initialization.
     */
    function loadInterruptedSteps() {
        const savedInterruptedJSON = localStorage.getItem('ue5InterruptedSteps');
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
     * Saves the current active scenario's step and the multi-ticket progress map.
     */
    function saveCurrentTicketState() {
        // 1. Save the *single* currently open ticket state (for browser restart/crash recovery)
        if (currentScenarioId && currentStepId) {
            localStorage.setItem('ue5ActiveScenario', currentScenarioId);
            localStorage.setItem('ue5ActiveStep', currentStepId);
        } else {
            localStorage.removeItem('ue5ActiveScenario');
            localStorage.removeItem('ue5ActiveStep');
        }

        // 2. Save the multi-ticket progress map
        localStorage.setItem('ue5InterruptedSteps', JSON.stringify(interruptedSteps));
    }

    // --- UI RENDERING & FLOW ---

    /**
     * Renders the list of tickets in the backlog (left column).
     */
    function renderBacklog() {
        backlogList.innerHTML = ''; // Clear existing list
        
        // 1. Get all raw scenario keys.
        const scenarioKeys = Object.keys(window.SCENARIOS);
        
        // 2. Map those keys to their full scenario objects, filtering out null/undefined entries.
        const validScenarios = scenarioKeys
            .map(id => ({ id, data: window.SCENARIOS[id] }))
            // Filter: Must have data, must have meta, and must have title/estimateHours defined
            .filter(item => 
                item.data && 
                item.data.meta && 
                item.data.meta.title &&
                typeof item.data.meta.estimateHours !== 'undefined'
            );

        // 3. Iterate ONLY over the valid scenarios.
        validScenarios.forEach(item => {
            const scenarioId = item.id;
            const scenario = item.data;
            const state = scenarioState[scenarioId];

            // Safely extract metadata properties (now guaranteed to exist)
            const meta = scenario.meta;
            const title = meta.title;
            const description = meta.description ? meta.description.substring(0, 70) + '...' : "No description available.";
            
            // Ensure estimate is always a number (defaulting to 0) before toFixed() is called.
            let estimate = parseFloat(meta.estimateHours); 
            if (isNaN(estimate)) {
                estimate = 0;
            }
            
            const card = document.createElement('div');
            // Highlight card if it is the current open ticket
            const isActive = currentScenarioId === scenarioId && !state.completed;
            
            card.className = `p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-200 ${
                state.completed 
                    ? 'bg-gray-700/50 border-green-600' 
                    : isActive
                        ? 'bg-blue-900/40 border-blue-400 ring-2 ring-blue-400' 
                        : 'bg-gray-700 hover:bg-gray-600/80 border-blue-500'
            }`;
            card.dataset.scenarioId = scenarioId;

            let statusSpan;
            let loggedTimeDisplay = '';

            if (state.completed) {
                const logged = state.loggedTime;
                const isOverBudget = logged > estimate;

                statusSpan = `<span class="text-xs font-semibold text-green-400">COMPLETED</span>`;
                loggedTimeDisplay = `
                    <div class="text-sm text-gray-300">
                        Logged: <span class="font-bold ${isOverBudget ? 'text-orange-400' : 'text-green-400'}">${logged.toFixed(1)} hrs</span> / 
                        Est: <span class="font-bold text-gray-400">${estimate.toFixed(1)} hrs</span>
                    </div>
                `;
            } else {
                 // Check if interrupted (i.e., user left this ticket)
                 const savedStepId = interruptedSteps[scenarioId];
                 
                 if (savedStepId && savedStepId !== scenario.start) {
                     // Ticket is in progress
                     const stepNumber = Object.keys(scenario.steps).indexOf(savedStepId) + 1;
                     statusSpan = `<span class="text-xs font-semibold text-yellow-400">IN PROGRESS (Step ${stepNumber})</span>`;
                 } else {
                     // Ticket not started
                     statusSpan = `<span class="text-xs font-semibold text-blue-400">NOT STARTED</span>`;
                 }
                
                loggedTimeDisplay = `
                    <div class="text-sm text-gray-400">
                        Est. Time: <span class="font-bold">${estimate.toFixed(1)} hrs</span>
                    </div>
                `;
            }
            
            const html = `
                <h4 class="font-bold ${state.completed ? 'text-gray-400 line-through' : 'text-gray-100'}">${title}</h4>
                <p class="text-xs text-gray-400 mt-1">${description}</p>
                <div class="mt-3 pt-3 border-t border-gray-600">
                    ${statusSpan}
                    ${loggedTimeDisplay}
                </div>
            `;


            card.innerHTML = html;
            
            // Add click event if not completed
            if (!state.completed) {
                card.addEventListener('click', () => selectScenario(scenarioId));
            }

            backlogList.appendChild(card);
        });
    }
    
    /**
     * Renders a specific step (prompt and choices) of a scenario.
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

        // --- Multi-Ticket Fix: Save the current state immediately ---
        saveCurrentTicketState();

        // 2. Shuffle choices (always visible)
        const shuffledChoices = [...step.choices].sort(() => Math.random() - 0.5);

        // 3. Determine Step Number for display
        const stepKeys = Object.keys(scenario.steps);
        const stepIndex = stepKeys.indexOf(stepId);
        const stepNumber = stepIndex !== -1 ? stepIndex + 1 : 1;
        const totalSteps = stepKeys.length;

        // 4. Time Log Display (for the action *just* completed)
        let timeLogHtml = '';
        if (lastStepTimeCost > 0) {
            timeLogHtml = `
                <div class="mb-4 p-3 bg-gray-800/80 border border-gray-700 rounded-lg text-sm font-semibold text-gray-300">
                    <div class="flex justify-between items-center">
                        <span class="text-yellow-400">Previous Action Cost:</span>
                        <span class="font-bold">${lastStepTimeCost.toFixed(1)} hrs</span>
                    </div>
                </div>
            `;
        }
        
        // 5. Build the Step Prompt and Choices
        const stepHtml = `
            ${timeLogHtml}
            <div id="ticket-step-prompt" class="mb-6">
                <h5 class="text-xl font-bold text-gray-200 mb-4">Step ${stepNumber} / ${totalSteps}: ${step.title}</h5>
                <div class="prose prose-sm prose-invert text-gray-300">${step.prompt}</div>
            </div>
            <div id="ticket-step-choices" class="space-y-3"></div>
        `;

        ticketStepContent.innerHTML = stepHtml;

        const choicesContainer = ticketStepContent.querySelector('#ticket-step-choices');

        // 6. Create Choice Buttons
        shuffledChoices.forEach(choice => {
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
                debugClass = 'border-gray-600 hover:border-blue-500';
            }
            
            btn.className = `block w-full text-left p-4 bg-gray-700 hover:bg-gray-600 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 ${debugClass}`;
            
            btn.innerHTML = `<span class="font-bold">${choice.text}</span>`; // Use innerHTML for action prefix

            // Attach minimal data to dataset
            btn.dataset.choiceType = choice.type;
            btn.dataset.choiceNext = choice.next;
            btn.dataset.choiceTimeCost = timeCost;
            
            btn.addEventListener('click', () => handleChoice(btn));
            choicesContainer.appendChild(btn);
        });
        
        // After rendering, clear the last step cost so it only shows up once
        lastStepTimeCost = 0;
        
        // Re-render backlog to update active/interrupted status
        renderBacklog();
    }

    /**
     * Called when a user clicks an answer choice.
     */
    function handleChoice(choiceButton) {
        const { choiceType, choiceNext, choiceTimeCost } = choiceButton.dataset;
        const timeCost = parseFloat(choiceTimeCost);
        
        // 1. Log the time cost (updates global state)
        const state = scenarioState[currentScenarioId];
        state.loggedTime += timeCost;
        saveScenarioState();

        // 2. Store the time cost for display on the *next* step
        lastStepTimeCost = timeCost;

        // 3. Check for scenario conclusion
        if (choiceNext === 'conclusion') {
            finishScenario();
        } else {
            // 4. Move to the next step immediately (continuous flow)
            currentStepId = choiceNext;
            renderStep(currentScenarioId, currentStepId);
        }
    }

    /**
     * Called when a user clicks a scenario card from the backlog.
     * @param {string} scenarioId - The key of the scenario to start.
     * @param {string} startStepId - The step ID to start from (used for crash recovery).
     */
    function selectScenario(scenarioId, startStepId = null) {
        
        // --- MULTI-TICKET FIX: Save previous ticket's progress before switching ---
        if (currentScenarioId && currentStepId && currentScenarioId !== scenarioId) {
            // Save the exact step where the user interrupted the previous scenario
            interruptedSteps[currentScenarioId] = currentStepId;
            saveCurrentTicketState(); // Save the map immediately
        }
        // -------------------------------------------------------------------------
        
        // 1. Resume timer (if not in debug mode)
        if (!isDebugMode) {
            resumeMainTimer();
        }
        
        // 2. Set the scenario references
        const scenario = window.SCENARIOS[scenarioId];
        
        // Determine starting step: 1. Passed in ID (crash recovery), 2. Interrupted map, 3. Scenario start
        currentStepId = startStepId 
            || interruptedSteps[scenarioId] 
            || scenario.start; 
        
        // 3. Update ticket header
        ticketTitle.textContent = scenario.meta.title;
        ticketDescription.textContent = scenario.meta.description;

        // Show ticket content, hide placeholder
        ticketPlaceholder.classList.add('hidden');
        ticketContent.classList.remove('hidden');

        // 4. Render the chosen step
        renderStep(scenarioId, currentStepId);
        
        // 5. Update the global active ticket tracking
        currentScenarioId = scenarioId;
        scenarioStartTime = Date.now(); // Reset scenario timer for real-time penalty calculation
        saveCurrentTicketState();
    }
    
    // Note: finishScenario depends on renderSingleTicketConclusion and showAssessmentModal
    /**
     * Called when the user clicks "Finish Scenario" on the last step.
     */
    function finishScenario() {
        // Calculate real-time penalty
        const scenarioEndTime = Date.now();
        const realTimeElapsedSeconds = (scenarioEndTime - scenarioStartTime) / 1000;
        const realTimePenalty = realTimeElapsedSeconds * REAL_TIME_PENALTY_RATE;

        // Add penalty to the logged time
        const state = scenarioState[currentScenarioId];
        state.completed = true;
        state.realTimePenalty = realTimePenalty;
        state.loggedTime += realTimePenalty;
        
        // Clear its step from the interrupted map since it's done
        if (interruptedSteps[currentScenarioId]) {
            delete interruptedSteps[currentScenarioId];
        }

        saveScenarioState();
        
        // Clear active ticket state (for crash recovery)
        saveCurrentTicketState();
        
        // Re-render the backlog to show the completed state
        renderBacklog();
        
        // Check if all scenarios are done (triggers final modal)
        const allComplete = Object.values(scenarioState).every(s => s.completed);
        
        if (allComplete) {
            stopTimerOnComplete(); // This calls the final PASS/FAIL modal
        } else {
             // Show the individual ticket conclusion inline
            renderSingleTicketConclusion();
        }
    }
    
    /**
     * Renders the final summary screen for a completed scenario directly into the ticket panel.
     */
    function renderSingleTicketConclusion() {
        // Pause timer, but keep it hidden if the rest of the game is running
        pauseMainTimer(); 
        
        const state = scenarioState[currentScenarioId];
        const scenario = window.SCENARIOS[currentScenarioId];
        const estimate = scenario.meta.estimateHours;
        const logged = state.loggedTime;
        const realTimePenalty = state.realTimePenalty;
        const simulatedTime = logged - realTimePenalty;

        // Determine color based on individual ticket performance (non-red scale)
        let timeColorClass;
        if (logged <= estimate) {
            timeColorClass = 'text-green-400';
        } else if (logged <= estimate * 2) {
            timeColorClass = 'text-yellow-400';
        } else {
            timeColorClass = 'text-orange-400';
        }

        // Determine upbeat message based on efficiency
        let summaryMessage;
        if (logged <= estimate) {
            summaryMessage = "Excellent outcome! The solution was found well within the estimated time.";
        } else if (logged <= estimate * 1.5) {
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
                    <h4 class="text-xl font-semibold text-gray-100 mb-4">Ticket Time Breakdown</h4>
                    <div class="space-y-3 text-left">
                        <div class="flex justify-between text-gray-300">
                            <span>Simulated Fix Time:</span>
                            <span class="font-bold">${simulatedTime.toFixed(1)} hrs</span>
                        </div>
                        <div class="flex justify-between text-gray-300">
                            <span>Real-Time Penalty:</span>
                            <span class="font-bold text-yellow-400">+ ${realTimePenalty.toFixed(1)} hrs</span>
                        </div>
                        <div class="flex justify-between text-lg text-white border-t border-gray-500 pt-3 mt-3">
                            <span class="font-bold">Total Logged Time:</span>
                            <span class="font-bold ${timeColorClass}">${logged.toFixed(1)} hrs</span>
                        </div>
                        <div class="flex justify-between text-sm text-gray-400">
                            <span>Original Estimate:</span>
                            <span>${estimate.toFixed(1)} hrs</span>
                        </div>
                    </div>
                </div>

                <button id="${buttonId}" class="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-200">
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
            lastStepTimeCost = 0; // Reset last step cost

            // Clear active ticket state in localStorage
            saveCurrentTicketState();

            // Re-render the backlog to ensure active status is gone
            renderBacklog();
            
            // Resume the timer now that the user is selecting the next task
            if (!isDebugMode) {
                 resumeMainTimer();
            }
        });
    }

    /**
     * Stops the game when the timer runs out. 
     */
    function endGameByTime() {
        clearInterval(mainTimerInterval);
        // MODIFIED: Clear the countdown key
        localStorage.removeItem('ue5ScenarioTimer'); 
        countdownTimer.classList.remove('pulse-red', 'text-blue-300', 'text-yellow-400');
        countdownTimer.classList.add('text-orange-400');
        countdownTimer.textContent = "00:00";
        // MODIFIED: Show the correct 'timeout' modal
        showAssessmentModal('timeout'); 
    }
    
    /**
     * Stops the timer when all scenarios are completed.
     */
    function stopTimerOnComplete() {
        clearInterval(mainTimerInterval);
        // MODIFIED: Clear the time remaining key when complete
        localStorage.removeItem('ue5ScenarioTimer'); 
        // Ensure no low-time colors here
        countdownTimer.classList.remove('pulse-red', 'text-blue-300', 'text-yellow-400', 'text-orange-400');
        countdownTimer.classList.add('text-green-500');
        countdownTimer.textContent = "Complete!";
        
        // Check if all scenarios are complete and show the modal if true.
        const allComplete = Object.values(scenarioState).every(s => s.completed);
        if (allComplete) {
            showAssessmentModal('complete');
        }
    }

    /**
     * Assessment modal rendering function (ONLY for final, global status).
     */
    function showAssessmentModal(status) {
        pauseMainTimer(); // Ensure timer stops when the modal appears

        // --- Determine Status and Content ---
        let mainTitle, subText, mainTitleColor, buttonText;
        let finalStatsHtml = '';
        let buttonId = "close-modal-btn";
        let buttonDisabled = false;
        
        const allScenariosComplete = Object.values(scenarioState).every(s => s.completed);

        if (status === 'timeout') {
            // MODIFIED: Reverting to original timeout text
            mainTitle = "Time's Up!";
            subText = "The 30-minute assessment period has ended. Please restart to begin a new session.";
            mainTitleColor = "text-orange-400";
            buttonText = "Restart Assessment";
            buttonId = "restart-timer-btn"; // Hooks up to location.reload()
            
        } else if (allScenariosComplete) {
            // --- Final Score Calculation ---
            let totalLoggedTime = 0;
            
            Object.values(scenarioState).forEach(s => {
                totalLoggedTime += s.loggedTime;
            });
            
            const { totalSteps, idealTotalTime } = calculateTotalIdealTime();
            const efficiencyScore = totalLoggedTime > 0 ? (idealTotalTime / totalLoggedTime) : 0;
            const passed = efficiencyScore >= PASS_THRESHOLD;
            
            mainTitle = passed ? "Assessment Passed" : "Assessment Completed";
            mainTitleColor = passed ? "text-green-500" : "text-yellow-500";
            subText = passed 
                ? "Congratulations! Your logged time efficiency meets or exceeds the required benchmark."
                : "You completed all tickets. Review the breakdown to identify high-cost areas.";
            
            buttonText = "Assessment Complete - Review Final Stats";
            buttonDisabled = true; 
            
            finalStatsHtml = `
                <div class="mt-8 border-t border-gray-600 pt-6">
                    <h4 class="text-xl font-bold ${mainTitleColor} mb-4">Final Time Report</h4>
                    <div class="space-y-2 text-left max-w-sm mx-auto">
                        <div class="flex justify-between text-lg text-gray-200">
                            <span>Total Optimal Time (0.5h/step):</span>
                            <span class="font-bold">${idealTotalTime.toFixed(1)} hrs</span>
                        </div>
                         <div class="flex justify-between text-lg text-gray-200">
                            <span>Total Logged Time:</span>
                            <span class="font-bold text-lg">${totalLoggedTime.toFixed(1)} hrs</span>
                        </div>
                        <div class="flex justify-between text-lg text-white border-t border-gray-500 pt-3">
                            <span class="font-bold">Efficiency Score:</span>
                            <span class="font-bold ${mainTitleColor}">${(efficiencyScore * 100).toFixed(1)}%</span>
                        </div>
                        <p class="text-xs text-gray-400 text-center">(Pass Threshold: ${PASS_THRESHOLD * 100}%)</p>
                    </div>
                </div>
            `;
        }
        // --- End Status Determination ---


        // --- Render Modal ---
        const modalContentHtml = `
            <div class="bg-gray-800 p-8 rounded-xl shadow-2xl text-center max-w-lg w-full">
                <h2 class="text-4xl font-extrabold ${mainTitleColor} mb-3">${mainTitle}</h2>
                <p class="text-lg text-gray-300 mb-8">${subText}</p>
                
                ${finalStatsHtml}

                <button id="${buttonId}" class="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-200 ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''}" ${buttonDisabled ? 'disabled' : ''}>
                    ${buttonText}
                </button>
            </div>
        `;

        timesUpScreen.innerHTML = modalContentHtml;
        jiraBoard.classList.add('hidden');
        timesUpScreen.classList.remove('hidden');

        // Attach listener for buttons
        if (buttonId === "restart-timer-btn") {
            document.getElementById(buttonId).addEventListener('click', () => {
                // Perform a clean reset on hard reload
                localStorage.removeItem('ue5ScenarioTimer'); // Clears the countdown key
                localStorage.removeItem('ue5ScenarioState');
                localStorage.removeItem('ue5InterruptedSteps');
                localStorage.removeItem('ue5ActiveScenario');
                localStorage.removeItem('ue5ActiveStep');
                location.reload(); 
            });
        }
        
    }


    // --- Entry Point ---
    cacheDOMElements();
    attachEventListeners();
    initializeApp();

});