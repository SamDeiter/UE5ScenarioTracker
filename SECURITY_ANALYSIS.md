# 🔐 UE5 Scenario Tracker - Security & Architecture Analysis

## Tech Stack Overview

- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Tailwind CSS, SCORM 1.2
- **Backend**: Python Flask, Gemini API
- **Data**: JSON storage, localStorage persistence

---

## 🔴 CRITICAL ISSUES

### 1. **Flask: File-Level Race Condition (TOCTOU Vulnerability)**

**Location**: `api_server.py` lines 336-351

**Issue**: Multiple concurrent requests can cause data corruption in `raw_data.json`.

```python
# VULNERABLE CODE:
with open(RAW_DATA_PATH, 'r', encoding='utf-8') as f:
    raw_data = json.load(f)  # ← READ

# ... check if scenario exists ...

raw_data.append({'scenario': scenario})  # ← MODIFY

with open(RAW_DATA_PATH, 'w', encoding='utf-8') as f:
    json.dump(raw_data, f, indent=2)  # ← WRITE
```

**Attack Scenario**:

1. User A reads the file
2. User B reads the file (sees same state)
3. User A writes changes
4. User B writes changes (overwrites A's changes)

**Fix**: Use file locking with `fcntl` or `filelock`:

```python
from filelock import FileLock

# At module level:
RAW_DATA_LOCK = FileLock(str(RAW_DATA_PATH) + '.lock')

@app.route('/api/create-scenario', methods=['POST'])
def create_scenario():
    global _raw_data_cache
    
    # ... validation ...
    
    try:
        with RAW_DATA_LOCK:  # ← ATOMIC OPERATION
            with open(RAW_DATA_PATH, 'r', encoding='utf-8') as f:
                raw_data = json.load(f)
            
            # Check duplicates
            for item in raw_data:
                if item['scenario']['scenario_id'] == scenario['scenario_id']:
                    return jsonify({'error': f'Scenario already exists'}), 409
            
            raw_data.append({'scenario': scenario})
            
            with open(RAW_DATA_PATH, 'w', encoding='utf-8') as f:
                json.dump(raw_data, f, indent=2)
        
        _raw_data_cache = None  # Clear cache
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### 2. **Frontend: localStorage Race Condition with SCORM**

**Location**: `game.js` lines 176-177

**Issue**: Timer saves to localStorage every second, but SCORM commits are async. Browser crash during write = data loss.

```javascript
// CURRENT CODE - VULNERABLE:
function updateMainTimerDisplay() {
    // ...
    timeRemaining--;
    StorageManager.save(StorageManager.KEYS.TIMER, timeRemaining.toString());  // ← FREQUENT WRITE
}
```

**Problem**: High-frequency writes (every 1s) can collide with:

- SCORM's `LMSCommit` (which is async)
- User closing browser mid-write
- localStorage quota exceeded

**Fix**: Debounce timer saves + add SCORM backup:

```javascript
// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

const saveTimerDebounced = debounce((time) => {
    StorageManager.save(StorageManager.KEYS.TIMER, time.toString());
    
    // Also backup to SCORM suspend_data
    if (typeof window.reportScoreAndGUIDToLMS12 === 'function') {
        try {
            const api = getAPI();  // From SCORM helper
            if (api) {
                const currentState = {
                    timer: time,
                    scenarios: scenarioState,
                    timestamp: Date.now()
                };
                api.LMSSetValue('cmi.suspend_data', JSON.stringify(currentState).substring(0, 4000));
            }
        } catch (e) {
            console.error('SCORM backup failed:', e);
        }
    }
}, 3000);  // Save every 3 seconds instead of every 1 second

function updateMainTimerDisplay() {
    countdownTimer.textContent = formatTime(timeRemaining);
    // ... visual updates ...
    
    if (timeRemaining <= 0) {
        endGameByTime();
        return;
    }
    
    timeRemaining--;
    saveTimerDebounced(timeRemaining);  // ← DEBOUNCED
}
```

### 3. **Flask: Unbounded JSON Parsing**

**Location**: `api_server.py` lines 78-86, 166-175

**Issue**: No size limits on JSON parsing = DoS vector.

```python
# VULNERABLE:
with open(output_path, 'r', encoding='utf-8') as f:
    content = f.read()  # ← Could be gigabytes!
```

**Fix**:

```python
MAX_SCENARIO_SIZE = 10 * 1024 * 1024  # 10MB limit

def safe_read_scenario(path):
    if not path.exists():
        return None
    
    file_size = path.stat().st_size
    if file_size > MAX_SCENARIO_SIZE:
        raise ValueError(f'Scenario file too large: {file_size} bytes')
    
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

# Usage:
@app.route('/api/preview/<scenario_id>', methods=['GET'])
def preview_scenario(scenario_id):
    output_path = SCENARIOS_DIR / f"{scenario_id}.js"
    
    try:
        content = safe_read_scenario(output_path)
        if content is None:
            return jsonify({'error': 'Scenario not generated yet'}), 404
        # ... rest of logic ...
    except ValueError as e:
        return jsonify({'error': str(e)}), 413  # Payload Too Large
```

---

## 🟡 WARNINGS

### 1. **Zombie Variable: `debugToggle`**

**Location**: `game.js` line (referenced but never defined in cached DOM)

```javascript
// Referenced but never assigned:
if (debugToggle) {
    debugToggle.checked = isDebugMode;
}
```

**Fix**: Either define it in `cacheDOMElements()` or remove the reference.

### 2. **Global Namespace Pollution**

**Location**: `game.js` line 3

```javascript
window.SCORM_Tracker = (function() { ... })();
```

**Current Exposure**:

- ✅ `window.SCORM_Tracker` (intentional, minimal API)
- ✅ `window.SCENARIOS` (needed for SCORM compatibility)
- ✅ `window.reportScoreAndGUIDToLMS12` (SCORM function)

**Status**: ✅ GOOD - Only 3 globals, all necessary for SCORM.

### 3. **Flask: Global State Cache Not Thread-Safe**

**Location**: `api_server.py` lines 22-32

```python
_raw_data_cache = None  # ← GLOBAL MUTABLE STATE

def get_raw_data():
    global _raw_data_cache
    if _raw_data_cache is None:
        with open(RAW_DATA_PATH, 'r', encoding='utf-8') as f:
            _raw_data_cache = json.load(f)
    return _raw_data_cache
```

**Problem**: Flask in production uses multiple worker threads. Two threads could both see `_raw_data_cache is None` and both try to load it.

**Fix**: Use `threading.Lock`:

```python
import threading

_raw_data_cache = None
_cache_lock = threading.Lock()

def get_raw_data():
    global _raw_data_cache
    
    with _cache_lock:
        if _raw_data_cache is None:
            with open(RAW_DATA_PATH, 'r', encoding='utf-8') as f:
                _raw_data_cache = json.load(f)
        return _raw_data_cache
```

### 4. **SCORM: No Error Callback for `LMSFinish`**

**Location**: `scorm12-helper.js` lines 67-68

```javascript
commit(api);
postComplete();
return true;  // ← Always returns true, even if commit failed
```

**Risk**: If `LMSCommit` fails silently, data is lost but function returns success.

**Fix**:

```javascript
function commit(api) {
    try {
        if (api && api.LMSCommit) {
            const result = api.LMSCommit("");
            return result === "true";  // SCORM returns string "true"
        }
    } catch(e) {
        console.error('SCORM commit failed:', e);
        return false;
    }
    return false;
}

window.reportScoreAndGUIDToLMS12 = function(rawPercent, guidToken, max, passMark){
    var api = getAPI(); 
    if(!api) {
        console.warn('SCORM API not found');
        return false;
    }
    
    // ... existing logic ...
    
    const commitSuccess = commit(api);
    if (!commitSuccess) {
        console.error('SCORM commit failed - data may not have been saved');
    }
    postComplete();
    return commitSuccess;  // ← Return actual result
};
```

---

## 🟢 BEST PRACTICE SUGGESTIONS

### 1. **Add localStorage Quota Check**

```javascript
const StorageManager = {
    KEYS: { /* ... */ },
    
    checkQuota() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                console.error('localStorage quota exceeded');
                return false;
            }
            throw e;
        }
    },
    
    save(key, value) {
        if (!this.checkQuota()) {
            // Fallback: Clear old data or warn user
            console.warn('Storage full, attempting cleanup...');
            this.clearAll();
        }
        
        try {
            const dataString = typeof value === 'string' ? value : JSON.stringify(value);
            localStorage.setItem(key, dataString);
        } catch (e) {
            console.error(`Failed to save ${key}:`, e);
            // Consider SCORM fallback here
        }
    },
    // ... rest ...
};
```

### 2. **Add Flask Request Timeout**

```python
# In api_server.py
from werkzeug.middleware.proxy_fix import ProxyFix

app.wsgi_app = ProxyFix(app.wsgi_app)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit
```

---

## 📊 Summary

| Severity | Count | Category |
|----------|-------|----------|
| 🔴 Critical | 3 | Race conditions, DoS, Data loss |
| 🟡 Warning | 4 | Dead code, thread safety, error handling |
| 🟢 Best Practice | 2 | Validation, security hardening |

**Priority Fixes**:

1. Add file locking to Flask (Critical #1)
2. Debounce localStorage + SCORM backup (Critical #2)
3. Add JSON size limits (Critical #3)
4. Add threading locks to cache (Warning #3)

**Total Estimated Fix Time**: 4-6 hours
