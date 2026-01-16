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

// Note: localization.js uses const/let at module scope - cannot test via loadSourceFile
// Coverage for localization is handled by the unit tests in localization.test.js

// ActionRegistry Integration Tests
describe("ActionRegistry Integration", () => {
  beforeAll(() => {
    global.window = global;
    loadSourceFile("js/ActionRegistry.js");
  });

  it("window.ActionRegistry is defined", () => {
    expect(global.ActionRegistry).toBeDefined();
  });

  it("has register() method", () => {
    expect(typeof global.ActionRegistry.register).toBe("function");
  });

  it("has validate() method", () => {
    expect(typeof global.ActionRegistry.validate).toBe("function");
  });

  it("has execute() method", () => {
    expect(typeof global.ActionRegistry.execute).toBe("function");
  });

  it("can register and execute a custom action", async () => {
    const mockHandler = {
      execute: vi.fn().mockResolvedValue("test_result"),
    };

    global.ActionRegistry.register("test_action", mockHandler);

    const result = await global.ActionRegistry.execute({
      action: "test_action",
    });
    expect(mockHandler.execute).toHaveBeenCalled();
    expect(result).toBe("test_result");
  });

  it("validate returns error for missing action key", () => {
    const result = global.ActionRegistry.validate({});
    expect(result).toBeTruthy(); // Should return error string
  });

  it("validate returns null for registered action", () => {
    global.ActionRegistry.register("valid_action", { execute: async () => {} });
    const result = global.ActionRegistry.validate({ action: "valid_action" });
    expect(result).toBeNull();
  });
});

// SCORM Helper Integration Tests
// Note: scorm12-helper.js only exports reportScoreAndGUIDToLMS12 to window
describe("SCORM Helper Integration", () => {
  beforeAll(() => {
    global.window = global;
    loadSourceFile("js/scorm12-helper.js");
  });

  it("reportScoreAndGUIDToLMS12 is defined", () => {
    expect(typeof global.reportScoreAndGUIDToLMS12).toBe("function");
  });

  it("reportScoreAndGUIDToLMS12 returns false when API not found", () => {
    // Mock console.warn to suppress warning
    const warnSpy = vi.spyOn(console, "warn").mockImplementation();

    const result = global.reportScoreAndGUIDToLMS12(85, "test-guid");
    expect(result).toBe(false);

    warnSpy.mockRestore();
  });
});

// BacklogRenderer Integration Tests
describe("BacklogRenderer Integration", () => {
  beforeAll(() => {
    global.window = global;
    global.SCENARIOS = {};
    global.ScoringManager = {
      getTimeColorClass: () => "text-green-400",
    };
    loadSourceFile("js/ui/backlog.js");
  });

  it("window.BacklogRenderer is defined", () => {
    expect(global.BacklogRenderer).toBeDefined();
  });

  it("has getDifficulty() method", () => {
    expect(typeof global.BacklogRenderer.getDifficulty).toBe("function");
  });

  it("getDifficulty returns correct levels", () => {
    expect(global.BacklogRenderer.getDifficulty(0.25).label).toBe("Easy");
    expect(global.BacklogRenderer.getDifficulty(0.75).label).toBe("Medium");
    expect(global.BacklogRenderer.getDifficulty(1.25).label).toBe("Hard");
    expect(global.BacklogRenderer.getDifficulty(2.0).label).toBe("Expert");
  });

  it("has normalizeCategory() method", () => {
    expect(typeof global.BacklogRenderer.normalizeCategory).toBe("function");
  });

  it("normalizeCategory maps categories correctly", () => {
    expect(global.BacklogRenderer.normalizeCategory("lighting")).toBe(
      "look_dev",
    );
    expect(global.BacklogRenderer.normalizeCategory("physics")).toBe(
      "game_dev",
    );
    expect(global.BacklogRenderer.normalizeCategory("cinematics")).toBe("vfx");
  });

  it("has filterByCategory() method", () => {
    expect(typeof global.BacklogRenderer.filterByCategory).toBe("function");
  });

  it("filterByCategory returns all for 'all' filter", () => {
    const scenarios = [
      { id: "a", data: { meta: { category: "lighting" } } },
      { id: "b", data: { meta: { category: "physics" } } },
    ];
    const result = global.BacklogRenderer.filterByCategory(scenarios, "all");
    expect(result).toHaveLength(2);
  });

  it("has getValidScenarios() method", () => {
    expect(typeof global.BacklogRenderer.getValidScenarios).toBe("function");
  });
});
