"""
Flask API Server for Scenario Generator GUI
Provides REST endpoints for listing, generating, and previewing scenarios.
"""
import json
import threading
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
try:
    from filelock import FileLock
except ImportError:
    print("⚠️  Warning: filelock not installed. Install with: pip install filelock")
    FileLock = None

# Import our existing modules
from scenario_generator import ScenarioGenerator
from env_loader import get_gemini_key

app = Flask(__name__, static_folder='../generator_ui')
CORS(app)

# Security: Limit request size to prevent DoS
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit

# Paths
ROOT_DIR = Path(__file__).parent.parent.parent
RAW_DATA_PATH = ROOT_DIR / 'raw_data.json'
SCENARIOS_DIR = ROOT_DIR / 'scenarios'

# Security limits
MAX_SCENARIO_SIZE = 10 * 1024 * 1024  # 10MB limit

# Thread safety
_raw_data_cache = None
_cache_lock = threading.Lock()
_raw_data_lock = FileLock(str(RAW_DATA_PATH) + '.lock') if FileLock else None


def get_raw_data():
    """Load and cache raw_data.json with thread safety"""
    global _raw_data_cache
    
    with _cache_lock:
        if _raw_data_cache is None:
            with open(RAW_DATA_PATH, 'r', encoding='utf-8') as f:
                _raw_data_cache = json.load(f)
        return _raw_data_cache


def safe_read_scenario(path):
    """Safely read scenario file with size limits"""
    if not path.exists():
        return None
    
    file_size = path.stat().st_size
    if file_size > MAX_SCENARIO_SIZE:
        raise ValueError(f'Scenario file too large: {file_size} bytes')
    
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()


@app.route('/')
def index():
    """Serve the Generator GUI"""
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/launcher')
def launcher():
    """Serve the unified launcher"""
    return send_from_directory(ROOT_DIR, 'launcher.html')


@app.route('/quiz')
def quiz():
    """Serve the quiz app"""
    return send_from_directory(ROOT_DIR, 'index.html')


@app.route('/<path:path>')
def static_files(path):
    """Serve static files from generator_ui or root"""
    # Try generator_ui folder first
    try:
        return send_from_directory(app.static_folder, path)
    except:
        # Fall back to root directory
        return send_from_directory(ROOT_DIR, path)


@app.route('/api/scenarios', methods=['GET'])
def list_scenarios():
    """List all scenarios with their generation status"""
    raw_data = get_raw_data()
    scenarios = []
    
    for item in raw_data:
        scenario = item['scenario']
        scenario_id = scenario['scenario_id']
        output_path = SCENARIOS_DIR / f"{scenario_id}.js"
        
        # Get tokens_used if file exists
        tokens_used = 0
        if output_path.exists():
            try:
                with open(output_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    start = content.index('{')
                    end = content.rindex('}') + 1
                    json_str = content[start:end]
                    parsed = json.loads(json_str)
                    tokens_used = parsed.get('meta', {}).get('tokens_used', 0)
            except:
                tokens_used = 0
        
        scenarios.append({
            'id': scenario_id,
            'title': scenario['title'],
            'category': scenario['focus_area'],
            'estimated_hours': scenario['estimated_hours'],
            'steps': len(scenario['correct_solution_steps']),
            'generated': output_path.exists(),
            'file_size': output_path.stat().st_size if output_path.exists() else 0,
            'tokens_used': tokens_used
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
    
    try:
        content = safe_read_scenario(output_path)
        if content is None:
            return jsonify({'error': 'Scenario not generated yet'}), 404
    except ValueError as e:
        return jsonify({'error': str(e)}), 413  # Payload Too Large
    
    # Extract JSON from: window.SCENARIOS['id'] = {...};
    try:
        start = content.index('{')
        end = content.rindex('}') + 1
        json_str = content[start:end]
        scenario = json.loads(json_str)
        
        # Extract tokens_used from meta if available
        tokens_used = scenario.get('meta', {}).get('tokens_used', 0)
        
        return jsonify({
            'scenario_id': scenario_id,
            'content': scenario,
            'file_size': output_path.stat().st_size,
            'tokens_used': tokens_used
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


@app.route('/api/create-scenario', methods=['POST'])
def create_scenario():
    """Create a new scenario and add it to raw_data.json"""
    global _raw_data_cache
    
    data = request.json
    
    if not data or 'scenario' not in data:
        return jsonify({'error': 'Invalid scenario data'}), 400
    
    scenario = data['scenario']
    required_fields = ['scenario_id', 'title', 'problem_description', 'focus_area', 'estimated_hours']
    
    for field in required_fields:
        if field not in scenario:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Ensure arrays have defaults
    if 'correct_solution_steps' not in scenario or len(scenario['correct_solution_steps']) == 0:
        scenario['correct_solution_steps'] = [
            {'step_description': 'Investigate the issue', 'time_cost': 0.1}
        ]
    
    if 'common_wrong_steps' not in scenario or len(scenario['common_wrong_steps']) == 0:
        scenario['common_wrong_steps'] = [
            {'step_description': 'Make unrelated changes', 'time_penalty': 0.15}
        ]
    
    try:
        if not _raw_data_lock:
            return jsonify({'error': 'File locking not available - install filelock package'}), 500
        
        # ATOMIC OPERATION - File locking prevents race conditions
        with _raw_data_lock:
            # Load current raw_data.json
            with open(RAW_DATA_PATH, 'r', encoding='utf-8') as f:
                raw_data = json.load(f)
            
            # Check if scenario_id already exists
            for item in raw_data:
                if item['scenario']['scenario_id'] == scenario['scenario_id']:
                    return jsonify({'error': f'Scenario {scenario["scenario_id"]} already exists'}), 409
            
            # Add the new scenario
            raw_data.append({'scenario': scenario})
            
            # Save back to file
            with open(RAW_DATA_PATH, 'w', encoding='utf-8') as f:
                json.dump(raw_data, f, indent=2)
        
        # Clear cache so new scenario is picked up
        _raw_data_cache = None
        
        return jsonify({
            'success': True,
            'scenario_id': scenario['scenario_id'],
            'message': f'Created scenario: {scenario["title"]}'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("🚀 Starting Scenario Generator API Server...")
    print(f"📂 Raw data: {RAW_DATA_PATH}")
    print(f"📂 Scenarios: {SCENARIOS_DIR}")
    print(f"🌐 GUI available at: http://localhost:5000")
    app.run(debug=True, port=5000)
