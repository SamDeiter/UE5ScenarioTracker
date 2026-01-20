/**
 * StateManager Unit Tests
 */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// Recreate StateManager for testing (adapting IIFE pattern)
function createStateManager() {
  let scenarioState = {};
  let interruptedSteps = {};
  let currentScenarioId = null;
  let currentStepId = null;

  const STORAGE_KEYS = {
    STATE: "ue5ScenarioState",
    TIMER: "ue5ScenarioTimer",
    ACTIVE_SCENARIO: "ue5ActiveScenario",
    ACTIVE_STEP: "ue5ActiveStep",
    INTERRUPTED: "ue5InterruptedSteps",
  };

  function safeJSONParse(json, fallback = {}) {
    if (!json) return fallback;
    try {
      return JSON.parse(json);
    } catch (e) {
      return fallback;
    }
  }

  function getTimeCost(type) {
    const costs = window.APP_CONFIG?.TIME_COSTS || {
      correct: 0.5,
      partial: 1.0,
      misguided: 1.5,
      wrong: 2.0,
    };
    return costs[type] || 0;
  }

  function loadState() {
    const savedJSON = localStorage.getItem(STORAGE_KEYS.STATE);
    const savedState = safeJSONParse(savedJSON, {});
    const newState = {};
    const scenarios = window.SCENARIOS || {};

    Object.keys(scenarios).forEach((scenarioId) => {
      const defaultState = {
        completed: false,
        loggedTime: 0,
        choicesMade: {},
      };

      newState[scenarioId] = {
        ...defaultState,
        ...(savedState[scenarioId] || {}),
      };
    });

    scenarioState = newState;
    saveState();
    return scenarioState;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEYS.STATE, JSON.stringify(scenarioState));
    } catch (e) {
      console.error("[StateManager] Failed to save state:", e);
    }
  }

  function resetAll() {
    scenarioState = {};
    const scenarios = window.SCENARIOS || {};

    Object.keys(scenarios).forEach((scenarioId) => {
      scenarioState[scenarioId] = {
        completed: false,
        loggedTime: 0,
        choicesMade: {},
      };
    });

    interruptedSteps = {};
    currentScenarioId = null;
    currentStepId = null;

    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });

    saveState();
  }

  function setCurrentScenario(scenarioId, stepId) {
    currentScenarioId = scenarioId;
    currentStepId = stepId;

    if (scenarioId && stepId) {
      interruptedSteps[scenarioId] = stepId;
    }

    saveActiveTicket();
  }

  function saveActiveTicket() {
    if (currentScenarioId && currentStepId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SCENARIO, currentScenarioId);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_STEP, currentStepId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SCENARIO);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_STEP);
    }

    try {
      localStorage.setItem(
        STORAGE_KEYS.INTERRUPTED,
        JSON.stringify(interruptedSteps)
      );
    } catch (e) {}
  }

  function getActiveScenario() {
    return {
      scenarioId: localStorage.getItem(STORAGE_KEYS.ACTIVE_SCENARIO),
      stepId: localStorage.getItem(STORAGE_KEYS.ACTIVE_STEP),
    };
  }

  function getScenarioState(scenarioId) {
    return scenarioState[scenarioId] || null;
  }

  function updateScenarioState(scenarioId, updates) {
    if (scenarioState[scenarioId]) {
      scenarioState[scenarioId] = {
        ...scenarioState[scenarioId],
        ...updates,
      };
      saveState();
    }
  }

  function recordChoice(scenarioId, stepId, choiceIndex, timeCost) {
    if (scenarioState[scenarioId]) {
      scenarioState[scenarioId].choicesMade[stepId] = choiceIndex;
      scenarioState[scenarioId].loggedTime += timeCost;
      saveState();
    }
  }

  function completeScenario(scenarioId) {
    if (scenarioState[scenarioId]) {
      scenarioState[scenarioId].completed = true;
      delete interruptedSteps[scenarioId];
      saveState();
      saveActiveTicket();
    }
  }

  function areAllComplete() {
    return Object.values(scenarioState).every((s) => s.completed);
  }

  function getTotalLoggedTime() {
    return Object.values(scenarioState).reduce(
      (acc, s) => acc + (s.loggedTime || 0),
      0
    );
  }

  function getAllState() {
    return { ...scenarioState };
  }

  function getCurrentScenario() {
    return {
      scenarioId: currentScenarioId,
      stepId: currentStepId,
    };
  }

  function clearCurrentScenario() {
    currentScenarioId = null;
    currentStepId = null;
    saveActiveTicket();
  }

  function getInterruptedStep(scenarioId) {
    return interruptedSteps[scenarioId] || null;
  }

  return {
    loadState,
    saveState,
    resetAll,
    saveActiveTicket,
    getActiveScenario,
    setCurrentScenario,
    getCurrentScenario,
    clearCurrentScenario,
    getScenarioState,
    updateScenarioState,
    recordChoice,
    completeScenario,
    areAllComplete,
    getTotalLoggedTime,
    getAllState,
    getInterruptedStep,
    getTimeCost,
    STORAGE_KEYS,
  };
}

describe("StateManager", () => {
  let StateManager;

  beforeEach(() => {
    localStorage.clear();

    // Mock SCENARIOS
    window.SCENARIOS = {
      scenario1: {
        meta: { title: "Test Scenario 1" },
        steps: {
          "step-1": {
            choices: [{ type: "correct" }, { type: "wrong" }],
          },
        },
      },
      scenario2: {
        meta: { title: "Test Scenario 2" },
        steps: {},
      },
    };

    // Mock APP_CONFIG
    window.APP_CONFIG = {
      TIME_COSTS: {
        correct: 0.5,
        partial: 1.0,
        misguided: 1.5,
        wrong: 2.0,
      },
    };

    StateManager = createStateManager();
  });

  afterEach(() => {
    delete window.SCENARIOS;
    delete window.APP_CONFIG;
  });

  describe("getTimeCost", () => {
    it("returns correct time cost for correct choice", () => {
      expect(StateManager.getTimeCost("correct")).toBe(0.5);
    });

    it("returns correct time cost for wrong choice", () => {
      expect(StateManager.getTimeCost("wrong")).toBe(2.0);
    });

    it("returns correct time cost for partial choice", () => {
      expect(StateManager.getTimeCost("partial")).toBe(1.0);
    });

    it("returns correct time cost for misguided choice", () => {
      expect(StateManager.getTimeCost("misguided")).toBe(1.5);
    });

    it("returns 0 for unknown choice type", () => {
      expect(StateManager.getTimeCost("unknown")).toBe(0);
    });
  });

  describe("loadState", () => {
    it("initializes state for all scenarios", () => {
      const state = StateManager.loadState();
      expect(Object.keys(state)).toHaveLength(2);
      expect(state.scenario1).toBeDefined();
      expect(state.scenario2).toBeDefined();
    });

    it("initializes scenarios with default values", () => {
      const state = StateManager.loadState();
      expect(state.scenario1.completed).toBe(false);
      expect(state.scenario1.loggedTime).toBe(0);
      expect(state.scenario1.choicesMade).toEqual({});
    });

    it("restores saved state from localStorage", () => {
      const savedState = {
        scenario1: {
          completed: true,
          loggedTime: 2.5,
          choicesMade: { "step-1": 0 },
        },
      };
      localStorage.setItem("ue5ScenarioState", JSON.stringify(savedState));

      const state = StateManager.loadState();
      expect(state.scenario1.completed).toBe(true);
    });

    it("saves state to localStorage after loading", () => {
      StateManager.loadState();
      const saved = localStorage.getItem("ue5ScenarioState");
      expect(saved).toBeDefined();
      const parsed = JSON.parse(saved);
      expect(parsed.scenario1).toBeDefined();
    });
  });

  describe("resetAll", () => {
    it("resets all scenario states", () => {
      StateManager.loadState();
      StateManager.recordChoice("scenario1", "step-1", 0, 0.5);
      StateManager.completeScenario("scenario1");

      StateManager.resetAll();

      const state = StateManager.getAllState();
      expect(state.scenario1.completed).toBe(false);
      expect(state.scenario1.loggedTime).toBe(0);
      expect(state.scenario1.choicesMade).toEqual({});
    });

    it("clears localStorage", () => {
      StateManager.loadState();
      StateManager.setCurrentScenario("scenario1", "step-1");

      StateManager.resetAll();

      expect(localStorage.getItem("ue5ActiveScenario")).toBeNull();
      expect(localStorage.getItem("ue5ActiveStep")).toBeNull();
    });

    it("clears current scenario", () => {
      StateManager.loadState();
      StateManager.setCurrentScenario("scenario1", "step-1");

      StateManager.resetAll();

      const current = StateManager.getCurrentScenario();
      expect(current.scenarioId).toBeNull();
      expect(current.stepId).toBeNull();
    });
  });

  describe("setCurrentScenario and getCurrentScenario", () => {
    it("sets and gets current scenario", () => {
      StateManager.setCurrentScenario("scenario1", "step-1");

      const current = StateManager.getCurrentScenario();
      expect(current.scenarioId).toBe("scenario1");
      expect(current.stepId).toBe("step-1");
    });

    it("persists to localStorage", () => {
      StateManager.setCurrentScenario("scenario1", "step-1");

      expect(localStorage.getItem("ue5ActiveScenario")).toBe("scenario1");
      expect(localStorage.getItem("ue5ActiveStep")).toBe("step-1");
    });

    it("tracks interrupted steps", () => {
      StateManager.setCurrentScenario("scenario1", "step-1");
      StateManager.setCurrentScenario("scenario1", "step-2");

      const interrupted = StateManager.getInterruptedStep("scenario1");
      expect(interrupted).toBe("step-2");
    });
  });

  describe("clearCurrentScenario", () => {
    it("clears current scenario", () => {
      StateManager.setCurrentScenario("scenario1", "step-1");
      StateManager.clearCurrentScenario();

      const current = StateManager.getCurrentScenario();
      expect(current.scenarioId).toBeNull();
      expect(current.stepId).toBeNull();
    });

    it("removes from localStorage", () => {
      StateManager.setCurrentScenario("scenario1", "step-1");
      StateManager.clearCurrentScenario();

      expect(localStorage.getItem("ue5ActiveScenario")).toBeNull();
      expect(localStorage.getItem("ue5ActiveStep")).toBeNull();
    });
  });

  describe("getScenarioState", () => {
    it("returns state for existing scenario", () => {
      StateManager.loadState();
      const state = StateManager.getScenarioState("scenario1");
      expect(state).toBeDefined();
      expect(state.completed).toBe(false);
    });

    it("returns null for non-existent scenario", () => {
      StateManager.loadState();
      const state = StateManager.getScenarioState("nonexistent");
      expect(state).toBeNull();
    });
  });

  describe("updateScenarioState", () => {
    it("updates scenario state", () => {
      StateManager.loadState();
      StateManager.updateScenarioState("scenario1", { completed: true });

      const state = StateManager.getScenarioState("scenario1");
      expect(state.completed).toBe(true);
    });

    it("merges updates with existing state", () => {
      StateManager.loadState();
      StateManager.updateScenarioState("scenario1", { loggedTime: 5 });
      StateManager.updateScenarioState("scenario1", { completed: true });

      const state = StateManager.getScenarioState("scenario1");
      expect(state.loggedTime).toBe(5);
      expect(state.completed).toBe(true);
    });

    it("does nothing for non-existent scenario", () => {
      StateManager.loadState();
      StateManager.updateScenarioState("nonexistent", { completed: true });
      // Should not throw
    });
  });

  describe("recordChoice", () => {
    it("records choice index for step", () => {
      StateManager.loadState();
      StateManager.recordChoice("scenario1", "step-1", 0, 0.5);

      const state = StateManager.getScenarioState("scenario1");
      expect(state.choicesMade["step-1"]).toBe(0);
    });

    it("adds time cost to logged time", () => {
      StateManager.loadState();
      StateManager.recordChoice("scenario1", "step-1", 0, 0.5);
      StateManager.recordChoice("scenario1", "step-2", 1, 2.0);

      const state = StateManager.getScenarioState("scenario1");
      expect(state.loggedTime).toBe(2.5);
    });

    it("persists to localStorage", () => {
      StateManager.loadState();
      StateManager.recordChoice("scenario1", "step-1", 0, 0.5);

      const saved = JSON.parse(localStorage.getItem("ue5ScenarioState"));
      expect(saved.scenario1.choicesMade["step-1"]).toBe(0);
    });
  });

  describe("completeScenario", () => {
    it("marks scenario as complete", () => {
      StateManager.loadState();
      StateManager.completeScenario("scenario1");

      const state = StateManager.getScenarioState("scenario1");
      expect(state.completed).toBe(true);
    });

    it("removes scenario from interrupted steps", () => {
      StateManager.loadState();
      StateManager.setCurrentScenario("scenario1", "step-5");
      StateManager.completeScenario("scenario1");

      const interrupted = StateManager.getInterruptedStep("scenario1");
      expect(interrupted).toBeNull();
    });
  });

  describe("areAllComplete", () => {
    it("returns false when not all scenarios are complete", () => {
      StateManager.loadState();
      StateManager.completeScenario("scenario1");

      expect(StateManager.areAllComplete()).toBe(false);
    });

    it("returns true when all scenarios are complete", () => {
      StateManager.loadState();
      StateManager.completeScenario("scenario1");
      StateManager.completeScenario("scenario2");

      expect(StateManager.areAllComplete()).toBe(true);
    });
  });

  describe("getTotalLoggedTime", () => {
    it("returns 0 for fresh state", () => {
      StateManager.loadState();
      expect(StateManager.getTotalLoggedTime()).toBe(0);
    });

    it("sums logged time across all scenarios", () => {
      StateManager.loadState();
      StateManager.recordChoice("scenario1", "step-1", 0, 0.5);
      StateManager.recordChoice("scenario2", "step-1", 0, 1.5);

      expect(StateManager.getTotalLoggedTime()).toBe(2.0);
    });
  });

  describe("getAllState", () => {
    it("returns copy of all state", () => {
      StateManager.loadState();
      const state = StateManager.getAllState();

      expect(state.scenario1).toBeDefined();
      expect(state.scenario2).toBeDefined();
    });

    it("returns a shallow copy of top-level keys", () => {
      StateManager.loadState();
      const state = StateManager.getAllState();

      // Adding a new key to the copy should not affect original
      state.newScenario = { completed: true };

      const fresh = StateManager.getAllState();
      expect(fresh.newScenario).toBeUndefined();
    });
  });

  describe("getActiveScenario", () => {
    it("returns saved active scenario from localStorage", () => {
      localStorage.setItem("ue5ActiveScenario", "scenario1");
      localStorage.setItem("ue5ActiveStep", "step-3");

      const active = StateManager.getActiveScenario();
      expect(active.scenarioId).toBe("scenario1");
      expect(active.stepId).toBe("step-3");
    });

    it("returns null values when nothing saved", () => {
      const active = StateManager.getActiveScenario();
      expect(active.scenarioId).toBeNull();
      expect(active.stepId).toBeNull();
    });
  });
});
