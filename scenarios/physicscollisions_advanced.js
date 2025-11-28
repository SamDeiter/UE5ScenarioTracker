
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['PhysicsLeverFailure'] = {
    meta: {
        title: "Piston-Driven Physics Constraint Failure (Gate Opener)",
        description: "A complex environmental puzzle requires a physics-simulated Piston arm to push a heavy, rotating Lever, which opens a large gate. The system is activated via a Blueprint Timeline driving the Piston's Linear Motor. When triggered, the Piston moves forward successfully, but upon contact with the Lever, the Lever jitters violently, moves less than 5 degrees, and immediately stops or oscillates rapidly, failing to complete its required 80-degree rotation. The system appears to be fighting itself rather than transferring force smoothly. Physics debugging must be used to diagnose the multi-layered failure.",
        difficulty: "medium",
        category: "Physics & Collisions",
        estimate: 3
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "A complex environmental puzzle requires a physics-simulated Piston arm to push a heavy, rotating Lever, which opens a large gate. The system is activated via a Blueprint Timeline driving the Piston's Linear Motor. When triggered, the Piston moves forward successfully, but upon contact with the Lever, the Lever jitters violently, moves less than 5 degrees, and immediately stops or oscillates rapidly, failing to complete its required 80-degree rotation. The system appears to be fighting itself rather than transferring force smoothly. Physics debugging must be used to diagnose the multi-layered failure.",
        "choices": [
            {
                "text": "Change the Constraint Profile setup to allow rotational freedom along the correct axis (e.g., set Angular Constraint to 'Limited' or switch to 'Hinge' mode if applicable).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Attempting to increase the Piston's collision size or use complex per-poly collision settings, incorrectly assuming the jitter is due to collision mesh penetration rather than damping/mass conflict.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.4
            },
            {
                "text": "Still on the Lever component, check the 'Physics' settings for Damping. Identify that 'Angular Damping' is set too high (e.g., 5.0), causing the Lever to stop moving rapidly and inducing oscillation.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.25
            },
            {
                "text": "Increase the 'Target Velocity' in the Piston's Linear Motor settings significantly (e.g., from 50.0 to 500.0) to ensure the Piston has enough momentum to overcome initial inertia of the newly balanced Lever.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Enable detailed Physics Debug visualization in the viewport using console commands 'pxvis collision' and 'pxvis constraints' to confirm the connection points and constraint limits visually.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Check the collision profiles for both the Piston and the Lever. Ensure their collision presets are set to a profile (e.g., 'PhysicsActor') that *Blocks* the channel used by the other component (usually WorldDynamic or custom channels).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Setting the Lever to 'Kinematic' and trying to move it via a Timeline, ignoring the required physics interaction with the Piston.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.75
            },
            {
                "text": "If the rotation is still jittery, examine the Physics Constraint that defines the Lever's pivot. Increase the 'Angular Drive' stiffness/damping slightly (e.g., Stiffness 1000) to stabilize the rotation without locking it.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.35
            },
            {
                "text": "Test the system and confirm the Lever rotates smoothly the full required distance, then disable physics debug visualization.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Examine the Lever Static Mesh Component (the receiver of the force). Navigate to the 'Physics' section and check the 'Mass in KG' property. Note that the mass is set disproportionately high (e.g., 5000.0 kg).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.25
            },
            {
                "text": "Select the Piston component's Physics Constraint (the one driving the linear movement). Locate the 'Linear Motor' section.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Reduce the 'Mass in KG' of the Lever component significantly (e.g., from 5000.0 kg to 500.0 kg) to make the object feasible to be driven by the Piston's current force settings.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Attempting to solve the issue by adding large constant radial forces via Blueprint to the Lever instead of trusting the constraint and simulation transfer.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.5
            },
            {
                "text": "Verify the Blueprint logic that controls the Piston activation to ensure the Timeline is fully running and updating the Linear Motor Target Position/Velocity correctly on Tick/Update.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            },
            {
                "text": "Select the Physics Constraint Component connecting the Piston body (Driver) to the Lever body (Target). Observe the 'Linear Limit' section and confirm the 'Constraint Profile' is set to a custom or appropriate limit (it should be restricted along the axis of movement).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.2
            },
            {
                "text": "Identify that the primary mistake is in the Angular Constraint settings: the Constraint Type is incorrectly set to 'Prismatic' when it should allow rotation, or it is set to 'Ball and Socket' but the Angular Drive is locked.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.3
            },
            {
                "text": "Reduce the Lever's 'Angular Damping' value drastically (e.g., set it to 0.1 or 0.05) to allow force transfer and smooth rotation.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.15
            }
        ]
    }
}
};
