window.SCENARIOS['PitchBlackIndoorGI'] = {
    meta: {
        expanded: true,
        title: "Pitch Black Indoor GI (Lumen)",
        description: "Interior spaces remain pitch black despite bright exterior lighting. Investigates Lumen GI settings, geometry thickness, mesh distance fields, and proper verification workflow.",
        estimateHours: 3.0,
        difficulty: "Intermediate",
        category: "Lighting"
    },
    start: "step-1",
    steps: {
        'step-1': {
            skill: 'lighting',
            title: 'The Symptom',
            prompt: "<p><strong>The Art Lead approaches your desk:</strong> \"Hey, I just placed our new interior level and it looks terrible. The room has these big windows with bright sunlight outside, but everything inside between the direct light patches is pitch black. There's no bounce light at all--it looks completely unrealistic.\"</p><p>You load up the level and confirm the issue. The exterior is beautifully lit, but the interior looks like a cave.</p><strong>What's your first debugging step?</strong>",
            choices: [
{
                    text: "Switch to <strong>Lumen Scene View</strong> and <strong>Lighting Only</strong> view modes to inspect GI contribution.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> In Lumen Scene View, you notice the room barely shows any indirect contribution. The visualization confirms that Lumen isn't calculating bounce light for this interior space.</p>",
                    next: 'step-2'
                },
{
                    text: "Immediately crank up the Directional Light intensity and Skylight brightness.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged (Ineffective Fix):</strong> Direct light gets brighter, but the corners of the room still sit in pure black. There's still no realistic bounce or fill. This isn't just a brightness issue.</p>",
                    next: 'step-1W'
                },
{
                    text: "Check the <strong>Post Process Volume</strong> exposure settings.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Adjusting exposure helps you see more detail, but it doesn't create bounce light where there is none. The underlying GI problem remains.</p>",
                    next: 'step-2'
                },
{
                    text: "Add fill lights manually throughout the room to fake ambient lighting.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Investigation):</strong> This creates a messy, inconsistent result that doesn't respond to time-of-day changes. You're treating the symptom, not the cause.</p>",
                    next: 'step-1M'
                }
            ]
        },

        'step-1W': {
            skill: 'lighting',
            title: 'Dead End: Brightness Tweaks',
            prompt: "<p><strong>After 20 minutes of tweaking:</strong> You've cranked up light intensity and even adjusted the exposure, but the Art Lead comes back: \"It's still pitch black in the corners. I don't think this is a brightness issue.\"</p><p>They're right--the problem clearly isn't about light strength.</p><strong>What should you do now?</strong>",
            choices: [
{
                    text: "Revert the extreme intensity changes and investigate the GI system itself.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You roll back the tweaks and refocus on whether Lumen is properly enabled and configured.</p>",
                    next: 'step-2'
                },
{
                    text: "Keep increasing brightness until something works.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Now your exterior is blown out and the interior is still dark. You're making things worse.</p>",
                    next: 'step-1W'
                },
{
                    text: "Raise the Sky Light intensity to overpower the dark areas",
                    type: 'wrong',
                    feedback: "You max out the Sky Light, but the shadows turn flat and the entire level takes on a washed-out haze. Nothing about the GI actually improves—you're simply flooding the scene with ambient light. After wasting time readjusting exposure, you realize you're masking the real issue instead of solving it.",
                    next: 'step-1W'
                },
{
                    text: "Reset all Post Process exposure settings to defaults and re-evaluate the scene",
                    type: 'partial',
                    feedback: "Bringing exposure back to defaults at least removes some of the compensatory tweaks that were hiding important clues. The level still appears dim in indirect regions, but now you can more clearly see that Lumen itself isn't behaving as expected. This pushes you to revisit earlier assumptions.",
                    next: 'step-1'
                }
            ]
        },

        'step-1M': {
            skill: 'lighting',
            title: 'Dead End: Manual Fill Lights',
            prompt: "<p><strong>The Tech Lead walks by and notices your work:</strong> \"Why are you manually placing all these fill lights? That's not going to scale, and it won't respond to time-of-day changes. What's the actual problem here?\"</p><p>They're right--you're treating symptoms, not the cause.</p><strong>How do you get back on track?</strong>",
            choices: [
{
                    text: "Add a series of small point lights to fill in dark corners manually",
                    type: 'misguided',
                    feedback: "You pepper the scene with tiny point lights, but the result is patchy and inconsistent. Your teammate walks by and immediately asks why the shadows look 'stage-lit.' The problem isn't lack of lights—it's the GI system not contributing properly.",
                    next: 'step-1M'
                },
{
                    text: "Increase the indirect lighting intensity on each key light",
                    type: 'partial',
                    feedback: "The scene brightens a little, but the bounce still feels unnatural and uneven. You're essentially trying to brute-force indirect light, which never looks as cohesive as true Lumen GI. Still, the experiment confirms that your direct lights are not the issue.",
                    next: 'step-1'
                },
{
                    text: "Disable all fill lights you've added and check the Lumen visualizer",
                    type: 'correct',
                    feedback: "Once the clutter of manual lights is gone, the Lumen visualizer makes the underlying issue obvious—your GI contribution is extremely low in several zones. This is the first real signal pointing you back toward systemic settings rather than ad-hoc lighting fixes.",
                    next: 'step-2'
                }
            ,

                {
                    text: "Right-click the asset in the Content Browser and select 'Validate Assets'.",
                    type: 'wrong',
                    feedback: "Asset validation passes with flying colors. The asset data itself is not corrupt; the problem lies in how it's being used or calculated.",
                    next: 'step-1M'
                }]
        },

        'step-2': {
            skill: 'lighting',
            title: 'Checking Project Settings',
            prompt: "<p><strong>You ask the Tech Lead for guidance:</strong> \"Where should I start looking for GI issues?\"</p><p>They respond: \"Check Project Settings > Rendering. Make sure Lumen is actually enabled for this project.\"</p><p>You open the settings and investigate.</p><strong>What do you find?</strong>",
            choices: [
{
                    text: "Look for lightmap resolution settings.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Lightmaps are for baked lighting, not Lumen. You're looking in the wrong system entirely.</p>",
                    next: 'step-2W'
                },
{
                    text: "Check the <strong>Reflection Method</strong> setting.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Reflections are important, but the main issue is the GI method. You're close but need to check the GI setting specifically.</p>",
                    next: 'step-3'
                },
{
                    text: "Verify that Lumen Global Illumination is enabled instead of Screen Space GI",
                    type: 'correct',
                    feedback: "You open the Project Settings and realize the project is still using SSAO-based GI rather than Lumen. Switching to Lumen immediately gives the scene the indirect bounce it was missing. The improvement is noticeable, and you've found a legitimate root cause.",
                    next: 'step-3'
                }
            ,

                {
                    text: "Increase the Engine Scalability Settings to Cinematic to see if it's a quality level issue.",
                    type: 'misguided',
                    feedback: "You max out the scalability settings. While the frame rate drops, the specific bug you're tracking doesn't change behavior. It's a logic or configuration issue, not a scalability artifact.",
                    next: 'step-2'
                }]
        },

        'step-2W': {
            skill: 'lighting',
            title: 'Dead End: Wrong Lighting System',
            prompt: "<p>You're investigating baked lighting settings, but this project needs dynamic GI. Lightmaps won't help here.</p><strong>What should you check instead?</strong>",
            choices: [
{
                    text: "Check the <strong>Dynamic Global Illumination Method</strong> in Project Settings.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Now you're looking at the right setting for real-time GI.</p>",
                    next: 'step-3'
                },
{
                    text: "Attempt to rebuild lighting hoping it will force Lumen to update",
                    type: 'wrong',
                    feedback: "You spend several minutes waiting on a light build only to remember—again—that Lumen doesn't use baked lighting at all. The results are unchanged, and your tech lead laughs as they walk by, reminding you that you're chasing ghosts.",
                    next: 'step-2W'
                },
{
                    text: "Switch the rendering engine back and forth between Deferred and Forward hoping for a refresh",
                    type: 'misguided',
                    feedback: "Switching pipelines forces a bunch of shader recompiles but does nothing to fix the underlying GI mismatch. The scene looks slightly different due to tonemapping shifts, but Lumen still isn't engaged. At least you confirm the problem isn't tied to the renderer type.",
                    next: 'step-2W'
                },
{
                    text: "Double-check the Project Template to confirm whether it shipped with Lumen disabled by default",
                    type: 'partial',
                    feedback: "You inspect the template settings and discover that some starter templates—especially performance-oriented ones—disable Lumen to target lower-end hardware. This doesn't fix anything yet, but it nudges you toward verifying the higher-level Lumen settings directly.",
                    next: 'step-2'
                }
            ]
        },

        'step-3': {
            skill: 'lighting',
            title: 'Enabling Lumen GI',
            prompt: "<p>You've confirmed that Lumen is disabled. You need to enable it and restart the editor for the change to take effect.</p><strong>What's the correct approach?</strong>",
            choices: [
{
                    text: "Enable Lumen but don't restart the editor.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> The setting requires an editor restart to take effect. Nothing changes until you restart.</p>",
                    next: 'step-3W'
                },
{
                    text: "Enable Hardware Ray Tracing support to let Lumen run in its full-quality mode",
                    type: 'partial',
                    feedback: "Turning on hardware ray tracing does improve some aspects of Lumen, but it also triggers long shader recompiles. The GI becomes slightly more stable, but the core issue isn't resolved yet. You realize you still need to verify Lumen's GI settings directly.",
                    next: 'step-3'
                },
{
                    text: "Switch Global Illumination and Reflections to Lumen in the Rendering settings",
                    type: 'correct',
                    feedback: "In Project Settings you explicitly set both Global Illumination and Reflections to Lumen. After restarting the editor as prompted, the level immediately shows richer bounce light and more accurate reflections. You've correctly enabled the intended GI system and are ready to fine-tune quality.",
                    next: 'step-4-deep-1'
                }
            ]
        },
        'step-4-deep-1': {
            skill: 'lighting',
            title: 'Visualizing Lumen's Geometry Representation',
            prompt: "<p>Before diving into mesh edits, let's use Lumen's built-in visualization tools to understand how it 'sees' your scene's geometry. This will help confirm if thin walls or gaps are indeed the problem.</p><strong>Which visualization mode is most effective here?</strong>",
            choices: [
                {
                    text: "Switch to <strong>Lumen Scene View</strong> and then the <strong>Lumen Scene</strong> visualizer to see Lumen's internal mesh representation.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You immediately spot areas where Lumen's simplified geometry (Lumen Cards) are missing or too thin, indicating potential light leaks. This confirms your suspicion about geometry issues.</p>",
                    next: 'step-4-deep-2'
                },
                {
                    text: "Use <strong>Wireframe</strong> viewmode to manually check for thin geometry.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Wireframe helps, but doesn't show how Lumen specifically interprets the scene. You might miss issues that Lumen's simplified representation introduces, which are crucial for GI.</p>",
                    next: 'step-4-deep-2'
                },
                {
                    text: "Enable <strong>Show > Collision</strong> to see if collision meshes are interfering with light.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Collision meshes are for physics interactions, not lighting calculations. This won't help diagnose GI issues and sends you down the wrong path.</p>",
                    next: 'step-4M'
                },
                {
                    text: "Increase the <strong>Lumen Scene Detail</strong> quality setting to maximum in the Post Process Volume.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> While higher detail can help, it's a performance setting, not a diagnostic tool. You need to understand *why* Lumen isn't seeing the geometry correctly first, not just try to brute-force quality.</p>",
                    next: 'step-4-deep-1'
                },
            ]
        },

        'step-4-deep-2': {
            skill: 'lighting',
            title: 'Identifying Specific Geometry Problems',
            prompt: "<p>In the Lumen Scene visualizer, you clearly see areas where the walls appear as single planes or have gaps, especially near corners. This confirms Lumen isn't getting enough 'thickness' to calculate bounce light properly. What's the next step to pinpoint the exact meshes?</p><strong>Which visualizer provides the most granular detail on Lumen's geometry representation?</strong>",
            choices: [
                {
                    text: "Use the <strong>Lumen Scene</strong> visualizer in combination with <strong>Lumen Cards</strong> to identify specific problematic meshes and their representation.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> The Lumen Cards view clearly highlights which individual meshes are being represented poorly, often showing paper-thin cards where solid geometry should be. You now know exactly which assets to target for modification.</p>",
                    next: 'step-4-deep-1'
                },
                {
                    text: "Manually select each wall mesh in the viewport and check its details panel for any obvious Lumen-related settings.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> This is tedious and less efficient than using visualizers. While you might find some settings, it's not the primary way to diagnose geometry issues for Lumen's scene representation.</p>",
                    next: 'step-4-deep-1'
                },
                {
                    text: "Try adjusting the <strong>Lumen Global Illumination</strong> settings in the Post Process Volume, like 'Final Gather Quality'.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> You're still trying to fix the symptom with quality settings, not the root cause of bad geometry representation. This won't make Lumen 'see' thin walls as thick, and the problem persists.</p>",
                    next: 'step-4M'
                },
                {
                    text: "Add a temporary Point Light inside the room and observe its shadows to find leaks.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> While light leaks are a symptom, this doesn't directly show you *why* Lumen is failing to represent the geometry. The visualizers are more direct and provide a clearer understanding of Lumen's internal state.</p>",
                    next: 'step-4M'
                },
            ]
        },

        'step-6-deep-1': {
            skill: 'lighting',
            title: 'Inspecting Mesh Distance Field Settings',
            prompt: "<p>The Mesh Distance Fields visualization clearly shows gaps or low-resolution representations for the problematic furniture. This indicates Lumen isn't getting accurate distance field data for these assets. How do you address this directly on the mesh?</p><strong>Where do you enable distance field generation for a static mesh?</strong>",
            choices: [
                {
                    text: "Open the <strong>Static Mesh Editor</strong> for an affected mesh, navigate to the <strong>Details</strong> panel, and ensure <strong>Generate Mesh Distance Fields</strong> is checked under the <strong>Build Settings</strong>.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You find the setting is indeed unchecked for the dark furniture. Enabling it is the first crucial step to providing Lumen with the necessary data.</p>",
                    next: 'step-6-deep-2'
                },
                {
                    text: "Check the <strong>Project Settings > Rendering > Global Distance Field</strong> section for any global overrides that might be disabling distance fields.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> While good to check, the issue is specific to certain meshes, suggesting a per-mesh setting is more likely the culprit. You confirm global settings are fine, but the problem persists for the individual assets.</p>",
                    next: 'step-6-deep-1'
                },
                {
                    text: "Increase the <strong>Lumen Scene Detail</strong> quality setting to maximum in the Post Process Volume.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> This is a global quality setting for Lumen's scene representation, not a fix for individual meshes missing distance field data. The problem persists, and you're still not addressing the root cause.</p>",
                    next: 'step-6M'
                },
                {
                    text: "Try increasing the <strong>Indirect Lighting Intensity</strong> on the problematic furniture materials.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> This is a material-level hack that won't fix the underlying issue of missing distance field data for Lumen's GI calculations. The furniture still looks flat and poorly lit, as Lumen lacks the proper volumetric information.</p>",
                    next: 'step-6M'
                },
            ]
        },

        'step-6-deep-2': {
            skill: 'lighting',
            title: 'Rebuilding Distance Fields',
            prompt: "<p>You've enabled 'Generate Mesh Distance Fields' for the problematic static meshes. However, the changes aren't immediately visible in the Lumen Scene or Mesh Distance Fields visualizers. What's the final step to ensure Lumen uses the newly generated data?</p><strong>How do you force the engine to update the distance field data?</strong>",
            choices: [
                {
                    text: "In the <strong>Build</strong> menu (or via console command <code>r.DistanceFields.Generate</code>), trigger a <strong>Build Distance Fields</strong> operation to force the engine to regenerate the data for all relevant meshes.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> After the build completes, the Mesh Distance Fields visualizer now shows accurate, solid representations for the furniture. Lumen's indirect lighting immediately improves in those areas, as it now has correct volumetric data.</p>",
                    next: 'step-6-deep-1'
                },
                {
                    text: "Restart the editor, hoping it will force a rebuild of all distance fields.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> A restart *can* sometimes trigger a rebuild, but it's not guaranteed or efficient. It's better to explicitly build them. You restart, and while some things update, the distance fields might still be stale, requiring another attempt.</p>",
                    next: 'step-6-deep-2'
                },
                {
                    text: "Adjust the <strong>Lumen Max Trace Distance</strong> in the Post Process Volume to try and force Lumen to 'see' the meshes better.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> This changes how far Lumen traces, but won't generate missing distance field data. The dark areas remain, as Lumen still lacks the fundamental volumetric information for those meshes.</p>",
                    next: 'step-6M'
                },
                {
                    text: "Right-click the asset in the Content Browser and select 'Reimport'.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged (Red Herring):</strong> Reimporting the mesh brings in the original asset data, but doesn't trigger the internal Unreal Engine process for generating distance fields. The problem persists, as you're not addressing the engine's internal data generation.</p>",
                    next: 'step-6M'
                },
            ]
        },

        


        'step-4-deep-M': {
            skill: 'lighting',
            title: 'Dead End: Misdiagnosing Lumen Geometry',
            prompt: "<p>You're still struggling to understand how Lumen interprets your scene's geometry. Adjusting quality settings or looking at irrelevant debug views won't help. You need to use the correct visualization tools to see what Lumen 'sees'.</p><strong>How do you get back on track to diagnose the geometry issue?</strong>",
            choices: [
                {
                    text: "Revisit the Lumen Scene visualizer to understand its internal geometry representation.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You return to the correct diagnostic tool, realizing that understanding Lumen's internal representation is key to fixing geometry issues.</p>",
                    next: 'step-4-deep-1'
                },
                {
                    text: "Assume the problem is with the Post Process Volume and reset all Lumen-related settings.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Resetting settings without understanding the problem just undoes previous work. The core geometry issue remains unaddressed.</p>",
                    next: 'step-4-deep-M'
                },
                {
                    text: "Try to find a global console command to force Lumen to render all geometry as solid.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> There's no magic command to fix bad geometry. You're still trying to brute-force a solution instead of diagnosing the root cause.</p>",
                    next: 'step-4-deep-M'
                },
            ]
        },



        'step-6-deep-M': {
            skill: 'lighting',
            title: 'Dead End: Misunderstanding Mesh Distance Fields',
            prompt: "<p>You're still not correctly addressing the Mesh Distance Field issue. Tweaking materials or global Lumen settings won't generate the necessary volumetric data for individual meshes. You need to focus on the mesh asset itself and the engine's build process.</p><strong>How do you get back on track to fix the Mesh Distance Fields?</strong>",
            choices: [
                {
                    text: "Revisit the Static Mesh Editor to ensure 'Generate Mesh Distance Fields' is enabled and then trigger a rebuild.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You correctly identify that the problem lies in the mesh's settings and the subsequent build process, getting back to the root cause.</p>",
                    next: 'step-6-deep-1'
                },
                {
                    text: "Increase the 'Lumen Global Illumination' intensity in the Post Process Volume to try and brighten the dark furniture.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> This is a global intensity tweak that will affect the entire scene and won't fix the specific issue of missing distance field data for certain meshes. The furniture still looks flat and poorly lit.</p>",
                    next: 'step-6-deep-M'
                },
                {
                    text: "Try to manually paint distance field data onto the meshes using a custom editor tool.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> While some advanced tools exist, this is not the standard workflow for fixing basic distance field generation issues. You're overcomplicating a fundamental setting.</p>",
                    next: 'step-6-deep-M'
                },
            ]
        },
                }
            ,

                {
                    text: "Right-click the asset in the Content Browser and select 'Validate Assets'.",
                    type: 'wrong',
                    feedback: "Asset validation passes with flying colors. The asset data itself is not corrupt; the problem lies in how it's being used or calculated.",
                    next: 'step-3'
                }]
        },

        'step-3W': {
            skill: 'lighting',
            title: 'Dead End: No Restart',
            prompt: "<p>You enabled Lumen but didn't restart. The change hasn't taken effect yet.</p><strong>What do you need to do?</strong>",
            choices: [
{
                    text: "Restart the editor to apply the Lumen GI setting.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> After restart, Lumen is now active.</p>",
                    next: 'step-4'
                },
{
                    text: "Toggle the Lumen Global Illumination setting off and back on in Project Settings without restarting the editor.",
                    type: 'partial',
                    feedback: "<p>You flip the Lumen GI setting off and on again, hoping the engine will hot-reload it. The UI updates, but under the hood the renderer still behaves as if the old setting is active. You realize a restart is probably still required.</p>",
                    next: 'step-3W'
                },
{
                    text: "Tweak the Post Process Volume exposure and contrast to compensate for the dark GI.",
                    type: 'misguided',
                    feedback: "<p>You crank up exposure and contrast until the scene looks brighter, but shadows and bounce lighting still feel wrong. A teammate points out that you're masking the underlying GI issue rather than fixing it. You're still stuck chasing the real problem.</p>",
                    next: 'step-3W'
                },
{
                    text: "Start reauthoring several key materials, increasing their emissive and base color values.",
                    type: 'wrong',
                    feedback: "<p>You spend a long time pushing emissive and brightening albedo on multiple materials. The look of the level drifts away from the art direction and the GI still feels inconsistent. This sends you down a rabbit hole that ultimately doesn't solve the renderer state issue.</p>",
                    next: 'step-3W'
                }
            ]
        },

        'step-4': {
            skill: 'lighting',
            title: 'Geometry Investigation',
            prompt: "<p><strong>After the editor restart:</strong> You show the Art Lead the updated scene. \"It's better, but still way too dark. Are you sure Lumen is working properly?\"</p><p>You see <em>some</em> bounce light now, but it's still very weak and inconsistent. You suspect there might be a geometry issue.</p><strong>What do you investigate?</strong>",
            choices: [
{
                    text: "Increase the <strong>Lumen Scene Detail</strong> quality setting to maximum.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Higher quality helps a bit, but doesn't fix the fundamental geometry problem. Thin walls are still causing light leakage.</p>",
                    next: 'step-4-deep-1'
                },
{
                    text: "Add more skylights inside the room.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> More lights don't fix the geometry issue. You're still treating symptoms.</p>",
                    next: 'step-4M'
                },
{
                    text: "Inspect the room's meshes for thin walls, flipped normals, and light leaks that could confuse Lumen.",
                    type: 'correct',
                    feedback: "<p>You orbit around the room and check each wall mesh, quickly spotting paper-thin geometry and a few inverted normals. It explains why indirect lighting is bleeding and breaking down. You decide to fix the geometry before touching any more global settings.</p>",
                    next: 'step-4-deep-1'
                }
            ,

                {
                    text: "Right-click the asset in the Content Browser and select 'Validate Assets'.",
                    type: 'wrong',
                    feedback: "Asset validation passes with flying colors. The asset data itself is not corrupt; the problem lies in how it's being used or calculated.",
                    next: 'step-4'
                }]
        },

        'step-4M': {
            skill: 'lighting',
            title: 'Dead End: More Lights',
            prompt: "<p>Adding more lights creates an unnatural, over-lit look and doesn't solve the core geometry problem.</p><strong>What should you investigate instead?</strong>",
            choices: [
{
                    text: "Check the room's geometry thickness and mesh construction.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You focus on the actual problem: the geometry.</p>",
                    next: 'step-4-deep-1'
                },
{
                    text: "Increase the intensity of all point lights in the room to overpower the dark areas.",
                    type: 'misguided',
                    feedback: "<p>You crank up the light intensities and the room looks blown out while the GI still behaves oddly in corners. A lighting artist points out that if the bounce is wrong, flooding the scene with direct light just hides the real issue. You're still not addressing the geometry.</p>",
                    next: 'step-4M'
                },
{
                    text: "Add additional fill lights near the problem corners instead of touching the meshes.",
                    type: 'wrong',
                    feedback: "<p>You start sprinkling small fill lights into every dark corner. The level becomes overlit and visually noisy, and performance starts to dip. You've made the lighting setup harder to maintain without resolving the underlying GI discrepancy.</p>",
                    next: 'step-4M'
                },
{
                    text: "Use the Lumen scene visualizer to confirm where geometry is missing or too thin before making changes.",
                    type: 'partial',
                    feedback: "<p>You open the Lumen visualizer and immediately see that some walls barely show up or have gaps. You still haven't edited the meshes, but now you have clear evidence that geometry is at fault. The next logical step is to actually fix those meshes.</p>",
                    next: 'step-4-deep-1'
                }
            ]
        },

        'step-5': {
            skill: 'lighting',
            title: 'Fixing Geometry',
            prompt: "<p><strong>You call over the Environment Artist:</strong> \"How did you build this room?\"</p><p>They explain: \"Oh, I just used single planes for the walls to save on tri count. Is that a problem?\"</p><p>You explain that Lumen needs thick geometry to properly trace light. They understand and offer to help rebuild it.</p><strong>What's the fix?</strong>",
            choices: [
{
                    text: "Just make the planes double-sided in the material.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Double-sided rendering doesn't give the geometry actual thickness. Lumen still can't trace properly through zero-thickness geometry.</p>",
                    next: 'step-5W'
                },
{
                    text: "Replace problematic wall planes with solid box meshes that have proper thickness.",
                    type: 'correct',
                    feedback: "<p>You swap out the ultra-thin planes for box meshes with actual volume. After rebuilding the level, Lumen's GI behaves much more predictably and the light leaks disappear. This directly addresses the core visibility and distance field issues.</p>",
                    next: 'step-6'
                },
{
                    text: "Add simple blocking volumes behind thin walls instead of touching the original meshes.",
                    type: 'partial',
                    feedback: "<p>You drop in blocking volumes to give Lumen something more solid to work with. The GI improves in most areas, but the setup is now a bit hacky and hard to reason about. Long term, the meshes themselves still need to be cleaned up.</p>",
                    next: 'step-5W'
                }
            ,

                {
                    text: "Toggle the relevant plugin off and back on in the Plugins menu.",
                    type: 'misguided',
                    feedback: "You restart the editor twice to toggle the plugin. The issue remains unchanged. The plugin was working fine; the configuration was just wrong.",
                    next: 'step-4-deep-1'
                }]
        },

        'step-5W': {
            skill: 'lighting',
            title: 'Dead End: Double-Sided Material',
            prompt: "<p>Making the material double-sided doesn't add physical thickness to the geometry. Lumen still struggles.</p><strong>What's the real solution?</strong>",
            choices: [
{
                    text: "Replace the planes with actual thick geometry (boxes or solid meshes).",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> Now you're addressing the actual geometry problem.</p>",
                    next: 'step-6'
                },
{
                    text: "Enable Two Sided on the wall material and hope Lumen treats the room as closed.",
                    type: 'misguided',
                    feedback: "<p>You flip the material to Two Sided and the walls do render from both sides, but Lumen's representation of the scene is still based on geometry, not material tricks. Some artifacts shift around, yet the core GI problem remains.</p>",
                    next: 'step-5W'
                },
{
                    text: "Increase the material opacity mask or shadow-related settings to try to block more light.",
                    type: 'wrong',
                    feedback: "<p>You dig into opacity and shadow settings, trying to force the material to occlude more light. This adds complexity and can introduce shadow artifacts without changing the underlying mesh thickness. You lose time without meaningful GI improvement.</p>",
                    next: 'step-5W'
                },
{
                    text: "Ask the environment artist to review the meshes and propose a proper geometry fix.",
                    type: 'partial',
                    feedback: "<p>You pull in the environment artist, who immediately calls out the paper-thin walls and suggests replacing them with solid assets. You haven't made the change yet, but you now have clear direction to move away from material hacks and fix the meshes.</p>",
                    next: 'step-6'
                }
            ]
        },

        'step-6': {
            skill: 'lighting',
            title: 'Mesh Distance Fields',
            prompt: "<p><strong>The Environment Artist finishes rebuilding the walls:</strong> \"Okay, I replaced everything with proper thick meshes. How does it look now?\"</p><p>The GI is much better, but you notice some furniture meshes in the room still appear oddly dark. You switch to <strong>Mesh Distance Fields</strong> visualization to investigate.</p><strong>What do you find?</strong>",
            choices: [
{
                    text: "Assume it's a material issue and start tweaking roughness values.",
                    type: 'misguided',
                    feedback: "<p><strong>Extended Time Logged:</strong> Material properties affect appearance but won't fix missing distance field data for Lumen.</p>",
                    next: 'step-6M'
                },
{
                    text: "Verify that Generate Mesh Distance Fields is enabled for the affected meshes and rebuild distance fields.",
                    type: 'correct',
                    feedback: "<p>You open the mesh settings and see that distance fields aren't generated for a few key assets. After enabling them and rebuilding, Lumen's indirect lighting becomes more stable and accurate in those areas.</p>",
                    next: 'step-6-deep-1'
                },
{
                    text: "Increase the global distance field resolution in Project Settings to try to sharpen GI details.",
                    type: 'partial',
                    feedback: "<p>You raise the overall distance field resolution, which helps some small details but comes with a noticeable performance cost. The scene looks better, but you suspect per-mesh settings would have been a cleaner, more targeted solution.</p>",
                    next: 'step-6M'
                }
            ,

                {
                    text: "Right-click the asset in the Content Browser and select 'Validate Assets'.",
                    type: 'wrong',
                    feedback: "Asset validation passes with flying colors. The asset data itself is not corrupt; the problem lies in how it's being used or calculated.",
                    next: 'step-6'
                }]
        },

        'step-6M': {
            skill: 'lighting',
            title: 'Dead End: Material Tweaking',
            prompt: "<p>Adjusting materials didn't fix the dark meshes. The problem is at the mesh level, not the material level.</p><strong>What should you check?</strong>",
            choices: [
{
                    text: "Check the mesh distance field settings.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You investigate the mesh-level settings for Lumen.</p>",
                    next: 'step-6-deep-1'
                },
{
                    text: "Tweak roughness and specular on wall materials to try to smooth out noisy GI.",
                    type: 'misguided',
                    feedback: "<p>You adjust roughness and specular values, which changes how highlights and reflections look but doesn't fix the underlying GI structure. The indirect lighting remains unstable in problem areas, and you're still ignoring distance field settings.</p>",
                    next: 'step-6M'
                },
{
                    text: "Increase emissive contribution on a few materials so they 'light up' the space more.",
                    type: 'wrong',
                    feedback: "<p>You push emissive values and the room starts to glow unnaturally. While Lumen does pick up some extra bounce, the lighting now fights the art direction and still feels inconsistent. You've traded one problem for another without addressing the real cause.</p>",
                    next: 'step-6M'
                },
{
                    text: "Open the Lumen visualizer and compare how the distance fields look for problem meshes versus working ones.",
                    type: 'partial',
                    feedback: "<p>You bring up the visualizer and immediately notice that some meshes barely register in the distance field. This gives you a clear hint that mesh distance field settings are the culprit, nudging you toward the correct configuration work.</p>",
                    next: 'step-6-deep-1'
                }
            ]
        },

        'step-7': {
            skill: 'lighting',
            title: 'Initial Verification',
            prompt: "<p><strong>You've made all the fixes:</strong> Lumen enabled, thick geometry, distance fields generated. Time to show the Art Lead.</p><p>\"Let me see it in action,\" they say.</p><strong>How do you demonstrate that it's working?</strong>",
            choices: [
{
                    text: "Just look at it in the editor viewport and call it done.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> The viewport can be misleading. Always verify in PIE for accurate lighting behavior.</p>",
                    next: 'step-8'
                },
{
                    text: "Use the Lumen scene and surface cache visualizers to confirm GI coverage across the room.",
                    type: 'correct',
                    feedback: "<p>You step through the visualizers and see that the room is now represented cleanly in Lumen's data. Bounce lighting looks continuous and surfaces cache correctly. With the base behavior validated, you're ready to test more dynamic scenarios.</p>",
                    next: 'step-8'
                },
{
                    text: "Rely on a quick eyeball pass in Lit mode without any debug visualizers.",
                    type: 'partial',
                    feedback: "<p>You fly around in Lit mode and the scene seems fine, but you're essentially guessing. Without debug overlays, you could easily miss subtle coverage issues or cache problems. You decide you should still run more aggressive, dynamic tests.</p>",
                    next: 'step-8'
                }
            ,

                {
                    text: "Right-click the asset in the Content Browser and select 'Validate Assets'.",
                    type: 'wrong',
                    feedback: "Asset validation passes with flying colors. The asset data itself is not corrupt; the problem lies in how it's being used or calculated.",
                    next: 'step-6-deep-1'
                }]
        },

        'step-8': {
            skill: 'lighting',
            title: 'Dynamic Testing',
            prompt: "<p><strong>The Art Lead is impressed:</strong> \"Wow, that looks so much better! But wait--will this update properly when we change the time of day? We need dynamic lighting for our day/night cycle.\"</p><p>Good question. You need to verify Lumen's dynamic behavior.</p><strong>What test should you perform?</strong>",
            choices: [
{
                    text: "Skip dynamic testing and move on.",
                    type: 'wrong',
                    feedback: "<p><strong>Maximum Time Logged:</strong> Without testing dynamic behavior, you might miss issues that only appear when lighting changes.</p>",
                    next: 'step-8W'
                },
{
                    text: "In Play In Editor, animate a key light's intensity and color while watching how Lumen updates in real time.",
                    type: 'correct',
                    feedback: "<p>You hook the light up to a simple curve and watch the GI respond smoothly as the light ramps and shifts color. There are no obvious hitches or stale lighting, confirming that dynamic changes are propagating correctly.</p>",
                    next: 'step-9'
                },
{
                    text: "Only scrub the light's transform in the editor viewport without actually entering Play mode.",
                    type: 'partial',
                    feedback: "<p>You drag the light around in the editor and things look okay, but this doesn't fully match runtime behavior. Without testing in PIE or a packaged build, you might miss frame-to-frame issues or streaming interactions. You still need a proper dynamic test pass.</p>",
                    next: 'step-8W'
                }
            ,

                {
                    text: "Increase the Engine Scalability Settings to Cinematic to see if it's a quality level issue.",
                    type: 'misguided',
                    feedback: "You max out the scalability settings. While the frame rate drops, the specific bug you're tracking doesn't change behavior. It's a logic or configuration issue, not a scalability artifact.",
                    next: 'step-8'
                }]
        },

        'step-8W': {
            skill: 'lighting',
            title: 'Dead End: Incomplete Testing',
            prompt: "<p>You skipped dynamic testing, but later discover the GI doesn't update properly when lights move. You should have tested this earlier.</p><strong>What should you do?</strong>",
            choices: [
{
                    text: "Go back and test dynamic light changes.",
                    type: 'correct',
                    feedback: "<p><strong>Optimal Time Logged:</strong> You perform the dynamic test and verify everything works.</p>",
                    next: 'step-9'
                },
{
                    text: "Capture a single before/after screenshot and assume dynamic GI is fine if they look similar.",
                    type: 'misguided',
                    feedback: "<p>You compare static screenshots and conclude everything is okay, but this doesn't reveal temporal issues, hitches, or late updates. Your lead reminds you that dynamic systems need time-based testing, not just still images.</p>",
                    next: 'step-8W'
                },
{
                    text: "Blame Nanite or Virtual Shadow Maps without collecting any profiling data.",
                    type: 'wrong',
                    feedback: "<p>You start pointing at Nanite and VSM as likely culprits, but you haven't actually profiled or isolated the issue. This sends the team on a wild goose chase until someone insists on re-running proper dynamic Lumen tests.</p>",
                    next: 'step-8W'
                },
{
                    text: "Set up a simple Blueprint-driven light flicker test and run it in PIE to validate dynamic GI updates.",
                    type: 'partial',
                    feedback: "<p>You wire the light to a Blueprint that rapidly changes its intensity and color during PIE. The GI reacts correctly, confirming the system behaves as expected under stress. You finally have the evidence you need to move forward.</p>",
                    next: 'step-9'
                }
            ]
        },

        'step-9': {
            skill: 'lighting',
            title: 'Performance Check',
            prompt: "<p><strong>The Tech Lead stops by to review your work:</strong> \"Looks great visually, but what's the performance cost? We need to ship on console too.\"</p><p>Good point--you should verify the performance impact.</p><strong>What should you check?</strong>",
            choices: [
{
                    text: "Assume performance is fine without checking.",
                    type: 'partial',
                    feedback: "<p><strong>Standard Time Logged:</strong> Always verify performance, especially with Lumen. You check and confirm it's acceptable.</p>",
                    next: 'step-4-deep-1'
                }
            ]
        },




        





                },
{
                    text: "Profile the scene using stat GPU and Lumen console variables to measure the cost of your GI setup.",
                    type: 'correct',
                    feedback: "<p>You run stat GPU and adjust r.Lumen settings while watching frame time. You get a clear picture of how much Lumen is costing you and where you can safely dial quality up or down. This closes the loop between quality and performance.</p>",
                    next: 'step-4-deep-1'
                }
            ]
        },




        





                },
{
                    text: "Lower all Lumen quality settings to their minimum values to guarantee better performance.",
                    type: 'misguided',
                    feedback: "<p>You slam the quality sliders down and FPS improves, but the scene looks noticeably worse and QA immediately flags the regression. You've improved performance at the expense of visual targets, and now you need a more measured tuning approach.</p>",
                    next: 'step-9'
                }
            ,

                {
                    text: "Increase the Engine Scalability Settings to Cinematic to see if it's a quality level issue.",
                    type: 'misguided',
                    feedback: "You max out the scalability settings. While the frame rate drops, the specific bug you're tracking doesn't change behavior. It's a logic or configuration issue, not a scalability artifact.",
                    next: 'step-9'
                }]
        },

        




        






        'conclusion': {
            skill: 'lighting',
            title: 'Conclusion',
            prompt: "<p><strong>Lesson Learned:</strong> If an interior is pitch black with no bounce light:</p><ul><li>First, ensure <strong>Lumen is enabled</strong> as the Dynamic Global Illumination method in Project Settings (requires editor restart).</li><li>Second, verify the room is built with <strong>thick, solid geometry</strong> (not thin planes) so Lumen can properly trace and contain light.</li><li>Third, ensure meshes have <strong>Generate Mesh Distance Fields</strong> enabled.</li><li>Finally, always test <strong>dynamic lighting changes</strong> and check <strong>performance</strong> before considering the fix complete.</li></ul>",
            choices: [

            
                {
                    text: "Toggle the relevant plugin off and back on in the Plugins menu.",
                    type: 'misguided',
                    feedback: "You restart the editor twice to toggle the plugin. The issue remains unchanged. The plugin was working fine; the configuration was just wrong.",
                    next: 'step-4-deep-1'
                }
            ]
        },




        





                },
                {
                    text: "Increase the Engine Scalability Settings to Cinematic to see if it's a quality level issue.",
                    type: 'misguided',
                    feedback: "You max out the scalability settings. While the frame rate drops, the specific bug you're tracking doesn't change behavior. It's a logic or configuration issue, not a scalability artifact.",
                    next: 'step-4-deep-1'
                }
            ]
        },




        





                },
                {
                    text: "Right-click the asset in the Content Browser and select 'Validate Assets'.",
                    type: 'wrong',
                    feedback: "Asset validation passes with flying colors. The asset data itself is not corrupt; the problem lies in how it's being used or calculated.",
                    next: 'step-4-deep-1'
                }
            ]
        },




        





                },
                {
                    text: "Close the editor, delete the Intermediate folder, and regenerate project files.",
                    type: 'wrong',
                    feedback: "You perform a full project regeneration. It takes 10 minutes to recompile shaders, but when the editor opens, the issue persists exactly as before. This was a workflow red herring.",
                    next: 'step-4-deep-1'
                }
            ]
        },




        





                }]
        }
    }
};]
        }
    }
};