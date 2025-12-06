// Initialize the global SCENARIOS object
window.SCENARIOS = window.SCENARIOS || {};

// The list of scenarios to load
const MANIFEST = [
    'directional_light',
];

// Expose MANIFEST globally
window.MANIFEST = MANIFEST;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MANIFEST;
}
