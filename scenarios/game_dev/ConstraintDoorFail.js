window.SCENARIOS["ConstraintDoorFail"] = {
  id: "ConstraintDoorFail",
  category: "Physics & Collisions",
  meta: {
    title: "Immovable Physics Constrained Skeletal Mesh Door",
    category: "Physics & Collisions",
    description:
      "A steel door anchored to a static frame using a Physics Constraint component refuses to break despite being hit by a massive explosion. It should realistically break and ragdoll.",
    estimateHours: 1.5,
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "ConstraintDoorFail",
      step: "step-1",
    },
  ],
  fault: {
    description:
      "The door remains anchored despite massive force. Collision and constraint thresholds are misconfigured.",
    visual_cue: "Unreactive door in explosion",
  },
  expected: {
    description:
      "The door breaks its constraints and ragdolls upon explosion impact.",
    validation_action: "verify_door_breakage",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "ConstraintDoorFail",
      step: "step-18",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "physicscollisions",
      title: "Observe Initial Behavior",
      prompt:
        "<p>The large steel door barely moves after a massive explosion. Nearby static props react correctly, but the door remains anchored. How do you begin investigating why the door ignores the force?</p>",
      choices: [
        {
          text: "<p>Open the <strong>Door Blueprint</strong> to examine its components and internal logic.</p>",
          type: "correct",
          feedback:
            "<p>Good start. Starting with the door's Blueprint is the most direct way to access its specific configuration and behavior.</p>",
          next: "step-2",
        },
        {
          text: "<p>Review <strong>Project Settings > Physics</strong></p>",
          type: "plausible",
          feedback:
            "<p>A bit too broad. Likely a component-specific issue.</p>",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "physicscollisions",
      title: "Inspect Skeletal Mesh Physics Setting",
      prompt:
        "<p>Inside the Door Blueprint, which component's physics settings are most relevant for a ragdoll/breakaway effect?</p>",
      choices: [
        {
          text: "<p>Select the <strong>Skeletal Mesh</strong> component and inspect its Details panel.</p>",
          type: "correct",
          feedback: "The Skeletal Mesh is the primary physical representation.",
          next: "step-3",
        },
      ],
    },
    "step-3": {
      skill: "physicscollisions",
      title: "Confirm Skeletal Mesh Simulate Physics State",
      prompt:
        "<p>Within the Skeletal Mesh component's Details panel, what do you observe regarding its physics simulation?</p>",
      choices: [
        {
          text: "<p>Observe that <code>Simulate Physics</code> is currently disabled.</p>",
          type: "correct",
          feedback: "Expected when a Physics Constraint is holding it.",
          next: "step-4",
        },
      ],
    },
    "step-4": {
      skill: "blueprintlogic",
      title: "Investigate Explosion Blueprint Logic",
      prompt:
        "<p>The door isn't simulating physics. Other props react. How do you verify the explosion force targets the door?</p>",
      choices: [
        {
          text: "<p>Locate the <strong>Blueprint</strong> responsible for triggering the explosion.</p>",
          type: "correct",
          feedback: "Critical for understanding force application.",
          next: "step-5",
        },
      ],
    },
    "step-5": {
      skill: "blueprintlogic",
      title: "Confirm Radial Force Component Activation",
      prompt: "<p>How do you confirm the Radial Force component is active?</p>",
      choices: [
        {
          text: "<p>Confirm activation upon event trigger.</p>",
          type: "correct",
          feedback: "Verifying activation ensures force generation.",
          next: "step-6",
        },
      ],
    },
    "step-6": {
      skill: "physicscollisions",
      title: "Examine Radial Force Strength",
      prompt:
        "<p>What properties ensure the force is numerically strong enough?</p>",
      choices: [
        {
          text: "<p>Check <code>Force Strength</code> and <code>Impulse Strength</code>.</p>",
          type: "correct",
          feedback: "Directly controls magnitude.",
          next: "step-7",
        },
      ],
    },
    "step-7": {
      skill: "physicscollisions",
      title: "Identify Radial Force Channel",
      prompt:
        "<p>What setting determines which object types it interacts with?</p>",
      choices: [
        {
          text: "<p>Identify the <code>Force Channel</code> (set to Visibility).</p>",
          type: "correct",
          feedback: "Dictates the trace/query channel.",
          next: "step-8",
        },
      ],
    },
    "step-8": {
      skill: "physicscollisions",
      title: "Check Door Skeletal Mesh Collision Settings",
      prompt:
        "<p>Where do you check how the door responds to the Visibility channel?</p>",
      choices: [
        {
          text: "<p>Navigator to the <strong>Collision</strong> settings of the Skeletal Mesh.</p>",
          type: "correct",
          feedback: "Collision settings determine interaction responses.",
          next: "step-9",
        },
      ],
    },
    "step-9": {
      skill: "physicscollisions",
      title: "Verify Collision Response to Visibility Channel",
      prompt: "<p>What setting are you looking for regarding Visibility?</p>",
      choices: [
        {
          text: "<p>Verify response is set to <code>Ignore</code>.</p>",
          type: "correct",
          feedback: "This prevents force application.",
          next: "step-10",
        },
      ],
    },
    "step-10": {
      skill: "physicscollisions",
      title: "Correct Collision Response for Visibility",
      prompt:
        "<p>The door's Skeletal Mesh is ignoring the Visibility channel. What action do you take?</p>",
      onEnter: [
        {
          action: "set_ue_property",
          scenario: "ConstraintDoorFail",
          step: "step-10",
        },
      ],
      choices: [
        {
          text: "<p>Change response to <strong>Block</strong>.</p>",
          type: "correct",
          feedback:
            "Correct. This allows the Radial Force trace to register a hit.",
          next: "step-11",
        },
      ],
    },
    "step-11": {
      skill: "testing",
      title: "Test Collision Fix",
      prompt: "<p>What's your immediate next action?</p>",
      choices: [
        {
          text: "Test explosion in editor.",
          type: "correct",
          feedback: "Confirms the effect of the change.",
          next: "step-12",
        },
      ],
    },
    "step-12": {
      skill: "physicscollisions",
      title: "Locate Physics Constraint Component",
      prompt:
        "<p>Which component anchors the door and needs breakage configuration?</p>",
      choices: [
        {
          text: "Select the <strong>Physics Constraint</strong> component.",
          type: "correct",
          feedback: "Responsible for connecting/breaking.",
          next: "step-13",
        },
      ],
    },
    "step-13": {
      skill: "physicscollisions",
      title: "Access Constraint Limits",
      prompt: "<p>Where in Details do you find breakage settings?</p>",
      choices: [
        {
          text: "Navigate to <strong>Constraint Limits</strong>.",
          type: "correct",
          feedback: "Contains options for breakage behavior.",
          next: "step-14",
        },
      ],
    },
    "step-14": {
      skill: "physicscollisions",
      title: "Enable Constraint Breakable Option",
      prompt:
        "<p>In the Constraint Limits, you notice `Breakable` is unchecked. Enable it?</p>",
      onEnter: [
        {
          action: "set_ue_property",
          scenario: "ConstraintDoorFail",
          step: "step-14",
        },
      ],
      choices: [
        {
          text: "Enable Breakable checkbox.",
          type: "correct",
          feedback: "Essential for allowing the connection to be destroyed.",
          next: "step-15",
        },
      ],
    },
    "step-15": {
      skill: "physicscollisions",
      title: "Review Linear Breakable Force",
      prompt:
        "<p>What property determines the *linear force* required to break?</p>",
      choices: [
        {
          text: "Examine <code>Linear Breakable Force</code>.",
          type: "correct",
          feedback: "Sets threshold for linear force.",
          next: "step-16",
        },
      ],
    },
    "step-16": {
      skill: "physicscollisions",
      title: "Adjust Linear Breakable Force",
      prompt:
        "<p>Threshold is too high (1,000,000,000). Adjust for massive explosion?</p>",
      onEnter: [
        {
          action: "set_ue_property",
          scenario: "ConstraintDoorFail",
          step: "step-16",
        },
      ],
      choices: [
        {
          text: "Lower value to 50,000.",
          type: "correct",
          feedback: "Impulse can now overcome the threshold.",
          next: "step-17",
        },
      ],
    },
    "step-17": {
      skill: "physicscollisions",
      title: "Review Angular Breakable Torque",
      prompt: "<p>What rotational equivalent also needs review?</p>",
      choices: [
        {
          text: "Examine <code>Angular Breakable Torque</code>.",
          type: "correct",
          feedback: "Dictates rotational force threshold.",
          next: "step-18",
        },
      ],
    },
    "step-18": {
      skill: "physicscollisions",
      title: "Adjust Angular Breakable Torque",
      prompt:
        "<p>The threshold is too high. Adjust it to a realistic value?</p>",
      onEnter: [
        {
          action: "set_ue_property",
          scenario: "ConstraintDoorFail",
          step: "step-18",
        },
      ],
      choices: [
        {
          text: "Set to 100,000.",
          type: "correct",
          feedback: "Perfect. The door will now fully break free.",
          next: "step-19",
        },
      ],
    },
    "step-19": {
      skill: "testing",
      title: "Final Testing and Verification",
      prompt: "<p>Both forces configured. Final step?</p>",
      choices: [
        {
          text: "Final test in editor.",
          type: "correct",
          feedback: "Confirms all changes work together.",
          next: "conclusion",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      prompt:
        "<p>The door now breaks and ragdolls correctly. You've mastered Physics Constraints!</p>",
      choices: [
        {
          text: "Finish",
          type: "correct",
          next: "end",
        },
      ],
    },
  },
};
