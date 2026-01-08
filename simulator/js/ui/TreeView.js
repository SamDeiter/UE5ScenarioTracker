/**
 * TreeView.js - Hierarchical Tree Component
 *
 * Reusable across: Level Editor Outliner, Blueprint Editor Components Panel
 *
 * Features:
 * - Expand/collapse with icons
 * - Single and multi-select (Shift/Ctrl)
 * - Drag-drop reordering
 * - Search/filter
 * - Custom icons per item type
 *
 * Usage:
 *   import { TreeView } from './ui/TreeView.js';
 *
 *   const tree = new TreeView(containerEl, {
 *     onSelect: (item) => console.log('Selected:', item.name),
 *     onContextMenu: (item, event) => showMenu(event)
 *   });
 *
 *   tree.setItems([
 *     { id: '1', name: 'DirectionalLight', type: 'Light', icon: 'LightActor_16x.png' },
 *     { id: '2', name: 'SkyLight', type: 'Light', icon: 'LightActor_16x.png' }
 *   ]);
 */

class TreeView {
  constructor(container, options = {}) {
    this.container = container;
    this.items = [];
    this.selectedItems = new Set();
    this.expandedItems = new Set();
    this.lastSelectedIndex = -1;

    // Callbacks
    this.onSelect = options.onSelect || (() => {});
    this.onMultiSelect = options.onMultiSelect || (() => {});
    this.onContextMenu = options.onContextMenu || (() => {});
    this.onDoubleClick = options.onDoubleClick || (() => {});
    this.onDragDrop = options.onDragDrop || (() => {});

    // Options
    this.allowMultiSelect = options.allowMultiSelect !== false;
    this.allowDragDrop = options.allowDragDrop || false;
    this.iconBasePath = options.iconBasePath || "icons/";

    this._setupContainer();
  }

  /**
   * Setup container styles
   */
  _setupContainer() {
    this.container.classList.add("ue5-tree-view");
    this.container.style.cssText = `
      overflow-y: auto;
      overflow-x: hidden;
      user-select: none;
    `;

    // Keyboard navigation
    this.container.tabIndex = 0;
    this.container.addEventListener("keydown", (e) => this._handleKeyboard(e));
  }

  /**
   * Set tree items
   * @param {Array} items - Array of { id, name, type, icon, children?, parent? }
   */
  setItems(items) {
    this.items = items;
    this._render();
  }

  /**
   * Render the tree
   */
  _render() {
    this.container.innerHTML = "";

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const itemEl = this._createItemElement(item, i, 0);
      this.container.appendChild(itemEl);
    }
  }

  /**
   * Create a tree item element
   */
  _createItemElement(item, index, depth) {
    const wrapper = document.createElement("div");
    wrapper.className = "tree-item-wrapper";
    wrapper.dataset.id = item.id;
    wrapper.dataset.index = index;

    const row = document.createElement("div");
    row.className =
      "tree-item" + (this.selectedItems.has(item.id) ? " selected" : "");
    row.style.cssText = `
      display: flex;
      align-items: center;
      padding: 3px 8px;
      padding-left: ${8 + depth * 16}px;
      cursor: pointer;
      color: #ccc;
      font-size: 12px;
    `;

    // Expand/collapse arrow (if has children)
    if (item.children && item.children.length > 0) {
      const arrow = document.createElement("span");
      arrow.className = "tree-expand";
      arrow.innerHTML = this.expandedItems.has(item.id) ? "▼" : "▶";
      arrow.style.cssText =
        "font-size: 8px; width: 16px; text-align: center; color: #888;";
      arrow.addEventListener("click", (e) => {
        e.stopPropagation();
        this._toggleExpand(item.id);
      });
      row.appendChild(arrow);
    } else {
      const spacer = document.createElement("span");
      spacer.style.width = "16px";
      row.appendChild(spacer);
    }

    // Icon
    if (item.icon) {
      const icon = document.createElement("img");
      icon.src = this.iconBasePath + item.icon;
      icon.style.cssText = "width: 16px; height: 16px; margin-right: 6px;";
      icon.onerror = () => {
        icon.style.display = "none";
      };
      row.appendChild(icon);
    }

    // Name
    const name = document.createElement("span");
    name.className = "tree-item-name";
    name.textContent = item.name;
    name.style.cssText =
      "flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
    row.appendChild(name);

    // Type badge
    if (item.type) {
      const type = document.createElement("span");
      type.className = "tree-item-type";
      type.textContent = item.type;
      type.style.cssText = "font-size: 10px; color: #666; margin-left: 8px;";
      row.appendChild(type);
    }

    // Event handlers
    row.addEventListener("click", (e) => this._handleClick(item, index, e));
    row.addEventListener("dblclick", (e) => this._handleDoubleClick(item, e));
    row.addEventListener("contextmenu", (e) =>
      this._handleContextMenu(item, e)
    );

    // Hover effect
    row.addEventListener("mouseenter", () => {
      if (!this.selectedItems.has(item.id)) {
        row.style.background = "#2a2a2a";
      }
    });
    row.addEventListener("mouseleave", () => {
      if (!this.selectedItems.has(item.id)) {
        row.style.background = "transparent";
      }
    });

    // Drag and drop
    if (this.allowDragDrop) {
      row.draggable = true;
      row.addEventListener("dragstart", (e) => this._handleDragStart(item, e));
      row.addEventListener("dragover", (e) => this._handleDragOver(item, e));
      row.addEventListener("drop", (e) => this._handleDrop(item, e));
    }

    wrapper.appendChild(row);

    // Render children if expanded
    if (item.children && this.expandedItems.has(item.id)) {
      const childContainer = document.createElement("div");
      childContainer.className = "tree-children";

      for (let i = 0; i < item.children.length; i++) {
        const childEl = this._createItemElement(item.children[i], i, depth + 1);
        childContainer.appendChild(childEl);
      }

      wrapper.appendChild(childContainer);
    }

    return wrapper;
  }

  /**
   * Handle item click
   */
  _handleClick(item, index, event) {
    if (this.allowMultiSelect && event.ctrlKey) {
      // Toggle selection
      if (this.selectedItems.has(item.id)) {
        this.selectedItems.delete(item.id);
      } else {
        this.selectedItems.add(item.id);
      }
    } else if (
      this.allowMultiSelect &&
      event.shiftKey &&
      this.lastSelectedIndex >= 0
    ) {
      // Range selection
      const start = Math.min(this.lastSelectedIndex, index);
      const end = Math.max(this.lastSelectedIndex, index);

      for (let i = start; i <= end; i++) {
        this.selectedItems.add(this.items[i].id);
      }
    } else {
      // Single selection
      this.selectedItems.clear();
      this.selectedItems.add(item.id);
    }

    this.lastSelectedIndex = index;
    this._updateSelection();

    // Callbacks
    if (this.selectedItems.size === 1) {
      this.onSelect(item);

      if (typeof EventBus !== "undefined") {
        EventBus.emit("treeview:select", { item });
      }
    } else {
      const selectedItems = this.items.filter((i) =>
        this.selectedItems.has(i.id)
      );
      this.onMultiSelect(selectedItems);

      if (typeof EventBus !== "undefined") {
        EventBus.emit("treeview:multiselect", { items: selectedItems });
      }
    }
  }

  /**
   * Handle double-click
   */
  _handleDoubleClick(item, event) {
    this.onDoubleClick(item);

    if (typeof EventBus !== "undefined") {
      EventBus.emit("treeview:dblclick", { item });
    }
  }

  /**
   * Handle context menu
   */
  _handleContextMenu(item, event) {
    event.preventDefault();

    // Select item if not already selected
    if (!this.selectedItems.has(item.id)) {
      this.selectedItems.clear();
      this.selectedItems.add(item.id);
      this._updateSelection();
    }

    this.onContextMenu(item, event);

    if (typeof EventBus !== "undefined") {
      EventBus.emit("treeview:contextmenu", { item, event });
    }
  }

  /**
   * Toggle expand/collapse
   */
  _toggleExpand(itemId) {
    if (this.expandedItems.has(itemId)) {
      this.expandedItems.delete(itemId);
    } else {
      this.expandedItems.add(itemId);
    }
    this._render();
  }

  /**
   * Update visual selection state
   */
  _updateSelection() {
    const items = this.container.querySelectorAll(".tree-item");
    items.forEach((item) => {
      const id = item.parentElement.dataset.id;
      if (this.selectedItems.has(id)) {
        item.style.background = "#0078d4";
        item.classList.add("selected");
      } else {
        item.style.background = "transparent";
        item.classList.remove("selected");
      }
    });
  }

  /**
   * Handle keyboard navigation
   */
  _handleKeyboard(event) {
    switch (event.key) {
      case "ArrowDown":
        this._navigateVertical(1);
        event.preventDefault();
        break;
      case "ArrowUp":
        this._navigateVertical(-1);
        event.preventDefault();
        break;
      case "ArrowRight":
        // Expand or move to child
        break;
      case "ArrowLeft":
        // Collapse or move to parent
        break;
      case "Delete":
        if (typeof EventBus !== "undefined") {
          EventBus.emit("treeview:delete", {
            items: Array.from(this.selectedItems),
          });
        }
        break;
      case "F2":
        // Rename
        if (typeof EventBus !== "undefined") {
          const selected = this.items.find((i) => this.selectedItems.has(i.id));
          if (selected) {
            EventBus.emit("treeview:rename", { item: selected });
          }
        }
        break;
    }
  }

  /**
   * Navigate up/down with keyboard
   */
  _navigateVertical(direction) {
    if (this.items.length === 0) return;

    let currentIndex = this.lastSelectedIndex;
    if (currentIndex < 0) currentIndex = 0;

    const newIndex = Math.max(
      0,
      Math.min(this.items.length - 1, currentIndex + direction)
    );

    this.selectedItems.clear();
    this.selectedItems.add(this.items[newIndex].id);
    this.lastSelectedIndex = newIndex;
    this._updateSelection();
    this.onSelect(this.items[newIndex]);
  }

  /**
   * Select item by ID
   */
  selectItem(itemId) {
    this.selectedItems.clear();
    this.selectedItems.add(itemId);

    const index = this.items.findIndex((i) => i.id === itemId);
    if (index >= 0) {
      this.lastSelectedIndex = index;
      this._updateSelection();
      this.onSelect(this.items[index]);
    }
  }

  /**
   * Get selected items
   */
  getSelectedItems() {
    return this.items.filter((i) => this.selectedItems.has(i.id));
  }

  /**
   * Filter items by search term
   */
  filter(searchTerm) {
    if (!searchTerm) {
      this._render();
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = this.items.filter((item) =>
      item.name.toLowerCase().includes(term)
    );

    this.container.innerHTML = "";
    for (let i = 0; i < filtered.length; i++) {
      const itemEl = this._createItemElement(filtered[i], i, 0);
      this.container.appendChild(itemEl);
    }
  }

  // Drag-drop handlers (stubs for now)
  _handleDragStart(item, event) {
    event.dataTransfer.setData("text/plain", item.id);
  }

  _handleDragOver(item, event) {
    event.preventDefault();
  }

  _handleDrop(item, event) {
    event.preventDefault();
    const sourceId = event.dataTransfer.getData("text/plain");
    this.onDragDrop(sourceId, item.id);
  }
}

// Export for ES6 modules and global access
if (typeof module !== "undefined" && module.exports) {
  module.exports = { TreeView };
}
if (typeof window !== "undefined") {
  window.TreeView = TreeView;
}
