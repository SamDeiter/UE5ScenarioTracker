#!/usr/bin/env python3
"""
Fix the category color lookup to use shortened name
"""
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))
GAME_JS = os.path.join(PROJECT_ROOT, 'js', 'game.js')

def main():
    print("Fixing category color lookup in game.js...")
    
    with open(GAME_JS, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix: use categoryLabel (shortened) for color lookup instead of rawCategory
    old_code = "let categoryColorClass = categoryColors[rawCategory] || 'bg-gray-700 text-gray-300 border-gray-600';"
    new_code = "let categoryColorClass = categoryColors[categoryLabel] || 'bg-gray-700 text-gray-300 border-gray-600';"
    
    if old_code in content:
        content = content.replace(old_code, new_code)
        with open(GAME_JS, 'w', encoding='utf-8') as f:
            f.write(content)
        print("✅ Fixed color lookup to use shortened category name")
        return True
    else:
        print("❌ Could not find the code to replace")
        return False

if __name__ == '__main__':
    main()
