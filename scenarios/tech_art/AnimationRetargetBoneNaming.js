window.SCENARIOS["AnimationRetargetBoneNaming"] = {
  meta: {
    title: "Animation Retarget Fails Due to Bone Naming Mismatch",
    description:
      "Animations from the marketplace play correctly on their source skeleton but produce bizarre deformations when retargeted to your custom character rig.",
    estimateHours: 1.5,
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
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Root Motion affects movement, not bone deformation. The issue is bone-to-bone mapping.",
          next: "step-1",
        },
        {
          text: "Re-import your character's skeletal mesh with <code>Preserve Smoothing Groups</code> enabled.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Smoothing groups affect mesh normals, not skeleton retargeting. Focus on the retarget asset.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "animation",
      title: "Understanding IK Retargeting",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-2.png",
      prompt:
        "<p>You open the IK Retargeter. What are the key components that need to be set up for retargeting to work?</p><p><strong>What does the IK Retargeting system require?</strong></p>",
      choices: [
        {
          text: "Two <strong>IK Rig</strong> assets (one for source, one for target skeleton), each defining matching chain structures that the retargeter maps together.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. IK Rigs define the chain structure on each skeleton, and the retargeter maps corresponding chains.",
          next: "step-3",
        },
        {
          text: "A single <strong>Bone Mapping Table</strong> that lists source and target bone names in pairs.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. UE5's IK retargeting uses chains, not simple name pairs. Chain-based mapping is more flexible.",
          next: "step-2",
        },
        {
          text: "A <strong>Control Rig</strong> asset that procedurally generates bone transforms.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Control Rigs are for procedural animation. IK Rigs and Retargeters handle retargeting.",
          next: "step-2",
        },
        {
          text: "Identical <strong>Skeleton Assets</strong> for both source and target with compatible hierarchy.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Retargeting specifically handles different skeletons. Identical assets would make retargeting unnecessary.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "animation",
      title: "Examining Chain Mappings",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-3.png",
      prompt:
        "<p>You see the source skeleton uses <code>upperarm_l</code> but your target uses <code>LeftUpperArm</code>. The auto-mapping failed to match these.</p><p><strong>What is the correct fix?</strong></p>",
      choices: [
        {
          text: "Manually edit the <code>IK Rig Chains</code> on both source and target to explicitly map corresponding bones like <code>upperarm_l</code> to <code>LeftUpperArm</code> in equivalent chains.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. Explicit chain definitions override auto-mapping, ensuring correct bone correspondence despite naming differences.",
          next: "step-4",
        },
        {
          text: "Rename your skeleton's bones to match the source naming convention exactly.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Renaming works but breaks existing animations and references. Chain mapping is non-destructive.",
          next: "step-3",
        },
        {
          text: "Enable <code>Fuzzy Name Matching</code> in the retargeter to find similar bone names.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Fuzzy matching helps with minor variations but can't reliably match completely different conventions.",
          next: "step-3",
        },
        {
          text: "Create a <code>Pose Asset</code> that remaps bone transforms between skeletons.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Pose Assets store poses, not bone mappings. IK Rig chains are the correct tool.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "animation",
      title: "Opening the IK Rig",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-4.png",
      prompt:
        "<p>You need to set up the IK Rig for your target skeleton. How do you create or access the IK Rig asset?</p><p><strong>Where do you create an IK Rig?</strong></p>",
      choices: [
        {
          text: "Right-click in the <strong>Content Browser</strong>, select <code>Animation</code> > <code>IK Rig</code>, and choose your target skeleton when prompted.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. IK Rigs are created from the Content Browser and associated with a specific skeleton.",
          next: "step-5",
        },
        {
          text: "Open the Skeleton asset and use the <strong>Create IK Rig</strong> button in the toolbar.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The button exists but creating via Content Browser right-click is the primary workflow.",
          next: "step-4",
        },
        {
          text: "Double-click the IK Retargeter and it will auto-generate IK Rigs for both skeletons.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The retargeter requires pre-existing IK Rigs. You must create them first.",
          next: "step-4",
        },
        {
          text: "Export the skeleton to FBX, edit in Maya/Blender to add IK, then reimport.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.5hrs. IK Rigs are UE5 assets, not defined in external DCC tools. Create them in-engine.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "animation",
      title: "Creating IK Rig Chains",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-5.png",
      prompt:
        "<p>You open your target skeleton's IK Rig. What chains are essential for humanoid retargeting?</p><p><strong>Which chains must be defined?</strong></p>",
      choices: [
        {
          text: "Create chains for <code>Spine</code>, <code>Head</code>, <code>LeftArm</code>, <code>RightArm</code>, <code>LeftLeg</code>, and <code>RightLeg</code> at minimum, with optional chains for fingers.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. These core chains cover the main body parts. Optional chains add fidelity for hands.",
          next: "step-6",
        },
        {
          text: "Create a single <code>FullBody</code> chain containing all bones from root to extremities.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. A single chain doesn't provide enough granularity. Separate limb chains are needed.",
          next: "step-5",
        },
        {
          text: "Only create chains for bones that have different names between source and target.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. All major body parts need chains for proper IK solving, regardless of name similarity.",
          next: "step-5",
        },
        {
          text: "Create one chain per bone in the skeleton for maximum precision.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Per-bone chains defeat the purpose. Group bones by body part.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "animation",
      title: "Defining a Chain",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-6.png",
      prompt:
        "<p>You're creating the LeftArm chain. How do you define which bones belong to this chain?</p><p><strong>How do you add bones to a chain?</strong></p>",
      choices: [
        {
          text: "In the IK Rig editor, right-click a bone like <code>LeftUpperArm</code> and select <code>Add New Chain</code>. Then set the <code>End Bone</code> to the hand or fingertip.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Chains are defined by start and end bones; all bones in between are automatically included.",
          next: "step-7",
        },
        {
          text: "Drag each bone from the hierarchy panel into a chain container widget.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. You specify start/end bones, not individual bones. The chain infers the path.",
          next: "step-6",
        },
        {
          text: "Type the bone names manually into a text field, separated by commas.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Chain creation uses bone selection in the viewport, not text entry.",
          next: "step-6",
        },
        {
          text: "Import a chain definition file exported from your DCC application.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Chains are defined entirely within UE5's IK Rig editor, not imported.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "animation",
      title: "Setting Retarget Poses",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-7.png",
      prompt:
        "<p>Chains are defined but the retarget preview shows the character in an awkward pose. You need to set up reference poses.</p><p><strong>What is the correct pose setup?</strong></p>",
      choices: [
        {
          text: "Set both source and target <code>IK Rigs</code> to use their respective <code>Retarget Pose</code> (typically T-pose or A-pose), ensuring both match.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Matching reference poses ensure the retargeter correctly calculates offsets between skeletons.",
          next: "step-8",
        },
        {
          text: "Use the source skeleton's bind pose and your target's animation frame 0 as references.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. This can work in some cases but standard T/A-poses are more consistent.",
          next: "step-7",
        },
        {
          text: "Set both skeletons to the exact same world-space orientation before retargeting.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. World orientation is handled automatically. Focus on skeleton pose.",
          next: "step-7",
        },
        {
          text: "Disable reference poses entirely to let the retargeter compute offsets automatically.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Without reference poses, the retargeter has no baseline. Poses are essential.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "animation",
      title: "Handling Proportion Differences",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-8.png",
      prompt:
        "<p>The arms now move correctly, but hands appear at wrong positions—your character has shorter arms than the source mannequin.</p><p><strong>How do you handle proportion differences?</strong></p>",
      choices: [
        {
          text: "Enable <code>IK</code> solving on the arm chains with appropriate <code>Blend to Source</code> settings to maintain end effector positions while adjusting for limb length.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. IK solving compensates for proportions by positioning end effectors correctly.",
          next: "step-9",
        },
        {
          text: "Scale your character's bones in the <strong>Skeleton Tree</strong> to match source proportions exactly.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Scaling bones changes your character's design. IK solving preserves it.",
          next: "step-8",
        },
        {
          text: "Set <code>Translation Mode</code> to <code>Globally Scaled</code> on all chains.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Global scaling affects entire animation. IK solving is more targeted.",
          next: "step-8",
        },
        {
          text: "Keyframe corrections manually on each retargeted animation to fix hand positions.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.5hrs. Manual keyframing for every animation is impractical. IK solving fixes all at once.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "animation",
      title: "Handling Twist Bones",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-9.png",
      prompt:
        "<p>Core retargeting works, but forearm twisting looks unnatural. Your skeleton has twist bones that the source doesn't.</p><p><strong>How do you handle mismatched twist bone setups?</strong></p>",
      choices: [
        {
          text: "Add your twist bones to the arm chain and configure them as <code>Internal</code> bones that interpolate rotation from the chain's main bones.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Internal bones inherit motion proportionally, maintaining proper twist distribution.",
          next: "step-10",
        },
        {
          text: "Create a separate <code>TwistBones</code> chain that maps to the source's regular arm bones.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Separate chains add complexity. Internal bone designation is cleaner.",
          next: "step-9",
        },
        {
          text: "Remove twist bones from your skeleton to match the source's simpler structure.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.4hrs. Removing bones degrades deformation quality. Proper chain setup preserves your rig.",
          next: "step-9",
        },
        {
          text: "Set twist bones to <code>Skip</code> so they don't receive any retargeted animation.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Skipping twist bones leaves them unanimated. Internal designation is correct.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "animation",
      title: "Batch Retargeting",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-10.png",
      prompt:
        "<p>The retargeting setup is complete for one animation. You need to retarget 200+ animations from the pack.</p><p><strong>What is the most efficient approach?</strong></p>",
      choices: [
        {
          text: "Select all source animations in the <strong>Content Browser</strong>, right-click, choose <code>Retarget Animations</code>, and select your configured <strong>IK Retargeter</strong>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Batch retargeting applies your mappings to all selected animations at once.",
          next: "step-11",
        },
        {
          text: "Open each animation individually in the retargeter and export them one at a time.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +2.0hrs. Manual per-animation processing is extremely slow. Use batch retargeting.",
          next: "step-10",
        },
        {
          text: "Create a Python script to automate opening and exporting each animation programmatically.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.5hrs. Scripting is unnecessary—batch retargeting is built into the Content Browser.",
          next: "step-10",
        },
        {
          text: "Duplicate the IK Retargeter for each animation to process them in parallel.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. One IK Retargeter handles any number of animations. Duplication is never needed.",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "animation",
      title: "Configuring Output",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-11.png",
      prompt:
        "<p>The batch retarget dialog appears. What output settings should you configure?</p><p><strong>What output options are important?</strong></p>",
      choices: [
        {
          text: "Set the <code>Export Path</code> to a folder for your character's animations, and optionally configure a <code>Naming Prefix/Suffix</code> to distinguish retargeted assets.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Organized output paths and clear naming prevent confusion with source animations.",
          next: "step-12",
        },
        {
          text: "Leave all settings as default since the retargeter knows where to put files.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Defaults may place files in the source folder, mixing source and retargeted assets.",
          next: "step-11",
        },
        {
          text: "Enable <code>Overwrite Source</code> to replace the original animations with retargeted versions.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Never overwrite source assets. Keep originals for reference and future retargeting.",
          next: "step-11",
        },
        {
          text: "Set output format to <code>FBX</code> for external backup of retargeted animations.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The retargeter creates UE5 animation assets. FBX export is a separate workflow.",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "animation",
      title: "Verification",
      image_path: "assets/generated/AnimationRetargetBoneNaming/step-12.png",
      prompt:
        "<p>Batch retargeting is complete. How do you verify all 200+ animations were retargeted correctly?</p><p><strong>What is the most comprehensive verification approach?</strong></p>",
      choices: [
        {
          text: "Preview key representative animations (idle, walk, run, attack, jump) on your character in the <strong>Animation Editor</strong>, checking for deformation issues.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.2hrs. Sampling key animation types catches most mapping issues without reviewing every single animation.",
          next: "conclusion",
        },
        {
          text: "Scrub through all 200 animations in the Content Browser's animation preview.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.5hrs. Checking all animations is thorough but time-consuming. Representative sampling is practical.",
          next: "step-12",
        },
        {
          text: "Check that all animation file sizes match between source and retargeted versions.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. File sizes vary based on skeleton complexity. Visual verification is required.",
          next: "step-12",
        },
        {
          text: "Run the animations in-game and wait for QA to report any visible issues.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +1.0hrs. Waiting for QA delays feedback. Artist verification is the first pass.",
          next: "step-12",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/AnimationRetargetBoneNaming/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've successfully configured animation retargeting for a custom skeleton with different bone naming conventions.</p><h4>Key Takeaways:</h4><ul><li><code>IK Rig Chains</code> — Define bone groups for retargeting correspondence</li><li><code>Chain Start/End</code> — Chains are defined by start and end bones; intermediate bones are included automatically</li><li><code>Retarget Pose</code> — Matching reference poses (T/A-pose) are essential for correct offset calculation</li><li><code>IK Solving</code> — Compensates for proportion differences between skeletons</li><li><code>Internal Bones</code> — Handle twist bones not present in source skeleton</li><li><strong>Batch Retargeting</strong> — Process many animations via Content Browser right-click</li></ul>",
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
