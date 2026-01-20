window.SCENARIOS["LevelInstanceEditingBlocked"] = {
  meta: {
    title: "Level Instance Cannot Be Edited After Placement",
    description:
      "You placed a Level Instance in your World Partition level but can't modify its contents. The Edit button is grayed out and attempting to enter edit mode fails.",
    estimateHours: 1.25,
    difficulty: "Intermediate",
    category: "Worldbuilding",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "LevelInstanceEditingBlocked",
      step: "setup",
    },
  ],
  fault: {
    description: "Level Instance edit mode is blocked or grayed out",
    visual_cue:
      "'Edit' button in Details panel is disabled for Level Instance actor",
  },
  expected: {
    description:
      "Level Instance can be entered for editing and changes propagate correctly",
    validation_action: "verify_level_instance_edit",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "LevelInstanceEditingBlocked",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "worldbuilding",
      title: "Initial Observation",
      image_path: "assets/generated/LevelInstanceEditingBlocked/step-1.png",
      prompt:
        "<p>You placed a Level Instance containing a modular building kit. When you select it and look at the Details panel, the 'Edit' button is grayed out with a tooltip saying editing is not available.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Check if the Level Instance is a <strong>Packed Level Actor</strong> vs a standard <strong>Level Instance</strong>. Packed actors are baked and not directly editable.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Packed Level Actors are optimized, read-only representations. Type determines editability.",
          next: "step-2",
        },
        {
          text: "Check if you have write permissions on the source level file.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. File permissions can block saves but the Edit button being grayed suggests actor type issues.",
          next: "step-1",
        },
        {
          text: "Restart the editor to reset any locked states.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Restart rarely fixes configuration issues. Check the actor type first.",
          next: "step-1",
        },
        {
          text: "Delete and re-add the Level Instance from the Content Browser.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Re-adding might work but understanding why it's blocked helps prevent future issues.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "worldbuilding",
      title: "Understanding Level Instance Types",
      image_path: "assets/generated/LevelInstanceEditingBlocked/step-2.png",
      prompt:
        "<p>You confirm it's a <strong>Packed Level Actor</strong>. What distinguishes this from a regular Level Instance?</p><p><strong>What is a Packed Level Actor?</strong></p>",
      choices: [
        {
          text: "A <strong>Packed Level Actor</strong> converts the level's contents into a single optimized actor with merged geometry. It can't be edited because the source structure is baked.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Packed actors trade editability for performance. Use Level Instance for editable content.",
          next: "step-3",
        },
        {
          text: "Packed Level Actors are compressed versions of Level Instances for smaller file sizes.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. It's not about compression. Packed actors merge geometry for rendering efficiency.",
          next: "step-2",
        },
        {
          text: "Packed Level Actors are Level Instances that have been moved to a different folder.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Folder location doesn't affect actor type. It's a specific baked representation.",
          next: "step-2",
        },
        {
          text: "Packed Level Actors support multiplayer while Level Instances are single-player only.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Both support multiplayer. The difference is editability vs optimization.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "worldbuilding",
      title: "Converting to Level Instance",
      image_path: "assets/generated/LevelInstanceEditingBlocked/step-3.png",
      prompt:
        "<p>You need to edit this building. How do you convert the Packed Level Actor to an editable Level Instance?</p><p><strong>How do you make it editable?</strong></p>",
      choices: [
        {
          text: "Delete the Packed Level Actor and place the source level as a <strong>Level Instance</strong> instead by dragging it from the Content Browser with <code>Alt</code> held or using the right-click menu.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Replacing with a Level Instance restores editability while keeping the level reference.",
          next: "step-4",
        },
        {
          text: "Right-click the Packed Level Actor and select 'Convert to Level Instance'.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no direct conversion option. You must replace it with a Level Instance placement.",
          next: "step-3",
        },
        {
          text: "Enable 'Allow Editing' in the Packed Level Actor's properties.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Packed actors don't have an editing toggle. Replace with Level Instance.",
          next: "step-3",
        },
        {
          text: "Unpack the actor using 'Break Blueprint' functionality.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Break Blueprint is for Blueprint actors. Level instances have different workflows.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "worldbuilding",
      title: "Placing a Level Instance",
      image_path: "assets/generated/LevelInstanceEditingBlocked/step-4.png",
      prompt:
        "<p>You've deleted the Packed actor. How do you properly place an editable Level Instance?</p><p><strong>What is the correct placement method?</strong></p>",
      choices: [
        {
          text: "Drag the level asset from the <strong>Content Browser</strong> into the viewport. In the dialog that appears, select <code>Level Instance</code> as the spawn type.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The placement dialog lets you choose between Level Instance, Packed, and other types.",
          next: "step-5",
        },
        {
          text: "Double-click the level in Content Browser to open it as a sublevel.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Double-clicking opens the level for direct editing, not as an instance in another level.",
          next: "step-4",
        },
        {
          text: "Use the Place Actors panel to find the Level Instance actor type.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Place Actors panel doesn't have this. Drag from Content Browser instead.",
          next: "step-4",
        },
        {
          text: "Right-click in the level and select 'Add Level Instance' from the context menu.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no such context menu option. Drag from Content Browser.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "worldbuilding",
      title: "Entering Edit Mode",
      image_path: "assets/generated/LevelInstanceEditingBlocked/step-5.png",
      prompt:
        "<p>The Level Instance is placed and the Edit button is now available. How do you enter edit mode?</p><p><strong>How do you edit Level Instance contents?</strong></p>",
      choices: [
        {
          text: "Select the Level Instance and click the <code>Edit</code> button in the Details panel, or double-click the Level Instance in the viewport to enter edit mode.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Edit mode lets you modify the instance's contents while seeing the context of the parent level.",
          next: "step-6",
        },
        {
          text: "Open the source level separately in a new editor tab.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Separate editing works but you lose the context of where the instance is placed.",
          next: "step-5",
        },
        {
          text: "Use the Outliner to expand the Level Instance and select individual actors.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The Outliner shows the instance as one actor until you enter edit mode.",
          next: "step-5",
        },
        {
          text: "Right-click the Level Instance and select 'Open Level for Editing'.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Use the Details panel Edit button or double-click for in-context editing.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "worldbuilding",
      title: "Understanding Edit Mode",
      image_path: "assets/generated/LevelInstanceEditingBlocked/step-6.png",
      prompt:
        "<p>You're now in Level Instance edit mode. The rest of the level is grayed out. What does this mode allow?</p><p><strong>What can you do in edit mode?</strong></p>",
      choices: [
        {
          text: "Edit mode lets you modify, add, or remove actors within the Level Instance. Changes affect all instances of this level throughout your project.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Level Instance edits propagate to all usages, making it great for modular content.",
          next: "step-7",
        },
        {
          text: "Edit mode only affects this specific instance; other placements are unchanged.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Standard Level Instances share changes. Override requires different workflows.",
          next: "step-6",
        },
        {
          text: "Edit mode is read-only, allowing you to inspect but not modify contents.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Edit mode is fully writable. You can modify all contents.",
          next: "step-6",
        },
        {
          text: "Edit mode only allows moving actors, not adding or deleting them.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Edit mode supports full modifications including add, delete, and property changes.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "worldbuilding",
      title: "Making Changes",
      image_path: "assets/generated/LevelInstanceEditingBlocked/step-7.png",
      prompt:
        "<p>You add a new door to the building inside the Level Instance. How do you save and exit edit mode?</p><p><strong>How do you commit changes?</strong></p>",
      choices: [
        {
          text: "Click <code>Commit</code> in the Level Instance editing toolbar to save changes to the source level and exit edit mode.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Commit saves all changes to the source level and returns to normal editing.",
          next: "step-8",
        },
        {
          text: "Press Ctrl+S to save, then double-click outside the instance to exit.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Ctrl+S saves but the proper workflow uses the Commit button for clarity.",
          next: "step-7",
        },
        {
          text: "Click the X button on the Level Instance in the Outliner.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no X button for this. Use the Commit button in the toolbar.",
          next: "step-7",
        },
        {
          text: "Close the editor; it will prompt to save the instance changes.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Closing works but is disruptive. Use the Commit button within your workflow.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "worldbuilding",
      title: "Discard Option",
      image_path: "assets/generated/LevelInstanceEditingBlocked/step-8.png",
      prompt:
        "<p>You realize the door placement was wrong. Instead of committing, what's the alternative?</p><p><strong>How do you abandon changes?</strong></p>",
      choices: [
        {
          text: "Click <code>Discard</code> in the Level Instance editing toolbar to abandon all changes and restore the original state.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.05hrs. Discard throws away edit session changes without affecting the source level.",
          next: "step-9",
        },
        {
          text: "Use Ctrl+Z to undo all changes, then Commit.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Undo works but Discard is more direct for abandoning an entire edit session.",
          next: "step-8",
        },
        {
          text: "Delete the Level Instance and place it again fresh.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Replacing is overkill. Discard cleanly abandons uncommitted changes.",
          next: "step-8",
        },
        {
          text: "Close the editor without saving to lose the changes.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Editor close might still prompt. Discard is the explicit abandon action.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "worldbuilding",
      title: "Instance-Specific Overrides",
      image_path: "assets/generated/LevelInstanceEditingBlocked/step-9.png",
      prompt:
        "<p>What if you want to modify just THIS instance without affecting other placements of the same level?</p><p><strong>How do you create instance-specific changes?</strong></p>",
      choices: [
        {
          text: "Use <strong>Property Overrides</strong> on the Level Instance actor to change specific actor properties without modifying the source level.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Property Overrides let you customize individual instances while sharing the base content.",
          next: "step-10",
        },
        {
          text: "Duplicate the source level and reference the copy for this instance.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Duplication works but loses the shared-content benefit. Use overrides instead.",
          next: "step-9",
        },
        {
          text: "Convert to Packed Level Actor for independent changes.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Packed actors can't be edited. Overrides provide per-instance customization.",
          next: "step-9",
        },
        {
          text: "Unlink this instance from the source level.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no unlink feature. Use Property Overrides for instance customization.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "worldbuilding",
      title: "Checking Other Instances",
      image_path: "assets/generated/LevelInstanceEditingBlocked/step-10.png",
      prompt:
        "<p>You've committed changes to the Level Instance. How do you verify that other instances in the project are updated?</p><p><strong>How do you verify propagation?</strong></p>",
      choices: [
        {
          text: "Navigate to another level containing the same Level Instance and verify the changes (like the new door) appear there automatically.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Level Instance changes propagate to all usages automatically after commit.",
          next: "step-11",
        },
        {
          text: "Run a 'Refresh All Level Instances' command from the Build menu.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. There's no manual refresh needed. Changes propagate on commit.",
          next: "step-10",
        },
        {
          text: "Reload each level containing the instance to pick up changes.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Reload can help in edge cases but normally changes are immediate.",
          next: "step-10",
        },
        {
          text: "Re-save all levels that use this Level Instance.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Re-saving may be needed for packaging but changes show in editor immediately.",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "worldbuilding",
      title: "Source Control Consideration",
      image_path: "assets/generated/LevelInstanceEditingBlocked/step-11.png",
      prompt:
        "<p>Working with a team, what should you be aware of when editing Level Instances?</p><p><strong>What's important for team workflows?</strong></p>",
      choices: [
        {
          text: "The source level must be checked out before you can commit changes. Coordinate with team members who might also need to edit the same Level Instance source.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Source control locks on the source level prevent simultaneous edits and merge conflicts.",
          next: "step-12",
        },
        {
          text: "Level Instances are automatically locked when you enter edit mode.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Auto-locking may work in some setups but explicit checkout is safer.",
          next: "step-11",
        },
        {
          text: "Each team member gets their own copy of the Level Instance source.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Shared source is the point. Coordinate edits via source control.",
          next: "step-11",
        },
        {
          text: "Level Instance changes don't need source control; they're stored locally.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Changes modify the source level file which needs versioning.",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "worldbuilding",
      title: "Final Verification",
      image_path: "assets/generated/LevelInstanceEditingBlocked/step-12.png",
      prompt:
        "<p>Your Level Instance workflow is set up correctly. What's the final verification that everything works?</p><p><strong>What confirms a complete setup?</strong></p>",
      choices: [
        {
          text: "Verify you can enter edit mode, make a test change, commit it, and see the change reflected in all instances of that level in your project.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. End-to-end testing confirms the complete Level Instance workflow.",
          next: "conclusion",
        },
        {
          text: "Check that the Level Instance actor shows correct properties in the Details panel.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Properties are important but full workflow testing is more comprehensive.",
          next: "step-12",
        },
        {
          text: "Confirm the source level file size increased after adding content.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. File size is an indirect indicator. Test the actual editing workflow.",
          next: "step-12",
        },
        {
          text: "Review the Output Log for Level Instance messages.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Logs help debugging but visual workflow verification is the goal.",
          next: "step-12",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path: "assets/generated/LevelInstanceEditingBlocked/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've resolved Level Instance editing issues and understand the workflow.</p><h4>Key Takeaways:</h4><ul><li><strong>Level Instance</strong> vs <strong>Packed Level Actor</strong> — Instances are editable, Packed are optimized/read-only</li><li><code>Edit Mode</code> — Enter via Details panel button or double-click</li><li><code>Commit</code> — Saves changes to source level; propagates to all instances</li><li><code>Discard</code> — Abandons uncommitted changes</li><li><strong>Property Overrides</strong> — Per-instance customization without modifying source</li><li><strong>Source Control</strong> — Coordinate team edits on source level files</li></ul>",
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
