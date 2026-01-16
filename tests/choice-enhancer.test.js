/**
 * ChoiceEnhancer Unit Tests
 * Tests for choice padding and shuffling logic
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

// Recreate ChoiceEnhancer logic for testing
const ChoiceEnhancer = {
  TARGET_CHOICES: 4,

  _fillerPool: {
    lighting: [
      {
        text: "Rebuild lighting for the level",
        type: "wrong",
        feedback: "<p>Rebuilding lighting affects baked lightmaps.</p>",
      },
      {
        text: "Check the Post Process Volume settings",
        type: "misguided",
        feedback: "<p>Post Process Volumes handle color grading.</p>",
      },
      {
        text: "Adjust the Skylight intensity",
        type: "wrong",
        feedback: "<p>The Skylight provides ambient lighting.</p>",
      },
      {
        text: "Toggle Lumen on and off",
        type: "misguided",
        feedback: "<p>Lumen is a GI system.</p>",
      },
    ],
    materials: [
      {
        text: "Reimport the texture asset",
        type: "wrong",
        feedback: "<p>The texture file itself isn't corrupted.</p>",
      },
      {
        text: "Check the texture compression settings",
        type: "misguided",
        feedback: "<p>Compression affects quality and memory.</p>",
      },
    ],
    general: [
      {
        text: "Restart the Unreal Editor",
        type: "wrong",
        feedback: "<p>A simple restart won't fix configuration issues.</p>",
      },
      {
        text: "Check the Output Log for errors",
        type: "misguided",
        feedback: "<p>Good instinct, but the log doesn't show errors.</p>",
      },
      {
        text: "Search online for similar issues",
        type: "misguided",
        feedback: "<p>While research helps, you have enough info.</p>",
      },
      {
        text: "Revert to a previous saved version",
        type: "wrong",
        feedback: "<p>Reverting would lose your progress.</p>",
      },
    ],
  },

  _shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  padChoices(choices, skill = "general", currentStepId = null) {
    if (choices.length >= this.TARGET_CHOICES) {
      return choices;
    }

    const needed = this.TARGET_CHOICES - choices.length;
    const pool = this._fillerPool[skill] || this._fillerPool["general"];
    const existingTexts = choices.map((c) => c.text.toLowerCase());

    const available = pool.filter((filler) => {
      const fillerLower = filler.text.toLowerCase();
      return !existingTexts.some(
        (existing) =>
          existing.includes(fillerLower) || fillerLower.includes(existing),
      );
    });

    const selected = this._shuffle(available).slice(0, needed);

    const enhancedFillers = selected.map((filler) => ({
      text: filler.text,
      type: filler.type,
      feedback: filler.feedback,
      next: currentStepId || "__SAME_STEP__",
    }));

    return [...choices, ...enhancedFillers];
  },

  getSkill(step) {
    return step.skill || "general";
  },
};

describe("ChoiceEnhancer", () => {
  describe("TARGET_CHOICES constant", () => {
    it("should be 4", () => {
      expect(ChoiceEnhancer.TARGET_CHOICES).toBe(4);
    });
  });

  describe("_shuffle()", () => {
    it("returns array of same length", () => {
      const input = [1, 2, 3, 4, 5];
      const result = ChoiceEnhancer._shuffle(input);
      expect(result).toHaveLength(5);
    });

    it("does not modify original array", () => {
      const input = [1, 2, 3, 4, 5];
      const original = [...input];
      ChoiceEnhancer._shuffle(input);
      expect(input).toEqual(original);
    });

    it("contains same elements", () => {
      const input = [1, 2, 3, 4, 5];
      const result = ChoiceEnhancer._shuffle(input);
      expect(result.sort()).toEqual(input.sort());
    });

    it("handles empty array", () => {
      const result = ChoiceEnhancer._shuffle([]);
      expect(result).toEqual([]);
    });

    it("handles single element", () => {
      const result = ChoiceEnhancer._shuffle([42]);
      expect(result).toEqual([42]);
    });

    it("produces different orderings (statistical test)", () => {
      // Run multiple shuffles and check at least one is different
      const input = [1, 2, 3, 4, 5, 6, 7, 8];
      let foundDifferent = false;
      for (let i = 0; i < 10; i++) {
        const result = ChoiceEnhancer._shuffle(input);
        if (JSON.stringify(result) !== JSON.stringify(input)) {
          foundDifferent = true;
          break;
        }
      }
      expect(foundDifferent).toBe(true);
    });
  });

  describe("padChoices()", () => {
    it("returns original array if already at TARGET_CHOICES", () => {
      const choices = [
        { text: "A", type: "correct", next: "end" },
        { text: "B", type: "wrong", next: "end" },
        { text: "C", type: "wrong", next: "end" },
        { text: "D", type: "wrong", next: "end" },
      ];

      const result = ChoiceEnhancer.padChoices(choices);
      expect(result).toBe(choices);
      expect(result).toHaveLength(4);
    });

    it("returns original array if over TARGET_CHOICES", () => {
      const choices = [
        { text: "A", type: "correct", next: "end" },
        { text: "B", type: "wrong", next: "end" },
        { text: "C", type: "wrong", next: "end" },
        { text: "D", type: "wrong", next: "end" },
        { text: "E", type: "wrong", next: "end" },
      ];

      const result = ChoiceEnhancer.padChoices(choices);
      expect(result).toBe(choices);
      expect(result).toHaveLength(5);
    });

    it("pads to exactly TARGET_CHOICES", () => {
      const choices = [
        { text: "Correct answer", type: "correct", next: "end" },
      ];

      const result = ChoiceEnhancer.padChoices(choices);
      expect(result).toHaveLength(4);
    });

    it("adds filler choices from skill pool", () => {
      const choices = [
        { text: "Correct answer", type: "correct", next: "end" },
      ];

      const result = ChoiceEnhancer.padChoices(choices, "lighting", "step-1");

      expect(result).toHaveLength(4);
      // Verify fillers are from lighting pool
      const fillerTexts = result.slice(1).map((c) => c.text);
      const lightingTexts = ChoiceEnhancer._fillerPool.lighting.map(
        (f) => f.text,
      );
      fillerTexts.forEach((text) => {
        expect(lightingTexts).toContain(text);
      });
    });

    it("uses general pool as fallback for unknown skill", () => {
      const choices = [{ text: "Answer", type: "correct", next: "end" }];

      const result = ChoiceEnhancer.padChoices(
        choices,
        "unknown_skill",
        "step-1",
      );

      expect(result).toHaveLength(4);
      // Verify fillers are from general pool
      const fillerTexts = result.slice(1).map((c) => c.text);
      const generalTexts = ChoiceEnhancer._fillerPool.general.map(
        (f) => f.text,
      );
      fillerTexts.forEach((text) => {
        expect(generalTexts).toContain(text);
      });
    });

    it("sets next to currentStepId", () => {
      const choices = [{ text: "Answer", type: "correct", next: "end" }];

      const result = ChoiceEnhancer.padChoices(choices, "general", "step-2");

      const fillers = result.slice(1);
      fillers.forEach((filler) => {
        expect(filler.next).toBe("step-2");
      });
    });

    it("sets next to __SAME_STEP__ when no currentStepId", () => {
      const choices = [{ text: "Answer", type: "correct", next: "end" }];

      const result = ChoiceEnhancer.padChoices(choices, "general");

      const fillers = result.slice(1);
      fillers.forEach((filler) => {
        expect(filler.next).toBe("__SAME_STEP__");
      });
    });

    it("preserves original choices", () => {
      const choices = [
        { text: "Correct", type: "correct", next: "step-2" },
        { text: "Wrong", type: "wrong", next: "step-1" },
      ];

      const result = ChoiceEnhancer.padChoices(choices, "general", "step-1");

      expect(result[0]).toEqual(choices[0]);
      expect(result[1]).toEqual(choices[1]);
    });

    it("includes type and feedback in fillers", () => {
      const choices = [{ text: "Answer", type: "correct", next: "end" }];

      const result = ChoiceEnhancer.padChoices(choices, "general", "step-1");

      const filler = result[1];
      expect(filler.type).toBeDefined();
      expect(["wrong", "misguided"]).toContain(filler.type);
      expect(filler.feedback).toBeDefined();
      expect(filler.feedback).toContain("<p>");
    });

    it("avoids duplicate choices (similar text)", () => {
      // Use a choice that partially matches a filler
      const choices = [
        {
          text: "Restart the Unreal Editor immediately",
          type: "wrong",
          next: "end",
        },
      ];

      const result = ChoiceEnhancer.padChoices(choices, "general", "step-1");

      const texts = result.map((c) => c.text.toLowerCase());
      // Should not have "Restart the Unreal Editor" again
      const restartCount = texts.filter((t) => t.includes("restart")).length;
      expect(restartCount).toBe(1);
    });
  });

  describe("getSkill()", () => {
    it("returns skill from step when present", () => {
      const step = { skill: "lighting", title: "Test" };
      expect(ChoiceEnhancer.getSkill(step)).toBe("lighting");
    });

    it("returns 'general' when skill is missing", () => {
      const step = { title: "Test" };
      expect(ChoiceEnhancer.getSkill(step)).toBe("general");
    });

    it("handles empty step object", () => {
      expect(ChoiceEnhancer.getSkill({})).toBe("general");
    });
  });

  describe("_fillerPool structure", () => {
    it("has lighting category", () => {
      expect(ChoiceEnhancer._fillerPool.lighting).toBeDefined();
      expect(Array.isArray(ChoiceEnhancer._fillerPool.lighting)).toBe(true);
    });

    it("has materials category", () => {
      expect(ChoiceEnhancer._fillerPool.materials).toBeDefined();
    });

    it("has general category", () => {
      expect(ChoiceEnhancer._fillerPool.general).toBeDefined();
    });

    it("fillers have required properties", () => {
      Object.values(ChoiceEnhancer._fillerPool).forEach((pool) => {
        pool.forEach((filler) => {
          expect(filler.text).toBeDefined();
          expect(filler.type).toBeDefined();
          expect(filler.feedback).toBeDefined();
        });
      });
    });

    it("fillers have valid types", () => {
      const validTypes = ["wrong", "misguided", "correct", "partial"];
      Object.values(ChoiceEnhancer._fillerPool).forEach((pool) => {
        pool.forEach((filler) => {
          expect(validTypes).toContain(filler.type);
        });
      });
    });
  });
});
