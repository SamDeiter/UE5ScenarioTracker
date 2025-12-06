/**
 * UE5 Scenario Generator - Frontend Logic
 */

const API_BASE = 'http://localhost:5000/api';

// State
let scenarios = [];
let filteredScenarios = [];
let selectedScenarios = new Set();
let isGenerating = false;
let selectedModel = null;
let currentFilters = {
    search: '',
    status: 'all',
    category: 'all'
};
let currentSort = 'name';

// DOM Elements
const elements = {
    apiStatus: document.getElementById('api-status'),
    refreshBtn: document.getElementById('refresh-btn'),
    modelSelect: document.getElementById('model-select'),
    scenarioList: document.getElementById('scenario-list'),
    scenarioCount: document.getElementById('scenario-count'),
    generateSelectedBtn: document.getElementById('generate-selected-btn'),
    generateAllBtn: document.getElementById('generate-all-btn'),
    // New status bar elements
    statusBar: document.getElementById('status-bar'),
    statusIcon: document.getElementById('status-icon'),
    statusText: document.getElementById('status-text'),
    progressFill: document.getElementById('progress-fill'),
    progressCount: document.getElementById('progress-count'),
    currentScenario: document.getElementById('current-scenario'),
    tokensUsed: document.getElementById('tokens-used'),
    estimatedCost: document.getElementById('estimated-cost'),
    // Filter elements
    searchInput: document.getElementById('search-input'),
    filterStatus: document.getElementById('filter-status'),
    filterCategory: document.getElementById('filter-category'),
    sortBy: document.getElementById('sort-by'),
    // Preview elements
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

        // Populate category filter dropdown
        populateCategoryFilter();

        // Apply filters and render
        applyFiltersAndSort();

        log(`Loaded ${data.total} scenarios (${data.generated} generated)`, 'success');
    } catch {
        elements.scenarioList.innerHTML = '<div class="loading">Failed to load scenarios</div>';
    }
}

// Populate category filter with all available categories
function populateCategoryFilter() {
    const categories = new Set();
    scenarios.forEach(s => categories.add(s.category || 'Other'));

    elements.filterCategory.innerHTML = '<option value="all">All Categories</option>';
    Array.from(categories).sort().forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        elements.filterCategory.appendChild(option);
    });
}

// Apply filters and sorting, then render
function applyFiltersAndSort() {
    // Filter scenarios
    filteredScenarios = scenarios.filter(scenario => {
        // Search filter
        if (currentFilters.search) {
            const searchLower = currentFilters.search.toLowerCase();
            if (!scenario.title.toLowerCase().includes(searchLower) &&
                !(scenario.category || '').toLowerCase().includes(searchLower)) {
                return false;
            }
        }

        // Status filter
        if (currentFilters.status === 'generated' && !scenario.generated) return false;
        if (currentFilters.status === 'not-generated' && scenario.generated) return false;

        // Category filter
        if (currentFilters.category !== 'all') {
            if ((scenario.category || 'Other') !== currentFilters.category) return false;
        }

        return true;
    });

    // Sort scenarios
    filteredScenarios.sort((a, b) => {
        switch (currentSort) {
            case 'name':
                return a.title.localeCompare(b.title);
            case 'steps':
                return (b.steps || 0) - (a.steps || 0);
            case 'time':
                return (b.estimate_hours || b.estimated_hours || 0) - (a.estimate_hours || a.estimated_hours || 0);
            case 'cost':
                return (b.tokens_used || 0) - (a.tokens_used || 0);
            case 'size':
                return (b.file_size || 0) - (a.file_size || 0);
            default:
                return 0;
        }
    });

    renderScenarioList();
}

// Render Scenario List
// Render grouped scenario list
function renderScenarioList() {
    elements.scenarioList.innerHTML = '';

    // Show message if no results
    if (filteredScenarios.length === 0) {
        elements.scenarioList.innerHTML = '<div class="loading">No scenarios match your filters</div>';
        return;
    }

    // Group by category
    const groups = {};
    filteredScenarios.forEach(scenario => {
        const cat = scenario.category || 'Other';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(scenario);
    });

    // Check if any filter is active
    const hasActiveFilter = currentFilters.search !== '' ||
        currentFilters.status !== 'all' ||
        currentFilters.category !== 'all';

    // Render each group
    Object.keys(groups).sort().forEach(category => {
        const group = document.createElement('div');
        // Auto-expand when filters are active, collapse when no filters
        group.className = hasActiveFilter ? 'category-group' : 'category-group collapsed';

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
            const classes = ['scenario-item'];
            if (selectedScenarios.has(scenario.id)) classes.push('selected');
            if (scenario.generated) classes.push('completed');
            item.className = classes.join(' ');
            item.dataset.id = scenario.id;

            const sizeKB = (scenario.file_size / 1024).toFixed(1);
            const timeHours = scenario.estimate_hours || scenario.estimated_hours || 0;
            const timeMinutes = Math.round(timeHours * 60);
            const timeDisplay = scenario.generated
                ? (timeMinutes > 0 ? `${timeMinutes}min` : '-')
                : (timeMinutes > 0 ? `~${timeMinutes}min` : '-');
            const cost = scenario.generated
                ? `$${((scenario.tokens_used || 0) * 0.0000002).toFixed(4)}`
                : '-';

            // Add small check icon for completed scenarios
            const completedIcon = scenario.generated ? '<span class="completed-icon">✓</span>' : '';

            item.innerHTML = `
                <input type="checkbox" class="scenario-checkbox" ${selectedScenarios.has(scenario.id) ? 'checked' : ''}>
                <div class="info">
                    <div class="title">${scenario.title}${completedIcon}</div>
                    <div class="meta">
                        ${scenario.steps} steps
                        ${scenario.generated ? ' • ' + sizeKB + 'KB' : ''}
                        • ⏱️ ${timeDisplay}
                        ${scenario.generated ? ' • 💰 ' + cost : ''}
                    </div>
                </div>
            `;

            // Click on item (not checkbox) to show preview only
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                if (e.target.type !== 'checkbox') {
                    // Just show preview, don't toggle selection
                    if (scenario.generated) {
                        showPreview(scenario.id);
                    } else {
                        log(`Scenario "${scenario.title}" not generated yet`, 'info');
                    }
                }
            });

            // Checkbox change event
            const checkbox = item.querySelector('.scenario-checkbox');
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                // Checkbox will be in its new state already, sync our selection to match
                if (checkbox.checked && !selectedScenarios.has(scenario.id)) {
                    selectedScenarios.add(scenario.id);
                } else if (!checkbox.checked && selectedScenarios.has(scenario.id)) {
                    selectedScenarios.delete(scenario.id);
                }
                // Update UI
                item.classList.toggle('selected', checkbox.checked);
                updateButtons();
                if (selectedScenarios.size === 1 && scenario.generated) {
                    showPreview(scenario.id);
                }
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

    // Toggle status panel visibility
    if (selectedScenarios.size === 0) {
        // Hide preview, show placeholder
        elements.previewContent.classList.add('hidden');
        elements.previewSection.querySelector('.preview-placeholder').classList.remove('hidden');
    } else if (selectedScenarios.size === 1 && scenario.generated) {
        // Show preview for single selection
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

        // Remove previewing class from all items
        document.querySelectorAll('.scenario-item.previewing').forEach(el => {
            el.classList.remove('previewing');
        });

        // Add previewing class to current item
        const currentItem = document.querySelector(`[data-id="${scenarioId}"]`);
        if (currentItem) {
            currentItem.classList.add('previewing');
        }

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

        // Time and Cost
        const timeEl = document.getElementById('preview-time');
        const costEl = document.getElementById('preview-cost');
        if (timeEl && meta.estimateHours) {
            const minutes = Math.round(meta.estimateHours * 60);
            timeEl.textContent = `${minutes} minutes`;
        }
        if (costEl && data.tokens_used) {
            const cost = (data.tokens_used * 0.0000002).toFixed(4);
            costEl.textContent = `$${cost}`;
        } else if (costEl) {
            costEl.textContent = 'Not generated yet';
        }

        // Steps as timeline - traverse linked list following correct choices
        const stepsList = document.getElementById('preview-steps-list');
        if (stepsList && content.steps) {
            stepsList.innerHTML = '';

            // Traverse linked list to get correct order
            // Note: 'next' is inside choices array, follow the 'correct' choice
            const orderedSteps = [];
            let currentId = content.start || 'step-1'; // Use content.start if available
            const visited = new Set();

            while (currentId && content.steps[currentId] && !visited.has(currentId)) {
                visited.add(currentId);
                const step = content.steps[currentId];
                orderedSteps.push({ id: currentId, ...step });

                // Find the next step from the correct choice
                if (step.choices && step.choices.length > 0) {
                    const correctChoice = step.choices.find(c => c.type === 'correct');
                    currentId = correctChoice ? correctChoice.next : null;
                } else {
                    currentId = null; // No more steps
                }
            }

            // Render as timeline - make steps clickable
            orderedSteps.forEach((step, index) => {
                const div = document.createElement('div');
                const isStart = index === 0;
                const isEnd = step.id === 'conclusion' || (step.title && step.title.includes('Complete'));

                div.className = 'timeline-step ' + (isStart ? 'step-start' : isEnd ? 'step-end' : 'step-middle');
                div.title = 'Click to view step details';

                // Truncate prompt for preview (strip HTML and limit length)
                const promptText = (step.prompt || '').replace(/<[^>]*>/g, '').substring(0, 80);
                div.innerHTML = `
                    <div class="timeline-title">${step.title || step.action || 'Step ' + (index + 1)}</div>
                    <div class="timeline-prompt">${promptText}${promptText.length >= 80 ? '...' : ''}</div>
                `;

                // Add click handler to show step detail modal
                div.addEventListener('click', () => {
                    openStepModal(step);
                });

                stepsList.appendChild(div);
            });

            // Store for modal access
            currentPreviewContent = content;
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

    // Show the status bar
    showStatusBar('Generating...');

    let completed = 0;
    let totalTokens = 0;

    for (const id of scenarioIds) {
        elements.currentScenario.textContent = id;
        elements.progressCount.textContent = `${completed + 1}/${scenarioIds.length}`;
        elements.progressFill.style.width = `${(completed / scenarioIds.length) * 100}%`;
        elements.statusText.textContent = `Generating: ${id}`;

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

    // Show completion
    showStatusBar(`Complete! Generated ${completed} scenarios`, true);
    elements.currentScenario.textContent = '-';
    elements.progressFill.style.width = '100%';

    isGenerating = false;
    updateButtons();

    // Refresh list
    await loadScenarios();
}

// Show/update status bar
function showStatusBar(text, isComplete = false) {
    elements.statusBar.classList.remove('hidden');
    elements.statusBar.classList.toggle('complete', isComplete);
    elements.statusText.textContent = text;
    elements.statusIcon.textContent = isComplete ? '✅' : '⚡';
    elements.statusIcon.classList.toggle('pulse', !isComplete);
}

// Hide status bar
function hideStatusBar() {
    elements.statusBar.classList.add('hidden');
}

// Event Listeners
function setupEventListeners() {
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
        console.log('Generate All Missing clicked');
        const missing = scenarios.filter(s => !s.generated).map(s => s.id);
        console.log(`Found ${missing.length} missing scenarios:`, missing.slice(0, 5));
        if (missing.length === 0) {
            log('All scenarios already generated!', 'success');
            return;
        }
        log(`Starting batch generation of ${missing.length} scenarios...`, 'info');
        generateScenarios(missing);
    });

    elements.clearLogBtn.addEventListener('click', () => {
        elements.logContent.innerHTML = '<div class="log-entry info">Log cleared</div>';
    });

    // Filter/Sort event listeners
    elements.searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value;
        applyFiltersAndSort();
    });

    elements.filterStatus.addEventListener('change', (e) => {
        currentFilters.status = e.target.value;
        applyFiltersAndSort();
    });

    elements.filterCategory.addEventListener('change', (e) => {
        currentFilters.category = e.target.value;
        applyFiltersAndSort();
    });

    elements.sortBy.addEventListener('change', (e) => {
        currentSort = e.target.value;
        applyFiltersAndSort();
    });

    // Create New button
    const createNewBtn = document.getElementById('create-new-btn');
    if (createNewBtn) {
        createNewBtn.addEventListener('click', openCreateModal);
    }

    // Create form submit
    const createForm = document.getElementById('create-scenario-form');
    if (createForm) {
        createForm.addEventListener('submit', handleCreateScenario);
    }
}

// Store current preview content for step clicks
let currentPreviewContent = null;

// Modal Functions
function openStepModal(step) {
    const modal = document.getElementById('step-modal');
    const titleEl = document.getElementById('step-modal-title');
    const promptEl = document.getElementById('step-modal-prompt');
    const choicesEl = document.getElementById('step-modal-choices');

    titleEl.textContent = step.title || step.id;
    promptEl.innerHTML = step.prompt || 'No prompt available';

    // Render choices
    choicesEl.innerHTML = '';
    if (step.choices && step.choices.length > 0) {
        step.choices.forEach(choice => {
            const div = document.createElement('div');
            div.className = `choice-item type-${choice.type || 'unknown'}`;
            div.innerHTML = `
                <div class="choice-type">${choice.type || 'choice'}</div>
                <div class="choice-text">${choice.text || ''}</div>
                <div class="choice-feedback">${choice.feedback || ''}</div>
            `;
            choicesEl.appendChild(div);
        });
    } else {
        choicesEl.innerHTML = '<p class="text-muted">No choices (end of scenario)</p>';
    }

    modal.classList.remove('hidden');
}

function closeStepModal() {
    document.getElementById('step-modal').classList.add('hidden');
}

function openCreateModal() {
    document.getElementById('create-modal').classList.remove('hidden');
}

function closeCreateModal() {
    document.getElementById('create-modal').classList.add('hidden');
    document.getElementById('create-scenario-form').reset();
}

async function handleCreateScenario(e) {
    e.preventDefault();

    const title = document.getElementById('new-title').value.trim();
    const category = document.getElementById('new-category').value;
    const hours = parseFloat(document.getElementById('new-hours').value);
    const description = document.getElementById('new-description').value.trim();
    const solutionText = document.getElementById('new-solution').value.trim();
    const wrongText = document.getElementById('new-wrong').value.trim();

    // Generate scenario_id from title
    const scenarioId = title.replace(/[^a-zA-Z0-9]+/g, '');

    // Parse solution steps
    const solutionSteps = solutionText
        .split('\n')
        .filter(line => line.trim())
        .map((line, i) => ({
            step_description: line.replace(/^\d+\.\s*/, '').trim(),
            time_cost: (hours / 10).toFixed(2)  // Rough estimate
        }));

    // Parse wrong steps
    const wrongSteps = wrongText
        .split('\n')
        .filter(line => line.trim())
        .map(line => ({
            step_description: line.replace(/^[-*]\s*/, '').trim(),
            time_penalty: 0.1
        }));

    // Create the raw scenario structure
    const rawScenario = {
        scenario: {
            scenario_id: scenarioId,
            title: title,
            problem_description: description,
            focus_area: category,
            estimated_hours: hours,
            correct_solution_steps: solutionSteps.length > 0 ? solutionSteps : [
                { step_description: 'Investigate the issue', time_cost: 0.1 }
            ],
            common_wrong_steps: wrongSteps.length > 0 ? wrongSteps : [
                { step_description: 'Make unrelated changes', time_penalty: 0.15 }
            ]
        }
    };

    try {
        log(`Creating new scenario: ${title}`, 'info');
        closeCreateModal();

        // Save to raw_data.json via API (append)
        const response = await fetch(`${API_BASE}/create-scenario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rawScenario)
        });

        if (!response.ok) {
            throw new Error(`Failed to create scenario: ${response.statusText}`);
        }

        const result = await response.json();
        log(`Created scenario ${scenarioId}, now generating...`, 'success');

        // Reload scenarios and then generate the new one
        await loadScenarios();
        generateScenarios([scenarioId]);

    } catch (error) {
        log(`Failed to create scenario: ${error.message}`, 'error');
    }
}

// Close modals on Escape key or backdrop click
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeStepModal();
        closeCreateModal();
    }
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeStepModal();
        closeCreateModal();
    }
});

// Make modal functions global for onclick handlers
window.closeStepModal = closeStepModal;
window.closeCreateModal = closeCreateModal;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkApiStatus();
    loadModels();
    loadScenarios();
});
