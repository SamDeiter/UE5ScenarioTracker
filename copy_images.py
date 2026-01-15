import os
import shutil
import glob

brain_dir = r"C:\Users\Sam Deiter\.gemini\antigravity\brain\f994ddd6-15f9-4568-b4e1-e5a5b87fda5c"
assets_dir = r"C:\Users\Sam Deiter\Documents\GitHub\UE5ScenarioTracker\assets\generated"

# Mapping of prefixes to scenario IDs
mappings = {
    "emissive": "BlackMaterialDueToEmissiveMiswiring",
    "black_metallic": "BlackMetallicObject", 
    "component_mobility": "ComponentMobilityBlock",
    "destroy_actor": "DestroyActorStopsExecutionFlow",
    "security_door": "SecurityDoorLogicGap",
    "vault": "VaultSequenceLockup",
    "world_partition": "WorldPartitionDeepDive",
    "skeleton_mismatch": "MismatchedSkeletonReference",
    "cinematic_cleanup": "LockedCinematicCleanup",
    "redirector": "DanglingAssetRedirectors",
    "volumetric_shadow": "VolumetricShadowingPerformance",
    "material_jitter": "MaterialParameterAndAnimJitter",
    "datalayer": "ForcedDataLayerUnload",
    "sequencer_light": "SequencerLightRestoreStateIssue",
    "physics_lever": "PhysicsLeverFailure",
    "constraint_door": "ConstraintDoorFail",
    "nanite_vsm": "NaniteVSMInstabilityOnMovement",
    "emissive_gi": "EmissiveGILightingFix",
    "skeleton": "MismatchedSkeletonReference",
}

copied = 0
for prefix, scenario_id in mappings.items():
    target_dir = os.path.join(assets_dir, scenario_id)
    os.makedirs(target_dir, exist_ok=True)
    
    # Find all matching images
    pattern = os.path.join(brain_dir, f"{prefix}*.png")
    images = glob.glob(pattern)
    
    for img_path in images:
        filename = os.path.basename(img_path)
        # Extract step number from filename
        parts = filename.replace(".png", "").split("_")
        
        step_name = None
        for i, part in enumerate(parts):
            if part.startswith("step"):
                step_name = part
                break
            elif part == "conclusion":
                step_name = "conclusion"
                break
        
        if step_name:
            target_filename = f"{step_name}.png"
            target_path = os.path.join(target_dir, target_filename)
            shutil.copy2(img_path, target_path)
            print(f"Copied: {scenario_id}/{target_filename}")
            copied += 1

print(f"\nTotal copied: {copied} images")
