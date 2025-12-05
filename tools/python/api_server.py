"""
Flask API Server for Scenario Generator GUI
Provides REST endpoints for listing, generating, and previewing scenarios.
"""
import json
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

# Import our existing modules
from scenario_generator import ScenarioGenerator
from env_loader import get_gemini_key

app = Flask(__name__, static_folder='../generator_ui')
CORS(app)

# Paths
ROOT_DIR = Path(__file__).parent.parent.parent
RAW_DATA_PATH = ROOT_DIR / 'raw_data.json'
SCENARIOS_DIR = ROOT_DIR / 'scenarios'

# Cache for raw data
_raw_data_cache = None


def get_raw_data():
    """Load and cache raw_data.json"""
    global _raw_data_cache
    if _raw_data_cache is None:
        with open(RAW_DATA_PATH, 'r', encoding='utf-8') as f:
            _raw_data_cache = json.load(f)
    return _raw_data_cache


@app.route('/')
def index():
    """Serve the GUI"""
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/<path:path>')
def static_files(path):
    """Serve static files"""
    return send_from_directory(app.static_folder, path)


@app.route('/api/scenarios', methods=['GET'])
def list_scenarios():
    """List all scenarios with their generation status"""
    raw_data = get_raw_data()
    scenarios = []
    
    for item in raw_data:
        scenario = item['scenario']
        scenario_id = scenario['scenario_id']
        output_path = SCENARIOS_DIR / f"{scenario_id}.js"
        
        scenarios.append({
            'id': scenario_id,
            'title': scenario['title'],
            'category': scenario['focus_area'],
            'estimated_hours': scenario['estimated_hours'],
            'steps': len(scenario['correct_solution_steps']),
            'generated': output_path.exists(),
            'file_size': output_path.stat().st_size if output_path.exists() else 0
        })
    
    return jsonify({
        'total': len(scenarios),
        'generated': sum(1 for s in scenarios if s['generated']),
        'scenarios': scenarios
    })


@app.route('/api/generate', methods=['POST'])
def generate_scenario():
    """Generate a scenario by ID"""
    data = request.json
    scenario_id = data.get('scenario_id')
    
    if not scenario_id:
        return jsonify({'error': 'scenario_id required'}), 400
    
    # Find the raw scenario
    raw_data = get_raw_data()
    raw_scenario = None
    for item in raw_data:
        if item['scenario']['scenario_id'] == scenario_id:
            raw_scenario = item
            break
    
    if not raw_scenario:
        return jsonify({'error': f'Scenario {scenario_id} not found'}), 404
    
    try:
        # Get API key
        api_key = get_gemini_key()
        
        # Initialize generator
        generator = ScenarioGenerator(api_key)
        
        # Generate
        scenario = generator.generate_full_scenario(raw_scenario)
        
        # Validate
        if not generator.validate_scenario(scenario):
            return jsonify({'error': 'Validation failed'}), 500
        
        # Save
        output_path = SCENARIOS_DIR / f"{scenario_id}.js"
        generator.save_scenario_js(scenario, output_path)
        
        return jsonify({
            'success': True,
            'scenario_id': scenario_id,
            'tokens_used': generator.token_count,
            'file_size': output_path.stat().st_size,
            'steps': len(scenario['steps'])
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/preview/<scenario_id>', methods=['GET'])
def preview_scenario(scenario_id):
    """Get the generated scenario content"""
    output_path = SCENARIOS_DIR / f"{scenario_id}.js"
    
    if not output_path.exists():
        return jsonify({'error': 'Scenario not generated yet'}), 404
    
    # Read the JS file and extract the JSON
    with open(output_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract JSON from: window.SCENARIOS['id'] = {...};
    try:
        start = content.index('{')
        end = content.rindex('}') + 1
        json_str = content[start:end]
        scenario = json.loads(json_str)
        
        return jsonify({
            'scenario_id': scenario_id,
            'content': scenario,
            'file_size': output_path.stat().st_size
        })
    except Exception as e:
        return jsonify({'error': f'Failed to parse scenario: {e}'}), 500


@app.route('/api/status', methods=['GET'])
def get_status():
    """Get API status and configuration"""
    try:
        api_key = get_gemini_key()
        api_status = 'connected'
        api_key_preview = api_key[:8] + '...'
    except:
        api_status = 'not configured'
        api_key_preview = None
    
    return jsonify({
        'api_status': api_status,
        'api_key_preview': api_key_preview,
        'raw_data_path': str(RAW_DATA_PATH),
        'scenarios_dir': str(SCENARIOS_DIR)
    })


@app.route('/api/models', methods=['GET'])
def list_models():
    """List available Gemini models - filtered to only text generation models"""
    import requests
    try:
        api_key = get_gemini_key()
        url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            models = []
            
            # Only include the best models for JSON text generation
            # Keep only: stable Flash and Pro models (no preview, experimental, TTS, lite, image)
            excluded_keywords = ['embedding', 'aqa', 'imagen', 'veo', 'learnlm', 'thinking', 
                                'tts', 'image', 'lite', 'banana', 'experimental', 'preview', '001']
            preferred_order = ['2.5-flash', '2.5-pro', '2.0-flash', '1.5-pro', '1.5-flash']
            
            for m in data.get('models', []):
                name = m['name'].replace('models/', '')
                
                # Must support generateContent
                if 'generateContent' not in m.get('supportedGenerationMethods', []):
                    continue
                
                # Skip excluded models
                if any(kw in name.lower() for kw in excluded_keywords):
                    continue
                
                # Only include gemini models (flash/pro)
                if not name.startswith('gemini'):
                    continue
                    
                models.append({
                    'id': name,
                    'name': m.get('displayName', name),
                    'description': m.get('description', '')[:100]
                })
            
            # Sort by preferred order
            def sort_key(model):
                for i, pref in enumerate(preferred_order):
                    if pref in model['id']:
                        return i
                return 99
            
            models.sort(key=sort_key)
            
            return jsonify({'models': models})
        return jsonify({'error': 'Failed to fetch models'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/test-model', methods=['POST'])
def test_model():
    """Test if a model works with a simple prompt"""
    import google.generativeai as genai
    
    data = request.json
    model_id = data.get('model_id', 'gemini-2.0-flash')
    
    try:
        api_key = get_gemini_key()
        genai.configure(api_key=api_key)
        
        model = genai.GenerativeModel(model_id)
        result = model.generate_content("Say 'OK' if you can respond.")
        
        return jsonify({
            'success': True,
            'model': model_id,
            'response': result.text[:50],
            'message': f'✅ Model {model_id} is working!'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'model': model_id,
            'error': str(e),
            'message': f'❌ Model {model_id} failed: {str(e)[:100]}'
        }), 400



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


if __name__ == '__main__':
    print("🚀 Starting Scenario Generator API Server...")
    print(f"📂 Raw data: {RAW_DATA_PATH}")
    print(f"📂 Scenarios: {SCENARIOS_DIR}")
    print(f"🌐 GUI available at: http://localhost:5000")
    app.run(debug=True, port=5000)
