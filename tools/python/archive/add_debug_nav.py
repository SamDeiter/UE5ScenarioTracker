#!/usr/bin/env python3
"""
Add debug navigation to the working app
"""
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))
INDEX_HTML = os.path.join(PROJECT_ROOT, 'index.html')
GAME_JS = os.path.join(PROJECT_ROOT, 'game.js')  # Note: in root, not js/

def add_to_html():
    """Add debug navigation buttons to index.html"""
    with open(INDEX_HTML, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'debug-prev-step' in content:
        print("✓ Debug nav already in HTML")
        return True
    
    old_dropdown = '''                <!-- Debug Dropdown Menu (Visible only when Debug Mode is ON) -->
                <div id="debug-dropdown" class="absolute top-16 right-8 w-64 p-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 space-y-3 hidden">
                    <h4 class="text-lg font-semibold text-red-400 border-b border-gray-700 pb-2">Admin Tools</h4>
                    
                    <!-- 1. Hard Reset (ONLY KEEPING THIS) -->
                    <div class="pt-3">
                        <button id="hard-reset-btn" class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 rounded-lg text-sm shadow-md transition-all duration-200">
                            Clear Cache & Restart
                        </button>
                    </div>
                </div>'''
    
    new_dropdown = '''                <!-- Debug Dropdown Menu (Visible only when Debug Mode is ON) -->
                <div id="debug-dropdown" class="absolute top-16 right-8 w-72 p-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 space-y-3 hidden">
                    <h4 class="text-lg font-semibold text-red-400 border-b border-gray-700 pb-2">Admin Tools</h4>
                    
                    <!-- Step Navigation -->
                    <div class="space-y-2">
                        <p class="text-xs text-gray-400 uppercase tracking-wide">Step Navigation</p>
                        <div class="flex gap-2">
                            <button id="debug-prev-step" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 rounded-lg text-sm">← Prev</button>
                            <button id="debug-next-step" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 rounded-lg text-sm">Next →</button>
                        </div>
                        <button id="debug-skip-to-end" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1.5 rounded-lg text-sm">Skip to Conclusion</button>
                        <div class="text-xs text-gray-400 bg-gray-700/50 p-2 rounded">Current: <span id="debug-current-step" class="text-yellow-400">None</span></div>
                    </div>
                    
                    <!-- Hard Reset -->
                    <div class="pt-2 border-t border-gray-700">
                        <button id="hard-reset-btn" class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 rounded-lg text-sm shadow-md transition-all duration-200">
                            Clear Cache & Restart
                        </button>
                    </div>
                </div>'''
    
    # Normalize for comparison
    content_n = content.replace('\r\n', '\n')
    old_n = old_dropdown.replace('\r\n', '\n')
    
    if old_n in content_n:
        content_n = content_n.replace(old_n, new_dropdown)
        with open(INDEX_HTML, 'w', encoding='utf-8') as f:
            f.write(content_n)
        print("✅ Added debug nav to HTML")
        return True
    else:
        print("❌ Could not find dropdown in HTML")
        return False

def add_to_js():
    """Add debug navigation functions to game.js"""
    with open(GAME_JS, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'debugNavigateStep' in content:
        print("✓ Debug nav already in JS")
        return True
    
    # Find the end of DOMContentLoaded and add functions before it
    marker = "});  // End DOMContentLoaded"
    
    nav_code = '''
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
            console.log('🔧 Debug nav:', currentStepId);
        }
    }

'''
    
    if marker in content:
        content = content.replace(marker, nav_code + marker)
        with open(GAME_JS, 'w', encoding='utf-8') as f:
            f.write(content)
        print("✅ Added debug nav to JS")
        return True
    else:
        # Try alternate marker
        alt_marker = "}); // End DOMContentLoaded"
        if alt_marker in content:
            content = content.replace(alt_marker, nav_code + alt_marker)
            with open(GAME_JS, 'w', encoding='utf-8') as f:
                f.write(content)
            print("✅ Added debug nav to JS (alt)")
            return True
        print("❌ Could not find end marker in JS")
        return False

def main():
    print("=" * 50)
    print("Adding Debug Navigation")
    print("=" * 50)
    add_to_html()
    add_to_js()
    print("Done!")

if __name__ == '__main__':
    main()
