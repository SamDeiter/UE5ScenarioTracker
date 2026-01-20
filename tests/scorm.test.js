/**
 * SCORM 1.2 Helper Unit Tests
 * Tests for LMS integration functions
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

// Recreate SCORM helper functions for testing
function clampPct(n) {
  n = Number(n) || 0;
  if (n < 0) n = 0;
  if (n > 100) n = 100;
  return Math.round(n);
}

function fnv1a32(str) {
  var h = 0x811c9dc5 >>> 0;
  for (var i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h + (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)) >>> 0;
  }
  return ("00000000" + h.toString(16)).slice(-8);
}

function createMockAPI() {
  const api = {
    values: {},
    LMSSetValue: vi.fn((key, value) => {
      api.values[key] = value;
      return "true";
    }),
    LMSCommit: vi.fn(() => "true"),
    LMSGetValue: vi.fn((key) => api.values[key] || ""),
  };
  return api;
}

function commit(api) {
  try {
    if (api && api.LMSCommit) {
      const result = api.LMSCommit("");
      return result === "true";
    }
  } catch (e) {
    console.error("SCORM LMSCommit failed:", e);
    return false;
  }
  return false;
}

function storeGuidFields(api, g, pct) {
  try {
    var payload = JSON.stringify({
      guid: String(g || ""),
      score: pct,
      ts: new Date().toISOString(),
    });
    if (payload.length <= 4000) {
      api.LMSSetValue("cmi.suspend_data", payload);
    } else {
      var head = String(g || "").substring(0, 3500);
      var truncated = JSON.stringify({
        guid: head,
        truncated: true,
        total_len: String(g || "").length,
        score: pct,
        ts: new Date().toISOString(),
      });
      api.LMSSetValue("cmi.suspend_data", truncated.substring(0, 4000));
    }
    var ref;
    if (g && g.length > 200) ref = "guid-fnv32:" + fnv1a32(g) + ":" + g.length;
    else ref = "guid:" + g;
    if (ref.length > 250) ref = ref.substring(0, 250);
    api.LMSSetValue("cmi.core.lesson_location", ref);
  } catch (e) {
    // Silent catch as in original
  }
}

describe("SCORM 1.2 Helper", () => {
  describe("clampPct()", () => {
    it("clamps negative values to 0", () => {
      expect(clampPct(-10)).toBe(0);
      expect(clampPct(-1)).toBe(0);
      expect(clampPct(-100)).toBe(0);
    });

    it("clamps values over 100 to 100", () => {
      expect(clampPct(101)).toBe(100);
      expect(clampPct(150)).toBe(100);
      expect(clampPct(1000)).toBe(100);
    });

    it("rounds to nearest integer", () => {
      expect(clampPct(50.4)).toBe(50);
      expect(clampPct(50.5)).toBe(51);
      expect(clampPct(50.6)).toBe(51);
    });

    it("handles 0 correctly", () => {
      expect(clampPct(0)).toBe(0);
    });

    it("handles 100 correctly", () => {
      expect(clampPct(100)).toBe(100);
    });

    it("passes through valid percentages", () => {
      expect(clampPct(25)).toBe(25);
      expect(clampPct(50)).toBe(50);
      expect(clampPct(75)).toBe(75);
    });

    it("handles string numbers", () => {
      expect(clampPct("50")).toBe(50);
      expect(clampPct("75.5")).toBe(76);
    });

    it("handles NaN/undefined as 0", () => {
      expect(clampPct(NaN)).toBe(0);
      expect(clampPct(undefined)).toBe(0);
      expect(clampPct(null)).toBe(0);
      expect(clampPct("invalid")).toBe(0);
    });
  });

  describe("fnv1a32()", () => {
    it("returns 8-character hex string", () => {
      const result = fnv1a32("test");
      expect(result).toHaveLength(8);
      expect(/^[0-9a-f]{8}$/.test(result)).toBe(true);
    });

    it("produces consistent hash for same input", () => {
      const hash1 = fnv1a32("consistent_input");
      const hash2 = fnv1a32("consistent_input");
      expect(hash1).toBe(hash2);
    });

    it("produces different hashes for different inputs", () => {
      const hash1 = fnv1a32("input_a");
      const hash2 = fnv1a32("input_b");
      expect(hash1).not.toBe(hash2);
    });

    it("handles empty string", () => {
      const result = fnv1a32("");
      expect(result).toHaveLength(8);
      expect(/^[0-9a-f]{8}$/.test(result)).toBe(true);
    });

    it("handles long strings", () => {
      const longString = "a".repeat(10000);
      const result = fnv1a32(longString);
      expect(result).toHaveLength(8);
    });

    it("handles unicode characters", () => {
      const result = fnv1a32("你好世界");
      expect(result).toHaveLength(8);
      expect(/^[0-9a-f]{8}$/.test(result)).toBe(true);
    });

    it("handles special characters", () => {
      const result = fnv1a32("!@#$%^&*()");
      expect(result).toHaveLength(8);
      expect(/^[0-9a-f]{8}$/.test(result)).toBe(true);
    });
  });

  describe("commit()", () => {
    it("returns true when LMSCommit succeeds", () => {
      const api = { LMSCommit: vi.fn(() => "true") };
      expect(commit(api)).toBe(true);
    });

    it("returns false when LMSCommit returns false", () => {
      const api = { LMSCommit: vi.fn(() => "false") };
      expect(commit(api)).toBe(false);
    });

    it("returns false when api is null", () => {
      expect(commit(null)).toBe(false);
    });

    it("returns false when LMSCommit is missing", () => {
      expect(commit({})).toBe(false);
    });

    it("returns false and logs on exception", () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation();
      const api = {
        LMSCommit: () => {
          throw new Error("Commit failed");
        },
      };

      expect(commit(api)).toBe(false);
      expect(errorSpy).toHaveBeenCalledWith(
        "SCORM LMSCommit failed:",
        expect.any(Error),
      );

      errorSpy.mockRestore();
    });
  });

  describe("storeGuidFields()", () => {
    let api;

    beforeEach(() => {
      api = createMockAPI();
    });

    it("stores suspend_data as JSON", () => {
      storeGuidFields(api, "test-guid-123", 85);

      expect(api.LMSSetValue).toHaveBeenCalledWith(
        "cmi.suspend_data",
        expect.stringContaining('"guid":"test-guid-123"'),
      );
    });

    it("includes score in suspend_data", () => {
      storeGuidFields(api, "guid", 75);

      expect(api.LMSSetValue).toHaveBeenCalledWith(
        "cmi.suspend_data",
        expect.stringContaining('"score":75'),
      );
    });

    it("includes timestamp in suspend_data", () => {
      storeGuidFields(api, "guid", 50);

      expect(api.LMSSetValue).toHaveBeenCalledWith(
        "cmi.suspend_data",
        expect.stringContaining('"ts":'),
      );
    });

    it("stores lesson_location with short GUID", () => {
      storeGuidFields(api, "short-guid", 100);

      expect(api.LMSSetValue).toHaveBeenCalledWith(
        "cmi.core.lesson_location",
        "guid:short-guid",
      );
    });

    it("uses fnv32 hash for GUID over 200 chars", () => {
      const longGuid = "a".repeat(250);
      storeGuidFields(api, longGuid, 90);

      const locationCall = api.LMSSetValue.mock.calls.find(
        (call) => call[0] === "cmi.core.lesson_location",
      );
      expect(locationCall[1]).toMatch(/^guid-fnv32:[0-9a-f]{8}:250$/);
    });

    it("truncates suspend_data for very long GUIDs", () => {
      const veryLongGuid = "x".repeat(5000);
      storeGuidFields(api, veryLongGuid, 80);

      const suspendCall = api.LMSSetValue.mock.calls.find(
        (call) => call[0] === "cmi.suspend_data",
      );
      expect(suspendCall[1].length).toBeLessThanOrEqual(4000);
    });

    it("marks truncated GUIDs in suspend_data", () => {
      const veryLongGuid = "x".repeat(5000);
      storeGuidFields(api, veryLongGuid, 80);

      expect(api.LMSSetValue).toHaveBeenCalledWith(
        "cmi.suspend_data",
        expect.stringContaining('"truncated":true'),
      );
    });

    it("handles empty GUID", () => {
      storeGuidFields(api, "", 100);

      expect(api.LMSSetValue).toHaveBeenCalledWith(
        "cmi.core.lesson_location",
        "guid:",
      );
    });

    it("handles null GUID", () => {
      storeGuidFields(api, null, 100);

      expect(api.LMSSetValue).toHaveBeenCalledWith(
        "cmi.suspend_data",
        expect.stringContaining('"guid":""'),
      );
    });
  });

  describe("SCORM field limits", () => {
    it("lesson_location is under 255 chars", () => {
      // SCORM 1.2 spec: cmi.core.lesson_location max is 255
      const longGuid = "a".repeat(300);
      const api = createMockAPI();

      storeGuidFields(api, longGuid, 100);

      const locationCall = api.LMSSetValue.mock.calls.find(
        (call) => call[0] === "cmi.core.lesson_location",
      );
      expect(locationCall[1].length).toBeLessThanOrEqual(250);
    });

    it("suspend_data is under 4096 chars", () => {
      // SCORM 1.2 spec: cmi.suspend_data max is 4096
      const longGuid = "a".repeat(5000);
      const api = createMockAPI();

      storeGuidFields(api, longGuid, 100);

      const suspendCall = api.LMSSetValue.mock.calls.find(
        (call) => call[0] === "cmi.suspend_data",
      );
      expect(suspendCall[1].length).toBeLessThanOrEqual(4000);
    });
  });

  describe("score values", () => {
    it("accepts 0 as valid score", () => {
      expect(clampPct(0)).toBe(0);
    });

    it("accepts 100 as valid score", () => {
      expect(clampPct(100)).toBe(100);
    });

    it("accepts fractional scores", () => {
      expect(clampPct(33.33)).toBe(33);
      expect(clampPct(66.67)).toBe(67);
    });
  });
});
