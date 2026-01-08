/**
 * SimState.js - Central Simulator State Object
 *
 * This is the SINGLE SOURCE OF TRUTH for the entire simulator UI.
 * When an actor is selected, the Details panel queries this state to know
 * which properties to display.
 *
 * Integrates with:
 * - EventBus (publish state changes)
 * - StateManager (undo/redo support)
 * - ActorRegistry (get property definitions)
 * - PropertyRenderer (display properties in Details panel)
 *
 * Usage:
 *   // Select an actor - Details panel auto-updates
 *   SimState.selectActor('DirectionalLight');
 *
 *   // Change a property
 *   SimState.setProperty('DirectionalLight', 'Intensity', 1000);
 *
 *   // For testing: validate expected state
 *   SimState.validateScenario({ expectedActor: 'DirectionalLight', expectedValues: {...} });
 */

const SimState = (function () {
  // Initialize StateManager for reactive updates
  const state = new StateManager(
    {
      // Currently selected actor
      selectedActor: null,
      selectedActorType: null,

      // All actors in the scene with their current property values
      actors: {
        DirectionalLight: {
          type: "DirectionalLight",
          displayName: "DirectionalLight",
          properties: {}, // Will be populated with defaults
        },
        SkyLight: {
          type: "SkyLight",
          displayName: "SkyLight",
          properties: {},
        },
        SkyAtmosphere: {
          type: "SkyAtmosphere",
          displayName: "SkyAtmosphere",
          properties: {},
        },
        ExponentialHeightFog: {
          type: "ExponentialHeightFog",
          displayName: "ExponentialHeightFog",
          properties: {},
        },
        Floor: {
          type: "StaticMeshActor",
          displayName: "Floor",
          properties: {},
        },
        SM_Chair: {
          type: "StaticMeshActor",
          displayName: "SM_Chair",
          properties: {},
        },
      },

      // Active tool
      activeTool: "Select",

      // Transform mode
      transformSpace: "World",

      // Playback state
      isPlaying: false,
      isSimulating: false,

      // Panel states
      panels: {
        outliner: { visible: true, width: 280 },
        details: { visible: true, width: 350 },
        viewport: { visible: true },
      },
    },
    {
      storageKey: "ue5_sim_state",
      storage: sessionStorage,
      maxHistory: 30,
    }
  );

  // Initialize actor properties with defaults from registry
  function initializeActorDefaults() {
    const actors = state.get("actors");
    for (const [actorName, actor] of Object.entries(actors)) {
      if (typeof ActorRegistry !== "undefined") {
        const defaults = ActorRegistry.getDefaults(actor.type);
        state.set("actors." + actorName + ".properties", defaults, true);
      }
    }
  }

  // Auto-initialize when ActorRegistry is available
  if (typeof ActorRegistry !== "undefined") {
    initializeActorDefaults();
  } else {
    // Wait for ActorRegistry to load
    document.addEventListener("DOMContentLoaded", () => {
      if (typeof ActorRegistry !== "undefined") {
        initializeActorDefaults();
      }
    });
  }

  return {
    /**
     * Select an actor by name
     * This triggers Details panel to update with actor-specific properties
     */
    selectActor(actorName) {
      const actors = state.get("actors");
      const actor = actors[actorName];

      if (!actor) {
        console.warn("[SimState] Actor not found:", actorName);
        return false;
      }

      state.set("selectedActor", actorName);
      state.set("selectedActorType", actor.type);

      EventBus.emit("actor:selected", {
        name: actorName,
        type: actor.type,
        displayName: actor.displayName,
        properties: actor.properties,
      });

      return true;
    },

    /**
     * Get currently selected actor
     */
    getSelectedActor() {
      return state.get("selectedActor");
    },

    /**
     * Get all properties for currently selected actor
     */
    getSelectedActorProperties() {
      const actorName = state.get("selectedActor");
      if (!actorName) return null;

      return state.get("actors." + actorName + ".properties");
    },

    /**
     * Get actor type for currently selected actor
     */
    getSelectedActorType() {
      return state.get("selectedActorType");
    },

    /**
     * Set a property value on an actor
     */
    setProperty(actorName, propertyName, value) {
      const path = "actors." + actorName + ".properties." + propertyName;
      const oldValue = state.get(path);

      state.set(path, value);

      EventBus.emit("property:changed", {
        actor: actorName,
        property: propertyName,
        oldValue: oldValue,
        newValue: value,
      });

      return true;
    },

    /**
     * Get a property value from an actor
     */
    getProperty(actorName, propertyName) {
      return state.get("actors." + actorName + ".properties." + propertyName);
    },

    /**
     * Get all actors in the scene
     */
    getActors() {
      return state.get("actors");
    },

    /**
     * Add a new actor to the scene
     */
    addActor(actorName, actorType, displayName) {
      const defaults =
        typeof ActorRegistry !== "undefined"
          ? ActorRegistry.getDefaults(actorType)
          : {};

      state.set("actors." + actorName, {
        type: actorType,
        displayName: displayName || actorName,
        properties: defaults,
      });

      EventBus.emit("actor:added", { name: actorName, type: actorType });
    },

    /**
     * Remove an actor from the scene
     */
    removeActor(actorName) {
      const actors = state.get("actors");
      delete actors[actorName];
      state.set("actors", actors);

      // Clear selection if removed actor was selected
      if (state.get("selectedActor") === actorName) {
        state.set("selectedActor", null);
        state.set("selectedActorType", null);
      }

      EventBus.emit("actor:removed", { name: actorName });
    },

    /**
     * Set active tool
     */
    setActiveTool(toolName) {
      state.set("activeTool", toolName);
      EventBus.emit("tool:changed", { tool: toolName });
    },

    /**
     * Get active tool
     */
    getActiveTool() {
      return state.get("activeTool");
    },

    /**
     * Undo last change
     */
    undo() {
      state.undo();
      EventBus.emit("state:undo");
    },

    /**
     * Redo last undone change
     */
    redo() {
      state.redo();
      EventBus.emit("state:redo");
    },

    /**
     * Check if undo is available
     */
    canUndo() {
      return state.canUndo();
    },

    /**
     * Check if redo is available
     */
    canRedo() {
      return state.canRedo();
    },

    /**
     * Get full state snapshot (for debugging/testing)
     */
    getSnapshot() {
      return state.getSnapshot();
    },

    /**
     * Subscribe to state changes
     */
    subscribe(path, callback) {
      return state.subscribe(path, callback);
    },

    /**
     * ===== TESTING/VALIDATION API =====
     */

    /**
     * Validate current state against expected scenario
     * Used by Question Generator / Scenario Tracker
     */
    validateScenario(expected) {
      const results = {
        passed: true,
        failures: [],
      };

      // Check expected actor selection
      if (expected.expectedActor) {
        const current = state.get("selectedActor");
        if (current !== expected.expectedActor) {
          results.passed = false;
          results.failures.push({
            type: "selection",
            expected: expected.expectedActor,
            actual: current,
            message:
              'Expected actor "' +
              expected.expectedActor +
              '" to be selected, but "' +
              current +
              '" is selected.',
          });
        }
      }

      // Check expected property values
      if (expected.expectedValues) {
        for (const [key, expectedValue] of Object.entries(
          expected.expectedValues
        )) {
          const [actor, propName] = key.split(".");
          const actualValue = this.getProperty(actor, propName);

          if (JSON.stringify(actualValue) !== JSON.stringify(expectedValue)) {
            results.passed = false;
            results.failures.push({
              type: "property",
              property: key,
              expected: expectedValue,
              actual: actualValue,
              message:
                'Property "' +
                key +
                '" expected "' +
                expectedValue +
                '" but got "' +
                actualValue +
                '".',
            });
          }
        }
      }

      // Check expected tool
      if (expected.expectedTool) {
        const current = state.get("activeTool");
        if (current !== expected.expectedTool) {
          results.passed = false;
          results.failures.push({
            type: "tool",
            expected: expected.expectedTool,
            actual: current,
            message:
              'Expected tool "' +
              expected.expectedTool +
              '" but "' +
              current +
              '" is active.',
          });
        }
      }

      return results;
    },

    /**
     * Load a predefined scenario
     */
    loadScenario(scenario) {
      if (scenario.initialState) {
        state.setState(scenario.initialState);
      }

      if (scenario.selectActor) {
        this.selectActor(scenario.selectActor);
      }

      EventBus.emit("scenario:loaded", { scenario: scenario });
    },
  };
})();

// Expose to window for global access and testing
if (typeof window !== "undefined") {
  window.SimState = SimState;
  window.UE5SimState = SimState; // Alias for testing API
}

// Export for ES6 modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SimState };
}
