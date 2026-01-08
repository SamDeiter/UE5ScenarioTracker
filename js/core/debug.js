/**
 * Debug Mode Module
 * Handles debug mode toggle, password authentication, and debug UI
 */

const DebugManager = (function () {
  // Private state
  let isDebugMode = false;
  let passwordModalVisible = false;
  let debugDropdownElement = null;
  let debugToggleElement = null;

  // Callbacks
  let onDebugToggle = null;
  let onRenderStep = null;
  let pauseTimer = null;
  let resumeTimer = null;

  /**
   * Initialize the debug manager
   */
  function init(config = {}) {
    debugDropdownElement =
      config.debugDropdown || document.getElementById("debug-dropdown");
    debugToggleElement =
      config.debugToggle || document.getElementById("debug-toggle");
    onDebugToggle = config.onToggle || (() => {});
    onRenderStep = config.onRenderStep || (() => {});
    pauseTimer = config.pauseTimer || (() => {});
    resumeTimer = config.resumeTimer || (() => {});

    // Ensure debug UI is hidden on init
    if (debugDropdownElement) {
      debugDropdownElement.classList.add("hidden");
    }

    console.log("[DebugManager] Initialized");
  }

  /**
   * Toggle debug mode on/off
   */
  function toggle(forceDisable = false) {
    if (forceDisable) {
      isDebugMode = false;
    } else {
      isDebugMode = !isDebugMode;
    }

    // Update UI visibility
    if (debugDropdownElement) {
      debugDropdownElement.classList.toggle("hidden", !isDebugMode);
    }

    // Update timer based on mode
    if (isDebugMode) {
      pauseTimer();
    } else {
      resumeTimer();
    }

    // Update toggle checkbox
    if (debugToggleElement) {
      debugToggleElement.checked = isDebugMode;
    }

    // Trigger callback
    onDebugToggle(isDebugMode);

    console.log("[DebugManager] Debug mode:", isDebugMode ? "ON" : "OFF");
    return isDebugMode;
  }

  /**
   * Show password input modal
   */
  function showPasswordModal() {
    if (passwordModalVisible) return;
    passwordModalVisible = true;

    const password = window.APP_CONFIG?.DEBUG_PASSWORD || "DISABLED";

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
      passwordModalVisible = false;
    };

    const checkPassword = () => {
      if (input.value === password) {
        toggle(); // Enable Debug Mode
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
   * Check if debug mode is active
   */
  function isActive() {
    return isDebugMode;
  }

  /**
   * Set debug mode externally
   */
  function setMode(enabled) {
    isDebugMode = enabled;

    if (debugDropdownElement) {
      debugDropdownElement.classList.toggle("hidden", !isDebugMode);
    }

    if (debugToggleElement) {
      debugToggleElement.checked = isDebugMode;
    }
  }

  // Public API
  return {
    init,
    toggle,
    showPasswordModal,
    isActive,
    setMode,
  };
})();

// Export for use in other modules
window.DebugManager = DebugManager;
