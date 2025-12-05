window.SCENARIOS['SequencerLightReverts'] = {
    meta: {
        expanded: true,
        title: "Light Reverts After Cinematic",
        description: "Keyframed light resets after sequence. Investigates \"Restore State\" vs \"Keep State\".",
        estimateHours: 1.5,
        category: "Cinematics"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'sequencer',
            title: 'The Symptom',
            prompt: "A spotlight is keyframed in Sequencer to fade to bright RED at the end of a cinematic, but as soon as the sequence finishes, the light snaps back to its original white color. Property resets on sequence end. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You scrub the Sequencer timeline and watch the light in the viewport: during the shot, the color correctly animates to RED. The moment playback stops, the light's color instantly returns to white. This tells you the track is applying during the sequence but something is explicitly restoring the pre-sequence state when it ends.",
                    next: 'step-inv-1'
                },
                {
                    text: "Wrong Guess]",
                    type: 'wrong',
                    feedback: "You try duplicating the keys and even keyframe the light directly in the level, but the color still snaps back to white when the cinematic finishes. Clearly the keys are working during playback, so the problem isn't missing keyframes.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'sequencer',
            title: 'Dead End: Wrong Guess',
            prompt: "You went down the wrong path, assuming the issue was bad keyframes or a broken light actor. The animation clearly plays correctly; it's only after the sequence ends that the property reverts.",
            choices: [
                {
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the extra keyframe clutter and refocus on Sequencer's playback settings--specifically what Sequencer does to bound properties when the section finishes.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-2': {
            skill: 'sequencer',
            title: 'Investigation',
            prompt: "You open the Level Sequence, select the light's color track section, and inspect its properties to understand why the light state is being reverted after playback. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "In the section's Properties, you see that \"When Finished\" is set to the default \"Restore State\". That setting tells Sequencer to push the animated value during playback and then restore the original value (white) as soon as the sequence stops. That's exactly why the spotlight won't stay RED at the end of the cinematic.",
                    next: 'step-3'
                },
                {
                    text: "Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You consider adding another hidden sequence or a Blueprint to reapply the RED color after the cinematic, but that's just a hack. It would fight against Sequencer still restoring the original value on its own.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'sequencer',
            title: 'Dead End: Misguided',
            prompt: "That didn't work because Sequencer is still configured to restore the light's original color when the sequence ends. Any external attempts to force the color RED will be overwritten unless you change that behavior.",
            choices: [
                {
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize the correct approach is to change the track's \"When Finished\" behavior in Sequencer so it keeps the final value from the cinematic instead of restoring the pre-cinematic state.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'sequencer',
            title: 'The Fix',
            prompt: "You now know the cause: the spotlight's color track is set to \"Restore State\" at the end of the sequence. How do you fix it so the light stays RED after the cinematic?",
            choices: [
                {
                    text: "Set \'When Finished\' to \'Keep State\'.]",
                    type: 'correct',
                    feedback: "In Sequencer, you right-click the light color track section, open Properties, and change the \"When Finished\" option from \"Restore State\" to \"Keep State\". This tells Sequencer to leave the light at its final keyed value (RED) when the cinematic ends instead of snapping back to the original white color.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'sequencer',
            title: 'Verification',
            prompt: "You re-run the cinematic in PIE and watch the spotlight's behavior before, during, and after the sequence. How do you verify the fix?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, the spotlight starts white, animates to RED as the sequence plays, and after the cinematic finishes, it remains RED in the level. The property no longer snaps back, confirming that setting \"When Finished\" to \"Keep State\" solved the problem.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'sequencer',
            title: 'Observe Property Values',
            prompt: "Before diving into Sequencer settings, let's confirm the property change directly. With the Sequencer open, play the cinematic and simultaneously observe the spotlight's 'Color' property in the Details panel. What do you notice?",
            choices: [
                {
                    text: "Observe Details Panel]",
                    type: 'correct',
                    feedback: "You see the 'Color' property in the Details panel change from white to red during playback. The moment the sequence ends, it instantly snaps back to white. This confirms the property is being actively reset, not just failing to apply.",
                    next: 'step-inv-2'
                },
                {
                    text: "Check for other animation tracks]",
                    type: 'wrong',
                    feedback: "While checking for other tracks is a good idea, observing the live property value gives you immediate feedback on *when* and *how* the change occurs. Let's focus on direct observation first.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-inv-2': {
            skill: 'blueprint',
            title: 'Rule Out External Interference',
            prompt: "The Details panel confirms the property is being reset. Before assuming it's a Sequencer setting, you should quickly check if any other system might be interfering. Are there any other obvious places where this spotlight's color might be controlled?",
            choices: [
                {
                    text: "Check Level Blueprint/Actor Blueprints]",
                    type: 'correct',
                    feedback: "You quickly scan the Level Blueprint and any Blueprints associated with the spotlight. You find no nodes actively setting the light's color on sequence end or level load. This strengthens the suspicion that Sequencer itself is responsible for the revert.",
                    next: 'step-inv-1'
                },
                {
                    text: "Check for conflicting Sequencer tracks/sub-sequences]",
                    type: 'misguided',
                    feedback: "You meticulously check for other animation tracks or sub-sequences that might be overriding the color. While good practice, you find no conflicting tracks. The issue isn't about *which* track is applying, but *what happens* to the property *after* the sequence finishes.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'sequencer',
            title: 'Dead End: Conflicting Tracks (Red Herring)',
            prompt: "You've spent time looking for other animation tracks or sub-sequences that might be conflicting, but found none. The problem isn't that another track is setting the color *during* the sequence, but that the color reverts *after* the sequence ends. What's your next move?",
            choices: [
                {
                    text: "Re-evaluate external interference]",
                    type: 'correct',
                    feedback: "You realize the problem is the *revert* after the sequence, not a conflict during. You refocus on ruling out external systems before returning to Sequencer's specific end-of-sequence behavior.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-ver-1': {
            skill: 'testing',
            title: 'Standalone Game Verification',
            prompt: "The fix works in PIE. To ensure robustness, you should verify the behavior in a more production-like environment. How do you test this?",
            choices: [
                {
                    text: "Launch Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the game in 'Standalone Game' mode. The cinematic plays, the light turns RED, and crucially, it remains RED after the sequence finishes. This confirms the fix works outside of the editor's PIE environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Check console logs for errors]",
                    type: 'wrong',
                    feedback: "While checking logs is always good, the primary goal here is to verify the visual behavior in a standalone build. Logs might not show anything if the visual state is the only issue.",
                    next: 'step-ver-1'
                },
            ]
        },

        'step-ver-2': {
            skill: 'testing',
            title: 'Persistence Across Level Loads',
            prompt: "The light stays RED after the cinematic in a standalone build. One final check: does the light's RED state persist if the level is reloaded or the game is restarted? This ensures the 'Keep State' isn't just a temporary runtime effect.",
            choices: [
                {
                    text: "Reload Level/Restart Game]",
                    type: 'correct',
                    feedback: "You reload the level or restart the standalone game. The light correctly starts white, plays the cinematic, turns RED, and remains RED. If you then reload the level, it will revert to white (its default state) until the cinematic plays again, which is the expected behavior. The 'Keep State' correctly applies the final cinematic value until the actor is reloaded or reset.",
                    next: 'step-ver-1'
                },
                {
                    text: "Profile performance with Stat Unit]",
                    type: 'wrong',
                    feedback: "Performance profiling is important for complex changes, but for a simple property change like this, it's unlikely to reveal issues. The focus is on the persistence of the visual state.",
                    next: 'step-ver-2'
                },
            ]
        },

        
        'step-inv-1': {
            skill: 'sequencer',
            title: 'Confirming the Revert',
            prompt: "You've confirmed the light snaps back to white after the sequence. To further investigate, you pause PIE right after the sequence ends and select the spotlight actor in the Outliner. What do you check in its Details panel?",
            choices: [
                {
                    text: "Observe the 'Light Color' property]",
                    type: 'correct',
                    feedback: "The 'Light Color' property in the Details panel clearly shows the light is white, confirming that the actor's property itself has reverted, not just a visual glitch. This tells you Sequencer successfully applied the RED color during playback, but then explicitly changed it back.",
                    next: 'step-inv-2'
                },
                {
                    text: "Check 'Cast Shadows' setting]",
                    type: 'wrong',
                    feedback: "While important for rendering, the 'Cast Shadows' setting has no bearing on the light's color. This is a distraction from the core issue of the color reverting.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'sequencer',
            title: 'Dead End: Irrelevant Property',
            prompt: "Checking irrelevant properties won't help. You need to focus on the property that is actually reverting: the light's color.",
            choices: [
                {
                    text: "Refocus on Light Color]",
                    type: 'correct',
                    feedback: "You refocus your attention on the light's color property in the Details panel.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-inv-2': {
            skill: 'sequencer',
            title: 'Deeper Property Inspection',
            prompt: "You've visually confirmed the light's color reverted in the Details panel. For a more programmatic verification, you open the Output Log and use a console command to inspect the spotlight's properties after the sequence ends. Which command would be most useful?",
            choices: [
                {
                    text: "Use 'DumpActor <LightActorName>']",
                    type: 'correct',
                    feedback: "You type `DumpActor MySpotLightActor_0` (or similar) into the console. The output confirms that the `LightColor` property is indeed set to white (RGB 1.0, 1.0, 1.0) after the sequence, reinforcing that the actor's state was explicitly restored. This eliminates any doubt about the property's actual value.",
                    next: 'step-inv-1'
                },
                {
                    text: "Before checking Sequencer settings, investigate light's material or Blueprints.]",
                    type: 'misguided',
                    feedback: "You decide to check for external influences first, a common debugging step.",
                    next: 'step-rh-1'
                },
                {
                    text: "Use 'Stat Unit']",
                    type: 'wrong',
                    feedback: "While `Stat Unit` is useful for performance debugging, it won't tell you anything about the specific properties of an actor. You need a command to inspect actor state.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'sequencer',
            title: 'Dead End: Wrong Console Command',
            prompt: "You used a performance command, not a property inspection command. You need to query the actor's current state directly.",
            choices: [
                {
                    text: "Try a different command]",
                    type: 'correct',
                    feedback: "You realize your mistake and prepare to use a command that inspects actor properties.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-rh-1': {
            skill: 'blueprint',
            title: 'Red Herring: Material/Blueprint Conflict',
            prompt: "You've confirmed the light's color reverts. Before diving into Sequencer's specific 'When Finished' settings, you decide to investigate if any external logic, like a Blueprint or material, might be causing the reset. What do you check?",
            choices: [
                {
                    text: "Examine the light's material instance and any associated Blueprints.]",
                    type: 'misguided',
                    feedback: "You spend time examining the light's material instance and any associated Blueprints. While it's good practice to check for external influences, you find no logic that would explicitly reset the light's color after the cinematic. The problem still points back to Sequencer's behavior on finish.",
                    next: 'step-rh-1M'
                },
                {
                    text: "Check the project settings for a global light reset option.]",
                    type: 'wrong',
                    feedback: "There's no global project setting that would cause a specific light to revert its color after a cinematic. This is an unlikely place to find the solution.",
                    next: 'step-rh-1W'
                },
            ]
        },

        'step-rh-1W': {
            skill: 'blueprint',
            title: 'Dead End: Unlikely Global Setting',
            prompt: "You're looking in the wrong place. The issue is specific to a light and its interaction with Sequencer, not a global project setting.",
            choices: [
                {
                    text: "Return to checking external actor logic.]",
                    type: 'correct',
                    feedback: "You refocus on the light's material and Blueprints.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1M': {
            skill: 'blueprint',
            title: 'Dead End: No External Conflict',
            prompt: "You've confirmed there's no conflicting logic in the light's material or Blueprints. The issue remains isolated to how Sequencer handles the light's state after the cinematic. You need to re-examine Sequencer's specific settings for the light track.",
            choices: [
                {
                    text: "Return to Sequencer track properties]",
                    type: 'correct',
                    feedback: "You refocus on the Sequencer track properties, knowing the answer must lie within its 'When Finished' behavior.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'sequencer',
            title: 'Standalone Game Verification',
            prompt: "You've verified the fix in PIE. To ensure the behavior is consistent in a deployed environment, you launch the game in Standalone Game mode. What's the expected outcome?",
            choices: [
                {
                    text: "The light should transition to RED and remain RED after the cinematic ends.]",
                    type: 'correct',
                    feedback: "In Standalone Game, the cinematic plays, the light turns RED, and crucially, it stays RED after the sequence finishes. This confirms the fix works outside of the editor's PIE environment, which can sometimes have different behaviors.",
                    next: 'step-ver-2'
                },
                {
                    text: "The light might still revert in Standalone Game due to different engine initialization.]",
                    type: 'wrong',
                    feedback: "While some issues can manifest differently, a fundamental Sequencer setting like 'Keep State' should be consistent. Assuming it will revert without checking is premature and doesn't verify the fix.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'sequencer',
            title: 'Dead End: Lack of Confidence',
            prompt: "You need to confidently verify the fix. The 'Keep State' setting is fundamental and should apply consistently. Re-evaluate your expectation.",
            choices: [
                {
                    text: "Re-evaluate and confirm expected behavior]",
                    type: 'correct',
                    feedback: "You realize that 'Keep State' should indeed persist across PIE and Standalone Game, and prepare to confirm it.",
                    next: 'step-ver-1'
                },
            ]
        },

        'step-ver-2': {
            skill: 'blueprint',
            title: 'Post-Cinematic Controllability Check',
            prompt: "The light now correctly stays RED after the cinematic. As a final verification, you want to ensure the light isn't 'stuck' in this state and can still be controlled by other game logic. What's a quick way to test this?",
            choices: [
                {
                    text: "Trigger a simple Blueprint event to change the light's color or intensity.]",
                    type: 'correct',
                    feedback: "You set up a simple Blueprint trigger (e.g., pressing 'L' or walking into a volume) to change the light's color to blue or toggle its intensity. After the cinematic, you activate the trigger, and the light responds correctly, changing from RED to blue. This confirms the light actor is fully responsive and not locked by Sequencer's 'Keep State' setting, which only dictates its state *after* the sequence, not its subsequent controllability.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'sequencer',
            title: 'Confirming the Revert',
            prompt: "You've confirmed the light snaps back to white after the sequence. To further investigate, you pause PIE right after the sequence ends and select the spotlight actor in the Outliner. What do you check in its Details panel?",
            choices: [
                {
                    text: "Observe the 'Light Color' property]",
                    type: 'correct',
                    feedback: "The 'Light Color' property in the Details panel clearly shows the light is white, confirming that the actor's property itself has reverted, not just a visual glitch. This tells you Sequencer successfully applied the RED color during playback, but then explicitly changed it back.",
                    next: 'step-inv-2'
                },
                {
                    text: "Check 'Cast Shadows' setting]",
                    type: 'wrong',
                    feedback: "While important for rendering, the 'Cast Shadows' setting has no bearing on the light's color. This is a distraction from the core issue of the color reverting.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'sequencer',
            title: 'Dead End: Irrelevant Property',
            prompt: "Checking irrelevant properties won't help. You need to focus on the property that is actually reverting: the light's color.",
            choices: [
                {
                    text: "Refocus on Light Color]",
                    type: 'correct',
                    feedback: "You refocus your attention on the light's color property in the Details panel.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-inv-2': {
            skill: 'sequencer',
            title: 'Deeper Property Inspection',
            prompt: "You've visually confirmed the light's color reverted in the Details panel. For a more programmatic verification, you open the Output Log and use a console command to inspect the spotlight's properties after the sequence ends. Which command would be most useful?",
            choices: [
                {
                    text: "Use 'DumpActor <LightActorName>']",
                    type: 'correct',
                    feedback: "You type `DumpActor MySpotLightActor_0` (or similar) into the console. The output confirms that the `LightColor` property is indeed set to white (RGB 1.0, 1.0, 1.0) after the sequence, reinforcing that the actor's state was explicitly restored. This eliminates any doubt about the property's actual value.",
                    next: 'step-inv-1'
                },
                {
                    text: "Before checking Sequencer settings, investigate light's material or Blueprints.]",
                    type: 'misguided',
                    feedback: "You decide to check for external influences first, a common debugging step.",
                    next: 'step-rh-1'
                },
                {
                    text: "Use 'Stat Unit']",
                    type: 'wrong',
                    feedback: "While `Stat Unit` is useful for performance debugging, it won't tell you anything about the specific properties of an actor. You need a command to inspect actor state.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'sequencer',
            title: 'Dead End: Wrong Console Command',
            prompt: "You used a performance command, not a property inspection command. You need to query the actor's current state directly.",
            choices: [
                {
                    text: "Try a different command]",
                    type: 'correct',
                    feedback: "You realize your mistake and prepare to use a command that inspects actor properties.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-rh-1': {
            skill: 'blueprint',
            title: 'Red Herring: Material/Blueprint Conflict',
            prompt: "You've confirmed the light's color reverts. Before diving into Sequencer's specific 'When Finished' settings, you decide to investigate if any external logic, like a Blueprint or material, might be causing the reset. What do you check?",
            choices: [
                {
                    text: "Examine the light's material instance and any associated Blueprints.]",
                    type: 'misguided',
                    feedback: "You spend time examining the light's material instance and any associated Blueprints. While it's good practice to check for external influences, you find no logic that would explicitly reset the light's color after the cinematic. The problem still points back to Sequencer's behavior on finish.",
                    next: 'step-rh-1M'
                },
                {
                    text: "Check the project settings for a global light reset option.]",
                    type: 'wrong',
                    feedback: "There's no global project setting that would cause a specific light to revert its color after a cinematic. This is an unlikely place to find the solution.",
                    next: 'step-rh-1W'
                },
            ]
        },

        'step-rh-1W': {
            skill: 'blueprint',
            title: 'Dead End: Unlikely Global Setting',
            prompt: "You're looking in the wrong place. The issue is specific to a light and its interaction with Sequencer, not a global project setting.",
            choices: [
                {
                    text: "Return to checking external actor logic.]",
                    type: 'correct',
                    feedback: "You refocus on the light's material and Blueprints.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1M': {
            skill: 'blueprint',
            title: 'Dead End: No External Conflict',
            prompt: "You've confirmed there's no conflicting logic in the light's material or Blueprints. The issue remains isolated to how Sequencer handles the light's state after the cinematic. You need to re-examine Sequencer's specific settings for the light track.",
            choices: [
                {
                    text: "Return to Sequencer track properties]",
                    type: 'correct',
                    feedback: "You refocus on the Sequencer track properties, knowing the answer must lie within its 'When Finished' behavior.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'sequencer',
            title: 'Standalone Game Verification',
            prompt: "You've verified the fix in PIE. To ensure the behavior is consistent in a deployed environment, you launch the game in Standalone Game mode. What's the expected outcome?",
            choices: [
                {
                    text: "The light should transition to RED and remain RED after the cinematic ends.]",
                    type: 'correct',
                    feedback: "In Standalone Game, the cinematic plays, the light turns RED, and crucially, it stays RED after the sequence finishes. This confirms the fix works outside of the editor's PIE environment, which can sometimes have different behaviors.",
                    next: 'step-ver-2'
                },
                {
                    text: "The light might still revert in Standalone Game due to different engine initialization.]",
                    type: 'wrong',
                    feedback: "While some issues can manifest differently, a fundamental Sequencer setting like 'Keep State' should be consistent. Assuming it will revert without checking is premature and doesn't verify the fix.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'sequencer',
            title: 'Dead End: Lack of Confidence',
            prompt: "You need to confidently verify the fix. The 'Keep State' setting is fundamental and should apply consistently. Re-evaluate your expectation.",
            choices: [
                {
                    text: "Re-evaluate and confirm expected behavior]",
                    type: 'correct',
                    feedback: "You realize that 'Keep State' should indeed persist across PIE and Standalone Game, and prepare to confirm it.",
                    next: 'step-ver-1'
                },
            ]
        },

        'step-ver-2': {
            skill: 'blueprint',
            title: 'Post-Cinematic Controllability Check',
            prompt: "The light now correctly stays RED after the cinematic. As a final verification, you want to ensure the light isn't 'stuck' in this state and can still be controlled by other game logic. What's a quick way to test this?",
            choices: [
                {
                    text: "Trigger a simple Blueprint event to change the light's color or intensity.]",
                    type: 'correct',
                    feedback: "You set up a simple Blueprint trigger (e.g., pressing 'L' or walking into a volume) to change the light's color to blue or toggle its intensity. After the cinematic, you activate the trigger, and the light responds correctly, changing from RED to blue. This confirms the light actor is fully responsive and not locked by Sequencer's 'Keep State' setting, which only dictates its state *after* the sequence, not its subsequent controllability.",
                    next: 'conclusion'
                },
                {
                    text: "Check 'Stat Game' for any performance spikes related to the light.]",
                    type: 'wrong',
                    feedback: "While performance is always a concern, 'Keep State' is a simple property setting and is unlikely to cause a performance spike. This check doesn't directly verify the light's post-cinematic controllability.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'blueprint',
            title: 'Dead End: Irrelevant Verification',
            prompt: "Performance is important, but your current goal is to confirm the light's responsiveness after the cinematic. A performance check won't tell you if it's still controllable.",
            choices: [
                {
                    text: "Focus on controllability]",
                    type: 'correct',
                    feedback: "You refocus on verifying the light's ability to be controlled by other game logic after the cinematic.",
                    next: 'step-ver-2'
                },
            ]
        },

        'conclusion'
                },
                {
                    text: "Check 'Stat Game' for any performance spikes related to the light.]",
                    type: 'wrong',
                    feedback: "While performance is always a concern, 'Keep State' is a simple property setting and is unlikely to cause a performance spike. This check doesn't directly verify the light's post-cinematic controllability.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'blueprint',
            title: 'Dead End: Irrelevant Verification',
            prompt: "Performance is important, but your current goal is to confirm the light's responsiveness after the cinematic. A performance check won't tell you if it's still controllable.",
            choices: [
                {
                    text: "Focus on controllability]",
                    type: 'correct',
                    feedback: "You refocus on verifying the light's ability to be controlled by other game logic after the cinematic.",
                    next: 'step-ver-2'
                },
            ]
        },

        
        'step-inv-1': {
            skill: 'sequencer',
            title: 'Confirming the Revert',
            prompt: "You've confirmed the light snaps back to white after the sequence. To further investigate, you pause PIE right after the sequence ends and select the spotlight actor in the Outliner. What do you check in its Details panel?",
            choices: [
                {
                    text: "Observe the 'Light Color' property]",
                    type: 'correct',
                    feedback: "The 'Light Color' property in the Details panel clearly shows the light is white, confirming that the actor's property itself has reverted, not just a visual glitch. This tells you Sequencer successfully applied the RED color during playback, but then explicitly changed it back.",
                    next: 'step-inv-2'
                },
                {
                    text: "Check 'Cast Shadows' setting]",
                    type: 'wrong',
                    feedback: "While important for rendering, the 'Cast Shadows' setting has no bearing on the light's color. This is a distraction from the core issue of the color reverting.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'sequencer',
            title: 'Dead End: Irrelevant Property',
            prompt: "Checking irrelevant properties won't help. You need to focus on the property that is actually reverting: the light's color.",
            choices: [
                {
                    text: "Refocus on Light Color]",
                    type: 'correct',
                    feedback: "You refocus your attention on the light's color property in the Details panel.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-inv-2': {
            skill: 'sequencer',
            title: 'Deeper Property Inspection',
            prompt: "You've visually confirmed the light's color reverted in the Details panel. For a more programmatic verification, you open the Output Log and use a console command to inspect the spotlight's properties after the sequence ends. Which command would be most useful?",
            choices: [
                {
                    text: "Use 'DumpActor <LightActorName>']",
                    type: 'correct',
                    feedback: "You type `DumpActor MySpotLightActor_0` (or similar) into the console. The output confirms that the `LightColor` property is indeed set to white (RGB 1.0, 1.0, 1.0) after the sequence, reinforcing that the actor's state was explicitly restored. This eliminates any doubt about the property's actual value.",
                    next: 'step-inv-1'
                },
                {
                    text: "Before checking Sequencer settings, investigate light's material or Blueprints.]",
                    type: 'misguided',
                    feedback: "You decide to check for external influences first, a common debugging step.",
                    next: 'step-rh-1'
                },
                {
                    text: "Use 'Stat Unit']",
                    type: 'wrong',
                    feedback: "While `Stat Unit` is useful for performance debugging, it won't tell you anything about the specific properties of an actor. You need a command to inspect actor state.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'sequencer',
            title: 'Dead End: Wrong Console Command',
            prompt: "You used a performance command, not a property inspection command. You need to query the actor's current state directly.",
            choices: [
                {
                    text: "Try a different command]",
                    type: 'correct',
                    feedback: "You realize your mistake and prepare to use a command that inspects actor properties.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-rh-1': {
            skill: 'blueprint',
            title: 'Red Herring: Material/Blueprint Conflict',
            prompt: "You've confirmed the light's color reverts. Before diving into Sequencer's specific 'When Finished' settings, you decide to investigate if any external logic, like a Blueprint or material, might be causing the reset. What do you check?",
            choices: [
                {
                    text: "Examine the light's material instance and any associated Blueprints.]",
                    type: 'misguided',
                    feedback: "You spend time examining the light's material instance and any associated Blueprints. While it's good practice to check for external influences, you find no logic that would explicitly reset the light's color after the cinematic. The problem still points back to Sequencer's behavior on finish.",
                    next: 'step-rh-1M'
                },
                {
                    text: "Check the project settings for a global light reset option.]",
                    type: 'wrong',
                    feedback: "There's no global project setting that would cause a specific light to revert its color after a cinematic. This is an unlikely place to find the solution.",
                    next: 'step-rh-1W'
                },
            ]
        },

        'step-rh-1W': {
            skill: 'blueprint',
            title: 'Dead End: Unlikely Global Setting',
            prompt: "You're looking in the wrong place. The issue is specific to a light and its interaction with Sequencer, not a global project setting.",
            choices: [
                {
                    text: "Return to checking external actor logic.]",
                    type: 'correct',
                    feedback: "You refocus on the light's material and Blueprints.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1M': {
            skill: 'blueprint',
            title: 'Dead End: No External Conflict',
            prompt: "You've confirmed there's no conflicting logic in the light's material or Blueprints. The issue remains isolated to how Sequencer handles the light's state after the cinematic. You need to re-examine Sequencer's specific settings for the light track.",
            choices: [
                {
                    text: "Return to Sequencer track properties]",
                    type: 'correct',
                    feedback: "You refocus on the Sequencer track properties, knowing the answer must lie within its 'When Finished' behavior.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'sequencer',
            title: 'Standalone Game Verification',
            prompt: "You've verified the fix in PIE. To ensure the behavior is consistent in a deployed environment, you launch the game in Standalone Game mode. What's the expected outcome?",
            choices: [
                {
                    text: "The light should transition to RED and remain RED after the cinematic ends.]",
                    type: 'correct',
                    feedback: "In Standalone Game, the cinematic plays, the light turns RED, and crucially, it stays RED after the sequence finishes. This confirms the fix works outside of the editor's PIE environment, which can sometimes have different behaviors.",
                    next: 'step-ver-2'
                },
                {
                    text: "The light might still revert in Standalone Game due to different engine initialization.]",
                    type: 'wrong',
                    feedback: "While some issues can manifest differently, a fundamental Sequencer setting like 'Keep State' should be consistent. Assuming it will revert without checking is premature and doesn't verify the fix.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'sequencer',
            title: 'Dead End: Lack of Confidence',
            prompt: "You need to confidently verify the fix. The 'Keep State' setting is fundamental and should apply consistently. Re-evaluate your expectation.",
            choices: [
                {
                    text: "Re-evaluate and confirm expected behavior]",
                    type: 'correct',
                    feedback: "You realize that 'Keep State' should indeed persist across PIE and Standalone Game, and prepare to confirm it.",
                    next: 'step-ver-1'
                },
            ]
        },

        'step-ver-2': {
            skill: 'blueprint',
            title: 'Post-Cinematic Controllability Check',
            prompt: "The light now correctly stays RED after the cinematic. As a final verification, you want to ensure the light isn't 'stuck' in this state and can still be controlled by other game logic. What's a quick way to test this?",
            choices: [
                {
                    text: "Trigger a simple Blueprint event to change the light's color or intensity.]",
                    type: 'correct',
                    feedback: "You set up a simple Blueprint trigger (e.g., pressing 'L' or walking into a volume) to change the light's color to blue or toggle its intensity. After the cinematic, you activate the trigger, and the light responds correctly, changing from RED to blue. This confirms the light actor is fully responsive and not locked by Sequencer's 'Keep State' setting, which only dictates its state *after* the sequence, not its subsequent controllability.",
                    next: 'conclusion'
                },
                {
                    text: "Check 'Stat Game' for any performance spikes related to the light.]",
                    type: 'wrong',
                    feedback: "While performance is always a concern, 'Keep State' is a simple property setting and is unlikely to cause a performance spike. This check doesn't directly verify the light's post-cinematic controllability.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'blueprint',
            title: 'Dead End: Irrelevant Verification',
            prompt: "Performance is important, but your current goal is to confirm the light's responsiveness after the cinematic. A performance check won't tell you if it's still controllable.",
            choices: [
                {
                    text: "Focus on controllability]",
                    type: 'correct',
                    feedback: "You refocus on verifying the light's ability to be controlled by other game logic after the cinematic.",
                    next: 'step-ver-2'
                },
            ]
        },

        'conclusion'
                }
            ]
        },
        
        'step-inv-1': {
            skill: 'sequencer',
            title: 'Observe Property Values',
            prompt: "Before diving into Sequencer settings, let's confirm the property change directly. With the Sequencer open, play the cinematic and simultaneously observe the spotlight's 'Color' property in the Details panel. What do you notice?",
            choices: [
                {
                    text: "Observe Details Panel]",
                    type: 'correct',
                    feedback: "You see the 'Color' property in the Details panel change from white to red during playback. The moment the sequence ends, it instantly snaps back to white. This confirms the property is being actively reset, not just failing to apply.",
                    next: 'step-inv-2'
                },
                {
                    text: "Check for other animation tracks]",
                    type: 'wrong',
                    feedback: "While checking for other tracks is a good idea, observing the live property value gives you immediate feedback on *when* and *how* the change occurs. Let's focus on direct observation first.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-inv-2': {
            skill: 'blueprint',
            title: 'Rule Out External Interference',
            prompt: "The Details panel confirms the property is being reset. Before assuming it's a Sequencer setting, you should quickly check if any other system might be interfering. Are there any other obvious places where this spotlight's color might be controlled?",
            choices: [
                {
                    text: "Check Level Blueprint/Actor Blueprints]",
                    type: 'correct',
                    feedback: "You quickly scan the Level Blueprint and any Blueprints associated with the spotlight. You find no nodes actively setting the light's color on sequence end or level load. This strengthens the suspicion that Sequencer itself is responsible for the revert.",
                    next: 'step-inv-1'
                },
                {
                    text: "Check for conflicting Sequencer tracks/sub-sequences]",
                    type: 'misguided',
                    feedback: "You meticulously check for other animation tracks or sub-sequences that might be overriding the color. While good practice, you find no conflicting tracks. The issue isn't about *which* track is applying, but *what happens* to the property *after* the sequence finishes.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1': {
            skill: 'sequencer',
            title: 'Dead End: Conflicting Tracks (Red Herring)',
            prompt: "You've spent time looking for other animation tracks or sub-sequences that might be conflicting, but found none. The problem isn't that another track is setting the color *during* the sequence, but that the color reverts *after* the sequence ends. What's your next move?",
            choices: [
                {
                    text: "Re-evaluate external interference]",
                    type: 'correct',
                    feedback: "You realize the problem is the *revert* after the sequence, not a conflict during. You refocus on ruling out external systems before returning to Sequencer's specific end-of-sequence behavior.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-ver-1': {
            skill: 'testing',
            title: 'Standalone Game Verification',
            prompt: "The fix works in PIE. To ensure robustness, you should verify the behavior in a more production-like environment. How do you test this?",
            choices: [
                {
                    text: "Launch Standalone Game]",
                    type: 'correct',
                    feedback: "You launch the game in 'Standalone Game' mode. The cinematic plays, the light turns RED, and crucially, it remains RED after the sequence finishes. This confirms the fix works outside of the editor's PIE environment.",
                    next: 'step-ver-2'
                },
                {
                    text: "Check console logs for errors]",
                    type: 'wrong',
                    feedback: "While checking logs is always good, the primary goal here is to verify the visual behavior in a standalone build. Logs might not show anything if the visual state is the only issue.",
                    next: 'step-ver-1'
                },
            ]
        },

        'step-ver-2': {
            skill: 'testing',
            title: 'Persistence Across Level Loads',
            prompt: "The light stays RED after the cinematic in a standalone build. One final check: does the light's RED state persist if the level is reloaded or the game is restarted? This ensures the 'Keep State' isn't just a temporary runtime effect.",
            choices: [
                {
                    text: "Reload Level/Restart Game]",
                    type: 'correct',
                    feedback: "You reload the level or restart the standalone game. The light correctly starts white, plays the cinematic, turns RED, and remains RED. If you then reload the level, it will revert to white (its default state) until the cinematic plays again, which is the expected behavior. The 'Keep State' correctly applies the final cinematic value until the actor is reloaded or reset.",
                    next: 'step-ver-1'
                },
                {
                    text: "Profile performance with Stat Unit]",
                    type: 'wrong',
                    feedback: "Performance profiling is important for complex changes, but for a simple property change like this, it's unlikely to reveal issues. The focus is on the persistence of the visual state.",
                    next: 'step-ver-2'
                },
            ]
        },

        
        'step-inv-1': {
            skill: 'sequencer',
            title: 'Confirming the Revert',
            prompt: "You've confirmed the light snaps back to white after the sequence. To further investigate, you pause PIE right after the sequence ends and select the spotlight actor in the Outliner. What do you check in its Details panel?",
            choices: [
                {
                    text: "Observe the 'Light Color' property]",
                    type: 'correct',
                    feedback: "The 'Light Color' property in the Details panel clearly shows the light is white, confirming that the actor's property itself has reverted, not just a visual glitch. This tells you Sequencer successfully applied the RED color during playback, but then explicitly changed it back.",
                    next: 'step-inv-2'
                },
                {
                    text: "Check 'Cast Shadows' setting]",
                    type: 'wrong',
                    feedback: "While important for rendering, the 'Cast Shadows' setting has no bearing on the light's color. This is a distraction from the core issue of the color reverting.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'sequencer',
            title: 'Dead End: Irrelevant Property',
            prompt: "Checking irrelevant properties won't help. You need to focus on the property that is actually reverting: the light's color.",
            choices: [
                {
                    text: "Refocus on Light Color]",
                    type: 'correct',
                    feedback: "You refocus your attention on the light's color property in the Details panel.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-inv-2': {
            skill: 'sequencer',
            title: 'Deeper Property Inspection',
            prompt: "You've visually confirmed the light's color reverted in the Details panel. For a more programmatic verification, you open the Output Log and use a console command to inspect the spotlight's properties after the sequence ends. Which command would be most useful?",
            choices: [
                {
                    text: "Use 'DumpActor <LightActorName>']",
                    type: 'correct',
                    feedback: "You type `DumpActor MySpotLightActor_0` (or similar) into the console. The output confirms that the `LightColor` property is indeed set to white (RGB 1.0, 1.0, 1.0) after the sequence, reinforcing that the actor's state was explicitly restored. This eliminates any doubt about the property's actual value.",
                    next: 'step-inv-1'
                },
                {
                    text: "Before checking Sequencer settings, investigate light's material or Blueprints.]",
                    type: 'misguided',
                    feedback: "You decide to check for external influences first, a common debugging step.",
                    next: 'step-rh-1'
                },
                {
                    text: "Use 'Stat Unit']",
                    type: 'wrong',
                    feedback: "While `Stat Unit` is useful for performance debugging, it won't tell you anything about the specific properties of an actor. You need a command to inspect actor state.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'sequencer',
            title: 'Dead End: Wrong Console Command',
            prompt: "You used a performance command, not a property inspection command. You need to query the actor's current state directly.",
            choices: [
                {
                    text: "Try a different command]",
                    type: 'correct',
                    feedback: "You realize your mistake and prepare to use a command that inspects actor properties.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-rh-1': {
            skill: 'blueprint',
            title: 'Red Herring: Material/Blueprint Conflict',
            prompt: "You've confirmed the light's color reverts. Before diving into Sequencer's specific 'When Finished' settings, you decide to investigate if any external logic, like a Blueprint or material, might be causing the reset. What do you check?",
            choices: [
                {
                    text: "Examine the light's material instance and any associated Blueprints.]",
                    type: 'misguided',
                    feedback: "You spend time examining the light's material instance and any associated Blueprints. While it's good practice to check for external influences, you find no logic that would explicitly reset the light's color after the cinematic. The problem still points back to Sequencer's behavior on finish.",
                    next: 'step-rh-1M'
                },
                {
                    text: "Check the project settings for a global light reset option.]",
                    type: 'wrong',
                    feedback: "There's no global project setting that would cause a specific light to revert its color after a cinematic. This is an unlikely place to find the solution.",
                    next: 'step-rh-1W'
                },
            ]
        },

        'step-rh-1W': {
            skill: 'blueprint',
            title: 'Dead End: Unlikely Global Setting',
            prompt: "You're looking in the wrong place. The issue is specific to a light and its interaction with Sequencer, not a global project setting.",
            choices: [
                {
                    text: "Return to checking external actor logic.]",
                    type: 'correct',
                    feedback: "You refocus on the light's material and Blueprints.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1M': {
            skill: 'blueprint',
            title: 'Dead End: No External Conflict',
            prompt: "You've confirmed there's no conflicting logic in the light's material or Blueprints. The issue remains isolated to how Sequencer handles the light's state after the cinematic. You need to re-examine Sequencer's specific settings for the light track.",
            choices: [
                {
                    text: "Return to Sequencer track properties]",
                    type: 'correct',
                    feedback: "You refocus on the Sequencer track properties, knowing the answer must lie within its 'When Finished' behavior.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'sequencer',
            title: 'Standalone Game Verification',
            prompt: "You've verified the fix in PIE. To ensure the behavior is consistent in a deployed environment, you launch the game in Standalone Game mode. What's the expected outcome?",
            choices: [
                {
                    text: "The light should transition to RED and remain RED after the cinematic ends.]",
                    type: 'correct',
                    feedback: "In Standalone Game, the cinematic plays, the light turns RED, and crucially, it stays RED after the sequence finishes. This confirms the fix works outside of the editor's PIE environment, which can sometimes have different behaviors.",
                    next: 'step-ver-2'
                },
                {
                    text: "The light might still revert in Standalone Game due to different engine initialization.]",
                    type: 'wrong',
                    feedback: "While some issues can manifest differently, a fundamental Sequencer setting like 'Keep State' should be consistent. Assuming it will revert without checking is premature and doesn't verify the fix.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'sequencer',
            title: 'Dead End: Lack of Confidence',
            prompt: "You need to confidently verify the fix. The 'Keep State' setting is fundamental and should apply consistently. Re-evaluate your expectation.",
            choices: [
                {
                    text: "Re-evaluate and confirm expected behavior]",
                    type: 'correct',
                    feedback: "You realize that 'Keep State' should indeed persist across PIE and Standalone Game, and prepare to confirm it.",
                    next: 'step-ver-1'
                },
            ]
        },

        'step-ver-2': {
            skill: 'blueprint',
            title: 'Post-Cinematic Controllability Check',
            prompt: "The light now correctly stays RED after the cinematic. As a final verification, you want to ensure the light isn't 'stuck' in this state and can still be controlled by other game logic. What's a quick way to test this?",
            choices: [
                {
                    text: "Trigger a simple Blueprint event to change the light's color or intensity.]",
                    type: 'correct',
                    feedback: "You set up a simple Blueprint trigger (e.g., pressing 'L' or walking into a volume) to change the light's color to blue or toggle its intensity. After the cinematic, you activate the trigger, and the light responds correctly, changing from RED to blue. This confirms the light actor is fully responsive and not locked by Sequencer's 'Keep State' setting, which only dictates its state *after* the sequence, not its subsequent controllability.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'sequencer',
            title: 'Confirming the Revert',
            prompt: "You've confirmed the light snaps back to white after the sequence. To further investigate, you pause PIE right after the sequence ends and select the spotlight actor in the Outliner. What do you check in its Details panel?",
            choices: [
                {
                    text: "Observe the 'Light Color' property]",
                    type: 'correct',
                    feedback: "The 'Light Color' property in the Details panel clearly shows the light is white, confirming that the actor's property itself has reverted, not just a visual glitch. This tells you Sequencer successfully applied the RED color during playback, but then explicitly changed it back.",
                    next: 'step-inv-2'
                },
                {
                    text: "Check 'Cast Shadows' setting]",
                    type: 'wrong',
                    feedback: "While important for rendering, the 'Cast Shadows' setting has no bearing on the light's color. This is a distraction from the core issue of the color reverting.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'sequencer',
            title: 'Dead End: Irrelevant Property',
            prompt: "Checking irrelevant properties won't help. You need to focus on the property that is actually reverting: the light's color.",
            choices: [
                {
                    text: "Refocus on Light Color]",
                    type: 'correct',
                    feedback: "You refocus your attention on the light's color property in the Details panel.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-inv-2': {
            skill: 'sequencer',
            title: 'Deeper Property Inspection',
            prompt: "You've visually confirmed the light's color reverted in the Details panel. For a more programmatic verification, you open the Output Log and use a console command to inspect the spotlight's properties after the sequence ends. Which command would be most useful?",
            choices: [
                {
                    text: "Use 'DumpActor <LightActorName>']",
                    type: 'correct',
                    feedback: "You type `DumpActor MySpotLightActor_0` (or similar) into the console. The output confirms that the `LightColor` property is indeed set to white (RGB 1.0, 1.0, 1.0) after the sequence, reinforcing that the actor's state was explicitly restored. This eliminates any doubt about the property's actual value.",
                    next: 'step-inv-1'
                },
                {
                    text: "Before checking Sequencer settings, investigate light's material or Blueprints.]",
                    type: 'misguided',
                    feedback: "You decide to check for external influences first, a common debugging step.",
                    next: 'step-rh-1'
                },
                {
                    text: "Use 'Stat Unit']",
                    type: 'wrong',
                    feedback: "While `Stat Unit` is useful for performance debugging, it won't tell you anything about the specific properties of an actor. You need a command to inspect actor state.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'sequencer',
            title: 'Dead End: Wrong Console Command',
            prompt: "You used a performance command, not a property inspection command. You need to query the actor's current state directly.",
            choices: [
                {
                    text: "Try a different command]",
                    type: 'correct',
                    feedback: "You realize your mistake and prepare to use a command that inspects actor properties.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-rh-1': {
            skill: 'blueprint',
            title: 'Red Herring: Material/Blueprint Conflict',
            prompt: "You've confirmed the light's color reverts. Before diving into Sequencer's specific 'When Finished' settings, you decide to investigate if any external logic, like a Blueprint or material, might be causing the reset. What do you check?",
            choices: [
                {
                    text: "Examine the light's material instance and any associated Blueprints.]",
                    type: 'misguided',
                    feedback: "You spend time examining the light's material instance and any associated Blueprints. While it's good practice to check for external influences, you find no logic that would explicitly reset the light's color after the cinematic. The problem still points back to Sequencer's behavior on finish.",
                    next: 'step-rh-1M'
                },
                {
                    text: "Check the project settings for a global light reset option.]",
                    type: 'wrong',
                    feedback: "There's no global project setting that would cause a specific light to revert its color after a cinematic. This is an unlikely place to find the solution.",
                    next: 'step-rh-1W'
                },
            ]
        },

        'step-rh-1W': {
            skill: 'blueprint',
            title: 'Dead End: Unlikely Global Setting',
            prompt: "You're looking in the wrong place. The issue is specific to a light and its interaction with Sequencer, not a global project setting.",
            choices: [
                {
                    text: "Return to checking external actor logic.]",
                    type: 'correct',
                    feedback: "You refocus on the light's material and Blueprints.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1M': {
            skill: 'blueprint',
            title: 'Dead End: No External Conflict',
            prompt: "You've confirmed there's no conflicting logic in the light's material or Blueprints. The issue remains isolated to how Sequencer handles the light's state after the cinematic. You need to re-examine Sequencer's specific settings for the light track.",
            choices: [
                {
                    text: "Return to Sequencer track properties]",
                    type: 'correct',
                    feedback: "You refocus on the Sequencer track properties, knowing the answer must lie within its 'When Finished' behavior.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'sequencer',
            title: 'Standalone Game Verification',
            prompt: "You've verified the fix in PIE. To ensure the behavior is consistent in a deployed environment, you launch the game in Standalone Game mode. What's the expected outcome?",
            choices: [
                {
                    text: "The light should transition to RED and remain RED after the cinematic ends.]",
                    type: 'correct',
                    feedback: "In Standalone Game, the cinematic plays, the light turns RED, and crucially, it stays RED after the sequence finishes. This confirms the fix works outside of the editor's PIE environment, which can sometimes have different behaviors.",
                    next: 'step-ver-2'
                },
                {
                    text: "The light might still revert in Standalone Game due to different engine initialization.]",
                    type: 'wrong',
                    feedback: "While some issues can manifest differently, a fundamental Sequencer setting like 'Keep State' should be consistent. Assuming it will revert without checking is premature and doesn't verify the fix.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'sequencer',
            title: 'Dead End: Lack of Confidence',
            prompt: "You need to confidently verify the fix. The 'Keep State' setting is fundamental and should apply consistently. Re-evaluate your expectation.",
            choices: [
                {
                    text: "Re-evaluate and confirm expected behavior]",
                    type: 'correct',
                    feedback: "You realize that 'Keep State' should indeed persist across PIE and Standalone Game, and prepare to confirm it.",
                    next: 'step-ver-1'
                },
            ]
        },

        'step-ver-2': {
            skill: 'blueprint',
            title: 'Post-Cinematic Controllability Check',
            prompt: "The light now correctly stays RED after the cinematic. As a final verification, you want to ensure the light isn't 'stuck' in this state and can still be controlled by other game logic. What's a quick way to test this?",
            choices: [
                {
                    text: "Trigger a simple Blueprint event to change the light's color or intensity.]",
                    type: 'correct',
                    feedback: "You set up a simple Blueprint trigger (e.g., pressing 'L' or walking into a volume) to change the light's color to blue or toggle its intensity. After the cinematic, you activate the trigger, and the light responds correctly, changing from RED to blue. This confirms the light actor is fully responsive and not locked by Sequencer's 'Keep State' setting, which only dictates its state *after* the sequence, not its subsequent controllability.",
                    next: 'conclusion'
                },
                {
                    text: "Check 'Stat Game' for any performance spikes related to the light.]",
                    type: 'wrong',
                    feedback: "While performance is always a concern, 'Keep State' is a simple property setting and is unlikely to cause a performance spike. This check doesn't directly verify the light's post-cinematic controllability.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'blueprint',
            title: 'Dead End: Irrelevant Verification',
            prompt: "Performance is important, but your current goal is to confirm the light's responsiveness after the cinematic. A performance check won't tell you if it's still controllable.",
            choices: [
                {
                    text: "Focus on controllability]",
                    type: 'correct',
                    feedback: "You refocus on verifying the light's ability to be controlled by other game logic after the cinematic.",
                    next: 'step-ver-2'
                },
            ]
        },

        'conclusion'
                },
                {
                    text: "Check 'Stat Game' for any performance spikes related to the light.]",
                    type: 'wrong',
                    feedback: "While performance is always a concern, 'Keep State' is a simple property setting and is unlikely to cause a performance spike. This check doesn't directly verify the light's post-cinematic controllability.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'blueprint',
            title: 'Dead End: Irrelevant Verification',
            prompt: "Performance is important, but your current goal is to confirm the light's responsiveness after the cinematic. A performance check won't tell you if it's still controllable.",
            choices: [
                {
                    text: "Focus on controllability]",
                    type: 'correct',
                    feedback: "You refocus on verifying the light's ability to be controlled by other game logic after the cinematic.",
                    next: 'step-ver-2'
                },
            ]
        },

        
        'step-inv-1': {
            skill: 'sequencer',
            title: 'Confirming the Revert',
            prompt: "You've confirmed the light snaps back to white after the sequence. To further investigate, you pause PIE right after the sequence ends and select the spotlight actor in the Outliner. What do you check in its Details panel?",
            choices: [
                {
                    text: "Observe the 'Light Color' property]",
                    type: 'correct',
                    feedback: "The 'Light Color' property in the Details panel clearly shows the light is white, confirming that the actor's property itself has reverted, not just a visual glitch. This tells you Sequencer successfully applied the RED color during playback, but then explicitly changed it back.",
                    next: 'step-inv-2'
                },
                {
                    text: "Check 'Cast Shadows' setting]",
                    type: 'wrong',
                    feedback: "While important for rendering, the 'Cast Shadows' setting has no bearing on the light's color. This is a distraction from the core issue of the color reverting.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'sequencer',
            title: 'Dead End: Irrelevant Property',
            prompt: "Checking irrelevant properties won't help. You need to focus on the property that is actually reverting: the light's color.",
            choices: [
                {
                    text: "Refocus on Light Color]",
                    type: 'correct',
                    feedback: "You refocus your attention on the light's color property in the Details panel.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-inv-2': {
            skill: 'sequencer',
            title: 'Deeper Property Inspection',
            prompt: "You've visually confirmed the light's color reverted in the Details panel. For a more programmatic verification, you open the Output Log and use a console command to inspect the spotlight's properties after the sequence ends. Which command would be most useful?",
            choices: [
                {
                    text: "Use 'DumpActor <LightActorName>']",
                    type: 'correct',
                    feedback: "You type `DumpActor MySpotLightActor_0` (or similar) into the console. The output confirms that the `LightColor` property is indeed set to white (RGB 1.0, 1.0, 1.0) after the sequence, reinforcing that the actor's state was explicitly restored. This eliminates any doubt about the property's actual value.",
                    next: 'step-inv-1'
                },
                {
                    text: "Before checking Sequencer settings, investigate light's material or Blueprints.]",
                    type: 'misguided',
                    feedback: "You decide to check for external influences first, a common debugging step.",
                    next: 'step-rh-1'
                },
                {
                    text: "Use 'Stat Unit']",
                    type: 'wrong',
                    feedback: "While `Stat Unit` is useful for performance debugging, it won't tell you anything about the specific properties of an actor. You need a command to inspect actor state.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'sequencer',
            title: 'Dead End: Wrong Console Command',
            prompt: "You used a performance command, not a property inspection command. You need to query the actor's current state directly.",
            choices: [
                {
                    text: "Try a different command]",
                    type: 'correct',
                    feedback: "You realize your mistake and prepare to use a command that inspects actor properties.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-rh-1': {
            skill: 'blueprint',
            title: 'Red Herring: Material/Blueprint Conflict',
            prompt: "You've confirmed the light's color reverts. Before diving into Sequencer's specific 'When Finished' settings, you decide to investigate if any external logic, like a Blueprint or material, might be causing the reset. What do you check?",
            choices: [
                {
                    text: "Examine the light's material instance and any associated Blueprints.]",
                    type: 'misguided',
                    feedback: "You spend time examining the light's material instance and any associated Blueprints. While it's good practice to check for external influences, you find no logic that would explicitly reset the light's color after the cinematic. The problem still points back to Sequencer's behavior on finish.",
                    next: 'step-rh-1M'
                },
                {
                    text: "Check the project settings for a global light reset option.]",
                    type: 'wrong',
                    feedback: "There's no global project setting that would cause a specific light to revert its color after a cinematic. This is an unlikely place to find the solution.",
                    next: 'step-rh-1W'
                },
            ]
        },

        'step-rh-1W': {
            skill: 'blueprint',
            title: 'Dead End: Unlikely Global Setting',
            prompt: "You're looking in the wrong place. The issue is specific to a light and its interaction with Sequencer, not a global project setting.",
            choices: [
                {
                    text: "Return to checking external actor logic.]",
                    type: 'correct',
                    feedback: "You refocus on the light's material and Blueprints.",
                    next: 'step-rh-1'
                },
            ]
        },

        'step-rh-1M': {
            skill: 'blueprint',
            title: 'Dead End: No External Conflict',
            prompt: "You've confirmed there's no conflicting logic in the light's material or Blueprints. The issue remains isolated to how Sequencer handles the light's state after the cinematic. You need to re-examine Sequencer's specific settings for the light track.",
            choices: [
                {
                    text: "Return to Sequencer track properties]",
                    type: 'correct',
                    feedback: "You refocus on the Sequencer track properties, knowing the answer must lie within its 'When Finished' behavior.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'sequencer',
            title: 'Standalone Game Verification',
            prompt: "You've verified the fix in PIE. To ensure the behavior is consistent in a deployed environment, you launch the game in Standalone Game mode. What's the expected outcome?",
            choices: [
                {
                    text: "The light should transition to RED and remain RED after the cinematic ends.]",
                    type: 'correct',
                    feedback: "In Standalone Game, the cinematic plays, the light turns RED, and crucially, it stays RED after the sequence finishes. This confirms the fix works outside of the editor's PIE environment, which can sometimes have different behaviors.",
                    next: 'step-ver-2'
                },
                {
                    text: "The light might still revert in Standalone Game due to different engine initialization.]",
                    type: 'wrong',
                    feedback: "While some issues can manifest differently, a fundamental Sequencer setting like 'Keep State' should be consistent. Assuming it will revert without checking is premature and doesn't verify the fix.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'sequencer',
            title: 'Dead End: Lack of Confidence',
            prompt: "You need to confidently verify the fix. The 'Keep State' setting is fundamental and should apply consistently. Re-evaluate your expectation.",
            choices: [
                {
                    text: "Re-evaluate and confirm expected behavior]",
                    type: 'correct',
                    feedback: "You realize that 'Keep State' should indeed persist across PIE and Standalone Game, and prepare to confirm it.",
                    next: 'step-ver-1'
                },
            ]
        },

        'step-ver-2': {
            skill: 'blueprint',
            title: 'Post-Cinematic Controllability Check',
            prompt: "The light now correctly stays RED after the cinematic. As a final verification, you want to ensure the light isn't 'stuck' in this state and can still be controlled by other game logic. What's a quick way to test this?",
            choices: [
                {
                    text: "Trigger a simple Blueprint event to change the light's color or intensity.]",
                    type: 'correct',
                    feedback: "You set up a simple Blueprint trigger (e.g., pressing 'L' or walking into a volume) to change the light's color to blue or toggle its intensity. After the cinematic, you activate the trigger, and the light responds correctly, changing from RED to blue. This confirms the light actor is fully responsive and not locked by Sequencer's 'Keep State' setting, which only dictates its state *after* the sequence, not its subsequent controllability.",
                    next: 'conclusion'
                },
                {
                    text: "Check 'Stat Game' for any performance spikes related to the light.]",
                    type: 'wrong',
                    feedback: "While performance is always a concern, 'Keep State' is a simple property setting and is unlikely to cause a performance spike. This check doesn't directly verify the light's post-cinematic controllability.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'blueprint',
            title: 'Dead End: Irrelevant Verification',
            prompt: "Performance is important, but your current goal is to confirm the light's responsiveness after the cinematic. A performance check won't tell you if it's still controllable.",
            choices: [
                {
                    text: "Focus on controllability]",
                    type: 'correct',
                    feedback: "You refocus on verifying the light's ability to be controlled by other game logic after the cinematic.",
                    next: 'step-ver-2'
                },
            ]
        },

        'conclusion': {
            skill: 'sequencer',
            title: 'Conclusion',
            prompt: "Lesson: When a property animated in Sequencer reverts after playback, check the track section's \"When Finished\" setting. Use \"Keep State\" instead of the default \"Restore State\" whenever you want the final cinematic value--like a light turning RED--to persist after the sequence ends.",
            choices: []
        }
    }
};