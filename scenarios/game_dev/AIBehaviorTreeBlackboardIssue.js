window.SCENARIOS["AIBehaviorTreeBlackboardIssue"] = {
  meta: {
    title: "AI Behavior Tree Stops Executing Due to Blackboard Key Mismatch",
    description:
      "An AI enemy stops moving and becomes unresponsive. The Behavior Tree was working previously but now the AI stands still after a recent blackboard key rename.",
    estimateHours: 1.5,
    difficulty: "Intermediate",
    category: "Blueprints",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "AIBehaviorTreeBlackboardIssue",
      step: "setup",
    },
  ],
  fault: {
    description: "Behavior Tree execution halts due to blackboard mismatch",
    visual_cue: "AI character stands still, not responding to stimuli",
  },
  expected: {
    description: "AI executes behavior tree and responds appropriately",
    validation_action: "verify_ai_behavior",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "AIBehaviorTreeBlackboardIssue",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "blueprints",
      title: "Initial Observation",
      image_path: "assets/generated/AIBehaviorTreeBlackboardIssue/step-1.png",
      prompt:
        "<p>Your enemy AI character stands completely still during gameplay. Previously, it patrolled and chased the player correctly. A teammate recently renamed some <strong>Blackboard</strong> keys.</p><p><strong>What is your first diagnostic step?</strong></p>",
      choices: [
        {
          text: "Open the <strong>Behavior Tree</strong> debugger by selecting the AI and using <code>AI Debug</code> key (apostrophe) to see execution state.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The AI debugger shows which nodes are executing and where the tree is stuck or failing.",
          next: "step-2",
        },
        {
          text: "Check the AI Controller Blueprint's <code>BeginPlay</code> to ensure <code>Run Behavior Tree</code> is called.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. If the tree ran before, the run call is likely fine. The issue is post-startup execution, not initialization.",
          next: "step-1",
        },
        {
          text: "Verify the <strong>NavMesh</strong> covers the area where the AI is standing.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. NavMesh issues cause pathing failures, not complete behavior tree halts. Check BT execution first.",
          next: "step-1",
        },
        {
          text: "Increase the AI's <code>Sight Radius</code> in the <strong>AI Perception</strong> component to ensure it can see targets.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Perception affects what the AI detects, not whether its behavior tree runs. Debug the tree directly.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "blueprints",
      title: "Understanding the AI Debug View",
      image_path: "assets/generated/AIBehaviorTreeBlackboardIssue/step-2.png",
      prompt:
        "<p>You press the <code>apostrophe</code> key while the AI is selected. The debug overlay appears showing the Behavior Tree. What information should you look for?</p><p><strong>What indicates where the problem is?</strong></p>",
      choices: [
        {
          text: "Look for nodes with <strong>red outlines</strong> or <code>Failed</code> status, particularly at <strong>Decorator</strong> nodes that gate branch execution.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Failed decorators block their entire branch. Red highlighting shows where execution stopped.",
          next: "step-3",
        },
        {
          text: "Check the <strong>Blackboard</strong> panel values to see what data the AI currently has.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Blackboard values are useful, but first identify which node is failing to focus your investigation.",
          next: "step-2",
        },
        {
          text: "Count how many nodes are highlighted green to see how far execution progresses.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Green nodes show successful execution, but focusing on where it stops (red) is more diagnostic.",
          next: "step-2",
        },
        {
          text: "Look at the <strong>Service</strong> nodes to see if they're updating properly.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Services run in parallel and rarely cause complete halts. Check decorator failures first.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "blueprints",
      title: "Analyzing the Failed Decorator",
      image_path: "assets/generated/AIBehaviorTreeBlackboardIssue/step-3.png",
      prompt:
        "<p>The debugger shows the Behavior Tree stops at a <strong>Blackboard Decorator</strong> checking a key called <code>TargetActor</code>. The decorator shows <code>Invalid Key</code> status instead of True or False.</p><p><strong>What does 'Invalid Key' specifically indicate?</strong></p>",
      choices: [
        {
          text: "The <code>TargetActor</code> key referenced in the decorator doesn't exist in the assigned <strong>Blackboard Asset</strong> — it was likely renamed or deleted.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. 'Invalid Key' means the key binding is broken, not that the value is null or empty.",
          next: "step-4",
        },
        {
          text: "The <code>TargetActor</code> variable is null at runtime, causing the decorator to fail its condition.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. A null value would show 'Is Not Set' or fail the condition, not 'Invalid Key'. The key itself is missing.",
          next: "step-3",
        },
        {
          text: "The Behavior Tree asset needs to be recompiled after the blackboard was modified.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. BTs auto-compile when opened. 'Invalid Key' specifically means the key reference is broken.",
          next: "step-3",
        },
        {
          text: "The AI Controller isn't using the correct Blackboard asset for this Behavior Tree.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. If the wrong blackboard was assigned, many keys would be invalid. Focus on the specific renamed key.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "blueprints",
      title: "Locating the Blackboard Asset",
      image_path: "assets/generated/AIBehaviorTreeBlackboardIssue/step-4.png",
      prompt:
        "<p>You need to compare the Behavior Tree's expected key with the actual Blackboard Asset. How do you find which Blackboard is assigned to this Behavior Tree?</p><p><strong>Where do you check?</strong></p>",
      choices: [
        {
          text: "Open the <strong>Behavior Tree</strong> asset and check the <code>Blackboard Asset</code> property in the <strong>Details Panel</strong> of the root node.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The BT root specifies which Blackboard it expects. This shows you exactly which asset to examine.",
          next: "step-5",
        },
        {
          text: "Check the AI Controller's <code>Run Behavior Tree</code> node for the Blackboard reference.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The controller runs the BT, but the Blackboard is defined in the BT asset itself.",
          next: "step-4",
        },
        {
          text: "Look in <strong>Project Settings</strong> > <strong>AI</strong> for the default Blackboard configuration.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. There's no global Blackboard setting. Each BT specifies its own Blackboard asset.",
          next: "step-4",
        },
        {
          text: "Search the Content Browser for all Blackboard assets and open each one.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. This works but is inefficient. The BT's root node directly references its Blackboard.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "blueprints",
      title: "Examining the Blackboard Keys",
      image_path: "assets/generated/AIBehaviorTreeBlackboardIssue/step-5.png",
      prompt:
        "<p>You open the <strong>Blackboard Asset</strong> and see a key called <code>EnemyTarget</code> of type <code>Object (Actor)</code>. There's no key called <code>TargetActor</code>.</p><p><strong>What likely happened?</strong></p>",
      choices: [
        {
          text: "A teammate renamed <code>TargetActor</code> to <code>EnemyTarget</code> in the Blackboard, but the Behavior Tree decorator still references the old name.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Blackboard key renames don't automatically update BT references. Manual updates are required.",
          next: "step-6",
        },
        {
          text: "The Blackboard was replaced with a different asset that uses different key names.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Possible, but a simple rename within the same asset is more common. Check with your teammate.",
          next: "step-5",
        },
        {
          text: "The key type was changed from <code>Object</code> to something else, breaking the reference.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Type changes cause different errors. The key name itself is what's mismatched.",
          next: "step-5",
        },
        {
          text: "The Blackboard asset is corrupted and needs to be recreated.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Asset corruption is rare. A simple key rename is the obvious explanation.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "blueprints",
      title: "Fixing the Decorator Reference",
      image_path: "assets/generated/AIBehaviorTreeBlackboardIssue/step-6.png",
      prompt:
        "<p>You need to update the <strong>Blackboard Decorator</strong> to use the new key name <code>EnemyTarget</code> instead of <code>TargetActor</code>.</p><p><strong>What is the correct fix?</strong></p>",
      choices: [
        {
          text: "Select the decorator in the Behavior Tree, find the <code>Blackboard Key</code> property, and change its selection from <code>TargetActor</code> to <code>EnemyTarget</code>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. The decorator's key selector dropdown shows all available keys. Simply reselect the correct one.",
          next: "step-7",
        },
        {
          text: "Rename the Blackboard key back to <code>TargetActor</code> to avoid changing the Behavior Tree.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. This works but reverts your teammate's intentional rename. Coordinate changes instead.",
          next: "step-6",
        },
        {
          text: "Delete the decorator and create a new one with the correct key reference.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Deletion is unnecessary. Simply update the existing decorator's key property.",
          next: "step-6",
        },
        {
          text: "Create a duplicate key called <code>TargetActor</code> that references the same data as <code>EnemyTarget</code>.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Duplicate keys cause confusion. Use one consistent name across all references.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "blueprints",
      title: "Searching for Other Broken References",
      image_path: "assets/generated/AIBehaviorTreeBlackboardIssue/step-7.png",
      prompt:
        "<p>You've fixed the decorator. Before testing, you realize other nodes in the Behavior Tree might also reference <code>TargetActor</code>.</p><p><strong>What is the most efficient way to find all broken references?</strong></p>",
      choices: [
        {
          text: "Use <strong>Find in Blueprints</strong> (Ctrl+Shift+F) to search for <code>TargetActor</code> across all assets in the project.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Global search finds all references in BT tasks, services, decorators, and any Blueprints accessing the blackboard.",
          next: "step-8",
        },
        {
          text: "Manually expand every node in the Behavior Tree and check each one's Blackboard Key property.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Manual inspection works but is slow and error-prone. Global search is faster and more thorough.",
          next: "step-7",
        },
        {
          text: "Run the game and wait for other <code>Invalid Key</code> errors to appear in the debugger.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.3hrs. Waiting for runtime errors is reactive. Proactive search finds all issues at once.",
          next: "step-7",
        },
        {
          text: "Check only the <strong>Tasks</strong> in the Behavior Tree since those access the Blackboard.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Tasks do access the Blackboard, but so do Services and Decorators. Search all asset types.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "blueprints",
      title: "Updating Additional References",
      image_path: "assets/generated/AIBehaviorTreeBlackboardIssue/step-8.png",
      prompt:
        "<p>The global search finds <code>TargetActor</code> referenced in two more places: a <strong>BTTask_MoveToTarget</strong> custom task and a <strong>BTService_UpdateTarget</strong> service.</p><p><strong>How do you fix these?</strong></p>",
      choices: [
        {
          text: "Open each asset, find the <code>Blackboard Key Selector</code> variables, and update them to use <code>EnemyTarget</code> in the Details Panel.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Custom BT nodes expose key selectors as properties. Update each one to the new key name.",
          next: "step-9",
        },
        {
          text: "Delete the custom task and service, then recreate them with the new key references.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.5hrs. Recreating is wasteful. Simply update the key selector properties in each asset.",
          next: "step-8",
        },
        {
          text: "Update the key name in the <code>GetBlackboardKeyByName</code> string parameter if using C++.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. String-based access exists but Blueprint exposes dropdown selectors. Check the Blueprint first.",
          next: "step-8",
        },
        {
          text: "Create a redirect in the Blackboard that maps the old name to the new name automatically.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Blackboards don't support key redirects. Direct reference updates are required.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "blueprints",
      title: "Checking Blueprint References",
      image_path: "assets/generated/AIBehaviorTreeBlackboardIssue/step-9.png",
      prompt:
        "<p>You've updated the BT nodes. The search also found <code>TargetActor</code> in the AI Controller Blueprint where Blackboard values are set.</p><p><strong>Where in the AI Controller do you need to update the key name?</strong></p>",
      choices: [
        {
          text: "Find <code>Set Value as Object</code> nodes that write to the Blackboard and update their <strong>Key Name</strong> parameter from <code>TargetActor</code> to <code>EnemyTarget</code>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Blackboard Set nodes use key names to specify where to write. Update all instances.",
          next: "step-10",
        },
        {
          text: "Update the <code>Get Blackboard Component</code> node to return the correct Blackboard type.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. The component is fine. Update the key name strings in Set/Get Value nodes.",
          next: "step-9",
        },
        {
          text: "Check the AI Perception component's <code>On Target Perception Updated</code> event for the set call.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. This might be where the set occurs, but focus on the actual Set Value nodes found by search.",
          next: "step-9",
        },
        {
          text: "Modify the <code>Run Behavior Tree</code> node to pass the correct key mapping.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Run Behavior Tree doesn't handle individual keys. Update the Set Value nodes directly.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "blueprints",
      title: "Initial Test",
      image_path: "assets/generated/AIBehaviorTreeBlackboardIssue/step-10.png",
      prompt:
        "<p>All references are updated. You press <strong>Play in Editor</strong> and the AI starts moving again! However, it's patrolling but not chasing the player.</p><p><strong>What should you investigate?</strong></p>",
      choices: [
        {
          text: "Check if the <strong>AI Perception</strong> component is correctly detecting the player and writing to the <code>EnemyTarget</code> key.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Patrol works but chase doesn't suggests target detection/assignment is the issue.",
          next: "step-11",
        },
        {
          text: "Verify the patrol points are correctly placed in the level.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Patrol is already working. The issue is transitioning to chase behavior.",
          next: "step-10",
        },
        {
          text: "Increase the AI's movement speed to ensure it can catch the player.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Speed affects how fast it chases, not whether it chases. Check target detection.",
          next: "step-10",
        },
        {
          text: "Check if the chase behavior has a higher priority than patrol in the Behavior Tree.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Priority matters, but if the target isn't set, chase won't trigger regardless of priority.",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "blueprints",
      title: "Debugging Target Assignment",
      image_path: "assets/generated/AIBehaviorTreeBlackboardIssue/step-11.png",
      prompt:
        "<p>You check the AI Controller's perception handling. The <code>On Target Perception Updated</code> event fires, but the key being set is still <code>TargetActor</code> in one remaining place.</p><p><strong>What do you do?</strong></p>",
      choices: [
        {
          text: "Update this final <code>Set Value as Object</code> node to write to <code>EnemyTarget</code> instead of <code>TargetActor</code>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. This was the remaining broken reference. Now all blackboard access uses the correct key name.",
          next: "step-12",
        },
        {
          text: "Add a <code>Print String</code> to log when the event fires and what actor was detected.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Logging helps debug but doesn't fix the wrong key name. Update the Set node first.",
          next: "step-11",
        },
        {
          text: "Disable and re-enable the AI Perception component to reset its state.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Component state isn't the issue. The key name in the Set node is wrong.",
          next: "step-11",
        },
        {
          text: "Check if perception is detecting the player's Pawn or Player Controller.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Detection target type matters but isn't relevant when the key name is simply wrong.",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "blueprints",
      title: "Final Verification",
      image_path: "assets/generated/AIBehaviorTreeBlackboardIssue/step-12.png",
      prompt:
        "<p>All references are now updated. How do you thoroughly verify the AI behavior is fully restored?</p><p><strong>What is the best verification approach?</strong></p>",
      choices: [
        {
          text: "Press <strong>Play in Editor</strong>, approach the AI, and use the <code>AI Debug</code> key to confirm the Behavior Tree executes through patrol, detection, and chase branches.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.15hrs. Testing all behavior states with the debugger confirms the complete fix.",
          next: "conclusion",
        },
        {
          text: "Check that all Behavior Tree assets compile without errors.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Compilation success doesn't guarantee runtime behavior. Test in PIE with the debugger.",
          next: "step-12",
        },
        {
          text: "Review the Blackboard asset one more time to confirm all keys are present.",
          type: "subtle",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. The Blackboard was never the problem—references to it were. Runtime testing is needed.",
          next: "step-12",
        },
        {
          text: "Watch the AI visually without the debugger to see if its behavior looks natural.",
          type: "obvious",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Visual observation can miss subtle issues. The AI debugger shows definitive execution flow.",
          next: "step-12",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/AIBehaviorTreeBlackboardIssue/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've resolved the AI Behavior Tree blackboard issue and understand how key references work across the AI system.</p><h4>Key Takeaways:</h4><ul><li><code>AI Debug</code> key (') — Opens runtime Behavior Tree debugger showing execution flow</li><li><code>Invalid Key</code> status — Indicates key name mismatch, not null value</li><li><strong>Blackboard Decorators</strong> — Fail silently when referencing non-existent keys</li><li><strong>Find in Blueprints</strong> (Ctrl+Shift+F) — Essential for finding all references to renamed keys</li><li><strong>Key Selectors</strong> — Used in Tasks, Services, Decorators, and controller Blueprints</li><li><code>Set Value as Object</code> — Common node for writing Actor references to Blackboard</li></ul>",
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
