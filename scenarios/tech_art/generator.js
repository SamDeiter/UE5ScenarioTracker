window.SCENARIOS["GeneratorCrash"] = {
  id: "GeneratorCrash",
  category: "Procedural",
  meta: {
    expanded: true,
    title: "Generator Loop Crash",
    description:
      "Spawning 1000 actors freezes game. Investigates Time Slicing vs. Loops.",
    estimateHours: 1.0,
    difficulty: "Beginner",
    category: "Procedural",
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "GeneratorCrash",
      step: "setup",
    },
  ],
  fault: {
    description: "Game freezes when spawning 1000 actors in a For Loop.",
    visual_cue: "Complete frame freeze or crash when pressing spawn button",
  },
  expected: {
    description: "Smooth spawning over multiple frames using time slicing.",
    validation_action: "verify_smooth_spawn",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "GeneratorCrash",
      step: "conclusion",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "blueprints",
      title: "The Symptom",
      image_path: "assets/generated/generator/step-1.png",
      prompt:
        "You have a 'Generator' Blueprint designed to spawn 1000 items (like coins or debris) when a button is pressed. However, the moment you press the button, the game freezes for several seconds or crashes entirely. What do you check first?",
      choices: [
        {
          text: "Check the Blueprint logic for the loop structure",
          type: "correct",
          feedback:
            "You look at the Blueprint logic and see a simple 'For Loop' running from 1 to 1000, spawning an actor in every single iteration. Doing this all in one frame (synchronously) is overwhelming the game thread.",
          next: "step-2",
        },
        {
          text: "Reduce mesh complexity of spawned items",
          type: "wrong",
          feedback:
            "You try reducing the mesh complexity of the spawned item, thinking it's a rendering bottleneck. But the freeze happens even with empty actors. It's a logic/CPU spike, not a GPU issue.",
          next: "step-1",
        },
        {
          text: "Check GPU memory usage",
          type: "misguided",
          feedback:
            "GPU memory looks fine. The freeze is happening on the CPU's game thread before rendering even becomes an issue.",
          next: "step-1",
        },
        {
          text: "Disable physics on spawned actors",
          type: "misguided",
          feedback:
            "You disabled physics, but the freeze still occurs. The issue is the sheer number of spawn calls in a single frame, not the physics overhead.",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "blueprints",
      title: "Investigation",
      image_path: "assets/generated/generator/step-2.png",
      prompt:
        "You examine the 'For Loop' node. It's trying to execute 1000 SpawnActor calls within a single tick. What do you find is the root cause?",
      choices: [
        {
          text: "The loop blocks the game thread until all spawns complete",
          type: "correct",
          feedback:
            "You confirm that the loop is blocking the game thread until it finishes all 1000 spawns. This causes a massive frame spike (freeze) or a crash if the loop takes too long.",
          next: "step-3",
        },
        {
          text: "Increase Maximum Loop Iteration Count in Project Settings",
          type: "misguided",
          feedback:
            "You try increasing the 'Maximum Loop Iteration Count' in Project Settings. This might stop the crash, but it won't stop the freeze—you're still doing too much work in one frame.",
          next: "step-2",
        },
        {
          text: "The actors are too complex to spawn quickly",
          type: "wrong",
          feedback:
            "Even empty actors cause the same freeze. The complexity of the actors isn't the issue—it's the synchronous execution pattern.",
          next: "step-2",
        },
        {
          text: "Garbage collection is running during the spawn",
          type: "wrong",
          feedback:
            "GC isn't the primary issue here. The loop itself is blocking the game thread with too many operations in a single frame.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "blueprints",
      title: "The Fix",
      image_path: "assets/generated/generator/step-3.png",
      prompt:
        "You know the cause: spawning everything in one frame is too heavy. How do you fix it?",
      choices: [
        {
          text: "Use a Timer or Time Slicing to spread spawns across frames",
          type: "correct",
          feedback:
            "You replace the 'For Loop' with a Timer (e.g., 'Set Timer by Event') that spawns only a few items per tick, or you use a Delay node to batch spawns across multiple frames. This 'Time Slicing' approach keeps the frame rate smooth.",
          next: "step-4",
        },
        {
          text: "Use SpawnActorDeferred instead",
          type: "misguided",
          feedback:
            "While SpawnActorDeferred allows configuration before construction, the actual spawning still happens synchronously on the game thread. You still need time slicing.",
          next: "step-3",
        },
        {
          text: "Move spawning to a separate thread",
          type: "wrong",
          feedback:
            "SpawnActor must run on the game thread in Unreal Engine. Multi-threading isn't an option for spawning actors.",
          next: "step-3",
        },
        {
          text: "Use object pooling to reuse actors",
          type: "misguided",
          feedback:
            "Object pooling helps with repeated spawn/destroy cycles, but you still need to populate the pool over time—not all at once.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "blueprints",
      title: "Verification",
      image_path: "assets/generated/generator/step-4.png",
      prompt:
        "You implemented the timer/batching logic. How do you verify the fix?",
      choices: [
        {
          text: "Play in Editor and use stat unit to monitor frame times",
          type: "correct",
          feedback:
            "In PIE, you press the button. The items spawn in a rapid stream rather than appearing instantly, but the game remains perfectly responsive with no freeze. The 'stat unit' command shows stable game thread times.",
          next: "conclusion",
        },
        {
          text: "Just assume it works because there's no crash",
          type: "wrong",
          feedback:
            "You should always quantitatively verify with profiling tools. There could still be frame spikes even without crashes.",
          next: "step-4",
        },
        {
          text: "Check that all 1000 actors exist after spawning",
          type: "misguided",
          feedback:
            "Counting actors is useful, but doesn't tell you if the spawning was smooth. Use stat unit to verify frame times during spawn.",
          next: "step-4",
        },
        {
          text: "Run a PIE session and eyeball the framerate",
          type: "misguided",
          feedback:
            "Eyeballing can miss subtle issues. Use stat unit for precise frame time data.",
          next: "step-4",
        },
      ],
    },
    conclusion: {
      skill: "blueprints",
      title: "Scenario Complete",
      image_path: "assets/generated/generator/conclusion.png",
      prompt:
        "<p><strong>Well done!</strong></p><p>You've successfully diagnosed and fixed the game thread freeze caused by synchronous spawning.</p><h4>Key Takeaways:</h4><ul><li><strong>For Loops</strong> — Execute synchronously, blocking the game thread</li><li><strong>Time Slicing</strong> — Use Timers or Delays to spread work across frames</li><li><strong>stat unit</strong> — Always verify performance fixes with profiling</li><li><strong>SpawnActorDeferred</strong> — Doesn't solve synchronous execution</li></ul>",
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
