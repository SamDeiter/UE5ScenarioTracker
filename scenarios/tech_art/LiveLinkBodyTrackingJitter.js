window.SCENARIOS["LiveLinkBodyTrackingJitter"] = {
  meta: {
    title: "Live Link Body Tracking Shows Constant Jitter",
    description:
      "Your motion capture data streamed via Live Link shows constant high-frequency jitter on all bones, making the captured performance unusable.",
    estimateHours: 1.5,
    difficulty: "Advanced",
    category: "Tech Art",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "LiveLinkBodyTrackingJitter",
      step: "setup",
    },
  ],
  fault: {
    description: "Live Link stream has constant jitter on all bones",
    visual_cue:
      "Character vibrates/shakes rapidly during motion capture playback",
  },
  expected: {
    description: "Smooth, clean motion capture data with natural movement",
    validation_action: "verify_live_link_quality",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "LiveLinkBodyTrackingJitter",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "tech_art",
      title: "Initial Observation",
      image_path: "assets/generated/LiveLinkBodyTrackingJitter/step-1.png",
      prompt:
        "<p>Your motion capture system streams data via Live Link. The character in UE5 shows constant micro-vibrations on all bones, even when the performer stands still.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Open the <strong>Live Link</strong> panel (<code>Window > Live Link</code>) to verify connection status and check if the source shows healthy data rates without dropped frames.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Live Link panel shows stream health including data rate, latency, and dropped frames.",
          next: "step-2",
        },
        {
          text: "Increase the character mesh resolution for smoother deformation.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Mesh resolution affects deformation quality, not input data jitter.",
          next: "step-1",
        },
        {
          text: "Check if the skeleton has correct bone constraints.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Constraints affect retargeting but jitter comes from input. Check Live Link first.",
          next: "step-1",
        },
        {
          text: "Disable all animation layers and test with raw data.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Layers can add complexity but check source quality first.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "tech_art",
      title: "Checking Source Quality",
      image_path: "assets/generated/LiveLinkBodyTrackingJitter/step-2.png",
      prompt:
        "<p>The Live Link panel shows the mocap source is connected at 120fps with no dropped frames. The jitter is visible in the Live Link virtual subject preview. What does this indicate?</p><p><strong>What does jitter in the preview indicate?</strong></p>",
      choices: [
        {
          text: "The <strong>source data itself</strong> contains jitter—it's not a UE5 processing issue. The problem is either in the capture hardware, tracking quality, or source application filtering.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Preview showing jitter means the data arrives already jittered. Source needs investigation.",
          next: "step-3",
        },
        {
          text: "Live Link's network buffer is too small causing artifacts.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Buffer issues cause latency and drops. Consistent jitter is source data quality.",
          next: "step-2",
        },
        {
          text: "The skeleton retargeting is causing the jitter.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Retargeting applies after Live Link preview. This is source jitter.",
          next: "step-2",
        },
        {
          text: "UE5's frame rate doesn't match the 120fps source.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Frame rate mismatch causes interpolation issues, not high-frequency jitter.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "tech_art",
      title: "Source Application Filtering",
      image_path: "assets/generated/LiveLinkBodyTrackingJitter/step-3.png",
      prompt:
        "<p>You need to filter the jitter. Where is the best place to apply filtering?</p><p><strong>Where should filtering be applied?</strong></p>",
      choices: [
        {
          text: "First try enabling <strong>smoothing/filtering in the mocap software</strong> (like Rokoko Studio, Xsens, or OptiTrack Motive) before the data reaches Live Link.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Source application filtering is most effective as it processes the full-resolution capture data.",
          next: "step-4",
        },
        {
          text: "Apply filtering only in the UE5 Animation Blueprint.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. ABP filtering works but source filtering is more efficient and accurate.",
          next: "step-3",
        },
        {
          text: "Post-process the recorded data after capture session ends.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Post-processing works for recordings but real-time streaming needs live filtering.",
          next: "step-3",
        },
        {
          text: "Reduce the capture frame rate to eliminate noise.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Lower frame rate loses detail. Proper filtering preserves motion quality.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "tech_art",
      title: "Live Link Preprocessing",
      image_path: "assets/generated/LiveLinkBodyTrackingJitter/step-4.png",
      prompt:
        "<p>Source filtering helps but some jitter remains. What Live Link feature can apply additional preprocessing?</p><p><strong>What Live Link feature filters data?</strong></p>",
      choices: [
        {
          text: "Create a <strong>Live Link Preset</strong> with preprocessing settings including <code>Bone Translation Filter</code> and <code>Bone Rotation Filter</code> to smooth incoming data.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Live Link presets can apply filtering before data reaches the Animation Blueprint.",
          next: "step-5",
        },
        {
          text: "Enable 'Auto Smooth' in the Live Link panel settings.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. No Auto Smooth exists. Use preprocessing in Live Link Presets.",
          next: "step-4",
        },
        {
          text: "Increase the subject frame buffer size.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Buffer size affects latency, not filtering. Use preset preprocessing.",
          next: "step-4",
        },
        {
          text: "Duplicate the Live Link source and average them.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Duplicating doesn't help. Use built-in filtering in presets.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "tech_art",
      title: "Creating a Live Link Preset",
      image_path: "assets/generated/LiveLinkBodyTrackingJitter/step-5.png",
      prompt:
        "<p>How do you create and apply a Live Link Preset with filtering?</p><p><strong>How do you set up a preset?</strong></p>",
      choices: [
        {
          text: "In Live Link panel, go to <strong>Presets</strong> dropdown, create a new preset, configure <code>Source Settings</code> including frame interpolation and filtering options, then assign the preset to your source.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Preset configuration allows per-source filtering settings.",
          next: "step-6",
        },
        {
          text: "Right-click the source and select 'Apply Smoothing Preset'.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. No such right-click option. Use the Presets dropdown menu.",
          next: "step-5",
        },
        {
          text: "Create a Blueprint that wraps the Live Link data with filtering.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Blueprint wrapping is more complex. Use built-in presets.",
          next: "step-5",
        },
        {
          text: "Presets are configured in Project Settings > Live Link.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Project Settings has global options. Per-source presets are in Live Link panel.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "tech_art",
      title: "Animation Blueprint Filtering",
      image_path: "assets/generated/LiveLinkBodyTrackingJitter/step-6.png",
      prompt:
        "<p>Live Link preprocessing reduced jitter significantly. For remaining high-frequency noise, what Animation Blueprint technique provides additional smoothing?</p><p><strong>What ABP node smooths motion?</strong></p>",
      choices: [
        {
          text: "Add an <code>Inertialization</code> node or use <code>Bone Driven Controller</code> with damping to smooth remaining high-frequency noise in the animation output.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Inertialization blends pose changes smoothly without visible discontinuities.",
          next: "step-7",
        },
        {
          text: "Use a Time Warp node to slow down jittery sections.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Time Warp affects playback speed, not smoothing. Use Inertialization.",
          next: "step-6",
        },
        {
          text: "Apply a Post Process Animation Blueprint for filtering.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Post Process ABP can work but inline Inertialization is simpler.",
          next: "step-6",
        },
        {
          text: "Enable 'Smooth Animation' in the Skeletal Mesh component.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. No such component setting. Use ABP nodes for smoothing.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "tech_art",
      title: "Specific Bone Jitter",
      image_path: "assets/generated/LiveLinkBodyTrackingJitter/step-7.png",
      prompt:
        "<p>Most bones are smooth now but fingers still show significant jitter. Why might extremities have more noise?</p><p><strong>Why do fingers jitter more?</strong></p>",
      choices: [
        {
          text: "Smaller bones and extremities have <strong>less stable tracking</strong> due to occlusion, marker placement issues, or lower tracking confidence. They need stronger individual filtering.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Extremities are harder to track accurately. Apply targeted filtering.",
          next: "step-8",
        },
        {
          text: "Finger bones have different coordinate systems causing jitter.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Coordinate systems affect retargeting, not jitter. It's tracking confidence.",
          next: "step-7",
        },
        {
          text: "The mocap system doesn't support finger tracking properly.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Most systems support fingers but with lower accuracy. Filter appropriately.",
          next: "step-7",
        },
        {
          text: "Finger animations should come from a separate hand-tracking device.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Separate devices can help but filtering the current data is faster.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "tech_art",
      title: "Per-Bone Filtering",
      image_path: "assets/generated/LiveLinkBodyTrackingJitter/step-8.png",
      prompt:
        "<p>How do you apply stronger filtering to specific bones like fingers?</p><p><strong>How do you filter specific bones?</strong></p>",
      choices: [
        {
          text: "In the Animation Blueprint, use <code>Modify Bone</code> nodes with interpolation to blend finger transforms toward a smoothed value, or use <code>SpringController</code> for physics-based damping on specific chains.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Per-bone modification allows targeted filtering while preserving body motion.",
          next: "step-9",
        },
        {
          text: "Create separate Live Link subjects for hands only.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Separate subjects adds complexity. ABP per-bone filtering is simpler.",
          next: "step-8",
        },
        {
          text: "Reduce finger bone influence in the skeleton hierarchy.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Influence affects skinning, not animation data. Filter in ABP.",
          next: "step-8",
        },
        {
          text: "Disable finger tracking entirely and use baked animations.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Disabling loses captured performance. Filter to preserve accuracy.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "tech_art",
      title: "Frame Interpolation",
      image_path: "assets/generated/LiveLinkBodyTrackingJitter/step-9.png",
      prompt:
        "<p>The mocap system sends data at 120fps but UE5 runs at 60fps. How does this mismatch affect quality?</p><p><strong>How does frame rate mismatch affect Live Link?</strong></p>",
      choices: [
        {
          text: "Live Link <strong>interpolates or drops frames</strong> to match engine tick rate. Configure <code>Interpolation Mode</code> in the subject settings to control how intermediate samples are blended.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Interpolation mode affects how higher-rate data is consumed by lower-rate engine.",
          next: "step-10",
        },
        {
          text: "UE5 automatically matches the source frame rate.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Engine has its own tick rate. Live Link interpolates between them.",
          next: "step-9",
        },
        {
          text: "You must set UE5 to fixed 120fps to receive all data.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Matching is ideal but interpolation handles rate differences gracefully.",
          next: "step-9",
        },
        {
          text: "Higher source rate always causes aliasing artifacts.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Higher rate provides more samples. Proper interpolation uses them smoothly.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "tech_art",
      title: "Timecode Synchronization",
      image_path: "assets/generated/LiveLinkBodyTrackingJitter/step-10.png",
      prompt:
        "<p>You're recording the session for later use. What ensures captured data aligns with other recorded elements?</p><p><strong>What synchronizes recorded data?</strong></p>",
      choices: [
        {
          text: "Use <strong>Timecode</strong> synchronization via the <code>Timecode Provider</code> system. All sources locked to the same timecode ensures precise alignment for multi-track recording.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Timecode sync ensures mocap, cameras, and audio align frame-accurately.",
          next: "step-11",
        },
        {
          text: "Start all recordings with a clap or sync marker.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Manual sync works but timecode is automatic and frame-accurate.",
          next: "step-10",
        },
        {
          text: "Record everything to the same hard drive to maintain sync.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Storage location doesn't affect timing. Use timecode sync.",
          next: "step-10",
        },
        {
          text: "Align recordings in post based on visual cues.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Post-alignment is tedious. Timecode provides automatic sync.",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "tech_art",
      title: "Recording Quality",
      image_path: "assets/generated/LiveLinkBodyTrackingJitter/step-11.png",
      prompt:
        "<p>When recording a Take for later use, should you record raw or filtered data?</p><p><strong>What should you record?</strong></p>",
      choices: [
        {
          text: "Record the <strong>raw incoming data</strong> before filtering. Raw data preserves maximum fidelity and allows you to adjust filtering later during post-processing.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Raw recording is non-destructive. Apply and adjust filters in post.",
          next: "step-12",
        },
        {
          text: "Record filtered data so it's immediately usable.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Pre-filtered is convenient but can't be unfiltered later.",
          next: "step-11",
        },
        {
          text: "Record both raw and filtered as separate tracks.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Dual tracks work but raw alone is sufficient with post-processing.",
          next: "step-11",
        },
        {
          text: "Recording always captures exactly what's shown in viewport.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Recording can capture raw Live Link data or evaluated animation. Choose raw.",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "tech_art",
      title: "Latency Verification",
      image_path: "assets/generated/LiveLinkBodyTrackingJitter/step-12.png",
      prompt:
        "<p>Filtering is configured. What should you verify about overall system latency?</p><p><strong>What latency check is important?</strong></p>",
      choices: [
        {
          text: "Check the <strong>total pipeline latency</strong> from performer movement to character display. Excessive filtering adds latency that can make real-time interaction feel sluggish.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Balance smooth filtering against acceptable latency for the use case.",
          next: "step-13",
        },
        {
          text: "Verify network ping time to the mocap system.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Network latency is one part. Total pipeline includes filtering delays.",
          next: "step-12",
        },
        {
          text: "Ensure GPU frame time doesn't exceed CPU time.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. GPU/CPU balance affects frame rate, not mocap latency.",
          next: "step-12",
        },
        {
          text: "Latency is only important for live performances.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Latency matters for any real-time preview during capture.",
          next: "step-12",
        },
      ],
    },
    "step-13": {
      skill: "tech_art",
      title: "Capture Environment",
      image_path: "assets/generated/LiveLinkBodyTrackingJitter/step-13.png",
      prompt:
        "<p>What capture environment factors can reduce jitter at the source?</p><p><strong>What improves source quality?</strong></p>",
      choices: [
        {
          text: "Ensure <strong>proper lighting</strong> for optical systems, use <strong>correct sensor calibration</strong>, check for <strong>electromagnetic interference</strong> for inertial systems, and maintain <strong>marker visibility</strong>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Good capture conditions produce clean data before any filtering is needed.",
          next: "step-14",
        },
        {
          text: "Use more filtering to compensate for environment issues.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Excessive filtering can't recover lost data. Fix the environment.",
          next: "step-13",
        },
        {
          text: "Environment doesn't affect digital mocap data quality.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. All capture systems are affected by environmental factors.",
          next: "step-13",
        },
        {
          text: "Only optical systems are affected by environment.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Inertial systems are affected by magnetic fields. All systems have sensitivities.",
          next: "step-13",
        },
      ],
    },
    "step-14": {
      skill: "tech_art",
      title: "Testing Static and Dynamic",
      image_path: "assets/generated/LiveLinkBodyTrackingJitter/step-14.png",
      prompt:
        "<p>How do you verify jitter is resolved for both static poses and dynamic movement?</p><p><strong>What testing validates the fix?</strong></p>",
      choices: [
        {
          text: "Test with performer <strong>standing perfectly still</strong> (no visible micro-movement), then <strong>moving dynamically</strong> (smooth motion without vibration), and during <strong>transitions</strong> (no artifacts when starting/stopping).",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. All three scenarios ensure filtering works across the full motion range.",
          next: "step-15",
        },
        {
          text: "Only test dynamic movement since that's the important case.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Static poses often reveal jitter most clearly. Test all scenarios.",
          next: "step-14",
        },
        {
          text: "Record a long session and review for issues.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Long recording is for capture. Quick tests verify filtering settings.",
          next: "step-14",
        },
        {
          text: "Check the numerical values in the Live Link panel.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Numbers help but visual assessment of the character is definitive.",
          next: "step-14",
        },
      ],
    },
    "step-15": {
      skill: "tech_art",
      title: "Final Verification",
      image_path: "assets/generated/LiveLinkBodyTrackingJitter/step-15.png",
      prompt:
        "<p>What is the final verification that the Live Link pipeline is production-ready?</p><p><strong>What confirms production readiness?</strong></p>",
      choices: [
        {
          text: "Run a full <strong>performance capture session</strong> with the actual content, verify clean data throughout, record and review the takes, then confirm the filtering settings don't add unacceptable latency for the use case.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. Complete session testing validates the entire pipeline under production conditions.",
          next: "conclusion",
        },
        {
          text: "Verify all settings are saved in the Live Link preset.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Preset saving is important but production testing is essential.",
          next: "step-15",
        },
        {
          text: "Check that frame rate stays stable during capture.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Frame rate stability helps but clean motion data is the goal.",
          next: "step-15",
        },
        {
          text: "Compare to reference footage from a commercial production.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Reference is useful for goals but test your actual pipeline.",
          next: "step-15",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/LiveLinkBodyTrackingJitter/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've resolved Live Link body tracking jitter for clean motion capture.</p><h4>Key Takeaways:</h4><ul><li><strong>Live Link Panel</strong> — Check connection status, frame rate, and dropped frames</li><li><strong>Source Application Filtering</strong> — First line of defense for noisy data</li><li><code>Live Link Presets</code> — Apply preprocessing including bone filters</li><li><code>Inertialization</code> — ABP node for smooth pose blending</li><li><strong>Per-Bone Filtering</strong> — Stronger filtering for extremities like fingers</li><li><code>Interpolation Mode</code> — Handles frame rate mismatches</li><li><strong>Timecode Sync</strong> — Ensures multi-track recording alignment</li><li><strong>Raw Recording</strong> — Preserve unfiltered data for post-processing flexibility</li></ul>",
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
