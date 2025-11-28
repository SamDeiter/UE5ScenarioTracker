
window.SCENARIOS = window.SCENARIOS || {};

window.SCENARIOS['ComponentMobilityBlock'] = {
    meta: {
        title: "Large Wreckage Ignores Physics Simulation",
        description: "We have an environmental Actor Blueprint called 'BP_HeavyDebris' containing a large Static Mesh intended to be pushed or moved dynamically by the player and explosions. In the level, smaller physics objects react correctly, but the BP_HeavyDebris object acts like solid, immovable world geometry. When attempting to apply a radial force or push it, it remains completely stationary, despite having 'Simulate Physics' checked on its mesh component. No physics movement warnings are displayed in the editor viewport or log.",
        difficulty: "medium",
        category: "Physics & Collisions",
        estimate: 0.75
    },
    start: "step_1",
    steps: {
    "step_1": {
        "prompt": "We have an environmental Actor Blueprint called 'BP_HeavyDebris' containing a large Static Mesh intended to be pushed or moved dynamically by the player and explosions. In the level, smaller physics objects react correctly, but the BP_HeavyDebris object acts like solid, immovable world geometry. When attempting to apply a radial force or push it, it remains completely stationary, despite having 'Simulate Physics' checked on its mesh component. No physics movement warnings are displayed in the editor viewport or log.",
        "choices": [
            {
                "text": "In the Details panel for the 'SM_WreckagePile' component, scroll down to the 'Physics' category and confirm that the 'Simulate Physics' checkbox is enabled (checked).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Changing the 'Collision Preset' from 'BlockAll' to a custom Physics preset, mistakenly believing the collision profile is the issue rather than the component's mobility requirement for simulation.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.15
            },
            {
                "text": "Use the 'Simulate Physics' debug visualization (Show > Visualize > Simulation) or use gameplay (PIE) to confirm that the 'BP_HeavyDebris' actor is indeed failing to react to forces, while other nearby physics objects are behaving normally.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Adjusting global physics settings in Project Settings (e.g., gravity or substeps) which affects all objects equally, rather than focusing on the single problematic actor.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.1
            },
            {
                "text": "Save the changes to the 'BP_HeavyDebris' Blueprint.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Spending time investigating the Blueprint Event Graph for misplaced 'Apply Impulse' or 'Add Force' nodes, assuming the physics forces are not being called correctly.",
                "next": "step_1",
                "type": "misguided",
                "time_cost": 0.25
            },
            {
                "text": "Return to the main level editor and press Play (PIE).",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Test the interaction again (e.g., shooting it or walking into it heavily) and verify that the wreckage now correctly simulates physics and moves dynamically.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.1
            },
            {
                "text": "Compile the 'BP_HeavyDebris' Blueprint to ensure the mobility change is applied across all instances.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Navigate to the Components panel and select the primary Static Mesh Component (named 'SM_WreckagePile') that is supposed to be simulating physics.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Click the 'Edit BP' button in the Details panel to open the Blueprint Editor for BP_HeavyDebris.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Select the problematic 'BP_HeavyDebris' Actor instance in the Level Outliner.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.03
            },
            {
                "text": "Observe that the 'Mobility' setting is currently set to 'Static'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.04
            },
            {
                "text": "Change the 'Mobility' dropdown selection from 'Static' to 'Movable'.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Scroll up within the Details panel to the 'Transform' category, which contains the 'Mobility' setting for the component.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.05
            },
            {
                "text": "Explain the prerequisite: Physics simulation requires the object to be capable of dynamic movement, which is determined by the component's Mobility setting.",
                "next": "conclusion",
                "type": "correct",
                "time_cost": 0.08
            }
        ]
    }
}
};
