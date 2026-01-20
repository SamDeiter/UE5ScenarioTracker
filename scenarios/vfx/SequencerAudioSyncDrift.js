window.SCENARIOS["SequencerAudioSyncDrift"] = {
  meta: {
    title: "Sequencer Audio Drifts Out of Sync with Animation",
    description:
      "Audio tracks in your Level Sequence gradually drift out of synchronization with animations and camera cuts, becoming noticeable over longer sequences.",
    estimateHours: 1.25,
    difficulty: "Intermediate",
    category: "VFX",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "SequencerAudioSyncDrift",
      step: "setup",
    },
  ],
  fault: {
    description: "Audio progressively desynchronizes from visual timeline",
    visual_cue:
      "Dialogue doesn't match lip sync, sound effects are delayed after several seconds",
  },
  expected: {
    description:
      "Audio remains perfectly synchronized throughout the entire sequence",
    validation_action: "verify_audio_sync",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "SequencerAudioSyncDrift",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "vfx",
      title: "Initial Observation",
      image_path: "assets/generated/SequencerAudioSyncDrift/step-1.png",
      prompt:
        "<p>Your cinematic sequence has perfectly synced audio when you scrub the timeline manually, but when played back in PIE, the audio gradually drifts 0.2-0.5 seconds behind by the end of the 2-minute sequence.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Check the <code>Clock Source</code> setting in the Level Sequence player to see if the sequence is using a consistent time source that audio can follow.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Clock source determines timing authority. Mismatched sources cause drift.",
          next: "step-2",
        },
        {
          text: "Re-export the audio files at a different sample rate.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Sample rate can cause issues but drift suggests timing source problems. Check clock first.",
          next: "step-1",
        },
        {
          text: "Reduce the sequence length to minimize drift accumulation.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Shorter sequences hide but don't fix the problem. Find the cause.",
          next: "step-1",
        },
        {
          text: "Check if the audio file is corrupted.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Corrupted audio would have consistent issues, not progressive drift.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "vfx",
      title: "Understanding Clock Sources",
      image_path: "assets/generated/SequencerAudioSyncDrift/step-2.png",
      prompt:
        "<p>The sequence is using the default clock source. What clock source options are available and how do they affect synchronization?</p><p><strong>What are the clock source options?</strong></p>",
      choices: [
        {
          text: "<code>Tick</code> uses game frame time (variable), <code>Platform</code> uses system clock, and <code>Audio</code> uses the audio engine's clock. For audio-heavy sequences, Audio clock ensures perfect sync.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Using Audio clock as authority ensures audio and visuals share the same time source.",
          next: "step-3",
        },
        {
          text: "All clock sources provide identical timing accuracy.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Clock sources have different characteristics. Choose based on sync priority.",
          next: "step-2",
        },
        {
          text: "Platform clock is always the most accurate option.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Platform is accurate but doesn't sync with audio engine. Use Audio for audio sync.",
          next: "step-2",
        },
        {
          text: "Clock source only affects the Sequencer UI, not playback.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Clock source directly affects runtime playback timing.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "vfx",
      title: "Setting Audio Clock",
      image_path: "assets/generated/SequencerAudioSyncDrift/step-3.png",
      prompt:
        "<p>You want to use the Audio clock source. Where do you configure this?</p><p><strong>How do you set the clock source?</strong></p>",
      choices: [
        {
          text: "On the <strong>Level Sequence Actor</strong> in the level, or programmatically via <code>ULevelSequencePlayer::SetClockSource</code>, set the Clock Source to Audio.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Level Sequence Actor properties control playback settings including clock source.",
          next: "step-4",
        },
        {
          text: "Change the clock setting in the Sequencer Editor toolbar.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Sequencer toolbar affects editor playback. Runtime uses Actor settings.",
          next: "step-3",
        },
        {
          text: "Configure clock source in Project Settings > Audio.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Audio settings don't control Sequencer clock. Use the Level Sequence Actor.",
          next: "step-3",
        },
        {
          text: "Add a Clock Source node in the sequence timeline.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no Clock Source track. It's a player setting.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "vfx",
      title: "Frame Rate Considerations",
      image_path: "assets/generated/SequencerAudioSyncDrift/step-4.png",
      prompt:
        "<p>Audio clock source improved sync, but there's still slight drift on some machines with frame rate drops. What affects frame-time drift?</p><p><strong>What causes remaining drift?</strong></p>",
      choices: [
        {
          text: "Variable frame rates can cause sub-frame timing inconsistencies. Enable <code>Force Fixed Frame Interval</code> in Sequencer settings to ensure consistent sample timing.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Fixed frame intervals prevent cumulative sub-frame timing errors.",
          next: "step-5",
        },
        {
          text: "Buy faster hardware to maintain consistent 60fps.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Hardware variability is expected. Software settings should handle it.",
          next: "step-4",
        },
        {
          text: "Reduce visual complexity during audio-heavy sections.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Complexity reduction helps but doesn't fix sync methodology.",
          next: "step-4",
        },
        {
          text: "Pre-render the sequence as video to avoid runtime issues.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Pre-rendering isn't always possible for interactive content. Fix runtime sync.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "vfx",
      title: "Audio Latency Compensation",
      image_path: "assets/generated/SequencerAudioSyncDrift/step-5.png",
      prompt:
        "<p>Fixed frame rate helps but audio has a consistent small offset (not drift) across all platforms. What causes this offset?</p><p><strong>What causes constant audio offset?</strong></p>",
      choices: [
        {
          text: "<strong>Audio latency</strong> from the sound device and audio engine. Apply an offset to audio tracks using the track's <code>Row Index</code> offset or adjust <code>Start Offset</code>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Device latency is consistent and can be compensated with track offset.",
          next: "step-6",
        },
        {
          text: "The audio file has silent padding at the start.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Silent padding would show in the waveform. This is runtime latency.",
          next: "step-5",
        },
        {
          text: "Sequencer applies a default delay for audio tracks.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. No default delay exists. It's audio engine latency.",
          next: "step-5",
        },
        {
          text: "Video is playing too early relative to audio load time.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. With Audio clock, audio is the authority. It's device latency.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "vfx",
      title: "Track Start Offset",
      image_path: "assets/generated/SequencerAudioSyncDrift/step-6.png",
      prompt:
        "<p>You need to apply a -50ms offset to audio to compensate for latency. How do you offset an audio track in Sequencer?</p><p><strong>How do you apply track offset?</strong></p>",
      choices: [
        {
          text: "Select the audio section in the track, open the Details panel, and adjust the <code>Start Offset</code> property to shift playback timing relative to the sequence timeline.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Start Offset shifts when the audio plays without moving it in the timeline.",
          next: "step-7",
        },
        {
          text: "Drag the audio clip left on the timeline by 50ms.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Moving on timeline changes sequence timing. Use Start Offset for precise latency compensation.",
          next: "step-6",
        },
        {
          text: "Edit the audio file externally to add leading silence.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. External editing is destructive. Use Sequencer's non-destructive offset.",
          next: "step-6",
        },
        {
          text: "Create a global audio offset in Project Settings.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Global offset affects all audio. Use per-track offset for precise control.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "vfx",
      title: "Subsequence Timing",
      image_path: "assets/generated/SequencerAudioSyncDrift/step-7.png",
      prompt:
        "<p>Your sequence uses Subsequences for organization. Audio in subsequences has separate sync issues. What affects subsequence timing?</p><p><strong>What causes subsequence audio issues?</strong></p>",
      choices: [
        {
          text: "Subsequences can have their own time dilation and playrate settings. Verify the subsequence <code>Time Scale</code> is 1.0 and that the parent sequence's audio clock propagates correctly.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Subsequence time scaling can create timing mismatches with parent audio.",
          next: "step-8",
        },
        {
          text: "Audio can't be used in subsequences; move it to the master sequence.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Subsequences support audio fully. Check time scale settings.",
          next: "step-7",
        },
        {
          text: "Subsequences always have 100ms of loading overhead.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no fixed overhead. Check time scale and playrate.",
          next: "step-7",
        },
        {
          text: "Create separate audio tracks in the master sequence instead.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Master tracks work but fixing subsequence settings maintains organization.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "vfx",
      title: "Play Rate Effects",
      image_path: "assets/generated/SequencerAudioSyncDrift/step-8.png",
      prompt:
        "<p>The sequence has a slow-motion section with Play Rate set to 0.5. Audio pitch changes but timing drifts during this section. Why?</p><p><strong>Why does slow-motion affect audio sync?</strong></p>",
      choices: [
        {
          text: "By default, audio <strong>doesn't time-stretch</strong> when Play Rate changes—it either pitches down or ignores rate changes. Use <code>Time Stretch</code> audio or separate audio handling for slow-mo sections.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Audio time-stretching behavior differs from visual time scaling.",
          next: "step-9",
        },
        {
          text: "Slow motion breaks audio clocks entirely.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Audio can work in slow-mo with proper settings. Configure time stretch.",
          next: "step-8",
        },
        {
          text: "The audio file sample rate doesn't match the slow-motion rate.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Sample rate is unrelated to playback speed. It's a time-stretch setting.",
          next: "step-8",
        },
        {
          text: "Render the slow-motion section as a separate video file.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Pre-rendering is a workaround. Configure audio time-stretch instead.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "vfx",
      title: "Sound Cue vs Wave",
      image_path: "assets/generated/SequencerAudioSyncDrift/step-9.png",
      prompt:
        "<p>You're using Sound Cues with multiple variations and random selection. These have timing inconsistencies. What's causing this?</p><p><strong>Why do Sound Cues have sync issues?</strong></p>",
      choices: [
        {
          text: "Sound Cues with random selection or concatenation have variable timing. For precise sync, use <strong>Sound Waves</strong> directly, or ensure all Cue variations have identical lengths.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Sound Cue variability creates unpredictable timing. Use direct waves for precision.",
          next: "step-10",
        },
        {
          text: "Sound Cues add processing latency that varies per play.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Processing is consistent. It's the random variation content that differs.",
          next: "step-9",
        },
        {
          text: "Sequencer can only sync with Sound Wave assets.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Cues work but need consistent duration for sync. Waves are simpler.",
          next: "step-9",
        },
        {
          text: "Disable random selection in the Sound Cue editor.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Disabling helps but loses variation. Use waves or ensure consistent durations.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "vfx",
      title: "Streaming Audio",
      image_path: "assets/generated/SequencerAudioSyncDrift/step-10.png",
      prompt:
        "<p>Long voice-over files are set to streaming to save memory. The first few words are sometimes cut off. What causes this?</p><p><strong>Why is audio cut off at the start?</strong></p>",
      choices: [
        {
          text: "Streaming audio has <strong>loading latency</strong> before it can start playing. Either pre-load the audio before the sequence, or add a small buffer time before the audio section starts.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Streaming requires load time. Pre-loading or buffering prevents cutoff.",
          next: "step-11",
        },
        {
          text: "Streaming audio files have corrupted headers.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Corruption would cause complete failure. This is loading latency.",
          next: "step-10",
        },
        {
          text: "The Sequencer timeline starts before audio is cued.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Timeline and audio start together; streaming just needs load time.",
          next: "step-10",
        },
        {
          text: "Convert all audio to non-streaming to fix the issue.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Non-streaming uses more memory. Pre-loading is the balanced solution.",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "vfx",
      title: "Pre-loading Audio",
      image_path: "assets/generated/SequencerAudioSyncDrift/step-11.png",
      prompt:
        "<p>How do you pre-load streaming audio before a sequence plays?</p><p><strong>How do you pre-load audio?</strong></p>",
      choices: [
        {
          text: "In the Audio section properties, enable <code>Preroll</code> or use Blueprint to call <code>LoadSoundWave</code> before triggering the sequence playback.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Pre-roll or explicit loading ensures audio is ready when needed.",
          next: "step-12",
        },
        {
          text: "Start the sequence 2 seconds early to allow loading.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Early start is a workaround but pre-roll is the proper solution.",
          next: "step-11",
        },
        {
          text: "Increase the audio buffer size in Project Settings.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Buffer size affects playback, not initial load. Use pre-roll.",
          next: "step-11",
        },
        {
          text: "Convert to non-streaming for this specific file.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Non-streaming increases memory. Pre-roll is more efficient.",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "vfx",
      title: "Final Verification",
      image_path: "assets/generated/SequencerAudioSyncDrift/step-12.png",
      prompt:
        "<p>All settings are configured. What is the best way to verify audio sync throughout the sequence?</p><p><strong>How do you verify audio sync?</strong></p>",
      choices: [
        {
          text: "Play the full sequence multiple times, including on lower-spec hardware or with artificial frame drops, and verify audio remains synced with visual cues (lip sync, sound effects) at beginning, middle, and end.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Full playthrough testing under various conditions validates sync robustness.",
          next: "conclusion",
        },
        {
          text: "Scrub through the timeline and verify sync at key points.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Scrubbing uses different playback. Full runtime testing needed.",
          next: "step-12",
        },
        {
          text: "Check the audio waveform alignment in the Sequencer editor.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Editor waveforms show asset timing but not runtime sync. Play the sequence.",
          next: "step-12",
        },
        {
          text: "Compare audio file duration to sequence length.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Duration matching doesn't verify runtime sync. Play and listen.",
          next: "step-12",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/SequencerAudioSyncDrift/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've resolved audio synchronization drift in your Level Sequence.</p><h4>Key Takeaways:</h4><ul><li><code>Clock Source</code> — Use Audio clock for sequences with critical audio sync</li><li><code>Force Fixed Frame Interval</code> — Prevents cumulative sub-frame timing errors</li><li><code>Start Offset</code> — Compensates for audio device latency</li><li><strong>Subsequence Time Scale</strong> — Must be 1.0 for consistent sync with parent</li><li><strong>Play Rate</strong> — Audio time-stretch behavior differs from visual scaling</li><li><strong>Sound Waves vs Cues</strong> — Use waves for precise timing, cues for variation</li><li><code>Preroll</code> — Pre-loads streaming audio to prevent start cutoff</li></ul>",
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
