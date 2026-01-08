#!/usr/bin/env python3
"""
Make debug menu always visible (remove hidden class)
"""
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))
INDEX_HTML = os.path.join(PROJECT_ROOT, 'index.html')

def main():
    print("Making debug menu always visible...")
    
    with open(INDEX_HTML, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove hidden from debug-controls-container
    old = 'id="debug-controls-container" class="flex items-center space-x-2 pl-4 border-l border-gray-700 hidden"'
    new = 'id="debug-controls-container" class="flex items-center space-x-2 pl-4 border-l border-gray-700"'
    
    if old in content:
        content = content.replace(old, new)
        with open(INDEX_HTML, 'w', encoding='utf-8') as f:
            f.write(content)
        print("✅ Debug controls now always visible")
        return True
    else:
        print("❌ Could not find the element")
        return False

if __name__ == '__main__':
    main()
