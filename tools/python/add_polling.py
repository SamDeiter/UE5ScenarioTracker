"""Add generation status polling to show real-time progress."""

# 1. Add status endpoint to API server
api_code = '''
# Global generation status
generation_status = {
    'is_generating': False,
    'current_scenario': None,
    'completed': 0,
    'total': 0,
    'tokens_used': 0
}

@app.route('/api/generation-status', methods=['GET'])
def get_generation_status():
    """Get current generation status for polling"""
    return jsonify(generation_status)
'''

with open('api_server.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add before the main block if not already there
if 'generation_status' not in content:
    content = content.replace(
        "if __name__ == '__main__':",
        api_code + "\n\nif __name__ == '__main__':"
    )
    
    with open('api_server.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Added generation-status endpoint to API')
else:
    print('Status endpoint already exists')

# 2. Add polling to frontend
with open('../generator_ui/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Add polling function if not exists
if 'pollStatus' not in js:
    poll_fn = '''
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
        } catch(e) {}
    }, 1000);
}

function stopStatusPolling() {
    if (statusInterval) {
        clearInterval(statusInterval);
        statusInterval = null;
    }
}

'''
    # Insert after the log function
    js = js.replace('// API Calls', poll_fn + '// API Calls')
    
    # Start polling when generation starts
    js = js.replace(
        "elements.progressTitle.textContent = 'Generating...';",
        "elements.progressTitle.textContent = 'Generating...';\n    startStatusPolling();"
    )
    
    # Stop polling when done
    js = js.replace(
        "elements.progressTitle.textContent = '✅ Complete!';",
        "stopStatusPolling();\n    elements.progressTitle.textContent = '✅ Complete!';"
    )
    
    with open('../generator_ui/app.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print('Added status polling to frontend')
else:
    print('Polling already exists')

print('Done! Status will now update in real-time.')
