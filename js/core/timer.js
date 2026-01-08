/**
 * Timer Module
 * Handles countdown timer logic for the UE5 Scenario Tracker
 */

const TimerManager = (function () {
  // Private state
  let timerInterval = null;
  let timeRemaining = 0;
  let timerElement = null;
  let timerContainer = null;
  let onTimeUp = null;

  // Configuration (will be set from APP_CONFIG)
  let TOTAL_TIME = 30 * 60;
  let LOW_TIME_WARNING = 5 * 60;

  /**
   * Initialize the timer with configuration and callbacks
   */
  function init(config = {}) {
    TOTAL_TIME = config.totalTime || 30 * 60;
    LOW_TIME_WARNING = config.lowTimeWarning || 5 * 60;
    timerElement =
      config.timerElement || document.getElementById("countdown-timer");
    timerContainer = timerElement ? timerElement.parentElement : null;
    onTimeUp = config.onTimeUp || (() => console.warn("Time is up!"));

    console.log("[TimerManager] Initialized");
  }

  /**
   * Converts total seconds into MM:SS format for display
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
   * Updates the timer display with visual cues
   */
  function updateDisplay() {
    if (!timerElement) return;

    // Update display text
    timerElement.textContent = formatTime(timeRemaining);

    // Update visual styling based on time remaining
    timerElement.classList.remove(
      "pulse-red",
      "text-neutral-200",
      "text-yellow-400",
      "text-orange-400",
      "text-green-500"
    );

    if (timeRemaining <= LOW_TIME_WARNING && timeRemaining > 0) {
      timerElement.classList.add("text-yellow-400", "pulse-red");
    } else if (timeRemaining > 0) {
      timerElement.classList.add("text-neutral-200");
    }

    // Check for time expiry
    if (timeRemaining <= 0) {
      stop();
      if (onTimeUp) onTimeUp();
      return;
    }

    // Decrement
    timeRemaining--;

    // Persist to localStorage
    localStorage.setItem("ue5ScenarioTimer", timeRemaining.toString());
  }

  /**
   * Start the timer
   * @param {boolean} fresh - If true, reset to full time
   */
  function start(fresh = false) {
    if (fresh) {
      timeRemaining = TOTAL_TIME;
      localStorage.removeItem("ue5ScenarioTimer");
    } else {
      const saved = localStorage.getItem("ue5ScenarioTimer");
      timeRemaining = saved !== null ? parseInt(saved, 10) : TOTAL_TIME;
    }

    // Show timer container
    if (timerContainer && timeRemaining > 0) {
      timerContainer.classList.remove("hidden");
    }

    // Clear any existing interval
    if (timerInterval) clearInterval(timerInterval);

    if (timeRemaining > 0) {
      updateDisplay();
      timerInterval = setInterval(updateDisplay, 1000);
    } else if (onTimeUp) {
      onTimeUp();
    }
  }

  /**
   * Pause the timer
   */
  function pause() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  /**
   * Resume the timer
   */
  function resume() {
    if (!timerInterval && timeRemaining > 0) {
      timerInterval = setInterval(updateDisplay, 1000);
    }
  }

  /**
   * Stop the timer completely
   */
  function stop() {
    pause();
    if (timerContainer) {
      timerContainer.classList.add("hidden");
    }
  }

  /**
   * Get current time remaining
   */
  function getTimeRemaining() {
    return timeRemaining;
  }

  /**
   * Check if timer is running
   */
  function isRunning() {
    return timerInterval !== null;
  }

  // Public API
  return {
    init,
    formatTime,
    start,
    pause,
    resume,
    stop,
    getTimeRemaining,
    isRunning,
  };
})();

// Export for use in other modules
window.TimerManager = TimerManager;
