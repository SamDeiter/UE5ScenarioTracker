/**
 * BacklogRenderer Unit Tests
 * Tests for scenario list rendering utilities
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

// Category mapping for testing
const CATEGORY_MAP = {
  lighting_rendering: "look_dev",
  lighting: "look_dev",
  rendering: "look_dev",
  materials_shaders: "look_dev",
  materials: "look_dev",
  shaders: "look_dev",
  physics_collisions: "game_dev",
  physics: "game_dev",
  collisions: "game_dev",
  blueprints_logic: "game_dev",
  blueprints: "game_dev",
  logic: "game_dev",
  sequencer_cinematics: "vfx",
  sequencer: "vfx",
  cinematics: "vfx",
  asset_management: "tech_art",
  assets: "tech_art",
  world_partition_streaming: "worldbuilding",
  world_partition: "worldbuilding",
  streaming: "worldbuilding",
  ui: "game_dev",
  user_interface: "game_dev",
  worldbuilding: "worldbuilding",
  game_dev: "game_dev",
  look_dev: "look_dev",
  tech_art: "tech_art",
  vfx: "vfx",
};

// Recreate BacklogRenderer functions for testing
function getDifficulty(estimateHours, questionCount = 0) {
  const timeScore = estimateHours || 0;

  if (timeScore < 0.5) {
    return { class: "easy", label: "Easy" };
  } else if (timeScore < 1.0) {
    return { class: "medium", label: "Medium" };
  } else if (timeScore < 1.5) {
    return { class: "hard", label: "Hard" };
  } else {
    return { class: "expert", label: "Expert" };
  }
}

function normalizeCategory(rawCategory) {
  let category = (rawCategory || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return CATEGORY_MAP[category] || category;
}

function filterByCategory(scenarios, currentFilter) {
  if (currentFilter === "all") return scenarios;

  return scenarios.filter((item) => {
    const meta = item.data.meta;
    const mappedCategory = normalizeCategory(meta.category);
    return mappedCategory === currentFilter;
  });
}

function getValidScenarios(SCENARIOS) {
  const scenarioKeys = Object.keys(SCENARIOS || {});

  return scenarioKeys
    .map((id) => ({ id, data: SCENARIOS[id] }))
    .filter(
      (item) =>
        item.data &&
        item.data.meta &&
        item.data.meta.title &&
        typeof item.data.meta.estimateHours !== "undefined",
    );
}

function updateProgressDisplay(completedCount, totalCount, filterLabel) {
  const progressText = document.getElementById("progress-text");
  const progressBar = document.getElementById("progress-bar");

  if (progressText) {
    const label = filterLabel ? ` (${filterLabel.replace("_", " ")})` : "";
    progressText.textContent = `${completedCount} of ${totalCount} modules complete${label}`;
  }

  if (progressBar) {
    const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    progressBar.style.width = `${percentage}%`;
  }
}

describe("BacklogRenderer", () => {
  describe("getDifficulty()", () => {
    it("returns 'easy' for less than 0.5 hours", () => {
      expect(getDifficulty(0)).toEqual({ class: "easy", label: "Easy" });
      expect(getDifficulty(0.25)).toEqual({ class: "easy", label: "Easy" });
      expect(getDifficulty(0.49)).toEqual({ class: "easy", label: "Easy" });
    });

    it("returns 'medium' for 0.5 to 0.99 hours", () => {
      expect(getDifficulty(0.5)).toEqual({ class: "medium", label: "Medium" });
      expect(getDifficulty(0.75)).toEqual({ class: "medium", label: "Medium" });
      expect(getDifficulty(0.99)).toEqual({ class: "medium", label: "Medium" });
    });

    it("returns 'hard' for 1.0 to 1.49 hours", () => {
      expect(getDifficulty(1.0)).toEqual({ class: "hard", label: "Hard" });
      expect(getDifficulty(1.25)).toEqual({ class: "hard", label: "Hard" });
      expect(getDifficulty(1.49)).toEqual({ class: "hard", label: "Hard" });
    });

    it("returns 'expert' for 1.5+ hours", () => {
      expect(getDifficulty(1.5)).toEqual({ class: "expert", label: "Expert" });
      expect(getDifficulty(2.0)).toEqual({ class: "expert", label: "Expert" });
      expect(getDifficulty(5.0)).toEqual({ class: "expert", label: "Expert" });
    });

    it("handles undefined/null as easy", () => {
      expect(getDifficulty(undefined)).toEqual({
        class: "easy",
        label: "Easy",
      });
      expect(getDifficulty(null)).toEqual({ class: "easy", label: "Easy" });
    });

    it("ignores questionCount parameter (legacy)", () => {
      // questionCount is not used in current implementation
      expect(getDifficulty(0.25, 10)).toEqual({ class: "easy", label: "Easy" });
      expect(getDifficulty(2.0, 0)).toEqual({
        class: "expert",
        label: "Expert",
      });
    });
  });

  describe("normalizeCategory()", () => {
    it("normalizes lighting to look_dev", () => {
      expect(normalizeCategory("lighting")).toBe("look_dev");
      expect(normalizeCategory("Lighting")).toBe("look_dev");
      expect(normalizeCategory("LIGHTING")).toBe("look_dev");
    });

    it("normalizes materials to look_dev", () => {
      expect(normalizeCategory("materials")).toBe("look_dev");
      expect(normalizeCategory("materials_shaders")).toBe("look_dev");
    });

    it("normalizes physics to game_dev", () => {
      expect(normalizeCategory("physics")).toBe("game_dev");
      expect(normalizeCategory("physics_collisions")).toBe("game_dev");
    });

    it("normalizes blueprints to game_dev", () => {
      expect(normalizeCategory("blueprints")).toBe("game_dev");
      expect(normalizeCategory("blueprints_logic")).toBe("game_dev");
    });

    it("normalizes cinematics to vfx", () => {
      expect(normalizeCategory("cinematics")).toBe("vfx");
      expect(normalizeCategory("sequencer")).toBe("vfx");
    });

    it("preserves unmapped categories", () => {
      expect(normalizeCategory("custom_category")).toBe("custom_category");
      expect(normalizeCategory("new_type")).toBe("new_type");
    });

    it("handles empty string", () => {
      expect(normalizeCategory("")).toBe("");
    });

    it("handles null/undefined", () => {
      expect(normalizeCategory(null)).toBe("");
      expect(normalizeCategory(undefined)).toBe("");
    });

    it("removes special characters", () => {
      expect(normalizeCategory("lighting!!!")).toBe("look_dev");
      // Brackets become underscores: materials_advanced is not in map, returns as-is
      expect(normalizeCategory("materials (advanced)")).toBe(
        "materials_advanced",
      );
    });

    it("trims leading/trailing underscores", () => {
      expect(normalizeCategory("__lighting__")).toBe("look_dev");
    });
  });

  describe("filterByCategory()", () => {
    const scenarios = [
      { id: "s1", data: { meta: { category: "lighting" } } },
      { id: "s2", data: { meta: { category: "materials" } } },
      { id: "s3", data: { meta: { category: "physics" } } },
      { id: "s4", data: { meta: { category: "blueprints" } } },
    ];

    it("returns all scenarios for 'all' filter", () => {
      const result = filterByCategory(scenarios, "all");
      expect(result).toHaveLength(4);
    });

    it("filters by look_dev category", () => {
      const result = filterByCategory(scenarios, "look_dev");
      expect(result).toHaveLength(2);
      expect(result.map((s) => s.id)).toEqual(["s1", "s2"]);
    });

    it("filters by game_dev category", () => {
      const result = filterByCategory(scenarios, "game_dev");
      expect(result).toHaveLength(2);
      expect(result.map((s) => s.id)).toEqual(["s3", "s4"]);
    });

    it("returns empty array for non-matching filter", () => {
      const result = filterByCategory(scenarios, "vfx");
      expect(result).toHaveLength(0);
    });

    it("handles empty scenarios array", () => {
      const result = filterByCategory([], "look_dev");
      expect(result).toEqual([]);
    });
  });

  describe("getValidScenarios()", () => {
    it("returns scenarios with required meta fields", () => {
      const SCENARIOS = {
        valid1: {
          meta: { title: "Test 1", estimateHours: 1 },
          steps: {},
        },
        valid2: {
          meta: { title: "Test 2", estimateHours: 0.5 },
          steps: {},
        },
      };

      const result = getValidScenarios(SCENARIOS);
      expect(result).toHaveLength(2);
    });

    it("filters out scenarios without meta", () => {
      const SCENARIOS = {
        valid: { meta: { title: "Test", estimateHours: 1 } },
        invalid: { steps: {} },
      };

      const result = getValidScenarios(SCENARIOS);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("valid");
    });

    it("filters out scenarios without title", () => {
      const SCENARIOS = {
        valid: { meta: { title: "Test", estimateHours: 1 } },
        invalid: { meta: { estimateHours: 1 } },
      };

      const result = getValidScenarios(SCENARIOS);
      expect(result).toHaveLength(1);
    });

    it("filters out scenarios without estimateHours", () => {
      const SCENARIOS = {
        valid: { meta: { title: "Test", estimateHours: 0 } }, // 0 is valid
        invalid: { meta: { title: "Test" } }, // undefined is not
      };

      const result = getValidScenarios(SCENARIOS);
      expect(result).toHaveLength(1);
    });

    it("handles empty SCENARIOS object", () => {
      const result = getValidScenarios({});
      expect(result).toEqual([]);
    });

    it("handles null/undefined SCENARIOS", () => {
      expect(getValidScenarios(null)).toEqual([]);
      expect(getValidScenarios(undefined)).toEqual([]);
    });

    it("returns scenario id and data", () => {
      const SCENARIOS = {
        "test-scenario": {
          meta: { title: "Test", estimateHours: 1.5 },
        },
      };

      const result = getValidScenarios(SCENARIOS);
      expect(result[0].id).toBe("test-scenario");
      expect(result[0].data).toBe(SCENARIOS["test-scenario"]);
    });
  });

  describe("updateProgressDisplay()", () => {
    beforeEach(() => {
      // Create mock DOM elements
      document.body.innerHTML = `
        <div id="progress-text"></div>
        <div id="progress-bar" style="width: 0%"></div>
      `;
    });

    it("updates progress text with counts", () => {
      updateProgressDisplay(5, 10, "");

      const progressText = document.getElementById("progress-text");
      expect(progressText.textContent).toBe("5 of 10 modules complete");
    });

    it("includes filter label when provided", () => {
      updateProgressDisplay(3, 5, "look_dev");

      const progressText = document.getElementById("progress-text");
      expect(progressText.textContent).toBe(
        "3 of 5 modules complete (look dev)",
      );
    });

    it("replaces underscores in filter label", () => {
      updateProgressDisplay(2, 4, "game_dev");

      const progressText = document.getElementById("progress-text");
      expect(progressText.textContent).toContain("game dev");
    });

    it("updates progress bar width", () => {
      updateProgressDisplay(5, 10, "");

      const progressBar = document.getElementById("progress-bar");
      expect(progressBar.style.width).toBe("50%");
    });

    it("handles 0 total count (no division by zero)", () => {
      updateProgressDisplay(0, 0, "");

      const progressBar = document.getElementById("progress-bar");
      expect(progressBar.style.width).toBe("0%");
    });

    it("handles 100% completion", () => {
      updateProgressDisplay(10, 10, "");

      const progressBar = document.getElementById("progress-bar");
      expect(progressBar.style.width).toBe("100%");
    });

    it("handles missing progress text element", () => {
      document.body.innerHTML = `<div id="progress-bar"></div>`;

      // Should not throw
      expect(() => updateProgressDisplay(5, 10, "")).not.toThrow();
    });

    it("handles missing progress bar element", () => {
      document.body.innerHTML = `<div id="progress-text"></div>`;

      // Should not throw
      expect(() => updateProgressDisplay(5, 10, "")).not.toThrow();
    });
  });

  describe("CATEGORY_MAP", () => {
    it("maps lighting variations to look_dev", () => {
      expect(CATEGORY_MAP["lighting"]).toBe("look_dev");
      expect(CATEGORY_MAP["lighting_rendering"]).toBe("look_dev");
      expect(CATEGORY_MAP["rendering"]).toBe("look_dev");
    });

    it("maps materials variations to look_dev", () => {
      expect(CATEGORY_MAP["materials"]).toBe("look_dev");
      expect(CATEGORY_MAP["materials_shaders"]).toBe("look_dev");
      expect(CATEGORY_MAP["shaders"]).toBe("look_dev");
    });

    it("maps physics variations to game_dev", () => {
      expect(CATEGORY_MAP["physics"]).toBe("game_dev");
      expect(CATEGORY_MAP["physics_collisions"]).toBe("game_dev");
      expect(CATEGORY_MAP["collisions"]).toBe("game_dev");
    });

    it("maps blueprint variations to game_dev", () => {
      expect(CATEGORY_MAP["blueprints"]).toBe("game_dev");
      expect(CATEGORY_MAP["blueprints_logic"]).toBe("game_dev");
      expect(CATEGORY_MAP["logic"]).toBe("game_dev");
    });

    it("maps cinematics to vfx", () => {
      expect(CATEGORY_MAP["cinematics"]).toBe("vfx");
      expect(CATEGORY_MAP["sequencer"]).toBe("vfx");
      expect(CATEGORY_MAP["sequencer_cinematics"]).toBe("vfx");
    });

    it("maps assets to tech_art", () => {
      expect(CATEGORY_MAP["assets"]).toBe("tech_art");
      expect(CATEGORY_MAP["asset_management"]).toBe("tech_art");
    });

    it("maps world partition to worldbuilding", () => {
      expect(CATEGORY_MAP["world_partition"]).toBe("worldbuilding");
      expect(CATEGORY_MAP["streaming"]).toBe("worldbuilding");
    });

    it("maps ui to game_dev", () => {
      expect(CATEGORY_MAP["ui"]).toBe("game_dev");
      expect(CATEGORY_MAP["user_interface"]).toBe("game_dev");
    });
  });
});
