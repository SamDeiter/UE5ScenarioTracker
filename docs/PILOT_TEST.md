# Pilot Test Plan: Single Scenario Pipeline Validation

## Objective

Test the complete end-to-end pipeline with ONE scenario (`directional_light`) to validate the entire workflow before scaling to all 21 scenarios.

---

## Test Scenario: Abrupt Shadow Disappearance in Distant View

**Scenario ID**: `directional_light`
**Steps**: 3 (step-1, step-2, step-3, conclusion)
**Category**: Lighting

---

## Phase 1: Unreal Engine Screenshot Generation

### 1.1 Scene Setup Verification

For each step, verify the `sceneSetup` data in `scenarios/directional_light.js`:

#### Step 1: Diagnosing the Shadow Cutoff

**Expected Scene**:

- Level: `ScenarioCapture_Level`
- Directional Light at (0, 0, 500) with -45° rotation
- Landscape at origin (127x127)
- Sky Sphere at origin
- Sky Light (intensity 1.0, blue-ish color)
- Camera: (-800, 200) looking down -10°, FOV 90

**Editor Panels to Show**:

- `uiTemplate`: `"viewport_only"` - Viewport should fill the frame
- `hideUI`: true - No outliner or details panel
- `showGrid`: false - Grid hidden

**How Scene Should Look**:

- Wide outdoor landscape view
- Shadows visible near camera but cutting off abruptly at ~50m
- Directional light selected (highlighted in outliner if visible)
- Warm sunlight color (1.0, 0.95, 0.9)

#### Step 2: Fixing Low Resolution Shadows

**Scene Changes**:

- `dynamicShadowDistance`: 50000 (shadows now extend 500m)
- Light no longer selected

**How Scene Should Look**:

- Shadows now extend to distance BUT appear pixelated/blocky
- Same camera angle and lighting

#### Step 3: Final Verification

**Scene Changes**:

- `numDynamicShadowCascades`: 8 (shadows now sharp)
- `showPIEButton`: true (Play button visible in UI)

**How Scene Should Look**:

- Clean, sharp shadows extending full 500m
- Quality maintained throughout range

#### Conclusion

**Scene Changes**:

- Camera moved to (200, -1000, 300) with -15°, 10° rotation
- `exposureCompensation`: 0.5 (brighter)

**How Scene Should Look**:

- Wide angle beauty shot showing full shadow range
- Elevated camera for dramatic view

### 1.2 Automation Script Requirements

The Unreal Python script must:

1. Load `ScenarioCapture_Level`
2. Parse `sceneSetup` JSON from `directional_light.js`
3. Create/configure actors:
   - DirectionalLight with specified transform and properties
   - Landscape with terrain size
   - Sky Sphere
   - Sky Light
4. Position camera per `camera` spec
5. Apply `postProcess` settings
6. Capture screenshot
7. Save to `assets/generated/directional_light_step-1.png`
8. Repeat for all 4 steps

**Critical Settings**:

- Resolution: 1920x1080 (or higher)
- Format: PNG
- Anti-aliasing: High quality
- Auto-exposure: Enabled (per sceneSetup)

---

## Phase 2: Web Application Integration

### 2.1 Image File Verification

Check that images exist:

```
assets/generated/directional_light_step-1.png
assets/generated/directional_light_step-2.png
assets/generated/directional_light_step-3.png
assets/generated/directional_light_conclusion.png
```

### 2.2 Scenario Data Verification

In `scenarios/directional_light.js`, verify each step has:

```javascript
image: {
    url: "assets/generated/directional_light_step-1.png",
    alt: "UE5 Viewport showing shadow cutoff",
    prompt: "Unreal Engine 5 editor interface..."
}
```

### 2.3 Web Application Display

**Test in browser** (<http://localhost:8000>):

1. **Scenario appears in Sprint Backlog**:
   - Title: "Abrupt Shadow Disappearance in Distant View"
   - Description visible
   - Est. Time: 0.8 hrs displayed correctly

2. **Click scenario to open**:
   - Ticket view shows scenario title
   - Step 1 content loads

3. **Verify Step 1 display**:
   - ✅ Screenshot loads and displays
   - ✅ Prompt text renders with proper HTML formatting
   - ✅ All 3 choice buttons visible
   - ✅ No JavaScript errors in console

4. **Test navigation**:
   - Click correct answer → advances to Step 2
   - Click wrong answer → shows feedback, stays on Step 1
   - Timer counts down properly

5. **Complete scenario**:
   - Navigate through all steps
   - Verify conclusion step displays
   - Check that scenario marked complete in backlog

---

## Phase 3: Success Criteria

### ✅ Unreal Automation Success

- [ ] All 4 screenshots generated without errors
- [ ] Images match expected scene setup
- [ ] Screenshots clearly show the described problem/solution
- [ ] Images saved to correct directory with correct filenames

### ✅ Web Integration Success

- [ ] Scenario loads in application
- [ ] All images display correctly
- [ ] No broken image links
- [ ] Prompt text formatting correct (bold, code tags)
- [ ] All 3 steps + conclusion accessible

### ✅ User Experience Success

- [ ] Screenshots clearly illustrate the lighting problem
- [ ] Visual progression clear (problem → solution → verification)
- [ ] No performance issues loading images
- [ ] Responsive layout works on different screen sizes

---

## Phase 4: Issues & Fixes Log

### Known Issues

1. **Issue**: [Description]
   - **Cause**: [Root cause]
   - **Fix**: [Solution applied]
   - **Status**: [Fixed/In Progress/Blocked]

### Test Results

- **Date**: [Test date]
- **Tester**: [Your name]
- **Result**: [Pass/Fail]
- **Notes**: [Observations]

---

## Phase 5: Scale-Up Checklist

Once pilot succeeds, prepare for all 21 scenarios:

### Pre-Scale Validation

- [ ] Document any manual steps needed
- [ ] Create batch automation script
- [ ] Estimate time for full generation (21 scenarios × ~4 steps = 84 screenshots)
- [ ] Verify disk space for images (~200MB estimated)

### Batch Process

- [ ] Run automation for all scenarios
- [ ] Verify all images generated
- [ ] Check for any failed scenarios
- [ ] Update manifest to include all 21 scenarios
- [ ] Test web app performance with full library

---

## Next Actions

1. **Immediate**: Run Unreal automation for `directional_light` scenario
2. **Verify**: Check all 4 images generated correctly
3. **Test**: Load <http://localhost:8000> and complete scenario
4. **Document**: Log any issues in Phase 4
5. **Decide**: If successful, proceed to scale-up; if not, debug and iterate
