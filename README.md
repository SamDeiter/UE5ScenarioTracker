# UE5 Scenario Tracker

Interactive debugging assessment tool for UE5 knowledge testing.

## Quick Start

```bash
# Start local server
python -m http.server 8000

# Open http://localhost:8000
```

---

## Capture Workflow (Zero-Touch)

The new capture workflow is faster and avoids manual copy-pasting.

### 1. Prerequisites (In UE5)

- Enable **Remote Execution**: `Edit → Project Settings → Python → Enable Remote Execution`
- Ensure your scenario level is open.

### 2. Run Capture Control Tool

```bash
python tools\python\CaptureControl.py
```

- The tool will automatically detect and connect to UE5.
- Look for the 🟢 **UE5 CONNECTED** status.

### 3. Workflow Modes

#### Mode A: Zero-Touch (Recommended)

1. **Auto-Sync** is enabled by default. Command is sent to UE5 instantly as you navigate.
2. Position camera in UE5 once.
3. Press **Alt+PrintScreen** in UE5.
4. GUI detects the image, saves it, and advances both GUI and UE5 to the next step automatically.

#### Mode B: Full-Auto (Standalone)

1. Enable **Full-Auto (Screenshots)**.
2. Click 🚀 **AUTO-CAPTURE ALL STEPS**.
3. UE5 will sequence through all steps and take high-res screenshots (1920x1080) directly to `assets/generated/`.

---

## Generate New Scenarios

### Step 1: Use ChatGPT

- Open [`docs/CHATGPT_PROMPT.md`](docs/CHATGPT_PROMPT.md)
- Replace topic placeholder with your issue
- Copy JSON response

### Step 2: Convert

```bash
python tools/python/convert_scenario.py
# Paste JSON, then Ctrl+Z + Enter
```

### Step 3: Test

- Refresh browser (Ctrl+F5)
- New scenario appears in Sprint Backlog

---

## Project Structure

```
├── assets/generated/     # Captured screenshots
├── scenarios/            # Scenario .js files by category
│   ├── game_dev/         # Blueprints, physics, gameplay
│   ├── look_dev/         # Lighting, materials, rendering
│   ├── tech_art/         # Asset management, procedural
│   └── vfx/              # Particles, audio, volumetrics
├── js/
│   ├── core/             # Core logic modules
│   │   ├── timer.js      # TimerManager - countdown logic
│   │   ├── state.js      # StateManager - persistence
│   │   ├── debug.js      # DebugManager - debug mode
│   │   ├── scoring.js    # ScoringManager - score calcs
│   │   └── test-utils.js # TestUtils - UI testing
│   ├── ui/               # UI component modules
│   │   ├── modal.js      # ModalManager - result modals
│   │   ├── feedback.js   # FeedbackManager - choice feedback
│   │   ├── backlog.js    # BacklogRenderer - category filters
│   │   └── image-modal.js# ImageModal - image expand
│   ├── ActionRegistry.js # Action execution (UE5 integration)
│   ├── RecipeRegistry.js # Recipe/automation loading
│   ├── ScenarioEngine.js # Scenario loading/validation
│   └── Validator.js      # Schema validation
├── tools/python/         # Python utilities
│   ├── CaptureControl.py # GUI capture tool
│   └── convert_scenario.py
├── unreal_scripts/       # UE5 Python scripts
│   └── core/ManualCapture.py
├── game.js               # Main orchestrator (~1100 lines)
└── docs/                 # Documentation
```

---

## Architecture

### Module System

The codebase uses a modular architecture with globally-exposed modules:

| Module | Purpose |
|--------|---------|
| `TimerManager` | 30-minute countdown timer |
| `StateManager` | localStorage state persistence |
| `DebugManager` | Debug mode + password protection |
| `ScoringManager` | Score calculations, test keys |
| `FeedbackManager` | Choice feedback display |
| `ModalManager` | Assessment result modals |
| `ImageModal` | Image expand/zoom |

### Performance Optimizations

- **UE5 Connection**: 500ms timeout + 30s cache (prevents UI blocking)
- **Mobile Auto-Scroll**: Smooth scroll to content on narrow screens

---

## Assessment Rules

- ✅ Full UE5 editor UI captured (not just viewport)
- ✅ No hints on wrong answers (tooltips only)
- ✅ Branching logic supported via `choices.next`
- ✅ 4 choices per question for consistency

---

## Development

### Run Locally

```bash
python -m http.server 8080
# Open http://localhost:8080
```

### Debug Mode

Toggle "Debug Mode" in header, enter password to access:

- Step navigation (Next/Prev)
- Clear Cache & Restart
- Current step indicator
