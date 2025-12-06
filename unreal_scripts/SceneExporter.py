"""
Scene Exporter for Unreal Engine Scenario Automation

Exports current scene state to JSON for verification and debugging.
"""

import unreal
import json
import os


class SceneExporter:
    """Exports Unreal Engine scene configuration to JSON"""
    
    def export_scene(self, output_path, filename):
        """
        Export current scene state to JSON file
        
        Args:
            output_path (str): Directory to save JSON
            filename (str): Base filename (without extension)
            
        Returns:
            str: Full path to exported JSON file
        """
        os.makedirs(output_path, exist_ok=True)
        
        unreal.log(f"Exporting scene to JSON...")
        
        # Gather scene data
        scene_data = {
            "actors": [],
            "lighting": [],
            "camera": self._get_camera_state(),
            "level": unreal.EditorLevelLibrary.get_editor_world().get_name()
        }
        
        # Export all actors
        actors = unreal.EditorLevelLibrary.get_all_level_actors()
        for actor in actors:
            if not self._is_persistent_actor(actor):
                actor_data = self._export_actor(actor)
                if actor_data:
                    if self._is_light_actor(actor):
                        scene_data["lighting"].append(actor_data)
                    else:
                        scene_data["actors"].append(actor_data)
        
        # Write to file
        full_path = os.path.join(output_path, f"{filename}.json")
        
        with open(full_path, 'w') as f:
            json.dump(scene_data, f, indent=2)
        
        unreal.log(f"Scene exported: {full_path}")
        unreal.log(f"  Actors: {len(scene_data['actors'])}")
        unreal.log(f"  Lights: {len(scene_data['lighting'])}")
        
        return full_path
    
    def _is_persistent_actor(self, actor):
        """Check if actor is persistent (should not be exported)"""
        persistent_types = [
            unreal.LevelBounds,
            unreal.WorldSettings,
            unreal.DefaultPhysicsVolume
        ]
        
        for actor_type in persistent_types:
            if actor.is_a(actor_type):
                return True
        return False
    
    def _is_light_actor(self, actor):
        """Check if actor is a light"""
        return actor.is_a(unreal.Light)
    
    def _export_actor(self, actor):
        """Export single actor data"""
        try:
            location = actor.get_actor_location()
            rotation = actor.get_actor_rotation()
            scale = actor.get_actor_scale3d()
            
            actor_data = {
                "label": actor.get_actor_label(),
                "type": actor.get_class().get_name(),
                "transform": {
                    "location": [location.x, location.y, location.z],
                    "rotation": [rotation.pitch, rotation.yaw, rotation.roll],
                    "scale": [scale.x, scale.y, scale.z]
                }
            }
            
            # Export specific properties based on type
            if actor.is_a(unreal.StaticMeshActor):
                actor_data.update(self._export_static_mesh_actor(actor))
            elif actor.is_a(unreal.Light):
                actor_data.update(self._export_light_actor(actor))
            
            return actor_data
            
        except Exception as e:
            unreal.log_warning(f"Could not export actor {actor.get_actor_label()}: {e}")
            return None
    
    def _export_static_mesh_actor(self, actor):
        """Export static mesh specific data"""
        data = {}
        
        mesh_component = actor.static_mesh_component
        if mesh_component:
            # Get mesh
            mesh = mesh_component.static_mesh
            if mesh:
                data["mesh"] = mesh.get_path_name()
            
            # Get materials
            materials = []
            for i in range(mesh_component.get_num_materials()):
                mat = mesh_component.get_material(i)
                if mat:
                    materials.append(mat.get_path_name())
            
            if materials:
                data["materials"] = materials
        
        return data
    
    def _export_light_actor(self, actor):
        """Export light specific data"""
        data = {}
        
        # Get light component
        if actor.is_a(unreal.DirectionalLight):
            light_comp = actor.get_component_by_class(unreal.DirectionalLightComponent)
            data["lightType"] = "Directional"
        elif actor.is_a(unreal.PointLight):
            light_comp = actor.get_component_by_class(unreal.PointLightComponent)
            data["lightType"] = "Point"
        elif actor.is_a(unreal.SkyLight):
            light_comp = actor.get_component_by_class(unreal.SkyLightComponent)
            data["lightType"] = "Sky"
        else:
            light_comp = None
        
        if light_comp:
            data["intensity"] = light_comp.intensity
            
            # Get color
            color = light_comp.get_light_color()
            data["color"] = [color.r, color.g, color.b]
        
        return data
    
    def _get_camera_state(self):
        """Get current viewport camera state"""
        # Note: Getting exact viewport camera state requires EditorViewportClient
        # This is a simplified version
        return {
            "location": [0, 0, 0],
            "rotation": [0, 0, 0],
            "fov": 90,
            "note": "Camera state from viewport (simplified)"
        }
