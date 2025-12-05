#!/usr/bin/env python3
"""
Add debug navigation handlers to game.js
"""
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))
GAME_JS = os.path.join(PROJECT_ROOT, 'js', 'game.js')

# Code to add after the hard reset button handler
DEBUG_NAV_CODE = '''
        // --- DEBUG NAVIGATION BUTTONS ---
        const debugPrevStep = document.getElementById('debug-prev-step');
        const debugNextStep = document.getElementById('debug-next-step');
        const debugSkipToEnd = document.getElementById('debug-skip-to-end');

        if (debugPrevStep) {
            debugPrevStep.addEventListener('click', () => {
                debugNavigateStep('prev');
            });
        }

        if (debugNextStep) {
            debugNextStep.addEventListener('click', () => {
                debugNavigateStep('next');
            });
        }

        if (debugSkipToEnd) {
            debugSkipToEnd.addEventListener('click', () => {
                debugNavigateStep('end');
            });
        }
    }

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

        if (direction === 'prev') {
            if (currentIndex > 0) {
                newStepId = stepKeys[currentIndex - 1];
            }
        } else if (direction === 'next') {
            if (currentIndex < stepKeys.length - 1) {
                newStepId = stepKeys[currentIndex + 1];
            }
        } else if (direction === 'end') {
            // Find conclusion or last step
            if (scenario.steps['conclusion']) {
                newStepId = 'conclusion';
            } else {
                newStepId = stepKeys[stepKeys.length - 1];
            }
        }

        if (newStepId !== currentStepId) {
            currentStepId = newStepId;
            renderStep(currentScenarioId, currentStepId);
            updateDebugStepDisplay();
            console.log(`🔧 Debug navigated to: ${currentStepId}`);
        }
    }

    /**
     * Updates the debug panel's current step display.
     */
    function updateDebugStepDisplay() {
        const debugCurrentStep = document.getElementById('debug-current-step');
        if (debugCurrentStep) {
            if (currentScenarioId && currentStepId) {
                debugCurrentStep.textContent = currentStepId;
            } else {
                debugCurrentStep.textContent = 'None';
            }
        }
    }'''

def main():
    print("=" * 60)
    print("Adding Debug Navigation to game.js")
    print("=" * 60)
    
    # Read the file
    with open(GAME_JS, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if we already have debug navigation
    if 'debugNavigateStep' in content:
        print("✓ Debug navigation already exists in game.js")
        return True
    
    # Find the end of the hard reset button handler section
    # Look for the closing of the attachEventListeners function
    # Pattern: the modal cancellation handler, then closing braces
    
    marker = "document.body.removeChild(modal);"
    marker_idx = content.find(marker)
    
    if marker_idx == -1:
        print("❌ Could not find the hard reset handler marker")
        return False
    
    # Find the next occurrence of "});\n        }\n    }" after the marker
    # This is the end of the hard reset handler
    search_start = marker_idx + len(marker)
    
    # Find the closing of the cancel button handler and the hard reset handler
    # Pattern: "});\n            });\n        }\n    }"
    end_pattern = "});\n            });\n        }\n    }"
    end_idx = content.find(end_pattern, search_start)
    
    if end_idx == -1:
        # Try with \r\n
        end_pattern = "});\r\n            });\r\n        }\r\n    }"
        end_idx = content.find(end_pattern, search_start)
    
    if end_idx == -1:
        print("❌ Could not find the end pattern")
        print("Trying alternative approach...")
        
        # Alternative: find "    }" after the marker (end of attachEventListeners)
        # and insert before it
        alt_pattern = "\n    }\n"
        alt_idx = content.find(alt_pattern, search_start)
        if alt_idx != -1:
            # Insert our code before the closing brace
            insert_point = alt_idx
            new_content = content[:insert_point] + DEBUG_NAV_CODE + content[insert_point + 6:]  # +6 to skip the "\n    }\n"
            with open(GAME_JS, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("✅ Added debug navigation functions to game.js (alt)")
            return True
        return False
    
    # Insert after the end of the hard reset handler block
    insert_point = end_idx + len(end_pattern) - 6  # Insert before the last "    }"
    
    # Actually, let's be more careful. Find where attachEventListeners ends
    # and insert the new functions just before that closing brace
    
    new_content = content.replace(
        end_pattern,
        end_pattern.replace("}\n    }", DEBUG_NAV_CODE)
    )
    
    with open(GAME_JS, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✅ Added debug navigation functions to game.js")
    return True

if __name__ == '__main__':
    main()
