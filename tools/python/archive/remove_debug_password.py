#!/usr/bin/env python3
"""
Remove password gate from debug menu - make it always accessible
"""
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))
GAME_JS = os.path.join(PROJECT_ROOT, 'game.js')

def main():
    print("Removing debug password gate...")
    
    with open(GAME_JS, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find and remove the password modal logic
    # Look for the keydown event listener that shows password modal
    old_code = """        // --- ADMIN ACCESS (CTRL + SHIFT + DELETE + Password Gate) ---
        document.addEventListener('keydown', (e) => {
            // Check for the combination: CTRL + SHIFT + DELETE (KeyCode 46 is Delete on most systems)
            if (e.ctrlKey && e.shiftKey && (e.key === 'Delete' || e.keyCode === 46)) {
                e.preventDefault();
                // If Debug Mode is already on, the combination turns it off without a password
                if (isDebugMode) {
                    toggleDebugMode(true); // Force Disable
                } else if (!debugAccessState.passwordModalVisible) {
                    showPasswordModal();
                }
            }
        });"""
    
    # Replace with simple toggle
    new_code = """        // --- DEBUG TOGGLE (No Password Required) ---
        // Debug checkbox now controls debug mode directly
        if (debugToggle) {
            debugToggle.addEventListener('change', () => {
                toggleDebugMode();
            });
        }"""
    
    if old_code in content:
        content = content.replace(old_code, new_code)
        with open(GAME_JS, 'w', encoding='utf-8') as f:
            f.write(content)
        print("✅ Removed password gate - debug toggle now works directly")
        return True
    else:
        print("⚠️ Could not find exact password code, checking for variations...")
        # Try to find and remove just the password modal function
        if 'showPasswordModal' in content:
            print("✓ Password modal code still exists but may have different format")
            print("  Manual review recommended")
        return False

if __name__ == '__main__':
    main()
