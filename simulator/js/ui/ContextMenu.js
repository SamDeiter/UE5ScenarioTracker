/**
 * ContextMenu.js - Reusable Right-Click Menu System
 *
 * Reusable across: Level Editor Simulator, Blueprint Editor
 *
 * Features:
 * - Dynamic menu items based on context
 * - Keyboard shortcuts display
 * - Hover delay for submenus
 * - Auto-positioning within viewport
 *
 * Usage:
 *   import { ContextMenu } from './ui/ContextMenu.js';
 *
 *   const menu = new ContextMenu();
 *
 *   element.addEventListener('contextmenu', (e) => {
 *     menu.show(e, [
 *       { label: 'Cut', shortcut: 'Ctrl+X', action: () => cut() },
 *       { separator: true },
 *       { label: 'Delete', action: () => delete() }
 *     ]);
 *   });
 */

class ContextMenu {
  constructor(options = {}) {
    this.menuEl = null;
    this.isVisible = false;
    this.submenuDelay = options.submenuDelay || 150;
    this.submenuTimeout = null;

    this._createMenuElement();
    this._setupGlobalListeners();
  }

  /**
   * Create the menu DOM element
   */
  _createMenuElement() {
    this.menuEl = document.createElement("div");
    this.menuEl.className = "ue5-context-menu";
    this.menuEl.style.cssText = `
      position: fixed;
      z-index: 10000;
      display: none;
      min-width: 180px;
      background: #2a2a2a;
      border: 1px solid #1a1a1a;
      border-radius: 2px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      padding: 4px 0;
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 12px;
    `;
    document.body.appendChild(this.menuEl);
  }

  /**
   * Setup click-outside listener
   */
  _setupGlobalListeners() {
    document.addEventListener("click", () => this.hide());
    document.addEventListener("contextmenu", (e) => {
      // Don't auto-close if clicking on menu itself
      if (!this.menuEl.contains(e.target)) {
        this.hide();
      }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (!this.isVisible) return;

      switch (e.key) {
        case "Escape":
          this.hide();
          break;
        case "ArrowDown":
          this._navigateMenu(1);
          e.preventDefault();
          break;
        case "ArrowUp":
          this._navigateMenu(-1);
          e.preventDefault();
          break;
        case "Enter":
          this._selectCurrent();
          e.preventDefault();
          break;
      }
    });
  }

  /**
   * Show context menu at position with items
   * @param {MouseEvent} event - Right-click event
   * @param {Array} items - Menu items
   */
  show(event, items) {
    event.preventDefault();
    event.stopPropagation();

    this._renderItems(items);

    // Position menu
    let x = event.clientX;
    let y = event.clientY;

    this.menuEl.style.display = "block";

    // Adjust for viewport overflow
    const menuRect = this.menuEl.getBoundingClientRect();
    if (x + menuRect.width > window.innerWidth) {
      x = window.innerWidth - menuRect.width - 10;
    }
    if (y + menuRect.height > window.innerHeight) {
      y = window.innerHeight - menuRect.height - 10;
    }

    this.menuEl.style.left = x + "px";
    this.menuEl.style.top = y + "px";
    this.isVisible = true;
    this.focusedIndex = -1;

    if (typeof EventBus !== "undefined") {
      EventBus.emit("contextmenu:shown", { x, y, items });
    }
  }

  /**
   * Hide context menu
   */
  hide() {
    this.menuEl.style.display = "none";
    this.isVisible = false;
    this.focusedIndex = -1;

    if (typeof EventBus !== "undefined") {
      EventBus.emit("contextmenu:hidden");
    }
  }

  /**
   * Render menu items
   */
  _renderItems(items) {
    this.menuEl.innerHTML = "";
    this.menuItems = [];

    for (const item of items) {
      if (item.separator) {
        const sep = document.createElement("div");
        sep.className = "context-menu-separator";
        sep.style.cssText = "height: 1px; background: #444; margin: 4px 8px;";
        this.menuEl.appendChild(sep);
      } else {
        const menuItem = this._createMenuItem(item);
        this.menuEl.appendChild(menuItem);
        this.menuItems.push(menuItem);
      }
    }
  }

  /**
   * Create a single menu item
   */
  _createMenuItem(item) {
    const el = document.createElement("div");
    el.className = "context-menu-item" + (item.disabled ? " disabled" : "");
    el.style.cssText = `
      padding: 6px 20px 6px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: ${item.disabled ? "default" : "pointer"};
      color: ${item.disabled ? "#666" : "#ccc"};
    `;

    // Item label
    const label = document.createElement("span");
    label.textContent = item.label;
    el.appendChild(label);

    // Shortcut
    if (item.shortcut) {
      const shortcut = document.createElement("span");
      shortcut.className = "context-menu-shortcut";
      shortcut.textContent = item.shortcut;
      shortcut.style.cssText =
        "color: #888; font-size: 11px; margin-left: 20px;";
      el.appendChild(shortcut);
    }

    // Icon
    if (item.icon) {
      const icon = document.createElement("i");
      icon.className = item.icon;
      icon.style.cssText = "position: absolute; left: 8px;";
      el.style.position = "relative";
      el.appendChild(icon);
    }

    // Hover effect
    if (!item.disabled) {
      el.addEventListener("mouseenter", () => {
        el.style.background = "#3a3a3a";
      });
      el.addEventListener("mouseleave", () => {
        el.style.background = "transparent";
      });

      // Click handler
      el.addEventListener("click", () => {
        if (item.action) {
          item.action();
        }
        this.hide();
      });
    }

    return el;
  }

  /**
   * Navigate menu with keyboard
   */
  _navigateMenu(direction) {
    const items = this.menuItems.filter(
      (item) => !item.classList.contains("disabled")
    );
    if (items.length === 0) return;

    // Clear previous focus
    items.forEach((item) => (item.style.background = "transparent"));

    // Update focus index
    this.focusedIndex = this.focusedIndex + direction;
    if (this.focusedIndex < 0) this.focusedIndex = items.length - 1;
    if (this.focusedIndex >= items.length) this.focusedIndex = 0;

    // Apply focus
    items[this.focusedIndex].style.background = "#3a3a3a";
  }

  /**
   * Select current focused item
   */
  _selectCurrent() {
    const items = this.menuItems.filter(
      (item) => !item.classList.contains("disabled")
    );
    if (this.focusedIndex >= 0 && this.focusedIndex < items.length) {
      items[this.focusedIndex].click();
    }
  }

  /**
   * Destroy menu and cleanup
   */
  destroy() {
    if (this.menuEl && this.menuEl.parentNode) {
      this.menuEl.parentNode.removeChild(this.menuEl);
    }
  }
}

// Export for ES6 modules and global access
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ContextMenu };
}
if (typeof window !== "undefined") {
  window.ContextMenu = ContextMenu;
}
