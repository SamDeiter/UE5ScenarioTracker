"""
Generate Scenario Skeletons

Creates skeleton JS files with placeholders for ChatGPT to fill in.
This saves tokens by pre-defining the structure.
"""

import os

# Data for all scenarios to be expanded
SCENARIO_DATA = {
    # Asset Management
    'assetmanagement_intermediate.js': {
        'id': 'AssetMissingInPackagedBuild',
        'title': 'Asset Missing in Packaged Build',
        'description': 'A Blueprint works in editor but fails to load a mesh in packaged build. Investigates Soft Object References and cooking settings.',
        'skill': 'asset_management',
        'problem': 'Mesh missing in packaged game.',
        'fix': 'Add directory to "Additional Asset Directories to Cook".'
    },
    'assetmanagement_advanced.js': {
        'id': 'AnimNotifiesNotFiring',
        'title': 'Anim Notifies Not Firing in PIE',
        'description': 'Attack animation plays but effects (Notifies) are missing in PIE. Investigates Montage vs Sequence playback and Notify Trigger Modes.',
        'skill': 'asset_management',
        'problem': 'Particles/Sound missing during attack.',
        'fix': 'Check Notify Trigger Mode or use Montage.'
    },

    # Lighting
    'lightingrendering_intermediate.js': {
        'id': 'LightmapShadowBleeding',
        'title': 'Lightmap Shadow Bleeding',
        'description': 'Static mesh has splotchy shadows despite high resolution. Investigates UV Channel overlaps and Lightmap Coordinate Index.',
        'skill': 'lighting',
        'problem': 'Splotchy shadows on mesh.',
        'fix': 'Fix UV Channel 1 overlaps or Lightmap Coordinate Index.'
    },
    'lightingrendering_advanced.js': {
        'id': 'LumenLightLeaking',
        'title': 'Lumen Light Leaking in Dark Room',
        'description': 'Light leaks through corners of a dark room using Lumen. Investigates geometry thickness and Lumen tracing limitations.',
        'skill': 'lighting',
        'problem': 'Light leaking through walls.',
        'fix': 'Use thick geometry (walls with depth) instead of planes.'
    },

    # Blueprints
    'blueprintslogic_intermediate.js': {
        'id': 'MultiplayerDoorNotOpening',
        'title': 'Door Not Opening for Clients',
        'description': 'Door opens for server but not clients. Investigates Replication, RepNotify, and Server RPCs.',
        'skill': 'blueprints',
        'problem': 'Door logic not replicating.',
        'fix': 'Use RepNotify variable for door state.'
    },
    'blueprintslogic_advanced.js': {
        'id': 'EventDispatcherRaceCondition',
        'title': 'Event Dispatcher Not Firing',
        'description': 'Bound event never fires. Investigates initialization order (Race Condition) and binding lifecycle.',
        'skill': 'blueprints',
        'problem': 'Event binding happens too late.',
        'fix': 'Bind in GameMode or ensure correct init order.'
    },

    # Materials
    'materialsshaders_beginner.js': {
        'id': 'TextureStretching',
        'title': 'Texture Stretching on Mesh',
        'description': 'Material looks distorted. Investigates UV scaling and Texture Coordinate nodes.',
        'skill': 'materials',
        'problem': 'Texture is stretched.',
        'fix': 'Add TexCoord node or fix Mesh UVs.'
    },
    'materialsshaders_intermediate.js': {
        'id': 'TranslucencySortingIssue',
        'title': 'Glass Sorting Incorrectly',
        'description': 'Objects behind glass disappear. Investigates Translucency Sort Priority and Blend Modes.',
        'skill': 'materials',
        'problem': 'Translucent objects sorting wrong.',
        'fix': 'Enable "Render After DOF" or adjust Sort Priority.'
    },
    'materialsshaders_advanced.js': {
        'id': 'WPOShadowDetachment',
        'title': 'Shadow Detached from WPO Mesh',
        'description': 'Shadow stays put while mesh moves with wind. Investigates Shadow Pass Switch and WPO shadows.',
        'skill': 'materials',
        'problem': 'Shadow does not match animated mesh.',
        'fix': 'Enable "Shadow Pass Switch" or correct shadow bias.'
    },

    # Physics
    'physicscollisions_beginner.js': {
        'id': 'NoCollisionOnRock',
        'title': 'Player Walks Through Rock',
        'description': 'Character clips through mesh. Investigates Collision Presets and Simplified Collision.',
        'skill': 'physics',
        'problem': 'Missing collision on mesh.',
        'fix': 'Add Simplified Collision in Static Mesh Editor.'
    },
    'physicscollisions_intermediate.js': {
        'id': 'PhysicsCrateFallsThroughFloor',
        'title': 'Physics Crate Falls Through Floor',
        'description': 'Simulating actor falls through ground. Investigates Complex vs Simple collision requirements for physics.',
        'skill': 'physics',
        'problem': 'Simulating object ignores complex floor.',
        'fix': 'Ensure floor has Simple Collision or object uses Simple.'
    },
    'physicscollisions_advanced.js': {
        'id': 'FastProjectileTunneling',
        'title': 'Projectile Tunneling Through Wall',
        'description': 'Fast object skips collision. Investigates Continuous Collision Detection (CCD).',
        'skill': 'physics',
        'problem': 'Fast object misses collision check.',
        'fix': 'Enable CCD on the projectile.'
    },

    # Sequencer
    'sequencercinematics_beginner.js': {
        'id': 'SequencerLightReverts',
        'title': 'Light Reverts After Cinematic',
        'description': 'Keyframed light resets after sequence. Investigates "Restore State" vs "Keep State".',
        'skill': 'sequencer',
        'problem': 'Property resets on sequence end.',
        'fix': 'Set "When Finished" to "Keep State".'
    },
    'sequencercinematics_intermediate.js': {
        'id': 'CinematicHandClipping',
        'title': 'Hand Clips Through Prop',
        'description': 'Animation compression causes clipping. Investigates Control Rig additive layers in Sequencer.',
        'skill': 'sequencer',
        'problem': 'Hand placement imprecise.',
        'fix': 'Use Control Rig to add additive offset.'
    },
    'sequencercinematics_advanced.js': {
        'id': 'PlayerLockedAfterCinematic',
        'title': 'Input Locked After Cinematic',
        'description': 'Player stuck after cutscene. Investigates Camera Cut track and OnFinished events.',
        'skill': 'sequencer',
        'problem': 'Camera/Input not returned to player.',
        'fix': 'Ensure Camera Cut "Restore State" is on or manually set View Target.'
    },

    # World Partition
    'worldpartition_beginner.js': {
        'id': 'FoliagePoppingInTooClose',
        'title': 'Foliage Popping In Too Close',
        'description': 'Actors load at 10m. Investigates Data Layers and Loading Range.',
        'skill': 'world_partition',
        'problem': 'Loading range too short.',
        'fix': 'Adjust Loading Range or Grid Placement.'
    },
    'worldpartition_intermediate.js': {
        'id': 'LandmarkUnloading',
        'title': 'Landmark Unloading During Mission',
        'description': 'Important mesh unloads. Investigates "Is Spatially Loaded" and Data Layer activation.',
        'skill': 'world_partition',
        'problem': 'Actor unloads by distance.',
        'fix': 'Disable "Is Spatially Loaded" or use Data Layer.'
    },
    'worldpartition_advanced.js': {
        'id': 'DistantCityNotLoading',
        'title': 'Distant City Not Loading',
        'description': 'City invisible until teleport. Investigates HLOD generation for World Partition.',
        'skill': 'world_partition',
        'problem': 'No distant representation.',
        'fix': 'Generate HLODs for the level.'
    },

    # Short Scenarios
    'blueprint_infinite_loop.js': {
        'id': 'EditorFreezeLoop',
        'title': 'Editor Freeze on Loop',
        'description': 'While Loop crashes editor. Investigates infinite loop conditions.',
        'skill': 'blueprints',
        'problem': 'Infinite loop freezes game.',
        'fix': 'Add break condition or incrementer.'
    },
    'oversharpened_scene.js': {
        'id': 'GrainySharpening',
        'title': 'Scene Looks Grainy/Sharpened',
        'description': 'Visuals are harsh. Investigates r.Tonemapper.Sharpen console variable.',
        'skill': 'rendering',
        'problem': 'Over-sharpened visuals.',
        'fix': 'Reduce r.Tonemapper.Sharpen.'
    },
    'lumen_gi.js': {
        'id': 'PitchBlackIndoorGI',
        'title': 'Pitch Black Indoor GI',
        'description': 'No bounce light. Investigates Lumen settings and geometry thickness.',
        'skill': 'lighting',
        'problem': 'No indirect lighting.',
        'fix': 'Enable Lumen and check geometry.'
    },
    'volumetric_fog_banding.js': {
        'id': 'FogBandingArtifacts',
        'title': 'Volumetric Fog Banding',
        'description': 'Fog looks sliced. Investigates GridPixelSize and View Distance.',
        'skill': 'rendering',
        'problem': 'Visual artifacts in fog.',
        'fix': 'Adjust r.VolumetricFog.GridPixelSize.'
    },
    'volumetric_fog_material.js': {
        'id': 'InvisibleFogParticles',
        'title': 'Particles Invisible in Fog',
        'description': 'Effects disappear in fog. Investigates "Apply Volumetric Translucent Shadow".',
        'skill': 'materials',
        'problem': 'Translucency not affecting fog.',
        'fix': 'Enable "Apply Volumetric Translucent Shadow".'
    },
    'lumen_mesh_distance.js': {
        'id': 'MeshBlackAtDistance',
        'title': 'Mesh Black at Distance (Lumen)',
        'description': 'Mesh turns black. Investigates Max Distance Field Replacement.',
        'skill': 'lighting',
        'problem': 'Mesh culled from Lumen scene.',
        'fix': 'Adjust Distance Field Resolution or View Distance.'
    },
    'generator.js': {
        'id': 'SpawnLoopCrash',
        'title': 'Crash on Mass Spawn',
        'description': 'Spawning 1000 actors crashes game. Investigates Time Slicing.',
        'skill': 'blueprints',
        'problem': 'Frame time exceeded by loop.',
        'fix': 'Use Timer or distribute spawn over frames.'
    },
    'terminal.js': {
        'id': 'WidgetInputFailure',
        'title': 'Widget Not Receiving Input',
        'description': 'Terminal UI ignores clicks. Investigates Input Mode Game and UI.',
        'skill': 'ui',
        'problem': 'Input trapped in Game mode.',
        'fix': 'Set Input Mode Game and UI.'
    }
}

def generate_skeleton_content(data):
    return f"""window.SCENARIOS['{data['id']}'] = {{
    meta: {{
        title: "{data['title']}",
        description: "{data['description']}",
        estimateHours: 1.5
    }},
    start: "step-1",
    steps: {{
        'step-1': {{
            skill: '{data['skill']}',
            title: 'Step 1: The Symptom',
            prompt: "[WRITE THIS: {data['problem']} What do you check first?]",
            choices: [
                {{
                    text: "Action: [Check Logs/View Modes]",
                    type: 'correct',
                    feedback: "[WRITE THIS: You find a clue.]",
                    next: 'step-2'
                }},
                {{
                    text: "Action: [Wrong Guess]",
                    type: 'wrong',
                    feedback: "[WRITE THIS: That didn't help.]",
                    next: 'step-1W'
                }}
            ]
        }},
        'step-1W': {{
            skill: '{data['skill']}',
            title: 'Dead End: Wrong Guess',
            prompt: "[WRITE THIS: You went down the wrong path. Recover.]",
            choices: [
                {{
                    text: "Action: [Revert and try again]",
                    type: 'correct',
                    feedback: "[WRITE THIS: Back on track.]",
                    next: 'step-2'
                }}
            ]
        }},
        'step-2': {{
            skill: '{data['skill']}',
            title: 'Step 2: Investigation',
            prompt: "[WRITE THIS: You investigate further. What do you find?]",
            choices: [
                {{
                    text: "Action: [Identify Root Cause]",
                    type: 'correct',
                    feedback: "[WRITE THIS: You found the issue: {data['problem']}]",
                    next: 'step-3'
                }},
                {{
                    text: "Action: [Misguided Attempt]",
                    type: 'misguided',
                    feedback: "[WRITE THIS: Plausible but wrong.]",
                    next: 'step-2M'
                }}
            ]
        }},
        'step-2M': {{
            skill: '{data['skill']}',
            title: 'Dead End: Misguided',
            prompt: "[WRITE THIS: That didn't work. Why?]",
            choices: [
                {{
                    text: "Action: [Realize mistake]",
                    type: 'correct',
                    feedback: "[WRITE THIS: Back to the fix.]",
                    next: 'step-3'
                }}
            ]
        }},
        'step-3': {{
            skill: '{data['skill']}',
            title: 'Step 3: The Fix',
            prompt: "[WRITE THIS: You know the cause. How do you fix it?]",
            choices: [
                {{
                    text: "Action: [{data['fix']}]",
                    type: 'correct',
                    feedback: "[WRITE THIS: You apply the fix. It works!]",
                    next: 'step-4'
                }}
            ]
        }},
        'step-4': {{
            skill: '{data['skill']}',
            title: 'Step 4: Verification',
            prompt: "[WRITE THIS: Verify the fix in PIE.]",
            choices: [
                {{
                    text: "Action: [Play in Editor]",
                    type: 'correct',
                    feedback: "[WRITE THIS: Validated.]",
                    next: 'conclusion'
                }}
            ]
        }},
        'conclusion': {{
            skill: '{data['skill']}',
            title: 'Conclusion',
            prompt: "[WRITE THIS: Summary of the lesson: {data['fix']}]",
            choices: []
        }}
    }}
}};"""

def main():
    # Get script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(script_dir))
    scenarios_dir = os.path.join(project_root, 'scenarios')

    print(f"Generating skeletons in {scenarios_dir}...")

    for filename, data in SCENARIO_DATA.items():
        file_path = os.path.join(scenarios_dir, filename)
        
        # Check if file exists to avoid accidental overwrites of ALREADY DONE files
        # (Though in this case we want to overwrite the single-step ones)
        # We will overwrite blindly as per instruction to batch process.
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(generate_skeleton_content(data))
        
        print(f"Generated skeleton: {filename}")

if __name__ == '__main__':
    main()
