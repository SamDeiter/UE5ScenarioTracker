# LMS Build System - Documentation

## Overview

The `build-lms.py` script creates production-ready SCORM 1.2 packages for LMS deployment by stripping all development features and debug functionality from the UE5 Scenario Tracker.

## What Gets Removed

The build process automatically removes:

### HTML Changes

- ❌ Launcher link (to launcher.html)  
- ❌ Generator UI link (localhost:5000)
- ❌ Debug controls container
- ❌ Debug dropdown menu
- ✅ Injects `IS_LMS_BUILD = true` flag

### JavaScript Changes

- ❌ Debug password modal
- ❌ Debug mode toggle functionality
- ❌ Debug navigation controls
- ❌ Debug event listeners
- ✅ Adds runtime `IS_LMS_BUILD` checks

### Files Excluded

- Development tools (`tools/` directory)
- Python scripts (`*.py`)
- Batch files (`*.bat`)
- Documentation (`*.md`, `docs/`)
- Archives and temp files
- Git repository
- Virtual environments

## Usage

### Basic Build

```bash
python build-lms.py
```

Creates a clean build in `lms-build/` directory.

### Build with Version Number

```bash
python build-lms.py --version 2.0.1
```

Sets the version number in the SCORM manifest.

### Create ZIP Package

```bash
python build-lms.py --zip
```

Builds and creates a`UE5-Scenario-Tracker-v[VERSION]-LMS.zip` file ready for LMS upload.

### Clean Build

```bash
python build-lms.py --clean
```

Deletes existing `lms-build/` directory before building (default behavior).

### Combined Example

```bash
python build-lms.py --clean --zip --version 1.0.0
```

## Build Output

### Directory Structure

```
lms-build/
├── index.html          (modified - no debug/launcher links)
├── game.js             (modified - debug features disabled)
├── questions.js
├── style.css
├── imsmanifest.xml     (updated with file list and version)
├── localization.js
├── js/
│   ├── dash.js
│   ├── game.js
│   └── scorm12-helper.js
├── scenarios/
│   └── [65 scenario files]
└── assets/
    └── [all asset files]
```

### Package Details

- **Size**: ~28 MB
- **Files**: ~100 files
- **Format**: SCORM 1.2 compliant
- **Features**: All scenarios, timer, scoring, SCORM integration

## Testing the Build

### Local Testing

1. Open `lms-build/index.html` in a browser
2. Verify:
   - ✅ No launcher link visible
   - ✅ No generator link visible
   - ✅ No debug controls in header
   - ✅ Scenarios load correctly
   - ✅ Timer functions properly

### LMS Testing

1. Upload the `.zip` package to your LMS
2. Launch the SCORM module
3. Complete a scenario
4. Verify SCORM tracking works (score, completion)

## SCORM Cloud Upload

For testing with SCORM Cloud:

1. Go to [SCORM Cloud](https://cloud.scorm.com/)
2. Upload `UE5-Scenario-Tracker-v[VERSION]-LMS.zip`
3. Launch the course
4. Complete assessment
5. Check completion and scoring data

## Build Process Details

### Step 1: Clean Build Directory

Removes existing `lms-build/` folder to ensure clean state.

### Step 2: Copy Core Files

Copies only production files:

- HTML, CSS, JS files
- Scenario files
- Assets (images, icons)

### Step 3: Modify index.html

- Injection of `window.IS_LMS_BUILD = true`
- Removal of launcher/generator links
- Removal of debug UI controls

### Step 4: Modify game.js

- Add `IS_LMS_BUILD` constant check
- Disable `showPasswordModal()`
- Disable `toggleDebugMode()`
- Wrap debug listeners in conditional checks

### Step 5: Update SCORM Manifest

- Update version identifier
- Generate dynamic file list
- Add build timestamp

### Step 6: Create ZIP (optional)

- Compress all files
- Create SCORM-compliant package structure

## Troubleshooting

### Build Fails

- Ensure you're in the project root directory
- Check Python 3 is installed
- Verify all source files exist

### ZIP Creation Fails

- Check disk space
- Ensure write permissions
- Remove existing .zip file

### LMS Upload Issues

- Verify SCORM 1.2 compatibility
- Check file size limits
- Ensure manifest is valid XML

## Version History

### v1.0.0 (2025-12-06)

- Initial automated build system
- HTML modification (launcher/debug removal)
- JavaScript modification (disable debug features)
- Dynamic SCORM manifest generation
- ZIP package creation

## Next Steps

After building:

1. **Test Locally** - Verify the build works in a browser
2. **Upload to LMS** - Deploy the .zip to your learning management system
3. **QA Testing** - Complete full scenarios to ensure functionality
4. **Monitor Scores** - Verify SCORM tracking is working

## Support

For issues with the build process, check:

- [LMS_DEPLOYMENT_REQUIREMENTS.md](LMS_DEPLOYMENT_REQUIREMENTS.md)
- Project README.md
- GitHub Issues

---

**Last Updated**: December 6, 2025  
**Script**: `build-lms.py`  
**Version**:  1.0.0
