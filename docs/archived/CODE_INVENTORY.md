# Code Inventory - What We Have

## ⚠️ STATUS: Needs Cleanup

We have accumulated many scripts. Here's what exists and what's actually used.

---

## 📁 Root Level Files

| File | Purpose | Status |
|------|---------|--------|
| `index.html` | Web quiz app | ✅ ACTIVE |
| `game.js` | Quiz logic | ✅ ACTIVE |
| `launcher.html` | Launch portal | ✅ ACTIVE |
| `style.css` | Styling | ✅ ACTIVE |
| `questions.js` | Legacy questions? | ❓ CHECK |
| `localization.js` | i18n | ✅ ACTIVE |
| `build-lms.py` | SCORM build | ✅ ACTIVE |
| `validate_json.py` | JSON validation | 🔧 UTILITY |
| `fix_syntax_errors.py` | Fixer script | 🔧 UTILITY |

---

## 📁 unreal_scripts/core/ (10 files!)

| File | Purpose | Status |
|------|---------|--------|
| `AgentUtils.py` | UE5 utilities | ❓ UNUSED? |
| `AutoGenerateScenarios.py` | Main automation | ⚠️ BUGGY |
| `SceneBuilder.py` | Scene setup | ⚠️ CLEARS SCENE |
| `SceneExporter.py` | Export scene | ❓ UNUSED? |
| `SceneInspector.py` | Scene analysis | ❓ UNUSED? |
| `CameraOnlyCapture.py` | Camera + capture | ⚠️ DEBUGGING |
| `CameraDebug.py` | Debug script | 🔧 DEBUG |
| `HighResShotCapture.py` | Native screenshot | 🆕 NEW |
| `ManualCapture.py` | Manual workflow | 🆕 NEW |
| `SlowCapture.py` | Slow debug | 🔧 DEBUG |

---

## 📁 unreal_scripts/experimental/

| File | Purpose | Status |
|------|---------|--------|
| `WindowsPrintScreen.py` | Window capture | ⚠️ TIMING ISSUES |

---

## 📁 tools/python/ (81 files!)

This is a lot. Need to audit what's actually used.

---

## 📁 scenarios/ (73 files!)

Scenario definitions. Only `directional_light.js` actively tested.

---

## 🔴 RECOMMENDATION

1. **Delete debug scripts** - CameraDebug, SlowCapture, etc.
2. **Pick ONE capture approach** - Manual with ScreenshotReceiver
3. **Archive unused UE scripts** - AgentUtils, SceneInspector, etc.
4. **Audit tools/python/** - 81 files is too many

---

## ✅ CORE FILES (What we actually need)

**Web App:**

- `index.html`
- `game.js`
- `style.css`
- `scenarios/*.js`

**Screenshot Workflow (NEW):**

- `unreal_scripts/core/ManualCapture.py` - UE5 camera setup
- `tools/python/ScreenshotReceiver.py` - Clipboard capture

**Build:**

- `build-lms.py` - SCORM packaging

---

## 🗑️ CANDIDATES FOR DELETION

- `unreal_scripts/core/CameraDebug.py`
- `unreal_scripts/core/SlowCapture.py`
- `unreal_scripts/core/CameraOnlyCapture.py`
- `unreal_scripts/core/HighResShotCapture.py`
- `directional_light_camera_spec.json`
- `directional_light_full_spec.json`
- `temp_spec.json`
- `test_*.json`
- `test_screenshot.bmp`
