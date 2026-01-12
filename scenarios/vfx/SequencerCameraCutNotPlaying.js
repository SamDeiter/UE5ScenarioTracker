window.SCENARIOS["SequencerCameraCutNotPlaying"] = {
  meta: {
    title: "Sequencer Camera Cut Not Playing During Cinematic",
    description:
      "A Level Sequence with multiple camera cuts plays correctly in the Sequencer preview, but when triggered via Blueprint at runtime, the camera stays locked to the player camera instead of switching to the cinematic cameras.",
    estimateHours: 1.5,
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
          text: "Check the <strong>Level Sequence Actor</strong> in the level and examine its playback settings in the <strong>Details Panel</strong>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. The sequence actor's configuration determines how runtime playback handles camera control.",
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
          text: "Check <strong>Project Settings</strong> > <strong>Cinematics</strong> for global camera override restrictions.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. There's no global cinematic setting that blocks camera cuts. The issue is specific to runtime playback configuration.",
          next: "step-1",
        },
        {
          text: "Rebuild the <strong>Cine Camera Actor</strong> blueprints to ensure they initialize correctly at runtime.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. The cameras themselves work in preview. This is a playback configuration issue.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "vfx",
      title: "Locating the Level Sequence Actor",
      image_path: "assets/generated/SequencerCameraCutNotPlaying/step-2.png",
      prompt:
        "<p>You need to find the Level Sequence Actor that's playing this cinematic. How do you locate it in the level?</p><p><strong>What is the easiest way to find it?</strong></p>",
      choices: [
        {
          text: "Use the <strong>World Outliner</strong> search box and type the Level Sequence name or filter by <code>LevelSequenceActor</code> class.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The outliner search quickly finds actors by name or class type.",
          next: "step-3",
        },
        {
          text: "Check the Blueprint that triggers the sequence to see which actor reference it uses.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. This works but the outliner is faster for direct selection.",
          next: "step-2",
        },
        {
          text: "Press <strong>F</strong> in the viewport to focus on the currently playing sequence.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. F focuses on selections. You need to find the actor first. Use the outliner.",
          next: "step-2",
        },
        {
          text: "Open the Level Sequence asset and check its <strong>Parent Actor</strong> reference.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The sequence asset doesn't store actor references. Actors in the level reference the asset.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "vfx",
      title: "Examining Playback Settings",
      image_path: "assets/generated/SequencerCameraCutNotPlaying/step-3.png",
      prompt:
        "<p>You select the Level Sequence Actor. In the <strong>Details Panel</strong>, you see the <code>Playback</code> category with various settings.</p><p><strong>Which setting is most likely causing the camera cut failure?</strong></p>",
      choices: [
        {
          text: "Look for <code>Disable Camera Cuts</code> checkbox — if enabled, it prevents runtime camera takeover while keeping other tracks functional.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. This setting specifically controls camera cut behavior at runtime.",
          next: "step-4",
        },
        {
          text: "Check the <code>Play Rate</code> setting to see if it's set to zero, causing the sequence to freeze.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Zero play rate would freeze everything including audio. Play rate isn't the issue.",
          next: "step-3",
        },
        {
          text: "Examine the <code>Replicates</code> setting to ensure camera cuts work in multiplayer.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Replication affects multiplayer sync; this issue occurs in single-player testing too.",
          next: "step-3",
        },
        {
          text: "Review the <code>Loop</code> setting to see if looping is conflicting with camera timing.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Looping affects playback duration, not camera cut functionality.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "vfx",
      title: "Finding the Disable Camera Cuts Setting",
      image_path: "assets/generated/SequencerCameraCutNotPlaying/step-4.png",
      prompt:
        "<p>You need to find the <code>Disable Camera Cuts</code> setting. Where is it located in the Details Panel?</p><p><strong>Under which category?</strong></p>",
      choices: [
        {
          text: "Expand the <code>Playback</code> or <code>Cinematic</code> category in the Details Panel to find <code>Disable Camera Cuts</code>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Camera-related playback settings are grouped under Playback or Cinematic sections.",
          next: "step-5",
        },
        {
          text: "Check the <code>Rendering</code> category for camera visualization options.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Rendering affects how things display, not camera control. Check Playback.",
          next: "step-4",
        },
        {
          text: "Look in the <code>Actor</code> category for component-level camera settings.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Actor category has general settings. Camera cuts are in Playback.",
          next: "step-4",
        },
        {
          text: "Use the search box at the top of the Details Panel and type <code>camera</code>.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Good approach! This would find the setting quickly.",
          next: "step-5",
        },
      ],
    },
    "step-5": {
      skill: "vfx",
      title: "Understanding the Setting",
      image_path: "assets/generated/SequencerCameraCutNotPlaying/step-5.png",
      prompt:
        "<p>You find <code>Disable Camera Cuts</code> is checked. Before unchecking it, you want to understand why it might have been enabled.</p><p><strong>What is a valid reason to have this setting enabled?</strong></p>",
      choices: [
        {
          text: "During development, designers wanted to preview sequence timing without losing viewport control for quick edits.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Understanding the purpose helps avoid accidentally re-enabling it. It's a development convenience.",
          next: "step-6",
        },
        {
          text: "The setting improves performance by skipping camera interpolation calculations.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Camera cuts have minimal performance impact. The setting exists for workflow, not optimization.",
          next: "step-5",
        },
        {
          text: "Unreal Engine enables this by default for all new Level Sequence Actors.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. This is not enabled by default. Someone explicitly checked this box.",
          next: "step-5",
        },
        {
          text: "The setting is required when using <code>Cine Camera Actor</code> instead of regular cameras.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Cine Camera Actors work fine with camera cuts enabled. No special requirement.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "vfx",
      title: "Applying the Fix",
      image_path: "assets/generated/SequencerCameraCutNotPlaying/step-6.png",
      prompt:
        "<p>You uncheck <code>Disable Camera Cuts</code>. What should happen when you play the sequence now?</p><p><strong>What behavior should you expect?</strong></p>",
      choices: [
        {
          text: "The camera should switch to each cinematic camera according to the Camera Cuts Track, taking control from the player camera.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. With camera cuts enabled, the sequence takes over the viewport camera during playback.",
          next: "step-7",
        },
        {
          text: "The cameras will animate but the player camera will blend with them.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Camera cuts are hard switches, not blends (unless you add blend times). The sequence takes full control.",
          next: "step-6",
        },
        {
          text: "You need to restart the editor for the change to take effect.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. No restart needed. The change applies immediately.",
          next: "step-6",
        },
        {
          text: "The player camera will stay active but mirror the cinematic camera positions.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The sequence actually switches to the cinematic cameras, not mirroring.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "vfx",
      title: "Initial Test",
      image_path: "assets/generated/SequencerCameraCutNotPlaying/step-7.png",
      prompt:
        "<p>You test the sequence. Cameras now switch correctly! However, there's a jarring pop when the sequence ends and control returns to the player camera.</p><p><strong>What is causing this jarring transition?</strong></p>",
      choices: [
        {
          text: "The sequence ends abruptly without any blend time, causing an instant snap from cinematic camera to player camera.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Hard cuts at sequence end can be jarring. Blend settings smooth this transition.",
          next: "step-8",
        },
        {
          text: "The player camera position drifted during the cinematic, so it's far from where the last cinematic camera was.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Position difference can contribute, but the snap is due to no blend time regardless of position.",
          next: "step-7",
        },
        {
          text: "The cinematic cameras are being destroyed when the sequence ends.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Cameras typically persist. The issue is the transition timing, not camera destruction.",
          next: "step-7",
        },
        {
          text: "The Player Controller's <code>Enable Camera Lag</code> is fighting the sequence camera.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Camera lag affects gameplay camera feel, not sequence transitions.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "vfx",
      title: "Smoothing the Transition",
      image_path: "assets/generated/SequencerCameraCutNotPlaying/step-8.png",
      prompt:
        "<p>You need to smooth the transition back to the player camera. What is the best built-in solution?</p><p><strong>How do you fix the jarring end?</strong></p>",
      choices: [
        {
          text: "Enable <code>Restore State</code> on the Level Sequence Actor and add a blend-out time to the final camera cut section in Sequencer.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Restore State ensures smooth return to pre-sequence state, and blend times soften the transition.",
          next: "step-9",
        },
        {
          text: "Add a <strong>Set View Target with Blend</strong> node in Blueprint after the sequence's <code>On Finished</code> event.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. This works but requires additional Blueprint logic. Built-in settings are cleaner.",
          next: "step-8",
        },
        {
          text: "Increase the <code>Camera Lag Speed</code> on the player's Spring Arm Component.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Spring arm lag affects normal gameplay, not cinematic transitions.",
          next: "step-8",
        },
        {
          text: "Add an extra cinematic camera at the end positioned where the player camera should be.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Manually positioning cameras is fragile. Use the built-in restore functionality.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "vfx",
      title: "Configuring Restore State",
      image_path: "assets/generated/SequencerCameraCutNotPlaying/step-9.png",
      prompt:
        "<p>You need to configure <code>Restore State</code>. Where is this setting and what does it do?</p><p><strong>What does Restore State control?</strong></p>",
      choices: [
        {
          text: "It's in the Level Sequence Actor's Details Panel. When enabled, it saves the game state before the sequence plays and restores it afterward, including camera position.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Restore State creates a clean handoff from cinematic back to gameplay.",
          next: "step-10",
        },
        {
          text: "It's in the Sequencer timeline settings and controls whether animations reset to their start pose.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. That's animation restoration. The actor-level Restore State handles camera and gameplay state.",
          next: "step-9",
        },
        {
          text: "It's in Project Settings and globally affects all sequences.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Restore State is per-sequence on the Level Sequence Actor, not global.",
          next: "step-9",
        },
        {
          text: "It's a Blueprint node you call after the sequence finishes to manually restore state.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. It's a checkbox on the actor, not a Blueprint node. Enable it and it works automatically.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "vfx",
      title: "Adding Blend Time",
      image_path: "assets/generated/SequencerCameraCutNotPlaying/step-10.png",
      prompt:
        "<p>With Restore State enabled, you also want to add blend time to smooth the camera transition. Where do you add this?</p><p><strong>Where is blend time configured?</strong></p>",
      choices: [
        {
          text: "In the Sequencer, select the <strong>Camera Cuts Track</strong> sections and adjust the <code>Blend Time</code> property on each cut, especially the last one.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Each camera cut section can have its own blend in/out time for smooth transitions.",
          next: "step-11",
        },
        {
          text: "Set a global <code>Blend Duration</code> on the Level Sequence Actor that applies to all cuts.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no global blend setting. Each cut section has individual blend controls.",
          next: "step-10",
        },
        {
          text: "Add a <code>Ease In/Out</code> curve to the Camera Cuts Track in the Sequencer Curves panel.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Camera cuts don't use the curves panel. They have built-in blend properties.",
          next: "step-10",
        },
        {
          text: "Check the <code>Camera Blend</code> property on each Cine Camera Actor.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Camera actors don't have blend settings. Blend is controlled by the Sequencer track.",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "vfx",
      title: "Testing the Changes",
      image_path: "assets/generated/SequencerCameraCutNotPlaying/step-11.png",
      prompt:
        "<p>You've enabled Restore State and added blend time to the final camera cut. How do you test that everything works correctly?</p><p><strong>What is the best testing approach?</strong></p>",
      choices: [
        {
          text: "Press <strong>Play</strong> using <code>Standalone Game</code> mode and trigger the cinematic multiple times to verify consistent behavior.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Standalone mode replicates actual game conditions, and multiple plays catch edge cases.",
          next: "step-12",
        },
        {
          text: "Use the Sequencer preview with <code>Simulate</code> mode enabled.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Sequencer preview is useful but doesn't fully test Blueprint triggering and Restore State.",
          next: "step-11",
        },
        {
          text: "Check the Output Log for any camera-related warning messages.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Camera cuts don't typically generate log messages. Visual verification is needed.",
          next: "step-11",
        },
        {
          text: "Package the game and test on a separate machine.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.4hrs. Packaging for this verification is excessive. Standalone mode is sufficient.",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "vfx",
      title: "Final Verification",
      image_path: "assets/generated/SequencerCameraCutNotPlaying/step-12.png",
      prompt:
        "<p>In Standalone Game, the cinematic plays correctly with smooth camera transitions. What final check should you perform?</p><p><strong>What else should you verify?</strong></p>",
      choices: [
        {
          text: "Test triggering the sequence from different player positions and orientations to ensure Restore State correctly returns the camera regardless of starting state.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Edge case testing ensures the cinematic works robustly from any gameplay context.",
          next: "conclusion",
        },
        {
          text: "Compare frame rates before, during, and after the cinematic to ensure no performance drops.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Performance is important but not the primary concern for camera cut functionality.",
          next: "step-12",
        },
        {
          text: "Review the Blueprint that triggers the sequence to ensure it has proper error handling.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Blueprint review is good practice but the camera cut issue is now fixed at the actor level.",
          next: "step-12",
        },
        {
          text: "Check that the cinematic audio is synchronized with the camera cuts.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Audio sync is a separate issue from camera cuts. Camera functionality is your focus.",
          next: "step-12",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/SequencerCameraCutNotPlaying/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've successfully resolved the Sequencer camera cut issue and understand runtime playback configuration.</p><h4>Key Takeaways:</h4><ul><li><code>Disable Camera Cuts</code> — Development convenience that must be unchecked for runtime playback</li><li><code>Restore State</code> — Saves and restores gameplay state (including camera) around the sequence</li><li><strong>Blend Time</strong> — Per-camera-cut property that smooths transitions between cameras</li><li><strong>Standalone Game</strong> — Best mode for testing runtime cinematic behavior</li><li><strong>Level Sequence Actor</strong> — Primary location for runtime playback configuration</li><li><strong>Camera Cuts Track</strong> — Controls which camera is active at each point in the sequence</li></ul>",
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
