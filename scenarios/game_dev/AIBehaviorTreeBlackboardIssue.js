window.SCENARIOS["AIBehaviorTreeBlackboardIssue"] = {
  meta: {
    title: "AI Behavior Tree Stops Executing Due to Blackboard Key Mismatch",
    description:
      "An AI enemy stops moving and becomes unresponsive. The Behavior Tree was working previously but now the AI stands still after a recent blackboard key rename.",
    estimateHours: 1.0,
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
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. NavMesh issues cause pathing failures, not complete behavior tree halts. Check BT execution first.",
          next: "step-1",
        },
        {
          text: "Increase the AI's <code>Sight Radius</code> in the <strong>AI Perception</strong> component to ensure it can see targets.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Perception affects what the AI detects, not whether its behavior tree runs. Debug the tree directly.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "blueprints",
      title: "Analyzing the Debugger",
      image_path: "assets/generated/AIBehaviorTreeBlackboardIssue/step-2.png",
      prompt:
        "<p>The debugger shows the Behavior Tree stops at a <strong>Blackboard Decorator</strong> checking a key called <code>TargetActor</code>. The decorator shows <code>Invalid Key</code> status.</p><p><strong>What does this indicate?</strong></p>",
      choices: [
        {
          text: "The <code>TargetActor</code> key referenced in the decorator doesn't exist in the assigned <strong>Blackboard Asset</strong> or was renamed.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Decorators referencing non-existent keys fail silently, blocking execution of their branch.",
          next: "step-3",
        },
        {
          text: "The <code>TargetActor</code> variable is null at runtime, causing the decorator to fail.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Null values cause different behavior. 'Invalid Key' specifically means the key binding is broken.",
          next: "step-2",
        },
        {
          text: "The Behavior Tree asset needs to be recompiled after blackboard changes.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. BTs auto-compile. The issue is a key reference mismatch, not compilation status.",
          next: "step-2",
        },
        {
          text: "The AI Controller isn't using the correct Behavior Tree asset.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. The debugger shows the tree is running; the issue is within the tree's key references.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "blueprints",
      title: "Fixing the Key Reference",
      image_path: "assets/generated/AIBehaviorTreeBlackboardIssue/step-3.png",
      prompt:
        "<p>You open the <strong>Blackboard Asset</strong> and see the key was renamed from <code>TargetActor</code> to <code>EnemyTarget</code>. The Behavior Tree decorator still references the old name.</p><p><strong>What is the correct fix?</strong></p>",
      choices: [
        {
          text: "Update the <strong>Blackboard Decorator</strong> in the Behavior Tree to reference <code>EnemyTarget</code> instead of <code>TargetActor</code>.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Updating the decorator's key selector ensures it matches the current blackboard key name.",
          next: "step-4",
        },
        {
          text: "Rename the blackboard key back to <code>TargetActor</code> to avoid changing the Behavior Tree.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. This works but reverts the teammate's intentional rename. Updating the BT is cleaner.",
          next: "step-4",
        },
        {
          text: "Create a new key called <code>TargetActor</code> in addition to <code>EnemyTarget</code> for backwards compatibility.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.2hrs. Duplicate keys cause confusion. Pick one name and update all references to match.",
          next: "step-3",
        },
        {
          text: "Use a <code>Blackboard Key Redirect</code> in <strong>Project Settings</strong> to map old names to new ones.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. There's no built-in key redirect system. Direct reference updates are required.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "blueprints",
      title: "Checking Other References",
      image_path: "assets/generated/AIBehaviorTreeBlackboardIssue/step-4.png",
      prompt:
        "<p>You've fixed the decorator. Before testing, you want to ensure no other nodes reference the old key name.</p><p><strong>What is the most efficient way to find all broken references?</strong></p>",
      choices: [
        {
          text: "Use <strong>Find in Blueprints</strong> (Ctrl+Shift+F) to search for <code>TargetActor</code> across all assets in the project.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Global search finds all references including BT tasks, services, and Blueprints that access the blackboard.",
          next: "step-5",
        },
        {
          text: "Open each Behavior Tree node individually and check its <code>Blackboard Key</code> property.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.25hrs. Manual inspection works but is time-consuming. Global search is faster.",
          next: "step-4",
        },
        {
          text: "Run the game and check the <strong>Output Log</strong> for any blackboard-related warnings.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.15hrs. Broken key references don't always log warnings. Proactive search is more reliable.",
          next: "step-4",
        },
        {
          text: "Delete the Behavior Tree and recreate it from scratch to ensure all keys are correct.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +1.0hrs. Recreating is extremely wasteful. Use search to find and fix specific broken references.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "blueprints",
      title: "Verification",
      image_path: "assets/generated/AIBehaviorTreeBlackboardIssue/step-5.png",
      prompt:
        "<p>You've updated all references to use <code>EnemyTarget</code>. How do you verify the AI behavior is fully restored?</p><p><strong>What is the best verification approach?</strong></p>",
      choices: [
        {
          text: "Press <strong>Play in Editor</strong>, approach the AI, and use the <code>AI Debug</code> key to confirm the Behavior Tree executes through all expected branches.",
          type: "correct",
          feedback:
            "<strong>Optimal Time:</strong> +0.1hrs. Live debugging shows real-time execution flow and confirms the AI responds to stimuli correctly.",
          next: "conclusion",
        },
        {
          text: "Check that the Behavior Tree asset compiles without errors in the editor.",
          type: "plausible",
          feedback:
            "<strong>Extended Time:</strong> +0.05hrs. Compilation success doesn't guarantee runtime behavior. Test in PIE with debugger.",
          next: "step-5",
        },
        {
          text: "Review the <strong>Blackboard</strong> asset to confirm all keys are properly typed.",
          type: "misguided",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Key types matter, but actual gameplay testing verifies the complete system works.",
          next: "step-5",
        },
        {
          text: "Watch the AI from a distance without the debugger to see if it moves naturally.",
          type: "wrong",
          feedback:
            "<strong>Extended Time:</strong> +0.1hrs. Visual observation misses subtle issues. The debugger provides definitive execution confirmation.",
          next: "step-5",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/AIBehaviorTreeBlackboardIssue/conclusion.png",
      prompt:
        "<p><strong>Excellent work!</strong></p><p>You've resolved the AI Behavior Tree blackboard issue.</p><h4>Key Takeaways:</h4><ul><li><code>AI Debug</code> key (') — Opens runtime Behavior Tree debugger</li><li><strong>Blackboard Decorators</strong> — Fail silently when referencing non-existent keys</li><li><strong>Find in Blueprints</strong> — Efficiently locates all references to renamed keys</li><li><code>Invalid Key</code> status — Indicates key name mismatch between BT and Blackboard</li></ul>",
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
