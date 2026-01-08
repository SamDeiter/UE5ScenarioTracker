"""
UI Overhaul Script - Implements all 3 improvements:
1. Right Panel: Render JSON as styled Scenario Card
2. Left Panel: Group by category with collapsible headers
3. Log Panel: Collapsible bottom sheet
"""

# ============ 1. UPDATE HTML STRUCTURE ============
with open('../generator_ui/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the preview section with a styled card layout
old_preview = '''                    <div id="preview-content" class="preview-content hidden">
                            <div class="preview-header">
                                <h3 id="preview-title">-</h3>
                                <span id="preview-category" class="category-badge">-</span>
                            </div>
                            <div class="preview-meta">
                                <span>📊 <span id="preview-steps">0</span> steps</span>
                                <span>📦 <span id="preview-size">0</span> KB</span>
                            </div>
                            <pre id="preview-json" class="preview-json"></pre>
                        </div>'''

new_preview = '''                    <div id="preview-content" class="preview-content hidden">
                            <div class="scenario-card">
                                <div class="card-header">
                                    <h2 id="preview-title">-</h2>
                                    <span id="preview-category" class="category-badge">-</span>
                                </div>
                                <p id="preview-description" class="card-description">-</p>
                                <div class="card-steps">
                                    <h4>Steps:</h4>
                                    <ol id="preview-steps-list"></ol>
                                </div>
                                <details class="debug-toggle">
                                    <summary>Show Debug JSON</summary>
                                    <div class="debug-meta">
                                        <span>📊 <span id="preview-steps">0</span> steps</span>
                                        <span>📦 <span id="preview-size">0</span> KB</span>
                                    </div>
                                    <pre id="preview-json" class="preview-json"></pre>
                                </details>
                            </div>
                        </div>'''

html = html.replace(old_preview, new_preview)

# Replace log panel with collapsible version
old_log = '''        <!-- Log -->
        <footer class="log-panel">
            <div class="log-header">
                <span>📝 Log</span>
                <button id="clear-log-btn" class="btn btn-small">Clear</button>
            </div>
            <div id="log-content" class="log-content">
                <div class="log-entry info">Ready to generate scenarios...</div>
            </div>
        </footer>'''

new_log = '''        <!-- Collapsible Log -->
        <footer id="log-panel" class="log-panel collapsed">
            <div class="log-bar" onclick="toggleLog()">
                <span id="log-last-message">📝 Ready to generate scenarios...</span>
                <button id="clear-log-btn" class="btn btn-small" onclick="event.stopPropagation()">Clear</button>
            </div>
            <div id="log-content" class="log-content">
                <div class="log-entry info">Ready to generate scenarios...</div>
            </div>
        </footer>'''

html = html.replace(old_log, new_log)

with open('../generator_ui/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Updated HTML structure")


# ============ 2. UPDATE CSS STYLES ============
with open('../generator_ui/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

new_styles = '''
/* ============ SCENARIO CARD (Right Panel) ============ */
.scenario-card {
    padding: 1.5rem;
    background: var(--bg-dark);
    border-radius: 12px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.card-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.3;
    flex: 1;
}

.card-description {
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.6;
}

.card-steps {
    flex: 1;
    overflow-y: auto;
}

.card-steps h4 {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.75rem;
}

.card-steps ol {
    margin: 0;
    padding-left: 1.25rem;
}

.card-steps li {
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
    line-height: 1.5;
}

.debug-toggle {
    margin-top: auto;
    border-top: 1px solid var(--border);
    padding-top: 0.75rem;
}

.debug-toggle summary {
    cursor: pointer;
    font-size: 0.75rem;
    color: var(--text-secondary);
    padding: 0.5rem;
}

.debug-toggle summary:hover {
    color: var(--accent-blue);
}

.debug-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin: 0.5rem 0;
}

/* ============ GROUPED CATEGORIES (Left Panel) ============ */
.category-group {
    margin-bottom: 0.5rem;
}

.category-group-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--bg-hover);
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
}

.category-group-header:hover {
    background: var(--border);
}

.category-group-header .toggle-icon {
    transition: transform 0.2s;
}

.category-group.collapsed .toggle-icon {
    transform: rotate(-90deg);
}

.category-group.collapsed .category-items {
    display: none;
}

.category-items {
    padding-left: 0.5rem;
}

.category-items .scenario-item {
    border-left: 2px solid var(--border);
    margin-left: 0.5rem;
    padding-left: 0.75rem;
}

.category-items .scenario-item .category-badge {
    display: none;
}

/* ============ COLLAPSIBLE LOG ============ */
.log-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--bg-card);
    border-top: 1px solid var(--border);
    transition: height 0.3s ease;
    z-index: 100;
}

.log-panel.collapsed {
    height: 40px;
}

.log-panel.collapsed .log-content {
    display: none;
}

.log-panel.expanded {
    height: 200px;
}

.log-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 0.8rem;
    color: var(--text-secondary);
}

.log-bar:hover {
    background: var(--bg-hover);
}

#log-last-message {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
}

.log-panel.has-error .log-bar {
    background: rgba(248, 81, 73, 0.1);
    color: var(--accent-red);
}

.log-panel.has-error {
    height: 200px;
}

.log-panel.has-error .log-content {
    display: block;
}

/* Adjust main content for fixed log */
.app {
    padding-bottom: 50px;
}
'''

# Append new styles
css += new_styles

with open('../generator_ui/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("✅ Updated CSS styles")


# ============ 3. UPDATE JAVASCRIPT ============
with open('../generator_ui/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Add toggle log function
toggle_fn = '''
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

'''

# Add grouped rendering for left panel
group_render = '''
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
        group.className = 'category-group';
        
        const categoryClass = getCategoryClass(category);
        
        group.innerHTML = `
            <div class="category-group-header" onclick="this.parentElement.classList.toggle('collapsed')">
                <span class="toggle-icon">▼</span>
                <span class="category-badge ${categoryClass}">${category}</span>
                <span>(${groups[category].length})</span>
            </div>
            <div class="category-items"></div>
        `;
        
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

'''

# Add card rendering for preview
card_render = '''
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
        
        // Steps as list
        const stepsList = document.getElementById('preview-steps-list');
        if (stepsList && content.steps) {
            stepsList.innerHTML = '';
            const steps = Object.values(content.steps);
            steps.slice(0, 10).forEach(step => {
                const li = document.createElement('li');
                li.textContent = step.title || step.action || 'Step';
                stepsList.appendChild(li);
            });
            if (steps.length > 10) {
                const li = document.createElement('li');
                li.textContent = `... and ${steps.length - 10} more steps`;
                li.style.color = 'var(--text-secondary)';
                stepsList.appendChild(li);
            }
        }
        
        // Debug info
        elements.previewSteps.textContent = Object.keys(content.steps || {}).length;
        elements.previewSize.textContent = (data.file_size / 1024).toFixed(1);
        elements.previewJson.textContent = JSON.stringify(content, null, 2);
        
    } catch (error) {
        log(`Failed to load preview: ${error.message}`, 'error');
    }
}

'''

# Replace the old functions
js = js.replace('// Logging\nfunction log(', toggle_fn + '// Logging\nfunction log_old(')

# Replace renderScenarioList if exists
if 'function renderScenarioList()' in js:
    import re
    js = re.sub(
        r'function renderScenarioList\(\) \{[\s\S]*?\n\}',
        group_render.strip().replace('function renderScenarioList()', 'function renderScenarioList()'),
        js
    )

# Replace showPreview if exists
if 'async function showPreview(' in js:
    js = re.sub(
        r'async function showPreview\([^)]*\) \{[\s\S]*?\n\}',
        card_render.strip(),
        js
    )

with open('../generator_ui/app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("✅ Updated JavaScript")
print("\n🎉 UI Overhaul Complete! Refresh the browser to see changes.")
