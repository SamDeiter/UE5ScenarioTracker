#!/usr/bin/env python
"""
Safely overwrite manifest to show ONLY directional_light.
Does not parse the old file - just writes a clean, valid new one.
"""

content = """// Initialize the global SCENARIOS object
window.SCENARIOS = window.SCENARIOS || {};

// The list of scenarios to load
const MANIFEST = [
    'directional_light',
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MANIFEST;
}
"""

with open('scenarios/00_manifest.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Manifest overwritten with clean, minimal version")
print("  Only 'directional_light' is active")
