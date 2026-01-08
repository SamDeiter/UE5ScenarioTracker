#!/usr/bin/env python3
"""Add logging to debug the Hard Reset button."""

# Read current JS
with open('game.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Add logging to attachEventListeners
# Find the hard reset block
target_block = """        // Debug: Hard Reset button handler (Wipes all local storage)
        if (hardResetBtn) {
            hardResetBtn.addEventListener('click', () => {"""

replacement_block = """        // Debug: Hard Reset button handler (Wipes all local storage)
        if (hardResetBtn) {
            console.log("✅ Hard Reset button found. Attaching listener.");
            hardResetBtn.addEventListener('click', () => {
                console.log("🔘 Hard Reset button clicked!");"""

if target_block in js_content:
    js_content = js_content.replace(target_block, replacement_block)
    print("✅ Added logging to Hard Reset button listener.")
else:
    print("❌ Could not find Hard Reset button block.")

# Also add an else block to log if it's missing
# We need to find the closing brace of the if (hardResetBtn) block.
# This is tricky with simple replace.
# Let's just add a check at the start of attachEventListeners

start_marker = "    function attachEventListeners() {"
log_check = """    function attachEventListeners() {
        const hardResetBtn = document.getElementById('hard-reset-btn');
        if (!hardResetBtn) console.error("❌ Hard Reset button element NOT found in DOM!");"""

if start_marker in js_content:
    # We need to be careful not to duplicate the const declaration if it's already there
    # The original code has:
    # function attachEventListeners() {
    #     const hardResetBtn = document.getElementById('hard-reset-btn');
    
    # So we can just insert the log after the const declaration
    
    js_content = js_content.replace(
        "const hardResetBtn = document.getElementById('hard-reset-btn'); // Local variable for local usage",
        "const hardResetBtn = document.getElementById('hard-reset-btn');\n        if (!hardResetBtn) console.error('❌ Hard Reset button element NOT found in DOM!');"
    )
    print("✅ Added check for Hard Reset button existence.")

# Write back
with open('game.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
