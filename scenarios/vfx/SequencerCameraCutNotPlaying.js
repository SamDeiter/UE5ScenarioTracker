window.SCENARIOS["SequencerCameraCutNotPlaying"] = {
  meta: {
    title: "Sequencer Camera Cut Not Playing During Cinematic",
    description:
      "A Level Sequence with multiple camera cuts plays correctly in the Sequencer preview, but when triggered via Blueprint at runtime, the camera stays locked to the player camera instead of switching to the cinematic cameras.",
    estimateHours: 1.0,
    difficulty: "Intermediate",
    category: "VFX",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "SequencerCameraCutNotPlaying",
      step: "setup",
    },
  ],
  fault: {
    description: "Camera cuts work in editor preview but not at runtime",
    visual_cue: "Cinematic plays but camera remains on player",
  },
  expected: {
    description: "Camera switches to cinematic cameras during playback",
    validation_action: "verify_camera_switch",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "SequencerCameraCutNotPlaying",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "vfx",
      title: "Initial Observation",
      image_path: "assets/generated/SequencerCameraCutNotPlaying/step-1.png",
      prompt:
        "<p>Your Level Sequence has camera cuts that work perfectly in the <strong>Sequencer</strong> preview window. However, when you trigger the sequence via <code>Play</code> node in Blueprint, the cinematic audio plays but the camera stays locked to the player.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Check the <strong>Level Sequence Actor</strong> in the level and verify <code>Override Instance Data</code> settings, specifically the <code>Player</code> binding.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. The sequence actor's binding configuration determines how runtime playback handles player camera takeover.",
          next: "step-2",
        },
        {
          text: "Open the <strong>Camera Cuts Track</strong> in Sequencer and verify the cameras are correctly assigned to each cut.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Camera assignments are correct since preview works. The issue is runtime binding, not sequence structure.",
          next: "step-1",
        },
        {
          text: "Check <strong>Project Settings</strong> > <strong>Cinematic</strong> for global camera override restrictions.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. There's no global cinematic setting that blocks camera cuts. The issue is specific to runtime playback configuration.",
          next: "step-1",
        },
        {
          text: "Rebuild the <strong>Cine Camera Actor</strong> blueprints to ensure they initialize correctly at runtime.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. The cameras themselves are fine—they work in preview. This is a playback binding issue, not a camera actor problem.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "vfx",
      title: "Investigating Playback Settings",
      image_path: "assets/generated/SequencerCameraCutNotPlaying/step-2.png",
      prompt:
        "<p>You select the <strong>Level Sequence Actor</strong> in the level. In the <strong>Details Panel</strong>, you see various playback settings.</p><p><strong>Which setting is most likely causing the camera cut failure?</strong></p>",
      choices: [
        {
          text: "The <code>Disable Camera Cuts</code> checkbox is enabled, preventing runtime camera takeover.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The <code>Disable Camera Cuts</code> option specifically blocks the sequence from controlling the viewport camera at runtime while keeping other tracks functional.",
          next: "step-3",
        },
        {
          text: "The <code>Play Rate</code> is set to zero, causing the sequence to appear stuck.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Zero play rate would freeze the entire sequence, but you mentioned audio plays correctly. Play rate isn't the issue.",
          next: "step-2",
        },
        {
          text: "The <code>Replicates</code> setting is disabled, preventing multiplayer clients from seeing camera cuts.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Replication affects multiplayer sync, but this issue occurs in single-player testing too.",
          next: "step-2",
        },
        {
          text: "The <code>Loop</code> setting is conflicting with the camera cut timing.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Looping affects playback duration, not camera cut functionality. The issue is a specific camera-related setting.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "vfx",
      title: "Applying the Fix",
      image_path: "assets/generated/SequencerCameraCutNotPlaying/step-3.png",
      prompt:
        "<p>You found that <code>Disable Camera Cuts</code> is checked. Before unchecking it, you want to understand why it might have been enabled.</p><p><strong>What is a valid reason to have this setting enabled?</strong></p>",
      choices: [
        {
          text: "During development, designers wanted to preview sequence timing without losing viewport control for editing.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.05hrs. Understanding the setting's purpose helps avoid accidentally re-enabling it. It's a development convenience that should be disabled for final playback.",
          next: "step-4",
        },
        {
          text: "The setting improves performance by skipping camera interpolation calculations.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Camera cuts have minimal performance impact. The setting exists for workflow convenience, not optimization.",
          next: "step-3",
        },
        {
          text: "Unreal Engine enables this by default for all new Level Sequence Actors.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. This is not enabled by default. Someone explicitly checked this box during development.",
          next: "step-3",
        },
        {
          text: "The setting is required when using <code>Cine Camera Actor</code> instead of regular cameras.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Cine Camera Actors work fine with camera cuts enabled. There's no special requirement for this setting.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "vfx",
      title: "Additional Configuration",
      image_path: "assets/generated/SequencerCameraCutNotPlaying/step-4.png",
      prompt:
        "<p>You uncheck <code>Disable Camera Cuts</code>. The cameras now switch during playback. However, you notice a jarring pop when transitioning back to the player camera at sequence end.</p><p><strong>How do you smooth this transition?</strong></p>",
      choices: [
        {
          text: "Enable <code>Restore State</code> on the <strong>Level Sequence Actor</strong> and add a blend-out time to the final camera cut.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. <code>Restore State</code> ensures the camera smoothly returns to pre-sequence state, and blend times soften the transition.",
          next: "step-5",
        },
        {
          text: "Add a <strong>Set View Target with Blend</strong> node in Blueprint after the sequence ends.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. This works but requires additional Blueprint logic. Using built-in Sequencer settings is cleaner.",
          next: "step-5",
        },
        {
          text: "Increase the <code>Camera Lag Speed</code> on the player's <strong>Spring Arm Component</strong>.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Spring arm lag affects normal gameplay camera, not the transition from cinematic cameras.",
          next: "step-4",
        },
        {
          text: "Add an extra camera at the end of the sequence positioned at the player location.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Manually positioning cameras at the player is fragile. Use the built-in restore state functionality.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "vfx",
      title: "Verification",
      image_path: "assets/generated/SequencerCameraCutNotPlaying/step-5.png",
      prompt:
        "<p>You've configured <code>Restore State</code> and added blend times. Now you need to verify everything works correctly.</p><p><strong>What is the best verification approach?</strong></p>",
      choices: [
        {
          text: "Play in <strong>Standalone Game</strong> mode and trigger the cinematic multiple times to verify consistent camera behavior.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Standalone mode replicates actual game conditions better than PIE, and multiple plays catch edge cases.",
          next: "conclusion",
        },
        {
          text: "Use the <strong>Sequencer</strong> preview panel with <code>Simulate</code> mode enabled.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Sequencer preview is useful but doesn't fully replicate runtime Blueprint triggering.",
          next: "step-5",
        },
        {
          text: "Check the <strong>Output Log</strong> for any camera-related warning messages.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Camera cuts don't typically generate log messages. Visual verification is more reliable.",
          next: "step-5",
        },
        {
          text: "Package the game and test on a separate machine to ensure it's not an editor-specific issue.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.4hrs. Packaging for this verification is excessive. Standalone mode adequately tests runtime behavior.",
          next: "step-5",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/SequencerCameraCutNotPlaying/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've successfully resolved the Sequencer camera cut issue.</p><h4>Key Takeaways:</h4><ul><li><code>Disable Camera Cuts</code> — Development convenience that must be disabled for runtime</li><li><code>Restore State</code> — Ensures smooth return to pre-sequence camera</li><li><strong>Standalone Game</strong> — Best mode for testing runtime cinematic behavior</li><li><strong>Level Sequence Actor</strong> — Primary location for runtime playback configuration</li></ul>",
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
