window.SCENARIOS['FastProjectileTunneling'] = {
    meta: {
        expanded: true,
        title: "Projectile Tunneling Through Wall",
        description: "Fast object skips collision. Investigates Continuous Collision Detection (CCD).",
        estimateHours: 3.5,
        category: "Physics"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'physics',
            title: 'The Symptom',
            prompt: "A very fast-moving projectile sometimes passes straight through a thin wall without generating any hit events. It looks like the collision is being skipped. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You enable collision debug drawing and add logs to the projectile's OnHit/OnOverlap events. In the cases where the projectile tunnels, you see it never reports a hit at all--it simply appears on one side of the wall one frame and on the other side the next. This suggests the projectile is skipping over the wall between frames.",
                    next: 'step-2'
                },
                {
                    text: "Wrong Guess]",
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
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You roll back the unnecessary collision channel changes and refocus on how the physics engine is stepping the projectile through the world each frame.",
                    next: 'step-2'
                }
            ]
        },
        'step-2': {
            skill: 'physics',
            title: 'Investigation',
            prompt: "You inspect how the projectile moves each tick and how its collision is configured. You want to understand why only fast shots miss the wall. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You realize the projectile moves a large distance every frame due to its high velocity. In one frame it's before the thin wall; in the next frame it has already advanced to the far side, so the discrete collision check never samples the wall in between. Continuous Collision Detection (CCD) is disabled on the projectile, so the engine isn't sweeping its path for intermediate hits.",
                    next: 'step-inv-1'
                },
                {
                    text: "Misguided Attempt]",
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
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you need to enable Continuous Collision Detection so the engine sweeps the projectile's path each frame instead of just checking its start and end points.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-3': {
            skill: 'physics',
            title: 'The Fix',
            prompt: "You now know the cause: the projectile moves so fast that discrete collision checks miss the thin wall. How do you fix it?",
            choices: [
                {
                    text: "Enable CCD on the projectile.]",
                    type: 'correct',
                    feedback: "In the projectile Blueprint, you select the collision component (e.g., sphere) and enable Continuous Collision Detection (CCD) in its physics settings. This forces the engine to sweep the projectile's movement between frames and register hits even when it travels very far in a single tick. After compiling, fast projectiles should no longer tunnel through thin walls.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'physics',
            title: 'Verification',
            prompt: "You re-run the game in PIE and fire high-speed projectiles at thin walls from various distances. How do you verify that tunneling is fixed?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, your fast projectiles now consistently register hits on the thin wall instead of passing through it. Collision debugging shows proper hit events along the swept path, confirming that enabling CCD solved the tunneling issue.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'physics',
            title: 'Visualizing Physics Sweeps',
            prompt: "You've identified that discrete collision is likely the issue. How can you visually confirm that the physics engine isn't sweeping the projectile's path for intermediate collisions, but rather performing only discrete checks?",
            choices: [
                {
                    text: "Use `pxvis collision` console command]",
                    type: 'correct',
                    feedback: "You enable `pxvis collision` in the console and observe the projectile's movement. When it tunnels, you see only discrete collision shapes at the start and end of its movement for that frame, with no intermediate sweep lines or hit points, visually confirming the lack of continuous collision detection.",
                    next: 'step-red-herring-1'
                },
                {
                    text: "Check material physics properties]",
                    type: 'wrong',
                    feedback: "You check the physics materials, but they primarily define friction, restitution, and density, not how the collision detection algorithm itself (discrete vs. continuous) is performed. This doesn't help diagnose the tunneling mechanism.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'physics',
            title: 'Dead End: Irrelevant Check',
            prompt: "Checking physics materials was a dead end. You need to focus on how the collision *detection* is being performed, not just the properties of the surfaces.",
            choices: [
                {
                    text: "Re-evaluate and try a different visualization]",
                    type: 'correct',
                    feedback: "You refocus on visualizing the actual collision process, realizing that console commands like `pxvis collision` are designed for this purpose.",
                    next: 'step-red-herring-1'
                },
            ]
        },

        'step-red-herring-1': {
            skill: 'physics',
            title: 'Misguided: Tweaking Physics Substepping',
            prompt: "You've confirmed discrete collision. You recall that physics substepping can increase collision fidelity by breaking down a single frame's physics update into smaller steps. You decide to try increasing the number of physics sub-steps in Project Settings to see if it helps.",
            choices: [
                {
                    text: "Increase Physics Substeps and reduce Max Physics Delta Time]",
                    type: 'misguided',
                    feedback: "You increase `Max Substeps` and decrease `Max Physics Delta Time` in Project Settings -> Physics. While this *can* reduce tunneling for some cases by making physics updates more frequent, for extremely fast projectiles or very thin geometry, it often only mitigates the problem and significantly increases CPU cost without fully solving the fundamental issue of discrete collision missing the object entirely.",
                    next: 'step-red-herring-1M'
                },
                {
                    text: "Realize substepping is a performance trade-off, not a direct solution for CCD]",
                    type: 'correct',
                    feedback: "You realize that while substepping improves general physics accuracy, it's not a direct substitute for continuous collision detection when objects are moving extremely fast. It's a performance trade-off that might not fully solve the tunneling and could be costly.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-red-herring-1M': {
            skill: 'physics',
            title: 'Dead End: Substepping Limitations',
            prompt: "Increasing substepping helped slightly but didn't eliminate the tunneling, and you noticed a performance hit. Substepping improves general physics stability but doesn't fundamentally change the discrete nature of collision checks for fast-moving objects.",
            choices: [
                {
                    text: "Revert substepping changes and focus on continuous collision]",
                    type: 'correct',
                    feedback: "You revert the substepping changes to avoid unnecessary performance overhead and refocus on the core problem: the lack of continuous collision detection for the projectile.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'physics',
            title: 'Confirming CCD Status',
            prompt: "You've seen the discrete collision behavior and understand substepping isn't the primary fix. Now you need to explicitly confirm the Continuous Collision Detection (CCD) setting on the projectile's collision component, as this is the direct solution for fast-moving objects.",
            choices: [
                {
                    text: "Inspect Projectile's Collision Component Details]",
                    type: 'correct',
                    feedback: "You open the projectile's Blueprint, select its primary collision component (e.g., Sphere Collision), and navigate to the 'Collision' section in the Details panel. You confirm that 'Continuous Collision Detection' (or 'CCD') is indeed unchecked/disabled, which is the root cause.",
                    next: 'step-inv-1'
                },
                {
                    text: "Check Projectile Movement Component settings]",
                    type: 'wrong',
                    feedback: "While the Projectile Movement Component dictates movement behavior, it doesn't directly control the *type* of collision detection (discrete vs. continuous) performed by the physics body itself. That setting resides on the collision component.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'physics',
            title: 'Dead End: Wrong Component',
            prompt: "You checked the Projectile Movement Component, but the CCD setting isn't there. You need to look at the actual collision primitive.",
            choices: [
                {
                    text: "Look at the collision component's details]",
                    type: 'correct',
                    feedback: "You realize the collision detection settings are part of the collision component itself, not the movement component.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'physics',
            title: 'Standalone Game Verification',
            prompt: "You've verified the fix in PIE. To ensure the solution holds up in a deployed environment and isn't just an editor-specific behavior, what's the next logical step for verification?",
            choices: [
                {
                    text: "Launch as Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the game as a 'Standalone Game' (or a packaged build). You repeat the test, firing fast projectiles at thin walls. The projectiles consistently collide and generate hit events, confirming the fix works reliably outside of the editor's PIE environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Re-check collision presets]",
                    type: 'wrong',
                    feedback: "You've already established that collision presets weren't the root cause and that the CCD setting was the fix. Re-checking them now is redundant and won't help verify the CCD fix in a standalone build.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'physics',
            title: 'Dead End: Redundant Check',
            prompt: "Re-checking collision presets is a redundant step. The goal is to verify the CCD fix in a different environment, not to re-diagnose the original problem.",
            choices: [
                {
                    text: "Focus on standalone verification]",
                    type: 'correct',
                    feedback: "You refocus on verifying the fix in a standalone game environment, which is crucial for deployment.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'physics',
            title: 'Performance Impact Assessment',
            prompt: "Enabling Continuous Collision Detection (CCD) can sometimes have a performance cost, especially with many fast-moving objects or complex scenes. How do you check if the fix has introduced any significant overhead?",
            choices: [
                {
                    text: "Use `stat unit` and `stat physics` console commands]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat physics` in PIE and/or Standalone Game. You observe the 'Game' and 'Physics' threads. While there might be a slight increase in physics cost due to the more complex swept collision calculations, it remains within acceptable limits for your project, confirming the fix is performant enough.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'physics',
            title: 'Visualizing Physics Sweeps',
            prompt: "You've identified that discrete collision is likely the issue. How can you visually confirm that the physics engine isn't sweeping the projectile's path for intermediate collisions, but rather performing only discrete checks?",
            choices: [
                {
                    text: "Use `pxvis collision` console command]",
                    type: 'correct',
                    feedback: "You enable `pxvis collision` in the console and observe the projectile's movement. When it tunnels, you see only discrete collision shapes at the start and end of its movement for that frame, with no intermediate sweep lines or hit points, visually confirming the lack of continuous collision detection.",
                    next: 'step-red-herring-1'
                },
                {
                    text: "Check material physics properties]",
                    type: 'wrong',
                    feedback: "You check the physics materials, but they primarily define friction, restitution, and density, not how the collision detection algorithm itself (discrete vs. continuous) is performed. This doesn't help diagnose the tunneling mechanism.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'physics',
            title: 'Dead End: Irrelevant Check',
            prompt: "Checking physics materials was a dead end. You need to focus on how the collision *detection* is being performed, not just the properties of the surfaces.",
            choices: [
                {
                    text: "Re-evaluate and try a different visualization]",
                    type: 'correct',
                    feedback: "You refocus on visualizing the actual collision process, realizing that console commands like `pxvis collision` are designed for this purpose.",
                    next: 'step-red-herring-1'
                },
            ]
        },

        'step-red-herring-1': {
            skill: 'physics',
            title: 'Misguided: Tweaking Physics Substepping',
            prompt: "You've confirmed discrete collision. You recall that physics substepping can increase collision fidelity by breaking down a single frame's physics update into smaller steps. You decide to try increasing the number of physics sub-steps in Project Settings to see if it helps.",
            choices: [
                {
                    text: "Increase Physics Substeps and reduce Max Physics Delta Time]",
                    type: 'misguided',
                    feedback: "You increase `Max Substeps` and decrease `Max Physics Delta Time` in Project Settings -> Physics. While this *can* reduce tunneling for some cases by making physics updates more frequent, for extremely fast projectiles or very thin geometry, it often only mitigates the problem and significantly increases CPU cost without fully solving the fundamental issue of discrete collision missing the object entirely.",
                    next: 'step-red-herring-1M'
                },
                {
                    text: "Realize substepping is a performance trade-off, not a direct solution for CCD]",
                    type: 'correct',
                    feedback: "You realize that while substepping improves general physics accuracy, it's not a direct substitute for continuous collision detection when objects are moving extremely fast. It's a performance trade-off that might not fully solve the tunneling and could be costly.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-red-herring-1M': {
            skill: 'physics',
            title: 'Dead End: Substepping Limitations',
            prompt: "Increasing substepping helped slightly but didn't eliminate the tunneling, and you noticed a performance hit. Substepping improves general physics stability but doesn't fundamentally change the discrete nature of collision checks for fast-moving objects.",
            choices: [
                {
                    text: "Revert substepping changes and focus on continuous collision]",
                    type: 'correct',
                    feedback: "You revert the substepping changes to avoid unnecessary performance overhead and refocus on the core problem: the lack of continuous collision detection for the projectile.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'physics',
            title: 'Confirming CCD Status',
            prompt: "You've seen the discrete collision behavior and understand substepping isn't the primary fix. Now you need to explicitly confirm the Continuous Collision Detection (CCD) setting on the projectile's collision component, as this is the direct solution for fast-moving objects.",
            choices: [
                {
                    text: "Inspect Projectile's Collision Component Details]",
                    type: 'correct',
                    feedback: "You open the projectile's Blueprint, select its primary collision component (e.g., Sphere Collision), and navigate to the 'Collision' section in the Details panel. You confirm that 'Continuous Collision Detection' (or 'CCD') is indeed unchecked/disabled, which is the root cause.",
                    next: 'step-inv-1'
                },
                {
                    text: "Check Projectile Movement Component settings]",
                    type: 'wrong',
                    feedback: "While the Projectile Movement Component dictates movement behavior, it doesn't directly control the *type* of collision detection (discrete vs. continuous) performed by the physics body itself. That setting resides on the collision component.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'physics',
            title: 'Dead End: Wrong Component',
            prompt: "You checked the Projectile Movement Component, but the CCD setting isn't there. You need to look at the actual collision primitive.",
            choices: [
                {
                    text: "Look at the collision component's details]",
                    type: 'correct',
                    feedback: "You realize the collision detection settings are part of the collision component itself, not the movement component.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'physics',
            title: 'Standalone Game Verification',
            prompt: "You've verified the fix in PIE. To ensure the solution holds up in a deployed environment and isn't just an editor-specific behavior, what's the next logical step for verification?",
            choices: [
                {
                    text: "Launch as Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the game as a 'Standalone Game' (or a packaged build). You repeat the test, firing fast projectiles at thin walls. The projectiles consistently collide and generate hit events, confirming the fix works reliably outside of the editor's PIE environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Re-check collision presets]",
                    type: 'wrong',
                    feedback: "You've already established that collision presets weren't the root cause and that the CCD setting was the fix. Re-checking them now is redundant and won't help verify the CCD fix in a standalone build.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'physics',
            title: 'Dead End: Redundant Check',
            prompt: "Re-checking collision presets is a redundant step. The goal is to verify the CCD fix in a different environment, not to re-diagnose the original problem.",
            choices: [
                {
                    text: "Focus on standalone verification]",
                    type: 'correct',
                    feedback: "You refocus on verifying the fix in a standalone game environment, which is crucial for deployment.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'physics',
            title: 'Performance Impact Assessment',
            prompt: "Enabling Continuous Collision Detection (CCD) can sometimes have a performance cost, especially with many fast-moving objects or complex scenes. How do you check if the fix has introduced any significant overhead?",
            choices: [
                {
                    text: "Use `stat unit` and `stat physics` console commands]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat physics` in PIE and/or Standalone Game. You observe the 'Game' and 'Physics' threads. While there might be a slight increase in physics cost due to the more complex swept collision calculations, it remains within acceptable limits for your project, confirming the fix is performant enough.",
                    next: 'step-ver-1'
                },
                {
                    text: "Profile GPU usage]",
                    type: 'wrong',
                    feedback: "While profiling is generally good, GPU usage is primarily related to rendering. CCD is a CPU-bound physics calculation. You need to focus on CPU-related stats like `stat unit` and `stat physics` to accurately assess its impact.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'physics',
            title: 'Dead End: Wrong Profiling Focus',
            prompt: "Profiling GPU usage won't tell you about the CPU cost of physics calculations. You need to use CPU-focused stats.",
            choices: [
                {
                    text: "Switch to CPU physics stats]",
                    type: 'correct',
                    feedback: "You realize the need to use `stat physics` and `stat unit` to properly assess the CPU performance impact of CCD.",
                    next: 'step-ver-1'
                },
            ]
        },
                },
                {
                    text: "Profile GPU usage]",
                    type: 'wrong',
                    feedback: "While profiling is generally good, GPU usage is primarily related to rendering. CCD is a CPU-bound physics calculation. You need to focus on CPU-related stats like `stat unit` and `stat physics` to accurately assess its impact.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'physics',
            title: 'Dead End: Wrong Profiling Focus',
            prompt: "Profiling GPU usage won't tell you about the CPU cost of physics calculations. You need to use CPU-focused stats.",
            choices: [
                {
                    text: "Switch to CPU physics stats]",
                    type: 'correct',
                    feedback: "You realize the need to use `stat physics` and `stat unit` to properly assess the CPU performance impact of CCD.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'physics',
            title: 'Visualizing Physics Sweeps',
            prompt: "You've identified that discrete collision is likely the issue. How can you visually confirm that the physics engine isn't sweeping the projectile's path for intermediate collisions, but rather performing only discrete checks?",
            choices: [
                {
                    text: "Use `pxvis collision` console command]",
                    type: 'correct',
                    feedback: "You enable `pxvis collision` in the console and observe the projectile's movement. When it tunnels, you see only discrete collision shapes at the start and end of its movement for that frame, with no intermediate sweep lines or hit points, visually confirming the lack of continuous collision detection.",
                    next: 'step-red-herring-1'
                },
                {
                    text: "Check material physics properties]",
                    type: 'wrong',
                    feedback: "You check the physics materials, but they primarily define friction, restitution, and density, not how the collision detection algorithm itself (discrete vs. continuous) is performed. This doesn't help diagnose the tunneling mechanism.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'physics',
            title: 'Dead End: Irrelevant Check',
            prompt: "Checking physics materials was a dead end. You need to focus on how the collision *detection* is being performed, not just the properties of the surfaces.",
            choices: [
                {
                    text: "Re-evaluate and try a different visualization]",
                    type: 'correct',
                    feedback: "You refocus on visualizing the actual collision process, realizing that console commands like `pxvis collision` are designed for this purpose.",
                    next: 'step-red-herring-1'
                },
            ]
        },

        'step-red-herring-1': {
            skill: 'physics',
            title: 'Misguided: Tweaking Physics Substepping',
            prompt: "You've confirmed discrete collision. You recall that physics substepping can increase collision fidelity by breaking down a single frame's physics update into smaller steps. You decide to try increasing the number of physics sub-steps in Project Settings to see if it helps.",
            choices: [
                {
                    text: "Increase Physics Substeps and reduce Max Physics Delta Time]",
                    type: 'misguided',
                    feedback: "You increase `Max Substeps` and decrease `Max Physics Delta Time` in Project Settings -> Physics. While this *can* reduce tunneling for some cases by making physics updates more frequent, for extremely fast projectiles or very thin geometry, it often only mitigates the problem and significantly increases CPU cost without fully solving the fundamental issue of discrete collision missing the object entirely.",
                    next: 'step-red-herring-1M'
                },
                {
                    text: "Realize substepping is a performance trade-off, not a direct solution for CCD]",
                    type: 'correct',
                    feedback: "You realize that while substepping improves general physics accuracy, it's not a direct substitute for continuous collision detection when objects are moving extremely fast. It's a performance trade-off that might not fully solve the tunneling and could be costly.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-red-herring-1M': {
            skill: 'physics',
            title: 'Dead End: Substepping Limitations',
            prompt: "Increasing substepping helped slightly but didn't eliminate the tunneling, and you noticed a performance hit. Substepping improves general physics stability but doesn't fundamentally change the discrete nature of collision checks for fast-moving objects.",
            choices: [
                {
                    text: "Revert substepping changes and focus on continuous collision]",
                    type: 'correct',
                    feedback: "You revert the substepping changes to avoid unnecessary performance overhead and refocus on the core problem: the lack of continuous collision detection for the projectile.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'physics',
            title: 'Confirming CCD Status',
            prompt: "You've seen the discrete collision behavior and understand substepping isn't the primary fix. Now you need to explicitly confirm the Continuous Collision Detection (CCD) setting on the projectile's collision component, as this is the direct solution for fast-moving objects.",
            choices: [
                {
                    text: "Inspect Projectile's Collision Component Details]",
                    type: 'correct',
                    feedback: "You open the projectile's Blueprint, select its primary collision component (e.g., Sphere Collision), and navigate to the 'Collision' section in the Details panel. You confirm that 'Continuous Collision Detection' (or 'CCD') is indeed unchecked/disabled, which is the root cause.",
                    next: 'step-inv-1'
                },
                {
                    text: "Check Projectile Movement Component settings]",
                    type: 'wrong',
                    feedback: "While the Projectile Movement Component dictates movement behavior, it doesn't directly control the *type* of collision detection (discrete vs. continuous) performed by the physics body itself. That setting resides on the collision component.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'physics',
            title: 'Dead End: Wrong Component',
            prompt: "You checked the Projectile Movement Component, but the CCD setting isn't there. You need to look at the actual collision primitive.",
            choices: [
                {
                    text: "Look at the collision component's details]",
                    type: 'correct',
                    feedback: "You realize the collision detection settings are part of the collision component itself, not the movement component.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'physics',
            title: 'Standalone Game Verification',
            prompt: "You've verified the fix in PIE. To ensure the solution holds up in a deployed environment and isn't just an editor-specific behavior, what's the next logical step for verification?",
            choices: [
                {
                    text: "Launch as Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the game as a 'Standalone Game' (or a packaged build). You repeat the test, firing fast projectiles at thin walls. The projectiles consistently collide and generate hit events, confirming the fix works reliably outside of the editor's PIE environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Re-check collision presets]",
                    type: 'wrong',
                    feedback: "You've already established that collision presets weren't the root cause and that the CCD setting was the fix. Re-checking them now is redundant and won't help verify the CCD fix in a standalone build.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'physics',
            title: 'Dead End: Redundant Check',
            prompt: "Re-checking collision presets is a redundant step. The goal is to verify the CCD fix in a different environment, not to re-diagnose the original problem.",
            choices: [
                {
                    text: "Focus on standalone verification]",
                    type: 'correct',
                    feedback: "You refocus on verifying the fix in a standalone game environment, which is crucial for deployment.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'physics',
            title: 'Performance Impact Assessment',
            prompt: "Enabling Continuous Collision Detection (CCD) can sometimes have a performance cost, especially with many fast-moving objects or complex scenes. How do you check if the fix has introduced any significant overhead?",
            choices: [
                {
                    text: "Use `stat unit` and `stat physics` console commands]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat physics` in PIE and/or Standalone Game. You observe the 'Game' and 'Physics' threads. While there might be a slight increase in physics cost due to the more complex swept collision calculations, it remains within acceptable limits for your project, confirming the fix is performant enough.",
                    next: 'step-ver-1'
                },
                {
                    text: "Profile GPU usage]",
                    type: 'wrong',
                    feedback: "While profiling is generally good, GPU usage is primarily related to rendering. CCD is a CPU-bound physics calculation. You need to focus on CPU-related stats like `stat unit` and `stat physics` to accurately assess its impact.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'physics',
            title: 'Dead End: Wrong Profiling Focus',
            prompt: "Profiling GPU usage won't tell you about the CPU cost of physics calculations. You need to use CPU-focused stats.",
            choices: [
                {
                    text: "Switch to CPU physics stats]",
                    type: 'correct',
                    feedback: "You realize the need to use `stat physics` and `stat unit` to properly assess the CPU performance impact of CCD.",
                    next: 'step-ver-1'
                },
            ]
        },
                },
            ]
        },

        
        'step-inv-1': {
            skill: 'physics',
            title: 'Visualizing Physics Sweeps',
            prompt: "You've identified that discrete collision is likely the issue. How can you visually confirm that the physics engine isn't sweeping the projectile's path for intermediate collisions, but rather performing only discrete checks?",
            choices: [
                {
                    text: "Use `pxvis collision` console command]",
                    type: 'correct',
                    feedback: "You enable `pxvis collision` in the console and observe the projectile's movement. When it tunnels, you see only discrete collision shapes at the start and end of its movement for that frame, with no intermediate sweep lines or hit points, visually confirming the lack of continuous collision detection.",
                    next: 'step-red-herring-1'
                },
                {
                    text: "Check material physics properties]",
                    type: 'wrong',
                    feedback: "You check the physics materials, but they primarily define friction, restitution, and density, not how the collision detection algorithm itself (discrete vs. continuous) is performed. This doesn't help diagnose the tunneling mechanism.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'physics',
            title: 'Dead End: Irrelevant Check',
            prompt: "Checking physics materials was a dead end. You need to focus on how the collision *detection* is being performed, not just the properties of the surfaces.",
            choices: [
                {
                    text: "Re-evaluate and try a different visualization]",
                    type: 'correct',
                    feedback: "You refocus on visualizing the actual collision process, realizing that console commands like `pxvis collision` are designed for this purpose.",
                    next: 'step-red-herring-1'
                },
            ]
        },

        'step-red-herring-1': {
            skill: 'physics',
            title: 'Misguided: Tweaking Physics Substepping',
            prompt: "You've confirmed discrete collision. You recall that physics substepping can increase collision fidelity by breaking down a single frame's physics update into smaller steps. You decide to try increasing the number of physics sub-steps in Project Settings to see if it helps.",
            choices: [
                {
                    text: "Increase Physics Substeps and reduce Max Physics Delta Time]",
                    type: 'misguided',
                    feedback: "You increase `Max Substeps` and decrease `Max Physics Delta Time` in Project Settings -> Physics. While this *can* reduce tunneling for some cases by making physics updates more frequent, for extremely fast projectiles or very thin geometry, it often only mitigates the problem and significantly increases CPU cost without fully solving the fundamental issue of discrete collision missing the object entirely.",
                    next: 'step-red-herring-1M'
                },
                {
                    text: "Realize substepping is a performance trade-off, not a direct solution for CCD]",
                    type: 'correct',
                    feedback: "You realize that while substepping improves general physics accuracy, it's not a direct substitute for continuous collision detection when objects are moving extremely fast. It's a performance trade-off that might not fully solve the tunneling and could be costly.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-red-herring-1M': {
            skill: 'physics',
            title: 'Dead End: Substepping Limitations',
            prompt: "Increasing substepping helped slightly but didn't eliminate the tunneling, and you noticed a performance hit. Substepping improves general physics stability but doesn't fundamentally change the discrete nature of collision checks for fast-moving objects.",
            choices: [
                {
                    text: "Revert substepping changes and focus on continuous collision]",
                    type: 'correct',
                    feedback: "You revert the substepping changes to avoid unnecessary performance overhead and refocus on the core problem: the lack of continuous collision detection for the projectile.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'physics',
            title: 'Confirming CCD Status',
            prompt: "You've seen the discrete collision behavior and understand substepping isn't the primary fix. Now you need to explicitly confirm the Continuous Collision Detection (CCD) setting on the projectile's collision component, as this is the direct solution for fast-moving objects.",
            choices: [
                {
                    text: "Inspect Projectile's Collision Component Details]",
                    type: 'correct',
                    feedback: "You open the projectile's Blueprint, select its primary collision component (e.g., Sphere Collision), and navigate to the 'Collision' section in the Details panel. You confirm that 'Continuous Collision Detection' (or 'CCD') is indeed unchecked/disabled, which is the root cause.",
                    next: 'step-inv-1'
                },
                {
                    text: "Check Projectile Movement Component settings]",
                    type: 'wrong',
                    feedback: "While the Projectile Movement Component dictates movement behavior, it doesn't directly control the *type* of collision detection (discrete vs. continuous) performed by the physics body itself. That setting resides on the collision component.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'physics',
            title: 'Dead End: Wrong Component',
            prompt: "You checked the Projectile Movement Component, but the CCD setting isn't there. You need to look at the actual collision primitive.",
            choices: [
                {
                    text: "Look at the collision component's details]",
                    type: 'correct',
                    feedback: "You realize the collision detection settings are part of the collision component itself, not the movement component.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'physics',
            title: 'Standalone Game Verification',
            prompt: "You've verified the fix in PIE. To ensure the solution holds up in a deployed environment and isn't just an editor-specific behavior, what's the next logical step for verification?",
            choices: [
                {
                    text: "Launch as Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the game as a 'Standalone Game' (or a packaged build). You repeat the test, firing fast projectiles at thin walls. The projectiles consistently collide and generate hit events, confirming the fix works reliably outside of the editor's PIE environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Re-check collision presets]",
                    type: 'wrong',
                    feedback: "You've already established that collision presets weren't the root cause and that the CCD setting was the fix. Re-checking them now is redundant and won't help verify the CCD fix in a standalone build.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'physics',
            title: 'Dead End: Redundant Check',
            prompt: "Re-checking collision presets is a redundant step. The goal is to verify the CCD fix in a different environment, not to re-diagnose the original problem.",
            choices: [
                {
                    text: "Focus on standalone verification]",
                    type: 'correct',
                    feedback: "You refocus on verifying the fix in a standalone game environment, which is crucial for deployment.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'physics',
            title: 'Performance Impact Assessment',
            prompt: "Enabling Continuous Collision Detection (CCD) can sometimes have a performance cost, especially with many fast-moving objects or complex scenes. How do you check if the fix has introduced any significant overhead?",
            choices: [
                {
                    text: "Use `stat unit` and `stat physics` console commands]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat physics` in PIE and/or Standalone Game. You observe the 'Game' and 'Physics' threads. While there might be a slight increase in physics cost due to the more complex swept collision calculations, it remains within acceptable limits for your project, confirming the fix is performant enough.",
                    next: 'step-ver-1'
                },
                {
                    text: "Profile GPU usage]",
                    type: 'wrong',
                    feedback: "While profiling is generally good, GPU usage is primarily related to rendering. CCD is a CPU-bound physics calculation. You need to focus on CPU-related stats like `stat unit` and `stat physics` to accurately assess its impact.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'physics',
            title: 'Dead End: Wrong Profiling Focus',
            prompt: "Profiling GPU usage won't tell you about the CPU cost of physics calculations. You need to use CPU-focused stats.",
            choices: [
                {
                    text: "Switch to CPU physics stats]",
                    type: 'correct',
                    feedback: "You realize the need to use `stat physics` and `stat unit` to properly assess the CPU performance impact of CCD.",
                    next: 'step-ver-1'
                },
            ]
        },
                }
            ]
        },
        
        'step-inv-1': {
            skill: 'physics',
            title: 'Visualizing Physics Sweeps',
            prompt: "You've identified that discrete collision is likely the issue. How can you visually confirm that the physics engine isn't sweeping the projectile's path for intermediate collisions, but rather performing only discrete checks?",
            choices: [
                {
                    text: "Use `pxvis collision` console command]",
                    type: 'correct',
                    feedback: "You enable `pxvis collision` in the console and observe the projectile's movement. When it tunnels, you see only discrete collision shapes at the start and end of its movement for that frame, with no intermediate sweep lines or hit points, visually confirming the lack of continuous collision detection.",
                    next: 'step-red-herring-1'
                },
                {
                    text: "Check material physics properties]",
                    type: 'wrong',
                    feedback: "You check the physics materials, but they primarily define friction, restitution, and density, not how the collision detection algorithm itself (discrete vs. continuous) is performed. This doesn't help diagnose the tunneling mechanism.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'physics',
            title: 'Dead End: Irrelevant Check',
            prompt: "Checking physics materials was a dead end. You need to focus on how the collision *detection* is being performed, not just the properties of the surfaces.",
            choices: [
                {
                    text: "Re-evaluate and try a different visualization]",
                    type: 'correct',
                    feedback: "You refocus on visualizing the actual collision process, realizing that console commands like `pxvis collision` are designed for this purpose.",
                    next: 'step-red-herring-1'
                },
            ]
        },

        'step-red-herring-1': {
            skill: 'physics',
            title: 'Misguided: Tweaking Physics Substepping',
            prompt: "You've confirmed discrete collision. You recall that physics substepping can increase collision fidelity by breaking down a single frame's physics update into smaller steps. You decide to try increasing the number of physics sub-steps in Project Settings to see if it helps.",
            choices: [
                {
                    text: "Increase Physics Substeps and reduce Max Physics Delta Time]",
                    type: 'misguided',
                    feedback: "You increase `Max Substeps` and decrease `Max Physics Delta Time` in Project Settings -> Physics. While this *can* reduce tunneling for some cases by making physics updates more frequent, for extremely fast projectiles or very thin geometry, it often only mitigates the problem and significantly increases CPU cost without fully solving the fundamental issue of discrete collision missing the object entirely.",
                    next: 'step-red-herring-1M'
                },
                {
                    text: "Realize substepping is a performance trade-off, not a direct solution for CCD]",
                    type: 'correct',
                    feedback: "You realize that while substepping improves general physics accuracy, it's not a direct substitute for continuous collision detection when objects are moving extremely fast. It's a performance trade-off that might not fully solve the tunneling and could be costly.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-red-herring-1M': {
            skill: 'physics',
            title: 'Dead End: Substepping Limitations',
            prompt: "Increasing substepping helped slightly but didn't eliminate the tunneling, and you noticed a performance hit. Substepping improves general physics stability but doesn't fundamentally change the discrete nature of collision checks for fast-moving objects.",
            choices: [
                {
                    text: "Revert substepping changes and focus on continuous collision]",
                    type: 'correct',
                    feedback: "You revert the substepping changes to avoid unnecessary performance overhead and refocus on the core problem: the lack of continuous collision detection for the projectile.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'physics',
            title: 'Confirming CCD Status',
            prompt: "You've seen the discrete collision behavior and understand substepping isn't the primary fix. Now you need to explicitly confirm the Continuous Collision Detection (CCD) setting on the projectile's collision component, as this is the direct solution for fast-moving objects.",
            choices: [
                {
                    text: "Inspect Projectile's Collision Component Details]",
                    type: 'correct',
                    feedback: "You open the projectile's Blueprint, select its primary collision component (e.g., Sphere Collision), and navigate to the 'Collision' section in the Details panel. You confirm that 'Continuous Collision Detection' (or 'CCD') is indeed unchecked/disabled, which is the root cause.",
                    next: 'step-inv-1'
                },
                {
                    text: "Check Projectile Movement Component settings]",
                    type: 'wrong',
                    feedback: "While the Projectile Movement Component dictates movement behavior, it doesn't directly control the *type* of collision detection (discrete vs. continuous) performed by the physics body itself. That setting resides on the collision component.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'physics',
            title: 'Dead End: Wrong Component',
            prompt: "You checked the Projectile Movement Component, but the CCD setting isn't there. You need to look at the actual collision primitive.",
            choices: [
                {
                    text: "Look at the collision component's details]",
                    type: 'correct',
                    feedback: "You realize the collision detection settings are part of the collision component itself, not the movement component.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'physics',
            title: 'Standalone Game Verification',
            prompt: "You've verified the fix in PIE. To ensure the solution holds up in a deployed environment and isn't just an editor-specific behavior, what's the next logical step for verification?",
            choices: [
                {
                    text: "Launch as Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the game as a 'Standalone Game' (or a packaged build). You repeat the test, firing fast projectiles at thin walls. The projectiles consistently collide and generate hit events, confirming the fix works reliably outside of the editor's PIE environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Re-check collision presets]",
                    type: 'wrong',
                    feedback: "You've already established that collision presets weren't the root cause and that the CCD setting was the fix. Re-checking them now is redundant and won't help verify the CCD fix in a standalone build.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'physics',
            title: 'Dead End: Redundant Check',
            prompt: "Re-checking collision presets is a redundant step. The goal is to verify the CCD fix in a different environment, not to re-diagnose the original problem.",
            choices: [
                {
                    text: "Focus on standalone verification]",
                    type: 'correct',
                    feedback: "You refocus on verifying the fix in a standalone game environment, which is crucial for deployment.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'physics',
            title: 'Performance Impact Assessment',
            prompt: "Enabling Continuous Collision Detection (CCD) can sometimes have a performance cost, especially with many fast-moving objects or complex scenes. How do you check if the fix has introduced any significant overhead?",
            choices: [
                {
                    text: "Use `stat unit` and `stat physics` console commands]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat physics` in PIE and/or Standalone Game. You observe the 'Game' and 'Physics' threads. While there might be a slight increase in physics cost due to the more complex swept collision calculations, it remains within acceptable limits for your project, confirming the fix is performant enough.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'physics',
            title: 'Visualizing Physics Sweeps',
            prompt: "You've identified that discrete collision is likely the issue. How can you visually confirm that the physics engine isn't sweeping the projectile's path for intermediate collisions, but rather performing only discrete checks?",
            choices: [
                {
                    text: "Use `pxvis collision` console command]",
                    type: 'correct',
                    feedback: "You enable `pxvis collision` in the console and observe the projectile's movement. When it tunnels, you see only discrete collision shapes at the start and end of its movement for that frame, with no intermediate sweep lines or hit points, visually confirming the lack of continuous collision detection.",
                    next: 'step-red-herring-1'
                },
                {
                    text: "Check material physics properties]",
                    type: 'wrong',
                    feedback: "You check the physics materials, but they primarily define friction, restitution, and density, not how the collision detection algorithm itself (discrete vs. continuous) is performed. This doesn't help diagnose the tunneling mechanism.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'physics',
            title: 'Dead End: Irrelevant Check',
            prompt: "Checking physics materials was a dead end. You need to focus on how the collision *detection* is being performed, not just the properties of the surfaces.",
            choices: [
                {
                    text: "Re-evaluate and try a different visualization]",
                    type: 'correct',
                    feedback: "You refocus on visualizing the actual collision process, realizing that console commands like `pxvis collision` are designed for this purpose.",
                    next: 'step-red-herring-1'
                },
            ]
        },

        'step-red-herring-1': {
            skill: 'physics',
            title: 'Misguided: Tweaking Physics Substepping',
            prompt: "You've confirmed discrete collision. You recall that physics substepping can increase collision fidelity by breaking down a single frame's physics update into smaller steps. You decide to try increasing the number of physics sub-steps in Project Settings to see if it helps.",
            choices: [
                {
                    text: "Increase Physics Substeps and reduce Max Physics Delta Time]",
                    type: 'misguided',
                    feedback: "You increase `Max Substeps` and decrease `Max Physics Delta Time` in Project Settings -> Physics. While this *can* reduce tunneling for some cases by making physics updates more frequent, for extremely fast projectiles or very thin geometry, it often only mitigates the problem and significantly increases CPU cost without fully solving the fundamental issue of discrete collision missing the object entirely.",
                    next: 'step-red-herring-1M'
                },
                {
                    text: "Realize substepping is a performance trade-off, not a direct solution for CCD]",
                    type: 'correct',
                    feedback: "You realize that while substepping improves general physics accuracy, it's not a direct substitute for continuous collision detection when objects are moving extremely fast. It's a performance trade-off that might not fully solve the tunneling and could be costly.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-red-herring-1M': {
            skill: 'physics',
            title: 'Dead End: Substepping Limitations',
            prompt: "Increasing substepping helped slightly but didn't eliminate the tunneling, and you noticed a performance hit. Substepping improves general physics stability but doesn't fundamentally change the discrete nature of collision checks for fast-moving objects.",
            choices: [
                {
                    text: "Revert substepping changes and focus on continuous collision]",
                    type: 'correct',
                    feedback: "You revert the substepping changes to avoid unnecessary performance overhead and refocus on the core problem: the lack of continuous collision detection for the projectile.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'physics',
            title: 'Confirming CCD Status',
            prompt: "You've seen the discrete collision behavior and understand substepping isn't the primary fix. Now you need to explicitly confirm the Continuous Collision Detection (CCD) setting on the projectile's collision component, as this is the direct solution for fast-moving objects.",
            choices: [
                {
                    text: "Inspect Projectile's Collision Component Details]",
                    type: 'correct',
                    feedback: "You open the projectile's Blueprint, select its primary collision component (e.g., Sphere Collision), and navigate to the 'Collision' section in the Details panel. You confirm that 'Continuous Collision Detection' (or 'CCD') is indeed unchecked/disabled, which is the root cause.",
                    next: 'step-inv-1'
                },
                {
                    text: "Check Projectile Movement Component settings]",
                    type: 'wrong',
                    feedback: "While the Projectile Movement Component dictates movement behavior, it doesn't directly control the *type* of collision detection (discrete vs. continuous) performed by the physics body itself. That setting resides on the collision component.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'physics',
            title: 'Dead End: Wrong Component',
            prompt: "You checked the Projectile Movement Component, but the CCD setting isn't there. You need to look at the actual collision primitive.",
            choices: [
                {
                    text: "Look at the collision component's details]",
                    type: 'correct',
                    feedback: "You realize the collision detection settings are part of the collision component itself, not the movement component.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'physics',
            title: 'Standalone Game Verification',
            prompt: "You've verified the fix in PIE. To ensure the solution holds up in a deployed environment and isn't just an editor-specific behavior, what's the next logical step for verification?",
            choices: [
                {
                    text: "Launch as Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the game as a 'Standalone Game' (or a packaged build). You repeat the test, firing fast projectiles at thin walls. The projectiles consistently collide and generate hit events, confirming the fix works reliably outside of the editor's PIE environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Re-check collision presets]",
                    type: 'wrong',
                    feedback: "You've already established that collision presets weren't the root cause and that the CCD setting was the fix. Re-checking them now is redundant and won't help verify the CCD fix in a standalone build.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'physics',
            title: 'Dead End: Redundant Check',
            prompt: "Re-checking collision presets is a redundant step. The goal is to verify the CCD fix in a different environment, not to re-diagnose the original problem.",
            choices: [
                {
                    text: "Focus on standalone verification]",
                    type: 'correct',
                    feedback: "You refocus on verifying the fix in a standalone game environment, which is crucial for deployment.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'physics',
            title: 'Performance Impact Assessment',
            prompt: "Enabling Continuous Collision Detection (CCD) can sometimes have a performance cost, especially with many fast-moving objects or complex scenes. How do you check if the fix has introduced any significant overhead?",
            choices: [
                {
                    text: "Use `stat unit` and `stat physics` console commands]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat physics` in PIE and/or Standalone Game. You observe the 'Game' and 'Physics' threads. While there might be a slight increase in physics cost due to the more complex swept collision calculations, it remains within acceptable limits for your project, confirming the fix is performant enough.",
                    next: 'step-ver-1'
                },
                {
                    text: "Profile GPU usage]",
                    type: 'wrong',
                    feedback: "While profiling is generally good, GPU usage is primarily related to rendering. CCD is a CPU-bound physics calculation. You need to focus on CPU-related stats like `stat unit` and `stat physics` to accurately assess its impact.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'physics',
            title: 'Dead End: Wrong Profiling Focus',
            prompt: "Profiling GPU usage won't tell you about the CPU cost of physics calculations. You need to use CPU-focused stats.",
            choices: [
                {
                    text: "Switch to CPU physics stats]",
                    type: 'correct',
                    feedback: "You realize the need to use `stat physics` and `stat unit` to properly assess the CPU performance impact of CCD.",
                    next: 'step-ver-1'
                },
            ]
        },
                },
                {
                    text: "Profile GPU usage]",
                    type: 'wrong',
                    feedback: "While profiling is generally good, GPU usage is primarily related to rendering. CCD is a CPU-bound physics calculation. You need to focus on CPU-related stats like `stat unit` and `stat physics` to accurately assess its impact.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'physics',
            title: 'Dead End: Wrong Profiling Focus',
            prompt: "Profiling GPU usage won't tell you about the CPU cost of physics calculations. You need to use CPU-focused stats.",
            choices: [
                {
                    text: "Switch to CPU physics stats]",
                    type: 'correct',
                    feedback: "You realize the need to use `stat physics` and `stat unit` to properly assess the CPU performance impact of CCD.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'physics',
            title: 'Visualizing Physics Sweeps',
            prompt: "You've identified that discrete collision is likely the issue. How can you visually confirm that the physics engine isn't sweeping the projectile's path for intermediate collisions, but rather performing only discrete checks?",
            choices: [
                {
                    text: "Use `pxvis collision` console command]",
                    type: 'correct',
                    feedback: "You enable `pxvis collision` in the console and observe the projectile's movement. When it tunnels, you see only discrete collision shapes at the start and end of its movement for that frame, with no intermediate sweep lines or hit points, visually confirming the lack of continuous collision detection.",
                    next: 'step-red-herring-1'
                },
                {
                    text: "Check material physics properties]",
                    type: 'wrong',
                    feedback: "You check the physics materials, but they primarily define friction, restitution, and density, not how the collision detection algorithm itself (discrete vs. continuous) is performed. This doesn't help diagnose the tunneling mechanism.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'physics',
            title: 'Dead End: Irrelevant Check',
            prompt: "Checking physics materials was a dead end. You need to focus on how the collision *detection* is being performed, not just the properties of the surfaces.",
            choices: [
                {
                    text: "Re-evaluate and try a different visualization]",
                    type: 'correct',
                    feedback: "You refocus on visualizing the actual collision process, realizing that console commands like `pxvis collision` are designed for this purpose.",
                    next: 'step-red-herring-1'
                },
            ]
        },

        'step-red-herring-1': {
            skill: 'physics',
            title: 'Misguided: Tweaking Physics Substepping',
            prompt: "You've confirmed discrete collision. You recall that physics substepping can increase collision fidelity by breaking down a single frame's physics update into smaller steps. You decide to try increasing the number of physics sub-steps in Project Settings to see if it helps.",
            choices: [
                {
                    text: "Increase Physics Substeps and reduce Max Physics Delta Time]",
                    type: 'misguided',
                    feedback: "You increase `Max Substeps` and decrease `Max Physics Delta Time` in Project Settings -> Physics. While this *can* reduce tunneling for some cases by making physics updates more frequent, for extremely fast projectiles or very thin geometry, it often only mitigates the problem and significantly increases CPU cost without fully solving the fundamental issue of discrete collision missing the object entirely.",
                    next: 'step-red-herring-1M'
                },
                {
                    text: "Realize substepping is a performance trade-off, not a direct solution for CCD]",
                    type: 'correct',
                    feedback: "You realize that while substepping improves general physics accuracy, it's not a direct substitute for continuous collision detection when objects are moving extremely fast. It's a performance trade-off that might not fully solve the tunneling and could be costly.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-red-herring-1M': {
            skill: 'physics',
            title: 'Dead End: Substepping Limitations',
            prompt: "Increasing substepping helped slightly but didn't eliminate the tunneling, and you noticed a performance hit. Substepping improves general physics stability but doesn't fundamentally change the discrete nature of collision checks for fast-moving objects.",
            choices: [
                {
                    text: "Revert substepping changes and focus on continuous collision]",
                    type: 'correct',
                    feedback: "You revert the substepping changes to avoid unnecessary performance overhead and refocus on the core problem: the lack of continuous collision detection for the projectile.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'physics',
            title: 'Confirming CCD Status',
            prompt: "You've seen the discrete collision behavior and understand substepping isn't the primary fix. Now you need to explicitly confirm the Continuous Collision Detection (CCD) setting on the projectile's collision component, as this is the direct solution for fast-moving objects.",
            choices: [
                {
                    text: "Inspect Projectile's Collision Component Details]",
                    type: 'correct',
                    feedback: "You open the projectile's Blueprint, select its primary collision component (e.g., Sphere Collision), and navigate to the 'Collision' section in the Details panel. You confirm that 'Continuous Collision Detection' (or 'CCD') is indeed unchecked/disabled, which is the root cause.",
                    next: 'step-inv-1'
                },
                {
                    text: "Check Projectile Movement Component settings]",
                    type: 'wrong',
                    feedback: "While the Projectile Movement Component dictates movement behavior, it doesn't directly control the *type* of collision detection (discrete vs. continuous) performed by the physics body itself. That setting resides on the collision component.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'physics',
            title: 'Dead End: Wrong Component',
            prompt: "You checked the Projectile Movement Component, but the CCD setting isn't there. You need to look at the actual collision primitive.",
            choices: [
                {
                    text: "Look at the collision component's details]",
                    type: 'correct',
                    feedback: "You realize the collision detection settings are part of the collision component itself, not the movement component.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'physics',
            title: 'Standalone Game Verification',
            prompt: "You've verified the fix in PIE. To ensure the solution holds up in a deployed environment and isn't just an editor-specific behavior, what's the next logical step for verification?",
            choices: [
                {
                    text: "Launch as Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the game as a 'Standalone Game' (or a packaged build). You repeat the test, firing fast projectiles at thin walls. The projectiles consistently collide and generate hit events, confirming the fix works reliably outside of the editor's PIE environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Re-check collision presets]",
                    type: 'wrong',
                    feedback: "You've already established that collision presets weren't the root cause and that the CCD setting was the fix. Re-checking them now is redundant and won't help verify the CCD fix in a standalone build.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'physics',
            title: 'Dead End: Redundant Check',
            prompt: "Re-checking collision presets is a redundant step. The goal is to verify the CCD fix in a different environment, not to re-diagnose the original problem.",
            choices: [
                {
                    text: "Focus on standalone verification]",
                    type: 'correct',
                    feedback: "You refocus on verifying the fix in a standalone game environment, which is crucial for deployment.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'physics',
            title: 'Performance Impact Assessment',
            prompt: "Enabling Continuous Collision Detection (CCD) can sometimes have a performance cost, especially with many fast-moving objects or complex scenes. How do you check if the fix has introduced any significant overhead?",
            choices: [
                {
                    text: "Use `stat unit` and `stat physics` console commands]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat physics` in PIE and/or Standalone Game. You observe the 'Game' and 'Physics' threads. While there might be a slight increase in physics cost due to the more complex swept collision calculations, it remains within acceptable limits for your project, confirming the fix is performant enough.",
                    next: 'step-ver-1'
                },
                {
                    text: "Profile GPU usage]",
                    type: 'wrong',
                    feedback: "While profiling is generally good, GPU usage is primarily related to rendering. CCD is a CPU-bound physics calculation. You need to focus on CPU-related stats like `stat unit` and `stat physics` to accurately assess its impact.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'physics',
            title: 'Dead End: Wrong Profiling Focus',
            prompt: "Profiling GPU usage won't tell you about the CPU cost of physics calculations. You need to use CPU-focused stats.",
            choices: [
                {
                    text: "Switch to CPU physics stats]",
                    type: 'correct',
                    feedback: "You realize the need to use `stat physics` and `stat unit` to properly assess the CPU performance impact of CCD.",
                    next: 'step-ver-1'
                },
            ]
        },
                },
            ]
        },

        
        'step-inv-1': {
            skill: 'physics',
            title: 'Visualizing Physics Sweeps',
            prompt: "You've identified that discrete collision is likely the issue. How can you visually confirm that the physics engine isn't sweeping the projectile's path for intermediate collisions, but rather performing only discrete checks?",
            choices: [
                {
                    text: "Use `pxvis collision` console command]",
                    type: 'correct',
                    feedback: "You enable `pxvis collision` in the console and observe the projectile's movement. When it tunnels, you see only discrete collision shapes at the start and end of its movement for that frame, with no intermediate sweep lines or hit points, visually confirming the lack of continuous collision detection.",
                    next: 'step-red-herring-1'
                },
                {
                    text: "Check material physics properties]",
                    type: 'wrong',
                    feedback: "You check the physics materials, but they primarily define friction, restitution, and density, not how the collision detection algorithm itself (discrete vs. continuous) is performed. This doesn't help diagnose the tunneling mechanism.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'physics',
            title: 'Dead End: Irrelevant Check',
            prompt: "Checking physics materials was a dead end. You need to focus on how the collision *detection* is being performed, not just the properties of the surfaces.",
            choices: [
                {
                    text: "Re-evaluate and try a different visualization]",
                    type: 'correct',
                    feedback: "You refocus on visualizing the actual collision process, realizing that console commands like `pxvis collision` are designed for this purpose.",
                    next: 'step-red-herring-1'
                },
            ]
        },

        'step-red-herring-1': {
            skill: 'physics',
            title: 'Misguided: Tweaking Physics Substepping',
            prompt: "You've confirmed discrete collision. You recall that physics substepping can increase collision fidelity by breaking down a single frame's physics update into smaller steps. You decide to try increasing the number of physics sub-steps in Project Settings to see if it helps.",
            choices: [
                {
                    text: "Increase Physics Substeps and reduce Max Physics Delta Time]",
                    type: 'misguided',
                    feedback: "You increase `Max Substeps` and decrease `Max Physics Delta Time` in Project Settings -> Physics. While this *can* reduce tunneling for some cases by making physics updates more frequent, for extremely fast projectiles or very thin geometry, it often only mitigates the problem and significantly increases CPU cost without fully solving the fundamental issue of discrete collision missing the object entirely.",
                    next: 'step-red-herring-1M'
                },
                {
                    text: "Realize substepping is a performance trade-off, not a direct solution for CCD]",
                    type: 'correct',
                    feedback: "You realize that while substepping improves general physics accuracy, it's not a direct substitute for continuous collision detection when objects are moving extremely fast. It's a performance trade-off that might not fully solve the tunneling and could be costly.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-red-herring-1M': {
            skill: 'physics',
            title: 'Dead End: Substepping Limitations',
            prompt: "Increasing substepping helped slightly but didn't eliminate the tunneling, and you noticed a performance hit. Substepping improves general physics stability but doesn't fundamentally change the discrete nature of collision checks for fast-moving objects.",
            choices: [
                {
                    text: "Revert substepping changes and focus on continuous collision]",
                    type: 'correct',
                    feedback: "You revert the substepping changes to avoid unnecessary performance overhead and refocus on the core problem: the lack of continuous collision detection for the projectile.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'physics',
            title: 'Confirming CCD Status',
            prompt: "You've seen the discrete collision behavior and understand substepping isn't the primary fix. Now you need to explicitly confirm the Continuous Collision Detection (CCD) setting on the projectile's collision component, as this is the direct solution for fast-moving objects.",
            choices: [
                {
                    text: "Inspect Projectile's Collision Component Details]",
                    type: 'correct',
                    feedback: "You open the projectile's Blueprint, select its primary collision component (e.g., Sphere Collision), and navigate to the 'Collision' section in the Details panel. You confirm that 'Continuous Collision Detection' (or 'CCD') is indeed unchecked/disabled, which is the root cause.",
                    next: 'step-inv-1'
                },
                {
                    text: "Check Projectile Movement Component settings]",
                    type: 'wrong',
                    feedback: "While the Projectile Movement Component dictates movement behavior, it doesn't directly control the *type* of collision detection (discrete vs. continuous) performed by the physics body itself. That setting resides on the collision component.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'physics',
            title: 'Dead End: Wrong Component',
            prompt: "You checked the Projectile Movement Component, but the CCD setting isn't there. You need to look at the actual collision primitive.",
            choices: [
                {
                    text: "Look at the collision component's details]",
                    type: 'correct',
                    feedback: "You realize the collision detection settings are part of the collision component itself, not the movement component.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'physics',
            title: 'Standalone Game Verification',
            prompt: "You've verified the fix in PIE. To ensure the solution holds up in a deployed environment and isn't just an editor-specific behavior, what's the next logical step for verification?",
            choices: [
                {
                    text: "Launch as Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the game as a 'Standalone Game' (or a packaged build). You repeat the test, firing fast projectiles at thin walls. The projectiles consistently collide and generate hit events, confirming the fix works reliably outside of the editor's PIE environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Re-check collision presets]",
                    type: 'wrong',
                    feedback: "You've already established that collision presets weren't the root cause and that the CCD setting was the fix. Re-checking them now is redundant and won't help verify the CCD fix in a standalone build.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'physics',
            title: 'Dead End: Redundant Check',
            prompt: "Re-checking collision presets is a redundant step. The goal is to verify the CCD fix in a different environment, not to re-diagnose the original problem.",
            choices: [
                {
                    text: "Focus on standalone verification]",
                    type: 'correct',
                    feedback: "You refocus on verifying the fix in a standalone game environment, which is crucial for deployment.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'physics',
            title: 'Performance Impact Assessment',
            prompt: "Enabling Continuous Collision Detection (CCD) can sometimes have a performance cost, especially with many fast-moving objects or complex scenes. How do you check if the fix has introduced any significant overhead?",
            choices: [
                {
                    text: "Use `stat unit` and `stat physics` console commands]",
                    type: 'correct',
                    feedback: "You enable `stat unit` and `stat physics` in PIE and/or Standalone Game. You observe the 'Game' and 'Physics' threads. While there might be a slight increase in physics cost due to the more complex swept collision calculations, it remains within acceptable limits for your project, confirming the fix is performant enough.",
                    next: 'step-ver-1'
                },
                {
                    text: "Profile GPU usage]",
                    type: 'wrong',
                    feedback: "While profiling is generally good, GPU usage is primarily related to rendering. CCD is a CPU-bound physics calculation. You need to focus on CPU-related stats like `stat unit` and `stat physics` to accurately assess its impact.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'physics',
            title: 'Dead End: Wrong Profiling Focus',
            prompt: "Profiling GPU usage won't tell you about the CPU cost of physics calculations. You need to use CPU-focused stats.",
            choices: [
                {
                    text: "Switch to CPU physics stats]",
                    type: 'correct',
                    feedback: "You realize the need to use `stat physics` and `stat unit` to properly assess the CPU performance impact of CCD.",
                    next: 'step-ver-1'
                },
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