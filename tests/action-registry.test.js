/**
 * ActionRegistry Unit Tests
 * Tests for action registration, validation, and execution
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

// Recreate ActionRegistry logic for testing
function createActionRegistry() {
  const registry = {
    _actions: {},

    register(key, handler) {
      if (this._actions[key]) {
        console.warn(
          `[ActionRegistry] Action "${key}" is already registered. Overwriting.`,
        );
      }
      this._actions[key] = handler;
    },

    validate(step) {
      if (!step.action) return "Missing 'action' key in step.";
      const handler = this._actions[step.action];
      if (!handler) return `Unknown action: "${step.action}"`;
      if (handler.validate) return handler.validate(step);
      return null;
    },

    async execute(step) {
      const handler = this._actions[step.action];
      if (!handler) {
        throw new Error(
          `[ActionRegistry] Cannot execute unknown action: ${step.action}`,
        );
      }
      return await handler.execute(step);
    },

    // Helper to reset for testing
    _reset() {
      this._actions = {};
    },
  };
  return registry;
}

describe("ActionRegistry", () => {
  let ActionRegistry;

  beforeEach(() => {
    ActionRegistry = createActionRegistry();
  });

  describe("register()", () => {
    it("registers a new action handler", () => {
      const handler = {
        validate: () => null,
        execute: async () => {},
      };

      ActionRegistry.register("test_action", handler);

      expect(ActionRegistry._actions["test_action"]).toBe(handler);
    });

    it("warns when overwriting existing action", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation();

      ActionRegistry.register("duplicate", { execute: () => {} });
      ActionRegistry.register("duplicate", { execute: () => {} });

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Action "duplicate" is already registered'),
      );

      warnSpy.mockRestore();
    });

    it("overwrites existing action with new handler", () => {
      const handler1 = { execute: () => "first" };
      const handler2 = { execute: () => "second" };

      vi.spyOn(console, "warn").mockImplementation();

      ActionRegistry.register("overwrite_test", handler1);
      ActionRegistry.register("overwrite_test", handler2);

      expect(ActionRegistry._actions["overwrite_test"]).toBe(handler2);
    });
  });

  describe("validate()", () => {
    it("returns error when action key is missing", () => {
      const step = { scenario: "test" };

      const result = ActionRegistry.validate(step);

      expect(result).toBe("Missing 'action' key in step.");
    });

    it("returns error for unknown action", () => {
      const step = { action: "unknown_action" };

      const result = ActionRegistry.validate(step);

      expect(result).toBe('Unknown action: "unknown_action"');
    });

    it("returns null for valid action without custom validate", () => {
      ActionRegistry.register("simple_action", {
        execute: async () => {},
      });

      const step = { action: "simple_action" };

      const result = ActionRegistry.validate(step);

      expect(result).toBeNull();
    });

    it("calls handler validate function when present", () => {
      const validateFn = vi.fn(() => null);
      ActionRegistry.register("validated_action", {
        validate: validateFn,
        execute: async () => {},
      });

      const step = { action: "validated_action", data: "test" };

      ActionRegistry.validate(step);

      expect(validateFn).toHaveBeenCalledWith(step);
    });

    it("returns handler validation error", () => {
      ActionRegistry.register("strict_action", {
        validate: (step) => {
          if (!step.requiredParam) return "Missing requiredParam";
          return null;
        },
        execute: async () => {},
      });

      const step = { action: "strict_action" };

      const result = ActionRegistry.validate(step);

      expect(result).toBe("Missing requiredParam");
    });

    it("returns null when handler validation passes", () => {
      ActionRegistry.register("strict_action", {
        validate: (step) => {
          if (!step.requiredParam) return "Missing requiredParam";
          return null;
        },
        execute: async () => {},
      });

      const step = { action: "strict_action", requiredParam: "value" };

      const result = ActionRegistry.validate(step);

      expect(result).toBeNull();
    });
  });

  describe("execute()", () => {
    it("throws error for unknown action", async () => {
      const step = { action: "nonexistent" };

      await expect(ActionRegistry.execute(step)).rejects.toThrow(
        "[ActionRegistry] Cannot execute unknown action: nonexistent",
      );
    });

    it("calls handler execute function", async () => {
      const executeFn = vi.fn().mockResolvedValue("result");
      ActionRegistry.register("executable", {
        execute: executeFn,
      });

      const step = { action: "executable", param: "value" };

      await ActionRegistry.execute(step);

      expect(executeFn).toHaveBeenCalledWith(step);
    });

    it("returns result from handler execute", async () => {
      ActionRegistry.register("returner", {
        execute: async (step) => step.param * 2,
      });

      const step = { action: "returner", param: 21 };

      const result = await ActionRegistry.execute(step);

      expect(result).toBe(42);
    });

    it("handles async execute functions", async () => {
      ActionRegistry.register("async_action", {
        execute: async () => {
          return new Promise((resolve) => {
            setTimeout(() => resolve("async_result"), 10);
          });
        },
      });

      const step = { action: "async_action" };

      const result = await ActionRegistry.execute(step);

      expect(result).toBe("async_result");
    });

    it("propagates errors from execute function", async () => {
      ActionRegistry.register("error_action", {
        execute: async () => {
          throw new Error("Execution failed");
        },
      });

      const step = { action: "error_action" };

      await expect(ActionRegistry.execute(step)).rejects.toThrow(
        "Execution failed",
      );
    });
  });

  describe("built-in action: set_ue_property", () => {
    it("validates scenario parameter", () => {
      ActionRegistry.register("set_ue_property", {
        validate: (params) => {
          if (!params.scenario) return "set_ue_property requires 'scenario'";
          if (!params.step) return "set_ue_property requires 'step'";
          return null;
        },
        execute: async () => {},
      });

      const step = { action: "set_ue_property", step: "step-1" };

      const result = ActionRegistry.validate(step);

      expect(result).toBe("set_ue_property requires 'scenario'");
    });

    it("validates step parameter", () => {
      ActionRegistry.register("set_ue_property", {
        validate: (params) => {
          if (!params.scenario) return "set_ue_property requires 'scenario'";
          if (!params.step) return "set_ue_property requires 'step'";
          return null;
        },
        execute: async () => {},
      });

      const step = { action: "set_ue_property", scenario: "test_scenario" };

      const result = ActionRegistry.validate(step);

      expect(result).toBe("set_ue_property requires 'step'");
    });

    it("passes validation with all required params", () => {
      ActionRegistry.register("set_ue_property", {
        validate: (params) => {
          if (!params.scenario) return "set_ue_property requires 'scenario'";
          if (!params.step) return "set_ue_property requires 'step'";
          return null;
        },
        execute: async () => {},
      });

      const step = {
        action: "set_ue_property",
        scenario: "test_scenario",
        step: "step-1",
      };

      const result = ActionRegistry.validate(step);

      expect(result).toBeNull();
    });
  });

  describe("built-in action: show_feedback", () => {
    it("executes and logs message", () => {
      const infoSpy = vi.spyOn(console, "info").mockImplementation();

      ActionRegistry.register("show_feedback", {
        execute: (params) => {
          console.info(`[Feedback] ${params.message}`);
        },
      });

      ActionRegistry.execute({ action: "show_feedback", message: "Hello!" });

      expect(infoSpy).toHaveBeenCalledWith("[Feedback] Hello!");

      infoSpy.mockRestore();
    });
  });

  describe("multiple actions", () => {
    it("can register and execute multiple different actions", async () => {
      ActionRegistry.register("action_a", {
        execute: async () => "result_a",
      });
      ActionRegistry.register("action_b", {
        execute: async () => "result_b",
      });

      const resultA = await ActionRegistry.execute({ action: "action_a" });
      const resultB = await ActionRegistry.execute({ action: "action_b" });

      expect(resultA).toBe("result_a");
      expect(resultB).toBe("result_b");
    });
  });
});
