/**
 * ScenarioManager Unit Tests
 * Tests for scenario completion and conclusion rendering
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Helper to create a mock scenario
function createMockScenario(overrides = {}) {
  return {
    meta: {
      title: "Test Scenario",
      category: "lighting",
      estimateHours: 1.5,
      ...overrides.meta,
    },
    steps: {
      "step-1": {
        title: "First Step",
        prompt: "What should you do?",
        choices: [
          { text: "Correct answer", type: "correct", next: "conclusion" },
        ],
      },
      conclusion: {
        title: "Scenario Complete",
        prompt: "Well done!",
      },
      ...overrides.steps,
    },
    ...overrides,
  };
}

// Mock finishScenario logic
function finishScenario(scenarioId, scenarios, options = {}) {
  const scenario = scenarios[scenarioId];
  if (!scenario) {
    console.error(`[ScenarioManager] Scenario not found: ${scenarioId}`);
    return false;
  }

  const { scenarioState = {}, onStateUpdate, onComplete } = options;

  // Mark scenario as completed
  const newState = {
    ...scenarioState,
    [scenarioId]: {
      ...scenarioState[scenarioId],
      completed: true,
      completedAt: new Date().toISOString(),
    },
  };

  if (onStateUpdate) {
    onStateUpdate(newState);
  }

  if (onComplete) {
    onComplete(scenarioId, scenario);
  }

  return true;
}

// Mock renderConclusion logic
function renderConclusion(scenarioId, scenarios, options = {}) {
  const scenario = scenarios[scenarioId];
  if (!scenario) {
    console.error(`[ScenarioManager] Scenario not found: ${scenarioId}`);
    return null;
  }

  const { container, scenarioState = {}, onContinue } = options;

  if (!container) {
    console.error("[ScenarioManager] No container provided");
    return null;
  }

  const meta = scenario.meta;
  const state = scenarioState[scenarioId] || {};
  const loggedTime = state.loggedTime || 0;
  const estimatedTime = meta.estimateHours || 0;

  // Calculate performance
  let performanceRating;
  const ratio = estimatedTime > 0 ? loggedTime / estimatedTime : 1;
  if (ratio <= 1) {
    performanceRating = "excellent";
  } else if (ratio <= 1.5) {
    performanceRating = "good";
  } else {
    performanceRating = "completed";
  }

  // Render HTML
  container.innerHTML = `
    <div class="conclusion-screen" data-scenario-id="${scenarioId}">
      <h1 class="conclusion-title">${meta.title} - Complete</h1>
      <div class="conclusion-stats">
        <div class="stat-row">
          <span>Time Spent:</span>
          <span id="time-spent">${loggedTime.toFixed(1)} hrs</span>
        </div>
        <div class="stat-row">
          <span>Estimated:</span>
          <span id="time-estimated">${estimatedTime.toFixed(1)} hrs</span>
        </div>
        <div class="stat-row">
          <span>Performance:</span>
          <span id="performance-rating">${performanceRating}</span>
        </div>
      </div>
      <button id="continue-btn">Continue</button>
    </div>
  `;

  const continueBtn = container.querySelector("#continue-btn");
  if (continueBtn && onContinue) {
    continueBtn.addEventListener("click", () => onContinue(scenarioId));
  }

  return {
    scenarioId,
    performanceRating,
    loggedTime,
    estimatedTime,
  };
}

// Mock getCompletedScenarios logic
function getCompletedScenarios(scenarioState) {
  return Object.entries(scenarioState)
    .filter(([_, state]) => state.completed)
    .map(([id]) => id);
}

// Mock getProgress logic
function getProgress(scenarios, scenarioState) {
  const total = Object.keys(scenarios).length;
  const completed = getCompletedScenarios(scenarioState).length;
  return {
    total,
    completed,
    remaining: total - completed,
    percentage: total > 0 ? (completed / total) * 100 : 0,
  };
}

describe("ScenarioManager", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    container.id = "game-container";
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe("finishScenario()", () => {
    it("returns false for non-existent scenario", () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation();

      const result = finishScenario("non-existent", {});

      expect(result).toBe(false);
      expect(errorSpy).toHaveBeenCalled();

      errorSpy.mockRestore();
    });

    it("returns true for valid scenario", () => {
      const scenarios = { "test-1": createMockScenario() };

      const result = finishScenario("test-1", scenarios);

      expect(result).toBe(true);
    });

    it("marks scenario as completed in state", () => {
      const scenarios = { "test-1": createMockScenario() };
      const scenarioState = { "test-1": { loggedTime: 1.0 } };
      let updatedState = null;

      finishScenario("test-1", scenarios, {
        scenarioState,
        onStateUpdate: (state) => {
          updatedState = state;
        },
      });

      expect(updatedState["test-1"].completed).toBe(true);
    });

    it("adds completedAt timestamp", () => {
      const scenarios = { "test-1": createMockScenario() };
      let updatedState = null;

      finishScenario("test-1", scenarios, {
        scenarioState: {},
        onStateUpdate: (state) => {
          updatedState = state;
        },
      });

      expect(updatedState["test-1"].completedAt).toBeDefined();
      expect(typeof updatedState["test-1"].completedAt).toBe("string");
    });

    it("calls onComplete callback", () => {
      const scenarios = { "test-1": createMockScenario() };
      const onComplete = vi.fn();

      finishScenario("test-1", scenarios, { onComplete });

      expect(onComplete).toHaveBeenCalledWith("test-1", scenarios["test-1"]);
    });

    it("preserves existing state data", () => {
      const scenarios = { "test-1": createMockScenario() };
      const scenarioState = {
        "test-1": { loggedTime: 2.5, currentStep: "step-3" },
      };
      let updatedState = null;

      finishScenario("test-1", scenarios, {
        scenarioState,
        onStateUpdate: (state) => {
          updatedState = state;
        },
      });

      expect(updatedState["test-1"].loggedTime).toBe(2.5);
      expect(updatedState["test-1"].currentStep).toBe("step-3");
      expect(updatedState["test-1"].completed).toBe(true);
    });
  });

  describe("renderConclusion()", () => {
    it("returns null for non-existent scenario", () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation();

      const result = renderConclusion("non-existent", {}, { container });

      expect(result).toBeNull();
      expect(errorSpy).toHaveBeenCalled();

      errorSpy.mockRestore();
    });

    it("returns null when no container provided", () => {
      const scenarios = { "test-1": createMockScenario() };
      const errorSpy = vi.spyOn(console, "error").mockImplementation();

      const result = renderConclusion("test-1", scenarios, {});

      expect(result).toBeNull();

      errorSpy.mockRestore();
    });

    it("renders conclusion HTML", () => {
      const scenarios = { "test-1": createMockScenario() };

      renderConclusion("test-1", scenarios, { container });

      expect(container.querySelector(".conclusion-screen")).not.toBeNull();
      expect(container.querySelector(".conclusion-title")).not.toBeNull();
    });

    it("displays scenario title", () => {
      const scenarios = {
        "test-1": createMockScenario({
          meta: { title: "Custom Title", estimateHours: 1 },
        }),
      };

      renderConclusion("test-1", scenarios, { container });

      const title = container.querySelector(".conclusion-title");
      expect(title.textContent).toContain("Custom Title");
    });

    it("displays time spent", () => {
      const scenarios = { "test-1": createMockScenario() };
      const scenarioState = { "test-1": { loggedTime: 2.5 } };

      renderConclusion("test-1", scenarios, { container, scenarioState });

      const timeSpent = container.querySelector("#time-spent");
      expect(timeSpent.textContent).toBe("2.5 hrs");
    });

    it("displays estimated time", () => {
      const scenarios = {
        "test-1": createMockScenario({
          meta: { title: "Test", estimateHours: 3.0 },
        }),
      };

      renderConclusion("test-1", scenarios, { container });

      const estTime = container.querySelector("#time-estimated");
      expect(estTime.textContent).toBe("3.0 hrs");
    });

    it("returns excellent rating when under time", () => {
      const scenarios = {
        "test-1": createMockScenario({
          meta: { title: "Test", estimateHours: 2.0 },
        }),
      };
      const scenarioState = { "test-1": { loggedTime: 1.5 } };

      const result = renderConclusion("test-1", scenarios, {
        container,
        scenarioState,
      });

      expect(result.performanceRating).toBe("excellent");
    });

    it("returns good rating when slightly over (up to 50%)", () => {
      const scenarios = {
        "test-1": createMockScenario({
          meta: { title: "Test", estimateHours: 1.0 },
        }),
      };
      const scenarioState = { "test-1": { loggedTime: 1.4 } };

      const result = renderConclusion("test-1", scenarios, {
        container,
        scenarioState,
      });

      expect(result.performanceRating).toBe("good");
    });

    it("returns completed rating when significantly over", () => {
      const scenarios = {
        "test-1": createMockScenario({
          meta: { title: "Test", estimateHours: 1.0 },
        }),
      };
      const scenarioState = { "test-1": { loggedTime: 2.0 } };

      const result = renderConclusion("test-1", scenarios, {
        container,
        scenarioState,
      });

      expect(result.performanceRating).toBe("completed");
    });

    it("sets up continue button callback", () => {
      const scenarios = { "test-1": createMockScenario() };
      const onContinue = vi.fn();

      renderConclusion("test-1", scenarios, { container, onContinue });

      const btn = container.querySelector("#continue-btn");
      btn.click();

      expect(onContinue).toHaveBeenCalledWith("test-1");
    });

    it("returns result object with stats", () => {
      const scenarios = {
        "test-1": createMockScenario({
          meta: { title: "Test", estimateHours: 2.0 },
        }),
      };
      const scenarioState = { "test-1": { loggedTime: 1.5 } };

      const result = renderConclusion("test-1", scenarios, {
        container,
        scenarioState,
      });

      expect(result.scenarioId).toBe("test-1");
      expect(result.loggedTime).toBe(1.5);
      expect(result.estimatedTime).toBe(2.0);
      expect(result.performanceRating).toBe("excellent");
    });
  });

  describe("getCompletedScenarios()", () => {
    it("returns empty array when no scenarios completed", () => {
      const state = {
        s1: { loggedTime: 1.0 },
        s2: { loggedTime: 0.5 },
      };

      const result = getCompletedScenarios(state);

      expect(result).toEqual([]);
    });

    it("returns completed scenario IDs", () => {
      const state = {
        s1: { completed: true },
        s2: { completed: false },
        s3: { completed: true },
      };

      const result = getCompletedScenarios(state);

      expect(result).toContain("s1");
      expect(result).toContain("s3");
      expect(result).not.toContain("s2");
    });

    it("handles empty state", () => {
      expect(getCompletedScenarios({})).toEqual([]);
    });
  });

  describe("getProgress()", () => {
    it("calculates total scenarios", () => {
      const scenarios = {
        s1: createMockScenario(),
        s2: createMockScenario(),
        s3: createMockScenario(),
      };

      const result = getProgress(scenarios, {});

      expect(result.total).toBe(3);
    });

    it("calculates completed count", () => {
      const scenarios = {
        s1: createMockScenario(),
        s2: createMockScenario(),
      };
      const state = {
        s1: { completed: true },
        s2: { completed: false },
      };

      const result = getProgress(scenarios, state);

      expect(result.completed).toBe(1);
    });

    it("calculates remaining count", () => {
      const scenarios = {
        s1: createMockScenario(),
        s2: createMockScenario(),
        s3: createMockScenario(),
      };
      const state = {
        s1: { completed: true },
      };

      const result = getProgress(scenarios, state);

      expect(result.remaining).toBe(2);
    });

    it("calculates percentage", () => {
      const scenarios = {
        s1: createMockScenario(),
        s2: createMockScenario(),
        s3: createMockScenario(),
        s4: createMockScenario(),
      };
      const state = {
        s1: { completed: true },
        s2: { completed: true },
      };

      const result = getProgress(scenarios, state);

      expect(result.percentage).toBe(50);
    });

    it("handles empty scenarios", () => {
      const result = getProgress({}, {});

      expect(result.total).toBe(0);
      expect(result.completed).toBe(0);
      expect(result.percentage).toBe(0);
    });

    it("handles 100% completion", () => {
      const scenarios = { s1: createMockScenario() };
      const state = { s1: { completed: true } };

      const result = getProgress(scenarios, state);

      expect(result.percentage).toBe(100);
    });
  });
});
