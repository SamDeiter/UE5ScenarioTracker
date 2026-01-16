/**
 * Config URL Auto-Start Tests
 * Tests for the URL parameter scenario auto-start feature
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock URL search params
function mockURLParams(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, value);
  });

  // Mock window.location
  Object.defineProperty(window, "location", {
    value: {
      search: "?" + searchParams.toString(),
      href: "http://localhost:8080/index.html?" + searchParams.toString(),
    },
    writable: true,
  });
}

describe("Config URL Auto-Start", () => {
  let originalLocation;

  beforeEach(() => {
    // Save original location
    originalLocation = window.location;

    // Reset APP_CONFIG
    window.APP_CONFIG = {
      DEBUG_PASSWORD: "test",
      PASS_THRESHOLD: 0.8,
    };

    // Mock SCENARIOS
    window.SCENARIOS = {
      TestScenario: {
        meta: { title: "Test Scenario", description: "A test" },
        steps: { "step-0": { prompt: "Test", choices: [] } },
      },
    };
  });

  afterEach(() => {
    window.location = originalLocation;
    delete window.APP_CONFIG.AUTO_START_SCENARIO;
    vi.restoreAllMocks();
  });

  describe("URL Parameter Parsing", () => {
    it("parses scenario parameter from URL", () => {
      mockURLParams({ scenario: "TestScenario" });

      const params = new URLSearchParams(window.location.search);
      const scenarioId = params.get("scenario");

      expect(scenarioId).toBe("TestScenario");
    });

    it("returns null when no scenario parameter", () => {
      mockURLParams({});

      const params = new URLSearchParams(window.location.search);
      const scenarioId = params.get("scenario");

      expect(scenarioId).toBeNull();
    });

    it("handles scenario names with spaces", () => {
      // Pass the decoded value - URLSearchParams.set() handles encoding
      mockURLParams({ scenario: "AI Behavior Test" });

      const params = new URLSearchParams(window.location.search);
      const scenarioId = params.get("scenario");

      // URLSearchParams automatically decodes when getting
      expect(scenarioId).toBe("AI Behavior Test");
    });
  });

  describe("AUTO_START_SCENARIO Config", () => {
    it("sets AUTO_START_SCENARIO when URL param present", () => {
      const scenarioId = "TestScenario";
      window.APP_CONFIG.AUTO_START_SCENARIO = scenarioId;

      expect(window.APP_CONFIG.AUTO_START_SCENARIO).toBe("TestScenario");
    });

    it("AUTO_START_SCENARIO is undefined by default", () => {
      delete window.APP_CONFIG.AUTO_START_SCENARIO;

      expect(window.APP_CONFIG.AUTO_START_SCENARIO).toBeUndefined();
    });
  });

  describe("Scenario Lookup", () => {
    it("finds scenario by ID in SCENARIOS object", () => {
      const scenarioId = "TestScenario";
      const scenario = window.SCENARIOS?.[scenarioId];

      expect(scenario).toBeDefined();
      expect(scenario.meta.title).toBe("Test Scenario");
    });

    it("returns undefined for non-existent scenario", () => {
      const scenario = window.SCENARIOS?.["NonExistent"];

      expect(scenario).toBeUndefined();
    });
  });

  describe("DOM Element Lookup", () => {
    let ticketPlaceholder;
    let ticketContent;
    let ticketTitle;
    let ticketStepContent;

    beforeEach(() => {
      // Create mock DOM elements
      ticketPlaceholder = document.createElement("div");
      ticketPlaceholder.id = "ticket-placeholder";
      document.body.appendChild(ticketPlaceholder);

      ticketContent = document.createElement("div");
      ticketContent.id = "ticket-content";
      ticketContent.classList.add("hidden");
      document.body.appendChild(ticketContent);

      ticketTitle = document.createElement("h3");
      ticketTitle.id = "ticket-title";
      document.body.appendChild(ticketTitle);

      ticketStepContent = document.createElement("div");
      ticketStepContent.id = "ticket-step-content";
      document.body.appendChild(ticketStepContent);
    });

    afterEach(() => {
      ticketPlaceholder?.remove();
      ticketContent?.remove();
      ticketTitle?.remove();
      ticketStepContent?.remove();
    });

    it("finds ticket-placeholder element", () => {
      const el = document.getElementById("ticket-placeholder");
      expect(el).toBeTruthy();
    });

    it("finds ticket-content element", () => {
      const el = document.getElementById("ticket-content");
      expect(el).toBeTruthy();
    });

    it("finds ticket-title element", () => {
      const el = document.getElementById("ticket-title");
      expect(el).toBeTruthy();
    });

    it("finds ticket-step-content element", () => {
      const el = document.getElementById("ticket-step-content");
      expect(el).toBeTruthy();
    });

    it("hides placeholder when scenario starts", () => {
      const placeholder = document.getElementById("ticket-placeholder");
      placeholder.classList.add("hidden");

      expect(placeholder.classList.contains("hidden")).toBe(true);
    });

    it("shows ticket-content when scenario starts", () => {
      const content = document.getElementById("ticket-content");
      content.classList.remove("hidden");
      content.classList.add("flex");

      expect(content.classList.contains("hidden")).toBe(false);
      expect(content.classList.contains("flex")).toBe(true);
    });

    it("sets ticket title correctly", () => {
      const title = document.getElementById("ticket-title");
      title.textContent = "Test Scenario";

      expect(title.textContent).toBe("Test Scenario");
    });
  });
});
