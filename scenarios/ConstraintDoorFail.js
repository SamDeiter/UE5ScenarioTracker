window.SCENARIOS['ConstraintDoorFail'] = {
    "meta": {
        "title": "Immovable Physics Constrained Skeletal Mesh Door",
        "description": "We have a large, modular steel door modeled as a Skeletal Mesh, anchored to a static door frame using a Physics Constraint component. When a large explosion occurs next to it (triggered by a Blueprint using a Radial Force component), nearby static props are launched across the room correctly. However, the steel door barely moves, ignoring the massive force. It is supposed to break its constraints and ragdoll/fall apart realistically upon impact.",
        "estimateHours": 1.5,
        "category": "Physics & Collisions",
        "tokens_used": 11354
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "physicscollisions",
            "title": "Observe Initial Behavior",
            "prompt": "<p>The large steel door barely moves after a massive explosion. Nearby static props react correctly, but the door remains anchored. How do you begin investigating why the door ignores the force?</p>",
            "choices": [
                {
                    "text": "<p>Open the <strong>Door Blueprint</strong> to examine its components and internal logic.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Starting with the door's Blueprint is the most direct way to access its specific configuration and behavior.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Review <strong>Project Settings > Physics</strong> for global physics configuration issues.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.2hrs. While relevant for global behavior, a component-specific issue is unlikely to be a default project setting. This is a common detour that wastes time.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Rebuild <strong>Lighting</strong>, assuming a visual glitch is preventing proper physics.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Lighting builds affect visuals, not directly physics simulation or force application. This is an unrelated action.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Examine the door's <strong>Material Instance</strong> to check its physical properties.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While <strong>Physical Materials</strong> can influence friction and restitution, they don't prevent force application or constraint breaking in this manner. It's too early to check.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "physicscollisions",
            "title": "Inspect Skeletal Mesh Physics Setting",
            "prompt": "<p>Inside the <strong>Door Blueprint</strong>, which component's physics settings are most relevant for a ragdoll/breakaway effect?</p>",
            "choices": [
                {
                    "text": "<p>Select the <strong>Skeletal Mesh</strong> component and inspect its <strong>Details</strong> panel.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. The <strong>Skeletal Mesh</strong> is the primary physical representation of the door, making its settings crucial for physics simulation.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Inspect the <strong>Physics Constraint</strong> component directly.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While the constraint is key, it's connected to the <strong>Skeletal Mesh</strong>. Understanding the mesh's base physics state is usually a prerequisite.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Review the door's associated <strong>Physics Asset</strong> for collision shape accuracy.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.3hrs. Regenerating or modifying the <strong>Physics Asset</strong> assumes a problem with collision geometry, which is not the immediate issue here. This is a significant time sink.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Examine the <strong>Static Mesh</strong> components of the surrounding door frame.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. The door frame is working correctly for other props; the problem is specific to the door itself.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "physicscollisions",
            "title": "Confirm Skeletal Mesh Simulate Physics State",
            "prompt": "<p>Within the <strong>Skeletal Mesh</strong> component's <strong>Details</strong> panel, what do you observe regarding its physics simulation?</p>",
            "choices": [
                {
                    "text": "<p>Observe that <code>Simulate Physics</code> is currently disabled, relying on the <strong>Physics Constraint</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. This is the expected state when a <strong>Physics Constraint</strong> is actively holding an object in place, as it should not simulate physics until the constraint breaks.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Notice that <code>Collision Presets</code> is set to <code>NoCollision</code>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. If <code>NoCollision</code> were set, it wouldn't be able to interact at all, but 'barely moves' suggests some interaction, just not the desired breakage. This isn't the primary observation.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Confirm that <code>Gravity</code> is enabled for the mesh.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Gravity is a default physics setting, but it won't prevent an explosion force or constraint from breaking. Focus on the core simulation state.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>See that <code>Mass Scale</code> is set to an extremely high value.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While high mass could reduce movement, it wouldn't prevent the application of force or the breaking of a constraint if configured. Not the first thing to check.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "blueprintlogic",
            "title": "Investigate Explosion Blueprint Logic",
            "prompt": "<p>The door isn't simulating physics independently. Other props react to the explosion. What's your next move to verify the explosion force is correctly targeting the door?</p>",
            "choices": [
                {
                    "text": "<p>Locate the <strong>Blueprint</strong> logic responsible for triggering the explosion and applying the force.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. This is critical to understanding how the force is generated and applied.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Manually add an <code>Add Impulse</code> node to the door in the <strong>Level Blueprint</strong>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.4hrs. Replacing the <strong>Radial Force Component</strong> with an <code>Add Impulse</code> node without diagnosing the original problem is a significant detour and won't fix the underlying channel mismatch. This is a major penalty.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Examine the door's <strong>Material Instance</strong> to check for damage resistance properties.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. Visual material properties do not directly control physics interactions or resistance to force application.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Adjust the door's <code>Mass Scale</code> in its <strong>Physics Asset</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While mass influences physics, the problem is about *force application* and *constraint breaking*, not just the door's inherent weight. Modifying the <strong>Physics Asset</strong> is also a common wrong step.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "blueprintlogic",
            "title": "Confirm Radial Force Component Activation",
            "prompt": "<p>You've found the explosion <strong>Blueprint</strong>. How do you confirm the <strong>Radial Force component</strong> within it is active and attempting to apply force?</p>",
            "choices": [
                {
                    "text": "<p>Confirm that the <strong>Radial Force component</strong> is being activated correctly upon event trigger.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Verifying activation ensures the force is attempting to be generated at all.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Change the <strong>Radial Force component</strong>'s <code>Radius</code> to a larger value.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Increasing the radius won't help if the component isn't activating or if other issues prevent interaction. Verify functionality first.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Modify the <strong>Blueprint</strong>'s execution order for the explosion event.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. This is an advanced debugging step and unlikely to be the primary issue if other props react correctly to the same event.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Check for overlapping <strong>Blocking Volumes</strong> around the explosion origin.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While <strong>Blocking Volumes</strong> can interfere, the issue is likely more specific to the door's interaction with the force, not a general blockage.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "physicscollisions",
            "title": "Examine Radial Force Strength",
            "prompt": "<p>The <strong>Radial Force component</strong> is activating. What specific properties are crucial to check to ensure the force is numerically strong enough to break a constraint?</p>",
            "choices": [
                {
                    "text": "<p>Examine the <strong>Radial Force Component</strong>'s properties, specifically <code>Force Strength</code> and <code>Impulse Strength</code>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. These values directly control the magnitude of the force applied. High values (e.g., 500,000) are expected for a massive explosion.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Adjust the <strong>Radial Force component</strong>'s <code>Falloff Exponent</code>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. This affects how force diminishes with distance, but won't fix a fundamental lack of initial strength or interaction.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Check the <strong>Radial Force component</strong>'s <code>Attenuation Shape</code>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. This defines the shape of the force, but not its strength. It's secondary to ensuring the force itself is powerful enough.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Increase the <strong>Door Blueprint</strong>'s global <code>Mass Scale</code>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Making the door heavier would make it *more* resistant to force, worsening the problem, not solving it.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "physicscollisions",
            "title": "Identify Radial Force Channel",
            "prompt": "<p>The <code>Force Strength</code> and <code>Impulse Strength</code> values are adequately high. What critical setting in the <strong>Radial Force component</strong> determines *which types of objects* it will interact with?</p>",
            "choices": [
                {
                    "text": "<p>Identify the <strong>Radial Force Component</strong>'s <code>Force Channel</code> property. Note that it is set to <code>Visibility</code>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. This setting is crucial as it dictates the trace/query channel used to find objects to apply force to.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Change the <strong>Radial Force component</strong>'s <code>Impulse Strength</code> to an even higher value.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. If the force isn't registering at all, increasing its magnitude further won't solve the underlying interaction issue.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Look for <strong>Overlap Events</strong> on the door's <strong>Skeletal Mesh</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While overlaps are related to collision, <strong>Radial Force</strong> primarily uses a trace/query channel, not necessarily overlap events, to apply force.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Examine the door's <strong>Physics Material</strong> in its <strong>Skeletal Mesh</strong>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. <strong>Physics Materials</strong> affect friction and restitution, not whether an object registers a hit from a force channel.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "physicscollisions",
            "title": "Check Door Skeletal Mesh Collision Settings",
            "prompt": "<p>The <strong>Radial Force component</strong> uses <code>Force Channel: Visibility</code>. Where do you now check how the door's <strong>Skeletal Mesh</strong> is configured to *respond* to this specific channel?</p>",
            "choices": [
                {
                    "text": "<p>Select the <strong>Skeletal Mesh Component</strong> of the door and navigate to its <strong>Collision</strong> settings.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. The <strong>Collision</strong> settings on the component itself determine how it interacts with various trace and overlap channels.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Inspect the door's <strong>Physics Asset</strong> for collision geometry discrepancies.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.3hrs. This reintroduces the wrong assumption that collision *shapes* are the problem, leading to unnecessary work on the <strong>Physics Asset</strong>.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Review the <strong>Project Settings > Collision</strong> for global channel definitions.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While global channels are defined there, the component's *response* to those channels is set on the component itself, not globally.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Check the <strong>Door Blueprint</strong>'s <strong>Event Graph</strong> for custom collision handling logic.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. The problem is about fundamental collision *response*, not custom Blueprint logic that would typically process *after* a hit is registered.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "physicscollisions",
            "title": "Verify Collision Response to Visibility Channel",
            "prompt": "<p>Within the <strong>Skeletal Mesh Component</strong>'s <strong>Collision Responses</strong>, what specific setting are you looking for regarding the <code>Visibility</code> channel?</p>",
            "choices": [
                {
                    "text": "<p>Verify that the <strong>Skeletal Mesh Component</strong>'s response to the <code>Visibility</code> trace channel is currently set to <code>Ignore</code>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. This is the key observation: the door is ignoring the very channel the Radial Force uses to detect objects, preventing force application.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Change the overall <code>Collision Preset</code> to <code>BlockAll</code>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Changing to a generic preset might have unintended side effects and isn't as precise as targeting the specific channel.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Check if <code>Generate Overlap Events</code> is enabled for the mesh.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. <strong>Radial Force</strong> primarily uses trace queries, not overlap events, to apply impulses. This is a distraction.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Adjust the <strong>Collision Bounds</strong> of the <strong>Skeletal Mesh</strong>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Collision bounds determine the physical extent, but not the response behavior to specific channels once detected.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "physicscollisions",
            "title": "Correct Collision Response for Visibility",
            "prompt": "<p>The door's <strong>Skeletal Mesh</strong> is ignoring the <code>Visibility</code> channel, which the <strong>Radial Force</strong> uses. What action do you take to resolve this interaction issue?</p>",
            "choices": [
                {
                    "text": "<p>Change the <strong>Skeletal Mesh Component</strong>'s <strong>Collision Response</strong> for the <code>Visibility</code> channel from <code>Ignore</code> to <code>Block</code>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. This allows the <strong>Radial Force</strong> trace to register a hit on the door, enabling force application.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Create a new custom <strong>Collision Channel</strong> specifically for the explosion.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While possible, it's an unnecessary and more complex solution when an existing channel can be configured to work. It would require modifying the <strong>Radial Force</strong> too.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Enable <code>Generate Hit Events</code> on the <strong>Skeletal Mesh Component</strong>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Generating hit events allows <strong>Blueprint</strong> to react to hits, but it won't solve the fundamental problem of the force not registering due to the `Ignore` response.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Set <code>Collision Enabled</code> to <code>Query Only</code>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. <code>Query Only</code> means it detects collisions but doesn't react physically. We need it to <code>Block</code> for force application.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "testing",
            "title": "Test Collision Fix",
            "prompt": "<p>You've adjusted the door's <strong>Collision Response</strong> to <code>Block</code> the <code>Visibility</code> channel. What's your immediate next action?</p>",
            "choices": [
                {
                    "text": "<p>Test the explosion again in the editor to observe if the door reacts differently.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. It's crucial to test after each significant change to confirm the effect and identify the next problem if any.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Immediately proceed to adjust the <strong>Physics Constraint</strong> properties.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While the constraint is the next logical step, verifying the previous fix is essential to isolate problems. Don't skip testing.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Rebuild the <strong>Physics Assets</strong> for the door to ensure new collision settings apply.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Modifying collision responses on the component doesn't require rebuilding the <strong>Physics Asset</strong>. This is an unnecessary step.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Check <strong>Project Settings > Physics</strong> for new default values.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Changing component settings does not alter global project settings. This is a distraction.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "physicscollisions",
            "title": "Locate Physics Constraint Component",
            "prompt": "<p>The door now moves slightly, confirming the force registers, but it still fails to break its connection entirely. Which component is anchoring the door that needs to be configured for breakage?</p>",
            "choices": [
                {
                    "text": "<p>Select the <strong>Physics Constraint component</strong> (or its reference in the <strong>Blueprint</strong>) that links the door to the frame.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. The <strong>Physics Constraint</strong> is the component directly responsible for connecting and potentially breaking the door from its frame.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Examine the door's <strong>Material Instance</strong> for rigidity settings.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Material properties do not control the breaking behavior of a <strong>Physics Constraint</strong>.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Re-check the <strong>Skeletal Mesh Component</strong>'s <strong>Collision Responses</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. You've just fixed and verified this. The door moves, so collision is working. The new problem is about constraint breakage.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Look for <strong>Blocking Volumes</strong> around the constraint area.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. <strong>Blocking Volumes</strong> prevent movement, but not the breaking of a constraint itself when force is applied.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "physicscollisions",
            "title": "Access Constraint Limits",
            "prompt": "<p>You've selected the <strong>Physics Constraint component</strong>. Where in its <strong>Details</strong> panel would you find the settings to allow it to break?</p>",
            "choices": [
                {
                    "text": "<p>Navigate to the <strong>Constraint Limits</strong> section in the <strong>Physics Constraint</strong> details panel.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. This section contains all the options related to the constraint's behavior under stress, including breakage.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Check the <strong>Constraint Motors</strong> section.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. <strong>Constraint Motors</strong> are for actively driving movement, not for defining breakable thresholds.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Look for <strong>Parent/Child Bone</strong> settings.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. These settings define which bones the constraint links, not how it breaks.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Examine <strong>Constraint Instance</strong> properties.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While <strong>Constraint Instance</strong> holds the data, the specific relevant section for breakability is <strong>Constraint Limits</strong>.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "physicscollisions",
            "title": "Enable Constraint Breakable Option",
            "prompt": "<p>In the <strong>Constraint Limits</strong> section, you notice the <code>Breakable</code> option is unchecked. What action do you take to allow the constraint to be destroyed by sufficient force?</p>",
            "choices": [
                {
                    "text": "<p>Enable the <code>Breakable</code> checkbox for both <strong>Linear</strong> and <strong>Angular</strong> limits.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. This is the fundamental step to allow the constraint to respond to forces by breaking.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Increase the <strong>Constraint Damping</strong> for both linear and angular motion.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Damping would resist motion, but not enable breakage. It makes the constraint *stronger* in a way, not breakable.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Set <code>Constraint Mode</code> to <code>Locked</code> for all axes.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Locking the constraint would make it even more rigid and impossible to break, contrary to the goal.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Apply a custom <strong>Physics Material</strong> to the constraint.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. <strong>Physics Materials</strong> affect surface properties of physical bodies, not the breakability of a constraint component.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "physicscollisions",
            "title": "Review Linear Breakable Force",
            "prompt": "<p>With `Breakable` now enabled, what property in the <strong>Constraint Limits</strong> section determines the *linear force* required to break the constraint?</p>",
            "choices": [
                {
                    "text": "<p>Examine the <code>Linear Breakable Force</code> value, noting it is excessively high (e.g., 1,000,000,000).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. This value sets the threshold for linear force. A default extremely high value means it's practically unbreakable by typical in-game forces.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Adjust the <strong>Angular Breakable Torque</strong> first.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While important, addressing linear force first is generally the direct approach for an explosion that imparts a strong impulse.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Check the <strong>Constraint Location</strong> settings.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The location of the constraint defines its pivot, but not its breakability threshold.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Re-enable <code>Simulate Physics</code> on the door's <strong>Skeletal Mesh</strong>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. The <strong>Skeletal Mesh</strong> will automatically start simulating physics once its constraint breaks. Enabling it prematurely would cause issues.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "physicscollisions",
            "title": "Adjust Linear Breakable Force",
            "prompt": "<p>The <code>Linear Breakable Force</code> is currently set to an unrealistic, extremely high value. How do you configure it so a massive explosion can overcome it?</p>",
            "choices": [
                {
                    "text": "<p>Change the <code>Linear Breakable Force</code> to a realistic, lower value that the explosion can overcome (e.g., 50,000).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.2hrs. Reducing this threshold allows the explosion's linear impulse to break the constraint.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Set <code>Linear Breakable Force</code> to 0 to ensure it breaks instantly.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. A value of 0 would mean it breaks with any minuscule force, likely breaking at scene start, which is not the desired realistic effect.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Increase the <strong>Radial Force component</strong>'s <code>Impulse Strength</code> to match the constraint.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. While technically possible, it's generally better to set realistic constraint breakage limits than to endlessly scale up the force, especially if the current force is already massive.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Modify the <strong>Mass Scale</strong> of the door to make it lighter.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Reducing mass makes an object easier to move, but doesn't directly address the specific force required to *break* its constraint.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "physicscollisions",
            "title": "Review Angular Breakable Torque",
            "prompt": "<p>You've adjusted the <code>Linear Breakable Force</code>. What is the rotational equivalent within the <strong>Constraint Limits</strong> that also needs to be reviewed to ensure the door can fully break free and ragdoll?</p>",
            "choices": [
                {
                    "text": "<p>Examine the <code>Angular Breakable Torque</code> value, noting it is also excessively high.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. The explosion will also impart torque, and this value dictates the rotational force required to break the constraint's angular limits.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Test the explosion immediately after adjusting linear force.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Testing now might show partial breakage, but without adjusting angular limits, the door might still be rotationally constrained, leading to another round of debugging.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Review the <strong>Linear Limits</strong> again for consistency.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Linear limits are distinct from angular limits. This is a redundant check after already addressing linear force.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Change the <strong>Constraint Projection</strong> settings.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. <strong>Constraint Projection</strong> helps prevent joints from pulling apart too far, but doesn't control their breakability thresholds.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "physicscollisions",
            "title": "Adjust Angular Breakable Torque",
            "prompt": "<p>The <code>Angular Breakable Torque</code> is also set to an unrealistically high value. How do you adjust this to allow the explosion to break the rotational constraint, fully freeing the door?</p>",
            "choices": [
                {
                    "text": "<p>Change the <code>Angular Breakable Torque</code> to a realistic value (e.g., 100,000).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. This allows the angular forces from the explosion to overcome the constraint, completing the breakage.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Disable <strong>Angular Limits</strong> entirely.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Disabling limits would remove any rotational constraint, making the door immediately free or behave unnaturally, which isn't the goal.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Increase the <strong>Door Blueprint</strong>'s <code>Angular Damping</code>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Increasing damping would resist rotational motion, making it harder for the constraint to break, not easier.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Add an additional <strong>Physics Constraint</strong> for rotational stability.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. Adding more constraints adds complexity and wouldn't solve the issue of the existing constraint's breakable properties.</p>",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "testing",
            "title": "Final Testing and Verification",
            "prompt": "<p>You've now configured both linear and angular breakable forces for the <strong>Physics Constraint</strong>. What's your final step to confirm the door behaves as intended?</p>",
            "choices": [
                {
                    "text": "<p>Test the explosion one last time in the editor to verify the door breaks and ragdolls correctly.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Final testing confirms that all changes work together to produce the desired realistic effect.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Rebuild the <strong>Physics Asset</strong> for the door to ensure new physics settings are applied.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Changes to <strong>Physics Constraint</strong> properties do not require rebuilding the <strong>Physics Asset</strong>.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Check <strong>Project Settings > Physics</strong> for any new global issues that might have arisen.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Changes to component properties are local and won't affect global project settings. This is an unnecessary check.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Archive the <strong>Blueprint</strong> without testing to save time.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Skipping final verification is a critical mistake in debugging and could lead to deploying an unproven fix.</p>",
                    "next": "step-19"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario. The door now breaks its constraints and reacts realistically to the explosion. Total estimated time spent: ~1.3 hours.</p>",
            "choices": []
        }
    }
};
