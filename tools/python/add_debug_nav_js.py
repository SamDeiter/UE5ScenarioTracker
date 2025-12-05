#!/usr/bin/env python3
"""
Add debug navigation handlers to game.js - Simplified approach
Finds the end of attachEventListeners() and inserts the new code there.
"""
import os
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))
GAME_JS = os.path.join(PROJECT_ROOT, 'js', 'game.js')

DEBUG_NAV_HANDLERS = '''
        // --- DEBUG NAVIGATION BUTTONS ---
        const debugPrevStep = document.getElementById('debug-prev-step');
        const debugNextStep = document.getElementById('debug-next-step');
        const debugSkipToEnd = document.getElementById('debug-skip-to-end');

        if (debugPrevStep) {
            debugPrevStep.addEventListener('click', () => debugNavigateStep('prev'));
        }
        if (debugNextStep) {
            debugNextStep.addEventListener('click', () => debugNavigateStep('next'));
        }
        if (debugSkipToEnd) {
            debugSkipToEnd.addEventListener('click', () => debugNavigateStep('end'));
        }'''

DEBUG_NAV_FUNCTIONS = '''
    /**
     * Debug function to navigate between steps in the current scenario.
     * @param {string} direction - 'prev', 'next', or 'end'
     */
    function debugNavigateStep(direction) {
        if (!currentScenarioId) {
            console.warn("No scenario selected");
            return;
        }
        const scenario = window.SCENARIOS[currentScenarioId];
        if (!scenario || !scenario.steps) {
            console.warn("Invalid scenario");
            return;
        }
        const stepKeys = Object.keys(scenario.steps);
        const currentIndex = stepKeys.indexOf(currentStepId);
        let newStepId = currentStepId;

        if (direction === 'prev' && currentIndex > 0) {
            newStepId = stepKeys[currentIndex - 1];
        } else if (direction === 'next' && currentIndex < stepKeys.length - 1) {
            newStepId = stepKeys[currentIndex + 1];
        } else if (direction === 'end') {
            newStepId = scenario.steps['conclusion'] ? 'conclusion' : stepKeys[stepKeys.length - 1];
        }

        if (newStepId !== currentStepId) {
            currentStepId = newStepId;
            renderStep(currentScenarioId, currentStepId);
            updateDebugStepDisplay();
            console.log('🔧 Debug navigated to:', currentStepId);
        }
    }

    function updateDebugStepDisplay() {
        const el = document.getElementById('debug-current-step');
        if (el) {
            el.textContent = (currentScenarioId && currentStepId) ? currentStepId : 'None';
        }
    }

'''

def main():
    print("=" * 60)
    print("Adding Debug Navigation to game.js (v2)")
    print("=" * 60)
    
    with open(GAME_JS, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'debugNavigateStep' in content:
        print("✓ Debug navigation already exists")
        return True
    
    # Find the end of the hard-reset handler section
    # Look for: "document.body.removeChild(modal);" followed by closing braces
    marker = "document.body.removeChild(modal);"
    if marker not in content:
        print("❌ Could not find hard-reset marker")
        return False
    
    # Insert handlers after the hard-reset block closes (before the closing } of attachEventListeners)
    # Find "    }" that closes attachEventListeners function
    
    # Strategy: Find the function calculateTotalIdealTime and insert functions BEFORE it
    calc_func = "function calculateTotalIdealTime"
    if calc_func not in content:
        print("❌ Could not find calculateTotalIdealTime")
        return False
    
    idx = content.find(calc_func)
    # Go back to find the preceding "    /**" comment
    search_start = max(0, idx - 200)
    comment_idx = content.rfind("    /**", search_start, idx)
    
    if comment_idx == -1:
        print("❌ Could not find function comment")
        # Just insert before the function
        insert_idx = idx
    else:
        insert_idx = comment_idx
    
    # Insert the debug functions before calculateTotalIdealTime
    new_content = content[:insert_idx] + DEBUG_NAV_FUNCTIONS + content[insert_idx:]
    
    # Now add the event handlers in attachEventListeners
    # Find the line after hard-reset cancel button handler
    cancel_line = 'console.log("❌ Hard reset cancelled");'
    if cancel_line in new_content:
        # Find the closing of that event listener block
        cancel_idx = new_content.find(cancel_line)
        # Find the next "});" after this
        close_idx = new_content.find("});", cancel_idx)
        if close_idx != -1:
            # Find the second "});" (closing of the hard-reset handler)
            close_idx2 = new_content.find("});", close_idx + 3)
            if close_idx2 != -1:
                # Insert after this
                insert_point = close_idx2 + 4  # After "})\n"
                new_content = new_content[:insert_point] + DEBUG_NAV_HANDLERS + new_content[insert_point:]
    
    with open(GAME_JS, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✅ Added debug navigation to game.js")
    return True

if __name__ == '__main__':
    main()
