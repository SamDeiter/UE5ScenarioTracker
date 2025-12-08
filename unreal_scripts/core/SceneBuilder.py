"""
Scene Builder for Unreal Engine Scenario Automation

This module handles setting up Unreal Engine scenes based on JSON specifications
from the scenario data.

Improved with patterns from Help.md:
- Modern Subsystem architecture (UE5+)
- Asset validation before spawning
- Non-blocking viewport refresh
"""

import unreal
import json
import time

# Import agent utilities for modern patterns
try:
    from AgentUtils import EditorSubsystems, AssetInspector, APIIntrospector
    HAS_AGENT_UTILS = True
except ImportError:
    HAS_AGENT_UTILS = False


class SceneBuilder:
    """
    Builds and configures Unreal Engine scenes from scene specifications.
    
    Uses modern UE5 Subsystem architecture when available.
    """
    
    def __init__(self):
        # Use modern subsystems when available, fallback to legacy
        if HAS_AGENT_UTILS:
            self.actor_subsystem = EditorSubsystems.get_actor_subsystem()
            self.level_subsystem = EditorSubsystems.get_level_subsystem()
        else:
            self.actor_subsystem = None
            self.level_subsystem = None
        
        # Legacy fallback utilities
        self.editor_util = unreal.EditorLevelLibrary()
        self.asset_util = unreal.EditorAssetLibrary()
        
    def clear_level(self):
        """Remove all non-persistent actors from the current level"""
        unreal.log("Clearing level...")
        
        # Use modern subsystem if available
        if HAS_AGENT_UTILS:
            actors = EditorSubsystems.get_all_actors()
        else:
            actors = unreal.EditorLevelLibrary.get_all_level_actors()
        for actor in actors:
            # Skip persistent actors
            if not self._is_persistent_actor(actor):
                unreal.EditorLevelLibrary.destroy_actor(actor)
        
        unreal.log(f"Level cleared")
    
    def _is_persistent_actor(self, actor):
        """Check if actor should be kept (is persistent)"""
        if actor is None:
            return False
        
        # Get actor class name safely
        try:
            class_name = actor.get_class().get_name()
        except:
            return False
        
        # List of persistent actor class names - preserve environment between steps
        # DO NOT include lights here - they should be recreated for each step
        persistent_classes = [
            'LevelBounds',
            'WorldSettings',
            'DefaultPhysicsVolume',
            'WorldDataLayers',
            'Landscape',
            'SM_SkySphere',
            'SkyAtmosphere',
            'ExponentialHeightFog',
            'VolumetricCloud',
            'Floor',
            'PlayerStart',
            'StaticMeshActor',  # Keep cubes and other static meshes
            'Cube'  # Specifically keep cube actors
        ]
        
        return class_name in persistent_classes
    
    def spawn_actor(self, actor_spec):
        """
        Spawn an actor based on specification
        
        Args:
            actor_spec (dict): Actor configuration from sceneSetup
            
        Returns:
            unreal.Actor: The spawned actor
        """
        actor_type = actor_spec.get('type')
        actor_id = actor_spec.get('id', 'Actor')
        
        # Get transform
        transform_spec = actor_spec.get('transform', {})
        location = unreal.Vector(*transform_spec.get('location', [0, 0, 0]))
        rotation = unreal.Rotator(*transform_spec.get('rotation', [0, 0, 0]))
        scale = unreal.Vector(*transform_spec.get('scale', [1, 1, 1]))
        
        actor = None
        
        # Spawn based on type
        if actor_type == 'DirectionalLight':
            actor = self._spawn_directional_light(actor_spec, location, rotation)
        elif actor_type == 'PointLight':
            actor = self._spawn_point_light(actor_spec, location, rotation)
        elif actor_type == 'SkyLight':
            actor = self._spawn_sky_light(actor_spec, location)
        elif actor_type == 'Landscape':
            actor = self._spawn_landscape(actor_spec, location, rotation, scale)
        elif actor_type == 'StaticMeshActor':
            actor = self._spawn_static_mesh(actor_spec, location, rotation, scale)
        elif actor_type.startswith('BP_'):
            actor = self._spawn_blueprint(actor_spec, location, rotation, scale)
        else:
            unreal.log_warning(f"Unknown actor type: {actor_type}")
            return None
        
        if actor:
            actor.set_actor_label(actor_id)
            
            # Handle selection
            if actor_spec.get('selected', False):
                unreal.EditorLevelLibrary.set_selected_level_actors([actor])
        
        return actor
    
    def _spawn_directional_light(self, spec, location, rotation):
        """Spawn and configure a directional light"""
        actor = self.editor_util.spawn_actor_from_class(
            unreal.DirectionalLight,
            location,
            rotation
        )
        
        light_component = actor.get_component_by_class(unreal.DirectionalLightComponent)
        
        unreal.log(f"Configuring DirectionalLight: {spec.get('id', spec.get('label', 'Unknown'))}")
        
        # Set intensity
        if 'intensity' in spec:
            light_component.set_intensity(spec['intensity'])
            unreal.log(f"  ✓ Set intensity: {spec['intensity']}")
        
        # Set color
        if 'lightColor' in spec or 'color' in spec:
            color = spec.get('lightColor', spec.get('color'))
            light_component.set_light_color(
                unreal.LinearColor(color[0], color[1], color[2])
            )
            unreal.log(f"  ✓ Set color: RGB({color[0]}, {color[1]}, {color[2]})")
            
            # Force viewport refresh using improved pattern
            # Mark component as modified to trigger re-render
            light_component.modify()
            
            # Invalidate viewports to trigger rendering
            unreal.EditorLevelLibrary.editor_invalidate_viewports()
            
            # Brief delay to allow render queue to process
            # Note: For fully async, use FrameDelayedAction from AgentUtils
            time.sleep(0.5)
            unreal.log(f"  ✓ Refreshed viewport for light color change")
        
        # Set shadow distance (if specified)
        if 'dynamicShadowDistance' in spec:
            try:
                light_component.set_editor_property(
                    'dynamic_shadow_distance_movable_light',
                    spec['dynamicShadowDistance']
                )
                # Verify it was set
                actual_value = light_component.get_editor_property('dynamic_shadow_distance_movable_light')
                unreal.log(f"  ✓ Set dynamicShadowDistance: {spec['dynamicShadowDistance']} (verified: {actual_value})")
            except Exception as e:
                unreal.log_warning(f"  ✗ Failed to set dynamicShadowDistance: {e}")
        
        # Set cascade count (if specified)
        if 'numDynamicShadowCascades' in spec:
            try:
                light_component.set_editor_property(
                    'dynamic_shadow_cascades',
                    spec['numDynamicShadowCascades']
                )
                # Verify it was set
                actual_value = light_component.get_editor_property('dynamic_shadow_cascades')
                unreal.log(f"  ✓ Set numDynamicShadowCascades: {spec['numDynamicShadowCascades']} (verified: {actual_value})")
            except Exception as e:
                unreal.log_warning(f"  ✗ Failed to set numDynamicShadowCascades: {e}")
        
        unreal.log(f"Spawned DirectionalLight: {spec.get('id', spec.get('label', 'Actor'))}")
        return actor
    
    def _spawn_point_light(self, spec, location, rotation):
        """Spawn and configure a point light"""
        actor = self.editor_util.spawn_actor_from_class(
            unreal.PointLight,
            location,
            rotation
        )
        
        light_component = actor.get_component_by_class(unreal.PointLightComponent)
        
        if 'intensity' in spec:
            light_component.set_intensity(spec['intensity'])
        
        if 'lightColor' in spec:
            color = spec['lightColor']
            light_component.set_light_color(
                unreal.LinearColor(color[0], color[1], color[2])
            )
        
        if 'attenuationRadius' in spec:
            light_component.set_attenuation_radius(spec['attenuationRadius'])
        
        unreal.log(f"Spawned PointLight: {spec.get('id')}")
        return actor
    
    def _spawn_sky_light(self, spec, location):
        """Spawn and configure a sky light"""
        actor = self.editor_util.spawn_actor_from_class(
            unreal.SkyLight,
            location,
            unreal.Rotator(0, 0, 0)
        )
        
        sky_component = actor.get_component_by_class(unreal.SkyLightComponent)
        
        if 'intensity' in spec:
            sky_component.set_intensity(spec['intensity'])
        
        if 'color' in spec:
            color = spec['color']
            sky_component.set_light_color(
                unreal.LinearColor(color[0], color[1], color[2])
            )
        
        unreal.log(f"Spawned SkyLight")
        return actor
    
    def _spawn_landscape(self, spec, location, rotation, scale):
        """Spawn or use existing landscape"""
        # For now, assume landscape already exists in level
        # Full landscape creation is complex and would need LandscapeEditorObject
        
        # Try to find existing landscape
        all_actors = unreal.EditorLevelLibrary.get_all_level_actors()
        for actor in all_actors:
            # Check if actor is a Landscape using class name
            try:
                if actor.get_class().get_name() == 'Landscape':
                    unreal.log(f"Using existing Landscape")
                    
                    # Apply material if specified
                    if 'material' in spec:
                        material = unreal.load_asset(spec['material'])
                        if material:
                            landscape_component = actor.get_component_by_class(
                                unreal.LandscapeComponent
                            )
                            if landscape_component:
                                landscape_component.set_editor_property(
                                    'landscape_material',
                                    material
                                )
                    
                    return actor
            except:
                continue
        
        unreal.log_warning("No existing landscape found. Please create one manually.")
        return None
    
    def _spawn_static_mesh(self, spec, location, rotation, scale):
        """Spawn a static mesh actor"""
        actor = self.editor_util.spawn_actor_from_class(
            unreal.StaticMeshActor,
            location,
            rotation
        )
        
        # Load and set mesh
        if 'mesh' in spec:
            mesh = unreal.load_asset(spec['mesh'])
            if mesh:
                static_mesh_component = actor.static_mesh_component
                static_mesh_component.set_static_mesh(mesh)
                static_mesh_component.set_world_scale3d(scale)
        
        # Apply material
        if 'material' in spec:
            material = unreal.load_asset(spec['material'])
            if material:
                static_mesh_component = actor.static_mesh_component
                static_mesh_component.set_material(0, material)
        
        unreal.log(f"Spawned StaticMeshActor: {spec.get('id')}")
        return actor
    
    def _spawn_blueprint(self, spec, location, rotation, scale):
        """Spawn a blueprint actor"""
        bp_path = f"/Game/Blueprints/{spec['type']}"
        blueprint_class = unreal.load_asset(bp_path)
        
        if blueprint_class:
            actor = self.editor_util.spawn_actor_from_object(
                blueprint_class,
                location,
                rotation
            )
            
            if actor:
                actor.set_actor_scale3d(scale)
                unreal.log(f"Spawned Blueprint: {spec.get('id')}")
                return actor
        
        unreal.log_warning(f"Could not load blueprint: {bp_path}")
        return None
    
    def setup_camera(self, camera_spec):
        """Configure the viewport camera"""
        location = unreal.Vector(*camera_spec['location'])
        rotation = unreal.Rotator(*camera_spec['rotation'])
        
        # Set viewport camera
        unreal.EditorLevelLibrary.set_level_viewport_camera_info(
            location,
            rotation
        )
        
        unreal.log(f"Camera positioned at {camera_spec['location']}")
    
    def setup_scene(self, scene_spec):
        """
        Complete scene setup from specification
        
        Args:
            scene_spec (dict): Full scene specification from sceneSetup
        """
        unreal.log("=" * 60)
        unreal.log("Setting up scene...")
        unreal.log("=" * 60)
        
        # Clear existing scene
        self.clear_level()
        
        # Spawn all actors
        for actor_spec in scene_spec.get('actors', []):
            self.spawn_actor(actor_spec)
        
        # Spawn lighting actors
        for light_spec in scene_spec.get('lighting', []):
            self.spawn_actor(light_spec)
        
        # Configure camera
        if 'camera' in scene_spec:
            self.setup_camera(scene_spec['camera'])
        
        # Apply post-process settings
        if 'postProcess' in scene_spec:
            self._apply_post_process(scene_spec['postProcess'])
        
        # Configure UI
        if 'ui' in scene_spec:
            self._configure_ui(scene_spec['ui'])
        
        # Force viewport refresh
        unreal.EditorLevelLibrary.editor_invalidate_viewports()
        
        unreal.log("Scene setup complete!")
    
    def _apply_post_process(self, pp_spec):
        """Apply post-process settings"""
        # This would configure post-process volume settings
        # For now, just log
        unreal.log(f"Post-process settings: {pp_spec}")
    
    def _configure_ui(self, ui_spec):
        """Configure UI visibility"""
        # Hide stats
        if ui_spec.get('hideUI', False):
            unreal.SystemLibrary.execute_console_command(
                None,
                "showflag.hud 0"
            )
            unreal.SystemLibrary.execute_console_command(
                None,
                "showflag.selection 0"
            )
        
        # Hide grid
        if not ui_spec.get('showGrid', True):
            unreal.SystemLibrary.execute_console_command(
                None,
                "showflag.grid 0"
            )
