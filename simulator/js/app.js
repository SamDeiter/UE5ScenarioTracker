/**
 * UE5 Level Editor Simulator - Main Application
 * Handles actor selection, property editing, and validation
 */

class LevelEditorSimulator {
  constructor() {
    this.selectedActor = null;
    this.scenario = null;
    this.userValues = {};

    // UI Controllers
    this.detailsController = null;
    this.toolbarController = null;
    this.viewportToolbar = null;

    this.init();
  }

  async init() {
    // Initialize IconManager (Spec-driven)
    if (typeof IconManager !== "undefined") {
      await IconManager.init();
    }

    this.initControllers();
    this.bindEvents();
    this.loadScenario("directional_light");
  }

  initControllers() {
    console.log("[UE5Sim] Initializing controllers...");

    // 1. Initialize Docking Managers for each slot
    this.outlinerTabs = new TabManager(
      document.getElementById("outliner-panel"),
      { closeable: false }
    );
    this.viewportTabs = new TabManager(
      document.getElementById("viewport-panel"),
      { closeable: false }
    );
    this.detailsTabs = new TabManager(
      document.getElementById("details-panel"),
      { closeable: false }
    );

    if (typeof window.DockingManager !== "undefined") {
      window.DockingManager.registerManager(this.outlinerTabs);
      window.DockingManager.registerManager(this.viewportTabs);
      window.DockingManager.registerManager(this.detailsTabs);
    }

    // 2. Wrap existing content into Tabs
    const outlinerContent = document.getElementById("outliner-content");
    if (outlinerContent) {
      this.outlinerTabs.addTab({
        id: "outliner",
        label: "Outliner",
        icon: "fa-list-ul",
        content: outlinerContent,
        closeable: false,
      });
    }

    const viewportContent = document.getElementById("viewport-image"); // The main image
    // Wrap viewport image if it exists
    if (viewportContent) {
      this.viewportTabs.addTab({
        id: "viewport",
        label: "Viewport 1",
        icon: "fa-video",
        content: viewportContent,
        closeable: false,
      });
    }

    const detailsContent = document.getElementById("details-properties-area");
    if (detailsContent) {
      this.detailsTabs.addTab({
        id: "details",
        label: "Details",
        icon: "fa-pencil-alt",
        content: detailsContent,
        closeable: false,
      });
    }

    // Details Panel Controller
    if (typeof DetailsController !== "undefined") {
      this.detailsController = new DetailsController({
        container: document.getElementById("details-properties"),
        headerContainer: document.getElementById("details-actor-section"),
        emptyState: document.getElementById("details-empty"),
      });
      console.log("[UE5Sim] DetailsController initialized");
    }

    // Top UI Controllers
    if (typeof ToolbarController !== "undefined") {
      this.toolbarController = new ToolbarController();
    }

    if (typeof ViewportToolbar !== "undefined") {
      this.viewportToolbar = new ViewportToolbar();
    }
  }

  bindEvents() {
    // Outliner selection (exclude clicks on arrows and visibility icons)
    document.querySelectorAll("#outliner-tree .tree-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        // Don't select if clicking on expand arrow or visibility
        if (
          e.target.closest(".expand-arrow") ||
          e.target.closest(".visibility-icon")
        ) {
          return;
        }
        this.selectActor(item);
      });
    });

    // Folder expand/collapse
    document
      .querySelectorAll("#outliner-tree .expand-arrow")
      .forEach((arrow) => {
        arrow.addEventListener("click", (e) => {
          e.stopPropagation();
          const treeItem = arrow.closest(".tree-item");
          this.toggleFolder(treeItem);
        });
      });

    // Visibility toggle
    document
      .querySelectorAll("#outliner-tree .visibility-icon")
      .forEach((icon) => {
        icon.addEventListener("click", (e) => {
          e.stopPropagation();
          icon.classList.toggle("visible");
        });
      });

    // Search filtering
    document
      .getElementById("outliner-search")
      ?.addEventListener("input", (e) => {
        this.filterOutliner(e.target.value);
      });

    // Toolbar Content Browser button
    document
      .getElementById("toolbar-content-browser")
      ?.addEventListener("click", () => {
        if (window.ContentDrawer) {
          window.ContentDrawer.toggle();
        }
      });

    // Status Bar Toggle
    document
      .getElementById("drawer-toggle-btn")
      ?.addEventListener("click", () => {
        if (window.ContentDrawer) {
          window.ContentDrawer.toggle();
        }
      });

    // Settings dropdown toggle
    document
      .getElementById("settings-toggle")
      ?.addEventListener("click", (e) => {
        e.stopPropagation();
        const menu = document.getElementById("settings-menu");
        document.getElementById("filter-menu")?.classList.remove("visible");
        menu?.classList.toggle("visible");
      });

    // Filter dropdown toggle
    document.getElementById("filter-toggle")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = document.getElementById("filter-menu");
      document.getElementById("settings-menu")?.classList.remove("visible");
      menu?.classList.toggle("visible");
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
      const settingsMenu = document.getElementById("settings-menu");
      const filterMenu = document.getElementById("filter-menu");
      const settingsContainer = e.target.closest(
        ".settings-dropdown-container"
      );
      const filterContainer = e.target.closest(".filter-dropdown-container");

      if (!settingsContainer && settingsMenu?.classList.contains("visible")) {
        settingsMenu.classList.remove("visible");
      }
      if (!filterContainer && filterMenu?.classList.contains("visible")) {
        filterMenu.classList.remove("visible");
      }
    });

    // Create Folder button - use stopPropagation to prevent dropdown handlers from interfering
    const folderBtn = document.querySelector(".add-btn");
    if (folderBtn) {
      folderBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        // Use setTimeout to ensure the click event fully completes before prompt
        setTimeout(() => this.createFolder(), 10);
      });
    }

    // Expand All
    document.getElementById("expand-all")?.addEventListener("click", () => {
      document.querySelectorAll(".tree-item.folder").forEach((folder) => {
        folder.dataset.expanded = "true";
        folder.classList.remove("collapsed");
        const folderId = folder.dataset.actorId;
        document
          .querySelectorAll(`[data-parent="${folderId}"]`)
          .forEach((child) => {
            child.classList.remove("hidden-child");
          });
      });
      document.getElementById("settings-menu")?.classList.remove("visible");
    });

    // Collapse All
    document.getElementById("collapse-all")?.addEventListener("click", () => {
      document.querySelectorAll(".tree-item.folder").forEach((folder) => {
        folder.dataset.expanded = "false";
        folder.classList.add("collapsed");
        const folderId = folder.dataset.actorId;
        document
          .querySelectorAll(`[data-parent="${folderId}"]`)
          .forEach((child) => {
            child.classList.add("hidden-child");
          });
      });
      document.getElementById("settings-menu")?.classList.remove("visible");
    });

    // Initialize drag and drop
    this.initDragAndDrop();
  }

  initDragAndDrop() {
    // Delegate to DragDropManager module
    if (typeof DragDropManager !== "undefined") {
      this.dragDropManager = new DragDropManager({
        treeSelector: "#outliner-tree",
        itemSelector: ".tree-item",
        onReorder: (info) => {
          // Re-bind click events on moved items
          info.moved.addEventListener("click", (e) => {
            if (
              !e.target.closest(".expand-arrow") &&
              !e.target.closest(".visibility-icon")
            ) {
              this.selectActor(info.moved);
            }
          });
        },
      });
      this.dragDropManager.init();
    }
  }

  toggleFolder(folderItem) {
    const folderId = folderItem.dataset.actorId;
    const isExpanded = folderItem.dataset.expanded === "true";

    // Toggle expanded state
    folderItem.dataset.expanded = isExpanded ? "false" : "true";
    folderItem.classList.toggle("collapsed", isExpanded);

    // Update folder icon
    const folderIcon = folderItem.querySelector(".folder-icon");
    if (folderIcon) {
      folderIcon.classList.toggle("fa-folder-open", !isExpanded);
      folderIcon.classList.toggle("fa-folder", isExpanded);
    }

    // Show/hide children
    const children = document.querySelectorAll(`[data-parent="${folderId}"]`);
    children.forEach((child) => {
      child.classList.toggle("hidden-child", isExpanded);
    });
  }

  createFolder() {
    // Generate unique ID and default name
    const folderId = `Folder_${Date.now()}`;
    const defaultName = "NewFolder";

    // Get selected items to move into folder (if any)
    const selectedItems = document.querySelectorAll(
      "#outliner-tree .tree-item.selected"
    );

    // Create folder HTML with editable input for name
    const folderHtml = `
      <div class="tree-item folder indent-1" data-actor-id="${folderId}" data-expanded="true" draggable="true">
        <span class="expand-arrow"><i class="fas fa-caret-down"></i></span>
        <i class="fas fa-eye visibility-icon visible"></i>
        <span class="actor-label">
          <img src="icons/Folder.png" class="actor-icon">
          <input type="text" class="folder-name-input" value="${defaultName}">
        </span>
        <span class="actor-type">Folder</span>
      </div>
    `;

    // Find insert position (after world root or selected item)
    const tree = document.getElementById("outliner-tree");
    const worldRoot = tree.querySelector('[data-actor-id="D1"]');

    // Insert folder
    worldRoot.insertAdjacentHTML("afterend", folderHtml);

    // Get the new folder element
    const newFolder = tree.querySelector(`[data-actor-id="${folderId}"]`);
    const nameInput = newFolder.querySelector(".folder-name-input");

    // Focus and select the input for immediate typing
    nameInput.focus();
    nameInput.select();

    // Handle input completion
    const finalizeName = () => {
      const finalName = nameInput.value.trim() || defaultName;
      const labelSpan = newFolder.querySelector(".actor-label");
      labelSpan.innerHTML = `<img src="icons/Folder.png" class="actor-icon"> ${finalName}`;
      console.log(`Created folder: ${finalName} (${folderId})`);
    };

    // Enter to confirm
    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        finalizeName();
      } else if (e.key === "Escape") {
        // Cancel - remove the folder
        newFolder.remove();
      }
    });

    // Blur to save
    nameInput.addEventListener("blur", () => {
      finalizeName();
    });

    // Move selected items into folder if any
    if (selectedItems.length > 0) {
      selectedItems.forEach((item) => {
        if (item.dataset.actorId !== "D1") {
          // Don't move world root
          item.dataset.parent = folderId;
          // Update indent
          item.classList.remove("indent-0", "indent-1", "indent-2", "indent-3");
          item.classList.add("indent-2");
          newFolder.after(item);
        }
      });
    }

    // Re-bind drag events on new folder
    newFolder.addEventListener("dragstart", (e) => this.handleDragStart(e));
    newFolder.addEventListener("dragover", (e) => this.handleDragOver(e));
    newFolder.addEventListener("dragleave", (e) => this.handleDragLeave(e));
    newFolder.addEventListener("drop", (e) => this.handleDrop(e));
    newFolder.addEventListener("dragend", (e) => this.handleDragEnd(e));

    // Bind folder expand/collapse
    newFolder.querySelector(".expand-arrow")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleFolder(newFolder);
    });

    // Bind actor selection
    newFolder.addEventListener("click", () => this.selectActor(newFolder));
  }

  selectActor(treeItem) {
    if (!treeItem) return;

    // Support selection by ID string
    if (typeof treeItem === "string") {
      const element = document.querySelector(
        `#outliner-tree .tree-item[data-actor-id="${treeItem}"]`
      );
      if (element) {
        treeItem = element;
      } else {
        // Fallback: just set selectedActor and try to render
        this.selectedActor = treeItem;
        this._triggerActorSelection(treeItem);
        return;
      }
    }

    // Remove previous selection
    document.querySelectorAll("#outliner-tree .tree-item").forEach((item) => {
      item.classList.remove("selected");
    });

    // Add selection to clicked item
    treeItem.classList.add("selected");
    this.selectedActor = treeItem.dataset.actorId;

    this._triggerActorSelection(this.selectedActor);
  }

  /**
   * Internal helper to trigger selection logic across controllers
   */
  _triggerActorSelection(actorId) {
    // Update actor count
    // === NEW: Sync with SimState module ===
    if (typeof SimState !== "undefined") {
      SimState.selectActor(actorId);
    }

    // Delegate to DetailsController via EventBus or direct call
    const actorType = this.getActorType(actorId);
    if (typeof EventBus !== "undefined") {
      EventBus.emit("actor:selected", {
        name: actorId,
        type: actorType,
      });
    } else if (this.detailsController) {
      this.detailsController.renderActor(actorId, actorType);
    }

    // Update actor count in footer
    const actorCountEl = document.getElementById("actor-count");
    if (actorCountEl) {
      actorCountEl.textContent = `16 actors (1 selected)`;
    }
  }

  getActorType(actorId) {
    if (!actorId) return "Actor";
    if (actorId.includes("DirectionalLight")) return "DirectionalLight";
    if (actorId.includes("PointLight")) return "PointLight";
    if (actorId.includes("SpotLight")) return "SpotLight";
    if (actorId.includes("SkyLight")) return "SkyLight";
    if (
      actorId.includes("StaticMesh") ||
      actorId.includes("Cube") ||
      actorId.includes("Sphere") ||
      actorId.includes("Plane")
    )
      return "StaticMeshActor";
    if (actorId.includes("Folder")) return "Folder";
    if (actorId === "D1") return "World";
    return "Actor";
  }

  onPropertyChange(input) {
    const propertyRow = input.closest(".property-row");
    const propertyName = propertyRow?.dataset.property;

    if (propertyName) {
      if (typeof SimState !== "undefined" && this.selectedActor) {
        SimState.setProperty(
          this.selectedActor,
          propertyName,
          parseFloat(input.value)
        );
      }
      console.log(`Property changed: ${propertyName} = ${input.value}`);
    }
  }

  filterOutliner(searchText) {
    const items = document.querySelectorAll("#outliner-tree .tree-item");
    const lowerSearch = searchText.toLowerCase();

    items.forEach((item) => {
      const label =
        item.querySelector(".actor-label")?.textContent.toLowerCase() || "";
      item.style.display = label.includes(lowerSearch) ? "" : "none";
    });
  }

  validate() {
    if (!this.scenario) {
      this.showResultsModal(
        null,
        "No Scenario",
        "Please load a scenario first."
      );
      return;
    }

    const results = [];
    let totalPoints = 0;
    let earnedPoints = 0;

    // Evaluate each objective
    for (const objective of this.scenario.objectives) {
      totalPoints += objective.points;

      // Get the current value from the DOM
      const currentValue = this.getObjectiveValue(objective);
      const expected = objective.expectedValue;
      const tolerance = objective.tolerance || 0;

      let isCorrect = false;

      // Compare based on type
      if (typeof expected === "boolean") {
        isCorrect = currentValue === expected;
      } else if (typeof expected === "number") {
        isCorrect = Math.abs(currentValue - expected) <= tolerance;
      } else {
        isCorrect = currentValue === expected;
      }

      if (isCorrect) {
        earnedPoints += objective.points;
      }

      results.push({
        id: objective.id,
        property: objective.property,
        expected: expected,
        actual: currentValue,
        tolerance: tolerance,
        correct: isCorrect,
        points: isCorrect ? objective.points : 0,
        maxPoints: objective.points,
        hint: objective.hint,
      });

      // Highlight the property row
      this.highlightObjective(objective, isCorrect);
    }

    const score = Math.round((earnedPoints / totalPoints) * 100);
    const passed = score >= this.scenario.passingScore;

    // Show results
    this.showResultsModal(
      results,
      passed ? "Passed!" : "Try Again",
      null,
      score,
      this.scenario.passingScore
    );

    // Store for SCORM
    this.lastScore = score;
    this.lastResults = results;
  }

  getObjectiveValue(objective) {
    // Try to find the input by ID first
    if (objective.inputSelector) {
      // Handle complex selectors - for now use simpler approach
      if (objective.inputSelector.startsWith("#")) {
        const input = document.querySelector(objective.inputSelector);
        if (input) {
          if (input.type === "checkbox") return input.checked;
          return parseFloat(input.value) || input.value;
        }
      }
    }

    // Fallback: search by property name
    const propertyRows = document.querySelectorAll(".property-row");
    for (const row of propertyRows) {
      const nameEl = row.querySelector(".property-name");
      if (nameEl && nameEl.textContent.trim() === objective.property) {
        const input = row.querySelector("input");
        if (input) {
          if (input.type === "checkbox") return input.checked;
          if (input.type === "number") return parseFloat(input.value);
          return input.value;
        }
      }
    }

    // Check sub-categories too
    const subRows = document.querySelectorAll(".sub-category .property-row");
    for (const row of subRows) {
      const nameEl = row.querySelector(".property-name");
      if (nameEl && nameEl.textContent.trim() === objective.property) {
        const input = row.querySelector("input");
        if (input) {
          if (input.type === "checkbox") return input.checked;
          if (input.type === "number") return parseFloat(input.value);
          return input.value;
        }
      }
    }

    return null;
  }

  highlightObjective(objective, isCorrect) {
    // Find the property row and highlight it
    const allRows = document.querySelectorAll(
      ".property-row, .sub-category .property-row"
    );
    for (const row of allRows) {
      const nameEl = row.querySelector(".property-name");
      if (nameEl && nameEl.textContent.trim() === objective.property) {
        row.classList.remove("correct", "incorrect");
        row.classList.add(isCorrect ? "correct" : "incorrect");
        break;
      }
    }
  }

  showResultsModal(results, title, message, score, passingScore) {
    // Remove existing modal if any
    const existingModal = document.getElementById("results-modal");
    if (existingModal) existingModal.remove();

    // Build results HTML
    let resultsHtml = "";
    if (results) {
      resultsHtml = `
        <div class="results-score" style="font-size: 32px; font-weight: bold; margin: 16px 0; color: ${
          score >= passingScore ? "#4ade80" : "#f87171"
        }">
          Score: ${score}%
        </div>
        <div class="results-status" style="margin-bottom: 16px; color: ${
          score >= passingScore ? "#4ade80" : "#f87171"
        }">
          ${
            score >= passingScore
              ? "✓ Passed"
              : "✗ Below passing score of " + passingScore + "%"
          }
        </div>
        <div class="results-list" style="text-align: left; max-height: 300px; overflow-y: auto;">
          ${results
            .map(
              (r) => `
            <div class="result-item" style="padding: 8px; margin: 4px 0; background: ${
              r.correct ? "rgba(74, 222, 128, 0.1)" : "rgba(248, 113, 113, 0.1)"
            }; border-radius: 4px; border-left: 3px solid ${
                r.correct ? "#4ade80" : "#f87171"
              }">
              <div style="font-weight: 500;">${r.correct ? "✓" : "✗"} ${
                r.property
              }</div>
              <div style="font-size: 11px; color: var(--text-muted);">
                Expected: ${r.expected}${
                r.tolerance ? " ±" + r.tolerance : ""
              } | Actual: ${r.actual}
              </div>
              ${
                !r.correct
                  ? `<div style="font-size: 11px; color: #fbbf24; margin-top: 4px;">💡 ${r.hint}</div>`
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
      `;
    } else if (message) {
      resultsHtml = `<p>${message}</p>`;
    }

    const modal = document.createElement("div");
    modal.id = "results-modal";
    modal.innerHTML = `
      <div class="modal-backdrop" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center;">
        <div class="modal-content" style="background: var(--ue5-panel-bg); border: 1px solid var(--ue5-border-color); border-radius: 8px; padding: 24px; min-width: 400px; max-width: 500px; text-align: center;">
          <h2 style="margin: 0 0 16px 0; color: var(--text-primary);">${title}</h2>
          ${resultsHtml}
          <button id="close-results" style="margin-top: 16px; padding: 8px 24px; background: var(--color-accent-blue); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
            ${score >= passingScore ? "Continue" : "Try Again"}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close button
    document.getElementById("close-results").addEventListener("click", () => {
      modal.remove();
    });

    // Click backdrop to close
    modal.querySelector(".modal-backdrop").addEventListener("click", (e) => {
      if (e.target === modal.querySelector(".modal-backdrop")) {
        modal.remove();
      }
    });
  }

  reset() {
    // Clear selection
    document.querySelectorAll("#outliner-tree .tree-item").forEach((item) => {
      item.classList.remove("selected");
    });
    this.selectedActor = null;

    // Reset to default values based on scenario
    if (this.scenario) {
      // Reset all tracked properties to their original values
      document.getElementById("intensity-input").value = "10.0";
      document.getElementById("shadow-distance-input").value = "20000";
    }

    this.userValues = {};

    // Clear validation states
    document.querySelectorAll(".property-row").forEach((row) => {
      row.classList.remove("correct", "incorrect");
    });

    // Hide details
    this.showDetails(null);

    // Update actor count
    document.getElementById("actor-count").textContent =
      "16 actors (0 selected)";
  }

  async loadScenario(scenarioId) {
    try {
      // Try to fetch scenario from JSON file
      const response = await fetch(`scenarios/${scenarioId}.json`);
      if (!response.ok) {
        throw new Error(`Scenario not found: ${scenarioId}`);
      }
      this.scenario = await response.json();
    } catch (error) {
      // Fallback: use embedded scenario data for local file:// testing
      console.warn(
        "Fetch failed (likely CORS on file://), using embedded data:",
        error.message
      );
      this.scenario = this.getEmbeddedScenario(scenarioId);
      if (!this.scenario) {
        this.showResultsModal(
          null,
          "Error",
          `Failed to load scenario: ${error.message}`
        );
        return null;
      }
    }

    console.log(`Loaded scenario: ${this.scenario.title}`);

    // Update UI to show scenario info
    this.updateScenarioUI();

    // Auto-select target actor if specified
    if (this.scenario.targetActor) {
      const targetItem = document.querySelector(
        `#outliner-tree .tree-item[data-actor-id="${this.scenario.targetActor}"]`
      );
      if (targetItem) {
        this.selectActor(targetItem);
      }
    }

    return this.scenario;
  }

  getEmbeddedScenario(scenarioId) {
    // Embedded scenario data for local file:// testing (bypasses CORS)
    const scenarios = {
      directional_light: {
        id: "directional_light_basics",
        title: "DirectionalLight Configuration",
        description:
          "Configure the scene's main directional light for outdoor sunlight simulation.",
        targetActor: "DirectionalLight",
        objectives: [
          {
            id: "set_intensity",
            property: "Intensity",
            category: "Light",
            expectedValue: 10.0,
            tolerance: 0.5,
            points: 25,
            hint: "Set intensity to approximately 10 lux for bright outdoor sun",
          },
          {
            id: "enable_shadows",
            property: "Cast Shadows",
            category: "Light",
            expectedValue: true,
            tolerance: 0,
            points: 25,
            hint: "Enable Cast Shadows for realistic outdoor lighting",
          },
          {
            id: "set_shadow_distance",
            property: "Dynamic Shadow Distance",
            category: "Cascaded Shadow Maps",
            expectedValue: 20000,
            tolerance: 2000,
            points: 25,
            hint: "Set Dynamic Shadow Distance to around 20000 for distant shadows",
          },
          {
            id: "set_source_angle",
            property: "Source Angle",
            category: "Light",
            expectedValue: 0.5357,
            tolerance: 0.1,
            points: 25,
            hint: "Set Source Angle to approximately 0.5 for soft sun edges",
          },
        ],
        passingScore: 75,
      },
    };
    return scenarios[scenarioId] || null;
  }

  updateScenarioUI() {
    // Scenario info stays hidden - user can view via toolbar if needed
    // To show: uncomment the block below
    /*
    const infoPanel = document.getElementById("scenario-info");
    if (infoPanel && this.scenario) {
      infoPanel.querySelector(".scenario-title").textContent = this.scenario.title;
      infoPanel.querySelector(".scenario-desc").textContent = this.scenario.description;
      infoPanel.querySelector(".scenario-objectives").textContent = 
        `${this.scenario.objectives.length} objectives | Pass: ${this.scenario.passingScore}%`;
      infoPanel.style.display = "block";
    }
    */
  }
}

// Initialize when modules are loaded via ModuleLoader (robust method)
document.addEventListener("ue5:ready", () => {
  if (!window.simulator) {
    console.log("[UE5Sim] All modules ready, initializing simulator...");
    window.simulator = new LevelEditorSimulator();
  }
});

// Fallback: If modules are already loaded by the time app.js runs
if (
  typeof ModuleLoader !== "undefined" &&
  ModuleLoader.isLoaded &&
  ModuleLoader.isLoaded("DetailsController")
) {
  if (!window.simulator) {
    console.log("[UE5Sim] Modules already loaded, initializing simulator...");
    window.simulator = new LevelEditorSimulator();
  }
}

// Mobility button toggle handler
document.querySelectorAll(".mobility-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active from all siblings
    btn.parentElement
      .querySelectorAll(".mobility-btn")
      .forEach((b) => b.classList.remove("active"));
    // Set active on clicked button
    btn.classList.add("active");
    console.log("[UE5Sim] Mobility set to:", btn.dataset.value);
  });
});

// Scale lock toggle handler
document.querySelectorAll(".scale-lock-icon").forEach((icon) => {
  icon.addEventListener("click", () => {
    icon.classList.toggle("locked");
    icon.classList.toggle("fa-lock");
    icon.classList.toggle("fa-unlock");
    console.log("[UE5Sim] Scale lock:", icon.classList.contains("locked"));
  });
});

// =====================================================
// TRANSFORM DROPDOWN TOGGLE - Click to show/hide
// =====================================================
document.querySelectorAll(".transform-label-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const target = btn.dataset.target;
    const dropdown = document.querySelector(
      '.transform-dropdown[data-for="' + target + '"]'
    );

    // Close all other dropdowns first
    document.querySelectorAll(".transform-dropdown").forEach((d) => {
      if (d !== dropdown) d.classList.remove("visible");
    });

    // Toggle this dropdown
    dropdown.classList.toggle("visible");
  });
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".transform-label-container")) {
    document.querySelectorAll(".transform-dropdown").forEach((d) => {
      d.classList.remove("visible");
    });
  }
});

// Handle radio selection in dropdown
document
  .querySelectorAll('.transform-dropdown input[type="radio"]')
  .forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const dropdown = e.target.closest(".transform-dropdown");
      const forAttr = dropdown.dataset.for;
      const labelBtn = document.querySelector(
        '.transform-label-btn[data-target="' + forAttr + '"]'
      );
      const value = e.target.value;

      // Update the label text
      const labelText = labelBtn.querySelector(".label-text");
      const typeName = forAttr.charAt(0).toUpperCase() + forAttr.slice(1);
      labelText.textContent =
        value === "world" ? "Absolute " + typeName : typeName;

      // Close the dropdown
      dropdown.classList.remove("visible");

      console.log("[UE5Sim]", forAttr, "type set to:", value);
    });
  });

// Scale lock button toggle
document.querySelectorAll(".scale-lock-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("locked");
    const icon = btn.querySelector("i");
    if (btn.classList.contains("locked")) {
      icon.classList.remove("fa-unlock");
      icon.classList.add("fa-lock");
    } else {
      icon.classList.remove("fa-lock");
      icon.classList.add("fa-unlock");
    }
    console.log("[UE5Sim] Scale lock:", btn.classList.contains("locked"));
  });
});

// =====================================================
// RESIZABLE PANEL SPLITTERS
// =====================================================
(function () {
  const container = document.getElementById("main-area");
  const outlinerPanel = document.getElementById("outliner-panel");
  const detailsPanel = document.getElementById("details-panel");
  const splitterLeft = document.getElementById("splitter-left");
  const splitterRight = document.getElementById("splitter-right");

  let isResizing = false;
  let currentSplitter = null;

  function startResize(e, splitter) {
    isResizing = true;
    currentSplitter = splitter;
    document.body.classList.add("resizing-col");
    splitter.classList.add("dragging");
    e.preventDefault();
  }

  function stopResize() {
    if (!isResizing) return;
    isResizing = false;
    document.body.classList.remove("resizing-col");
    if (currentSplitter) {
      currentSplitter.classList.remove("dragging");
    }
    currentSplitter = null;
  }

  function resize(e) {
    if (!isResizing || !currentSplitter) return;

    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;

    if (currentSplitter.id === "splitter-left") {
      // Resizing outliner width
      const newWidth = Math.max(150, Math.min(mouseX, containerWidth * 0.4));
      outlinerPanel.style.width = newWidth + "px";
      container.style.gridTemplateColumns =
        newWidth + "px 4px 1fr 4px " + (detailsPanel.offsetWidth || 350) + "px";
    } else if (currentSplitter.id === "splitter-right") {
      // Resizing details width - dragging left edge of details panel
      const detailsWidth = Math.max(
        200,
        Math.min(containerWidth - mouseX, containerWidth * 0.6)
      );
      detailsPanel.style.width = detailsWidth + "px";
      container.style.gridTemplateColumns =
        (outlinerPanel.offsetWidth || 280) +
        "px 4px 1fr 4px " +
        detailsWidth +
        "px";
    }
  }

  // Attach event listeners
  if (splitterLeft) {
    splitterLeft.addEventListener("mousedown", (e) =>
      startResize(e, splitterLeft)
    );
  }
  if (splitterRight) {
    splitterRight.addEventListener("mousedown", (e) =>
      startResize(e, splitterRight)
    );
  }

  document.addEventListener("mousemove", resize);
  document.addEventListener("mouseup", stopResize);

  // Initialize grid with splitters (update from 3-column to 5-column grid)
  if (container && outlinerPanel && detailsPanel) {
    const outlinerWidth =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--outliner-width")
        .trim() || "280px";
    const detailsWidth =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--details-width")
        .trim() || "350px";
    container.style.gridTemplateColumns =
      outlinerWidth + " 4px 1fr 4px " + detailsWidth;
    container.style.gridTemplateAreas =
      '"outliner splitter-left viewport splitter-right details"';
  }

  console.log("[UE5Sim] Resizable panels initialized");
})();

// =====================================================
// DETAILS PANEL COLUMN RESIZER
// =====================================================
(function () {
  const detailsProps = document.getElementById("details-properties");
  if (!detailsProps) return;

  // Create the resizer element
  const resizer = document.createElement("div");
  resizer.className = "details-column-resizer";
  resizer.style.left = "40%";
  detailsProps.appendChild(resizer);

  let isResizing = false;
  let startX = 0;
  let startWidth = 50;

  resizer.addEventListener("mousedown", (e) => {
    isResizing = true;
    startX = e.clientX;
    const computedWidth = getComputedStyle(detailsProps).getPropertyValue(
      "--name-column-width"
    );
    startWidth = parseFloat(computedWidth) || 50;
    document.body.classList.add("resizing-col");
    resizer.classList.add("dragging");
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;

    const rect = detailsProps.getBoundingClientRect();
    const deltaX = e.clientX - startX;
    const deltaPercent = (deltaX / rect.width) * 100;
    const newWidth = Math.max(15, Math.min(70, startWidth + deltaPercent));

    detailsProps.style.setProperty("--name-column-width", newWidth + "%");
    resizer.style.left = newWidth + "%";
  });

  document.addEventListener("mouseup", () => {
    if (!isResizing) return;
    isResizing = false;
    document.body.classList.remove("resizing-col");
    resizer.classList.remove("dragging");
  });

  console.log("[UE5Sim] Details column resizer initialized");
})();

// =====================================================
// PROPERTY RESET BUTTONS
// =====================================================
document.querySelectorAll(".property-reset").forEach((resetBtn) => {
  resetBtn.addEventListener("click", (e) => {
    const row = e.target.closest(".property-row");
    if (!row) return;

    // Find all inputs in this row and reset them
    const inputs = row.querySelectorAll("input, select");
    inputs.forEach((input) => {
      if (input.dataset.defaultValue !== undefined) {
        input.value = input.dataset.defaultValue;
      }
    });

    // Remove modified class
    row.classList.remove("modified");

    console.log("[UE5Sim] Property reset to default");
  });
});

// Track when properties are modified
document
  .querySelectorAll(".property-row input, .property-row select")
  .forEach((input) => {
    // Store default value on load
    input.dataset.defaultValue = input.value;

    input.addEventListener("change", () => {
      const row = input.closest(".property-row");
      if (row && input.value !== input.dataset.defaultValue) {
        row.classList.add("modified");
      } else if (row) {
        row.classList.remove("modified");
      }
    });
  });

// =====================================================
// DETAILS HEADER HORIZONTAL SPLITTER
// Resizes the header section (actor info, component tree)
// UE5-style: header expands/contracts, splitter follows mouse
// =====================================================
(function () {
  const splitter = document.getElementById("details-header-splitter");
  const detailsPanel = document.getElementById("details-panel");
  const detailsContent = document.getElementById("details-content");
  const actorSection = document.getElementById("details-actor-section");

  if (!splitter || !detailsPanel || !detailsContent) return;

  let isResizing = false;
  let startY = 0;
  let startHeight = 0;

  splitter.addEventListener("mousedown", (e) => {
    isResizing = true;
    startY = e.clientY;
    // Get the current height of the actor section (the resizable part)
    startHeight = actorSection ? actorSection.offsetHeight : 100;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
    splitter.classList.add("dragging");
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;

    const deltaY = e.clientY - startY;
    // Calculate new height with constraints (min 60px, max 300px)
    const newHeight = Math.max(60, Math.min(startHeight + deltaY, 300));

    // Resize the actor section directly - no margin tricks
    if (actorSection) {
      actorSection.style.height = newHeight + "px";
      actorSection.style.minHeight = newHeight + "px";
      actorSection.style.maxHeight = newHeight + "px";
      actorSection.style.overflow = "hidden";
    }

    // Ensure content has no rogue margin
    detailsContent.style.marginTop = "0";
  });

  document.addEventListener("mouseup", () => {
    if (!isResizing) return;
    isResizing = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    splitter.classList.remove("dragging");
  });

  console.log("[UE5Sim] Horizontal splitter initialized (fixed)");
})();
