/**
 * PropertyRenderer.js - Dynamic Property UI Generation
 *
 * Reusable across: Level Editor Simulator, Blueprint Editor Details Panel
 *
 * Renders UE5-style property rows based on ActorRegistry definitions.
 * Supports: float, int, bool, color, vector, rotator, enum, mobility, asset
 *
 * Usage:
 *   import { PropertyRenderer } from './core/PropertyRenderer.js';
 *
 *   const renderer = new PropertyRenderer(containerElement, {
 *     onPropertyChange: (propName, value) => console.log(propName, value)
 *   });
 *
 *   renderer.renderCategory('Light', ActorRegistry.getProperties('DirectionalLight', 'Light'));
 */

class PropertyRenderer {
  constructor(container, options = {}) {
    this.container = container;
    this.onPropertyChange = options.onPropertyChange || (() => {});
    this.currentValues = {};
    this.defaultValues = {};
  }

  /**
   * Render a full category with all its properties
   */
  renderCategory(categoryName, properties, currentValues = {}) {
    const categoryEl = document.createElement("div");
    categoryEl.className = "property-category";
    categoryEl.dataset.category = categoryName;

    // Category header
    const header = document.createElement("div");
    header.className = "category-header";
    header.innerHTML =
      '<i class="fas fa-chevron-down category-expand"></i>' +
      '<span class="category-name">' +
      categoryName +
      "</span>";
    header.addEventListener("click", () => this._toggleCategory(categoryEl));

    categoryEl.appendChild(header);

    // Properties container
    const propsContainer = document.createElement("div");
    propsContainer.className = "category-properties";

    for (const prop of properties) {
      const propRow = this._createPropertyRow(prop, currentValues[prop.name]);
      propsContainer.appendChild(propRow);
    }

    categoryEl.appendChild(propsContainer);
    this.container.appendChild(categoryEl);

    return categoryEl;
  }

  /**
   * Create a single property row based on type
   */
  _createPropertyRow(prop, currentValue) {
    const row = document.createElement("div");
    row.className = "property-row";
    row.dataset.property = prop.name;

    // Property name
    const nameEl = document.createElement("span");
    nameEl.className = "property-name";
    nameEl.textContent = prop.name;
    nameEl.title = prop.tooltip || prop.name;
    row.appendChild(nameEl);

    // Property value based on type
    const valueEl = document.createElement("div");
    valueEl.className = "property-value";

    const value = currentValue !== undefined ? currentValue : prop.default;
    this.currentValues[prop.name] = value;
    this.defaultValues[prop.name] = prop.default;

    switch (prop.type) {
      case "float":
      case "int":
        valueEl.appendChild(this._createNumberInput(prop, value));
        break;
      case "bool":
        valueEl.appendChild(this._createCheckbox(prop, value));
        break;
      case "color":
        valueEl.appendChild(this._createColorPicker(prop, value));
        break;
      case "vector":
      case "rotator":
        valueEl.appendChild(this._createVectorInput(prop, value));
        break;
      case "enum":
        valueEl.appendChild(this._createDropdown(prop, value));
        break;
      case "mobility":
        valueEl.appendChild(this._createMobilityButtons(prop, value));
        break;
      case "channels":
        valueEl.appendChild(this._createChannelButtons(prop, value));
        break;
      case "asset":
        valueEl.appendChild(this._createAssetPicker(prop, value));
        break;
      default:
        valueEl.textContent = String(value);
    }

    row.appendChild(valueEl);

    // Reset button
    const resetBtn = document.createElement("span");
    resetBtn.className = "property-reset";
    resetBtn.innerHTML = '<i class="fas fa-undo"></i>';
    resetBtn.title = "Reset to default";
    resetBtn.addEventListener("click", () =>
      this._resetProperty(prop.name, row)
    );
    row.appendChild(resetBtn);

    return row;
  }

  /**
   * Create number input with optional units
   */
  _createNumberInput(prop, value) {
    const wrapper = document.createElement("div");
    wrapper.className = "input-with-unit";

    const input = document.createElement("input");
    input.type = "number";
    input.className = "property-input";
    input.value = value;
    input.min = prop.min !== undefined ? prop.min : "";
    input.max = prop.max !== undefined ? prop.max : "";
    input.step = prop.type === "int" ? 1 : 0.01;

    input.addEventListener("change", () => {
      const newValue =
        prop.type === "int" ? parseInt(input.value) : parseFloat(input.value);
      this._handleChange(prop.name, newValue);
    });

    wrapper.appendChild(input);

    if (prop.units) {
      const unitLabel = document.createElement("span");
      unitLabel.className = "unit-label";
      unitLabel.textContent = prop.units;
      wrapper.appendChild(unitLabel);
    }

    return wrapper;
  }

  /**
   * Create checkbox for boolean
   */
  _createCheckbox(prop, value) {
    const wrapper = document.createElement("label");
    wrapper.className = "checkbox-wrapper";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = value;

    input.addEventListener("change", () => {
      this._handleChange(prop.name, input.checked);
    });

    wrapper.appendChild(input);
    wrapper.appendChild(document.createElement("span")); // Checkbox visual

    return wrapper;
  }

  /**
   * Create color picker
   */
  _createColorPicker(prop, value) {
    const input = document.createElement("input");
    input.type = "color";
    input.className = "color-picker";
    input.value = value;

    input.addEventListener("change", () => {
      this._handleChange(prop.name, input.value);
    });

    return input;
  }

  /**
   * Create vector/rotator input (X, Y, Z)
   */
  _createVectorInput(prop, value) {
    const wrapper = document.createElement("div");
    wrapper.className = "vector-input";

    const labels =
      prop.type === "rotator" ? ["Roll", "Pitch", "Yaw"] : ["X", "Y", "Z"];
    const fields = prop.fields || ["X", "Y", "Z"];

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const fieldWrapper = document.createElement("div");
      fieldWrapper.className = "vector-field";

      const label = document.createElement("span");
      label.className = "vector-label vector-label-" + field.toLowerCase();
      label.textContent = field;

      const input = document.createElement("input");
      input.type = "number";
      input.className = "vector-value";
      input.value = value && value[field] !== undefined ? value[field] : 0;
      input.step = 0.01;

      input.addEventListener("change", () => {
        const currentVal = this.currentValues[prop.name] || {};
        currentVal[field] = parseFloat(input.value);
        this._handleChange(prop.name, { ...currentVal });
      });

      fieldWrapper.appendChild(label);
      fieldWrapper.appendChild(input);
      wrapper.appendChild(fieldWrapper);
    }

    return wrapper;
  }

  /**
   * Create dropdown select
   */
  _createDropdown(prop, value) {
    const select = document.createElement("select");
    select.className = "property-dropdown";

    for (const option of prop.options) {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      opt.selected = option === value;
      select.appendChild(opt);
    }

    select.addEventListener("change", () => {
      this._handleChange(prop.name, select.value);
    });

    return select;
  }

  /**
   * Create mobility button group
   */
  _createMobilityButtons(prop, value) {
    const wrapper = document.createElement("div");
    wrapper.className = "mobility-buttons";

    for (const [key, option] of Object.entries(prop.options)) {
      const btn = document.createElement("button");
      btn.className =
        "mobility-btn" + (value === option.value ? " active" : "");
      btn.textContent = option.value;
      btn.title = option.tooltip;
      btn.dataset.value = option.value;

      btn.addEventListener("click", () => {
        wrapper
          .querySelectorAll(".mobility-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this._handleChange(prop.name, option.value);
      });

      wrapper.appendChild(btn);
    }

    return wrapper;
  }

  /**
   * Create lighting channel buttons
   */
  _createChannelButtons(prop, value) {
    const wrapper = document.createElement("div");
    wrapper.className = "channel-buttons";

    for (let i = 0; i < prop.channels.length; i++) {
      const btn = document.createElement("button");
      btn.className = "channel-btn" + (value && value[i] ? " active" : "");
      btn.textContent = String(prop.channels[i]);
      btn.title = "Channel " + prop.channels[i];

      btn.addEventListener("click", () => {
        btn.classList.toggle("active");
        const newValue = [...(this.currentValues[prop.name] || value)];
        newValue[i] = btn.classList.contains("active");
        this._handleChange(prop.name, newValue);
      });

      wrapper.appendChild(btn);
    }

    return wrapper;
  }

  /**
   * Create asset picker (placeholder)
   */
  _createAssetPicker(prop, value) {
    const wrapper = document.createElement("div");
    wrapper.className = "asset-picker";

    const display = document.createElement("span");
    display.className = "asset-name";
    display.textContent = value || "None";

    const browseBtn = document.createElement("button");
    browseBtn.className = "browse-btn";
    browseBtn.innerHTML = '<i class="fas fa-folder-open"></i>';
    browseBtn.title = "Browse";

    wrapper.appendChild(display);
    wrapper.appendChild(browseBtn);

    return wrapper;
  }

  /**
   * Handle property value change
   */
  _handleChange(propName, value) {
    this.currentValues[propName] = value;
    this.onPropertyChange(propName, value);

    // Emit event
    if (typeof EventBus !== "undefined") {
      EventBus.emit("property:changed", { name: propName, value: value });
    }
  }

  /**
   * Reset property to default
   */
  _resetProperty(propName, rowEl) {
    const defaultValue = this.defaultValues[propName];
    this.currentValues[propName] = defaultValue;

    // Re-render the row (simplified - could be optimized)
    this.onPropertyChange(propName, defaultValue);

    if (typeof EventBus !== "undefined") {
      EventBus.emit("property:reset", { name: propName, value: defaultValue });
    }
  }

  /**
   * Toggle category expand/collapse
   */
  _toggleCategory(categoryEl) {
    categoryEl.classList.toggle("collapsed");
    const icon = categoryEl.querySelector(".category-expand");
    if (icon) {
      icon.classList.toggle("fa-chevron-down");
      icon.classList.toggle("fa-chevron-right");
    }
  }

  /**
   * Clear all rendered content
   */
  clear() {
    this.container.innerHTML = "";
    this.currentValues = {};
    this.defaultValues = {};
  }

  /**
   * Get current values
   */
  getValues() {
    return { ...this.currentValues };
  }
}

// Export for ES6 modules and global access
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PropertyRenderer };
}
if (typeof window !== "undefined") {
  window.PropertyRenderer = PropertyRenderer;
}
