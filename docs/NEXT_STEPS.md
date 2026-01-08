# UE5ScenarioTracker - Next Steps Implementation Plan

## Overview

This plan outlines the next development phase for the UE5ScenarioTracker application following the successful implementation of manifest-based scenario filtering.

## Current State

- ✅ Manifest-based scenario filtering implemented
- ✅ Legacy `questions.js` removed/commented out
- ✅ Only `directional_light` scenario currently active
- ✅ Centralized control via `scenarios/00_manifest.js`

---

## Phase 1: Expand Scenario Library

### 1.1 Activate Existing Scenarios

> [!NOTE]
> **REVISIT AFTER PHASE 2**: Complete Phase 2 automation pipeline with the `directional_light` pilot scenario first. Once the full workflow is proven (scene setup → screenshot → export), come back and scale to all 21 scenarios.

**Goal**: Add the 21 generated scenarios back to the application using the new manifest system.

#### Tasks

- [ ] Update `00_manifest.js` to include all 21 scenario IDs:
  - `BlackMetallicObject`
  - `BlackMaterialDueToEmissiveMiswiring`
  - `ComponentMobilityBlock`
  - `ConstraintDoorFail`
  - `DanglingAssetRedirectors`
  - `DataLayerStreamingOverride`
  - `DecalTextureAlphaMaskFailure`
  - `DestroyActorStopsExecutionFlow`
  - `EmissiveGILightingFix`
  - `ForcedDataLayerUnload`
  - `LockedCinematicCleanup`
  - `MaterialParameterAndAnimJitter`
  - `MismatchedSkeletonReference`
  - `NaniteVSMInstabilityOnMovement`
  - `PhysicsLeverFailure`
  - `RedirectorAndBulkLoadConflict`
  - `SecurityDoorLogicGap`
  - `SequencerLightRestoreStateIssue`
  - `VaultSequenceLockup`
  - `VolumetricShadowingPerformance`
  - `WorldPartitionDeepDive`

- [ ] Re-add all 21 `<script>` tags to `index.html`
- [ ] Test that all scenarios load correctly
- [ ] Verify manifest filtering works with multiple scenarios

### 1.2 Scenario Organization

- [ ] Group scenarios by category in the manifest (if needed)
- [ ] Consider adding metadata to manifest for better organization
- [ ] Document scenario naming conventions

---

## Phase 2: Image Generation & Integration

### 2.1 Automation Feasibility Study (CRITICAL)

**Goal**: Verify that the Unreal Python API allows for sufficient control over the Editor UI (opening specific windows, panels, and modifying tool settings) before committing to full automation. **We have not yet verified if we can programmatically manipulate these UI elements.**

#### Tasks

- [ ] **Research**: Investigate Unreal Python API capabilities for:
  - Opening/Closing specific Editor tabs and windows (e.g., Detail panel, World Settings, Lightmixer).
  - **Details Panel**: Automating selection and ensuring specific properties/settings are visible (expanded and in view) for screenshots.
  - **Complex Editors**: Automating interactions within the **Material Editor** and **Animation Blueprint** editor (e.g., selecting nodes, changing pin values).
  - Modifying tool-specific settings dynamically.
- [ ] **Prototype**: Run feasibility test script:
  - Execute `unreal_scripts/tests/test_ui_automation.py` in UE5.6
  - Follow instructions in `unreal_scripts/tests/PHASE_2.1_QUICKSTART.md`
  - Document which capabilities are available vs. limited
- [ ] **Pilot Test**: Generate 4 test screenshots:
  - Run `unreal_scripts/tests/pilot_test_generator.py`
  - Verify 4 distinct images are created with different camera angles/UI states
- [ ] **Evaluate**: Determine if the current `sceneSetup` JSON structure supports the required API calls.

### 2.2 Unreal Engine Screenshot Automation (Conditional)

**Goal**: Assuming Phase 2.1 supports it, implement the full automation pipeline.

#### Tasks

- [ ] Create/update Python script to:
  - Load scenario specifications from JSON.
  - Set up scenes based on validated `sceneSetup` data.
  - Capture screenshots from specified camera positions.
  - Save images to `assets/generated/` directory.
- [ ] Generate images for `directional_light` scenario (pilot test).
  - **Requirement**: Ensure at least 4 distinct screenshots are generated (different camera angles or scene states).
- [ ] Verify images display correctly in the web application.
- [ ] Batch generate images for all 21 scenarios.

### 2.3 Image Asset Management

- [ ] Ensure all generated images are in `assets/generated/`
- [ ] Verify image paths in scenario files match actual files
- [ ] Add fallback images for scenarios missing screenshots
- [ ] Optimize image sizes for web performance

---

## Phase 3: Testing & Quality Assurance

### 3.1 Functional Testing

- [ ] Test scenario navigation (clicking through all steps)
- [ ] Verify choice feedback displays correctly
- [ ] Test timer countdown functionality
- [ ] Verify localStorage persistence (refresh mid-scenario)
- [ ] Test "Clear Cache & Restart" in debug mode

### 3.2 UI/UX Testing

- [ ] Verify all text formatting (bold, code tags) displays correctly
- [ ] Test responsive layout on different screen sizes
- [ ] Verify UE5 color scheme consistency
- [ ] Test accessibility (keyboard navigation, screen readers)

### 3.3 Performance Testing

- [ ] Test with all 21 scenarios loaded
- [ ] Check page load time
- [ ] Verify no memory leaks during extended sessions
- [ ] Test localStorage quota handling

---

## Phase 4: LMS/SCORM Package Updates

### 4.1 Update LMS Build Script

**Goal**: Ensure the LMS build process works with the new manifest system.

#### Tasks

- [ ] Review `build-lms.py` script
- [ ] Update to handle manifest-based scenario loading
- [ ] Test LMS package generation
- [ ] Verify SCORM 1.2 compliance
- [ ] Test package in LMS environment

### 4.2 SCORM Integration Testing

- [ ] Test score reporting to LMS
- [ ] Verify test key generation
- [ ] Test `TestKeyAudit.html` functionality
- [ ] Ensure silent background reporting works

---

## Phase 5: Documentation & Deployment

### 5.1 Developer Documentation

- [ ] Document manifest system architecture
- [ ] Create guide for adding new scenarios
- [ ] Document image generation workflow
- [ ] Update README with current architecture

### 5.2 User Documentation

- [ ] Update user guide for the application
- [ ] Document debug mode features
- [ ] Create troubleshooting guide

### 5.3 Deployment

- [ ] Create production build
- [ ] Test production build locally
- [ ] Deploy to hosting environment
- [ ] Verify all assets load correctly in production

---

## Phase 6: Future Enhancements

### 6.1 Scenario Generator Integration

- [ ] Review existing generator UI at `http://localhost:5000/`
- [ ] Ensure generator creates manifest-compatible scenarios
- [ ] Test end-to-end workflow: generate → add to manifest → test

### 6.2 Advanced Features

- [ ] Consider adding scenario difficulty ratings
- [ ] Implement scenario search/filter functionality
- [ ] Add scenario completion statistics
- [ ] Consider multi-language support

### 6.3 Performance Optimizations

- [ ] Implement lazy loading for scenario scripts
- [ ] Optimize image loading (lazy load, WebP format)
- [ ] Minimize JavaScript bundle size
- [ ] Add service worker for offline functionality

---

## Priority Order

### High Priority (Complete First)

1. Phase 1.1 - Activate all existing scenarios
2. Phase 3.1 - Functional testing
3. Phase 2.1 - Generate screenshots for pilot scenario

### Medium Priority (Complete Next)

2. Phase 2.2 - Complete image generation for all scenarios
3. Phase 4.1 - Update LMS build process
4. Phase 5.1 - Update documentation

### Low Priority (Future Work)

5. Phase 6 - Future enhancements
6. Performance optimizations

---

## Notes & Considerations

### Technical Debt

- Old `questions.js` file is commented out but still in the repository
  - **Action**: Consider deleting or moving to archive folder
- Some lint errors exist in `game.js` (pre-existing)
  - **Action**: Address when refactoring that code

### Dependencies

- Unreal Engine Python automation must be functional for image generation
- LMS environment access needed for SCORM testing

### Risk Mitigation

- Test each scenario individually before batch processing
- Keep backups before making major changes to manifest system
- Version control all generated assets

---

## Success Criteria

**Phase 1 Complete When:**

- All 21 scenarios load and display correctly
- Manifest filtering works as expected
- No JavaScript errors in console

**Phase 2 Complete When:**

- All scenario steps have corresponding screenshots
- Images load quickly and display correctly
- Unreal automation runs without manual intervention

**Phase 3 Complete When:**

- All functional tests pass
- No critical bugs identified
- Performance is acceptable with full scenario library

**Project Complete When:**

- All scenarios fully functional with images
- LMS package builds successfully
- Documentation is complete and accurate
- Application is deployed and accessible
