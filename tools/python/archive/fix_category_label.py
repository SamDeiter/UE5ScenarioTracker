#!/usr/bin/env python3
"""
Fix the category label to use raw value instead of translation lookup
"""
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))
GAME_JS = os.path.join(PROJECT_ROOT, 'js', 'game.js')

def main():
    print("Fixing category label in game.js...")
    
    with open(GAME_JS, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the translation lookup with raw category (truncated if too long)
    old_code = """            const rawCategory = meta.category || SCENARIO_CATEGORIES[scenarioId] || 'General';
            // Convert Category to translation key format: "Audio" -> "category.audio"
            const categoryKey = 'category.' + rawCategory.toLowerCase().replace(' ', '_');
            const categoryLabel = safeT(categoryKey);"""
    
    new_code = """            const rawCategory = meta.category || SCENARIO_CATEGORIES[scenarioId] || 'General';
            // Use raw category name (truncated if too long)
            const categoryLabel = rawCategory.length > 18 ? rawCategory.substring(0, 15) + '...' : rawCategory;"""
    
    if old_code in content:
        content = content.replace(old_code, new_code)
        with open(GAME_JS, 'w', encoding='utf-8') as f:
            f.write(content)
        print("✅ Fixed category label")
        return True
    else:
        print("❌ Could not find the category code to replace")
        return False

if __name__ == '__main__':
    main()
