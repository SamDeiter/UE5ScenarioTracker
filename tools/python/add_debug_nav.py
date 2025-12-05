#!/usr/bin/env python3
"""
Add debug navigation buttons to index.html
"""
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))
INDEX_HTML = os.path.join(PROJECT_ROOT, 'index.html')

def main():
    print("=" * 60)
    print("Adding Debug Navigation to index.html")
    print("=" * 60)
    
    # Read the file
    with open(INDEX_HTML, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if we already have debug navigation
    if 'debug-prev-step' in content:
        print("✓ Debug navigation already exists in index.html")
        return True
    
    # Find and replace the debug dropdown section
    # Look for the start marker
    start_marker = '<!-- Debug Dropdown Menu (Visible only when Debug Mode is ON) -->'
    end_marker = '</div>\n            </div>\n        </div>'  # Closes debug-dropdown, header-controls, header
    
    start_idx = content.find(start_marker)
    if start_idx == -1:
        print("❌ Could not find debug dropdown start marker")
        return False
    
    # Find the end of the dropdown div (after hard-reset-btn's closing div)
    # Search for the closing pattern after the start
    search_start = start_idx + len(start_marker)
    
    # Find the closing </div> for debug-dropdown
    # Count for: debug-dropdown div, then pt-3 div, then button, then /div, then /div
    dropdown_end = content.find('</div>\n            </div>\n        </div>', search_start)
    if dropdown_end == -1:
        # Try with \r\n
        dropdown_end = content.find('</div>\r\n            </div>\r\n        </div>', search_start)
    
    if dropdown_end == -1:
        print("❌ Could not find debug dropdown end marker")
        # Let's try a different approach - find the div closure pattern
        print("Trying alternative approach...")
    
    # Alternative: just replace the specific old pattern with new
    old_dropdown = '''                <!-- Debug Dropdown Menu (Visible only when Debug Mode is ON) -->
                <div id="debug-dropdown"
                    class="absolute top-16 right-8 w-64 p-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 space-y-3 hidden">
                    <h4 class="text-lg font-semibold text-red-400 border-b border-gray-700 pb-2">Admin Tools</h4>

                    <!-- Hard Reset Button -->
                    <div class="pt-3">
                        <button id="hard-reset-btn"
                            class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 rounded-lg text-sm shadow-md transition-all duration-200">
                            Clear Cache & Restart
                        </button>
                    </div>
                </div>'''
    
    new_dropdown = '''                <!-- Debug Dropdown Menu (Visible only when Debug Mode is ON) -->
                <div id="debug-dropdown"
                    class="absolute top-16 right-8 w-72 p-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 space-y-3 hidden">
                    <h4 class="text-lg font-semibold text-red-400 border-b border-gray-700 pb-2">Admin Tools</h4>

                    <!-- Step Navigation -->
                    <div class="space-y-2">
                        <p class="text-xs text-gray-400 uppercase tracking-wide">Step Navigation</p>
                        <div class="flex gap-2">
                            <button id="debug-prev-step"
                                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 rounded-lg text-sm shadow-md transition-all">
                                ← Prev
                            </button>
                            <button id="debug-next-step"
                                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 rounded-lg text-sm shadow-md transition-all">
                                Next →
                            </button>
                        </div>
                        <button id="debug-skip-to-end"
                            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1.5 rounded-lg text-sm shadow-md transition-all">
                            Skip to Conclusion
                        </button>
                    </div>

                    <!-- Current Step Display -->
                    <div class="text-xs text-gray-400 bg-gray-700/50 p-2 rounded">
                        <span>Current: </span><span id="debug-current-step" class="text-yellow-400">None</span>
                    </div>

                    <!-- Hard Reset Button -->
                    <div class="pt-2 border-t border-gray-700">
                        <button id="hard-reset-btn"
                            class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 rounded-lg text-sm shadow-md transition-all">
                            Clear Cache & Restart
                        </button>
                    </div>
                </div>'''
    
    # Normalize line endings for comparison
    content_normalized = content.replace('\r\n', '\n')
    old_dropdown_normalized = old_dropdown.replace('\r\n', '\n')
    
    if old_dropdown_normalized in content_normalized:
        new_content = content_normalized.replace(old_dropdown_normalized, new_dropdown)
        with open(INDEX_HTML, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("✅ Added debug navigation buttons to index.html")
        return True
    else:
        print("❌ Could not match the exact dropdown pattern")
        print("Attempting line-by-line search...")
        
        # Debug: print what we're looking for vs what's there
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if 'debug-dropdown' in line:
                print(f"Line {i}: {repr(line[:80])}")
        
        return False

if __name__ == '__main__':
    main()
