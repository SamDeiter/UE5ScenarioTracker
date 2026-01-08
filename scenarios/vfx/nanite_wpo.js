window.SCENARIOS['nanite_wpo'] = {
    meta: {
        title: "Nanite Mesh Turns Black in Distance",
        description: "A Nanite statue using World Position Offset (WPO) turns black when viewed from a distance. This scenario walks through a realistic debugging workflow using view modes, material inspection, Nanite settings, and Lumen verification.",
        estimateHours: 5.0,
        difficulty: "Advanced",
        category: "Nanite" // rough optimal-path estimate
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'rendering',
            title: 'Spotting the Symptom',
            prompt: "<p>You are reviewing a Nanite statue in the level. Up close it looks fine, but once you move ~10 meters away, the mesh turns completely black. You know the material uses World Position Offset (WPO).</p><p>You need to gather initial evidence instead of guessing.</p><strong>What is your first move?</strong>",
            choices: [
                {
                    text: "Use Nanite visualization view modes (e.g., Triangles/Clusters) to inspect the mesh at different distances.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Good call. Nanite visualization confirms the proxy is changing at distance, and the mesh surface still exists--this looks like a shading/WPO issue, not a missing mesh.</p>",
                    next: 'step-2'
                },
                {
                    text: "Immediately tweak Skylight intensity and color to see if the black goes away.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> You burn time tweaking lighting. The statue still turns black at distance--this is not a simple exposure or light intensity issue.</p>",
                    next: 'step-1W'
                },
                {
                    text: "Swap the material to a plain unlit color test material.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> This proves the issue is related to the original material (the unlit material stays visible). Helpful, but you still lack detail on how WPO and Nanite interact.</p>",
                    next: 'step-2'
                },
                {
                    text: "Delete the statue mesh from the Content Browser and reimport it from DCC.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Dangerous):</strong> Reimport introduces inconsistencies with other levels using the same asset. The black-at-distance bug is still there, and now some maps reference the wrong mesh version.</p>",
                    next: 'step-1SC'
                }
            ]
        },

        'step-1W': {
            skill: 'rendering',
            title: 'Dead End: Lighting Tweaks Didn't Help',
            prompt: "<p>Randomly adjusting Skylight and exposure didn't resolve the artifact. The mesh still turns black beyond ~10 meters. It's clearly not just a lighting value issue.</p><strong>How do you get back on track?</strong>",
            choices: [
                {
                    text: "Reset lighting changes and inspect Nanite-specific visualization modes on the mesh.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You undo the lighting chaos and focus on Nanite, which is actually responsible for distance behavior.</p>",
                    next: 'step-2'
                },
                {
                    text: "Double down on lighting: rebuild lighting and retune all light sources in the scene.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> You waste even more time. The problem persists because the root cause is mesh/material behavior under Nanite, not light baking.</p>",
                    next: 'step-1W'
                },
                {
                    text: "Toggle post-process volumes on and off hoping the black artifact disappears.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> Post-process changes don't fix the issue and just add noise to your test conditions. You're still not addressing Nanite or WPO.</p>",
                    next: 'step-1W'
                }
            ]
        },

        'step-1SC': {
            skill: 'rendering',
            title: 'Dead End: Asset Deletion Fallout',
            prompt: "<p>By deleting and reimporting the mesh, you've created mismatches and potential redirects in other maps. The artifact still occurs because the underlying Nanite/WPO problem wasn't addressed.</p><strong>How do you recover cleanly?</strong>",
            choices: [
                {
                    text: "Use Source Control to revert the mesh asset to the last known good revision, then refocus on debugging within the engine (view modes and material checks).",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Good recovery. The project is back to a stable state, and you can now concentrate on the actual shading/Nanite interaction.</p>",
                    next: 'step-2'
                },
                {
                    text: "Leave the new mesh in place and manually fix all broken references across the project.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> This is tedious and risky. You still haven't fixed the core bug, and you've massively inflated the scope of the task.</p>",
                    next: 'step-1SC'
                },
                {
                    text: "Accept the broken references as 'good enough for now' and proceed with debugging on top of this unstable state.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Unstable Baseline):</strong> Debugging on a corrupted project state makes every future problem harder to reason about.</p>",
                    next: 'step-1SC'
                }
            ]
        },

        'step-2': {
            skill: 'rendering',
            title: 'Comparing Near vs Far Behavior',
            prompt: "<p>Nanite visualization shows the mesh clusters are present at all distances. The black artifact only appears when the Nanite proxy representation kicks in. This strongly suggests a mismatch between the material's WPO and Nanite's evaluation.</p><strong>What do you inspect next to confirm WPO involvement?</strong>",
            choices: [
                {
                    text: "Open the material used on the statue and inspect the World Position Offset graph and any static switches or per-platform conditionals.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You confirm the material uses a non-trivial WPO setup (e.g., vertex animation or noise) that's always enabled on this mesh.</p>",
                    next: 'step-3'
                },
                {
                    text: "Change the mesh mobility from Static to Movable to see if that fixes the black artifact.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> Mobility changes don't fix the issue and may impact performance and lighting behavior. The mesh still turns black at distance.</p>",
                    next: 'step-2W'
                },
                {
                    text: "Disable all post-process effects in the level (Bloom, AO, Tonemapper).",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> The statue remains black at distance. This clearly isn't a post-process artifact.</p>",
                    next: 'step-2W'
                },
                {
                    text: "Convert the mesh to non-Nanite and see if the artifact remains, then switch it back.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> You notice that with Nanite disabled the mesh no longer turns black, which further proves this is a Nanite+WPO interaction. However, flipping modes repeatedly isn't a long-term solution.</p>",
                    next: 'step-3'
                }
            ]
        },

        'step-2W': {
            skill: 'rendering',
            title: 'Dead End: Chasing the Wrong System',
            prompt: "<p>Post-process and mobility changes didn't resolve the issue. The black artifact clearly tracks with Nanite distance behavior, not with post-processing or mobility settings.</p><strong>How do you refocus?</strong>",
            choices: [
                {
                    text: "Stop tweaking mobility/post-processing and inspect the material's WPO logic and flags.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You finally zero in on the material's WPO behavior, which is where the real problem lies.</p>",
                    next: 'step-3'
                },
                {
                    text: "Rebuild lighting again and hope something changes this time.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Rebuilding lighting repeatedly without changing the root cause is just burning build time.</p>",
                    next: 'step-2W'
                },
                {
                    text: "Temporarily disable the mesh's visibility so you don't have to see the bug.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> Hiding the problem doesn't solve it; it just delays real debugging work.</p>",
                    next: 'step-2W'
                }
            ]
        },

        'step-3': {
            skill: 'rendering',
            title: 'Material and Usage Flags',
            prompt: "<p>Inside the material, you confirm WPO is active and significantly displacing vertices. To make sure the engine treats this correctly, you should verify the material's usage flags and compatibility with the mesh.</p><strong>What do you do?</strong>",
            choices: [
                {
                    text: "Check the Material Usage flags and ensure 'Used with Nanite' and 'Uses World Position Offset' are correctly enabled when needed.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You confirm the material is marked appropriately. The issue likely isn't a simple usage flag problem but how Nanite evaluates WPO for its proxy representation.</p>",
                    next: 'step-4'
                },
                {
                    text: "Bypass WPO entirely by hardwiring the WPO output to zero for this material and ship it like that.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> The artifact goes away, but you lose the intended deformation/animation. This is a functional regression, not a proper fix.</p>",
                    next: 'step-4'
                },
                {
                    text: "Enable tessellation and try to use tessellation multiplier to compensate for Nanite simplification.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> Nanite doesn't use traditional tessellation. You add complexity and shader cost without solving the issue.</p>",
                    next: 'step-3W'
                },
                {
                    text: "Randomly delete nodes in the WPO graph until the artifact disappears.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Dangerous):</strong> You break the artistic intent and potentially other assets sharing this material. The artifact may vanish, but so does your intended behavior.</p>",
                    next: 'step-3SC'
                }
            ]
        },

        'step-3W': {
            skill: 'rendering',
            title: 'Dead End: Misusing Tessellation with Nanite',
            prompt: "<p>Enabling tessellation doesn't help because Nanite doesn't rely on classic tessellation pipelines. You added cost without value.</p><strong>What's the productive next step?</strong>",
            choices: [
                {
                    text: "Disable unnecessary tessellation and focus on how Nanite evaluates WPO in the Static Mesh Editor.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You clean up the material and shift focus to where Nanite actually controls WPO evaluation.</p>",
                    next: 'step-4'
                },
                {
                    text: "Push tessellation even higher to 'force more detail'.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> You just burn more performance budget for no benefit in Nanite.</p>",
                    next: 'step-3W'
                },
                {
                    text: "Disable Nanite on this mesh and rely exclusively on tessellation.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> You technically can do this, but you're throwing away the main benefit of Nanite instead of using it correctly.</p>",
                    next: 'step-3W'
                }
            ]
        },

        'step-3SC': {
            skill: 'rendering',
            title: 'Dead End: Broken Material Graph',
            prompt: "<p>Your material graph is now a mess, and other meshes using this material are visually broken. You've clearly gone too far.</p><strong>How do you recover?</strong>",
            choices: [
                {
                    text: "Use Source Control to revert the material to the last good revision, then look for a Nanite-specific way to handle WPO.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You restore the intended WPO behavior and avoid project-wide regressions. Time to fix this at the mesh/Nanite level.</p>",
                    next: 'step-4'
                },
                {
                    text: "Try to manually rebuild the material graph from memory without using Source Control.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> You might eventually get close, but this is slow, error-prone, and unnecessary when you have version history.</p>",
                    next: 'step-3SC'
                },
                {
                    text: "Duplicate the broken material and keep both in the project, hoping one of them works.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Now you have multiple broken variants and even more confusion for the team.</p>",
                    next: 'step-3SC'
                }
            ]
        },

        'step-4': {
            skill: 'rendering',
            title: 'Static Mesh Editor & Nanite Settings',
            prompt: "<p>The material is correctly using WPO and is compatible with Nanite. The artifact appears when Nanite proxy LODs are used, so the next logical place to look is the mesh's Nanite configuration.</p><strong>What do you open and inspect?</strong>",
            choices: [
                {
                    text: "Open the Static Mesh Editor for the statue mesh and inspect the Nanite section, including World Position Offset related options.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Right move. In the Nanite section you see controls for how WPO is evaluated for the Nanite representation.</p>",
                    next: 'step-5'
                },
                {
                    text: "Open Project Settings and start flipping random Rendering and Lumen-related flags.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Changing global settings introduces risk to the entire project while doing little to resolve a single-mesh issue.</p>",
                    next: 'step-4W'
                },
                {
                    text: "Create a duplicate level and re-place all actors by hand to see if it still happens.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> The issue reproduces because it's tied to the mesh/material, not the level. You've wasted a lot of time rearranging content.</p>",
                    next: 'step-4W'
                },
                {
                    text: "Disable Nanite completely at the project level.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged (Nuclear Hack):</strong> The artifact disappears but at the cost of losing Nanite benefits across the entire project. This is not acceptable for a real production.</p>",
                    next: 'step-5'
                }
            ]
        },

        'step-4W': {
            skill: 'rendering',
            title: 'Dead End: Over-Scoping the Problem',
            prompt: "<p>You've spent time changing level or project-wide settings that don't address the specific Nanite+WPO interaction on this mesh. The bug persists.</p><strong>How do you narrow your focus?</strong>",
            choices: [
                {
                    text: "Stop changing project/level settings and open the Static Mesh Editor to inspect Nanite settings for this specific mesh.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You correctly limit the blast radius and focus on the mesh-level Nanite configuration.</p>",
                    next: 'step-5'
                },
                {
                    text: "Keep flipping random project settings; eventually something might work.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> This is the definition of cargo-cult debugging and quickly becomes unmanageable.</p>",
                    next: 'step-4W'
                },
                {
                    text: "Disable the level from all builds so nobody ever hits this bug.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> You're hiding the problem instead of fixing it, and you block real content from shipping.</p>",
                    next: 'step-4W'
                }
            ]
        },

        'step-5': {
            skill: 'rendering',
            title: 'Configuring Nanite WPO Evaluation',
            prompt: "<p>In the Static Mesh Editor, you locate the Nanite settings for this mesh. There is a section related to World Position Offset evaluation for Nanite's internal representation.</p><strong>Which setting should you adjust to make Nanite respect WPO?</strong>",
            choices: [
                {
                    text: "Set Nanite Settings &gt; World Position Offset &gt; WPO Evaluation Mode to Enabled or Auto.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> This instructs Nanite to evaluate WPO when generating and rendering its proxy representation. The mesh now maintains its WPO-driven shape at distance instead of turning black.</p>",
                    next: 'step-6'
                },
                {
                    text: "Adjust LOD Settings &gt; Percent Triangles for the mesh.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Nanite does not use classic triangle percentage LODs in the same way. This has no meaningful impact on the black-at-distance artifact.</p>",
                    next: 'step-5W'
                },
                {
                    text: "Reduce the overall Nanite fallback radius so the mesh switches to a non-Nanite fallback sooner.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> You're working around the symptom by changing when the fallback happens instead of fixing how Nanite handles WPO directly.</p>",
                    next: 'step-5W'
                },
                {
                    text: "Disable WPO Evaluation Mode completely to simplify things.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Regression):</strong> This reinforces the problem--Nanite continues to ignore WPO on the proxy, and the artifact persists.</p>",
                    next: 'step-5W'
                }
            ]
        },

        'step-5W': {
            skill: 'rendering',
            title: 'Dead End: Misconfigured Nanite Settings',
            prompt: "<p>Your changes to Nanite triangle percentages or fallback behavior didn't resolve the core issue. The black artifact still appears when the Nanite proxy is used, because WPO is still not evaluated correctly.</p><strong>What's the proper fix?</strong>",
            choices: [
                {
                    text: "Enable or set Nanite WPO Evaluation Mode to Auto/Enabled so Nanite actually evaluates WPO when rendering the mesh.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> With WPO Evaluation Mode properly configured, the Nanite mesh respects WPO at all distances and no longer turns black.</p>",
                    next: 'step-6'
                },
                {
                    text: "Keep tweaking fallback distances and triangle percentages in small increments.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> You're micro-tuning knobs that aren't addressing the root cause.</p>",
                    next: 'step-5W'
                },
                {
                    text: "Disable Nanite for the entire project to avoid this category of problem forever.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> You sacrifice core engine features instead of configuring them correctly.</p>",
                    next: 'step-5W'
                }
            ]
        },

        'step-6': {
            skill: 'rendering',
            title: 'In-Game Verification',
            prompt: "<p>With Nanite WPO evaluation properly configured, the statue appears correct in the editor at multiple distances. Now you need to validate behavior in an actual play scenario.</p><strong>How do you verify the fix?</strong>",
            choices: [
                {
                    text: "Enter Play-In-Editor (PIE) or Simulate, move around the statue at different distances, and monitor the mesh's appearance and performance stats.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> In PIE, the statue remains correctly shaded at all tested distances. No black transitions are observed.</p>",
                    next: 'step-7'
                },
                {
                    text: "Assume the fix works because it looks good in the viewport and immediately mark the task as done.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Risky Assumption):</strong> Skipping validation can let regressions slip into builds, especially in packaged or different platform configurations.</p>",
                    next: 'step-6W'
                },
                {
                    text: "Disable real-time rendering in the viewport and call it 'verified' because it looks fine in a single frame.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> This doesn't count as verification. You're not testing dynamic behavior or streaming changes at all.</p>",
                    next: 'step-6W'
                },
                {
                    text: "Only test in a tiny corner of the level where the bug never really showed up.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> You get some signal, but you're not stress-testing the original failure conditions.</p>",
                    next: 'step-7'
                }
            ]
        },

        'step-6W': {
            skill: 'rendering',
            title: 'Dead End: Incomplete Verification',
            prompt: "<p>Your \"verification\" was superficial. Without testing in PIE or simulate, you can't be confident this behaves correctly in actual gameplay conditions.</p><strong>What should you do to properly validate?</strong>",
            choices: [
                {
                    text: "Run the level in PIE/Simulate, move around the scene, and observe the statue's shading at varying distances.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Proper testing confirms the fix in gameplay conditions.</p>",
                    next: 'step-7'
                },
                {
                    text: "Wait for QA to report if it's still broken instead of testing yourself.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> You're offloading basic verification onto QA, slowing the feedback loop.</p>",
                    next: 'step-6W'
                },
                {
                    text: "Package a build without testing and hope for the best.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> This is how obvious bugs slip into milestone builds.</p>",
                    next: 'step-6W'
                }
            ]
        },

        'step-7': {
            skill: 'rendering',
            title: 'Checking Interaction with Lumen',
            prompt: "<p>The statue now renders correctly with Nanite and WPO at all distances. Next, you want to ensure it behaves correctly with Lumen Global Illumination and contributes to scene lighting as intended.</p><strong>What component setting should you inspect?</strong>",
            choices: [
                {
                    text: "On the mesh component, verify that 'Rendering &gt; Support Global Illumination' is enabled (where applicable).",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> This ensures the Nanite mesh can contribute to Lumen GI, maintaining correct bounced lighting behavior.</p>",
                    next: 'step-8'
                },
                {
                    text: "Focus only on 'Cast Static Shadow' and rebuild static lighting.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> For a Lumen-based dynamic GI setup, static shadow settings are not the primary concern. You may be optimizing the wrong system.</p>",
                    next: 'step-7W'
                },
                {
                    text: "Turn off all GI to guarantee the bug never appears again.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Overkill):</strong> Disabling GI might hide some artifacts but destroys the visual quality target of the project.</p>",
                    next: 'step-7W'
                },
                {
                    text: "Crank up emissive on the material to fake lighting instead of using proper GI.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> It can visually work in some shots but fights the intended lighting pipeline and can cause odd exposure issues.</p>",
                    next: 'step-8'
                }
            ]
        },

        'step-7W': {
            skill: 'rendering',
            title: 'Dead End: Misfocused Lighting Settings',
            prompt: "<p>Your effort is going into static/shadow-only settings or disabling GI entirely, which isn't aligned with how Lumen and Nanite are supposed to work together.</p><strong>How do you correct course?</strong>",
            choices: [
                {
                    text: "Re-enable appropriate GI settings and ensure 'Support Global Illumination' is correctly set on the Nanite mesh component.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You align your configuration with Lumen's expected workflow while retaining correct Nanite rendering.</p>",
                    next: 'step-8'
                },
                {
                    text: "Ignore Lumen entirely and assume lighting is 'good enough'.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> You're leaving potential lighting bugs undiscovered, especially in darker or indirect-lit areas.</p>",
                    next: 'step-7W'
                },
                {
                    text: "Lower overall scene exposure to hide any subtle issues.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> You're treating the symptom visually instead of addressing correct GI participation.</p>",
                    next: 'step-7W'
                }
            ]
        },

        'step-8': {
            skill: 'rendering',
            title: 'Cross-Asset Regression Check',
            prompt: "<p>The statue now looks correct at all distances, and it contributes properly to Lumen GI. Before you call it done, you want to ensure this fix doesn't break anything else.</p><strong>What's a sensible regression check?</strong>",
            choices: [
                {
                    text: "Identify other meshes using the same material or similar Nanite WPO configuration and test them in representative levels.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Those meshes also render correctly, confirming the fix is robust across assets using similar setups.</p>",
                    next: 'step-9'
                },
                {
                    text: "Assume no other assets are affected and skip regression testing.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Future Risk):</strong> You save time now but risk future bug reports from other levels using the same material/mesh patterns.</p>",
                    next: 'step-9'
                },
                {
                    text: "Mass-apply random Nanite setting changes to all meshes in the project so they 'match'.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (High Risk):</strong> This can introduce a wave of new issues and performance regressions project-wide.</p>",
                    next: 'step-8SC'
                },
                {
                    text: "Only test the statue in an empty test map and ignore real production levels.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Good for isolation, but you might miss interactions specific to production content.</p>",
                    next: 'step-9'
                }
            ]
        },

        'step-8SC': {
            skill: 'rendering',
            title: 'Dead End: Global Setting Chaos',
            prompt: "<p>Global random Nanite changes have destabilized the project. You're now seeing unexpected behavior on unrelated meshes and levels.</p><strong>How do you undo the damage?</strong>",
            choices: [
                {
                    text: "Use Source Control to revert the wide Nanite setting changes, then limit your testing to a focused set of related assets.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> The project is restored. You retain the targeted fix for the statue and avoid collateral damage.</p>",
                    next: 'step-9'
                },
                {
                    text: "Try to manually remember and revert the dozens of changes you made without using Source Control.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> This is slow and error-prone; you'll likely miss something.</p>",
                    next: 'step-8SC'
                },
                {
                    text: "Accept the new broken behavior as the 'new normal' and move on.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> You're normalizing a mess instead of using your tools to restore a known-good state.</p>",
                    next: 'step-8SC'
                }
            ]
        },

        'step-9': {
            skill: 'rendering',
            title: 'Documenting the Root Cause',
            prompt: "<p>You've identified the root cause: Nanite was not properly evaluating World Position Offset for the mesh, causing a black-at-distance artifact. Configuring WPO Evaluation Mode in the Static Mesh's Nanite settings resolved the problem.</p><strong>How do you capture this learning for the team?</strong>",
            choices: [
                {
                    text: "Document the bug, root cause, and fix (including screenshots of Nanite WPO settings) in your team's knowledge base or issue tracker.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Future artists and tech artists can quickly recognize and fix similar issues, saving the team significant time.</p>",
                    next: 'step-10'
                },
                {
                    text: "Keep the knowledge in your head and move on to the next task.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Team Cost):</strong> You'll solve it again in the future, but others won't benefit from your work. This doesn't scale in a production environment.</p>",
                    next: 'step-10'
                },
                {
                    text: "Just ping a teammate in chat with a quick summary and no persistent record.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Your teammate now knows about it, but this knowledge is still ephemeral. Better than nothing, but still not ideal for long-term team memory.</p>",
                    next: 'step-10'
                },
                {
                    text: "Close the ticket with a vague note like 'engine bug fixed' and no details about what actually changed.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Poor Practice):</strong> QA and future developers have no idea what happened. When a related issue appears later, they'll have to start from zero again.</p>",
                    next: 'step-9W'
                }
            ]
        },

        'step-9W': {
            skill: 'rendering',
            title: 'Dead End: Useless Ticket History',
            prompt: "<p>Your vague ticket history is effectively useless. QA and future devs can't tell what changed, why, or how to re-apply the fix if it regresses. This is exactly how teams lose time and trust in their tracking system.</p><strong>How do you fix your documentation approach?</strong>",
            choices: [
                {
                    text: "Reopen or update the ticket with a clear description, root cause explanation, and the specific Nanite WPO setting changes you made.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Now the ticket actually tells the story of the bug and fix. This is useful historical data for the entire team.</p>",
                    next: 'step-10'
                },
                {
                    text: "Leave the vague ticket as-is and hope nobody ever needs it.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> You're setting up future teammates (and your future self) for frustration.</p>",
                    next: 'step-9W'
                },
                {
                    text: "Create a new duplicate ticket with slightly different wording instead of fixing the original.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Now your tracking system has noise and conflicting information.</p>",
                    next: 'step-9W'
                }
            ]
        },

        'step-10': {
            skill: 'rendering',
            title: 'Final Verification & Handoff',
            prompt: "<p>All affected meshes behave correctly, performance is stable, and your fix is documented. The QA team will run their own passes.</p><strong>What's your last action in this debugging workflow?</strong>",
            choices: [
                {
                    text: "Create a small test map or level viewport bookmark that reproduces the original bug scenario and clearly shows the fixed behavior for QA and future debugging.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You provide a reproducible test case that validates both the original bug and the fix, making future regression testing straightforward.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Delete all test assets and levels so the project stays 'clean'.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Lost Evidence):</strong> You remove valuable test cases that could have helped catch regressions later. QA now has to reconstruct the scenario from scratch.</p>",
                    next: 'step-10W'
                },
                {
                    text: "Rely on QA to 'figure it out' without giving them any tailored test level or clear reproduction steps.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Shifts Burden):</strong> QA will eventually verify it, but you're pushing avoidable work onto them and increasing the chance of misunderstandings.</p>",
                    next: 'step-10W'
                },
                {
                    text: "Add a short section to your existing regression test map instead of a dedicated new level, then note that in the ticket.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> This works and keeps things organized, but may be less discoverable than a dedicated focused test map. Still a reasonable, pragmatic choice.</p>",
                    next: 'conclusion'
                }
            ]
        },

        'step-10W': {
            skill: 'rendering',
            title: 'Dead End: Weak Handoff to QA',
            prompt: "<p>By deleting test assets or failing to provide a clear reproduction setup, you've made life harder for QA and anyone who needs to verify this fix later. The fix might be correct, but the pipeline around it is brittle.</p><strong>How do you improve the handoff?</strong>",
            choices: [
                {
                    text: "Restore or recreate a focused test scenario (small test map or clear bookmark) and link it in the ticket so QA and future devs can easily verify the behavior.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> With a proper test scenario in place, the fix is both verifiable and maintainable. This is how a solid debugging workflow ends.</p>",
                    next: 'conclusion'
                },
                {
                    text: "Ask QA to create the test map for you instead of doing it yourself.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> They can help, but you're closer to the bug details and best placed to set up the scenario.</p>",
                    next: 'step-10W'
                },
                {
                    text: "Do nothing further; hope the existing levels are 'good enough' for regression testing.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> You're banking on luck instead of providing a clear verification path.</p>",
                    next: 'step-10W'
                }
            ]
        },

        'conclusion': {
            skill: 'rendering',
            title: 'Conclusion: Nanite + WPO Debugging Complete',
            prompt: "<p>You successfully debugged a Nanite statue that turned black at distance by:</p><ul><li>Using Nanite view modes to confirm it was a Nanite-specific issue.</li><li>Inspecting the material to verify WPO usage.</li><li>Confirming material usage flags were correct.</li><li>Configuring Nanite WPO Evaluation Mode in the Static Mesh Editor so Nanite respects WPO for its proxy representation.</li><li>Verifying behavior in PIE and with Lumen GI.</li><li>Performing targeted regression testing and documenting the fix.</li><li>Providing a clear test scenario and good ticket history for future verification.</li></ul><p>This workflow mirrors a realistic production debugging process: observe, investigate, hypothesize, apply a targeted fix, verify, and then document.</p><strong>Scenario complete.</strong>",
            choices: []
        }
    }
};
