# Code Audit Action Plan

**Created:** 2025-12-12  
**Based on:** [CODE_AUDIT_REPORT.md](./CODE_AUDIT_REPORT.md)

---

## Overview

This action plan provides step-by-step fixes for issues identified in the code audit. Items are prioritized by severity and grouped into manageable tasks.

---

## 🔴 Priority 1: Critical Security Fix (Do First)

### Issue #1: Hardcoded Debug Password

**File:** `game.js` line 8  
**Risk:** Anyone can enable debug mode by viewing source code

- [ ] **Step 1.1:** Remove the hardcoded password constant

  ```javascript
  // DELETE this line from game.js:8
  const DEBUG_PASSWORD = 'IloveUnreal';
  ```

- [ ] **Step 1.2:** Make debug mode require a build flag instead

  ```javascript
  // Add at top of game.js
  const IS_DEBUG_BUILD = false; // Set to true only for dev builds
  ```

- [ ] **Step 1.3:** Update `showPasswordModal()` to check build flag

  ```javascript
  function showPasswordModal() {
      if (!IS_DEBUG_BUILD) return; // Block entirely in production
      // ... rest of function
  }
  ```

- [ ] **Step 1.4:** Verify LMS build already strips debug features
  - Check `build-lms.py` line 147-153 ✅ Already implemented

**Estimated Time:** 15 minutes

---

## 🟠 Priority 2: High Security Improvements

### Issue #2: Remove Backup Files from Repository

**Risk:** Backup files cluttering repo and potentially exposing old code

- [ ] **Step 2.1:** Add `*.bak` to `.gitignore`

  ```gitignore
  # Add to .gitignore
  *.bak
  ```

- [ ] **Step 2.2:** Remove existing backup files

  ```powershell
  cd c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\scenarios
  git rm "Directional_Light.js.bak"
  git rm "LumenGIMeshDistanceFailure.js.bak"
  git rm "NaniteWPOShadingCacheFailure.js.bak"
  git rm "assetmanagement_beginner.js.bak"
  ```

- [ ] **Step 2.3:** Commit the cleanup

  ```powershell
  git add -A
  git commit -m "chore: remove backup files and update gitignore"
  ```

**Estimated Time:** 5 minutes

---

### Issue #3: Clean Up Console Statements

**Risk:** Debug info leaking to production, minor performance impact

- [ ] **Step 3.1:** Add debug logging wrapper to `game.js`

  ```javascript
  // Add near top of game.js
  const DEBUG_LOGGING = false; // Toggle for dev builds
  const debugLog = DEBUG_LOGGING ? console.log.bind(console) : () => {};
  ```

- [ ] **Step 3.2:** Replace console.log calls in game.js
  - Line 276: `console.error(...)` → Keep (error logging is fine)
  - Line 463-464: `console.error(...)` → Keep (error logging is fine)
  - Line 720: `console.error(...)` → Keep (error logging is fine)
  - Line 1222: `console.log('SCORM data sent...')` → Change to `debugLog(...)`
  - Line 1228: `console.warn(...)` → Keep (warning is fine)
  - Line 1360: `console.log('Debug nav:...')` → Change to `debugLog(...)`

**Estimated Time:** 10 minutes

---

## 🟡 Priority 3: Code Quality Improvements

### Issue #4: Update Deprecated Clipboard API

**File:** `game.js` lines 1316-1322

- [ ] **Step 4.1:** Replace deprecated `execCommand('copy')` with modern API

  ```javascript
  // Replace the copy button handler (around line 1313-1328)
  copyButton.addEventListener('click', async () => {
      const keyToCopy = keyDisplay.textContent.trim();
      
      try {
          // Modern Clipboard API
          await navigator.clipboard.writeText(keyToCopy);
          copyButton.textContent = 'Copied!';
      } catch (err) {
          // Fallback for iframes/older browsers
          const tempInput = document.createElement('textarea');
          tempInput.value = keyToCopy;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
          copyButton.textContent = 'Copied!';
      }
      
      setTimeout(() => {
          copyButton.textContent = 'Copy Key';
      }, 2000);
  });
  ```

**Estimated Time:** 10 minutes

---

### Issue #5: Safer DOM Manipulation (Optional Enhancement)

**Risk:** Future XSS if user content is ever added

- [ ] **Step 5.1:** Create a sanitization helper (for future use)

  ```javascript
  // Add a simple escape function for any future user content
  function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
  }
  ```

- [ ] **Step 5.2:** Document which innerHTML usages are safe
  - Currently all data comes from trusted `.js` scenario files ✅
  - Add comment: `// SECURITY: innerHTML is safe here - data from trusted local files`

**Estimated Time:** 15 minutes (optional)

---

## 📋 Quick Reference Checklist

Copy this to track progress:

```markdown
## Code Audit Fixes - Progress Tracker

### Priority 1 (Critical)
- [ ] Remove hardcoded debug password
- [ ] Add IS_DEBUG_BUILD flag
- [ ] Verify LMS build stripping

### Priority 2 (High)
- [ ] Add *.bak to .gitignore
- [ ] Remove backup files from repo
- [ ] Add debug logging wrapper
- [ ] Replace console.log with debugLog

### Priority 3 (Medium)
- [ ] Update clipboard API with fallback
- [ ] Document innerHTML safety

### Final Steps
- [ ] Run `npm run dev` and test locally
- [ ] Build LMS package and verify
- [ ] Commit all changes
- [ ] Push to GitHub
```

---

## Commit Strategy

Recommended commit sequence:

1. `security: remove hardcoded debug password, add build flag`
2. `chore: remove backup files, update gitignore`
3. `refactor: add debug logging wrapper, clean console statements`
4. `fix: update clipboard API with modern fallback`

---

## Verification Steps

After completing fixes:

1. **Test locally:**

   ```powershell
   cd c:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker
   python -m http.server 8000
   ```

   - Visit <http://localhost:8000>
   - Verify debug mode toggle works (or is hidden in prod mode)
   - Complete a scenario and verify copy button works

2. **Build LMS package:**

   ```powershell
   python build-lms.py --clean
   ```

   - Verify debug features are stripped

3. **Check git status:**

   ```powershell
   git status
   git diff
   ```

---

## Notes

- The Python `tools/` console.log statements are acceptable (development utilities)
- The `innerHTML` usages are currently safe since all data is from local files
- SCORM compliance is already good - no changes needed there

---

*Action plan generated from code audit results*
