window.SCENARIOS['PhysicsLeverFailure'] = {
    "meta": {
        "title": "Piston-Driven Physics Constraint Failure (Gate Opener)",
        "description": "A complex environmental puzzle requires a physics-simulated Piston arm to push a heavy, rotating Lever, which opens a large gate. The system is activated via a Blueprint Timeline driving the Piston's Linear Motor. When triggered, the Piston moves forward successfully, but upon contact with the Lever, the Lever jitters violently, moves less than 5 degrees, and immediately stops or oscillates rapidly, failing to complete its required 80-degree rotation. The system appears to be fighting itself rather than transferring force smoothly. Physics debugging must be used to diagnose the multi-layered failure.",
        "estimateHours": 3,
        "category": "Physics & Collisions"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "physicscollisions",
            "title": "Step 1",
            "prompt": "<p>Enable detailed Physics Debug visualization in the viewport using console commands 'pxvis collision' and 'pxvis constraints' to confirm the connection points and constraint limits visually.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Enable detailed Physics Debug visualization in the viewport using console commands 'pxvis collision' and 'pxvis constraints' to confirm the connection points and constraint limits visually.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Attempting to solve the issue by adding large constant radial forces via Blueprint to the Lever instead of trusting the constraint and simulation transfer.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "physicscollisions",
            "title": "Step 2",
            "prompt": "<p>Verify the Blueprint logic that controls the Piston activation to ensure the Timeline is fully running and updating the Linear Motor Target Position/Velocity correctly on Tick/Update.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify the Blueprint logic that controls the Piston activation to ensure the Timeline is fully running and updating the Linear Motor Target Position/Velocity correctly on Tick/Update.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Attempting to increase the Piston's collision size or use complex per-poly collision settings, incorrectly assuming the jitter is due to collision mesh penetration rather than damping/mass conflict.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "physicscollisions",
            "title": "Step 3",
            "prompt": "<p>Select the Physics Constraint Component connecting the Piston body (Driver) to the Lever body (Target). Observe the 'Linear Limit' section and confirm the 'Constraint Profile' is set to a custom or appropriate limit (it should be restricted along the axis of movement).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select the Physics Constraint Component connecting the Piston body (Driver) to the Lever body (Target). Observe the 'Linear Limit' section and confirm the 'Constraint Profile' is set to a custom or appropriate limit (it should be restricted along the axis of movement).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Setting the Lever to 'Kinematic' and trying to move it via a Timeline, ignoring the required physics interaction with the Piston.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.75hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "physicscollisions",
            "title": "Step 4",
            "prompt": "<p>Identify that the primary mistake is in the Angular Constraint settings: the Constraint Type is incorrectly set to 'Prismatic' when it should allow rotation, or it is set to 'Ball and Socket' but the Angular Drive is locked.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Identify that the primary mistake is in the Angular Constraint settings: the Constraint Type is incorrectly set to 'Prismatic' when it should allow rotation, or it is set to 'Ball and Socket' but the Angular Drive is locked.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.3hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Attempting to solve the issue by adding large constant radial forces via Blueprint to the Lever instead of trusting the constraint and simulation transfer.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "physicscollisions",
            "title": "Step 5",
            "prompt": "<p>Change the Constraint Profile setup to allow rotational freedom along the correct axis (e.g., set Angular Constraint to 'Limited' or switch to 'Hinge' mode if applicable).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Change the Constraint Profile setup to allow rotational freedom along the correct axis (e.g., set Angular Constraint to 'Limited' or switch to 'Hinge' mode if applicable).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Attempting to increase the Piston's collision size or use complex per-poly collision settings, incorrectly assuming the jitter is due to collision mesh penetration rather than damping/mass conflict.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "physicscollisions",
            "title": "Step 6",
            "prompt": "<p>Examine the Lever Static Mesh Component (the receiver of the force). Navigate to the 'Physics' section and check the 'Mass in KG' property. Note that the mass is set disproportionately high (e.g., 5000.0 kg).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Examine the Lever Static Mesh Component (the receiver of the force). Navigate to the 'Physics' section and check the 'Mass in KG' property. Note that the mass is set disproportionately high (e.g., 5000.0 kg).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.25hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Setting the Lever to 'Kinematic' and trying to move it via a Timeline, ignoring the required physics interaction with the Piston.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.75hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "physicscollisions",
            "title": "Step 7",
            "prompt": "<p>Reduce the 'Mass in KG' of the Lever component significantly (e.g., from 5000.0 kg to 500.0 kg) to make the object feasible to be driven by the Piston's current force settings.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Reduce the 'Mass in KG' of the Lever component significantly (e.g., from 5000.0 kg to 500.0 kg) to make the object feasible to be driven by the Piston's current force settings.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Attempting to solve the issue by adding large constant radial forces via Blueprint to the Lever instead of trusting the constraint and simulation transfer.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "physicscollisions",
            "title": "Step 8",
            "prompt": "<p>Still on the Lever component, check the 'Physics' settings for Damping. Identify that 'Angular Damping' is set too high (e.g., 5.0), causing the Lever to stop moving rapidly and inducing oscillation.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Still on the Lever component, check the 'Physics' settings for Damping. Identify that 'Angular Damping' is set too high (e.g., 5.0), causing the Lever to stop moving rapidly and inducing oscillation.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.25hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Attempting to increase the Piston's collision size or use complex per-poly collision settings, incorrectly assuming the jitter is due to collision mesh penetration rather than damping/mass conflict.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "physicscollisions",
            "title": "Step 9",
            "prompt": "<p>Reduce the Lever's 'Angular Damping' value drastically (e.g., set it to 0.1 or 0.05) to allow force transfer and smooth rotation.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Reduce the Lever's 'Angular Damping' value drastically (e.g., set it to 0.1 or 0.05) to allow force transfer and smooth rotation.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Setting the Lever to 'Kinematic' and trying to move it via a Timeline, ignoring the required physics interaction with the Piston.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.75hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "physicscollisions",
            "title": "Step 10",
            "prompt": "<p>Select the Piston component's Physics Constraint (the one driving the linear movement). Locate the 'Linear Motor' section.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select the Piston component's Physics Constraint (the one driving the linear movement). Locate the 'Linear Motor' section.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Attempting to solve the issue by adding large constant radial forces via Blueprint to the Lever instead of trusting the constraint and simulation transfer.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "physicscollisions",
            "title": "Step 11",
            "prompt": "<p>Increase the 'Target Velocity' in the Piston's Linear Motor settings significantly (e.g., from 50.0 to 500.0) to ensure the Piston has enough momentum to overcome initial inertia of the newly balanced Lever.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Increase the 'Target Velocity' in the Piston's Linear Motor settings significantly (e.g., from 50.0 to 500.0) to ensure the Piston has enough momentum to overcome initial inertia of the newly balanced Lever.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Attempting to increase the Piston's collision size or use complex per-poly collision settings, incorrectly assuming the jitter is due to collision mesh penetration rather than damping/mass conflict.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "physicscollisions",
            "title": "Step 12",
            "prompt": "<p>Check the collision profiles for both the Piston and the Lever. Ensure their collision presets are set to a profile (e.g., 'PhysicsActor') that *Blocks* the channel used by the other component (usually WorldDynamic or custom channels).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Check the collision profiles for both the Piston and the Lever. Ensure their collision presets are set to a profile (e.g., 'PhysicsActor') that *Blocks* the channel used by the other component (usually WorldDynamic or custom channels).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.2hrs. Correct approach.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Setting the Lever to 'Kinematic' and trying to move it via a Timeline, ignoring the required physics interaction with the Piston.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.75hrs. This approach wastes time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "physicscollisions",
            "title": "Step 13",
            "prompt": "<p>If the rotation is still jittery, examine the Physics Constraint that defines the Lever's pivot. Increase the 'Angular Drive' stiffness/damping slightly (e.g., Stiffness 1000) to stabilize the rotation without locking it.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>If the rotation is still jittery, examine the Physics Constraint that defines the Lever's pivot. Increase the 'Angular Drive' stiffness/damping slightly (e.g., Stiffness 1000) to stabilize the rotation without locking it.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.35hrs. Correct approach.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Attempting to solve the issue by adding large constant radial forces via Blueprint to the Lever instead of trusting the constraint and simulation transfer.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.5hrs. This approach wastes time.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "physicscollisions",
            "title": "Step 14",
            "prompt": "<p>Test the system and confirm the Lever rotates smoothly the full required distance, then disable physics debug visualization.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Test the system and confirm the Lever rotates smoothly the full required distance, then disable physics debug visualization.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.15hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Attempting to increase the Piston's collision size or use complex per-poly collision settings, incorrectly assuming the jitter is due to collision mesh penetration rather than damping/mass conflict.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.4hrs. This approach wastes time.</p>",
                    "next": "step-14"
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
