# UE5 Scenario Image Generation Plan

## Objective

Enhance the UE5 Scenario Tracker by automatically generating realistic Unreal Engine 5 editor interface images for each scenario step. These images will provide visual context for the quizzes, helping users identify the correct settings and menus.

## 1. Data Structure Update

The scenario data structure (in `.js` files) will be updated to include an `image` property for each step.

### Schema

```javascript
'step-id': {
    // ... existing fields ...
    image: {
        url: "assets/generated/scenario_name_step_id.webp", // Path to the generated image
        alt: "Description of the image for accessibility",
        prompt: "The exact prompt used to generate this image" // Kept for reference/regeneration
    },
    // OR, for steps needing generation:
    imagePrompt: "Describe the UE5 interface state here..." // Signal that an image needs to be generated
}
```

## 2. UI Integration

The `js/game.js` file will be modified to check for the `image` property in the `renderStep` function.

### Rendering Logic

* **Location**: The image will be displayed immediately after the step title and before the prompt text.
* **Styling**: Images will be responsive, with a maximum height to avoid pushing content too far down.
* **Lightbox**: (Future) Optional click-to-expand functionality.

## 3. Prompt Engineering Strategy

Generating text-heavy UI images is difficult for standard models. We will use a specific prompting strategy to maximize accuracy:

* **Context**: Always start with "Unreal Engine 5 editor interface screen capture".
* **Specific Panel**: Focus on the relevant panel (e.g., "Details Panel focused on Directional Light component").
* **Key Values**: Explicitly state the setting values (e.g., "Dynamic Shadow Distance Movable Light set to 20000").
* **Style**: "Dark gray theme, sharp text, high resolution, 4k".

**Example Prompt:**
> Unreal Engine 5 editor interface, Details Panel showing 'DirectionalLightComponent'. Highlighting the 'Cascaded Shadow Maps' section. 'Dynamic Shadow Distance Movable Light' setting allows input. Dark UI theme.

## 4. Automation Workflow

To automate the creation of these images:

1. **Scan**: A script/agent scans all scenario `.js` files for `imagePrompt` fields where the corresponding `image` object is missing.
2. **Generate**: The agent uses an image generation tool (e.g., DALL-E 3) using the `imagePrompt`.
3. **Save**: The image is saved to `assets/generated/<scenario>_<step>.webp`.
4. **Update**: The scenario `.js` file is updated to include the new `image` object pointing to the file.

## 5. Implementation Steps

1. **Modify `js/game.js`**: Implement the image rendering logic.
2. **Create Placeholder**: Add an `imagePrompt` to `scenarios/directional_light.js` 'step-1'.
3. **Generate Test Image**: Manually trigger generation for the placeholder to validate the workflow.
4. **Batch Process**: (Future) Run the scanner on all scenarios.
