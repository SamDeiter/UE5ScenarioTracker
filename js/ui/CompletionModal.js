/**
 * CompletionModal.js
 * Shows a celebratory popup when a scenario is completed
 */

window.CompletionModal = (function () {
  let modalElement = null;
  let confettiContainer = null;

  /**
   * Initialize the modal (create DOM elements)
   */
  function init() {
    if (modalElement) return; // Already initialized

    // Create modal overlay
    modalElement = document.createElement("div");
    modalElement.className = "completion-modal-overlay";
    modalElement.id = "completion-modal-overlay";

    modalElement.innerHTML = `
      <div class="completion-modal">
        <div class="completion-icon">🎉</div>
        <h2 class="completion-title">Scenario Complete!</h2>
        <p class="completion-subtitle" id="completion-scenario-title">You've successfully resolved this issue.</p>
        <div class="completion-stats">
          <div class="completion-stat-row">
            <span class="text-gray-400">Time Spent:</span>
            <span class="font-bold text-white" id="completion-time-spent">0.0 hrs</span>
          </div>
          <div class="completion-stat-row">
            <span class="text-gray-400">Estimated Time:</span>
            <span class="font-bold text-green-400" id="completion-estimated-time">0.0 hrs</span>
          </div>
          <div class="completion-stat-row">
            <span class="text-gray-400">Performance:</span>
            <span class="font-bold" id="completion-performance">Excellent!</span>
          </div>
        </div>
        <button class="completion-continue-btn" id="completion-continue-btn">
          Continue to Results →
        </button>
      </div>
    `;

    document.body.appendChild(modalElement);

    // Create confetti container
    confettiContainer = document.createElement("div");
    confettiContainer.className = "confetti-container";
    confettiContainer.id = "confetti-container";
    document.body.appendChild(confettiContainer);

    // Click overlay to close
    modalElement.addEventListener("click", (e) => {
      if (e.target === modalElement) {
        hide();
      }
    });
  }

  /**
   * Create confetti particles
   */
  function createConfetti() {
    if (!confettiContainer) return;

    confettiContainer.innerHTML = "";

    const colors = [
      "#22c55e", // Green
      "#f59e0b", // Yellow
      "#3b82f6", // Blue
      "#a855f7", // Purple
      "#ef4444", // Red
      "#ec4899", // Pink
    ];

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      confetti.style.width = `${6 + Math.random() * 8}px`;
      confetti.style.height = confetti.style.width;
      confettiContainer.appendChild(confetti);
    }

    // Clean up confetti after animation
    setTimeout(() => {
      if (confettiContainer) {
        confettiContainer.innerHTML = "";
      }
    }, 4000);
  }

  /**
   * Show the completion modal
   * @param {Object} options - Configuration
   * @param {string} options.scenarioId - The completed scenario ID
   * @param {string} options.scenarioTitle - The scenario title
   * @param {number} options.timeSpent - Time spent on scenario (hours)
   * @param {number} options.estimatedTime - Estimated time (hours)
   * @param {Function} options.onContinue - Callback when continue is clicked
   */
  function show(options = {}) {
    init();

    const {
      scenarioId,
      scenarioTitle,
      timeSpent = 0,
      estimatedTime = 0,
      onContinue,
    } = options;

    // Update modal content
    const titleEl = document.getElementById("completion-scenario-title");
    const timeSpentEl = document.getElementById("completion-time-spent");
    const estimatedTimeEl = document.getElementById(
      "completion-estimated-time"
    );
    const performanceEl = document.getElementById("completion-performance");
    const continueBtn = document.getElementById("completion-continue-btn");

    if (titleEl) {
      titleEl.textContent =
        scenarioTitle || "You've successfully resolved this issue.";
    }

    if (timeSpentEl) {
      timeSpentEl.textContent = `${timeSpent.toFixed(1)} hrs`;
    }

    if (estimatedTimeEl) {
      estimatedTimeEl.textContent = `${estimatedTime.toFixed(1)} hrs`;
    }

    if (performanceEl) {
      const ratio = estimatedTime > 0 ? timeSpent / estimatedTime : 1;
      if (ratio <= 1) {
        performanceEl.textContent = "🌟 Excellent!";
        performanceEl.className = "font-bold text-green-400";
      } else if (ratio <= 1.5) {
        performanceEl.textContent = "👍 Good";
        performanceEl.className = "font-bold text-yellow-400";
      } else {
        performanceEl.textContent = "📝 Completed";
        performanceEl.className = "font-bold text-gray-400";
      }
    }

    // Set up continue button
    if (continueBtn) {
      continueBtn.onclick = () => {
        hide();
        if (onContinue) onContinue();
      };
    }

    // Show modal
    setTimeout(() => {
      modalElement.classList.add("active");
      createConfetti();
    }, 100);
  }

  /**
   * Hide the completion modal
   */
  function hide() {
    if (modalElement) {
      modalElement.classList.remove("active");
    }
    if (confettiContainer) {
      confettiContainer.innerHTML = "";
    }
  }

  /**
   * Check if modal is currently visible
   */
  function isVisible() {
    return modalElement && modalElement.classList.contains("active");
  }

  // Public API
  return {
    init,
    show,
    hide,
    isVisible,
  };
})();

console.log("[CompletionModal] Module loaded");
