window.SCENARIOS["AnimationRetargetBoneNaming"] = {
  meta: {
    title: "Animation Retarget Fails Due to Bone Naming Mismatch",
    description:
      "Animations from the marketplace play correctly on their source skeleton but produce bizarre deformations when retargeted to your custom character rig.",
    estimateHours: 1.25,
    difficulty: "Intermediate",
    category: "Tech Art",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "AnimationRetargetBoneNaming",
      step: "setup",
    },
  ],
  fault: {
    description: "Retargeted animations cause severe mesh deformations",
    visual_cue: "Character limbs twist or stretch incorrectly during animation",
  },
  expected: {
    description: "Animations retarget cleanly with correct bone mappings",
    validation_action: "verify_retarget",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "AnimationRetargetBoneNaming",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "animation",
      title: "Initial Observation",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-1.png",
      prompt:
        "<p>You purchased an animation pack that works perfectly on the included mannequin. When you retarget to your custom skeleton, the character's arms twist backwards and legs collapse inward.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Open the <strong>IK Retargeter</strong> asset and examine the <code>Chain Mapping</code> between source and target skeletons to identify misaligned bones.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. The IK Retargeter's chain mapping shows exactly which bones are linked, revealing mapping errors.",
          next: "step-2",
        },
        {
          text: "Check if your skeleton has the same total bone count as the source skeleton.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Bone count differences can indicate issues, but retargeting works across different counts. Chain mapping is more specific.",
          next: "step-1",
        },
        {
          text: "Verify the source animations are using <code>Root Motion</code> and your character supports it.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Root Motion affects movement, not bone deformation. The issue is bone-to-bone mapping.",
          next: "step-1",
        },
        {
          text: "Re-import your character's skeletal mesh with <code>Preserve Smoothing Groups</code> enabled.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Smoothing groups affect mesh normals, not skeleton retargeting. Focus on the retarget asset.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "animation",
      title: "Examining Chain Mappings",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-2.png",
      prompt:
        "<p>In the <strong>IK Retargeter</strong>, you see the source skeleton uses <code>upperarm_l</code> but your target uses <code>LeftUpperArm</code>. The auto-mapping failed to match these.</p><p><strong>What is the correct fix?</strong></p>",
      choices: [
        {
          text: "Manually create or edit the <code>IK Rig Chains</code> on both source and target to explicitly map <code>upperarm_l</code> to <code>LeftUpperArm</code> in corresponding chains.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. Explicit chain definitions override auto-mapping, ensuring correct bone correspondence despite naming differences.",
          next: "step-3",
        },
        {
          text: "Rename your skeleton's bones to match the source naming convention exactly.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Renaming works but breaks existing animations and references to your skeleton. Chain mapping is non-destructive.",
          next: "step-2",
        },
        {
          text: "Enable <code>Use Fuzzy Name Matching</code> in the retargeter to find similar bone names.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Fuzzy matching helps with minor variations but can't reliably match completely different naming conventions.",
          next: "step-2",
        },
        {
          text: "Create a <code>Pose Asset</code> that remaps bone transforms between skeletons.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Pose Assets store poses, not bone mappings. IK Rig chains are the correct tool.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "animation",
      title: "Creating IK Rig Chains",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-3.png",
      prompt:
        "<p>You need to set up the <strong>IK Rig</strong> for your target skeleton. What chains are essential for humanoid retargeting?</p><p><strong>Which chains must be defined?</strong></p>",
      choices: [
        {
          text: "Create chains for <code>Spine</code>, <code>Head</code>, <code>LeftArm</code>, <code>RightArm</code>, <code>LeftLeg</code>, and <code>RightLeg</code> at minimum, with optional chains for fingers and twist bones.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. These core chains cover the main body parts. Optional chains add fidelity for hands and deformation bones.",
          next: "step-4",
        },
        {
          text: "Create a single <code>FullBody</code> chain containing all bones from root to extremities.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. A single chain doesn't provide enough granularity for proper limb correspondence. Separate limb chains are needed.",
          next: "step-3",
        },
        {
          text: "Only create chains for bones that have different names between source and target.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. All major body parts need chains for proper IK solving, regardless of name similarity.",
          next: "step-3",
        },
        {
          text: "Create one chain per bone in the skeleton for maximum precision.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Per-bone chains defeat the purpose of chain-based retargeting. Group bones by body part.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "animation",
      title: "Setting Retarget Poses",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-4.png",
      prompt:
        "<p>Chains are defined but the retarget preview shows the character in an awkward pose. You need to set up the reference poses.</p><p><strong>What is the correct pose setup?</strong></p>",
      choices: [
        {
          text: "Set both source and target <code>IK Rigs</code> to use their respective <code>Retarget Pose</code> (typically T-pose or A-pose), ensuring both are in matching base poses.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Matching reference poses ensure the retargeter correctly calculates the offset between skeletons.",
          next: "step-5",
        },
        {
          text: "Use the source skeleton's bind pose and your target's first animation frame as references.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. This can work in specific cases but is unreliable. Standard retarget poses (T/A-pose) are more consistent.",
          next: "step-4",
        },
        {
          text: "Set both skeletons to the exact same world-space orientation before retargeting.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. World orientation is handled by the retargeter. Focus on skeleton pose, not placement.",
          next: "step-4",
        },
        {
          text: "Disable reference poses entirely and let the retargeter compute offsets automatically.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Without reference poses, the retargeter has no baseline for skeleton differences. Poses are essential.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "animation",
      title: "Adjusting Chain Settings",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-5.png",
      prompt:
        "<p>The arms now move correctly, but the hands appear scaled incorrectly—your character has shorter arms than the source mannequin.</p><p><strong>How do you handle proportion differences?</strong></p>",
      choices: [
        {
          text: "Enable <code>IK</code> solving on the arm chains with appropriate <code>Blend to Source</code> settings to maintain end effector positions while adjusting for limb length.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. IK solving compensates for proportion differences by positioning end effectors correctly on the new skeleton.",
          next: "step-6",
        },
        {
          text: "Scale your character's bones in the <strong>Skeleton Tree</strong> to match the source proportions exactly.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Scaling bones changes your character's appearance. IK solving preserves design while fixing animation.",
          next: "step-5",
        },
        {
          text: "Set <code>Translation Mode</code> to <code>Globally Scaled</code> on all chains to handle size differences.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Global scaling affects the entire animation, not just proportion compensation. IK solving is more targeted.",
          next: "step-5",
        },
        {
          text: "Keyframe corrections manually on the retargeted animation to fix hand positions.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.5hrs. Manual keyframing for every animation is impractical. Systemic IK solving fixes all animations at once.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "animation",
      title: "Handling Twist Bones",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-6.png",
      prompt:
        "<p>Core retargeting works, but you notice the forearm twisting looks unnatural. Your skeleton has twist bones that the source doesn't.</p><p><strong>How do you handle mismatched twist bone setups?</strong></p>",
      choices: [
        {
          text: "Add your twist bones to the arm chain definition and configure them as <code>Internal</code> bones that interpolate rotation from the chain's main bones.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Internal bones inherit motion proportionally, maintaining proper twist distribution even when the source lacks them.",
          next: "step-7",
        },
        {
          text: "Create a separate <code>TwistBones</code> chain that maps twist bones to the source's regular arm bones.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Separate chains add complexity. Internal bone designation within the arm chain is cleaner.",
          next: "step-6",
        },
        {
          text: "Remove twist bones from your skeleton to match the source's simpler structure.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.4hrs. Removing bones degrades your skeleton's deformation quality. Proper chain setup preserves your rig.",
          next: "step-6",
        },
        {
          text: "Set twist bones to <code>Skip</code> in the chain so they don't receive any retargeted animation.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Skipping twist bones leaves them unanimated, causing visible deformation breaks. Internal designation is correct.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "animation",
      title: "Batch Retargeting",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-7.png",
      prompt:
        "<p>The retargeting setup is complete for one animation. You need to retarget 200+ animations from the pack.</p><p><strong>What is the most efficient approach?</strong></p>",
      choices: [
        {
          text: "Select all source animations in the <strong>Content Browser</strong>, right-click, choose <code>Retarget Animations</code>, and select your configured <strong>IK Retargeter</strong> asset.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Batch retargeting applies your mappings to all selected animations at once, creating new assets for your skeleton.",
          next: "step-8",
        },
        {
          text: "Open each animation individually in the retargeter and export them one at a time.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +2.0hrs. Manual per-animation processing is extremely slow. Batch retargeting is the standard workflow.",
          next: "step-7",
        },
        {
          text: "Create a Python script to automate opening and exporting each animation programmatically.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.5hrs. Scripting is unnecessary—batch retargeting is built into the Content Browser's right-click menu.",
          next: "step-7",
        },
        {
          text: "Duplicate the IK Retargeter for each animation to process them in parallel.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. One IK Retargeter can process any number of animations. Duplication is never needed.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "animation",
      title: "Verification",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-8.png",
      prompt:
        "<p>Batch retargeting is complete. How do you verify all 200+ animations were retargeted correctly?</p><p><strong>What is the most comprehensive verification approach?</strong></p>",
      choices: [
        {
          text: "Preview key representative animations (idle, walk, run, attack, jump) on your character in the <strong>Animation Editor</strong>, checking for deformation issues and hand/foot positions.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. Sampling key animation types catches most mapping issues without reviewing every single animation.",
          next: "conclusion",
        },
        {
          text: "Scrub through all 200 animations in the Content Browser's animation preview.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.5hrs. Checking all animations is thorough but time-consuming. Representative sampling is more practical.",
          next: "step-8",
        },
        {
          text: "Check that all animation file sizes match between source and retargeted versions.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. File sizes vary based on skeleton complexity, not retarget quality. Visual verification is required.",
          next: "step-8",
        },
        {
          text: "Run the animations in-game and rely on QA to report any visible issues.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +1.0hrs. Waiting for QA delays feedback. Artist verification in the Animation Editor is the first pass.",
          next: "step-8",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/AnimationRetargetBoneNaming/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've successfully configured animation retargeting for a custom skeleton.</p><h4>Key Takeaways:</h4><ul><li><code>IK Rig Chains</code> — Define bone groups for retargeting correspondence</li><li><code>Retarget Pose</code> — Matching reference poses (T/A-pose) are essential</li><li><code>IK Solving</code> — Compensates for proportion differences between skeletons</li><li><code>Internal Bones</code> — Handle twist bones not present in source</li><li><strong>Batch Retargeting</strong> — Process many animations via Content Browser right-click</li></ul>",
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
