/**
 * ActorRegistry.js - Actor Type & Property Definitions
 *
 * Reusable across: Level Editor Simulator, Question Generator Scenarios
 *
 * Based on UE5 Source Analysis:
 * - LightComponentDetails.cpp (Light properties)
 * - ComponentTransformDetails.h (Transform section)
 * - MobilityCustomization.cpp (Static/Stationary/Movable)
 *
 * Usage:
 *   import { ActorRegistry } from './core/ActorRegistry.js';
 *
 *   const lightProps = ActorRegistry.getProperties('DirectionalLight');
 *   const categories = ActorRegistry.getCategories('DirectionalLight');
 */

const ActorRegistry = (function () {
  // Category priority per UE5 source (ECategoryPriority)
  const CategoryPriority = {
    TypeSpecific: 0, // Light, Transform - show first
    Default: 1, // Light Profiles, Rendering
    Advanced: 2, // Hidden by default
  };

  // Mobility options with exact UE5 tooltips
  const MobilityOptions = {
    Static: {
      value: "Static",
      tooltip:
        "A static light can't be changed in game.\n• Fully Baked Lighting\n• Fastest Rendering",
    },
    Stationary: {
      value: "Stationary",
      tooltip:
        "A stationary light will only have its shadowing and bounced lighting from static geometry baked by Lightmass, all other lighting will be dynamic. It can change color and intensity in game.\n• Can't Move\n• Allows Partially Baked Lighting\n• Dynamic Shadows from Movable objects",
    },
    Movable: {
      value: "Movable",
      tooltip:
        "Movable lights can be moved and changed in game.\n• Totally Dynamic\n• Whole Scene Dynamic Shadows\n• Slowest Rendering",
    },
  };

  // Light intensity units per LightComponentDetails.cpp
  const IntensityUnits = {
    Lumens: { symbol: "lm", tooltip: "Luminous power or flux in lumens" },
    Candelas: { symbol: "cd", tooltip: "Luminous intensity in candelas" },
    EV: { symbol: "ev", tooltip: "Luminous intensity in EV100" },
    Nits: { symbol: "nt", tooltip: "Luminance in nits" },
  };

  // Actor type definitions
  const actors = {
    DirectionalLight: {
      displayName: "Directional Light",
      icon: "LightActor_16x.png",
      categories: [
        { name: "Favorites", priority: CategoryPriority.Default },
        { name: "Transform", priority: CategoryPriority.TypeSpecific },
        { name: "Light", priority: CategoryPriority.TypeSpecific },
        { name: "Rendering", priority: CategoryPriority.Default },
        { name: "HLOD", priority: CategoryPriority.Default },
        { name: "Lightmass", priority: CategoryPriority.Default },
        { name: "Light Shafts", priority: CategoryPriority.Default },
        { name: "Cascaded Shadow Maps", priority: CategoryPriority.Default },
        { name: "Distance Field Shadows", priority: CategoryPriority.Default },
        { name: "Ray Tracing", priority: CategoryPriority.Default },
        { name: "Atmosphere and Cloud", priority: CategoryPriority.Default },
        { name: "Light Function", priority: CategoryPriority.Default },
        { name: "Tags", priority: CategoryPriority.Default },
        { name: "Cooking", priority: CategoryPriority.Default },
        { name: "Performance", priority: CategoryPriority.Advanced },
        { name: "Physics", priority: CategoryPriority.Default },
        { name: "Networking", priority: CategoryPriority.Default },
        { name: "Actor", priority: CategoryPriority.Default },
        { name: "World Partition", priority: CategoryPriority.Default },
        { name: "LOD", priority: CategoryPriority.Default },
        { name: "Asset User Data", priority: CategoryPriority.Default },
        { name: "Navigation", priority: CategoryPriority.Default },
        { name: "Level Instance", priority: CategoryPriority.Default },
        { name: "Data Layers", priority: CategoryPriority.Default },
      ],
      properties: {
        Transform: [
          {
            name: "Location",
            type: "vector",
            fields: ["X", "Y", "Z"],
            default: { X: 0, Y: 0, Z: 0 },
          },
          {
            name: "Rotation",
            type: "rotator",
            fields: ["X", "Y", "Z"],
            default: { X: -45, Y: 0, Z: 0 },
          },
          {
            name: "Scale",
            type: "vector",
            fields: ["X", "Y", "Z"],
            default: { X: 1, Y: 1, Z: 1 },
          },
          {
            name: "Mobility",
            type: "mobility",
            options: MobilityOptions,
            default: "Movable",
          },
        ],
        Light: [
          {
            name: "Intensity",
            type: "float",
            units: "lux",
            min: 0,
            max: 100000,
            default: 10,
            sliderExponent: 2,
            tooltip: "Total power of the light in Lux.",
          },
          { name: "Light Color", type: "color", default: "#FFFFFF" },
          {
            name: "Use Temperature",
            type: "bool",
            default: false,
            tooltip: "Whether to use the temperature to color the light.",
          },
          {
            name: "Temperature",
            type: "float",
            units: "°K",
            min: 1700,
            max: 12000,
            default: 6500,
            editCondition: "Use Temperature",
          },
          { name: "Affects World", type: "bool", default: true },
          { name: "Cast Shadows", type: "bool", default: true },
          {
            name: "Indirect Lighting Intensity",
            type: "float",
            min: 0,
            max: 10,
            default: 1,
            advanced: true,
          },
          {
            name: "Volumetric Scattering Intensity",
            type: "float",
            min: 0,
            max: 10,
            default: 1,
            advanced: true,
          },
          {
            name: "Specular Scale",
            type: "float",
            min: 0,
            max: 1,
            default: 1,
            advanced: true,
          },
        ],
        "Cascaded Shadow Maps": [
          {
            name: "Dynamic Shadow Distance MovableLight",
            type: "float",
            min: 0,
            max: 50000,
            default: 20000,
            tooltip:
              "How far from the camera shadows for movable lights are rendered.",
          },
          {
            name: "Dynamic Shadow Distance StationaryLight",
            type: "float",
            min: 0,
            max: 50000,
            default: 0,
            editCondition: "Mobility == Stationary",
          },
          {
            name: "Num Dynamic Shadow Cascades",
            type: "int",
            min: 0,
            max: 10,
            default: 3,
            sliderExponent: 1,
          },
          {
            name: "Cascade Distribution Exponent",
            type: "float",
            min: 1,
            max: 4,
            default: 3,
            advanced: true,
          },
          {
            name: "Cascade Transition Fraction",
            type: "float",
            min: 0,
            max: 0.3,
            default: 0.1,
            advanced: true,
          },
          {
            name: "Shadow Distance Fadeout Fraction",
            type: "float",
            min: 0,
            max: 1,
            default: 0.1,
            advanced: true,
          },
          {
            name: "Use Inset Shadows for Movable Objects",
            type: "bool",
            default: true,
            advanced: true,
          },
        ],
        "Light Shafts": [
          {
            name: "Light Shaft Occlusion",
            type: "bool",
            default: false,
            tooltip:
              "Whether to occlude fog and atmosphere in-scattering with light shafts.",
          },
          {
            name: "Occlusion Mask Darkness",
            type: "float",
            min: 0,
            max: 1,
            default: 0.05,
            editCondition: "Light Shaft Occlusion",
          },
          {
            name: "Occlusion Depth Range",
            type: "float",
            min: 0,
            max: 100000,
            default: 100000,
            editCondition: "Light Shaft Occlusion",
          },
          {
            name: "Light Shaft Bloom",
            type: "bool",
            default: false,
            tooltip:
              "Whether to render light shaft bloom, also known as God Rays.",
          },
          {
            name: "Bloom Scale",
            type: "float",
            min: 0,
            max: 10,
            default: 1,
            editCondition: "Light Shaft Bloom",
          },
          {
            name: "Bloom Threshold",
            type: "float",
            min: 0,
            max: 8,
            default: 0,
            editCondition: "Light Shaft Bloom",
          },
          {
            name: "Bloom Max Brightness",
            type: "float",
            min: 0,
            max: 100,
            default: 10,
            editCondition: "Light Shaft Bloom",
            advanced: true,
          },
          {
            name: "Bloom Tint",
            type: "color",
            default: "#FFFFFF",
            editCondition: "Light Shaft Bloom",
            advanced: true,
          },
        ],
        "Atmosphere and Cloud": [
          {
            name: "Atmosphere Sun Light",
            type: "bool",
            default: true,
            tooltip: "Whether the light should be considered as a sun light.",
          },
          {
            name: "Atmosphere Sun Light Index",
            type: "int",
            min: 0,
            max: 1,
            default: 0,
            editCondition: "Atmosphere Sun Light",
          },
          {
            name: "Cast Cloud Shadows",
            type: "bool",
            default: true,
            advanced: true,
          },
          {
            name: "Cloud Shadow Strength",
            type: "float",
            min: 0,
            max: 1,
            default: 1,
            editCondition: "Cast Cloud Shadows",
            advanced: true,
          },
        ],
        Rendering: [
          { name: "Visible", type: "bool", default: true },
          { name: "Hidden in Game", type: "bool", default: false },
          {
            name: "Cast Static Shadow",
            type: "bool",
            default: true,
            advanced: true,
          },
          {
            name: "Cast Dynamic Shadow",
            type: "bool",
            default: true,
            advanced: true,
          },
          {
            name: "Transmission",
            type: "bool",
            default: false,
            advanced: true,
          },
          {
            name: "Cast Volumetric Shadow",
            type: "bool",
            default: true,
            advanced: true,
          },
          {
            name: "Lighting Channels",
            type: "channels",
            channels: [0, 1, 2],
            default: [true, false, false],
            advanced: true,
          },
        ],
      },
    },

    PointLight: {
      displayName: "Point Light",
      icon: "LightActor_16x.png",
      categories: [
        { name: "Transform", priority: CategoryPriority.TypeSpecific },
        { name: "Light", priority: CategoryPriority.TypeSpecific },
        { name: "Light Profiles", priority: CategoryPriority.Default },
        { name: "Rendering", priority: CategoryPriority.Default },
        { name: "Performance", priority: CategoryPriority.Advanced },
      ],
      properties: {
        Transform: [
          {
            name: "Location",
            type: "vector",
            fields: ["X", "Y", "Z"],
            default: { X: 0, Y: 0, Z: 0 },
          },
          {
            name: "Rotation",
            type: "rotator",
            fields: ["X", "Y", "Z"],
            default: { X: 0, Y: 0, Z: 0 },
          },
          {
            name: "Scale",
            type: "vector",
            fields: ["X", "Y", "Z"],
            default: { X: 1, Y: 1, Z: 1 },
          },
          {
            name: "Mobility",
            type: "mobility",
            options: MobilityOptions,
            default: "Movable",
          },
        ],
        Light: [
          {
            name: "Intensity",
            type: "float",
            units: "lm",
            min: 0,
            max: 100000,
            default: 5000,
            sliderExponent: 2,
          },
          {
            name: "Intensity Units",
            type: "enum",
            options: Object.keys(IntensityUnits),
            default: "Lumens",
          },
          { name: "Light Color", type: "color", default: "#FFFFFF" },
          {
            name: "Attenuation Radius",
            type: "float",
            min: 8,
            max: 16384,
            default: 1000,
            sliderExponent: 5,
          },
          {
            name: "Source Radius",
            type: "float",
            min: 0,
            max: 1000,
            default: 0,
          },
          {
            name: "Soft Source Radius",
            type: "float",
            min: 0,
            max: 1000,
            default: 0,
          },
          {
            name: "Source Length",
            type: "float",
            min: 0,
            max: 1000,
            default: 0,
          },
          { name: "Use Inverse Squared Falloff", type: "bool", default: true },
          {
            name: "Light Falloff Exponent",
            type: "float",
            min: 2,
            max: 16,
            default: 8,
            advanced: true,
          },
          { name: "Use Temperature", type: "bool", default: false },
          {
            name: "Temperature",
            type: "float",
            units: "°K",
            min: 1700,
            max: 12000,
            default: 6500,
          },
          { name: "Affects World", type: "bool", default: true },
          { name: "Cast Shadows", type: "bool", default: true },
          {
            name: "Indirect Lighting Intensity",
            type: "float",
            min: 0,
            max: 10,
            default: 1,
            advanced: true,
          },
          {
            name: "Volumetric Scattering Intensity",
            type: "float",
            min: 0,
            max: 10,
            default: 1,
            advanced: true,
          },
        ],
        Rendering: [
          { name: "Visible", type: "bool", default: true },
          { name: "Cast Static Shadow", type: "bool", default: true },
          { name: "Cast Dynamic Shadow", type: "bool", default: true },
          {
            name: "Affect Translucent Lighting",
            type: "bool",
            default: true,
            advanced: true,
          },
        ],
      },
    },

    SkyLight: {
      displayName: "Sky Light",
      icon: "LightActor_16x.png",
      categories: [
        { name: "Transform", priority: CategoryPriority.TypeSpecific },
        { name: "Light", priority: CategoryPriority.TypeSpecific },
        {
          name: "Distance Field Ambient Occlusion",
          priority: CategoryPriority.Default,
        },
        { name: "Atmosphere and Cloud", priority: CategoryPriority.Default },
        { name: "Rendering", priority: CategoryPriority.Default },
      ],
      properties: {
        Transform: [
          {
            name: "Location",
            type: "vector",
            fields: ["X", "Y", "Z"],
            default: { X: 0, Y: 0, Z: 0 },
          },
          {
            name: "Mobility",
            type: "mobility",
            options: MobilityOptions,
            default: "Stationary",
          },
        ],
        Light: [
          { name: "Real Time Capture", type: "bool", default: false },
          {
            name: "Source Type",
            type: "enum",
            options: ["SLS_Captured Scene", "SLS_Specified Cubemap"],
            default: "SLS_Captured Scene",
          },
          {
            name: "Intensity Scale",
            type: "float",
            min: 0,
            max: 10,
            default: 1,
          },
          { name: "Light Color", type: "color", default: "#FFFFFF" },
          {
            name: "Lower Hemisphere Is Solid Color",
            type: "bool",
            default: false,
          },
          { name: "Lower Hemisphere Color", type: "color", default: "#000000" },
          {
            name: "Cubemap Resolution",
            type: "int",
            min: 64,
            max: 1024,
            default: 128,
          },
          {
            name: "Sky Distance Threshold",
            type: "float",
            min: 0,
            max: 100000,
            default: 150000,
          },
          { name: "Cast Shadows", type: "bool", default: false },
          {
            name: "Indirect Lighting Intensity",
            type: "float",
            min: 0,
            max: 10,
            default: 1,
            advanced: true,
          },
          {
            name: "Volumetric Scattering Intensity",
            type: "float",
            min: 0,
            max: 10,
            default: 1,
            advanced: true,
          },
        ],
        "Distance Field Ambient Occlusion": [
          {
            name: "Occlusion Max Distance",
            type: "float",
            min: 200,
            max: 1500,
            default: 1000,
          },
          { name: "Contrast", type: "float", min: 0, max: 1, default: 0 },
          {
            name: "Occlusion Exponent",
            type: "float",
            min: 0.6,
            max: 1.6,
            default: 1,
          },
          { name: "Min Occlusion", type: "float", min: 0, max: 1, default: 0 },
          { name: "Occlusion Tint", type: "color", default: "#000000" },
        ],
        Rendering: [
          { name: "Visible", type: "bool", default: true },
          { name: "Affects World", type: "bool", default: true },
          { name: "Cast Static Shadow", type: "bool", default: false },
          { name: "Cast Dynamic Shadow", type: "bool", default: false },
        ],
      },
    },

    StaticMeshActor: {
      displayName: "Static Mesh Actor",
      icon: "box_16px.png",
      categories: [
        { name: "Transform", priority: CategoryPriority.TypeSpecific },
        { name: "Static Mesh", priority: CategoryPriority.TypeSpecific },
        { name: "Materials", priority: CategoryPriority.Default },
        { name: "Collision", priority: CategoryPriority.Default },
        { name: "Lighting", priority: CategoryPriority.Default },
        { name: "Rendering", priority: CategoryPriority.Default },
        { name: "LOD", priority: CategoryPriority.Default },
      ],
      properties: {
        Transform: [
          {
            name: "Location",
            type: "vector",
            fields: ["X", "Y", "Z"],
            default: { X: 0, Y: 0, Z: 0 },
          },
          {
            name: "Rotation",
            type: "rotator",
            fields: ["X", "Y", "Z"],
            default: { X: 0, Y: 0, Z: 0 },
          },
          {
            name: "Scale",
            type: "vector",
            fields: ["X", "Y", "Z"],
            default: { X: 1, Y: 1, Z: 1 },
          },
          {
            name: "Mobility",
            type: "mobility",
            options: MobilityOptions,
            default: "Static",
          },
        ],
        "Static Mesh": [
          {
            name: "Static Mesh",
            type: "asset",
            assetType: "StaticMesh",
            default: "StaticMesh'/Engine/BasicShapes/Cube.Cube'",
          },
        ],
        Materials: [
          {
            name: "Element 0",
            type: "asset",
            assetType: "Material",
            default:
              "Material'/Engine/EngineMaterials/DefaultMaterial.DefaultMaterial'",
          },
        ],
        Collision: [
          { name: "Generate Overlap Events", type: "bool", default: false },
          {
            name: "Collision Presets",
            type: "enum",
            options: ["NoCollision", "BlockAll", "OverlapAll", "UI"],
            default: "BlockAll",
          },
        ],
        Lighting: [
          { name: "Cast Shadow", type: "bool", default: true },
          {
            name: "Distance Field Indirect Shadow",
            type: "bool",
            default: false,
            advanced: true,
          },
          {
            name: "Overridden Light Map Res",
            type: "int",
            default: 64,
            advanced: true,
          },
        ],
        Rendering: [
          { name: "Visible", type: "bool", default: true },
          {
            name: "Hidden in Game",
            type: "bool",
            default: false,
            advanced: true,
          },
          { name: "Cast Shadow", type: "bool", default: true },
          {
            name: "Affect Dynamic Indirect Lighting",
            type: "bool",
            default: true,
            advanced: true,
          },
          { name: "Holdout", type: "bool", default: false, advanced: true },
          {
            name: "Use Nanite",
            type: "bool",
            default: true,
            tooltip: "Whether to use Nanite for this mesh.",
          },
          {
            name: "Cast Volumetric Translucent Shadow",
            type: "bool",
            default: true,
            advanced: true,
          },
        ],
        LOD: [
          {
            name: "Forced LOD",
            type: "int",
            min: 0,
            max: 8,
            default: 0,
            tooltip: "LOD selection forced on this actor.",
          },
          {
            name: "Min LOD",
            type: "int",
            min: 0,
            max: 8,
            default: 0,
            advanced: true,
          },
        ],
      },
    },
  };

  return {
    /**
     * Get all actor types
     */
    getActorTypes() {
      return Object.keys(actors);
    },

    /**
     * Get actor definition
     */
    getActor(actorType) {
      return actors[actorType] || null;
    },

    /**
     * Get categories for an actor type (sorted by priority)
     */
    getCategories(actorType) {
      const actor = actors[actorType];
      if (!actor) return [];

      return [...actor.categories].sort((a, b) => a.priority - b.priority);
    },

    /**
     * Get properties for a category
     */
    getProperties(actorType, categoryName) {
      const actor = actors[actorType];
      if (!actor || !actor.properties[categoryName]) return [];

      return actor.properties[categoryName];
    },

    /**
     * Get all properties for an actor
     */
    getAllProperties(actorType) {
      const actor = actors[actorType];
      if (!actor) return {};

      return actor.properties;
    },

    /**
     * Get default values for all properties
     */
    getDefaults(actorType) {
      const actor = actors[actorType];
      if (!actor) return {};

      const defaults = {};
      for (const [category, props] of Object.entries(actor.properties)) {
        for (const prop of props) {
          defaults[prop.name] = prop.default;
        }
      }
      return defaults;
    },

    /**
     * Get mobility options with tooltips
     */
    getMobilityOptions() {
      return MobilityOptions;
    },

    /**
     * Get intensity units
     */
    getIntensityUnits() {
      return IntensityUnits;
    },

    /**
     * Register a new actor type (for extensibility)
     */
    registerActor(actorType, definition) {
      actors[actorType] = definition;
    },

    /**
     * Get category priority constants
     */
    getCategoryPriority() {
      return CategoryPriority;
    },
  };
})();

// Export for ES6 modules and global access
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ActorRegistry };
}
if (typeof window !== "undefined") {
  window.ActorRegistry = ActorRegistry;
}
