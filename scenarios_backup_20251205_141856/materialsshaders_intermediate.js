window.SCENARIOS['TranslucencySortingIssue'] = {
    meta: {
        expanded: true,
        title: "Glass Sorting Incorrectly",
        description: "Objects behind glass disappear. Investigates Translucency Sort Priority and Blend Modes.",
        estimateHours: 1.5,
        category: "Materials"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'materials',
            title: 'The Symptom',
            prompt: "Your glass material is set to Translucent, and in-game some objects behind it either disappear, pop in and out, or appear in front of the glass when they clearly should be behind. Translucent sorting looks wrong. What do you check first?",
            choices: [
                {
                    text: "Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "You switch to buffer visualization and translucency view modes and confirm the glass is a standard Translucent material. You can see that different translucent objects fight for draw order depending on camera angle, which points to a translucency sorting / priority issue rather than a bad mesh or texture.",
                    next: 'step-inv-1'
                },
                {
                    text: "Wrong Guess]",
                    type: 'wrong',
                    feedback: "You try reimporting meshes and tweaking collision, but nothing changes--the glass still causes objects behind it to vanish or appear in front. This clearly isn't a simple mesh or collision problem.",
                    next: 'step-1W'
                }
            ]
        },
        'step-1W': {
            skill: 'materials',
            title: 'Dead End: Wrong Guess',
            prompt: "You chased mesh and collision issues, but the visual glitch only happens with translucent materials and depends on camera angle.",
            choices: [
                {
                    text: "Revert and try again]",
                    type: 'correct',
                    feedback: "You undo the unnecessary mesh changes and refocus on how Unreal sorts translucent materials and what options exist to control that order.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-2': {
            skill: 'materials',
            title: 'Investigation',
            prompt: "You open the glass material and actor details to see how translucency is configured and how the engine is sorting it relative to other objects. What do you find?",
            choices: [
                {
                    text: "Identify Root Cause]",
                    type: 'correct',
                    feedback: "You confirm the material uses the Translucent blend mode with default settings and no special sorting overrides. The affected meshes all share similar bounds and distance from the camera, so the engine's default translucency sorting order is ambiguous. Because Translucent blend mode has inherent sorting limitations, the glass occasionally draws in the wrong order with other geometry behind it.",
                    next: 'step-3'
                },
                {
                    text: "Misguided Attempt]",
                    type: 'misguided',
                    feedback: "You try changing roughness, refraction, and color, but the popping and incorrect overlap still happen. These parameters don't change how the renderer sorts translucent primitives.",
                    next: 'step-2M'
                }
            ]
        },
        'step-2M': {
            skill: 'materials',
            title: 'Dead End: Misguided',
            prompt: "Those shading tweaks didn't help because the problem isn't how the glass looks, it's when and where it's drawn relative to other translucent objects.",
            choices: [
                {
                    text: "Realize mistake]",
                    type: 'correct',
                    feedback: "You realize you must adjust the translucency sorting controls--such as Translucency Sort Priority or Render After DOF--or switch to a more appropriate translucency model for thin glass.",
                    next: 'step-3'
                }
            ]
        },
        'step-3': {
            skill: 'materials',
            title: 'The Fix',
            prompt: "You now know the issue is the default sorting of Translucent materials. How do you fix the glass so objects behind it render in the correct order?",
            choices: [
                {
                    text: "Enable \'Render After DOF\' or adjust Sort Priority.]",
                    type: 'correct',
                    feedback: "In the material and mesh details, you enable \"Render After DOF\" so the glass is drawn at a more appropriate stage, and you raise the Translucency Sort Priority on the window meshes so they consistently render in front of background objects but behind foreground ones. Where suitable, you also switch the shading model to Thin Translucent for better glass behavior. After recompiling, the sorting issues are gone from normal gameplay views.",
                    next: 'step-4'
                }
            ]
        },
        'step-4': {
            skill: 'materials',
            title: 'Verification',
            prompt: "You test the scene again in PIE, moving the camera around and looking through the glass at various objects behind it. How do you verify the fix?",
            choices: [
                {
                    text: "Play in Editor]",
                    type: 'correct',
                    feedback: "In PIE, objects behind the glass now render consistently in the correct order as you move the camera. They no longer disappear or pop in front of the glass, confirming that adjusting Render After DOF / Translucency Sort Priority (and using Thin Translucent where appropriate) fixed the sorting problem.",
                    next: 'step-inv-1'
                }
            ]
        },
        'step-inv-1': {
            skill: 'materials',
            title: 'Deeper Dive into Sorting Policy',
            prompt: "You've confirmed it's a sorting issue. Before changing anything, you want to understand how Unreal Engine is currently deciding the draw order for translucent objects. What console command can you use to inspect the active translucency sorting method?",
            choices: [
                {
                    text: "Use r.Translucency.SortPolicy]",
                    type: 'correct',
                    feedback: "You use `r.Translucency.SortPolicy` in the console and see it's set to 'Distance' (default), meaning objects are sorted by their distance from the camera. This confirms the engine is attempting to sort, but due to overlapping bounds or similar distances, it's failing for your specific glass setup.",
                    next: 'step-inv-2'
                },
                {
                    text: "Use stat gpu]",
                    type: 'wrong',
                    feedback: "While `stat gpu` is useful for performance, it won't tell you *how* translucency is being sorted. You need a command specific to rendering policies.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'materials',
            title: 'Dead End: Wrong Console Command',
            prompt: "You used `stat gpu` but it didn't provide insight into the translucency sorting policy. What command should you use instead?",
            choices: [
                {
                    text: "Correct to r.Translucency.SortPolicy]",
                    type: 'correct',
                    feedback: "You correct your command to `r.Translucency.SortPolicy` and confirm the default 'Distance' sorting policy.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'materials',
            title: 'Visualizing Translucency Sorting',
            prompt: "Knowing the sorting policy, you want to visually confirm where the sorting breaks down. How can you visualize the translucent draw order in the editor to pinpoint the problematic areas?",
            choices: [
                {
                    text: "Use 'Translucency Sort Priority' view mode or ShowFlag.TranslucencySortPolicy]",
                    type: 'correct',
                    feedback: "You enable the 'Translucency Sort Priority' view mode (or use `ShowFlag.TranslucencySortPolicy` in the console) and observe the scene. You clearly see areas where the glass and objects behind it have conflicting or ambiguous sort priorities, leading to the popping effect. This visual confirmation is crucial.",
                    next: 'step-red-herring'
                },
                {
                    text: "Use Wireframe view mode]",
                    type: 'wrong',
                    feedback: "Wireframe view mode helps with geometry inspection but doesn't show how translucent objects are sorted. You need a view mode specific to rendering order.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'materials',
            title: 'Dead End: Incorrect View Mode',
            prompt: "Wireframe didn't help. You need a view mode that specifically highlights translucency sorting. What's the correct approach?",
            choices: [
                {
                    text: "Enable 'Translucency Sort Priority' view mode]",
                    type: 'correct',
                    feedback: "You switch to the 'Translucency Sort Priority' view mode and immediately see the sorting conflicts.",
                    next: 'step-red-herring'
                },
            ]
        },

        'step-red-herring': {
            skill: 'materials',
            title: 'Red Herring - Mesh Bounds & Pivot',
            prompt: "Seeing the sorting issues, you wonder if the mesh's physical properties are confusing the engine. You decide to try adjusting the glass mesh's pivot point and scaling its bounds slightly, hoping to give the engine a clearer 'center' for sorting. Does this help?",
            choices: [
                {
                    text: "Adjust mesh pivot/bounds]",
                    type: 'wrong',
                    feedback: "You adjust the mesh's pivot and bounds, re-export, and reimport. While these properties can affect other aspects of rendering or interaction, they have no direct impact on the engine's translucency sorting algorithm, which primarily relies on material settings, distance, and explicit sort priorities. The issue persists.",
                    next: 'step-red-herring-W'
                },
                {
                    text: "Realize this is a red herring and focus on material/actor settings]",
                    type: 'correct',
                    feedback: "You quickly realize that mesh pivots and bounds are not the root cause of translucency sorting. You need to focus on material and actor properties that directly control rendering order.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-red-herring-W': {
            skill: 'materials',
            title: 'Dead End: Mesh Properties Don\\'t Sort Translucency',
            prompt: "Adjusting mesh pivots and bounds didn't resolve the sorting. You need to focus on properties that directly influence how translucent materials are drawn relative to each other. What's the next logical step?",
            choices: [
                {
                    text: "Re-evaluate material and actor translucency settings]",
                    type: 'correct',
                    feedback: "You discard the unnecessary mesh changes and return to investigating the material and actor settings for translucency, knowing that's where the solution lies.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'materials',
            title: 'Standalone Build Verification',
            prompt: "The fix works in PIE, but sometimes rendering differences can occur in packaged builds. How do you ensure the translucency sorting fix holds up in a production-like environment?",
            choices: [
                {
                    text: "Launch a Standalone Game or Packaged Build]",
                    type: 'correct',
                    feedback: "You launch the game in a Standalone Game window or create a small packaged build. Testing in this environment confirms that the sorting issues are consistently resolved, ensuring the fix is robust for end-users.",
                    next: 'step-ver-2'
                },
                {
                    text: "Check for shader compile errors]",
                    type: 'wrong',
                    feedback: "While important, checking for shader compile errors won't verify the visual sorting in a standalone build. You need to actually run the game outside of the editor.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'materials',
            title: 'Dead End: Incomplete Verification',
            prompt: "Checking for shader errors is good, but you haven't confirmed the visual fix in a standalone environment. What's the critical next step?",
            choices: [
                {
                    text: "Launch a Standalone Game]",
                    type: 'correct',
                    feedback: "You launch a Standalone Game and visually confirm the sorting is correct.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'materials',
            title: 'Performance Impact Check',
            prompt: "You've fixed the visual sorting, but sometimes changing rendering settings can impact performance. How do you quickly check if your changes (like enabling 'Render After DOF' or using Thin Translucent) have introduced any unexpected performance overhead?",
            choices: [
                {
                    text: "Use stat unit and stat gpu console commands]",
                    type: 'correct',
                    feedback: "You use `stat unit` and `stat gpu` in the console while observing the scene. You confirm that the frame rate, game thread, draw thread, and GPU times remain within acceptable limits, indicating no significant performance regression from the translucency sorting adjustments.",
                    next: 'step-ver-1'
                },
                {
                    text: "Re-check material parameters]",
                    type: 'wrong',
                    feedback: "Re-checking material parameters won't tell you about performance. You need specific console commands to profile rendering.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'materials',
            title: 'Dead End: No Performance Check',
            prompt: "You've verified the visual fix, but haven't checked for performance impact. What commands are essential for this?",
            choices: [
                {
                    text: "Use stat unit and stat gpu]",
                    type: 'correct',
                    feedback: "You use `stat unit` and `stat gpu` to confirm no performance regressions.",
                    next: 'step-ver-1'
                },
            ]
        },

        
        'step-inv-1': {
            skill: 'materials',
            title: 'Deeper Dive into Sorting Policy',
            prompt: "You've confirmed it's a sorting issue. Before changing anything, you want to understand how Unreal Engine is currently deciding the draw order for translucent objects. What console command can you use to inspect the active translucency sorting method?",
            choices: [
                {
                    text: "Use r.Translucency.SortPolicy]",
                    type: 'correct',
                    feedback: "You use `r.Translucency.SortPolicy` in the console and see it's set to 'Distance' (default), meaning objects are sorted by their distance from the camera. This confirms the engine is attempting to sort, but due to overlapping bounds or similar distances, it's failing for your specific glass setup.",
                    next: 'step-inv-2'
                },
                {
                    text: "Use stat gpu]",
                    type: 'wrong',
                    feedback: "While `stat gpu` is useful for performance, it won't tell you *how* translucency is being sorted. You need a command specific to rendering policies.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'materials',
            title: 'Dead End: Wrong Console Command',
            prompt: "You used `stat gpu` but it didn't provide insight into the translucency sorting policy. What command should you use instead?",
            choices: [
                {
                    text: "Correct to r.Translucency.SortPolicy]",
                    type: 'correct',
                    feedback: "You correct your command to `r.Translucency.SortPolicy` and confirm the default 'Distance' sorting policy.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'materials',
            title: 'Visualizing Translucency Sorting',
            prompt: "Knowing the sorting policy, you want to visually confirm where the sorting breaks down. How can you visualize the translucent draw order in the editor to pinpoint the problematic areas?",
            choices: [
                {
                    text: "Use 'Translucency Sort Priority' view mode or ShowFlag.TranslucencySortPolicy]",
                    type: 'correct',
                    feedback: "You enable the 'Translucency Sort Priority' view mode (or use `ShowFlag.TranslucencySortPolicy` in the console) and observe the scene. You clearly see areas where the glass and objects behind it have conflicting or ambiguous sort priorities, leading to the popping effect. This visual confirmation is crucial.",
                    next: 'step-red-herring'
                },
                {
                    text: "Use Wireframe view mode]",
                    type: 'wrong',
                    feedback: "Wireframe view mode helps with geometry inspection but doesn't show how translucent objects are sorted. You need a view mode specific to rendering order.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'materials',
            title: 'Dead End: Incorrect View Mode',
            prompt: "Wireframe didn't help. You need a view mode that specifically highlights translucency sorting. What's the correct approach?",
            choices: [
                {
                    text: "Enable 'Translucency Sort Priority' view mode]",
                    type: 'correct',
                    feedback: "You switch to the 'Translucency Sort Priority' view mode and immediately see the sorting conflicts.",
                    next: 'step-red-herring'
                },
            ]
        },

        'step-red-herring': {
            skill: 'materials',
            title: 'Red Herring - Mesh Bounds & Pivot',
            prompt: "Seeing the sorting issues, you wonder if the mesh's physical properties are confusing the engine. You decide to try adjusting the glass mesh's pivot point and scaling its bounds slightly, hoping to give the engine a clearer 'center' for sorting. Does this help?",
            choices: [
                {
                    text: "Adjust mesh pivot/bounds]",
                    type: 'wrong',
                    feedback: "You adjust the mesh's pivot and bounds, re-export, and reimport. While these properties can affect other aspects of rendering or interaction, they have no direct impact on the engine's translucency sorting algorithm, which primarily relies on material settings, distance, and explicit sort priorities. The issue persists.",
                    next: 'step-red-herring-W'
                },
                {
                    text: "Realize this is a red herring and focus on material/actor settings]",
                    type: 'correct',
                    feedback: "You quickly realize that mesh pivots and bounds are not the root cause of translucency sorting. You need to focus on material and actor properties that directly control rendering order.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-red-herring-W': {
            skill: 'materials',
            title: 'Dead End: Mesh Properties Don\\'t Sort Translucency',
            prompt: "Adjusting mesh pivots and bounds didn't resolve the sorting. You need to focus on properties that directly influence how translucent materials are drawn relative to each other. What's the next logical step?",
            choices: [
                {
                    text: "Re-evaluate material and actor translucency settings]",
                    type: 'correct',
                    feedback: "You discard the unnecessary mesh changes and return to investigating the material and actor settings for translucency, knowing that's where the solution lies.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'materials',
            title: 'Standalone Build Verification',
            prompt: "The fix works in PIE, but sometimes rendering differences can occur in packaged builds. How do you ensure the translucency sorting fix holds up in a production-like environment?",
            choices: [
                {
                    text: "Launch a Standalone Game or Packaged Build]",
                    type: 'correct',
                    feedback: "You launch the game in a Standalone Game window or create a small packaged build. Testing in this environment confirms that the sorting issues are consistently resolved, ensuring the fix is robust for end-users.",
                    next: 'step-ver-2'
                },
                {
                    text: "Check for shader compile errors]",
                    type: 'wrong',
                    feedback: "While important, checking for shader compile errors won't verify the visual sorting in a standalone build. You need to actually run the game outside of the editor.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'materials',
            title: 'Dead End: Incomplete Verification',
            prompt: "Checking for shader errors is good, but you haven't confirmed the visual fix in a standalone environment. What's the critical next step?",
            choices: [
                {
                    text: "Launch a Standalone Game]",
                    type: 'correct',
                    feedback: "You launch a Standalone Game and visually confirm the sorting is correct.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'materials',
            title: 'Performance Impact Check',
            prompt: "You've fixed the visual sorting, but sometimes changing rendering settings can impact performance. How do you quickly check if your changes (like enabling 'Render After DOF' or using Thin Translucent) have introduced any unexpected performance overhead?",
            choices: [
                {
                    text: "Use stat unit and stat gpu console commands]",
                    type: 'correct',
                    feedback: "You use `stat unit` and `stat gpu` in the console while observing the scene. You confirm that the frame rate, game thread, draw thread, and GPU times remain within acceptable limits, indicating no significant performance regression from the translucency sorting adjustments.",
                    next: 'step-ver-1'
                },
                {
                    text: "Re-check material parameters]",
                    type: 'wrong',
                    feedback: "Re-checking material parameters won't tell you about performance. You need specific console commands to profile rendering.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'materials',
            title: 'Dead End: No Performance Check',
            prompt: "You've verified the visual fix, but haven't checked for performance impact. What commands are essential for this?",
            choices: [
                {
                    text: "Use stat unit and stat gpu]",
                    type: 'correct',
                    feedback: "You use `stat unit` and `stat gpu` to confirm no performance regressions.",
                    next: 'step-ver-1'
                },
            ]
        },

        'conclusion'
                }
            ]
        },
        
        'step-inv-1': {
            skill: 'materials',
            title: 'Deeper Dive into Sorting Policy',
            prompt: "You've confirmed it's a sorting issue. Before changing anything, you want to understand how Unreal Engine is currently deciding the draw order for translucent objects. What console command can you use to inspect the active translucency sorting method?",
            choices: [
                {
                    text: "Use r.Translucency.SortPolicy]",
                    type: 'correct',
                    feedback: "You use `r.Translucency.SortPolicy` in the console and see it's set to 'Distance' (default), meaning objects are sorted by their distance from the camera. This confirms the engine is attempting to sort, but due to overlapping bounds or similar distances, it's failing for your specific glass setup.",
                    next: 'step-inv-2'
                },
                {
                    text: "Use stat gpu]",
                    type: 'wrong',
                    feedback: "While `stat gpu` is useful for performance, it won't tell you *how* translucency is being sorted. You need a command specific to rendering policies.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'materials',
            title: 'Dead End: Wrong Console Command',
            prompt: "You used `stat gpu` but it didn't provide insight into the translucency sorting policy. What command should you use instead?",
            choices: [
                {
                    text: "Correct to r.Translucency.SortPolicy]",
                    type: 'correct',
                    feedback: "You correct your command to `r.Translucency.SortPolicy` and confirm the default 'Distance' sorting policy.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'materials',
            title: 'Visualizing Translucency Sorting',
            prompt: "Knowing the sorting policy, you want to visually confirm where the sorting breaks down. How can you visualize the translucent draw order in the editor to pinpoint the problematic areas?",
            choices: [
                {
                    text: "Use 'Translucency Sort Priority' view mode or ShowFlag.TranslucencySortPolicy]",
                    type: 'correct',
                    feedback: "You enable the 'Translucency Sort Priority' view mode (or use `ShowFlag.TranslucencySortPolicy` in the console) and observe the scene. You clearly see areas where the glass and objects behind it have conflicting or ambiguous sort priorities, leading to the popping effect. This visual confirmation is crucial.",
                    next: 'step-red-herring'
                },
                {
                    text: "Use Wireframe view mode]",
                    type: 'wrong',
                    feedback: "Wireframe view mode helps with geometry inspection but doesn't show how translucent objects are sorted. You need a view mode specific to rendering order.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'materials',
            title: 'Dead End: Incorrect View Mode',
            prompt: "Wireframe didn't help. You need a view mode that specifically highlights translucency sorting. What's the correct approach?",
            choices: [
                {
                    text: "Enable 'Translucency Sort Priority' view mode]",
                    type: 'correct',
                    feedback: "You switch to the 'Translucency Sort Priority' view mode and immediately see the sorting conflicts.",
                    next: 'step-red-herring'
                },
            ]
        },

        'step-red-herring': {
            skill: 'materials',
            title: 'Red Herring - Mesh Bounds & Pivot',
            prompt: "Seeing the sorting issues, you wonder if the mesh's physical properties are confusing the engine. You decide to try adjusting the glass mesh's pivot point and scaling its bounds slightly, hoping to give the engine a clearer 'center' for sorting. Does this help?",
            choices: [
                {
                    text: "Adjust mesh pivot/bounds]",
                    type: 'wrong',
                    feedback: "You adjust the mesh's pivot and bounds, re-export, and reimport. While these properties can affect other aspects of rendering or interaction, they have no direct impact on the engine's translucency sorting algorithm, which primarily relies on material settings, distance, and explicit sort priorities. The issue persists.",
                    next: 'step-red-herring-W'
                },
                {
                    text: "Realize this is a red herring and focus on material/actor settings]",
                    type: 'correct',
                    feedback: "You quickly realize that mesh pivots and bounds are not the root cause of translucency sorting. You need to focus on material and actor properties that directly control rendering order.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-red-herring-W': {
            skill: 'materials',
            title: 'Dead End: Mesh Properties Don\\'t Sort Translucency',
            prompt: "Adjusting mesh pivots and bounds didn't resolve the sorting. You need to focus on properties that directly influence how translucent materials are drawn relative to each other. What's the next logical step?",
            choices: [
                {
                    text: "Re-evaluate material and actor translucency settings]",
                    type: 'correct',
                    feedback: "You discard the unnecessary mesh changes and return to investigating the material and actor settings for translucency, knowing that's where the solution lies.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'materials',
            title: 'Standalone Build Verification',
            prompt: "The fix works in PIE, but sometimes rendering differences can occur in packaged builds. How do you ensure the translucency sorting fix holds up in a production-like environment?",
            choices: [
                {
                    text: "Launch a Standalone Game or Packaged Build]",
                    type: 'correct',
                    feedback: "You launch the game in a Standalone Game window or create a small packaged build. Testing in this environment confirms that the sorting issues are consistently resolved, ensuring the fix is robust for end-users.",
                    next: 'step-ver-2'
                },
                {
                    text: "Check for shader compile errors]",
                    type: 'wrong',
                    feedback: "While important, checking for shader compile errors won't verify the visual sorting in a standalone build. You need to actually run the game outside of the editor.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'materials',
            title: 'Dead End: Incomplete Verification',
            prompt: "Checking for shader errors is good, but you haven't confirmed the visual fix in a standalone environment. What's the critical next step?",
            choices: [
                {
                    text: "Launch a Standalone Game]",
                    type: 'correct',
                    feedback: "You launch a Standalone Game and visually confirm the sorting is correct.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'materials',
            title: 'Performance Impact Check',
            prompt: "You've fixed the visual sorting, but sometimes changing rendering settings can impact performance. How do you quickly check if your changes (like enabling 'Render After DOF' or using Thin Translucent) have introduced any unexpected performance overhead?",
            choices: [
                {
                    text: "Use stat unit and stat gpu console commands]",
                    type: 'correct',
                    feedback: "You use `stat unit` and `stat gpu` in the console while observing the scene. You confirm that the frame rate, game thread, draw thread, and GPU times remain within acceptable limits, indicating no significant performance regression from the translucency sorting adjustments.",
                    next: 'step-ver-1'
                },
                {
                    text: "Re-check material parameters]",
                    type: 'wrong',
                    feedback: "Re-checking material parameters won't tell you about performance. You need specific console commands to profile rendering.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'materials',
            title: 'Dead End: No Performance Check',
            prompt: "You've verified the visual fix, but haven't checked for performance impact. What commands are essential for this?",
            choices: [
                {
                    text: "Use stat unit and stat gpu]",
                    type: 'correct',
                    feedback: "You use `stat unit` and `stat gpu` to confirm no performance regressions.",
                    next: 'step-ver-1'
                },
            ]
        },

        
        'step-inv-1': {
            skill: 'materials',
            title: 'Deeper Dive into Sorting Policy',
            prompt: "You've confirmed it's a sorting issue. Before changing anything, you want to understand how Unreal Engine is currently deciding the draw order for translucent objects. What console command can you use to inspect the active translucency sorting method?",
            choices: [
                {
                    text: "Use r.Translucency.SortPolicy]",
                    type: 'correct',
                    feedback: "You use `r.Translucency.SortPolicy` in the console and see it's set to 'Distance' (default), meaning objects are sorted by their distance from the camera. This confirms the engine is attempting to sort, but due to overlapping bounds or similar distances, it's failing for your specific glass setup.",
                    next: 'step-inv-2'
                },
                {
                    text: "Use stat gpu]",
                    type: 'wrong',
                    feedback: "While `stat gpu` is useful for performance, it won't tell you *how* translucency is being sorted. You need a command specific to rendering policies.",
                    next: 'step-inv-1W'
                },
            ]
        },

        'step-inv-1W': {
            skill: 'materials',
            title: 'Dead End: Wrong Console Command',
            prompt: "You used `stat gpu` but it didn't provide insight into the translucency sorting policy. What command should you use instead?",
            choices: [
                {
                    text: "Correct to r.Translucency.SortPolicy]",
                    type: 'correct',
                    feedback: "You correct your command to `r.Translucency.SortPolicy` and confirm the default 'Distance' sorting policy.",
                    next: 'step-inv-2'
                },
            ]
        },

        'step-inv-2': {
            skill: 'materials',
            title: 'Visualizing Translucency Sorting',
            prompt: "Knowing the sorting policy, you want to visually confirm where the sorting breaks down. How can you visualize the translucent draw order in the editor to pinpoint the problematic areas?",
            choices: [
                {
                    text: "Use 'Translucency Sort Priority' view mode or ShowFlag.TranslucencySortPolicy]",
                    type: 'correct',
                    feedback: "You enable the 'Translucency Sort Priority' view mode (or use `ShowFlag.TranslucencySortPolicy` in the console) and observe the scene. You clearly see areas where the glass and objects behind it have conflicting or ambiguous sort priorities, leading to the popping effect. This visual confirmation is crucial.",
                    next: 'step-red-herring'
                },
                {
                    text: "Use Wireframe view mode]",
                    type: 'wrong',
                    feedback: "Wireframe view mode helps with geometry inspection but doesn't show how translucent objects are sorted. You need a view mode specific to rendering order.",
                    next: 'step-inv-2W'
                },
            ]
        },

        'step-inv-2W': {
            skill: 'materials',
            title: 'Dead End: Incorrect View Mode',
            prompt: "Wireframe didn't help. You need a view mode that specifically highlights translucency sorting. What's the correct approach?",
            choices: [
                {
                    text: "Enable 'Translucency Sort Priority' view mode]",
                    type: 'correct',
                    feedback: "You switch to the 'Translucency Sort Priority' view mode and immediately see the sorting conflicts.",
                    next: 'step-red-herring'
                },
            ]
        },

        'step-red-herring': {
            skill: 'materials',
            title: 'Red Herring - Mesh Bounds & Pivot',
            prompt: "Seeing the sorting issues, you wonder if the mesh's physical properties are confusing the engine. You decide to try adjusting the glass mesh's pivot point and scaling its bounds slightly, hoping to give the engine a clearer 'center' for sorting. Does this help?",
            choices: [
                {
                    text: "Adjust mesh pivot/bounds]",
                    type: 'wrong',
                    feedback: "You adjust the mesh's pivot and bounds, re-export, and reimport. While these properties can affect other aspects of rendering or interaction, they have no direct impact on the engine's translucency sorting algorithm, which primarily relies on material settings, distance, and explicit sort priorities. The issue persists.",
                    next: 'step-red-herring-W'
                },
                {
                    text: "Realize this is a red herring and focus on material/actor settings]",
                    type: 'correct',
                    feedback: "You quickly realize that mesh pivots and bounds are not the root cause of translucency sorting. You need to focus on material and actor properties that directly control rendering order.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-red-herring-W': {
            skill: 'materials',
            title: 'Dead End: Mesh Properties Don\\'t Sort Translucency',
            prompt: "Adjusting mesh pivots and bounds didn't resolve the sorting. You need to focus on properties that directly influence how translucent materials are drawn relative to each other. What's the next logical step?",
            choices: [
                {
                    text: "Re-evaluate material and actor translucency settings]",
                    type: 'correct',
                    feedback: "You discard the unnecessary mesh changes and return to investigating the material and actor settings for translucency, knowing that's where the solution lies.",
                    next: 'step-inv-1'
                },
            ]
        },

        'step-ver-1': {
            skill: 'materials',
            title: 'Standalone Build Verification',
            prompt: "The fix works in PIE, but sometimes rendering differences can occur in packaged builds. How do you ensure the translucency sorting fix holds up in a production-like environment?",
            choices: [
                {
                    text: "Launch a Standalone Game or Packaged Build]",
                    type: 'correct',
                    feedback: "You launch the game in a Standalone Game window or create a small packaged build. Testing in this environment confirms that the sorting issues are consistently resolved, ensuring the fix is robust for end-users.",
                    next: 'step-ver-2'
                },
                {
                    text: "Check for shader compile errors]",
                    type: 'wrong',
                    feedback: "While important, checking for shader compile errors won't verify the visual sorting in a standalone build. You need to actually run the game outside of the editor.",
                    next: 'step-ver-1W'
                },
            ]
        },

        'step-ver-1W': {
            skill: 'materials',
            title: 'Dead End: Incomplete Verification',
            prompt: "Checking for shader errors is good, but you haven't confirmed the visual fix in a standalone environment. What's the critical next step?",
            choices: [
                {
                    text: "Launch a Standalone Game]",
                    type: 'correct',
                    feedback: "You launch a Standalone Game and visually confirm the sorting is correct.",
                    next: 'step-ver-2'
                },
            ]
        },

        'step-ver-2': {
            skill: 'materials',
            title: 'Performance Impact Check',
            prompt: "You've fixed the visual sorting, but sometimes changing rendering settings can impact performance. How do you quickly check if your changes (like enabling 'Render After DOF' or using Thin Translucent) have introduced any unexpected performance overhead?",
            choices: [
                {
                    text: "Use stat unit and stat gpu console commands]",
                    type: 'correct',
                    feedback: "You use `stat unit` and `stat gpu` in the console while observing the scene. You confirm that the frame rate, game thread, draw thread, and GPU times remain within acceptable limits, indicating no significant performance regression from the translucency sorting adjustments.",
                    next: 'step-ver-1'
                },
                {
                    text: "Re-check material parameters]",
                    type: 'wrong',
                    feedback: "Re-checking material parameters won't tell you about performance. You need specific console commands to profile rendering.",
                    next: 'step-ver-2W'
                },
            ]
        },

        'step-ver-2W': {
            skill: 'materials',
            title: 'Dead End: No Performance Check',
            prompt: "You've verified the visual fix, but haven't checked for performance impact. What commands are essential for this?",
            choices: [
                {
                    text: "Use stat unit and stat gpu]",
                    type: 'correct',
                    feedback: "You use `stat unit` and `stat gpu` to confirm no performance regressions.",
                    next: 'step-ver-1'
                },
            ]
        },

        'conclusion': {
            skill: 'materials',
            title: 'Conclusion',
            prompt: "Lesson: Translucent materials have inherent sorting limitations. When glass appears to draw in the wrong order, use tools like Translucency Sort Priority, Render After DOF, and (where appropriate) the Thin Translucent shading model to control how and when it's rendered so objects behind it display correctly.",
            choices: []
        }
    }
};