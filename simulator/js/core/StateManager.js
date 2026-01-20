/**
 * StateManager.js - Reactive State Management
 *
 * Reusable across: Level Editor Simulator, Blueprint Editor, Question Generator
 *
 * Features:
 * - Observable state with automatic UI updates
 * - Undo/redo support
 * - State persistence to localStorage/sessionStorage
 * - Path-based property access (e.g., 'actors.DirectionalLight.Intensity')
 *
 * Usage:
 *   import { StateManager } from './core/StateManager.js';
 *
 *   const state = new StateManager({
 *     selectedActor: null,
 *     actors: {}
 *   });
 *
 *   state.subscribe('selectedActor', (newValue, oldValue) => {
 *     console.log('Selection changed:', newValue);
 *   });
 *
 *   state.set('selectedActor', 'DirectionalLight');
 */

class StateManager {
  constructor(initialState = {}, options = {}) {
    this._state = JSON.parse(JSON.stringify(initialState)); // Deep clone
    this._observers = new Map();
    this._history = [];
    this._historyIndex = -1;
    this._maxHistory = options.maxHistory || 50;
    this._storageKey = options.storageKey || null;
    this._storage = options.storage || null; // localStorage or sessionStorage

    // Load persisted state if available
    if (this._storageKey && this._storage) {
      this._loadFromStorage();
    }

    // Save initial state to history
    this._pushHistory();
  }

  /**
   * Get a value from state using dot notation
   * @param {string} path - Path to property (e.g., 'actors.DirectionalLight.Intensity')
   * @returns {*} Value at path
   */
  get(path) {
    if (!path) return this._state;

    const keys = path.split(".");
    let value = this._state;

    for (const key of keys) {
      if (value === null || value === undefined) return undefined;
      value = value[key];
    }

    return value;
  }

  /**
   * Set a value in state using dot notation
   * @param {string} path - Path to property
   * @param {*} value - New value
   * @param {boolean} [silent=false] - If true, don't notify observers
   */
  set(path, value, silent = false) {
    const keys = path.split(".");
    const lastKey = keys.pop();
    let target = this._state;

    // Navigate to parent object
    for (const key of keys) {
      if (target[key] === undefined) {
        target[key] = {};
      }
      target = target[key];
    }

    const oldValue = target[lastKey];
    target[lastKey] = value;

    if (!silent) {
      this._pushHistory();
      this._notifyObservers(path, value, oldValue);
      this._persist();
    }
  }

  /**
   * Subscribe to changes on a specific path
   * @param {string} path - Path to watch (use '*' for all changes)
   * @param {Function} callback - Called with (newValue, oldValue, path)
   * @returns {Function} Unsubscribe function
   */
  subscribe(path, callback) {
    if (!this._observers.has(path)) {
      this._observers.set(path, new Set());
    }
    this._observers.get(path).add(callback);

    return () => {
      this._observers.get(path).delete(callback);
    };
  }

  /**
   * Notify all relevant observers of a change
   */
  _notifyObservers(path, newValue, oldValue) {
    // Notify exact path observers
    if (this._observers.has(path)) {
      this._observers.get(path).forEach((cb) => cb(newValue, oldValue, path));
    }

    // Notify parent path observers
    const pathParts = path.split(".");
    for (let i = pathParts.length - 1; i > 0; i--) {
      const parentPath = pathParts.slice(0, i).join(".");
      if (this._observers.has(parentPath)) {
        this._observers
          .get(parentPath)
          .forEach((cb) => cb(this.get(parentPath), undefined, path));
      }
    }

    // Notify wildcard observers
    if (this._observers.has("*")) {
      this._observers.get("*").forEach((cb) => cb(newValue, oldValue, path));
    }

    // Emit via EventBus if available
    if (typeof EventBus !== "undefined") {
      EventBus.emit("state:changed", { path, newValue, oldValue });
    }
  }

  /**
   * Undo last change
   */
  undo() {
    if (this._historyIndex > 0) {
      this._historyIndex--;
      this._state = JSON.parse(
        JSON.stringify(this._history[this._historyIndex])
      );
      this._notifyObservers("*", this._state, null);
      this._persist();
    }
  }

  /**
   * Redo previously undone change
   */
  redo() {
    if (this._historyIndex < this._history.length - 1) {
      this._historyIndex++;
      this._state = JSON.parse(
        JSON.stringify(this._history[this._historyIndex])
      );
      this._notifyObservers("*", this._state, null);
      this._persist();
    }
  }

  /**
   * Push current state to history
   */
  _pushHistory() {
    // Remove any redo history
    this._history = this._history.slice(0, this._historyIndex + 1);

    // Add current state
    this._history.push(JSON.parse(JSON.stringify(this._state)));
    this._historyIndex = this._history.length - 1;

    // Trim old history
    if (this._history.length > this._maxHistory) {
      this._history.shift();
      this._historyIndex--;
    }
  }

  /**
   * Persist state to storage
   */
  _persist() {
    if (this._storageKey && this._storage) {
      try {
        this._storage.setItem(this._storageKey, JSON.stringify(this._state));
      } catch (e) {
        console.warn("[StateManager] Failed to persist state:", e.message);
      }
    }
  }

  /**
   * Load state from storage
   */
  _loadFromStorage() {
    try {
      const saved = this._storage.getItem(this._storageKey);
      if (saved) {
        this._state = JSON.parse(saved);
      }
    } catch (e) {
      console.warn("[StateManager] Failed to load state:", e.message);
    }
  }

  /**
   * Get full state snapshot
   */
  getSnapshot() {
    return JSON.parse(JSON.stringify(this._state));
  }

  /**
   * Replace entire state
   */
  setState(newState, silent = false) {
    const oldState = this._state;
    this._state = JSON.parse(JSON.stringify(newState));

    if (!silent) {
      this._pushHistory();
      this._notifyObservers("*", this._state, oldState);
      this._persist();
    }
  }

  /**
   * Check if undo is available
   */
  canUndo() {
    return this._historyIndex > 0;
  }

  /**
   * Check if redo is available
   */
  canRedo() {
    return this._historyIndex < this._history.length - 1;
  }
}

// Export for ES6 modules and global access
if (typeof module !== "undefined" && module.exports) {
  module.exports = { StateManager };
}
if (typeof window !== "undefined") {
  window.StateManager = StateManager;
}
