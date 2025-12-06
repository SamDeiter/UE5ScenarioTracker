window.SCENARIOS['MismatchedSkeletonReference'] = {
    "meta": {
        "title": "Silent Anim Notify Failure Due to Orphaned Skeleton Asset Reference",
        "description": "The player character's attack animations play correctly in the level viewport, but the associated particle effects and sound effects (triggered by Anim Notifies) never execute in PIE (Play In Editor). However, when opening the attack animation asset directly and viewing it in the Animation Editor viewport, the Anim Notifies fire perfectly, generating the expected effects. This indicates the notify logic is sound, but its execution is blocked in the game environment, possibly due to a reference mismatch following a recent asset migration.",
        "estimateHours": 3,
        "category": "Asset Management"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "general",
            "title": "Initial Assessment",
            "prompt": "<p>The player character's attack animations play correctly in the level viewport, but the associated particle effects and sound effects (triggered by Anim Notifies) never execute in PIE. When opening the animation asset directly, Anim Notifies fire perfectly. This suggests a runtime execution block rather than a notify logic issue.</p><p><strong>What is your first diagnostic step?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the specific animation sequence (e.g., 'Anim_Attack_01') to verify Anim Notifies are correctly placed on the timeline and linked.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.2hrs. Verifying the Anim Notifies in the sequence is a good first step to rule out basic setup errors.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Check Project Settings for global sound or FX volume overrides, assuming the issue is environmental.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.3hrs. While a plausible global issue, the Anim Notifies firing in the Animation Editor viewport suggests the problem is specific to runtime character execution, not global suppression. This leads you away from the actual problem.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Restart Unreal Engine and your computer, assuming a temporary editor glitch.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.3hrs. Restarting might fix transient issues, but usually not persistent asset reference problems. This is a low-effort guess without real diagnostic value here.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Recompile all Blueprints in the project, hoping to resolve any compilation errors.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. While recompiling Blueprints is often a good general troubleshooting step, it's unlikely to solve a specific Anim Notify execution issue when the notify logic itself is known to be sound. It doesn't pinpoint the root cause.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "animation",
            "title": "Verify Anim Notify Placement",
            "prompt": "<p>You've confirmed the Anim Notifies are correctly placed on the animation timeline and linked to their respective events.</p><p><strong>What's the next logical step to confirm their functionality?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Animation Blueprint (ABP), confirm the implementation logic for the Anim Notify event (e.g., 'Event_PlayImpactFX') is present and set a Breakpoint on it.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.2hrs. Checking the ABP logic and setting a breakpoint is crucial. If the breakpoint isn't hit, it confirms the event isn't even being called at runtime, narrowing down the problem.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Try to recreate the Anim Notifies from scratch in the Animation Sequence, assuming the notify asset itself is corrupted.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.5hrs. The initial symptom stated notifies work perfectly in the Animation Editor, meaning they are NOT corrupted. Recreating them is a time-consuming detour based on a false premise.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Check other character animations to see if their Anim Notifies are also failing, to determine if it's a widespread issue.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. While useful for scoping the problem, it doesn't directly help diagnose why *this* specific notify isn't firing. Your focus should be on the immediate problem.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Verify the asset paths of the particle effects and sound cues referenced by the Anim Notifies.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. This is a good step if the effects were playing but nothing was visible/audible. However, the breakpoint check will tell you if the event is even triggered, which is more fundamental here.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "blueprint_debugging",
            "title": "Debug Animation Blueprint",
            "prompt": "<p>You've set a breakpoint in the Animation Blueprint for the Anim Notify event.</p><p><strong>What do you do next to confirm if the event is being triggered in PIE?</strong></p>",
            "choices": [
                {
                    "text": "<p>Run PIE and perform the attack. Observe that the Breakpoint in the Animation Blueprint is never hit, confirming the event isn't firing at runtime.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.3hrs. This crucial step confirms that the Anim Notify event, despite being correctly set up in the Anim Sequence, is not even being called in the game, pointing to an upstream issue.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Check the engine output log for any warnings or errors related to Anim Notifies during PIE.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. While checking logs is good practice, if the event isn't even triggered, there might be no relevant log messages. The breakpoint provides direct evidence of execution flow.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Verify the execution order of nodes within the Anim Notify event in the ABP, ensuring no logic is blocking it.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. This assumes the event *is* firing but failing internally. The breakpoint will first confirm if the event is even reached, making this check premature.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Check if the 'Anim Notify State' durations are correctly set in the Animation Sequence.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. Anim Notify States are different from regular Anim Notifies. Focus on the specific issue at hand, which is regular Anim Notifies not firing.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "character_setup",
            "title": "Examine Character Setup",
            "prompt": "<p>You've confirmed the Anim Notify breakpoint is never hit in PIE, despite the animation playing. This means the problem lies in how the character's animation system is linked at runtime.</p><p><strong>Where should you look first in the character's Blueprint?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate the Skeletal Mesh Component within the Player Character Blueprint and verify its assigned Mesh and 'Anim Class'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. The Skeletal Mesh Component is the primary link between the visual mesh and the animation system. This is a critical place to check for misconfigurations.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Check the collision profiles on the character mesh, assuming a physics interaction is preventing the notify from firing.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.4hrs. Collision profiles typically affect physics interactions, not the execution of Anim Notifies themselves. This is a misdirection, as the problem is clearly with the animation event pipeline, not physical blocking.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Delete the character from the level and re-add it from the Content Browser, assuming a temporary instance corruption.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. While sometimes helpful for simple level instance issues, this won't resolve underlying asset reference problems and isn't a diagnostic step.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Investigate network replication settings for the character, in case notifies are failing to replicate.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.3hrs. Replication issues are possible in multiplayer, but the problem also occurs in single-player PIE. It's a more advanced and less likely cause than a fundamental animation setup problem.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "asset_references",
            "title": "Examine Skeletal Mesh Component",
            "prompt": "<p>You've located the Skeletal Mesh Component in the Player Character Blueprint and verified the Mesh is assigned and the 'Anim Class' is set to your Animation Blueprint.</p><p><strong>What's the next step to investigate potential reference issues?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Skeletal Mesh asset itself (e.g., 'SKM_Hero') and observe which Skeleton asset it is currently associated with in the Asset Details panel.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.2hrs. The Skeletal Mesh's associated Skeleton is a key piece of information, as it dictates the bone structure and animation compatibility. This could reveal a mismatch.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Check the Physics Asset assignments for the skeletal mesh component.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. Physics Assets relate to ragdolls and collision, not the core animation event pipeline. This is an unrelated tangent.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Manually re-select the 'Anim Class' on the Skeletal Mesh Component, even if it appears correct.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. If it's already set correctly, re-selecting it won't diagnose an underlying reference issue. It's a quick fix attempt without understanding the root cause.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Inspect the Level of Detail (LOD) settings on the Skeletal Mesh for any issues.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. LODs affect rendering complexity, not the fundamental execution of animation notifies. This is not relevant to the problem.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "asset_management",
            "title": "Investigate Skeletal Mesh Skeleton",
            "prompt": "<p>You've opened the Skeletal Mesh asset ('SKM_Hero') and observed it's associated with 'SK_Hero_A'.</p><p><strong>What's the next asset you should inspect to look for a potential mismatch?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Animation Blueprint ('ABP_Hero') and check the 'Skeleton' asset displayed in its Asset Details pane.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.4hrs. This is a critical comparison. The Skeletal Mesh and the Animation Blueprint MUST reference the same Skeleton asset for runtime compatibility.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Re-import the Skeletal Mesh ('SKM_Hero') to ensure it's not corrupted.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.5hrs. There's no indication the skeletal mesh itself is corrupt, only that its reference might be part of the problem. Re-importing is a drastic step before diagnosis.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Check the material assignments on the Skeletal Mesh to ensure they are valid.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. Material assignments affect the visual appearance, not the animation system's ability to trigger events. This is a misdirection.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Export the skeletal mesh and then re-import it as a *new* asset to break any old references.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.8hrs. This is a destructive and time-consuming workaround that doesn't identify or directly fix the root cause of an existing reference issue. It also necessitates re-assigning it everywhere.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "asset_diagnosis",
            "title": "Identify Skeleton Mismatch",
            "prompt": "<p>You've opened 'ABP_Hero' and found it references 'SK_Hero_B', which is different from the skeletal mesh's 'SK_Hero_A'.</p><p><strong>What is the core realization from this discovery?</strong></p>",
            "choices": [
                {
                    "text": "<p>Realize that the Skeletal Mesh is compiled against 'SK_Hero_A', but the Anim BP is compiled against 'SK_Hero_B', leading to a runtime mismatch where Notifies cannot execute.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.2hrs. This is the crucial diagnostic breakthrough! The different skeleton references prevent the Anim BP's logic from correctly interacting with the Skeletal Mesh at runtime, blocking notify execution.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Attempt to re-parent the Animation Blueprint to the Skeletal Mesh, hoping it will force a skeleton update.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.3hrs. While re-parenting might seem logical, it's not the direct method to fix an underlying skeleton asset reference. It might not even be an available option if the skeletons are too dissimilar.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Assume this is a temporary editor bug that will resolve itself after a restart.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. This is a persistent asset configuration problem, not a temporary bug. Ignoring it won't solve anything.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Attempt to migrate the character mesh or Anim BP back into the project, believing the assets are missing data.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +1.0hrs. This is a severe and time-consuming reaction. The problem is a *mismatch* of references, not *missing data*. Migrating assets is overkill and likely to cause more reference issues.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "asset_management",
            "title": "Prepare to Fix Skeleton Reference",
            "prompt": "<p>You've identified the critical mismatch: the Skeletal Mesh uses 'SK_Hero_A' but the Animation Blueprint uses 'SK_Hero_B'.</p><p><strong>What is the best way to correct this reference in the Animation Blueprint?</strong></p>",
            "choices": [
                {
                    "text": "<p>Navigate to the location of the currently referenced, but incorrect, Skeleton asset ('SK_Hero_B') in the Content Browser.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Locating the incorrect skeleton asset in the Content Browser is the starting point for using Unreal's robust reference-fixing tools.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Try to directly change the 'Skeleton' property in the Animation Blueprint's Asset Details panel.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. While this field exists, directly changing it might not properly update all internal references within the Anim BP, potentially leading to instability or subtle bugs. It's better to use explicit reference management tools.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Manually delete the 'SK_Hero_B' asset immediately, expecting the Anim BP to then point to 'SK_Hero_A'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.3hrs. Deleting assets without fixing references first will break the Anim BP and lead to more severe errors. This is a very destructive action.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Recreate the entire Animation Blueprint from scratch, linking it to 'SK_Hero_A'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +1.5hrs. This is an extremely time-consuming and unnecessary step. Unreal Engine provides tools to fix references directly.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "asset_management",
            "title": "Analyze Incorrect Skeleton References",
            "prompt": "<p>You've navigated to the 'SK_Hero_B' asset in the Content Browser. You need to understand its impact before modifying it.</p><p><strong>What's the safest way to check what other assets might be using 'SK_Hero_B'?</strong></p>",
            "choices": [
                {
                    "text": "<p>Right-click the 'SK_Hero_B' asset and select 'Reference Viewer' to confirm its usage.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.3hrs. The Reference Viewer is invaluable for understanding asset dependencies, ensuring you don't inadvertently break other parts of your project when making changes.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Rename the incorrect skeleton asset ('SK_Hero_B') to 'SK_Hero_B_OLD' to see what breaks.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. Renaming is a mild form of breaking references. While it might reveal dependencies, it's less direct and informative than the Reference Viewer and can still lead to errors.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Delete the incorrect skeleton asset ('SK_Hero_B') immediately, trusting you know its dependencies.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.3hrs. This is highly risky. Deleting an asset without knowing its references will cause broken dependencies and potentially crashes. Always use the Reference Viewer first.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Reopen the Animation Blueprint ('ABP_Hero') to verify it still points to the wrong skeleton.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. You've already confirmed the mismatch. This step doesn't provide new diagnostic information or help in fixing the reference.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "asset_management",
            "title": "Replace Asset References",
            "prompt": "<p>You've confirmed via the Reference Viewer that 'SK_Hero_B' is primarily referenced by your Animation Blueprint and a few related animations, as expected. It's safe to proceed with replacing the reference.</p><p><strong>What is the direct tool in the Content Browser for this task?</strong></p>",
            "choices": [
                {
                    "text": "<p>Right-click the incorrect Skeleton asset ('SK_Hero_B') and select 'Replace References'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. 'Replace References' is the most direct and reliable tool in Unreal Engine to update all instances of an asset reference to a new target.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Perform a 'Save All' operation across the project, hoping it will update broken references.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. 'Save All' commits current changes but doesn't actively fix or replace references that are explicitly misconfigured. It's not a diagnostic or fixing tool for this scenario.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Close and reopen the entire project to refresh asset links.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. This is unlikely to resolve a hard-coded asset reference mismatch. It's a general troubleshooting step, not a targeted solution.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Manually open every asset referencing 'SK_Hero_B' and reparent it to 'SK_Hero_A'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.5hrs. While effective, this is incredibly tedious and prone to human error, especially in a project with many assets. 'Replace References' automates this safely.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "asset_management",
            "title": "Execute Reference Replacement",
            "prompt": "<p>You've initiated the 'Replace References' command for 'SK_Hero_B'.</p><p><strong>What do you do in the 'Replace References' dialog to complete the operation?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the dialog, select the correct, currently used Skeleton asset ('SK_Hero_A') as the replacement target and confirm the operation.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.2hrs. Selecting the correct target asset is the core of the 'Replace References' operation, ensuring all old references are correctly swapped.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Search for an 'Update Skeleton Reference' button elsewhere in the editor, thinking 'Replace References' is not the right tool.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. 'Replace References' is indeed the correct tool. Searching for another, non-existent button is a time sink.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Cancel the dialog and try another method, like duplicating the correct skeleton.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Cancelling a correct procedure for a less effective or more complicated one is counterproductive.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Select 'Create New Skeleton' in the dialog, then try to re-link it.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.5hrs. Creating a new skeleton would not link to 'SK_Hero_A' and would add another layer of complexity, requiring manual setup and potentially creating more orphaned assets.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "verification",
            "title": "Confirm Reference Update",
            "prompt": "<p>You've successfully replaced references from 'SK_Hero_B' to 'SK_Hero_A'.</p><p><strong>What's the immediate next step to verify this change?</strong></p>",
            "choices": [
                {
                    "text": "<p>Open the Animation Blueprint ('ABP_Hero') again and check its Asset Details panel to confirm the Skeleton reference has been successfully updated to 'SK_Hero_A'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Directly verifying the change in the ABP's details panel confirms the 'Replace References' operation was successful at its target.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Check the output log for messages indicating successful reference replacement.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While logs might contain confirmation, directly checking the asset is more definitive and provides immediate visual feedback.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Immediately run PIE to see if the Anim Notifies are now working.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. It's crucial to recompile and save the Animation Blueprint after such a fundamental change before testing in PIE. Skipping this step can lead to false negatives.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Re-import all animations that were referencing 'SK_Hero_B' to ensure they are now linked to 'SK_Hero_A'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.5hrs. The 'Replace References' tool should handle this automatically. Re-importing is unnecessary and time-consuming unless specific animation issues arise.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "blueprint_management",
            "title": "Compile and Save Changes",
            "prompt": "<p>You've confirmed that 'ABP_Hero' now correctly references 'SK_Hero_A'.</p><p><strong>What must you do to ensure these changes are applied and saved?</strong></p>",
            "choices": [
                {
                    "text": "<p>Recompile and save the Animation Blueprint ('ABP_Hero').</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Recompiling and saving the Anim BP is essential to ensure the engine registers the new skeleton reference and its associated logic correctly at runtime.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Reopen the Animation Sequence to confirm it still plays correctly.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While not harmful, this step is unnecessary at this point. Your focus should be on getting the Anim BP update to take effect.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Close the Animation Blueprint without recompiling, assuming the reference change is automatic.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Closing without recompiling means your changes won't be applied to the game, leading to continued issues and wasted time.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Edit the Anim BP logic further, adding debug messages to ensure it's executing.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. Your current goal is to verify the fix, not to add more debugging tools. This adds unnecessary complexity before testing the solution.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "verification",
            "title": "First Verification in PIE",
            "prompt": "<p>You've recompiled and saved the Animation Blueprint with the corrected skeleton reference.</p><p><strong>What's the next step to see if your fix was successful?</strong></p>",
            "choices": [
                {
                    "text": "<p>Attempt running PIE to verify the Anim Notifies are now firing (the visual/sound effects should now appear).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Running PIE is the moment of truth. This will tell you if the core issue of the Anim Notifies not firing has been resolved.</p>",
                    "next": "step-15-success-or-fail"
                },
                {
                    "text": "<p>Check the compiled Anim BP for new errors or warnings after recompilation.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While good practice to check logs, a quick PIE test will give you immediate feedback on the *functional* success of the fix. If it fails, then you can dive into logs.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Try to play the animation directly in the Animation Editor to confirm notifies still fire there.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. You already know notifies work in the Animation Editor. The problem is in PIE. This step won't provide new information about the runtime issue.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Clean project intermediate files and restart the editor.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.3hrs. Cleaning intermediates can sometimes resolve obscure issues, but it's a relatively heavy operation. Test the immediate fix first.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15-success-or-fail": {
            "skill": "decision",
            "title": "Evaluate PIE Test Results",
            "prompt": "<p>You've run PIE and performed the attack. Now you need to evaluate the outcome.</p><p><strong>What is your next course of action based on the results?</strong></p>",
            "choices": [
                {
                    "text": "<p>The effects ARE firing. Navigate to the content folder containing the now-orphaned Skeleton ('SK_Hero_B') to begin cleanup.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.0hrs (for evaluation). Excellent! The main issue is resolved. Now, it's good practice to clean up orphaned assets to prevent future confusion and reference issues.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>The effects are STILL NOT firing. Navigate to the content folder containing the orphaned Skeleton ('SK_Hero_B') and any affected assets, as corrupted redirectors might be the cause.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.0hrs (for evaluation). While disappointing, reference updates sometimes leave behind corrupted redirectors. Cleaning these up is the next logical step if the issue persists.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Close the editor and open it again, hoping the changes apply fully.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. This is a generic restart, not a targeted solution. You need to either clean up or dig deeper into persistent issues, not just restart.</p>",
                    "next": "step-15-success-or-fail"
                },
                {
                    "text": "<p>Re-check the Anim Notifies in the Anim Sequence and the ABP for any new errors.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. You've already confirmed these are correct. The problem is now either lingering references or a need for cleanup, not the initial setup.</p>",
                    "next": "step-15-success-or-fail"
                }
            ]
        },
        "step-16": {
            "skill": "asset_cleanup",
            "title": "Address Persistent Issues (Redirectors)",
            "prompt": "<p>The Anim Notifies are still not firing, suggesting a deeper problem like corrupted redirectors after the asset reference replacement. You are in the content folder of the orphaned skeleton.</p><p><strong>What is the standard procedure to clean up redirectors in a folder?</strong></p>",
            "choices": [
                {
                    "text": "<p>Right-click on the folder in the Content Browser and select 'Fix Up Redirectors in Folder'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.3hrs. 'Fix Up Redirectors in Folder' is essential for cleaning up obsolete redirects that can cause assets to still reference old, moved, or deleted asset IDs, even after explicit reference replacement.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Manually search for and delete all '.uasset' redirector files in the Windows Explorer.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.5hrs. Manually deleting files in Windows Explorer is dangerous and prone to error. Unreal Engine's 'Fix Up Redirectors' is the safe and correct way to manage these.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Delete the entire folder containing the old skeleton, assuming everything in it is broken.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. This is too aggressive and could accidentally delete other legitimate assets or break more references. Always use targeted cleanup tools.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Use a console command to rebuild the entire asset registry of the project.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.4hrs. While a registry rebuild can sometimes help, 'Fix Up Redirectors' is the more specific and effective solution for this type of issue, as it actively rewrites references.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "asset_cleanup",
            "title": "Remove Obsolete Assets",
            "prompt": "<p>You've either successfully fixed the references and are now doing cleanup, or you've just fixed redirectors after a persistent issue. You're in the folder containing the now-obsolete 'SK_Hero_B' skeleton.</p><p><strong>What is the next best practice step for the obsolete skeleton asset itself?</strong></p>",
            "choices": [
                {
                    "text": "<p>Manually delete the now-unreferenced or obsolete Skeleton asset ('SK_Hero_B') to prevent future confusion and reference issues.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Deleting the obsolete asset is crucial for a clean project. Make sure it truly has no remaining references before deleting.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Move the obsolete skeleton to a 'Quarantined' folder outside the main content tree.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While a safer alternative than immediate deletion if unsure, the best practice is to remove truly unreferenced assets to keep the project clean. This just moves the problem.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Leave the obsolete skeleton in place, as it's harmless now that references are fixed.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Leaving obsolete assets can lead to confusion, increased project size, and potential accidental re-referencing in the future. Clean up is always best.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Export the obsolete skeleton as a backup, then delete it.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. While having backups is generally good, exporting an obsolete asset is usually unnecessary. Version control should handle asset history. Focus on clean deletion.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "project_management",
            "title": "Commit Project Changes",
            "prompt": "<p>You've deleted the obsolete skeleton asset ('SK_Hero_B').</p><p><strong>What is a vital final step to ensure all changes, including reference updates and cleanup, are permanently recorded?</strong></p>",
            "choices": [
                {
                    "text": "<p>Perform a 'Save All' operation across the project to commit the reference changes and redirector cleanup.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. 'Save All' is crucial to ensure all modified assets, including redirectors and blueprint changes, are written to disk, making your fixes permanent.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Close the editor immediately, assuming changes are auto-saved.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Unreal Engine does not auto-save all asset changes by default. Closing without saving will revert your hard work.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Undo the recent changes, as a precaution, then try again.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. Undoing is for mistakes, not for committing successful changes. This would revert all your fixes.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Check version control for pending changes and commit them.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. While committing to version control is a good practice *after* saving, 'Save All' is the prerequisite step to ensure the changes are on disk before they can be committed.</p>",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "verification",
            "title": "Final Verification",
            "prompt": "<p>You've performed a 'Save All' operation after all the fixes and cleanup.</p><p><strong>What is the very last step to confirm everything is working perfectly?</strong></p>",
            "choices": [
                {
                    "text": "<p>Run a final PIE session to confirm that all Anim Notifies for the character are now executing reliably.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. A final PIE session ensures that the character's animation system, including all Anim Notifies, is functioning correctly and reliably after all the changes and cleanup.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Compile all shaders in the project manually.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. Compiling shaders is unrelated to Anim Notify execution logic. This is not a diagnostic or verification step for this problem.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Revert to a previous save, just to be safe.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. Reverting would undo all your hard work. You've just fixed the issue; you don't want to go back.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Re-verify skeletal mesh material slots to ensure they are still correct.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. Material slots are visual; they do not affect Anim Notify execution. This is an irrelevant check at this stage.</p>",
                    "next": "step-19"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully resolved the silent Anim Notify failure by identifying and correcting the orphaned skeleton asset reference, ensuring a clean project state. The character's particle and sound effects now trigger correctly in PIE.</p>",
            "choices": []
        }
    }
};
