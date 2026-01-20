/**
 * RecipeRegistry.js
 * Manages loading and mapping of scenario steps to Recipe JSON files.
 */

window.RecipeRegistry = {
  _recipes: {},

  /**
   * Load a recipe file for a specific scenario
   * @param {string} scenarioId
   * @returns {Promise<boolean>}
   */
  async loadRecipe(scenarioId) {
    if (this._recipes[scenarioId]) return true;

    try {
      const response = await fetch(`config/recipes/${scenarioId}.json`);
      if (!response.ok) {
        console.warn(
          `[RecipeRegistry] No recipe found for scenario: ${scenarioId}`
        );
        return false;
      }
      const data = await response.json();
      this._recipes[scenarioId] = data;
      console.log(`[RecipeRegistry] Loaded recipes for: ${scenarioId}`);
      return true;
    } catch (err) {
      console.error(
        `[RecipeRegistry] Error loading recipe for ${scenarioId}:`,
        err
      );
      return false;
    }
  },

  /**
   * Get actions for a specific step in a scenario
   * @param {string} scenarioId
   * @param {string} stepId
   * @returns {Array} - List of actions
   */
  getActions(scenarioId, stepId) {
    const scenarioRecipe = this._recipes[scenarioId];
    if (
      !scenarioRecipe ||
      !scenarioRecipe.scenarios ||
      !scenarioRecipe.scenarios[scenarioId]
    ) {
      return [];
    }

    const scenarioData = scenarioRecipe.scenarios[scenarioId];
    if (scenarioData.steps && scenarioData.steps[stepId]) {
      return scenarioData.steps[stepId].actions || [];
    }

    return [];
  },
};
