/**
 * ModuleLoader.js - Centralized Module Management
 *
 * Loads all core modules in the correct order and initializes the simulator.
 * Include this single script in your HTML to bootstrap the entire system.
 *
 * Usage in HTML:
 *   <script src="js/ModuleLoader.js"></script>
 *   <script>
 *     ModuleLoader.init().then(() => {
 *       console.log('Simulator ready!');
 *       // Use SimState, ActorRegistry, etc.
 *     });
 *   </script>
 */

const ModuleLoader = (function () {
  const modules = [
    // Core modules (in dependency order)
    { name: "EventBus", path: "js/core/EventBus.js", required: true },
    { name: "StateManager", path: "js/core/StateManager.js", required: true },
    { name: "ActorRegistry", path: "js/core/ActorRegistry.js", required: true },
    {
      name: "PropertyRenderer",
      path: "js/core/PropertyRenderer.js",
      required: true,
    },
    { name: "IconManager", path: "js/core/IconManager.js", required: false },

    // UI modules
    { name: "ContextMenu", path: "js/ui/ContextMenu.js", required: false },
    { name: "TreeView", path: "js/ui/TreeView.js", required: false },
    { name: "Dropdown", path: "js/ui/Dropdown.js", required: false },
    { name: "TabManager", path: "js/ui/TabManager.js", required: false },
    { name: "Splitter", path: "js/ui/Splitter.js", required: false },
    {
      name: "DetailsController",
      path: "js/ui/DetailsController.js",
      required: false,
    },
    {
      name: "ToolbarController",
      path: "js/ui/ToolbarController.js",
      required: false,
    },
    {
      name: "ViewportToolbar",
      path: "js/ui/ViewportToolbar.js",
      required: false,
    },

    // Simulation modules
    { name: "SimState", path: "js/sim/SimState.js", required: true },
    {
      name: "ScenarioLoader",
      path: "js/sim/ScenarioLoader.js",
      required: true,
    },
    { name: "UIBridge", path: "js/sim/UIBridge.js", required: true },
  ];

  let initialized = false;
  let loadPromise = null;

  /**
   * Dynamically load a script
   */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false; // Maintain order

      script.onload = () => resolve(src);
      script.onerror = () => reject(new Error("Failed to load: " + src));

      document.head.appendChild(script);
    });
  }

  return {
    /**
     * Initialize all modules
     */
    async init() {
      if (initialized) {
        return loadPromise;
      }

      console.log("[ModuleLoader] Starting initialization...");

      loadPromise = (async () => {
        for (const mod of modules) {
          try {
            await loadScript(mod.path);
            console.log("[ModuleLoader] ✓ Loaded:", mod.name);
          } catch (error) {
            if (mod.required) {
              console.error(
                "[ModuleLoader] ✗ Failed to load required module:",
                mod.name,
                error
              );
              throw error;
            } else {
              console.warn(
                "[ModuleLoader] ⚠ Optional module not loaded:",
                mod.name
              );
            }
          }
        }

        initialized = true;
        console.log("[ModuleLoader] All modules loaded successfully!");

        // Dispatch native DOM event for non-EventBus listeners
        document.dispatchEvent(new CustomEvent("ue5:ready"));

        // Emit initialization complete event
        if (typeof EventBus !== "undefined") {
          EventBus.emit("modules:loaded");
        }

        // Expose testing API
        if (typeof window !== "undefined") {
          window.UE5Sim = {
            // Selection API
            selectActor: (name) => SimState.selectActor(name),
            getSelectedActor: () => SimState.getSelectedActor(),

            // Property API
            getPropertyValue: (actor, prop) =>
              SimState.getProperty(actor, prop),
            setPropertyValue: (actor, prop, value) =>
              SimState.setProperty(actor, prop, value),

            // Tool API
            getActiveTool: () => SimState.getActiveTool(),
            setActiveTool: (tool) => SimState.setActiveTool(tool),

            // Validation
            validateScenario: (expected) => SimState.validateScenario(expected),
            loadScenario: (scenario) => SimState.loadScenario(scenario),

            // Get actor registry
            getActorTypes: () => ActorRegistry.getActorTypes(),
            getActorProperties: (type) => ActorRegistry.getAllProperties(type),
          };

          console.log("[ModuleLoader] Testing API exposed as window.UE5Sim");
        }

        return true;
      })();

      return loadPromise;
    },

    /**
     * Check if a specific module is loaded
     */
    isLoaded(moduleName) {
      return typeof window[moduleName] !== "undefined";
    },

    /**
     * Get list of loaded modules
     */
    getLoadedModules() {
      return modules.filter((m) => this.isLoaded(m.name)).map((m) => m.name);
    },
  };
})();

// Auto-init on DOM ready if not already initialized
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => ModuleLoader.init());
} else {
  // DOM already ready
  ModuleLoader.init();
}

// Export
if (typeof window !== "undefined") {
  window.ModuleLoader = ModuleLoader;
}
