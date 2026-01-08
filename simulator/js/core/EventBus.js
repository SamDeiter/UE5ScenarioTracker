/**
 * EventBus.js - Central Pub/Sub System
 *
 * Reusable across: Level Editor Simulator, Blueprint Editor, Question Generator
 *
 * Usage:
 *   import { EventBus } from './core/EventBus.js';
 *
 *   // Subscribe
 *   EventBus.on('actor:selected', (data) => console.log(data));
 *
 *   // Publish
 *   EventBus.emit('actor:selected', { name: 'DirectionalLight' });
 *
 *   // Unsubscribe
 *   EventBus.off('actor:selected', handler);
 */

const EventBus = (function () {
  const listeners = new Map();

  return {
    /**
     * Subscribe to an event
     * @param {string} event - Event name (e.g., 'actor:selected', 'property:changed')
     * @param {Function} callback - Handler function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event).add(callback);

      // Return unsubscribe function for convenience
      return () => this.off(event, callback);
    },

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Handler to remove
     */
    off(event, callback) {
      if (listeners.has(event)) {
        listeners.get(event).delete(callback);
      }
    },

    /**
     * Emit an event to all subscribers
     * @param {string} event - Event name
     * @param {*} data - Data to pass to handlers
     */
    emit(event, data) {
      if (listeners.has(event)) {
        listeners.get(event).forEach((callback) => {
          try {
            callback(data);
          } catch (error) {
            console.error(
              '[EventBus] Error in handler for "' + event + '":',
              error
            );
          }
        });
      }

      // Also dispatch as DOM CustomEvent for external integration
      document.dispatchEvent(
        new CustomEvent("ue5sim:" + event, { detail: data })
      );
    },

    /**
     * Subscribe to an event for one-time execution
     * @param {string} event - Event name
     * @param {Function} callback - Handler function
     */
    once(event, callback) {
      const wrapper = (data) => {
        this.off(event, wrapper);
        callback(data);
      };
      this.on(event, wrapper);
    },

    /**
     * Remove all listeners for an event (or all events)
     * @param {string} [event] - Optional event name, clears all if not provided
     */
    clear(event) {
      if (event) {
        listeners.delete(event);
      } else {
        listeners.clear();
      }
    },

    /**
     * Get count of listeners for debugging
     * @param {string} event - Event name
     * @returns {number} Number of listeners
     */
    listenerCount(event) {
      return listeners.has(event) ? listeners.get(event).size : 0;
    },
  };
})();

// Export for ES6 modules and global access
if (typeof module !== "undefined" && module.exports) {
  module.exports = { EventBus };
}
if (typeof window !== "undefined") {
  window.EventBus = EventBus;
}
