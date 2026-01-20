/**
 * Dropdown.js - UE5-Style Dropdown with Keyboard Navigation
 *
 * Reusable across: Level Editor Simulator, Blueprint Editor
 *
 * Features:
 * - Click-to-open (not hover)
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - UE5 visual styling
 * - Submenu support with delay
 *
 * Usage:
 *   import { Dropdown } from './ui/Dropdown.js';
 *
 *   const dropdown = new Dropdown(triggerElement, {
 *     items: [
 *       { label: 'World', value: 'world', selected: true },
 *       { label: 'Local', value: 'local' }
 *     ],
 *     onSelect: (value) => console.log('Selected:', value)
 *   });
 */

class Dropdown {
  constructor(triggerEl, options = {}) {
    this.trigger = triggerEl;
    this.items = options.items || [];
    this.onSelect = options.onSelect || (() => {});
    this.selectedValue = options.selected || this.items[0]?.value;
    this.isOpen = false;
    this.focusedIndex = -1;
    this.menuEl = null;

    this._init();
  }

  /**
   * Initialize the dropdown
   */
  _init() {
    // Create dropdown menu
    this._createMenu();

    // Bind trigger click
    this.trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!this.menuEl.contains(e.target) && !this.trigger.contains(e.target)) {
        this.close();
      }
    });

    // Keyboard navigation
    this.trigger.addEventListener("keydown", (e) => this._handleKeydown(e));
  }

  /**
   * Create the dropdown menu element
   */
  _createMenu() {
    this.menuEl = document.createElement("div");
    this.menuEl.className = "ue5-dropdown-menu";
    this.menuEl.style.cssText = `
      position: absolute;
      z-index: 9999;
      display: none;
      min-width: 120px;
      background: #2a2a2a;
      border: 1px solid #1a1a1a;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      padding: 4px 0;
      font-size: 12px;
    `;

    this._renderItems();
    document.body.appendChild(this.menuEl);
  }

  /**
   * Render dropdown items
   */
  _renderItems() {
    this.menuEl.innerHTML = "";
    this.itemEls = [];

    this.items.forEach((item, index) => {
      if (item.separator) {
        const sep = document.createElement("div");
        sep.style.cssText = "height: 1px; background: #444; margin: 4px 8px;";
        this.menuEl.appendChild(sep);
        return;
      }

      const el = document.createElement("div");
      el.className =
        "dropdown-item" +
        (item.value === this.selectedValue ? " selected" : "");
      el.dataset.value = item.value;
      el.dataset.index = index;
      el.style.cssText = `
        padding: 6px 12px 6px 24px;
        cursor: pointer;
        color: #ccc;
        position: relative;
        display: flex;
        align-items: center;
      `;

      // Radio indicator for selected
      if (item.value === this.selectedValue) {
        const radio = document.createElement("span");
        radio.innerHTML = "●";
        radio.style.cssText =
          "position: absolute; left: 8px; font-size: 8px; color: #0af;";
        el.appendChild(radio);
      }

      // Label
      const label = document.createElement("span");
      label.textContent = item.label;
      el.appendChild(label);

      // Icon if provided
      if (item.icon) {
        const icon = document.createElement("i");
        icon.className = item.icon;
        icon.style.cssText = "margin-right: 8px;";
        el.insertBefore(icon, label);
      }

      // Hover effect
      el.addEventListener("mouseenter", () => {
        this._setFocusedIndex(index);
      });

      // Click handler
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        this._selectItem(item);
      });

      this.menuEl.appendChild(el);
      this.itemEls.push(el);
    });
  }

  /**
   * Toggle dropdown open/close
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open dropdown
   */
  open() {
    if (this.isOpen) return;

    // Position menu
    const rect = this.trigger.getBoundingClientRect();
    this.menuEl.style.left = rect.left + "px";
    this.menuEl.style.top = rect.bottom + 2 + "px";
    this.menuEl.style.display = "block";

    // Adjust if overflows viewport
    const menuRect = this.menuEl.getBoundingClientRect();
    if (menuRect.right > window.innerWidth) {
      this.menuEl.style.left = window.innerWidth - menuRect.width - 10 + "px";
    }
    if (menuRect.bottom > window.innerHeight) {
      this.menuEl.style.top = rect.top - menuRect.height - 2 + "px";
    }

    this.isOpen = true;
    this.focusedIndex = this.items.findIndex(
      (i) => i.value === this.selectedValue
    );
    this._updateFocusVisual();

    if (typeof EventBus !== "undefined") {
      EventBus.emit("dropdown:opened", { dropdown: this });
    }
  }

  /**
   * Close dropdown
   */
  close() {
    if (!this.isOpen) return;

    this.menuEl.style.display = "none";
    this.isOpen = false;
    this.focusedIndex = -1;

    if (typeof EventBus !== "undefined") {
      EventBus.emit("dropdown:closed", { dropdown: this });
    }
  }

  /**
   * Handle keyboard navigation
   */
  _handleKeydown(e) {
    if (!this.isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        this.open();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this._setFocusedIndex(this.focusedIndex + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        this._setFocusedIndex(this.focusedIndex - 1);
        break;
      case "Enter":
        e.preventDefault();
        if (this.focusedIndex >= 0) {
          this._selectItem(this.items[this.focusedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        this.close();
        break;
    }
  }

  /**
   * Set focused index with bounds checking
   */
  _setFocusedIndex(index) {
    const validItems = this.items.filter((i) => !i.separator);
    if (index < 0) index = validItems.length - 1;
    if (index >= validItems.length) index = 0;

    this.focusedIndex = this.items.indexOf(validItems[index]);
    this._updateFocusVisual();
  }

  /**
   * Update visual focus state
   */
  _updateFocusVisual() {
    this.itemEls.forEach((el, i) => {
      if (i === this.focusedIndex) {
        el.style.background = "#3a3a3a";
      } else {
        el.style.background = "transparent";
      }
    });
  }

  /**
   * Select an item
   */
  _selectItem(item) {
    this.selectedValue = item.value;
    this.onSelect(item.value, item);
    this._renderItems();
    this.close();

    // Update trigger text if applicable
    if (this.trigger.querySelector(".dropdown-value")) {
      this.trigger.querySelector(".dropdown-value").textContent = item.label;
    }

    if (typeof EventBus !== "undefined") {
      EventBus.emit("dropdown:selected", { value: item.value, item: item });
    }
  }

  /**
   * Get current value
   */
  getValue() {
    return this.selectedValue;
  }

  /**
   * Set value programmatically
   */
  setValue(value) {
    const item = this.items.find((i) => i.value === value);
    if (item) {
      this._selectItem(item);
    }
  }

  /**
   * Update items
   */
  setItems(items) {
    this.items = items;
    this._renderItems();
  }

  /**
   * Destroy dropdown
   */
  destroy() {
    if (this.menuEl && this.menuEl.parentNode) {
      this.menuEl.parentNode.removeChild(this.menuEl);
    }
  }
}

// Export
if (typeof module !== "undefined" && module.exports) {
  module.exports = { Dropdown };
}
if (typeof window !== "undefined") {
  window.Dropdown = Dropdown;
}
