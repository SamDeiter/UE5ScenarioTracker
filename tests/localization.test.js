/**
 * Localization Unit Tests
 * Tests for i18n translation system
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

// Sample translations for testing
const TRANSLATIONS = {
  en: {
    "app.title": "UE5 Scenario Tracker",
    "timer.remaining": "Time Remaining",
    "status.completed": "COMPLETED",
    "category.lighting": "Lighting",
  },
  es: {
    "app.title": "Rastreador de Escenarios UE5",
    "timer.remaining": "Tiempo Restante",
    "status.completed": "COMPLETADO",
    "category.lighting": "Iluminación",
  },
  zh: {
    "app.title": "UE5 场景追踪器",
    "timer.remaining": "剩余时间",
  },
};

// Recreate localization logic for testing
let currentLanguage = "en";

function t(key) {
  if (!TRANSLATIONS[currentLanguage]) return key;
  return TRANSLATIONS[currentLanguage][key] || key;
}

function setLanguage(lang, updateFn = () => {}) {
  if (TRANSLATIONS[lang]) {
    currentLanguage = lang;
    localStorage.setItem("ue5_language", lang);
    updateFn();
    document.dispatchEvent(
      new CustomEvent("languageChanged", { detail: { language: lang } }),
    );
    return true;
  }
  return false;
}

function updateStaticTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = t(key);
  });
}

describe("Localization", () => {
  beforeEach(() => {
    currentLanguage = "en";
    localStorage.clear();
  });

  describe("t() translation function", () => {
    it("returns English translation by default", () => {
      expect(t("app.title")).toBe("UE5 Scenario Tracker");
    });

    it("returns correct translation for current language", () => {
      currentLanguage = "es";
      expect(t("app.title")).toBe("Rastreador de Escenarios UE5");
    });

    it("returns key when translation is missing", () => {
      expect(t("nonexistent.key")).toBe("nonexistent.key");
    });

    it("returns key for invalid language", () => {
      currentLanguage = "invalid";
      expect(t("app.title")).toBe("app.title");
    });

    it("handles category keys", () => {
      expect(t("category.lighting")).toBe("Lighting");
      currentLanguage = "es";
      expect(t("category.lighting")).toBe("Iluminación");
    });

    it("falls back to key for partial translations", () => {
      currentLanguage = "zh";
      // zh has app.title but not category.lighting
      expect(t("app.title")).toBe("UE5 场景追踪器");
      expect(t("category.lighting")).toBe("category.lighting");
    });
  });

  describe("setLanguage()", () => {
    it("changes current language to valid language", () => {
      setLanguage("es");
      expect(currentLanguage).toBe("es");
    });

    it("persists language to localStorage", () => {
      setLanguage("zh");
      expect(localStorage.getItem("ue5_language")).toBe("zh");
    });

    it("does not change language for invalid language", () => {
      currentLanguage = "en";
      setLanguage("invalid");
      expect(currentLanguage).toBe("en");
    });

    it("does not update localStorage for invalid language", () => {
      setLanguage("en");
      setLanguage("invalid");
      expect(localStorage.getItem("ue5_language")).toBe("en");
    });

    it("dispatches languageChanged event", () => {
      const eventHandler = vi.fn();
      document.addEventListener("languageChanged", eventHandler);

      setLanguage("es");

      expect(eventHandler).toHaveBeenCalled();
      expect(eventHandler.mock.calls[0][0].detail.language).toBe("es");

      document.removeEventListener("languageChanged", eventHandler);
    });

    it("calls update function when language changes", () => {
      const updateFn = vi.fn();
      setLanguage("es", updateFn);
      expect(updateFn).toHaveBeenCalled();
    });
  });

  describe("updateStaticTranslations()", () => {
    it("updates elements with data-i18n attribute", () => {
      // Create test elements
      const el1 = document.createElement("span");
      el1.setAttribute("data-i18n", "app.title");
      el1.textContent = "placeholder";
      document.body.appendChild(el1);

      const el2 = document.createElement("span");
      el2.setAttribute("data-i18n", "timer.remaining");
      el2.textContent = "placeholder";
      document.body.appendChild(el2);

      updateStaticTranslations();

      expect(el1.textContent).toBe("UE5 Scenario Tracker");
      expect(el2.textContent).toBe("Time Remaining");

      // Cleanup
      document.body.removeChild(el1);
      document.body.removeChild(el2);
    });

    it("updates elements when language changes", () => {
      const el = document.createElement("span");
      el.setAttribute("data-i18n", "status.completed");
      document.body.appendChild(el);

      updateStaticTranslations();
      expect(el.textContent).toBe("COMPLETED");

      currentLanguage = "es";
      updateStaticTranslations();
      expect(el.textContent).toBe("COMPLETADO");

      document.body.removeChild(el);
    });

    it("handles missing keys gracefully", () => {
      const el = document.createElement("span");
      el.setAttribute("data-i18n", "missing.key");
      document.body.appendChild(el);

      updateStaticTranslations();
      expect(el.textContent).toBe("missing.key");

      document.body.removeChild(el);
    });

    it("handles no i18n elements gracefully", () => {
      // Should not throw when no elements have data-i18n
      expect(() => updateStaticTranslations()).not.toThrow();
    });
  });

  describe("language persistence", () => {
    it("reads initial language from localStorage", () => {
      // Simulate reading from localStorage on init
      localStorage.setItem("ue5_language", "es");
      const storedLang = localStorage.getItem("ue5_language") || "en";
      expect(storedLang).toBe("es");
    });

    it("defaults to English when no localStorage value", () => {
      const storedLang = localStorage.getItem("ue5_language") || "en";
      expect(storedLang).toBe("en");
    });
  });

  describe("supported languages", () => {
    it("supports English (en)", () => {
      expect(TRANSLATIONS["en"]).toBeDefined();
    });

    it("supports Spanish (es)", () => {
      expect(TRANSLATIONS["es"]).toBeDefined();
    });

    it("supports Chinese (zh)", () => {
      expect(TRANSLATIONS["zh"]).toBeDefined();
    });
  });
});
