window.SCENARIOS['assetmanagement_beginner'] = {
    meta: {
        expanded: true,
        title: "Asset Management: Missing Material References After Folder Reorganization",
        description: "After reorganizing the Content folder, meshes show pink/black checkers and the Level Blueprint fails to spawn a particle system. Investigates asset redirectors, reference fixing, and Blueprint recompilation.",
        estimateHours: 3.0,
        category: "Assets"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'assetmanagement',
            title: 'Initial Discovery',
            prompt: "<p>You've just reorganized the Content Browser, moving assets from <code>/Game/OldAssets/</code> to <code>/Game/Organized/Props/</code> and <code>/Game/Organized/Effects/</code>. Now when you open the level, several meshes display pink and black checkerboard patterns, and the Level Blueprint throws an error when trying to spawn a particle system.</p><strong>What's your first step to understand what went wrong?</strong>",
            choices: [
                {
                    text: 'Open the <strong>Output Log</strong> and look for asset reference errors or warnings.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> The Output Log shows warnings like <code>Warning: Failed to load '/Game/OldAssets/Props/SM_Crate': Asset not found</code>. This confirms broken references due to the folder move.</p>",
                    next: 'step-inv-1'
                },
                {
                    text: 'Immediately try to manually re-assign materials to the affected meshes.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> This might fix the visual issue temporarily, but it doesn't address the root cause. The Blueprint references will still be broken, and you'll have to manually fix every reference in the project.</p>",
                    next: 'step-1W'
                },
                {
                    text: 'Check the <strong>Reference Viewer</strong> for one of the affected meshes to see what's referencing it.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> The Reference Viewer shows the dependencies, but it doesn't directly tell you about the broken references from the move. The Output Log is more direct.</p>",
                    next: 'step-inv-1'
                },
                {
                    text: 'Undo the folder reorganization and put everything back.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> While this would fix the immediate problem, you'd lose all your organizational work. There's a proper way to fix broken references without reverting your changes.</p>",
                    next: 'step-1M'
                }
            ]
        },

        'step-1W': {
            skill: 'assetmanagement',
            title: 'Manual Re-assignment Attempt',
            prompt: "<p>You spent time manually re-assigning materials to the affected meshes. The pink checkers are gone, but when you test the level, the Level Blueprint still fails to spawn the particle system. The error message says the particle system asset can't be found.</p><strong>What should you do now?</strong>",
            choices: [
                {
                    text: 'Check the Output Log to understand the full scope of broken references.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You should have started here. The log reveals multiple broken references, not just materials.</p>",
                    next: 'step-inv-1'
                },
                {
                    text: 'Continue manually fixing each broken reference one by one.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> This is extremely time-consuming and error-prone. There's an automated solution.</p>",
                    next: 'step-inv-1'
                }
            ]
        },

        'step-1M': {
            skill: 'assetmanagement',
            title: 'Considering Reverting Changes',
            prompt: "<p>You're about to undo hours of organizational work. Before you do, a senior developer suggests there might be a way to fix the broken references without reverting.</p><strong>What should you investigate?</strong>",
            choices: [
                {
                    text: 'Check the Output Log to see exactly what references are broken.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Good call. Understanding the problem is the first step to fixing it properly.</p>",
                    next: 'step-inv-1'
                }
            ]
        },

        'step-2': {
            skill: 'assetmanagement',
            title: 'Understanding Asset Redirectors',
            prompt: "<p>The Output Log shows multiple warnings about assets not being found at their old paths. You remember hearing about <strong>Redirectors</strong> in Unreal Engine - special assets that maintain references when files are moved.</p><strong>How can you see if redirectors were created during your folder move?</strong>",
            choices: [
                {
                    text: 'In the Content Browser, go to <strong>View Options</strong> and enable <strong>Show Redirectors</strong>.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Perfect! Redirectors are hidden by default. Enabling this view option reveals grey arrow icons in the old folder locations.</p>",
                    next: 'step-3'
                },
                {
                    text: 'Search the Content Browser for files with "Redirector" in the name.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Redirectors don't have \"Redirector\" in their filename - they keep the original asset name. You need to enable the view option to see them.</p>",
                    next: 'step-3'
                },
                {
                    text: 'Look in Project Settings for a Redirector configuration panel.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Redirectors aren't configured in Project Settings. They're automatically created when you move assets, and you view them in the Content Browser.</p>",
                    next: 'step-2M'
                },
                {
                    text: 'Assume redirectors don't exist and manually fix all references.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Redirectors were automatically created when you moved the assets. You just need to make them visible.</p>",
                    next: 'step-3'
                }
            ]
        },

        'step-2M': {
            skill: 'assetmanagement',
            title: 'Project Settings Dead End',
            prompt: "<p>You spent time exploring Project Settings but found nothing about redirectors. A colleague mentions that redirectors are visible in the Content Browser if you enable the right view option.</p><strong>Where do you enable this option?</strong>",
            choices: [
                {
                    text: 'Content Browser > View Options > Show Redirectors.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> There it is! The redirectors appear as grey arrow icons.</p>",
                    next: 'step-3'
                }
            ]
        },

        'step-3': {
            skill: 'assetmanagement',
            title: 'Locating the Redirectors',
            prompt: "<p>With <strong>Show Redirectors</strong> enabled, you navigate to <code>/Game/OldAssets/</code>. You see several grey arrow icons with the names of the assets you moved. These are the redirectors - they point from the old location to the new location.</p><strong>What do redirectors do, and why are references still broken?</strong>",
            choices: [
                {
                    text: 'Redirectors maintain references temporarily, but they need to be <strong>fixed up</strong> to update all references to point directly to the new location.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Exactly! Redirectors are a temporary solution. The \"Fix Up Redirectors\" command updates all references to point directly to the new asset locations, then removes the redirectors.</p>",
                    next: 'step-4'
                },
                {
                    text: 'Redirectors are permanent and should be kept in the project to maintain compatibility.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> No, redirectors are meant to be temporary. Leaving them in the project can cause performance issues and confusion. They should be fixed up and removed.</p>",
                    next: 'step-3W'
                },
                {
                    text: 'Redirectors automatically fix references after a certain amount of time.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Redirectors don't auto-fix. You need to manually run the \"Fix Up Redirectors\" command.</p>",
                    next: 'step-3M'
                },
                {
                    text: 'Redirectors are just informational - you still need to manually update all references.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Redirectors do more than inform - they can automatically update references when you use the \"Fix Up Redirectors\" command.</p>",
                    next: 'step-4'
                }
            ]
        },

        'step-3W': {
            skill: 'assetmanagement',
            title: 'Keeping Redirectors',
            prompt: "<p>You decided to keep the redirectors. Over the next few days, other developers report confusion about why there are duplicate asset names in different folders. Load times also seem slightly slower. The tech lead asks you to clean up the redirectors.</p><strong>What should you do?</strong>",
            choices: [
                {
                    text: 'Right-click on the folder containing redirectors and select <strong>Fix Up Redirectors in Folder</strong>.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> This is the proper cleanup step. It updates all references and removes the redirectors.</p>",
                    next: 'step-4'
                }
            ]
        },

        'step-3M': {
            skill: 'assetmanagement',
            title: 'Waiting for Auto-Fix',
            prompt: "<p>You waited, but the references are still broken. A senior developer explains that you need to manually run the \"Fix Up Redirectors\" command.</p><strong>How do you do this?</strong>",
            choices: [
                {
                    text: 'Right-click on the folder containing redirectors and select <strong>Fix Up Redirectors in Folder</strong>.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct! This command updates all references to point to the new locations.</p>",
                    next: 'step-4'
                }
            ]
        },

        'step-4': {
            skill: 'assetmanagement',
            title: 'Using Fix Up Redirectors',
            prompt: "<p>You right-click on the <code>/Game/OldAssets/</code> folder and see the option <strong>Fix Up Redirectors in Folder</strong>. This command will scan all assets in the project and update references to point directly to the new asset locations.</p><strong>What should you do before running this command?</strong>",
            choices: [
                {
                    text: 'Save all unsaved assets and consider making a backup, then run <strong>Fix Up Redirectors in Folder</strong>.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Smart! This is a project-wide operation, so it's good to save first. The command runs and updates hundreds of references automatically.</p>",
                    next: 'step-5'
                },
                {
                    text: 'Just run the command immediately without saving.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> The command works, but it's always safer to save first before running project-wide operations.</p>",
                    next: 'step-5'
                },
                {
                    text: 'Manually fix each redirector one by one instead of using the folder command.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> This is unnecessarily tedious. The folder command handles all redirectors at once.</p>",
                    next: 'step-4M'
                },
                {
                    text: 'Delete the redirectors manually without fixing them up.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Deleting redirectors without fixing them up will permanently break all references! Always fix up first.</p>",
                    next: 'step-4W'
                }
            ]
        },

        'step-4W': {
            skill: 'assetmanagement',
            title: 'Deleted Redirectors Without Fixing',
            prompt: "<p>You deleted the redirectors. Now EVERYTHING is broken - materials, blueprints, particle systems. The entire project is in a bad state. You need to restore from source control or a backup.</p><strong>What's the lesson here?</strong>",
            choices: [
                {
                    text: 'Restore from backup, then properly use <strong>Fix Up Redirectors</strong> before deleting anything.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Lesson learned. Always fix up redirectors before removing them.</p>",
                    next: 'step-5'
                }
            ]
        },

        'step-4M': {
            skill: 'assetmanagement',
            title: 'Manual Redirector Fixing',
            prompt: "<p>You're fixing redirectors one by one. After 30 minutes, you've only fixed 5 out of 20. This is going to take hours.</p><strong>What's a better approach?</strong>",
            choices: [
                {
                    text: 'Use <strong>Fix Up Redirectors in Folder</strong> to handle all of them at once.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Much better! The command completes in seconds.</p>",
                    next: 'step-5'
                }
            ]
        },

        'step-5': {
            skill: 'assetmanagement',
            title: 'Verifying Material Fixes',
            prompt: "<p>The <strong>Fix Up Redirectors</strong> command completed successfully. The Output Log shows that it updated references in 47 assets. You open the level and notice that most meshes now display their materials correctly!</p><strong>How can you verify that all material references are properly fixed?</strong>",
            choices: [
                {
                    text: 'Check the meshes in the level and use the <strong>Reference Viewer</strong> on a few materials to confirm they're being referenced from the new location.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Good verification! The Reference Viewer shows that materials are now correctly referenced from <code>/Game/Organized/</code>.</p>",
                    next: 'step-6'
                },
                {
                    text: 'Just assume everything is fixed and move on.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Always verify your fixes! You might have missed something.</p>",
                    next: 'step-6'
                },
                {
                    text: 'Check only one or two meshes and assume the rest are fine.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Spot-checking is better than nothing, but a more thorough verification is recommended for critical fixes.</p>",
                    next: 'step-6'
                },
                {
                    text: 'Run the Fix Up Redirectors command again to be sure.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Running it again won't hurt, but it's unnecessary. The command is thorough the first time.</p>",
                    next: 'step-6'
                }
            ]
        },

        'step-6': {
            skill: 'assetmanagement',
            title: 'Blueprint Reference Issues',
            prompt: "<p>The materials look great, but when you test the level in PIE, the Level Blueprint still throws an error: <code>Error: Accessed None trying to read property 'ParticleSystem'</code>. The Blueprint is trying to spawn a particle system that it can't find.</p><strong>Why might the Blueprint still have broken references even after fixing up redirectors?</strong>",
            choices: [
                {
                    text: 'Blueprints sometimes need to be <strong>recompiled</strong> after reference changes to refresh their internal dependencies.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Exactly! Blueprints cache references, and recompiling forces them to reload. Open the Level Blueprint and click <strong>Compile</strong>.</p>",
                    next: 'step-7'
                },
                {
                    text: 'The Fix Up Redirectors command doesn't work on Blueprints - you need to manually re-assign the particle system reference.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Fix Up Redirectors does work on Blueprints, but sometimes they need a recompile to refresh. Try that first before manual fixes.</p>",
                    next: 'step-7'
                },
                {
                    text: 'The particle system asset must have been deleted during the move.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> The asset wasn't deleted - it was moved. Check if the Blueprint just needs a recompile.</p>",
                    next: 'step-6M'
                },
                {
                    text: 'Blueprints are incompatible with redirectors - you need to recreate the Blueprint from scratch.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Blueprints work fine with redirectors! You just need to recompile.</p>",
                    next: 'step-7'
                }
            ]
        },

        'step-6M': {
            skill: 'assetmanagement',
            title: 'Investigating Missing Particle System',
            prompt: "<p>You search the Content Browser and find the particle system in its new location at <code>/Game/Organized/Effects/</code>. It wasn't deleted - it's just that the Blueprint hasn't refreshed its reference.</p><strong>What should you do?</strong>",
            choices: [
                {
                    text: 'Open the Level Blueprint and click <strong>Compile</strong> to refresh its references.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Perfect! Recompiling forces the Blueprint to reload all its references.</p>",
                    next: 'step-7'
                }
            ]
        },

        'step-7': {
            skill: 'assetmanagement',
            title: 'Recompiling the Blueprint',
            prompt: "<p>You open the Level Blueprint and click the <strong>Compile</strong> button. The Blueprint recompiles successfully, and the error disappears! The particle system reference is now properly resolved to the new location.</p><strong>What should you do next to ensure the fix works?</strong>",
            choices: [
                {
                    text: 'Test in <strong>PIE (Play In Editor)</strong> and trigger the Blueprint event that spawns the particle system.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Excellent! You test the level, trigger the event, and the particle system spawns correctly. The fix works!</p>",
                    next: 'step-ver-1'
                },
                {
                    text: 'Assume the compile fixed everything and mark the task as complete.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Always test your fixes! Compiling removes the error, but you should verify the functionality works.</p>",
                    next: 'step-ver-1'
                },
                {
                    text: 'Check the Output Log for any remaining warnings.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Good practice, but actually running the game is the best verification.</p>",
                    next: 'step-ver-1'
                },
                {
                    text: 'Recompile all Blueprints in the project to be safe.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> This isn't necessary unless other Blueprints are also broken. Test this one first.</p>",
                    next: 'step-ver-1'
                }
            ]
        },

        'step-8': {
            skill: 'assetmanagement',
            title: 'Cleanup - Removing Old Folders',
            prompt: "<p>Everything works! The materials display correctly, and the particle system spawns as expected. Now you notice that the old <code>/Game/OldAssets/</code> folder is empty except for the redirectors, which have been fixed up.</p><strong>What should you do with the old folder and redirectors?</strong>",
            choices: [
                {
                    text: 'Delete the redirectors and the empty <code>/Game/OldAssets/</code> folder to clean up the Content Browser.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Perfect! After fixing up redirectors, they're safe to delete. Removing empty folders keeps your project organized.</p>",
                    next: 'step-9'
                },
                {
                    text: 'Keep the redirectors in case you need to revert the changes later.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Once redirectors are fixed up, all references point directly to the new locations. The redirectors are no longer needed and should be removed.</p>",
                    next: 'step-8M'
                },
                {
                    text: 'Keep the empty folder for organizational purposes.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Empty folders can cause confusion. It's better to remove them unless you plan to use them soon.</p>",
                    next: 'step-9'
                },
                {
                    text: 'Leave everything as-is to avoid breaking anything.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Leaving old redirectors and empty folders creates clutter and can confuse other developers. Clean up after yourself!</p>",
                    next: 'step-9'
                }
            ]
        },

        'step-8M': {
            skill: 'assetmanagement',
            title: 'Keeping Redirectors for Safety',
            prompt: "<p>You kept the redirectors \"just in case.\" A week later, the tech lead asks why there are still redirectors in the project. They explain that fixed-up redirectors are safe to delete and should be removed to keep the project clean.</p><strong>What should you do?</strong>",
            choices: [
                {
                    text: 'Delete the redirectors and empty folder now.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Good! The project is now clean and organized.</p>",
                    next: 'step-9'
                }
            ]
        },

        'step-9': {
            skill: 'assetmanagement',
            title: 'Final Validation',
            prompt: "<p>You've deleted the redirectors and the empty <code>/Game/OldAssets/</code> folder. The Content Browser is now clean and organized. Before you mark this task as complete, you want to do a final comprehensive test.</p><strong>What's the best way to validate that everything is working correctly?</strong>",
            choices: [
                {
                    text: 'Run a full PIE test, check all affected meshes and Blueprints, and verify the Output Log shows no asset errors.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Excellent! Everything works perfectly. Materials display correctly, the particle system spawns, and there are no errors in the log. The folder reorganization is complete!</p>",
                    next: 'step-ver-registry'
                },
                {
                    text: 'Just check the Output Log for errors.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> The log is clean, but actually running the game provides better validation.</p>",
                    next: 'step-ver-registry'
                },
                {
                    text: 'Ask another developer to test it.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> It's good to get a second opinion, but you should do your own comprehensive testing first.</p>",
                    next: 'step-ver-registry'
                },
                {
                    text: 'Assume everything is fine since there were no errors during cleanup.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Always test! Assumptions lead to bugs in production.</p>",
                    next: 'step-ver-registry'
                }
            ]
        },

        'step-10': {
            skill: 'assetmanagement',
            title: 'Documentation and Best Practices',
            prompt: "<p>Everything is working perfectly! Before you finish, you want to document what you learned for future reference and share best practices with the team.</p><strong>What's the most important lesson from this experience?</strong>",
            choices: [
                {
                    text: 'Document the proper workflow: Move assets → Enable "Show Redirectors" → Fix Up Redirectors in Folder → Recompile affected Blueprints → Delete redirectors and empty folders.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Perfect! You create a wiki page documenting this workflow. Future folder reorganizations will be much smoother. Task complete!</p>",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'assetmanagement',
            title: 'Investigation: Reference Viewer',
            prompt: "<p>The Output Log confirmed missing assets. To visualize the dependency chain, you right-click one of the broken Static Meshes in the Content Browser and select <strong>Reference Viewer</strong>.</p><strong>What do you expect to see regarding its material reference?</strong>",
            choices: [
                {
                    text: "Observation: It points to the <strong>Old Path</strong> (e.g., <code>/Game/OldAssets/Mat_Prop</code>), and the node is likely marked as missing or invalid.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. The mesh still thinks the material is in the old folder. This confirms the reference wasn't updated during the move.</p>",
                    next: 'step-inv-2'
                },
                {
                    text: "Observation: It points to the <strong>New Path</strong>, but the connection line is broken.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> If it pointed to the new path, the reference would be valid. It's pointing to the old path where the asset no longer exists.</p>",
                    next: 'step-inv-2'
                },
                {
                    text: "Observation: It points to <code>Engine/DefaultMaterial</code> because the reference is lost.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> While it renders the default material, the Reference Viewer usually shows the <em>attempted</em> path (the old one) as a missing dependency.</p>",
                    next: 'step-herring'
                },
            ]
        },

        'step-inv-2': {
            skill: 'assetmanagement',
            title: 'Investigation: File System Verification',
            prompt: "<p>The Reference Viewer confirms the mesh is looking for the material in the old location. You decide to verify what actually exists on the disk. You right-click the <code>/Game/OldAssets/</code> folder and choose <strong>Show in Explorer</strong> (or Finder).</p><strong>What do you find in the folder?</strong>",
            choices: [
                {
                    text: "Observation: The folder contains small 1KB <code>.uasset</code> files corresponding to the moved assets.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> These small files are the <strong>Redirectors</strong>. They exist on disk but are hidden in the Content Browser by default.</p>",
                    next: 'step-inv-1'
                },
                {
                    text: "Observation: The folder is completely empty.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> If it were empty, there would be no redirectors. Unreal creates them automatically. They are likely there.</p>",
                    next: 'step-inv-1'
                },
                {
                    text: "Observation: I suspect this is a Shader Cache issue, not a file issue.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> Let's verify that hypothesis.</p>",
                    next: 'step-herring'
                },
            ]
        },

        'step-herring': {
            skill: 'assetmanagement',
            title: 'Red Herring: Shader Cache Corruption',
            prompt: "<p>You suspect the pink checkerboard might be a shader compilation issue or a corrupted Derived Data Cache (DDC). You close the editor, delete the <code>DerivedDataCache</code> and <code>Intermediate</code> folders, and relaunch the project.</p><strong>What is the result?</strong>",
            choices: [
                {
                    text: "Result: The engine recompiles shaders, but the meshes are <strong>still pink</strong>.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Shader corruption can cause visual glitches, but pink checkers usually mean a missing material reference. Now that we've ruled out shaders, let's look for Redirectors.</p>",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'assetmanagement',
            title: 'Verification: Asset Validation',
            prompt: "<p>The Blueprint compiles and the level plays correctly. Before finalizing the cleanup, you want to ensure the moved assets themselves aren't corrupted.</p><strong>What is the quickest way to check the integrity of the assets in the new folder?</strong>",
            choices: [
                {
                    text: "Right-click the <code>/Game/Organized/</code> folder and select <strong>Validate Assets</strong>.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> This runs a quick check to ensure the asset data is readable and dependencies are valid.</p>",
                    next: 'step-ver-2'
                },
                {
                    text: "Open every single asset manually to check for errors.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> That would take too long. Use the automated validation tool.</p>",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'assetmanagement',
            title: 'Verification: Map Check',
            prompt: "<p>The asset validation passed. Finally, you want to ensure the Level file doesn't hold onto any old references that might not stop gameplay but could cause issues later.</p><strong>How do you perform this check?</strong>",
            choices: [
                {
                    text: "Go to <strong>Build > Map Check</strong> to scan the level for errors.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Map Check is excellent for finding null references or deprecated actors in the level.</p>",
                    next: 'step-ver-1'
                },
                {
                    text: "Save the level as a new filename.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Saving doesn't validate the level's internal references.</p>",
                    next: 'step-ver-1'
                },
            ]
        },

        
        'step-inv-audit': {
            skill: 'assetmanagement',
            title: 'Investigation: Project-Wide Reference Audit',
            prompt: "<p>The Output Log confirms numerous broken references. Instead of checking assets one by one, you want a comprehensive, project-wide report on all assets still referencing the old paths.</p><strong>Which tool provides the best overview of asset dependencies and potential issues?</strong>",
            choices: [
                {
                    text: "Use the <strong>Asset Audit</strong> window (Tools > Audit Assets) and filter by 'Referencers'.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> The Asset Audit tool quickly identifies all assets (meshes, materials, Blueprints) that still point to the old, missing paths, confirming the scope of the redirector problem.</p>",
                    next: 'step-inv-console'
                },
                {
                    text: "Use the <strong>Reference Viewer</strong> on the entire Content folder.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> The Reference Viewer is good for individual assets, but the Asset Audit tool is better for project-wide reporting and filtering.</p>",
                    next: 'step-inv-console'
                },
                {
                    text: "Search the entire project for the old folder path in the Content Browser search bar.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> This only finds assets *in* that path, not assets *referencing* that path if the path is empty.</p>",
                    next: 'step-inv-console'
                },
            ]
        },

        'step-inv-console': {
            skill: 'debugging',
            title: 'Investigation: Runtime Asset Status Check',
            prompt: "<p>You want to confirm if the engine is even attempting to load the missing particle system during PIE, or if the reference is completely nullified before runtime. You decide to use the console.</p><strong>Which console command helps you list loaded assets and their paths?</strong>",
            choices: [
                {
                    text: "Run <code>obj list class=ParticleSystem</code> and search for the asset name.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> This command confirms the engine is attempting to load the asset from the old path, but it fails, resulting in the 'Accessed None' error in the Blueprint. This confirms the need for redirector cleanup.</p>",
                    next: 'step-inv-audit'
                },
                {
                    text: "Run <code>stat unit</code> to check performance.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> <code>stat unit</code> checks performance, not asset loading status.</p>",
                    next: 'step-inv-audit'
                },
                {
                    text: "Run <code>list assets</code> and search for the old folder path.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> <code>list assets</code> is useful, but filtering by class (<code>obj list class=...</code>) is more precise for debugging a specific asset type.</p>",
                    next: 'step-inv-audit'
                },
            ]
        },

        'step-herring-sc': {
            skill: 'sourcecontrol',
            title: 'Red Herring: Source Control Mismanagement',
            prompt: "<p>You realize you moved the assets locally before submitting the changes. You worry that source control (Perforce/Git) might be preventing the references from updating correctly, perhaps by locking the old files.</p><strong>What is the relationship between asset moves, redirectors, and source control?</strong>",
            choices: [
                {
                    text: "The move operation created redirectors locally. Source control needs to see the redirectors added, the old assets deleted, and the new assets added/moved. The broken references are an editor issue, not a source control lock.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct. Source control tracks the files, but the editor's internal reference system relies on redirectors. You must fix the references in the editor first, then submit the changes (including the deletion of the redirectors).</p>",
                    next: 'step-inv-audit'
                },
                {
                    text: "Force sync the entire Content folder to overwrite local changes.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> This would revert your folder organization, forcing you to start over.</p>",
                    next: 'step-inv-audit'
                },
            ]
        },

        'step-ver-perf': {
            skill: 'optimization',
            title: 'Verification: Performance Impact Check',
            prompt: "<p>The references are fixed, but you know that redirectors, while temporary, can slightly increase load times as the engine has to resolve the redirection path. Before deleting them, you want to measure the impact.</p><strong>Which console command is best for checking runtime performance metrics like frame time and load spikes?</strong>",
            choices: [
                {
                    text: "Run <code>stat unit</code> and observe the Game, Draw, and GPU times during level load and gameplay.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> <code>stat unit</code> confirms that performance is acceptable, but you notice a minor spike during asset loading, which you attribute to the redirector resolution. Time to clean up!</p>",
                    next: 'step-ver-perf'
                },
                {
                    text: "Run <code>stat fps</code> only.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> <code>stat fps</code> is useful, but <code>stat unit</code> gives a more detailed breakdown of where time is spent (CPU vs. GPU).</p>",
                    next: 'step-ver-perf'
                },
                {
                    text: "Use the Profiler tool to analyze the CPU usage.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> The Profiler is overkill for a quick check on redirector overhead. <code>stat unit</code> is faster.</p>",
                    next: 'step-ver-perf'
                },
            ]
        },

        'step-ver-registry': {
            skill: 'assetmanagement',
            title: 'Verification: Asset Registry Deep Clean',
            prompt: "<p>You have deleted the redirectors and the old folder. To be absolutely certain that no lingering metadata or references to the old path exist in the engine's internal database, you want to dump the Asset Registry.</p><strong>What console command allows you to inspect the Asset Registry contents?</strong>",
            choices: [
                {
                    text: "Run <code>DumpAssetRegistry</code> and search the Output Log for the old path (<code>/Game/OldAssets/</code>).",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> The log confirms that the old path is no longer registered in the Asset Registry, indicating a complete and successful cleanup.</p>",
                    next: 'step-ver-registry'
                },
                {
                    text: "Run <code>FixUpRedirectorsInFolder</code> again on the Content root.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> This is unnecessary since the redirectors were already deleted. The Asset Registry check is a deeper validation.</p>",
                    next: 'step-ver-registry'
                },
            ]
        },

        'conclusion': {
            skill: 'assetmanagement',
            title: 'Scenario Complete: Asset Management Success',
            prompt: "<p>You successfully diagnosed and resolved broken asset references caused by folder reorganization, utilizing redirector cleanup and Blueprint recompilation. Your project is now clean, organized, and functional.</p>",
            choices: [
            ]
        },


    }
};
