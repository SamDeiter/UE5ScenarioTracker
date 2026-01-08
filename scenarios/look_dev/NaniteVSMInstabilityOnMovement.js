window.SCENARIOS['NaniteVSMInstabilityOnMovement'] = {
    "meta": {
        "title": "Dynamic Nanite Geometry Flickering and Blocky VSM Shadows on Rapid Camera Movement",
        "description": "In a highly detailed, large interior environment using Lumen Global Illumination, two distinct rendering artifacts occur specifically when the camera is moved quickly:\n1. The Nanite-enabled tiled floor material exhibits severe flickering (patches of pure white or black) when viewed from intermediate distances.\n2. The high-poly Nanite geometric wall molding casts extremely blocky, low-resolution shadows that jump and update visibly as the camera speeds up. The blockiness persists even at high-end scalability settings. Both issues disappear when the camera is completely static.",
        "estimateHours": 3,
        "category": "Lighting & Rendering",
        "tokens_used": 11701
    },
    "setup": [
        {
            "action": "set_ue_property",
            "scenario": "NaniteVSMInstabilityOnMovement",
            "step": "step-0"
        }
    ],
    "fault": {
        "description": "Initial problem state for NaniteVSMInstabilityOnMovement",
        "visual_cue": "Visual indicator of issue"
    },
    "expected": {
        "description": "Expected resolved state",
        "validation_action": "verify_fix"
    },
    "fix": [
        {
            "action": "set_ue_property",
            "scenario": "NaniteVSMInstabilityOnMovement",
            "step": "final"
        }
    ],
    "start": "step-1-initial-observation",
    "steps": {
        "step-1-initial-observation": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-1-initial-observation.png",
            "title": "Initial Observation and Prioritization",
            "prompt": "You observe flickering Nanite floor and blocky VSM shadows on rapid camera movement. Which issue do you address first, and how do you gather information about it?",
            "choices": [
                {
                    "text": "Target VSM shadows using <code>stat virtualshadowmap</code> to confirm VSM activity and check <code>Page Pool Used</code>.",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.2hrs. The VSM shadows are a direct resource problem, often simpler to diagnose with the specific `stat` command, making it a good first target.",
                    "next": "step-2-vsm-pool-check-result"
                },
                {
                    "text": "Use <strong>Nanite Overview</strong> to check floor flickering.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.15hrs. While relevant, the VSM shadow issue is a direct resource problem with a specific console command, which is often a more effective first step.",
                    "next": "step-1-initial-observation"
                },
                {
                    "text": "Adjust <strong>Directional Light's</strong> <code>Source Angle</code>.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.2hrs. This setting is unrelated to rendering artifacts caused by Nanite or Virtual Shadow Maps.",
                    "next": "step-1-initial-observation"
                },
                {
                    "text": "Check <code>stat gpu</code> for general rendering performance.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.1hrs. `stat gpu` provides overall performance, but `stat virtualshadowmap` is more specific and diagnostic for the shadow issue.",
                    "next": "step-1-initial-observation"
                }
            ]
        },
        "step-2-vsm-pool-check-result": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-2-vsm-pool-check-result.png",
            "title": "Diagnose VSM Page Pool Utilization",
            "prompt": "<code>stat virtualshadowmap</code> output shows 'Page Pool Used' is 98% and 'VSM Active' is true. What's your immediate conclusion and action to resolve the blocky shadows?",
            "choices": [
                {
                    "text": "VSM resources are insufficient. Proceed to increase <code>VSM Page Table Size</code> in <strong>Project Settings</strong>.",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.3hrs. High `Page Pool Used` directly indicates insufficient VSM memory, requiring an increase in `VSM Page Table Size`.",
                    "next": "step-3-vsm-size-project-settings"
                },
                {
                    "text": "Increase <code>Shadow Map Resolution</code> on the <strong>Directional Light</strong>.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.2hrs. This setting is for standard shadow maps, not specific to Virtual Shadow Map resource allocation.",
                    "next": "step-2-vsm-pool-check-result"
                },
                {
                    "text": "Disable VSM temporarily to see if shadows improve.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.5hrs. This avoids solving the core stability issues inherent to Nanite/VSM interaction and can introduce other rendering problems.",
                    "next": "step-2-vsm-pool-check-result"
                },
                {
                    "text": "Check other VSM stats like <code>Texture Streaming</code>.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.15hrs. While other stats are useful, 'Page Pool Used' at 98% is the direct indicator of the resource bottleneck for shadow detail.",
                    "next": "step-2-vsm-pool-check-result"
                }
            ]
        },
        "step-3-vsm-size-project-settings": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-3-vsm-size-project-settings.png",
            "title": "Increase VSM Page Table Size",
            "prompt": "You've navigated to <strong>Project Settings</strong> > <strong>Rendering</strong> > <strong>Virtual Shadow Maps</strong>. What specific setting do you modify?",
            "choices": [
                {
                    "text": "Increase the <code>VSM Page Table Size</code> setting from the default (e.g., 4096) to 8192 or 16384.",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.3hrs. This directly reserves more memory for shadow mapping detail, addressing the VSM resource exhaustion.",
                    "next": "step-4-apply-vsm-change"
                },
                {
                    "text": "Adjust <code>Virtual Shadow Map Max Ray Distance</code>.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.1hrs. This setting affects the maximum distance shadows are rendered, not the core resource allocation for shadow detail.",
                    "next": "step-3-vsm-size-project-settings"
                },
                {
                    "text": "Modify <code>Shadow Quality</code> in <strong>Engine Scalability Settings</strong>.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.35hrs. Adjusting engine scalability settings is a general approach and does not debug the specific resource limits of Virtual Shadow Maps.",
                    "next": "wrong-scalability-settings"
                },
                {
                    "text": "Attempt to fix shadow blockiness by adjusting the <strong>Directional Light's</strong> <code>Shadow Bias</code> or <code>Slope Scale</code>.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.4hrs. These are properties for standard shadow maps and are not the root cause of VSM resource exhaustion.",
                    "next": "wrong-shadow-bias"
                }
            ]
        },
        "wrong-scalability-settings": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-3-vsm-size-project-settings.png",
            "title": "Specific vs. General Settings",
            "prompt": "You adjusted <code>Shadow Quality</code> in <strong>Engine Scalability Settings</strong>, but the blocky VSM shadows persist. Why was this an ineffective approach?",
            "choices": [
                {
                    "text": "Scalability settings are general presets; the issue was a specific VSM resource limit (<code>VSM Page Table Size</code>).",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.0hrs. Correct. Scalability settings apply broad changes; addressing specific resource limits requires targeting the exact setting.",
                    "next": "step-3-vsm-size-project-settings"
                },
                {
                    "text": "Scalability settings only affect performance, not visual quality.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.05hrs. Scalability settings affect both performance and visual quality, but in a general way, not specific resource limits.",
                    "next": "wrong-scalability-settings"
                },
                {
                    "text": "The setting applies to standard shadow maps only.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.05hrs. While often true, the primary issue here is the generality of scalability settings versus the need for specific VSM configuration.",
                    "next": "wrong-scalability-settings"
                },
                {
                    "text": "You need to restart the editor for scalability changes.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.05hrs. Most scalability changes apply immediately, so this is not the reason for the ineffectiveness.",
                    "next": "wrong-scalability-settings"
                }
            ]
        },
        "wrong-shadow-bias": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-3-vsm-size-project-settings.png",
            "title": "Shadow Bias vs. VSM Resources",
            "prompt": "You've tried adjusting the <strong>Directional Light's</strong> <code>Shadow Bias</code> and <code>Slope Scale</code>, but the blocky VSM shadows remain. Why was this not the correct solution?",
            "choices": [
                {
                    "text": "<code>Shadow Bias</code> and <code>Slope Scale</code> are for standard shadow maps, not the root cause of VSM resource exhaustion.",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.0hrs. Correct. These settings address specific artifacts in traditional shadow maps, not the resource allocation for Virtual Shadow Maps.",
                    "next": "step-3-vsm-size-project-settings"
                },
                {
                    "text": "These settings only affect shadow resolution.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.05hrs. These settings address issues like 'shadow acne' and 'peter panning', not the fundamental resolution caused by VSM resource limits.",
                    "next": "wrong-shadow-bias"
                },
                {
                    "text": "You needed to adjust these on the mesh instead.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.05hrs. `Shadow Bias` and `Slope Scale` are properties of the light source, not individual meshes.",
                    "next": "wrong-shadow-bias"
                },
                {
                    "text": "The settings are only for static shadows.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.05hrs. They can apply to dynamic shadows too, just not VSM specific resource limits.",
                    "next": "wrong-shadow-bias"
                }
            ]
        },
        "step-4-apply-vsm-change": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-4-apply-vsm-change.png",
            "title": "Apply VSM Change and Test",
            "prompt": "You've increased the <code>VSM Page Table Size</code> in <strong>Project Settings</strong>. How do you apply this change immediately and verify the shadow improvement?",
            "choices": [
                {
                    "text": "Use the console command <code>r.VSM.PageTableSize 16384</code> (or 8192) and then move the camera rapidly to test.",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.4hrs. Console commands allow immediate application and testing of many settings without restarting the editor.",
                    "next": "step-4b-confirm-shadows"
                },
                {
                    "text": "Restart the editor for the <strong>Project Settings</strong> change to take effect.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.2hrs. While a restart would apply the setting, using the console command is quicker for iterative testing.",
                    "next": "step-4-apply-vsm-change"
                },
                {
                    "text": "Use the console command <code>r.Shadow.DistanceScale</code> to force higher shadow quality.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.15hrs. This command adjusts general shadow distance, not the VSM page table size that controls resolution.",
                    "next": "step-4-apply-vsm-change"
                },
                {
                    "text": "Manually edit <code>DefaultEngine.ini</code> to apply the VSM change and restart the editor.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.15hrs. While effective, the console command offers a much faster workflow for testing changes.",
                    "next": "step-4-apply-vsm-change"
                }
            ]
        },
        "step-4b-confirm-shadows": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-4b-confirm-shadows.png",
            "title": "Confirming Shadow Resolution",
            "prompt": "After increasing <code>VSM Page Table Size</code> and applying it via console, you move the camera rapidly. What do you observe about the shadows, and what's your next priority?",
            "choices": [
                {
                    "text": "The blocky shadows are resolved. Now, you focus on the Nanite floor flickering.",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.0hrs. Confirming the shadow fix allows you to confidently move on to the next distinct issue.",
                    "next": "step-5-investigate-floor-mesh"
                },
                {
                    "text": "The shadows are still blocky. The change didn't take effect.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.05hrs. If the fix wasn't effective, it's crucial to re-evaluate the VSM settings or how they were applied.",
                    "next": "step-3-vsm-size-project-settings"
                },
                {
                    "text": "The shadows are gone entirely.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.05hrs. This indicates a more severe issue, possibly VSM being completely disabled, requiring an earlier diagnostic step.",
                    "next": "step-2-vsm-pool-check-result"
                },
                {
                    "text": "The flickering on the floor got worse.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.05hrs. Focusing on one issue at a time is best. If a fix worsens another, it suggests a broader problem requiring re-evaluation from an earlier stage.",
                    "next": "step-1-initial-observation"
                }
            ]
        },
        "step-5-investigate-floor-mesh": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-5-investigate-floor-mesh.png",
            "title": "Investigate Floor Nanite Settings",
            "prompt": "The blocky shadows on the wall molding are now resolved. However, the Nanite-enabled tiled floor still exhibits severe flickering. How do you begin investigating the floor mesh's behavior?",
            "choices": [
                {
                    "text": "Open the problematic floor's <strong>Static Mesh</strong> asset in the editor and examine its <strong>Nanite Settings</strong>, specifically <code>Fallback Relative Error</code>.",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.3hrs. High `Fallback Relative Error` can cause aggressive detail culling, leading to depth buffer instability and flickering with Nanite.",
                    "next": "step-6-nanite-fallback-action"
                },
                {
                    "text": "Check the floor material for <code>World Position Offset</code> nodes.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.1hrs. While `World Position Offset` can cause flickering, checking the Nanite mesh settings directly for culling issues is often a more direct first step for Nanite-specific flickering.",
                    "next": "step-5-investigate-floor-mesh"
                },
                {
                    "text": "Disable Nanite on the floor mesh to test if the issue persists.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.5hrs. Disabling Nanite avoids solving the core stability issues inherent to Nanite/VSM interaction and negates the benefits of Nanite.",
                    "next": "wrong-disable-nanite"
                },
                {
                    "text": "Adjust the <strong>Directional Light's</strong> <code>Source Angle</code>.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.15hrs. This is unrelated to mesh flickering; it primarily affects the direction and appearance of shadows.",
                    "next": "step-5-investigate-floor-mesh"
                }
            ]
        },
        "wrong-disable-nanite": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-5-investigate-floor-mesh.png",
            "title": "Avoid Disabling Core Features",
            "prompt": "You've disabled Nanite on the floor mesh. The flickering stopped, but the mesh now has significantly reduced detail and performance is worse. What was wrong with this approach?",
            "choices": [
                {
                    "text": "Disabling Nanite avoids solving the underlying stability issues and negates its benefits. You must find a Nanite-compatible solution.",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.0hrs. Correct. The goal is to optimize Nanite, not remove it, as it's crucial for the scene's detail and performance.",
                    "next": "step-5-investigate-floor-mesh"
                },
                {
                    "text": "Nanite is always required for high-detail meshes in UE5.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.05hrs. While Nanite is ideal for high detail, it's not strictly 'required' in all cases; the issue here is *why* it was unstable.",
                    "next": "wrong-disable-nanite"
                },
                {
                    "text": "The flickering was just a visual bug that went away with Nanite.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.05hrs. Visual artifacts usually have underlying technical causes that need to be addressed, not simply hidden by disabling features.",
                    "next": "wrong-disable-nanite"
                },
                {
                    "text": "Nanite needs a specific material type to function correctly.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.05hrs. While material settings are important for Nanite, this is not the fundamental reason why disabling Nanite was a wrong step.",
                    "next": "wrong-disable-nanite"
                }
            ]
        },
        "step-6-nanite-fallback-action": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-6-nanite-fallback-action.png",
            "title": "Adjust Nanite Fallback Relative Error",
            "prompt": "You've opened the floor <strong>Static Mesh</strong> and verified Nanite is enabled. What would an excessively high <code>Fallback Relative Error</code> imply for the flickering, and what's your corrective action?",
            "choices": [
                {
                    "text": "High error causes aggressive detail culling leading to depth buffer instability. Lower <code>Fallback Relative Error</code> slightly.",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.3hrs. Reducing `Fallback Relative Error` ensures Nanite maintains more consistent detail at intermediate distances, preventing erratic culling and flickering.",
                    "next": "step-7-material-blendmode"
                },
                {
                    "text": "Adjust <code>Position Precision</code> in <strong>Nanite Settings</strong>.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.1hrs. `Position Precision` relates to coordinate accuracy, not the dynamic detail culling that causes flickering.",
                    "next": "step-6-nanite-fallback-action"
                },
                {
                    "text": "Check <strong>Material Editor's</strong> <code>Vertex Normal</code> settings.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.15hrs. This is unrelated to Nanite's dynamic detail culling and depth flickering.",
                    "next": "step-6-nanite-fallback-action"
                },
                {
                    "text": "Increase <code>Screen Size</code> for the Nanite mesh.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.15hrs. While `Screen Size` affects overall detail, `Fallback Relative Error` is more directly tied to the aggressive culling causing instability.",
                    "next": "step-6-nanite-fallback-action"
                }
            ]
        },
        "step-7-material-blendmode": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-7-material-blendmode.png",
            "title": "Check Floor Material Blend Mode",
            "prompt": "You've addressed <code>Fallback Relative Error</code>. If the flickering persists, what critical <strong>Material</strong> setting often causes depth buffer instability with Nanite, Lumen, and VSM interaction?",
            "choices": [
                {
                    "text": "Check the floor <strong>Material</strong> and ensure its <code>Blend Mode</code> is set to 'Opaque'.",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.2hrs. Nanite meshes using 'Masked' blend mode can cause depth sorting issues or instability with VSM/Lumen when viewed dynamically.",
                    "next": "step-8-material-functions"
                },
                {
                    "text": "Change <code>Blend Mode</code> to 'Translucent'.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.15hrs. 'Translucent' materials are generally incompatible with Nanite and would introduce severe rendering issues, not fix flickering.",
                    "next": "step-7-material-blendmode"
                },
                {
                    "text": "Adjust <strong>Lightmass</strong> settings in <strong>World Settings</strong>.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.2hrs. Lightmass is for baked lighting, completely unrelated to real-time Nanite/Lumen flickering.",
                    "next": "step-7-material-blendmode"
                },
                {
                    "text": "Check if all textures are using <code>SRGB</code>.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.1hrs. While `SRGB` is important for correct color space, it's not the primary cause of Nanite depth flickering related to material blend modes.",
                    "next": "step-7-material-blendmode"
                }
            ]
        },
        "step-8-material-functions": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-8-material-functions.png",
            "title": "Examine Material for Destabilizing Logic",
            "prompt": "The <strong>Material's</strong> <code>Blend Mode</code> is 'Opaque'. What potentially complex logic within the material itself (or its <strong>Material Functions</strong>) could be destabilizing the depth buffer during camera movement?",
            "choices": [
                {
                    "text": "Examine any <strong>Material Functions</strong> used in the floor material for `World Position Offset`, temporal effects, or complicated opacity masks.",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.3hrs. These types of material logic can destabilize the depth buffer calculation, especially during rapid camera motion, leading to flickering.",
                    "next": "step-9-texture-streaming-enabled"
                },
                {
                    "text": "Reduce `Number of Samplers` in the material.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.1hrs. While good for performance, reducing sampler count is unlikely to be the direct cause of depth flickering unless part of an overly complex shader.",
                    "next": "step-8-material-functions"
                },
                {
                    "text": "Re-import the <strong>Static Mesh</strong> with different import settings.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.15hrs. The issue is currently pinpointed to material logic, not the mesh import settings.",
                    "next": "step-8-material-functions"
                },
                {
                    "text": "Check if material parameters are animated or rapidly changing.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.1hrs. While animated parameters can contribute, it's the specific *logic* (like `World Position Offset` or temporal effects) that commonly destabilizes the depth buffer.",
                    "next": "step-8-material-functions"
                }
            ]
        },
        "step-9-texture-streaming-enabled": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-9-texture-streaming-enabled.png",
            "title": "Verify Virtual Texture Streaming",
            "prompt": "You've confirmed no problematic <strong>Material Functions</strong>. Considering high-resolution floor textures, what specific texture setting helps Nanite avoid streaming bottlenecks during fast movement?",
            "choices": [
                {
                    "text": "Verify the high-resolution textures used by the floor have <code>Virtual Texture Streaming</code> enabled.",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.1hrs. Enabling `Virtual Texture Streaming` is crucial for Nanite to efficiently handle high-resolution textures and avoid streaming bottlenecks during dynamic camera movement.",
                    "next": "step-10-lumen-max-trace"
                },
                {
                    "text": "Increase <code>Texture Pool Size</code> in <strong>Project Settings</strong>.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.25hrs. Modifying `Texture Pool Size` is for standard texture streaming, when the instability is specifically related to Nanite's depth buffer interaction with VSM and Lumen, or its dedicated streaming. Virtual Textures have their own system.",
                    "next": "wrong-texture-pool-size"
                },
                {
                    "text": "Reduce texture resolution to 128x128.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.15hrs. While it might prevent flickering by reducing load, this severely degrades visual quality and avoids solving the core streaming issue with high-res assets.",
                    "next": "step-9-texture-streaming-enabled"
                },
                {
                    "text": "Change texture compression settings to <code>UserInterface2D</code>.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.1hrs. This is an incorrect compression setting for game textures and unrelated to virtual texture streaming.",
                    "next": "step-9-texture-streaming-enabled"
                }
            ]
        },
        "wrong-texture-pool-size": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-9-texture-streaming-enabled.png",
            "title": "Texture Pool vs. Nanite Streaming",
            "prompt": "You've increased <code>Texture Pool Size</code> in <strong>Project Settings</strong>, but the flickering persists. Why was this change not effective for the Nanite-related flickering?",
            "choices": [
                {
                    "text": "The issue is specifically related to Nanite's depth buffer interaction with VSM/Lumen or its *own* streaming cache, not the general texture streaming pool.",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.0hrs. Correct. Nanite and Virtual Textures have specific streaming mechanisms that differ from the general texture pool.",
                    "next": "step-9-texture-streaming-enabled"
                },
                {
                    "text": "Texture pool size only affects editor performance.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.05hrs. The texture pool size affects runtime texture streaming performance, but not in the specific way required for Nanite's stability.",
                    "next": "wrong-texture-pool-size"
                },
                {
                    "text": "Nanite doesn't use textures.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.05hrs. Nanite meshes use textures just like any other mesh; the distinction lies in their optimized geometry streaming.",
                    "next": "wrong-texture-pool-size"
                },
                {
                    "text": "You need to specify a maximum size for each texture.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.05hrs. While individual textures have streaming settings, the global texture pool size is a budget; it's not the root cause of Nanite-specific instability.",
                    "next": "wrong-texture-pool-size"
                }
            ]
        },
        "step-10-lumen-max-trace": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-10-lumen-max-trace.png",
            "title": "Adjust Lumen Max Trace Distance",
            "prompt": "You've addressed texture streaming. Since Lumen is providing GI, what <strong>Global Illumination</strong> setting, found in <strong>World Settings</strong> or a <strong>Post Process Volume</strong>, might influence dynamic visibility for distant Nanite geometry?",
            "choices": [
                {
                    "text": "In <strong>World Settings</strong> > <strong>Global Illumination</strong>, verify that <code>Max Trace Distance</code> for Lumen is sufficient for the scale of the environment.",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.1hrs. Insufficient `Max Trace Distance` for Lumen can lead to GI artifacts on geometry at intermediate viewing distances.",
                    "next": "step-11-nanite-overview-viz"
                },
                {
                    "text": "Adjust <code>Lumen Probe Spacing</code>.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.1hrs. Probe spacing primarily affects GI quality at closer ranges and overall performance, less so artifacts at intermediate distances due to tracing.",
                    "next": "step-10-lumen-max-trace"
                },
                {
                    "text": "Toggle <code>Screen Space Reflections</code>.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.15hrs. Screen Space Reflections (SSR) is a separate rendering feature from Lumen Global Illumination and will not affect GI flickering.",
                    "next": "step-10-lumen-max-trace"
                },
                {
                    "text": "Increase <code>View Distance Scale</code> in <strong>Engine Scalability Settings</strong>.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.1hrs. While affecting general draw distance, `Max Trace Distance` is specific to Lumen's GI calculations and is the more direct setting.",
                    "next": "step-10-lumen-max-trace"
                }
            ]
        },
        "step-11-nanite-overview-viz": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-11-nanite-overview-viz.png",
            "title": "Visualize Nanite Cluster Density",
            "prompt": "Lumen <code>Max Trace Distance</code> seems adequate. How can you directly visualize Nanite's dynamic behavior on the flickering floor, specifically looking for erratic cluster changes?",
            "choices": [
                {
                    "text": "Use the <strong>Nanite Overview</strong> visualization mode (Show > Visualize > Nanite Overview) while moving the camera rapidly.",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.2hrs. `Nanite Overview` directly displays cluster density and transitions, helping to diagnose erratic switching that coincides with flickering.",
                    "next": "step-12-maxpixelsperedge"
                },
                {
                    "text": "Use <strong>Buffer Visualization</strong> > <code>World Position</code>.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.1hrs. While useful for general geometry, `Nanite Overview` provides specific diagnostic information about Nanite cluster behavior.",
                    "next": "step-11-nanite-overview-viz"
                },
                {
                    "text": "Check <code>stat streaming</code>.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.15hrs. `stat streaming` is for general texture streaming, not for visualizing Nanite mesh cluster dynamics.",
                    "next": "step-11-nanite-overview-viz"
                },
                {
                    "text": "Use <code>stat mesh</code>.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.1hrs. `stat mesh` provides general mesh information, but `Nanite Overview` is specifically designed for Nanite's unique visualization needs.",
                    "next": "step-11-nanite-overview-viz"
                }
            ]
        },
        "step-12-maxpixelsperedge": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-12-maxpixelsperedge.png",
            "title": "Adjust Nanite Detail Stability",
            "prompt": "The <strong>Nanite Overview</strong> shows severe, erratic cluster density switching on the floor coinciding with the flickering. What console variable can be adjusted to make Nanite render slightly smaller, more stable clusters at a distance?",
            "choices": [
                {
                    "text": "Increase the console variable <code>r.Nanite.MaxPixelsPerEdge</code> slightly (e.g., from 4.0 to 6.0).",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.2hrs. Increasing this variable forces Nanite to render slightly smaller clusters at distance, improving overall detail stability for GI and shadow systems.",
                    "next": "step-13-nanite-streaming-cache"
                },
                {
                    "text": "Decrease <code>r.Nanite.ProxyRenderBoundsRatio</code>.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.1hrs. This variable affects the size of proxy bounds for culling, not directly the stability of cluster detail at distance.",
                    "next": "step-12-maxpixelsperedge"
                },
                {
                    "text": "Reduce the polygon count of the original <strong>Static Mesh</strong>.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.15hrs. Nanite is designed to handle high polygon counts; the issue is its dynamic LOD behavior, not raw poly count.",
                    "next": "step-12-maxpixelsperedge"
                },
                {
                    "text": "Decrease <code>r.Nanite.MaxTrianglesPerEdge</code>.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.1hrs. `MaxPixelsPerEdge` is more directly related to perceived detail and cluster stability, whereas `MaxTrianglesPerEdge` influences the raw triangle budget.",
                    "next": "step-12-maxpixelsperedge"
                }
            ]
        },
        "step-13-nanite-streaming-cache": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-13-nanite-streaming-cache.png",
            "title": "Optimize Nanite Streaming Cache",
            "prompt": "Adjusting <code>r.Nanite.MaxPixelsPerEdge</code> helped, but some flickering persists, especially during very rapid camera sweeps. What <strong>Project Setting</strong> related to Nanite's streaming behavior could further improve stability?",
            "choices": [
                {
                    "text": "In <strong>Project Settings</strong> > <strong>Rendering</strong> > <strong>Nanite</strong>, ensure <code>Streaming Cache Size GB</code> is appropriate for the complexity of the scene and increase it slightly.",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.2hrs. Increasing the Nanite streaming cache size can reduce streaming latency during fast movement, helping to improve geometry stability.",
                    "next": "step-14-lumen-temporal-accumulation"
                },
                {
                    "text": "Increase <code>Material Cache Size</code>.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.1hrs. This setting is for material shader caching, not the streaming of Nanite geometry data.",
                    "next": "step-13-nanite-streaming-cache"
                },
                {
                    "text": "Increase system RAM via OS settings.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.15hrs. While more RAM is generally beneficial, the specific UE5 setting controlling Nanite streaming cache is the targeted solution here.",
                    "next": "step-13-nanite-streaming-cache"
                },
                {
                    "text": "Adjust <code>Texture Streaming Pool Size</code> in <strong>Project Settings</strong>.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.1hrs. This setting is for the general texture streaming system, whereas Nanite has its own specific streaming cache for geometry data.",
                    "next": "step-13-nanite-streaming-cache"
                }
            ]
        },
        "step-14-lumen-temporal-accumulation": {
            "skill": "lightingrendering",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/step-14-lumen-temporal-accumulation.png",
            "title": "Refine Lumen Temporal Accumulation",
            "prompt": "Most flickering is resolved, but a very subtle temporal artifact can still be seen on rapid movement. What Lumen console variable controls its temporal accumulation, and how might you adjust it to reduce these artifacts?",
            "choices": [
                {
                    "text": "Check the console variable <code>r.Lumen.Temporal.MaxFramesToAccumulate</code> (default 16) and test lowering it slightly (e.g., to 12).",
                    "type": "correct",
                    "feedback": "<strong>Optimal Time:</strong> +0.2hrs. If this value is too high, rapid camera motion might expose temporal artifacts more severely with Lumen's GI accumulation.",
                    "next": "conclusion"
                },
                {
                    "text": "Increase <code>r.Lumen.Temporal.MotionVectorScale</code>.",
                    "type": "plausible",
                    "feedback": "<strong>Extended Time:</strong> +0.1hrs. This scales motion vectors for temporal reprojection, not the number of accumulated frames that can cause the observed artifacts.",
                    "next": "step-14-lumen-temporal-accumulation"
                },
                {
                    "text": "Disable <code>Post Process Anti-Aliasing</code>.",
                    "type": "obvious",
                    "feedback": "<strong>Extended Time:</strong> +0.15hrs. Anti-aliasing methods are separate from Lumen's Global Illumination temporal accumulation.",
                    "next": "step-14-lumen-temporal-accumulation"
                },
                {
                    "text": "Disable <code>Temporal Super Resolution</code>.",
                    "type": "subtle",
                    "feedback": "<strong>Extended Time:</strong> +0.1hrs. While TSR uses temporal data, it's an upscaling technique. The `MaxFramesToAccumulate` is the direct Lumen GI temporal setting.",
                    "next": "step-14-lumen-temporal-accumulation"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "image_path": "assets/generated/NaniteVSMInstabilityOnMovement/conclusion.png",
            "title": "Scenario Complete",
            "prompt": "Congratulations! You have successfully completed this debugging scenario. Both the Nanite geometry flickering and blocky VSM shadows are resolved, maintaining visual fidelity during rapid camera movement.",
            "choices": [{"text": "Complete Scenario", "type": "correct", "feedback": "", "next": "end"}]
        }
    }
};
