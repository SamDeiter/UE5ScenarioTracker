window.SCENARIOS["DataLayerStreamingOverride"] = {
  meta: {
    title: "Decorative Props Popping In Too Close in World Partition",
    description:
      "We have recently completed placing a dense patch of static mesh actors (bushes and rocks) in a new wilderness area using a dedicated Data Layer. When testing in PIE, the surrounding landscape tiles and nearby structural meshes stream in correctly at about 500 meters. However, the newly placed bushes and rocks only become visible when the player is extremely close (approximately 10 meters away), causing obvious and jarring visual popping as the player approaches the area.",
    estimateHours: 0.8,
    category: "World Partition & Streaming",
    tokens_used: 10826,
  },
  setup: [
    {
      action: "set_ue_property",
      scenario: "DataLayerStreamingOverride",
      step: "step-0",
    },
  ],
  fault: {
    description: "Initial problem state",
    visual_cue: "Visual indicator",
  },
  expected: {
    description: "Expected resolved state",
    validation_action: "verify_fix",
  },
  fix: [
    {
      action: "set_ue_property",
      scenario: "DataLayerStreamingOverride",
      step: "final",
    },
  ],
  start: "step-1",
  steps: {
    "step-1": {
      skill: "worldpartition",
      title: "Investigate Pop-in Issue",
      image_path:
        "assets/generated/DataLayerStreamingOverride/step-1.png",
      prompt:
        "You're observing decorative props (bushes, rocks) popping in too close (10m) in a World Partition map, while other elements stream correctly (500m). This causes jarring visuals. What's your first move?",
      choices: [
        {
          text: "Select a subset of the problematic Static Mesh Actors (bushes/rocks) in the Level Viewport or the Outliner.",
          type: "correct",
          feedback:
            "Optimal Time: +0.05hrs. Identifying and isolating the affected actors is the first logical step to inspect their specific properties.",
          next: "step-2",
        },
        {
          text: "Open World Settings and immediately generate new Hierarchical Level of Detail (HLOD) meshes for the area.",
          type: "obvious",
          feedback:
            "Extended Time: +0.25hrs. HLODs optimize rendering distance, not primarily streaming distance for individual actors. This is a time-consuming process and unlikely to be the root cause.",
          next: "wrong-hlod-path-1",
        },
        {
          text: "Open the Project Settings to review engine-wide World Partition settings.",
          type: "plausible",
          feedback:
            "Extended Time: +0.1hrs. Project Settings contain global engine configurations, but specific World Partition map settings are found in World Settings. This detour is unlikely to yield results.",
          next: "step-1",
        },
        {
          text: "Check the individual Static Mesh Asset properties in the Content Browser for the bushes and rocks (e.g., LOD settings, collision).",
          type: "subtle",
          feedback:
            "Extended Time: +0.15hrs. The issue is with the actor *instance* streaming behavior in World Partition, not the mesh asset's intrinsic LODs or collision. Asset properties won't control when the actor instances stream in.",
          next: "wrong-asset-props-path-1",
        },
      ],
    },
    "step-2": {
      skill: "worldpartition",
      title: "Check Actor Spatial Loading",
      image_path:
        "assets/generated/DataLayerStreamingOverride/step-2.png",
      prompt:
        "You've selected a subset of the problematic actors. What's the most relevant property to check in the Details panel regarding their World Partition streaming behavior?",
      choices: [
        {
          text: "Examine the 'Is Spatially Loaded' checkbox in the Details panel.",
          type: "correct",
          feedback:
            "Optimal Time: +0.05hrs. Confirming 'Is Spatially Loaded' is enabled ensures the actors are indeed managed by World Partition's spatial grid streaming.",
          next: "step-3",
        },
        {
          text: "Look for a 'Visibility Distance' or 'Draw Distance' setting directly on the actor.",
          type: "obvious",
          feedback:
            "Extended Time: +0.05hrs. While actors have culling properties, World Partition's streaming is managed by a different system. Direct 'Draw Distance' is not the primary control here.",
          next: "step-2",
        },
        {
          text: "Check the 'Cast Shadows' and 'Receives Decals' checkboxes for rendering optimization.",
          type: "plausible",
          feedback:
            "Extended Time: +0.05hrs. These settings relate to rendering performance and visual quality, not the distance at which the actor streams into memory.",
          next: "step-2",
        },
        {
          text: "Modify the 'Mobility' setting from Static to Movable or Stationary.",
          type: "subtle",
          feedback:
            "Extended Time: +0.05hrs. Mobility affects lighting and rendering performance, but not how World Partition manages streaming of static actors.",
          next: "step-2",
        },
      ],
    },
    "step-3": {
      skill: "worldpartition",
      title: "Identify Data Layer",
      image_path: "assets/generated/DataLayerStreamingOverride/step-3.png",
      prompt:
        "You've confirmed 'Is Spatially Loaded'. Next, identify which Data Layer is managing these props, as the problem affects a specific group. Where do you find this?",
      choices: [
        {
          text: "In the Data Layers section of the Details panel, identify the specific Data Layer assigned to these assets (e.g., 'DL_GroundCover_Details').",
          type: "correct",
          feedback:
            "Optimal Time: +0.05hrs. Knowing the assigned Data Layer is crucial, as streaming behavior can be configured per Data Layer.",
          next: "step-4",
        },
        {
          text: "Check the 'LOD Group' setting in the Details panel to see if it's assigned to a specific HLOD layer.",
          type: "obvious",
          feedback:
            "Extended Time: +0.1hrs. LOD Groups are part of the mesh asset's Level of Detail system, not the World Partition streaming system. This won't reveal the Data Layer.",
          next: "wrong-hlod-path-2",
        },
        {
          text: "Search the Content Browser for the Data Layer asset associated with the props.",
          type: "plausible",
          feedback:
            "Extended Time: +0.05hrs. While Data Layers are assets, the most direct way to identify an actor's assigned layer is through its Details panel.",
          next: "step-3",
        },
        {
          text: "Examine the 'Tags' section in the Details panel for keywords indicating a Data Layer.",
          type: "subtle",
          feedback:
            "Extended Time: +0.05hrs. Tags are arbitrary metadata; they don't explicitly define Data Layer assignments, which have a dedicated section.",
          next: "step-3",
        },
      ],
    },
    "step-4": {
      skill: "worldpartition",
      title: "Access World Settings",
      image_path: "assets/generated/DataLayerStreamingOverride/step-4.png",
      prompt:
        "You've identified the Data Layer. To investigate its configuration for streaming, you need to access World Partition settings. Where do you go next?",
      choices: [
        {
          text: "Open the main World Settings panel (Window -> World Settings).",
          type: "correct",
          feedback:
            "Optimal Time: +0.05hrs. World Settings is the central hub for configuring World Partition, including Data Layer properties.",
          next: "step-5",
        },
        {
          text: "Go to Project Settings (Edit -> Project Settings) and look for 'World Partition'.",
          type: "obvious",
          feedback:
            "Extended Time: +0.1hrs. Project Settings handle engine-wide defaults, not map-specific World Partition configurations. You won't find specific Data Layer controls there.",
          next: "step-4",
        },
        {
          text: "Right-click on the selected actors and look for 'World Partition Options' in the context menu.",
          type: "plausible",
          feedback:
            "Extended Time: +0.05hrs. The actor's context menu provides some options, but full Data Layer configuration is in World Settings.",
          next: "step-4",
        },
        {
          text: "Use the 'Window -> Developer Tools' menu to find a dedicated World Partition debugger.",
          type: "subtle",
          feedback:
            "Extended Time: +0.05hrs. While there are debugging tools, the primary configuration for Data Layers is within the World Settings panel.",
          next: "step-4",
        },
      ],
    },
    "step-5": {
      skill: "worldpartition",
      title: "Open Data Layers Editor",
      image_path: "assets/generated/DataLayerStreamingOverride/step-5.png",
      prompt:
        "In World Settings, you need to manage Data Layers. How do you access the specific editor for Data Layers?",
      choices: [
        {
          text: "Locate the 'Data Layers' section within the World Settings panel and click the 'Edit Data Layers' button.",
          type: "correct",
          feedback:
            "Optimal Time: +0.05hrs. This button launches the dedicated Data Layers Editor, where specific layer properties are managed.",
          next: "step-6",
        },
        {
          text: "Search for the Data Layer asset directly in the Content Browser and open it.",
          type: "obvious",
          feedback:
            "Extended Time: +0.05hrs. While Data Layer assets exist, the 'Edit Data Layers' button in World Settings is the canonical way to manage them within the context of the current map's World Partition setup.",
          next: "step-5",
        },
        {
          text: "In the World Settings, expand the 'Runtime Grids' section to look for Data Layer overrides.",
          type: "plausible",
          feedback:
            "Extended Time: +0.05hrs. Runtime Grids define global streaming, but individual Data Layer overrides are configured within the Data Layers Editor, not directly in the Runtime Grids section.",
          next: "wrong-global-stream-path-2",
        },
        {
          text: "Attempt to create a new Data Layer from the World Settings panel.",
          type: "subtle",
          feedback:
            "Extended Time: +0.05hrs. You need to *edit* existing Data Layers, not create new ones, to resolve the current issue. Creating a new one is a distraction.",
          next: "step-5",
        },
      ],
    },
    "step-6": {
      skill: "worldpartition",
      title: "Locate Specific Data Layer",
      image_path: "assets/generated/DataLayerStreamingOverride/step-6.png",
      prompt:
        "With the Data Layers Editor open, you need to find the specific Data Layer (e.g., 'DL_GroundCover_Details') identified earlier. How do you do this?",
      choices: [
        {
          text: "In the Data Layers Editor, locate the identified Data Layer (e.g., 'DL_GroundCover_Details') from the list.",
          type: "correct",
          feedback:
            "Optimal Time: +0.05hrs. Clearly identifying the target Data Layer in the editor is the next step to inspect its settings.",
          next: "step-7",
        },
        {
          text: "Use the 'Filter' option in the Data Layers Editor to search for 'Streaming Distance'.",
          type: "obvious",
          feedback:
            "Extended Time: +0.05hrs. While filtering can be useful, you first need to select the correct Data Layer. Filtering by a property name directly may not isolate the layer itself.",
          next: "step-6",
        },
        {
          text: "Close the Data Layers Editor and instead check 'World Partition Setup' in World Settings.",
          type: "plausible",
          feedback:
            "Extended Time: +0.05hrs. Closing the editor means you're backtracking. The 'World Partition Setup' is for initial grid generation, not Data Layer properties.",
          next: "step-6",
        },
        {
          text: "Look for a separate 'Data Layer Details' panel that automatically opens when the editor starts.",
          type: "subtle",
          feedback:
            "Extended Time: +0.05hrs. Like other editors, you generally need to select an item from a list to view its properties in a separate details panel.",
          next: "step-6",
        },
      ],
    },
    "step-7": {
      skill: "worldpartition",
      title: "View Data Layer Properties",
      image_path: "assets/generated/DataLayerStreamingOverride/step-7.png",
      prompt:
        "You've located the Data Layer in the Data Layers Editor. How do you view its specific configuration properties?",
      choices: [
        {
          text: "Double-click the Data Layer entry or select it and view its properties panel within the Data Layers Editor.",
          type: "correct",
          feedback:
            "Optimal Time: +0.05hrs. Accessing the properties panel for the selected Data Layer is where you'll find its detailed configurations.",
          next: "step-8",
        },
        {
          text: "Right-click the Data Layer entry and choose 'Export' to view its settings as text.",
          type: "obvious",
          feedback:
            "Extended Time: +0.05hrs. Exporting is for backup or sharing, not for directly editing or viewing properties within the editor.",
          next: "step-7",
        },
        {
          text: "Go back to World Settings and look for Data Layer properties there, assuming the editor is just a list.",
          type: "plausible",
          feedback:
            "Extended Time: +0.05hrs. The dedicated Data Layers Editor is precisely for configuring these properties. Going back to World Settings is inefficient.",
          next: "step-7",
        },
        {
          text: "Try to drag and drop the Data Layer from the editor into the scene to reveal its properties.",
          type: "subtle",
          feedback:
            "Extended Time: +0.05hrs. Dragging Data Layers into the scene is not a valid way to edit their properties. It's an incorrect UI interaction.",
          next: "step-7",
        },
      ],
    },
    "step-8": {
      skill: "worldpartition",
      title: "Inspect Runtime Properties",
      image_path: "assets/generated/DataLayerStreamingOverride/step-8.png",
      prompt:
        "With the Data Layer's properties open, where should you focus to find settings that affect its streaming distance?",
      choices: [
        {
          text: "Inspect the 'Runtime Properties' section of the Data Layer configuration.",
          type: "correct",
          feedback:
            "Optimal Time: +0.1hrs. The 'Runtime Properties' section contains configurations relevant to how the Data Layer behaves during gameplay, including streaming.",
          next: "step-9",
        },
        {
          text: "Check the 'Editor Properties' section for any streaming overrides.",
          type: "obvious",
          feedback:
            "Extended Time: +0.05hrs. 'Editor Properties' relate to how the Data Layer behaves in the editor, not its runtime streaming behavior in PIE or a built game.",
          next: "step-8",
        },
        {
          text: "Search for any 'HLOD Settings' within the Data Layer properties.",
          type: "plausible",
          feedback:
            "Extended Time: +0.1hrs. Data Layers don't typically have HLOD settings directly. HLODs are a separate system, even if they interact with World Partition streaming.",
          next: "wrong-hlod-path-3",
        },
        {
          text: "Look for 'Collision Settings' or 'Physics Properties'.",
          type: "subtle",
          feedback:
            "Extended Time: +0.05hrs. These settings are irrelevant to actor streaming distance and relate to physical interactions.",
          next: "step-8",
        },
      ],
    },
    "step-9": {
      skill: "worldpartition",
      title: "Identify Streaming Override",
      image_path:
        "assets/generated/DataLayerStreamingOverride/step-9.png",
      prompt:
        "Within 'Runtime Properties', which specific property is most likely overriding the default streaming distance for this Data Layer?",
      choices: [
        {
          text: "Identify the 'Streaming Distance Override' property for this specific Data Layer.",
          type: "correct",
          feedback:
            "Optimal Time: +0.05hrs. This property is designed to allow per-Data Layer control over streaming distance, exactly what we're looking for.",
          next: "step-10",
        },
        {
          text: "Look for 'Activation Range' or 'Load Distance' on the Data Layer.",
          type: "obvious",
          feedback:
            "Extended Time: +0.05hrs. While similar in concept, 'Streaming Distance Override' is the precise property used by World Partition for Data Layers.",
          next: "step-9",
        },
        {
          text: "Check the 'Is Client Only' or 'Is Server Only' properties.",
          type: "plausible",
          feedback:
            "Extended Time: +0.05hrs. These properties affect network replication and visibility based on client/server roles, not spatial streaming distance.",
          next: "step-9",
        },
        {
          text: "Focus on the 'Debug Color' setting.",
          type: "subtle",
          feedback:
            "Extended Time: +0.05hrs. 'Debug Color' is purely for visualization in the editor, with no effect on runtime behavior.",
          next: "step-9",
        },
      ],
    },
    "step-10": {
      skill: "worldpartition",
      title: "Confirm Override Value",
      image_path: "assets/generated/DataLayerStreamingOverride/step-10.png",
      prompt:
        "You've found 'Streaming Distance Override'. Given the problem (10m pop-in), what value would you expect to see, confirming this as the cause?",
      choices: [
        {
          text: "Confirm that the 'Streaming Distance Override' is set to an abnormally low value (e.g., 1000.0, representing 10 meters).",
          type: "correct",
          feedback:
            "Optimal Time: +0.05hrs. A low override value directly explains why the props are popping in too close, overriding the global 500m setting.",
          next: "step-11",
        },
        {
          text: "Confirm it's set to a very high value (e.g., 50000.0) which would load everything.",
          type: "obvious",
          feedback:
            "Extended Time: +0.05hrs. A very high value would cause *earlier* loading, not later, and would contradict the 10m pop-in symptom.",
          next: "step-10",
        },
        {
          text: "Check if it's set to -1.0, indicating an error state.",
          type: "plausible",
          feedback:
            "Extended Time: +0.05hrs. While negative values can sometimes indicate defaults or errors, 0.0 is typically used for defaulting in this context, and -1.0 is not a common setting for this property.",
          next: "step-10",
        },
        {
          text: "Assume the value is correct and move on to checking other Data Layers.",
          type: "subtle",
          feedback:
            "Extended Time: +0.05hrs. You've identified the most likely culprit; assuming it's correct without validating its value means you're overlooking the problem.",
          next: "step-10",
        },
      ],
    },
    "step-11": {
      skill: "worldpartition",
      title: "Reset Streaming Override",
      image_path:
        "assets/generated/DataLayerStreamingOverride/step-11.png",
      prompt:
        "You've confirmed the 'Streaming Distance Override' is set to 1000.0 (10m). How do you correct this to use the global World Partition streaming distance (500m)?",
      choices: [
        {
          text: "Reset the 'Streaming Distance Override' property value back to 0.0.",
          type: "correct",
          feedback:
            "Optimal Time: +0.15hrs. Setting it to 0.0 tells World Partition to ignore the override and use the standard global streaming distance from the Runtime Grid settings.",
          next: "step-12",
        },
        {
          text: "Set the 'Streaming Distance Override' to 50000.0 (500 meters).",
          type: "obvious",
          feedback:
            "Extended Time: +0.05hrs. While 50000.0 represents 500m, setting it explicitly means you are still *overriding* the global setting. It's better to reset to 0.0 to rely on the global configuration.",
          next: "step-11",
        },
        {
          text: "Delete the 'Streaming Distance Override' property entirely.",
          type: "plausible",
          feedback:
            "Extended Time: +0.05hrs. You cannot delete properties directly in the editor; you can only modify their values. This is an invalid action.",
          next: "step-11",
        },
        {
          text: "Manually set the 'Streaming Distance Override' to match the World Partition's global streaming distance value.",
          type: "subtle",
          feedback:
            "Extended Time: +0.05hrs. While this would achieve the desired result, it's not the cleanest solution. Setting to 0.0 is the official way to defer to global settings, making it more robust against future global changes.",
          next: "step-11",
        },
      ],
    },
    "step-12": {
      skill: "worldpartition",
      title: "Verify Fix",
      image_path:
        "assets/generated/DataLayerStreamingOverride/step-12.png",
      prompt:
        "You've reset the 'Streaming Distance Override'. What are the final steps to confirm the fix?",
      choices: [
        {
          text: "Save the changes in the Data Layers Editor, save the main map, and test in PIE to confirm the bushes and rocks now stream in at the correct distance (500m).",
          type: "correct",
          feedback:
            "Optimal Time: +0.1hrs. Saving and testing in PIE is crucial to verify the changes have taken effect and the issue is resolved.",
          next: "conclusion",
        },
        {
          text: "Just test in PIE immediately, assuming changes to Data Layers are automatically saved.",
          type: "obvious",
          feedback:
            "Extended Time: +0.05hrs. Changes made in specialized editors often need explicit saving to persist and apply in the main map and PIE.",
          next: "step-12",
        },
        {
          text: "Rebuild the lighting and geometry in the level to ensure the streaming changes propagate.",
          type: "plausible",
          feedback:
            "Extended Time: +0.1hrs. Streaming distances are runtime World Partition properties, not baked lighting or geometry data. Rebuilding is unnecessary and time-consuming.",
          next: "step-12",
        },
        {
          text: "Export the Data Layer to another project to compare settings.",
          type: "subtle",
          feedback:
            "Extended Time: +0.05hrs. This is not a verification step for the current fix. The focus should be on testing the changes in the current project.",
          next: "step-12",
        },
      ],
    },
    "wrong-hlod-path-1": {
      skill: "worldpartition",
      title: "HLOD Generation Detour",
      prompt:
        "You generated new HLODs, but the decorative props still pop in at 10m. The issue remains. What's next?",
      choices: [
        {
          text: "Re-evaluate the problem. Select a subset of the problematic Static Mesh Actors to inspect their properties.",
          type: "correct",
          feedback:
            "Optimal Time: +0.0hrs (after penalty). Good, you're back on track. HLODs were not the root cause.",
          next: "step-2",
        },
        {
          text: "Adjust the 'HLOD Layer' setting on the affected actors in the Details panel.",
          type: "obvious",
          feedback:
            "Extended Time: +0.1hrs. Still focused on HLODs. This won't change streaming distance.",
          next: "wrong-hlod-path-2",
        },
        {
          text: "Increase the 'Cull Distance Volume' settings for the area.",
          type: "plausible",
          feedback:
            "Extended Time: +0.1hrs. Cull Distance Volumes affect visibility culling, not World Partition streaming. This is a common confusion, but not the solution.",
          next: "wrong-hlod-path-1",
        },
        {
          text: "Try rebuilding the entire level's HLODs from scratch.",
          type: "subtle",
          feedback:
            "Extended Time: +0.25hrs. Repeating a time-consuming, incorrect step is inefficient. HLODs are not the core issue.",
          next: "wrong-hlod-path-1",
        },
      ],
    },
    "wrong-hlod-path-2": {
      skill: "worldpartition",
      title: "HLOD Confusion",
      prompt:
        "You tried adjusting HLOD layers and cull distances, but the props still pop in close. The issue is persistent. What's your next logical step, moving away from HLODs?",
      choices: [
        {
          text: "Return to examining the specific actors' properties, focusing on World Partition related settings, specifically identifying its Data Layer.",
          type: "correct",
          feedback:
            "Optimal Time: +0.0hrs (after penalty). You've realized HLODs aren't the solution. Time to focus on actor-level streaming.",
          next: "step-3",
        },
        {
          text: "Generate a new 'HLOD Mesh' for one of the problematic static meshes.",
          type: "obvious",
          feedback:
            "Extended Time: +0.1hrs. You are still trying to solve a streaming problem with an HLOD solution. This is not productive.",
          next: "wrong-hlod-path-3",
        },
        {
          text: "Disable 'Affect Distance Field Lighting' on the actors.",
          type: "plausible",
          feedback:
            "Extended Time: +0.05hrs. This setting affects lighting, not the spatial streaming distance of the actors.",
          next: "wrong-hlod-path-2",
        },
        {
          text: "Check the 'Min Draw Distance' and 'Max Draw Distance' for the static mesh component.",
          type: "subtle",
          feedback:
            "Extended Time: +0.05hrs. While these exist, World Partition's spatial streaming typically supersedes or works in conjunction with these. The problem points to a WP-specific override.",
          next: "wrong-asset-props-path-2",
        },
      ],
    },
    "wrong-hlod-path-3": {
      skill: "worldpartition",
      title: "Deep HLOD Dive",
      prompt:
        "You've spent considerable time with HLODs, but the streaming distance issue persists. It's clear HLODs are not the answer. What's the best path forward?",
      choices: [
        {
          text: "Recognize HLODs are a dead end. Return to the Data Layers Editor and locate the problematic Data Layer to view its properties.",
          type: "correct",
          feedback:
            "Optimal Time: +0.0hrs (after penalty). Correct. HLODs are not directly responsible for Data Layer streaming distance overrides. Focus on Data Layer configuration.",
          next: "step-6",
        },
        {
          text: "In the World Partition panel, try re-baking the HLOD proxy meshes for the entire level.",
          type: "obvious",
          feedback:
            "Extended Time: +0.25hrs. This is another major HLOD operation that won't address the streaming distance override. You're wasting more time on the wrong subsystem.",
          next: "wrong-hlod-path-3",
        },
        {
          text: "Investigate if the static mesh assets have custom LODs that are being aggressively culled.",
          type: "plausible",
          feedback:
            "Extended Time: +0.15hrs. While related to visibility, this is a distraction from the World Partition streaming issue for *actor instances*. The problem is not LODs but actor loading.",
          next: "wrong-asset-props-path-3",
        },
        {
          text: "Check 'Always Loaded' on the actors in the Details panel.",
          type: "subtle",
          feedback:
            "Extended Time: +0.05hrs. 'Always Loaded' would solve the pop-in by forcing them to always be in memory, but it defeats the purpose of World Partition and can harm performance.",
          next: "wrong-hlod-path-3",
        },
      ],
    },
    "wrong-asset-props-path-1": {
      skill: "worldpartition",
      title: "Asset Properties Detour",
      prompt:
        "You've checked static mesh asset properties (LODs, collision) but found nothing explaining the 10m pop-in. The issue isn't resolved. What's the next logical step?",
      choices: [
        {
          text: "Return to the selected actors' Details panel and check World Partition specific streaming settings.",
          type: "correct",
          feedback:
            "Optimal Time: +0.0hrs (after penalty). Asset properties typically don't control actor instance streaming. Focus on the actor's World Partition settings.",
          next: "step-2",
        },
        {
          text: "Modify the 'Screen Size' for LODs on the static mesh asset to make them more aggressive.",
          type: "obvious",
          feedback:
            "Extended Time: +0.1hrs. This would make LODs switch at closer distances or cull earlier, which is the opposite of what's desired for streaming distance. Still focusing on asset LODs, not WP streaming.",
          next: "wrong-asset-props-path-2",
        },
        {
          text: "Generate new proxies for the individual static mesh assets.",
          type: "plausible",
          feedback:
            "Extended Time: +0.15hrs. Generating proxies is for reducing poly counts at distance, not for controlling World Partition streaming distance for active actors.",
          next: "wrong-hlod-path-2",
        },
        {
          text: "Check the 'Bounds Scale' on the static mesh components.",
          type: "subtle",
          feedback:
            "Extended Time: +0.05hrs. Bounds scale influences culling volumes, but the root issue is World Partition *streaming* distance, not local culling.",
          next: "wrong-asset-props-path-1",
        },
      ],
    },
    "wrong-asset-props-path-2": {
      skill: "worldpartition",
      title: "Still on Asset Properties",
      prompt:
        "You're still investigating individual static mesh asset properties, but the 10m pop-in persists. The issue is likely not in the asset itself. What should you do?",
      choices: [
        {
          text: "Shift focus to the Data Layer assigned to the problematic actors, as it can override streaming behavior.",
          type: "correct",
          feedback:
            "Optimal Time: +0.0hrs (after penalty). Correct. The Data Layer is a more likely place for a streaming distance override.",
          next: "step-3",
        },
        {
          text: "Experiment with different material settings on the static meshes to influence rendering distance.",
          type: "obvious",
          feedback:
            "Extended Time: +0.1hrs. Material settings affect visual appearance, not the distance at which an entire actor streams into the level.",
          next: "wrong-asset-props-path-2",
        },
        {
          text: "Set 'Never Stream' on the textures used by the meshes.",
          type: "plausible",
          feedback:
            "Extended Time: +0.05hrs. 'Never Stream' for textures relates to texture memory management, not actor streaming. This is a different type of streaming entirely.",
          next: "wrong-asset-props-path-2",
        },
        {
          text: "Examine the 'Nanite Settings' on the static meshes.",
          type: "subtle",
          feedback:
            "Extended Time: +0.05hrs. Nanite affects mesh rendering performance and detail, but World Partition streaming is about *loading the actor itself*, not how its geometry is rendered once loaded.",
          next: "wrong-asset-props-path-2",
        },
      ],
    },
    "wrong-asset-props-path-3": {
      skill: "worldpartition",
      title: "Asset Props Rabbit Hole",
      prompt:
        "You've exhaustively checked individual asset properties, LODs, and rendering settings, but the 10m pop-in issue persists for the actor instances. You're in a rabbit hole. What's the right next step?",
      choices: [
        {
          text: "Stop focusing on individual asset properties. Open World Settings to investigate global or Data Layer-specific World Partition configurations.",
          type: "correct",
          feedback:
            "Optimal Time: +0.0hrs (after penalty). Good. The problem is likely at the World Partition or Data Layer level, not the individual mesh asset.",
          next: "step-4",
        },
        {
          text: "Export the static mesh assets and re-import them with different settings.",
          type: "obvious",
          feedback:
            "Extended Time: +0.2hrs. This is a drastic and time-consuming measure, assuming the problem is with asset corruption or base settings, which isn't indicated here.",
          next: "wrong-asset-props-path-3",
        },
        {
          text: "Check the 'Distance Field Resolution Scale' on the static mesh.",
          type: "plausible",
          feedback:
            "Extended Time: +0.05hrs. This setting affects lighting and global illumination, not the streaming distance of the actor itself.",
          next: "wrong-asset-props-path-3",
        },
        {
          text: "Attempt to apply a new material instance to the static meshes.",
          type: "subtle",
          feedback:
            "Extended Time: +0.05hrs. Material changes are visual and have no bearing on World Partition actor streaming distances.",
          next: "wrong-asset-props-path-3",
        },
      ],
    },
    "wrong-global-stream-path-1": {
      skill: "worldpartition",
      title: "Global Streaming Override Attempt",
      prompt:
        "You increased the global 'Streaming Distance' in World Settings, but this caused *all* distant actors to load earlier, not just the problematic props, and the props still pop in at 10m. What's the issue?",
      choices: [
        {
          text: "The global setting is overriding correctly, but a more specific setting (like a Data Layer override) is still forcing the 10m distance. Focus on accessing Data Layer settings.",
          type: "correct",
          feedback:
            "Optimal Time: +0.0hrs (after penalty). Correct. Global settings are too broad. The issue points to a more granular override, likely a Data Layer.",
          next: "step-5",
        },
        {
          text: "Increase the global streaming distance even further to ensure it overpowers any other setting.",
          type: "obvious",
          feedback:
            "Extended Time: +0.3hrs. This is a brute-force approach that will further degrade performance by loading unnecessary assets and won't fix a specific Data Layer override.",
          next: "wrong-global-stream-path-1",
        },
        {
          text: "Reset the global streaming distance and try adjusting 'Editor Grid Settings'.",
          type: "plausible",
          feedback:
            "Extended Time: +0.05hrs. Editor Grid Settings are for visual display in the editor, not runtime streaming behavior.",
          next: "wrong-global-stream-path-2",
        },
        {
          text: "Disable World Partition entirely and manually manage actor loading.",
          type: "subtle",
          feedback:
            "Extended Time: +0.2hrs. Disabling World Partition is a major architectural change and impractical for large levels. You should aim to use its features correctly.",
          next: "wrong-global-stream-path-1",
        },
      ],
    },
    "wrong-global-stream-path-2": {
      skill: "worldpartition",
      title: "Still on Global Settings",
      prompt:
        "You've tried adjusting global World Partition streaming settings, but the specific props still pop in at 10m. It seems a global change isn't targeting the root cause. What's a better approach?",
      choices: [
        {
          text: "Shift focus from global settings to the specific Data Layer assigned to the problematic actors, which might have its own streaming override. Locate it in the Data Layers Editor.",
          type: "correct",
          feedback:
            "Optimal Time: +0.0hrs (after penalty). Yes, the Data Layer is a likely candidate for a specific override.",
          next: "step-6",
        },
        {
          text: "In the World Settings, enable 'Force Persistent Level Loading'.",
          type: "obvious",
          feedback:
            "Extended Time: +0.05hrs. 'Force Persistent Level Loading' is for specific debugging scenarios and will force *everything* in the persistent level to load, not just solve a streaming distance issue for Data Layer actors.",
          next: "wrong-global-stream-path-2",
        },
        {
          text: "Adjust the 'Loader Range' in the World Partition Runtime Grid settings.",
          type: "plausible",
          feedback:
            "Extended Time: +0.1hrs. The Loader Range is part of the global Runtime Grid settings. While relevant, the core problem is a specific *override* that this won't fix directly.",
          next: "wrong-global-stream-path-3",
        },
        {
          text: "Check for a 'World Composition' tab, assuming this is an older project.",
          type: "subtle",
          feedback:
            "Extended Time: +0.05hrs. World Composition is an older streaming system deprecated in favor of World Partition. This is a dead end.",
          next: "wrong-global-stream-path-2",
        },
      ],
    },
    "wrong-global-stream-path-3": {
      skill: "worldpartition",
      title: "Global Settings Exhausted",
      prompt:
        "You've explored various global World Partition settings, including Runtime Grids and Loader Ranges, but the local 10m pop-in issue for the decorative props remains. What's the next most targeted approach?",
      choices: [
        {
          text: "It's time to specifically inspect the 'Streaming Distance Override' within the Data Layer's Runtime Properties in the Data Layers Editor.",
          type: "correct",
          feedback:
            "Optimal Time: +0.0hrs (after penalty). Precisely. You've exhausted global options, pointing to a Data Layer-specific override. You need to view the Data Layer's properties.",
          next: "step-7",
        },
        {
          text: "Reduce the 'Cell Size' in the World Partition Runtime Grid settings.",
          type: "obvious",
          feedback:
            "Extended Time: +0.15hrs. Reducing cell size can increase loading overhead and may not resolve an override. It's an engine-wide performance setting, not a fix for a specific pop-in.",
          next: "wrong-global-stream-path-3",
        },
        {
          text: "Try to identify if the World Partition system itself is corrupted and requires a rebuild.",
          type: "plausible",
          feedback:
            "Extended Time: +0.2hrs. Assuming corruption is premature. Focus on configuration before suspecting core system issues.",
          next: "wrong-global-stream-path-3",
        },
        {
          text: "Adjust the 'Min/Max Streaming Distance' directly on the static mesh components in the Details panel.",
          type: "subtle",
          feedback:
            "Extended Time: +0.05hrs. These are component-level settings, often overridden or complemented by World Partition. The Data Layer override is a higher-level control.",
          next: "wrong-asset-props-path-3",
        },
      ],
    },
    conclusion: {
      skill: "complete",
      title: "Scenario Complete",
      image_path:
        "assets/generated/DataLayerStreamingOverride/conclusion.png",
      prompt:
        "Congratulations! You have successfully identified and corrected the Data Layer's 'Streaming Distance Override', resolving the issue of decorative props popping in too close. Total time: ",
      choices: [
        {
          text: "Complete Scenario",
          type: "correct",
          feedback: "",
          next: "end",
        },
      ],
    },
  },
};
