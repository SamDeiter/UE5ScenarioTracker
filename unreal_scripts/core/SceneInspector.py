"""
Scene Inspector for Unreal Engine Scenario Automation

Provides comprehensive scene analysis and introspection capabilities.
Implements the "Perception via API" patterns from the AI Agent framework.

This module allows the automation agent to:
- Query scene state without visual rendering
- Analyze actor hierarchies and relationships
- Compare scene states for verification
- Generate scene reports for debugging
"""

import unreal
import json
from typing import List, Dict, Optional, Any
from datetime import datetime

# Import our agent utilities
try:
    from AgentUtils import EditorSubsystems, AssetInspector, SpatialSensor
except ImportError:
    # Fallback for standalone usage
    pass


class SceneInspector:
    """
    Comprehensive scene analysis and introspection.
    
    Use this to understand scene state, compare snapshots, and 
    generate reports for debugging automated workflows.
    """
    
    def __init__(self):
        self.last_snapshot = None
    
    def get_scene_snapshot(self) -> Dict:
        """
        Capture a complete snapshot of the current scene state.
        
        Returns:
            dict: Complete scene state including all actors and properties
        """
        snapshot = {
            'timestamp': datetime.now().isoformat(),
            'level_name': self._get_level_name(),
            'camera': self._get_camera_state(),
            'actors': [],
            'lights': [],
            'statistics': {}
        }
        
        # Get all actors
        actors = self._get_all_actors()
        
        # Categorize and export actors
        for actor in actors:
            if self._is_system_actor(actor):
                continue
                
            actor_data = self._export_actor_data(actor)
            if actor_data:
                if self._is_light_actor(actor):
                    snapshot['lights'].append(actor_data)
                else:
                    snapshot['actors'].append(actor_data)
        
        # Calculate statistics
        snapshot['statistics'] = {
            'total_actors': len(snapshot['actors']),
            'total_lights': len(snapshot['lights']),
            'actor_types': self._count_actor_types(actors)
        }
        
        self.last_snapshot = snapshot
        return snapshot
    
    def compare_snapshots(self, snapshot1: Dict, snapshot2: Dict) -> Dict:
        """
        Compare two scene snapshots and report differences.
        
        Args:
            snapshot1: First snapshot (usually "before")
            snapshot2: Second snapshot (usually "after")
            
        Returns:
            dict: Differences report
        """
        differences = {
            'added_actors': [],
            'removed_actors': [],
            'modified_actors': [],
            'camera_changed': False,
            'light_changes': []
        }
        
        # Build lookup by label
        actors1 = {a['label']: a for a in snapshot1.get('actors', [])}
        actors2 = {a['label']: a for a in snapshot2.get('actors', [])}
        
        # Find added and removed
        labels1 = set(actors1.keys())
        labels2 = set(actors2.keys())
        
        differences['added_actors'] = list(labels2 - labels1)
        differences['removed_actors'] = list(labels1 - labels2)
        
        # Find modified (same label, different properties)
        for label in labels1 & labels2:
            if actors1[label] != actors2[label]:
                differences['modified_actors'].append({
                    'label': label,
                    'before': actors1[label],
                    'after': actors2[label]
                })
        
        # Check camera
        if snapshot1.get('camera') != snapshot2.get('camera'):
            differences['camera_changed'] = True
        
        # Compare lights
        lights1 = {l['label']: l for l in snapshot1.get('lights', [])}
        lights2 = {l['label']: l for l in snapshot2.get('lights', [])}
        
        for label in lights1.keys() | lights2.keys():
            if label not in lights1:
                differences['light_changes'].append({'type': 'added', 'label': label})
            elif label not in lights2:
                differences['light_changes'].append({'type': 'removed', 'label': label})
            elif lights1[label] != lights2[label]:
                differences['light_changes'].append({
                    'type': 'modified',
                    'label': label,
                    'before': lights1[label],
                    'after': lights2[label]
                })
        
        return differences
    
    def find_actors_by_class(self, class_name: str) -> List[unreal.Actor]:
        """
        Find all actors of a specific class.
        
        Args:
            class_name: The class name to search for (e.g., 'DirectionalLight')
            
        Returns:
            List of matching actors
        """
        actors = self._get_all_actors()
        return [a for a in actors if a.get_class().get_name() == class_name]
    
    def find_actors_by_tag(self, tag: str) -> List[unreal.Actor]:
        """
        Find all actors with a specific tag.
        
        Args:
            tag: The tag to search for
            
        Returns:
            List of matching actors
        """
        actors = self._get_all_actors()
        return [a for a in actors if tag in a.tags]
    
    def find_actors_in_radius(
        self, 
        center: unreal.Vector, 
        radius: float,
        class_filter: str = None
    ) -> List[Dict]:
        """
        Find all actors within a radius of a point.
        
        Args:
            center: Center point to search from
            radius: Search radius
            class_filter: Optional class name to filter by
            
        Returns:
            List of dicts with 'actor', 'distance' keys
        """
        results = []
        actors = self._get_all_actors()
        
        for actor in actors:
            if class_filter and actor.get_class().get_name() != class_filter:
                continue
            
            location = actor.get_actor_location()
            distance = (location - center).length()
            
            if distance <= radius:
                results.append({
                    'actor': actor,
                    'label': actor.get_actor_label(),
                    'class': actor.get_class().get_name(),
                    'distance': distance,
                    'location': [location.x, location.y, location.z]
                })
        
        # Sort by distance
        results.sort(key=lambda x: x['distance'])
        return results
    
    def get_light_summary(self) -> List[Dict]:
        """
        Get a summary of all lights in the scene.
        
        Returns:
            List of light info dicts
        """
        lights = []
        actors = self._get_all_actors()
        
        for actor in actors:
            class_name = actor.get_class().get_name()
            if 'Light' not in class_name:
                continue
            
            light_info = {
                'label': actor.get_actor_label(),
                'class': class_name,
                'location': self._vector_to_list(actor.get_actor_location()),
                'rotation': self._rotator_to_list(actor.get_actor_rotation())
            }
            
            # Get light-specific properties
            light_comp = self._get_light_component(actor)
            if light_comp:
                light_info['intensity'] = light_comp.intensity
                color = light_comp.get_light_color()
                light_info['color'] = [color.r, color.g, color.b]
            
            lights.append(light_info)
        
        return lights
    
    def verify_scene_against_spec(self, scene_spec: Dict) -> Dict:
        """
        Verify current scene matches a specification.
        
        Args:
            scene_spec: The expected scene specification
            
        Returns:
            dict with 'valid', 'errors', 'warnings' keys
        """
        result = {
            'valid': True,
            'errors': [],
            'warnings': []
        }
        
        # Check expected actors exist
        for actor_spec in scene_spec.get('actors', []):
            actor_id = actor_spec.get('id', actor_spec.get('label'))
            actors = self.find_actors_by_class(actor_spec.get('type', ''))
            
            found = any(a.get_actor_label() == actor_id for a in actors)
            if not found:
                result['valid'] = False
                result['errors'].append(f"Missing actor: {actor_id} ({actor_spec.get('type')})")
        
        # Check lights
        for light_spec in scene_spec.get('lighting', []):
            light_id = light_spec.get('id', light_spec.get('label'))
            lights = self.find_actors_by_class(light_spec.get('type', 'DirectionalLight'))
            
            matching = [l for l in lights if l.get_actor_label() == light_id]
            if not matching:
                result['valid'] = False
                result['errors'].append(f"Missing light: {light_id}")
            else:
                # Verify light properties
                light = matching[0]
                light_comp = self._get_light_component(light)
                if light_comp and 'color' in light_spec:
                    actual_color = light_comp.get_light_color()
                    expected = light_spec['color']
                    if not self._colors_match(actual_color, expected):
                        result['warnings'].append(
                            f"Light {light_id} color mismatch: "
                            f"expected {expected}, got [{actual_color.r}, {actual_color.g}, {actual_color.b}]"
                        )
        
        return result
    
    def generate_report(self, output_path: str = None) -> str:
        """
        Generate a human-readable scene report.
        
        Args:
            output_path: Optional path to save the report
            
        Returns:
            str: The report content
        """
        snapshot = self.get_scene_snapshot()
        
        lines = [
            "=" * 60,
            "SCENE INSPECTION REPORT",
            f"Generated: {snapshot['timestamp']}",
            f"Level: {snapshot['level_name']}",
            "=" * 60,
            "",
            "CAMERA:",
            f"  Location: {snapshot['camera']['location']}",
            f"  Rotation: {snapshot['camera']['rotation']}",
            "",
            "STATISTICS:",
            f"  Total Actors: {snapshot['statistics']['total_actors']}",
            f"  Total Lights: {snapshot['statistics']['total_lights']}",
            "",
            "ACTOR TYPES:",
        ]
        
        for actor_type, count in snapshot['statistics']['actor_types'].items():
            lines.append(f"  {actor_type}: {count}")
        
        lines.extend([
            "",
            "LIGHTS:",
        ])
        
        for light in snapshot['lights']:
            lines.append(f"  {light['label']} ({light['type']})")
            if 'intensity' in light:
                lines.append(f"    Intensity: {light['intensity']}")
            if 'color' in light:
                lines.append(f"    Color: RGB({light['color'][0]:.2f}, {light['color'][1]:.2f}, {light['color'][2]:.2f})")
        
        lines.append("=" * 60)
        
        report = "\n".join(lines)
        
        if output_path:
            with open(output_path, 'w') as f:
                f.write(report)
            unreal.log(f"Scene report saved to: {output_path}")
        
        return report
    
    # =========================================================================
    # Private Helper Methods
    # =========================================================================
    
    def _get_all_actors(self) -> List[unreal.Actor]:
        """Get all actors using subsystem if available"""
        try:
            return EditorSubsystems.get_all_actors()
        except:
            return unreal.EditorLevelLibrary.get_all_level_actors()
    
    def _get_level_name(self) -> str:
        """Get current level name"""
        try:
            world = unreal.EditorLevelLibrary.get_editor_world()
            return world.get_name() if world else "Unknown"
        except:
            return "Unknown"
    
    def _get_camera_state(self) -> Dict:
        """Get viewport camera state"""
        try:
            location, rotation = EditorSubsystems.get_viewport_camera_info()
            return {
                'location': self._vector_to_list(location),
                'rotation': self._rotator_to_list(rotation)
            }
        except:
            return {
                'location': [0, 0, 0],
                'rotation': [0, 0, 0]
            }
    
    def _is_system_actor(self, actor: unreal.Actor) -> bool:
        """Check if actor is a system/persistent actor"""
        system_classes = [
            'LevelBounds', 'WorldSettings', 'DefaultPhysicsVolume',
            'WorldDataLayers', 'AbstractNavData'
        ]
        try:
            return actor.get_class().get_name() in system_classes
        except:
            return True
    
    def _is_light_actor(self, actor: unreal.Actor) -> bool:
        """Check if actor is a light"""
        try:
            return 'Light' in actor.get_class().get_name()
        except:
            return False
    
    def _export_actor_data(self, actor: unreal.Actor) -> Optional[Dict]:
        """Export full actor data"""
        try:
            location = actor.get_actor_location()
            rotation = actor.get_actor_rotation()
            scale = actor.get_actor_scale3d()
            
            data = {
                'label': actor.get_actor_label(),
                'type': actor.get_class().get_name(),
                'location': self._vector_to_list(location),
                'rotation': self._rotator_to_list(rotation),
                'scale': self._vector_to_list(scale)
            }
            
            # Add light-specific data
            if self._is_light_actor(actor):
                light_comp = self._get_light_component(actor)
                if light_comp:
                    data['intensity'] = light_comp.intensity
                    color = light_comp.get_light_color()
                    data['color'] = [color.r, color.g, color.b]
            
            return data
        except Exception as e:
            unreal.log_warning(f"Could not export actor: {e}")
            return None
    
    def _get_light_component(self, actor: unreal.Actor):
        """Get the light component from a light actor"""
        class_name = actor.get_class().get_name()
        
        component_map = {
            'DirectionalLight': unreal.DirectionalLightComponent,
            'PointLight': unreal.PointLightComponent,
            'SpotLight': unreal.SpotLightComponent,
            'SkyLight': unreal.SkyLightComponent,
        }
        
        for light_class, comp_class in component_map.items():
            if light_class in class_name:
                return actor.get_component_by_class(comp_class)
        
        return None
    
    def _count_actor_types(self, actors: List[unreal.Actor]) -> Dict[str, int]:
        """Count actors by type"""
        counts = {}
        for actor in actors:
            try:
                class_name = actor.get_class().get_name()
                counts[class_name] = counts.get(class_name, 0) + 1
            except:
                continue
        return counts
    
    def _vector_to_list(self, vec: unreal.Vector) -> List[float]:
        """Convert Vector to list"""
        return [vec.x, vec.y, vec.z]
    
    def _rotator_to_list(self, rot: unreal.Rotator) -> List[float]:
        """Convert Rotator to list"""
        return [rot.pitch, rot.yaw, rot.roll]
    
    def _colors_match(self, actual: unreal.LinearColor, expected: List[float], tolerance: float = 0.01) -> bool:
        """Check if colors match within tolerance"""
        return (
            abs(actual.r - expected[0]) < tolerance and
            abs(actual.g - expected[1]) < tolerance and
            abs(actual.b - expected[2]) < tolerance
        )


# =============================================================================
# Convenience Functions
# =============================================================================

def inspect_scene() -> Dict:
    """Quick function to inspect current scene"""
    inspector = SceneInspector()
    return inspector.get_scene_snapshot()


def print_scene_report():
    """Print a scene report to the log"""
    inspector = SceneInspector()
    report = inspector.generate_report()
    for line in report.split('\n'):
        unreal.log(line)


def verify_light_color(light_label: str, expected_color: List[float]) -> bool:
    """
    Quickly verify a light has the expected color.
    
    Args:
        light_label: The label of the light actor
        expected_color: Expected RGB values [r, g, b]
        
    Returns:
        bool: True if color matches
    """
    inspector = SceneInspector()
    
    # Find the light
    for light in inspector.get_light_summary():
        if light['label'] == light_label:
            actual = light.get('color', [0, 0, 0])
            return inspector._colors_match(
                unreal.LinearColor(*actual),
                expected_color
            )
    
    unreal.log_warning(f"Light not found: {light_label}")
    return False
