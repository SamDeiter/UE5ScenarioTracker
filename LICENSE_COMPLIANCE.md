# License Documentation - UE5ScenarioTracker Screenshot Automation

**Project**: UE5ScenarioTracker - Screenshot Automation System  
**Purpose**: Epic Games Legal Review  
**Date**: 2025-12-07  
**Author**: Sam Deiter

---

## Executive Summary

**Zero external dependencies.** All code uses only:

1. Python Standard Library (PSF License)
2. Windows API (OS-level, no licensing)
3. Unreal Engine Built-in APIs (Epic Games)

---

## Dependencies Audit

### 1. Python Standard Library Components

**License**: [Python Software Foundation License](https://docs.python.org/3/license.html)  
**Type**: Permissive (GPL-compatible, commercially friendly)  
**Status**: ✅ APPROVED FOR COMMERCIAL USE

**Components Used**:

- `ctypes` - Foreign Function Interface for calling Windows API
- `os` - Operating system interfaces
- `sys` - System-specific parameters and functions
- `json` - JSON encoder and decoder
- `time` - Time access and conversions

**License Text Summary**:
> "Python and its standard library are distributed under the Python Software Foundation License. This is a permissive, BSD-style license that allows commercial use, modification, and redistribution."

**Legal Notes**:

- No copyleft restrictions
- No attribution required in binary distributions
- Compatible with proprietary software
- Used by thousands of commercial applications

---

### 2. Windows API (via ctypes)

**License**: Microsoft Windows Operating System  
**Type**: OS-level system calls  
**Status**: ✅ NO LICENSING CONCERNS

**Components Used**:

- `user32.dll` - Window management functions
  - `FindWindowW()` - Locate window by title
  - `SetForegroundWindow()` - Bring window to front
  - `GetWindowRect()` - Get window dimensions
  - `GetWindowDC()` - Get device context
- `gdi32.dll` - Graphics Device Interface
  - `CreateCompatibleDC()` - Create memory device context
  - `CreateCompatibleBitmap()` - Create bitmap
  - `BitBlt()` - Screen capture operation
  - `GetDIBits()` - Retrieve bitmap data

**Legal Notes**:

- System APIs provided by Windows OS
- No additional licensing required
- Standard practice in Windows applications
- Similar to using standard C library functions

---

### 3. Unreal Engine Python API

**License**: Unreal Engine EULA  
**Type**: Built-in UE scripting interface  
**Status**: ✅ INTERNAL EPIC TOOL

**Components Used**:

- `unreal` module (built into UE5)
  - `EditorLevelLibrary` - Level editing operations
  - `EditorUtilityLibrary` - Editor utilities
  - `SystemLibrary` - System functions
  - `log()`, `log_warning()`, `log_error()` - Logging

**Legal Notes**:

- Internal Epic Games technology
- Covered under existing Unreal Engine licensing
- No third-party dependencies

---

## Explicitly NOT Used (No Dependencies)

The following common libraries are **NOT USED** to avoid licensing complexity:

❌ **PIL/Pillow** (Python Imaging Library)

- License: MIT License (permissive but external)
- Reason not used: Not available in Unreal Python environment
- Alternative: Windows API via ctypes

❌ **pywin32** (Python for Windows Extensions)

- License: PSF License (permissive but external)
- Reason not used: Unnecessary - ctypes provides same functionality
- Alternative: ctypes standard library

❌ **numpy, scipy, etc.**

- Not used in any capacity

---

## Code Licensing Status

### Files with Zero External Dependencies

All files use ONLY Python stdlib + Windows API:

**Core Automation**:

- `unreal_scripts/experimental/WindowsPrintScreen.py` ✅
- `unreal_scripts/core/AutoGenerateScenarios.py` ✅
- `unreal_scripts/core/SceneBuilder.py` ✅
- `unreal_scripts/core/SceneExporter.py` ✅

**Test Files**:

- `unreal_scripts/tests/pilot_test_generator.py` ✅
- `unreal_scripts/tests/test_ui_automation.py` ✅

**Status**: All files are Epic-compliant with zero external package dependencies.

---

## Technical Implementation Details

### Screenshot Capture Method

**How it works**:

1. Use `ctypes` to call Windows API `FindWindowW()` to locate window
2. Call `BitBlt()` to copy screen pixels to memory bitmap
3. Use Python stdlib to write BMP file format (no external image libraries)

**Why this approach**:

- No external dependencies (PIL/Pillow not available in UE Python)
- Standard Windows programming practice
- Same technique used in C/C++ Windows applications

**Legal Precedent**:

- Equivalent to standard Win32 programming
- Microsoft explicitly documents these APIs for application use
- No licensing restrictions on calling OS-provided functions

---

## BMP File Format

**Format**: Windows Bitmap (.bmp)  
**Specification**: [Microsoft BMP File Format](https://docs.microsoft.com/en-us/windows/win32/gdi/bitmap-storage)  
**Status**: ✅ PUBLIC SPECIFICATION

**Implementation**:

- File format written using pure Python (no libraries)
- Based on public Microsoft documentation
- No proprietary codecs or algorithms

---

## Compliance Checklist

- [x] No GPL or copyleft licenses ✅
- [x] No external package dependencies ✅
- [x] No runtime downloads or network calls ✅
- [x] Python stdlib only (PSF License) ✅
- [x] Windows API only (OS-level) ✅
- [x] Unreal Engine APIs only (Epic internal) ✅
- [x] No proprietary third-party code ✅
- [x] Source code audited ✅

---

## Risk Assessment

| Component | License | Commercial Use | Risk Level |
|-----------|---------|----------------|------------|
| Python stdlib (ctypes, os, json) | PSF | ✅ Allowed | 🟢 NONE |
| Windows API (user32, gdi32) | OS-level | ✅ Allowed | 🟢 NONE |
| Unreal Engine API | Epic EULA | ✅ Internal | 🟢 NONE |

**Overall Risk**: 🟢 **NONE** - Zero licensing concerns

---

## Alternative Approaches Considered

### Option 1: PIL/Pillow (NOT USED)

- **License**: MIT (permissive)
- **Issue**: Not available in Unreal Python
- **Verdict**: Not feasible

### Option 2: pywin32 (NOT USED)

- **License**: PSF (permissive)
- **Issue**: Unnecessary external dependency
- **Verdict**: Avoided in favor of ctypes

### Option 3: Windows API via ctypes (SELECTED) ✅

- **License**: Python stdlib (PSF) + OS-level APIs
- **Benefits**: Zero external dependencies
- **Verdict**: Implemented

---

## License Compliance Statement

**I, Sam Deiter, certify that:**

1. This codebase contains **zero external package dependencies**
2. All code uses only:
   - Python Standard Library (PSF License - commercially permissive)
   - Windows OS APIs (no licensing restrictions)
   - Unreal Engine built-in APIs (Epic internal)
3. No third-party libraries, frameworks, or packages are used
4. All code is compatible with Epic Games commercial use requirements

**Signature**: Sam Deiter  
**Date**: 2025-12-07  
**Project**: UE5ScenarioTracker

---

## References

1. **Python Software Foundation License**  
   <https://docs.python.org/3/license.html>

2. **Windows API Documentation**  
   <https://docs.microsoft.com/en-us/windows/win32/>

3. **BMP File Format Specification**  
   <https://docs.microsoft.com/en-us/windows/win32/gdi/bitmap-storage>

4. **Unreal Engine Python API**  
   <https://docs.unrealengine.com/5.0/en-US/PythonAPI/>

---

## Contact for Legal Questions

**Developer**: Sam Deiter  
**Epic Games Employee**: Yes  
**GitHub**: <https://github.com/SamDeiter>  
**Project Repository**: <https://github.com/SamDeiter/UE5ScenarioTracker>

For legal review questions, contact Epic Games legal department with reference to this document.

---

**Last Updated**: 2025-12-07  
**Version**: 1.0  
**Status**: Ready for Legal Review ✅
