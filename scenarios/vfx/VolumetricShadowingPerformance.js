window.SCENARIOS['VolumetricShadowingPerformance'] = {
    "meta": {
        "title": "Translucent Mesh Material Fails Dynamic Self-Shadowing & Causes Severe Overdraw",
        "description": "A large, translucent mesh (representing a cloud or nebula volume) is placed in the level. It uses World Position Offset (WPO) to simulate internal movement. The problem presents in two ways: 1) The mesh component is set to 'Cast Dynamic Shadows', but it does not receive dynamic self-shadowing or external shadows correctly from nearby movable lights, resulting in a flat, unlit appearance. 2) When viewing the scene in the 'Shader Complexity' view mode, this single mesh renders as bright red/pink, causing a significant frame rate drop (upwards of 15ms) whenever it is on screen, indicating extreme overdraw/expensive calculation.",
        "estimateHours": 3,
        "category": "Materials & Shaders",
        "tokens_used": 12103
    },
    "setup": [
        {
            "action": "set_ue_property",
            "scenario": "VolumetricShadowingPerformance",
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
            "scenario": "VolumetricShadowingPerformance",
            "step": "final"
        }
    ],
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "materialsshaders",
            "title": "Confirm GPU Performance Bottleneck",
            "prompt": "<p>A large, translucent cloud mesh causes a significant frame rate drop (15ms+) when visible. The scene runs smoothly otherwise. How do you confirm this is a GPU performance bottleneck?</p>",
            "choices": [
                {
                    "text": "<p>Use the console command <code>stat GPU</code> to observe rendering times when the mesh is on screen.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. <code>stat GPU</code> provides detailed GPU timing, directly validating the performance impact of rendering the mesh.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Check the <strong>Task Manager</strong> to see if the CPU usage spikes when the mesh is visible.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. The issue describes a rendering problem, which is primarily GPU-bound. <strong>Task Manager</strong> won't provide specific UE5 GPU metrics.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Use the console command <code>stat unit</code> to see overall frame rates, then try disabling various scene elements.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While <code>stat unit</code> shows the total frame time, it doesn't isolate the CPU vs. GPU bottleneck as directly as <code>stat GPU</code> would for a rendering issue.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Increase the <strong>Engine Scalability Settings</strong> to 'Cinematic' to see if the problem persists at higher quality.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. This would likely worsen performance, not help diagnose the root cause of the current slowdown.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "materialsshaders",
            "title": "Identify Shader Complexity Visually",
            "prompt": "<p><code>stat GPU</code> confirms a significant GPU time spike when the problematic mesh is visible. This suggests a costly rendering issue. How do you visually inspect the shader's complexity?</p>",
            "choices": [
                {
                    "text": "<p>Switch the viewport to <code>Shader Complexity</code> view mode and observe the mesh's color.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. The <code>Shader Complexity</code> view mode directly visualizes the instruction count and overdraw, highlighting expensive shaders.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Use the console command <code>r.ShaderComplexity.Visualize 1</code> and examine the scene.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While correct in principle, the standard viewport dropdown provides direct access and is generally preferred for ease of use over console commands for view modes.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Open the <strong>Profiler</strong> and look for high 'Draw Calls' related to the mesh.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. The <strong>Profiler</strong> is good for overall performance, but <code>Shader Complexity</code> view mode offers a direct visual representation of per-pixel cost.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Switch the viewport to <code>Lumen Overview</code> mode to check for global illumination issues.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. <code>Lumen Overview</code> is irrelevant to shader instruction count and overdraw. The problem is specifically about the mesh's material complexity.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "materialsshaders",
            "title": "Locate Problematic Material Instance",
            "prompt": "<p>In <code>Shader Complexity</code> view mode, the translucent mesh appears bright pink/red, indicating extreme cost. How do you identify the specific material being used by this mesh?</p>",
            "choices": [
                {
                    "text": "<p>Locate the <strong>Static Mesh Actor</strong> in the <strong>Outliner</strong>, select it, and find the applied <strong>Material Instance</strong> in its <strong>Details Panel</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.05hrs. This is the direct way to identify the material asset assigned to a specific actor in the level.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Go to the <strong>Content Browser</strong> and search for 'Cloud' or 'Nebula' to find potential materials.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. This might find many materials, but doesn't guarantee finding the one specifically applied to the problematic actor without manually checking each.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Right-click the mesh in the viewport and choose 'Find in Content Browser'.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. This would find the <strong>Static Mesh</strong> asset itself, not directly the material applied to the actor in the level (unless it's directly assigned to the mesh asset). It's more efficient to select the actor.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Examine the <strong>Project Settings</strong> under the 'Rendering' section for any global material overrides.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. <strong>Project Settings</strong> control global rendering features, not the specific material assigned to a particular mesh actor.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "materialsshaders",
            "title": "Access Parent Material for Analysis",
            "prompt": "<p>You've identified the applied <strong>Material Instance</strong> (e.g., <strong>MI_Volumetric_Cloud</strong>). To understand the shader's logic and source of complexity, what's your next move?</p>",
            "choices": [
                {
                    "text": "<p>Open the <strong>Material Instance</strong> and trace it back to its <strong>Parent Material</strong> (e.g., <strong>M_Volumetric_Base</strong>) to analyze the shader graph.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. The <strong>Parent Material</strong> contains the actual shader graph logic, while the <strong>Material Instance</strong> only overrides exposed parameters.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Directly modify parameters within the <strong>Material Instance</strong> to try and reduce complexity.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Without understanding the <strong>Parent Material</strong>'s structure, blindly changing parameters in the instance is a trial-and-error approach and may not address the root cause.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Right-click the <strong>Material Instance</strong> in the <strong>Content Browser</strong> and select 'Find References'.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. This would show where the material is used, not how it's constructed or why it's complex.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Create a brand new material from scratch and assign it to the mesh.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. This is a drastic measure and avoids diagnosing and fixing the existing, potentially reusable, material.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "materialsshaders",
            "title": "Identify Complex Material Function",
            "prompt": "<p>You are now in the <strong>Parent Material</strong> (<strong>M_Volumetric_Base</strong>). Based on the description, the material uses <strong>World Position Offset (WPO)</strong> and simulates internal movement. Which element in the shader graph is likely responsible for the complex volumetric look and WPO, and thus the high shader complexity?</p>",
            "choices": [
                {
                    "text": "<p>Identify the custom <strong>Material Function</strong> (e.g., <code>MF_Noise_Iterator</code>) that is called multiple times to generate the volumetric look and <strong>WPO</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.2hrs. Custom <strong>Material Functions</strong> are common places for complex logic and potential performance bottlenecks, especially if iterated.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Look for the main <strong>World Position Offset</strong> input on the <strong>Main Material Node</strong> to see what's connected.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.1hrs. While this is the output, the actual complex calculation generating the WPO might be encapsulated deeper within a function, which this approach doesn't immediately reveal.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Check the material's <strong>Blend Mode</strong> and <strong>Shading Model</strong> in the <strong>Material Details</strong> panel.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While these affect performance, they don't explain the source of complex internal calculation within the shader graph itself, especially with a volumetric effect.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Inspect the connected texture nodes to ensure they are using optimal compression settings.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. Texture compression affects memory and sampling cost, but is unlikely to be the primary cause of extreme shader complexity (pink/red) related to a volumetric look and WPO.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "materialsshaders",
            "title": "Analyze Material Function Iteration Count",
            "prompt": "<p>You've identified the custom <strong>Material Function</strong> (<code>MF_Noise_Iterator</code>) as the source of complexity. How do you analyze this function to pinpoint the exact cause of the high instruction count?</p>",
            "choices": [
                {
                    "text": "<p>Open the <strong>Material Function</strong> and determine if it contains an expensive custom loop structure whose iteration count is controlled by a scalar parameter (e.g., <code>Iteration_Count</code>).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.3hrs. Identifying iterative loops and their control parameters is key to understanding and managing shader complexity for volumetric effects.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Right-click the <strong>Material Function</strong> node in the <strong>Parent Material</strong> and select 'View Stats' to see its shader instruction count.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While 'View Stats' is useful, it tells you the cost but not *why* it's costly or how to fix it. You need to open the function to understand its logic.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Look for any 'if' statements or complex branching logic inside the <strong>Material Function</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.1hrs. Branching can be expensive, but for volumetric effects, iterative noise generation is a more common source of high instruction count.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Delete sections of the <strong>Material Function</strong> one by one to isolate the problem.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.2hrs. This is a destructive and inefficient troubleshooting method that risks breaking the material entirely.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "materialsshaders",
            "title": "Check Material Instance Iteration Value",
            "prompt": "<p>You've identified that the <code>MF_Noise_Iterator</code> function contains a loop controlled by an <code>Iteration_Count</code> scalar parameter. Where would you check the current value for this parameter to confirm if it's set too high?</p>",
            "choices": [
                {
                    "text": "<p>Return to the <strong>Material Instance</strong> (<code>MI_Volumetric_Cloud</code>) and locate the exposed parameter <code>Iteration_Count</code> to check its value.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. Parameters exposed from the <strong>Parent Material</strong> are overridden and controlled at the <strong>Material Instance</strong> level.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Look at the default value of <code>Iteration_Count</code> directly within the <strong>Material Function</strong> itself.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The default value in the function might be reasonable, but the *instance* can override it, which is the more likely source of the problem.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Search the <strong>Content Browser</strong> for other assets that might be controlling this parameter.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.1hrs. The parameter is local to the material system and controlled by the instance, not external assets.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Add a <strong>Print String</strong> node in the <strong>Material Graph</strong> to output the parameter's value during runtime.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. Materials don't directly support <strong>Print String</strong> for debugging parameter values in the same way Blueprints do. Checking the instance is the correct approach.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "materialsshaders",
            "title": "Reduce Shader Iteration Count",
            "prompt": "<p>You've found that the <code>Iteration_Count</code> parameter in the <strong>Material Instance</strong> is set to an excessively high value (e.g., 64 or 128). How do you resolve the immediate performance spike caused by excessive shader instructions?</p>",
            "choices": [
                {
                    "text": "<p>Reduce the <code>Iteration_Count</code> parameter in the <strong>Material Instance</strong> to a reasonable real-time value (e.g., 16 or 20).</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. Reducing the loop iterations directly lowers the shader instruction count, significantly improving performance for complex volumetric calculations.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Try to solve the performance issue by disabling <strong>Ray Tracing</strong> in the <strong>Project Settings</strong> or <strong>Post Process Volume</strong>.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time:</strong> +0.5hrs. While disabling <strong>Ray Tracing</strong> might improve overall performance, it treats a symptom (slowness) and does not address the root cause of an expensive shader iteration count within the material itself.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Change the <strong>Material's Blend Mode</strong> to <code>Opaque</code> in the <strong>Parent Material</strong> to reduce overdraw.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While changing the blend mode will be important later, it's not the immediate solution for the excessive *shader instruction* cost stemming from the loop.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Increase the <code>Iteration_Count</code> even further to achieve a smoother visual effect, assuming it's a bug.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. This would exacerbate the performance problem, not solve it. A high iteration count is the direct cause of the current issue.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "materialsshaders",
            "title": "Enable Motion Vector Output for WPO",
            "prompt": "<p>The performance spike is resolved. However, the mesh still doesn't receive dynamic self-shadowing or external shadows correctly, and it uses <strong>World Position Offset (WPO)</strong>. What material setting is crucial for proper motion vector generation when using <strong>WPO</strong> with <code>Translucent</code> blend mode?</p>",
            "choices": [
                {
                    "text": "<p>In the <strong>Parent Material</strong>, under the <strong>Translucency</strong> section of the <strong>Material Details</strong>, enable the <code>Output Velocity</code> flag.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. <code>Output Velocity</code> is required for accurate motion blur and temporal anti-aliasing with WPO, which can also impact shadow rendering stability.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Connect the <strong>World Position Offset</strong> output to a custom <strong>Material Expression</strong> node.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. This is an incorrect understanding of how WPO works with motion vectors. The flag in the material details is the correct approach.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Enable <code>Responsive AA</code> in the <strong>Material Details</strong> under the <strong>Translucency</strong> section.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. <code>Responsive AA</code> helps with motion blur, but <code>Output Velocity</code> is specifically for making WPO contribute correctly to motion vectors.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Increase the <strong>Motion Blur</strong> strength in the <strong>Post Process Volume</strong> to compensate.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. This is a post-processing effect and won't fix the underlying issue of incorrect motion vector generation from the material's WPO.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "materialsshaders",
            "title": "Enable WPO in Ray Tracing",
            "prompt": "<p>You've enabled <code>Output Velocity</code> for <strong>WPO</strong>, but the shadowing failure persists, especially with dynamic lights. Given the usage of <strong>WPO</strong>, what material setting could specifically impact shadow accuracy with ray-traced features?</p>",
            "choices": [
                {
                    "text": "<p>Navigate to the <strong>Material Details</strong> panel (<strong>M_Volumetric_Base</strong>), <strong>General</strong> section, and check the box labeled <code>Apply World Position Offset in Ray Tracing</code>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.2hrs. This setting ensures that WPO is taken into account for ray-traced shadows and other ray-traced effects, crucial for correct shadow casting on dynamically deforming meshes.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Enable <code>Volumetric Translucent Shadows</code> in <strong>Project Settings</strong> to improve shadow quality for translucent objects.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time:</strong> +0.4hrs. While seemingly relevant, this setting is for specific volumetric light/fog effects. For custom translucent materials with <strong>WPO</strong>, a fundamental change to <code>Masked</code> blend mode is often required for reliable dynamic shadowing, which this setting does not address.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Add a <strong>Trace Start Offset</strong> node to the <strong>Material Graph</strong> to adjust shadow ray origins.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.15hrs. While <strong>Trace Start Offset</strong> can help with self-shadowing artifacts, it's not the primary setting for ensuring <strong>WPO</strong> is considered in ray-traced shadows globally.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Adjust the <strong>Shadow Bias</strong> settings on the problematic light sources.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.1hrs. <strong>Shadow Bias</strong> fine-tunes shadow rendering but doesn't address the fundamental issue of <strong>WPO</strong> geometry not being correctly represented in shadow calculations for translucent materials.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "materialsshaders",
            "title": "Change Blend Mode for Robust Shadowing",
            "prompt": "<p>Despite setting up <strong>WPO</strong> for ray tracing, the translucent material still struggles with robust dynamic self-shadowing and causes overdraw. What fundamental material change would address both the overdraw and enable reliable shadowing for complex shapes with <strong>WPO</strong>?</p>",
            "choices": [
                {
                    "text": "<p>Change the <strong>Material's Blend Mode</strong> from <code>Translucent</code> to <code>Masked</code> (or <code>Opaque</code> if complexity allows) in the <strong>Material Details</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.2hrs. <code>Masked</code> materials render opaque and can cast robust, per-pixel shadows, significantly reducing overdraw compared to <code>Translucent</code> while allowing for complex alpha cutouts.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Increase the <strong>Light Source Radius</strong> or <strong>Light Source Angle</strong> to try and soften the missing shadows.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time:</strong> +0.3hrs. This incorrectly assumes the light definition is too sharp. The problem is a fundamental limitation of translucent materials with dynamic shadows and <strong>WPO</strong>, not the light's properties.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Checking the mesh component's collision settings or trace channels.</p>",
                    "type": "wrong",
                    "feedback": "<p><strong>Extended Time:</strong> +0.2hrs. This incorrectly assumes the shadow failure is due to a misconfigured trace setting. Shadowing is handled by rendering pipelines, not collision or trace channels.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Change the material's <strong>Shading Model</strong> to <code>Clear Coat</code> or <code>Subsurface Profile</code>.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.1hrs. These <strong>Shading Models</strong> are for specific surface appearances and do not fundamentally address overdraw or shadowing issues with dynamic <strong>WPO</strong> on translucent geometry.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "materialsshaders",
            "title": "Replicate Soft Edges with Dithering",
            "prompt": "<p>You've changed the <strong>Material's Blend Mode</strong> to <code>Masked</code> to improve shadowing and reduce overdraw. However, the original translucent material had soft, fading edges that are now gone. How do you replicate these soft edges with the new <code>Masked</code> blend mode?</p>",
            "choices": [
                {
                    "text": "<p>In the <strong>Material Graph</strong>, reroute the existing <strong>Opacity</strong> logic through a <code>DitherTemporalAA</code> node.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.25hrs. The <code>DitherTemporalAA</code> node simulates soft translucency by dithering pixels over time, which works well with <code>Masked</code> blend mode.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Use the <strong>Opacity Mask Clip Value</strong> parameter in the <strong>Material Details</strong> to manually soften the edges.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.1hrs. This only sets a hard cutoff threshold for opacity, resulting in very sharp, aliased edges, not the desired soft fade.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Add a <strong>Fresnel</strong> node to the material and multiply it with the existing <strong>Opacity</strong> logic.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. A <strong>Fresnel</strong> node changes opacity based on camera angle, which is not suitable for replicating volumetric soft edges consistently.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Connect the <strong>Opacity</strong> logic directly to the <strong>Pixel Depth Offset</strong> input.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. <strong>Pixel Depth Offset</strong> is for depth modification, not for replicating visual translucency or soft masked edges.</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "materialsshaders",
            "title": "Connect Dithered Opacity Mask",
            "prompt": "<p>You've rerouted the <strong>Opacity</strong> logic through the <code>DitherTemporalAA</code> node. Where should the output of this node now be connected in the <strong>Material Graph</strong> to properly drive the masked material?</p>",
            "choices": [
                {
                    "text": "<p>Connect the output of the <code>DitherTemporalAA</code> node to the <code>Opacity Mask</code> input of the <strong>Main Material Node</strong>.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. The <code>Opacity Mask</code> input is specifically designed for <code>Masked</code> blend mode to define which pixels are cut out.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Connect the output to the <code>Opacity</code> input, as it's still needed even for masked materials.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. The <code>Opacity</code> input is only available for <code>Translucent</code> blend mode. For <code>Masked</code>, you must use <code>Opacity Mask</code>.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Connect the output to a <strong>Custom Output</strong> node for further processing.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While <strong>Custom Output</strong> can be used for advanced scenarios, the direct and intended path for masked alpha is the <code>Opacity Mask</code> input.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Connect the output to the <code>World Position Offset</code> input to influence the mesh's movement.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. This is incorrect; opacity logic should not be directly driving <strong>WPO</strong>. They serve different purposes.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "materialsshaders",
            "title": "Enable Dithered Opacity Setting",
            "prompt": "<p>You've connected the <code>DitherTemporalAA</code> output to the <code>Opacity Mask</code>. Is there a crucial related setting in the <strong>Material Details</strong> panel that needs to be enabled for <code>DitherTemporalAA</code> to function correctly with <code>Masked</code> blend mode?</p>",
            "choices": [
                {
                    "text": "<p>In the <strong>Material Details</strong> panel, locate the <strong>Masked</strong> section and ensure <code>Use Dithered Opacity</code> is checked.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. This setting is essential to tell the engine to process the <code>Opacity Mask</code> as dithered, allowing <strong>Temporal AA</strong> to blend the dither pattern for a smooth visual result.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Adjust the <code>Opacity Mask Clip Value</code> to a very low number.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While the clip value is part of masked materials, it's not directly responsible for enabling the dithered effect. A low clip value might also make the mesh appear denser than intended.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Enable <code>Decal Blend Mode</code> in the <strong>Material Details</strong> panel.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. <code>Decal Blend Mode</code> is for specific decal rendering and completely unrelated to making dithered opacity work on a standard mesh.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Check the <code>Responsive AA</code> setting in the <strong>Translucency</strong> section.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. <code>Responsive AA</code> is for general motion blur artifacts. <code>Use Dithered Opacity</code> is specifically for enabling temporal dithering on masked materials.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "materialsshaders",
            "title": "Refine Shadowing with Pixel Depth Offset",
            "prompt": "<p>The material now uses <code>Masked</code> blend mode with <code>DitherTemporalAA</code> for soft edges, improving overdraw and enabling basic shadowing. To further enhance shadowing quality, particularly near edges and to smoothly blend the <strong>WPO</strong> changes, which input on the <strong>Main Material Node</strong> should you utilize?</p>",
            "choices": [
                {
                    "text": "<p>Use the <code>Pixel Depth Offset</code> input (available on <code>Opaque</code>/<code>Masked</code> materials) to slightly offset the depth buffer based on the density calculation.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. <strong>Pixel Depth Offset</strong> can push pixels deeper into the scene, effectively fattening the mesh for shadow calculation and blending the WPO changes more smoothly at edges.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Connect the density calculation to the <code>World Position Offset</code> input again, with a slight adjustment.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. The density calculation is already used for the opacity mask and potentially WPO, but re-connecting it to WPO for shadowing refinement is redundant and potentially problematic.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Increase the <strong>Shadow Resolution</strong> in the <strong>Light's Details Panel</strong>.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.1hrs. While <strong>Shadow Resolution</strong> affects shadow quality, it's a light setting. <strong>Pixel Depth Offset</strong> is a material-level solution to improve how the mesh itself interacts with depth and shadows.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Add a <strong>Scene Depth</strong> node and use it to modify the opacity mask directly.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. Using <strong>Scene Depth</strong> can create interesting effects, but for explicit shadow quality and depth offsetting, <strong>Pixel Depth Offset</strong> is the intended input.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "materialsshaders",
            "title": "Verify Dynamic Self-Shadowing",
            "prompt": "<p>All material changes are complete, including using <code>Masked</code> blend mode, <code>DitherTemporalAA</code>, and <code>Pixel Depth Offset</code>. What is the crucial next step to confirm that dynamic self-shadowing is now correctly applied?</p>",
            "choices": [
                {
                    "text": "<p>Recompile the material and verify in the <code>Lit</code> view mode that dynamic self-shadowing is now correctly applied to the mesh.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.1hrs. After significant material changes, recompilation is necessary. Verifying in <code>Lit</code> view mode directly shows the visual result of shadowing.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Switch to <code>Wireframe</code> view mode to check for any mesh deformation issues.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. <code>Wireframe</code> view mode shows geometry, not lighting or shadows. It's irrelevant for verifying dynamic shadowing.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Use the console command <code>r.Shadow.Visualize 1</code> to inspect shadow maps.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. While useful for detailed shadow debugging, simply checking in the default <code>Lit</code> view is the most direct way to confirm the desired visual outcome.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Check the <strong>Material Statistics</strong> panel to confirm the instruction count.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.03hrs. While performance (instruction count) is important, this step is specifically about visually verifying the *shadowing* fix.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "materialsshaders",
            "title": "Final Performance Verification",
            "prompt": "<p>Dynamic self-shadowing is now visually correct in the <code>Lit</code> view mode. What is the final step to confirm that the overdraw and performance issues have been resolved?</p>",
            "choices": [
                {
                    "text": "<p>Return to the <code>Shader Complexity</code> view mode and confirm the shader is now rendering in green/yellow.</p>",
                    "type": "correct",
                    "feedback": "<p><strong>Optimal Time:</strong> +0.15hrs. This directly confirms the reduction in shader instruction count and overdraw, validating the performance fix.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Re-run <code>stat GPU</code> and compare results to the initial spike.</p>",
                    "type": "subtle",
                    "feedback": "<p><strong>Extended Time:</strong> +0.05hrs. While <code>stat GPU</code> is valid, the <code>Shader Complexity</code> view mode provides a direct visual confirmation of the per-pixel cost reduction, which was the original symptom.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Disable <strong>Anti-Aliasing</strong> in <strong>Project Settings</strong> to see if performance improves further.</p>",
                    "type": "obvious",
                    "feedback": "<p><strong>Extended Time:</strong> +0.10hrs. This would degrade visual quality unnecessarily and doesn't confirm the fix to the *material's* complexity.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Check the overall <strong>Frame Rate</strong> counter in the viewport.</p>",
                    "type": "plausible",
                    "feedback": "<p><strong>Extended Time:</strong> +0.08hrs. The frame rate counter shows overall performance, but <code>Shader Complexity</code> gives specific insight into the material's rendering cost.</p>",
                    "next": "step-17"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario, resolving both the severe overdraw and dynamic shadowing issues of the translucent volumetric mesh. Your estimated total time for optimal completion: 2.55 hours.</p>",
            "choices": [{"text": "Complete Scenario", "type": "correct", "feedback": "", "next": "end"}]
        }
    }
};
