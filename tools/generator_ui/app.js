/**
 * UE5 Scenario Generator - Frontend Logic
 */

const API_BASE = 'http://localhost:5000/api';

// State
let scenarios = [];
let selectedScenarios = new Set();
let isGenerating = false;
let selectedModel = null;

// DOM Elements
const elements = {
    apiStatus: document.getElementById('api-status'),
    refreshBtn: document.getElementById('refresh-btn'),
    modelSelect: document.getElementById('model-select'),
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


// Toggle log panel
function toggleLog() {
    const panel = document.getElementById('log-panel');
    panel.classList.toggle('collapsed');
    panel.classList.toggle('expanded');
}

// Update last log message in bar
const originalLog = log;
function log(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    elements.logContent.insertBefore(entry, elements.logContent.firstChild);

    // Update status bar
    const lastMsg = document.getElementById('log-last-message');
    if (lastMsg) {
        lastMsg.textContent = '📝 ' + message;
    }

    // Auto-expand on error
    if (type === 'error') {
        const panel = document.getElementById('log-panel');
        panel.classList.add('has-error');
        panel.classList.remove('collapsed');
        panel.classList.add('expanded');
    }
}

// Logging
function log_old(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    elements.logContent.insertBefore(entry, elements.logContent.firstChild);
}


// Poll generation status
let statusInterval = null;

function startStatusPolling() {
    statusInterval = setInterval(async () => {
        try {
            const status = await fetchApi('/generation-status', {}, 5000);
            if (status.current_scenario) {
                elements.currentScenario.textContent = status.current_scenario;
            }
            elements.tokensUsed.textContent = status.tokens_used.toLocaleString();
            elements.estimatedCost.textContent = '$' + (status.tokens_used * 0.0000002).toFixed(4);
            elements.progressCount.textContent = status.completed + '/' + status.total;
            if (status.total > 0) {
                elements.progressFill.style.width = (status.completed / status.total * 100) + '%';
            }
        } catch (e) { }
    }, 1000);
}

function stopStatusPolling() {
    if (statusInterval) {
        clearInterval(statusInterval);
        statusInterval = null;
    }
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


// Load models from API
async function loadModels() {
    try {
        const data = await fetchApi('/models', {}, 15000);
        if (data.models && data.models.length > 0) {
            elements.modelSelect.innerHTML = '';
            data.models.forEach((model, i) => {
                const option = document.createElement('option');
                option.value = model.id;
                option.textContent = model.name;
                elements.modelSelect.appendChild(option);
            });
            selectedModel = data.models[0].id;
            log('Loaded ' + data.models.length + ' models', 'success');
        }
    } catch (e) {
        log('Failed to load models: ' + e.message, 'error');
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
// Render grouped scenario list
function renderScenarioList() {
    elements.scenarioList.innerHTML = '';

    // Group by category
    const groups = {};
    scenarios.forEach(scenario => {
        const cat = scenario.category || 'Other';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(scenario);
    });

    // Render each group
    Object.keys(groups).sort().forEach(category => {
        const group = document.createElement('div');
        group.className = 'category-group collapsed';

        const categoryClass = getCategoryClass(category);

        group.innerHTML = `
            <div class="category-group-header">
                <span class="toggle-icon">▼</span>
                <span class="category-badge ${categoryClass}">${category}</span>
                <span>(${groups[category].length})</span>
            </div>
            <div class="category-items"></div>
        `;

        // Add click handler only to header
        group.querySelector('.category-group-header').addEventListener('click', (e) => {
            e.stopPropagation();
            group.classList.toggle('collapsed');
        });

        const itemsContainer = group.querySelector('.category-items');

        groups[category].forEach(scenario => {
            const item = document.createElement('div');
            item.className = `scenario-item ${selectedScenarios.has(scenario.id) ? 'selected' : ''}`;
            item.dataset.id = scenario.id;

            const sizeKB = (scenario.file_size / 1024).toFixed(1);

            item.innerHTML = `
                <input type="checkbox" class="scenario-checkbox" ${selectedScenarios.has(scenario.id) ? 'checked' : ''}>
                <span class="status-icon">${scenario.generated ? '✅' : '⏳'}</span>
                <div class="info">
                    <div class="title">${scenario.title}</div>
                    <div class="meta">${scenario.steps} steps${scenario.generated ? ' • ' + sizeKB + 'KB' : ''}</div>
                </div>
            `;

            item.addEventListener('click', (e) => {
                e.stopPropagation();
                if (e.target.type !== 'checkbox') {
                    toggleScenarioSelection(scenario);
                }
            });

            const checkbox = item.querySelector('.scenario-checkbox');
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleScenarioSelection(scenario);
            });

            itemsContainer.appendChild(item);
        });

        elements.scenarioList.appendChild(group);
    });
}

function getCategoryClass(category) {
    if (category.includes('Lighting')) return 'lighting';
    if (category.includes('Blueprint')) return 'blueprints';
    if (category.includes('Material')) return 'materials';
    if (category.includes('World')) return 'world';
    if (category.includes('Physics')) return 'physics';
    if (category.includes('Asset')) return 'asset';
    if (category.includes('Sequencer') || category.includes('Cinematic')) return 'sequencer';
    if (category.includes('Audio')) return 'audio';
    if (category.includes('Performance')) return 'performance';
    return '';
}

// Selection
function toggleScenarioSelection(scenario) {
    if (selectedScenarios.has(scenario.id)) {
        selectedScenarios.delete(scenario.id);
    } else {
        selectedScenarios.add(scenario.id);
    }

    // Update just this item, not the whole list
    const item = document.querySelector(`[data-id="${scenario.id}"]`);
    if (item) {
        item.classList.toggle('selected');
        const checkbox = item.querySelector('.scenario-checkbox');
        if (checkbox) checkbox.checked = selectedScenarios.has(scenario.id);
    }

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
// Show preview as styled card
async function showPreview(scenarioId) {
    try {
        const data = await fetchApi(`/preview/${scenarioId}`);

        elements.previewSection.querySelector('.preview-placeholder').classList.add('hidden');
        elements.previewContent.classList.remove('hidden');

        const content = data.content;
        const meta = content.meta || {};

        // Title and category
        elements.previewTitle.textContent = meta.title || scenarioId;
        elements.previewCategory.textContent = meta.category || 'Unknown';
        elements.previewCategory.className = 'category-badge ' + getCategoryClass(meta.category || '');

        // Description
        const descEl = document.getElementById('preview-description');
        if (descEl) {
            descEl.textContent = meta.description || content.description || 'No description available.';
        }

        // Steps as timeline - traverse linked list for correct order
        const stepsList = document.getElementById('preview-steps-list');
        if (stepsList && content.steps) {
            stepsList.innerHTML = '';

            // Traverse linked list to get correct order
            const orderedSteps = [];
            let currentId = 'step-1'; // Start node
            const visited = new Set();

            while (currentId && content.steps[currentId] && !visited.has(currentId)) {
                visited.add(currentId);
                const step = content.steps[currentId];
                orderedSteps.push({ id: currentId, ...step });
                currentId = step.next;
            }

            // Render as timeline
            orderedSteps.forEach((step, index) => {
                const div = document.createElement('div');
                const isStart = index === 0;
                const isEnd = index === orderedSteps.length - 1 || (step.title && step.title.includes('Complete'));

                div.className = 'timeline-step ' + (isStart ? 'step-start' : isEnd ? 'step-end' : 'step-middle');

                div.innerHTML = `
                    <div class="timeline-title">${step.title || step.action || 'Step ' + (index + 1)}</div>
                    <div class="timeline-prompt">${step.prompt || step.description || ''}</div>
                `;

                stepsList.appendChild(div);
            });
        }

        // Debug info
        elements.previewSteps.textContent = Object.keys(content.steps || {}).length;
        elements.previewSize.textContent = (data.file_size / 1024).toFixed(1);
        elements.previewJson.textContent = JSON.stringify(content, null, 2);

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
    loadModels();
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
    loadModels();
    loadScenarios();
});
