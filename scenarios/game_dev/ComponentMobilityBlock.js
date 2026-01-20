window.SCENARIOS['ComponentMobilityBlock'] = {
    "meta": {
        "title": "Large Wreckage Ignores Physics Simulation",
        "description": "We have an environmental Actor Blueprint called 'BP_HeavyDebris' containing a large Static Mesh intended to be pushed or moved dynamically by the player and explosions. In the level, smaller physics objects react correctly, but the BP_HeavyDebris object acts like solid, immovable world geometry. When attempting to apply a radial force or push it, it remains completely stationary, despite having 'Simulate Physics' checked on its mesh component. No physics movement warnings are displayed in the editor viewport or log.",
        "estimateHours": 0.75,
        "category": "Physics & Collisions",
        "tokens_used": 9764
    },
    "setup": [
        {
            "action": "set_ue_property",
            "scenario": "ComponentMobilityBlock",
            "step": "step-0"
        }
    ],
    "fault": {
        "description": "Initial problem state",
        "visual_cue": "Visual indicator"
    },
    "expected": {
        "description": "Expected resolved state",
        "validation_action": "verify_fix"
    },
    "fix": [
        {
            "action": "set_ue_property",
            "scenario": "ComponentMobilityBlock",
            "step": "final"
        }
    ],
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "physicscollisions",
            "title": "Confirm Physics Failure",
            "prompt": "<p><strong>BP_HeavyDebris</strong> is stationary in <strong>PIE</strong>, despite 'Simulate Physics'. Other objects react. No log warnings. How do you confirm this failure to simulate?</p>",
            "choices": [
                {
                    "text": "<p>Activate <strong>Show &gt; Visualize &gt; Simulation</strong> and observe the object's behavior in PIE.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Visualizing physics simulation in Play In Editor (PIE) is an excellent first step to confirm the issue and observe how the physics engine is (or isn't) treating the object.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Adjust global physics settings in <strong>Project Settings</strong>, like <code>Default Gravity Z</code>, to see if it moves.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.1hrs. Adjusting global physics settings affects all objects equally and isn't a focused way to debug a single problematic actor. This wastes time on a system-wide change rather than isolating the issue.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Open the <strong>Blueprint Editor</strong> for <strong>BP_HeavyDebris</strong> and immediately look at the <strong>Event Graph</strong> for missing force application nodes.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.25hrs. While force application could be an issue, the prompt states 'attempting to apply a radial force or push it', implying forces *are* being applied. The core problem is the object *not reacting*, rather than forces not being *called*. Investigating the Event Graph prematurely is a significant detour.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Check <strong>Task Manager</strong> to see if the game process is under too much CPU load.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. This is an external diagnostic tool not relevant to specific UE5 actor behavior. UE5 provides its own profiling tools if performance were suspected to be the cause, but the symptoms point to a configuration issue.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "physicscollisions",
            "title": "Select Problematic Actor",
            "prompt": "<p>You've confirmed the <strong>BP_HeavyDebris</strong> instance fails physics. What's your next move to inspect its properties?</p>",
            "choices": [
                {
                    "text": "<p>Select the <strong>BP_HeavyDebris</strong> <strong>Actor instance</strong> directly in the <strong>Level Outliner</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.03hrs. Selecting the specific actor instance in the <strong>Level Outliner</strong> or viewport allows you to access its properties in the <strong>Details</strong> panel and begin inspecting its configuration.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Open <strong>Project Settings</strong> and review global physics presets.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.1hrs. While physics presets exist, the issue is with a single actor, suggesting a local override or misconfiguration rather than a global problem. Focusing on the actor itself is more efficient.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Search the <strong>Content Browser</strong> for 'BP_HeavyDebris' and open the static mesh asset directly.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Opening the static mesh asset itself would show properties of the mesh, but not necessarily how it's configured within the Blueprint or the specific instance in the level, which is where the problem lies. The Blueprint Actor wraps the mesh.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Right-click the actor in the viewport and choose <code>Delete</code> to remove the problem.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Deleting the actor is not a debugging step; it simply removes the problem without solving it, preventing proper assessment.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "physicscollisions",
            "title": "Access Blueprint Editor",
            "prompt": "<p>You've selected the <strong>BP_HeavyDebris</strong> instance. To inspect its configuration, how do you access its Blueprint settings?</p>",
            "choices": [
                {
                    "text": "<p>Click the <code>Edit BP</code> button in the <strong>Details</strong> panel to open the <strong>Blueprint Editor</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. The <code>Edit BP</code> button in the <strong>Details</strong> panel (when an Actor Blueprint instance is selected) is the correct way to open and modify the Blueprint's definition.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Use the <strong>World Settings</strong> panel to look for actor-specific overrides.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. <strong>World Settings</strong> contain properties that affect the entire level, not individual Blueprint actors. While some overrides can exist, they're not where the core Blueprint configuration is found.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Check the <strong>Output Log</strong> for 'Blueprint Editor' entries.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The <strong>Output Log</strong> displays messages, warnings, and errors, but it's not an interface for directly opening or interacting with the <strong>Blueprint Editor</strong>.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Type <code>open blueprint BP_HeavyDebris</code> into the <strong>Console</strong>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While some commands exist, opening a specific Blueprint for editing is typically done via the UI. Relying on console commands for common editor tasks is inefficient and often incorrect.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "physicscollisions",
            "title": "Select Mesh Component",
            "prompt": "<p>In <strong>BP_HeavyDebris Blueprint Editor</strong>, examine the <strong>Static Mesh Component</strong>. How do you locate its settings?</p>",
            "choices": [
                {
                    "text": "<p>Navigate to the <strong>Components</strong> panel and select the <strong>Static Mesh Component</strong> named 'SM_WreckagePile'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. In the <strong>Blueprint Editor</strong>, the <strong>Components</strong> panel lists all components within the Blueprint, allowing you to select the specific <strong>Static Mesh Component</strong> and inspect its details.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Examine the <strong>Event Graph</strong> for any nodes related to 'SM_WreckagePile'.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. The <strong>Event Graph</strong> handles logic, but direct component properties like physics simulation are found in the <strong>Details</strong> panel after selecting the component, not in event nodes. This is a common time-wasting detour.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Look in the <strong>My Blueprint</strong> panel for variables named 'SM_WreckagePile'.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. The <strong>My Blueprint</strong> panel contains variables, functions, and macros. While a reference to the mesh might be a variable, the mesh component itself is listed in the <strong>Components</strong> panel.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Go to the <strong>Construction Script</strong> to see how 'SM_WreckagePile' is set up.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The <strong>Construction Script</strong> executes once when the Blueprint is placed or compiled, for setup logic. It's not the primary place to inspect a component's fundamental properties; the <strong>Details</strong> panel is.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "physicscollisions",
            "title": "Verify Simulate Physics Setting",
            "prompt": "<p>You selected 'SM_WreckagePile' <strong>Static Mesh Component</strong>. Where in its <strong>Details</strong> panel do you look for <code>Simulate Physics</code>?</p>",
            "choices": [
                {
                    "text": "<p>Scroll down to the <strong>Physics</strong> category in the <strong>Details</strong> panel.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. The <strong>Physics</strong> category in the <strong>Details</strong> panel is the dedicated section for configuring physics-related properties of a component, including <code>Simulate Physics</code>.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Check the <strong>Collision</strong> category for collision profiles.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While related, the <strong>Collision</strong> category primarily defines how objects interact upon contact. It's distinct from the <strong>Physics</strong> category, which governs dynamic simulation. Changing collision presets here is a common wrong turn when physics don't work.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Look under the <strong>Rendering</strong> category for visibility settings.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. The <strong>Rendering</strong> category controls how the mesh is displayed visually, not how it behaves physically. This is unrelated to physics simulation.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Search for 'Simulate' using the search bar at the top of the <strong>Details</strong> panel.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While using the search bar can be helpful, understanding the category structure (like 'Physics') is more efficient and demonstrates better knowledge of the editor's layout.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "physicscollisions",
            "title": "Interpret Simulate Physics State",
            "prompt": "<p><code>Simulate Physics</code> is checked for 'SM_WreckagePile', but it's stationary. What does this imply about the root cause?</p>",
            "choices": [
                {
                    "text": "<p>The issue is likely not whether physics is enabled, but a prerequisite for dynamic movement is missing.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.08hrs. If <code>Simulate Physics</code> is checked but the object remains static, it strongly suggests that another fundamental requirement for dynamic physics, beyond simply enabling simulation, has not been met. This points towards the object's ability to move.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>The physics engine itself is likely bugged or configured incorrectly at a project level.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.1hrs. While possible in rare cases, assuming a bug in the engine when other physics objects work correctly is usually a misdiagnosis. It's more likely a specific configuration issue with the problematic actor.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>The <strong>Collision Preset</strong> is probably set incorrectly, preventing movement.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. An incorrect <strong>Collision Preset</strong> can cause objects to get stuck or behave unexpectedly, but if <code>Simulate Physics</code> is on and it's completely immovable, it's more fundamental than just collision filtering. This is a common but often incorrect assumption.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>The object is too heavy for the default physics settings and needs a higher <code>Mass Scale</code>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While <code>Mass Scale</code> affects how forces impact an object, it doesn't prevent physics simulation entirely. An object with a very high mass would still *attempt* to simulate and likely show some very minor displacement or warnings, not remain completely stationary.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "physicscollisions",
            "title": "Identify Mobility Prerequisite",
            "prompt": "<p>A dynamic movement prerequisite is missing for 'SM_WreckagePile'. What is this setting, and where in <strong>Details</strong> do you find it?</p>",
            "choices": [
                {
                    "text": "<p>The <code>Mobility</code> setting, found in the <strong>Transform</strong> category.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.08hrs. The <code>Mobility</code> setting (Static, Stationary, Movable) dictates whether an object can be transformed or moved dynamically at runtime. For physics simulation, it must be <code>Movable</code>. It's located within the <strong>Transform</strong> category.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>The <code>Lightmap Resolution</code> setting, found in the <strong>Lighting</strong> category.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. <code>Lightmap Resolution</code> is related to how lighting is baked onto static objects. It has no bearing on an object's ability to simulate physics or move dynamically.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>The <code>Render CustomDepth Pass</code> setting, in the <strong>Rendering</strong> category.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. <code>Render CustomDepth Pass</code> is a rendering feature used for post-processing or outline effects. It's completely unrelated to physics simulation or an object's mobility.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>The <code>Physics Asset</code> setting, in the <strong>Physics</strong> category.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. A <strong>Physics Asset</strong> is primarily for skeletal meshes to define their physical representation and ragdolls. While relevant to some physics, it's not the fundamental 'mobility' setting for a generic <strong>Static Mesh Component</strong> to simulate physics.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "physicscollisions",
            "title": "Locate Mobility Setting",
            "prompt": "<p>You need to check <code>Mobility</code> for 'SM_WreckagePile' in <strong>Transform</strong>. How do you view this setting?</p>",
            "choices": [
                {
                    "text": "<p>Scroll up within the <strong>Details</strong> panel to the <strong>Transform</strong> category.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Navigating to the correct category in the <strong>Details</strong> panel is the direct way to find the <code>Mobility</code> setting.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Use the search bar in the <strong>Details</strong> panel and type 'Mobility'.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. While functional, explicitly knowing the category demonstrates a better understanding of the editor's organization. Scrolling is also efficient here.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Click on the <strong>Static Mesh Component</strong> in the <strong>Viewport</strong> panel to reveal a contextual menu.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Clicking in the viewport might bring up a context menu, but it won't directly show you the <strong>Details</strong> panel's categories and settings in the same organized way as selecting the component in the <strong>Components</strong> panel.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Open the <strong>World Outliner</strong> and look for <strong>Mobility</strong> settings there.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The <strong>World Outliner</strong> lists actors, but individual component properties are found in the <strong>Details</strong> panel when the component is selected, not directly in the outliner itself.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "physicscollisions",
            "title": "Observe Current Mobility",
            "prompt": "<p>You are in the <strong>Transform</strong> category for 'SM_WreckagePile'. What is the current setting for <code>Mobility</code>?</p>",
            "choices": [
                {
                    "text": "<p>The <code>Mobility</code> setting is currently <code>Static</code>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.04hrs. Observing that <code>Mobility</code> is <code>Static</code> is the key finding that explains why physics simulation is not occurring. Static objects are optimized for immobility.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>The <code>Mobility</code> setting is currently <code>Movable</code>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. If <code>Mobility</code> were already <code>Movable</code>, then this would not be the cause of the issue, and you would need to re-evaluate previous assumptions. This choice indicates a misobservation.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>The <code>Mobility</code> setting is currently <code>Stationary</code>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. <code>Stationary</code> objects can move or rotate during editor time, but they cannot move dynamically at runtime while simulating physics. They are still not <code>Movable</code>, but it's less overtly 'wrong' than <code>Static</code> if you don't grasp the nuance.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>There is no <code>Mobility</code> setting visible for this component.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. This is incorrect. The <code>Mobility</code> setting is a fundamental property for all <strong>Static Mesh Components</strong> and is always visible in the <strong>Transform</strong> category.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "physicscollisions",
            "title": "Change Mobility Setting",
            "prompt": "<p><code>Mobility</code> for 'SM_WreckagePile' is <code>Static</code>. To enable physics, what adjustment do you make?</p>",
            "choices": [
                {
                    "text": "<p>Change the <code>Mobility</code> dropdown selection from <code>Static</code> to <code>Movable</code>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Setting the <code>Mobility</code> to <code>Movable</code> allows the component to be transformed dynamically at runtime, which is a prerequisite for physics simulation. This is the core fix.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Change the <code>Mobility</code> dropdown selection from <code>Static</code> to <code>Stationary</code>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While <code>Stationary</code> is 'less static' than <code>Static</code>, it still does not allow for full dynamic physics simulation. <code>Stationary</code> is for objects that have baked lighting but can undergo editor-time transforms or simple runtime rotations without physics.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Delete the component and re-add it, hoping it defaults to <code>Movable</code>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. This is an unnecessarily destructive and unreliable approach. Directly changing the setting is the correct and efficient method. It might default to <code>Static</code> again anyway.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Adjust the <code>Collision Preset</code> to ensure it doesn't block movement.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. The <code>Collision Preset</code> defines how the object collides, but it doesn't control its fundamental ability to move at all. This is a common but incorrect assumption when physics fail.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "physicscollisions",
            "title": "Save Blueprint Changes",
            "prompt": "<p><code>Mobility</code> is changed. <strong>Blueprint Editor</strong> has unsaved changes. How do you preserve them?</p>",
            "choices": [
                {
                    "text": "<p>Click the <code>Save</code> button in the <strong>Blueprint Editor</strong> toolbar.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Saving the <strong>Blueprint</strong> is crucial to persist any modifications made within the <strong>Blueprint Editor</strong>. Unsaved changes will be lost.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Close the <strong>Blueprint Editor</strong> and click 'Don't Save' to revert.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Selecting 'Don't Save' would discard your fix, forcing you to repeat all previous steps.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Export the <strong>Blueprint</strong> to a text file as a backup.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While backing up is good practice in general, it's not the direct action needed to *apply* the changes within the engine. Saving is the primary mechanism.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Type <code>saveall</code> in the <strong>Console</strong> to save all open assets.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While <code>saveall</code> would eventually save it, directly using the <strong>Blueprint Editor</strong>'s Save button is the most targeted and efficient action for the current context.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "physicscollisions",
            "title": "Compile Blueprint",
            "prompt": "<p>You saved <strong>BP_HeavyDebris</strong>. What final step ensures changes are active for all instances?</p>",
            "choices": [
                {
                    "text": "<p>Click the <code>Compile</code> button in the <strong>Blueprint Editor</strong> toolbar.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. Compiling the <strong>Blueprint</strong> processes the changes and makes them active throughout the editor and runtime, ensuring the new <code>Mobility</code> setting is applied to all instances.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Close and reopen the <strong>Blueprint Editor</strong> to refresh its state.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Closing and reopening might sometimes refresh minor visual aspects, but it does not perform the critical compilation step needed to apply fundamental changes like <code>Mobility</code>.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Right-click the <strong>BP_HeavyDebris</strong> asset in the <strong>Content Browser</strong> and select <code>Refresh Asset</code>.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. <code>Refresh Asset</code> is generally for re-importing or updating asset data from external sources, not for applying internal Blueprint logic or property changes. Compilation is the correct process.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Run a <strong>Build All</strong> operation in the main editor to rebuild the level.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. <strong>Build All</strong> primarily deals with lighting, navigation, and other level-wide static data. It's not necessary for applying Blueprint logic or component property changes; compilation handles that.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "physicscollisions",
            "title": "Return to Level and Test",
            "prompt": "<p>You saved and compiled <strong>BP_HeavyDebris</strong>. Changes are active. How do you verify the fix in game?</p>",
            "choices": [
                {
                    "text": "<p>Return to the main level editor and press <code>Play</code> (PIE).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. The fastest way to test gameplay changes is to return to the main editor and enter <strong>Play In Editor</strong>, allowing for direct interaction and observation of the object.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Launch the game as a standalone executable to avoid editor overhead.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.1hrs. While useful for final testing, launching a standalone game adds significant overhead (packaging, loading times) compared to the rapid iteration provided by <strong>PIE</strong>, making it inefficient for immediate verification.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Re-bake all lighting in the level to ensure the mobility change is registered.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Baking lighting is only necessary if the object's lighting interaction has changed. The <code>Mobility</code> change for physics simulation doesn't inherently require a lighting rebuild.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Check the <strong>Output Log</strong> for messages indicating successful physics simulation.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While the log can show errors, successful physics simulation is primarily verified visually and through interaction, not by specific log messages. Trust your eyes and gameplay.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "physicscollisions",
            "title": "Verify Dynamic Behavior",
            "prompt": "<p>In <strong>PIE</strong>, you apply force to <strong>BP_HeavyDebris</strong>. What confirms the physics fix?</p>",
            "choices": [
                {
                    "text": "<p>The wreckage now correctly simulates physics, moving dynamically in response to forces.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. Observing the object reacting dynamically to forces, such as being pushed or moved by explosions, directly confirms that the <code>Mobility</code> change enabled physics simulation correctly.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>The object displays a red wireframe outline, indicating it's now a physics body.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. A red wireframe might appear if <strong>Visualize Simulation</strong> is active and showing physics data, but the primary verification is the actual *movement*, not just a visual debugging aid.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>The object remains perfectly stationary, indicating the fix was unsuccessful.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. If this were the case, it means the fix was indeed unsuccessful, and you would need to re-evaluate what was missed or misconfigured. This choice indicates a failed verification.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>The console prints a 'Physics Enabled' message upon hitting the object.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. Unreal Engine typically doesn't print such explicit 'Physics Enabled' messages to the console during normal gameplay interaction. Visual and behavioral confirmation is key.</p>",
                    "next": "step-14"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario. By correctly identifying and changing the <strong>Static Mesh Component's Mobility</strong> from <code>Static</code> to <code>Movable</code>, you enabled the <strong>BP_HeavyDebris</strong> object to simulate physics dynamically.</p>",
            "choices": [{"text": "Complete Scenario", "type": "correct", "feedback": "", "next": "end"}]
        }
    }
};
