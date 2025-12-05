window.SCENARIOS['FastProjectileTunneling'] = {
    meta: {
        title: "Projectile Tunneling Through Wall",
        description: "Fast object skips collision. Investigates Continuous Collision Detection (CCD).",
        estimateHours: 1.5
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'physics',
            title: 'Step 1: The Symptom',
            prompt: "A very fast-moving projectile sometimes passes straight through a thin wall without generating any hit events. It looks like the collision is being skipped. What do you check first?",
            choices: [
                {
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You enable collision debug drawing and add logs to the projectile's OnHit/OnOverlap events. In the cases where the projectile tunnels, you see it never reports a hit at all--it simply appears on one side of the wall one frame and on the other side the next. This suggests the projectile is skipping over the wall between frames.",
                    next: 'step-2'
                },
                {
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "You start tweaking wall collision presets and character collision responses, but nothing changes--only very fast shots fail while slow ones work. The issue clearly relates to projectile speed rather than basic collision channels.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'physics',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path, assuming it was a collision channel or response problem. Slower projectiles collide just fine, so those changes didn't fix anything.",
            choices: [
                {
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "You roll back the unnecessary collision channel changes and refocus on how the physics engine is stepping the projectile through the world each frame.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'physics',
            title: 'Step 2: Investigation',
            prompt: "You inspect how the projectile moves each tick and how its collision is configured. You want to understand why only fast shots miss the wall. What do you find?",
            choices: [
                {
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "You realize the projectile moves a large distance every frame due to its high velocity. In one frame it's before the thin wall; in the next frame it has already advanced to the far side, so the discrete collision check never samples the wall in between. Continuous Collision Detection (CCD) is disabled on the projectile, so the engine isn't sweeping its path for intermediate hits.",
                    next: 'step-3'
                },
                {
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try thickening the wall and slightly reducing the projectile speed, which helps a little but doesn't reliably solve the tunneling. This only masks the problem instead of addressing the underlying collision behavior.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'physics',
            title: 'Dead End: Misguided',
            prompt: "Those tweaks didn't work because the projectile can still move far enough in a single frame to jump past thin geometry. Without a more robust collision method, tunneling will keep happening at high speeds.",
            choices: [
                {
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you need to enable Continuous Collision Detection so the engine sweeps the projectile's path each frame instead of just checking its start and end points.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'physics',
            title: 'Step 3: The Fix',
            prompt: "You now know the cause: the projectile moves so fast that discrete collision checks miss the thin wall. How do you fix it?",
            choices: [
                {
                    text: "Action: [Enable CCD on the projectile.]",
                    type: 'correct',
                    feedback: "In the projectile Blueprint, you select the collision component (e.g., sphere) and enable Continuous Collision Detection (CCD) in its physics settings. This forces the engine to sweep the projectile's movement between frames and register hits even when it travels very far in a single tick. After compiling, fast projectiles should no longer tunnel through thin walls.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'physics',
            title: 'Step 4: Verification',
            prompt: "You re-run the game in PIE and fire high-speed projectiles at thin walls from various distances. How do you verify that tunneling is fixed?",
            choices: [
                {
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, your fast projectiles now consistently register hits on the thin wall instead of passing through it. Collision debugging shows proper hit events along the swept path, confirming that enabling CCD solved the tunneling issue.",
                    next: 'conclusion'
                }
            ]
        },
        'conclusion': {
            skill: 'physics',
            title: 'Conclusion',
            prompt: "Lesson: When fast-moving projectiles tunnel through thin geometry, it's usually because discrete collision checks miss the wall between frames. Enable Continuous Collision Detection (CCD) on the projectile's collision component so the engine sweeps its motion and reliably detects impacts at high speed.",
            choices: []
        }
    }
};