window.SCENARIOS['PitchBlackIndoorGI'] = {
    meta: {
        title: "Pitch Black Indoor GI (Lumen)",
        description: "Interior spaces remain pitch black despite bright exterior lighting. Investigates Lumen GI settings, geometry thickness, mesh distance fields, and proper verification workflow.",
        estimateHours: 3.0,
        difficulty: "Intermediate"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'lighting',
            title: 'Step 1: The Symptom',
            prompt: "<p><strong>The Art Lead approaches your desk:</strong> \"Hey, I just placed our new interior level and it looks terrible. The room has these big windows with bright sunlight outside, but everything inside between the direct light patches is pitch black. There's no bounce light at all--it looks completely unrealistic.\"</p><p>You load up the level and confirm the issue. The exterior is beautifully lit, but the interior looks like a cave.</p><strong>What's your first debugging step?</strong>",
            choices: [
                {
                    text: "Action: Switch to <strong>Lumen Scene View</strong> and <strong>Lighting Only</strong> view modes to inspect GI contribution.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> In Lumen Scene View, you notice the room barely shows any indirect contribution. The visualization confirms that Lumen isn't calculating bounce light for this interior space.</p>",
                    next: 'step-2'
                },
                {
                    text: "Action: Immediately crank up the Directional Light intensity and Skylight brightness.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Direct light gets brighter, but the corners of the room still sit in pure black. There's still no realistic bounce or fill. This isn't just a brightness issue.</p>",
                    next: 'step-1W'
                },
                {
                    text: "Action: Check the <strong>Post Process Volume</strong> exposure settings.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Adjusting exposure helps you see more detail, but it doesn't create bounce light where there is none. The underlying GI problem remains.</p>",
                    next: 'step-2'
                },
                {
                    text: "Action: Add fill lights manually throughout the room to fake ambient lighting.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> This creates a messy, inconsistent result that doesn't respond to time-of-day changes. You're treating the symptom, not the cause.</p>",
                    next: 'step-1M'
                }
            ]
        },

        'step-1W': {
            skill: 'lighting',
            title: 'Dead End: Brightness Tweaks',
            prompt: "<p><strong>After 20 minutes of tweaking:</strong> You've cranked up light intensity and even adjusted the exposure, but the Art Lead comes back: \"It's still pitch black in the corners. I don't think this is a brightness issue.\"</p><p>They're right--the problem clearly isn't about light strength.</p><strong>What should you do now?</strong>",
            choices: [
                {
                    text: "Action: Revert the extreme intensity changes and investigate the GI system itself.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You roll back the tweaks and refocus on whether Lumen is properly enabled and configured.</p>",
                    next: 'step-2'
                },
                {
                    text: "Action: Keep increasing brightness until something works.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Now your exterior is blown out and the interior is still dark. You're making things worse.</p>",
                    next: 'step-1W'
                }
            ]
        },

        'step-1M': {
            skill: 'lighting',
            title: 'Dead End: Manual Fill Lights',
            prompt: "<p><strong>The Tech Lead walks by and notices your work:</strong> \"Why are you manually placing all these fill lights? That's not going to scale, and it won't respond to time-of-day changes. What's the actual problem here?\"</p><p>They're right--you're treating symptoms, not the cause.</p><strong>How do you get back on track?</strong>",
            choices: [
                {
                    text: "Action: Remove the fill lights and investigate why Lumen GI isn't working.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You clean up the fake lights and focus on the real problem: the GI system configuration.</p>",
                    next: 'step-2'
                }
            ]
        },

        'step-2': {
            skill: 'lighting',
            title: 'Step 2: Checking Project Settings',
            prompt: "<p><strong>You ask the Tech Lead for guidance:</strong> \"Where should I start looking for GI issues?\"</p><p>They respond: \"Check Project Settings > Rendering. Make sure Lumen is actually enabled for this project.\"</p><p>You open the settings and investigate.</p><strong>What do you find?</strong>",
            choices: [
                {
                    text: "Action: Check the <strong>Dynamic Global Illumination Method</strong> setting.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You discover it's set to <strong>None</strong> or <strong>Screen Space</strong> instead of <strong>Lumen</strong>. This explains why there's no bounce light--Lumen GI is disabled!</p>",
                    next: 'step-3'
                },
                {
                    text: "Action: Look for lightmap resolution settings.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Lightmaps are for baked lighting, not Lumen. You're looking in the wrong system entirely.</p>",
                    next: 'step-2W'
                },
                {
                    text: "Action: Check the <strong>Reflection Method</strong> setting.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Reflections are important, but the main issue is the GI method. You're close but need to check the GI setting specifically.</p>",
                    next: 'step-3'
                }
            ]
        },

        'step-2W': {
            skill: 'lighting',
            title: 'Dead End: Wrong Lighting System',
            prompt: "<p>You're investigating baked lighting settings, but this project needs dynamic GI. Lightmaps won't help here.</p><strong>What should you check instead?</strong>",
            choices: [
                {
                    text: "Action: Check the <strong>Dynamic Global Illumination Method</strong> in Project Settings.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Now you're looking at the right setting for real-time GI.</p>",
                    next: 'step-3'
                }
            ]
        },

        'step-3': {
            skill: 'lighting',
            title: 'Step 3: Enabling Lumen GI',
            prompt: "<p>You've confirmed that Lumen is disabled. You need to enable it and restart the editor for the change to take effect.</p><strong>What's the correct approach?</strong>",
            choices: [
                {
                    text: "Action: Set <strong>Dynamic Global Illumination Method</strong> to <strong>Lumen</strong>, save, and restart the editor.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> After restart, Lumen is active. You reload the level and notice some improvement, but the room is still darker than expected.</p>",
                    next: 'step-4'
                },
                {
                    text: "Action: Enable Lumen but don't restart the editor.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> The setting requires an editor restart to take effect. Nothing changes until you restart.</p>",
                    next: 'step-3W'
                }
            ]
        },

        'step-3W': {
            skill: 'lighting',
            title: 'Dead End: No Restart',
            prompt: "<p>You enabled Lumen but didn't restart. The change hasn't taken effect yet.</p><strong>What do you need to do?</strong>",
            choices: [
                {
                    text: "Action: Restart the editor to apply the Lumen GI setting.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> After restart, Lumen is now active.</p>",
                    next: 'step-4'
                }
            ]
        },

        'step-4': {
            skill: 'lighting',
            title: 'Step 4: Geometry Investigation',
            prompt: "<p><strong>After the editor restart:</strong> You show the Art Lead the updated scene. \"It's better, but still way too dark. Are you sure Lumen is working properly?\"</p><p>You see <em>some</em> bounce light now, but it's still very weak and inconsistent. You suspect there might be a geometry issue.</p><strong>What do you investigate?</strong>",
            choices: [
                {
                    text: "Action: Check if the walls are <strong>single-sided planes</strong> or <strong>thick solid meshes</strong>.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> The room is built from thin, single-sided planes! Lumen needs thick geometry to properly trace and contain light. This explains the weak GI.</p>",
                    next: 'step-5'
                },
                {
                    text: "Action: Increase the <strong>Lumen Scene Detail</strong> quality setting to maximum.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Higher quality helps a bit, but doesn't fix the fundamental geometry problem. Thin walls are still causing light leakage.</p>",
                    next: 'step-5'
                },
                {
                    text: "Action: Add more skylights inside the room.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> More lights don't fix the geometry issue. You're still treating symptoms.</p>",
                    next: 'step-4M'
                }
            ]
        },

        'step-4M': {
            skill: 'lighting',
            title: 'Dead End: More Lights',
            prompt: "<p>Adding more lights creates an unnatural, over-lit look and doesn't solve the core geometry problem.</p><strong>What should you investigate instead?</strong>",
            choices: [
                {
                    text: "Action: Check the room's geometry thickness and mesh construction.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You focus on the actual problem: the geometry.</p>",
                    next: 'step-5'
                }
            ]
        },

        'step-5': {
            skill: 'lighting',
            title: 'Step 5: Fixing Geometry',
            prompt: "<p><strong>You call over the Environment Artist:</strong> \"How did you build this room?\"</p><p>They explain: \"Oh, I just used single planes for the walls to save on tri count. Is that a problem?\"</p><p>You explain that Lumen needs thick geometry to properly trace light. They understand and offer to help rebuild it.</p><strong>What's the fix?</strong>",
            choices: [
                {
                    text: "Action: Replace the thin planes with <strong>thick box meshes</strong> or <strong>solid wall assets</strong> that have proper volume.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You rebuild the room with thick walls (10-20cm minimum). Lumen can now properly trace light bounces and contain them within the room.</p>",
                    next: 'step-6'
                },
                {
                    text: "Action: Just make the planes double-sided in the material.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Double-sided rendering doesn't give the geometry actual thickness. Lumen still can't trace properly through zero-thickness geometry.</p>",
                    next: 'step-5W'
                }
            ]
        },

        'step-5W': {
            skill: 'lighting',
            title: 'Dead End: Double-Sided Material',
            prompt: "<p>Making the material double-sided doesn't add physical thickness to the geometry. Lumen still struggles.</p><strong>What's the real solution?</strong>",
            choices: [
                {
                    text: "Action: Replace the planes with actual thick geometry (boxes or solid meshes).",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Now you're addressing the actual geometry problem.</p>",
                    next: 'step-6'
                }
            ]
        },

        'step-6': {
            skill: 'lighting',
            title: 'Step 6: Mesh Distance Fields',
            prompt: "<p><strong>The Environment Artist finishes rebuilding the walls:</strong> \"Okay, I replaced everything with proper thick meshes. How does it look now?\"</p><p>The GI is much better, but you notice some furniture meshes in the room still appear oddly dark. You switch to <strong>Mesh Distance Fields</strong> visualization to investigate.</p><strong>What do you find?</strong>",
            choices: [
                {
                    text: "Action: Check if the problematic meshes have <strong>Generate Mesh Distance Fields</strong> enabled.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Some meshes have this disabled! Lumen uses distance fields for GI calculations. You enable it on the affected meshes and rebuild lighting data.</p>",
                    next: 'step-7'
                },
                {
                    text: "Action: Assume it's a material issue and start tweaking roughness values.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> Material properties affect appearance but won't fix missing distance field data for Lumen.</p>",
                    next: 'step-6M'
                }
            ]
        },

        'step-6M': {
            skill: 'lighting',
            title: 'Dead End: Material Tweaking',
            prompt: "<p>Adjusting materials didn't fix the dark meshes. The problem is at the mesh level, not the material level.</p><strong>What should you check?</strong>",
            choices: [
                {
                    text: "Action: Check the mesh distance field settings.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You investigate the mesh-level settings for Lumen.</p>",
                    next: 'step-7'
                }
            ]
        },

        'step-7': {
            skill: 'lighting',
            title: 'Step 7: Initial Verification',
            prompt: "<p><strong>You've made all the fixes:</strong> Lumen enabled, thick geometry, distance fields generated. Time to show the Art Lead.</p><p>\"Let me see it in action,\" they say.</p><strong>How do you demonstrate that it's working?</strong>",
            choices: [
                {
                    text: "Action: Play in Editor and observe the room in <strong>Lighting Only</strong> mode.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> In PIE, you now see soft bounce light filling the room. Corners are no longer pitch black, and light from windows bleeds naturally into the interior. Much better!</p>",
                    next: 'step-8'
                },
                {
                    text: "Action: Just look at it in the editor viewport and call it done.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> The viewport can be misleading. Always verify in PIE for accurate lighting behavior.</p>",
                    next: 'step-8'
                }
            ]
        },

        'step-8': {
            skill: 'lighting',
            title: 'Step 8: Dynamic Testing',
            prompt: "<p><strong>The Art Lead is impressed:</strong> \"Wow, that looks so much better! But wait--will this update properly when we change the time of day? We need dynamic lighting for our day/night cycle.\"</p><p>Good question. You need to verify Lumen's dynamic behavior.</p><strong>What test should you perform?</strong>",
            choices: [
                {
                    text: "Action: Change the <strong>Directional Light rotation</strong> (time of day) and verify GI updates in real-time.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> As you rotate the sun, the bounce light in the room updates smoothly and realistically. Lumen is working correctly!</p>",
                    next: 'step-9'
                },
                {
                    text: "Action: Skip dynamic testing and move on.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Without testing dynamic behavior, you might miss issues that only appear when lighting changes.</p>",
                    next: 'step-8W'
                }
            ]
        },

        'step-8W': {
            skill: 'lighting',
            title: 'Dead End: Incomplete Testing',
            prompt: "<p>You skipped dynamic testing, but later discover the GI doesn't update properly when lights move. You should have tested this earlier.</p><strong>What should you do?</strong>",
            choices: [
                {
                    text: "Action: Go back and test dynamic light changes.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You perform the dynamic test and verify everything works.</p>",
                    next: 'step-9'
                }
            ]
        },

        'step-9': {
            skill: 'lighting',
            title: 'Step 9: Performance Check',
            prompt: "<p><strong>The Tech Lead stops by to review your work:</strong> \"Looks great visually, but what's the performance cost? We need to ship on console too.\"</p><p>Good point--you should verify the performance impact.</p><strong>What should you check?</strong>",
            choices: [
                {
                    text: "Action: Open <strong>stat unit</strong> and <strong>stat Lumen</strong> to check performance impact.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Performance is acceptable. If needed, you could adjust Lumen quality settings, but for now it's within budget.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Action: Assume performance is fine without checking.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Always verify performance, especially with Lumen. You check and confirm it's acceptable.</p>",
                    next: 'conclusion'
                }
            ]
        },

        'conclusion': {
            skill: 'lighting',
            title: 'Conclusion',
            prompt: "<p><strong>Lesson Learned:</strong> If an interior is pitch black with no bounce light:</p><ul><li>First, ensure <strong>Lumen is enabled</strong> as the Dynamic Global Illumination method in Project Settings (requires editor restart).</li><li>Second, verify the room is built with <strong>thick, solid geometry</strong> (not thin planes) so Lumen can properly trace and contain light.</li><li>Third, ensure meshes have <strong>Generate Mesh Distance Fields</strong> enabled.</li><li>Finally, always test <strong>dynamic lighting changes</strong> and check <strong>performance</strong> before considering the fix complete.</li></ul>",
            choices: []
        }
    }
};