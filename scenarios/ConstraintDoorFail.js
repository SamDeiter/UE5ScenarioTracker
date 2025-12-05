window.SCENARIOS['ConstraintDoorFail'] = {
    "meta": {
        "title": "Immovable Physics Constrained Skeletal Mesh Door",
        "description": "We have a large, modular steel door modeled as a Skeletal Mesh, anchored to a static door frame using a Physics Constraint component. When a large explosion occurs next to it (triggered by a Blueprint using a Radial Force component), nearby static props are launched across the room correctly. However, the steel door barely moves, ignoring the massive force. It is supposed to break its constraints and ragdoll/fall apart realistically upon impact.",
        "estimateHours": 1.5,
        "category": "Physics & Collisions"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "physicscollisions",
            "title": "Step 1",
            "prompt": "<p>Open the Door Blueprint and locate the Skeletal Mesh component to confirm its 'Simulate Physics' setting. Observe that it is currently disabled, relying on the Physics Constraint to hold it in place.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Door Blueprint and locate the Skeletal Mesh component to confirm its 'Simulate Physics' setting. Observe that it is currently disabled, relying on the Physics Constraint to hold it in place.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Spending time regenerating or modifying the Skeletal Mesh's Physics Asset, assuming the collision shape is the problem, when the channel response is the issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "physicscollisions",
            "title": "Step 2",
            "prompt": "<p>Locate the Blueprint logic that handles damage or explosion application. Confirm that the Radial Force component is being activated correctly upon event trigger.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate the Blueprint logic that handles damage or explosion application. Confirm that the Radial Force component is being activated correctly upon event trigger.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Modifying the default values in Project Settings > Physics, which affects global behavior and is unnecessary for a component-specific issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "physicscollisions",
            "title": "Step 3",
            "prompt": "<p>Examine the Radial Force Component's properties, specifically the 'Force Strength' and 'Impulse Strength' to ensure they are high enough (e.g., 500,000).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Examine the Radial Force Component's properties, specifically the 'Force Strength' and 'Impulse Strength' to ensure they are high enough (e.g., 500,000).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Replacing the Radial Force Component with a 'Add Impulse' node in Blueprint without first diagnosing why the initial force application failed to register due to collision channel mismatch.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "physicscollisions",
            "title": "Step 4",
            "prompt": "<p>Identify the primary trace/query channel used by the Radial Force Component. Note that it is set to 'Force Channel: Visibility'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Identify the primary trace/query channel used by the Radial Force Component. Note that it is set to 'Force Channel: Visibility'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Spending time regenerating or modifying the Skeletal Mesh's Physics Asset, assuming the collision shape is the problem, when the channel response is the issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "physicscollisions",
            "title": "Step 5",
            "prompt": "<p>Select the Skeletal Mesh Component of the door and navigate to its Collision settings. Find the Collision Responses section.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select the Skeletal Mesh Component of the door and navigate to its Collision settings. Find the Collision Responses section.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Modifying the default values in Project Settings > Physics, which affects global behavior and is unnecessary for a component-specific issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "physicscollisions",
            "title": "Step 6",
            "prompt": "<p>Verify that the Skeletal Mesh Component's response to the 'Visibility' trace channel is currently set to 'Ignore'. This prevents the radial force trace from hitting the object.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify that the Skeletal Mesh Component's response to the 'Visibility' trace channel is currently set to 'Ignore'. This prevents the radial force trace from hitting the object.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Replacing the Radial Force Component with a 'Add Impulse' node in Blueprint without first diagnosing why the initial force application failed to register due to collision channel mismatch.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "physicscollisions",
            "title": "Step 7",
            "prompt": "<p>Change the Skeletal Mesh Component's Collision Response for the 'Visibility' channel from 'Ignore' to 'Block', allowing the Radial Force to register the hit.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Change the Skeletal Mesh Component's Collision Response for the 'Visibility' channel from 'Ignore' to 'Block', allowing the Radial Force to register the hit.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Spending time regenerating or modifying the Skeletal Mesh's Physics Asset, assuming the collision shape is the problem, when the channel response is the issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "physicscollisions",
            "title": "Step 8",
            "prompt": "<p>Test the explosion again. The door should now move slightly, proving the force registers, but it still fails to break the constraint entirely.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Test the explosion again. The door should now move slightly, proving the force registers, but it still fails to break the constraint entirely.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Modifying the default values in Project Settings > Physics, which affects global behavior and is unnecessary for a component-specific issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "physicscollisions",
            "title": "Step 9",
            "prompt": "<p>Select the Physics Constraint component (or the Blueprint variable referencing it) that links the door to the frame.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select the Physics Constraint component (or the Blueprint variable referencing it) that links the door to the frame.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Replacing the Radial Force Component with a 'Add Impulse' node in Blueprint without first diagnosing why the initial force application failed to register due to collision channel mismatch.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "physicscollisions",
            "title": "Step 10",
            "prompt": "<p>In the Physics Constraint details panel, navigate to the 'Constraint Limits' section and enable the 'Breakable' checkbox for both Linear and Angular limits.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Physics Constraint details panel, navigate to the 'Constraint Limits' section and enable the 'Breakable' checkbox for both Linear and Angular limits.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Spending time regenerating or modifying the Skeletal Mesh's Physics Asset, assuming the collision shape is the problem, when the channel response is the issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.3hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "physicscollisions",
            "title": "Step 11",
            "prompt": "<p>Change the 'Linear Breakable Force' from its excessively high default (e.g., 1,000,000,000) to a realistic, lower value that the explosion can overcome (e.g., 50,000).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Change the 'Linear Breakable Force' from its excessively high default (e.g., 1,000,000,000) to a realistic, lower value that the explosion can overcome (e.g., 50,000).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Modifying the default values in Project Settings > Physics, which affects global behavior and is unnecessary for a component-specific issue.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.2hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "physicscollisions",
            "title": "Step 12",
            "prompt": "<p>Change the 'Angular Breakable Torque' to a realistic value (e.g., 100,000) to ensure rotation can also break the constraint, fully freeing the door.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Change the 'Angular Breakable Torque' to a realistic value (e.g., 100,000) to ensure rotation can also break the constraint, fully freeing the door.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Replacing the Radial Force Component with a 'Add Impulse' node in Blueprint without first diagnosing why the initial force application failed to register due to collision channel mismatch.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario.</p>",
            "choices": []
        }
    }
};
