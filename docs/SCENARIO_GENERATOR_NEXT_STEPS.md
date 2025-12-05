# Next Steps - Scenario Generator Project

## ✅ Completed

- Branching narrative generator working
- BlackMetallicObject scenario generated successfully (41 steps, 80.2KB)
- All validations passing
- Code committed to git

## 🎯 Next Steps (Prioritized)

### Phase 1: Validation & Quality (IMMEDIATE)

#### 1.1 Test Generated Scenario in Application ⭐

**Priority**: HIGH  
**Time**: 15 minutes

- [ ] Open `index.html` in browser
- [ ] Load BlackMetallicObject scenario
- [ ] Play through 5-10 steps
- [ ] Verify:
  - Prompts make sense
  - Choices are plausible
  - Feedback is helpful
  - Branching works (try wrong choices)
  - Time tracking works

#### 1.2 Generate Second Scenario

**Priority**: HIGH  
**Time**: 5 minutes

- [ ] Check what the 2nd scenario in raw_data.json is
- [ ] Run generator on it
- [ ] Verify it also passes validation

#### 1.3 Manual Quality Review

**Priority**: MEDIUM  
**Time**: 30 minutes

- [ ] Read through generated scenario
- [ ] Check for accurate UE5 terminology
- [ ] Verify logical progression

### Phase 2: Content (NEXT)

#### 2.1 Forum Research for New Scenarios

**Priority**: MEDIUM  
**Time**: 2-3 hours

- [ ] Epic Games forums (forums.unrealengine.com)
- [ ] Find top 20-30 non-Blueprint/C++ issues
- [ ] Convert to raw_data.json format

#### 2.2 Batch Generation Script

**Priority**: LOW  
**Time**: 30 minutes

- [ ] Create `generate_all.py`
- [ ] Generate all scenarios at once

---

**Immediate TODO**: Test scenario in browser, then generate 2nd scenario
