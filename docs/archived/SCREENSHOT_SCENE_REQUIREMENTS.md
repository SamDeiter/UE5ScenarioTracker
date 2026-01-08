# Screenshot Generation - Scene Setup Requirements

## ⚠️ IMPORTANT: Visual Differences Between Steps

The automation script captures screenshots of the Unreal viewport, but **it cannot create visual differences that don't exist in your scene**.

### What the Script CAN Do

- ✅ Change camera position/angle between steps
- ✅ Set light properties (intensity, color, shadow settings)
- ✅ Spawn/configure actors from specs
- ✅ Apply post-process settings

### What the Script CANNOT Do

- ❌ **Create visible shadow differences** without objects casting shadows at varying distances
- ❌ **Show "pixelated shadows"** without actual geometry to demonstrate the artifact
- ❌ **Demonstrate before/after fixes** if the scene lacks visual elements to show the problem

---

## Scene Setup Checklist

Before running the automation, ensure your UE5 scene has:

### 1. Shadow-Casting Objects at Multiple Distances

For shadow scenarios, place objects at:

- **Near** (0-50m): Shows shadows that always work
- **Mid** (50-200m): Shows where short shadow distance cuts off
- **Far** (200-500m): Shows improvement after fix

**Examples:**

- Cubes/pillars at regular intervals
- Trees/foliage scattered across landscape
- Buildings or structures at varying distances

### 2. Ground Plane Receiving Shadows

- Landscape with visible texture/material
- Or a large floor mesh

### 3. Proper Lighting

- Directional Light at steep angle (around -45° pitch)
- Intensity high enough to see shadows clearly

---

## Recommended Workflow

### Option A: Pre-Built Scene (Recommended)

1. **Manually set up** a scene in UE5 with all visual elements
2. Save as a reusable level (`ScenarioCapture_Level`)
3. Use automation only for:
   - Camera positioning
   - Light property changes
   - Screenshot capture

### Option B: Manual Screenshots

For scenarios requiring subtle visual changes:

1. Set up the scene manually for Step 1
2. Take screenshot manually (F9 or HighResScreenshot)
3. Adjust settings for Step 2
4. Repeat

### Option C: Placeholder Images

1. Use AI-generated mockup images
2. Replace with real screenshots later
3. Good for testing the web pipeline

---

## Example: Directional Light Shadow Scenario

To properly demonstrate shadow distance changes, your scene needs:

```
Scene Elements:
├── Landscape (ground to receive shadows)
├── 5-10 Cubes placed at intervals:
│   ├── Cube at (0, 100, 50)      - 1m away
│   ├── Cube at (0, 500, 50)      - 5m away  
│   ├── Cube at (0, 2000, 50)     - 20m away
│   ├── Cube at (0, 5000, 50)     - 50m away (shadow cutoff point)
│   ├── Cube at (0, 10000, 50)    - 100m away
│   └── Cube at (0, 50000, 50)    - 500m away
├── Directional Light
│   ├── Rotation: (-45, 0, 0)
│   └── Shadow Distance: varies per step
└── Sky Light (ambient fill)
```

**Step 1**: Shadow Distance = 5000 → Only first 4 cubes have shadows
**Step 2**: Shadow Distance = 50000 → All cubes have shadows (but blurry)
**Step 3**: Cascades = 8 → All cubes have sharp shadows

---

## Quick Debug Tips

If screenshots all look the same:

1. Check the Output Log for errors
2. Verify camera positions are actually different
3. Confirm your scene has visible objects at different distances
4. Try moving camera dramatically (±1000 units) to confirm it's working

---

## File Locations

| File | Purpose |
|------|---------|
| `directional_light_camera_spec.json` | Spec with different camera angles |
| `unreal_scripts/core/SceneBuilder.py` | Scene setup logic |
| `unreal_scripts/core/AutoGenerateScenarios.py` | Main automation script |
