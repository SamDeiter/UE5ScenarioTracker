/**
 * UE5 Scenario Generator - Frontend Logic
 */

const API_BASE = 'http://localhost:5000/api';

// State
let scenarios = [];
let selectedScenarios = new Set();
let isGenerating = false;

// DOM Elements
const elements = {
    apiStatus: document.getElementById('api-status'),
    refreshBtn: document.getElementById('refresh-btn'),
    scenarioList: document.getElementById('scenario-list'),
    scenarioCount: document.getElementById('scenario-count'),
    generateSelectedBtn: document.getElementById('generate-selected-btn'),
    generateAllBtn: document.getElementById('generate-all-btn'),
    progressSection: document.getElementById('progress-section'),
    progressTitle: document.getElementById('progress-title'),
    progressCount: document.getElementById('progress-count'),
    progressFill: document.getElementById('progress-fill'),
    currentScenario: document.getElementById('current-scenario'),
    tokensUsed: document.getElementById('tokens-used'),
    estimatedCost: document.getElementById('estimated-cost'),
    previewSection: document.getElementById('preview-section'),
    previewContent: document.getElementById('preview-content'),
    previewTitle: document.getElementById('preview-title'),
    previewCategory: document.getElementById('preview-category'),
    previewSteps: document.getElementById('preview-steps'),
    previewSize: document.getElementById('preview-size'),
    previewJson: document.getElementById('preview-json'),
    logContent: document.getElementById('log-content'),
    clearLogBtn: document.getElementById('clear-log-btn')
};

// Logging
function log(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    elements.logContent.insertBefore(entry, elements.logContent.firstChild);
}

// API Calls
async function fetchApi(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        return await response.json();
    } catch (error) {
        log(`API Error: ${error.message}`, 'error');
        throw error;
    }
}

// Check API Status
async function checkApiStatus() {
    try {
        const data = await fetchApi('/status');
        elements.apiStatus.textContent = data.api_status === 'connected'
            ? `✅ Connected (${data.api_key_preview})`
            : '❌ Not configured';
        elements.apiStatus.className = `status-badge ${data.api_status === 'connected' ? 'connected' : 'error'}`;
        log(`API Status: ${data.api_status}`, data.api_status === 'connected' ? 'success' : 'error');
    } catch {
        elements.apiStatus.textContent = '❌ Server offline';
        elements.apiStatus.className = 'status-badge error';
    }
}

// Load Scenarios
async function loadScenarios() {
    elements.scenarioList.innerHTML = '<div class="loading">Loading scenarios...</div>';

    try {
        const data = await fetchApi('/scenarios');
        scenarios = data.scenarios;

        elements.scenarioCount.textContent = `${data.generated} / ${data.total}`;

        renderScenarioList();
        log(`Loaded ${data.total} scenarios (${data.generated} generated)`, 'success');
    } catch {
        elements.scenarioList.innerHTML = '<div class="loading">Failed to load scenarios</div>';
    }
}

// Render Scenario List
function renderScenarioList() {
    elements.scenarioList.innerHTML = '';

    scenarios.forEach(scenario => {
        const item = document.createElement('div');
        item.className = `scenario-item ${selectedScenarios.has(scenario.id) ? 'selected' : ''}`;
        item.dataset.id = scenario.id;

        const categoryClass = getCategoryClass(scenario.category);
        const sizeKB = (scenario.file_size / 1024).toFixed(1);

        item.innerHTML = `
            <span class="status-icon">${scenario.generated ? '✅' : '⏳'}</span>
            <div class="info">
                <div class="title">${scenario.title}</div>
                <div class="meta">${scenario.steps} steps • ${scenario.estimated_hours}h${scenario.generated ? ` • ${sizeKB}KB` : ''}</div>
            </div>
            <span class="category-badge ${categoryClass}">${scenario.category}</span>
        `;

        item.addEventListener('click', () => toggleScenarioSelection(scenario));

        elements.scenarioList.appendChild(item);
    });
}

function getCategoryClass(category) {
    if (category.includes('Lighting')) return 'lighting';
    if (category.includes('Blueprint')) return 'blueprints';
    if (category.includes('Material')) return 'materials';
    if (category.includes('World')) return 'world';
    if (category.includes('Physics')) return 'physics';
    return '';
}

// Selection
function toggleScenarioSelection(scenario) {
    if (selectedScenarios.has(scenario.id)) {
        selectedScenarios.delete(scenario.id);
    } else {
        selectedScenarios.add(scenario.id);
    }

    renderScenarioList();
    updateButtons();

    // Show preview if only one selected
    if (selectedScenarios.size === 1 && scenario.generated) {
        showPreview(scenario.id);
    }
}

function updateButtons() {
    elements.generateSelectedBtn.disabled = selectedScenarios.size === 0 || isGenerating;
    elements.generateAllBtn.disabled = isGenerating;
}

// Preview
async function showPreview(scenarioId) {
    try {
        const data = await fetchApi(`/preview/${scenarioId}`);

        elements.previewSection.querySelector('.preview-placeholder').classList.add('hidden');
        elements.previewContent.classList.remove('hidden');

        elements.previewTitle.textContent = data.content.meta?.title || scenarioId;
        elements.previewCategory.textContent = data.content.meta?.category || 'Unknown';
        elements.previewSteps.textContent = Object.keys(data.content.steps || {}).length;
        elements.previewSize.textContent = (data.file_size / 1024).toFixed(1);
        elements.previewJson.textContent = JSON.stringify(data.content, null, 2);

    } catch (error) {
        log(`Failed to load preview: ${error.message}`, 'error');
    }
}

// Generation
async function generateScenarios(scenarioIds) {
    if (isGenerating) return;

    isGenerating = true;
    updateButtons();

    elements.progressSection.classList.remove('hidden');

    let completed = 0;
    let totalTokens = 0;

    for (const id of scenarioIds) {
        elements.currentScenario.textContent = id;
        elements.progressCount.textContent = `${completed + 1}/${scenarioIds.length}`;
        elements.progressFill.style.width = `${(completed / scenarioIds.length) * 100}%`;

        log(`Generating: ${id}...`, 'info');

        try {
            const result = await fetchApi('/generate', {
                method: 'POST',
                body: JSON.stringify({ scenario_id: id })
            });

            if (result.success) {
                totalTokens += result.tokens_used;
                elements.tokensUsed.textContent = totalTokens.toLocaleString();
                elements.estimatedCost.textContent = `$${(totalTokens * 0.0000002).toFixed(4)}`;

                log(`✅ Generated ${id} (${result.tokens_used} tokens)`, 'success');
            } else {
                log(`❌ Failed: ${result.error}`, 'error');
            }
        } catch (error) {
            log(`❌ Error: ${error.message}`, 'error');
        }

        completed++;
        elements.progressFill.style.width = `${(completed / scenarioIds.length) * 100}%`;
    }

    elements.progressTitle.textContent = 'Complete!';
    elements.currentScenario.textContent = '-';

    isGenerating = false;
    updateButtons();

    // Refresh list
    await loadScenarios();
}

// Event Listeners
elements.refreshBtn.addEventListener('click', () => {
    checkApiStatus();
    loadScenarios();
});

elements.generateSelectedBtn.addEventListener('click', () => {
    const ids = Array.from(selectedScenarios);
    generateScenarios(ids);
});

elements.generateAllBtn.addEventListener('click', () => {
    const missing = scenarios.filter(s => !s.generated).map(s => s.id);
    if (missing.length === 0) {
        log('All scenarios already generated!', 'success');
        return;
    }
    generateScenarios(missing);
});

elements.clearLogBtn.addEventListener('click', () => {
    elements.logContent.innerHTML = '<div class="log-entry info">Log cleared</div>';
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkApiStatus();
    loadScenarios();
});
