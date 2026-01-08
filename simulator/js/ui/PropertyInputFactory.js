/**
 * PropertyInputFactory.js
 * Factory for creating UE5-style property input elements
 *
 * Usage:
 *   const factory = new PropertyInputFactory({ onChange: (name, value) => {...} });
 *   const input = factory.create(prop, currentValue);
 */

class PropertyInputFactory {
  constructor(options = {}) {
    this.onChange = options.onChange || (() => {});
  }

  /**
   * Create an input element based on property type
   * @param {Object} prop - Property definition from ActorRegistry
   * @param {*} value - Current value
   * @returns {HTMLElement}
   */
  create(prop, value) {
    const currentValue = value !== undefined ? value : prop.default;

    switch (prop.type) {
      case "float":
      case "int":
        return this.createNumberInput(prop, currentValue);
      case "bool":
        return this.createCheckbox(prop, currentValue);
      case "color":
        return this.createColorPicker(prop, currentValue);
      case "enum":
        return this.createEnumSelect(prop, currentValue);
      default:
        return this.createReadonlyValue(currentValue);
    }
  }

  /**
   * Create a number input with optional unit label
   */
  createNumberInput(prop, value) {
    const wrapper = document.createElement("div");
    wrapper.className = "property-input-wrapper";
    wrapper.style.cssText = "display: flex; align-items: center; flex: 1;";

    const input = document.createElement("input");
    input.type = "number";
    input.className = "property-input";
    input.value = value;
    input.min = prop.min !== undefined ? prop.min : "";
    input.max = prop.max !== undefined ? prop.max : "";
    input.step = prop.type === "int" ? 1 : 0.01;
    input.style.cssText = "flex: 1; min-width: 60px;";

    input.addEventListener("change", () => {
      const newValue =
        prop.type === "int" ? parseInt(input.value) : parseFloat(input.value);
      this.onChange(prop.name, newValue);
    });

    wrapper.appendChild(input);

    if (prop.units) {
      const unitLabel = document.createElement("span");
      unitLabel.className = "unit-label";
      unitLabel.textContent = prop.units;
      unitLabel.style.cssText =
        "margin-left: 4px; color: #888; font-size: 11px;";
      wrapper.appendChild(unitLabel);
    }

    return wrapper;
  }

  /**
   * Create a checkbox input
   */
  createCheckbox(prop, value) {
    const wrapper = document.createElement("label");
    wrapper.className = "property-checkbox-wrapper";
    wrapper.style.cssText =
      "display: flex; align-items: center; cursor: pointer;";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = value;
    input.addEventListener("change", () => {
      this.onChange(prop.name, input.checked);
    });

    wrapper.appendChild(input);

    return wrapper;
  }

  /**
   * Create a color picker input
   */
  createColorPicker(prop, value) {
    const input = document.createElement("input");
    input.type = "color";
    input.className = "color-picker property-color";
    input.value = value || "#FFFFFF";
    input.style.cssText =
      "width: 60px; height: 24px; border: 1px solid #444; cursor: pointer;";

    input.addEventListener("change", () => {
      this.onChange(prop.name, input.value);
    });

    return input;
  }

  /**
   * Create an enum/dropdown select
   */
  createEnumSelect(prop, value) {
    const select = document.createElement("select");
    select.className = "property-select";
    select.style.cssText = "flex: 1;";

    for (const option of prop.options || []) {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      opt.selected = option === value;
      select.appendChild(opt);
    }

    select.addEventListener("change", () => {
      this.onChange(prop.name, select.value);
    });

    return select;
  }

  /**
   * Create a read-only value display for unsupported types
   */
  createReadonlyValue(value) {
    const span = document.createElement("span");
    span.className = "property-readonly";

    if (typeof value === "object" && value !== null) {
      span.textContent = JSON.stringify(value);
    } else {
      span.textContent = String(value);
    }

    return span;
  }

  /**
   * Create a vector input group (X, Y, Z)
   */
  createVectorInput(prop, value, onChange) {
    const vectorContainer = document.createElement("div");
    vectorContainer.className = "vector-input-group";

    const fields = prop.fields || ["X", "Y", "Z"];
    const colors = { X: "red", Y: "green", Z: "blue" };

    for (const field of fields) {
      const fieldWrapper = document.createElement("div");
      fieldWrapper.className = `vector-field-wrapper ${field.toLowerCase()}`;

      // Color bar
      const colorBar = document.createElement("div");
      colorBar.className = `vector-color-bar ${colors[field] || "gray"}`;
      fieldWrapper.appendChild(colorBar);

      const input = document.createElement("input");
      input.type = "text";
      input.className = "vector-input-v2";
      input.value =
        value && value[field] !== undefined ? value[field].toFixed(1) : "0.0";

      input.addEventListener("change", () => {
        const newValue = { ...(value || {}) };
        newValue[field] = parseFloat(input.value) || 0;
        if (onChange) {
          onChange(prop.name, newValue);
        } else {
          this.onChange(prop.name, newValue);
        }
      });

      fieldWrapper.appendChild(input);
      vectorContainer.appendChild(fieldWrapper);
    }

    return vectorContainer;
  }
}

// Export for use
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PropertyInputFactory };
}
if (typeof window !== "undefined") {
  window.PropertyInputFactory = PropertyInputFactory;
}
