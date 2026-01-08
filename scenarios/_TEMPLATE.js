/**
 * SCENARIO TEMPLATE
 * Copy this file and replace the placeholders for new scenarios.
 *
 * FEEDBACK GUIDELINES:
 * - Write like a senior developer mentoring a junior
 * - Use probing questions for wrong answers, not "Wrong!" labels
 * - Correct answers should acknowledge and transition naturally
 * - Keep it conversational, not robotic
 */

window.SCENARIOS["scenario_id"] = {
  meta: {
    title: "Short Problem Title",
    description: "One sentence describing the problem and goal.",
    estimateHours: 0.75, // Expected time for ideal path
    category: "Lighting", // Lighting, Blueprints, Materials, Physics, etc.
  },
  start: "step-1",
  steps: {
    /**
     * STEP 1: Identify the Problem
     * Show the problem, ask them to identify the cause or first fix.
     */
    "step-1": {
      image_path: "step-1.png", // assets/generated/step-1.png
      skill: "lighting", // Tag for skill tracking
      title: "Step Title Here",
      prompt:
        "<p>Context: what the user observes. What they've already done.</p>" +
        "<strong>Question: What should they do next?</strong>",
      choices: [
        {
          text: "Correct answer text - the right approach",
          type: "correct",
          feedback:
            "<p>Praise their thinking. Naturally transition to the next challenge. Maybe hint at what's coming.</p>",
          next: "step-2",
        },
        {
          text: "Misguided answer - plausible but wrong approach",
          type: "misguided",
          feedback:
            "<p>Gently explain why this doesn't quite work. Ask a probing question to guide them back. What setting/concept are they missing?</p>",
          next: "step-1", // Loop back to try again
        },
        {
          text: "Wrong answer - common misconception",
          type: "wrong",
          feedback:
            "<p>Explain the misconception clearly. Guide them toward the right concept with a question. Where should they look instead?</p>",
          next: "step-1",
        },
      ],
    },

    /**
     * STEP 2: Apply the Fix
     * They've identified the cause, now apply or refine the solution.
     */
    "step-2": {
      image_path: "step-2.png",
      skill: "lighting",
      title: "Fixing the Issue",
      prompt:
        "<p>The first fix worked but introduced a new problem (or needs refinement).</p>" +
        "<strong>What's the next step?</strong>",
      choices: [
        {
          text: "Correct refinement",
          type: "correct",
          feedback:
            "<p>Good instinct! Explain why this works and acknowledge their understanding.</p>",
          next: "step-3",
        },
        {
          text: "Alternative that would work but isn't ideal",
          type: "misguided",
          feedback:
            "<p>That could work, but there's a better approach. What's the tradeoff with this method? Is there something more direct?</p>",
          next: "step-2",
        },
        {
          text: "Wrong approach - common mistake",
          type: "wrong",
          feedback:
            "<p>This affects something else entirely. Think about what property directly addresses the issue you're seeing.</p>",
          next: "step-2",
        },
      ],
    },

    /**
     * STEP 3: Verify the Fix
     * Final validation step before completion.
     */
    "step-3": {
      image_path: "step-3.png",
      skill: "lighting",
      title: "Verification",
      prompt:
        "<p>The issue appears fixed in the editor.</p>" +
        "<strong>What's the final step before marking this complete?</strong>",
      choices: [
        {
          text: "Verify in runtime/game conditions",
          type: "correct",
          feedback:
            "<p>Always test in the same conditions the player will experience. Good workflow!</p>",
          next: "conclusion",
        },
        {
          text: "Skip verification",
          type: "wrong",
          feedback:
            "<p>The editor can behave differently than runtime. How would you verify this actually works in-game?</p>",
          next: "step-3",
        },
      ],
    },

    /**
     * CONCLUSION: Summary
     * Wrap up with key takeaways.
     */
    conclusion: {
      image_path: "conclusion.png",
      skill: "lighting",
      title: "Scenario Complete",
      prompt:
        "<p><strong>Well done!</strong></p>" +
        "<p>Brief summary of what they accomplished.</p>" +
        "<h4>Key Takeaways:</h4>" +
        "<ul>" +
        "<li><strong>Setting 1</strong> — What it does</li>" +
        "<li><strong>Setting 2</strong> — What it does</li>" +
        "<li><strong>Best Practice</strong> — Why it matters</li>" +
        "</ul>",
      choices: [
        {
          text: "Complete Scenario",
          type: "correct",
          feedback: "",
          next: "end",
        },
      ],
    },
  },
};
