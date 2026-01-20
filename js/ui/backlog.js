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
   * Get difficulty level based on estimated hours
   * @param {number} estimateHours - Estimated hours for the scenario
   * @param {number} questionCount - Number of questions in the scenario
   * @returns {Object} {class: string, label: string}
   */
  function getDifficulty(estimateHours, questionCount = 0) {
    // Calculate a difficulty score based on time and question count
    const timeScore = estimateHours || 0;

    // Thresholds:
    // Easy: < 0.5 hours
    // Medium: 0.5 - 1.0 hours
    // Hard: 1.0 - 1.5 hours
    // Expert: > 1.5 hours

    if (timeScore < 0.5) {
      return { class: "easy", label: "Easy" };
    } else if (timeScore < 1.0) {
      return { class: "medium", label: "Medium" };
    } else if (timeScore < 1.5) {
      return { class: "hard", label: "Hard" };
    } else {
      return { class: "expert", label: "Expert" };
    }
  }

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

  /**
   * Full backlog render function
   * @param {Object} options - Render options
   * @param {HTMLElement} options.container - The backlog list container
   * @param {Object} options.scenarioState - Current scenario states
   * @param {Object} options.interruptedSteps - Map of interrupted steps per scenario
   * @param {string} options.currentScenarioId - Currently active scenario ID
   * @param {string} options.currentCategoryFilter - Current category filter
   * @param {Function} options.onSelectScenario - Callback when a scenario is selected
   */
  function render(options) {
    const {
      container,
      scenarioState,
      interruptedSteps,
      currentScenarioId,
      currentCategoryFilter,
      onSelectScenario,
    } = options;

    if (!container) return;

    container.innerHTML = "";

    const validScenarios = getValidScenarios();
    const filteredScenarios = filterByCategory(
      validScenarios,
      currentCategoryFilter
    );

    // Update progress display
    const completedCount = filteredScenarios.filter(
      (item) => scenarioState[item.id]?.completed
    ).length;
    const filterLabel =
      currentCategoryFilter === "all" ? "" : currentCategoryFilter;
    updateProgressDisplay(
      completedCount,
      filteredScenarios.length,
      filterLabel
    );

    filteredScenarios.forEach((item, index) => {
      const scenarioId = item.id;
      const scenario = item.data;
      const state = scenarioState[scenarioId];

      const meta = scenario.meta;
      const title = meta.title;
      const category = (meta.category || "General").toLowerCase();

      let estimate = parseFloat(meta.estimateHours);
      if (isNaN(estimate)) estimate = 0;

      const card = document.createElement("div");
      const isActive = currentScenarioId === scenarioId && !state.completed;

      // Build class list for scenario card
      let cardClasses = "scenario-card mb-3";
      if (state.completed) cardClasses += " completed";
      if (isActive) cardClasses += " active";

      card.className = cardClasses;
      card.dataset.scenarioId = scenarioId;

      // Status pill HTML
      let statusPillHtml;
      const logged = state.loggedTime;

      if (state.completed) {
        statusPillHtml = `<span class="status-pill completed">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Completed
        </span>`;
      } else {
        const savedStepId = interruptedSteps[scenarioId];
        if (savedStepId && savedStepId !== scenario.start) {
          statusPillHtml = `<span class="status-pill in-progress">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            In Progress
          </span>`;
        } else {
          statusPillHtml = `<span class="status-pill not-started">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
            Not Started
          </span>`;
        }
      }

      // Metrics row
      let metricsHtml = "";
      if (state.completed) {
        const loggedColorClass = ScoringManager.getTimeColorClass(
          logged,
          estimate
        );
        metricsHtml = `
          <div class="flex justify-between text-xs mt-2">
            <span class="text-gray-500">Time Logged</span>
            <span class="${loggedColorClass} font-semibold">${logged.toFixed(
          1
        )} hrs</span>
          </div>
        `;
      } else if (logged > 0) {
        metricsHtml = `
          <div class="flex justify-between text-xs mt-2">
            <span class="text-gray-500">Progress</span>
            <span class="text-yellow-400 font-semibold">${logged.toFixed(
              1
            )} hrs logged</span>
          </div>
        `;
      }

      // Get the normalized (parent) category for the badge
      const normalizedCat = normalizeCategory(category);
      const categoryDisplay = normalizedCat.replace(/_/g, " ").toUpperCase();

      // Get difficulty based on estimate
      const difficulty = getDifficulty(estimate);

      const html = `
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="category-badge ${normalizedCat}">${categoryDisplay}</span>
            <span class="difficulty-badge ${difficulty.class}">${
        difficulty.label
      }</span>
          </div>
        </div>
        <h4 class="font-bold text-sm ${
          state.completed ? "text-gray-500 line-through" : "text-gray-100"
        } mb-1">
          Module ${index + 1}: ${title}
        </h4>
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50">
          ${statusPillHtml}
          <span class="text-xs text-gray-500">${estimate.toFixed(
            1
          )} hrs est.</span>
        </div>
        ${metricsHtml}
      `;

      card.innerHTML = html;

      if (!state.completed) {
        card.addEventListener("click", () => onSelectScenario(scenarioId));
      }

      container.appendChild(card);
    });
  }

  // Public API
  return {
    normalizeCategory,
    filterByCategory,
    getValidScenarios,
    updateProgressDisplay,
    createScenarioCard,
    getDifficulty,
    render,
    CATEGORY_MAP,
  };
})();

// Export for use in other modules
window.BacklogRenderer = BacklogRenderer;
