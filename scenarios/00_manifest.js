// Initialize the global SCENARIOS object
window.SCENARIOS = window.SCENARIOS || {};

/**
 * Scenario Manifest - Organized by Learning Area
 *
 * Categories:
 * - worldbuilding: Large-scale environments, streaming, spatial organization
 * - game_dev: Game mechanics, logic, physics, interactive systems
 * - look_dev: Visual fidelity, materials, lighting, rendering
 * - tech_art: Asset pipeline, technical setup, cross-discipline workflows
 * - vfx: Visual effects, cinematics, camera work
 */

const MANIFEST = {
  categories: {
    worldbuilding: {
      name: "Worldbuilding",
      description:
        "Large-scale environment creation, streaming, and spatial organization",
      scenarios: [
        "worldbuilding/WorldPartitionDeepDive",
        "worldbuilding/DataLayerStreamingOverride",
        "worldbuilding/ForcedDataLayerUnload",
        "worldbuilding/worldpartition_advanced",
        "worldbuilding/worldpartition_beginner",
        "worldbuilding/worldpartition_intermediate",
        "worldbuilding/world_partition",
      ],
    },
    game_dev: {
      name: "Game Dev",
      description:
        "Game mechanics, logic, physics simulation, and interactive systems",
      scenarios: [
        "game_dev/PhysicsLeverFailure",
        "game_dev/ComponentMobilityBlock",
        "game_dev/ConstraintDoorFail",
        "game_dev/DestroyActorStopsExecutionFlow",
        "game_dev/SecurityDoorLogicGap",
        "game_dev/VaultSequenceLockup",
        "game_dev/LockedCinematicCleanup",
        "game_dev/SequencerLightRestoreStateIssue",
        "game_dev/physicscollisions_advanced",
        "game_dev/physicscollisions_beginner",
        "game_dev/physicscollisions_intermediate",
        "game_dev/blueprintslogic_advanced",
        "game_dev/blueprintslogic_beginner",
        "game_dev/blueprintslogic_intermediate",
        "game_dev/blueprint_infinite_loop",
        "game_dev/inventory",
        "game_dev/dash",
        "game_dev/golem",
        "game_dev/terminal",
        "game_dev/smoke_test",
        "game_dev/WidgetInputFailure",
      ],
    },
    look_dev: {
      name: "Look Dev",
      description:
        "Visual fidelity, materials, lighting, and rendering quality",
      scenarios: [
        "look_dev/BlackMetallicObject",
        "look_dev/EmissiveGILightingFix",
        "look_dev/NaniteVSMInstabilityOnMovement",
        "look_dev/BlackMaterialDueToEmissiveMiswiring",
        "look_dev/DecalTextureAlphaMaskFailure",
        "look_dev/lightingrendering_advanced",
        "look_dev/lightingrendering_beginner",
        "look_dev/lightingrendering_intermediate",
        "look_dev/lumen_gi",
        "look_dev/lumen_gi_failure",
        "look_dev/lumen_mesh_distance",
        "look_dev/directional_light",
        "look_dev/materialsshaders_advanced",
        "look_dev/materialsshaders_beginner",
        "look_dev/materialsshaders_intermediate",
        "look_dev/oversharpened_scene",
      ],
    },
    tech_art: {
      name: "Tech Art",
      description:
        "Asset pipeline, technical setup, and cross-discipline workflows",
      scenarios: [
        "tech_art/DanglingAssetRedirectors",
        "tech_art/MismatchedSkeletonReference",
        "tech_art/RedirectorAndBulkLoadConflict",
        "tech_art/MaterialParameterAndAnimJitter",
        "tech_art/assetmanagement_advanced",
        "tech_art/assetmanagement_beginner",
        "tech_art/assetmanagement_intermediate",
        "tech_art/generator",
      ],
    },
    vfx: {
      name: "VFX",
      description: "Visual effects, cinematics, and visual storytelling",
      scenarios: [
        "vfx/VolumetricShadowingPerformance",
        "vfx/sequencercinematics_advanced",
        "vfx/sequencercinematics_beginner",
        "vfx/sequencercinematics_intermediate",
        "vfx/volumetric_fog_banding",
        "vfx/volumetric_fog_material",
        "vfx/nanite_wpo",
        "vfx/nanite_wpo_failure",
        "vfx/audio_concurrency",
      ],
    },
  },

  // Flat list of all scenario paths
  getAllScenarios() {
    const all = [];
    for (const category of Object.values(this.categories)) {
      all.push(...category.scenarios);
    }
    return all;
  },

  // Get scenarios by category
  getByCategory(categoryKey) {
    return this.categories[categoryKey]?.scenarios || [];
  },

  // Get category info
  getCategoryInfo(categoryKey) {
    return this.categories[categoryKey] || null;
  },
};

// Expose MANIFEST globally
window.MANIFEST = MANIFEST;

if (typeof module !== "undefined" && module.exports) {
  module.exports = MANIFEST;
}
