/**
 * DragDropManager Unit Tests
 */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// Recreate DragDropManager for testing
class DragDropManager {
  constructor(options = {}) {
    this.treeSelector = options.treeSelector || "#outliner-tree";
    this.itemSelector = options.itemSelector || ".tree-item";
    this.draggedItem = null;
    this.onReorder = options.onReorder || null;
  }

  init() {
    const treeItems = document.querySelectorAll(
      `${this.treeSelector} ${this.itemSelector}`
    );

    treeItems.forEach((item) => {
      if (item.dataset.actorId !== "D1") {
        item.setAttribute("draggable", "true");
      }
      this.bindItemEvents(item);
    });
  }

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

    document
      .querySelectorAll(".drag-over, .drag-over-below, .drag-over-into")
      .forEach((el) => {
        el.classList.remove("drag-over", "drag-over-below", "drag-over-into");
      });

    const rect = item.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const isFolder = item.classList.contains("folder");

    if (y < rect.height * 0.3) {
      item.classList.add("drag-over");
    } else if (y > rect.height * 0.7) {
      item.classList.add("drag-over-below");
    } else if (isFolder) {
      item.classList.add("drag-over-into");
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

    const isAbove = targetItem.classList.contains("drag-over");
    const isInto = targetItem.classList.contains("drag-over-into");

    targetItem.classList.remove(
      "drag-over",
      "drag-over-below",
      "drag-over-into"
    );

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

    document
      .querySelectorAll(".drag-over, .drag-over-below, .drag-over-into")
      .forEach((el) => {
        el.classList.remove("drag-over", "drag-over-below", "drag-over-into");
      });
  }
}

describe("DragDropManager", () => {
  let manager;
  let tree;
  let items;

  function createTreeItem(id, isFolder = false, isRoot = false) {
    const item = document.createElement("div");
    item.className = `tree-item indent-0${isFolder ? " folder" : ""}`;
    item.dataset.actorId = id;
    item.textContent = `Item ${id}`;
    return item;
  }

  function createMockDragEvent(type, targetElement, options = {}) {
    const event = new Event(type, { bubbles: true, cancelable: true });
    event.dataTransfer = {
      effectAllowed: null,
      dropEffect: null,
      setData: vi.fn(),
      getData: vi.fn(),
    };
    event.clientY = options.clientY || 0;
    event.preventDefault = vi.fn();

    // Use Object.defineProperty to set target since it's read-only
    Object.defineProperty(event, "target", {
      value: targetElement,
      writable: false,
    });

    return event;
  }

  beforeEach(() => {
    // Create tree structure
    tree = document.createElement("div");
    tree.id = "outliner-tree";
    document.body.appendChild(tree);

    // Create items
    const item1 = createTreeItem("D1", false, true); // Root
    const folder = createTreeItem("F1", true);
    const item2 = createTreeItem("A1");
    const item3 = createTreeItem("A2");

    tree.appendChild(item1);
    tree.appendChild(folder);
    tree.appendChild(item2);
    tree.appendChild(item3);

    items = {
      root: item1,
      folder: folder,
      item2: item2,
      item3: item3,
    };

    manager = new DragDropManager({
      treeSelector: "#outliner-tree",
      itemSelector: ".tree-item",
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("constructor", () => {
    it("sets default selectors", () => {
      const m = new DragDropManager();
      expect(m.treeSelector).toBe("#outliner-tree");
      expect(m.itemSelector).toBe(".tree-item");
    });

    it("accepts custom selectors", () => {
      const m = new DragDropManager({
        treeSelector: "#custom-tree",
        itemSelector: ".custom-item",
      });
      expect(m.treeSelector).toBe("#custom-tree");
      expect(m.itemSelector).toBe(".custom-item");
    });

    it("accepts onReorder callback", () => {
      const callback = vi.fn();
      const m = new DragDropManager({ onReorder: callback });
      expect(m.onReorder).toBe(callback);
    });

    it("initializes draggedItem as null", () => {
      expect(manager.draggedItem).toBeNull();
    });
  });

  describe("init", () => {
    it("makes non-root items draggable", () => {
      manager.init();
      expect(items.item2.getAttribute("draggable")).toBe("true");
      expect(items.item3.getAttribute("draggable")).toBe("true");
    });

    it("does not make root item draggable", () => {
      manager.init();
      expect(items.root.getAttribute("draggable")).toBeNull();
    });

    it("makes folders draggable", () => {
      manager.init();
      expect(items.folder.getAttribute("draggable")).toBe("true");
    });
  });

  describe("handleDragStart", () => {
    it("sets draggedItem", () => {
      manager.init();
      const event = createMockDragEvent("dragstart", items.item2);

      manager.handleDragStart(event);

      expect(manager.draggedItem).toBe(items.item2);
    });

    it("adds dragging class", () => {
      manager.init();
      const event = createMockDragEvent("dragstart", items.item2);

      manager.handleDragStart(event);

      expect(items.item2.classList.contains("dragging")).toBe(true);
    });

    it("sets dataTransfer properties", () => {
      manager.init();
      const event = createMockDragEvent("dragstart", items.item2);

      manager.handleDragStart(event);

      expect(event.dataTransfer.effectAllowed).toBe("move");
      expect(event.dataTransfer.setData).toHaveBeenCalledWith(
        "text/plain",
        "A1"
      );
    });
  });

  describe("handleDragEnd", () => {
    it("removes dragging class", () => {
      manager.init();

      // Simulate drag start
      const startEvent = createMockDragEvent("dragstart", items.item2);
      manager.handleDragStart(startEvent);

      // Simulate drag end
      const endEvent = createMockDragEvent("dragend", items.item2);
      manager.handleDragEnd(endEvent);

      expect(items.item2.classList.contains("dragging")).toBe(false);
    });

    it("clears draggedItem", () => {
      manager.init();

      // Simulate drag start
      const startEvent = createMockDragEvent("dragstart", items.item2);
      manager.handleDragStart(startEvent);

      // Simulate drag end
      const endEvent = createMockDragEvent("dragend", items.item2);
      manager.handleDragEnd(endEvent);

      expect(manager.draggedItem).toBeNull();
    });

    it("clears drag-over classes from all elements", () => {
      manager.init();
      items.item3.classList.add("drag-over");
      items.folder.classList.add("drag-over-into");

      manager.handleDragEnd(createMockDragEvent("dragend", items.item2));

      expect(items.item3.classList.contains("drag-over")).toBe(false);
      expect(items.folder.classList.contains("drag-over-into")).toBe(false);
    });
  });

  describe("handleDragLeave", () => {
    it("removes drag classes from item", () => {
      manager.init();
      items.item3.classList.add("drag-over");
      items.item3.classList.add("drag-over-below");
      items.item3.classList.add("drag-over-into");

      const event = createMockDragEvent("dragleave", items.item3);
      manager.handleDragLeave(event);

      expect(items.item3.classList.contains("drag-over")).toBe(false);
      expect(items.item3.classList.contains("drag-over-below")).toBe(false);
      expect(items.item3.classList.contains("drag-over-into")).toBe(false);
    });
  });

  describe("handleDrop", () => {
    it("calls onReorder callback with correct data", () => {
      const onReorder = vi.fn();
      manager = new DragDropManager({ onReorder });
      manager.init();

      // Simulate drag start
      const startEvent = createMockDragEvent("dragstart", items.item2);
      manager.handleDragStart(startEvent);

      // Add drag-over class to target
      items.item3.classList.add("drag-over");

      // Simulate drop
      const dropEvent = createMockDragEvent("drop", items.item3);
      manager.handleDrop(dropEvent);

      expect(onReorder).toHaveBeenCalledWith({
        moved: items.item2,
        target: items.item3,
        position: "before",
      });
    });

    it("reports 'after' position correctly", () => {
      const onReorder = vi.fn();
      manager = new DragDropManager({ onReorder });
      manager.init();

      // Simulate drag start
      const startEvent = createMockDragEvent("dragstart", items.item2);
      manager.handleDragStart(startEvent);

      // Add drag-over-below class
      items.item3.classList.add("drag-over-below");

      // Simulate drop
      const dropEvent = createMockDragEvent("drop", items.item3);
      manager.handleDrop(dropEvent);

      expect(onReorder).toHaveBeenCalledWith({
        moved: items.item2,
        target: items.item3,
        position: "after",
      });
    });

    it("reports 'into' position for folders", () => {
      const onReorder = vi.fn();
      manager = new DragDropManager({ onReorder });
      manager.init();

      // Simulate drag start
      const startEvent = createMockDragEvent("dragstart", items.item2);
      manager.handleDragStart(startEvent);

      // Add drag-over-into class
      items.folder.classList.add("drag-over-into");

      // Simulate drop
      const dropEvent = createMockDragEvent("drop", items.folder);
      manager.handleDrop(dropEvent);

      expect(onReorder).toHaveBeenCalledWith({
        moved: items.item2,
        target: items.folder,
        position: "into",
      });
    });

    it("prevents dropping on self", () => {
      const onReorder = vi.fn();
      manager = new DragDropManager({ onReorder });
      manager.init();

      // Simulate drag start
      const startEvent = createMockDragEvent("dragstart", items.item2);
      manager.handleDragStart(startEvent);

      // Add drag-over class to same item
      items.item2.classList.add("drag-over");

      // Simulate drop on self
      const dropEvent = createMockDragEvent("drop", items.item2);
      manager.handleDrop(dropEvent);

      expect(onReorder).not.toHaveBeenCalled();
    });

    it("clears drag classes after drop", () => {
      manager.init();

      // Simulate drag start
      const startEvent = createMockDragEvent("dragstart", items.item2);
      manager.handleDragStart(startEvent);

      // Add classes
      items.item3.classList.add("drag-over");
      items.item3.classList.add("drag-over-below");
      items.item3.classList.add("drag-over-into");

      // Simulate drop
      const dropEvent = createMockDragEvent("drop", items.item3);
      manager.handleDrop(dropEvent);

      expect(items.item3.classList.contains("drag-over")).toBe(false);
      expect(items.item3.classList.contains("drag-over-below")).toBe(false);
      expect(items.item3.classList.contains("drag-over-into")).toBe(false);
    });
  });
});
