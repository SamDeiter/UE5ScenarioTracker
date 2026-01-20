#!/usr/bin/env python3
"""
Add debug navigation handlers to game.js (in root folder)
"""
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))
GAME_JS = os.path.join(PROJECT_ROOT, 'game.js')

DEBUG_CODE = '''
    // --- DEBUG NAVIGATION ---
    document.getElementById('debug-prev-step')?.addEventListener('click', () => debugNav('prev'));
    document.getElementById('debug-next-step')?.addEventListener('click', () => debugNav('next'));
    document.getElementById('debug-skip-to-end')?.addEventListener('click', () => debugNav('end'));

    function debugNav(dir) {
        if (!currentScenarioId) return;
        const scenario = window.SCENARIOS[currentScenarioId];
        if (!scenario?.steps) return;
        const keys = Object.keys(scenario.steps);
        const idx = keys.indexOf(currentStepId);
        let newStep = currentStepId;
        if (dir === 'prev' && idx > 0) newStep = keys[idx - 1];
        if (dir === 'next' && idx < keys.length - 1) newStep = keys[idx + 1];
        if (dir === 'end') newStep = scenario.steps['conclusion'] ? 'conclusion' : keys[keys.length - 1];
        if (newStep !== currentStepId) {
            currentStepId = newStep;
            renderStep(currentScenarioId, currentStepId);
            const el = document.getElementById('debug-current-step');
            if (el) el.textContent = currentStepId;
            console.log('Debug nav:', currentStepId);
        }
    }

'''

def main():
    print("Adding debug navigation to game.js...")
    
    with open(GAME_JS, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'debugNav' in content:
        print("✓ Debug nav already exists")
        return True
    
    # Find the closing "});" at the very end
    # Insert our code just before it
    end_marker = "});"
    
    # Find the last occurrence
    last_idx = content.rfind(end_marker)
    if last_idx == -1:
        print("❌ Could not find closing marker")
        return False
    
    # Insert our code before the closing
    new_content = content[:last_idx] + DEBUG_CODE + content[last_idx:]
    
    with open(GAME_JS, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✅ Added debug navigation to game.js")
    return True

if __name__ == '__main__':
    main()
