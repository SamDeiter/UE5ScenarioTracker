window.SCENARIOS["SequencerLightReverts"] = {
  meta: {
    title: "Light Reverts After Cinematic",
    description:
      "A spotlight is keyframed in Sequencer to fade to bright RED at the end of a cinematic, but as soon as the sequence finishes, the light snaps back to its original white color. The property resets on sequence end instead of persisting.",
    estimateHours: 1.5,
    category: "Cinematics",
    difficulty: "Intermediate",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "SequencerLightReverts",
      step: "step-0",
    },
  ],
  fault: {
    description:
      "Light color reverts to original white after Sequencer playback ends.",
    visual_cue: "Light snaps from RED to white instantly when sequence stops",
  },
  expected: {
    description:
      "Light remains at final keyed state (RED) after sequence ends.",
    validation_action: "verify_keep_state",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "SequencerLightReverts",
      step: "step-3",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "sequencer",
      image_path: "assets/generated/sequencercinematics_beginner/step-1.png",
      title: "Diagnose Property Reversion",
      prompt:
        "<p>The spotlight animates to RED during the cinematic but instantly reverts to white when the sequence ends. How do you investigate this state management issue?</p>",
      choices: [
        {
          text: "<p>Scrub the Sequencer timeline to the end and observe the light's Details panel values.</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.1hrs. During scrub, the light shows RED. The moment you stop scrubbing, it reverts to white. This confirms Sequencer is actively resetting properties on playback end.</p>",
          next: "step-2",
        },
        {
          text: "<p>Re-keyframe the light with stronger intensity values at the end of the sequence.</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.3hrs. The keyframe values are correct during playback. Stronger values won't prevent the reversion that happens when the sequence ends.</p>",
          next: "step-1",
        },
        {
          text: "<p>Check if another actor or Blueprint is overriding the light's color.</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.2hrs. You search the Level Blueprint but find no nodes affecting this light. The reversion is internal to Sequencer's behavior.</p>",
          next: "step-1",
        },
        {
          text: "<p>Inspect the light's Mobility setting to ensure it's Movable.</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. The light animates correctly, so Mobility is already Movable. This isn't causing the reversion issue.</p>",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "sequencer",
      image_path: "assets/generated/sequencercinematics_beginner/step-2.png",
      title: "Locate the Setting",
      prompt:
        "<p>Scrubbing confirms the light reverts immediately when playback stops. Where in Sequencer do you find the setting that controls post-playback state behavior?</p>",
      choices: [
        {
          text: "<p>Select the light's track section and open the Sequencer Details panel to find binding properties.</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.15hrs. In the Details panel, under the Binding section, you find 'When Finished' is set to 'Restore State'. This is why the light reverts to its pre-sequence value.</p>",
          next: "step-3",
        },
        {
          text: "<p>Check the Level Sequence Actor's properties in the main Level Editor Details panel.</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.15hrs. The Level Sequence Actor has playback settings, but the per-actor state behavior is controlled on individual track bindings inside Sequencer.</p>",
          next: "step-2",
        },
        {
          text: "<p>Look for an Event Track that might be resetting the light at the sequence end.</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. You find no Event Tracks affecting this light. The reversion is automatic Sequencer behavior, not an explicit event.</p>",
          next: "step-2",
        },
        {
          text: "<p>Right-click the track and search for 'Keep State' in the context menu.</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.2hrs. The context menu doesn't have this option. State persistence is configured in the Details panel under Binding properties.</p>",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "sequencer",
      image_path: "assets/generated/sequencercinematics_beginner/step-3.png",
      title: "Apply the Fix",
      prompt:
        "<p>You found 'When Finished' is set to 'Restore State'. What change do you make to keep the light at its final RED value after the cinematic?</p>",
      choices: [
        {
          text: "<p>Change 'When Finished' from 'Restore State' to 'Keep State' in the binding properties.</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.1hrs. Setting 'Keep State' tells Sequencer to leave the property at its final keyed value when playback ends instead of reverting to the pre-sequence state.</p>",
          next: "step-4",
        },
        {
          text: "<p>Add an Event Track at the end to manually set the light color to RED via Blueprint.</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.25hrs. This works but is a workaround. The built-in 'Keep State' option is the intended solution for this exact problem.</p>",
          next: "step-4",
        },
        {
          text: "<p>Convert the Possessable light to a Spawnable so it persists differently.</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.4hrs. Spawnables are destroyed when the sequence ends, which would make the light disappear entirely. This is the opposite of what you want.</p>",
          next: "step-3",
        },
        {
          text: "<p>Duplicate the light's final keyframe and extend it past the sequence end time.</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.15hrs. Keyframes only affect values during playback range. Once the sequence ends, Restore State still kicks in regardless of keyframe placement.</p>",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "sequencer",
      image_path: "assets/generated/sequencercinematics_beginner/step-4.png",
      title: "Verify the Fix",
      prompt:
        "<p>You've set 'When Finished' to 'Keep State'. How do you verify the light now persists correctly after the cinematic?</p>",
      choices: [
        {
          text: "<p>Play the sequence in PIE, let it finish, and confirm the light remains RED in the viewport.</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.1hrs. In PIE, the cinematic plays, the light turns RED, and when the sequence ends, the light stays RED. The property persists correctly.</p>",
          next: "conclusion",
        },
        {
          text: "<p>Use <code>stat game</code> to check for any performance impact from the Keep State setting.</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. Keep State has negligible performance impact - it's just a flag that prevents restoration. But checking doesn't verify the visual outcome.</p>",
          next: "conclusion",
        },
        {
          text: "<p>Scrub the timeline again and watch the Details panel for reversion.</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.05hrs. Scrubbing shows the fix, but PIE playback is the real-world test of how the game will behave at runtime.</p>",
          next: "conclusion",
        },
        {
          text: "<p>Package a standalone build to test the sequence behavior.</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.35hrs. Packaging is overkill for verification. PIE accurately simulates runtime Sequencer behavior.</p>",
          next: "step-4",
        },
      ],
    },
    conclusion: {
      skill: "sequencer",
      image_path:
        "assets/generated/sequencercinematics_beginner/conclusion.png",
      title: "Scenario Complete",
      prompt:
        "<p><strong>Lesson:</strong> When Sequencer-animated properties revert after playback, check the track's 'When Finished' setting in the binding properties. Change from 'Restore State' (default) to 'Keep State' to preserve the final keyed values after the sequence ends.</p>",
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
