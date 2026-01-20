# UE5 Scenario Tracker - Capture Workflow

## CRITICAL: Screenshots Capture FULL EDITOR UI

**NOT just the scene** - we capture the entire UE5 Editor window including:

- Viewport (scene view)
- Details panel (shows selected actor properties)
- Outliner
- Toolbar
- Any visible UI elements

This is intentional because:

1. Users need to see WHERE to find settings
2. UI context is part of the learning
3. Tests assess both scene knowledge AND editor navigation

## Workflow

1. **Script changes light settings only** - does NOT move camera
2. **User positions camera manually** - for best composition
3. **User presses PrintScreen** - captures full editor window
4. **ScreenshotReceiver.py** saves from clipboard

## Script Functions

```python
ManualCapture.setup_step_1()  # Sets shadow to 50m (problem)
ManualCapture.setup_step_2()  # Sets shadow to 500m, 4 cascades (blocky)
ManualCapture.setup_step_3()  # Sets shadow to 500m, 8 cascades (fixed)
ManualCapture.show_current()  # Shows current settings
```

The script modifies DirectionalLight properties ONLY - camera stays where user positioned it.
