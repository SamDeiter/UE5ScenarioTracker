window.SCENARIOS["OneFilePerActorMergeConflict"] = {
  meta: {
    title: "One File Per Actor Causes Git Merge Conflicts",
    description:
      "Your team enabled One File Per Actor (OFPA) for World Partition but now Git merges frequently fail, even when team members edit different parts of the level.",
    estimateHours: 1.0,
    difficulty: "Beginner",
    category: "Worldbuilding",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "OneFilePerActorMergeConflict",
      step: "setup",
    },
  ],
  fault: {
    description: "Git merge conflicts occur on World Partition level files",
    visual_cue: "Pull requests fail with conflicts in __ExternalActors__ files",
  },
  expected: {
    description:
      "Team can work on different areas of the level without conflicts",
    validation_action: "verify_ofpa_workflow",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "OneFilePerActorMergeConflict",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "worldbuilding",
      title: "Initial Observation",
      image_path: "assets/generated/OneFilePerActorMergeConflict/step-1.png",
      prompt:
        "<p>Two team members edited different buildings in the level. When merging, Git shows conflicts in the <code>__ExternalActors__</code> folder and the main level file.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Check if both team members were editing in the <strong>same World Partition cell</strong>, which could cause shared file conflicts despite editing different actors.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Even with OFPA, editing in the same cell can cause cell-level metadata conflicts.",
          next: "step-2",
        },
        {
          text: "Disable One File Per Actor to use the traditional single-file approach.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Disabling OFPA makes conflicts worse. Understand the issue first.",
          next: "step-1",
        },
        {
          text: "Use a different version control system that handles binary files better.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Git works fine with proper OFPA setup. Diagnose the workflow issue.",
          next: "step-1",
        },
        {
          text: "Increase the cell size so fewer actors share files.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Cell size affects streaming, not OFPA file granularity. Check editing overlap.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "worldbuilding",
      title: "Understanding OFPA Structure",
      image_path: "assets/generated/OneFilePerActorMergeConflict/step-2.png",
      prompt:
        "<p>You find both team members edited actors in the same grid area. What does One File Per Actor actually store?</p><p><strong>How does OFPA organize files?</strong></p>",
      choices: [
        {
          text: "OFPA stores each actor in its own <code>.uasset</code> file in <code>__ExternalActors__</code>. However, the <strong>level file</strong> and <strong>cell grid metadata</strong> can still conflict when multiple editors modify the same area.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. OFPA separates actors but shared metadata can still conflict.",
          next: "step-3",
        },
        {
          text: "OFPA stores all assets in one file per cell, not per actor.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. OFPA is literally per-actor. Cells don't affect file organization.",
          next: "step-2",
        },
        {
          text: "OFPA only affects Blueprint actors, not placed meshes.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. OFPA affects all placed actors including Static Mesh Actors.",
          next: "step-2",
        },
        {
          text: "OFPA creates text-based files that Git can merge automatically.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. OFPA files are still binary .uasset files. Git can't auto-merge them.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "worldbuilding",
      title: "Level File Conflicts",
      image_path: "assets/generated/OneFilePerActorMergeConflict/step-3.png",
      prompt:
        "<p>The main <code>.umap</code> level file shows conflicts even though actors are separate. What level data causes this?</p><p><strong>What's in the level file that conflicts?</strong></p>",
      choices: [
        {
          text: "The level file contains <strong>World Settings</strong>, <strong>Blueprint references</strong>, and global level metadata that changes when either editor saves, even if they edited different actors.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Level-wide metadata updates on every save create conflicts.",
          next: "step-4",
        },
        {
          text: "The level file stores all actor transforms which both editors modified.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. With OFPA, transforms are in external actor files. Level file has metadata.",
          next: "step-3",
        },
        {
          text: "The level file stores streaming configuration that only one person should edit.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Streaming config is one piece. General metadata updates on any save.",
          next: "step-3",
        },
        {
          text: "The level file contains duplicate copies of actor data as backup.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no duplicate backup. External actors are the sole storage.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "worldbuilding",
      title: "Lock Strategy",
      image_path: "assets/generated/OneFilePerActorMergeConflict/step-4.png",
      prompt:
        "<p>To prevent future conflicts on the level file, what workflow strategy should your team adopt?</p><p><strong>What prevents level file conflicts?</strong></p>",
      choices: [
        {
          text: "Use <strong>file locking</strong> via Git LFS or Perforce to lock the <code>.umap</code> file. When someone edits the level, others see it's locked and coordinate.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. File locking prevents concurrent edits to binary files that can't merge.",
          next: "step-5",
        },
        {
          text: "Always have one person responsible for the level file who commits last.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Manual coordination works but doesn't scale and relies on discipline.",
          next: "step-4",
        },
        {
          text: "Create a separate level file for each team member to edit independently.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Separate levels lose the World Partition coherence. Use locking instead.",
          next: "step-4",
        },
        {
          text: "Use branches so each person works alone and merges when done.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Branches still require merging binary files. Locking prevents conflicts.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "worldbuilding",
      title: "Configuring Git LFS Locking",
      image_path: "assets/generated/OneFilePerActorMergeConflict/step-5.png",
      prompt:
        "<p>You decide to use Git LFS locking for the level file. How do you enable this?</p><p><strong>How do you set up file locking?</strong></p>",
      choices: [
        {
          text: "Add <code>*.umap lockable</code> to your <code>.gitattributes</code> file, then use <code>git lfs lock YourLevel.umap</code> before editing.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Git LFS lockable attribute plus explicit lock command enables file locking.",
          next: "step-6",
        },
        {
          text: "Git automatically locks files when you start editing them.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Git doesn't auto-lock. You must mark files as lockable and explicitly lock.",
          next: "step-5",
        },
        {
          text: "Enable locking in the GitHub/GitLab web interface settings.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Server settings may be needed but .gitattributes and explicit lock are required.",
          next: "step-5",
        },
        {
          text: "Use a third-party Git GUI that supports automatic locking.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. GUI tools can help but underlying setup still needs .gitattributes.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "worldbuilding",
      title: "External Actor Conflicts",
      image_path: "assets/generated/OneFilePerActorMergeConflict/step-6.png",
      prompt:
        "<p>With level file locking, only external actor files conflict now. Two people edited the same building actor. How do you resolve this?</p><p><strong>How do you handle actor file conflicts?</strong></p>",
      choices: [
        {
          text: "For binary actor file conflicts, you must choose one version (ours or theirs). Coordinate with the other developer to manually re-apply lost changes after merge.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Binary files can't auto-merge. Pick one and manually reconcile.",
          next: "step-7",
        },
        {
          text: "Use a diff tool to see and merge the specific property changes.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Standard diff tools can't merge binary .uasset files. Manual coordination is needed.",
          next: "step-6",
        },
        {
          text: "Delete both versions and recreate the actor from scratch.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Deletion loses all work. Pick one version and re-apply changes.",
          next: "step-6",
        },
        {
          text: "Convert the actor to a Blueprint so it uses text-based source control.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Blueprints are still binary. OFPA workflow with coordination is the solution.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "worldbuilding",
      title: "Area Ownership Strategy",
      image_path: "assets/generated/OneFilePerActorMergeConflict/step-7.png",
      prompt:
        "<p>Binary file conflicts require manual coordination. What process prevents two people from editing the same actor?</p><p><strong>What workflow prevents actor conflicts?</strong></p>",
      choices: [
        {
          text: "Assign <strong>area ownership</strong>: divide the level into regions and each team member is responsible for their region's actors. Use Data Layers or naming conventions to track ownership.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Area ownership prevents overlap. Clear boundaries minimize conflicts.",
          next: "step-8",
        },
        {
          text: "Lock every individual actor file before editing.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Individual file locking is tedious with thousands of actors. Area ownership scales.",
          next: "step-7",
        },
        {
          text: "Schedule editing time slots so only one person edits the level at a time.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Time slots lose the parallel workflow benefits of OFPA.",
          next: "step-7",
        },
        {
          text: "Use a shared spreadsheet to track who is editing which actor.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Spreadsheets are manual and error-prone. Area ownership is more practical.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "worldbuilding",
      title: "Using Data Layers for Ownership",
      image_path: "assets/generated/OneFilePerActorMergeConflict/step-8.png",
      prompt:
        "<p>You want to use Data Layers to define team member regions. How does this help with version control?</p><p><strong>How do Data Layers help with OFPA workflow?</strong></p>",
      choices: [
        {
          text: "Data Layers group actors logically. Each team member edits only actors in their assigned layer. The layer name makes ownership clear in the file path.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Data Layers provide clear actor grouping that maps to team responsibilities.",
          next: "step-9",
        },
        {
          text: "Data Layers automatically prevent other users from editing locked layers.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Data Layers don't enforce permissions. They clarify ownership for manual coordination.",
          next: "step-8",
        },
        {
          text: "Data Layers merge actors into single files per layer to simplify locking.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. OFPA still creates per-actor files. Layers are organizational, not file-based.",
          next: "step-8",
        },
        {
          text: "Data Layers create separate Git branches for each layer automatically.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Git branches are manual. Data Layers clarify editor ownership.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "worldbuilding",
      title: "Commit Hygiene",
      image_path: "assets/generated/OneFilePerActorMergeConflict/step-9.png",
      prompt:
        "<p>What commit practices help prevent conflicts in OFPA projects?</p><p><strong>What commit habits minimize conflicts?</strong></p>",
      choices: [
        {
          text: "Commit frequently with small changes, pull before starting work, and communicate when editing shared areas or level-wide settings.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Frequent commits with current pulls minimize conflict windows.",
          next: "step-10",
        },
        {
          text: "Wait until a feature is complete before committing to reduce commit noise.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Large commits increase conflict risk. Small, frequent commits are safer.",
          next: "step-9",
        },
        {
          text: "Only one person commits at the end of each day to serialize changes.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Serialized commits lose collaboration benefits. Parallel work with small commits is better.",
          next: "step-9",
        },
        {
          text: "Use force push to overwrite conflicts with your version.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Force push destroys others' work. Never force push shared branches.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "worldbuilding",
      title: "Final Verification",
      image_path: "assets/generated/OneFilePerActorMergeConflict/step-10.png",
      prompt:
        "<p>You've set up locking and area ownership. How do you verify the workflow is effective?</p><p><strong>What confirms the workflow works?</strong></p>",
      choices: [
        {
          text: "Have two team members simultaneously edit different regions, commit, push, and pull to verify no conflicts occur when following the workflow.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Practical workflow testing confirms the process prevents conflicts.",
          next: "conclusion",
        },
        {
          text: "Review the .gitattributes file to ensure all patterns are correct.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Configuration review is good but practical testing validates behavior.",
          next: "step-10",
        },
        {
          text: "Check that all external actor files have the correct naming convention.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Naming is automatic. Test the actual workflow with team members.",
          next: "step-10",
        },
        {
          text: "Count the number of files in __ExternalActors__ to ensure OFPA is working.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. File count confirms OFPA but not conflict prevention. Test the workflow.",
          next: "step-10",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/OneFilePerActorMergeConflict/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've established a conflict-free OFPA workflow for your team.</p><h4>Key Takeaways:</h4><ul><li><strong>One File Per Actor</strong> — Stores actors in separate files but level metadata can still conflict</li><li><code>*.umap lockable</code> — Git LFS attribute for level file locking</li><li><code>git lfs lock</code> — Explicitly lock files before editing</li><li><strong>Area Ownership</strong> — Assign level regions to team members to prevent overlap</li><li><strong>Data Layers</strong> — Organize actors by team responsibility</li><li><strong>Frequent Commits</strong> — Small, regular commits minimize conflict windows</li></ul>",
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
