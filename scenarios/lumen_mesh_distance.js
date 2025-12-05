window.SCENARIOS['MeshBlackAtDistance'] = {
    meta: {
        title: "Mesh Black at Distance (Lumen)",
        description: "Mesh turns black. Investigates Max Distance Field Replacement.",
        estimateHours: 1.5
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'lighting',
            title: 'Step 1: The Symptom',
            prompt: "A mesh lit by Lumen looks fine up close, but when you back away it suddenly goes very dark or completely black, as if Lumen stopped lighting it at distance. Mesh looks like it's culled from the Lumen scene. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You switch to Lumen and Mesh Distance Field visualization view modes. Up close, the mesh shows up in the distance field representation, but once you move far enough away, its distance field proxy disappears and Lumen stops treating it as a valid surface for GI/Reflections. That's a strong clue that the mesh is being culled from the Lumen scene at distance.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You tweak the material and light intensity, but the mesh still turns black when you move away. The problem clearly isn't the material or light brightness--it's how Lumen is handling the mesh at distance.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'lighting',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path, assuming the issue was the material or light setup. Even after those tweaks, the mesh still loses Lumen lighting when you're far away.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You roll back the unnecessary material/light changes and refocus on Lumen and Mesh Distance Field settings--specifically how and when the mesh is represented in the Lumen scene.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'lighting',
            title: 'Step 2: Investigation',
            prompt: "You open the mesh and project settings to investigate how Lumen is handling its distance field representation and max distance. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You find that the mesh is using a very low Distance Field Resolution or is affected by a Max Distance Field / replacement setting that culls or simplifies it beyond a certain range. Once you move past that max distance, the mesh effectively drops out of the Lumen distance field scene, so Lumen can no longer calculate proper GI and reflections for it--hence it turns black at distance.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try adding extra lights or boosting skylight intensity to \"fill in\" the darkness, but at range the mesh still looks unlit because Lumen isn't seeing it in the distance field at all. You're lighting empty space, not fixing the culling issue.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'lighting',
            title: 'Dead End: Misguided',
            prompt: "That didn't work because the underlying problem remains: beyond a certain distance, the mesh is no longer represented in the Lumen distance field scene, so no amount of extra light will make it receive proper GI.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must adjust the mesh's distance field settings or Lumen's view distance so the mesh stays represented in the distance field at the ranges you care about.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'lighting',
            title: 'Step 3: The Fix',
            prompt: "You know the cause: the mesh is culled or overly simplified in the distance field at range, so Lumen stops lighting it. How do you fix it?",
            choices: [
                {
                    text: "Action: [Adjust Distance Field Resolution or View Distance.]",
                    type: 'correct',
                    feedback: "You increase the mesh's Distance Field Resolution Scale (or adjust its max distance / replacement settings) so it keeps a valid distance field representation at the needed viewing ranges. If necessary, you also tweak global distance field or Lumen view-distance settings so the mesh isn't culled too aggressively. After rebuilding distance fields, the mesh now remains in the Lumen scene at distance and no longer turns black.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'lighting',
            title: 'Step 4: Verification',
            prompt: "With the distance field and view distance settings adjusted, you need to confirm that the mesh now stays properly lit by Lumen at range. How do you verify the fix?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, you walk or fly the camera toward and away from the mesh. It now stays consistently lit by Lumen even at long distances instead of snapping to black when you back off. Distance field and Lumen visualization show the mesh's proxy remaining present, confirming that adjusting the distance field resolution/view distance solved the issue.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'lighting',
            title: 'Conclusion',
            prompt: "Lesson: If a mesh turns black or loses Lumen lighting at distance, check its Mesh Distance Field representation and max distance. Ensure the mesh isn't being culled or overly simplified in the Lumen scene by adjusting Distance Field Resolution Scale or relevant view-distance settings so it remains represented at the ranges you need.",
            choices: []
        }
    }
};