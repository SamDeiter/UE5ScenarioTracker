/**
 * DockingManager.js - Professional Tab-based Docking System
 * Manages the transfer of tabs between different UI panels.
 */
class DockingManager {
  constructor() {
    this.managers = new Map();
    this.activeDrag = null;
    this._init();
  }

  _init() {
    this._setupGlobalListeners();
  }

  _setupGlobalListeners() {
    // Prevent default dragover to allow drop
    document.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
  }

  /**
   * Register a TabManager instance with the docking system
   */
  registerManager(tabManager) {
    if (!tabManager.container.id) {
      tabManager.container.id =
        "dock-slot-" + Math.random().toString(36).substr(2, 9);
    }
    this.managers.set(tabManager.container.id, tabManager);

    // Add drop listeners to the manager's container
    const container = tabManager.container;
    container.addEventListener("dragover", (e) =>
      this._onDragOver(e, tabManager)
    );
    container.addEventListener("dragleave", (e) =>
      this._onDragLeave(e, tabManager)
    );
    container.addEventListener("drop", (e) => this._onDrop(e, tabManager));
  }

  /**
   * Called by TabManager when a tab drag starts
   */
  onTabDragStart(sourceManager, tabId) {
    const tabData = sourceManager.getTab(tabId);
    this.activeDrag = { sourceManager, tabData };
    console.log(`[Docking] Drag started: ${tabId}`);
  }

  /**
   * Called by TabManager when a tab drag ends
   */
  onTabDragEnd() {
    // Clear highlights
    this.managers.forEach((m) =>
      m.container.classList.remove("docking-drop-target")
    );
    this.activeDrag = null;
  }

  _onDragOver(e, targetManager) {
    if (!this.activeDrag) return;

    // Prevent drop on self source container (optional, UE allows reordering)
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    targetManager.container.classList.add("docking-drop-target");
  }

  _onDragLeave(e, targetManager) {
    targetManager.container.classList.remove("docking-drop-target");
  }

  _onDrop(e, targetManager) {
    e.preventDefault();
    if (!this.activeDrag) return;

    const { sourceManager, tabData } = this.activeDrag;

    // If dropping into a different manager
    if (sourceManager !== targetManager) {
      console.log(
        `[Docking] Moving tab ${tabData.id} to ${targetManager.container.id}`
      );

      // 1. Extraction: Remove from source and get config + DOM element
      const tabConfig = sourceManager.removeTab(tabData.id);

      // 2. Addition: Add to target (will reuse the same DOM element)
      if (tabConfig) {
        targetManager.addTab(tabConfig);
        targetManager.setActiveTab(tabData.id);
        this._saveLayout();
      }
    }

    this.onTabDragEnd();
  }

  _saveLayout() {
    const layout = [];
    this.managers.forEach((manager, id) => {
      layout.push({
        slotId: id,
        tabs: manager.tabs.map((t) => t.id),
      });
    });
    localStorage.setItem("ue5_sim_docking_layout", JSON.stringify(layout));
  }
}

// Global instance
if (typeof window !== "undefined") {
  window.DockingManager = new DockingManager();
}
