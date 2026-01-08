/**
 * UIBridge.js - Wire Existing HTML UI to SimState
 *
 * This module connects the existing HTML-based property inputs
 * in index.html to the modular SimState system, enabling:
 * - Property changes to update SimState
 * - SimState changes to reflect in UI
 * - Validation from ScenarioLoader
 *
 * Auto-initializes when included in ModuleLoader.
 */

const UIBridge = (function () {
  let initialized = false;

  /**
   * Initialize UI Bridge
   */
  function init() {
    if (initialized) return;

    console.log("[UIBridge] Initializing UI-to-State connections...");

    // Wait for modules to be ready
    if (typeof EventBus === "undefined" || typeof SimState === "undefined") {
      console.warn("[UIBridge] Waiting for modules...");
      setTimeout(init, 100);
      return;
    }

    // Connect property inputs
    _connectPropertyInputs();

    // Connect mobility buttons
    _connectMobilityButtons();

    // Connect transform inputs
    _connectTransformInputs();

    // Connect validate button
    _connectValidateButton();

    // Connect reset button
    _connectResetButton();

    // Connect Top Toolbar buttons
    _connectToolbarButtons();

    // Listen for state changes
    _subscribeToStateChanges();

    initialized = true;
    console.log("[UIBridge] UI-State connections established.");

    if (typeof EventBus !== "undefined") {
      EventBus.emit("uibridge:initialized");
    }
  }

  /**
   * Connect all property inputs to SimState
   */
  function _connectPropertyInputs() {
    // Number inputs (Intensity, Temperature, Shadow Distance, etc.)
    document
      .querySelectorAll('#details-properties input[type="number"]')
      .forEach((input) => {
        const propertyName = _getPropertyName(input);
        if (!propertyName) return;

        input.addEventListener("change", () => {
          const actor = SimState.getSelectedActor();
          if (actor) {
            SimState.setProperty(actor, propertyName, parseFloat(input.value));
          }
        });

        input.addEventListener("input", () => {
          // Live update for scrubbing
          const actor = SimState.getSelectedActor();
          if (actor) {
            SimState.setProperty(actor, propertyName, parseFloat(input.value));
          }
        });
      });

    // Text inputs
    document
      .querySelectorAll('#details-properties input[type="text"]')
      .forEach((input) => {
        const propertyName = _getPropertyName(input);
        if (!propertyName) return;

        input.addEventListener("change", () => {
          const actor = SimState.getSelectedActor();
          if (actor) {
            SimState.setProperty(actor, propertyName, input.value);
          }
        });
      });

    // Checkboxes
    document
      .querySelectorAll('#details-properties input[type="checkbox"]')
      .forEach((input) => {
        const propertyName = _getPropertyName(input);
        if (!propertyName) return;

        input.addEventListener("change", () => {
          const actor = SimState.getSelectedActor();
          if (actor) {
            SimState.setProperty(actor, propertyName, input.checked);
          }
        });
      });

    // Color pickers
    document
      .querySelectorAll('#details-properties input[type="color"]')
      .forEach((input) => {
        const propertyName = _getPropertyName(input);
        if (!propertyName) return;

        input.addEventListener("change", () => {
          const actor = SimState.getSelectedActor();
          if (actor) {
            SimState.setProperty(actor, propertyName, input.value);
          }
        });
      });

    // Select dropdowns
    document
      .querySelectorAll("#details-properties select")
      .forEach((select) => {
        const propertyName = _getPropertyName(select);
        if (!propertyName) return;

        select.addEventListener("change", () => {
          const actor = SimState.getSelectedActor();
          if (actor) {
            SimState.setProperty(actor, propertyName, select.value);
          }
        });
      });

    console.log("[UIBridge] Property inputs connected");
  }

  /**
   * Connect mobility buttons
   */
  function _connectMobilityButtons() {
    document.querySelectorAll(".mobility-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const actor = SimState.getSelectedActor();
        if (actor) {
          const mobility = btn.textContent.trim();
          SimState.setProperty(actor, "Mobility", mobility);

          // Update button states
          document.querySelectorAll(".mobility-btn").forEach((b) => {
            b.classList.remove("active");
          });
          btn.classList.add("active");
        }
      });
    });

    console.log("[UIBridge] Mobility buttons connected");
  }

  /**
   * Connect transform inputs (Location, Rotation, Scale)
   */
  function _connectTransformInputs() {
    const transformFields = ["Location", "Rotation", "Scale"];
    const axes = ["X", "Y", "Z"];

    transformFields.forEach((field) => {
      axes.forEach((axis) => {
        const selector = `.transform-row input[data-field="${field}"][data-axis="${axis}"]`;
        const inputs = document.querySelectorAll(selector);

        // Also try alternative selectors based on common patterns
        const altSelector = `.property-row:has(.property-name:contains("${field}")) .vector-field input`;

        inputs.forEach((input) => {
          input.addEventListener("change", () => {
            const actor = SimState.getSelectedActor();
            if (actor) {
              const currentValue = SimState.getProperty(actor, field) || {
                X: 0,
                Y: 0,
                Z: 0,
              };
              currentValue[axis] = parseFloat(input.value);
              SimState.setProperty(actor, field, currentValue);
            }
          });
        });
      });
    });

    // Connect all vector inputs generically
    document.querySelectorAll(".vector-value").forEach((input) => {
      const row = input.closest(".property-row");
      if (!row) return;

      const label = row.querySelector(".property-name, .transform-label-btn");
      if (!label) return;

      const propertyName = label.textContent.trim().split(" ")[0]; // Get first word
      const wrapper = input.closest(".vector-field");
      const axisLabel = wrapper?.querySelector(".vector-label");
      const axis = axisLabel?.textContent || "X";

      input.addEventListener("change", () => {
        const actor = SimState.getSelectedActor();
        if (actor) {
          const currentValue = SimState.getProperty(actor, propertyName) || {
            X: 0,
            Y: 0,
            Z: 0,
          };
          currentValue[axis] = parseFloat(input.value);
          SimState.setProperty(actor, propertyName, currentValue);
        }
      });
    });

    console.log("[UIBridge] Transform inputs connected");
  }

  /**
   * Connect Validate button to ScenarioLoader
   */
  function _connectValidateButton() {
    const validateBtn = document.getElementById("validate-btn");
    if (!validateBtn) return;

    validateBtn.addEventListener("click", () => {
      if (typeof ScenarioLoader === "undefined") {
        console.warn("[UIBridge] ScenarioLoader not available");
        return;
      }

      const loader = new ScenarioLoader();

      // Load current scenario if not loaded
      if (!loader.getCurrent()) {
        const select = document.getElementById("scenario-select");
        if (select) {
          loader.load(select.value);
        }
      }

      // Validate
      const result = SimState.validateScenario({
        expectedActor: SimState.getSelectedActor(),
      });

      console.log("[UIBridge] Validation result:", result);

      // Emit event for UI feedback
      if (typeof EventBus !== "undefined") {
        EventBus.emit("validation:complete", result);
      }
    });

    console.log("[UIBridge] Validate button connected");
  }

  /**
   * Connect Reset button
   */
  function _connectResetButton() {
    const resetBtn = document.getElementById("reset-btn");
    if (!resetBtn) return;

    resetBtn.addEventListener("click", () => {
      // Reset SimState
      if (typeof SimState !== "undefined") {
        SimState.reset();
      }

      // Reset property values to defaults
      if (typeof ActorRegistry !== "undefined") {
        const actor = SimState.getSelectedActor();
        if (actor) {
          const actorType = SimState.getSelectedActorType();
          const defaults = ActorRegistry.getDefaults(actorType);

          for (const [prop, value] of Object.entries(defaults)) {
            SimState.setProperty(actor, prop, value);
          }
        }
      }

      // Emit event
      if (typeof EventBus !== "undefined") {
        EventBus.emit("ui:reset");
      }
    });

    console.log("[UIBridge] Reset button connected");
  }

  /**
   * Connect Top Toolbar buttons
   */
  function _connectToolbarButtons() {
    // Play button
    document.querySelector(".play-btn")?.addEventListener("click", () => {
      console.log("[UIBridge] Play Simulation");
      if (typeof EventBus !== "undefined") {
        EventBus.emit("sim:play");
      }
    });

    // Save button
    document
      .querySelector('.toolbar-btn[title*="Save"]')
      ?.addEventListener("click", () => {
        console.log("[UIBridge] Save Level");
      });

    // Platforms button
    document
      .querySelector('.toolbar-btn[title*="Platforms"]')
      ?.addEventListener("click", () => {
        console.log("[UIBridge] Platforms clicked");
      });
  }

  /**
   * Subscribe to SimState changes and update UI
   */
  function _subscribeToStateChanges() {
    if (typeof EventBus === "undefined") return;

    // Update UI when property changes
    EventBus.on("property:changed", (data) => {
      _updateUIForProperty(data.actor, data.property, data.value);
    });

    // Update UI when actor selected
    EventBus.on("actor:selected", (data) => {
      _refreshAllPropertyInputs(data.name, data.type);
    });

    console.log("[UIBridge] State subscriptions active");
  }

  /**
   * Update UI when a property changes in state
   */
  function _updateUIForProperty(actor, property, value) {
    // Find matching input
    const inputs = document.querySelectorAll(
      `[data-property="${property}"], [name="${property}"]`
    );

    inputs.forEach((input) => {
      if (input.type === "checkbox") {
        input.checked = value;
      } else if (
        input.type === "number" ||
        input.type === "text" ||
        input.type === "color"
      ) {
        input.value = value;
      } else if (input.tagName === "SELECT") {
        input.value = value;
      }
    });

    // Special handling for mobility
    if (property === "Mobility") {
      document.querySelectorAll(".mobility-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.textContent.trim() === value);
      });
    }
  }

  /**
   * Refresh all property inputs for an actor
   */
  function _refreshAllPropertyInputs(actorName, actorType) {
    if (typeof SimState === "undefined") return;

    const properties = SimState.getSelectedActorProperties();
    if (!properties) return;

    for (const [prop, value] of Object.entries(properties)) {
      _updateUIForProperty(actorName, prop, value);
    }
  }

  /**
   * Get property name from an input element
   */
  function _getPropertyName(input) {
    // Try data-property attribute
    if (input.dataset.property) {
      return input.dataset.property;
    }

    // Try name attribute
    if (input.name) {
      return input.name;
    }

    // Try to find from parent property-row
    const row = input.closest(".property-row");
    if (row) {
      const label = row.querySelector(".property-name");
      if (label) {
        return label.textContent.trim();
      }
    }

    return null;
  }

  /**
   * Manually set a property in both UI and state
   */
  function setProperty(actor, property, value) {
    if (typeof SimState !== "undefined") {
      SimState.setProperty(actor, property, value);
    }
    _updateUIForProperty(actor, property, value);
  }

  /**
   * Get current property value
   */
  function getProperty(actor, property) {
    if (typeof SimState !== "undefined") {
      return SimState.getProperty(actor, property);
    }
    return null;
  }

  return {
    init: init,
    setProperty: setProperty,
    getProperty: getProperty,
  };
})();

// Auto-initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => UIBridge.init());
} else {
  UIBridge.init();
}

// Export
if (typeof window !== "undefined") {
  window.UIBridge = UIBridge;
}
