/**
 * DetailsController.js - Dynamic Details Panel Controller
 *
 * Wires ActorRegistry + PropertyRenderer to the Details panel.
 * When an actor is selected, this controller dynamically renders
 * the appropriate properties based on the actor type.
 *
 * Features:
 * - Dynamic property rendering based on actor type
 * - Transform section with Absolute/Relative toggle
 * - Category expand/collapse state preservation
 * - Property value syncing with SimState
 *
 * Usage:
 *   import { DetailsController } from './ui/DetailsController.js';
 *
 *   const details = new DetailsController({
 *     container: document.getElementById('details-properties'),
 *     headerContainer: document.getElementById('details-actor-section')
 *   });
 */

class DetailsController {
  constructor(options = {}) {
    this.container = options.container;
    this.headerContainer = options.headerContainer;
    this.emptyState = options.emptyState;
    this.categoryStates = {}; // Track expanded/collapsed per category
    this.currentActor = null;
    this.currentActorType = null;
    this.transformSpace = "World"; // 'World' or 'Local' (Absolute toggle)
    this.showAdvanced = {}; // Track advanced toggle per category

    // Initialize input factory
    if (typeof PropertyInputFactory !== "undefined") {
      this.inputFactory = new PropertyInputFactory({
        onChange: (name, value) => this._onPropertyChange(name, value),
      });
    }

    this._init();
  }

  /**
   * Initialize the controller
   */
  _init() {
    // Subscribe to actor selection events
    if (typeof EventBus !== "undefined") {
      EventBus.on("actor:selected", (data) =>
        this.renderActor(data.name, data.type)
      );
      EventBus.on("property:changed", (data) => this._syncProperty(data));
    }

    // Subscribe to SimState if available
    if (typeof SimState !== "undefined") {
      SimState.subscribe("selectedActor", (actorName) => {
        if (actorName) {
          const actorType = SimState.getSelectedActorType();
          this.renderActor(actorName, actorType);
        } else {
          this.clear();
        }
      });
    }
  }

  /**
   * Render properties for an actor
   */
  renderActor(actorName, actorType) {
    if (!actorName || !actorType) {
      this.clear();
      return;
    }

    this.currentActor = actorName;
    this.currentActorType = actorType;

    // Show container, hide empty state
    if (this.container) {
      this.container.style.display = "block";
    }
    if (this.emptyState) {
      this.emptyState.style.display = "none";
    }
    if (this.headerContainer) {
      this.headerContainer.style.display = "block";
    }

    // Get actor definition from registry
    if (typeof ActorRegistry === "undefined") {
      console.warn("[DetailsController] ActorRegistry not available");
      return;
    }

    const actor = ActorRegistry.getActor(actorType);
    if (!actor) {
      console.warn(
        "[DetailsController] Actor type not in registry:",
        actorType
      );
      return;
    }

    // Update header
    this._updateHeader(actorName, actor);

    // Get current property values from SimState + Defaults
    const defaults = ActorRegistry.getDefaults(actorType);
    let currentValues = { ...defaults };
    if (typeof SimState !== "undefined") {
      const overrides = SimState.getSelectedActorProperties() || {};
      currentValues = { ...currentValues, ...overrides };
    }

    // Render categories and properties
    this._renderCategories(actorType, actor, currentValues);
  }

  /**
   * Update the actor header section
   */
  _updateHeader(actorName, actor) {
    // Update name
    const nameEl = document.getElementById("details-actor-name-text");
    if (nameEl) {
      nameEl.textContent = actorName;
    }

    // Update main header icon
    const iconEl = document.getElementById("details-header-icon");
    if (iconEl && actor.type) {
      if (typeof IconManager !== "undefined" && IconManager.spec) {
        iconEl.src =
          IconManager.getIconPath(actor.type) ||
          "/simulator/assets/icons/ue5/" + actor.icon;
      } else {
        iconEl.src = "icons/ue5/" + actor.icon;
      }
    }

    // Update hierarchy breadcrumb
    const actorHierarchyItem = document.querySelector(
      ".hierarchy-item.actor span"
    );
    if (actorHierarchyItem) {
      actorHierarchyItem.textContent = `${actorName} (Self)`;
    }

    const componentHierarchyItem = document.querySelector(
      ".hierarchy-item.component span:not(.hierarchy-indent)"
    );
    if (componentHierarchyItem) {
      // Assume component is [ActorType]Component (e.g. LightComponent)
      const componentName =
        actor.displayName.replace(" Actor", "").replace(" Light", "") +
        "Component";
      componentHierarchyItem.textContent = `${componentName} (LightComponent0)`;
    }
  }

  /**
   * Render all categories for the actor
   */
  _renderCategories(actorType, actor, currentValues) {
    if (!this.container) return;

    // Clear existing dynamic content (keep static content if any)
    const dynamicContainer = this.container.querySelector(
      ".dynamic-properties"
    );
    if (dynamicContainer) {
      dynamicContainer.innerHTML = "";
    } else {
      // Create dynamic container if it doesn't exist
      const dc = document.createElement("div");
      dc.className = "dynamic-properties";
      this.container.appendChild(dc);
    }

    const target =
      this.container.querySelector(".dynamic-properties") || this.container;

    // Get categories sorted by priority
    const categories = ActorRegistry.getCategories(actorType);

    for (const cat of categories) {
      const properties = ActorRegistry.getProperties(actorType, cat.name) || [];

      const categoryEl = this._createCategory(
        cat.name,
        properties,
        currentValues
      );
      target.appendChild(categoryEl);
    }
  }

  /**
   * Create a category section
   */
  _createCategory(categoryName, properties, currentValues) {
    const categoryEl = document.createElement("div");
    categoryEl.className = "category";
    categoryEl.dataset.category = categoryName
      .toLowerCase()
      .replace(/\s+/g, "-");

    // Category header
    const header = document.createElement("div");
    header.className = "category-header";

    // Toggle arrow
    const toggle = document.createElement("div");
    toggle.className = "category-toggle";
    toggle.innerHTML = '<i class="fas fa-caret-right"></i>';
    header.appendChild(toggle);

    const titleText = document.createElement("span");
    titleText.textContent = categoryName;
    header.appendChild(titleText);

    const isExpanded = this.categoryStates[categoryName] === true; // Default to collapsed for stubs
    if (categoryName === "Transform" || categoryName === "Light") {
      if (this.categoryStates[categoryName] === false) {
        header.classList.add("collapsed");
      }
    } else {
      if (!this.categoryStates[categoryName]) {
        header.classList.add("collapsed");
      }
    }

    header.addEventListener("click", () => {
      const isCollapsed = header.classList.toggle("collapsed");
      this.categoryStates[categoryName] = !isCollapsed;

      const icon = toggle.querySelector("i");
      if (icon) {
        icon.style.transform = isCollapsed ? "rotate(0deg)" : "rotate(90deg)";
      }
    });

    // Ensure initial rotation state
    const initialIcon = toggle.querySelector("i");
    if (initialIcon) {
      initialIcon.style.transform = header.classList.contains("collapsed")
        ? "rotate(0deg)"
        : "rotate(90deg)";
    }

    categoryEl.appendChild(header);

    // Category content
    const content = document.createElement("div");
    content.className = "category-content";

    // Content rendering logic
    const specializedTransformProps = [
      "Location",
      "Rotation",
      "Scale",
      "Mobility",
    ];

    if (categoryName === "Transform") {
      content.appendChild(
        this._createTransformSection(properties, currentValues)
      );

      // Render any other properties in Transform category that aren't specialized
      const otherProps = properties.filter(
        (p) => !specializedTransformProps.includes(p.name)
      );
      for (const prop of otherProps) {
        const row = this._createPropertyRow(prop, currentValues);
        content.appendChild(row);
      }
    } else {
      // Regular properties - Separate Basic and Advanced
      const advancedProps = properties.filter((p) => p.advanced);
      const basicProps = properties.filter((p) => !p.advanced);

      // Render basic properties
      for (const prop of basicProps) {
        const row = this._createPropertyRow(prop, currentValues);
        content.appendChild(row);
      }

      // Advanced toggle if needed
      if (advancedProps.length > 0) {
        const advancedToggle = document.createElement("div");
        advancedToggle.className = "advanced-property-toggle";
        const isAdvancedExpanded = this.showAdvanced[categoryName] === true;
        advancedToggle.innerHTML = `<i class="fas fa-chevron-${
          isAdvancedExpanded ? "up" : "down"
        }"></i>`;
        advancedToggle.title = isAdvancedExpanded
          ? "Hide Advanced"
          : "Show Advanced";

        advancedToggle.addEventListener("click", (e) => {
          e.stopPropagation();
          const isNowExpanded = !this.showAdvanced[categoryName];
          this.showAdvanced[categoryName] = isNowExpanded;
          this.renderActor(this.currentActor, this.currentActorType);
        });
        content.appendChild(advancedToggle);

        if (isAdvancedExpanded) {
          for (const prop of advancedProps) {
            const row = this._createPropertyRow(prop, currentValues);
            content.appendChild(row);
          }
        }
      }
    }

    categoryEl.appendChild(content);

    return categoryEl;
  }

  /**
   * Create Transform section with Absolute toggle
   */
  _createTransformSection(properties, currentValues) {
    const container = document.createElement("div");
    container.className = "transform-section";

    // Group properties for special rendering
    const locationProp = properties.find((p) => p.name === "Location");
    const rotationProp = properties.find((p) => p.name === "Rotation");
    const scaleProp = properties.find((p) => p.name === "Scale");
    const mobilityProp = properties.find((p) => p.name === "Mobility");

    // Location with Absolute toggle
    if (locationProp) {
      container.appendChild(
        this._createTransformRow(
          "Location",
          locationProp,
          currentValues["Location"],
          true // Has absolute toggle
        )
      );
    }

    // Rotation with Absolute toggle
    if (rotationProp) {
      container.appendChild(
        this._createTransformRow(
          "Rotation",
          rotationProp,
          currentValues["Rotation"],
          true
        )
      );
    }

    // Scale with lock icon
    if (scaleProp) {
      container.appendChild(
        this._createTransformRow(
          "Scale",
          scaleProp,
          currentValues["Scale"],
          false,
          true // Has lock icon
        )
      );
    }

    // Mobility buttons
    if (mobilityProp) {
      container.appendChild(
        this._createMobilityRow(mobilityProp, currentValues["Mobility"])
      );
    }

    return container;
  }

  /**
   * Create a transform row (Location/Rotation/Scale) with toggles
   */
  _createTransformRow(
    label,
    prop,
    value,
    hasAbsoluteToggle = false,
    hasLockIcon = false
  ) {
    const row = document.createElement("div");
    row.className = "property-row transform-row";

    // Modified Property Indicator (Yellow vertical bar)
    const indicator = document.createElement("div");
    indicator.className = "modified-indicator";
    const isModified =
      value !== undefined &&
      JSON.stringify(value) !== JSON.stringify(prop.default);
    if (isModified) indicator.classList.add("active");
    row.appendChild(indicator);

    // Label Column
    const labelContainer = document.createElement("div");
    labelContainer.className = "property-name-col transform-label-container";

    if (hasAbsoluteToggle) {
      const labelBtn = document.createElement("button");
      labelBtn.className = "transform-label-btn";
      labelBtn.innerHTML = `<span>${label}</span> <i class="fas fa-chevron-down"></i>`;
      labelBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this._showTransformDropdown(labelBtn, label);
      });
      labelContainer.appendChild(labelBtn);

      const spaceIndicator = document.createElement("span");
      spaceIndicator.className = "transform-space-indicator";
      spaceIndicator.textContent = `(${this.transformSpace})`;
      labelContainer.appendChild(spaceIndicator);
    } else {
      const labelSpan = document.createElement("span");
      labelSpan.className = "property-name";
      labelSpan.textContent = label;
      labelContainer.appendChild(labelSpan);
    }

    row.appendChild(labelContainer);

    // Value Column (Vector Inputs)
    const valueContainer = document.createElement("div");
    valueContainer.className = "property-val-col"; // Match CSS class

    // Lock icon for Scale
    if (hasLockIcon) {
      const lockBtn = document.createElement("button");
      lockBtn.className = "scale-lock-icon locked";
      lockBtn.innerHTML = '<i class="fas fa-lock"></i>';
      lockBtn.addEventListener("click", () => {
        const isLocked = lockBtn.classList.toggle("locked");
        lockBtn.innerHTML = isLocked
          ? '<i class="fas fa-lock"></i>'
          : '<i class="fas fa-unlock"></i>';
      });
      valueContainer.appendChild(lockBtn);
    }

    const vectorContainer = document.createElement("div");
    vectorContainer.className = "vector-input-group";

    const fields = prop.fields || ["X", "Y", "Z"];
    const colors = { X: "red", Y: "green", Z: "blue" };

    for (const field of fields) {
      const fieldWrapper = document.createElement("div");
      fieldWrapper.className = `vector-field-wrapper ${field.toLowerCase()}`;

      // Color bar instead of text label
      const colorBar = document.createElement("div");
      colorBar.className = `vector-color-bar ${colors[field] || "gray"}`;
      fieldWrapper.appendChild(colorBar);

      const input = document.createElement("input");
      input.type = "text"; // Use text to allow for more flexible formatting
      input.className = "vector-input-v2";
      input.value =
        value && value[field] !== undefined ? value[field].toFixed(1) : "0.0";

      input.addEventListener("change", () => {
        const newValue = { ...(value || {}) };
        newValue[field] = parseFloat(input.value) || 0;
        this._onPropertyChange(prop.name, newValue);
      });

      fieldWrapper.appendChild(input);
      vectorContainer.appendChild(fieldWrapper);
    }

    valueContainer.appendChild(vectorContainer);
    row.appendChild(valueContainer);

    // Reset Column
    const actionsCol = document.createElement("div");
    actionsCol.className = "property-actions-col";

    const resetBtn = document.createElement("button");
    resetBtn.className = "ue-reset-btn";
    resetBtn.innerHTML = `<img src="icons/ue5/icon_ResetToDefault_16x.png">`;
    resetBtn.style.visibility = isModified ? "visible" : "hidden";
    resetBtn.addEventListener("click", () => {
      this._onPropertyChange(prop.name, prop.default);
    });
    actionsCol.appendChild(resetBtn);
    row.appendChild(actionsCol);

    return row;
  }

  /**
   * Show transform space dropdown (Absolute toggle)
   */
  _showTransformDropdown(triggerBtn, fieldName) {
    // Use Dropdown module if available
    if (typeof Dropdown !== "undefined") {
      const dropdown = new Dropdown(triggerBtn, {
        items: [
          {
            label: "World",
            value: "World",
            selected: this.transformSpace === "World",
          },
          {
            label: "Local",
            value: "Local",
            selected: this.transformSpace === "Local",
          },
        ],
        onSelect: (value) => {
          this.transformSpace = value;
          // Update all space indicators
          document
            .querySelectorAll(".transform-space-indicator")
            .forEach((el) => {
              el.textContent = `(${value})`;
            });

          if (typeof EventBus !== "undefined") {
            EventBus.emit("transform:spaceChanged", { space: value });
          }
        },
      });
      dropdown.open();
    }
  }

  /**
   * Create Mobility button row
   */
  _createMobilityRow(prop, value) {
    const row = document.createElement("div");
    row.className = "property-row mobility-row";

    // Modified Property Indicator
    const indicator = document.createElement("div");
    indicator.className = "modified-indicator";
    if (value !== prop.default) indicator.classList.add("active");
    row.appendChild(indicator);

    const nameCol = document.createElement("div");
    nameCol.className = "property-name-col";
    const label = document.createElement("span");
    label.className = "property-name";
    label.textContent = "Mobility";
    nameCol.appendChild(label);
    row.appendChild(nameCol);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "property-val-col mobility-button-group";

    const options = prop.options || ActorRegistry.getMobilityOptions();

    for (const [key, option] of Object.entries(options)) {
      const btn = document.createElement("button");
      btn.className =
        "mobility-toggle" + (value === option.value ? " active" : "");
      btn.textContent = option.value;
      btn.title = option.tooltip;

      btn.addEventListener("click", () => {
        this._onPropertyChange("Mobility", option.value);
      });

      buttonsContainer.appendChild(btn);
    }

    row.appendChild(buttonsContainer);

    // Reset col
    const actionsCol = document.createElement("div");
    actionsCol.className = "property-actions-col";
    if (value !== prop.default) {
      const resetBtn = document.createElement("button");
      resetBtn.className = "ue-reset-btn";
      resetBtn.innerHTML = `<img src="icons/ue5/icon_ResetToDefault_16x.png">`;
      resetBtn.addEventListener("click", () =>
        this._onPropertyChange("Mobility", prop.default)
      );
      actionsCol.appendChild(resetBtn);
    }
    row.appendChild(actionsCol);

    return row;
  }

  /**
   * Create a regular property row
   */
  _createPropertyRow(prop, actorProperties) {
    const value = actorProperties[prop.name];
    const row = document.createElement("div");
    row.className = "property-row";
    if (prop.advanced) row.classList.add("advanced-property");
    row.dataset.property = prop.name;

    // Check edit condition
    const isEnabled = this._evaluateEditCondition(prop, actorProperties);
    if (!isEnabled) {
      row.classList.add("disabled");
    }

    // Yellow indicator for modified properties (UE5 ResetToDefault behavior)
    const indicator = document.createElement("div");
    indicator.className = "modified-indicator";
    const isModified = value !== undefined && value !== prop.default;
    if (isModified) {
      indicator.classList.add("active");
      row.classList.add("modified");
    }

    const nameCol = document.createElement("div");
    nameCol.className = "property-name-col";
    nameCol.appendChild(indicator);

    const label = document.createElement("span");
    label.className = "property-name";
    label.textContent = prop.name;
    label.title = prop.tooltip || prop.name;
    nameCol.appendChild(label);
    row.appendChild(nameCol);

    const valueContainer = document.createElement("div");
    valueContainer.className = "property-value";
    valueContainer.style.cssText =
      "flex: 1; display: flex; align-items: center;";

    const currentValue = value !== undefined ? value : prop.default;

    // Create input based on type - delegate to PropertyInputFactory
    let inputEl;
    if (this.inputFactory) {
      inputEl = this.inputFactory.create(prop, currentValue);
    } else {
      // Fallback for when factory is not available
      inputEl = document.createElement("span");
      inputEl.textContent = String(currentValue);
    }

    if (!isEnabled && inputEl.querySelector) {
      const actualInput = inputEl.querySelector("input, select") || inputEl;
      actualInput.disabled = true;
    }

    valueContainer.appendChild(inputEl);
    row.appendChild(valueContainer);

    const actionsCol = document.createElement("div");
    actionsCol.className = "property-actions";

    // Reset to Default button
    const resetBtn = document.createElement("button");
    resetBtn.className = "property-reset-v2";
    resetBtn.innerHTML = '<i class="fas fa-undo"></i>';
    resetBtn.style.visibility = isModified ? "visible" : "hidden";
    resetBtn.addEventListener("click", () => {
      this._onPropertyChange(prop.name, prop.default);
    });
    actionsCol.appendChild(resetBtn);
    row.appendChild(actionsCol);

    return row;
  }

  /**
   * Evaluate UE5-style EditCondition (e.g., "Use Temperature", "Mobility == Stationary")
   */
  _evaluateEditCondition(prop, actorProperties) {
    if (!prop.editCondition) return true;

    const condition = prop.editCondition;

    // Simple boolean check
    if (actorProperties[condition] === true) return true;
    if (actorProperties[condition] === false) return false;

    // Comparison check (e.g., "Mobility == Stationary")
    const match = condition.match(/^(\w+)\s*([=!<>]+)\s*(.+)$/);
    if (match) {
      const [_, field, op, target] = match;
      const val = actorProperties[field];

      switch (op) {
        case "==":
          return String(val) === target;
        case "!=":
          return String(val) !== target;
        case ">":
          return val > parseFloat(target);
        case "<":
          return val < parseFloat(target);
      }
    }

    // Default to true if simple field exists and is truthy
    return !!actorProperties[condition];
  }

  // Input creation methods have been extracted to PropertyInputFactory.js
  // The factory is initialized in the constructor and used via this.inputFactory.create()

  /**
   * Internal change handler
   */
  _onPropertyChange(propertyName, value) {
    if (typeof SimState !== "undefined" && this.currentActor) {
      SimState.setProperty(this.currentActor, propertyName, value);
    }

    if (typeof EventBus !== "undefined") {
      EventBus.emit("property:changed", {
        property: propertyName,
        value: value,
        actor: this.currentActor,
      });
    } else {
      // Manual sync if no EventBus
      this._syncProperty({ property: propertyName, value });
    }
  }

  /**
   * Sync a single property update (from EventBus or internal change)
   */
  _syncProperty(data) {
    const { property, value } = data;
    const row = this.container.querySelector(
      `.property-row[data-property="${property}"]`
    );
    if (!row) return;

    // Update modified state
    const indicator = row.querySelector(".modified-indicator");
    const resetBtn = row.querySelector(".property-reset-v2");

    // Get prop def to check against default
    if (typeof ActorRegistry !== "undefined" && this.currentActorType) {
      const prop = ActorRegistry.getProperties(this.currentActorType).find(
        (p) => p.name === property
      );

      if (prop) {
        const isModified = value !== prop.default;

        if (indicator) {
          indicator.classList.toggle("active", isModified);
        }

        if (resetBtn) {
          resetBtn.style.visibility = isModified ? "visible" : "hidden";
        }

        row.classList.toggle("modified", isModified);
      }
    }

    // Update the input value
    const input = row.querySelector("input, select");
    if (input) {
      if (input.type === "checkbox") {
        input.checked = value;
      } else {
        input.value = value;
      }
    }
  }

  /**
   * Clear the details panel
   */
  clear() {
    this.currentActor = null;
    this.currentActorType = null;
    if (this.container) {
      const dynamicContainer = this.container.querySelector(
        ".dynamic-properties"
      );
      if (dynamicContainer) dynamicContainer.innerHTML = "";
      this.container.style.display = "none";
    }
    if (this.emptyState) {
      this.emptyState.style.display = "flex";
    }
    if (this.headerContainer) {
      this.headerContainer.style.display = "none";
    }
  }
}

// Export
if (typeof module !== "undefined" && module.exports) {
  module.exports = { DetailsController };
}
if (typeof window !== "undefined") {
  window.DetailsController = DetailsController;
}
