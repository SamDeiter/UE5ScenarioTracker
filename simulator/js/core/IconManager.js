/**
 * IconManager.js - Spec-Driven Icon Resolution
 * Ensures 1:1 parity with UE5 physical assets based on ue_ui_runtime_spec.json
 */

class UE5IconManager {
  constructor() {
    this.spec = null;
  }

  async init() {
    try {
      // Try relative path first
      const response = await fetch("data/ue_ui_runtime_spec.json");
      this.spec = await response.json();
      console.log("[IconManager] UI Spec loaded successfully");
    } catch (err) {
      console.warn(
        "[IconManager] Fetch failed (possibly file://). Using local fallback or empty spec."
      );
      // We could inject a fallback here if needed, but for now we'll just log and continue
      this.spec = {
        icons: {
          Save: "icons/ue5/icon_tab_SaveLayout_40x.png",
          SelectionMode: "icons/ue5/icon_tab_SelectionDetails_40x.png",
          Blueprint: "icons/ue5/icon_tab_BlueprintDebugger_40x.png",
          Cinematics: "icons/ue5/icon_tab_Cinematics_16x.png",
          Play: "icons/ue5/icon_play_40x.png",
          Stop: "icons/ue5/icon_stop_40x.png",
          Platforms: "icons/ue5/icon_tab_BuildSubmit_40x.png",
          Settings: "icons/ue5/icon_tab_Toolbars_40x.png",
        },
      };
    }
  }

  /**
   * Get the relative path for a logical icon name
   */
  getIconPath(iconKey) {
    if (!this.spec || !this.spec.icons) return "";

    // Handle aliases or slight naming variations
    let key = iconKey;
    if (key === "SaveLayout") key = "Save";
    if (key === "SelectionDetails") key = "SelectionMode";
    if (key === "BlueprintDebugger") key = "Blueprint";

    const path = this.spec.icons[key];
    if (!path) {
      console.warn(`[IconManager] No icon found for key: ${key}`);
      return "";
    }
    // Use purely relative paths to support file://
    return path;
  }
}

// Global instance for simple access
window.IconManager = new UE5IconManager();
