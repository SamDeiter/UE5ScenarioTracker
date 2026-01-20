"""
Recipe Runner - Executes a recipe JSON file via the action dispatcher.

Usage in UE5 Output Log:
    py exec(open(r"path/to/recipe_runner.py").read())
    py run_recipe(r"path/to/recipe.json")
"""
import unreal
import json
import os

def run_recipe(recipe_path: str):
    """
    Loads and executes a recipe JSON file.
    """
    import action_dispatcher
    
    if not os.path.exists(recipe_path):
        unreal.log_error(f"[RecipeRunner] Recipe file not found: {recipe_path}")
        return False
    
    with open(recipe_path, 'r') as f:
        recipe = json.load(f)
    
    recipe_id = recipe.get("recipe_id", "unknown")
    scenario_id = recipe.get("scenario_id", "unknown")
    actions = recipe.get("actions", [])
    
    unreal.log(f"[RecipeRunner] === Starting Recipe: {recipe_id} ===")
    unreal.log(f"[RecipeRunner] Scenario: {scenario_id}")
    unreal.log(f"[RecipeRunner] Actions: {len(actions)}")
    
    for i, action in enumerate(actions):
        action_type = action.get("type", "UNKNOWN")
        unreal.log(f"[RecipeRunner] [{i+1}/{len(actions)}] Executing: {action_type}")
        
        try:
            action_dispatcher.dispatch_action(action)
        except Exception as e:
            unreal.log_error(f"[RecipeRunner] Failed at action {i+1}: {e}")
            return False
    
    unreal.log(f"[RecipeRunner] === Recipe Complete: {recipe_id} ===")
    return True


# Quick test function
def test_pipeline():
    """Test the full pipeline with directional_light recipe."""
    recipe_path = r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\scenarios\directional_light\recipe_step1.json"
    run_recipe(recipe_path)


if __name__ == "__main__":
    unreal.log("[RecipeRunner] Loaded. Use run_recipe(path) to execute a recipe.")
