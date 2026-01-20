/**
 * DragDropManager.js
 * Handles drag and drop operations for the Outliner tree view
 */

class DragDropManager {
  constructor(options = {}) {
    this.treeSelector = options.treeSelector || "#outliner-tree";
    this.itemSelector = options.itemSelector || ".tree-item";
    this.draggedItem = null;
    this.onReorder = options.onReorder || null;
  }

  /**
   * Initialize drag and drop on all tree items
   */
  init() {
    const treeItems = document.querySelectorAll(
      `${this.treeSelector} ${this.itemSelector}`
    );

    treeItems.forEach((item) => {
      // Make items draggable (except world root)
      if (item.dataset.actorId !== "D1") {
        item.setAttribute("draggable", "true");
      }

      this.bindItemEvents(item);
    });
  }

  /**
   * Bind drag events to a single item
   */
  bindItemEvents(item) {
    item.addEventListener("dragstart", (e) => this.handleDragStart(e));
    item.addEventListener("dragover", (e) => this.handleDragOver(e));
    item.addEventListener("dragleave", (e) => this.handleDragLeave(e));
    item.addEventListener("drop", (e) => this.handleDrop(e));
    item.addEventListener("dragend", (e) => this.handleDragEnd(e));
  }

  handleDragStart(e) {
    const item = e.target.closest(this.itemSelector);
    if (!item) return;

    this.draggedItem = item;
    item.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", item.dataset.actorId);
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    const item = e.target.closest(this.itemSelector);
    if (!item || item === this.draggedItem) return;

    // Clear previous drag-over states
    document
      .querySelectorAll(".drag-over, .drag-over-below, .drag-over-into")
      .forEach((el) => {
        el.classList.remove("drag-over", "drag-over-below", "drag-over-into");
      });

    // Determine drop position based on mouse Y position
    const rect = item.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const isFolder = item.classList.contains("folder");

    if (y < rect.height * 0.3) {
      item.classList.add("drag-over"); // Drop above
    } else if (y > rect.height * 0.7) {
      item.classList.add("drag-over-below"); // Drop below
    } else if (isFolder) {
      item.classList.add("drag-over-into"); // Drop into folder
    } else {
      item.classList.add("drag-over-below");
    }
  }

  handleDragLeave(e) {
    const item = e.target.closest(this.itemSelector);
    if (item) {
      item.classList.remove("drag-over", "drag-over-below", "drag-over-into");
    }
  }

  handleDrop(e) {
    e.preventDefault();

    const targetItem = e.target.closest(this.itemSelector);
    if (!targetItem || !this.draggedItem || targetItem === this.draggedItem)
      return;

    const tree = document.querySelector(this.treeSelector);
    const isAbove = targetItem.classList.contains("drag-over");
    const isInto = targetItem.classList.contains("drag-over-into");

    // Clear states
    targetItem.classList.remove(
      "drag-over",
      "drag-over-below",
      "drag-over-into"
    );

    if (isInto && targetItem.classList.contains("folder")) {
      // Insert as child of folder - update parent and indent
      const folderId = targetItem.dataset.actorId;
      this.draggedItem.dataset.parent = folderId;

      // Update indent class
      const targetIndent = targetItem.className.match(/indent-(\d)/);
      const newIndent = targetIndent ? parseInt(targetIndent[1]) + 1 : 1;
      this.draggedItem.className = this.draggedItem.className.replace(
        /indent-\d/,
        ""
      );
      this.draggedItem.classList.add(`indent-${newIndent}`);

      // Insert after folder
      targetItem.after(this.draggedItem);
    } else if (isAbove) {
      // Insert before target
      tree.insertBefore(this.draggedItem, targetItem);
    } else {
      // Insert after target
      targetItem.after(this.draggedItem);
    }

    console.log(
      `[DragDrop] Moved ${this.draggedItem.dataset.actorId} ${
        isAbove ? "before" : isInto ? "into" : "after"
      } ${targetItem.dataset.actorId}`
    );

    // Notify callback
    if (this.onReorder) {
      this.onReorder({
        moved: this.draggedItem,
        target: targetItem,
        position: isAbove ? "before" : isInto ? "into" : "after",
      });
    }
  }

  handleDragEnd(e) {
    if (this.draggedItem) {
      this.draggedItem.classList.remove("dragging");
      this.draggedItem = null;
    }

    // Clear any remaining drag states
    document
      .querySelectorAll(".drag-over, .drag-over-below, .drag-over-into")
      .forEach((el) => {
        el.classList.remove("drag-over", "drag-over-below", "drag-over-into");
      });
  }
}

// Export for use
window.DragDropManager = DragDropManager;
