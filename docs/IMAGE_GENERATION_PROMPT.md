# UE5 Image Generation Master Prompt

Use the following prompt when asking an LLM (like ChatGPT, Gemini, or Claude) to generate the images and update the code for you.

---

**Copy and paste the text below:**

I am working on an educational tool for Unreal Engine 5. I have a list of pending image requests extracted from my scenario files.

**Your Task:**

1. **Generate Images**: For each item in the "Pending Requests" list below, generate a high-quality, realistic image of the Unreal Engine 5 editor based on the `prompt`.
    * **Style**: Professional, dark UI theme, sharp text, 4k resolution.
    * **Aspect Ratio**: 16:9 (Landscape).
    * **Content**: Ensure the specific panels and settings mentioned are visible and accurate.

2. **Generate JSON Definitions**: After generating the images, provide me with the Javascript code snippet to update the scenario file.
    * The snippet should be the `image` object that I can paste directly into the `.js` file.
    * **Format**:

        ```javascript
        image: {
            url: "assets/generated/FILENAME.webp",
            alt: "A description of the image",
            prompt: "The prompt used"
        }
        ```

    * **Filename Convention**: `scenario_name_step_id.webp` (e.g., `directional_light_step-1.webp`).

**Pending Requests:**

[PASTE THE CONTENT OF needed_images.json HERE]
