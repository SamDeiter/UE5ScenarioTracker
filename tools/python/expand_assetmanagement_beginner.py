"""
Expand assetmanagement_beginner.js from 1 step to 10+ steps

This script will create an expanded version of the asset management beginner scenario,
transforming it from a single-step quiz into a sequential debugging journey.
"""

# The expanded scenario content
EXPANDED_SCENARIO = """window.SCENARIOS['assetmanagement_beginner'] = {
    meta: {
        title: "Asset Management: Missing Material References After Folder Reorganization",
        description: "After reorganizing the Content folder, meshes show pink/black checkers and the Level Blueprint fails to spawn a particle system. Investigates asset redirectors, reference fixing, and Blueprint recompilation.",
        estimateHours: 3.0
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'assetmanagement',
            title: 'Step 1: Initial Discovery',
            prompt: "<p>You've just reorganized the Content Browser, moving assets from <code>/Game/OldAssets/</code> to <code>/Game/Organized/Props/</code> and <code>/Game/Organized/Effects/</code>. Now when you open the level, several meshes display pink and black checkerboard patterns, and the Level Blueprint throws an error when trying to spawn a particle system.</p><strong>What's your first step to understand what went wrong?</strong>",
            choices: [
                {
                    text: 'Action: Open the <strong>Output Log</strong> and look for asset reference errors or warnings.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> The Output Log shows warnings like <code>Warning: Failed to load '/Game/OldAssets/Props/SM_Crate': Asset not found</code>. This confirms broken references due to the folder move.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: Immediately try to manually re-assign materials to the affected meshes.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> This might fix the visual issue temporarily, but it doesn't address the root cause. The Blueprint references will still be broken, and you'll have to manually fix every reference in the project.</p>",
                    next: 'step-1W'
                },
                {
                    text: 'Action: Check the <strong>Reference Viewer</strong> for one of the affected meshes to see what's referencing it.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> The Reference Viewer shows the dependencies, but it doesn't directly tell you about the broken references from the move. The Output Log is more direct.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: Undo the folder reorganization and put everything back.',
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
                    text: 'Action: Check the Output Log to understand the full scope of broken references.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You should have started here. The log reveals multiple broken references, not just materials.</p>",
                    next: 'step-2'
                },
                {
                    text: 'Action: Continue manually fixing each broken reference one by one.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> This is extremely time-consuming and error-prone. There's an automated solution.</p>",
                    next: 'step-2'
                }
            ]
        },

        'step-1M': {
            skill: 'assetmanagement',
            title: 'Considering Reverting Changes',
            prompt: "<p>You're about to undo hours of organizational work. Before you do, a senior developer suggests there might be a way to fix the broken references without reverting.</p><strong>What should you investigate?</strong>",
            choices: [
                {
                    text: 'Action: Check the Output Log to see exactly what references are broken.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Good call. Understanding the problem is the first step to fixing it properly.</p>",
                    next: 'step-2'
                }
            ]
        },

        'step-2': {
            skill: 'assetmanagement',
            title: 'Step 2: Understanding Asset Redirectors',
            prompt: "<p>The Output Log shows multiple warnings about assets not being found at their old paths. You remember hearing about <strong>Redirectors</strong> in Unreal Engine - special assets that maintain references when files are moved.</p><strong>How can you see if redirectors were created during your folder move?</strong>",
            choices: [
                {
                    text: 'Action: In the Content Browser, go to <strong>View Options</strong> and enable <strong>Show Redirectors</strong>.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Perfect! Redirectors are hidden by default. Enabling this view option reveals grey arrow icons in the old folder locations.</p>",
                    next: 'step-3'
                },
                {
                    text: 'Action: Search the Content Browser for files with \"Redirector\" in the name.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Redirectors don't have \"Redirector\" in their filename - they keep the original asset name. You need to enable the view option to see them.</p>",
                    next: 'step-3'
                },
                {
                    text: 'Action: Look in Project Settings for a Redirector configuration panel.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Redirectors aren't configured in Project Settings. They're automatically created when you move assets, and you view them in the Content Browser.</p>",
                    next: 'step-2M'
                },
                {
                    text: 'Action: Assume redirectors don't exist and manually fix all references.',
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
                    text: 'Action: Content Browser > View Options > Show Redirectors.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> There it is! The redirectors appear as grey arrow icons.</p>",
                    next: 'step-3'
                }
            ]
        },

        'step-3': {
            skill: 'assetmanagement',
            title: 'Step 3: Locating the Redirectors',
            prompt: "<p>With <strong>Show Redirectors</strong> enabled, you navigate to <code>/Game/OldAssets/</code>. You see several grey arrow icons with the names of the assets you moved. These are the redirectors - they point from the old location to the new location.</p><strong>What do redirectors do, and why are references still broken?</strong>",
            choices: [
                {
                    text: 'Action: Redirectors maintain references temporarily, but they need to be <strong>fixed up</strong> to update all references to point directly to the new location.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Exactly! Redirectors are a temporary solution. The \"Fix Up Redirectors\" command updates all references to point directly to the new asset locations, then removes the redirectors.</p>",
                    next: 'step-4'
                },
                {
                    text: 'Action: Redirectors are permanent and should be kept in the project to maintain compatibility.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> No, redirectors are meant to be temporary. Leaving them in the project can cause performance issues and confusion. They should be fixed up and removed.</p>",
                    next: 'step-3W'
                },
                {
                    text: 'Action: Redirectors automatically fix references after a certain amount of time.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Redirectors don't auto-fix. You need to manually run the \"Fix Up Redirectors\" command.</p>",
                    next: 'step-3M'
                },
                {
                    text: 'Action: Redirectors are just informational - you still need to manually update all references.',
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
                    text: 'Action: Right-click on the folder containing redirectors and select <strong>Fix Up Redirectors in Folder</strong>.',
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
                    text: 'Action: Right-click on the folder containing redirectors and select <strong>Fix Up Redirectors in Folder</strong>.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Correct! This command updates all references to point to the new locations.</p>",
                    next: 'step-4'
                }
            ]
        },

        'step-4': {
            skill: 'assetmanagement',
            title: 'Step 4: Using Fix Up Redirectors',
            prompt: "<p>You right-click on the <code>/Game/OldAssets/</code> folder and see the option <strong>Fix Up Redirectors in Folder</strong>. This command will scan all assets in the project and update references to point directly to the new asset locations.</p><strong>What should you do before running this command?</strong>",
            choices: [
                {
                    text: 'Action: Save all unsaved assets and consider making a backup, then run <strong>Fix Up Redirectors in Folder</strong>.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Smart! This is a project-wide operation, so it's good to save first. The command runs and updates hundreds of references automatically.</p>",
                    next: 'step-5'
                },
                {
                    text: 'Action: Just run the command immediately without saving.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> The command works, but it's always safer to save first before running project-wide operations.</p>",
                    next: 'step-5'
                },
                {
                    text: 'Action: Manually fix each redirector one by one instead of using the folder command.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> This is unnecessarily tedious. The folder command handles all redirectors at once.</p>",
                    next: 'step-4M'
                },
                {
                    text: 'Action: Delete the redirectors manually without fixing them up.',
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
                    text: 'Action: Restore from backup, then properly use <strong>Fix Up Redirectors</strong> before deleting anything.',
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
                    text: 'Action: Use <strong>Fix Up Redirectors in Folder</strong> to handle all of them at once.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Much better! The command completes in seconds.</p>",
                    next: 'step-5'
                }
            ]
        },

        'step-5': {
            skill: 'assetmanagement',
            title: 'Step 5: Verifying Material Fixes',
            prompt: "<p>The <strong>Fix Up Redirectors</strong> command completed successfully. The Output Log shows that it updated references in 47 assets. You open the level and notice that most meshes now display their materials correctly!</p><strong>How can you verify that all material references are properly fixed?</strong>",
            choices: [
                {
                    text: 'Action: Check the meshes in the level and use the <strong>Reference Viewer</strong> on a few materials to confirm they're being referenced from the new location.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Good verification! The Reference Viewer shows that materials are now correctly referenced from <code>/Game/Organized/</code>.</p>",
                    next: 'step-6'
                },
                {
                    text: 'Action: Just assume everything is fixed and move on.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Always verify your fixes! You might have missed something.</p>",
                    next: 'step-6'
                },
                {
                    text: 'Action: Check only one or two meshes and assume the rest are fine.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Spot-checking is better than nothing, but a more thorough verification is recommended for critical fixes.</p>",
                    next: 'step-6'
                },
                {
                    text: 'Action: Run the Fix Up Redirectors command again to be sure.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Running it again won't hurt, but it's unnecessary. The command is thorough the first time.</p>",
                    next: 'step-6'
                }
            ]
        },

        'step-6': {
            skill: 'assetmanagement',
            title: 'Step 6: Blueprint Reference Issues',
            prompt: "<p>The materials look great, but when you test the level in PIE, the Level Blueprint still throws an error: <code>Error: Accessed None trying to read property 'ParticleSystem'</code>. The Blueprint is trying to spawn a particle system that it can't find.</p><strong>Why might the Blueprint still have broken references even after fixing up redirectors?</strong>",
            choices: [
                {
                    text: 'Action: Blueprints sometimes need to be <strong>recompiled</strong> after reference changes to refresh their internal dependencies.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Exactly! Blueprints cache references, and recompiling forces them to reload. Open the Level Blueprint and click <strong>Compile</strong>.</p>",
                    next: 'step-7'
                },
                {
                    text: 'Action: The Fix Up Redirectors command doesn't work on Blueprints - you need to manually re-assign the particle system reference.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Fix Up Redirectors does work on Blueprints, but sometimes they need a recompile to refresh. Try that first before manual fixes.</p>",
                    next: 'step-7'
                },
                {
                    text: 'Action: The particle system asset must have been deleted during the move.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> The asset wasn't deleted - it was moved. Check if the Blueprint just needs a recompile.</p>",
                    next: 'step-6M'
                },
                {
                    text: 'Action: Blueprints are incompatible with redirectors - you need to recreate the Blueprint from scratch.',
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
                    text: 'Action: Open the Level Blueprint and click <strong>Compile</strong> to refresh its references.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Perfect! Recompiling forces the Blueprint to reload all its references.</p>",
                    next: 'step-7'
                }
            ]
        },

        'step-7': {
            skill: 'assetmanagement',
            title: 'Step 7: Recompiling the Blueprint',
            prompt: "<p>You open the Level Blueprint and click the <strong>Compile</strong> button. The Blueprint recompiles successfully, and the error disappears! The particle system reference is now properly resolved to the new location.</p><strong>What should you do next to ensure the fix works?</strong>",
            choices: [
                {
                    text: 'Action: Test in <strong>PIE (Play In Editor)</strong> and trigger the Blueprint event that spawns the particle system.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Excellent! You test the level, trigger the event, and the particle system spawns correctly. The fix works!</p>",
                    next: 'step-8'
                },
                {
                    text: 'Action: Assume the compile fixed everything and mark the task as complete.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Always test your fixes! Compiling removes the error, but you should verify the functionality works.</p>",
                    next: 'step-8'
                },
                {
                    text: 'Action: Check the Output Log for any remaining warnings.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Good practice, but actually running the game is the best verification.</p>",
                    next: 'step-8'
                },
                {
                    text: 'Action: Recompile all Blueprints in the project to be safe.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> This isn't necessary unless other Blueprints are also broken. Test this one first.</p>",
                    next: 'step-8'
                }
            ]
        },

        'step-8': {
            skill: 'assetmanagement',
            title: 'Step 8: Cleanup - Removing Old Folders',
            prompt: "<p>Everything works! The materials display correctly, and the particle system spawns as expected. Now you notice that the old <code>/Game/OldAssets/</code> folder is empty except for the redirectors, which have been fixed up.</p><strong>What should you do with the old folder and redirectors?</strong>",
            choices: [
                {
                    text: 'Action: Delete the redirectors and the empty <code>/Game/OldAssets/</code> folder to clean up the Content Browser.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Perfect! After fixing up redirectors, they're safe to delete. Removing empty folders keeps your project organized.</p>",
                    next: 'step-9'
                },
                {
                    text: 'Action: Keep the redirectors in case you need to revert the changes later.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> Once redirectors are fixed up, all references point directly to the new locations. The redirectors are no longer needed and should be removed.</p>",
                    next: 'step-8M'
                },
                {
                    text: 'Action: Keep the empty folder for organizational purposes.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Empty folders can cause confusion. It's better to remove them unless you plan to use them soon.</p>",
                    next: 'step-9'
                },
                {
                    text: 'Action: Leave everything as-is to avoid breaking anything.',
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
                    text: 'Action: Delete the redirectors and empty folder now.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Good! The project is now clean and organized.</p>",
                    next: 'step-9'
                }
            ]
        },

        'step-9': {
            skill: 'assetmanagement',
            title: 'Step 9: Final Validation',
            prompt: "<p>You've deleted the redirectors and the empty <code>/Game/OldAssets/</code> folder. The Content Browser is now clean and organized. Before you mark this task as complete, you want to do a final comprehensive test.</p><strong>What's the best way to validate that everything is working correctly?</strong>",
            choices: [
                {
                    text: 'Action: Run a full PIE test, check all affected meshes and Blueprints, and verify the Output Log shows no asset errors.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Excellent! Everything works perfectly. Materials display correctly, the particle system spawns, and there are no errors in the log. The folder reorganization is complete!</p>",
                    next: 'step-10'
                },
                {
                    text: 'Action: Just check the Output Log for errors.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> The log is clean, but actually running the game provides better validation.</p>",
                    next: 'step-10'
                },
                {
                    text: 'Action: Ask another developer to test it.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> It's good to get a second opinion, but you should do your own comprehensive testing first.</p>",
                    next: 'step-10'
                },
                {
                    text: 'Action: Assume everything is fine since there were no errors during cleanup.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Always test! Assumptions lead to bugs in production.</p>",
                    next: 'step-10'
                }
            ]
        },

        'step-10': {
            skill: 'assetmanagement',
            title: 'Step 10: Documentation and Best Practices',
            prompt: "<p>Everything is working perfectly! Before you finish, you want to document what you learned for future reference and share best practices with the team.</p><strong>What's the most important lesson from this experience?</strong>",
            choices: [
                {
                    text: 'Action: Document the proper workflow: Move assets → Enable \"Show Redirectors\" → Fix Up Redirectors in Folder → Recompile affected Blueprints → Delete redirectors and empty folders.',
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Perfect! You create a wiki page documenting this workflow. Future folder reorganizations will be much smoother. Task complete!</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: Tell the team to never reorganize folders because it's too risky.',
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Folder organization is important for project health! The proper lesson is to use the correct workflow, not to avoid organization entirely.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: Document that redirectors should always be kept permanently.',
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> No, redirectors should be fixed up and removed. Keeping them causes clutter and potential performance issues.</p>",
                    next: 'conclusion'
                },
                {
                    text: 'Action: Document the issue but don't share the solution with the team.',
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Sharing knowledge helps the whole team avoid similar issues. Always document and share!</p>",
                    next: 'conclusion'
                }
            ]
        }
    }
};
"""

def main():
    import sys
    from pathlib import Path
    
    # Get the scenario file path
    script_dir = Path(__file__).parent
    scenario_file = script_dir.parent.parent / 'scenarios' / 'assetmanagement_beginner.js'
    
    print(f"Expanding scenario: {scenario_file}")
    print(f"Creating backup...")
    
    # Create backup
    backup_file = scenario_file.with_suffix('.js.bak')
    with open(scenario_file, 'r', encoding='utf-8') as f:
        original_content = f.read()
    
    with open(backup_file, 'w', encoding='utf-8') as f:
        f.write(original_content)
    
    print(f"Backup created: {backup_file}")
    print(f"Writing expanded scenario...")
    
    # Write expanded scenario
    with open(scenario_file, 'w', encoding='utf-8') as f:
        f.write(EXPANDED_SCENARIO)
    
    print(f"✓ Expansion complete!")
    print(f"  - Original backed up to: {backup_file}")
    print(f"  - Expanded scenario written to: {scenario_file}")
    print(f"  - New step count: 10 main steps + 6 dead-end steps = 16 total steps")

if __name__ == '__main__':
    main()
