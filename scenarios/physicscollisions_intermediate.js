
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['ConstraintDoorFail'] = {
    meta: {
        title: "Immovable Physics Constrained Skeletal Mesh Door",
        description: "We have a large, modular steel door modeled as a Skeletal Mesh, anchored to a static door frame using a Physics Constraint component. When a large explosion occurs next to it (triggered by a Blueprint using a Radial Force component), nearby static props are launched across the room correctly. However, the steel door barely moves, ignoring the massive force. It is supposed to break its constraints and ragdoll/fall apart realistically upon impact.",
        difficulty: "medium",
        category: "Physics & Collisions",
        estimate: 1.5
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "We have a large, modular steel door modeled as a Skeletal Mesh, anchored to a static door frame using a Physics Constraint component. When a large explosion occurs next to it (triggered by a Blueprint using a Radial Force component), nearby static props are launched across the room correctly. However, the steel door barely moves, ignoring the massive force. It is supposed to break its constraints and ragdoll/fall apart realistically upon impact.",
        "choices": [
            {
                "text": "Change the 'Linear Breakable Force' from its excessively high default (e.g., 1,000,000,000) to a realistic, lower value that the explosion can overcome (e.g., 50,000).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Select the Physics Constraint component (or the Blueprint variable referencing it) that links the door to the frame.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "In the Physics Constraint details panel, navigate to the 'Constraint Limits' section and enable the 'Breakable' checkbox for both Linear and Angular limits.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Change the 'Angular Breakable Torque' to a realistic value (e.g., 100,000) to ensure rotation can also break the constraint, fully freeing the door.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Select the Skeletal Mesh Component of the door and navigate to its Collision settings. Find the Collision Responses section.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Test the explosion again. The door should now move slightly, proving the force registers, but it still fails to break the constraint entirely.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Examine the Radial Force Component's properties, specifically the 'Force Strength' and 'Impulse Strength' to ensure they are high enough (e.g., 500,000).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Open the Door Blueprint and locate the Skeletal Mesh component to confirm its 'Simulate Physics' setting. Observe that it is currently disabled, relying on the Physics Constraint to hold it in place.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Spending time regenerating or modifying the Skeletal Mesh's Physics Asset, assuming the collision shape is the problem, when the channel response is the issue.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.3
            },
            {
                "text": "Change the Skeletal Mesh Component's Collision Response for the 'Visibility' channel from 'Ignore' to 'Block', allowing the Radial Force to register the hit.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Identify the primary trace/query channel used by the Radial Force Component. Note that it is set to 'Force Channel: Visibility'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Modifying the default values in Project Settings > Physics, which affects global behavior and is unnecessary for a component-specific issue.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.2
            },
            {
                "text": "Locate the Blueprint logic that handles damage or explosion application. Confirm that the Radial Force component is being activated correctly upon event trigger.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Verify that the Skeletal Mesh Component's response to the 'Visibility' trace channel is currently set to 'Ignore'. This prevents the radial force trace from hitting the object.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Replacing the Radial Force Component with a 'Add Impulse' node in Blueprint without first diagnosing why the initial force application failed to register due to collision channel mismatch.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.4
            }
        ]
    }
}
};
