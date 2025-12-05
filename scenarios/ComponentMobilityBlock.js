window.SCENARIOS['ComponentMobilityBlock'] = {
    "meta": {
        "title": "Large Wreckage Ignores Physics Simulation",
        "description": "We have an environmental Actor Blueprint called 'BP_HeavyDebris' containing a large Static Mesh intended to be pushed or moved dynamically by the player and explosions. In the level, smaller physics objects react correctly, but the BP_HeavyDebris object acts like solid, immovable world geometry. When attempting to apply a radial force or push it, it remains completely stationary, despite having 'Simulate Physics' checked on its mesh component. No physics movement warnings are displayed in the editor viewport or log.",
        "estimateHours": 0.75,
        "category": "Physics & Collisions"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "physicscollisions",
            "title": "Step 1",
            "prompt": "<p>Use the 'Simulate Physics' debug visualization (Show > Visualize > Simulation) or use gameplay (PIE) to confirm that the 'BP_HeavyDebris' actor is indeed failing to react to forces, while other nearby physics objects are behaving normally.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Use the 'Simulate Physics' debug visualization (Show > Visualize > Simulation) or use gameplay (PIE) to confirm that the 'BP_HeavyDebris' actor is indeed failing to react to forces, while other nearby physics objects are behaving normally.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Spending time investigating the Blueprint Event Graph for misplaced 'Apply Impulse' or 'Add Force' nodes, assuming the physics forces are not being called correctly.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "physicscollisions",
            "title": "Step 2",
            "prompt": "<p>Select the problematic 'BP_HeavyDebris' Actor instance in the Level Outliner.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select the problematic 'BP_HeavyDebris' Actor instance in the Level Outliner.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.03hrs. Correct approach.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Changing the 'Collision Preset' from 'BlockAll' to a custom Physics preset, mistakenly believing the collision profile is the issue rather than the component's mobility requirement for simulation.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "physicscollisions",
            "title": "Step 3",
            "prompt": "<p>Click the 'Edit BP' button in the Details panel to open the Blueprint Editor for BP_HeavyDebris.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Click the 'Edit BP' button in the Details panel to open the Blueprint Editor for BP_HeavyDebris.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Adjusting global physics settings in Project Settings (e.g., gravity or substeps) which affects all objects equally, rather than focusing on the single problematic actor.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "physicscollisions",
            "title": "Step 4",
            "prompt": "<p>Navigate to the Components panel and select the primary Static Mesh Component (named 'SM_WreckagePile') that is supposed to be simulating physics.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Navigate to the Components panel and select the primary Static Mesh Component (named 'SM_WreckagePile') that is supposed to be simulating physics.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Spending time investigating the Blueprint Event Graph for misplaced 'Apply Impulse' or 'Add Force' nodes, assuming the physics forces are not being called correctly.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "physicscollisions",
            "title": "Step 5",
            "prompt": "<p>In the Details panel for the 'SM_WreckagePile' component, scroll down to the 'Physics' category and confirm that the 'Simulate Physics' checkbox is enabled (checked).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Details panel for the 'SM_WreckagePile' component, scroll down to the 'Physics' category and confirm that the 'Simulate Physics' checkbox is enabled (checked).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Changing the 'Collision Preset' from 'BlockAll' to a custom Physics preset, mistakenly believing the collision profile is the issue rather than the component's mobility requirement for simulation.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "physicscollisions",
            "title": "Step 6",
            "prompt": "<p>Explain the prerequisite: Physics simulation requires the object to be capable of dynamic movement, which is determined by the component's Mobility setting.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Explain the prerequisite: Physics simulation requires the object to be capable of dynamic movement, which is determined by the component's Mobility setting.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.08hrs. Correct approach.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Adjusting global physics settings in Project Settings (e.g., gravity or substeps) which affects all objects equally, rather than focusing on the single problematic actor.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "physicscollisions",
            "title": "Step 7",
            "prompt": "<p>Scroll up within the Details panel to the 'Transform' category, which contains the 'Mobility' setting for the component.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Scroll up within the Details panel to the 'Transform' category, which contains the 'Mobility' setting for the component.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Spending time investigating the Blueprint Event Graph for misplaced 'Apply Impulse' or 'Add Force' nodes, assuming the physics forces are not being called correctly.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "physicscollisions",
            "title": "Step 8",
            "prompt": "<p>Observe that the 'Mobility' setting is currently set to 'Static'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Observe that the 'Mobility' setting is currently set to 'Static'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.04hrs. Correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Changing the 'Collision Preset' from 'BlockAll' to a custom Physics preset, mistakenly believing the collision profile is the issue rather than the component's mobility requirement for simulation.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "physicscollisions",
            "title": "Step 9",
            "prompt": "<p>Change the 'Mobility' dropdown selection from 'Static' to 'Movable'.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Change the 'Mobility' dropdown selection from 'Static' to 'Movable'.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Adjusting global physics settings in Project Settings (e.g., gravity or substeps) which affects all objects equally, rather than focusing on the single problematic actor.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "physicscollisions",
            "title": "Step 10",
            "prompt": "<p>Save the changes to the 'BP_HeavyDebris' Blueprint.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Save the changes to the 'BP_HeavyDebris' Blueprint.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Spending time investigating the Blueprint Event Graph for misplaced 'Apply Impulse' or 'Add Force' nodes, assuming the physics forces are not being called correctly.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "physicscollisions",
            "title": "Step 11",
            "prompt": "<p>Compile the 'BP_HeavyDebris' Blueprint to ensure the mobility change is applied across all instances.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Compile the 'BP_HeavyDebris' Blueprint to ensure the mobility change is applied across all instances.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Changing the 'Collision Preset' from 'BlockAll' to a custom Physics preset, mistakenly believing the collision profile is the issue rather than the component's mobility requirement for simulation.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.15hrs. This approach wastes time.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "physicscollisions",
            "title": "Step 12",
            "prompt": "<p>Return to the main level editor and press Play (PIE).</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Return to the main level editor and press Play (PIE).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.05hrs. Correct approach.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Adjusting global physics settings in Project Settings (e.g., gravity or substeps) which affects all objects equally, rather than focusing on the single problematic actor.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.1hrs. This approach wastes time.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "physicscollisions",
            "title": "Step 13",
            "prompt": "<p>Test the interaction again (e.g., shooting it or walking into it heavily) and verify that the wreckage now correctly simulates physics and moves dynamically.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Test the interaction again (e.g., shooting it or walking into it heavily) and verify that the wreckage now correctly simulates physics and moves dynamically.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time Logged:</strong> 0.1hrs. Correct approach.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Spending time investigating the Blueprint Event Graph for misplaced 'Apply Impulse' or 'Add Force' nodes, assuming the physics forces are not being called correctly.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time Logged:</strong> +0.25hrs. This approach wastes time.</p>",
                    "next": "step-13"
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
