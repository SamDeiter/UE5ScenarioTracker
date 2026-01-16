/**
 * Validator Unit Tests
 * Tests for scenario structural validation
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock ActionRegistry for _validateStep tests
const mockActionRegistry = {
  validate: vi.fn(() => null),
};

// Recreate Validator logic for testing (adapted from IIFE pattern)
const Validator = {
  validateScenario(id, scenario) {
    const errors = [];

    // 1. Basic Metadata
    if (!scenario.meta) {
      errors.push(`Scenario "${id}" is missing "meta" object.`);
    } else {
      if (!scenario.meta.title)
        errors.push(`Scenario "${id}" meta is missing "title".`);
      if (!scenario.meta.category)
        errors.push(`Scenario "${id}" meta is missing "category".`);
      if (typeof scenario.meta.estimateHours !== "number")
        errors.push(`Scenario "${id}" meta "estimateHours" must be a number.`);
    }

    // 3. Steps Validation
    if (!scenario.steps || typeof scenario.steps !== "object") {
      errors.push(`Scenario "${id}" is missing "steps" map.`);
    } else {
      const stepIds = Object.keys(scenario.steps);
      Object.entries(scenario.steps).forEach(([stepId, step]) => {
        this._validateStep(id, stepId, step, errors, stepIds);
      });
    }

    return {
      valid: errors.length === 0,
      errors: errors,
    };
  },

  _validateStep(scenarioId, stepId, step, errors, stepIds) {
    if (!step.title) errors.push(`[${scenarioId}:${stepId}] Missing "title".`);
    if (!step.prompt)
      errors.push(`[${scenarioId}:${stepId}] Missing "prompt".`);
    if (!Array.isArray(step.choices) || step.choices.length === 0) {
      errors.push(`[${scenarioId}:${stepId}] Must have at least one choice.`);
    } else {
      step.choices.forEach((choice, idx) => {
        if (!choice.text)
          errors.push(
            `[${scenarioId}:${stepId}] Choice ${idx} missing "text".`,
          );
        if (!choice.type)
          errors.push(
            `[${scenarioId}:${stepId}] Choice ${idx} missing "type".`,
          );
        if (!choice.next) {
          errors.push(
            `[${scenarioId}:${stepId}] Choice ${idx} missing "next".`,
          );
        } else if (
          choice.next !== "end" &&
          choice.next !== "conclusion" &&
          !stepIds.includes(choice.next)
        ) {
          errors.push(
            `[${scenarioId}:${stepId}] Choice ${idx} points to non-existent step: "${choice.next}".`,
          );
        }
      });
    }

    // Validate Actions if present
    if (step.onEnter) {
      step.onEnter.forEach((action) => {
        const err = mockActionRegistry.validate(action);
        if (err) errors.push(`[${scenarioId}:${stepId} onEnter] ${err}`);
      });
    }
  },

  reportErrors(id, errors) {
    const msg = `❌ SCENARIO VALIDATION FAILED: ${id}\n\n` + errors.join("\n");
    console.error(msg);

    const board = document.getElementById("jira-board");
    if (board) {
      const errDiv = document.createElement("div");
      errDiv.className =
        "bg-red-900/50 border border-red-500 p-4 m-4 rounded text-red-200 font-mono text-xs whitespace-pre";
      errDiv.innerText = msg;
      board.prepend(errDiv);
    }
  },
};

describe("Validator", () => {
  beforeEach(() => {
    mockActionRegistry.validate.mockClear();
  });

  describe("validateScenario", () => {
    it("validates a complete valid scenario", () => {
      const validScenario = {
        meta: {
          title: "Test Scenario",
          category: "lighting",
          estimateHours: 1.5,
        },
        steps: {
          "step-1": {
            title: "First Step",
            prompt: "What should you do?",
            choices: [
              { text: "Do something", type: "correct", next: "conclusion" },
            ],
          },
        },
      };

      const result = Validator.validateScenario("test-1", validScenario);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("detects missing meta object", () => {
      const scenario = {
        steps: {
          "step-1": {
            title: "Step",
            prompt: "Prompt",
            choices: [{ text: "Choice", type: "correct", next: "end" }],
          },
        },
      };

      const result = Validator.validateScenario("test-2", scenario);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Scenario "test-2" is missing "meta" object.',
      );
    });

    it("detects missing meta.title", () => {
      const scenario = {
        meta: { category: "lighting", estimateHours: 1 },
        steps: {
          "step-1": {
            title: "Step",
            prompt: "Prompt",
            choices: [{ text: "Choice", type: "correct", next: "end" }],
          },
        },
      };

      const result = Validator.validateScenario("test-3", scenario);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Scenario "test-3" meta is missing "title".',
      );
    });

    it("detects missing meta.category", () => {
      const scenario = {
        meta: { title: "Test", estimateHours: 1 },
        steps: {
          "step-1": {
            title: "Step",
            prompt: "Prompt",
            choices: [{ text: "Choice", type: "correct", next: "end" }],
          },
        },
      };

      const result = Validator.validateScenario("test-4", scenario);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Scenario "test-4" meta is missing "category".',
      );
    });

    it("detects non-numeric estimateHours", () => {
      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: "1.5" },
        steps: {
          "step-1": {
            title: "Step",
            prompt: "Prompt",
            choices: [{ text: "Choice", type: "correct", next: "end" }],
          },
        },
      };

      const result = Validator.validateScenario("test-5", scenario);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Scenario "test-5" meta "estimateHours" must be a number.',
      );
    });

    it("detects missing steps map", () => {
      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: 1 },
      };

      const result = Validator.validateScenario("test-6", scenario);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Scenario "test-6" is missing "steps" map.',
      );
    });

    it("detects steps as non-object", () => {
      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: 1 },
        steps: "invalid",
      };

      const result = Validator.validateScenario("test-7", scenario);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Scenario "test-7" is missing "steps" map.',
      );
    });
  });

  describe("_validateStep", () => {
    it("detects missing step title", () => {
      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: 1 },
        steps: {
          "step-1": {
            prompt: "Prompt",
            choices: [{ text: "Choice", type: "correct", next: "end" }],
          },
        },
      };

      const result = Validator.validateScenario("test-8", scenario);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('[test-8:step-1] Missing "title".');
    });

    it("detects missing step prompt", () => {
      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: 1 },
        steps: {
          "step-1": {
            title: "Step",
            choices: [{ text: "Choice", type: "correct", next: "end" }],
          },
        },
      };

      const result = Validator.validateScenario("test-9", scenario);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('[test-9:step-1] Missing "prompt".');
    });

    it("detects empty choices array", () => {
      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: 1 },
        steps: {
          "step-1": {
            title: "Step",
            prompt: "Prompt",
            choices: [],
          },
        },
      };

      const result = Validator.validateScenario("test-10", scenario);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "[test-10:step-1] Must have at least one choice.",
      );
    });

    it("detects missing choice text", () => {
      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: 1 },
        steps: {
          "step-1": {
            title: "Step",
            prompt: "Prompt",
            choices: [{ type: "correct", next: "end" }],
          },
        },
      };

      const result = Validator.validateScenario("test-11", scenario);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        '[test-11:step-1] Choice 0 missing "text".',
      );
    });

    it("detects missing choice type", () => {
      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: 1 },
        steps: {
          "step-1": {
            title: "Step",
            prompt: "Prompt",
            choices: [{ text: "Choice", next: "end" }],
          },
        },
      };

      const result = Validator.validateScenario("test-12", scenario);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        '[test-12:step-1] Choice 0 missing "type".',
      );
    });

    it("detects missing choice next", () => {
      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: 1 },
        steps: {
          "step-1": {
            title: "Step",
            prompt: "Prompt",
            choices: [{ text: "Choice", type: "correct" }],
          },
        },
      };

      const result = Validator.validateScenario("test-13", scenario);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        '[test-13:step-1] Choice 0 missing "next".',
      );
    });

    it("allows 'end' as valid next value", () => {
      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: 1 },
        steps: {
          "step-1": {
            title: "Step",
            prompt: "Prompt",
            choices: [{ text: "Choice", type: "correct", next: "end" }],
          },
        },
      };

      const result = Validator.validateScenario("test-14", scenario);

      expect(result.valid).toBe(true);
    });

    it("allows 'conclusion' as valid next value", () => {
      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: 1 },
        steps: {
          "step-1": {
            title: "Step",
            prompt: "Prompt",
            choices: [{ text: "Choice", type: "correct", next: "conclusion" }],
          },
        },
      };

      const result = Validator.validateScenario("test-15", scenario);

      expect(result.valid).toBe(true);
    });

    it("allows valid step reference as next value", () => {
      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: 1 },
        steps: {
          "step-1": {
            title: "Step 1",
            prompt: "Prompt",
            choices: [{ text: "Choice", type: "correct", next: "step-2" }],
          },
          "step-2": {
            title: "Step 2",
            prompt: "Prompt",
            choices: [{ text: "Choice", type: "correct", next: "end" }],
          },
        },
      };

      const result = Validator.validateScenario("test-16", scenario);

      expect(result.valid).toBe(true);
    });

    it("detects invalid step reference in next", () => {
      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: 1 },
        steps: {
          "step-1": {
            title: "Step",
            prompt: "Prompt",
            choices: [
              { text: "Choice", type: "correct", next: "non-existent-step" },
            ],
          },
        },
      };

      const result = Validator.validateScenario("test-17", scenario);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        '[test-17:step-1] Choice 0 points to non-existent step: "non-existent-step".',
      );
    });

    it("validates onEnter actions via ActionRegistry", () => {
      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: 1 },
        steps: {
          "step-1": {
            title: "Step",
            prompt: "Prompt",
            choices: [{ text: "Choice", type: "correct", next: "end" }],
            onEnter: [{ action: "set_ue_property", scenario: "test" }],
          },
        },
      };

      Validator.validateScenario("test-18", scenario);

      expect(mockActionRegistry.validate).toHaveBeenCalledWith({
        action: "set_ue_property",
        scenario: "test",
      });
    });

    it("reports action validation errors", () => {
      mockActionRegistry.validate.mockReturnValue("Missing required param");

      const scenario = {
        meta: { title: "Test", category: "lighting", estimateHours: 1 },
        steps: {
          "step-1": {
            title: "Step",
            prompt: "Prompt",
            choices: [{ text: "Choice", type: "correct", next: "end" }],
            onEnter: [{ action: "invalid_action" }],
          },
        },
      };

      const result = Validator.validateScenario("test-19", scenario);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "[test-19:step-1 onEnter] Missing required param",
      );
    });
  });

  describe("reportErrors", () => {
    it("logs errors to console", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation();

      Validator.reportErrors("test-scenario", ["Error 1", "Error 2"]);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("SCENARIO VALIDATION FAILED: test-scenario"),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error 1"),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error 2"),
      );

      consoleSpy.mockRestore();
    });

    it("creates error div in jira-board if present", () => {
      // Create mock jira-board element
      const board = document.createElement("div");
      board.id = "jira-board";
      document.body.appendChild(board);

      const consoleSpy = vi.spyOn(console, "error").mockImplementation();

      Validator.reportErrors("test-scenario", ["Error 1"]);

      const errorDiv = board.querySelector("div");
      expect(errorDiv).not.toBeNull();
      expect(errorDiv.innerText).toContain("Error 1");
      expect(errorDiv.className).toContain("bg-red-900");

      // Cleanup
      document.body.removeChild(board);
      consoleSpy.mockRestore();
    });

    it("handles missing jira-board gracefully", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation();

      // Should not throw even without jira-board element
      expect(() => {
        Validator.reportErrors("test-scenario", ["Error 1"]);
      }).not.toThrow();

      consoleSpy.mockRestore();
    });
  });
});
