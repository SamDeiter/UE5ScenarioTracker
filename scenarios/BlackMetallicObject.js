window.SCENARIOS['BlackMetallicObject'] = {
    "meta": {
        "title": "Metallic Asset Appears Pitch Black in Dynamic Scene",
        "description": "A highly reflective metallic statue has been placed into the level. Despite the level being well-lit using a dynamic directional light and having Lumen enabled, the statue appears uniformly pitch black in the viewport and in PIE. Other nearby non-metallic objects reflect light and shadows correctly. The material instance applied to the statue has Metallic set to 1.0 and Roughness set to 0.1. The object is clearly not receiving any environmental reflections or indirect light.",
        "estimateHours": 0.73,
        "category": "Lighting & Rendering"
    },
    "start": "step-1",
    "steps": {
        "step-1": {
            "skill": "lightingrendering",
            "title": "Step 1",
            "prompt": "<p>The metallic statue appears uniformly pitch black in the viewport. What's your first step to investigate?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Click on the black metallic statue directly in the viewport to select it.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.015hrs. Selecting the object is crucial to access its properties.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Open the Character Blueprint for the statue and check its animation curves.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. The statue is a static mesh, not a character, and animation curves are unrelated to its rendering properties.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>In the World Outliner, search for 'light' to find nearby light sources.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While lighting is relevant, the immediate problem is the statue itself. Focusing on light sources before selecting the object is premature.</p>",
                    "next": "step-1"
                },
                {
                    "text": "<p>Right-click on the statue in the viewport and choose 'Edit Material Instance'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This shortcut requires the object to be selected first for the material instance to be easily accessible and contextually correct.</p>",
                    "next": "step-1"
                }
            ]
        },
        "step-2": {
            "skill": "lightingrendering",
            "title": "Step 2",
            "prompt": "<p>The statue is still black, and viewport selection can be tricky. You need to reliably select it. How do you ensure it's selected and ready for inspection?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the World Outliner, locate the actor named 'SM_MetallicStatue' (or similar) and click on it to select it.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.015hrs. The World Outliner provides a reliable way to select specific actors in complex scenes.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Open the Content Browser and search for 'black_texture' to see if it's applied.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. The problem states the material is metallic and reflective. Searching for a 'black_texture' directly is a misdiagnosis and irrelevant.</p>",
                    "next": "step-2W_light"
                },
                {
                    "text": "<p>In the viewport, try to select the statue again, but this time use a selection box to encompass it.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. While another attempt at viewport selection, it doesn't offer a truly alternative, more reliable method compared to the World Outliner.</p>",
                    "next": "step-2"
                },
                {
                    "text": "<p>Use the 'Select All' button in the World Outliner to select every actor in the scene.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This selects too many objects, making it difficult to isolate the statue and inspect its specific properties.</p>",
                    "next": "step-2"
                }
            ]
        },
        "step-3": {
            "skill": "lightingrendering",
            "title": "Step 3",
            "prompt": "<p>The statue is selected. You need to verify its material assignment. Where in the Details panel do you find the material slot?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Details panel, scroll down to the 'Materials' category under the Static Mesh Component and identify the material slot.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. Materials are assigned to mesh components within an actor's details.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Right-click on the statue in the viewport and select 'Convert Static Mesh to Skeletal Mesh'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. This action fundamentally changes the mesh type, which is completely irrelevant to checking its material assignment and could lead to data loss.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Open the Material Editor (Content Browser -> Materials) and search for 'DefaultMaterial'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. This will open a generic material editor, but not necessarily the specific material instance applied to the statue, nor does it confirm its assignment.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>In the Details panel, look for a 'Material' property under the 'Rendering' section of the actor properties.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While related to rendering, the specific material slots are usually found directly under the Static Mesh Component's properties, not a general 'Rendering' section for the actor itself.</p>",
                    "next": "step-3"
                }
            ]
        },
        "step-4": {
            "skill": "lightingrendering",
            "title": "Step 4",
            "prompt": "<p>The material slot is identified, and it contains the 'M_MetallicStatue_Inst' material instance. How do you open this material instance to inspect its parameters?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Click the magnifying glass icon next to the material slot, or double-click the assigned Material Instance thumbnail, to open its editor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. Opening the Material Instance Editor is the direct way to inspect and modify its parameters.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Right-click the material slot and select 'Create New Material'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. This would create a brand new material, discarding or ignoring the existing material instance and its settings.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Drag the material from the Content Browser into the slot again.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This action reassigns the material, but does not open its editor for inspection.</p>",
                    "next": "step-4"
                },
                {
                    "text": "<p>Click the 'Reset to Default' button next to the material slot.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This would reset the material assignment, potentially losing track of the problematic material or masking an issue if it was correct.</p>",
                    "next": "step-4"
                }
            ]
        },
        "step-5": {
            "skill": "lightingrendering",
            "title": "Step 5",
            "prompt": "<p>Inside the Material Instance Editor, you need to confirm it's behaving like a metal. What's the key parameter to check for metallic appearance?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Locate the 'Metallic' parameter (checkbox or slider) and confirm its value is set to 1.0 (or fully enabled).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.015hrs. A 'Metallic' value of 1.0 is essential for physically-based metallic rendering.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Search for 'Tessellation Multiplier' and adjust it to a high value.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Tessellation affects mesh detail, not the fundamental metallic appearance or reflectivity.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Check the 'Base Color' parameter to see if it's set to black.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While Base Color is important, a metallic material with 1.0 metallic will primarily show reflections, even with a dark base color. This isn't the primary check for *metallic* behavior.</p>",
                    "next": "step-5"
                },
                {
                    "text": "<p>Ensure the 'Specular' parameter is enabled or set to a high value.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Specular is related to reflections, but in a PBR workflow, 'Metallic' is the primary toggle for a metallic surface's reflection behavior.</p>",
                    "next": "step-5"
                }
            ]
        },
        "step-6": {
            "skill": "lightingrendering",
            "title": "Step 6",
            "prompt": "<p>The 'Metallic' parameter is correctly set to 1.0. Now, how do you ensure the statue is *highly reflective* rather than matte?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify the 'Roughness' parameter is set to a low value (e.g., 0.1) to allow for clear, mirror-like reflections.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.015hrs. Low roughness values are critical for sharp, clear reflections on metallic surfaces.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Adjust the 'Emissive Color' parameter to a bright value.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Emissive color makes an object appear to glow, but does not contribute to its reflectivity.</p>",
                    "next": "step-6W_roughness"
                },
                {
                    "text": "<p>Check the 'Normal Map' input to ensure it's connected and has detail.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. A normal map adds surface detail but doesn't control the overall *amount* or *clarity* of reflections.</p>",
                    "next": "step-6"
                },
                {
                    "text": "<p>Set the 'Roughness' parameter to 0.5 to make it semi-glossy.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While 0.5 is a valid roughness, the problem describes a 'highly reflective' object, which implies a much lower roughness than semi-glossy.</p>",
                    "next": "step-6"
                }
            ]
        },
        "step-7": {
            "skill": "lightingrendering",
            "title": "Step 7",
            "prompt": "<p>Material properties (Metallic=1.0, Roughness=0.1) seem correct. You now suspect object-level rendering settings on the actor itself. Where do you start looking for fundamental object properties?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>With the statue still selected, go to the Details panel and find the 'Transform' category.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. The 'Transform' category contains basic object properties like position, rotation, scale, and mobility.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Open the level blueprint and search for any references to the statue.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Level blueprints are for scripting game logic; fundamental object rendering properties are not typically found or changed there.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>In the Project Settings, navigate to the 'Physics' section.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Physics settings are for collision and simulation, not directly for visual rendering properties of a static mesh.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>In the World Outliner, right-click the statue and select 'Edit Bounding Box'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The bounding box defines the object's extents, but doesn't contain the rendering flags or mobility settings you need to check.</p>",
                    "next": "step-7"
                }
            ]
        },
        "step-8": {
            "skill": "lightingrendering",
            "title": "Step 8",
            "prompt": "<p>You're checking fundamental rendering properties that might affect dynamic lighting and reflections. What's a critical setting under the 'Transform' category that impacts how an object interacts with dynamic light?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Under the 'Transform' category, locate 'Mobility' and ensure it is set to 'Movable' for full dynamic lighting and reflections with Lumen.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.04hrs. 'Movable' mobility is essential for objects to fully interact with dynamic lighting systems like Lumen, including casting dynamic shadows and receiving dynamic global illumination and reflections.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>Change the statue's 'Scale' to 0.1 in all axes.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Resizing the object won't resolve issues with its rendering or reflection properties, it will just make it smaller.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Set the 'Location' of the statue to (0,0,0).</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Moving the object to the origin won't resolve its rendering issue; it's a position adjustment, not a rendering property fix.</p>",
                    "next": "step-8"
                },
                {
                    "text": "<p>Change 'Mobility' to 'Stationary'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Stationary' actors can utilize some static lighting data but have limited dynamic interaction compared to 'Movable', potentially hindering full Lumen reflections and GI.</p>",
                    "next": "step-8"
                }
            ]
        },
        "step-9": {
            "skill": "lightingrendering",
            "title": "Step 9",
            "prompt": "<p>Mobility is correct. Now you need to delve deeper into rendering-specific flags for this actor that control its visibility and interaction with rendering features. Where is the main place for these?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Details panel, scroll down and expand the 'Rendering' category.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. The 'Rendering' category contains crucial visibility and rendering feature flags for individual actors.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Open the 'Build' menu and select 'Build Lighting Only'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Building lighting is for static lightmaps, which are irrelevant for a dynamic Lumen setup and won't fix object-specific rendering flags.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>In the World Settings, look for 'Lightmass Settings'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Lightmass settings are specifically for baked static lighting, not dynamic rendering flags on an actor.</p>",
                    "next": "step-9"
                },
                {
                    "text": "<p>In the Details panel, expand the 'Physics' category.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The 'Physics' category deals with collision and simulation, not direct visual rendering flags for the mesh.</p>",
                    "next": "step-9"
                }
            ]
        },
        "step-10": {
            "skill": "lightingrendering",
            "title": "Step 10",
            "prompt": "<p>Under the 'Rendering' category, what's the most basic visibility check to ensure the object is rendered at all?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Confirm that the 'Visible' checkbox is enabled within the 'Rendering' category.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.015hrs. If 'Visible' is unchecked, the object simply won't render in the scene.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Check the 'Collision Presets' to ensure it's set to 'BlockAll'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Collision settings control physical interaction, not whether an object is visually rendered.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Verify 'Receives Decals' is checked.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. 'Receives Decals' allows decals to project onto the object, but doesn't control its fundamental visibility.</p>",
                    "next": "step-10"
                },
                {
                    "text": "<p>Check 'Render CustomDepth Pass' is enabled.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. CustomDepth is for specific post-processing effects and doesn't affect general rendering visibility of the object itself.</p>",
                    "next": "step-10"
                }
            ]
        },
        "step-11": {
            "skill": "lightingrendering",
            "title": "Step 11",
            "prompt": "<p>The statue is visible, but still appears black. Its interaction with light sources might be faulty. What setting under 'Rendering' affects how it participates in lighting calculations?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Confirm the 'Cast Shadows' checkbox is enabled in the 'Rendering' category.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.015hrs. An object that doesn't cast shadows may not be fully integrated into the lighting environment, though this is less likely to cause a completely black object if other lights are present.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Disable 'Generate Overlap Events'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Overlap events are for gameplay logic and collision detection, completely unrelated to rendering or shadows.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Check 'Render in Main Pass' is enabled.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Render in Main Pass' is usually enabled by default for all visible objects. While necessary, it's a more fundamental render pass than the specific shadow casting property.</p>",
                    "next": "step-11"
                },
                {
                    "text": "<p>Ensure 'Shadow Two Sided' is checked.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Shadow Two Sided' is typically for thin meshes that need to cast shadows from both sides, not the primary cause of a thick, opaque object appearing black.</p>",
                    "next": "step-11"
                }
            ]
        },
        "step-12": {
            "skill": "lightingrendering",
            "title": "Step 12",
            "prompt": "<p>The statue is black despite being metallic and casting shadows. You suspect it's not receiving global illumination, which is key for indirect light. What specific setting controls this under 'Rendering'?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Within the 'Rendering' category, verify that 'Affects Global Illumination' is enabled.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.04hrs. This setting dictates whether the object contributes to and receives global illumination, which is crucial for indirect lighting with Lumen.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>In the Project Settings, disable 'CPU Throttling'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. CPU throttling is a performance optimization setting, entirely unrelated to whether an object receives global illumination.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Check if 'Use Emissive for Static Lighting' is enabled.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. This setting is specifically for baked static lighting and how emissive materials interact with it, not dynamic global illumination from Lumen.</p>",
                    "next": "step-12"
                },
                {
                    "text": "<p>Confirm 'Lightmap Resolution' is set to a high value.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Lightmap resolution is for the quality of baked static lighting, not for dynamic global illumination (Lumen).</p>",
                    "next": "step-12"
                }
            ]
        },
        "step-13": {
            "skill": "lightingrendering",
            "title": "Step 13",
            "prompt": "<p>Global Illumination seems enabled, but the statue remains black, implying issues with advanced rendering features like Ray Tracing (often used by Lumen). Where do you find the actor's specific setting for Ray Tracing visibility?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Scroll further down in the 'Rendering' category of the Details panel to locate the 'Visible in Ray Tracing' property.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. 'Visible in Ray Tracing' directly controls if the object is considered by ray tracing effects like Lumen reflections.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Open the Output Log and search for 'Ray Tracing' errors.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. While the Output Log can show errors, checking a specific setting directly is a more efficient first step than hunting for potential error messages.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>In the 'Project Settings', navigate to the 'Ray Tracing' section to adjust global settings.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Project settings are global, but you should first check the specific actor's settings before moving to a global configuration.</p>",
                    "next": "step-13"
                },
                {
                    "text": "<p>Look for 'Supports Ray Tracing' under the Static Mesh asset's details in the Content Browser.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. That's a property of the mesh asset itself, while 'Visible in Ray Tracing' is an instance-specific override on the actor in the scene.</p>",
                    "next": "step-13"
                }
            ]
        },
        "step-14": {
            "skill": "lightingrendering",
            "title": "Step 14",
            "prompt": "<p>You've found the 'Visible in Ray Tracing' setting. Given the problem (no reflections), what should its state be?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Confirm that the 'Visible in Ray Tracing' checkbox is enabled (checked).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.05hrs. For Lumen reflections and global illumination to fully work, the object must be visible to ray tracing queries.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Disable 'Generate Mesh Distance Fields'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Mesh distance fields are used for various effects (like ambient occlusion, soft shadows), but disabling them won't fix a lack of ray-traced reflections.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Set 'Light Propagation Volume' to a high intensity.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Light Propagation Volume is an older global illumination technique, generally not used in conjunction with Lumen.</p>",
                    "next": "step-14"
                },
                {
                    "text": "<p>Ensure 'Cast Ray Traced Shadows' is checked.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While important for shadows, 'Cast Ray Traced Shadows' only dictates if the object *casts* shadows via ray tracing, not if it's *visible* to rays for reflections or GI.</p>",
                    "next": "step-14"
                }
            ]
        },
        "step-15": {
            "skill": "lightingrendering",
            "title": "Step 15",
            "prompt": "<p>The 'Visible in Ray Tracing' setting was unchecked. What's your immediate action?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Check the 'Visible in Ray Tracing' box to enable it.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. Enabling this setting allows the statue to participate in ray-traced lighting and reflections, which Lumen relies on.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Restart the Unreal Engine editor to apply the change.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Most changes in the Details panel are applied immediately in the editor; restarting is usually unnecessary for this type of setting.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Change the 'Static Mesh' asset to a different one and then back again.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. This action is pointless; it won't affect the 'Visible in Ray Tracing' property on the actor instance.</p>",
                    "next": "step-15"
                },
                {
                    "text": "<p>Enable 'Evaluate World Position Offset in Ray Tracing' instead.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This setting is for specific mesh deformation (WPO) within ray tracing, not for the general visibility of the object to ray tracing rays.</p>",
                    "next": "step-15"
                }
            ]
        },
        "step-16": {
            "skill": "lightingrendering",
            "title": "Step 16",
            "prompt": "<p>You've enabled 'Visible in Ray Tracing'. What's the next logical step to check if this resolved the issue?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Observe the statue in the viewport to see if it now correctly reflects the scene and receives indirect light.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Directly observing the result in the viewport is the fastest way to confirm if a visual change has been effective.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Run a 'Shader Complexity' visualization.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Shader complexity visualizes rendering cost, not whether reflections or lighting are correctly appearing.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Open the console and type 'stat fps'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Checking the frame rate is a performance metric, not a verification of visual correctness for the statue.</p>",
                    "next": "step-16"
                },
                {
                    "text": "<p>Export the statue as an FBX file to inspect it in an external viewer.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.1hrs. This is an unnecessarily drastic and time-consuming step for an in-editor visual check.</p>",
                    "next": "step-16"
                }
            ]
        },
        "step-17": {
            "skill": "lightingrendering",
            "title": "Step 17",
            "prompt": "<p>The statue is still black or not reflecting properly, even after enabling 'Visible in Ray Tracing'. You need to check global rendering configurations for Lumen. Where are these located?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Go to 'Edit' in the main menu bar and select 'Project Settings'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.015hrs. Project Settings contains global configurations for the entire game, including core rendering methods.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Open the 'Asset Actions' menu for the statue and select 'Export'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. This action exports the asset, which is completely unrelated to checking global engine settings.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Go to 'Window' -> 'Output Log' to review recent engine messages.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The Output Log displays messages and errors, but isn't where you would configure global rendering settings.</p>",
                    "next": "step-17"
                },
                {
                    "text": "<p>Open 'Editor Preferences' (Edit -> Editor Preferences).</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Editor Preferences configure the behavior of the editor itself, not the runtime rendering settings of the project.</p>",
                    "next": "step-17"
                }
            ]
        },
        "step-18": {
            "skill": "lightingrendering",
            "title": "Step 18",
            "prompt": "<p>You're in Project Settings. Where do you find the core rendering methods, including those for Global Illumination and Reflections, for the entire project?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the left-hand navigation pane of Project Settings, scroll down and select the 'Rendering' category.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.015hrs. The 'Rendering' section within Project Settings holds all the major rendering configuration options.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Navigate to 'Maps & Modes'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. 'Maps & Modes' configure default levels and game modes, unrelated to rendering methods.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Search for 'Input' settings.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Input settings manage user controls and key bindings, not rendering features.</p>",
                    "next": "step-18"
                },
                {
                    "text": "<p>Select 'Engine - General Settings'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While general engine settings, it's not as specific as the dedicated 'Rendering' category for these detailed options.</p>",
                    "next": "step-18"
                }
            ]
        },
        "step-19": {
            "skill": "lightingrendering",
            "title": "Step 19",
            "prompt": "<p>In the Project Settings -> Rendering section, you need to verify the global illumination system is correctly set up for Lumen. What's the key setting to confirm?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Under the 'Global Illumination' category, confirm 'Global Illumination Method' is set to 'Lumen'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. This is the primary setting to enable Lumen for global illumination across the entire project.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Enable 'Motion Blur' to see if reflections improve.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Motion blur is a post-processing effect and has no direct impact on the functionality of global illumination.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Set 'Ambient Occlusion Method' to 'SSAO'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. SSAO (Screen Space Ambient Occlusion) is a separate, less advanced ambient occlusion method, not Lumen GI.</p>",
                    "next": "step-19"
                },
                {
                    "text": "<p>Ensure 'Ray Tracing Global Illumination' is enabled.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While Lumen often uses ray tracing, 'Global Illumination Method' set to 'Lumen' is the overarching setting; 'Ray Tracing Global Illumination' is a sub-component within older ray tracing settings.</p>",
                    "next": "step-19"
                }
            ]
        },
        "step-20": {
            "skill": "lightingrendering",
            "title": "Step 20",
            "prompt": "<p>Global Illumination is confirmed to be Lumen. Now, for reflections across the entire project, what's the corresponding global setting to ensure Lumen is active?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Under the 'Reflections' category, confirm 'Reflection Method' is set to 'Lumen'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. This is the primary setting to enable Lumen for reflections across the entire project.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Increase the 'Max FPS' setting to a higher value.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Max FPS is a performance cap, unrelated to the method used for reflections.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Enable 'Screen Space Reflections'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Screen Space Reflections (SSR) is an older, limited reflection method and generally superseded by Lumen for superior results.</p>",
                    "next": "step-20"
                },
                {
                    "text": "<p>Set 'Ray Tracing Reflections' to 'Enabled'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Similar to GI, 'Reflection Method' set to 'Lumen' is the main control. 'Ray Tracing Reflections' is a sub-setting, often enabled automatically or within older RT configurations.</p>",
                    "next": "step-20"
                }
            ]
        },
        "step-21": {
            "skill": "lightingrendering",
            "title": "Step 21",
            "prompt": "<p>Global Lumen settings are good. You need to ensure the environment light source that provides indirect lighting and reflections for Lumen is configured correctly. Which actor is crucial for this?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the World Outliner, locate and select the 'Sky Light' actor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. The Sky Light is responsible for capturing the overall environmental lighting and feeding it into Lumen for indirect illumination and reflections.</p>",
                    "next": "step-22"
                },
                {
                    "text": "<p>Select the 'Player Start' actor.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. The Player Start actor defines the spawn point for players and has no impact on environmental lighting or reflections.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Select the 'Atmospheric Fog' actor.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Atmospheric Fog affects the visual appearance of the sky and atmospheric density, but doesn't directly provide the global environmental lighting for Lumen.</p>",
                    "next": "step-21"
                },
                {
                    "text": "<p>Select the 'Directional Light' actor.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The Directional Light provides direct sunlight/moonlight. While crucial for overall scene lighting, the Sky Light is specifically responsible for the *environmental* reflections and indirect light that Lumen uses.</p>",
                    "next": "step-21"
                }
            ]
        },
        "step-22": {
            "skill": "lightingrendering",
            "title": "Step 22",
            "prompt": "<p>With the Sky Light selected, you need to ensure it's capturing the scene dynamically for Lumen's needs. What property defines this capture method?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Sky Light's Details panel, verify that 'Source Type' is set to 'SLS Captured Scene'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. 'SLS Captured Scene' ensures the Sky Light captures the dynamic environment, which is vital for Lumen's dynamic GI and reflections.</p>",
                    "next": "step-23"
                },
                {
                    "text": "<p>Change the 'Light Color' to black.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Setting the light color to black would simply remove the Sky Light's contribution, making the scene darker and exacerbating the problem.</p>",
                    "next": "step-22"
                },
                {
                    "text": "<p>Enable 'Cast Shadows' for the Sky Light.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Sky Lights generally contribute soft, ambient illumination; enabling 'Cast Shadows' typically has minimal or no desired effect for environmental reflections and GI.</p>",
                    "next": "step-22"
                },
                {
                    "text": "<p>Verify 'Source Type' is 'SLS Specified Cubemap'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. 'SLS Specified Cubemap' uses a static texture, preventing dynamic capture of the scene, which is less ideal for a fully dynamic Lumen setup.</p>",
                    "next": "step-22"
                }
            ]
        },
        "step-23": {
            "skill": "lightingrendering",
            "title": "Step 23",
            "prompt": "<p>Sky Light source type is correct ('SLS Captured Scene'). Is the Sky Light actually emitting enough light to contribute to reflections and indirect light?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Verify the 'Intensity' parameter of the Sky Light is a non-zero, sufficiently high value (e.g., 1.0).</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. A Sky Light with zero intensity will contribute no environmental light or reflections, making metallic objects appear black.</p>",
                    "next": "step-24"
                },
                {
                    "text": "<p>Delete the Sky Light actor from the scene.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Removing the Sky Light entirely will eliminate all ambient and environmental reflections, making the problem worse.</p>",
                    "next": "step-23W_reflection_captures"
                },
                {
                    "text": "<p>Change the 'Cubemap Resolution' to 16.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Setting the cubemap resolution too low would make the captured reflections very blurry, but it wouldn't fix an overall lack of intensity.</p>",
                    "next": "step-23"
                },
                {
                    "text": "<p>Set the 'Lower Hemisphere Color' to pure black.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While this affects the bottom half of the environment, it wouldn't explain an overall black statue that isn't receiving any light from above either.</p>",
                    "next": "step-23"
                }
            ]
        },
        "step-24": {
            "skill": "lightingrendering",
            "title": "Step 24",
            "prompt": "<p>Static checks are done, but the statue is still black. You need a visual debugging tool to inspect how reflections are actually being rendered in the engine. Where do you access these tools?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Editor Viewport toolbar (top left), click on the 'View Modes' dropdown.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.015hrs. The 'View Modes' dropdown provides access to various visualization buffers and rendering modes.</p>",
                    "next": "step-25"
                },
                {
                    "text": "<p>Open the 'Sequencer' window to check animation tracks.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Sequencer is for cinematic creation and animation, entirely unrelated to visualizing rendering buffers.</p>",
                    "next": "step-24"
                },
                {
                    "text": "<p>Open 'Developer Tools' -> 'Widget Reflector'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. The Widget Reflector is for debugging user interface elements, not scene rendering buffers.</p>",
                    "next": "step-24"
                },
                {
                    "text": "<p>Click the 'Show' dropdown in the viewport.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The 'Show' dropdown controls visibility of various scene elements, but not the detailed 'Buffer Visualization' modes needed here.</p>",
                    "next": "step-24"
                }
            ]
        },
        "step-25": {
            "skill": "lightingrendering",
            "title": "Step 25",
            "prompt": "<p>From 'View Modes', where do you find the tools to inspect different rendering passes like reflections, base color, or normals?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>From the 'View Modes' dropdown, hover over 'Buffer Visualization'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.015hrs. 'Buffer Visualization' contains a suite of modes to inspect different rendering buffers, which is ideal for diagnosing visual issues.</p>",
                    "next": "step-26"
                },
                {
                    "text": "<p>Select 'Lit' to go back to the default view mode.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.05hrs. You're likely already in 'Lit' mode; the goal is to delve deeper into rendering, not revert to the default.</p>",
                    "next": "step-25"
                },
                {
                    "text": "<p>Select 'Collision' to see the statue's collision meshes.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. The 'Collision' view mode displays collision geometry, not rendering data relevant to reflections.</p>",
                    "next": "step-25"
                },
                {
                    "text": "<p>Hover over 'Show' and look for 'Reflections'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While 'Show' has a 'Reflections' toggle, it usually just controls if reflections are *drawn*, not allowing you to *visualize* the actual reflection buffer itself.</p>",
                    "next": "step-25"
                }
            ]
        },
        "step-26": {
            "skill": "lightingrendering",
            "title": "Step 26",
            "prompt": "<p>Under 'Buffer Visualization', which mode will show you the reflection data specifically, to see if anything is being reflected onto the statue?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>From the 'Buffer Visualization' submenu, select 'World Reflection' to inspect reflection data.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. 'World Reflection' buffer visualization directly displays the reflection data being sampled by objects in the scene.</p>",
                    "next": "step-27"
                },
                {
                    "text": "<p>Select 'Base Color' to see the statue's albedo.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Base Color displays the material's diffuse color, not its reflections.</p>",
                    "next": "step-26"
                },
                {
                    "text": "<p>Select 'Metallic' to see the metallic buffer.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. The 'Metallic' buffer shows the metallic property value, but not the actual reflected light from the environment.</p>",
                    "next": "step-26"
                },
                {
                    "text": "<p>Select 'Scene Depth' to inspect depth information.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Scene Depth shows distance from the camera, which is related to rendering but not the direct reflection data.</p>",
                    "next": "step-26"
                }
            ]
        },
        "step-27": {
            "skill": "lightingrendering",
            "title": "Step 27",
            "prompt": "<p>The 'World Reflection' buffer looks empty or incorrect around the statue. While Lumen uses dynamic reflections, legacy Reflection Capture actors can still sometimes interfere or provide fallback. Do you see any near the statue?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Visually inspect the viewport for any Sphere or Box Reflection Capture actors around the statue, or search for them in the World Outliner.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Identifying any static reflection captures is important to ensure they aren't causing conflicts or overriding Lumen's dynamic system.</p>",
                    "next": "step-28"
                },
                {
                    "text": "<p>Add a new 'Camera Actor' to the scene to get a different perspective.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Adding a camera won't help identify existing reflection capture actors or diagnose their influence.</p>",
                    "next": "step-27"
                },
                {
                    "text": "<p>Check the 'Lightmass Importance Volume' for its bounds.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. The Lightmass Importance Volume defines the area for static lightmass calculations, unrelated to dynamic Lumen reflections or reflection capture actors.</p>",
                    "next": "step-27"
                },
                {
                    "text": "<p>Search for 'Volumetric Clouds' in the World Outliner.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Volumetric Clouds are an environmental visual effect, not a source of local reflections for objects.</p>",
                    "next": "step-27"
                }
            ]
        },
        "step-28": {
            "skill": "lightingrendering",
            "title": "Step 28",
            "prompt": "<p>You've found a Reflection Capture actor near the statue. What do you check next to determine its relevance?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select the Reflection Capture actor and ensure its influence bounds encompass the statue.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. If a Reflection Capture exists, its influence bounds must cover the object for it to provide reflections (though with Lumen, these are often redundant).</p>",
                    "next": "step-29"
                },
                {
                    "text": "<p>Change the Reflection Capture actor's 'Light Channel' to 'Channel 3'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Light channels are for specific lighting groups, not for defining the physical influence area of a reflection capture.</p>",
                    "next": "step-28"
                },
                {
                    "text": "<p>Set its 'Capture Distance' to 0.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Setting the capture distance to 0 would make the reflection capture ineffective.</p>",
                    "next": "step-28"
                },
                {
                    "text": "<p>Recapture the reflection without checking its bounds first.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. Recapturing is pointless if the bounds don't cover the statue; it will still capture an irrelevant area.</p>",
                    "next": "step-28"
                }
            ]
        },
        "step-29": {
            "skill": "lightingrendering",
            "title": "Step 29",
            "prompt": "<p>Reflection Captures (if any) are confirmed. Lumen relies heavily on Post Process Volumes for global rendering settings. You need to ensure the overall scene rendering is configured for Lumen. Which actor is key for this?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the World Outliner, select the 'Post Process Volume' actor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. Post Process Volumes are crucial for overriding or defining global rendering settings, including Lumen's specific parameters.</p>",
                    "next": "step-30"
                },
                {
                    "text": "<p>Select the 'Blocking Volume' to see if it's obstructing anything.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Blocking volumes are for collision, not rendering configuration.</p>",
                    "next": "step-29"
                },
                {
                    "text": "<p>Select the 'Exponential Height Fog' actor.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Exponential Height Fog controls volumetric fog effects, not the core global illumination or reflection methods.</p>",
                    "next": "step-29"
                },
                {
                    "text": "<p>Select the 'Editor Sky Sphere' actor.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The Sky Sphere is a visual representation of the sky, not a configurable rendering volume for Lumen.</p>",
                    "next": "step-29"
                }
            ]
        },
        "step-30": {
            "skill": "lightingrendering",
            "title": "Step 30",
            "prompt": "<p>With the Post Process Volume selected, what's the first critical setting to ensure it applies its effects to the entire scene?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In its Details panel, verify 'Infinite Extent (Unbound)' is checked, or adjust the volume's bounds to cover the entire level.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.03hrs. If the Post Process Volume isn't unbound or its bounds don't cover the scene, its Lumen settings won't be applied to the statue.</p>",
                    "next": "step-31"
                },
                {
                    "text": "<p>Adjust the 'Exposure Compensation' to a very low value.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Exposure compensation affects brightness, not the coverage area of the post-process volume.</p>",
                    "next": "step-30"
                },
                {
                    "text": "<p>Set the 'Blend Weight' to 0.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. Setting the blend weight to 0 would effectively disable the entire Post Process Volume's effects.</p>",
                    "next": "step-30"
                },
                {
                    "text": "<p>Set the 'Post Process Material' slot to a custom material.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This would apply a custom post-process effect, but doesn't ensure the volume's fundamental coverage over the scene.</p>",
                    "next": "step-30"
                }
            ]
        },
        "step-31": {
            "skill": "lightingrendering",
            "title": "Step 31",
            "prompt": "<p>The Post Process Volume is active and covers the scene. You need to verify its Lumen-specific settings. How do you quickly find them within the Details panel?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Post Process Volume's Details panel, use the search bar to type 'Lumen'.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. The search bar is the most efficient way to quickly locate specific settings within the extensive Post Process Volume properties.</p>",
                    "next": "step-32"
                },
                {
                    "text": "<p>Open the console and type 'stat gpu'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. 'stat gpu' provides GPU performance statistics, not configuration settings for the Post Process Volume.</p>",
                    "next": "step-31"
                },
                {
                    "text": "<p>Scroll through every single setting in the Details panel manually.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While eventually effective, manually scrolling through hundreds of settings is inefficient and time-consuming.</p>",
                    "next": "step-31"
                },
                {
                    "text": "<p>Look under the 'Rendering Features' category for 'Ambient Occlusion'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While Ambient Occlusion is a rendering feature, it's not the specific 'Lumen' settings you're looking for to confirm GI and Reflections.</p>",
                    "next": "step-31"
                }
            ]
        },
        "step-32": {
            "skill": "lightingrendering",
            "title": "Step 32",
            "prompt": "<p>You've searched for Lumen settings within the Post Process Volume. Now, confirm its Global Illumination configuration.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Under the 'Lumen Global Illumination' section, verify 'Method' is 'Lumen' (or 'Final Gather' depending on engine version) and 'Intensity' is greater than 0.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. These settings ensure Lumen's Global Illumination is actively contributing to the scene through the Post Process Volume.</p>",
                    "next": "step-33"
                },
                {
                    "text": "<p>Set 'SSR Intensity' to 1.0.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. SSR (Screen Space Reflections) is a separate reflection method, not Lumen Global Illumination.</p>",
                    "next": "step-32"
                },
                {
                    "text": "<p>Change 'Lumen Final Gather Quality' to 'Low'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. This only adjusts the quality, not whether Lumen GI is enabled or has a valid intensity, which are more critical for a black object.</p>",
                    "next": "step-32"
                },
                {
                    "text": "<p>Confirm 'Lumen Scene Lighting' is enabled.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While related, the 'Method' and 'Intensity' parameters directly govern if Lumen GI is active and contributing, which is more crucial than just 'Lumen Scene Lighting'.</p>",
                    "next": "step-32"
                }
            ]
        },
        "step-33": {
            "skill": "lightingrendering",
            "title": "Step 33",
            "prompt": "<p>Lumen GI is confirmed. Now, confirm Lumen's reflection configuration within the Post Process Volume.</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Under the 'Lumen Reflections' section, verify 'Method' is 'Lumen' (or 'Final Gather') and 'Intensity' is greater than 0.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. These settings ensure Lumen's dynamic reflections are actively contributing to the scene through the Post Process Volume.</p>",
                    "next": "step-34"
                },
                {
                    "text": "<p>Enable 'Bloom' with a high intensity.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Bloom is a visual glow effect, entirely separate from the core reflection system.</p>",
                    "next": "step-33"
                },
                {
                    "text": "<p>Set 'Lumen Max Trace Distance' to a very small value.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.1hrs. While trace distance is important, setting it very low would limit reflections, not confirm they are active and functional with a positive intensity.</p>",
                    "next": "step-33"
                },
                {
                    "text": "<p>Check 'Lumen Surface Cache'.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The Surface Cache is an internal Lumen optimization, not the direct user-facing setting for enabling or intensifying reflections.</p>",
                    "next": "step-33"
                }
            ]
        },
        "step-34": {
            "skill": "lightingrendering",
            "title": "Step 34",
            "prompt": "<p>Post Process Volume settings for Lumen are confirmed. You've made many global checks. Let's return to the specific object. What's the next step?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Re-select the black metallic statue actor in the viewport or World Outliner.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.01hrs. After global changes, it's good practice to re-select the problematic actor to ensure you're viewing its current state and have its properties available.</p>",
                    "next": "step-35"
                },
                {
                    "text": "<p>Close the project and reopen it.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. This is an unnecessary and time-consuming step for simply re-selecting an actor.</p>",
                    "next": "step-34"
                },
                {
                    "text": "<p>Select the Directional Light instead.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. The focus has shifted back to the statue after global checks; checking the directional light again is less relevant at this stage.</p>",
                    "next": "step-34"
                },
                {
                    "text": "<p>Select the statue's Static Mesh Asset in the Content Browser.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This selects the asset, not the actor instance in the scene, meaning you won't have access to its scene-specific rendering properties.</p>",
                    "next": "step-34"
                }
            ]
        },
        "step-35": {
            "skill": "lightingrendering",
            "title": "Step 35",
            "prompt": "<p>With the statue re-selected, given all the checks made, what's a critical object-specific flag to double-check regarding advanced rendering that might have been inadvertently changed or overlooked?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Details panel for the statue, reconfirm that 'Visible in Ray Tracing' under the 'Rendering' category is still checked.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. This setting is frequently the cause of objects not appearing in Lumen's ray-traced effects; a double-check is prudent after many other changes.</p>",
                    "next": "step-36"
                },
                {
                    "text": "<p>Change the 'Mobility' to 'Static'.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Changing mobility to 'Static' would fundamentally prevent it from receiving dynamic Lumen GI and reflections, worsening the problem.</p>",
                    "next": "step-35"
                },
                {
                    "text": "<p>Check 'Receives Decals' again.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. This setting is for decal projection, not directly related to its visibility within ray-traced reflections.</p>",
                    "next": "step-35"
                },
                {
                    "text": "<p>Verify 'Evaluate World Position Offset in Ray Tracing' is enabled.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. This specific setting is for World Position Offset effects, not general visibility to ray tracing, which is more critical for this problem.</p>",
                    "next": "step-35"
                }
            ]
        },
        "step-36": {
            "skill": "lightingrendering",
            "title": "Step 36",
            "prompt": "<p>The statue still appears black in the editor. The original problem also stated it was black in PIE. What property might cause an object to be visible in the editor but hidden during gameplay?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>In the Static Mesh Actor's Details panel, search for 'Hidden In Game' and ensure it is NOT checked.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. If 'Hidden In Game' is checked, the object will not render when playing the game, which aligns with the PIE problem description.</p>",
                    "next": "step-37"
                },
                {
                    "text": "<p>Set the statue's 'Scale' to 0 in all axes.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Setting the scale to 0 would make it effectively invisible in both editor and game, but it's not the 'hidden in game' specific flag.</p>",
                    "next": "step-36"
                },
                {
                    "text": "<p>Check if 'Collision Enabled' is set to 'No Collision'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. Collision settings control physical interaction, not visual rendering visibility in-game.</p>",
                    "next": "step-36"
                },
                {
                    "text": "<p>Toggle the 'Visible' checkbox off and then back on.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. The 'Visible' checkbox primarily affects editor visibility, not the separate 'Hidden In Game' flag that specifically controls runtime visibility.</p>",
                    "next": "step-36"
                }
            ]
        },
        "step-37": {
            "skill": "lightingrendering",
            "title": "Step 37",
            "prompt": "<p>You've checked numerous settings, and the statue is still black in the editor viewport. The original problem stated it's also black in PIE. What's the definitive next step to confirm behavior in a 'game-like' environment?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Click the 'Play' button in the toolbar to enter 'Play In Editor' (PIE) mode.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. Entering PIE mode is the most direct and efficient way to test runtime behavior within the editor.</p>",
                    "next": "step-38"
                },
                {
                    "text": "<p>Launch a standalone game instance.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. While a valid test, launching a standalone game is typically slower and less convenient for quick debugging iterations than PIE.</p>",
                    "next": "step-37"
                },
                {
                    "text": "<p>Build the project and run it from an executable.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. Building an executable is a very time-consuming step and overkill for this stage of debugging.</p>",
                    "next": "step-37"
                },
                {
                    "text": "<p>Click 'Simulate' in the viewport.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. 'Simulate' mode runs physics and blueprints in the editor, but often doesn't fully replicate the rendering environment and game logic of PIE mode.</p>",
                    "next": "step-37"
                }
            ]
        },
        "step-38": {
            "skill": "lightingrendering",
            "title": "Step 38",
            "prompt": "<p>You're in PIE. What is the final verification step to confirm the issue is resolved?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Observe the statue within PIE to confirm it now renders correctly with reflections and global illumination.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.02hrs. The ultimate goal is to see the statue rendering correctly in the game environment, so direct observation is the final confirmation.</p>",
                    "next": "conclusion"
                },
                {
                    "text": "<p>Press 'P' to toggle the physics debug visualization.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.15hrs. Physics visualization is unrelated to the visual rendering of reflections and global illumination.</p>",
                    "next": "step-38"
                },
                {
                    "text": "<p>Open the console and type 'show collision'.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.05hrs. 'show collision' displays collision meshes, not the visual rendering state of the object.</p>",
                    "next": "step-38"
                },
                {
                    "text": "<p>Check the 'World Outliner' in PIE mode to ensure the statue is listed.</p>",
                    "type": "subtle",
                    "feedback": "<p>Extended Time: +0.05hrs. While confirming its presence, this doesn't verify its visual rendering correctness, which is the actual problem.</p>",
                    "next": "step-38"
                }
            ]
        },
        "step-2W_light": {
            "skill": "lightingrendering",
            "title": "Step 2W_Light",
            "prompt": "<p>Despite the description, you suspect the directional light is causing the blackness. What's your immediate action regarding the main light source?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Select the Directional Light in the World Outliner to inspect its properties, but do not change anything unless a problem is found.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.2hrs. It's good to inspect, but the problem description indicated the level is well-lit. Making changes prematurely is risky.</p>",
                    "next": "step-3"
                },
                {
                    "text": "<p>Delete the primary Directional Light actor from the scene entirely.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.4hrs. Deleting the primary light source will plunge the entire scene into darkness, worsening the overall problem and making debugging much harder.</p>",
                    "next": "step-2W_light"
                },
                {
                    "text": "<p>Modify the Directional Light's 'Light Color' to pure black to see if it affects anything.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.3hrs. Setting the light color to black would predictably make everything darker, including other objects that were previously lit correctly, not just the statue.</p>",
                    "next": "step-2W_light"
                }
            ]
        },
        "step-6W_roughness": {
            "skill": "lightingrendering",
            "title": "Step 6W_Roughness",
            "prompt": "<p>You decide to make the statue less reflective, potentially thinking the current reflections are too harsh. What's your immediate adjustment to achieve a matte look?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Change the 'Roughness' parameter to 1.0 (matte) in the Material Instance Editor.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.15hrs. Setting roughness to 1.0 makes a surface completely matte, preventing any clear reflections.</p>",
                    "next": "step-7"
                },
                {
                    "text": "<p>Delete the Material Instance and assign a 'WorldGridMaterial' to the statue.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.3hrs. This drastic action replaces the material entirely, losing all original settings and potentially breaking other visual aspects of the statue.</p>",
                    "next": "step-6W_roughness"
                },
                {
                    "text": "<p>Set the 'Metallic' parameter to 0.0 (non-metallic).</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. This would make the material non-metallic, changing its entire surface response, which is different from simply making a metallic material matte.</p>",
                    "next": "step-6W_roughness"
                }
            ]
        },
        "step-23W_reflection_captures": {
            "skill": "lightingrendering",
            "title": "Step 23W_Reflection_Captures",
            "prompt": "<p>You incorrectly suspect the reflections are not working due to missing static reflection captures, despite Lumen being active. What's your immediate action to address this mistaken belief?</p><p><strong>What do you do next?</strong></p>",
            "choices": [
                {
                    "text": "<p>Add a Sphere Reflection Capture actor near the statue, then select 'Build Reflection Captures' from the Build menu.</p>",
                    "type": "correct",
                    "feedback": "<p>Optimal Time: +0.1hrs. This action attempts to use a legacy reflection method. While it won't solve the Lumen issue, it fits the mistaken diagnosis for this detour.</p>",
                    "next": "step-24"
                },
                {
                    "text": "<p>Disable Lumen entirely in Project Settings to force the use of static reflection captures.</p>",
                    "type": "obvious",
                    "feedback": "<p>Extended Time: +0.3hrs. Disabling Lumen would degrade overall lighting quality and remove dynamic GI/reflections, a worse outcome than simply adding static captures.</p>",
                    "next": "step-23W_reflection_captures"
                },
                {
                    "text": "<p>Place a 'Planar Reflection' actor near the statue for more accurate reflections.</p>",
                    "type": "plausible",
                    "feedback": "<p>Extended Time: +0.2hrs. Planar reflections are for specific flat surfaces (e.g., mirrors, water) and are very expensive; they are not a general solution for environmental reflections.</p>",
                    "next": "step-23W_reflection_captures"
                }
            ]
        },
        "conclusion": {
            "skill": "complete",
            "title": "Scenario Complete",
            "prompt": "<p>Congratulations! You have successfully completed this debugging scenario.</p>",
            "choices": []
        }
    }
};
