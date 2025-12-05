window.SCENARIOS['PitchBlackIndoorGI'] = {
    meta: {
        title: "Pitch Black Indoor GI",
        description: "No bounce light. Investigates Lumen settings and geometry thickness.",
        estimateHours: 3.0,
        difficulty: "Intermediate"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'lighting',
            title: 'Step 1: The Symptom',
            prompt: "You have a room with windows and some bright exterior lighting, but inside the room everything between direct light patches is pitch black. There's almost no visible bounce light or ambient fill--GI looks completely dead. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You switch to Lumen visualization and Lighting Only view modes, then check Project Settings for Global Illumination. You notice Lumen is either disabled for GI/reflections or set to a fallback method. In the Lumen overview, the room barely shows any indirect contribution at all, which explains the pure black interiors.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You crank up light intensity and exposure, but the corners of the room still sit in pure black. Direct light gets brighter, but there's still no realistic bounce or fill. Clearly this isn't just a brightness issue.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'lighting',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path, assuming the lights were just too dim or the camera exposure was wrong. Even after overexposing the scene, the indirect lighting inside the room is still basically zero.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You roll back the extreme intensity/exposure tweaks and refocus on the actual GI system--whether Lumen is enabled and how the room's geometry is built.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'lighting',
            title: 'Step 2: Investigation',
            prompt: "You open Project Settings and the level's meshes to investigate why there's no usable indirect light inside the room. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "In Project Settings you see that Lumen is not enabled for Global Illumination (or the project is still using legacy static/SMRT GI), so the engine isn't computing real-time bounce. On top of that, you notice the room is built from thin single-sided planes instead of thick walls, which can also cause Lumen to fail or leak light if/when it's enabled. Combined, this explains why interior indirect lighting is essentially pitch black.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try dropping additional fill lights into the room to fake GI, but this quickly becomes messy and inconsistent, and still doesn't behave like proper global illumination as you move lights or time of day.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'lighting',
            title: 'Dead End: Misguided',
            prompt: "Those fake fill lights didn't solve the core problem. You're just painting light into the scene instead of fixing why there's no proper bounce or why Lumen can't evaluate the room correctly.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the real fix is to enable and configure Lumen for GI, and to make sure the room's geometry has proper thickness so Lumen can trace and contain light accurately.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'lighting',
            title: 'Step 3: The Fix',
            prompt: "You now know the cause: Lumen GI is disabled or misconfigured, and the room is built from thin geometry that doesn't play nicely with tracing. How do you fix it?",
            choices: [
                {
                    text: "Action: [Enable Lumen and check geometry.]",
                    type: 'correct',
                    feedback: "In Project Settings, you switch Global Illumination (and, if needed, Reflections) to use Lumen and restart the editor so the change takes effect. You then rebuild the room with proper thick walls (boxes or solid meshes) instead of paper-thin planes, or swap to assets with real volume. With Lumen enabled and solid geometry in place, the system can trace light bounces correctly and generate believable indirect lighting indoors.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'lighting',
            title: 'Step 4: Verification',
            prompt: "With Lumen enabled and the room rebuilt with thick walls, you need to confirm that indirect lighting now works. How do you verify the fix in PIE?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE and in Lighting Only / Lumen visualizations, you now see soft bounce light filling the room--corners are no longer pitch black, and light from windows bleeds naturally into the interior. Moving lights or changing time of day updates the GI in real time, confirming that enabling Lumen and using proper geometry thickness solved the issue.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'lighting',
            title: 'Conclusion',
            prompt: "Lesson: If an interior is pitch black with no bounce, don't just crank up lights. First, ensure Lumen is enabled as the Global Illumination method in Project Settings. Then, make sure your room is built with solid, thick geometry so Lumen can trace and contain light properly instead of failing or leaking through paper-thin walls.",
            choices: []
        }
    }
};