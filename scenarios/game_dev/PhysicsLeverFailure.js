window.SCENARIOS["PhysicsLeverFailure"] = {
  meta: {
    title: "Piston-Driven Physics Constraint Failure (Gate Opener)",
    description:
      "A complex environmental puzzle requires a physics-simulated Piston arm to push a heavy, rotating Lever, which opens a large gate. The system is activated via a Blueprint Timeline driving the Piston's Linear Motor. When triggered, the Piston moves forward successfully, but upon contact with the Lever, the Lever jitters violently, moves less than 5 degrees, and immediately stops or oscillates rapidly, failing to complete its required 80-degree rotation. The system appears to be fighting itself rather than transferring force smoothly. Physics debugging must be used to diagnose the multi-layered failure.",
    estimateHours: 3,
    category: "Physics & Collisions",
    tokens_used: 12320,
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "PhysicsLeverFailure",
      step: "step-1",
    },
  ],
  fault: {
    description:
      "Lever jitters and stops due to constraint, mass, and damping issues.",
    visual_cue: "Lever violent jitter and 5-degree stoppage",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "PhysicsLeverFailure",
      step: "step-14",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "physicscollisions",
      image_path: "assets/generated/PhysicsLeverFailure/step-1.png",
      title: "Diagnose Lever Jitter and Stoppage",
      prompt:
        "<p>The <strong>Piston</strong> moves, contacts the <strong>Lever</strong>, but the <strong>Lever</strong> jitters violently, moves less than 5 degrees, then immediately stops or oscillates rapidly, failing to complete its 80-degree rotation. The system appears to be fighting itself. How do you investigate this multi-layered failure?</p>",
      choices: [
        {
          text: "<p>Enable detailed <strong>Physics Debug</strong> visualization in the viewport using console commands <code>p.Chaos.DebugDraw.Enabled 1</code> and <code>p.Chaos.Solver.DebugDrawShapes 1</code>. Also use <code>show physics</code> to confirm connection points and constraint limits visually. How do you proceed?</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.2hrs. Visualizing collision shapes with Chaos debug commands is fundamental. Yellow shapes indicate active bodies, gray indicates sleeping. Use <code>stat Chaos</code> for real-time physics performance stats.</p>",
          next: "step-2",
        },
        {
          text: "<p>Attempt to solve the issue by adding large constant radial forces via <strong>Blueprint</strong> to the <strong>Lever</strong> instead of trusting the constraint and simulation transfer. What action do you take?</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.5hrs. Adding arbitrary forces via Blueprint is a workaround that bypasses the intended physics simulation, leading to unstable and unpredictable behavior, and doesn't diagnose the root cause of the constraint failure.</p>",
          next: "step-1",
        },
        {
          text: "<p>Check the <strong>Rendered FPS</strong> using <code>stat unit</code> and <code>stat gpu</code> to see if performance is causing the jitter. Which approach do you choose?</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.15hrs. While performance can affect physics, severe jitter and stoppage usually indicate a setup issue rather than just a framerate problem. This check is premature and unlikely to reveal the primary cause.</p>",
          next: "step-1",
        },
        {
          text: "<p>Review the <strong>Material Instances</strong> of the <strong>Piston</strong> and <strong>Lever</strong> to ensure their physics materials are correctly assigned for friction. How should you proceed?</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. Physics materials influence friction and restitution, which are important, but they typically don't cause violent jitter and complete stoppage in this manner. Constraint and motor settings are more likely culprits for such severe symptoms.</p>",
          next: "step-1",
        },
      ],
    },
    "step-2": {
      skill: "physicscollisions",
      image_path: "assets/generated/PhysicsLeverFailure/step-2.png",
      title: "Verify Piston Blueprint Logic",
      prompt:
        "<p>With physics debug visualization active, you still observe the <strong>Lever</strong> jitters and stops, and there are no immediately obvious visual constraint misalignments. What's your next move to confirm the Piston's activation?</p>",
      choices: [
        {
          text: "<p>Verify the <strong>Blueprint</strong> logic that controls the <strong>Piston</strong> activation to ensure the <strong>Timeline</strong> is fully running and updating the <strong>Linear Motor Target Position/Velocity</strong> correctly on <strong>Tick/Update</strong>. How should you proceed?</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.15hrs. Before diving deeper into physics settings, it's crucial to confirm the motor is receiving correct and consistent input from the Blueprint's control logic. A timeline not fully running or incorrectly updating values would prevent proper force transfer.</p>",
          next: "step-3",
        },
        {
          text: "<p>Attempt to increase the <strong>Piston's collision size</strong> or use complex per-poly collision settings, incorrectly assuming the jitter is due to collision mesh penetration. How do you investigate this?</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.4hrs. While collision mesh issues can occur, increasing collision size or using per-poly collision is often an overreaction and typically not the first step for this symptom. It's unlikely to be the root cause of the system fighting itself, and can be performance intensive.</p>",
          next: "step-2",
        },
        {
          text: "<p>Add a temporary <code>Print String</code> node in the <strong>Piston Blueprint</strong> to display its current linear velocity. What action do you take?</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.08hrs. While inspecting velocity is useful, checking if the <strong>Timeline</strong> is correctly *driving* the target velocity and position is more fundamental to the motor's operation. A `Print String` provides output but not necessarily insight into the driving logic.</p>",
          next: "step-2",
        },
        {
          text: "<p>Inspect the <strong>Piston Static Mesh's</strong> <code>Mobility</code> setting, ensuring it's set to <code>Movable</code> for physics simulation. What's your next move?</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.05hrs. The Piston *is* moving forward successfully, indicating its mobility is likely already `Movable`. This check is redundant given the described symptom.</p>",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "physicscollisions",
      image_path: "assets/generated/PhysicsLeverFailure/step-3.png",
      title: "Examine Piston-Lever Linear Constraint",
      prompt:
        "<p>The <strong>Blueprint</strong> logic appears correct; the <strong>Timeline</strong> is driving the <strong>Piston's Linear Motor</strong> as expected. The <strong>Lever</strong> still isn't moving smoothly. What's your next step in diagnosing the direct interaction between the <strong>Piston</strong> and the <strong>Lever</strong>?</p>",
      choices: [
        {
          text: "<p>Select the <strong>Physics Constraint Component</strong> connecting the <strong>Piston</strong> body (Driver) to the <strong>Lever</strong> body (Target). Observe the 'Linear Limit' section and confirm the 'Constraint Profile' is set to a custom or appropriate limit. What action do you take?</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.2hrs. Examining the constraint connecting the primary actors is essential. While linear limits might not be the root cause of rotation issues, understanding how they restrict movement is a good starting point for detailed constraint analysis.</p>",
          next: "step-4",
        },
        {
          text: "<p>Increase the <strong>Piston's Static Mesh's Mass in KG</strong>, assuming it needs more weight to push the <strong>Lever</strong>. How do you investigate this?</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.15hrs. Arbitrarily increasing the Piston's mass is unlikely to solve a constraint or resistance issue and could introduce new problems or instability into the simulation.</p>",
          next: "step-3",
        },
        {
          text: "<p>Check the collision settings of the <strong>Piston Static Mesh</strong> for complex per-poly collision, suspecting poor contact. Which approach do you choose?</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. While collision settings are important, the primary symptom points more towards constraint and force issues rather than collision mesh complexity. This is a common rabbit hole to go down prematurely.</p>",
          next: "step-3",
        },
        {
          text: "<p>Examine the <strong>Lever Static Mesh's</strong> <code>Collision Presets</code> to ensure it generates hit events. How should you proceed?</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.05hrs. Hit events are for scripting responses, not for direct physics force transfer. The issue is with the physical interaction and constraint behavior, not event generation.</p>",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "physicscollisions",
      image_path: "assets/generated/PhysicsLeverFailure/step-4.png",
      title: "Identify Angular Constraint Mismatch",
      prompt:
        "<p>You've confirmed the 'Linear Limit' on the <strong>Piston-Lever Constraint</strong> is correctly restricted along the <strong>Piston's</strong> axis. However, the <strong>Lever</strong> still isn't rotating as expected, only jittering. What crucial aspect of the constraint's rotational freedom should you scrutinize next?</p>",
      choices: [
        {
          text: "<p>Identify that the primary mistake is in the <strong>Angular Constraint</strong> settings: the <strong>Angular Limits</strong> (<code>Swing1</code>, <code>Swing2</code>, <code>Twist</code>) are incorrectly set to <code>Locked</code> instead of <code>Limited</code> or <code>Free</code> when it should allow rotation, or the constraint is set to <code>Prismatic</code> (linear only) when it should be <code>Hinge</code> for rotational freedom. Which approach do you choose?</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.3hrs. This is a critical observation. A `Prismatic` constraint only allows linear movement, directly opposing the required rotational motion of the Lever. A locked `Angular Drive` on `Ball and Socket` would have a similar effect, preventing any rotation and causing the 'fighting' behavior.</p>",
          next: "step-5",
        },
        {
          text: "<p>Check if the <strong>Piston</strong> and <strong>Lever Static Meshes</strong> have their <code>Generate Overlap Events</code> enabled. What action do you take?</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.15hrs. Overlap events are for detecting intersections without physical blocking, not for enabling or restricting physics-driven rotation. This won't address the constraint issue.</p>",
          next: "step-4",
        },
        {
          text: "<p>Inspect the <strong>Lever's Static Mesh's Physics Asset</strong> to see if any bones are locked. How do you investigate this?</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. While Physics Assets are important, the issue is described as a constraint *between* the Piston and Lever, not an internal rigidity problem within the Lever's own Physics Asset. The main constraint settings are the first place to look.</p>",
          next: "step-4",
        },
        {
          text: "<p>Increase the <code>Linear Motor Force Limit</code> on the <strong>Piston's Constraint</strong> to push harder, assuming it's not strong enough. How should you proceed?</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. Increasing force might seem logical, but if the constraint itself is *preventing* rotation (e.g., `Prismatic`), no amount of force will overcome that fundamental limitation. This would just cause more jitter or instability.</p>",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "physicscollisions",
      image_path: "assets/generated/PhysicsLeverFailure/step-5.png",
      title: "Adjust Angular Constraint for Rotation",
      prompt:
        "<p>You've identified an incorrect <strong>Angular Constraint Type</strong> (e.g., <code>Prismatic</code> or locked <code>Ball and Socket</code>) on the <strong>Piston-Lever Constraint</strong>. How do you rectify this to allow the <strong>Lever</strong> to rotate along its intended axis?</p>",
      choices: [
        {
          text: "<p>Change the <strong>Constraint Profile</strong> setup to allow rotational freedom along the correct axis (e.g., set <strong>Angular Constraint</strong> to <code>Limited</code> or switch to <code>Hinge</code> mode if applicable). How do you proceed?</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.2hrs. Setting the constraint to allow rotation (e.g., `Limited` or `Hinge`) on the appropriate axis is crucial for the Lever to move as intended by the Piston's force, resolving the fundamental angular restriction.</p>",
          next: "step-6",
        },
        {
          text: "<p>Set the <strong>Lever's Static Mesh</strong> to <code>Kinematic</code> and try to move it via a <strong>Timeline</strong>, ignoring the required physics interaction with the <strong>Piston</strong>. What action do you take?</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.75hrs. Making the Lever `Kinematic` removes it from physics simulation entirely, defeating the purpose of the physics-driven Piston and requiring a complete redesign of the interaction. This completely misses the point of a physics constraint failure.</p>",
          next: "step-5",
        },
        {
          text: "<p>Switch the <strong>Angular Constraint Type</strong> to <code>Locked</code> on all axes to completely prevent any rotation. How do you investigate this?</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.15hrs. While `Prismatic` was wrong, setting it to `Locked` (unless `Hinge` is used with a single free axis) would also prevent the desired rotation, potentially making the 'fighting' worse. The goal is to *allow* rotation, not completely stop it.</p>",
          next: "step-5",
        },
        {
          text: "<p>Enable <code>Disable Collision</code> between the <strong>Piston</strong> and <strong>Lever</strong>, assuming they are just getting stuck. How should you proceed?</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. Disabling collision between the two objects would prevent the Piston from pushing the Lever at all, as there would be no physical contact. This would break the intended interaction completely.</p>",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "physicscollisions",
      image_path: "assets/generated/PhysicsLeverFailure/step-6.png",
      title: "Check Lever Mass",
      prompt:
        "<p>The <strong>Piston-Lever Constraint</strong> settings are now configured to allow rotation. The <strong>Lever</strong> still jitters or moves very little upon contact, failing to achieve full rotation. What aspect of the <strong>Lever</strong> itself might be resisting movement, now that the constraint allows it?</p>",
      choices: [
        {
          text: "<p>Examine the <strong>Lever Static Mesh Component</strong> (the receiver of the force). Navigate to the 'Physics' section and check the <code>Mass in KG</code> property. Note that the mass is set disproportionately high (e.g., 5000.0 kg). What's your next move?</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.25hrs. Excessive mass is a common cause for physics objects resisting movement, especially when driven by motors. The Piston's motor settings likely aren't configured to drive such an incredibly heavy object, explaining the lack of significant movement.</p>",
          next: "step-7",
        },
        {
          text: "<p>Increase the <strong>Piston's Linear Motor Target Position</strong> in the <strong>Blueprint Timeline</strong> to extend its reach. How do you investigate this?</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.15hrs. Increasing the target position only changes how far the Piston *tries* to go, not how much force it applies or how the Lever reacts to that force. It won't address resistance issues.</p>",
          next: "step-6",
        },
        {
          text: "<p>Check the <strong>Lever's Physics Material</strong> to ensure its <code>Friction</code> is not too high. Which approach do you choose?</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. While friction can add resistance, a mass of 5000kg is a far more significant impediment. Friction would typically cause a slower or less efficient rotation, not the violent jitter and stoppage described. This is a secondary consideration.</p>",
          next: "step-6",
        },
        {
          text: "<p>Verify the <strong>Lever's Physics Asset</strong> has correctly weighted bones for its physical shape. How should you proceed?</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.08hrs. If the Lever is a single rigid body, its Physics Asset only defines its collision shape and mass distribution, not its total mass. The `Mass in KG` property directly overrides Physics Asset mass for simple rigid bodies.</p>",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "physicscollisions",
      image_path: "assets/generated/PhysicsLeverFailure/step-7.png",
      title: "Reduce Lever Mass to Realistic Value",
      prompt:
        "<p>You've identified that the <strong>Lever's</strong> <code>Mass in KG</code> is excessively high (e.g., 5000.0 kg). What's the immediate action to address this to allow the <strong>Piston</strong> to drive it?</p>",
      choices: [
        {
          text: "<p>Reduce the <code>Mass in KG</code> of the <strong>Lever component</strong> significantly (e.g., from 5000.0 kg to 500.0 kg) to make the object feasible to be driven by the <strong>Piston's</strong> current force settings. How should you proceed?</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.15hrs. Reducing the mass brings the Lever into a more realistic range for the Piston to interact with, drastically reducing the initial resistance and improving the chance of smooth movement without requiring excessive force from the Piston.</p>",
          next: "step-8",
        },
        {
          text: "<p>Attempt to solve the issue by adding an impulse to the <strong>Lever</strong> via <strong>Blueprint</strong> on contact. What action do you take?</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.3hrs. While impulses can move objects, relying on manual impulses to compensate for fundamental physics property mismatches (like mass) is a poor solution that makes the simulation less robust and harder to predict. It's a band-aid, not a fix.</p>",
          next: "step-7",
        },
        {
          text: "<p>Increase the <strong>Piston's Linear Motor Force Limit</strong> to a very high value to overcome the heavy <strong>Lever</strong>. How do you investigate this?</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.15hrs. While increasing force *might* eventually move it, a mass of 5000kg is so extreme that the required force would likely lead to instability, overshooting, or violent reactions, making the simulation difficult to control. Reducing the mass is the more appropriate solution.</p>",
          next: "step-7",
        },
        {
          text: "<p>Change the <strong>Lever's Static Mesh</strong> to use <code>Complex as Simple Collision</code>, assuming the mass calculation is off due to primitive collision. How should you proceed?</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. Complex as Simple collision affects collision accuracy, not the `Mass in KG` property directly, which overrides automatically calculated mass from primitive shapes when explicitly set. This would not address the core mass issue.</p>",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "physicscollisions",
      image_path: "assets/generated/PhysicsLeverFailure/step-8.png",
      title: "Check Lever Angular Damping",
      prompt:
        "<p>With the <strong>Lever's</strong> mass reduced, it still stops or oscillates rapidly after initial contact, failing to complete its rotation. What other physics property on the <strong>Lever</strong> might be acting like a brake, causing this rapid cessation of rotational movement?</p>",
      choices: [
        {
          text: "<p>Still on the <strong>Lever component</strong>, check the 'Physics' settings for <strong>Damping</strong>. Identify that <code>Angular Damping</code> is set too high (e.g., 5.0), causing the <strong>Lever</strong> to stop moving rapidly and inducing oscillation. How do you investigate this?</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.25hrs. High angular damping acts like a brake on rotational motion. If set too high, it will absorb the transferred force quickly, preventing the desired rotation and often leading to jitter or rapid oscillation as the system tries to overcome it.</p>",
          next: "step-9",
        },
        {
          text: "<p>Set the <strong>Lever's Static Mesh</strong> to <code>No Collision</code> to see if the Piston pushing it is the problem. What action do you take?</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.2hrs. Disabling collision would prevent any interaction between the Piston and the Lever, completely breaking the system. This is an extreme and counterproductive diagnostic step.</p>",
          next: "step-8",
        },
        {
          text: "<p>Examine the <strong>Piston's Physics Constraint's Angular Damping</strong>, assuming the Piston is stopping the Lever. Which approach do you choose?</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. While constraints have damping, the symptom describes the *Lever itself* stopping. Angular damping on the Lever is a more direct control over its own rotational momentum. Checking the Piston's constraint damping for the Lever's *rotational* stoppage is less direct.</p>",
          next: "step-8",
        },
        {
          text: "<p>Increase the <strong>Piston's Linear Motor Target Velocity</strong> again to overcome the stopping behavior. How should you proceed?</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. Increasing velocity might temporarily mask the issue by brute force, but it won't address the underlying problem of excessive damping on the Lever. This can lead to over-correction and instability.</p>",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "physicscollisions",
      image_path: "assets/generated/PhysicsLeverFailure/step-9.png",
      title: "Reduce Lever Angular Damping for Smooth Rotation",
      prompt:
        "<p>You've found the <strong>Lever's</strong> <code>Angular Damping</code> is set to an excessively high value (e.g., 5.0). What's the appropriate adjustment to allow smooth, continuous rotation from the <strong>Piston's</strong> force?</p>",
      choices: [
        {
          text: "<p>Reduce the <strong>Lever's</strong> <code>Angular Damping</code> value drastically (e.g., set it to 0.1 or 0.05) to allow force transfer and smooth rotation. What action do you take?</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.15hrs. Lowering angular damping significantly reduces the resistance to rotation, allowing the Piston's force to translate into smooth, continuous movement of the Lever, enabling it to complete its required rotation.</p>",
          next: "step-10",
        },
        {
          text: "<p>Set the <strong>Lever's Angular Damping</strong> to 0.0 to completely remove any resistance. How do you investigate this?</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. While reducing damping is correct, setting it to exactly 0.0 can sometimes lead to an object rotating indefinitely or becoming overly sensitive to small forces, potentially causing minor instability. A very small non-zero value is often more stable in real-world simulations.</p>",
          next: "step-9",
        },
        {
          text: "<p>Increase the <strong>Lever's Linear Damping</strong> to absorb any linear jitters. Which approach do you choose?</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.08hrs. The problem is with rotational movement stopping. Linear damping affects linear motion, not the angular rotation directly. Adjusting the wrong damping type won't solve the issue.</p>",
          next: "step-9",
        },
        {
          text: "<p>Adjust the <strong>Lever's Physics Material</strong> to have lower <code>Angular Frictional Force</code>. How should you proceed?</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.05hrs. While physics material friction contributes, `Angular Damping` is a direct property on the component that applies a constant resistance to angular velocity, making it a more direct and impactful control for rapid stopping/oscillation than a material property.</p>",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "physicscollisions",
      image_path: "assets/generated/PhysicsLeverFailure/step-10.png",
      title: "Locate Piston Linear Motor Settings",
      prompt:
        "<p>The <strong>Lever's</strong> mass and damping are now appropriately configured. While movement is improved, the <strong>Lever</strong> still doesn't consistently rotate the full 80 degrees, or the initial push from the <strong>Piston</strong> seems weak. What specific part of the <strong>Piston's</strong> setup should you now examine to ensure it's providing sufficient propulsion?</p>",
      choices: [
        {
          text: "<p>Select the <strong>Piston component's Physics Constraint</strong> (the one driving the linear movement). Locate the 'Linear Motor' section. Which approach do you choose?</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.1hrs. The Linear Motor settings directly control the force and velocity the Piston applies. Reviewing these is crucial after adjusting the Lever's properties, as the Piston might now be underpowered for the newly balanced system.</p>",
          next: "step-11",
        },
        {
          text: "<p>Open the <strong>World Settings</strong> and increase the global <code>Physics Substep Count</code> to improve simulation accuracy. How do you investigate this?</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.15hrs. Increasing physics substeps can improve accuracy but is generally a performance-intensive last resort for minor jitters, not for a fundamental lack of force or range of motion. It's unlikely to address the Piston's perceived weakness.</p>",
          next: "step-10",
        },
        {
          text: "<p>Check the <strong>Lever's Physics Constraint's Linear Motor</strong> settings, assuming it's resisting the push. What action do you take?</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.08hrs. The Lever is the *receiver* of the force, not the active driver of its own linear motion. Its linear motor settings (if any) would not be relevant to the Piston's ability to push it. Focus should remain on the Piston's driving mechanism.</p>",
          next: "step-10",
        },
        {
          text: "<p>Increase the <strong>Piston's Linear Motor Target Position</strong> in the <strong>Timeline Blueprint</strong> again. How should you proceed?</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.05hrs. While target position is part of the Blueprint, the problem now is related to the *strength* of the push, not just how far it's instructed to go. The motor's inherent force/velocity properties are more critical here.</p>",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "physicscollisions",
      image_path: "assets/generated/PhysicsLeverFailure/step-11.png",
      title: "Adjust Piston Linear Motor Target Velocity",
      prompt:
        "<p>You're inspecting the <strong>Piston's Linear Motor</strong> settings. The <strong>Piston</strong> moves, but the push on the <strong>Lever</strong> still seems insufficient to achieve full 80-degree rotation. What specific motor setting needs adjustment to ensure it has enough momentum?</p>",
      choices: [
        {
          text: "<p>Increase the <code>Target Velocity</code> in the <strong>Piston's Linear Motor</strong> (Velocity Drive mode) settings significantly (e.g., from 50.0 to 500.0) to ensure the <strong>Piston</strong> has enough momentum to overcome initial inertia of the newly balanced <strong>Lever</strong>. How do you proceed?</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.2hrs. Increasing the `Target Velocity` directly translates to a stronger, faster push from the Piston. This helps overcome the remaining inertia of the Lever and ensures it completes its full range of motion against any residual friction or damping.</p>",
          next: "step-12",
        },
        {
          text: "<p>Decrease the <strong>Piston's Linear Motor Stiffness</strong> to allow for more flexible movement. What action do you take?</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.15hrs. Decreasing stiffness would make the motor weaker and less able to reach its target position with force, exacerbating the problem of insufficient push. This is the opposite of what's needed.</p>",
          next: "step-11",
        },
        {
          text: "<p>Increase the <strong>Piston's Linear Motor Max Force</strong> instead of velocity. How do you investigate this?</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. While `Max Force` is related, `Target Velocity` directly dictates the desired speed and momentum, which is more critical for overcoming inertia and ensuring smooth, consistent movement in a motor-driven setup. Often, increasing velocity implicitly utilizes more force within the set `Max Force`.</p>",
          next: "step-11",
        },
        {
          text: "<p>Adjust the <strong>Piston's Physics Asset</strong> to have more mass in its forward section. How should you proceed?</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.08hrs. The Piston's mass is likely already sufficient; the issue is with the *motor's ability* to apply force to the Lever. Modifying the Piston's internal mass distribution won't make the motor push harder.</p>",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "physicscollisions",
      image_path: "assets/generated/PhysicsLeverFailure/step-12.png",
      title: "Verify Piston and Lever Collision Profiles",
      prompt:
        "<p>The <strong>Piston</strong> now has increased target velocity, and the <strong>Lever's</strong> physics properties are balanced. If rotation is still not smooth or reliable, or if unexpected interactions occur, what crucial aspect of the physical interaction between the <strong>Piston</strong> and <strong>Lever</strong> needs a final verification?</p>",
      choices: [
        {
          text: "<p>Check the <strong>collision profiles</strong> for both the <strong>Piston</strong> and the <strong>Lever</strong>. Ensure their collision presets are set to a profile (e.g., <code>PhysicsActor</code>) that <code>Blocks</code> the channel used by the other component (usually <code>WorldDynamic</code> or custom channels). What action do you take?</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.2hrs. Incorrect collision settings can lead to unexpected jitter, lack of force transfer, or even objects passing through each other. Ensuring proper blocking between the interacting components is fundamental for reliable physics simulation, especially when fine-tuning.</p>",
          next: "step-13",
        },
        {
          text: "<p>Change the <strong>Lever's Blueprint Timeline</strong> to animate its rotation directly instead of relying on physics. How do you investigate this?</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.5hrs. This completely abandons the physics-based solution and the Piston's interaction. It's a fundamental design change, not a debugging step for a physics constraint failure.</p>",
          next: "step-12",
        },
        {
          text: "<p>Reduce the <strong>Piston's Static Mesh's Collision Complexity</strong> to `Use Simple Collision as Complex`. Which approach do you choose?</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. While collision complexity can sometimes be an issue, `Use Simple Collision as Complex` is typically a performance optimization, not a fix for fundamental collision blocking rules. Simpler collision might even be less accurate for complex shapes without proper setup.</p>",
          next: "step-12",
        },
        {
          text: "<p>Set both <strong>Piston</strong> and <strong>Lever</strong> to `Ignore Physics Volume` to rule out environmental influences. How should you proceed?</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.08hrs. Physics Volumes apply broad effects like gravity or damping in specific areas. While they could theoretically influence behavior, it's highly unlikely they are causing a specific blocking issue between two well-defined physics actors unless explicitly set up to do so. Collision channels are a more direct check.</p>",
          next: "step-12",
        },
      ],
    },
    "step-13": {
      skill: "physicscollisions",
      image_path: "assets/generated/PhysicsLeverFailure/step-13.png",
      title: "Stabilize Lever Pivot Constraint with Angular Drive",
      prompt:
        "<p><strong>Collision profiles</strong> are confirmed correct, with both <strong>Piston</strong> and <strong>Lever</strong> blocking as intended. If the <strong>Lever's</strong> rotation is *still* slightly jittery or inconsistent, even after all previous adjustments, what could be causing minor instability at its pivot point?</p>",
      choices: [
        {
          text: "<p>Examine the <strong>Physics Constraint</strong> that defines the <strong>Lever's</strong> pivot. Increase the <code>Angular Drive</code> stiffness/damping slightly (e.g., <code>Stiffness</code> 1000) to stabilize the rotation without locking it. How do you investigate this?</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.35hrs. A small amount of `Angular Drive` stiffness or damping on the pivot constraint can help stabilize rotation, preventing minor oscillations or jitters that might arise from slight inaccuracies in the physics engine or complex force interactions, without preventing the desired movement. This acts as a gentle correctional force.</p>",
          next: "step-14",
        },
        {
          text: "<p>Increase the overall <strong>Physics Substep Count</strong> in <strong>World Settings</strong> dramatically to try and eliminate micro-jitters. What action do you take?</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.2hrs. While substeps can help with accuracy, dramatically increasing them is a performance-heavy solution and often indicates a masking of an underlying issue rather than a direct fix for minor constraint instability. It's an inefficient approach.</p>",
          next: "step-13",
        },
        {
          text: "<p>Apply a continuous, small <strong>Angular Impulse</strong> to the <strong>Lever</strong> via <strong>Blueprint</strong> to help it rotate more smoothly. How do you investigate this?</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.15hrs. Manually applying impulses to compensate for physics behavior is generally discouraged. It can fight against the simulation, leading to unpredictable results and making the system harder to debug and maintain. The constraint's `Angular Drive` is designed for this kind of stabilization.</p>",
          next: "step-13",
        },
        {
          text: "<p>Reduce the <strong>Lever's Static Mesh's Physics Material's Restitution</strong> to prevent bouncing. How should you proceed?</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. Restitution (bounciness) primarily affects collisions. While it could contribute to instability in very specific scenarios, the jitter at the *pivot* point is more directly influenced by the constraint's angular properties like stiffness and damping, rather than collision bounciness.</p>",
          next: "step-13",
        },
      ],
    },
    "step-14": {
      skill: "physicscollisions",
      image_path: "assets/generated/PhysicsLeverFailure/step-14.png",
      title: "Final System Test and Cleanup",
      prompt:
        "<p>All identified issues, from constraint setup to mass, damping, motor force, and minor pivot instability, have been addressed. The system should now be working as intended. What is the final step in confirming the fix and tidying up the debugging environment?</p>",
      choices: [
        {
          text: "<p>Test the system and confirm the <strong>Lever</strong> rotates smoothly the full required distance, then disable physics debug visualization (<code>pxvis collision</code>, <code>pxvis constraints</code>). How do you proceed?</p>",
          type: "correct",
          feedback:
            "<p><strong>Optimal Time:</strong> +0.15hrs. Final comprehensive testing verifies the solution. Disabling debug visualizations ensures optimal performance and a clean viewport for further development, restoring the environment to a production-ready state.</p>",
          next: "conclusion",
        },
        {
          text: "<p>Run the <strong>Game in Standalone Mode</strong> to confirm performance, then immediately proceed to the next task. What action do you take?</p>",
          type: "obvious",
          feedback:
            "<p><strong>Extended Time:</strong> +0.1hrs. While running in standalone is good for performance testing, the primary goal here is to confirm the *functionality* of the physics system. Skipping a thorough functional test is premature. Also, leaving debug visualizations enabled is poor practice.</p>",
          next: "step-14",
        },
        {
          text: "<p>Take a screenshot of the debug visualization to document the successful state. How do you investigate this?</p>",
          type: "plausible",
          feedback:
            "<p><strong>Extended Time:</strong> +0.05hrs. Documentation is good, but the immediate priority is to confirm the *behavior* of the system and then disable the performance-impacting debug tools. Taking a screenshot without confirming the full behavior is premature.</p>",
          next: "step-14",
        },
        {
          text: "<p>Increase the <strong>Lever's rotation angle</strong> in the <strong>Blueprint</strong> to 90 degrees to add a buffer. How should you proceed?</p>",
          type: "subtle",
          feedback:
            "<p><strong>Extended Time:</strong> +0.05hrs. The prompt specifies a required 80-degree rotation. Arbitrarily increasing the target angle without a design requirement is an unnecessary change and not a debugging step. Focus should be on meeting the original specification.</p>",
          next: "step-14",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      image_path: "assets/generated/PhysicsLeverFailure/conclusion.png",
      title: "Scenario Complete",
      prompt:
        "<p>Congratulations! You have successfully debugged the physics constraint failure. You've mastered: Angular/Linear constraints, Mass balancing, Angular Damping, Motor velocity tuning, Collision profiles, and Angular Drive stabilization.</p>",
      choices: [
        {
          text: "Complete Scenario",
          type: "correct",
          feedback: "You've mastered UE5 physics constraint debugging!",
          next: "end",
        },
      ],
    },
  },
};
