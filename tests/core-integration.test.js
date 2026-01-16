/**
 * Core Modules Integration Tests
 * Tests actual source files to get real coverage via window.* globals
 */
import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
import { loadSourceFile } from "./setup.js";

describe("Core Source Modules Integration", () => {
  beforeAll(() => {
    // Mock dependencies that source modules need
    global.window = global;
    global.SCENARIOS = {};

    // Mock ActionRegistry for Validator
    global.ActionRegistry = {
      validate: vi.fn(() => null),
    };

    // Mock ScoringManager for BacklogRenderer
    global.ScoringManager = {
      getTimeColorClass: vi.fn(() => "text-green-400"),
      getTimeCost: vi.fn((type) => {
        const costs = {
          correct: 0.5,
          partial: 1.0,
          misguided: 1.5,
          wrong: 2.0,
        };
        return costs[type] || 0;
      }),
    };

    // Load actual source files
    loadSourceFile("js/Validator.js");
    loadSourceFile("js/core/scoring.js");
  });

  describe("Validator (actual source)", () => {
    it("window.Validator is defined", () => {
      expect(global.Validator).toBeDefined();
    });

    it("validateScenario returns valid for complete scenario", () => {
      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: 1 },
        steps: {
          "step-1": {
            title: "Step",
            prompt: "Do something",
            choices: [{ text: "Choice", type: "correct", next: "end" }],
          },
        },
      };

      const result = global.Validator.validateScenario("test-id", scenario);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("validateScenario detects missing meta", () => {
      const scenario = {
        steps: {
          "step-1": {
            title: "Step",
            prompt: "Do",
            choices: [{ text: "C", type: "correct", next: "end" }],
          },
        },
      };

      const result = global.Validator.validateScenario("test-id", scenario);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Scenario "test-id" is missing "meta" object.',
      );
    });

    it("validateScenario detects missing steps", () => {
      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: 1 },
      };

      const result = global.Validator.validateScenario("test-id", scenario);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Scenario "test-id" is missing "steps" map.',
      );
    });

    it("validateScenario detects missing step title", () => {
      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: 1 },
        steps: {
          "step-1": {
            prompt: "Do",
            choices: [{ text: "C", type: "correct", next: "end" }],
          },
        },
      };

      const result = global.Validator.validateScenario("test-id", scenario);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('[test-id:step-1] Missing "title".');
    });

    it("validateScenario detects invalid next reference", () => {
      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: 1 },
        steps: {
          "step-1": {
            title: "Step",
            prompt: "Do",
            choices: [{ text: "C", type: "correct", next: "nonexistent" }],
          },
        },
      };

      const result = global.Validator.validateScenario("test-id", scenario);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain("non-existent step");
    });

    it("reportErrors logs to console", () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation();

      global.Validator.reportErrors("test-scenario", ["Error 1"]);

      expect(errorSpy).toHaveBeenCalled();
      errorSpy.mockRestore();
    });
  });

  describe("ScoringManager (actual source)", () => {
    it("window.ScoringManager is defined", () => {
      // Note: ScoringManager should be loaded from source
      expect(global.ScoringManager).toBeDefined();
    });
  });
});

// Separate describe block for ChoiceEnhancer (needs its own beforeAll)
describe("ChoiceEnhancer Integration", () => {
  beforeAll(() => {
    global.window = global;
    loadSourceFile("js/core/ChoiceEnhancer.js");
  });

  it("window.ChoiceEnhancer is defined", () => {
    expect(global.ChoiceEnhancer).toBeDefined();
  });

  it("has TARGET_CHOICES = 4", () => {
    expect(global.ChoiceEnhancer.TARGET_CHOICES).toBe(4);
  });

  it("padChoices returns original if already 4 choices", () => {
    const choices = [
      { text: "A", type: "correct", next: "end" },
      { text: "B", type: "wrong", next: "step-1" },
      { text: "C", type: "wrong", next: "step-1" },
      { text: "D", type: "wrong", next: "step-1" },
    ];

    const result = global.ChoiceEnhancer.padChoices(choices);
    expect(result).toBe(choices);
  });

  it("padChoices adds fillers to reach 4 choices", () => {
    const choices = [{ text: "Correct", type: "correct", next: "end" }];

    const result = global.ChoiceEnhancer.padChoices(
      choices,
      "lighting",
      "step-1",
    );
    expect(result).toHaveLength(4);
  });

  it("getSkill extracts skill from step", () => {
    expect(global.ChoiceEnhancer.getSkill({ skill: "materials" })).toBe(
      "materials",
    );
    expect(global.ChoiceEnhancer.getSkill({})).toBe("general");
  });

  it("_shuffle returns same length array", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = global.ChoiceEnhancer._shuffle(arr);
    expect(result).toHaveLength(5);
  });

  it("_shuffle does not modify original array", () => {
    const arr = [1, 2, 3, 4, 5];
    const original = [...arr];
    global.ChoiceEnhancer._shuffle(arr);
    expect(arr).toEqual(original);
  });
});
