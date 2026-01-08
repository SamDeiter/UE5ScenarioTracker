/**
 * Backlog Renderer Module
 * Renders the scenario list in the left sidebar
 */

const BacklogRenderer = (function () {
  // Category mapping for filtering
  const CATEGORY_MAP = {
    // Lighting & Rendering variations
    lighting_rendering: "look_dev",
    lighting: "look_dev",
    rendering: "look_dev",
    // Materials & Shaders variations
    materials_shaders: "look_dev",
    materials: "look_dev",
    shaders: "look_dev",
    // Physics & Collisions variations
    physics_collisions: "game_dev",
    physics: "game_dev",
    collisions: "game_dev",
    // Blueprints & Logic variations
    blueprints_logic: "game_dev",
    blueprints: "game_dev",
    logic: "game_dev",
    // Sequencer & Cinematics variations
    sequencer_cinematics: "vfx",
    sequencer: "vfx",
    cinematics: "vfx",
    // Asset Management variations
    asset_management: "tech_art",
    assets: "tech_art",
    // World Partition & Streaming variations
    world_partition_streaming: "worldbuilding",
    world_partition: "worldbuilding",
    streaming: "worldbuilding",
    // UI variations
    ui: "game_dev",
    user_interface: "game_dev",
    // Direct matches for new categories
    worldbuilding: "worldbuilding",
    game_dev: "game_dev",
    look_dev: "look_dev",
    tech_art: "tech_art",
    vfx: "vfx",
  };

  /**
   * Normalize a category string
   */
  function normalizeCategory(rawCategory) {
    let category = (rawCategory || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    return CATEGORY_MAP[category] || category;
  }

  /**
   * Filter scenarios by category
   */
  function filterByCategory(scenarios, currentFilter) {
    if (currentFilter === "all") return scenarios;

    return scenarios.filter((item) => {
      const meta = item.data.meta;
      const mappedCategory = normalizeCategory(meta.category);
      return mappedCategory === currentFilter;
    });
  }

  /**
   * Get valid scenarios from SCENARIOS object
   */
  function getValidScenarios() {
    const scenarioKeys = Object.keys(window.SCENARIOS || {});

    return scenarioKeys
      .map((id) => ({ id, data: window.SCENARIOS[id] }))
      .filter(
        (item) =>
          item.data &&
          item.data.meta &&
          item.data.meta.title &&
          typeof item.data.meta.estimateHours !== "undefined"
      );
  }

  /**
   * Update progress display
   */
  function updateProgressDisplay(completedCount, totalCount, filterLabel) {
    const progressText = document.getElementById("progress-text");
    const progressBar = document.getElementById("progress-bar");

    if (progressText) {
      const label = filterLabel ? ` (${filterLabel.replace("_", " ")})` : "";
      progressText.textContent = `${completedCount} of ${totalCount} modules complete${label}`;
    }

    if (progressBar) {
      const percentage =
        totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
      progressBar.style.width = `${percentage}%`;
    }
  }

  /**
   * Create a scenario card element
   */
  function createScenarioCard(options) {
    const {
      scenarioId,
      scenario,
      state,
      index,
      isActive,
      isDebugMode,
      onSelect,
    } = options;

    const meta = scenario.meta;
    const title = meta.title;
    const category = (meta.category || "General").toLowerCase();
    const questionCount = scenario.steps
      ? Object.keys(scenario.steps).filter((k) => k !== "conclusion").length
      : 0;

    let estimate = parseFloat(meta.estimateHours);
    if (isNaN(estimate)) estimate = 0;

    const card = document.createElement("div");

    // Build class list
    let cardClasses =
      "scenario-card bg-ue-bg-medium border border-ue-border-base rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-ue-border-hover";

    if (state.completed) {
      cardClasses += " border-ue-success opacity-75";
    } else if (isActive) {
      cardClasses +=
        " ring-2 ring-assessment-primary border-assessment-primary";
    }

    card.className = cardClasses;
    card.dataset.scenarioId = scenarioId;

    // Status badge
    let statusBadge = "";
    if (state.completed) {
      statusBadge = `<span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-ue-success-bg text-ue-success">Complete</span>`;
    } else if (state.loggedTime > 0) {
      statusBadge = `<span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-ue-warning-bg text-ue-warning">In Progress</span>`;
    }

    // Time color
    const timeColorClass = ScoringManager.getTimeColorClass(
      state.loggedTime,
      estimate
    );

    // Category badge
    const categoryClass = `cat-${normalizeCategory(category)}`;

    card.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <span class="text-xs font-semibold text-ue-text-muted">Module ${
          index + 1
        }</span>
        ${statusBadge}
      </div>
      <h3 class="text-sm font-semibold text-ue-text-primary mb-2 line-clamp-2">${title}</h3>
      <div class="flex items-center gap-2 text-xs text-ue-text-muted mb-2">
        <span class="category-badge ${categoryClass}">${category}</span>
        <span>•</span>
        <span>${questionCount} questions</span>
      </div>
      <div class="flex justify-between items-center text-xs">
        <span class="text-ue-text-tertiary">Est: ${estimate}h</span>
        <span class="${timeColorClass}">${state.loggedTime.toFixed(
      1
    )} hrs logged</span>
      </div>
      ${
        isDebugMode
          ? `<div class="mt-2 text-xs text-yellow-400">[DEBUG: ${scenarioId}]</div>`
          : ""
      }
    `;

    card.addEventListener("click", () => onSelect(scenarioId));

    return card;
  }

  // Public API
  return {
    normalizeCategory,
    filterByCategory,
    getValidScenarios,
    updateProgressDisplay,
    createScenarioCard,
    CATEGORY_MAP,
  };
})();

// Export for use in other modules
window.BacklogRenderer = BacklogRenderer;
