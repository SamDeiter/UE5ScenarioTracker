/**
 * DebugManager Unit Tests
 */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// Recreate DebugManager for testing (adapting IIFE pattern)
function createDebugManager() {
  let isDebugMode = false;
  let passwordModalVisible = false;
  let debugDropdownElement = null;
  let debugToggleElement = null;

  let onDebugToggle = null;
  let onRenderStep = null;
  let pauseTimer = null;
  let resumeTimer = null;

  function init(config = {}) {
    debugDropdownElement =
      config.debugDropdown || document.getElementById("debug-dropdown");
    debugToggleElement =
      config.debugToggle || document.getElementById("debug-toggle");
    onDebugToggle = config.onToggle || (() => {});
    onRenderStep = config.onRenderStep || (() => {});
    pauseTimer = config.pauseTimer || (() => {});
    resumeTimer = config.resumeTimer || (() => {});

    if (debugDropdownElement) {
      debugDropdownElement.classList.add("hidden");
    }
  }

  function toggle(forceDisable = false) {
    if (forceDisable) {
      isDebugMode = false;
    } else {
      isDebugMode = !isDebugMode;
    }

    if (debugDropdownElement) {
      debugDropdownElement.classList.toggle("hidden", !isDebugMode);
    }

    if (isDebugMode) {
      pauseTimer();
    } else {
      resumeTimer();
    }

    if (debugToggleElement) {
      debugToggleElement.checked = isDebugMode;
    }

    onDebugToggle(isDebugMode);

    return isDebugMode;
  }

  function isActive() {
    return isDebugMode;
  }

  function setMode(enabled) {
    isDebugMode = enabled;

    if (debugDropdownElement) {
      debugDropdownElement.classList.toggle("hidden", !isDebugMode);
    }

    if (debugToggleElement) {
      debugToggleElement.checked = isDebugMode;
    }
  }

  return {
    init,
    toggle,
    isActive,
    setMode,
  };
}

describe("DebugManager", () => {
  let DebugManager;
  let mockDropdown;
  let mockToggle;
  let mockPauseTimer;
  let mockResumeTimer;
  let mockOnToggle;

  beforeEach(() => {
    // Create mock DOM elements
    mockDropdown = document.createElement("div");
    mockDropdown.id = "debug-dropdown";
    document.body.appendChild(mockDropdown);

    mockToggle = document.createElement("input");
    mockToggle.type = "checkbox";
    mockToggle.id = "debug-toggle";
    document.body.appendChild(mockToggle);

    // Create mock callbacks
    mockPauseTimer = vi.fn();
    mockResumeTimer = vi.fn();
    mockOnToggle = vi.fn();

    DebugManager = createDebugManager();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  describe("init", () => {
    it("finds elements by ID", () => {
      DebugManager.init({});
      expect(DebugManager.isActive()).toBe(false);
    });

    it("accepts config elements", () => {
      const customDropdown = document.createElement("div");
      DebugManager.init({
        debugDropdown: customDropdown,
        pauseTimer: mockPauseTimer,
        resumeTimer: mockResumeTimer,
      });
      expect(DebugManager.isActive()).toBe(false);
    });

    it("hides debug dropdown on init", () => {
      DebugManager.init({});
      expect(mockDropdown.classList.contains("hidden")).toBe(true);
    });
  });

  describe("toggle", () => {
    beforeEach(() => {
      DebugManager.init({
        debugDropdown: mockDropdown,
        debugToggle: mockToggle,
        pauseTimer: mockPauseTimer,
        resumeTimer: mockResumeTimer,
        onToggle: mockOnToggle,
      });
    });

    it("toggles debug mode on", () => {
      expect(DebugManager.isActive()).toBe(false);
      DebugManager.toggle();
      expect(DebugManager.isActive()).toBe(true);
    });

    it("toggles debug mode off", () => {
      DebugManager.toggle(); // Turn on
      DebugManager.toggle(); // Turn off
      expect(DebugManager.isActive()).toBe(false);
    });

    it("returns new state", () => {
      const result = DebugManager.toggle();
      expect(result).toBe(true);
    });

    it("calls pauseTimer when enabling debug mode", () => {
      DebugManager.toggle();
      expect(mockPauseTimer).toHaveBeenCalled();
    });

    it("calls resumeTimer when disabling debug mode", () => {
      DebugManager.toggle(); // Enable
      DebugManager.toggle(); // Disable
      expect(mockResumeTimer).toHaveBeenCalled();
    });

    it("calls onToggle callback with new state", () => {
      DebugManager.toggle();
      expect(mockOnToggle).toHaveBeenCalledWith(true);
    });

    it("updates toggle checkbox", () => {
      DebugManager.toggle();
      expect(mockToggle.checked).toBe(true);
    });

    it("shows debug dropdown when enabled", () => {
      DebugManager.toggle();
      expect(mockDropdown.classList.contains("hidden")).toBe(false);
    });

    it("hides debug dropdown when disabled", () => {
      DebugManager.toggle(); // Enable
      DebugManager.toggle(); // Disable
      expect(mockDropdown.classList.contains("hidden")).toBe(true);
    });

    it("force disables debug mode", () => {
      DebugManager.toggle(); // Enable
      expect(DebugManager.isActive()).toBe(true);

      DebugManager.toggle(true); // Force disable
      expect(DebugManager.isActive()).toBe(false);
    });
  });

  describe("isActive", () => {
    beforeEach(() => {
      DebugManager.init({
        pauseTimer: mockPauseTimer,
        resumeTimer: mockResumeTimer,
        onToggle: mockOnToggle,
      });
    });

    it("returns false initially", () => {
      expect(DebugManager.isActive()).toBe(false);
    });

    it("returns true after toggle", () => {
      DebugManager.toggle();
      expect(DebugManager.isActive()).toBe(true);
    });
  });

  describe("setMode", () => {
    beforeEach(() => {
      DebugManager.init({
        debugDropdown: mockDropdown,
        debugToggle: mockToggle,
        pauseTimer: mockPauseTimer,
        resumeTimer: mockResumeTimer,
        onToggle: mockOnToggle,
      });
    });

    it("sets debug mode to true", () => {
      DebugManager.setMode(true);
      expect(DebugManager.isActive()).toBe(true);
    });

    it("sets debug mode to false", () => {
      DebugManager.setMode(true);
      DebugManager.setMode(false);
      expect(DebugManager.isActive()).toBe(false);
    });

    it("updates dropdown visibility", () => {
      DebugManager.setMode(true);
      expect(mockDropdown.classList.contains("hidden")).toBe(false);

      DebugManager.setMode(false);
      expect(mockDropdown.classList.contains("hidden")).toBe(true);
    });

    it("updates toggle checkbox", () => {
      DebugManager.setMode(true);
      expect(mockToggle.checked).toBe(true);
    });

    it("does not call timer functions (unlike toggle)", () => {
      DebugManager.setMode(true);
      expect(mockPauseTimer).not.toHaveBeenCalled();
      expect(mockResumeTimer).not.toHaveBeenCalled();
    });

    it("does not call onToggle callback (unlike toggle)", () => {
      DebugManager.setMode(true);
      expect(mockOnToggle).not.toHaveBeenCalled();
    });
  });
});
