window.SCENARIOS['SequencerLightRestoreStateIssue'] = {
    "meta": {
        "title": "Cinematic Light Fails to Persist After Sequence Stops",
        "description": "When testing the short cinematic sequence, the camera cuts and character animation play correctly. However, a tracked Spotlight, which has its intensity and color keyframed to be red at the end of the sequence, immediately turns off and reverts to its initial intensity (or disappears) the moment the sequence finishes playing. The light should remain red and on, illuminating the scene after the cinematic concludes. The actor itself is persistent in the level.",
        "estimateHours": 0.75,
        "category": "Sequencer & Cinematics",
        "tokens_used": 10544
    },
    "setup": [
        {
            "action": "set_ue_property",
            "scenario": "SequencerLightRestoreStateIssue",
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
            "scenario": "SequencerLightRestoreStateIssue",
            "step": "final"
        }
    ],
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "general",
            "title": "Initial Problem Assessment",
            "prompt": "<p>The spotlight immediately turns off after the cinematic ends, reverting to its initial state. The camera and character animations play correctly. What is your first diagnostic approach?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Focus on the cinematic system to understand how it interacts with actors after playback.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. This is the correct high-level focus given the problem's description. </p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Check the light actor's mobility settings (e.g., ensuring it's 'Movable') in the Level Details panel.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. While light mobility is important, the light *works* during the cinematic. This suggests a post-cinematic state issue, not a rendering or baking problem.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Re-keyframe the light's intensity and color to even higher values in the Sequencer, assuming they're just too weak.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. The light's values are already set correctly; arbitrary re-keyframing won't resolve a state persistence issue.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Review the project settings for any global cinematic playback options that might affect actor state.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.08hrs. Global project settings rarely control individual actor persistence within specific sequences. This is too broad for a targeted fix.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "sequencer",
            "title": "Locating the Cinematic Actor",
            "prompt": "<p>You've identified the cinematic system as the likely culprit. The issue is with a specific cinematic. How do you locate the Level Sequence Actor managing this cinematic in your level?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate the Level Sequence Actor associated with the cinematic in the Outliner or Content Browser.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Finding the specific actor is key to accessing its properties and the sequence itself.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Check the main Level Sequence Actor's properties for a 'Playback End' setting in the Details panel in the main editor.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While the Level Sequence Actor has properties, the detailed playback and actor-specific state management are typically found *within* the Sequencer editor, not the top-level actor properties.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Delete the current Level Sequence Actor and recreate a new one, hoping it resets any hidden states.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. This is a drastic, data-loss risk action without investigating the root cause first.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Inspect the Level Blueprint for any nodes referencing the cinematic or the light actor.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. While Level Blueprints can interact with cinematics, the problem's nature points to internal Sequencer settings for a tracked actor, not external blueprint logic.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "sequencer",
            "title": "Opening the Sequencer Editor",
            "prompt": "<p>You've located the Level Sequence Actor, 'MyCinematicSequence'. How do you open its editor to inspect its contents and settings?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Double-click the Level Sequence Asset within the Level Sequence Actor's Details panel or Content Browser to open the Sequencer editor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. This is the standard way to open the Sequencer editor for a Level Sequence asset.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Attempt to change the 'When Finished' option on the main Level Sequence Actor in the level to 'Keep State' or 'Keep Last Frame'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.25hrs. This option primarily affects the playback cursor's behavior (where it stops), not the state of *Possessable Actors* within the sequence.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Try to inspect the Level Sequence Actor's properties in the main editor's Details panel, without opening Sequencer.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. The in-depth settings for actor interaction within a sequence are found *inside* the Sequencer editor, not the Level Editor's Details panel for the actor.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Check the 'Output' settings directly on the Level Sequence Asset in the Content Browser.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.07hrs. Output settings relate to render exports or specific output formats, not actor state persistence after playback.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "sequencer",
            "title": "Identifying the Light's Track",
            "prompt": "<p>You're now in the Sequencer editor. The issue is with a specific spotlight. What's the immediate next step to investigate how this light is managed within the sequence?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Identify the specific track binding for the problematic persistent light actor (e.g., 'Spotlight_Environment_01').</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.04hrs. Focusing on the problematic actor's track is the most direct way to examine its sequence-specific settings.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Check the main Level Sequence properties within Sequencer for global playback settings.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While global settings exist, a specific actor's persistence issue is more likely controlled by its individual binding settings.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Add a new light track and try to re-keyframe the light entirely from scratch.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. This is unnecessary work and won't fix an underlying state persistence issue if the new track inherits the same problem.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Examine the Camera Cut track for any unexpected camera transitions at the end of the sequence.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Camera cuts are unrelated to a light actor's intensity or color persistence.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "sequencer",
            "title": "Confirming Actor Binding Type",
            "prompt": "<p>You've found the track for 'Spotlight_Environment_01'. Before checking keyframes, what basic property of the light actor's binding in Sequencer should you confirm to ensure it's intended to maintain its level state?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Confirm that the light actor is listed as a 'Possessable' (green icon) since it is an existing actor in the level.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.04hrs. Possessable actors retain their level identity and can maintain their state, which is crucial for persistence.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Check the 'Ease Out' settings on the track's final keyframes to ensure a smooth transition.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.07hrs. Ease-out settings affect the *transition* to the final state, not the state *after* the sequence finishes.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Attempt to change the light actor from 'Possessable' to 'Spawnable' within Sequencer.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Spawnable actors are created and destroyed by the sequence, which would prevent persistence. This is the opposite of what's needed.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Look for additional hidden tracks that might be overriding the light's properties.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.06hrs. While possible, it's less likely to cause a complete reversion than a specific state management setting.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "sequencer",
            "title": "Verifying Final Keyframe Position",
            "prompt": "<p>The light is confirmed as a 'Possessable'. Now, you need to verify its keyframed state at the very end of the sequence. What's the direct way to inspect this in Sequencer?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Scrub the timeline to the final frame of the sequence.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Moving to the end of the timeline is essential to inspect the final keyframed state.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Check the light's properties in the main Level Editor Details panel while Sequencer is open.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.08hrs. The Level Editor's Details panel shows the *current* state of the actor, not necessarily its state as dictated by Sequencer at a specific frame.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Delete all existing keyframes and add new ones for intensity and color at the end.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.12hrs. This destroys previous work without first diagnosing if the keyframes themselves are the issue.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Look for any \"lock\" icons on the track to see if editing is disabled.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.04hrs. This is unrelated to the light's *value* at the end of the sequence; the light plays correctly during the sequence.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "sequencer",
            "title": "Verifying Intensity Keyframe",
            "prompt": "<p>You've scrubbed to the final frame. What specifically should you verify about the light's intensity at this point?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify that an Intensity keyframe is present and its value is greater than zero.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Confirming the intensity keyframe exists and is 'on' is crucial for the light to be visible.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Check the initial intensity value at the start of the sequence.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.03hrs. The problem is with the light's state *after* the sequence, not at its beginning.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Add another intensity keyframe right at the very end of the sequence.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. If a keyframe already exists, adding another identical one won't solve a persistence issue.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Check for any transform keys on the light actor's track.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.03hrs. Transform keys relate to position, rotation, or scale, not intensity or color.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "sequencer",
            "title": "Verifying Color Keyframe",
            "prompt": "<p>Intensity keyframe is present and valid. Now, what should you verify about the light's color at the final frame?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify that a Light Color keyframe is present and its value is set to red.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Confirming the color keyframe is set correctly is necessary for the desired visual outcome.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Change the light's color to white, assuming red might be causing issues.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This is an arbitrary change that doesn't address the core persistence problem and deviates from the desired red color.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Check the saturation level of the light's color.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.02hrs. While part of color, the core issue is the color itself reverting, not its saturation.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Look for any post-process volumes that might be overriding the light's color in the scene.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.06hrs. Post-process effects are global or regional; they wouldn't selectively revert a single light's color after a sequence.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-9": {
            "skill": "sequencer",
            "title": "Locating Sequencer-Specific Details",
            "prompt": "<p>Keyframes for intensity and color are confirmed correct, and the actor is 'Possessable'. The problem persists. This indicates a setting on how Sequencer handles the actor's state after playback. Where in Sequencer would you find such specific binding settings for this light track?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>With the light binding track selected, locate the 'Details' panel specific to the Sequencer editor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The Sequencer Details panel holds properties specific to selected tracks and bindings.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Check the main Level Sequence properties in the main Unreal Editor Details panel.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.12hrs. These are top-level properties; actor-specific binding settings are within Sequencer's own Details panel.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Try adding an 'Event Track' to trigger a light state change at the end of the sequence.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.18hrs. This is a workaround that doesn't address the underlying issue of why the light is reverting, potentially adding complexity.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Look for global 'Output Settings' for the sequence within Sequencer.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.08hrs. Output settings are for rendered exports, not runtime actor state persistence.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "sequencer",
            "title": "Making Sequencer Details Visible",
            "prompt": "<p>The Sequencer-specific 'Details' panel is not currently visible. How do you access or make it visible within the Sequencer editor?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the 'Window' menu within the Sequencer editor and enable the 'Details' panel.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Most editor panels are accessed via the 'Window' menu.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Drag and drop the light actor from the Outliner back into Sequencer, hoping it refreshes the panels.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This action wouldn't typically bring up a hidden editor panel.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Close and reopen the entire Sequencer editor, hoping the panel appears by default.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.07hrs. This is an inefficient trial-and-error approach that wastes time.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Check the main Unreal Editor's 'Window' menu instead of the Sequencer's.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.04hrs. The main editor's Window menu controls its own panels, not those specific to nested editors like Sequencer.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "sequencer",
            "title": "Locating the Binding Section",
            "prompt": "<p>The Sequencer Details panel is now visible, and your light track is selected. Which section within this panel typically contains settings that control how the actor's state behaves after the sequence?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate the 'Binding' section within the Sequencer Details panel for the selected light actor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. The 'Binding' section holds crucial properties about how a Possessable actor integrates with the sequence.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Look for a 'Track Properties' or 'Keyframe Options' section.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.06hrs. These sections focus on the track or keyframes themselves, not the post-sequence behavior of the bound actor.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Scroll through the entire panel, reading every property name for keywords like 'light' or 'end'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This is an inefficient and time-consuming way to find a specific, well-known section.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Search for a section related to 'Sequencer Events'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Event sections handle custom blueprint events, not the automatic state management of Possessable actors.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "sequencer",
            "title": "Expanding Binding Options",
            "prompt": "<p>You've located the 'Binding' section for the light actor in the Sequencer Details panel. It's currently collapsed. What's the next step to reveal its properties?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Expand the 'Binding' section settings to expose advanced cinematic options.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. Expanding sections is standard UI interaction to reveal hidden properties.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Right-click the 'Binding' section header to see if there's a context menu.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.04hrs. While context menus exist, the standard way to expand a section is clicking the arrow/triangle icon.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Try to drag the 'Binding' section to a different panel or location.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This is a UI manipulation action unrelated to revealing hidden properties within a section.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Look for an \"Edit Binding\" button or similar explicit action.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.03hrs. This feature doesn't exist for simply expanding a section's properties.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "sequencer",
            "title": "Identifying Restore State Property",
            "prompt": "<p>The 'Binding' section is now expanded. You're looking for the specific property that dictates whether the actor reverts to its initial state or maintains its final keyframed state after the sequence. What is this property usually called?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Find the boolean property labeled 'Restore State' or 'Restore State/Keep State'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. 'Restore State' (or similar wording) is the exact property that controls this behavior for Possessable actors.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Look for a property named 'Default State' or 'Initial State'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.07hrs. While related to state, 'Restore State' is the direct control for post-sequence behavior.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Search for a property named 'Light Persistence' or 'Cinematic Hold'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. These are generic terms and don't match the actual property name in Unreal Engine.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Check for options related to 'Actor Tags' or 'Actor ID'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Actor tags and IDs are for identification, not state management during or after a sequence.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "sequencer",
            "title": "Observing Current Restore State",
            "prompt": "<p>You've located the 'Restore State' property. Given the current problem (the light reverting to its initial state), what is your expected observation of its current setting?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Observe that the 'Restore State' checkbox is currently enabled (checked).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. An enabled 'Restore State' is precisely why the actor's properties revert.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Observe that 'Restore State' is unchecked, indicating another issue is at play.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.08hrs. If it were unchecked, the light *should* persist, meaning the problem lies elsewhere, leading you on a prolonged incorrect path.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>The option is greyed out and cannot be changed.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This property is typically editable for Possessable actors. This observation would indicate a different, more complex issue.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>The option is missing entirely, suggesting a corrupted Level Sequence asset.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.12hrs. While asset corruption can happen, it's a rare and extreme diagnosis. The option is standard for Possessables.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "sequencer",
            "title": "Modifying Restore State",
            "prompt": "<p>You've confirmed that 'Restore State' is enabled, which is causing the light to revert. What action should you take to make the light remain in its final keyframed state after the cinematic finishes?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Uncheck the 'Restore State' option.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.08hrs. Unchecking this option instructs Sequencer to leave the actor's properties at their final keyframed state.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Attempt to use a Level Blueprint to manually set the light color and intensity to red immediately after the cinematic trigger node.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.3hrs. This is a redundant and inefficient workaround. The intended solution is within Sequencer's actor binding settings.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Add a new keyframe for the 'Restore State' property itself at the end of the sequence.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. 'Restore State' is a binding setting, not a keyframeable property; adding a keyframe for it is not possible or meaningful.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Manually set the light's default state in the main Level Details panel while Sequencer is open.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. The 'default state' is applied *before* the sequence begins, not after it ends to preserve the cinematic's effect.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "general",
            "title": "Saving Changes",
            "prompt": "<p>You've unchecked 'Restore State' for the light binding. What is a critical next step to ensure this change and any other modifications are preserved?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Click the 'Save All' button in the main Unreal Editor toolbar to ensure both the Level Sequence asset and the current Level are saved.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Saving all modified assets is crucial to prevent losing work.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Only save the Level Sequence asset via its context menu in the Content Browser.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While saving the sequence is good, if the level itself had unsaved changes (e.g., actor placement), they might be lost.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Assume changes are automatically saved by Sequencer after modification.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Auto-save exists, but explicit saves are always best practice, especially after critical changes. Relying on auto-save can lead to lost work.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Export the Level Sequence to a separate file for backup purposes.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.07hrs. Exporting is for backup or sharing, not for ensuring the current level's live state reflects changes.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "general",
            "title": "Closing Editor",
            "prompt": "<p>All changes are saved. What should you do with the Sequencer editor now that you've made the necessary modification?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Close the Sequencer editor window.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Closing unnecessary editor windows cleans up the workspace and frees resources.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Leave Sequencer open to observe real-time changes during cinematic playback.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.03hrs. While you *can* leave it open, it consumes resources and can sometimes interfere with PIE or gameplay; it's generally best to close it when not actively editing.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Close the entire Unreal Editor and reopen it to ensure all settings are reloaded.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. This is a drastic, unnecessary step. Saving and closing the Sequencer editor is sufficient.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Undock the Sequencer window and minimize it to the taskbar.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.02hrs. Minimizing still keeps the editor process active and consuming resources; closing is more definitive.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "general",
            "title": "Testing the Fix",
            "prompt": "<p>You're back in the main Unreal Editor. The Sequencer editor is closed, and changes are saved. How do you verify if the 'Restore State' modification has fixed the light persistence issue?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Return to the level viewport and trigger the cinematic playback (e.g., using PIE mode or walking into the trigger volume).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.08hrs. Direct playback of the cinematic in the level is the only way to test the fix in its intended runtime environment.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Manually adjust the light's intensity and color in the Details panel in the main editor to 'red' and 'on'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. This only sets the light manually; it doesn't test if the cinematic itself is now correctly managing persistence.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Look for a log message in the Output Log indicating the cinematic completed successfully or if the light state was preserved.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. The Output Log might show general info, but it won't explicitly confirm visual state changes without specific custom logging.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Check the light's visibility settings in the editor viewport without triggering cinematic playback.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The editor viewport reflects the current state, but not the dynamic state *after* cinematic playback.</p>",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "general",
            "title": "Observing Playback Results",
            "prompt": "<p>You've triggered the cinematic playback. What are you specifically observing during or immediately after the sequence finishes to confirm the fix?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Observe if the light maintains its red color and intensity as keyframed at the end of the sequence, instead of turning off.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. Directly observing the light's behavior is the primary way to confirm the fix.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Check the 'World Settings' panel for any scene-wide lighting overrides after playback.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While World Settings affect the scene, they wouldn't explain an individual light's persistence failure tied to a sequence.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Pause PIE mode immediately after the cinematic ends and inspect the light actor's properties in the Details panel.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.07hrs. While this can provide data, direct visual confirmation during live playback is more efficient for this issue.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Look for any new error messages in the Output Log that might indicate a different problem.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.03hrs. The problem is a specific state reversion, not an error. Focus on the expected outcome.</p>",
                    "next": "step-19"
                }
            ]
        },
        "step-20": {
            "skill": "complete",
            "title": "Final Verification",
            "prompt": "<p>The cinematic has successfully finished playing, and you've observed the light. What is the final step to conclude this debugging scenario?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify that the light is now red and remains on with the keyframed intensity after the sequence successfully finishes and the playback cursor stops.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. This confirms the problem is resolved and the light behaves as intended after the cinematic.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Repeat the entire debugging process from the very beginning just to be absolutely certain.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. If the problem is visually resolved, re-doing the entire process is redundant and wastes valuable time.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Assume it's fixed if no new errors appear in the log.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Visual confirmation is paramount for this type of issue; relying solely on logs is insufficient.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Check project settings once more for any default light behavior that might interfere with this fix in the future.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.08hrs. The problem was specific to Sequencer binding; broad project settings are unlikely to be relevant now.</p>",
                    "next": "step-20"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario. The cinematic spotlight now correctly persists its red color and intensity after the sequence finishes, as desired.</p>",
            "choices": [{"text": "Complete Scenario", "type": "correct", "feedback": "", "next": "end"}]
        }
    }
};
