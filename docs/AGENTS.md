# Working with AI Agents

<!-- anchor: agent-collaboration-guide -->
This document explains how to work effectively with AI agents on the UE5ScenarioTracker project.

## ANCHOR PROTOCOL

<!-- anchor: anchor-protocol-usage -->
### Purpose

The ANCHOR protocol provides a standardized way to document code changes and enable agents to quickly find relevant context without reading entire files.

### Before Starting Any Task

1. **Read the manifest**: Check `docs/ANCHOR_MANIFEST.md`
2. **Search for anchors**: Use grep to find related anchors

   ```bash
   grep -r "anchor: unreal-" docs/
   ```

3. **Read matching files**: Review documentation with relevant anchors

### After Completing Any Task

1. **Create or update documentation**: Add a `.md` file in `docs/`
2. **Add searchable anchors**: Include anchors at the top of each section
3. **Update manifest**: Add new anchors to `ANCHOR_MANIFEST.md`

### Anchor Format

```markdown
<!-- anchor: feature-area-specific-thing -->
```

**Rules:**

- Lowercase, hyphenated, no spaces
- Maximum 5 words
- Descriptive enough to search blindly
- One anchor per logical unit
- Unique across entire project

**Examples:**

- `<!-- anchor: unreal-screenshot-automation -->`
- `<!-- anchor: lms-build-process -->`
- `<!-- anchor: cleanup-repo-organization -->`

### Documentation File Rules

Each documentation file should include:

- All file paths touched
- Function/class names that matter
- Key implementation decisions
- Not verbose, not minimal — informative

**Goal**: Someone reading this should know WHAT exists, WHERE it lives, and HOW it connects.

---

<!-- anchor: repository-structure -->
## Repository Structure

```
UE5ScenarioTracker/
├── docs/                      # All documentation (LOOK HERE FIRST)
│   ├── ANCHOR_MANIFEST.md     # Index of all documentation anchors
│   ├── AGENTS.md             # This file - how to work with agents
│   ├── BUILD_LMS.md          # LMS build instructions
│   ├── PILOT_TEST.md         # Pilot test plan
│   ├── UNREAL_AUTOMATION.md  # Unreal screenshot automation
│   └── archived/             # Deprecated documentation
│
├── scenarios/                # Scenario definitions (JavaScript)
│   ├── 00_manifest.js        # Controls which scenarios display
│   └── *.js                  # Individual scenario files
│
├── unreal_scripts/           # Unreal Engine automation
│   ├── core/                 # Production scripts
│   ├── experimental/         # Experimental approaches
│   └── tests/                # Test scripts
│
├── tools/                    # Development utilities
│   ├── python/               # Python helper scripts
│   ├── tests/                # Test scripts
│   └── *.py                  # Utility scripts
│
├── build/                    # Generated files (gitignored)
│   └── specs/                # Generated JSON specs
│
├── index.html                # Main quiz application
├── game.js                   # Quiz logic (LARGE FILE - use search)
└── build-lms.py              # LMS package builder
```

---

<!-- anchor: key-files-overview -->
## Key Files

### Core Application

- **`index.html`**: Main entry point for quiz app
- **`game.js`**: Quiz logic, scenario loading, state management (53KB)
- **`style.css`**: UE5-themed styling
- **`scenarios/00_manifest.js`**: Controls which scenarios are visible
  - `window.MANIFEST = ['directional_light']` - array of scenario IDs to show

### Scenario System

- **`scenarios/*.js`**: Individual scenario files
  - Each defines a scenario with steps, choices, feedback
  - Format: `window.SCENARIOS['scenario-id'] = { meta, steps, ... }`
- **`questions.js`**: Legacy scenario format (DEPRECATED - commented out in index.html)

### Unreal Automation

- **`unreal_scripts/core/AutoGenerateScenarios.py`**: Main orchestration
- **`unreal_scripts/core/SceneBuilder.py`**: Builds scenes from JSON specs
- **`unreal_scripts/core/ScreenshotCapture.py`**: Captures screenshots
- **`build/specs/*.json`**: Generated scene specifications

### Build System

- **`build-lms.py`**: Creates SCORM 1.2 LMS packages
- **`BuildLMS.bat`**: Batch file to run build script
- **`imsmanifest.xml`**: SCORM manifest template

---

<!-- anchor: common-tasks -->
## Common Tasks

### Add a New Scenario

1. Create `scenarios/new-scenario.js` following existing format
2. Add scenario ID to `scenarios/00_manifest.js`
3. Add `<script src="scenarios/new-scenario.js" defer></script>` to `index.html`
4. Test in browser at `http://localhost:8000`

### Generate Screenshots

1. Create scene spec: `python tools/create_unreal_spec.py`
2. Copy spec to Unreal project
3. Run automation in Unreal Editor (see `docs/UNREAL_AUTOMATION.md`)
4. Copy screenshots to `assets/generated/`

### Build LMS Package

1. Run: `BuildLMS.bat` or `python build-lms.py`
2. Output: `lms-build/` directory
3. ZIP contents for upload to LMS

### Modify Quiz Behavior

- Edit `game.js` - **WARNING**: 53KB file, use search to find specific functions
- Key functions:
  - `initializeApp()` - Loads scenarios based on manifest
  - `loadScenario()` - Loads a specific scenario
  - `validateChoice()` - Handles answer validation

---

<!-- anchor: agent-workflow-best-practices -->
## Agent Workflow Best Practices

### 1. Start with Documentation

Always check `docs/ANCHOR_MANIFEST.md` first to find relevant documentation.

### 2. Use Anchors for Navigation

Search for anchors related to your task:

```bash
grep -r "anchor: lms-" docs/
```

### 3. Understand File Size

- `game.js` is 53KB - **don't try to read it all**
- Use search to find specific functions
- View only the sections you need

### 4. Follow the Manifest

- Only scenarios in `00_manifest.js` will display
- Coordinate changes between manifest and HTML script tags

### 5. Test Locally

- Server runs on `http://localhost:8000`
- Always test changes in browser before committing

### 6. Document Your Changes

- Create or update `.md` files in `docs/`
- Add anchors for searchability
- Update `ANCHOR_MANIFEST.md`

---

<!-- anchor: known-issues -->
## Known Issues

### Unreal Screenshot Automation

**Issue**: SceneBuilder fails on steps 2-4 with `'DirectionalLight' object has no attribute 'is_a'`

**Workaround**: Only step 1 screenshots currently generate

**Location**: `unreal_scripts/core/SceneBuilder.py`

**Status**: Needs debugging

### Manifest Filtering

**Issue**: All scenarios loaded via script tags, regardless of manifest

**Fix**: Commented out all scenario scripts except those in manifest

**Files**:

- `index.html` lines 208-229
- `scenarios/00_manifest.js`

---

<!-- anchor: git-workflow -->
## Git Workflow

### Committing Changes

1. Stage files: `git add -A` or specific files
2. Commit with descriptive message
3. Push to remote: `git push`

### Commit Message Format

```
Short summary (imperative mood)

- Bullet point details
- What changed and why
- Impact on other systems
```

### Before Major Changes

1. Check `git status`
2. Ensure working tree is clean
3. Pull latest: `git pull`

---

<!-- anchor: environment-setup -->
## Environment Setup

### Python Environment

```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt  # If exists
```

### Running Locally

```bash
python -m http.server 8000
# Visit http://localhost:8000
```

### Unreal Project

Path: `D:\UE5_Projects\UEScenarioFactory`

Python scripts location: `Content/Python/`

---

<!-- anchor: file-modification-cautions -->
## Files to Modify with Caution

### ⚠️ Large Files

- **`game.js`** (53KB) - Use search, don't read entire file
- **`raw_data.json`** (112KB) - Source data for scenarios

### ⚠️ Critical Files

- **`scenarios/00_manifest.js`** - Controls which scenarios display
- **`index.html`** - Script load order matters
- **`build-lms.py`** - LMS package generation

### ⚠️ Generated Files (Don't Edit)

- **`build/`** - Regenerated by tools
- **`lms-build/`** - Regenerated by build script

---

## Questions?

Check `docs/ANCHOR_MANIFEST.md` for related documentation or search for anchors:

```bash
# Find all anchors
grep -r "anchor:" docs/

# Search for specific topic
grep -r "anchor: unreal-" docs/
```
