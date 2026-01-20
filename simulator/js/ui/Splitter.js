/**
 * Splitter.js - Resizable Panel Dividers
 *
 * Reusable across: Level Editor Simulator, Blueprint Editor
 *
 * Features:
 * - Horizontal and vertical splitters
 * - Min/max size constraints
 * - Double-click to reset to default
 * - State persistence to localStorage
 *
 * Usage:
 *   import { Splitter } from './ui/Splitter.js';
 *
 *   const splitter = new Splitter({
 *     container: document.getElementById('main-container'),
 *     leftPanel: document.getElementById('outliner'),
 *     rightPanel: document.getElementById('viewport'),
 *     direction: 'vertical', // or 'horizontal'
 *     minSize: 200,
 *     maxSize: 500,
 *     defaultSize: 280
 *   });
 */

class Splitter {
  constructor(options = {}) {
    this.container = options.container;
    this.leftPanel = options.leftPanel || options.topPanel;
    this.rightPanel = options.rightPanel || options.bottomPanel;
    this.direction = options.direction || "vertical"; // 'vertical' = left/right, 'horizontal' = top/bottom
    this.minSize = options.minSize || 100;
    this.maxSize = options.maxSize || 600;
    this.defaultSize = options.defaultSize || 280;
    this.storageKey = options.storageKey || null;
    this.onResize = options.onResize || (() => {});

    this.isDragging = false;
    this.startPos = 0;
    this.startSize = 0;
    this.currentSize = this.defaultSize;

    this.splitterEl = null;

    this._init();
  }

  /**
   * Initialize the splitter
   */
  _init() {
    // Load saved size
    if (this.storageKey) {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.currentSize = parseInt(saved, 10);
      }
    }

    // Create splitter element
    this._createSplitter();

    // Apply initial size
    this._applySize(this.currentSize);

    // Bind events
    this._bindEvents();
  }

  /**
   * Create the splitter DOM element
   */
  _createSplitter() {
    this.splitterEl = document.createElement("div");
    this.splitterEl.className = "ue5-splitter " + this.direction;

    if (this.direction === "vertical") {
      this.splitterEl.style.cssText = `
        width: 4px;
        cursor: col-resize;
        background: #1a1a1a;
        position: relative;
        flex-shrink: 0;
      `;
    } else {
      this.splitterEl.style.cssText = `
        height: 4px;
        cursor: row-resize;
        background: #1a1a1a;
        position: relative;
        flex-shrink: 0;
      `;
    }

    // Insert between panels
    if (this.leftPanel && this.leftPanel.nextSibling) {
      this.leftPanel.parentNode.insertBefore(
        this.splitterEl,
        this.leftPanel.nextSibling
      );
    }
  }

  /**
   * Bind mouse/touch events
   */
  _bindEvents() {
    // Mouse events
    this.splitterEl.addEventListener("mousedown", (e) => this._startDrag(e));
    document.addEventListener("mousemove", (e) => this._onDrag(e));
    document.addEventListener("mouseup", () => this._endDrag());

    // Touch events
    this.splitterEl.addEventListener("touchstart", (e) =>
      this._startDrag(e.touches[0])
    );
    document.addEventListener("touchmove", (e) => this._onDrag(e.touches[0]));
    document.addEventListener("touchend", () => this._endDrag());

    // Double-click to reset
    this.splitterEl.addEventListener("dblclick", () => this.reset());

    // Hover effect
    this.splitterEl.addEventListener("mouseenter", () => {
      this.splitterEl.style.background = "#0af";
    });
    this.splitterEl.addEventListener("mouseleave", () => {
      if (!this.isDragging) {
        this.splitterEl.style.background = "#1a1a1a";
      }
    });
  }

  /**
   * Start drag operation
   */
  _startDrag(e) {
    this.isDragging = true;
    this.splitterEl.style.background = "#0af";

    if (this.direction === "vertical") {
      this.startPos = e.clientX;
      this.startSize = this.leftPanel.offsetWidth;
    } else {
      this.startPos = e.clientY;
      this.startSize = this.leftPanel.offsetHeight;
    }

    // Prevent text selection during drag
    document.body.style.userSelect = "none";
    document.body.style.cursor =
      this.direction === "vertical" ? "col-resize" : "row-resize";

    if (typeof EventBus !== "undefined") {
      EventBus.emit("splitter:dragstart", { splitter: this });
    }
  }

  /**
   * Handle drag movement
   */
  _onDrag(e) {
    if (!this.isDragging) return;

    let delta, newSize;

    if (this.direction === "vertical") {
      delta = e.clientX - this.startPos;
      newSize = this.startSize + delta;
    } else {
      delta = e.clientY - this.startPos;
      newSize = this.startSize + delta;
    }

    // Apply constraints
    newSize = Math.max(this.minSize, Math.min(this.maxSize, newSize));

    this._applySize(newSize);
    this.currentSize = newSize;
  }

  /**
   * End drag operation
   */
  _endDrag() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.splitterEl.style.background = "#1a1a1a";
    document.body.style.userSelect = "";
    document.body.style.cursor = "";

    // Save size
    if (this.storageKey) {
      localStorage.setItem(this.storageKey, String(this.currentSize));
    }

    this.onResize(this.currentSize);

    if (typeof EventBus !== "undefined") {
      EventBus.emit("splitter:dragend", {
        splitter: this,
        size: this.currentSize,
      });
    }
  }

  /**
   * Apply size to panel
   */
  _applySize(size) {
    if (this.direction === "vertical") {
      this.leftPanel.style.width = size + "px";
      this.leftPanel.style.flexBasis = size + "px";
      this.leftPanel.style.flexGrow = "0";
      this.leftPanel.style.flexShrink = "0";
    } else {
      this.leftPanel.style.height = size + "px";
      this.leftPanel.style.flexBasis = size + "px";
      this.leftPanel.style.flexGrow = "0";
      this.leftPanel.style.flexShrink = "0";
    }
  }

  /**
   * Reset to default size
   */
  reset() {
    this.currentSize = this.defaultSize;
    this._applySize(this.defaultSize);

    if (this.storageKey) {
      localStorage.setItem(this.storageKey, String(this.defaultSize));
    }

    this.onResize(this.defaultSize);

    if (typeof EventBus !== "undefined") {
      EventBus.emit("splitter:reset", {
        splitter: this,
        size: this.defaultSize,
      });
    }
  }

  /**
   * Get current size
   */
  getSize() {
    return this.currentSize;
  }

  /**
   * Set size programmatically
   */
  setSize(size) {
    size = Math.max(this.minSize, Math.min(this.maxSize, size));
    this.currentSize = size;
    this._applySize(size);

    if (this.storageKey) {
      localStorage.setItem(this.storageKey, String(size));
    }
  }

  /**
   * Destroy splitter
   */
  destroy() {
    if (this.splitterEl && this.splitterEl.parentNode) {
      this.splitterEl.parentNode.removeChild(this.splitterEl);
    }
  }
}

// Export
if (typeof module !== "undefined" && module.exports) {
  module.exports = { Splitter };
}
if (typeof window !== "undefined") {
  window.Splitter = Splitter;
}
