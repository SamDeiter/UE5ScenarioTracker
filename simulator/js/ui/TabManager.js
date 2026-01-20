/**
 * TabManager.js - Dockable Tab System
 *
 * Reusable across: Level Editor Simulator, Blueprint Editor
 *
 * Features:
 * - Tab creation/removal
 * - Tab switching with content panels
 * - Drag to reorder tabs
 * - Close button on tabs
 * - Tab overflow dropdown
 *
 * Usage:
 *   import { TabManager } from './ui/TabManager.js';
 *
 *   const tabs = new TabManager(containerEl, {
 *     onTabChange: (tabId) => console.log('Active tab:', tabId),
 *     closeable: true
 *   });
 *
 *   tabs.addTab({ id: 'details', label: 'Details', icon: 'fa-info' });
 *   tabs.addTab({ id: 'world', label: 'World Settings' });
 */

class TabManager {
  constructor(container, options = {}) {
    this.container = container;
    this.tabs = [];
    this.activeTabId = null;
    this.closeable = options.closeable !== false;
    this.onTabChange = options.onTabChange || (() => {});
    this.onTabClose = options.onTabClose || (() => {});

    this._init();
  }

  /**
   * Initialize the tab manager
   */
  _init() {
    // Create tab bar
    this.tabBar = document.createElement("div");
    this.tabBar.className = "ue5-tab-bar";
    this.tabBar.style.cssText = `
      display: flex;
      background: #1a1a1a;
      border-bottom: 1px solid #333;
      height: 28px;
      overflow-x: auto;
      overflow-y: hidden;
    `;

    // Create content container
    this.contentContainer = document.createElement("div");
    this.contentContainer.className = "ue5-tab-content";
    this.contentContainer.style.cssText = `
      flex: 1;
      overflow: auto;
    `;

    this.container.appendChild(this.tabBar);
    this.container.appendChild(this.contentContainer);

    // Keyboard navigation
    this.tabBar.addEventListener("keydown", (e) => this._handleKeydown(e));
  }

  /**
   * Add a new tab
   */
  addTab(config) {
    const { id, label, icon, content, closeable } = config;

    // Check if tab already exists
    if (this.tabs.find((t) => t.id === id)) {
      this.setActiveTab(id);
      return;
    }

    // Create tab element
    const tabEl = document.createElement("div");
    tabEl.className = "ue5-tab";
    tabEl.dataset.tabId = id;
    tabEl.tabIndex = 0;
    tabEl.style.cssText = `
      display: flex;
      align-items: center;
      padding: 0 12px;
      height: 100%;
      cursor: pointer;
      color: #888;
      font-size: 12px;
      border-right: 1px solid #333;
      white-space: nowrap;
      user-select: none;
    `;

    // Icon
    if (icon) {
      const iconEl = document.createElement("i");
      iconEl.className = "fas " + icon;
      iconEl.style.marginRight = "6px";
      tabEl.appendChild(iconEl);
    }

    // Label
    const labelEl = document.createElement("span");
    labelEl.textContent = label;
    tabEl.appendChild(labelEl);

    // Draggable behavior
    tabEl.setAttribute("draggable", "true");
    tabEl.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("application/ue5-tab-id", id);
      e.dataTransfer.setData(
        "application/ue5-origin-manager",
        this.container.id
      );
      tabEl.classList.add("dragging");

      if (typeof window.DockingManager !== "undefined") {
        window.DockingManager.onTabDragStart(this, id);
      }
    });

    tabEl.addEventListener("dragend", () => {
      tabEl.classList.remove("dragging");
      if (typeof window.DockingManager !== "undefined") {
        window.DockingManager.onTabDragEnd();
      }
    });

    // Close button
    if (closeable !== false && this.closeable) {
      const closeBtn = document.createElement("span");
      closeBtn.className = "tab-close";
      closeBtn.innerHTML = "×";
      closeBtn.style.cssText = `
        margin-left: 8px;
        font-size: 14px;
        opacity: 0.5;
        line-height: 1;
      `;
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.closeTab(id);
      });
      closeBtn.addEventListener(
        "mouseenter",
        () => (closeBtn.style.opacity = "1")
      );
      closeBtn.addEventListener(
        "mouseleave",
        () => (closeBtn.style.opacity = "0.5")
      );
      tabEl.appendChild(closeBtn);
    }

    // Click handler
    tabEl.addEventListener("click", () => this.setActiveTab(id));

    // Hover effect
    tabEl.addEventListener("mouseenter", () => {
      if (this.activeTabId !== id) {
        tabEl.style.background = "#2a2a2a";
      }
    });
    tabEl.addEventListener("mouseleave", () => {
      if (this.activeTabId !== id) {
        tabEl.style.background = "transparent";
      }
    });

    // Create content panel - UE5 FIX: Prevent redundant nesting
    let contentEl;
    if (
      content instanceof HTMLElement &&
      content.classList.contains("tab-panel")
    ) {
      contentEl = content;
      // Ensure dataset.tabId is updated to the new id if it was transferred
      contentEl.dataset.tabId = id;
    } else {
      contentEl = document.createElement("div");
      contentEl.className = "tab-panel";
      contentEl.dataset.tabId = id;

      if (content) {
        if (typeof content === "string") {
          contentEl.innerHTML = content;
        } else {
          contentEl.appendChild(content);
        }
      }
    }
    contentEl.style.display = "none";

    // Add to DOM
    this.tabBar.appendChild(tabEl);
    this.contentContainer.appendChild(contentEl);

    // Track tab
    this.tabs.push({
      id,
      label,
      icon,
      tabEl,
      contentEl,
      closeable: closeable !== false,
    });

    // Activate if first tab
    if (this.tabs.length === 1) {
      this.setActiveTab(id);
    }

    if (typeof EventBus !== "undefined") {
      EventBus.emit("tab:added", { id, label });
    }

    return contentEl;
  }

  /**
   * Set active tab by ID
   */
  setActiveTab(tabId) {
    const tab = this.tabs.find((t) => t.id === tabId);
    if (!tab) return;

    // Deactivate all tabs
    this.tabs.forEach((t) => {
      t.tabEl.style.background = "transparent";
      t.tabEl.style.color = "#888";
      t.tabEl.style.borderBottom = "none";
      t.contentEl.style.display = "none";
    });

    // Activate selected tab
    tab.tabEl.style.background = "#2a2a2a";
    tab.tabEl.style.color = "#fff";
    tab.tabEl.style.borderBottom = "2px solid #0af";
    tab.contentEl.style.display = "block";

    this.activeTabId = tabId;
    this.onTabChange(tabId, tab);

    if (typeof EventBus !== "undefined") {
      EventBus.emit("tab:changed", { id: tabId });
    }
  }

  /**
   * Close a tab
   */
  closeTab(tabId) {
    const index = this.tabs.findIndex((t) => t.id === tabId);
    if (index === -1) return;

    const tab = this.tabs[index];

    // Don't close if it's the only tab and closeable
    if (this.tabs.length === 1) return;

    // Remove from DOM
    tab.tabEl.parentNode.removeChild(tab.tabEl);
    tab.contentEl.parentNode.removeChild(tab.contentEl);

    // Remove from array
    this.tabs.splice(index, 1);

    // Activate adjacent tab if this was active
    if (this.activeTabId === tabId) {
      const newIndex = Math.min(index, this.tabs.length - 1);
      if (this.tabs[newIndex]) {
        this.setActiveTab(this.tabs[newIndex].id);
      }
    }

    this.onTabClose(tabId, tab);

    if (typeof EventBus !== "undefined") {
      EventBus.emit("tab:closed", { id: tabId });
    }
  }

  /**
   * Remove a tab from this manager and return its configuration and content element.
   * Useful for transferring tabs between managers without destroying state.
   */
  removeTab(tabId) {
    const index = this.tabs.findIndex((t) => t.id === tabId);
    if (index === -1) return null;

    const tab = this.tabs[index];

    // Remove from DOM but don't destroy content
    if (tab.tabEl.parentNode) tab.tabEl.parentNode.removeChild(tab.tabEl);
    if (tab.contentEl.parentNode)
      tab.contentEl.parentNode.removeChild(tab.contentEl);

    // Remove from array
    this.tabs.splice(index, 1);

    // Update active state if needed
    if (this.activeTabId === tabId) {
      if (this.tabs.length > 0) {
        this.setActiveTab(this.tabs[0].id);
      } else {
        this.activeTabId = null;
      }
    }

    return {
      id: tab.id,
      label: tab.label,
      icon: tab.icon,
      content: tab.contentEl,
      closeable: tab.closeable,
    };
  }

  /**
   * Get tab data by ID
   */
  getTab(tabId) {
    return this.tabs.find((t) => t.id === tabId);
  }

  /**
   * Get active tab ID
   */
  getActiveTabId() {
    return this.activeTabId;
  }

  /**
   * Get tab content element
   */
  getTabContent(tabId) {
    const tab = this.tabs.find((t) => t.id === tabId);
    return tab ? tab.contentEl : null;
  }

  /**
   * Update tab label
   */
  setTabLabel(tabId, label) {
    const tab = this.tabs.find((t) => t.id === tabId);
    if (tab) {
      tab.label = label;
      const labelEl = tab.tabEl.querySelector("span");
      if (labelEl) {
        labelEl.textContent = label;
      }
    }
  }

  /**
   * Handle keyboard navigation
   */
  _handleKeydown(e) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const currentIndex = this.tabs.findIndex(
        (t) => t.id === this.activeTabId
      );
      const direction = e.key === "ArrowRight" ? 1 : -1;
      let newIndex = currentIndex + direction;

      if (newIndex < 0) newIndex = this.tabs.length - 1;
      if (newIndex >= this.tabs.length) newIndex = 0;

      this.setActiveTab(this.tabs[newIndex].id);
      e.preventDefault();
    }
  }

  /**
   * Get all tabs
   */
  getTabs() {
    return this.tabs.map((t) => ({ id: t.id, label: t.label }));
  }

  /**
   * Destroy tab manager
   */
  destroy() {
    this.tabBar.innerHTML = "";
    this.contentContainer.innerHTML = "";
    this.tabs = [];
  }
}

// Export
if (typeof module !== "undefined" && module.exports) {
  module.exports = { TabManager };
}
if (typeof window !== "undefined") {
  window.TabManager = TabManager;
}
