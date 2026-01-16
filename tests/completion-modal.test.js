/**
 * CompletionModal Unit Tests
 * Tests for scenario completion popup
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Recreate CompletionModal logic for testing
function createCompletionModal() {
  let modalElement = null;
  let confettiContainer = null;

  function init() {
    if (modalElement) return;

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

    confettiContainer = document.createElement("div");
    confettiContainer.className = "confetti-container";
    confettiContainer.id = "confetti-container";
    document.body.appendChild(confettiContainer);

    modalElement.addEventListener("click", (e) => {
      if (e.target === modalElement) {
        hide();
      }
    });
  }

  function createConfetti() {
    if (!confettiContainer) return;

    confettiContainer.innerHTML = "";

    const colors = [
      "#22c55e",
      "#f59e0b",
      "#3b82f6",
      "#a855f7",
      "#ef4444",
      "#ec4899",
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
  }

  function show(options = {}) {
    init();

    const {
      scenarioId,
      scenarioTitle,
      timeSpent = 0,
      estimatedTime = 0,
      onContinue,
    } = options;

    const titleEl = document.getElementById("completion-scenario-title");
    const timeSpentEl = document.getElementById("completion-time-spent");
    const estimatedTimeEl = document.getElementById(
      "completion-estimated-time",
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

    if (continueBtn) {
      continueBtn.onclick = () => {
        hide();
        if (onContinue) onContinue();
      };
    }

    setTimeout(() => {
      modalElement.classList.add("active");
      createConfetti();
    }, 100);
  }

  function hide() {
    if (modalElement) {
      modalElement.classList.remove("active");
    }
    if (confettiContainer) {
      confettiContainer.innerHTML = "";
    }
  }

  function isVisible() {
    if (!modalElement) return false;
    return modalElement.classList.contains("active");
  }

  function cleanup() {
    if (modalElement && modalElement.parentNode) {
      modalElement.parentNode.removeChild(modalElement);
    }
    if (confettiContainer && confettiContainer.parentNode) {
      confettiContainer.parentNode.removeChild(confettiContainer);
    }
    modalElement = null;
    confettiContainer = null;
  }

  return {
    init,
    show,
    hide,
    isVisible,
    createConfetti,
    cleanup,
    getModalElement: () => modalElement,
    getConfettiContainer: () => confettiContainer,
  };
}

describe("CompletionModal", () => {
  let modal;

  beforeEach(() => {
    modal = createCompletionModal();
    vi.useFakeTimers();
  });

  afterEach(() => {
    modal.cleanup();
    vi.useRealTimers();
  });

  describe("init()", () => {
    it("creates modal overlay element", () => {
      modal.init();

      const overlay = document.getElementById("completion-modal-overlay");
      expect(overlay).not.toBeNull();
    });

    it("creates confetti container", () => {
      modal.init();

      const confetti = document.getElementById("confetti-container");
      expect(confetti).not.toBeNull();
    });

    it("only initializes once", () => {
      modal.init();
      const firstModal = modal.getModalElement();
      modal.init();
      const secondModal = modal.getModalElement();

      expect(firstModal).toBe(secondModal);
    });

    it("creates required child elements", () => {
      modal.init();

      expect(
        document.getElementById("completion-scenario-title"),
      ).not.toBeNull();
      expect(document.getElementById("completion-time-spent")).not.toBeNull();
      expect(
        document.getElementById("completion-estimated-time"),
      ).not.toBeNull();
      expect(document.getElementById("completion-performance")).not.toBeNull();
      expect(document.getElementById("completion-continue-btn")).not.toBeNull();
    });
  });

  describe("show()", () => {
    it("initializes modal if not already initialized", () => {
      modal.show({});

      expect(
        document.getElementById("completion-modal-overlay"),
      ).not.toBeNull();
    });

    it("sets scenario title", () => {
      modal.show({ scenarioTitle: "Test Scenario Complete!" });

      const titleEl = document.getElementById("completion-scenario-title");
      expect(titleEl.textContent).toBe("Test Scenario Complete!");
    });

    it("uses default title when not provided", () => {
      modal.show({});

      const titleEl = document.getElementById("completion-scenario-title");
      expect(titleEl.textContent).toBe(
        "You've successfully resolved this issue.",
      );
    });

    it("displays time spent", () => {
      modal.show({ timeSpent: 1.5 });

      const timeSpentEl = document.getElementById("completion-time-spent");
      expect(timeSpentEl.textContent).toBe("1.5 hrs");
    });

    it("displays estimated time", () => {
      modal.show({ estimatedTime: 2.0 });

      const estTimeEl = document.getElementById("completion-estimated-time");
      expect(estTimeEl.textContent).toBe("2.0 hrs");
    });

    it("shows 'Excellent' rating when under time", () => {
      modal.show({ timeSpent: 0.5, estimatedTime: 1.0 });

      const perfEl = document.getElementById("completion-performance");
      expect(perfEl.textContent).toBe("🌟 Excellent!");
      expect(perfEl.className).toContain("text-green-400");
    });

    it("shows 'Excellent' rating when exactly on time", () => {
      modal.show({ timeSpent: 1.0, estimatedTime: 1.0 });

      const perfEl = document.getElementById("completion-performance");
      expect(perfEl.textContent).toBe("🌟 Excellent!");
    });

    it("shows 'Good' rating when slightly over (up to 50%)", () => {
      modal.show({ timeSpent: 1.4, estimatedTime: 1.0 });

      const perfEl = document.getElementById("completion-performance");
      expect(perfEl.textContent).toBe("👍 Good");
      expect(perfEl.className).toContain("text-yellow-400");
    });

    it("shows 'Completed' rating when significantly over", () => {
      modal.show({ timeSpent: 2.0, estimatedTime: 1.0 });

      const perfEl = document.getElementById("completion-performance");
      expect(perfEl.textContent).toBe("📝 Completed");
      expect(perfEl.className).toContain("text-gray-400");
    });

    it("handles zero estimated time", () => {
      modal.show({ timeSpent: 1.0, estimatedTime: 0 });

      const perfEl = document.getElementById("completion-performance");
      // ratio defaults to 1 when estimatedTime is 0
      expect(perfEl.textContent).toBe("🌟 Excellent!");
    });

    it("adds active class after timeout", () => {
      modal.show({});

      expect(modal.isVisible()).toBe(false);

      vi.advanceTimersByTime(150);

      expect(modal.isVisible()).toBe(true);
    });

    it("calls onContinue callback when button clicked", () => {
      const onContinue = vi.fn();
      modal.show({ onContinue });

      vi.advanceTimersByTime(150);

      const btn = document.getElementById("completion-continue-btn");
      btn.click();

      expect(onContinue).toHaveBeenCalled();
    });

    it("hides modal when continue button clicked", () => {
      modal.show({});
      vi.advanceTimersByTime(150);

      expect(modal.isVisible()).toBe(true);

      const btn = document.getElementById("completion-continue-btn");
      btn.click();

      expect(modal.isVisible()).toBe(false);
    });
  });

  describe("hide()", () => {
    it("removes active class from modal", () => {
      modal.show({});
      vi.advanceTimersByTime(150);

      expect(modal.isVisible()).toBe(true);

      modal.hide();

      expect(modal.isVisible()).toBe(false);
    });

    it("clears confetti container", () => {
      modal.show({});
      vi.advanceTimersByTime(150);

      const confetti = modal.getConfettiContainer();
      expect(confetti.children.length).toBeGreaterThan(0);

      modal.hide();

      expect(confetti.innerHTML).toBe("");
    });

    it("handles hide when not initialized", () => {
      // Should not throw
      expect(() => modal.hide()).not.toThrow();
    });
  });

  describe("isVisible()", () => {
    it("returns false when not initialized", () => {
      expect(modal.isVisible()).toBe(false);
    });

    it("returns false when initialized but not shown", () => {
      modal.init();
      expect(modal.isVisible()).toBe(false);
    });

    it("returns true when shown", () => {
      modal.show({});
      vi.advanceTimersByTime(150);

      expect(modal.isVisible()).toBe(true);
    });

    it("returns false after hide", () => {
      modal.show({});
      vi.advanceTimersByTime(150);
      modal.hide();

      expect(modal.isVisible()).toBe(false);
    });
  });

  describe("createConfetti()", () => {
    it("creates 50 confetti particles", () => {
      modal.init();
      modal.createConfetti();

      const container = modal.getConfettiContainer();
      expect(container.children.length).toBe(50);
    });

    it("confetti have random positions", () => {
      modal.init();
      modal.createConfetti();

      const container = modal.getConfettiContainer();
      const leftValues = Array.from(container.children).map(
        (el) => el.style.left,
      );

      // At least some should be different
      const unique = new Set(leftValues);
      expect(unique.size).toBeGreaterThan(1);
    });

    it("confetti have varied colors", () => {
      modal.init();
      modal.createConfetti();

      const container = modal.getConfettiContainer();
      const colors = Array.from(container.children).map(
        (el) => el.style.backgroundColor,
      );

      const unique = new Set(colors);
      expect(unique.size).toBeGreaterThan(1);
    });

    it("confetti have mixed shapes", () => {
      modal.init();
      modal.createConfetti();

      const container = modal.getConfettiContainer();
      const shapes = Array.from(container.children).map(
        (el) => el.style.borderRadius,
      );

      // Should have both circular (50%) and square (0)
      expect(shapes).toContain("50%");
      expect(shapes).toContain("0");
    });

    it("handles missing confetti container", () => {
      // Don't init, so container is null
      expect(() => modal.createConfetti()).not.toThrow();
    });
  });

  describe("overlay click behavior", () => {
    it("hides when clicking overlay background", () => {
      modal.show({});
      vi.advanceTimersByTime(150);

      const overlay = modal.getModalElement();
      // Simulate click on overlay itself (not child)
      const event = new MouseEvent("click", { bubbles: true });
      Object.defineProperty(event, "target", { value: overlay });
      overlay.dispatchEvent(event);

      expect(modal.isVisible()).toBe(false);
    });
  });
});
