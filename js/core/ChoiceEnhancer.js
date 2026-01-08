/**
 * ChoiceEnhancer.js
 * Dynamically pads scenario step choices to ensure exactly 4 options.
 * Uses skill-specific filler pools for realistic alternatives.
 */

window.ChoiceEnhancer = {
  TARGET_CHOICES: 4,

  /**
   * Pool of contextual filler choices organized by skill category.
   * Each filler has: text, type, feedback
   * The 'next' is handled dynamically (loops to same step)
   */
  _fillerPool: {
    lighting: [
      {
        text: "Rebuild lighting for the level",
        type: "wrong",
        feedback:
          "<p>Rebuilding lighting affects baked lightmaps, not the dynamic settings you're troubleshooting here.</p>",
      },
      {
        text: "Check the Post Process Volume settings",
        type: "misguided",
        feedback:
          "<p>Post Process Volumes handle color grading, bloom, and exposure—not the core lighting behavior you're investigating.</p>",
      },
      {
        text: "Adjust the Skylight intensity",
        type: "wrong",
        feedback:
          "<p>The Skylight provides ambient lighting but isn't related to the issue you're diagnosing with directional shadows.</p>",
      },
      {
        text: "Toggle Lumen on and off",
        type: "misguided",
        feedback:
          "<p>Lumen is a GI system. While it affects lighting, it's not the direct cause of the specific issue you're seeing.</p>",
      },
      {
        text: "Change the light's Mobility to Static",
        type: "wrong",
        feedback:
          "<p>Changing mobility would require a lighting rebuild and fundamentally changes how shadows work—this isn't the right approach.</p>",
      },
      {
        text: "Increase the light's Source Radius",
        type: "misguided",
        feedback:
          "<p>Source Radius affects shadow softness (penumbra), not the behavior you're currently troubleshooting.</p>",
      },
    ],

    materials: [
      {
        text: "Reimport the texture asset",
        type: "wrong",
        feedback:
          "<p>The texture file itself isn't corrupted—the issue is in how the material is set up.</p>",
      },
      {
        text: "Check the texture compression settings",
        type: "misguided",
        feedback:
          "<p>Compression affects quality and memory, but doesn't explain the behavior you're seeing in the material.</p>",
      },
      {
        text: "Convert the material to a Material Instance",
        type: "wrong",
        feedback:
          "<p>Material Instances are for parameter variation—they won't fix the underlying material logic issue.</p>",
      },
      {
        text: "Enable Nanite tessellation",
        type: "misguided",
        feedback:
          "<p>Nanite handles mesh detail, not material behavior. This won't address the current issue.</p>",
      },
      {
        text: "Rebuild shaders from the console",
        type: "wrong",
        feedback:
          "<p>Shader recompilation happens automatically—forcing it won't fix a material graph configuration issue.</p>",
      },
      {
        text: "Check the material's Shading Model",
        type: "misguided",
        feedback:
          "<p>Shading Model affects lighting response but isn't the root cause here.</p>",
      },
    ],

    blueprints: [
      {
        text: "Compile the Blueprint",
        type: "wrong",
        feedback:
          "<p>The Blueprint is already compiling without errors. The issue is in the logic flow, not syntax.</p>",
      },
      {
        text: "Add a Print String node for debugging",
        type: "misguided",
        feedback:
          "<p>Print statements can help debug, but you should understand the actual issue before adding debug nodes.</p>",
      },
      {
        text: "Delete and recreate the Event node",
        type: "wrong",
        feedback:
          "<p>The Event itself is fine—deleting it would lose your existing connections without solving the problem.</p>",
      },
      {
        text: "Check the parent class for conflicts",
        type: "misguided",
        feedback:
          "<p>Parent class functions could cause issues, but the current behavior suggests a local logic problem.</p>",
      },
      {
        text: "Convert to C++ for better performance",
        type: "wrong",
        feedback:
          "<p>Converting to C++ doesn't fix logic errors—it would just move the same problem to a different language.</p>",
      },
      {
        text: "Enable Tick in the Class Settings",
        type: "misguided",
        feedback:
          "<p>Tick is for per-frame execution—this doesn't address the specific issue you're diagnosing.</p>",
      },
    ],

    physics: [
      {
        text: "Enable CCD (Continuous Collision Detection)",
        type: "misguided",
        feedback:
          "<p>CCD helps with fast-moving objects tunneling through geometry, but that's not what's happening here.</p>",
      },
      {
        text: "Rebuild the navigation mesh",
        type: "wrong",
        feedback:
          "<p>NavMesh is for AI pathfinding, not physics simulation—this won't affect the issue.</p>",
      },
      {
        text: "Increase the physics substeps",
        type: "misguided",
        feedback:
          "<p>More substeps improve simulation accuracy but won't fix configuration or setup issues.</p>",
      },
      {
        text: "Reset the Physics Asset to default",
        type: "wrong",
        feedback:
          "<p>Resetting would lose your customizations without addressing the root cause.</p>",
      },
      {
        text: "Check the World Gravity settings",
        type: "wrong",
        feedback:
          "<p>World Gravity is a global setting—the issue you're seeing is specific to this actor's configuration.</p>",
      },
      {
        text: "Enable Generate Overlap Events",
        type: "misguided",
        feedback:
          "<p>Overlap events are for trigger detection, not collision response—this isn't relevant here.</p>",
      },
    ],

    rendering: [
      {
        text: "Clear the shader cache",
        type: "wrong",
        feedback:
          "<p>Shader cache issues cause compilation problems, not the rendering behavior you're seeing.</p>",
      },
      {
        text: "Disable Nanite for the affected mesh",
        type: "misguided",
        feedback:
          "<p>Nanite handles mesh virtualization—disabling it won't address this specific rendering issue.</p>",
      },
      {
        text: "Increase the texture streaming pool",
        type: "wrong",
        feedback:
          "<p>Streaming pool affects texture loading, but that's not causing the current visual problem.</p>",
      },
      {
        text: "Switch to Forward Shading",
        type: "misguided",
        feedback:
          "<p>Forward Shading changes the entire rendering pipeline—that's far too drastic for this issue.</p>",
      },
      {
        text: "Check the scalability settings",
        type: "misguided",
        feedback:
          "<p>Scalability can affect quality but the issue persists even on Epic settings.</p>",
      },
      {
        text: "Verify the GPU drivers are updated",
        type: "wrong",
        feedback:
          "<p>Driver issues cause crashes or artifacts—this looks like a configuration problem in the project.</p>",
      },
    ],

    general: [
      {
        text: "Restart the Unreal Editor",
        type: "wrong",
        feedback:
          "<p>A simple restart won't fix configuration issues—the problem will persist when you reopen.</p>",
      },
      {
        text: "Check the Output Log for errors",
        type: "misguided",
        feedback:
          "<p>Good instinct, but the log doesn't show any errors related to this issue. It's a silent configuration problem.</p>",
      },
      {
        text: "Search online for similar issues",
        type: "misguided",
        feedback:
          "<p>While research helps, you have enough information here to diagnose the issue directly in the editor.</p>",
      },
      {
        text: "Revert to a previous saved version",
        type: "wrong",
        feedback:
          "<p>Reverting would lose your progress without teaching you how to fix the issue properly.</p>",
      },
      {
        text: "Ask a colleague for help",
        type: "misguided",
        feedback:
          "<p>Collaboration is valuable, but try to solve this yourself first—it's a learning opportunity.</p>",
      },
      {
        text: "Create a new project and migrate assets",
        type: "wrong",
        feedback:
          "<p>That's a drastic measure for a configuration issue that can be fixed in place.</p>",
      },
    ],
  },

  /**
   * Shuffle an array using Fisher-Yates algorithm
   */
  _shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  /**
   * Pad choices to exactly TARGET_CHOICES using skill-appropriate fillers
   * @param {Array} choices - Original choices from the step
   * @param {string} skill - Skill category (lighting, materials, etc.)
   * @param {string} currentStepId - Current step ID for 'next' navigation
   * @returns {Array} - Array with exactly TARGET_CHOICES items
   */
  padChoices(choices, skill = "general", currentStepId = null) {
    // Already have enough choices
    if (choices.length >= this.TARGET_CHOICES) {
      return choices;
    }

    const needed = this.TARGET_CHOICES - choices.length;

    // Get pool for this skill, fallback to general
    const pool = this._fillerPool[skill] || this._fillerPool["general"];

    // Get existing choice texts to avoid duplicates
    const existingTexts = choices.map((c) => c.text.toLowerCase());

    // Filter out choices that are too similar to existing ones
    const available = pool.filter((filler) => {
      const fillerLower = filler.text.toLowerCase();
      return !existingTexts.some(
        (existing) =>
          existing.includes(fillerLower) || fillerLower.includes(existing)
      );
    });

    // Shuffle and pick needed amount
    const selected = this._shuffle(available).slice(0, needed);

    // Add navigation - loop back to same step
    const enhancedFillers = selected.map((filler) => ({
      text: filler.text,
      type: filler.type,
      feedback: filler.feedback,
      next: currentStepId || "__SAME_STEP__", // Will be handled by caller
    }));

    console.log(
      `[ChoiceEnhancer] Added ${enhancedFillers.length} filler choices for skill: ${skill}`
    );

    return [...choices, ...enhancedFillers];
  },

  /**
   * Get the skill category from a step definition
   */
  getSkill(step) {
    return step.skill || "general";
  },
};

console.log("[ChoiceEnhancer] Module loaded");
