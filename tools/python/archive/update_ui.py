"""
Updates the Generator UI to load models dynamically from API.
No hardcoded values - fetches available models on page load.
"""

# Update index.html - add both model options from API
html_path = '../generator_ui/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the model select to show loading state
old_select = '''<select id="model-select" class="model-select" title="Select AI Model">
                    <option value="">Loading models...</option>
                </select>'''

new_select = '''<select id="model-select" class="model-select" title="Select AI Model">
                    <option value="">Loading from API...</option>
                </select>'''

html = html.replace(old_select, new_select)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated index.html")

# Update app.js - add model loading from API
js_path = '../generator_ui/app.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# Check if modelSelect already exists
if 'modelSelect' not in js:
    # Add modelSelect to elements
    js = js.replace(
        "scenarioList: document.getElementById('scenario-list')",
        "modelSelect: document.getElementById('model-select'),\n    scenarioList: document.getElementById('scenario-list')"
    )

# Add selectedModel state if not present
if 'selectedModel' not in js:
    js = js.replace(
        'let isGenerating = false;',
        'let isGenerating = false;\nlet selectedModel = null;'
    )

# Add loadModels function if not present
if 'async function loadModels' not in js:
    load_models_fn = '''
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

// Load Scenarios'''
    
    js = js.replace('// Load Scenarios', load_models_fn)

# Add loadModels() to initialization if not present
if 'loadModels();' not in js:
    js = js.replace(
        'checkApiStatus();\n    loadScenarios();',
        'checkApiStatus();\n    loadModels();\n    loadScenarios();'
    )

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)

print("Updated app.js")
print("Done! Refresh the browser to see models loaded from API.")
