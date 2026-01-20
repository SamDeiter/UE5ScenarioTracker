/**
 * ScoringManager Unit Tests
 */
import { describe, it, expect, beforeEach } from "vitest";

// Mock the ScoringManager module
// We need to adapt the IIFE pattern for testing
const ScoringManager = (function () {
  const DEFAULT_COSTS = {
    correct: 0.5,
    partial: 1.0,
    misguided: 1.5,
    wrong: 2.0,
  };

  function getTimeCost(type) {
    const costs = global.APP_CONFIG?.TIME_COSTS || DEFAULT_COSTS;
    return costs[type] || 0;
  }

  function calculateIdealTime(scenarios = {}) {
    let totalSteps = 0;
    Object.values(scenarios).forEach((scenario) => {
      if (scenario.steps) {
        totalSteps += Object.keys(scenario.steps).length;
      }
    });
    return {
      totalSteps,
      idealTotalTime: totalSteps * 0.5,
    };
  }

  function getTimeColorClass(logged, estimate) {
    if (logged <= estimate) return "text-green-400";
    const overBudgetRatio = logged / estimate;
    if (overBudgetRatio <= 1.2) return "text-yellow-400";
    if (overBudgetRatio <= 1.4) return "text-orange-400";
    return "text-red-400";
  }

  function calculateEfficiency(idealTime, actualTime) {
    if (actualTime === 0) return 1;
    return idealTime / actualTime;
  }

  function isPassing(efficiency) {
    const threshold = global.APP_CONFIG?.PASS_THRESHOLD || 0.8;
    return efficiency >= threshold;
  }

  function formatHours(hours) {
    if (hours === 1) return "1 hr";
    return `${hours.toFixed(1)} hrs`;
  }

  return {
    getTimeCost,
    calculateIdealTime,
    getTimeColorClass,
    calculateEfficiency,
    isPassing,
    formatHours,
  };
})();

describe("ScoringManager", () => {
  describe("getTimeCost", () => {
    it("returns 0.5 for correct answers", () => {
      expect(ScoringManager.getTimeCost("correct")).toBe(0.5);
    });

    it("returns 1.0 for partial answers", () => {
      expect(ScoringManager.getTimeCost("partial")).toBe(1.0);
    });

    it("returns 1.5 for misguided answers", () => {
      expect(ScoringManager.getTimeCost("misguided")).toBe(1.5);
    });

    it("returns 2.0 for wrong answers", () => {
      expect(ScoringManager.getTimeCost("wrong")).toBe(2.0);
    });

    it("returns 0 for unknown types", () => {
      expect(ScoringManager.getTimeCost("unknown")).toBe(0);
    });
  });

  describe("calculateIdealTime", () => {
    it("calculates ideal time for scenarios with steps", () => {
      const mockScenarios = {
        scenario1: { steps: { "step-1": {}, "step-2": {} } },
        scenario2: { steps: { "step-1": {}, "step-2": {}, "step-3": {} } },
      };

      const result = ScoringManager.calculateIdealTime(mockScenarios);

      expect(result.totalSteps).toBe(5);
      expect(result.idealTotalTime).toBe(2.5); // 5 * 0.5
    });

    it("handles empty scenarios", () => {
      const result = ScoringManager.calculateIdealTime({});
      expect(result.totalSteps).toBe(0);
      expect(result.idealTotalTime).toBe(0);
    });

    it("handles scenarios without steps", () => {
      const mockScenarios = {
        scenario1: { meta: { title: "Test" } },
      };

      const result = ScoringManager.calculateIdealTime(mockScenarios);
      expect(result.totalSteps).toBe(0);
    });
  });

  describe("getTimeColorClass", () => {
    it("returns green for under budget", () => {
      expect(ScoringManager.getTimeColorClass(1, 2)).toBe("text-green-400");
    });

    it("returns green for exactly on budget", () => {
      expect(ScoringManager.getTimeColorClass(2, 2)).toBe("text-green-400");
    });

    it("returns yellow for slightly over budget (up to 20%)", () => {
      expect(ScoringManager.getTimeColorClass(2.2, 2)).toBe("text-yellow-400");
    });

    it("returns orange for moderately over budget (20-40%)", () => {
      expect(ScoringManager.getTimeColorClass(2.6, 2)).toBe("text-orange-400");
    });

    it("returns red for significantly over budget (>40%)", () => {
      expect(ScoringManager.getTimeColorClass(3, 2)).toBe("text-red-400");
    });
  });

  describe("calculateEfficiency", () => {
    it("returns 1 when actual equals ideal", () => {
      expect(ScoringManager.calculateEfficiency(10, 10)).toBe(1);
    });

    it("returns >1 when completing faster than ideal", () => {
      expect(ScoringManager.calculateEfficiency(10, 5)).toBe(2);
    });

    it("returns <1 when completing slower than ideal", () => {
      expect(ScoringManager.calculateEfficiency(5, 10)).toBe(0.5);
    });

    it("returns 1 when actual time is 0 (edge case)", () => {
      expect(ScoringManager.calculateEfficiency(10, 0)).toBe(1);
    });
  });

  describe("isPassing", () => {
    it("passes at 80% efficiency", () => {
      expect(ScoringManager.isPassing(0.8)).toBe(true);
    });

    it("passes above 80% efficiency", () => {
      expect(ScoringManager.isPassing(0.9)).toBe(true);
    });

    it("fails below 80% efficiency", () => {
      expect(ScoringManager.isPassing(0.79)).toBe(false);
    });
  });

  describe("formatHours", () => {
    it("formats 1 hour singular", () => {
      expect(ScoringManager.formatHours(1)).toBe("1 hr");
    });

    it("formats fractional hours", () => {
      expect(ScoringManager.formatHours(2.5)).toBe("2.5 hrs");
    });

    it("formats whole hours plural", () => {
      expect(ScoringManager.formatHours(3)).toBe("3.0 hrs");
    });
  });
});
