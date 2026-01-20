window.SCENARIOS['WorldPartitionDeepDive'] = {
    "meta": {
        "title": "Distant City Fails to Stream In Along Main Road",
        "description": "We are using World Partition for a vast desert environment. A large, complex city model cluster (packaged inside a BP_DesertCity Actor) is located several kilometers from the player start. When the player drives down the main highway directly toward the city, the city mesh and collision never appear, resulting in the player driving through empty landscape, even when they reach the standard streaming distance. However, if the player uses the console (e.g., 'teleport 5000 5000 100') to appear suddenly near the city, it streams in correctly within seconds. The issue only occurs when physically traveling the intended path toward the location.",
        "estimateHours": 3.2,
        "category": "World Partition & Streaming",
        "tokens_used": 11816
    },
    "setup": [
        {
            "action": "set_ue_property",
            "scenario": "WorldPartitionDeepDive",
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
            "scenario": "WorldPartitionDeepDive",
            "step": "final"
        }
    ],
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "worldpartition",
            "title": "Investigate City Actor Streaming",
            "prompt": "<p>The city fails to stream when driving towards it, but teleporting works. Where do you start investigating the city's streaming properties?</p>",
            "choices": [
                {
                    "text": "<p>Open the World Partition window and verify the 'BP_DesertCity' actor's cell assignment and spatial loading status.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.2hrs. This is the correct initial step to confirm the actor is correctly placed and set up for World Partition streaming.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Rebuild all navigation and lighting, assuming data corruption.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.4hrs. This is a common troubleshooting step, but inappropriate here. The problem is specific to streaming, not general data corruption. This wastes valuable time.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Increase the global 'Streaming Distance' for all content in World Settings to an excessively large value.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +1.0hrs. Increasing global streaming distance is a brute-force approach that wastes memory and CPU across the entire world, rather than targeting the specific streaming failure. This will significantly impact performance.</p>",
                    "next": "detour-IncreaseStreamingDistance"
                },
                {
                    "text": "<p>Check the 'Always Loaded' status of the main Persistent Level or the Data Layer cells in the World Partition minimap.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.5hrs. While related to loading, checking 'Always Loaded' on the persistent level or general cells doesn't directly address an actor-specific streaming issue within World Partition. It's too broad.</p>",
                    "next": "step-1"
                }
            ]
        },
        "detour-IncreaseStreamingDistance": {
            "skill": "worldpartition",
            "title": "Global Streaming Distance Impact",
            "prompt": "<p>You increased the global streaming distance. While this might *eventually* load the city, it causes significant performance issues throughout the entire world. What was the correct specific place to look for the city's streaming properties?</p>",
            "choices": [
                {
                    "text": "<p>Return to opening the World Partition window and verifying the 'BP_DesertCity' actor's cell assignment and spatial loading status.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.0hrs. Correct. Global streaming settings are not the solution for targeted streaming issues. You need to investigate the actor directly.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Try rebuilding all level data.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. This is still not addressing the core streaming issue and introduces more wasted time.</p>",
                    "next": "detour-IncreaseStreamingDistance"
                },
                {
                    "text": "<p>Reduce the overall World Partition grid size.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Modifying grid size can have significant performance implications and is not directly related to an actor failing to stream, especially if it streams with teleportation.</p>",
                    "next": "detour-IncreaseStreamingDistance"
                },
                {
                    "text": "<p>Check 'World Composition' settings instead.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. World Composition is an older level streaming system. This project uses World Partition, so looking there is incorrect and wastes time.</p>",
                    "next": "detour-IncreaseStreamingDistance"
                }
            ]
        },
        "step-2": {
            "skill": "worldpartition",
            "title": "Identify City Data Layer",
            "prompt": "<p>The 'BP_DesertCity' is correctly spatially loaded. What's the next step to understand its targeted streaming context?</p>",
            "choices": [
                {
                    "text": "<p>Identify the Data Layer associated with the 'BP_DesertCity' actor, noted as 'DL_City_Assets'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Understanding which Data Layer the city belongs to is crucial for targeted streaming and activation.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Attempt to manually migrate 'BP_DesertCity' to a non-World Partition Level Instance.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.75hrs. This is a drastic measure that completely undermines the World Partition methodology and will break existing level architecture. This is highly disruptive and wastes significant time.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Check the 'Is Editor Only Actor' property on the 'BP_DesertCity'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.15hrs. While important for visibility, an actor being editor-only would prevent it from appearing at all in-game, not just failing to stream. This is a red herring.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Search for other potential 'BP_DesertCity' actors that might be conflicting.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. While good for general debugging, there's no immediate indication of conflicting actors. Focusing on the known problematic actor is more efficient.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "worldpartition",
            "title": "Locate Streaming Source Volume",
            "prompt": "<p>City's Data Layer is 'DL_City_Assets'. It's not streaming when driving. What specific road-side mechanism should be checked next for preloading?</p>",
            "choices": [
                {
                    "text": "<p>Locate the 'World Streaming Source Volume' actor placed along the road intended to preload the city.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.2hrs. Since the problem occurs when driving, a dedicated streaming volume along the path is a logical place to investigate next for preloading.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Delete and recreate the 'BP_DesertCity' actor, hoping it resolves the issue.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.3hrs. Deleting and recreating is a destructive and often unnecessary step without first diagnosing the root cause. This wastes setup time.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Check the 'HLOD Layer' settings for the 'BP_DesertCity' actor.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.25hrs. HLODs deal with performance at distance, but the problem is the city not streaming *at all*, not just its LODs. This is a different aspect of streaming.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Search for any custom Blueprint logic in the level that might be manually triggering streaming.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.3hrs. While possible, checking standard World Partition streaming mechanisms first is more efficient than searching for custom, potentially hidden, logic.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "worldpartition",
            "title": "Examine Streaming Volume Activation Settings",
            "prompt": "<p>You've found the 'World Streaming Source Volume'. Which property on this volume is critical for activating the city's data layer streaming?</p>",
            "choices": [
                {
                    "text": "<p>Examine the 'Data Layers to Activate' property in the Details panel of the 'World Streaming Source Volume'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.3hrs. This property directly controls which Data Layers the volume will attempt to stream in when activated, making it crucial for this issue.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Adjust the 'Streaming Priority' on the 'BP_DesertCity' actor.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. Streaming priority only matters if the content is *already* being considered for streaming. If it's not activating at all, priority is irrelevant.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Check the 'Min/Max Activation Distance' properties on the streaming volume.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. While important, these usually control *when* the activation happens. First, confirm *what* it's trying to activate. This is a secondary check.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Verify the collision settings of the 'World Streaming Source Volume'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.15hrs. Collision settings are generally for player interaction, not for the volume's internal streaming logic. This is unlikely to be the cause.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "worldpartition",
            "title": "Identify Data Layer Configuration Error",
            "prompt": "<p>You're inspecting the 'World Streaming Source Volume' properties. What specific misconfiguration do you look for in its activation settings?</p>",
            "choices": [
                {
                    "text": "<p>Identify that the 'Data Layers to Activate' list is set to activate 'DL_Roads_High' instead of 'DL_City_Assets'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. This is the exact configuration error described, where the wrong Data Layer is being targeted for activation.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Assume the volume is too small and resize it significantly without checking properties.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Resizing without diagnosing the actual issue is a guess. The problem isn't necessarily the size, but what it's configured to do.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Check if 'Is Spatially Loaded' is enabled on the streaming volume itself.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While important for the volume itself, this doesn't tell you *what* data layers it's configured to activate, which is the immediate concern.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Look for any 'Begin Overlap' events in the streaming volume's Blueprint script.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. This volume type generally handles activation internally without explicit Blueprint events. Looking for custom BP is premature.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "worldpartition",
            "title": "Modify Streaming Volume Data Layer List",
            "prompt": "<p>The streaming volume is activating the wrong data layer. How do you correct its 'Data Layers to Activate' list to include the city assets?</p>",
            "choices": [
                {
                    "text": "<p>Modify the 'Data Layers to Activate' list on the Streaming Volume to include 'DL_City_Assets'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Directly correcting the list to include the correct Data Layer is the straightforward fix for this misconfiguration.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Delete the 'World Streaming Source Volume' and rely solely on spatial loading.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. Deleting the volume removes the intended preloading mechanism, which could lead to further streaming issues or less optimized loading.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Add 'DL_City_Assets' to the 'Always Loaded Data Layers' in World Settings.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.4hrs. While this would load the city, it would keep it loaded at all times, negating the benefits of World Partition and impacting performance globally. It's an inefficient solution.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Duplicate the existing 'DL_Roads_High' entry and rename it to 'DL_City_Assets'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.15hrs. While seemingly similar, this is not the correct way to add an existing Data Layer to the list and might create confusion or unnecessary duplication.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "worldpartition",
            "title": "Test and Observe Continued Failure",
            "prompt": "<p>You've corrected the streaming volume's Data Layer activation. After testing, the city still fails to stream. What does this suggest is the issue?</p>",
            "choices": [
                {
                    "text": "<p>Observe that the failure still occurs, indicating the streaming source volume itself is not active/loaded when needed.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. If the volume is set correctly but nothing happens, the volume itself must not be loading, or its activation isn't happening early enough.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Revert the change, assuming it was incorrect.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Reverting a correct change after a new symptom appears is counterproductive. The change was correct, but it exposed another underlying issue.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Start looking for issues with the 'BP_DesertCity' actor's LOD settings.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. LODs are for visual quality once an actor has streamed in. The problem is still that the city isn't streaming at all, making LOD settings irrelevant at this stage.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Check the player character's collision settings to ensure it can overlap the volume.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.15hrs. While valid for some trigger volumes, 'World Streaming Source Volumes' usually don't rely on player overlap for their loading policy. Focus on the volume's own loading.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "worldpartition",
            "title": "Determine Streaming Volume's Data Layer",
            "prompt": "<p>The streaming volume isn't active/loaded when needed. What's the next logical step to ensure the volume itself loads as the player approaches?</p>",
            "choices": [
                {
                    "text": "<p>Determine the Data Layer that the 'World Streaming Source Volume' actor belongs to, noted as 'DL_Triggers'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.2hrs. To ensure the volume loads, you need to know which Data Layer it resides in and then investigate that Data Layer's loading policy.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Place additional streaming volumes along the road to cover more area.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.3hrs. Adding more volumes won't solve the problem if the existing volume's own loading mechanism is flawed. This creates redundant and potentially buggy setups.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Check the 'Is Spatially Loaded' property on the 'World Streaming Source Volume' itself.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.25hrs. While relevant, knowing its Data Layer is more direct for controlling its loading behavior, as the Data Layer policy can override individual actor settings. This leads to a detour for deeper understanding.</p>",
                    "next": "detour-A"
                },
                {
                    "text": "<p>Examine engine logs for warnings or errors related to volume loading.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.3hrs. Logs are good for deeper debugging, but a systematic check of World Partition settings is usually more direct for misconfigurations than relying on error messages for expected behavior.</p>",
                    "next": "step-8"
                }
            ]
        },
        "detour-A": {
            "skill": "worldpartition",
            "title": "Streaming Volume 'Is Spatially Loaded'",
            "prompt": "<p>You checked 'Is Spatially Loaded' on the volume; it's enabled. Yet it's not active. What was the *real* reason the volume wasn't loading early enough?</p>",
            "choices": [
                {
                    "text": "<p>Return to determining which Data Layer the volume belongs to, as its own loading policy is likely the issue.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Even if 'Is Spatially Loaded' is true, the Data Layer it belongs to dictates *when* it gets spatially loaded. That's the higher-level control.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Try setting 'Is Spatially Loaded' to false and then true again.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. Toggling a setting is rarely a solution for a fundamental loading policy issue and is more akin to a 'reboot' without understanding the cause.</p>",
                    "next": "detour-A"
                },
                {
                    "text": "<p>Adjust the volume's bounds to be much larger, thinking it might not be 'spatial' enough.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While size matters for its *effect*, it doesn't solve the issue of the volume *itself* not being loaded into memory by World Partition.</p>",
                    "next": "detour-A"
                },
                {
                    "text": "<p>Check 'Always Loaded' on the volume's actor settings.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Similar to 'Is Spatially Loaded', this is an actor-level setting. The Data Layer's policy is likely controlling its loading.</p>",
                    "next": "detour-A"
                }
            ]
        },
        "step-9": {
            "skill": "worldpartition",
            "title": "Inspect Data Layer Properties",
            "prompt": "<p>The streaming volume is in 'DL_Triggers'. How do you investigate the 'DL_Triggers' layer to understand why it isn't loading when the player approaches?</p>",
            "choices": [
                {
                    "text": "<p>Open the Data Layer Panel (Window > World Partition > Data Layers) and inspect the properties of the 'DL_Triggers' layer.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.2hrs. The Data Layer Panel is where the loading policy for specific Data Layers is configured, making it the correct place to investigate.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Manually mark 'DL_Triggers' as 'Always Loaded' in the Data Layers panel without checking its policy.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.5hrs. While 'Always Loaded' would make it work, it defeats the performance benefits of World Partition by keeping the trigger layer in memory constantly, even when not needed. It's a quick fix that creates a long-term performance issue.</p>",
                    "next": "detour-AlwaysLoadedDL"
                },
                {
                    "text": "<p>Remove the streaming volume from 'DL_Triggers' and place it in 'DL_Roads_High'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. This is a guess. Moving it to another Data Layer might introduce new problems or not solve the underlying issue if 'DL_Roads_High' has similar loading policies.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Search for any other actors belonging to 'DL_Triggers' to see if they are loading correctly.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.25hrs. While useful for broader context, it's more direct to inspect the Data Layer's own properties than to infer from other actors within it.</p>",
                    "next": "step-9"
                }
            ]
        },
        "detour-AlwaysLoadedDL": {
            "skill": "worldpartition",
            "title": "'Always Loaded' Data Layer Issues",
            "prompt": "<p>You set 'DL_Triggers' to 'Always Loaded'. This works, but it means the trigger volume (and everything else in 'DL_Triggers') is constantly loaded, even when not needed, reducing performance. What was the more appropriate Data Layer Loading Policy?</p>",
            "choices": [
                {
                    "text": "<p>Change the 'Loading Policy' property for 'DL_Triggers' from 'On Demand' to 'Runtime'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.0hrs. Correct. Setting the policy to 'Runtime' ensures the Data Layer loads when the player approaches, providing optimized loading without being constantly active.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Set its 'Streaming Distance Multiplier' to a very high value.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. While this might increase its loading range, it's less direct than setting the explicit loading policy and can still lead to inefficient resource usage.</p>",
                    "next": "detour-AlwaysLoadedDL"
                },
                {
                    "text": "<p>Remove all actors from 'DL_Triggers' and place them in the Persistent Level.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.3hrs. This eliminates the benefit of data layering for these actors and can make scene management harder. It's an extreme solution.</p>",
                    "next": "detour-AlwaysLoadedDL"
                },
                {
                    "text": "<p>Try rebuilding only the data layers.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Rebuilding might fix some data corruption, but won't change a deliberately set loading policy. The issue is configuration, not corruption.</p>",
                    "next": "detour-AlwaysLoadedDL"
                }
            ]
        },
        "step-10": {
            "skill": "worldpartition",
            "title": "Modify Data Layer Loading Policy",
            "prompt": "<p>You're in the Data Layer Panel, inspecting 'DL_Triggers'. What specific property needs changing to ensure the trigger volume is active as the player approaches?</p>",
            "choices": [
                {
                    "text": "<p>Change the 'Loading Policy' property for 'DL_Triggers' from 'On Demand' to 'Runtime'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. 'Runtime' ensures the Data Layer is loaded and active when the player is within its streaming range, which is exactly what's needed for the trigger volume.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Delete the 'DL_Triggers' Data Layer and reassign its actors to the persistent level.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.4hrs. This would eliminate the Data Layer and its benefits, complicating scene management and potentially affecting performance negatively by loading everything permanently.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Set the 'Draw in Editor' property of 'DL_Triggers' to true.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Draw in Editor' only affects visibility within the editor, not runtime loading behavior. This is a visual setting.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Change the 'Streaming Distance Multiplier' for 'DL_Triggers'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.15hrs. While this could extend the range, the primary issue is the 'policy' itself. If it's 'On Demand', it won't be actively managed for streaming. The policy needs to be correct first.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "worldpartition",
            "title": "Test Again - Suspect BP Override",
            "prompt": "<p>You've set 'DL_Triggers' to 'Runtime'. Testing shows the city still doesn't reliably stream along the path. What's the next most likely culprit?</p>",
            "choices": [
                {
                    "text": "<p>The city still fails to stream reliably along the path, suggesting an issue with the City BP itself overriding spatial loading.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. With Data Layers and streaming volumes configured, if the city still resists streaming, an internal override within its Blueprint is a strong possibility.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Rebuild all geometry and lightmaps.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.4hrs. This is another 'rebuild everything' approach that's unlikely to fix a specific streaming logic issue and wastes significant time.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Increase the 'World Partition Grid Size' in World Settings.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.3hrs. Modifying the grid size impacts performance and how cells are managed, but not typically whether a specific actor, despite correct settings, refuses to stream due to an internal override.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Check the World Partition minimap for any red (unloaded) cells around the city.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. This visual check might confirm the problem but doesn't immediately suggest a solution if all external settings are apparently correct. The issue is deeper.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "blueprint",
            "title": "Open City Blueprint Construction Script",
            "prompt": "<p>It seems the 'BP_DesertCity' might be overriding its spatial loading status. Where in the Blueprint would you expect to find such overriding logic?</p>",
            "choices": [
                {
                    "text": "<p>Open the 'BP_DesertCity' Blueprint and navigate to the Construction Script.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.3hrs. The Construction Script runs when the actor is spawned or updated in the editor, making it a common place for initial setup or properties being set, potentially overriding editor settings.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Search for 'BP_DesertCity' in the Content Browser and delete its 'Generated Proxies'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.2hrs. Generated proxies relate to HLODs. This issue is about initial streaming, not the proxy geometry for distant views.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Look for a custom Event Graph node that explicitly handles streaming.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.25hrs. While possible, initial setup or overrides are more commonly found in the Construction Script, which executes earlier and more consistently for editor-set properties.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Check the 'BP_DesertCity' actor's 'Collision Presets' to ensure it's not blocking streaming.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.15hrs. Collision presets primarily control physical interactions, not the data loading of the actor itself. This is a misdirection.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "blueprint",
            "title": "Locate 'Set Is Spatially Loaded' Node",
            "prompt": "<p>You're in the Construction Script of 'BP_DesertCity'. What specific node or logic are you searching for that might interfere with spatial loading?</p>",
            "choices": [
                {
                    "text": "<p>Locate an erroneous node chain that is using 'Set Is Spatially Loaded' and setting it to 'False'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.3hrs. This node directly controls whether an actor participates in spatial loading. An accidental 'False' here would precisely cause the observed issue.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Search for any 'Print String' nodes that might be outputting debugging info.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. While useful for debugging *output*, it won't resolve the underlying issue if the logic itself is flawed. It's a diagnostic, not a fix.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Check if the 'Set Actor Hidden In Game' node is being used incorrectly.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. This would hide the actor visually, but it wouldn't prevent its meshes or collision from being streamed in. It's a different effect.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Look for any 'Set Actor Enable Collision' nodes that might be disabling collision too early.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.15hrs. This would affect collision, but the core problem is that the entire city mesh isn't streaming, suggesting a broader loading issue.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "blueprint",
            "title": "Remove/Bypass 'Set Is Spatially Loaded'",
            "prompt": "<p>You've found the 'Set Is Spatially Loaded' node incorrectly set to 'False'. How do you correct this to allow default spatial loading?</p>",
            "choices": [
                {
                    "text": "<p>Remove or bypass the 'Set Is Spatially Loaded' node in the Construction Script entirely.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Removing the node allows the actor's editor property for spatial loading to take effect, resolving the override.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Change 'Set Is Spatially Loaded' to 'True' for all components within the Blueprint.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. While this might fix it, removing the explicit override is cleaner and relies on the default editor settings for the actor, which is generally preferred.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Move the 'Set Is Spatially Loaded' node from the Construction Script to an Event Graph 'Begin Play' event.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. Moving it might delay the effect, but the core issue is an explicit 'False' override. The best approach is to remove the unnecessary override entirely.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Change the 'Load Distance' on the 'BP_DesertCity' actor's root component.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. 'Load Distance' is a property, but it's secondary to the 'Is Spatially Loaded' flag itself. If spatial loading is disabled, load distance is irrelevant.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "worldpartition",
            "title": "Test Again - Player Streaming Source",
            "prompt": "<p>After removing the overriding node, streaming is significantly better, but still occasionally lags. What final optimization could improve player-driven streaming?</p>",
            "choices": [
                {
                    "text": "<p>Notice a significant improvement, but occasional lag in streaming suggests the player isn't optimally marked as a streaming source.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. The player character itself needs to be correctly configured as a streaming source to reliably request loading as it moves through the world.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Increase the player character's movement speed to 'force' streaming faster.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. This is not a solution but a workaround that affects gameplay. It won't fix the underlying streaming source configuration.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Adjust the 'Min/Max Loading Range' on the 'BP_DesertCity' actor.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. While these settings define the city's loading behavior, the issue here is the *source* requesting the load, not the target's range limits.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Check the project's 'Time-Slice Streaming' settings in World Settings.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.25hrs. Time-slice settings relate to how streaming operations are spread over frames, which is a performance optimization, not a primary fix for inconsistent loading.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "blueprint",
            "title": "Open Player Character Blueprint",
            "prompt": "<p>The player character might not be optimally marked as a streaming source. Which Blueprint should you open to modify the player's streaming behavior?</p>",
            "choices": [
                {
                    "text": "<p>Open the Player Character Blueprint ('BP_CustomExplorer') used for the test drive.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.4hrs. The player character Blueprint is where you would configure its properties related to interaction with the world, including streaming.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Modify the 'Player Start' actor in the level.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. The 'Player Start' actor merely defines the spawn location; it doesn't control the streaming behavior of the player character itself.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Add a 'World Streaming Source Volume' directly around the player character.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.3hrs. While a manual volume could work, the player character has a built-in, more efficient way to be a streaming source without adding extra actors.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Search for a 'Set Player Streaming Source' node in the Level Blueprint.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.2hrs. While custom logic could exist, enabling the native 'Is Streaming Source' property on the player's component is the standard and most direct approach.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "blueprint",
            "title": "Locate World Partition Section on Root Component",
            "prompt": "<p>You're in the 'BP_CustomExplorer' Blueprint. Where specifically do you enable the player to properly act as a World Partition streaming source?</p>",
            "choices": [
                {
                    "text": "<p>Select the Root Component (e.g., Capsule Component) and check the 'World Partition' section of the Details Panel.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.3hrs. The 'World Partition' section on the root component of the actor (like a player character) contains settings for its interaction with the streaming system.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Add a new component specifically for streaming source functionality.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.25hrs. A dedicated component is unnecessary. The functionality is built into existing components for streaming sources.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Look for a custom event in the Event Graph to toggle streaming source.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. While custom events can exist, the core 'Is Streaming Source' property is a fundamental engine setting on a component, not typically controlled by a custom event.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Check the 'World Partition' settings on the player's camera component.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.15hrs. While the camera's view frustum might influence what's streamed, the primary streaming source is usually the actor's root component or a dedicated pawn component.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "blueprint",
            "title": "Enable 'Is Streaming Source'",
            "prompt": "<p>You've navigated to the 'World Partition' section of the Root Component. What specific property needs to be enabled to make the player a streaming source?</p>",
            "choices": [
                {
                    "text": "<p>Enable the checkbox labeled 'Is Streaming Source' on the Root Component of the Player Character.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. Enabling this property correctly marks the player as a source for streaming requests, ensuring content loads proactively as they move.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Increase the 'Streaming View Distance' on the player character.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.1hrs. While this might increase the range of *what* is streamed, the problem is that the player isn't effectively *requesting* streaming. 'Is Streaming Source' is more fundamental.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Change the 'World Partition Grid Size' in the Player Character Blueprint.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The World Partition Grid Size is a global project setting, not a property typically modified per-actor in a Blueprint. This would have no effect.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Set the 'Data Layer' for the player character to 'DL_City_Assets'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.15hrs. The player character usually doesn't need to be on a specific content Data Layer. Its role is to *request* other Data Layers, not belong to them.</p>",
                    "next": "step-18"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario.</p>",
            "choices": [{"text": "Complete Scenario", "type": "correct", "feedback": "", "next": "end"}]
        }
    }
};
